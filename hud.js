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
  if (b.id === 'hudLights') { $('lightsBtn').click(); return setTimeout(hudTick2, 60); }
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
  for (const b of $('hudTools').querySelectorAll('[data-k=t],[data-k=l],[data-k=e]')) b.style.display = mode === 'proc' ? '' : 'none';
}
setInterval(hudTick2, 250);

// el artista va solo: los tiempos ya están en la barra
{ const _uiH = ui; ui = function () { _uiH(); const s = ext.st; $('hudSub').textContent = mode === 'proc' ? proc.artist || s.artist : ext.has() ? s.artist : 'twenty one pilots'; }; }
