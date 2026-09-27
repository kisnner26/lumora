// ============================================================
// sky.js — cielos procedurales y capas nuevas.
// "cielo": hora del día × nubes × astro × extras (estrellas fugaces,
// arcoíris, vía láctea) → cientos de cielos. Más fuegos artificiales,
// arcoíris, farolillos, mariposas y lluvia de meteoros.
// ============================================================

const SKY_TOD = [                                                        // [arriba, medio, horizonte, astro]
  ['#1b2a6b', '#f08a5d', '#ffd29b', 'sun'],                               // amanecer
  ['#2f7fd1', '#7fb8ec', '#dcefff', 'sun'],                               // mediodía
  ['#2a1e5c', '#e0567a', '#ffb36b', 'sun'],                               // atardecer
  ['#0b1640', '#3a4f9a', '#9aa7d8', 'moon'],                              // hora azul
  ['#02030b', '#0a1330', '#1c2a55', 'moon'],                              // noche
];
GENS.push({ name: 'cielo', make: r => ({ tod: Math.floor(r() * SKY_TOD.length), clouds: r(), extra: Math.floor(r() * 4), seed: r() * 1e6 }),
  draw(p, t, dt, R, E) {
    const [top, mid, hor, astro] = SKY_TOD[R.tod], night = R.tod >= 3;
    const g = x.createLinearGradient(0, 0, 0, H); g.addColorStop(0, top); g.addColorStop(.62, mid); g.addColorStop(1, hor);
    x.fillStyle = g; x.fillRect(0, 0, W, H);
    if (night) drawStars(t, R.tod === 4 ? 1 : .5);
    if (night && R.extra === 3) {                                         // vía láctea
      x.save(); x.translate(W / 2, H / 2); x.rotate(-.5);
      for (let i = 0; i < 26; i++) glow((i / 26 - .5) * W * 1.4, Math.sin(i * 1.7) * 30, S() * .12, 'rgba(200,190,255,A)', .09);
      x.restore();
    }
    const ax = W * (.25 + ((R.seed % 50) / 100)), ay = H * (astro === 'sun' ? lerp(.62, .2, R.tod === 1 ? 1 : .5) : .2);
    if (astro === 'sun') { glow(ax, ay, S() * .5, 'rgba(255,220,160,A)', .5 + E * .15); x.fillStyle = R.tod === 1 ? '#fff9e8' : '#ffd9a0'; x.beginPath(); x.arc(ax, ay, S() * .06, 0, TAU); x.fill(); }
    else { glow(ax, ay, S() * .25, 'rgba(220,230,255,A)', .35); x.fillStyle = '#eef1ff'; x.beginPath(); x.arc(ax, ay, S() * .05, 0, TAU); x.fill();
      x.fillStyle = top; x.beginPath(); x.arc(ax + S() * .02, ay - S() * .01, S() * .045, 0, TAU); x.fill(); }
    if (R.extra === 1 && !night) {                                        // arcoíris
      const cols = ['255,80,80', '255,160,60', '255,230,90', '110,220,120', '90,170,255', '170,110,255'];
      cols.forEach((c, i) => { x.strokeStyle = `rgba(${c},.28)`; x.lineWidth = S() * .018; x.beginPath(); x.arc(W * .5, H * 1.05, S() * (.75 - i * .02), Math.PI, TAU); x.stroke(); });
    }
    if (R.extra === 2) MOTIF.meteors(.9, t, E);
    // nubes en tres capas con profundidad
    for (let layer = 0; layer < 3; layer++) {
      const n = Math.round(4 + R.clouds * 8), sp = .006 + layer * .006, y0 = H * (.15 + layer * .18), c = night ? `rgba(${40 + layer * 15},${50 + layer * 15},${80 + layer * 15},A)` : `rgba(255,${245 - layer * 10},${240 - layer * 15},A)`;
      for (const d of P('cl' + layer + '-' + (R.seed | 0), n, () => [rnd(), rnd(), .6 + rnd()])) {
        const cx = ((d[0] + t * sp) % 1.3 - .15) * W, cy = y0 + d[1] * H * .12;
        for (let k = 0; k < 5; k++) glow(cx + (k - 2) * 40 * d[2], cy + Math.sin(k * 1.9) * 12, S() * .09 * d[2] * (1 + layer * .3), c, (night ? .35 : .55) * (1 - layer * .15));
      }
    }
  } });

// ---------- capas nuevas ----------
Object.assign(MOTIF, {
  fireworks(k, t, E) {
    if (IN.beatHit && IN.beatCount % 4 === 0) (MOTIF._fw = MOTIF._fw || []).push({ x: W * (.15 + Math.random() * .7), y: H * (.12 + Math.random() * .3), at: performance.now(), c: Math.floor(Math.random() * 3), n: 40 + Math.floor(Math.random() * 30) });
    MOTIF._fw = (MOTIF._fw || []).filter(f => performance.now() - f.at < 2200);
    for (const f of MOTIF._fw) {
      const age = (performance.now() - f.at) / 1000, a = clamp(1 - age / 2.2) * k;
      if (age < .1) glow(f.x, f.y, 80, 'rgba(255,245,220,A)', a);
      for (let i = 0; i < f.n; i++) { const ang = i / f.n * TAU, r = age * 160 * (1 - age * .25), px = f.x + Math.cos(ang) * r, py = f.y + Math.sin(ang) * r + age * age * 40;
        x.fillStyle = C(f.c + (i % 2), a, 25); x.fillRect(px, py, 2.2, 2.2); }
    }
  },
  rainbow(k, t) {
    const cols = ['255,80,80', '255,160,60', '255,230,90', '110,220,120', '90,170,255', '170,110,255'];
    cols.forEach((c, i) => { x.strokeStyle = `rgba(${c},${.3 * k})`; x.lineWidth = S() * .02; x.beginPath(); x.arc(W * .5, H * 1.08, S() * (.8 - i * .022), Math.PI, TAU); x.stroke(); });
  },
  lanterns(k, t) {
    for (const d of P('lant', 22, () => [rnd(), rnd(), .5 + rnd(), rnd() * TAU])) {
      const y = H - ((d[1] + t * .025 * d[2]) % 1.1) * H, xx = d[0] * W + Math.sin(t * .4 + d[3]) * 20, s = 10 * d[2];
      glow(xx, y, s * 4, 'rgba(255,170,80,A)', .45 * k);
      x.fillStyle = `rgba(255,190,110,${.9 * k})`; x.beginPath(); x.moveTo(xx - s * .6, y - s); x.lineTo(xx + s * .6, y - s); x.lineTo(xx + s * .45, y + s); x.lineTo(xx - s * .45, y + s); x.fill();
    }
  },
  butterflies(k, t) {
    for (const d of P('bfly', 14, () => [rnd(), rnd(), rnd() * TAU, Math.floor(rnd() * 3)])) {
      const xx = ((d[0] + t * .02) % 1.1) * W, y = d[1] * H * .8 + Math.sin(t * 1.3 + d[2]) * 30, flap = Math.abs(Math.sin(t * 9 + d[2])), s = 9;
      x.save(); x.translate(xx, y); x.rotate(Math.sin(t + d[2]) * .3); x.fillStyle = C(d[3], .85 * k, 15);
      for (const sd of [-1, 1]) { x.beginPath(); x.ellipse(sd * s * .7 * flap, -s * .3, s * .8 * flap + 1, s * .7, sd * .4, 0, TAU); x.fill();
        x.beginPath(); x.ellipse(sd * s * .5 * flap, s * .4, s * .5 * flap + 1, s * .45, -sd * .4, 0, TAU); x.fill(); }
      x.fillStyle = `rgba(20,15,10,${k})`; x.fillRect(-1, -s * .6, 2, s * 1.2); x.restore();
    }
  },
  meteors(k, t) {
    for (const d of P('met', 9, () => [rnd(), rnd() * .5, rnd(), .6 + rnd()])) {
      const kk = (t * .18 * d[3] + d[2]) % 1; if (kk > .35) continue;
      const q = kk / .35, sx = d[0] * W + q * 300, sy = d[1] * H + q * 180;
      const g = x.createLinearGradient(sx - 160, sy - 96, sx, sy); g.addColorStop(0, 'rgba(255,255,255,0)'); g.addColorStop(1, `rgba(255,250,235,${k * (1 - q)})`);
      x.strokeStyle = g; x.lineWidth = 2; x.beginPath(); x.moveTo(sx - 160, sy - 96); x.lineTo(sx, sy); x.stroke();
      glow(sx, sy, 10, 'rgba(255,250,235,A)', k * (1 - q));
    }
  },
});
LEX.push(
  ['fireworks', /\b(firework\w*|fuegos? artificiales|celebrat\w*|celebr\w*|new year|año nuevo|fiesta de fin)\b/i, 'fuegos artificiales'],
  ['rainbow', /\b(rainbow\w*|arco ?[ií]ris|colou?rs|colores)\b/i, 'arcoíris'],
  ['lanterns', /\b(lantern\w*|linterna\w*|farol\w*|candle ?light)\b/i, 'farolillos'],
  ['butterflies', /\b(butterfl\w*|mariposa\w*)\b/i, 'mariposas'],
  ['meteors', /\b(meteor\w*|comet\w*|cometa\w*|shooting stars?|estrellas? fugaz\w*)\b/i, 'meteoros'],
);
Object.assign(SCENE_FOR, { sky: 'cielo', sun: 'cielo', moon: 'cielo', fly: 'cielo', fireworks: 'cielo', rainbow: 'cielo', meteors: 'cielo', lanterns: 'cielo' });
if (typeof FAR !== 'undefined') ['meteors', 'rainbow'].forEach(id => FAR.add(id));
if (typeof PS !== 'undefined') { PS.meteors = (k, t) => MOTIF.meteors(k * .6, t); PS.lanterns = (k, t) => MOTIF.lanterns(k * .5, t); PS_NAMES.push('meteors', 'lanterns'); }
for (const g of ['pop', 'rnb']) if (GENRE[g]) GENRE[g].scenes.push('cielo');
