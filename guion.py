# ============================================================
# guion.py — Claude lee la canción entera antes de empezar y escribe
# el guion del video: por estrofa (escenario, objetos, ánimo, energía,
# hora, color, transición) y por verso (qué aparece justo en ese verso,
# la palabra que manda y si va en grande). Se guarda en disco: cada
# canción se analiza una sola vez. En el disco solo queda el guion,
# nunca la letra.
# ============================================================
import glob, hashlib, json, os, shutil, subprocess, sys, threading

ROOT = os.path.dirname(os.path.abspath(__file__))
for sp in glob.glob(os.path.join(ROOT, '.venv', 'lib', 'python3*', 'site-packages')):   # el SDK vive en el entorno del proyecto
    if sp not in sys.path:
        sys.path.append(sp)

MODEL = 'claude-sonnet-5'                                         # con la suscripción (Claude Code); con clave de API usa el mismo
EFFORT = 'medium'
CLAUDE_BIN = shutil.which('claude') or '/opt/homebrew/bin/claude'
VERSION = 'g4'                                                   # cambia si cambia el prompt: invalida la memoria
KEY_FILE = os.path.expanduser('~/.config/taxicab/anthropic_key')
CACHE_FILE = os.path.expanduser('~/Library/Caches/taxicab-guiones.json')

# ---------- lo que la app sabe dibujar ----------
SCENES = {
    'calle': 'calle de ciudad de noche: edificios, farolas, asfalto mojado',
    'playa': 'playa con mar y olas, arena, horizonte',
    'club': 'discoteca: láseres, humo, luces de fiesta',
    'campo': 'campo abierto, pasto o trigo, naturaleza, cielo grande',
    'cielo': 'cielo con nubes a una hora concreta del día (amanecer, día, atardecer, noche)',
    'habitacion': 'cuarto íntimo con ventana: soledad, intimidad, pensamientos, noches en casa',
    'escenario': 'escenario de concierto: reflectores y público',
    'azotea': 'azotea sobre la ciudad de noche, luces a lo lejos',
    'estadio': 'estadio deportivo con tribunas y reflectores',
    'sistema': 'pantalla de computadora: código, binario, sistemas, internet',
    'ciudadHeroe': 'ciudad de cómic con silueta de superhéroe',
    'nebulosa': 'nubes cósmicas de color: sueños, misterio, mente, lo abstracto',
    'deriva': 'viaje entre estrellas: volar, escapar, el espacio, avanzar',
    'orbitas': 'planetas y lunas girando: ciclos, gravedad, atracción, destino',
    'aurora': 'auroras boreales ondulando: frío, agua, lluvia, calma, tristeza serena',
    'horizonte': 'horizonte con sol o lunas enormes: esperanza, cielo, fe, luz',
    'tunel': 'túnel en movimiento: velocidad, tiempo, carretera, huida',
    'mandala': 'geometría sagrada radial: amor, espiritualidad, trance, baile',
    'red': 'red de nodos conectados: conexiones, ciudad, redes sociales, distancia',
    'corriente': 'flujo de energía como fuego o río: pasión, rabia, caos, tormenta',
}
OBJECTS = {
    'rain': 'lluvia', 'snow': 'nieve', 'fire': 'fuego', 'stars': 'estrellas', 'moon': 'luna', 'sun': 'sol', 'sea': 'mar y olas',
    'city': 'edificios de ciudad', 'road': 'carretera', 'love': 'corazones / amor', 'flowers': 'flores', 'fly': 'alas / volar',
    'time': 'reloj / tiempo', 'heaven': 'cielo divino / fe / Dios', 'death': 'muerte / calavera', 'tears': 'lágrimas', 'dream': 'sueño',
    'gold': 'oro / joyas / lujo', 'home': 'casa / hogar', 'thunder': 'rayos / tormenta', 'dance': 'baile', 'eyes': 'ojos / mirada',
    'dark': 'oscuridad', 'light': 'luz intensa', 'woman': 'una mujer (figura)', 'man': 'un hombre (figura)', 'couple': 'una pareja',
    'crowd': 'multitud / fiesta', 'phone': 'teléfono / mensajes / llamadas', 'beach': 'palmeras y playa', 'mountain': 'montañas',
    'forest': 'bosque / árboles', 'drink': 'copas / alcohol', 'smoke': 'humo / fumar', 'fashion': 'moda / ropa / tacones',
    'money': 'billetes / dinero', 'music': 'notas musicales / cantar', 'plane': 'avión / viajar', 'fireworks': 'fuegos artificiales / celebrar',
    'rainbow': 'arcoíris', 'lanterns': 'farolillos flotando / deseos', 'butterflies': 'mariposas', 'meteors': 'estrellas fugaces',
    'taillights': 'luces traseras de autos / manejar de noche', 'neonrings': 'aros de neón', 'flamboyan': 'árbol de flores rojas / trópico',
    'polaroids': 'fotos polaroid / recuerdos', 'leaves': 'hojas cayendo / otoño', 'filmgrain': 'grano de película / pasado',
    'lightleak': 'destellos de luz de película / nostalgia', 'silk': 'seda / sensualidad', 'flicker': 'parpadeo / inestabilidad',
    'psyche': 'psicodelia / drogas / delirio', 'rollercoaster': 'montaña rusa / altibajos', 'cactus': 'desierto / cactus',
    'blinds': 'luz entre persianas / noche íntima', 'candles': 'velas', 'vinyl': 'disco de vinilo', 'disco': 'bola de disco',
    'sparkle': 'destellos / brillo', 'speakers': 'bocinas / bajo fuerte', 'vhs': 'video VHS / años 80-90', 'graffiti': 'grafiti / barrio',
    'neonpalms': 'palmeras de neón / Miami', 'tech': 'tecnología / software', 'binary': 'lluvia de binario', 'terminal': 'terminal de comandos',
    'network': 'red de datos', 'hero': 'emblema de superhéroe', 'halftone': 'trama de cómic', 'speedlines': 'líneas de velocidad de cómic',
    'pow': 'onomatopeya de cómic / golpe', 'web': 'telaraña', 'sport': 'deporte nombrado en la letra', 'nation': 'país nombrado en la letra',
    'brand': 'marca nombrada en la letra',
}
MOODS = ['euforico', 'feliz', 'romantico', 'sereno', 'nostalgico', 'melancolico', 'triste', 'oscuro', 'rabioso', 'desafiante']
TIMES = ['amanecer', 'dia', 'atardecer', 'noche', 'madrugada']
COLORS = ['calido', 'frio', 'neon', 'pastel', 'oscuro', 'dorado', 'rojo', 'azul', 'verde', 'violeta']
TRANSITIONS = {
    'suave': 'fundido lento, para continuidad y calma',
    'corte': 'corte limpio o barrido, cambio de lugar o de tema',
    'impacto': 'golpe: quiebre, glitch, zoom; para drops, coros explosivos o giros duros',
    'onirico': 'onda, remolino, iris; para sueños, recuerdos, lo irreal',
    'velocidad': 'salto de velocidad hacia adelante; para huir, avanzar, acelerar',
}

SYSTEM = f"""Eres el director de arte de videos oficiales de letras (lyric videos). Recibes la letra completa de una canción, verso por verso con sus tiempos y repartida en bloques de tiempo. Antes de filmar nada, lees la canción entera, entiendes la historia, el punto de vista, las metáforas y cómo evoluciona, y luego escribes el guion visual.

Lo que importa por encima de todo: que cada imagen tenga que ver con lo que dice la letra en ese momento. Quien mire el video debe sentir que alguien leyó la canción y la ilustró a propósito. Nada decorativo al azar.

Cómo decidir:
- Primero lo literal: lo que la letra nombra o describe (un lugar, un objeto, una persona, el clima, una hora).
- Luego lo que la letra quiere decir: convierte las metáforas en imágenes concretas del catálogo (por ejemplo, "me estoy ahogando en esto" en una historia de amor no es el mar literal: es lágrimas o lluvia; "brillo como el oro" sí puede ser oro).
- Usa el contexto de toda la canción: el mismo verso significa distinto según la historia. Un coro que vuelve puede repetir sus imágenes; eso da identidad.
- Si un bloque no tiene letra (intro, puente instrumental, final), elige algo que prepare o cierre lo que viene, coherente con el tono.
- Menos es más: 1 a 3 objetos por bloque, 0 a 2 por verso. Solo pones un objeto en un verso cuando ese verso lo pide.
- Las figuras de personas: woman, man o couple solo cuando la letra habla de alguien concreto (ella, él, nosotros). Fíjate en el género de quien se habla.
- sport, nation y brand solo si la letra nombra un deporte, país o marca real.
- La energía (0 a 10) sigue la estructura: estrofas más bajas, coros y drops más altos, final que baja o explota según la canción.
- Variedad con sentido: no repitas el mismo escenario más de 2 bloques seguidos salvo que la historia siga en ese lugar.
- scene2 es un escenario secundario tenue mezclado detrás; úsalo solo si suma al significado, si no pon "ninguno". atmos es una capa ambiental suave para todo el bloque (por ejemplo lluvia en un bloque triste); "ninguno" si no hace falta.
- word: la palabra más importante del verso, copiada tal cual como aparece en el verso (una sola palabra). big: true solo en los versos que merecen la palabra gigante en pantalla (ganchos, remates, la palabra clave del coro); como mucho uno de cada cinco versos.
- person: nombre exacto de una persona famosa real si el verso la menciona explícitamente; si no, cadena vacía. Nunca personajes de ficción.
- summary: qué significa el bloque, máximo 9 palabras, en español, con palabras propias. Nunca copies más de 3 palabras seguidas de la letra.
- story: la historia de la canción en una o dos frases, en español, con palabras propias.

Escenarios disponibles (scene / scene2):
{chr(10).join(f'- {k}: {v}' for k, v in SCENES.items())}

Objetos disponibles (objects / atmos):
{chr(10).join(f'- {k}: {v}' for k, v in OBJECTS.items())}

Transiciones de entrada a cada bloque:
{chr(10).join(f'- {k}: {v}' for k, v in TRANSITIONS.items())}

Ánimos: {', '.join(MOODS)}. Horas: {', '.join(TIMES)}. Colores: {', '.join(COLORS)}.

Devuelve un plan para cada bloque (n = número del bloque). En lines incluye solo los versos donde pasa algo: tienen objetos, van en grande, nombran a una persona famosa o tienen una palabra clave clara; los demás omítelos.

Sé eficiente: el video espera tu respuesta. Razona lo justo para entender la historia y decide directo, sin repasar cada verso por separado en tu razonamiento."""

_obj = list(OBJECTS)
SCHEMA = {
    'type': 'object', 'additionalProperties': False, 'required': ['story', 'blocks', 'lines'],
    'properties': {
        'story': {'type': 'string'},
        'blocks': {'type': 'array', 'items': {
            'type': 'object', 'additionalProperties': False,
            'required': ['n', 'scene', 'scene2', 'objects', 'atmos', 'mood', 'energy', 'time', 'color', 'transition', 'summary'],
            'properties': {
                'n': {'type': 'integer'},
                'scene': {'type': 'string', 'enum': list(SCENES)},
                'scene2': {'type': 'string', 'enum': list(SCENES) + ['ninguno']},
                'objects': {'type': 'array', 'items': {'type': 'string', 'enum': _obj}},
                'atmos': {'type': 'string', 'enum': _obj + ['ninguno']},
                'mood': {'type': 'string', 'enum': MOODS},
                'energy': {'type': 'integer'},
                'time': {'type': 'string', 'enum': TIMES},
                'color': {'type': 'string', 'enum': COLORS},
                'transition': {'type': 'string', 'enum': list(TRANSITIONS)},
                'summary': {'type': 'string'},
            }}},
        'lines': {'type': 'array', 'items': {
            'type': 'object', 'additionalProperties': False, 'required': ['i', 'objects', 'word', 'big', 'person'],
            'properties': {
                'i': {'type': 'integer'},
                'objects': {'type': 'array', 'items': {'type': 'string', 'enum': _obj}},
                'word': {'type': 'string'},
                'big': {'type': 'boolean'},
                'person': {'type': 'string'},
            }}},
    },
}

STATE = {'client': None, 'cache': {}, 'lock': threading.Lock(), 'inflight': {}}
try:
    STATE['cache'] = json.load(open(CACHE_FILE))
except Exception:
    pass


def _save():
    try:
        os.makedirs(os.path.dirname(CACHE_FILE), exist_ok=True)
        tmp = CACHE_FILE + '.tmp'
        json.dump(STATE['cache'], open(tmp, 'w'), ensure_ascii=False)
        os.replace(tmp, CACHE_FILE)
    except Exception:
        pass


def _client():
    if STATE['client']:
        return STATE['client']
    import anthropic
    key = os.environ.get('ANTHROPIC_API_KEY') or (open(KEY_FILE).read().strip() if os.path.exists(KEY_FILE) else '')
    if not key:
        raise RuntimeError('falta la clave de Claude')
    STATE['client'] = anthropic.Anthropic(api_key=key, base_url='https://api.anthropic.com', timeout=300.0, max_retries=2)   # nunca un proxy heredado del entorno
    return STATE['client']


def has_key():
    return bool(os.environ.get('ANTHROPIC_API_KEY') or os.path.exists(KEY_FILE))


def available():
    return has_key() or os.path.exists(CLAUDE_BIN)


def _ask_cli(req):
    # tu suscripción de Claude vía Claude Code sin interfaz: sin herramientas, sin sesión guardada, sin ajustes ni hooks
    env = {k: v for k, v in os.environ.items() if not k.startswith(('ANTHROPIC_', 'CLAUDE_CODE', 'CLAUDECODE'))}
    effort = 'low' if req.get('fast') else EFFORT                # el primer tramo es lo único que se espera: va rápido
    cmd = [CLAUDE_BIN, '-p', '--model', MODEL, '--effort', effort, '--output-format', 'json', '--no-session-persistence',
           '--tools', '', '--setting-sources', '', '--strict-mcp-config', '--disable-slash-commands',
           '--system-prompt', SYSTEM, '--json-schema', json.dumps(SCHEMA)]
    r = subprocess.run(cmd, input=_prompt(req), capture_output=True, text=True, timeout=600, env=env, cwd=os.path.expanduser('~'))
    try:
        res = json.loads(r.stdout)
    except ValueError:
        raise RuntimeError((r.stderr or r.stdout or 'Claude Code no respondió').strip()[-160:])
    out = res.get('structured_output')
    if out is None and res.get('is_error'):
        raise RuntimeError(f"{res.get('subtype')}: {res.get('api_error_status') or ''} {str(res.get('result') or '')[:120]}")
    if out is None:
        text = (res.get('result') or '').strip().removeprefix('```json').removesuffix('```')
        try:
            out = json.loads(text)
        except ValueError:
            raise RuntimeError('sin guion estructurado: ' + text[:100])
    u = res.get('usage') or {}
    out['usage'] = {'in': u.get('input_tokens', 0), 'out': u.get('output_tokens', 0), 'cache': u.get('cache_read_input_tokens', 0), 'via': 'suscripción'}
    return out


def _mmss(t):
    t = max(0, int(t or 0))
    return f'{t // 60}:{t % 60:02d}'


def _prompt(req):
    lines, cuts = req.get('lines') or [], req.get('cuts') or [0]
    out = [f"Canción: {req.get('title', '')}", f"Artista: {req.get('artist', '')}"]
    if req.get('genre'):
        out.append(f"Género: {req['genre']}")
    if req.get('dur'):
        out.append(f"Duración: {_mmss(req['dur'])}")
    out.append('')
    for n, a in enumerate(cuts):
        b = cuts[n + 1] if n + 1 < len(cuts) else float('inf')
        inside = [l for l in lines if a <= l['t'] < b]
        end = _mmss(b) if b != float('inf') else 'fin'
        out.append(f'Bloque {n} ({_mmss(a)}–{end})' + ('' if inside else ' — instrumental, sin letra'))
        out += [f"  [{l['i']}] {_mmss(l['t'])}  {l['text']}" for l in inside]
    rg = req.get('range')
    if rg:                                                      # la canción se reparte entre dos lecturas simultáneas
        a, b = int(rg[0]), int(rg[1])
        idx = [l['i'] for l in lines if a <= _block_of(l['t'], cuts) <= b]
        out += ['', f'Lee la canción completa para entender la historia, pero en esta respuesta escribe el guion SOLO de los bloques {a} a {b}'
                    + (f' y de los versos {idx[0]} a {idx[-1]}' if idx else ' (no tienen versos: lines vacío)')
                    + '. Otras lecturas hacen el resto con la misma letra: mantén la coherencia (un coro que se repite usa las mismas imágenes y escenarios).'
                    + (' story: la historia de toda la canción.' if a == 0 else ' story: cadena vacía.')]
    return '\n'.join(out)


def _block_of(t, cuts):
    n = 0
    for k, c in enumerate(cuts):
        if c <= t:
            n = k
    return n


def _ask(req):
    import anthropic
    client = _client()
    kw = dict(
        model=MODEL, max_tokens=32000,
        system=[{'type': 'text', 'text': SYSTEM, 'cache_control': {'type': 'ephemeral'}}],
        thinking={'type': 'adaptive'},
        output_config={'effort': 'low' if req.get('fast') else EFFORT, 'format': {'type': 'json_schema', 'schema': SCHEMA}},
        messages=[{'role': 'user', 'content': _prompt(req)}],
    )
    try:   # si el filtro de seguridad rechaza la letra (temas oscuros), el servidor reintenta con otro modelo
        with client.beta.messages.stream(betas=['server-side-fallback-2026-07-01'], fallbacks='default', **kw) as s:
            msg = s.get_final_message()
    except anthropic.BadRequestError as e:
        if 'fallback' not in str(e).lower():
            raise
        with client.messages.stream(**kw) as s:
            msg = s.get_final_message()
    if msg.stop_reason == 'refusal':
        raise RuntimeError('Claude no quiso analizar esta letra')
    if msg.stop_reason == 'max_tokens':
        raise RuntimeError('respuesta incompleta')
    text = next((b.text for b in msg.content if b.type == 'text'), '')
    out = json.loads(text)
    u = msg.usage
    out['usage'] = {'in': u.input_tokens, 'out': u.output_tokens, 'cache': getattr(u, 'cache_read_input_tokens', 0) or 0}
    return out


def storyboard(req):
    lines = [{'i': int(l['i']), 't': round(float(l['t']), 1), 'text': str(l['text'])[:300]} for l in (req.get('lines') or []) if str(l.get('text', '')).strip()]
    cuts = [round(float(c), 1) for c in (req.get('cuts') or [0])]
    req = {**req, 'lines': lines, 'cuts': cuts}
    key = hashlib.sha1(json.dumps([VERSION, MODEL, req.get('title'), req.get('artist'), lines, cuts, req.get('range'), bool(req.get('fast'))], ensure_ascii=False).encode()).hexdigest()
    if key in STATE['cache']:
        return {**STATE['cache'][key], 'cached': True}
    full = hashlib.sha1(json.dumps([VERSION, MODEL, req.get('title'), req.get('artist'), lines, cuts, None], ensure_ascii=False).encode()).hexdigest()
    if req.get('range') and full in STATE['cache']:            # ya estaba leída entera de una vez
        return {**STATE['cache'][full], 'cached': True}
    if not lines:
        return {'error': 'sin letra'}
    with STATE['lock']:                                           # la misma canción pedida dos veces se analiza una vez
        ev = STATE['inflight'].get(key)
        mine = ev is None
        if mine:
            ev = STATE['inflight'][key] = threading.Event()
    if not mine:
        ev.wait(400)
        return {**STATE['cache'][key], 'cached': True} if key in STATE['cache'] else {'error': 'falló el análisis'}
    try:
        out = _ask(req) if has_key() else _ask_cli(req)
        STATE['cache'][key] = out
        _save()
        return out
    except Exception as e:
        return {'error': str(e)[:160]}
    finally:
        ev.set()
        STATE['inflight'].pop(key, None)
