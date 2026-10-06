// ============================================================
// variety.js — millones de combinaciones.
// Cada sección de cada canción elige, con una semilla propia:
//   transición (17 tipos con parámetros) × gradación de color (8)
//   × simetría (5) × 1–2 sistemas de partículas (14, parametrizados)
//   × giro de cámara. La misma canción siempre se ve igual en el
//   mismo punto; dos canciones nunca se parecen.
// ============================================================

const secRng = (sec, salt) => mulberry(hashStr(ext.key() + '|' + (window.SESSION || '') + '|' + sec + '|' + salt));
const pick = (r, arr) => arr[Math.floor(r() * arr.length)];
const VBUF = {};                                          // lienzos auxiliares (fuera de la tabla de transiciones)

// ---------- 17 transiciones ----------
const TR = {
  fade(e, s, w, h) { x.globalAlpha = 1 - e; x.drawImage(s, 0, 0); },
  zoom(e, s, w, h) { const k = 1 + e * .7; x.globalAlpha = 1 - e; x.drawImage(s, w / 2 - w * k / 2, h / 2 - h * k / 2, w * k, h * k); },
  zoomOut(e, s, w, h, P) { const k = 1 - e * .9; x.globalAlpha = 1 - e * .6; x.translate(w / 2, h / 2); x.rotate(e * P.spin); x.drawImage(s, -w * k / 2, -h * k / 2, w * k, h * k); },
  wipe(e, s, w, h, P) { const edge = e * (w + h); x.beginPath();
    if (P.dir) { x.moveTo(w - edge, 0); x.lineTo(-h, 0); x.lineTo(-h, h); x.lineTo(w - edge + h, h); } else { x.moveTo(edge, 0); x.lineTo(w + h, 0); x.lineTo(w + h, h); x.lineTo(edge - h, h); }
    x.closePath(); x.clip(); x.drawImage(s, 0, 0); },
  iris(e, s, w, h) { x.beginPath(); x.rect(0, 0, w, h); x.arc(w / 2, h * .45, e * Math.hypot(w, h) * .6, 0, TAU, true); x.clip('evenodd'); x.drawImage(s, 0, 0); },
  diamond(e, s, w, h) { const r = e * (w + h) * .6, cx = w / 2, cy = h / 2; x.beginPath(); x.rect(0, 0, w, h);
    x.moveTo(cx, cy - r); x.lineTo(cx - r, cy); x.lineTo(cx, cy + r); x.lineTo(cx + r, cy); x.closePath(); x.clip('evenodd'); x.drawImage(s, 0, 0); },
  blinds(e, s, w, h, P) { const n = P.n; x.beginPath();
    for (let i = 0; i < n; i++) { if (P.vert) { const bw = w / n; x.rect(i * bw, 0, bw * (1 - e), h); } else { const bh = h / n; x.rect(0, i * bh, w, bh * (1 - e)); } }
    x.clip(); x.drawImage(s, 0, 0); },
  slide(e, s, w, h, P) { const dx = [1, -1, 0, 0][P.dir4] * e * w, dy = [0, 0, 1, -1][P.dir4] * e * h; x.drawImage(s, dx, dy); },
  curtain(e, s, w, h, P) { const o = e * (P.vert ? h : w) / 2;
    if (P.vert) { x.drawImage(s, 0, 0, w, h / 2, 0, -o, w, h / 2); x.drawImage(s, 0, h / 2, w, h / 2, 0, h / 2 + o, w, h / 2); }
    else { x.drawImage(s, 0, 0, w / 2, h, -o, 0, w / 2, h); x.drawImage(s, w / 2, 0, w / 2, h, w / 2 + o, 0, w / 2, h); } },
  shatter(e, s, w, h, P) { const c = P.cols, r = P.rows, tw = w / c, th = h / r;
    for (let i = 0; i < c; i++) for (let j = 0; j < r; j++) {
      const d = ((i * 7 + j * 13) % 11) / 11 * .45, k = clamp((e - d) / (1 - .45)); if (k >= 1) continue;
      x.save(); x.globalAlpha = 1 - k; x.translate(i * tw + tw / 2, j * th + th / 2 + k * k * h * .6); x.rotate(k * ((i + j) % 2 ? 1 : -1) * 1.2);
      x.drawImage(s, i * tw, j * th, tw, th, -tw / 2, -th / 2, tw, th); x.restore(); } },
  dissolve(e, s, w, h, P) { const c = P.cols * 3, r = P.rows * 3, tw = w / c, th = h / r;
    for (let i = 0; i < c; i++) for (let j = 0; j < r; j++) { const n = (Math.sin(i * 12.9898 + j * 78.233 + P.seed) * 43758.5453) % 1; if (Math.abs(n) < e) continue;
      x.drawImage(s, i * tw, j * th, tw + 1, th + 1, i * tw, j * th, tw + 1, th + 1); } },
  pixel(e, s, w, h) { const q = Math.max(4, Math.round(80 * (1 - e) * (1 - e)) + 4), tmp = VBUF.px || (VBUF.px = document.createElement('canvas'));
    tmp.width = Math.ceil(w / q); tmp.height = Math.ceil(h / q); tmp.getContext('2d').drawImage(s, 0, 0, tmp.width, tmp.height);
    x.imageSmoothingEnabled = false; x.globalAlpha = 1 - e; x.drawImage(tmp, 0, 0, w, h); x.imageSmoothingEnabled = true; },
  glitch(e, s, w, h, P) { const n = 18;
    for (let i = 0; i < n; i++) { const y = i * h / n, off = Math.sin(i * 3.7 + P.seed) * w * .25 * e; x.globalAlpha = 1 - e;
      x.drawImage(s, 0, y, w, h / n + 1, off, y, w, h / n + 1); }
    x.globalCompositeOperation = 'screen'; x.globalAlpha = (1 - e) * .5; x.drawImage(s, 8 * e * w / 100, 0); },
  ripple(e, s, w, h, P) { const R = Math.hypot(w, h) * .6, bands = P.n; x.beginPath(); x.rect(0, 0, w, h);
    for (let i = 0; i < bands; i++) { const r0 = (i / bands) * R, r1 = r0 + R / bands * e; x.moveTo(w / 2 + r1, h / 2); x.arc(w / 2, h / 2, r1, 0, TAU); if (r0 > 0) { x.moveTo(w / 2 + r0, h / 2); x.arc(w / 2, h / 2, r0, 0, TAU, true); } }
    x.clip('evenodd'); x.drawImage(s, 0, 0); },
  clock(e, s, w, h, P) { const a0 = -Math.PI / 2, a1 = a0 + e * TAU * (P.dir ? -1 : 1); x.beginPath(); x.moveTo(w / 2, h / 2);
    x.arc(w / 2, h / 2, Math.hypot(w, h), a1, a0 + (P.dir ? -TAU : TAU), P.dir); x.closePath(); x.clip(); x.drawImage(s, 0, 0); },
  split(e, s, w, h) { const o = e * w * .6; x.save(); x.beginPath(); x.moveTo(0, 0); x.lineTo(w, 0); x.lineTo(0, h); x.closePath(); x.clip(); x.drawImage(s, -o, -o * h / w); x.restore();
    x.beginPath(); x.moveTo(w, 0); x.lineTo(w, h); x.lineTo(0, h); x.closePath(); x.clip(); x.drawImage(s, o, o * h / w); },
  swirl(e, s, w, h, P) { const n = 6; for (let i = n; i > 0; i--) { const k = i / n, sc = 1 - e * (1 - k * .5); x.save(); x.globalAlpha = (1 - e) * .35;
    x.translate(w / 2, h / 2); x.rotate(e * P.spin * k); x.drawImage(s, -w * sc / 2, -h * sc / 2, w * sc, h * sc); x.restore(); } },
};
KINDS.length = 0; KINDS.push(...Object.keys(TR));
function transParams(r) {
  return { dir: r() < .5 ? 1 : 0, dir4: Math.floor(r() * 4), vert: r() < .5, n: 6 + Math.floor(r() * 12), cols: 6 + Math.floor(r() * 6), rows: 4 + Math.floor(r() * 4), spin: (r() - .5) * 3, seed: r() * 100 };
}
function pickTransition(sec) { const r = secRng(sec, 'tr'); const k = pick(r, KINDS); TRANS.params = transParams(r); return k; }
drawTransition = function () {
  if (!TRANS.active) return;
  const p = clamp((performance.now() - TRANS.t0) / TRANS.dur);
  if (p >= 1) { TRANS.active = false; return; }
  x.save(); x.setTransform(1, 0, 0, 1, 0, 0);
  try { (TR[TRANS.kind] || TR.fade)(ease(p), TRANS.snap, cv.width, cv.height, TRANS.params || transParams(Math.random)); } finally { x.restore(); }
};

// ---------- 14 sistemas de partículas parametrizados ----------
const PS = {
  fireflies(k, t, E, q) { for (const d of P('ff' + q.id, q.n, () => [rnd(), rnd(), rnd() * TAU])) {
    const px = (d[0] + Math.sin(t * .2 * q.sp + d[2]) * .04) * W, py = (d[1] + Math.cos(t * .17 * q.sp + d[2]) * .04) * H, a = (.5 + .5 * Math.sin(t * 2 + d[2])) * k;
    glow(px, py, q.size * 6, CA(q.c, 25), a * .6); x.fillStyle = C(q.c, a, 35); x.fillRect(px - 1, py - 1, 2, 2); } },
  dust(k, t, E, q) { x.fillStyle = C(q.c, .35 * k, 30); for (const d of P('du' + q.id, q.n * 2, () => [rnd(), rnd(), .3 + rnd()])) {
    x.fillRect(((d[0] + t * .01 * q.sp * d[2]) % 1) * W, ((d[1] + Math.sin(t * .3 + d[0] * 9) * .01) % 1) * H, q.size * .6, q.size * .6); } },
  shapes(k, t, E, q) { for (const d of P('sh' + q.id, Math.ceil(q.n / 4), () => [rnd(), rnd(), rnd() * TAU, 3 + Math.floor(rnd() * 4)])) {
    const px = d[0] * W, py = ((d[1] - t * .02 * q.sp) % 1 + 1) % 1 * H, r = q.size * 5 * (1 + E * .3);
    x.strokeStyle = C(q.c, .45 * k, 20); x.lineWidth = 1.2; x.beginPath();
    for (let i = 0; i <= d[3]; i++) { const a = d[2] + t * .3 * q.sp + i / d[3] * TAU; i ? x.lineTo(px + Math.cos(a) * r, py + Math.sin(a) * r) : x.moveTo(px + Math.cos(a) * r, py + Math.sin(a) * r); } x.stroke(); } },
  ribbons(k, t, E, q) { for (let r = 0; r < 3; r++) { x.strokeStyle = C(q.c + r, .22 * k, 20); x.lineWidth = q.size * (3 - r); x.beginPath();
    for (let i = 0; i <= 50; i++) { const u = i / 50, y = H * (.2 + r * .25) + Math.sin(u * (3 + q.sp * 2) + t * (.4 + r * .2)) * H * .08 * (1 + E * .5); i ? x.lineTo(u * W, y) : x.moveTo(u * W, y); } x.stroke(); } },
  orbs(k, t, E, q) { for (const d of P('ob' + q.id, Math.ceil(q.n / 3), () => [rnd(), rnd(), 20 + rnd() * 70, rnd() * TAU])) {
    glow(d[0] * W + Math.sin(t * .1 * q.sp + d[3]) * 40, d[1] * H + Math.cos(t * .08 * q.sp + d[3]) * 30, d[2] * q.size * .4, CA(q.c + (d[3] > 3 ? 1 : 0), 15), .22 * k); } },
  spiral(k, t, E, q) { x.save(); x.translate(W / 2, H * .45); for (let i = 0; i < q.n; i++) { const a = i * .35 + t * .4 * q.sp * (q.dir ? 1 : -1), r = i * S() * .006 * q.size;
    x.fillStyle = C(q.c + (i % 2), .6 * k * (1 - i / q.n), 25); x.fillRect(Math.cos(a) * r, Math.sin(a) * r, 2, 2); } x.restore(); },
  gridwave(k, t, E, q) { const hz = H * .58; x.strokeStyle = C(q.c, .35 * k, 15); x.lineWidth = 1;
    for (let i = -12; i <= 12; i++) { x.beginPath(); x.moveTo(W / 2 + i * 8, hz); x.lineTo(W / 2 + i * W * .12, H); x.stroke(); }
    for (let j = 0; j < 12; j++) { const z = (((j / 12) + t * .08 * q.sp) % 1) ** 2, y = hz + z * (H - hz); x.beginPath(); x.moveTo(0, y); x.lineTo(W, y); x.stroke(); } },
  sweep(k, t, E, q) { const a = Math.sin(t * .25 * q.sp) * .7; x.save(); x.translate(q.dir ? 0 : W, H); x.rotate((q.dir ? -1 : 1) * (Math.PI / 4 + a));
    const g = x.createLinearGradient(-60, 0, 60, 0); g.addColorStop(0, C(q.c, 0)); g.addColorStop(.5, C(q.c, .16 * k, 25)); g.addColorStop(1, C(q.c, 0));
    x.fillStyle = g; x.fillRect(-60, -Math.hypot(W, H), 120, Math.hypot(W, H)); x.restore(); },
  flare(k, t, E, q) { const fx = W * (.3 + .4 * (Math.sin(t * .05 * q.sp) * .5 + .5)), fy = H * .25, cx = W / 2, cy = H / 2;
    glow(fx, fy, S() * .1, 'rgba(255,245,225,A)', .4 * k);
    for (let i = 1; i <= 5; i++) { const u = i / 5 * 1.6; glow(fx + (cx - fx) * u, fy + (cy - fy) * u, 12 + i * 10 * q.size * .3, CA(q.c + i, 20), .12 * k); } },
  starburst(k, t, E, q) { if (IN.beatHit && IN.beatCount % q.every === 0) (PS._bursts = PS._bursts || []).push({ x: rnd() * W, y: rnd() * H * .6, a: 1, c: q.c });
    PS._bursts = (PS._bursts || []).filter(b => (b.a -= .03) > 0);
    for (const b of PS._bursts) { x.strokeStyle = C(b.c, b.a * k, 30); x.lineWidth = 1.2; for (let i = 0; i < 12; i++) { const a = i / 12 * TAU, r1 = (1 - b.a) * 60, r2 = r1 + 14;
      x.beginPath(); x.moveTo(b.x + Math.cos(a) * r1, b.y + Math.sin(a) * r1); x.lineTo(b.x + Math.cos(a) * r2, b.y + Math.sin(a) * r2); x.stroke(); } } },
  digital(k, t, E, q) { x.fillStyle = C(q.c, .4 * k, 25); for (const d of P('dg' + q.id, q.n, () => [rnd(), rnd(), .4 + rnd()])) {
    const y = ((d[1] + t * .15 * q.sp * d[2]) % 1) * H; x.fillRect(d[0] * W, y, 1.5, 10 + d[2] * 20); } },
  bubbles(k, t, E, q) { x.strokeStyle = C(q.c, .35 * k, 30); x.lineWidth = 1; for (const d of P('bb' + q.id, q.n, () => [rnd(), rnd(), .3 + rnd()])) {
    const y = H - ((d[1] + t * .05 * q.sp * d[2]) % 1) * H; x.beginPath(); x.arc(d[0] * W + Math.sin(t + d[0] * 20) * 8, y, q.size * d[2] * 2, 0, TAU); x.stroke(); } },
  sparks(k, t, E, q) { for (const d of P('sp' + q.id, q.n, () => [rnd(), rnd(), .5 + rnd(), (rnd() - .5) * .3])) {
    const kk = (d[1] + t * .25 * q.sp * d[2]) % 1, px = (d[0] + d[3] * kk) * W, py = H - kk * H * .7;
    x.fillStyle = C(q.c, (1 - kk) * .8 * k, 30); x.fillRect(px, py, 1.6, 1.6); } },
  rings(k, t, E, q) { for (let i = 0; i < 4; i++) { const kk = ((t * .2 * q.sp + i / 4) % 1); x.strokeStyle = C(q.c, (1 - kk) * .3 * k * (.6 + E), 20); x.lineWidth = 1.5;
    x.beginPath(); x.arc(W / 2, H * .45, kk * S() * .6, 0, TAU); x.stroke(); } },
};
const PS_NAMES = Object.keys(PS);
function sysParams(r, i) { return { id: i + '-' + Math.floor(r() * 1e6), n: 30 + Math.floor(r() * 90), size: .5 + r() * 2, sp: .4 + r() * 1.6, c: Math.floor(r() * 3), dir: r() < .5, every: [2, 4, 8][Math.floor(r() * 3)] }; }

// ---------- gradaciones y simetrías ----------
const GRADES = [
  null, null, null,                                                                      // la mitad de las veces, nada
  k => { x.globalCompositeOperation = 'color'; x.fillStyle = C(0, .22 * k); x.fillRect(0, 0, W, H); },                 // duotono
  k => { x.globalCompositeOperation = 'soft-light'; x.fillStyle = `rgba(255,150,70,${.35 * k})`; x.fillRect(0, 0, W, H); }, // película cálida
  k => { x.globalCompositeOperation = 'soft-light'; x.fillStyle = `rgba(60,110,255,${.35 * k})`; x.fillRect(0, 0, W, H); }, // noche fría
  k => { x.globalCompositeOperation = 'overlay'; x.fillStyle = `rgba(128,128,128,${.3 * k})`; x.fillRect(0, 0, W, H); },   // más contraste
  k => { x.globalCompositeOperation = 'screen'; x.fillStyle = C(1, .08 * k, -20); x.fillRect(0, 0, W, H); },              // neón suave
];
const SYMS = ['none', 'none', 'none', 'none', 'mirrorX', 'mirrorY', 'quad', 'kaleido'];
function symmetry(kind) {
  if (kind === 'none') return;
  const w = cv.width, h = cv.height;
  x.save(); x.setTransform(1, 0, 0, 1, 0, 0);
  if (kind === 'mirrorX' || kind === 'quad') { x.translate(w, 0); x.scale(-1, 1); x.drawImage(cv, 0, 0, w / 2, h, 0, 0, w / 2, h); x.setTransform(1, 0, 0, 1, 0, 0); }
  if (kind === 'mirrorY' || kind === 'quad') { x.translate(0, h); x.scale(1, -1); x.drawImage(cv, 0, 0, w, h / 2, 0, 0, w, h / 2); x.setTransform(1, 0, 0, 1, 0, 0); }
  if (kind === 'kaleido') {
    const tmp = VBUF.k || (VBUF.k = document.createElement('canvas')), r = Math.min(w, h) / 2;
    tmp.width = w; tmp.height = h; tmp.getContext('2d').drawImage(cv, 0, 0);
    for (let i = 0; i < 6; i++) { x.save(); x.translate(w / 2, h / 2); x.rotate(i * TAU / 6); if (i % 2) x.scale(1, -1);
      x.beginPath(); x.moveTo(0, 0); x.arc(0, 0, Math.hypot(w, h), -Math.PI / 6, Math.PI / 6); x.closePath(); x.clip();
      x.drawImage(tmp, w / 2 - r, h / 2 - r * .6, r * 1.6, r * 1.2, 0, -r * .6, r * 1.6, r * 1.2); x.restore(); }
  }
  x.restore();
}

// ---------- receta de cada sección ----------
const RECIPE = { key: '', r: null };
function recipeFor(sec) {
  const key = ext.key() + '|' + sec;
  if (RECIPE.key === key) return RECIPE.r;
  const r = secRng(sec, 'mix');
  const nSys = r() < .55 ? 1 : 2, sys = [];
  for (let i = 0; i < nSys; i++) sys.push([pick(r, PS_NAMES), sysParams(r, i)]);
  const recipe = { grade: pick(r, GRADES), sym: pick(r, SYMS), sys, roll: r() < .35 ? (r() - .5) * .08 : 0 };
  RECIPE.key = key; RECIPE.r = recipe; RECIPE.t0 = performance.now();
  return recipe;
}

// el giro de cámara entra en la profundidad
const _layer = CAM.layer.bind(CAM);
CAM.roll = 0;
CAM.layer = function (d, fn) {
  if (!this.roll) return _layer(d, fn);
  x.save(); x.translate(W / 2, H / 2); x.rotate(this.roll * d * Math.sin((IN.clock || 0) * .15)); x.translate(-W / 2, -H / 2);
  try { _layer(d, fn); } finally { x.restore(); }
};

// ---------- en cada cuadro ----------
const _procFrameV = procFrame;
procFrame = function (t, dt) {
  const time = ext.active() ? ext.now() : T;
  const sec = IN.cuts.length > 1 ? Math.max(0, IN.cuts.findLastIndex(c => c <= time)) : Math.floor(time / proc.secLen);
  const rec = recipeFor(sec), inK = clamp((performance.now() - RECIPE.t0) / 1500);
  CAM.roll = rec.roll;
  _procFrameV(t, dt);
  if (proc.dur && time > proc.dur - 4) return;
  symmetry(rec.sym);
  for (const [name, q] of rec.sys) CAM.layer(.7, () => PS[name](inK * .9, IN.clock, IN.beat || 0, q));
  if (rec.grade) { x.save(); rec.grade(inK); x.restore(); }
};
// la transición de cada cambio de sección también sale de la semilla
const _startTransition = startTransition;
startTransition = function (kind) {
  const time = ext.active() ? ext.now() : T;
  const sec = IN.cuts.length > 1 ? Math.max(0, IN.cuts.findLastIndex(c => c <= time)) : Math.floor(time / proc.secLen);
  _startTransition(kind === 'zoom' && MOM.flash > .2 ? 'zoom' : pickTransition(sec));
};

// ---------- 16 transiciones más, cinematográficas ----------
Object.assign(TR, {
  // túnel de velocidad: copias cada vez más grandes y tenues, rayos hacia el centro
  warp(e, s, w, h) {
    for (let i = 6; i >= 0; i--) { const k = 1 + e * (.15 + i * .25); x.globalAlpha = (1 - e) * (i === 0 ? 1 : .18);
      x.drawImage(s, w / 2 - w * k / 2, h / 2 - h * k / 2, w * k, h * k); }
    x.globalAlpha = 1; x.globalCompositeOperation = 'lighter';
    for (let i = 0; i < 60; i++) { const a = i * 2.39996, r0 = (.1 + (i % 7) * .05) * w * (1 - e * .5), r1 = r0 + e * w * .5;
      x.strokeStyle = `rgba(255,255,255,${(1 - e) * .25})`; x.lineWidth = 2; x.beginPath();
      x.moveTo(w / 2 + Math.cos(a) * r0, h / 2 + Math.sin(a) * r0); x.lineTo(w / 2 + Math.cos(a) * r1, h / 2 + Math.sin(a) * r1); x.stroke(); } },
  // puerta estelar: se la traga un punto girando, destello al final
  stargate(e, s, w, h, P) {
    const k = Math.pow(1 - e, 2.2); x.save(); x.translate(w / 2, h / 2); x.rotate(e * e * P.spin * 3);
    x.globalAlpha = 1; x.drawImage(s, -w * k / 2, -h * k / 2, w * k, h * k); x.restore();
    const f = Math.max(0, 1 - Math.abs(e - .85) * 8); if (f) { const g = x.createRadialGradient(w / 2, h / 2, 0, w / 2, h / 2, w * .5);
      g.addColorStop(0, `rgba(255,255,255,${f})`); g.addColorStop(1, 'rgba(255,255,255,0)'); x.fillStyle = g; x.fillRect(0, 0, w, h); } },
  // onda expansiva: el borde del círculo deforma la imagen
  shockwave(e, s, w, h) {
    const R = e * Math.hypot(w, h) * .6, band = 40 + 60 * (1 - e);
    x.save(); x.beginPath(); x.rect(0, 0, w, h); x.arc(w / 2, h / 2, R, 0, TAU, true); x.clip('evenodd'); x.drawImage(s, 0, 0); x.restore();
    for (let i = 0; i < 24; i++) { const a0 = i / 24 * TAU, a1 = (i + 1) / 24 * TAU, push = band * .6 * (1 - e);
      x.save(); x.beginPath(); x.arc(w / 2, h / 2, R + band, a0, a1); x.arc(w / 2, h / 2, Math.max(0, R), a1, a0, true); x.closePath(); x.clip();
      x.globalAlpha = .9 * (1 - e); x.drawImage(s, Math.cos((a0 + a1) / 2) * push, Math.sin((a0 + a1) / 2) * push); x.restore(); }
    x.strokeStyle = `rgba(255,255,255,${.6 * (1 - e)})`; x.lineWidth = 3; x.beginPath(); x.arc(w / 2, h / 2, R, 0, TAU); x.stroke(); },
  // grieta de relámpago: la pantalla se parte y las mitades se separan
  crack(e, s, w, h, P) {
    const pts = []; for (let i = 0; i <= 14; i++) pts.push([w / 2 + Math.sin(i * 2.7 + P.seed) * w * .08, i / 14 * h]);
    const o = e * e * w * .6;
    const half = (side) => { x.save(); x.beginPath(); x.moveTo(side < 0 ? 0 : w, 0); pts.forEach(([a, b]) => x.lineTo(a, b)); x.lineTo(side < 0 ? 0 : w, h); x.closePath(); x.clip();
      x.drawImage(s, side * o, 0); x.restore(); };
    half(-1); half(1);
    x.shadowColor = 'rgba(200,220,255,1)'; x.shadowBlur = 30; x.strokeStyle = `rgba(235,245,255,${1 - e})`; x.lineWidth = 3 + 6 * (1 - e);
    x.beginPath(); pts.forEach(([a, b], i) => i ? x.lineTo(a, b) : x.moveTo(a, b)); x.stroke(); x.shadowBlur = 0; },
  // quemado: se consume con borde incandescente
  burn(e, s, w, h, P) {
    const c = 48, r = 27, tw = w / c, th = h / r;
    for (let i = 0; i < c; i++) for (let j = 0; j < r; j++) {
      const n = (Math.sin(i * .37 + P.seed) + Math.sin(j * .41 + P.seed * 2) + Math.sin((i + j) * .23)) / 6 + .5;
      if (n < e - .06) continue;
      x.drawImage(s, i * tw, j * th, tw + 1, th + 1, i * tw, j * th, tw + 1, th + 1);
      if (n < e + .02) { x.fillStyle = `rgba(255,${120 + (n - e) * 2000},40,.85)`; x.fillRect(i * tw, j * th, tw + 1, th + 1); } } },
  // tinta: manchas que crecen y revelan lo nuevo
  ink(e, s, w, h, P) {
    x.beginPath(); x.rect(0, 0, w, h);
    for (let i = 0; i < 9; i++) { const cx = ((Math.sin(i * 12.3 + P.seed) + 1) / 2) * w, cy = ((Math.cos(i * 7.7 + P.seed) + 1) / 2) * h;
      const rr = Math.max(0, e * 1.6 - i * .05) * Math.hypot(w, h) * .35; x.moveTo(cx + rr, cy); x.arc(cx, cy, rr, 0, TAU, true); }
    x.clip('evenodd'); x.drawImage(s, 0, 0); },
  // prisma: rojo, verde y azul se separan y se van
  prism(e, s, w, h) {
    const o = e * w * .08, tints = [['#ff0000', -o, 0], ['#00ff00', 0, o * .5], ['#0000ff', o, 0]];
    const t = VBUF.pr || (VBUF.pr = document.createElement('canvas')); t.width = w; t.height = h; const g = t.getContext('2d');
    x.globalCompositeOperation = 'lighter';
    for (const [col, dx, dy] of tints) { g.globalCompositeOperation = 'source-over'; g.clearRect(0, 0, w, h); g.drawImage(s, 0, 0);
      g.globalCompositeOperation = 'multiply'; g.fillStyle = col; g.fillRect(0, 0, w, h); g.globalCompositeOperation = 'destination-in'; g.drawImage(s, 0, 0);
      x.globalAlpha = 1 - e; x.drawImage(t, dx, dy); } },
  // cubo 3D: la escena vieja gira como la cara de un cubo
  cube(e, s, w, h, P) {
    const cols = 40, cw = w / cols, dir = P.dir ? 1 : -1, ang = e * Math.PI / 2;
    const faceW = w * Math.cos(ang), shift = dir > 0 ? 0 : w - faceW;
    for (let i = 0; i < cols; i++) { const u = i / cols, persp = 1 - Math.sin(ang) * .25 * (dir > 0 ? u : 1 - u), ph = h * persp;
      x.globalAlpha = 1; x.drawImage(s, i * cw, 0, cw + .5, h, shift + u * faceW, (h - ph) / 2, faceW / cols + .5, ph); }
    x.fillStyle = `rgba(0,0,0,${e * .6})`; x.fillRect(shift, 0, faceW, h); },
  // volteo: la escena gira sobre su eje
  flip(e, s, w, h, P) {
    const k = Math.cos(e * Math.PI / 2); if (k <= .01) return;
    x.translate(w / 2, h / 2); P.vert ? x.scale(1, k) : x.scale(k, 1); x.drawImage(s, -w / 2, -h / 2);
    x.fillStyle = `rgba(0,0,0,${(1 - k) * .7})`; x.fillRect(-w / 2, -h / 2, w, h); },
  // puertas: dos hojas que se abren con perspectiva
  doors(e, s, w, h) {
    const k = Math.cos(e * Math.PI / 2), hw = w / 2;
    for (const side of [0, 1]) { const cols = 20, cw = hw / cols;
      for (let i = 0; i < cols; i++) { const u = i / cols, dist = side ? u : 1 - u, ph = h * (1 + (1 - k) * .3 * dist), dw = hw * k / cols;
        const dx = side ? w - hw * k + u * hw * k : u * hw * k; x.drawImage(s, side * hw + i * cw, 0, cw + .5, h, dx, (h - ph) / 2, dw + .5, ph); }
      x.fillStyle = `rgba(0,0,0,${(1 - k) * .5})`; x.fillRect(side ? w - hw * k : 0, 0, hw * k, h); } },
  // página que se dobla desde una esquina
  fold(e, s, w, h) {
    const fx = w * (1 - e * 1.2); x.save(); x.beginPath(); x.rect(0, 0, Math.max(0, fx), h); x.clip(); x.drawImage(s, 0, 0); x.restore();
    if (fx > 0 && fx < w) { const fw = Math.min(w - fx, fx) * .5;
      x.save(); x.translate(fx, 0); x.scale(-1, 1); x.beginPath(); x.rect(0, 0, fw, h); x.clip(); x.drawImage(s, -fx, 0);
      const g = x.createLinearGradient(0, 0, fw, 0); g.addColorStop(0, 'rgba(255,255,255,.35)'); g.addColorStop(1, 'rgba(0,0,0,.45)'); x.fillStyle = g; x.fillRect(0, 0, fw, h); x.restore(); } },
  // mosaico: cada pieza gira sobre sí misma en su propio momento
  mosaicFlip(e, s, w, h, P) {
    const c = P.cols, r = P.rows, tw = w / c, th = h / r;
    for (let i = 0; i < c; i++) for (let j = 0; j < r; j++) { const d = (i + j) / (c + r) * .5, k = clamp((e - d) / .5), sc = Math.cos(k * Math.PI / 2); if (sc <= .02) continue;
      x.save(); x.translate(i * tw + tw / 2, j * th + th / 2); x.scale(sc, 1); x.drawImage(s, i * tw, j * th, tw, th, -tw / 2, -th / 2, tw, th);
      x.fillStyle = `rgba(0,0,0,${(1 - sc) * .6})`; x.fillRect(-tw / 2, -th / 2, tw, th); x.restore(); } },
  // persianas 3D: cada lama gira
  venetian(e, s, w, h, P) {
    const n = P.n, bh = h / n;
    for (let i = 0; i < n; i++) { const k = clamp((e - i / n * .4) / .6), sc = Math.cos(k * Math.PI / 2); if (sc <= .02) continue;
      x.save(); x.translate(0, i * bh + bh / 2); x.scale(1, sc); x.drawImage(s, 0, i * bh, w, bh, 0, -bh / 2, w, bh);
      x.fillStyle = `rgba(0,0,0,${(1 - sc) * .55})`; x.fillRect(0, -bh / 2, w, bh); x.restore(); } },
  // rebanadas que se deslizan alternadas
  sliceSlide(e, s, w, h, P) {
    const n = P.n, bh = h / n;
    for (let i = 0; i < n; i++) { const k = ease(clamp((e - (i % 3) * .08) / .84)), dir = i % 2 ? 1 : -1;
      x.drawImage(s, 0, i * bh, w, bh + 1, dir * k * w, i * bh, w, bh + 1); } },
  // panal hexagonal que se encoge en onda desde el centro
  hexWave(e, s, w, h) {
    const R = Math.max(w, h) / 18, hx = R * Math.sqrt(3), maxD = Math.hypot(w, h) / 2;
    x.beginPath();
    for (let row = -1; row * R * 1.5 < h + R; row++) for (let col = -1; col * hx < w + hx; col++) {
      const cx = col * hx + (row % 2 ? hx / 2 : 0), cy = row * R * 1.5, d = Math.hypot(cx - w / 2, cy - h / 2) / maxD;
      const sc = clamp(1 - (e * 1.6 - d * .6)); if (sc <= 0) continue;
      for (let k = 0; k < 6; k++) { const a = Math.PI / 6 + k * Math.PI / 3, px = cx + Math.cos(a) * R * sc, py = cy + Math.sin(a) * R * sc; k ? x.lineTo(px, py) : x.moveTo(px, py); }
      x.closePath(); }
    x.clip(); x.drawImage(s, 0, 0); },
  // dominó: las filas caen una tras otra
  domino(e, s, w, h, P) {
    const n = P.rows + 3, bh = h / n;
    for (let i = n - 1; i >= 0; i--) { const k = clamp((e - (n - 1 - i) / n * .6) / .4); if (k >= 1) continue;
      x.save(); x.globalAlpha = 1 - k * .3; x.translate(0, i * bh + k * k * h * .7); x.transform(1, 0, 0, 1 - k * .5, 0, 0);
      x.drawImage(s, 0, i * bh, w, bh + 1, 0, 0, w, bh + 1); x.restore(); } },
});
KINDS.length = 0; KINDS.push(...Object.keys(TR));
