# qa fase 3 · la mezcla

`tools/test_mix.mjs` con el puente simulado (escenarios de `tools/mock_bridge.py`).

| caso | resultado |
|---|---|
| (a) animación a p = 0, .25, .5, .75, 1 con `RISOMIX.start({duration: 8, hold})`; capturas en `docs/img/mezcla-pasos.jpg` | ok |
| (b) cambio de canción con posición 0: mezcla fija de 3 s y termina sola | ok |
| (c) cambio con la posición nueva ya en 7 s (crossfade): dura ~10 s y empieza en p ≈ .7 | ok |
| (d) tras la mezcla el clip sigue: toma de título, luego tomas normales | ok |
| (e) con el ajuste «mezcla entre canciones» apagado, o con transiciones en «ninguna», vuelve el corte seco | ok |
| (g) repetir la misma canción no dispara la mezcla | ok |
| (h) sin errores de consola | ok |
| (f) modo portada | no probado: el modo portada no existe en la rama publicada |

revisión visual (hoja `docs/img/mezcla-pasos.jpg`): p = 0 muestra la imagen que sale en trama índigo; p = .25 ya entra la portada en naranja y el registro se abre; p = .5 hay moiré de puntos entre las dos, con el crossfader dibujado abajo; p = .75 la portada nueva llega a su sitio y se ve el título. la mezcla se lee como una sobreimpresión real de risografía.
límites: en p = 0 la imagen que sale se reimprime en trama (no es idéntica al cuadro anterior); el texto del verso saliente y el entrante se superponen a propósito.
