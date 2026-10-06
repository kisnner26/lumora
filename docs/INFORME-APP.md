# informe de la app de Mac

## qué se hizo
- **fase 1**: `Lumora.app` (Swift, AppKit): icono en la barra de menú, arranca el puente, espera `/salud`, abre lumora, una sola instancia, salida limpia, reinicio del puente si muere, registro en `~/Library/Logs/Lumora`. el puente ganó `LUMORA_ROOT`, `LUMORA_PORT`, puerto alternativo, reutilización de un puente vivo, `/salud` y limpieza de hijos. icono risografía generado por código.
- **fase 2**: ventana propia con WKWebView (por defecto) con descargas, enlaces externos al navegador, permisos y menú para volver al navegador.
- **fase 3**: puente congelado con PyInstaller, `tools/empaquetar.sh`, `Lumora.dmg` de 9.9 MB con firma ad-hoc y hardened runtime, guía de firma y notarización, README actualizado.

## qué se probó
ver `docs/QA/app.md`: arranque, doble apertura, salida sin procesos, puerto ocupado, puente y app muertos a la fuerza, sin música, página y APIs dentro del WKWebView, descarga de blob, DMG instalado en /tmp con el repo renombrado. se encontró y corrigió un fallo real de firma del puente congelado.

## sin verificar
música real sonando, uso largo con captura de versos y carátula, pantalla completa con clic, instalación en un Mac limpio con cuarentena, notarización.

## dependencias que quedan
ffmpeg opcional; permisos de Automatización y Grabación de pantalla; solo arm64.

## riesgos
cambios de Apple en la automatización de Música o en ScreenCaptureKit; el puerto alterno cambia el origen y por tanto el almacenamiento local de la página; letras sin licencia (lrclib); el cargador de la ventana propia depende de WKWebView, que va un paso por detrás de Chrome.
