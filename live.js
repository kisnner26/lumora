// ============================================================
// live.js — puente con la app Música, arranque automático,
// experiencia procedural para cualquier canción y la interfaz.
// El video de Taxi Cab (index.html) no se toca: solo se le da reloj.
// ============================================================

const fmtT = s => { s = Math.max(0, s || 0); return Math.floor(s / 60) + ':' + String(Math.floor(s % 60)).padStart(2, '0'); };
const isTaxi = (name, artist) => /taxi\s*cab/i.test(name || '') && (!artist || /twenty\s*one\s*pilots/i.test(artist));

// ---------- puente con Música ----------
const ext = (() => {
  const st = { bridge: false, state: 'off', pos: 0, at: 0, name: '', artist: '', album: '', dur: 0, art: 0, error: '' };
  const hasServer = location.protocol.startsWith('http');
  let key = '', artUrl = '';

  async function poll() {
    if (!hasServer) return;
    try {
      const t0 = performance.now();
      const r = await fetch('/now', { cache: 'no-store' });
      if (!r.ok) throw new Error(r.status);
      const j = await r.json();
      const lat = (performance.now() - t0) / 2000;
      const playing = j.state === 'playing';
      const age = Math.max(0, (j.server || 0) - (j.at || 0));
      const pos = (j.pos || 0) + (playing ? age + lat : 0);
      const cur = st.at ? st.pos + (st.state === 'playing' ? (performance.now() - st.at) / 1000 : 0) : pos;
      st.pos = Math.abs(cur - pos) > .3 || !playing ? pos : lerp(cur, pos, .25);
      st.at = performance.now();
      const prevState = st.state, prevKey = key;
      Object.assign(st, { bridge: true, src: j.src || 'music', state: j.state, name: j.name || '', artist: j.artist || '', album: j.album || '', dur: j.dur || 0, error: j.error || '' });
      key = st.state === 'off' || st.state === 'stopped' ? '' : st.src + '|' + st.name + '|' + st.artist;
      if (j.art !== st.art) { st.art = j.art; artUrl = j.art ? '/art?' + j.art : ''; onArt(artUrl); }
      if (ext.active()) paused = st.state === 'paused';
      react(prevState, prevKey);
    } catch (e) { st.bridge = false; }
    ui();
  }
  setInterval(poll, 400); poll();

  return {
    st, get artUrl() { return artUrl; },
    has: () => st.bridge && (st.state === 'playing' || st.state === 'paused'),
    // Música manda el reloj cuando la canción que suena es la que se está mostrando
    active: () => ext.has() && (mode === 'proc' ? true : isTaxi(st.name, st.artist)),
    now: () => st.pos + (st.state === 'playing' ? (performance.now() - st.at) / 1000 : 0),
    dur: () => st.dur,
    key: () => key,
    cmd: c => fetch('/cmd?c=' + encodeURIComponent(c), { method: 'POST' }).then(poll).catch(() => {}),
  };

  // ---------- arranque automático: dale play y empieza ----------
  function react(prevState, prevKey) {
    if (!st.bridge) return;
    const started = st.state === 'playing' && (prevState !== 'playing' || key !== prevKey);
    const changed = key !== prevKey;
    if ((st.state === 'stopped' || st.state === 'off') && prevState !== st.state && mode === 'proc') return openPanel();
    if (!started) return;
    if (mode === 'sync') return;                       // no interrumpir mientras marcas líneas
    if (!changed && mode !== 'panel') return;           // reanudar la misma canción: seguir donde iba
    if (isTaxi(st.name, st.artist)) startTaxiAuto();
    else startProc();
  }
})();

window.ext = ext;

function lyricsState() {
  const lines = parse(src.value), stored = load('tc_times');
  return { n: lines.length, synced: !!(stored && stored.n === lines.length && lines.length) };
}
function say(t) { $('msg').textContent = t || ''; }
function startTaxiAuto() {
  const ls = lyricsState();
  if (!ls.n) { openPanel(); say('suena taxi cab, pero falta la letra: pégala y dale play otra vez'); src.focus(); return; }
  if (ls.synced) { say(''); start(); return; }
  if (ext.now() > 4) { openPanel(); say('la letra aún no está sincronizada: pon taxi cab desde el inicio y marca cada línea con espacio'); ext.cmd('start'); return; }
  say(''); startSync();
}

// ---------- interfaz ----------
let artImg = null;
function onArt(url) {
  $('hudArt').style.display = url ? 'block' : 'none';
  if (url) { $('hudArt').src = url; }
  if (!url) { artImg = null; return; }
  const img = new Image();
  img.onload = () => { artImg = img; if (mode === 'proc') proc.palette = paletteFrom(img, proc.seed); };
  img.src = url;
}
function ui() {
  const s = ext.st, now = $('now'), ls = lyricsState();
  now.className = 'now' + (s.state === 'playing' ? ' live' : s.state === 'paused' ? ' paused' : '');
  let title, sub;
  if (!location.protocol.startsWith('http')) { title = 'abierto como archivo'; sub = 'usa http://127.0.0.1:8888/index.html para enlazar con Música'; }
  else if (!s.bridge) { title = 'puente apagado'; sub = 'ejecuta python3 bridge.py en esta carpeta'; }
  else if (s.error && s.state === 'off') { title = 'sin permiso para leer Música'; sub = 'acepta el aviso de macOS o revisa Privacidad > Automatización'; }
  else if (s.state === 'off') { title = 'nada sonando'; sub = 'abre Música o Spotify y reproduce una canción'; }
  else if (s.state === 'stopped') { title = 'Música en pausa larga'; sub = 'dale play a cualquier canción'; }
  else { title = s.name; sub = (s.src === 'spotify' ? 'Spotify · ' : 'Música · ') + s.artist + (s.album ? ' · ' + s.album : '') + (isTaxi(s.name, s.artist) ? '' : ' · experiencia visual'); }
  $('nowTitle').textContent = title; $('nowSub').textContent = sub;
  const pos = ext.has() ? ext.now() : 0;
  $('nowTime').textContent = ext.has() ? fmtT(pos) + ' / ' + fmtT(s.dur) : '';
  $('nowFill').style.width = ext.has() && s.dur ? (pos / s.dur * 100) + '%' : '0';
  const chip = $('lyrState');
  chip.textContent = !ls.n ? 'vacía' : ls.n + ' líneas' + (ls.synced ? ' · sincronizada' : ' · sin sincronizar');
  chip.className = 'chip' + (ls.synced ? ' ok' : '');
  $('hudTitle').textContent = mode === 'proc' ? proc.title : ext.has() ? s.name : 'taxi cab';
  $('hudSub').textContent = (mode === 'proc' ? proc.artist : ext.has() ? s.artist : 'twenty one pilots') + (ext.has() ? '  ' + fmtT(pos) + ' / ' + fmtT(s.dur) : '');
}
src.addEventListener('input', () => { save('tc_lyrics', src.value); ui(); });

// capa de información y cursor: aparecen al mover el ratón
let idleT = 0;
function wake() {
  document.body.classList.remove('idle');
  $('hud').classList.toggle('show', mode !== 'panel');
  clearTimeout(idleT);
  idleT = setTimeout(() => { if (mode !== 'panel') { document.body.classList.add('idle'); $('hud').classList.remove('show'); } }, 2500);
}
addEventListener('mousemove', wake); addEventListener('keydown', wake);

const _openPanel = openPanel;
openPanel = function () { _openPanel(); document.body.classList.remove('idle'); $('hud').classList.remove('show'); ui(); };
const _start = start;
start = function () { say(''); _start(); wake(); };
$('play').onclick = start;

// ============================================================
// experiencia procedural: cualquier canción, su propio viaje
// ============================================================
const hashStr = s => { let h = 2166136261; for (const c of s) { h ^= c.codePointAt(0); h = Math.imul(h, 16777619); } return h >>> 0; };
const mulberry = a => () => { a |= 0; a = a + 0x6D2B79F5 | 0; let t = Math.imul(a ^ a >>> 15, 1 | a); t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296; };

const proc = { seed: 1, palette: null, bpm: 100, secLen: 9, order: [], params: {}, title: '', artist: '', lastSec: -1, t0: 0, dur: 0 };

function seededPalette(seed) {
  const r = mulberry(seed), h = r() * 360, spread = 25 + r() * 70;
  return [0, 1, 2].map(i => ({ h: (h + i * spread) % 360, s: 55 + r() * 30, l: 55 + r() * 15 }));
}
function paletteFrom(img, seed) {
  try {
    const c = document.createElement('canvas'); c.width = c.height = 32;
    const g = c.getContext('2d'); g.drawImage(img, 0, 0, 32, 32);
    const d = g.getImageData(0, 0, 32, 32).data, bins = Array.from({ length: 12 }, () => ({ w: 0, s: 0, l: 0 }));
    for (let i = 0; i < d.length; i += 4) {
      const r = d[i] / 255, gg = d[i + 1] / 255, b = d[i + 2] / 255, mx = Math.max(r, gg, b), mn = Math.min(r, gg, b), l = (mx + mn) / 2, dd = mx - mn;
      if (dd < .08 || l < .08 || l > .95) continue;
      const s = dd / (1 - Math.abs(2 * l - 1));
      let h = mx === r ? ((gg - b) / dd) % 6 : mx === gg ? (b - r) / dd + 2 : (r - gg) / dd + 4; h = (h * 60 + 360) % 360;
      const bin = bins[Math.floor(h / 30)], w = s * (1 - Math.abs(l - .5));
      bin.w += w; bin.s += s * w; bin.l += l * w; bin.h = (bin.h || 0) + h * w;
    }
    const top = bins.map((b, i) => ({ ...b, i })).filter(b => b.w > 0).sort((a, b) => b.w - a.w).slice(0, 3);
    if (top.length < 2) return seededPalette(seed);
    while (top.length < 3) top.push({ ...top[0], h: top[0].h + top[0].w * 40 });
    return top.map(b => ({ h: (b.h / b.w) % 360, s: clamp(b.s / b.w * 100, 45, 90), l: clamp(b.l / b.w * 100, 50, 70) }));
  } catch (e) { return seededPalette(seed); }
}
const PAL0 = [{ h: 30, s: 70, l: 60 }, { h: 200, s: 60, l: 60 }, { h: 320, s: 60, l: 62 }];
const C = (i, a = 1, dl = 0) => { const p = (proc.palette || PAL0)[i % 3]; return `hsla(${p.h},${p.s}%,${clamp(p.l + dl, 0, 100)}%,${a})`; };
const CA = (i, dl = 0) => { const p = (proc.palette || PAL0)[i % 3]; return `hsla(${p.h},${p.s}%,${clamp(p.l + dl, 0, 100)}%,A)`; };
const darkBg = () => { const pl = proc.palette || PAL0; bg(`hsl(${pl[0].h},35%,4%)`, `hsl(${pl[2].h},30%,8%)`); };

// cada generador: nombre, crear parámetros y dibujar
const GENS = [
  { name: 'deriva', make: r => ({ n: 420, speed: .6 + r() * 1.2, pts: pts(420, () => [rnd() * 2 - 1, rnd() * 2 - 1, rnd()]) }),
    draw(p, t, dt, R, E) {
      darkBg(); const cx = W / 2, cy = H / 2, f = S() * .5;
      for (const q of R.pts) {
        const oz = q[2]; q[2] -= dt * R.speed * (.25 + E * 1.2); if (q[2] < .02) { q[0] = rnd() * 2 - 1; q[1] = rnd() * 2 - 1; q[2] = 1; }
        const px = cx + q[0] / q[2] * f, py = cy + q[1] / q[2] * f, ox = cx + q[0] / oz * f, oy = cy + q[1] / oz * f;
        x.strokeStyle = C(Math.floor(q[0] * 10 + 10), clamp(1.2 - q[2]), 15); x.lineWidth = (1 - q[2]) * 2.5;
        x.beginPath(); x.moveTo(ox, oy); x.lineTo(px, py); x.stroke();
      }
      glow(cx, cy, S() * .25, CA(1, 20), .15 + E * .2);
    } },
  { name: 'corriente', make: r => ({ f: .002 + r() * .004, tw: r() * 3, pts: pts(900, () => [rnd(), rnd(), Math.floor(rnd() * 3)]), fresh: true }),
    draw(p, t, dt, R, E) {
      if (R.fresh) { darkBg(); R.fresh = false; }
      const p0 = (proc.palette || PAL0)[0]; x.fillStyle = `hsla(${p0.h},35%,4%,.07)`; x.fillRect(0, 0, W, H);
      x.lineWidth = 1.2;
      for (const q of R.pts) {
        const px = q[0] * W, py = q[1] * H;
        const a = Math.sin(px * R.f + t * .3 + R.tw) * 2 + Math.cos(py * R.f * 1.3 - t * .2) * 2;
        const sp = (1 + E * 2.5) * 1.6;
        q[0] += Math.cos(a) * sp / W; q[1] += Math.sin(a) * sp / H;
        if (q[0] < 0 || q[0] > 1 || q[1] < 0 || q[1] > 1) { q[0] = rnd(); q[1] = rnd(); }
        x.strokeStyle = C(q[2], .55, 10); x.beginPath(); x.moveTo(px, py); x.lineTo(q[0] * W, q[1] * H); x.stroke();
      }
    } },
  { name: 'órbitas', make: r => ({ n: 3 + Math.floor(r() * 4), tilt: .3 + r() * .4, ring: Math.floor(r() * 4), ph: r() * TAU }),
    draw(p, t, dt, R, E) {
      darkBg(); drawStars(t, .6); const cx = W / 2, cy = H * .47;
      glow(cx, cy, S() * (.18 + E * .06), CA(0, 15), .8); x.fillStyle = C(0, 1, 30); x.beginPath(); x.arc(cx, cy, S() * .03, 0, TAU); x.fill();
      for (let i = 0; i < R.n; i++) {
        const rr = S() * (.1 + i * .075), sp = .9 / (i + 1), a = t * sp + R.ph + i * 2.1;
        x.strokeStyle = 'rgba(243,236,223,.1)'; x.lineWidth = 1; x.beginPath(); x.ellipse(cx, cy, rr, rr * R.tilt, 0, 0, TAU); x.stroke();
        for (let k = 0; k < 24; k++) { const b = a - k * .03; x.fillStyle = C(i, (1 - k / 24) * .4); x.fillRect(cx + Math.cos(b) * rr, cy + Math.sin(b) * rr * R.tilt, 2, 2); }
        const px = cx + Math.cos(a) * rr, py = cy + Math.sin(a) * rr * R.tilt, pr = 3 + (i % 3) * 3;
        glow(px, py, pr * 5, CA(i, 10), .5); x.fillStyle = C(i, 1, 10); x.beginPath(); x.arc(px, py, pr, 0, TAU); x.fill();
        if (i === R.ring) { x.strokeStyle = C(i + 1, .7, 20); x.beginPath(); x.ellipse(px, py, pr * 2.4, pr * .8, -.3, 0, TAU); x.stroke(); }
      }
    } },
  { name: 'nebulosa', make: r => ({ drift: r() * TAU, births: pts(12, () => [rnd(), rnd(), rnd()]) }),
    draw(p, t, dt, R, E) {
      darkBg(); drawStars(t, .8); const cx = W / 2 + Math.cos(t * .05 + R.drift) * W * .05, cy = H * .45;
      for (let i = 0; i < 9; i++) { const a = i * 1.9 + t * .04, d = S() * (.12 + (i % 3) * .08);
        glow(cx + Math.cos(a) * d, cy + Math.sin(a * 1.2) * d * .7, S() * (.25 + (i % 4) * .08), CA(i, -5), .16 + E * .08); }
      for (const [u, v, ph] of R.births) { const k = (t * .3 + ph) % 1;
        glow(u * W, v * H, 30 + k * 40, CA(2, 30), Math.sin(k * Math.PI) * (.4 + E * .6)); }
    } },
  { name: 'mandala', make: r => ({ k: 5 + Math.floor(r() * 8), layers: 4 + Math.floor(r() * 4), rot: (r() - .5) * .6 }),
    draw(p, t, dt, R, E) {
      darkBg(); const cx = W / 2, cy = H * .47;
      x.save(); x.translate(cx, cy);
      for (let l = 0; l < R.layers; l++) {
        const rr = S() * (.06 + l * .055) * (1 + E * .15), rot = t * R.rot * (l % 2 ? 1 : -1);
        x.strokeStyle = C(l, .75, 10); x.lineWidth = 1.3; x.beginPath();
        for (let i = 0; i <= R.k * 12; i++) { const a = i / (R.k * 12) * TAU + rot, m = rr * (1 + .25 * Math.sin(a * R.k + t));
          i ? x.lineTo(Math.cos(a) * m, Math.sin(a) * m) : x.moveTo(Math.cos(a) * m, Math.sin(a) * m); }
        x.stroke();
        for (let i = 0; i < R.k; i++) { const a = i / R.k * TAU + rot; x.fillStyle = C(l + 1, .9, 25); x.beginPath(); x.arc(Math.cos(a) * rr * 1.25, Math.sin(a) * rr * 1.25, 2, 0, TAU); x.fill(); }
      }
      x.restore(); glow(cx, cy, S() * .12, CA(1, 25), .5 + E * .4);
    } },
  { name: 'aurora', make: r => ({ bands: 3 + Math.floor(r() * 3), ph: r() * 10 }),
    draw(p, t, dt, R, E) {
      bg('#02030a', '#05070f'); drawStars(t, .9, .7);
      for (let b = 0; b < R.bands; b++) {
        const top = [], bot = [];
        for (let i = 0; i <= 48; i++) {
          const u = i / 48, y0 = H * (.25 + b * .06) + Math.sin(u * 5 + t * .4 + b + R.ph) * H * .08;
          top.push([u * W, y0]); bot.push([u * W, y0 + H * (.18 + .1 * Math.sin(u * 9 + t * .7 + b)) * (1 + E * .4)]);
        }
        const g = x.createLinearGradient(0, H * .15, 0, H * .75); g.addColorStop(0, C(b, 0)); g.addColorStop(.35, C(b, .13)); g.addColorStop(1, C(b, 0));
        x.fillStyle = g; x.beginPath(); top.forEach(([a, c], i) => i ? x.lineTo(a, c) : x.moveTo(a, c));
        for (let i = bot.length - 1; i >= 0; i--) x.lineTo(bot[i][0], bot[i][1]); x.fill();
      }
      x.fillStyle = '#020204'; x.beginPath(); x.moveTo(0, H);
      for (let i = 0; i <= 40; i++) { const u = i / 40; x.lineTo(u * W, H * .82 - Math.sin(u * 7) * 18 - Math.sin(u * 19) * 7); }
      x.lineTo(W, H); x.fill();
    } },
  { name: 'horizonte', make: r => ({ ring: r() < .5, moons: 1 + Math.floor(r() * 3) }),
    draw(p, t, dt, R, E) {
      bg('#02030a', '#060812'); drawStars(t, 1 - p * .5);
      const pr = W * 1.1, pcx = W / 2, pcy = H + pr * .72, sunY = lerp(H * .72, H * .38, ease(p));
      glow(W / 2, sunY, S() * .6, CA(0, 20), .35 + p * .3); x.fillStyle = C(0, 1, 35); x.beginPath(); x.arc(W / 2, sunY, S() * .025, 0, TAU); x.fill();
      const g = x.createRadialGradient(pcx, pcy - pr * .3, pr * .2, pcx, pcy, pr);
      g.addColorStop(0, C(2, 1, -35)); g.addColorStop(1, C(1, 1, -45));
      x.fillStyle = g; x.beginPath(); x.arc(pcx, pcy, pr, 0, TAU); x.fill();
      x.strokeStyle = C(0, .6 + E * .3, 20); x.lineWidth = 3; x.beginPath(); x.arc(pcx, pcy, pr, Math.PI * 1.1, Math.PI * 1.9); x.stroke();
      if (R.ring) { x.strokeStyle = C(1, .35, 10); x.lineWidth = 2; x.beginPath(); x.ellipse(pcx, pcy - pr * .35, pr * 1.5, pr * .12, -.05, Math.PI, TAU); x.stroke(); }
      for (let i = 0; i < R.moons; i++) { const a = t * .08 * (i + 1) + i * 2, mx = W / 2 + Math.cos(a) * W * .4, my = H * (.25 + i * .1);
        x.fillStyle = C(i, .9, 15); x.beginPath(); x.arc(mx, my, 5 + i * 3, 0, TAU); x.fill(); }
    } },
  { name: 'red', make: r => ({ pts: pts(70, () => [rnd() * W, rnd() * H, (rnd() - .5) * 20, (rnd() - .5) * 20]), link: 110 + r() * 80 }),
    draw(p, t, dt, R, E) {
      darkBg();
      for (const q of R.pts) { q[0] += q[2] * dt; q[1] += q[3] * dt; if (q[0] < 0 || q[0] > W) q[2] *= -1; if (q[1] < 0 || q[1] > H) q[3] *= -1; }
      x.lineWidth = 1;
      for (let i = 0; i < R.pts.length; i++) for (let j = i + 1; j < R.pts.length; j++) {
        const a = R.pts[i], b = R.pts[j], d = Math.hypot(a[0] - b[0], a[1] - b[1]);
        if (d < R.link) { x.strokeStyle = C(i + j, (1 - d / R.link) * .5, 15); x.beginPath(); x.moveTo(a[0], a[1]); x.lineTo(b[0], b[1]); x.stroke(); }
      }
      R.pts.forEach((q, i) => { glow(q[0], q[1], 8 + E * 16, CA(i, 20), .6); x.fillStyle = C(i, 1, 30); x.fillRect(q[0] - 1, q[1] - 1, 2, 2); });
    } },
  { name: 'túnel', make: r => ({ sides: [0, 4, 6, 8][Math.floor(r() * 4)], speed: .3 + r() * .5 }),
    draw(p, t, dt, R, E) {
      bg('#010103', '#010103'); const cx = W / 2 + Math.sin(t * .3) * 30, cy = H * .47;
      for (let i = 0; i < 26; i++) {
        const z = ((i / 26) + t * R.speed * .2) % 1, rr = Math.pow(z, 2.2) * Math.max(W, H) * 1.1;
        x.strokeStyle = C(i, z * (.7 + E * .3), 10); x.lineWidth = 1 + z * 3;
        x.beginPath();
        if (!R.sides) x.arc(cx, cy, rr, 0, TAU);
        else for (let k = 0; k <= R.sides; k++) { const a = k / R.sides * TAU + t * .1; k ? x.lineTo(cx + Math.cos(a) * rr, cy + Math.sin(a) * rr) : x.moveTo(cx + Math.cos(a) * rr, cy + Math.sin(a) * rr); }
        x.stroke();
      }
      glow(cx, cy, S() * .1, CA(1, 30), .6);
    } },
];

function startProc() {
  const s = ext.st, fromMusic = ext.has();
  const feat = (s.name || '').match(/\s*[(\[](?:feat\.?|ft\.?|with)\s+([^)\]]+)[)\]]/i);
  proc.title = fromMusic ? s.name.replace(feat ? feat[0] : '', '').trim() : 'sin título';
  proc.artist = fromMusic ? s.artist.split(/,|&| feat/i)[0].trim() + (feat ? ' · con ' + feat[1].trim() : '') : 'modo libre';
  proc.dur = fromMusic ? s.dur : 240;
  window.SESSION = window.CFG?.variation === 'fija' ? '' : String(Math.random());          // cada reproducción, un video distinto
  proc.seed = hashStr(proc.title + '|' + proc.artist + '|' + window.SESSION);
  const r = mulberry(proc.seed);
  proc.palette = artImg && fromMusic ? paletteFrom(artImg, proc.seed) : seededPalette(proc.seed);
  proc.bpm = 72 + Math.floor(r() * 68);
  proc.secLen = 60 / proc.bpm * 16;
  proc.order = GENS.map((g, i) => [r(), i]).sort((a, b) => a[0] - b[0]).map(v => v[1]);
  proc.params = {}; proc.lastSec = -1;
  panel.classList.add('hide'); say('');
  mode = 'proc'; T = 0; paused = false; lyr.innerHTML = ''; nextEl.textContent = ''; tag.style.opacity = 0;
  titleCard(proc.title, proc.artist);
  wake(); ui();
}
function titleCard(title, artist) {
  lyr.innerHTML = '';
  const el = document.createElement('div'); el.className = 'line';
  [...title].forEach((c, i) => { const s = document.createElement('span'); s.className = 'ch'; s.textContent = c === ' ' ? ' ' : c; s.style.animationDelay = (i * .06) + 's'; el.appendChild(s); });
  const sub = document.createElement('span'); sub.className = 'sub'; sub.textContent = artist; el.appendChild(sub);
  lyr.appendChild(el);
  setTimeout(() => { el.classList.add('out'); setTimeout(() => el.remove(), 1000); }, 6500);
}
const ROMAN = ['i', 'ii', 'iii', 'iv', 'v', 'vi', 'vii', 'viii', 'ix', 'x', 'xi', 'xii', 'xiii', 'xiv', 'xv', 'xvi', 'xvii', 'xviii', 'xix', 'xx'];
$('proc').onclick = startProc;
ui();

// ---------- calidad adaptable en escalera ----------
// nivel 0: 1,25x · 1: 1x · 2: 1x al 80% sin efectos pesados · 3: 1x al 65%, 30 fps, sin efectos pesados
const QLADDER = [{ dpr: 1.25, rs: 1, cap: 0, low: false }, { dpr: 1, rs: 1, cap: 0, low: false }, { dpr: 1, rs: .8, cap: 0, low: true }, { dpr: 1, rs: .65, cap: 30, low: true }];
function setQuality(q) { window.DPR_CAP = q.dpr; window.RENDER_SCALE = q.rs; window.FRAME_CAP = q.cap; window.LOWFX = q.low; resize(); }
window.QLEVEL = 1; setQuality(QLADDER[1]);
(() => {
  let last = performance.now(), ema = 16, slow = 0, fast = 0;
  function tick(now) {
    const dt = now - last; last = now;
    if (window.CFG && (CFG.quality !== 'auto' || CFG.rec)) { requestAnimationFrame(tick); return; }
    if (dt < 250 && document.visibilityState === 'visible' && mode !== 'panel') {   // ignorar segundo plano y el panel
      const work = window.FRAME_CAP ? dt / 2 : dt;                                 // con tope de 30 fps el cuadro "normal" dura el doble
      ema = ema * .9 + work * .1;
      if (ema > 20) { slow++; fast = 0; } else if (ema < 12) { fast++; slow = 0; } else { slow = Math.max(0, slow - 1); fast = 0; }
      if (slow > 45 && window.QLEVEL < QLADDER.length - 1) { setQuality(QLADDER[++window.QLEVEL]); slow = 0; ema = 16; }
      if (fast > 600 && window.QLEVEL > 0) { setQuality(QLADDER[--window.QLEVEL]); fast = 0; ema = 16; }
    }
    requestAnimationFrame(tick);
  }
  requestAnimationFrame(tick);
})();
