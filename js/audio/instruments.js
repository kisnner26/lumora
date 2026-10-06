// ============================================================
// instruments.js — los instrumentos que suenan, tocándose.
// Con audio del sistema: SoundAnalysis (en la Mac) dice qué suena.
// Sin él: aparecen cuando la letra los nombra. Dibujos originales,
// animados con el golpe real, el tempo y el volumen.
// ============================================================

const KIND_OF = {
  piano: 'piano', electric_piano: 'piano', keyboard_musical: 'piano', harpsichord: 'piano', organ: 'piano', marimba_xylophone: 'piano', accordion: 'piano',
  synthesizer: 'synth',
  guitar: 'guitar', acoustic_guitar: 'guitar', guitar_strum: 'guitar', plucked_string_instrument: 'guitar', ukulele: 'guitar', banjo: 'guitar', mandolin: 'guitar', steel_guitar_slide_guitar: 'guitar',
  electric_guitar: 'eguitar', bass_guitar: 'bass', double_bass: 'bass',
  violin_fiddle: 'violin', bowed_string_instrument: 'violin', orchestra: 'violin', cello: 'cello', harp: 'harp',
  drum: 'drums', drum_kit: 'drums', snare_drum: 'drums', bass_drum: 'drums', cymbal: 'drums', hi_hat: 'drums', tambourine: 'drums',
  saxophone: 'sax', clarinet: 'sax', bassoon: 'sax', trumpet: 'trumpet', trombone: 'trumpet', french_horn: 'trumpet', brass_instrument: 'trumpet',
  flute: 'flute', harmonica: 'flute',
};
const INST = { score: {}, lyric: '', lyricUntil: 0, shown: {}, last: 0 };

// ---------- lo que dice el audio ----------
INST.feed = list => {
  INST.last = performance.now();
  for (const k in INST.score) INST.score[k] *= .7;
  for (const [label, conf] of list) { const k = KIND_OF[label]; if (k) INST.score[k] = Math.max(INST.score[k] || 0, conf); }
};
// ---------- lo que dice la letra ----------
const INST_WORDS = [
  ['piano', /\b(piano\w*|keys|teclas)\b/i], ['guitar', /\b(guitar\w*|guitarra\w*|ukulele|requinto)\b/i], ['violin', /\b(violin\w*|viol[ií]n\w*|fiddle|strings|cuerdas)\b/i],
  ['cello', /\b(cello|chelo|violonchelo)\b/i], ['drums', /\b(drums?|drummer|bater[ií]a|tambor\w*|bombo|tumbadora|conga\w*|bong[oó]\w*)\b/i],
  ['sax', /\b(sax\w*|saxof[oó]n\w*|clarinet\w*|clarinete\w*)\b/i], ['trumpet', /\b(trumpet\w*|trompeta\w*|horns|trombón|trombone)\b/i],
  ['bass', /\b(bassline|bajista|contrabajo)\b/i], ['synth', /\b(synth\w*|sintetizador\w*)\b/i], ['harp', /\b(harp\w*|arpa\w*)\b/i], ['flute', /\b(flute\w*|flauta\w*|harmonica|arm[oó]nica)\b/i],
];
LEX.push(['instrument', new RegExp(INST_WORDS.map(w => w[1].source).join('|'), 'i'), 'instrumento']);
const _interpretI = interpret;
interpret = function (text) {
  const f = _interpretI(text);
  const w = INST_WORDS.find(([, re]) => re.test(text)); if (w) { INST.lyric = w[0]; INST.lyricUntil = performance.now() + 12000; }
  return f;
};

function activeInstruments() {
  const live = performance.now() - INST.last < 3000, out = [];
  if (live) {
    const ranked = Object.entries(INST.score).filter(([, v]) => v > .3).sort((a, b) => b[1] - a[1]).map(e => e[0]);
    const lead = ranked.find(k => k !== 'drums'); if (lead) out.push(lead);
    if (ranked.includes('drums')) out.push('drums');
  }
  if (!out.length && performance.now() < INST.lyricUntil) out.push(INST.lyric);
  return out;
}

// ---------- utilidades de dibujo ----------
const wood = (y0, y1, k) => { const g = x.createLinearGradient(0, y0, 0, y1); g.addColorStop(0, `rgba(170,90,40,${k})`); g.addColorStop(1, `rgba(90,40,15,${k})`); return g; };
const lvl = () => (window.AUD?.live ? AUD.level : .45 + (IN.beat || 0) * .3);
function strings(x0, y0, x1, y1, n, spread, amp, t, k, col = '230,225,210') {
  const dx = x1 - x0, dy = y1 - y0, len = Math.hypot(dx, dy), nx = -dy / len, ny = dx / len;
  for (let i = 0; i < n; i++) { const o = (i - (n - 1) / 2) * spread; x.strokeStyle = `rgba(${col},${.8 * k})`; x.lineWidth = 1 + (n - i) * .12; x.beginPath();
    for (let s = 0; s <= 24; s++) { const u = s / 24, v = Math.sin(u * Math.PI) * Math.sin(t * 60 + i * 2) * amp;
      const px = x0 + dx * u + nx * (o + v), py = y0 + dy * u + ny * (o + v); s ? x.lineTo(px, py) : x.moveTo(px, py); } x.stroke(); }
}
function bodyPath(cx, cy, s, waist) {                              // cuerpo de "8" para violín/guitarra
  x.beginPath(); x.moveTo(cx, cy - s);
  x.bezierCurveTo(cx + s * .55, cy - s, cx + s * .6, cy - s * .35, cx + s * waist, cy - s * .1);
  x.bezierCurveTo(cx + s * .75, cy + s * .2, cx + s * .7, cy + s, cx, cy + s);
  x.bezierCurveTo(cx - s * .7, cy + s, cx - s * .75, cy + s * .2, cx - s * waist, cy - s * .1);
  x.bezierCurveTo(cx - s * .6, cy - s * .35, cx - s * .55, cy - s, cx, cy - s); x.closePath();
}

// ---------- los instrumentos ----------
const DRAW_I = {
  piano(cx, cy, s, k, t) {
    const n = 21, kw = s * 2.4 / n, x0 = cx - s * 1.2, ky = cy - s * .1, kh = s * .75;
    const sub = Math.floor((IN.clock || 0) * 4), pressed = new Set([(sub * 7) % n, (sub * 3 + 4) % n, (IN.beatCount * 5) % n]);
    x.fillStyle = `rgba(12,10,14,${.95 * k})`; x.beginPath(); x.roundRect(x0 - 12, ky - 18, s * 2.4 + 24, kh + 30, 8); x.fill();
    for (let i = 0; i < n; i++) { const on = pressed.has(i);
      if (on) { const g = x.createLinearGradient(0, ky - s * .9, 0, ky); g.addColorStop(0, C(i, 0)); g.addColorStop(1, C(i, .45 * k, 20)); x.fillStyle = g; x.fillRect(x0 + i * kw + 2, ky - s * .9, kw - 4, s * .9); }
      x.fillStyle = on ? `rgba(255,236,200,${k})` : `rgba(242,238,230,${k})`; x.fillRect(x0 + i * kw + 1, ky + (on ? 3 : 0), kw - 2, kh); }
    for (let i = 0; i < n - 1; i++) { if ([2, 6].includes(i % 7)) continue; x.fillStyle = `rgba(14,12,16,${k})`; x.fillRect(x0 + (i + 1) * kw - kw * .3, ky, kw * .6, kh * .6); }
  },
  violin(cx, cy, s, k, t, big) {
    x.save(); x.translate(cx, cy); x.rotate(big ? 0 : -.5);
    bodyPath(0, 0, s * .55, .32); x.fillStyle = wood(-s * .55, s * .55, k); x.fill();
    x.strokeStyle = `rgba(40,15,5,${k})`; x.lineWidth = 2; x.stroke();
    x.fillStyle = `rgba(10,6,4,${k})`; x.fillRect(-s * .05, -s * 1.25, s * .1, s * 1.1);
    x.beginPath(); x.arc(0, -s * 1.3, s * .07, 0, TAU); x.fill();
    for (const sd of [-1, 1]) { x.strokeStyle = `rgba(20,8,3,${k})`; x.lineWidth = 2; x.beginPath(); x.moveTo(sd * s * .14, -s * .08); x.bezierCurveTo(sd * s * .2, 0, sd * s * .08, s * .1, sd * s * .15, s * .2); x.stroke(); }
    strings(0, -s * 1.2, 0, s * .4, 4, s * .025, s * .01 * lvl(), t, k);
    const bow = Math.sin((IN.clock || 0) * Math.PI * (IN.bpm || 100) / 120) * s * .45;          // el arco va y viene al tempo
    x.strokeStyle = `rgba(60,30,15,${k})`; x.lineWidth = 4; x.beginPath(); x.moveTo(-s * .9 + bow, s * .05); x.lineTo(s * .9 + bow, -s * .15); x.stroke();
    x.strokeStyle = `rgba(245,240,225,${.85 * k})`; x.lineWidth = 1.5; x.beginPath(); x.moveTo(-s * .9 + bow, s * .1); x.lineTo(s * .9 + bow, -s * .1); x.stroke();
    if (big) { x.strokeStyle = `rgba(150,150,160,${k})`; x.lineWidth = 3; x.beginPath(); x.moveTo(0, s * .55); x.lineTo(0, s * .85); x.stroke(); }
    x.restore();
  },
  cello(cx, cy, s, k, t) { DRAW_I.violin(cx, cy - s * .2, s * 1.35, k, t, true); },
  guitar(cx, cy, s, k, t, electric) {
    x.save(); x.translate(cx, cy); x.rotate(-.35);
    if (electric) { glow(0, 0, s * 1.4, CA(0, 10), .3 * k * (.5 + lvl()));
      x.fillStyle = C(0, k, -15); x.beginPath(); x.moveTo(-s * .5, -s * .3); x.quadraticCurveTo(-s * .55, -s * .75, -s * .2, -s * .55); x.quadraticCurveTo(0, -s * .45, s * .25, -s * .7);
      x.quadraticCurveTo(s * .6, -s * .4, s * .45, 0); x.quadraticCurveTo(s * .6, s * .6, 0, s * .6); x.quadraticCurveTo(-s * .65, s * .6, -s * .5, -s * .3); x.fill();
      for (const py of [-s * .15, s * .12]) { x.fillStyle = `rgba(20,20,24,${k})`; x.fillRect(-s * .2, py, s * .4, s * .08); } }
    else { bodyPath(0, 0, s * .6, .38); x.fillStyle = wood(-s * .6, s * .6, k); x.fill(); x.fillStyle = `rgba(15,8,4,${k})`; x.beginPath(); x.arc(0, -s * .12, s * .16, 0, TAU); x.fill(); }
    x.fillStyle = `rgba(35,20,12,${k})`; x.fillRect(-s * .06, -s * 1.7, s * .12, s * 1.3); x.fillRect(-s * .09, -s * 1.9, s * .18, s * .22);
    const hit = IN.beatHit ? 1 : 0; INST.strum = Math.max(hit, (INST.strum || 0) * .9);
    strings(0, -s * 1.85, 0, s * .35, electric ? 6 : 6, s * .022, s * .02 * INST.strum * (.5 + lvl()), t, k);
    if (INST.strum > .5) { x.strokeStyle = `rgba(255,240,200,${INST.strum * .6 * k})`; x.lineWidth = 3; x.beginPath(); x.moveTo(-s * .18, s * .05 - INST.strum * 20); x.lineTo(s * .18, s * .05 - INST.strum * 20); x.stroke(); }
    x.restore();
  },
  eguitar(cx, cy, s, k, t) { DRAW_I.guitar(cx, cy, s, k, t, true); },
  bass(cx, cy, s, k, t) {
    x.save(); x.translate(cx, cy); x.rotate(-.3);
    x.fillStyle = C(1, k, -20); x.beginPath(); x.ellipse(0, 0, s * .45, s * .6, 0, 0, TAU); x.fill();
    x.fillStyle = `rgba(30,20,14,${k})`; x.fillRect(-s * .06, -s * 2, s * .12, s * 1.7);
    const low = window.AUD?.live ? AUD.pulse : IN.beat || 0;
    strings(0, -s * 1.95, 0, s * .35, 4, s * .035, s * .035 * low, t * .6, k);
    x.restore();
  },
  drums(cx, cy, s, k, t) {
    const kick = window.AUD?.live ? AUD.pulse : IN.beat || 0, high = (IN.beatCount % 2 ? .6 : 0) * (1 - kick * .5);
    x.save(); x.translate(cx, cy);
    for (const [dx, dy, r, c] of [[-s * .75, -s * .55, s * .45, high], [s * .8, -s * .6, s * .5, kick * .6]]) {       // platillos
      x.fillStyle = `rgba(${200 + c * 55},${170 + c * 60},${80 + c * 60},${k})`; x.beginPath(); x.ellipse(dx, dy - c * 4, r, r * .18, -.1, 0, TAU); x.fill();
      if (c > .3) glow(dx, dy, r * 1.4, 'rgba(255,240,180,A)', c * .5 * k);
      x.strokeStyle = `rgba(150,150,160,${k})`; x.lineWidth = 2; x.beginPath(); x.moveTo(dx, dy); x.lineTo(dx, s * .8); x.stroke(); }
    for (const [dx, dy, r] of [[-s * .35, -s * .05, s * .28], [s * .4, -s * .1, s * .3]]) { x.fillStyle = `rgba(230,225,215,${k})`; x.beginPath(); x.ellipse(dx, dy, r, r * .3, 0, 0, TAU); x.fill();
      x.fillStyle = C(0, k, -20); x.fillRect(dx - r, dy, r * 2, r * .5); }
    const ks = s * .5 * (1 + kick * .06);                                                            // bombo
    x.fillStyle = C(0, k, -25); x.beginPath(); x.arc(0, s * .45, ks, 0, TAU); x.fill();
    x.fillStyle = `rgba(235,230,220,${k})`; x.beginPath(); x.arc(0, s * .45, ks * .82, 0, TAU); x.fill();
    if (kick > .5) glow(0, s * .45, ks * 1.6, CA(1, 20), kick * .45 * k);
    x.restore();
  },
  sax(cx, cy, s, k, t, trumpet) {
    x.save(); x.translate(cx, cy);
    const g = x.createLinearGradient(-s, -s, s, s); g.addColorStop(0, `rgba(255,220,120,${k})`); g.addColorStop(1, `rgba(170,110,30,${k})`);
    x.strokeStyle = g; x.lineCap = 'round';
    if (trumpet) {
      x.lineWidth = s * .08; x.beginPath(); x.moveTo(-s, 0); x.lineTo(s * .6, 0); x.stroke();
      x.beginPath(); x.moveTo(-s * .4, 0); x.quadraticCurveTo(-s * .4, s * .3, 0, s * .3); x.quadraticCurveTo(s * .4, s * .3, s * .4, 0); x.stroke();
      x.fillStyle = g; x.beginPath(); x.moveTo(s * .55, -s * .06); x.lineTo(s * 1.05, -s * .3); x.lineTo(s * 1.05, s * .3); x.lineTo(s * .55, s * .06); x.fill();
      for (let i = 0; i < 3; i++) { const down = (IN.beatCount + i) % 3 === 0 ? s * .05 : 0; x.fillStyle = `rgba(240,220,170,${k})`; x.fillRect(-s * .15 + i * s * .15, -s * .28 + down, s * .06, s * .22); }
    } else {
      x.lineWidth = s * .14; x.beginPath(); x.moveTo(-s * .2, -s * 1.1); x.lineTo(-s * .05, s * .4); x.quadraticCurveTo(0, s * .8, s * .35, s * .6); x.lineTo(s * .45, s * .1); x.stroke();
      x.fillStyle = g; x.beginPath(); x.ellipse(s * .47, s * .02, s * .22, s * .09, -.3, 0, TAU); x.fill();
      for (let i = 0; i < 6; i++) { const on = (IN.beatCount + i) % 4 === 0; x.fillStyle = on ? `rgba(255,250,230,${k})` : `rgba(120,80,20,${k})`; x.beginPath(); x.arc(-s * .15 + i * s * .025, -s * .7 + i * s * .2, s * .035, 0, TAU); x.fill(); }
    }
    for (const d of P('notes' + (trumpet ? 't' : 's'), 10, () => [rnd(), rnd()])) {                   // notas que salen del pabellón
      const kk = ((IN.clock || 0) * .3 + d[0]) % 1, nx = (trumpet ? s * 1.1 : s * .5) + kk * s * 1.2, ny = (trumpet ? 0 : -s * .1) - kk * s * .9 + Math.sin(kk * 9 + d[1] * 5) * 10;
      x.fillStyle = C(Math.floor(d[1] * 3), (1 - kk) * .8 * k, 25); x.beginPath(); x.ellipse(nx, ny, 5, 4, -.4, 0, TAU); x.fill(); x.fillRect(nx + 4, ny - 16, 1.5, 16); }
    x.restore();
  },
  trumpet(cx, cy, s, k, t) { DRAW_I.sax(cx, cy, s, k, t, true); },
  synth(cx, cy, s, k, t) {
    DRAW_I.piano(cx, cy + s * .25, s * .8, k, t);
    x.fillStyle = `rgba(18,18,24,${.95 * k})`; x.beginPath(); x.roundRect(cx - s, cy - s * .55, s * 2, s * .5, 8); x.fill();
    for (let i = 0; i < 6; i++) { const a = -Math.PI * .75 + (Math.sin((IN.clock || 0) * .5 + i) * .5 + .5) * Math.PI * 1.5;
      x.strokeStyle = `rgba(230,230,240,${k})`; x.lineWidth = 2; x.beginPath(); x.arc(cx - s * .8 + i * s * .14, cy - s * .38, s * .045, 0, TAU); x.stroke();
      x.beginPath(); x.moveTo(cx - s * .8 + i * s * .14, cy - s * .38); x.lineTo(cx - s * .8 + i * s * .14 + Math.cos(a) * s * .04, cy - s * .38 + Math.sin(a) * s * .04); x.stroke(); }
    x.strokeStyle = C(0, k, 25); x.lineWidth = 2; x.beginPath();
    for (let i = 0; i <= 60; i++) { const u = i / 60, px = cx + s * .05 + u * s * .85, py = cy - s * .3 + Math.sin(u * 20 + (IN.clock || 0) * 6) * s * .08 * lvl(); i ? x.lineTo(px, py) : x.moveTo(px, py); } x.stroke();
  },
  harp(cx, cy, s, k, t) {
    x.save(); x.translate(cx, cy);
    x.strokeStyle = `rgba(200,150,70,${k})`; x.lineWidth = s * .08; x.lineCap = 'round';
    x.beginPath(); x.moveTo(-s * .5, s); x.lineTo(-s * .45, -s); x.quadraticCurveTo(s * .2, -s * 1.2, s * .5, -s * .6); x.lineTo(-s * .4, s * .95); x.stroke();
    for (let i = 0; i < 12; i++) { const u = (i + 1) / 13, x0 = -s * .45 + u * s * .1, y0 = -s * (1 - u * .3), x1 = -s * .45 + u * s * .85, y1 = s * (.95 - u * 1.4) * .95;
      const pl = (IN.beatCount + i) % 12 === 0 ? (IN.beat || 0) : 0, v = Math.sin(t * 70 + i) * pl * 5;
      x.strokeStyle = `rgba(245,235,215,${(.5 + pl * .5) * k})`; x.lineWidth = 1.2; x.beginPath(); x.moveTo(x0, y0); x.quadraticCurveTo((x0 + x1) / 2 + v, (y0 + y1) / 2, x1, y1); x.stroke(); }
    x.restore();
  },
  flute(cx, cy, s, k, t) {
    x.save(); x.translate(cx, cy); x.rotate(-.2);
    const g = x.createLinearGradient(0, -s * .05, 0, s * .05); g.addColorStop(0, `rgba(235,235,245,${k})`); g.addColorStop(1, `rgba(140,140,160,${k})`);
    x.fillStyle = g; x.beginPath(); x.roundRect(-s * 1.2, -s * .05, s * 2.4, s * .1, s * .05); x.fill();
    for (let i = 0; i < 7; i++) { const on = (IN.beatCount + i) % 5 < 2; x.fillStyle = on ? `rgba(40,40,50,${k})` : `rgba(90,90,110,${k})`; x.beginPath(); x.arc(-s * .5 + i * s * .2, 0, s * .03, 0, TAU); x.fill(); }
    for (let i = 0; i < 16; i++) { const kk = ((IN.clock || 0) * .5 + i / 16) % 1; x.fillStyle = `rgba(230,240,255,${(1 - kk) * .5 * k})`;
      x.beginPath(); x.arc(-s * 1.2 - kk * s * .6, -kk * s * .4 + Math.sin(kk * 10 + i) * 6, 2 + kk * 3, 0, TAU); x.fill(); }
    x.restore();
  },
};

// ---------- entran y salen suavemente, en primer plano ----------
const _procFrameI = procFrame;
procFrame = function (t, dt) {
  _procFrameI(t, dt);
  if (!proc.dur) return;
  const act = activeInstruments();
  for (const k of Object.keys(DRAW_I)) { const target = act.includes(k) ? 1 : 0; INST.shown[k] = lerp(INST.shown[k] || 0, target, target ? .05 : .03); }
  const spots = { lead: [W * .8, H * .66], drums: [W * .2, H * .72] };
  for (const [k, a] of Object.entries(INST.shown)) {
    if (a < .02) continue;
    const [cx, cy] = k === 'drums' ? spots.drums : spots.lead, s = S() * (k === 'piano' || k === 'synth' ? .2 : .17);
    CAM.layer(1, () => DRAW_I[k](cx, cy + (1 - a) * 40, s, a * .95, t));
  }
};
