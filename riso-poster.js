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
    showToast(item); if (window.RISOSHARE) RISOSHARE.save(item);
    window.dispatchEvent(new CustomEvent('riso:poster-listo', { detail: item }));
  }

  // ---------- la escena del póster ----------
  const mood = c => Object.entries(c.moods).sort((a, b) => b[1] - a[1])[0]?.[0] || '';
  const INK_ORDER = [0, 1, 2, 3, 4, 5];
  R.register({ id: 'poster', name: 'póster', inks: 0, phrases: [], make: () => ({}),
    cam(cam) { cam.x = 0; cam.y = 0; cam.z = 1; cam.r = 0; },
    draw(K, s) { drawPoster(K, POS.job); } });
  R.order.splice(R.order.indexOf('poster'), 1);

  function drawPoster(K, job) {
    const { c, v: variant } = job, v = K.v, m = 34, W = v.w, sc = Math.min(1, W / 639), x0 = v.l + m, w = W - m * 2, yTop = 30;
    const slots = job.slots = [];                                                // rectángulos de las miniaturas, para pegarlas después
    K.bg(3, .05);
    // marco de la hoja
    K.rect(v.l + 12, 12, W - 24, 876, { s: 1, lw: 5 });
    K.rect(v.l + 22, 22, W - 44, 856, { s: 1, lw: 2, st: .7 });
    const dat = new Date(c.fin || Date.now()), fecha = `${dat.getFullYear()}.${String(dat.getMonth() + 1).padStart(2, '0')}.${String(dat.getDate()).padStart(2, '0')}`;
    const words = topWord(c.lines, (c.name.split(/\s+/)[0] || c.name)), Wd = (words.w || c.name).toUpperCase();
    const mm = Math.floor((c.dur || 0) / 60), ss = String(Math.floor((c.dur || 0) % 60)).padStart(2, '0');
    // ---- bloques (alto fijo cada uno); el espacio que sobra se reparte como aire ----
    const rowHeader = { h: 56, draw: y => {
      K.txt('LUMORA', x0, y + 42, { size: 46, w: 900, i: 1, font: 'display' }); K.circ(x0 + K.measure('LUMORA', { size: 46, w: 900, font: 'display' }) + 12, y + 30, 6, { f: 2 });
      K.code('LÁMINA N° ' + String(1000 + (job.n || 1)).slice(-4), v.r - m, y + 20, { align: 'right', size: 14, bg: true }); K.code(fecha, v.r - m, y + 46, { align: 'right', size: 14, i: 2 }); } };
    const coverSide = Math.round(Math.min(300, w * .5)), tx = x0 + coverSide + 26, tw = x0 + w - tx;
    const ff = fit(c.name, tw, 190, { size: 84, w: 800, font: 'display', stretch: 'condensed' }, 4), af = fit(c.artist || 'artista', tw, 60, { size: 40, w: 600, font: 'hand' }, 2);
    const facts = [['DURACIÓN', `${mm}:${ss}`], ['VERSOS', c.lines ? String(c.lines.length) : '—'], ['ESTROFAS', c.cuts ? String(c.cuts) : '—'], ['ÁNIMO', (mood(c) || '—').toUpperCase()]];
    if (c.live && c.bpm) facts.push(['TEMPO', Math.round(c.bpm) + ' BPM']);
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
    const rowWord = { h: c.dedic ? 128 : 150, draw: y => {
      const size = Math.min(140, (w - 10) / Math.max(3, K.measure(Wd, { size: 100, w: 900, font: 'display' })) * 100), cx = v.l + W / 2, cy = y + 128 - (140 - size) * .25;
      const wo = { size, w: 900, font: 'display', align: 'center', stretch: 'condensed' }; K.txt(Wd, cx + 6, cy + 6, { ...wo, i: 3 }); K.txt(Wd, cx - 4, cy - 3, { ...wo, i: 2 });
      K.c.save(); K.c.strokeStyle = K.ink(1); K.c.lineWidth = 4; K.c.lineJoin = 'round'; K.c.font = `900 ${size}px ${R.FONTS.display}`; try { K.c.fontStretch = 'condensed'; } catch (e) {} K.c.textAlign = 'center'; K.c.strokeText(Wd, cx, cy); K.c.restore();
      K.code(words.n > 1 ? `LA PALABRA MÁS REPETIDA · ${words.n} VECES` : 'LA PALABRA DE LA CANCIÓN', v.l + W / 2, y + 146, { align: 'center', size: 13 }); } };
    const dedic = (c.dedic || '').trim().slice(0, 90);
    const rowDedic = { h: dedic ? 70 : 0, draw: y => {
      if (!dedic) return; const df = fit('«' + dedic + '»', w - 70, 44, { size: 36, w: 600, font: 'hand' }, 2), bw = Math.max(...df.lines.map(l => K.measure(l.join(' '), { size: df.size, w: 600, font: 'hand' }))) + 44, bx = v.l + W / 2 - bw / 2, bh = df.lines.length * df.size * 1.05 + 20;
      K.c.save(); K.c.translate(v.l + W / 2, y + 30); K.c.rotate(-.012); K.c.translate(-(v.l + W / 2), -(y + 30));
      K.rect(bx + 6, y + 6, bw, bh, { f: 1, ft: .3, over: true }); K.rect(bx, y, bw, bh, { f: -1, s: 1, lw: 3 }); K.tape(bx - 12, y - 8, 70, 24, -.5);
      df.lines.forEach((ln, i) => K.txt(ln.join(' '), v.l + W / 2, y + 8 + df.size * .85 + i * df.size * 1.05, { font: 'hand', size: df.size, w: 600, i: 2, align: 'center' })); K.c.restore(); } };
    const gap = 14, fixedH = 56 + rowCover.h + rowWord.h + 30 + rowDedic.h, availTh = 856 - fixedH - 6 * 8;
    let th2 = Math.min((w - gap) / 2 * 9 / 16, (availTh - gap - 26 - 12) / 2), tw2 = th2 * 16 / 9; th2 = Math.max(60, th2); tw2 = th2 * 16 / 9;
    const thx = x0 + (w - (tw2 * 2 + gap)) / 2;                                    // centradas si hubo que achicarlas
    const rowThumbs = { h: th2 * 2 + gap + 26, draw: y => {
      for (let i = 0; i < 4; i++) { const cx = thx + (i % 2) * (tw2 + gap), cy = y + Math.floor(i / 2) * (th2 + gap + 12); slots.push({ x: cx, y: cy, w: tw2, h: th2, i });
        K.rect(cx + 6, cy + 6, tw2, th2, { f: 1, ft: .3, over: true }); K.rect(cx - 3, cy - 3, tw2 + 6, th2 + 6, { f: -1, s: 1, lw: 4 });
        if (!c.frames[i]) { K.hatch(cx, cy, tw2, th2, 1, 14, -.7, 2, .5); }
        K.code(String(i + 1).padStart(2, '0') + ' · ' + SLOTS[i].toUpperCase(), cx, cy + th2 + 14, { size: 12, tone: .8 }); } } };
    const rowFoot = { h: 30, draw: y => { const tx = 'IMPRESO EN LUMORA · RISOGRAFÍA PROCEDURAL', z = Math.min(12, w / K.measure(tx, { font: 'mono', size: 12, w: 500, ls: 1.5 }) * 12); K.code(tx, v.l + W / 2, y + 22, { align: 'center', size: z, tone: .8 }); } };
    const rows = (variant % 2 === 0 ? [rowHeader, rowCover, rowWord, rowThumbs, rowDedic, rowFoot] : [rowHeader, rowWord, rowThumbs, rowCover, rowDedic, rowFoot]).filter(r => r.h);
    const total = rows.reduce((a, r) => a + r.h, 0), air = Math.max(6, (856 - total) / (rows.length + 1));
    let y = 22 + air; for (const r of rows) { r.draw(y); y += r.h + air; }
    // grano de tinta: una post-it con la frase de la canción
    const line = c.frames.find(f => f && f.txt)?.txt; if (line && !dedic) K.postit(v.r - m - 250, 800 - (variant % 2 ? 0 : 0) - 30, 230, 92, .05, H.wrap ? [line.slice(0, 22), line.slice(22, 44)].filter(Boolean) : [line], { size: 22, fill: 3, ft: .5, font: 'hand' });
  }

  // ---------- renderizado a tamaño exacto ----------
  const FORMATS = { a4: [2480, 3508, 'A4 vertical'], story: [1620, 2880, '9:16'] };
  const imgOf = url => new Promise(ok => { const i = new Image(); i.onload = () => ok(i); i.onerror = () => ok(null); i.src = url; });
  async function render(item, fmt = 'a4', variant = 0) {
    const [W, Hh] = FORMATS[fmt]; if (!POS.stage) POS.stage = new R.Stage();
    const st = POS.stage; st.auto = false; st.notes = false; st.lyric = true;
    st.setDetail(3, true); const dpr = st.dpr || 1; st.resize(W / dpr, Hh / dpr); st.setDetail(3, true);
    st.resize(W / (st.dpr || 1), Hh / (st.dpr || 1));
    const inks = INK_ORDER[(variant >> 1) % INK_ORDER.length]; st.setInks(inks);
    POS.job = { c: item, v: variant, n: (POS.count = (POS.count || 0) + 1) }; POS.job.n = item.num || (item.num = POS.job.n);
    st.setScene('poster', { instant: true }); st.speed = 0; st.frame(1 / 30); st.frame(1 / 30);
    const out = document.createElement('canvas'); out.width = st.canvas.width; out.height = st.canvas.height; const g = out.getContext('2d'); g.drawImage(st.canvas, 0, 0);
    // las miniaturas van encima, ya impresas
    const sK = out.height / 900, inkc = R.INKS[inks].i[0].map(x => Math.round(x * 255)).join(',');
    for (const sl of POS.job.slots || []) { const f = item.frames[sl.i]; if (!f) continue; const im = await imgOf(f.url); if (!im) continue;
      const px = out.width / 2 + (sl.x - 800) * sK, py = sl.y * sK, pw = sl.w * sK, ph = sl.h * sK;
      g.drawImage(im, px, py, pw, ph); g.strokeStyle = `rgb(${inkc})`; g.lineWidth = Math.max(3, 4 * sK); g.strokeRect(px, py, pw, ph); }
    return out;
  }
  POS.render = render; POS.formats = FORMATS;

  // ---------- aviso y ventana ----------
  const css = document.createElement('style'); css.textContent = `
    #posterToast { position:fixed; right:20px; bottom:20px; z-index:9; padding:12px 16px; background:var(--rkp,#f7edd8); color:var(--rk1,#212b80); border:3px solid var(--rk1,#212b80); box-shadow:6px 6px 0 -1px var(--rk1,#212b80);
      font:600 13px 'Martian Mono',monospace; letter-spacing:.08em; text-transform:uppercase; cursor:pointer; opacity:0; transform:translateY(12px); transition:opacity .4s, transform .4s; pointer-events:none; }
    #posterToast.on { opacity:1; transform:none; pointer-events:auto; } #posterToast:hover { background:var(--rk2,#f97a2a); }
    #posterWin { position:fixed; inset:0; z-index:30; display:none; align-items:center; justify-content:center; gap:28px; background:rgba(33,43,128,.55); padding:20px; }
    #posterWin.on { display:flex; } #posterWin canvas { position:static !important; inset:auto !important; height:min(86vh,900px); width:auto; max-width:60vw; border:4px solid var(--rk1,#212b80); box-shadow:10px 10px 0 -1px var(--rk1,#212b80); background:#f4ead4; }
    #posterWin .pw-side { display:flex; flex-direction:column; gap:12px; min-width:220px; font-family:'Anybody',sans-serif; }
    #posterWin .pw-side b { color:var(--rkl,#faf3e4); font:800 30px/1 'Anybody',sans-serif; font-stretch:70%; text-transform:uppercase; }
    #posterWin .pw-side span { color:var(--rkl,#faf3e4); font:500 12px 'Martian Mono',monospace; letter-spacing:.08em; text-transform:uppercase; }
    #posterWin button { padding:11px 16px; border:3px solid var(--rk1,#212b80); background:var(--rkl,#faf3e4); color:var(--rk1,#212b80); box-shadow:4px 4px 0 -1px var(--rk1,#212b80); font:700 13px 'Anybody',sans-serif; font-stretch:80%; text-transform:uppercase; letter-spacing:.05em; cursor:pointer; text-align:left; }
    #posterWin input { padding:10px 12px; border:3px solid var(--rk1,#212b80); background:var(--rkl,#faf3e4); color:var(--rk1,#212b80); font:600 15px 'Caveat',cursive; outline:none; }
    #posterWin input:focus { background:#fff; }
    #posterWin button:hover { background:var(--rk2,#f97a2a); } #posterWin button.on { background:var(--rk1,#212b80); color:var(--rkl,#faf3e4); }`;
  document.head.appendChild(css);
  const toast = document.createElement('div'); toast.id = 'posterToast'; document.body.appendChild(toast);
  const win = document.createElement('div'); win.id = 'posterWin'; win.setAttribute('role', 'dialog'); win.setAttribute('aria-label', 'póster de la canción'); document.body.appendChild(win);
  let toastT = 0;
  function showToast(item) { toast.textContent = 'póster listo · ' + item.name; toast.classList.add('on'); toast.onclick = () => openWin(item); clearTimeout(toastT); toastT = setTimeout(() => toast.classList.remove('on'), 14000); }

  async function openWin(item, fmt = 'a4', variant = POS.variant) {
    toast.classList.remove('on'); POS.open = { item, fmt, variant }; win.classList.add('on'); win.innerHTML = '<div class="pw-side"><b>armando el póster…</b></div>';
    const cv = await render(item, fmt, variant); POS.open.canvas = cv;
    win.innerHTML = ''; win.append(cv);
    const side = document.createElement('div'); side.className = 'pw-side';
    side.innerHTML = `<b>póster</b><span>${item.name} · ${item.artist}</span><input id="pwDed" type="text" maxlength="90" placeholder="dedicatoria (opcional)" value="${(item.dedic || '').replace(/"/g, '&quot;')}" spellcheck="false"><button data-a="save">guardar png</button><button data-a="copy">copiar</button>${navigator.share ? '<button data-a="share">compartir</button>' : ''}<button data-a="var">otra variante</button><button data-a="link">copiar enlace</button><button data-a="col">colección</button><button data-a="fmt" class="${fmt === 'story' ? 'on' : ''}">${fmt === 'a4' ? 'pasar a 9:16' : 'pasar a a4'}</button><button data-a="x">cerrar</button><span id="pwMsg"></span>`;
    win.append(side);
  }
  const msg = t => { const m = document.getElementById('pwMsg'); if (m) m.textContent = t; };
  const blobOf = cv => new Promise(ok => cv.toBlob(ok, 'image/png'));
  win.addEventListener('click', async e => {
    if (e.target === win) return close();
    const a = e.target.closest('button')?.dataset.a; if (!a || !POS.open) return; const o = POS.open;
    if (a === 'x') return close();
    if (a === 'link') { const u = window.RISOSHARE && RISOSHARE.link(o.item); if (!u) return msg('sin enlace'); try { await navigator.clipboard.writeText(u); msg('enlace copiado (' + u.length + ' letras)'); } catch (err) { msg(u); } return; }
    if (a === 'col') { close(); return window.RISOSHARE && RISOSHARE.openGallery(); }
    if (a === 'var') { POS.variant = o.variant + 1; return openWin(o.item, o.fmt, POS.variant); }
    if (a === 'fmt') return openWin(o.item, o.fmt === 'a4' ? 'story' : 'a4', o.variant);
    const blob = await blobOf(o.canvas), nm = `lumora-poster-${(o.item.name || 'cancion').toLowerCase().replace(/[^a-z0-9]+/g, '-')}.png`;
    if (a === 'save') { const u = URL.createObjectURL(blob), l = document.createElement('a'); l.href = u; l.download = nm; l.click(); setTimeout(() => URL.revokeObjectURL(u), 6000); msg('guardado'); }
    if (a === 'copy') { try { await navigator.clipboard.write([new ClipboardItem({ 'image/png': blob })]); msg('copiado'); } catch (err) { msg('no se pudo copiar aquí'); } }
    if (a === 'share') { try { await navigator.share({ files: [new File([blob], nm, { type: 'image/png' })], title: o.item.name }); } catch (err) {} }
    window.dispatchEvent(new CustomEvent('riso:poster-exportado', { detail: { item: o.item, fmt: o.fmt, variant: o.variant, canvas: o.canvas, blob } }));
  });
  win.addEventListener('change', e => { if (e.target.id === 'pwDed' && POS.open) { const o = POS.open; o.item.dedic = e.target.value.trim().slice(0, 90); if (window.RISOSHARE) RISOSHARE.save(o.item, true); openWin(o.item, o.fmt, o.variant); } });
  win.addEventListener('keydown', e => { if (e.target.id === 'pwDed' && e.key === 'Enter') e.target.blur(); e.stopPropagation(); });
  const close = () => { win.classList.remove('on'); win.innerHTML = ''; POS.open = null; };
  addEventListener('keydown', e => { if (e.key === 'Escape' && win.classList.contains('on')) { e.stopImmediatePropagation(); close(); } }, true);
  POS.openWin = openWin; POS.finalize = finalize; POS.hydrate = null;

  // ajuste
  if (window.SETUI) SETUI.addRow('imagen', ['poster', 'Póster al terminar', 'sw', null, 'al acabar cada canción arma una lámina imprimible con la portada y cuatro tomas del clip'], true);
})();
