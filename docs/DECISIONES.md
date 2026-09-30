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
