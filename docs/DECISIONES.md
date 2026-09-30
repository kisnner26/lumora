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
