// prueba del póster: canción normal, corta y sin letra; A4 y 9:16; variantes. Guarda las capturas en /tmp/poster-*.jpg
import { servidor, abrir, mock, espera, BASE } from './lib.mjs';
const srv = await servidor(); const { b, p, errores } = await abrir();
let ok = true; const chk = (n, c, x) => { console.log((c ? 'ok    ' : 'FALLA ') + n + (x ? '  ' + x : '')); if (!c) ok = false; };
const casos = [['normal', 'song=a&pos=150'], ['corta', 'scn=corta'], ['sinletra', 'scn=sinletra']];
await mock('scn=normal'); await p.goto(BASE + '/index.html?menu=0'); await espera(2500);
for (const [nombre, q] of casos) {
  await mock(q); await espera(3500);
  // saltos por la canción para que se capturen las cuatro tomas
  const dur = (await (await fetch(BASE + '/mock/estado')).json()).dur;
  for (const f of [.05, .2, .4, .6, .8, .93]) { await mock(`song=${q.includes('scn=corta') ? 'corta' : q.includes('sinletra') ? 'c' : 'a'}&pos=${Math.round(dur * f)}`);
    const antes = await p.evaluate(() => RISOPOSTER.cur?.frames.filter(Boolean).length || 0);
    for (let i = 0; i < 24; i++) { await espera(500); const n = await p.evaluate(() => RISOPOSTER.cur?.frames.filter(Boolean).length || 0); if (n > antes || n >= 4) break; } }
  const r = await p.evaluate(() => { const c = RISOPOSTER.cur; return { frames: c.frames.filter(Boolean).length, listo: RISOPOSTER.ready.length, done: c.done, name: c.name }; });
  chk(`${nombre}: se capturaron tomas`, r.frames >= 2, JSON.stringify(r));
  await mock(`state=playing`);
}
// fuerza el cierre de lo que haya y renderiza los formatos
const res = await p.evaluate(async () => {
  const out = []; const c = RISOPOSTER.cur; if (!c.done) RISOPOSTER.finalize('fin'); const item = RISOPOSTER.ready.at(-1) || { ...c, fin: Date.now() };
  for (const [fmt, v] of [['a4', 0], ['a4', 1], ['story', 0], ['story', 3]]) { const cv = await RISOPOSTER.render(item, fmt, v); const j = document.createElement('canvas'); j.width = 600; j.height = Math.round(600 * cv.height / cv.width); j.getContext('2d').drawImage(cv, 0, 0, j.width, j.height); out.push([fmt + v, cv.width + 'x' + cv.height, j.toDataURL('image/jpeg', .8)]); }
  return out; });
import fs from 'node:fs';
for (const [n, size, url] of res) { fs.writeFileSync(`/tmp/poster-${n}.jpg`, Buffer.from(url.split(',')[1], 'base64')); chk('póster ' + n + ' ' + size, /^(2480x3508|1620x2880)$/.test(size)); }
for (const e of errores) { console.log(e); ok = false; }
await b.close(); srv.stop(); process.exit(ok ? 0 : 1);
