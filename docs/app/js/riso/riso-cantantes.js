// artistas con identidad visual estable; los perfiles animan caras, ropa y accesorios.
(() => {
  const R = window.RISO; if (!R || !R.catalog) return;
  const K = R.K, clamp = R.clamp, easeOut = R.easeOut, sin = Math.sin;
  const SG = R.singers = {};
  const norm = s => String(s || '').toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/\s+/g, ' ').trim();
  const hash = s => { let h = 2166136261; for (const c of String(s)) h = Math.imul(h ^ c.charCodeAt(0), 16777619); return h >>> 0; };
  SG.ids = Object.keys(R.artistFigures.profiles);
  SG.idOf = part => R.artistFigures.idOf(part);
  // créditos: «A, B & C», «A feat. B», «A x B», «A con B» y los «(feat. X)» del título
  SG.credits = (artist, title) => {
    const feat = (String(title || '').match(/[\(\[]\s*(?:feat|ft|with|con)\.?\s+([^)\]]+)[\)\]]/i) || [])[1] || '';
    const parts = (String(artist || '') + ',' + feat).split(/\s*(?:,|&|\by\b|\bfeat\.?|\bft\.?|\bfeaturing\b|\bcon\b|\bwith\b|\bx\b|;|\/)\s*/i).map(s => s.trim()).filter(Boolean);
    const out = [], seen = new Set(); for (const p of parts) { const id = SG.idOf(p), k = id || norm(p); if (!k || seen.has(k) || p.length > 80) continue; seen.add(k); out.push({ name: p, id }); }
    return out;
  };
  // devuelve hasta tres voces; los nombres desconocidos mantienen un avatar estable
  SG.bands = {
    'twenty one pilots': ['tyler_joseph', 'josh_dun'], 'twenty øne piløts': ['tyler_joseph', 'josh_dun'], twentyonepilots: ['tyler_joseph', 'josh_dun'],
    queen: ['freddie_mercury', 'brian_may', 'roger_taylor', 'john_deacon'], nirvana: ['kurt_cobain', 'dave_grohl', 'krist_novoselic'],
    'the beatles': ['john_lennon', 'paul_mccartney', 'george_harrison', 'ringo_starr'], beatles: ['john_lennon', 'paul_mccartney', 'george_harrison', 'ringo_starr']
  };
  SG.plan = (artist, title) => {
    const c = SG.credits(artist, title); if (!c.length) return null;
    const band = SG.bands[norm(artist)];
    if (band && c.length === 1) return band.map(id => { const name = R.artistFigures.profiles[id].names[0]; return { name, id, h: hash(name), band: true, instrument: R.artistFigures.profiles[id].instrument }; });
    return c.sort((a, b) => (b.id ? 1 : 0) - (a.id ? 1 : 0)).slice(0, 3).map(x => ({ ...x, h: hash(x.name) }));
  };

  // ---------- dibujo ----------
  SG.draw = (s, kt, time, age, dur) => {
    const list = (s.singers || []).filter(sg => window.CFG?.faces === false || R.artistFigures.hasFace(sg.name)), n = list.length; if (!n) return;
    const v = K.v, cx = s.flip ? 470 : 1130, xs = n === 1 ? [cx] : n === 2 ? [cx - 185, cx + 185] : n === 3 ? [cx - 230, cx, cx + 230] : [cx - 270, cx - 90, cx + 90, cx + 270], k = n === 1 ? 1.12 : n === 2 ? .90 : n === 3 ? .68 : .53, ground = 760;
    // quién canta este verso: lo dice el reparto buscado en la web; si no se sabe, nadie se destaca (no se reparte por turnos)
    const who = s.text && R.voices && n > 1 ? R.voices.singerAt(s.text.li) : null, known = !!who, act = who && who !== 'varios' ? list.findIndex(sg => norm(sg.name) === norm(who.name)) : -1;
    const p = easeOut(clamp(kt / .6)), line = s.text && age >= 0 && age < dur;
    // escenario: el mundo del lugar de la letra, con público si la canción es de fiesta; el artista actúa según lo que dice y la energía
    const AT = R.atmos, e = R.A?.e || 0, at = AT?.at(s.text?.li ?? 0) || {}, FALL = ['ciudad', 'costa', 'bosque', 'desierto', 'espacio'];
    const place = at.place || FALL[(s.seed >>> 0) % FALL.length], bpm = Math.max(70, Math.min(180, (typeof IN !== 'undefined' && IN.bpm) || 110));
    const move = at.act === 'dance' || e > .66 ? 'dance' : at.act === 'run' || at.act === 'walk' ? 'walk' : at.act === 'cry' || at.act === 'sleep' ? 'look' : (s.text?.li ?? 0) % 3 === 1 ? 'walk' : null;
    if (AT && R.world?.enabled) {
      const reduced = !!window.CFG?.reduceMotion;
      AT.backdrop(K, { place, at, now: time, beat: R.A?.beat || 0, ground, view: { drift: reduced || move !== 'walk' ? 0 : Math.sin(time * .22) * 150, x: sin(time * .1) * 20, dolly: reduced ? 0 : sin(time * .3) * .03, punch: reduced ? 0 : (R.A?.beat || 0) * .02 } });
      if (move === 'dance' && place !== 'espacio') AT.crowd(K, time, R.A?.beat || 0, 1, ground);
    }
    list.forEach((sg, i) => {
      const active = (n === 1 || i === act || who === 'varios') && !!line, open = active ? clamp(.25 + .75 * Math.abs(sin(kt * 9 + i)) + R.A.beat * .3) : 0, y = ground + (1 - p) * 420, x = xs[i];
      if (active && n > 1 && known && who !== 'varios') { K.poly([[x, 40], [x - 150 * k, y], [x + 150 * k, y]], { f: 2, ft: .18 }); }
      if (sg.id === 'the_weeknd' && !R.artistFigures.faceOf(sg.name)) {
        // la figura completa sustituye al cantante genérico; conserva entrada y ritmo.
        R.props.drawProp(K, sg.id, x, y - 240 * k, 1.24 * k, 1, { seed: s.seed + i, ph: sg.h % 6, rot: sin(kt * 1.6 + i * 2) * (active ? .018 : .008) });
      } else R.artistFigures.draw(K, sg.name, sg.id, x, y, k, { time: kt + i * 2, active: sg.band ? !!line : active, open: sg.instrument === 'drums' ? 0 : open, dim: known && !active && n > 1, spot: known && who !== 'varios' && active && n > 1, key: sg.name, instrument: sg.instrument, bpm, act: sg.instrument ? null : move === 'look' ? null : move, back: false, album: typeof ext !== 'undefined' ? ext.st.album || '' : '' });
      // etiqueta con el nombre
      K.c.save(); K.c.translate(x, ground + 52); K.c.rotate((i % 2 ? .012 : -.012));
      const nm = sg.name.toUpperCase().slice(0, 26), w = Math.min(330, K.measure(nm, { font: 'display', size: 34 * Math.min(1, k + .1), w: 800, stretch: 'condensed' }) + 40);
      K.rect(-w / 2 + 6, 6, w, 46, { f: 1, ft: .3, over: true }); K.rect(-w / 2, 0, w, 46, { f: -1, s: 1, lw: 3.5 }); K.txt(nm, 0, 35, { font: 'display', size: 34 * Math.min(1, k + .1), w: 800, stretch: 'condensed', align: 'center', i: active ? 2 : 1 }); K.c.restore();
    });
    K.code(list.some(sg => sg.band) ? `banda · ${n} integrantes` : n > 1 ? `colaboración · ${n} artistas · puesta en escena` : 'en escena', (s.flip ? v.r - 60 : v.l + 60) + (s.flip ? 0 : 0), 815, { align: s.flip ? 'right' : 'left', size: 14, bg: true });
  };
  if (window.SETUI) SETUI.addRow('contenido', ['singers', 'Artistas cantando', 'sw', null, 'retratos procedurales con rasgos propios para los artistas conocidos y una figura estable para los demás; en los dúos el turno pasa de verso en verso'], true);
})();
