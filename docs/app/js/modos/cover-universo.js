// carátula: fondo de universo procedural y pestaña de sonido; comparte semilla y ambientes con el videoclip.
(() => {
  const E = window.LMAUDIO, U = window.RISO?.world, cover = document.getElementById('cover'), pane = document.getElementById('cvPaneSonido');
  if (!E || !U || !cover || !pane) return;
  const css = document.createElement('style');
  css.textContent = `.cv-world{position:absolute;inset:0;width:100%;height:100%;opacity:0;transition:opacity .8s;pointer-events:none;object-fit:cover;filter:brightness(.5) saturate(1.35) contrast(1.12)}
#cover[data-style=universo]{background:#07060a}#cover[data-style=universo] .cv-world{opacity:.92}#cover[data-style=universo] .coverbg{opacity:0}
.cv-world-veil{position:absolute;inset:0;pointer-events:none;opacity:0;transition:opacity .8s;background:radial-gradient(ellipse at 50% 55%,transparent 30%,rgba(7,6,10,.65) 100%),linear-gradient(rgba(7,6,10,.25),rgba(7,6,10,.1) 40%,rgba(7,6,10,.55))}
#cover[data-style=universo] .cv-world-veil{opacity:1}
.cv-tiles i.t-universo{background:linear-gradient(180deg,#212b80 0 55%,#f66f24 55% 58%,#60a1c0 58%);}
.cv-tiles i.t-universo::after{content:'';position:absolute;left:18%;bottom:14%;width:64%;height:30%;background:linear-gradient(90deg,#faf3e4 0 18%,transparent 18% 26%,#faf3e4 26% 40%,transparent 40% 52%,#faf3e4 52% 74%,transparent 74% 82%,#faf3e4 82%);opacity:.8;clip-path:polygon(0 100%,0 40%,18% 40%,18% 10%,40% 10%,40% 55%,74% 55%,74% 25%,100% 25%,100% 100%)}
#cvMenu[data-tab=sonido] .cv-pane[data-pane=sonido]{display:block;animation:cvPane .25s cubic-bezier(.2,.8,.2,1)}
.cv-sound h5{margin:14px 0 8px}.cv-sound h5:first-child{margin-top:0}.cv-sound .cv-segs{flex-wrap:wrap;gap:2px}.cv-sound .cv-segs button{flex:1 1 30%;min-height:34px}
.cv-sound label{display:grid;grid-template-columns:96px 1fr;align-items:center;gap:10px;margin:8px 0;font:400 10px 'Martian Mono',monospace;letter-spacing:.06em;text-transform:uppercase;color:var(--faint)}
.cv-sound input[type=range]{width:100%;accent-color:#f4c983}.cv-sound .cv-sound-actions{display:flex;gap:6px;margin-top:10px}.cv-sound .cv-sound-actions button{flex:1;padding:9px 0;border-radius:9px;background:rgba(246,238,226,.08);color:var(--paper);font:400 10px 'Martian Mono',monospace;letter-spacing:.06em;text-transform:uppercase;box-shadow:inset 0 0 0 1px rgba(246,238,226,.12)}
.cv-sound .cv-sound-actions button:hover{background:rgba(246,238,226,.16)}.cv-sound .cv-state{margin:0 0 10px;font:400 10px/1.5 'Martian Mono',monospace;color:var(--faint)}#cvSndErr{color:#ff9a8a}`;
  document.head.appendChild(css);
  const canvas = document.createElement('canvas'), veil = document.createElement('div');
  canvas.className = 'cv-world'; canvas.width = 640; canvas.height = 360; canvas.setAttribute('aria-hidden', 'true'); veil.className = 'cv-world-veil';
  const ref = cover.querySelector('.cv-grain'); cover.insertBefore(canvas, ref); cover.insertBefore(veil, ref);
  const c = canvas.getContext('2d', { willReadFrequently: true });
  const labels = { auto: 'según la historia', ciudad: 'ciudad', bosque: 'bosque', costa: 'costa', desierto: 'desierto', espacio: 'órbita', cuarto: 'interior' };
  const seg = (attr, items) => `<div class="cv-segs">${items.map(([v, t]) => `<button data-${attr}="${v}">${t}</button>`).join('')}</div>`;
  pane.className += ' cv-sound';
  pane.innerHTML = `<p class="cv-state" id="cvSndState"></p><h5>ambiente acústico</h5>${seg('amb', Object.entries(E.presets).map(([k, p]) => [k, p.label]))}
    <label>eco<input type="range" min="0" max="1" step=".01" data-snd="echo" aria-label="eco"></label><label>reverb<input type="range" min="0" max="1" step=".01" data-snd="room" aria-label="reverberación"></label><label>espacio<input type="range" min="0" max="1" step=".01" data-snd="space" aria-label="espacio binaural"></label>
    <h5>universo</h5>${seg('bio', Object.entries(labels))}
    <div class="cv-sound-actions"><button id="cvSndNext">otro universo</button><button id="cvSndHome">el original</button><button id="cvSndSys">audio del mac</button></div><p class="cv-state" id="cvSndErr" role="alert"></p>`;
  const $ = id => document.getElementById(id);
  function sync() {
    const s = E.settings, w = U.settings();
    $('cvSndState').textContent = E.kind === 'none' ? 'sin fuente procesable: conecta el audio del mac para usar eco y espacio' : E.label + (E.monitor ? ' · salida procesada' : ' · solo análisis');
    pane.querySelectorAll('[data-amb]').forEach(b => { const on = b.dataset.amb === s.preset; b.classList.toggle('on', on); b.setAttribute('aria-pressed', String(on)); });
    pane.querySelectorAll('[data-bio]').forEach(b => { const on = b.dataset.bio === w.biome; b.classList.toggle('on', on); b.setAttribute('aria-pressed', String(on)); });
    pane.querySelectorAll('[data-snd]').forEach(i => { if (document.activeElement !== i) i.value = s[i.dataset.snd]; });
    $('cvSndSys').disabled = !!window.WEB || E.kind === 'system';
  }
  pane.addEventListener('click', e => {
    e.stopPropagation(); const b = e.target.closest('button'); if (!b) return;
    if (b.dataset.amb) E.preset(b.dataset.amb);
    else if (b.dataset.bio) U.set({ biome: b.dataset.bio });
    else if (b.id === 'cvSndNext') U.next();
    else if (b.id === 'cvSndHome') U.set({ seed: 'original' });
    else if (b.id === 'cvSndSys') { $('cvSndErr').textContent = ''; E.system().then(sync, err => { $('cvSndErr').textContent = err.message || 'no se pudo conectar el audio'; }); }
    sync();
  });
  pane.addEventListener('input', e => { e.stopPropagation(); const k = e.target.dataset.snd; if (k) { E.update({ [k]: +e.target.value }); sync(); } });
  addEventListener('lumora:sonido', sync); addEventListener('lumora:universo', sync); sync();
  // dibujo: baja resolución y 20 fps; el mundo respira con los graves y late con el golpe
  let last = 0;
  (function loop(now) {
    requestAnimationFrame(loop);
    if (!(typeof coverOpen !== 'undefined' && coverOpen) || cover.dataset.style !== 'universo' || document.hidden || now - last < 50) return;
    last = now;
    try {
      const s = U.settings(), place = window.RISOCLIP?.shot?.narrative?.place || 'costa';
      const profile = U.profile(s.biome === 'auto' ? place : s.biome);
      const K = { ...RISO.K, c, d: 1 };
      c.fillStyle = '#000'; c.fillRect(0, 0, 640, 360); c.save(); c.scale(.4, .4);
      U.draw(K, profile, cvReduced() ? 0 : ext.has() ? ext.now() : now / 1000, { cx: 800, ground: 740, detail: 1 });
      c.restore(); U.decode(c);
    } catch (err) { cover.dataset.style = 'difuminado'; }
  })(0);
})();
