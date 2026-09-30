// compartir y memoria (fase 6): colección de pósters, dedicatoria y enlace pequeño → docs/ver.html. Capturas en /tmp/share-*.jpg
import { servidor, abrir, mock, espera, BASE } from './lib.mjs';
import { resolve } from 'node:path';
const srv = await servidor(); await mock('scn=normal');
const { b, p, errores } = await abrir(1280, 900);
let ok = true; const chk = (n, c, x) => { console.log((c ? 'ok    ' : 'FALLA ') + n + (x ? '  ' + x : '')); if (!c) ok = false; };
await p.goto(BASE + '/index.html?menu=0'); await espera(6000);
await p.evaluate(async () => { await RISOSTORE.clear('posters'); await RISOSTORE.clear('dedicatorias'); });
// un póster de mentira con cuatro tomas de colores
const item = await p.evaluate(() => {
  const mk = (c) => { const cv = document.createElement('canvas'); cv.width = 480; cv.height = 270; const g = cv.getContext('2d'); g.fillStyle = c; g.fillRect(0, 0, 480, 270); g.fillStyle = '#fff'; g.font = '40px sans-serif'; g.fillText('toma', 40, 140); return cv.toDataURL('image/jpeg', .7); };
  const it = { id: 'ptest1', key: 'k|1', name: 'Noche de Neón', artist: 'Los Ejemplos', album: 'Demo', dur: 215, frames: ['#3a4a9a', '#e07a30', '#5b8bb0', '#2a2a30'].map((c, i) => ({ url: mk(c), t: i * 50, txt: i === 1 ? 'i miss you baby' : '', sid: i })), lines: ['i miss you baby', 'baby come back', 'dance in the neon', 'baby oh baby'], moods: { romantico: 3, feliz: 1 }, cuts: 5, first: 12, live: false, bpm: 0, fin: Date.now(), why: 'fin', artCv: null };
  window.__item = it; return { id: it.id };
});
await p.evaluate(async () => { await RISOSHARE.save(window.__item); });
let rows = await p.evaluate(() => RISOSHARE.list());
chk('(a) el póster queda guardado en la colección', rows.length === 1 && rows[0].name === 'Noche de Neón' && rows[0].frames.filter(Boolean).length === 4, rows.length + ' filas');
// (b) colección
await p.evaluate(() => RISOSHARE.openGallery()); await espera(600); await p.screenshot({ path: '/tmp/share-coleccion.jpg', type: 'jpeg', quality: 80 });
chk('(b) la ventana de colección muestra la tarjeta', await p.evaluate(() => document.querySelectorAll('#colWin .card').length) === 1);
// (c) ver: rehidrata y abre el póster
await p.click('#colWin .card button[data-a=ver]'); await p.waitForSelector('#posterWin canvas', { timeout: 120000 }); await espera(500);
chk('(c) «ver» abre el póster guardado', await p.evaluate(() => !!document.querySelector('#posterWin canvas') && RISOPOSTER.open.item.id === 'ptest1'));
// (d) dedicatoria
await p.fill('#pwDed', 'para Ana, con cariño'); await p.press('#pwDed', 'Enter'); await p.waitForSelector('#posterWin canvas', { timeout: 120000 }); await espera(800);
const ded = await p.evaluate(async () => ({ it: RISOPOSTER.open.item.dedic, input: document.getElementById('pwDed')?.value, st: (await RISOSHARE.list())[0].dedic, ded: (await RISOSTORE.list('dedicatorias')).length }));
chk('(d) la dedicatoria se guarda en el póster, en la colección y en el historial de dedicatorias', ded.it === 'para Ana, con cariño' && ded.input === ded.it && ded.st === ded.it && ded.ded === 1, JSON.stringify(ded));
await p.evaluate(() => { const cv = document.querySelector('#posterWin canvas'); const s = document.createElement('canvas'); s.width = 800; s.height = Math.round(800 * cv.height / cv.width); s.getContext('2d').drawImage(cv, 0, 0, s.width, s.height); window.__png = s.toDataURL('image/jpeg', .8); });
const png = await p.evaluate(() => window.__png); (await import('node:fs')).writeFileSync('/tmp/share-poster-dedicatoria.jpg', Buffer.from(png.split(',')[1], 'base64'));
// (e) enlace pequeño
const link = await p.evaluate(() => RISOSHARE.link(RISOPOSTER.open.item));
chk('(e) el enlace es pequeño', link && link.length < 700, link && String(link.length));
const hash = link.slice(link.indexOf('#'));
const q = await b.newPage({ viewport: { width: 700, height: 950 } });
await q.goto('file://' + resolve('docs/ver.html') + hash); await espera(500); await q.screenshot({ path: '/tmp/share-ver.jpg', type: 'jpeg', quality: 80 });
const txt = await q.evaluate(() => document.body.innerText);
chk('(e) ver.html dibuja título, artista, dedicatoria y palabra', /NOCHE DE NEÓN/i.test(txt) && /Los Ejemplos/.test(txt) && /para Ana, con cariño/.test(txt) && /DANCE/.test(txt), txt.replace(/\s+/g, ' ').slice(0, 120));
// (f) seguridad: texto con HTML no se interpreta
const evil = { v: 1, n: '<img src=x onerror="window.__x=1">', a: '<b>a</b>', w: '<i>x</i>', m: 'feliz', d: '<script>window.__y=1<\/script>', t: 20250101, s: 100, i: 2, l: 3, e: 2, p: 'x' };
const eh = '#' + Buffer.from(JSON.stringify(evil)).toString('base64url');
const q2 = await b.newPage(); await q2.goto('file://' + resolve('docs/ver.html') + eh); await espera(400);
const hit = await q2.evaluate(() => ({ x: window.__x, y: window.__y, imgs: document.querySelectorAll('main img, main script').length, h1: document.querySelector('h1').textContent }));
chk('(f) el HTML de los datos se muestra como texto y no se ejecuta', !hit.x && !hit.y && hit.imgs === 0 && hit.h1.startsWith('<img'), JSON.stringify(hit));
const q3 = await b.newPage(); await q3.goto('file://' + resolve('docs/ver.html') + '#basura!!'); await espera(300);
chk('(f) un enlace roto muestra un aviso', /no tiene una lámina/.test(await q3.evaluate(() => document.body.innerText)));
const q4 = await b.newPage(); await q4.goto('file://' + resolve('docs/ver.html')); await espera(300);
chk('(f) sin fragmento también', /no tiene una lámina/.test(await q4.evaluate(() => document.body.innerText)));
// (g) base configurable
await p.evaluate(() => { CFG.shareBase = 'https://ejemplo.org/l/ver.html'; }); const l2 = await p.evaluate(() => RISOSHARE.link(RISOPOSTER.open.item));
chk('(g) la página del enlace se puede cambiar', l2.startsWith('https://ejemplo.org/l/ver.html#'), l2.slice(0, 40)); await p.evaluate(() => { CFG.shareBase = ''; });
// (h) borrar
await p.evaluate(() => { document.querySelector('#posterWin button[data-a=x]').click(); RISOSHARE.openGallery(); }); await espera(500);
await p.click('#colWin button[data-a=del]'); await p.click('#colWin button[data-a=del]'); await espera(700);
chk('(h) borrar de la colección (con confirmación)', (await p.evaluate(() => RISOSHARE.list())).length === 0);
chk('sin errores de consola', errores.length === 0, errores.join(' | '));
await b.close(); srv.stop(); process.exit(ok ? 0 : 1);
