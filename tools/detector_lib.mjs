// carga el catálogo y su detector en Node, sin navegador: solo registra datos (ids, alias, prioridades).
// sirve para probar la detección de palabras de forma rápida y en cualquier máquina con node.
import vm from 'node:vm'; import fs from 'node:fs'; import path from 'node:path';
const RAIZ = path.resolve(path.dirname(new URL(import.meta.url).pathname), '..');
// los archivos del catálogo, en el orden en que index.html los carga
export function archivosCatalogo() {
  const html = fs.readFileSync(path.join(RAIZ, 'index.html'), 'utf8');
  const todos = [...html.matchAll(/<script src="([^"]+)"/g)].map(m => m[1]);
  const i = todos.indexOf('riso-catalog.js'), j = todos.findIndex((f, k) => k > i && !/^riso-props/.test(f));
  return todos.slice(i, j);
}
export function cargarDetector(cfg = {}) {
  const defs = {};
  const win = { CFG: cfg, console, Math, RISO_DEV: false };
  win.window = win;
  win.RISO = { props: { DEFS: defs, variants: {}, geom: {}, def(ids, draw) { for (const id of [].concat(ids)) defs[id] = { draw }; } } };
  const ctx = vm.createContext(win);
  // como en el navegador, las banderas toman sus nombres y gentilicios de NATIONS (symbols.js y reality.js, que se cargan antes).
  // solo se extrae esa lista: ejecutar los archivos enteros exige medio programa (GENS, procFrame, interpret...)
  const leer = f => fs.readFileSync(path.join(RAIZ, f), 'utf8');
  const base = leer('symbols.js').match(/const NATIONS = \[[\s\S]*?\n\];/), extra = leer('reality.js').match(/NATIONS\.push\([\s\S]*?\n\);/);
  if (!base || !extra) console.warn('detector_lib: no encuentro NATIONS en symbols.js o reality.js; las banderas usarán solo sus nombres propios');
  else { vm.runInContext(base[0], ctx, { filename: 'symbols.js (NATIONS)' }); vm.runInContext(extra[0], ctx, { filename: 'reality.js (NATIONS)' }); }
  for (const f of archivosCatalogo()) vm.runInContext(fs.readFileSync(path.join(RAIZ, f), 'utf8'), ctx, { filename: f });
  const R = win.RISO;
  return { detect: (t, n = 5) => R.people.detect(t, n), info: R.catalog.info, total: R.catalog.count, defs, R };
}
