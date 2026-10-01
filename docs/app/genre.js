// ============================================================
// genre.js — cada género tiene su mundo.
// R&B: habitación de noche, persianas, velas, vinilo, humo.
// Pop: escenario, bola de espejos, confeti en los tiempos fuertes.
// Rap: azotea, parlantes que bombean, pared con goteo de pintura, VHS.
// Urbano latino: neón tropical, parlantes, club y playa.
// Todo dibujado desde cero (nada de logos ni personajes existentes).
// ============================================================

function classifyGenre(raw) {
  const g = (raw || '').toLowerCase();
  if (/r&b|soul|funk/.test(g)) return 'rnb';
  if (/hip-hop|hip hop|rap|trap|drill/.test(g)) return 'rap';
  if (/latin|urbano|reggaet|dembow|bachata|salsa|cumbia|regional mexicano|corrido/.test(g)) return 'urbano';
  if (/pop|dance|k-pop|electr|house|disco/.test(g)) return 'pop';
  return '';
}
const GENRE = {
  rnb:    { label: 'r&b',          scenes: ['habitación', 'aurora', 'nebulosa', 'mandala'], ambient: ['blinds', 'candles', 'vinyl', 'smoke'], hues: [300, 265, 25] },
  pop:    { label: 'pop',          scenes: ['escenario', 'mandala', 'club', 'horizonte'],   ambient: ['disco', 'sparkle'],        hues: [330, 190, 50] },
  rap:    { label: 'rap',          scenes: ['azotea', 'calle', 'red', 'túnel'],             ambient: ['speakers', 'vhs', 'graffiti'],         hues: [45, 0, 210] },
  urbano: { label: 'urbano latino', scenes: ['club', 'playa', 'azotea', 'calle'],           ambient: ['neonpalms', 'speakers', 'vhs'],        hues: [320, 170, 45] },
};

// ---------- elementos por género ----------
Object.assign(MOTIF, {
  blinds(k, t) {
    // luz que entra por una persiana: franjas diagonales que respiran
    x.save(); x.translate(W * .15, -H * .1); x.rotate(.35);
    for (let i = 0; i < 12; i++) {
      const a = (.05 + .04 * Math.sin(t * .4 + i)) * k;
      const g = x.createLinearGradient(0, 0, W * 1.2, 0); g.addColorStop(0, `rgba(255,190,150,${a})`); g.addColorStop(1, 'rgba(255,190,150,0)');
      x.fillStyle = g; x.fillRect(0, i * H * .09, W * 1.2, H * .035);
    }
    x.restore();
  },
  candles(k, t, E) {
    const base = H * .93;
    [[.1, .9], [.16, .7], [.88, .8], [.93, 1]].forEach(([u, s], i) => {
      const cx = u * W, h = S() * .09 * s, w = S() * .026 * s, fl = Math.sin(t * 9 + i * 3) * .15;
      x.fillStyle = `rgba(235,225,210,${.85 * k})`; x.fillRect(cx - w / 2, base - h, w, h);
      glow(cx, base - h - w * .5, S() * .09 * s, 'rgba(255,170,80,A)', .5 * k * (1 + fl));
      x.fillStyle = `rgba(255,220,140,${k})`; x.beginPath(); x.ellipse(cx + fl * 3, base - h - w * .45, w * .18, w * .45, fl * .3, 0, TAU); x.fill();
    });
  },
  vinyl(k, t, E) {
    const cx = W * .82, cy = H * .3, r = S() * .13, rot = IN.clock * 1.8;
    x.save(); x.globalAlpha = k;
    x.fillStyle = '#0b0b0e'; x.beginPath(); x.arc(cx, cy, r, 0, TAU); x.fill();
    x.strokeStyle = 'rgba(255,255,255,.06)'; x.lineWidth = 1; for (let i = 3; i < 12; i++) { x.beginPath(); x.arc(cx, cy, r * i / 12, 0, TAU); x.stroke(); }
    x.strokeStyle = 'rgba(255,255,255,.18)'; x.lineWidth = 2; x.beginPath(); x.arc(cx, cy, r * .8, rot, rot + .6); x.stroke();
    x.fillStyle = C(0, 1, 5); x.beginPath(); x.arc(cx, cy, r * .3, 0, TAU); x.fill();
    x.fillStyle = '#0b0b0e'; x.beginPath(); x.arc(cx, cy, r * .03, 0, TAU); x.fill();
    x.strokeStyle = 'rgba(200,200,205,.8)'; x.lineWidth = 3; x.beginPath(); x.moveTo(cx + r * 1.15, cy - r * .9); x.lineTo(cx + r * 1.05, cy + r * .1); x.lineTo(cx + r * .62, cy + r * .45); x.stroke();
    x.restore();
  },
  disco(k, t, E) {
    const cx = W / 2, cy = H * .14, r = S() * .06, rot = IN.clock * .8;
    x.strokeStyle = `rgba(200,200,210,${k})`; x.lineWidth = 1; x.beginPath(); x.moveTo(cx, 0); x.lineTo(cx, cy - r); x.stroke();
    x.save(); x.beginPath(); x.arc(cx, cy, r, 0, TAU); x.clip();
    for (let i = -6; i < 6; i++) for (let j = -6; j < 6; j++) {
      const lum = 120 + 100 * Math.abs(Math.sin(i * 1.7 + j * 2.3 + rot * 3));
      x.fillStyle = `rgba(${lum},${lum},${lum + 20},${k})`; x.fillRect(cx + i * r / 5 + (rot * 20 % (r / 5)), cy + j * r / 5, r / 5 - 1, r / 5 - 1);
    }
    x.restore();
    for (let i = 0; i < 40; i++) {
      const a = i * 2.4 + rot, d = (.2 + (i % 7) / 8) * Math.max(W, H) * .6;
      const px = cx + Math.cos(a) * d, py = cy + Math.abs(Math.sin(a)) * d * .9;
      x.fillStyle = `hsla(${(i * 47) % 360},80%,80%,${(.3 + IN.beat * .5) * k})`; x.beginPath(); x.arc(px, py, 2 + (i % 3), 0, TAU); x.fill();
    }
  },
  sparkle(k, t) {
    for (const d of P('spk', 50, () => [rnd(), rnd(), rnd() * TAU])) {
      const tw = Math.max(0, Math.sin(t * 2.5 + d[2])) ** 10; if (tw < .05) continue;
      const px = d[0] * W, py = d[1] * H, l = 6 + tw * 12;
      x.strokeStyle = `rgba(255,255,255,${tw * k})`; x.lineWidth = 1.2; x.beginPath();
      x.moveTo(px - l, py); x.lineTo(px + l, py); x.moveTo(px, py - l); x.lineTo(px, py + l); x.stroke();
    }
  },
  speakers(k, t, E) {
    const pump = IN.beat, s = S() * .12;
    [[.07, 1], [.93, 1], [.07, 2], [.93, 2]].forEach(([u, row]) => {
      const bx = u * W - s / 2, by = H - s * 1.25 * row;
      x.fillStyle = `rgba(14,14,18,${.95 * k})`; x.fillRect(bx, by, s, s * 1.2);
      x.strokeStyle = `rgba(60,60,70,${k})`; x.lineWidth = 2; x.strokeRect(bx, by, s, s * 1.2);
      const cx = bx + s / 2, cy = by + s * .72, r = s * .34 * (1 + pump * .08);
      x.fillStyle = `rgba(30,30,36,${k})`; x.beginPath(); x.arc(cx, cy, r, 0, TAU); x.fill();
      x.strokeStyle = C(0, (.3 + pump * .6) * k, 10); x.lineWidth = 2; x.beginPath(); x.arc(cx, cy, r * .95, 0, TAU); x.stroke();
      x.fillStyle = `rgba(50,50,58,${k})`; x.beginPath(); x.arc(cx, cy, r * .35, 0, TAU); x.fill();
      x.fillStyle = `rgba(30,30,36,${k})`; x.beginPath(); x.arc(cx, by + s * .22, s * .1, 0, TAU); x.fill();
    });
  },
  vhs(k, t) {
    x.fillStyle = `rgba(0,0,0,${.12 * k})`; for (let y = 0; y < H; y += 3) x.fillRect(0, y, W, 1);
    if (IN.beat > .8 && IN.beatCount % 4 === 0) {
      const y = (Math.sin(t * 13) * .5 + .5) * H, h = 8 + Math.random() * 30;
      x.drawImage(cv, 0, y * DPR, cv.width, h * DPR, 6, y, W, h);
      x.fillStyle = `rgba(255,0,80,${.08 * k})`; x.fillRect(0, y, W, h);
    }
    x.fillStyle = `rgba(255,255,255,${.5 * k})`; x.font = '400 12px Inter'; x.textAlign = 'left';
    x.fillText('PLAY ▸  ' + fmtT(ext.has() ? ext.now() : T), 22, 34);
  },
  graffiti(k, t) {
    // pared con trazos y goteos de pintura, abstractos
    x.fillStyle = `rgba(20,18,22,${.55 * k})`; x.fillRect(0, H * .55, W, H * .45);
    for (let i = 0; i < 26; i++) { x.strokeStyle = `rgba(40,36,42,${.5 * k})`; x.lineWidth = 1; x.beginPath(); x.moveTo(0, H * .55 + i * 14); x.lineTo(W, H * .55 + i * 14); x.stroke(); }
    const strokes = P('graf', 7, () => [rnd(), .6 + rnd() * .25, rnd() * 360, .5 + rnd()]);
    strokes.forEach(([u, v, hue, s], i) => {
      x.strokeStyle = `hsla(${hue},85%,60%,${.75 * k})`; x.lineWidth = 10 * s; x.lineCap = 'round'; x.beginPath();
      for (let j = 0; j <= 12; j++) { const px = u * W + j * 14 * s, py = v * H + Math.sin(j * 1.3 + i) * 22 * s; j ? x.lineTo(px, py) : x.moveTo(px, py); }
      x.stroke();
      for (let j = 0; j < 4; j++) { const dx = u * W + (j * 37 % 150) * s, dl = (20 + (j * 23 % 60)) * Math.min(1, t * .1 % 1 + .4);
        x.lineWidth = 3 * s; x.beginPath(); x.moveTo(dx, v * H + 8); x.lineTo(dx, v * H + 8 + dl); x.stroke(); }
    });
  },
  neonpalms(k, t) {
    const flick = Math.sin(t * 30) > .96 ? .4 : 1;
    [[.1, 1, 320], [.9, -1, 170]].forEach(([u, dir, hue]) => {
      const bx = u * W, s = S() * .55;
      x.strokeStyle = `hsla(${hue},100%,65%,${.85 * k * flick})`; x.lineWidth = 3; x.shadowColor = `hsla(${hue},100%,60%,1)`; x.shadowBlur = 18;
      x.beginPath(); x.moveTo(bx, H); x.quadraticCurveTo(bx + dir * s * .25, H - s * .6, bx + dir * s * .12, H - s); x.stroke();
      const tx = bx + dir * s * .12, ty = H - s;
      for (let j = 0; j < 6; j++) { const a = -Math.PI / 2 + (j - 2.5) * .5; x.beginPath(); x.moveTo(tx, ty);
        x.quadraticCurveTo(tx + Math.cos(a) * s * .3, ty + Math.sin(a) * s * .3 - s * .04, tx + Math.cos(a) * s * .5, ty + Math.sin(a) * s * .3 + s * .12); x.stroke(); }
    });
    x.shadowBlur = 0;
  },
});

// ---------- escenarios por género ----------
GENS.push(
  { name: 'habitación', make: r => ({ moon: r() }),
    draw(p, t, dt, R, E) {
      bg('#0d0714', '#1a0c1c');
      const wx = W * .56, wy = H * .12, ww = W * .3, wh = H * .42;
      const sky = x.createLinearGradient(0, wy, 0, wy + wh); sky.addColorStop(0, '#120a2a'); sky.addColorStop(1, '#3a1840');
      x.fillStyle = sky; x.fillRect(wx, wy, ww, wh);
      glow(wx + ww * (.3 + R.moon * .4), wy + wh * .3, ww * .35, 'rgba(230,220,255,A)', .4);
      x.fillStyle = '#efe8ff'; x.beginPath(); x.arc(wx + ww * (.3 + R.moon * .4), wy + wh * .3, ww * .07, 0, TAU); x.fill();
      for (let i = 0; i < 14; i++) { x.fillStyle = 'rgba(10,6,16,.55)'; x.fillRect(wx, wy + i * wh / 14, ww, wh / 28); }
      x.strokeStyle = '#2a1a30'; x.lineWidth = 8; x.strokeRect(wx, wy, ww, wh);
      x.fillStyle = '#140a18'; x.fillRect(0, H * .72, W, H * .28);
      x.fillStyle = '#231228'; x.beginPath(); x.roundRect(W * .08, H * .66, W * .5, H * .16, 18); x.fill();
      x.fillStyle = '#2e1834'; x.beginPath(); x.roundRect(W * .1, H * .62, W * .12, H * .07, 12); x.fill();
      MOTIF.blinds(1, t); MOTIF.candles(.9, t, E);
      glow(W / 2, H * .55, S() * .7, CA(0, 5), .08 + IN.beat * .06);
    } },
  { name: 'escenario', make: r => ({ h: r() * 360 }),
    draw(p, t, dt, R, E) {
      bg('#07040f', '#10081c');
      for (let i = 0; i < 5; i++) {
        const a = Math.PI / 2 + Math.sin(t * .6 + i * 1.4) * .5, ox = W * (i + .5) / 5;
        const g = x.createLinearGradient(ox, 0, ox + Math.cos(a) * H, H);
        g.addColorStop(0, `hsla(${(R.h + i * 60) % 360},90%,70%,${.22 + IN.beat * .2})`); g.addColorStop(1, `hsla(${(R.h + i * 60) % 360},90%,70%,0)`);
        x.fillStyle = g; x.beginPath(); x.moveTo(ox - 8, 0); x.lineTo(ox + Math.cos(a) * H - 90, H); x.lineTo(ox + Math.cos(a) * H + 90, H); x.lineTo(ox + 8, 0); x.fill();
      }
      const sy = H * .7; x.fillStyle = '#16101f'; x.fillRect(0, sy, W, H - sy);
      for (let i = 0; i < 10; i++) { x.fillStyle = `hsla(${(R.h + i * 36) % 360},80%,60%,${.08 + (IN.beatCount % 10 === i ? .3 : 0)})`; x.fillRect(i * W / 10, sy, W / 10 - 2, 10); }
      MOTIF.disco(1, t, E); MOTIF.crowd(.9, t, E);
    } },
  { name: 'azotea', make: r => ({ tank: r() < .6 }),
    draw(p, t, dt, R, E) {
      bg('#070812', '#1b1420'); drawStars(t, .35, .3);
      glow(W / 2, H * .62, S() * .9, 'rgba(255,150,70,A)', .18);
      const b = P('sky', 40, () => [rnd(), .12 + rnd() * .35, .02 + rnd() * .04]);
      for (const [u, h, w] of b) { const bx = u * W, bh = h * H; x.fillStyle = '#0c0c14'; x.fillRect(bx, H * .62 - bh, w * W, bh);
        for (let yy = H * .62 - bh + 6; yy < H * .62 - 4; yy += 10) for (let xx = bx + 3; xx < bx + w * W - 3; xx += 8)
          if ((Math.sin(xx * 3.1 + yy * 7.7) * 999 % 1 + 1) % 1 > .75) { x.fillStyle = 'rgba(255,200,120,.55)'; x.fillRect(xx, yy, 2, 3); } }
      x.fillStyle = '#12111a'; x.fillRect(0, H * .62, W, H * .38);
      x.fillStyle = '#1c1a24'; x.fillRect(0, H * .62, W, 10);
      if (R.tank) { const tx = W * .7, ty = H * .62; x.fillStyle = '#0e0d14'; x.fillRect(tx - 34, ty - 110, 68, 70); x.beginPath(); x.moveTo(tx - 38, ty - 110); x.lineTo(tx, ty - 140); x.lineTo(tx + 38, ty - 110); x.fill();
        for (const dx of [-26, 26]) x.fillRect(tx + dx - 2, ty - 40, 4, 40); }
      MOTIF.graffiti(.8, t); MOTIF.speakers(1, t, E);
    } },
);

// ---------- guion con género: si la letra no sugiere nada, manda el género ----------
function planScenes() {
  IN.genre = classifyGenre(IN.genreRaw);
  const G = GENRE[IN.genre];
  IN.blockGen = [];
  const byName = n => GENS.findIndex(g => g.name === n);
  for (let i = 0; i < IN.cuts.length; i++) {
    const a = IN.cuts[i], b = IN.cuts[i + 1] ?? Infinity, count = {};
    for (const l of IN.lines) if (l.text && l.t >= a && l.t < b)
      for (const [id, re] of LEX) if (re.test(l.text)) { const g = SCENE_FOR[id]; if (g) count[g] = (count[g] || 0) + 1; }
    if (G) for (const g of G.scenes) count[g] = (count[g] || 0) + .6;       // el género inclina la balanza
    const ranked = Object.entries(count).sort((p, q) => q[1] - p[1]).map(e => byName(e[0])).filter(g => g >= 0);
    const prev = IN.blockGen[i - 1];
    let gi = ranked.find(g => g !== prev);
    if (gi === undefined) { gi = proc.order[i % proc.order.length]; if (gi === prev) gi = proc.order[(i + 1) % proc.order.length]; }
    IN.blockGen.push(gi);
  }
  if (G && !artImg) proc.palette = G.hues.map((h, i) => ({ h, s: 70 + i * 5, l: 58 + i * 3 }));
}

// ---------- capa ambiental del género (sutil, cambia por bloque) ----------
const _procFrame = procFrame;
procFrame = function (t, dt) {
  _procFrame(t, dt);
  const G = GENRE[IN.genre]; if (!G || IN.preparing) return;
  const time = ext.active() ? ext.now() : T;
  if (proc.dur && time > proc.dur - 4) return;
  const sec = Math.max(0, IN.cuts.findLastIndex(c => c <= time));
  const own = GENS[IN.blockGen?.[sec]]?.name;
  if (['habitación', 'escenario', 'azotea'].includes(own)) return;       // esos escenarios ya traen lo suyo
  const id = G.ambient[sec % G.ambient.length];
  const fadeIn = clamp((time - (IN.cuts[sec] || 0)) / 1.5);
  window.CAM ? CAM.draw(id, () => MOTIF[id]?.(.4 * fadeIn, IN.clock, IN.beat)) : MOTIF[id]?.(.4 * fadeIn, IN.clock, IN.beat);
};

// el género se ve en el panel
const _ui3 = ui;
ui = function () {
  _ui3();
  const G = GENRE[IN.genre];
  if (G && ext.has() && mode === 'proc') $('nowSub').textContent += ' · ' + G.label;
};
