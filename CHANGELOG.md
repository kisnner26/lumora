# historial de cambios

## 2026-10-08

- añade guion visual local con continuidad entre versos y composiciones que vuelven en el estribillo.
- amplía el catálogo a 71 perfiles de artistas y 753 dibujos; diferencia proporciones faciales y vestuario por álbum.
- incorpora 12 recursos narrativos y reglas de continuidad para el director opcional.
- corrige la galería de pruebas, el encuadre del aplauso y el coste de los círculos pequeños.

## sin publicar

- experiencia de audio: ambientes acústicos (sala, fiesta, catedral, espacio binaural), eco al tempo y reverberación sobre un archivo local, una entrada loopback o el audio del Mac (tap de Core Audio, sin driver extra); el audio original se silencia mientras se procesa.
- universos procedurales: cada canción tiene un mundo por semilla (ciudad, bosque, costa, desierto, órbita, interior) que se regenera sin límite; lo usan el videoclip, la carátula (fondo nuevo, con pestaña de sonido) y una pestaña nueva en explorar.
- la criatura es interactiva: sus ojos siguen al cursor, salta y suena al tocarla (la voz depende de su nombre), habla en un globo, baila al ritmo de lo que suena, hace un supersalto con doble toque y se puede silenciar; barra espaciadora para acariciarla.
- la criatura muestra cuántas escuchas faltan para el siguiente nivel, tus 3 artistas y canciones más escuchados, qué significa su estado y permite guardar su imagen en PNG.
- opción en el menú de la barra para abrir lumora al iniciar sesión.
- pruebas del puente (`python3 -m unittest discover -s tests`) y su paso en la integración continua.
- letras propias: un `.lrc` o `.txt` en `~/Library/Application Support/Lumora/letras/` tiene prioridad sobre lrclib.

## 1.0

- **Lumora.app** para Mac: icono en la barra de menú, arranca el puente sola, ventana propia con WebKit y salida limpia sin procesos sueltos.
- **Lumora.dmg** con el puente de python congelado, así que no necesita python instalado; firma con hardened runtime.
- el puente acepta `LUMORA_ROOT`, `LUMORA_TOOLS` y `LUMORA_PORT`, usa un puerto alterno si 8888 está ocupado, reutiliza un puente vivo y expone `GET /salud`.
- videoclip en risografía con 31 escenas, modo carátula, captura de versos, modo autor y versión web en GitHub Pages.
