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
    st.setInks(ink); EXP.job = { draw, ...extra }; st.setScene('exp', { instant: true }); st.speed = extra.speed || 0; st.frame(1 / 30); st.frame(extra.dt || 1 / 30);
    return st.canvas;
  }

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
    return { moods, gens, artists: d.artists, songs: d.songs.length, total: d.total, level, name, days, top: moods[0]?.[0] || '', genre: gens[0]?.[0] || '', state: !d.total ? 'huevo' : days > 10 ? 'dormido' : days > 3 ? 'hambriento' : 'contento' };
  }
  EXP.stats = stats;
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

  // ---------- ventana ----------
  const css = document.createElement('style'); css.textContent = `
    #expWin { position:fixed; inset:0; z-index:31; display:none; background:rgba(33,43,128,.6); padding:18px; } #expWin.on { display:flex; justify-content:center; align-items:center; }
    #expWin .ex-in { width:min(1240px,100%); max-height:100%; display:grid; grid-template-columns:1fr 300px; grid-template-rows:auto 1fr; gap:12px 16px; background:var(--rkp,#f7edd8); border:4px solid var(--rk1,#212b80); box-shadow:10px 10px 0 -1px var(--rk1,#212b80); padding:16px; overflow:auto; }
    #expWin .ex-tabs { grid-column:1/3; display:flex; gap:8px; align-items:center; } #expWin .ex-tabs .sp { flex:1; }
    #expWin button { padding:8px 14px; border:3px solid var(--rk1,#212b80); background:var(--rkl,#faf3e4); color:var(--rk1,#212b80); font:700 13px 'Anybody',sans-serif; font-stretch:80%; text-transform:uppercase; letter-spacing:.05em; cursor:pointer; } #expWin button:hover, #expWin button.on { background:var(--rk1,#212b80); color:var(--rkl,#faf3e4); }
    #expWin .ex-view { min-width:0; } #expWin canvas { position:static !important; inset:auto !important; display:block; width:100%; height:auto; max-height:76vh; object-fit:contain; border:3px solid var(--rk1,#212b80); background:#f4ead4; cursor:pointer; }
    #expWin .ex-side { font:500 12px 'Martian Mono',monospace; letter-spacing:.05em; text-transform:uppercase; color:var(--rk1,#212b80); overflow:auto; max-height:76vh; } #expWin .ex-side h3 { margin:0 0 8px; font:800 24px/1 'Anybody',sans-serif; font-stretch:70%; }
    #expWin .ex-side li { list-style:none; margin:0 0 8px; padding:6px 8px; border:2px solid var(--rk1,#212b80); background:var(--rkl,#faf3e4); cursor:pointer; text-transform:none; letter-spacing:0; font-size:12px; } #expWin .ex-side li b { text-transform:uppercase; font-size:13px; } #expWin .ex-side li.on { background:var(--rk2,#f97a2a); }
    #expWin .ex-side ul { margin:0; padding:0; } #expWin .ex-side input { width:100%; padding:8px; border:3px solid var(--rk1,#212b80); background:#fff; color:var(--rk1,#212b80); font:600 20px 'Caveat',cursive; margin-bottom:10px; }
    #expWin .ex-side p { text-transform:none; letter-spacing:0; font-size:12px; line-height:1.4; margin:0 0 8px; }
    @media (max-width:820px) { #expWin .ex-in { grid-template-columns:1fr; } #expWin .ex-tabs { grid-column:1; flex-wrap:wrap; } }`;
  document.head.appendChild(css);
  const win = document.createElement('div'); win.id = 'expWin'; win.setAttribute('role', 'dialog'); win.setAttribute('aria-label', 'explorar'); document.body.appendChild(win);
  win.innerHTML = `<div class="ex-in"><div class="ex-tabs"><button data-t="mapa">mapa</button><button data-t="atlas">atlas de tu música</button><button data-t="criatura">criatura</button><span class="sp"></span><button data-a="x">cerrar</button></div><div class="ex-view" id="exView"></div><div class="ex-side" id="exSide"></div></div>`;
  const $ = id => document.getElementById(id);
  let anim = 0, cv = null;
  const canvasFor = (c) => { const v = $('exView'); let out = v.querySelector('canvas'); if (!out) { out = document.createElement('canvas'); v.append(out); } out.width = c.width; out.height = c.height; out.getContext('2d').drawImage(c, 0, 0); return out; };
  const toV = (e, out) => { const r = out.getBoundingClientRect(), px = (e.clientX - r.left) / r.width * out.width, py = (e.clientY - r.top) / r.height * out.height, sK = out.height / 900; return [(px - out.width / 2) / sK + 800, py / sK]; };
  async function show(tab, keepSel) {
    if (EXP.busy) return; EXP.busy = true; try {
      EXP.tab = tab; if (!keepSel) EXP.sel = null; cancelAnimationFrame(anim); clearTimeout(EXP.timer); win.classList.add('on');
      for (const b of win.querySelectorAll('[data-t]')) b.classList.toggle('on', b.dataset.t === tab);
      const d = EXP.data = await load(), side = $('exSide');
      if (tab === 'mapa') {
        cv = canvasFor(paint(2400, 1350, 0, drawMap, { data: d, sel: EXP.sel, t: 0 })); EXP.pts = EXP.job.pts;
        const list = CITIES.filter(c => d.hits[c.id]).sort((a, b) => d.hits[b.id].n - d.hits[a.id].n);
        side.innerHTML = `<h3>ciudades</h3><p>${list.length} de ${CITIES.length} nombradas en las letras que guardaste. toca un pin o una ciudad.</p><ul>${list.map(c => `<li data-c="${c.id}" class="${EXP.sel === c.id ? 'on' : ''}"><b>${esc(c.name)}</b> · ${d.hits[c.id].n} ${d.hits[c.id].n === 1 ? 'verso' : 'versos'}</li>`).join('')}</ul>` +
          (EXP.sel && d.hits[EXP.sel] ? `<h3 style="margin-top:14px">${esc(CITIES.find(c => c.id === EXP.sel).name)}</h3><ul>${[...d.hits[EXP.sel].songs.values()].map(s => `<li><b>${esc(s.name)}</b><br>${esc(s.artist)}<br><i>«${esc(s.line)}»</i></li>`).join('')}</ul>` : '');
      } else if (tab === 'atlas') {
        cv = canvasFor(paint(2400, 1350, 2, drawAtlas, { data: d, sel: EXP.sel })); EXP.pts = EXP.job.pts; const cells = EXP.job.cells, sel = cells.find(c => c.m === EXP.sel);
        side.innerHTML = `<h3>islas</h3><p>una isla por ánimo; cada pueblito es una canción, más grande cuanto más la escuchas.</p><ul>${cells.map(c => `<li data-m="${esc(c.m)}" class="${EXP.sel === c.m ? 'on' : ''}"><b>${MOODS[c.m]}</b> · ${c.g.length} canciones</li>`).join('')}</ul>` +
          (sel ? `<h3 style="margin-top:14px">${MOODS[sel.m]}</h3><ul>${[...sel.g].sort((a, b) => (b.veces || 1) - (a.veces || 1)).map(s => `<li><b>${esc(s.name)}</b><br>${esc(s.artist)} · ${s.veces || 1}×</li>`).join('')}</ul>` : '');
      } else { await creatureView(d); }
    } finally { EXP.busy = false; }
  }
  async function creatureView(d) {
    const st = EXP.st = stats(d); EXP.pet = 0; const side = $('exSide');
    const dias = st.days > 900 ? 'nunca' : st.days === 0 ? 'hoy' : st.days === 1 ? 'ayer' : 'hace ' + st.days + ' días';
    side.innerHTML = `<h3>tu criatura</h3><input id="exName" maxlength="14" value="${esc(st.name)}" aria-label="nombre de la criatura" spellcheck="false"><p>nivel <b>${st.level}</b> de 12 · ${st.state}</p><p>${st.total} escuchas · ${st.songs} canciones · ${st.artists} artistas</p><p>ánimo dominante: ${esc(MOODS[st.top] || '—')}<br>género dominante: ${esc(st.genre || '—')}<br>última música: ${dias}</p>
      <p>crece con lo que escuchas: más nivel, más grande; antenas al 3, corona al 10. sus manchas son tus artistas, sus orejas tu género, sus colores tu ánimo.</p><button data-a="pet">acariciar</button>`;
    const tick = () => { if (EXP.tab !== 'criatura' || !win.classList.contains('on')) return; EXP.t = (EXP.t || 0) + .16; EXP.pet = Math.max(0, EXP.pet - .05);
      cv = canvasFor(paint(720, 720, MOOD_INK[st.top] || 0, drawCreature, { st: EXP.st, t: EXP.t, petting: EXP.pet })); EXP.timer = setTimeout(tick, 140); };
    tick();
  }
  win.addEventListener('click', async e => {
    const b = e.target.closest('button'), li = e.target.closest('li');
    if (e.target === win || b?.dataset.a === 'x') return EXP.close();
    if (b?.dataset.t) return show(b.dataset.t);
    if (b?.dataset.a === 'pet') { EXP.pet = 1; return; }
    if (li?.dataset.c) { EXP.sel = li.dataset.c; return show('mapa', true); }
    if (li?.dataset.m !== undefined) { EXP.sel = li.dataset.m; return show('atlas', true); }
    const out = e.target.closest('canvas'); if (out && EXP.pts && EXP.tab !== 'criatura') {
      const [vx, vy] = toV(e, out); let best = null, bd = 30; for (const p of EXP.pts) { const dd = Math.hypot(p.x - vx, p.y - vy); if (dd < bd) { bd = dd; best = p; } }
      if (EXP.tab === 'mapa') { if (best && EXP.data.hits[best.id]) { EXP.sel = best.id; return show('mapa', true); } }
      else { const cell = EXP.job.cells.find(c => Math.hypot((c.cx - vx) / 1.25, (c.cy - vy) / .85) < c.r); if (cell) { EXP.sel = cell.m; return show('atlas', true); } }
    }
  });
  win.addEventListener('change', async e => { if (e.target.id === 'exName') { const nombre = e.target.value.trim().slice(0, 14); const cri = (await ST.get('criatura', 'estado')) || {}; cri.nombre = nombre; await ST.set('criatura', 'estado', cri); if (EXP.st) EXP.st.name = nombre || autoName(EXP.data); } });
  win.addEventListener('keydown', e => e.stopPropagation());
  EXP.open = tab => show(tab || EXP.tab);
  EXP.close = () => { cancelAnimationFrame(anim); clearTimeout(EXP.timer); win.classList.remove('on'); };
  addEventListener('keydown', e => { if (e.key === 'Escape' && win.classList.contains('on')) { e.stopImmediatePropagation(); EXP.close(); } }, true);
  if (window.SETUI) SETUI.addRow('contenido', ['explorar', 'Explorar tu música', 'btn', { texto: 'mapa, atlas y criatura', fn: () => EXP.open() }, 'un mapa con las ciudades de tus letras, el atlas de tu música y una criatura que crece con lo que escuchas']);
})();
