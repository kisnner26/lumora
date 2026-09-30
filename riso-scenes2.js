// ============================================================
// riso-scenes2.js — espacio, bosque, retrato y museo (motor riso.js).
// ============================================================
(() => {
  const { register, nz, helpers } = RISO;
  const TAU = Math.PI * 2, sin = Math.sin, cos = Math.cos, PI = Math.PI;

  // ============================================================
  // 4 · espacio: planeta con anillos, luna en órbita, cohete, astronauta atado
  // ============================================================
  register({
    id: 'espacio', name: 'espacio', inks: 3, tag: 'espacio',
    phrases: ['a esta distancia todo suena más despacio', 'cada estrella es una nota que nadie apagó', 'la gravedad también sabe bailar'],
    make: r => ({
      stars: Array.from({ length: 110 }, () => [r(), r(), r() * TAU, .5 + r() * 2, r()]), rocks: Array.from({ length: 7 }, (_, i) => ({ x: r() * 1800 - 100, y: 120 + r() * 660, s: 16 + r() * 30, v: 6 + r() * 14, a: r() * TAU, w: (r() - .5) * .6, k: r() })),
      rocket: { x: -400, y: 200, on: false, wait: 3 }, comet: { x: -500, y: 100, wait: 6 }
    }),
    cam(cam, t) { cam.x = sin(t * .1) * 70; cam.y = cos(t * .07) * 40; cam.z = 1.05 + sin(t * .05) * .04; cam.r = sin(t * .035) * .012; },
    draw(K, s, t, dt, a) {
      const c = K.c;
      K.bg(1, .8); c.fillStyle = K.lin(1, 0, -200, 0, 900, .9, .58); c.fillRect(-2000, -1400, 6000, 2600);
      K.glow(3, 380, 620, 620, .5); K.glow(2, 1240, 220, 520, .35); K.glow(3, 1300, 760, 420, .4);
      K.layer(.4, () => { for (const q of s.stars) { const tw = .5 + .5 * sin(t * q[3] + q[2]), x = -200 + q[0] * 2000, y = -100 + q[1] * 1200; if (q[4] > .93) helpers.star(K, x, y, 7 + tw * 6, { f: 2 }, 4, .3); else K.circ(x, y, .9 + tw * 1.6 * (K.d > 1 ? 1 : 1.3), { f: -1 }); } });
      // el sol lejano con rayos
      K.circ(200, 150, 62 + a.beat * 5, { f: 2, s: 1, lw: 6 });
      for (let i = 0; i < 16; i++) { const an = i * TAU / 16 + t * .1, r0 = 84, r1 = 104 + (i % 2) * 24 + a.beat * 14; K.line(200 + cos(an) * r0, 150 + sin(an) * r0, 200 + cos(an) * r1, 150 + sin(an) * r1, 2, 7); }
      // planeta pequeño
      const px = 330, py = 330 + sin(t * .4) * 12;
      K.circ(px, py, 78, { f: 3, s: 1, lw: 6 }); K.shade(c => c.arc(px, py, 78, 0, TAU), 1, 0, .8, px - 70, py - 70, px + 70, py + 70);
      K.circ(px - 24, py - 20, 14, { f: -1, s: 1, lw: 3 }); K.circ(px + 26, py + 24, 9, { f: -1, s: 1, lw: 3 }); K.circ(px + 14, py - 34, 6, { f: -1, s: 1, lw: 3 });
      // planeta grande con bandas que giran y anillos
      const gx = 1010, gy = 470, gr = 200, tilt = -.32;
      const ring = (front) => { c.save(); c.translate(gx, gy); c.rotate(tilt); c.beginPath(); c.ellipse(0, 0, 350, 86, 0, front ? 0 : PI, front ? PI : TAU); c.strokeStyle = K.ink(1); c.lineWidth = 42; c.stroke();
        c.beginPath(); c.ellipse(0, 0, 350, 86, 0, front ? 0 : PI, front ? PI : TAU); c.strokeStyle = K.ink(3); c.lineWidth = 30; c.stroke();
        c.beginPath(); c.ellipse(0, 0, 318, 76, 0, front ? 0 : PI, front ? PI : TAU); c.strokeStyle = K.ink(1); c.lineWidth = 3; c.stroke();
        c.beginPath(); c.ellipse(0, 0, 380, 94, 0, front ? 0 : PI, front ? PI : TAU); c.strokeStyle = K.ink(1); c.lineWidth = 3; c.stroke(); c.restore(); };
      ring(false);
      K.circ(gx, gy, gr, { f: 2, s: 1, lw: 8 });
      K.clip(c => c.arc(gx, gy, gr, 0, TAU), () => {
        const off = (t * 14) % 80;
        for (let i = -4; i < 6; i++) { const y = gy - 220 + i * 80 + off; K.path(c => { c.moveTo(gx - 220, y); c.bezierCurveTo(gx - 80, y + 26, gx + 80, y - 26, gx + 220, y + 12); c.lineTo(gx + 220, y + 34 + (i % 2) * 16); c.bezierCurveTo(gx + 80, y + 8, gx - 80, y + 60, gx - 220, y + 34); c.closePath(); }, { f: i % 2 ? 1 : 3, ft: i % 2 ? .5 : .9 }); }
        K.ell(gx - 60 + sin(t * .3) * 6, gy + 60, 54, 30, 0, { f: 3, s: 1, lw: 4 });
        c.globalCompositeOperation = 'lighter'; c.fillStyle = K.lin(1, gx - gr, gy - gr, gx + gr * .9, gy + gr * .9, 0, .95); c.fillRect(gx - gr, gy - gr, gr * 2, gr * 2); c.globalCompositeOperation = 'source-over';
      });
      ring(true);
      // luna en órbita
      const oa = t * .5, mx = gx + cos(oa) * 480, my = gy + sin(oa) * 190 - 40;
      if (sin(oa) < 0) { K.circ(mx, my, 34, { f: -1, s: 1, lw: 5 }); K.circ(mx - 8, my - 6, 8, { f: 3 }); }
      K.path(c => { c.ellipse(gx, gy - 40, 480, 190, 0, 0, TAU); }, { s: 1, lw: 2.5, st: 1, dash: [8, 14] });
      // asteroides
      for (const r of s.rocks) { r.x -= dt * r.v * (1 + a.e); r.a += r.w * dt; if (r.x < -150) r.x = 1800; c.save(); c.translate(r.x, r.y + sin(t * .3 + r.k * 9) * 10); c.rotate(r.a);
        K.poly([[-r.s, -r.s * .3], [-r.s * .4, -r.s], [r.s * .7, -r.s * .6], [r.s, r.s * .2], [r.s * .3, r.s], [-r.s * .7, r.s * .7]], { f: -1, s: 1, lw: 5 }); K.circ(-r.s * .2, 0, r.s * .22, { s: 1, lw: 3 }); c.restore(); }
      // cohete que cruza
      const R = s.rocket; R.wait -= dt;
      if (!R.on && R.wait < 0) { R.on = true; R.x = -300; R.y = 700; }
      if (R.on) { R.x += dt * (220 + a.e * 160); R.y -= dt * (90 + a.e * 60); if (R.x > 2000) { R.on = false; R.wait = 6 + Math.random() * 6; }
        c.save(); c.translate(R.x, R.y); c.rotate(-.36);
        for (let i = 0; i < 9; i++) K.circ(-50 - i * 26, 4 + sin(t * 9 + i) * 4, 12 - i, { f: -1 });
        K.path(c => { c.moveTo(-42, 8); c.quadraticCurveTo(-88 - a.beat * 30, 0, -42, -8 - 4); c.closePath(); }, { f: 2, s: 1, lw: 4 });
        K.path(c => { c.moveTo(-40, -20); c.lineTo(-58, -46); c.lineTo(-20, -24); c.closePath(); c.moveTo(-40, 20); c.lineTo(-58, 46); c.lineTo(-20, 24); c.closePath(); }, { f: 2, s: 1, lw: 5 });
        K.path(c => { c.moveTo(-44, -20); c.lineTo(50, -20); c.quadraticCurveTo(110, 0, 50, 20); c.lineTo(-44, 20); c.closePath(); }, { f: -1, s: 1, lw: 6 }); K.circ(20, 0, 10, { f: 3, s: 1, lw: 4 }); K.rect(-20, -20, 14, 40, { f: 2 }); c.restore(); }
      // astronauta atado
      const ax = 420 + sin(t * .35) * 30, ay = 640 + cos(t * .3) * 22, ar = sin(t * .4) * .3;
      K.path(c => { c.moveTo(ax + 20, ay + 20); c.bezierCurveTo(ax + 160, ay + 120, ax + 200, ay - 140, ax + 340, ay - 80); }, { s: 1, lw: 4 });
      c.save(); c.translate(ax, ay); c.rotate(ar);
      K.rr(-32, -20, 64, 84, 20, { f: -1, s: 1, lw: 6 }); K.rr(-40, -12, 22, 60, 10, { f: 2, s: 1, lw: 4 });
      K.path(c => { c.moveTo(-30, 0); c.lineTo(-70, 30 + sin(t * 1.4) * 14); }, { s: 1, lw: 14 }); K.path(c => { c.moveTo(-30, 0); c.lineTo(-70, 30 + sin(t * 1.4) * 14); }, { s: -1, lw: 6 });
      K.path(c => { c.moveTo(30, 0); c.lineTo(72, -22 - sin(t * 1.4) * 14); }, { s: 1, lw: 14 }); K.path(c => { c.moveTo(30, 0); c.lineTo(72, -22 - sin(t * 1.4) * 14); }, { s: -1, lw: 6 });
      K.path(c => { c.moveTo(-14, 60); c.lineTo(-22, 104); c.moveTo(14, 60); c.lineTo(24, 100 + sin(t) * 6); }, { s: 1, lw: 16 }); K.path(c => { c.moveTo(-14, 60); c.lineTo(-22, 104); c.moveTo(14, 60); c.lineTo(24, 100 + sin(t) * 6); }, { s: -1, lw: 8 });
      K.circ(0, -46, 44, { f: -1, s: 1, lw: 6 }); K.rr(-28, -66, 56, 40, 16, { f: 3, s: 1, lw: 4 }); K.rect(-20, -60, 18, 8, { f: -1 }); c.restore();
      // satélite
      const sx = 1380 + sin(t * .2) * 60, sy = 170 + cos(t * .25) * 30; c.save(); c.translate(sx, sy); c.rotate(t * .15);
      K.rr(-24, -24, 48, 48, 6, { f: 2, s: 1, lw: 5 }); for (const d of [-1, 1]) { K.rect(d > 0 ? 26 : -106, -18, 80, 36, { f: 3, s: 1, lw: 4 }); for (let i = 1; i < 4; i++) K.line((d > 0 ? 26 : -106) + i * 20, -18, (d > 0 ? 26 : -106) + i * 20, 18, 1, 2); }
      K.circ(0, -34, Math.floor(t * 2) % 2 ? 6 : 3, { f: 2 }); c.restore();
    },
    notes(K, s, t, a) {
      const v = K.v, m = 34; K.card(v.l + m, v.t + m, 300, 176, .01);
      K.code('ÓRBITA 03 · ' + String(Math.floor(t * 7) % 360).padStart(3, '0') + ' GRADOS', v.l + m + 16, v.t + m + 32, { size: 17 });
      K.circuit([[v.l + m + 16, v.t + m + 66], [v.l + m + 80, v.t + m + 66], [v.l + m + 80, v.t + m + 96], [v.l + m + 190, v.t + m + 96], [v.l + m + 190, v.t + m + 76], [v.l + m + 276, v.t + m + 76]], (t * .15) % 1.6, { i: 1, node: 2 });
      K.meter(v.l + m + 16, v.t + m + 142, 268, .35 + a.e * .6, 'SEÑAL', { n: 14 });
    },
  });

  // ============================================================
  // 5 · bosque: pinos que se mecen, niebla, luciérnagas y un zorro
  // ============================================================
  register({
    id: 'bosque', name: 'bosque', inks: 2, tag: 'bosque',
    phrases: ['el bosque escucha lo que el viento canta', 'las luciérnagas llevan el compás', 'un zorro cruza y nadie más se entera'],
    make: r => {
      const trees = (n, x0, step, seed, hmin, hmax) => { const rr = RISO.rng(seed); return Array.from({ length: n }, (_, i) => ({ x: x0 + i * step + rr() * step * .6, h: hmin + rr() * (hmax - hmin), ph: rr() * TAU })); };
      return { far: trees(22, -300, 130, 3, 180, 300), mid: trees(14, -300, 220, 4, 280, 420), near: trees(7, -300, 420, 5, 340, 470), flies: Array.from({ length: 26 }, () => ({ x: r() * 1700, y: 300 + r() * 420, ph: r() * TAU, sp: .3 + r() * .5 })), leaves: Array.from({ length: 12 }, () => ({ x: r() * 1700, y: r() * 800, ph: r() * TAU, sp: 20 + r() * 30 })), fox: -600, foxWait: 2 };
    },
    cam(cam, t) { cam.x = sin(t * .1) * 90; cam.y = cos(t * .08) * 22; cam.z = 1.06 + sin(t * .06) * .05; cam.r = sin(t * .04) * .006; },
    draw(K, s, t, dt, a) {
      const c = K.c;
      K.bg(2, .05); c.fillStyle = K.lin(2, 0, -300, 0, 640, .62, .04); c.fillRect(-1600, -1200, 6400, 1900);
      for (let i = 4; i > 0; i--) K.circ(800, 400, 130 + i * 44, { f: 2, ft: .13, over: true });
      K.circ(800, 400, 128 + a.beat * 8, { f: 2, s: 1, lw: 5 });
      // montañas y niebla
      K.layer(.3, () => { K.path(c => { c.moveTo(-800, 640); for (let x = -800; x <= 2400; x += 40) c.lineTo(x, 520 - Math.abs(sin(x * .0042)) * 210 - Math.sin(x * .013) * 30); c.lineTo(2400, 800); c.lineTo(-800, 800); }, { f: 3, ft: .55 }); });
      const pine = (x, by, h, sw, o, tiers = 4) => { c.save(); c.translate(x, by); c.rotate(sw); const w = h * .34; K.rect(-h * .03, -h * .16, h * .06, h * .16, o.trunk || o);
        for (let k = 0; k < tiers; k++) { const y1 = -h * .12 - k * h * (.8 / tiers), y2 = y1 - h * (.34 / (1)) * .8, ww = w * (1 - k * .2); K.path(c => { c.moveTo(-ww, y1); c.lineTo(0, y2); c.lineTo(ww, y1); c.quadraticCurveTo(0, y1 + h * .04, -ww, y1); c.closePath(); }, o); } c.restore(); };
      K.layer(.45, () => { for (const tr of s.far) pine(tr.x, 640, tr.h, sin(t * .5 + tr.ph) * .012, { f: 1, ft: .38 }); });
      for (let i = 0; i < 3; i++) { const yy = 500 + i * 60, mx = ((t * (10 + i * 6)) % 1000); K.rect(-1600 + mx, yy, 6400, 30 + i * 8, { f: 3, ft: .3, over: true }); }
      K.layer(.7, () => { for (const tr of s.mid) pine(tr.x, 720, tr.h, sin(t * .7 + tr.ph) * .014 + a.beat * .006, { f: 1, ft: .74, s: 1, lw: 4 }); });
      // río con reflejos
      K.rect(-1600, 720, 6400, 400, { f: 3, ft: .5 }); K.line(-1600, 720, 4800, 720, 1, 7);
      for (let i = 0; i < 16; i++) { const y = 740 + i * 12, x0 = ((i * 137 + t * (20 + i * 3)) % 1800) - 100; K.path(c => { c.moveTo(x0, y); c.quadraticCurveTo(x0 + 40, y - 6, x0 + 80 + i * 6, y); }, { s: 1, lw: 3, st: .9 }); }
      K.path(c => { c.rect(720, 728, 160, 140); }, { f: 2, ft: .0 }); for (let i = 0; i < 9; i++) K.rect(800 - 70 + Math.sin(t * 1.4 + i) * 12 + i * 2, 740 + i * 14, 140 - i * 10, 5, { f: 2, ft: .9 });
      K.layer(1.05, () => { for (const tr of s.near) pine(tr.x, 900, tr.h, sin(t * .9 + tr.ph) * .016 + a.beat * .008, { f: 1, s: 2, lw: 3, ft: 1, trunk: { f: 1, s: 2, lw: 3 } }, 5); });
      // hongos y pasto en primer plano
      for (const [mx, ms] of [[260, 1], [1340, 1.3]]) { K.rect(mx - 9 * ms, 860 - 34 * ms, 18 * ms, 40 * ms, { f: -1, s: 1, lw: 4 }); K.path(c => { c.moveTo(mx - 40 * ms, 828); c.quadraticCurveTo(mx, 770 - 6 * ms, mx + 40 * ms, 828); c.closePath(); }, { f: 2, s: 1, lw: 5 }); K.circ(mx - 12 * ms, 806, 6 * ms, { f: -1 }); K.circ(mx + 14 * ms, 812, 5 * ms, { f: -1 }); }
      // zorro
      s.foxWait -= dt; if (s.foxWait < 0 && s.fox < -500) { s.fox = -300; }
      if (s.fox > -500) { s.fox += dt * (150 + a.e * 120); if (s.fox > 2000) { s.fox = -600; s.foxWait = 4 + Math.random() * 6; } }
      if (s.fox > -400) { const fx = s.fox, fy = 812 + Math.abs(sin(t * 6)) * -6, ph = t * 7; c.save(); c.translate(fx, fy);
        const leg = (ox, ph2) => { K.path(c => { c.moveTo(ox, 0); c.lineTo(ox + sin(ph + ph2) * 22, 34 - Math.max(0, cos(ph + ph2)) * 10); }, { s: 1, lw: 12 }); };
        leg(-30, 0); leg(-16, PI); leg(40, PI * .5); leg(54, PI * 1.5);
        K.path(c => { c.moveTo(-60, -6); c.bezierCurveTo(-130, -40 - Math.sin(t * 5) * 8, -140, 20, -78, 4); }, { f: 2, s: 1, lw: 6 }); K.circ(-112, -8, 10, { f: -1 });
        K.path(c => { c.moveTo(-50, 0); c.quadraticCurveTo(-8, -50, 60, -14); c.lineTo(70, 6); c.quadraticCurveTo(10, 30, -50, 0); }, { f: 2, s: 1, lw: 6 });
        K.path(c => { c.moveTo(56, -20); c.lineTo(102, -6); c.lineTo(58, 8); c.closePath(); }, { f: 2, s: 1, lw: 5 }); K.poly([[62, -22], [66, -44], [78, -24]], { f: 2, s: 1, lw: 4 }); K.poly([[76, -22], [88, -42], [90, -18]], { f: 2, s: 1, lw: 4 });
        K.circ(102, -6, 4, { f: 1 }); K.circ(78, -8, 3, { f: 1 }); c.restore(); }
      // luciérnagas y hojas que caen
      for (const f of s.flies) { const x = f.x + sin(t * f.sp + f.ph) * 60, y = f.y + cos(t * f.sp * 1.3 + f.ph) * 34, on = .5 + .5 * sin(t * 2 + f.ph * 3);
        if (K.d > 1) K.glow(3, x, y, 26 + on * 20 + a.beat * 10, .8); K.circ(x, y, 2.4 + on * 2, { f: 2 }); }
      for (const l of s.leaves) { l.y += dt * l.sp; l.x += sin(t + l.ph) * dt * 30; if (l.y > 980) { l.y = -60; l.x = Math.random() * 1700; } c.save(); c.translate(l.x, l.y); c.rotate(t * .8 + l.ph); helpers.leaf(K, 0, 0, 30, 9, 0, { f: 2, s: 1, lw: 3 }); c.restore(); }
    },
    notes(K, s, t, a) {
      const v = K.v, m = 34; K.card(v.l + m, v.t + m, 300, 120, -.012);
      K.code('SENDERO 12 · 06:40 AM', v.l + m + 16, v.t + m + 32, { size: 17 });
      K.circuit([[v.l + m + 16, v.t + m + 68], [v.l + m + 110, v.t + m + 68], [v.l + m + 110, v.t + m + 92], [v.l + m + 276, v.t + m + 92]], (t * .17) % 1.6, { i: 1, node: 2 });
    },
  });

  // ============================================================
  // 6 · retrato: plano cerrado, ojos que parpadean, audífonos que laten
  // ============================================================
  register({
    id: 'retrato', name: 'retrato', inks: 1, tag: 'retrato',
    phrases: ['solo ella escucha lo que suena adentro', 'cierra los ojos y la canción empieza', 'un audífono es una puerta pequeña'],
    make: r => ({ gx: 0, gy: 0, tx: 0, ty: 0, gt: 1, blink: 2, bl: 0, brow: 0, bt: 3, bars: Array.from({ length: 56 }, () => r()) }),
    cam(cam, t) { cam.x = sin(t * .12) * 30; cam.y = cos(t * .09) * 16; cam.z = 1.04 + sin(t * .07) * .03; cam.r = sin(t * .05) * .01; },
    draw(K, s, t, dt, a) {
      const c = K.c;
      K.bg(3, .16); c.fillStyle = K.rad(3, 800, 430, 100, 900, .0, .36); c.fillRect(-1600, -1200, 6400, 3000);
      K.hatch(-800, -500, 3600, 2000, 3, 34, .6, 2, .5);
      // sol de fondo y barras de sonido alrededor
      K.circ(800, 430, 350, { f: 2, s: 1, lw: 8 }); for (let i = 0; i < 4; i++) K.circ(800, 430, 350 + i * 36, { f: 2, ft: .09, over: true });
      const N = s.bars.length; for (let i = 0; i < N; i++) { const an = i * TAU / N - PI / 2, v = .25 + s.bars[i] * .5 * (.5 + a.e) + a.beat * .3 * nz(i * .4 + t * 3), r0 = 372, r1 = r0 + 20 + v * 96; K.line(800 + cos(an) * r0, 430 + sin(an) * r0, 800 + cos(an) * r1, 430 + sin(an) * r1, 1, 6); }
      // ritmo de la cabeza
      s.gt -= dt; if (s.gt < 0) { s.gt = 1.4 + Math.random() * 2.6; s.tx = (Math.random() - .5) * 2; s.ty = (Math.random() - .5) * 1.2; }
      s.gx += (s.tx - s.gx) * dt * 5; s.gy += (s.ty - s.gy) * dt * 5;
      s.bl -= dt; if (s.bl < -.18) s.bl = 2 + Math.random() * 3.4; const eye = s.bl < 0 ? Math.abs(s.bl + .09) / .09 * .9 + .08 : 1;
      s.bt -= dt; if (s.bt < 0) { s.bt = 2 + Math.random() * 3; s.brow = Math.random() < .6 ? 1 : 0; } s.browv = (s.browv || 0) + ((s.brow) - (s.browv || 0)) * dt * 6;
      const hy = sin(t * 1.25) * 5 + a.beat * 11, hx = sin(t * .5) * 8 + s.gx * 6; c.save(); c.translate(hx, hy);
      // hombros y cuello
      K.path(c => { c.moveTo(380, 960); c.bezierCurveTo(400, 760, 560, 730, 690, 700); c.lineTo(910, 700); c.bezierCurveTo(1040, 730, 1200, 760, 1220, 960); c.closePath(); }, { f: 1, s: 1, lw: 7 });
      K.path(c => { c.moveTo(700, 640); c.lineTo(690, 730); c.lineTo(800, 790); c.lineTo(910, 730); c.lineTo(900, 640); c.closePath(); }, { f: -1, s: 1, lw: 6 });
      K.shade(c => { c.moveTo(700, 640); c.lineTo(690, 730); c.lineTo(800, 790); c.lineTo(910, 730); c.lineTo(900, 640); c.closePath(); }, 1, .5, 0, 700, 640, 700, 760);
      K.path(c => { c.moveTo(690, 730); c.lineTo(800, 860); c.lineTo(910, 730); c.lineTo(870, 716); c.lineTo(800, 790); c.lineTo(730, 716); c.closePath(); }, { f: 2, s: 1, lw: 5 });
      // pelo detrás
      K.path(c => { c.moveTo(600, 400); c.bezierCurveTo(540, 520, 560, 650, 600, 700); c.lineTo(660, 640); c.lineTo(650, 420); c.closePath(); c.moveTo(1000, 400); c.bezierCurveTo(1060, 520, 1040, 650, 1000, 700); c.lineTo(940, 640); c.lineTo(950, 420); c.closePath(); }, { f: 1, s: 1, lw: 6 });
      // cara
      const fx = 800, fy = 470;
      K.ell(fx, fy, 190, 236, 0, { f: -1, s: 1, lw: 8 });
      K.shade(c => c.ellipse(fx, fy, 190, 236, 0, 0, TAU), 1, 0, .45, fx - 20, fy, fx + 190, fy);
      K.circ(fx - 100, fy + 60, 34, { f: 2, ft: .4, over: true }); K.circ(fx + 100, fy + 60, 34, { f: 2, ft: .4, over: true });
      for (const [px, py] of [[-70, 44], [-52, 62], [-86, 68], [58, 46], [76, 66], [92, 50]]) K.circ(fx + px, fy + py, 3, { f: 2 });
      // ojos con mirada, párpado y pestañas
      for (const d of [-1, 1]) { const ex = fx + d * 72, ey = fy - 6;
        K.clip(c => c.ellipse(ex, ey, 52, 34 * eye, 0, 0, TAU), () => { K.rect(ex - 60, ey - 40, 120, 80, { f: -1 }); K.circ(ex + s.gx * 16, ey + s.gy * 8, 27, { f: 3, s: 1, lw: 4 }); K.circ(ex + s.gx * 18, ey + s.gy * 9, 12, { f: 1 }); K.circ(ex + s.gx * 18 - 7, ey + s.gy * 9 - 8, 5, { f: -1 }); });
        K.path(c => { c.ellipse(ex, ey, 52, 34 * eye, 0, PI, TAU); }, { s: 1, lw: 9 }); K.path(c => { c.ellipse(ex, ey, 52, 34 * eye, 0, 0, PI); }, { s: 1, lw: 4 });
        for (let k = 0; k < 3; k++) K.line(ex + d * (44 + k * 4), ey - 12 * eye - k * 4, ex + d * (66 + k * 4), ey - 24 * eye - k * 8, 1, 5);
        const by = fy - 82 - s.browv * 12 - a.beat * 6; K.path(c => { c.moveTo(ex - 48, by + 8 * d * -1 * 0 + 2); c.quadraticCurveTo(ex, by - 14 - s.browv * 6, ex + 48, by + (d < 0 ? 12 : 0) + (d > 0 ? 0 : 0)); }, { s: 1, lw: 12 }); }
      K.path(c => { c.moveTo(fx - 8, fy + 20); c.lineTo(fx - 18, fy + 78); c.quadraticCurveTo(fx, fy + 92, fx + 20, fy + 80); }, { s: 1, lw: 6 });
      const open = clampOpen(a.e * 26 + a.beat * 8);
      K.path(c => { c.moveTo(fx - 42, fy + 128); c.quadraticCurveTo(fx, fy + 140 + open, fx + 42, fy + 128); c.quadraticCurveTo(fx, fy + 122 - open * .3, fx - 42, fy + 128); }, { f: 2, s: 1, lw: 6 });
      // flequillo y pelo de arriba
      const sw = sin(t * 1.3) * 5 + a.beat * 4;
      K.path(c => { c.moveTo(596, 470); c.bezierCurveTo(560, 260, 700, 190, 800, 196); c.bezierCurveTo(920, 190, 1040, 260, 1004, 470); c.bezierCurveTo(990, 380, 960, 330, 930, 314 + sw); c.bezierCurveTo(880, 350, 810, 340, 760, 300 + sw); c.bezierCurveTo(700, 330, 640, 380, 596, 470); c.closePath(); }, { f: 1, s: 1, lw: 6 });
      for (let i = 0; i < 5; i++) K.path(c => { c.moveTo(690 + i * 52, 226); c.quadraticCurveTo(700 + i * 52 + sw, 258, 696 + i * 52 + sw, 286); }, { s: 3, lw: 4 });
      // audífonos: banda, copas y ondas
      K.path(c => { c.arc(fx, fy - 40, 226, PI * 1.06, PI * 1.94); }, { s: 1, lw: 40 }); K.path(c => { c.arc(fx, fy - 40, 226, PI * 1.06, PI * 1.94); }, { s: 2, lw: 26 });
      for (const d of [-1, 1]) { const cx = fx + d * 208, cy = fy + 24; K.rr(cx - 34, cy - 84, 68, 172, 30, { f: 2, s: 1, lw: 8 }); K.rr(cx - d * 12 - 22, cy - 60, 44, 120, 20, { f: 1 });
        K.circ(cx, cy, 18, { f: 3, s: 1, lw: 4 });
        for (let k = 1; k <= 3; k++) K.path(c => { c.arc(cx, cy, 70 + k * 30 + a.beat * 26, d < 0 ? PI * .7 : -PI * .3, d < 0 ? PI * 1.3 : PI * .3); }, { s: 1, lw: 5 - k, st: 1 - k * .2 }); }
      c.restore();
    },
    notes(K, s, t, a) {
      const v = K.v, m = 34; K.card(v.l + m, v.t + m, 300, 176, .012);
      K.code('CANAL 02 · ' + Math.round(a.bpm) + ' BPM', v.l + m + 16, v.t + m + 32, { size: 17 });
      K.circuit([[v.l + m + 16, v.t + m + 66], [v.l + m + 100, v.t + m + 66], [v.l + m + 100, v.t + m + 92], [v.l + m + 276, v.t + m + 92]], (t * .2) % 1.6, { i: 1, node: 2 });
      K.meter(v.l + m + 16, v.t + m + 142, 268, .3 + a.e * .65, 'GRAVES', { n: 14 });
      K.card(v.r - m - 300 - 20, v.t + m + 150, 250, 70, -.01); K.code('NIVEL ' + String(Math.round((.3 + a.e * .65) * 100)).padStart(2, '0') + ' / 100', v.r - m - 300 - 4, v.t + m + 192, { size: 17 });
    },
  });
  function clampOpen(v) { return Math.max(0, Math.min(34, v)); }

  // ============================================================
  // 7 · museo: la máquina tapada con una sábana, cuerda de terciopelo y placa
  // ============================================================
  register({
    id: 'museo', name: 'museo', inks: 0, tag: 'museo',
    phrases: ['todo lo que dejó de sonar se queda aquí', 'la máquina duerme pero no se apaga', 'nadie toca, todos miran'],
    make: r => ({ vx: -400, vwait: 2, dial: r() * 6 }),
    cam(cam, t) { cam.x = sin(t * .1) * 50; cam.y = cos(t * .08) * 18; cam.z = 1.05 + sin(t * .06) * .035; cam.r = sin(t * .04) * .005; },
    draw(K, s, t, dt, a) {
      const c = K.c;
      K.bg(2, .1); c.fillStyle = K.lin(2, 0, -200, 0, 780, .34, .04); c.fillRect(-1600, -1200, 6400, 1980);
      // reflector oscilante
      const sw = sin(t * .35) * .07;
      c.save(); c.translate(760, -80); c.rotate(sw); c.globalCompositeOperation = 'lighter'; c.fillStyle = K.lin(2, 0, 0, 0, 900, .32, .0); c.beginPath(); c.moveTo(-40, 0); c.lineTo(40, 0); c.lineTo(420, 900); c.lineTo(-420, 900); c.fill(); c.restore();
      K.glow(2, 760, 380, 620 + a.e * 60, .45);
      // cuadros en la pared
      c.save(); c.translate(330, 60); c.rotate(-.02); K.rect(8, 8, 200, 250, { f: 1, ft: .3, over: true }); K.rect(0, 0, 200, 250, { f: -1, s: 1, lw: 8 }); K.rect(16, 16, 168, 218, { f: 3, ft: .5, s: 1, lw: 3 });
      K.circ(100, 100, 44, { f: -1, s: 1, lw: 4 }); K.path(c => { c.moveTo(30, 234); c.quadraticCurveTo(100, 130, 170, 234); c.closePath(); }, { f: 1, ft: .8, s: 1, lw: 4 }); c.restore();
      // piso en perspectiva
      K.rect(-1600, 770, 6400, 800, { f: 2, ft: .32 }); K.line(-1600, 770, 4800, 770, 1, 7);
      for (let i = 1; i < 9; i++) K.line(-1600, 770 + i * i * 7, 4800, 770 + i * i * 7, 1, 2.5, 1);
      for (let i = -14; i < 15; i++) K.line(800 + i * 60, 770, 800 + i * 240, 1200, 1, 2.5, 1);
      // máquina y sábana, un poco más chicas para que quepa la placa
      c.save(); c.translate(600, 770); c.scale(.76, .76); c.translate(-600, -770);
      const cabs = 5, cw = 210, cx0 = 170;
      for (let i = 0; i < cabs; i++) { const x = cx0 + i * cw; K.rect(x, 500, cw - 6, 270, { f: -1, s: 1, lw: 7 }); for (let k = 0; k < 4; k++) K.line(x + 28, 660 + k * 22, x + cw - 40, 660 + k * 22, 1, 4);
        K.shade(c => c.rect(x, 500, cw - 6, 270), 1, 0, .38, x, 500, x + cw, 770); }
      for (let i = 0; i < 3; i++) { const dx = 226 + i * 64, ang = s.dial + i * 1.3 + t * .5; K.circ(dx, 630, 24, { f: -1, s: 1, lw: 6 }); K.line(dx, 630, dx + cos(ang) * 17, 630 + sin(ang) * 17, 1, 5); }
      for (let i = 0; i < 7; i++) { const on = (Math.floor(a.beats) + i) % 4 === 0; K.circ(232 + i * 34, 688, 8, on ? { f: 2, s: 1, lw: 3 } : { f: -1, s: 1, lw: 3 }); if (on) K.glow(2, 232 + i * 34, 688, 46 + a.beat * 28, .9); }
      // la sábana respira con la máquina; pliegues largos y borde con trama
      const bre = 1 + sin(t * 1.3) * .006 + a.beat * .016, cy0 = 770;
      c.save(); c.translate(0, cy0); c.scale(1, bre); c.translate(0, -cy0);
      const cloth = c => { c.moveTo(-40, 470); c.bezierCurveTo(60, 440, 120, 420, 190, 400); c.bezierCurveTo(300, 360, 420, 300, 520, 200); c.bezierCurveTo(560, 160, 620, 150, 700, 150); c.lineTo(1060, 150); c.bezierCurveTo(1120, 180, 1180, 260, 1300, 300); c.bezierCurveTo(1400, 330, 1450, 400, 1470, 480); c.lineTo(1472, 650); c.bezierCurveTo(1460, 760, 1420, 800, 1400, 794); c.bezierCurveTo(1200, 800, 1000, 770, 860, 780); c.bezierCurveTo(700, 770, 560, 700, 420, 650); c.bezierCurveTo(300, 600, 160, 590, -60, 545); c.closePath(); };
      K.path(cloth, { f: -1, s: 1, lw: 8 });
      K.shade(cloth, 1, 0, .5, 0, 150, 0, 800);
      K.clip(cloth, () => { K.path(c => { c.moveTo(-200, 660); c.bezierCurveTo(300, 780, 700, 720, 1500, 780); c.lineTo(1500, 900); c.lineTo(-200, 900); c.closePath(); }, { f: 1, ft: .55, over: true }); });
      const fold = (x0, y0, x1, y1, bx) => K.path(c => { c.moveTo(x0, y0); c.bezierCurveTo(x0 + bx + sin(t * .7 + x0) * 6, y0 + (y1 - y0) * .35, x1 - bx, y0 + (y1 - y0) * .7, x1, y1); }, { s: 1, lw: 4.4 });
      fold(700, 160, 660, 740, 30); fold(940, 156, 990, 780, -30); fold(520, 220, 470, 690, 24); fold(1130, 200, 1180, 770, -20); fold(300, 380, 250, 590, 20); fold(1340, 320, 1390, 790, -16); fold(820, 170, 800, 780, 12);
      c.restore(); c.restore();
      // cable con enchufe que chispea con el ritmo
      K.path(c => { c.moveTo(1430, 780); c.bezierCurveTo(1470, 850, 1560, 830, 1640, 860); }, { s: 1, lw: 6 }); K.rr(1636, 846, 38, 30, 6, { f: 2, s: 1, lw: 5 });
      K.rr(1700, 770, 56, 100, 8, { f: -1, s: 1, lw: 5 }); K.circ(1728, 806, 4, { f: 1 }); K.circ(1728, 838, 4, { f: 1 }); if (a.beat > .3) { K.glow(2, 1690, 862, 60, .9); helpers.star(K, 1690, 862, 14 + a.beat * 12, { f: 2 }, 5, .4, t * 4); }
      // postes y cuerda de terciopelo
      const posts = [[190, 850], [1010, 880]], sag = 26 + sin(t * .9) * 4 + a.beat * 8;
      K.path(c => { c.moveTo(posts[0][0], 760); c.quadraticCurveTo((posts[0][0] + posts[1][0]) / 2, 760 + sag * 2 + 30, posts[1][0], 790); }, { s: 1, lw: 24 });
      K.path(c => { c.moveTo(posts[0][0], 760); c.quadraticCurveTo((posts[0][0] + posts[1][0]) / 2, 760 + sag * 2 + 30, posts[1][0], 790); }, { s: 3, lw: 15 });
      for (const [px, py] of posts) { K.ell(px, py + 4, 46, 12, 0, { f: 2, s: 1, lw: 5 }); K.rect(px - 8, py - 100, 16, 100, { f: 2, s: 1, lw: 5 }); K.circ(px, py - 108, 18, { f: 2, s: 1, lw: 5 }); K.circ(px - 5, py - 114, 5, { f: -1 }); }
      K.postit(40, 700, 160, 90, -.09, ['no tocar', 'por favor'], { size: 26, fill: 3, ft: .55 });
      // placa del museo
      const px = 1130, py = 260;
      c.save(); c.translate(px, py); c.rotate(.012); K.rect(9, 10, 400, 340, { f: 1, ft: .3, over: true }); K.rect(0, 0, 400, 340, { f: -1, s: 1, lw: 5 });
      K.txt('LUMORA', 24, 76, { size: 76, w: 800 }); K.txt('MARK I', 24, 142, { size: 76, w: 800 }); K.rect(24, 168, 352, 4, { f: 1 });
      K.txt('1984–', 24, 236, { font: 'serif', size: 74, w: 700, italic: true, i: 1 });
      K.txt('Proyector de letras, retirado.', 24, 282, { font: 'serif', size: 27, italic: true, w: 500, i: 3 });
      K.txt('Cortesía de los oyentes.', 24, 322, { font: 'serif', size: 32, italic: true, w: 600, i: 1 }); c.restore();
      // visitante que pasa mirando
      s.vwait -= dt; if (s.vwait < 0 && s.vx < -300) s.vx = -260; if (s.vx > -300) { s.vx += dt * (60 + a.e * 30); if (s.vx > 2000) { s.vx = -400; s.vwait = 5 + Math.random() * 6; } }
      if (s.vx > -300) { const x = s.vx, ph = t * 3.2; c.save(); c.translate(x, 900);
        K.path(c => { c.moveTo(-10, -74); c.lineTo(-14 + sin(ph) * 22, 0); c.moveTo(10, -74); c.lineTo(14 - sin(ph) * 22, 0); }, { s: 1, lw: 16 });
        K.rr(-28, -200, 56, 130, 22, { f: 1, s: 1, lw: 5 }); K.circ(0, -226, 24, { f: -1, s: 1, lw: 5 }); K.rect(-30, -246, 60, 10, { f: 1 }); K.rect(-20, -272, 40, 30, { f: 1 }); c.restore(); }
    },
    notes(K, s, t, a) {
      const v = K.v, m = 34; K.card(v.l + m, v.t + m, 290, 116, .01);
      K.code('SALA 04 · NO FLASH', v.l + m + 16, v.t + m + 34, { size: 17 });
      K.meter(v.l + m + 16, v.t + m + 76, 258, .4 + a.e * .5, 'ZUMBIDO', { n: 14 });
    },
  });
})();
