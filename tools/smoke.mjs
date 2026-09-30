// abre lumora con el puente simulado, entra al modo de video y falla si hay errores de consola
import { servidor, abrir, mock, espera, BASE } from './lib.mjs';
const srv = await servidor(); await mock('scn=normal');
const { b, p, errores } = await abrir();
await p.goto(BASE + '/index.html?menu=0'); await espera(2500);
const r = await p.evaluate(async () => { await new Promise(r => setTimeout(r, 4000)); return { modo: mode, clip: !!(window.RISOCLIP && RISOCLIP.on), toma: RISOCLIP?.shot?.kind || null, cancion: ext.st.name }; });
console.log('estado', JSON.stringify(r));
let fallo = errores.length > 0;
if (r.modo !== 'proc' || !r.clip || !r.toma) { console.log('fallo: el videoclip no arrancó'); fallo = true; }
for (const e of errores) console.log(e);
await b.close(); srv.stop();
console.log(fallo ? 'SMOKE: FALLO' : 'SMOKE: ok'); process.exit(fallo ? 1 : 0);
