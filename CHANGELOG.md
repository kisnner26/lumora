# historial de cambios

## 2026-10-11

- reduce las subidas y asignaciones de texturas de los filtros, evita trabajo repetido en carátula y suspende dibujos ocultos conservando audio, luces, letras, fondo escena y grabación. añade benchmark local y pruebas de regresión de rendimiento.

## 2026-10-10

- repara el envío de luces govee en risografía, fábula, vídeo y carátula; usa el pulso de audio directamente, reintenta al recuperar el puente y separa los paquetes lan de color y brillo.

- añade filtros musicales de boceto, contornos, puntillismo y píxeles blancos progresivos al gameplay con boost, con fundidos, exportación y letras legibles sobre el resultado.

- mejora las letras sobre gameplay con entradas, pulsación musical, énfasis progresivo y contraste y color adaptados al video; conserva tamaño, traducción, desfase y exportación.

- añade color por frases, bloom selectivo y aberración cromática al ritmo sobre los videos con boost; conserva montaje, letras y grabación, con alternativa canvas y ajustes de accesibilidad.

- separa «fábula» de risografía: tema, fuentes, fondo de bienvenida, controles pertinentes y exportación propios. migra la selección anterior «cuento» y conserva la elección entre sesiones.
- añade el estilo «cuento ilustrado»: protagonista procedural, vidriera ornamental, pintura sobre papel y cuatro escenarios (taller, jardín, mar y torre).
- la letra dirige capítulos con continuidad, objetos simbólicos y transiciones suaves; la canción y la semilla mantienen su identidad visual al buscar o repetir.
- integra el estilo en ajustes, looks, vista previa, letras traducidas y el lienzo que usan las exportaciones; respeta pausa y movimiento reducido.
- repara el teclado de ajustes cuando el menú de bienvenida está abierto y anuncia la selección de estilo a lectores de pantalla.

## 2026-10-09

- repara los controles de sonido de carátula, su navegación por teclado y el foco del menú de herramientas.
- cancela las capturas pcm al desconectar, cambiar de fuente o agotar el tiempo de arranque; excluye el navegador reproductor para evitar realimentación.
- saca la escritura al pipe del callback de core audio y conserva el audio original mientras el tap no se lee.
- corrige el remuestreo, la limpieza del recuerdo y la exclusión entre grabaciones; verifica exportación real con imagen y audio.
- sincroniza la distribución web con los universos, explorar, carátula y experiencia de audio; informa las funciones que requieren la app de mac.
- comprueba los mínimos de macos de todos los binarios empaquetados y reconstruye el dmg con un runtime compatible.

## 2026-10-08

- añade guion visual local con continuidad entre versos y composiciones que vuelven en el estribillo.
- amplía el catálogo a 71 perfiles de artistas y 753 dibujos; diferencia proporciones faciales y vestuario por álbum.
- incorpora 12 recursos narrativos y reglas de continuidad para el director opcional.
- corrige la galería de pruebas, el encuadre del aplauso y el coste de los círculos pequeños.

## sin publicar

- quién canta cada verso en las colaboraciones: el puente busca el reparto en la web (Genius y similares, vía Claude con búsqueda), lo guarda y la escena destaca al que canta (más grande, con foco y nombre resaltado) mientras los demás se atenúan; en los tramos conjuntos salen todos por igual y, si no se sabe o la confianza es baja, nadie se destaca (se acabó el reparto por turnos al azar). Primera consulta ~1 minuto, en segundo plano.
- barra de controles reorganizada: traducción y letra, experiencia, carátula y pantalla completa a la vista; grabar, formato, recuerdo, modo autor, luces y compartir verso en un menú «···» con nombre; los botones con texto ya no se solapan.
- fotos de artistas más seguras: por defecto solo se usan fuentes que identifican al artista (la foto principal de su artículo de Wikipedia y las fotos del artículo cuyo archivo lo nombra, TheAudioDB y Deezer); se descartan fichas policiales, fotos con varias personas y fotos de perfil o borrosas, y un fallo de red no se recuerda como «sin foto». Commons y la web abierta quedan en «Búsqueda web ampliada» (apagada por defecto) porque pueden equivocarse de persona. Se corrigió un caso en el que XXXTENTACION salía con la foto de otra persona.
- escenas en primera persona en el motor: carretera desde el volante (con las manos, el tablero, el retrovisor y el velocímetro que sigue la energía), caminar por la calle con el balanceo de cada paso, la ventana de un tren con la lluvia y el paisaje en capas, el móvil en las manos con los mensajes que llegan, la pista de baile con focos y el destello del golpe, y el techo desde la cama con el ventilador. Las elige la letra (conducir, tren, bailar, dormir, mensajes, caminar) y, si el plan no fija escena, el ánimo; son una escena más del repertorio.
- el mapa de artistas se completa solo y en tiempo real: sin foto, el artista no se dibuja (ni cuerpo ni busto vectorial) mientras Lumora la busca en internet (Wikipedia en y es, Wikimedia Commons, TheAudioDB, Deezer y, como última opción, una búsqueda web general que descarta los bancos de fotos) y aparece en cuanto llega; las fotos quedan guardadas, los artistas de tu historial se van consiguiendo en segundo plano, y los planos de cantante esperan a tener al menos una foto. «Fotos solo de Wikipedia» (ajustes) limita la búsqueda a Wikipedia y Commons.
- solo rostros: se quitan los cuerpos dibujados de los artistas y del segundo personaje; cada artista sale como un busto con su foto real en trama de risografía (como el retrato de Sinatra) que respira, cabecea y rebota con el ritmo, y en las colaboraciones salen todos los créditos. Las fotos se eligen entre varias (la más nítida y de frente) y una foto de perfil o borrosa se descarta; sin foto queda un busto vectorial (cabeza y hombros). Fuentes: Wikipedia (en y es) y, si no hay allí, la imagen oficial del artista en Deezer (se puede limitar a Wikipedia en ajustes). Los nombres se emparejan de forma estricta para no mostrar a otra persona.
- caras reales: la foto del artista (Wikipedia) se recorta sin fondo con el reconocimiento de personas de macOS (`tools/rostro`) y se imprime en trama de risografía sobre su figura, con el pelo, los tatuajes y los rasgos reales; se guarda en `~/Library/Caches/lumora-caras`. Se apaga en ajustes > contenido (derechos de imagen: revisar antes de publicar). Sin foto se usa el retrato vectorial con los rasgos que describe Claude.
- se devuelve el motor completo como modo predeterminado: la película continua pasa a ser un modo experimental (ajustes > contenido) porque dejaba fuera el catálogo de dibujos, las escenas y la palabra gigante; el mundo procedural es una escena más del repertorio (no la única) y la historia narrativa manda solo cuando pasa algo.
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
