// ============================================================
// riso-mix.js — la mezcla: cómo se transforma la imagen cuando una canción se solapa con la siguiente
// (crossfade de Música, mezcla de Spotify). Antes el clip reiniciaba en seco con la toma de título.
// Mientras dura la mezcla (p de 0 a 1):
//   1. sobreimpresión de tintas: la última imagen de la canción que sale, congelada, va en la tinta 1; la portada
//      de la que entra, en la tinta 2 (y una copia girada en la 3). Donde se cruzan las tintas se multiplican y
//      aparece un tercer color; además los colores de todo el cuadro migran canal por canal al otro juego de tintas.
//   2. moiré: las dos imágenes se imprimen en trama con ángulos de rejilla distintos; en la mitad se interfieren.
//   3. crossfader dibujado: barra de papel con el título y el artista de cada lado y un deslizador que sigue a p.
//   4. registro que respira: el desalineo entre tintas crece hasta p = .5 y vuelve a 0.
//   5. la letra cruza: el último verso de la que sale se apaga mientras el primero de la nueva se escribe a mano.
//   6. al final, la toma de título de la canción nueva ya está debajo y la mezcla se desvanece sin salto.
// Tiempo: si al detectar el cambio la canción nueva ya va por más de 1,5 s, se asume que el solape ya empezó:
// D = clamp(posición + 3, 3, 12) s (se estiman 3 s por delante) y arranca en p0 = min(.9, pos / D). Si empieza en 0, dura 3 s fijos.
// Ajuste: «Mezcla entre canciones». Con Transiciones en «ninguna» vuelve el corte seco.
// Depuración: RISOMIX.start({ duration: 8 }) o la tecla M (con Shift); RISOMIX.hold = 0.5 congela en p.
// ============================================================
(() => {
  const R = window.RISO; if (!R || !window.RISOCLIP) return;
  const RC = RISOCLIP, st = R.stage, K = R.K, clamp = R.clamp, lerp = R.lerp, H = RC.h, PI = Math.PI;
  const sm = (a, b, x) => { const t = clamp((x - a) / (b - a)); return t * t * (3 - 2 * t); };
  const M = window.RISOMIX = RC.mix = { on: false, p: 0, D: 3, hold: null, from: null, to: null, title: null, log: [] };

  // ---------- planchas: una imagen se vuelve la densidad de una tinta ----------
  // canal 0 = tinta 1 · canal 1 = tinta 2 · canal 2 = tinta 3; contraste automático para que la trama respire
  function plateOf(src, sw, sh, ch, o = {}) {
    const W = o.w || 320, Hh = o.h || Math.round(W * sh / sw), cv = document.createElement('canvas'); cv.width = W; cv.height = Hh;
    const g = cv.getContext('2d', { willReadFrequently: true }); g.drawImage(src, 0, 0, W, Hh);
    const d = g.getImageData(0, 0, W, Hh), p = d.data, n = W * Hh, L = new Float32Array(n);
    for (let i = 0; i < n; i++) L[i] = o.red ? p[i * 4] / 255 : 1 - (p[i * 4] * .3 + p[i * 4 + 1] * .59 + p[i * 4 + 2] * .11) / 255;
    const s = Float32Array.from(L).sort(), lo = s[Math.floor(n * .04)], hi = s[Math.floor(n * .97)] + 1e-3;
    for (let i = 0; i < n; i++) { const v = clamp((L[i] - lo) / (hi - lo)) ** (o.gamma || 1); p[i * 4] = ch === 0 ? v * 255 : 0; p[i * 4 + 1] = ch === 1 ? v * 255 : 0; p[i * 4 + 2] = ch === 2 ? v * 255 : 0; p[i * 4 + 3] = 255; }
    g.putImageData(d, 0, 0); return cv;
  }

  // ---------- arranque ----------
  // o.from: canvas de la imagen que sale (por defecto, el último cuadro del escenario) · o.duration · o.p0
  function start(o = {}) {
    const meta = o.fromMeta || RC.prevMeta || { name: H.meta().title, artist: H.meta().artist, dur: 0 }, cur = H.meta();
    const src = o.from || st.canvas;
    M.from = { plate: plateOf(src, src.width, src.height, 0, { w: 384, gamma: 1.1 }), name: meta.name, artist: meta.artist, dur: meta.dur, txt: o.fromText ?? (RC.shot?.text?.text || ''), inks: RC.shot?.inks ?? 0, t0: meta.time ?? 0 };
    M.to = { name: cur.title, artist: cur.artist, art: null, gplate: null, bplate: null, artFor: '' };
    M.D = clamp(o.duration || 3, 2, 12); M.p = M.p0 = clamp(o.p0 || 0, 0, .95); M.hold = o.hold ?? null; M.t0 = performance.now();
    // la toma de título de la canción nueva ya queda preparada: debajo de la mezcla y, al final, la toma normal
    const time = H.timeNow(); M.title = RC.makeShot(-1, H.secOf(time), time, 'title'); M.title.k0 = -1e9; M.titleOn = false;
    M.on = true; RC.pending = null; if (st.cut) st.cut = null;
    M.log.push({ at: Date.now(), from: meta.name, to: cur.title, D: M.D, p0: M.p });
    return M;
  }
  function finish() {
    M.on = false; st.regBoost = 0; st.inkMix = null; if (M.title) { M.title.t0 = H.timeNow(); M.title.k0 = st.t; RC.shot = M.title; RC.count = (RC.count || 0) + 1; }
    M.title = null; M.from = null;
  }

  // ---------- portada de la que entra (se carga sola; mientras tanto, unas estrellas) ----------
  function coverPlates() {
    const to = M.to, a = H.artCanvas(); if (!a || to.art === a) return;
    to.art = a; to.gplate = plateOf(a, a.width, a.height, 1, { w: 240, red: true }); to.bplate = plateOf(a, a.width, a.height, 2, { w: 240, red: true });
  }

  // ---------- dibujo de un cuadro de la mezcla (dentro de la plancha) ----------
  function draw(dt) {
    const c = K.c, v = K.v, W = v.w, Hh = v.h;
    // el avance sigue el reloj de pared (el audio se solapa en tiempo real aunque el dibujo vaya lento)
    if (M.hold == null) M.p = Math.min(1, M.p0 + (performance.now() - M.t0) / 1000 / M.D); else M.p = M.hold;
    const p = M.p, e = R.ease(p);
    coverPlates();
    // ---- las dos imágenes, cada una en su tinta, sobreimpresas ----
    c.save(); c.globalCompositeOperation = 'lighter';
    if (M.from) { c.globalAlpha = clamp(1 - e * 1.15); const z = 1 + p * .1; c.save(); c.translate(v.l + W / 2, v.t + Hh / 2); c.scale(z, z); c.drawImage(M.from.plate, -W / 2, -Hh / 2, W, Hh); c.restore(); }
    // la portada crece desde el centro y viaja al lugar que tiene en la toma de título (así no hay salto)
    const G = M.to.gplate, B = M.to.bplate, k = sm(.05, .92, p), sz = lerp(Math.max(W, Hh) * 1.15, 500, k), cx = lerp(v.l + W / 2, 1260, k * k), cy = lerp(v.t + Hh / 2, 450, k * k), rot = lerp(-.25, .05, k);
    const pw = clamp(sm(.0, .5, p) * (1 - sm(.78, 1, p)));
    if (G) { c.globalAlpha = pw; c.save(); c.translate(cx, cy); c.rotate(rot); c.drawImage(G, -sz / 2, -sz / 2, sz, sz); c.restore(); }
    if (B) { c.globalAlpha = pw * .55 * Math.sin(p * PI); c.save(); c.translate(cx + 6, cy - 4); c.rotate(rot + .14); c.drawImage(B, -sz * .55, -sz * .55, sz * 1.1, sz * 1.1); c.restore(); }
    if (!G) { c.globalAlpha = 1; c.restore(); c.save(); R.props.drawProp(K, 'stars', cx, cy, sz / 520, e, { seed: 4 }); }
    c.restore();
    // ---- lo de siempre de la nueva toma, entrando por encima (mezcla de densidades) ----
    if (p > .5 && M.title) {
      if (!M.titleOn) { M.titleOn = true; M.title.k0 = K.t; M.title.t0 = H.timeNow(); }
      c.save(); c.globalAlpha = sm(.5, 1, p); RC.drawShot(M.title, H.timeNow(), dt); c.restore();
    }
    // ---- el registro respira y los colores migran ----
    const a = M.from ? M.from.inks : 0, b = M.title ? M.title.inks : 0;
    st.regBoost = Math.sin(p * PI) * 5.5; st.inkMix = { from: a, to: b, p: sm(.08, .92, p) };
    // ---- la letra cruza ----
    K.screen(() => {
      const m = st.margin, bw = Math.min(760, W - m * 2), bx = v.l + (W - bw) / 2, by = v.b - m - 92, fade = 1 - sm(.88, 1, p);
      if (M.from?.txt && p < .85) { const o = { size: 46, w: 700, font: 'display', stretch: 'condensed', i: 1, tone: clamp(1 - p * 1.25) }; if (o.tone > .05) K.txt(M.from.txt.slice(0, 44), bx, by - 118, o); }
      const first = IN.lines.find(l => l.text); if (p > .38 && first && IN.show !== false && p < .96) H.writeLine(first.text, bx, by - 232, bw, 110, (p - .38) * M.D, M.D, { size: 62, align: 'left' });
      // ---- crossfader ----
      if (fade > .02) {
        c.save(); c.globalAlpha = fade;
        K.rect(bx + 7, by + 7, bw, 76, { f: 1, ft: .3, over: true }); K.rect(bx, by, bw, 76, { f: -1, s: 1, lw: 4 });
        const tw = bw / 2 - 36, fitL = (s, oo) => { let z = oo.size; while (z > 14 && K.measure(s, { ...oo, size: z }) > tw) z -= 2; return z; };
        const nm = (s, x, al) => { const z = fitL(s || '—', { size: 22, w: 700, font: 'display' }); K.txt(s || '—', x, by + 30, { size: z, w: 700, font: 'display', align: al, i: 1 }); };
        nm(M.from?.name, bx + 16, 'left'); nm(M.to?.name, bx + bw - 16, 'right');
        K.code((M.from?.artist || '').toUpperCase().slice(0, 22), bx + 16, by + 50, { size: 12, tone: .8 }); K.code((M.to?.artist || '').toUpperCase().slice(0, 22), bx + bw - 16, by + 50, { size: 12, tone: .8, align: 'right' });
        const tx0 = bx + 20, tx1 = bx + bw - 20, ty = by + 63; K.line(tx0, ty, tx1, ty, 1, 4); K.rect(tx0, ty - 4, (tx1 - tx0) * p, 8, { f: 2 });
        const kx = tx0 + (tx1 - tx0) * p; K.rect(kx - 9, ty - 13, 18, 26, { f: 2, s: 1, lw: 3.5 }); K.line(kx, ty - 8, kx, ty + 8, 1, 2);
        K.code('MEZCLA ' + String(Math.round(p * 100)).padStart(2, '0') + '%', bx + bw / 2, by + 34, { size: 13, align: 'center', bg: true });
        c.restore();
      }
    });
  }
  M.draw = draw; M.start = start; M.finish = finish;

  // ---------- conexión con el clip ----------
  // frame() del clip llama a M.tick(); si devuelve true, la mezcla dibuja y las tomas normales esperan
  M.tick = dt => { if (!M.on) return false; if (M.hold == null && M.p0 + (performance.now() - M.t0) / 1000 / M.D >= 1) { finish(); return false; } return true; };
  // cambio de canción real: el clip llama a M.onSongChange antes de reiniciarse
  M.onSongChange = () => {
    if ((window.CFG && (CFG.mix === false || CFG.transitions === 'ninguna')) || !RC.shot || M.on) return false;
    // el solape ya lleva `pos` segundos: se estima que faltan unos 3 s (con D = pos, la fórmula literal dejaba solo el 10 % de la mezcla)
    const pos = H.timeNow(), pre = pos > 1.5, D = pre ? clamp(pos + 3, 3, 12) : 3;
    start({ duration: D, p0: pre ? Math.min(.9, pos / D) : 0 }); return true;
  };
  addEventListener('keydown', e => { if (e.shiftKey && e.key === 'M' && !/INPUT|TEXTAREA/.test(document.activeElement?.tagName || '') && RC.on) { e.stopImmediatePropagation(); M.on ? finish() : start({ duration: 8 }); } }, true);
  if (window.SETUI) SETUI.addRow('efectos', ['mix', 'Mezcla entre canciones', 'sw', null, 'cuando una canción se solapa con otra, la imagen se mezcla: tintas que se cruzan, moiré de puntos y un crossfader dibujado'], true);
})();
