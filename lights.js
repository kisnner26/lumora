// ============================================================
// lights.js — las luces del cuarto son parte del video, no un accesorio.
//
// Un motor: en cada cuadro calcula el color y el brillo que la canción
// pide y el emisor manda solo lo que cambió (Govee por LAN, vía el puente).
//   · color: UNO por canción — el tono que Claude le leyó a la canción
//     entera (el color dominante de sus estrofas), o el de la portada,
//     o uno fijo. "por partes" lo cambia solo al cambiar de sección, con
//     fundido lento. Nunca salta de color por compás.
//   · movimiento: el bpm decide el pulso. respira = una ola por compás;
//     pulso = un golpe por tiempo (a medio tiempo si la canción corre);
//     fiesta = golpes secos y destellos. La energía de cada sección
//     decide cuán hondo y cuán filo es el pulso.
//   · sincronía predictiva: el wifi y la luz tardan ~100-200 ms en aplicar
//     una orden, así que el pulso se calcula `lead` ms por delante.
// ============================================================

const LT_DEF = { mode: 'pulso', color: 'cancion', hue: 32, depth: .65, max: 90, drops: true, pause: true };
const LT_MODES = [['quieta', 'quieta'], ['respira', 'respira'], ['pulso', 'pulso'], ['fiesta', 'fiesta']];
const LT_COLORS = [['cancion', 'la canción'], ['portada', 'portada'], ['partes', 'por partes'], ['fijo', 'fijo']];
const LT = {
  on: (() => { try { return localStorage.getItem('tc_lights') !== '0'; } catch (e) { return true; } })(),
  lead: (() => { try { const s = localStorage.getItem('lm_lights_lead'), v = s === null ? NaN : +s; return Number.isFinite(v) ? clamp(v, 0, 350) : 130; } catch (e) { return 130; } })(),
  o: (() => { try { return { ...LT_DEF, ...JSON.parse(localStorage.getItem('lm_lights_opts') || '{}') }; } catch (e) { return { ...LT_DEF }; } })(),
  devices: [], key: '', lastState: '', calib: 0, calibEnd: null,
  col: [255, 180, 110], int: .5, at: 0, flash: null, view: null,
  sentRgb: null, rgbAt: 0, sent: -1, briAt: 0, onSent: false,
};
function setLightsLead(ms) { LT.lead = clamp(Math.round(ms), 0, 350); try { localStorage.setItem('lm_lights_lead', LT.lead); } catch (e) {} }
function setLightsOpt(k, v) { LT.o[k] = v; try { localStorage.setItem('lm_lights_opts', JSON.stringify(LT.o)); } catch (e) {} LT.sentRgb = null; }

// qué tan intensa suena la canción ahora mismo (0 = muy tranquila, 1 = muy fuerte), suavizado ~2 s
function songIntensity() {
  let target;
  if (window.AUD?.live) target = clamp(AUD.level * 1.15);
  else {
    const plan = typeof SEM !== 'undefined' ? SEM.plans?.[SEM.blockNow] : null;
    target = plan ? clamp((plan.energy ?? 5) / 10) : clamp(.5 + (IN.mood?.a || 0) * .45);
  }
  if (typeof ENERGY !== 'undefined') target = clamp(target - (ENERGY.calm || 0) * .3 + (ENERGY.build || 0) * .25);
  LT.int = lerp(LT.int, target, .03);
  return LT.int;
}

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

// ---------- el color ----------
// las palabras de color del guion, traducidas a luz (muy saturadas: así se ven bien las tiras)
const LT_TONES = { calido: [28, 95, 52], frio: [198, 80, 56], neon: [305, 100, 52], pastel: [335, 65, 72], oscuro: [250, 80, 40],
                   dorado: [40, 95, 50], rojo: [356, 95, 48], azul: [220, 95, 52], verde: [142, 85, 45], violeta: [275, 90, 55] };
const toneRgb = name => LT_TONES[name] ? hslRgb(...LT_TONES[name]) : null;
function coverRgb() {
  if (typeof artImg === 'undefined' || !artImg) return null;
  if (LT.coverFor !== artImg.src) { const p = paletteFrom(artImg, 7)?.[0]; LT.coverFor = artImg.src; LT.coverCol = p ? hslRgb(p.h, Math.max(p.s, 82), 52) : null; }
  return LT.coverCol;
}
function songToneRgb() {                                       // el tono de la canción entera: el color que más se repite en sus estrofas
  const plans = typeof SEM !== 'undefined' ? SEM.plans : null;
  if (!plans?.length) return null;
  const n = {};
  for (const p of plans) if (p?.color) n[p.color] = (n[p.color] || 0) + 1;
  const best = Object.entries(n).sort((a, b) => b[1] - a[1])[0];
  return best ? toneRgb(best[0]) : null;
}
function targetRgb() {
  const o = LT.o, fixed = () => hslRgb(o.hue, 90, 52);
  if (o.color === 'fijo') return fixed();
  if (o.color === 'portada') return coverRgb() || fixed();
  if (o.color === 'partes') return toneRgb(typeof SEM !== 'undefined' && SEM.plans?.[SEM.blockNow]?.color) || songToneRgb() || coverRgb() || fixed();
  return songToneRgb() || coverRgb() || fixed();
}

// ---------- el movimiento: el bpm manda ----------
function pulseEnv(energy) {                                    // 0..1: cuánto está "encendido" el pulso, `lead` ms en el futuro
  const o = LT.o;
  if (o.mode === 'quieta') return 0;
  if (window.AUD?.live) return IN.beat || 0;                   // con micrófono el golpe es real: se sigue tal cual
  if (!IN.period) return 0;
  const bpm = IN.bpm || 60 / IN.period;
  const bt = ((ext.has() ? ext.now() : 0) + LT.lead / 1000 - IN.phase) / IN.period;
  let every;
  if (o.mode === 'respira') every = bpm < 105 ? 4 : 8;         // una ola por compás; si la canción corre, una cada dos
  else {
    every = bpm > 138 ? 2 : 1;                                 // a más de ~140 bpm, a medio tiempo: si no, es un estroboscopio
    if (o.mode === 'pulso' && energy < .35) every *= 2;        // en lo tranquilo el pulso se espacia
  }
  const ph = (((bt % every) + every) % every) / every;
  if (o.mode === 'respira') return (1 + Math.cos(2 * Math.PI * ph)) / 2;    // ola suave, cresta en el tiempo fuerte
  return Math.pow(1 - ph, o.mode === 'fiesta' ? 5 : 2.2 + energy * 2.5);   // golpe: sube de una vez y cae; más filo cuanta más energía
}

// ---------- el emisor: solo lo que cambió, sin ahogar el wifi de la luz ----------
function lightOut(rgb, bright, now, force) {
  const r = rgb.map(v => Math.round(clamp(v, 0, 255))), b = Math.round(clamp(bright, 1, 100));
  LT.view = { rgb: r, bright: b };
  const pv = document.getElementById('ltNow');
  if (pv?.offsetParent) { pv.style.setProperty('--c', `rgb(${r})`); pv.style.setProperty('--b', b / 100); }
  if (!LT.on || !LT.devices.length || LT.calib) return;
  const body = {};
  if (!LT.onSent) { body.on = true; LT.onSent = true; }
  if (force || !LT.sentRgb || (now - LT.rgbAt > 120 && r.some((v, i) => Math.abs(v - LT.sentRgb[i]) >= 5))) { body.rgb = r; LT.sentRgb = r; LT.rgbAt = now; }
  if (force || (now - LT.briAt >= 40 && Math.abs(b - LT.sent) >= 2)) { body.bright = b; LT.sent = b; LT.briAt = now; }
  if (body.on || body.rgb || body.bright) lightSend(body);
}

// ---------- el motor, en cada cuadro del video ----------
const _procFrameL = procFrame;
procFrame = function (t, dt) {
  _procFrameL(t, dt);
  if (mode !== 'proc' || !ext.has()) return;
  const now = performance.now(), step = Math.min(.1, (now - (LT.at || now)) / 1000); LT.at = now;
  const key = ext.key();
  if (key !== LT.key) { LT.key = key; LT.sentRgb = null; LT.flash = null; }       // canción nueva: el color se funde hacia el suyo
  const o = LT.o, energy = songIntensity();
  let rgb = targetRgb(), bright;
  if (ext.st.state !== 'playing') {
    if (!o.pause) return;
    rgb = [255, 150, 70]; bright = 12;                                           // en pausa: luz baja y cálida
  } else {
    const top = o.max * (.5 + .5 * energy);
    const depth = o.mode === 'quieta' ? 0 : o.depth * (o.mode === 'respira' ? .8 : .55 + .45 * energy);
    bright = top * (1 - depth * (1 - pulseEnv(energy)));
  }
  // el color nunca salta: se funde (~1.5 s); un destello manda por encima mientras dura
  const k = 1 - Math.exp(-step / 1.5);
  LT.col = LT.col.map((v, i) => v + (rgb[i] - v) * k);
  if (LT.flash && now < LT.flash.until) {
    const f = LT.flash, a = clamp((f.until - now) / f.len);
    return lightOut(f.rgb ? f.rgb : LT.col, lerp(bright, f.bright, a), now, f.first && !(f.first = false));
  }
  LT.flash = null;
  lightOut(LT.col, bright, now);
};
// momentos: en el coro la luz se abre; en el drop, destello blanco (si los destellos están permitidos)
const _moment = moment;
moment = function (kind) {
  _moment(kind);
  if (mode !== 'proc' || LT.o.mode === 'quieta') return;
  const now = performance.now(), strobe = LT.o.drops && (typeof CFG === 'undefined' || CFG.flashes);
  if (kind === 'drop' && strobe && LT.o.mode !== 'respira') LT.flash = { until: now + 260, len: 260, rgb: [255, 245, 230], bright: 100, first: true };
  else if (kind === 'drop' || kind === 'coro') LT.flash = { until: now + 900, len: 900, rgb: null, bright: LT.o.max, first: false };
};
// al volver de la pausa, que el color se reenvíe aunque no haya cambiado
setInterval(() => { const st = ext.st.state; if (st !== LT.lastState) { LT.lastState = st; LT.sentRgb = null; LT.sent = -1; } }, 250);

// ---------- dispositivos ----------
async function lightsRefresh(scan) {
  try {
    const r = await fetch('/lights' + (scan ? '?scan=1' : '')).then(r => r.json());
    const had = LT.devices.length;
    LT.devices = r.devices || [];
    if (LT.devices.length !== had) { LT.onSent = false; LT.sentRgb = null; }
    $('lightsName').textContent = LT.devices.length
      ? LT.devices.length + (LT.devices.length === 1 ? ' luz Govee' : ' luces Govee') + ' · ' + LT.devices.map(d => d.sku).join(', ')
      : (r.error ? 'error de red: ' + r.error : 'ninguna luz encontrada · activa "LAN Control" en la app Govee Home');
  } catch (e) { $('lightsName').textContent = 'puente apagado'; }
  $('lightsBtn').textContent = 'luces del cuarto: ' + (LT.on ? 'activadas' : 'desactivadas');
}
$('lightsBtn').onclick = () => {
  if (LT.on) lightSend({ rgb: [255, 190, 130], bright: 60 });    // al soltarlas quedan en una luz cálida normal, no congeladas en un golpe
  LT.on = !LT.on; LT.onSent = false; LT.sentRgb = null;
  try { localStorage.setItem('tc_lights', LT.on ? '1' : '0'); } catch (e) {}
  lightsRefresh(false);
};
$('lightsScan').onclick = () => { $('lightsName').textContent = 'buscando…'; setTimeout(() => lightsRefresh(false), 3500); lightsRefresh(true); };
lightsRefresh(false); setInterval(() => lightsRefresh(false), 30000);

// ---------- calibrar el adelanto: pantalla y luz destellan juntas; se ajusta hasta que coincidan ----------
function lightsCalibStop() {
  if (!LT.calib) return;
  clearInterval(LT.calib); LT.calib = 0; LT.sentRgb = null; LT.sent = -1;
  LT.calibEnd?.(); LT.calibEnd = null;
}
function lightsCalibrate(onBeat, onEnd) {
  if (LT.calib || !LT.on || !LT.devices.length) return false;
  let n = 0;
  LT.calibEnd = onEnd;
  lightSend({ on: true, rgb: [255, 245, 230], bright: 5 });
  LT.calib = setInterval(() => {
    const at = performance.now() + 400;                          // cada destello se agenda 400 ms antes: da margen para adelantar la luz
    setTimeout(() => { lightSend({ bright: 100 }); setTimeout(() => lightSend({ bright: 5 }), 160); }, Math.max(0, at - LT.lead - performance.now()));
    setTimeout(onBeat, at - performance.now());
    if (++n >= 16) setTimeout(lightsCalibStop, 600);
  }, 800);
  return true;
}
