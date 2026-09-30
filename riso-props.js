// ============================================================
// riso-props.js — objetos ilustrados a mano para el videoclip en risografía.
// Cada objeto se DIBUJA solo: trazos temblorosos con doble pasada (como lápiz
// repasado) que avanzan uno tras otro y, al cerrar el contorno, la tinta de
// relleno entra en trama de puntos. El trazo "hierve" ocho veces por segundo,
// como en la animación dibujada a mano. Caja local de cada objeto: -200..200.
// Los ids coinciden con los objetos del director (LEX): rain, sun, love, ...
// ============================================================
(() => {
  const { nz, clamp } = RISO, TAU = Math.PI * 2, PI = Math.PI, sin = Math.sin, cos = Math.cos;

  // ---------- geometría ----------
  const E = (cx, cy, rx, ry, rot = 0, a0 = 0, a1 = TAU, n = 30) => {
    const o = [], cr = cos(rot), sr = sin(rot);
    for (let i = 0; i <= n; i++) { const a = a0 + (a1 - a0) * i / n, x = cos(a) * rx, y = sin(a) * ry; o.push([cx + x * cr - y * sr, cy + x * sr + y * cr]); }
    return o;
  };
  const C = (cx, cy, r, a0 = -1.2, a1 = TAU + .15) => E(cx, cy, r, r, 0, a0, a1, 34);            // círculo con el trazo que se pasa un poco
  const Ln = (x0, y0, x1, y1, n = 8) => Array.from({ length: n + 1 }, (_, i) => [x0 + (x1 - x0) * i / n, y0 + (y1 - y0) * i / n]);
  const Bz = (p0, p1, p2, p3, n = 18) => Array.from({ length: n + 1 }, (_, i) => { const t = i / n, u = 1 - t;
    return [u * u * u * p0[0] + 3 * u * u * t * p1[0] + 3 * u * t * t * p2[0] + t * t * t * p3[0], u * u * u * p0[1] + 3 * u * u * t * p1[1] + 3 * u * t * t * p2[1] + t * t * t * p3[1]]; });
  const Pl = (...p) => p.flatMap((q, i) => i ? Ln(p[i - 1][0], p[i - 1][1], q[0], q[1], 5) : []);
  const Rc = (x, y, w, h) => Pl([x, y], [x + w, y], [x + w, y + h], [x, y + h], [x, y]);
  const cloudPts = (cx, cy, s = 1) => [...E(cx - 70 * s, cy + 10 * s, 46 * s, 42 * s, 0, PI * .55, PI * 1.5, 14), ...E(cx - 8 * s, cy - 14 * s, 60 * s, 56 * s, 0, PI * 1.25, PI * 1.9, 14),
    ...E(cx + 62 * s, cy + 6 * s, 44 * s, 40 * s, 0, PI * 1.45, PI * 2.55, 14), ...Ln(cx + 62 * s, cy + 46 * s, cx - 70 * s, cy + 52 * s, 8)];
  const spark = (cx, cy, r, k = .3) => { const o = []; for (let i = 0; i <= 8; i++) { const a = i * PI / 4 - PI / 2, rr = i % 2 ? r * k : r; o.push([cx + cos(a) * rr, cy + sin(a) * rr]); } return o; };
  const heart = (s, cx = 0, cy = 0) => Array.from({ length: 41 }, (_, i) => { const a = i / 40 * TAU; return [cx + 16 * sin(a) ** 3 * s, cy - (13 * cos(a) - 5 * cos(2 * a) - 2 * cos(3 * a) - cos(4 * a)) * s]; });

  // ---------- pluma: trazo con temblor, doble pasada y avance ----------
  function pen(K, pts, prog, o = {}) {
    if (prog <= 0 || pts.length < 2) return;
    const c = K.c, n = pts.length, end = Math.min(n, Math.max(2, Math.ceil((n - 1) * clamp(prog)) + 1)), boil = Math.floor(K.t * 8), amp = o.amp ?? 2.2, seed = o.seed || 0;
    for (let pass = 0; pass < (o.single ? 1 : 2); pass++) {
      c.beginPath();
      for (let i = 0; i < end; i++) {
        const q = pts[i], wx = (nz(i * .41 + seed + boil * 3.7 + pass * 9) - .5) * 2 * amp + (pass ? 2 : 0), wy = (nz(i * .41 + seed + 50 + boil * 2.9 + pass * 7) - .5) * 2 * amp + (pass ? -1.6 : 0);
        i ? c.lineTo(q[0] + wx, q[1] + wy) : c.moveTo(q[0] + wx, q[1] + wy);
      }
      c.strokeStyle = K.ink(o.i || 1, pass ? .7 : 1); c.lineWidth = (o.lw || 6) * (pass ? .55 : 1); c.lineCap = 'round'; c.lineJoin = 'round'; c.stroke();
    }
  }

  // ---------- los objetos ----------
  // d.s = trazo, d.f = relleno, d.dot = punto, P = { p: avance 0..1, t, beat, seed }
  const DEFS = {};
  // registra un dibujo; un id repetido se ignora (y en desarrollo, window.RISO_DEV, lanza error)
  const def = (ids, draw) => { for (const id of [].concat(ids)) { if (DEFS[id]) { const m = 'riso-props: id repetido «' + id + '»'; if (window.RISO_DEV) throw new Error(m); console.warn(m); continue; } DEFS[id] = { n: 12, draw }; } };

  def('sun', (d, P) => {
    d.f(C(0, 0, 92, 0, TAU), 2, .9); d.s(C(0, 0, 92)); d.s(C(0, 0, 76, 1, TAU + 1), { i: 2, lw: 3 });
    for (let i = 0; i < 12; i++) { const a = i * TAU / 12 + P.t * .25, r0 = 120, r1 = 160 + (i % 2) * 30 + P.beat * 20; d.s(Ln(cos(a) * r0, sin(a) * r0, cos(a) * r1, sin(a) * r1, 3), { lw: 7 }); }
  });
  def(['flowers', 'beach'], (d, P) => {                               // la flor con cara del clip de referencia
    const sw = sin(P.t * 1.2) * 6;
    d.s(Bz([0, 40], [10 + sw, 100], [-10 + sw, 160], [sw, 215], 14), { lw: 7 });
    d.s(E(50 + sw * .6, 120, 46, 20, -.6)); d.s(E(-50 + sw * .6, 150, 46, 20, .6)); d.f(E(50 + sw * .6, 120, 46, 20, -.6), 3, .6); d.f(E(-50 + sw * .6, 150, 46, 20, .6), 3, .6);
    for (let i = 0; i < 10; i++) { const a = i * TAU / 10 - PI / 2, cx = cos(a) * 118, cy = -50 + sin(a) * 118; d.f(E(cx, cy, 44, 27, a), i % 2 ? 2 : 3, i % 2 ? .7 : .5); d.s(E(cx, cy, 44, 27, a), { lw: 5 }); }
    d.f(C(0, -50, 74, 0, TAU), 2, .35); d.s(C(0, -50, 74));
    d.dot(-26, -68, 8, 1); d.dot(26, -68, 8, 1); d.s(Pl([-30, -22], [-4, -6], [4, -6], [30, -22]), { lw: 5 });
  });
  def('love', (d, P) => {
    const s = 10.5 + P.beat * .8; d.f(heart(s, 0, -10), 2, .95); d.s(heart(s, 0, -10), { lw: 7 }); d.s(heart(s * .72, 0, -10), { i: 2, lw: 3 });
    for (let i = 0; i < 3; i++) { const k = (P.t * .3 + i / 3) % 1, x = -150 + i * 150, y = 190 - k * 260; d.s(heart(3.4 - i * .5, x, y), { lw: 4, single: true }); }
  });
  def(['moon', 'dark'], (d, P) => {
    const cr = [...E(0, 0, 118, 118, 0, PI * .5, PI * 1.5, 26), ...E(34, 0, 78, 118, 0, PI * 1.5, PI * .5, 26)];
    d.f(cr, 2, .85); d.s(cr, { lw: 7 });
    for (const [x, y, r, ph] of [[110, -100, 26, 0], [150, 20, 16, 1.7], [70, 100, 20, 3.1]]) d.s(spark(x, y, r * (1 + .25 * sin(P.t * 3 + ph)), .28), { lw: 4 });
    d.dot(-50, -50, 8, 1);
  });
  def('stars', (d, P) => {
    for (const [x, y, r, ph] of [[-70, -60, 92, 0], [110, 40, 60, 1.3], [-100, 120, 44, 2.6], [90, -130, 34, .7]]) { const k = 1 + .18 * sin(P.t * 3 + ph) + P.beat * .1; d.f(spark(x, y, r * k, .3), 2, .8); d.s(spark(x, y, r * k, .3), { lw: 6 }); }
  });
  def('rain', (d, P) => {
    const cp = cloudPts(0, -80, 1.35); d.f(cp, 3, .7); d.s(cp, { lw: 7 });
    for (let i = 0; i < 9; i++) { const k = (P.t * .9 + i * .37) % 1, x = -150 + i * 38, y = 40 + k * 170; d.s(Ln(x - 6, y, x - 14, y + 26, 2), { lw: 6, i: 1 }); }
  });
  def('snow', (d, P) => {
    for (const [x, y, r, sp] of [[-70, -30, 100, .3], [120, 70, 62, -.4], [-110, 130, 46, .5]]) for (let k = 0; k < 3; k++) { const a = k * PI / 3 + P.t * sp; d.s(Ln(x + cos(a) * r, y + sin(a) * r, x - cos(a) * r, y - sin(a) * r, 4), { lw: 6 }); }
    d.dot(150, -120, 9, 2); d.dot(-160, 40, 7, 2);
  });
  def('fire', (d, P) => {
    const f = sin(P.t * 9) * 8 + P.beat * 14, o = Bz([0, 190], [-150, 150], [-120, 20 - f], [-10, -190 - f], 16).concat(Bz([-10, -190 - f], [10, -80], [120, -20], [110, 90], 16), Bz([110, 90], [100, 160], [50, 190], [0, 190], 8));
    d.f(o, 2, .9); d.s(o, { lw: 7 });
    const i2 = Bz([0, 180], [-70, 150], [-60, 70], [0, 20 - f * .6], 12).concat(Bz([0, 20 - f * .6], [60, 70], [70, 150], [0, 180], 12)); d.f(i2, 3, .6); d.s(i2, { lw: 4 });
  });
  def(['sea', 'beachx'], (d, P) => {
    d.f([...Ln(-200, 20, 200, 20, 2), [200, 200], [-200, 200]], 3, .45);
    for (let r = 0; r < 4; r++) d.s(Array.from({ length: 30 }, (_, i) => [-200 + i * 400 / 29, 20 + r * 42 + sin(i * .55 + P.t * 2 + r) * 12]), { lw: 6 });
    d.f(C(120, -70, 46, 0, TAU), 2, .9); d.s(C(120, -70, 46)); d.s(Pl([-90, 10], [-90, -110], [-10, 10]), { lw: 6 }); d.f(Pl([-90, 10], [-90, -110], [-10, 10]), 2, .5);
  });
  def('city', (d, P) => {
    const bs = [[-190, 90, 130], [-130, 140, 210], [-50, 110, 290], [30, 130, 190], [100, 100, 250], [160, 90, 150]];
    bs.forEach(([x, w, h], i) => { d.f(Rc(x, 200 - h, w, h), i % 2 ? 3 : 2, .4); d.s(Rc(x, 200 - h, w, h), { lw: 6 });
      for (let k = 0; k < Math.floor(h / 46); k++) for (let j = 0; j < Math.floor(w / 36); j++) if (nz(i * 7 + k * 3 + j + Math.floor(P.t * .6)) > .45) d.dot(x + 20 + j * 36, 200 - h + 26 + k * 46, 8, 2); });
    d.s(Ln(-200, 200, 200, 200, 4), { lw: 7 });
  });
  def(['road', 'car'], (d, P) => {
    const b = sin(P.t * 12) * 2;
    const body = [[-150, 60 + b], [-150, 10 + b], [-100, 0 + b], [-60, -50 + b], [40, -50 + b], [90, 0 + b], [150, 10 + b], [150, 60 + b], [-150, 60 + b]];
    d.f(body, 2, .85); d.s(Pl(...body), { lw: 7 }); d.s(Pl([-52, -6], [-40, -42], [36, -42], [70, -6], [-52, -6]), { lw: 5 });
    for (const x of [-85, 85]) { d.f(C(x, 66, 32, 0, TAU), 1, .9); d.s(C(x, 66, 32)); d.s(Ln(x, 66, x + cos(P.t * 14) * 24, 66 + sin(P.t * 14) * 24, 1), { lw: 4 }); }
    for (let i = 0; i < 5; i++) d.s(Ln(-200 + ((i * 100 - P.t * 240) % 500 + 500) % 500 - 50, 130, -200 + ((i * 100 - P.t * 240) % 500 + 500) % 500 - 10, 130, 1), { lw: 6, single: true });
  });
  def(['fly', 'plane'], (d, P) => {
    for (const [x, y, s, ph] of [[-60, -40, 1.5, 0], [100, 40, 1, 1], [-130, 100, .8, 2], [40, -120, .7, 3]]) { const f = sin(P.t * 6 + ph) * 26 * s;
      d.s(Bz([x - 70 * s, y + f * .3], [x - 40 * s, y - 40 * s - f], [x - 10 * s, y - 20 * s], [x, y], 8).concat(Bz([x, y], [x + 10 * s, y - 20 * s], [x + 40 * s, y - 40 * s - f], [x + 70 * s, y + f * .3], 8)), { lw: 8 }); }
  });
  def('time', (d, P) => {
    d.f(C(0, 0, 150, 0, TAU), 3, .3); d.s(C(0, 0, 150)); d.s(C(0, 0, 132, 0, TAU), { lw: 3, i: 2 });
    for (let i = 0; i < 12; i++) { const a = i * TAU / 12; d.s(Ln(cos(a) * 118, sin(a) * 118, cos(a) * 104, sin(a) * 104, 1), { lw: i % 3 ? 4 : 7, single: true }); }
    const a1 = P.t * .5, a2 = P.t * 6; d.s(Ln(0, 0, cos(a1) * 60, sin(a1) * 60, 2), { lw: 9 }); d.s(Ln(0, 0, cos(a2) * 100, sin(a2) * 100, 2), { lw: 5, i: 2 }); d.dot(0, 0, 10, 1);
  });
  def('heaven', (d, P) => {
    for (let i = 0; i < 14; i++) { const a = -PI + i * PI / 13, r0 = 170, r1 = 230 + (i % 2) * 40 + P.beat * 20; d.s(Ln(cos(a) * r0, 40 + sin(a) * r0 * .7, cos(a) * r1, 40 + sin(a) * r1 * .7, 2), { lw: 6, i: 2 }); }
    const cp = cloudPts(0, 60, 1.5); d.f(cp, 3, .55); d.s(cp, { lw: 7 }); d.s(E(0, -110, 70, 18, 0, 0, TAU, 20), { lw: 8, i: 2 });
  });
  def('death', (d, P) => {
    d.f(E(0, -30, 100, 92), 3, .3); d.s(E(0, -30, 100, 92)); d.s(Pl([-58, 40], [-58, 120], [58, 120], [58, 40]), { lw: 7 });
    d.f(E(-40, -30, 26, 30), 1, .95); d.f(E(40, -30, 26, 30), 1, .95); d.s(Pl([-10, 30], [0, 8], [10, 30], [-10, 30]), { lw: 5 });
    for (let i = -2; i <= 2; i++) d.s(Ln(i * 22, 84, i * 22, 120, 1), { lw: 4 });
  });
  def('tears', (d, P) => {
    const tp = Bz([0, -180], [10, -110], [110, -20], [0, 100], 14).concat(Bz([0, 100], [-110, -20], [-10, -110], [0, -180], 14)); d.f(tp, 3, .8); d.s(tp, { lw: 7 });
    d.s(E(-30, 10, 16, 40, .3, PI * .9, PI * 1.6), { lw: 4, i: 2 });
    for (let i = 0; i < 3; i++) { const k = (P.t * .5 + i / 3) % 1, x = -110 + i * 110, y = 120 + k * 80; d.f(Bz([x, y - 22], [x + 14, y], [x + 14, y + 16], [x, y + 16], 5).concat(Bz([x, y + 16], [x - 14, y + 16], [x - 14, y], [x, y - 22], 5)), 3, .8 - k * .5); }
  });
  def('dream', (d, P) => {
    const cp = cloudPts(0, -50, 1.6); d.f(cp, 3, .45); d.s(cp, { lw: 7 });
    for (const [x, y, r] of [[-90, 110, 22], [-130, 160, 14], [-160, 195, 8]]) d.s(C(x, y, r), { lw: 5 });
    d.s(spark(-10, -60, 50 + sin(P.t * 2) * 6, .3), { i: 2, lw: 6 }); d.f(spark(-10, -60, 50, .3), 2, .8);
  });
  def(['gold', 'fashion'], (d, P) => {
    const top = [[-110, -40], [-60, -110], [60, -110], [110, -40], [0, 150], [-110, -40]];
    d.f(top, 2, .8); d.s(Pl(...top), { lw: 7 }); d.s(Pl([-110, -40], [110, -40]), { lw: 5 }); d.s(Pl([-60, -110], [-30, -40], [0, 150], [30, -40], [60, -110]), { lw: 4 });
    for (const [x, y, r, ph] of [[-140, -120, 34, 0], [150, -90, 26, 1.4], [130, 100, 20, 2.6]]) d.s(spark(x, y, r * (1 + .25 * sin(P.t * 4 + ph)), .28), { lw: 5 });
  });
  def('home', (d, P) => {
    d.f(Rc(-110, -10, 220, 190), 3, .4); d.s(Rc(-110, -10, 220, 190), { lw: 7 }); d.f(Pl([-140, -10], [0, -140], [140, -10], [-140, -10]), 2, .85); d.s(Pl([-140, -10], [0, -140], [140, -10], [-140, -10]), { lw: 7 });
    d.f(Rc(-30, 80, 60, 100), 1, .8); d.s(Rc(-30, 80, 60, 100), { lw: 5 }); d.f(Rc(50, 20, 40, 40), 2, .9 - .3 * sin(P.t * 2)); d.s(Rc(50, 20, 40, 40), { lw: 5 }); d.s(Rc(-90, 20, 40, 40), { lw: 5 });
    d.s(Rc(70, -130, 24, 60), { lw: 6 }); for (let k = 0; k < 3; k++) { const q = (P.t * .4 + k / 3) % 1; d.s(E(82 + q * 30, -150 - q * 60, 10 + q * 14, 8 + q * 10), { lw: 4, single: true }); }
  });
  def('thunder', (d, P) => {
    const cp = cloudPts(0, -100, 1.35); d.f(cp, 1, .55); d.s(cp, { lw: 7 });
    const bolt = [[20, -50], [-50, 50], [-6, 50], [-40, 190], [70, 30], [16, 30], [60, -50], [20, -50]]; d.f(bolt, 2, .95); d.s(Pl(...bolt), { lw: 7 });
  });
  def(['dance', 'woman', 'man', 'couple', 'crowd'], (d, P) => {
    const fig = (x, s, ph, hair) => { const w = sin(P.t * 5 + ph), y0 = 150;
      d.s(Ln(x, -20 * s, x, 70 * s, 3), { lw: 9 }); d.f(C(x, -60 * s, 34 * s, 0, TAU), 2, .5); d.s(C(x, -60 * s, 34 * s));
      if (hair) d.s(Bz([x - 34 * s, -60 * s], [x - 40 * s, -110 * s], [x + 40 * s, -110 * s], [x + 34 * s, -60 * s], 10), { lw: 8 });
      d.s(Ln(x, 0, x - 60 * s, -50 * s + w * 40 * s, 3), { lw: 8 }); d.s(Ln(x, 0, x + 60 * s, -50 * s - w * 40 * s, 3), { lw: 8 });
      d.s(Ln(x, 70 * s, x - 40 * s + w * 20 * s, y0 * s, 3), { lw: 8 }); d.s(Ln(x, 70 * s, x + 40 * s - w * 20 * s, y0 * s, 3), { lw: 8 }); };
    fig(-70, 1.15, 0, true); fig(80, 1.15, 1.6, false);
    for (let i = 0; i < 2; i++) { const k = (P.t * .35 + i * .5) % 1; d.s(spark(-10 + i * 40, 60 - k * 220, 14, .3), { lw: 4, single: true }); }
  });
  def('eyes', (d, P) => {
    const up = Bz([-190, 0], [-110, -130], [110, -130], [190, 0], 16), lo = Bz([190, 0], [110, 120], [-110, 120], [-190, 0], 16);
    d.f([...up, ...lo], -1 + 1 || 3, .0); d.s(up, { lw: 8 }); d.s(lo, { lw: 6 });
    const px = sin(P.t * .9) * 40, py = cos(P.t * .7) * 14; d.f(C(px, py, 66, 0, TAU), 2, .85); d.s(C(px, py, 66)); d.f(C(px, py, 30, 0, TAU), 1, 1); d.dot(px - 20, py - 22, 9, 3);
    for (let i = 0; i < 6; i++) { const a = -PI * .9 + i * PI * .36; d.s(Ln(cos(a) * 170, -20 + sin(a) * 80, cos(a) * 205, -20 + sin(a) * 118, 2), { lw: 6 }); }
  });
  def('light', (d, P) => {
    d.f(C(0, -50, 100, 0, TAU), 2, .8 + P.beat * .2); d.s(C(0, -50, 100)); d.s(Pl([-40, 40], [-36, 100], [36, 100], [40, 40]), { lw: 7 }); d.s(Rc(-38, 100, 76, 26), { lw: 6 }); d.s(Ln(-20, 150, 20, 150, 2), { lw: 8 });
    for (let i = 0; i < 9; i++) { const a = -PI + i * PI / 8 * 1.0 - .3, r0 = 130, r1 = 176 + P.beat * 24; d.s(Ln(cos(a) * r0, -50 + sin(a) * r0, cos(a) * r1, -50 + sin(a) * r1, 2), { lw: 6, i: 2 }); }
  });
  def('phone', (d, P) => {
    d.f(Rc(-70, -160, 140, 320), 1, .9); d.s(Rc(-70, -160, 140, 320), { lw: 8 }); d.f(Rc(-54, -130, 108, 240), 3, .6); d.s(Rc(-54, -130, 108, 240), { lw: 4 }); d.dot(0, 134, 9, 3);
    const k = Math.floor(P.t * 1.6) % 3; for (let i = 0; i < 3; i++) d.dot(-24 + i * 24, -40, 8 + (i === k ? 4 : 0), 2);
    const b = Bz([90, -110], [190, -130], [190, -30], [110, -40], 12); d.f([...b, [90, -110]], 2, .8); d.s(b, { lw: 6 });
  });
  def('music', (d, P) => {
    for (const [x, y, s] of [[-80, 70, 1], [90, 20, .8]]) { const b = Math.sin(P.t * 3 + x) * 8; d.f(E(x, y + b, 44 * s, 32 * s, -.4), 2, .95); d.s(E(x, y + b, 44 * s, 32 * s, -.4), { lw: 7 }); d.s(Ln(x + 38 * s, y + b - 6, x + 38 * s, -140 + y * .2 + b, 4), { lw: 8 }); }
    d.f([[-42, -76], [128, -128], [128, -84], [-42, -32]], 2, .9); d.s(Pl([-42, -76], [128, -128], [128, -84], [-42, -32], [-42, -76]), { lw: 6 });
  });
  def('drink', (d, P) => {
    d.f([[-130, -140], [130, -140], [0, 20]], 3, .55); d.s(Pl([-130, -140], [130, -140], [0, 20], [-130, -140]), { lw: 8 }); d.s(Ln(0, 20, 0, 170, 4), { lw: 9 }); d.s(Ln(-70, 176, 70, 176, 2), { lw: 9 });
    d.s(Ln(30, -190, 10, -60, 3), { lw: 6, i: 2 }); d.f(C(10, -60, 20, 0, TAU), 2, .9); d.s(C(10, -60, 20), { lw: 5 });
    for (let i = 0; i < 4; i++) { const k = (P.t * .5 + i * .25) % 1; d.s(C(-40 + i * 24, -30 - k * 90, 6, 0, TAU), { lw: 4, single: true }); }
  });
  def('money', (d, P) => {
    d.f(Rc(-170, -80, 340, 170), 3, .5); d.s(Rc(-170, -80, 340, 170), { lw: 8 }); d.s(Rc(-150, -62, 300, 134), { lw: 3, i: 2 }); d.f(C(0, 5, 52, 0, TAU), 2, .9); d.s(C(0, 5, 52));
    d.s(Bz([-18, -22], [20, -30], [-20, 10], [18, 30], 8), { lw: 7 }); d.s(Ln(0, -36, 0, 46, 2), { lw: 5 }); d.s(spark(150, -130, 30 + sin(P.t * 4) * 6, .3), { lw: 5 });
  });
  def('mountain', (d, P) => {
    d.f([[-200, 190], [-60, -110], [40, 20], [110, -60], [210, 190]], 3, .55); d.s(Pl([-200, 190], [-60, -110], [40, 20], [110, -60], [210, 190]), { lw: 8 });
    d.f(Pl([-90, -50], [-60, -110], [-30, -50], [-60, -70], [-90, -50]), -1 + 1 || 2, 0); d.s(Pl([-95, -40], [-75, -60], [-60, -40], [-45, -62], [-27, -40]), { lw: 5, i: 2 });
    d.f(C(120, -140, 34, 0, TAU), 2, .9); d.s(C(120, -140, 34));
  });
  def('forest', (d, P) => {
    const pine = (x, s, ph) => { const sw = sin(P.t + ph) * 4; for (let k = 0; k < 3; k++) { const y = 150 - k * 70 * s, w = (86 - k * 22) * s; d.f([[x - w + sw * k * .3, y], [x + sw * (k + 1) * .4, y - 90 * s], [x + w + sw * k * .3, y]], 3, .65); d.s(Pl([x - w, y], [x + sw * (k + 1) * .4, y - 90 * s], [x + w, y], [x - w, y]), { lw: 6 }); } d.s(Ln(x, 150, x, 190, 2), { lw: 8 }); };
    pine(-110, 1, 0); pine(30, 1.25, 1.3); pine(150, .8, 2.4);
  });
  def('smoke', (d, P) => {
    const sp = Array.from({ length: 70 }, (_, i) => { const a = i * .28 + P.t * .8, r = 6 + i * 2.4; return [cos(a) * r, -120 + i * 3.4 + sin(a) * r * .55]; }); d.s(sp, { lw: 8, amp: 3 });
  });
  def('fireworks', (d, P) => {
    for (const [x, y, r, ph] of [[-70, -40, 130, 0], [100, 60, 84, 1.9]]) { const k = .75 + .25 * sin(P.t * 3 + ph) + P.beat * .1;
      for (let i = 0; i < 14; i++) { const a = i * TAU / 14; d.s(Ln(x + cos(a) * r * .35 * k, y + sin(a) * r * .35 * k, x + cos(a) * r * k, y + sin(a) * r * k, 2), { lw: 6, i: i % 2 ? 1 : 2, single: true }); d.dot(x + cos(a) * r * 1.12 * k, y + sin(a) * r * 1.12 * k, 6, 2); } }
  });

  // encaje: desplazamiento y escala para que cada dibujo quepa en -200..200 (medido con tools/test_props.mjs)
  const ADJ = {"flowers":[0,-1.3,0.89],"beach":[0,-1.3,0.89],"love":[7.7,-34.6,0.967],"rain":[7.4,-28.5,0.926],"city":[-21.1,-46.4,0.844],"road":[-15.8,-28.1,0.72],"car":[-10.4,-29,0.742],"heaven":[-2.8,3.9,0.709],"tears":[0,-14.3,0.976],"home":[0,22.3,0.932],"light":[3.6,38.4,1],"mountain":[-4.6,-7.5,0.927],"forest":[-10.4,-24,0.916],"smoke":[3.6,-41.6,1],"fireworks":[11.4,15.5,0.951]};
  // ---------- API ----------
  // dibuja el objeto `id` en (x,y) con escala s; p = 0..1 cuánto se ha dibujado
  function drawProp(K, id, x, y, s, p, o = {}) {
    const dfn = DEFS[id] || DEFS.stars, c = K.c, P = { p: clamp(p), t: K.t + (o.ph || 0), beat: K.a.beat, n: dfn.n };
    const d = { idx: 0 };
    d.s = (pts, op) => { const lp = clamp(P.p * (P.n * .9 + .1) - d.idx * .9); d.idx++; if (api.probe) api.probe(pts); pen(K, pts, lp, { seed: (o.seed || 0) + d.idx * 3.1, ...op }); };
    d.f = (pts, ink, tone) => { if (api.probe) api.probe(pts); const a = clamp((P.p - .45) / .4); if (a > 0 && tone > 0) K.poly(pts, { f: ink, ft: tone * a }); };
    d.dot = (px, py, r, ink) => { if (api.probe) api.probe([[px - r, py - r], [px + r, py + r]]); if (P.p > .5) K.circ(px, py, r * clamp((P.p - .5) / .3), { f: ink }); };
    c.save(); c.translate(x, y); c.rotate((o.rot || 0) + sin(K.t * .8 + (o.ph || 0)) * .012); c.scale(s * (1 + K.a.beat * .025), s * (1 + K.a.beat * .025)); const aj = ADJ[id]; api.adj = aj || null; if (aj) { c.translate(aj[0], aj[1]); c.scale(aj[2], aj[2]); }
    try { dfn.draw(d, P); } finally { c.restore(); }
    dfn.n = Math.max(6, d.idx);
  }
  const api = RISO.props = { DEFS, def, variants: {}, drawProp, pen, ids: Object.keys(DEFS), geom: { E, C, Ln, Bz, Pl, Rc, cloudPts, spark, heart } };
})();
