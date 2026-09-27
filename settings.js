// ============================================================
// settings.js — panel de ajustes. Todo se aplica en vivo y se guarda.
// Se abre con el engranaje (cápsula o panel) o con la tecla ",".
// ============================================================

const CFG_DEFAULT = {
  quality: 'auto', fps: false, rec: false,
  intensity: 1, camera: true, cameraAmt: 1, transitions: 'todas', flashes: true,
  lyricSize: 1, typo: 'variada', letterAnim: true, trMode: 'ambas', kinetic: true,
  instruments: true, cards: true, symbols: true, echo: true, np: true,
  palette: 'auto', variation: 'nueva', ai: true,
};
const CFG = window.CFG = (() => { try { return { ...CFG_DEFAULT, ...JSON.parse(localStorage.getItem('tc_cfg') || '{}') }; } catch (e) { return { ...CFG_DEFAULT }; } })();
const saveCfg = () => { try { localStorage.setItem('tc_cfg', JSON.stringify(CFG)); } catch (e) {} };

// ---------- calidad ----------
// alta / media / baja son escalones fijos de la escalera de live.js; el modo grabación manda sobre todo
const QUALITY = { alta: 0, media: 1, baja: 3 };
function applyQuality() {
  if (CFG.rec) { setQuality({ dpr: 1, rs: .75, cap: 30, low: true }); return; }
  if (CFG.quality !== 'auto') { window.QLEVEL = QUALITY[CFG.quality]; setQuality(QLADDER[window.QLEVEL]); }
  else { window.QLEVEL = 1; setQuality(QLADDER[1]); }
}
const _symmetryS = symmetry;
symmetry = kind => { if (CFG.quality === 'baja' || window.LOWFX || (CFG.quality === 'media' && kind === 'kaleido')) return; _symmetryS(kind); };
const _recipeForS = recipeFor;
recipeFor = sec => {
  const r = _recipeForS(sec), low = CFG.quality === 'baja' || window.LOWFX;
  return { ...r, grade: low ? null : r.grade, sys: low ? [] : CFG.quality === 'media' ? r.sys.slice(0, 1) : r.sys };
};

// ---------- intensidad (todas las capas y partículas) ----------
const scaleK = obj => { for (const k of Object.keys(obj)) { const f = obj[k]; if (typeof f !== 'function' || f._scaled) continue;
  const g = function (kk, ...rest) { return f.call(this, kk * CFG.intensity, ...rest); }; g._scaled = true; obj[k] = g; } };
scaleK(MOTIF); if (typeof PS !== 'undefined') scaleK(PS);

// ---------- cámara ----------
const _camUpdate = CAM.update.bind(CAM);
CAM.update = function (dt) { _camUpdate(dt); if (!CFG.camera) { this.x = this.y = this.push = 0; } else { this.x *= CFG.cameraAmt; this.y *= CFG.cameraAmt; } };

// ---------- transiciones ----------
const SOFT = ['fade', 'zoom', 'wipe', 'iris', 'slide', 'curtain', 'diamond', 'blinds'];
const _pickTransition = pickTransition;
pickTransition = sec => { const k = _pickTransition(sec); return CFG.transitions === 'suaves' && !SOFT.includes(k) ? SOFT[sec % SOFT.length] : k; };
const _startTransitionS = startTransition;
startTransition = kind => { if (CFG.transitions === 'ninguna') { TRANS.active = false; return; } _startTransitionS(kind); };

// ---------- destellos (sensibilidad a la luz) ----------
const _momentS = moment;
moment = kind => { _momentS(kind); if (!CFG.flashes) MOM.flash = 0; };
const _thunder = MOTIF.thunder;
MOTIF.thunder = function (...a) { if (CFG.flashes) return _thunder.apply(this, a); };

// ---------- letra ----------
const _chooseLayout = chooseLayout;
chooseLayout = (text, n) => CFG.typo === 'clasica' ? 'classic' : _chooseLayout(text, n);
const _kinetic = kinetic;
kinetic = () => { if (CFG.kinetic) _kinetic(); };
const liteCss = document.createElement('style');
liteCss.textContent = `#lyr.lite .ch, #lyr.lite .w { animation:none !important; opacity:1 !important; transform:none !important; }
  #lyr .line { zoom:var(--ls,1); }`;
document.head.appendChild(liteCss);

// ---------- contenido ----------
const _activeInstruments = activeInstruments;
activeInstruments = () => CFG.instruments ? _activeInstruments() : [];
const _askWikiS = askWiki;
askWiki = q => CFG.cards ? _askWikiS(q) : undefined;
for (const id of ['nation', 'brand']) { const f = MOTIF[id]; MOTIF[id] = function (...a) { if (CFG.symbols) return f.apply(this, a); }; }
{ const f = MOTIF.echo; MOTIF.echo = function (...a) { if (CFG.echo) return f.apply(this, a); }; }
const _npShow = npShow;
npShow = () => { if (CFG.np) _npShow(); };

// ---------- color ----------
const PALETTES = { calida: [20, 35, 350], fria: [200, 220, 260], mono: [0, 0, 0], neon: [300, 180, 90], atardecer: [15, 330, 45], oceano: [195, 175, 220],
  vaporwave: [300, 185, 260], bosque: [120, 90, 40], oro: [45, 35, 30], pastel: [330, 200, 150], carmesi: [350, 0, 20], hielo: [190, 205, 220] };
function applyPalette() {
  if (!proc._auto) proc._auto = proc.palette;
  if (CFG.palette === 'auto' || CFG.palette === 'evolutiva') { if (proc._auto) proc.palette = proc._auto.map(p => ({ ...p })); return; }
  proc.palette = PALETTES[CFG.palette].map((h, i) => ({ h, s: CFG.palette === 'mono' ? 0 : CFG.palette === 'pastel' ? 60 : 80 - i * 6, l: CFG.palette === 'mono' ? 62 + i * 10 : CFG.palette === 'pastel' ? 76 : 58 + i * 3 }));
}
const _planScenesS = planScenes;
planScenes = function () { _planScenesS(); proc._auto = proc.palette; applyPalette(); };

// paleta evolutiva: los tonos giran despacio (una vuelta cada ~3 minutos)
{ const _pf = procFrame; procFrame = function (t, dt) { if (CFG.palette === 'evolutiva' && proc.palette) for (const p of proc.palette) p.h = (p.h + (dt || .016) * 2) % 360; return _pf(t, dt); }; }

// ---------- contador de FPS ----------
const fpsEl = document.createElement('div'); fpsEl.id = 'fps'; document.body.appendChild(fpsEl);
{ let n = 0, t0 = performance.now(), seen = 0; (function tick(now) { if (lastDraw !== seen) { seen = lastDraw; n++; } if (now - t0 > 500) { fpsEl.textContent = Math.round(n * 1000 / (now - t0)) + ' fps · ' + (window.DPR_CAP || 1) + 'x · ' + Math.round((window.RENDER_SCALE || 1) * 100) + '%' + (window.FRAME_CAP ? ' · tope ' + window.FRAME_CAP : '') + (window.LOWFX ? ' · ligero' : ''); n = 0; t0 = now; } requestAnimationFrame(tick); })(performance.now()); }

// ---------- el panel: una consola de luces ----------
const setCss = document.createElement('style');
setCss.textContent = `
  #settings { --gold:#f4c983; --gold2:#ffb36b; --paper:#f6eee2; --mute:rgba(246,238,226,.56); --faint:rgba(246,238,226,.3); --rule:rgba(246,238,226,.1);
              position:fixed; top:0; right:0; bottom:0; width:min(600px, 100vw); z-index:9; color:var(--paper); box-sizing:border-box; overflow:auto; overscroll-behavior:contain;
              background:radial-gradient(120% 50% at 100% 0%, rgba(255,170,90,.09), transparent 60%), #0b0907; border-left:1px solid var(--rule);
              transform:translateX(102%); transition:transform .6s cubic-bezier(.2,.8,.2,1); font:400 14px/1.5 'Anybody',sans-serif; font-variation-settings:'wdth' 96; }
  #settings.open { transform:none; }
  #settings * { box-sizing:border-box; }
  #settings button { font:inherit; color:inherit; background:none; border:0; cursor:pointer; padding:0; }
  .set-head { position:sticky; top:0; z-index:2; padding:28px 34px 0; background:linear-gradient(#0b0907 78%, rgba(11,9,7,0)); }
  .set-top { display:flex; align-items:flex-start; justify-content:space-between; }
  #settings h2 { margin:0; font:300 44px/.9 'Anybody',sans-serif; font-variation-settings:'wdth' 150; letter-spacing:-.01em; }
  #settings h2 i { display:inline-block; width:7px; height:7px; margin-left:4px; vertical-align:top; border-radius:50%; background:var(--gold); box-shadow:0 0 12px var(--gold2); }
  #settings .sub, .set-mono { font:400 10.5px/1.4 'Martian Mono',monospace; letter-spacing:.12em; text-transform:uppercase; color:var(--faint); }
  #settings .sub { margin:12px 0 0; }
  #settings .close { font:400 10.5px 'Martian Mono',monospace !important; letter-spacing:.16em; text-transform:uppercase; color:var(--mute) !important; padding:6px 0 !important; }
  #settings .close:hover { color:var(--paper) !important; }
  .set-rail { display:flex; flex-wrap:wrap; gap:2px; margin:22px -8px 0; padding-bottom:12px; border-bottom:1px solid var(--rule); }
  .set-rail button { flex:none; padding:8px 7px !important; border-radius:8px; font:400 9.5px 'Martian Mono',monospace !important; letter-spacing:.03em; text-transform:uppercase; color:var(--faint) !important; transition:color .2s, background .2s; }
  .set-rail button b { color:var(--gold); font-weight:400; margin-right:4px; opacity:.6; }
  .set-rail button:hover { color:var(--mute) !important; }
  .set-rail button.on { color:var(--paper) !important; background:rgba(246,238,226,.06); } .set-rail button.on b { opacity:1; }
  #settings section { padding:34px 34px 8px; scroll-margin-top:150px; }
  .set-title { display:flex; align-items:baseline; gap:14px; margin-bottom:10px; }
  .set-title b { font:400 11px 'Martian Mono',monospace; color:var(--gold); }
  .set-title h3 { margin:0; font:300 30px/1 'Anybody',sans-serif; font-variation-settings:'wdth' 132; letter-spacing:-.01em; }
  .opt { display:grid; grid-template-columns:minmax(0,1fr) auto; align-items:center; gap:10px 24px; padding:16px 0; border-bottom:1px solid var(--rule); }
  .opt:last-child { border-bottom:0; }
  .opt label { font-weight:450; font-size:15px; }
  .opt small { display:block; margin-top:3px; font-weight:350; font-size:12.5px; line-height:1.45; color:var(--mute); max-width:34ch; }
  .opt.wide { grid-template-columns:1fr; }
  /* tecla con LED */
  .sw { position:relative; width:72px; height:34px; border-radius:9px !important; border:1px solid var(--rule) !important; background:linear-gradient(180deg, rgba(246,238,226,.05), rgba(246,238,226,.01)) !important;
        box-shadow:inset 0 -2px 0 rgba(0,0,0,.35); transition:border-color .25s, background .25s; }
  .sw::before { content:''; position:absolute; left:12px; top:50%; width:7px; height:7px; margin-top:-3.5px; border-radius:50%; background:rgba(246,238,226,.18); transition:background .25s, box-shadow .25s; }
  .sw::after { content:'off'; position:absolute; right:12px; top:50%; transform:translateY(-50%); font:400 10px 'Martian Mono',monospace; letter-spacing:.12em; text-transform:uppercase; color:var(--faint); }
  .sw:hover { border-color:rgba(246,238,226,.3) !important; }
  .sw.on { border-color:rgba(244,201,131,.45) !important; background:linear-gradient(180deg, rgba(244,201,131,.14), rgba(244,201,131,.04)) !important; }
  .sw.on::before { background:var(--gold); box-shadow:0 0 10px var(--gold2), 0 0 22px rgba(255,179,107,.55); }
  .sw.on::after { content:'on'; color:var(--gold); }
  /* selector con subrayado */
  .seg { display:flex; flex-wrap:wrap; justify-content:flex-end; gap:2px 16px; }
  .seg button { position:relative; padding:6px 0 !important; font:400 10.5px 'Martian Mono',monospace !important; letter-spacing:.08em; text-transform:uppercase; color:var(--faint) !important; transition:color .2s; }
  .seg button::after { content:''; position:absolute; left:0; right:0; bottom:0; height:2px; background:var(--gold); transform:scaleX(0); transform-origin:left; transition:transform .35s cubic-bezier(.2,.8,.2,1); box-shadow:0 0 8px var(--gold2); }
  .seg button:hover { color:var(--mute) !important; }
  .seg button.on { color:var(--paper) !important; } .seg button.on::after { transform:none; }
  /* paleta con muestras reales */
  .seg.swatches { display:grid; grid-template-columns:repeat(7, 1fr); gap:10px; justify-content:stretch; margin-top:6px; }
  .seg.swatches button { padding:0 !important; display:flex; flex-direction:column; gap:7px; align-items:stretch; font-size:9px !important; letter-spacing:.04em; text-transform:lowercase; }
  .seg.swatches button::after { display:none; }
  .seg.swatches i { display:block; height:34px; border-radius:8px; border:1px solid rgba(255,255,255,.06); transition:transform .25s, box-shadow .25s; }
  .seg.swatches button:hover i { transform:translateY(-2px); }
  .seg.swatches button.on i { box-shadow:0 0 0 2px #0b0907, 0 0 0 3px var(--gold), 0 6px 22px rgba(255,170,90,.25); }
  /* fader */
  .fad { display:flex; align-items:center; gap:14px; }
  .fad output { min-width:48px; text-align:right; font:400 11px 'Martian Mono',monospace; color:var(--gold); }
  .opt input[type=range] { -webkit-appearance:none; appearance:none; width:170px; height:26px; background:transparent; cursor:pointer; margin:0; }
  .opt input[type=range]::-webkit-slider-runnable-track { height:26px; background:
      linear-gradient(90deg, var(--gold) var(--p,50%), transparent var(--p,50%)) center / 100% 2px no-repeat,
      repeating-linear-gradient(90deg, rgba(246,238,226,.22) 0 1px, transparent 1px 10%) center / 100% 9px no-repeat; }
  .opt input[type=range]::-webkit-slider-thumb { -webkit-appearance:none; width:5px; height:24px; margin-top:1px; border-radius:2px; background:var(--paper); box-shadow:0 0 12px rgba(255,190,120,.8); }
  #settings .reset { margin:26px 34px 44px; font:400 10.5px 'Martian Mono',monospace !important; letter-spacing:.14em; text-transform:uppercase; color:var(--faint) !important; border-bottom:1px solid var(--rule) !important; padding:4px 0 !important; }
  #settings .reset:hover { color:var(--gold) !important; border-color:var(--gold) !important; }
  #fps { position:fixed; top:14px; left:14px; z-index:8; font:400 11px 'Martian Mono',monospace; color:#f4c983; background:rgba(0,0,0,.55); padding:4px 8px; border-radius:6px; display:none; }
  body.show-fps #fps { display:block; }
  @media (max-width:560px) { .set-head, #settings section { padding-left:20px; padding-right:20px; } .opt { grid-template-columns:1fr; } .seg { justify-content:flex-start; } .seg.swatches { grid-template-columns:repeat(4,1fr); } }
`;
document.head.appendChild(setCss);

const OPTS = [
  ['imagen', [
    ['quality', 'Calidad', 'seg', [['auto', 'auto'], ['alta', 'alta'], ['media', 'media'], ['baja', 'baja']], 'auto baja la resolución y los efectos si hay tirones'],
    ['rec', 'Modo grabación', 'sw', null, '30 fps estables y menos carga para grabar con OBS'],
    ['fps', 'Mostrar FPS', 'sw'],
  ]],
  ['efectos', [
    ['intensity', 'Intensidad de capas', 'range', [.3, 1.5, .05]],
    ['camera', 'Cámara y profundidad', 'sw'],
    ['cameraAmt', 'Movimiento de cámara', 'range', [.2, 2, .1]],
    ['transitions', 'Transiciones', 'seg', [['todas', 'todas'], ['suaves', 'suaves'], ['ninguna', 'ninguna']]],
    ['flashes', 'Destellos', 'sw', null, 'apágalos si eres sensible a luces intermitentes'],
    ['variation', 'Variación', 'seg', [['nueva', 'siempre nueva'], ['fija', 'fija']], 'siempre nueva: cada reproducción genera un video distinto'],
  ]],
  ['letra', [
    ['lyricSize', 'Tamaño', 'range', [.7, 1.5, .05]],
    ['typo', 'Composición', 'seg', [['variada', 'variada'], ['clasica', 'clásica']]],
    ['letterAnim', 'Letra por letra', 'sw'],
    ['trMode', 'Traducción', 'seg', [['ambas', 'ambas'], ['es', 'solo trad.'], ['orig', 'original']]],
    ['kinetic', 'Palabra gigante', 'sw', null, 'en ganchos, coros y drops'],
  ]],
  ['contenido', [
    ['ai', 'Guion con Claude', 'sw', null, 'lee la letra completa antes de empezar y decide qué se ve en cada verso'],
    ['instruments', 'Instrumentos', 'sw'], ['cards', 'Fotos de lo que se nombra', 'sw'], ['symbols', 'Banderas y marcas', 'sw'],
    ['echo', 'Eco de la palabra clave', 'sw'], ['np', 'Aviso de lo que suena', 'sw'],
  ]],
  ['color', [
    ['palette', 'Paleta', 'seg', [['auto', 'auto'], ['evolutiva', 'evolutiva'], ['calida', 'cálida'], ['fria', 'fría'], ['mono', 'mono'], ['neon', 'neón'], ['atardecer', 'atardecer'],
      ['oceano', 'océano'], ['vaporwave', 'vapor'], ['bosque', 'bosque'], ['oro', 'oro'], ['pastel', 'pastel'], ['carmesi', 'carmesí'], ['hielo', 'hielo']], 'auto sale de la carátula; evolutiva gira los tonos durante la canción'],
  ]],
];
const swatch = v => v === 'auto' ? 'conic-gradient(from 200deg, #f4c983, #7a5cff, #ff6b8b, #f4c983)'
  : v === 'evolutiva' ? 'linear-gradient(90deg, hsl(10 80% 58%), hsl(60 80% 58%), hsl(160 70% 50%), hsl(250 70% 62%), hsl(330 75% 60%))'
  : `linear-gradient(90deg, ${PALETTES[v].map((h, i) => `hsl(${h} ${v === 'mono' ? 0 : v === 'pastel' ? 60 : 80 - i * 6}% ${v === 'mono' ? 40 + i * 20 : v === 'pastel' ? 76 : 55 + i * 3}%) ${i * 33}% ${i * 33 + 34}%`).join(', ')})`;

const panelEl = document.createElement('aside'); panelEl.id = 'settings';
panelEl.innerHTML = `<div class="set-head"><div class="set-top"><div><h2>ajustes<i></i></h2><p class="sub">se aplican al instante · se guardan aquí</p></div><button class="close" aria-label="cerrar ajustes">cerrar</button></div><nav class="set-rail"></nav></div>`;
const rail = panelEl.querySelector('.set-rail');
const SECTIONS = [...OPTS.map(o => o[0]), 'luces'];
SECTIONS.forEach((t, i) => { const b = document.createElement('button'); b.dataset.go = 'set-' + t; b.innerHTML = `<b>${String(i + 1).padStart(2, '0')}</b>${t}`; rail.appendChild(b); });
OPTS.forEach(([title, opts], si) => {
  const sec = document.createElement('section'); sec.id = 'set-' + title;
  sec.innerHTML = `<div class="set-title"><b>${String(si + 1).padStart(2, '0')}</b><h3>${title}</h3></div>`;
  for (const [key, label, type, arg, hint] of opts) {
    const row = document.createElement('div'); row.className = 'opt' + (key === 'palette' ? ' wide' : '');
    row.innerHTML = `<label>${label}${hint ? `<small>${hint}</small>` : ''}</label>`;
    if (type === 'sw') { const b = document.createElement('button'); b.className = 'sw'; b.dataset.key = key; b.setAttribute('aria-label', label); row.appendChild(b); }
    if (type === 'seg') { const g = document.createElement('div'); g.className = 'seg' + (key === 'palette' ? ' swatches' : ''); g.dataset.key = key;
      for (const [v, t] of arg) { const b = document.createElement('button'); b.dataset.v = v; b.title = t;
        if (key === 'palette') b.innerHTML = `<i style="background:${swatch(v)}"></i>${t}`; else b.textContent = t; g.appendChild(b); }
      row.appendChild(g); }
    if (type === 'range') { const f = document.createElement('div'); f.className = 'fad'; const i = document.createElement('input'); i.type = 'range'; [i.min, i.max, i.step] = arg; i.dataset.key = key;
      const o = document.createElement('output'); f.append(i, o); row.appendChild(f); }
    sec.appendChild(row);
  }
  panelEl.appendChild(sec);
});
{ const sec = document.createElement('section'); sec.id = 'set-luces';
  sec.innerHTML = `<div class="set-title"><b>${String(SECTIONS.length).padStart(2, '0')}</b><h3>luces</h3></div><div class="opt"><label>Sincronizar luces del cuarto<small id="setLights"></small></label><button class="sw" id="lightsSw" aria-label="luces"></button></div>`;
  panelEl.appendChild(sec); }
const reset = document.createElement('button'); reset.className = 'reset'; reset.textContent = 'restablecer todo'; panelEl.appendChild(reset);
document.body.appendChild(panelEl);
// los canales: saltan a su sección y se encienden al pasar
rail.addEventListener('click', e => { const b = e.target.closest('[data-go]'); if (b) $(b.dataset.go).scrollIntoView({ behavior: 'smooth', block: 'start' }); });
panelEl.addEventListener('scroll', () => {
  let cur = SECTIONS[0];
  for (const t of SECTIONS) if ($('set-' + t).getBoundingClientRect().top < 190) cur = t;
  if (panelEl.scrollTop + panelEl.clientHeight >= panelEl.scrollHeight - 4) cur = SECTIONS[SECTIONS.length - 1];
  rail.querySelectorAll('button').forEach(b => b.classList.toggle('on', b.dataset.go === 'set-' + cur));
});
const fmtVal = (k, v) => (+v).toFixed(2) + '×';
function paintFader(i) { const p = (i.value - i.min) / (i.max - i.min) * 100; i.style.setProperty('--p', p + '%'); i.nextElementSibling.textContent = fmtVal(i.dataset.key, i.value); }
function syncUI() {
  panelEl.querySelectorAll('.sw[data-key]').forEach(b => b.classList.toggle('on', !!CFG[b.dataset.key]));
  panelEl.querySelectorAll('.seg').forEach(g => g.querySelectorAll('button').forEach(b => b.classList.toggle('on', CFG[g.dataset.key] === b.dataset.v)));
  panelEl.querySelectorAll('input[type=range]').forEach(i => { i.value = CFG[i.dataset.key]; paintFader(i); });
  rail.querySelector('button:not(.on)') && !rail.querySelector('.on') && rail.firstChild.classList.add('on');
  $('lightsSw').classList.toggle('on', LT.on);
  $('setLights').textContent = LT.devices.length ? LT.devices.length + ' luz(es) Govee' : 'ninguna luz encontrada';
}
function applyAll() {
  applyQuality();
  document.body.classList.toggle('show-fps', CFG.fps);
  lyr.classList.toggle('lite', !CFG.letterAnim);
  lyr.style.setProperty('--ls', CFG.lyricSize);
  if (IN.trMode !== CFG.trMode) { IN.trMode = CFG.trMode; try { localStorage.setItem('tc_trmode', IN.trMode); } catch (e) {} IN.shown = -2; }
  if (!CFG.cards) CARDS.length = 0;
  applyPalette();
  syncUI(); saveCfg();
}
panelEl.addEventListener('click', e => {
  const b = e.target.closest('button'); if (!b) return;
  if (b.classList.contains('close')) return toggleSettings(false);
  if (b.dataset.go) return;
  if (b === reset) { Object.assign(CFG, CFG_DEFAULT); return applyAll(); }
  if (b.id === 'lightsSw') { $('lightsBtn').click(); return setTimeout(syncUI, 50); }
  if (b.dataset.key) CFG[b.dataset.key] = !CFG[b.dataset.key];
  else if (b.dataset.v) CFG[b.parentElement.dataset.key] = b.dataset.v;
  applyAll();
});
panelEl.addEventListener('input', e => { const i = e.target; if (i.dataset.key) { CFG[i.dataset.key] = parseFloat(i.value); paintFader(i); applyAll(); } });
function toggleSettings(on = !panelEl.classList.contains('open')) { panelEl.classList.toggle('open', on); if (on) syncUI(); }
addEventListener('keydown', e => { if (e.key === ',' && !/TEXTAREA|INPUT/.test(document.activeElement?.tagName || '')) toggleSettings(); if (e.key === 'Escape' && panelEl.classList.contains('open')) { toggleSettings(false); e.stopImmediatePropagation(); } }, true);

// botones del engranaje: en la cápsula y en el panel principal
const GEAR = '<svg viewBox="0 0 24 24"><path d="M19.4 13a7.5 7.5 0 0 0 0-2l2-1.6-2-3.4-2.4 1a7.6 7.6 0 0 0-1.7-1L15 3.4h-4l-.4 2.6a7.6 7.6 0 0 0-1.7 1l-2.4-1-2 3.4 2 1.6a7.5 7.5 0 0 0 0 2l-2 1.6 2 3.4 2.4-1a7.6 7.6 0 0 0 1.7 1l.4 2.6h4l.4-2.6a7.6 7.6 0 0 0 1.7-1l2.4 1 2-3.4zM13 15.5A3.5 3.5 0 1 1 13 8.5a3.5 3.5 0 0 1 0 7z" transform="translate(-1 0)"/></svg>';
// el botón de ajustes vive en las herramientas del reproductor (hud.js)
$('openSettings')?.addEventListener('click', () => toggleSettings(true));
applyAll();
