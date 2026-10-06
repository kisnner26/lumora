// carga el catálogo y su detector en Node, sin navegador: solo registra datos (ids, alias, prioridades).
// sirve para probar la detección de palabras de forma rápida y en cualquier máquina con node.
import vm from 'node:vm'; import fs from 'node:fs'; import path from 'node:path';
const RAIZ = path.resolve(path.dirname(new URL(import.meta.url).pathname), '..');
// los archivos del catálogo, en el orden en que index.html los carga
export function archivosCatalogo() {
  const html = fs.readFileSync(path.join(RAIZ, 'index.html'), 'utf8');
  const todos = [...html.matchAll(/<script src="([^"]+)"/g)].map(m => m[1]);
  const nom = todos.map(f => path.basename(f));                  // los archivos pueden vivir en subcarpetas de js/
  const i = nom.indexOf('riso-catalog.js'), j = nom.findIndex((f, k) => k > i && !/^riso-(props|people)/.test(f));
  return todos.slice(i, j);
}
// ruta (relativa a la raíz) de un script de index.html a partir de su nombre
function ruta(nombre) {
  const html = fs.readFileSync(path.join(RAIZ, 'index.html'), 'utf8');
  const f = [...html.matchAll(/<script src="([^"]+)"/g)].map(m => m[1]).find(x => path.basename(x) === nombre);
  if (!f) throw new Error('detector_lib: index.html no carga ' + nombre);
  return f;
}
export function cargarDetector(cfg = {}) {
  const defs = {}, duplicados = [];
  const win = { CFG: cfg, console, Math, RISO_DEV: false };
  win.window = win;
  win.RISO = { props: { DEFS: defs, variants: {}, geom: {}, def(ids, draw) { for (const id of [].concat(ids)) { if (defs[id]) duplicados.push(id); defs[id] = { draw }; } } } };
  const ctx = vm.createContext(win);
  // los dibujos originales de riso-props.js (no se ejecutan; solo sus ids, para detectar repetidos)
  for (const m of fs.readFileSync(path.join(RAIZ, ruta('riso-props.js')), 'utf8').matchAll(/\bdef\((\[[^\]]*\]|'[^']+')/g)) for (const x of m[1].matchAll(/'([^']+)'/g)) defs[x[1]] = { draw: null };
  // como en el navegador, las banderas toman sus nombres y gentilicios de NATIONS (symbols.js y reality.js, que se cargan antes).
  // solo se extrae esa lista: ejecutar los archivos enteros exige medio programa (GENS, procFrame, interpret...)
  const leer = f => fs.readFileSync(path.join(RAIZ, ruta(f)), 'utf8');
  const base = leer('symbols.js').match(/const NATIONS = \[[\s\S]*?\n\];/), extra = leer('reality.js').match(/NATIONS\.push\([\s\S]*?\n\);/);
  if (!base || !extra) console.warn('detector_lib: no encuentro NATIONS en symbols.js o reality.js; las banderas usarán solo sus nombres propios');
  else { vm.runInContext(base[0], ctx, { filename: 'symbols.js (NATIONS)' }); vm.runInContext(extra[0], ctx, { filename: 'reality.js (NATIONS)' }); }
  for (const f of archivosCatalogo()) vm.runInContext(fs.readFileSync(path.join(RAIZ, f), 'utf8'), ctx, { filename: f });
  const R = win.RISO;
  return { detect: (t, n = 5) => R.people.detect(t, n), info: R.catalog.info, total: R.catalog.count, defs, duplicados, R };
}
