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

// ---------- el panel ----------
const setCss = document.createElement('style');
setCss.textContent = `
  #settings { position:fixed; top:0; right:0; bottom:0; width:min(380px, 100vw); z-index:9; background:rgba(8,9,14,.96); color:var(--ink);
              border-left:1px solid var(--line); transform:translateX(100%); transition:transform .35s cubic-bezier(.2,.8,.2,1); overflow:auto;
              font:300 13px/1.5 Inter,sans-serif; padding:22px 22px 40px; box-sizing:border-box; }
  #settings.open { transform:none; }
  #settings h2 { font:italic 300 30px/1 'Cormorant Garamond',serif; margin:0 0 4px; }
  #settings .sub { color:var(--dim); font-size:12px; margin:0 0 18px; }
  #settings section { border-top:1px solid var(--line); padding:14px 0 6px; }
  #settings section > span { display:block; font:400 10px/1 Inter,sans-serif; letter-spacing:.3em; text-transform:uppercase; color:var(--dim); margin-bottom:10px; }
  .opt { display:flex; justify-content:space-between; align-items:center; gap:12px; padding:7px 0; }
  .opt label { flex:1; }
  .opt small { display:block; color:var(--dim); font-size:11px; }
  .seg { display:flex; flex-wrap:wrap; border:1px solid var(--line); border-radius:14px; overflow:hidden; flex-shrink:0; max-width:230px; justify-content:flex-end; }
  .seg button { background:none; border:0; color:var(--dim); padding:5px 10px; font:400 11px Inter,sans-serif; cursor:pointer; }
  .seg button.on { background:#f3ecdf; color:#0a0a10; }
  .sw { width:38px; height:22px; border-radius:999px; background:rgba(243,236,223,.15); position:relative; cursor:pointer; flex-shrink:0; border:0; padding:0; }
  .sw::after { content:''; position:absolute; top:3px; left:3px; width:16px; height:16px; border-radius:50%; background:#f3ecdf; transition:transform .2s; }
  .sw.on { background:#9be3a8; } .sw.on::after { transform:translateX(16px); }
  .opt input[type=range] { width:130px; accent-color:#f3ecdf; }
  #settings .close { position:absolute; top:16px; right:16px; background:none; border:0; color:var(--ink); font-size:22px; cursor:pointer; }
  #settings .reset { margin-top:18px; background:transparent; color:var(--dim); border:1px solid var(--line); border-radius:999px; padding:8px 16px; font:300 12px Inter; cursor:pointer; }
  #fps { position:fixed; top:14px; left:14px; z-index:8; font:500 11px ui-monospace,Menlo,monospace; color:#9be3a8; background:rgba(0,0,0,.5); padding:4px 8px; border-radius:6px; display:none; }
  body.show-fps #fps { display:block; }
`;
document.head.appendChild(setCss);

const OPTS = [
  ['Rendimiento', [
    ['quality', 'Calidad', 'seg', [['auto', 'auto'], ['alta', 'alta'], ['media', 'media'], ['baja', 'baja']], 'auto baja la resolución y los efectos si hay tirones'],
    ['rec', 'Modo grabación (OBS)', 'sw', null, '30 fps estables y menos carga para grabar la pantalla sin tirones'],
    ['fps', 'Mostrar FPS', 'sw'],
  ]],
  ['Efectos', [
    ['intensity', 'Intensidad de capas', 'range', [.3, 1.5, .05]],
    ['camera', 'Cámara y profundidad', 'sw'],
    ['cameraAmt', 'Movimiento de cámara', 'range', [.2, 2, .1]],
    ['transitions', 'Transiciones', 'seg', [['todas', 'todas'], ['suaves', 'suaves'], ['ninguna', 'no']]],
    ['flashes', 'Destellos', 'sw', null, 'apágalos si eres sensible a luces intermitentes'],
    ['variation', 'Variación', 'seg', [['nueva', 'siempre nueva'], ['fija', 'fija por canción']], 'siempre nueva: cada reproducción genera un video distinto'],
  ]],
  ['Letra', [
    ['lyricSize', 'Tamaño', 'range', [.7, 1.5, .05]],
    ['typo', 'Composición', 'seg', [['variada', 'variada'], ['clasica', 'clásica']]],
    ['letterAnim', 'Animación letra a letra', 'sw'],
    ['trMode', 'Traducción', 'seg', [['ambas', 'ambas'], ['es', 'solo trad.'], ['orig', 'original']]],
    ['kinetic', 'Palabra gigante en coros y drops', 'sw'],
  ]],
  ['Contenido', [
    ['ai', 'Guion con Claude', 'sw', null, 'Claude lee la letra completa antes de empezar y decide qué se ve en cada verso; cada canción se analiza una vez'],
    ['instruments', 'Instrumentos', 'sw'], ['cards', 'Fotos de lo que se nombra', 'sw'], ['symbols', 'Banderas y marcas', 'sw'],
    ['echo', 'Eco de la palabra clave', 'sw'], ['np', 'Aviso "ahora estás escuchando"', 'sw'],
  ]],
  ['Color', [
    ['palette', 'Paleta', 'seg', [['auto', 'auto'], ['evolutiva', 'evolutiva'], ['calida', 'cálida'], ['fria', 'fría'], ['mono', 'mono'], ['neon', 'neón'], ['atardecer', 'atardecer'],
      ['oceano', 'océano'], ['vaporwave', 'vaporwave'], ['bosque', 'bosque'], ['oro', 'oro'], ['pastel', 'pastel'], ['carmesi', 'carmesí'], ['hielo', 'hielo']], 'evolutiva: los tonos giran despacio durante la canción'],
  ]],
];

const panelEl = document.createElement('aside'); panelEl.id = 'settings';
panelEl.innerHTML = `<button class="close" aria-label="cerrar ajustes">×</button><h2>ajustes</h2><p class="sub">se aplican al instante y se guardan en este navegador</p>`;
for (const [title, opts] of OPTS) {
  const sec = document.createElement('section'); sec.innerHTML = `<span>${title}</span>`;
  for (const [key, label, type, arg, hint] of opts) {
    const row = document.createElement('div'); row.className = 'opt';
    row.innerHTML = `<label>${label}${hint ? `<small>${hint}</small>` : ''}</label>`;
    if (type === 'sw') { const b = document.createElement('button'); b.className = 'sw'; b.dataset.key = key; b.setAttribute('aria-label', label); row.appendChild(b); }
    if (type === 'seg') { const g = document.createElement('div'); g.className = 'seg'; g.dataset.key = key;
      for (const [v, t] of arg) { const b = document.createElement('button'); b.dataset.v = v; b.textContent = t; g.appendChild(b); } row.appendChild(g); }
    if (type === 'range') { const i = document.createElement('input'); i.type = 'range'; [i.min, i.max, i.step] = arg; i.dataset.key = key; row.appendChild(i); }
    sec.appendChild(row);
  }
  panelEl.appendChild(sec);
}
{ const sec = document.createElement('section'); sec.innerHTML = `<span>Luces del cuarto</span><div class="opt"><label>Sincronizar luces<small id="setLights"></small></label><button class="sw" id="lightsSw" aria-label="luces"></button></div>`; panelEl.appendChild(sec); }
const reset = document.createElement('button'); reset.className = 'reset'; reset.textContent = 'restablecer todo'; panelEl.appendChild(reset);
document.body.appendChild(panelEl);

function syncUI() {
  panelEl.querySelectorAll('.sw[data-key]').forEach(b => b.classList.toggle('on', !!CFG[b.dataset.key]));
  panelEl.querySelectorAll('.seg').forEach(g => g.querySelectorAll('button').forEach(b => b.classList.toggle('on', CFG[g.dataset.key] === b.dataset.v)));
  panelEl.querySelectorAll('input[type=range]').forEach(i => { i.value = CFG[i.dataset.key]; });
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
  if (b === reset) { Object.assign(CFG, CFG_DEFAULT); return applyAll(); }
  if (b.id === 'lightsSw') { $('lightsBtn').click(); return setTimeout(syncUI, 50); }
  if (b.dataset.key) CFG[b.dataset.key] = !CFG[b.dataset.key];
  else if (b.dataset.v) CFG[b.parentElement.dataset.key] = b.dataset.v;
  applyAll();
});
panelEl.addEventListener('input', e => { const i = e.target; if (i.dataset.key) { CFG[i.dataset.key] = parseFloat(i.value); applyAll(); } });
function toggleSettings(on = !panelEl.classList.contains('open')) { panelEl.classList.toggle('open', on); if (on) syncUI(); }
addEventListener('keydown', e => { if (e.key === ',' && !/TEXTAREA|INPUT/.test(document.activeElement?.tagName || '')) toggleSettings(); if (e.key === 'Escape' && panelEl.classList.contains('open')) { toggleSettings(false); e.stopImmediatePropagation(); } }, true);

// botones del engranaje: en la cápsula y en el panel principal
const GEAR = '<svg viewBox="0 0 24 24"><path d="M19.4 13a7.5 7.5 0 0 0 0-2l2-1.6-2-3.4-2.4 1a7.6 7.6 0 0 0-1.7-1L15 3.4h-4l-.4 2.6a7.6 7.6 0 0 0-1.7 1l-2.4-1-2 3.4 2 1.6a7.5 7.5 0 0 0 0 2l-2 1.6 2 3.4 2.4-1a7.6 7.6 0 0 0 1.7 1l.4 2.6h4l.4-2.6a7.6 7.6 0 0 0 1.7-1l2.4 1 2-3.4zM13 15.5A3.5 3.5 0 1 1 13 8.5a3.5 3.5 0 0 1 0 7z" transform="translate(-1 0)"/></svg>';
{ const b = document.createElement('button'); b.title = 'ajustes (,)'; b.innerHTML = GEAR; b.addEventListener('click', () => toggleSettings()); $('hudCtl').appendChild(b); }
{ const b = document.createElement('button'); b.textContent = 'ajustes'; b.addEventListener('click', () => toggleSettings(true)); document.querySelector('.actions').appendChild(b); }
applyAll();
