// ============================================================
// mix.js — más combinaciones por sección.
// Sobre la receta de variety.js se suman, con la semilla de cada
// reproducción: un segundo escenario tenue mezclado en modo luz,
// desplazamiento de tono, velocidad de animación, espejo ocasional
// y una capa ambiental extra de todo el catálogo.
// ============================================================

const AMBIENT_POOL = ['stars', 'fireflies', 'rain', 'snow', 'smoke', 'dream', 'lightleak', 'filmgrain', 'neonrings', 'butterflies', 'lanterns',
  'meteors', 'leaves', 'flowers', 'sparkle', 'silk', 'scope', 'binary', 'psyche', 'rainbow', 'light', 'heaven'].filter(id => MOTIF[id]);
const TEXT_SCENES = new Set(['sistema', 'ciudad héroe']);
const TEXT_MOTIFS = ['tech', 'hero', 'brand', 'nation', 'hexdump', 'disasm', 'terminal', 'pow'];

const _recipeForM = recipeFor;
recipeFor = sec => {
  const base = _recipeForM(sec);
  if (base._mix) return base;
  const r = secRng(sec, 'mix2');
  const pickGen = () => Math.floor(r() * GENS.length);
  base._mix = true;
  base.dual = r() < .3 ? pickGen() : -1;                                // segundo escenario tenue
  base.dualA = .18 + r() * .22;
  base.hue = (r() - .5) * 60;                                          // desplazamiento de tono
  base.speed = .7 + r() * .7;                                          // más lento o más rápido
  base.flip = r() < .12;                                               // espejo (nunca con texto)
  base.extra = r() < .45 ? AMBIENT_POOL[Math.floor(r() * AMBIENT_POOL.length)] : null;
  base.dualParams = base.dual >= 0 ? GENS[base.dual].make(mulberry(Math.floor(r() * 1e9))) : null;
  return base;
};

const _procFrameMix = procFrame;
procFrame = function (t, dt) {
  const time = ext.active() ? ext.now() : T;
  const sec = IN.cuts.length > 1 ? Math.max(0, IN.cuts.findLastIndex(c => c <= time)) : Math.floor(time / proc.secLen);
  const rec = recipeFor(sec);
  const genName = GENS[IN.blockGen?.[sec] ?? proc.order[sec % proc.order.length]]?.name;
  const flip = rec.flip && !TEXT_SCENES.has(genName) && !TEXT_MOTIFS.some(id => IN.motifs[id]);
  // tono desplazado solo durante este cuadro
  const pal = proc.palette, shifted = pal && rec.hue ? pal.map(p => ({ ...p, h: (p.h + rec.hue + 360) % 360 })) : null;
  if (shifted) proc.palette = shifted;
  if (flip) { x.save(); x.translate(W, 0); x.scale(-1, 1); }
  try {
    _procFrameMix(t, (dt || .016) * rec.speed);
    if (rec.dual >= 0 && rec.dualParams && !(window.CFG?.quality === 'baja') && !window.LOWFX && !IN.preparing) {
      x.save(); x.globalAlpha = rec.dualA; x.globalCompositeOperation = 'screen';
      try { CAM.layer(.3, () => GENS[rec.dual].draw(clamp((time % 20) / 20), IN.clock * .8, dt, rec.dualParams, IN.beat || 0)); } catch (e) {}
      x.restore();
    }
    if (rec.extra && !IN.preparing) CAM.draw(rec.extra, () => MOTIF[rec.extra](.35, IN.clock, IN.beat || 0));
  } finally {
    if (flip) x.restore();
    if (shifted) proc.palette = pal;
  }
};
