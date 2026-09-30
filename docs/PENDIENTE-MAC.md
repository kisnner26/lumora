# pendiente de probar en el mac

cosas que aquí no se pueden verificar. cada una se construyó según la especificación y se probó con simulación.

## integración de la rama con lo que solo existe en el mac
1. la rama publicada no traía `riso-people.js`, `riso-share.js` ni el modo portada. si en tu mac existen, al traer `feature/catalogo-pro`: `git fetch origin && git checkout feature/catalogo-pro`, luego copia tus archivos locales encima y revisa que `index.html` cargue `riso-catalog.js` antes de `riso-people.js`.
2. abre la app, deja sonar una canción y comprueba en la consola: `RISO.people.RX.length`, `Object.keys(RISO.props.DEFS).length`.
