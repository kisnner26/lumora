# fase 6, compartir y memoria

- **colección de pósters** (`riso-compartir.js`, antes `riso-share.js`): cada póster que se arma se guarda solo en este navegador (RISOSTORE «posters», tope 60, lo más viejo primero). Ajustes > imagen > «Colección de pósters» y el botón «colección» de la ventana del póster abren la lista: ver (rehidrata la portada y reabre el póster para volver a imprimirlo en otra variante o formato) y borrar (con confirmación). Captura: docs/img/share-coleccion.jpg.
- **dedicatoria**: campo en la ventana del póster (90 letras). Se imprime a mano en una tarjeta con cinta entre las tomas y el pie; se guarda con el póster y en «dedicatorias» (tope 40). Captura: docs/img/share-poster-dedicatoria.jpg.
- **enlace pequeño**: «copiar enlace» arma `<página>#<datos>`; los datos (título, artista, palabra, ánimo, dedicatoria, duración, versos, estrofas, tinta) son un JSON en base64url, unos 260 caracteres. El fragmento no viaja a ningún servidor. `docs/ver.html` lo dibuja con el mismo estilo (paleta de la variante) y todo texto entra con `textContent`. Captura: docs/img/share-ver.jpg.
- página base configurable (ajustes > imagen); por defecto https://kisnner26.github.io/lumora/ver.html.
- pruebas (tools/test_share.mjs): guardado, colección, ver, dedicatoria (póster + colección + historial), tamaño del enlace, dibujo de ver.html, HTML malicioso mostrado como texto, enlace roto o ausente, base cambiada, borrar.
- error encontrado al mirar la captura: la dedicatoria se declaró después de usarse (póster en blanco); corregido moviendo el bloque. Con dedicatoria la palabra grande baja de alto para no apretar las tomas.
- no verificado aquí: que GitHub Pages esté activado sobre `docs/` → docs/PENDIENTE-MAC.md.
