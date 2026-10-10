# lumora frames

«gimme more» de britney spears activa el gameplay aportado durante los primeros 1:20 del reloj de la canción. funciona con los metadatos del puente de apple music y spotify; no modifica sus colas ni reproduce una segunda pista de audio. los remixes y otros artistas no activan la regla.

al llegar a 1:20 continúa fábula o risografía, según la selección actual. pausar, retroceder o adelantar mueve también el vídeo. carátula, inicio y los modos clásico o portada suspenden la decodificación del metraje. si falta el archivo, continúa el motor procedural y se muestra el aviso.

el botón **boost with lumora frames** aparece junto al gameplay y en «más herramientas» del reproductor. activa o desactiva el montaje en un clic y conserva la preferencia. también trata las animaciones procedurales de otras canciones.

los encuadres de acercamiento, retroceso y paneo, ecos de imagen y barridos cambian cada ocho pulsos. el gameplay mantiene su continuidad y velocidad original; los efectos no adelantan ni retrasan el contenido. se usa la rejilla analizada del archivo para este clip, el tempo disponible en lumora para otros temas y los pulsos de audio en vivo cuando están disponibles. el movimiento reducido desactiva los tratamientos de cámara y las transiciones de movimiento.

el montaje se calcula a partir de la posición musical para que un salto no acumule animaciones anteriores. son tratamientos nativos del lienzo de lumora inspirados en la coreografía de hyperframes; no requieren su cli ni una cuenta durante la reproducción.

la grabación incluye el gameplay y el boost. las exportaciones continúan sin audio, como el grabador existente.

validación: `tools/test_frames.mjs` comprueba la entrada real desde el menú, los metadatos de ambos reproductores, variantes de título, pausa, seek, reproducción, 80 segundos, ambos motores, exportación, persistencia, movimiento reducido y fallo de carga. `tools/test_media_http.py` comprueba rangos http para webkit.

para generar solamente la app firmada localmente: `sh tools/empaquetar.sh --app-only`.
