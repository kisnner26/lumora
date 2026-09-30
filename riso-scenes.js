// ============================================================
// riso-scenes.js — las escenas ilustradas del motor riso.js.
// Cada escena: { id, name, inks, phrases, make(rng), draw(K, s, t, dt, a), notes?, cam? }
//   tinta 1 = contornos y trama oscura · tinta 2 = color principal · tinta 3 = acento
// Se dibuja en un lienzo virtual de 1600x900 y cada tinta va en su propia plancha.
// Los fondos rellenan de sobra para que la cámara pueda pasear sin mostrar bordes.
// ============================================================
(() => {
  const { register, nz } = RISO;
  const TAU = Math.PI * 2, sin = Math.sin, cos = Math.cos, PI = Math.PI;
  const O = (f, s = 1, lw = 5, ft = 1) => ({ f, ft, s, lw });        // atajo: relleno + contorno

  // ---------- piezas que se repiten ----------
  const helpers = {
    // hoja de planta apuntando en un ángulo
    leaf(K, x, y, len, wid, ang, o) { const c = K.c; c.save(); c.translate(x, y); c.rotate(ang); K.path(c => { c.moveTo(0, 0); c.quadraticCurveTo(len * .5, -wid, len, 0); c.quadraticCurveTo(len * .5, wid, 0, 0); }, o); c.restore(); },
    // nube de bordes redondos
    cloud(K, x, y, s, o) { K.path(c => { c.moveTo(x - 80 * s, y); c.arc(x - 50 * s, y - 6 * s, 34 * s, PI * .9, PI * 1.85); c.arc(x + 4 * s, y - 24 * s, 44 * s, PI * 1.1, PI * 1.9); c.arc(x + 56 * s, y - 4 * s, 32 * s, PI * 1.25, PI * .12); c.lineTo(x + 78 * s, y + 24 * s); c.lineTo(x - 80 * s, y + 24 * s); c.closePath(); }, o); },
    star(K, x, y, r, o, spikes = 4, inner = .38, rot = 0) { const pts = []; for (let i = 0; i < spikes * 2; i++) { const a = rot + i * PI / spikes - PI / 2, rr = i % 2 ? r * inner : r; pts.push([x + cos(a) * rr, y + sin(a) * rr]); } K.poly(pts, o); },
  };
  RISO.helpers = helpers;

  // ============================================================
  // 1 · oficina: silla giratoria, monitor con código, ventana con brillo
  // ============================================================
  register({
    id: 'oficina', name: 'oficina', inks: 0, tag: 'oficina',
    phrases: ['el lunes vuelve a empezar', 'el cursor parpadea y la ciudad no duerme', 'nadie recuerda quién dejó la luz prendida'],
    make: r => ({ th: r() * 6, w: 0, code: Array.from({ length: 40 }, () => [Math.floor(r() * 4) * 26, 60 + Math.floor(r() * 150), r() < .18]), clock: r() * 60, shine: 0 }),
    cam(cam, t) { cam.x = sin(t * .11) * 100 + sin(t * .043) * 40; cam.y = cos(t * .08) * 30; cam.z = 1.1 + sin(t * .057) * .06; cam.r = sin(t * .05) * .008; },
    draw(K, s, t, dt, a) {
      const c = K.c, v = K.v;
      // pared y piso
      K.bg(3, .09);
      K.rect(-800, -600, 4000, 1300, { f: 3, ft: .16 });
      c.fillStyle = K.lin(3, 0, 0, 0, 700, .3, .04); c.fillRect(-800, -600, 4000, 1300);
      K.rect(-800, 700, 4000, 900, { f: 2, ft: .42 });
      K.hatch(-800, 700, 4000, 900, 1, 26, -.35, 2, .55);
      K.line(-800, 700, 3000, 700, 1, 7);
      K.rect(-800, 664, 4000, 36, { f: 3, ft: .5 });                       // zócalo
      K.line(-800, 664, 3000, 664, 1, 4);
      // ventana
      const wx = 330, wy = 130, ww = 340, wh = 340;
      K.rect(wx, wy, ww, wh, { f: 3, ft: .55, s: 1, lw: 9 });
      K.clip(c => c.rect(wx, wy, ww, wh), () => {
        c.fillStyle = K.lin(2, 0, wy, 0, wy + wh, .0, .55); c.fillRect(wx, wy, ww, wh);         // atardecer en trama
        for (let i = 0; i < 9; i++) { const bx = wx + i * 44 - 10, bh = 90 + (i * 53 % 130); K.rect(bx, wy + wh - bh, 40, bh, { f: 1, ft: .9 }); if (K.d > 1) for (let k = 0; k < 5; k++) if (nz(i * 7 + k + Math.floor(t * .2)) > .55) K.rect(bx + 8 + (k % 2) * 16, wy + wh - bh + 14 + Math.floor(k / 2) * 28, 9, 12, { f: 2 }); }
        K.circ(wx + 270, wy + 110, 34, { f: 2, ft: 1 });
        s.shine = (s.shine + dt * .35) % 3;                                                        // el cristal brilla en barridos
        if (s.shine < 1) { const sx = wx - 200 + s.shine * 720; c.save(); c.translate(sx, wy); c.rotate(.5); K.rect(0, -200, 46, 900, { f: -1 }); K.rect(66, -200, 18, 900, { f: -1 }); c.restore(); }
        for (let i = 0; i < 10; i++) K.rect(wx, wy + 8 + i * 38 + (i % 2) * 2, ww, 7, { f: 1, ft: .16, over: true });   // persiana entreabierta
      });
      K.line(wx + ww / 2, wy, wx + ww / 2, wy + wh, 1, 8); K.line(wx, wy + wh / 2, wx + ww, wy + wh / 2, 1, 8);
      K.rect(wx - 22, wy + wh, ww + 44, 22, { f: 2, s: 1, lw: 6 });
      // postal pegada con cinta
      c.save(); c.translate(800, 150); c.rotate(-.06);
      K.rect(9, 9, 210, 140, { f: 1, ft: .3, over: true });
      K.rect(0, 0, 210, 140, { f: -1, s: 1, lw: 4 });
      K.rect(14, 14, 182, 96, { f: 3, ft: .6, s: 1, lw: 3 });
      K.circ(150, 44, 20, { f: 2 }); for (let i = 0; i < 3; i++) K.path(c => { c.moveTo(20, 84 + i * 8); for (let x = 20; x <= 190; x += 10) c.lineTo(x, 84 + i * 8 + sin(x * .2 + t * 2 + i) * 3); }, { s: 1, lw: 3 });
      K.txt('SALUDOS', 106, 132, { size: 20, font: 'mono', w: 500, align: 'center', ls: 3 });
      K.tape(105, 2, 100, 30, .05); c.restore();
      // reloj de pared: la aguja se mueve de verdad
      s.clock += dt * (6 + a.e * 40);
      const cx = 1120, cy = 190, cr = 70;
      K.circ(cx, cy, cr + 8, { f: 2, s: 1, lw: 7 }); K.circ(cx, cy, cr - 4, { f: -1, s: 1, lw: 3 });
      for (let i = 0; i < 12; i++) K.line(cx + cos(i * TAU / 12) * (cr - 12), cy + sin(i * TAU / 12) * (cr - 12), cx + cos(i * TAU / 12) * (cr - 22), cy + sin(i * TAU / 12) * (cr - 22), 1, i % 3 ? 3 : 5);
      const ha = s.clock / 720 * TAU - PI / 2, ma = s.clock / 60 * TAU - PI / 2;
      K.line(cx, cy, cx + cos(ha) * 34, cy + sin(ha) * 34, 1, 7); K.line(cx, cy, cx + cos(ma) * 54, cy + sin(ma) * 54, 1, 4); K.circ(cx, cy, 6, { f: 2, s: 1, lw: 3 });
      // escritorio
      K.rect(640, 556, 880, 40, { f: 2, s: 1, lw: 6 }); K.rect(640, 556, 880, 12, { f: 1, ft: .32, over: true });
      K.rect(668, 596, 34, 104, { f: 2, s: 1, lw: 6 }); K.rect(1458, 596, 34, 104, { f: 2, s: 1, lw: 6 });
      K.rect(710, 596, 740, 22, { f: 2, ft: .7, s: 1, lw: 5 });
      c.fillStyle = K.lin(1, 0, 618, 0, 700, .38, 0); c.globalCompositeOperation = 'lighter'; c.fillRect(702, 618, 756, 82); c.globalCompositeOperation = 'source-over';
      // monitor
      K.rect(925, 546, 30, 34, { f: 1, ft: .8 }); K.ell(940, 580, 76, 12, 0, { f: 1, ft: .9, s: 1, lw: 5 });
      K.rr(760, 326, 360, 224, 14, { f: 1, ft: .92, s: 1, lw: 7 });
      K.rr(778, 344, 324, 178, 6, { f: 3, ft: .9, s: 1, lw: 4 });
      K.clip(c => c.rect(778, 344, 324, 178), () => {
        const off = (t * 26) % 26;
        s.code.forEach((l, i) => { const y = 350 + i * 13 - off + 0; if (y < 340 || y > 520) return; K.rect(790 + l[0] * .55 * (1 + (i % 3) * .1), y, Math.min(230, l[1]), 6, { f: l[2] ? 2 : 1, ft: l[2] ? 1 : .8 }); });
        if (Math.floor(t * 2) % 2 === 0) K.rect(1060, 494, 14, 20, { f: 2 });
        c.globalCompositeOperation = 'lighter'; c.fillStyle = K.lin(1, 778, 344, 1102, 522, 0, .3); c.fillRect(778, 344, 324, 178); c.globalCompositeOperation = 'source-over';
      });
      K.circ(940, 535, 3.5, { f: 2 });
      K.rr(812, 542, 250, 20, 6, { f: -1, s: 1, lw: 4 }); for (let i = 0; i < 12; i++) K.line(826 + i * 19.5, 552, 830 + i * 19.5, 552, 1, 3, .7);
      // post-it en el monitor
      K.postit(1078, 292, 118, 96, .1, ['no', 'olvidar'], { size: 30, fill: 2, ft: .55 });
      // taza con vapor
      K.rr(1212, 496, 62, 62, 10, { f: -1, s: 1, lw: 6 }); K.path(c => { c.arc(1276, 526, 17, -PI / 2, PI / 2); }, { s: 1, lw: 6 });
      K.rect(1218, 502, 50, 14, { f: 2 });
      for (let i = 0; i < 3; i++) K.path(c => { for (let k = 0; k <= 14; k++) { const yy = 486 - k * 9, xx = 1230 + i * 14 + sin(t * 2.2 + k * .6 + i) * (3 + k * .5); k ? c.lineTo(xx, yy) : c.moveTo(xx, yy); } }, { s: 1, lw: 4, st: .55 - i * .1 });
      // lámpara
      const sw = sin(t * .6) * .03 + a.beat * .05;
      const bx = 1380, by = 556, kx = bx - 46 + sw * 100, ky = by - 150, hx = kx - 96 + sw * 140, hy = ky - 36;
      K.ell(bx, by - 2, 44, 10, 0, { f: 1, ft: .9, s: 1, lw: 4 });
      K.path(c => { c.moveTo(bx, by - 6); c.lineTo(kx, ky); c.lineTo(hx + 60, hy + 40); }, { s: 1, lw: 9, cap: 'round' });
      K.path(c => { c.moveTo(bx, by - 6); c.lineTo(kx, ky); c.lineTo(hx + 60, hy + 40); }, { s: 2, lw: 4 });
      K.circ(kx, ky, 9, { f: 2, s: 1, lw: 4 });
      c.save(); c.translate(hx + 60, hy + 40); c.rotate(-.6 + sw); K.path(c => { c.moveTo(-58, 6); c.lineTo(58, 6); c.lineTo(34, -44); c.lineTo(-34, -44); c.closePath(); }, { f: 2, s: 1, lw: 6 }); c.restore();
      K.glow(2, hx + 30, hy + 130, 300 + a.e * 60, .55 + a.beat * .2);
      // planta
      K.path(c => { c.moveTo(1420, 500); c.lineTo(1480, 500); c.lineTo(1470, 556); c.lineTo(1430, 556); c.closePath(); }, { f: 2, s: 1, lw: 6 });
      for (let i = 0; i < 7; i++) helpers.leaf(K, 1450, 500, 120 + (i % 3) * 22, 20, -PI / 2 + (i - 3) * .36 + sin(t * .9 + i) * .05 + a.beat * .03 * (i - 3), { f: 3, ft: .8, s: 1, lw: 4 });
      // silla giratoria
      const chx = 480, chy = 560; s.w += ((.35 + a.e * 1.4) - s.w) * dt * .8; s.th += (s.w + a.beat * 3.2) * dt;
      const th = s.th, cth = cos(th), sth = sin(th);
      K.ell(chx, 690, 150, 20, 0, { f: 1, ft: .45, over: true });
      const spokes = [0, 1, 2, 3, 4].map(k => { const ang = th + k * TAU / 5; return { x: chx + cos(ang) * 116, y: 668 + sin(ang) * 22, z: sin(ang) }; }).sort((p, q) => p.z - q.z);
      const spoke = p => { K.line(chx, 656, p.x, p.y, 1, 13); K.line(chx, 656, p.x, p.y, 2, 5); K.circ(p.x, p.y + 12, 13, { f: 2, s: 1, lw: 4 }); };
      spokes.filter(p => p.z < 0).forEach(spoke);
      K.rect(chx - 10, 580, 20, 84, { f: 1, ft: .9, s: 1, lw: 4 });
      spokes.filter(p => p.z >= 0).forEach(spoke);
      const back = () => { const bw = 150 * Math.abs(cth) + 22, bxx = chx + sth * 64; K.rr(bxx - bw / 2, 396, bw, 168, 30, { f: 2, s: 1, lw: 6 }); K.rr(bxx - bw / 2 + 8, 408, bw - 16, 68, 22, { f: 1, ft: .3, over: true });
        K.rect(bxx - 5, 560, 10, 34, { f: 1 }); if (bw > 60) K.line(bxx, 414, bxx, 548, 1, 3, .6); };
      if (cth > 0) back();
      K.rr(chx - 100, 548, 200, 38, 18, { f: 2, s: 1, lw: 6 }); K.rr(chx - 100, 566, 200, 20, 10, { f: 1, ft: .4, over: true });
      if (cth <= 0) back();
      K.line(chx + cos(th + PI / 2) * 100, 546, chx + cos(th + PI / 2) * 100, 486, 1, 8);        // apoyabrazos
      K.rr(chx + cos(th + PI / 2) * 100 - 34, 476, 68, 16, 8, { f: 2, s: 1, lw: 5 });
      // cable colgando
      K.path(c => { c.moveTo(1000, 578); c.bezierCurveTo(1000, 690, 1130, 660, 1140, 700); }, { s: 1, lw: 5 });
      K.circ(1140, 700, 6, { f: 2, s: 1, lw: 3 });
    },
    notes(K, s, t, a) {
      const v = K.v, m = K.m, p = (t * .16) % 1.7;
      K.card(v.l + m, v.t + m, 300, 176, -.01);
      K.code('LUN 08:00 · TICKET 4471', v.l + m + 16, v.t + m + 32, { size: 17 });
      K.circuit([[v.l + m + 16, v.t + m + 66], [v.l + m + 90, v.t + m + 66], [v.l + m + 90, v.t + m + 92], [v.l + m + 200, v.t + m + 92], [v.l + m + 200, v.t + m + 74], [v.l + m + 276, v.t + m + 74]], p, { i: 1, node: 2 });
      K.meter(v.l + m + 16, v.t + m + 140, 268, a.e, 'NIVEL', { n: 14 });
    },
  });

  // ============================================================
  // 2 · cuarto de noche: cama que respira, gato, luz de lámpara, guirnalda al ritmo
  // ============================================================
  register({
    id: 'cuarto', name: 'cuarto de noche', inks: 4, tag: 'cuarto',
    phrases: ['todo el mundo duerme menos esta canción', 'la lámpara guarda lo que no dijimos', 'a las tres de la mañana todo suena más fuerte'],
    make: r => ({ stars: Array.from({ length: 46 }, () => [r(), r(), r() * TAU, .6 + r()]), blink: 3 + r() * 3, bl: 0, disc: 0, tail: r() * 6, min: 17 }),
    cam(cam, t) { cam.x = sin(t * .09) * 90; cam.y = cos(t * .07) * 24; cam.z = 1.06 + sin(t * .05) * .05; cam.r = sin(t * .03) * .006; },
    draw(K, s, t, dt, a) {
      const c = K.c, br = sin(t * 1.15) * .5 + .5;
      // pared nocturna en trama densa y piso
      K.bg(1, .55);
      c.fillStyle = K.lin(1, 0, -100, 0, 720, .9, .5); c.fillRect(-800, -600, 4000, 1320);
      K.rect(-800, 720, 4000, 900, { f: 1, ft: .95 });
      K.line(-800, 720, 3000, 720, 3, 6);
      for (let i = 0; i < 14; i++) K.line(-200 + i * 190, 720, -400 + i * 260, 1000, 3, 3, 1);
      // ventana con luna, estrellas y cortinas
      const wx = 1020, wy = 90, ww = 380, wh = 400;
      K.rect(wx, wy, ww, wh, { f: 1, s: 3, lw: 9 });
      K.clip(c => c.rect(wx, wy, ww, wh), () => {
        for (const q of s.stars) { const tw = .5 + .5 * sin(t * q[3] * 2 + q[2]); K.circ(wx + q[0] * ww, wy + q[1] * wh * .8, (.9 + tw * 1.8) * (K.d > 1 ? 1 : 1.3), { f: -1 }); }
        K.circ(wx + 270, wy + 110, 46, { f: 2 }); K.circ(wx + 292, wy + 98, 42, { f: 1 });        // luna creciente
        K.glow(2, wx + 270, wy + 110, 120, .5);
        for (let i = 0; i < 9; i++) { const bx = wx + i * 46 - 6, bh = 60 + (i * 47 % 90); K.rect(bx, wy + wh - bh, 44, bh + 4, { f: 1, s: 3, lw: 3 }); for (let k = 0; k < 4; k++) if (nz(i * 5 + k + Math.floor(t * .1)) > .6) K.rect(bx + 8 + (k % 2) * 16, wy + wh - bh + 12 + (k >> 1) * 22, 8, 10, { f: 2 }); }
      });
      K.line(wx + ww / 2, wy, wx + ww / 2, wy + wh, 3, 7); K.line(wx, wy + wh * .55, wx + ww, wy + wh * .55, 3, 7);
      K.rect(wx - 20, wy + wh, ww + 40, 22, { f: 3, s: 1, lw: 5 });
      for (const sd of [-1, 1]) {                                                                        // cortinas que respiran con la brisa
        const bx = sd < 0 ? wx - 10 : wx + ww + 10, sw = sin(t * .8 + sd) * 10 + a.beat * 6;
        K.path(c => { c.moveTo(bx, wy - 20); c.lineTo(bx + sd * 90, wy - 20); c.bezierCurveTo(bx + sd * (100 + sw), wy + 150, bx + sd * (60 - sw), wy + 300, bx + sd * (96 + sw), wy + wh + 40); c.lineTo(bx, wy + wh + 40); c.closePath(); }, { f: 2, s: 1, lw: 6 });
        for (let k = 1; k < 4; k++) K.path(c => { c.moveTo(bx + sd * k * 22, wy - 10); c.quadraticCurveTo(bx + sd * (k * 22 + sw), wy + 200, bx + sd * (k * 22 + sw * .7), wy + wh + 30); }, { s: 1, lw: 3, st: .7 });
      }
      K.line(wx - 60, wy - 24, wx + ww + 60, wy - 24, 3, 8);
      // pósters con cinta
      c.save(); c.translate(420, 130); c.rotate(-.05); K.rect(8, 8, 190, 250, { f: 1, ft: .6, over: true }); K.rect(0, 0, 190, 250, { f: -1, s: 1, lw: 4 });
      K.circ(95, 96, 56, { f: 2 }); for (let i = 0; i < 6; i++) K.rect(0, 80 + i * 13, 190, 5 + i * 2, { f: -1 }); K.rect(14, 190, 162, 48, { f: 3, ft: .5 });
      K.txt('NOCHE', 95, 230, { size: 34, align: 'center', ls: 6 }); K.tape(95, 3, 90, 28, .03); c.restore();
      c.save(); c.translate(680, 190); c.rotate(.04); K.rect(8, 8, 150, 190, { f: 1, ft: .6, over: true }); K.rect(0, 0, 150, 190, { f: 3, ft: .55, s: 1, lw: 4 });
      for (let i = 0; i < 5; i++) K.rect(20 + i * 24, 150 - (nz(i * 3.1 + t * .6) * 100 + a.e * 40), 16, 24 + nz(i * 3.1 + t * .6) * 100 + a.e * 40, { f: i % 2 ? 2 : 1 }); K.tape(75, 3, 80, 26, -.03); c.restore();
      // guirnalda de focos al ritmo
      const gy = i => 78 + sin(i * .45) * 4 + 40 * Math.pow(sin(PI * (i / 30)), .5) * 0;
      K.path(c => { for (let i = 0; i <= 30; i++) { const x = -60 + i * 62, y = 60 + Math.abs(sin(PI * i / 3.3)) * 28; i ? c.lineTo(x, y) : c.moveTo(x, y); } }, { s: 1, lw: 3, st: 1 });
      for (let i = 0; i <= 30; i++) { const x = -60 + i * 62, y = 60 + Math.abs(sin(PI * i / 3.3)) * 28, on = (i + Math.floor(a.beats)) % 3, gl = on === 0 ? .6 + a.beat * .7 : .18;
        K.circ(x, y + 14, 9 + gl * 4, { f: on === 0 ? 2 : -1, s: 1, lw: 3 }); if (on === 0 && K.d > 1) K.glow(2, x, y + 14, 46 + a.beat * 22, .55); }
      // repisa con tocadiscos
      K.rect(120, 440, 520, 16, { f: 2, s: 1, lw: 5 }); K.path(c => { c.moveTo(150, 456); c.lineTo(150, 480); c.moveTo(610, 456); c.lineTo(610, 480); }, { s: 1, lw: 6 });
      K.rr(190, 382, 220, 58, 8, { f: 3, ft: .8, s: 1, lw: 5 }); s.disc += dt * (2.2 + a.e * 2.5);
      K.ell(300, 386, 88, 16, 0, { f: 1, s: 3, lw: 3 }); K.ell(300, 386, 28, 5, 0, { f: 2 });
      K.path(c => { const q = s.disc; c.ellipse(300, 386, 70, 12, 0, q, q + .8); }, { s: 3, lw: 3 });
      K.line(390, 382, 330, 388, 3, 4); K.circ(392, 382, 6, { f: 2, s: 1, lw: 2 });
      for (let i = 0; i < 4; i++) { const bx = 470 + i * 34; K.rect(bx, 386 - (i % 2) * 8, 28, 54 + (i % 2) * 8, { f: i % 2 ? 3 : 2, s: 1, lw: 4 }); K.line(bx + 6, 396, bx + 22, 396, 1, 2); }
      // cama con bulto que respira
      K.rect(80, 556, 760, 170, { f: 1, ft: .95, s: 3, lw: 6 });                                      // colchón oscuro
      K.rect(70, 470, 46, 260, { f: 2, s: 1, lw: 6 }); K.rect(800, 520, 34, 212, { f: 2, s: 1, lw: 6 });   // cabecera y pie
      K.rr(120, 500, 190, 80, 34, { f: -1, s: 1, lw: 6 }); K.path(c => { c.moveTo(150, 530); c.quadraticCurveTo(215, 512, 280, 530); }, { s: 1, lw: 3, st: .7 });
      const by = br * 8;
      K.path(c => { c.moveTo(300, 726); c.lineTo(310, 600 - by); c.bezierCurveTo(380, 520 - by * 1.5, 500, 540 - by, 620, 590 - by); c.lineTo(830, 600); c.lineTo(830, 726); c.closePath(); }, { f: 2, s: 1, lw: 6 });
      for (let i = 0; i < 6; i++) K.path(c => { c.moveTo(340 + i * 78, 600 - by * .7 + Math.abs(i - 2) * 6); c.quadraticCurveTo(360 + i * 78, 640, 350 + i * 78, 726); }, { s: 1, lw: 3, st: .8 });
      K.shade(c => { c.moveTo(300, 726); c.lineTo(310, 600); c.bezierCurveTo(380, 520, 500, 540, 620, 590); c.lineTo(830, 600); c.lineTo(830, 726); c.closePath(); }, 1, 0, .6, 0, 560, 0, 726);
      K.circ(240, 528 - by * .4, 44, { f: -1, s: 1, lw: 5 }); K.path(c => { c.arc(240, 528 - by * .4, 44, PI * .92, PI * 1.95); c.quadraticCurveTo(250, 500 - by * .4, 200, 512 - by * .4); c.closePath(); }, { f: 1, s: 1, lw: 3 });
      K.path(c => { c.arc(226, 534 - by * .4, 7, .2, PI - .2); }, { s: 1, lw: 3 }); K.path(c => { c.arc(256, 534 - by * .4, 7, .2, PI - .2); }, { s: 1, lw: 3 });
      if (K.d > 1) K.txt('z', 300 + sin(t) * 6, 480 - (t * 30 % 60), { font: 'hand', size: 36, i: 3 });
      // gato con cola que se mueve y parpadeo lento
      s.bl -= dt; if (s.bl < -.16) s.bl = 2 + Math.random() * 4;
      const cx = 700, cy = 588 - by * .3, eye = s.bl < 0 ? .1 : 1;
      K.path(c => { c.moveTo(cx - 44, cy + 20); c.bezierCurveTo(cx - 50, cy - 40, cx + 44, cy - 40, cx + 42, cy + 20); c.closePath(); }, { f: 3, s: 1, lw: 5 });
      K.circ(cx, cy - 46, 30, { f: 3, s: 1, lw: 5 }); K.poly([[cx - 26, cy - 62], [cx - 22, cy - 92], [cx - 6, cy - 72]], { f: 3, s: 1, lw: 4 }); K.poly([[cx + 26, cy - 62], [cx + 22, cy - 92], [cx + 6, cy - 72]], { f: 3, s: 1, lw: 4 });
      K.ell(cx - 11, cy - 48, 5, 5 * eye + .8, 0, { f: 1 }); K.ell(cx + 11, cy - 48, 5, 5 * eye + .8, 0, { f: 1 }); K.poly([[cx - 4, cy - 38], [cx + 4, cy - 38], [cx, cy - 33]], { f: 2 });
      K.path(c => { c.moveTo(cx + 40, cy + 14); c.bezierCurveTo(cx + 90, cy + 20 + sin(t * 1.6) * 20, cx + 80, cy - 60 + sin(t * 1.6 + 1) * 20, cx + 120, cy - 40 + sin(t * 2) * 24); }, { s: 1, lw: 12, cap: 'round' });
      K.path(c => { c.moveTo(cx + 40, cy + 14); c.bezierCurveTo(cx + 90, cy + 20 + sin(t * 1.6) * 20, cx + 80, cy - 60 + sin(t * 1.6 + 1) * 20, cx + 120, cy - 40 + sin(t * 2) * 24); }, { s: 3, lw: 6 });
      // mesa de noche, lámpara y despertador
      K.rect(880, 560, 150, 24, { f: 2, s: 1, lw: 6 }); K.rect(892, 584, 126, 142, { f: 2, s: 1, lw: 6 }); K.rr(905, 600, 100, 50, 6, { f: 1, s: 3, lw: 4 }); K.circ(955, 625, 5, { f: 3 });
      K.line(955, 476, 955, 556, 3, 8); K.ell(955, 556, 34, 8, 0, { f: 3, s: 1, lw: 4 });
      K.path(c => { c.moveTo(902, 480); c.lineTo(1008, 480); c.lineTo(986, 404); c.lineTo(924, 404); c.closePath(); }, { f: 2, s: 1, lw: 6 });
      K.glow(2, 955, 470, 380 + a.e * 60 + a.beat * 30, .62); K.glow(2, 955, 470, 200, .4);
      s.min += dt * .05; const hh = '03', mm = String(Math.floor(s.min) % 60).padStart(2, '0');
      K.rr(1000, 520, 74, 40, 8, { f: 1, s: 3, lw: 4 }); K.txt(hh + (Math.floor(t * 2) % 2 ? ':' : ' ') + mm, 1037, 549, { font: 'mono', size: 20, w: 500, align: 'center', i: 2 });
      // alfombra y zapatillas
      K.ell(720, 830, 380, 60, 0, { f: 2, ft: .5, s: 1, lw: 5 }); K.ell(720, 830, 260, 38, 0, { s: 1, lw: 3, st: .8 }); K.ell(720, 830, 130, 18, 0, { s: 3, lw: 3 });
      K.rr(360, 760, 60, 26, 12, { f: 3, s: 1, lw: 5 }); K.rr(430, 770, 60, 26, 12, { f: 3, s: 1, lw: 5 });
    },
    notes(K, s, t, a) {
      const v = K.v, m = K.m; K.card(v.l + m, v.t + m + 150, 300, 120, .012);
      K.code('SIN SEÑAL · 03:' + String(Math.floor(s.min) % 60).padStart(2, '0'), v.l + m + 16, v.t + m + 186, { size: 17 });
      K.meter(v.l + m + 16, v.t + m + 236, 268, .3 + a.e * .6, 'VOLUMEN', { n: 14 });
    },
  });

  // ============================================================
  // 3 · ciudad: capas con paralaje, ventanas que parpadean, autos, tren elevado
  // ============================================================
  register({
    id: 'ciudad', name: 'ciudad', inks: 5, tag: 'ciudad',
    phrases: ['la ciudad se enciende ventana por ventana', 'todos van a alguna parte con la misma canción', 'el atardecer dura lo que dura el estribillo'],
    make: r => {
      const layer = (n, mn, mx, gap, seed) => { const rr = RISO.rng(seed), out = []; let x = -900; for (let i = 0; i < n; i++) { const w = mn + rr() * (mx - mn); out.push({ x, w, h: 90 + rr() * 210, win: rr() * 99, ant: rr() < .3 }); x += w + gap * rr(); } return out; };
      return { far: layer(34, 90, 170, 14, 11), mid: layer(28, 120, 210, 24, 12), near: layer(22, 160, 250, 60, 13), cars: Array.from({ length: 6 }, (_, i) => ({ x: r() * 3200 - 800, v: (60 + r() * 90) * (i % 2 ? -1 : 1), y: 0, k: i })), birds: Array.from({ length: 9 }, (_, i) => ({ x: -200 - i * 60, y: 160 + r() * 140 + (i % 3) * 20, ph: r() * 6 })), train: -2400, tn: 0 };
    },
    cam(cam, t) { cam.x = t * 16 % 3200 - 1600 > 0 ? sin(t * .07) * 140 : sin(t * .07) * 140; cam.y = cos(t * .09) * 20; cam.z = 1.06 + sin(t * .045) * .05; cam.r = 0; },
    draw(K, s, t, dt, a) {
      const c = K.c;
      K.bg(2, .1); c.fillStyle = K.lin(2, 0, -300, 0, 640, .02, .8); c.fillRect(-1600, -1200, 6400, 1900);
      for (let i = 5; i > 0; i--) K.circ(1100, 300, 100 + i * 52, { f: 2, ft: .12, over: true });
      K.circ(1100, 300, 110 + a.beat * 6, { f: 2 });
      K.layer(.35, () => { for (const b of s.far) { K.rect(b.x, 640 - b.h * .9, b.w, b.h * .9 + 200, { f: 1, ft: .3 }); } });
      // nubes de trama
      for (let i = 0; i < 4; i++) { const cx = ((i * 520 + t * 8 * (1 + i * .2)) % 2400) - 500; helpers.cloud(K, cx, 180 + (i % 2) * 90, 1.2 + i * .1, { f: -1, s: 1, lw: 4 }); helpers.cloud(K, cx, 180 + (i % 2) * 90, 1.2 + i * .1, { f: 1, ft: .16, over: true }); }
      K.layer(.6, () => { for (const b of s.mid) { const top = 720 - b.h * .95; K.rect(b.x, top, b.w, 720 - top + 200, { f: 1, ft: .62, s: 1, lw: 4 }); for (let k = 0; k < Math.floor(b.h / 40); k++) for (let j = 0; j < Math.floor(b.w / 34); j++) if (nz(b.win + k * 3 + j * 7 + Math.floor(t * .12)) > .5) K.rect(b.x + 12 + j * 34, top + 16 + k * 40, 16, 18, { f: -1 }); } });
      // tren elevado que cruza cada tanto
      s.tn += dt; if (s.train > 3400) { s.train = -2600; }
      s.train += dt * (500 + a.e * 200);
      K.layer(.85, () => {
        K.rect(-1600, 618, 6400, 14, { f: 1, s: 1, lw: 4 }); for (let i = -6; i < 30; i++) K.rect(i * 200 - 8, 632, 14, 100, { f: 1 });
        for (let k = 0; k < 6; k++) { const x0 = s.train + k * 210; K.rr(x0, 548, 200, 68, 14, { f: 2, s: 1, lw: 5 }); for (let j = 0; j < 4; j++) K.rect(x0 + 16 + j * 44, 562, 32, 26, { f: -1, s: 1, lw: 3 }); }
      });
      c.save(); c.translate(0, -56);
      K.layer(1, () => { for (const b of s.near) {
        const top = 760 - b.h * 1.25; K.rect(b.x, top, b.w, 760 - top + 300, { f: 1, s: 1, lw: 6 });
        for (let k = 0; k < Math.floor(b.h * 1.25 / 46); k++) for (let j = 0; j < Math.floor(b.w / 38); j++) { const on = nz(b.win + k * 5 + j * 3 + Math.floor(t * .35)) > .48; K.rect(b.x + 14 + j * 38, top + 20 + k * 46, 22, 26, on ? { f: 2 } : { f: 1, s: 2, lw: 2, ft: 1 }); }
        if (b.ant) { K.line(b.x + b.w / 2, top, b.x + b.w / 2, top - 70, 1, 5); K.circ(b.x + b.w / 2, top - 74, 6 + a.beat * 3, { f: 2 }); }
        K.rect(b.x - 6, top - 12, b.w + 12, 14, { f: 1, s: 1, lw: 4 });
      } });
      // cartel luminoso
      K.layer(1, () => { K.line(560, 470, 560, 610, 1, 8); K.line(760, 470, 760, 610, 1, 8); K.rr(470, 340, 380, 150, 12, { f: 2, s: 1, lw: 7 }); K.rr(486, 356, 348, 118, 6, { f: -1, s: 1, lw: 4 }); K.txt('LUMORA', 660, 440, { size: 76, align: 'center', ls: 4, i: 2 }); K.txt('EN VIVO', 660, 462, { size: 16, align: 'center', font: 'mono', ls: 8 }); for (let i = 0; i < 16; i++) K.circ(486 + i * 23, 348, 4, (i + Math.floor(a.beats)) % 2 ? { f: 1 } : { f: -1, s: 1, lw: 2 }); });
      // calle, autos y postes
      K.rect(-1600, 760, 6400, 700, { f: 1, ft: .82 }); K.line(-1600, 760, 4800, 760, 1, 8);
      for (let i = -12; i < 40; i++) K.rect(i * 150 + ((t * 40) % 150), 850, 84, 8, { f: -1 });
      for (const car of s.cars) {
        car.x += car.v * dt * (.5 + a.e); if (car.v > 0 && car.x > 3200) car.x = -900; if (car.v < 0 && car.x < -900) car.x = 3200;
        const y = car.v > 0 ? 800 : 900, d = car.v > 0 ? 1 : -1, x = car.x;
        c.save(); c.translate(x, y); c.scale(d, 1);
        K.path(c => { c.moveTo(0, 0); c.lineTo(0, -34); c.quadraticCurveTo(10, -40, 30, -44); c.lineTo(60, -72); c.lineTo(120, -72); c.lineTo(146, -44); c.lineTo(190, -38); c.lineTo(194, 0); c.closePath(); }, { f: car.k % 3 ? 2 : 3, s: 1, lw: 6 });
        K.poly([[68, -66], [114, -66], [134, -44], [56, -44]], { f: -1, s: 1, lw: 4 }); K.circ(40, 2, 20, { f: 1, s: 1, lw: 5 }); K.circ(40, 2, 8, { f: 2 }); K.circ(152, 2, 20, { f: 1, s: 1, lw: 5 }); K.circ(152, 2, 8, { f: 2 });
        K.glow(2, 200, -20, 90, .7); c.restore();
      }
      for (let i = -3; i < 10; i++) { const x = i * 420 - ((0) % 420) + 140; K.line(x, 760, x, 560, 1, 8); K.path(c => { c.moveTo(x, 566); c.quadraticCurveTo(x + 36, 540, x + 60, 566); }, { s: 1, lw: 7 }); K.glow(2, x + 60, 580, 160 + a.e * 30, .5); }
      c.restore();
      // pájaros
      for (const b of s.birds) { b.x += dt * (90 + a.e * 40); if (b.x > 2000) b.x = -300; const fl = sin(t * 8 + b.ph) * 12; K.path(c => { c.moveTo(b.x - 22, b.y + fl * .3); c.quadraticCurveTo(b.x - 10, b.y - 12 - fl, b.x, b.y); c.quadraticCurveTo(b.x + 10, b.y - 12 - fl, b.x + 22, b.y + fl * .3); }, { s: 1, lw: 4 }); }
    },
    notes(K, s, t, a) {
      const v = K.v, m = K.m; K.card(v.l + m, v.t + m, 300, 116, -.008);
      K.code('SEMÁFORO 4 · LÍNEA 2', v.l + m + 16, v.t + m + 34, { size: 17 });
      K.circuit([[v.l + m + 16, v.t + m + 64], [v.l + m + 90, v.t + m + 64], [v.l + m + 90, v.t + m + 92], [v.l + m + 276, v.t + m + 92]], (t * .18) % 1.6, { i: 1, node: 2 });
    },
  });
})();
