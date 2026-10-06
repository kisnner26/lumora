// Lumora.app: lanzador. Arranca el puente (bridge.py), espera a que responda y abre lumora.
import AppKit
import Foundation
import WebKit

let bundleId = "com.kisnner.lumora"
let res = Bundle.main.resourcePath ?? "."
let logDir = NSString(string: "~/Library/Logs/Lumora").expandingTildeInPath
let logPath = logDir + "/lumora.log"
let portFile = NSString(string: "~/Library/Application Support/Lumora/puerto").expandingTildeInPath

func log(_ m: String) {
    let f = DateFormatter(); f.dateFormat = "yyyy-MM-dd HH:mm:ss"
    let line = "[\(f.string(from: Date()))] [app] \(m)\n"
    if let h = logHandle() { h.write(line.data(using: .utf8)!); h.closeFile() }
}

// descriptor en modo append: el puente y la app escriben en el mismo archivo sin pisarse
func logHandle() -> FileHandle? {
    let fd = open(logPath, O_WRONLY | O_APPEND | O_CREAT, 0o644)
    return fd < 0 ? nil : FileHandle(fileDescriptor: fd, closeOnDealloc: true)
}

func rotateLog() {
    try? FileManager.default.createDirectory(atPath: logDir, withIntermediateDirectories: true)
    let attrs = try? FileManager.default.attributesOfItem(atPath: logPath)
    if let size = attrs?[.size] as? Int, size > 2_000_000 {
        try? FileManager.default.removeItem(atPath: logPath + ".1")
        try? FileManager.default.moveItem(atPath: logPath, toPath: logPath + ".1")
    }
    if !FileManager.default.fileExists(atPath: logPath) { FileManager.default.createFile(atPath: logPath, contents: nil) }
}

func run(_ path: String, _ args: [String]) -> (Int32, String) {
    let p = Process(); p.executableURL = URL(fileURLWithPath: path); p.arguments = args
    let out = Pipe(); p.standardOutput = out; p.standardError = Pipe()
    do { try p.run() } catch { return (-1, "") }
    let d = out.fileHandleForReading.readDataToEndOfFile(); p.waitUntilExit()
    return (p.terminationStatus, String(data: d, encoding: .utf8) ?? "")
}

// GET síncrono con tiempo máximo corto; devuelve el JSON o nil
func getJSON(_ url: String, timeout: TimeInterval = 1.0) -> [String: Any]? {
    guard let u = URL(string: url) else { return nil }
    var req = URLRequest(url: u); req.timeoutInterval = timeout
    let sem = DispatchSemaphore(value: 0)
    var result: [String: Any]?
    URLSession.shared.dataTask(with: req) { d, r, _ in
        if let d = d, (r as? HTTPURLResponse)?.statusCode == 200 { result = (try? JSONSerialization.jsonObject(with: d)) as? [String: Any] }
        sem.signal()
    }.resume()
    _ = sem.wait(timeout: .now() + timeout + 0.5)
    return result
}

func salud(_ port: Int) -> [String: Any]? {
    if let j = getJSON("http://127.0.0.1:\(port)/salud"), j["lumora"] as? Bool == true { return j }
    return nil
}

func findExistingBridge() -> Int? {
    for p in 8888..<8908 { if salud(p) != nil { return p } }
    return nil
}

func findPython() -> String? {
    let fm = FileManager.default
    var c = [res + "/python/bin/python3"]
    // /usr/bin/python3 solo sirve si hay herramientas de línea de comandos (si no, el sistema abre un diálogo de instalación)
    if run("/usr/bin/xcode-select", ["-p"]).0 == 0 { c.append("/usr/bin/python3") }
    c += ["/opt/homebrew/bin/python3", "/usr/local/bin/python3"]
    return c.first { fm.isExecutableFile(atPath: $0) }
}

// ---------- ventana propia (WKWebView) ----------
final class Ventana: NSObject, NSWindowDelegate, WKNavigationDelegate, WKUIDelegate, WKDownloadDelegate {
    var window: NSWindow!
    var web: WKWebView!
    var url: URL?
    var descargas: [WKDownload: URL] = [:]
    var cargada: (() -> Void)?

    override init() {
        super.init()
        let cfg = WKWebViewConfiguration()
        cfg.mediaTypesRequiringUserActionForPlayback = []
        cfg.preferences.isElementFullscreenEnabled = true
        cfg.preferences.javaScriptCanOpenWindowsAutomatically = false
        web = WKWebView(frame: .zero, configuration: cfg)
        web.navigationDelegate = self
        web.uiDelegate = self
        if #available(macOS 13.3, *) { web.isInspectable = false }
        window = NSWindow(contentRect: NSRect(x: 0, y: 0, width: 1280, height: 800), styleMask: [.titled, .closable, .miniaturizable, .resizable],
                          backing: .buffered, defer: false)
        window.title = "lumora"
        window.contentView = web
        window.delegate = self
        window.isReleasedWhenClosed = false
        window.setFrameAutosaveName("lumora-ventana")
        window.collectionBehavior = [.fullScreenPrimary]
        window.backgroundColor = .black
        window.center()
    }

    func mostrar(_ u: URL) {
        if url != u { url = u; web.load(URLRequest(url: u)) }
        window.makeKeyAndOrderFront(nil)
        NSApp.activate(ignoringOtherApps: true)
    }
    func windowShouldClose(_ sender: NSWindow) -> Bool { window.orderOut(nil); return false }   // cerrar la ventana no cierra la app

    // navegación: enlaces externos al navegador, blobs y adjuntos como descarga
    func webView(_ w: WKWebView, decidePolicyFor a: WKNavigationAction, decisionHandler: @escaping (WKNavigationActionPolicy) -> Void) {
        if a.shouldPerformDownload { decisionHandler(.download); return }
        if let u = a.request.url, let host = u.host, u.scheme?.hasPrefix("http") == true, host != "127.0.0.1", host != "localhost", a.navigationType == .linkActivated {
            NSWorkspace.shared.open(u); decisionHandler(.cancel); return
        }
        decisionHandler(.allow)
    }
    func webView(_ w: WKWebView, decidePolicyFor r: WKNavigationResponse, decisionHandler: @escaping (WKNavigationResponsePolicy) -> Void) {
        decisionHandler(r.canShowMIMEType ? .allow : .download)
    }
    func webView(_ w: WKWebView, navigationAction a: WKNavigationAction, didBecome d: WKDownload) { d.delegate = self }
    func webView(_ w: WKWebView, navigationResponse r: WKNavigationResponse, didBecome d: WKDownload) { d.delegate = self }
    func webView(_ w: WKWebView, didFinish n: WKNavigation!) { cargada?(); cargada = nil }
    func webViewWebContentProcessDidTerminate(_ w: WKWebView) { log("el proceso de la página se cerró, recargo"); w.reload() }

    // descargas a ~/Descargas sin pisar archivos
    func download(_ d: WKDownload, decideDestinationUsing r: URLResponse, suggestedFilename name: String, completionHandler: @escaping (URL?) -> Void) {
        let dir = FileManager.default.urls(for: .downloadsDirectory, in: .userDomainMask).first!
        var dest = dir.appendingPathComponent(name.isEmpty ? "lumora" : name)
        var n = 1
        let base = dest.deletingPathExtension().lastPathComponent, ext = dest.pathExtension
        while FileManager.default.fileExists(atPath: dest.path) {
            dest = dir.appendingPathComponent("\(base) \(n)" + (ext.isEmpty ? "" : ".\(ext)")); n += 1
        }
        descargas[d] = dest
        completionHandler(dest)
    }
    func downloadDidFinish(_ d: WKDownload) {
        if let u = descargas.removeValue(forKey: d) { log("descargado: \(u.path)"); NSWorkspace.shared.activateFileViewerSelecting([u]) }
    }
    func download(_ d: WKDownload, didFailWithError e: Error, resumeData: Data?) { descargas[d] = nil; log("descarga fallida: \(e.localizedDescription)") }

    // permisos y diálogos de la página
    func webView(_ w: WKWebView, requestMediaCapturePermissionFor o: WKSecurityOrigin, initiatedByFrame f: WKFrameInfo, type: WKMediaCaptureType,
                 decisionHandler: @escaping (WKPermissionDecision) -> Void) { decisionHandler(o.host == "127.0.0.1" ? .grant : .deny) }
    func webView(_ w: WKWebView, runOpenPanelWith p: WKOpenPanelParameters, initiatedByFrame f: WKFrameInfo, completionHandler: @escaping ([URL]?) -> Void) {
        let o = NSOpenPanel(); o.allowsMultipleSelection = p.allowsMultipleSelection; o.canChooseDirectories = p.allowsDirectories
        o.begin { completionHandler($0 == .OK ? o.urls : nil) }
    }
    func webView(_ w: WKWebView, runJavaScriptAlertPanelWithMessage m: String, initiatedByFrame f: WKFrameInfo, completionHandler: @escaping () -> Void) {
        let a = NSAlert(); a.messageText = m; a.addButton(withTitle: "ok"); a.runModal(); completionHandler()
    }
    func webView(_ w: WKWebView, runJavaScriptConfirmPanelWithMessage m: String, initiatedByFrame f: WKFrameInfo, completionHandler: @escaping (Bool) -> Void) {
        let a = NSAlert(); a.messageText = m; a.addButton(withTitle: "aceptar"); a.addButton(withTitle: "cancelar"); completionHandler(a.runModal() == .alertFirstButtonReturn)
    }
    func webView(_ w: WKWebView, createWebViewWith c: WKWebViewConfiguration, for a: WKNavigationAction, windowFeatures: WKWindowFeatures) -> WKWebView? {
        if let u = a.request.url { NSWorkspace.shared.open(u) }; return nil       // window.open y target=_blank van al navegador
    }
}

final class AppDelegate: NSObject, NSApplicationDelegate {
    var item: NSStatusItem!
    var statusLine: NSMenuItem!
    var child: Process?
    var port: Int?
    var ownsBridge = false
    var stopping = false
    var restarts: [Date] = []
    var timer: Timer?
    var ready = false
    var autoprueba = false
    var avisoTools = ""
    var ventana: Ventana?
    var modoItem: NSMenuItem!
    var enVentana: Bool {
        get { UserDefaults.standard.object(forKey: "abrirEnVentana") as? Bool ?? true }
        set { UserDefaults.standard.set(newValue, forKey: "abrirEnVentana") }
    }

    func applicationDidFinishLaunching(_ n: Notification) {
        rotateLog()
        let others = NSRunningApplication.runningApplications(withBundleIdentifier: bundleId).filter { $0 != NSRunningApplication.current }
        if !others.isEmpty {                                    // una sola instancia: la que ya corre abre lumora
            DistributedNotificationCenter.default().postNotificationName(.init("com.kisnner.lumora.abrir"), object: nil)
            log("segunda instancia, salgo")
            exit(0)
        }
        DistributedNotificationCenter.default().addObserver(forName: .init("com.kisnner.lumora.abrir"), object: nil, queue: .main) { [weak self] _ in self?.abrir() }
        buildMenu()
        mainMenu()
        for sig in [SIGTERM, SIGINT, SIGHUP] {
            signal(sig, SIG_IGN)
            let s = DispatchSource.makeSignalSource(signal: sig, queue: .main)
            s.setEventHandler { NSApp.terminate(nil) }
            s.resume()
            sources.append(s)
        }
        setStatus("iniciando…")
        if ProcessInfo.processInfo.environment["LUMORA_AUTOPRUEBA"] != nil { enVentana = true; autoprueba = true }
        DispatchQueue.global().async { self.arrancar(abrirAlTerminar: true) }
        timer = Timer.scheduledTimer(withTimeInterval: 3, repeats: true) { [weak self] _ in
            DispatchQueue.global().async { self?.vigilar() }
        }
    }
    var sources: [DispatchSourceSignal] = []

    func buildMenu() {
        item = NSStatusBar.system.statusItem(withLength: NSStatusItem.squareLength)
        item.button?.image = icono()
        item.button?.toolTip = "lumora"
        let m = NSMenu()
        statusLine = NSMenuItem(title: "iniciando…", action: nil, keyEquivalent: ""); statusLine.isEnabled = false
        m.addItem(statusLine)
        m.addItem(.separator())
        m.addItem(mi("abrir lumora", #selector(abrirMenu), "o"))
        modoItem = mi(enVentana ? "abrir en: ventana propia" : "abrir en: navegador", #selector(cambiarModo), "")
        m.addItem(modoItem)
        m.addItem(mi("ver permisos", #selector(verPermisos), ""))
        m.addItem(mi("mostrar el registro", #selector(verRegistro), ""))
        m.addItem(mi("acerca de lumora", #selector(acerca), ""))
        m.addItem(.separator())
        m.addItem(mi("salir", #selector(salir), "q"))
        item.menu = m
    }
    func mainMenu() {
        let bar = NSMenu()
        let app = NSMenuItem(); bar.addItem(app)
        let am = NSMenu(); app.submenu = am
        am.addItem(withTitle: "salir de lumora", action: #selector(salir), keyEquivalent: "q").target = self
        let ed = NSMenuItem(); bar.addItem(ed)
        let em = NSMenu(title: "edición"); ed.submenu = em
        em.addItem(withTitle: "copiar", action: #selector(NSText.copy(_:)), keyEquivalent: "c")
        em.addItem(withTitle: "pegar", action: #selector(NSText.paste(_:)), keyEquivalent: "v")
        em.addItem(withTitle: "seleccionar todo", action: #selector(NSText.selectAll(_:)), keyEquivalent: "a")
        let vt = NSMenuItem(); bar.addItem(vt)
        let vm = NSMenu(title: "ventana"); vt.submenu = vm
        vm.addItem(withTitle: "cerrar ventana", action: #selector(NSWindow.performClose(_:)), keyEquivalent: "w")
        vm.addItem(withTitle: "minimizar", action: #selector(NSWindow.performMiniaturize(_:)), keyEquivalent: "m")
        vm.addItem(withTitle: "pantalla completa", action: #selector(NSWindow.toggleFullScreen(_:)), keyEquivalent: "f").keyEquivalentModifierMask = [.command, .control]
        NSApp.mainMenu = bar
    }
    func mi(_ t: String, _ a: Selector, _ k: String) -> NSMenuItem { let i = NSMenuItem(title: t, action: a, keyEquivalent: k); i.target = self; return i }

    func icono() -> NSImage {
        let img = NSImage(size: NSSize(width: 18, height: 18), flipped: false) { r in
            NSColor.black.setFill()
            NSBezierPath(ovalIn: NSRect(x: 5, y: 5, width: 8, height: 8)).fill()
            let rays = NSBezierPath(); rays.lineWidth = 1.4; rays.lineCapStyle = .round
            for i in 0..<8 {
                let a = Double(i) * .pi / 4
                rays.move(to: NSPoint(x: 9 + cos(a) * 6.2, y: 9 + sin(a) * 6.2))
                rays.line(to: NSPoint(x: 9 + cos(a) * 8.2, y: 9 + sin(a) * 8.2))
            }
            NSColor.black.setStroke(); rays.stroke()
            return true
        }
        img.isTemplate = true
        return img
    }

    func setStatus(_ t: String) { DispatchQueue.main.async { self.statusLine?.title = t } }

    func alerta(_ titulo: String, _ texto: String) {
        DispatchQueue.main.async {
            NSApp.activate(ignoringOtherApps: true)
            let a = NSAlert(); a.messageText = titulo; a.informativeText = texto; a.addButton(withTitle: "entendido"); a.runModal()
        }
    }

    // ---------- puente ----------
    func arrancar(abrirAlTerminar: Bool) {
        if let p = findExistingBridge() {                       // ya hay un puente de lumora: se reutiliza
            port = p; ownsBridge = false; ready = true
            log("reutilizo el puente que ya corre en el puerto \(p)")
            setStatus("lumora lista"); if abrirAlTerminar { abrir() }; return
        }
        guard let py = findPython() else {
            setStatus("error: falta python 3")
            log("no hay python 3")
            alerta("falta python 3", "lumora necesita python 3 para hablar con música y spotify.\n\nabre la terminal y escribe:\n\nxcode-select --install\n\ncuando termine, abre lumora otra vez.")
            return
        }
        let bridge = res + "/bridge/bridge.py"
        guard FileManager.default.fileExists(atPath: bridge) else {
            setStatus("error: falta bridge.py"); log("no existe \(bridge)"); alerta("instalación incompleta", "no encuentro el puente de lumora dentro de la aplicación. vuelve a descargarla."); return
        }
        let tools = res + "/tools"
        var faltan: [String] = []
        if !FileManager.default.isExecutableFile(atPath: tools + "/oido") { faltan.append("audio del sistema") }
        if !FileManager.default.isExecutableFile(atPath: tools + "/traducir") { faltan.append("traducción en el dispositivo") }
        avisoTools = faltan.isEmpty ? "" : "sin: " + faltan.joined(separator: ", ")
        try? FileManager.default.removeItem(atPath: portFile)
        let p = Process()
        p.executableURL = URL(fileURLWithPath: py)
        p.arguments = ["-u", bridge]
        var env = ProcessInfo.processInfo.environment
        env["LUMORA_ROOT"] = res + "/web"
        env["LUMORA_TOOLS"] = tools
        env["LUMORA_PARENT"] = String(getpid())
        env["PYTHONDONTWRITEBYTECODE"] = "1"
        p.environment = env
        p.currentDirectoryURL = URL(fileURLWithPath: NSHomeDirectory())
        if let h = logHandle() { p.standardOutput = h; p.standardError = h }
        p.terminationHandler = { [weak self] pr in
            log("el puente terminó (código \(pr.terminationStatus))")
            DispatchQueue.global().async { self?.puenteTermino(pr) }
        }
        do { try p.run() } catch { setStatus("error: no pude arrancar el puente"); log("run falló: \(error)"); alerta("no pude arrancar lumora", "\(error.localizedDescription)\n\nrevisa el registro desde el menú."); return }
        child = p; ownsBridge = true
        log("puente arrancado con \(py), pid \(p.processIdentifier)")
        // esperar a que escriba el puerto y responda /salud (20 s máximo)
        let limite = Date().addingTimeInterval(20)
        while Date() < limite {
            if let s = try? String(contentsOfFile: portFile, encoding: .utf8), let pt = Int(s.trimmingCharacters(in: .whitespacesAndNewlines)), salud(pt) != nil {
                port = pt; ready = true
                log("puente listo en el puerto \(pt)")
                setStatus("lumora lista"); if abrirAlTerminar { abrir() }; return
            }
            if !(child?.isRunning ?? false) { break }
            Thread.sleep(forTimeInterval: 0.25)
        }
        if child?.isRunning ?? false {
            setStatus("error: el puente no responde"); log("sin respuesta de /salud en 20 s")
            alerta("lumora no responde", "el puente tardó demasiado en arrancar. abre el registro desde el menú para ver el motivo.")
        }
    }

    func puenteTermino(_ pr: Process) {
        if stopping { return }
        ready = false
        // código 0 con puerto ocupado por otro lumora: se reutiliza
        if let p = findExistingBridge() { port = p; ownsBridge = false; ready = true; setStatus("lumora lista"); return }
        let ahora = Date()
        restarts = restarts.filter { ahora.timeIntervalSince($0) < 60 } + [ahora]
        if restarts.count > 3 { setStatus("error: el puente se cierra solo"); log("demasiados reinicios"); return }
        setStatus("reiniciando el puente…")
        arrancar(abrirAlTerminar: false)
    }

    func vigilar() {
        guard !stopping, ready, let p = port else { return }
        guard let s = salud(p) else {
            if ownsBridge, child?.isRunning ?? false { setStatus("error: el puente no responde") }
            else if !ownsBridge { ready = false; setStatus("reiniciando el puente…"); arrancar(abrirAlTerminar: false) }
            return
        }
        let musica = s["musica"] as? Bool == true, spotify = s["spotify"] as? Bool == true
        var t = (musica || spotify) ? "lumora lista" : "esperando música…"
        if s["ffmpeg"] as? Bool == false { t += " (sin ffmpeg: clips en webm)" }
        if !avisoTools.isEmpty { t += " (\(avisoTools))" }
        setStatus(t)
    }

    // ---------- menú ----------
    func abrir() {
        guard let p = port, let url = URL(string: "http://127.0.0.1:\(p)/index.html") else { return }
        if enVentana {
            DispatchQueue.main.async {
                if self.ventana == nil { self.ventana = Ventana() }
                self.ventana!.mostrar(url)
                if self.autoprueba { self.autoprueba = false; self.correrAutoprueba() }
            }
        } else { NSWorkspace.shared.open(url) }
    }
    func correrAutoprueba() {
        guard let v = ventana else { return }
        v.cargada = {
            DispatchQueue.main.asyncAfter(deadline: .now() + 6) {
                let js = """
                  const r = {};
                  const c = document.createElement('canvas');
                  r.webgl = !!(c.getContext('webgl2') || c.getContext('webgl'));
                  r.mediarecorder = typeof MediaRecorder !== 'undefined';
                  r.mp4 = r.mediarecorder && MediaRecorder.isTypeSupported('video/mp4;codecs=avc1');
                  r.webm = r.mediarecorder && MediaRecorder.isTypeSupported('video/webm');
                  r.clipboard = !!(navigator.clipboard && navigator.clipboard.write);
                  r.fullscreen = !!document.documentElement.requestFullscreen || !!document.documentElement.webkitRequestFullscreen;
                  r.titulo = document.title;
                  r.escenas = document.querySelectorAll('canvas').length;
                  let tecla = 0; addEventListener('keydown', () => tecla++);
                  window.__tecla = () => tecla;
                  const a = document.createElement('a'); a.href = URL.createObjectURL(new Blob(['prueba de descarga'], {type: 'text/plain'})); a.download = 'lumora-prueba.txt';
                  document.body.appendChild(a); a.click();
                  return JSON.stringify(r);
                """
                v.web.callAsyncJavaScript(js, in: nil, in: .page) { res in
                    switch res {
                    case .success(let r): log("autoprueba ventana: \(r)")
                    case .failure(let e): log("autoprueba ventana falló: \(e)")
                    }
                    let tecla = NSEvent.keyEvent(with: .keyDown, location: .zero, modifierFlags: [], timestamp: 0, windowNumber: v.window.windowNumber,
                                                 context: nil, characters: "v", charactersIgnoringModifiers: "v", isARepeat: false, keyCode: 9)!
                    v.window.makeFirstResponder(v.web); v.web.keyDown(with: tecla)
                    v.web.takeSnapshot(with: nil) { img, _ in
                        if let img = img, let tiff = img.tiffRepresentation, let rep = NSBitmapImageRep(data: tiff), let png = rep.representation(using: .png, properties: [:]) {
                            try? png.write(to: URL(fileURLWithPath: "/tmp/lumora-ventana.png")); log("captura de la ventana guardada")
                        }
                        v.web.evaluateJavaScript("window.__tecla()") { n, _ in log("autoprueba teclas recibidas por la página: \(n ?? "?")") }
                    }
                }
            }
        }
    }
    @objc func cambiarModo() {
        enVentana.toggle(); modoItem.title = enVentana ? "abrir en: ventana propia" : "abrir en: navegador"
        if !enVentana { ventana?.window.orderOut(nil) }
    }
    @objc func abrirMenu() {
        if ready { abrir() } else { DispatchQueue.global().async { self.arrancar(abrirAlTerminar: true) } }
    }
    @objc func verPermisos() {
        NSWorkspace.shared.open(URL(string: "x-apple.systempreferences:com.apple.preference.security?Privacy_Automation")!)
    }
    @objc func verRegistro() { NSWorkspace.shared.open(URL(fileURLWithPath: logPath)) }
    @objc func acerca() {
        NSApp.activate(ignoringOtherApps: true)
        let a = NSAlert()
        a.messageText = "lumora"
        a.informativeText = "tu música, hecha luz.\n\nlicencia PolyForm Noncommercial 1.0.0: el uso comercial requiere una licencia aparte. todo corre en tu Mac; no se envía nada a ningún servidor."
        a.addButton(withTitle: "cerrar"); a.runModal()
    }
    @objc func salir() { NSApp.terminate(nil) }

    // ---------- salida limpia ----------
    func limpiar() {
        stopping = true
        timer?.invalidate()
        if let c = child, c.isRunning {
            let pid = c.processIdentifier
            _ = run("/usr/bin/pkill", ["-TERM", "-P", String(pid)])      // osascript, oido, ffmpeg…
            c.terminate()
            let limite = Date().addingTimeInterval(3)
            while c.isRunning && Date() < limite { Thread.sleep(forTimeInterval: 0.05) }
            if c.isRunning { kill(pid, SIGKILL) }
            log("puente detenido")
        }
        try? FileManager.default.removeItem(atPath: portFile)
    }
    func applicationWillTerminate(_ n: Notification) { limpiar() }
}

let app = NSApplication.shared
app.setActivationPolicy(.accessory)
let delegate = AppDelegate()
app.delegate = delegate
app.run()
