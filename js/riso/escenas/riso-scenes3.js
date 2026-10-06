// ============================================================
// riso-scenes3.js — 24 escenas más, pensadas para que cada letra tenga su lugar.
// Cada escena trae, además, las palabras (español e inglés) que la piden: el videoclip
// las lee en el verso y elige la escena que encaja (RISO.SCENE_RX).
// Se arman con un fondo propio + los objetos dibujados de riso-props.js.
// ============================================================
(() => {
  const { register, nz, helpers } = RISO, TAU = Math.PI * 2, sin = Math.sin, cos = Math.cos, PI = Math.PI;
  const RX = RISO.SCENE_RX = {};
  const O = (f, s = 1, lw = 5, ft = 1) => ({ f, ft, s, lw });
  const hs = a => { let h = 0; for (const c of a) h = (h * 31 + c.charCodeAt(0)) | 0; return Math.abs(h); };

  // ---------- piezas comunes ----------
  const sky = (K, ink, t0, t1) => { K.bg(ink, Math.min(t0, t1) * .6); K.c.fillStyle = K.lin(ink, 0, -300, 0, 800, t0, t1); K.c.fillRect(-1600, -1200, 6400, 2400); };
  const hills = (K, y, amp, fr, ink, tone, ph = 0, line = true) => K.path(c => { c.moveTo(-800, 1400); for (let x = -800; x <= 2400; x += 40) c.lineTo(x, y - Math.abs(sin(x * fr + ph)) * amp - sin(x * fr * 2.3 + ph) * amp * .2); c.lineTo(2400, 1400); c.closePath(); }, { f: ink, ft: tone, s: line ? 1 : 0, lw: 6 });
  const sun = (K, x, y, r, rays = 0, t = 0) => { K.circ(x, y, r, O(2, 1, 6)); for (let i = 0; i < rays; i++) { const a = i * TAU / rays + t * .15; K.line(x + cos(a) * (r + 24), y + sin(a) * (r + 24), x + cos(a) * (r + 60 + (i % 2) * 24), y + sin(a) * (r + 60 + (i % 2) * 24), 1, 7); } };
  const moon = (K, x, y, r, ink = 2) => { K.circ(x, y, r, O(ink, 1, 6)); K.circ(x + r * .38, y - r * .1, r * .86, { f: -1 }); K.circ(x, y, r, { s: 1, lw: 6 }); };
  const stars = (K, t, n, seed, x0 = 0, y0 = 0, w = 1600, h = 500) => { for (let i = 0; i < n; i++) { const a = nz(seed + i * 1.7), b = nz(seed + i * 3.1 + 40), tw = .5 + .5 * sin(t * 2 + i); if (i % 4 === 0) helpers.star(K, x0 + a * w, y0 + b * h, 8 + tw * 6, { f: 2 }, 4, .3); else K.circ(x0 + a * w, y0 + b * h, 1.5 + tw * 2, { f: -1 }); } };
  const P = (K, id, x, y, s, ph = 0, rot = 0) => RISO.props.drawProp(K, id, x, y, s, 1, { ph, rot, seed: hs(id) });
  const clouds = (K, t, y, n, ink = -1, sc = 1) => { for (let i = 0; i < n; i++) { const cx = ((i * 640 + t * (10 + i * 3)) % 2600) - 500; helpers.cloud(K, cx, y + (i % 2) * 90, sc * (1 + i * .1), O(ink, 1, 5)); } };
  const crowd = (K, y, t, a, n, sc = 1, ink = 1) => { for (let i = 0; i < n; i++) { const x = -100 + i * (1800 / n) + (i % 2) * 24, b = Math.abs(sin(t * 4 + i * 1.7)) * (10 + a.beat * 22) * sc; K.circ(x, y - b, 26 * sc, { f: ink }); K.path(c => { c.moveTo(x - 44 * sc, y + 120 * sc); c.quadraticCurveTo(x, y - 30 * sc - b, x + 44 * sc, y + 120 * sc); c.closePath(); }, { f: ink }); if (i % 3 === 0) K.line(x + 30 * sc, y - b * .5, x + 58 * sc, y - 70 * sc - b, ink, 9 * sc); } };
  const win = (K, x, y, w, h, ink = 3) => { K.rect(x, y, w, h, O(ink, 1, 8, .5)); K.line(x + w / 2, y, x + w / 2, y + h, 1, 6); K.line(x, y + h / 2, x + w, y + h / 2, 1, 6); K.rect(x - 16, y + h, w + 32, 18, O(2, 1, 5)); };
  const road = (K, t, a, vy, ink = 1) => { K.path(c => { c.moveTo(-600, 1100); c.lineTo(800 - 40, vy); c.lineTo(800 + 40, vy); c.lineTo(2200, 1100); c.closePath(); }, { f: ink, ft: .9 }); for (let i = 0; i < 9; i++) { const k = ((i / 9 + t * .35 * (.6 + a.e)) % 1), y = vy + Math.pow(k, 2.2) * (1100 - vy), w = 4 + k * k * 34, h = 6 + k * k * 60; K.rect(800 - w / 2, y, w, h, { f: -1 }); } };
  const glowD = (K, x, y, r, ink = 2, t = .7) => K.glow(ink, x, y, r, t);
  const lampD = (K, x, y, s, a) => { K.line(x, y, x, y + 200 * s, 1, 7 * s); K.path(c => { c.moveTo(x - 40 * s, y + 6); c.lineTo(x + 40 * s, y + 6); c.lineTo(x + 24 * s, y - 40 * s); c.lineTo(x - 24 * s, y - 40 * s); c.closePath(); }, O(2, 1, 5)); glowD(K, x, y + 30, 220 * s + a.e * 40, 2, .6); };

  const S = (id, name, inks, rx, phrases, make, draw) => { RX[id] = rx; register({ id, name, inks, phrases, make, draw }); };

  // ---------- 1 · desierto ----------
  S('desierto', 'desierto', 0, /\b(desert\w*|dunes?|dunas?|sand storm|dust|polvo|thirst|sed|camel\w*|oasis|mirage|espejismo|cactus|nowhere|scorching)\b/i,
    ['el sol no perdona a nadie', 'caminar hasta que el mapa se acabe', 'un espejismo con tu nombre'],
    r => ({ sw: r() * 6 }),
    (K, s, t, dt, a) => { sky(K, 2, .1, .85); sun(K, 1050, 300, 120 + a.beat * 6, 18, t); hills(K, 640, 90, .0036, 3, .4, 1); hills(K, 700, 120, .0024, 2, .55, 3); hills(K, 800, 90, .004, 1, .35, 5);
      for (let i = 0; i < 12; i++) { const y = 620 + i * 18; K.path(c => { for (let x = -100; x <= 1700; x += 30) { const yy = y + sin(x * .02 + t * 2 + i) * 4; x < -99 ? c.moveTo(x, yy) : c.lineTo(x, yy); } }, { s: 2, lw: 2, st: .35 }); }
      P(K, 'fly', 500, 220, .45, s.sw); P(K, 'fly', 300, 300, .3, s.sw + 2); K.line(180, 760, 180, 620, 1, 12); K.line(180, 690, 130, 650, 1, 10); K.line(180, 670, 230, 620, 1, 10); K.circ(180, 610, 12, { f: 2 }); });

  // ---------- 2 · playa ----------
  S('playa', 'playa al atardecer', 2, /\b(beach\w*|playa\w*|palm\w*|palmeras?|shore|orilla|island|isla|surf\w*|tropic\w*|coast|costa|seaside|sunset|atardecer|sandals|coconut|coco|vacation|vacaciones|summer|verano)\b/i,
    ['el mar borra lo que escribimos en la arena', 'verano es cualquier lugar contigo', 'el sol se despide despacio'],
    r => ({ }),
    (K, s, t, dt, a) => { sky(K, 2, .0, .75); sun(K, 800, 470, 150 + a.beat * 6, 0); K.rect(-800, 520, 4000, 500, { f: 3, ft: .55 });
      for (let i = 0; i < 12; i++) { const y = 530 + i * 26; K.path(c => { for (let x = -100; x <= 1700; x += 24) { const yy = y + sin(x * .016 + t * 1.6 + i * 1.3) * (4 + i * .8); x < -99 ? c.moveTo(x, yy) : c.lineTo(x, yy); } }, { s: 1, lw: 2 + i * .3, st: .8 }); }
      K.rect(800 - 160, 500, 320, 10, { f: 2, ft: .9 }); K.path(c => { c.moveTo(-800, 900); c.lineTo(-800, 780); for (let x = -800; x <= 2400; x += 50) c.lineTo(x, 780 + sin(x * .01 + t * .5) * 8); c.lineTo(2400, 900); c.closePath(); }, O(3, 1, 6, .3));
      K.rect(-800, 820, 4000, 400, { f: 2, ft: .4 }); K.hatch(-800, 820, 4000, 400, 1, 22, -.3, 2, .5);
      const palm = (x, sc, ph) => { const sw = sin(t + ph) * 6; K.path(c => { c.moveTo(x, 860); c.bezierCurveTo(x + 30 * sc, 700, x - 20 * sc, 560, x + 20 * sc + sw, 430 * (2 - sc)); }, { s: 1, lw: 16 * sc }); for (let k = 0; k < 6; k++) { const an = -PI / 2 + (k - 2.5) * .55 + sin(t * 1.2 + k + ph) * .06; helpers.leaf(K, x + 20 * sc + sw, 430 * (2 - sc), 190 * sc, 30 * sc, an, O(3, 1, 5, .9)); } };
      palm(230, 1.1, 0); palm(1370, 1, 2); K.path(c => { c.moveTo(1000, 640); c.lineTo(1140, 640); c.lineTo(1100, 690); c.lineTo(1040, 690); c.closePath(); }, O(2, 1, 5)); K.line(1070, 640, 1070, 540, 1, 5); K.poly([[1074, 545], [1130, 630], [1074, 630]], O(-1, 1, 4)); P(K, 'fly', 700, 250, .4, 1); });

  // ---------- 3 · montaña ----------
  S('montana', 'montaña', 3, /\b(mountains?|monta[nñ]as?|peaks?|cimas?|climb\w*|escal\w*|cliffs?|summit|glacier|snow\w*|nieve|nevad\w*|ice|hielo|altitude|high up|everest|alps|andes|hills?)\b/i,
    ['la cima se ve distinta desde abajo', 'subir es lo único que me queda', 'el frío también tiene su belleza'],
    r => ({ fl: Array.from({ length: 40 }, () => [r(), r(), r()]) }),
    (K, s, t, dt, a) => { sky(K, 3, .05, .6); sun(K, 1200, 250, 70, 0); clouds(K, t, 200, 3, -1, 1.1);
      const mt = (x, w, h, ink, tone, y = 720) => { K.path(c => { c.moveTo(x - w, y); c.lineTo(x, y - h); c.lineTo(x + w, y); c.closePath(); }, O(ink, 1, 7, tone)); K.path(c => { c.moveTo(x - w * .28, y - h * .72); c.lineTo(x, y - h); c.lineTo(x + w * .28, y - h * .72); c.lineTo(x + w * .1, y - h * .66); c.lineTo(x - w * .05, y - h * .74); c.closePath(); }, O(-1, 1, 5)); K.clip(c => { c.moveTo(x, y - h); c.lineTo(x + w, y); c.lineTo(x, y); c.closePath(); }, () => K.rect(x - 10, y - h, w + 20, h, { f: 1, ft: .4, over: true })); };
      mt(300, 340, 470, 3, .55, 760); mt(1150, 420, 580, 2, .5, 760); mt(720, 300, 380, 3, .8, 760);
      K.rect(-800, 740, 4000, 400, { f: 3, ft: .45 }); K.line(-800, 740, 3000, 740, 1, 7);
      const pine = (x, y, sc, ph) => { const sw = sin(t + ph) * 4; for (let k = 0; k < 3; k++) K.poly([[x - (70 - k * 18) * sc, y - k * 56 * sc], [x + sw * k * .3, y - 96 * sc - k * 56 * sc], [x + (70 - k * 18) * sc, y - k * 56 * sc]], O(3, 1, 6, .8)); K.line(x, y, x, y + 40 * sc, 1, 9 * sc); };
      pine(160, 860, 1.3, 0); pine(360, 880, 1, 1.4); pine(1400, 870, 1.2, 2.2); pine(1530, 890, .9, 3.1);
      for (const q of s.fl) { const k = (t * .08 + q[2]) % 1; K.circ(q[0] * 1700, (q[1] * 900 + k * 900) % 900, 2 + q[2] * 3, { f: -1 }); } });

  // ---------- 4 · tormenta ----------
  S('tormenta', 'tormenta', 4, /\b(storms?|tormentas?|thunder\w*|truenos?|lightning|rayos?|hurricanes?|huracanes?|waves?|olas?|drown\w*|ahog\w*|shipwreck|naufrag\w*|flood|inunda\w*|tempest|gale|monsoon)\b/i,
    ['el cielo se rompe y yo sigo aquí', 'cada ola trae algo que quise olvidar', 'ni la tormenta se parece a esto'],
    r => ({ fl: 0, seed: r() * 100 }),
    (K, s, t, dt, a) => { K.bg(1, .6); K.c.fillStyle = K.lin(1, 0, -200, 0, 700, .95, .35); K.c.fillRect(-800, -600, 4000, 1400); s.fl = Math.max(0, s.fl - dt * 3); if (a.beat > .8 && Math.random() < .5) s.fl = 1;
      if (s.fl > .1) K.bg(3, s.fl * .5); const cp = helpers.cloud; for (let i = 0; i < 4; i++) cp(K, 250 + i * 420 + sin(t * .3 + i) * 30, 170 + (i % 2) * 60, 2.2, O(1, 3, 6, .9));
      if (s.fl > .3) K.poly([[900, 300], [840, 470], [890, 470], [820, 680], [960, 440], [905, 440], [950, 300]], O(2, 1, 6, 1));
      for (let i = 0; i < 40; i++) { const k = (t * 1.6 + i * .137) % 1, x = (i * 97 + k * 200) % 1700 - 50, y = k * 900; K.line(x, y, x - 22, y + 44, 3, 3, .9); }
      K.rect(-800, 620, 4000, 600, { f: 1, ft: .8 }); for (let r = 0; r < 8; r++) { const y = 610 + r * 40; K.path(c => { for (let x = -100; x <= 1700; x += 20) { const yy = y + sin(x * .012 + t * (1.5 + r * .2) + r) * (14 + r * 6); x < -99 ? c.moveTo(x, yy) : c.lineTo(x, yy); } c.lineTo(1700, 1000); c.lineTo(-100, 1000); c.closePath(); }, O(r % 2 ? 3 : 1, 3, 4, r % 2 ? .55 : .9)); }
      const bx = 800 + sin(t * .7) * 60, by = 640 + sin(t * 1.4) * 22; K.c.save(); K.c.translate(bx, by); K.c.rotate(sin(t * 1.4) * .1);
      K.path(c => { c.moveTo(-110, 0); c.lineTo(110, 0); c.lineTo(70, 44); c.lineTo(-70, 44); c.closePath(); }, O(2, 1, 6)); K.line(0, 0, 0, -170, 1, 8); K.poly([[6, -160], [90, -20], [6, -20]], O(-1, 1, 6)); K.poly([[-6, -140], [-70, -20], [-6, -20]], O(-1, 1, 6)); K.c.restore(); });

  // ---------- 5 · bar / club ----------
  S('club', 'club de noche', 4, /\b(clubs?|discoteca\w*|dance ?floor|pista|party|parties|fiesta\w*|perre\w*|bail\w*|danc\w*|dj|disco|drinks?|tragos?|shots?|tequila|whisk\w*|vodka|beers?|cervezas?|bar|bottles?|botellas?|vip|tonight|esta noche|turn up|rave)\b/i,
    ['la pista no se acaba hasta que salga el sol', 'otro trago y se me olvida', 'todo el mundo bailando sin mirar la hora'],
    r => ({ }),
    (K, s, t, dt, a) => { K.bg(1, .85); K.c.fillStyle = K.lin(4 % 3 + 1, 0, 0, 0, 900, .0, .0); const bx = 800, by = 220 + sin(t) * 6;
      for (let i = 0; i < 14; i++) { const an = i * TAU / 14 + t * .4, c = K.c; c.save(); c.globalCompositeOperation = 'lighter'; c.fillStyle = K.ink(i % 2 ? 2 : 3, .22 + a.beat * .25); c.beginPath(); c.moveTo(bx, by); c.lineTo(bx + cos(an - .09) * 1400, by + sin(an - .09) * 1400); c.lineTo(bx + cos(an + .09) * 1400, by + sin(an + .09) * 1400); c.fill(); c.restore(); }
      K.line(bx, -100, bx, by - 64, 1, 5, .8); K.circ(bx, by, 62, O(3, 3, 5, .9)); for (let i = -3; i <= 3; i++) K.line(bx + i * 16, by - 60, bx + i * 16, by + 60, 1, 2, .8); for (let j = -2; j <= 2; j++) K.line(bx - 60, by + j * 22, bx + 60, by + j * 22, 1, 2, .8);
      K.rect(-800, 700, 4000, 500, { f: 1, ft: .55 }); for (let i = 0; i < 12; i++) K.rect(i * 160 - 40, 700 + (i % 2) * 8, 160, 110, { f: (i + Math.floor(a.beats)) % 3 === 0 ? 2 : 1, ft: .6 + (i % 2) * .2, s: 3, lw: 3 });
      K.rr(60, 90, 340, 110, 14, O(1, 2, 7, .9)); K.txt('OPEN', 230, 172, { size: 82, align: 'center', i: 2 }); K.rect(1230, 120, 300, 150, { f: 1, ft: .8, s: 3, lw: 5 }); for (let i = 0; i < 4; i++) { K.rect(1250, 140 + i * 30, 260, 10, { f: 3, ft: .7 }); P(K, 'drink', 1300 + i * 30, 250, .13, i); }
      crowd(K, 760, t, a, 12, 1.15, 1); glowD(K, bx, by, 240 + a.beat * 60, 3, .5); });

  // ---------- 6 · café / ventana con lluvia ----------
  S('cafe', 'café bajo la lluvia', 2, /\b(coffee|caf[eé]s?|window\w*|ventanas?|rain\w*|lluvi\w*|llov\w*|breakfast|desayuno|tea|t[eé]|mug|taza|waiting|espera\w*|latte|espresso|morning|mañana)\b/i,
    ['la lluvia escribe en el cristal lo que no dije', 'un café que se enfría esperando', 'afuera todos corren, adentro nadie llega'],
    r => ({ dr: Array.from({ length: 26 }, () => [r() * 1200, r() * 600, .3 + r() * .7, r()]) }),
    (K, s, t, dt, a) => { K.bg(3, .16); const wx = 240, wy = 90, ww = 1120, wh = 560; K.rect(wx, wy, ww, wh, O(1, 3, 9, .8));
      K.clip(c => c.rect(wx, wy, ww, wh), () => { for (let i = 0; i < 9; i++) { const bx = wx + i * 130, bh = 200 + (i * 71 % 200); K.rect(bx, wy + wh - bh, 118, bh, { f: 1, ft: .45 }); for (let k = 0; k < 6; k++) if (nz(i * 5 + k + Math.floor(t * .1)) > .5) K.rect(bx + 16 + (k % 2) * 44, wy + wh - bh + 26 + (k >> 1) * 52, 22, 26, { f: 2 }); } K.glow(2, wx + 900, wy + 200, 260, .5);
        for (const d of s.dr) { d[1] += dt * d[2] * 60; if (d[1] > wh) { d[1] = -10; d[0] = Math.random() * ww; } K.circ(wx + d[0], wy + d[1], 5 + d[3] * 6, { f: -1, s: 1, lw: 2.5 }); K.line(wx + d[0], wy + d[1] - 30 * d[2], wx + d[0], wy + d[1], 3, 3, .8); }
        for (let i = 0; i < 40; i++) { const k = (t * 1.3 + i * .21) % 1; K.line(wx + (i * 137) % ww, wy + k * wh, wx + (i * 137) % ww - 10, wy + k * wh + 30, 3, 2, .8); } });
      K.line(wx + ww / 2, wy, wx + ww / 2, wy + wh, 1, 10); K.rect(wx - 30, wy + wh, ww + 60, 26, O(2, 1, 6));
      K.rect(-800, 720, 4000, 500, { f: 2, ft: .55 }); K.rect(340, 660, 920, 40, O(3, 1, 6, .8)); K.rect(400, 700, 30, 200, O(3, 1, 6, .8)); K.rect(1170, 700, 30, 200, O(3, 1, 6, .8));
      K.rr(720, 590, 90, 74, 14, O(-1, 1, 6)); K.path(c => { c.arc(812, 624, 22, -PI / 2, PI / 2); }, { s: 1, lw: 7 }); K.rect(730, 600, 70, 16, { f: 2 });
      for (let i = 0; i < 3; i++) K.path(c => { for (let k = 0; k <= 14; k++) { const yy = 580 - k * 10, xx = 745 + i * 16 + sin(t * 2.4 + k * .6 + i) * (3 + k * .5); k ? c.lineTo(xx, yy) : c.moveTo(xx, yy); } }, { s: 1, lw: 4, st: .6 });
      K.ell(1000, 668, 90, 14, 0, O(-1, 1, 5)); K.ell(1000, 660, 70, 8, 0, { f: 3, ft: .8 }); lampD(K, 460, 400, 1, a); });

  // ---------- 7 · tren / estación ----------
  S('estacion', 'estación', 5, /\b(train\w*|trenes?|stations?|estaci[oó]n\w*|railway|rails?|subway|metro|platforms?|and[eé]n\w*|leav\w*|marcha\w*|goodbye|adi[oó]s|se fue|left me|depart\w*|ticket|boleto|luggage|maleta|suitcase|farewell|despedida)\b/i,
    ['el tren se lleva lo que no supe retener', 'un andén demasiado largo para decir adiós', 'las maletas ya no caben en la despedida'],
    r => ({ tx: -2500 }),
    (K, s, t, dt, a) => { sky(K, 3, .1, .7); sun(K, 1300, 200, 80, 0); hills(K, 560, 70, .003, 1, .5, 2); s.tx += dt * (620 + a.e * 300); if (s.tx > 3400) s.tx = -2600;
      K.rect(-800, 560, 4000, 60, { f: 1, ft: .7 }); for (let k = 0; k < 8; k++) { const x0 = s.tx + k * 340; K.rr(x0, 430, 330, 170, 16, O(k % 2 ? 2 : 3, 1, 7, .9)); for (let j = 0; j < 4; j++) K.rect(x0 + 24 + j * 76, 456, 56, 60, O(-1, 1, 4)); K.circ(x0 + 60, 606, 24, O(1, 1, 5)); K.circ(x0 + 270, 606, 24, O(1, 1, 5)); }
      K.rect(-800, 640, 4000, 400, { f: 2, ft: .5 }); K.hatch(-800, 640, 4000, 400, 1, 26, -.3, 2, .5); K.line(-800, 640, 3000, 640, 1, 9);
      for (let i = 0; i < 24; i++) K.rect(i * 90 - 30 - ((t * 20) % 90), 700, 60, 10, { f: 1, ft: .8 });
      K.rect(120, 320, 8, 330, { f: 1 }); K.rr(50, 250, 170, 80, 10, O(-1, 1, 5)); K.txt('ANDÉN 4', 135, 305, { size: 40, align: 'center' });
      K.circ(1350, 250, 80, O(-1, 1, 7)); const aa = t * .4; K.line(1350, 250, 1350 + cos(aa) * 50, 250 + sin(aa) * 50, 1, 8); K.line(1350, 250, 1350 + cos(aa * 12) * 66, 250 + sin(aa * 12) * 66, 2, 4);
      K.rect(-800, 780, 4000, 400, { f: 2, ft: .35 }); K.rr(1040, 700, 150, 100, 12, O(2, 1, 6)); K.rr(1070, 680, 90, 30, 8, { s: 1, lw: 6 }); P(K, 'dance', 350, 690, .3, 1); });

  // ---------- 8 · carretera de noche ----------
  S('carretera', 'carretera de noche', 3, /\b(roads?|carreteras?|highway\w*|autopista\w*|driv\w*|conduc\w*|manej\w*|cars?|coches?|carros?|ride\w*|runaway|speed\w*|velocidad|tunnel|t[uú]nel|engine|motor|wheel|volante|trip|viaje|road ?trip|escape|huir|huida|drive-in)\b/i,
    ['manejar hasta que las luces se borren', 'la carretera no pregunta a dónde vas', 'cada poste es un segundo que dejo atrás'],
    r => ({ }),
    (K, s, t, dt, a) => { K.bg(1, .8); K.c.fillStyle = K.lin(1, 0, -200, 0, 560, .95, .3); K.c.fillRect(-800, -400, 4000, 900); stars(K, t, 40, 3, 0, 0, 1600, 340); moon(K, 1150, 170, 70, 2);
      hills(K, 570, 80, .004, 1, .9, 1, false); road(K, t, a, 560, 1);
      for (let i = 0; i < 8; i++) { const k = ((i / 8 + t * .25 * (.6 + a.e)) % 1), y = 560 + Math.pow(k, 2.2) * 560, sc = .1 + k * k * 1.1; for (const sd of [-1, 1]) { const x = 800 + sd * (60 + k * k * 620); K.line(x, y, x, y - 210 * sc, 2, 8 * sc); K.line(x - 40 * sc, y - 190 * sc, x + 40 * sc, y - 190 * sc, 2, 6 * sc); } }
      K.glow(2, 800, 560, 300 + a.beat * 60, .7); K.circ(800, 560, 10, { f: 2 }); K.rr(520, 800, 560, 160, 30, O(1, 1, 8)); K.circ(600, 840, 44, O(2, 1, 7)); K.circ(1000, 840, 44, O(2, 1, 7)); K.rect(560, 700, 480, 120, O(1, 1, 8, .9)); K.line(800, 720, 800, 820, 2, 5); });

  // ---------- 9 · aeropuerto / vuelo ----------
  S('vuelo', 'vuelo', 3, /\b(planes?|aviones?|airports?|aeropuertos?|flights?|vuelos?|fly\w*|vol(ar|ando|[eé]|ó|ar[eé]|aremos|aba|amos)|vuel\w*|wings?|alas?|jets?|land\w*|aterriz\w*|pilots?|piloto|takeoff|despegu\w*|clouds?|nubes?|altitude|airplane|passport|pasaporte|abroad|lejos|away|far away)\b/i,
    ['más arriba que las nubes y más lejos de ti', 'el avión despega y con él lo que fui', 'sobre las nubes todo se ve pequeño'],
    r => ({ }),
    (K, s, t, dt, a) => { sky(K, 3, .1, .8); sun(K, 300, 200, 90, 16, t); clouds(K, t * 2, 260, 5, -1, 1.3); clouds(K, t * 3 + 500, 620, 4, -1, 1.6);
      const px = 800 + sin(t * .5) * 60, py = 420 + sin(t * .9) * 24; K.c.save(); K.c.translate(px, py); K.c.rotate(-.08 + sin(t * .5) * .03);
      K.path(c => { c.moveTo(-330, 0); c.bezierCurveTo(-320, -46, 250, -56, 340, -6); c.bezierCurveTo(260, 40, -320, 50, -330, 0); }, O(-1, 1, 8)); K.path(c => { c.moveTo(-60, 20); c.lineTo(-220, 190); c.lineTo(-130, 190); c.lineTo(80, 24); c.closePath(); }, O(2, 1, 7)); K.path(c => { c.moveTo(-300, -20); c.lineTo(-340, -130); c.lineTo(-270, -130); c.lineTo(-210, -30); c.closePath(); }, O(2, 1, 7));
      for (let i = 0; i < 9; i++) K.rr(-200 + i * 46, -24, 26, 22, 6, O(3, 1, 4)); K.rect(200, -34, 70, 34, { f: 3 }); K.c.restore();
      for (let i = 0; i < 6; i++) K.line(px - 360 - i * 60, py + 6 + i * 4, px - 400 - i * 120, py + 10 + i * 5, 1, 3, .5); });

  // ---------- 10 · iglesia / cielo ----------
  S('iglesia', 'iglesia', 2, /\b(church\w*|iglesias?|god|dios|heaven\w*|cielo\w*|pray\w*|rez\w*|angels?|[aá]ngel\w*|faith|fe|holy|santo\w*|sagrad\w*|soul|alma|bless\w*|bendic\w*|cross|cruz|miracle|milagro|lord|se[nñ]or|jesus|cristo|amen|salvation|salvaci[oó]n|divine|divin\w*)\b/i,
    ['una plegaria sube donde nadie la contesta', 'la luz entra por el cristal y perdona', 'creer es también una forma de esperar'],
    r => ({ }),
    (K, s, t, dt, a) => { sky(K, 2, .05, .8); for (let i = 0; i < 18; i++) { const an = -PI + i * PI / 17; K.poly([[800, 470], [800 + cos(an - .04) * 1500, 470 + sin(an - .04) * 1000], [800 + cos(an + .04) * 1500, 470 + sin(an + .04) * 1000]], { f: 2, ft: .25 + (i % 2) * .15, over: true }); }
      clouds(K, t, 150, 4, -1, 1.4); K.rect(-800, 780, 4000, 400, { f: 3, ft: .5 }); K.line(-800, 780, 3000, 780, 1, 8);
      K.c.save(); K.c.translate(0, 120); K.rect(560, 420, 480, 380, O(-1, 1, 8)); K.poly([[540, 420], [800, 220], [1060, 420]], O(3, 1, 8, .9)); K.rect(740, 100, 120, 130, O(-1, 1, 7)); K.poly([[730, 100], [800, 10], [870, 100]], O(3, 1, 7, .9)); K.line(800, 10, 800, -70, 1, 7); K.line(770, -40, 830, -40, 1, 7);
      K.circ(800, 340, 60 + a.beat * 5, O(2, 1, 7)); for (let i = 0; i < 8; i++) { const an = i * TAU / 8 + t * .3; K.line(800 + cos(an) * 20, 340 + sin(an) * 20, 800 + cos(an) * 56, 340 + sin(an) * 56, 1, 4); }
      K.path(c => { c.moveTo(760, 800); c.lineTo(760, 660); c.arc(800, 660, 40, PI, 0); c.lineTo(840, 800); c.closePath(); }, O(3, 1, 7, .9)); for (const x of [600, 940]) { K.path(c => { c.moveTo(x, 520); c.lineTo(x, 470); c.arc(x + 20, 470, 20, PI, 0); c.lineTo(x + 40, 520); c.closePath(); }, O(2, 1, 5)); }
      P(K, 'heaven', 260, 300, .55, 1); P(K, 'stars', 1360, 300, .5, 2); K.c.restore(); });

  // ---------- 11 · cementerio ----------
  S('cementerio', 'cementerio', 1, /\b(graves?|tumbas?|cemeter\w*|cementerios?|death|dead|muert\w*|die\w*|mor\w*|ghosts?|fantasmas?|bury|buried|enterr\w*|funeral|skull\w*|calaveras?|rip|coffin|ata[uú]d|haunt\w*|spirit\w*|espíritu|halloween|reaper)\b/i,
    ['bajo la tierra también se escucha esta canción', 'nadie visita lo que dejó de nombrar', 'el fantasma soy yo, y sigo aquí'],
    r => ({ }),
    (K, s, t, dt, a) => { K.bg(1, .75); K.c.fillStyle = K.lin(1, 0, -200, 0, 700, .95, .4); K.c.fillRect(-800, -400, 4000, 1300); stars(K, t, 30, 8, 0, 0, 1600, 360); moon(K, 1200, 200, 96, 2); K.glow(2, 1200, 200, 300, .5);
      for (let i = 0; i < 3; i++) K.rect(-800 + ((t * 12 + i * 900) % 3200), 610 + i * 40, 1400, 46, { f: 3, ft: .22, over: true });
      hills(K, 720, 50, .005, 1, .95, 4, false); K.hatch(-800, 720, 4000, 500, 3, 20, -.4, 2, .5);
      const stone = (x, y, sc, k) => { K.path(c => { c.moveTo(x - 60 * sc, y); c.lineTo(x - 60 * sc, y - 130 * sc); c.arc(x, y - 130 * sc, 60 * sc, PI, 0); c.lineTo(x + 60 * sc, y); c.closePath(); }, O(3, 1, 7, .75)); if (k) { K.line(x, y - 160 * sc, x, y - 70 * sc, 1, 7); K.line(x - 26 * sc, y - 130 * sc, x + 26 * sc, y - 130 * sc, 1, 7); } else K.txt('RIP', x, y - 96 * sc, { size: 40 * sc, align: 'center', i: 1 }); };
      stone(300, 800, 1, 0); stone(560, 850, .8, 1); stone(1040, 830, 1.1, 1); stone(1320, 800, .9, 0);
      K.path(c => { c.moveTo(150, 900); c.bezierCurveTo(140, 700, 160, 560, 120, 400); }, { s: 1, lw: 24 }); for (let k = 0; k < 6; k++) { const y = 700 - k * 60, sw = sin(t + k) * 6; K.path(c => { c.moveTo(146, y); c.quadraticCurveTo(200 + sw, y - 40, 260 + sw, y - 30 - k * 8); }, { s: 1, lw: 9 }); K.path(c => { c.moveTo(142, y - 20); c.quadraticCurveTo(80 - sw, y - 60, 20 - sw, y - 50); }, { s: 1, lw: 8 }); }
      P(K, 'death', 800, 640, .4, 2); for (let i = 0; i < 5; i++) { const x = 500 + i * 130 + sin(t * .6 + i) * 60, y = 220 + sin(t * .9 + i * 2) * 40; K.path(c => { c.moveTo(x - 20, y); c.quadraticCurveTo(x - 8, y - 16 - sin(t * 8 + i) * 8, x, y); c.quadraticCurveTo(x + 8, y - 16 - sin(t * 8 + i) * 8, x + 20, y); }, { s: 1, lw: 6 }); } });

  // ---------- 12 · concierto ----------
  S('concierto', 'concierto', 1, /\b(stage|escenario|concerts?|conciertos?|mic\w*|micr[oó]fono|crowds?|p[uú]blico|shows?|spotlights?|fame|fama|sing\w*|cantar|cant[oó]|tour|gira|encore|guitar\w*|guitarra|band|banda|drums?|bater[ií]a|rock|stars?|estrellas? del|applause|aplauso|microphone|singer|cantante)\b/i,
    ['mil manos arriba y una sola voz', 'las luces me buscan y yo solo canto', 'el último acorde se queda en la sala'],
    r => ({ }),
    (K, s, t, dt, a) => { K.bg(3, .9); for (let i = 0; i < 7; i++) { const x = 160 + i * 210, an = sin(t * .8 + i * 1.3) * .5, c = K.c; c.save(); c.globalCompositeOperation = 'lighter'; c.fillStyle = K.ink(i % 2 ? 2 : 3, .2 + a.beat * .22); c.beginPath(); c.moveTo(x, -20); c.lineTo(x - 90 + an * 500, 760); c.lineTo(x + 90 + an * 500, 760); c.fill(); c.restore(); K.rect(x - 22, -40, 44, 50, O(1, 1, 5)); K.circ(x, 16, 15, { f: 2 }); }
      K.rect(-800, 640, 4000, 260, { f: 1, ft: .55 }); K.line(-800, 640, 3000, 640, 2, 8); K.rect(200, 470, 240, 170, O(1, 1, 7)); K.rect(1160, 470, 240, 170, O(1, 1, 7)); for (const x of [320, 1280]) { K.circ(x, 540 + Math.sin(t * 10) * 2 * a.beat, 46 + a.beat * 14, O(3, 1, 6, .7)); K.circ(x, 590, 22, O(3, 1, 5)); }
      K.line(800, 380, 800, 640, 1, 8); K.line(800, 380, 830, 350, 1, 7); K.rr(820, 316, 22, 46, 10, O(2, 1, 5)); K.circ(800, 300, 42, O(-1, 1, 6)); K.rect(756, 340, 88, 130, O(2, 1, 6)); K.line(756, 360, 700, 430 - sin(t * 3) * 30, 1, 14); K.line(844, 360, 900, 320, 1, 14);
      crowd(K, 810, t, a, 14, 1.25, 1); for (let i = 0; i < 4; i++) helpers.star(K, 300 + i * 340, 220 + sin(t * 2 + i) * 30, 16 + a.beat * 12, { f: 2 }, 4, .3); });

  // ---------- 13 · estadio / deporte ----------
  S('estadio2', 'estadio', 0, /\b(stadiums?|estadios?|goals?|gol(es)?|games?|juegos?|partido|win\w*|ganar|ganamos|champions?|campe[oó]n\w*|teams?|equipos?|balls?|bal[oó]n|sports?|deportes?|score|marcador|coach|referee|[aá]rbitro|trophy|trofeo|finals?|match|race|carrera|run\w*|corr\w*|victory|victoria)\b/i,
    ['el marcador se detiene cuando te veo', 'un grito que no cabe en el estadio', 'ganar es solo el principio del ruido'],
    r => ({ bx: 200, by: 700, vx: 340, vy: -520 }),
    (K, s, t, dt, a) => { sky(K, 3, .1, .6); for (let i = 0; i < 4; i++) { const x = 160 + i * 430; K.line(x, 560, x, 150, 1, 9); K.rect(x - 70, 110, 140, 70, O(-1, 1, 6)); for (let k = 0; k < 6; k++) K.circ(x - 50 + (k % 3) * 50, 130 + (k >> 2) * 36 + 10, 9, { f: 2 }); K.glow(2, x, 130, 240 + a.beat * 50, .5); }
      K.path(c => { c.moveTo(-200, 560); c.lineTo(1800, 560); c.lineTo(1800, 470); for (let x = 1800; x >= -200; x -= 60) c.lineTo(x, 470 - (x / 60 % 2) * 14); c.closePath(); }, O(1, 1, 5, .8)); for (let i = 0; i < 60; i++) K.circ(i * 30, 500 + (i % 3) * 20, 7, { f: i % 4 ? 2 : -1 });
      K.rect(-800, 560, 4000, 500, { f: 3, ft: .6 }); for (let i = 0; i < 10; i++) K.rect(-800 + i * 320, 560, 160, 500, { f: 3, ft: .25, over: true }); K.line(-800, 620, 3000, 620, -1, 6); K.circ(800, 780, 110, { s: -1, lw: 6 }); K.line(800, 620, 800, 900, -1, 6);
      K.rect(1300, 500, 10, 150, { f: -1 }); K.rect(1520, 500, 10, 150, { f: -1 }); K.rect(1300, 500, 230, 8, { f: -1 }); for (let i = 0; i < 10; i++) K.line(1310 + i * 22, 500, 1310 + i * 22, 650, -1, 2);
      s.vy += 900 * dt; s.bx += s.vx * dt; s.by += s.vy * dt; if (s.by > 760) { s.by = 760; s.vy = -520 - a.e * 200; } if (s.bx > 1560 || s.bx < 80) s.vx *= -1;
      K.ell(s.bx, 800, 40, 10, 0, { f: 1, ft: .5, over: true }); K.circ(s.bx, s.by, 40, O(-1, 1, 7)); K.path(c => { for (let k = 0; k < 5; k++) { const an = k * TAU / 5 + t * 3; c.moveTo(s.bx, s.by); c.lineTo(s.bx + cos(an) * 40, s.by + sin(an) * 40); } }, { s: 1, lw: 3 }); K.circ(s.bx, s.by, 14, { f: 1 }); });

  // ---------- 14 · salón de clases ----------
  S('escuela', 'salón de clases', 3, /\b(school\w*|escuelas?|class\w*|clases?|teach\w*|profes\w*|maestr\w*|homework|tarea|students?|estudiant\w*|colegio|learn\w*|aprend\w*|study\w*|estudi\w*|exam\w*|university|universidad|college|lesson|lecci[oó]n|grades?|notas?|graduat\w*|graduaci[oó]n|book\w*|libros?|library|biblioteca|read\w*|leer)\b/i,
    ['la lección más difícil no venía en el libro', 'el timbre suena y nadie quiere salir', 'aprendí de memoria lo que dolía'],
    r => ({ }),
    (K, s, t, dt, a) => { K.bg(2, .16); K.rect(-800, -300, 4000, 1000, { f: 3, ft: .18 }); K.rect(120, 90, 1360, 420, O(1, 1, 12, .95)); K.rect(150, 118, 1300, 364, { f: 1, ft: .95 });
      K.txt('E = m c²', 240, 240, { font: 'hand', size: 100, w: 600, fs: 'rgb(0,0,0)' }); K.txt('¿qué es lo que sientes?', 240, 370, { font: 'hand', size: 76, w: 600, fs: 'rgb(0,0,0)' }); const p = (t * .25) % 1; K.circuit([[900, 200], [1000, 200], [1000, 260], [1200, 260], [1200, 210], [1360, 210]], p * 1.4, { i: 1, node: 2 }); K.path(c => { c.moveTo(980, 400); c.bezierCurveTo(1040, 340, 1100, 460, 1160, 380); c.bezierCurveTo(1220, 320, 1300, 440, 1400, 380); }, { s: -1, lw: 6 });
      K.rect(120, 510, 1360, 24, O(2, 1, 7)); for (let i = 0; i < 3; i++) K.rect(300 + i * 60, 486, 40, 24, { f: -1, s: 1, lw: 3 });
      K.circ(1400, 680, 90, O(-1, 1, 8)); const aa = t * .2; K.line(1400, 680, 1400 + cos(aa) * 50, 680 + sin(aa) * 50, 1, 7); K.line(1400, 680, 1400 + cos(aa * 12) * 70, 680 + sin(aa * 12) * 70, 2, 4);
      K.rect(-800, 760, 4000, 400, { f: 2, ft: .45 }); const desk = (x, y) => { K.rect(x, y, 300, 30, O(2, 1, 6)); K.line(x + 30, y + 30, x + 30, y + 150, 1, 8); K.line(x + 270, y + 30, x + 270, y + 150, 1, 8); K.rect(x + 40, y - 34, 90, 34, O(-1, 1, 5)); K.rect(x + 150, y - 22, 60, 22, O(3, 1, 4)); }; desk(180, 640); desk(650, 680); desk(1120, 640);
      P(K, 'light', 730, 390, .1, 0); K.rect(700, 560, 30, 60, { f: 2 }); });

  // ---------- 15 · hogar / sala ----------
  S('hogar', 'sala de casa', 0, /\b(home|house|casa|hogar|couch|sof[aá]|kitchen|cocina|family|familia|mom|mam[aá]|mother|madre|father|padre|pap[aá]|dinner|cena|table|mesa|living room|sala|blanket|manta|fireplace|chimenea|tv|televisi[oó]n|remote|dog|perro|cat|gato|sunday|domingo|childhood|infancia)\b/i,
    ['la casa recuerda lo que nosotros callamos', 'domingo en el sofá, el mundo afuera', 'aquí todavía huele a lo que fuimos'],
    r => ({ }),
    (K, s, t, dt, a) => { K.bg(3, .2); K.rect(-800, -300, 4000, 1000, { f: 2, ft: .2 }); K.rect(-800, 700, 4000, 600, { f: 2, ft: .5 }); K.hatch(-800, 700, 4000, 500, 1, 24, -.3, 2, .5); K.line(-800, 700, 3000, 700, 1, 8); K.rect(-800, 660, 4000, 40, O(3, 1, 5, .6));
      win(K, 1050, 120, 380, 400, 3); K.clip(c => c.rect(1050, 120, 380, 400), () => { moon(K, 1300, 240, 50, 2); stars(K, t, 12, 4, 1050, 120, 380, 260); });
      K.rect(160, 210, 300, 210, O(-1, 1, 8)); K.rect(180, 230, 260, 170, { f: 3, ft: .7 }); K.circ(310, 300, 30, { f: 2 }); K.path(c => { c.moveTo(190, 390); c.lineTo(260, 320); c.lineTo(310, 370); c.lineTo(360, 310); c.lineTo(430, 390); c.closePath(); }, { f: 1, ft: .7 }); K.tape(310, 210, 90, 30, .05);
      K.path(c => { c.moveTo(160, 700); c.lineTo(160, 520); c.quadraticCurveTo(160, 490, 200, 490); c.lineTo(780, 490); c.quadraticCurveTo(820, 490, 820, 520); c.lineTo(820, 700); c.closePath(); }, O(2, 1, 8)); K.rr(200, 540, 260, 110, 30, O(2, 1, 6, .7)); K.rr(500, 540, 260, 110, 30, O(2, 1, 6, .7)); K.rect(130, 560, 60, 140, O(2, 1, 7)); K.rect(790, 560, 60, 140, O(2, 1, 7));
      K.path(c => { c.moveTo(280, 540); c.lineTo(440, 540); c.lineTo(420, 640); c.lineTo(300, 640); c.closePath(); }, O(3, 1, 5, .9)); K.circ(590, 600, 40, { f: 1, ft: .85 }); K.path(c => { c.moveTo(560, 580); c.lineTo(548, 540); c.lineTo(578, 566); c.moveTo(620, 580); c.lineTo(632, 540); c.lineTo(602, 566); }, { s: 1, lw: 6 });
      lampD(K, 950, 330, 1.1, a); K.rect(1000, 600, 260, 20, O(2, 1, 6)); K.line(1020, 620, 1020, 700, 1, 8); K.line(1240, 620, 1240, 700, 1, 8); K.rr(1090, 540, 70, 60, 10, O(-1, 1, 6)); for (let i = 0; i < 2; i++) K.path(c => { for (let k = 0; k <= 10; k++) { const yy = 530 - k * 10, xx = 1110 + i * 20 + sin(t * 2.4 + k * .6 + i) * (3 + k * .5); k ? c.lineTo(xx, yy) : c.moveTo(xx, yy); } }, { s: 1, lw: 4, st: .6 });
      P(K, 'home', 1350, 780, .16, 0); });

  // ---------- 16 · azotea de noche ----------
  S('azotea2', 'azotea de noche', 4, /\b(rooftops?|azoteas?|terraces?|terrazas?|skyline|city lights|luces de la ciudad|penthouse|balc[oó]n|balcony|above the city|sobre la ciudad|skyscrapers?|rascacielos|neon|ne[oó]n|lights? below)\b/i,
    ['desde aquí arriba la ciudad parece un tablero', 'las luces de abajo no me llaman', 'una azotea, dos sombras y ningún plan'],
    r => ({ }),
    (K, s, t, dt, a) => { K.bg(1, .8); K.c.fillStyle = K.lin(1, 0, -200, 0, 560, .95, .35); K.c.fillRect(-800, -400, 4000, 1000); stars(K, t, 36, 12, 0, 0, 1600, 320); moon(K, 250, 170, 70, 2);
      const bld = (x, w, h, ink, tone) => { K.rect(x, 640 - h, w, h + 400, O(ink, 1, 6, tone)); for (let k = 0; k < Math.floor(h / 50); k++) for (let j = 0; j < Math.floor(w / 40); j++) if (nz(x * .01 + k * 3 + j + Math.floor(t * .3)) > .5) K.rect(x + 14 + j * 40, 640 - h + 20 + k * 50, 20, 24, { f: 2 }); };
      for (let i = 0; i < 12; i++) bld(-100 + i * 150, 120 + (i * 37 % 40), 160 + (i * 97 % 300), 1, .55); K.glow(2, 800, 640, 500, .3);
      K.rect(-800, 700, 4000, 400, O(1, 1, 8, .95)); K.rect(-800, 700, 4000, 30, { f: 3, ft: .7 }); for (let i = 0; i < 16; i++) K.rect(-100 + i * 110, 730, 8, 60, { f: 3, ft: .6 });
      K.path(c => { c.moveTo(1100, 700); c.lineTo(1100, 560); c.lineTo(1300, 560); c.lineTo(1300, 700); }, O(2, 1, 7, .7)); K.rect(1080, 540, 240, 26, O(3, 1, 6)); for (let i = 0; i < 3; i++) K.line(1120 + i * 80, 566, 1120 + i * 80, 700, 1, 6);
      K.path(c => { c.moveTo(-100, 690); for (let i = 0; i <= 24; i++) { const x = -100 + i * 75, y = 590 + Math.abs(sin(PI * i / 3)) * 30; c.lineTo(x, y); } }, { s: 3, lw: 3 }); for (let i = 0; i <= 24; i++) { const x = -100 + i * 75, y = 590 + Math.abs(sin(PI * i / 3)) * 30, on = (i + Math.floor(a.beats)) % 3 === 0; K.circ(x, y + 12, 8 + (on ? a.beat * 5 : 0), on ? { f: 2 } : O(-1, 1, 3)); if (on) K.glow(2, x, y + 12, 50, .6); }
      P(K, 'couple', 600, 640, .38, 0); });

  // ---------- 17 · feria ----------
  S('feria', 'feria', 1, /\b(fair|feria\w*|carnival|carnaval|circus|circo|balloons?|globos?|ferris|noria|amusement|childhood|ni[nñ]ez|infancia|kids?|ni[nñ]os?|playground|parque|park|carousel|carrusel|cotton candy|algod[oó]n|toys?|juguetes?|clown|payaso|roller ?coaster|montaña rusa|birthday|cumplea[nñ]os|candy|dulces?)\b/i,
    ['una rueda que sube y baja como mi humor', 'el algodón de azúcar sabe a antes', 'los globos se van y yo con ellos'],
    r => ({ }),
    (K, s, t, dt, a) => { sky(K, 3, .05, .55); clouds(K, t, 140, 3, -1, 1.1); const cx = 800, cy = 430, R = 300, ang = t * .25;
      K.line(cx - 130, 900, cx, cy, 1, 12); K.line(cx + 130, 900, cx, cy, 1, 12); for (let i = 0; i < 12; i++) { const an = ang + i * TAU / 12; K.line(cx, cy, cx + cos(an) * R, cy + sin(an) * R, 1, 4); }
      K.circ(cx, cy, R, { s: 1, lw: 9 }); K.circ(cx, cy, R * .55, { s: 1, lw: 4 }); for (let i = 0; i < 12; i++) { const an = ang + i * TAU / 12, gx = cx + cos(an) * R, gy = cy + sin(an) * R; K.line(gx, gy, gx, gy + 20, 1, 4); K.rr(gx - 32, gy + 16, 64, 48, 10, O(i % 3 === 0 ? 2 : i % 3 === 1 ? 3 : -1, 1, 5)); K.glow(2, gx, gy, 40, .5); } K.circ(cx, cy, 30, O(2, 1, 7));
      K.rect(-800, 830, 4000, 400, { f: 2, ft: .5 }); for (let i = 0; i < 24; i++) K.circ(i * 70 - 40, 800, 8, (i + Math.floor(a.beats)) % 2 ? { f: 2 } : O(-1, 1, 3)); K.line(-100, 800, 1700, 800, 1, 4);
      for (let i = 0; i < 7; i++) { const bx = 160 + i * 230 + sin(t * .7 + i) * 24, by = 240 + sin(t * .9 + i * 1.4) * 36 - (i % 3) * 30; K.line(bx, by + 60, 1400 - i * 120, 900, 1, 2, .7); K.ell(bx, by, 40, 52, 0, O(i % 3 === 0 ? 2 : i % 3 === 1 ? 3 : -1, 1, 6)); K.poly([[bx - 8, by + 52], [bx + 8, by + 52], [bx, by + 64]], { f: 1 }); }
      K.poly([[1300, 700], [1440, 700], [1370, 560]], O(2, 1, 7)); K.rect(1290, 700, 160, 100, O(3, 1, 7)); });

  // ---------- 18 · fondo del mar ----------
  S('oceano', 'fondo del mar', 5, /\b(deep|profund\w*|underwater|submarin\w*|bajo el agua|sink\w*|hund\w*|fish\w*|pez|peces|ocean\w*|oc[eé]ano|swim\w*|nad\w*|whales?|ballenas?|jellyfish|medusas?|coral|dive|bucear|bubbles?|burbujas?|shark|tibur[oó]n|tide|marea|depths?|abyss|abismo|float\w*|flot\w*)\b/i,
    ['abajo el ruido se vuelve burbujas', 'flotar es no decidir todavía', 'el fondo también tiene luz si aprendes a mirar'],
    r => ({ fish: Array.from({ length: 12 }, () => [r() * 1800, 150 + r() * 600, 30 + r() * 60, .4 + r(), r() * 6]), bub: Array.from({ length: 30 }, () => [r() * 1600, r() * 900, 4 + r() * 12, .3 + r()]) }),
    (K, s, t, dt, a) => { K.bg(3, .6); K.c.fillStyle = K.lin(1, 0, -100, 0, 900, .05, .9); K.c.fillRect(-800, -400, 4000, 1600); for (let i = 0; i < 7; i++) { const x = 100 + i * 250 + sin(t * .4 + i) * 40, c = K.c; c.save(); c.globalCompositeOperation = 'lighter'; c.fillStyle = K.ink(3, .16); c.beginPath(); c.moveTo(x - 20, -20); c.lineTo(x + 120 + sin(t * .3 + i) * 40, 900); c.lineTo(x - 80, 900); c.fill(); c.restore(); }
      for (const b of s.bub) { b[1] -= dt * b[3] * 60; if (b[1] < -20) { b[1] = 920; b[0] = Math.random() * 1600; } K.circ(b[0] + sin(t * 2 + b[3] * 9) * 10, b[1], b[2], { f: -1, s: 1, lw: 2.5 }); }
      for (const f of s.fish) { f[0] += dt * f[3] * 70; if (f[0] > 1800) f[0] = -100; const y = f[1] + sin(t * 2 + f[4]) * 12, w = f[2]; K.path(c => { c.moveTo(f[0] - w, y); c.quadraticCurveTo(f[0], y - w * .7, f[0] + w, y); c.quadraticCurveTo(f[0], y + w * .7, f[0] - w, y); c.closePath(); }, O(2, 1, 5, .9)); K.poly([[f[0] - w, y], [f[0] - w * 1.6, y - w * .5 + sin(t * 8 + f[4]) * 6], [f[0] - w * 1.6, y + w * .5 + sin(t * 8 + f[4]) * 6]], O(3, 1, 5, .9)); K.circ(f[0] + w * .5, y - w * .1, 4, { f: 1 }); }
      const jx = 1150, jy = 300 + sin(t * .8) * 40; K.path(c => { c.arc(jx, jy, 90, PI, 0); c.lineTo(jx + 90, jy + 12); c.lineTo(jx - 90, jy + 12); c.closePath(); }, O(-1, 1, 7)); for (let i = 0; i < 6; i++) K.path(c => { c.moveTo(jx - 72 + i * 29, jy + 12); c.bezierCurveTo(jx - 72 + i * 29 + sin(t * 2 + i) * 20, jy + 80, jx - 72 + i * 29 - sin(t * 2 + i) * 20, jy + 140, jx - 72 + i * 29 + sin(t * 2 + i) * 12, jy + 190); }, { s: 1, lw: 4 }); K.glow(2, jx, jy, 160, .4);
      K.rect(-800, 830, 4000, 300, { f: 1, ft: .7 }); for (let i = 0; i < 16; i++) { const x = i * 110 - 40, h = 90 + (i * 53 % 120), sw = sin(t + i) * 10; K.path(c => { c.moveTo(x, 900); c.bezierCurveTo(x + sw, 900 - h * .5, x - sw, 900 - h * .8, x + sw * 1.5, 900 - h); }, { s: i % 2 ? 2 : 1, lw: 12 }); } });

  // ---------- 19 · jardín ----------
  S('jardin', 'jardín', 3, /\b(garden\w*|jard[ií]n\w*|flowers?|flores?|spring|primavera|roses?|rosas?|bloom\w*|florec\w*|butterfl\w*|mariposas?|bees?|abejas?|petals?|p[eé]talos?|grass|pasto|hierba|meadow|prado|field|campo|daisy|margarita|sunflower|girasol|fresh|bird\w*|p[aá]jaros?|nature|naturaleza)\b/i,
    ['algo florece aunque nadie lo riegue', 'la primavera llega sin pedir permiso', 'un jardín entero cabe en lo que siento'],
    r => ({ f: Array.from({ length: 9 }, () => [r() * 1500 + 50, 600 + r() * 220, .5 + r() * .8, r() * 6, Math.floor(r() * 3)]), bf: Array.from({ length: 4 }, () => [r() * 1600, 200 + r() * 300, r() * 6]) }),
    (K, s, t, dt, a) => { sky(K, 3, .05, .45); sun(K, 220, 190, 90, 18, t); clouds(K, t, 220, 3, -1, 1.1); hills(K, 560, 60, .003, 3, .55, 2); hills(K, 640, 70, .0045, 2, .5, 5);
      K.rect(-800, 700, 4000, 500, { f: 3, ft: .6 }); K.hatch(-800, 700, 4000, 500, 1, 18, .9, 2, .5); K.line(-800, 700, 3000, 700, 1, 7);
      for (let i = 0; i < 24; i++) { const x = i * 70 - 20; K.path(c => { c.moveTo(x, 700); c.lineTo(x, 640); c.lineTo(x + 20, 610); c.lineTo(x + 40, 640); c.lineTo(x + 40, 700); }, O(-1, 1, 5)); } K.line(-100, 660, 1700, 660, 1, 5); K.line(-100, 690, 1700, 690, 1, 5);
      for (const f of s.f) { const sw = sin(t * 1.2 + f[3]) * 8 * f[2], top = f[1] - 200 * f[2]; K.path(c => { c.moveTo(f[0], f[1] + 100); c.quadraticCurveTo(f[0] + sw, f[1] - 40, f[0] + sw * 1.4, top); }, { s: 1, lw: 8 }); helpers.leaf(K, f[0] + sw * .3, f[1] + 20, 70 * f[2], 16 * f[2], -.6, O(3, 1, 4, .9));
        const fx = f[0] + sw * 1.4; for (let k = 0; k < 8; k++) { const an = k * TAU / 8 + t * .1, pr = 44 * f[2]; K.ell(fx + cos(an) * pr, top + sin(an) * pr, pr * .75, pr * .42, an, O(f[4] === 0 ? 2 : f[4] === 1 ? -1 : 3, 1, 4, .85)); } K.circ(fx, top, 24 * f[2], O(2, 1, 5)); }
      for (const b of s.bf) { const x = (b[0] + t * 30) % 1800 - 100, y = b[1] + sin(t * 1.2 + b[2]) * 50, fl = Math.abs(sin(t * 9 + b[2])); K.path(c => { c.moveTo(x, y); c.bezierCurveTo(x - 40, y - 50 * fl, x - 50, y + 20, x, y + 10); c.bezierCurveTo(x + 50, y + 20, x + 40, y - 50 * fl, x, y); }, O(2, 1, 4)); K.line(x, y - 6, x, y + 16, 1, 4); } });

  // ---------- 20 · ring / pelea ----------
  S('ring', 'ring', 1, /\b(fight\w*|pelea\w*|pele[oa]\w*|box\w*|ring|punch\w*|golpe\w*|war|guerra|angry|rabia|rage|enem\w*|battles?|batalla|knock\w*|fists?|pu[nñ]os?|blood|sangre|revenge|venganza|rivals?|opps?|beef|diss|kill\w*|matar|weapon|arma|gun|pistola|fire back|rise up|levantar)\b/i,
    ['cada golpe me enseña a quedarme de pie', 'la esquina no me salva, solo me ve caer', 'no vine a ganar, vine a que no me olvides'],
    r => ({ }),
    (K, s, t, dt, a) => { K.bg(1, .7); K.c.fillStyle = K.lin(1, 0, -100, 0, 800, .95, .35); K.c.fillRect(-800, -400, 4000, 1400); const c = K.c; c.save(); c.globalCompositeOperation = 'lighter'; c.fillStyle = K.ink(2, .28 + a.beat * .25); c.beginPath(); c.moveTo(760, -50); c.lineTo(840, -50); c.lineTo(1300, 740); c.lineTo(300, 740); c.fill(); c.restore(); K.circ(800, -20, 50, O(-1, 1, 6)); K.glow(2, 800, 400, 500 + a.beat * 80, .5);
      for (let i = 0; i < 40; i++) K.circ(-100 + i * 44, 320 + (i % 3) * 18, 20, { f: 1 }); K.rect(-800, 700, 4000, 500, O(1, 3, 6, .9)); K.path(c => { c.moveTo(-100, 760); c.lineTo(1700, 760); c.lineTo(1500, 620); c.lineTo(100, 620); c.closePath(); }, O(2, 1, 8, .9));
      for (const [x, y] of [[100, 620], [1500, 620], [-80, 760], [1680, 760]]) { K.rect(x - 14, y - 330, 28, 330, O(-1, 1, 6)); } for (let i = 0; i < 3; i++) { K.line(100 - i * 60, 470 + i * 60 - 30, 1500 + i * 60, 470 + i * 60 - 30, i === 1 ? 3 : 2, 9); }
      const g = (x, dir, ph) => { const p = Math.max(0, sin(t * 3 + ph)) ** 3, gx = x + dir * p * 160; K.c.save(); K.c.translate(gx, 500 + sin(t * 6 + ph) * 8); K.c.scale(dir, 1); K.circ(-60, 0, 44, O(-1, 1, 7)); K.rect(-90, 40, 60, 160, O(3, 1, 7, .9)); K.rr(-20, -30, 120, 96, 34, O(2, 1, 8)); K.rect(0, -20, 30, 66, { f: -1 }); K.line(-30, 60, -50, 200, 1, 14); K.c.restore(); if (p > .6) helpers.star(K, gx + dir * 140, 470, 34 + a.beat * 20, { f: 2 }, 6, .45); };
      g(560, 1, 0); g(1040, -1, 1.6); });

  // ---------- 21 · boda ----------
  S('boda', 'altar', 2, /\b(wedding\w*|bodas?|marry\w*|casar\w*|casamiento|rings?|anillos?|brides?|novias?|grooms?|novios?|altar|forever|para siempre|kiss\w*|besos?|honeymoon|luna de miel|vows?|votos?|promise\w*|promesas?|yes i do|s[ií] acepto|engaged|compromiso|propose\w*|propuesta|husband|esposo|wife|esposa|together|juntos)\b/i,
    ['prometo quedarme aunque cambie el cielo', 'dos anillos y un para siempre', 'el beso sella lo que las palabras no alcanzan'],
    r => ({ cf: Array.from({ length: 40 }, () => [r() * 1600, r() * 900, r() * 6, 8 + r() * 10, r()]) }),
    (K, s, t, dt, a) => { sky(K, 2, .05, .55); K.rect(-800, 760, 4000, 500, { f: 3, ft: .55 }); K.hatch(-800, 760, 4000, 500, 1, 22, -.4, 2, .5); K.path(c => { c.moveTo(500, 900); c.lineTo(500, 380); c.arc(800, 380, 300, PI, 0); c.lineTo(1100, 900); }, { s: 1, lw: 16 }); K.path(c => { c.moveTo(500, 900); c.lineTo(500, 380); c.arc(800, 380, 300, PI, 0); c.lineTo(1100, 900); }, { s: 2, lw: 7 });
      for (let i = 0; i < 26; i++) { const an = PI + i * PI / 25, x = 800 + cos(an) * 300, y = 380 + sin(an) * 300; K.ell(x, y, 26, 16, an + PI / 2, O(i % 3 === 0 ? 2 : i % 3 === 1 ? -1 : 3, 1, 4, .9)); }
      for (let i = 0; i < 8; i++) { const y = 470 + i * 50; K.ell(500, y, 22, 14, .5, O(i % 2 ? 2 : -1, 1, 4)); K.ell(1100, y, 22, 14, -.5, O(i % 2 ? -1 : 2, 1, 4)); }
      K.rect(-800, 830, 4000, 300, { f: 2, ft: .5 }); K.rect(660, 700, 280, 240, O(-1, 1, 7)); P(K, 'love', 800, 560, .34, 0);
      for (const [x, d] of [[640, 1], [960, -1]]) { K.c.save(); K.c.translate(x, 640); K.c.scale(d, 1); K.circ(0, -110, 34, O(-1, 1, 6)); K.path(c => { c.moveTo(-50, 150); c.quadraticCurveTo(-30, -60, 0, -70); c.quadraticCurveTo(30, -60, 50, 150); c.closePath(); }, O(d > 0 ? 1 : 2, 1, 7, d > 0 ? .9 : .9)); K.line(0, -20, 60, 40, 1, 10); K.c.restore(); }
      for (const q of s.cf) { q[1] += dt * (40 + q[4] * 40); q[0] += sin(t + q[2]) * 20 * dt; if (q[1] > 940) { q[1] = -20; q[0] = Math.random() * 1600; } K.c.save(); K.c.translate(q[0], q[1]); K.c.rotate(t * 2 + q[2]); K.rect(-q[3] / 2, -q[3] / 4, q[3], q[3] / 2, { f: q[4] < .33 ? 2 : q[4] < .66 ? 3 : -1, s: 1, lw: 2 }); K.c.restore(); } });

  // ---------- 22 · laboratorio / pantalla ----------
  S('laboratorio', 'laboratorio digital', 3, /\b(robots?|ai|inteligencia artificial|code\w*|c[oó]digo|digital|internet|computer\w*|computadora\w*|screens?|pantallas?|data|datos|virtual|matrix|glitch|hack\w*|network\w*|redes?|online|wifi|software|program\w*|algorithm\w*|algoritmo|binary|binario|machine|m[aá]quina|future|futuro|cyber|scientist|cient[ií]fic\w*|experiment\w*|laborator\w*|simulation|simulaci[oó]n|phone|tel[eé]fono|celular|texts?|mensaje\w*)\b/i,
    ['el futuro llega en forma de pantalla', 'un experimento que salió sentimiento', 'todo lo que siento es una variable'],
    r => ({ }),
    (K, s, t, dt, a) => { K.bg(3, .16); K.rect(-800, 700, 4000, 500, { f: 3, ft: .55 }); K.line(-800, 700, 3000, 700, 1, 8);
      for (let i = 0; i < 3; i++) { const x = 140 + i * 330, y = 130 + (i % 2) * 40; K.rr(x, y, 300, 200, 12, O(1, 1, 8, .9)); K.rect(x + 16, y + 16, 268, 150, { f: 3, ft: .8 }); for (let k = 0; k < 8; k++) K.rect(x + 28, y + 26 + k * 17, 40 + nz(k * 3 + i + Math.floor(t * .8)) * 190, 7, { f: k % 3 === 0 ? 2 : 1, ft: .9 }); K.rect(x + 130, y + 200, 40, 30, { f: 1 }); }
      K.rr(1180, 100, 300, 340, 14, O(1, 1, 8, .9)); K.rect(1200, 120, 260, 300, { f: 3, ft: .6 }); const gx = 1330, gy = 270; K.path(c => { for (let i = 0; i <= 60; i++) { const x = 1210 + i * 4, y = gy + sin(i * .35 + t * 4) * 40 * (.5 + a.e) + sin(i * .9 + t * 2) * 18; i ? c.lineTo(x, y) : c.moveTo(x, y); } }, { s: 2, lw: 6 }); for (let i = 0; i < 5; i++) K.line(1200, 150 + i * 56, 1460, 150 + i * 56, 1, 1.5, .5);
      K.rect(120, 640, 1360, 40, O(2, 1, 7)); K.rect(180, 560, 180, 80, O(-1, 1, 6)); K.rect(200, 580, 140, 40, { f: 3 }); for (let i = 0; i < 10; i++) K.rect(240 + i * 22, 610 + (i % 2) * 4, 16, 14, { f: -1, s: 1, lw: 2 });
      const fl = (x, h, ink, ph) => { K.path(c => { c.moveTo(x - 20, 640 - h); c.lineTo(x - 20, 640 - h * .35); c.lineTo(x - 70, 640); c.lineTo(x + 70, 640); c.lineTo(x + 20, 640 - h * .35); c.lineTo(x + 20, 640 - h); c.closePath(); }, O(-1, 1, 6)); K.clip(c => { c.moveTo(x - 60, 640); c.lineTo(x - 15, 640 - h * .4); c.lineTo(x + 15, 640 - h * .4); c.lineTo(x + 60, 640); c.closePath(); }, () => K.rect(x - 70, 640 - h * .4, 140, h * .4, { f: ink, ft: .9 })); for (let i = 0; i < 4; i++) K.circ(x - 10 + i * 8 + sin(t * 2 + i + ph) * 6, 640 - h * .4 - ((t * 40 + i * 30) % 60), 4 + i, { f: -1, s: 1, lw: 2 }); };
      fl(640, 200, 2, 0); fl(860, 240, 3, 2); fl(1060, 180, 2, 4); K.circ(1150, 520, 70, O(3, 1, 7, .5)); K.circ(1150, 520, 34, { f: 2 });
      P(K, 'phone', 480, 400, .18, 1); K.circuit([[120, 460], [200, 460], [200, 520], [420, 520], [420, 470], [600, 470]], (t * .3) % 1.5, { i: 1, node: 2 }); });

  // ---------- 23 · campamento ----------
  S('campamento', 'campamento', 4, /\b(camp\w*|campfire|fogata|tents?|carpa|starry|night sky|cielo estrellado|milky way|v[ií]a l[aá]ctea|under the stars|bajo las estrellas|fireflies|luci[eé]rnagas?|bonfire|hoguera|marshmallow|forest at night|woods|bosque de noche|wilderness|wild|salvaje|lost in|perdid[oa]|trail|sendero)\b/i,
    ['bajo tantas estrellas cabe cualquier silencio', 'la fogata dice lo que yo no me atrevo', 'perdernos en el bosque fue lo mejor del mapa'],
    r => ({ sp: Array.from({ length: 24 }, () => [r() * 40 - 20, r(), r()]), ff: Array.from({ length: 16 }, () => [r() * 1600, 380 + r() * 350, r() * 6]) }),
    (K, s, t, dt, a) => { K.bg(1, .85); K.c.fillStyle = K.lin(1, 0, -200, 0, 700, .95, .4); K.c.fillRect(-800, -400, 4000, 1300); stars(K, t, 70, 21, 0, 0, 1600, 520);
      K.path(c => { c.moveTo(-100, 200); c.bezierCurveTo(400, 60, 900, 320, 1700, 120); c.lineTo(1700, 200); c.bezierCurveTo(900, 420, 400, 160, -100, 300); c.closePath(); }, { f: 3, ft: .3, over: true }); moon(K, 1300, 170, 56, 2);
      const pine = (x, y, sc, ph) => { const sw = sin(t + ph) * 4; for (let k = 0; k < 4; k++) K.poly([[x - (80 - k * 16) * sc, y - k * 64 * sc], [x + sw * k * .3, y - 110 * sc - k * 64 * sc], [x + (80 - k * 16) * sc, y - k * 64 * sc]], O(1, 1, 6, .95)); };
      for (const [x, sc, ph] of [[100, 1.6, 0], [320, 1.1, 1], [1300, 1.4, 2], [1520, 1.7, 3], [1130, .9, 4]]) pine(x, 760, sc, ph);
      hills(K, 760, 30, .006, 1, .9, 3, false); K.rect(-800, 760, 4000, 400, { f: 1, ft: .8 });
      K.path(c => { c.moveTo(380, 780); c.lineTo(620, 780); c.lineTo(500, 560); c.closePath(); }, O(2, 1, 8, .9)); K.path(c => { c.moveTo(470, 780); c.lineTo(500, 640); c.lineTo(530, 780); c.closePath(); }, O(1, 1, 5)); K.line(500, 560, 500, 520, 1, 6);
      const fx = 900, fy = 770, fl = sin(t * 9) * 10 + a.beat * 16; K.line(fx - 90, fy + 10, fx + 90, fy - 8, 1, 14); K.line(fx - 90, fy - 8, fx + 90, fy + 10, 1, 14);
      K.path(c => { c.moveTo(fx - 60, fy); c.bezierCurveTo(fx - 90, fy - 90, fx - 30, fy - 120 - fl, fx, fy - 210 - fl); c.bezierCurveTo(fx + 20, fy - 120, fx + 100, fy - 90, fx + 60, fy); c.closePath(); }, O(2, 1, 7)); K.path(c => { c.moveTo(fx - 26, fy); c.quadraticCurveTo(fx - 40, fy - 60, fx, fy - 110 - fl * .5); c.quadraticCurveTo(fx + 40, fy - 60, fx + 26, fy); c.closePath(); }, O(3, 1, 4, .7)); K.glow(2, fx, fy - 60, 380 + a.e * 50, .6);
      for (const q of s.sp) { const k = (t * .5 + q[1]) % 1; K.circ(fx + q[0] * (1 + k * 4) + sin(t * 3 + q[2] * 9) * 8, fy - 120 - k * 320, 3 * (1 - k) + 1, { f: 2 }); }
      for (const f of s.ff) { const x = f[0] + sin(t * .5 + f[2]) * 60, y = f[1] + cos(t * .7 + f[2]) * 30, on = .5 + .5 * sin(t * 2 + f[2] * 3); K.glow(2, x, y, 20 + on * 20, .8); K.circ(x, y, 2 + on * 2, { f: 2 }); } });

  // ---------- 24 · calle mojada de noche ----------
  S('calle2', 'calle mojada', 3, /\b(umbrellas?|paraguas?|wet|mojad\w*|puddles?|charcos?|midnight|medianoche|3 ?am|madrugada|streets?|calles?|neon|ne[oó]n|walking alone|caminando|walk\w*|camin\w*|lonely|solo|sola|alone|alley|callej[oó]n|sidewalk|acera|streetlight|farola|late night|nighttime|de noche|asphalt|asfalto|shadows?|sombras?|footsteps|pasos)\b/i,
    ['camino solo y la calle repite mis pasos', 'el neón se derrite en los charcos', 'a esta hora la ciudad habla bajito'],
    r => ({ }),
    (K, s, t, dt, a) => { K.bg(1, .8); K.c.fillStyle = K.lin(1, 0, -200, 0, 600, .95, .5); K.c.fillRect(-800, -400, 4000, 1000);
      const bld = (x, w, h, ink) => { K.rect(x, 640 - h, w, h, O(ink, 1, 7, .9)); for (let k = 0; k < Math.floor(h / 60); k++) for (let j = 0; j < Math.floor(w / 46); j++) if (nz(x * .02 + k * 3 + j + Math.floor(t * .2)) > .55) K.rect(x + 16 + j * 46, 640 - h + 24 + k * 60, 24, 30, { f: 2 }); };
      bld(-60, 300, 560, 1); bld(260, 240, 420, 1); bld(1100, 260, 500, 1); bld(1360, 320, 620, 1); K.rect(560, 250, 380, 130, O(2, 1, 7)); K.txt('HOTEL', 750, 348, { size: 100, align: 'center', i: 1 }); K.rect(600, 380, 300, 260, O(1, 1, 7, .9)); K.rect(660, 470, 90, 170, O(3, 1, 6)); K.glow(2, 750, 300, 380, .5);
      K.rect(-800, 640, 4000, 500, { f: 1, ft: .8 }); for (let i = 0; i < 6; i++) K.rect(-100 + i * 300, 720 + (i % 2) * 40, 200, 12, { f: 3, ft: .6 });
      K.clip(c => c.rect(-800, 660, 4000, 500), () => { K.rect(560, 660, 380, 400, { f: 2, ft: .3, over: true }); for (let i = 0; i < 10; i++) K.rect(540 + Math.sin(t * 2 + i) * 20, 680 + i * 30, 420 - i * 20, 5, { f: 2, ft: .5, over: true }); });
      for (let i = 0; i < 60; i++) { const k = (t * 1.5 + i * .17) % 1, x = (i * 113) % 1700; K.line(x, k * 900, x - 12, k * 900 + 40, 3, 2.5, .8); }
      for (let i = 0; i < 6; i++) { const rx = 380 + i * 200, k = (t * .9 + i * .3) % 1; K.ell(rx, 740 + (i % 3) * 40, 16 * k * 3, 5 * k * 3, 0, { s: 3, lw: 2.5, st: 1 - k }); }
      K.line(200, 660, 200, 300, 1, 12); K.line(200, 300, 300, 300, 1, 10); K.circ(300, 312, 22, { f: 2 }); K.glow(2, 300, 320, 330 + a.e * 40, .6);
      const px = 1000 + sin(t * .3) * 20; K.c.save(); K.c.translate(px, 650); K.circ(0, -230, 30, O(-1, 1, 6)); K.path(c => { c.moveTo(-50, 40); c.quadraticCurveTo(-40, -190, 0, -190); c.quadraticCurveTo(40, -190, 50, 40); c.closePath(); }, O(3, 1, 7, .9)); K.line(-14, 40, -18, 150, 1, 12); K.line(14, 40, 26 + sin(t * 3) * 10, 150, 1, 12); K.path(c => { c.moveTo(-120, -200); c.quadraticCurveTo(0, -330, 120, -200); c.quadraticCurveTo(60, -230, 0, -200); c.quadraticCurveTo(-60, -230, -120, -200); }, O(2, 1, 7)); K.line(0, -210, 0, -110, 1, 6); K.c.restore(); });
})();
