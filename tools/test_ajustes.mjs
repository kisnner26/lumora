// ajustes (fase 8): buscador, restablecer por sección, looks, accesibilidad, vista previa y memoria. Capturas en /tmp/aj-*.jpg
import { servidor, abrir, mock, espera, BASE } from './lib.mjs';
const srv = await servidor(); await mock('scn=normal');
const { b, p, errores } = await abrir(1280, 900);
let ok = true; const chk = (n, c, x) => { console.log((c ? 'ok    ' : 'FALLA ') + n + (x ? '  ' + x : '')); if (!c) ok = false; };
await p.goto(BASE + '/index.html?menu=0'); await espera(5000);
await p.evaluate(() => { localStorage.removeItem('tc_cfg'); Object.assign(CFG, CFG_DEFAULT); applyAll(); toggleSettings(true); }); await espera(1800);
const vis = () => p.evaluate(() => [...document.querySelectorAll('#settings section')].filter(s => s.style.display !== 'none').map(s => s.id.replace('set-', '')));
// (a) secciones nuevas
const secs = await vis(); chk('(a) hay secciones looks, accesibilidad y memoria', ['looks', 'accesibilidad', 'memoria'].every(s => secs.includes(s)), secs.join(','));
chk('(a) cada una tiene su botón en el riel', await p.evaluate(() => ['looks', 'accesibilidad', 'memoria'].every(s => !!document.querySelector(`.set-rail [data-go=set-${s}]`))));
await p.screenshot({ path: '/tmp/aj-panel.jpg', type: 'jpeg', quality: 80 });
// (b) buscador
await p.fill('#setSearch', 'traducción'); await espera(300);
let rows = await p.evaluate(() => [...document.querySelectorAll('#settings .opt')].filter(r => r.style.display !== 'none').map(r => r.dataset.row));
chk('(b) buscar «traducción» deja solo lo que coincide', rows.includes('trMode') && rows.length <= 4 && !rows.includes('quality'), rows.join(','));
await p.screenshot({ path: '/tmp/aj-busqueda.jpg', type: 'jpeg', quality: 80 });
await p.fill('#setSearch', 'movimiento'); await espera(300); rows = await p.evaluate(() => [...document.querySelectorAll('#settings .opt')].filter(r => r.style.display !== 'none').map(r => r.dataset.row));
chk('(b) sin tildes y por descripción también (movimiento)', rows.includes('cameraAmt') && rows.includes('reduceMotion'), rows.join(','));
await p.fill('#setSearch', 'zzzqqq'); await espera(300);
chk('(b) sin resultados muestra el aviso', await p.evaluate(() => getComputedStyle(document.getElementById('setNone')).display !== 'none' && [...document.querySelectorAll('#settings section')].every(s => s.style.display === 'none')));
await p.fill('#setSearch', ''); await espera(300); chk('(b) al borrar vuelve todo', (await vis()).length >= 8);
// (c) restablecer una sección
await p.evaluate(() => { CFG.transitions = 'ninguna'; CFG.fxCine = { tinta: false, papel: false, peso: false, taller: false }; CFG.lyricSize = 1.4; applyAll(); }); await espera(300);
await p.click('#set-efectos .sreset'); await espera(300);
const r1 = await p.evaluate(() => ({ t: CFG.transitions, fx: CFG.fxCine, ls: CFG.lyricSize }));
chk('(c) restablecer «efectos» vuelve a fábrica (chips encendidos) y no toca otras secciones', r1.t === 'todas' && Object.values(r1.fx).every(Boolean) && r1.ls === 1.4, JSON.stringify(r1));
// (d) looks
await p.click('[data-row=look_calma] button'); await espera(400);
const l1 = await p.evaluate(() => ({ t: CFG.transitions, f: CFG.flashes, a: RISOAJ.activeLook(), now: document.getElementById('lookNow').textContent }));
chk('(d) el look «calma» cambia los ajustes y se reconoce como activo', l1.t === 'suaves' && l1.f === false && l1.a === 'calma' && /calma/.test(l1.now), JSON.stringify(l1));
await p.click('[data-row=look_guardar] button'); await espera(400);
await p.click('[data-row=look_fiesta] button'); await espera(400);
chk('(d) «fiesta» lo cambia', await p.evaluate(() => CFG.transitions === 'todas' && CFG.lyricSize === 1.15));
await p.click('[data-row=look_mio] button'); await espera(400);
chk('(d) «mi look» devuelve lo guardado (calma)', await p.evaluate(() => CFG.transitions === 'suaves' && CFG.flashes === false && RISOAJ.activeLook() === 'calma'));
await p.click('[data-row=look_clasico] button'); await espera(300);
// (e) vista previa
await p.evaluate(() => { CFG.lyricSize = 1; CFG.textBox = false; applyAll(); }); await p.evaluate(() => RISOAJ.preview()); await espera(600);
const h1 = await p.evaluate(() => { const c = document.querySelector('#setPrev canvas'), d = c.getContext('2d').getImageData(0, 0, c.width, c.height).data; let s = 0, nz = 0; for (let i = 0; i < d.length; i += 4 * 37) { s = (s * 31 + d[i] + d[i + 1] * 3) | 0; if (d[i] < 200) nz++; } return { s, nz, cap: document.getElementById('prevCap').textContent }; });
chk('(e) la vista previa dibuja algo y explica qué muestra', h1.nz > 200 && /letra 1\.00×/.test(h1.cap), JSON.stringify(h1));
await p.screenshot({ path: '/tmp/aj-vista-previa-1.jpg', type: 'jpeg', quality: 80 });
await p.evaluate(() => { CFG.lyricSize = 1.5; CFG.textBox = true; CFG.trMode = 'orig'; applyAll(); }); await p.evaluate(() => RISOAJ.preview()); await espera(600);
const h2 = await p.evaluate(() => { const c = document.querySelector('#setPrev canvas'), d = c.getContext('2d').getImageData(0, 0, c.width, c.height).data; let s = 0; for (let i = 0; i < d.length; i += 4 * 37) s = (s * 31 + d[i] + d[i + 1] * 3) | 0; return { s, cap: document.getElementById('prevCap').textContent }; });
chk('(e) cambia al mover tamaño, papel y traducción', h2.s !== h1.s && /1\.50×/.test(h2.cap) && /orig/.test(h2.cap), JSON.stringify(h2));
await p.screenshot({ path: '/tmp/aj-vista-previa-2.jpg', type: 'jpeg', quality: 80 });
await p.evaluate(() => { CFG.textBox = false; CFG.trMode = 'ambas'; CFG.lyricSize = 1; applyAll(); });
// (f) accesibilidad
await p.evaluate(() => { CFG.reduceMotion = true; applyAll(); });
const a = await p.evaluate(() => { const st = RISO.stage; st.cut = null; let sw = 0; st.cutTo(() => { sw = 1; }, 'h'); return { sw, cut: !!st.cut, tinta: RISO.fx.on('tinta'), peso: RISO.fx.on('peso'), taller: RISO.fx.on('taller'), pick: RISO.fx.pickCut({ mood: 'rabioso' }, { kind: 'prop' }), hc: document.body.classList.contains('hc') }; });
chk('(f) reducir movimiento: corte seco, sin efectos de cine', a.sw === 1 && !a.cut && !a.tinta && !a.peso && !a.taller && a.pick === null, JSON.stringify(a));
await p.evaluate(() => { CFG.reduceMotion = false; CFG.contrast = true; applyAll(); }); await espera(300);
chk('(f) alto contraste pone la clase y se ve', await p.evaluate(() => document.body.classList.contains('hc'))); await p.screenshot({ path: '/tmp/aj-contraste.jpg', type: 'jpeg', quality: 80 });
await p.evaluate(() => { CFG.contrast = false; applyAll(); });
// (g) memoria
await p.evaluate(async () => { await RISOSTORE.set('posters', 'x1', { name: 'a' }); await RISOSTORE.set('posters', 'x2', { name: 'b' }); toggleSettings(false); toggleSettings(true); }); await espera(800);
const m1 = await p.evaluate(() => document.querySelector('[data-row=borrar_posters] small').textContent); chk('(g) la memoria cuenta lo guardado', /^2 guardados/.test(m1), m1);
await p.click('[data-row=borrar_posters] button'); chk('(g) borrar pide confirmación', await p.evaluate(async () => (await RISOSTORE.size()).posters === 2));
await p.click('[data-row=borrar_posters] button'); await espera(600); chk('(g) y al confirmar borra', await p.evaluate(async () => (await RISOSTORE.size()).posters === 0));
// (h) tamaño de letra del clip
chk('(h) «Tamaño de la letra» existe en accesibilidad', await p.evaluate(() => !!document.querySelector('#set-accesibilidad [data-row=lyricSize]')));
chk('sin errores de consola', errores.length === 0, errores.join(' | '));
await b.close(); srv.stop(); process.exit(ok ? 0 : 1);
