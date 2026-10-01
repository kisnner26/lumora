// ============================================================
// artists.js — perfiles por artista (y por era, según el álbum).
// Cada perfil ajusta paleta, escenarios, capas de fondo y tipografía.
// Solo estética: nada de portadas recreadas, logos ni personajes;
// todo lo que se dibuja aquí es original.
// ============================================================

const ARTISTS = [
  { id: 'weeknd', re: /the weeknd|weeknd/i, label: 'the weeknd', font: 'neon',
    scenes: ['calle', 'túnel', 'club', 'azotea'], ambient: ['taillights', 'neonrings', 'rain'],
    eras: [
      [/after hours/i, [355, 0, 20]], [/dawn fm/i, [190, 170, 260]], [/starboy/i, [330, 210, 280]],
      [/hurry up tomorrow/i, [350, 10, 30]], [/.*/, [355, 280, 20]],
    ] },
  { id: 'badbunny', re: /bad bunny/i, label: 'bad bunny', font: 'bold',
    scenes: ['playa', 'club', 'calle', 'campo'], ambient: ['neonpalms', 'flamboyan', 'speakers'],
    eras: [
      [/verano sin ti/i, [25, 190, 330], ['playa', 'club']], [/deb[ií] tirar|dtmf/i, [5, 120, 45], ['campo', 'playa']],
      [/nadie sabe/i, [230, 260, 0], ['club', 'túnel']], [/.*/, [320, 170, 45]],
    ] },
  { id: 'taylor', re: /taylor swift/i, label: 'taylor swift', font: 'serif',
    scenes: ['campo', 'escenario', 'horizonte', 'mandala'], ambient: ['polaroids', 'sparkle', 'leaves'],
    eras: [
      [/folklore|evermore/i, [210, 120, 30], ['campo', 'aurora']], [/1989/i, [200, 190, 30], ['playa', 'horizonte']],
      [/lover/i, [330, 200, 50], ['escenario', 'mandala']], [/reputation/i, [150, 0, 0], ['calle', 'red']],
      [/red/i, [0, 25, 40], ['campo', 'calle']], [/midnights/i, [260, 230, 290], ['nebulosa', 'deriva']],
      [/tortured poets/i, [40, 30, 0], ['habitación', 'campo']], [/showgirl/i, [25, 175, 45], ['escenario', 'club']],
      [/fearless/i, [45, 40, 30]], [/speak now/i, [280, 300, 260]], [/.*/, [330, 200, 45]],
    ] },
  { id: 'lana', re: /lana del rey/i, label: 'lana del rey', font: 'vintage',
    scenes: ['playa', 'horizonte', 'campo', 'habitación'], ambient: ['filmgrain', 'lightleak', 'flowers'],
    eras: [
      [/born to die/i, [355, 215, 40]], [/ultraviolence/i, [215, 220, 0]], [/honeymoon/i, [340, 20, 200]],
      [/norman|nfr/i, [20, 200, 330]], [/ocean blvd|did you know/i, [200, 30, 180]], [/.*/, [25, 200, 340]],
    ] },
  { id: 'zayn', re: /zayn/i, label: 'zayn', font: 'thin',
    scenes: ['habitación', 'nebulosa', 'aurora', 'horizonte'], ambient: ['smoke', 'silk', 'stars'],
    eras: [[/mind of mine/i, [275, 300, 250]], [/icarus/i, [25, 200, 45]], [/room under the stairs/i, [30, 20, 200]], [/.*/, [275, 230, 30]]] },
  { id: 'xxx', re: /xxxtentacion/i, label: 'xxxtentacion', font: 'mono',
    scenes: ['túnel', 'nebulosa', 'aurora', 'calle'], ambient: ['filmgrain', 'rain', 'flicker'],
    eras: [[/^17$|\b17\b/i, [220, 0, 0]], [/^\?$/, [55, 0, 0]], [/skins/i, [0, 0, 220]], [/bad vibes/i, [230, 260, 0]], [/.*/, [220, 0, 55]]] },
  { id: 'travis', re: /travis scott/i, label: 'travis scott', font: 'heavy',
    scenes: ['túnel', 'horizonte', 'club', 'estadio'], ambient: ['psyche', 'rollercoaster', 'cactus'],
    eras: [
      [/astroworld/i, [280, 30, 190], ['club', 'túnel']], [/utopia/i, [100, 60, 0], ['túnel', 'horizonte']],
      [/rodeo/i, [25, 15, 200], ['horizonte', 'calle']], [/birds in the trap/i, [230, 200, 15]], [/.*/, [25, 280, 190]],
    ] },
  { id: 'drake', re: /\bdrake\b/i, label: 'drake', font: 'clean',
    scenes: ['azotea', 'calle', 'club', 'estadio'], ambient: ['skyline6', 'speakers', 'rain'],
    eras: [[/views/i, [215, 40, 0]], [/scorpion/i, [0, 40, 220]], [/certified lover/i, [330, 200, 40]], [/for all the dogs/i, [30, 40, 200]], [/.*/, [42, 30, 220]]] },
];

let ARTIST_NOW = null;
function matchArtist() {
  const s = ext.st; if (!ext.has()) return null;
  const a = ARTISTS.find(p => p.re.test(s.artist || '')); if (!a) return null;
  const era = a.eras.find(([re]) => re.test(s.album || '')) || a.eras.at(-1);
  return { ...a, hues: era[1], scenes: era[2] ? [...era[2], ...a.scenes.filter(x => !era[2].includes(x))] : a.scenes };
}

// el perfil se enchufa como un "género" más: guion, capa ambiental y paleta salen de él
const _classifyGenre = classifyGenre;
classifyGenre = raw => ARTIST_NOW ? 'artist' : _classifyGenre(raw);
const _planScenes = planScenes;
planScenes = function () {
  if (ARTIST_NOW) GENRE.artist = { label: ARTIST_NOW.label, scenes: ARTIST_NOW.scenes, ambient: ARTIST_NOW.ambient, hues: ARTIST_NOW.hues };
  _planScenes();
  if (ARTIST_NOW) proc.palette = ARTIST_NOW.hues.map((h, i) => ({ h, s: [0, 220].includes(h) && ARTIST_NOW.id === 'xxx' ? 10 : 72 - i * 6, l: 58 + i * 4 }));
};
const _loadSongMeta4 = loadSongMeta;
loadSongMeta = async function () {
  ARTIST_NOW = matchArtist();
  lyr.dataset.font = ARTIST_NOW?.font || '';
  if (ARTIST_NOW) proc.palette = ARTIST_NOW.hues.map((h, i) => ({ h, s: 70 - i * 6, l: 58 + i * 4 }));
  return _loadSongMeta4();
};

// ---------- capas originales por artista ----------
Object.assign(MOTIF, {
  // luces traseras de autos que se alejan en la noche
  taillights(k, t) {
    for (let i = 0; i < 10; i++) {
      const z = ((i / 10) + IN.clock * .12) % 1, zz = z * z, y = H * (.55 + zz * .4), sp = 12 + zz * 120, cx = W * (.5 + Math.sin(i * 2.3) * .12 * (1 - zz));
      for (const sd of [-1, 1]) glow(cx + sd * sp * .5, y, 6 + zz * 40, 'rgba(255,30,40,A)', k * (.35 + zz * .5));
    }
  },
  // anillos de neón que laten con el tempo
  neonrings(k, t) {
    const b = IN.beat || 0;
    for (let i = 0; i < 3; i++) {
      const r = S() * (.16 + i * .09) * (1 + b * .03);
      x.strokeStyle = C(0, (.35 - i * .08) * k, 10); x.lineWidth = 3 - i; x.shadowColor = C(0, 1, 0); x.shadowBlur = 14;
      x.beginPath(); x.arc(W / 2, H * .45, r, 0, TAU); x.stroke();
    }
    x.shadowBlur = 0;
  },
  // árbol de flamboyán con flores rojas que caen
  flamboyan(k, t) {
    const bx = W * .85, by = H, s = S() * .5;
    x.strokeStyle = `rgba(30,18,12,${k})`; x.lineWidth = s * .05; x.lineCap = 'round';
    x.beginPath(); x.moveTo(bx, by); x.quadraticCurveTo(bx - s * .05, by - s * .5, bx - s * .2, by - s * .8); x.stroke();
    x.lineWidth = s * .025; x.beginPath(); x.moveTo(bx - s * .08, by - s * .5); x.quadraticCurveTo(bx + s * .2, by - s * .7, bx + s * .35, by - s * .75); x.stroke();
    for (const [u, v, r] of P('flamb', 26, () => [rnd() - .5, rnd(), .6 + rnd()])) glow(bx - s * .1 + u * s * 1.1, by - s * (.7 + v * .25), s * .09 * r, 'rgba(230,50,30,A)', .7 * k);
    for (const d of P('petalred', 30, () => [rnd(), rnd(), rnd() * TAU])) {
      const y = ((d[1] + t * .05) % 1) * H, xx = bx - s * .5 + d[0] * s * .9 + Math.sin(t + d[2]) * 20;
      x.fillStyle = `rgba(230,55,35,${.8 * k})`; x.beginPath(); x.ellipse(xx, y, 4, 2.5, t + d[2], 0, TAU); x.fill();
    }
  },
  // marcos de polaroid con degradados de la paleta (sin fotos)
  polaroids(k, t) {
    [[.14, .3, -.12, 0], [.86, .34, .1, 1], [.2, .72, .07, 2]].forEach(([u, v, rot, c], i) => {
      const s = S() * .13, fl = Math.sin(t * .6 + i) * .02;
      x.save(); x.globalAlpha = k * .85; x.translate(u * W, v * H); x.rotate(rot + fl);
      x.fillStyle = '#f3efe6'; x.fillRect(-s / 2 - 6, -s / 2 - 6, s + 12, s + 30);
      const g = x.createLinearGradient(-s / 2, -s / 2, s / 2, s / 2); g.addColorStop(0, C(c, 1, 10)); g.addColorStop(1, C(c + 1, 1, -15));
      x.fillStyle = g; x.fillRect(-s / 2, -s / 2, s, s); x.restore();
    });
  },
  leaves(k, t) { for (const d of P('autumn', 45, () => [rnd(), rnd(), rnd() * TAU, .5 + rnd()])) {
    const y = ((d[1] + t * .045 * d[3]) % 1) * H, xx = d[0] * W + Math.sin(t + d[2]) * 40;
    x.save(); x.translate(xx, y); x.rotate(t * d[3] + d[2]); x.fillStyle = `hsla(${15 + d[3] * 25},75%,50%,${.75 * k})`;
    x.beginPath(); x.ellipse(0, 0, 7, 3.5, 0, 0, TAU); x.fill(); x.restore(); } },
  // grano de película y saltos de luz
  filmgrain(k, t) {
    if (!MOTIF._grain) { const c = document.createElement('canvas'); c.width = c.height = 160; const g = c.getContext('2d'), d = g.createImageData(160, 160);
      for (let i = 0; i < d.data.length; i += 4) { const v = Math.random() * 255; d.data[i] = d.data[i + 1] = d.data[i + 2] = v; d.data[i + 3] = 26; } g.putImageData(d, 0, 0); MOTIF._grain = c; }
    x.save(); x.globalAlpha = k * .7; const ox = (Math.random() * 160) | 0, oy = (Math.random() * 160) | 0;
    x.fillStyle = x.createPattern(MOTIF._grain, 'repeat'); x.translate(-ox, -oy); x.fillRect(ox, oy, W, H); x.restore();
    x.fillStyle = `rgba(40,25,10,${.08 * k})`; x.fillRect(0, 0, W, H);
  },
  lightleak(k, t) {
    const a = (Math.sin(t * .3) * .5 + .5) * k;
    glow(W * .05, H * .15, S() * .7, 'rgba(255,120,60,A)', .25 * a); glow(W * .95, H * .9, S() * .6, 'rgba(255,200,120,A)', .18 * k);
  },
  silk(k, t) {
    for (let r = 0; r < 3; r++) {
      x.strokeStyle = C(r, .25 * k, 20); x.lineWidth = 12 - r * 3; x.lineCap = 'round'; x.beginPath();
      for (let i = 0; i <= 40; i++) { const u = i / 40, y = H * (.3 + r * .2) + Math.sin(u * 5 + t * (.4 + r * .15) + r) * H * .07; i ? x.lineTo(u * W, y) : x.moveTo(u * W, y); }
      x.stroke();
    }
  },
  stars(k, t) { drawStars(t, .7 * k); },
  flicker(k, t) { if (Math.random() < .04) { x.fillStyle = `rgba(0,0,0,${.35 * k})`; x.fillRect(0, 0, W, H); } },
  // remolino psicodélico
  psyche(k, t) {
    x.save(); x.translate(W / 2, H * .45);
    for (let i = 0; i < 14; i++) {
      x.rotate(.3 + Math.sin(IN.clock * .2) * .05);
      x.strokeStyle = C(i, .12 * k, 10); x.lineWidth = 16; x.beginPath();
      x.arc(0, 0, S() * (.08 + i * .045) * (1 + (IN.beat || 0) * .03), i * .5, i * .5 + 2.2); x.stroke();
    }
    x.restore();
  },
  // silueta de montaña rusa con un carrito que la recorre
  rollercoaster(k, t) {
    const pts = []; for (let i = 0; i <= 80; i++) { const u = i / 80; pts.push([u * W, H * (.62 - .18 * Math.abs(Math.sin(u * 5.2)) - .08 * Math.sin(u * 13) * (u > .5))]); }
    x.strokeStyle = `rgba(10,8,14,${.9 * k})`; x.lineWidth = 4; x.beginPath(); pts.forEach(([a, b], i) => i ? x.lineTo(a, b) : x.moveTo(a, b)); x.stroke();
    x.lineWidth = 1.5; for (let i = 0; i < pts.length; i += 4) { x.beginPath(); x.moveTo(pts[i][0], pts[i][1]); x.lineTo(pts[i][0], H); x.stroke(); }
    const j = Math.floor(((IN.clock * .05) % 1) * 80), [cx, cy] = pts[j];
    glow(cx, cy - 6, 30, CA(0, 20), .8 * k); x.fillStyle = C(0, k, 25); x.fillRect(cx - 10, cy - 10, 20, 8);
  },
  cactus(k, t) {
    [[.08, 1], [.9, .8], [.75, .55]].forEach(([u, s]) => {
      const bx = u * W, by = H, h = S() * .3 * s, w = h * .12; x.fillStyle = `rgba(12,10,8,${.95 * k})`;
      x.beginPath(); x.roundRect(bx - w / 2, by - h, w, h, w / 2); x.fill();
      x.beginPath(); x.roundRect(bx - w * 1.8, by - h * .7, w * .8, h * .35, w * .4); x.fill(); x.fillRect(bx - w * 1.4, by - h * .42, w, w * .6);
      x.beginPath(); x.roundRect(bx + w, by - h * .8, w * .8, h * .3, w * .4); x.fill(); x.fillRect(bx + w * .4, by - h * .55, w, w * .6);
    });
  },
  // perfil de ciudad con una torre alta (skyline genérico con aguja)
  skyline6(k, t) {
    x.fillStyle = `rgba(8,8,12,${.92 * k})`;
    for (const [u, h, w] of P('six', 30, () => [rnd(), .08 + rnd() * .2, .02 + rnd() * .04])) x.fillRect(u * W, H - h * H, w * W, h * H);
    const tx = W * .62; x.fillRect(tx - 5, H * .38, 10, H * .62); x.beginPath(); x.ellipse(tx, H * .5, 20, 9, 0, 0, TAU); x.fill(); x.fillRect(tx - 1.5, H * .22, 3, H * .16);
    glow(tx, H * .22, 14, 'rgba(255,60,60,A)', k * (Math.sin(t * 3) > 0 ? .9 : .2));
  },
});

// ---------- tipografía de la letra por artista ----------
const fontLink = document.createElement('link');
fontLink.rel = 'stylesheet';
fontLink.href = 'https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Space+Mono&family=Playfair+Display:ital,wght@1,400&family=Archivo+Black&display=swap';
document.head.appendChild(fontLink);
const st = document.createElement('style');
st.textContent = `
  #lyr[data-font="neon"] .line { font-family:'Bebas Neue',sans-serif; letter-spacing:.06em; color:#ffe9ea; }
  #lyr[data-font="neon"] .line .w.key .ch { color:#ff4a55; }
  #lyr[data-font="bold"] .line { font:400 clamp(24px,4vw,52px)/1.2 'Archivo Black',sans-serif; letter-spacing:.01em; }
  #lyr[data-font="serif"] .line, #lyr[data-font="vintage"] .line { font-family:'Playfair Display',serif; font-style:italic; }
  #lyr[data-font="vintage"] .line { color:#f5e6cf; }
  #lyr[data-font="thin"] .line { font:200 clamp(22px,3.8vw,48px)/1.3 Inter,sans-serif; letter-spacing:.14em; text-transform:lowercase; }
  #lyr[data-font="mono"] .line { font:400 clamp(18px,3vw,38px)/1.35 'Space Mono',monospace; letter-spacing:-.01em; }
  #lyr[data-font="heavy"] .line { font:400 clamp(26px,4.4vw,58px)/1.1 'Bebas Neue',sans-serif; letter-spacing:.03em; text-transform:uppercase; }
  #lyr[data-font="clean"] .line { font:300 clamp(22px,3.8vw,46px)/1.25 Inter,sans-serif; letter-spacing:.01em; }
  #lyr[data-font] .line .tr { font-family:'Cormorant Garamond',serif; font-style:italic; letter-spacing:.01em; text-transform:none; font-weight:300; }
`;
document.head.appendChild(st);

