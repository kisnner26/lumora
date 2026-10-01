#!/bin/sh
# copia la app a docs/app para github pages (main:/docs). la web usa web-bridge.js en lugar de bridge.py
set -e
cd "$(dirname "$0")/.."
rm -rf docs/app && mkdir -p docs/app
cp index.html docs/app/
for f in $(grep -oE 'src="[A-Za-z0-9_./-]+\.js"' index.html | sed 's/src="//;s/"$//'); do cp "$f" docs/app/; done
cp LICENSE.md docs/app/LICENSE.md
echo "docs/app listo: $(ls docs/app | wc -l) archivos, $(du -sh docs/app | cut -f1)"
