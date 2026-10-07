// visualizador de los 22 niveles principales: recorrido original, no copia del nivel.
// detección por créditos; toda la trayectoria depende del reloj de la canción, no de frames acumulados.
(() => {
  const R = window.RISO; if (!R) return;
  const norm = s => String(s || '').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9]+/g, ' ').trim();
  const data = [
    ['Stereo Madness', 'foreverbound', 160, ['cube', 'ship'], 205],
    ['Back on Track', 'djvi', 130, ['cube', 'ship'], 285],
    ['Polargeist', 'step', 140, ['cube', 'ship'], 195],
    ['Dry Out', 'djvi', 140, ['cube', 'ship', 'gravity'], 350],
    ['Base after Base', 'djvi', 140, ['cube', 'ship', 'gravity'], 120],
    ["Can't Let Go", 'djvi', 140, ['cube', 'gravity', 'ship'], 270],
    ['Jumper', 'waterflame', 145, ['cube', 'ship', 'gravity'], 25],
    ['Time Machine', 'waterflame', 130, ['cube', 'ship', 'mirror'], 335],
    ['Cycles', 'djvi', 120, ['cube', 'ball', 'ship'], 310],
    ['xStep', 'djvi', 130, ['cube', 'ship', 'ball'], 220],
    ['Clutterfunk', 'waterflame', 150, ['cube', 'ship', 'ball', 'mini'], 290],
    ['Theory of Everything', 'dj nate', 130, ['cube', 'ufo', 'ship', 'ball'], 40],
    ['Electroman Adventures', 'waterflame', 145, ['cube', 'ship', 'ball', 'mini'], 195],
    ['Clubstep', 'dj nate', 140, ['cube', 'ship', 'ball', 'ufo'], 355],
    ['Electrodynamix', 'dj nate', 140, ['cube', 'ship', 'ufo', 'fast'], 95],
    ['Hexagon Force', 'waterflame', 150, ['cube', 'dual', 'ship', 'ball'], 20],
    ['Blast Processing', 'waterflame', 140, ['cube', 'wave', 'ship', 'ufo'], 175],
    ['Theory of Everything 2', 'dj nate', 132, ['cube', 'wave', 'ship', 'ball', 'ufo'], 295],
    ['Geometrical Dominator', 'waterflame', 145, ['cube', 'robot', 'ship', 'wave'], 125],
    ['Deadlocked', 'f777', 140, ['cube', 'wave', 'ship', 'robot', 'ufo'], 5],
    ['Fingerdash', 'mdk', 170, ['cube', 'spider', 'ship', 'wave', 'robot'], 280],
    ['Dash', 'mdk', 128, ['cube', 'swing', 'ship', 'spider', 'wave', 'robot'], 155]
  ];
  const levels = data.map(([title, author, bpm, modes, hue], i) => ({ id: i + 1, title, author, bpm, modes, hue }));
  const aliases = new Map(levels.map(l => [norm(l.title), l]));
  aliases.set('cant let go', levels[5]); aliases.set('fingerbang', levels[20]); aliases.set('club step', levels[13]);
  aliases.set('blastprocess', levels[16]); aliases.set('blast process', levels[16]);
  aliases.set('geometry dash official theme song', levels[21]); aliases.set('geometry dash', levels[21]);
  const titleKey = raw => norm(String(raw || '').replace(/\s*[([](?:geometry dash|gd|official|original|audio|full|extended|remaster)[^\])]*[\])]/gi, '').replace(/\s*[-–—]\s*(?:geometry dash|official audio|official video|original mix|full version)\s*$/i, ''));
  const GD = R.geometry = {
    levels,
    detect(title, artist, album = '') {
      const key = titleKey(title), who = norm(artist).replace(/ /g, ''), context = /geometry\s*dash/i.test(album + ' ' + title);
      let level = aliases.get(key);
      // algunos proveedores prefijan el título con el autor, pero nunca aceptamos coincidencias parciales.
      if (!level) for (const l of levels) { const prefix = norm(l.author) + ' '; if (key.startsWith(prefix) && aliases.get(key.slice(prefix.length)) === l) { level = l; break; } }
      if (!level) return null;
      const authors = who.split(/feat|featuring/)[0];
      const expected = level.author.replace(/ /g, '');
      return authors === expected || context ? level : null;
    },
    state(level, seconds, reduced = false) {
      const beat = Math.max(0, seconds) * level.bpm / 60, section = Math.floor(beat / 16), index = section % level.modes.length;
      const mode = level.modes[index], form = ['gravity', 'mirror', 'mini', 'fast', 'dual'].includes(mode) ? 'cube' : mode;
      const speeds = level.modes.map(m => m === 'fast' ? 1.5 : 1), speed = speeds[index];
      const previous = (Math.floor(section / speeds.length) * speeds.reduce((a, b) => a + b, 0) + speeds.slice(0, index).reduce((a, b) => a + b, 0)) * 16;
      const travelBeat = previous + (beat % 16) * speed, scroll = travelBeat * 120; // seeks exactos, también al cambiar velocidad.
      const phase = ((travelBeat % 4) + 4) % 4, distance = phase > 2 ? phase - 4 : phase;
      const jump = Math.max(0, 1 - (distance / .88) ** 2);
      const flight = ['ship', 'ufo', 'wave', 'swing'].includes(form);
      let y = flight ? 420 + Math.sin(travelBeat * Math.PI / 4) * 135 : form === 'ball' || form === 'spider' ? (Math.floor(travelBeat / 2) % 2 ? 240 : 650) : 650 - jump * (form === 'robot' ? 235 : 175);
      if (form === 'wave') { const p = travelBeat / 4 % 2; y = 280 + (p < 1 ? p : 2 - p) * 280; }
      if (form === 'ufo') y = 490 - Math.abs(Math.sin(travelBeat * Math.PI / 2)) * 170;
      if (reduced) y = flight ? 440 : 650;
      if (mode === 'gravity') y = 900 - y;
      return { beat, section, mode, form, y, jump, scroll: reduced ? previous * 120 : scroll, portal: (previous + 16 * speed) * 120, angle: reduced ? 0 : flight ? Math.cos(travelBeat * Math.PI / 4) * .18 : jump > 0 ? distance * Math.PI : Math.round(travelBeat / 4) * Math.PI * 2, mini: mode === 'mini', dual: mode === 'dual', speed };
    },
    render(c, width, height, level, seconds, options = {}) {
      const reduced = !!options.reduced, s = this.state(level, seconds, reduced), hue = (level.hue + s.section * 17) % 360;
      const color = `hsl(${hue},95%,63%)`, accent = `hsl(${(hue + 95) % 360},96%,65%)`, dark = '#080d1b';
      c.save(); c.setTransform(1, 0, 0, 1, 0, 0); c.fillStyle = dark; c.fillRect(0, 0, width, height);
      const scale = Math.min(width / 1600, height / 900); c.translate((width - 1600 * scale) / 2, (height - 900 * scale) / 2); c.scale(scale, scale);
      const line = (x1, y1, x2, y2, stroke = color, lw = 3) => { c.beginPath(); c.moveTo(x1, y1); c.lineTo(x2, y2); c.strokeStyle = stroke; c.lineWidth = lw; c.stroke(); };
      const poly = (points, fill = dark, stroke = color, lw = 3) => { c.beginPath(); points.forEach(([x, y], i) => i ? c.lineTo(x, y) : c.moveTo(x, y)); c.closePath(); c.fillStyle = fill; c.fill(); c.strokeStyle = stroke; c.lineWidth = lw; c.stroke(); };
      const box = (x, y, w, h, fill = dark, stroke = color, lw = 3) => { c.fillStyle = fill; c.fillRect(x, y, w, h); c.strokeStyle = stroke; c.lineWidth = lw; c.strokeRect(x, y, w, h); };
      const orb = (x, y, r, stroke = accent) => { c.beginPath(); c.arc(x, y, r, 0, Math.PI * 2); c.strokeStyle = stroke; c.lineWidth = 4; c.stroke(); c.beginPath(); c.arc(x, y, r * .65, 0, Math.PI * 2); c.fillStyle = stroke; c.fill(); };
      const bg = c.createLinearGradient(0, 0, 0, 900); bg.addColorStop(0, `hsl(${hue},65%,12%)`); bg.addColorStop(.6, '#0a1020'); bg.addColorStop(1, `hsl(${hue},60%,9%)`); c.fillStyle = bg; c.fillRect(0, 0, 1600, 900);
      // paralaje lento y geometría de fondo, sin recursos externos.
      c.save(); if (s.mode === 'mirror') { c.translate(1600, 0); c.scale(-1, 1); }
      c.globalAlpha = .16;
      for (let i = -2; i < 13; i++) { const xx = i * 160 - s.scroll * .16 % 160; box(xx, 150 + (i % 3 + 3) % 3 * 90, 125, 330, 'transparent', color, 2); }
      for (let y = 180; y < 900; y += 90) line(0, y, 1600, y, color, 1);
      c.globalAlpha = 1;
      const floor = 690, ceiling = 200, playerX = 360, cell = 480, start = Math.floor((s.scroll - playerX) / cell) - 1;
      const flight = ['ship', 'ufo', 'wave', 'swing', 'ball', 'spider'].includes(s.form);
      line(0, floor, 1600, floor, color, 4); line(0, ceiling, 1600, ceiling, color, 3);
      c.globalAlpha = .14; box(0, floor, 1600, 210, color, color); c.globalAlpha = 1;
      for (let j = start; j < start + 7; j++) {
        const xx = playerX + j * cell - s.scroll;
        if (flight) {
          const len = 60 + (Math.abs(j * 31 + level.id) % 90);
          const floorLen = ['ball', 'spider'].includes(s.form) ? 0 : s.form === 'wave' ? 42 : len;
          box(xx - 34, floor - floorLen, 68, floorLen, dark, color, 4); box(xx - 34, ceiling, 68, s.form === 'wave' ? 25 : 45 + (len % 65), dark, accent, 4);
          if (floorLen > 0) poly([[xx - 34, floor - floorLen], [xx, floor - floorLen - 35], [xx + 34, floor - floorLen]], dark, color);
          if (j % 2 === 0) orb(xx + 180, 440, 15);
        } else {
          const invert = s.mode === 'gravity', gy = invert ? 210 : floor, sign = invert ? 1 : -1;
          for (let k = -1; k <= 1; k++) { const sx = xx + k * 42; poly([[sx - 20, gy], [sx, gy + sign * 62], [sx + 20, gy]], dark, color, 4); line(sx, gy + sign * 18, sx, gy + sign * 42, accent, 2); }
          if (j % 2 === 0) { orb(xx, gy + sign * 220, 15); box(xx + 165, floor + 10, 85, 45, dark, color); }
        }
      }
      // portal de transformación al acercarse el siguiente bloque de 16 pulsos.
      const portalX = playerX + (s.portal - s.scroll);
      if (portalX < 1650) { c.beginPath(); c.ellipse(portalX, 440, 30, 205, 0, 0, Math.PI * 2); c.strokeStyle = accent; c.lineWidth = 9; c.stroke(); c.beginPath(); c.ellipse(portalX, 440, 42, 221, 0, 0, Math.PI * 2); c.strokeStyle = color; c.lineWidth = 3; c.stroke(); }
      // estela reconstruida desde el reloj: no conserva posiciones de otra canción ni de otro seek.
      if (!reduced) for (let i = 14; i > 0; i--) { const past = this.state(level, Math.max(0, seconds - i * .025)); c.globalAlpha = (1 - i / 15) * .45; box(playerX - i * 10, past.y - 10, 15, 20, accent, accent, 1); }
      c.globalAlpha = 1;
      const player = (y, inverted = false) => {
        c.save(); c.translate(playerX, y); c.scale(s.mini ? .65 : 1, (s.mini ? .65 : 1) * (inverted ? -1 : 1)); c.rotate(s.angle);
        if (s.form === 'ship') { poly([[-43, 12], [43, 4], [11, 30], [-31, 30]], color, '#f5fbff', 3); poly([[-23, 9], [-9, -19], [18, -19], [27, 9]], dark, accent, 4); box(-8, -12, 17, 14, accent, accent); poly([[-43, 11], [-66, 20], [-43, 26]], accent, accent); }
        else if (s.form === 'wave') poly([[-34, -28], [32, 0], [-34, 28], [-14, 0]], color, '#f5fbff', 3);
        else if (s.form === 'ball') { for (let i = 0; i < 12; i++) { const a = i * Math.PI / 6; poly([[Math.cos(a - .15) * 26, Math.sin(a - .15) * 26], [Math.cos(a) * 40, Math.sin(a) * 40], [Math.cos(a + .15) * 26, Math.sin(a + .15) * 26]], color, color); } orb(0, 0, 26, color); box(-12, -12, 24, 24, dark, '#f5fbff'); }
        else if (s.form === 'ufo' || s.form === 'swing') { c.beginPath(); c.ellipse(0, -7, 26, 28, 0, Math.PI, Math.PI * 2); c.fillStyle = dark; c.fill(); c.strokeStyle = color; c.lineWidth = 4; c.stroke(); poly([[-43, 0], [43, 0], [29, 20], [-29, 20]], color, '#f5fbff'); box(-13, -20, 8, 9, accent, accent); box(7, -20, 8, 9, accent, accent); if (s.form === 'swing') { orb(-23, 27, 8); orb(23, 27, 8); } }
        else if (s.form === 'spider') { poly([[-25, -26], [26, -26], [37, 13], [0, 29], [-37, 13]], color, '#f5fbff'); for (const side of [-1, 1]) { line(side * 20, 10, side * 48, 30, accent, 7); line(side * 48, 30, side * 38, 41, accent, 7); } box(-16, -15, 10, 12, dark, dark); box(6, -15, 10, 12, dark, dark); }
        else if (s.form === 'robot') { box(-24, -32, 48, 43, color, '#f5fbff'); box(-12, -21, 29, 10, dark, dark); line(-12, 11, -23, 32, accent, 8); line(13, 11, 26, 32, accent, 8); }
        else { box(-34, -34, 68, 68, color, '#f5fbff', 4); box(-24, -24, 48, 48, dark, accent, 3); box(-18, -15, 11, 14, color, color, 1); box(7, -15, 11, 14, color, color, 1); box(-16, 9, 32, 8, color, color, 1); }
        c.restore();
      };
      player(s.y); if (s.dual) player(900 - s.y, true);
      c.restore();
      // cabecera y progreso fuera del corredor jugable.
      c.font = '600 15px "Martian Mono", monospace'; c.fillStyle = accent; c.fillText(`LUMORA / GEOMETRY DASH / ${String(level.id).padStart(2, '0')}`, 65, 68);
      c.font = '800 44px "Anybody", sans-serif'; c.fillStyle = '#f1f6ff'; c.fillText(level.title.toLowerCase(), 65, 125);
      c.textAlign = 'right'; c.font = '600 15px "Martian Mono", monospace'; c.fillStyle = color; c.fillText(`${s.mode.toUpperCase()} / ${level.bpm} BPM`, 1535, 76);
      if (options.duration > 0) { const progress = Math.max(0, Math.min(1, seconds / options.duration)); box(1200, 105, 335, 7, '#172033', '#172033', 0); c.fillStyle = accent; c.fillRect(1200, 105, 335 * progress, 7); c.fillText(`${Math.round(progress * 100)}%`, 1535, 145); }
      c.textAlign = 'left'; c.font = '500 13px "Martian Mono", monospace'; c.fillStyle = '#8b9ab5'; c.fillText('recorrido procedural · sincronizado con la canción', 65, 818);
      if (options.text) { const str = options.text; c.font = '600 25px "Anybody", sans-serif'; c.textAlign = 'center'; c.fillStyle = '#f1f6ff'; c.fillText(str, 800, 857, 1400); }
      c.restore(); return s;
    }
  };
})();
