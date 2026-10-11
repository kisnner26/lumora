# gameplay de gimme more

metraje aportado por el usuario: `【4K】 "BRITNEY NO SCLEARS" by wabas | Geometry Dash 2.2.mp4`.

se conservan los primeros 80 segundos en h.264, 1280 × 720 y 30 fps. se elimina la pista de audio para que la música siga saliendo del reproductor original. el archivo no se amplía a 4k.

`gimme-more-beats.json` contiene una rejilla estimada a partir del flujo espectral del audio original, refinada buscando coincidencias de pulsos a lo largo del clip. incluye energía rms y fuerza del ataque por pulso, calculadas con ventanas de 10 ms del audio aportado mediante `tools/analyze_frames.py`. la fase pertenece a este metraje; no es una certificación del tempo de todas las ediciones de la canción.

la licencia del software no transfiere derechos sobre el gameplay aportado.

`gimme-more-boost.mp4` es la edición temporal muda del gameplay: aceleraciones, ralentizaciones y congelados seleccionados según el audio y la actividad visual. `gimme-more-edit.json` registra el plan y los hashes. se reconstruye con `tools/edit_frames.py`; el reproductor no necesita renderizarlo ni instalar ffmpeg al activar el boost.
