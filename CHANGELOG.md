# historial de cambios

## 2026-10-08

- añade guion visual local con continuidad entre versos y composiciones que vuelven en el estribillo.
- amplía el catálogo a 71 perfiles de artistas y 753 dibujos; diferencia proporciones faciales y vestuario por álbum.
- incorpora 12 recursos narrativos y reglas de continuidad para el director opcional.
- corrige la galería de pruebas, el encuadre del aplauso y el coste de los círculos pequeños.

## sin publicar

- transiciones sin microcortes en la película continua: todo lo que entra o sale de pantalla se funde o se mueve con arranque y frenada suaves (coche, público, segundo personaje, giros de frente a espaldas, cielos y climas, motivos), el zoom de cámara ya no se reinicia en cada verso, el paisaje acelera y frena sin detenerse de golpe, la paleta de tintas es una por canción, la toma no reinicia sus animaciones al cambiar de sección, el verso anterior se desvanece mientras entra el nuevo, el lugar y la hora cambian al ritmo de la sección (no del verso) y los interiores solo salen si la letra insiste en ellos. Medido: los saltos entre fotogramas en cada cambio de verso pasaron de ~4 veces el promedio a nada; solo quedan los cambios de lugar.
- movimiento más natural: el cuerpo responde a la energía real de la música (amplitud del baile, zancada, acento en cada golpe) con variación orgánica; los artistas respiran, parpadean, miran al otro personaje y el pelo y la cabeza tienen inercia; la boca se abre con la voz y solo mientras se canta ese verso; el mundo tiene vida propia (coches y peatones lejanos, barcos y gaviotas, luciérnagas, un rodadero en el desierto, estrellas fugaces); la cámara tiene el temblor de una cámara en mano y sus acercamientos aceleran y frenan con suavidad.
- película continua (activada por defecto; se apaga en ajustes > contenido): el videoclip deja de cortar en cada verso. Cada sección es una sola toma con el mismo mundo, el mismo protagonista y el otro personaje; la cámara persigue su objetivo con suavidad, las poses se funden al cambiar de acción, el otro personaje entra y sale caminando, y al cambiar de lugar el protagonista camina hasta que el paisaje nuevo aparece por la derecha. Los planos sueltos (palabra gigante, fichas, retratos) solo quedan en el modo montaje.
- los artistas fuera del catálogo se parecen a su versión real: Claude describe su imagen pública (peinado y color de pelo, tono de piel, vello facial, gafas, sombrero, ropa, accesorios, instrumento y proporciones de la cara) una sola vez, con las opciones que el retrato sabe dibujar, y queda guardada en el Mac y en el navegador. Un nombre que Claude no conoce mantiene el avatar neutro.
- historia con hilo: un arco de lugares y horas a lo largo de la canción (el paisaje corre hasta que aparece el siguiente lugar), un segundo personaje que llega, camina al lado, se abraza o se queda lejos según la letra, y una gramática de planos que presenta cada lugar, sigue la acción, se acerca en el coro y se aleja al final.
- animación de los artistas con esqueleto: piernas y brazos de dos huesos con cinemática inversa, ciclos de caminar y correr, cuatro coreografías de baile por compás (paso con puños, brazos arriba, palmas, señalar), cabeceo y peso que se desplaza; el paisaje corre en mosaico espejado al caminar, correr o conducir, con carro más grande y cámara con más empuje.
- recuerdo: un botón en la barra (y en el panel de experiencia) guarda diez segundos de la canción con el audio procesado, el universo y su semilla en una etiqueta; copia la semilla al portapapeles.
- los artistas actúan dentro del videoclip: caminan, corren, bailan, saludan y miran el horizonte de espaldas, dentro del mundo del lugar, con público que salta al ritmo en las canciones de fiesta; también encabezan los planos sin acción de objetos.
- impresión riso que late: cada golpe re-imprime las planchas en otra dirección, los graves ensanchan el punto de tinta y el grano del papel se renueva.
- videoclip más cinematográfico: la letra decide el lugar, el clima (lluvia, tormenta, nieve, niebla, fuego, viento), la hora (noche, amanecer, atardecer) y lo que hace quien canta (conducir, bailar, llorar, correr, dormir, cantar, caminar), con caducidad entre versos. El mundo ocupa toda la pantalla con paralaje, la cámara respira con el ritmo y cambia de plano según la acción.
- geometry dash: se elimina el visualizador propio en neón; las canciones de los 22 niveles principales usan el videoclip de siempre y suman cuatro tomas exclusivas en el estilo de lumora (cubo que salta, nave, onda y cambio de gravedad).
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
