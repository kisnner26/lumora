# QA de la app (Lumora.app)

mac con macOS 27.2, Xcode-beta, python 3.9 del sistema. todas las pruebas con `app/build/Lumora.app` construida por `tools/crear_app.sh`.

## fase 1

| prueba | resultado |
|---|---|
| doble clic equivalente (`open Lumora.app`) | arranca la app, el puente en 8888, `/salud` responde, `index.html` 200 (134 KB), `/story` 200, `/now` devuelve estado `off` |
| abrir dos veces | 1 proceso de la app y 1 puente; la segunda instancia sale |
| salir (SIGTERM, misma ruta que menú, Cmd+Q y cierre de sesión) | sin procesos de Lumora, bridge, osascript ni oido; puerto liberado; el archivo de puerto se borra |
| puerto 8888 ocupado por otro programa | el puente toma 8889 y lo registra; el archivo de puerto dice 8889 |
| matar el puente con kill -9 | la app lo detecta y arranca uno nuevo en menos de 6 s |
| matar la app con kill -9 | el puente se apaga solo en menos de 6 s, sin osascript huérfano |
| sin música abierta | `/salud` dice musica y spotify en false; el menú muestra "esperando música…" |
| puente manual con SIGTERM | sale sin dejar osascript |
| firma | `codesign --verify --deep --strict` correcto (ad-hoc) |

### sin verificar
- **con Música sonando**: Música no estaba abierta y no se inició reproducción sin permiso. el código de `/now` no cambió respecto a la versión probada; falta confirmarlo con una canción real tras aprobar el permiso de Automatización (ver PENDIENTE-MAC-APP.md).
- **clic en "salir" del menú de la barra**: no se pulsó con el ratón; comparte la ruta `NSApp.terminate` con SIGTERM.
- **diálogo de Automatización** de macOS la primera vez: lo tiene que aprobar el usuario.

## fase 2 (ventana propia con WKWebView)

autoprueba interna (`LUMORA_AUTOPRUEBA=1 open --env LUMORA_AUTOPRUEBA=1 Lumora.app`, escribe en el registro):

| prueba | resultado |
|---|---|
| página dentro del WKWebView | carga y se ve igual que en el navegador (captura con `takeSnapshot`, pantalla de inicio risografía completa, fuentes incluidas) |
| WebGL, MediaRecorder (mp4 avc1 y webm), portapapeles de imagen, API de pantalla completa | todos disponibles |
| descarga de un blob (`<a download>`) | se guarda en ~/Downloads y se revela en Finder |
| tecla enviada a la ventana | la página recibe el keydown |
| salir | sin procesos restantes |

sin verificar a mano: captura de versos con grabación real de video, modo carátula y pantalla completa con clic (se comprobó que las APIs existen, no su uso completo); pegado de imagen en otra app.
