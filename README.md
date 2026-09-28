# lumora

lyric videos en vivo para lo que suena en tu mac. le das play en apple music o spotify y lumora arma el video solo: letra sincronizada letra por letra, escenarios procedurales, tipografía cinética y subtítulos traducidos. antes de empezar, claude lee la canción completa y decide qué se ve en cada verso, para que las imágenes tengan que ver con lo que dice la letra y no sean decoración al azar.

página del producto: **https://kisnner26.github.io/lumora**

[![promo de lumora: el coro con la letra cinética y los subtítulos traducidos](docs/img/promo.gif)](https://kisnner26.github.io/lumora/#demo)

**[ver el promo completo (67 s)](https://kisnner26.github.io/lumora/#demo)** · hecho con una grabación real de lumora, con sonido.

![una canción de amor: la pareja, los corazones y la palabra que remata el verso, elegidos por claude](docs/img/estreno.jpg)

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
