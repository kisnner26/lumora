// rostro: recorta la cara (con el pelo y los hombros) de una foto, sin fondo, con el reconocimiento de personas de macOS.
//   rostro entrada.jpg salida.png
// salida 0: recorte hecho; 2: no se encontró una cara; 1: error de lectura o escritura.
import Foundation
import Vision
import CoreImage
import AppKit

func fallo(_ m: String, _ code: Int32) -> Never { FileHandle.standardError.write(Data((m + "\n").utf8)); exit(code) }
let a = CommandLine.arguments
guard a.count >= 3 else { fallo("uso: rostro entrada salida.png", 1) }
guard let data = FileManager.default.contents(atPath: a[1]), let rep = NSBitmapImageRep(data: data), let cg = rep.cgImage else { fallo("no se pudo leer la imagen", 1) }

let w = CGFloat(cg.width), h = CGFloat(cg.height)
let caras = VNDetectFaceRectanglesRequest()
let persona = VNGeneratePersonSegmentationRequest()
persona.qualityLevel = .accurate
persona.outputPixelFormat = kCVPixelFormatType_OneComponent8
let handler = VNImageRequestHandler(cgImage: cg, options: [:])
do { try handler.perform([caras, persona]) } catch { fallo("Vision falló: \(error.localizedDescription)", 1) }
guard let cara = (caras.results ?? []).max(by: { $0.boundingBox.width * $0.boundingBox.height < $1.boundingBox.width * $1.boundingBox.height }) else { fallo("sin cara", 2) }

// la cara en píxeles (Vision usa coordenadas normalizadas con el origen abajo a la izquierda)
let bb = cara.boundingBox, fx = bb.minX * w, fy = bb.minY * h, fw = bb.width * w, fh = bb.height * h
let lado = max(fw, fh) * 2.5
let cx = fx + fw / 2, cy = fy + fh / 2 - lado * 0.06                       // la cara queda un poco por encima del centro: entran el pelo y los hombros
var rect = CGRect(x: cx - lado / 2, y: cy - lado / 2, width: lado, height: lado).intersection(CGRect(x: 0, y: 0, width: w, height: h))
guard rect.width > 8, rect.height > 8 else { fallo("recorte vacío", 2) }

let ctx = CIContext()
var imagen = CIImage(cgImage: cg)
if let m = persona.results?.first?.pixelBuffer {
    var mask = CIImage(cvPixelBuffer: m)
    mask = mask.transformed(by: CGAffineTransform(scaleX: w / mask.extent.width, y: h / mask.extent.height))
    let vacio = CIImage(color: CIColor(red: 0, green: 0, blue: 0, alpha: 0)).cropped(to: CGRect(x: 0, y: 0, width: w, height: h))
    if let f = CIFilter(name: "CIBlendWithMask") { f.setValue(imagen, forKey: kCIInputImageKey); f.setValue(vacio, forKey: kCIInputBackgroundImageKey); f.setValue(mask, forKey: kCIInputMaskImageKey); imagen = f.outputImage ?? imagen }
}
imagen = imagen.cropped(to: rect).transformed(by: CGAffineTransform(translationX: -rect.minX, y: -rect.minY))
let escala = 512 / max(rect.width, rect.height)
imagen = imagen.transformed(by: CGAffineTransform(scaleX: escala, y: escala))
guard let out = ctx.createCGImage(imagen, from: imagen.extent) else { fallo("no se pudo generar el recorte", 1) }
let png = NSBitmapImageRep(cgImage: out)
guard let bytes = png.representation(using: .png, properties: [:]) else { fallo("no se pudo codificar el PNG", 1) }
do { try bytes.write(to: URL(fileURLWithPath: a[2])) } catch { fallo("no se pudo escribir la salida", 1) }
// posición y tamaño de la cara dentro del recorte, normalizados (para encajarla en la figura)
let cxn = (fx + fw / 2 - rect.minX) * escala / imagen.extent.width, cyn = 1 - (fy + fh / 2 - rect.minY) * escala / imagen.extent.height, wn = fw * escala / imagen.extent.width
print(String(format: "{\"cx\":%.4f,\"cy\":%.4f,\"w\":%.4f,\"ancho\":%d,\"alto\":%d}", cxn, cyn, wn, Int(imagen.extent.width), Int(imagen.extent.height)))
