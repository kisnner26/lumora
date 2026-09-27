// ============================================================
// cover.js — modo carátula: la portada como protagonista.
// Estilos de fondo (difuminado, ambiente, vinilo, mínimo), la letra
// en vivo debajo, controles propios y la portada latiendo con el ritmo.
// Se abre con la carátula de la consola o la tecla c; se cierra con esc o c.
// ============================================================
const CV = { style: (() => { try { return localStorage.getItem('lm_cover') || 'difuminado'; } catch (e) { return 'difuminado'; } })(),
             lyrics: (() => { try { return localStorage.getItem('lm_cover_lyr') !== '0'; } catch (e) { return true; } })(), art: '' };
const CV_STYLES = [['difuminado', 'difuminado'], ['ambiente', 'ambiente'], ['vinilo', 'vinilo'], ['minimo', 'mínimo']];

{ const st = document.createElement('style'); st.textContent = `
  #cover { --gold:#f4c983; --paper:#f6eee2; --mute:rgba(246,238,226,.6); --faint:rgba(246,238,226,.34); --rule:rgba(246,238,226,.12); cursor:default; gap:22px; }
  #cover .coverbg { transition:opacity .8s; }
  .cv-amb { position:absolute; inset:0; opacity:0; transition:opacity .8s; overflow:hidden; }
  .cv-amb i { position:absolute; width:70vmax; height:70vmax; border-radius:50%; filter:blur(90px); opacity:.75; mix-blend-mode:screen; }
  .cv-amb i:nth-child(1) { left:-20vmax; top:-25vmax; animation:cvA 22s ease-in-out infinite alternate; }
  .cv-amb i:nth-child(2) { right:-25vmax; top:-10vmax; animation:cvB 26s ease-in-out infinite alternate; }
  .cv-amb i:nth-child(3) { left:10vmax; bottom:-35vmax; animation:cvC 30s ease-in-out infinite alternate; }
  @keyframes cvA { to { transform:translate(22vmax, 18vmax) scale(1.2); } }
  @keyframes cvB { to { transform:translate(-26vmax, 20vmax) scale(.85); } }
  @keyframes cvC { to { transform:translate(18vmax, -24vmax) scale(1.15); } }
  #cover[data-style=ambiente] { background:#07060a; } #cover[data-style=ambiente] .cv-amb { opacity:1; } #cover[data-style=ambiente] .coverbg { opacity:0; }
  #cover[data-style=minimo] { background:#050403; } #cover[data-style=minimo] .coverbg { opacity:0; }
  #cover[data-style=minimo] .cv-art { width:min(40vmin,420px); } #cover[data-style=minimo] #coverImg { border-radius:6px; }
  #cover[data-style=minimo] .covermeta b { font:800 clamp(40px,7vw,96px)/.9 'Anybody',sans-serif; font-variation-settings:'wdth' 62; letter-spacing:-.01em; }
  .cv-art { position:relative; width:min(60vmin,600px); aspect-ratio:1; flex:none; transform:scale(calc(1 + var(--beat, 0) * .012)); transition:transform .12s, translate .9s cubic-bezier(.2,.8,.2,1), width .6s; }
  .cv-art #coverImg { position:absolute !important; inset:0; width:100% !important; height:100%; }
  .cv-vinyl { position:absolute; inset:3%; border-radius:50%; translate:0 0; opacity:0; transition:translate .9s cubic-bezier(.2,.8,.2,1), opacity .5s;
              background:radial-gradient(circle, transparent 0 17%, #0c0c0c 17.5% 18.5%, transparent 19%), repeating-radial-gradient(circle, #141414 0 1px, #0a0a0a 1.5px 3px), #0a0a0a;
              box-shadow:0 30px 90px rgba(0,0,0,.7); }
  .cv-vinyl::after { content:''; position:absolute; inset:33%; border-radius:50%; background:var(--label) center/cover, #222; box-shadow:0 0 0 3px #111; }
  .cv-vinyl::before { content:''; position:absolute; inset:0; border-radius:50%; background:conic-gradient(from 30deg, transparent 0 20%, rgba(255,255,255,.07) 25%, transparent 32% 70%, rgba(255,255,255,.05) 75%, transparent 82%); }
  .cv-vinyl.spin { animation:cvSpin 1.8s linear infinite; }
  @keyframes cvSpin { to { rotate:360deg; } }
  #cover[data-style=vinilo] .cv-vinyl { opacity:1; translate:44% 0; }
  #cover[data-style=vinilo] .cv-art { translate:-20% 0; }
  #cover #coverImg { z-index:1; }
  .cv-lyr { position:relative; text-align:center; max-width:min(86vw,900px); min-height:3.4em; transition:opacity .4s; }
  .cv-lyr b { display:block; font:600 clamp(18px,2.2vw,28px)/1.25 'Anybody',sans-serif; font-variation-settings:'wdth' 104; color:var(--paper); }
  .cv-lyr span { display:block; margin-top:4px; font:italic 300 clamp(14px,1.6vw,19px)/1.3 'Cormorant Garamond',serif; color:#ffe2b0; }
  #cover.nolyr .cv-lyr { opacity:0; }
  .cv-ui { position:absolute; left:50%; bottom:26px; transform:translateX(-50%); width:min(760px, calc(100vw - 32px)); display:grid; grid-template-columns:auto 1fr; gap:10px 18px; align-items:center;
           padding:12px 16px; border-radius:18px; background:rgba(12,10,8,.55); border:1px solid var(--rule); backdrop-filter:blur(18px); opacity:0; transition:opacity .4s; }
  #cover:hover .cv-ui, #cover .cv-ui:focus-within { opacity:1; }
  body.idle #cover .cv-ui { opacity:0; }
  .cv-ui button { font:inherit; color:var(--mute); background:none; border:0; cursor:pointer; padding:0; }
  .cv-ctl { display:flex; align-items:center; gap:4px; }
  .cv-ctl button { width:36px; height:36px; border-radius:50%; display:grid; place-items:center; }
  .cv-ctl button:hover { background:rgba(246,238,226,.08); color:var(--paper); }
  .cv-ctl button.big { width:46px; height:46px; background:linear-gradient(180deg,#fbe2b8,var(--gold)); }
  .cv-ctl button.big svg { fill:#1a1109; }
  .cv-ctl svg { width:19px; height:19px; fill:currentColor; }
  .cv-prog { display:grid; grid-template-columns:40px 1fr 40px; align-items:center; gap:10px; font:400 10.5px 'Martian Mono',monospace; color:var(--faint); }
  .cv-prog span:last-child { text-align:right; }
  .cv-bar { height:16px; cursor:pointer; background:linear-gradient(rgba(246,238,226,.14),rgba(246,238,226,.14)) center/100% 3px no-repeat; }
  .cv-bar i { display:block; height:3px; margin-top:6.5px; width:0; border-radius:2px; background:var(--gold); box-shadow:0 0 10px rgba(255,179,107,.6); }
  .cv-opts { grid-column:1 / -1; display:flex; align-items:center; gap:14px; border-top:1px solid var(--rule); padding-top:10px; flex-wrap:wrap; }
  .cv-opts .lbl { font:400 9.5px 'Martian Mono',monospace; letter-spacing:.16em; text-transform:uppercase; color:var(--faint); }
  .cv-opts .seg { display:flex; gap:12px; }
  .cv-opts .seg button { position:relative; padding:4px 0; font:400 10px 'Martian Mono',monospace; letter-spacing:.08em; text-transform:uppercase; color:var(--faint); }
  .cv-opts .seg button::after { content:''; position:absolute; left:0; right:0; bottom:0; height:2px; background:var(--gold); transform:scaleX(0); transform-origin:left; transition:transform .3s; }
  .cv-opts .seg button.on { color:var(--paper); } .cv-opts .seg button.on::after { transform:none; }
  .cv-opts .sp { flex:1; }
  .cv-pill { padding:6px 11px !important; border-radius:8px; border:1px solid var(--rule) !important; font:400 10px 'Martian Mono',monospace !important; letter-spacing:.1em; text-transform:uppercase; }
  .cv-pill:hover { color:var(--paper) !important; }
  .cv-pill.on { color:var(--gold) !important; border-color:rgba(244,201,131,.4) !important; }
  .cv-close { position:absolute; top:22px; right:24px; padding:8px 14px !important; border-radius:9px; border:1px solid var(--rule) !important; background:rgba(12,10,8,.45) !important; color:var(--mute) !important;
              font:400 10px 'Martian Mono',monospace !important; letter-spacing:.14em; text-transform:uppercase; cursor:pointer; opacity:0; transition:opacity .4s; }
  #cover:hover .cv-close { opacity:1; } body.idle #cover .cv-close { opacity:0; }
  .cv-close:hover { color:var(--paper) !important; }
  #cover .covermeta b { font:italic 300 clamp(28px,4vw,50px)/1.05 'Anybody',sans-serif; font-variation-settings:'wdth' 118; }
  #cover .covermeta span { font:400 10px/2.6 'Martian Mono',monospace; letter-spacing:.22em; }
  @media (max-width:640px) { .cv-ui { grid-template-columns:1fr; } .cv-ctl { justify-content:center; } }
`; document.head.appendChild(st); }

// ---------- estructura ----------
const cvIco = d => `<svg viewBox="0 0 24 24"><path d="${d}"/></svg>`;
{
  const cover = $('cover'), img = $('coverImg');
  const amb = document.createElement('div'); amb.className = 'cv-amb'; amb.innerHTML = '<i></i><i></i><i></i>'; cover.insertBefore(amb, cover.children[1]);
  const art = document.createElement('div'); art.className = 'cv-art'; img.replaceWith(art);
  const vinyl = document.createElement('div'); vinyl.className = 'cv-vinyl'; art.append(vinyl, img);
  const lyr = document.createElement('div'); lyr.className = 'cv-lyr'; lyr.innerHTML = '<b id="cvLine"></b><span id="cvTr"></span>'; cover.appendChild(lyr);
  const ui = document.createElement('div'); ui.className = 'cv-ui';
  ui.innerHTML = `<div class="cv-ctl"><button data-c="prev" title="anterior">${cvIco('M6 5h2v14H6zM20 5v14L9 12z')}</button>
      <button data-c="playpause" class="big" title="reproducir / pausa">${cvIco('M7 5h4v14H7zM13 5h4v14h-4z')}</button>
      <button data-c="next" title="siguiente">${cvIco('M16 5h2v14h-2zM4 5v14l11-7z')}</button></div>
    <div class="cv-prog"><span id="cvT0">0:00</span><div class="cv-bar" id="cvBar"><i id="cvFill"></i></div><span id="cvT1">0:00</span></div>
    <div class="cv-opts"><span class="lbl">fondo</span><div class="seg" id="cvStyles">${CV_STYLES.map(([v, t]) => `<button data-s="${v}">${t}</button>`).join('')}</div>
      <span class="sp"></span><button class="cv-pill" id="cvLyrBtn">letra</button></div>`;
  cover.appendChild(ui);
  const close = document.createElement('button'); close.className = 'cv-close'; close.textContent = 'volver al video'; cover.appendChild(close);
  // los clics dentro de la interfaz no cierran la carátula
  for (const el of [ui, lyr, art]) el.addEventListener('click', e => e.stopPropagation());
  close.addEventListener('click', e => { e.stopPropagation(); toggleCover(false); });
  ui.addEventListener('click', e => {
    const b = e.target.closest('button'); if (!b) return;
    if (b.dataset.c) return ext.cmd(b.dataset.c);
    if (b.dataset.s) { CV.style = b.dataset.s; try { localStorage.setItem('lm_cover', CV.style); } catch (err) {} return cvPaint(); }
    if (b.id === 'cvLyrBtn') { CV.lyrics = !CV.lyrics; try { localStorage.setItem('lm_cover_lyr', CV.lyrics ? '1' : '0'); } catch (err) {} return cvPaint(); }
  });
  $('cvBar').addEventListener('click', e => { const r = $('cvBar').getBoundingClientRect(); ext.cmd('goto:' + (clamp((e.clientX - r.left) / r.width) * (ext.st.dur || 0)).toFixed(2)); });
  // ahora solo se cierra con el botón, esc o c: hacer clic en el fondo ya no la cierra por accidente
  cover.addEventListener('click', e => { if (e.target === cover || e.target.classList.contains('coverbg') || e.target.closest('.cv-amb')) e.stopImmediatePropagation(); }, true);
}

// ---------- estado ----------
function cvPaint() {
  const cover = $('cover');
  cover.dataset.style = CV.style; cover.classList.toggle('nolyr', !CV.lyrics || mode !== 'proc');
  for (const b of $('cvStyles').querySelectorAll('button')) b.classList.toggle('on', b.dataset.s === CV.style);
  $('cvLyrBtn').classList.toggle('on', CV.lyrics);
  // colores del ambiente sacados de la portada
  const url = ext.artUrl || '';
  if (url && url !== CV.art && typeof artImg !== 'undefined' && artImg) {
    CV.art = url;
    const pal = paletteFrom(artImg, 7) || [];
    cover.querySelectorAll('.cv-amb i').forEach((el, i) => { const p = pal[i % pal.length] || { h: 30, s: 60, l: 50 }; el.style.background = `hsl(${p.h} ${Math.max(p.s, 55)}% ${Math.min(Math.max(p.l, 38), 58)}%)`; });
    cover.querySelector('.cv-vinyl').style.setProperty('--label', `url("${url}")`);
  }
}
(function cvLoop() {
  if (coverOpen) {
    const pos = ext.has() ? ext.now() : 0, dur = ext.st.dur || 0, f = s => Math.floor(s / 60) + ':' + String(Math.floor(s % 60)).padStart(2, '0');
    $('cvT0').textContent = f(pos); $('cvT1').textContent = f(dur); $('cvFill').style.width = (dur ? clamp(pos / dur) * 100 : 0) + '%';
    $('cover').querySelector('.cv-ctl .big').innerHTML = cvIco(ext.st.state === 'playing' ? 'M7 5h4v14H7zM13 5h4v14h-4z' : 'M8 5v14l11-7z');
    $('cover').querySelector('.cv-vinyl').classList.toggle('spin', ext.st.state === 'playing');
    $('cover').style.setProperty('--beat', mode === 'proc' ? (IN.beat || 0).toFixed(3) : 0);
    // la letra que suena, con su traducción según el modo elegido
    if (mode === 'proc' && CV.lyrics) {
      const i = IN.shown, main = i >= 0 ? IN.lines[i]?.text || '' : '', tr = i >= 0 ? IN.tr?.[i] || '' : '';
      const a = IN.trMode === 'es' && tr ? tr : main, b = IN.trMode === 'ambas' ? tr : '';
      if ($('cvLine').textContent !== a) { $('cvLine').textContent = a; $('cvTr').textContent = b; }
    }
  }
  requestAnimationFrame(cvLoop);
})();
{ const _toggleCover = toggleCover; toggleCover = function (on) { _toggleCover(on); if (coverOpen) { CV.art = ''; cvPaint(); } }; }
