// identidad de fábula; solo se aplica mientras el usuario elige este motor.
(() => {
  const css=document.createElement('style');css.id='fabula-theme';
  css.textContent=`
  body.fabula { --rk1:#39382d; --rk2:#b89a60; --rk3:#748373; --rkp:#e7dcc3; --rkl:#f3ead7; --rkd:#84513f; --rkdots:none; --rksh:0 12px 36px #191d1724; }
  body.fabula :is(#home,#fx) { --ink:#39382d !important; --ink2:#b89a60 !important; --ink3:#748373 !important; --paper:#e7dcc3 !important; }
  body.fabula :is(#settings,#panel.w2,#hud,#autor,.cv-float,.cv-menu,#cvMenu) { --mute:#585b4d !important; --faint:#666b59 !important; --rule:#a99b7b !important; }
  body.fabula :is(#settings,.w-drawer,#hud,.cv-player,.cv-menu,.cv-next,#panel.w2 #now,.hm-label,.hm-card,#hudMoreMenu) {
    background:#e7dcc3f5 !important; border:1px solid #a99b7b !important; border-radius:4px !important; box-shadow:0 12px 36px #191d1724 !important; }
  body.fabula :is(.hm-label,.hm-card,#settings section)::after, body.fabula .hm-card::before { display:none !important; }
  body.fabula :is(#settings h2,.hm-h,.hm-brand b,#panel.w2 h1,.w-drawer h2,#autor h2) {
    font-family:'Iowan Old Style','Palatino Linotype',Georgia,serif !important; font-weight:500 !important; font-stretch:normal !important;
    font-variation-settings:normal !important; text-transform:none !important; letter-spacing:-.025em !important; transform:none !important; }
  body.fabula :is(#settings,#panel.w2,#hud,#autor,.w-drawer,.cv-menu,.hm-desc,.hm-card b) {
    font-family:'Iowan Old Style','Palatino Linotype',Georgia,serif !important; }
  body.fabula :is(#settings .seg button,.set-rail button,.set-title h3,.set-title b,.set-mono,#settings small,#settings .sub,#hud button,.hm-kick,.hm-brand span,.hm-card small,.hm-hint,.cv-menu button) {
    font-family:system-ui,sans-serif !important; font-weight:450 !important; text-transform:none !important; letter-spacing:.015em !important; }
  body.fabula .hm-card b { font-weight:500 !important; text-transform:none !important; font-stretch:normal !important; }
  body.fabula :is(.hm-kick,.hm-desc,.hm-brand,.hm-card,.hm-h,#setPrev) { transform:none; box-shadow:0 8px 30px #191d1724 !important; }
  body.fabula :is(#settings button,.cv-menu button,#hud button) { border-width:1px !important; box-shadow:none !important; }
  body.fabula #settings { background:#e7dcc3 !important; }
  body.fabula #settings .opt { border-bottom:1px solid #a99b7b !important; }
  body.fabula #settings :is(.close,.actbtn) { font-family:system-ui,sans-serif !important; text-transform:none !important; letter-spacing:0 !important; }
  body.fabula .sw::after { font-family:system-ui,sans-serif !important; text-transform:none !important; letter-spacing:0 !important; }
  body.fabula :is(.set-rail button,.seg button) { min-height:36px; }
  body.fabula :focus-visible { outline:2px solid #84513f !important; outline-offset:3px; }
  body.fabula #setPrev { border:1px solid #a99b7b !important; }
  body.fabula .hm-desc .hw.cur { background:linear-gradient(transparent 80%,#b89a6066 80%) !important; }
  body.fabula :is(#home,#panel) > canvas:not(.fabula-backdrop) { visibility:hidden; }
  canvas.fabula-backdrop { position:absolute !important; inset:0; width:100%; height:100%; pointer-events:none; }
  body:not(.fabula) canvas.fabula-backdrop { display:none !important; }
  body.fabula #settings :is([data-row=fxCine],[data-row=typo],[data-row=letterAnim],[data-row=kinetic],[data-row=palette],[data-row=textBox],[data-row=flashes],[data-row=cards],[data-row=echo],[data-row=variation],[data-row=poster],[data-row=posterGuardar]) { display:none !important; }
  `;
  document.head.append(css);
})();
