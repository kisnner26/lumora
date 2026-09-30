# estudio de viabilidad: lumora como escritorio vivo (fase 9)

**pregunta:** ¿se puede poner una escena o el videoclip de lumora como fondo de escritorio animado en el Mac?
**estado:** solo estudio. No se construyó nada (hace falta un Mac y aquí no hay uno). Todo lo que sigue es análisis, no una prueba: lo marcado con ⚠ está sin verificar.

## qué hay que resolver
1. una ventana que viva *detrás* de los iconos y las demás ventanas,
2. que dibuje lumora (WebGL, ~60 fps) sin gastar batería cuando nadie la ve,
3. que reciba el audio/estado de la canción (hoy llega por el puente local),
4. que respete varios monitores y Spaces.

## opciones

| opción | cómo | pros | contras | veredicto |
|---|---|---|---|---|
| **A. app nativa mínima (Swift + WKWebView)** | `NSWindow` sin marco con `level = kCGDesktopWindowLevel` (o `-1` sobre el nivel del escritorio), `collectionBehavior = [.canJoinAllSpaces, .stationary, .ignoresCycle]`, `ignoresMouseEvents = true`, un `WKWebView` que carga `index.html?fx=espacio` (la vista de fondos ya existe y no tiene menú). Una ventana por pantalla. | reutiliza todo lumora tal cual; ~150 líneas; WebGL funciona en WKWebView; puede pausar con `NSWindow.didChangeOcclusionStateNotification` y en modo ahorro | hay que firmar/notarizar para compartirla; ⚠ el nivel exacto de la ventana y el clic en el escritorio (Sonoma oculta ventanas al hacer clic en el fondo) hay que probarlos | **recomendada** |
| B. Electron / Tauri | lo mismo pero con un runtime | multiplataforma | 100+ MB (Electron) y más CPU; mismo problema de nivel de ventana | descartada |
| C. exportar un video en bucle | el grabador ya existente (r) saca un clip | cero código nuevo | macOS solo admite videos como fondo vía salvapantallas/Aerial, no como fondo libre; ⚠ sin audio reactivo | solo como plan B |
| D. apps de terceros (Plash, Wallper…) | apuntan a una URL | se prueba hoy: `?fx=espacio` como URL | depende de otra app; sin puente de audio | sirve para **probar ya** |

## recomendación
Probar primero **D** (gratis, 5 minutos: apuntar Plash a `http://127.0.0.1:<puerto>/index.html?fx=espacio`) para ver si la escena vale como fondo. Si sí, construir **A**.

## diseño de A (boceto, ⚠ sin compilar)
```swift
let win = NSWindow(contentRect: screen.frame, styleMask: .borderless, backing: .buffered, defer: false)
win.level = NSWindow.Level(rawValue: Int(CGWindowLevelForKey(.desktopWindow)))
win.collectionBehavior = [.canJoinAllSpaces, .stationary, .ignoresCycle]
win.ignoresMouseEvents = true; win.isOpaque = true
let web = WKWebView(frame: win.contentView!.bounds, configuration: WKWebViewConfiguration())
web.load(URLRequest(url: URL(string: "http://127.0.0.1:8899/index.html?fx=espacio&cal=baja")!))
// pausar si la ventana queda tapada o estamos con batería baja
NotificationCenter.default.addObserver(forName: NSWindow.didChangeOcclusionStateNotification, object: win, queue: .main) { _ in
  let visible = win.occlusionState.contains(.visible)
  web.evaluateJavaScript("window.RISO && (RISO.stage.speed = \(visible ? 1 : 0))")
}
```

## costes y riesgos
- **CPU/batería:** la escena a detalle medio usa ~una GPU integrada al 10–20 % ⚠ (medir). Mitigaciones que ya existen: detalle automático (baja si < 45 fps), modo grabación a 30 fps. Falta: tope de 30 fps y pausa total con batería < 20 % o pantalla apagada.
- **audio:** el puente local (`/now`) ya entrega tempo y energía; la ventana lo consumiría igual que la página. El micrófono no hace falta.
- **permisos:** ninguno especial (no graba pantalla); solo firma para distribuirla.
- **varias pantallas:** una ventana por `NSScreen`; cada una con su escena (`?fx=` distinto).
- **mantenimiento:** otro proyecto Xcode aparte; no toca el código web.

## decisión
Viable con esfuerzo bajo (1–2 días) en Mac; **no se implementa en esta rama**. Pendiente: probar D y medir consumo (ver docs/PENDIENTE-MAC.md).

---

# exportación 360° y WebXR mínimo (implementado)
- `riso-xr.js`: `RISOXR.panorama(escena)` dibuja una escena en equirectangular 2:1 (4096×2048) con la costura izquierda/derecha fundida (probado: diferencia media 0,2 sobre 255). `RISOXR.exportar(escena)` la baja como PNG. Ajustes > imagen: «Exportar panorama 360°» y «Visor 360° / VR».
- visor: `?xr=1&escena=bosque` (o el botón): esfera en WebGL crudo, arrastrar para mirar, rueda para acercar. Si el navegador trae WebXR aparece «entrar en VR» (sesión `immersive-vr`, espacio `local`, vistas del visor sin traslación: solo giro de cabeza, sin controles).
- límites honestos: es una escena 2D estirada a una esfera, no un mundo 3D (distorsión en los polos y la trama de puntos se ve grande); sin estéreo real; WebXR requiere HTTPS (o localhost) y un visor → **el modo VR no está probado**.
- probado aquí (tools/test_xr.mjs): panorama 2:1, costura, PNG descargable, visor plano con arrastre y cambio de escena, aviso sin WebXR.
