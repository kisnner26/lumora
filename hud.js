// ============================================================
// hud.js — la consola de reproducción, centrada abajo.
// Tiempos, estrofas marcadas en la barra, la escena y de dónde
// sale el guion, y herramientas que reusan los atajos de teclado.
// ============================================================
const HUD = { marks: '' };
const hudFmt = s => { s = Math.max(0, s || 0); return Math.floor(s / 60) + ':' + String(Math.floor(s % 60)).padStart(2, '0'); };
const hudDur = () => (mode === 'proc' ? proc.dur : 0) || ext.st.dur || 0;

// las herramientas disparan el mismo atajo que su tecla
$('hudTools').addEventListener('click', e => {
  const b = e.target.closest('button'); if (!b) return;
  if (b.hasAttribute('data-cover')) { if (!ext.artUrl) return hudMsg('esta canción no tiene carátula'); return toggleCover(true); }
  if (b.id === 'hudLights') return hudLights();
  if (b.id === 'recFmt') {
    if (REC.on) return hudMsg('termina la grabación para cambiar el formato');
    CFG.recFormat = CFG.recFormat === 'vertical' ? 'horizontal' : 'vertical'; saveCfg(); if (typeof syncUI === 'function') syncUI();
    hudMsg(CFG.recFormat === 'vertical' ? 'clips en vertical 9:16 · historias y TikTok' : 'clips en horizontal 16:9 · YouTube y pantallas'); return hudTick2();
  }
  const k = b.dataset.k; if (!k) return;
  if (k === ',') return toggleSettings(true);
  if (k === 'e') return openAutor();
  dispatchEvent(new KeyboardEvent('keydown', { key: k, code: k === 'Escape' ? 'Escape' : 'Key' + k.toUpperCase(), bubbles: true }));
  setTimeout(hudTick2, 60);
});

// hora exacta al pasar por la barra
$('hudBar').addEventListener('mousemove', e => {
  const r = $('hudBar').getBoundingClientRect(), p = clamp((e.clientX - r.left) / r.width), tip = $('hudTip');
  tip.style.left = p * 100 + '%'; tip.textContent = hudFmt(p * hudDur());
});

function hudTick2() {
  const s = ext.st, dur = hudDur(), pos = ext.has() ? ext.now() : 0;
  $('hudT0').textContent = hudFmt(pos); $('hudT1').textContent = hudFmt(dur);
  if (dur && mode === 'proc') $('hudFill').style.width = clamp(pos / dur) * 100 + '%';
  // las estrofas, como muescas en la barra
  const sig = mode === 'proc' && dur ? IN.cuts.length + '|' + Math.round(dur) : '';
  if (sig !== HUD.marks) { HUD.marks = sig; $('hudMarks').innerHTML = sig ? IN.cuts.slice(1).map(c => `<b style="left:${c / dur * 100}%"></b>`).join('') : ''; }
  // escena y origen del guion
  const sec = SEM.blockNow, gen = mode === 'proc' && sec >= 0 ? GENS[IN.blockGen?.[sec]]?.name : '';
  $('hudScene').textContent = gen && gen !== 'espera' ? 'escena · ' + gen : '';
  $('hudSrc').textContent = mode === 'proc' ? (/autor/.test(IN.aiState || '') ? 'guion del autor' : /Claude/.test(IN.aiState || '') && !/Claude:/.test(IN.aiState || '') ? 'guion de claude' : '') : '';
  // estado de las herramientas
  $('hudTr').textContent = { ambas: 'es+en', es: 'trad', orig: 'orig' }[IN.trMode] || 'es+en';
  $('hudLyr').classList.toggle('off', IN.show === false);
  $('hudLights').querySelector('.led').classList.toggle('on', !!(typeof LT !== 'undefined' && LT.on && LT.devices.length));
  $('recBtn').classList.toggle('on', !!(typeof REC !== 'undefined' && REC.on));
  $('recFmtTag').textContent = (window.CFG && CFG.recFormat) === 'vertical' ? '9:16' : '16:9';
  for (const b of $('hudTools').querySelectorAll('[data-k=t],[data-k=l],[data-k=e]')) b.style.display = mode === 'proc' ? '' : 'none';
}
setInterval(hudTick2, 250);

// el artista va solo: los tiempos ya están en la barra
{ const _uiH = ui; ui = function () { _uiH(); const s = ext.st; $('hudSub').textContent = mode === 'proc' ? proc.artist || s.artist : ext.has() ? s.artist : 'twenty one pilots'; }; }

// un aviso corto encima de la consola
const hudMsgEl = document.createElement('div'); hudMsgEl.id = 'hudMsg'; $('hud').appendChild(hudMsgEl);
{ const st = document.createElement('style'); st.textContent = `
  #hudMsg { position:absolute; left:50%; bottom:calc(100% + 12px); transform:translate(-50%, 6px); padding:9px 14px; border-radius:11px; background:rgba(20,16,12,.94);
            border:1px solid rgba(246,238,226,.12); color:#f6eee2; font:400 12.5px 'Anybody',sans-serif; white-space:nowrap; opacity:0; pointer-events:none; transition:opacity .3s, transform .3s; }
  #hudMsg.on { opacity:1; transform:translate(-50%, 0); }`; document.head.appendChild(st); }
function hudMsg(t, ms = 2600) { hudMsgEl.textContent = t; hudMsgEl.classList.add('on'); clearTimeout(hudMsg.t); hudMsg.t = setTimeout(() => hudMsgEl.classList.remove('on'), ms); }

// luces: si no hay ninguna, las busca y dice qué pasa; si las hay, las prende o apaga
async function hudLights() {
  if (typeof LT === 'undefined') return hudMsg('el control de luces no está disponible');
  if (!LT.devices.length) {
    hudMsg('buscando luces Govee en tu red…', 5000);
    $('lightsScan').click(); await new Promise(r => setTimeout(r, 4200)); await lightsRefresh(false);
    if (!LT.devices.length) return hudMsg('ninguna luz responde: revisa que esté enchufada, en tu Wi-Fi y con LAN Control activo', 5200);
    if (!LT.on) $('lightsBtn').click();
    hudTick2(); return hudMsg(LT.devices.length + (LT.devices.length === 1 ? ' luz conectada' : ' luces conectadas') + ' · siguen la canción');
  }
  $('lightsBtn').click(); await new Promise(r => setTimeout(r, 80));
  hudTick2(); hudMsg(LT.on ? 'luces sincronizadas con la canción' : 'luces desconectadas de la canción');
}
