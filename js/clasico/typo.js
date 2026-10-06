// ============================================================
// typo.js — la letra como en un lyric video oficial.
// Cada línea recibe una composición (10 tipos) con mezcla de
// tipografías, tamaños y animaciones. Las líneas que se repiten
// (el coro) conservan su diseño. Las cortas buscan impacto; las
// largas, legibilidad.
// ============================================================

// tipografías extra
{ const l = document.createElement('link'); l.rel = 'stylesheet';
  l.href = 'https://fonts.googleapis.com/css2?family=Anton&family=Syne:wght@700;800&family=DM+Serif+Display:ital@0;1&family=Unbounded:wght@300;800&family=Permanent+Marker&display=swap';
  document.head.appendChild(l); }

const FONTS = {
  heavy: "'Anton', 'Bebas Neue', Impact, sans-serif", wide: "'Unbounded', 'Syne', sans-serif", syne: "'Syne', sans-serif",
  serif: "'DM Serif Display', 'Playfair Display', serif", thin: "'Unbounded', Inter, sans-serif", mono: "'Space Mono', monospace",
  hand: "'Permanent Marker', cursive", classic: "'Cormorant Garamond', serif",
};

const typoCss = document.createElement('style');
typoCss.textContent = `
  #lyr { top:0; bottom:0; place-items:end center; padding-bottom:15vh; box-sizing:border-box; }
  #lyr .line.fx { width:min(1100px, calc(100% - 48px)); }
  #lyr .line.fx .w { display:inline-block; }
  /* pila */
  .L-stack { justify-self:start; margin-left:6vw; text-align:left; line-height:.92 !important; width:auto !important; max-width:calc(100vw - 6vw - 40px); }
  .L-stack .row { display:table; }
  .L-stack .big { font-family:${FONTS.heavy}; font-size:clamp(64px,12vw,170px); text-transform:uppercase; letter-spacing:.01em; }
  .L-stack .mid { font-family:${FONTS.serif}; font-style:italic; font-size:clamp(28px,4.5vw,64px); }
  .L-stack .sm  { font-family:${FONTS.wide}; font-weight:300; font-size:clamp(14px,1.8vw,22px); letter-spacing:.3em; text-transform:uppercase; opacity:.85; }
  /* contraste */
  .L-split .a { font-family:${FONTS.serif}; font-style:italic; font-size:.8em; opacity:.9; margin-right:.35em; }
  .L-split .b { font-family:${FONTS.heavy}; text-transform:uppercase; font-size:1.25em; letter-spacing:.02em; }
  /* golpe */
  .L-slam { font-family:${FONTS.heavy} !important; text-transform:uppercase; font-size:clamp(46px,8vw,120px) !important; line-height:1 !important; letter-spacing:.01em; }
  .L-slam .w { opacity:0; animation:slam .42s cubic-bezier(.2,1.4,.3,1) forwards; margin:0 .12em; }
  .L-slam .w.key { color:var(--acc); }
  @keyframes slam { 0% { opacity:0; transform:scale(2.4); } 100% { opacity:1; transform:scale(1); } }
  /* máquina de escribir */
  .L-type { font-family:${FONTS.mono} !important; font-size:clamp(20px,3vw,40px) !important; text-align:left; justify-self:center; }
  .L-type .ch { opacity:0; animation:typeIn 0s steps(1) forwards !important; filter:none !important; transform:none !important; }
  @keyframes typeIn { to { opacity:1; } }
  .L-type::after { content:'▌'; animation:blink .8s steps(1) infinite; color:var(--acc); margin-left:2px; }
  @keyframes blink { 50% { opacity:0; } }
  /* ola */
  .L-wave { font-family:${FONTS.serif} !important; font-style:italic; font-size:clamp(34px,5.6vw,80px) !important; }
  .L-wave .ch { animation:waveIn .9s cubic-bezier(.2,.8,.2,1) forwards !important; }
  @keyframes waveIn { 0% { opacity:0; transform:translateY(calc(var(--wy) * 1px)) rotate(calc(var(--wr) * 1deg)); } 100% { opacity:1; transform:none; } }
  /* contorno que se rellena */
  .L-outline { font-family:${FONTS.heavy} !important; text-transform:uppercase; font-size:clamp(60px,11vw,160px) !important; line-height:1 !important; position:relative; }
  .L-outline .ol { color:transparent; -webkit-text-stroke:2px rgba(243,236,223,.85); }
  .L-outline .fill { position:absolute; inset:0; color:var(--acc); clip-path:inset(0 100% 0 0); animation:fillIn var(--fd,1.2s) cubic-bezier(.6,0,.2,1) forwards; }
  @keyframes fillIn { to { clip-path:inset(0 0 0 0); } }
  /* dispersa */
  .L-scatter { position:absolute; inset:0; width:auto !important; }
  .L-scatter .w { position:absolute; opacity:0; animation:scatIn .7s cubic-bezier(.2,.8,.2,1) forwards; white-space:nowrap; }
  @keyframes scatIn { 0% { opacity:0; transform:translate(-50%,-50%) scale(.6) rotate(var(--rot)); } 100% { opacity:1; transform:translate(-50%,-50%) scale(1) rotate(var(--rot)); } }
  /* vertical */
  .L-vertical .side { position:fixed; left:3vw; top:50%; writing-mode:vertical-rl; transform:translateY(-50%) rotate(180deg);
                      font-family:${FONTS.heavy}; font-size:clamp(70px,14vh,200px); text-transform:uppercase; color:var(--acc); letter-spacing:.02em; white-space:nowrap;
                      opacity:0; animation:sideIn .8s cubic-bezier(.2,.8,.2,1) forwards; }
  @keyframes sideIn { from { opacity:0; transform:translateY(-30%) rotate(180deg); } to { opacity:1; transform:translateY(-50%) rotate(180deg); } }
  /* marcador */
  .L-marker .w.key { position:relative; z-index:0; }
  .L-marker .w.key::before { content:''; position:absolute; left:-.1em; right:-.1em; bottom:.08em; height:.42em; z-index:-1; background:var(--acc); opacity:.55;
                             transform-origin:left; transform:scaleX(0); animation:mark .5s .35s cubic-bezier(.6,0,.2,1) forwards; border-radius:2px; }
  @keyframes mark { to { transform:scaleX(1); } }
  .L-marker .w.key .ch { color:#fff !important; }
  /* salidas variadas */
  #lyr .line.out.x-slide { animation:outSlide .45s ease forwards; }
  #lyr .line.out.x-scale { animation:outScale .4s ease forwards; }
  #lyr .line.out.x-drop  { animation:outDrop .45s ease-in forwards; }
  @keyframes outSlide { to { opacity:0; transform:translateX(-60px); } }
  @keyframes outScale { to { opacity:0; transform:scale(.8); } }
  @keyframes outDrop  { to { opacity:0; transform:translateY(40px); } }
  .tr-fx { position:absolute; left:0; right:0; bottom:7vh; text-align:center; font:italic 300 clamp(16px,2.2vw,26px)/1.3 'Cormorant Garamond',serif;
           color:#ffe2b0; opacity:0; animation:trIn .45s ease forwards; text-shadow:0 0 18px rgba(0,0,0,.9); }
`;
document.head.appendChild(typoCss);

const LAYOUTS = ['classic', 'stack', 'split', 'slam', 'type', 'wave', 'outline', 'scatter', 'vertical', 'marker'];
function chooseLayout(text, words) {
  const norm = text.toLowerCase().replace(/[^\p{L}\p{N} ]/gu, '').trim();
  const r = mulberry(hashStr(ext.key() + '|' + (window.SESSION || '') + '|' + norm));                    // misma línea = mismo diseño (el coro se reconoce)
  const pool = words <= 3 ? ['slam', 'outline', 'vertical', 'stack', 'slam', 'outline']
    : words <= 7 ? ['classic', 'stack', 'split', 'slam', 'wave', 'marker', 'scatter', 'type', 'outline']
    : ['classic', 'classic', 'split', 'marker', 'type', 'wave'];
  return pool[Math.floor(r() * pool.length)];
}
function chars(parent, word, delay0, per, cls = '') {
  const w = document.createElement('span'); w.className = 'w' + cls; let d = delay0;
  for (const c of word) { const s = document.createElement('span'); s.className = 'ch'; s.textContent = c; s.style.animationDelay = d.toFixed(3) + 's';
    s.style.setProperty('--wy', (Math.sin(d * 40) * 40).toFixed(0)); s.style.setProperty('--wr', (Math.sin(d * 23) * 25).toFixed(0)); w.appendChild(s); d += per; }
  parent.appendChild(w); return d;
}

function layoutLine(el, text, dur, tr) {
  const words = text.split(/\s+/).filter(Boolean), key = salient(text), kLow = key.toLowerCase();
  const kind = chooseLayout(text, words.length);
  el.innerHTML = ''; el.className = 'line fast fx L-' + kind;
  el.style.setProperty('--acc', C(0, 1, 18));
  const per = clamp(Math.min(dur * .18, .7) / Math.max(1, text.length), .006, .03);
  const isKey = w => w.toLowerCase().replace(/[^\p{L}\p{N}'’-]/gu, '') === kLow.replace(/[^\p{L}\p{N}'’-]/gu, '');
  let d = 0;
  if (kind === 'stack') {
    let row = null, count = 0;
    words.forEach((w, i) => {
      const k = isKey(w), size = k ? 'big' : (i % 3 === 0 ? 'mid' : 'sm');
      if (!row || k || count >= 2) { row = document.createElement('span'); row.className = 'row ' + size; el.appendChild(row); count = 0; }
      d = chars(row, w + ' ', d, per); count++;
    });
  } else if (kind === 'split') {
    const cut = Math.max(1, Math.floor(words.length / 2));
    const a = document.createElement('span'); a.className = 'a'; const b = document.createElement('span'); b.className = 'b';
    words.slice(0, cut).forEach(w => { d = chars(a, w, d, per); a.appendChild(document.createTextNode(' ')); });
    words.slice(cut).forEach(w => { d = chars(b, w, d, per); b.appendChild(document.createTextNode(' ')); });
    el.append(a, b);
  } else if (kind === 'slam') {
    const step = Math.min(.45, dur * .7 / words.length);
    words.forEach((w, i) => { const s = document.createElement('span'); s.className = 'w' + (isKey(w) ? ' key' : ''); s.textContent = w; s.style.animationDelay = (i * step).toFixed(2) + 's'; el.appendChild(s); el.appendChild(document.createTextNode(' ')); });
  } else if (kind === 'type') {
    const step = clamp(dur * .5 / text.length, .02, .06);
    words.forEach(w => { d = chars(el, w, d, step); el.appendChild(document.createTextNode(' ')); d += step; });
  } else if (kind === 'outline') {
    const t = text.toUpperCase(); el.style.setProperty('--fd', Math.min(dur * .8, 2.2).toFixed(2) + 's');
    const ol = document.createElement('span'); ol.className = 'ol'; ol.textContent = t;
    const fill = document.createElement('span'); fill.className = 'fill'; fill.textContent = t; el.append(ol, fill);
  } else if (kind === 'scatter') {
    const r = mulberry(hashStr(text));
    words.forEach((w, i) => { const s = document.createElement('span'); s.className = 'w'; s.textContent = w;
      const k = isKey(w), fs = k ? 9 + r() * 4 : 3 + r() * 3;
      s.style.cssText = `left:${12 + r() * 76}%; top:${14 + r() * 62}%; font-size:${fs}vw; --rot:${((r() - .5) * 14).toFixed(1)}deg; animation-delay:${(i * Math.min(.3, dur * .6 / words.length)).toFixed(2)}s;` +
        `font-family:${k ? FONTS.heavy : [FONTS.serif, FONTS.syne, FONTS.classic][i % 3]}; ${k ? 'text-transform:uppercase; color:var(--acc);' : ''}`;
      el.appendChild(s); });
  } else if (kind === 'vertical') {
    const side = document.createElement('span'); side.className = 'side'; side.textContent = key || words[0]; el.appendChild(side);
    words.filter(w => !isKey(w)).forEach(w => { d = chars(el, w, d, per); el.appendChild(document.createTextNode(' ')); });
  } else {                                                          // clásica y marcador
    words.forEach(w => { d = chars(el, w, d, per, isKey(w) ? ' key' : ''); el.appendChild(document.createTextNode(' ')); });
  }
  if (tr) { const t = document.createElement('div'); t.className = ['scatter', 'vertical'].includes(kind) ? 'tr-fx' : 'tr'; t.textContent = tr;
    t.style.animationDelay = '0.08s'; el.appendChild(t); }
  el.dataset.exit = ['x-slide', 'x-scale', 'x-drop', ''][hashStr(text) % 4];
  fitLine(el, kind);
}
// nada se sale de la pantalla: lo gigante se achica y lo disperso se reacomoda
function fitLine(el, kind) {
  const M = 20, Wv = innerWidth, Hv = innerHeight;
  if (kind === 'stack') {
    for (const row of el.querySelectorAll('.row')) {
      let fs = parseFloat(getComputedStyle(row).fontSize), guard = 0;
      while (row.getBoundingClientRect().right > Wv - M && fs > 14 && guard++ < 40) { fs *= .92; row.style.fontSize = fs + 'px'; }
    }
  }
  if (kind === 'outline' || kind === 'slam') {
    const widest = Math.max(...[...el.querySelectorAll('.w, .ol')].map(n => n.offsetWidth), 1);
    if (widest > Wv - M * 2) el.style.fontSize = (parseFloat(getComputedStyle(el).fontSize) * (Wv - M * 2) / widest * .98) + 'px';
    let guard = 0;                                                  // y que no ocupe más de media pantalla de alto
    while (el.offsetHeight > Hv * .5 && guard++ < 30) el.style.fontSize = (parseFloat(getComputedStyle(el).fontSize) * .9) + 'px';
  }
  if (kind === 'vertical') {
    const side = el.querySelector('.side');
    if (side && side.offsetHeight > Hv - M * 3) side.style.fontSize = (parseFloat(getComputedStyle(side).fontSize) * (Hv - M * 3) / side.offsetHeight * .96) + 'px';
  }
  if (kind === 'scatter') {
    for (const w of el.querySelectorAll('.w')) {
      const half = w.offsetWidth / 2, halfH = w.offsetHeight / 2;
      if (w.offsetWidth > Wv - M * 2) { w.style.fontSize = (parseFloat(getComputedStyle(w).fontSize) * (Wv - M * 2) / w.offsetWidth) + 'px'; }
      const pad = M + 16;                                           // margen extra: las palabras van un poco giradas
      const cx = clamp(parseFloat(w.style.left) / 100 * Wv, half + pad, Wv - half - pad), cy = clamp(parseFloat(w.style.top) / 100 * Hv, halfH + pad, Hv - halfH - pad);
      w.style.left = cx + 'px'; w.style.top = cy + 'px';
    }
  }
}

// reemplaza la construcción de la línea (earth.js sigue llevando estado, traducción y eco)
const _showProcLineT = showProcLine;
showProcLine = function (i) {
  document.querySelectorAll('#lyr .line:not(.out)').forEach(el => el.dataset.exit && el.classList.add(el.dataset.exit));
  _showProcLineT(i);
  if (i < 0 || !IN.show) return;
  const el = [...lyr.querySelectorAll('.line:not(.out)')].at(-1); if (!el) return;
  const l = IN.lines[i], next = IN.lines[i + 1], dur = next ? next.t - l.t : 4, tr = IN.tr?.[i]?.trim() || '';
  const main = tr && IN.trMode === 'es' ? tr : l.text, second = tr && IN.trMode === 'ambas' ? tr : '';
  layoutLine(el, main, dur, second);
};
