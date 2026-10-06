// Lumora.app: lanzador. Arranca el puente (bridge.py), espera a que responda y abre lumora.
import AppKit
import Foundation

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
    var avisoTools = ""

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
        for sig in [SIGTERM, SIGINT, SIGHUP] {
            signal(sig, SIG_IGN)
            let s = DispatchSource.makeSignalSource(signal: sig, queue: .main)
            s.setEventHandler { NSApp.terminate(nil) }
            s.resume()
            sources.append(s)
        }
        setStatus("iniciando…")
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
        m.addItem(mi("ver permisos", #selector(verPermisos), ""))
        m.addItem(mi("mostrar el registro", #selector(verRegistro), ""))
        m.addItem(mi("acerca de lumora", #selector(acerca), ""))
        m.addItem(.separator())
        m.addItem(mi("salir", #selector(salir), "q"))
        item.menu = m
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
        NSWorkspace.shared.open(url)
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
