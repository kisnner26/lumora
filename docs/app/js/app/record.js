// ============================================================
// record.js — clip en 16:9 (horizontal) o 9:16 (historias y TikTok).
// r (o el botón rojo): empezar · r otra vez: terminar. Dura lo que tú decidas (tope: 10 min).
// Siempre se descarga en MP4: si el navegador graba WebM, el puente lo convierte con ffmpeg.
// Compone el centro de la escena + la línea de letra que está en
// pantalla + canción y artista abajo. Sale sin audio: la canción se
// agrega en la app al publicar.
// ============================================================

const REC_MAX = 10 * 60 * 1000;
const REC = { on: false, rec: null, chunks: [], t0: 0, canvas: document.createElement('canvas'), raf: 0 };
REC.canvas.width = 720; REC.canvas.height = 1280;
const rc = REC.canvas.getContext('2d');

function recMime() {
  const opts = [['video/mp4;codecs=avc1', 'mp4'], ['video/mp4', 'mp4'], ['video/webm;codecs=vp9', 'webm'], ['video/webm;codecs=vp8', 'webm'], ['video/webm', 'webm']];
  return opts.find(([m]) => window.MediaRecorder && MediaRecorder.isTypeSupported(m)) || null;
}
function wrap(ctx, text, maxW) {
  const words = text.split(/\s+/), lines = []; let cur = '';
  for (const w of words) { const t = cur ? cur + ' ' + w : w; if (ctx.measureText(t).width > maxW && cur) { lines.push(cur); cur = w; } else cur = t; }
  if (cur) lines.push(cur); return lines;
}
// formato: horizontal 16:9 (1920×1080) o vertical 9:16 (720×1280), según ajustes o el chip junto al botón de grabar
const recFormat = () => (window.CFG && CFG.recFormat) || 'horizontal';
function composeFrame() {
  const hz = recFormat() === 'horizontal', W9 = REC.canvas.width, H9 = REC.canvas.height, u = hz ? 1.25 : 1;   // u: escala del texto
  rc.fillStyle = '#000'; rc.fillRect(0, 0, W9, H9);
  // la escena: completa y recortada a 16:9, o el centro recortado a 9:16
  if (hz) { const sw = cv.width, sh = Math.min(cv.height, sw * 9 / 16), sy = (cv.height - sh) / 2; rc.drawImage(cv, 0, sy, sw, sh, 0, 0, W9, H9); }
  else { const sh = cv.height, sw = Math.min(cv.width, sh * 9 / 16), sx = (cv.width - sw) / 2; rc.drawImage(cv, sx, 0, sw, sh, 0, 0, W9, H9); }
  // la palabra gigante de coros y drops, si está en pantalla
  const kin = document.querySelector('.kin');
  if (kin) {
    const cs = getComputedStyle(kin), op = +cs.opacity || 0;
    if (op > .02) {
      rc.save(); rc.globalAlpha = op; rc.textAlign = 'center'; rc.textBaseline = 'middle'; rc.fillStyle = '#fff'; rc.shadowColor = cs.getPropertyValue('--glow') || 'rgba(255,200,140,.8)'; rc.shadowBlur = 40;
      let fs = (hz ? H9 * .3 : W9 * .22); rc.font = `${cs.fontStyle} ${cs.fontWeight} ${fs}px ${cs.fontFamily}`;
      const txt = kin.textContent, mw = rc.measureText(txt).width; if (mw > W9 * .92) { fs *= W9 * .92 / mw; rc.font = `${cs.fontStyle} ${cs.fontWeight} ${fs}px ${cs.fontFamily}`; }
      rc.fillText(txt, W9 / 2, H9 * .46); rc.restore();
    }
  }
  // la línea que se ve ahora (y su traducción), con la tipografía del artista
  const el = document.querySelector('#lyr .line:not(.out)');
  if (el) {
    // el texto sale de la letra misma (el diseño en pantalla parte las palabras en piezas); se respeta el modo de traducción
    const i = IN.shown, src = mode === 'proc' && i >= 0 ? IN.lines[i]?.text : null, trTxt = mode === 'proc' && i >= 0 ? (IN.tr?.[i] || '') : '';
    const trEl = el.querySelector('.tr');
    let main = src ?? [...el.childNodes].filter(n => n !== trEl).map(n => n.textContent).join('').trim(), tr = src != null ? trTxt : (trEl?.textContent || '');
    if (IN.trMode === 'es' && tr) { main = tr; tr = ''; } else if (IN.trMode === 'orig') tr = '';
    const cs = getComputedStyle(el), dim = document.getElementById('lyr').classList.contains('dim') ? .15 : 1;
    rc.save(); rc.globalAlpha = dim; rc.textAlign = 'center'; rc.textBaseline = 'alphabetic'; rc.shadowColor = 'rgba(0,0,0,.85)'; rc.shadowBlur = 18;
    rc.font = `${cs.fontStyle} ${cs.fontWeight} ${46 * u}px ${cs.fontFamily}`; rc.fillStyle = cs.color;
    const lines = wrap(rc, cs.textTransform === 'uppercase' ? main.toUpperCase() : main, W9 * (hz ? .7 : .84));
    let y = H9 * (hz ? .76 : .72) - (lines.length - 1) * 28 * u;
    for (const l of lines) { rc.fillText(l, W9 / 2, y); y += 56 * u; }
    if (tr) { rc.font = `italic 300 ${30 * u}px "Cormorant Garamond", serif`; rc.fillStyle = '#ffe2b0'; for (const l of wrap(rc, tr, W9 * (hz ? .7 : .84))) { rc.fillText(l, W9 / 2, y + 6); y += 38 * u; } }
    rc.restore();
  }
  // canción y artista, discreto
  if (ext.has()) {
    rc.textAlign = 'center'; rc.fillStyle = 'rgba(243,236,223,.85)';
    rc.font = `italic 300 ${26 * u}px "Cormorant Garamond", serif`; rc.fillText(ext.st.name, W9 / 2, H9 - (hz ? 64 : 86));
    rc.font = `400 ${15 * u}px Inter, sans-serif`; rc.fillStyle = 'rgba(243,236,223,.55)';
    rc.fillText((ext.st.artist || '').toUpperCase().split('').join(' '), W9 / 2, H9 - (hz ? 34 : 58));
  }
}
function recLoop() {
  if (!REC.on) return;
  composeFrame();
  const el = performance.now() - REC.t0;
  $('recBadge').textContent = 'REC ' + fmtT(el / 1000);
  if (el >= REC_MAX) return stopRec();
  REC.raf = requestAnimationFrame(recLoop);
}
function startRec() {
  const m = recMime();
  if (!m) { setTag('este navegador no puede grabar video'); return; }
  if (recFormat() === 'horizontal') { REC.canvas.width = 1920; REC.canvas.height = 1080; } else { REC.canvas.width = 720; REC.canvas.height = 1280; }
  composeFrame();
  const stream = REC.canvas.captureStream(30);
  REC.rec = new MediaRecorder(stream, { mimeType: m[0], videoBitsPerSecond: recFormat() === 'horizontal' ? 14_000_000 : 8_000_000 });
  REC.chunks = []; REC.ext = m[1];
  const slug = ((ext.st.name || 'clip') + '-' + (ext.st.artist || '')).toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '') || 'clip';
  REC.rec.ondataavailable = e => e.data.size && REC.chunks.push(e.data);
  REC.rec.onstop = async () => {
    let blob = new Blob(REC.chunks, { type: m[0].split(';')[0] });
    if (REC.ext !== 'mp4') {                                     // el navegador grabó WebM: el puente lo pasa a MP4
      $('recBadge').textContent = 'convirtiendo a mp4…'; $('recBadge').classList.add('on');
      try {
        const r = await fetch('/convert', { method: 'POST', body: blob });
        if (!r.ok) throw new Error((await r.json()).error || r.status);
        blob = await r.blob();
      } catch (e) { $('recBadge').classList.remove('on'); setTag('no se pudo convertir a mp4: ' + e.message); return; }
      $('recBadge').classList.remove('on');
    }
    const a = document.createElement('a'); a.href = URL.createObjectURL(blob); a.download = `${slug}-${recFormat() === 'horizontal' ? '16x9' : '9x16'}.mp4`; a.click();
    setTimeout(() => URL.revokeObjectURL(a.href), 5000);
  };
  REC.rec.start(250); REC.on = true; REC.t0 = performance.now();
  $('recBadge').classList.add('on'); recLoop();
}
function stopRec() {
  if (!REC.on) return;
  REC.on = false; cancelAnimationFrame(REC.raf);
  $('recBadge').classList.remove('on');
  REC.rec?.state !== 'inactive' && REC.rec.stop();
}
addEventListener('keydown', e => {
  if (!(e.key === 'r' || e.key === 'R') || mode === 'panel' || /TEXTAREA|INPUT/.test(document.activeElement?.tagName || '')) return;
  REC.on ? stopRec() : startRec();
});
$('recBtn')?.addEventListener('click', () => (REC.on ? stopRec() : startRec()));
