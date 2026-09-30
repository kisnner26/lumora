# pendiente de probar en el mac

cosas que aquí no se pueden verificar. cada una se construyó según la especificación y se probó con simulación.

## integración de la rama con lo que solo existe en el mac
1. la rama publicada no traía `riso-people.js`, `riso-share.js` ni el modo portada. si en tu mac existen, al traer `feature/catalogo-pro`: `git fetch origin && git checkout feature/catalogo-pro`, luego copia tus archivos locales encima y revisa que `index.html` cargue `riso-catalog.js` antes de `riso-people.js`.
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
