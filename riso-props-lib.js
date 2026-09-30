// ============================================================
// riso-props-lib.js — biblioteca para escribir dibujos del catálogo de forma declarativa.
// Un dibujo es una lista de figuras en la caja -200..200 (x a la derecha, y hacia abajo):
//
//   RISO.lib.add('taza', 'objetos', 'TAZA', /\b(taza|mug|cup)\b/i, [
//     { p: 'M-70 -50 L70 -50 L60 90 Q0 110 -60 90 Z', f: 2, ft: .8, s: 8 },     // cuerpo: relleno tinta 2 al 80 % + contorno lw 8
//     { p: 'M70 -20 C110 -20 110 50 62 50', s: 7 },                             // asa: solo contorno
//     { p: 'M-20 -70 C-30 -110 -10 -120 -20 -160', s: 4, m: 'steam' },          // vapor que sube
//   ], { moods: ['nostalgico'], variantes: ['taza_b'] });
//
// Figura: p (trazado SVG: M L C Q H V Z, absolutos), c [cx, cy, r], e [cx, cy, rx, ry, rot], l [x0, y0, x1, y1],
//         pts [[x, y], ...] (polilínea); f = tinta de relleno (1, 2, 3, -1 = papel), ft = tono (.3 a .95),
//         s = grosor del contorno (0 = sin contorno), i = tinta del contorno (1 por defecto), open = no cerrar,
//         m = movimiento continuo, a = amplitud, v = velocidad, o = [x, y] pivote, ph = fase, b = reacción al ritmo.
// Movimientos: sway (balanceo) bob (sube y baja) pulse (late) spin (gira) flap (aletea) steam (sube y se repite)
//              drift (va y viene) blink (parpadea) beat (solo golpea con el ritmo) wag (menea rápido) fall (cae y se repite)
// Regla de trazo: contorno principal 7 a 9, detalles 4 a 6, mínimos 3. Rellenos entre .3 y .95. Sin texto dentro.
// ============================================================
(() => {
  const R = window.RISO; if (!R || !R.props || !R.catalog) return;
  const PI = Math.PI, TAU = PI * 2, sin = Math.sin, cos = Math.cos;

  // ---------- trazados SVG a puntos ----------
  const cache = new Map();
  function parse(str) {
    if (cache.has(str)) return cache.get(str);
    const t = str.match(/[MLCQHVZmlcqhvz]|-?\d*\.?\d+(?:e-?\d+)?/g) || []; let i = 0, cmd = '', x = 0, y = 0, sx = 0, sy = 0; const out = []; let cur = null;
    const num = () => parseFloat(t[i++]);
    const bez = (a, b, c, d) => { for (let k = 1; k <= 12; k++) { const u = k / 12, w = 1 - u; cur.push([w * w * w * a[0] + 3 * w * w * u * b[0] + 3 * w * u * u * c[0] + u * u * u * d[0], w * w * w * a[1] + 3 * w * w * u * b[1] + 3 * w * u * u * c[1] + u * u * u * d[1]]); } };
    while (i < t.length) {
      if (/[A-Za-z]/.test(t[i])) cmd = t[i++];
      switch (cmd) {
        case 'M': x = num(); y = num(); sx = x; sy = y; cur = [[x, y]]; out.push(cur); cmd = 'L'; break;
        case 'L': { const nx = num(), ny = num(); const n = Math.max(1, Math.ceil(Math.hypot(nx - x, ny - y) / 40)); for (let k = 1; k <= n; k++) cur.push([x + (nx - x) * k / n, y + (ny - y) * k / n]); x = nx; y = ny; break; }
        case 'H': { const nx = num(); const n = Math.max(1, Math.ceil(Math.abs(nx - x) / 40)); for (let k = 1; k <= n; k++) cur.push([x + (nx - x) * k / n, y]); x = nx; break; }
        case 'V': { const ny = num(); const n = Math.max(1, Math.ceil(Math.abs(ny - y) / 40)); for (let k = 1; k <= n; k++) cur.push([x, y + (ny - y) * k / n]); y = ny; break; }
        case 'C': { const a = [num(), num()], b = [num(), num()], e = [num(), num()]; bez([x, y], a, b, e); x = e[0]; y = e[1]; break; }
        case 'Q': { const a = [num(), num()], e = [num(), num()]; bez([x, y], [x + 2 / 3 * (a[0] - x), y + 2 / 3 * (a[1] - y)], [e[0] + 2 / 3 * (a[0] - e[0]), e[1] + 2 / 3 * (a[1] - e[1])], e); x = e[0]; y = e[1]; break; }
        case 'Z': cur.push([sx, sy]); x = sx; y = sy; break;
        default: i++;
      }
    }
    cache.set(str, out); return out;
  }
  const ell = (cx, cy, rx, ry, rot = 0, n = 28) => { const o = [], c = cos(rot), s = sin(rot); for (let i = 0; i <= n; i++) { const a = i / n * TAU, X = cos(a) * rx, Y = sin(a) * ry; o.push([cx + X * c - Y * s, cy + X * s + Y * c]); } return o; };

  // ---------- helpers para escribir trazados ----------
  const L = {
    rr: (x, y, w, h, r = 12) => `M${x + r} ${y} H${x + w - r} Q${x + w} ${y} ${x + w} ${y + r} V${y + h - r} Q${x + w} ${y + h} ${x + w - r} ${y + h} H${x + r} Q${x} ${y + h} ${x} ${y + h - r} V${y + r} Q${x} ${y} ${x + r} ${y} Z`,
    rect: (x, y, w, h) => `M${x} ${y} H${x + w} V${y + h} H${x} Z`,
    star: (cx, cy, r, n = 5, k = .42, rot = -PI / 2) => 'M' + Array.from({ length: n * 2 }, (_, i) => { const a = rot + i * PI / n, rr = i % 2 ? r * k : r; return `${(cx + cos(a) * rr).toFixed(1)} ${(cy + sin(a) * rr).toFixed(1)}`; }).join(' L') + ' Z',
    poly: (...p) => 'M' + p.map(q => q.join(' ')).join(' L') + ' Z',
    heart: (cx, cy, s) => 'M' + Array.from({ length: 33 }, (_, i) => { const a = i / 32 * TAU; return `${(cx + 16 * sin(a) ** 3 * s).toFixed(1)} ${(cy - (13 * cos(a) - 5 * cos(2 * a) - 2 * cos(3 * a) - cos(4 * a)) * s).toFixed(1)}`; }).join(' L') + ' Z',
    cloud: (cx, cy, s = 1) => `M${cx - 90 * s} ${cy + 30 * s} C${cx - 130 * s} ${cy + 30 * s} ${cx - 130 * s} ${cy - 30 * s} ${cx - 80 * s} ${cy - 30 * s} C${cx - 80 * s} ${cy - 80 * s} ${cx - 10 * s} ${cy - 90 * s} ${cx + 10 * s} ${cy - 45 * s} C${cx + 40 * s} ${cy - 70 * s} ${cx + 90 * s} ${cy - 50 * s} ${cx + 80 * s} ${cy - 10 * s} C${cx + 130 * s} ${cy - 10 * s} ${cx + 130 * s} ${cy + 30 * s} ${cx + 90 * s} ${cy + 30 * s} Z`,
    arc: (cx, cy, r, a0, a1) => { const o = []; for (let i = 0; i <= 16; i++) { const a = a0 + (a1 - a0) * i / 16; o.push(`${(cx + cos(a) * r).toFixed(1)} ${(cy + sin(a) * r).toFixed(1)}`); } return 'M' + o.join(' L'); },
  };

  // ---------- movimiento ----------
  function motion(sh, P, pts) {
    if (!sh.m) return pts;
    const t = P.t * (sh.v || 1), a = sh.a ?? .08, ph = sh.ph || 0, o = sh.o || [0, 0], beat = P.beat * (sh.b ?? 1);
    let tf;
    switch (sh.m) {
      case 'sway': case 'wag': { const ang = sin(t * (sh.m === 'wag' ? 7 : 1.6) + ph) * a + beat * a * .5, c = cos(ang), s = sin(ang); tf = q => [o[0] + (q[0] - o[0]) * c - (q[1] - o[1]) * s, o[1] + (q[0] - o[0]) * s + (q[1] - o[1]) * c]; break; }
      case 'spin': { const ang = t * (sh.a ?? 1) + ph, c = cos(ang), s = sin(ang); tf = q => [o[0] + (q[0] - o[0]) * c - (q[1] - o[1]) * s, o[1] + (q[0] - o[0]) * s + (q[1] - o[1]) * c]; break; }
      case 'bob': { const dy = sin(t * 2 + ph) * (sh.a ?? 8) - beat * 6; tf = q => [q[0], q[1] + dy]; break; }
      case 'drift': { const dx = sin(t * 1.2 + ph) * (sh.a ?? 14); tf = q => [q[0] + dx, q[1]]; break; }
      case 'pulse': { const k = 1 + sin(t * 3 + ph) * a * .5 + beat * a; tf = q => [o[0] + (q[0] - o[0]) * k, o[1] + (q[1] - o[1]) * k]; break; }
      case 'beat': { const k = 1 + beat * a; tf = q => [o[0] + (q[0] - o[0]) * k, o[1] + (q[1] - o[1]) * k]; break; }
      case 'flap': { const k = .35 + .65 * Math.abs(sin(t * 5 + ph)); tf = q => [q[0], o[1] + (q[1] - o[1]) * k]; break; }
      case 'steam': { const u = ((t * .5 + ph) % 1), dy = -u * (sh.a ?? 60) * 1.0; tf = q => [q[0] + sin(q[1] * .05 + t * 3) * 4, q[1] + dy]; break; }
      case 'fall': { const u = ((t * .5 + ph) % 1), dy = u * (sh.a ?? 120); tf = q => [q[0], q[1] + dy]; break; }
      case 'blink': { const b = (t * .6 + ph) % 4 < .12 ? .1 : 1; tf = q => [q[0], o[1] + (q[1] - o[1]) * b]; break; }
      default: return pts;
    }
    return pts.map(tf);
  }

  // ---------- dibujo ----------
  function build(shapes) {
    return (d, P) => {
      for (const sh of shapes) {
        let lists;
        if (sh.p) lists = parse(sh.p); else if (sh.c) lists = [ell(sh.c[0], sh.c[1], sh.c[2], sh.c[2], 0, sh.c[2] < 20 ? 12 : 26)]; else if (sh.e) lists = [ell(sh.e[0], sh.e[1], sh.e[2], sh.e[3], sh.e[4] || 0, 26)];
        else if (sh.l) lists = [[[sh.l[0], sh.l[1]], [(sh.l[0] + sh.l[2]) / 2, (sh.l[1] + sh.l[3]) / 2], [sh.l[2], sh.l[3]]]]; else if (sh.pts) lists = [sh.pts]; else continue;
        for (const pts0 of lists) {
          const pts = motion(sh, P, pts0);
          if (sh.f && pts.length > 2) d.f(pts, sh.f, sh.ft ?? .8);
          const lw = sh.s ?? (sh.f ? 6 : 6);
          if (lw) d.s(pts, { lw, i: sh.i || 1, single: !!sh.single, amp: sh.amp });
        }
      }
    };
  }
  // add(id, categoria, etiqueta, alias, formas, opciones)
  function add(id, cat, label, alias, shapes, opt = {}) {
    R.props.def(id, build(shapes));
    if (opt.hidden) return;
    R.catalog.add({ id, cat, label, alias, moods: opt.moods || [], variantes: opt.variantes, prio: opt.prio });
  }
  // una variante solo se dibuja (no se detecta por separado; el clip la elige con la semilla)
  function variant(id, shapes) { R.props.def(id, build(shapes)); }
  R.lib = { add, variant, parse, L, ell, build, motion };
})();
