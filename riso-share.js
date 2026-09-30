// ============================================================
// riso-share.js — capturar un verso y compartirlo con el diseño de lumora.
// Durante el lyric video: tecla v (o el botón de comillas en la barra).
// Elige el verso, el formato (historia 9:16, feed 4:5, cuadrado, 16:9) y la toma;
// la vista previa es viva. Sale como foto PNG o como video MP4 de unos segundos,
// con el verso escrito a mano, la palabra clave subrayada y el objeto que se dibuja.
// Todo se dibuja aparte, en un escenario propio del tamaño exacto: no es un recorte
// del video en vivo. El video sale sin audio (la canción se agrega al publicar).
// ============================================================
(() => {
  if (!window.RISO || !window.RISOCLIP || !RISOCLIP.h || typeof GENS === 'undefined') return;
  const R = RISO, K = R.K, RC = RISOCLIP, h = RC.h, { clamp, easeOut } = R, sin = Math.sin, cos = Math.cos;
  const FORMATS = { '9x16': [1080, 1920, '9:16 historia'], '4x5': [1080, 1350, '4:5 feed'], '1x1': [1080, 1080, '1:1'], '16x9': [1920, 1080, '16:9'] };
  const MAXV = 6;
  const SH = { open: false, a: -1, b: -1, anc: -1, fmt: '9x16', design: 'auto', salt: '', trans: true, title: true, brand: true, exp: null, raf: 0, last: 0, t0: 0, card: null, busy: false, loopT: 8, sceneState: {} };

  // ---------- la tarjeta ----------
  const lyricIdxs = () => IN.lines.map((l, i) => l.text ? i : -1).filter(i => i >= 0);
  const selIdx = () => lyricIdxs().filter(i => i >= SH.a && i <= SH.b);
  function buildCard() {
    const lines = IN.lines, sel = selIdx(); if (!sel.length) return null;
    const first = sel[0], last = sel[sel.length - 1];
    // la toma la decide el primer verso que nombra algo (un famoso, un oficio, un objeto); si ninguno, el primero
    const named = sel.find(i => R.people?.detect(lines[i].text).length || (typeof LEX !== 'undefined' && LEX.some(([, re]) => re.test(lines[i].text)))) ?? first;
    const time = lines[named].t, sec = h.secOf(time), force = SH.design === 'auto' ? undefined : SH.design === 'cover' ? 'prop' : SH.design;
    RC.salt = SH.salt; const shot = RC.cardShot(named, sec, time, force); RC.salt = '';
    const texts = [], trs = [];
    for (const i of sel) { let main = lines[i].text, tr = IN.tr?.[i] || ''; if (IN.trMode === 'es' && tr) { main = tr; tr = ''; } else if (IN.trMode === 'orig') tr = ''; texts.push(main); if (tr && SH.trans) trs.push(tr); }
    const next = lines.slice(last + 1).find(q => q.text), dur = next ? clamp(next.t - lines[first].t, 2, 12) : 5;
    if (shot.kind === 'title' || shot.kind === 'outro') shot.kind = 'prop';
    if (SH.design === 'cover') shot.kind = 'cover';
    if (shot.kind === 'prop' && !shot.props) shot.props = [{ id: 'stars', i: 0, ph: 0, rot: 0 }];
    if (shot.bg === 'panel') shot.bg = 'burst';
    return { shot, texts, trs, tr: trs.join(' / '), dur, li: first, meta: h.meta(), num: first + 1, still: false };
  }
  // los versos elegidos, uno debajo del otro, con el mismo tamaño: se achica hasta que todo cabe
  function fitStack(w, maxH, size0, font) {
    const c = SH.card, o = sz => ({ size: sz, w: font === 'display' ? 800 : 600, font, ...(font === 'display' ? { ls: 0 } : {}) });
    let size = size0, total = 0;
    for (; size >= 26; size -= 4) {
      const ls = c.texts.map(t => h.wrap(t, w, o(size)).length); total = ls.reduce((a, n) => a + n * size * 1.12, 0) + (c.texts.length - 1) * size * .3;
      if (ls.every(n => n <= 4) && total <= maxH) break;
    }
    return { size: Math.max(26, size), total };
  }
  function drawStack(x, y, w, f, age, o) {
    const c = SH.card; let cy = y;
    c.texts.forEach((t, i) => { const r = h.writeLine(t, x, cy, w, 9999, Math.max(0, age - i * .55), 3.4, { ...o, size: f.size, scribble: i === 0 && o.scribble !== false }); cy += r.h + f.size * .3; });
    return cy - y - f.size * .3;
  }
  function drawCard(K2, st, kt, dt) {
    const c = SH.card; if (!c) { K2.bg(3, .1); return; }
    const s = c.shot, v = K.v, m = 34, W = v.w, H = v.h, cx = (v.l + v.r) / 2, port = W / H < .8, sq = !port && W / H < 1.25;
    const t = c.still ? 6 : kt, age = c.still ? 99 : Math.max(0, kt - .45);
    let px, py, psc, tx, ty, tw, th;
    const footH = port || sq ? 96 : 84, footY = v.b - m - footH, nv = c.texts.length, more = Math.max(0, nv - 1);       // con varios versos el objeto se achica y el texto gana sitio
    if (port || sq) { px = cx; py = v.t + H * clamp(.3 - .03 * more, .19, .3); psc = Math.min((W - m * 2) * .92, H * clamp(.4 - .045 * more, .22, .4)) / 400; tx = v.l + m; tw = W - m * 2; ty = v.t + H * clamp((port ? .5 : .52) - .04 * more, .34, .52); th = footY - ty - 16; }
    else { px = s.flip ? v.l + W * .27 : v.r - W * .27; py = v.t + H * .46; psc = H * .62 / 400; tw = W * .44; tx = s.flip ? v.r - m - tw : v.l + m; ty = v.t + m + 70; th = H * .55; }
    s.cx = px; s.cy = py;
    if (s.kind === 'cover') {                                          // la portada del álbum, pegada como una foto
      h.drawBg(s, t);
      const art = h.artCanvas(), sz = Math.min((W - m * 2) * .86, H * (port ? .36 : .42)) * (1 - .035 * more), c2 = K.c;
      c2.save(); c2.translate(px, py); c2.rotate(-.04 + sin(t * .7) * .008);
      K.rect(-sz / 2 + 14, -sz / 2 + 14, sz, sz, { f: 1, ft: .3, over: true }); K.rect(-sz / 2 - 7, -sz / 2 - 7, sz + 14, sz + 14, { f: -1, s: 1, lw: 7 });
      if (art) { c2.save(); c2.globalCompositeOperation = 'lighter'; c2.imageSmoothingEnabled = true; c2.drawImage(art, -sz / 2, -sz / 2, sz, sz); c2.restore(); K.rect(-sz / 2, -sz / 2, sz, sz, { s: 1, lw: 5 }); }
      else R.props.drawProp(K, 'music', 0, 0, sz / 460, easeOut(clamp(t / 1.1)), { seed: s.seed });
      K.tape(-sz / 2, -sz / 2, 120, 38, -.7); K.tape(sz / 2, sz / 2, 120, 38, -.7); c2.restore();
    } else if (s.kind === 'prop') {
      h.drawBg(s, t);
      s.props.slice(0, 2).forEach((p, i) => { const off = i === 0 ? [0, 0] : [(port || sq ? 1 : (s.flip ? -1 : 1)) * W * (port ? .3 : .22), H * .14], k = clamp((t - i * .35) / 1.1);
        R.props.drawProp(K, p.id, px + off[0], py + off[1], psc * (i === 0 ? (s.props.length > 1 ? .86 : 1) : .5), easeOut(k), { seed: s.seed + i * 7, ph: p.ph, rot: p.rot }); });
      K.tape(px - psc * 190, py - psc * 240, 120, 38, -.5);
    } else if (s.kind === 'scene') {
      const sc = R.scenes[s.scene]; let state = SH.sceneState[s.scene]; if (!state) state = SH.sceneState[s.scene] = sc.make(R.rng(h.hash(s.scene + s.seed)), K) || {};
      K.c.save(); try { sc.draw(K, state, K.t, dt, R.A); } finally { K.c.restore(); }
    } else {                                                          // palabra gigante
      h.drawBg(s, t);
      const word = s.word || '', m100 = Math.max(1, K.measure(word, { size: 100, w: 900, font: 'display' })), size = Math.min(H * (port ? .3 : .42), (W - m * 2) / m100 * 100), p = easeOut(clamp(t / .35));
      K.screen(() => { const wo = { size: size * (.85 + .15 * p), w: 900, font: 'display', align: 'center', stretch: 'condensed' }, y = py + size * .34;
        K.txt(word, cx + 8, y + 8, { ...wo, i: 3, tone: .9 }); K.txt(word, cx - 5, y - 3, { ...wo, i: 2 });
        K.c.save(); K.c.strokeStyle = K.ink(1); K.c.lineWidth = 5; K.c.lineJoin = 'round'; K.c.font = `900 ${wo.size}px ${R.FONTS.display}`; try { K.c.fontStretch = 'condensed'; } catch (e) {} K.c.textAlign = 'center'; K.c.strokeText(word, cx, y); K.c.restore(); });
    }
    K.screen(() => {
      const hasTr = !!c.tr, trH = sz => { const f = h.fitText(c.tr, tw - 28 - 28, 200, { size: sz, w: 600, font: 'display', stretch: 'normal' }, 3); return f.lines.length * f.size * 1.2 + 30; };    // alto real de la caja de traducción
      if (s.kind === 'scene') {                                       // etiqueta de papel abajo
        const o = { size: port ? 54 : 62, font: 'display' }, f = fitStack(tw - 44, H * (c.tr ? .28 : .36), o.size, 'display'), bh = f.total + 40, y = footY - bh - 18;
        K.rect(tx + 8, y + 8, tw, bh, { f: 1, ft: .3, over: true }); K.rect(tx, y, tw, bh, { f: -1, s: 1, lw: 4 });
        drawStack(tx + 22, y + 6, tw - 44, f, age, { font: 'display', scribble: false });
        if (hasTr) h.trBox(c.tr, tx, y - trH(30) - 6, tw, 'left', 30);
      } else {
        const y0 = ty + (s.kind === 'giant' ? H * .1 : 0), f = fitStack(tw, th - (hasTr ? trH(28) + 14 : 0), s.kind === 'giant' ? (port ? 56 : 66) : 104, 'hand');
        const used = drawStack(tx, y0, tw, f, age, { align: port || sq ? 'left' : (s.flip ? 'right' : 'left'), keyPaper: s.bg === 'flood' });
        if (hasTr) h.trBox(c.tr, tx, Math.min(y0 + used + 14, footY - trH(28) - 10), tw, 'left', 28);
      }
      if (SH.title) {                                                  // etiqueta con la canción
        const w = tw, x = tx, y = footY, md = c.meta, tsz = Math.min(40, (w - 34) / Math.max(1, K.measure(md.title.toUpperCase(), { size: 100, w: 800, font: 'display' })) * 100);
        K.rect(x + 6, y + 6, w, footH - 8, { f: 1, ft: .3, over: true }); K.rect(x, y, w, footH - 8, { f: -1, s: 1, lw: 3.5 });
        K.txt(md.title.toUpperCase(), x + 16, y + 10 + tsz * .92, { size: tsz, w: 800, font: 'display', i: 1 });
        K.txt(md.artist, x + 16, y + footH - 22, { font: 'hand', size: 30, w: 600, i: 2 });
      }
      if (SH.brand) { K.code('LUMORA', v.r - m - 4, v.t + m + 12, { align: 'right', size: 15, bg: true }); K.code(`FIG. ${h.pad2(c.num)}`, v.l + m + 4, v.t + m + 12, { size: 15, bg: true }); }
    });
  }
  R.register({ id: 'share', name: 'verso', inks: 0, make: () => ({}), draw: (K2, s, t, dt) => drawCard(K2, s, t, dt),
    cam: (cam, t) => { const c = SH.card; if (c?.still) { cam.x = cam.y = cam.r = 0; cam.z = 1; return; } cam.x = sin(t * .3) * 8; cam.y = cos(t * .4) * 6; cam.z = 1 + Math.min(t, 8) * .004; cam.r = 0; } });
  R.order.splice(R.order.indexOf('share'), 1);

  // ---------- escenario propio ----------
  function stage() {
    if (!SH.exp) { const e = SH.exp = new R.Stage(); e.notes = false; e.lyric = false; e.auto = false; e.margin = 34; e.speed = 1; e.detail = 3; }
    return SH.exp;
  }
  // tamaño exacto en píxeles; scale < 1 para la vista previa. El escenario multiplica por dpr: se compensa para que salga justo
  function sizeTo(scale) {
    const e = stage(), [W, H] = FORMATS[SH.fmt], dpr = Math.min(window.devicePixelRatio || 1, 1.5);
    e.detail = 3; e.resize(W * scale / dpr, H * scale / dpr);
  }
  function rebuild() {
    SH.card = buildCard(); const e = stage(); SH.sceneState = {}; e.setScene('share', { instant: true }); e.setInks(SH.card ? SH.card.shot.inks : 0); SH.t0 = performance.now();
  }
  function tick(now) {
    if (!SH.open) return;
    const dt = Math.min(.05, (now - (SH.last || now)) / 1000); SH.last = now;
    const e = stage(); if (!e.ok) return;
    if (!SH.busy && e.sceneT0 != null && e.t - e.sceneT0 > SH.loopT) { e.setScene('share', { instant: true }); }   // la vista previa repite la animación
    e.setInks(SH.card ? SH.card.shot.inks : 0); e.frame(dt || .016);
    SH.raf = requestAnimationFrame(tick);
  }

  // ---------- exportación ----------
  const slug = () => ((h.meta().title || 'verso') + '-' + (h.meta().artist || '')).toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '') || 'verso';
  const save = (blob, name) => { const a = document.createElement('a'); a.href = URL.createObjectURL(blob); a.download = name; a.click(); setTimeout(() => URL.revokeObjectURL(a.href), 6000); };
  const msg = t => { const el = $('shMsg'); if (el) el.textContent = t || ''; };
  async function still() {
    const e = stage(); SH.busy = true; cancelAnimationFrame(SH.raf);
    try { sizeTo(1); SH.card.still = true; e.setScene('share', { instant: true }); e.setInks(SH.card.shot.inks); for (let i = 0; i < 4; i++) e.frame(.016);
      const blob = await new Promise(res => e.canvas.toBlob(res, 'image/png')); return blob;
    } finally { SH.card.still = false; SH.busy = false; sizeTo(.5); rebuildKeep(); SH.last = 0; SH.raf = requestAnimationFrame(tick); }
  }
  function rebuildKeep() { const e = stage(); SH.sceneState = {}; e.setScene('share', { instant: true }); e.setInks(SH.card ? SH.card.shot.inks : 0); }
  async function photo(act) {
    if (!SH.card || SH.busy) return; msg('preparando la foto…');
    const blob = await still(); if (!blob) return msg('no se pudo generar la imagen');
    const name = `verso-${slug()}-${SH.fmt}.png`;
    if (act === 'copy') { try { await navigator.clipboard.write([new ClipboardItem({ 'image/png': blob })]); msg('copiada: pégala en tu historia o mensaje'); } catch (e) { save(blob, name); msg('este navegador no deja copiar: se descargó'); } return; }
    if (act === 'share') { const f = new File([blob], name, { type: 'image/png' }); if (navigator.canShare?.({ files: [f] })) { try { await navigator.share({ files: [f], title: h.meta().title }); return msg('compartida'); } catch (e) { if (e.name === 'AbortError') return msg(''); } } }
    save(blob, name); msg('guardada: ' + name);
  }
  async function video(act) {
    if (!SH.card || SH.busy) return; const mime = typeof recMime === 'function' ? recMime() : null; if (!mime) return msg('este navegador no puede grabar video');
    const e = stage(), T = clamp(Math.max(SH.card.dur, 3 + SH.card.texts.length * .7) + 2.6, 5.5, 12), name = `verso-${slug()}-${SH.fmt}.mp4`; SH.busy = true; cancelAnimationFrame(SH.raf);
    sizeTo(1); SH.card.still = false; rebuildKeep(); e.frame(.016);
    const chunks = [], rec = new MediaRecorder(e.canvas.captureStream(30), { mimeType: mime[0], videoBitsPerSecond: 9e6 });
    rec.ondataavailable = ev => ev.data.size && chunks.push(ev.data);
    const done = new Promise(res => { rec.onstop = res; });
    rec.start(200); const t0 = performance.now(); let last = t0;
    await new Promise(res => { const step = now => { const dt = Math.min(.05, (now - last) / 1000); last = now; e.frame(dt || .016); const el = (now - t0) / 1000; msg(`grabando el video… ${Math.max(0, Math.ceil(T - el))} s`); if (el >= T) return res(); requestAnimationFrame(step); }; requestAnimationFrame(step); });
    rec.stop(); await done;
    let blob = new Blob(chunks, { type: mime[0].split(';')[0] });
    if (mime[1] !== 'mp4') { msg('convirtiendo a mp4…'); try { const r = await fetch('/convert', { method: 'POST', body: blob }); if (!r.ok) throw new Error((await r.json()).error || r.status); blob = await r.blob(); } catch (err) { SH.busy = false; sizeTo(.5); rebuild(); SH.last = 0; SH.raf = requestAnimationFrame(tick); return msg('no se pudo convertir a mp4: ' + err.message); } }
    SH.busy = false; sizeTo(.5); rebuild(); SH.last = 0; SH.raf = requestAnimationFrame(tick);
    if (act === 'share') { const f = new File([blob], name, { type: 'video/mp4' }); if (navigator.canShare?.({ files: [f] })) { try { await navigator.share({ files: [f], title: h.meta().title }); return msg('compartido'); } catch (e2) { if (e2.name === 'AbortError') return msg(''); } } }
    save(blob, name); msg('guardado: ' + name + ' · sin audio: agrégalo al publicar');
  }

  // ---------- la ventana ----------
  const css = document.createElement('style'); css.textContent = `
  #share { position:fixed; inset:0; z-index:30; display:none; background:#f4ead4; color:#212b80; font-family:'Anybody','Arial Narrow',Arial,sans-serif; user-select:none; -webkit-user-select:none; }
  #share.on { display:grid; grid-template-columns:minmax(0,1fr) min(440px,44vw); grid-template-rows:minmax(0,100vh); }
  #share::before { content:''; position:absolute; inset:0; pointer-events:none; opacity:.22; background-image:radial-gradient(#6b8fb3 1.3px, transparent 1.7px); background-size:9px 9px; }
  #share .sh-view { position:relative; display:flex; align-items:center; justify-content:center; padding:26px; min-height:0; min-width:0; overflow:hidden; }
  #share .sh-view canvas { position:static !important; inset:auto !important; z-index:auto !important; display:block; width:auto; height:auto; max-width:100%; max-height:100%; object-fit:contain; box-shadow:10px 10px 0 -1px #212b80; border:3px solid #212b80; background:#f4ead4; }
  #share .sh-side { position:relative; padding:22px 24px 22px 6px; display:flex; flex-direction:column; gap:14px; overflow:auto; min-height:0; }
  #share .sh-side > * { flex:none; }
  #share .sh-top { display:flex; align-items:flex-start; justify-content:space-between; gap:12px; }
  #share h2 { margin:0; font:800 34px/1 'Anybody',sans-serif; font-stretch:72%; text-transform:uppercase; letter-spacing:.01em; }
  #share h2 i { display:block; height:5px; width:70px; background:#f97a2a; margin-top:8px; }
  #share .sh-k { font:500 11px/1 'Martian Mono',monospace; letter-spacing:.18em; text-transform:uppercase; color:#4f6c93; margin-bottom:7px; }
  #share .sh-hint { font:500 10.5px/1.45 'Martian Mono',monospace; color:#4f6c93; margin-top:7px; letter-spacing:.02em; }
  #share .sh-k b { color:#f97a2a; font-weight:700; }
  #share .sh-verses { max-height:30vh; overflow:auto; border:3px solid #212b80; background:#f7edd8; box-shadow:5px 5px 0 -1px #212b80; }
  #share .sh-verses button { display:block; width:100%; text-align:left; border:0; border-bottom:1.5px solid rgba(33,43,128,.25); background:transparent; padding:8px 12px; font:500 15px/1.25 'Cormorant Garamond',Georgia,serif; color:#212b80; cursor:pointer; }
  #share .sh-verses button.on { background:#f97a2a; color:#fff7e8; font-weight:700; }
  #share .sh-verses button:hover:not(.on) { background:rgba(249,122,42,.2); }
  #share .sh-chips { display:flex; flex-wrap:wrap; gap:8px; }
  #share .sh-chips button, #share .sh-act button, #share .sh-close { font:700 13px/1 'Martian Mono',monospace; letter-spacing:.06em; text-transform:uppercase; color:#212b80; background:#f7edd8; border:3px solid #212b80; box-shadow:4px 4px 0 -1px #212b80; padding:9px 12px; cursor:pointer; }
  #share .sh-chips button.on { background:#212b80; color:#f7edd8; }
  #share .sh-chips button:active, #share .sh-act button:active { transform:translate(2px,2px); box-shadow:2px 2px 0 -1px #212b80; }
  #share .sh-act { display:grid; grid-template-columns:1fr 1fr; gap:10px; margin-top:4px; }
  #share .sh-act button.main { background:#f97a2a; color:#fff7e8; }
  #share .sh-act button[disabled] { opacity:.45; pointer-events:none; }
  #share .sh-msg { font:500 12px/1.4 'Martian Mono',monospace; color:#212b80; min-height:34px; }
  
  #share .sh-empty { font:italic 500 18px/1.4 'Cormorant Garamond',Georgia,serif; padding:16px; }
  #shareBtn svg { width:1em; height:1em; fill:currentColor; }
  @media (max-width:820px) { #share.on { grid-template-columns:1fr; grid-template-rows:minmax(0,46vh) 1fr; } #share .sh-side { padding:6px 18px 18px; } }`;
  document.head.appendChild(css);
  const root = document.createElement('div'); root.id = 'share'; root.setAttribute('role', 'dialog'); root.setAttribute('aria-label', 'capturar verso');
  root.innerHTML = `<div class="sh-view" id="shView"></div><div class="sh-side">
    <div class="sh-top"><h2>capturar verso<i></i></h2><button class="sh-close" id="shClose">esc</button></div>
    <div><div class="sh-k">verso · <b id="shCount"></b></div><div class="sh-verses" id="shVerses"></div><div class="sh-hint">toca el verso de al lado para sumarlo, o el primero o el último para quitarlo · mayús elige un tramo</div></div>
    <div><div class="sh-k">formato</div><div class="sh-chips" id="shFmt">${Object.entries(FORMATS).map(([k, v]) => `<button data-f="${k}">${v[2]}</button>`).join('')}</div></div>
    <div><div class="sh-k">diseño</div><div class="sh-chips" id="shDes"><button data-d="auto">auto</button><button data-d="prop">objeto</button><button data-d="giant">palabra</button><button data-d="scene">escena</button><button data-d="cover">carátula</button><button id="shRoll" title="otra variante del mismo diseño">otra</button></div></div>
    <div><div class="sh-k">incluir</div><div class="sh-chips" id="shInc"><button data-i="trans">traducción</button><button data-i="title">canción</button><button data-i="brand">marca</button></div></div>
    <div class="sh-act"><button class="main" data-a="photo">guardar foto</button><button class="main" data-a="video">grabar video</button><button data-a="copy">copiar imagen</button><button data-a="share">compartir…</button></div>
    <div class="sh-msg" id="shMsg"></div></div>`;
  document.body.appendChild(root);

  function paintSide() {
    const vs = $('shVerses'); vs.innerHTML = '';
    for (const i of lyricIdxs()) { const b = document.createElement('button'); b.dataset.li = i; b.textContent = IN.lines[i].text; if (i >= SH.a && i <= SH.b) b.classList.add('on'); vs.appendChild(b); }
    const n = selIdx().length; $('shCount').textContent = n + (n === 1 ? ' verso' : ' versos') + ' · hasta ' + MAXV;
    vs.querySelector('.on')?.scrollIntoView({ block: 'center' });
    for (const b of $('shFmt').children) b.classList.toggle('on', b.dataset.f === SH.fmt);
    for (const b of $('shDes').children) if (b.dataset.d) b.classList.toggle('on', b.dataset.d === SH.design);
    for (const b of $('shInc').children) b.classList.toggle('on', !!SH[b.dataset.i]);
  }
  function pick(li) { SH.a = SH.b = SH.anc = li; SH.salt = ''; paintSide(); rebuild(); }
  // tocar un verso pegado lo suma; tocar el primero o el último lo quita; mayús elige un tramo desde el primero
  function clickVerse(i, shift) {
    const idx = lyricIdxs(), pos = idx.indexOf(i), pa = idx.indexOf(SH.a), pb = idx.indexOf(SH.b), n = pb - pa + 1;
    if (shift) { const an = Math.max(0, idx.indexOf(SH.anc)); let lo = Math.min(an, pos), hi = Math.max(an, pos); if (hi - lo + 1 > MAXV) { if (pos > an) hi = lo + MAXV - 1; else lo = hi - MAXV + 1; } SH.a = idx[lo]; SH.b = idx[hi]; }
    else if (pos >= pa && pos <= pb) { if (n > 1 && pos === pb) SH.b = idx[pb - 1]; else if (n > 1 && pos === pa) SH.a = idx[pa + 1]; else { SH.a = SH.b = SH.anc = i; } }
    else if ((pos === pb + 1 || pos === pa - 1) && n >= MAXV) return msg('máximo ' + MAXV + ' versos: quita uno de los extremos para sumar otro');
    else if (pos === pb + 1) SH.b = i;
    else if (pos === pa - 1) SH.a = i;
    else { SH.a = SH.b = SH.anc = i; }
    SH.salt = ''; msg(''); paintSide(); rebuild();
  }
  function stepVerse(dir, extend) {
    const idx = lyricIdxs(), pa = idx.indexOf(SH.a), pb = idx.indexOf(SH.b), n = pb - pa + 1;
    if (extend) { if (dir > 0 && n < MAXV && pb < idx.length - 1) SH.b = idx[pb + 1]; else if (dir < 0 && n > 1) SH.b = idx[pb - 1]; else return; SH.salt = ''; paintSide(); rebuild(); return; }
    const np = clamp((dir > 0 ? pb : pa) + dir, 0, idx.length - 1); pick(idx[np]);
  }
  function openShare(opts) {
    if (opts && opts.design) SH.design = opts.design;
    if (SH.open || typeof mode === 'undefined' || mode !== 'proc') return;
    const idx = lyricIdxs(); if (!idx.length || !stage().ok) { if (typeof setTag === 'function') setTag(stage().ok ? 'esta canción no tiene letra para capturar' : 'el navegador no pudo iniciar WebGL'); return; }
    const cur = h.lineIdx(h.timeNow()), back = idx.filter(i => i <= (cur >= 0 ? cur : (IN.lines.findLastIndex(l => l.t <= h.timeNow() + .2)))); SH.a = SH.b = SH.anc = back.length ? back[back.length - 1] : idx[0];
    SH.open = true; root.classList.add('on'); $('shView').appendChild(stage().canvas); stage().canvas.removeAttribute('style'); stage().canvas.className = '';
    sizeTo(.5); paintSide(); rebuild(); msg(''); SH.last = 0; SH.raf = requestAnimationFrame(tick);
  }
  function closeShare() { if (!SH.open || SH.busy) return; SH.open = false; cancelAnimationFrame(SH.raf); root.classList.remove('on'); }
  root.addEventListener('click', e => {
    const b = e.target.closest('button'); if (!b) return;
    if (b.id === 'shClose') return closeShare();
    if (b.dataset.li !== undefined) return clickVerse(+b.dataset.li, e.shiftKey);
    if (b.dataset.f) { SH.fmt = b.dataset.f; sizeTo(.5); paintSide(); return rebuild(); }
    if (b.dataset.d) { SH.design = b.dataset.d; SH.salt = ''; paintSide(); return rebuild(); }
    if (b.id === 'shRoll') { SH.salt = Math.random().toString(36).slice(2, 6); return rebuild(); }
    if (b.dataset.i) { SH[b.dataset.i] = !SH[b.dataset.i]; paintSide(); return rebuild(); }
    const a = b.dataset.a; if (a === 'photo') photo('save'); else if (a === 'copy') photo('copy'); else if (a === 'share') { photo('share'); } else if (a === 'video') video('save');
  });
  addEventListener('keydown', e => {
    if (/TEXTAREA|INPUT/.test(document.activeElement?.tagName || '')) return;
    if (!SH.open) { if ((e.key === 'v' || e.key === 'V') && !e.metaKey && !e.ctrlKey && !e.altKey && typeof mode !== 'undefined' && mode === 'proc' && !document.getElementById('settings')?.classList.contains('open')) { e.stopImmediatePropagation(); openShare(); } return; }
    e.stopImmediatePropagation(); e.preventDefault();
    if (e.key === 'Escape') closeShare();
    else if (e.key === 'ArrowDown' || e.key === 'ArrowRight') stepVerse(1, e.shiftKey);
    else if (e.key === 'ArrowUp' || e.key === 'ArrowLeft') stepVerse(-1, e.shiftKey);
    else if (e.key === 'Enter') photo('save');
    else if (e.key === 'r' || e.key === 'R') { SH.salt = Math.random().toString(36).slice(2, 6); rebuild(); }
    else if (/^[1-4]$/.test(e.key)) { SH.fmt = Object.keys(FORMATS)[+e.key - 1]; sizeTo(.5); paintSide(); rebuild(); }
  }, true);

  // botón en la barra del reproductor, junto al de grabar
  const btn = document.createElement('button'); btn.id = 'shareBtn'; btn.title = 'capturar verso para historias (v)';
  btn.innerHTML = '<svg viewBox="0 0 24 24"><path d="M6.5 6A3.5 3.5 0 0 0 3 9.5V17h6.5V9.5H6.3A1 1 0 0 1 7.3 8.4V8L9.5 6zm9 0A3.5 3.5 0 0 0 12 9.5V17h6.5V9.5h-3.2a1 1 0 0 1 1-1.1V8L18.5 6z" transform="translate(1 1)"/></svg>';
  btn.addEventListener('click', () => openShare());
  $('recBtn')?.before(btn);
  // con la ventana abierta el video de atrás no se ve: no se dibuja, para que la vista previa vaya fluida
  { const _pf = procFrame; procFrame = function (t, dt) { if (SH.open) return; return _pf.apply(this, arguments); }; }
  RC.share = { open: openShare, close: closeShare, get on() { return SH.open; } };
})();
