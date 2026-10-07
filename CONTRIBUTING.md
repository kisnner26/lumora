# contribuir a lumora

gracias por interesarte. lumora es un proyecto personal con licencia [PolyForm Noncommercial](LICENSE.md): las contribuciones se aceptan bajo esa misma licencia.

## antes de empezar

- abre un issue para contarme qué quieres cambiar, sobre todo si es grande.
- el puente (`bridge.py`) usa solo la biblioteca estándar de python; no añadas dependencias.
- la web es html + canvas 2d sin frameworks ni paso de compilación.

## cómo correrlo

```sh
./build.sh          # compila las herramientas nativas
python3 bridge.py   # puente en http://127.0.0.1:8888
python3 tools/mock_bridge.py   # puente simulado, sin Música ni Spotify
```

## comprobaciones

```sh
tools/check.sh          # sintaxis y pruebas rápidas
tools/check.sh todo     # incluye las lentas
python3 -m unittest discover -s tests   # pruebas del puente y de las letras propias
```

las pruebas con navegador necesitan Playwright (`npm i -D playwright && npx playwright install chromium`); sin él se omiten y se avisa cuáles.

para la app de mac: `tools/crear_app.sh` (solo la app) o `tools/empaquetar.sh` (app firmada y dmg).

## estilo

- commits pequeños y atómicos, en español, con prefijo (`feat:`, `fix:`, `docs:`, `bridge:`, `app:`, `tools:`).
- textos de interfaz en español y en minúsculas; sin emojis.
- comentarios breves.
