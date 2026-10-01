// ============================================================
// nowplaying.js — cuando la cápsula del reproductor está oculta,
// cada cierto tiempo aparece abajo, en una línea discreta:
// "ahora estás escuchando · canción — artista".
// ============================================================

const NP = { last: 0, key: '', timer: 0 };
const NP_FIRST = 12000, NP_EVERY = 75000, NP_SHOW = 4500;

function npText() {
  const s = ext.st;
  if (!ext.has()) return '';
  const feat = (s.name || '').match(/\s*[(\[](?:feat\.?|ft\.?|with)\s+([^)\]]+)[)\]]/i);
  const title = (s.name || '').replace(feat ? feat[0] : '', '').trim();
  const artist = (s.artist || '').split(/,|&/)[0].trim();
  return title ? title + (artist ? ' — ' + artist : '') : '';
}
function npShow() {
  const el = $('np'), txt = npText();
  if (!txt) return;
  $('npSong').textContent = txt;
  el.classList.add('show'); NP.last = performance.now();
  clearTimeout(NP.timer); NP.timer = setTimeout(() => el.classList.remove('show'), NP_SHOW);
}
setInterval(() => {
  const playing = (mode === 'proc' || mode === 'play') && ext.has() && ext.st.state === 'playing';
  const hudHidden = !$('hud').classList.contains('show');
  if (!playing) { $('np').classList.remove('show'); return; }
  const key = ext.key();
  if (key !== NP.key) { NP.key = key; NP.last = performance.now() - NP_EVERY + NP_FIRST; }   // canción nueva: aparece a los 12 s
  if (hudHidden && performance.now() - NP.last > NP_EVERY) npShow();
  if (!hudHidden) $('np').classList.remove('show');                                       // si la cápsula se ve, sobra
}, 1000);
