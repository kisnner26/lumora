// la cámara afecta a la acción; la letra permanece en su zona de lectura.
(() => {
  const R = window.RISO, F = R?.film; if (!F) return;
  const mix = (a, b, t) => a + (b - a) * t;
  F.draw = function (K, shot, elapsed, options = {}) {
    const b = shot.narrative, reduced = !!window.CFG?.reduceMotion, pose0 = this.pose(b, elapsed, reduced), state = this.stateAt(b, elapsed, reduced);
    const cx = shot.flip ? 470 : 1130, ground = 710, c = K.c, now = (b.t ?? 0) + elapsed;
    // lo que dice la letra: lugar, clima, hora y qué hace quien canta
    const A = R.atmos; if (A && typeof IN !== 'undefined') A.plan(IN.lines);
    const at = (A && A.at(b.li)) || {}, action = b.action === 'hold' ? null : b.action, openDoor = action === 'open' || action === 'return' || b.motif === 'puerta_entreabierta';
    const act = action ? null : at.act || ((b.li || 0) % 3 === 1 ? 'walk' : null), bpm = Math.max(70, Math.min(180, (typeof IN !== 'undefined' && IN.bpm) || 110)), ph = now * bpm / 60;
    const FALL = ['ciudad', 'costa', 'bosque', 'desierto', 'espacio'], fallback = FALL[(R.world ? R.world.hash((typeof ext !== 'undefined' ? ext.key() : 'lumora') + '|' + (b.visualChapter || 0)) : 0) % FALL.length];
    const place = openDoor ? 'cuarto' : at.place || (b.place !== 'cuarto' ? b.place : fallback);
    const pose = { ...pose0 }, bob = act === 'dance' ? Math.abs(Math.sin(ph * Math.PI)) * 34 : act === 'run' ? Math.abs(Math.sin(now * 9)) * 16 : act === 'walk' && !reduced ? Math.abs(Math.sin(now * 6.5)) * 5 : (reduced || action ? 0 : Math.sin(now * 1.6) * 3);
    if (!reduced) {
      if (act === 'dance') { pose.handY = -250 - Math.sin(ph * Math.PI) * 34; pose.handX = 34 + Math.sin(ph * Math.PI * .5) * 30; pose.head = Math.sin(ph * Math.PI * .5) * .18; pose.gait = Math.sin(ph * Math.PI) * 10; }
      else if (act === 'run') pose.gait = Math.sin(now * 14) * 26;
      else if (act === 'walk') pose.gait = Math.sin(now * 6.5) * 15;
    }
    if (act === 'cry') { pose.head = .24; pose.handY = -212; pose.handX = 18; }
    if (act === 'sleep') { pose.head = .36; pose.handY = -120; }
    if (act === 'sing') { pose.handY = -218; pose.handX = 14; pose.head = -.06 + (reduced ? 0 : Math.sin(ph * Math.PI * .5) * .05); }
    const gap = b.cast === 2 || ['give', 'reach'].includes(action) ? 120 : 0, left = cx - gap + pose.x, right = cx + gap;
    // cámara: el plano se adapta a lo que pasa y respira con el ritmo
    const camBeat = act && ['medium', 'wide'].includes(b.camera) ? { ...b, camera: { cry: 'close', sing: 'close', sleep: 'close', drive: 'wide', run: 'wide', dance: 'medium' }[act] } : b;
    const camera = this.camera(camBeat, elapsed, cx, reduced), beat = reduced ? 0 : (typeof IN !== 'undefined' && IN.beat) || 0;
    const dolly = reduced ? 0 : (pose.p - .5) * .1 * ((b.li || 0) % 2 ? 1 : -1), sway = reduced ? 0 : Math.sin(now * .7) * 12 + Math.sin(now * 1.9) * 4, lift = reduced ? 0 : Math.cos(now * .6) * 8;
    const roll = reduced ? 0 : Math.sin(now * .35) * .012 * (.6 + (b.section?.energy || 5) / 10), punch = beat * .022;
    // ---------- fondo a pantalla completa: el mundo del lugar, el cielo y el clima ----------
    const drift = reduced ? 0 : act === 'walk' ? Math.sin(now * .22) * 150 : act === 'run' ? Math.sin(now * .5) * 260 : 0;
    A?.backdrop(K, { place, at, now, beat, ground, cx, view: { x: (camera.x - cx) * .45 + sway * .4, y: (camera.y - 460) * .45 + lift * .4, drift, dolly, punch, roll } });
    if (A && (act === 'dance' || (at.act === 'dance' && !action)) && place !== 'espacio') A.crowd(K, now, beat, 1, ground + 20);
    // ---------- los actores, con su propia cámara ----------
    c.save(); c.translate(cx, 450); c.rotate(roll); c.scale((camera.reverse ? -1 : 1) * camera.z * 1.1 * (1 + dolly + punch), camera.z * 1.1 * (1 + dolly + punch)); c.translate(-camera.x - sway, -camera.y - lift);
    // puerta articulada: el ancho visible del panel cambia con la apertura.
    if (action === 'open' || action === 'return' || b.motif === 'puerta_entreabierta') {
      const dx = cx + 165, top = ground - 350, w = 120, opened = state.door;
      K.rect(dx - 10, top - 10, w + 20, 360, { f: 1, ft: .18, s: 1, lw: 6 });
      const edge = dx + w * (1 - opened * .84), rise = opened * 22;
      K.poly([[dx, top], [edge, top + rise], [edge, ground - rise], [dx, ground]], { f: 3, ft: .5, s: 1, lw: 5 });
      K.circ(edge - 13, top + 200, 5, { f: 2, s: 1, lw: 2 });
      if (opened > .05) K.poly([[edge, ground - rise], [dx + w, ground], [dx + w + opened * 90, ground + 60], [edge - opened * 50, ground + 60]], { f: 2, ft: .16 });
    }
    const actor = (px, second) => {
      const lean = second ? (act === 'dance' ? -pose.head : 0) : pose.head, gait = second ? (act === 'dance' || act === 'run' ? -pose.gait : 0) : pose.gait, ink = second ? 3 : 2;
      c.save(); c.translate(px, ground - bob);
      K.ell(0, 4 + bob, 40 - bob * .4, 7, 0, { f: 1, ft: .16 });
      K.line(-12, -105, -22 - gait, -4, 1, 11); K.line(12, -105, 22 + gait, -4, 1, 11);
      K.line(-22 - gait, -4, -38 - gait, -4, 1, 7); K.line(22 + gait, -4, 38 + gait, -4, 1, 7);
      K.poly([[-28, -205], [28, -205], [36, -100], [-36, -100]], { f: ink, ft: .75, s: 1, lw: 5 });
      K.line(-24, -190, -40, -136, ink, 13);
      const hx = second ? -45 - (action === 'give' ? pose.move * 35 : action === 'reach' ? pose.move * 25 : 0) : pose.handX;
      const hy = second ? (act === 'dance' ? pose.handY + 12 : -155) : pose.handY, elbow = second ? -48 : 40;
      K.line(second ? -24 : 24, -190, elbow, -170, ink, 13); K.line(elbow, -170, hx, hy, ink, 11);
      K.circ(hx, hy, 7, { f: -1, s: 1, lw: 3 });
      c.save(); c.translate(0, -235); c.rotate(lean);
      if (second) K.ell(0, 0, 33, 38, 0, { f: 3, s: 1, lw: 3 });
      K.ell(0, 0, 26, 30, 0, { f: -1, s: 1, lw: 4 });
      K.ell(0, -22, 27, 11, -.12, { f: second ? 3 : 1, s: 1, lw: 3 });
      K.line(second ? -11 : 7, -2, second ? -6 : 12, -2, 1, 3);
      K.line(second ? -21 : 20, 4, second ? -25 : 25, 10, 1, 2); c.restore(); c.restore();
    };
    const empty = b.place === 'cuarto' && (action === 'leave' ? pose.p >= .98 : state.empty >= .99);
    const hideActors = act === 'drive';
    // si la canción tiene artista con perfil, él o ella es quien actúa; las escenas con objetos (puerta, taxi, carta…) siguen con los muñecos
    const SGm = R.singers, cfgOn = !window.CFG || CFG.singers !== false, ck = typeof ext !== 'undefined' ? ext.key() : '';
    if (F._castKey !== ck) { F._castKey = ck; F._cast = cfgOn && SGm ? SGm.plan(ext.st.artist, ext.st.name) : null; }
    const cast = !action && !hideActors && !empty ? F._cast : null, star = cast && cast[(b.li || 0) % cast.length];
    if (star) {
      const figAct = act === 'cry' || ((b.li || 0) % 4 === 3 && !act) ? 'look' : act === 'sleep' ? null : act === 'sing' || !act ? 'sing' : act;
      const sc = .78 * (figAct === 'look' ? .9 : 1), place2 = at.place;
      R.artistFigures.draw(K, star.name, star.id, left, ground, sc, { time: now + star.h % 7, bpm, act: figAct === 'look' ? null : figAct, back: figAct === 'look', active: figAct === 'sing' && !reduced, open: figAct === 'sing' ? Math.abs(Math.sin(now * 7)) * .8 : 0, instrument: star.instrument, album: typeof ext !== 'undefined' ? ext.st.album || '' : '' });
      if (cast.length > 1 && star.band) cast.filter(m => m !== star).slice(0, 2).forEach((m, i) => R.artistFigures.draw(K, m.name, m.id, left + (i ? 200 : -200), ground, sc * .86, { time: now + m.h % 7, bpm, act: figAct === 'look' ? null : figAct, instrument: m.instrument, active: false, album: typeof ext !== 'undefined' ? ext.st.album || '' : '' }));
    } else {
      if (!empty && !hideActors && !(action === 'board' && pose.p > .86)) actor(left, false);
      if (!empty && !hideActors && (gap || (act === 'dance' && at.place !== 'espacio'))) actor(gap ? right : left + 190, true);
    }
    // lo que hace quien canta, dibujado encima
    const note = (x, y, k = 1, i = 2) => { K.ell(x, y, 9 * k, 6.5 * k, -.4, { f: i, ft: .95, s: 1, lw: 2 }); K.line(x + 8 * k, y - 2 * k, x + 8 * k, y - 34 * k, 1, 3); K.path(cc => { cc.moveTo(x + 8 * k, y - 34 * k); cc.quadraticCurveTo(x + 24 * k, y - 28 * k, x + 20 * k, y - 14 * k); }, { s: 1, lw: 3 }); };
    if (act === 'drive') {
      const tx = cx - 20, wob = reduced ? 0 : Math.sin(now * 18) * 2.5, spin = now * 9;
      for (let i = 0; i < 9; i++) { const px = ((i * 230 - now * 880) % 2100 + 2100) % 2100 - 300 - cx + 800 - 800; K.rect(cx + px - 300, ground - 150, 14, 150, { f: 3, ft: .5, s: 1, lw: 3 }); }
      K.line(cx - 700, ground + 28, cx + 700, ground + 28, 2, 5); for (let i = 0; i < 12; i++) { const px = ((i * 170 - now * 880) % 2040 + 2040) % 2040 - 1000; K.rect(cx + px, ground + 50, 90, 8, { f: -1, s: 1, lw: 2 }); }
      c.save(); c.translate(tx, wob);
      K.ell(0, ground - 4, 210, 12, 0, { f: 1, ft: .22 });
      K.poly([[-190, ground - 80], [-120, ground - 88], [-70, ground - 168], [90, ground - 168], [150, ground - 92], [215, ground - 82], [215, ground - 24], [-190, ground - 24]], { f: 2, ft: .88, s: 1, lw: 6 });
      K.poly([[-58, ground - 156], [80, ground - 156], [128, ground - 92], [-100, ground - 92]], { f: -1, s: 1, lw: 4 });
      K.ell(-18, ground - 122, 22, 25, 0, { f: -1, s: 1, lw: 4 }); K.ell(-18, ground - 140, 22, 9, -.1, { f: 1, s: 1, lw: 3 }); K.line(12, ground - 150, 70, ground - 118, 1, 3, .6);
      for (const dx of [-105, 135]) { K.circ(dx, ground - 24, 32, { f: 1, s: 1, lw: 6 }); K.circ(dx, ground - 24, 13, { f: -1, s: 1, lw: 3 }); for (let k = 0; k < 4; k++) { const a = spin + k * Math.PI / 2; K.line(dx, ground - 24, dx + Math.cos(a) * 28, ground - 24 + Math.sin(a) * 28, -1, 3); } }
      K.glow(2, 240, ground - 62, 130 + beat * 40, .7); K.circ(214, ground - 62, 9, { f: -1, s: 1, lw: 3 });
      for (let i = 0; i < 5; i++) K.line(-210 - i * 36 - ((now * 600) % 36), ground - 40 - i * 13, -290 - i * 52, ground - 40 - i * 13, 1, 3, .5);
      c.restore();
    } else if (act === 'cry' && !star) {
      for (let i = 0; i < 3; i++) { const q = reduced ? .5 : (now * 1.3 + i * .37) % 1, hx = left + 4 + (i % 2) * 14, hy = ground - 222 + q * 180; K.path(cc => { cc.moveTo(hx, hy - 12); cc.quadraticCurveTo(hx + 7, hy + 2, hx, hy + 6); cc.quadraticCurveTo(hx - 7, hy + 2, hx, hy - 12); }, { f: 3, ft: .9 - q * .5, s: 1, lw: 2 }); }
    } else if (act === 'sing') {
      if (!star) { K.line(left + 18, ground - 214, left + 36, ground - 232, 1, 4); K.circ(left + 42, ground - 238, 11, { f: 1, s: 1, lw: 3 }); }
      for (let i = 0; i < 4; i++) { const q = reduced ? .4 : (now * .5 + i * .26) % 1; note(left + 60 + i * 34 + Math.sin(now + i) * 14, ground - 250 - q * 260, .9 - q * .3, i % 2 ? 2 : 3); }
    } else if (act === 'dance') {
      for (let i = 0; i < 18; i++) { const q = reduced ? .5 : (now * .45 + i * .071) % 1, x = left - 360 + ((i * 163) % 760), y = ground - 520 + q * 600; K.rect(x, y, 10, 5, { f: i % 3 + 1, ft: .9, s: 1, lw: 1.5 }); }
      note(left + 150, ground - 330 - (reduced ? 0 : Math.abs(Math.sin(ph * Math.PI)) * 40), 1.1, 2);
    } else if (act === 'run') {
      for (let i = 0; i < 6; i++) K.line(left - 80 - i * 44 - ((now * 500) % 44), ground - 80 - i * 28, left - 170 - i * 64, ground - 80 - i * 28, 1, 3, .5);
    } else if (act === 'sleep') {
      for (let i = 0; i < 3; i++) { const q = reduced ? .4 : (now * .35 + i * .33) % 1; K.txt('z', left + 40 + i * 22, ground - 270 - q * 150, { font: 'display', size: 34 - i * 6, w: 800, i: 3 }); }
    }
    const id = shot.props?.[0]?.id || b.motif;
    if (action === 'board' || id === 'taxi') {
      const tx = cx + 140;
      K.poly([[tx - 150, ground - 115], [tx - 75, ground - 115], [tx - 35, ground - 180], [tx + 85, ground - 180], [tx + 125, ground - 115], [tx + 185, ground - 105], [tx + 185, ground - 25], [tx - 150, ground - 25]], { f: 2, ft: .85, s: 1, lw: 6 });
      K.poly([[tx - 25, ground - 168], [tx + 70, ground - 168], [tx + 105, ground - 115], [tx - 55, ground - 115]], { f: -1, s: 1, lw: 4 });
      for (const dx of [-85, 125]) { K.circ(tx + dx, ground - 25, 28, { f: 1, s: 1, lw: 5 }); K.circ(tx + dx, ground - 25, 11, { f: -1, s: 1, lw: 3 }); }
      K.rect(tx + 5, ground - 200, 48, 20, { f: -1, s: 1, lw: 3 });
      if (state.taxi > .85) K.circ(tx, ground - 140, 16, { f: -1, s: 1, lw: 3 });
    } else if (id === 'foto_rota') {
      const px = left + 45, py = ground - 158, split = state.photo * 22;
      c.save(); c.translate(px, py); c.scale(.62, .62);
      for (const sd of [-1, 1]) { c.save(); c.translate(sd * split, sd * split * .4); c.rotate(sd * state.photo * .12);
        K.poly(sd < 0 ? [[-60, -55], [0, -55], [9, -20], [-6, 10], [0, 65], [-60, 65]] : [[0, -55], [60, -55], [60, 65], [0, 65], [-6, 10], [9, -20]], { f: -1, s: 1, lw: 4 });
        K.rect(sd < 0 ? -50 : 10, -43, 40, 80, { f: 3, ft: .5, s: 1, lw: 2 }); c.restore(); }
      c.restore();
    } else if (id === 'flowers' || id === 'semilla_brote') {
      const wilt = state.flower, px = cx, stemY = ground - 45, headY = ground - 185 + wilt * 65, headX = px + wilt * 55;
      K.line(px, stemY, px + wilt * 22, ground - 125, 3, 6); K.line(px + wilt * 22, ground - 125, headX, headY, 3, 6);
      K.ell(px - 20, ground - 115, 28, 11, -.6 + wilt, { f: 3, s: 1, lw: 3 });
      for (let i = 0; i < 6; i++) { const a = i * Math.PI / 3; K.ell(headX + Math.cos(a) * 21, headY + Math.sin(a) * (21 - wilt * 11), 15, 9, a + wilt, { f: 2, ft: .9 - wilt * .5, s: 1, lw: 3 }); }
      K.circ(headX, headY, 10, { f: 3, s: 1, lw: 3 });
    } else if (id === 'carta_abierta') {
      const transfer = state.letter, px = mix(left + pose.handX, right - 80, transfer);
      K.rect(px - 22, ground - 177, 44, 31, { f: -1, s: 1, lw: 3 });
      K.line(px - 22, ground - 177, px, ground - 160, 1, 2); K.line(px, ground - 160, px + 22, ground - 177, 1, 2);
    } else if (id && !['puerta_entreabierta', 'taxi'].includes(id) && R.props.DEFS[id]) {
      const where = id === 'maleta_viaje' ? [left - 45, ground - 62, .3] : id === 'banco_vacio' ? [cx, ground - 60, .55] : [cx, 310, .45];
      R.props.drawProp(K, id, ...where, 1, { seed: shot.seed, ph: 0, rot: 0 });
    }
    c.restore();
    if (!options.thumbnail) K.code(`${F.roles[b.section?.role] || 'verso'} · ${F.cameras[b.camera] || 'plano medio'}`, cx, 795, { align: 'center', size: 14 });
  };
})();
