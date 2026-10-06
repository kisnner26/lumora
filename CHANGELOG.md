# historial de cambios

## sin publicar

- opción en el menú de la barra para abrir lumora al iniciar sesión.
- pruebas del puente (`python3 -m unittest discover -s tests`) y su paso en la integración continua.
- letras propias: un `.lrc` o `.txt` en `~/Library/Application Support/Lumora/letras/` tiene prioridad sobre lrclib.

## 1.0

- **Lumora.app** para Mac: icono en la barra de menú, arranca el puente sola, ventana propia con WebKit y salida limpia sin procesos sueltos.
- **Lumora.dmg** con el puente de python congelado, así que no necesita python instalado; firma con hardened runtime.
- el puente acepta `LUMORA_ROOT`, `LUMORA_TOOLS` y `LUMORA_PORT`, usa un puerto alterno si 8888 está ocupado, reutiliza un puente vivo y expone `GET /salud`.
- videoclip en risografía con 31 escenas, modo carátula, captura de versos, modo autor y versión web en GitHub Pages.
