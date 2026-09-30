# qa fase 2 · póster de la canción

prueba: `tools/lento_poster.mjs` con el puente simulado (canción normal, corta de 45 s y sin letra). se recorre la canción en 6 saltos hasta el 93 % y se comprueba que se capturen las 4 tomas; después se renderizan A4 (2480x3508) y 9:16 (1620x2880) en dos variantes cada uno.

| caso | resultado |
|---|---|
| canción normal, corta y sin letra: 4 tomas capturadas | ok |
| A4 variante 0 y 1, 9:16 variante 0 y 3: tamaño exacto | ok |
| el póster se genera y se avisa sin interrumpir la canción siguiente | ok (aviso «póster listo», no modal) |

revisión visual (capturas guardadas en /tmp/poster-*.jpg y en `docs/img/catalogo-poster-*.jpg`):
- problemas encontrados y corregidos: el título y el artista se salían de la columna; las casillas 2 y 3 repetían la misma toma; el pie se cortaba en 9:16; en A4 la última fila de miniaturas se salía de la hoja (se achican para caber).
- pendiente de calidad: la palabra grande de una canción sin letra es el título; la variante B en A4 deja bastante aire.
