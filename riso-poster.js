// ============================================================
// riso-poster.js — el póster de la canción al terminar (fase 2).
// Durante la reproducción guarda cuatro tomas del clip en miniatura (intro, primer coro, pico de energía,
// último verso). Cuando la canción termina (toma de cierre o cambio de canción) arma una lámina imprimible en
// risografía: la portada en trama, las cuatro tomas, la palabra clave en grande y los datos de la canción.
//   · A4 vertical de alta resolución (2480x3508) o 9:16 (1620x2880)
//   · Stage propio (segundo Stage del motor): dibuja las planchas del póster con el shader y después se
//     pegan encima las miniaturas ya impresas (no se vuelven a pasar por el shader)
//   · aviso discreto «póster listo» (no interrumpe la canción siguiente) → ventana con guardar, copiar,
//     compartir y otra variante. Ajuste: «Póster al terminar».
// Los datos del tempo solo se muestran si vinieron de un análisis real del audio.
// ============================================================
(() => {
  const R = window.RISO; if (!R || !window.RISOCLIP) return;
  const RC = RISOCLIP, H = RC.h, K = R.K, clamp = R.clamp, TAU = Math.PI * 2;
  const POS = window.RISOPOSTER = { cur: null, ready: [], stage: null, variant: 0, open: null };
  const STOP = new Set(('the a an and or but of to in on at for with from by is are was were be been am i you he she it we they me my your his her our their this that these those so no not yes oh ooh yeah ya ey uh eh ah la na da just like what when where who how all can cant dont do did got get gonna wanna im youre its ive ill id ' +
    'el la los las un una unos unas y o pero de del al a en con por para que qué se su sus mi mis tu tus te me lo le les nos es son fue era ser estar esta este esto eso esa ese yo tu ella nosotros ellos si ya muy mas más como cuando donde quien porque pa ay hey baby').split(' '));
  const norm = t => (t || '').toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '');
  const SLOTS = ['intro', 'primer coro', 'pico', 'final'], FRAC = [.1, .38, .62, .88];

  // ---------- sesión de la canción que suena ----------
  const fresh = () => { const s = ext.st; return { key: ext.key(), name: s.name || 'sin título', artist: (s.artist || '').split(/,|&/)[0].trim(), album: s.album || '', dur: s.dur || 0, t0: Date.now(), frames: [null, null, null, null], moods: {}, artCv: null, lines: null, cuts: 0, live: false, bpm: 0, peak: 0, done: false, lastLi: -1 }; };
  function snapFrame(slot, time) {
    const c = POS.small || (POS.small = document.createElement('canvas')); c.width = 480; c.height = 270;
    const g = c.getContext('2d'); g.drawImage(R.stage.canvas, 0, 0, c.width, c.height);
    POS.cur.frames[slot] = { url: c.toDataURL('image/jpeg', .78), t: time, txt: RC.shot?.text?.text || '', sid: RC.shot?.seed };
  }
  function topWord(lines, fallback) {
    const cnt = {}; for (const l of lines || []) for (const w of (norm(l).match(/[a-zñ']{4,}/g) || [])) if (!STOP.has(w.replace(/'/g, ''))) cnt[w] = (cnt[w] || 0) + 1;
    const best = Object.entries(cnt).sort((a, b) => b[1] - a[1] || b[0].length - a[0].length)[0];
    return best && best[1] >= 2 ? { w: best[0], n: best[1] } : (best ? { w: best[0], n: best[1] } : { w: fallback, n: 0 });
  }
  // ajusta el tamaño hasta que el texto quepa en ancho, alto y líneas (ninguna palabra sola puede pasarse del ancho)
  function wrapW(text, maxW, o) { const words = text.split(/\s+/).filter(Boolean), lines = []; let cur = []; for (const w of words) { const t = [...cur, w].join(' '); if (cur.length && K.measure(t, o) > maxW) { lines.push(cur); cur = [w]; } else cur.push(w); } if (cur.length) lines.push(cur); return lines; }
  function fit(text, maxW, maxH, o0, maxLines) {
    let size = o0.size, lines = [];
    for (; size > 18; size -= 3) { const o = { ...o0, size }; lines = wrapW(text, maxW, o); if (lines.length <= maxLines && lines.length * size * 1.05 <= maxH && lines.every(l => K.measure(l.join(' '), o) <= maxW)) break; }
    return { size, lines };
  }
  R.poster = { topWord };

  // gancho: se llama al final de cada cuadro del clip
  RC.afterFrame = function (time) {
    let cur = POS.cur;
    if (!ext.key()) return;
    if (!cur || cur.key !== ext.key()) { if (cur && !cur.done) finalize('cambio'); cur = POS.cur = fresh(); }
    if (cur.done) return;
    const s = ext.st; if (s.dur) cur.dur = s.dur;
    if (!cur.artCv) { const a = H.artCanvas(); if (a) cur.artCv = a; }
    if (!cur.lines && IN.lines.length) { cur.lines = IN.lines.filter(l => l.text).map(l => l.text); cur.cuts = IN.cuts.length; cur.first = IN.lines.find(l => l.text)?.t || 0; }
    if (window.AUD && AUD.live) { cur.live = true; cur.bpm = IN.bpm || cur.bpm; }
    const sec = H.secOf(time), plan = SEM.plans && SEM.plans[sec]; if (plan?.mood) cur.moods[plan.mood] = (cur.moods[plan.mood] || 0) + 1;
    const shot = RC.shot; if (!shot || R.stage.cut || RC.pending || shot.kind === 'title') return;
    const kt = R.stage.t - shot.k0; if (kt < 1.25) return;                       // esperar a que el dibujo termine de trazarse
    const li = H.lineIdx(time), n = cur.lines ? IN.lines.filter(l => l.text).length : 0, dur = cur.dur || 0;
    const en = (plan?.energy ?? 5);
    // eventos; si no ocurren, la fracción de la duración los dispara
    const due = [
      time > 3,
      cur.first != null && (sec >= 1 || time > (dur || 200) * .3) && time > (cur.first || 0) + 10,
      en >= 8 || shot.kind === 'giant',
      shot.kind === 'outro' || (li >= 0 && n && IN.lines.filter(l => l.text).findLastIndex(l => l.t <= time + .3) >= n - 1) || (dur && time > dur * .9),
    ];
    for (let i = 0; i < 4; i++) {
      const fb = dur && time > dur * FRAC[i] + Math.min(12, dur * .03);
      const same = cur.frames.some(f => f && f.sid === shot.seed);                       // cada casilla, una toma distinta
      if (!cur.frames[i] && !same && (due[i] || fb) && (i === 0 || cur.frames[i - 1] || fb)) { snapFrame(i, time); break; }
    }
    if (shot.kind === 'outro') finalize('fin');
  };

  function finalize(why) {
    const c = POS.cur; if (!c || c.done) return; c.done = true;
    if (!c.frames.some(Boolean)) return;                                          // no hubo nada que mostrar
    if (window.CFG && CFG.poster === false) return;
    const item = { id: 'p' + Date.now().toString(36), ...c, why, fin: Date.now() };
    POS.ready.push(item); if (POS.ready.length > 6) POS.ready.shift();
    const auto = window.CFG && CFG.posterGuardar === 'auto'; if (auto && window.RISOSHARE) RISOSHARE.save(item);
    showToast(item, auto);
    window.dispatchEvent(new CustomEvent('riso:poster-listo', { detail: item }));
  }

  // ---------- la escena del póster ----------
  const mood = c => Object.entries(c.moods).sort((a, b) => b[1] - a[1])[0]?.[0] || '';
  const INK_ORDER = [0, 1, 2, 3, 4, 5];
  // lo que el usuario puede cambiar del póster; se guarda con cada lámina (item.opts) para poder volver a abrirla igual
  const DEF = { layout: 'clasico', inks: -1, paper: 'crema', frame: 'doble', cover: 'm', shots: true, word: true, facts: true, date: true, foot: true, title: '', artist: '', wordText: '' };
  const PAPERS = { crema: null, blanco: [.985, .98, .965], kraft: [.80, .66, .47], periodico: [.87, .86, .81] };
  POS.DEF = DEF; POS.PAPERS = PAPERS;
  // sin opciones guardadas, la «variante» de antes decide composición y tintas (así las láminas viejas se ven igual)
  const resolve = (item, variant) => { const o = { ...DEF, ...(item.opts || {}) }; if (!item.opts || item.opts.layout === undefined) o.layout = variant % 2 ? 'cartel' : 'clasico'; if (o.inks < 0) o.inks = (variant >> 1) % INK_ORDER.length; return o; };
  POS.resolve = resolve;
  R.register({ id: 'poster', name: 'póster', inks: 0, phrases: [], make: () => ({}),
    cam(cam) { cam.x = 0; cam.y = 0; cam.z = 1; cam.r = 0; },
    draw(K, s) { drawPoster(K, POS.job); } });
  R.order.splice(R.order.indexOf('poster'), 1);

  function drawPoster(K, job) {
    const { c, v: variant, o } = job, v = K.v, m = 34, W = v.w, sc = Math.min(1, W / 639), x0 = v.l + m, w = W - m * 2, yTop = 30;
    const slots = job.slots = [];                                                // rectángulos de las miniaturas, para pegarlas después
    K.bg(3, .05);
    // marco de la hoja
    if (o.frame === 'doble') { K.rect(v.l + 12, 12, W - 24, 876, { s: 1, lw: 5 }); K.rect(v.l + 22, 22, W - 44, 856, { s: 1, lw: 2, st: .7 }); } else if (o.frame === 'simple') K.rect(v.l + 14, 14, W - 28, 872, { s: 1, lw: 9 });
    const dat = new Date(c.fin || Date.now()), fecha = `${dat.getFullYear()}.${String(dat.getMonth() + 1).padStart(2, '0')}.${String(dat.getDate()).padStart(2, '0')}`;
    const words = topWord(c.lines, (c.name.split(/\s+/)[0] || c.name)), custom = (o.wordText || '').trim(), Wd = (custom || words.w || c.name).toUpperCase(), ttl = (o.title || '').trim() || c.name, art = (o.artist || '').trim() || c.artist || 'artista';
    const mm = Math.floor((c.dur || 0) / 60), ss = String(Math.floor((c.dur || 0) % 60)).padStart(2, '0');
    // ---- bloques (alto fijo cada uno); el espacio que sobra se reparte como aire ----
    const rowHeader = { h: 56, draw: y => {
      K.txt('LUMORA', x0, y + 42, { size: 46, w: 900, i: 1, font: 'display' }); K.circ(x0 + K.measure('LUMORA', { size: 46, w: 900, font: 'display' }) + 12, y + 30, 6, { f: 2 });
      if (o.date) { K.code('LÁMINA N° ' + String(1000 + (job.n || 1)).slice(-4), v.r - m, y + 20, { align: 'right', size: 14, bg: true }); K.code(fecha, v.r - m, y + 46, { align: 'right', size: 14, i: 2 }); } } };
    const coverSide = Math.round(Math.min(o.cover === 'l' ? 390 : o.cover === 's' ? 210 : 300, w * (o.cover === 'l' ? .64 : o.cover === 's' ? .36 : .5))), tx = x0 + coverSide + 26, tw = x0 + w - tx;
    const ff = fit(ttl, tw, 190, { size: 84, w: 800, font: 'display', stretch: 'condensed' }, 4), af = fit(art, tw, 60, { size: 40, w: 600, font: 'hand' }, 2);
    const facts = [['DURACIÓN', `${mm}:${ss}`], ['VERSOS', c.lines ? String(c.lines.length) : '—'], ['ESTROFAS', c.cuts ? String(c.cuts) : '—'], ['ÁNIMO', (mood(c) || '—').toUpperCase()]];
    if (c.live && c.bpm) facts.push(['TEMPO', Math.round(c.bpm) + ' BPM']);
    if (!o.facts) facts.length = 0;
    const textH = 20 + ff.lines.length * ff.size * 1.02 + 14 + af.lines.length * af.size * 1.05 + 20 + facts.length * 26 + 8;
    const rowCover = { h: Math.max(coverSide + 20, textH), draw: y => {
      const cx = x0, cy = y + 10, side = coverSide;
      K.rect(cx + 10, cy + 10, side, side, { f: 1, ft: .3, over: true }); K.rect(cx - 6, cy - 6, side + 12, side + 12, { f: -1, s: 1, lw: 7 });
      if (c.artCv) { K.c.save(); K.c.globalCompositeOperation = 'lighter'; K.c.drawImage(c.artCv, cx, cy, side, side); K.c.restore(); K.rect(cx, cy, side, side, { s: 1, lw: 4 }); }
      else { R.props.drawProp(K, 'stars', cx + side / 2, cy + side / 2, side / 520, 1, { seed: 4 }); }
      K.tape(cx + 20, cy - 4, 100, 32, -.5);
      ff.lines.forEach((ln, i) => K.txt(ln.join(' '), tx, cy + 6 + ff.size * .85 + i * ff.size * 1.02, { size: ff.size, w: 800, i: 1, font: 'display' }));
      let ty = cy + 14 + ff.lines.length * ff.size * 1.02;
      af.lines.forEach((ln, i) => K.txt(ln.join(' '), tx, ty + af.size * .8 + i * af.size * 1.05, { font: 'hand', size: af.size, w: 600, i: 2 })); ty += af.lines.length * af.size * 1.05 + 30;
      facts.forEach(([a, b2], i) => { const yy = ty + i * 26; K.code(a, tx, yy, { size: 13, tone: .75 }); K.txt(b2, tx + tw, yy, { font: 'mono', size: 17, w: 500, align: 'right' }); K.line(tx, yy + 6, tx + tw, yy + 6, 3, 1.5, .8); });
    } };
    const big = o.layout === 'palabra', rowWord = { h: (c.dedic ? 128 : 150) + (big ? 60 : 0), draw: y => {
      const size = Math.min(big ? 200 : 140, (w - 10) / Math.max(3, K.measure(Wd, { size: 100, w: 900, font: 'display' })) * 100), cx = v.l + W / 2, cy = y + 128 + (big ? 60 : 0) - ((big ? 200 : 140) - size) * .25;
      const wo = { size, w: 900, font: 'display', align: 'center', stretch: 'condensed' }; K.txt(Wd, cx + 6, cy + 6, { ...wo, i: 3 }); K.txt(Wd, cx - 4, cy - 3, { ...wo, i: 2 });
      K.c.save(); K.c.strokeStyle = K.ink(1); K.c.lineWidth = 4; K.c.lineJoin = 'round'; K.c.font = `900 ${size}px ${R.FONTS.display}`; try { K.c.fontStretch = 'condensed'; } catch (e) {} K.c.textAlign = 'center'; K.c.strokeText(Wd, cx, cy); K.c.restore();
      K.code(custom ? 'LA PALABRA DE ESTA LÁMINA' : words.n > 1 ? `LA PALABRA MÁS REPETIDA · ${words.n} VECES` : 'LA PALABRA DE LA CANCIÓN', v.l + W / 2, y + 146 + (big ? 60 : 0), { align: 'center', size: 13 }); } };
    const dedic = (c.dedic || '').trim().slice(0, 90);
    const rowDedic = { h: dedic ? 70 : 0, draw: y => {
      if (!dedic) return; const df = fit('«' + dedic + '»', w - 70, 44, { size: 36, w: 600, font: 'hand' }, 2), bw = Math.max(...df.lines.map(l => K.measure(l.join(' '), { size: df.size, w: 600, font: 'hand' }))) + 44, bx = v.l + W / 2 - bw / 2, bh = df.lines.length * df.size * 1.05 + 20;
      K.c.save(); K.c.translate(v.l + W / 2, y + 30); K.c.rotate(-.012); K.c.translate(-(v.l + W / 2), -(y + 30));
      K.rect(bx + 6, y + 6, bw, bh, { f: 1, ft: .3, over: true }); K.rect(bx, y, bw, bh, { f: -1, s: 1, lw: 3 }); K.tape(bx - 12, y - 8, 70, 24, -.5);
      df.lines.forEach((ln, i) => K.txt(ln.join(' '), v.l + W / 2, y + 8 + df.size * .85 + i * df.size * 1.05, { font: 'hand', size: df.size, w: 600, i: 2, align: 'center' })); K.c.restore(); } };
    const gap = 14, fixedH = 56 + rowCover.h + (o.word ? rowWord.h : 0) + 30 + rowDedic.h, availTh = 856 - fixedH - 6 * 8;
    let th2 = Math.min((w - gap) / 2 * 9 / 16, (availTh - gap - 26 - 12) / 2), tw2 = th2 * 16 / 9; th2 = Math.max(60, th2); tw2 = th2 * 16 / 9;
    const thx = x0 + (w - (tw2 * 2 + gap)) / 2;                                    // centradas si hubo que achicarlas
    const rowThumbs = { h: th2 * 2 + gap + 26, draw: y => {
      for (let i = 0; i < 4; i++) { const cx = thx + (i % 2) * (tw2 + gap), cy = y + Math.floor(i / 2) * (th2 + gap + 12); slots.push({ x: cx, y: cy, w: tw2, h: th2, i });
        K.rect(cx + 6, cy + 6, tw2, th2, { f: 1, ft: .3, over: true }); K.rect(cx - 3, cy - 3, tw2 + 6, th2 + 6, { f: -1, s: 1, lw: 4 });
        if (!c.frames[i]) { K.hatch(cx, cy, tw2, th2, 1, 14, -.7, 2, .5); }
        K.code(String(i + 1).padStart(2, '0') + ' · ' + SLOTS[i].toUpperCase(), cx, cy + th2 + 14, { size: 12, tone: .8 }); } } };
    const rowFoot = { h: 30, draw: y => { const tx = 'IMPRESO EN LUMORA · RISOGRAFÍA PROCEDURAL', z = Math.min(12, w / K.measure(tx, { font: 'mono', size: 12, w: 500, ls: 1.5 }) * 12); K.code(tx, v.l + W / 2, y + 22, { align: 'center', size: z, tone: .8 }); } };
    const orden = { clasico: [rowHeader, rowCover, rowWord, rowThumbs, rowDedic, rowFoot], cartel: [rowHeader, rowWord, rowThumbs, rowCover, rowDedic, rowFoot], palabra: [rowHeader, rowWord, rowCover, rowThumbs, rowDedic, rowFoot] }[o.layout] || [rowHeader, rowCover, rowWord, rowThumbs, rowDedic, rowFoot];
    const rows = orden.filter(r => r.h && !(r === rowThumbs && !o.shots) && !(r === rowWord && !o.word) && !(r === rowFoot && !o.foot));
    const total = rows.reduce((a, r) => a + r.h, 0), air = Math.max(6, (856 - total) / (rows.length + 1));
    let y = 22 + air; for (const r of rows) { r.draw(y); y += r.h + air; }
    // grano de tinta: una post-it con la frase de la canción
    const line = c.frames.find(f => f && f.txt)?.txt; if (line && !dedic) K.postit(v.r - m - 250, 800 - (variant % 2 ? 0 : 0) - 30, 230, 92, .05, H.wrap ? [line.slice(0, 22), line.slice(22, 44)].filter(Boolean) : [line], { size: 22, fill: 3, ft: .5, font: 'hand' });
  }

  // ---------- renderizado a tamaño exacto (scale < 1 para la vista previa) ----------
  const FORMATS = { a4: [2480, 3508, 'A4 vertical'], story: [1620, 2880, '9:16'] };
  const imgOf = url => new Promise(ok => { const i = new Image(); i.onload = () => ok(i); i.onerror = () => ok(null); i.src = url; });
  async function render_(item, fmt, variant, scale) {
    const [W, Hh] = FORMATS[fmt] || FORMATS.a4; if (!POS.stage) POS.stage = new R.Stage();
    const o = resolve(item, variant), st = POS.stage; st.auto = false; st.notes = false; st.lyric = true; st.paper = PAPERS[o.paper] || null;
    const w = Math.round(W * scale), h = Math.round(Hh * scale), det = scale < .5 ? 2 : 3;
    st.setDetail(det, true); const dpr = st.dpr || 1; st.resize(w / dpr, h / dpr); st.setDetail(det, true); st.resize(w / (st.dpr || 1), h / (st.dpr || 1));
    st.setInks(o.inks);
    POS.job = { c: item, v: variant, o, n: (POS.count = (POS.count || 0) + 1) }; POS.job.n = item.num || (item.num = POS.job.n);
    st.setScene('poster', { instant: true }); st.speed = 0; st.frame(1 / 30); st.frame(1 / 30);
    const out = document.createElement('canvas'); out.width = st.canvas.width; out.height = st.canvas.height; const g = out.getContext('2d'); g.drawImage(st.canvas, 0, 0);
    // las miniaturas van encima, ya impresas
    const sK = out.height / 900, inkc = R.INKS[o.inks].i[0].map(x => Math.round(x * 255)).join(',');
    for (const sl of POS.job.slots || []) { const f = item.frames[sl.i]; if (!f) continue; const im = await imgOf(f.url); if (!im) continue;
      const px = out.width / 2 + (sl.x - 800) * sK, py = sl.y * sK, pw = sl.w * sK, ph = sl.h * sK;
      g.drawImage(im, px, py, pw, ph); g.strokeStyle = `rgb(${inkc})`; g.lineWidth = Math.max(2, 4 * sK); g.strokeRect(px, py, pw, ph); }
    st.paper = null; return out;
  }
  // una sola cola: la vista previa y el guardado comparten el mismo Stage y no pueden pisarse
  let chain = Promise.resolve();
  const render = (item, fmt = 'a4', variant = 0, scale = 1) => { const p = chain.then(() => render_(item, fmt, variant, scale)); chain = p.catch(() => {}); return p; };
  POS.render = render; POS.formats = FORMATS;
  POS.thumb = async it => (await render(it, 'a4', POS.variant || 0, .12)).toDataURL('image/jpeg', .72);

  // ---------- aviso de fin de canción y editor ----------
  const esc = t => String(t == null ? '' : t).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
  const topWords = (lines, n) => { const cnt = {}; for (const l of lines || []) for (const w of (norm(l).match(/[a-zñ']{4,}/g) || [])) if (!STOP.has(w.replace(/'/g, ''))) cnt[w] = (cnt[w] || 0) + 1; return Object.entries(cnt).sort((a, b) => b[1] - a[1] || b[0].length - a[0].length).slice(0, n).map(q => q[0]); };
  const OPT = { layout: [['clasico', 'clásico'], ['cartel', 'cartel'], ['palabra', 'palabra']], cover: [['s', 'chica'], ['m', 'media'], ['l', 'grande']], frame: [['doble', 'doble'], ['simple', 'simple'], ['ninguno', 'sin borde']], paper: [['crema', 'crema'], ['blanco', 'blanco'], ['kraft', 'kraft'], ['periodico', 'periódico']] };
  const SHOW = [['shots', 'tomas'], ['word', 'palabra'], ['facts', 'datos'], ['date', 'sello y fecha'], ['foot', 'pie']];
  const css = document.createElement('style'); css.textContent = `
    #posterToast { position:fixed; right:20px; bottom:20px; z-index:9; max-width:min(420px,calc(100vw - 40px)); padding:12px 14px; background:var(--rkp,#f7edd8); color:var(--rk1,#212b80); border:3px solid var(--rk1,#212b80); box-shadow:6px 6px 0 -1px var(--rk1,#212b80);
      font:600 13px 'Martian Mono',monospace; letter-spacing:.06em; text-transform:uppercase; opacity:0; transform:translateY(12px); transition:opacity .4s, transform .4s; pointer-events:none; }
    #posterToast.on { opacity:1; transform:none; pointer-events:auto; } #posterToast div { display:flex; gap:8px; margin-top:10px; flex-wrap:wrap; }
    #posterToast button { padding:7px 11px; border:3px solid var(--rk1,#212b80); background:var(--rkl,#faf3e4); color:var(--rk1,#212b80); font:700 12px 'Anybody',sans-serif; font-stretch:80%; text-transform:uppercase; letter-spacing:.05em; cursor:pointer; }
    #posterToast button:hover, #posterToast button[data-t=save] { background:var(--rk2,#f97a2a); }
    #posterWin { position:fixed; inset:0; z-index:33; display:none; background:rgba(33,43,128,.72); } #posterWin.on { display:flex; }
    #posterWin .pw-view { flex:1; min-width:0; display:flex; align-items:center; justify-content:center; padding:22px; } #posterWin .pw-view canvas { position:static !important; inset:auto !important; max-width:100%; max-height:100%; width:auto; height:auto; border:4px solid var(--rk1,#212b80); box-shadow:10px 10px 0 -1px var(--rk1,#212b80); background:#f4ead4; }
    #posterWin .pw-side { width:min(400px,44vw); background:var(--rkp,#f7edd8); border-left:4px solid var(--rk1,#212b80); padding:18px 18px 22px; overflow:auto; display:flex; flex-direction:column; gap:9px; font-family:'Anybody',sans-serif; color:var(--rk1,#212b80); }
    #posterWin .pw-head b { display:block; font:800 32px/1 'Anybody',sans-serif; font-stretch:70%; text-transform:uppercase; } #posterWin .pw-head span { font:500 11px 'Martian Mono',monospace; letter-spacing:.08em; text-transform:uppercase; }
    #posterWin .pw-head em { display:inline-block; margin-left:8px; padding:2px 7px; background:var(--rk2,#f97a2a); color:#fff; font:700 10px 'Martian Mono',monospace; letter-spacing:.08em; text-transform:uppercase; font-style:normal; } #posterWin .pw-head em.ok { background:var(--rk1,#212b80); }
    #posterWin h4 { margin:8px 0 0; font:500 10px 'Martian Mono',monospace; letter-spacing:.18em; text-transform:uppercase; opacity:.75; }
    #posterWin .pw-row { display:flex; flex-wrap:wrap; gap:6px; }
    #posterWin input { padding:9px 11px; border:3px solid var(--rk1,#212b80); background:#fffdf6; color:var(--rk1,#212b80); font:600 16px 'Caveat',cursive; outline:none; } #posterWin input:focus { background:#fff; border-color:var(--rk2,#f97a2a); }
    #posterWin button { padding:8px 12px; border:3px solid var(--rk1,#212b80); background:var(--rkl,#faf3e4); color:var(--rk1,#212b80); box-shadow:3px 3px 0 -1px var(--rk1,#212b80); font:700 12px 'Anybody',sans-serif; font-stretch:80%; text-transform:uppercase; letter-spacing:.05em; cursor:pointer; }
    #posterWin button:hover { background:var(--rk2,#f97a2a); } #posterWin button.on { background:var(--rk1,#212b80); color:var(--rkl,#faf3e4); } #posterWin button.sm { padding:4px 8px; font-size:11px; box-shadow:none; }
    #posterWin button.sq { width:38px; height:28px; padding:0; } #posterWin button.main { background:var(--rk2,#f97a2a); color:#fff; border-color:var(--rk1,#212b80); } #posterWin .pw-msg { font:500 11px 'Martian Mono',monospace; min-height:16px; }
    @media (max-width:820px) { #posterWin.on { flex-direction:column; } #posterWin .pw-side { width:auto; max-height:52vh; border-left:0; border-top:4px solid var(--rk1,#212b80); } }`;
  document.head.appendChild(css);
  const toast = document.createElement('div'); toast.id = 'posterToast'; document.body.appendChild(toast);
  const win = document.createElement('div'); win.id = 'posterWin'; win.setAttribute('role', 'dialog'); win.setAttribute('aria-label', 'póster de la canción'); document.body.appendChild(win);
  let toastT = 0;
  function showToast(item, auto) {
    toast.innerHTML = `<span>${auto ? 'guardado en tu colección' : 'póster listo'} · ${esc(item.name)}</span><div>${auto ? '<button data-t="edit">ver</button>' : '<button data-t="edit">personalizar</button><button data-t="save">guardar</button><button data-t="drop">descartar</button>'}</div>`;
    toast.dataset.id = item.id; toast.classList.add('on'); clearTimeout(toastT); toastT = setTimeout(() => toast.classList.remove('on'), auto ? 10000 : 26000);
  }
  toast.addEventListener('click', async e => {
    const b = e.target.closest('button'); if (!b) return; const it = POS.ready.find(x => x.id === toast.dataset.id); if (!it) return toast.classList.remove('on');
    if (b.dataset.t === 'edit') return openWin(it);
    if (b.dataset.t === 'drop') { POS.ready = POS.ready.filter(x => x !== it); return toast.classList.remove('on'); }
    if (b.dataset.t === 'save') { toast.querySelector('span').textContent = 'guardando…'; await RISOSHARE.save(it); toast.querySelector('span').textContent = 'guardado en tu colección · ' + it.name; toast.querySelector('div').innerHTML = '<button data-t="edit">ver</button>'; clearTimeout(toastT); toastT = setTimeout(() => toast.classList.remove('on'), 5000); }
  });

  const chips = (k, list, cur) => list.map(([v, t]) => `<button data-set="${k}" data-v="${v}" class="${String(cur) === v ? 'on' : ''}">${t}</button>`).join('');
  function panel(it) {
    const o = it.opts, words = topWords(it.lines, 6);
    return `<div class="pw-head"><b>póster</b><span>${esc(it.name)} · ${esc(it.artist)}</span><em id="pwEstado">${it._saved ? 'en tu colección' : 'sin guardar'}</em></div>
      <h4>texto</h4><input data-k="title" maxlength="60" placeholder="título: ${esc(it.name)}" value="${esc(o.title)}"><input data-k="artist" maxlength="40" placeholder="artista: ${esc(it.artist)}" value="${esc(o.artist)}">
      <input data-k="wordText" maxlength="18" placeholder="palabra grande (vacío: la más repetida)" value="${esc(o.wordText)}">${words.length ? `<div class="pw-row">${words.map(w => `<button data-word="${esc(w)}" class="sm">${esc(w)}</button>`).join('')}</div>` : ''}
      <input data-d="dedic" maxlength="90" placeholder="dedicatoria (opcional)" value="${esc(it.dedic || '')}">
      <h4>composición</h4><div class="pw-row">${chips('layout', OPT.layout, o.layout)}</div><h4>portada</h4><div class="pw-row">${chips('cover', OPT.cover, o.cover)}</div>
      <h4>borde</h4><div class="pw-row">${chips('frame', OPT.frame, o.frame)}</div><h4>papel</h4><div class="pw-row">${chips('paper', OPT.paper, o.paper)}</div>
      <h4>tintas</h4><div class="pw-row">${R.INKS.map((k, i) => `<button data-set="inks" data-v="${i}" class="sq ${o.inks === i ? 'on' : ''}" title="${esc(k.name)}" style="background:linear-gradient(90deg,rgb(${k.i[0].map(x => Math.round(x * 255))}) 50%,rgb(${k.i[1].map(x => Math.round(x * 255))}) 50%)"></button>`).join('')}</div>
      <h4>mostrar</h4><div class="pw-row">${SHOW.map(([k, t]) => `<button data-tg="${k}" class="${o[k] ? 'on' : ''}">${t}</button>`).join('')}</div>
      <h4>formato</h4><div class="pw-row"><button data-fmt="a4">A4</button><button data-fmt="story">9:16</button></div>
      <div class="pw-row" style="margin-top:8px"><button data-a="save" class="main">guardar en mi colección</button><button data-a="png">descargar png</button></div>
      <div class="pw-row"><button data-a="copy">copiar</button><button data-a="share">compartir</button><button data-a="link">enlace</button></div>
      <div class="pw-row"><button data-a="shuffle">sorpréndeme</button><button data-a="reset">restablecer</button><button data-a="x">cerrar</button></div><div class="pw-msg" id="pwMsg"></div>`;
  }
  function sync() {
    const o = POS.open; if (!o) return; const op = o.item.opts;
    for (const b of win.querySelectorAll('[data-set]')) b.classList.toggle('on', String(op[b.dataset.set]) === b.dataset.v);
    for (const b of win.querySelectorAll('[data-tg]')) b.classList.toggle('on', !!op[b.dataset.tg]);
    for (const b of win.querySelectorAll('[data-fmt]')) b.classList.toggle('on', b.dataset.fmt === o.fmt);
    const e = document.getElementById('pwEstado'); if (e) { e.textContent = o.item._saved ? 'en tu colección' : 'sin guardar'; e.classList.toggle('ok', !!o.item._saved); }
  }
  let rt = 0, st2 = 0;
  function refresh() {                                                                    // vista previa en baja resolución, con un respiro para no repintar a cada tecla
    clearTimeout(rt); sync();
    rt = setTimeout(async () => { const o = POS.open; if (!o) return; const cv = await render(o.item, o.fmt, 0, .28); if (POS.open !== o) return; o.canvas = cv; document.getElementById('pwView')?.replaceChildren(cv); }, 120);
    const o = POS.open; if (o && o.item._saved && window.RISOSHARE) { clearTimeout(st2); st2 = setTimeout(() => RISOSHARE.save(o.item), 1200); }   // si ya estaba en la colección, los cambios se guardan solos
  }
  async function openWin(item, fmt = 'a4', variant = POS.variant) {
    toast.classList.remove('on');
    if (!item.opts) item.opts = { ...DEF, layout: variant % 2 ? 'cartel' : 'clasico', inks: (variant >> 1) % INK_ORDER.length };     // la lámina queda con las opciones con que se ve
    else item.opts = { ...DEF, ...item.opts }; if (item.opts.inks < 0) item.opts.inks = (variant >> 1) % INK_ORDER.length;
    POS.open = { item, fmt, variant }; win.classList.add('on'); win.innerHTML = `<div class="pw-view" id="pwView"></div><div class="pw-side">${panel(item)}</div>`; refresh();
  }
  const msg = t => { const m = document.getElementById('pwMsg'); if (m) m.textContent = t; };
  const blobOf = cv => new Promise(ok => cv.toBlob(ok, 'image/png'));
  win.addEventListener('click', async e => {
    if (e.target === win || e.target.id === 'pwView') return close();
    const b = e.target.closest('button'); if (!b || !POS.open) return; const o = POS.open, it = o.item, op = it.opts, d = b.dataset;
    if (d.set) { op[d.set] = d.set === 'inks' ? +d.v : d.v; return refresh(); }
    if (d.tg) { op[d.tg] = !op[d.tg]; return refresh(); }
    if (d.word) { op.wordText = d.word; const i = win.querySelector('[data-k=wordText]'); if (i) i.value = d.word; return refresh(); }
    if (d.fmt) { o.fmt = d.fmt; return refresh(); }
    const a = d.a; if (!a) return;
    if (a === 'x') return close();
    if (a === 'reset') { it.opts = { ...DEF, layout: 'clasico', inks: 0 }; win.querySelector('.pw-side').innerHTML = panel(it); return refresh(); }
    if (a === 'shuffle') { const pick = l => l[Math.floor(Math.random() * l.length)][0]; Object.assign(op, { layout: pick(OPT.layout), cover: pick(OPT.cover), frame: pick(OPT.frame), paper: pick(OPT.paper), inks: Math.floor(Math.random() * R.INKS.length) }); return refresh(); }
    if (a === 'link') { const u = window.RISOSHARE && RISOSHARE.link(it); if (!u) return msg('sin enlace'); try { await navigator.clipboard.writeText(u); msg('enlace copiado (' + u.length + ' letras)'); } catch (err) { msg(u); } return; }
    if (a === 'save') { msg('guardando…'); await RISOSHARE.save(it); POS.ready = POS.ready.filter(x => x !== it); sync(); msg('guardado en tu colección'); window.dispatchEvent(new CustomEvent('riso:poster-guardado', { detail: it })); return; }
    msg('armando la lámina completa…'); const full = await render(it, o.fmt, 0, 1), blob = await blobOf(full), nm = `lumora-poster-${(it.opts.title || it.name || 'cancion').toLowerCase().replace(/[^a-z0-9]+/g, '-')}.png`;
    if (a === 'png') { const u = URL.createObjectURL(blob), l = document.createElement('a'); l.href = u; l.download = nm; l.click(); setTimeout(() => URL.revokeObjectURL(u), 6000); msg('descargado'); }
    if (a === 'copy') { try { await navigator.clipboard.write([new ClipboardItem({ 'image/png': blob })]); msg('copiado'); } catch (err) { msg('no se pudo copiar aquí'); } }
    if (a === 'share') { try { await navigator.share({ files: [new File([blob], nm, { type: 'image/png' })], title: it.name }); msg(''); } catch (err) { msg('compartir no está disponible aquí'); } }
    window.dispatchEvent(new CustomEvent('riso:poster-exportado', { detail: { item: it, fmt: o.fmt, variant: o.variant, canvas: full, blob } }));
  });
  win.addEventListener('input', e => {
    if (!POS.open) return; const t = e.target, it = POS.open.item;
    if (t.dataset.k) { it.opts[t.dataset.k] = t.value; refresh(); }
    else if (t.dataset.d) { it.dedic = t.value.trim().slice(0, 90); refresh(); }
  });
  win.addEventListener('change', e => { if (e.target.dataset.d && POS.open && POS.open.item._saved && window.RISOSHARE) RISOSHARE.save(POS.open.item, true); });
  win.addEventListener('keydown', e => { if (e.target.tagName === 'INPUT' && e.key === 'Enter') e.target.blur(); e.stopPropagation(); });
  const close = () => { clearTimeout(rt); win.classList.remove('on'); win.innerHTML = ''; POS.open = null; window.dispatchEvent(new CustomEvent('riso:poster-cerrado')); };
  addEventListener('keydown', e => { if (e.key === 'Escape' && win.classList.contains('on')) { e.stopImmediatePropagation(); close(); } }, true);
  POS.openWin = openWin; POS.finalize = finalize; POS.hydrate = null;

  // ajustes
  if (window.SETUI) {
    SETUI.addRow('imagen', ['poster', 'Póster al terminar', 'sw', null, 'al acabar cada canción arma una lámina imprimible con la portada y cuatro tomas del clip'], true);
    SETUI.addRow('imagen', ['posterGuardar', 'Qué hacer con el póster', 'seg', [['preguntar', 'preguntar'], ['auto', 'guardar solo']], 'preguntar: te avisa y eliges si lo guardas en tu colección. guardar solo: queda guardado sin preguntar'], 'preguntar');
  }
})();
