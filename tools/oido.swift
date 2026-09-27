// oido: escucha el audio del sistema (ScreenCaptureKit) y emite, ~30 veces por segundo,
// una línea JSON con el volumen, los graves y los agudos. No guarda ni envía audio.
// salida: {"t":<segundos>,"rms":..,"low":..,"high":..}
// y cada ~0,5 s: {"inst":[["piano",0.82],...]} con los instrumentos que reconoce SoundAnalysis (en el dispositivo)
import Foundation
import ScreenCaptureKit
import CoreMedia
import Accelerate
import AVFoundation
import SoundAnalysis

final class Instrumentos: NSObject, SNResultsObserving {
    // etiquetas del clasificador que son instrumentos (verificadas contra knownClassifications)
    let keep = ["piano", "electric_piano", "keyboard_musical", "organ", "harpsichord", "synthesizer", "guitar", "acoustic_guitar", "electric_guitar",
                "guitar_strum", "steel_guitar_slide_guitar", "plucked_string_instrument", "bowed_string_instrument", "bass_guitar", "double_bass",
                "violin_fiddle", "cello", "orchestra", "harp", "ukulele", "banjo", "mandolin", "drum", "drum_kit", "snare_drum", "bass_drum", "cymbal",
                "hi_hat", "tambourine", "saxophone", "trumpet", "trombone", "french_horn", "brass_instrument", "flute", "clarinet", "bassoon",
                "harmonica", "accordion", "marimba_xylophone"]
    func request(_ request: SNRequest, didProduce result: SNResult) {
        guard let r = result as? SNClassificationResult else { return }
        let top = r.classifications.filter { keep.contains($0.identifier) && $0.confidence > 0.15 }.prefix(4)
        let items = top.map { String(format: "[\"%@\",%.2f]", $0.identifier, $0.confidence) }.joined(separator: ",")
        FileHandle.standardOutput.write("{\"inst\":[\(items)]}\n".data(using: .utf8)!)
    }
}

final class Oido: NSObject, SCStreamOutput, SCStreamDelegate {
    let format = AVAudioFormat(commonFormat: .pcmFormatFloat32, sampleRate: 48000, channels: 1, interleaved: false)!
    lazy var analyzer = SNAudioStreamAnalyzer(format: format)
    let inst = Instrumentos()
    var frame: AVAudioFramePosition = 0
    let analysisQueue = DispatchQueue(label: "oido.analisis")
    func setupAnalysis() {
        if let req = try? SNClassifySoundRequest(classifierIdentifier: .version1) {
            req.windowDuration = CMTime(seconds: 1.0, preferredTimescale: 48000)
            req.overlapFactor = 0.5
            try? analyzer.add(req, withObserver: inst)
        }
    }
    var lp1: Float = 0, lp2: Float = 0                      // filtros de un polo: graves (~150 Hz) y medios (~2 kHz)
    var sumAll: Float = 0, sumLow: Float = 0, sumHigh: Float = 0, count = 0
    var last = Date()
    let aLow: Float = 1 - exp(-2 * .pi * 150 / 48000)
    let aMid: Float = 1 - exp(-2 * .pi * 2000 / 48000)

    func stream(_ stream: SCStream, didOutputSampleBuffer sb: CMSampleBuffer, of type: SCStreamOutputType) {
        guard type == .audio else { return }
        try? sb.withAudioBufferList { abl, _ in
            guard let buf = abl.first, let data = buf.mData else { return }
            let n = Int(buf.mDataByteSize) / MemoryLayout<Float>.size
            let s = data.bindMemory(to: Float.self, capacity: n)
            for i in 0..<n {
                let v = s[i]
                lp1 += aLow * (v - lp1); lp2 += aMid * (v - lp2)
                let hi = v - lp2
                sumAll += v * v; sumLow += lp1 * lp1; sumHigh += hi * hi
            }
            count += n
            if let pcm = AVAudioPCMBuffer(pcmFormat: format, frameCapacity: AVAudioFrameCount(n)) {
                pcm.frameLength = AVAudioFrameCount(n)
                memcpy(pcm.floatChannelData![0], s, n * MemoryLayout<Float>.size)
                let at = frame; frame += AVAudioFramePosition(n)
                analysisQueue.async { self.analyzer.analyze(pcm, atAudioFramePosition: at) }
            }
        }
        if Date().timeIntervalSince(last) >= 1.0 / 30 && count > 0 {
            let c = Float(count)
            let line = String(format: "{\"t\":%.3f,\"rms\":%.5f,\"low\":%.5f,\"high\":%.5f}",
                              Date().timeIntervalSince1970, sqrt(sumAll / c), sqrt(sumLow / c), sqrt(sumHigh / c))
            FileHandle.standardOutput.write((line + "\n").data(using: .utf8)!)
            sumAll = 0; sumLow = 0; sumHigh = 0; count = 0; last = Date()
        }
    }
    func stream(_ stream: SCStream, didStopWithError error: Error) {
        FileHandle.standardError.write("detenido: \(error)\n".data(using: .utf8)!); exit(1)
    }
}

@main struct Main {
    static func main() async {
        let oido = Oido()
        oido.setupAnalysis()
        do {
            let content = try await SCShareableContent.excludingDesktopWindows(false, onScreenWindowsOnly: true)
            guard let display = content.displays.first else { FileHandle.standardError.write("sin pantalla\n".data(using: .utf8)!); exit(4) }
            let cfg = SCStreamConfiguration()
            cfg.capturesAudio = true
            cfg.excludesCurrentProcessAudio = true
            cfg.sampleRate = 48000
            cfg.channelCount = 1
            cfg.width = 2; cfg.height = 2                          // el video no se usa: lo mínimo posible
            cfg.minimumFrameInterval = CMTime(value: 1, timescale: 1)
            let stream = SCStream(filter: SCContentFilter(display: display, excludingWindows: []), configuration: cfg, delegate: oido)
            try stream.addStreamOutput(oido, type: .audio, sampleHandlerQueue: DispatchQueue(label: "oido.audio"))
            try stream.addStreamOutput(oido, type: .screen, sampleHandlerQueue: DispatchQueue(label: "oido.video"))
            try await stream.startCapture()
            FileHandle.standardError.write("escuchando\n".data(using: .utf8)!)
            while true { try await Task.sleep(nanoseconds: 3_600_000_000_000) }
        } catch {
            FileHandle.standardError.write("sin permiso o error: \(error)\n".data(using: .utf8)!); exit(3)
        }
    }
}
