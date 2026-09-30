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
  ['me siento tan solitario y triste', 'soledad'], ['tengo miedo de perderte', 'miedo'], ['la ira me consume', 'ira'], ['celos de todo lo que miras', 'celos'], ['no puedo dejar de pensar en ti, obsesión', 'obsesion'],
  ['una pizza y una cerveza', 'pizza'], ['me como un helado contigo', 'helado'], ['tomando vino tinto', 'vino'], ['fresas con crema', 'fresa'], ['pastel de cumpleaños', 'pastel'],
  ['mi perro me espera en casa', 'perro'], ['un gato en el tejado', 'gato'], ['como una mariposa en primavera', 'mariposa'], ['un tiburón en el mar', 'tiburon'], ['el búho de la noche', 'buho'],
  ['una estrella en el volcán', 'volcan'], ['después de la tormenta un arcoíris', 'arcoiris'], ['el amanecer en la playa', 'amanecer'], ['el planeta rojo', 'planeta'],
  ['viajando en tren de noche', 'tren'], ['un avión al cielo', 'avion'], ['despegó el cohete', 'cohete'], ['en la moto a mil', 'moto'],
  ['mi laptop y mi celular', 'laptop'], ['te mando un mensaje', 'chat'], ['tocando la guitarra', 'guitarra_acustica'], ['el saxofón suena', 'saxofon'], ['un vinilo en el tocadiscos', 'vinilo'],
  ['bajo la torre Eiffel', 'torre_eiffel'], ['las pirámides de Egipto', 'piramides'], ['un canguro en Australia', 'canguro'], ['el cóndor de los Andes', 'condor'], ['vamos a Machu Picchu', 'machu_picchu'],
];
const NO = ['te quiero mucho mi amor', 'the city lights are burning', 'un café en la mañana', 'i miss you baby', 'dance until the morning sun', 'sleeping in this empty house', 'tengo el corazón roto', 'no me digas que no', 'cruzando el puente hacia tu casa', 'solo quiero estar contigo', 'tal vez mañana te vea', 'gracias por todo', 'eres mi mate en este juego', 'siempre te veo igual', 'lo que siento es real', 'quiero verte otra vez', 'tú y yo, nada más'];
const r = await p.evaluate(([debe, no]) => ({ debe: debe.map(([f, id]) => [f, id, RISO.people.detect(f, 5)]), no: no.map(f => [f, RISO.people.detect(f, 5)]) }), [DEBE, NO]);
let ok = true, hits = 0;
for (const [f, id, got] of r.debe) { const c = got.includes(id); hits += c; if (!c) { ok = false; console.log('FALLA debe disparar', id, '<-', f, '=>', got.join(',') || '(nada)'); } }
console.log(`ok    ${hits}/${r.debe.length} frases disparan lo esperado`);
for (const [f, got] of r.no) if (got.length) { ok = false; console.log('FALLA falso positivo:', f, '=>', got.join(',')); }
console.log(`ok    ${NO.length - r.no.filter(q => q[1].length).length}/${NO.length} frases neutras sin falsos positivos`);
for (const e of errores) { console.log(e); ok = false; }
await b.close(); srv.stop(); process.exit(ok ? 0 : 1);
