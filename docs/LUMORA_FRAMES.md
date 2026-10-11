# lumora frames

«gimme more» de britney spears activa 80 segundos del gameplay aportado usando metadatos de apple music o spotify. al llegar a 1:20 continúa fábula o risografía. los remixes y otros artistas no activan esta regla.

**boost with lumora frames** aparece únicamente en el editor. alterna entre el original y una edición temporal compilada, ambos sin audio. la canción continúa saliendo del reproductor externo. pausa, búsqueda y grabación comparten el reloj musical; las letras, traducción, tamaño y desfase se componen encima del video.

las letras sobre gameplay usan un bloque tipográfico con mayor jerarquía, entrada escalonada por renglón, pulsación leve, barrido de énfasis y subrayado de la palabra activa. el barrido se estima entre tiempos de versos; no equivale a alineación vocal palabra por palabra. un muestreo de 48 × 27 del video aporta luminosidad, color y foco visual para adaptar contraste, acento y desplazamiento sutil. las posiciones se calculan una vez por composición y el reloj musical permite pausar, buscar y exportar sin cambiar el resultado. respeta tamaño, traducción, desfase, «letra por letra», «sin destellos» y movimiento reducido. gimme more y grief comparten este tratamiento.

el montaje sustituye la antigua rotación de espejos, túneles y paneles. analiza energía por bloques de 16 pulsos y actividad visual del metraje para seleccionar acentos. conserva planos largos entre acentos, acelera antes de algunos ataques, congela brevemente el momento seleccionado y libera el movimiento a menor velocidad. los cambios de velocidad y selección de tiempo fuente existen en el archivo renderizado. los fundidos y barridos se reservan para cambios de energía, con cortes directos en los demás planos. el cierre recupera gameplay activo antes de los créditos estáticos.

el boost añade iluminación en tiempo real sobre el montaje: bloom selectivo en luces, separación radial de canales rgb en los ataques y paletas cian, magenta, violeta y ámbar que evolucionan por frases. la energía y la fuerza de ataque proceden de la rejilla musical; buscar un segundo reproduce el mismo tratamiento. el postproceso sucede antes de las letras y también entra en la grabación. usa tres pasadas webgl, bloom limitado a 480 píxeles de ancho y salida de hasta 1280; dispone de alternativa canvas. desactivar destellos elimina los pulsos de luz y movimiento reducido recupera el original. los demás videos incrustados usan su tempo declarado.

la rejilla de pulsos es una estimación del audio aportado; los bloques no son etiquetas certificadas de verso o coro. el plan está en `media/frames/gimme-more-edit.json`, con intervalos de salida, tiempo fuente, velocidad, encuadre y motivo de cada decisión. incluye hashes del original y del render. el generador usa una dirección inspirada en el patrón `beat-freeze-cut` del registro de hyperframes, implementada con ffmpeg; no ejecuta el cli de hyperframes durante la reproducción.

para reconstruir el montaje con el metraje local:

```sh
python3 tools/edit_frames.py media/frames/gimme-more.mp4 media/frames/gimme-more-beats.json media/frames/gimme-more-edit.json --output media/frames/gimme-more-boost.mp4
```

el render conserva 1280 × 720, 30 fps, 2400 frames y 80 segundos, sin pista de audio. movimiento reducido recupera el original. si falta el render, se reproduce el gameplay original. inicio, carátula, cambio de canción y el final del intervalo pausan ambos decodificadores. los otros videos conservan una capa de cámara ligera; no heredan los antiguos collages.

`tools/test_frames_lyrics.mjs` verifica animación, reacción al fondo, legibilidad, límites, controles y búsqueda. `tools/test_frames_light.mjs` comprueba bloom selectivo, negros, separación rgb, paletas, ritmo, búsqueda determinista y alternativa canvas. `tools/test_frames.mjs` cubre ambos reproductores, letras y grabación. `tools/test_frames_montage.mjs` verifica la selección de fuente, render real, duración, búsqueda determinista y fallback. `python3 tools/test_edit_frames.py` comprueba dirección por actividad visual y congelados presentes en los frames. `python3 tools/test_media_http.py` comprueba los rangos usados por webkit.

para empaquetar la app localmente: `sh tools/empaquetar.sh --app-only`.
