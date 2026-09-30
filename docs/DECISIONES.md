# decisiones

registro de las decisiones tomadas sin preguntar (fecha, fase, duda, decisión, motivo).

## 2026-09-30 · fase 0 · el repo publicado no tiene lo que el documento da por hecho
- **duda:** el documento pide reutilizar `riso-people.js` (57 objetos), `riso-share.js`, el modo portada, `RISOCLIP.h` y `RISOCLIP.cardShot`. en `feature/menu-escenas` (lo que hay en github) no existen: solo están en el mac de quien encarga.
- **decisión:** construí lo mínimo que hace falta y con las mismas formas de la api descrita: `riso-catalog.js` crea `RISO.people` (`RX`, `names`, `detect`), `riso-clip.js` exporta `RISOCLIP.h` y `RISOCLIP.makeShot`, y los seguros del clip (`pending` sin corte, salida del cierre si el tiempo retrocede) se añadieron. no se creó `riso-share.js` en la fase 0; la fase 2 crea su propio módulo de captura con el patrón descrito (stage propio, escena registrada, exportación a tamaño exacto).
- **motivo:** no puedo leer ni inventar archivos que no están en el repo, y bloquear todo por eso contradice la regla de autonomía.
- **consecuencia (importante):** cuando se traiga esta rama al mac, los archivos locales `riso-people.js`, `riso-share.js` y la portada pueden chocar con los de esta rama. `riso-catalog.js` hace `Object.assign(R.people, ...)` sin borrar lo previo, pero el orden de carga y los ids repetidos hay que revisarlos (ver `docs/PENDIENTE-MAC.md`).

## 2026-09-30 · fase 0 · puente simulado en el puerto 8899
- `tools/mock_bridge.py` usa el 8899 (no el 8888) para no chocar con `bridge.py`.

## 2026-09-30 · fase 0 · fallo corregido en riso-props.js
- el último trazo de cada dibujo se detenía al 90 % con `P.p = 1`; se ajustó la fórmula del avance (`p * (n * .9 + .1)`).
- 15 de los 30 dibujos originales se salían de la caja -200..200; se añadió una tabla de encaje (`ADJ`) medida con `tools/test_props.mjs`, sin cambiar sus ids.

## 2026-09-30 · fase 0 · nuevos tipos de control en ajustes
- `SETUI.addRow(sección, [clave, etiqueta, tipo, arg, pista], porDefecto)` permite que cada archivo (que carga después de settings.js) agregue filas. tipos nuevos: `text`, `chips` (objeto {id: bool}), `btn` (acción con confirmación en dos toques).

## 2026-09-30 · fase 1 · banderas
- **hojas de contacto en jpg, no png:** con el grano de papel un png de 1600x900 pesa 1 a 2 mb; se guardan como jpg (calidad ~85) para no inflar el repositorio.
- **banderas no verificadas contra fuente:** no hay acceso a internet desde este entorno, así que las 69 banderas están dibujadas de memoria (proporciones, franjas, colores y figuras). todas están "no verificadas contra fuente autorizada". las más simplificadas o débiles: corea del sur (trigramas apenas insinuados), reino unido (las cruces se leen pero el patrón es aproximado), sudáfrica (la Y verde es una franja), arabia saudí (sin la inscripción ni la espada), bandera de brasil (banda sin lema), los escudos de méxico, nicaragua, el salvador, guatemala, ecuador, bolivia y paraguay (círculos y triángulos simbólicos, no los escudos reales).
- **mapeo de colores a tres tintas:** cada bandera tiene un juego de tintas propio (el clip lo aplica al elegir la toma). tabla en el encabezado de `riso-props-banderas.js`. limitación: el rojo cae en tinta 2 (naranja, rosa o rojo según el juego) y en las banderas verdes el rojo se ve rosa (juego verde y rosa); el verde de las banderas con azul y rojo se aproxima con trama de la tinta 1. no se reconoce el rojo puro en el juego índigo y naranja: es naranja rojizo.
- **detección:** cada bandera reutiliza la expresión de `NATIONS` (symbols.js/reality.js) cuando el país existe ahí y añade gentilicios y ciudades propios (nica, boricua, paisa...). respeta "Banderas y marcas" (`CFG.symbols`) y el chip «banderas de países».
- **bandera sola:** cuando el verso nombra un país, la toma muestra solo la bandera (sin acompañar con otros objetos) y con sus tintas.

## 2026-09-30 · fase 2 · póster de la canción
- **no existe `riso-share.js` en el repo publicado:** se hizo el póster con un segundo `RISO.Stage` propio (escena registrada `poster`, fuera del menú) y exportación a tamaño exacto (`resize(W / dpr, H / dpr)`), siguiendo el patrón descrito. cuando exista `riso-share.js` en el mac, conviene que ambos compartan el helper de exportación.
- **miniaturas pegadas después del shader:** las cuatro tomas guardadas ya están impresas (rgb con grano y trama); si se dibujaran en la plancha, el shader las volvería a tramar. se pegan encima del resultado, con un borde en la tinta 1 del juego elegido.
- **tempo:** solo aparece si hubo audio real (`AUD.live`) durante la canción; en el puente simulado casi nunca, así que casi siempre se omite.
- **variantes:** 6 juegos de tintas x 2 composiciones (la portada arriba o abajo). «otra variante» las recorre.
- **capturas:** cada casilla toma una toma distinta (se compara la semilla) y espera a que el dibujo termine de trazarse (1,25 s). si no llegan los eventos (canción corta o sin letra), las fracciones 10, 38, 62 y 88 % de la duración las disparan.
- **prueba lenta:** `tools/lento_poster.mjs` tarda unos 4 minutos con webgl por software; solo corre con `tools/check.sh todo`.
- **póster de canciones sin letra:** la palabra grande es la primera del título y los versos/estrofas salen como «—».

## 2026-09-30 · fase 3 · la mezcla
- **duración con solape ya empezado (desvío de la fórmula):** la especificación dice `D = max(3, pos)` limitado a [3, 12] y `p0 = min(.9, pos / D)`. con esa fórmula, `D = pos` da `p0 = 1 → .9` y quedaba solo el 10 % de la mezcla (menos de un segundo). se usó `D = clamp(pos + 3, 3, 12)` (se estiman 3 s por delante) y `p0 = min(.9, pos / D)`. para pos = 7 s: D = 10 s, p0 = .7. sin solape (pos ≤ 1,5 s): 3 s fijos.
- **avance por reloj de pared:** el avance de `p` usa `performance.now()`, no el `dt` del cuadro, porque el audio se solapa en tiempo real aunque el dibujo vaya lento (en la nube, a 5 fps, con `dt` la mezcla de 3 s duraba 8 s).
- **moiré e interferencia:** en vez de calcular el moiré a mano, se imprimen las dos imágenes en tintas distintas (tinta 1 y tinta 2, cuyas rejillas de trama tienen ángulos de 15 y 75 grados en el shader) y una copia girada de la portada en la tinta 3; las tintas se multiplican en el shader.
- **al terminar, sin salto:** la toma de título de la canción nueva se prepara al empezar, se funde por encima desde p = .5 (mezcla de densidades de tinta) y es la misma que sigue después. la toma de título dura al menos 1,8 s antes de pasar a la siguiente.
- **el modo portada no existe en la rama publicada:** la mezcla se construyó sobre el clip; no se pudo probar el modo portada.
- **fases 2 y 3 en un solo commit:** los cambios de ambas comparten `riso-clip.js` e `index.html`.

- oleada 1: alias "té" y "baby" quitados de taza/cuna por falsos positivos (tú, cariño); se mantienen "tea" y "bebé".
- oleada 2: los dibujos de países no nombran al país (monumento, animal, objeto); alias genéricos (rey, puente, isla, solo) excluidos.
