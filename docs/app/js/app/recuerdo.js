// recuerdo: diez segundos de la canción procesada, con su universo y su semilla, en un clic.
// reutiliza el compositor de clips (letra, título) y le suma el audio de la mesa de sonido y una etiqueta con la semilla.
(() => {
  const E = window.LMAUDIO, U = window.RISO?.world; if (!E || !U || typeof REC === 'undefined') return;
  const SECONDS = 10; let busy = false;
  const slug = s => String(s || '').toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
  function label(w, h, seed, biome) {              // etiqueta riso en la esquina: papel crema, tinta azul, texto mono
    const u = Math.min(w, h * 1.2) / 900, x = 28 * u, bw = Math.min(w - 56 * u, 560 * u), bh = 74 * u, y = h - bh - 26 * u;
    rc.save(); rc.fillStyle = 'rgba(33,43,128,.35)'; rc.fillRect(x + 6 * u, y + 6 * u, bw, bh); rc.fillStyle = '#faf3e4'; rc.fillRect(x, y, bw, bh);
    rc.strokeStyle = '#212b80'; rc.lineWidth = 4 * u; rc.strokeRect(x, y, bw, bh);
    rc.fillStyle = '#f66f24'; rc.fillRect(x, y, 14 * u, bh); rc.fillStyle = '#212b80'; rc.textBaseline = 'alphabetic';
    rc.font = `800 ${30 * u}px Anybody, sans-serif`; rc.fillText('LUMORA', x + 30 * u, y + 34 * u);
    rc.font = `600 ${15 * u}px "Martian Mono", monospace`; rc.fillText(`UNIVERSO ${biome.toUpperCase()} · SEMILLA ${seed.slice(0, 12).toUpperCase()}`, x + 30 * u, y + 58 * u); rc.restore();
  }
  async function capture() {
    if (busy || REC.on) return;
    const m = recMime(); if (!m) return setTag('este navegador no puede grabar video');
    busy = REC.busy = true;
    const w = U.settings(), prof = U.profile(w.biome === 'auto' ? (window.RISOCLIP?.shot?.narrative?.place || 'costa') : w.biome), seed = w.seed, title = ext.st.name;
    const badge = $('recBadge');
    let stream, dest, master, rec, timer, frame, withAudio = false, cancelled = false;
    const stop = () => { try { if (rec && rec.state !== 'inactive') rec.stop(); } catch (e) {} };
    const cancel = () => { cancelled = true; stop(); };
    try {
      if (recFormat() === 'horizontal') { REC.canvas.width = 1920; REC.canvas.height = 1080; } else { REC.canvas.width = 720; REC.canvas.height = 1280; }
      stream = REC.canvas.captureStream(30);
      if (E.graph && E.kind !== 'none') {
        await E.ctx.resume();
        dest = E.ctx.createMediaStreamDestination(); master = E.graph.master;
        master.connect(dest); stream.addTrack(dest.stream.getAudioTracks()[0]); withAudio = true;
      }
      rec = new MediaRecorder(stream, { mimeType: m[0], videoBitsPerSecond: recFormat() === 'horizontal' ? 12_000_000 : 8_000_000, audioBitsPerSecond: 192_000 });
      const chunks = [], t0 = performance.now();
      rec.ondataavailable = e => e.data.size && chunks.push(e.data);
      const done = new Promise((resolve, reject) => { rec.onstop = resolve; rec.onerror = e => reject(e.error || Error('falló la grabación')); });
      addEventListener('pagehide', cancel, { once: true });
      badge.classList.add('on'); rec.start(250);
      timer = setTimeout(stop, SECONDS * 1000);
      (function loop() {
        if (rec.state !== 'recording') return;
        try { composeFrame(); label(REC.canvas.width, REC.canvas.height, seed, prof.biome); }
        catch (e) { cancelled = true; stop(); return; }
        badge.textContent = 'recuerdo ' + Math.max(0, Math.ceil(SECONDS - (performance.now() - t0) / 1000)) + ' s';
        frame = requestAnimationFrame(loop);
      })();
      await done;
      if (cancelled) return setTag('recuerdo cancelado');
      let blob = new Blob(chunks, { type: m[0].split(';')[0] }), extension = m[1];
      if (!blob.size) throw Error('la grabación quedó vacía');
      if (extension !== 'mp4' && !window.WEB) {
        badge.textContent = 'convirtiendo a mp4…';
        const r = await fetch('/convert', { method: 'POST', body: blob });
        if (!r.ok) throw Error((await r.json()).error || 'no se pudo convertir a mp4');
        if (!r.headers.get('Content-Type')?.startsWith('video/mp4')) throw Error('la conversión no devolvió un video mp4');
        blob = await r.blob(); extension = 'mp4';
      }
      const a = document.createElement('a'); a.href = URL.createObjectURL(blob); a.download = `lumora-${slug(title) || 'recuerdo'}-${slug(seed).slice(0, 10)}.${extension}`; a.click(); setTimeout(() => URL.revokeObjectURL(a.href), 5000);
      try { await navigator.clipboard.writeText(`universo ${prof.biome} · semilla ${seed} · lumora`); } catch (e) {}
      setTag(`recuerdo guardado en ${extension} ${withAudio ? 'con el audio procesado' : 'sin audio'} · semilla copiada`);
    } catch (e) {
      setTag('no se pudo guardar el recuerdo: ' + e.message);
    } finally {
      clearTimeout(timer); cancelAnimationFrame(frame); removeEventListener('pagehide', cancel);
      stop();
      if (dest && master) { try { master.disconnect(dest); } catch (e) {} }
      stream?.getTracks().forEach(t => t.stop());
      dest?.stream.getTracks().forEach(t => t.stop());
      badge.classList.remove('on'); busy = REC.busy = false;
      window.dispatchEvent(new CustomEvent('lumora:recuerdo'));
    }
  }
  window.LMRECUERDO = { capture, seconds: SECONDS };
  const btn = document.createElement('button'); btn.id = 'hudRecuerdo'; btn.title = `recuerdo de ${SECONDS} segundos con su universo y su semilla`; btn.setAttribute('aria-label', 'guardar un recuerdo de diez segundos');
  btn.innerHTML = '<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="13.5" r="7.5" fill="none" stroke="currentColor" stroke-width="1.8"/><path d="M9.5 3h5M12 13.5V9.5M12 13.5l3 2" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/></svg>';
  btn.dataset.label = 'recuerdo de ' + SECONDS + ' s'; btn.addEventListener('click', () => { document.getElementById('hudMore')?.setAttribute('hidden', ''); document.getElementById('hudMoreBtn')?.setAttribute('aria-expanded', 'false'); capture(); }); (document.getElementById('hudMore') || document.getElementById('hudTools'))?.appendChild(btn);
  const foot = document.querySelector('#experience .xp-foot');
  if (foot) { const b = document.createElement('button'); b.className = 'xp-btn primary'; b.textContent = `recuerdo de ${SECONDS} s ↗`; b.style.marginLeft = 'auto'; b.addEventListener('click', () => { document.getElementById('experience').close(); capture(); }); foot.insertBefore(b, foot.firstChild); }
})();
