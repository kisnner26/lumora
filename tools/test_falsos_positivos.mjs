// detección de palabras sin navegador: falsos positivos, frases que deben disparar y errores ya corregidos.
// node tools/test_falsos_positivos.mjs
import { cargarDetector } from './detector_lib.mjs';
import { PALABRAS, PERMITIDOS, NEUTRAS } from './corpus_letras.mjs';
import { DEBE, NO, REGRESIONES } from './frases.mjs';
const D = cargarDetector();
let fallos = 0; const falla = (...m) => { fallos++; console.log('FALLA', ...m); };

// 1. palabras muy comunes de las letras: solo pueden disparar lo que el dibujo representa de verdad
const uniq = [...new Set(PALABRAS)]; let conDisparo = 0;
for (const w of uniq) {
  const ids = D.detect(w, 6); if (ids.length) conDisparo++;
  const mal = ids.filter(id => !(PERMITIDOS[w] || []).includes(id));
  if (mal.length) falla('palabra común dispara de más:', w, '=>', mal.join(','));
}
console.log(`ok    ${uniq.length} palabras comunes revisadas (${conDisparo} disparan algo legítimo)`);

// 2. frases neutras: ninguna dibuja nada
const neutras = [...NO, ...NEUTRAS];
for (const f of neutras) { const ids = D.detect(f, 6); if (ids.length) falla('frase neutra dispara:', f, '=>', ids.join(',')); }
console.log(`ok    ${neutras.length} frases neutras`);

// 3. frases que deben disparar su dibujo
let bien = 0; for (const [f, id] of DEBE) { const ids = D.detect(f, 5); if (ids.includes(id)) bien++; else falla('debe disparar', id, '<-', f, '=>', ids.join(',') || '(nada)'); }
console.log(`ok    ${bien}/${DEBE.length} frases disparan lo esperado`);

// 4. errores reales ya corregidos (no pueden volver)
let reg = 0; for (const [f, no, si] of REGRESIONES) {
  const ids = D.detect(f, 8); const sobra = no.filter(x => ids.includes(x)), falta = si.filter(x => !ids.includes(x));
  if (sobra.length || falta.length) falla('regresión:', f, sobra.length ? 'no debe salir ' + sobra : '', falta.length ? 'debe salir ' + falta : '', '=>', ids.join(',') || '(nada)'); else reg++;
}
console.log(`ok    ${reg}/${REGRESIONES.length} regresiones cubiertas`);

// 5. higiene de las reglas: una raíz de dos a cuatro letras con comodín se come palabras ajenas (win\w* sacaba window, wine, winter)
const permitidas = new Set(['cuba', 'ital', 'suiz', 'suec', 'swed', 'finn', 'grec', 'turk', 'thai', 'kiwi', 'saud', 'kiss', 'sing', 'howl', 'surf', 'glid', 'tico', 'ruso', 'ingl', 'ric']);
for (const [id, e] of Object.entries(D.info)) for (const m of e.alias.source.matchAll(/(?<![\w\\\]\[])([a-záéíóúñ]{2,4})\\w[*+]/gi)) if (!permitidas.has(m[1].toLowerCase())) falla('raíz corta con comodín:', id, m[0]);
console.log('ok    sin raíces cortas con comodín');
console.log(fallos ? `\nFALLOS: ${fallos}` : '\nFALSOS POSITIVOS: ok'); process.exit(fallos ? 1 : 0);
