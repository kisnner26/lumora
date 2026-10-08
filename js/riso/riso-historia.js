// historia: convierte la letra y la estructura de la canción en un hilo con principio y final.
// un protagonista que recorre lugares (el paisaje corre hasta que aparece el siguiente), una hora que avanza,
// un segundo personaje que llega, se abraza o se aleja, y una gramática de planos: presentar, seguir, acercar, despedir.
// todo se calcula del reloj de la canción: saltar a cualquier segundo da el mismo plano.
(() => {
  const R = window.RISO; if (!R) return;
  const hash = s => { let h = 2166136261; for (const c of String(s)) h = Math.imul(h ^ c.charCodeAt(0), 16777619); return h >>> 0; };
  const norm = s => String(s || '').toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/[^a-z0-9' ]/g, ' ').replace(/\s+/g, ' ').trim();
  const word = list => new RegExp('\\b(?:' + list + ')\\b');
  const SCENE_BIOME = { calle: 'ciudad', club: 'ciudad', escenario: 'ciudad', azotea: 'ciudad', estadio: 'ciudad', ciudadHeroe: 'ciudad', sistema: 'ciudad', red: 'ciudad', corriente: 'ciudad', oficina: 'ciudad', ciudad: 'ciudad', tunel: 'ciudad',
    playa: 'costa', campo: 'bosque', bosque: 'bosque', cielo: 'espacio', espacio: 'espacio', nebulosa: 'espacio', deriva: 'espacio', orbitas: 'espacio', aurora: 'espacio', mandala: 'espacio',
    habitacion: 'cuarto', cuarto: 'cuarto', retrato: 'cuarto', museo: 'cuarto', horizonte: 'desierto' };
  const ATMOS_WEATHER = { rain: 'lluvia', ventana_lluvia: 'lluvia', snow: 'nieve', fire: 'fuego', fireworks: 'fuego', thunder: 'tormenta', smoke: 'niebla', leaves: 'viento' };
  const FALL = ['ciudad', 'costa', 'bosque', 'desierto', 'espacio'];
  const SPEED = { walk: 150, run: 420, drive: 520, journey: 420 };
  const WALK_IN = 3.4, SEAM_OFFSET = 700;
  // el otro: llega, se abraza o se aleja según lo que dice cada verso
  const TOGETHER = word('together|we|us|our|juntos|juntas|nosotros|nosotras|nuestro|nuestra|stay with me|quedate'), HUG = word('hold|hug|embrace|kiss|abrazo|abrazar|abrazame|besar|beso|besame|mi vida|te quiero|love you|te amo'),
    APART = word('miss|alone|without you|gone|left|goodbye|lost|apart|sin ti|solo|sola|adios|te fuiste|me dejaste|lejos|olvidar|forget|ghost|empty|vacio'), YOU = word('you|your|baby|girl|boy|tu|ti|te|ella|el|amor|mi amor|cielo');

  const S = R.story = {
    key: '', data: null,
    // lines: [{t,text}], film: {sections,beats} de R.film.plan, plans: planes por bloque de Claude (opcional), duration en segundos
    compile(lines, film, plans = [], duration = 0, songKey = '') {
      const A = R.atmos, rows = A ? A.plan(lines) : [], beats = film.beats, sections = film.sections, seed = hash(songKey || 'lumora');
      const end = Math.max(duration || 0, (lines.at(-1)?.t || 0) + 6, 1);
      // ---- por sección: lugar, hora y clima con arco ----
      const mode = arr => { const m = new Map(); for (const v of arr) if (v) m.set(v, (m.get(v) || 0) + 1); return [...m.entries()].sort((a, b) => b[1] - a[1])[0]?.[0] || null; };
      const secs = sections.map((sec, k) => {
        const idx = lines.map((l, i) => [l, i]).filter(([l, i]) => rows[i] && l.t >= sec.start && l.t < sec.end).map(([, i]) => i), plan = plans[k] || {};
        const mid = ((sec.start + sec.end) / 2) / end, energy = sec.energy ?? 5, sad = beats.filter(b => b && lines[b.li]?.t >= sec.start && lines[b.li]?.t < sec.end && ['melancolico', 'triste', 'oscuro', 'nostalgico'].includes(b.mood)).length > idx.length / 2;
        let place = mode(idx.map(i => rows[i].place)) || SCENE_BIOME[plan.scene] || null;
        let time = mode(idx.map(i => rows[i].time)) || (['amanecer', 'dia', 'atardecer', 'noche'].includes(plan.time) ? plan.time : plan.time === 'madrugada' ? 'noche' : null);
        if (!time) time = energy >= 7 ? (mid < .5 ? 'dia' : mid < .8 ? 'atardecer' : 'noche') : mid < .22 ? 'atardecer' : mid < .8 ? 'noche' : sad ? 'noche' : 'amanecer';
        let weather = mode(idx.map(i => rows[i].weather)) || ATMOS_WEATHER[plan.atmos] || (sad && ['bridge', 'climax'].includes(sec.role) ? 'lluvia' : sad && sec.role === 'outro' ? 'niebla' : sec.role === 'climax' && energy >= 8 ? 'viento' : null);
        return { k, sec, place, time, weather, energy, sad };
      });
      // un lugar nuevo en cada tramo, sin repetir seguido; los interiores solo si la letra los pide
      secs.forEach((s, k) => { const prev = secs[k - 1]?.place; if (!s.place) { let p = FALL[(seed + k * 2) % FALL.length]; if (p === prev) p = FALL[(seed + k * 2 + 1) % FALL.length]; s.place = p; } });
      // ---- por verso: acción, otro personaje y plano ----
      let partner = 'absent', pLeft = 0, seenYou = false;
      const per = {}, last = beats.filter(Boolean).at(-1)?.li;
      for (const b of beats) {
        if (!b) continue; const li = b.li, text = norm(lines[li]?.text), sec = secs.find(s => lines[li].t >= s.sec.start && lines[li].t < s.sec.end) || secs.at(-1), row = rows[li] || {};
        if (TOGETHER.test(text) || HUG.test(text)) { partner = HUG.test(text) && sec.energy >= 4 ? 'embrace' : 'with'; pLeft = 3; seenYou = true; }
        else if (APART.test(text)) { partner = 'apart'; pLeft = 3; seenYou = true; }
        else if (YOU.test(text)) { if (partner === 'absent') partner = 'near'; pLeft = Math.max(pLeft, 2); seenYou = true; }
        else if (pLeft > 0) pLeft--; else if (partner !== 'absent') partner = partner === 'apart' ? 'absent' : 'absent';
        const role = sec.sec.role, first = lines.findIndex(l => l.t >= sec.sec.start) === li || beats.filter(x => x && lines[x.li].t >= sec.sec.start && lines[x.li].t < sec.sec.end)[0]?.li === li;
        const last_ = beats.filter(x => x && lines[x.li].t >= sec.sec.start && lines[x.li].t < sec.sec.end).at(-1)?.li === li;
        const roleAct = { intro: 'walk', verse: li % 2 ? 'walk' : 'sing', chorus: sec.energy >= 6 ? 'dance' : 'sing', bridge: 'look', climax: 'dance', outro: 'walk' }[role] || 'sing';
        const act = row.act === 'cry' ? 'look' : row.act === 'sleep' ? null : row.act || roleAct;
        const hugNow = HUG.test(text) && partner === 'embrace', embrace = partner === 'embrace' && sec.place !== 'espacio';
        const shot = li === last ? 'pull' : first && (sec.k === 0 || secs[sec.k - 1]?.place !== sec.place) ? 'establishing' : embrace ? 'close' : role === 'climax' ? (li % 2 ? 'close' : 'wide') : last_ && role !== 'outro' ? 'push' : role === 'chorus' && li % 2 ? 'close' : 'medium';
        per[li] = { k: sec.k, place: sec.place, time: sec.time, weather: row.weather || sec.weather, act: hugNow && sec.place !== 'espacio' ? 'hug' : act, partner: seenYou || partner !== 'absent' ? partner : 'absent', shot, role, first, energy: sec.energy };
      }
      // ---- el camino: el paisaje corre con la acción; al empezar un tramo nuevo, el protagonista camina hasta que aparece el siguiente lugar ----
      const times = new Set([0]), segs = [];
      const bt = beats.filter(Boolean).map(b => ({ li: b.li, t: lines[b.li].t, p: per[b.li] })).sort((a, b) => a.t - b.t);
      for (const b of bt) times.add(b.t); const windows = [];
      secs.forEach((s, k) => { if (k === 0) return; const prev = secs[k - 1]; if (s.place !== prev.place && s.place !== 'cuarto' && prev.place !== 'cuarto') { windows.push({ k, a: s.sec.start, b: s.sec.start + WALK_IN }); times.add(s.sec.start); times.add(s.sec.start + WALK_IN); } });
      times.add(end); const ts = [...times].filter(t => t >= 0 && t <= end).sort((a, b) => a - b); let acc = 0;
      for (let i = 0; i < ts.length - 1; i++) {
        const t0 = ts[i], t1 = ts[i + 1], bi = bt.findLastIndex(b => b.t <= t0), act = bi >= 0 ? bt[bi].p.act : 'walk', forced = windows.find(w => t0 >= w.a && t0 < w.b);
        const v = forced ? SPEED.journey : (SPEED[act] || 0) * (bi < 0 ? 1 : 1); segs.push({ t0, t1, v, acc }); acc += v * (t1 - t0);
      }
      const seams = windows.map(w => ({ k: w.k, t: w.a, from: secs[w.k - 1].place, to: secs[w.k].place })).map(m => { const u = scrollIn(segs, m.t) + SEAM_OFFSET; return { ...m, u }; });
      return { secs, per, segs, seams, end, forced: windows };
    },
    plan(lines, film, plans, duration, songKey) {
      const key = JSON.stringify([songKey, lines.map(l => [l.t, l.text]), film.sections.map(s => [s.start, s.end, s.role]), duration, (plans || []).map(p => p && [p.scene, p.time, p.atmos])]);
      if (key !== this.key) { this.data = this.compile(lines, film, plans || [], duration, songKey); this.key = key; }
      return this.data;
    },
    at(li) { return this.data?.per[li] || null; },
    // desplazamiento acumulado del paisaje en el segundo «t»: determinista, igual al saltar o repetir
    scroll(t) { return this.data ? scrollIn(this.data.segs, t) : 0; },
    // qué lugar ve cada parte de la pantalla: un único tramo, o el cruce entre el anterior y el nuevo
    view(t) {
      const d = this.data; if (!d) return null; const sec = d.secs.filter(s => s.sec.start <= t).at(-1) || d.secs[0], sc = scrollIn(d.segs, t);
      const seam = d.seams.filter(m => m.t <= t).at(-1); if (seam && sc - seam.u < SEAM_OFFSET && seam.k === sec.k) return { place: sec.place, seam: { u: seam.u, from: seam.from, to: seam.to }, scroll: sc };
      return { place: sec.place, scroll: sc };
    },
  };
  function scrollIn(segs, t) {
    if (!segs.length) return 0; if (t <= segs[0].t0) return segs[0].acc * 0 + segs[0].v * Math.min(0, t - segs[0].t0);
    let lo = 0, hi = segs.length - 1; while (lo < hi) { const m = (lo + hi + 1) >> 1; if (segs[m].t0 <= t) lo = m; else hi = m - 1; }
    const s = segs[lo]; return s.acc + s.v * (Math.min(t, s.t1) - s.t0) + (t > s.t1 ? 0 : 0);
  }
})();
