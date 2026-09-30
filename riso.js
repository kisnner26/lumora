// ============================================================
// riso.js — motor de escenas ilustradas con estética de risografía.
//
// Cada escena dibuja en una "plancha": un canvas 2D donde cada canal
// (r, g, b) es una tinta plana distinta (tinta 1 = contornos oscuros,
// tinta 2 = color principal, tinta 3 = acento). Un shader WebGL imprime
// esas planchas como una risografía real:
//   · tramas halftone (puntos o líneas) para todo lo que no es tinta llena
//   · desalineo de registro: cada tinta se imprime con su propio desvío
//   · las tintas se multiplican sobre el papel crema (sobreimpresión)
//   · grano de papel, moteado de la tinta y viñeta cálida
//   · borrón de movimiento para los cortes entre escenas
// Todo es código: sin imágenes ni videos.
//
// API para las escenas (ver riso-scenes.js): un "kit" K con tintas,
// formas, texto y anotaciones, y una cámara que respira sola.
// Uso desde fuera: RISO.stage (una sola instancia, compartida por el menú,
// los fondos animados y el director de los lyric videos).
// ============================================================
const RISO = window.RISO = (() => {
  const VW = 1600, VH = 900, TAU = Math.PI * 2;
  const clamp = (v, a = 0, b = 1) => Math.max(a, Math.min(b, v));
  const lerp = (a, b, t) => a + (b - a) * t;
  const ease = t => t < .5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
  const easeOut = t => 1 - Math.pow(1 - t, 3);
  const rng = seed => { let s = (seed >>> 0) || 1; return () => { s = (s + 0x6D2B79F5) | 0; let t = Math.imul(s ^ s >>> 15, 1 | s); t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296; }; };
  // ruido suave 1D (0..1) para movimientos orgánicos
  const nz = x => { const i = Math.floor(x), f = x - i, h = n => { const s = Math.sin(n * 127.1 + 311.7) * 43758.5453; return s - Math.floor(s); }; const u = f * f * (3 - 2 * f); return lerp(h(i), h(i + 1), u); };

  // ---------- combinaciones de tintas ----------
  // color = cómo se ve la tinta impresa sobre papel blanco (luego se multiplica)
  const INKS = [
    { name: 'índigo y naranja', paper: [.965, .93, .84], i: [[.13, .17, .50], [.98, .47, .16], [.42, .56, .70]] },
    { name: 'carmín y petróleo', paper: [.96, .925, .84], i: [[.10, .27, .34], [.90, .22, .25], [.95, .70, .28]] },
    { name: 'verde pino y rosa', paper: [.955, .93, .85], i: [[.08, .30, .24], [1., .45, .58], [.62, .55, .82]] },
    { name: 'carbón y amarillo', paper: [.96, .94, .86], i: [[.16, .16, .19], [1., .78, .12], [.25, .70, .72]] },
    { name: 'violeta y coral', paper: [.965, .925, .86], i: [[.26, .15, .50], [1., .43, .36], [.42, .78, .66]] },
    { name: 'azul marino y mostaza', paper: [.955, .93, .82], i: [[.08, .16, .38], [.92, .64, .12], [.86, .36, .30]] },
  ];

  // ---------- estado de audio: real si hay, propio si no ----------
  const A = { e: .3, beat: 0, low: .3, bpm: 88, phase: 0, beats: 0, live: false };
  let lastHitT = 0, eAvg = .2;
  function readAudio(dt, t) {
    const aud = window.AUD, live = !!(aud && aud.live);
    let bpm = 88;
    try { if (typeof IN !== 'undefined' && IN.bpm > 40) bpm = IN.bpm; } catch (e) {}
    try { if (typeof ext !== 'undefined' && ext.st && ext.st.bpm > 40 && !(typeof IN !== 'undefined' && IN.bpm > 40)) bpm = ext.st.bpm; } catch (e) {}
    A.bpm = bpm;
    let hit = false;
    if (live) {
      A.live = true; A.e = lerp(A.e, clamp(aud.level), .3); A.low = lerp(A.low, clamp(aud.low || aud.level), .3);
      if (aud.pulse > .97 && t - lastHitT > .2) { hit = true; lastHitT = t; }
    } else if (typeof analyser !== 'undefined' && analyser && typeof energy !== 'undefined' && (typeof micOn !== 'undefined' && micOn || typeof audio !== 'undefined' && !audio.paused)) {
      A.live = true; A.e = lerp(A.e, clamp(energy * 1.4), .3); A.low = A.e;
      eAvg = lerp(eAvg, energy, .05);
      if (energy > eAvg * 1.3 + .04 && t - lastHitT > .25) { hit = true; lastHitT = t; }
    } else {
      // sin música: la escena respira sola, con pulso suave
      A.live = false; const idle = .3 + .1 * Math.sin(t * .5);
      A.e = lerp(A.e, idle, .05); A.low = A.e;
      A.phase += dt * bpm / 60;
      if (A.phase >= 1) { A.phase -= 1; hit = true; A.soft = true; }
    }
    if (hit) { A.beat = A.live ? 1 : .45; A.beats++; if (A.live) A.phase = 0; }
    if (A.live) A.phase = (A.phase + dt * bpm / 60) % 1;
    A.beat *= Math.exp(-dt * 6.5);
    return A;
  }

  // ---------- shader ----------
  const VS = 'attribute vec2 p;varying vec2 v;void main(){v=p*.5+.5;gl_Position=vec4(p,0.,1.);}';
  const FS = `precision highp float;
varying vec2 v; uniform sampler2D uP; uniform vec2 uRes; uniform vec3 uPaper, uI1, uI2, uI3;
uniform vec2 uR1, uR2, uR3, uWhip; uniform float uZoom, uCell, uGrain, uAmt;
float h21(vec2 p){ p = fract(p * vec2(123.34, 456.21)); p += dot(p, p + 45.32); return fract(p.x * p.y); }
float vn(vec2 p){ vec2 i = floor(p), f = fract(p); f = f * f * (3. - 2. * f);
  return mix(mix(h21(i), h21(i + vec2(1., 0.)), f.x), mix(h21(i + vec2(0., 1.)), h21(i + vec2(1., 1.)), f.x), f.y); }
vec3 plate(vec2 uv){
  if (abs(uWhip.x) + abs(uWhip.y) + abs(uZoom) < .0005) return vec3(texture2D(uP, uv + uR1).r, texture2D(uP, uv + uR2).g, texture2D(uP, uv + uR3).b);
  vec3 a = vec3(0.);
  for (int i = 0; i < 7; i++) {
    float k = float(i) / 6. - .5; vec2 u = uv + uWhip * k + (uv - .5) * uZoom * k;
    a += vec3(texture2D(uP, u + uR1).r, texture2D(uP, u + uR2).g, texture2D(uP, u + uR3).b);
  }
  return a / 7.;
}
// trama: puntos en rejilla girada (o líneas); "tone" es la fracción de área cubierta
float screen(vec2 p, float ang, float tone, float mode, float n){
  float solid = smoothstep(.80, .92, tone);
  if (tone < .045) return 0.;
  float c = cos(ang), s = sin(ang);
  vec2 q = vec2(c * p.x + s * p.y, -s * p.x + c * p.y) / uCell, f = fract(q) - .5;
  float aa = .8 / uCell + .015, t = min(tone, .78);
  float dots = 1. - smoothstep(sqrt(t / 3.14159) - aa, sqrt(t / 3.14159) + aa, length(f));
  float lines = 1. - smoothstep(t * .5 - aa, t * .5 + aa, abs(f.y));
  float m = mix(dots, lines, mode);
  float r = mix(m, 1., solid);
  return r * (1. - .16 * smoothstep(.66, .92, n));         // moteado: la tinta no cubre perfecto
}
void main(){
  vec2 px = gl_FragCoord.xy;
  vec3 t = plate(v);
  float n = vn(px / 1.9), n2 = vn(px / 5.3 + 7.);
  vec3 col = uPaper;
  col *= mix(vec3(1.), uI3, screen(px, .785, t.b, 0., n) * .93);
  col *= mix(vec3(1.), uI2, screen(px, 1.309, t.g, 0., n2) * .95);
  col *= mix(vec3(1.), uI1, screen(px, .262, t.r, 0., n) * .97);
  // papel: grano fino, fibras y viñeta cálida
  float g = h21(floor(px * .8) + 17.), fib = vn(vec2(px.x * .35, px.y * .02) + 3.) * .5 + vn(vec2(px.x * .02, px.y * .3)) * .5;
  col *= 1. + (g - .5) * .075 * uGrain + (fib - .5) * .045 * uGrain + (vn(px * .012) - .5) * .05;
  col = mix(col, col * vec3(.92, .88, .80), smoothstep(.5, 1.05, length(v - .5) * 1.25) * .8);
  gl_FragColor = vec4(col, 1.);
}`;

  // ---------- kit de dibujo para las escenas ----------
  const inkCache = new Map();
  function ink(i, tone = 1) {
    const k = i * 1000 + Math.round(tone * 60); let s = inkCache.get(k);
    if (!s) { const v = Math.round(clamp(tone) * 255); s = `rgb(${i === 1 ? v : 0},${i === 2 ? v : 0},${i === 3 ? v : 0})`; inkCache.set(k, s); }
    return s;
  }
  const PAPER = 'rgb(0,0,0)';
  const FONTS = {
    display: '"Anybody","Arial Narrow","Helvetica Neue",Arial,sans-serif',
    serif: '"Cormorant Garamond","Iowan Old Style",Georgia,serif',
    mono: '"Martian Mono","SF Mono",Menlo,monospace',
    hand: '"Caveat","Bradley Hand","Segoe Print",cursive',
  };
  const K = {
    c: null, W: VW, H: VH, v: { l: 0, t: 0, r: VW, b: VH, w: VW, h: VH }, t: 0, dt: .016, a: A, d: 3, ink, PAPER, FONTS, rng, nz, ease, easeOut, clamp, lerp, TAU,
    notes: true, lyric: false,
    ink1: (t = 1) => ink(1, t), ink2: (t = 1) => ink(2, t), ink3: (t = 1) => ink(3, t),
    rgb: (a, b, c) => `rgb(${Math.round(clamp(a) * 255)},${Math.round(clamp(b) * 255)},${Math.round(clamp(c) * 255)})`,
    // pinta el camino actual: f/ft = tinta y tono de relleno, s/st/lw = contorno, over = sobreimpresión (suma tintas)
    paint(o) {
      const c = this.c; if (!o) return;
      if (o.over) c.globalCompositeOperation = 'lighter';
      if (o.f !== undefined && o.f !== 0) { c.fillStyle = o.f === -1 ? PAPER : (o.fs || ink(o.f, o.ft ?? 1)); c.fill(); }
      if (o.s) { c.strokeStyle = o.s === -1 ? PAPER : ink(o.s, o.st ?? 1); c.lineWidth = o.lw || 5; c.lineJoin = 'round'; c.lineCap = o.cap || 'round'; if (o.dash) c.setLineDash(o.dash); c.stroke(); if (o.dash) c.setLineDash([]); }
      if (o.over) c.globalCompositeOperation = 'source-over';
    },
    path(fn, o) { const c = this.c; c.beginPath(); fn(c); this.paint(o); },
    rect(x, y, w, h, o) { const c = this.c; c.beginPath(); c.rect(x, y, w, h); this.paint(o); },
    rr(x, y, w, h, r, o) {
      const c = this.c; r = Math.min(r, w / 2, h / 2); c.beginPath(); c.moveTo(x + r, y); c.arcTo(x + w, y, x + w, y + h, r); c.arcTo(x + w, y + h, x, y + h, r);
      c.arcTo(x, y + h, x, y, r); c.arcTo(x, y, x + w, y, r); c.closePath(); this.paint(o);
    },
    circ(x, y, r, o) { const c = this.c; c.beginPath(); c.arc(x, y, Math.max(0, r), 0, TAU); this.paint(o); },
    ell(x, y, rx, ry, rot, o) { const c = this.c; c.beginPath(); c.ellipse(x, y, Math.max(0, rx), Math.max(0, ry), rot || 0, 0, TAU); this.paint(o); },
    poly(pts, o, close = true) { const c = this.c; c.beginPath(); pts.forEach((p, i) => i ? c.lineTo(p[0], p[1]) : c.moveTo(p[0], p[1])); if (close) c.closePath(); this.paint(o); },
    line(x1, y1, x2, y2, i = 1, lw = 4, tone = 1) { const c = this.c; c.beginPath(); c.moveTo(x1, y1); c.lineTo(x2, y2); c.strokeStyle = ink(i, tone); c.lineWidth = lw; c.lineCap = 'round'; c.stroke(); },
    // relleno por encima del que ya hay (sobreimpresión), recortado a una forma
    clip(fn, draw) { const c = this.c; c.save(); c.beginPath(); fn(c); c.clip(); try { draw(c); } finally { c.restore(); } },
    // degradados de trama: la tinta pasa de un tono a otro y el shader lo vuelve puntos
    lin(i, x0, y0, x1, y1, t0, t1) { const g = this.c.createLinearGradient(x0, y0, x1, y1); g.addColorStop(0, ink(i, t0)); g.addColorStop(1, ink(i, t1)); return g; },
    rad(i, x, y, r0, r1, t0, t1) { const g = this.c.createRadialGradient(x, y, r0, x, y, r1); g.addColorStop(0, ink(i, t0)); g.addColorStop(1, ink(i, t1)); return g; },
    glow(i, x, y, r, t0 = .7, over = true) {           // resplandor de puntos
      const c = this.c; c.save(); if (over) c.globalCompositeOperation = 'lighter';
      c.fillStyle = this.rad(i, x, y, 0, r, t0, 0); c.fillRect(x - r, y - r, r * 2, r * 2); c.restore();
    },
    // sombra de puntos dentro de una forma
    shade(fn, i, t0, t1, x0, y0, x1, y1) { this.clip(fn, c => { c.globalCompositeOperation = 'lighter'; c.fillStyle = this.lin(i, x0, y0, x1, y1, t0, t1); c.fillRect(x0 - 2000, y0 - 2000, 4000, 4000 + Math.abs(y1 - y0)); }); },
    // líneas de trama a mano dentro de un rectángulo
    hatch(x, y, w, h, i = 1, gap = 12, ang = -.7, lw = 2, tone = 1) {
      const c = this.c; c.save(); c.beginPath(); c.rect(x, y, w, h); c.clip(); c.strokeStyle = ink(i, tone); c.lineWidth = lw; c.beginPath();
      const d = Math.hypot(w, h), cx = x + w / 2, cy = y + h / 2, ca = Math.cos(ang), sa = Math.sin(ang);
      for (let k = -d / 2; k < d / 2; k += gap) { c.moveTo(cx + ca * (-d / 2) - sa * k, cy + sa * (-d / 2) + ca * k); c.lineTo(cx + ca * (d / 2) - sa * k, cy + sa * (d / 2) + ca * k); }
      c.stroke(); c.restore();
    },
    bg(i, tone = 1) { if (!i) return; const c = this.c; c.fillStyle = ink(i, tone); c.fillRect(-3200, -2400, 8000, 6000); },
    // texto: o = { i, size, font, w, align, rot, ls, tone, italic, base, stretch }
    txt(str, x, y, o = {}) {
      const c = this.c; c.save(); c.translate(x, y); if (o.rot) c.rotate(o.rot);
      c.font = `${o.italic ? 'italic ' : ''}${o.w || 700} ${o.size || 40}px ${FONTS[o.font || 'display']}`;
      try { c.fontStretch = o.stretch || (o.font === undefined || o.font === 'display' ? 'condensed' : 'normal'); } catch (e) {}
      try { c.letterSpacing = (o.ls || 0) + 'px'; } catch (e) {}
      c.textAlign = o.align || 'left'; c.textBaseline = o.base || 'alphabetic';
      c.fillStyle = o.fs || ink(o.i || 1, o.tone ?? 1); c.fillText(str, 0, 0);
      try { c.letterSpacing = '0px'; c.fontStretch = 'normal'; } catch (e) {}
      c.restore();
    },
    measure(str, o = {}) {
      const c = this.c; c.save(); c.font = `${o.italic ? 'italic ' : ''}${o.w || 700} ${o.size || 40}px ${FONTS[o.font || 'display']}`;
      try { c.fontStretch = o.stretch || (o.font === undefined || o.font === 'display' ? 'condensed' : 'normal'); c.letterSpacing = (o.ls || 0) + 'px'; } catch (e) {}
      const w = c.measureText(str).width; c.restore(); return w;
    },
    // dibuja en coordenadas de pantalla (sin cámara): la capa de anotaciones
    screen(fn) { const c = this.c; c.save(); c.setTransform(this._base, 0, 0, this._base, this._pw / 2 - VW / 2 * this._base, this._ph / 2 - VH / 2 * this._base); try { fn(c); } finally { c.restore(); } },
    // una capa con paralaje: depth 0 = fondo lejano (casi no se mueve), 1 = primer plano
    layer(depth, fn) { const c = this.c; c.save(); c.translate(-this._cx * (depth - 1) * .6, -this._cy * (depth - 1) * .6); try { fn(c); } finally { c.restore(); } },
    pulse() { return this.a.beat; },
    // ---------- anotaciones ----------
    // cinta adhesiva translúcida (tinta 2 muy tenue por encima del papel)
    tape(x, y, w = 110, h = 34, rot = 0, i = 2) {
      const c = this.c; c.save(); c.translate(x, y); c.rotate(rot); c.globalCompositeOperation = 'lighter'; c.fillStyle = ink(i, .34);
      c.beginPath(); c.moveTo(-w / 2, -h / 2); for (let k = 0; k <= 6; k++) c.lineTo(-w / 2 + (k % 2 ? 5 : 0), -h / 2 + h * k / 6);
      c.lineTo(w / 2, h / 2); for (let k = 6; k >= 0; k--) c.lineTo(w / 2 - (k % 2 ? 0 : 5), -h / 2 + h * k / 6);
      c.closePath(); c.fill(); c.restore();
    },
    // papel pegado (post-it) con texto; lines = array de líneas
    postit(x, y, w, h, rot, lines, o = {}) {
      const c = this.c; c.save(); c.translate(x, y); c.rotate(rot);
      this.rect(7, 8, w, h, { f: 1, ft: .3, over: true });                      // sombra de trama
      this.rect(0, 0, w, h, o.fill === 0 ? { f: -1, s: 1, lw: 3.5 } : { f: o.fill || 3, ft: o.ft ?? .5, s: 1, lw: 3.5 });
      const sz = o.size || 30;
      lines.forEach((ln, k) => this.txt(ln, 16, sz * 1.2 + 8 + k * sz * 1.2, { size: sz, font: o.font || 'hand', w: o.font === 'mono' ? 500 : 600, i: o.tinta || 1 }));
      if (o.tape !== false) this.tape(w / 2, 2, 100, 30, .04 - rot * .2);
      c.restore();
    },
    // sello de "en vivo" con reloj que corre
    stamp(x, y, s = 1) {
      const d = new Date(), pad = n => String(n).padStart(2, '0'), on = Math.floor(this.t * 1.6) % 2 === 0;
      const c = this.c; c.save(); c.translate(x, y); c.scale(s, s); c.rotate(.012);
      this.rr(8, 8, 300, 96, 4, { f: 1, ft: .3, over: true });
      this.rr(0, 0, 300, 96, 4, { f: -1, s: 1, lw: 3 });
      this.circ(24, 27, 7, on ? { f: 3 } : { f: 3, ft: .35 });
      this.txt('EN VIVO', 42, 34, { font: 'mono', size: 18, w: 500, i: 3, ls: 1 });
      this.txt(`${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`, 292, 34, { font: 'mono', size: 20, w: 500, align: 'right' });
      this.txt(`${d.getFullYear()}.${pad(d.getMonth() + 1)}.${pad(d.getDate())}`, 14, 82, { font: 'mono', size: 36, w: 500, ls: 1 });
      c.restore();
    },
    // texto chico al borde: código, figura, numeración
    code(str, x, y, o = {}) {
      const size = o.size || 15, mo = { font: 'mono', size, w: 500, ls: 1.5 };
      if (o.bg) { const w = this.measure(str, mo) + 14, bx = o.align === 'right' ? x - w + 7 : o.align === 'center' ? x - w / 2 : x - 7; this.rect(bx, y - size - 3, w, size + 10, { f: -1, s: 1, lw: 2.2 }); }
      this.txt(str, x, y, { ...mo, i: o.i || 1, align: o.align, rot: o.rot });
    },
    // ficha de papel con borde y sombra de trama: fondo para anotaciones
    card(x, y, w, h, rot = 0) { const c = this.c; c.save(); c.translate(x, y); c.rotate(rot); this.rect(6, 7, w, h, { f: 1, ft: .3, over: true }); this.rect(0, 0, w, h, { f: -1, s: 1, lw: 3 }); c.restore(); },
    // línea de circuito que se dibuja sola: pts = [[x,y],...], p = 0..1
    circuit(pts, p, o = {}) {
      const c = this.c; let len = 0; const seg = [];
      for (let i = 1; i < pts.length; i++) { const l = Math.hypot(pts[i][0] - pts[i - 1][0], pts[i][1] - pts[i - 1][1]); seg.push(l); len += l; }
      let left = clamp(p) * len; c.save(); c.strokeStyle = ink(o.i || 1, o.tone ?? .9); c.lineWidth = o.lw || 3; c.lineJoin = 'round'; c.lineCap = 'round';
      c.beginPath(); c.moveTo(pts[0][0], pts[0][1]); let last = pts[0];
      for (let i = 1; i < pts.length && left > 0; i++) {
        const l = seg[i - 1], f = Math.min(1, left / l); last = [lerp(pts[i - 1][0], pts[i][0], f), lerp(pts[i - 1][1], pts[i][1], f)];
        c.lineTo(last[0], last[1]); left -= l;
      }
      c.stroke(); c.restore();
      for (const q of pts.slice(0, -1)) if (Math.hypot(q[0] - last[0], q[1] - last[1]) > 1 && p > .05) { const dl = Math.hypot(q[0] - pts[0][0], q[1] - pts[0][1]); if (dl < len * p) this.circ(q[0], q[1], (o.lw || 3) * 1.3, { f: o.i || 1, ft: .9 }); }
      this.circ(last[0], last[1], (o.lw || 3) * 2, { f: o.node || 2 });
    },
    // medidor numérico: barra de segmentos + valor
    meter(x, y, w, v, label, o = {}) {
      const n = o.n || 16, gw = w / n;
      this.txt(label, x, y - 8, { font: 'mono', size: 14, w: 500, ls: 1.5 });
      this.txt(String(Math.round(v * 100)).padStart(2, '0'), x + w, y - 8, { font: 'mono', size: 14, w: 500, align: 'right' });
      for (let i = 0; i < n; i++) this.rect(x + i * gw, y, gw - 3, 16, i < v * n ? { f: i > n * .75 ? 2 : 1 } : { s: 1, lw: 1.5, st: .6 });
    },
  };

  // ---------- estado de las escenas ----------
  const scenes = {};                                 // id -> { id, name, inks, phrases, make, draw }
  const order = [];
  function register(sc) { scenes[sc.id] = sc; if (!order.includes(sc.id)) order.push(sc.id); }

  // ---------- el escenario (una sola instancia) ----------
  class Stage {
    constructor() {
      this.canvas = document.createElement('canvas'); this.plate = document.createElement('canvas');
      this.pc = this.plate.getContext('2d', { alpha: false });
      this.gl = null; this.ok = false;
      this.sceneId = null; this.state = {}; this.t = 0; this.speed = 1; this.inks = -1;  // -1 = las de la escena
      this.userDetail = 3; this.detail = 3; this.auto = true;
      this.cam = { x: 0, y: 0, z: 1, r: 0 }; this.cut = null; this.notes = true; this.lyric = false;
      this.fps = 60; this._acc = 0; this._n = 0; this._slow = 0; this._fast = 0; this._last = 0; this._lastChange = 0;
      this.margin = 34; this.w = 0; this.h = 0; this.phrase = { i: 0, w: 0, at: 0 };
      this._initGL();
      // si el navegador pierde el contexto (cambio de gpu, suspensión), se vuelve a armar solo
      this.canvas.addEventListener('webglcontextlost', e => { e.preventDefault(); this.ok = false; });
      this.canvas.addEventListener('webglcontextrestored', () => { this._tex = null; this._initGL(); });
    }
    _initGL() {
      let gl = null;
      try { gl = this.canvas.getContext('webgl', { alpha: false, antialias: false, preserveDrawingBuffer: true, powerPreference: 'high-performance' }); } catch (e) {}
      if (!gl) return;
      const sh = (t, src) => { const s = gl.createShader(t); gl.shaderSource(s, src); gl.compileShader(s); if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) throw new Error(gl.getShaderInfoLog(s)); return s; };
      try {
        const pr = gl.createProgram(); gl.attachShader(pr, sh(gl.VERTEX_SHADER, VS)); gl.attachShader(pr, sh(gl.FRAGMENT_SHADER, FS)); gl.linkProgram(pr);
        if (!gl.getProgramParameter(pr, gl.LINK_STATUS)) throw new Error(gl.getProgramInfoLog(pr));
        gl.useProgram(pr);
        const b = gl.createBuffer(); gl.bindBuffer(gl.ARRAY_BUFFER, b); gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]), gl.STATIC_DRAW);
        const loc = gl.getAttribLocation(pr, 'p'); gl.enableVertexAttribArray(loc); gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);
        const tex = gl.createTexture(); gl.bindTexture(gl.TEXTURE_2D, tex);
        for (const [k, v] of [[gl.TEXTURE_MIN_FILTER, gl.LINEAR], [gl.TEXTURE_MAG_FILTER, gl.LINEAR], [gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE], [gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE]]) gl.texParameteri(gl.TEXTURE_2D, k, v);
        gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
        this.U = {}; for (const n of ['uP', 'uRes', 'uPaper', 'uI1', 'uI2', 'uI3', 'uR1', 'uR2', 'uR3', 'uWhip', 'uZoom', 'uCell', 'uGrain']) this.U[n] = gl.getUniformLocation(pr, n);
        this.gl = gl; this.ok = true;
      } catch (e) { console.warn('riso: shader', e.message); }
    }
    // tamaño de salida y de plancha según el nivel de detalle (1 bajo, 2 medio, 3 alto)
    resize(w, h) {
      this.w = w; this.h = h; const d = this.detail, dpr = Math.min(window.devicePixelRatio || 1, [1, 1.25, 1.5][d - 1]);
      const ow = Math.round(w * dpr), oh = Math.round(h * dpr), ps = [.5, .66, .82][d - 1] * dpr;
      if (this.canvas.width !== ow || this.canvas.height !== oh) { this.canvas.width = ow; this.canvas.height = oh; }
      const pw = Math.min(Math.round(w * ps), 1800), ph = Math.round(pw * h / w);
      if (this.plate.width !== pw || this.plate.height !== ph) { this.plate.width = pw; this.plate.height = ph; }
      this.dpr = dpr;
    }
    setDetail(d, user) { if (user) this.userDetail = d; this.detail = clamp(Math.round(d), 1, 3); this.resize(this.w || innerWidth, this.h || innerHeight); }
    setInks(i) { this.inks = i; }
    setScene(id, o = {}) {
      if (!scenes[id]) return;
      const sw = () => { this.sceneId = id; this.state = scenes[id].make(rng((Math.random() * 1e9) | 0), K) || {}; this.phrase = { i: 0, w: 0, at: this.t }; this.sceneT0 = this.t; };
      if (!this.sceneId || o.instant) { sw(); this.cut = null; return; }
      if (id === this.sceneId && !o.force) return;
      const kinds = ['h', 'v', 'zin', 'zout', 'spin'], k = o.kind || kinds[(Math.random() * kinds.length) | 0];
      this.cut = { to: id, kind: k, dir: Math.random() < .5 ? 1 : -1, t: 0, swapped: false, swap: sw };
    }
    // corte con movimiento a otra toma: swap() se llama a mitad del corte, cuando la imagen sale de cuadro
    cutTo(swap, kind) { if (this.cut) return swap(); this.cut = { to: '_clip', kind: kind || 'h', dir: Math.random() < .5 ? 1 : -1, t: 0, swapped: false, swap: () => { swap(); this.sceneT0 = this.t; } }; }
    // un cuadro: dtReal en segundos
    frame(dtReal) {
      const dt = Math.min(.08, dtReal || .016), t0 = performance.now();
      this._perf(dtReal);
      const sdt = dt * this.speed; this.t += sdt;
      readAudio(dt, this.t);
      const sc = scenes[this.sceneId]; if (!sc) return this.canvas;
      const pc = this.pc, pw = this.plate.width, ph = this.plate.height, base = Math.max(pw / VW, ph / VH);
      // cámara: paneo y zoom lentos, con un golpe corto en cada beat
      const t = this.t - (this.sceneT0 || 0), cam = this.cam;
      if (sc.cam) sc.cam(cam, t, A, this.state); else {
        cam.x = Math.sin(t * .13 + 1) * 46 + Math.sin(t * .051) * 30; cam.y = Math.cos(t * .097) * 26; cam.z = 1.08 + Math.sin(t * .061) * .045; cam.r = Math.sin(t * .04) * .006;
      }
      cam.z += A.beat * .014 * (A.live ? 1 : .5);
      // corte por movimiento: la escena sale barrida y la nueva entra frenando
      let whip = [0, 0], zb = 0, cx = cam.x, cy = cam.y, cz = cam.z, cr = cam.r;
      const cut = this.cut;
      if (cut) {
        cut.t += dt; const OUT = .2, INN = .36; let m;
        if (cut.t < OUT) m = this._cutMove(cut, ease(cut.t / OUT), 1);
        else { if (!cut.swapped) { cut.swapped = true; cut.swap(); } m = this._cutMove(cut, 1 - easeOut(clamp((cut.t - OUT) / INN)), -1); if (cut.t > OUT + INN) this.cut = null; }
        cx += m.x; cy += m.y; cz *= m.z; cr += m.r; whip = m.whip; zb = m.zb;
      }
      const scn = scenes[this.sceneId];
      // ---------- plancha ----------
      Object.assign(K, { m: this.margin, c: pc, t: this.t, dt: sdt, d: this.detail, a: A, notes: this.notes, lyric: this.lyric, _base: base, _pw: pw, _ph: ph, _cx: cx, _cy: cy });
      K.v = { l: VW / 2 - pw / 2 / base, r: VW / 2 + pw / 2 / base, t: VH / 2 - ph / 2 / base, b: VH / 2 + ph / 2 / base }; K.v.w = K.v.r - K.v.l; K.v.h = K.v.b - K.v.t;
      pc.setTransform(1, 0, 0, 1, 0, 0); pc.globalCompositeOperation = 'source-over'; pc.fillStyle = '#000'; pc.fillRect(0, 0, pw, ph);
      pc.save(); pc.translate(pw / 2, ph / 2); pc.scale(base * cz, base * cz); pc.rotate(cr); pc.translate(-(VW / 2 + cx), -(VH / 2 + cy));
      try { scn.draw(K, this.state, t, sdt, A); } catch (e) { if (!this._err) { this._err = 1; console.warn('riso:', scn.id, e.message); } }
      pc.restore();
      if (this.notes) { try { this._annotate(scn, K, t); } catch (e) { if (!this._err2) { this._err2 = 1; console.warn('riso notas:', e.message); } } }
      this._present(whip, zb);
      this.lastCost = performance.now() - t0;
      return this.canvas;
    }
    _cutMove(cut, p, sign) {
      // p: 0 = en reposo, 1 = fuera de cuadro. Sale hacia +dir y la nueva entra desde -dir, frenando
      const o = { x: 0, y: 0, z: 1, r: 0, whip: [0, 0], zb: 0 }, s = sign > 0 ? 1 : -1;
      switch (cut.kind) {
        case 'h': o.x = cut.dir * s * p * 1500; o.whip = [-cut.dir * s * p * .12, 0]; break;
        case 'v': o.y = cut.dir * s * p * 900; o.whip = [0, cut.dir * s * p * .16]; break;
        case 'zin': o.z = sign > 0 ? 1 + p * 2.2 : 1 + p * 1.1; o.zb = p * .5; break;
        case 'zout': o.z = sign > 0 ? 1 - p * .5 : 1 + p * 1.6; o.zb = -p * .45; break;
        default: o.r = cut.dir * s * p * .9; o.z = 1 + p * .5; o.zb = p * .25;
      }
      return o;
    }
    _annotate(sc, K, t) {
      if (!K.notes) return;
      K.screen(c => {
        const v = K.v, m = this.margin;
        if (sc.notes) sc.notes(K, this.state, t, A);
        K.stamp(v.r - 300 - m, v.t + m, 1);
        // frase con las palabras que se resaltan una a una
        if (!K.lyric && sc.phrases?.length) {
          const P = this.phrase, ph = sc.phrases[P.i % sc.phrases.length], words = ph.split(' ');
          const per = 60 / (A.bpm || 88) * (A.live ? 1 : 1.25);
          if (this.t - P.at > per) { P.at = this.t; P.w++; if (P.w > words.length + 2) { P.w = 0; P.i++; } }
          const size = 46, gap = 14; let wsum = 0; const ws = words.map(w => K.measure(w, { size, w: 600, font: 'display' })); for (const w of ws) wsum += w + gap;
          const bx = v.l + m + 8, by = v.b - m - 66, bw = wsum + 30;
          c.save(); c.translate(bx, by); c.rotate(-.012);
          K.rect(7, 7, bw, 66, { f: 1, ft: .3, over: true }); K.rect(0, 0, bw, 66, { f: -1, s: 1, lw: 3 });
          let px = 16;
          words.forEach((w, k) => {
            const on = k === Math.min(P.w, words.length) - 1 || (P.w > words.length && false);
            const past = k < P.w;
            if (on) { K.rect(px - 6, 12, ws[k] + 10, 46, { f: 3, ft: .5 }); }
            K.txt(w, px, 47, { size, w: 600, font: 'display', i: past ? 1 : 3 });
            if (on) K.rect(px - 4, 55, ws[k] + 6, 5, { f: 2 });
            px += ws[k] + gap;
          });
          c.restore();
        }
        K.code(`FIG. ${String((order.indexOf(sc.id) + 1)).padStart(2, '0')} / ${sc.name.toUpperCase()}`, v.r - m - 8, v.b - m - 38, { align: 'right', size: 16, bg: true });
        K.code(`${Math.round(A.bpm)} BPM · N° ${4400 + ((this.t * 3) | 0) % 90}`, v.r - m - 8, v.b - m - 10, { align: 'right', size: 14, bg: true, i: 3 });
      });
    }
    _present(whip, zb) {
      const gl = this.gl; if (!this.ok) return;
      let inks = INKS[this.inks >= 0 ? this.inks : (scenes[this.sceneId]?.inks ?? 0)] || INKS[0];
      // mezcla de tintas: los colores de un juego migran canal por canal al otro (la mezcla entre canciones)
      if (this.inkMix) { const a = INKS[this.inkMix.from] || INKS[0], b = INKS[this.inkMix.to] || INKS[0], p = clamp(this.inkMix.p), mx = (u, v) => u.map((q, i) => lerp(q, v[i], p));
        inks = { paper: mx(a.paper, b.paper), i: [0, 1, 2].map(k => mx(a.i[k], b.i[k])) }; }
      const w = this.canvas.width, h = this.canvas.height; gl.viewport(0, 0, w, h);
      gl.bindTexture(gl.TEXTURE_2D, this._tex || (this._tex = gl.getParameter(gl.TEXTURE_BINDING_2D)));
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, this.plate);
      const U = this.U, t = this.t;
      // desalineo de registro: cada tinta con su desvío (en píxeles de salida), respira y salta un poco con el beat
      const boost = 1 + (this.regBoost || 0), rg = (ax, ay, k) => [((ax + Math.sin(t * .7 + k) * .7 + A.beat * (k - 1) * 1.2) * boost + (k - 1) * (this.regBoost || 0) * 5) / w, ((ay + Math.cos(t * .6 + k * 2) * .6) * boost - (k - 1) * (this.regBoost || 0) * 4) / h];
      const s = h / 900;
      gl.uniform1i(U.uP, 0); gl.uniform2f(U.uRes, w, h); gl.uniform3fv(U.uPaper, inks.paper);
      gl.uniform3fv(U.uI1, inks.i[0]); gl.uniform3fv(U.uI2, inks.i[1]); gl.uniform3fv(U.uI3, inks.i[2]);
      const r1 = rg(0, 0, 0), r2 = rg(-3.2 * s, 2.4 * s, 1), r3 = rg(2.6 * s, -2.8 * s, 2);
      gl.uniform2f(U.uR1, r1[0], r1[1]); gl.uniform2f(U.uR2, r2[0], r2[1]); gl.uniform2f(U.uR3, r3[0], r3[1]);
      gl.uniform2f(U.uWhip, whip[0], whip[1]); gl.uniform1f(U.uZoom, zb);
      gl.uniform1f(U.uCell, Math.max(4.2, h / [118, 138, 156][this.detail - 1])); gl.uniform1f(U.uGrain, [.8, 1, 1][this.detail - 1]);
      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
    }
    // si baja de 45 fps sostenidos, baja el detalle solo; si sobra, lo vuelve a subir despacio
    _perf(dtReal) {
      if (!this.auto || !dtReal || dtReal > .25) return;
      this._acc += dtReal; this._n++;
      if (this._acc < 1.2) return;
      const fps = this._n / this._acc; this.fps = lerp(this.fps, fps, .6); this._acc = 0; this._n = 0;
      const now = this.t;
      if (this.fps < 45 && this.detail > 1 && now - this._lastChange > 1.5) { this._lastChange = now; this._fast = 0; this.setDetail(this.detail - 1); this.autoDropped = true; }
      else if (this.fps > 57 && this.detail < this.userDetail) { this._fast++; if (this._fast > 14) { this._fast = 0; this._lastChange = now; this.setDetail(this.detail + 1); } }
      else this._fast = 0;
    }
  }

  // ---------- fuentes: que el canvas las tenga listas ----------
  const loadFonts = () => { try { for (const f of ['700 20px Anybody', '600 20px Anybody', '500 20px "Martian Mono"', '600 20px Caveat', 'italic 400 20px "Cormorant Garamond"']) document.fonts.load(f); } catch (e) {} };
  loadFonts();

  const api = { VW, VH, INKS, K, scenes, order, register, rng, nz, ease, easeOut, clamp, lerp, Stage, A, ink, FONTS, get stage() { return api._stage || (api._stage = new Stage()); } };
  return api;
})();
