// ============================================================
// cover.js — modo carátula: la portada como protagonista.
// Fondos (difuminado, ambiente, vinilo, mínimo), letra en línea o
// completa al lado de la portada, tamaño de portada, latido, reloj y
// una barra fija abajo con los controles. Todo se recuerda.
// Se abre con la carátula de la consola o la tecla c; se cierra con esc o c.
// ============================================================
const CV_DEF = { style: 'difuminado', lyr: 'linea', size: 'm', beat: true, clock: false, pin: false };
const CV = (() => { try { return { ...CV_DEF, ...JSON.parse(localStorage.getItem('lm_cover2') || '{}') }; } catch (e) { return { ...CV_DEF }; } })();
CV.art = ''; CV.listKey = '';
const cvSave = () => { try { const { art, listKey, cur, pp, ...keep } = CV; localStorage.setItem('lm_cover2', JSON.stringify(keep)); } catch (e) {} };
const cvEsc = t => String(t ?? '').replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
const CV_OPTS = {
  style: [['difuminado', 'difuminado'], ['ambiente', 'ambiente'], ['vinilo', 'vinilo'], ['minimo', 'mínimo']],
  lyr: [['linea', 'línea'], ['completa', 'completa'], ['no', 'oculta']],
  size: [['s', 's'], ['m', 'm'], ['l', 'l']],
};

{ const st = document.createElement('style'); st.textContent = `
  #cover { --gold:#f4c983; --gold2:#ffb36b; --paper:#f6eee2; --mute:rgba(246,238,226,.6); --faint:rgba(246,238,226,.34); --rule:rgba(246,238,226,.12);
           display:grid !important; grid-template-rows:minmax(0,1fr); gap:0 !important; padding:0 !important; cursor:default; font-family:'Anybody',sans-serif;
           --art:min(58vmin, calc(100vh - 250px), 620px); }
  #cover .coverbg { transition:opacity .8s; }
  #cover[data-size=s] { --art:min(40vmin, calc(100vh - 250px), 440px); }
  #cover[data-size=l] { --art:min(74vmin, calc(100vh - 210px), 820px); }
  #cover[data-lyr=completa] { --art:min(50vmin, calc(100vh - 250px), 560px); }
  .cv-amb { position:absolute; inset:0; opacity:0; transition:opacity .8s; overflow:hidden; }
  .cv-amb i { position:absolute; width:70vmax; height:70vmax; border-radius:50%; filter:blur(90px); opacity:.75; mix-blend-mode:screen; }
  .cv-amb i:nth-child(1) { left:-20vmax; top:-25vmax; animation:cvA 22s ease-in-out infinite alternate; }
  .cv-amb i:nth-child(2) { right:-25vmax; top:-10vmax; animation:cvB 26s ease-in-out infinite alternate; }
  .cv-amb i:nth-child(3) { left:10vmax; bottom:-35vmax; animation:cvC 30s ease-in-out infinite alternate; }
  @keyframes cvA { to { transform:translate(22vmax, 18vmax) scale(1.2); } }
  @keyframes cvB { to { transform:translate(-26vmax, 20vmax) scale(.85); } }
  @keyframes cvC { to { transform:translate(18vmax, -24vmax) scale(1.15); } }
  .cv-amb::after { content:''; position:absolute; inset:0; background:rgba(8,6,10,.38); }
  #cover[data-style=ambiente] { background:#07060a; } #cover[data-style=ambiente] .cv-amb { opacity:1; } #cover[data-style=ambiente] .coverbg { opacity:0; }
  #cover[data-style=minimo] { background:#050403; } #cover[data-style=minimo] .coverbg { opacity:0; }

  .cv-main { position:relative; min-height:0; display:flex; align-items:center; justify-content:center; gap:clamp(30px,6vw,110px); padding:28px 32px 96px; }
  .cv-left { display:flex; flex-direction:column; align-items:center; gap:18px; min-width:0; }
  .cv-art { position:relative; width:var(--art); aspect-ratio:1; flex:none; transition:width .6s cubic-bezier(.2,.8,.2,1), translate .9s cubic-bezier(.2,.8,.2,1); }
  #cover[data-beat="1"] .cv-art { transform:scale(calc(1 + var(--beat, 0) * .012)); }
  .cv-art #coverImg { position:absolute !important; inset:0; width:100% !important; height:100% !important; border-radius:14px; z-index:1; transform:none !important; box-shadow:0 40px 120px rgba(0,0,0,.6); }
  #cover[data-style=minimo] .cv-art #coverImg { border-radius:6px; }
  .cv-vinyl { position:absolute; inset:3%; border-radius:50%; translate:0 0; opacity:0; transition:translate .9s cubic-bezier(.2,.8,.2,1), opacity .5s;
              background:radial-gradient(circle, transparent 0 17%, #0c0c0c 17.5% 18.5%, transparent 19%), repeating-radial-gradient(circle, #141414 0 1px, #0a0a0a 1.5px 3px), #0a0a0a;
              box-shadow:0 30px 90px rgba(0,0,0,.7); }
  .cv-vinyl::after { content:''; position:absolute; inset:33%; border-radius:50%; background:var(--label) center/cover, #222; box-shadow:0 0 0 3px #111; }
  .cv-vinyl::before { content:''; position:absolute; inset:0; border-radius:50%; background:conic-gradient(from 30deg, transparent 0 20%, rgba(255,255,255,.07) 25%, transparent 32% 70%, rgba(255,255,255,.05) 75%, transparent 82%); }
  .cv-vinyl.spin { animation:cvSpin 1.8s linear infinite; }
  @keyframes cvSpin { to { rotate:360deg; } }
  #cover[data-style=vinilo] .cv-vinyl { opacity:1; translate:44% 0; }
  #cover[data-style=vinilo] .cv-art { translate:-20% 0; }
  #cover[data-style=vinilo][data-lyr=completa] .cv-art { translate:0 0; }
  #cover[data-style=vinilo][data-lyr=completa] .cv-vinyl { translate:30% 0; }
  #cover .covermeta { position:relative; text-align:center; max-width:min(80vw,760px); }
  #cover .covermeta b { font:italic 300 clamp(26px,3.6vw,48px)/1.05 'Anybody',sans-serif; font-variation-settings:'wdth' 118; color:var(--paper); }
  #cover[data-style=minimo] .covermeta b { font:800 clamp(36px,6vw,88px)/.9 'Anybody',sans-serif; font-style:normal; font-variation-settings:'wdth' 62; letter-spacing:-.01em; }
  #cover .covermeta span { font:400 10px/2.6 'Martian Mono',monospace; letter-spacing:.22em; text-transform:uppercase; color:var(--faint); }
  .cv-line { text-align:center; max-width:min(80vw,860px); min-height:2.8em; }
  .cv-line b { display:block; font:600 clamp(17px,2vw,26px)/1.25 'Anybody',sans-serif; font-variation-settings:'wdth' 104; color:var(--paper); }
  .cv-line span { display:block; margin-top:4px; font:italic 300 clamp(14px,1.5vw,18px)/1.3 'Cormorant Garamond',serif; color:#ffe2b0; }
  #cover:not([data-lyr=linea]) .cv-line { display:none; }

  .cv-full { display:none; width:min(44vw,620px); height:calc(var(--art) + 120px); max-height:100%; overflow:hidden; position:relative;
             -webkit-mask-image:linear-gradient(transparent, #000 18%, #000 78%, transparent); mask-image:linear-gradient(transparent, #000 18%, #000 78%, transparent); }
  #cover[data-lyr=completa] .cv-full { display:block; }
  #cover[data-lyr=completa] .cv-left .covermeta b { font-size:clamp(22px,2.6vw,36px); }
  .cv-list { position:absolute; left:0; right:0; top:0; transition:transform .7s cubic-bezier(.2,.8,.2,1); }
  .cv-list p { margin:0; padding:9px 0; cursor:pointer; color:rgba(246,238,226,.28); font:700 clamp(18px,2vw,30px)/1.2 'Anybody',sans-serif; font-variation-settings:'wdth' 100; transition:color .35s, transform .35s; transform-origin:left center; }
  .cv-list p:hover { color:rgba(246,238,226,.55); }
  .cv-list p.on { color:var(--paper); transform:scale(1.03); text-shadow:0 0 30px rgba(255,190,120,.25); }
  .cv-list p.past { color:rgba(246,238,226,.42); }
  .cv-list p small { display:block; font:italic 300 .62em/1.3 'Cormorant Garamond',serif; color:rgba(255,226,176,.5); margin-top:2px; }
  .cv-list p.on small { color:#ffe2b0; }
  .cv-list .none { color:var(--faint); font-size:15px; font-weight:400; cursor:default; }

  .cv-clock { position:absolute; top:26px; left:32px; display:none; color:var(--paper); }
  #cover[data-clock="1"] .cv-clock { display:block; }
  .cv-clock b { display:block; font:200 clamp(38px,5vw,72px)/1 'Anybody',sans-serif; font-variation-settings:'wdth' 130; letter-spacing:-.01em; }
  .cv-clock span { font:400 10px 'Martian Mono',monospace; letter-spacing:.2em; text-transform:uppercase; color:var(--faint); }

  .cv-float { position:absolute; left:50%; bottom:26px; transform:translateX(-50%); z-index:3; transition:opacity .5s, transform .5s cubic-bezier(.2,.8,.2,1); }
  body.idle #cover:not([data-pin="1"]):not(.menu) .cv-float { opacity:0; transform:translate(-50%, 16px); pointer-events:none; }
  .cv-float button { font:inherit; color:var(--mute); background:none; border:0; cursor:pointer; padding:0; }
  .cv-player { display:flex; align-items:center; gap:14px; width:min(620px, calc(100vw - 32px)); padding:8px 10px 8px 8px; border-radius:999px;
               background:linear-gradient(180deg, rgba(26,20,15,.72), rgba(12,10,8,.82)); border:1px solid var(--rule); backdrop-filter:blur(24px) saturate(1.4);
               box-shadow:0 20px 60px rgba(0,0,0,.45), inset 0 1px 0 rgba(255,255,255,.06); }
  .cv-ctl { display:flex; align-items:center; gap:2px; }
  .cv-ctl button { width:38px; height:38px; border-radius:50%; display:grid; place-items:center; transition:background .2s, color .2s; }
  .cv-ctl button:hover { background:rgba(246,238,226,.08); color:var(--paper); }
  .cv-ctl button.big { width:46px; height:46px; background:linear-gradient(180deg,#fbe2b8,var(--gold)); box-shadow:0 6px 20px rgba(255,170,90,.3), inset 0 1px 0 rgba(255,255,255,.6); }
  .cv-ctl button.big svg { fill:#1a1109; width:20px; height:20px; }
  .cv-ctl svg { width:18px; height:18px; fill:currentColor; }
  .cv-prog { flex:1; display:grid; grid-template-columns:auto 1fr auto; align-items:center; gap:10px; font:400 10px 'Martian Mono',monospace; color:var(--faint); font-variant-numeric:tabular-nums; }
  .cv-bar { position:relative; height:18px; cursor:pointer; background:linear-gradient(rgba(246,238,226,.13),rgba(246,238,226,.13)) center/100% 3px no-repeat; }
  .cv-bar:hover { background-size:100% 5px; }
  .cv-bar i { position:absolute; left:0; top:50%; height:3px; margin-top:-1.5px; width:0; border-radius:2px; background:linear-gradient(90deg, rgba(244,201,131,.4), var(--gold)); box-shadow:0 0 12px rgba(255,179,107,.6); }
  .cv-bar:hover i { height:5px; margin-top:-2.5px; }
  .cv-tools { display:flex; gap:2px; }
  .cv-tools button { width:38px; height:38px; border-radius:50%; display:grid; place-items:center; transition:background .2s, color .2s; }
  .cv-tools button:hover, .cv-tools button.on { background:rgba(246,238,226,.1); color:var(--paper); }
  .cv-tools svg { width:18px; height:18px; fill:none; stroke:currentColor; stroke-width:1.8; stroke-linecap:round; }

  .cv-menu { position:absolute; right:0; bottom:calc(100% + 12px); width:340px; padding:18px 18px 14px; border-radius:20px; color:var(--paper);
             background:linear-gradient(180deg, rgba(28,22,17,.9), rgba(14,11,9,.94)); border:1px solid var(--rule); backdrop-filter:blur(28px) saturate(1.4);
             box-shadow:0 30px 80px rgba(0,0,0,.55); opacity:0; transform:translateY(8px) scale(.98); transform-origin:bottom right; pointer-events:none; transition:opacity .25s, transform .3s cubic-bezier(.2,.8,.2,1); }
  #cover.menu .cv-menu { opacity:1; transform:none; pointer-events:auto; }
  .cv-menu h5 { margin:0 0 10px; font:400 9.5px 'Martian Mono',monospace; letter-spacing:.18em; text-transform:uppercase; color:var(--faint); }
  .cv-menu section + section { margin-top:16px; padding-top:14px; border-top:1px solid var(--rule); }
  .cv-tiles { display:grid; grid-template-columns:repeat(4,1fr); gap:8px; }
  .cv-tiles button { display:flex; flex-direction:column; gap:6px; align-items:stretch; font:400 9.5px 'Martian Mono',monospace; letter-spacing:.04em; color:var(--faint); }
  .cv-tiles i { position:relative; display:block; aspect-ratio:1; border-radius:10px; overflow:hidden; border:1px solid rgba(255,255,255,.08); transition:box-shadow .2s, transform .2s; }
  .cv-tiles button:hover i { transform:translateY(-2px); }
  .cv-tiles button.on { color:var(--paper); } .cv-tiles button.on i { box-shadow:0 0 0 2px #120e0b, 0 0 0 3.5px var(--gold); }
  .cv-tiles i.t-difuminado { background:var(--artbg) center/cover, #333; filter:blur(3px) brightness(.7); }
  .cv-tiles i.t-ambiente { background:radial-gradient(circle at 25% 30%, var(--a1, #6a4cff), transparent 60%), radial-gradient(circle at 80% 70%, var(--a2, #ff5a8a), transparent 60%), radial-gradient(circle at 60% 20%, var(--a3, #f4c983), transparent 55%), #0b090d; }
  .cv-tiles i.t-vinilo { background:#1a1512; } .cv-tiles i.t-vinilo::before { content:''; position:absolute; left:34%; top:16%; width:62%; aspect-ratio:1; border-radius:50%; background:radial-gradient(circle, var(--gold) 0 14%, #111 15% 100%); }
  .cv-tiles i.t-vinilo::after { content:''; position:absolute; left:10%; top:18%; width:56%; aspect-ratio:1; border-radius:4px; background:var(--artbg) center/cover, #444; }
  .cv-tiles i.t-minimo { background:#050403; } .cv-tiles i.t-minimo::after { content:''; position:absolute; inset:30% 30% 38%; border-radius:2px; background:var(--artbg) center/cover, #444; }
  .cv-segs { display:flex; padding:3px; border-radius:11px; background:rgba(246,238,226,.05); border:1px solid var(--rule); }
  .cv-segs button { flex:1; padding:7px 0; border-radius:8px; font:400 10px 'Martian Mono',monospace; letter-spacing:.06em; text-transform:uppercase; color:var(--faint); transition:all .2s; }
  .cv-segs button:hover { color:var(--paper); }
  .cv-segs button.on { background:rgba(246,238,226,.12); color:var(--paper); box-shadow:inset 0 0 0 1px rgba(244,201,131,.35); }
  .cv-toggles { display:grid; gap:2px; }
  .cv-sw { display:flex; align-items:center; justify-content:space-between; width:100%; padding:8px 2px; font:400 13px 'Anybody',sans-serif !important; color:var(--paper) !important; text-align:left; }
  .cv-sw small { display:block; font:400 11px 'Anybody',sans-serif; color:var(--faint); }
  .cv-sw em { position:relative; flex:none; width:34px; height:20px; border-radius:999px; background:rgba(246,238,226,.14); transition:background .2s; }
  .cv-sw em::after { content:''; position:absolute; top:3px; left:3px; width:14px; height:14px; border-radius:50%; background:#f6eee2; transition:transform .25s cubic-bezier(.2,.8,.2,1); }
  .cv-sw.on em { background:var(--gold); } .cv-sw.on em::after { transform:translateX(14px); background:#1a1109; }
  .cv-foot { display:flex; gap:8px; margin-top:14px; }
  .cv-foot button { flex:1; padding:9px 0; border-radius:10px; border:1px solid var(--rule); font:400 10px 'Martian Mono',monospace; letter-spacing:.1em; text-transform:uppercase; color:var(--mute); transition:all .2s; }
  .cv-foot button:hover { color:var(--paper); border-color:rgba(246,238,226,.3); }
  body.idle #cover { cursor:none; }
  @media (max-width:900px) { #cover[data-lyr=completa] .cv-main { flex-direction:column; } .cv-full { width:90vw; height:30vh; } .cv-prog span { display:none; } .cv-menu { width:min(340px, calc(100vw - 32px)); } }
`; document.head.appendChild(st); }

// ---------- estructura ----------
const cvIco = d => `<svg viewBox="0 0 24 24"><path d="${d}"/></svg>`;
const cvSeg = k => `<div class="cv-seg">${CV_OPTS[k].map(([v, t]) => `<button data-${k}="${v}">${t}</button>`).join('')}</div>`;
{
  const cover = $('cover'), img = $('coverImg'), meta = cover.querySelector('.covermeta');
  const amb = document.createElement('div'); amb.className = 'cv-amb'; amb.innerHTML = '<i></i><i></i><i></i>'; cover.insertBefore(amb, cover.children[1]);
  const main = document.createElement('div'); main.className = 'cv-main';
  const left = document.createElement('div'); left.className = 'cv-left';
  const art = document.createElement('div'); art.className = 'cv-art';
  const vinyl = document.createElement('div'); vinyl.className = 'cv-vinyl';
  art.append(vinyl, img);
  const line = document.createElement('div'); line.className = 'cv-line'; line.innerHTML = '<b id="cvLine"></b><span id="cvTr"></span>';
  left.append(art, meta, line);
  const full = document.createElement('div'); full.className = 'cv-full'; full.innerHTML = '<div class="cv-list" id="cvList"></div>';
  main.append(left, full);
  const clock = document.createElement('div'); clock.className = 'cv-clock'; clock.innerHTML = '<b id="cvClock"></b><span id="cvDate"></span>';
  const float = document.createElement('div'); float.className = 'cv-float';
  const tile = v => `<button data-style="${v[0]}"><i class="t-${v[0]}"></i>${v[1]}</button>`;
  const segs = k => `<div class="cv-segs">${CV_OPTS[k].map(([v, t]) => `<button data-${k}="${v}">${t}</button>`).join('')}</div>`;
  const sw = (id, t, d) => `<button class="cv-sw" id="${id}"><span>${t}<small>${d}</small></span><em></em></button>`;
  float.innerHTML = `<div class="cv-menu" id="cvMenu">
      <section><h5>fondo</h5><div class="cv-tiles">${CV_OPTS.style.map(tile).join('')}</div></section>
      <section><h5>letra</h5>${segs('lyr')}</section>
      <section><h5>portada</h5>${segs('size')}</section>
      <section class="cv-toggles">${sw('cvBeat', 'latido', 'la portada late con el ritmo')}${sw('cvClockBtn', 'reloj', 'la hora en pantalla')}${sw('cvPin', 'fijar la barra', 'que no se oculte al quedarse quieto')}</section>
      <div class="cv-foot"><button id="cvFs">pantalla completa</button></div>
    </div>
    <div class="cv-player">
      <div class="cv-ctl"><button data-c="prev" title="anterior">${cvIco('M6 5h2v14H6zM20 5v14L9 12z')}</button>
        <button data-c="playpause" class="big" title="reproducir / pausa (espacio)" id="cvPP">${cvIco('M7 5h4v14H7zM13 5h4v14h-4z')}</button>
        <button data-c="next" title="siguiente">${cvIco('M16 5h2v14h-2zM4 5v14l11-7z')}</button></div>
      <div class="cv-prog"><span id="cvT0">0:00</span><div class="cv-bar" id="cvBar"><i id="cvFill"></i></div><span id="cvT1">0:00</span></div>
      <div class="cv-tools"><button id="cvMenuBtn" title="opciones"><svg viewBox="0 0 24 24"><path d="M4 7h10M18 7h2M4 17h4M12 17h8"/><circle cx="16" cy="7" r="2"/><circle cx="10" cy="17" r="2"/></svg></button>
        <button id="cvBack" title="volver al video (esc)"><svg viewBox="0 0 24 24"><path d="M6 6l12 12M18 6 6 18"/></svg></button></div>
    </div>`;
  cover.append(main, float, clock);
  // nada dentro de la carátula la cierra por accidente: todo pasa por aquí
  cover.addEventListener('click', e => {
    e.stopImmediatePropagation();
    const bar = e.target.closest('#cvBar');
    if (bar) { const r = bar.getBoundingClientRect(); return ext.cmd('goto:' + (clamp((e.clientX - r.left) / r.width) * (ext.st.dur || 0)).toFixed(2)); }
    const p = e.target.closest('[data-t]'); if (p) return ext.cmd('goto:' + Math.max(0, +p.dataset.t - .15).toFixed(2));
    const b = e.target.closest('button');
    if (!b) { if (!e.target.closest('.cv-menu')) { cover.classList.remove('menu'); $('cvMenuBtn').classList.remove('on'); } return; }
    if (b.id === 'cvMenuBtn') { cover.classList.toggle('menu'); b.classList.toggle('on', cover.classList.contains('menu')); return; }
    if (b.dataset.c) return ext.cmd(b.dataset.c);
    for (const k of Object.keys(CV_OPTS)) if (b.dataset[k]) {
      CV[k] = b.dataset[k];
      cvSave(); CV.cur = -2; return cvPaint();
    }
    if (b.id === 'cvBeat') { CV.beat = !CV.beat; cvSave(); return cvPaint(); }
    if (b.id === 'cvClockBtn') { CV.clock = !CV.clock; cvSave(); return cvPaint(); }
    if (b.id === 'cvPin') { CV.pin = !CV.pin; cvSave(); return cvPaint(); }
    if (b.id === 'cvFs') return document.fullscreenElement ? document.exitFullscreen() : document.documentElement.requestFullscreen?.();
    if (b.id === 'cvBack') { cover.classList.remove('menu'); $('cvMenuBtn').classList.remove('on'); return toggleCover(false); }
  }, true);
}

// ---------- estado ----------
function cvPaint() {
  const cover = $('cover'), hasLyr = mode === 'proc' && IN.lines.some(l => l.text);
  cover.dataset.style = CV.style; cover.dataset.size = CV.size; cover.dataset.lyr = hasLyr ? CV.lyr : 'no';
  cover.dataset.beat = CV.beat ? '1' : '0'; cover.dataset.clock = CV.clock ? '1' : '0'; cover.dataset.pin = CV.pin ? '1' : '0';
  for (const k of Object.keys(CV_OPTS)) for (const b of cover.querySelectorAll(`[data-${k}]`)) b.classList.toggle('on', b.dataset[k] === CV[k]);
  $('cvBeat').classList.toggle('on', CV.beat); $('cvClockBtn').classList.toggle('on', CV.clock); $('cvPin').classList.toggle('on', CV.pin);
  const url = ext.artUrl || '';
  if (url && url !== CV.art && typeof artImg !== 'undefined' && artImg) {
    CV.art = url;
    const pal = paletteFrom(artImg, 7) || [];
    cover.querySelectorAll('.cv-amb i').forEach((el, i) => { const p = pal[i % pal.length] || { h: 30, s: 60, l: 50 }; el.style.background = `hsl(${p.h} ${Math.max(p.s, 55)}% ${Math.min(Math.max(p.l, 38), 58)}%)`; });
    cover.querySelector('.cv-vinyl').style.setProperty('--label', `url("${url}")`);
    const m = $('cvMenu'); m.style.setProperty('--artbg', `url("${url}")`);
    pal.slice(0, 3).forEach((p, i) => m.style.setProperty('--a' + (i + 1), `hsl(${p.h} ${Math.max(p.s, 55)}% ${Math.min(Math.max(p.l, 40), 60)}%)`));
  }
}
// la letra completa: se arma una vez por canción (y al llegar traducciones)
function cvBuildList() {
  const idx = IN.lines.map((l, i) => l.text ? i : -1).filter(i => i >= 0);
  const key = ext.key() + '|' + idx.length + '|' + (IN.tr || []).filter(Boolean).length + '|' + IN.trMode;
  if (key === CV.listKey) return;
  CV.listKey = key;
  const tx = i => { const main = IN.lines[i].text, tr = IN.tr?.[i] || ''; return IN.trMode === 'es' && tr ? [tr, ''] : [main, IN.trMode === 'ambas' ? tr : '']; };
  $('cvList').innerHTML = idx.length ? idx.map(i => { const [a, b] = tx(i); return `<p data-i="${i}" data-t="${IN.lines[i].t}">${cvEsc(a)}${b ? `<small>${cvEsc(b)}</small>` : ''}</p>`; }).join('') : '<p class="none">esta canción no tiene letra sincronizada</p>';
  CV.cur = -2;
}
(function cvLoop() {
  if (coverOpen) {
    const pos = ext.has() ? ext.now() : 0, dur = ext.st.dur || 0, f = s => Math.floor(s / 60) + ':' + String(Math.floor(s % 60)).padStart(2, '0');
    $('cvT0').textContent = f(pos); $('cvT1').textContent = f(dur); $('cvFill').style.width = (dur ? clamp(pos / dur) * 100 : 0) + '%';
    const playing = ext.st.state === 'playing';
    if (CV.pp !== playing) { CV.pp = playing; $('cvPP').innerHTML = cvIco(playing ? 'M7 5h4v14H7zM13 5h4v14h-4z' : 'M8 5v14l11-7z'); }
    $('cover').querySelector('.cv-vinyl').classList.toggle('spin', playing);
    $('cover').style.setProperty('--beat', CV.beat && mode === 'proc' ? (IN.beat || 0).toFixed(3) : 0);
    if (CV.clock) { const d = new Date(); $('cvClock').textContent = d.toLocaleTimeString('es', { hour: '2-digit', minute: '2-digit' }); $('cvDate').textContent = d.toLocaleDateString('es', { weekday: 'long', day: 'numeric', month: 'long' }); }
    if (mode === 'proc') {
      const i = IN.shown, main = i >= 0 ? IN.lines[i]?.text || '' : '', tr = i >= 0 ? IN.tr?.[i] || '' : '';
      const a = IN.trMode === 'es' && tr ? tr : main, b = IN.trMode === 'ambas' ? tr : '';
      if ($('cvLine').textContent !== a) { $('cvLine').textContent = a; $('cvTr').textContent = b; }
      if (CV.lyr === 'completa') {
        cvBuildList();
        const cur = IN.lines.findLastIndex(l => l.text && l.t <= pos + .1);
        if (cur !== CV.cur) {
          CV.cur = cur;
          const list = $('cvList'), box = list.parentElement;
          for (const p of list.children) { const n = +p.dataset.i; p.classList.toggle('on', n === cur); p.classList.toggle('past', n < cur); }
          const el = list.querySelector('p.on');
          list.style.transform = `translateY(${el ? box.clientHeight * .4 - el.offsetTop - el.offsetHeight / 2 : box.clientHeight * .3}px)`;
        }
      }
    }
  }
  requestAnimationFrame(cvLoop);
})();
{ const _toggleCover = toggleCover; toggleCover = function (on) { _toggleCover(on); if (coverOpen) { CV.art = ''; CV.listKey = ''; CV.cur = -2; cvPaint(); } }; }
addEventListener('resize', () => { if (coverOpen) CV.cur = -2; });
// esc cierra primero el menú de opciones
addEventListener('keydown', e => { if (e.key === 'Escape' && coverOpen && $('cover').classList.contains('menu')) { e.stopImmediatePropagation(); $('cover').classList.remove('menu'); $('cvMenuBtn').classList.remove('on'); } }, true);
