# rendimiento · 2026-10-11

## cambios

- los filtros reciben imágenes acotadas a 1280 píxeles por lado mayor; bloom y tinta comparten el fotograma reducido cuando procede.
- las texturas conservan su almacenamiento entre cuadros y se actualizan con `texSubImage2D`. se elimina la conservación del framebuffer fuera del dibujo síncrono.
- carátula conserva los nodos de texto, limita la comprobación completa de letras a cuatro veces por segundo y detiene su bucle cuando está cerrada u oculta.
- risografía y fábula suspenden el videoclip detrás del menú, los fondos y una carátula opaca. «escena» y la grabación siguen renderizándolo; letras, reloj, pulso y sección continúan actualizándose.
- menú y fondos respetan el límite de cuadros configurado. el render oculto se suspende sin omitir la actualización de audio y luces.

## medición local

`node tools/bench_render.mjs`, con playwright y el puente simulado. fuente canvas de 3840×2160, salida 1280×720, bloom y puntillismo activos. 24 cuadros, cuatro de calentamiento; el tiempo incluye dibujo y lectura de un píxel para completar el trabajo pendiente. la segunda medida observa mutaciones del dom durante 1,6 segundos con carátula pausada y letra completa.

| medida | antes | después |
| --- | ---: | ---: |
| procesamiento mediano de filtros | 12,2 ms | 5,3 ms |
| percentil 95 de filtros | 17,2 ms | 7,7 ms |
| mutaciones de carátula | 404 | 36 |

son mediciones del navegador local en esta mac y esta carga, no una garantía de fps en todos los equipos ni una medición nativa de webkit. el benchmark imprime sus resultados para repetir la comparación; no impone umbrales de tiempo inestables.

## regresión

`node tools/test_render_performance.mjs` verifica tamaños y reutilización de texturas, pausa del render tapado, excepciones de escena y grabación, cambios de letra en el mismo array, suspensión y reanudación de carátula y continuidad del servicio de luces. no controla reproductores ni dispositivos reales.

la suite general completó el smoke y las comprobaciones funcionales. cuatro pruebas (efectos, compartir, almacenamiento y distribución web) fallaron durante un episodio de falta de espacio o arranque del navegador; las cuatro pasaron al repetirlas tras retirar temporales. la app instalada pasó la verificación de firma y de los siete binarios nativos.
