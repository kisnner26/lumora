// ============================================================
// welcome.js — la bienvenida de verso muestra el estado real del
// sistema: reproductor, guion con Claude y luces del cuarto.
// ============================================================
const WEL = { claude: null };
function setSt(id, state, text) {
  const el = $(id); if (!el) return;
  el.className = 'st' + (state ? ' ' + state : '');
  el.querySelector('span').textContent = text;
}
async function welcomeTick() {
  if (mode !== 'panel') return;
  const s = ext.st;
  if (!location.protocol.startsWith('http')) setSt('stMusic', 'warn', 'abre verso desde http://127.0.0.1:8888');
  else if (!s.bridge) setSt('stMusic', 'warn', 'puente apagado: ejecuta python3 bridge.py');
  else if (s.state === 'playing') setSt('stMusic', 'ok', (s.src === 'spotify' ? 'Spotify' : 'Música') + ' · sonando');
  else if (s.state === 'paused') setSt('stMusic', 'ok', (s.src === 'spotify' ? 'Spotify' : 'Música') + ' · en pausa');
  else setSt('stMusic', '', 'conectado · abre Música o Spotify');
  if (WEL.claude === null) {
    WEL.claude = false;
    try { WEL.claude = await fetch('/story').then(r => r.json()); } catch (e) { WEL.claude = { ready: false }; }
  }
  if (window.CFG && CFG.ai === false) setSt('stClaude', '', 'desactivado en ajustes');
  else if (WEL.claude?.ready) setSt('stClaude', 'ok', 'listo · ' + String(WEL.claude.model || '').replace('claude-', '').replace('-', ' '));
  else if (WEL.claude) setSt('stClaude', 'warn', 'inicia sesión en Claude Code o agrega una clave');
  if (typeof LT === 'undefined') setSt('stLights', '', 'no disponible');
  else if (!LT.on) setSt('stLights', '', 'desactivadas');
  else if (LT.devices.length) setSt('stLights', 'ok', LT.devices.length + (LT.devices.length === 1 ? ' luz Govee' : ' luces Govee'));
  else setSt('stLights', '', 'ninguna encontrada · opcional');
}
setInterval(welcomeTick, 1500); setTimeout(welcomeTick, 300);
