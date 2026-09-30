// ============================================================
// riso-scenes4.js — «ella»: un retrato ilustrado en risografía, dibujado a mano con código.
// Aparece cuando la letra habla de una mujer con cariño (amor, belleza, sonrisa, labios,
// mirada...) y el ánimo de la estrofa es positivo. Rasgos: pelo oscuro y ondulado hasta los
// hombros, cejas gruesas y arqueadas, ojos oscuros de pestañas largas que parpadean y a
// veces guiñan, labios rojos llenos, mejillas rosadas y un dije de flor en la cadena.
// No usa fotos: todo son trazos y tintas planas.
// ============================================================
(() => {
  const { register, helpers } = RISO, TAU = Math.PI * 2, PI = Math.PI, sin = Math.sin, cos = Math.cos;
  const O = (f, s = 1, lw = 5, ft = 1) => ({ f, ft, s, lw });
  RISO.SCENE_RX.ella = /\b(she|her|hers|girl|girls|woman|women|lady|queen|princess|beautiful|pretty|gorgeous|lovely|angel|smile|smiling|lips|kiss\w*|eyes|face|mine|my love|my girl|my baby|girlfriend|wife|ella|chica|muchacha|mujer|reina|princesa|hermosa|bonita|linda|preciosa|guapa|sonrisa|labios|besos?|ojos|cara|rostro|mirada|novia|esposa|mi amor|mi vida|mami|nena|cielo|coraz[oó]n|belleza|beauty)\b/i;

  // contorno de la cara: óvalo ancho arriba y barbilla suave
  const face = (n = 44) => Array.from({ length: n + 1 }, (_, i) => { const a = i / n * TAU - PI / 2, y = sin(a) * 214, k = y > 0 ? 1 - .24 * Math.pow(y / 214, 2.4) : 1; return [cos(a) * 180 * k, y]; });
  const eye = (K, cx, cy, w, open, look, side) => {                // ojo con pestañas; open 0..1
    const h = 21 * open, up = t => [cx + (t - .5) * 2 * w, cy - Math.sin(t * PI) * h * 1.15 + (side * (t - .5)) * 8], lo = t => [cx + (t - .5) * 2 * w, cy + Math.sin(t * PI) * h * .7 + (side * (t - .5)) * 8];
    const U = Array.from({ length: 14 }, (_, i) => up(i / 13)), Lw = Array.from({ length: 14 }, (_, i) => lo(1 - i / 13));
    if (open > .12) { K.clip(c => { U.forEach((p, i) => i ? c.lineTo(p[0], p[1]) : c.moveTo(p[0], p[1])); Lw.forEach(p => c.lineTo(p[0], p[1])); c.closePath(); }, () => { K.rect(cx - w - 4, cy - 50, w * 2 + 8, 100, { f: -1 }); K.circ(cx + look * 8, cy - 2, 25, { f: 1 }); K.circ(cx + look * 8 - 8, cy - 9, 7, { f: -1 }); K.circ(cx + look * 8 + 9, cy + 6, 3.5, { f: -1 }); }); }
    K.poly(U, { s: 1, lw: open > .12 ? 14 : 9 }, false); if (open > .12) K.poly(U.map(p => [p[0], p[1] - 14 * open]), { s: 1, lw: 3, st: .8 }, false); if (open > .12) K.poly(Lw, { s: 1, lw: 3 }, false);
    const o = side < 0 ? -1 : 1; for (let i = 0; i < 4; i++) { const p = up(.04 + i * .09 + (side > 0 ? .56 : 0) * 0); const q = side < 0 ? up(.04 + i * .06) : up(.96 - i * .06); K.line(q[0], q[1], q[0] + (side < 0 ? -1 : 1) * (18 + i * 3), q[1] - 14 - i * 5, 1, 5); }
  };

  register({
    id: 'ella', name: 'ella', inks: 1, phrases: ['ella se ríe y el mundo baja el volumen', 'una mirada basta para cambiar la canción', 'hay caras que parecen una promesa'],
    make: r => ({ bl: 2, blink: 0, wk: 4 + r() * 3, wink: 0, hs: r() * 6 }),
    cam(cam, t) { cam.x = sin(t * .12) * 26; cam.y = cos(t * .09) * 14; cam.z = 1.02 + sin(t * .07) * .03; cam.r = sin(t * .05) * .008; },
    draw(K, s, t, dt, a) {
      const c = K.c;
      // fondo: rayos de tinta 2 en trama, corazones que suben y un panel de tinta 3
      K.bg(3, .12); for (let i = 0; i < 28; i += 2) { const a0 = i / 28 * TAU + t * .03, a1 = (i + 1) / 28 * TAU + t * .03; K.poly([[800, 430], [800 + cos(a0) * 1900, 430 + sin(a0) * 1900], [800 + cos(a1) * 1900, 430 + sin(a1) * 1900]], { f: 2, ft: .2 }); }
      K.circ(800, 440, 380, O(3, 1, 8, .45)); K.circ(800, 440, 380 + a.beat * 12, { s: 1, lw: 5 });
      for (let i = 0; i < 7; i++) { const k = (t * .12 + i / 7) % 1, x = 160 + (i * 233) % 1300 + sin(t + i) * 30, y = 900 - k * 1000, sz = 9 + (i % 3) * 4; K.path(c2 => { for (let j = 0; j <= 40; j++) { const q = j / 40 * TAU; const px = x + 16 * sin(q) ** 3 * sz / 10, py = y - (13 * cos(q) - 5 * cos(2 * q) - 2 * cos(3 * q) - cos(4 * q)) * sz / 10; j ? c2.lineTo(px, py) : c2.moveTo(px, py); } }, O(i % 2 ? 2 : -1, 1, 4)); }
      // parpadeo y guiño
      s.bl -= dt; if (s.bl < -.16) s.bl = 2 + Math.random() * 3; s.wk -= dt; if (s.wk < -.5) s.wk = 5 + Math.random() * 4;
      const blink = s.bl < 0 ? Math.abs(s.bl + .08) / .08 * .9 + .08 : 1, wink = s.wk < 0 ? Math.min(1, Math.abs(s.wk + .25) / .25) * .95 + .05 : 1;
      const tilt = -.1 + sin(t * .55) * .03 + a.beat * .012, br = sin(t * 1.3) * 5;
      c.save(); c.translate(800, 470 + br); c.rotate(tilt);
      // pelo de atrás, en ondas hasta los hombros
      const wv = sin(t * .8) * 8;
      K.path(cx => { cx.moveTo(-190, -120); cx.bezierCurveTo(-260, -50, -230, 120, -270 + wv, 240); cx.bezierCurveTo(-290, 330, -220, 380, -170 + wv, 430); cx.lineTo(180 - wv, 430); cx.bezierCurveTo(240 - wv, 380, 290, 330, 262 - wv, 240); cx.bezierCurveTo(230, 120, 260, -50, 190, -120); cx.bezierCurveTo(150, -270, -150, -270, -190, -120); cx.closePath(); }, O(1, 1, 7));
      // cuello y hombros
      K.path(cx => { cx.moveTo(-70, 150); cx.lineTo(-84, 300); cx.lineTo(84, 300); cx.lineTo(70, 150); cx.closePath(); }, O(-1, 1, 6)); K.shade(cx => { cx.moveTo(-70, 150); cx.lineTo(-84, 300); cx.lineTo(84, 300); cx.lineTo(70, 150); cx.closePath(); }, 1, 0, .3, -80, 150, 90, 300);
      K.path(cx => { cx.moveTo(-330, 480); cx.bezierCurveTo(-320, 360, -200, 320, -100, 300); cx.bezierCurveTo(-60, 380, 60, 380, 100, 300); cx.bezierCurveTo(200, 320, 320, 360, 330, 480); cx.closePath(); }, O(1, 1, 7));
      K.path(cx => { cx.moveTo(-100, 300); cx.bezierCurveTo(-60, 380, 60, 380, 100, 300); }, { s: -1, lw: 4 });
      // cadena y dije de flor
      K.path(cx => { cx.moveTo(-84, 306); cx.bezierCurveTo(-60, 400, 60, 400, 84, 306); }, { s: 2, lw: 3.5 }); K.path(cx => { cx.moveTo(-84, 306); cx.bezierCurveTo(-60, 400, 60, 400, 84, 306); }, { s: -1, lw: 1.5 });
      const px = -6, py = 368 + sin(t * 1.3) * 2; for (let i = 0; i < 5; i++) { const an = i * TAU / 5 - PI / 2; K.ell(px + cos(an) * 15, py + sin(an) * 15, 14, 9, an, O(-1, 1, 3)); } K.circ(px, py, 7, { f: 2 });
      // cara
      const F = face(); K.poly(F, O(-1, 1, 8));
      K.shade(cx => F.forEach((p, i) => i ? cx.lineTo(p[0], p[1]) : cx.moveTo(p[0], p[1])), 1, 0, .5, -20, 0, 170, 60);          // sombra del lado derecho, en puntos
      K.clip(cx => F.forEach((p, i) => i ? cx.lineTo(p[0], p[1]) : cx.moveTo(p[0], p[1])), () => { K.circ(-104, 84, 40, { f: 2, ft: .3 }); K.circ(108, 88, 40, { f: 2, ft: .34 }); K.ell(0, 250, 120, 40, 0, { f: 1, ft: .3, over: true }); });
      // nariz
      K.path(cx => { cx.moveTo(4, -6); cx.quadraticCurveTo(28, 40, 20, 70); }, { s: 1, lw: 4, st: .8 }); K.path(cx => { cx.moveTo(-26, 78); cx.quadraticCurveTo(-8, 96, 14, 82); cx.quadraticCurveTo(30, 96, 42, 76); }, { s: 1, lw: 5 }); K.circ(-14, 84, 4, { f: 1 }); K.circ(28, 84, 4, { f: 1 });
      // cejas gruesas y arqueadas
      const brow = (x0, y0, x1, y1, lift) => K.poly([[x0, y0 + 4], [(x0 + x1) / 2 - 10, y0 - 40 - lift], [x1, y1 - 6], [x1 + 6, y1 + 10], [(x0 + x1) / 2 - 6, y0 - 8 - lift], [x0 - 4, y0 + 20]], O(1, 1, 5));
      brow(-150, -62, -26, -80, -2 + a.beat * 4); brow(28, -84, 152, -58, wink < .6 ? 8 : 0);
      // ojos
      eye(K, -84, -20, 56, blink, sin(t * .5) * .8, -1); eye(K, 88, -18, 56, Math.min(blink, wink), sin(t * .5) * .8, 1);
      // labios llenos
      const mo = 6 + a.e * 8 + a.beat * 4, my = 138;
      K.path(cx => { cx.moveTo(-68, my); cx.bezierCurveTo(-40, my - 32, -14, my - 26, 0, my - 16); cx.bezierCurveTo(14, my - 26, 40, my - 32, 68, my); cx.bezierCurveTo(34, my + 10, -34, my + 10, -68, my); cx.closePath(); }, O(2, 1, 5)); K.path(cx => { cx.moveTo(-68, my); cx.bezierCurveTo(-34, my + 10, 34, my + 10, 68, my); cx.bezierCurveTo(44, my + 54 + mo, -44, my + 54 + mo, -68, my); cx.closePath(); }, O(2, 1, 5)); K.path(cx => { cx.moveTo(-40, my + 26); cx.quadraticCurveTo(-8, my + 34, 24, my + 26); }, { s: -1, lw: 4 });
      K.path(cx => { cx.moveTo(-68, my); cx.bezierCurveTo(-34, my + 8, 34, my + 8, 68, my); }, { s: 1, lw: 4.5 }); K.path(cx => { cx.moveTo(68, my); cx.quadraticCurveTo(80, my - 6, 82, my - 18); }, { s: 1, lw: 3.5 });
      // flequillo lateral: mechones que enmarcan la cara
      K.path(cx => { cx.moveTo(-40, -228); cx.bezierCurveTo(-150, -236, -214, -120, -204, 40); cx.bezierCurveTo(-196, 120, -216, 190, -190 + wv * .5, 260); cx.bezierCurveTo(-176, 170, -184, 60, -172, -30); cx.bezierCurveTo(-150, -110, -84, -176, -40, -228); cx.closePath(); }, O(1, 1, 6));
      K.path(cx => { cx.moveTo(-30, -230); cx.bezierCurveTo(80, -252, 200, -190, 208, -50); cx.bezierCurveTo(216, 60, 198, 150, 216 - wv * .4, 250); cx.bezierCurveTo(176, 170, 182, 40, 172, -30); cx.bezierCurveTo(150, -110, 70, -176, -30, -230); cx.closePath(); }, O(1, 1, 6));
      for (let i = 0; i < 6; i++) { const y0 = -190 + i * 34; K.path(cx => { cx.moveTo(-150 + i * 8, y0); cx.quadraticCurveTo(-176 + wv * .3, y0 + 90, -160, y0 + 190); }, { s: -1, lw: 2.5 }); K.path(cx => { cx.moveTo(150 - i * 6, y0); cx.quadraticCurveTo(178 - wv * .3, y0 + 80, 164, y0 + 190); }, { s: -1, lw: 2.5 }); }
      K.path(cx => { cx.moveTo(-28, -226); cx.quadraticCurveTo(-46, -150, -110, -110); }, { s: -1, lw: 3 });
      c.restore();
      helpers.star(K, 250, 200 + sin(t * 2) * 12, 24 + a.beat * 12, { f: 2 }, 4, .3); helpers.star(K, 1360, 300 + sin(t * 2.4) * 12, 18 + a.beat * 10, { f: 2 }, 4, .3); helpers.star(K, 1300, 700, 14 + a.beat * 8, { f: -1 }, 4, .3);
    },
  });
})();
