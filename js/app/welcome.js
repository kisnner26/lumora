// ============================================================
// welcome.js — la bienvenida de lumora.
// Una frase que se escribe con luz (o el título de lo que suena),
// el estado real del sistema en una línea, la carátula en la barra
// de abajo y lo secundario en paneles laterales.
// ============================================================
const WEL = { claude: null, i: 0, shown: '', timer: 0 };
window.WMOUSE = { x: .62, y: .38 };
addEventListener('pointermove', e => { WMOUSE.x = e.clientX / innerWidth; WMOUSE.y = e.clientY / innerHeight; });

// ---------- estado del sistema ----------
function setSt(id, state, text) {
  const el = $(id); if (!el) return;
  el.className = 'st' + (state ? ' ' + state : '');
  el.querySelector('span').textContent = text;
}
async function welcomeTick() {
  if (mode !== 'panel') return;
  const s = ext.st;
  if (!location.protocol.startsWith('http')) setSt('stMusic', 'warn', 'abre lumora desde http://127.0.0.1:8888');
  else if (!s.bridge) setSt('stMusic', 'warn', 'puente apagado: ejecuta python3 bridge.py');
  else if (s.state === 'playing') setSt('stMusic', 'ok', (s.src === 'spotify' ? 'Spotify' : 'Música') + ' · sonando');
  else if (s.state === 'paused') setSt('stMusic', 'ok', (s.src === 'spotify' ? 'Spotify' : 'Música') + ' · en pausa');
  else setSt('stMusic', '', 'conectado · esperando una canción');
  // la carátula de lo que suena, en la barra de abajo
  const art = $('hudArt'), has = ext.has() && art && art.style.display !== 'none' && art.src;
  if (has && $('nowArt').src !== art.src) $('nowArt').src = art.src;
  $('nowDot').classList.toggle('has', !!has);
  const sleeve = $('wSleeveImg'), url = ext.has() ? ext.artUrl : '';
  if (url && sleeve.getAttribute('src') !== url) sleeve.src = url;
  sleeve.hidden = !url; $('wArtEmpty').hidden = !!url;
  $('wSleeveArtist').textContent = ext.has() ? s.artist || 'artista desconocido' : 'música → imagen';
  $('wSleeveAlbum').textContent = ext.has() ? s.album || s.name : 'hecho para escuchar con los ojos';
  kineticWelcome();
  if (WEL.claude === null) {
    WEL.claude = false;
    try { WEL.claude = await fetch('/story').then(r => r.json()); } catch (e) { WEL.claude = { ready: false }; }
  }
  if (!(window.CFG && CFG.ai)) setSt('stClaude', 'ok', 'director de lumora · sin IA');
  else if (WEL.claude?.ready) setSt('stClaude', 'ok', 'listo · ' + String(WEL.claude.model || '').replace('claude-', '').replace('-', ' '));
  else if (WEL.claude) setSt('stClaude', 'warn', 'inicia sesión en Claude Code o agrega una clave');
  if (typeof LT === 'undefined') setSt('stLights', '', 'no disponible');
  else if (!LT.on) setSt('stLights', '', 'desactivadas');
  else if (LT.devices.length) setSt('stLights', 'ok', LT.devices.length + (LT.devices.length === 1 ? ' luz Govee' : ' luces Govee'));
  else setSt('stLights', '', 'ninguna encontrada');

}
setInterval(welcomeTick, 1200); setTimeout(welcomeTick, 200);

// ---------- la frase que se escribe con luz ----------
const TAGS_W = [
  [['cada verso', 'tiene su escena'], 'escena'],
  [['la letra', 'se vuelve luz'], 'luz'],
  [['tu canción,', 'un mundo propio'], 'propio'],
  [['tinta y música', 'en la misma página'], 'página'],
  [['cada play', 'es un estreno'], 'estreno'],
];
function cleanTitle(t) { return (t || '').replace(/\s*[\(\[].*?[\)\]]\s*/g, ' ').replace(/\s+-\s+.*$/, '').trim(); }
function splitTwo(t) {
  const w = t.split(/\s+/); if (w.length < 2) return [t];
  let best = 1, diff = 1e9;
  for (let k = 1; k < w.length; k++) { const d = Math.abs(w.slice(0, k).join(' ').length - w.slice(k).join(' ').length); if (d < diff) { diff = d; best = k; } }
  return [w.slice(0, best).join(' '), w.slice(best).join(' ')];
}
function paintLine(lines, key) {
  const el = $('wLine'); let n = 0;
  el.classList.remove('out'); el.innerHTML = '';
  for (const ln of lines) {
    const row = document.createElement('span'); row.className = 'ln';
    ln.split(/(\s+)/).forEach(word => {
      const isKey = key && word.toLowerCase().replace(/[^\p{L}]/gu, '') === key.toLowerCase();
      const wrap = document.createElement('span'); wrap.style.whiteSpace = 'nowrap';
      for (const ch of word) {
        const c = document.createElement('span'); c.className = 'c' + (isKey ? ' k' : ''); c.textContent = ch === ' ' ? ' ' : ch;
        c.style.animationDelay = (n++ * 38 + (isKey ? 180 : 0)) + 'ms'; wrap.appendChild(c);
      }
      row.appendChild(wrap);
    });
    el.appendChild(row);
  }
}
function showLine(lines, key, eyebrow) {
  const sig = lines.join('|');
  if (sig === WEL.shown) return;
  const el = $('wLine'), first = !WEL.shown;
  WEL.shown = sig; $('wEyebrow').textContent = eyebrow;
  if (first) return paintLine(lines, key);
  el.classList.add('out');
  setTimeout(() => { if (WEL.shown === sig) paintLine(lines, key); }, 520);
}
function kineticWelcome() {
  if (mode !== 'panel') return;
  const s = ext.st;
  if (ext.has() && s.name) {
    const t = cleanTitle(s.name) || s.name, parts = splitTwo(t.length > 34 ? t.slice(0, 34).trim() + '…' : t);
    const words = t.split(/\s+/), key = words.reduce((a, b) => b.replace(/[^\p{L}]/gu, '').length > a.length ? b.replace(/[^\p{L}]/gu, '') : a, '');
    WEL.kind = 'song'; showLine(parts, parts.length > 1 ? key : '', (s.state === 'playing' ? 'sonando ahora · ' : 'en pausa · ') + (s.artist || ''));
    return;
  }
  if (WEL.kind === 'tag' && performance.now() - WEL.timer < 5200) return;
  WEL.kind = 'tag'; WEL.timer = performance.now();
  const [lines, key] = TAGS_W[WEL.i++ % TAGS_W.length];
  showLine(lines, key, 'lyric videos en vivo');
}

// ---------- paneles laterales ----------
function openDrawer(name) {
  const p = $('panel'), d = $('wDrawer');
  for (const s of d.querySelectorAll('section')) s.classList.toggle('on', s.dataset.sec === name);
  p.classList.add('drawer'); d.setAttribute('aria-hidden', 'false');
}
function closeDrawer() { $('panel').classList.remove('drawer'); $('wDrawer').setAttribute('aria-hidden', 'true'); }
for (const b of document.querySelectorAll('[data-drawer]')) b.addEventListener('click', () => openDrawer(b.dataset.drawer));
$('wClose').addEventListener('click', closeDrawer); $('wScrim').addEventListener('click', closeDrawer);
addEventListener('keydown', e => { if (e.key === 'Escape' && $('panel').classList.contains('drawer')) { e.stopImmediatePropagation(); closeDrawer(); } }, true);

// taxi cab necesita su letra: si falta, se abre su panel
{ const f = startTaxiAuto; startTaxiAuto = function () { f(); if (mode === 'panel') openDrawer('autor'); }; }

// modo autor: abre el editor desde su panel
$('openAutorBtn')?.addEventListener('click', async () => { closeDrawer(); if (!(await openAutor())) openDrawer('autor'); });

// accesos de la bienvenida: reutilizan los modos y controles existentes.
for (const b of document.querySelectorAll('[data-w-mode]')) b.addEventListener('click', () => {
  const target = b.dataset.wMode;
  if (target === 'lyric') { if (!ext.has()) return say('pon una canción en Música o Spotify para abrir el video'); return $('proc').click(); }
  if (target === 'cover') { if (!ext.artUrl) return say('pon una canción con carátula en Música o Spotify'); return toggleCover(true); }
  if (target === 'fx') return window.FX?.open();
  if (target === 'explore') return window.RISOEXP?.open();
});
