# distribución de Lumora.app

## construir

```sh
tools/empaquetar.sh
```

crea un entorno local `.venv-empaque` (PyInstaller, solo la primera vez), compila el lanzador y las dos herramientas nativas, congela el puente, arma `app/build/Lumora.app`, la firma con hardened runtime y genera `app/build/Lumora.dmg` (volumen "Lumora", con acceso directo a Aplicaciones). `tools/crear_app.sh` hace solo la app, sin DMG.

arquitectura: arm64 (Apple Silicon). el puente congelado hereda la arquitectura del python con el que se construye; un build universal necesitaría un python universal2 (por ejemplo el de python.org) y compilar el lanzador y las herramientas con `-target` para x86_64 y arm64 más `lipo`. no se hizo.

## firma ad-hoc (lo que hay hoy)

`codesign --verify --deep --strict` pasa. `spctl --assess` responde "rejected": es lo esperado con una firma ad-hoc. quien descargue el DMG verá que macOS no puede verificar la app: tiene que hacer **clic derecho > abrir** (o, en macOS reciente, abrir y luego Ajustes del Sistema > Privacidad y seguridad > "abrir de todos modos"). desde ahí abre normal.

## firma con Developer ID y notarización (necesita tu cuenta de pago)

1. en developer.apple.com crea un certificado "Developer ID Application" e instálalo en el llavero.
2. guarda las credenciales de notarización una vez (usa una contraseña específica de app):
   ```sh
   xcrun notarytool store-credentials mi-perfil --apple-id "tu@correo" --team-id TEAMID
   ```
3. construye, firma, notariza y grapa:
   ```sh
   DEVELOPER_ID="Developer ID Application: Tu Nombre (TEAMID)" NOTARY_PROFILE=mi-perfil NOTARIZAR=1 tools/empaquetar.sh
   ```
   el script ejecuta `xcrun notarytool submit --wait`, `xcrun stapler staple` y `stapler validate` sobre el DMG.
4. verifica: `spctl --assess --type execute --verbose app/build/Lumora.app` debe decir "accepted, source=Notarized Developer ID".

con eso el usuario abre la app con doble clic, sin avisos.

## publicar en GitHub Releases (sin hacerlo)

```sh
gh release create v1.0 app/build/Lumora.dmg --title "lumora 1.0" --notes "primera versión de la app de Mac"
```

## qué ve el usuario y qué permisos pide

- Automatización (Música y Spotify): para leer la canción y controlar la reproducción.
- Grabación de pantalla: solo para el audio del sistema (ScreenCaptureKit); no se graba ni se guarda la pantalla.
- Micrófono: solo si el usuario elige una entrada de audio dentro de lumora.
- ffmpeg es opcional (convierte clips WebM a MP4). la ventana propia graba MP4 directo, así que no hace falta.

## lo que queda para vender en serio

- licencia comercial: la licencia del repo es PolyForm Noncommercial; falta redactar y publicar la licencia comercial y cómo se compra y activa.
- letras: lrclib se usa sin acuerdo de licencia; para vender hay que resolver los derechos de las letras (proveedor licenciado o letras solo del usuario).
- Música y Spotify se controlan con AppleScript; Apple puede cambiar esa automatización.
- texto de "Acerca de": ya menciona la licencia; falta versión larga con créditos.
- política de privacidad corta: todo corre en el Mac del usuario, el puente solo escucha en 127.0.0.1 y no se envía nada a ningún servidor propio. las únicas conexiones salientes son las que ya hace lumora: letras (lrclib), fuentes de Google Fonts, metadatos (iTunes/Wikipedia) y, si el usuario lo activa, Claude.
- actualizaciones automáticas (Sparkle o similar) y un sitio de descarga.
- pruebas automáticas y CI del repo, y reducir sus 52 MB.
