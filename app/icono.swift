// genera el icono de Lumora (estilo risografía) como PNG de 1024 px: swiftc app/icono.swift -o /tmp/icono && /tmp/icono salida.png
import AppKit

let S: CGFloat = 1024
let rep = NSBitmapImageRep(bitmapDataPlanes: nil, pixelsWide: Int(S), pixelsHigh: Int(S), bitsPerSample: 8, samplesPerPixel: 4,
                           hasAlpha: true, isPlanar: false, colorSpaceName: .deviceRGB, bytesPerRow: 0, bitsPerPixel: 0)!
NSGraphicsContext.saveGraphicsState()
let ctx = NSGraphicsContext(bitmapImageRep: rep)!
NSGraphicsContext.current = ctx
let cg = ctx.cgContext

// papel
let margin: CGFloat = 80
let box = CGRect(x: margin, y: margin, width: S - 2 * margin, height: S - 2 * margin)
let squircle = NSBezierPath(roundedRect: box, xRadius: 185, yRadius: 185)
NSColor(red: 0.10, green: 0.09, blue: 0.09, alpha: 1).setFill()
squircle.fill()
cg.saveGState()
squircle.addClip()

func tinta(_ c: NSColor, _ cx: CGFloat, _ cy: CGFloat, _ r: CGFloat, _ dots: Bool) {
    cg.saveGState()
    cg.setBlendMode(.screen)
    c.setFill()
    if dots {                                   // trama de puntos de la risografía
        let step: CGFloat = 26
        var y = cy - r
        var row = 0
        while y < cy + r {
            var x = cx - r + (row % 2 == 0 ? 0 : step / 2)
            while x < cx + r {
                let d = hypot(x - cx, y - cy)
                if d < r {
                    let k = 1 - d / r
                    let rr = step * 0.5 * (0.35 + 0.65 * k)
                    NSBezierPath(ovalIn: CGRect(x: x - rr, y: y - rr, width: rr * 2, height: rr * 2)).fill()
                }
                x += step
            }
            y += step * 0.866; row += 1
        }
    } else {
        NSBezierPath(ovalIn: CGRect(x: cx - r, y: cy - r, width: r * 2, height: r * 2)).fill()
    }
    cg.restoreGState()
}

// tres tintas desalineadas a propósito
tinta(NSColor(red: 0.00, green: 0.47, blue: 0.75, alpha: 0.95), 430, 560, 270, true)
tinta(NSColor(red: 1.00, green: 0.42, blue: 0.18, alpha: 0.95), 600, 520, 250, true)
tinta(NSColor(red: 1.00, green: 0.78, blue: 0.10, alpha: 1.0), 512, 470, 200, false)

// rayos finos de luz
cg.setStrokeColor(NSColor(red: 0.96, green: 0.92, blue: 0.82, alpha: 1).cgColor)
cg.setLineWidth(14); cg.setLineCap(.round)
for i in 0..<12 {
    let a = CGFloat(i) * .pi / 6 + 0.13
    cg.move(to: CGPoint(x: 512 + cos(a) * 335, y: 500 + sin(a) * 335))
    cg.addLine(to: CGPoint(x: 512 + cos(a) * 380, y: 500 + sin(a) * 380))
}
cg.strokePath()
cg.restoreGState()
NSGraphicsContext.restoreGraphicsState()

let out = CommandLine.arguments.count > 1 ? CommandLine.arguments[1] : "icono.png"
try! rep.representation(using: .png, properties: [:])!.write(to: URL(fileURLWithPath: out))
