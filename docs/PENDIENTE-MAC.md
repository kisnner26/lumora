# pendiente de probar en el mac

cosas que aquí no se pueden verificar. cada una se construyó según la especificación y se probó con simulación.

## integración de la rama con lo que solo existe en el mac
1. ~~la rama publicada no traía `riso-people.js`, `riso-share.js` ni el modo portada~~ **resuelto en `feature/integracion`**: se fusionó `feature/menu-escenas`. el `riso-share.js` del agente (colección, dedicatoria, enlace) pasó a llamarse `riso-compartir.js`; `riso-share.js` es la captura de versos. ver docs/DECISIONES.md.
2. abre la app, deja sonar una canción y comprueba en la consola: `RISO.people.RX.length`, `Object.keys(RISO.props.DEFS).length`.

## fase 3 · la mezcla con una canción real
no sé si Música y Spotify informan de la canción nueva al empezar o al terminar el solape. la implementación asume que informan cuando empieza a sonar la nueva (posición pequeña o ya avanzada).
1. activa «mezcla de canciones» (crossfade) en Música (ajustes › reproducción) o la mezcla de Spotify, con 6 a 12 s.
2. abre lumora con el videoclip y deja sonar una canción hasta unos 20 s antes del final.
3. en la consola del navegador ejecuta, antes del cambio: `window.__lg=[];setInterval(()=>__lg.push([Date.now(),ext.st.name,+ext.now().toFixed(1),ext.st.dur,ext.st.state]),400)`.
4. deja que cambie la canción. después: `copy(JSON.stringify(__lg.filter((r,i,a)=>!i||r[1]!==a[i-1][1]||i%5==0)))`.
5. observa: (a) ¿el `name` cambia al empezar el solape o al terminar? (b) ¿la posición de la nueva empieza en 0 o ya en varios segundos? (c) ¿la mezcla visual dura lo que dura el audio? revisa `RISOMIX.log` (from, to, D, p0).
6. ajuste: si el nombre cambia al terminar el solape, la mezcla llega tarde; en ese caso hay que adelantarla desde los últimos segundos usando `ext.st.dur - ext.now()` (empezar la mezcla al entrar en el crossfade). si cambia al empezar y la posición ya viene avanzada, revisa que D = pos + 3 sea razonable con tu duración de crossfade y cambia el +3 en `riso-mix.js` (`M.onSongChange`).
7. probar también con el modo portada si existe en tu copia (no probado aquí).

## fase 5 (efectos de cine)
- comprobar en el Mac que la tinta líquida y el papel rasgado corren a 60 fps con WebGL real (aquí solo se probó con SwiftShader y el tiempo congelado).
- mirar a ojo si la sacudida de las palabras con peso es cómoda con el modo «destellos» apagado; si molesta, bajar `kick` en riso-fx.js.

## fase 6 (compartir y memoria)
- activar GitHub Pages sobre la carpeta `docs/` del repositorio (o poner tu propia página en ajustes > imagen > «Página del enlace»); hasta entonces el enlace de ver.html no abre desde fuera.
- probar «compartir» y «copiar enlace» en Safari/Chrome del Mac (el portapapeles y share sheet no se pueden probar aquí).

## fase 7 (exploración)
- ver en el Mac la criatura animada (se repinta cada 140 ms con el Stage auxiliar); si se nota pesada con el clip sonando, bajar la frecuencia en `riso-explorar.js` (`setTimeout(tick, 140)`).
- el historial y las letras se llenan con el uso real: probar el mapa y el atlas después de oír varias canciones para ver que las ciudades de las letras se encienden.

## fase 9 (experimentales)
- escritorio vivo: probar la opción D (Plash o similar apuntando a `?fx=espacio`) y medir CPU/GPU; si vale, construir la app nativa del estudio (docs/VIABILIDAD-ESCRITORIO-VIVO.md). Sin hacer.
- WebXR: probar `?xr=1` en un Quest o Vision Pro (el navegador del visor, por HTTPS o localhost con reenvío): comprobar «entrar en VR», la orientación (no se ve invertido ni girado) y el rendimiento. El código de sesión está escrito pero **no se ha ejecutado nunca** con un visor.
- abrir el PNG 360° exportado en un visor 360° (Quest Gallery, Facebook, Google Earth VR…) y revisar que la costura no se vea.

## fase 4 (catálogo)
- mirar a ojo en el Mac con canciones reales que los dibujos disparen con sentido (las hojas de contacto y las pruebas de detección son con frases de prueba). Si alguno aparece fuera de lugar, quitar su palabra en el patrón del dibujo (`riso-props-*.js`).
- dibujos flojos anotados en docs/QA/fase-4-oleada-*.md (famosos, sombreros de oficios, lobo, serpiente, dragón, brazo fuerte…): mejorarlos si molestan.

## fase 8 (ajustes)
- probar «alto contraste» y «reducir movimiento» con el clip sonando en el Mac y revisar que ningún texto quede ilegible; y la vista previa a 60 fps mientras suena música (usa un segundo Stage).
- en el Mac también: confirmar que los ajustes de «looks» se ven bien con tu paleta y tus luces Govee.

## artistas cantando con micrófono
- verificado con el puente simulado (tools/test_cantantes.mjs: créditos, solo, trío, turnos, apagado; capturas revisadas). Falta verlo con tus canciones reales: que los nombres de artista de Música/Spotify (p. ej. «Bad Bunny, Jhay Cortez») se separen bien y que la figura y las medallas se vean bien mezcladas con la letra. Se apaga en ajustes > contenido > «Artistas cantando».
- el turno del micrófono va por orden de versos, no por detección de voz.
