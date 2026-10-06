// ============================================================
// symbols.js — deportes, naciones y marcas.
// Banderas simplificadas que ondean; marcas solo como nombre en
// tipografía neutra (nunca sus logos); objetos deportivos originales.
// ============================================================

// ---------- deportes ----------
const SPORTS = [
  // solo palabras que casi siempre significan el deporte (nada de prefijos sueltos como gol- o champ-)
  ['trofeo',   /\b(champion|champions|championship|campe[oó]n|campeones|campeonato|trophy|trofeo\w*|medalla\w*|medal|medals|mvp|podium|podio)\b/i],
  ['fútbol',   /\b(soccer|f[uú]tbol\w*|futbolista\w*|gol|goles|golazo\w*|goal|goals|goalkeeper|portero|delantero|penal(?:ti|ty)|mundial|world cup|champions league|messi|ronaldo|neymar|mbapp[eé])\b/i],
  ['básquet',  /\b(basketball|b[aá]squet\w*|baloncesto|nba|dunk\w*|clavada\w*|lebron|kobe|curry|hoops)\b/i],
  ['béisbol',  /\b(baseball|b[eé]isbol|home ?run\w*|jonr[oó]n\w*|pitcher\w*|mlb|grand slam|bateador\w*)\b/i],
  ['boxeo',    /\b(boxing|boxeo|boxeador\w*|boxer|knock ?out|nocaut|k\.o\.|guantes de boxeo|boxing gloves|tyson|canelo|ali\b)\b/i],
  ['carreras', /\b(racing|racetrack|nascar|f1|f[oó]rmula ?1|formula one|pit ?stop|finish line|meta final|autódromo|grand prix|gran premio)\b/i],
];
// ---------- naciones (banderas simplificadas) ----------
const NATIONS = [
  ['puerto rico', /\b(puerto rico|boricua\w*|borinquen|borik[eé]n|\bpr\b|san juan)\b/i],
  ['cuba',        /\b(cuba\w*|habana)\b/i],
  ['estados unidos', /\b(usa|u\.s\.a|united states|estados unidos|gringo\w*|new york|nueva york|nyc|los [aá]ngeles|miami|texas|atlanta|chicago)\b/i],
  ['méxico',      /\b(m[eé]xico|mexican\w*|mexicano\w*|cdmx|jalisco|monterrey|guadalajara)\b/i],
  ['colombia',    /\b(colombia\w*|medell[ií]n|bogot[aá]|cali|barranquilla)\b/i],
  ['venezuela',   /\b(venezuela\w*|caracas|maracaibo)\b/i],
  ['nicaragua',   /\b(nicaragua\w*|nica\b|nicas\b|managua|pinolero\w*)\b/i],
  ['argentina',   /\b(argentin\w*|buenos aires|rosario)\b/i],
  ['españa',      /\b(espa[nñ]a|spain|spanish|madrid|barcelona|sevilla)\b/i],
  ['dominicana',  /\b(dominican\w*|rep[uú]blica dominicana|\brd\b|santo domingo|quisqueya)\b/i],
  ['brasil',      /\b(brasil\w*|brazil\w*|r[ií]o de janeiro|s[aã]o paulo)\b/i],
  ['jamaica',     /\b(jamaica\w*|kingston)\b/i],
  ['reino unido', /\b(england|english|london|londres|uk|britain|inglaterra)\b/i],
  ['francia',     /\b(france|francia|french|franc[eé]s|paris|par[ií]s)\b/i],
  ['japón',       /\b(japan\w*|jap[oó]n|tokyo|tokio)\b/i],
  ['chile',       /\b(chile\w*|santiago)\b/i],
  ['perú',        /\b(per[uú]\w*|lima)\b/i],
  ['italia',      /\b(ital\w*|roma|rome|milan|mil[aá]n)\b/i],
];
// ---------- marcas: solo el nombre, en tipografía neutra ----------
const BRANDS = /\b(chanel|gucci|prada|dior|louis vuitton|lv|balenciaga|versace|fendi|herm[eè]s|cartier|rolex|patek|audemars|moncler|bape|supreme|off-?white|nike|adidas|puma|jordan|yeezy|apple|iphone|ferrari|lamborghini|lambo|porsche|bugatti|benz|mercedes|bmw|tesla|maybach|bentley|rolls|givenchy|valentino|saint laurent|ysl|burberry|tiffany)\b/i;

LEX.push(
  ['sport',  new RegExp(SPORTS.map(s => s[1].source).join('|'), 'i'), 'deporte'],
  ['nation', new RegExp(NATIONS.map(s => s[1].source).join('|'), 'i'), 'bandera'],
  ['brand',  BRANDS, 'marca'],
);
Object.assign(SCENE_FOR, { sport: 'estadio', nation: 'campo', brand: 'calle' });

// qué deporte, qué país, qué marca exactamente
const _interpret2 = interpret;
interpret = function (text) {
  const found = _interpret2(text);
  const sp = SPORTS.find(([, re]) => re.test(text)); if (sp) { IN.sport = sp[0]; relabel(found, 'deporte', sp[0]); }
  const na = NATIONS.find(([, re]) => re.test(text)); if (na) { IN.nation = na[0]; relabel(found, 'bandera', na[0]); }
  const br = text.match(BRANDS); if (br) { IN.brand = br[0].replace(/^lv$/i, 'louis vuitton').replace(/^lambo$/i, 'lamborghini').toUpperCase(); relabel(found, 'marca', br[0].toLowerCase()); }
  return found;
};
function relabel(found, generic, specific) { const i = found.indexOf(generic); if (i >= 0) found[i] = specific; }

// ---------- banderas: se pintan planas una vez y luego ondean ----------
const FLAG_CACHE = {};
function stripes(g, w, h, cols, vertical = false, weights) {
  const ws = weights || cols.map(() => 1), tot = ws.reduce((a, b) => a + b, 0); let acc = 0;
  cols.forEach((c, i) => { g.fillStyle = c; const a = acc / tot, b = (acc += ws[i]) / tot;
    vertical ? g.fillRect(a * w, 0, (b - a) * w + 1, h) : g.fillRect(0, a * h, w, (b - a) * h + 1); });
}
function star(g, cx, cy, r, col) {
  g.fillStyle = col; g.beginPath();
  for (let i = 0; i < 10; i++) { const a = -Math.PI / 2 + i * Math.PI / 5, rr = i % 2 ? r * .42 : r; g.lineTo(cx + Math.cos(a) * rr, cy + Math.sin(a) * rr); }
  g.fill();
}
const FLAG_ART = {
  'puerto rico': (g, w, h) => { stripes(g, w, h, ['#d52b1e', '#fff', '#d52b1e', '#fff', '#d52b1e']); g.fillStyle = '#0050f0'; g.beginPath(); g.moveTo(0, 0); g.lineTo(w * .42, h / 2); g.lineTo(0, h); g.fill(); star(g, w * .14, h / 2, h * .13, '#fff'); },
  'cuba': (g, w, h) => { stripes(g, w, h, ['#002a8f', '#fff', '#002a8f', '#fff', '#002a8f']); g.fillStyle = '#cf142b'; g.beginPath(); g.moveTo(0, 0); g.lineTo(w * .42, h / 2); g.lineTo(0, h); g.fill(); star(g, w * .14, h / 2, h * .13, '#fff'); },
  'estados unidos': (g, w, h) => { stripes(g, w, h, Array.from({ length: 13 }, (_, i) => i % 2 ? '#fff' : '#b22234')); g.fillStyle = '#3c3b6e'; g.fillRect(0, 0, w * .4, h * 7 / 13);
    for (let r = 0; r < 5; r++) for (let c = 0; c < 6; c++) { g.fillStyle = '#fff'; g.beginPath(); g.arc(w * .4 * (c + .5) / 6, h * 7 / 13 * (r + .5) / 5, h * .018, 0, TAU); g.fill(); } },
  'méxico': (g, w, h) => { stripes(g, w, h, ['#006847', '#fff', '#ce1126'], true); g.strokeStyle = '#8a6d3b'; g.lineWidth = h * .03; g.beginPath(); g.arc(w / 2, h / 2, h * .13, 0, TAU); g.stroke(); },
  'colombia': (g, w, h) => stripes(g, w, h, ['#fcd116', '#003893', '#ce1126'], false, [2, 1, 1]),
  'venezuela': (g, w, h) => { stripes(g, w, h, ['#fcd116', '#00247d', '#cf142b']); for (let i = 0; i < 8; i++) { const a = Math.PI * (1.2 + i * .6 / 7); star(g, w / 2 + Math.cos(a) * h * .22, h * .62 + Math.sin(a) * h * .22, h * .035, '#fff'); } },
  'nicaragua': (g, w, h) => { stripes(g, w, h, ['#0067c6', '#fff', '#0067c6']); g.strokeStyle = '#c9a227'; g.lineWidth = 2; g.beginPath(); g.moveTo(w / 2, h * .4); g.lineTo(w / 2 + h * .09, h * .57); g.lineTo(w / 2 - h * .09, h * .57); g.closePath(); g.stroke(); },
  'argentina': (g, w, h) => { stripes(g, w, h, ['#74acdf', '#fff', '#74acdf']); g.fillStyle = '#f6b40e'; g.beginPath(); g.arc(w / 2, h / 2, h * .08, 0, TAU); g.fill(); },
  'españa': (g, w, h) => stripes(g, w, h, ['#aa151b', '#f1bf00', '#aa151b'], false, [1, 2, 1]),
  'dominicana': (g, w, h) => { g.fillStyle = '#fff'; g.fillRect(0, 0, w, h); const cw = h * .12;
    [['#002d62', 0, 0], ['#ce1126', 1, 0], ['#ce1126', 0, 1], ['#002d62', 1, 1]].forEach(([c, i, j]) => { g.fillStyle = c; g.fillRect(i ? w / 2 + cw / 2 : 0, j ? h / 2 + cw / 2 : 0, w / 2 - cw / 2, h / 2 - cw / 2); }); },
  'brasil': (g, w, h) => { g.fillStyle = '#009c3b'; g.fillRect(0, 0, w, h); g.fillStyle = '#ffdf00'; g.beginPath(); g.moveTo(w * .08, h / 2); g.lineTo(w / 2, h * .1); g.lineTo(w * .92, h / 2); g.lineTo(w / 2, h * .9); g.fill(); g.fillStyle = '#002776'; g.beginPath(); g.arc(w / 2, h / 2, h * .22, 0, TAU); g.fill(); },
  'jamaica': (g, w, h) => { g.fillStyle = '#009b3a'; g.fillRect(0, 0, w, h); g.fillStyle = '#000'; g.beginPath(); g.moveTo(0, 0); g.lineTo(w * .45, h / 2); g.lineTo(0, h); g.moveTo(w, 0); g.lineTo(w * .55, h / 2); g.lineTo(w, h); g.fill(); g.strokeStyle = '#fed100'; g.lineWidth = h * .12; g.beginPath(); g.moveTo(0, 0); g.lineTo(w, h); g.moveTo(w, 0); g.lineTo(0, h); g.stroke(); },
  'reino unido': (g, w, h) => { g.fillStyle = '#012169'; g.fillRect(0, 0, w, h); g.strokeStyle = '#fff'; g.lineWidth = h * .18; g.beginPath(); g.moveTo(0, 0); g.lineTo(w, h); g.moveTo(w, 0); g.lineTo(0, h); g.stroke();
    g.strokeStyle = '#c8102e'; g.lineWidth = h * .07; g.stroke(); g.fillStyle = '#fff'; g.fillRect(w / 2 - h * .15, 0, h * .3, h); g.fillRect(0, h * .35, w, h * .3); g.fillStyle = '#c8102e'; g.fillRect(w / 2 - h * .09, 0, h * .18, h); g.fillRect(0, h * .41, w, h * .18); },
  'francia': (g, w, h) => stripes(g, w, h, ['#0055a4', '#fff', '#ef4135'], true),
  'japón': (g, w, h) => { g.fillStyle = '#fff'; g.fillRect(0, 0, w, h); g.fillStyle = '#bc002d'; g.beginPath(); g.arc(w / 2, h / 2, h * .3, 0, TAU); g.fill(); },
  'chile': (g, w, h) => { stripes(g, w, h, ['#fff', '#d52b1e']); g.fillStyle = '#0039a6'; g.fillRect(0, 0, h / 2, h / 2); star(g, h / 4, h / 4, h * .12, '#fff'); },
  'perú': (g, w, h) => stripes(g, w, h, ['#d91023', '#fff', '#d91023'], true),
  'italia': (g, w, h) => stripes(g, w, h, ['#009246', '#fff', '#ce2b37'], true),
  'carreras': (g, w, h) => { const n = 8, m = 5; for (let i = 0; i < n; i++) for (let j = 0; j < m; j++) { g.fillStyle = (i + j) % 2 ? '#111' : '#f5f5f5'; g.fillRect(i * w / n, j * h / m, w / n + 1, h / m + 1); } },
};
function flatFlag(name) {
  if (FLAG_CACHE[name]) return FLAG_CACHE[name];
  const c = document.createElement('canvas'); c.width = 300; c.height = 200;
  (FLAG_ART[name] || FLAG_ART['puerto rico'])(c.getContext('2d'), 300, 200);
  return FLAG_CACHE[name] = c;
}
function wavingFlag(name, fx, fy, fw, t, k) {
  const img = flatFlag(name), fh = fw * 2 / 3, cols = 40, cw = fw / cols;
  x.strokeStyle = `rgba(200,200,205,${k})`; x.lineWidth = 3; x.beginPath(); x.moveTo(fx, fy - 6); x.lineTo(fx, fy + fh * 2.6); x.stroke();
  for (let i = 0; i < cols; i++) {
    const u = i / cols, off = Math.sin(u * 7 - t * 3.2) * fh * .07 * u, shade = Math.cos(u * 7 - t * 3.2) * .18 * u;
    x.globalAlpha = k; x.drawImage(img, u * 300, 0, 300 / cols + .5, 200, fx + i * cw, fy + off, cw + .6, fh);
    x.fillStyle = shade > 0 ? `rgba(255,255,255,${shade * k})` : `rgba(0,0,0,${-shade * k})`; x.fillRect(fx + i * cw, fy + off, cw + .6, fh);
  }
  x.globalAlpha = 1;
}

// ---------- objetos deportivos (dibujos originales) ----------
function ball(cx, cy, r, kind, rot) {
  x.save(); x.translate(cx, cy); x.rotate(rot);
  if (kind === 'fútbol') {
    x.fillStyle = '#f4f4f2'; x.beginPath(); x.arc(0, 0, r, 0, TAU); x.fill();
    x.fillStyle = '#1b1b1f'; const pent = (px, py, s) => { x.beginPath(); for (let i = 0; i < 5; i++) { const a = -Math.PI / 2 + i * TAU / 5; x.lineTo(px + Math.cos(a) * s, py + Math.sin(a) * s); } x.fill(); };
    pent(0, 0, r * .32); for (let i = 0; i < 5; i++) { const a = -Math.PI / 2 + i * TAU / 5; pent(Math.cos(a) * r * .82, Math.sin(a) * r * .82, r * .2); }
  } else if (kind === 'básquet') {
    x.fillStyle = '#e07a2e'; x.beginPath(); x.arc(0, 0, r, 0, TAU); x.fill();
    x.strokeStyle = '#2a160a'; x.lineWidth = r * .06; x.beginPath(); x.moveTo(-r, 0); x.lineTo(r, 0); x.moveTo(0, -r); x.lineTo(0, r);
    x.moveTo(-r * .7, -r * .7); x.quadraticCurveTo(-r * .2, 0, -r * .7, r * .7); x.moveTo(r * .7, -r * .7); x.quadraticCurveTo(r * .2, 0, r * .7, r * .7); x.stroke();
  } else {
    x.fillStyle = '#f7f5ee'; x.beginPath(); x.arc(0, 0, r, 0, TAU); x.fill();
    x.strokeStyle = '#c8322a'; x.lineWidth = r * .07; x.beginPath(); x.arc(-r * 1.25, 0, r * .9, -.8, .8); x.stroke(); x.beginPath(); x.arc(r * 1.25, 0, r * .9, Math.PI - .8, Math.PI + .8); x.stroke();
  }
  x.restore();
}
Object.assign(MOTIF, {
  sport(k, t, E) {
    const kind = IN.sport || 'trofeo', beat = IN.beat;
    if (kind === 'fútbol' || kind === 'básquet' || kind === 'béisbol') {
      const r = S() * .06, ph = (IN.beatCount % 2 + (1 - beat)) / 2;
      const bx = W * (.3 + ((t * .08) % .4)), by = H * .78 - Math.abs(Math.sin(ph * Math.PI)) * H * .3;
      x.globalAlpha = k; x.fillStyle = 'rgba(0,0,0,.3)'; x.beginPath(); x.ellipse(bx, H * .8, r * (1.2 - (H * .8 - by) / H), r * .25, 0, 0, TAU); x.fill();
      ball(bx, by, r, kind, t * 2); x.globalAlpha = 1;
      if (kind === 'básquet') { const hx = W * .8, hy = H * .38; x.strokeStyle = `rgba(240,110,50,${k})`; x.lineWidth = 3; x.beginPath(); x.ellipse(hx, hy, S() * .06, S() * .015, 0, 0, TAU); x.stroke();
        x.strokeStyle = `rgba(240,240,240,${.6 * k})`; x.lineWidth = 1; for (let i = 0; i < 7; i++) { const u = i / 6 - .5; x.beginPath(); x.moveTo(hx + u * S() * .12, hy); x.lineTo(hx + u * S() * .07, hy + S() * .08); x.stroke(); } }
      if (kind === 'fútbol') { x.strokeStyle = `rgba(240,240,240,${.5 * k})`; x.lineWidth = 1; const gx = W * .82, gy = H * .5, gw = S() * .22, gh = S() * .14;
        x.strokeRect(gx, gy, gw, gh); for (let i = 1; i < 8; i++) { x.beginPath(); x.moveTo(gx + i * gw / 8, gy); x.lineTo(gx + i * gw / 8, gy + gh); x.stroke(); } }
    } else if (kind === 'boxeo') {
      const s = S() * .09, hit = beat;
      for (const sd of [-1, 1]) { const gx = W / 2 + sd * (S() * .12 + (1 - hit) * S() * .08), gy = H * .5;
        x.save(); x.translate(gx, gy); x.scale(-sd, 1); x.fillStyle = `rgba(190,30,40,${k})`;
        x.beginPath(); x.ellipse(0, 0, s, s * .8, 0, 0, TAU); x.fill(); x.beginPath(); x.ellipse(s * .55, s * .3, s * .35, s * .3, 0, 0, TAU); x.fill();
        x.fillStyle = `rgba(245,240,235,${k})`; x.fillRect(-s * 1.4, -s * .45, s * .5, s * .9); x.restore(); }
      if (hit > .9) glow(W / 2, H * .5, S() * .2, 'rgba(255,240,200,A)', .5 * k);
      x.strokeStyle = `rgba(220,40,40,${.5 * k})`; x.lineWidth = 3; for (let i = 0; i < 3; i++) { x.beginPath(); x.moveTo(0, H * (.62 + i * .06)); x.lineTo(W, H * (.62 + i * .06)); x.stroke(); }
    } else if (kind === 'carreras') {
      wavingFlag('carreras', W * .62, H * .16, S() * .3, t, k);
    } else {
      const cx = W / 2, cy = H * .5, s = S() * .12;
      glow(cx, cy - s * .4, s * 3, 'rgba(255,210,110,A)', .35 * k);
      const g = x.createLinearGradient(cx - s, 0, cx + s, 0); g.addColorStop(0, `rgba(170,120,30,${k})`); g.addColorStop(.45, `rgba(255,225,130,${k})`); g.addColorStop(1, `rgba(160,110,30,${k})`);
      x.fillStyle = g; x.beginPath(); x.moveTo(cx - s, cy - s); x.lineTo(cx + s, cy - s); x.quadraticCurveTo(cx + s * .9, cy + s * .2, cx, cy + s * .35); x.quadraticCurveTo(cx - s * .9, cy + s * .2, cx - s, cy - s); x.fill();
      x.fillRect(cx - s * .12, cy + s * .3, s * .24, s * .5); x.fillRect(cx - s * .5, cy + s * .8, s, s * .2);
      x.strokeStyle = `rgba(230,180,80,${k})`; x.lineWidth = s * .09; x.beginPath(); x.arc(cx - s, cy - s * .55, s * .35, Math.PI * .5, Math.PI * 1.5); x.stroke(); x.beginPath(); x.arc(cx + s, cy - s * .55, s * .35, -Math.PI * .5, Math.PI * .5); x.stroke();
    }
  },
  nation(k, t) { if (IN.nation) wavingFlag(IN.nation, W * .08, H * .12, Math.min(W * .34, S() * .5), t, k); },
  brand(k, t, E) {
    const name = IN.brand || '', s = S() * .11;
    [[W * .66, 1.1, -.08], [W * .8, .85, .1]].forEach(([bx, sc, rot], i) => {
      const w = s * sc, h = w * 1.25, by = H * .82 - h;
      x.save(); x.translate(bx, by + Math.sin(t + i) * 4); x.rotate(rot);
      x.fillStyle = i ? `rgba(18,18,20,${.95 * k})` : `rgba(240,236,228,${.95 * k})`; x.fillRect(-w / 2, 0, w, h);
      x.strokeStyle = i ? `rgba(240,236,228,${.7 * k})` : `rgba(18,18,20,${.7 * k})`; x.lineWidth = 2; x.beginPath(); x.arc(0, 0, w * .22, Math.PI, 0); x.stroke();
      x.fillStyle = i ? `rgba(240,236,228,${k})` : `rgba(18,18,20,${k})`; x.textAlign = 'center';
      x.font = `400 ${Math.max(9, w * .11)}px Inter`; x.fillText(name.split('').join(' '), 0, h * .55, w * .9);
      x.restore();
    });
    const g = x.createRadialGradient(W * .72, 0, 0, W * .72, 0, H); g.addColorStop(0, `rgba(255,245,225,${.18 * k})`); g.addColorStop(1, 'rgba(255,245,225,0)');
    x.fillStyle = g; x.beginPath(); x.moveTo(W * .72, 0); x.lineTo(W * .52, H); x.lineTo(W * .95, H); x.fill();
    MOTIF.gold(k * .7, t, E);
  },
});

// ---------- escenario: estadio ----------
GENS.push({ name: 'estadio', make: r => ({ night: r() < .7 }),
  draw(p, t, dt, R, E) {
    bg(R.night ? '#03050b' : '#3b6ea8', R.night ? '#0b1020' : '#9cc2e8'); if (R.night) drawStars(t, .5, .3);
    const hz = H * .55;
    for (const u of [.08, .92]) { const tx = u * W; x.fillStyle = '#0c0e14'; x.fillRect(tx - 3, H * .12, 6, hz - H * .12);
      for (let i = 0; i < 6; i++) glow(tx - 18 + (i % 3) * 18, H * .12 + Math.floor(i / 3) * 14, 18, 'rgba(255,250,235,A)', .9);
      const g = x.createLinearGradient(tx, H * .12, W / 2, H * .8); g.addColorStop(0, 'rgba(255,250,235,.16)'); g.addColorStop(1, 'rgba(255,250,235,0)');
      x.fillStyle = g; x.beginPath(); x.moveTo(tx, H * .12); x.lineTo(W / 2 - W * .2, H * .9); x.lineTo(W / 2 + W * .2, H * .9); x.fill(); }
    for (let r = 0; r < 4; r++) { const y = hz - 18 * (r + 1);
      x.fillStyle = `rgba(10,12,20,${.9 - r * .1})`; x.fillRect(0, y, W, 18);
      for (let i = 0; i < 70; i++) if ((i * 7 + r * 13 + IN.beatCount) % 11 === 0) { x.fillStyle = `rgba(255,255,255,${.3 + IN.beat * .6})`; x.fillRect((i / 70) * W + r * 5, y + 6, 2, 2); } }
    const fg = x.createLinearGradient(0, hz, 0, H); fg.addColorStop(0, '#1d5a2c'); fg.addColorStop(1, '#2f8a43'); x.fillStyle = fg;
    x.beginPath(); x.moveTo(W * .2, hz); x.lineTo(W * .8, hz); x.lineTo(W * 1.2, H); x.lineTo(-W * .2, H); x.fill();
    for (let i = 0; i < 8; i++) { x.fillStyle = i % 2 ? 'rgba(255,255,255,.035)' : 'rgba(0,0,0,.04)';
      const a = i / 8, b = (i + 1) / 8; x.beginPath(); x.moveTo(W * (.2 + .6 * a), hz); x.lineTo(W * (.2 + .6 * b), hz); x.lineTo(W * (-.2 + 1.4 * b), H); x.lineTo(W * (-.2 + 1.4 * a), H); x.fill(); }
    x.strokeStyle = 'rgba(255,255,255,.55)'; x.lineWidth = 2;
    x.beginPath(); x.moveTo(W / 2, hz); x.lineTo(W / 2, H); x.stroke(); x.beginPath(); x.ellipse(W / 2, hz + (H - hz) * .45, W * .12, (H - hz) * .12, 0, 0, TAU); x.stroke();
  } });
