// ============================================================
// interpret.js — lee la letra de cualquier canción mientras suena
// e imagina lo que dice: conceptos y ánimo se vuelven capas visuales.
// El fondo late con el BPM real de la canción.
// Las letras no viven aquí: llegan de LRCLIB en tiempo real.
// ============================================================

// ---------- léxico: palabra -> concepto (inglés y español) ----------
const LEX = [
  ['rain',    /\b(rain\w*|lluvi\w*|llov\w*|storm\w*|tormenta\w*|drizzle)\b/i, 'lluvia'],
  ['snow',    /\b(snow\w*|nieve\w*|frozen|cold|frío|fría|ice|hielo|winter|invierno)\b/i, 'nieve'],
  ['fire',    /\b(fire\w*|burn\w*|flame\w*|fuego\w*|quem\w*|arde\w*|llama\w*|smoke\w*|humo|hell)\b/i, 'fuego'],
  ['stars',   /\b(stars?|estrella\w*|galax\w*|universe|universo|cosmos|space|espacio|comet\w*)\b/i, 'estrellas'],
  ['moon',    /\b(moon\w*|luna\w*|midnight|medianoche)\b/i, 'luna'],
  ['sun',     /\b(sun\w*|sol|soleado|summer|verano|morning|mañana|dawn|amanecer|sunrise)\b/i, 'sol'],
  ['sea',     /\b(sea|ocean\w*|mar|océano|wave\w*|ola\w*|water|agua\w*|river|río|swim\w*|nad\w*|drown\w*|ahog\w*)\b/i, 'mar'],
  ['city',    /\b(city|cities|ciudad\w*|street\w*|calle\w*|town|downtown|lights|neon|skyline|building\w*)\b/i, 'ciudad'],
  ['road',    /\b(car|cars|drive\w*|driving|conduc\w*|road\w*|carretera|highway|autopista|ride|taxi|coche|carro|runaway)\b/i, 'carretera'],
  ['love',    /\b(love\w*|lover|amor\w*|am[oa]r|heart\w*|coraz\w*|kiss\w*|bes[oa]\w*|baby|bebé|darling|querid\w*)\b/i, 'amor'],
  ['flowers', /\b(flower\w*|flor\w*|rose\w*|rosa\w*|bloom\w*|garden|jardín|petal\w*|pétalo\w*|spring|primavera)\b/i, 'flores'],
  ['fly',     /\b(fly|flying|flew|vol\w*|wing\w*|ala\w*|bird\w*|pájar\w*|ave\w*|sky|cielo\w*|free|libre\w*)\b/i, 'vuelo'],
  ['time',    /\b(time|tiempo|clock\w*|reloj\w*|hour\w*|hora\w*|forever|siempre|never|nunca|tonight|esta noche|yesterday|ayer)\b/i, 'tiempo'],
  ['heaven',  /\b(heaven\w*|god|dios\w*|angel\w*|ángel\w*|pray\w*|rez\w*|soul\w*|alma\w*|holy|santo\w*|sagrad\w*|divin\w*|bendit\w*|bless\w*|milagro\w*|miracle\w*|jesus|jesús|cross|cruz)\b/i, 'cielo'],
  ['death',   /\b(die|dies|died|dying|dead|death|muer\w*|mor\w*|grave\w*|tumba\w*|ghost\w*|fantasma\w*|funeral|bury|kill\w*|mat[aoé]\w*)\b/i, 'muerte'],
  ['tears',   /\b(tear\w*|cry\w*|crying|lágrima\w*|llor\w*|sad\w*|trist\w*|pain\w*|dolor\w*|hurt\w*|broken|roto\w*)\b/i, 'lágrimas'],
  ['dream',   /\b(dream\w*|sueñ\w*|soñ\w*|sleep\w*|dorm\w*|wake\w*|despiert\w*|imagine|imagin\w*)\b/i, 'sueño'],
  ['gold',    /\b(gold\w*|oro|money|dinero|cash|diamond\w*|diamante\w*|rich|shine\w*|brill\w*)\b/i, 'oro'],
  ['home',    /\b(home|house|casa\w*|hogar|room|cuarto|habitación|door\w*|puerta\w*|window\w*|ventana\w*)\b/i, 'hogar'],
  ['thunder', /\b(thunder\w*|trueno\w*|lightning|rayo\w*|electric\w*|eléctric\w*|scream\w*|grit\w*)\b/i, 'tormenta'],
  ['dance',   /\b(danc\w*|bail\w*|party|fiesta\w*|club|move|mueve\w*|jump\w*|salt\w*)\b/i, 'baile'],
  ['eyes',    /\b(eye\w*|ojo\w*|see|seen|mirar|mira\w*|look\w*|ver|vista)\b/i, 'mirada'],
  ['dark',    /\b(dark\w*|oscur\w*|night\w*|noche\w*|shadow\w*|sombra\w*|black|negro\w*|alone|sol[oa]\b|lonely)\b/i, 'noche'],
  ['light',   /\b(light\w*|luz|luces|bright\w*|glow\w*|brill\w*|shine|fuego artificial|firework\w*)\b/i, 'luz'],
];
// ánimo: valencia (triste - feliz) y energía (calma - intensa)
const MOOD = [
  [/\b(happy|feliz\w*|smile\w*|sonri\w*|alive|viv[oa]\w*|joy|alegr\w*|laugh\w*|re[ií]\w*|good|bien|beautiful|hermos\w*|bonit\w*|free|libre\w*)\b/i, .5, .2],
  [/\b(sad\w*|trist\w*|cry\w*|llor\w*|alone|sol[oa]\b|lonely|lost|perdid\w*|broken|roto\w*|goodbye|adiós|miss\w*|extrañ\w*|empty|vacío\w*)\b/i, -.6, -.2],
  [/\b(fight\w*|pelea\w*|war|guerra|scream\w*|grit\w*|run\w*|corr\w*|crazy|loc[oa]\w*|wild|salvaje|fast|rápido\w*|fuck\w*|damn|kill\w*)\b/i, -.1, .6],
  [/\b(calm\w*|calma\w*|slow\w*|lento\w*|quiet\w*|silen\w*|soft\w*|suave\w*|breathe|respir\w*|peace|paz)\b/i, .2, -.5],
];

// ---------- estado del intérprete ----------
const IN = {
  lines: [], cuts: [], synced: false, lyrState: '', shown: -1, show: true,
  bpm: 0, period: .5, phase: 0, bpmSrc: '',
  motifs: {}, mood: { v: 0, a: 0, tv: 0, ta: 0 }, concepts: [], flash: 0, clock: 0, lastBeat: -1, lastConcept: '', beat: 0, beatCount: 0,
};
try { IN.show = localStorage.getItem('tc_showlyr') !== '0'; } catch (e) {}

function parseLRC(raw) {
  const out = [];
  for (const l of raw.split(/\r?\n/)) {
    const ms = [...l.matchAll(/\[(\d+):(\d+(?:\.\d+)?)\]/g)];
    const text = l.replace(/\[[^\]]*\]/g, '').trim();
    for (const m of ms) out.push({ t: +m[1] * 60 + +m[2], text });
  }
  return out.sort((a, b) => a.t - b.t);
}
// bloques de la historia: se corta donde la letra respira (pausas, cambios de estrofa)
function buildCuts(lines, dur, secLen) {
  const cuts = [0];
  lines.forEach((l, i) => {
    const prev = lines[i - 1];
    if (!l.text) return;
    if (!prev || !prev.text || l.t - prev.t > 5.5) if (l.t - cuts.at(-1) > 6) cuts.push(Math.max(0, l.t - .3));
  });
  const end = dur || (lines.at(-1)?.t || 0) + 20, full = [];
  cuts.concat([end]).reduce((a, b) => {
    full.push(a);
    const n = Math.floor((b - a) / (secLen * 2));
    for (let k = 1; k <= n; k++) full.push(a + (b - a) * k / (n + 1));
    return b;
  });
  return full;
}
// tempo estimado de la letra: el pulso cuyo compás mejor alinea las entradas de las líneas
function tempoFromLyrics(lines) {
  const ts = lines.filter(l => l.text).map(l => l.t);
  if (ts.length < 12) return 0;
  const coh = bpm => { const per = 60 / bpm; let sx = 0, sy = 0; for (const t of ts) { const a = t / per * TAU; sx += Math.cos(a); sy += Math.sin(a); } return Math.hypot(sx, sy) / ts.length; };
  let best = 0, bestB = 0; const scores = [];
  for (let b = 60; b <= 170; b += .25) { const c = coh(b); scores.push([b, c]); if (c > best) { best = c; bestB = b; } }
  if (best < .35) return 0;
  const ok = scores.find(([b, c]) => c >= best * .92);   // el más lento que casi empata: evita elegir subdivisiones
  return ok ? ok[0] : bestB;
}
// fase del pulso: las líneas suelen entrar en un tiempo fuerte
function beatPhase(lines, period) {
  let sx = 0, sy = 0;
  for (const l of lines) if (l.text) { const a = (l.t / period % 1) * TAU; sx += Math.cos(a); sy += Math.sin(a); }
  return sx || sy ? ((Math.atan2(sy, sx) / TAU) + 1) % 1 * period : 0;
}

async function loadSongMeta() {
  const s = ext.st, key = ext.key();
  IN.lines = []; IN.cuts = []; IN.blockGen = null; IN.synced = false; IN.lyrState = 'buscando letra'; IN.shown = -1;
  IN.bpm = proc.bpm; IN.period = 60 / IN.bpm; IN.phase = 0; IN.bpmSrc = 'estimado';
  IN.motifs = {}; IN.concepts = []; IN.mood = { v: 0, a: 0, tv: 0, ta: 0 };
  IN.sport = IN.nation = IN.brand = ''; IN.genreRaw = ''; IN.genre = '';              // nada se arrastra de la canción anterior
  if (!ext.has()) { IN.lyrState = 'sin letra'; return; }
  const q = new URLSearchParams({ artist: s.artist, title: s.name, album: s.album, dur: s.dur });
  const lyP = fetch('/lyrics?' + q).then(r => r.json()).catch(() => ({}));
  const bpP = s.bpm > 40 ? Promise.resolve({ bpm: s.bpm, source: 'música' }) : fetch('/bpm?' + q).then(r => r.json()).catch(() => ({}));
  const ly = await lyP;
  // la letra llegó: la traducción puede empezar ya, sin esperar al tempo
  if (ext.key() === key && ly.synced) dispatchEvent(new CustomEvent('lyricsEarly', { detail: { key, lines: parseLRC(ly.synced).map(l => ({ ...l, t: l.t * (ly.scale || 1) })) } }));
  const bp = await bpP;
  if (ext.key() !== key) return;                 // cambió la canción mientras llegaba
  IN.genreRaw = bp.genre || '';
  if (bp.bpm > 40) {
    let b = bp.bpm; while (b > 170) b /= 2; while (b < 60) b *= 2;
    IN.bpm = b; IN.period = 60 / b; IN.bpmSrc = bp.source;
  }
  if (ly.plain && !ly.synced) {
    // letra sin tiempos: se reparte entre donde suele empezar y terminar el canto,
    // cada línea según su largo, con respiro entre estrofas
    const raw = ly.plain.split(/\r?\n/).map(t => t.trim());
    const t0 = Math.max(4, s.dur * .07), t1 = s.dur - Math.max(4, s.dur * .05);
    const wts = raw.map(t => t ? 1.2 + t.length * .05 : 1.6), sum = wts.reduce((a, b) => a + b, 0) || 1;
    let acc = t0; ly.synced = raw.map((t, i) => { const at = acc; acc += wts[i] / sum * (t1 - t0); return t ? `[${Math.floor(at / 60)}:${(at % 60).toFixed(2)}]${t}` : ''; }).filter(Boolean).join('\n');
  }
  if (ly.synced) {
    IN.lines = parseLRC(ly.synced); IN.synced = true;
    if (ly.scale) IN.lines.forEach(l => l.t *= ly.scale);            // otra edición: tiempos estirados a esta duración
    IN.lyrState = ly.approx === 'plain' ? 'letra aproximada (sin tiempos)' : ly.approx === 'stretch' ? 'letra aproximada (otra versión)' : 'letra sincronizada';
    if (!(bp.bpm > 40)) { const est = tempoFromLyrics(IN.lines); if (est) { IN.bpm = est; IN.period = 60 / est; IN.bpmSrc = 'letra'; } }
    IN.phase = beatPhase(IN.lines, IN.period);
    IN.cuts = buildCuts(IN.lines, s.dur, 60 / (IN.bpm || 100) * 16);   // estable por canción (no depende de la semilla): la memoria de la IA acierta siempre
    planScenes();
  } else IN.lyrState = ly.instrumental ? 'instrumental' : ly.plain ? 'letra sin tiempos' : 'sin letra';
  ui();
}

// ---------- guion: cada bloque de la letra elige su escenario ----------
const SCENE_FOR = {
  stars: 'deriva', fly: 'deriva', dream: 'nebulosa', dark: 'nebulosa', heaven: 'horizonte', sun: 'horizonte', light: 'horizonte',
  moon: 'órbitas', gold: 'órbitas', home: 'órbitas', time: 'túnel', road: 'túnel', city: 'red', eyes: 'red',
  love: 'mandala', flowers: 'mandala', dance: 'mandala', sea: 'aurora', rain: 'aurora', snow: 'aurora', tears: 'aurora',
  fire: 'corriente', thunder: 'corriente', death: 'corriente',
};
function planScenes() {
  IN.blockGen = [];
  const byName = n => GENS.findIndex(g => g.name === n);
  for (let i = 0; i < IN.cuts.length; i++) {
    const a = IN.cuts[i], b = IN.cuts[i + 1] ?? Infinity, count = {};
    for (const l of IN.lines) if (l.text && l.t >= a && l.t < b)
      for (const [id, re] of LEX) if (re.test(l.text)) { const g = SCENE_FOR[id]; if (g) count[g] = (count[g] || 0) + 1; }
    const ranked = Object.entries(count).sort((p, q) => q[1] - p[1]).map(e => byName(e[0]));
    const prev = IN.blockGen[i - 1];
    let gi = ranked.find(g => g !== prev);
    if (gi === undefined) { gi = proc.order[i % proc.order.length]; if (gi === prev) gi = proc.order[(i + 1) % proc.order.length]; }
    IN.blockGen.push(gi);
  }
}

// ---------- interpretar una línea ----------
function interpret(text) {
  const found = [];
  for (const [id, re, label] of LEX) if (re.test(text)) {
    found.push(label);
    const m = IN.motifs[id] || (IN.motifs[id] = { k: 0, born: performance.now(), seed: Math.random() * 1e6 });
    m.target = 1; m.hold = 9;                    // se queda ~9 s si no se repite
  }
  for (const [re, v, a] of MOOD) if (re.test(text)) { IN.mood.tv = clamp(IN.mood.tv + v, -1, 1); IN.mood.ta = clamp(IN.mood.ta + a, -1, 1); }
  if (found.length) { IN.concepts = found.slice(0, 3); IN.flash = 1; }
  return found;
}

// ---------- capas visuales (cada concepto se imagina distinto) ----------
const pool = {};
const P = (id, n, f) => pool[id] || (pool[id] = pts(n, f));
const MOTIF = {
  rain(k, t, E) {
    x.strokeStyle = `rgba(190,210,255,${.35 * k})`; x.lineWidth = 1;
    for (const d of P('rain', 220, () => [rnd(), rnd(), .6 + rnd()])) {
      const y = ((d[1] + t * .9 * d[2]) % 1) * H, xx = ((d[0] + y / H * .08) % 1) * W;
      x.beginPath(); x.moveTo(xx, y); x.lineTo(xx - 6, y + 18 * d[2]); x.stroke();
    }
  },
  snow(k, t) {
    for (const d of P('snow', 160, () => [rnd(), rnd(), .3 + rnd(), rnd() * TAU])) {
      const y = ((d[1] + t * .05 * d[2]) % 1) * H, xx = (d[0] * W + Math.sin(t + d[3]) * 20);
      x.fillStyle = `rgba(245,248,255,${.7 * k})`; x.beginPath(); x.arc(xx, y, 1 + d[2] * 1.8, 0, TAU); x.fill();
    }
  },
  fire(k, t, E) {
    const g = x.createLinearGradient(0, H * .6, 0, H); g.addColorStop(0, 'rgba(255,90,20,0)'); g.addColorStop(1, `rgba(255,110,30,${.35 * k * (.7 + E * .6)})`);
    x.fillStyle = g; x.fillRect(0, H * .6, W, H * .4);
    for (const d of P('fire', 120, () => [rnd(), rnd(), .4 + rnd()])) {
      const kk = (d[1] + t * .12 * d[2]) % 1, y = H - kk * H * .8, xx = d[0] * W + Math.sin(t * 2 + d[0] * 20) * 15 * kk;
      x.fillStyle = `rgba(255,${160 - kk * 100},60,${(1 - kk) * k})`; x.fillRect(xx, y, 2, 2);
    }
  },
  stars(k, t) {
    for (const d of P('shoot', 5, () => [rnd(), rnd() * .5, rnd()])) {
      const kk = (t * .25 + d[2]) % 1; if (kk > .3) continue;
      const q = kk / .3, sx = d[0] * W + q * 260, sy = d[1] * H + q * 130;
      const g = x.createLinearGradient(sx - 120, sy - 60, sx, sy); g.addColorStop(0, 'rgba(255,255,255,0)'); g.addColorStop(1, `rgba(255,255,255,${k * (1 - q)})`);
      x.strokeStyle = g; x.lineWidth = 2; x.beginPath(); x.moveTo(sx - 120, sy - 60); x.lineTo(sx, sy); x.stroke();
    }
    drawStars(t, .6 * k);
  },
  moon(k, t) {
    const mx = W * .78, my = H * .2, r = S() * .07;
    glow(mx, my, r * 4, 'rgba(220,230,255,A)', .35 * k);
    x.fillStyle = `rgba(240,242,255,${.9 * k})`; x.beginPath(); x.arc(mx, my, r, 0, TAU); x.fill();
    x.fillStyle = `rgba(0,0,0,${.15 * k})`; x.beginPath(); x.arc(mx - r * .3, my - r * .2, r * .2, 0, TAU); x.arc(mx + r * .35, my + r * .3, r * .12, 0, TAU); x.fill();
  },
  sun(k, t, E) {
    glow(W / 2, H * .15, S() * (.7 + E * .15), 'rgba(255,200,110,A)', .35 * k);
    x.save(); x.translate(W / 2, H * .15);
    for (let i = 0; i < 18; i++) { x.rotate(TAU / 18 + Math.sin(t * .2) * .002); x.fillStyle = `rgba(255,230,170,${.04 * k})`; x.fillRect(-S() * .02, 0, S() * .04, H); }
    x.restore();
  },
  sea(k, t, E) {
    for (let l = 0; l < 5; l++) {
      const y0 = H * (.72 + l * .06);
      x.fillStyle = `rgba(${20 + l * 10},${60 + l * 15},${110 + l * 20},${.25 * k})`; x.beginPath(); x.moveTo(0, H);
      for (let i = 0; i <= 60; i++) { const u = i / 60; x.lineTo(u * W, y0 + Math.sin(u * 10 + t * (1 + l * .3) + l) * (10 + E * 10)); }
      x.lineTo(W, H); x.fill();
    }
  },
  city(k, t, E) {
    const b = P('city', 34, () => [rnd(), .08 + rnd() * .28, .02 + rnd() * .04]);
    for (const [u, h, w] of b) {
      const bx = u * W, bh = h * H, by = H - bh;
      x.fillStyle = `rgba(6,7,12,${.92 * k})`; x.fillRect(bx, by, w * W, bh);
      for (let yy = by + 8; yy < H - 6; yy += 12) for (let xx = bx + 4; xx < bx + w * W - 4; xx += 9) {
        if ((Math.sin(xx * 12.9 + yy * 78.2) * 43758 % 1 + 1) % 1 > .72) { x.fillStyle = `rgba(255,210,130,${.6 * k * (.7 + E * .3)})`; x.fillRect(xx, yy, 3, 4); }
      }
    }
  },
  road(k, t) {
    const hz = H * .62;
    x.fillStyle = `rgba(10,10,14,${.7 * k})`; x.beginPath(); x.moveTo(W / 2 - 3, hz); x.lineTo(W / 2 + 3, hz); x.lineTo(W * .85, H); x.lineTo(W * .15, H); x.fill();
    for (let i = 0; i < 12; i++) { const z = (((i / 12) + IN.clock * .35) % 1) ** 2;
      x.fillStyle = `rgba(255,235,190,${k * (.2 + z * .6)})`; x.fillRect(W / 2 - 1 - z * 4, hz + z * (H - hz), 2 + z * 8, 2 + z * 26); }
    glow(W / 2 - S() * .12, H * .95, S() * .2, 'rgba(255,240,200,A)', .3 * k); glow(W / 2 + S() * .12, H * .95, S() * .2, 'rgba(255,240,200,A)', .3 * k);
  },
  love(k, t, E) {
    const beat = IN.beat, s = S() * (.012 + beat * .002);
    for (const d of P('hearts', 40, () => [rnd(), rnd(), rnd() * TAU, .5 + rnd()])) {
      const y = ((d[1] - t * .03 * d[3]) % 1 + 1) % 1 * H, xx = d[0] * W + Math.sin(t + d[2]) * 20, sc = s * d[3] * (1 + beat * .3);
      x.fillStyle = `rgba(255,${110 + d[3] * 40},${140 + d[3] * 30},${.55 * k})`; x.beginPath();
      for (let i = 0; i <= 30; i++) { const a = i / 30 * TAU, hx = 16 * Math.sin(a) ** 3, hy = -(13 * Math.cos(a) - 5 * Math.cos(2 * a) - 2 * Math.cos(3 * a) - Math.cos(4 * a));
        i ? x.lineTo(xx + hx * sc / 16, y + hy * sc / 16) : x.moveTo(xx + hx * sc / 16, y + hy * sc / 16); }
      x.fill();
    }
    glow(W / 2, H / 2, S() * .5, 'rgba(255,120,150,A)', .12 * k * (.5 + beat));
  },
  flowers(k, t) {
    for (const d of P('petal', 70, () => [rnd(), rnd(), rnd() * TAU, .5 + rnd()])) {
      const y = ((d[1] + t * .04 * d[3]) % 1) * H, xx = d[0] * W + Math.sin(t * .8 + d[2]) * 40;
      x.save(); x.translate(xx, y); x.rotate(t * d[3] + d[2]);
      x.fillStyle = `rgba(255,${170 + d[3] * 40},${200},${.7 * k})`; x.beginPath(); x.ellipse(0, 0, 6 * d[3], 3 * d[3], 0, 0, TAU); x.fill(); x.restore();
    }
  },
  fly(k, t) {
    x.strokeStyle = `rgba(243,236,223,${.75 * k})`; x.lineWidth = 1.4;
    for (const d of P('birds', 26, () => [rnd(), rnd() * .5 + .1, rnd() * TAU, .6 + rnd()])) {
      const xx = ((d[0] + t * .03 * d[3]) % 1.2 - .1) * W, y = d[1] * H + Math.sin(t + d[2]) * 12, w = 6 + 3 * Math.sin(t * 8 + d[2]);
      x.beginPath(); x.moveTo(xx - 8, y - w * .6); x.quadraticCurveTo(xx - 3, y, xx, y + 1); x.quadraticCurveTo(xx + 3, y, xx + 8, y - w * .6); x.stroke();
    }
  },
  time(k, t) {
    const cx = W / 2, cy = H * .45, r = S() * .36;
    x.strokeStyle = `rgba(243,236,223,${.18 * k})`; x.lineWidth = 1; x.beginPath(); x.arc(cx, cy, r, 0, TAU); x.stroke();
    for (let i = 0; i < 60; i++) { const a = i / 60 * TAU + t * .05, l = i % 5 ? .03 : .07;
      x.strokeStyle = `rgba(243,236,223,${(i % 5 ? .15 : .4) * k})`; x.beginPath(); x.moveTo(cx + Math.cos(a) * r, cy + Math.sin(a) * r); x.lineTo(cx + Math.cos(a) * r * (1 - l), cy + Math.sin(a) * r * (1 - l)); x.stroke(); }
    const a = IN.beatCount / 4 * TAU / 15 - Math.PI / 2;
    x.strokeStyle = `rgba(255,220,160,${.5 * k})`; x.lineWidth = 2; x.beginPath(); x.moveTo(cx, cy); x.lineTo(cx + Math.cos(a) * r * .9, cy + Math.sin(a) * r * .9); x.stroke();
  },
  heaven(k, t) {
    x.save(); x.translate(W / 2, -H * .1);
    for (let i = 0; i < 14; i++) { const a = -.5 + i / 13 + Math.sin(t * .3 + i) * .02; x.save(); x.rotate(a);
      const g = x.createLinearGradient(0, 0, 0, H * 1.2); g.addColorStop(0, `rgba(255,248,225,${.14 * k})`); g.addColorStop(1, 'rgba(255,248,225,0)');
      x.fillStyle = g; x.fillRect(-S() * .025, 0, S() * .05, H * 1.2); x.restore(); }
    x.restore();
  },
  death(k, t) {
    x.fillStyle = `rgba(20,20,24,${.25 * k})`; x.fillRect(0, 0, W, H);
    for (const d of P('ash', 120, () => [rnd(), rnd(), .3 + rnd(), rnd() * TAU])) {
      const y = ((d[1] + t * .03 * d[2]) % 1) * H, xx = d[0] * W + Math.sin(t * .7 + d[3]) * 30;
      x.fillStyle = `rgba(170,170,175,${.5 * k})`; x.fillRect(xx, y, 2, 1.5);
    }
  },
  tears(k, t) {
    for (const d of P('tear', 14, () => [.2 + rnd() * .6, rnd(), .5 + rnd()])) {
      const kk = (d[1] + t * .1 * d[2]) % 1, y = kk * H, xx = d[0] * W;
      x.fillStyle = `rgba(190,220,255,${.6 * k * (1 - kk * .5)})`; x.beginPath(); x.moveTo(xx, y - 10); x.quadraticCurveTo(xx + 5, y + 2, xx, y + 5); x.quadraticCurveTo(xx - 5, y + 2, xx, y - 10); x.fill();
    }
    x.fillStyle = `rgba(40,70,120,${.12 * k})`; x.fillRect(0, 0, W, H);
  },
  dream(k, t) {
    for (const d of P('bokeh', 30, () => [rnd(), rnd(), 20 + rnd() * 60, rnd() * TAU])) {
      glow(d[0] * W + Math.sin(t * .2 + d[3]) * 30, d[1] * H + Math.cos(t * .15 + d[3]) * 30, d[2], `hsla(${(d[3] * 60 + t * 5) % 360},70%,75%,A)`, .25 * k);
    }
  },
  gold(k, t, E) {
    for (const d of P('glint', 60, () => [rnd(), rnd(), rnd() * TAU])) {
      const tw = Math.max(0, Math.sin(t * 3 + d[2])) ** 8;
      if (tw < .05) continue;
      const xx = d[0] * W, y = d[1] * H, l = 4 + tw * 10;
      x.strokeStyle = `rgba(255,215,120,${tw * k})`; x.lineWidth = 1.2; x.beginPath(); x.moveTo(xx - l, y); x.lineTo(xx + l, y); x.moveTo(xx, y - l); x.lineTo(xx, y + l); x.stroke();
    }
  },
  home(k, t) {
    const hx = W * .8, hy = H * .9, s = S() * .06;
    x.fillStyle = `rgba(5,5,8,${.95 * k})`; x.fillRect(hx - s, hy - s * 1.2, s * 2, s * 1.2);
    x.beginPath(); x.moveTo(hx - s * 1.2, hy - s * 1.2); x.lineTo(hx, hy - s * 2.1); x.lineTo(hx + s * 1.2, hy - s * 1.2); x.fill();
    x.fillStyle = `rgba(255,200,120,${.9 * k})`; x.fillRect(hx - s * .35, hy - s * .8, s * .45, s * .4);
    glow(hx - s * .1, hy - s * .6, s * 3, 'rgba(255,190,110,A)', .45 * k);
  },
  thunder(k, t) {
    const beatHit = IN.beatHit && IN.beatCount % 8 === 0;
    if (beatHit) IN.bolt = { life: 1, x: W * (.2 + Math.random() * .6), seed: Math.random() * 1e3 };
    const b = IN.bolt; if (!b || b.life <= 0) return;
    x.fillStyle = `rgba(220,230,255,${.25 * b.life * k})`; x.fillRect(0, 0, W, H);
    x.strokeStyle = `rgba(240,245,255,${b.life * k})`; x.lineWidth = 2; x.beginPath();
    let px = b.x, py = 0; x.moveTo(px, py);
    for (let i = 1; i < 12; i++) { px += Math.sin(b.seed + i * 7.1) * 40; py = i / 11 * H * .7; x.lineTo(px, py); }
    x.stroke(); b.life -= .06;
  },
  dance(k, t, E) {
    const beat = IN.beat;
    for (let i = 0; i < 6; i++) { const a = t * .6 + i * TAU / 6;
      const g = x.createLinearGradient(W / 2, 0, W / 2 + Math.cos(a) * W, H);
      g.addColorStop(0, C(i, .18 * k * (.4 + beat))); g.addColorStop(1, C(i, 0));
      x.fillStyle = g; x.beginPath(); x.moveTo(W / 2, 0); x.lineTo(W / 2 + Math.cos(a) * W - 60, H); x.lineTo(W / 2 + Math.cos(a) * W + 60, H); x.fill(); }
  },
  eyes(k, t) {
    const cx = W / 2, cy = H * .3, w = S() * .12, h = w * .45 * (Math.sin(t * .5) > .97 ? .1 : 1);
    x.strokeStyle = `rgba(243,236,223,${.4 * k})`; x.lineWidth = 1.5; x.beginPath();
    x.moveTo(cx - w, cy); x.quadraticCurveTo(cx, cy - h * 2, cx + w, cy); x.quadraticCurveTo(cx, cy + h * 2, cx - w, cy); x.stroke();
    glow(cx, cy, w * .5, CA(1, 20), .6 * k); x.fillStyle = `rgba(0,0,0,${.8 * k})`; x.beginPath(); x.arc(cx, cy, w * .15, 0, TAU); x.fill();
  },
  dark(k) {
    const g = x.createRadialGradient(W / 2, H / 2, S() * .15, W / 2, H / 2, Math.max(W, H) * .7);
    g.addColorStop(0, 'rgba(0,0,0,0)'); g.addColorStop(1, `rgba(0,0,8,${.55 * k})`); x.fillStyle = g; x.fillRect(0, 0, W, H);
  },
  light(k, t, E) { glow(W / 2, H * .45, S() * (.6 + E * .2), 'rgba(255,245,220,A)', .22 * k); },
};

// ---------- la letra en pantalla (letra por letra, como Taxi Cab) ----------
function showProcLine(i) {
  for (const el of lyr.querySelectorAll('.line:not(.out)')) { el.classList.add('out'); setTimeout(() => el.remove(), 1000); }
  IN.shown = i;
  if (i < 0 || !IN.show) return;
  const l = IN.lines[i], next = IN.lines[i + 1], dur = next ? next.t - l.t : 4;
  const el = document.createElement('div'); el.className = 'line';
  const per = clamp(dur * .45 / Math.max(1, l.text.length), .015, .06);
  let n = 0;
  l.text.split(' ').forEach((word, wi) => {
    if (wi) el.appendChild(document.createTextNode(' '));
    const w = document.createElement('span');
    w.className = 'w' + (LEX.some(([, re]) => re.test(word)) ? ' key' : '');
    for (const c of word) { const s = document.createElement('span'); s.className = 'ch'; s.textContent = c; s.style.animationDelay = (n++ * per) + 's'; w.appendChild(s); }
    n++; el.appendChild(w);
  });
  lyr.appendChild(el);
}

// ---------- el cuadro procedural completo ----------
function procFrame(t, dt) {
  if (!ext.active()) T += dt;
  const time = ext.active() ? ext.now() : T;

  // tempo: pulso en fase con la canción
  const bt = (time - IN.phase) / IN.period, bi = Math.floor(bt);
  IN.beat = Math.pow(1 - (bt - bi), 4); IN.beatHit = bi !== IN.lastBeat; IN.beatCount = bi; IN.lastBeat = bi;
  if (window.AUD?.live) { IN.beat = AUD.pulse; IN.beatHit = AUD.hit; AUD.hit = false; }     // con sonido real, el pulso es el golpe de verdad
  const arousal = .5 + IN.mood.a * .4;
  const E = window.AUD?.live ? .08 + AUD.level * .7 + IN.beat * .25 : micOn ? Math.max(energy, IN.beat * .5) : .12 + IN.beat * (.35 + arousal * .3);
  IN.clock += dt * (IN.bpm / 110) * (paused ? 0 : 1);

  // sección: por bloques de la letra si hay, si no por compases
  let sec, p;
  if (IN.cuts.length > 1) {
    sec = Math.max(0, IN.cuts.findLastIndex(c => c <= time));
    const a = IN.cuts[sec], b = IN.cuts[sec + 1] ?? a + proc.secLen * 2;
    p = clamp((time - a) / (b - a));
  } else { sec = Math.floor(time / proc.secLen); p = (time % proc.secLen) / proc.secLen; }
  const gen = GENS[IN.blockGen?.[sec] ?? proc.order[sec % (proc.order.length || 1)]] || GENS[0];   // nunca sin escena
  const pk = sec + ':' + gen.name;                 // si la letra cambia el escenario de un bloque, sus parámetros también
  if (!proc.params[pk]) proc.params[pk] = gen.make(mulberry(proc.seed + sec * 7919));
  if (sec !== proc.lastSec) { proc.lastSec = sec; for (const k in proc.params) if (parseInt(k) < sec - 1) delete proc.params[k]; if (!IN.concepts.length) setTag((ROMAN[sec] || sec + 1) + ' · ' + gen.name); }

  const drawGen = () => gen.draw(p, IN.clock, dt * IN.bpm / 110, proc.params[pk], E);
  window.CAM ? CAM.layer(.3, drawGen) : drawGen();          // el escenario es el fondo: se mueve poco

  // la letra: mostrar e interpretar
  if (IN.synced) {
    let li = -1;
    const lt = time + .2 + (IN.off || 0);            // la línea entra un poco antes, como en las apps de letras
    for (let i = 0; i < IN.lines.length; i++) if (IN.lines[i].t <= lt) li = i; else break;
    if (li >= 0 && (!IN.lines[li].text || lt - IN.lines[li].t > 12)) li = -1;
    if (li !== IN.shown) {
      showProcLine(li);
      if (li >= 0) { const f = interpret(IN.lines[li].text); if (f.length) setTag(f.join(' · ')); }
    }
  }

  // capas imaginadas: suben al aparecer el concepto y se apagan solas
  IN.mood.v = lerp(IN.mood.v, IN.mood.tv, .01); IN.mood.a = lerp(IN.mood.a, IN.mood.ta, .01);
  IN.mood.tv *= .9995; IN.mood.ta *= .9995;
  for (const id in IN.motifs) {
    const m = IN.motifs[id]; m.hold -= dt; if (m.hold <= 0) m.target = 0;
    m.k = lerp(m.k, m.target, m.target ? .05 : .02);
    if (m.k < .01 && !m.target) { delete IN.motifs[id]; continue; }
    window.CAM ? CAM.draw(id, () => MOTIF[id]?.(m.k, IN.clock, E)) : MOTIF[id]?.(m.k, IN.clock, E);
  }

  // color del ánimo: cálido si es feliz, frío si es triste
  const v = IN.mood.v;
  if (Math.abs(v) > .03) { x.fillStyle = v > 0 ? `rgba(255,170,90,${v * .1})` : `rgba(60,90,170,${-v * .14})`; x.fillRect(0, 0, W, H); }
  // latido del fondo con el BPM
  glow(W / 2, H * .5, S() * (.55 + IN.beat * .12), CA(0, 10), IN.beat * (.06 + arousal * .08));
  IN.flash *= .93; if (IN.flash > .02) glow(W / 2, H * .45, S() * .8, CA(1, 25), IN.flash * .15);

  const local = IN.cuts.length > 1 ? time - (IN.cuts[sec] || 0) : time % proc.secLen;
  const fade = window.TRANS ? 0 : Math.max(1 - local / .5, 0);   // las transiciones de moments.js reemplazan el fundido a negro
  if (fade > 0 && gen.name !== 'corriente') { x.fillStyle = `rgba(0,0,0,${fade * .85})`; x.fillRect(0, 0, W, H); }
  if (proc.dur && time > proc.dur - 4) { x.fillStyle = `rgba(255,246,228,${seg(time, proc.dur - 4, proc.dur)})`; x.fillRect(0, 0, W, H); }
  bar.style.width = proc.dur ? (time / proc.dur * 100) + '%' : '0';
  hudTick(time, proc.dur);
}
let tagTimer = 0;
function setTag(txt) {
  if (txt === IN.lastConcept) return; IN.lastConcept = txt;
  tag.style.opacity = 0; clearTimeout(tagTimer);
  tagTimer = setTimeout(() => { tag.textContent = txt; tag.style.opacity = 1; }, 500);
}

// al empezar una canción: buscar letra y tempo
const _startProc = startProc;
startProc = function () { _startProc(); IN.lastConcept = ''; loadSongMeta(); };
$('proc').onclick = startProc;

// l: mostrar u ocultar la letra
addEventListener('keydown', e => {
  if (e.key !== 'l' || mode !== 'proc' || /TEXTAREA|INPUT/.test(document.activeElement?.tagName || '')) return;
  IN.show = !IN.show; try { localStorage.setItem('tc_showlyr', IN.show ? '1' : '0'); } catch (err) {}
  if (!IN.show) showProcLine(-1); else IN.shown = -2;
});

// estado de letra y tempo en el panel
const _ui = ui;
ui = function () {
  _ui();
  if (mode === 'proc' || (ext.has() && !isTaxi(ext.st.name, ext.st.artist))) {
    const extra = [IN.lyrState, IN.bpm ? Math.round(IN.bpm) + ' bpm' : ''].filter(Boolean).join(' · ');
    if (extra && ext.has()) $('nowSub').textContent = (ext.st.src === 'spotify' ? 'Spotify · ' : 'Música · ') + ext.st.artist + ' · ' + extra;
  }
};

// ---------- controles de Música en la capa (sin volumen) ----------
function hudTick(time, dur) {
  if (dur) $('hudFill').style.width = clamp(time / dur) * 100 + '%';
}
for (const id of ['hudCtl', 'nowCtl']) $(id).addEventListener('click', e => {
  const b = e.target.closest('button'); if (!b) return;
  if (b.hasAttribute('data-cover')) return toggleCover(true);
  if (!b.dataset.c) return;
  ext.cmd(b.dataset.c); wake();
});
for (const id of ['hudBar', 'nowBar']) $(id).addEventListener('click', e => {
  if (!ext.has()) return;
  const r = e.currentTarget.getBoundingClientRect();
  ext.cmd('goto:' + (clamp((e.clientX - r.left) / r.width) * ext.st.dur).toFixed(2));
});
const PLAY = 'M8 5v14l11-7z', PAUSE = 'M7 5h4v14H7zM13 5h4v14h-4z';
const _ui2 = ui;
ui = function () {
  _ui2();
  $('hudCtl').classList.toggle('off', !ext.has());
  $('nowCtl').style.display = ext.has() ? '' : 'none';
  for (const svg of document.querySelectorAll('svg.pp')) svg.innerHTML = `<path d="${ext.st.state === 'playing' ? PAUSE : PLAY}"/>`;
  if (mode === 'play' && ext.has()) hudTick(ext.now(), ext.st.dur);
  if (coverOpen) fillCover();
};

// ---------- carátula a pantalla completa ----------
let coverOpen = false;
function fillCover() {
  const url = ext.artUrl;
  $('coverImg').src = url || ''; $('coverImg').style.display = url ? 'block' : 'none';
  $('coverBg').style.backgroundImage = url ? `url(${url})` : 'none';
  const feat = (ext.st.name || '').match(/\s*[(\[](?:feat\.?|ft\.?|with)\s+([^)\]]+)[)\]]/i);
  $('coverTitle').textContent = (ext.st.name || proc.title || 'taxi cab').replace(feat ? feat[0] : '', '').trim();
  $('coverSub').textContent = [ext.st.artist.split(/,|&/)[0].trim(), feat && 'con ' + feat[1].trim(), ext.st.album].filter(Boolean).join(' · ');
}
function toggleCover(on = !coverOpen) {
  if (on && !ext.artUrl) return;
  coverOpen = on; fillCover(); $('cover').classList.toggle('show', on);
}
$('hudArtBtn').addEventListener('click', () => toggleCover(true));
$('cover').addEventListener('click', () => toggleCover(false));
addEventListener('keydown', e => {
  if (/TEXTAREA|INPUT/.test(document.activeElement?.tagName || '')) return;
  if (e.key === 'Escape' && coverOpen) { toggleCover(false); e.stopImmediatePropagation(); return; }
  if (e.key === 'c' && mode !== 'panel') toggleCover();
}, true);

// ---------- desfase de la letra por canción: [ atrasa, ] adelanta (0,2 s) ----------
function offKey() { return 'tc_off:' + ext.key(); }
function loadOff() { try { IN.off = parseFloat(localStorage.getItem(offKey())) || 0; } catch (e) { IN.off = 0; } }
addEventListener('keydown', e => {
  if (mode !== 'proc' || !'[]'.includes(e.key) || /TEXTAREA|INPUT/.test(document.activeElement?.tagName || '')) return;
  IN.off = Math.round(((IN.off || 0) + (e.key === ']' ? .2 : -.2)) * 10) / 10;
  try { localStorage.setItem(offKey(), IN.off); } catch (err) {}
  IN.shown = -2;
  setTag('letra ' + (IN.off > 0 ? '+' : '') + IN.off.toFixed(1) + ' s');
});
const _loadSongMeta3 = loadSongMeta;
loadSongMeta = async function () { loadOff(); return _loadSongMeta3(); };
