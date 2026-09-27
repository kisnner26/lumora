// ============================================================
// lights.js — las luces del cuarto siguen la canción.
// Color de la paleta al empezar cada canción, cambio por compás,
// pulso de brillo en cada golpe, destello blanco en los drops y
// luz baja en pausa. Hoy: Govee con control LAN (vía el puente).
// ============================================================

const LT = { on: (() => { try { return localStorage.getItem('tc_lights') !== '0'; } catch (e) { return true; } })(), devices: [], key: '', bar: -1, lastState: '' };

// qué tan intensa suena la canción ahora mismo (0 = muy tranquila, 1 = muy fuerte)
LT.int = .5; LT.sent = -1;
function songIntensity() {
  let target;
  if (window.AUD?.live) target = clamp(AUD.level * 1.15);                                   // sonido real
  else {
    const plan = typeof SEM !== 'undefined' ? SEM.plans?.[SEM.blockNow] : null;
    target = plan ? clamp((plan.energy ?? 5) / 10) : clamp(.5 + (IN.mood?.a || 0) * .45);    // IA por estrofa, o el ánimo de la letra
  }
  if (typeof ENERGY !== 'undefined') target = clamp(target - (ENERGY.calm || 0) * .3 + (ENERGY.build || 0) * .25);
  LT.int = lerp(LT.int, target, .03);                                                        // suavizado (~2 s): sin parpadeos
  return LT.int;
}
const baseBright = () => Math.round(15 + songIntensity() * 70);                               // 15 % tranquila · 85 % intensa
function sendBright(v) { v = Math.round(clamp(v, 1, 100)); if (Math.abs(v - LT.sent) >= 3) { LT.sent = v; lightSend({ bright: v }); } }

function hslRgb(h, s, l) {
  s /= 100; l /= 100;
  const k = n => (n + h / 30) % 12, a = s * Math.min(l, 1 - l);
  const f = n => l - a * Math.max(-1, Math.min(k(n) - 3, 9 - k(n), 1));
  return [f(0), f(8), f(4)].map(v => Math.round(v * 255));
}
function lightSend(body) {
  if (!LT.on || !LT.devices.length) return;
  fetch('/lights', { method: 'POST', body: JSON.stringify(body) }).catch(() => {});
}
function paletteRgb(i) {
  const p = (proc.palette || PAL0)[i % 3];
  return hslRgb(p.h, Math.max(p.s, 85), 50);                  // las luces se ven mejor muy saturadas
}
async function lightsRefresh(scan) {
  try {
    const r = await fetch('/lights' + (scan ? '?scan=1' : '')).then(r => r.json());
    LT.devices = r.devices || [];
    $('lightsName').textContent = LT.devices.length
      ? LT.devices.length + (LT.devices.length === 1 ? ' luz Govee' : ' luces Govee') + ' · ' + LT.devices.map(d => d.sku).join(', ')
      : (r.error ? 'error de red: ' + r.error : 'ninguna luz encontrada · activa "LAN Control" en la app Govee Home');
  } catch (e) { $('lightsName').textContent = 'puente apagado'; }
  $('lightsBtn').textContent = 'luces del cuarto: ' + (LT.on ? 'activadas' : 'desactivadas');
}
$('lightsBtn').onclick = () => { LT.on = !LT.on; try { localStorage.setItem('tc_lights', LT.on ? '1' : '0'); } catch (e) {} if (!LT.on) lightSend({}); lightsRefresh(false); };
$('lightsScan').onclick = () => { $('lightsName').textContent = 'buscando…'; setTimeout(() => lightsRefresh(false), 3500); lightsRefresh(true); };
lightsRefresh(false); setInterval(() => lightsRefresh(false), 30000);

// en cada cuadro: canción nueva, compás, golpe
const _procFrameL = procFrame;
procFrame = function (t, dt) {
  const hit = IN.beatHit;
  _procFrameL(t, dt);
  if (!LT.on || !LT.devices.length) return;
  const key = ext.key();
  if (key !== LT.key) { LT.key = key; LT.bar = -1; LT.sent = -1; lightSend({ on: true, rgb: paletteRgb(0) }); sendBright(baseBright()); return; }
  const bar = Math.floor((IN.beatCount || 0) / 4);
  if (bar !== LT.bar) { LT.bar = bar; lightSend({ rgb: paletteRgb(bar) }); }
  const base = baseBright();
  if (hit || IN.beatHit) {                                        // el golpe sube sobre la base: suave en baladas, fuerte en drops
    const peak = base + (100 - base) * (.25 + songIntensity() * .55);
    sendBright(peak); setTimeout(() => { LT.sent = -1; sendBright(baseBright()); }, 140);
  } else sendBright(base);
};
// drops: destello blanco y vuelta al color
const _moment = moment;
moment = function (kind) {
  _moment(kind);
  if (mode !== 'proc') return;
  lightSend({ rgb: [255, 245, 230], bright: 100 });
  setTimeout(() => { lightSend({ rgb: paletteRgb((LT.bar || 0) + 1) }); LT.sent = -1; sendBright(baseBright()); }, 350);   // vuelve al brillo de la canción
};
// pausa: luz baja y cálida; al volver, la paleta
setInterval(() => {
  if (!LT.on || !LT.devices.length || !ext.has()) return;
  const st = ext.st.state;
  if (st === LT.lastState) return;
  LT.lastState = st;
  if (st === 'paused') lightSend({ rgb: [255, 170, 90], bright: 20 });
  else if (st === 'playing') { LT.sent = -1; lightSend({ rgb: paletteRgb(0) }); sendBright(baseBright()); }
}, 1000);
