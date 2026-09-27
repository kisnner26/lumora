// ============================================================
// autor.js — modo autor: el editor del video, a mano y al detalle.
// El video real se ve en vivo arriba a la izquierda; abajo, la línea
// de tiempo con estrofas y versos; a la derecha, el inspector.
// Se parte del guion de Claude o de cero, todo se guarda solo en el
// puente y, cuando la canción vuelve a sonar, manda esta versión.
// Tecla e: abrir o cerrar · espacio: pausa · ⌘Z: deshacer · ←→: moverse.
// ============================================================

const AUT = { open: false, cat: null, P: null, sel: { kind: 'block', i: 0 }, hist: [], fut: [], zoom: 1, saveT: 0, wrap: null, follow: true, saved: true, q: '' };
const KEEP_OUT = new Set(['autor', 'panel', 'settings', 'stage', 'hud', 'fps']);
const SCENE_KEY = name => Object.keys(SCENE_NAME).find(k => SCENE_NAME[k] === name) || name;
const esc = t => String(t ?? '').replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
const hueOf = s => { let h = 0; for (const c of String(s)) h = (h * 31 + c.charCodeAt(0)) % 360; return h; };
const tfmt = s => { s = Math.max(0, s || 0); return Math.floor(s / 60) + ':' + String(Math.floor(s % 60)).padStart(2, '0'); };
const songDur = () => proc.dur || ext.st.dur || (IN.lines.at(-1)?.t || 60) + 10;
const blockSpan = i => [IN.cuts[i], IN.cuts[i + 1] ?? songDur()];
const lineIdx = () => IN.lines.map((l, i) => l.text && l.text.trim() ? i : -1).filter(i => i >= 0);

// ---------- estilos ----------
{ const st = document.createElement('style'); st.textContent = `
  #autor { --gold:#f4c983; --gold2:#ffb36b; --paper:#f6eee2; --mute:rgba(246,238,226,.56); --faint:rgba(246,238,226,.3); --rule:rgba(246,238,226,.1); --panel:#0e0b09;
           position:fixed; inset:0; z-index:20; pointer-events:none; display:none; color:var(--paper); font:400 13px/1.45 'Anybody',sans-serif; font-variation-settings:'wdth' 96; }
  #autor, #autor * { box-sizing:border-box; }
  body.autor #autor { display:block; }
  body.autor { background:#050403; }
  body.autor #hud, body.autor #panel { display:none !important; }
  #stage { transform-origin:0 0; }
  body.autor #stage { position:fixed; left:0; top:0; width:100vw; height:100vh; overflow:hidden; border-radius:10px; box-shadow:0 0 0 1px rgba(246,238,226,.12), 0 30px 80px rgba(0,0,0,.6); }
  #autor > * { pointer-events:auto; }
  #autor button { font:inherit; color:inherit; background:none; border:0; cursor:pointer; padding:0; }
  #autor .mono { font:400 10px 'Martian Mono',monospace; letter-spacing:.14em; text-transform:uppercase; }
  #autTop { position:absolute; left:0; right:0; top:0; height:56px; display:flex; align-items:center; gap:18px; padding:0 18px; border-bottom:1px solid var(--rule); background:var(--panel); }
  #autTop .brand { font:250 20px/1 'Anybody',sans-serif; font-variation-settings:'wdth' 150; letter-spacing:.04em; }
  #autTop .brand b { font:400 10px 'Martian Mono',monospace; letter-spacing:.2em; color:var(--gold); margin-left:10px; vertical-align:middle; }
  #autTop .song { min-width:0; flex:1; white-space:nowrap; overflow:hidden; text-overflow:ellipsis; color:var(--mute); font-size:13px; }
  #autTop .song b { color:var(--paper); font-weight:600; font-style:italic; }
  .aut-tr { display:flex; align-items:center; gap:4px; }
  .aut-tr button { width:34px; height:34px; border-radius:50%; display:grid; place-items:center; color:var(--mute); }
  .aut-tr button:hover { background:rgba(246,238,226,.08); color:var(--paper); }
  .aut-tr button.big { width:40px; height:40px; background:rgba(246,238,226,.1); color:var(--paper); }
  .aut-tr svg { width:18px; height:18px; fill:currentColor; }
  #autClock { font:400 11px 'Martian Mono',monospace; color:var(--mute); min-width:92px; text-align:center; }
  .aut-btn { padding:8px 13px !important; border-radius:9px; border:1px solid var(--rule) !important; font:400 10px 'Martian Mono',monospace !important; letter-spacing:.1em; text-transform:uppercase; color:var(--mute) !important; white-space:nowrap; }
  .aut-btn:hover { color:var(--paper) !important; border-color:rgba(246,238,226,.3) !important; }
  .aut-btn.gold { color:#1a1109 !important; background:linear-gradient(180deg,#fbe2b8,var(--gold)) !important; border-color:var(--gold) !important; }
  .aut-btn.rec { color:#ff8a7a !important; border-color:rgba(255,120,100,.4) !important; }
  .aut-btn.rec.on { background:rgba(255,90,70,.18) !important; }
  .aut-btn:disabled { opacity:.35; cursor:default; }
  #autSaved { font:400 10px 'Martian Mono',monospace; letter-spacing:.1em; text-transform:uppercase; color:var(--faint); min-width:70px; }
  #autSaved.ok { color:#a9e3b3; }

  #autIns { position:absolute; top:56px; right:0; bottom:0; width:380px; overflow:auto; background:var(--panel); border-left:1px solid var(--rule); padding:18px 20px 40px; overscroll-behavior:contain; }
  .ai-h { display:flex; align-items:center; justify-content:space-between; gap:10px; margin-bottom:6px; }
  .ai-h .mono { color:var(--gold); }
  .ai-nav { display:flex; gap:4px; }
  .ai-nav button { width:28px; height:28px; border-radius:7px; border:1px solid var(--rule) !important; color:var(--mute) !important; font:400 13px 'Martian Mono',monospace !important; }
  .ai-nav button:hover { color:var(--paper) !important; }
  .ai-title { font:800 30px/.95 'Anybody',sans-serif; font-variation-settings:'wdth' 64; margin:8px 0 14px; }
  .ai-title em { display:block; font-style:italic; font-weight:200; font-variation-settings:'wdth' 118; color:var(--mute); font-size:20px; margin-top:4px; }
  #autIns section { padding:14px 0; border-top:1px solid var(--rule); }
  #autIns h4 { margin:0 0 10px; font:400 10px 'Martian Mono',monospace; letter-spacing:.16em; text-transform:uppercase; color:var(--faint); display:flex; justify-content:space-between; }
  #autIns h4 small { font:inherit; color:var(--faint); letter-spacing:.04em; text-transform:none; }
  #autIns textarea, #autIns input[type=text], #autIns select { width:100%; background:rgba(246,238,226,.03); color:var(--paper); border:1px solid var(--rule); border-radius:9px; padding:9px 11px; font:400 13px 'Anybody',sans-serif; outline:none; }
  #autIns textarea { resize:vertical; min-height:54px; }
  #autIns textarea:focus, #autIns input:focus, #autIns select:focus { border-color:rgba(244,201,131,.5); }
  #autIns select option { background:#1a1512; }
  .chips { display:flex; flex-wrap:wrap; gap:6px; }
  .chip2 { padding:6px 10px !important; border-radius:8px; border:1px solid var(--rule) !important; color:var(--mute) !important; font-size:12px !important; transition:all .15s; }
  .chip2:hover { color:var(--paper) !important; border-color:rgba(246,238,226,.3) !important; }
  .chip2.on { color:var(--paper) !important; border-color:rgba(244,201,131,.6) !important; background:rgba(244,201,131,.12) !important; box-shadow:inset 0 0 0 1px rgba(244,201,131,.2); }
  .chip2 .x { color:var(--gold); margin-left:6px; }
  .scene-grid { display:grid; grid-template-columns:repeat(2,1fr); gap:6px; }
  .scene-grid .chip2 { text-align:left; display:flex; gap:8px; align-items:center; }
  .scene-grid i { width:10px; height:10px; border-radius:3px; flex:none; }
  .objpick { max-height:150px; overflow:auto; margin-top:8px; padding-top:2px; }
  .swatch-row { display:grid; grid-template-columns:repeat(5,1fr); gap:6px; }
  .swatch-row button { height:34px; border-radius:8px; border:1px solid rgba(255,255,255,.06) !important; font:400 9px 'Martian Mono',monospace !important; color:rgba(0,0,0,.65) !important; }
  .swatch-row button.on { box-shadow:0 0 0 2px var(--panel), 0 0 0 3px var(--gold); }
  .fad2 { display:flex; align-items:center; gap:12px; }
  .fad2 input { flex:1; accent-color:#f4c983; }
  .fad2 output { font:400 11px 'Martian Mono',monospace; color:var(--gold); min-width:26px; text-align:right; }
  .words { display:flex; flex-wrap:wrap; gap:4px; font-size:17px; line-height:1.3; }
  .words button { padding:3px 6px !important; border-radius:6px; color:var(--paper) !important; }
  .words button:hover { background:rgba(246,238,226,.08) !important; }
  .words button.on { color:#1a1109 !important; background:var(--gold) !important; font-weight:700; }
  .ai-tr { color:var(--mute); font-style:italic; margin-top:8px; font-size:13px; }
  .keyled { display:flex; align-items:center; justify-content:space-between; }
  .keyled .sw { position:relative; width:72px; height:34px; border-radius:9px; border:1px solid var(--rule) !important; }
  .keyled .sw::before { content:''; position:absolute; left:12px; top:50%; width:7px; height:7px; margin-top:-3.5px; border-radius:50%; background:rgba(246,238,226,.18); }
  .keyled .sw::after { content:'off'; position:absolute; right:12px; top:50%; transform:translateY(-50%); font:400 10px 'Martian Mono',monospace; letter-spacing:.12em; text-transform:uppercase; color:var(--faint); }
  .keyled .sw.on { border-color:rgba(244,201,131,.45) !important; background:rgba(244,201,131,.1) !important; }
  .keyled .sw.on::before { background:var(--gold); box-shadow:0 0 10px var(--gold2); } .keyled .sw.on::after { content:'on'; color:var(--gold); }
  .ai-foot { display:flex; flex-wrap:wrap; gap:6px; padding-top:14px; border-top:1px solid var(--rule); }

  #autTl { position:absolute; left:0; right:380px; bottom:0; height:236px; background:var(--panel); border-top:1px solid var(--rule); display:grid; grid-template-rows:38px 1fr; }
  .tl-bar { display:flex; align-items:center; gap:16px; padding:0 16px; border-bottom:1px solid var(--rule); color:var(--faint); }
  .tl-bar label { display:flex; align-items:center; gap:8px; }
  .tl-bar input[type=range] { width:120px; accent-color:#f4c983; }
  .tl-bar .legend { margin-left:auto; display:flex; gap:14px; }
  .tl-bar .legend i { display:inline-block; width:8px; height:8px; border-radius:2px; margin-right:6px; vertical-align:middle; }
  #tlScroll { position:relative; overflow-x:auto; overflow-y:hidden; }
  #tlInner { position:relative; height:100%; min-width:100%; }
  .tl-ruler { position:absolute; left:0; right:0; top:0; height:24px; border-bottom:1px solid var(--rule); cursor:pointer; }
  .tl-ruler span { position:absolute; top:6px; font:400 9.5px 'Martian Mono',monospace; color:var(--faint); transform:translateX(4px); }
  .tl-ruler span::before { content:''; position:absolute; left:-4px; top:-6px; width:1px; height:24px; background:var(--rule); }
  .tl-row { position:absolute; left:0; right:0; }
  .tl-blocks { top:32px; height:84px; }
  .tl-lines { top:124px; height:56px; }
  .tl-b { position:absolute; top:0; bottom:0; border-radius:8px; padding:7px 9px; overflow:hidden; cursor:pointer; border:1px solid rgba(255,255,255,.07);
          background:linear-gradient(180deg, hsla(var(--h),55%,40%,.55), hsla(var(--h),55%,24%,.5)); transition:box-shadow .15s; }
  .tl-b:hover { box-shadow:inset 0 0 0 1px rgba(246,238,226,.35); }
  .tl-b.on { box-shadow:inset 0 0 0 2px var(--gold), 0 0 20px rgba(255,179,107,.25); }
  .tl-b b { display:block; font:700 12px/1.1 'Anybody',sans-serif; font-variation-settings:'wdth' 110; white-space:nowrap; }
  .tl-b small { display:block; margin-top:3px; font-size:11px; color:rgba(246,238,226,.7); white-space:nowrap; overflow:hidden; text-overflow:ellipsis; }
  .tl-b .objs { position:absolute; left:9px; bottom:6px; display:flex; gap:3px; }
  .tl-b .objs i { width:5px; height:5px; border-radius:50%; background:rgba(246,238,226,.7); }
  .tl-b .en { position:absolute; left:0; right:0; bottom:0; height:3px; background:linear-gradient(90deg, var(--gold) var(--e), transparent var(--e)); opacity:.7; }
  .tl-l { position:absolute; top:0; bottom:0; border-radius:5px; background:rgba(246,238,226,.06); border:1px solid rgba(246,238,226,.06); cursor:pointer; overflow:hidden; padding:4px 6px; font-size:10.5px; color:var(--mute); white-space:nowrap; }
  .tl-l:hover { background:rgba(246,238,226,.12); }
  .tl-l.big { background:rgba(244,201,131,.18); border-color:rgba(244,201,131,.35); color:var(--paper); }
  .tl-l.on { box-shadow:inset 0 0 0 2px var(--gold); color:var(--paper); }
  .tl-l .dot { position:absolute; right:4px; top:4px; width:5px; height:5px; border-radius:50%; background:#8fd6ff; }
  .tl-l .kw { color:var(--gold); font-weight:700; }
  #tlHead { position:absolute; top:0; bottom:0; width:2px; margin-left:-1px; background:var(--gold); box-shadow:0 0 10px var(--gold2); pointer-events:none; z-index:3; }
  #tlHead::before { content:''; position:absolute; top:0; left:-5px; border:6px solid transparent; border-top-color:var(--gold); }
  .aut-empty { color:var(--mute); padding:30px 4px; line-height:1.6; }
  .aut-toast { position:absolute; left:50%; top:70px; transform:translateX(-50%); padding:10px 16px; border-radius:10px; background:#1b1612; border:1px solid var(--rule); color:var(--paper); font-size:13px; opacity:0; transition:opacity .3s; pointer-events:none; }
  .aut-toast.on { opacity:1; }
`; document.head.appendChild(st); }

// ---------- la estructura ----------
const ICON = { play: 'M8 5v14l11-7z', pause: 'M7 5h4v14H7zM13 5h4v14h-4z', start: 'M6 5h2v14H6zM20 5v14L9 12z', back: 'M12 5V2L7 6l5 4V7a6 6 0 1 1-6 6H4a8 8 0 1 0 8-8z', fwd: 'M12 5V2l5 4-5 4V7a6 6 0 1 0 6 6h2a8 8 0 1 1-8-8z' };
const ico = d => `<svg viewBox="0 0 24 24"><path d="${d}"/></svg>`;
const autEl = document.createElement('div'); autEl.id = 'autor';
autEl.innerHTML = `
  <header id="autTop">
    <div class="brand">lumora<b>modo autor</b></div>
    <div class="song" id="autSong"></div>
    <div class="aut-tr"><button data-act="start" title="al inicio">${ico(ICON.start)}</button><button data-act="back" title="atrás 5 s">${ico(ICON.back)}</button>
      <button data-act="play" class="big" id="autPlay" title="reproducir / pausa (espacio)">${ico(ICON.play)}</button><button data-act="fwd" title="adelante 5 s">${ico(ICON.fwd)}</button></div>
    <div id="autClock">0:00 / 0:00</div>
    <button class="aut-btn" data-act="undo" id="autUndo" title="deshacer (⌘Z)">deshacer</button>
    <button class="aut-btn" data-act="claude" title="descartar lo tuyo y volver al guion de Claude">guion de claude</button>
    <button class="aut-btn" data-act="blank" title="borrar todo y armarlo desde cero">en blanco</button>
    <button class="aut-btn rec" data-act="rec" id="autRec" title="graba el clip desde el inicio">grabar clip</button>
    <span id="autSaved">guardado</span>
    <button class="aut-btn gold" data-act="close">salir</button>
  </header>
  <aside id="autIns"></aside>
  <div id="autTl">
    <div class="tl-bar mono"><span>línea de tiempo</span><label>zoom <input type="range" id="tlZoom" min="1" max="8" step=".25" value="1"></label>
      <label><input type="checkbox" id="tlFollow" checked> seguir</label>
      <div class="legend"><span><i style="background:hsla(30,55%,45%,.8)"></i>estrofa</span><span><i style="background:rgba(244,201,131,.5)"></i>palabra gigante</span><span><i style="background:#8fd6ff;border-radius:50%"></i>objeto en el verso</span></div></div>
    <div id="tlScroll"><div id="tlInner"><div class="tl-ruler" id="tlRuler"></div><div class="tl-row tl-blocks" id="tlBlocks"></div><div class="tl-row tl-lines" id="tlLines"></div><div id="tlHead"></div></div></div>
  </div>
  <div class="aut-toast" id="autToast"></div>`;
document.body.appendChild(autEl);
const toast = t => { const el = $('autToast'); el.textContent = t; el.classList.add('on'); clearTimeout(toast.t); toast.t = setTimeout(() => el.classList.remove('on'), 2200); };

// el video real se encoge a la zona de vista previa (todo lo que no es el editor va dentro de #stage)
function stage() {
  if (AUT.wrap) return AUT.wrap;
  const w = document.createElement('div'); w.id = 'stage'; document.body.insertBefore(w, document.body.firstChild);
  const adopt = el => { if (el.nodeType === 1 && el !== w && !KEEP_OUT.has(el.id) && !/^(SCRIPT|STYLE|LINK)$/.test(el.tagName)) w.appendChild(el); };
  [...document.body.children].forEach(adopt);
  new MutationObserver(ms => { for (const m of ms) for (const n of m.addedNodes) if (n.parentNode === document.body) adopt(n); }).observe(document.body, { childList: true });
  return (AUT.wrap = w);
}
function fitStage() {
  if (!AUT.open) return;
  const aw = innerWidth - 380 - 32, ah = innerHeight - 56 - 236 - 32, k = Math.min(aw / innerWidth, ah / innerHeight);
  const x0 = 16 + (aw - innerWidth * k) / 2, y0 = 56 + 16 + (ah - innerHeight * k) / 2;
  AUT.wrap.style.transform = `translate(${x0}px, ${y0}px) scale(${k})`;
}
addEventListener('resize', () => { fitStage(); if (AUT.open) drawTimeline(); });

// ---------- el proyecto ----------
const BLANK = i => {
  const name = GENS[IN.blockGen?.[i]]?.name, sc = SCENE_KEY(name);
  return { n: i, scene: AUT.cat?.scenes[sc] ? sc : 'nebulosa', scene2: 'ninguno', objects: [], atmos: 'ninguno', mood: 'sereno', energy: 5, time: 'noche', color: 'frio', transition: 'suave', summary: '' };
};
const CLONE = (p, i) => ({ ...BLANK(i), ...p, n: i, objects: [...(p.objects || [])], scene2: p.scene2 || 'ninguno', atmos: p.atmos || 'ninguno', summary: p.summary || '' });
function fromCurrent() {
  const blocks = IN.cuts.map((_, i) => SEM.plans[i] ? CLONE(SEM.plans[i], i) : BLANK(i)), lines = {};
  for (const [i, e] of Object.entries(STORY.lines)) lines[i] = { objects: [...e.objects], word: e.word, big: e.big, person: e.person };
  return { blocks, lines, story: STORY.text || '' };
}
const lineOf = i => AUT.P.lines[i] || (AUT.P.lines[i] = { objects: [], word: '', big: false, person: '' });
function applyProject() {
  const P = AUT.P; IN.preparing = false;
  P.blocks.forEach((b, i) => applyPlan(i, { ...b, objects: [...b.objects] }));
  const text = P.story; STORY.reset();
  STORY.add({ lines: Object.entries(P.lines).map(([i, e]) => ({ i: +i, ...e })), story: text }); STORY.on = true;
  RECIPE.key = ''; SEM.blockNow = -1; IN.motifs = {};
  IN.aiState = 'guion del autor';
}
function project() { return { cuts: IN.cuts, blocks: AUT.P.blocks, lines: Object.entries(AUT.P.lines).map(([i, e]) => ({ i: +i, ...e })), story: AUT.P.story }; }
function save() {
  AUT.saved = false; $('autSaved').textContent = 'guardando'; $('autSaved').className = '';
  clearTimeout(AUT.saveT);
  AUT.saveT = setTimeout(async () => {
    try { await fetch('/autor', { method: 'POST', body: JSON.stringify({ key: autorKey(), project: project() }) }); AUT.saved = true; $('autSaved').textContent = 'guardado'; $('autSaved').className = 'ok'; }
    catch (e) { $('autSaved').textContent = 'sin guardar'; }
  }, 500);
}
// cada cambio: se anota para deshacer, se ve al instante y se guarda
function edit(fn) {
  AUT.hist.push(JSON.stringify(AUT.P)); if (AUT.hist.length > 120) AUT.hist.shift(); AUT.fut = [];
  fn(AUT.P); applyProject(); save(); render();
}
function undo(redo) {
  const from = redo ? AUT.fut : AUT.hist, to = redo ? AUT.hist : AUT.fut;
  if (!from.length) return;
  to.push(JSON.stringify(AUT.P)); AUT.P = JSON.parse(from.pop()); applyProject(); save(); render();
}

// ---------- el inspector ----------
const objLabel = k => (AUT.cat.objects[k] || k).split(' / ')[0];
function objPicker(field, max, list) {
  const q = AUT.q.toLowerCase().trim();
  const all = Object.keys(AUT.cat.objects).filter(k => MOTIF[k] && !list.includes(k) && (!q || k.includes(q) || AUT.cat.objects[k].toLowerCase().includes(q)));
  return `<div class="chips">${list.map(k => `<button class="chip2 on" data-f="${field}-del" data-v="${k}">${esc(objLabel(k))}<span class="x">×</span></button>`).join('') || '<span style="color:var(--faint)">ninguno</span>'}</div>
    ${list.length < max ? `<input type="text" data-f="q" placeholder="buscar: lluvia, corazones, avión…" value="${esc(AUT.q)}" style="margin-top:10px">
    <div class="objpick chips">${all.map(k => `<button class="chip2" data-f="${field}-add" data-v="${k}" title="${esc(AUT.cat.objects[k])}">${esc(objLabel(k))}</button>`).join('')}</div>` : ''}`;
}
const segChips = (field, opts, cur) => `<div class="chips">${opts.map(([v, t]) => `<button class="chip2 ${v === cur ? 'on' : ''}" data-f="${field}" data-v="${v}">${esc(t)}</button>`).join('')}</div>`;
function renderBlock(i) {
  const b = AUT.P.blocks[i], [a, z] = blockSpan(i), C = AUT.cat;
  const words = IN.lines.filter(l => l.text && l.t >= a && l.t < z).map(l => l.text);
  return `<div class="ai-h"><span class="mono">estrofa ${String(i + 1).padStart(2, '0')} · ${tfmt(a)} – ${tfmt(z)}</span><div class="ai-nav"><button data-act="prev">‹</button><button data-act="next">›</button></div></div>
    <div class="ai-title">${esc(SCENE_NAME[b.scene] || b.scene)}<em>${esc(words[0] || 'instrumental')}</em></div>
    <section><h4>qué cuenta <small>aparece arriba del video</small></h4><textarea data-f="summary" rows="2" placeholder="en tus palabras, qué pasa en esta estrofa">${esc(b.summary)}</textarea></section>
    <section><h4>escenario</h4><div class="scene-grid">${Object.keys(C.scenes).map(k => `<button class="chip2 ${k === b.scene ? 'on' : ''}" data-f="scene" data-v="${k}" title="${esc(C.scenes[k])}"><i style="background:hsl(${hueOf(k)} 55% 45%)"></i>${esc(SCENE_NAME[k] || k)}</button>`).join('')}</div></section>
    <section><h4>escenario secundario <small>tenue, detrás</small></h4><select data-f="scene2"><option value="ninguno">ninguno</option>${Object.keys(C.scenes).map(k => `<option value="${k}" ${k === b.scene2 ? 'selected' : ''}>${esc(SCENE_NAME[k] || k)}</option>`).join('')}</select></section>
    <section><h4>objetos <small>hasta 4, toda la estrofa</small></h4>${objPicker('obj', 4, b.objects)}</section>
    <section><h4>ambiente <small>capa suave</small></h4><select data-f="atmos"><option value="ninguno">ninguno</option>${Object.keys(C.objects).filter(k => MOTIF[k]).map(k => `<option value="${k}" ${k === b.atmos ? 'selected' : ''}>${esc(objLabel(k))}</option>`).join('')}</select></section>
    <section><h4>energía <small>brillo, cámara y luces</small></h4><div class="fad2"><input type="range" min="0" max="10" step="1" data-f="energy" value="${b.energy}"><output>${b.energy}</output></div></section>
    <section><h4>ánimo</h4>${segChips('mood', C.moods.map(m => [m, m]), b.mood)}</section>
    <section><h4>color</h4><div class="swatch-row">${C.colors.map(c => `<button class="${c === b.color ? 'on' : ''}" data-f="color" data-v="${c}" style="background:hsl(${COLOR_HUE[c]} ${c === 'oscuro' ? 30 : c === 'pastel' ? 60 : 70}% ${c === 'oscuro' ? 22 : c === 'pastel' ? 78 : 58}%)">${c}</button>`).join('')}</div></section>
    <section><h4>hora</h4>${segChips('time', C.times.map(t => [t, t]), b.time)}</section>
    <section><h4>transición al entrar</h4>${segChips('transition', Object.keys(C.transitions).map(t => [t, t]), b.transition)}</section>
    <div class="ai-foot"><button class="aut-btn" data-act="copyNext">copiar a la siguiente</button><button class="aut-btn" data-act="clearBlock">vaciar estrofa</button><button class="aut-btn" data-act="seekSel">ir aquí</button></div>`;
}
function renderLine(i) {
  const L = lineOf(i), text = IN.lines[i]?.text || '', norm = w => w.toLowerCase().replace(/[^\p{L}\p{N}'’-]/gu, '');
  const b = IN.cuts.findLastIndex(c => c <= IN.lines[i].t);
  return `<div class="ai-h"><span class="mono">verso ${i + 1} · ${tfmt(IN.lines[i].t)} · estrofa ${String(b + 1).padStart(2, '0')}</span><div class="ai-nav"><button data-act="prev">‹</button><button data-act="next">›</button></div></div>
    <section style="border-top:0"><h4>palabra clave <small>tócala</small></h4><div class="words">${text.split(/\s+/).map(w => `<button class="${L.word && norm(w) === norm(L.word) ? 'on' : ''}" data-f="word" data-v="${esc(w.replace(/[^\p{L}\p{N}'’-]/gu, ''))}">${esc(w)}</button>`).join(' ')}</div>
      ${IN.tr?.[i] ? `<div class="ai-tr">${esc(IN.tr[i])}</div>` : ''}</section>
    <section class="keyled"><h4 style="margin:0">palabra gigante en pantalla</h4><button class="sw ${L.big ? 'on' : ''}" data-f="big" ${L.word ? '' : 'disabled title="elige primero la palabra clave"'}></button></section>
    <section><h4>objetos <small>hasta 2, justo en este verso</small></h4>${objPicker('lobj', 2, L.objects)}</section>
    <section><h4>persona famosa <small>su foto aparece en el verso</small></h4><input type="text" data-f="person" value="${esc(L.person)}" placeholder="nombre exacto, por ejemplo Magic Johnson"></section>
    <div class="ai-foot"><button class="aut-btn" data-act="clearLine">vaciar verso</button><button class="aut-btn" data-act="seekSel">ir aquí</button></div>`;
}
function renderIns() {
  const ins = $('autIns'), keep = ins.scrollTop, focus = document.activeElement?.dataset?.f === 'q';
  ins.innerHTML = AUT.sel.kind === 'block' ? renderBlock(AUT.sel.i) : renderLine(AUT.sel.i);
  ins.scrollTop = keep;
  if (focus) { const q = ins.querySelector('[data-f=q]'); q?.focus(); q?.setSelectionRange(q.value.length, q.value.length); }
}
$('autIns').addEventListener('click', e => {
  const b = e.target.closest('button'); if (!b || b.disabled) return;
  const S = AUT.sel, f = b.dataset.f, v = b.dataset.v, act = b.dataset.act;
  if (act) return action(act);
  if (S.kind === 'block') {
    if (f === 'obj-add') edit(P => { const o = P.blocks[S.i].objects; if (o.length < 4) o.push(v); });
    else if (f === 'obj-del') edit(P => { P.blocks[S.i].objects = P.blocks[S.i].objects.filter(k => k !== v); });
    else if (f) edit(P => { P.blocks[S.i][f] = v; });
  } else {
    if (f === 'lobj-add') edit(() => { const o = lineOf(S.i).objects; if (o.length < 2) o.push(v); });
    else if (f === 'lobj-del') edit(() => { lineOf(S.i).objects = lineOf(S.i).objects.filter(k => k !== v); });
    else if (f === 'word') edit(() => { const L = lineOf(S.i); L.word = L.word === v ? '' : v; if (!L.word) L.big = false; });
    else if (f === 'big') edit(() => { lineOf(S.i).big = !lineOf(S.i).big; });
  }
});
$('autIns').addEventListener('input', e => {
  const t = e.target, f = t.dataset.f, S = AUT.sel; if (!f) return;
  if (f === 'q') { AUT.q = t.value; return renderIns(); }
  if (f === 'energy') { t.nextElementSibling.textContent = t.value; return; }
});
$('autIns').addEventListener('change', e => {
  const t = e.target, f = t.dataset.f, S = AUT.sel; if (!f || f === 'q') return;
  if (S.kind === 'block') edit(P => { P.blocks[S.i][f] = f === 'energy' ? +t.value : t.value; });
  else if (f === 'person') edit(() => { lineOf(S.i).person = t.value.trim(); });
});

// ---------- la línea de tiempo ----------
function drawTimeline() {
  const sc = $('tlScroll'), dur = songDur(), W = Math.max(sc.clientWidth, sc.clientWidth * AUT.zoom), pps = W / dur;
  AUT.pps = pps; $('tlInner').style.width = W + 'px';
  const step = pps > 40 ? 5 : pps > 12 ? 10 : pps > 5 ? 20 : 30;
  $('tlRuler').innerHTML = Array.from({ length: Math.floor(dur / step) + 1 }, (_, k) => `<span style="left:${k * step * pps}px">${tfmt(k * step)}</span>`).join('');
  $('tlBlocks').innerHTML = IN.cuts.map((a, i) => {
    const z = blockSpan(i)[1], b = AUT.P.blocks[i];
    return `<div class="tl-b ${AUT.sel.kind === 'block' && AUT.sel.i === i ? 'on' : ''}" data-b="${i}" style="left:${a * pps + 1}px;width:${Math.max(6, (z - a) * pps - 2)}px;--h:${hueOf(b.scene)};--e:${b.energy * 10}%">
      <b>${esc(SCENE_NAME[b.scene] || b.scene)}</b><small>${esc(b.summary || b.mood)}</small><span class="objs">${b.objects.map(() => '<i></i>').join('')}</span><span class="en"></span></div>`;
  }).join('');
  const idx = lineIdx();
  $('tlLines').innerHTML = idx.map((i, k) => {
    const l = IN.lines[i], next = IN.lines[idx[k + 1]]?.t ?? Math.min(songDur(), l.t + 4), L = AUT.P.lines[i] || {};
    const w = Math.max(4, (next - l.t) * pps - 2), kw = L.word ? l.text.replace(new RegExp(`(${L.word.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'i'), '<span class="kw">$1</span>') : esc(l.text);
    return `<div class="tl-l ${L.big ? 'big' : ''} ${AUT.sel.kind === 'line' && AUT.sel.i === i ? 'on' : ''}" data-l="${i}" style="left:${l.t * pps + 1}px;width:${w}px" title="${esc(l.text)}">${w > 40 ? kw : ''}${L.objects?.length ? '<span class="dot"></span>' : ''}</div>`;
  }).join('');
}
$('tlInner').addEventListener('click', e => {
  const b = e.target.closest('[data-b]'), l = e.target.closest('[data-l]');
  if (b) { AUT.sel = { kind: 'block', i: +b.dataset.b }; AUT.q = ''; return render(); }
  if (l) { AUT.sel = { kind: 'line', i: +l.dataset.l }; AUT.q = ''; return render(); }
  const r = $('tlInner').getBoundingClientRect(); ext.cmd('goto:' + ((e.clientX - r.left) / AUT.pps).toFixed(2));
});
$('tlInner').addEventListener('dblclick', e => { const b = e.target.closest('[data-b]'), l = e.target.closest('[data-l]'); if (b || l) action('seekSel'); });
$('tlZoom').addEventListener('input', e => { AUT.zoom = +e.target.value; drawTimeline(); });
$('tlFollow').addEventListener('change', e => { AUT.follow = e.target.checked; });
function render() { if (!AUT.open) return; renderIns(); drawTimeline(); $('autUndo').disabled = !AUT.hist.length; }

// cabezal, reloj y botones de la barra (cada cuadro)
(function loop() {
  if (AUT.open) {
    const pos = ext.active() ? ext.now() : 0, x = pos * (AUT.pps || 0), sc = $('tlScroll');
    $('tlHead').style.left = x + 'px';
    $('autClock').textContent = tfmt(pos) + ' / ' + tfmt(songDur());
    if (AUT.follow && ext.st.state === 'playing' && (x < sc.scrollLeft + 40 || x > sc.scrollLeft + sc.clientWidth - 80)) sc.scrollLeft = x - sc.clientWidth * .25;
    $('autPlay').innerHTML = ico(ext.st.state === 'playing' ? ICON.pause : ICON.play);
    $('autRec').classList.toggle('on', !!REC.on); $('autRec').textContent = REC.on ? 'detener grabación' : 'grabar clip';
  }
  requestAnimationFrame(loop);
})();

// ---------- acciones ----------
function selList() { return AUT.sel.kind === 'block' ? IN.cuts.map((_, i) => i) : lineIdx(); }
function action(a) {
  const S = AUT.sel;
  if (a === 'play') return ext.cmd('playpause');
  if (a === 'start') return ext.cmd('start');
  if (a === 'back' || a === 'fwd') return ext.cmd('goto:' + Math.max(0, ext.now() + (a === 'back' ? -5 : 5)).toFixed(2));
  if (a === 'undo') return undo(false);
  if (a === 'close') return closeAutor();
  if (a === 'prev' || a === 'next') { const L = selList(), k = L.indexOf(S.i) + (a === 'next' ? 1 : -1); if (L[k] !== undefined) { S.i = L[k]; AUT.q = ''; render(); scrollToSel(); } return; }
  if (a === 'seekSel') return ext.cmd('goto:' + Math.max(0, (S.kind === 'block' ? IN.cuts[S.i] : IN.lines[S.i].t) - .3).toFixed(2));
  if (a === 'copyNext' && S.kind === 'block' && S.i + 1 < AUT.P.blocks.length) return edit(P => { P.blocks[S.i + 1] = { ...CLONE(P.blocks[S.i], S.i + 1), summary: P.blocks[S.i + 1].summary }; });
  if (a === 'clearBlock') return edit(P => { P.blocks[S.i] = { ...BLANK(S.i), scene: P.blocks[S.i].scene }; });
  if (a === 'clearLine') return edit(P => { P.lines[S.i] = { objects: [], word: '', big: false, person: '' }; });
  if (a === 'blank') { if (!confirm('¿borrar todo y armar el video desde cero?')) return; return edit(P => { P.blocks = IN.cuts.map((_, i) => BLANK(i)); P.lines = {}; P.story = ''; }); }
  if (a === 'claude') {
    if (!confirm('¿descartar tu versión y volver al guion de Claude?')) return;
    fetch('/autor', { method: 'POST', body: JSON.stringify({ key: autorKey(), delete: true }) }).then(() => { closeAutor(true); SEM.key = ''; planSong(); toast('volviste al guion de Claude'); });
    return;
  }
  if (a === 'rec') { if (REC.on) return stopRec(); ext.cmd('start'); setTimeout(startRec, 700); toast('grabando desde el inicio: se descarga en mp4 al detener'); }
}
function scrollToSel() {
  const t = AUT.sel.kind === 'block' ? IN.cuts[AUT.sel.i] : IN.lines[AUT.sel.i].t, sc = $('tlScroll'), x = t * AUT.pps;
  if (x < sc.scrollLeft || x > sc.scrollLeft + sc.clientWidth - 60) sc.scrollLeft = x - 60;
}
autEl.querySelector('#autTop').addEventListener('click', e => { const b = e.target.closest('[data-act]'); if (b && !b.disabled) action(b.dataset.act); });

// ---------- abrir y cerrar ----------
async function openAutor() {
  if (!ext.has() || !ext.st.name) { toast('pon una canción en Música o Spotify primero'); return false; }
  if (mode !== 'proc') { startProc(); await new Promise(r => setTimeout(r, 400)); }
  if (IN.cuts.length < 2 || !lineIdx().length) { toast('esta canción todavía no tiene letra sincronizada'); return false; }
  if (!AUT.cat) try { AUT.cat = await fetch('/story?catalog=1').then(r => r.json()); } catch (e) { toast('el puente no responde'); return false; }
  stage(); AUT.open = true; document.body.classList.add('autor');
  AUT.P = fromCurrent(); AUT.hist = []; AUT.fut = [];
  const pos = ext.now(); AUT.sel = { kind: 'block', i: Math.max(0, IN.cuts.findLastIndex(c => c <= pos)) };
  $('autSong').innerHTML = `<b>${esc(ext.st.name)}</b> · ${esc(ext.st.artist)}`;
  $('autSaved').textContent = 'sin cambios'; $('autSaved').className = '';
  fitStage(); render(); scrollToSel();
  return true;
}
function closeAutor(silent) {
  AUT.open = false; document.body.classList.remove('autor');
  if (AUT.wrap) AUT.wrap.style.transform = '';
  if (!silent && AUT.hist.length) toast('tu versión quedó guardada para esta canción');
}
addEventListener('keydown', e => {
  const typing = /TEXTAREA|INPUT|SELECT/.test(document.activeElement?.tagName || '');
  if (!AUT.open) {
    if ((e.key === 'e' || e.key === 'E') && !typing && !e.metaKey && !e.ctrlKey && mode !== 'panel') { e.preventDefault(); openAutor(); }
    return;
  }
  if (e.key === 'Escape') { e.stopImmediatePropagation(); e.preventDefault(); if (typing) document.activeElement.blur(); else closeAutor(); return; }
  if (typing) return;
  if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'z') { e.preventDefault(); e.stopImmediatePropagation(); return undo(e.shiftKey); }
  if (e.key === ' ') { e.preventDefault(); e.stopImmediatePropagation(); return action('play'); }
  if (e.key === 'ArrowLeft' || e.key === 'ArrowRight') { e.preventDefault(); e.stopImmediatePropagation(); return action(e.key === 'ArrowRight' ? 'next' : 'prev'); }
  if (e.key === 'ArrowUp' || e.key === 'ArrowDown') { e.preventDefault(); e.stopImmediatePropagation(); const L = lineIdx();
    if (AUT.sel.kind === 'block') { const [a] = blockSpan(AUT.sel.i); const li = L.find(i => IN.lines[i].t >= a); if (li !== undefined) AUT.sel = { kind: 'line', i: li }; }
    else AUT.sel = { kind: 'block', i: Math.max(0, IN.cuts.findLastIndex(c => c <= IN.lines[AUT.sel.i].t)) };
    AUT.q = ''; render(); scrollToSel(); return; }
  if (e.key === 'e' || e.key === 'E') { e.preventDefault(); e.stopImmediatePropagation(); closeAutor(); }
  if (['r', 'R', 'c', 'f', 't', 'l', ',', '[', ']'].includes(e.key)) e.stopImmediatePropagation();
}, true);
// si cambia la canción con el editor abierto, se cierra (el proyecto de la anterior ya quedó guardado)
setInterval(() => { if (AUT.open && AUT.song && AUT.song !== autorKey()) closeAutor(); if (AUT.open) AUT.song = autorKey(); else AUT.song = ''; }, 1000);
window.openAutor = openAutor;
