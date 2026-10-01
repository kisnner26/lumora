// ============================================================
// story.js — el guion de Claude manda sobre lo aleatorio.
// Con guion: el escenario secundario y la capa ambiental de cada
// estrofa salen del guion (ya no del azar), la transición sigue el
// carácter que pidió Claude, la palabra gigante aparece en los versos
// que lo merecen y con la palabra que él eligió, y las personas
// famosas que nombra la letra salen en su verso.
// ============================================================

const TR_FEEL = {
  suave: ['fade', 'dissolve', 'curtain'],
  corte: ['slide', 'wipe', 'split', 'blinds'],
  impacto: ['shatter', 'glitch', 'pixel', 'zoom'],
  onirico: ['ripple', 'swirl', 'iris', 'diamond'],
  velocidad: ['warp', 'zoomOut', 'zoom', 'slide'],
};

// ---------- receta: segundo escenario y capa ambiental del guion ----------
const _recipeForStory = recipeFor;
recipeFor = sec => {
  const rec = _recipeForStory(sec), plan = STORY.on ? SEM.plans[sec] : null;
  if (!plan || rec._story) return rec;
  rec._story = true;
  const name2 = SCENE_NAME[plan.scene2] || plan.scene2, g2 = plan.scene2 && plan.scene2 !== 'ninguno' ? GENS.findIndex(g => g.name === name2) : -1;
  rec.dual = g2 >= 0 && g2 !== IN.blockGen?.[sec] ? g2 : -1;
  rec.dualParams = rec.dual >= 0 ? GENS[rec.dual].make(mulberry(proc.seed + sec * 7)) : null;
  rec.extra = plan.atmos && plan.atmos !== 'ninguno' && MOTIF[plan.atmos] ? plan.atmos : null;
  return rec;
};

// ---------- transición según el carácter del cambio ----------
const _pickTransitionStory = pickTransition;
pickTransition = sec => {
  const plan = STORY.on ? SEM.plans[sec] : null;
  const opts = (TR_FEEL[plan?.transition] || []).filter(k => TR[k]);
  if (!opts.length) return _pickTransitionStory(sec);
  const r = secRng(sec, 'trs'); TRANS.params = transParams(r);
  return pick(r, opts);
};

// ---------- la palabra clave de cada verso la elige el guion ----------
const _salientStory = salient;
salient = text => STORY.on && STORY.forText(text)?.word || _salientStory(text);

// ---------- en cada verso: palabra gigante y persona famosa ----------
const _interpretStory = interpret;
interpret = function (text) {
  const found = _interpretStory(text);
  const L = STORY.on && !IN.preparing ? STORY.forText(text) : null;
  if (L?.big && performance.now() - (STORY.lastBig || 0) > 5000) {
    STORY.lastBig = performance.now();
    setTimeout(() => { KIN.last = 0; kinetic(); }, 280);                  // entra un instante después del verso
  }
  if (L?.person && typeof askWiki === 'function' && !(window.CFG && CFG.cards === false)) askWiki(L.person);
  return found;
};

// al cambiar de canción el guion anterior no se arrastra
const _loadSongMetaStory = loadSongMeta;
loadSongMeta = async function () { STORY.reset(); return _loadSongMetaStory(); };
