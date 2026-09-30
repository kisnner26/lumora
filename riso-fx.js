// ============================================================
// riso-fx.js — efectos de cine del videoclip en risografía.
//   · tinta líquida: el corte entre estrofas es una mancha de tinta que se derrama y luego escurre hacia abajo
//   · papel rasgado: el corte es una hoja de papel con el borde roto que tapa la imagen y se retira
//   · palabras con peso: la palabra clave cae con golpe (más grande, más gruesa, sombra mal registrada, sacudida)
//   · taller de impresión: la portada se imprime pasada por pasada (tinta 1, 2, 3) con marcas de registro,
//     marcas de corte y barra de color; cada corte desajusta el registro un instante
// Cada efecto se apaga por separado en ajustes > efectos (CFG.fxCine). Todo es procedural sobre la plancha.
// ============================================================
(() => {
  const R = window.RISO; if (!R || !R.stage) return;
  const st = R.stage, { clamp, ease, easeOut } = R, sin = Math.sin, cos = Math.cos, PI = Math.PI, TAU = PI * 2;
  const FX = R.fx = { hits: new Set() };
  const on = k => { const c = window.CFG && CFG.fxCine; return !c || c[k] !== false; };
  FX.on = on;
  const rnd = () => Math.random();

  // ---------- tinta líquida y papel rasgado: se dibujan encima de la plancha, en coordenadas de pantalla ----------
  const wob = (a, s) => sin(a * 3 + s) * .5 + sin(a * 7 + s * 1.7) * .3 + sin(a * 13 + s * .6) * .2;
  function ink(K, cut) {
    const v = K.v, c = K.c, f = cut.fx || (cut.fx = { ox: v.l + (.2 + .6 * rnd()) * v.w, oy: v.t + (.2 + .6 * rnd()) * v.h, s: rnd() * 100,
      drips: Array.from({ length: 16 }, () => ({ x: rnd(), len: .25 + rnd() * .75, w: 12 + rnd() * 30 })) });
    const p = ease(cut.p);
    if (cut.ph === 'out') {                                                  // la mancha crece desde un punto, con lóbulos
      const Rmax = Math.max(...[[v.l, v.t], [v.r, v.t], [v.l, v.b], [v.r, v.b]].map(q => Math.hypot(q[0] - f.ox, q[1] - f.oy))) * 1.18, r0 = cut.p * Rmax, n = 90;
      for (const [i, k, tone, dx] of [[2, .94, .85, 22], [1, 1, .97, 0]]) {
        const pts = []; for (let i2 = 0; i2 < n; i2++) { const a = i2 / n * TAU, r = r0 * k * (1 + .2 * wob(a, f.s) * (1 - p * .5)); pts.push([f.ox + cos(a) * r + dx, f.oy + sin(a) * r]); }
        K.poly(pts, { f: i, ft: tone });
      }
    } else {                                                                  // la tinta escurre hacia abajo dejando goteras
      const step = 20, front = v.t - 260 + p * (v.h + 620), pts = [];
      for (let x = v.l - 40; x <= v.r + 40; x += step) {
        const u = (x - v.l) / v.w; let lag = wob(u * 9, f.s) * 46;
        for (const d of f.drips) { const dx = Math.abs(u - d.x) * v.w; if (dx < d.w) lag += d.len * 220 * Math.pow(cos(dx / d.w * PI / 2), 1.6); }
        pts.push([x, front - lag]);
      }
      pts.push([v.r + 40, v.b + 80], [v.l - 40, v.b + 80]);
      K.poly(pts, { f: 2, ft: .85 }); K.poly(pts.map(q => [q[0], q[1] + (q[1] < v.b ? 10 : 0)]), { f: 1, ft: .97 });
      for (const d of f.drips) { const x = v.l + d.x * v.w, y = front - d.len * 220 + 10; if (y < v.b && p < .96) K.circ(x, y + 6, d.w * .5, { f: 1, ft: .97 }); }
    }
  }
  function tear(K, cut) {
    const v = K.v, f = cut.fx || (cut.fx = { s: rnd() * 100, dir: rnd() < .5 ? 1 : -1, ang: (rnd() - .5) * .35 }), p = ease(cut.p), n = 60;
    const edge = y => { const u = (y - v.t) / v.h; return sin(u * 21 + f.s) * 14 + sin(u * 47 + f.s * 2) * 8 + sin(u * 113 + f.s * 3) * 4 + (u - .5) * f.ang * 300; };
    // la hoja cubre desde el lado de entrada; al retirarse, se va hacia el lado contrario
    const out = cut.ph === 'out', d = f.dir, far = v.w + 260;
    const pos = out ? p : 1 - p;                                             // 0 fuera de cuadro, 1 cubriendo todo
    const base = d > 0 ? v.l - 130 + pos * far : v.r + 130 - pos * far;
    const ys = []; for (let i = 0; i <= n; i++) ys.push(v.t - 40 + i / n * (v.h + 80));
    const front = ys.map(y => [base + edge(y), y]);
    const wall = d > 0 ? v.l - 400 : v.r + 400;
    const sheet = out ? [[wall, v.t - 60], ...front, [wall, v.b + 60]] : [[d > 0 ? v.r + 400 : v.l - 400, v.t - 60], ...front, [d > 0 ? v.r + 400 : v.l - 400, v.b + 60]];
    if (!out && d > 0) { /* al retirarse hacia la derecha la hoja queda a la derecha del frente */ }
    const shift = out ? d * 14 : -d * 14;
    K.poly(sheet.map(q => [q[0] + shift, q[1] + 10]), { f: 1, ft: .3 });                      // sombra de trama
    K.poly(sheet, { f: -1 });                                                                  // papel
    K.poly(sheet, { s: 1, lw: 3, st: .55 });
    // fibras blancas del rasgado: una segunda línea rota apenas adentro
    const fib = front.map((q, i) => [q[0] + (out ? -d : d) * (10 + 8 * sin(i * 1.9 + f.s)), q[1]]);
    K.poly(fib, { s: 3, lw: 2, st: .5 }, false);
    K.tape(out ? base - d * 90 : base + d * 90, v.t + v.h * .25, 110, 34, -.5); K.tape(out ? base - d * 110 : base + d * 110, v.t + v.h * .72, 110, 34, .4);
  }
  st.fxCut = (K, cut) => { if (cut.kind === 'ink') ink(K, cut); else tear(K, cut); };

  // elige el corte de una nueva estrofa según el ánimo; null = el de siempre
  FX.pickCut = (next, cur) => {
    const tr = window.CFG && CFG.transitions; if (!cur || tr === 'ninguna' || rnd() > .75) return null;
    const dark = ['rabioso', 'oscuro', 'desafiante', 'euforico'].includes(next.mood);
    const opts = []; if (tr !== 'suaves' && on('tinta') && (dark || rnd() < .3)) opts.push('ink'); if (on('papel') && (!dark || rnd() < .3)) opts.push('tear');
    return opts.length ? opts[(rnd() * opts.length) | 0] : null;
  };

  // ---------- palabras con peso ----------
  FX.weight = () => on('peso');
  FX.slam = (key) => { if (FX.hits.size > 300) FX.hits.clear(); if (!FX.hits.has(key)) { FX.hits.add(key); st.kick = Math.max(st.kick || 0, .7); if (!R.A.live) R.A.beat = Math.max(R.A.beat || 0, .6); } };

  // ---------- taller de impresión ----------
  FX.beforeFrame = shot => {
    const kt = shot ? R.K.t - shot.k0 : 9;
    if (on('taller') && shot && (shot.kind === 'title' || shot.kind === 'outro')) st.pass = [clamp(kt / .4), clamp((kt - .55) / .4), clamp((kt - 1.1) / .4)]; else st.pass = [1, 1, 1];
    if (!(window.RISOCLIP && RISOCLIP.mix && RISOCLIP.mix.on)) {
      if (st.cut && st.cut.swapped && !st.cut._reg) { st.cut._reg = 1; if (on('taller')) FX.reg = .9; }
      if (FX.reg > .01) { st.regBoost = FX.reg; FX.reg *= .9; } else if (FX.reg) { FX.reg = 0; st.regBoost = 0; }
    }
    st.fxAfter = on('taller') && shot && (shot.kind === 'title' || shot.kind === 'outro' || kt < 1.3) ? (K => press(K, shot, kt)) : null;
  };
  function target(K, x, y, r, tone) {
    for (const [i, dx, dy] of [[1, 0, 0], [2, 3, -2], [3, -2, 3]]) { K.circ(x + dx, y + dy, r, { s: i, lw: 2.4, st: tone }); K.line(x - r * 1.5 + dx, y + dy, x + r * 1.5 + dx, y + dy, i, 2.2, tone); K.line(x + dx, y - r * 1.5 + dy, x + dx, y + r * 1.5 + dy, i, 2.2, tone); }
  }
  function press(K, shot, kt) {
    const v = K.v, m = 20, full = shot.kind === 'title' || shot.kind === 'outro', tone = full ? .9 : clamp(1.3 - kt) * .9; if (tone <= .02) return;
    target(K, v.l + m + 14, v.t + m + 14, 9, tone); target(K, v.r - m - 14, v.t + m + 14, 9, tone); target(K, v.l + m + 14, v.b - m - 14, 9, tone); target(K, v.r - m - 14, v.b - m - 14, 9, tone);
    for (const [x, y, dx, dy] of [[v.l + 3, v.t + 3, 1, 1], [v.r - 3, v.t + 3, -1, 1], [v.l + 3, v.b - 3, 1, -1], [v.r - 3, v.b - 3, -1, -1]]) { K.line(x, y + dy * 18, x, y + dy * 6, 1, 2, tone); K.line(x + dx * 18, y, x + dx * 6, y, 1, 2, tone); }
    if (full) {                                                                // barra de color y cuña de tonos
      const bx = v.l + m + 60, by = v.b - m - 44;
      for (let i = 0; i < 3; i++) for (let k = 0; k < 6; k++) K.rect(bx + k * 22 + i * 150, by, 20, 20, { f: i + 1, ft: .18 + k * .16 });
      const pass = st.pass || [1, 1, 1], n = pass.filter(q => q >= .99).length + (pass.some(q => q > 0 && q < .99) ? 1 : 0);
      K.code(`PASADA ${Math.max(1, Math.min(3, n))}/3 · TINTA ${Math.max(1, Math.min(3, n))}`, bx, by - 12, { size: 15, bg: true });
    }
  }
})();

// ajustes: un chip por efecto
if (window.SETUI && window.CFG) SETUI.addRow('efectos', ['fxCine', 'Efectos de cine', 'chips', [['tinta', 'tinta líquida'], ['papel', 'papel rasgado'], ['peso', 'palabras con peso'], ['taller', 'taller de impresión']], 'cortes de tinta y de papel entre estrofas, la palabra clave que cae con golpe y la portada impresa pasada por pasada'], { tinta: true, papel: true, peso: true, taller: true });
