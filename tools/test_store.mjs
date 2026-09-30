// prueba del almacenamiento y del registro de canciones
import { servidor, abrir, mock, espera, BASE } from './lib.mjs';
const srv = await servidor(); await mock('scn=normal');
const { b, p, errores } = await abrir();
await p.goto(BASE + '/index.html?menu=0'); await espera(6000);
let ok = true; const chk = (n, c) => { console.log((c ? 'ok    ' : 'FALLA ') + n); if (!c) ok = false; };
const r = await p.evaluate(async () => {
  const S = RISOSTORE, o = {};
  await S.set('misc', 'x', { a: 1 }); o.get = (await S.get('misc', 'x'))?.a;
  const id = await S.add('dedicatorias', { nombre: 'n' }); o.list = (await S.list('dedicatorias')).some(q => q.id === id && q.nombre === 'n');
  await S.del('dedicatorias', id); o.del = (await S.list('dedicatorias')).length === 0;
  for (let i = 0; i < 70; i++) await S.set('posters', 'p' + i, { i }); await new Promise(r => setTimeout(r, 400)); o.tope = (await S.list('posters')).length <= S.caps.posters;
  o.hist = (await S.list('historial')).map(h => h.name + ':' + h.veces);
  return o;
});
chk('set/get', r.get === 1); chk('add/list', r.list); chk('del', r.del); chk('tope y limpieza', r.tope); chk('historial registra la canción', r.hist.includes('Noche de Neón:1'));
await mock('scn=cambio'); await espera(4500);
const r2 = await p.evaluate(async () => ({ hist: (await RISOSTORE.list('historial')).map(h => h.name + ':' + h.veces), letras: (await RISOSTORE.list('letras')).map(h => h.name + ':' + h.lineas.length) }));
chk('cambio: registra la segunda', r2.hist.includes('Tren de Medianoche:1')); chk('cambio: guarda la letra de la primera', r2.letras.some(x => x.startsWith('Noche de Neón:')));
console.log(JSON.stringify(r2));
for (const e of errores) { console.log(e); ok = false; }
await b.close(); srv.stop(); process.exit(ok ? 0 : 1);
