#!/usr/bin/env python3
"""Sirve la página y hace de puente con la app Música de macOS.

GET  /now          -> estado de Música en JSON (se refresca 4 veces por segundo)
GET  /art          -> carátula de la canción actual
POST /cmd?c=...    -> playpause | seek:+5 | seek:-5 | start
"""
import hashlib, json, os, queue, re, shutil, signal, socket, subprocess, sys, threading, time, tempfile, urllib.request, urllib.parse
from http.server import ThreadingHTTPServer, SimpleHTTPRequestHandler
from urllib.parse import urlparse, parse_qs

VERSION = '1.0'
PORT = int(os.environ.get('LUMORA_PORT') or 8888)
HERE = os.path.dirname(os.path.abspath(__file__))
ROOT = os.path.abspath(os.environ.get('LUMORA_ROOT') or HERE)                  # carpeta con index.html y la web
TOOLS = os.path.abspath(os.environ.get('LUMORA_TOOLS') or os.path.join(ROOT, 'tools'))
PORT_FILE = os.path.expanduser('~/Library/Application Support/Lumora/puerto')
for _d in ('/opt/homebrew/bin', '/usr/local/bin'):                              # una app de Finder arranca con un PATH mínimo; ffmpeg suele vivir aquí
    if os.path.isdir(_d) and _d not in os.environ.get('PATH', '').split(':'):
        os.environ['PATH'] = os.environ.get('PATH', '/usr/bin:/bin') + ':' + _d
ART = os.path.join(tempfile.gettempdir(), 'lumora-art.bin')
# cada carátula queda guardada con su token: la estantería y "artista" del modo carátula
# piden portadas de canciones que ya pasaron, y /art a secas solo tiene la actual
ART_DIR = os.path.expanduser('~/Library/Caches/lumora-portadas')
ART_KEEP = 80


def art_keep(token):
    try:
        os.makedirs(ART_DIR, exist_ok=True)
        with open(ART, 'rb') as src, open(os.path.join(ART_DIR, '%d.bin' % token), 'wb') as dst:
            dst.write(src.read())
        files = sorted((os.path.join(ART_DIR, f) for f in os.listdir(ART_DIR)), key=os.path.getmtime)
        for old in files[:-ART_KEEP]:
            os.remove(old)
    except OSError:
        pass

# un solo proceso osascript que vive en bucle (lanzar uno por lectura hacía parpadear el Dock)
WATCH_JXA = r'''
const SEP = String.fromCharCode(31);
const M = Application('Music');
let SP = null; try { SP = Application('Spotify'); } catch (e) {}
function music() {
  if (!M.running()) return null;
  const st = M.playerState(); if (st === 'stopped') return null;
  const pos = M.playerPosition(), ts = Date.now() / 1000;
  const t = M.currentTrack(); let bpm = 0; try { bpm = t.bpm(); } catch (e) {}
  return ['music', st, pos, t.name(), t.artist(), t.album(), t.duration(), bpm, '', ts];
}
function spotify() {
  if (!SP || !SP.running()) return null;
  const st = SP.playerState(); if (st === 'stopped') return null;
  const pos = SP.playerPosition(), ts = Date.now() / 1000;
  const t = SP.currentTrack(); let art = ''; try { art = t.artworkUrl(); } catch (e) {}
  return ['spotify', st, pos, t.name(), t.artist(), t.album(), t.duration() / 1000, 0, art, ts];
}
while (true) {
  let out = 'off';
  try {
    let a = null, b = null;
    try { a = spotify(); } catch (e) {}
    try { b = music(); } catch (e) {}
    // manda la que está sonando; si ninguna suena, la que quedó en pausa
    const pick = [a, b].find(x => x && x[1] === 'playing') || a || b;
    if (pick) out = pick.join(SEP);
  } catch (e) { out = 'err' + SEP + e.message; }
  console.log(out);
  delay(0.25);
}
'''

ART_SCRIPT = '''
tell application "Music"
  set t to current track
  if (count of artworks of t) = 0 then return "none"
  set d to raw data of artwork 1 of t
end tell
set fh to open for access (POSIX file "%s") with write permission
set eof fh to 0
write d to fh
close access fh
return "ok"
''' % ART

# ---------- letras sincronizadas (LRCLIB, API pública) ----------
LYR_CACHE = {}
UA = 'lumora/1.0 (https://github.com/kisnner26/lumora)'


def get_json(url, timeout=8):
    req = urllib.request.Request(url, headers={'User-Agent': UA, 'Accept': 'application/json'})
    try:
        with urllib.request.urlopen(req, timeout=timeout) as r:
            return json.loads(r.read().decode('utf-8', 'replace'))
    except Exception:
        return None


def clean_title(t):
    t = re.sub(r'\s*[\(\[](feat|ft|with)\.?[^\)\]]*[\)\]]', '', t, flags=re.I)
    t = re.sub(r'\s*-\s*(remaster|live|radio edit|single version).*$', '', t, flags=re.I)
    return t.strip()


LETRAS_DIR = os.path.expanduser('~/Library/Application Support/Lumora/letras')


def letra_propia(artist, title):
    """letra del propio usuario: ~/Library/Application Support/Lumora/letras/<artista> - <título>.lrc (o .txt, sin tiempos)"""
    def limpio(x):
        return re.sub(r'[\\/:*?"<>|]+', '', x).strip().lower()
    nombres = {limpio('%s - %s' % (artist, title)), limpio('%s - %s' % (artist.split(',')[0].split('&')[0], clean_title(title)))}
    try:
        for f in os.listdir(LETRAS_DIR):
            base, ext = os.path.splitext(f)
            if ext.lower() in ('.lrc', '.txt') and limpio(base) in nombres:
                with open(os.path.join(LETRAS_DIR, f), encoding='utf-8', errors='replace') as fh:
                    texto = fh.read()
                if ext.lower() == '.lrc' and re.search(r'\[\d+:\d+', texto):
                    return {'synced': texto, 'source': 'propia'}
                return {'plain': texto, 'source': 'propia', 'approx': 'plain'}
    except OSError:
        pass
    return None


def fetch_lyrics(artist, title, album, dur):
    key = (artist.lower(), title.lower())
    propia = letra_propia(artist, title)
    if propia:                                   # la letra que puso el usuario manda sobre cualquier servicio
        return propia
    if key in LYR_CACHE:
        return LYR_CACHE[key]
    a = artist.split(',')[0].split('&')[0].strip()
    t = clean_title(title)
    q = urllib.parse.urlencode
    out = {'none': True}
    reached = False
    d = get_json('https://lrclib.net/api/get?' + q({'artist_name': a, 'track_name': t, 'album_name': album, 'duration': round(dur)}))
    if not (d and (d.get('syncedLyrics') or d.get('plainLyrics'))) and t != title:
        d = get_json('https://lrclib.net/api/get?' + q({'artist_name': a, 'track_name': title, 'album_name': album, 'duration': round(dur)}))
    if d and d.get('instrumental'):
        out = {'instrumental': True}
    elif d and d.get('syncedLyrics'):
        out = {'synced': d['syncedLyrics'], 'source': 'lrclib'}
    else:
        res = get_json('https://lrclib.net/api/search?' + q({'artist_name': a, 'track_name': t}))
        reached = res is not None
        res = [r for r in (res or []) if r.get('syncedLyrics') or r.get('plainLyrics')]
        diff = lambda r: abs((r.get('duration') or 0) - dur)
        synced = sorted([r for r in res if r.get('syncedLyrics')], key=diff)
        plain = (d or {}).get('plainLyrics') or next((r['plainLyrics'] for r in sorted(res, key=diff) if r.get('plainLyrics') and diff(r) <= 3), '')
        if synced and diff(synced[0]) <= 3:
            out = {'synced': synced[0]['syncedLyrics'], 'source': 'lrclib'}
        elif synced and diff(synced[0]) <= 12 and synced[0].get('duration'):
            # otra edición parecida: se estiran sus tiempos a la duración de esta
            out = {'synced': synced[0]['syncedLyrics'], 'source': 'lrclib', 'approx': 'stretch', 'scale': dur / synced[0]['duration']}
        elif plain:
            out = {'plain': plain, 'source': 'lrclib', 'approx': 'plain'}
        if res:
            d = res[0]
    if d or reached:                     # solo se guarda lo que LRCLIB respondió de verdad
        LYR_CACHE[key] = out
    return out


# ---------- tempo: BPM de Deezer (API pública, sin clave) ----------
BPM_CACHE = {}


def fetch_bpm(artist, title, dur):
    key = (artist.lower(), title.lower())
    if key in BPM_CACHE:
        return BPM_CACHE[key]
    a = artist.split(',')[0].split('&')[0].strip()
    t = clean_title(title)
    out = {'bpm': 0}
    res = get_json('https://api.deezer.com/search?' + urllib.parse.urlencode({'q': f'{t} {a}'}))
    items = [r for r in ((res or {}).get('data') or []) if a.lower() in ((r.get('artist') or {}).get('name') or '').lower()]
    items.sort(key=lambda r: abs((r.get('duration') or 0) - dur))
    for it in items[:3]:
        d = get_json(f"https://api.deezer.com/track/{it['id']}")
        if d and d.get('bpm'):
            out = {'bpm': float(d['bpm']), 'source': 'deezer'}
            break
    # género: catálogo público de iTunes (sin clave)
    it = get_json('https://itunes.apple.com/search?' + urllib.parse.urlencode({'term': f'{t} {a}', 'entity': 'song', 'limit': 5}))
    res = (it or {}).get('results') or []
    match = next((r for r in res if a.lower() in (r.get('artistName') or '').lower()), res[0] if res else None)
    if match:
        out['genre'] = match.get('primaryGenreName', '')
    if out.get('bpm') or match:
        BPM_CACHE[key] = out
    return out


# ---------- traducción en el dispositivo (traductor de Apple, tools/traducir) ----------
TR_BIN = os.path.join(TOOLS, 'traducir')
TR_FILE = os.path.expanduser('~/Library/Caches/lumora-traducciones.json')
try:
    TR_CACHE = json.load(open(TR_FILE))
except Exception:
    TR_CACHE = {}
TR_SAVE = {'t': 0}


def save_tr():
    try:
        os.makedirs(os.path.dirname(TR_FILE), exist_ok=True)
        json.dump(TR_CACHE, open(TR_FILE, 'w'))
    except Exception:
        pass


TR_PROCS = {}
TR_LOCK = threading.Lock()
LANGS = {'en', 'es', 'pt'}


def tr_proc(src, dst):
    # un traductor por dirección que vive todo el tiempo: el modelo se carga una sola vez
    p = TR_PROCS.get((src, dst))
    if p and p.poll() is None:
        return p
    p = subprocess.Popen([TR_BIN, '--serve', src, dst], stdin=subprocess.PIPE, stdout=subprocess.PIPE,
                         stderr=subprocess.PIPE, text=True, bufsize=1)
    if not p.stdout.readline():
        err = p.stderr.read()
        raise RuntimeError('idiomas' if 'instalados' in err else err.strip()[:200])
    TR_PROCS[(src, dst)] = p
    return p


def translate(lines, src='en', dst='es'):
    key = hashlib.sha1(('\n'.join(lines) + src + dst).encode()).hexdigest()
    if key in TR_CACHE:
        return TR_CACHE[key]
    if not os.path.exists(TR_BIN):
        return {'error': 'falta compilar tools/traducir'}
    if src not in LANGS or dst not in LANGS or src == dst:
        return {'error': 'dirección no soportada'}
    with TR_LOCK:
        try:
            p = tr_proc(src, dst)
            p.stdin.write(json.dumps(lines) + '\n'); p.stdin.flush()
            res = json.loads(p.stdout.readline())
        except RuntimeError as e:
            if 'idiomas' in str(e):
                return {'error': 'descarga inglés y español en Ajustes > General > Idioma y región > Idiomas de traducción'}
            return {'error': str(e)}
    if isinstance(res, dict):
        return res
    out = {'lines': res}
    TR_CACHE[key] = out
    save_tr()
    return out


# ---------- imágenes reales: banderas, íconos de marcas y fotos de Wikipedia ----------
IMG_HOSTS = ('flagcdn.com', 'www.google.com', 'upload.wikimedia.org', 'thumb.wikimedia.org')
IMG_CACHE, WIKI_CACHE = {}, {}


def fetch_img(u):
    host = urllib.parse.urlparse(u).hostname or ''
    if host not in IMG_HOSTS:                       # nada de proxy abierto: solo estas fuentes
        return None
    if u in IMG_CACHE:
        return IMG_CACHE[u]
    try:
        req = urllib.request.Request(u, headers={'User-Agent': UA})
        with urllib.request.urlopen(req, timeout=10) as r:
            data = (r.headers.get('Content-Type', 'image/png'), r.read())
    except Exception:
        return None
    if len(IMG_CACHE) > 300:
        IMG_CACHE.clear()
    IMG_CACHE[u] = data
    return data


def fetch_wiki(q, lang):
    key = (q.lower(), lang)
    if key in WIKI_CACHE:
        return WIKI_CACHE[key]
    title = urllib.parse.quote(q.strip().replace(' ', '_'))
    d = get_json(f'https://{lang}.wikipedia.org/api/rest_v1/page/summary/{title}')
    out = {'none': True}
    if d and d.get('type') == 'standard' and (d.get('thumbnail') or {}).get('source'):
        out = {'title': d.get('title', q), 'desc': d.get('description', ''), 'img': '/img?u=' + urllib.parse.quote(d['thumbnail']['source'], safe='')}
    if d is not None:
        WIKI_CACHE[key] = out
    return out


# ---------- oído: niveles del audio del sistema (tools/oido, ScreenCaptureKit) ----------
OIDO_BIN = os.path.join(TOOLS, 'oido')
AUDIO = {'clients': [], 'error': '', 'running': False}
AUDIO_LOCK = threading.Lock()


def audio_loop():
    # arranca el oído mientras haya páginas escuchando; si falta el permiso, reintenta cada 30 s
    while True:
        with AUDIO_LOCK:
            want = bool(AUDIO['clients'])
        if not want or not os.path.exists(OIDO_BIN):
            time.sleep(1); continue
        p = subprocess.Popen([OIDO_BIN], stdout=subprocess.PIPE, stderr=subprocess.PIPE, text=True, bufsize=1)
        AUDIO['running'] = True
        for line in p.stdout:
            AUDIO['error'] = ''
            with AUDIO_LOCK:
                for q in list(AUDIO['clients']):
                    try:
                        q.put_nowait(line.strip())
                    except queue.Full:
                        pass
                if not AUDIO['clients']:
                    p.terminate(); break
        p.wait()
        AUDIO['running'] = False
        err = (p.stderr.read() or '').strip()
        if p.returncode == 3 or 'declined' in err or 'TCC' in err:
            AUDIO['error'] = 'permiso'
            time.sleep(30)
        elif err:
            AUDIO['error'] = err[:160]; time.sleep(5)


# ---------- luces del cuarto: Govee por LAN (sin nube) ----------
LIGHTS = {'devices': {}, 'last_scan': 0, 'pending': {}, 'lock': threading.Lock(), 'error': ''}


def local_ip():
    for iface in ('en0', 'en1'):
        r = subprocess.run(['ipconfig', 'getifaddr', iface], capture_output=True, text=True)
        if r.stdout.strip():
            return r.stdout.strip()
    return ''


def govee_scan(seconds=3):
    ip = local_ip()
    try:
        rx = socket.socket(socket.AF_INET, socket.SOCK_DGRAM); rx.setsockopt(socket.SOL_SOCKET, socket.SO_REUSEADDR, 1)
        rx.bind(('', 4002)); rx.settimeout(.4)
        tx = socket.socket(socket.AF_INET, socket.SOCK_DGRAM); tx.setsockopt(socket.IPPROTO_IP, socket.IP_MULTICAST_TTL, 2)
        if ip:
            tx.setsockopt(socket.IPPROTO_IP, socket.IP_MULTICAST_IF, socket.inet_aton(ip))
        msg = json.dumps({'msg': {'cmd': 'scan', 'data': {'account_topic': 'reserve'}}}).encode()
        end = time.time() + seconds
        while time.time() < end:
            tx.sendto(msg, ('239.255.255.250', 4001))
            try:
                data, addr = rx.recvfrom(4096)
                d = json.loads(data).get('msg', {}).get('data', {})
                with LIGHTS['lock']:
                    LIGHTS['devices'][d.get('ip', addr[0])] = {'sku': d.get('sku', ''), 'id': d.get('device', ''), 'brand': 'govee'}
            except socket.timeout:
                pass
        rx.close(); tx.close(); LIGHTS['error'] = ''
    except OSError as e:
        LIGHTS['error'] = str(e)[:120]
    LIGHTS['last_scan'] = time.time()


def govee_send(ip, cmd, data):
    try:
        u = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
        u.sendto(json.dumps({'msg': {'cmd': cmd, 'data': data}}).encode(), (ip, 4003)); u.close()
    except OSError:
        pass


def lights_loop():
    # busca luces al arrancar y cada 2 minutos; envía como mucho ~25 órdenes por segundo por luz
    # (antes 80 ms de cola: con el pulso predictivo de lights.js ese margen se sumaba a su propio
    # adelanto, así que aquí se recorta al mínimo seguro para el firmware de Govee)
    govee_scan()
    while True:
        if time.time() - LIGHTS['last_scan'] > 120:
            threading.Thread(target=govee_scan, daemon=True).start(); LIGHTS['last_scan'] = time.time()
        with LIGHTS['lock']:
            pend, LIGHTS['pending'] = LIGHTS['pending'], {}
            ips = list(LIGHTS['devices'])
        for ip in ips:
            if 'on' in pend:
                govee_send(ip, 'turn', {'value': 1 if pend['on'] else 0})
            if 'rgb' in pend:
                r, g, b = pend['rgb']
                govee_send(ip, 'colorwc', {'color': {'r': r, 'g': g, 'b': b}, 'colorTemInKelvin': 0})
            if 'bright' in pend:
                govee_send(ip, 'brightness', {'value': max(1, min(100, int(pend['bright'])))})
        time.sleep(.04)


def lights_cmd(body):
    # solo se aceptan color, brillo y encendido; los destinos son las luces descubiertas, nunca IPs arbitrarias
    upd = {}
    if isinstance(body.get('rgb'), list) and len(body['rgb']) == 3:
        upd['rgb'] = [max(0, min(255, int(v))) for v in body['rgb']]
    if 'bright' in body:
        upd['bright'] = float(body['bright'])
    if 'on' in body:
        upd['on'] = bool(body['on'])
    with LIGHTS['lock']:
        LIGHTS['pending'].update(upd)


# ---------- clips: WebM -> MP4 (H.264) con ffmpeg ----------
def to_mp4(data):
    with tempfile.TemporaryDirectory() as d:
        src, dst = os.path.join(d, 'in.webm'), os.path.join(d, 'out.mp4')
        open(src, 'wb').write(data)
        r = subprocess.run(['ffmpeg', '-y', '-loglevel', 'error', '-i', src, '-c:v', 'libx264', '-preset', 'veryfast', '-crf', '19',
                            '-pix_fmt', 'yuv420p', '-r', '30', '-movflags', '+faststart', dst], capture_output=True, text=True, timeout=600)
        if r.returncode != 0 or not os.path.exists(dst):
            raise RuntimeError(r.stderr.strip()[:200] or 'ffmpeg falló')
        return open(dst, 'rb').read()


LOG_LAST = {}
# ---------- modo carátula: qué sigue y me gusta ----------
NEXT_ART = os.path.join(tempfile.gettempdir(), 'lumora-next.bin')
NEXT_SCRIPT = '''
tell application "Music"
  if player state is stopped then return "none"
  if shuffle enabled then return "shuffle"
  set p to current playlist
  set cid to persistent ID of current track
  set n to count of tracks of p
  set i to 0
  repeat with k from 1 to n
    if persistent ID of track k of p is cid then
      set i to k
      exit repeat
    end if
  end repeat
  if i = 0 or i >= n then return "end"
  set t to track (i + 1) of p
  set out to (name of t) & (ASCII character 31) & (artist of t) & (ASCII character 31) & (album of t)
  if (count of artworks of t) > 0 then
    set d to raw data of artwork 1 of t
    set fh to open for access (POSIX file "%s") with write permission
    set eof fh to 0
    write d to fh
    close access fh
    set out to out & (ASCII character 31) & "art"
  end if
  return out
end tell
''' % NEXT_ART
NEXT = {'key': None, 'data': {}}


def next_track():
    # solo Música deja leer la cola (y solo sin aleatorio); se recalcula una vez por canción
    with lock:
        src, key = state.get('src'), (state.get('name'), state.get('artist'))
    if src != 'music':
        return {'error': 'spotify no deja leer la cola'}
    if NEXT['key'] == key:
        return NEXT['data']
    try:
        r = osa(NEXT_SCRIPT, timeout=12)
    except Exception as e:
        return {'error': str(e)[:120]}
    if r in ('none', 'shuffle', 'end'):
        data = {'error': {'shuffle': 'aleatorio activado', 'end': 'fin de la lista', 'none': 'nada sonando'}[r]}
    else:
        f = r.split('\x1f')
        data = {'name': f[0], 'artist': f[1] if len(f) > 1 else '', 'album': f[2] if len(f) > 2 else '', 'art': int(time.time() * 1000) if len(f) > 3 else 0}
    NEXT['key'], NEXT['data'] = key, data
    return data


def like(toggle):
    with lock:
        src = state.get('src')
    if src == 'music':
        if toggle:
            osa('tell application "Music" to set favorited of current track to not (favorited of current track)')
        return {'liked': osa('tell application "Music" to get favorited of current track') == 'true', 'src': 'music'}
    if not toggle:
        return {'liked': None, 'src': 'spotify'}
    # Spotify no tiene comando: su atajo "guardar en Tus me gusta" (⌥⇧B), y se devuelve el foco a la app anterior
    script = '''
    tell application "System Events" to set prev to name of first application process whose frontmost is true
    tell application "Spotify" to activate
    delay 0.35
    tell application "System Events" to keystroke "b" using {option down, shift down}
    delay 0.2
    tell application prev to activate
    return "ok"
    '''
    try:
        osa(script, timeout=8)
        return {'liked': None, 'src': 'spotify', 'ok': True}
    except Exception as e:
        return {'error': 'macOS no dio permiso de accesibilidad para usar el atajo de Spotify', 'detail': str(e)[:120]}


# ---------- modo autor: los videos armados a mano, por canción ----------
AUTOR_FILE = os.path.expanduser('~/Library/Application Support/lumora/autor.json')
AUTOR = {'data': {}}
try:
    AUTOR['data'] = json.load(open(AUTOR_FILE))
except Exception:
    pass


def save_autor():
    try:
        os.makedirs(os.path.dirname(AUTOR_FILE), exist_ok=True)
        tmp = AUTOR_FILE + '.tmp'
        json.dump(AUTOR['data'], open(tmp, 'w'), ensure_ascii=False)
        os.replace(tmp, AUTOR_FILE)
    except Exception:
        pass


state = {'state': 'off', 'pos': 0, 'name': '', 'artist': '', 'album': '', 'dur': 0, 'at': 0, 'art': 0}
lock = threading.Lock()


def osa(script, timeout=3):
    r = subprocess.run(['osascript', '-e', script], capture_output=True, text=True, timeout=timeout)
    if r.returncode != 0:
        raise RuntimeError(r.stderr.strip())
    return r.stdout.strip()


def num(s):
    return float(s.replace(',', '.')) if s else 0.0


def poll():
    last_key = None
    while True:
        proc = subprocess.Popen(['osascript', '-l', 'JavaScript', '-e', WATCH_JXA],
                                stdout=subprocess.DEVNULL, stderr=subprocess.PIPE, text=True, bufsize=1)
        for out in proc.stderr:              # console.log de JXA escribe en stderr
            out = out.rstrip('\n')
            now = time.time()
            if out.startswith('err\x1f'):
                with lock:
                    state['error'] = out[4:][:200]
                continue
            if out in ('off', 'stopped'):
                upd = {'state': out}
            else:
                parts = (out.split('\x1f') + [''] * 10)[:10]
                src, st, pos, name, artist, album, dur, bpm, art_url, ts = parts
                upd = {'src': src, 'state': st, 'pos': num(pos), 'name': name, 'artist': artist, 'album': album, 'dur': num(dur), 'bpm': num(bpm)}
                key = (src, name, artist, album)
                if key != last_key:
                    last_key = key
                    has = False
                    try:
                        if src == 'spotify' and art_url:
                            with urllib.request.urlopen(art_url, timeout=8) as r, open(ART, 'wb') as f:
                                f.write(r.read())
                            has = True
                        elif src == 'music':
                            has = osa(ART_SCRIPT) == 'ok'
                    except Exception:
                        has = False
                    upd['art'] = int(now * 1000) if has else 0
                    if has:
                        art_keep(upd['art'])
            upd['at'] = num(ts) if out not in ('off', 'stopped') and not out.startswith('err') and num(ts) else now
            with lock:
                state.update(upd)
                state.pop('error', None)
        proc.wait()
        time.sleep(1)                        # si osascript muere, se relanza


def salud():
    """estado del puente para el lanzador; sin datos personales y sin llamar a osascript (responde en milisegundos)"""
    def abierta(app):
        try:
            return subprocess.run(['pgrep', '-x', app], capture_output=True, timeout=2).returncode == 0
        except Exception:
            return None
    osa_ok = shutil.which('osascript') is not None
    return {'lumora': True, 'version': VERSION, 'puerto': PORT, 'root': ROOT, 'osascript': osa_ok,
            'musica': abierta('Music') if osa_ok else None, 'spotify': abierta('Spotify') if osa_ok else None,
            'oido': os.path.exists(OIDO_BIN), 'traducir': os.path.exists(TR_BIN),
            'ffmpeg': shutil.which('ffmpeg') is not None, 'cancion': state.get('state', 'off')}


class Handler(SimpleHTTPRequestHandler):
    def __init__(self, *a, **k):
        super().__init__(*a, directory=ROOT, **k)

    def end_headers(self):
        self.send_header('Cache-Control', 'no-store')
        super().end_headers()

    def log_message(self, *a):
        pass

    def send_json(self, obj, code=200):
        body = json.dumps(obj).encode()
        self.send_response(code)
        self.send_header('Content-Type', 'application/json')
        self.send_header('Content-Length', str(len(body)))
        self.end_headers()
        self.wfile.write(body)

    def do_GET(self):
        path = urlparse(self.path).path
        if path == '/salud':
            return self.send_json(salud())
        if path == '/story':
            import guion
            if parse_qs(urlparse(self.path).query).get('catalog'):
                return self.send_json({'scenes': guion.SCENES, 'objects': guion.OBJECTS, 'moods': guion.MOODS, 'times': guion.TIMES,
                                       'colors': guion.COLORS, 'transitions': guion.TRANSITIONS})
            return self.send_json({'ready': guion.available(), 'model': guion.MODEL})
        if path == '/prefs':
            import guion
            p = guion.load_prefs()
            return self.send_json({'sessions': p.get('sessions', 0), 'text': guion.prefs_text(p)})
        if path == '/next':
            return self.send_json(next_track())
        if path == '/nextart':
            if not os.path.exists(NEXT_ART):
                return self.send_json({'error': 'sin carátula'}, 404)
            data = open(NEXT_ART, 'rb').read()
            self.send_response(200); self.send_header('Content-Type', 'image/png' if data[:4] == b'\x89PNG' else 'image/jpeg')
            self.send_header('Content-Length', str(len(data))); self.end_headers()
            return self.wfile.write(data)
        if path == '/like':
            try:
                return self.send_json(like(False))
            except Exception as e:
                return self.send_json({'error': str(e)[:160]})
        if path == '/autor':                                    # el video que el usuario armó a mano para esta canción
            k = parse_qs(urlparse(self.path).query).get('key', [''])[0]
            return self.send_json(AUTOR['data'].get(k) or {})
        if path == '/now':
            with lock:
                snap = dict(state)
            snap['server'] = time.time()
            return self.send_json(snap)
        if path == '/lyrics':
            qs = parse_qs(urlparse(self.path).query)
            g = lambda k: qs.get(k, [''])[0]
            return self.send_json(fetch_lyrics(g('artist'), g('title'), g('album'), float(g('dur') or 0)))
        if path == '/bpm':
            qs = parse_qs(urlparse(self.path).query)
            g = lambda k: qs.get(k, [''])[0]
            return self.send_json(fetch_bpm(g('artist'), g('title'), float(g('dur') or 0)))
        if path == '/img':
            u = parse_qs(urlparse(self.path).query).get('u', [''])[0]
            got = fetch_img(u)
            if not got:
                return self.send_json({'error': 'no'}, 404)
            self.send_response(200)
            self.send_header('Content-Type', got[0])
            self.send_header('Content-Length', str(len(got[1])))
            self.end_headers()
            return self.wfile.write(got[1])
        if path == '/wiki':
            qs = parse_qs(urlparse(self.path).query)
            return self.send_json(fetch_wiki(qs.get('q', [''])[0], qs.get('lang', ['en'])[0] if qs.get('lang', ['en'])[0] in ('en', 'es') else 'en'))
        if path == '/audio':
            self.send_response(200)
            self.send_header('Content-Type', 'text/event-stream')
            self.send_header('Connection', 'keep-alive')
            self.end_headers()
            q = queue.Queue(maxsize=90)
            with AUDIO_LOCK:
                AUDIO['clients'].append(q)
            try:
                while True:
                    try:
                        self.wfile.write(('data: ' + q.get(timeout=2) + '\n\n').encode())
                    except queue.Empty:
                        msg = json.dumps({'error': AUDIO['error'], 'running': AUDIO['running']})
                        self.wfile.write(('event: status\ndata: ' + msg + '\n\n').encode())
                    self.wfile.flush()
            except (BrokenPipeError, ConnectionResetError, OSError):
                pass
            finally:
                with AUDIO_LOCK:
                    AUDIO['clients'].remove(q)
            return
        if path == '/lights':
            if parse_qs(urlparse(self.path).query).get('scan'):
                threading.Thread(target=govee_scan, daemon=True).start()
            with LIGHTS['lock']:
                devs = [{'ip': ip, **d} for ip, d in LIGHTS['devices'].items()]
            return self.send_json({'devices': devs, 'error': LIGHTS['error']})
        if path == '/art':
            token = urlparse(self.path).query
            src = ART
            if token.isdigit():                              # una portada concreta: la guardada, nunca la de otra canción
                kept = os.path.join(ART_DIR, token + '.bin')
                if os.path.exists(kept):
                    src = kept
                elif int(token) != state.get('art'):
                    return self.send_json({'error': 'sin carátula'}, 404)
            if not os.path.exists(src):
                return self.send_json({'error': 'sin carátula'}, 404)
            data = open(src, 'rb').read()
            ctype = 'image/png' if data[:4] == b'\x89PNG' else 'image/jpeg'
            self.send_response(200)
            self.send_header('Content-Type', ctype)
            if src != ART:
                self.send_header('Cache-Control', 'max-age=31536000, immutable')
            self.send_header('Content-Length', str(len(data)))
            self.end_headers()
            return self.wfile.write(data)
        return super().do_GET()

    def do_POST(self):
        u = urlparse(self.path)
        if u.path == '/log':                                   # errores de la página, para depurar
            n = int(self.headers.get('Content-Length') or 0)
            msg = self.rfile.read(min(n, 2000)).decode('utf-8', 'replace')
            if msg != LOG_LAST.get('m'):
                LOG_LAST['m'] = msg; print('[página]', msg, flush=True)
            return self.send_json({'ok': True})
        if u.path == '/prefs':                                 # tu estilo de director: lo que cambias en el modo autor
            n = int(self.headers.get('Content-Length') or 0)
            try:
                import guion
                return self.send_json(guion.learn(json.loads(self.rfile.read(n) or b'{}')))
            except Exception as e:
                return self.send_json({'error': str(e)[:160]}, 500)
        if u.path == '/like':
            try:
                return self.send_json(like(True))
            except Exception as e:
                return self.send_json({'error': str(e)[:160]})
        if u.path == '/autor':
            n = int(self.headers.get('Content-Length') or 0)
            body = json.loads(self.rfile.read(min(n, 4_000_000)) or b'{}')
            k = str(body.get('key') or '')
            if not k:
                return self.send_json({'error': 'falta la canción'}, 400)
            if body.get('delete'):
                AUTOR['data'].pop(k, None)
            else:
                AUTOR['data'][k] = {**body.get('project', {}), 'saved': time.time()}
            save_autor()
            return self.send_json({'ok': True})
        if u.path == '/story':                                 # guion completo de la canción, escrito por Claude
            n = int(self.headers.get('Content-Length') or 0)
            try:
                import guion
                return self.send_json(guion.storyboard(json.loads(self.rfile.read(n) or b'{}')))
            except Exception as e:
                return self.send_json({'error': str(e)[:200]}, 500)
        if u.path == '/convert':
            n = int(self.headers.get('Content-Length') or 0)
            if n <= 0 or n > 800 * 1024 * 1024:
                return self.send_json({'error': 'tamaño inválido'}, 400)
            try:
                mp4 = to_mp4(self.rfile.read(n))
            except Exception as e:
                return self.send_json({'error': str(e)[:200]}, 500)
            self.send_response(200)
            self.send_header('Content-Type', 'video/mp4')
            self.send_header('Content-Length', str(len(mp4)))
            self.end_headers()
            return self.wfile.write(mp4)
        if u.path == '/lights':
            n = int(self.headers.get('Content-Length') or 0)
            lights_cmd(json.loads(self.rfile.read(n) or b'{}'))
            return self.send_json({'ok': True})
        if u.path == '/translate':
            n = int(self.headers.get('Content-Length') or 0)
            body = json.loads(self.rfile.read(n) or b'{}')
            try:
                return self.send_json(translate(body.get('lines') or [], body.get('src', 'en'), body.get('dst', 'es')))
            except Exception as e:
                return self.send_json({'error': str(e)[:200]}, 500)
        if u.path != '/cmd':
            return self.send_json({'error': 'no'}, 404)
        c = parse_qs(u.query).get('c', [''])[0]
        try:
            app = 'Spotify' if state.get('src') == 'spotify' else 'Music'
            if c == 'playpause':
                osa('tell application "%s" to playpause' % app)
            elif c in ('play', 'pause'):
                osa('tell application "%s" to %s' % (app, c))
            elif c.startswith('seek:'):
                d = float(c[5:])
                osa('tell application "%s" to set player position to ((player position) + (%s))' % (app, d))
            elif c == 'next':
                osa('tell application "%s" to next track' % app)
            elif c == 'prev':
                osa('tell application "%s" to previous track' % app)
            elif c.startswith('goto:'):
                osa('tell application "%s" to set player position to %s' % (app, max(0.0, float(c[5:]))))
            elif c == 'start':
                osa('tell application "%s" to set player position to 0' % app)
            else:
                return self.send_json({'error': 'comando desconocido'}, 400)
            return self.send_json({'ok': True})
        except Exception as e:
            return self.send_json({'error': str(e)[:200]}, 500)


class Servidor(ThreadingHTTPServer):
    def handle_error(self, request, client_address):
        if isinstance(sys.exc_info()[1], (BrokenPipeError, ConnectionResetError)):   # el navegador cerró la conexión: no es un error
            return
        super().handle_error(request, client_address)


def es_lumora(port):
    try:
        with urllib.request.urlopen('http://127.0.0.1:%d/salud' % port, timeout=1.5) as r:
            return bool(json.loads(r.read()).get('lumora'))
    except Exception:
        try:                                                   # puentes anteriores a /salud
            with urllib.request.urlopen('http://127.0.0.1:%d/now' % port, timeout=1.5) as r:
                return 'server' in json.loads(r.read())
        except Exception:
            return False


def puerto_libre(port):
    with socket.socket() as sk:
        return sk.connect_ex(('127.0.0.1', port)) != 0


if __name__ == '__main__':
    try:
        sys.stdout.reconfigure(line_buffering=True)
        sys.stderr.reconfigure(line_buffering=True)
    except Exception:
        pass
    ThreadingHTTPServer.daemon_threads = True
    ThreadingHTTPServer.request_queue_size = 128                     # la página pide ~25 scripts a la vez; con la cola por defecto (5) se perdían
    server = None
    for port in range(PORT, PORT + 20):
        if es_lumora(port):                                          # ya hay un puente de lumora: se reutiliza
            print(f'ya hay un puente de lumora en http://127.0.0.1:{port}/index.html')
            sys.exit(0)
        if not puerto_libre(port):
            print(f'el puerto {port} está ocupado por otro programa, pruebo el siguiente')
            continue
        try:
            server = Servidor(('127.0.0.1', port), Handler)
            PORT = port
            break
        except OSError:
            continue
    if server is None:
        print('no encontré un puerto libre'); sys.exit(1)
    try:
        os.makedirs(os.path.dirname(PORT_FILE), exist_ok=True)
        open(PORT_FILE, 'w').write(str(PORT))
    except OSError:
        pass
    def salir(*_):                                                   # al apagarse no deja osascript ni herramientas nativas huérfanas
        subprocess.run(['pkill', '-TERM', '-P', str(os.getpid())])
        os._exit(0)
    signal.signal(signal.SIGTERM, salir)
    signal.signal(signal.SIGINT, salir)
    threading.Thread(target=poll, daemon=True).start()
    threading.Thread(target=audio_loop, daemon=True).start()
    threading.Thread(target=lights_loop, daemon=True).start()
    threading.Thread(target=lambda: (translate(['hello'], 'en', 'es'), translate(['hola'], 'es', 'en')), daemon=True).start()   # precalienta ambas direcciones
    print(f'abre http://127.0.0.1:{PORT}/index.html')
    if os.environ.get('LUMORA_PARENT'):                              # lanzado por Lumora.app: si la app desaparece, el puente se apaga solo
        def vigilar(padre):
            while os.getppid() == padre:
                time.sleep(2)
            subprocess.run(['pkill', '-TERM', '-P', str(os.getpid())])
            os._exit(0)
        threading.Thread(target=vigilar, args=(int(os.environ['LUMORA_PARENT']),), daemon=True).start()
    server.serve_forever()
