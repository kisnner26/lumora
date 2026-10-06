// ============================================================
// riso-theme.js — una sola estética para todo lumora: risografía.
// Papel crema con puntos de trama, tinta índigo para texto y contornos, naranja
// de acento, bordes gruesos, sombra plana desplazada (como una tinta mal
// registrada) y cero degradados suaves. Reescribe el aspecto de los ajustes,
// la bienvenida, la consola de reproducción, el modo carátula y el modo autor
// sin tocar su lógica: solo sobrescribe colores, bordes y formas.
// Los fondos vivos (escenas del motor riso.js) van detrás de la bienvenida.
// ============================================================
(() => {
  const css = document.createElement('style'); css.id = 'risocss';
  css.textContent = `
  :root { --rk1:#212b80; --rk2:#f97a2a; --rk3:#6b8fb3; --rkp:#f7edd8; --rkd:#e0561b; --rkl:#faf3e4;
          --rkdots:radial-gradient(rgba(107,143,179,.3) 1.2px, transparent 1.7px) 0 0/9px 9px; --rksh:7px 7px 0 -1px var(--rk1); }
  /* las mismas variables que ya usaba cada pieza, ahora en tintas */
  #settings, #panel.w2, body #hud, #autor, .cv-float, .cv-menu, .cv-next, #cvMenu {
    --gold:var(--rkd) !important; --gold2:var(--rk2) !important; --paper:var(--rk1) !important; --mute:rgba(33,43,128,.8) !important;
    --faint:#4f6c93 !important; --rule:rgba(33,43,128,.42) !important; --panel:var(--rkp) !important; }
  ::selection { background:var(--rk2); color:var(--rk1); }
  :focus-visible { outline:3px solid var(--rk2) !important; outline-offset:2px; }

  /* ---------- superficies de papel ---------- */
  #settings, .w-drawer, body #hud, .cv-player, .cv-menu, .cv-next, #panel.w2 #now {
    background:var(--rkdots), var(--rkp) !important; border:3px solid var(--rk1) !important; border-radius:0 !important;
    box-shadow:var(--rksh) !important; backdrop-filter:none !important; -webkit-backdrop-filter:none !important; color:var(--rk1) !important; }
  body #hud button, .cv-float button, .cv-menu button, #settings button { color:var(--rk1); }

  /* ---------- ajustes ---------- */
  #settings { border-width:0 0 0 4px !important; box-shadow:-9px 0 0 -1px rgba(33,43,128,.22) !important; font-variation-settings:normal; }
  .set-head { background:linear-gradient(var(--rkp) 82%, rgba(247,237,216,0)) !important; }
  #settings h2 { font:800 clamp(38px,6vw,54px)/.9 'Anybody',sans-serif !important; font-variation-settings:'wdth' 62 !important; text-transform:uppercase; letter-spacing:.005em; color:var(--rk1); }
  #settings h2 i { border-radius:0 !important; width:11px !important; height:11px !important; background:var(--rk2) !important; box-shadow:none !important; }
  #settings .sub, .set-mono { color:var(--rk3) !important; }
  #settings .close { border:2.5px solid var(--rk1) !important; padding:7px 12px !important; background:var(--rkl) !important; box-shadow:3px 3px 0 -1px var(--rk1); color:var(--rk1) !important; }
  #settings .close:hover { background:var(--rk2) !important; }
  .set-rail { border-bottom:3px solid var(--rk1) !important; gap:6px !important; margin:20px 0 0 !important; padding-bottom:14px !important; }
  .set-rail button { border-radius:0 !important; border:2px solid var(--rk1) !important; padding:7px 9px !important; color:var(--rk1) !important; background:var(--rkl); }
  .set-rail button b { color:var(--rkd) !important; opacity:1 !important; }
  .set-rail button:hover { background:var(--rk2) !important; color:var(--rk1) !important; }
  .set-rail button.on { background:var(--rk1) !important; color:var(--rkl) !important; } .set-rail button.on b { color:var(--rk2) !important; }
  .set-title { border-bottom:3px solid var(--rk1); padding-bottom:8px; margin-bottom:6px !important; }
  .set-title b { color:var(--rkl) !important; background:var(--rk1); padding:3px 7px; }
  .set-title h3 { font:800 30px/1 'Anybody',sans-serif !important; font-variation-settings:'wdth' 62 !important; text-transform:uppercase; }
  .opt { border-bottom:2px dashed rgba(33,43,128,.4) !important; }
  .opt label { font-weight:700 !important; }
  .opt small { color:var(--mute) !important; }
  /* tecla: cuadro con un testigo cuadrado */
  .sw { width:74px !important; height:34px !important; border:3px solid var(--rk1) !important; border-radius:0 !important; background:var(--rkl) !important; box-shadow:3px 3px 0 -1px var(--rk1) !important; }
  .sw::before { left:9px !important; width:10px !important; height:10px !important; margin-top:-5px !important; border-radius:0 !important; background:transparent !important; border:2.5px solid var(--rk1); box-shadow:none !important; }
  .sw::after { color:var(--rk1) !important; font-weight:600 !important; }
  .sw:hover { background:var(--rkp) !important; }
  .sw.on { background:var(--rk2) !important; box-shadow:1px 1px 0 -1px var(--rk1) !important; transform:translate(2px,2px); }
  .sw.on::before { background:var(--rk1) !important; box-shadow:none !important; }
  .sw.on::after { color:var(--rk1) !important; }
  /* selectores: fichas con borde */
  .seg { gap:8px !important; }
  .seg button { border:2.5px solid var(--rk1) !important; padding:6px 10px !important; background:var(--rkl); box-shadow:3px 3px 0 -1px var(--rk1); color:var(--rk1) !important; font-weight:600 !important; transition:transform .12s, box-shadow .12s, background .15s !important; }
  .seg button::after { display:none !important; }
  .seg button:hover { background:var(--rkp) !important; transform:translate(-1px,-1px); }
  .seg button.on { background:var(--rk1) !important; color:var(--rkl) !important; box-shadow:none; transform:translate(2px,2px); }
  .seg.swatches { gap:12px 10px !important; }
  .seg.swatches button { background:none !important; box-shadow:none !important; border:0 !important; padding:0 !important; transform:none !important; color:var(--rk1) !important; }
  .seg.swatches i { border:3px solid var(--rk1) !important; border-radius:0 !important; box-shadow:3px 3px 0 -1px var(--rk1); }
  .seg.swatches button.on i { box-shadow:0 0 0 3px var(--rkp), 0 0 0 6px var(--rk2) !important; }
  /* fader: regla con marcas y perilla naranja */
  .fad output { color:var(--rkd) !important; font-weight:600; }
  .opt input[type=range]::-webkit-slider-runnable-track { background:
      linear-gradient(90deg, var(--rk2) var(--p,50%), transparent var(--p,50%)) center / 100% 6px no-repeat,
      linear-gradient(var(--rk1), var(--rk1)) center / 100% 6px no-repeat,
      repeating-linear-gradient(90deg, var(--rk1) 0 2px, transparent 2px 10%) center / 100% 18px no-repeat !important; height:26px; }
  .opt input[type=range]::-webkit-slider-thumb { width:14px !important; height:26px !important; margin-top:0 !important; border-radius:0 !important; background:var(--rk2) !important; border:3px solid var(--rk1); box-shadow:2px 2px 0 -1px var(--rk1) !important; }
  #settings .lt-now { border-bottom:2px dashed rgba(33,43,128,.4) !important; }
  #settings .lt-now i { border:3px solid var(--rk1) !important; border-radius:0 !important; box-shadow:4px 4px 0 -1px var(--rk1) !important; }
  #settings .lt-now span { color:var(--rk3) !important; }
  #settings .calib { border:2.5px solid var(--rk1) !important; border-radius:0 !important; background:var(--rkl); box-shadow:3px 3px 0 -1px var(--rk1); color:var(--rk1) !important; }
  #settings .calib i { border-radius:0 !important; background:transparent !important; border:2.5px solid var(--rk1); }
  #settings .calib i.flash { background:var(--rk2) !important; box-shadow:none !important; }
  #settings .calib.on { background:var(--rk2) !important; }
  #settings .reset { border:2.5px solid var(--rk1) !important; padding:9px 14px !important; background:var(--rkl); box-shadow:3px 3px 0 -1px var(--rk1); color:var(--rk1) !important; display:inline-block; }
  #settings .reset:hover { background:var(--rk2) !important; }
  #settings ::-webkit-scrollbar { width:10px; } #settings ::-webkit-scrollbar-thumb { background:var(--rk1); } #settings::-webkit-scrollbar { width:10px; } #settings::-webkit-scrollbar-thumb { background:var(--rk1); }
  .opt input.txt { background:var(--rkl) !important; border:3px solid var(--rk1) !important; border-radius:0 !important; color:var(--rk1) !important; }
  .seg.chips button { font-size:10px !important; }
  .actbtn { border:2.5px solid var(--rk1) !important; border-radius:0 !important; background:var(--rkl) !important; box-shadow:3px 3px 0 -1px var(--rk1); color:var(--rk1) !important; font-weight:600 !important; }
  .actbtn:hover, .actbtn[data-armed="1"] { background:var(--rk2) !important; }
  #fps { background:var(--rkp) !important; color:var(--rk1) !important; border:2.5px solid var(--rk1); border-radius:0 !important; box-shadow:3px 3px 0 -1px var(--rk1); }

  /* ---------- bienvenida: escena viva detrás, etiquetas de papel encima ---------- */
  #panel.w2 { background:#f4ead4 !important; backdrop-filter:none !important; color:var(--rk1); }
  #panel.w2 > canvas.rs-bg { position:absolute !important; inset:0; width:100%; height:100%; z-index:0 !important; display:block; }
  .w-grain { display:none !important; }
  .w-top { padding-top:24px !important; }
  .w-mark { font:800 30px/1 'Anybody',sans-serif !important; font-variation-settings:'wdth' 62 !important; text-transform:uppercase; color:var(--rk1) !important; background:var(--rkp); border:3px solid var(--rk1); box-shadow:var(--rksh); padding:7px 16px 8px; transform:rotate(-.6deg); align-items:center !important; }
  .w-mark i { border-radius:0 !important; width:9px !important; height:9px !important; background:var(--rk2) !important; box-shadow:none !important; margin-top:0 !important; }
  .w-tray { background:var(--rkp); border:3px solid var(--rk1); box-shadow:var(--rksh); padding:9px 16px; }
  .w-tray .st { color:var(--rk1) !important; }
  .w-tray .st span { color:var(--rk1) !important; }
  .w-tray .st.warn span { color:var(--rkd) !important; font-weight:600; }
  .w-tray .st i { border-radius:0 !important; background:transparent !important; border:2px solid var(--rk1); box-shadow:none !important; }
  .w-tray .st.ok i { background:var(--rk1) !important; } .w-tray .st.warn i { background:var(--rk2) !important; }
  .w-nav { gap:10px !important; }
  .w-nav > button:not(.w-pill), .w-pill { border:2.5px solid var(--rk1) !important; border-radius:0 !important; background:var(--rkp) !important; color:var(--rk1) !important; box-shadow:3px 3px 0 -1px var(--rk1); padding:8px 12px !important; font-weight:600 !important; transition:transform .12s, box-shadow .12s, background .15s; }
  .w-nav > button:not(.w-pill):hover, .w-pill:hover { background:var(--rk2) !important; transform:translate(-1px,-1px); box-shadow:4px 4px 0 -1px var(--rk1); }
  .w-pill.solid { background:var(--rk2) !important; color:var(--rk1) !important; border-color:var(--rk1) !important; }
  .w-eyebrow { color:var(--rk1) !important; opacity:1 !important; background:var(--rkp); border:2.5px solid var(--rk1); padding:8px 12px; box-shadow:4px 4px 0 -1px var(--rk1); display:inline-flex !important; }
  .w-eyebrow::before { display:none !important; }
  .w-hero { align-self:center; }
  .w-line { display:inline-block !important; font-size:clamp(46px,7.4vw,124px) !important; min-height:0 !important; padding:.08em .22em .14em; background:var(--rkp); border:4px solid var(--rk1); box-shadow:9px 9px 0 -1px var(--rk1); color:var(--rk1); transform:rotate(-.6deg); max-width:100%; }
  .w-line .ln { white-space:normal !important; }
  .w-line .c.k { color:var(--rkd) !important; text-shadow:none !important; }
  .w-lede { color:var(--rk1) !important; background:var(--rkp); border:3px solid var(--rk1); padding:12px 16px; box-shadow:5px 5px 0 -1px var(--rk1); font-weight:500 !important; }
  #panel.w2 #msg { color:var(--rkd) !important; font-weight:700; }
  #panel.w2 #now { margin-bottom:26px; }
  #panel.w2 #nowDot { border-radius:0 !important; border:3px solid var(--rk1); background:var(--rkl) !important; }
  #panel.w2 #nowDot i, #panel.w2 #now.live #nowDot i { border-radius:0 !important; background:var(--rk1) !important; box-shadow:none !important; }
  #panel.w2 #now.live #nowDot i { background:var(--rk2) !important; }
  .w2 #nowTitle { color:var(--rk1) !important; font-variation-settings:'wdth' 100 !important; } .w2 #nowSub { color:var(--mute) !important; } .w2 #nowTime { color:var(--rk3) !important; }
  .w2 .nowctl button { border-radius:0 !important; color:var(--rk1) !important; border:2.5px solid transparent; }
  .w2 .nowctl button:hover { background:var(--rk2) !important; border-color:var(--rk1); color:var(--rk1) !important; }
  .w2 .nowctl button.big { background:var(--rk1) !important; color:var(--rkl) !important; }
  .w2 .nowbar { background:rgba(33,43,128,.15) !important; height:6px !important; } .w2 .nowbar i { background:var(--rk2) !important; box-shadow:none !important; }
  .w-go { border-radius:0 !important; background:var(--rk2) !important; color:var(--rk1) !important; border:3px solid var(--rk1) !important; box-shadow:5px 5px 0 -1px var(--rk1) !important; font-variation-settings:'wdth' 90 !important; }
  .w-go:hover { transform:translate(-1px,-1px) !important; box-shadow:7px 7px 0 -1px var(--rk1) !important; background:#ff8d42 !important; }
  .w-scrim { background:rgba(33,43,128,.38) !important; }
  .w-drawer { border-width:0 0 0 4px !important; box-shadow:-9px 0 0 -1px rgba(33,43,128,.22) !important; }
  .w-close { border:2.5px solid var(--rk1) !important; padding:7px 12px !important; background:var(--rkl) !important; color:var(--rk1) !important; box-shadow:3px 3px 0 -1px var(--rk1); top:22px !important; }
  .w-close:hover { background:var(--rk2) !important; }
  .w-kicker { color:var(--rkl) !important; background:var(--rk1); display:inline-block; padding:4px 9px; }
  .w-drawer h2 { font-variation-settings:'wdth' 62 !important; text-transform:uppercase; color:var(--rk1); }
  .w-drawer h2 em { color:var(--rk3) !important; text-transform:none; }
  .w-steps li::before { color:var(--rkd) !important; font-weight:700; }
  .w-steps b { font-weight:700 !important; }
  .w-drawer kbd, kbd { border:2px solid var(--rk1) !important; border-bottom-width:4px !important; border-radius:0 !important; color:var(--rk1) !important; background:var(--rkl); }
  .w-drawer textarea, .w-drawer #cid { background:var(--rkl) !important; border:3px solid var(--rk1) !important; border-radius:0 !important; color:var(--rk1) !important; }
  .w-drawer textarea:focus, .w-drawer #cid:focus { border-color:var(--rk2) !important; }
  .w-drawer .row span, .w-drawer .label, .w-drawer .note { color:var(--mute) !important; }
  .w-drawer .chip { border-color:var(--rk1) !important; border-radius:0 !important; color:var(--rk1) !important; }

  /* ---------- consola de reproducción ---------- */
  body #hud { border-radius:0 !important; }
  #hudArtBtn { border-radius:0 !important; border:3px solid var(--rk1); background:var(--rkl) !important; } #hudArtBtn i { border-radius:0 !important; box-shadow:none !important; }
  body #hud b#hudTitle { color:var(--rk1) !important; font-variation-settings:'wdth' 100 !important; } body #hud span#hudSub { color:var(--mute) !important; }
  .hud-chips em { border-color:var(--rk1) !important; border-radius:0 !important; color:var(--rk1) !important; }
  .hud-chips em#hudSrc { background:var(--rk2); border-color:var(--rk1) !important; color:var(--rk1) !important; }
  body #hud .hudctl button, .hud-tools button { border-radius:0 !important; color:var(--rk1) !important; }
  body #hud .hudctl button:hover, .hud-tools button:hover { background:var(--rk2) !important; color:var(--rk1) !important; }
  body #hud .hudctl button.big { background:var(--rk2) !important; border:3px solid var(--rk1); box-shadow:3px 3px 0 -1px var(--rk1) !important; }
  body #hud .hudctl button.big svg { fill:var(--rk1) !important; }
  body #hud .hud-tools .tag { border:2px solid var(--rk1) !important; border-radius:0 !important; color:var(--rk1) !important; }
  .hud-tools .led { border-radius:0 !important; background:transparent !important; border:1.5px solid var(--rk1); } .hud-tools .led.on { background:var(--rk2) !important; box-shadow:none !important; }
  .hud-tools .sep { background:var(--rk1) !important; }
  .recdot { fill:var(--rk2) !important; }
  body #hud .hud-prog, body #hud .hud-prog span { color:var(--rk1) !important; }
  body #hud .hudbar { background:linear-gradient(var(--rk1),var(--rk1)) center/100% 4px no-repeat !important; }
  body #hud .hudbar i { background:var(--rk2) !important; box-shadow:none !important; height:8px !important; border:2px solid var(--rk1); border-left:0; border-radius:0 !important; }
  body #hud .hud-marks b { background:var(--rk1) !important; }
  body #hud .hud-tip { background:var(--rkp) !important; color:var(--rk1) !important; border:2px solid var(--rk1) !important; border-radius:0 !important; }
  #hudMsg { background:var(--rkp) !important; color:var(--rk1) !important; border:3px solid var(--rk1) !important; border-radius:0 !important; box-shadow:5px 5px 0 -1px var(--rk1); font-weight:600 !important; }
  #recBadge { background:var(--rk2) !important; color:var(--rk1) !important; border:3px solid var(--rk1); border-radius:0 !important; font-weight:700 !important; }
  #recBadge.on::before { background:var(--rk1) !important; border-radius:0 !important; }
  #prep { color:var(--rk1) !important; background:var(--rkp); border:3px solid var(--rk1); padding:8px 14px; box-shadow:4px 4px 0 -1px var(--rk1); }
  #prep i { background:rgba(33,43,128,.2) !important; border-radius:0 !important; } #prep b { background:var(--rk2) !important; }
  #np { color:var(--rk1) !important; } #np .np-label, #npSong { background:var(--rkp); border:2.5px solid var(--rk1); padding:6px 10px; color:var(--rk1) !important; text-shadow:none !important; box-shadow:3px 3px 0 -1px var(--rk1); font-style:normal !important; font-weight:600; }
  #np .np-label { margin-right:6px !important; }

  /* ---------- modo carátula (los controles; el fondo sigue siendo la portada) ---------- */
  .cv-player { border-radius:0 !important; }
  .cv-ctl button, .cv-tools button { border-radius:0 !important; color:var(--rk1) !important; }
  .cv-ctl button:hover, .cv-tools button:hover, .cv-tools button.on { background:var(--rk2) !important; color:var(--rk1) !important; }
  .cv-ctl button.big { background:var(--rk2) !important; border:3px solid var(--rk1) !important; box-shadow:3px 3px 0 -1px var(--rk1) !important; } .cv-ctl button.big svg { fill:var(--rk1) !important; }
  .cv-prog, .cv-prog span { color:var(--rk1) !important; }
  .cv-bar { background:linear-gradient(var(--rk1),var(--rk1)) center/100% 4px no-repeat !important; }
  .cv-bar i { background:var(--rk2) !important; box-shadow:none !important; height:8px !important; margin-top:-4px !important; border:2px solid var(--rk1); border-left:0; border-radius:0 !important; }
  .cv-tools #cvLike svg { stroke:var(--rk1) !important; fill:none !important; }
  .cv-tools #cvLike.on { background:var(--rk1) !important; }
  .cv-tools #cvLike.on svg { fill:var(--rk2) !important; stroke:var(--rkl) !important; }
  .cv-tools #cvLike:hover:not(.on) { background:var(--rk2) !important; }
  .cv-menu { border-radius:0 !important; }
  .cv-menu::-webkit-scrollbar-thumb { background:var(--rk1) !important; border-radius:0 !important; }
  .cv-tabs, .cv-segs { border:3px solid var(--rk1) !important; border-radius:0 !important; background:var(--rkl) !important; padding:3px !important; gap:3px; }
  .cv-tabs button, .cv-segs button { border-radius:0 !important; color:var(--rk1) !important; font-weight:600 !important; }
  .cv-tabs button:hover, .cv-segs button:hover { background:var(--rk2) !important; }
  .cv-tabs button.on, .cv-segs button.on { background:var(--rk1) !important; color:var(--rkl) !important; box-shadow:none !important; }
  .cv-desc, .cv-desc b, .cv-menu h5, .cv-tiles button, .cv-chip { color:var(--rk1) !important; }
  .cv-menu section + section, .cv-foot { border-top:2px dashed rgba(33,43,128,.45) !important; }
  .cv-tiles i, .cv-chip i { border:3px solid var(--rk1) !important; border-radius:0 !important; }
  .cv-tiles button.on i { box-shadow:0 0 0 3px var(--rkp), 0 0 0 6px var(--rk2) !important; }
  .cv-chip i { background:var(--rkl) !important; } .cv-chip.on i { background:var(--rk2) !important; box-shadow:none !important; } .cv-chip.on svg { stroke:var(--rk1) !important; }
  .cv-foot button { border:2.5px solid var(--rk1) !important; border-radius:0 !important; color:var(--rk1) !important; background:var(--rkl); box-shadow:3px 3px 0 -1px var(--rk1); }
  .cv-foot button:hover { background:var(--rk2) !important; }
  #cover .covermeta b, #cover .covermeta span, .cv-clock b, .cv-clock span { background:var(--rkp); color:var(--rk1) !important; border:3px solid var(--rk1); padding:6px 14px; box-shadow:5px 5px 0 -1px var(--rk1); display:inline-block; text-shadow:none !important; }
  #cover .covermeta span, .cv-clock span { border-width:2.5px; margin-top:10px; padding:5px 10px; line-height:1.4 !important; }
  .cv-line b { background:var(--rkp); color:var(--rk1) !important; border:3px solid var(--rk1); padding:6px 14px; display:inline-block; box-shadow:5px 5px 0 -1px var(--rk1); text-shadow:none !important; }
  .cv-line span { color:var(--rkl) !important; text-shadow:0 0 6px rgba(0,0,0,.6); }
  .cv-list p.on { background:var(--rkp); color:var(--rk1) !important; border:3px solid var(--rk1); padding:9px 14px; box-shadow:5px 5px 0 -1px var(--rk1); text-shadow:none !important; }
  .cv-list p.on small { color:var(--mute) !important; }
  #cover .cv-art #coverImg { border-radius:0 !important; border:4px solid var(--rk1); box-shadow:10px 10px 0 -1px var(--rk1) !important; }
  .cv-next { border-radius:0 !important; color:var(--rk1) !important; }
  .cv-next * { color:var(--rk1) !important; }

  /* ---------- modo autor ---------- */
  #autor { color:var(--rk1) !important; }
  #autTop, #autIns, #autTl { background:var(--rkdots), var(--rkp) !important; }
  #autTop { border-bottom:4px solid var(--rk1) !important; } #autIns { border-left:4px solid var(--rk1) !important; } #autTl { border-top:4px solid var(--rk1) !important; }
  #autTop .brand { font:800 24px/1 'Anybody',sans-serif !important; font-variation-settings:'wdth' 62 !important; text-transform:uppercase; }
  #autTop .brand b { color:var(--rkl) !important; background:var(--rk1); padding:3px 7px; }
  #autTop .song, #autTop .song b { color:var(--rk1) !important; }
  .aut-tr button { border-radius:0 !important; color:var(--rk1) !important; } .aut-tr button:hover { background:var(--rk2) !important; } .aut-tr button.big { background:var(--rk2) !important; border:3px solid var(--rk1) !important; }
  #autClock, #autSaved { color:var(--rk1) !important; } #autSaved.ok { color:var(--rkd) !important; font-weight:700; }
  .aut-btn { border:2.5px solid var(--rk1) !important; border-radius:0 !important; color:var(--rk1) !important; background:var(--rkl) !important; box-shadow:3px 3px 0 -1px var(--rk1); font-weight:600 !important; }
  .aut-btn:hover { background:var(--rk2) !important; color:var(--rk1) !important; border-color:var(--rk1) !important; }
  .aut-btn.gold { background:var(--rk2) !important; } .aut-btn.rec { color:var(--rk1) !important; } .aut-btn.rec.on { background:var(--rk2) !important; }
  .ai-h .mono { color:var(--rkd) !important; font-weight:700; } .ai-nav button { border:2.5px solid var(--rk1) !important; border-radius:0 !important; color:var(--rk1) !important; }
  .ai-title { font-variation-settings:'wdth' 62 !important; text-transform:uppercase; } .ai-title em { color:var(--rk3) !important; text-transform:none; }
  #autIns section { border-top:2px dashed rgba(33,43,128,.45) !important; } #autIns h4, #autIns h4 small { color:var(--rk3) !important; }
  #autIns textarea, #autIns input[type=text], #autIns select { background:var(--rkl) !important; border:3px solid var(--rk1) !important; border-radius:0 !important; color:var(--rk1) !important; }
  #autIns select option { background:var(--rkp); }
  .chip2 { border:2.5px solid var(--rk1) !important; border-radius:0 !important; color:var(--rk1) !important; background:var(--rkl); box-shadow:2px 2px 0 -1px var(--rk1); font-weight:600 !important; }
  .chip2:hover { background:var(--rk2) !important; } .chip2.on { background:var(--rk1) !important; color:var(--rkl) !important; box-shadow:none; } .chip2 .x { color:var(--rk2) !important; }
  .scene-grid i { border-radius:0 !important; border:1.5px solid var(--rk1); }
  .swatch-row button { border:2.5px solid var(--rk1) !important; border-radius:0 !important; } .swatch-row button.on { box-shadow:0 0 0 3px var(--rkp), 0 0 0 6px var(--rk2) !important; }
  .fad2 input, .tl-bar input[type=range] { accent-color:#f97a2a; } .fad2 output { color:var(--rkd) !important; font-weight:700; }
  .words button { color:var(--rk1) !important; border-radius:0 !important; } .words button:hover { background:var(--rk2) !important; } .words button.on { background:var(--rk1) !important; color:var(--rkl) !important; }
  .ai-tr { color:var(--mute) !important; }
  .keyled .sw { border-radius:0 !important; }
  .ai-foot { border-top:2px dashed rgba(33,43,128,.45) !important; }
  .tl-bar, .tl-ruler { border-bottom:2px solid var(--rk1) !important; color:var(--rk1) !important; } .tl-ruler span { color:var(--rk1) !important; }
  .tl-b { border:2.5px solid var(--rk1) !important; border-radius:0 !important; background:var(--rkl) !important; color:var(--rk1) !important; }
  .tl-b b, .tl-b small { color:var(--rk1) !important; } .tl-b.on { background:var(--rk2) !important; box-shadow:none !important; }
  .tl-b .en { background:linear-gradient(90deg, var(--rk1) var(--e), transparent var(--e)) !important; opacity:1 !important; }
  .tl-b .objs i { border-radius:0 !important; background:var(--rk1) !important; }
  .tl-l { border:2px solid var(--rk1) !important; border-radius:0 !important; background:var(--rkl) !important; color:var(--rk1) !important; } .tl-l:hover { background:var(--rk2) !important; }
  `;
  document.head.appendChild(css);
})();
