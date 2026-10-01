// ============================================================
// moments.js — el sonido real manda.
// 1. Oído: niveles del audio del sistema (graves, agudos, volumen) por SSE.
// 2. Golpes reales (onsets en los graves) y detección de drops:
//    la energía sube de golpe después de un valle.
// 3. Transiciones entre escenarios al ritmo: fundido cruzado, zoom
//    por el centro, barrido diagonal o apertura circular.
// 4. En cada drop: cambio de escenario, destello y un "golpe" de cámara.
// Sin permiso de audio, los momentos salen de los coros de la letra.
// ============================================================

const AUD = window.AUD = { live: false, level: 0, low: 0, pulse: 0, hit: false, status: 'conectando', lastMsg: 0 };
{
  let fast = 0, slow = 0, lowAvg = 0, lowVar = 0, lastHit = 0, peak = .02;
  const es = new EventSource('/audio');
  es.onmessage = ev => {
    const d = JSON.parse(ev.data), now = performance.now();
    if (d.inst) { if (typeof INST !== 'undefined') INST.feed(d.inst); return; }   // instrumentos reconocidos (instruments.js)
    AUD.lastMsg = now; AUD.live = true; AUD.status = 'sonido real';
    peak = Math.max(peak * .9995, d.rms, .02);                       // normaliza al volumen de la canción
    const lvl = clamp(d.rms / peak), low = clamp(d.low / peak);
    AUD.level = lerp(AUD.level, lvl, .35);
    // golpe: los graves saltan claramente sobre su promedio reciente
    const flux = low - lowAvg;
    lowAvg = lerp(lowAvg, low, .08); lowVar = lerp(lowVar, flux * flux, .08);
    if (flux > Math.sqrt(lowVar) * 1.6 + .04 && now - lastHit > 230) { AUD.hit = true; AUD.pulse = 1; lastHit = now; window.onOnset?.(); }
    // envolventes para el drop: corta (~0,4 s) y larga (~10 s)
    fast = lerp(fast, lvl, .09); slow = lerp(slow, lvl, .004);
    DROP.feed(fast, slow, now);
  };
  es.addEventListener('status', ev => {
    const d = JSON.parse(ev.data);
    if (performance.now() - AUD.lastMsg > 3000) { AUD.live = false; AUD.status = d.error === 'permiso' ? 'sin permiso de audio' : d.running ? 'esperando sonido' : 'tempo estimado'; }
  });
  setInterval(() => { AUD.pulse *= .82; if (performance.now() - AUD.lastMsg > 3000) AUD.live = false; }, 16);
}

// ---------- drops ----------
const DROP = {
  valley: 1, lastDrop: -1e9, hist: [],
  feed(fast, slow, now) {
    this.hist.push([now, fast]); while (this.hist.length && now - this.hist[0][0] > 4000) this.hist.shift();
    const valley = Math.min(...this.hist.map(h => h[1]));
    // sube fuerte, venía de un valle y hace rato que no hubo otro
    if (fast > slow * 1.45 && valley < slow * .8 && fast > .35 && now - this.lastDrop > 12000) { this.lastDrop = now; moment('drop'); }
  },
};

// sin sonido real: los momentos llegan al empezar cada coro de la letra
let lastChorusKey = '';
function chorusMomentCheck(sec) {
  if (AUD.live || !IN.synced || !IN.cuts.length) return;
  const key = ext.key() + ':' + sec;
  if (key === lastChorusKey) return;
  lastChorusKey = key;
  const norm = t => t.toLowerCase().replace(/[^\p{L}\p{N} ]/gu, '').trim(), count = {};
  for (const l of IN.lines) if (l.text) count[norm(l.text)] = (count[norm(l.text)] || 0) + 1;
  const a = IN.cuts[sec], b = IN.cuts[sec + 1] ?? Infinity, ls = IN.lines.filter(l => l.text && l.t >= a && l.t < b);
  if (ls.length >= 2 && ls.filter(l => count[norm(l.text)] >= 2).length / ls.length >= .5 && sec > 0) moment('coro');
}

// ---------- el momento: cambio de escenario, destello, golpe de cámara ----------
const MOM = { flash: 0, punch: 0, pending: false };
function moment(kind) {
  if (mode !== 'proc') return;
  MOM.flash = kind === 'drop' ? .55 : .3; MOM.punch = kind === 'drop' ? 1 : .6; MOM.pending = true;
}

// ---------- transiciones al ritmo ----------
const TRANS = window.TRANS = { snap: document.createElement('canvas'), active: false, t0: 0, dur: 1, kind: 'fade', lastKey: '' };
const KINDS = ['fade', 'zoom', 'wipe', 'iris'];
function genKeyAt(time) {
  const useCuts = IN.cuts.length > 1;
  const sec = useCuts ? Math.max(0, IN.cuts.findLastIndex(c => c <= time)) : Math.floor(time / proc.secLen);
  const gi = IN.blockGen?.[sec] ?? proc.order[sec % proc.order.length];
  return { sec, key: ext.key() + ':' + sec + ':' + gi };
}
function snapshot() {
  const s = TRANS.snap;
  if (s.width !== cv.width || s.height !== cv.height) { s.width = cv.width; s.height = cv.height; }
  s.getContext('2d').drawImage(cv, 0, 0);
}
function startTransition(kind) {
  snapshot();
  const beat = IN.period || .5;
  Object.assign(TRANS, { active: true, t0: performance.now(), dur: clamp(beat * 2, .6, 1.4) * 1000, kind });
}
function drawTransition() {
  if (!TRANS.active) return;
  const p = clamp((performance.now() - TRANS.t0) / TRANS.dur);
  if (p >= 1) { TRANS.active = false; return; }
  const e = ease(p), s = TRANS.snap;
  x.save(); x.setTransform(1, 0, 0, 1, 0, 0);
  const w = cv.width, h = cv.height;
  if (TRANS.kind === 'fade') { x.globalAlpha = 1 - e; x.drawImage(s, 0, 0); }
  else if (TRANS.kind === 'zoom') {
    const k = 1 + e * .7; x.globalAlpha = 1 - e;
    x.drawImage(s, w / 2 - w * k / 2, h / 2 - h * k / 2, w * k, h * k);
  } else if (TRANS.kind === 'wipe') {
    const edge = e * (w + h);
    x.beginPath(); x.moveTo(edge, 0); x.lineTo(w + h, 0); x.lineTo(w + h, h); x.lineTo(edge - h, h); x.closePath(); x.clip();
    x.drawImage(s, 0, 0);
  } else {
    const r = e * Math.hypot(w, h) * .6;
    x.beginPath(); x.rect(0, 0, w, h); x.arc(w / 2, h * .45, r, 0, TAU, true); x.clip('evenodd');
    x.drawImage(s, 0, 0);
  }
  x.restore();
}

// ---------- dentro del cuadro procedural ----------
const _procFrameM = procFrame;
procFrame = function (t, dt) {
  const time = ext.active() ? ext.now() : T;
  const g = genKeyAt(time);
  // si hubo un drop, el bloque cambia de escenario en este mismo instante
  if (MOM.pending) {
    MOM.pending = false;
    if (IN.blockGen && IN.blockGen[g.sec] !== undefined) {
      const cur = IN.blockGen[g.sec], opts = proc.order.filter(i => i !== cur);
      IN.blockGen[g.sec] = opts[(g.sec * 7 + (IN.beatCount || 0)) % opts.length];
      startTransition('zoom'); TRANS.lastKey = genKeyAt(time).key;
    }
  }
  if (g.key !== TRANS.lastKey) {
    if (TRANS.lastKey) startTransition(KINDS[g.sec % KINDS.length]);
    TRANS.lastKey = g.key; chorusMomentCheck(g.sec);
  }
  // golpe de cámara: el cuadro entra un poco más grande y se asienta
  MOM.punch = 0;                                           // el empujón ahora lo da la cámara de depth.js, por capas
  _procFrameM(t, dt);
  drawTransition();
  if (MOM.flash > .01) { x.fillStyle = `rgba(255,250,240,${MOM.flash})`; x.fillRect(0, 0, W, H); MOM.flash *= .86; }
};

// el estado del audio se ve en el panel
const _uiM = ui;
ui = function () {
  _uiM();
  if (ext.has() && (mode === 'proc' || !isTaxi(ext.st.name, ext.st.artist))) $('nowSub').textContent += ' · ' + AUD.status;
};
