# pruebas de lumora

```sh
tools/check.sh          # sintaxis + pruebas de node + (si hay Playwright) pruebas con navegador y smoke
tools/check.sh todo     # además las pruebas lentas (tools/lento_*.mjs)
node tools/test_falsos_positivos.mjs   # solo la detección de palabras; no necesita navegador
```

## sin navegador (corren en cualquier máquina con node)
- `test_falsos_positivos.mjs`: carga el catálogo con `detector_lib.mjs` y comprueba
  1. que las palabras muy comunes de las letras (`corpus_letras.mjs`) solo disparen lo que el dibujo representa de verdad (`PERMITIDOS`),
  2. que las frases neutras no dibujen nada,
  3. que las frases de `frases.mjs` (`DEBE`) disparen su dibujo,
  4. que los errores ya corregidos (`REGRESIONES`) no vuelvan,
  5. que ninguna regla tenga una raíz corta con comodín (`win\w*` sacaba trofeo con «window», «wine» y «winter»).
- Al agregar un dibujo nuevo: si una palabra común dispara de más, la prueba lo dice. Si el disparo es correcto (por ejemplo «mesa» saca una mesa), se anota en `PERMITIDOS`.
- Al corregir un falso positivo que encuentres con una letra real, agrega la frase a `REGRESIONES`.

## con navegador (Playwright)
Hace falta Playwright y un Chromium o Chrome:

```sh
npm i -D playwright && npx playwright install chromium
```

`lib.mjs` busca Playwright en `PLAYWRIGHT_PATH`, en `node_modules`, en la instalación global de npm y en la ruta de la nube; y el navegador en `CHROMIUM`, el de Playwright, Google Chrome de macOS y las rutas de Linux. En un Mac usa la gpu; `SOFTWARE_GL=1` fuerza webgl por software (así corre en la nube). Sin Playwright, `check.sh` omite esas pruebas y lo dice.

## puente simulado
`python3 tools/mock_bridge.py [puerto]` (8899 por defecto) sirve la página y simula Música: canciones de ejemplo con letra, cambio de canción, crossfade y más (`/mock?scn=...`, ver el encabezado del archivo). Sirve para probar sin tener nada sonando.
