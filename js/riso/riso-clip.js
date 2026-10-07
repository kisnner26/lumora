// ============================================================
// riso-clip.js — el videoclip en risografía: un motor de video propio.
//
// Funciona como el lyric video de siempre (mismo reloj, letra sincronizada, guion
// del director por estrofa y por verso, traducción, grabación) pero en vez de
// escenarios de partículas dirige TOMAS ilustradas, como un clip hecho a mano:
//   · objeto: el objeto que dice el verso (sol, flor, corazón, teléfono...) se DIBUJA
//     solo con trazo tembloroso, y la letra escribe a mano con la palabra clave en tinta
//   · escena: una de las escenas completas (oficina, cuarto, ciudad, espacio, bosque,
//     retrato, museo) con paneos y zoom, y la letra en una etiqueta de papel
//   · gigante: la palabra clave a todo el cuadro, sobreimpresa y mal registrada
//   · título / cierre: portada de la canción en trama, título y artista
// Entre toma y toma hay CORTES CON MOVIMIENTO (nunca fundidos). Encima de todo va la
// capa de anotaciones con datos reales de la canción: tiempo, tempo, energía, verso,
// estrofa, sello «en vivo», post-its con de qué trata, circuitos y medidores.
// Todo procedural, en tiempo real, con las tintas de la escena según el ánimo.
// ============================================================
(() => {
  if (!window.RISO || typeof GENS === 'undefined') return;
  const R = RISO, st = R.stage, K = R.K, { nz, clamp, lerp, ease, easeOut } = R, TAU = Math.PI * 2, sin = Math.sin, cos = Math.cos, PI = Math.PI;
  const hash = s => { let h = 2166136261; for (const c of String(s)) h = Math.imul(h ^ c.charCodeAt(0), 16777619); return h >>> 0; };
  const rngS = seed => R.rng(seed);
  const pad2 = n => String(Math.floor(n)).padStart(2, '0');
  const fmt = s => pad2(Math.max(0, s) / 60) + ':' + pad2(Math.max(0, s) % 60);
  const RC = window.RISOCLIP = { on: false, shot: null, prev: null, pending: null, lastKey: '', sceneState: {}, art: null, kindHist: [], id: 'clip' };

  // ---------- qué escena ilustrada corresponde a cada escenario del director ----------
  const SCENE_MAP = { calle: 'ciudad', azotea: 'ciudad', estadio: 'ciudad', club: 'ciudad', escenario: 'ciudad', corriente: 'ciudad', ciudadHeroe: 'ciudad', red: 'oficina', sistema: 'oficina',
    habitacion: 'cuarto', playa: 'bosque', campo: 'bosque', aurora: 'bosque', cielo: 'espacio', deriva: 'espacio', orbitas: 'espacio', nebulosa: 'espacio', horizonte: 'espacio', tunel: 'ciudad', mandala: 'retrato' };
  const MOOD_SCENE = { euforico: 'ciudad', feliz: 'bosque', romantico: 'cuarto', sereno: 'bosque', nostalgico: 'museo', melancolico: 'cuarto', triste: 'cuarto', oscuro: 'retrato', rabioso: 'ciudad', desafiante: 'oficina' };
  // combinaciones de tintas por ánimo (índices de RISO.INKS); cada estrofa rota entre las suyas
  const MOOD_INKS = { euforico: [1, 4, 0], feliz: [3, 0, 5], romantico: [2, 4, 1], sereno: [5, 2, 3], nostalgico: [5, 0, 3], melancolico: [0, 4, 5], triste: [4, 0, 2], oscuro: [3, 4, 1], rabioso: [1, 3, 4], desafiante: [0, 5, 1] };
  // objeto por defecto según el ánimo cuando el verso no nombra ninguno
  const MOOD_PROP = { euforico: ['fireworks', 'dance', 'stars'], feliz: ['sun', 'flowers', 'fly'], romantico: ['love', 'flowers', 'moon'], sereno: ['sea', 'moon', 'forest'], nostalgico: ['time', 'home', 'moon'],
    melancolico: ['rain', 'moon', 'home'], triste: ['tears', 'rain', 'dream'], oscuro: ['death', 'moon', 'smoke'], rabioso: ['fire', 'thunder', 'death'], desafiante: ['gold', 'city', 'fire'] };
  const PROP_OF = { beach: 'flowers', plane: 'fly', woman: 'dance', man: 'dance', couple: 'dance', crowd: 'dance', fashion: 'gold', dark: 'moon', road: 'road', sea: 'sea' };
  const hasProp = id => !!R.props.DEFS[id];

  // ---------- tomas ----------
  const meta = () => { const s = window.ext?.st || {}; return { title: (s.name || proc.title || '').replace(/\s*[\(\[](feat|ft|with)\.?[^)\]]*[\)\]]/i, '').trim() || 'sin título', artist: (s.artist || proc.artist || '').split(/,|&/)[0].trim(), album: s.album || '' }; };
  const timeNow = () => (ext.active() ? ext.now() : T);
  const lineIdx = time => { const lt = time + .2 + (IN.off || 0); let li = -1; for (let i = 0; i < IN.lines.length; i++) if (IN.lines[i].t <= lt) li = i; else break; if (li >= 0 && (!IN.lines[li].text || lt - IN.lines[li].t > 12)) li = -1; return li; };
  const secOf = time => IN.cuts.length > 1 ? Math.max(0, IN.cuts.findLastIndex(c => c <= time)) : Math.floor(time / (proc.secLen || 9));
  const storyOf = text => (typeof STORY !== 'undefined' && STORY.on && STORY.forText(text)) || null;
  const keyWord = (text, L) => { const w = (L?.word || (typeof salient === 'function' ? salient(text) : '') || '').replace(/[^\p{L}\p{N}'’-]/gu, ''); return w.toLowerCase(); };

  // la escena que piden las palabras del verso (y, si no hay, las de la estrofa)
  function sceneByWords(text, block, mood) {
    let best = null, bs = 0;
    for (const [id, rx] of Object.entries(R.SCENE_RX || {})) { if (!R.scenes[id]) continue; if (id === 'ella' && !['romantico', 'feliz', 'euforico', 'sereno', 'nostalgico'].includes(mood)) continue; const g = new RegExp(rx.source, 'gi'); const n = (text.match(g) || []).length * 2 + (block ? Math.min(2, (block.match(g) || []).length) * .5 : 0); if (n > bs) { bs = n; best = id; } }
    return bs >= 1.5 || (bs >= 1 && !text) ? best : null;
  }
  function makeShot(li, sec, time, why, force) {
    const plan = SEM.plans[sec] || null, text = li >= 0 ? IN.lines[li].text : '', L = text ? storyOf(text) : null, seed = hash(ext.key() + '|' + li + '|' + sec + '|' + Math.floor(time / 4) + (RC.salt || ''));
    const r = rngS(seed), mood = plan?.mood || 'sereno', energy = plan?.energy ?? 5, inkList = MOOD_INKS[mood] || [0, 1, 2];
    const shot = { kind: 'prop', li, sec, t0: timeNow(), k0: st.t, seed, plan, mood, energy, inks: inkList[(sec + (plan?.color === 'oscuro' ? 1 : 0)) % inkList.length], bg: 'paper', layout: 0, why };
    const own = typeof LEX !== 'undefined' && text ? LEX.filter(([, re]) => re.test(text)).map(q => q[0]) : [];
    const named = (R.people && text ? R.people.detect(text, 3) : []), rr0 = R.rng(seed ^ 0x9e37);
    const objs = [...new Set([...named, ...own, ...(L?.objects || []), ...(plan?.objects || [])])].map(id => PROP_OF[id] || id).filter(hasProp);
    const prev = RC.kindHist.slice(-2), blockTxt = IN.lines.filter(l => l.text && l.t >= (IN.cuts[sec] ?? 0) && l.t < (IN.cuts[sec + 1] ?? 1e9)).map(l => l.text).join(' ');
    const byWords = sceneByWords(text, blockTxt, mood), recent = RC.recentScenes || (RC.recentScenes = []), cfgOn = !window.CFG || CFG.singers !== false, singers = cfgOn && R.singers ? R.singers.plan(window.ext?.st?.artist, window.ext?.st?.name) : null;
    let kind;
    if (why === 'title') kind = 'title'; else if (why === 'outro') kind = 'outro';
    else if (li < 0) kind = singers && time > 5 && r() < .38 ? 'singer' : objs.length && r() < .5 ? 'prop' : 'scene';
    else if (named.length && r() < .92) kind = 'prop';                 // lo que el verso nombra (país, persona, objeto del catálogo) manda sobre la palabra gigante y las escenas
    else if (L?.big && keyWord(text, L)) kind = 'giant';
    else if (li >= 0 && singers && prev[1] !== 'singer' && r() < (energy >= 7 ? .7 : .5) + (RC.count ? 0 : .3)) kind = 'singer';        // retrato del artista que figura en los créditos
    else if (byWords && !recent.slice(-2).includes(byWords) && prev[1] !== 'scene' && r() < .8) kind = 'scene';
    else {
      const w = { prop: 1.7, scene: energy >= 7 ? .7 : .5 };
      if (prev[1] === 'prop') w.prop = .9; if (prev[1] === 'scene') w.scene = .15; if (prev[0] === 'giant') w.prop += .3;
      kind = r() * (w.prop + w.scene) < w.prop ? 'prop' : 'scene';
    }
    if (force) kind = force;
    shot.kind = kind; RC.kindHist.push(kind); if (RC.kindHist.length > 6) RC.kindHist.shift();
    shot.cut = energy >= 7 ? ['h', 'spin', 'v'][(r() * 3) | 0] : energy <= 3 ? ['zin', 'zout'][(r() * 2) | 0] : ['h', 'v', 'zin', 'zout'][(r() * 4) | 0];
    if (kind === 'prop') {
      const cm = (R.catalog?.moodProps[mood] || []).filter(hasProp), ids = objs.length ? [...new Set(objs)] : [...(MOOD_PROP[mood] || ['stars']), ...cm].filter(hasProp);
      shot.props = ids.slice(0, r() < .35 ? 3 : 1).map((id, i) => ({ id: R.catalog ? R.catalog.pickVariant(id, r) : id, i, ph: r() * 6, rot: (r() - .5) * .14 }));
      if (!objs.length) shot.props = [{ id: ids[(sec + (li < 0 ? 0 : li)) % ids.length], i: 0, ph: r() * 6, rot: (r() - .5) * .14 }];
      shot.bg = ['paper', 'panel', 'burst', 'grid', 'flood'][(r() * (energy >= 7 ? 5 : 4)) | 0]; if (energy < 7 && shot.bg === 'flood' ) shot.bg = 'grid';
      shot.layout = (r() * 3) | 0; shot.flip = r() < .5;
      const fl = shot.props.find(p => /^flag_/.test(p.id));                       // una bandera va sola y con sus tintas
      if (fl) { shot.props = [fl]; shot.inks = R.catalog.info[fl.id]?.inks ?? shot.inks; if (shot.bg === 'flood' || shot.bg === 'burst') shot.bg = 'paper'; }
    }
    if (kind === 'singer') { shot.singers = singers; shot.props = []; shot.bg = ['burst', 'grid', 'flood'][(r() * 3) | 0]; shot.layout = (r() * 3) | 0; shot.flip = r() < .5; shot.scene = 'voz'; shot.cut = energy >= 7 ? 'h' : shot.cut; }
    if (kind === 'scene') {
      let id = byWords || plan && SCENE_MAP[plan.scene] || (R.scenes[plan?.scene] ? plan.scene : null) || MOOD_SCENE[mood] || 'ciudad';
      if (R.scenes.ella && !byWords && /eyes|woman|couple/.test((objs || []).join(',')) && ['romantico', 'feliz', 'euforico', 'sereno'].includes(mood)) id = 'ella'; else if (!byWords && (/eyes|man/.test((objs || []).join(',')) || (mood === 'romantico' && r() < .4))) id = 'retrato';
      if (li >= 0 && RC.lastScene === id && r() < .6) { const alt = R.order.filter(x => x !== id); id = alt[(r() * alt.length) | 0]; }
      shot.scene = id; RC.lastScene = id; recent.push(id); if (recent.length > 6) recent.shift(); shot.inks = R.scenes[id].inks;
      if (r() < .45) shot.inks = inkList[(sec + 1) % inkList.length];
    }
    if (kind === 'giant') { shot.word = (keyWord(text, L) || (text.split(/\s+/).map(w => w.replace(/[^\p{L}\p{N}'’-]/gu, '')).sort((a, b) => b.length - a.length)[0] || '')).toUpperCase(); shot.bg = r() < .5 ? 'burst' : 'flood'; shot.cut = 'zin'; }
    if (kind === 'title' || kind === 'outro') { shot.cut = 'zout'; shot.inks = 0; }
    shot.notes = pickNotes(r, kind);
    return shot;
  }
  RC.makeShot = makeShot;
  // toma para una tarjeta de verso: no altera el historial del video en vivo
  RC.cardShot = (li, sec, time, force) => { const kh = [...RC.kindHist], rs = [...(RC.recentScenes || [])], ls = RC.lastScene; try { return makeShot(li, sec, time, '', force); } finally { RC.kindHist.length = 0; RC.kindHist.push(...kh); RC.recentScenes = rs; RC.lastScene = ls; } };
  function pickNotes(r, kind) {
    const all = ['stat', 'stamp', 'post', 'code', 'circuit', 'meter'], out = new Set(kind === 'giant' ? ['stamp'] : ['stat']);
    while (out.size < (kind === 'scene' ? 2 : 3)) out.add(all[(r() * all.length) | 0]);
    return [...out];
  }

  // ---------- portada de la canción, en trama de una tinta ----------
  function artCanvas() {
    const url = window.ext?.artUrl; if (!url) return null;
    if (RC.art && RC.art.url === url) return RC.art.cv;
    RC.art = { url, cv: null }; const img = new Image(); img.onload = () => {
      try { const n = 220, cv = document.createElement('canvas'); cv.width = cv.height = n; const g = cv.getContext('2d', { willReadFrequently: true }); g.drawImage(img, 0, 0, n, n);
        const d = g.getImageData(0, 0, n, n), a = d.data; for (let i = 0; i < a.length; i += 4) { const l = (a[i] * .3 + a[i + 1] * .59 + a[i + 2] * .11) / 255, v = Math.max(0, Math.min(255, Math.round((1 - l) * 300 - 20))); a[i] = v; a[i + 1] = 0; a[i + 2] = 0; a[i + 3] = 255; }
        g.putImageData(d, 0, 0); RC.art.cv = cv; } catch (e) { RC.art.cv = null; } };
    img.src = url; return null;
  }

  // ---------- texto a mano: escribe palabra por palabra al compás del verso ----------
  function wrap(text, maxW, o) { const words = text.split(/\s+/).filter(Boolean), lines = []; let cur = [];
    for (const w of words) { const t = [...cur, w].join(' '); if (cur.length && K.measure(t, o) > maxW) { lines.push(cur); cur = [w]; } else cur.push(w); }
    if (cur.length) lines.push(cur); return lines; }
  function fitText(text, maxW, maxH, o0, maxLines = 4) { let size = o0.size, lines; for (; size > 22; size -= 4) { const o = { ...o0, size }; lines = wrap(text, maxW, o); if (lines.length <= maxLines && lines.length * size * 1.12 <= maxH) break; } return { size, lines: lines || [] }; }
  // dibuja el verso; age = segundos desde que empezó; devuelve el alto usado
  function writeLine(text, x, y, maxW, maxH, age, dur, o = {}) {
    const key = keyWord(text, storyOf(text)), font = o.font || 'hand', base = { size: (o.size || 104) * clamp(window.CFG?.lyricSize || 1, .7, 1.6), w: font === 'hand' ? 600 : 800, font, i: o.i || 1, align: 'left' };
    if (font === 'display') base.ls = 0;
    const heavy0 = R.fx?.weight(), isKeyW = w => key && w.toLowerCase().replace(/[^\p{L}\p{N}'’-]/gu, '') === key;
    // cómo se dibuja cada palabra: con peso, la clave crece y engorda y las demás adelgazan; el ancho real manda sobre el ajuste
    const optsFor = (w, sz) => heavy0 ? (isKeyW(w) ? { ...base, size: sz * 1.16, w: 900 } : { ...base, size: sz, w: font === 'hand' ? 500 : 700 }) : { ...base, size: sz };
    const lineW = (ln, sz) => ln.reduce((a, w, i) => a + K.measure(w, optsFor(w, sz)) + (i ? K.measure(' ', optsFor(w, sz)) : 0), 0);
    let { size, lines } = fitText(text, maxW, maxH, base);
    for (let g = 0; g < 12 && size > 22 && lines.some(ln => lineW(ln, size) > maxW); g++) { size -= 4; lines = wrap(text, maxW, { ...base, size }); }
    const all = lines.flat(), n = all.length, span = clamp(dur * .55, .5, n * .34 + .3);
    let gi = 0, cy = y + size * .95, keyPos = null;
    for (const ln of lines) {
      let cx = x; const lw = lineW(ln, size);
      if (o.align === 'center') cx = x + (maxW - lw) / 2; else if (o.align === 'right') cx = x + maxW - lw;
      for (const w of ln) {
        const isKey = key && w.toLowerCase().replace(/[^\p{L}\p{N}'’-]/gu, '') === key, heavy = heavy0, wo = optsFor(w, size);
        const ww = K.measure(w, wo), t0 = gi / Math.max(1, n) * span, p = easeOut(clamp((age - t0) / .26));
        if (p > 0 && heavy && isKey) {                                       // palabra con peso: cae, golpea y deja sombra mal registrada
          const q = clamp((age - t0) / .18), drop = (1 - q * q) * size * .9, sc = 1 + (1 - q) * .5, c = K.c;
          c.save(); c.translate(cx + ww / 2, cy); c.scale(sc, sc); c.translate(-(cx + ww / 2), -cy);
          K.txt(w, cx + 6, cy + 6 - drop, { ...wo, i: 3, tone: .85 }); K.txt(w, cx, cy - drop, { ...wo, i: 2, fs: o.keyPaper ? R.K.PAPER : undefined }); c.restore();
          if (q >= 1 && !o.preview) R.fx.slam(text + '|' + w);
        } else if (p > 0) { const c = K.c; c.save(); c.beginPath(); c.rect(cx - 8, cy - size * 1.05, (ww + 16) * p, size * 1.4); c.clip();
          K.txt(w, cx, cy + (1 - p) * size * .12, { ...wo, i: isKey ? 2 : (o.i || 1), fs: isKey && o.keyPaper ? R.K.PAPER : undefined }); c.restore(); }
        if (isKey) keyPos = { x: cx, y: cy, w: ww, size, p };
        cx += ww + K.measure(' ', wo); gi++;
      }
      cy += size * 1.12;
    }
    if (keyPos && keyPos.p >= 1 && o.scribble !== false) scribble(keyPos.x, keyPos.y + size * .16, keyPos.w, clamp((age - span - .1) / .35), o.keyPaper ? 1 : 2);
    return { h: lines.length * size * 1.12, size, lines: lines.length };
  }
  function scribble(x, y, w, p, ink) { if (p <= 0) return; const pts = []; for (let i = 0; i <= 18; i++) pts.push([x - 4 + (w + 8) * i / 18, y + sin(i * 1.6) * 3 + i * .5]); R.props.pen(K, pts, p, { i: ink, lw: 7, seed: 5, single: true }); }

  // traducción: etiqueta de papel con letra de imprenta, siempre legible sobre cualquier trama
  // fromBottom: y es el borde de abajo (la caja crece hacia arriba y nunca pisa lo que hay debajo)
  function trBox(text, x, y, maxW, align, size = 38, fromBottom = false) {
    const o = { size, w: 600, font: 'display', stretch: 'normal' }; const { size: sz, lines } = fitText(text, maxW - 28, 200, o, 3), lh = sz * 1.2, h = lines.length * lh + 22, wmax = Math.max(...lines.map(l => K.measure(l.join(' '), { ...o, size: sz }))) + 28;
    if (fromBottom) y -= h;
    const bx = align === 'right' ? x - wmax : align === 'center' ? x - wmax / 2 : x;
    K.rect(bx + 6, y + 6, wmax, h, { f: 1, ft: .3, over: true }); K.rect(bx, y, wmax, h, { f: -1, s: 1, lw: 3.5 });
    lines.forEach((l, i) => K.txt(l.join(' '), bx + 14, y + 10 + sz * .95 + i * lh, { ...o, size: sz, i: 1 })); return h + 8;
  }

  // ---------- fondos de las tomas de objeto ----------
  function drawBg(s, kt) {
    const c = K.c, cx = 800, cy = s.cy ?? 450 + (s.layout === 2 ? -30 : 0), v = K.v;
    if (s.bg === 'flood') { K.bg(3, .85); K.circ(cx + (s.flip ? -300 : 300), cy, 360, { f: -1 }); K.circ(cx + (s.flip ? -300 : 300), cy, 360, { s: 1, lw: 7 }); }
    else if (s.bg === 'panel') { c.save(); c.translate(pcx(s), cy); c.rotate(-.03); K.rect(-290, -300, 580, 600, { f: 3, ft: .3 }); K.rect(-290, -300, 580, 600, { s: 1, lw: 7 }); c.restore(); K.tape(pcx(s) - 200, cy - 300, 130, 40, -.4); K.tape(pcx(s) + 220, cy + 296, 130, 40, -.3); }
    else if (s.bg === 'burst') { const n = 26; for (let i = 0; i < n; i += 2) { const a0 = i / n * TAU + kt * .05, a1 = (i + 1) / n * TAU + kt * .05; K.poly([[pcx(s), cy], [pcx(s) + cos(a0) * 1800, cy + sin(a0) * 1800], [pcx(s) + cos(a1) * 1800, cy + sin(a1) * 1800]], { f: 2, ft: .32 }); } }
    else if (s.bg === 'grid') { for (let y = -600; y < 1500; y += 46) K.line(-1400, y, 3000, y, 3, 2.5, .55); K.line(v.l + 170, -600, v.l + 170, 1500, 2, 3.5, .7); }
  }
  const pcx = s => s.cx ?? (s.flip ? 470 : 1130);

  // ---------- anotaciones (con datos reales) ----------
  function notes(s, time, zone) {
    const v = K.v, m = st.margin, a = R.A, plan = s.plan, sec = s.sec;
    K.screen(() => {
      for (const n of s.notes) {
        if (n === 'stat') {                                          // bloque de cifras, abajo a la izquierda (como en el clip de referencia)
          const x = v.l + m + 10, y = v.b - m - 200, alt = s.seed % 3, bpm = Math.round(a.bpm), e = plan?.energy ?? 5;
          const big = alt === 0 ? '≈ ' + bpm : alt === 1 ? pad2(e) + '/10' : String(sec + 1).padStart(2, '0') + '/' + String(Math.max(1, IN.cuts.length)).padStart(2, '0');
          const lab = alt === 0 ? 'TEMPO' : alt === 1 ? 'ENERGÍA' : 'ESTROFA', tit = alt === 0 ? 'PULSOS POR MINUTO' : alt === 1 ? (plan?.mood || 'ÁNIMO').toUpperCase() : (plan?.summary || 'ESTRUCTURA').toUpperCase().slice(0, 26);
          R.K.txt(fmt(time), x, y + 26, { font: 'mono', size: 46, w: 300, ls: 5, tone: .9 }); R.K.code(lab, x, y + 60, { size: 19 });
          R.K.txt(tit, x, y + 100, { size: 34, w: 800, stretch: 'condensed' }); R.K.txt(big, x, y + 174, { size: 84, w: 900, i: 1, tone: .92 });
        } else if (n === 'stamp' && zone !== 'noStamp') K.stamp(v.r - m - 300, v.t + m + 4, 1);
        else if (n === 'post' && plan?.summary) { const w = 250, h = 118; K.postit(zone === 'postL' ? v.l + m + 30 : v.r - m - w - 20, v.b - m - h - 96, w, h, zone === 'postL' ? -.05 : .05, wrapSm(plan.summary, 20), { size: 27, fill: 3, ft: .5, font: 'hand' }); }
        else if (n === 'code') { K.code(`FIG. ${pad2((s.li < 0 ? sec : s.li) + 1)} / ${(R.people?.names[s.props?.[0]?.id] || s.props?.[0]?.id || s.scene || s.kind).toUpperCase()}`, v.r - m - 8, v.b - m - 34, { align: 'right', size: 16, bg: true }); K.code(`${fmt(time)} · ${Math.round(a.bpm)} BPM`, v.r - m - 8, v.b - m - 8, { align: 'right', size: 14, bg: true, i: 2 }); }
        else if (n === 'circuit') K.circuit([[v.r - m - 420, v.t + m + 120], [v.r - m - 330, v.t + m + 120], [v.r - m - 330, v.t + m + 150], [v.r - m - 180, v.t + m + 150], [v.r - m - 180, v.t + m + 128], [v.r - m - 20, v.t + m + 128]], ((K.t - s.k0) * .35) % 1.5, { i: 1, node: 2 });
        else if (n === 'meter') K.meter(v.r - m - 300, v.b - m - 90, 280, .25 + a.e * .7, 'NIVEL', { n: 18 });
      }
    });
  }
  const wrapSm = (txt, n) => { const w = txt.split(' '), o = []; let c = ''; for (const x of w) { if ((c + ' ' + x).trim().length > n && c) { o.push(c); c = x; } else c = (c + ' ' + x).trim(); } if (c) o.push(c); return o.slice(0, 3); };

  // ---------- datos reales de la canción, para la ficha ----------
  const MOOD_NAME = { euforico: 'eufórico', feliz: 'feliz', romantico: 'romántico', sereno: 'sereno', nostalgico: 'nostálgico', melancolico: 'melancólico', triste: 'triste', oscuro: 'oscuro', rabioso: 'rabioso', desafiante: 'desafiante' };
  const STOP = new Set(('de la que el en y a los se del las por un para con no una su al lo como más pero sus le ya o este sí porque esta entre cuando muy sin sobre también me hasta hay donde quien desde todo nos todos uno les ni contra otros ese eso ante ellos esto antes algunos qué unos yo otro otras otra él tanto esa estos mucho nada poco ella estar estas algo nosotros mi mis tú te ti tu tus ellas ' +
    'the and you your for are was were that this with have has had not but they them their what when who how all any can just like from out its our his her she him get got cause oh yeah ooh uh ah hey woah whoa gonna wanna ain').split(' '));
  function songFacts() {
    const key = ext.key() + '|' + IN.lines.length + '|' + (proc.dur || 0); if (RC.facts && RC.facts.key === key) return RC.facts;
    const count = {}; for (const l of IN.lines) for (const w of (l.text || '').toLowerCase().split(/[^\p{L}']+/u)) if (w.length > 2 && !STOP.has(w)) count[w] = (count[w] || 0) + 1;
    const top = Object.entries(count).sort((a, b) => b[1] - a[1])[0], moods = {};
    for (const p of Object.values(SEM.plans || {})) if (p?.mood) moods[p.mood] = (moods[p.mood] || 0) + 1;
    return RC.facts = { key, word: top && top[1] >= 3 ? top : null, mood: Object.entries(moods).sort((a, b) => b[1] - a[1])[0]?.[0] || '', verses: IN.lines.filter(l => l.text).length, sections: Math.max(1, IN.cuts.length) };
  }
  // ---------- dibujo de cada toma ----------
  function drawShot(s, time, dt) {
    const v = K.v, m = st.margin, kt = K.t - s.k0, li = s.li, text = s.text?.text || '', age = s.text ? (time + .2 + (IN.off || 0)) - s.text.t : 0, dur = s.text?.dur || 3;
    const showText = IN.show !== false && text;
    st.setInks(s.inks);
    if (s.kind === 'prop' || s.kind === 'singer') {
      drawBg(s, kt);
      const draw = clamp(kt / 1.1), cxp = pcx(s), cy = 450;
      const sc = s.props.length > 1 ? 1.05 : 1.35;
      if (s.kind === 'singer') R.singers.draw(s, kt, time, age, dur); else s.props.forEach((p, i) => { const off = i === 0 ? [0, 0] : [(i === 1 ? -1 : 1) * (s.flip ? -1 : 1) * 250, (i === 1 ? 1 : -1) * 130], k = clamp((kt - i * .35) / 1.1);
        R.props.drawProp(K, p.id, cxp + off[0], cy + off[1], sc * (i === 0 ? 1 : .55), easeOut(k), { seed: s.seed + i * 7, ph: p.ph, rot: p.rot }); });
      if (s.props.length > 1 || s.bg === 'paper') K.tape(cxp - 190, cy - 240, 120, 38, -.5);
      K.screen(() => {
        let wlh = v.h * .4; if (showText) { const w = (v.w - m * 2) * .46, x = s.flip ? v.r - m - w - 10 : v.l + m + 10; if (window.CFG?.textBox) { const ft = fitText(text, w, v.h * .5, { size: 104 * clamp(CFG.lyricSize || 1, .7, 1.6), w: 600, font: 'hand' }); K.rect(x - 16, v.t + m + 88, w + 32, ft.lines.length * ft.size * 1.12 + 26, { f: -1, s: 1, lw: 3.5 }); } wlh = writeLine(text, x, v.t + m + 96, w, v.h * .5, age, dur, { align: s.flip ? 'right' : 'left', keyPaper: s.bg === 'flood' }).h; }
        if (s.text?.tr && showText) { const w = (v.w - m * 2) * .46, x = s.flip ? v.r - m - w - 10 : v.l + m + 10, yy = v.t + m + 96 + wlh + 18; trBox(s.text.tr, s.flip ? x + w : x, Math.min(yy, v.b - m - 330), w, s.flip ? 'right' : 'left'); }
      });
      notes(s.kind === 'singer' ? { ...s, notes: s.notes.filter(n => n !== 'stat' && n !== 'post') } : s, time, s.flip ? 'noStamp' : 'x');
    } else if (s.kind === 'scene') {
      const sc = R.scenes[s.scene]; let state = RC.sceneState[s.scene]; if (!state) state = RC.sceneState[s.scene] = sc.make(R.rng(hash(ext.key() + s.scene)), K) || {};
      K.c.save(); try { sc.draw(K, state, K.t, dt, R.A); } finally { K.c.restore(); }
      K.screen(() => {
        if (showText) { const w = Math.min(v.w * .62, 900), o = { size: 70, font: 'display', w: 800, ls: 0 }, fit = fitText(text, w - 44, 300, o, 3), bh = fit.lines.length * fit.size * 1.1 + 40, x = v.l + m + 10, y = v.b - m - bh - 8;
          K.rect(x + 8, y + 8, w, bh, { f: 1, ft: .3, over: true }); K.rect(x, y, w, bh, { f: -1, s: 1, lw: 4 });
          writeLine(text, x + 22, y + 6, w - 44, bh - 12, age, dur, { size: 70, font: 'display', scribble: false });
          if (s.text?.tr) trBox(s.text.tr, x, y - 10, w, 'left', 34, true); }
      });
      const saved = s.notes; notes({ ...s, notes: saved.filter(n => n !== 'stat' && n !== 'post') }, time, 'x');
    } else if (s.kind === 'giant') {
      drawBg(s, kt); const word = s.word, m100 = K.measure(word, { size: 100, w: 900, font: 'display' }), size = Math.min(v.h * .66, (v.w - 140) / m100 * 100), p = easeOut(clamp(kt / .35));
      K.screen(() => {
        const cx = (v.l + v.r) / 2, cy = (v.t + v.b) / 2 + size * .3, wo = { size: size * (.85 + .15 * p), w: 900, font: 'display', align: 'center', stretch: 'condensed' };
        K.txt(word, cx + 10, cy + 10, { ...wo, i: 3, tone: .9 }); K.txt(word, cx - 6, cy - 4, { ...wo, i: 2 });          // dos tintas mal registradas
        K.c.save(); K.c.strokeStyle = K.ink(1); K.c.lineWidth = 6; K.c.lineJoin = 'round'; K.c.font = `900 ${wo.size}px ${R.FONTS.display}`; try { K.c.fontStretch = 'condensed'; } catch (e) {} K.c.textAlign = 'center'; K.c.strokeText(word, cx, cy); K.c.restore();
        if (showText) writeLine(text, v.l + m + 20, v.b - m - 130, v.w - m * 2 - 40, 112, age, dur, { size: 44, align: 'center', scribble: false });
        if (showText && s.text?.tr) trBox(s.text.tr, cx, v.b - m - 140, v.w * .6, 'center', 34, true);
      });
      notes(s, time, 'x');
    } else {                                                        // título, cierre y modo portada
      const md = meta(), art = artCanvas(), last = s.kind === 'outro', poster = RC.poster, F = songFacts(), durS = proc.dur || 0;
      K.rect(-1400, -800, 6000, 3000, { f: 3, ft: .12 });
      const ax = 1010, ay = 200;
      K.c.save(); K.c.translate(ax, ay); K.c.rotate(.05 + sin(kt * .7) * .01); K.rect(14, 14, 500, 500, { f: 1, ft: .3, over: true }); K.rect(-6, -6, 512, 512, { f: -1, s: 1, lw: 8 });
      if (art) { K.c.save(); K.c.translate(0, 0); K.c.globalCompositeOperation = 'lighter'; K.c.imageSmoothingEnabled = true; K.c.drawImage(art, 0, 0, 500, 500); K.c.restore(); K.rect(0, 0, 500, 500, { s: 1, lw: 5 }); }
      else { R.props.drawProp(K, 'stars', 250, 250, .9, easeOut(clamp(kt / 1.4)), { seed: 3 }); }
      K.tape(0, 0, 120, 38, -.7); K.tape(500, 500, 120, 38, -.7); K.c.restore();
      K.screen(() => {
        const x = v.l + m + 20, w = (v.w - m * 2) * .5, k = easeOut(clamp(kt / .6)), paused = ext.st?.state === 'paused';
        K.code(last ? 'FICHA DE LA CANCIÓN' : poster && paused ? 'EN PAUSA' : 'AHORA SUENA', x, v.t + m + 120, { size: 20, bg: true });
        const { size, lines } = fitText(md.title, w, poster ? 210 : 380, { size: poster ? 96 : 150, w: 800, font: 'display', stretch: 'condensed' }, poster ? 2 : 3);       // en modo portada el título se compacta para dejar sitio al verso y a la barra
        lines.forEach((ln, i) => K.txt(ln.join(' '), x + (1 - k) * -60, v.t + m + 210 + size * .9 + i * size * 1.02, { size, w: 800, i: 1, font: 'display' }));
        const ty = v.t + m + 210 + size * .9 + lines.length * size * 1.02 + 30;
        K.txt(md.artist, x, ty + 10, { font: 'hand', size: poster ? 62 : 74, w: 600, i: 2 }); if (md.album) K.code(md.album.toUpperCase(), x, ty + 54, { size: 17 });
        // la ficha: lo que la canción dijo, no un agradecimiento
        let fy = ty + 54;
        if (F.verses) {
          const r1 = [durS ? 'DURACIÓN ' + fmt(durS) : '', F.verses + ' VERSOS', F.sections + (F.sections === 1 ? ' ESTROFA' : ' ESTROFAS')].filter(Boolean).join(' · '),
            r2 = [F.word ? 'MÁS DICHA «' + F.word[0].toUpperCase() + '» ×' + F.word[1] : '', F.mood ? 'ÁNIMO ' + (MOOD_NAME[F.mood] || F.mood).toUpperCase() : ''].filter(Boolean).join(' · ');
          fy += 30; K.code(r1, x, fy, { size: 16 }); if (r2) { fy += 26; K.code(r2, x, fy, { size: 16, i: 2 }); }
        }
        if (IN.preparing) K.postit(x, ty + 90, 330, 96, -.03, ['preparando el', 'videoclip…'], { size: 30, fill: 3, ft: .5 });
        if (poster) {                                                  // modo portada: el verso que suena y el avance, sin salir de esta pantalla
          const yb = v.b - m - 70, pw = w * 1.02, yv = Math.max(fy + 34, v.t + v.h * .6), hv = yb - 50 - yv;
          if (showText && hv > 70) { const u = writeLine(text, x, yv, pw, hv - (s.text?.tr ? 70 : 0), age, dur, { size: 60, font: 'hand' }); if (s.text?.tr) trBox(s.text.tr, x, Math.min(yv + u.h + 10, yb - 100), pw, 'left', 26); }
          const pos = timeNow(), p = durS ? clamp(pos / durS) : 0;
          K.code(fmt(pos), x, yb - 10, { size: 15 }); K.code(fmt(durS), x + pw, yb - 10, { size: 15, align: 'right' });
          K.rect(x, yb, pw, 22, { f: -1, s: 1, lw: 3.5 }); K.rect(x + 4, yb + 4, Math.max(0, (pw - 8) * p), 14, { f: 2, ft: .9 });
          for (const cut of IN.cuts.slice(1)) if (durS) K.line(x + pw * cut / durS, yb - 4, x + pw * cut / durS, yb + 26, 3, 1, 1);
        }
      });
      notes({ ...s, notes: s.notes.filter(n => n !== 'stat') }, time, poster ? 'noStamp' : 'postL');
    }
  }

  // ---------- cámara de cada toma ----------
  function shotCam(cam, kt, a) {
    const s = RC.shot; if (!s) return;
    if (s.kind === 'scene') { const sc = R.scenes[s.scene]; if (sc.cam) return sc.cam(cam, kt + 3, a, RC.sceneState[s.scene]); }
    if (s.kind === 'giant') { cam.x = 0; cam.y = 0; cam.z = 1.16 - easeOut(clamp(kt / 1.1)) * .14; cam.r = 0; return; }
    const d = s.seed % 2 ? 1 : -1;
    cam.x = d * (kt * 9 - 30) + sin(kt * .3) * 14; cam.y = cos(kt * .4) * 10; cam.z = 1 + Math.min(kt, 8) * .008 + (s.layout === 1 ? kt * .004 : 0); cam.r = d * sin(kt * .2) * .008;
  }

  // ---------- el motor: una escena virtual dentro del escenario compartido ----------
  R.register({ id: 'clip', name: 'videoclip', inks: 0, make: () => ({}), cam: (cam, t, a) => { shotCam(cam, RC.shot ? K.t - RC.shot.k0 : t, a); if (window.CFG && CFG.reduceMotion) { cam.x *= .15; cam.y *= .15; cam.r *= .15; } },
    draw(K2, s, t, dt) { if (RC.mix?.on) RC.mix.draw(dt); else if (RC.shot) drawShot(RC.shot, RC.time || 0, dt); } });
  R.order.splice(R.order.indexOf('clip'), 1);                          // no aparece entre las escenas del menú

  function keepShotText(s, time) {
    const li = lineIdx(time); if (li < 0 || !IN.lines[li]) { if (s.text && time > s.text.t + s.text.dur + 1.5) s.text = null; return; }
    if (s.text && s.text.li === li) return;
    const l = IN.lines[li], next = IN.lines.slice(li + 1).find(q => q.text), dur = next ? Math.max(1, next.t - l.t) : 4, tr = IN.trMode === 'orig' ? '' : (IN.tr?.[li] || '');
    s.text = { li, t: l.t, text: l.text, dur, tr: IN.trMode === 'es' && tr ? '' : tr };
    if (IN.trMode === 'es' && IN.tr?.[li]) s.text.text = IN.tr[li];
  }

  // decide cuándo cambia la toma
  function frame(dt) {
    const time = timeNow(), sec = secOf(time), li = lineIdx(time), key = ext.key() + '|' + (proc.dur || 0);
    RC.time = time;
    // la mezcla: si cambió la canción, se prepara antes de que el clip se reinicie
    const skey = ext.key();
    if (RC.songKey && skey && RC.songKey !== skey && RC.mix) RC.mix.onSongChange();
    if (RC.songKey === skey || !RC.songKey) { const s = ext.st; RC.prevMeta = { name: (s.name || '').replace(/\s*[\(\[](feat|ft|with)\.?[^)\]]*[\)\]]/i, '').trim(), artist: (s.artist || '').split(/,|&/)[0].trim(), dur: s.dur || 0, time }; }
    RC.songKey = skey;
    if (RC.lastKey !== key) { RC.lastKey = key; RC.recentScenes = []; RC.shot = null; RC.pending = null; RC.kindHist.length = 0; RC.sceneState = {}; RC.lastScene = ''; RC.count = 0; }
    if (st.sceneId !== 'clip') st.setScene('clip', { instant: true });
    const grief = R.grief?.detect(ext.st?.name, ext.st?.artist, ext.st?.id);
    if (grief && (!window.CFG || CFG.clip !== 'portada')) {
      RC.grief = true; RC.geometry = null;
      if (RC.mix?.on) RC.mix.finish();
      RC.shot = null; RC.pending = null; st.cut = null;
      const lyric = li >= 0 && IN.show !== false ? IN.lines[li] : null;
      const text = lyric ? (IN.trMode === 'es' && IN.tr?.[li] ? IN.tr[li] : lyric.text) : '';
      R.grief.render(x, W, H, time, { text, title: ext.st?.name, duration: ext.st?.dur || proc.dur, reduced: !!window.CFG?.reduceMotion, playing: ext.active() ? ext.st?.state === 'playing' : !paused });
      if (RC.afterFrame) RC.afterFrame(time);
      return;
    }
    if (RC.grief) R.grief?.stop();
    RC.grief = false;
    const geometry = R.geometry?.detect(ext.st?.name, ext.st?.artist, ext.st?.album);
    if (geometry && (!window.CFG || CFG.clip !== 'portada')) {
      RC.geometry = geometry;
      if (RC.mix?.on) RC.mix.finish();
      RC.shot = null; RC.pending = null; st.cut = null;
      const l = li >= 0 && IN.show !== false ? IN.lines[li] : null;
      const text = l ? (IN.trMode === 'es' && IN.tr?.[li] ? IN.tr[li] : l.text) : '';
      R.geometry.render(x, W, H, geometry, time, { reduced: !!window.CFG?.reduceMotion, duration: ext.st?.dur || proc.dur || 0, text });
      if (RC.afterFrame) RC.afterFrame(time);
      return;
    }
    RC.geometry = null;
    if (RC.mix && RC.mix.tick(dt)) {                                               // mezcla entre canciones: las tomas normales esperan
      st.margin = 34; st.notes = false; st.lyric = true; st.speed = 1; st.auto = true; st.setDetail(window.LOWFX ? 1 : 2, true);
      st.frame(Math.max(.001, dt)); x.drawImage(st.canvas, 0, 0, W, H); return;
    }
    const cur = RC.shot, dur = proc.dur || 0, lyricT0 = IN.lines.find(l => l.text)?.t ?? 99;
    const poster = RC.poster = !!window.CFG && CFG.clip === 'portada';           // modo portada: la pantalla de título se queda fija
    let why = '';
    // una toma de cambio que quedó sin terminar (el escenario cambió de escena a mitad) no puede bloquear las siguientes
    if (RC.pending && !st.cut) { RC.shot = RC.pending; RC.pending = null; }
    if (!cur) why = 'title';
    else if (poster) { if (cur.kind !== 'title' && !st.cut && !RC.pending) why = 'title'; }
    else if (!st.cut && !RC.pending && ((cur.kind === 'outro' && dur && time < dur - 7) || time < cur.t0 - 2)) why = time < 4 ? 'title' : 'seek';   // la canción se reinició o retrocedió: el cierre no se queda
    else if (!st.cut && !RC.pending) {
      const age = time - cur.t0;
      if (dur && time > dur - 6 && cur.kind !== 'outro') why = 'outro';
      else if (cur.kind === 'title' && (IN.preparing ? false : ((time > 4.5 || li >= 0) && st.t - cur.k0 > 1.8))) why = 'next';
      else if (cur.kind !== 'title' && cur.kind !== 'outro') {
        if (sec !== cur.sec) why = 'sec';
        else if (li !== cur.li && (li >= 0 || age > 2.5) && (age > 3.6 || cur.kind === 'giant' || (li >= 0 && cur.li < 0))) why = 'line';
        else if (age > 9) why = 'age';
      }
    }
    if (why) {
      const next = makeShot(li, sec, time, why === 'title' || why === 'outro' ? why : '');
      if (why === 'outro') window.dispatchEvent(new CustomEvent('riso:outro'));
      if (poster && next.kind === 'title') next.notes = ['code', 'circuit'];
      if (!cur) { RC.shot = next; RC.count = 1; }
      else { if (why === 'sec' && R.fx) { const k = R.fx.pickCut(next, cur); if (k) next.cut = k; } RC.pending = next; st.cutTo(() => { RC.shot = next; RC.pending = null; RC.count++; }, next.cut); }
    }
    if (RC.shot) keepShotText(RC.shot, time);
    const want = window.LOWFX ? 1 : 2; if (RC.detail !== want) { RC.detail = want; st.setDetail(want, true); }
    st.margin = 34; st.notes = false; st.lyric = true; st.speed = 1; st.auto = true; st.setInks(RC.shot?.inks ?? 0);
    if (R.fx) R.fx.beforeFrame(RC.shot);
    st.frame(Math.max(.001, dt));
    x.drawImage(st.canvas, 0, 0, W, H);
    if (RC.afterFrame) RC.afterFrame(time);
  }
  RC.frame = frame; RC.makeShot = makeShot; RC.drawShot = drawShot;
  RC.h = { writeLine, drawBg, fitText, trBox, scribble, keyWord, storyOf, meta, fmt, hash, secOf, lineIdx, timeNow, pad2, wrap, artCanvas, notes };

  // ---------- conexión con el video de siempre ----------
  const enabled = () => !window.CFG || CFG.clip !== 'clasico' || !!R.geometry?.detect(ext.st?.name, ext.st?.artist, ext.st?.album) || !!R.grief?.detect(ext.st?.name, ext.st?.artist, ext.st?.id);
  // el título clásico y el fondo viejo no llegan a pintarse: el videoclip se enciende en el mismo instante que arranca el video
  const _tc = titleCard;
  titleCard = function (title, artist) {
    if (!(mode === 'proc' && enabled() && st.ok)) return _tc(title, artist);
    lyr.innerHTML = ''; document.body.classList.add('riso-clip');
    try { x.fillStyle = '#f4ead4'; x.fillRect(0, 0, W, H); } catch (e) {}
  };
  const _pf = procFrame;
  procFrame = function (t, dt) {
    const on = mode === 'proc' && enabled() && st.ok;
    if (on !== RC.on) { RC.on = on; document.body.classList.toggle('riso-clip', on); if (!on) { RC.shot = null; RC.lastKey = ''; if (st.sceneId === 'clip') st.sceneId = null; } else lyr.innerHTML = ''; }
    if (!on) { R.grief?.stop(); return _pf(t, dt); }
    const real = dt || .016; if (!ext.active() && !paused) T += real;
    if (st.w !== innerWidth || st.h !== innerHeight) st.resize(innerWidth, innerHeight);
    try { frame(paused ? 0 : real); } catch (e) { if (!RC.err) { RC.err = 1; console.warn('videoclip riso:', e.message, e.stack); } }
    bar.style.width = proc.dur ? (timeNow() / proc.dur * 100) + '%' : '0';
    if (typeof hudTick === 'function') hudTick(timeNow(), proc.dur);
  };
  const css = document.createElement('style'); css.textContent = 'body.riso-clip #lyr, body.riso-clip #tag, body.riso-clip #next, body.riso-clip #np, body.riso-clip .kin { display:none !important; }'; document.head.appendChild(css);
  // la grabación ya trae la letra dibujada en el lienzo
  if (typeof composeFrame === 'function') { const _cf = composeFrame; composeFrame = function () { const a = document.querySelector('#lyr .line:not(.out)'); if (RC.on && a) a.classList.add('out'); return _cf.apply(this, arguments); }; }
})();
