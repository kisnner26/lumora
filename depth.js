// ============================================================
// depth.js — profundidad real y tipografía cinética.
// Una cámara virtual se mece despacio; cada capa responde según
// su profundidad (fondo poco, primer plano mucho) y en los drops
// y coros la cámara empuja hacia adentro. En esos momentos la
// palabra más fuerte de la línea aparece gigante un instante.
// ============================================================

// ---------- cámara ----------
const CAM = window.CAM = {
  x: 0, y: 0, push: 0,
  update(dt) {
    const s = IN.clock || 0;
    this.x = Math.sin(s * .11) * W * .018 + Math.sin(s * .047 + 1) * W * .01;
    this.y = Math.cos(s * .083) * H * .012;
    this.push *= Math.exp(-dt * 1.6);                                     // el empujón se asienta en ~1 s
  },
  kick(v) { this.push = Math.max(this.push, v); },
  // dibuja algo como si estuviera a cierta profundidad (0 = infinito, 1 = cerca)
  layer(d, fn) {
    const z = 1.05 + d * .02 + this.push * .14 * d;
    x.save(); x.translate(W / 2 + this.x * d, H / 2 + this.y * d); x.scale(z, z); x.translate(-W / 2, -H / 2);
    try { fn(); } finally { x.restore(); }
  },
};

// qué tan cerca está cada capa
const NEAR = new Set(['woman', 'man', 'couple', 'crowd', 'speakers', 'candles', 'cactus', 'home', 'drink', 'phone', 'sport', 'brand', 'nation',
  'flamboyan', 'neonpalms', 'rollercoaster', 'skyline6', 'polaroids', 'beach', 'forest', 'city', 'graffiti', 'vinyl', 'taillights']);
const FAR = new Set(['stars', 'moon', 'sun', 'heaven', 'mountain', 'light', 'dark', 'dream', 'lightleak', 'plane']);
const FRONT = new Set(['rain', 'snow', 'petal', 'flowers', 'leaves', 'money', 'tears']);            // partículas que pasan cerca de la cámara
CAM.depthOf = id => FRONT.has(id) ? 1.15 : NEAR.has(id) ? 1 : FAR.has(id) ? .35 : .65;
// las capas planas de pantalla completa (grano, VHS, parpadeo) no se mueven
const FLAT = new Set(['filmgrain', 'vhs', 'flicker', 'echo', 'dance']);
CAM.draw = (id, fn) => FLAT.has(id) ? fn() : CAM.layer(CAM.depthOf(id), fn);

// ---------- tipografía cinética ----------
const KIN = { last: 0, el: null };
function kinetic() {
  const now = performance.now();
  if (now - KIN.last < 6000 || mode !== 'proc' || !IN.synced) return;
  const time = ext.active() ? ext.now() : T;
  let line = IN.lines[IN.shown]?.text;
  if (!line) line = IN.lines.find(l => l.text && l.t >= time && l.t < time + 3)?.text;
  const word = line && salient(line).replace(/[^\p{L}\p{N}'’-]/gu, '');
  if (!word || word.length < 3) return;
  KIN.last = now;
  const el = document.createElement('div'); el.className = 'kin';
  const ref = document.querySelector('#lyr .line') || lyr;
  const cs = getComputedStyle(ref);
  el.style.fontFamily = cs.fontFamily; el.style.fontStyle = cs.fontStyle;
  const upper = !['serif', 'vintage'].includes(lyr.dataset.font || '');
  el.textContent = upper ? word.toUpperCase() : word;
  el.style.setProperty('--glow', C(0, .9, 15));
  document.body.appendChild(el);
  const fit = Math.min(1, innerWidth * .92 / el.scrollWidth);               // que quepa siempre
  el.style.setProperty('--fit', fit.toFixed(3));
  lyr.classList.add('dim');
  setTimeout(() => { el.remove(); lyr.classList.remove('dim'); }, 1350);
}
const kinCss = document.createElement('style');
kinCss.textContent = `
  .kin { position:fixed; inset:0; display:grid; place-items:center; pointer-events:none; z-index:3; white-space:nowrap;
         font-size:22vw; line-height:1; font-weight:400; color:#fff; letter-spacing:.02em;
         text-shadow:0 0 30px var(--glow); animation:kin 1.3s cubic-bezier(.2,.7,.2,1) forwards; }
  @keyframes kin {
    0%   { opacity:0; transform:scale(calc(var(--fit,1) * 1.35)); letter-spacing:.25em; }
    18%  { opacity:1; transform:scale(var(--fit,1)); letter-spacing:.02em; }
    78%  { opacity:1; transform:scale(calc(var(--fit,1) * .98)); }
    100% { opacity:0; transform:scale(calc(var(--fit,1) * .93)); }
  }
  #lyr { transition:opacity .25s ease; }
  #lyr.dim { opacity:.12; }
`;
document.head.appendChild(kinCss);

// drops y coros: la cámara empuja y aparece la palabra
const _momentK = moment;
moment = function (kind) {
  _momentK(kind);
  if (mode !== 'proc') return;
  CAM.kick(kind === 'drop' ? 1 : .6);
  kinetic();
};
// con sonido real los coros no disparan "moment"; aquí sí disparan la palabra y el empujón
let kinSec = '';
function chorusStart(sec) {
  if (!AUD.live || !IN.synced) return;
  const key = ext.key() + ':' + sec; if (key === kinSec) return; kinSec = key;
  const norm = t => t.toLowerCase().replace(/[^\p{L}\p{N} ]/gu, '').trim(), count = {};
  for (const l of IN.lines) if (l.text) count[norm(l.text)] = (count[norm(l.text)] || 0) + 1;
  const a = IN.cuts[sec], b = IN.cuts[sec + 1] ?? Infinity, ls = IN.lines.filter(l => l.text && l.t >= a && l.t < b);
  if (sec > 0 && ls.length >= 2 && ls.filter(l => count[norm(l.text)] >= 2).length / ls.length >= .5) { CAM.kick(.6); setTimeout(kinetic, 250); }
}

// ---------- en cada cuadro ----------
const _procFrameD = procFrame;
procFrame = function (t, dt) {
  CAM.update(dt || .016);
  if (IN.cuts.length > 1) chorusStart(Math.max(0, IN.cuts.findLastIndex(c => c <= (ext.active() ? ext.now() : T))));
  _procFrameD(t, dt);
  lyr.style.transform = `translate(${(-CAM.x * .35).toFixed(1)}px, ${(-CAM.y * .35).toFixed(1)}px)`;   // la letra flota por delante
};
const _openPanelD = openPanel;
openPanel = function () { _openPanelD(); lyr.style.transform = ''; lyr.classList.remove('dim'); document.querySelectorAll('.kin').forEach(e => e.remove()); };
