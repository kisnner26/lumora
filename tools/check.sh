#!/bin/sh
# sintaxis de todos los .js y .mjs, pruebas de node puro y, si hay Playwright, las pruebas con navegador y el smoke.
#   tools/check.sh          lo rápido
#   tools/check.sh todo     incluye las pruebas lentas (tools/lento_*.mjs)
# Sin Playwright las pruebas con navegador se omiten (y se dice cuáles); no cuentan como fallo.
cd "$(dirname "$0")/.." || exit 1
fallo=0; omitidas=""
for f in $(find . -maxdepth 4 -name '*.js' -not -path './docs/*' -not -path './node_modules/*' -not -path './.venv*' -not -path './app/*' -not -path './personal/*') tools/*.mjs; do node --check "$f" >/dev/null 2>&1 || { echo "sintaxis: $f"; fallo=1; }; done
[ $fallo = 0 ] || exit 1
hay_pw=0; node -e "import('./tools/lib.mjs').then(m=>m.tienePlaywright()).then(ok=>process.exit(ok?0:1))" >/dev/null 2>&1 && hay_pw=1
corre() { # archivo
  if grep -q "from './lib.mjs'" "$1" && [ $hay_pw = 0 ]; then omitidas="$omitidas $1"; return 0; fi
  node "$1" || fallo=1
}
for t in tools/test_*.mjs; do [ -f "$t" ] && corre "$t"; done
[ "$1" = todo ] && for t in tools/lento_*.mjs; do [ -f "$t" ] && corre "$t"; done
corre tools/smoke.mjs
if [ -n "$omitidas" ]; then echo; echo "omitidas por no tener Playwright:$omitidas"; echo "(instálalo con: npm i -D playwright && npx playwright install chromium)"; fi
[ $fallo = 0 ] || { echo "CHECK: FALLO"; exit 1; }
[ -n "$omitidas" ] && echo "CHECK: ok (parcial: faltan las pruebas con navegador)" || echo "CHECK: ok"
