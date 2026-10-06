#!/bin/sh
# compila Lumora.app en app/build/ (lanzador + puente + web + herramientas nativas)
set -e
cd "$(dirname "$0")/.."
OUT=app/build/Lumora.app
rm -rf app/build && mkdir -p "$OUT/Contents/MacOS" "$OUT/Contents/Resources/web" "$OUT/Contents/Resources/bridge" "$OUT/Contents/Resources/tools"

# lanzador (universal si el SDK lo permite)
swiftc -O app/Lumora.swift -o "$OUT/Contents/MacOS/Lumora"
cp app/Info.plist "$OUT/Contents/Info.plist"

# herramientas nativas
swiftc -O -parse-as-library tools/traducir.swift -o "$OUT/Contents/Resources/tools/traducir"
swiftc -O -parse-as-library tools/oido.swift -o "$OUT/Contents/Resources/tools/oido"

# puente: congelado con PyInstaller si existe .venv-empaque (la app no necesita python); si no, los fuentes
if [ -x .venv-empaque/bin/pyinstaller ]; then
  .venv-empaque/bin/pyinstaller --noconfirm --onedir --name lumora-bridge --paths . --hidden-import guion \
    --distpath app/build/dist --workpath app/build/work --specpath app/build bridge.py >app/build/pyinstaller.log 2>&1
  mv app/build/dist/lumora-bridge "$OUT/Contents/Resources/bridge/lumora-bridge"
  rm -rf app/build/dist app/build/work app/build/lumora-bridge.spec
else
  cp bridge.py guion.py "$OUT/Contents/Resources/bridge/"
fi

# web: solo lo que index.html carga (sin personal/, extras/, docs/, tools/ ni .git)
cp index.html "$OUT/Contents/Resources/web/"
grep -o 'src="[^"]*"' index.html | sed 's/src="//;s/"$//' | grep -v '^http' | while read -r f; do
  mkdir -p "$OUT/Contents/Resources/web/$(dirname "$f")"; cp "$f" "$OUT/Contents/Resources/web/$f"
done

# icono
swiftc -O app/icono.swift -o app/build/icono
app/build/icono app/build/icono1024.png
SET=app/build/AppIcon.iconset; mkdir -p "$SET"
for s in 16 32 128 256 512; do
  sips -z $s $s app/build/icono1024.png --out "$SET/icon_${s}x${s}.png" >/dev/null
  sips -z $((s*2)) $((s*2)) app/build/icono1024.png --out "$SET/icon_${s}x${s}@2x.png" >/dev/null
done
iconutil -c icns "$SET" -o "$OUT/Contents/Resources/AppIcon.icns"
rm -rf "$SET" app/build/icono app/build/icono1024.png

# firma ad-hoc (tools/empaquetar.sh la rehace con hardened runtime y, si hay cuenta, con Developer ID)
codesign --force --deep -s - --entitlements app/entitlements.plist "$OUT"
echo "listo: $OUT"
