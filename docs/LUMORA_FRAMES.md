# lumora frames

«gimme more» de britney spears activa el gameplay aportado durante los primeros 1:20 del reloj de la canción. funciona con los metadatos del puente de apple music y spotify; no modifica sus colas ni reproduce una segunda pista de audio. los remixes y otros artistas no activan la regla.

al llegar a 1:20 continúa fábula o risografía, según la selección actual. pausar, retroceder o adelantar mueve también el vídeo. carátula, inicio y los modos clásico o portada suspenden la decodificación del metraje. si falta el archivo, continúa el motor procedural.

el botón **boost with lumora frames** aparece únicamente en la barra del modo edición. activa o desactiva el montaje en un clic y conserva la preferencia. también trata las animaciones procedurales de otras canciones.

el boost del metraje externo genera una edición completa: en gimme more son 38 tomas de cuatro pulsos, con ocho tratamientos (cine, tríptico, franjas diagonales, espejo, película, túnel, pantalla dividida y cámara orbital) y cinco transiciones (barrido, obturador, iris, desplazamiento y prisma). el plan cubre los 80 segundos, con cortes de encuadre y composición, separación cromática y bandas desplazadas en los ataques. no reordena el tiempo del gameplay ni altera su velocidad o el audio del reproductor.

la intensidad utiliza energía rms y ataques analizados del audio aportado, además de la rejilla de pulsos estimada. el análisis se puede reproducir con `python3 tools/analyze_frames.py archivo-original.mp4 media/frames/gimme-more-beats.json`. el movimiento reducido conserva el metraje original; desactivar destellos evita el acento luminoso.

el mismo compositor procesa los vídeos incrustados de grief con su tempo de 135 bpm; sin análisis de energía disponible usa una intensidad base. las animaciones procedurales mantienen su tratamiento anterior. el botón sigue siendo exclusivo del editor.

el montaje se calcula a partir de la posición musical para que un salto no acumule animaciones anteriores. son tratamientos nativos del lienzo de lumora, siguiendo las guías de hyperframes y el patrón de barrido compartido de `whip-pan-cut` del registro; no requieren su cli ni una cuenta durante la reproducción.

las letras sincronizadas aparecen encima del gameplay, después de los efectos. respetan traducción, tamaño, desfase y mostrar u ocultar letra; fábula utiliza tipografía de novela y risografía su tipografía habitual. al llegar a 1:20 se corta al motor seleccionado sin duplicar las letras.

la grabación incluye el gameplay, las letras y el boost. las exportaciones continúan sin audio, como el grabador existente.

validación: `tools/test_frames.mjs` comprueba la entrada real desde el menú, los metadatos de ambos reproductores, variantes de título, pausa, seek, reproducción, 80 segundos, ambos motores, letras visibles, traducción, tamaño, desfase, botón exclusivo del editor, exportación, persistencia, movimiento reducido y fallo de carga. `tools/test_frames_montage.mjs` verifica cobertura de todas las tomas, ocho tratamientos, cinco transiciones, respuesta a energía, cambios sustanciales en píxeles, seeks deterministas e integración con el video real. `tools/test_media_http.py` comprueba rangos http para webkit.

para generar solamente la app firmada localmente: `sh tools/empaquetar.sh --app-only`.
