#!/usr/bin/env python3
"""rechaza un paquete cuyo lanzador o runtime exijan más macos que lo declarado."""
import plistlib
from pathlib import Path
import re
import subprocess
import sys


def version(value):
    parts = [int(n) for n in value.split('.')]
    return tuple((parts + [0, 0])[:3])


def check(app):
    with (app / 'Contents/Info.plist').open('rb') as f:
        minimum = plistlib.load(f)['LSMinimumSystemVersion']
    limits = {'tomador': '14.2', 'traducir': '26.0'}
    errors, checked = [], 0
    for path in (app / 'Contents').rglob('*'):
        if not path.is_file() or path.is_symlink():
            continue
        with path.open('rb') as f:
            magic = f.read(4)
        if magic not in (b'\xcf\xfa\xed\xfe', b'\xce\xfa\xed\xfe', b'\xca\xfe\xba\xbe', b'\xca\xfe\xba\xbf'):
            continue
        out = subprocess.run(['otool', '-l', str(path)], capture_output=True, text=True, check=True).stdout
        versions = re.findall(r'\bminos ([\d.]+)', out)
        versions += re.findall(r'LC_VERSION_MIN_MACOSX\s+cmdsize \d+\s+version ([\d.]+)', out)
        allowed = limits.get(path.name, minimum) if path.parent.name == 'tools' else minimum
        if not versions:
            errors.append(f'{path.relative_to(app)}: no declara versión mínima')
        for required in versions:
            if version(required) > version(allowed):
                errors.append(f'{path.relative_to(app)}: exige macos {required}, límite {allowed}')
        checked += 1
    if not checked:
        errors.append('el paquete no contiene ejecutables mach-o')
    if errors:
        raise RuntimeError('\n'.join(errors))
    print(f'ok: {checked} binarios compatibles con los mínimos declarados; runtime base macos {minimum}')


if __name__ == '__main__':
    try:
        check(Path(sys.argv[1]))
    except (RuntimeError, OSError) as e:
        print(str(e), file=sys.stderr)
        sys.exit(1)
