#!/usr/bin/env python3
"""puente simulado para probar lumora sin Música ni Spotify (linux, nube, integración continua).
sirve los archivos estáticos y simula /now, /art, /lyrics, /bpm, /story, /translate, /cmd y lo demás
con las mismas formas que bridge.py. la posición avanza con el reloj.

  python3 tools/mock_bridge.py [puerto]          (por defecto 8899)

control desde la prueba (GET):
  /mock?scn=normal      canción A, posición 0
  /mock?scn=cambio      pasa a la canción B con posición 0
  /mock?scn=crossfade   pasa a la canción B con la posición ya en 7 s (mezcla)
  /mock?scn=repetir     la misma canción vuelve a 0
  /mock?scn=sinletra    canción instrumental (sin letra)
  /mock?scn=larga       canción de 9 minutos
  /mock?scn=corta       canción de 45 segundos
  /mock?song=<id>&pos=<s>&state=playing|paused|stopped   control fino
  /mock/estado          estado actual (json)
"""
import json, os, sys, time, zlib, struct, threading
from http.server import ThreadingHTTPServer, SimpleHTTPRequestHandler
from urllib.parse import urlparse, parse_qs

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
PORT = int(sys.argv[1]) if len(sys.argv) > 1 else 8899

# ---------- canciones de ejemplo (letras mezcladas en español e inglés, con países, objetos y emociones) ----------
def lrc(lines, t0=6.0, step=4.2):
    out, t = [], t0
    for l in lines:
        if l == '':
            t += step * .6
            continue
        out.append('[%02d:%05.2f]%s' % (int(t // 60), t % 60, l)); t += step
    return '\n'.join(out)

A_LINES = ['walking alone in the rain tonight', 'the city lights are burning in my head', 'i miss you baby, i miss your smile', '',
           'soy de Nicaragua, mi tierra es de volcanes', 'un café con mi mamá en la mañana', 'i see your face in the mirror', 'and it hurts like a broken heart', '',
           'we dance until the morning sun', 'money and gold and fire in my hands', 'te quiero, te quiero, mi vida', 'forever and ever is a long long time', '',
           'driving down the highway in a car', 'the moon is falling on the sea', 'tengo el corazón hecho pedazos', 'nobody knows how much i cry', '',
           'sleeping alone in this empty house', 'the train leaves the station at dawn', 'love is a flower that never learned to die', 'i pray to god for one more night']
B_LINES = ['midnight train to nowhere', 'the stars are falling in Paris', 'un baile en la playa con el mar', '', 'she is my queen and my angel', 'ella es mi cielo, mi todo',
           'the guitar cries in the dark', 'and the piano knows my name', '', 'fire in the sky, thunder in my soul', 'voy a volar lejos de aquí', 'free like a bird, free like the wind']
SONGS = {
    'a': dict(name='Noche de Neón', artist='Los Ejemplos', album='Prueba I', dur=200, lines=A_LINES, bpm=104, genre='pop', art=1),
    'b': dict(name='Tren de Medianoche', artist='Banda Simulada', album='Prueba II', dur=185, lines=B_LINES, bpm=92, genre='rock', art=2),
    'c': dict(name='Ambiente sin Voz', artist='Instrumental Co.', album='Prueba III', dur=150, lines=None, bpm=78, genre='ambient', art=3),
    'larga': dict(name='La Suite Eterna', artist='Los Ejemplos', album='Prueba IV', dur=540, lines=A_LINES * 3, bpm=88, genre='pop', art=4),
    'corta': dict(name='Relámpago', artist='Banda Simulada', album='Prueba V', dur=45, lines=B_LINES[:4], bpm=120, genre='electronic', art=5),
}
SONGS['a']['synced'] = lrc(A_LINES); SONGS['b']['synced'] = lrc(B_LINES)
SONGS['larga']['synced'] = lrc(A_LINES * 3, step=6.5); SONGS['corta']['synced'] = lrc(B_LINES[:4], t0=4, step=8)

ST = {'song': 'a', 'state': 'playing', 'base': 0.0, 't0': time.time(), 'src': 'music'}
LOCK = threading.Lock()

def cur_pos():
    s = SONGS[ST['song']]
    p = ST['base'] + ((time.time() - ST['t0']) if ST['state'] == 'playing' else 0)
    return max(0.0, min(p, s['dur']))

def set_song(song, pos=0.0, state='playing'):
    with LOCK:
        ST.update(song=song, base=float(pos), t0=time.time(), state=state)

def seek(to=None, by=None):
    with LOCK:
        p = cur_pos()
        ST.update(base=max(0.0, (to if to is not None else p + by)), t0=time.time())

def snapshot():
    s = SONGS[ST['song']]
    with LOCK:
        off = ST['state'] in ('off', 'stopped')
        now = time.time()
        return {'state': ST['state'], 'pos': 0 if off else cur_pos(), 'at': now, 'server': now,
                'name': '' if off else s['name'], 'artist': '' if off else s['artist'], 'album': '' if off else s['album'],
                'dur': 0 if off else s['dur'], 'src': ST['src'], 'art': 0 if off else s['art'], 'error': ''}

# ---------- carátulas generadas (png sin librerías) ----------
def png(w, h, fn):
    raw = b''.join(b'\x00' + b''.join(bytes(fn(x, y)) for x in range(w)) for y in range(h))
    def ch(t, d):
        c = struct.pack('>I', len(d)) + t + d
        return c + struct.pack('>I', zlib.crc32(t + d) & 0xffffffff)
    return b'\x89PNG\r\n\x1a\n' + ch(b'IHDR', struct.pack('>IIBBBBB', w, h, 8, 2, 0, 0, 0)) + ch(b'IDAT', zlib.compress(raw)) + ch(b'IEND', b'')

def art_png(n):
    import math
    pal = [(232, 90, 60), (40, 60, 150), (60, 150, 110), (240, 190, 50), (150, 70, 160)][(n - 1) % 5]
    def px(x, y):
        d = math.hypot(x - 128, y - 128) / 128
        v = .5 + .5 * math.sin(d * 9 + n)
        return (int(pal[0] * v + 30), int(pal[1] * v + 30 * (1 - d if d < 1 else 0)), int(pal[2] * v + 40))
    return png(256, 256, lambda x, y: tuple(min(255, c) for c in px(x, y)))
ARTS = {}

class H(SimpleHTTPRequestHandler):
    def __init__(self, *a, **k):
        super().__init__(*a, directory=ROOT, **k)
    def log_message(self, *a): pass
    def j(self, obj, code=200):
        b = json.dumps(obj).encode()
        self.send_response(code); self.send_header('Content-Type', 'application/json'); self.send_header('Content-Length', str(len(b))); self.send_header('Cache-Control', 'no-store'); self.end_headers(); self.wfile.write(b)
    def do_GET(self):
        u = urlparse(self.path); q = {k: v[0] for k, v in parse_qs(u.query).items()}; p = u.path
        if p == '/now': return self.j(snapshot())
        if p == '/mock/estado': return self.j({**snapshot(), 'song': ST['song']})
        if p == '/mock':
            scn = q.get('scn', '')
            if scn == 'normal': set_song('a', 0)
            elif scn == 'cambio': set_song('b', 0)
            elif scn == 'crossfade': set_song('b', 7.0)
            elif scn == 'repetir': set_song(ST['song'], 0)
            elif scn == 'sinletra': set_song('c', 0)
            elif scn == 'larga': set_song('larga', 0)
            elif scn == 'corta': set_song('corta', 0)
            elif q.get('song') in SONGS: set_song(q['song'], q.get('pos', 0), q.get('state', 'playing'))
            elif q.get('state'):
                with LOCK: ST.update(base=cur_pos(), t0=time.time(), state=q['state'])
            return self.j({'ok': True, **snapshot()})
        if p == '/art':
            n = int(u.query) if u.query.isdigit() else SONGS[ST['song']]['art']
            data = ARTS.setdefault(n, art_png(n))
            self.send_response(200); self.send_header('Content-Type', 'image/png'); self.send_header('Content-Length', str(len(data))); self.end_headers(); return self.wfile.write(data)
        if p == '/lyrics':
            nm = q.get('title', '')
            s = next((v for v in SONGS.values() if v['name'] == nm), None)
            if not s or not s.get('lines'): return self.j({'instrumental': True} if s else {})
            return self.j({'synced': s['synced'], 'plain': '\n'.join(s['lines'])})
        if p == '/bpm':
            nm = q.get('title', ''); s = next((v for v in SONGS.values() if v['name'] == nm), None)
            return self.j({'bpm': s['bpm'], 'source': 'simulado', 'genre': s['genre']} if s else {})
        if p == '/story': return self.j({'ready': False, 'model': 'simulado'})
        if p == '/prefs': return self.j({'sessions': 0, 'text': ''})
        if p == '/next': return self.j({})
        if p == '/like': return self.j({'liked': False, 'src': 'music'})
        if p == '/autor': return self.j({})
        if p == '/lights': return self.j({'devices': [], 'error': ''})
        if p == '/bpm': return self.j({})
        if p in ('/img', '/wiki', '/nextart'): return self.j({'error': 'no'}, 404)
        if p == '/audio':
            self.send_response(200); self.send_header('Content-Type', 'text/event-stream'); self.end_headers()
            try:
                while True:
                    self.wfile.write(b'event: status\ndata: {"error":"","running":false}\n\n'); self.wfile.flush(); time.sleep(2)
            except Exception: pass
            return
        return super().do_GET()
    def do_POST(self):
        u = urlparse(self.path); n = int(self.headers.get('Content-Length') or 0); body = self.rfile.read(n) if n else b''
        if u.path == '/cmd':
            c = parse_qs(u.query).get('c', [''])[0]
            if c == 'playpause':
                with LOCK: ST.update(base=cur_pos(), t0=time.time(), state='paused' if ST['state'] == 'playing' else 'playing')
            elif c.startswith('seek:'): seek(by=float(c[5:]))
            elif c.startswith('goto:'): seek(to=float(c[5:]))
            elif c == 'start': seek(to=0)
            elif c in ('next', 'prev'): set_song({'a': 'b', 'b': 'a'}.get(ST['song'], 'a'), 0)
            else: return self.j({'error': 'comando desconocido'}, 400)
            return self.j({'ok': True})
        if u.path == '/translate':
            d = json.loads(body or b'{}'); return self.j([('traducción: ' + l) for l in d.get('lines', [])])
        if u.path == '/story': return self.j({'error': 'simulado'}, 500)
        if u.path == '/convert': return self.j({'error': 'sin ffmpeg en el puente simulado'}, 500)
        return self.j({'ok': True})

if __name__ == '__main__':
    ThreadingHTTPServer.daemon_threads = True
    print('puente simulado en http://127.0.0.1:%d/index.html' % PORT)
    ThreadingHTTPServer(('127.0.0.1', PORT), H).serve_forever()
