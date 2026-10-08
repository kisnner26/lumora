// la cámara afecta a la acción; la letra permanece en su zona de lectura.
(() => {
  const R = window.RISO, F = R?.film; if (!F) return;
  const mix = (a, b, t) => a + (b - a) * t;
  F.draw = function (K, shot, elapsed, options = {}) {
    const b = shot.narrative, reduced = !!window.CFG?.reduceMotion, pose0 = this.pose(b, elapsed, reduced), state = this.stateAt(b, elapsed, reduced);
    const cx = shot.flip ? 470 : 1130, ground = 710, c = K.c, now = (b.t ?? 0) + elapsed;
    // lo que dice la letra: lugar, clima, hora y qué hace quien canta
    const A = R.atmos; if (A && typeof IN !== 'undefined') A.plan(IN.lines);
    const STY = R.story, film = R.film.result, E0 = typeof ext !== 'undefined' ? ext : null;
    if (STY && film && typeof IN !== 'undefined') STY.plan(IN.lines, film, typeof SEM !== 'undefined' ? SEM.plans : [], (E0 && E0.st.dur) || 0, E0 ? E0.key() : '');
    // todo lo que entra o sale de pantalla se funde con el tiempo: nada aparece ni desaparece de golpe
    const smooth = (key, target, rate) => { const S = F._s || (F._s = {}), o = S[key], dt = o ? now - o.t : 1e9; if (!o || dt < 0 || dt > .7 || reduced) { S[key] = { t: now, v: target }; return target; } o.v += (target - o.v) * (1 - Math.exp(-dt * rate)); o.t = now; return o.v; };
    { const SG0 = R.singers, cfg0 = !window.CFG || CFG.singers !== false, ck0 = E0 ? E0.key() : ''; if (F._castKey !== ck0) { F._castKey = ck0; F._cast = cfg0 && SG0 && E0 ? SG0.plan(E0.st.artist, E0.st.name) : null; for (const m of F._cast || []) { if (!m.id) R.artistFigures.request(m.name); R.artistFigures.faceOf(m.name); } } }
    // movimiento con arranque y frenada suaves (ease in-out) para lo que entra, sale o gira; cuando cambia el objetivo, parte de donde estaba
    const tween = (key, target, dur) => { const S = F._tw || (F._tw = {}); let o = S[key]; const dt = o ? now - o.t : 1e9; if (!o || dt < 0 || dt > .7 || reduced) o = S[key] = { v0: target, v1: target, t0: now, t: now, v: target };
      if (o.v1 !== target) { o.v0 = o.v; o.v1 = target; o.t0 = now; } const q = Math.max(0, Math.min(1, (now - o.t0) / dur)); o.v = o.v0 + (o.v1 - o.v0) * q * q * (3 - 2 * q); o.t = now; return o.v; };
    const kStar = F._cast ? 1.75 : 1;
    const sv = (STY && STY.at(b.li)) || null, walkIn = !!(STY && STY.data && STY.data.forced.some(w => now >= w.a && now < w.b));
    const vw0 = STY && STY.data ? STY.view(now) : null;                 // el lugar y la hora los marca el reloj de la sección, no el verso: así el cambio coincide con el cruce del paisaje
    const at = { ...((A && A.at(b.li)) || {}), ...(sv ? { place: vw0 ? vw0.place : sv.place, time: vw0 ? vw0.time : sv.time, weather: sv.weather } : {}) };
    const action = b.action === 'hold' ? null : b.action, openDoor = action === 'open' || action === 'return' || b.motif === 'puerta_entreabierta';
    const objectAction = ['open', 'give', 'board', 'tear', 'wilt'].includes(action);
    const act = objectAction ? null : walkIn ? 'walk' : sv ? sv.act : action ? null : at.act || ((b.li || 0) % 3 === 1 ? 'walk' : null), bpm = Math.max(70, Math.min(180, (typeof IN !== 'undefined' && IN.bpm) || 110)), ph = now * bpm / 60;
    const FALL = ['ciudad', 'costa', 'bosque', 'desierto', 'espacio'], fallback = FALL[(R.world ? R.world.hash((E0 ? E0.key() : 'lumora') + '|' + (b.visualChapter || 0)) : 0) % FALL.length];
    const place = vw0 ? vw0.place : sv ? sv.place : openDoor ? 'cuarto' : at.place || (b.place !== 'cuarto' ? b.place : fallback);
    const pose = { ...pose0 }, bob = act === 'dance' ? Math.abs(Math.sin(ph * Math.PI)) * 34 : act === 'run' ? Math.abs(Math.sin(now * 9)) * 16 : act === 'walk' && !reduced ? Math.abs(Math.sin(now * 6.5)) * 5 : (reduced || action ? 0 : Math.sin(now * 1.6) * 3);
    if (!reduced) {
      if (act === 'dance') { pose.handY = -250 - Math.sin(ph * Math.PI) * 34; pose.handX = 34 + Math.sin(ph * Math.PI * .5) * 30; pose.head = Math.sin(ph * Math.PI * .5) * .18; pose.gait = Math.sin(ph * Math.PI) * 10; }
      else if (act === 'run') pose.gait = Math.sin(now * 14) * 26;
      else if (act === 'walk') pose.gait = Math.sin(now * 6.5) * 15;
    }
    if (act === 'cry') { pose.head = .24; pose.handY = -212; pose.handX = 18; }
    if (act === 'sleep') { pose.head = .36; pose.handY = -120; }
    if (act === 'sing') { pose.handY = -218; pose.handX = 14; pose.head = -.06 + (reduced ? 0 : Math.sin(ph * Math.PI * .5) * .05); }
    const gap = b.cast === 2 || ['give', 'reach'].includes(action) ? 120 : 0, gapS = F._cast ? 0 : gap, left = cx - gapS + (F._cast && !objectAction ? 0 : pose.x * kStar), leftP = cx - gap + pose.x, right = cx + gap;
    // cámara: el plano se adapta a lo que pasa y respira con el ritmo
    const grammar = sv && !b.manual ? { establishing: 'wide', medium: 'medium', close: 'close', wide: 'wide', push: 'medium', pull: 'wide' }[sv.shot] : null;
    const camBeat = grammar ? { ...b, camera: grammar } : act && ['medium', 'wide'].includes(b.camera) ? { ...b, camera: { cry: 'close', sing: 'close', sleep: 'close', drive: 'wide', run: 'wide', dance: 'medium' }[act] } : b;
    const camera0 = this.camera(camBeat, elapsed, cx, reduced);
    // la cámara no salta entre versos: persigue su objetivo con suavidad (si se busca otro segundo, se coloca de golpe)
    const dtc = F._camT === undefined ? 1e9 : now - F._camT; F._camT = now;
    if (!F._cam || dtc < 0 || dtc > .7 || reduced) F._cam = { x: camera0.x, y: camera0.y, z: camera0.z };
    else { const k = 1 - Math.exp(-dtc * 2.4); F._cam.x += (camera0.x - F._cam.x) * k; F._cam.y += (camera0.y - F._cam.y) * k; F._cam.z += (camera0.z - F._cam.z) * k; }
    const camera = shot.filmMode ? { ...camera0, x: F._cam.x, y: F._cam.y, z: F._cam.z } : camera0, beat = reduced ? 0 : (typeof IN !== 'undefined' && IN.beat) || 0;
    const dollyK = sv && !b.manual ? { establishing: .14, push: .16, pull: -.2 }[sv.shot] : undefined;
    const ease = x => x * x * (3 - 2 * x), dolly0 = reduced ? 0 : dollyK !== undefined ? dollyK * ease(pose.p) : (pose.p - .5) * .2 * ((b.li || 0) % 2 ? 1 : -1), dolly = shot.filmMode ? smooth('dolly', dolly0, 1.6) : dolly0, en0 = reduced ? 0 : Math.max(0, Math.min(1, R.A?.e ?? .4)), sway = reduced ? 0 : (Math.sin(now * .7) * 10 + Math.sin(now * 1.9 + 1) * 4 + Math.sin(now * 3.3 + 2) * 2) * (.7 + en0 * .6), lift = reduced ? 0 : (Math.cos(now * .6) * 7 + Math.sin(now * 2.3) * 3 + Math.sin(now * 4.1 + 1) * 1.5) * (.7 + en0 * .6);
    const roll = reduced ? 0 : Math.sin(now * .35) * .012 * (.6 + (b.section?.energy || 5) / 10), punch = beat * .045;
    // ---------- fondo a pantalla completa: el mundo del lugar, el cielo y el clima ----------
    const vw = STY && STY.data ? STY.view(now) : null, scroll = reduced ? 0 : vw ? vw.scroll : ({ walk: 150, run: 420, drive: 520 }[act] * now || 0), drift = 0;
    const skies = ['noche', 'amanecer', 'atardecer', 'dia'].map(t => [t, smooth('s_' + t, at.time === t ? 1 : 0, 1.1)]).filter(x => x[1] > .02), weathers = ['lluvia', 'tormenta', 'nieve', 'niebla', 'fuego', 'viento'].map(t => [t, smooth('w_' + t, at.weather === t ? 1 : 0, 1.0)]).filter(x => x[1] > .02);
    A?.backdrop(K, { place, at, now, beat, ground, cx, view: { skies, weathers, x: (camera.x - cx) * .45 + sway * .4, y: (camera.y - 460) * .45 + lift * .4, drift, scroll, seam: reduced ? null : vw?.seam, dolly, punch, roll } });
    const crowdK = tween('crowd', act === 'dance' && place !== 'espacio' ? 1 : 0, 1.0);
    if (A && crowdK > .03) A.crowd(K, now, beat, 1, ground + 20 + (1 - crowdK) * 340);
    // ---------- los actores, con su propia cámara ----------
    c.save(); c.translate(cx, 450); c.rotate(roll); c.scale((camera.reverse ? -1 : 1) * camera.z * 1.1 * (1 + dolly + punch), camera.z * 1.1 * (1 + dolly + punch)); c.translate(-camera.x - sway, -camera.y - lift);
    // puerta articulada: el ancho visible del panel cambia con la apertura.
    c.save(); if (kStar > 1) { c.translate(cx, ground); c.scale(kStar, kStar); c.translate(-cx, -ground); }
    if (action === 'open' || action === 'return' || b.motif === 'puerta_entreabierta') {
      const dx = cx + 165, top = ground - 350, w = 120, opened = state.door;
      K.rect(dx - 10, top - 10, w + 20, 360, { f: 1, ft: .18, s: 1, lw: 6 });
      const edge = dx + w * (1 - opened * .84), rise = opened * 22;
      K.poly([[dx, top], [edge, top + rise], [edge, ground - rise], [dx, ground]], { f: 3, ft: .5, s: 1, lw: 5 });
      K.circ(edge - 13, top + 200, 5, { f: 2, s: 1, lw: 2 });
      if (opened > .05) K.poly([[edge, ground - rise], [dx + w, ground], [dx + w + opened * 90, ground + 60], [edge - opened * 50, ground + 60]], { f: 2, ft: .16 });
    }
    c.restore();
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
    const carX = tween('car', act === 'drive' ? 0 : -1700, 2.0), starAlpha = Math.max(0, Math.min(1, 1 - (carX + 650) / 480)), hideActors = starAlpha < .03;
    // si la canción tiene artista con perfil, él o ella es quien actúa; las escenas con objetos (puerta, taxi, carta…) siguen con los muñecos
    const SGm = R.singers, cfgOn = !window.CFG || CFG.singers !== false, ck = typeof ext !== 'undefined' ? ext.key() : '';
    if (F._castKey !== ck) { F._castKey = ck; F._cast = cfgOn && SGm ? SGm.plan(ext.st.artist, ext.st.name) : null; for (const m of F._cast || []) if (!m.id) R.artistFigures.request(m.name); }
    const castAll = !hideActors && !empty && !(action === 'board' && pose.p > .86) ? F._cast : null, cast = castAll && (window.CFG?.faces === false ? castAll : castAll.filter(m => R.artistFigures.hasFace(m.name))), star = cast && cast.length ? (shot.filmMode || cast.length === 1 ? cast[0] : cast[(b.li || 0) % cast.length]) : null;   // en una colaboración, cada verso lo canta uno de los créditos
    if (star) {
      c.save(); c.globalAlpha = starAlpha;
      const figAct = objectAction ? ({ board: 'walk', give: 'wave' }[action] || null) : act === 'cry' || ((b.li || 0) % 4 === 3 && !act) ? 'look' : act === 'sleep' ? null : act === 'sing' || !act ? 'sing' : act;
      const sc = 1.0 * (figAct === 'look' ? .9 : 1), pst = null, dirP = cx < 800 ? 1 : -1;
      const targetGap = pst ? { near: 240, with: 215, embrace: 130, apart: 380 }[pst] || 230 : 1100, gapP0 = tween('gapP', targetGap, 2.4);
      const gapP = gapP0, hugDx = pst === 'embrace' && figAct === 'hug' && Math.abs(gapP - targetGap) < 25 ? dirP * gapP / sc : 0, arriving = Math.abs(gapP - targetGap) > 12;
      const lineOn = !!(IN.lines[b.li] && now >= IN.lines[b.li].t - .1 && now < IN.lines[b.li].t + Math.max(1.2, b.duration * .88)), en1 = reduced ? 0 : Math.max(0, Math.min(1, R.A?.e ?? .4)), hit1 = reduced ? 0 : R.A?.beat || 0;
      const turnS = tween('turnS', figAct === 'look' ? 1 : 0, .7), sxS = 1;
      const turnP = tween('turnP', pst === 'apart' || (pst === 'with' && figAct === 'look') ? 1 : 0, .8), sxP = Math.max(.07, Math.abs(Math.cos(turnP * Math.PI)));
      if (gapP < 1000 && (pst || arriving)) {                                                                          // el otro: llega, camina al lado, se abraza o se queda lejos, de espaldas
        const pAct = arriving ? 'walk' : pst === 'with' ? figAct : pst === 'embrace' ? (figAct === 'hug' ? 'hug' : null) : pst === 'near' && (figAct === 'walk' || figAct === 'dance') ? figAct : null;
        c.save(); c.translate(left + dirP * gapP, 0); c.scale(sxP, 1); c.translate(-(left + dirP * gapP), 0);
        R.artistFigures.draw(K, 'ella', null, left + dirP * gapP, ground, sc * .93, { time: now + 3.3 + Math.sin(now * .3) * .4, bpm, energy: en1, hit: hit1 * .6, look: -dirP, act: pAct === 'look' ? null : pAct, partner: true, back: turnP > .5, hug: -hugDx * sc / (sc * .93), active: false, album: '' });
        c.restore();
      }
      const talk = lineOn && figAct === 'sing' && !reduced ? Math.min(1, en1 * 1.7 * (.35 + .65 * Math.abs(Math.sin(now * 10.7 + Math.sin(now * 3.1) * 2)))) : 0;
      c.save(); c.translate(left, 0); c.scale(sxS, 1); c.translate(-left, 0);
      R.artistFigures.draw(K, star.name, star.id, left, ground, sc, { time: now + star.h % 7, bpm, hug: hugDx, energy: en1, hit: hit1, look: pst ? dirP * Math.min(1, (gapP < 600 ? 1 : 0)) : 0, act: figAct === 'look' ? null : figAct, back: false, active: figAct === 'sing' && lineOn && !reduced, open: talk, instrument: star.instrument, album: typeof ext !== 'undefined' ? ext.st.album || '' : '' });
      c.restore();
      if (cast.length > 1 && star.band) cast.filter(m => m !== star).slice(0, 2).forEach((m, i) => R.artistFigures.draw(K, m.name, m.id, left + (i ? 200 : -200), ground, sc * .86, { time: now + m.h % 7, bpm, act: figAct === 'look' ? null : figAct, instrument: m.instrument, active: false, album: typeof ext !== 'undefined' ? ext.st.album || '' : '' }));
      c.restore();
    } else {
      if (!empty && !hideActors && !(action === 'board' && pose.p > .86)) actor(left, false);
      if (!empty && !hideActors && (gap || (act === 'dance' && at.place !== 'espacio'))) actor(gap ? right : left + 190, true);
    }
    // lo que hace quien canta, dibujado encima
    const note = (x, y, k = 1, i = 2) => { K.ell(x, y, 9 * k, 6.5 * k, -.4, { f: i, ft: .95, s: 1, lw: 2 }); K.line(x + 8 * k, y - 2 * k, x + 8 * k, y - 34 * k, 1, 3); K.path(cc => { cc.moveTo(x + 8 * k, y - 34 * k); cc.quadraticCurveTo(x + 24 * k, y - 28 * k, x + 20 * k, y - 14 * k); }, { s: 1, lw: 3 }); };
    if (carX > -1600) {
      const tx = cx - 20 + carX, wob = reduced ? 0 : Math.sin(now * 18) * 2.5, spin = now * 9;
      c.save(); c.translate(tx, wob + ground); c.scale(1.35, 1.35); c.translate(0, -ground);
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
    c.save(); if (kStar > 1) { c.translate(cx, ground); c.scale(kStar, kStar); c.translate(-cx, -ground); }
    const id = (shot.filmMode ? null : shot.props?.[0]?.id) || b.motif;
    if (action === 'board' || id === 'taxi') {
      const tx = cx + 140;
      K.poly([[tx - 150, ground - 115], [tx - 75, ground - 115], [tx - 35, ground - 180], [tx + 85, ground - 180], [tx + 125, ground - 115], [tx + 185, ground - 105], [tx + 185, ground - 25], [tx - 150, ground - 25]], { f: 2, ft: .85, s: 1, lw: 6 });
      K.poly([[tx - 25, ground - 168], [tx + 70, ground - 168], [tx + 105, ground - 115], [tx - 55, ground - 115]], { f: -1, s: 1, lw: 4 });
      for (const dx of [-85, 125]) { K.circ(tx + dx, ground - 25, 28, { f: 1, s: 1, lw: 5 }); K.circ(tx + dx, ground - 25, 11, { f: -1, s: 1, lw: 3 }); }
      K.rect(tx + 5, ground - 200, 48, 20, { f: -1, s: 1, lw: 3 });
      if (state.taxi > .85) K.circ(tx, ground - 140, 16, { f: -1, s: 1, lw: 3 });
    } else if (id === 'foto_rota') {
      const px = leftP + 45, py = ground - 158, split = state.photo * 22;
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
      const transfer = state.letter, px = mix(leftP + pose.handX, right - 80, transfer);
      K.rect(px - 22, ground - 177, 44, 31, { f: -1, s: 1, lw: 3 });
      K.line(px - 22, ground - 177, px, ground - 160, 1, 2); K.line(px, ground - 160, px + 22, ground - 177, 1, 2);
    } else if (id && !['puerta_entreabierta', 'taxi'].includes(id) && R.props.DEFS[id]) {
      const where = id === 'maleta_viaje' ? [leftP - 45, ground - 62, .3] : id === 'banco_vacio' ? [cx, ground - 60, .55] : [cx + (left - cx) / kStar, kStar > 1 ? 392 : 310, .45];
      const ease = R.easeOut(R.clamp(elapsed / .6)); R.props.drawProp(K, id, ...where, ease, { seed: shot.seed, ph: 0, rot: 0 });
    }
    c.restore();
    c.restore();
    if (!options.thumbnail) K.code(`${F.roles[b.section?.role] || 'verso'} · ${F.cameras[b.camera] || 'plano medio'}`, cx, 795, { align: 'center', size: 14 });
  };
})();
