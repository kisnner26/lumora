// ============================================================
// riso-cantantes.js — los artistas del catálogo salen cantando en el videoclip.
// Si quien suena es uno de los músicos del catálogo de famosos (Shakira, Bad Bunny, Queen, Los Beatles…), el
// clip intercala tomas «cantante»: una figura de trazo con micrófono, sin rostro ni parecido real (solo su
// emblema en una medalla y su nombre en una etiqueta). The Weeknd usa una figura escénica propia. En una colaboración salen todos los créditos (hasta 3)
// y el micrófono se «pasa» de uno a otro verso a verso; los que no están en el catálogo salen como figura
// genérica con su nombre. No es detección de voz: el turno va por orden de versos, y así se declara.
// ============================================================
(() => {
  const R = window.RISO; if (!R || !R.catalog) return;
  const K = R.K, clamp = R.clamp, easeOut = R.easeOut, TAU = Math.PI * 2, sin = Math.sin, cos = Math.cos;
  const SG = R.singers = {};
  const norm = s => String(s || '').toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/\s+/g, ' ').trim();
  const hash = s => { let h = 2166136261; for (const c of String(s)) h = Math.imul(h ^ c.charCodeAt(0), 16777619); return h >>> 0; };
  // quién es quién: nombre del artista (sin tildes) → dibujo del catálogo
  const MAP = [['michael_jackson', /michael jackson|^mj$/], ['elvis', /elvis/], ['bob_marley', /marley/], ['beatles', /beatles/], ['freddie_mercury', /^queen$|freddie mercury/], ['david_bowie', /bowie/], ['kurt_cobain', /nirvana|kurt cobain/],
    ['jimi_hendrix', /hendrix/], ['bad_bunny', /bad bunny/], ['the_weeknd', /^(?:the )?weeknd$|^abel tesfaye$/], ['shakira', /shakira/], ['selena', /^selena( quintanilla)?$/], ['celia_cruz', /celia cruz/], ['luis_miguel', /luis miguel/], ['beyonce', /beyonc/], ['rihanna', /rihanna/],
    ['taylor_swift', /taylor swift/], ['eminem', /eminem/], ['tupac', /tupac|2pac/], ['daddy_yankee', /daddy yankee/], ['adele', /^adele$/], ['amy_winehouse', /winehouse/], ['madonna', /^madonna$/], ['juanes', /^juanes$/]];
  SG.ids = MAP.map(m => m[0]);
  SG.idOf = part => { const t = norm(part); for (const [id, rx] of MAP) if (rx.test(t) && R.props.DEFS[id]) return id; return null; };
  // créditos: «A, B & C», «A feat. B», «A x B», «A con B» y los «(feat. X)» del título
  SG.credits = (artist, title) => {
    const feat = (String(title || '').match(/[\(\[]\s*(?:feat|ft|with|con)\.?\s+([^)\]]+)[\)\]]/i) || [])[1] || '';
    const parts = (String(artist || '') + ',' + feat).split(/\s*(?:,|&|\by\b|\bfeat\.?|\bft\.?|\bfeaturing\b|\bcon\b|\bwith\b|\bx\b|;|\/)\s*/i).map(s => s.trim()).filter(Boolean);
    const out = [], seen = new Set(); for (const p of parts) { const k = norm(p); if (!k || seen.has(k) || k.length > 40) continue; seen.add(k); out.push({ name: p, id: SG.idOf(p) }); }
    return out;
  };
  // devuelve los cantantes a dibujar (hasta 3) o null si ninguno de los créditos está en el catálogo
  SG.plan = (artist, title) => { const c = SG.credits(artist, title); if (!c.some(x => x.id)) return null; return c.sort((a, b) => (b.id ? 1 : 0) - (a.id ? 1 : 0)).slice(0, 3).map(x => ({ ...x, h: hash(x.name) })); };

  // ---------- dibujo ----------
  const HAIR = ['cap', 'long', 'bun', 'spiky', 'bald'];
  function person(x, y, k, o) {
    const { h, fill, open, sway, arm, active, name } = o, hair = HAIR[h % 5], side = (h >> 3) % 2 ? 1 : -1, bob = sin(K.t * 2 + h) * 3 * k, top = y - 470 * k;
    K.c.save(); K.c.translate(x, 0); K.c.rotate(sway * .02); K.c.translate(-x, 0);
    K.c.beginPath(); K.c.ellipse(x, y + 6, 120 * k, 16 * k, 0, 0, TAU); K.paint({ f: 1, ft: .35 });
    K.poly([[x - 34 * k, y - 210 * k], [x - 26 * k, y], [x - 4 * k, y], [x - 2 * k, y - 210 * k]], { f: 1, ft: .85, s: 1, lw: 7 }); K.poly([[x + 2 * k, y - 210 * k], [x + 4 * k, y], [x + 26 * k, y], [x + 34 * k, y - 210 * k]], { f: 1, ft: .85, s: 1, lw: 7 });
    K.poly([[x - 28 * k, y - 195 * k], [x - 62 * k, y - 350 * k + bob], [x + 62 * k, y - 350 * k + bob], [x + 28 * k, y - 195 * k]], { f: fill, ft: .85, s: 1, lw: 8 });
    K.line(x, y - 330 * k + bob, x, y - 215 * k, 1, 5, .7);
    // brazo lejano: cuelga o se levanta con la energía
    const up = arm; K.line(x - 60 * k, y - 340 * k + bob, x - 100 * k, y - (up ? 470 : 250) * k + bob, 1, 10 * k + 3); K.circ(x - 100 * k, y - (up ? 478 : 240) * k + bob, 11 * k, { f: -1, s: 1, lw: 5 });
    // cabeza sin rostro: solo ojos cerrados y la boca que canta
    const hy = top + 34 * k + bob; K.rect(x - 10 * k, y - 392 * k + bob, 20 * k, 40 * k, { f: -1, s: 1, lw: 5 });
    if (hair === 'long') { K.poly([[x - 56 * k, hy - 10 * k], [x - 66 * k, hy + 120 * k], [x - 30 * k, hy + 100 * k]], { f: 1, ft: .9, s: 1, lw: 5 }); K.poly([[x + 56 * k, hy - 10 * k], [x + 66 * k, hy + 120 * k], [x + 30 * k, hy + 100 * k]], { f: 1, ft: .9, s: 1, lw: 5 }); }
    K.circ(x, hy + 20 * k, 54 * k, { f: -1, s: 1, lw: 8 });
    if (hair === 'cap') K.poly([[x - 58 * k, hy + 6 * k], [x, hy - 52 * k], [x + 58 * k, hy + 6 * k], [x + 90 * k * -side, hy + 8 * k]], { f: fill === 1 ? 2 : 1, ft: .9, s: 1, lw: 6 });
    else if (hair === 'bun') { K.circ(x, hy - 62 * k, 24 * k, { f: 1, ft: .9, s: 1, lw: 6 }); K.poly([[x - 52 * k, hy + 4 * k], [x, hy - 46 * k], [x + 52 * k, hy + 4 * k]], { f: 1, ft: .9, s: 1, lw: 5 }); }
    else if (hair === 'spiky') for (let i = -3; i <= 3; i++) K.poly([[x + i * 15 * k - 10 * k, hy - 26 * k], [x + i * 15 * k, hy - 78 * k - (i % 2) * 14 * k], [x + i * 15 * k + 10 * k, hy - 26 * k]], { f: 1, ft: .9, s: 1, lw: 5 });
    else if (hair === 'long') K.poly([[x - 56 * k, hy + 14 * k], [x, hy - 52 * k], [x + 56 * k, hy + 14 * k]], { f: 1, ft: .9, s: 1, lw: 6 });
    K.c.beginPath(); K.c.arc(x - 20 * k, hy + 14 * k, 9 * k, Math.PI * 1.1, Math.PI * 1.9); K.paint({ s: 1, lw: 4 }); K.c.beginPath(); K.c.arc(x + 20 * k, hy + 14 * k, 9 * k, Math.PI * 1.1, Math.PI * 1.9); K.paint({ s: 1, lw: 4 });
    K.c.beginPath(); K.c.ellipse(x, hy + 44 * k, (14 + open * 8) * k, (3 + open * 15) * k, 0, 0, TAU); K.paint({ f: 1, ft: .95, s: 1, lw: 4 });
    // brazo con micrófono, a la boca
    const hx = x + 16 * k * side, hyy = hy + 52 * k; K.poly([[x + 55 * k * side, y - 340 * k + bob], [x + 96 * k * side, y - 250 * k + bob], [hx + 20 * k * side, hyy + 18 * k]], { s: 1, lw: 11 * k + 3 }, false); K.circ(hx + 20 * k * side, hyy + 10 * k, 12 * k, { f: -1, s: 1, lw: 5 });
    K.line(hx + 20 * k * side, hyy + 10 * k, hx + 6 * k * side, hyy - 10 * k, 1, 9 * k + 3); K.circ(hx + 2 * k * side, hyy - 14 * k, 14 * k, { f: 2, ft: .95, s: 1, lw: 5 }); K.circ(hx + 2 * k * side, hyy - 14 * k, 6 * k, { f: -1, s: 0 });
    if (active) for (let i = 0; i < 3; i++) { const r = (30 + i * 26 + (K.t * 40 + i * 20) % 26) * k; K.c.beginPath(); K.c.arc(hx + 2 * k * side, hyy - 14 * k, r, side > 0 ? -.9 : Math.PI - .9 + .0, side > 0 ? .9 : Math.PI + .9); K.paint({ s: 1, lw: 4, i: 2, st: .7 }); }
    K.c.restore();
    return { hx, hy };
  }
  SG.draw = (s, kt, time, age, dur) => {
    const list = s.singers || [], n = list.length, v = K.v, cx = s.flip ? 470 : 1130, xs = n === 1 ? [cx] : n === 2 ? [cx - 185, cx + 185] : [cx - 280, cx, cx + 280], k = n === 1 ? 1.12 : n === 2 ? .95 : .78, ground = 760;
    const p = easeOut(clamp(kt / .6)), act = s.text ? (s.text.li >= 0 ? s.text.li : 0) % n : -1, line = s.text && age >= 0 && age < dur;
    list.forEach((sg, i) => {
      const active = i === act && !!line, open = active ? clamp(.25 + .75 * Math.abs(sin(kt * 9 + i)) + R.A.beat * .3) : 0, y = ground + (1 - p) * 420, x = xs[i];
      if (active && n > 1) { K.poly([[x, 40], [x - 150 * k, y], [x + 150 * k, y]], { f: 2, ft: .18 }); }
      if (sg.id === 'the_weeknd') {
        // la figura completa sustituye al cantante genérico; conserva entrada y ritmo.
        R.props.drawProp(K, sg.id, x, y - 240 * k, 1.24 * k, 1, { seed: s.seed + i, ph: sg.h % 6, rot: sin(kt * 1.6 + i * 2) * (active ? .018 : .008) });
      } else person(x, y, k, { h: sg.h, fill: [2, 3, 1][i % 3], open, sway: sin(kt * 1.6 + i * 2) * (active ? 1.4 : .6), arm: R.A.e > .55 && !!line && active, active, name: sg.name });
      // etiqueta con el nombre y medalla con el emblema
      K.c.save(); K.c.translate(x, ground + 52); K.c.rotate((i % 2 ? .012 : -.012));
      const nm = sg.name.toUpperCase().slice(0, 26), w = Math.min(330, K.measure(nm, { font: 'display', size: 34 * Math.min(1, k + .1), w: 800, stretch: 'condensed' }) + 40);
      K.rect(-w / 2 + 6, 6, w, 46, { f: 1, ft: .3, over: true }); K.rect(-w / 2, 0, w, 46, { f: -1, s: 1, lw: 3.5 }); K.txt(nm, 0, 35, { font: 'display', size: 34 * Math.min(1, k + .1), w: 800, stretch: 'condensed', align: 'center', i: active ? 2 : 1 }); K.c.restore();
      if (sg.id && sg.id !== 'the_weeknd') { const mx = n === 1 ? x + (s.flip ? 250 : -250) : x, my = n === 1 ? 300 : 120, rr = (n === 1 ? 104 : 74) * Math.min(1, k + .15); K.circ(mx, my, rr, { f: -1, s: 1, lw: 6 }); K.circ(mx, my, rr, { f: 3, ft: .3 });
        R.props.drawProp(K, sg.id, mx, my, rr / 92 * .5, easeOut(clamp((kt - .3) / 1)), { seed: s.seed + i, ph: sg.h % 6, rot: 0 }); K.tape(mx - 40, my - rr, 80, 26, -.4); }
    });
    K.code(n > 1 ? `DÚO · ${n} VOCES · EL MICRÓFONO PASA VERSO A VERSO` : 'EN EL MICRÓFONO', (s.flip ? v.r - 60 : v.l + 60) + (s.flip ? 0 : 0), 815, { align: s.flip ? 'right' : 'left', size: 14, bg: true });
  };
  if (window.SETUI) SETUI.addRow('contenido', ['singers', 'Artistas cantando', 'sw', null, 'si suena un artista del catálogo de famosos (o una colaboración) salen tomas con su figura cantando al micrófono; en los dúos el micrófono pasa de verso en verso'], true);
})();
