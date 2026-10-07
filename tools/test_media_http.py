"""rangos reales usados por webkit, sin cargar música ni ejecutar el puente nativo."""
import http.client
import sys
import tempfile
import threading
import unittest
from pathlib import Path
from http.server import ThreadingHTTPServer, SimpleHTTPRequestHandler
sys.path.insert(0, str(Path(__file__).resolve().parents[1]))
from media_http import serve_media


class MediaTest(unittest.TestCase):
    def test_ranges(self):
        with tempfile.TemporaryDirectory() as root:
            path = Path(root, 'media/grief/gameplay.mp4')
            path.parent.mkdir(parents=True)
            path.write_bytes(bytes(range(256)))
            path.with_name('hyperframes.mp4').write_bytes(bytes(range(256)))
            class Handler(SimpleHTTPRequestHandler):
                def log_message(self, *args): pass
                def do_GET(self):
                    if not serve_media(self, root): self.send_error(404)
                def do_HEAD(self):
                    if not serve_media(self, root, True): self.send_error(404)
            server = ThreadingHTTPServer(('127.0.0.1', 0), Handler)
            threading.Thread(target=server.serve_forever, daemon=True).start()
            try:
                def request(value=None, method='GET', url='/media/grief/gameplay.mp4'):
                    c = http.client.HTTPConnection('127.0.0.1', server.server_port)
                    c.request(method, url, headers={'Range': value} if value else {})
                    r = c.getresponse(); result = r.status, dict(r.getheaders()), r.read(); c.close()
                    return result
                self.assertEqual(request()[2], bytes(range(256)))
                self.assertEqual(request('bytes=20-21', url='/media/grief/hyperframes.mp4')[::2], (206, bytes([20, 21])))
                for value, start, end in [('bytes=0-1', 0, 1), ('bytes=20-', 20, 255), ('bytes=-16', 240, 255), ('bytes=250-999', 250, 255)]:
                    status, headers, body = request(value)
                    self.assertEqual(status, 206)
                    self.assertEqual(headers['Content-Range'], f'bytes {start}-{end}/256')
                    self.assertEqual(body, bytes(range(256))[start:end+1])
                for value in ['bytes=256-', 'bytes=8-2', 'bytes=-0', 'bytes=0-1,5-7', 'bytes=-']:
                    self.assertEqual(request(value)[0], 416)
                status, headers, body = request('bytes=0-1', 'HEAD')
                self.assertEqual((status, headers['Content-Length'], body), (206, '2', b''))
                self.assertEqual(request(url='/media/grief/../../bridge.py')[0], 404)
            finally:
                server.shutdown(); server.server_close()

if __name__ == '__main__': unittest.main()
