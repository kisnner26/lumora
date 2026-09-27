// ============================================================
// record.js — clip vertical 9:16 para historias o TikTok.
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
function composeFrame() {
  const W9 = 720, H9 = 1280;
  rc.fillStyle = '#000'; rc.fillRect(0, 0, W9, H9);
  // centro de la escena recortado a 9:16
  const sh = cv.height, sw = Math.min(cv.width, sh * 9 / 16), sx = (cv.width - sw) / 2;
  rc.drawImage(cv, sx, 0, sw, sh, 0, 0, W9, H9);
  // la línea que se ve ahora (y su traducción), con la tipografía del artista
  const el = document.querySelector('#lyr .line:not(.out)');
  if (el) {
    const trEl = el.querySelector('.tr'), tr = trEl?.textContent || '';
    const main = [...el.childNodes].filter(n => n !== trEl).map(n => n.textContent).join('').trim();
    const cs = getComputedStyle(el);
    rc.textAlign = 'center'; rc.shadowColor = 'rgba(0,0,0,.85)'; rc.shadowBlur = 18;
    rc.font = `${cs.fontStyle} ${cs.fontWeight} 46px ${cs.fontFamily}`; rc.fillStyle = cs.color;
    const lines = wrap(rc, cs.textTransform === 'uppercase' ? main.toUpperCase() : main, W9 * .84);
    let y = H9 * .72 - (lines.length - 1) * 28;
    for (const l of lines) { rc.fillText(l, W9 / 2, y); y += 56; }
    if (tr) { rc.font = `italic 300 30px "Cormorant Garamond", serif`; rc.fillStyle = '#ffe2b0'; for (const l of wrap(rc, tr, W9 * .84)) { rc.fillText(l, W9 / 2, y + 6); y += 38; } }
    rc.shadowBlur = 0;
  }
  // canción y artista, discreto
  if (ext.has()) {
    rc.textAlign = 'center'; rc.fillStyle = 'rgba(243,236,223,.85)';
    rc.font = 'italic 300 26px "Cormorant Garamond", serif'; rc.fillText(ext.st.name, W9 / 2, H9 - 86);
    rc.font = '400 15px Inter, sans-serif'; rc.fillStyle = 'rgba(243,236,223,.55)';
    rc.fillText((ext.st.artist || '').toUpperCase().split('').join(' '), W9 / 2, H9 - 58);
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
  composeFrame();
  const stream = REC.canvas.captureStream(30);
  REC.rec = new MediaRecorder(stream, { mimeType: m[0], videoBitsPerSecond: 8_000_000 });
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
    const a = document.createElement('a'); a.href = URL.createObjectURL(blob); a.download = `${slug}.mp4`; a.click();
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
