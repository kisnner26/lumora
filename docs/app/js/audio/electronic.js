// ============================================================
// electronic.js — música sin letra, sincronizada de verdad.
// 1. Seguimiento del pulso con los golpes reales del audio: tempo
//    y fase exactos (mejora la sincronía de TODAS las canciones).
// 2. Canciones sin letra: secciones por frases de 8/16 compases,
//    alineadas al tiempo fuerte.
// 3. Estructura por energía: breakdown (calma), build-up (la cámara
//    se acerca y sube la luz) y drop (cambio con zoom).
// 4. Género electrónico con su propio mundo.
// ============================================================

// ---------- 1. seguimiento del pulso ----------
const BT = { onsets: [], locked: false, conf: 0, lastEval: 0 };
window.onOnset = () => {
  if (!ext.has() || ext.st.state !== 'playing') return;
  const ts = ext.now();
  BT.onsets.push(ts); while (BT.onsets.length && ts - BT.onsets[0] > 14) BT.onsets.shift();
  if (performance.now() - BT.lastEval > 2000 && BT.onsets.length > 16) { BT.lastEval = performance.now(); evalTempo(); }
};
function evalTempo() {
  const o = BT.onsets, hist = new Float32Array(141);                    // periodos de 0,30 a 1,00 s en pasos de 5 ms
  for (let i = 0; i < o.length; i++) for (let j = i + 1; j < o.length && o[j] - o[i] < 2.2; j++) {
    let d = o[j] - o[i];
    for (let m = 1; m <= 4; m++) { const p = d / m; if (p >= .3 && p <= 1) { const b = Math.round((p - .3) / .005); for (let k = -2; k <= 2; k++) if (hist[b + k] !== undefined) hist[b + k] += (3 - Math.abs(k)) / m; } }
  }
  let best = 0, bi = 0, sum = 0;
  for (let b = 0; b < hist.length; b++) { sum += hist[b]; if (hist[b] > best) { best = hist[b]; bi = b; } }
  let period = .3 + bi * .005, bpm = 60 / period;
  while (bpm < 85) { bpm *= 2; period /= 2; } while (bpm > 180) { bpm /= 2; period *= 2; }
  BT.conf = best / (sum / hist.length) / 10;                              // qué tanto sobresale el pico
  if (BT.conf < .6) return;
  let sx = 0, sy = 0; for (const t of o) { const a = (t / period % 1) * TAU; sx += Math.cos(a); sy += Math.sin(a); }
  let phase = ((Math.atan2(sy, sx) / TAU) + 1) % 1 * period;
  // segunda pasada: solo los golpes cerca de la rejilla (los contratiempos no arrastran la fase)
  sx = 0; sy = 0;
  for (const t of o) { const off = ((t - phase) / period % 1 + 1.5) % 1 - .5; if (Math.abs(off) < .18) { const a = (t / period % 1) * TAU; sx += Math.cos(a); sy += Math.sin(a); } }
  if (sx || sy) phase = ((Math.atan2(sy, sx) / TAU) + 1) % 1 * period;
  const changed = !BT.locked || Math.abs(bpm - IN.bpm) / IN.bpm > .02 || Math.abs(((phase - IN.phase) / period + 1.5) % 1 - .5) > .15;
  IN.bpm = bpm; IN.period = period; IN.phase = phase; IN.bpmSrc = 'audio';
  if (changed) { BT.locked = true; if (!IN.synced) phraseCuts(); ui(); }
}

// ---------- 2. secciones por frases (canciones sin letra) ----------
function phraseCuts() {
  const dur = ext.st.dur || proc.dur || 240, bar = IN.period * 4;
  let bars = IN.bpm > 100 ? 16 : 8; while (bars > 4 && dur < bar * bars * 3) bars /= 2;     // pistas cortas: frases más cortas
  const phrase = bar * bars; IN.phraseBars = bars;
  const cuts = [0]; for (let t = IN.phase + phrase; t < dur - 4; t += phrase) cuts.push(t);
  IN.cuts = cuts; IN.phraseLen = phrase; planScenes();
}
const _loadSongMetaE = loadSongMeta;
loadSongMeta = async function () {
  BT.onsets = []; BT.locked = false; ENERGY.hist = []; ENERGY.lastPhrase = -1;
  await _loadSongMetaE();
  if (!IN.synced && ext.has()) {
    IN.lyrState = IN.lyrState === 'buscando letra' ? 'sin letra' : IN.lyrState;
    phraseCuts();                                                       // con el tempo de Deezer/Música; el audio lo afina luego
    if (IN.lyrState === 'sin letra' || IN.lyrState === 'instrumental') IN.lyrState = 'instrumental · frases de ' + IN.phraseBars + ' compases';
    ui();
  }
};

// ---------- 3. estructura por energía ----------
const ENERGY = { hist: [], build: 0, calm: 0, lastPhrase: -1 };
const _procFrameE = procFrame;
procFrame = function (t, dt) {
  const time = ext.active() ? ext.now() : T;
  if (window.AUD?.live) {
    const now = performance.now();
    ENERGY.hist.push([now, AUD.level]); while (ENERGY.hist.length && now - ENERGY.hist[0][0] > 8000) ENERGY.hist.shift();
    const h = ENERGY.hist, n = h.length;
    if (n > 60) {
      const avg = h.reduce((a, b) => a + b[1], 0) / n, first = h.slice(0, n / 3).reduce((a, b) => a + b[1], 0) / (n / 3), last = h.slice(-n / 3).reduce((a, b) => a + b[1], 0) / (n / 3);
      ENERGY.build = lerp(ENERGY.build, clamp((last - first) * 4), .05);                    // la energía viene subiendo: build-up
      ENERGY.calm = lerp(ENERGY.calm, clamp((.35 - avg) * 3), .03);                         // energía baja y sostenida: breakdown
      IN.mood.ta = lerp(IN.mood.ta, -ENERGY.calm * .6 + ENERGY.build * .6, .05);
      if (ENERGY.build > .2) CAM.kick(ENERGY.build * .35);
    }
  } else if (!IN.synced && IN.cuts.length > 1) {
    // sin audio: cada dos frases llega un "momento" (como un drop)
    const sec = Math.max(0, IN.cuts.findLastIndex(c => c <= time));
    if (sec !== ENERGY.lastPhrase) { ENERGY.lastPhrase = sec; if (sec > 0 && sec % 2 === 0) moment('drop'); }
  }
  _procFrameE(t, dt);
  // build-up: la luz sube poco a poco antes del drop
  if (ENERGY.build > .25 && (!window.CFG || CFG.flashes)) { x.fillStyle = `rgba(255,250,240,${(ENERGY.build - .25) * .18})`; x.fillRect(0, 0, W, H); }
};

// ---------- sin letra, la palabra gigante sale del título ----------
const _kineticE = kinetic;
kinetic = function () {
  if (IN.synced) return _kineticE();
  const now = performance.now(); if (now - KIN.last < 6000 || mode !== 'proc' || !ext.has()) return;
  const words = (ext.st.name || '').replace(/[(\[].*?[)\]]/g, '').split(/\s+/).map(w => w.replace(/[^\p{L}\p{N}'’-]/gu, '')).filter(w => w.length >= 2);
  if (!words.length) return;
  const saved = IN.lines, savedShown = IN.shown, savedSynced = IN.synced;
  IN.lines = [{ t: 0, text: words[(ENERGY.lastPhrase + 1 + (IN.beatCount >> 6)) % words.length] }]; IN.shown = 0; IN.synced = true;
  try { _kineticE(); } finally { IN.lines = saved; IN.shown = savedShown; IN.synced = savedSynced; }
};

// ---------- 4. género electrónico ----------
GENRE.electronic = { label: 'electrónica', scenes: ['túnel', 'deriva', 'sistema', 'club', 'mandala', 'red', 'órbitas'], ambient: ['neonrings', 'scope', 'binary', 'psyche', 'speakers'], hues: [190, 300, 140] };
const _classifyGenreE = classifyGenre;
classifyGenre = raw => {
  const g = _classifyGenreE(raw);
  if (g === 'artist') return g;
  return /electr|house|techno|trance|edm|dubstep|drum.?(&|and|n).?bass|dnb|garage|ambient|dance|idm|synthwave|hardstyle|phonk/i.test(raw || '') ? 'electronic' : g;
};
