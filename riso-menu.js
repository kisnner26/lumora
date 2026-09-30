// ============================================================
// riso-menu.js — el menú de inicio de lumora y los fondos animados.
//
// Antes de todo lo demás hay una pantalla de inicio al estilo de una consola:
// una escena ilustrada (riso.js) en movimiento constante y, encima, una fila
// horizontal de tarjetas. La seleccionada se agranda y el fondo cambia de
// escena con un corte animado. Teclado, mouse y gamepad.
//   lyric video · modo carátula · fondos animados · ajustes
// "fondos animados" abre una escena a pantalla completa, sin menú, con
// controles de velocidad, tintas y detalle (y grabación) que se ocultan solos.
// ============================================================
(() => {
  const R = RISO, stage = R.stage, $ = id => document.getElementById(id);
  const clamp = (v, a = 0, b = 1) => Math.max(a, Math.min(b, v));
  const q = new URLSearchParams(location.search + '&' + location.hash.slice(1));
  const load = (k, d) => { try { return { ...d, ...JSON.parse(localStorage.getItem(k) || '{}') }; } catch (e) { return { ...d }; } };
  const save = (k, v) => { try { localStorage.setItem(k, JSON.stringify(v)); } catch (e) {} };
  const css = (n, ...i) => `rgb(${i.map(v => Math.round(v * 255)).join(',')})`;

  // ---------- opciones del menú ----------
  const svg = p => `<svg viewBox="0 0 64 64" aria-hidden="true">${p}</svg>`;
  const OPTS = [
    { id: 'lyric', name: 'lyric video', scene: 'retrato', desc: 'la letra se vuelve video, verso por verso, con lo que suena en tu mac',
      icon: svg('<rect x="6" y="10" width="52" height="38" rx="3"/><path d="M14 22h24M14 30h30M14 38h18"/><path d="M44 36l9 6-9 6z" class="f"/><path d="M14 56h36"/>') },
    { id: 'cover', name: 'modo carátula', scene: 'cuarto', desc: 'la portada de protagonista, con vinilo que gira, letra y luces',
      icon: svg('<rect x="6" y="6" width="52" height="52" rx="3"/><circle cx="32" cy="32" r="16"/><circle cx="32" cy="32" r="5" class="f"/><path d="M40 20l8-4"/>') },
    { id: 'fx', name: 'fondos animados', scene: 'espacio', desc: 'escenas ilustradas a pantalla completa, para dejar de fondo o grabar',
      icon: svg('<rect x="6" y="10" width="52" height="42" rx="3"/><circle cx="42" cy="24" r="6" class="f"/><path d="M6 46l14-16 10 10 8-8 20 20"/><path d="M14 58h36"/>') },
    { id: 'settings', name: 'ajustes', scene: 'oficina', desc: 'calidad, color, luces y tipografía; todo se aplica en vivo',
      icon: svg('<path d="M8 16h48M8 32h48M8 48h48"/><circle cx="22" cy="16" r="5" class="f"/><circle cx="42" cy="32" r="5" class="f"/><circle cx="28" cy="48" r="5" class="f"/>') },
  ];

  // ---------- estilos ----------
  const st = document.createElement('style');
  st.textContent = `
  #home, #fx { position:fixed; inset:0; z-index:6; display:none; overflow:hidden; background:#f4ead4; color:var(--ink);
    --ink:#212b80; --ink2:#f97a2a; --ink3:#6b8fb3; --paper:#f7edd8; --b:0; --cardh:clamp(150px,19vh,232px); font-family:'Anybody','Arial Narrow',Arial,sans-serif; user-select:none; -webkit-user-select:none; }
  #home.on, #fx.on { display:block; }
  #home > canvas, #fx > canvas { position:absolute; inset:0; width:100%; height:100%; display:block; }
  :where(#home, #fx) button { font:inherit; color:inherit; cursor:pointer; }
  .hm-label { background:var(--paper); border:3px solid var(--ink); box-shadow:7px 7px 0 -1px var(--ink); position:relative; }
  .hm-label::after { content:''; position:absolute; inset:0; pointer-events:none; opacity:.16; background-image:radial-gradient(var(--ink3) 1.3px, transparent 1.7px); background-size:8px 8px; }
  /* marca */
  .hm-brand { position:absolute; left:50%; top:26px; transform:translateX(-50%) rotate(-.4deg); padding:8px 22px 9px; display:flex; align-items:baseline; gap:14px; }
  .hm-brand b { font:800 30px/1 'Anybody',sans-serif; font-stretch:75%; letter-spacing:.02em; text-transform:uppercase; }
  .hm-brand span { font:500 12px/1 'Martian Mono',monospace; letter-spacing:.16em; text-transform:uppercase; color:var(--ink3); }
  /* título de la opción */
  .hm-hero { position:absolute; left:6vw; right:6vw; bottom:calc(11vh + var(--cardh) * 1.22 + 52px); display:flex; flex-direction:column; align-items:flex-start; gap:14px; pointer-events:none; }
  .hm-kick { font:500 13px/1 'Martian Mono',monospace; letter-spacing:.2em; text-transform:uppercase; padding:8px 12px; transform:rotate(.5deg); box-shadow:5px 5px 0 -1px var(--ink); }
  .hm-h { margin:0; padding:.06em .22em .1em; font:800 clamp(38px,min(6.2vw,10.5vh),96px)/.94 'Anybody',sans-serif; font-stretch:72%; text-transform:uppercase; letter-spacing:.005em; transform:rotate(-.7deg); transform-origin:left center; }
  .hm-h.swap { animation:hmswap .34s cubic-bezier(.2,.8,.2,1); }
  @keyframes hmswap { from { transform:translateX(-26px) rotate(-.7deg); opacity:0; } to { transform:rotate(-.7deg); opacity:1; } }
  .hm-desc { font:italic 500 clamp(18px,1.9vw,26px)/1.3 'Cormorant Garamond','Iowan Old Style',Georgia,serif; max-width:min(760px,86vw); padding:8px 16px 10px; transform:rotate(.3deg); }
  .hm-desc .hw { color:var(--ink); opacity:.5; transition:opacity .15s; }
  .hm-desc .hw.past { opacity:1; }
  .hm-desc .hw.cur { opacity:1; background:linear-gradient(transparent 62%, var(--ink2) 62%, var(--ink2) 92%, transparent 92%); }
  /* fila de tarjetas */
  .hm-row { position:absolute; left:6vw; right:6vw; bottom:11vh; display:flex; align-items:flex-end; gap:20px; }
  .hm-card { flex:0 0 auto; width:calc(var(--cardh) * .84); height:var(--cardh); display:flex; flex-direction:column; justify-content:space-between; padding:14px 14px 12px; text-align:left;
    background:var(--paper); border:3px solid var(--ink); box-shadow:6px 6px 0 -1px var(--ink); transform-origin:left bottom; transition:transform .38s cubic-bezier(.2,.9,.25,1.15), margin .38s cubic-bezier(.2,.9,.25,1.15), box-shadow .3s, filter .3s; filter:saturate(.85); position:relative; overflow:hidden; }
  .hm-card::before { content:''; position:absolute; left:0; right:0; top:0; height:58%; opacity:.5; background-image:radial-gradient(var(--ink3) 1.6px, transparent 2px); background-size:9px 9px; -webkit-mask-image:linear-gradient(#000, transparent); mask-image:linear-gradient(#000, transparent); }
  .hm-card .ico { position:relative; width:52%; aspect-ratio:1; align-self:center; margin-top:8px; }
  .hm-card svg { width:100%; height:100%; fill:none; stroke:var(--ink); stroke-width:3.2; stroke-linecap:round; stroke-linejoin:round; overflow:visible; }
  .hm-card svg .f { fill:var(--ink2); stroke:var(--ink); }
  .hm-card b { position:relative; font:800 clamp(15px,min(1.6vw,2.6vh),23px)/1 'Anybody',sans-serif; font-stretch:75%; text-transform:uppercase; letter-spacing:.01em; }
  .hm-card small { position:relative; font:500 11px/1 'Martian Mono',monospace; letter-spacing:.14em; color:var(--ink3); }
  .hm-card.sel { transform:translateY(-22px) scale(calc(1.22 + var(--b) * .012)); margin-right:calc(var(--cardh) * .84 * .22 + 12px); box-shadow:9px 9px 0 -1px var(--ink); filter:none; z-index:2; }
  .hm-card.sel::after { content:''; position:absolute; left:0; right:0; top:0; height:9px; background:var(--ink2); }
  .hm-card:focus-visible { outline:4px solid var(--ink2); outline-offset:3px; }
  /* ayuda y avisos */
  .hm-hint { position:absolute; left:6vw; bottom:4.4vh; display:flex; gap:18px; align-items:center; padding:8px 14px; font:500 12px/1 'Martian Mono',monospace; letter-spacing:.08em; text-transform:uppercase; }
  .hm-hint kbd { font:inherit; padding:3px 7px; border:2px solid var(--ink); background:var(--paper); margin-right:6px; }
  .hm-toast { position:absolute; left:50%; top:96px; transform:translate(-50%, -10px); padding:12px 18px; font:500 14px/1.3 'Martian Mono',monospace; opacity:0; transition:opacity .3s, transform .3s; pointer-events:none; max-width:80vw; text-align:center; }
  .hm-toast.on { opacity:1; transform:translate(-50%, 0); }
  #home.leave > *:not(canvas) { opacity:0; transform:translateY(10px); transition:opacity .22s, transform .22s; }
  /* fondos animados */
  #fx { cursor:none; }
  #fx.ui { cursor:default; }
  .fx-bar { position:absolute; left:50%; bottom:3.4vh; transform:translate(-50%, 24px); width:min(1120px,94vw); padding:14px 18px 15px; display:flex; flex-wrap:wrap; gap:14px 26px; align-items:center; opacity:0; pointer-events:none; transition:opacity .35s, transform .35s; }
  #fx.ui .fx-bar { opacity:1; transform:translate(-50%, 0); pointer-events:auto; }
  .fx-g { display:flex; align-items:center; gap:10px; position:relative; z-index:1; }
  .fx-g > label { font:500 11px/1 'Martian Mono',monospace; letter-spacing:.16em; text-transform:uppercase; color:var(--ink3); }
  .fx-b { padding:8px 13px 9px; border:2.5px solid var(--ink); background:var(--paper); font:700 14px/1 'Anybody',sans-serif; font-stretch:80%; text-transform:uppercase; letter-spacing:.03em; box-shadow:3px 3px 0 -1px var(--ink); transition:transform .12s, box-shadow .12s, background .15s; }
  .fx-b:hover { transform:translate(-1px,-1px); box-shadow:4px 4px 0 -1px var(--ink); }
  .fx-b:active { transform:translate(2px,2px); box-shadow:1px 1px 0 -1px var(--ink); }
  .fx-b.on { background:var(--ink); color:var(--paper); }
  .fx-b.rec { background:var(--ink2); color:var(--ink); }
  .fx-name { min-width:9.5ch; text-align:center; font:800 20px/1 'Anybody',sans-serif; font-stretch:72%; text-transform:uppercase; }
  .fx-g input[type=range] { -webkit-appearance:none; appearance:none; width:150px; height:6px; background:var(--ink); border-radius:0; outline:none; }
  .fx-g input[type=range]::-webkit-slider-thumb { -webkit-appearance:none; width:16px; height:22px; background:var(--ink2); border:2.5px solid var(--ink); border-radius:0; cursor:pointer; }
  .fx-g input[type=range]::-moz-range-thumb { width:12px; height:18px; background:var(--ink2); border:2.5px solid var(--ink); border-radius:0; cursor:pointer; }
  .fx-val { font:500 13px/1 'Martian Mono',monospace; min-width:4.2ch; }
  .fx-sw { width:34px; height:26px; padding:0; border:2.5px solid var(--ink); display:flex; overflow:hidden; background:none; box-shadow:3px 3px 0 -1px var(--ink); }
  .fx-sw i { flex:1; }
  .fx-sw.on { outline:3px solid var(--ink2); outline-offset:2px; }
  .fx-info { position:absolute; left:50%; top:26px; transform:translateX(-50%); padding:9px 14px; font:500 12px/1.3 'Martian Mono',monospace; letter-spacing:.1em; text-transform:uppercase; opacity:0; transition:opacity .35s; pointer-events:none; }
  #fx.ui .fx-info { opacity:1; }
  @media (max-width:820px) { .hm-row { gap:12px; } .hm-card.sel { margin-right:26px; } .fx-g input[type=range] { width:100px; } }
  @media (prefers-reduced-motion:reduce) { .hm-card, .hm-h.swap { transition:none; animation:none; } }`;
  document.head.appendChild(st);

  // ---------- estructura ----------
  const home = document.createElement('div'); home.id = 'home'; home.setAttribute('role', 'dialog'); home.setAttribute('aria-label', 'menú de inicio');
  home.innerHTML = `
    <div class="hm-brand hm-label"><b>lumora</b><span>inicio</span></div>
    <div class="hm-hero"><div class="hm-kick hm-label" id="hmKick"></div><h1 class="hm-h hm-label" id="hmH"></h1><p class="hm-desc hm-label" id="hmDesc"></p></div>
    <div class="hm-toast hm-label" id="hmToast" role="status"></div>
    <nav class="hm-row" id="hmRow" aria-label="opciones">${OPTS.map((o, i) => `<button class="hm-card" data-i="${i}" aria-label="${o.name}"><span class="ico">${o.icon}</span><b>${o.name}</b><small>${String(i + 1).padStart(2, '0')} / ${String(OPTS.length).padStart(2, '0')}</small></button>`).join('')}</nav>
    <div class="hm-hint hm-label"><span><kbd>←</kbd><kbd>→</kbd>mover</span><span><kbd>enter</kbd>abrir</span><span><kbd>esc</kbd>atrás</span></div>`;
  document.body.appendChild(home);

  const fx = document.createElement('div'); fx.id = 'fx'; fx.setAttribute('role', 'dialog'); fx.setAttribute('aria-label', 'fondos animados');
  fx.innerHTML = `
    <div class="fx-info hm-label" id="fxInfo"></div>
    <div class="fx-bar hm-label" id="fxBar">
      <div class="fx-g"><label>escena</label><button class="fx-b" data-a="prev" title="anterior (←)">‹</button><span class="fx-name" id="fxName"></span><button class="fx-b" data-a="next" title="siguiente (→)">›</button></div>
      <div class="fx-g"><label>velocidad</label><input type="range" id="fxSpeed" min="0" max="2.5" step="0.05" aria-label="velocidad"><span class="fx-val" id="fxSpeedV"></span></div>
      <div class="fx-g"><label>tintas</label><span id="fxInks" style="display:flex;gap:8px"></span></div>
      <div class="fx-g"><label>detalle</label><span id="fxDet" style="display:flex;gap:6px"></span></div>
      <div class="fx-g"><button class="fx-b" data-a="notes" id="fxNotes">notas</button><button class="fx-b" data-a="cycle" id="fxCycle" title="cambia de escena solo">ciclo</button><button class="fx-b" data-a="rec" id="fxRec" title="grabar el fondo (r)">grabar</button><button class="fx-b" data-a="full" title="pantalla completa (f)">pantalla</button><button class="fx-b" data-a="back" title="volver (esc)">volver</button></div>
    </div>`;
  document.body.appendChild(fx);

  // ---------- el bucle: solo corre mientras se ve el menú o un fondo ----------
  const H = { on: false, sel: +(load('lumora_home', { sel: 0 }).sel) || 0, idle: 0, raf: 0, last: 0, cycleAt: 0, wordAt: 0, wi: 0, words: [] };
  const F = { on: false, scene: 'oficina', speed: 1, inks: -1, detail: 0, notes: true, cycle: false, ui: 0, rec: null, cycleAt: 0, ...load('lumora_fx', {}) };
  if (!R.scenes[F.scene]) F.scene = R.order[0];
  const active = () => H.on || F.on;
  function fit() { stage.resize(innerWidth, innerHeight); }
  addEventListener('resize', () => { if (active()) fit(); });
  function loop(t0) {
    H.raf = 0; if (!active()) return;
    const dt = Math.min(.25, (t0 - (H.last || t0)) / 1000); H.last = t0;
    stage.frame(dt);
    const root = H.on ? home : fx;
    root.style.setProperty('--b', R.A.beat.toFixed(3));
    padTick(dt);
    if (H.on) homeTick(dt); else fxTick(dt);
    H.raf = requestAnimationFrame(loop);
  }
  function run() { if (!H.raf) { H.last = 0; H.raf = requestAnimationFrame(loop); } }
  // cuando el menú está encima, la bienvenida de abajo no gasta cuadros
  if (typeof welcomeBg === 'function') { const _wb = welcomeBg; welcomeBg = function (t, dt) { if (active()) return; _wb(t, dt); }; }

  // ---------- tintas de la escena => colores del menú ----------
  function paintInks(root) {
    const set = R.INKS[stage.inks >= 0 ? stage.inks : (R.scenes[stage.cut ? stage.cut.to : stage.sceneId]?.inks ?? 0)] || R.INKS[0];
    root.style.setProperty('--ink', css('', ...set.i[0])); root.style.setProperty('--ink2', css('', ...set.i[1])); root.style.setProperty('--ink3', css('', ...set.i[2]));
    root.style.setProperty('--paper', css('', set.paper[0] * 1.01, set.paper[1] * 1.02, set.paper[2] * 1.03));
  }

  // ============================================================
  // menú de inicio
  // ============================================================
  const toast = txt => { const el = $('hmToast'); el.textContent = txt; el.classList.add('on'); clearTimeout(toast.t); toast.t = setTimeout(() => el.classList.remove('on'), 3400); };
  function setDesc(txt) { H.words = txt.split(' '); H.wi = 0; H.wordAt = 0; $('hmDesc').innerHTML = H.words.map(w => `<span class="hw">${w}</span>`).join(' '); }
  function select(i, o = {}) {
    i = (i + OPTS.length) % OPTS.length; const changed = i !== H.sel; H.sel = i; H.idle = 0; save('lumora_home', { sel: i });
    const op = OPTS[i];
    [...$('hmRow').children].forEach((c, k) => { c.classList.toggle('sel', k === i); c.setAttribute('aria-current', k === i ? 'true' : 'false'); });
    $('hmKick').textContent = `${String(i + 1).padStart(2, '0')} · ${op.id === 'fx' ? 'producto estrella' : 'lumora'}`;
    const h = $('hmH'); h.textContent = op.name; if (changed) { h.classList.remove('swap'); void h.offsetWidth; h.classList.add('swap'); }
    setDesc(op.desc);
    if (changed || o.force) stage.setScene(op.scene, o.instant ? { instant: true } : {});
    paintInks(home);
  }
  function homeTick(dt) {
    // la descripción se resalta palabra por palabra, al compás
    H.wordAt += dt; const per = 60 / (R.A.bpm || 88) * .55;
    if (H.wordAt > per) { H.wordAt = 0; H.wi = (H.wi + 1) % (H.words.length + 3); const els = $('hmDesc').children; for (let k = 0; k < els.length; k++) els[k].className = 'hw' + (k < H.wi - 1 ? ' past' : k === H.wi - 1 ? ' cur' : ''); }
    // sin tocar nada, el fondo rota entre las escenas
    H.idle += dt; if (H.idle > 16) { H.idle = 0; const cur = R.order.indexOf(stage.cut ? stage.cut.to : stage.sceneId); stage.setScene(R.order[(cur + 1) % R.order.length]); paintInks(home); }
  }
  home.querySelector('#hmRow').addEventListener('pointermove', e => { const c = e.target.closest('.hm-card'); if (c && +c.dataset.i !== H.sel) select(+c.dataset.i); H.idle = 0; });
  home.querySelector('#hmRow').addEventListener('click', e => { const c = e.target.closest('.hm-card'); if (c) { select(+c.dataset.i); open(OPTS[+c.dataset.i].id); } });
  home.addEventListener('pointermove', () => { H.idle = 0; });

  function showHome(o = {}) {
    if (F.on) hideFx(true);
    H.on = true; home.classList.remove('leave'); home.classList.add('on'); home.prepend(stage.canvas); stage.canvas.removeAttribute('style');
    stage.margin = 34; stage.notes = true; stage.lyric = true; stage.speed = 1; stage.setInks(-1); stage.auto = true; stage.setDetail(3, true); fit();
    select(H.sel, { force: true, instant: !stage.sceneId || o.instant });
    run();
  }
  function hideHome() { H.on = false; home.classList.remove('on', 'leave'); }
  function open(id) {
    home.classList.add('leave');
    setTimeout(() => {
      if (id === 'lyric') { hideHome(); if (window.ext && ext.has && ext.has() && $('proc')) $('proc').click(); }
      else if (id === 'cover') {
        if (typeof toggleCover === 'function' && window.ext && ext.artUrl) { hideHome(); toggleCover(true); }
        else { home.classList.remove('leave'); toast('el modo carátula necesita una canción sonando en Música o Spotify'); }
      }
      else if (id === 'fx') { hideHome(); showFx(); }
      else if (id === 'settings') { home.classList.remove('leave'); if (typeof toggleSettings === 'function') toggleSettings(true); }
    }, id === 'settings' ? 0 : 230);
  }

  // ============================================================
  // fondos animados: una escena a pantalla completa, sin menú
  // ============================================================
  const DETAIL = [['auto', 0], ['bajo', 1], ['medio', 2], ['alto', 3]];
  function buildFxUI() {
    $('fxInks').innerHTML = `<button class="fx-b" data-ink="-1" title="las tintas propias de la escena">auto</button>` + R.INKS.map((s, i) => `<button class="fx-sw" data-ink="${i}" title="${s.name}" aria-label="${s.name}">${s.i.map(c => `<i style="background:${css('', ...c)}"></i>`).join('')}</button>`).join('');
    $('fxDet').innerHTML = DETAIL.map(([n, v]) => `<button class="fx-b" data-det="${v}">${n}</button>`).join('');
  }
  buildFxUI();
  function fxSync() {
    save('lumora_fx', { scene: F.scene, speed: F.speed, inks: F.inks, detail: F.detail, notes: F.notes, cycle: F.cycle });
    $('fxName').textContent = R.scenes[F.scene].name; $('fxSpeed').value = F.speed; $('fxSpeedV').textContent = F.speed === 0 ? 'pausa' : F.speed.toFixed(2).replace(/0$/, '') + '×';
    for (const b of $('fxInks').children) b.classList.toggle('on', +b.dataset.ink === F.inks);
    for (const b of $('fxDet').children) b.classList.toggle('on', +b.dataset.det === F.detail);
    $('fxNotes').classList.toggle('on', F.notes); $('fxCycle').classList.toggle('on', F.cycle); $('fxRec').classList.toggle('rec', !!F.rec); $('fxRec').textContent = F.rec ? 'detener' : 'grabar';
    paintInks(fx);
    const idx = R.order.indexOf(F.scene) + 1;
    $('fxInfo').textContent = `fig. ${String(idx).padStart(2, '0')} / ${R.scenes[F.scene].name} · ${R.INKS[F.inks >= 0 ? F.inks : R.scenes[F.scene].inks].name} · ${stage.detail === 3 ? 'detalle alto' : stage.detail === 2 ? 'detalle medio' : 'detalle bajo'}`;
  }
  function fxApply(o = {}) {
    stage.margin = 34; stage.notes = F.notes; stage.lyric = false; stage.speed = F.speed; stage.setInks(F.inks);
    stage.auto = F.detail === 0; stage.setDetail(F.detail === 0 ? 3 : F.detail, true);
    if (o.scene) stage.setScene(F.scene, o.instant ? { instant: true } : {});
    fxSync();
  }
  function fxScene(dir) { const n = R.order.length; F.scene = R.order[(R.order.indexOf(F.scene) + dir + n) % n]; F.cycleAt = 0; fxApply({ scene: true }); setTimeout(fxSync, 240); }
  function showFx() {
    F.on = true; fx.classList.add('on'); fx.prepend(stage.canvas); stage.canvas.removeAttribute('style'); fit();
    F.ui = 3.5; fx.classList.add('ui'); stage.setScene(F.scene, { instant: true }); fxApply(); run();
  }
  function hideFx(silent) {
    if (F.rec) fxRecToggle(); F.on = false; fx.classList.remove('on', 'ui');
    if (!silent) showHome({ instant: false });
  }
  function fxTick(dt) {
    if (F.ui > 0) { F.ui -= dt; if (F.ui <= 0 && !$('fxBar').matches(':hover') && document.activeElement?.tagName !== 'INPUT') fx.classList.remove('ui'); }
    if (F.cycle) { F.cycleAt += dt; if (F.cycleAt > 18) { F.cycleAt = 0; fxScene(1); } }
  }
  const poke = () => { if (!F.on) return; F.ui = 3.5; fx.classList.add('ui'); };
  fx.addEventListener('pointermove', poke); fx.addEventListener('pointerdown', poke);
  $('fxBar').addEventListener('click', e => {
    const b = e.target.closest('button'); if (!b) return; poke();
    if (b.dataset.ink !== undefined) { F.inks = +b.dataset.ink; fxApply(); }
    else if (b.dataset.det !== undefined) { F.detail = +b.dataset.det; fxApply(); }
    else fxAction(b.dataset.a);
  });
  $('fxSpeed').addEventListener('input', e => { F.speed = +e.target.value; fxApply(); });
  function fxAction(a) {
    if (a === 'prev') fxScene(-1); else if (a === 'next') fxScene(1);
    else if (a === 'notes') { F.notes = !F.notes; fxApply(); } else if (a === 'cycle') { F.cycle = !F.cycle; F.cycleAt = 0; fxSync(); }
    else if (a === 'rec') fxRecToggle();
    else if (a === 'full') { document.fullscreenElement ? document.exitFullscreen() : document.documentElement.requestFullscreen?.(); }
    else if (a === 'back') hideFx();
  }
  // grabar el fondo tal cual, sin la interfaz (webm o mp4 según el navegador)
  function fxRecToggle() {
    if (F.rec) { try { F.rec.stop(); } catch (e) {} return; }
    if (!window.MediaRecorder || !stage.canvas.captureStream) { $('fxInfo').textContent = 'este navegador no puede grabar el lienzo'; return; }
    const mt = ['video/mp4;codecs=avc1', 'video/webm;codecs=vp9', 'video/webm'].find(m => MediaRecorder.isTypeSupported(m)) || '';
    const chunks = [], rec = new MediaRecorder(stage.canvas.captureStream(60), mt ? { mimeType: mt, videoBitsPerSecond: 14e6 } : {});
    rec.ondataavailable = e => e.data.size && chunks.push(e.data);
    rec.onstop = () => { F.rec = null; const ext2 = /mp4/.test(rec.mimeType) ? 'mp4' : 'webm', a = document.createElement('a'); a.href = URL.createObjectURL(new Blob(chunks, { type: rec.mimeType })); a.download = `lumora-fondo-${F.scene}-${Date.now()}.${ext2}`; a.click(); setTimeout(() => URL.revokeObjectURL(a.href), 5000); fxSync(); };
    rec.start(1000); F.rec = rec; fxSync();
  }

  // ============================================================
  // teclado y gamepad
  // ============================================================
  addEventListener('keydown', e => {
    const typing = /TEXTAREA|INPUT|SELECT/.test(document.activeElement?.tagName || '') && document.activeElement.type !== 'range';
    if (e.metaKey || e.ctrlKey || e.altKey || typing) return;
    const k = e.key;
    if (H.on) {
      if (k === 'ArrowRight' || k === 'd') select(H.sel + 1); else if (k === 'ArrowLeft' || k === 'a') select(H.sel - 1);
      else if (k === 'Enter' || k === ' ') open(OPTS[H.sel].id);
      else if (/^[1-4]$/.test(k)) { select(+k - 1); open(OPTS[+k - 1].id); }
      else if (k === ',' || k === 'f') return;                                      // los atajos de siempre siguen
      else if (k === 'Escape') { return; }
      else return;
      e.preventDefault(); e.stopImmediatePropagation(); return;
    }
    if (F.on) {
      poke();
      if (k === 'ArrowRight') fxScene(1); else if (k === 'ArrowLeft') fxScene(-1);
      else if (k === 'ArrowUp') { F.speed = clamp(Math.round((F.speed + .1) * 20) / 20, 0, 2.5); fxApply(); }
      else if (k === 'ArrowDown') { F.speed = clamp(Math.round((F.speed - .1) * 20) / 20, 0, 2.5); fxApply(); }
      else if (k === 'i') { F.inks = F.inks + 1 >= R.INKS.length ? -1 : F.inks + 1; fxApply(); }
      else if (k === 'd') { F.detail = (F.detail + 1) % 4; fxApply(); }
      else if (k === 'n') { F.notes = !F.notes; fxApply(); } else if (k === 'c') { F.cycle = !F.cycle; fxSync(); }
      else if (k === 'r') fxRecToggle(); else if (k === 'h') { F.ui = 0; fx.classList.remove('ui'); }
      else if (k === ' ') { F.speed = F.speed === 0 ? 1 : 0; fxApply(); }
      else if (k === 'Escape') hideFx();
      else if (k === 'f' || k === ',') return;
      else return;
      e.preventDefault(); e.stopImmediatePropagation(); return;
    }
    // desde la bienvenida de siempre, esc vuelve al menú
    if (k === 'Escape' && typeof mode !== 'undefined' && mode === 'panel' && !$('panel').classList.contains('drawer') && !(typeof coverOpen !== 'undefined' && coverOpen)) { e.stopImmediatePropagation(); showHome(); }
  }, true);

  const pad = { held: {}, rep: 0 };
  function padTick(dt) {
    const gp = (navigator.getGamepads ? [...navigator.getGamepads()].find(g => g && g.connected) : null); if (!gp) return;
    const b = i => !!gp.buttons[i]?.pressed, ax = gp.axes[0] || 0;
    const now = { l: b(14) || ax < -.55, r: b(15) || ax > .55, a: b(0), back: b(1), lb: b(4), rb: b(5), up: b(12) || (gp.axes[1] || 0) < -.6, dn: b(13) || (gp.axes[1] || 0) > .6 };
    pad.rep -= dt;
    const edge = k => now[k] && !pad.held[k], rep = k => now[k] && (!pad.held[k] || pad.rep < 0);
    let fired = false;
    if (H.on) {
      if (rep('r')) { select(H.sel + 1); fired = true; } else if (rep('l')) { select(H.sel - 1); fired = true; }
      if (edge('a')) open(OPTS[H.sel].id);
    } else if (F.on) {
      poke();
      if (edge('rb') || rep('r')) { fxScene(1); fired = true; } else if (edge('lb') || rep('l')) { fxScene(-1); fired = true; }
      if (rep('up')) { F.speed = clamp(F.speed + .1, 0, 2.5); fxApply(); fired = true; } else if (rep('dn')) { F.speed = clamp(F.speed - .1, 0, 2.5); fxApply(); fired = true; }
      if (edge('a')) { F.inks = F.inks + 1 >= R.INKS.length ? -1 : F.inks + 1; fxApply(); }
      if (edge('back')) hideFx();
    }
    if (fired) pad.rep = .24;
    pad.held = now;
  }

  // ---------- lo demás de lumora ----------
  // entrada "menú" en la bienvenida de siempre
  const nav = document.querySelector('.w-nav');
  if (nav) { const b = document.createElement('button'); b.textContent = 'menú'; b.addEventListener('click', () => showHome()); nav.prepend(b); }
  window.HOME = { show: showHome, hide: hideHome, open, get on() { return H.on; } };
  window.FX = { open: id => { if (id && R.scenes[id]) F.scene = id; hideHome(); showFx(); }, close: () => hideFx(), get on() { return F.on; } };

  // arranque: el menú es la puerta de entrada (?menu=0 lo salta)
  if (q.get('menu') === '0') { /* directo a la bienvenida de siempre */ }
  else if (q.get('fx')) { F.scene = R.scenes[q.get('fx')] ? q.get('fx') : F.scene; showFx(); }
  else { if (q.get('op')) H.sel = clamp(+q.get('op'), 0, OPTS.length - 1); showHome({ instant: true }); }
})();
