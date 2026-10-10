# modo carátula

![captura real de carátula](media/caratula-editorial.png)

abre la carátula y entra al menú del reproductor:

- **letra:** cuatro familias tipográficas, alineación, tamaño del verso, letra completa y traducción; ancho, interlineado, espaciado, posición vertical y verso siguiente.
- **diseño:** composiciones editorial, centrada e inmersiva; sesiones preparadas para lectura o escucha nocturna, concentración y un estilo personal guardado en esta mac.
- **sonido:** conserva los efectos de audio disponibles en lumora.

la letra completa permite saltar al verso con clic o teclado. se actualizan traducciones y correcciones aunque el número de versos no cambie. el reloj de las letras funciona independientemente del motor visual anterior.

«guardar escena» descarga una composición limpia en png de 1920 × 1080. las grabaciones hechas con carátula abierta usan esta composición, su tipografía y traducción. la exportación muestra el verso actual; los adornos animados de vinilo, cd y otros fondos no se reproducen en ella.

![carátula en una ventana estrecha](media/caratula-movil.png)

las preferencias se conservan al reiniciar. el movimiento reducido respeta tanto macos como el ajuste de lumora. el diseño se adapta a ventanas estrechas.

validación: `tools/test_cover_design.mjs` cubre ajustes, persistencia, estilo personal, teclado, salto al verso, png, exportación, móvil y movimiento reducido; `tools/test_cover.mjs` cubre las funciones existentes.
