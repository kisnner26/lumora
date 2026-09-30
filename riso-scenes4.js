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


  // ---------- retrato a partir de fotos propias (personal/ella1.jpg, ella2.jpg...) ----------
  // Las fotos NO van al repositorio (carpeta personal/ ignorada por git). Cada una se convierte
  // en tres planchas de tinta: sombras y pelo en la tinta 1, calidez de la piel y labios en la
  // tinta 2, y el fondo en la tinta 3. El shader las imprime en trama, como el resto.
  const CROPS = [[40, 0, 640, 800], [150, 250, 720, 900], [0, 0, 0, 0]];
  const PH = { imgs: [], plates: [], ready: () => PH.plates.some(Boolean) };
  const blur = (src, w, h, r) => { const t = new Float32Array(w * h), o = new Float32Array(w * h);
    for (let y = 0; y < h; y++) { let acc = 0; for (let x = -r; x <= r; x++) acc += src[y * w + Math.min(w - 1, Math.max(0, x))]; for (let x = 0; x < w; x++) { t[y * w + x] = acc / (2 * r + 1); acc += src[y * w + Math.min(w - 1, x + r + 1)] - src[y * w + Math.max(0, x - r)]; } }
    for (let x = 0; x < w; x++) { let acc = 0; for (let y = -r; y <= r; y++) acc += t[Math.min(h - 1, Math.max(0, y)) * w + x]; for (let y = 0; y < h; y++) { o[y * w + x] = acc / (2 * r + 1); acc += t[Math.min(h - 1, y + r + 1) * w + x] - t[Math.max(0, y - r) * w + x]; } } return o; };
  function toPlate(img, crop) {
    const W = 420, H = 525, cv = document.createElement('canvas'); cv.width = W; cv.height = H; const g = cv.getContext('2d', { willReadFrequently: true });
    const [sx, sy, sw, sh] = crop[2] ? crop : [0, 0, img.width, img.height]; g.drawImage(img, sx, sy, sw, sh, 0, 0, W, H);
    const d = g.getImageData(0, 0, W, H), p = d.data, n = W * H, L = new Float32Array(n), R = new Float32Array(n), G = new Float32Array(n);
    for (let i = 0; i < n; i++) { R[i] = p[i * 4] / 255; G[i] = p[i * 4 + 1] / 255; L[i] = (p[i * 4] * .3 + p[i * 4 + 1] * .59 + p[i * 4 + 2] * .11) / 255; }
    // niveles automáticos (2 % y 98 %) y contraste local para que los rasgos no se pierdan en fotos oscuras
    const sorted = Float32Array.from(L).sort(), lo = sorted[Math.floor(n * .03)], hi = sorted[Math.floor(n * .985)], bl = blur(L, W, H, 22), bs = blur(L, W, H, 5);
    const T1 = new Float32Array(n), T2 = new Float32Array(n), T3 = new Float32Array(n);
    for (let i = 0; i < n; i++) {
      let l = Math.min(1, Math.max(0, (L[i] - lo) / (hi - lo + 1e-4))); const b = Math.min(1, Math.max(0, (bl[i] - lo) / (hi - lo + 1e-4)));
      l = Math.min(1, Math.max(0, .5 + (l - b) * 1.7 + (b - .5) * .75 + (bs[i] - bl[i]) * .5));
      const dark = 1 - l, q = Math.round(dark * 5) / 5;
      T1[i] = Math.min(1, Math.max(0, (q * .5 + dark * .5 - .3) * 1.55));
      const warm = Math.max(0, (R[i] - G[i]) * 3.6 - .06), green = Math.max(0, (G[i] - R[i]) * 4.5);
      T2[i] = Math.min(1, warm * (.62 + .38 * dark) * 1.05); T3[i] = Math.min(1, green * .9 + (warm < .08 ? .16 : 0));
    }
    for (let i = 0; i < n; i++) { p[i * 4] = Math.round(T1[i] * 255); p[i * 4 + 1] = Math.round(T2[i] * 255); p[i * 4 + 2] = Math.round(T3[i] * 255); p[i * 4 + 3] = 255; }
    g.putImageData(d, 0, 0); return cv;
  }
  ['ella1.jpg', 'ella2.jpg', 'ella3.jpg'].forEach((f, i) => { const im = new Image(); im.onload = () => { try { PH.plates[i] = toPlate(im, CROPS[i]); } catch (e) { console.warn('ella:', e.message); } }; im.src = 'personal/' + f; });
  function drawPhoto(K, s, t, dt, a) {
    const c = K.c, list = PH.plates.filter(Boolean); if (s.pi === undefined) { s.pi = ((Math.random() * list.length) | 0); s.age = 0; } const cv = list[s.pi % list.length]; s.age += dt;
    K.bg(3, .1); for (let i = 0; i < 28; i += 2) { const a0 = i / 28 * TAU + t * .03, a1 = (i + 1) / 28 * TAU + t * .03; K.poly([[800, 430], [800 + cos(a0) * 1900, 430 + sin(a0) * 1900], [800 + cos(a1) * 1900, 430 + sin(a1) * 1900]], { f: 2, ft: .2 }); }
    for (let i = 0; i < 6; i++) { const k = (t * .12 + i / 6) % 1, x = 120 + (i * 271) % 1400, y = 900 - k * 1000, sz = 10 + (i % 3) * 5; K.path(c2 => { for (let j = 0; j <= 40; j++) { const q = j / 40 * TAU; const px = x + 16 * sin(q) ** 3 * sz / 10, py = y - (13 * cos(q) - 5 * cos(2 * q) - 2 * cos(3 * q) - cos(4 * q)) * sz / 10; j ? c2.lineTo(px, py) : c2.moveTo(px, py); } }, O(i % 2 ? 2 : -1, 1, 4)); }
    const pw = 600, ph = pw * cv.height / cv.width, sw = 1 + sin(t * 1.3) * .006 + a.beat * .012, rot = -.035 + sin(t * .5) * .012;
    c.save(); c.translate(800, 450); c.rotate(rot); c.scale(sw, sw);
    K.rect(-pw / 2 + 18, -ph / 2 + 18, pw, ph, { f: 1, ft: .35, over: true }); K.rect(-pw / 2 - 12, -ph / 2 - 12, pw + 24, ph + 24, { f: -1, s: 1, lw: 8 });
    c.imageSmoothingEnabled = true; c.imageSmoothingQuality = 'high'; c.globalCompositeOperation = 'lighter'; c.drawImage(cv, -pw / 2, -ph / 2, pw, ph); c.globalCompositeOperation = 'source-over';
    K.rect(-pw / 2, -ph / 2, pw, ph, { s: 1, lw: 5 }); K.tape(-pw / 2 + 30, -ph / 2 - 6, 130, 40, -.6); K.tape(pw / 2 - 30, ph / 2 + 6, 130, 40, -.6); c.restore();
    helpers.star(K, 330, 200 + sin(t * 2) * 12, 26 + a.beat * 12, { f: 2 }, 4, .3); helpers.star(K, 1290, 260 + sin(t * 2.4) * 12, 20 + a.beat * 10, { f: 2 }, 4, .3);
  }

  const SC = {
    id: 'ella', name: 'ella', inks: 1, phrases: ['ella se ríe y el mundo baja el volumen', 'una mirada basta para cambiar la canción', 'hay caras que parecen una promesa'],
    make: r => ({ bl: 2, blink: 0, wk: 4 + r() * 3, wink: 0, hs: r() * 6 }),
    cam(cam, t) { cam.x = sin(t * .12) * 26; cam.y = cos(t * .09) * 14; cam.z = 1.02 + sin(t * .07) * .03; cam.r = sin(t * .05) * .008; },
    draw(K, s, t, dt, a) { if (PH.ready()) return drawPhoto(K, s, t, dt, a); return drawIllus(K, s, t, dt, a); },
    _illus(K, s, t, dt, a) {
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
  };
  register(SC); const drawIllus = (...a) => SC._illus(...a);
})();
