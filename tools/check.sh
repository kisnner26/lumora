#!/bin/sh
# node --check de todos los .js y luego las pruebas y el smoke con el puente simulado
cd "$(dirname "$0")/.." || exit 1
fallo=0
for f in *.js tools/*.mjs; do node --check "$f" >/dev/null 2>&1 || { echo "sintaxis: $f"; fallo=1; }; done
[ $fallo = 0 ] || exit 1
for t in tools/test_*.mjs; do [ -f "$t" ] && { node "$t" || fallo=1; }; done
[ $fallo = 0 ] && node tools/smoke.mjs || exit 1
