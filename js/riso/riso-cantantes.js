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
  SG.plan = (artist, title) => { const c = SG.credits(artist, title); if (!c.length) return null; return c.sort((a, b) => (b.id ? 1 : 0) - (a.id ? 1 : 0)).slice(0, 3).map(x => ({ ...x, h: hash(x.name) })); };

  // ---------- dibujo ----------
  SG.draw = (s, kt, time, age, dur) => {
    const list = s.singers || [], n = list.length, v = K.v, cx = s.flip ? 470 : 1130, xs = n === 1 ? [cx] : n === 2 ? [cx - 185, cx + 185] : [cx - 280, cx, cx + 280], k = n === 1 ? 1.12 : n === 2 ? .95 : .78, ground = 760;
    const p = easeOut(clamp(kt / .6)), act = s.text ? (s.text.li >= 0 ? s.text.li : 0) % n : -1, line = s.text && age >= 0 && age < dur;
    list.forEach((sg, i) => {
      const active = i === act && !!line, open = active ? clamp(.25 + .75 * Math.abs(sin(kt * 9 + i)) + R.A.beat * .3) : 0, y = ground + (1 - p) * 420, x = xs[i];
      if (active && n > 1) { K.poly([[x, 40], [x - 150 * k, y], [x + 150 * k, y]], { f: 2, ft: .18 }); }
      if (sg.id === 'the_weeknd') {
        // la figura completa sustituye al cantante genérico; conserva entrada y ritmo.
        R.props.drawProp(K, sg.id, x, y - 240 * k, 1.24 * k, 1, { seed: s.seed + i, ph: sg.h % 6, rot: sin(kt * 1.6 + i * 2) * (active ? .018 : .008) });
      } else R.artistFigures.draw(K, sg.name, sg.id, x, y, k, { time: kt + i * 2, active, open });
      // etiqueta con el nombre
      K.c.save(); K.c.translate(x, ground + 52); K.c.rotate((i % 2 ? .012 : -.012));
      const nm = sg.name.toUpperCase().slice(0, 26), w = Math.min(330, K.measure(nm, { font: 'display', size: 34 * Math.min(1, k + .1), w: 800, stretch: 'condensed' }) + 40);
      K.rect(-w / 2 + 6, 6, w, 46, { f: 1, ft: .3, over: true }); K.rect(-w / 2, 0, w, 46, { f: -1, s: 1, lw: 3.5 }); K.txt(nm, 0, 35, { font: 'display', size: 34 * Math.min(1, k + .1), w: 800, stretch: 'condensed', align: 'center', i: active ? 2 : 1 }); K.c.restore();
    });
    K.code(n > 1 ? `DÚO · ${n} VOCES · EL MICRÓFONO PASA VERSO A VERSO` : 'EN EL MICRÓFONO', (s.flip ? v.r - 60 : v.l + 60) + (s.flip ? 0 : 0), 815, { align: s.flip ? 'right' : 'left', size: 14, bg: true });
  };
  if (window.SETUI) SETUI.addRow('contenido', ['singers', 'Artistas cantando', 'sw', null, 'retratos procedurales con rasgos propios para los artistas conocidos y una figura estable para los demás; en los dúos el turno pasa de verso en verso'], true);
})();
