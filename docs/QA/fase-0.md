# qa fase 0 · cimientos

probado con `tools/check.sh` (puente simulado en el 8899, chromium sin pantalla, webgl por software).

| prueba | resultado |
|---|---|
| sintaxis de todos los .js | ok |
| smoke: el videoclip arranca con el puente simulado, sin errores de consola | ok |
| `test_store.mjs`: set/get/add/list/del, tope y limpieza (70 pósters, tope 60), historial al empezar, cambio de canción guarda la letra de la anterior | ok (7/7) |
| `test_props.mjs`: 41 dibujos sin excepción, dentro de -200..200, menos de 900 puntos, con trazos | ok |

- hallazgo: el último trazo de cada dibujo no llegaba al 100 %; corregido.
- hallazgo: 15 dibujos originales se salían de la caja; corregido con una tabla de encaje.
- no probado: IndexedDB real de safari/chrome en mac (aquí sí funciona el de chromium); el respaldo en localStorage se ejercita solo si indexedDB falla.
