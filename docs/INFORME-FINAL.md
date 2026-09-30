# informe final · rama feature/catalogo-pro

rama: `feature/catalogo-pro` (sale de `feature/menu-escenas`). No se hizo merge a `main`.
Para verla: `git fetch origin && git checkout feature/catalogo-pro`.

## qué se hizo, por fase

| fase | resultado | pruebas | evidencia |
|---|---|---|---|
| 0 cimientos | almacenamiento local (IndexedDB con respaldo), catálogo declarativo, puente simulado, smoke, galería de dibujos, último trazo al 100 % | test_store, test_props, smoke | docs/QA/fase-0.md |
| 1 banderas | 69 banderas con tela que ondea, tintas propias y detección bilingüe | test_deteccion, test_props | docs/QA/fase-1.md, docs/img/catalogo-banderas-*.jpg |
| 2 póster | lámina imprimible al terminar la canción (A4 y 9:16, 12 variantes) | lento_poster | docs/QA/fase-2.md, docs/img/poster-*.jpg |
| 3 mezcla | sobreimpresión de tintas, moiré y crossfader entre canciones | test_mix | docs/QA/fase-3.md |
| 4 catálogo | **739 dibujos** en 18 categorías (meta ~555), variantes de 33 conceptos, 68 frases de detección y 19 negativas | test_props, test_deteccion | docs/CATALOGO.md, docs/QA/fase-4-oleada-1..4.md |
| 5 cine | tinta líquida, papel rasgado, palabras con peso, taller de impresión | test_fx | docs/QA/fase-5.md, docs/img/fx-*.jpg |
| 6 compartir | colección de pósters, dedicatoria, enlace pequeño + docs/ver.html | test_share | docs/QA/fase-6.md, docs/img/share-*.jpg |
| 7 explorar | mapa de 71 ciudades, atlas de tu música, criatura | test_explorar | docs/QA/fase-7.md, docs/img/exp-*.jpg |
| 8 ajustes | buscador, vista previa, restablecer por sección, looks, accesibilidad, memoria | test_ajustes | docs/QA/fase-8.md, docs/img/aj-*.jpg |
| 9 experimentales | estudio del escritorio vivo (sin código) y 360° mínimo con visor WebXR | test_xr | docs/VIABILIDAD-ESCRITORIO-VIVO.md, docs/QA/fase-9.md |

`./tools/check.sh` (y `./tools/check.sh todo` con las pruebas lentas) corre todo: sintaxis, pruebas de dibujos, detección, almacenamiento, mezcla, efectos, compartir, explorar, ajustes, 360° y el smoke del clip.

## qué NO está verificado (y por qué)
Declarado como no verificado, nunca como hecho. Detalle y pasos en docs/PENDIENTE-MAC.md.
- la mezcla con una canción real de Música/Spotify (solo con el puente simulado),
- el rendimiento a 60 fps de tinta líquida, papel rasgado, criatura y vista previa (aquí: navegador por software, tiempo congelado),
- el portapapeles, compartir y GitHub Pages para el enlace de `docs/ver.html`,
- **el modo VR de WebXR**: el código de sesión está escrito y nunca se ejecutó con un visor,
- el escritorio vivo: solo estudio,
- que los dibujos disparen con sentido con letras reales (solo con frases de prueba).

## diferencias con lo pedido
- 739 dibujos en vez de ~555; 71 ciudades en vez de ~60; países 46 de 50, fiestas 23 de 25, deportes 14 de 15, ropa 17 de 20.
- los famosos (59) van por emblema, nunca retrato; sin políticos ni líderes religiosos.
- el retrato de «ella» sigue apartado en `extras/` y desactivado; las fotos no se suben.
- el escritorio vivo no se implementó (solo estudio), tal como pedía la fase 9.

## errores reales encontrados con las capturas
póster en blanco por una constante declarada tarde; el mapa tapando los botones por una regla global de `canvas`; el nombre «Moundefinedundefined» por `>>` con enteros grandes; patrones `Xes?` que no disparaban en singular (tren, león…); humos fuera de la caja; «tamaño de letra» sin efecto en el clip ilustrado. Todos corregidos y cubiertos por pruebas.

## dónde mirar
README (secciones nuevas: catálogo, efectos de cine, compartir, explorar, ajustes), docs/DECISIONES.md (decisiones tomadas sin preguntar), docs/PENDIENTE-MAC.md, docs/QA/.
