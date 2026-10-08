// escenas en primera persona: el espectador ve lo que ve quien canta (la carretera desde el volante, la calle al caminar,
// la ventana del tren, el móvil en las manos, la pista de baile, el techo desde la cama). Mismas tintas y mismo motor que el resto.
// Cada una responde al ritmo (a.beat) y a la energía (a.e) y su movimiento depende solo del reloj de la toma.
(() => {
  const R = window.RISO; if (!R || !R.register) return;
  const sin = Math.sin, cos = Math.cos, PI = Math.PI, TAU = PI * 2, clamp = (v, a = 0, b = 1) => Math.max(a, Math.min(b, v));
  const VPX = 800, VPY = 420;
  // las manos de quien mira, dibujadas con el mismo trazo que los personajes
  const hand = (K, x, y, rot = 0, k = 1, grip = 1) => {
    const c = K.c; c.save(); c.translate(x, y); c.rotate(rot); c.scale(k, k);
    K.poly([[-58, 70], [-70, -10], [-44, -60], [44, -60], [72, -8], [60, 70]], { f: -1, s: 1, lw: 7 });                        // palma
    for (let i = 0; i < 4; i++) { const fx = -44 + i * 29, bend = grip * 18; K.poly([[fx - 13, -52], [fx - 13 + bend * .2, -112 + bend], [fx + 13 + bend * .2, -112 + bend], [fx + 13, -52]], { f: -1, s: 1, lw: 6 }); K.line(fx - 13, -80 + bend * .4, fx + 13, -80 + bend * .4, 1, 2, .5); }
    K.poly([[-70, 4], [-112, -34 + grip * 14], [-92, -58 + grip * 14], [-52, -20]], { f: -1, s: 1, lw: 6 });                  // pulgar
    K.poly([[-58, 70], [60, 70], [72, 160], [-70, 160]], { f: 2, ft: .9, s: 1, lw: 7 });                                        // la manga
    c.restore();
  };
  const sky = (K, a, top = 3, warm = 2) => { K.bg(top, .04); K.rect(-100, -100, 1800, VPY + 120, { f: warm, ft: .12 }); };
  const road = (K, t, speed, a, opt = {}) => {
    // la carretera en perspectiva: todo lo que pasa se acerca desde el punto de fuga y crece
    const wide = opt.wide || 1500;
    K.poly([[VPX - 14, VPY], [VPX + 14, VPY], [VPX + wide, 900], [VPX - wide, 900]], { f: 1, ft: opt.ft ?? .5, s: 1, lw: 5 });
    K.hatch?.(VPX - 700, VPY + 80, 1400, 420, 3, 24, -.7, 2, .18);
    for (let i = 0; i < 14; i++) {
      const d = (i / 14 + t * speed) % 1, p = Math.pow(d, 2.5), y = VPY + (900 - VPY) * p, w = 3 + p * 44, len = 6 + p * 130;
      K.poly([[VPX - w / 2, y], [VPX + w / 2, y], [VPX + w * .62, y + len], [VPX - w * .62, y + len]], { f: -1 });
      for (const side of [-1, 1]) { const ew = p * wide * .56, ex = VPX + side * ew; K.poly([[ex - 4 - p * 8, y], [ex + 4 + p * 8, y], [ex + 6 + p * 12, y + len], [ex - 6 - p * 12, y + len]], { f: 2, ft: .85 }); }
    }
  };
  const roadside = (K, t, speed, items, kind) => {
    for (const it of items) {
      const d = (it.ph + t * speed) % 1, p = Math.pow(d, 2.5), y = VPY + (900 - VPY) * p, x = VPX + it.side * (30 + (1 + it.off) * 780 * p), h = 30 + p * 520 * it.h;
      if (kind === 'poste') { K.line(x, y, x, y - h, 1, 2 + p * 12); K.line(x, y - h, x + it.side * -h * .22, y - h - h * .04, 1, 2 + p * 8); K.circ(x - it.side * h * .22, y - h - h * .04, 3 + p * 18, { f: 2, ft: .9 }); }
      else { K.rect(x - h * .05, y - h * .5, h * .1, h * .5, { f: 1, ft: .8 }); K.poly([[x - h * .3, y - h * .32], [x, y - h * 1.0], [x + h * .3, y - h * .32]], { f: 3, ft: .6, s: 1, lw: 2 + p * 4 }); }
    }
  };
  const tag = (K, text, x, y) => K.code?.(text, x, y, { size: 15 });

  // 1 · carretera: las manos en el volante, la raya central que se come el coche
  R.register({
    id: 'pov-carretera', name: 'carretera (primera persona)', inks: 0, tag: 'primera persona',
    phrases: ['las manos en el volante y el camino entero por delante', 'la raya del centro se acaba justo debajo de las luces'],
    make: r => ({ poles: Array.from({ length: 12 }, (_, i) => ({ ph: i / 12 + r() * .05, side: i % 2 ? -1 : 1, off: r() * .8, h: .7 + r() * .5 })), trees: Array.from({ length: 10 }, (_, i) => ({ ph: i / 10 + r() * .06, side: r() < .5 ? -1 : 1, off: .6 + r() * 1.4, h: .6 + r() * .9 })) }),
    cam(cam, t, a) { cam.x = sin(t * .6) * 10; cam.y = cos(t * 1.7) * 4 + a.beat * 5; cam.z = 1.015 + a.beat * .006; cam.r = sin(t * .35) * .006; },
    draw(K, s, t, dt, a) {
      const c = K.c, speed = .22 + a.e * .42;
      sky(K, a, 3, 2); K.glow(2, 1060, 300, 340 + a.beat * 40, .45); K.circ(1060, 310, 74, { f: 2, ft: .85, s: 1, lw: 4 });
      K.poly([[-100, VPY], [200, VPY - 90], [420, VPY - 30], [680, VPY - 150], [900, VPY - 40], [1180, VPY - 120], [1500, VPY - 20], [1700, VPY]], { f: 3, ft: .35, s: 1, lw: 3 });
      K.rect(-100, VPY, 1800, 520, { f: 1, ft: .1 });
      roadside(K, t, speed, s.trees, 'arbol'); road(K, t, speed, a); roadside(K, t, speed, s.poles, 'poste');
      for (let i = 0; i < 3; i++) K.glow(2, VPX + (i - 1) * 220, 880, 260 + a.beat * 60, .22);                                        // luz de los faros sobre el asfalto
      // tablero
      K.poly([[-100, 900], [-100, 780], [380, 745], [1220, 745], [1700, 780], [1700, 900]], { f: 1, ft: .95, s: 1, lw: 8 });
      K.hatch?.(-100, 770, 1800, 130, 3, 14, -.5, 2, .35);
      // retrovisor con la carretera que se aleja
      K.rect(670, 36, 260, 92, { f: -1, s: 1, lw: 7 }); K.poly([[690, 112], [800, 62], [910, 112]], { f: 1, ft: .5 }); K.line(800, 70, 800, 112, -1, 3);
      // velocímetro: la aguja sigue la energía de la canción
      K.circ(240, 840, 96, { f: -1, s: 1, lw: 7 }); for (let i = 0; i < 9; i++) { const an = PI * .8 + i * PI * .55 / 8 * 1.6; K.line(240 + cos(an) * 74, 840 + sin(an) * 74, 240 + cos(an) * 88, 840 + sin(an) * 88, 1, 3); }
      const an = PI * .8 + clamp(a.e) * PI * .9; K.line(240, 840, 240 + cos(an) * 80, 840 + sin(an) * 80, 2, 7); K.circ(240, 840, 10, { f: 1 });
      // volante y manos
      K.ell(800, 1010, 560, 270, 0, { s: 1, lw: 34, st: .95 }); K.ell(800, 1010, 560, 270, 0, { s: 2, lw: 8, st: .6 });
      hand(K, 430 + sin(t * .9) * 6, 860 + a.beat * 4, -.5, .86, 1); hand(K, 1170 - sin(t * .9) * 6, 860 + a.beat * 4, .5, .86, 1);
    },
    notes(K, s, t, a) { const v = K.v, m = K.m; K.card(v.l + m, v.t + m, 330, 112, -.012); K.code('A 112 KM/H · DE NOCHE', v.l + m + 16, v.t + m + 34, { size: 17 }); K.meter?.(v.l + m + 16, v.t + m + 66, 290, a.e); },
  });

  // 2 · caminar: la calle que viene hacia ti, el balanceo de cada paso y los brazos
  R.register({
    id: 'pov-caminar', name: 'caminar (primera persona)', inks: 1, tag: 'primera persona',
    phrases: ['cada paso sale al encuentro de la calle', 'caminar solo se ve mejor desde adentro'],
    make: r => ({ blds: Array.from({ length: 16 }, (_, i) => ({ ph: i / 16, side: i % 2 ? -1 : 1, h: .8 + r() * 1.1, w: .5 + r() * .4, win: 2 + ((r() * 4) | 0) })), lamps: Array.from({ length: 8 }, (_, i) => ({ ph: i / 8, side: i % 2 ? -1 : 1 })) }),
    cam(cam, t, a) { const step = sin(t * 5.4); cam.x = cos(t * 2.7) * 14; cam.y = Math.abs(step) * 16 - 8; cam.z = 1.03; cam.r = cos(t * 2.7) * .012; },
    draw(K, s, t, dt, a) {
      const speed = .1 + a.e * .1;
      sky(K, a, 2, 3); K.glow(3, VPX, VPY - 20, 520, .4); K.rect(-100, VPY, 1800, 520, { f: 1, ft: .08 });
      // edificios a los lados que crecen al acercarse
      const bl = [...s.blds].sort((x, y) => ((y.ph + t * speed) % 1) - ((x.ph + t * speed) % 1)).reverse();
      for (const b of bl) {
        const d = (b.ph + t * speed) % 1, p = Math.pow(d, 2.3), y = VPY + (900 - VPY) * p, wd = (60 + b.w * 520) * p, x0 = VPX + b.side * (20 + p * 760), h = 40 + b.h * 760 * p;
        const xa = b.side > 0 ? x0 : x0 - wd; K.rect(xa, y - h, wd, h, { f: 3, ft: .22 + (1 - p) * .1, s: 1, lw: 2 + p * 5 });
        for (let r = 0; r < 6; r++) for (let q = 0; q < b.win; q++) if ((r * 7 + q * 3 + ((b.ph * 100) | 0)) % 4 > 0) K.rect(xa + wd * (.12 + q * .8 / b.win), y - h + h * (.1 + r * .14), wd * .5 / b.win, h * .07, { f: 2, ft: .55 });
      }
      road(K, t, speed * 1.5, a, { ft: .3, wide: 900 });
      for (const l of s.lamps) { const d = (l.ph + t * speed) % 1, p = Math.pow(d, 2.3), y = VPY + (900 - VPY) * p, x = VPX + l.side * (40 + p * 620), h = 40 + p * 620; K.line(x, y, x, y - h, 1, 2 + p * 9); K.glow(2, x, y - h, 40 + p * 160, .7); }
      // los brazos que se balancean al caminar
      const sw = sin(t * 5.4) * 26;
      hand(K, 190 - sw * .6, 900 + Math.abs(sin(t * 5.4)) * 14 + a.beat * 6, -.15, 1.05, .6); hand(K, 1410 + sw * .6, 900 + Math.abs(sin(t * 5.4 + PI)) * 14 + a.beat * 6, .15, 1.05, .6);
      // sombra propia al frente
      K.ell(VPX, 880, 220, 36, 0, { f: 1, ft: .2 });
    },
  });

  // 3 · ventana de tren: el paisaje corre detrás del cristal, con la lluvia y el reflejo
  R.register({
    id: 'pov-ventana', name: 'ventana de tren (primera persona)', inks: 3, tag: 'primera persona',
    phrases: ['el mundo pasa del otro lado del cristal', 'la ventana va más rápido que lo que pienso'],
    make: r => ({ posts: Array.from({ length: 6 }, (_, i) => ({ ph: i / 6 })), hills: Array.from({ length: 5 }, () => r()), drops: Array.from({ length: 26 }, () => ({ x: r() * 1100, y0: r() * 560, v: .1 + r() * .25, w: 2 + r() * 3 })) }),
    cam(cam, t, a) { cam.x = sin(t * 1.9) * 7; cam.y = cos(t * 2.6) * 5 + a.beat * 3; cam.z = 1.01; cam.r = sin(t * 1.1) * .004; },
    draw(K, s, t, dt, a) {
      const c = K.c, X0 = 250, Y0 = 110, W = 1100, H = 600, speed = 340 + a.e * 480;
      K.bg(3, .05); K.rect(0, 0, 1600, 900, { f: 1, ft: .18 });
      // el paisaje, recortado al cristal
      c.save(); c.beginPath(); c.roundRect ? c.roundRect(X0, Y0, W, H, 64) : c.rect(X0, Y0, W, H); c.clip();
      K.rect(X0, Y0, W, H, { f: 3, ft: .14 }); K.glow(2, X0 + W * .72, Y0 + 150, 300, .55); K.circ(X0 + W * .72, Y0 + 150, 56, { f: 2, ft: .9, s: 1, lw: 3 });
      for (let layer = 0; layer < 3; layer++) { const k = [.12, .3, .8][layer], base = Y0 + [340, 400, 470][layer]; const off = (t * speed * k) % 520;
        for (let i = -1; i < 4; i++) { const x = X0 + i * 520 - off, hgt = 90 + s.hills[(i + 5 + layer) % 5] * 120 * (1 + layer * .3); K.poly([[x, base + 120], [x + 130, base - hgt * .6], [x + 270, base - hgt], [x + 420, base - hgt * .5], [x + 520, base + 120]], { f: layer % 2 ? 1 : 3, ft: .22 + layer * .18, s: 1, lw: 2 + layer * 2 }); } }
      K.rect(X0, Y0 + 500, W, 120, { f: 1, ft: .55 });
      for (const p of s.posts) { const x = X0 + (((p.ph * 1100 - t * speed * 1.4) % 1100) + 1100) % 1100; K.rect(x - 8, Y0 + 260, 16, 360, { f: 1, ft: .95 }); K.line(x - 70, Y0 + 300, x + 70, Y0 + 300, 1, 5); }
      // gotas en el cristal
      for (const d of s.drops) { const y = Y0 + ((d.y0 + t * d.v * 200) % 580), x = X0 + d.x + sin(t + d.w) * 4; K.ell(x, y, d.w, d.w * 3, 0, { s: 1, lw: 2, st: .6 }); }
      c.restore();
      // marco, cortinilla y las manos sobre el borde
      K.rect(X0 - 22, Y0 - 22, W + 44, H + 44, { s: 1, lw: 22, st: .95 }); K.rect(X0 - 4, Y0 - 4, W + 8, H + 8, { s: 2, lw: 5, st: .8 });
      K.rect(0, 0, X0 - 20, 900, { f: 1, ft: .9 }); K.rect(X0 + W + 20, 0, 1600 - X0 - W - 20, 900, { f: 1, ft: .9 });
      K.rect(X0 - 20, Y0 + H + 22, W + 40, 900 - (Y0 + H + 22), { f: 1, ft: .95 });
      K.line(X0 - 20, Y0 + H + 40, X0 + W + 20, Y0 + H + 40, -1, 3);
      hand(K, 560 + sin(t * 1.9) * 4, 840, -.2, .95, .5);
      // el reflejo de quien mira, muy tenue sobre el cristal
      K.ell(X0 + W * .3, Y0 + H * .55, 120, 150, 0, { f: -1, ft: .1, over: true });
    },
  });

  // 4 · móvil: las dos manos, la pantalla encendida y los mensajes que llegan
  R.register({
    id: 'pov-celular', name: 'móvil (primera persona)', inks: 4, tag: 'primera persona',
    phrases: ['la pantalla enciende la cara y lo demás se apaga', 'un mensaje nuevo cada vez que no quiero verlo'],
    make: r => ({ msgs: Array.from({ length: 6 }, (_, i) => ({ t0: i * 1.7 + r(), w: 220 + r() * 160, mine: r() < .4 })) }),
    cam(cam, t, a) { cam.x = sin(t * .7) * 8; cam.y = cos(t * .9) * 6 + a.beat * 3; cam.z = 1.02; cam.r = sin(t * .5) * .01; },
    draw(K, s, t, dt, a) {
      const c = K.c, cx = 800, top = 90, W = 470, H = 860;
      K.bg(1, .08); K.glow(3, cx, 430, 760 + a.beat * 60, .55);
      // el aparato, algo inclinado, con la luz de la pantalla
      c.save(); c.translate(cx, 560); c.rotate(-.05 + sin(t * .8) * .01); c.translate(-cx, -560);
      K.rect(cx - W / 2 - 18, top - 18, W + 36, H + 36, { f: 1, ft: .95, s: 1, lw: 8 }); K.rect(cx - W / 2, top, W, H, { f: -1, s: 1, lw: 5 });
      K.rect(cx - W / 2 + 12, top + 12, W - 24, H - 24, { f: 3, ft: .1 });
      K.rect(cx - 70, top + 6, 140, 22, { f: 1, ft: .95 });
      K.code?.('9:41', cx - W / 2 + 34, top + 66, { size: 22 }); K.rect(cx + W / 2 - 86, top + 44, 52, 22, { s: 1, lw: 3 }); K.rect(cx + W / 2 - 84, top + 46, 30 + a.e * 14, 18, { f: 2 });
      K.txt?.('ella', cx - W / 2 + 36, top + 140, { font: 'display', size: 44, w: 800, i: 1 });
      // la conversación: los mensajes entran uno a uno
      for (const [i, m] of s.msgs.entries()) { const k = clamp((t % 12 - m.t0) / .5); if (k <= 0) continue; const y = top + 190 + i * 100, x = m.mine ? cx + W / 2 - 36 - m.w : cx - W / 2 + 34;
        K.rect(x + 5, y + 5, m.w, 66, { f: 1, ft: .25 * k, over: true }); K.rect(x, y, m.w, 66, { f: m.mine ? 2 : -1, ft: .9 * k, s: 1, lw: 3 }); K.line(x + 18, y + 24, x + m.w * .7, y + 24, 1, 5, .7 * k); K.line(x + 18, y + 44, x + m.w * .45, y + 44, 1, 5, .5 * k); }
      // el corazón que sube al recibir el golpe
      const hk = a.beat; K.circ(cx + 140, top + H - 140 - hk * 30, 22 + hk * 10, { f: 2, ft: .9 });
      c.restore();
      // las manos que lo sostienen y el pulgar que se mueve
      hand(K, cx - W / 2 - 40, 840, -.5, .98, 1); hand(K, cx + W / 2 + 40, 840, .5, .98, 1);
      K.ell(cx + 60 + sin(t * 1.6) * 40, 660 + cos(t * 1.1) * 60, 26, 36, .4, { f: -1, s: 1, lw: 4 });
    },
  });

  // 5 · pista de baile: desde la tarima, los brazos arriba, los focos y el golpe
  R.register({
    id: 'pov-baile', name: 'pista de baile (primera persona)', inks: 2, tag: 'primera persona',
    phrases: ['desde aquí se ve la sala entera saltando', 'las luces nos dibujan a todos al mismo tiempo'],
    make: r => ({ crowd: Array.from({ length: 34 }, (_, i) => ({ x: (i * 53 + r() * 40) % 1700 - 50, row: i % 3, ph: r() * TAU, arm: r() < .55, h: .8 + r() * .5 })), beams: Array.from({ length: 6 }, (_, i) => ({ x: 200 + i * 240, ph: r() * TAU })) }),
    cam(cam, t, a) { cam.x = sin(t * .9) * 12; cam.y = a.beat * 8 + cos(t * 1.4) * 4; cam.z = 1.02 + a.beat * .015; cam.r = sin(t * .6) * .012; },
    draw(K, s, t, dt, a) {
      const c = K.c, flash = a.beat;
      K.bg(1, .1); K.rect(-100, -100, 1800, 1100, { f: 2, ft: .08 + flash * .12, over: true });
      for (const b of s.beams) { const an = sin(t * .8 + b.ph) * .5; c.save(); c.translate(b.x, -40); c.rotate(an); K.poly([[-10, 0], [10, 0], [190, 760], [-190, 760]], { f: [2, 3][(b.ph * 3 | 0) % 2], ft: .12 + flash * .16, over: true }); c.restore(); K.glow(2, b.x + sin(an) * 760, 720, 150, .5); }
      K.rect(-100, 560, 1800, 360, { f: 1, ft: .25 });
      // la gente de espaldas, de lejos a cerca; los brazos suben con el compás
      for (let row = 0; row < 3; row++) for (const p of s.crowd.filter(q => q.row === row)) {
        const k = [.55, .8, 1.15][row], jump = Math.abs(sin(t * 4.4 * .93 + p.ph)) * (10 + a.e * 24) * k + flash * 10 * k, y = [640, 720, 830][row] - jump, x = p.x + sin(t * .8 + p.ph) * 10;
        K.ell(x, y + 70 * k, 56 * k, 64 * k, 0, { f: 1, ft: .6 + row * .15, s: 1, lw: 3 }); K.circ(x, y, 30 * k, { f: (row + (p.x | 0)) % 2 ? 2 : 1, ft: .7 + row * .12, s: 1, lw: 3 });
        if (p.arm) { const up = (.6 + .4 * sin(t * 4 + p.ph)) * 100 * k; K.line(x - 36 * k, y + 20 * k, x - 56 * k, y - up, 1, 14 * k); K.circ(x - 56 * k, y - up - 10 * k, 10 * k, { f: -1, s: 1, lw: 2.5 }); }
      }
      // la tarima del espectador y las manos con el vaso arriba
      K.rect(-100, 860, 1800, 100, { f: 1, ft: .95 });
      hand(K, 380, 860 - flash * 24, -.3, 1, .9); hand(K, 1230 + sin(t * 4) * 10, 850 - flash * 30 - Math.abs(sin(t * 4)) * 30, .25, 1, 1);
      K.rect(1170, 590 - flash * 30, 120, 180, { f: -1, s: 1, lw: 6 }); K.rect(1176, 640 - flash * 30, 108, 124, { f: 2, ft: .7 });
      if (flash > .5) K.rect(-100, -100, 1800, 1100, { f: -1, ft: (flash - .5) * .35, over: true });                                 // el destello del golpe
    },
  });

  // 6 · cama: el techo, el ventilador que gira y la luz que entra por la persiana
  R.register({
    id: 'pov-cama', name: 'cama (primera persona)', inks: 5, tag: 'primera persona',
    phrases: ['el techo sabe todo lo que no dije', 'otra noche mirando cómo gira el ventilador'],
    make: r => ({ dust: Array.from({ length: 30 }, () => ({ x: r() * 1600, y: r() * 900, v: .2 + r() * .6, ph: r() * TAU })) }),
    cam(cam, t, a) { cam.x = sin(t * .25) * 8; cam.y = cos(t * .3) * 6; cam.z = 1.015 + sin(t * .2) * .01; cam.r = sin(t * .15) * .01; },
    draw(K, s, t, dt, a) {
      const c = K.c; K.bg(1, .1);
      K.rect(0, 0, 1600, 900, { f: 3, ft: .1 });
      // las vigas del techo en perspectiva
      for (let i = -4; i <= 4; i++) K.line(VPX + i * 40, 150, VPX + i * 240, 900, 1, 3, .35);
      for (let j = 0; j < 5; j++) K.line(300 + j * 22, 220 + j * 150, 1300 - j * 22, 220 + j * 150, 1, 2, .3);
      // la luz de la persiana: bandas que se mueven lentas
      for (let i = 0; i < 7; i++) { const y = 80 + i * 110 + sin(t * .3 + i) * 12; K.poly([[1100, y], [1560, y + 40], [1560, y + 88], [1100, y + 48]], { f: 2, ft: .2 + a.e * .1, over: true }); }
      K.glow(2, 1400, 300, 520, .4);
      // el ventilador de techo, girando: las aspas con desenfoque
      const fa = t * 3.4 + a.e * 2; c.save(); c.translate(VPX - 40, 380); c.scale(1, .55);
      for (let k = 0; k < 4; k++) { const an = fa + k * PI / 2; K.poly([[0, 0], [cos(an - .14) * 340, sin(an - .14) * 340], [cos(an + .14) * 340, sin(an + .14) * 340]], { f: 1, ft: .5, s: 1, lw: 5 }); K.poly([[0, 0], [cos(an - .6) * 330, sin(an - .6) * 330], [cos(an + .02) * 340, sin(an + .02) * 340]], { f: 3, ft: .18, over: true }); }
      c.restore(); K.circ(VPX - 40, 380, 34, { f: 1, ft: .95, s: 1, lw: 5 }); K.line(VPX - 40, 380, VPX - 40, 90, 1, 8);
      // polvo en la luz
      for (const d of s.dust) { const x = (d.x + sin(t * d.v + d.ph) * 40 + t * 6) % 1600, y = (d.y - t * d.v * 18 + 900) % 900; if (x > 1000) K.circ(x, y, 2 + (d.ph % 2), { f: -1, ft: .6 }); }
      // las manos sobre el pecho y la manta al borde de la vista
      K.poly([[-100, 900], [-100, 740], [500, 690], [1100, 700], [1700, 750], [1700, 900]], { f: 2, ft: .7, s: 1, lw: 8 }); K.hatch?.(-100, 700, 1800, 200, 3, 16, -.6, 2, .3);
      const br = sin(t * 1.1) * 8; hand(K, 640, 830 + br, .1, .9, .6); hand(K, 960, 840 + br, -.1, .9, .6);
    },
  });

  // ---------- cuándo aparecen ----------
  const RX = {
    'pov-carretera': /\b(driv\w*|car|cars|highway|road|wheel|speed\w*|ride|riding|taxi|cab|carretera|conduc\w+|manej\w+|autopista|carro|coche|volante|camino)\b/i,
    'pov-caminar': /\b(walk\w*|street|streets|steps?|wander\w*|stroll\w*|alone|lonely|paso|pasos|camin\w+|calle|calles|sol[oa]|vagar|andar)\b/i,
    'pov-ventana': /\b(window|train|plane|flight|bus|journey|trip|travel\w*|leaving|ventana|tren|avi[oó]n|viaje|vuelo|lejos)\b/i,
    'pov-celular': /\b(phone|call|calling|text\w*|message\w*|dm|whatsapp|screen|notification\w*|ghost\w*|llam\w+|celular|mensaje\w*|pantalla|m[oó]vil|chat)\b/i,
    'pov-baile': /\b(danc\w+|club|party|dj|floor|drink\w*|shots?|bottle\w*|bail\w+|fiesta|discoteca|rumba|trago\w*|perreo|crowd|gente)\b/i,
    'pov-cama': /\b(bed|sleep\w*|dream\w*|pillow|ceiling|insomnia|cama|dorm\w+|sue[nñ]o\w*|almohada|techo|insomnio)\b/i,
  };
  R.SCENE_RX = R.SCENE_RX || {}; Object.assign(R.SCENE_RX, RX);
  const BY_MOOD = { euforico: ['pov-baile', 'pov-carretera'], feliz: ['pov-carretera', 'pov-baile'], romantico: ['pov-caminar', 'pov-celular'], sereno: ['pov-ventana', 'pov-caminar'], nostalgico: ['pov-ventana', 'pov-cama'], melancolico: ['pov-cama', 'pov-ventana'], triste: ['pov-cama', 'pov-celular'], oscuro: ['pov-carretera', 'pov-cama'], rabioso: ['pov-carretera', 'pov-baile'], desafiante: ['pov-caminar', 'pov-carretera'] };
  R.pov = {
    ids: Object.keys(RX), rx: RX,
    // la letra manda; si no dice nada, de vez en cuando entra la primera persona que pide el ánimo
    pick(text, mood, r, chance = .3) {
      const hit = Object.entries(RX).filter(([, rx]) => rx.test(text || '')).map(([id]) => id);
      if (hit.length) return hit[(r() * hit.length) | 0];
      if (r() < chance) { const l = BY_MOOD[mood] || ['pov-caminar', 'pov-ventana']; return l[(r() * l.length) | 0]; }
      return null;
    },
  };
  for (const id of R.pov.ids) { const i = R.order.indexOf(id); if (i >= 0) R.order.splice(i, 1); }                            // no entran al sorteo ciego de escenas
})();
