// geometry dash dentro del videoclip de siempre: las canciones de los 22 niveles principales se ven como cualquier otra
// (mismo motor, mismas tintas) y, de vez en cuando, una toma exclusiva: el cubo salta, la nave vuela, la onda zigzaguea.
(() => {
  const R = window.RISO; if (!R) return;
  const norm = s => String(s || '').toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/[^a-z0-9]+/g, ' ').trim();
  const sin = Math.sin, cos = Math.cos, PI = Math.PI;
  const data = [
    ['Stereo Madness', 'foreverbound', ['cube', 'ship']], ['Back on Track', 'djvi', ['cube', 'ship']], ['Polargeist', 'step', ['cube', 'ship']],
    ['Dry Out', 'djvi', ['cube', 'ship', 'gravity']], ['Base after Base', 'djvi', ['cube', 'ship', 'gravity']], ["Can't Let Go", 'djvi', ['cube', 'gravity', 'ship']],
    ['Jumper', 'waterflame', ['cube', 'ship', 'gravity']], ['Time Machine', 'waterflame', ['cube', 'ship', 'mirror']], ['Cycles', 'djvi', ['cube', 'ball', 'ship']],
    ['xStep', 'djvi', ['cube', 'ship', 'ball']], ['Clutterfunk', 'waterflame', ['cube', 'ship', 'ball', 'mini']], ['Theory of Everything', 'dj nate', ['cube', 'ufo', 'ship', 'ball']],
    ['Electroman Adventures', 'waterflame', ['cube', 'ship', 'ball', 'mini']], ['Clubstep', 'dj nate', ['cube', 'ship', 'ball', 'ufo']], ['Electrodynamix', 'dj nate', ['cube', 'ship', 'ufo', 'fast']],
    ['Hexagon Force', 'waterflame', ['cube', 'dual', 'ship', 'ball']], ['Blast Processing', 'waterflame', ['cube', 'wave', 'ship', 'ufo']], ['Theory of Everything 2', 'dj nate', ['cube', 'wave', 'ship', 'ball', 'ufo']],
    ['Geometrical Dominator', 'waterflame', ['cube', 'robot', 'ship', 'wave']], ['Deadlocked', 'f777', ['cube', 'wave', 'ship', 'robot', 'ufo']],
    ['Fingerdash', 'mdk', ['cube', 'spider', 'ship', 'wave', 'robot']], ['Dash', 'mdk', ['cube', 'swing', 'ship', 'spider', 'wave', 'robot']],
  ];
  const levels = data.map(([title, author, modes], i) => ({ id: i + 1, title, author, modes }));
  const aliases = new Map(levels.map(l => [norm(l.title), l]));
  aliases.set('cant let go', levels[5]); aliases.set('fingerbang', levels[20]); aliases.set('club step', levels[13]);
  aliases.set('blastprocess', levels[16]); aliases.set('blast process', levels[16]);
  aliases.set('geometry dash official theme song', levels[21]); aliases.set('geometry dash', levels[21]);
  const titleKey = raw => norm(String(raw || '').replace(/\s*[([](?:geometry dash|gd|official|original|audio|full|extended|remaster)[^\])]*[\])]/gi, '').replace(/\s*[-–—]\s*(?:geometry dash|official|original|audio|full|extended|remaster).*$/i, ''));
  // modo del nivel -> escena exclusiva
  const SCENE_OF = { cube: 'gd-cubo', ball: 'gd-cubo', robot: 'gd-cubo', spider: 'gd-cubo', mini: 'gd-cubo', fast: 'gd-cubo', dual: 'gd-cubo', ship: 'gd-nave', ufo: 'gd-nave', swing: 'gd-nave', wave: 'gd-onda', gravity: 'gd-gravedad', mirror: 'gd-gravedad' };
  const GD = R.gd = {
    levels, level: null,
    detect(title, artist, album = '') {
      const key = titleKey(title), who = norm(artist).replace(/ /g, ''), context = /geometry\s*dash/i.test(album + ' ' + title);
      let level = aliases.get(key);
      if (!level) for (const l of levels) { const prefix = norm(l.author) + ' '; if (key.startsWith(prefix) && aliases.get(key.slice(prefix.length)) === l) { level = l; break; } }   // nunca coincidencias parciales
      if (!level) return null;
      return who.split(/feat|featuring/)[0] === level.author.replace(/ /g, '') || context ? level : null;
    },
    scene(level, r) { const modes = level.modes; return SCENE_OF[modes[(r() * modes.length) | 0]] || 'gd-cubo'; },
  };

  // ---------- piezas comunes, dibujadas con las mismas tintas del motor ----------
  const GROUND = 700, TILE = 80;
  function spike(K, x, y, w, h, flip = 1, o = { f: 1, ft: .9, s: 1, lw: 4 }) { K.poly([[x - w / 2, y], [x, y - h * flip], [x + w / 2, y]], o); K.line(x, y - h * .25 * flip, x, y - h * .62 * flip, 3, 2, .6); }
  function cube(K, x, y, size, angle, a, mood = 0) {
    const c = K.c, s = size / 2; c.save(); c.translate(x, y); c.rotate(angle);
    K.rect(-s + 6, -s + 7, size, size, { f: 1, ft: .3, over: true });
    K.rect(-s, -s, size, size, { f: 2, ft: .95, s: 1, lw: 5 }); K.rect(-s * .72, -s * .72, size * .72, size * .72, { s: 1, lw: 2.5, st: .6 });
    const blink = sin(a.t * 1.7) > .96 ? 2 : 11;
    K.rect(-s * .5, -s * .35, 11, blink, { f: -1, s: 1, lw: 2 }); K.rect(s * .12, -s * .35, 11, blink, { f: -1, s: 1, lw: 2 }); K.rect(-s * .35, s * .22, size * .55, 7 + mood * 6, { f: 1 });
    c.restore();
  }
  function grid(K, t, speed, ink) {            // fondo de rejilla que se desliza: la misma textura de punto del resto
    const off = (t * speed * .35) % TILE;
    for (let i = -1; i < 22; i++) K.line(i * TILE - off, 40, i * TILE - off, GROUND, ink, 2, .22);
    for (let j = 0; j < 9; j++) K.line(-80, 90 + j * TILE, 1760, 90 + j * TILE, ink, 2, .18);
  }
  function floor(K, t, speed, y = GROUND) {
    K.rect(-200, y, 2000, 260, { f: 3, ft: .28 }); K.line(-200, y, 1800, y, 1, 8);
    const off = (t * speed) % TILE; for (let i = -1; i < 22; i++) { K.rect(i * TILE - off, y + 14, TILE - 10, TILE - 24, { s: 1, lw: 3, st: .55 }); }
  }
  const portal = (K, x, y, a, hh = 210) => { for (let i = 0; i < 3; i++) K.ell(x, y, 26 + i * 9 + a.beat * 6, hh / 2 - i * 14, 0, { s: i % 2 ? 1 : 2, lw: 7 - i * 2, st: .9 }); K.glow(2, x, y, hh * .8, .55); };
  const layout = (r, n, kinds) => Array.from({ length: n }, (_, i) => ({ k: kinds[(r() * kinds.length) | 0], gap: 300 + r() * 220, ph: r() * 6.28 }));

  // ---------- 1 · cubo: salta pinchos y bloques al compás ----------
  R.register({
    id: 'gd-cubo', name: 'cubo que salta', inks: 1, tag: 'geometry dash',
    phrases: ['un salto por compás y ningún pincho gana', 'el cubo no mira atrás'],
    make: r => ({ obs: layout(r, 40, ['spike', 'spike', 'double', 'block', 'stairs']), hue: r() }),
    cam(cam, t) { cam.x = sin(t * .2) * 24; cam.y = cos(t * .15) * 10; cam.z = 1.03; cam.r = sin(t * .1) * .004; },
    draw(K, s, t, dt, a) {
      const speed = 330 + a.e * 120, scroll = t * speed; a.t = t;
      K.bg(2, .05); grid(K, t, speed, 1);
      K.glow(2, 1250, 250, 360 + a.beat * 60, .4);
      const loop = s.obs.reduce((q, o) => q + o.gap, 0), cubeX = 420, hits = []; let lift = 0, pos = 900 - scroll % loop;
      for (let n = 0; n < 2; n++) for (const o of s.obs) { pos += o.gap; hits.push({ ...o, sx: pos }); }
      for (const o of hits) {
        if (o.sx < -200 || o.sx > 1800) continue;
        if (o.k === 'spike') spike(K, o.sx, GROUND, 70, 74);
        else if (o.k === 'double') { spike(K, o.sx - 36, GROUND, 70, 74); spike(K, o.sx + 36, GROUND, 70, 74); }
        else if (o.k === 'block') { K.rect(o.sx - 40, GROUND - 80, 80, 80, { f: 3, ft: .8, s: 1, lw: 5 }); K.rect(o.sx - 28, GROUND - 68, 56, 56, { s: 1, lw: 2, st: .6 }); }
        else { K.rect(o.sx - 40, GROUND - 80, 80, 80, { f: 3, ft: .8, s: 1, lw: 5 }); K.rect(o.sx + 40, GROUND - 160, 80, 160, { f: 3, ft: .8, s: 1, lw: 5 }); spike(K, o.sx + 130, GROUND, 60, 60); }
        const d = o.sx - cubeX, reach = o.k === 'stairs' ? 210 : 130, p = 1 - Math.abs(d) / reach;
        if (p > 0) lift = Math.max(lift, o.k === 'stairs' ? 200 * Math.min(1, p * 1.6) : 150 * Math.sin(Math.min(1, p) * PI / 2) ** .8);
      }
      floor(K, t, speed);
      const air = lift > 8, y = GROUND - 46 - lift, angle = air ? -(lift / 150) * PI / 2 : Math.round(scroll / 160) * PI / 2;
      for (let i = 1; i < 10; i++) K.circ(cubeX - 54 - i * 28, GROUND - 46 - (air ? lift * (1 - i / 12) : 0), 7 - i * .5, { f: 2, ft: .7 - i * .06 });
      cube(K, cubeX, y, 92, angle, a, air ? 1 : 0);
      if (a.beat > .5) K.circ(cubeX, GROUND, 60 + a.beat * 40, { s: 2, lw: 3, st: .5 });
    },
    notes(K, s, t, a) { const v = K.v, m = K.m; K.card(v.l + m, v.t + m, 330, 112, -.012); K.code('MODO · CUBO', v.l + m + 16, v.t + m + 34, { size: 17 }); K.meter?.(v.l + m + 16, v.t + m + 66, 290, a.e); },
  });

  // ---------- 2 · nave: vuela entre bloques con estela de puntos ----------
  R.register({
    id: 'gd-nave', name: 'nave en el túnel', inks: 1, tag: 'geometry dash',
    phrases: ['el techo baja, la nave sube', 'volar también es saltar'],
    make: r => ({ pillars: Array.from({ length: 30 }, (_, i) => ({ top: r() < .5, h: 90 + r() * 170, gap: 260 + r() * 200 })), orbs: Array.from({ length: 18 }, () => r() * 6.28) }),
    cam(cam, t) { cam.x = sin(t * .18) * 30; cam.y = cos(t * .13) * 14; cam.z = 1.04; cam.r = sin(t * .09) * .006; },
    draw(K, s, t, dt, a) {
      const speed = 300 + a.e * 140, scroll = t * speed; a.t = t;
      K.bg(2, .05); grid(K, t, speed * .6, 1); K.glow(3, 400, 450, 380 + a.beat * 50, .35);
      const loop = s.pillars.reduce((q, p) => q + p.gap, 0); let pos = 900 - scroll % loop;
      for (let n = 0; n < 2; n++) for (const p of s.pillars) { pos += p.gap; if (pos > -100 && pos < 1700) { if (p.top) { K.rect(pos - 50, 0, 100, p.h + 30, { f: 3, ft: .8, s: 1, lw: 5 }); spike(K, pos, p.h + 30, 80, 40, -1); } else { K.rect(pos - 50, GROUND - p.h, 100, p.h + 260, { f: 3, ft: .8, s: 1, lw: 5 }); spike(K, pos, GROUND - p.h, 80, 40); } } }
      K.rect(-200, -100, 2000, 130, { f: 3, ft: .3 }); K.line(-200, 30, 1800, 30, 1, 8); floor(K, t, speed);
      const sy = 450 + sin(t * 1.25) * 130 + sin(t * 2.7) * 30, tilt = cos(t * 1.25) * .45, c = K.c;
      for (let i = 1; i < 22; i++) { const tt = t - i * .045; K.circ(400 - i * 28, 450 + sin(tt * 1.25) * 130 + sin(tt * 2.7) * 30, 9 - i * .35, { f: i % 2 ? 2 : 3, ft: .8 - i * .03 }); }
      s.orbs.forEach((ph, i) => { const ox = ((i * 190 + 700 - scroll) % 2400 + 2400) % 2400 - 300, oy = 450 + sin((ox + 900) * .004 + ph) * 160; if (ox < 1700) { K.circ(ox, oy, 18 + a.beat * 5, { f: 2, ft: .9, s: 1, lw: 4 }); K.glow(2, ox, oy, 46, .6); } });
      c.save(); c.translate(400, sy); c.rotate(tilt);
      K.poly([[-60, 26], [-38, -4], [38, -4], [66, 26], [34, 38], [-34, 38]], { f: 3, ft: .95, s: 1, lw: 5 }); K.poly([[-8, -4], [0, -44], [30, -4]], { f: 2, ft: .95, s: 1, lw: 5 });
      K.rect(-14, -2, 12, 9, { f: -1, s: 1, lw: 2 }); K.rect(8, -2, 12, 9, { f: -1, s: 1, lw: 2 }); K.circ(-66, 22, 11 + a.beat * 6, { f: 2, ft: .9 }); c.restore();
    },
  });

  // ---------- 3 · onda: la flecha dibuja su zigzag ----------
  R.register({
    id: 'gd-onda', name: 'onda', inks: 2, tag: 'geometry dash',
    phrases: ['una línea que solo sabe subir o bajar', 'zigzag al ritmo del golpe'],
    make: r => ({ spikes: Array.from({ length: 36 }, () => ({ top: r() < .5, w: 56 + r() * 40, gap: 160 + r() * 140 })) }),
    cam(cam, t) { cam.x = sin(t * .22) * 20; cam.y = 0; cam.z = 1.02; cam.r = sin(t * .12) * .01; },
    draw(K, s, t, dt, a) {
      const speed = 380 + a.e * 120, c = K.c; a.t = t;
      const wave = tt => { const p = (tt * 1.6) % 2; return 450 + ((p < 1 ? p : 2 - p) - .5) * 520; };
      K.bg(1, .05); grid(K, t, speed * .5, 2); K.glow(2, 800, 450, 520 + a.beat * 70, .35);
      K.rect(-200, -100, 2000, 190, { f: 3, ft: .5 }); K.rect(-200, 810, 2000, 200, { f: 3, ft: .5 }); K.line(-200, 90, 1800, 90, 1, 8); K.line(-200, 810, 1800, 810, 1, 8);
      const loop = s.spikes.reduce((q, p) => q + p.gap, 0); let pos = 1000 - (t * speed) % loop;
      for (let n = 0; n < 2; n++) for (const p of s.spikes) { pos += p.gap; if (pos > -100 && pos < 1700) { if (p.top) spike(K, pos, 90, p.w, 70, -1); else spike(K, pos, 810, p.w, 70); } }
      K.path(cx => { for (let i = 0; i <= 60; i++) { const tt = t - i * .02; i ? cx.lineTo(560 - i * 9, wave(tt)) : cx.moveTo(560, wave(tt)); } }, { s: 2, lw: 14, st: .95 });
      K.path(cx => { for (let i = 0; i <= 60; i++) { const tt = t - i * .02; i ? cx.lineTo(560 - i * 9, wave(tt)) : cx.moveTo(560, wave(tt)); } }, { s: 1, lw: 5, st: .95 });
      const y = wave(t), slope = ((t * 1.6) % 2) < 1 ? 1 : -1; c.save(); c.translate(560, y); c.rotate(slope * .72);
      K.poly([[-34, -26], [40, 0], [-34, 26], [-18, 0]], { f: 2, ft: .98, s: 1, lw: 5 }); c.restore();
      K.circ(560, y, 60 + a.beat * 30, { s: 2, lw: 3, st: .5 });
    },
  });

  // ---------- 4 · gravedad: el cubo cambia de suelo con cada portal ----------
  R.register({
    id: 'gd-gravedad', name: 'cambio de gravedad', inks: 2, tag: 'geometry dash',
    phrases: ['arriba o abajo, el suelo es lo que decides', 'un portal y el mundo da la vuelta'],
    make: r => ({ obs: Array.from({ length: 24 }, () => ({ top: r() < .5, gap: 280 + r() * 200 })) }),
    cam(cam, t) { cam.x = sin(t * .2) * 22; cam.y = 0; cam.z = 1.03; cam.r = sin(t * .15) * .012; },
    draw(K, s, t, dt, a) {
      const speed = 340 + a.e * 110, scroll = t * speed, c = K.c; a.t = t;
      const CEIL = 160, FLR = 740, period = 3.2, k = Math.floor(t / period), ph = (t / period) % 1, up = k % 2 === 1;
      const glide = Math.min(1, ph / .22), e = glide * glide * (3 - 2 * glide), from = up ? FLR : CEIL, to = up ? CEIL : FLR, y = (ph < .22 ? from + (to - from) * e : to) + (to === CEIL ? 46 : -46);
      K.bg(1, .05); grid(K, t, speed * .5, 2);
      K.rect(-200, -100, 2000, CEIL + 100, { f: 3, ft: .4 }); K.rect(-200, FLR, 2000, 300, { f: 3, ft: .4 }); K.line(-200, CEIL, 1800, CEIL, 1, 8); K.line(-200, FLR, 1800, FLR, 1, 8);
      const loop = s.obs.reduce((q, p) => q + p.gap, 0); let pos = 1000 - scroll % loop;
      for (let n = 0; n < 2; n++) for (const p of s.obs) { pos += p.gap; if (pos > -100 && pos < 1700) { if (p.top) spike(K, pos, CEIL, 70, 70, -1); else spike(K, pos, FLR, 70, 70); } }
      const px = 1700 - (ph * period * speed) % 2400;
      if (ph < .22) portal(K, 420, to === CEIL ? CEIL + 80 : FLR - 80, a, 220); else if (px > -80) portal(K, px + 900, up ? CEIL + 80 : FLR - 80, a, 220);
      for (let i = 1; i < 9; i++) K.circ(420 - 40 - i * 28, y, 6, { f: 2, ft: .7 - i * .07 });
      cube(K, 420, y, 92, (up ? PI : 0) + Math.round(scroll / 180) * PI / 2 * (ph > .22 ? 1 : 0), a, ph < .22 ? 1 : 0);
    },
  });
  for (const id of ['gd-cubo', 'gd-nave', 'gd-onda', 'gd-gravedad']) { const i = R.order.indexOf(id); if (i >= 0) R.order.splice(i, 1); }   // solo aparecen en canciones de geometry dash
})();
