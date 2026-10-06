#!/bin/sh
# un solo comando: construye Lumora.app, la firma (ad-hoc con hardened runtime, o Developer ID) y crea app/build/Lumora.dmg
#   tools/empaquetar.sh
#   DEVELOPER_ID="Developer ID Application: Nombre (TEAMID)" tools/empaquetar.sh
#   DEVELOPER_ID="..." NOTARY_PROFILE=mi-perfil NOTARIZAR=1 tools/empaquetar.sh     (notariza y grapa; necesita cuenta de pago)
set -e
cd "$(dirname "$0")/.."

# entorno de empaquetado local (PyInstaller); no se instala nada global
if [ ! -x .venv-empaque/bin/pyinstaller ]; then
  python3 -m venv .venv-empaque
  .venv-empaque/bin/pip install --quiet pyinstaller
fi

tools/crear_app.sh
APP=app/build/Lumora.app
DMG=app/build/Lumora.dmg
ID="${DEVELOPER_ID:--}"                       # "-" = firma ad-hoc
OPC="--force --options runtime --timestamp=none"
[ "$ID" != "-" ] && OPC="--force --options runtime --timestamp"

# firmar de dentro hacia fuera: cada ejecutable y biblioteca, luego el paquete
find "$APP" -type f \( -perm -u+x -o -name '*.dylib' -o -name '*.so' \) | while read -r f; do
  if file "$f" | grep -q 'Mach-O'; then
    case "$(basename "$f")" in
      oido|traducir|lumora-bridge) IDF="-i com.kisnner.lumora.$(basename "$f")" ;;   # identificador fijo: el permiso de macOS no se pierde al recompilar
      *) IDF="" ;;
    esac
    codesign $OPC $IDF -s "$ID" --entitlements app/entitlements.plist "$f"
  fi
done
codesign $OPC -s "$ID" --entitlements app/entitlements.plist "$APP"
codesign --verify --deep --strict --verbose=2 "$APP"
echo "spctl (una firma ad-hoc se rechaza a propósito; con Developer ID y notarización se acepta):"
spctl --assess --type execute --verbose "$APP" || true

# dmg con acceso directo a Aplicaciones
rm -f "$DMG"; STAGE=$(mktemp -d)
cp -R "$APP" "$STAGE/"; ln -s /Applications "$STAGE/Applications"
hdiutil create -volname "Lumora" -srcfolder "$STAGE" -ov -format UDZO "$DMG" >/dev/null
rm -rf "$STAGE"
[ "$ID" != "-" ] && codesign --force -s "$ID" "$DMG"

if [ "${NOTARIZAR:-0}" = "1" ]; then
  [ -n "$NOTARY_PROFILE" ] || { echo "falta NOTARY_PROFILE"; exit 1; }
  xcrun notarytool submit "$DMG" --keychain-profile "$NOTARY_PROFILE" --wait
  xcrun stapler staple "$DMG"
  xcrun stapler validate "$DMG"
fi
echo "listo: $DMG ($(stat -f %z "$DMG" | awk '{printf "%.1f MB", $1/1048576}'))"
