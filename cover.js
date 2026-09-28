// ============================================================
// cover.js — modo carátula: la portada como protagonista.
// Nueve fondos (difuminado, ambiente, escena, mínimo, vinilo con brazo,
// cassette, cd, estantería, artista), letra en línea o completa, tamaño,
// efectos (latido, anillo, holograma, 3D, de qué trata…), scratch para
// adelantar y póster del verso. Todo se recuerda.
// Se abre con la carátula de la consola o la tecla c; se cierra con esc o c.
// ============================================================
const CV_DEF = { style: 'difuminado', lyr: 'linea', size: 'm', beat: true, clock: false, pin: false, react: true, ring: false, holo: false, depth: false, trata: false, tab: 'fondo' };
const CV = (() => { try { return { ...CV_DEF, ...JSON.parse(localStorage.getItem('lm_cover2') || '{}') }; } catch (e) { return { ...CV_DEF }; } })();
CV.art = ''; CV.listKey = '';
if (!['fondo', 'vista'].includes(CV.tab)) CV.tab = 'fondo';
const cvSave = () => { try { localStorage.setItem('lm_cover2', JSON.stringify(Object.fromEntries(Object.keys(CV_DEF).map(k => [k, CV[k]])))); } catch (e) {} };
const cvEsc = t => String(t ?? '').replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
const CV_OPTS = {
  style: [['difuminado', 'difuminado'], ['ambiente', 'ambiente'], ['escena', 'escena'], ['minimo', 'mínimo'], ['vinilo', 'vinilo'], ['cassette', 'cassette'], ['cd', 'cd'], ['estanteria', 'estantería'], ['artista', 'artista']],
  lyr: [['linea', 'línea'], ['completa', 'completa'], ['no', 'oculta']],
  size: [['s', 's'], ['m', 'm'], ['l', 'l']],
};
// la leyenda del menú: qué hace cada opción, sin tener que adivinar
const CV_DESC = {
  style: { difuminado: 'la portada enorme y desenfocada, respirando despacio detrás', ambiente: 'manchas con los colores de la portada, moviéndose lento',
           escena: 'el video de lumora sigue corriendo detrás, desenfocado', minimo: 'negro, la portada y el título en grande; nada más',
           vinilo: 'el disco con su brazo y su aguja. Arrástralo en círculo para adelantar o atrasar', cassette: 'la cinta asoma detrás. Arrástrala de lado para moverte por la canción',
           cd: 'el disco iridiscente asoma. Arrástralo en círculo para adelantar o atrasar', estanteria: 'los discos que escuchaste desfilan abajo, el último primero',
           artista: 'otras portadas del artista flotan detrás, despacio' },
  lyr: { linea: 'el verso que suena, debajo de la portada', completa: 'toda la letra al lado; toca un verso para saltar ahí', no: 'solo la portada, sin letra' },
  size: { s: 'portada chica: más aire alrededor', m: 'portada mediana', l: 'portada grande, casi a pantalla' },
};
const cvLabel = (k, v) => (CV_OPTS[k].find(o => o[0] === v) || [, v])[1];
function cvDesc(over) {
  if (over?.dataset.style) return $('cvDescFondo').innerHTML = `<b>${cvEsc(cvLabel('style', over.dataset.style))}</b> · ${CV_DESC.style[over.dataset.style]}`;
  if (over?.dataset.lyr) return $('cvDescVista').innerHTML = `<b>${cvEsc(cvLabel('lyr', over.dataset.lyr))}</b> · ${CV_DESC.lyr[over.dataset.lyr]}`;
  if (over?.dataset.size) return $('cvDescVista').innerHTML = `<b>${over.dataset.size}</b> · ${CV_DESC.size[over.dataset.size]}`;
  if (over?.dataset.hint) return $('cvDescVista').innerHTML = `<b>${cvEsc(over.querySelector('span').textContent)}</b> · ${cvEsc(over.dataset.hint)}`;
  $('cvDescFondo').innerHTML = `<b>${cvEsc(cvLabel('style', CV.style))}</b> · ${CV_DESC.style[CV.style]}`;
  const on = [...document.querySelectorAll('.cv-chip.on span')].map(x => x.textContent);
  $('cvDescVista').innerHTML = `<b>letra ${cvEsc(cvLabel('lyr', CV.lyr))}</b> · ` + (on.length ? `efectos: ${cvEsc(on.join(', '))}.` : 'sin efectos.') + ' Pasa el cursor por una opción para ver qué hace.';
}
// todas las pestañas miden lo mismo: el menú no salta al cambiar
function cvPaneH() {
  const m = $('cvMenu'); let h = 0;
  m.querySelectorAll('.cv-pane').forEach(p => { p.style.display = 'block'; h = Math.max(h, p.offsetHeight); p.style.display = ''; });
  if (h) m.style.setProperty('--paneH', h + 'px');
}

// historial de discos escuchados (uno por álbum): sostiene la estantería y las portadas del artista.
// Se anota siempre, esté abierta o no la carátula; el puente guarda cada portada con su token
const CV_HIST_KEY = 'lm_cover_hist';
const cvAlbumKey = h => ((h.artist || '') + '|' + (h.album || h.name || '')).toLowerCase();
const cvHistSave = () => { try { localStorage.setItem(CV_HIST_KEY, JSON.stringify(CV.hist)); } catch (e) {} };
CV.hist = (() => { try { return JSON.parse(localStorage.getItem(CV_HIST_KEY) || '[]').filter(h => h && /^\/art\?\d+$/.test(h.url)); } catch (e) { return []; } })();
CV.histDirty = true;
function cvHistPush(entry) {
  CV.hist = [entry, ...CV.hist.filter(h => cvAlbumKey(h) !== cvAlbumKey(entry))].slice(0, 40);
  CV.histDirty = true; cvHistSave();
}
function cvHistDrop(url) {                        // una portada que el puente ya no tiene: fuera, sin rearmar todo
  CV.hist = CV.hist.filter(h => h.url !== url); cvHistSave();
  for (const i of document.querySelectorAll('.cv-shelf img, .cv-drift img')) if (i.getAttribute('src') === url) i.remove();
}
setInterval(() => {
  const url = ext.artUrl, st = ext.st;
  if (!url || !st.name || url === CV.lastHist) return;
  CV.lastHist = url;
  cvHistPush({ url, name: st.name, artist: st.artist || '', album: st.album || '' });
}, 1000);

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
  .cv-amb::after { content:''; position:absolute; inset:0; background:rgba(8,6,10,.32); }
  #cover[data-style=ambiente] { background:#07060a; } #cover[data-style=ambiente] .cv-amb { opacity:1; } #cover[data-style=ambiente] .coverbg { opacity:0; }
  #cover[data-style=minimo] { background:#050403; } #cover[data-style=minimo] .coverbg { opacity:0; }

  /* grano sutil sobre cualquier fondo: la misma textura de la bienvenida */
  .cv-grain { position:absolute; inset:-50%; pointer-events:none; opacity:.05; mix-blend-mode:overlay;
              background-image:url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='160' height='160'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.9' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='160' height='160' filter='url(%23n)'/%3E%3C/svg%3E");
              animation:grain 1.2s steps(6) infinite; }
  @media (prefers-reduced-motion: reduce) { .cv-grain { animation:none; } }

  /* difuminado: respira con un zoom lento y se enfoca hacia el centro */
  #cover[data-style=difuminado] .coverbg { animation:cvKen 30s ease-in-out infinite alternate; }
  @keyframes cvKen { from { transform:scale(1); } to { transform:scale(1.09) translate(-1%, 1%); } }
  #cover[data-style=difuminado]::after, #cover[data-style=minimo]::after {
    content:''; position:absolute; inset:0; pointer-events:none;
    background:radial-gradient(ellipse at 50% 42%, transparent 42%, rgba(5,4,3,.5) 100%);
  }
  #cover[data-style=minimo]::after { background:radial-gradient(circle at 50% 38%, var(--a1, rgba(244,201,131,.4)) 0%, transparent 58%), radial-gradient(ellipse at 50% 50%, transparent 48%, rgba(0,0,0,.4) 100%); opacity:.16; }
  @media (prefers-reduced-motion: reduce) { #cover[data-style=difuminado] .coverbg { animation:none; } }

  /* escena: un tinte de la paleta para cuando el escenario está quieto */
  #cover[data-style=escena]::before { content:''; position:absolute; inset:0; pointer-events:none; opacity:.22; mix-blend-mode:screen;
    background:radial-gradient(circle at 30% 25%, var(--a1, #6a4cff), transparent 55%), radial-gradient(circle at 75% 70%, var(--a2, #ff5a8a), transparent 55%); }

  .cv-main { position:relative; min-height:0; display:flex; align-items:center; justify-content:center; gap:clamp(30px,6vw,110px); padding:28px 32px 96px; }
  .cv-left { display:flex; flex-direction:column; align-items:center; gap:18px; min-width:0; }
  .cv-art { position:relative; width:var(--art); aspect-ratio:1; flex:none; transition:width .6s cubic-bezier(.2,.8,.2,1), translate .9s cubic-bezier(.2,.8,.2,1); }
  .cv-art #coverImg { position:absolute !important; inset:0; width:100% !important; height:100% !important; border-radius:14px; z-index:1; transform:none !important; box-shadow:0 40px 120px rgba(0,0,0,.6); }
  #cover[data-style=minimo] .cv-art #coverImg { border-radius:6px; }
  .cv-deck, .cv-armbox { position:absolute; inset:3%; translate:0 0; opacity:0; transition:translate .9s cubic-bezier(.2,.8,.2,1), opacity .5s; --deck:calc(var(--art) * .94); }
  .cv-armbox { z-index:3; pointer-events:none; }
  .cv-vinyl { position:absolute; inset:0; border-radius:50%;
              background:radial-gradient(circle, transparent 0 17%, #0c0c0c 17.5% 18.5%, transparent 19%), repeating-radial-gradient(circle, #1c1c1c 0 1px, #070707 1.5px 3.2px), #0a0a0a;
              box-shadow:0 30px 90px rgba(0,0,0,.7), 0 0 0 1px rgba(255,255,255,.05), inset 0 0 50px rgba(0,0,0,.55); }
  .cv-vinyl::after { content:''; position:absolute; inset:33%; border-radius:50%; background:var(--label) center/cover, #222; box-shadow:0 0 0 3px #111, 0 0 0 4px rgba(255,255,255,.06); }
  .cv-vinyl::before { content:''; position:absolute; inset:0; border-radius:50%;
    background:radial-gradient(circle at 28% 20%, rgba(255,255,255,.14), transparent 35%),
               conic-gradient(from 30deg, transparent 0 20%, rgba(255,255,255,.08) 25%, transparent 32% 70%, rgba(255,255,255,.06) 75%, transparent 82%); }
  .cv-vinyl.spin { animation:cvSpin 1.8s linear infinite; }
  @keyframes cvSpin { to { rotate:360deg; } }
  #cover[data-style=vinilo] :is(.cv-deck, .cv-armbox) { opacity:1; translate:44% 0; }
  #cover[data-style=vinilo] .cv-art { translate:-20% 0; }
  #cover[data-style=vinilo][data-lyr=completa] .cv-art { translate:0 0; }
  #cover[data-style=vinilo][data-lyr=completa] :is(.cv-deck, .cv-armbox) { translate:30% 0; }
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

  .cv-menu { position:absolute; right:0; bottom:calc(100% + 12px); width:372px; max-height:calc(100vh - 120px); overflow-y:auto; overscroll-behavior:contain;
             padding:18px 18px 14px; border-radius:20px; color:var(--paper);
             background:linear-gradient(180deg, rgba(28,22,17,.9), rgba(14,11,9,.94)); border:1px solid var(--rule); backdrop-filter:blur(28px) saturate(1.4);
             box-shadow:0 30px 80px rgba(0,0,0,.55); opacity:0; transform:translateY(8px) scale(.98); transform-origin:bottom right; pointer-events:none; transition:opacity .25s, transform .3s cubic-bezier(.2,.8,.2,1); }
  .cv-menu::-webkit-scrollbar { width:6px; } .cv-menu::-webkit-scrollbar-thumb { background:rgba(246,238,226,.15); border-radius:3px; }
  #cover.menu .cv-menu { opacity:1; transform:none; pointer-events:auto; }
  /* pestañas: cada grupo en su lugar, nada queda escondido bajo el pliegue */
  .cv-tabs { display:flex; gap:4px; margin:-4px -4px 16px; padding:4px; border-radius:13px; background:rgba(246,238,226,.05); border:1px solid var(--rule); }
  .cv-tabs button { flex:1; padding:9px 0 !important; border-radius:9px; font:400 10px 'Martian Mono',monospace !important; letter-spacing:.12em; text-transform:uppercase; color:var(--faint) !important; transition:background .2s, color .2s; }
  .cv-tabs button:hover { color:var(--paper) !important; }
  .cv-tabs button.on { background:rgba(246,238,226,.1); color:var(--paper) !important; box-shadow:inset 0 0 0 1px rgba(244,201,131,.3); }
  .cv-pane { display:none; min-height:var(--paneH, 0); }
  #cvMenu[data-tab=fondo] .cv-pane[data-pane=fondo], #cvMenu[data-tab=vista] .cv-pane[data-pane=vista] { display:block; animation:cvPane .25s cubic-bezier(.2,.8,.2,1); }
  @keyframes cvPane { from { opacity:0; transform:translateY(4px); } }
  .cv-pair { display:grid; grid-template-columns:1.45fr 1fr; gap:10px; margin-bottom:18px; }
  .cv-pair .cv-segs button { padding:8px 0; font-size:9.5px; letter-spacing:.04em; }
  .cv-desc { margin:14px 2px 0; min-height:2.7em; font:400 12px/1.35 'Anybody',sans-serif; color:var(--mute); }
  .cv-desc b { font-weight:600; color:var(--paper); }
  .cv-menu h5 { margin:0 0 10px; font:400 9.5px 'Martian Mono',monospace; letter-spacing:.18em; text-transform:uppercase; color:var(--faint); }
  .cv-menu section + section { margin-top:16px; padding-top:14px; border-top:1px solid var(--rule); }
  .cv-tiles { display:grid; grid-template-columns:repeat(4,1fr); gap:8px; }
  .cv-tiles button { display:flex; flex-direction:column; gap:6px; align-items:stretch; font:400 9.5px 'Martian Mono',monospace; letter-spacing:.04em; color:var(--faint); }
  .cv-tiles i { position:relative; display:block; aspect-ratio:4/3; border-radius:10px; overflow:hidden; border:1px solid rgba(255,255,255,.08); transition:box-shadow .2s, transform .2s; }
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
  /* efectos: la misma idea que los cuadros de fondo — un cuadro con ícono, ficha pareja, el aro va en el cuadro, no en todo el botón */
  .cv-chips { display:grid; grid-template-columns:repeat(4,1fr); gap:8px; }
  .cv-chip { display:flex; flex-direction:column; align-items:stretch; gap:6px; color:var(--faint); text-align:center; }
  .cv-chip i { display:grid; place-items:center; aspect-ratio:1.35; border-radius:10px; background:rgba(246,238,226,.05); border:1px solid rgba(255,255,255,.07); transition:background .2s, box-shadow .2s; }
  .cv-chip:hover i { background:rgba(246,238,226,.09); }
  .cv-chip svg { width:17px; height:17px; fill:none; stroke:currentColor; stroke-width:1.7; stroke-linecap:round; stroke-linejoin:round; }
  .cv-chip span { display:block; font:400 9px 'Martian Mono',monospace; letter-spacing:.02em; line-height:1.2; white-space:nowrap; overflow:hidden; text-overflow:ellipsis; }
  .cv-chip.on { color:var(--paper); }
  .cv-chip.on i { background:rgba(244,201,131,.1); box-shadow:0 0 0 1.5px var(--gold); }
  .cv-chip.on svg { stroke:var(--gold); }
  .cv-foot { display:flex; gap:8px; margin-top:16px; padding-top:14px; border-top:1px solid var(--rule); }
  .cv-foot button { flex:1; padding:9px 0; border-radius:10px; border:1px solid var(--rule); font:400 10px 'Martian Mono',monospace; letter-spacing:.1em; text-transform:uppercase; color:var(--mute); transition:all .2s; }
  .cv-foot button:hover { color:var(--paper); border-color:rgba(246,238,226,.3); }
  body.idle #cover { cursor:none; }

  /* escena: el video de lumora corre detrás, desenfocado */
  #cover[data-style=escena] { background:transparent; backdrop-filter:blur(26px) brightness(.55) saturate(1.25); -webkit-backdrop-filter:blur(26px) brightness(.55) saturate(1.25); }
  #cover[data-style=escena] .coverbg { opacity:0; }
  /* formatos que asoman detrás de la portada: vinilo, cassette y cd */
  .cv-cd, .cv-cass { position:absolute; opacity:0; translate:0 0; transition:translate .9s cubic-bezier(.2,.8,.2,1), opacity .5s; }
  .cv-cd { inset:4%; border-radius:50%; box-shadow:0 30px 90px rgba(0,0,0,.6), 0 0 0 1px rgba(255,255,255,.08);
           background:radial-gradient(circle, #0b0907 0 7%, rgba(255,255,255,.55) 7.5% 9%, rgba(210,210,220,.35) 9.5% 16%, transparent 16.5%),
                      conic-gradient(from 0deg, #d9dce4, #f7c6e0, #c4e7ff, #fff3b8, #c9ffd9, #d8c6ff, #ffd2c2, #d9dce4); }
  .cv-cd::before { content:''; position:absolute; inset:0; border-radius:50%; mix-blend-mode:screen; opacity:.7;
                   background:linear-gradient(115deg, transparent 28%, rgba(255,255,255,.4) 44%, transparent 58%); }
  .cv-cd::after { content:''; position:absolute; inset:0; border-radius:50%; background:repeating-radial-gradient(circle, rgba(255,255,255,.07) 0 1px, transparent 1px 4px); }
  .cv-cd.spin { animation:cvSpin 1.1s linear infinite; }
  #cover[data-style=cd] .cv-cd { opacity:1; translate:40% 0; }
  #cover[data-style=cd] .cv-art { translate:-18% 0; }
  .cv-cass { left:16%; right:16%; top:50%; aspect-ratio:1.58; margin-top:-30%; border-radius:11px;
             background:linear-gradient(165deg,#332c25,#1a1512 55%,#100d0a); box-shadow:0 30px 80px rgba(0,0,0,.6), inset 0 0 0 2px rgba(255,255,255,.06), inset 0 1px 0 rgba(255,255,255,.1); }
  .cv-cass::before { content:''; position:absolute; inset:0; border-radius:11px; pointer-events:none;
    background:radial-gradient(circle 2.4px at 9% 12%, rgba(255,255,255,.22), transparent 65%),
               radial-gradient(circle 2.4px at 91% 12%, rgba(255,255,255,.22), transparent 65%),
               radial-gradient(circle 2.4px at 9% 88%, rgba(255,255,255,.22), transparent 65%),
               radial-gradient(circle 2.4px at 91% 88%, rgba(255,255,255,.22), transparent 65%),
               linear-gradient(115deg, transparent 40%, rgba(255,255,255,.05) 50%, transparent 60%); }
  .cv-cass .lab { position:absolute; left:6%; right:6%; top:9%; height:34%; border-radius:5px; background:linear-gradient(180deg, var(--gold), #e2a860); opacity:.94;
                  box-shadow:0 1px 0 rgba(255,255,255,.4) inset, 0 -6px 10px rgba(0,0,0,.12) inset; }
  .cv-cass .lab::after { content:''; position:absolute; inset:32% 10% 14%; background-image:repeating-linear-gradient(180deg, rgba(40,26,8,.4) 0 2px, transparent 2px 10px); }
  .cv-cass .win { position:absolute; left:20%; right:20%; top:48%; height:28%; border-radius:26px; background:#0a0908; box-shadow:inset 0 0 0 2px rgba(255,255,255,.07), inset 0 3px 8px rgba(0,0,0,.6); }
  .cv-cass .reel { position:absolute; top:50%; width:21%; aspect-ratio:1; border-radius:50%; background:repeating-conic-gradient(#e9e4dc 0 10deg, #3a342f 10deg 60deg); box-shadow:0 0 0 5px #0a0908, 0 0 0 6px rgba(255,255,255,.05); }
  .cv-cass .reel::before { content:''; position:absolute; inset:40%; border-radius:50%; background:rgba(255,255,255,.28); }
  .cv-cass .reel::after { content:''; position:absolute; inset:44%; border-radius:50%; background:#0a0908; }
  .cv-cass .reel.l { left:22%; } .cv-cass .reel.r { right:22%; }
  .cv-cass.spin .reel { animation:cvSpin 2.4s linear infinite; }
  #cover[data-style=cassette] .cv-cass { opacity:1; translate:64% 0; }
  #cover[data-style=cassette] .cv-art { translate:-22% 0; }
  #cover[data-style=cd][data-lyr=completa] .cv-art, #cover[data-style=cassette][data-lyr=completa] .cv-art { translate:0 0; }
  /* la portada sigue la canción: brillo en el coro, apagada en lo triste, se parte en el drop */
  .cv-art #coverImg { filter:saturate(var(--sat,1)) brightness(var(--bri,1)); box-shadow:0 40px 120px rgba(0,0,0,.6), 0 0 var(--glowR,0px) var(--glowC,transparent); transition:filter .6s; }
  .cv-shards { position:absolute; inset:0; z-index:2; pointer-events:none; display:grid; grid-template-columns:repeat(4,1fr); grid-template-rows:repeat(4,1fr); }
  .cv-shards i { background-image:var(--artbg); background-size:400% 400%; animation:cvShard 1.25s cubic-bezier(.2,.8,.2,1) forwards; }
  @keyframes cvShard { 0% { transform:none; opacity:1; } 35% { transform:translate(var(--dx), var(--dy)) rotate(var(--r)) scale(.92); opacity:1; } 100% { transform:none; opacity:0; } }
  /* a continuación */
  .cv-next { position:absolute; right:28px; bottom:96px; display:flex; align-items:center; gap:12px; padding:10px 14px 10px 10px; border-radius:16px; z-index:3;
             background:rgba(16,12,10,.78); border:1px solid var(--rule); backdrop-filter:blur(20px); opacity:0; transform:translateY(10px); transition:opacity .6s, transform .6s cubic-bezier(.2,.8,.2,1); pointer-events:none; max-width:340px; }
  .cv-next.on { opacity:1; transform:none; }
  .cv-next img { width:48px; height:48px; border-radius:8px; object-fit:cover; background:rgba(246,238,226,.08); }
  .cv-next small { display:block; font:400 9.5px 'Martian Mono',monospace; letter-spacing:.16em; text-transform:uppercase; color:var(--gold); }
  .cv-next b { display:block; font:600 14px/1.2 'Anybody',sans-serif; color:var(--paper); white-space:nowrap; overflow:hidden; text-overflow:ellipsis; }
  .cv-next span { display:block; font-size:12px; color:var(--mute); white-space:nowrap; overflow:hidden; text-overflow:ellipsis; }
  /* me gusta y avisos */
  .cv-tools #cvLike svg { stroke-width:1.9; }
  .cv-tools #cvLike.on { color:#ff6b81; } .cv-tools #cvLike.on svg { fill:#ff6b81; stroke:#ff6b81; }
  .cv-tools #cvLike.pop { animation:cvPop .5s cubic-bezier(.2,.8,.2,1); } @keyframes cvPop { 40% { transform:scale(1.3); } }
  .cv-msg { position:absolute; left:50%; bottom:calc(100% + 12px); transform:translate(-50%,6px); padding:9px 14px; border-radius:11px; white-space:nowrap; background:rgba(20,16,12,.94);
            border:1px solid var(--rule); color:var(--paper); font:400 12.5px 'Anybody',sans-serif; opacity:0; transition:opacity .3s, transform .3s; pointer-events:none; }
  .cv-msg.on { opacity:1; transform:translate(-50%,0); }
  #cover.menu .cv-msg { opacity:0; }
  body.cover-open #hud { display:none !important; }
  /* interruptores con aire */
  .cv-tiles { grid-template-columns:repeat(3,1fr) !important; gap:12px 10px !important; }
  .cv-tiles i.t-escena { background:linear-gradient(135deg, #2b1f45, #0f2a3d 50%, #3d1f2c); } .cv-tiles i.t-escena::after { content:''; position:absolute; inset:0; background:radial-gradient(circle at 40% 45%, rgba(244,201,131,.55), transparent 45%); filter:blur(4px); }
  .cv-tiles i.t-cd { background:#1a1512; } .cv-tiles i.t-cd::before { content:''; position:absolute; left:36%; top:18%; width:58%; aspect-ratio:1; border-radius:50%; background:radial-gradient(circle, #1a1512 0 10%, transparent 11%), conic-gradient(#d9dce4, #f7c6e0, #c4e7ff, #fff3b8, #c9ffd9, #d9dce4); }
  .cv-tiles i.t-cd::after, .cv-tiles i.t-cassette::after { content:''; position:absolute; left:10%; top:18%; width:56%; aspect-ratio:1; border-radius:4px; background:var(--artbg) center/cover, #444; }
  .cv-tiles i.t-cassette { background:#1a1512; } .cv-tiles i.t-cassette::before { content:''; position:absolute; left:40%; top:30%; width:56%; height:38%; border-radius:4px; background:linear-gradient(180deg, var(--gold) 0 40%, #2a2521 40%); }
  .cv-tiles i.t-estanteria { background:#08060a; }
  .cv-tiles i.t-estanteria::before, .cv-tiles i.t-estanteria::after { content:''; position:absolute; bottom:14%; width:34%; aspect-ratio:1; border-radius:3px; background:var(--artbg) center/cover, #444; opacity:.6; box-shadow:0 4px 10px rgba(0,0,0,.5); }
  .cv-tiles i.t-estanteria::before { left:12%; } .cv-tiles i.t-estanteria::after { right:12%; }
  .cv-tiles i.t-artista { background:radial-gradient(circle at 30% 70%, rgba(255,255,255,.08), transparent 55%), #07060a; }
  .cv-tiles i.t-artista::before, .cv-tiles i.t-artista::after { content:''; position:absolute; width:34%; aspect-ratio:1; border-radius:4px; background:var(--artbg) center/cover, #444; opacity:.6; filter:blur(.4px); }
  .cv-tiles i.t-artista::before { left:14%; top:14%; } .cv-tiles i.t-artista::after { right:12%; bottom:16%; }
  @media (max-width:900px) { #cover[data-lyr=completa] .cv-main { flex-direction:column; } .cv-full { width:90vw; height:30vh; } .cv-prog span { display:none; } .cv-menu { width:min(372px, calc(100vw - 32px)); } }

  /* brazo y aguja: pivote fuera del disco, en reposo al costado; al sonar baja al surco de afuera
     y avanza hacia la etiqueta con el progreso real. En pausa se levanta sin moverse de su surco */
  .cv-arm { position:absolute; left:108%; top:5%; width:0; height:0; rotate:var(--armRot, 0deg);
            transition:rotate 1.4s cubic-bezier(.3,.7,.2,1); filter:drop-shadow(3px 6px 4px rgba(0,0,0,.55)); }
  .cv-arm i { position:absolute; left:0; top:0; }
  .cv-arm .plinth { width:calc(var(--deck) * .2); aspect-ratio:1; translate:-50% -50%; border-radius:50%;
                    background:radial-gradient(circle, #4a4744 0 22%, #1c1b1a 24% 58%, #2a2826 60% 64%, #121110 66%); box-shadow:0 0 0 1px rgba(255,255,255,.05); }
  .cv-arm .cw { width:calc(var(--deck) * .085); height:calc(var(--deck) * .11); translate:-50% calc(var(--deck) * -.17); border-radius:3px;
                background:linear-gradient(90deg, #3c3a37, #a9a397 45%, #5a5650); }
  .cv-arm .rod { width:max(2px, calc(var(--deck) * .009)); height:calc(var(--deck) * .61); translate:-50% calc(var(--deck) * -.06); border-radius:2px;
                 background:linear-gradient(90deg, #7d776c, #f1ece1 50%, #7d776c); }
  .cv-arm .head { width:calc(var(--deck) * .07); height:calc(var(--deck) * .11); translate:-50% calc(var(--deck) * .55); rotate:22deg; transform-origin:50% 0;
                  border-radius:2px 2px 4px 4px; background:linear-gradient(90deg, #111, #2c2c2c 50%, #111); transition:translate .5s cubic-bezier(.3,.7,.2,1); }
  .cv-arm .head::after { content:''; position:absolute; left:50%; bottom:-4px; width:2px; height:6px; margin-left:-1px; border-radius:1px; background:#e8e2d4; }
  .cv-arm.up { filter:drop-shadow(6px 12px 7px rgba(0,0,0,.45)); }
  .cv-arm.up .head { translate:-50% calc(var(--deck) * .55 - 4px); }
  .cv-armbox .post { position:absolute; left:108%; top:76%; width:calc(var(--deck) * .045); aspect-ratio:1; translate:-50% -50%; border-radius:50%;
                     background:radial-gradient(circle at 40% 35%, #5a5650, #151413 70%); box-shadow:0 3px 6px rgba(0,0,0,.5); }

  /* scratch: arrastra el disco/cassette que asoma para adelantar o atrasar */
  .cv-vinyl, .cv-cd, .cv-cass { cursor:grab; touch-action:none; }
  #cover:not([data-style=vinilo]) .cv-vinyl, #cover:not([data-style=cd]) .cv-cd, #cover:not([data-style=cassette]) .cv-cass { pointer-events:none; }
  .cv-vinyl.scratch, .cv-cd.scratch { cursor:grabbing; animation:none; rotate:var(--scratchRot, 0deg); }
  .cv-cass.scratch { cursor:grabbing; } .cv-cass.scratch .reel { animation:none; rotate:var(--scratchRot, 0deg); }
  .cv-scrub { position:absolute; left:50%; top:-14px; translate:-50% -100%; padding:6px 11px; border-radius:9px; z-index:4; pointer-events:none; white-space:nowrap;
              background:rgba(14,11,9,.88); border:1px solid var(--rule); font:400 11px 'Martian Mono',monospace; color:var(--gold); font-variant-numeric:tabular-nums;
              opacity:0; transition:opacity .2s; }
  .cv-scrub.on { opacity:1; }

  /* anillo de ritmo: un halo alrededor de la portada que late con el golpe, con o sin latido activado */
  /* sin transición en la opacidad: cualquier suavizado llega tarde al golpe */
  .cv-ring { position:absolute; inset:-4.5%; border-radius:22px; pointer-events:none; display:none;
             box-shadow:0 0 0 1.5px rgba(255,255,255,.45), 0 0 46px 6px var(--glowC, rgba(255,190,120,.6));
             opacity:calc(.22 + var(--pulse, 0) * .78); scale:calc(1 + var(--pulse, 0) * .03); }
  #cover[data-ring="1"] .cv-ring { display:block; }
  #cover[data-style=minimo] .cv-ring { border-radius:12px; }

  /* holograma: foil arcoíris y un brillo; con 3D activo siguen al cursor como una carta de verdad */
  .cv-holo { position:absolute; inset:0; border-radius:14px; pointer-events:none; opacity:0; z-index:2; transition:opacity .35s; mix-blend-mode:color-dodge;
             background:linear-gradient(115deg, transparent 20%, rgba(255,110,190,.5) 32%, rgba(255,230,110,.5) 40%, rgba(100,255,220,.5) 48%, rgba(150,120,255,.5) 56%, transparent 70%);
             background-size:280% 280%; }
  .cv-holo::after { content:''; position:absolute; inset:0; border-radius:inherit; mix-blend-mode:soft-light;
                    background:radial-gradient(circle at calc(var(--mx, .3) * 100%) calc(var(--my, .25) * 100%), rgba(255,255,255,.7), transparent 45%); }
  #cover[data-holo="1"] .cv-holo { opacity:.42; animation:cvHoloShift 8s ease-in-out infinite; }
  #cover[data-holo="1"][data-depth="1"] .cv-holo { animation:none; background-position:calc(var(--mx, .5) * 100%) calc(var(--my, .5) * 100%); }
  #cover[data-style=minimo] .cv-holo { border-radius:6px; }
  @keyframes cvHoloShift { 0%, 100% { background-position:0% 20%; } 50% { background-position:100% 90%; } }

  /* profundidad 3D: la portada se inclina con el cursor y cada capa se separa un poco (paralaje).
     El latido va en "scale", aparte: así el suavizado del giro nunca lo retrasa */
  .cv-art { transform:perspective(1100px) rotateX(var(--tiltY, 0deg)) rotateY(var(--tiltX, 0deg)); }
  #cover[data-beat="1"] .cv-art { scale:calc(1 + var(--beat, 0) * .012); }
  #cover[data-depth="1"] .cv-art { transition:width .6s cubic-bezier(.2,.8,.2,1), translate .9s cubic-bezier(.2,.8,.2,1), transform .15s ease-out; }
  #cover[data-depth="1"] :is(.cv-deck, .cv-cass) { transform:translate(calc(var(--px, 0) * -14px), calc(var(--py, 0) * -10px)); }
  #cover[data-depth="1"] :is(.cv-holo, .cv-armbox) { transform:translate(calc(var(--px, 0) * 5px), calc(var(--py, 0) * 4px)); }
  #cover[data-depth="1"] .cv-art #coverImg { box-shadow:calc(var(--px, 0) * -24px) calc(40px + var(--py, 0) * -18px) 120px rgba(0,0,0,.62), 0 0 var(--glowR, 0px) var(--glowC, transparent); }

  /* estantería: el historial de portadas escuchadas, desfilando abajo */
  #cover[data-style=estanteria] { background:#08060a; } #cover[data-style=estanteria] .coverbg { opacity:0; }
  .cv-shelf { position:absolute; left:0; right:0; bottom:9%; height:13vmin; opacity:0; overflow:hidden; pointer-events:none;
              -webkit-mask-image:linear-gradient(90deg, transparent, #000 14%, #000 86%, transparent); mask-image:linear-gradient(90deg, transparent, #000 14%, #000 86%, transparent); }
  #cover[data-style=estanteria] .cv-shelf { opacity:1; }
  .cv-shelf .row { display:flex; gap:14px; width:max-content; animation:cvShelf 46s linear infinite; }
  .cv-shelf img { width:13vmin; height:13vmin; border-radius:9px; object-fit:cover; opacity:.5; filter:saturate(.75) brightness(.65); box-shadow:0 14px 30px rgba(0,0,0,.55); background:#15110e; }
  .cv-shelf .empty { position:absolute; inset:0; display:grid; place-items:center; font:400 10px 'Martian Mono',monospace; letter-spacing:.2em; text-transform:uppercase; color:var(--faint); }
  @keyframes cvShelf { from { transform:translateX(0); } to { transform:translateX(-50%); } }

  /* portadas del artista, flotando despacio detrás de todo */
  #cover[data-style=artista] { background:#07060a; } #cover[data-style=artista] .coverbg { opacity:0; }
  .cv-drift { position:absolute; inset:0; overflow:hidden; opacity:0; pointer-events:none; }
  #cover[data-style=artista] .cv-drift { opacity:1; }
  .cv-drift img { position:absolute; bottom:-20vmin; border-radius:10px; object-fit:cover; aspect-ratio:1; opacity:0; filter:blur(1px) saturate(.85) brightness(.6);
                  box-shadow:0 20px 60px rgba(0,0,0,.5); animation:cvFloat var(--dur, 26s) ease-in-out infinite; animation-delay:var(--delay, 0s); }
  @keyframes cvFloat { 0% { opacity:0; transform:translateY(0) scale(.92); } 12% { opacity:.5; } 88% { opacity:.45; } 100% { opacity:0; transform:translateY(-120vh) scale(1.05); } }
  @media (prefers-reduced-motion: reduce) { .cv-shelf .row, .cv-drift img { animation:none; } }

  /* póster: se ve antes de guardarse */
  .cv-poster { position:absolute; inset:0; z-index:8; display:none; place-items:center; background:rgba(5,4,3,.76); backdrop-filter:blur(16px); -webkit-backdrop-filter:blur(16px); }
  .cv-poster.on { display:grid; animation:cvPane .3s cubic-bezier(.2,.8,.2,1); }
  .cv-poster figure { margin:0; display:flex; flex-direction:column; align-items:center; gap:18px; pointer-events:none; }
  .cv-poster img { display:block; height:min(76vh, 860px); aspect-ratio:4/5; border-radius:4px; background:#0a0806; box-shadow:0 50px 140px rgba(0,0,0,.75); pointer-events:auto; }
  .cv-poster figcaption { display:flex; gap:8px; pointer-events:auto; }
  .cv-poster button { padding:11px 20px; border-radius:11px; border:1px solid var(--rule); background:rgba(20,16,12,.7); cursor:pointer;
                      font:400 10px 'Martian Mono',monospace; letter-spacing:.12em; text-transform:uppercase; color:var(--mute); transition:color .2s, border-color .2s; }
  .cv-poster button:hover { color:var(--paper); border-color:rgba(246,238,226,.3); }
  .cv-poster button.main { background:linear-gradient(180deg,#fbe2b8,var(--gold)); color:#1a1109; border-color:transparent; }
  /* de qué trata: el resumen que la IA hizo de este momento de la canción */
  .cv-trata { position:absolute; top:26px; right:32px; max-width:min(38vw,420px); text-align:right; display:none; transition:opacity .4s; }
  .cv-trata.empty { opacity:0; }
  #cover[data-trata="1"] .cv-trata { display:block; }
  .cv-trata span { display:block; font:400 9.5px 'Martian Mono',monospace; letter-spacing:.2em; text-transform:uppercase; color:var(--faint); margin-bottom:6px; }
  .cv-trata b { display:block; font:italic 300 clamp(15px,1.6vw,19px)/1.35 'Cormorant Garamond',serif; color:#ffe2b0; transition:opacity .35s; }
  @media (max-width:900px) { .cv-trata { left:32px; right:32px; text-align:left; max-width:none; } }
`; document.head.appendChild(st); }

// ---------- estructura ----------
const cvIco = d => `<svg viewBox="0 0 24 24"><path d="${d}"/></svg>`;
const cvSeg = k => `<div class="cv-seg">${CV_OPTS[k].map(([v, t]) => `<button data-${k}="${v}">${t}</button>`).join('')}</div>`;
{
  const cover = $('cover'), img = $('coverImg'), meta = cover.querySelector('.covermeta');
  const amb = document.createElement('div'); amb.className = 'cv-amb'; amb.innerHTML = '<i></i><i></i><i></i>'; cover.insertBefore(amb, cover.children[1]);
  const grain = document.createElement('div'); grain.className = 'cv-grain'; cover.insertBefore(grain, cover.children[2]);
  const main = document.createElement('div'); main.className = 'cv-main';
  const left = document.createElement('div'); left.className = 'cv-left';
  const art = document.createElement('div'); art.className = 'cv-art';
  const vinyl = document.createElement('div'); vinyl.className = 'cv-vinyl';
  const cd = document.createElement('div'); cd.className = 'cv-cd';
  const cass = document.createElement('div'); cass.className = 'cv-cass'; cass.innerHTML = '<i class="lab"></i><i class="win"></i><i class="reel l"></i><i class="reel r"></i>';
  const deck = document.createElement('div'); deck.className = 'cv-deck'; deck.appendChild(vinyl);
  const armbox = document.createElement('div'); armbox.className = 'cv-armbox';
  armbox.innerHTML = '<i class="post"></i><div class="cv-arm"><i class="cw"></i><i class="rod"></i><i class="head"></i><i class="plinth"></i></div>';
  const holo = document.createElement('div'); holo.className = 'cv-holo';
  const ring = document.createElement('div'); ring.className = 'cv-ring';
  const scrub = document.createElement('div'); scrub.className = 'cv-scrub'; scrub.id = 'cvScrub';
  art.append(deck, cd, cass, img, holo, ring, armbox, scrub);
  const line = document.createElement('div'); line.className = 'cv-line'; line.innerHTML = '<b id="cvLine"></b><span id="cvTr"></span>';
  left.append(art, meta, line);
  const full = document.createElement('div'); full.className = 'cv-full'; full.innerHTML = '<div class="cv-list" id="cvList"></div>';
  main.append(left, full);
  const shelf = document.createElement('div'); shelf.className = 'cv-shelf'; shelf.id = 'cvShelf';
  const drift = document.createElement('div'); drift.className = 'cv-drift'; drift.id = 'cvDrift';
  const trata = document.createElement('div'); trata.className = 'cv-trata'; trata.innerHTML = '<span>de qué trata</span><b id="cvTrataTx"></b>';
  const clock = document.createElement('div'); clock.className = 'cv-clock'; clock.innerHTML = '<b id="cvClock"></b><span id="cvDate"></span>';
  const float = document.createElement('div'); float.className = 'cv-float';
  const tile = v => `<button data-style="${v[0]}"><i class="t-${v[0]}"></i>${v[1]}</button>`;
  const segs = k => `<div class="cv-segs">${CV_OPTS[k].map(([v, t]) => `<button data-${k}="${v}">${t}</button>`).join('')}</div>`;
  const chip = (id, t, hint, svg) => `<button class="cv-chip" id="${id}" data-hint="${cvEsc(hint)}"><i><svg viewBox="0 0 24 24">${svg}</svg></i><span>${t}</span></button>`;
  const CV_CHIPS = [
    ['cvBeat', 'latido', 'la portada late con el ritmo', '<path d="M2 12h4l2-7 3 14 3-10 2 3h6"/>'],
    ['cvClockBtn', 'reloj', 'la hora en pantalla', '<circle cx="12" cy="12" r="8"/><path d="M12 8v4l3 2"/>'],
    ['cvReact', 'sigue', 'la portada sigue la canción: brilla en el coro, se apaga en lo triste, se parte en el drop', '<path d="M4 16V8M8 18V6M12 20V4M16 18V6M20 16V8"/>'],
    ['cvRing', 'anillo', 'un halo alrededor de la portada late con el golpe', '<circle cx="12" cy="12" r="8.5" opacity=".5"/><circle cx="12" cy="12" r="4"/>'],
    ['cvHolo', 'holograma', 'una veta de luz cruza la portada como una carta con foil', '<path d="M12 3l1.8 6.2L20 11l-6.2 1.8L12 19l-1.8-6.2L4 11l6.2-1.8z"/>'],
    ['cvDepth', '3D', 'profundidad: la portada se inclina con el cursor, en capas', '<path d="M12 4l8 4.5-8 4.5-8-4.5z"/><path d="M4 13.5l8 4.5 8-4.5"/>'],
    ['cvTrataBtn', 'trata', 'de qué trata: un resumen de esta parte de la canción, verso a verso', '<path d="M4 5h16v10H10l-3.5 3.5V15H4z"/>'],
    ['cvPin', 'fijar', 'fijar la barra: que no se oculte al quedarse quieto', '<path d="M9 3h6l-.6 6.2L19 13v2h-6v5l-1 2-1-2v-5H5v-2l4.6-3.8z"/>'],
  ];
  float.innerHTML = `<div class="cv-menu" id="cvMenu" data-tab="fondo">
      <nav class="cv-tabs"><button data-tab="fondo">fondo</button><button data-tab="vista">portada y efectos</button></nav>
      <div class="cv-pane" data-pane="fondo"><div class="cv-tiles">${CV_OPTS.style.map(tile).join('')}</div><p class="cv-desc" id="cvDescFondo"></p></div>
      <div class="cv-pane" data-pane="vista"><div class="cv-pair"><div><h5>letra</h5>${segs('lyr')}</div><div><h5>portada</h5>${segs('size')}</div></div>
        <h5>efectos</h5><div class="cv-chips">${CV_CHIPS.map(c => chip(...c)).join('')}</div><p class="cv-desc" id="cvDescVista"></p></div>
      <div class="cv-foot"><button id="cvPoster">póster del verso</button><button id="cvFs">pantalla completa</button></div>
    </div>
    <div class="cv-player">
      <div class="cv-ctl"><button data-c="prev" title="anterior">${cvIco('M6 5h2v14H6zM20 5v14L9 12z')}</button>
        <button data-c="playpause" class="big" title="reproducir / pausa (espacio)" id="cvPP">${cvIco('M7 5h4v14H7zM13 5h4v14h-4z')}</button>
        <button data-c="next" title="siguiente">${cvIco('M16 5h2v14h-2zM4 5v14l11-7z')}</button></div>
      <div class="cv-prog"><span id="cvT0">0:00</span><div class="cv-bar" id="cvBar"><i id="cvFill"></i></div><span id="cvT1">0:00</span></div>
      <div class="cv-tools"><button id="cvLike" title="me gusta"><svg viewBox="0 0 24 24"><path d="M12 20s-7-4.4-9.2-8.6C1.3 8.5 3 5 6.4 5c2 0 3.3 1.1 4 2.3h3.2C14.3 6.1 15.6 5 17.6 5 21 5 22.7 8.5 21.2 11.4 19 15.6 12 20 12 20z" stroke-linejoin="round"/></svg></button><button id="cvMenuBtn" title="opciones"><svg viewBox="0 0 24 24"><path d="M4 7h10M18 7h2M4 17h4M12 17h8"/><circle cx="16" cy="7" r="2"/><circle cx="10" cy="17" r="2"/></svg></button>
        <button id="cvBack" title="volver al video (esc)"><svg viewBox="0 0 24 24"><path d="M6 6l12 12M18 6 6 18"/></svg></button></div>
    </div>`;
  const next = document.createElement('div'); next.className = 'cv-next'; next.innerHTML = '<img id="cvNextArt" alt=""><div style="min-width:0"><small>a continuación</small><b id="cvNextName"></b><span id="cvNextArtist"></span></div>';
  const msg = document.createElement('div'); msg.className = 'cv-msg'; msg.id = 'cvMsg'; float.appendChild(msg);
  const poster = document.createElement('div'); poster.className = 'cv-poster'; poster.id = 'cvPosterBox';
  poster.innerHTML = '<figure><img id="cvPosterImg" alt="póster del verso"><figcaption><button id="cvPosterAgain">otra versión</button><button id="cvPosterSave" class="main">guardar</button><button id="cvPosterClose">cerrar</button></figcaption></figure>';
  cover.append(shelf, drift, main, float, clock, trata, next, poster);
  // nada dentro de la carátula la cierra por accidente: todo pasa por aquí
  cover.addEventListener('click', e => {
    e.stopImmediatePropagation();
    const bar = e.target.closest('#cvBar');
    if (bar) { const r = bar.getBoundingClientRect(); return ext.cmd('goto:' + (clamp((e.clientX - r.left) / r.width) * (ext.st.dur || 0)).toFixed(2)); }
    const p = e.target.closest('[data-t]'); if (p) return ext.cmd('goto:' + Math.max(0, +p.dataset.t - .15).toFixed(2));
    const b = e.target.closest('button');
    if (!b && e.target.id === 'cvPosterBox') return cvPosterClose();
    if (!b) { if (!e.target.closest('.cv-menu')) { cover.classList.remove('menu'); $('cvMenuBtn').classList.remove('on'); } return; }
    if (b.id === 'cvMenuBtn') { cover.classList.toggle('menu'); b.classList.toggle('on', cover.classList.contains('menu')); if (cover.classList.contains('menu')) { cvPaneH(); cvDesc(); } return; }
    if (b.dataset.tab) { CV.tab = b.dataset.tab; cvSave(); return cvPaint(); }
    if (b.dataset.c) return ext.cmd(b.dataset.c);
    for (const k of Object.keys(CV_OPTS)) if (b.dataset[k]) {
      CV[k] = b.dataset[k];
      cvSave(); CV.cur = -2; return cvPaint();
    }
    if (b.id === 'cvBeat') { CV.beat = !CV.beat; cvSave(); return cvPaint(); }
    if (b.id === 'cvClockBtn') { CV.clock = !CV.clock; cvSave(); return cvPaint(); }
    if (b.id === 'cvPin') { CV.pin = !CV.pin; cvSave(); return cvPaint(); }
    if (b.id === 'cvReact') { CV.react = !CV.react; cvSave(); return cvPaint(); }
    if (b.id === 'cvRing') { CV.ring = !CV.ring; cvSave(); return cvPaint(); }
    if (b.id === 'cvHolo') { CV.holo = !CV.holo; cvSave(); return cvPaint(); }
    if (b.id === 'cvDepth') { CV.depth = !CV.depth; cvSave(); if (!CV.depth) resetTilt(); return cvPaint(); }
    if (b.id === 'cvTrataBtn') { CV.trata = !CV.trata; cvSave(); return cvPaint(); }
    if (b.id === 'cvLike') return cvLike();
    if (b.id === 'cvPoster') return cvMakePoster();
    if (b.id === 'cvPosterAgain') { CVP.seed++; return cvPosterRender(); }
    if (b.id === 'cvPosterSave') return cvPosterSave();
    if (b.id === 'cvPosterClose') return cvPosterClose();
    if (b.id === 'cvFs') return document.fullscreenElement ? document.exitFullscreen() : document.documentElement.requestFullscreen?.();
    if (b.id === 'cvBack') { cover.classList.remove('menu'); $('cvMenuBtn').classList.remove('on'); return toggleCover(false); }
  }, true);

  const menuEl = float.querySelector('.cv-menu');
  menuEl.addEventListener('mouseover', e => { const o = e.target.closest('[data-style], [data-lyr], [data-size], [data-hint]'); cvDesc(menuEl.contains(o) ? o : null); });
  menuEl.addEventListener('mouseleave', () => cvDesc());

  // profundidad 3D: el lado bajo el cursor se hunde (en los dos ejes igual) y las capas se separan.
  // Con holograma, el brillo también sigue al cursor
  const setVars = o => { for (const k in o) art.style.setProperty(k, o[k]); };
  function resetTilt() { setVars({ '--tiltX': '0deg', '--tiltY': '0deg', '--px': 0, '--py': 0 }); }
  cover.addEventListener('mousemove', e => {
    if (!CV.depth && !CV.holo) return;
    const r = art.getBoundingClientRect();
    const px = clamp((e.clientX - (r.left + r.width / 2)) / (r.width / 2), -1, 1), py = clamp((e.clientY - (r.top + r.height / 2)) / (r.height / 2), -1, 1);
    setVars({ '--mx': ((px + 1) / 2).toFixed(3), '--my': ((py + 1) / 2).toFixed(3) });
    if (CV.depth) setVars({ '--px': px.toFixed(3), '--py': py.toFixed(3), '--tiltX': (px * 9).toFixed(2) + 'deg', '--tiltY': (-py * 9).toFixed(2) + 'deg' });
  });
  cover.addEventListener('mouseleave', resetTilt);

  // scratch: arrastra el vinilo o el cd en círculo, o el cassette de lado, para adelantar o atrasar.
  // El disco sigue a la mano desde el ángulo en que iba, y al soltar retoma el giro desde ahí
  const fmt = s => Math.floor(s / 60) + ':' + String(Math.floor(s % 60)).padStart(2, '0');
  function cvScratch(el, linear) {
    const spinners = () => linear ? [...el.querySelectorAll('.reel')] : [el];
    let on = false, moved = false, last = 0, total = 0, base = 0, period = 1.8, startPos = 0;
    const angleAt = e => { const r = el.getBoundingClientRect(); return Math.atan2(e.clientY - (r.top + r.height / 2), e.clientX - (r.left + r.width / 2)) * 180 / Math.PI; };
    const target = () => clamp(startPos + total * .06, 0, ext.st.dur || 0);             // una vuelta entera ≈ 22 s
    el.addEventListener('pointerdown', e => {
      if (!ext.has() || e.button !== 0) return;
      const cs = getComputedStyle(spinners()[0]);
      base = parseFloat(cs.rotate) || 0; period = parseFloat(cs.animationDuration) || period;
      on = true; moved = false; total = 0; startPos = ext.now(); last = linear ? e.clientX : angleAt(e);
      el.setPointerCapture(e.pointerId);
      el.style.setProperty('--scratchRot', base + 'deg'); el.classList.add('scratch');
    });
    el.addEventListener('pointermove', e => {
      if (!on) return;
      let d;
      if (linear) { d = (e.clientX - last) * 1.2; last = e.clientX; }
      else { const a = angleAt(e); d = a - last; if (d > 180) d -= 360; if (d < -180) d += 360; last = a; }
      total += d;
      if (!moved && Math.abs(total) < 4) return;                                        // un clic no es un scratch
      moved = true; CV.scrub = target();
      el.style.setProperty('--scratchRot', (base + total).toFixed(1) + 'deg');
      scrub.textContent = (total >= 0 ? '→ ' : '← ') + fmt(CV.scrub); scrub.classList.add('on');
    });
    const end = () => {
      if (!on) return;
      on = false; el.classList.remove('scratch'); el.style.removeProperty('--scratchRot'); scrub.classList.remove('on');
      const ang = ((base + total) % 360 + 360) % 360;
      for (const s of spinners()) { s.style.rotate = ang + 'deg'; s.style.animationDelay = -(ang / 360) * period + 's'; }
      if (moved) ext.cmd('goto:' + target().toFixed(2));
      setTimeout(() => { CV.scrub = null; }, 500);                                      // hasta que el reproductor confirme la nueva posición
    };
    el.addEventListener('pointerup', end); el.addEventListener('pointercancel', end);
  }
  cvScratch(vinyl); cvScratch(cd); cvScratch(cass, true);
}

// ---------- estado ----------
function cvPaint() {
  const cover = $('cover'), hasLyr = mode === 'proc' && IN.lines.some(l => l.text);
  CV.hasLyr = hasLyr;
  cover.dataset.style = CV.style; cover.dataset.size = CV.size; cover.dataset.lyr = hasLyr ? CV.lyr : 'no';
  cover.dataset.beat = CV.beat ? '1' : '0'; cover.dataset.clock = CV.clock ? '1' : '0'; cover.dataset.pin = CV.pin ? '1' : '0';
  cover.dataset.ring = CV.ring ? '1' : '0'; cover.dataset.holo = CV.holo ? '1' : '0'; cover.dataset.depth = CV.depth ? '1' : '0'; cover.dataset.trata = CV.trata ? '1' : '0';
  for (const k of Object.keys(CV_OPTS)) for (const b of cover.querySelectorAll(`[data-${k}]`)) b.classList.toggle('on', b.dataset[k] === CV[k]);
  $('cvBeat').classList.toggle('on', CV.beat); $('cvClockBtn').classList.toggle('on', CV.clock); $('cvPin').classList.toggle('on', CV.pin); $('cvReact').classList.toggle('on', CV.react);
  const menu = $('cvMenu'); menu.dataset.tab = CV.tab; menu.querySelectorAll('[data-tab]').forEach(t => t.classList.toggle('on', t.dataset.tab === CV.tab));
  $('cvRing').classList.toggle('on', CV.ring); $('cvHolo').classList.toggle('on', CV.holo); $('cvDepth').classList.toggle('on', CV.depth); $('cvTrataBtn').classList.toggle('on', CV.trata);
  const url = ext.artUrl || '';
  if (!url) CV.art = '';
  // la paleta solo con la imagen de ESTA canción: si artImg todavía es la anterior, se espera al siguiente repaso
  else if (url !== CV.art && typeof artImg !== 'undefined' && artImg?.complete && artImg.src.endsWith(url)) {
    CV.art = url;
    const pal = paletteFrom(artImg, 7) || [];
    cover.querySelectorAll('.cv-amb i').forEach((el, i) => { const p = pal[i % pal.length] || { h: 30, s: 60, l: 50 }; el.style.background = `hsl(${p.h} ${Math.max(p.s, 62)}% ${Math.min(Math.max(p.l, 40), 62)}%)`; });
    cover.querySelector('.cv-vinyl').style.setProperty('--label', `url("${url}")`);
    const m = $('cvMenu'); m.style.setProperty('--artbg', `url("${url}")`);
    pal.slice(0, 3).forEach((p, i) => {
      const v = `hsl(${p.h} ${Math.max(p.s, 55)}% ${Math.min(Math.max(p.l, 40), 60)}%)`;
      m.style.setProperty('--a' + (i + 1), v); cover.style.setProperty('--a' + (i + 1), v);
    });
    const g = pal[0]; cover.querySelector('.cv-art').style.setProperty('--glowC', g ? `hsla(${g.h} ${Math.max(g.s, 60)}% 60% / .55)` : 'rgba(255,190,120,.5)');
  }
  cvDesc();
  if (CV.style === 'estanteria' || CV.style === 'artista') cvBuildGallery();
}
// estantería (historial) y portadas del artista flotando: se arman con lo ya escuchado, sin backend nuevo
function cvBuildGallery() {
  const cur = ext.artUrl || '';
  if (!CV.histDirty && CV.galleryFor === cur) return;
  CV.histDirty = false; CV.galleryFor = cur;
  const me = { artist: ext.st.artist, album: ext.st.album, name: ext.st.name };
  const items = CV.hist.filter(h => h.url !== cur && cvAlbumKey(h) !== cvAlbumKey(me));
  const tag = h => `<img src="${cvEsc(h.url)}" alt="">`;
  // estantería: el último disco primero; con pocos se repiten para que la fila no quede corta
  let row = items.slice(0, 16);
  while (row.length && row.length < 10) row = row.concat(items.slice(0, 10 - row.length));
  $('cvShelf').innerHTML = row.length ? `<div class="row">${row.map(tag).join('')}${row.map(tag).join('')}</div>` : '<div class="empty">la estantería se llena con lo que escuches</div>';
  // artista: sus otros discos; si todavía no hay, los de siempre; y si no hay nada, la portada actual
  const firstName = a => (a || '').split(/,|&| feat\.?| ft\.?/i)[0].trim().toLowerCase();
  let pool = items.filter(h => firstName(h.artist) && firstName(h.artist) === firstName(me.artist));
  if (pool.length < 3) pool = pool.concat(items.filter(h => !pool.includes(h)));
  if (!pool.length && cur) pool = [{ url: cur }];
  const drift = [];
  for (let i = 0; i < 9 && pool.length; i++) drift.push(pool[i % pool.length]);
  $('cvDrift').innerHTML = drift.map((h, i) => {
    const left = (i / drift.length * 88 + Math.random() * 6).toFixed(1), w = (9 + Math.random() * 8).toFixed(1);   // repartidas a lo ancho, sin amontonarse
    const dur = (24 + Math.random() * 14).toFixed(1), delay = (-Math.random() * dur).toFixed(1);
    return `<img src="${cvEsc(h.url)}" alt="" style="left:${left}%; width:${w}vmin; --dur:${dur}s; --delay:${delay}s;">`;
  }).join('');
  for (const i of document.querySelectorAll('.cv-shelf img, .cv-drift img')) i.onerror = () => cvHistDrop(i.getAttribute('src'));
}
// póster del verso: una imagen descargable con la línea actual
function cvLines(ctx, text, maxW) {
  const lines = []; let cur = '';
  for (const w of String(text || '').split(/\s+/)) { const t = cur ? cur + ' ' + w : w; if (cur && ctx.measureText(t).width > maxW) { lines.push(cur); cur = w; } else cur = t; }
  if (cur) lines.push(cur);
  return lines;
}
// póster del verso: una pieza, no una captura. Fondo con la portada desenfocada y grano de papel,
// la portada como polaroid pegada con cinta, el título escrito a mano en su margen, el verso en tinta
// (cada línea con su pulso), subrayado de marcador, la traducción como nota y un sello con la fecha.
// Se ve antes de guardar; "otra versión" lo vuelve a trazar con otra mano.
const cvRand = seed => () => { seed = seed + 0x6D2B79F5 | 0; let t = Math.imul(seed ^ seed >>> 15, 1 | seed); t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296; };
let cvNoiseC = null;
function cvNoise() {
  if (cvNoiseC) return cvNoiseC;
  cvNoiseC = document.createElement('canvas'); cvNoiseC.width = cvNoiseC.height = 180;
  const g = cvNoiseC.getContext('2d'), d = g.createImageData(180, 180);
  for (let i = 0; i < d.data.length; i += 4) { const v = Math.random() * 255; d.data[i] = d.data[i + 1] = d.data[i + 2] = v; d.data[i + 3] = 34; }
  g.putImageData(d, 0, 0);
  return cvNoiseC;
}
function cvScribble(x, R, x0, x1, y, color, w) {                 // un trazo de marcador: nunca recto, nunca igual
  x.strokeStyle = color; x.lineWidth = w; x.lineCap = 'round'; x.lineJoin = 'round';
  x.beginPath(); x.moveTo(x0, y + (R() - .5) * 4);
  const n = 7, seg = (x1 - x0) / n;
  for (let i = 1; i <= n; i++) x.quadraticCurveTo(x0 + seg * (i - .5), y + (R() - .5) * 11, x0 + seg * i, y + (R() - .5) * 5);
  x.stroke();
}
function cvPosterDraw(d, seed) {
  const R = cvRand(seed), W = 1080, H = 1350, c = document.createElement('canvas'); c.width = W; c.height = H;
  const x = c.getContext('2d'), art = d.art, deg = a => a * Math.PI / 180;
  const p0 = d.pal?.[0], accent = p0 ? `hsl(${p0.h} ${Math.max(p0.s, 60)}% 66%)` : '#f4c983';
  // 1. fondo: la portada reducida a casi nada y vuelta a ampliar = desenfoque profundo en cualquier navegador
  x.fillStyle = '#0a0806'; x.fillRect(0, 0, W, H);
  if (art) {
    const t = document.createElement('canvas'); t.width = t.height = 14; t.getContext('2d').drawImage(art, 0, 0, 14, 14);
    x.imageSmoothingQuality = 'high'; x.globalAlpha = .7; x.drawImage(t, -H * .12, -H * .06, H * 1.24, H * 1.24); x.globalAlpha = 1;
  }
  let g = x.createLinearGradient(0, 0, 0, H);
  g.addColorStop(0, 'rgba(10,8,6,.30)'); g.addColorStop(.5, 'rgba(10,8,6,.62)'); g.addColorStop(1, 'rgba(10,8,6,.94)');
  x.fillStyle = g; x.fillRect(0, 0, W, H);
  g = x.createRadialGradient(W / 2, H * .42, H * .25, W / 2, H * .5, H * .8);
  g.addColorStop(0, 'rgba(0,0,0,0)'); g.addColorStop(1, 'rgba(0,0,0,.55)');
  x.fillStyle = g; x.fillRect(0, 0, W, H);
  // 2. la polaroid, pegada con cinta y un poco torcida
  const PW = 600, PH = 690, PX = W / 2 + (R() - .5) * 30, PY = 96 + PH / 2, PA = deg((R() - .5) * 7);
  x.save(); x.translate(PX, PY); x.rotate(PA);
  x.shadowColor = 'rgba(0,0,0,.6)'; x.shadowBlur = 60; x.shadowOffsetY = 28;
  x.fillStyle = '#ede4d3'; x.fillRect(-PW / 2, -PH / 2, PW, PH);
  x.shadowColor = 'transparent';
  g = x.createLinearGradient(-PW / 2, -PH / 2, PW / 2, PH / 2); g.addColorStop(0, 'rgba(255,255,255,.35)'); g.addColorStop(1, 'rgba(120,95,60,.18)');
  x.fillStyle = g; x.fillRect(-PW / 2, -PH / 2, PW, PH);
  x.globalAlpha = .5; x.fillStyle = x.createPattern(cvNoise(), 'repeat'); x.fillRect(-PW / 2, -PH / 2, PW, PH); x.globalAlpha = 1;
  const S = 548, SX = -S / 2, SY = -PH / 2 + 26;
  if (art) x.drawImage(art, SX, SY, S, S); else { x.fillStyle = '#1a1510'; x.fillRect(SX, SY, S, S); }
  x.strokeStyle = 'rgba(0,0,0,.18)'; x.lineWidth = 2; x.strokeRect(SX, SY, S, S);
  // el título, a mano en el margen de abajo
  x.fillStyle = '#2b2016'; x.textAlign = 'center'; x.textBaseline = 'alphabetic';
  let ts = 50; do { x.font = `600 ${ts}px Caveat, cursive`; ts -= 2; } while (x.measureText(d.name).width > S - 20 && ts > 26);
  x.save(); x.translate((R() - .5) * 16, SY + S + 70); x.rotate(deg((R() - .5) * 2.4)); x.fillText(d.name, 0, 0); x.restore();
  // cinta: dos tiras translúcidas en las esquinas de arriba
  for (const side of [-1, 1]) {
    x.save(); x.translate(side * (PW / 2 - 40), -PH / 2 + 6); x.rotate(deg(side * (36 + R() * 10)));
    x.fillStyle = 'rgba(250,244,228,.5)'; x.fillRect(-62, -17, 124, 34);
    x.fillStyle = 'rgba(255,255,255,.18)'; x.fillRect(-62, -17, 124, 6);
    x.restore();
  }
  x.restore();
  // 3. el verso, en tinta: la letra más grande que quepa, cada línea con su propio pulso
  // un verso corto se escribe grande; uno largo se achica hasta caber. El bloque queda centrado en el hueco libre
  const maxL = d.tr ? 3 : 4, zoneTop = PY + PH / 2 + 30, zoneBot = H - 200;
  let size = 118, lines;
  do { size -= 4; x.font = `700 ${size}px Caveat, cursive`; lines = cvLines(x, d.line, W * .82); } while ((lines.length > maxL || lines.length * size * 1.02 > zoneBot - zoneTop - (d.tr ? 110 : 20)) && size > 44);
  if (lines.length > maxL) { lines = lines.slice(0, maxL); lines[maxL - 1] += '…'; }
  const lh = size * 1.02, blockH = lines.length * lh + (d.tr ? 96 : 0);
  const top = zoneTop + (zoneBot - zoneTop - blockH) / 2 + size * .8;
  x.textAlign = 'center';
  x.fillStyle = '#f6eee2'; x.shadowColor = 'rgba(0,0,0,.45)'; x.shadowBlur = 18;
  let lastW = 0, lastX = W / 2, lastY = top;
  lines.forEach((l, i) => {
    const jx = (R() - .5) * 26, y = top + i * lh;
    x.save(); x.translate(W / 2 + jx, y); x.rotate(deg((R() - .5) * 2)); x.fillText(l, 0, 0); x.restore();
    lastW = x.measureText(l).width; lastX = W / 2 + jx; lastY = y;
  });
  x.shadowColor = 'transparent';
  // subrayado de marcador bajo la última línea (dos pasadas, como a mano)
  x.globalAlpha = .85; cvScribble(x, R, lastX - lastW * .46, lastX + lastW * .44, lastY + size * .2, accent, 5);
  x.globalAlpha = .45; cvScribble(x, R, lastX - lastW * .4, lastX + lastW * .47, lastY + size * .26, accent, 3); x.globalAlpha = 1;
  // 4. la traducción, como nota al margen
  if (d.tr) {
    x.font = "500 38px Caveat, cursive"; x.fillStyle = accent;
    cvLines(x, '— ' + d.tr, W * .74).slice(0, 2).forEach((l, i) => {
      x.save(); x.translate(W / 2 + 30 + (R() - .5) * 20, lastY + size * .2 + 66 + i * 42); x.rotate(deg(-1.5 + (R() - .5))); x.fillText(l, 0, 0); x.restore();
    });
  }
  // 5. sello de goma: fecha y marca, con la tinta un poco gastada
  const SXc = W - 150 - R() * 40, SYc = H - 150 - R() * 20, now = new Date();
  x.save(); x.translate(SXc, SYc); x.rotate(deg(-18 + (R() - .5) * 20)); x.globalAlpha = .82;
  x.strokeStyle = accent; x.fillStyle = accent;
  x.lineWidth = 3; x.beginPath(); x.arc(0, 0, 80, 0, Math.PI * 2); x.stroke();
  x.lineWidth = 1.2; x.beginPath(); x.arc(0, 0, 66, 0, Math.PI * 2); x.stroke();
  x.font = "500 13px 'Martian Mono', monospace"; x.textAlign = 'center';
  const ring = ' LUMORA · EN VIVO · LUMORA · EN VIVO ·';
  [...ring].forEach((ch, i) => { x.save(); x.rotate(i / ring.length * Math.PI * 2); x.fillText(ch, 0, -69); x.restore(); });
  x.font = "300 30px Anybody, sans-serif"; x.fillText(String(now.getDate()).padStart(2, '0') + '.' + String(now.getMonth() + 1).padStart(2, '0'), 0, 4);
  x.font = "400 12px 'Martian Mono', monospace"; x.fillText(String(now.getFullYear()), 0, 26);
  x.globalCompositeOperation = 'destination-out'; x.globalAlpha = .35; x.fillStyle = x.createPattern(cvNoise(), 'repeat'); x.fillRect(-90, -90, 180, 180);
  x.restore();
  // 6. pie: quién, de qué disco y en qué momento sonó este verso
  x.textAlign = 'left'; x.fillStyle = 'rgba(246,238,226,.62)'; x.font = "400 17px 'Martian Mono', monospace";
  x.fillText((d.artist || '').toUpperCase().slice(0, 34), 76, H - 132);
  x.fillStyle = 'rgba(246,238,226,.36)'; x.font = "400 14px 'Martian Mono', monospace";
  if (d.album) x.fillText(d.album.toUpperCase().slice(0, 40), 76, H - 104);
  x.fillText('VERSO · ' + d.at, 76, H - 76);
  // 7. grano de papel sobre todo
  x.globalAlpha = .6; x.globalCompositeOperation = 'overlay'; x.fillStyle = x.createPattern(cvNoise(), 'repeat'); x.fillRect(0, 0, W, H);
  x.globalAlpha = 1; x.globalCompositeOperation = 'source-over';
  return c;
}
const CVP = { data: null, seed: 0, blob: null, url: '' };
async function cvMakePoster() {
  const line = ($('cvLine')?.textContent || '').trim(), tr = ($('cvTr')?.textContent || '').trim();
  if (!line) return cvMsg('no hay un verso en pantalla ahora mismo');
  const art = typeof artImg !== 'undefined' && artImg?.complete && artImg.naturalWidth ? artImg : null, pos = ext.has() ? ext.now() : 0;
  CVP.data = { line, tr, art, pal: art ? paletteFrom(art, 7) : null, name: ext.st?.name || 'sin título', artist: ext.st?.artist || '', album: ext.st?.album || '',
               at: Math.floor(pos / 60) + ':' + String(Math.floor(pos % 60)).padStart(2, '0') };
  CVP.seed = Math.floor(Math.random() * 1e9);
  $('cover').classList.remove('menu'); $('cvMenuBtn').classList.remove('on');
  $('cvPosterBox').classList.add('on');
  await cvPosterRender();
}
async function cvPosterRender() {
  try { await Promise.all(['700 80px Caveat', '600 50px Caveat', '400 17px "Martian Mono"', '300 30px Anybody'].map(f => document.fonts.load(f))); } catch (e) {}
  const c = cvPosterDraw(CVP.data, CVP.seed);
  c.toBlob(b => {
    if (!b) return cvMsg('no se pudo armar el póster');
    if (CVP.url) URL.revokeObjectURL(CVP.url);
    CVP.blob = b; CVP.url = URL.createObjectURL(b); $('cvPosterImg').src = CVP.url;
  }, 'image/png');
}
function cvPosterSave() {
  if (!CVP.blob) return;
  const safe = (CVP.data.name || 'verso').normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/[^a-z0-9]+/gi, '-').replace(/^-|-$/g, '').toLowerCase();
  const a = document.createElement('a'); a.href = CVP.url; a.download = `lumora-${safe || 'verso'}.png`;
  document.body.appendChild(a); a.click(); a.remove();
  cvMsg('póster guardado en descargas');
}
function cvPosterClose() { $('cvPosterBox').classList.remove('on'); }
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
    // canción nueva o letra que llegó tarde con la carátula abierta: se repinta sola (antes se quedaba con la anterior)
    const hasLyr = mode === 'proc' && IN.lines.some(l => l.text), tNow = performance.now();
    if ((hasLyr !== CV.hasLyr || (ext.artUrl || '') !== CV.art) && tNow - (CV.paintAt || 0) > 300) { CV.paintAt = tNow; cvPaint(); }
    const pos = ext.has() ? ext.now() : 0, dur = ext.st.dur || 0, f = s => Math.floor(s / 60) + ':' + String(Math.floor(s % 60)).padStart(2, '0');
    const shown = CV.scrub ?? pos;                                                                   // mientras haces scratch, la barra muestra adónde vas
    $('cvT0').textContent = f(shown); $('cvT1').textContent = f(dur); $('cvFill').style.width = (dur ? clamp(shown / dur) * 100 : 0) + '%';
    const playing = ext.st.state === 'playing';
    if (CV.pp !== playing) { CV.pp = playing; $('cvPP').innerHTML = cvIco(playing ? 'M7 5h4v14H7zM13 5h4v14h-4z' : 'M8 5v14l11-7z'); }
    for (const el of $('cover').querySelectorAll('.cv-vinyl, .cv-cd, .cv-cass')) el.classList.toggle('spin', playing);
    cvReactFrame(pos, dur);
    $('cover').style.setProperty('--beat', CV.beat && mode === 'proc' ? (IN.beat || 0).toFixed(3) : 0);
    $('cover').style.setProperty('--pulse', mode === 'proc' ? (IN.beat || 0).toFixed(3) : 0);        // anillo de ritmo: late aunque el latido de la portada esté apagado
    if (CV.style === 'vinilo') {
      // surco de afuera (14°) a junto a la etiqueta (33°) según el progreso; en pausa se levanta en su sitio; sin canción, a su apoyo
      const arm = $('cover').querySelector('.cv-arm');
      arm.style.setProperty('--armRot', (ext.has() ? 14 + 19 * (dur ? clamp(shown / dur) : 0) : 0).toFixed(2) + 'deg');
      arm.classList.toggle('up', !playing);
    }
    if (CV.clock) { const d = new Date(); $('cvClock').textContent = d.toLocaleTimeString('es', { hour: '2-digit', minute: '2-digit' }); $('cvDate').textContent = d.toLocaleDateString('es', { weekday: 'long', day: 'numeric', month: 'long' }); }
    if (CV.trata) {
      const plan = mode === 'proc' ? SEM.plans?.[SEM.blockNow] : null, tx = plan?.summary || '';
      const el = $('cvTrataTx');
      if (el.dataset.tx !== tx) {
        el.dataset.tx = tx; el.style.opacity = 0; clearTimeout(el._t);
        el._t = setTimeout(() => { el.textContent = tx; el.style.opacity = 1; el.parentElement.classList.toggle('empty', !tx); }, tx ? 220 : 0);
      }
    }
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
{ const _toggleCover = toggleCover; toggleCover = function (on) { _toggleCover(on); document.body.classList.toggle('cover-open', coverOpen); if (coverOpen) { CV.art = ''; CV.listKey = ''; CV.cur = -2; cvPaint(); } }; }
addEventListener('resize', () => { if (coverOpen) CV.cur = -2; });
// esc cierra primero el menú de opciones
addEventListener('keydown', e => { if (e.key === 'Escape' && coverOpen && $('cvPosterBox').classList.contains('on')) { e.stopImmediatePropagation(); return cvPosterClose(); } if (e.key === 'Escape' && coverOpen && $('cover').classList.contains('menu')) { e.stopImmediatePropagation(); $('cover').classList.remove('menu'); $('cvMenuBtn').classList.remove('on'); } }, true);

// ---------- la portada sigue la canción ----------
const CVR = { sat: 1, bri: 1, glow: 0 };
function cvReactFrame(pos, dur) {
  const art = $('cover').querySelector('.cv-art');
  let sat = 1, bri = 1, glow = 0;
  if (CV.react && mode === 'proc') {
    const plan = SEM.plans?.[SEM.blockNow], e = plan ? (plan.energy ?? 5) : 5 + (IN.mood?.a || 0) * 3;
    const sad = plan && /triste|melancolico|oscuro|nostalgico/.test(plan.mood || '');
    if (e >= 7) { bri = 1.06 + (IN.beat || 0) * .05; sat = 1.15; glow = 60 + (e - 7) * 20; }                 // coro, drop: se ilumina
    else if (e <= 3 || sad) { sat = sad ? .5 : .7; bri = .82; }                                          // puente, lo triste: se apaga
  }
  CVR.sat += (sat - CVR.sat) * .05; CVR.bri += (bri - CVR.bri) * .08; CVR.glow += (glow - CVR.glow) * .06;
  art.style.setProperty('--sat', CVR.sat.toFixed(3)); art.style.setProperty('--bri', CVR.bri.toFixed(3));
  art.style.setProperty('--glowR', CVR.glow.toFixed(0) + 'px');
  cvNextFrame(pos, dur);
}
// en el drop, la portada se parte en pedazos y vuelve a armarse
{ const _m = moment; moment = function (kind) {
  _m(kind);
  if (kind !== 'drop' || !coverOpen || !CV.react) return;
  const art = $('cover').querySelector('.cv-art'); art.querySelector('.cv-shards')?.remove();
  const sh = document.createElement('div'); sh.className = 'cv-shards'; sh.style.setProperty('--artbg', `url("${ext.artUrl}")`);
  for (let k = 0; k < 16; k++) {
    const x = k % 4, y = Math.floor(k / 4), i = document.createElement('i');
    i.style.backgroundPosition = `${x * 33.333}% ${y * 33.333}%`;
    i.style.setProperty('--dx', ((x - 1.5) * (18 + Math.random() * 22)).toFixed(0) + 'px'); i.style.setProperty('--dy', ((y - 1.5) * (18 + Math.random() * 22)).toFixed(0) + 'px');
    i.style.setProperty('--r', ((Math.random() - .5) * 24).toFixed(1) + 'deg'); sh.appendChild(i);
  }
  art.appendChild(sh); setTimeout(() => sh.remove(), 1400);
}; }

// ---------- a continuación (solo Música deja leer la cola) ----------
const CVN = { key: '', data: null, busy: false };
function cvNextFrame(pos, dur) {
  const key = ext.key();
  if (key !== CVN.key && !CVN.busy) {
    CVN.key = key; CVN.data = null; CVN.busy = true;
    fetch('/next').then(r => r.json()).then(d => { if (CVN.key === key && d && d.name) { CVN.data = d; $('cvNextName').textContent = d.name; $('cvNextArtist').textContent = d.artist;
      $('cvNextArt').src = d.art ? '/nextart?t=' + d.art : ''; $('cvNextArt').style.visibility = d.art ? '' : 'hidden'; } }).catch(() => {}).finally(() => { CVN.busy = false; });
  }
  $('cover').querySelector('.cv-next').classList.toggle('on', !!(CVN.data && dur && dur - pos < 20 && dur - pos > 1));
}

// ---------- me gusta ----------
const CVL = { key: '' };
function cvMsg(t, ms = 2800) { const m = $('cvMsg'); m.textContent = t; m.classList.add('on'); clearTimeout(cvMsg.t); cvMsg.t = setTimeout(() => m.classList.remove('on'), ms); }
async function cvLikeState() {
  const key = ext.key(); if (key === CVL.key) return; CVL.key = key;
  try { const d = await fetch('/like').then(r => r.json()); if (CVL.key === key) $('cvLike').classList.toggle('on', d.liked === true); } catch (e) {}
}
async function cvLike() {
  const b = $('cvLike'); b.classList.remove('pop'); void b.offsetWidth; b.classList.add('pop');
  try {
    const d = await fetch('/like', { method: 'POST' }).then(r => r.json());
    if (d.error) return cvMsg(d.error, 4200);
    if (d.src === 'music') { b.classList.toggle('on', d.liked); return cvMsg(d.liked ? 'marcada como favorita en Música' : 'quitada de favoritas'); }
    b.classList.add('on'); cvMsg('guardada en tus me gusta de Spotify (si ya estaba, se quitó)');
  } catch (e) { cvMsg('el puente no responde'); }
}
setInterval(() => { if (coverOpen) cvLikeState(); }, 1000);
