// ============================================================
// hero.js — estética de superhéroes con diseños propios.
// Cuando la letra habla de héroes (o nombra a alguno), aparece la
// ciudad de noche con un reflector y un emblema original, una figura
// genérica con capa, trama de cómic y onomatopeyas. Nunca se dibujan
// personajes existentes ni sus emblemas.
// ============================================================

const HERO_NAMES = /\b(batman|spider-?man|superman|wonder woman|iron ?man|captain america|capit[aá]n am[eé]rica|hulk|thor|black panther|joker|guas[oó]n|harley quinn|flash|aquaman|deadpool|wolverine|venom|avengers|vengadores|justice league|marvel|dc comics|gotham|metropolis|batmobile|batim[oó]vil)\b/i;
LEX.push(['hero', new RegExp('\\b(hero|heroes|heroine|superhero\\w*|h[eé]roe\\w*|hero[ií]na\\w*|superh[eé]roe\\w*|villain\\w*|villan[oa]\\w*|superpower\\w*|superpoder\\w*|poderes|powers|cape|save the world|salvar el mundo|vigilante)\\b|' + HERO_NAMES.source, 'i'), 'héroe']);
SCENE_FOR.hero = 'ciudad héroe';
// sus nombres no se buscan en Wikipedia (traería imágenes de los personajes)
if (typeof NOT_ENTITY !== 'undefined') {
  const _askWiki = askWiki;
  askWiki = q => HERO_NAMES.test(q) ? undefined : _askWiki(q);
}

// ---------- emblema original: escudo con un rayo ----------
function emblem(cx, cy, s, col, a) {
  x.save(); x.translate(cx, cy); x.globalAlpha = a;
  x.fillStyle = col; x.beginPath();
  x.moveTo(0, -s); x.lineTo(s * .85, -s * .6); x.lineTo(s * .7, s * .35); x.lineTo(0, s); x.lineTo(-s * .7, s * .35); x.lineTo(-s * .85, -s * .6); x.closePath(); x.fill();
  x.globalCompositeOperation = 'destination-out'; x.beginPath();
  x.moveTo(s * .12, -s * .62); x.lineTo(-s * .3, s * .08); x.lineTo(-s * .02, s * .08); x.lineTo(-s * .16, s * .62); x.lineTo(s * .32, -s * .12); x.lineTo(s * .04, -s * .12); x.closePath(); x.fill();
  x.restore();
}
// figura genérica con capa (sin máscara ni rasgos de ningún personaje)
function caped(cx, by, s, t, k) {
  x.save(); x.globalAlpha = k; x.fillStyle = '#05060a';
  const wind = Math.sin(t * 1.6) * .15;
  x.beginPath(); x.moveTo(cx - s * .28, by - s * 1.55);
  x.quadraticCurveTo(cx - s * (.9 + wind), by - s * .7, cx - s * (1.25 + wind * 2), by - s * .05);
  x.lineTo(cx - s * (.7 + wind), by - s * .15); x.quadraticCurveTo(cx - s * .4, by - s * .8, cx - s * .1, by - s * 1.3); x.fill();
  x.lineWidth = s * .16; x.strokeStyle = '#05060a'; x.lineCap = 'round';
  x.beginPath(); x.moveTo(cx - s * .12, by); x.lineTo(cx - s * .1, by - s * .85); x.moveTo(cx + s * .14, by); x.lineTo(cx + s * .1, by - s * .85); x.stroke();
  x.beginPath(); x.moveTo(cx - s * .34, by - s * .82); x.lineTo(cx - s * .38, by - s * 1.6); x.quadraticCurveTo(cx, by - s * 1.72, cx + s * .38, by - s * 1.6); x.lineTo(cx + s * .34, by - s * .82); x.fill();
  x.lineWidth = s * .12; x.beginPath(); x.moveTo(cx + s * .36, by - s * 1.55); x.lineTo(cx + s * .5, by - s * 1.05); x.stroke();
  x.beginPath(); x.arc(cx, by - s * 1.9, s * .22, 0, TAU); x.fill();
  x.restore();
}

// ---------- escenario: ciudad héroe ----------
GENS.push({ name: 'ciudad héroe', make: r => ({ side: r() < .5 ? -1 : 1, seed: r() * 1e6 }),
  draw(p, t, dt, R, E) {
    bg('#04050d', '#141a2c'); drawStars(t, .3, .35);
    for (const d of P('hclouds', 7, () => [rnd(), rnd() * .35, .6 + rnd()])) glow(((d[0] + t * .004) % 1.2 - .1) * W, H * (.12 + d[1]), S() * .25 * d[2], 'rgba(60,70,95,A)', .5);
    // reflector desde la ciudad hacia las nubes, con el emblema original
    const bx = W * (.5 + R.side * .25), ex = W * (.5 - R.side * .08) + Math.sin(t * .2) * W * .05, ey = H * .18;
    const g = x.createLinearGradient(bx, H, ex, ey); g.addColorStop(0, 'rgba(255,245,200,.35)'); g.addColorStop(1, 'rgba(255,245,200,.05)');
    x.fillStyle = g; x.beginPath(); x.moveTo(bx - 10, H * .75); x.lineTo(ex - S() * .12, ey); x.lineTo(ex + S() * .12, ey); x.lineTo(bx + 10, H * .75); x.fill();
    glow(ex, ey, S() * .16, 'rgba(255,240,190,A)', .55 + E * .2);
    emblem(ex, ey, S() * .07, '#1a1d2a', .85);
    // edificios
    for (const [u, h, w] of P('hsky', 26, () => [rnd(), .15 + rnd() * .4, .03 + rnd() * .05])) {
      const x0 = u * W, top = H * (1 - h * .8); x.fillStyle = '#070810'; x.fillRect(x0, top, w * W, H - top);
      for (let yy = top + 8; yy < H - 4; yy += 11) for (let xx = x0 + 3; xx < x0 + w * W - 3; xx += 8)
        if ((Math.sin(xx * 3.1 + yy * 7.7) * 999 % 1 + 1) % 1 > .8) { x.fillStyle = 'rgba(255,210,130,.5)'; x.fillRect(xx, yy, 2, 3); }
    }
    // cornisa y la figura con capa
    const lx = R.side < 0 ? W * .08 : W * .62, ly = H * .72;
    x.fillStyle = '#0a0b12'; x.fillRect(lx, ly, W * .3, H - ly); x.fillStyle = '#12141f'; x.fillRect(lx - 6, ly - 6, W * .3 + 12, 10);
    caped(lx + W * .15, ly - 6, S() * .1, t, 1);
  } });

// ---------- capas de cómic ----------
const ONO = ['¡POW!', 'BAM!', 'ZAP!', 'BOOM!', 'WHAM!', 'KRAK!', '¡ZAS!', 'THWIP!'];
Object.assign(MOTIF, {
  hero(k, t, E) { MOTIF.halftone(k * .6, t); MOTIF.speedlines(k * .5, t); MOTIF.pow(k, t); if ((IN.beatCount >> 5) % 2) MOTIF.web(k, t); },
  halftone(k, t) {
    const step = 14, r0 = 5; x.fillStyle = C(0, .1 * k, 10);
    for (let yy = 0; yy < H; yy += step) for (let xx = (yy / step) % 2 ? step / 2 : 0; xx < W; xx += step) {
      const d = Math.hypot(xx - W * .8, yy - H * .2) / Math.hypot(W, H), r = r0 * (1 - d); if (r < .6) continue;
      x.beginPath(); x.arc(xx, yy, r, 0, TAU); x.fill(); }
  },
  speedlines(k, t) {
    x.strokeStyle = `rgba(255,255,255,${.12 * k})`; x.lineWidth = 2;
    for (let i = 0; i < 48; i++) { const a = i / 48 * TAU + Math.sin(i * 9) * .05, r0 = S() * (.35 + (i % 5) * .04), r1 = Math.hypot(W, H);
      x.beginPath(); x.moveTo(W / 2 + Math.cos(a) * r0, H / 2 + Math.sin(a) * r0); x.lineTo(W / 2 + Math.cos(a) * r1, H / 2 + Math.sin(a) * r1); x.stroke(); }
  },
  pow(k, t) {
    if (IN.beatHit && IN.beatCount % 8 === 4) MOTIF._pow = { at: performance.now(), word: ONO[(IN.beatCount >> 3) % ONO.length], x: W * (.2 + ((IN.beatCount * 37) % 60) / 100), y: H * (.2 + ((IN.beatCount * 53) % 30) / 100), c: IN.beatCount % 3 };
    const b = MOTIF._pow; if (!b) return;
    const age = (performance.now() - b.at) / 1000; if (age > .9) return;
    const a = clamp(1 - age / .9) * k, sc = .6 + ease(clamp(age / .15)) * .4, R = S() * .12 * sc;
    x.save(); x.translate(b.x, b.y); x.rotate(-.12); x.globalAlpha = a;
    x.fillStyle = C(b.c, 1, 20); x.strokeStyle = '#0a0a0a'; x.lineWidth = 5; x.beginPath();
    for (let i = 0; i < 24; i++) { const rr = i % 2 ? R * .62 : R; const ang = i / 24 * TAU; x.lineTo(Math.cos(ang) * rr * 1.4, Math.sin(ang) * rr); }
    x.closePath(); x.fill(); x.stroke();
    x.font = `400 ${R * .55}px "Bebas Neue", Impact, sans-serif`; x.textAlign = 'center'; x.textBaseline = 'middle';
    x.lineWidth = 6; x.strokeStyle = '#0a0a0a'; x.strokeText(b.word, 0, 0); x.fillStyle = '#fff6d0'; x.fillText(b.word, 0, 0);
    x.textBaseline = 'alphabetic'; x.restore();
  },
  web(k, t) {                                                     // telaraña natural con rocío en una esquina
    const cx = W * .92, cy = H * .08, R = S() * .32, spokes = 12;
    x.strokeStyle = `rgba(220,230,255,${.28 * k})`; x.lineWidth = 1;
    for (let i = 0; i < spokes; i++) { const a = Math.PI * .5 + i / spokes * Math.PI; x.beginPath(); x.moveTo(cx, cy); x.lineTo(cx + Math.cos(a) * R, cy + Math.sin(a) * R); x.stroke(); }
    for (let ring = 1; ring <= 8; ring++) { const rr = R * ring / 8; x.beginPath();
      for (let i = 0; i <= spokes; i++) { const a = Math.PI * .5 + i / spokes * Math.PI, sag = rr * .92; i ? x.quadraticCurveTo(cx + Math.cos(a - Math.PI / spokes / 2) * sag, cy + Math.sin(a - Math.PI / spokes / 2) * sag, cx + Math.cos(a) * rr, cy + Math.sin(a) * rr) : x.moveTo(cx + Math.cos(a) * rr, cy + Math.sin(a) * rr); }
      x.stroke(); }
    for (let i = 0; i < 14; i++) { const a = Math.PI * .5 + (i * .37 % 1) * Math.PI, rr = R * (.2 + (i * .61 % 1) * .8), tw = .5 + .5 * Math.sin(t * 2 + i);
      glow(cx + Math.cos(a) * rr, cy + Math.sin(a) * rr, 6, 'rgba(230,240,255,A)', tw * .8 * k); }
  },
});
if (typeof NEAR !== 'undefined') ['hero', 'web', 'pow'].forEach(id => NEAR.add(id));
if (typeof FLAT !== 'undefined') ['halftone', 'speedlines'].forEach(id => FLAT.add(id));

// ---------- transiciones de cómic ----------
if (typeof TR !== 'undefined') {
  Object.assign(TR, {
    // viñetas: la escena se parte en paneles con borde grueso que salen volando
    comicPanels(e, s, w, h, P) {
      const panels = [[0, 0, .55, .5], [.55, 0, .45, .5], [0, .5, .35, .5], [.35, .5, .65, .5]];
      panels.forEach(([u, v, pw, ph], i) => { const d = i * .12, k = clamp((e - d) / (1 - .36)); if (k >= 1) return;
        const X = u * w, Y = v * h, Wd = pw * w, Hd = ph * h, dir = i % 2 ? 1 : -1;
        x.save(); x.translate(X + Wd / 2 + dir * k * k * w * .8, Y + Hd / 2 - k * h * .2); x.rotate(dir * k * .5); x.globalAlpha = 1 - k * .5;
        x.drawImage(s, X, Y, Wd, Hd, -Wd / 2, -Hd / 2, Wd, Hd); x.lineWidth = 10; x.strokeStyle = '#0b0b0b'; x.strokeRect(-Wd / 2, -Hd / 2, Wd, Hd); x.restore(); });
    },
    // ¡POW!: un estallido de cómic barre la escena
    powWipe(e, s, w, h) {
      const R = e * Math.hypot(w, h) * .75;
      x.save(); x.beginPath(); x.rect(0, 0, w, h);
      for (let i = 0; i <= 24; i++) { const rr = i % 2 ? R * .7 : R, a = i / 24 * TAU; i ? x.lineTo(w / 2 + Math.cos(a) * rr, h / 2 + Math.sin(a) * rr) : x.moveTo(w / 2 + Math.cos(a) * rr, h / 2 + Math.sin(a) * rr); }
      x.closePath(); x.clip('evenodd'); x.drawImage(s, 0, 0); x.restore();
      if (e < .7) { x.font = `400 ${Math.min(w, h) * .22 * (1 + e)}px "Bebas Neue", Impact, sans-serif`; x.textAlign = 'center'; x.textBaseline = 'middle';
        x.globalAlpha = 1 - e / .7; x.lineWidth = 12; x.strokeStyle = '#0a0a0a'; x.strokeText('¡POW!', w / 2, h / 2); x.fillStyle = '#ffe14d'; x.fillText('¡POW!', w / 2, h / 2); x.textBaseline = 'alphabetic'; }
    },
  });
  KINDS.length = 0; KINDS.push(...Object.keys(TR));
}
