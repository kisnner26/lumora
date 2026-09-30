// hojas de contacto del catálogo: node tools/galeria.mjs <categoria|todos|base> <salida-prefijo> [mini|grande]
import { servidor, abrir, espera, BASE } from './lib.mjs';
const [cat = 'todos', out = '/tmp/gal', mode = 'grande'] = process.argv.slice(2);
const srv = await servidor(); const { b, p } = await abrir(1600, 900);
p.on('pageerror', e => console.log('pageerror', e.message));
let page = 0, total = 1;
do {
  await p.goto(`${BASE}/tools/galeria.html?cat=${cat === 'todos' ? '' : cat}&page=${page}&mode=${mode}`); await p.waitForFunction('window.GAL_READY', null, { timeout: 20000 });
  await p.evaluate('render(4)'); await espera(150);
  const g = await p.evaluate('({total: GAL.total, per: GAL.per})'); total = g.total;
  await (await p.$('canvas')).screenshot({ path: `${out}-${mode}-${page}.png` }); console.log(`${out}-${mode}-${page}.png`, g.total);
  page++;
} while (page * (mode === 'mini' ? 240 : 40) < total);
await b.close(); srv.stop();
