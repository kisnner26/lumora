// ============================================================
// riso-explorar.js — exploración (fase 7): mapa ilustrado, atlas de tu música y criatura.
//   · mapa: 71 ciudades sobre un planisferio dibujado a mano; se encienden las que nombran las letras de tus canciones
//   · atlas: un archipiélago con una isla por ánimo; cada canción es un pueblito, más grande cuanto más la escuchas
//   · criatura: nace y crece con lo que escuchas (tamaño, colores, orejas, manchas, cara según ánimo y días sin oír música)
// Todo sale del historial y las letras guardados en este navegador (riso-store.js). Se dibuja con un segundo
// Stage del motor (el mismo del póster), a demanda; nada sale del navegador.
// ============================================================
(() => {
  const R = window.RISO, POS = window.RISOPOSTER, ST = window.RISOSTORE; if (!R || !POS || !ST) return;
  const K = R.K, clamp = R.clamp, TAU = Math.PI * 2, sin = Math.sin, cos = Math.cos;
  const EXP = window.RISOEXP = { tab: 'mapa', job: null, sel: null, busy: false };
  const norm = s => String(s || '').toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '');
  const hash = s => { let h = 2166136261; for (const c of String(s)) h = Math.imul(h ^ c.charCodeAt(0), 16777619); return h >>> 0; };
  const esc = s => String(s == null ? '' : s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));

  // ---------- ciudades: id, nombre, longitud, latitud, alias sin acentos ----------
  const CITIES = [
    ['managua', 'Managua', -86.3, 12.1, 'managua|momotombo'], ['cdmx', 'Ciudad de México', -99.1, 19.4, 'cdmx|ciudad de mexico|mexico city|tenochtitlan'], ['gdl', 'Guadalajara', -103.3, 20.7, 'guadalajara'], ['mty', 'Monterrey', -100.3, 25.7, 'monterrey'],
    ['habana', 'La Habana', -82.4, 23.1, 'la habana|havana'], ['sanjuan', 'San Juan', -66.1, 18.4, 'san juan'], ['sdomingo', 'Santo Domingo', -69.9, 18.5, 'santo domingo'], ['kingston', 'Kingston', -76.8, 18.0, 'kingston'],
    ['guate', 'Ciudad de Guatemala', -90.5, 14.6, 'guatemala city|ciudad de guatemala'], ['sansalvador', 'San Salvador', -89.2, 13.7, 'san salvador'], ['tegus', 'Tegucigalpa', -87.2, 14.1, 'tegucigalpa'], ['panama', 'Panamá', -79.5, 9.0, 'ciudad de panama|panama city'],
    ['bogota', 'Bogotá', -74.1, 4.7, 'bogota'], ['medellin', 'Medellín', -75.6, 6.2, 'medellin'], ['cartagena', 'Cartagena', -75.5, 10.4, 'cartagena'], ['caracas', 'Caracas', -66.9, 10.5, 'caracas'], ['quito', 'Quito', -78.5, -0.2, 'quito'],
    ['lima', 'Lima', -77.0, -12.0, 'lima peru|lima'], ['lapaz', 'La Paz', -68.1, -16.5, 'la paz'], ['santiago', 'Santiago', -70.7, -33.4, 'santiago de chile|santiago'], ['baires', 'Buenos Aires', -58.4, -34.6, 'buenos aires'], ['montevideo', 'Montevideo', -56.2, -34.9, 'montevideo'],
    ['rio', 'Río de Janeiro', -43.2, -22.9, 'rio de janeiro'], ['saopaulo', 'São Paulo', -46.6, -23.6, 'sao paulo'],
    ['nyc', 'Nueva York', -74.0, 40.7, 'nueva york|new york|nyc|brooklyn|manhattan|harlem'], ['la', 'Los Ángeles', -118.2, 34.0, 'los angeles|hollywood|compton'], ['miami', 'Miami', -80.2, 25.8, 'miami'], ['chicago', 'Chicago', -87.6, 41.9, 'chicago'],
    ['houston', 'Houston', -95.4, 29.8, 'houston'], ['atlanta', 'Atlanta', -84.4, 33.7, 'atlanta'], ['detroit', 'Detroit', -83.0, 42.3, 'detroit'], ['nashville', 'Nashville', -86.8, 36.2, 'nashville'], ['vegas', 'Las Vegas', -115.1, 36.2, 'las vegas'],
    ['nola', 'Nueva Orleans', -90.1, 30.0, 'nueva orleans|new orleans'], ['sf', 'San Francisco', -122.4, 37.8, 'san francisco'], ['seattle', 'Seattle', -122.3, 47.6, 'seattle'], ['toronto', 'Toronto', -79.4, 43.7, 'toronto'], ['montreal', 'Montreal', -73.6, 45.5, 'montreal'],
    ['londres', 'Londres', -0.1, 51.5, 'londres|london'], ['paris', 'París', 2.35, 48.86, 'paris'], ['madrid', 'Madrid', -3.7, 40.4, 'madrid'], ['barcelona', 'Barcelona', 2.17, 41.4, 'barcelona'], ['sevilla', 'Sevilla', -6.0, 37.4, 'sevilla'],
    ['berlin', 'Berlín', 13.4, 52.5, 'berlin'], ['roma', 'Roma', 12.5, 41.9, 'roma|rome'], ['milan', 'Milán', 9.2, 45.5, 'milan'], ['venecia', 'Venecia', 12.3, 45.4, 'venecia|venice'], ['amsterdam', 'Ámsterdam', 4.9, 52.4, 'amsterdam'], ['lisboa', 'Lisboa', -9.1, 38.7, 'lisboa|lisbon'],
    ['moscu', 'Moscú', 37.6, 55.8, 'moscu|moscow'], ['estambul', 'Estambul', 29.0, 41.0, 'estambul|istanbul'], ['atenas', 'Atenas', 23.7, 38.0, 'atenas|athens'], ['dublin', 'Dublín', -6.3, 53.3, 'dublin'], ['viena', 'Viena', 16.4, 48.2, 'viena|vienna'], ['ibiza', 'Ibiza', 1.4, 38.9, 'ibiza'],
    ['cairo', 'El Cairo', 31.2, 30.0, 'el cairo|cairo'], ['lagos', 'Lagos', 3.4, 6.5, 'lagos nigeria|lagos'], ['joburg', 'Johannesburgo', 28.0, -26.2, 'johannesburgo|johannesburg'], ['ciudadcabo', 'Ciudad del Cabo', 18.4, -33.9, 'ciudad del cabo|cape town'], ['marrakech', 'Marrakech', -8.0, 31.6, 'marrakech'],
    ['dubai', 'Dubái', 55.3, 25.2, 'dubai'], ['mumbai', 'Bombay', 72.9, 19.1, 'mumbai|bombay'], ['bangkok', 'Bangkok', 100.5, 13.8, 'bangkok'], ['tokio', 'Tokio', 139.7, 35.7, 'tokio|tokyo'], ['seul', 'Seúl', 127.0, 37.6, 'seul|seoul'],
    ['pekin', 'Pekín', 116.4, 39.9, 'pekin|beijing'], ['shanghai', 'Shanghái', 121.5, 31.2, 'shanghai'], ['hongkong', 'Hong Kong', 114.2, 22.3, 'hong kong'], ['singapur', 'Singapur', 103.8, 1.35, 'singapur|singapore'], ['sidney', 'Sídney', 151.2, -33.9, 'sidney|sydney'], ['telaviv', 'Tel Aviv', 34.8, 32.1, 'tel aviv'],
  ].map(([id, name, lon, lat, al]) => ({ id, name, lon, lat, rx: new RegExp('(?<![a-z])(' + al + ')(?![a-z])') }));
  EXP.CITIES = CITIES;

  // ---------- continentes a mano [lon, lat] ----------
  const LAND = [
    [[-168, 66], [-156, 71], [-130, 70], [-110, 72], [-95, 70], [-85, 68], [-80, 62], [-94, 58], [-88, 52], [-80, 52], [-78, 58], [-70, 60], [-62, 58], [-56, 52], [-60, 47], [-66, 44], [-70, 42], [-74, 40], [-76, 35], [-81, 31], [-80, 26], [-82, 27], [-85, 30], [-90, 30], [-95, 29], [-97, 26], [-97, 21], [-95, 18], [-91, 19], [-90, 21], [-87, 21], [-88, 17], [-88, 15], [-84, 15], [-83, 11], [-81, 9], [-77, 8], [-79, 7], [-80, 8], [-84, 9], [-86, 11], [-88, 13], [-92, 15], [-96, 16], [-100, 17], [-105, 20], [-108, 25], [-113, 31], [-115, 32], [-117, 33], [-121, 35], [-124, 40], [-124, 47], [-130, 55], [-138, 59], [-148, 60], [-155, 58], [-163, 55], [-166, 60]],
    [[-80, 9], [-77, 8], [-72, 12], [-64, 10], [-60, 8], [-52, 5], [-50, 0], [-44, -2], [-35, -6], [-38, -13], [-40, -20], [-48, -26], [-53, -34], [-58, -38], [-62, -40], [-65, -45], [-68, -52], [-70, -55], [-74, -50], [-73, -40], [-71, -30], [-70, -18], [-76, -14], [-81, -6], [-80, -1], [-78, 3]],
    [[-9, 43], [-1, 46], [-4, 48], [2, 51], [5, 54], [8, 55], [10, 58], [6, 62], [14, 68], [24, 71], [40, 68], [60, 70], [80, 73], [100, 77], [120, 73], [140, 72], [160, 70], [180, 68], [180, 65], [170, 60], [162, 58], [156, 51], [142, 52], [140, 46], [130, 42], [127, 38], [126, 35], [122, 40], [121, 32], [119, 25], [110, 21], [108, 17], [106, 10], [100, 13], [100, 4], [104, 1], [98, 8], [95, 16], [92, 22], [88, 22], [80, 15], [77, 8], [73, 17], [69, 22], [62, 25], [57, 26], [56, 24], [52, 25], [48, 29], [50, 26], [55, 17], [43, 12], [35, 28], [32, 31], [35, 36], [27, 37], [26, 40], [23, 38], [22, 37], [19, 41], [16, 41], [18, 40], [12, 44], [8, 44], [3, 43], [-2, 37], [-6, 36], [-9, 37]],
    [[-17, 21], [-13, 28], [-9, 32], [-6, 36], [10, 37], [11, 33], [20, 31], [32, 31], [35, 28], [39, 20], [43, 12], [51, 12], [42, -2], [40, -10], [35, -20], [33, -27], [27, -34], [20, -35], [15, -28], [12, -17], [13, -6], [9, 4], [5, 5], [-3, 5], [-8, 4], [-13, 8], [-17, 14]],
    [[114, -22], [122, -18], [130, -12], [137, -12], [142, -11], [146, -19], [153, -26], [150, -37], [141, -38], [135, -35], [129, -32], [115, -34]],
    [[-55, 60], [-44, 60], [-20, 70], [-20, 80], [-45, 83], [-65, 80], [-70, 76], [-56, 70]], [[-5, 50], [1, 51], [-2, 56], [-5, 58], [-6, 55]], [[130, 31], [135, 34], [140, 36], [142, 40], [141, 45], [139, 41], [135, 36]],
    [[-85, 22], [-78, 23], [-74, 20], [-78, 20]], [[44, -25], [50, -15], [48, -12], [44, -20]], [[95, 4], [105, -6], [100, -3]], [[106, -6], [115, -8], [112, -7]], [[172, -41], [178, -38], [174, -46]],
  ];
  const MOODS = { euforico: 'eufórico', feliz: 'feliz', romantico: 'romántico', sereno: 'sereno', nostalgico: 'nostálgico', melancolico: 'melancólico', triste: 'triste', oscuro: 'oscuro', rabioso: 'rabioso', desafiante: 'desafiante', '': 'sin clasificar' };
  const MOOD_INK = { euforico: 1, feliz: 3, romantico: 2, sereno: 5, nostalgico: 5, melancolico: 0, triste: 4, oscuro: 3, rabioso: 1, desafiante: 0, '': 0 };
  EXP.MOODS = MOODS;

  // ---------- datos ----------
  async function load() {
    const [songs, letras, cri] = await Promise.all([ST.list('historial'), ST.list('letras'), ST.get('criatura', 'estado')]);
    const byKey = {}; for (const s of songs) byKey[s.id] = s;
    // la canción en curso todavía no se guardó (se guarda al terminar o cambiar): se cuenta en vivo
    try { const r = window.RISOSTORE && RISOSTORE.actual; if (r && typeof IN !== 'undefined' && IN.synced && !letras.some(l => l.id === r.key)) { const ls = (IN.lines || []).filter(l => l.text).map(l => [l.t, l.text]); if (ls.length) letras.push({ id: r.key, name: r.name, artist: r.artist, lineas: ls }); } } catch (e) {}
    // ciudades nombradas
    const hits = {}; for (const row of letras) { const seen = new Set(); for (const [, tx] of row.lineas || []) { const t = norm(tx); for (const c of CITIES) if (c.rx.test(t)) { (hits[c.id] = hits[c.id] || { n: 0, songs: new Map() }).n++; seen.add(c.id); hits[c.id].songs.set(row.id, { name: row.name, artist: row.artist, line: tx }); } } }
    const artists = new Set(songs.map(s => s.artist).filter(Boolean));
    return { songs, letras, hits, cri: cri || {}, byKey, artists: artists.size, total: songs.reduce((a, s) => a + (s.veces || 1), 0) };
  }
  EXP.load = load;

  // ---------- Stage auxiliar: se pinta a demanda ----------
  R.register({ id: 'exp', name: 'explorar', inks: 0, phrases: [], make: () => ({}), cam(cam) { cam.x = 0; cam.y = 0; cam.z = 1; cam.r = 0; }, draw(K2) { if (EXP.job) EXP.job.draw(K2, EXP.job); } });
  R.order.splice(R.order.indexOf('exp'), 1);
  function paint(W, H, ink, draw, extra = {}) {
    if (!POS.stage) POS.stage = new R.Stage(); const st = POS.stage; st.auto = false; st.notes = false; st.lyric = true; st.margin = 0;
    st.setDetail(W > 1500 ? 3 : 2, true); const dpr = st.dpr || 1; st.resize(W / dpr, H / dpr); st.setDetail(W > 1500 ? 3 : 2, true); st.resize(W / (st.dpr || 1), H / (st.dpr || 1));
    st.paper = null; st.setInks(ink); EXP.job = { draw, ...extra }; st.setScene('exp', { instant: true }); st.speed = extra.speed || 0; st.frame(1 / 30); st.frame(extra.dt || 1 / 30);
    return st.canvas;
  }

  EXP.paint = paint;
  // ---------- mapa ----------
  const HEAD = { x0: 90, y0: 150, w: 1420, h: 560, lon0: -180, lon1: 180, lat0: 82, lat1: -58 };
  const proj = (lon, lat) => [HEAD.x0 + (lon - HEAD.lon0) / (HEAD.lon1 - HEAD.lon0) * HEAD.w, HEAD.y0 + (lat - HEAD.lat0) / (HEAD.lat1 - HEAD.lat0) * HEAD.h];
  function drawMap(K, job) {
    const d = job.data, sel = job.sel, pts = job.pts = [];
    K.bg(3, .05);
    K.rect(24, 24, 1552, 852, { s: 1, lw: 6 }); K.rect(38, 38, 1524, 824, { s: 1, lw: 2, st: .7 });
    // océano: olas
    for (let i = 0; i < 12; i++) { const y = HEAD.y0 + 20 + i * 44; K.c.save(); K.c.beginPath(); K.c.rect(HEAD.x0, HEAD.y0, HEAD.w, HEAD.h); K.c.clip(); K.c.beginPath(); for (let x = HEAD.x0; x <= HEAD.x0 + HEAD.w; x += 20) K.c[x === HEAD.x0 ? 'moveTo' : 'lineTo'](x, y + sin(x * .03 + i) * 4); K.c.strokeStyle = K.ink(3, .5); K.c.lineWidth = 2; K.c.stroke(); K.c.restore(); }
    K.rect(HEAD.x0, HEAD.y0, HEAD.w, HEAD.h, { s: 1, lw: 5 });
    for (let lon = -150; lon <= 150; lon += 30) { const [x] = proj(lon, 0); K.line(x, HEAD.y0, x, HEAD.y0 + HEAD.h, 3, 1.4, .55); }
    for (let lat = -30; lat <= 60; lat += 30) { const [, y] = proj(0, lat); K.line(HEAD.x0, y, HEAD.x0 + HEAD.w, y, 3, 1.4, .55); }
    for (const poly of LAND) { const p = poly.map(([lo, la]) => proj(lo, la)); K.poly(p, { f: 2, ft: .3 }); K.poly(p.map(q => [q[0] + 5, q[1] + 5]), { f: 1, ft: .16, over: true }); K.poly(p, { f: 2, ft: .34, s: 1, lw: 3.5 }); }
    // ciudades
    const lit = [];
    for (const c of CITIES) { const [x, y] = proj(c.lon, c.lat), h = d.hits[c.id]; pts.push({ id: c.id, x, y, name: c.name, n: h ? h.n : 0 });
      if (!h) { K.circ(x, y, 3.6, { f: 1, ft: .8 }); continue; } lit.push({ c, x, y, h }); }
    for (const { c, x, y, h } of lit) { const r = 9 + Math.min(14, Math.sqrt(h.n) * 3.2), on = sel === c.id;
      K.circ(x, y, r + 7, { f: 3, ft: .55 }); K.circ(x, y, r, { f: 2, ft: .95, s: 1, lw: 3.5 }); K.circ(x, y, 3.5, { f: -1 }); if (on) K.circ(x, y, r + 16, { s: 1, lw: 4 }); }
    // etiquetas de las encendidas (sin chocarse: se acomodan en la primera posición libre)
    const boxes = []; const place = (txt, x, y, r) => { const w = K.measure(txt, { font: 'hand', size: 26, w: 600 }) + 12; for (const [dx, dy, al] of [[r + 6, -r, 'l'], [-r - 6, -r, 'r'], [r + 6, r + 26, 'l'], [-r - 6, r + 26, 'r'], [0, -r - 14, 'c'], [0, r + 32, 'c']]) {
      const bx = al === 'l' ? x + dx : al === 'r' ? x + dx - w : x - w / 2, by = y + dy - 26; if (bx < 44 || bx + w > 1556 || boxes.some(b => bx < b.x + b.w && bx + w > b.x && by < b.y + b.h && by + 32 > b.y)) continue; boxes.push({ x: bx, y: by, w, h: 32 }); return [bx + 6, y + dy]; } return null; };
    for (const { c, x, y, h } of lit.sort((a, b) => b.h.n - a.h.n)) { const r = 9 + Math.min(14, Math.sqrt(h.n) * 3.2), pos = place(c.name, x, y, r); if (pos) K.txt(c.name, pos[0], pos[1], { font: 'hand', size: 26, w: 600, i: sel === c.id ? 2 : 1 }); }
    // rosa de los vientos y cartela
    const rx = 1440, ry = 790; K.circ(rx, ry, 46, { s: 1, lw: 3 }); K.poly([[rx, ry - 66], [rx + 12, ry], [rx, ry + 66], [rx - 12, ry]], { f: 1, ft: .8, s: 1, lw: 3 }); K.poly([[rx - 66, ry], [rx, ry - 12], [rx + 66, ry], [rx, ry + 12]], { f: 2, ft: .8, s: 1, lw: 3 }); K.txt('N', rx, ry - 74, { font: 'display', size: 26, w: 800, align: 'center' });
    K.rect(70, 48, 640, 84, { f: -1, s: 1, lw: 4 }); K.rect(78, 56, 640, 84, { f: 1, ft: .25, over: true });
    K.rect(70, 48, 640, 84, { f: -1, s: 1, lw: 4 }); K.txt('MAPA DE TUS CANCIONES', 90, 100, { font: 'display', size: 44, w: 900, stretch: 'condensed' });
    K.code(`${lit.length} DE ${CITIES.length} CIUDADES NOMBRADAS EN TUS LETRAS`, 92, 122, { size: 14 });
    K.line(HEAD.x0, 760, HEAD.x0 + 300, 760, 1, 4); for (let i = 0; i <= 3; i++) K.line(HEAD.x0 + i * 100, 750, HEAD.x0 + i * 100, 770, 1, 3); K.code('ESCALA ILUSTRADA · NO A ESCALA', HEAD.x0, 800, { size: 13 });
    if (!lit.length) K.postit(560, 770, 470, 92, -.02, ['todavía ninguna letra nombra una ciudad:', 'los pines se encienden solos'], { size: 26, fill: 3, ft: .5, font: 'hand' });
    // barquito
    K.c.save(); K.c.translate(300 + sin(job.t || 0) * 4, 690); K.poly([[-30, 0], [30, 0], [20, 14], [-20, 14]], { f: 1, ft: .9, s: 1, lw: 3 }); K.line(0, 0, 0, -34, 1, 3); K.poly([[2, -34], [26, -6], [2, -6]], { f: -1, s: 1, lw: 3 }); K.c.restore();
  }

  // ---------- atlas ----------
  const ORDER = ['euforico', 'feliz', 'romantico', 'sereno', 'nostalgico', 'melancolico', 'triste', 'oscuro', 'rabioso', 'desafiante', ''];
  function atlasLayout(d) {
    const groups = {}; for (const s of d.songs) { const m = MOODS[s.mood] ? s.mood : ''; (groups[m] = groups[m] || []).push(s); }
    const cells = []; const cols = 4, rows = 3, cw = 1400 / cols, ch = 640 / rows;
    ORDER.forEach((m, i) => { const g = groups[m] || []; if (!g.length && m === '') return; const cx = 100 + (i % cols) * cw + cw / 2, cy = 160 + Math.floor(i / cols) * ch + ch / 2;
      const plays = g.reduce((a, s) => a + (s.veces || 1), 0), r = 34 + Math.min(96, Math.sqrt(plays) * 16 + g.length * 5); cells.push({ m, g, cx, cy, r, plays }); });
    return cells;
  }
  function drawAtlas(K, job) {
    const d = job.data, sel = job.sel, cells = job.cells = atlasLayout(d), pts = job.pts = [];
    K.bg(3, .05); K.rect(24, 24, 1552, 852, { s: 1, lw: 6 }); K.rect(38, 38, 1524, 824, { s: 1, lw: 2, st: .7 });
    for (let i = 0; i < 16; i++) { const y = 170 + i * 42; K.c.save(); K.c.beginPath(); for (let x = 90; x <= 1510; x += 22) K.c[x === 90 ? 'moveTo' : 'lineTo'](x, y + sin(x * .025 + i * 1.3) * 5); K.c.strokeStyle = K.ink(3, .42); K.c.lineWidth = 2; K.c.stroke(); K.c.restore(); }
    for (const cell of cells) {
      const rr = R.rng(hash('isla' + cell.m)), n = 22, pts2 = []; for (let k = 0; k < n; k++) { const a = k / n * TAU, rad = cell.r * (.82 + rr() * .34); pts2.push([cell.cx + cos(a) * rad * 1.25, cell.cy + sin(a) * rad * .85]); }
      const ink = MOOD_INK[cell.m] % 3 + 1, on = sel === cell.m;
      K.poly(pts2.map(q => [q[0] + 7, q[1] + 7]), { f: 1, ft: .22, over: true }); K.poly(pts2, { f: ink === 1 ? 2 : ink, ft: .38 }); K.poly(pts2, { s: 1, lw: on ? 7 : 4 });
      K.txt(MOODS[cell.m].toUpperCase(), cell.cx, cell.cy + cell.r * .85 + 44, { font: 'display', size: 26, w: 800, stretch: 'condensed', align: 'center', i: on ? 2 : 1 }); K.code(`${cell.g.length} CANCIONES · ${cell.plays} ESCUCHAS`, cell.cx, cell.cy + cell.r * .85 + 64, { align: 'center', size: 12 });
      const top = [...cell.g].sort((a, b) => (b.veces || 1) - (a.veces || 1));
      top.slice(0, 26).forEach((s, k) => { const a = k * 2.399 + hash(s.id) % 7, rad = Math.sqrt((k + .5) / Math.min(26, top.length)) * cell.r * .9, x = cell.cx + cos(a) * rad * 1.15, y = cell.cy + sin(a) * rad * .75, z = 8 + Math.min(16, (s.veces || 1) * 2.5);
        K.poly([[x - z, y], [x, y - z * 1.1], [x + z, y]], { f: 2, ft: .95, s: 1, lw: 2.5 }); K.rect(x - z * .7, y, z * 1.4, z * .9, { f: -1, s: 1, lw: 2.5 }); pts.push({ id: s.id, x, y, m: cell.m, name: s.name, artist: s.artist });
        if (k < 3 && s.artist) K.txt((s.artist || '').slice(0, 16), x, y - z * 1.3 - 4, { font: 'hand', size: 22, w: 600, align: 'center' }); });
    }
    K.rect(70, 48, 660, 84, { f: -1, s: 1, lw: 4 }); K.txt('ATLAS DE TU MÚSICA', 90, 100, { font: 'display', size: 44, w: 900, stretch: 'condensed' }); K.code(`${d.songs.length} CANCIONES · ${d.artists} ARTISTAS · ${d.total} ESCUCHAS`, 92, 122, { size: 14 });
    if (!d.songs.length) K.postit(500, 420, 560, 100, -.02, ['todavía no hay canciones en tu historial:', 'cada una que suene será un pueblito'], { size: 28, fill: 3, ft: .5, font: 'hand' });
  }

  // ---------- criatura ----------
  const SYL = ['mo', 'lu', 'pi', 'ko', 'ta', 'ne', 'bu', 'fi', 'zu', 'ra', 'mi', 'do'];
  const autoName = d => { let h = hash((d.songs[0]?.name || 'lumora') + (d.songs[0]?.artist || '')); return (SYL[h % 12] + SYL[(h >>> 4) % 12] + (h % 3 === 0 ? SYL[(h >>> 8) % 12] : '')).replace(/^./, c => c.toUpperCase()); };
  function stats(d) {
    const cnt = (f) => { const c = {}; for (const s of d.songs) { const k = f(s); if (k) c[k] = (c[k] || 0) + (s.veces || 1); } return Object.entries(c).sort((a, b) => b[1] - a[1]); };
    const moods = cnt(s => s.mood), gens = cnt(s => s.genre), last = d.songs.reduce((a, s) => Math.max(a, s.ultima || 0), 0), days = last ? Math.floor((Date.now() - last) / 864e5) : 999;
    const level = Math.min(12, Math.floor(Math.sqrt(d.total))), name = d.cri.nombre || autoName(d);
    const desde = level * level, hasta = (level + 1) * (level + 1), falta = level >= 12 ? 0 : hasta - d.total, avance = level >= 12 ? 1 : (d.total - desde) / (hasta - desde);
    return { moods, gens, artists: d.artists, songs: d.songs.length, total: d.total, level, falta, avance, topArtistas: cnt(s => s.artist).slice(0, 3), topCanciones: [...d.songs].sort((a, b) => (b.veces || 1) - (a.veces || 1)).slice(0, 3), name, days, top: moods[0]?.[0] || '', genre: gens[0]?.[0] || '', state: !d.total ? 'huevo' : days > 10 ? 'dormido' : days > 3 ? 'hambriento' : 'contento' };
  }
  EXP.stats = stats;
  // qué significa el estado de la criatura y qué hacer para cambiarlo
  const consejo = st => st.state === 'huevo' ? 'ponle música: nace con tu primera canción.'
    : st.state === 'dormido' ? `lleva ${st.days} días sin música y se quedó dormida. pon cualquier canción y despierta.`
    : st.state === 'hambriento' ? `hace ${st.days} días que no escuchas nada: tiene hambre. con una canción hoy se pone contenta.`
    : 'está contenta: escuchaste música en los últimos 3 días.';
  EXP.consejo = consejo;
  function drawCreature(K, job) {
    const s = job.st, t = job.t || 0, rr = R.rng(hash(s.name + s.genre)), cx = 800, base = 640, L = s.level;
    K.bg(3, .07); K.circ(cx, 470, 400, { f: -1 }); K.circ(cx, 470, 400, { s: 1, lw: 5 });
    K.rect(-3200, base, 8000, 400, { f: 3, ft: .28 }); K.line(-3200, base, 8000, base, 1, 5);
    const h = new Date().getHours(); if (h >= 7 && h < 19) K.circ(1130, 230, 46, { f: 2, ft: .95, s: 1, lw: 4 }); else { K.circ(1130, 230, 40, { f: -1, s: 1, lw: 4 }); K.circ(1148, 220, 34, { f: 3, ft: .5 }); }
    if (s.state === 'huevo') { const y = base - 110 + sin(t * 2) * 3; K.c.save(); K.c.translate(cx, y); K.c.rotate(sin(t * 3) * .05); K.c.beginPath(); K.c.ellipse(0, 0, 110, 140, 0, 0, TAU); K.paint({ f: -1, s: 1, lw: 7 }); K.poly([[-70, -40], [-40, -70], [-10, -35], [20, -70], [50, -40], [90, -10]], { s: 1, lw: 5 }, false); for (let i = 0; i < 6; i++) K.circ(-60 + i * 25, 30 + sin(i) * 40, 10, { f: 2, ft: .85 }); K.c.restore(); K.txt('un huevo esperando música', cx, base + 90, { font: 'hand', size: 44, w: 600, align: 'center' }); return; }
    const size = 1 + L * .05, bob = s.state === 'dormido' ? sin(t * 1.2) * 4 : sin(t * 3.4) * (s.state === 'hambriento' ? 3 : 10), sq = 1 - bob * .004, W2 = 170 * size * (1 + bob * .004), H2 = 150 * size * sq, by = base - H2 + 6 - Math.max(0, bob) * .6, fill = MOOD_INK[s.top] % 3 + 1, hairy = rr();
    // cola
    K.c.save(); K.c.translate(cx + W2 * .85, by + H2 * .55); K.c.rotate(sin(t * 5) * .3 * (s.state === 'contento' ? 1 : .2)); K.poly([[0, 0], [70 * size, -40 * size], [90 * size, -10 * size], [10, 24]], { f: fill === 1 ? 2 : fill, ft: .8, s: 1, lw: 6 }); K.c.restore();
    // orejas según el género
    const ear = hash(s.genre || 'x') % 4, ex = W2 * .62;
    for (const sgn of [-1, 1]) { K.c.save(); K.c.translate(cx + sgn * ex, by + H2 * .12); K.c.rotate(sgn * (.35 + sin(t * 2 + sgn) * .05));
      if (ear === 0) K.poly([[-26, 0], [0, -110 * size], [26, 0]], { f: fill, ft: .9, s: 1, lw: 6 }); else if (ear === 1) K.circ(0, -34 * size, 40 * size, { f: fill, ft: .9, s: 1, lw: 6 }); else if (ear === 2) K.rect(-16, -130 * size, 32, 130 * size, { f: fill, ft: .9, s: 1, lw: 6 }); else { K.circ(0, -16, 26 * size, { f: -1, s: 1, lw: 6 }); K.circ(0, -16, 12 * size, { f: fill, ft: .9 }); } K.c.restore(); }
    // antenas desde el nivel 3, corona al 10
    if (L >= 3) for (const sgn of [-1, 1]) { const ax = cx + sgn * 44, ay = by - 6; K.line(ax, ay, ax + sgn * 24 + sin(t * 2 + sgn) * 6, ay - 70 * size, 1, 5); K.poly(starPts(ax + sgn * 24 + sin(t * 2 + sgn) * 6, ay - 80 * size, 16, 5), { f: 2, ft: .95, s: 1, lw: 3 }); }
    if (L >= 10) K.poly([[cx - 60, by + 4], [cx - 44, by - 44], [cx - 20, by - 14], [cx, by - 56], [cx + 20, by - 14], [cx + 44, by - 44], [cx + 60, by + 4]], { f: 2, ft: .95, s: 1, lw: 5 });
    // cuerpo
    K.c.beginPath(); K.c.ellipse(cx, by + H2 * .55, W2, H2, 0, 0, TAU); K.paint({ f: fill === 1 ? 2 : fill, ft: .82, s: 1, lw: 8 });
    K.c.beginPath(); K.c.ellipse(cx, by + H2 * .78, W2 * .62, H2 * .5, 0, 0, TAU); K.paint({ f: -1, s: 1, lw: 4 });
    // manchas: una por artista distinto (hasta 10)
    for (let i = 0; i < Math.min(10, s.artists); i++) { const a = rr() * TAU, r = .35 + rr() * .5; K.circ(cx + cos(a) * W2 * r, by + H2 * .45 + sin(a) * H2 * r * .7, 9 + rr() * 12, { f: 1, ft: .7 }); }
    // cara
    const ey = by + H2 * .32, nEyes = clamp(1 + Math.min(2, s.moods.length >= 5 ? 2 : s.moods.length >= 3 ? 1 : 0), 1, 3), blink = (t % 4) < .12 || s.state === 'dormido';
    for (let i = 0; i < nEyes; i++) { const ox = (i - (nEyes - 1) / 2) * 62 * size; if (blink) K.line(cx + ox - 16, ey, cx + ox + 16, ey, 1, 6); else { K.circ(cx + ox, ey, 22 * size, { f: -1, s: 1, lw: 5 }); K.circ(cx + ox + sin(t) * 5, ey + 2, 10 * size, { f: 1 }); } }
    const my = ey + 58 * size, sad = s.state === 'hambriento', open = s.state === 'contento' && Math.sin(t * 3.4) > .6;
    if (s.state === 'dormido') { K.txt('z', cx + 130, by - 10 - (t * 20) % 40, { font: 'hand', size: 50, w: 600, i: 2 }); K.txt('Z', cx + 170, by - 50 - (t * 20) % 40, { font: 'hand', size: 34, w: 600, i: 2 }); }
    K.c.beginPath(); K.c.moveTo(cx - 34 * size, my); K.c.quadraticCurveTo(cx, my + (sad ? -26 : 34) * size, cx + 34 * size, my); if (open) { K.paint({ f: 1, ft: .9, s: 1, lw: 5 }); } else K.paint({ s: 1, lw: 6 });
    K.circ(cx - 96 * size, my - 8, 15, { f: 2, ft: .85 }); K.circ(cx + 96 * size, my - 8, 15, { f: 2, ft: .85 });
    // patas
    for (const sgn of [-1, 1]) { K.c.beginPath(); K.c.ellipse(cx + sgn * W2 * .5, base - 8, 44 * size, 20, 0, 0, TAU); K.paint({ f: fill === 1 ? 2 : fill, ft: .9, s: 1, lw: 6 }); }
    if (job.petting > 0) for (let i = 0; i < 4; i++) K.poly(heartPts(cx - 120 + i * 80 + sin(t * 4 + i) * 10, by - 40 - job.petting * 90 - i * 24, 3.2), { f: 2, ft: .9, s: 1, lw: 3 });
    K.txt(s.name, cx, 790, { font: 'display', size: 56, w: 900, stretch: 'condensed', align: 'center' }); K.code(`NIVEL ${L} · ${s.state.toUpperCase()}`, cx, 822, { align: 'center', size: 15 });
  }
  const starPts = (x, y, r, n) => Array.from({ length: n * 2 }, (_, i) => { const a = -Math.PI / 2 + i * Math.PI / n, q = i % 2 ? r * .45 : r; return [x + cos(a) * q, y + sin(a) * q]; });
  const heartPts = (cx, cy, s) => Array.from({ length: 33 }, (_, i) => { const a = i / 32 * TAU; return [cx + 16 * sin(a) ** 3 * s, cy - (13 * cos(a) - 5 * cos(2 * a) - 2 * cos(3 * a) - cos(4 * a)) * s]; });

  // ---------- ventana a pantalla completa ----------
  const css = document.createElement('style'); css.textContent = `
    #expWin { position:fixed; inset:0; z-index:31; display:none; background:var(--rkp,#f4ead4); color:var(--rk1,#212b80); font-family:'Anybody',sans-serif; } #expWin.on { display:grid; grid-template-rows:auto 1fr auto; }
    #expWin::before { content:''; position:absolute; inset:0; pointer-events:none; opacity:.14; background-image:radial-gradient(#6b8fb3 1.3px, transparent 1.7px); background-size:9px 9px; }
    #expWin .ex-bar { position:relative; display:flex; gap:10px; align-items:center; padding:12px 16px; border-bottom:4px solid var(--rk1,#212b80); background:var(--rkp,#f4ead4); z-index:3; flex-wrap:wrap; } #expWin .ex-tabs { display:flex; gap:8px; flex-wrap:wrap; } #expWin .sp { flex:1; }
    #expWin button { padding:8px 14px; border:3px solid var(--rk1,#212b80); background:var(--rkl,#faf3e4); color:var(--rk1,#212b80); box-shadow:3px 3px 0 -1px var(--rk1,#212b80); font:700 13px 'Anybody',sans-serif; font-stretch:80%; text-transform:uppercase; letter-spacing:.05em; cursor:pointer; }
    #expWin button:hover { background:var(--rk2,#f97a2a); } #expWin button.on { background:var(--rk1,#212b80); color:var(--rkl,#faf3e4); } #expWin button:active { transform:translate(2px,2px); box-shadow:1px 1px 0 -1px var(--rk1,#212b80); }
    #expWin #exQ { width:min(260px,36vw); padding:8px 11px; border:3px solid var(--rk1,#212b80); background:#fffdf6; color:var(--rk1,#212b80); font:600 18px 'Caveat',cursive; outline:none; } #expWin #exQ:focus { border-color:var(--rk2,#f97a2a); background:#fff; }
    #expWin .ex-main { position:relative; overflow:hidden; min-height:0; touch-action:none; } #expWin .ex-stage { position:absolute; left:0; top:0; transform-origin:0 0; will-change:transform; border:3px solid var(--rk1,#212b80); background:#f4ead4; box-shadow:8px 8px 0 -1px var(--rk1,#212b80); cursor:grab; }
    #expWin .ex-stage.drag { cursor:grabbing; } #expWin .ex-stage.pin { cursor:pointer; } #expWin .ex-stage canvas { position:static !important; inset:auto !important; display:block; width:100%; height:100%; }
    #expWin[data-mode=criatura] .ex-stage { cursor:pointer; } #expWin[data-mode=coleccion] .ex-stage, #expWin[data-mode=coleccion] .ex-zoom, #expWin[data-mode=coleccion] .ex-side { display:none; } #expWin[data-mode=criatura] .ex-zoom { display:none; }
    #expWin .ex-zoom { position:absolute; left:16px; bottom:16px; display:flex; gap:8px; z-index:2; } #expWin .ex-zoom button { padding:8px 13px; font-size:16px; }
    #expWin .ex-tip { position:absolute; z-index:4; pointer-events:none; padding:6px 10px; border:3px solid var(--rk1,#212b80); background:var(--rkl,#faf3e4); box-shadow:4px 4px 0 -1px var(--rk1,#212b80); font:600 12px 'Martian Mono',monospace; letter-spacing:.04em; opacity:0; transition:opacity .12s; max-width:280px; }
    #expWin .ex-tip.on { opacity:1; } #expWin .ex-tip b { display:block; font:800 18px/1.05 'Anybody',sans-serif; font-stretch:75%; text-transform:uppercase; }
    #expWin .ex-side { position:absolute; right:14px; top:14px; bottom:14px; width:min(330px,82vw); padding:14px; overflow:auto; background:var(--rkp,#f4ead4); border:4px solid var(--rk1,#212b80); box-shadow:8px 8px 0 -1px var(--rk1,#212b80); z-index:2; transition:transform .25s; font:500 12px 'Martian Mono',monospace; text-transform:uppercase; letter-spacing:.05em; }
    #expWin .ex-prog { height:12px; margin:2px 0 6px; border:3px solid var(--rk1,#212b80); background:var(--rkl,#faf3e4); } #expWin .ex-prog i { display:block; height:100%; background:var(--rk2,#f97a2a); transition:width .4s; }
    #expWin .ex-side h4 { margin:10px 0 2px; font:800 15px 'Anybody',sans-serif; font-stretch:80%; text-transform:uppercase; } #expWin .ex-top { margin:0 0 4px; padding-left:20px; font:500 13px 'Martian Mono',monospace; } #expWin .ex-side .ex-top li { margin:0; padding:1px 0; border:0; background:none; box-shadow:none; cursor:default; } #expWin .ex-top span { opacity:.6; }
    #expWin .ex-side.off { transform:translateX(calc(100% + 40px)); } #expWin .ex-side h3 { margin:0 0 8px; font:800 26px/1 'Anybody',sans-serif; font-stretch:70%; } #expWin .ex-side p { text-transform:none; letter-spacing:0; font-size:12px; line-height:1.4; margin:0 0 8px; } #expWin .ex-side ul { margin:0; padding:0; }
    #expWin .ex-side li { list-style:none; margin:0 0 7px; padding:6px 8px; border:2px solid var(--rk1,#212b80); background:var(--rkl,#faf3e4); cursor:pointer; text-transform:none; letter-spacing:0; font-size:12px; } #expWin .ex-side li:hover, #expWin .ex-side li.on { background:var(--rk2,#f97a2a); color:#fff; } #expWin .ex-side li b { text-transform:uppercase; letter-spacing:.04em; }
    #expWin .ex-side input { width:100%; padding:8px; border:3px solid var(--rk1,#212b80); background:#fff; color:var(--rk1,#212b80); font:600 20px 'Caveat',cursive; margin-bottom:10px; }
    #expWin .ex-col { position:absolute; inset:0; overflow:auto; padding:20px 24px 30px; display:none; } #expWin[data-mode=coleccion] .ex-col { display:block; }
    #expWin .ex-col h3 { margin:0 0 4px; font:800 34px/1 'Anybody',sans-serif; font-stretch:70%; text-transform:uppercase; } #expWin .ex-col .sub { font:500 12px 'Martian Mono',monospace; letter-spacing:.08em; text-transform:uppercase; opacity:.8; margin-bottom:14px; }
    #expWin .ex-col .orden { display:flex; gap:8px; margin:0 0 18px; align-items:center; font:500 11px 'Martian Mono',monospace; letter-spacing:.1em; text-transform:uppercase; } #expWin .ex-col h4 { margin:18px 0 10px; font:500 11px 'Martian Mono',monospace; letter-spacing:.18em; text-transform:uppercase; opacity:.75; }
    #expWin .pgrid { display:grid; grid-template-columns:repeat(auto-fill,minmax(190px,1fr)); gap:18px; } #expWin .pc { border:3px solid var(--rk1,#212b80); background:var(--rkl,#faf3e4); box-shadow:5px 5px 0 -1px var(--rk1,#212b80); display:flex; flex-direction:column; transition:transform .15s; } #expWin .pc:hover { transform:translateY(-4px) rotate(-.4deg); }
    #expWin .pc img, #expWin .pc i { display:block; width:100%; aspect-ratio:1/1.41; object-fit:cover; object-position:top; border-bottom:3px solid var(--rk1,#212b80); background:repeating-linear-gradient(45deg,#dfe4ee,#dfe4ee 6px,#f4ead4 6px,#f4ead4 12px); cursor:pointer; }
    #expWin .pc b { padding:8px 10px 0; font:800 17px/1.05 'Anybody',sans-serif; font-stretch:75%; text-transform:uppercase; } #expWin .pc span { padding:2px 10px 8px; font:500 11px 'Martian Mono',monospace; letter-spacing:.05em; text-transform:uppercase; opacity:.85; }
    #expWin .pc div { display:flex; gap:6px; padding:0 10px 10px; flex-wrap:wrap; } #expWin .pc button { padding:5px 9px; font-size:11px; box-shadow:none; } #expWin .pc.pend { border-style:dashed; } #expWin .vacio { font:600 24px 'Caveat',cursive; padding:30px 0; }
    #expWin .ex-hint { position:relative; z-index:3; padding:8px 16px; border-top:4px solid var(--rk1,#212b80); background:var(--rkp,#f4ead4); font:500 11px 'Martian Mono',monospace; letter-spacing:.08em; text-transform:uppercase; opacity:.9; } #expWin kbd { padding:1px 6px; border:2px solid var(--rk1,#212b80); background:var(--rkl,#faf3e4); font:inherit; }`;
  document.head.appendChild(css);
  const win = document.createElement('div'); win.id = 'expWin'; win.setAttribute('role', 'dialog'); win.setAttribute('aria-label', 'explorar'); document.body.appendChild(win);
  win.innerHTML = `<div class="ex-bar"><div class="ex-tabs"><button data-t="mapa">mapa</button><button data-t="atlas">atlas</button><button data-t="criatura">criatura</button><button data-t="coleccion">colección</button></div>
    <input id="exQ" type="search" placeholder="buscar ( / )" aria-label="buscar" spellcheck="false" autocomplete="off"><span class="sp"></span><button data-a="side" title="mostrar u ocultar el panel (p)">panel</button><button data-a="x">cerrar · esc</button></div>
    <div class="ex-main" id="exMain"><div class="ex-stage" id="exStage"></div><div class="ex-col" id="exCol"></div><div class="ex-zoom"><button data-a="zin" aria-label="acercar">+</button><button data-a="zout" aria-label="alejar">−</button><button data-a="zfit">ajustar</button></div>
      <div class="ex-tip" id="exTip"></div><aside class="ex-side" id="exSide"></aside></div><div class="ex-hint" id="exHint"></div>`;
  const $ = id => document.getElementById(id), TABS = ['mapa', 'atlas', 'criatura', 'coleccion'];
  const V = { k: 1, tx: 0, ty: 0, sw: 0, sh: 0 }; let aspect = 16 / 9, drag = null, anim = 0;
  const HINTS = { mapa: '<kbd>rueda</kbd> acercar · <kbd>arrastrar</kbd> moverte · <kbd>doble clic</kbd> zoom · <kbd>/</kbd> buscar · <kbd>←</kbd><kbd>→</kbd> pestañas · <kbd>p</kbd> panel · <kbd>esc</kbd> cerrar',
    atlas: '<kbd>rueda</kbd> acercar · <kbd>arrastrar</kbd> moverte · pasa el cursor sobre un pueblito · <kbd>/</kbd> buscar · <kbd>←</kbd><kbd>→</kbd> pestañas · <kbd>esc</kbd> cerrar', criatura: 'toca a tu criatura para acariciarla · <kbd>←</kbd><kbd>→</kbd> pestañas · <kbd>esc</kbd> cerrar',
    coleccion: 'toca una lámina para abrirla y personalizarla · <kbd>/</kbd> buscar · <kbd>←</kbd><kbd>→</kbd> pestañas · <kbd>esc</kbd> cerrar' };
  // ancho libre: con el panel abierto el lienzo se centra en el espacio que queda a su izquierda
  const avail = () => { const sd = $('exSide'), m = $('exMain'); return m.clientWidth - (sd.classList.contains('off') || win.dataset.mode === 'coleccion' ? 0 : sd.offsetWidth + 26); };
  const togglePanel = () => { $('exSide').classList.toggle('off'); place(); };
  // el lienzo se centra y el arrastre no deja que se salga de la vista
  function place() {
    const main = $('exMain'), mw = avail(), mh = main.clientHeight, pad = 28; V.sw = Math.max(200, Math.min(mw - pad * 2, (mh - pad * 2) * aspect)); V.sh = V.sw / aspect;
    const cl = (t, m, sz) => sz * V.k <= m ? (m - sz * V.k) / 2 : Math.min(pad, Math.max(m - sz * V.k - pad, t));
    V.tx = cl(V.tx, mw, V.sw); V.ty = cl(V.ty, mh, V.sh);
    const st = $('exStage'); st.style.width = V.sw + 'px'; st.style.height = V.sh + 'px'; st.style.transform = `translate(${V.tx}px,${V.ty}px) scale(${V.k})`;
  }
  function zoomAt(cx, cy, f) { cancelAnimationFrame(anim); const k2 = clamp(V.k * f, 1, 6), r = k2 / V.k; V.tx = cx - (cx - V.tx) * r; V.ty = cy - (cy - V.ty) * r; V.k = k2; place(); }
  function fly(vx, vy, k = 2.6) {                                                        // anima el encuadre hacia un punto del lienzo (coordenadas 1600x900)
    cancelAnimationFrame(anim); const main = $('exMain'), mw = avail(), mh = main.clientHeight, lx = V.sw / 2 + (vx - 800) * (V.sh / 900), ly = vy * (V.sh / 900);
    const a = { k: V.k, tx: V.tx, ty: V.ty }, t = { k, tx: mw / 2 - lx * k, ty: mh / 2 - ly * k }, t0 = performance.now();
    const step = now => { const u = Math.min(1, (now - t0) / 420), e = 1 - Math.pow(1 - u, 3); V.k = a.k + (t.k - a.k) * e; V.tx = a.tx + (t.tx - a.tx) * e; V.ty = a.ty + (t.ty - a.ty) * e; place(); if (u < 1) anim = requestAnimationFrame(step); }; anim = requestAnimationFrame(step);
  }
  const putCanvas = c => { const st = $('exStage'); let out = st.querySelector('canvas'); if (!out) { out = document.createElement('canvas'); st.append(out); } out.width = c.width; out.height = c.height; out.getContext('2d').drawImage(c, 0, 0); return out; };
  const toV = (e, out) => { const r = out.getBoundingClientRect(), px = (e.clientX - r.left) / r.width * out.width, py = (e.clientY - r.top) / r.height * out.height, sK = out.height / 900; return [(px - out.width / 2) / sK + 800, py / sK]; };
  const nearest = (e, maxPx = 18) => {                                                   // el pin más cercano al cursor, medido en píxeles de pantalla
    const out = $('exStage').querySelector('canvas'); if (!out || !EXP.pts) return null; const [vx, vy] = toV(e, out), u = out.getBoundingClientRect().height / 900; let best = null, bd = maxPx / u;
    for (const p of EXP.pts) { const dd = Math.hypot(p.x - vx, p.y - vy); if (dd < bd) { bd = dd; best = p; } } return best;
  };

  // ---------- datos de cada pestaña ----------
  const fecha = t => { const d = new Date(t || 0); return d.getFullYear() + '.' + String(d.getMonth() + 1).padStart(2, '0') + '.' + String(d.getDate()).padStart(2, '0'); };
  const songOf = id => (EXP.data?.songs || []).find(s => s.id === id);
  function sideHTML() {
    const d = EXP.data, q = norm(EXP.q || ''), tab = EXP.tab; if (!d) return '';
    if (tab === 'mapa') {
      const lit = CITIES.filter(c => d.hits[c.id]), list = (q ? CITIES.filter(c => norm(c.name).includes(q)) : lit).sort((a, b) => (d.hits[b.id]?.n || 0) - (d.hits[a.id]?.n || 0)), sel = EXP.sel && CITIES.find(c => c.id === EXP.sel);
      return `<h3>ciudades</h3><p>${lit.length} de ${CITIES.length} nombradas en las letras que guardaste. rueda para acercar, arrastra para moverte, toca un pin.</p><ul>${list.map(c => `<li data-c="${c.id}" class="${EXP.sel === c.id ? 'on' : ''}"><b>${esc(c.name)}</b> · ${d.hits[c.id] ? d.hits[c.id].n + (d.hits[c.id].n === 1 ? ' verso' : ' versos') : 'sin versos aún'}</li>`).join('') || '<li>ninguna coincide</li>'}</ul>` +
        (sel ? `<h3 style="margin-top:14px">${esc(sel.name)}</h3>` + (d.hits[sel.id] ? `<ul>${[...d.hits[sel.id].songs.values()].map(x => `<li><b>${esc(x.name)}</b><br>${esc(x.artist)}<br><i>«${esc(x.line)}»</i></li>`).join('')}</ul>` : '<p>todavía ninguna letra la nombra.</p>') : '');
    }
    if (tab === 'atlas') {
      const cells = EXP.job?.cells || [], sel = cells.find(c => c.m === EXP.sel), songs = q ? d.songs.filter(s => norm(s.name + ' ' + s.artist).includes(q)).slice(0, 40) : [];
      return `<h3>islas</h3><p>una isla por ánimo; cada pueblito es una canción, más grande cuanto más la escuchas. rueda para acercar.</p>` + (q ? `<ul>${songs.map(s => `<li data-s="${esc(s.id)}"><b>${esc(s.name)}</b><br>${esc(s.artist)} · ${s.veces || 1}×</li>`).join('') || '<li>ninguna coincide</li>'}</ul>` :
        `<ul>${cells.map(c => `<li data-m="${esc(c.m)}" class="${EXP.sel === c.m ? 'on' : ''}"><b>${MOODS[c.m]}</b> · ${c.g.length} canciones · ${c.plays} escuchas</li>`).join('')}</ul>`) +
        (sel ? `<h3 style="margin-top:14px">${MOODS[sel.m]}</h3><ul>${[...sel.g].sort((a, b) => (b.veces || 1) - (a.veces || 1)).map(s => `<li data-s="${esc(s.id)}"><b>${esc(s.name)}</b><br>${esc(s.artist)} · ${s.veces || 1}×</li>`).join('')}</ul>` : '');
    }
    if (tab === 'criatura' && EXP.st) { const st = EXP.st, dias = st.days > 900 ? 'nunca' : st.days === 0 ? 'hoy' : st.days === 1 ? 'ayer' : 'hace ' + st.days + ' días';
      return `<h3>tu criatura</h3><input id="exName" maxlength="14" value="${esc(st.name)}" aria-label="nombre de la criatura" spellcheck="false"><p>nivel <b>${st.level}</b> de 12 · ${st.state}</p>${st.level >= 12 ? '<p>nivel máximo alcanzado</p>' : `<div class="ex-prog" role="progressbar" aria-valuemin="0" aria-valuemax="100" aria-valuenow="${Math.round(st.avance * 100)}"><i style="width:${Math.round(st.avance * 100)}%"></i></div><p>faltan <b>${st.falta}</b> ${st.falta === 1 ? 'escucha' : 'escuchas'} para el nivel ${st.level + 1}</p>`}<p>${st.total} escuchas · ${st.songs} canciones · ${st.artists} artistas</p><p>ánimo dominante: ${esc(MOODS[st.top] || '—')}<br>género dominante: ${esc(st.genre || '—')}<br>última música: ${dias}</p>
        ${st.topArtistas.length ? `<h4>tus artistas</h4><ol class="ex-top">${st.topArtistas.map(([a, n]) => `<li>${esc(a)} <span>${n}×</span></li>`).join('')}</ol><h4>tus canciones</h4><ol class="ex-top">${st.topCanciones.map(c => `<li>${esc(c.name)} <span>${c.veces || 1}×</span></li>`).join('')}</ol>` : ''}
        <p class="ex-consejo"><b>${esc(consejo(st))}</b></p>
        <p>crece con lo que escuchas: más nivel, más grande; antenas al 3, corona al 10. sus manchas son tus artistas, sus orejas tu género, sus colores tu ánimo.</p><button data-a="pet">acariciar</button> <button data-a="guardar">guardar imagen</button>`; }
    return '';
  }
  const renderSide = () => { const sd = $('exSide'); if (sd && EXP.tab !== 'coleccion') { const keep = sd.scrollTop; sd.innerHTML = sideHTML(); sd.scrollTop = keep; } };
  async function collectionView() {
    const rows = EXP.rows = await (window.RISOSHARE ? RISOSHARE.list() : []), pend = (POS.ready || []).filter(x => !x._saved), q = norm(EXP.q || ''), sort = EXP.sort || 'recientes';
    const list = rows.filter(r => !q || norm((r.name || '') + ' ' + (r.artist || '')).includes(q)).sort(sort === 'nombre' ? (a, b) => String(a.name).localeCompare(b.name) : sort === 'artista' ? (a, b) => String(a.artist).localeCompare(b.artist) : (a, b) => (b.fin || 0) - (a.fin || 0));
    const img = r => { const f = (r.frames || []).find(Boolean); return r.thumb || (f && f.url) || ''; };
    $('exCol').innerHTML = `<h3>colección de pósters</h3><div class="sub">${rows.length} guardados en este navegador · caben hasta ${ST.caps.posters}, lo más viejo se borra primero</div>
      <div class="orden">ordenar:${[['recientes', 'recientes'], ['nombre', 'canción'], ['artista', 'artista']].map(([v, t]) => ` <button data-sort="${v}" class="${sort === v ? 'on' : ''}">${t}</button>`).join('')}</div>
      ${pend.length ? `<h4>sin guardar · de esta sesión (${pend.length})</h4><div class="pgrid">${pend.map(x => `<div class="pc pend" data-pid="${esc(x.id)}">${(x.frames || []).find(Boolean) ? `<img alt="" data-a="pedit" src="${(x.frames || []).find(Boolean).url}">` : '<i data-a="pedit"></i>'}<b>${esc(x.name)}</b><span>${esc(x.artist)} · sin guardar</span><div><button data-a="pedit">personalizar</button><button data-a="psave">guardar</button><button data-a="pdrop">descartar</button></div></div>`).join('')}</div><h4>guardados</h4>` : ''}
      ${list.length ? `<div class="pgrid">${list.map(r => `<div class="pc" data-id="${esc(r.id)}">${img(r) ? `<img alt="" data-a="cedit" src="${img(r)}">` : '<i data-a="cedit"></i>'}<b>${esc((r.opts && r.opts.title) || r.name)}</b><span>${esc((r.opts && r.opts.artist) || r.artist)} · ${fecha(r.fin)}${r.dedic ? ' · con dedicatoria' : ''}</span><div><button data-a="cedit">abrir</button><button data-a="cdel">borrar</button></div></div>`).join('')}</div>` :
        `<div class="vacio">${rows.length ? 'ninguna lámina coincide con la búsqueda.' : 'todavía no guardaste ningún póster. al terminar una canción te avisaré y tú eliges si lo guardas.'}</div>`}`;
    // láminas guardadas con la versión anterior no traen miniatura propia: se imprimen ahora, una a una, y quedan guardadas
    for (const r of list.filter(x => !x.thumb).slice(0, 24)) (async () => { try {
      const it = await RISOSHARE.hydrate(r); if (!it.opts) it.opts = { ...POS.DEF, layout: 'clasico', inks: 0 }; const url = await POS.thumb(it); r.thumb = url; r.opts = it.opts; await ST.set('posters', r.id, r);
      const card = $('exCol').querySelector(`.pc[data-id="${CSS.escape(r.id)}"]`), old = card && card.querySelector('img, i'); if (old) { const im = document.createElement('img'); im.alt = ''; im.dataset.a = 'cedit'; im.src = url; old.replaceWith(im); } } catch (e) {} })();
  }

  // ---------- abrir una pestaña ----------
  async function open(tab, keep) {
    if (EXP.busy) return; EXP.busy = true;
    try {
      tab = TABS.includes(tab) ? tab : 'mapa'; const cambio = tab !== EXP.tab || !win.classList.contains('on'); EXP.tab = tab;
      if (cambio) { EXP.sel = null; V.k = 1; V.tx = V.ty = 0; EXP.q = ''; $('exQ').value = ''; }
      cancelAnimationFrame(anim); clearTimeout(EXP.timer); win.classList.add('on'); win.dataset.mode = tab; aspect = tab === 'criatura' ? 1 : 16 / 9;
      for (const b of win.querySelectorAll('[data-t]')) b.classList.toggle('on', b.dataset.t === tab); $('exHint').innerHTML = HINTS[tab]; $('exTip').classList.remove('on');
      const d = EXP.data = await load(); EXP.pts = null; if (!keep) $('exSide').classList.remove('off'); renderSide();
      if (tab === 'mapa') { putCanvas(paint(2400, 1350, 0, drawMap, { data: d, sel: EXP.sel, t: 0 })); EXP.pts = EXP.job.pts; }
      else if (tab === 'atlas') { putCanvas(paint(2400, 1350, 2, drawAtlas, { data: d, sel: EXP.sel })); EXP.pts = EXP.job.pts; }
      else if (tab === 'criatura') { const st = EXP.st = stats(d); EXP.pet = 0; const tick = () => { if (EXP.tab !== 'criatura' || !win.classList.contains('on')) return; EXP.t = (EXP.t || 0) + .16; EXP.pet = Math.max(0, EXP.pet - .05);
        putCanvas(paint(720, 720, MOOD_INK[st.top] || 0, drawCreature, { st: EXP.st, t: EXP.t, petting: EXP.pet })); EXP.timer = setTimeout(tick, 140); }; tick(); }
      else await collectionView();
      place(); renderSide();
    } finally { EXP.busy = false; }
  }
  // elegir un pin o una isla (desde el lienzo o desde la lista) y volver a pintar sin perder el encuadre
  async function choose(sel, fx, fy) { EXP.sel = sel; await open(EXP.tab, true); if (fx != null) fly(fx, fy); }

  // ---------- interacción ----------
  win.addEventListener('click', async e => {
    const b = e.target.closest('button'), li = e.target.closest('li'), a = b?.dataset.a || e.target.dataset?.a, card = e.target.closest('.pc');
    if (e.target === win) return EXP.close();
    if (b?.dataset.t) return open(b.dataset.t);
    if (a === 'x') return EXP.close();
    if (a === 'side') return togglePanel();
    if (a === 'zin') return zoomAt(avail() / 2, $('exMain').clientHeight / 2, 1.5);
    if (a === 'zout') return zoomAt(avail() / 2, $('exMain').clientHeight / 2, 1 / 1.5);
    if (a === 'zfit') { cancelAnimationFrame(anim); V.k = 1; V.tx = V.ty = 0; return place(); }
    if (a === 'pet') { EXP.pet = 1; return; }
    if (a === 'guardar') {                                  // la criatura como imagen PNG
      const cv = $('exStage').querySelector('canvas'); if (!cv) return;
      cv.toBlob(b => { if (!b) return; const u = URL.createObjectURL(b), l = document.createElement('a'); l.href = u; l.download = 'criatura-' + (EXP.st ? EXP.st.name : 'lumora').toLowerCase() + '.png'; document.body.append(l); l.click(); l.remove(); setTimeout(() => URL.revokeObjectURL(u), 4000); }, 'image/png');
      return;
    }
    if (b?.dataset.sort) { EXP.sort = b.dataset.sort; return collectionView(); }
    if (card && a && EXP.tab === 'coleccion') {
      const id = card.dataset.id, pid = card.dataset.pid;
      if (a === 'cedit') { const row = EXP.rows.find(r => r.id === id); if (row) POS.openWin(await RISOSHARE.hydrate(row)); return; }
      if (a === 'cdel') { if (b.dataset.armed !== '1') { b.dataset.armed = '1'; b.textContent = '¿seguro?'; setTimeout(() => { b.dataset.armed = ''; b.textContent = 'borrar'; }, 3000); return; } await ST.del('posters', id); return collectionView(); }
      const it = (POS.ready || []).find(x => x.id === pid); if (!it) return collectionView();
      if (a === 'pedit') return POS.openWin(it);
      if (a === 'psave') { b.textContent = 'guardando…'; await RISOSHARE.save(it); POS.ready = POS.ready.filter(x => x !== it); return collectionView(); }
      if (a === 'pdrop') { POS.ready = POS.ready.filter(x => x !== it); return collectionView(); }
    }
    if (li?.dataset.c) { const c = CITIES.find(x => x.id === li.dataset.c), [px, py] = proj(c.lon, c.lat); return choose(c.id, px, py); }
    if (li?.dataset.m !== undefined) { const cell = EXP.job?.cells.find(c => c.m === li.dataset.m); return choose(li.dataset.m, cell?.cx, cell?.cy); }
    if (li?.dataset.s) { const s = songOf(li.dataset.s), pt = EXP.pts?.find(p => p.id === li.dataset.s); return choose(s ? (MOODS[s.mood] ? s.mood : '') : EXP.sel, pt?.x, pt?.y); }
  });
  // arrastrar mueve el lienzo; un toque sin mover elige; la criatura se acaricia con un toque
  $('exStage').addEventListener('pointerdown', e => { if (EXP.tab === 'criatura') { EXP.pet = 1; return; } drag = { x: e.clientX, y: e.clientY, tx: V.tx, ty: V.ty, moved: false }; $('exStage').setPointerCapture(e.pointerId); });
  $('exStage').addEventListener('pointermove', e => {
    const tip = $('exTip'), st = $('exStage');
    if (drag) { const dx = e.clientX - drag.x, dy = e.clientY - drag.y; if (Math.abs(dx) + Math.abs(dy) > 5) drag.moved = true; if (drag.moved) { st.classList.add('drag'); V.tx = drag.tx + dx; V.ty = drag.ty + dy; place(); tip.classList.remove('on'); } return; }
    if (EXP.tab === 'criatura') return; const p = nearest(e); st.classList.toggle('pin', !!p);
    if (!p) return tip.classList.remove('on');
    const r = $('exMain').getBoundingClientRect(), d = EXP.data; let html = '';
    if (EXP.tab === 'mapa') { const h = d.hits[p.id]; html = `<b>${esc(p.name)}</b>${h ? h.n + (h.n === 1 ? ' verso' : ' versos') + ' en tus letras' : 'ninguna letra la nombra aún'}`; }
    else { const s = songOf(p.id); html = `<b>${esc(p.name)}</b>${esc(p.artist || '')}${s ? ' · ' + (s.veces || 1) + ' escuchas' : ''} · ${esc(MOODS[p.m] || '')}`; }
    tip.innerHTML = html; tip.style.left = Math.min(r.width - 290, e.clientX - r.left + 16) + 'px'; tip.style.top = Math.max(8, e.clientY - r.top - 12) + 'px'; tip.classList.add('on');
  });
  $('exStage').addEventListener('pointerleave', () => $('exTip').classList.remove('on'));
  const finish = async e => {
    const d = drag; drag = null; $('exStage').classList.remove('drag'); if (!d || d.moved || EXP.tab === 'criatura') return;
    const p = nearest(e, 26);
    if (EXP.tab === 'mapa') { if (p) return choose(p.id, p.x, p.y); }
    else if (p) { const s = songOf(p.id); return choose(s && MOODS[s.mood] ? s.mood : p.m, p.x, p.y); }
    else { const out = $('exStage').querySelector('canvas'), [vx, vy] = toV(e, out), cell = EXP.job?.cells.find(c => Math.hypot((c.cx - vx) / 1.25, (c.cy - vy) / .85) < c.r); if (cell) return choose(cell.m, cell.cx, cell.cy); }
  };
  $('exStage').addEventListener('pointerup', finish); $('exStage').addEventListener('pointercancel', () => { drag = null; $('exStage').classList.remove('drag'); });
  $('exStage').addEventListener('dblclick', e => { if (EXP.tab === 'criatura') return; const r = $('exMain').getBoundingClientRect(); if (V.k > 2) { cancelAnimationFrame(anim); V.k = 1; V.tx = V.ty = 0; place(); } else zoomAt(e.clientX - r.left, e.clientY - r.top, 2.2); });
  $('exMain').addEventListener('wheel', e => { if (EXP.tab === 'criatura' || EXP.tab === 'coleccion') return; e.preventDefault(); const r = $('exMain').getBoundingClientRect(); zoomAt(e.clientX - r.left, e.clientY - r.top, Math.exp(-e.deltaY * .0018)); }, { passive: false });
  $('exQ').addEventListener('input', e => { EXP.q = e.target.value; if (EXP.tab === 'coleccion') collectionView(); else renderSide(); });
  $('exQ').addEventListener('keydown', e => { if (e.key === 'Enter') { const first = $('exSide').querySelector('li[data-c], li[data-s], li[data-m]'); if (first) first.click(); } });
  win.addEventListener('change', async e => { if (e.target.id === 'exName') { const nombre = e.target.value.trim().slice(0, 14); const cri = (await ST.get('criatura', 'estado')) || {}; cri.nombre = nombre; await ST.set('criatura', 'estado', cri); if (EXP.st) EXP.st.name = nombre || autoName(EXP.data); } });
  addEventListener('resize', () => { if (win.classList.contains('on')) place(); });
  for (const ev of ['riso:poster-guardado', 'riso:poster-cerrado']) addEventListener(ev, () => { if (win.classList.contains('on') && EXP.tab === 'coleccion') collectionView(); });
  win.addEventListener('keydown', e => e.stopPropagation());
  EXP.open = tab => open(tab || EXP.tab);
  EXP.close = () => { cancelAnimationFrame(anim); clearTimeout(EXP.timer); win.classList.remove('on'); };
  addEventListener('keydown', e => {
    if (!win.classList.contains('on')) return; const typing = /INPUT|TEXTAREA/.test(document.activeElement?.tagName || ''), posterOpen = document.getElementById('posterWin')?.classList.contains('on');
    if (posterOpen) return;
    if (e.key === 'Escape') { e.stopImmediatePropagation(); if (typing && $('exQ').value) { $('exQ').value = ''; EXP.q = ''; return EXP.tab === 'coleccion' ? collectionView() : renderSide(); } return EXP.close(); }
    if (typing) return; const k = e.key;
    if (k === 'ArrowRight' || k === 'ArrowLeft') { e.preventDefault(); return open(TABS[(TABS.indexOf(EXP.tab) + (k === 'ArrowRight' ? 1 : TABS.length - 1)) % TABS.length]); }
    if (/^[1-4]$/.test(k)) return open(TABS[+k - 1]);
    if (k === '/') { e.preventDefault(); return $('exQ').focus(); }
    if (k === 'p' || k === 'P') return togglePanel();
    const cx = avail() / 2, cy = $('exMain').clientHeight / 2;
    if (k === '+' || k === '=') return zoomAt(cx, cy, 1.4); if (k === '-' || k === '_') return zoomAt(cx, cy, 1 / 1.4); if (k === '0') { cancelAnimationFrame(anim); V.k = 1; V.tx = V.ty = 0; place(); }
  }, true);
  if (window.RISOSHARE) RISOSHARE.openGallery = () => EXP.open('coleccion');                     // el botón «colección» de ajustes y del póster abre esta pestaña
  if (window.SETUI) SETUI.addRow('contenido', ['explorar', 'Explorar tu música', 'btn', { texto: 'mapa, atlas, criatura y colección', fn: () => EXP.open() }, 'un mapa con las ciudades de tus letras, el atlas de tu música, una criatura que crece con lo que escuchas y tu colección de pósters']);
})();
