// ============================================================
// semantic.js — el guion de la canción completa.
// Antes de empezar, Claude lee toda la letra (vía el puente, guion.py)
// y devuelve un plan por estrofa (escenario, objetos, ánimo, energía,
// hora, color, transición y un resumen propio) y por verso (qué
// aparece en ese verso, su palabra clave y si va en grande). Ese plan
// manda; las palabras sueltas solo suman si encajan o son algo concreto.
// Lo que pasa verso a verso vive en story.js.
// ============================================================

const SEM = { plans: [], key: '', busy: false, blockNow: -1 };
const autorKey = () => (ext.st.name || '') + '|' + (ext.st.artist || '');
// el guion verso a verso: por índice de verso y por texto (el mismo verso del coro se reconoce igual)
const STORY = { on: false, text: '', lines: {}, byText: new Map(),
  reset() { this.on = false; this.text = ''; this.lines = {}; this.byText.clear(); },
  load(r) { this.reset(); this.add(r); },
  add(r) {
    const norm = t => (t || '').trim().toLowerCase();
    for (const l of r.lines || []) {
      const src = IN.lines[l.i]?.text; if (!src) continue;
      const w = (l.word || '').trim(), has = w && norm(src).includes(norm(w));   // la palabra tiene que estar en el verso
      const e = { objects: [...new Set(l.objects || [])].filter(id => MOTIF[id]).slice(0, 2), word: has ? w : '', big: !!l.big && has, person: (l.person || '').trim() };
      this.lines[l.i] = e; if (!this.byText.has(norm(src))) this.byText.set(norm(src), e);
    }
    if (r.story) this.text = r.story;
    this.on = true;
  },
  forText(t) { return this.byText.get((t || '').trim().toLowerCase()); } };
const SCENE_NAME = { habitacion: 'habitación', orbitas: 'órbitas', tunel: 'túnel', ciudadHeroe: 'ciudad héroe' };
const COLOR_HUE = { calido: 30, frio: 210, neon: 300, pastel: 330, oscuro: 240, dorado: 45, rojo: 355, azul: 220, verde: 130, violeta: 275 };
const MOOD_VA = { euforico: [.7, .9], feliz: [.6, .4], romantico: [.5, .1], sereno: [.3, -.5], nostalgico: [-.2, -.3], melancolico: [-.5, -.3],
                  triste: [-.7, -.4], oscuro: [-.6, .2], rabioso: [-.4, .9], desafiante: [.1, .7] };
const TOD = { amanecer: 0, dia: 1, atardecer: 2, madrugada: 3, noche: 4 };
const SPECIFIC = new Set(['brand', 'nation', 'sport', 'instrument', 'tech', 'hero', 'echo']);

function blockTexts() {
  return IN.cuts.map((a, i) => { const b = IN.cuts[i + 1] ?? Infinity; return IN.lines.filter(l => l.text && l.t >= a && l.t < b).map(l => l.text).join('\n'); });
}
// el resumen nunca puede copiar la letra (4+ palabras seguidas)
function copies(summary, text) {
  const norm = t => t.toLowerCase().replace(/[^\p{L}\p{N} ]/gu, ' ').split(/\s+/).filter(Boolean);
  const s = norm(summary), body = ' ' + norm(text).join(' ') + ' ';
  for (let i = 0; i + 4 <= s.length; i++) if (body.includes(' ' + s.slice(i, i + 4).join(' ') + ' ')) return true;
  return false;
}
// ---------- la canción completa se lee ANTES de encender la experiencia ----------
GENS.push({ name: 'espera', make: () => ({}),                          // escena liviana mientras la IA lee
  draw(p, t, dt, R, E) {
    const p0 = (proc.palette || PAL0)[0], p2 = (proc.palette || PAL0)[2];
    bg(`hsl(${p0.h},30%,6%)`, `hsl(${p2.h},30%,10%)`); drawStars(t, .5);
    glow(W / 2, H * .45, S() * (.45 + Math.sin(t * .8) * .05), CA(0, 5), .18);
  } });
const prepEl = document.createElement('div'); prepEl.id = 'prep';
prepEl.innerHTML = '<span>Claude está leyendo la canción · preparando el video</span><i><b></b></i>';
document.body.appendChild(prepEl);
{ const st = document.createElement('style'); st.textContent = `
  #prep { position:fixed; top:48px; left:0; right:0; margin:auto; width:max-content; z-index:4; display:flex; flex-direction:column; align-items:center; gap:8px;
          color:var(--dim); font:400 10px/1 Inter,sans-serif; letter-spacing:.3em; text-transform:uppercase; opacity:0; transition:opacity .6s; pointer-events:none; }
  #prep.show { opacity:1; }
  #prep i { display:block; width:180px; height:2px; background:rgba(243,236,223,.12); overflow:hidden; border-radius:2px; }
  #prep b { display:block; height:100%; width:0; background:rgba(243,236,223,.6); transition:width .4s linear; }`; document.head.appendChild(st); }

async function planSong() {
  const useAI = !!(window.CFG && CFG.ai);                           // por defecto dirige lumora sola; Claude es opcional
  const key = ext.key() + '|' + IN.cuts.length + '|' + (window.SESSION || '');
  if (SEM.key === key || IN.cuts.length < 2) return;
  SEM.key = key; SEM.plans = []; SEM.blockNow = -1; STORY.reset();
  const lines = IN.lines.map((l, i) => ({ i, t: l.t, text: l.text })).filter(l => l.text && l.text.trim());
  // sin letra (instrumental o sin sincronizar): el guion sale de la estructura, al instante y sin IA
  if (!lines.length) {
    const v = DIR.plan();
    if (v.error || SEM.key !== key) return;
    for (const b of v.blocks) { b.objects = [...new Set(b.objects || [])].slice(0, 4); b.energy = clamp(b.energy ?? 5, 0, 10); applyPlan(b.n, b); }
    STORY.add(v); diversify();
    IN.aiState = 'director de lumora'; ui();
    return;
  }
  // varias lecturas a la vez: la primera solo hasta el primer verso cantado (corta, rápida) y el resto
  // repartido en tramos que terminan antes de que la canción llegue a ellos.
  const rate = (() => { try { return +localStorage.getItem('tc_story_rate') || 2.2; } catch (e) { return 2.2; } })();   // segundos por verso
  const OVH = 12, n = IN.cuts.length, p0 = ext.active() ? ext.now() : 0;
  const nIn = (a, b) => lines.filter(l => l.t >= IN.cuts[a] && l.t < (IN.cuts[b + 1] ?? 1e9)).length;
  const gen = k => OVH + k * rate;
  const segs = [[0, Math.max(0, IN.cuts.findLastIndex(c => c <= lines[0].t))]];
  // la primera va con esfuerzo bajo (~6 s); mientras la música espera, las demás ya avanzan
  const hold = Math.max(0, 5 + nIn(...segs[0]) * .3 - Math.max(0, lines[0].t - p0));
  for (let st = segs[0][1] + 1; st < n;) {
    let e = st;
    while (e + 1 < n && gen(nIn(st, e + 1)) <= IN.cuts[st] - p0 + hold - 3) e++;
    segs.push([st, e]); st = e + 1;
    if (segs.length === 6 && st < n) { segs[5][1] = n - 1; break; }
  }
  const body = (range, fast) => JSON.stringify({ title: ext.st.name || '', artist: ext.st.artist || '', genre: IN.genre || '', dur: proc.dur || 0, cuts: IN.cuts, lines, range, fast });
  const ask = (range, i) => { const t = performance.now(), k = nIn(range[0], range[1]);
    return fetch('/story', { method: 'POST', body: body(n > 1 ? range : null, i === 0) }).then(r => r.json()).catch(() => ({ error: 'sin conexión con el puente' }))
      .then(v => { if (i && !v.error && !v.cached && k >= 4) try { localStorage.setItem('tc_story_rate', Math.max(.6, ((performance.now() - t) / 1000 - OVH) / k * .5 + rate * .5).toFixed(2)); } catch (e) {}
        return v; }); };
  // si el usuario armó esta canción a mano (modo autor), manda su versión y Claude no lee nada
  let own = null;
  try { own = await fetch('/autor?key=' + encodeURIComponent(autorKey())).then(r => r.json()); } catch (e) {}
  if (SEM.key !== key) return;
  if (!(own && own.blocks && own.cuts && own.cuts.length === IN.cuts.length)) own = null;
  const reqs = own ? [Promise.resolve({ ...own, cached: true, autor: true })] : useAI ? segs.map(ask) : [Promise.resolve(DIR.plan())], req = reqs[0], rest = reqs.slice(1);
  let r = null; req.then(v => r = v);
  const esperaGi = GENS.findIndex(g => g.name === 'espera');
  const planned = IN.blockGen ? [...IN.blockGen] : [];                  // el guion por género queda de respaldo
  IN.preparing = true; SEM.prevLow = window.LOWFX; window.LOWFX = true;
  IN.blockGen = IN.cuts.map(() => esperaGi); IN.motifs = {};
  const t0 = performance.now(), est = 5 + nIn(...segs[0]) * .3;  // segundos aproximados de la primera lectura
  // la intro suena normal; la música solo se detiene si llega el primer verso y el guion todavía no
  let paused = null;
  const showT = setTimeout(() => { if (!r && SEM.key === key) prepEl.classList.add('show'); }, 1200);
  const watch = setInterval(() => {
    if (r || SEM.key !== key || paused !== null) return;
    if (ext.st.state === 'playing' && document.visibilityState === 'visible' && ext.now() >= lines[0].t - 1.2 && p0 < lines[0].t + 30) { paused = ext.now(); ext.cmd('pause'); }
  }, 150);
  const tick = setInterval(() => { prepEl.querySelector('b').style.width = Math.min(95, (performance.now() - t0) / 10 / est) + '%'; }, 300);
  await req;
  { const w0 = performance.now(), cap = useAI ? 8000 : 500; while (!IN.trHead && performance.now() - w0 < cap && SEM.key === key) await new Promise(r => setTimeout(r, 100)); }
  clearTimeout(showT); clearInterval(watch); clearInterval(tick); prepEl.querySelector('b').style.width = '100%';
  if (SEM.key !== key) return;
  IN.blockGen = planned;
  const useStory = v => {
    if (!v.blocks || SEM.key !== key) return;
    for (const b of v.blocks) {
      if (!(b.n >= 0 && b.n < IN.cuts.length)) continue;
      b.objects = [...new Set(b.objects || [])].slice(0, 4); b.energy = clamp(b.energy ?? 5, 0, 10);
      applyPlan(b.n, b);
    }
    STORY.add(v);
  };
  let local = null;
  const localPlan = () => local || (local = DIR.plan());
  if (r.error && !own) { const v = localPlan(); if (!v.error) r = { ...v, fallback: r.error }; }
  useStory(r);
  diversify();
  const label = v => v.error ? 'Claude: ' + v.error : v.autor ? 'guion del autor' : v.via === 'local' ? 'director de lumora' + (v.fallback ? ' (Claude no respondió)' : '') : 'guion de Claude' + (v.cached ? ' (de memoria)' : '');
  let left = rest.length;
  IN.aiState = label(r) + (left && !r.error ? ' · leyendo el resto' : '');
  const inRange = ([a, b]) => ({ blocks: localPlan().blocks?.filter(p => p.n >= a && p.n <= b) || [],
    lines: localPlan().lines?.filter(l => IN.lines[l.i] && IN.lines[l.i].t >= IN.cuts[a] && IN.lines[l.i].t < (IN.cuts[b + 1] ?? 1e9)) || [] });
  rest.forEach((q, k) => q.then(v => { if (SEM.key !== key) return; useStory(v.error ? inRange(segs[k + 1]) : v); left--;
    if (!r.error) IN.aiState = v.error ? 'guion de Claude (un tramo lo dirigió lumora)' : label(r) + (left ? ' · leyendo el resto' : ''); ui(); }));
  IN.preparing = false; window.LOWFX = SEM.prevLow; SEM.blockNow = -1;
  setTimeout(() => prepEl.classList.remove('show'), 300);
  if (paused !== null && ext.key() + '|' + IN.cuts.length + '|' + (window.SESSION || '') === key) ext.cmd('play');   // sigue justo donde se detuvo
  if (typeof startTransition === 'function') startTransition('fade');  // entra la experiencia completa
  ui();
}
// variedad: ningún escenario más de 2 veces seguidas ni más del 30% de la canción
function diversify() {
  if (!IN.blockGen) return;
  const n = IN.blockGen.length, cap = Math.max(2, Math.ceil(n * (STORY.on ? .3 : .18))), count = {};
  const byName = nm => GENS.findIndex(g => g.name === nm);
  const G = GENRE[IN.genre];
  for (let i = 0; i < n; i++) {
    const g = IN.blockGen[i], plan = SEM.plans[i];
    const repeated = i >= 2 && IN.blockGen[i - 1] === g && IN.blockGen[i - 2] === g;
    if (!repeated && (count[g] || 0) < cap) { count[g] = (count[g] || 0) + 1; continue; }
    // alternativas: lo que sugieren sus objetos, luego el género/artista, luego el orden procedural
    const opts = [...(plan?.objects || []).map(o => byName(SCENE_FOR[o])), ...(G?.scenes || []).map(byName), ...proc.order]
      .filter(x => x >= 0 && x !== g && x !== IN.blockGen[i - 1] && (count[x] || 0) < cap && GENS[x].name !== 'espera');
    // entre las que encajan, la menos usada (a igualdad, la que sugería primero el plan)
    const pick = opts.length ? opts.reduce((best, x) => (count[x] || 0) < (count[best] || 0) ? x : best, opts[0]) : g;
    IN.blockGen[i] = pick; count[pick] = (count[pick] || 0) + 1;
  }
}
function applyPlan(i, plan) {
  SEM.plans[i] = plan;
  const name = SCENE_NAME[plan.scene] || plan.scene, gi = GENS.findIndex(g => g.name === name);
  if (gi >= 0 && IN.blockGen && (IN.preparing === false || i !== SEM.blockNow)) {                  // no se cambia la estrofa que ya está en pantalla
    IN.blockGen[i] = gi;
    if (name === 'cielo') proc.params[i + ':cielo'] = { ...GENS[gi].make(mulberry(proc.seed + i)), tod: TOD[plan.time] ?? 2 };
  }
}

// ---------- cuando empieza cada estrofa, manda su plan ----------
const _procFrameSem = procFrame;
procFrame = function (t, dt) {
  const time = ext.active() ? ext.now() : T;
  const sec = IN.cuts.length > 1 ? Math.max(0, IN.cuts.findLastIndex(c => c <= time)) : -1;
  const plan = SEM.plans[sec];
  if (sec !== SEM.blockNow) {
    SEM.blockNow = sec;
    if (plan) {
      const dur = (IN.cuts[sec + 1] ?? proc.dur) - IN.cuts[sec];
      for (const id of plan.objects || []) { if (!MOTIF[id]) continue; const m = IN.motifs[id] || (IN.motifs[id] = { k: 0 }); m.target = 1; m.hold = Math.max(6, dur); }
      const [v, a] = MOOD_VA[plan.mood] || [0, 0];
      IN.mood.tv = v; IN.mood.ta = a * .6 + ((plan.energy ?? 5) - 5) / 12;
      if (plan.summary) { IN.lastConcept = ''; setTag(plan.summary.toLowerCase().replace(/[.。]$/, '')); IN.concepts = ['_plan']; }
    }
  }
  // el color de la estrofa: la paleta se inclina hacia el tono elegido
  const pal = proc.palette; let tinted = null;
  if (plan && COLOR_HUE[plan.color] !== undefined && pal && !(window.CFG && CFG.palette !== 'auto' && CFG.palette !== 'evolutiva')) {
    const target = COLOR_HUE[plan.color];
    tinted = pal.map((p, i) => { const d = ((target - p.h + 540) % 360) - 180; return { ...p, h: (p.h + d * (i === 0 ? .55 : .3) + 360) % 360, l: plan.color === 'oscuro' ? p.l - 10 : plan.color === 'pastel' ? Math.min(80, p.l + 12) : p.l }; });
    proc.palette = tinted;
  }
  try { _procFrameSem(t, dt); } finally { if (tinted) proc.palette = pal; }
};

// ---------- las palabras sueltas solo suman si encajan con el plan ----------
const _interpretSem = interpret;
interpret = function (text) {
  const before = new Set(Object.keys(IN.motifs));
  const found = _interpretSem(text);
  if (IN.preparing) { for (const id of Object.keys(IN.motifs)) if (!before.has(id)) delete IN.motifs[id]; return []; }
  const plan = SEM.plans[SEM.blockNow], L = STORY.on ? STORY.forText(text) : null;
  if (L) for (const id of L.objects) { const m = IN.motifs[id] || (IN.motifs[id] = { k: 0, born: performance.now(), seed: Math.random() * 1e6 }); m.target = 1; m.hold = Math.max(m.hold || 0, 7); }
  if (plan) {
    const allowed = new Set([...(plan.objects || []), ...(L?.objects || []), plan.atmos]);
    for (const id of Object.keys(IN.motifs)) if (!before.has(id) && !allowed.has(id) && !SPECIFIC.has(id)) delete IN.motifs[id];
    if (IN.concepts[0] === '_plan' || plan.summary) return [];          // la etiqueta de arriba muestra el sentido, no palabras sueltas
  }
  return found;
};

// ---------- se lanza cuando la letra ya está repartida en estrofas ----------
const _planScenesSem = planScenes;
planScenes = function () { _planScenesSem(); SEM.blockNow = -1; setTimeout(planSong, 50); };

// estado de la IA en el panel
const _uiSem = ui;
ui = function () { _uiSem(); if (IN.aiState && ext.has() && mode === 'proc') $('nowSub').textContent += ' · ' + IN.aiState; };

// durante la lectura: sin instrumentos ni tarjetas
{ const f = activeInstruments; activeInstruments = () => IN.preparing ? [] : f(); }
{ const f = drawCards; drawCards = dt => { if (!IN.preparing) f(dt); }; }
