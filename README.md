# lumora

lyric videos en vivo para lo que suena en tu mac. le das play en apple music o spotify y lumora arma el video solo: letra sincronizada letra por letra, escenarios procedurales, tipografía cinética y subtítulos traducidos. antes de empezar, claude lee la canción completa y decide qué se ve en cada verso, para que las imágenes tengan que ver con lo que dice la letra y no sean decoración al azar.

página del producto: **https://kisnner26.github.io/lumora**

[![promo de lumora: el coro con la letra cinética y los subtítulos traducidos](docs/img/promo.gif)](https://kisnner26.github.io/lumora/#demo)

**[ver el promo completo (67 s)](https://kisnner26.github.io/lumora/#demo)** · hecho con una grabación real de lumora, con sonido.

![una canción de amor: la pareja, los corazones y la palabra que remata el verso, elegidos por claude](docs/img/estreno.jpg)

## videoclip en risografía (el lyric video nuevo)

el lyric video ahora es, por defecto, un **videoclip ilustrado en risografía**: no un fondo, sino un motor de video propio que funciona igual que el de siempre (mismo reloj, letra sincronizada, guion del director por estrofa y por verso, traducción, grabación en 16:9 y 9:16) pero que dirige *tomas* hechas a mano en lugar de escenarios de partículas.

| | |
|---|---|
| ![toma de objeto: corazón, flor y reloj que se dibujan solos, con la letra escrita y la palabra clave en tinta](docs/img/clip-objeto.jpg) | ![palabra gigante sobreimpresa y mal registrada sobre rayos en trama](docs/img/clip-gigante.jpg) |
| ![toma con el fondo en tinta plana y el objeto dentro de un círculo](docs/img/clip-tinta.jpg) | ![toma de escena completa con la letra en una etiqueta de papel](docs/img/clip-escena.jpg) |

- **31 escenas que siguen la letra.** además de las siete de siempre hay 24 más: desierto, playa al atardecer, montaña, tormenta, club de noche, café bajo la lluvia, estación, carretera de noche, vuelo, iglesia, cementerio, concierto, estadio, salón de clases, sala de casa, azotea de noche, feria, fondo del mar, jardín, ring, altar, laboratorio digital, campamento y calle mojada. cada una trae las palabras (en español e inglés) que la piden: si el verso habla de una carretera, un tren, la lluvia o una boda, el videoclip corta a la escena que encaja, y no repite la misma dos veces seguidas.
- **retrato «ella» (desactivado).** existe un experimento de retrato a partir de fotos locales en `extras/riso-ella.js`; no se carga. para probarlo, agrega `<script src="extras/riso-ella.js"></script>` en `index.html` después de `riso-scenes3.js` y pon las fotos en `personal/` (carpeta ignorada por git).
- **tomas por verso.** el motor lee lo que dice cada verso y lo que decidió el director (objetos, ánimo, energía, escenario) y arma la toma: un **objeto** que se dibuja solo (sol, flor, corazón, luna, lluvia, fuego, ciudad, teléfono, reloj, calavera, ojo… 30 objetos con trazo tembloroso y doble pasada, que «hierve» ocho veces por segundo como una animación a mano), una **escena completa** (oficina, cuarto, ciudad, espacio, bosque, retrato, museo) con paneos y zoom, una **palabra gigante** en los ganchos y una **portada** al inicio y al cierre con el título y el artista.
- **la letra se escribe a mano**, palabra por palabra al compás del verso, con la palabra clave en la segunda tinta y subrayada con un garabato; la traducción va debajo.
- **cortes con movimiento**, nunca fundidos: paneo, zoom o giro con borrón, más bruscos cuanto más energía tiene la estrofa.
- **una combinación de tintas por estrofa** según su ánimo (índigo y naranja, carmín y petróleo, verde y rosa…), sobre papel crema con grano, halftone y desalineo de registro.
- **capa de anotaciones con datos reales de la canción:** tiempo, tempo, energía y ánimo de la estrofa, número de estrofa, sello «en vivo» con reloj, post-its con de qué trata, códigos, circuitos que se dibujan solos y medidores que siguen el audio.
- se elige en ajustes › imagen › *estilo del video* (risografía o clásico); el clásico queda intacto.

## el menú de inicio y los fondos animados

![menú de inicio: cuatro tarjetas sobre una escena ilustrada en risografía; la seleccionada se agranda](docs/img/menu-inicio.jpg)

lumora abre en un menú de inicio, como el de una consola: una escena ilustrada en movimiento constante y, encima, una fila de tarjetas: **lyric video**, **modo carátula**, **fondos animados** y **ajustes**. la seleccionada se agranda y el fondo cambia de escena con un corte animado (paneo, zoom o giro con borrón de movimiento, nunca un fundido). sin tocar nada, el fondo rota solo entre las escenas. se maneja con teclado (`←` `→`, `enter`, `1`–`4`, `esc`), mouse o gamepad. lo de siempre sigue igual, solo cambió la puerta de entrada: desde la bienvenida, `esc` o el botón «menú» vuelven al inicio.

las escenas son el producto estrella. todas se dibujan con código, en tiempo real, sin imágenes ni videos, con la estética de una risografía: papel crema con grano, dos o tres tintas planas que se multiplican al sobreponerse, sombras y volumen con tramas de puntos, contornos gruesos con la tinta de relleno ligeramente desalineada, y una capa de anotaciones (papeles pegados con cinta, la letra resaltada palabra por palabra, sello de «en vivo» con reloj que corre, líneas de circuito que se dibujan solas y medidores).

| | |
|---|---|
| ![oficina: la silla gira, el cristal brilla, el reloj marca la hora](docs/img/escena-oficina.jpg) | ![cuarto de noche: el bulto respira, el gato mueve la cola, la guirnalda late con el ritmo](docs/img/escena-cuarto.jpg) |
| ![ciudad al atardecer: capas con paralaje, ventanas que parpadean, autos y un tren elevado](docs/img/escena-ciudad.jpg) | ![espacio: planeta con anillos, luna en órbita, astronauta atado y un cohete que cruza](docs/img/escena-espacio.jpg) |
| ![bosque: pinos que se mecen, niebla, luciérnagas y un zorro](docs/img/escena-bosque.jpg) | ![retrato de plano cerrado: parpadea, respira y los audífonos laten con los graves](docs/img/escena-retrato.jpg) |
| ![museo: la máquina tapada con una sábana, cuerda de terciopelo y placa](docs/img/escena-museo.jpg) | ![controles de los fondos animados: escena, velocidad, tintas, detalle, notas, ciclo y grabar](docs/img/fondos-controles.jpg) |

- **con música y sin ella.** si hay audio (el análisis del puente, el micrófono o un mp3) las escenas siguen el bpm, la energía y los golpes: la silla gira más rápido, los focos laten, los audífonos emiten ondas. sin música se mueven solas, con un pulso suave.
- **fondos animados** abre una escena a pantalla completa, sin menú. la barra de controles aparece al mover el mouse y se oculta sola: escena, **velocidad** (de pausa a 2,5×), **tintas** (seis combinaciones o las propias de cada escena), **detalle** (auto, bajo, medio, alto), notas, ciclo automático y **grabar** el fondo tal cual (mp4 o webm). teclas: `←` `→` escena, `↑` `↓` velocidad, `i` tintas, `d` detalle, `n` notas, `c` ciclo, `espacio` pausa, `r` grabar, `h` ocultar la barra, `f` pantalla completa. con gamepad: `lb`/`rb` escena, `a` tintas, `b` volver.
- **el director las usa.** las siete escenas entran al catálogo del director de lumora (y al de claude y al modo autor): las elige cuando la letra habla de una oficina, un cuarto de noche, la ciudad, el espacio, el bosque, un rostro o un museo, o cuando el ánimo de la estrofa las pide. en un lyric video van con la letra encima y sin espejo ni gradación, para no romper el look.
- **rendimiento.** el objetivo es 60 fps; si el promedio baja de 45, el detalle baja solo (menos resolución de plancha, trama más gruesa) y vuelve a subir cuando sobra margen. el modo «detalle» fijo desactiva ese ajuste.
- `?menu=0` abre directo la bienvenida de siempre y `?fx=espacio` (o cualquier escena) abre directo un fondo.

cómo está hecho: cada escena dibuja en una «plancha» (canvas 2D) donde el canal rojo es la tinta 1 (contornos y trama oscura), el verde la tinta 2 y el azul la tinta 3. un shader webgl (`riso.js`) imprime esas planchas: halftone con rejilla girada por tinta, desalineo de registro, multiplicación sobre el papel, moteado de tinta, grano y borrón de movimiento para los cortes. `riso-scenes.js` y `riso-scenes2.js` tienen las escenas, `riso-menu.js` el menú y los fondos, y `riso-director.js` las conecta con el director. una escena nueva son ~100 líneas:

```js
RISO.register({
  id: 'faro', name: 'faro', inks: 0, phrases: ['la luz también espera'],
  make: rng => ({ /* estado propio */ }),
  draw(K, s, t, dt, a) {           // a.e energía, a.beat golpe, a.bpm, a.live si hay música
    K.bg(3, .12);                  // tinta 3 al 12 % = trama de puntos
    K.circ(800, 450, 120 + a.beat * 10, { f: 2, s: 1, lw: 6 });   // relleno tinta 2, contorno tinta 1
  },
});
```

### un solo estilo en todo el sistema

la risografía no es solo el fondo: la bienvenida, los ajustes, la consola de reproducción, el modo carátula y el modo autor comparten las mismas tintas (índigo y naranja sobre papel crema con trama de puntos), bordes gruesos, sombras planas desplazadas y ningún degradado suave. la bienvenida de siempre también tiene una escena viva detrás. todo el estilo vive en `riso-theme.js`, que solo sobrescribe colores y formas, sin tocar la lógica de cada pieza.

| | |
|---|---|
| ![bienvenida sobre una escena viva, con etiquetas de papel](docs/img/bienvenida-riso.jpg) | ![ajustes en papel crema: fichas, teclas cuadradas y faders con regla](docs/img/ajustes-riso.jpg) |

## ajustes

el panel de ajustes (tecla `,`) tiene nueve secciones: imagen, efectos, letra, contenido, color, luces, **looks**, **accesibilidad** y **memoria**.

- un **buscador** arriba filtra los ajustes por nombre o descripción. ![buscador](docs/img/aj-busqueda.jpg)
- una **vista previa** viva muestra cómo queda la letra, la traducción y los efectos con lo que tengas puesto. ![vista previa](docs/img/aj-panel.jpg)
- cada sección tiene su **restablecer**.
- los **looks** son conjuntos de ajustes listos (risografía clásica, cine nocturno, calma, fiesta, lectura, mínimo) y «mi look» para guardar el tuyo. ![looks](docs/img/aj-looks.jpg)
- **accesibilidad**: reducir movimiento, alto contraste, letra sobre papel y tamaño de la letra. ![alto contraste](docs/img/aj-contraste.jpg)
- **memoria**: qué guarda lumora en tu navegador y cómo borrarlo.

## explorar

la tarjeta **explorar** del menú (o ajustes > contenido) abre tres vistas hechas con lo que ya escuchaste:

- **mapa**: un planisferio ilustrado con 71 ciudades; se encienden las que nombran las letras de tus canciones. ![mapa](docs/img/exp-mapa.jpg)
- **atlas de tu música**: un archipiélago con una isla por ánimo y un pueblito por canción. ![atlas](docs/img/exp-atlas.jpg)
- **criatura**: nace y crece con lo que escuchas; su tamaño, colores, orejas y manchas salen de tus escuchas, y se pone triste si pasas días sin música. ![criatura](docs/img/exp-criatura.jpg)

## compartir y memoria

- **colección de pósters**: los pósters de las canciones que terminan se guardan solos en este navegador (hasta 60). ajustes > imagen > colección de pósters, o el botón «colección» del póster. ![colección](docs/img/share-coleccion.jpg)
- **dedicatoria**: escribe una línea en la ventana del póster y se imprime a mano sobre la lámina.
- **enlace pequeño**: «copiar enlace» genera una dirección corta (unos 260 caracteres) que abre `docs/ver.html` con la lámina de la canción y tu dedicatoria. los datos viajan en el fragmento `#` y no llegan a ningún servidor. para que abra desde fuera, activa GitHub Pages sobre `docs/` o cambia la página en ajustes. ![ver.html](docs/img/share-ver.jpg)

## efectos de cine

el videoclip tiene cuatro efectos que se apagan por separado en ajustes > efectos:

- **tinta líquida**: entre estrofas una mancha de tinta se derrama sobre la imagen y luego escurre. ![tinta líquida](docs/img/fx-tinta-liquida-1.jpg)
- **papel rasgado**: una hoja con el borde roto tapa la toma y se retira. ![papel rasgado](docs/img/fx-papel-rasgado.jpg)
- **palabras con peso**: la palabra clave del verso cae con golpe, más gruesa y con sombra mal registrada, y sacude un poco la cámara.
- **taller de impresión**: la portada se imprime tinta por tinta con marcas de registro, marcas de corte y barra de color. ![taller de impresión](docs/img/fx-taller-impresion.jpg)

## catálogo de dibujos

739 dibujos procedurales en risografía que el videoclip elige cuando la letra los nombra: banderas, objetos, símbolos, emociones, comida, países (monumentos, animales, objetos típicos), animales, naturaleza, transporte, tecnología, música, famosos (por emblema, nunca por retrato), oficios, deportes, fiestas, ropa y cuerpo. la lista completa con sus palabras disparadoras está en [docs/CATALOGO.md](docs/CATALOGO.md) (se regenera con `node tools/catalogo_md.mjs`) y las hojas de contacto en `docs/img/catalogo-*.jpg`. cada categoría se apaga o se hace más rara desde ajustes > contenido.

para agregar uno: escribe `add(id, categoría, etiqueta, /palabras/i, [figuras], {moods})` en un `riso-props-*.js` (mira `riso-props-lib.js` para las figuras y movimientos), inclúyelo en `index.html` y corre `./tools/check.sh`: comprueba que quepa en la caja, que no pase de 900 puntos y que no dispare con frases neutras. en los patrones de palabras usa `(es)?` para el plural (`tren(es)?`), no `es?`.

## capturas reales

| | |
|---|---|
| ![palabra gigante en el gancho del verso](docs/img/palabra-gigante.jpg) | ![composición tipográfica con la palabra que se repite](docs/img/composicion.jpg) |
| ![la pareja en el estadio, en el verso donde le pide que no se vaya](docs/img/estadio.jpg) | ![subtítulos traducidos con la palabra clave resaltada](docs/img/subtitulos.jpg) |

todas salen de la app corriendo con canciones reales, sin retoques.

## la interfaz

![bienvenida con una canción sonando: el título se vuelve el titular y la carátula va en la barra](docs/img/sonando.jpg)

la bienvenida se escribe con luz: mientras espera muestra frases que se encienden letra por letra; cuando suena algo, el título de la canción pasa a ser el titular. el estado del sistema (música, claude, luces) cabe en una línea, y lo secundario vive en paneles laterales.

![panel de cómo funciona abierto sobre la bienvenida](docs/img/como-funciona.jpg)

<img src="docs/img/ajustes.jpg" alt="ajustes: canales numerados, teclas con led, faders y selectores" width="49%"> <img src="docs/img/color.jpg" alt="ajustes de color con muestras reales de cada paleta" width="49%">

![consola de reproducción: carátula, escena actual, origen del guion, controles, herramientas y barra con las estrofas marcadas](docs/img/reproductor.jpg)

la consola de reproducción aparece centrada abajo al mover el mouse: la escena que suena y de dónde sale el guion, los controles, herramientas (traducción, letra, modo autor, luces, grabar en 16:9 o 9:16, carátula, pantalla completa, ajustes, inicio) y una barra con cada estrofa marcada.

![modo carátula: la portada de protagonista con la barra flotante, el corazón de me gusta y las opciones](docs/img/caratula.jpg)

| | |
|---|---|
| ![modo carátula con el menú de opciones](docs/img/caratula-menu.jpg) | ![en el drop la portada se parte en pedazos](docs/img/caratula-drop.jpg) |
| ![cd tornasol detrás de la portada](docs/img/caratula-cd.jpg) | ![cassette detrás de la portada](docs/img/caratula-cassette.jpg) |

el modo carátula pone la portada de protagonista: siete fondos (difuminado, ambiente con los colores de la portada, escena con el video corriendo detrás, mínimo, y la portada con un vinilo, un cassette o un cd que asoman y giran), la letra en una línea o completa al lado (avanza sola y un clic salta a ese verso), tamaño de portada, latido y reloj. la portada sigue la canción: brilla en el coro, se apaga en lo triste y se parte en el drop. con apple music muestra qué canción sigue en los últimos segundos, y un corazón marca la canción como favorita (en spotify usa su atajo de teclado). los controles van en una barra flotante que se oculta sola; las opciones, en un menú que sale de ella. se abre con la tecla `c`.

los ajustes funcionan como una consola de luces: canales numerados, teclas con led, faders con escala y la paleta con muestras reales.

## personajes con identidad y tu estilo de director

las figuras de cada artista se ven igual en todas sus canciones: mismo color de luz, estatura, accesorios (gorra, gorro, capucha, lentes, cadena, aretes, moño, collar) y franja de color en la ropa, como un universo propio por artista. y lumora aprende de ti: cuando editas un video en el modo autor, anota qué cambiaste respecto al guion de claude (escenarios, colores, ánimos, transiciones, objetos, cuánta palabra gigante) y se lo pasa a claude como tu estilo en las canciones nuevas.

## modo autor

![modo autor: vista previa en vivo, línea de tiempo con estrofas y versos, e inspector](docs/img/modo-autor.jpg)

un editor para armar el video de cualquier canción a mano y al detalle. el video corre en vivo mientras editas: abajo una línea de tiempo con cada estrofa y cada verso; a la derecha un inspector para elegir, por estrofa, escenario, escenario secundario, objetos, ambiente, energía, ánimo, color, hora y transición, y por verso, la palabra clave (se elige tocándola), si va en gigante, sus objetos y una persona famosa. se parte del guion de claude o de cero, con deshacer ilimitado; se guarda solo y la próxima vez que suene esa canción manda tu versión. taxi cab de twenty one pilots queda como ejemplo de lo que se puede lograr a mano. se abre con la tecla `e`.

![modo autor: inspector del verso con la palabra clave elegida](docs/img/modo-autor-verso.jpg)

## qué hace

**el guion**
- claude (sonnet 5) lee la letra completa antes de que empiece la canción y escribe un guion por estrofa: escenario, objetos, ánimo, energía, hora del día, color y tipo de transición
- y por verso: qué aparece justo en ese verso, la palabra clave y cuándo va la palabra gigante en pantalla
- la lectura va por tramos en paralelo: el primero está listo en unos segundos y el resto termina mientras la canción ya suena. la música solo espera si el primer verso llega antes que el guion
- cada canción se analiza una vez; después arranca al instante

**lo visual**
- menú de inicio y 7 escenas ilustradas en risografía (oficina, cuarto de noche, ciudad, espacio, bosque, retrato y museo), a pantalla completa o como escenarios del director
- 20 escenarios procedurales (calle, playa, club, cielo, habitación, estadio, sistema, nebulosa, túnel, auroras…) y más de 80 objetos animados
- profundidad real con parallax, cámara que respira con el beat
- más de 35 transiciones (quiebre, glitch, remolino, iris, salto de velocidad…) elegidas según el carácter del cambio
- 10 composiciones tipográficas, letra que aparece letra por letra, palabra gigante en coros y drops
- figuras de personas, banderas reales, marcas con su logo oficial y fotos de las personas famosas que nombra la letra
- 48 perfiles de artista y estilos por género (r&b, pop, rap, reguetón, electrónica…)
- música electrónica sin letra: detector de beat y frases

**el resto**
- sincronía automática con apple music y spotify, sin cuentas ni apis de pago
- letras de lrclib; bpm de deezer; traducción en↔es y pt→es con el traductor de apple en el dispositivo
- luces govee por red local: color por compás, pulso en cada golpe, destello en los drops y brillo que sigue la intensidad de la canción
- grabar clips en mp4 de la duración que quieras, en horizontal 16:9 o vertical 9:16
- modo grabación para obs (30 fps estables)
- ajustes para todo lo de arriba, calidad automática según tu mac


## cómo funciona

```
apple music / spotify ─► bridge.py (osascript) ─► http://127.0.0.1:8888
                               │                        │
          lrclib, deezer ◄─────┤                        ▼
     traductor de apple ◄──────┤                  index.html (canvas)
      claude (guion.py) ◄──────┤                        │
     luces govee (lan) ◄───────┘◄───────────────────────┘
```

`bridge.py` es un servidor local en python: vigila qué suena, trae la letra, pide el guion a claude y controla las luces. la página es html + canvas 2d, sin frameworks.

## requisitos

- macos 26 o más nuevo (el traductor en el dispositivo lo necesita)
- apple music o spotify de escritorio
- claude: tu suscripción vía [claude code](https://claude.com/claude-code) (`claude` en el terminal, con sesión iniciada) o una clave de api en `~/.config/lumora/anthropic_key`
- xcode command line tools para compilar las herramientas nativas

## instalación

```sh
git clone https://github.com/kisnner26/lumora.git
cd lumora
./build.sh
python3 bridge.py
```

abre `http://127.0.0.1:8888/index.html` y dale play a cualquier canción. `,` abre los ajustes.

## licencia

[polyform noncommercial 1.0.0](LICENSE.md): puedes usarlo, estudiarlo y modificarlo para uso personal y sin fines comerciales. para uso comercial (streams monetizados, eventos, integrarlo en un producto) hace falta una licencia comercial: [pídela aquí](https://github.com/kisnner26/lumora/issues/new?title=licencia%20comercial).

las letras, carátulas, logos y fotos que muestra la app pertenecen a sus dueños; lumora no las incluye, las consulta en vivo.
