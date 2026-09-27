#!/bin/sh
# compila las herramientas nativas (traductor de Apple y escucha del audio del sistema) e instala el SDK de Claude
set -e
cd "$(dirname "$0")"
swiftc -O -parse-as-library tools/traducir.swift -o tools/traducir
swiftc -O -parse-as-library tools/oido.swift -o tools/oido
python3 -m venv .venv && .venv/bin/pip install --quiet -r requirements.txt
echo "listo. arranca con: python3 bridge.py"
