// tomador: toma el audio que suena en el Mac (Spotify, Música, el navegador...) con un tap de Core Audio,
// lo silencia en su salida original y lo emite por stdout para que lumora lo procese y lo devuelva.
// formato de salida: 4 bytes float32 (frecuencia de muestreo) y después float32 estéreo intercalado, sin fin.
//   tomador                 todo el audio salvo el de lumora
//   tomador --solo spotify  solo los procesos cuyo identificador contiene ese texto
//   tomador --lista         imprime los procesos que suenan
// salida 3 si macOS no concede el permiso de grabación de audio del sistema.
import Foundation
import CoreAudio
import AudioToolbox

setvbuf(stdout, nil, _IOFBF, 1 << 16)
func fallo(_ m: String, _ code: Int32 = 1) -> Never { FileHandle.standardError.write(Data((m + "\n").utf8)); exit(code) }

func leer<T>(_ obj: AudioObjectID, _ sel: AudioObjectPropertySelector, _ vacio: T) -> T? {
    var a = AudioObjectPropertyAddress(mSelector: sel, mScope: kAudioObjectPropertyScopeGlobal, mElement: kAudioObjectPropertyElementMain)
    var v = vacio, n = UInt32(MemoryLayout<T>.size)
    return AudioObjectGetPropertyData(obj, &a, 0, nil, &n, &v) == noErr ? v : nil
}

struct Proceso { let id: AudioObjectID; let pid: pid_t; let bundle: String; let sonando: Bool }

func procesos() -> [Proceso] {
    var a = AudioObjectPropertyAddress(mSelector: kAudioHardwarePropertyProcessObjectList, mScope: kAudioObjectPropertyScopeGlobal, mElement: kAudioObjectPropertyElementMain)
    var n: UInt32 = 0
    guard AudioObjectGetPropertyDataSize(AudioObjectID(kAudioObjectSystemObject), &a, 0, nil, &n) == noErr else { return [] }
    var ids = [AudioObjectID](repeating: 0, count: Int(n) / MemoryLayout<AudioObjectID>.size)
    guard AudioObjectGetPropertyData(AudioObjectID(kAudioObjectSystemObject), &a, 0, nil, &n, &ids) == noErr else { return [] }
    return ids.map { id in
        let pid: pid_t = leer(id, kAudioProcessPropertyPID, pid_t(0)) ?? 0
        let b: CFString? = leer(id, kAudioProcessPropertyBundleID, "" as CFString)
        let run: UInt32 = leer(id, kAudioProcessPropertyIsRunningOutput, UInt32(0)) ?? 0
        return Proceso(id: id, pid: pid, bundle: (b as String?) ?? "", sonando: run != 0)
    }
}

let args = CommandLine.arguments
if args.contains("--lista") {
    for p in procesos() { print("\(p.pid)\t\(p.bundle)\t\(p.sonando ? "suena" : "-")") }
    exit(0)
}
let solo = args.firstIndex(of: "--solo").flatMap { $0 + 1 < args.count ? args[$0 + 1].lowercased() : nil }

// el audio de la propia lumora (WebKit incluido) no entra: se silenciaría y el sonido procesado no se oiría
func propio(_ p: Proceso) -> Bool {
    let b = p.bundle.lowercased()
    return p.pid == getpid() || b.contains("lumora") || b.hasPrefix("com.apple.webkit")
}
let todos = procesos()
let desc: CATapDescription
if let solo = solo {
    let ids = todos.filter { $0.bundle.lowercased().contains(solo) && !propio($0) }.map { $0.id }
    guard !ids.isEmpty else { fallo("ningún proceso de audio coincide con \"\(solo)\"", 4) }
    desc = CATapDescription(stereoMixdownOfProcesses: ids)
} else {
    desc = CATapDescription(stereoGlobalTapButExcludeProcesses: todos.filter(propio).map { $0.id })
}
desc.name = "lumora"
desc.isPrivate = true
desc.muteBehavior = .muted

var tap = AudioObjectID(kAudioObjectUnknown)
let st = AudioHardwareCreateProcessTap(desc, &tap)
guard st == noErr else { fallo("no se pudo crear el tap de audio (\(st)); falta el permiso de audio del sistema", 3) }

var agg = AudioObjectID(kAudioObjectUnknown)
var proc: AudioDeviceIOProcID?
func limpiar() {
    if let p = proc, agg != kAudioObjectUnknown { AudioDeviceStop(agg, p); AudioDeviceDestroyIOProcID(agg, p) }
    if agg != kAudioObjectUnknown { AudioHardwareDestroyAggregateDevice(agg) }
    if tap != kAudioObjectUnknown { AudioHardwareDestroyProcessTap(tap) }   // al destruir el tap, el audio original vuelve a sonar
}

let salida: CFString? = leer(AudioObjectID(kAudioObjectSystemObject), kAudioHardwarePropertyDefaultSystemOutputDevice, AudioObjectID(0)).flatMap { dev in
    leer(dev, kAudioDevicePropertyDeviceUID, "" as CFString)
}
var dic: [String: Any] = [
    kAudioAggregateDeviceNameKey: "lumora tap",
    kAudioAggregateDeviceUIDKey: UUID().uuidString,
    kAudioAggregateDeviceIsPrivateKey: true,
    kAudioAggregateDeviceIsStackedKey: false,
    kAudioAggregateDeviceTapAutoStartKey: true,
    kAudioAggregateDeviceTapListKey: [[kAudioSubTapUIDKey: desc.uuid.uuidString, kAudioSubTapDriftCompensationKey: true]],
]
if let s = salida as String?, !s.isEmpty {
    dic[kAudioAggregateDeviceMainSubDeviceKey] = s
    dic[kAudioAggregateDeviceSubDeviceListKey] = [[kAudioSubDeviceUIDKey: s]]
}
guard AudioHardwareCreateAggregateDevice(dic as CFDictionary, &agg) == noErr else { limpiar(); fallo("no se pudo crear el dispositivo del tap") }

var fmt: AudioStreamBasicDescription = leer(tap, kAudioTapPropertyFormat, AudioStreamBasicDescription()) ?? AudioStreamBasicDescription()
// el dispositivo agregado corre al reloj de la salida, que puede diferir de la frecuencia declarada por el tap
let nominal: Float64 = leer(agg, kAudioDevicePropertyNominalSampleRate, Float64(0)) ?? 0
if args.contains("--diagnostico") { FileHandle.standardError.write(Data("tap \(fmt.mSampleRate) agregado \(nominal)\n".utf8)) }
let rate = Float32(nominal > 0 ? nominal : (fmt.mSampleRate > 0 ? fmt.mSampleRate : 48000))
var cabecera = rate
withUnsafeBytes(of: &cabecera) { _ = fwrite($0.baseAddress, 1, 4, stdout) }
fflush(stdout)

var salidaBuf = [Float32](repeating: 0, count: 8192)
let cola = DispatchQueue(label: "lumora.tap", qos: .userInteractive)
let ok = AudioDeviceCreateIOProcIDWithBlock(&proc, agg, cola) { _, entrada, _, _, _ in
    let lista = UnsafeMutableAudioBufferListPointer(UnsafeMutablePointer(mutating: entrada))
    guard lista.count > 0 else { return }
    let bufs = Array(lista)
    var frames = 0, canales = 0
    if bufs.count >= 2 {                                  // planar: un buffer por canal
        canales = 2; frames = Int(bufs[0].mDataByteSize) / 4
    } else {
        canales = max(1, Int(bufs[0].mNumberChannels)); frames = Int(bufs[0].mDataByteSize) / 4 / canales
    }
    if frames == 0 { return }
    if salidaBuf.count < frames * 2 { salidaBuf = [Float32](repeating: 0, count: frames * 2) }
    for i in 0..<frames {
        let l: Float32, r: Float32
        if bufs.count >= 2 {
            l = bufs[0].mData!.assumingMemoryBound(to: Float32.self)[i]; r = bufs[1].mData!.assumingMemoryBound(to: Float32.self)[i]
        } else {
            let d = bufs[0].mData!.assumingMemoryBound(to: Float32.self)
            l = d[i * canales]; r = canales > 1 ? d[i * canales + 1] : l
        }
        salidaBuf[i * 2] = l; salidaBuf[i * 2 + 1] = r
    }
    let escritos = salidaBuf.withUnsafeBytes { fwrite($0.baseAddress, 1, frames * 8, stdout) }
    fflush(stdout)
    if escritos < frames * 8 { limpiar(); exit(0) }       // el lector se fue
}
guard ok == noErr else { limpiar(); fallo("no se pudo iniciar la lectura del tap") }
guard AudioDeviceStart(agg, proc) == noErr else { limpiar(); fallo("no se pudo arrancar el tap") }

// al terminar, siempre destruir el tap: si no, el audio quedaría silenciado
var fuentes: [DispatchSourceSignal] = []
for s in [SIGTERM, SIGINT, SIGHUP, SIGPIPE] {
    signal(s, SIG_IGN)
    let fuente = DispatchSource.makeSignalSource(signal: s, queue: .main)
    fuente.setEventHandler { limpiar(); exit(0) }
    fuente.resume(); fuentes.append(fuente)
}
dispatchMain()
