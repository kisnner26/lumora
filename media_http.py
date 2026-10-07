"""lectura parcial de los vídeos locales para el reproductor webkit."""
import os
import re
from urllib.parse import urlsplit

MEDIA = {'/media/grief/gameplay.mp4', '/media/grief/edit.mp4', '/media/grief/hyperframes.mp4'}


def serve_media(handler, root, head=False):
    path = urlsplit(handler.path).path
    if path not in MEDIA:
        return False
    try:
        source = open(os.path.join(root, path.lstrip('/')), 'rb')
    except OSError:
        handler.send_error(404)
        return True
    with source:
        size = os.fstat(source.fileno()).st_size
        start, end, partial = 0, size - 1, False
        value = handler.headers.get('Range')
        if value:
            match = re.fullmatch(r'bytes=(\d*)-(\d*)', value.strip())
            try:
                if not match or not any(match.groups()):
                    raise ValueError()
                a, b = match.groups()
                if a:
                    start = int(a)
                    end = min(int(b), size - 1) if b else size - 1
                else:
                    length = int(b)
                    if not length:
                        raise ValueError()
                    start = max(0, size - length)
                if start > end or start >= size:
                    raise ValueError()
                partial = True
            except ValueError:
                handler.send_response(416)
                handler.send_header('Content-Range', f'bytes */{size}')
                handler.send_header('Content-Length', '0')
                handler.end_headers()
                return True
        handler.send_response(206 if partial else 200)
        handler.send_header('Content-Type', 'video/mp4')
        handler.send_header('Accept-Ranges', 'bytes')
        handler.send_header('Content-Length', str(end - start + 1))
        if partial:
            handler.send_header('Content-Range', f'bytes {start}-{end}/{size}')
        handler.end_headers()
        if not head:
            source.seek(start)
            remaining = end - start + 1
            try:
                while remaining:
                    chunk = source.read(min(65536, remaining))
                    if not chunk:
                        break
                    handler.wfile.write(chunk)
                    remaining -= len(chunk)
            except (BrokenPipeError, ConnectionResetError):
                pass
    return True
