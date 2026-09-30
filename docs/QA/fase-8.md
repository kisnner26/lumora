# fase 8, ajustes

Nuevo `riso-ajustes.js` (se carga al final); el panel pasa de 6 a 9 secciones.

- **buscador**: campo arriba del panel; filtra filas por nombre o descripción, sin tildes y sin distinguir mayúsculas, oculta secciones vacías y sus botones del riel, y avisa si no hay resultados (Esc lo limpia). Captura: docs/img/aj-busqueda.jpg.
- **restablecer por sección**: botón «restablecer» en cada título de sección (menos luces, que tiene sus propios controles); vuelve a los valores de fábrica solo de esa sección (los chips, como catOn y fxCine, vuelven a todo encendido). El «restablecer todo» de siempre sigue.
- **vista previa**: miniatura viva arriba del panel (segundo Stage) con un verso escrito a mano, el dibujo, tu tamaño de letra, «letra sobre papel», traducción y marcas del taller; se repinta (260 ms de espera) al tocar cualquier ajuste y dice qué muestra (tamaño, traducción, efectos). Captura: docs/img/aj-panel.jpg.
- **looks** (sección 07): seis conjuntos (risografía clásica, cine nocturno, calma, fiesta, lectura, mínimo) y «mi look» (guardar lo de ahora y volver). El activo se reconoce solo y se marca. Captura: docs/img/aj-looks.jpg.
- **accesibilidad** (08): reducir movimiento (corte seco en vez de cortes con movimiento, cámara casi quieta, sin tinta/papel/golpes/desajuste de registro, sin kick), alto contraste (clase `hc`: bordes gruesos, texto oscuro, sin trama sobre etiquetas; captura docs/img/aj-contraste.jpg), letra sobre papel y tamaño de la letra (ahora sí afecta al videoclip ilustrado: escala `writeLine`).
- **memoria** (09): cuántos registros guarda lumora en este navegador y botones con doble toque para borrar historial, letras, pósters, dedicatorias y el nombre de la criatura.
- pruebas (tools/test_ajustes.mjs): secciones y riel, búsqueda (con/sin tildes, sin resultados, limpiar), restablecer por sección sin tocar otras, looks (aplicar, detectar activo, guardar y volver), vista previa (dibuja y cambia con los ajustes), reducir movimiento, alto contraste y memoria con confirmación.
- arreglado de paso: «Tamaño» de letra no hacía nada en el clip ilustrado.
