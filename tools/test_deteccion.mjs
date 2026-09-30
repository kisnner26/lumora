// batería de detección: frases que deben disparar un dibujo y frases neutras que no deben disparar ninguno
import { servidor, abrir, espera, BASE } from './lib.mjs';
const srv = await servidor(); const { b, p, errores } = await abrir();
await p.goto(BASE + '/index.html?menu=0'); await espera(1500);
// [frase, id esperado] (el id esperado debe estar entre los detectados)
const DEBE = [
  ['soy de Nicaragua, mi tierra es de volcanes', 'flag_ni'], ['los nicas somos así', 'flag_ni'], ['boricua hasta la muerte', 'flag_pr'], ['soy de Colombia', 'flag_co'],
  ['viva México cabrones', 'flag_mx'], ['I love New York', 'flag_us'], ['dancing in Paris tonight', 'flag_fr'], ['una noche en Madrid', 'flag_es'], ['direction to Tokyo', 'flag_jp'],
  ['vamos a Cuba', 'flag_cu'], ['la selección de Argentina', 'flag_ar'], ['carnaval en Brasil', 'flag_br'], ['London calling', 'flag_gb'], ['Jamaica me llama', 'flag_jm'],
  ['dominicana mi tierra', 'flag_do'], ['nos vemos en Berlín', 'flag_de'], ['from Canada with love', 'flag_ca'], ['Grecia en verano', 'flag_gr'], ['Rusia y Ucrania', 'flag_ru'],
];
const NO = ['walking alone in the rain tonight', 'te quiero mucho mi amor', 'the city lights are burning', 'un café en la mañana', 'i miss you baby', 'dance until the morning sun', 'sleeping alone in this empty house', 'tengo el corazón roto', 'no me digas que no'];
const r = await p.evaluate(([debe, no]) => ({ debe: debe.map(([f, id]) => [f, id, RISO.people.detect(f, 5)]), no: no.map(f => [f, RISO.people.detect(f, 5)]) }), [DEBE, NO]);
let ok = true, hits = 0;
for (const [f, id, got] of r.debe) { const c = got.includes(id); hits += c; if (!c) { ok = false; console.log('FALLA debe disparar', id, '<-', f, '=>', got.join(',') || '(nada)'); } }
console.log(`ok    ${hits}/${r.debe.length} frases disparan lo esperado`);
for (const [f, got] of r.no) if (got.length) { ok = false; console.log('FALLA falso positivo:', f, '=>', got.join(',')); }
console.log(`ok    ${NO.length - r.no.filter(q => q[1].length).length}/${NO.length} frases neutras sin falsos positivos`);
for (const e of errores) { console.log(e); ok = false; }
await b.close(); srv.stop(); process.exit(ok ? 0 : 1);
