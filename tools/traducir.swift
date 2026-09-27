// traducir: traduce líneas en el dispositivo con el traductor de Apple.
// modo único:   traducir en es < ["línea", ...]      -> ["traducción", ...]
// modo servidor: traducir --serve en es  (una petición JSON por línea de stdin, una respuesta por línea de stdout)
import Foundation
import Translation

func out(_ s: String) { FileHandle.standardOutput.write((s + "\n").data(using: .utf8)!) }
func err(_ s: String) { FileHandle.standardError.write((s + "\n").data(using: .utf8)!) }

func run(_ session: TranslationSession, _ lines: [String]) async throws -> [String] {
    let reqs = lines.enumerated().compactMap { i, l in
        l.trimmingCharacters(in: .whitespaces).isEmpty ? nil : TranslationSession.Request(sourceText: l, clientIdentifier: String(i))
    }
    var res = Array(repeating: "", count: lines.count)
    if reqs.isEmpty { return res }
    for try await r in session.translate(batch: reqs) {
        if let id = r.clientIdentifier, let i = Int(id) { res[i] = r.targetText }
    }
    return res
}

@main struct Traducir {
    static func main() async {
        var args = Array(CommandLine.arguments.dropFirst())
        let serve = args.first == "--serve"; if serve { args.removeFirst() }
        let src = Locale.Language(identifier: args.first ?? "en")
        let dst = Locale.Language(identifier: args.count > 1 ? args[1] : "es")
        let status = await LanguageAvailability().status(from: src, to: dst)
        guard status == .installed else { err("idiomas no instalados: \(status)"); exit(3) }
        let session = TranslationSession(installedSource: src, target: dst)
        if !serve {
            let data = FileHandle.standardInput.readDataToEndOfFile()
            guard let lines = try? JSONDecoder().decode([String].self, from: data) else { err("entrada inválida"); exit(2) }
            do { out(String(data: try JSONEncoder().encode(try await run(session, lines)), encoding: .utf8)!) }
            catch { err("error: \(error)"); exit(1) }
            return
        }
        _ = try? await run(session, ["warm up"])      // carga el modelo una sola vez
        out("[\"listo\"]")
        while let line = readLine() {
            guard let d = line.data(using: .utf8), let lines = try? JSONDecoder().decode([String].self, from: d) else { out("{\"error\":\"entrada inválida\"}"); continue }
            do { out(String(data: try JSONEncoder().encode(try await run(session, lines)), encoding: .utf8)!) }
            catch { out("{\"error\":\"\(error)\"}") }
        }
    }
}
