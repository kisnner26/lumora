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
let excluded = args.enumerated().compactMap { i, arg in
    arg == "--exclude-bundle" && i + 1 < args.count ? args[i + 1].lowercased() : nil
}

// el audio de la propia lumora (WebKit incluido) no entra: se silenciaría y el sonido procesado no se oiría
func propio(_ p: Proceso) -> Bool {
    let b = p.bundle.lowercased()
    return p.pid == getpid() || b.contains("lumora") || b.hasPrefix("com.apple.webkit") || excluded.contains { b == $0 || b.hasPrefix($0 + ".") }
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
// conserva la salida original hasta que otro cliente lea realmente el tap.
desc.muteBehavior = .mutedWhenTapped

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

// el callback de Core Audio solo copia a memoria preasignada; el pipe puede bloquear al escritor, nunca al reloj de audio.
final class SalidaPCM {
    private let slots = 8, maxFrames = 16384
    private let lock = NSLock(), available = DispatchSemaphore(value: 0), started = DispatchSemaphore(value: 0)
    private var buffers: [UnsafeMutablePointer<Float32>]
    private var sizes = [Int](repeating: 0, count: 8)
    private var read = 0, write = 0, pending = 0

    init() {
        let capacity = maxFrames * 2
        buffers = (0..<slots).map { _ in UnsafeMutablePointer<Float32>.allocate(capacity: capacity) }
        DispatchQueue(label: "lumora.pipe", qos: .userInitiated).async { [self] in
            started.wait()
            while true {
                available.wait()
                lock.lock(); let index = read, size = sizes[index]; lock.unlock()
                let written = fwrite(buffers[index], 1, size, stdout)
                if written != size || fflush(stdout) != 0 { kill(getpid(), SIGTERM); return }
                lock.lock(); read = (read + 1) % slots; pending -= 1; lock.unlock()
            }
        }
    }

    func start(rate: Float32) {
        var header = rate
        withUnsafeBytes(of: &header) { _ = fwrite($0.baseAddress, 1, 4, stdout) }
        fflush(stdout)
        started.signal()
    }

    func push(_ bufs: UnsafeMutableAudioBufferListPointer) {
        guard !bufs.isEmpty, let data = bufs[0].mData else { return }
        let channels = max(1, Int(bufs[0].mNumberChannels)), planar = channels == 1 && bufs.count > 1
        var frames = Int(bufs[0].mDataByteSize) / 4 / channels
        if planar { frames = min(frames, Int(bufs[1].mDataByteSize) / 4 / max(1, Int(bufs[1].mNumberChannels))) }
        guard frames > 0, frames <= maxFrames, !planar || bufs[1].mData != nil, lock.try() else { return }
        guard pending < slots else { lock.unlock(); return }  // lector atrasado: se descarta el bloque, no se bloquea Core Audio
        let output = buffers[write], left = data.assumingMemoryBound(to: Float32.self)
        let right = planar ? bufs[1].mData!.assumingMemoryBound(to: Float32.self) : left
        let rightStride = planar ? max(1, Int(bufs[1].mNumberChannels)) : channels
        for i in 0..<frames {
            output[i * 2] = left[i * channels]
            output[i * 2 + 1] = planar ? right[i * rightStride] : left[i * channels + (channels > 1 ? 1 : 0)]
        }
        sizes[write] = frames * 8; write = (write + 1) % slots; pending += 1
        lock.unlock(); available.signal()
    }
}
let writer = SalidaPCM()
// al terminar, siempre destruir el tap: si no, el audio quedaría silenciado
var fuentes: [DispatchSourceSignal] = []
for s in [SIGTERM, SIGINT, SIGHUP, SIGPIPE] {
    signal(s, SIG_IGN)
    let fuente = DispatchSource.makeSignalSource(signal: s, queue: .main)
    fuente.setEventHandler { limpiar(); exit(0) }
    fuente.resume(); fuentes.append(fuente)
}
DispatchQueue.global(qos: .userInitiated).async {
let ok = AudioDeviceCreateIOProcIDWithBlock(&proc, agg, nil) { _, entrada, _, _, _ in
    writer.push(UnsafeMutableAudioBufferListPointer(UnsafeMutablePointer(mutating: entrada)))
}
guard ok == noErr else { limpiar(); fallo("no se pudo iniciar la lectura del tap") }

guard AudioDeviceStart(agg, proc) == noErr else { limpiar(); fallo("no se pudo arrancar el tap") }
writer.start(rate: rate)
}
dispatchMain()
