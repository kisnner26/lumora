// batería de detección: frases que deben disparar un dibujo y frases neutras que no deben disparar ninguno
import { servidor, abrir, espera, BASE } from './lib.mjs';
const srv = await servidor(); const { b, p, errores } = await abrir();
await p.goto(BASE + '/index.html?menu=0'); await espera(1500);
// [frase, id esperado] (el id esperado debe estar entre los detectados)
import { DEBE, NO } from './frases.mjs';
const r = await p.evaluate(([debe, no]) => ({ debe: debe.map(([f, id]) => [f, id, RISO.people.detect(f, 5)]), no: no.map(f => [f, RISO.people.detect(f, 5)]) }), [DEBE, NO]);
let ok = true, hits = 0;
for (const [f, id, got] of r.debe) { const c = got.includes(id); hits += c; if (!c) { ok = false; console.log('FALLA debe disparar', id, '<-', f, '=>', got.join(',') || '(nada)'); } }
console.log(`ok    ${hits}/${r.debe.length} frases disparan lo esperado`);
for (const [f, got] of r.no) if (got.length) { ok = false; console.log('FALLA falso positivo:', f, '=>', got.join(',')); }
console.log(`ok    ${NO.length - r.no.filter(q => q[1].length).length}/${NO.length} frases neutras sin falsos positivos`);
for (const e of errores) { console.log(e); ok = false; }
await b.close(); srv.stop(); process.exit(ok ? 0 : 1);
