# decisiones de la app de mac

## 2026-10-06, fase 1: lanzador

- **identificador del paquete**: `com.kisnner.lumora`. no hay forma de comprobar desde aquí si está libre en el programa de desarrollador; se queda así y se cambia en `app/Info.plist` si hace falta.
- **python**: orden de búsqueda: el embebido (fase 3), `/usr/bin/python3` (solo si `xcode-select -p` responde, porque sin las herramientas de línea de comandos ese binario abre un diálogo de instalación), homebrew en `/opt/homebrew` y `/usr/local`. en este mac `/usr/bin/python3` es el 3.9 de Xcode-beta y el puente funciona con él.
- **estructura del paquete**: `Resources/web` (index.html y los 68 scripts que carga), `Resources/bridge` (bridge.py y guion.py), `Resources/tools` (oido y traducir compilados). el puente recibe `LUMORA_ROOT` (web) y `LUMORA_TOOLS`.
- **web copiada por lista**: `crear_app.sh` copia solo lo que `index.html` referencia con `src=`. se comprobó que los 68 .js de la raíz están todos referenciados, así que no falta nada. no se copian personal/, extras/, docs/, tools/ ni .git.
- **puerto**: 8888 por defecto; si lo ocupa otro programa se prueba 8889 y siguientes (hasta 20). el puerto elegido se escribe en `~/Library/Application Support/Lumora/puerto`. consecuencia conocida: la página queda en otro origen y el almacenamiento local (ajustes del navegador) no se comparte con el de 8888.
- **un solo puente**: antes de arrancar, el puente y la app buscan un lumora vivo en 8888..8907 con `/salud` (con respaldo a `/now` para puentes antiguos) y lo reutilizan.
- **una sola app**: la segunda instancia avisa a la primera con una notificación distribuida (que abre lumora) y sale.
- **salida limpia**: la app manda SIGTERM a los hijos del puente (osascript, oido, ffmpeg) y luego al puente; SIGKILL si tarda más de 3 s. además el puente vigila a su padre (`LUMORA_PARENT`): si la app muere a la fuerza, el puente mata a sus hijos y se apaga en menos de 2 s. el puente también limpia a sus hijos al recibir SIGTERM o SIGINT en el modo manual (antes dejaba un osascript huérfano).
- **reinicio**: si el puente muere, la app lo reinicia (máximo 3 veces por minuto) y avisa en el menú.
- **registro**: `~/Library/Logs/Lumora/lumora.log`, abierto en modo append por la app y por el puente; se rota a `.1` al arrancar si pasa de 2 MB.
- **sin icono en el Dock** (LSUIElement): es una utilidad de barra de menú; la ventana propia (fase 2) no cambia eso.
- **apple event de salir**: `osascript -e 'tell application id "com.kisnner.lumora" to quit'` devuelve -600 desde la terminal de pruebas; no se usó como prueba. las rutas reales (menú, Cmd+Q, SIGTERM de cierre de sesión) pasan por `NSApp.terminate` y se probaron con SIGTERM.
- **ffmpeg**: no se empaqueta. la app añade `/opt/homebrew/bin` y `/usr/local/bin` al PATH del puente porque una app lanzada desde Finder arranca con un PATH mínimo.

## 2026-10-06, fase 2: ventana propia

- la ventana propia (WKWebView) es el modo por defecto; el menú de la barra permite cambiar a "abrir en: navegador" (se guarda en UserDefaults).
- las descargas (blobs y adjuntos) usan WKDownloadDelegate: van a ~/Descargas sin pisar archivos existentes y se revelan en Finder.
- los enlaces externos y `window.open` se abren en el navegador predeterminado; cerrar la ventana solo la oculta.
- el micrófono se concede solo al origen 127.0.0.1 (lumora usa getUserMedia como entrada de audio alternativa); por eso `NSMicrophoneUsageDescription` en Info.plist.
- WKWebView y MediaRecorder: Safari graba mp4/h264 directo, así que con la ventana propia los clips salen en mp4 sin necesitar ffmpeg.

## 2026-10-06, fase 3: empaquetado

- **puente congelado con PyInstaller** (onedir, arm64, python 3.14 de Homebrew) en `.venv-empaque` dentro del repo, ignorado por git. motivo: la app no depende de ningún python del usuario ni de las herramientas de línea de comandos. alternativa descartada: embeber un framework de python (frágil al reubicar y firmar). si falta el congelado, la app cae a los fuentes con el python del sistema.
- **universal**: no. arm64 solamente (ver DISTRIBUCION.md).
- **ffmpeg** no se empaqueta; con la ventana propia los clips salen en mp4 directo. `/salud` y el menú avisan "sin ffmpeg: clips en webm".
- **firma**: hardened runtime también en la ad-hoc. los ejecutables anidados (puente congelado, python, bibliotecas) llevan los mismos entitlements que la app, con `disable-library-validation`; sin eso el puente congelado no carga su propio Python (error real visto en la primera prueba: "different Team IDs"). entitlements: apple-events, audio-input y disable-library-validation; sin sandbox.
- **DMG**: volumen "Lumora" con acceso directo a Aplicaciones. se omitió la imagen de fondo: para colocarla hay que ordenar iconos con AppleScript sobre Finder, que exige permiso de Automatización y es frágil. `hdiutil create` está marcado como obsoleto por Apple pero funciona.
