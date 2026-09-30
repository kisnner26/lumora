// ============================================================
// riso-ajustes.js — el panel de ajustes, más ordenado (fase 8).
//   · buscador: filtra las filas por nombre o descripción
//   · restablecer por sección: un botón en cada sección vuelve a sus valores de fábrica
//   · vista previa: una miniatura viva del videoclip con tu tamaño de letra, traducción y efectos
//   · secciones nuevas: looks (conjuntos de ajustes y «mi look»), accesibilidad (menos movimiento, alto contraste,
//     letra sobre papel) y memoria (qué guarda lumora y cómo borrarlo)
// ============================================================
(() => {
  if (typeof SETUI === 'undefined' || !window.CFG || !window.RISO) return;
  const R = RISO, ST = window.RISOSTORE, panel = document.getElementById('settings'), $ = id => document.getElementById(id);
  const AJ = window.RISOAJ = {};
  const ALLON = { tinta: true, papel: true, peso: true, taller: true }, ALLOFF = { tinta: false, papel: false, peso: false, taller: false };

  // ---------- looks ----------
  const LOOKS = {
    clasico: ['risografía clásica', 'lo de fábrica: todo encendido y movimiento normal', { intensity: 1, camera: true, cameraAmt: 1, transitions: 'todas', flashes: true, lyricSize: 1, typo: 'variada', letterAnim: true, kinetic: true, catFreq: 1, fxCine: ALLON, textBox: false }],
    noche: ['cine nocturno', 'más cámara, cortes de tinta y palabras con peso; menos dibujos sueltos', { intensity: 1.2, cameraAmt: 1.4, transitions: 'todas', flashes: true, lyricSize: 1.1, kinetic: true, catFreq: .8, fxCine: { tinta: true, papel: false, peso: true, taller: true } }],
    calma: ['calma', 'cámara lenta, cortes suaves de papel, sin destellos ni golpes', { intensity: .6, cameraAmt: .5, transitions: 'suaves', flashes: false, kinetic: false, catFreq: .6, fxCine: { tinta: false, papel: true, peso: false, taller: false } }],
    fiesta: ['fiesta', 'todo al máximo: cámara viva, golpes y cortes', { intensity: 1.4, cameraAmt: 1.6, transitions: 'todas', flashes: true, kinetic: true, lyricSize: 1.15, catFreq: 1, fxCine: ALLON }],
    lectura: ['lectura', 'letra grande sobre papel y traducción; poco movimiento', { lyricSize: 1.35, typo: 'clasica', trMode: 'ambas', kinetic: false, cameraAmt: .4, transitions: 'suaves', textBox: true, fxCine: { tinta: false, papel: false, peso: true, taller: false } }],
    minimo: ['mínimo', 'sin efectos de cine, sin cámara y sin cortes', { intensity: .4, camera: false, transitions: 'ninguna', flashes: false, kinetic: false, letterAnim: false, catFreq: .3, fxCine: ALLOFF }],
  };
  const KEYS = ['intensity', 'camera', 'cameraAmt', 'transitions', 'flashes', 'lyricSize', 'typo', 'letterAnim', 'trMode', 'kinetic', 'catFreq', 'fxCine', 'textBox'];
  const same = (a, b) => JSON.stringify(a) === JSON.stringify(b);
  const snapshot = () => Object.fromEntries(KEYS.map(k => [k, JSON.parse(JSON.stringify(CFG[k] ?? null))]));
  const applyLook = vals => { for (const [k, v] of Object.entries(vals)) CFG[k] = typeof v === 'object' && v ? { ...v } : v; applyAll(); };
  const activeLook = () => { for (const [id, [name, , v]] of Object.entries(LOOKS)) if (Object.entries(v).every(([k, x]) => same(CFG[k] ?? null, x) || (typeof x === 'object' && x && same({ ...(CFG[k] || {}) }, x)))) return name; return ''; };
  for (const [id, [name, desc, vals]] of Object.entries(LOOKS)) SETUI.addRow('looks', ['look_' + id, name, 'btn', { texto: 'aplicar', fn: () => { applyLook(vals); paintLooks(); } }, desc]);
  SETUI.addRow('looks', ['look_guardar', 'Guardar mi look', 'btn', { texto: 'guardar los ajustes de ahora', fn: async () => { if (ST) await ST.set('misc', 'miLook', snapshot()); await paintLooks(); } }, 'guarda tamaño de letra, cámara, transiciones y efectos para volver a ellos cuando quieras']);
  SETUI.addRow('looks', ['look_mio', 'Mi look', 'btn', { texto: 'aplicar', fn: async () => { const v = ST && await ST.get('misc', 'miLook'); if (v) applyLook(v); paintLooks(); } }, 'todavía no guardaste ninguno']);
  async function paintLooks() {
    const mine = ST && await ST.get('misc', 'miLook'), row = panel.querySelector('[data-row=look_mio]'); if (row) { row.querySelector('small').textContent = mine ? (same(Object.fromEntries(KEYS.map(k => [k, mine[k]])), snapshot()) ? 'el que tienes puesto ahora' : 'guardado en este navegador') : 'todavía no guardaste ninguno'; row.querySelector('button').disabled = !mine; }
    const a = activeLook(); for (const id of Object.keys(LOOKS)) panel.querySelector(`[data-row=look_${id}]`)?.classList.toggle('active', LOOKS[id][0] === a);
    const t = document.getElementById('lookNow'); if (t) t.textContent = a ? 'look activo: ' + a : 'look personalizado';
  }
  AJ.looks = LOOKS; AJ.activeLook = activeLook;

  // ---------- accesibilidad ----------
  SETUI.addRow('accesibilidad', ['reduceMotion', 'Reducir movimiento', 'sw', null, 'sin cortes con movimiento (corte seco), cámara casi quieta, sin cortes de tinta ni papel ni golpes de palabra ni desajuste de registro'], false);
  SETUI.addRow('accesibilidad', ['contrast', 'Alto contraste', 'sw', null, 'bordes más gruesos, texto más oscuro y sin la trama encima de las etiquetas'], false);
  SETUI.addRow('accesibilidad', ['textBox', 'Letra sobre papel', 'sw', null, 'el verso se imprime sobre una hoja lisa para leerlo sobre cualquier dibujo'], false);
  SETUI.addRow('accesibilidad', ['lyricSize', 'Tamaño de la letra', 'range', [.7, 1.6, .05], 'también cambia la letra del videoclip ilustrado'], 1);

  // ---------- memoria ----------
  const cols = [['historial', 'el historial de canciones'], ['letras', 'las letras guardadas'], ['posters', 'la colección de pósters'], ['dedicatorias', 'las dedicatorias'], ['criatura', 'el nombre de la criatura']];
  for (const [c, label] of cols) SETUI.addRow('memoria', ['borrar_' + c, 'Borrar ' + label, 'btn', { texto: 'borrar', confirmar: 'toca otra vez para borrar', fn: async () => { if (ST) await ST.clear(c); paintMemory(); } }, 'nada sale de este navegador']);
  async function paintMemory() { if (!ST) return; const n = await ST.size(); for (const [c, label] of cols) { const r = panel.querySelector(`[data-row=borrar_${c}]`); if (r) r.querySelector('small').textContent = `${n[c] || 0} guardados en este navegador · nada sale de aquí`; } }
  AJ.paintMemory = paintMemory;

  // ---------- estilos ----------
  const css = document.createElement('style'); css.textContent = `
    #setSearch { width:100%; margin:12px 0 4px; padding:9px 12px; border:3px solid var(--rk1,#212b80); background:var(--rkl,#faf3e4); color:var(--rk1,#212b80); font:600 13px 'Martian Mono',monospace; letter-spacing:.04em; outline:none; }
    #setSearch:focus { background:#fff; } #setNone { display:none; padding:30px 34px; font:600 20px 'Caveat',cursive; color:var(--rk1,#212b80); }
    #setPrev { margin:10px 34px 4px; border:3px solid var(--rk1,#212b80); background:var(--rkp,#f7edd8); box-shadow:5px 5px 0 -1px var(--rk1,#212b80); } #setPrev canvas { position:static !important; inset:auto !important; display:block; width:100%; height:auto; }
    #setPrev small { display:block; padding:6px 10px; font:500 11px 'Martian Mono',monospace; letter-spacing:.06em; text-transform:uppercase; color:var(--rk1,#212b80); border-top:2px solid var(--rk1,#212b80); }
    .set-title .sreset { margin-left:auto; padding:3px 8px; border:2px solid var(--rk1,#212b80); background:transparent; color:var(--rk1,#212b80); font:600 10px 'Martian Mono',monospace; letter-spacing:.08em; text-transform:uppercase; cursor:pointer; } .set-title .sreset:hover { background:var(--rk2,#f97a2a); }
    .opt.active > label { color:var(--rkd,#e0561b); } .opt.active > label::after { content:' · puesto'; font:600 11px 'Martian Mono',monospace; }
    .opt button:disabled { opacity:.45; cursor:default; }
    body.hc { --rkdots:none; } body.hc .hm-label::after, body.hc #settings section::after { display:none !important; } body.hc #settings, body.hc #home, body.hc #expWin, body.hc #posterWin { color:#0b1040; }
    body.hc button, body.hc .opt, body.hc .card, body.hc input { border-width:4px !important; } body.hc .opt small, body.hc .hm-desc, body.hc .sub { opacity:1 !important; color:#0b1040 !important; font-weight:700 !important; }`;
  document.head.appendChild(css);

  // ---------- buscador y vista previa ----------
  const head = panel.querySelector('.set-head');
  head.insertAdjacentHTML('beforeend', `<input id="setSearch" type="search" placeholder="buscar un ajuste…" aria-label="buscar un ajuste" spellcheck="false" autocomplete="off">`);
  const none = document.createElement('div'); none.id = 'setNone'; none.textContent = 'ningún ajuste se llama así. prueba con «letra», «movimiento» o «color».'; panel.insertBefore(none, panel.querySelector('.reset'));
  const prev = document.createElement('div'); prev.id = 'setPrev'; prev.innerHTML = '<canvas width="640" height="360" aria-label="vista previa del videoclip"></canvas><small id="prevCap"></small><small id="lookNow"></small>';
  head.after(prev);
  const norm = s => String(s || '').toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '');
  function filter(q) {
    q = norm(q).trim(); let any = false;
    for (const sec of panel.querySelectorAll('section')) { let vis = 0; for (const row of sec.querySelectorAll('.opt')) { const hit = !q || norm(row.textContent).includes(q) || norm(sec.id.replace('set-', '')).includes(q); row.style.display = hit ? '' : 'none'; if (hit) vis++; } sec.style.display = vis || !q ? '' : 'none'; any = any || !!vis; }
    for (const b of panel.querySelectorAll('.set-rail [data-go]')) { const sec = document.getElementById(b.dataset.go); b.style.display = sec && sec.style.display === 'none' ? 'none' : ''; }
    none.style.display = q && !any ? 'block' : 'none'; prev.style.display = q ? 'none' : '';
  }
  AJ.filter = filter;
  panel.addEventListener('input', e => { if (e.target.id === 'setSearch') filter(e.target.value); });
  panel.addEventListener('keydown', e => { if (e.target.id === 'setSearch') { e.stopPropagation(); if (e.key === 'Escape') { e.target.value = ''; filter(''); } } });

  // restablecer por sección
  const chipsAll = row => { const o = {}; row.querySelectorAll('[data-cv]').forEach(b => { o[b.dataset.cv] = true; }); return o; };
  AJ.resetSection = sec => {
    const keys = [...sec.querySelectorAll('[data-row]')].map(r => r.dataset.row);
    for (const k of keys) { const row = sec.querySelector(`[data-row="${k}"]`); if (row.querySelector('[data-chips]')) CFG[k] = chipsAll(row); else if (k in CFG_DEFAULT) CFG[k] = typeof CFG_DEFAULT[k] === 'object' && CFG_DEFAULT[k] ? { ...CFG_DEFAULT[k] } : CFG_DEFAULT[k]; }
    applyAll(); paintLooks();
  };
  function addResetButtons() { for (const sec of panel.querySelectorAll('section')) { const t = sec.querySelector('.set-title'); if (!t || t.querySelector('.sreset') || sec.id === 'set-luces') continue; if (!sec.querySelector('[data-row]')) continue; const b = document.createElement('button'); b.className = 'sreset'; b.textContent = 'restablecer'; b.title = 'volver a los valores de fábrica de esta sección'; t.appendChild(b); } }
  panel.addEventListener('click', e => { const b = e.target.closest('.sreset'); if (b) { e.stopPropagation(); AJ.resetSection(b.closest('section')); } }, true);
  const _as = SETUI.addSection; SETUI.addSection = function () { const s = _as.apply(this, arguments); return s; };
  new MutationObserver(addResetButtons).observe(panel, { childList: true, subtree: false });

  // la vista previa
  let busy = false, tm = 0;
  function drawPreview(K, job) {
    const RC = window.RISOCLIP; if (!RC) return; const H = RC.h, v = K.v, m = 34, c = CFG, tr = c.trMode !== 'orig', one = c.trMode === 'es';
    K.bg(3, .06); K.circ(430, 500, 280, { f: 3, ft: .28 }); K.circ(430, 500, 280, { s: 1, lw: 6 });
    R.props.drawProp(K, 'love', 1130, 450, 1.25, 1, { seed: 7, ph: 1, rot: 0 });
    const text = one ? 'te llevo en el corazón' : 'te llevo en el corazón', w = (v.w - m * 2) * .48, x = v.l + m + 10;
    if (c.textBox) { const ft = H.fitText(text, w, v.h * .5, { size: 104 * clamp(c.lyricSize || 1), w: 600, font: 'hand' }); K.rect(x - 16, v.t + m + 88, w + 32, ft.lines.length * ft.size * 1.12 + 26, { f: -1, s: 1, lw: 3.5 }); }
    const hh = H.writeLine(text, x, v.t + m + 96, w, v.h * .5, 9, 3, { preview: true }).h;
    if (tr && !one) H.trBox('I carry you in my heart', x, Math.min(v.t + m + 96 + hh + 18, v.b - m - 200), w, 'left');
    K.tape(1130 - 190, 210, 120, 38, -.5);
    if (window.RISO.fx && R.fx.on('taller')) { K.circ(v.l + 40, v.t + 40, 9, { s: 1, lw: 3 }); K.circ(v.r - 40, v.b - 40, 9, { s: 1, lw: 3 }); }
  }
  const clamp = (x) => Math.max(.7, Math.min(1.6, x || 1));
  async function renderPreview() {
    if (busy || !panel.classList.contains('open') || !window.RISOEXP || !RISOEXP.paint) return; busy = true;
    try { const cv = RISOEXP.paint(640, 360, 2, drawPreview, {}), o = prev.querySelector('canvas'); o.getContext('2d').drawImage(cv, 0, 0, o.width, o.height);
      const fx = Object.entries(CFG.fxCine || {}).filter(([, v]) => v).map(([k]) => k).join(' · ') || 'ninguno';
      $('prevCap').textContent = `vista previa · letra ${(+CFG.lyricSize || 1).toFixed(2)}× · traducción: ${CFG.trMode} · efectos: ${CFG.reduceMotion ? 'sin movimiento' : fx}`; } catch (e) {}
    busy = false;
  }
  AJ.preview = renderPreview;
  const later = () => { clearTimeout(tm); tm = setTimeout(() => { renderPreview(); paintLooks(); }, 260); };
  panel.addEventListener('click', later); panel.addEventListener('input', later);
  const _tg = toggleSettings; toggleSettings = function (on) { const r = _tg.apply(this, arguments); if (panel.classList.contains('open')) { paintMemory(); paintLooks(); addResetButtons(); setTimeout(renderPreview, 120); } return r; };
  const _aa = applyAll; applyAll = function () { const r = _aa.apply(this, arguments); document.body.classList.toggle('hc', !!CFG.contrast); return r; };
  document.body.classList.toggle('hc', !!CFG.contrast);
  addResetButtons(); paintLooks(); paintMemory(); syncUI();
})();
