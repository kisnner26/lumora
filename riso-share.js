// ============================================================
// riso-share.js — compartir y memoria (fase 6).
//   · colección de pósters: cada póster que se arma queda guardado en este navegador (RISOSTORE, «posters»)
//     con sus cuatro tomas; se abre, se vuelve a imprimir en otra variante o se borra
//   · dedicatoria: una línea a mano que se imprime en el póster (el campo está en la ventana del póster)
//   · enlace pequeño: los datos de la lámina (título, artista, palabra, ánimo, dedicatoria) viajan en el
//     fragmento # de la dirección y docs/ver.html los dibuja. El fragmento no se envía a ningún servidor.
// ============================================================
(() => {
  const R = window.RISO, POS = window.RISOPOSTER, ST = window.RISOSTORE; if (!R || !POS || !ST) return;
  const SH = window.RISOSHARE = { base: 'https://kisnner26.github.io/lumora/ver.html', max: 900 };
  const norm = s => String(s || '').replace(/\s+/g, ' ').trim();

  // ---------- guardado ----------
  const artUrl = cv => { try { const c = document.createElement('canvas'); c.width = c.height = 180; c.getContext('2d').drawImage(cv, 0, 0, 180, 180); return c.toDataURL('image/jpeg', .7); } catch (e) { return ''; } };
  const ser = it => ({ id: it.id, key: it.key, name: it.name, artist: it.artist, album: it.album, dur: it.dur, frames: (it.frames || []).map(f => f ? { url: f.url, t: f.t, txt: f.txt, sid: f.sid } : null),
    art: it.artUrl || (it.artCv ? artUrl(it.artCv) : ''), lines: (it.lines || []).slice(0, 80), moods: it.moods || {}, cuts: it.cuts || 0, first: it.first || 0, live: !!it.live, bpm: it.bpm || 0, fin: it.fin, num: it.num || 0, dedic: it.dedic || '', why: it.why });
  // changed = la dedicatoria acaba de cambiar (queda también en la colección «dedicatorias»)
  SH.save = async (it, changed) => {
    if (!it || !it.id) return; it._saved = true;
    try { await ST.set('posters', it.id, ser(it)); if (changed && it.dedic) await ST.add('dedicatorias', { texto: it.dedic, cancion: it.name }); } catch (e) {}
  };
  const imgOf = url => new Promise(ok => { const i = new Image(); i.onload = () => ok(i); i.onerror = () => ok(null); i.src = url; });
  SH.hydrate = async row => {                                   // de la fila guardada al objeto que entiende el póster
    const it = { ...row, _saved: true, artCv: null };
    if (row.art) { const im = await imgOf(row.art); if (im) { const c = document.createElement('canvas'); c.width = c.height = 220; c.getContext('2d').drawImage(im, 0, 0, 220, 220);
      const g = c.getContext('2d'), d = g.getImageData(0, 0, 220, 220), a = d.data; for (let i = 0; i < a.length; i += 4) { const l = (a[i] * .3 + a[i + 1] * .59 + a[i + 2] * .11) / 255, v = Math.max(0, Math.min(255, Math.round((1 - l) * 300 - 20))); a[i] = v; a[i + 1] = 0; a[i + 2] = 0; a[i + 3] = 255; } g.putImageData(d, 0, 0); it.artCv = c; } }
    return it;
  };
  SH.list = async () => (await ST.list('posters')).map(r => ({ ...r }));

  // ---------- enlace ----------
  const b64 = s => btoa(String.fromCharCode(...new TextEncoder().encode(s))).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
  const mood = c => Object.entries(c.moods || {}).sort((a, b) => b[1] - a[1])[0]?.[0] || '';
  SH.data = it => {
    const w = R.poster ? R.poster.topWord(it.lines, (it.name || '').split(/\s+/)[0] || it.name) : { w: '' }, d = new Date(it.fin || Date.now());
    const o = { v: 1, n: norm(it.name).slice(0, 60), a: norm(it.artist).slice(0, 40), w: norm(w.w).slice(0, 24), m: mood(it), d: norm(it.dedic).slice(0, 90), t: d.getFullYear() * 10000 + (d.getMonth() + 1) * 100 + d.getDate(),
      s: Math.round(it.dur || 0), i: ((POS.variant || 0) >> 1) % 6, l: (it.lines || []).length, e: it.cuts || 0, p: norm((it.frames || []).find(f => f && f.txt)?.txt).slice(0, 60) };
    return o;
  };
  SH.base_ = () => norm(window.CFG && CFG.shareBase) || SH.base;
  SH.link = it => { const u = SH.base_() + '#' + b64(JSON.stringify(SH.data(it))); return u.length <= SH.max + SH.base_().length ? u : null; };

  // ---------- colección ----------
  const css = document.createElement('style'); css.textContent = `
    #colWin { position:fixed; inset:0; z-index:30; display:none; background:rgba(33,43,128,.55); padding:24px; overflow:auto; } #colWin.on { display:block; }
    #colWin .col-in { max-width:1100px; margin:0 auto; background:var(--rkp,#f7edd8); border:4px solid var(--rk1,#212b80); box-shadow:10px 10px 0 -1px var(--rk1,#212b80); padding:22px; }
    #colWin h2 { margin:0 0 4px; font:800 34px/1 'Anybody',sans-serif; font-stretch:70%; text-transform:uppercase; color:var(--rk1,#212b80); }
    #colWin .col-sub { font:500 12px 'Martian Mono',monospace; letter-spacing:.08em; text-transform:uppercase; color:var(--rk1,#212b80); opacity:.8; margin-bottom:16px; }
    #colWin .col-grid { display:grid; grid-template-columns:repeat(auto-fill,minmax(210px,1fr)); gap:16px; }
    #colWin .card { border:3px solid var(--rk1,#212b80); background:var(--rkl,#faf3e4); box-shadow:5px 5px 0 -1px var(--rk1,#212b80); display:flex; flex-direction:column; }
    #colWin .card img, #colWin .card i { display:block; width:100%; aspect-ratio:16/9; object-fit:cover; background:repeating-linear-gradient(45deg,#dfe4ee,#dfe4ee 6px,#f4ead4 6px,#f4ead4 12px); border-bottom:3px solid var(--rk1,#212b80); }
    #colWin .card b { padding:8px 10px 0; font:800 18px/1.05 'Anybody',sans-serif; font-stretch:75%; text-transform:uppercase; color:var(--rk1,#212b80); }
    #colWin .card span { padding:2px 10px 6px; font:500 11px 'Martian Mono',monospace; letter-spacing:.06em; text-transform:uppercase; color:var(--rk1,#212b80); opacity:.85; }
    #colWin .card em { padding:0 10px 6px; font:600 16px 'Caveat',cursive; color:var(--rkd,#e0561b); font-style:normal; }
    #colWin .card div { display:flex; gap:6px; padding:0 10px 10px; margin-top:auto; }
    #colWin button { padding:7px 10px; border:3px solid var(--rk1,#212b80); background:var(--rkl,#faf3e4); color:var(--rk1,#212b80); font:700 12px 'Anybody',sans-serif; font-stretch:80%; text-transform:uppercase; letter-spacing:.05em; cursor:pointer; } #colWin button:hover { background:var(--rk2,#f97a2a); }
    #colWin .col-top { display:flex; justify-content:space-between; align-items:flex-start; gap:12px; } #colWin .col-empty { font:600 22px 'Caveat',cursive; color:var(--rk1,#212b80); padding:30px 0; }`;
  document.head.appendChild(css);
  const win = document.createElement('div'); win.id = 'colWin'; win.setAttribute('role', 'dialog'); win.setAttribute('aria-label', 'colección de pósters'); document.body.appendChild(win);
  const esc = s => String(s || '').replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
  const fecha = t => { const d = new Date(t || 0); return d.getFullYear() + '.' + String(d.getMonth() + 1).padStart(2, '0') + '.' + String(d.getDate()).padStart(2, '0'); };
  SH.openGallery = async () => {
    const rows = await SH.list(); win.classList.add('on');
    win.innerHTML = `<div class="col-in"><div class="col-top"><div><h2>colección de pósters</h2><div class="col-sub">${rows.length} guardados en este navegador · caben hasta ${ST.caps.posters}, lo más viejo se borra primero</div></div><button data-a="x">cerrar</button></div>` +
      (rows.length ? `<div class="col-grid">${rows.map(r => { const f = (r.frames || []).find(Boolean); return `<div class="card" data-id="${esc(r.id)}">${f ? `<img alt="" src="${f.url}">` : '<i></i>'}<b>${esc(r.name)}</b><span>${esc(r.artist)} · ${fecha(r.fin)}</span>${r.dedic ? `<em>«${esc(r.dedic)}»</em>` : ''}<div><button data-a="ver">ver</button><button data-a="del">borrar</button></div></div>`; }).join('')}</div>` : '<div class="col-empty">todavía no hay pósters: se guardan solos cuando termina una canción.</div>') + '</div>';
    SH.rows = rows;
  };
  const close = () => { win.classList.remove('on'); win.innerHTML = ''; };
  win.addEventListener('click', async e => {
    if (e.target === win) return close(); const btn = e.target.closest('button'); if (!btn) return; const a = btn.dataset.a, id = btn.closest('.card')?.dataset.id;
    if (a === 'x') return close();
    if (a === 'ver' && id) { const row = SH.rows.find(r => r.id === id); if (!row) return; close(); return POS.openWin(await SH.hydrate(row)); }
    if (a === 'del' && id) { if (btn.dataset.armed !== '1') { btn.dataset.armed = '1'; btn.textContent = '¿seguro?'; setTimeout(() => { btn.dataset.armed = ''; btn.textContent = 'borrar'; }, 3000); return; } await ST.del('posters', id); return SH.openGallery(); }
  });
  addEventListener('keydown', e => { if (e.key === 'Escape' && win.classList.contains('on')) { e.stopImmediatePropagation(); close(); } }, true);

  // ---------- ajustes ----------
  if (window.SETUI) {
    SETUI.addRow('imagen', ['coleccionPosters', 'Colección de pósters', 'btn', { texto: 'abrir', fn: () => SH.openGallery() }, 'los pósters de las canciones que ya terminaron, con su dedicatoria']);
    SETUI.addRow('imagen', ['shareBase', 'Página del enlace para compartir', 'text', { ph: SH.base, max: 120 }, 'el enlace pequeño abre docs/ver.html donde esté publicada; deja vacío para usar la de lumora'], '');
  }
})();
