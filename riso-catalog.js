// ============================================================
// riso-catalog.js — el catálogo de dibujos animados y su detector.
// Cada archivo de categoría (riso-props-*.js) dibuja con RISO.props.def y se anota aquí con
// RISO.catalog.add({ id, cat, label, alias, prio, moods, variantes }):
//   id        ascii minúscula con guion bajo (el mismo de def)
//   cat       categoria (objetos, comida, animales, naturaleza, paises, emociones, famosos, oficios, deportes,
//             transporte, tecnologia, musica, simbolos, fiestas, ropa, banderas)
//   label     texto de la etiqueta «FIG.» en mayúsculas
//   alias     expresión regular (bilingüe, con límites de palabra) que dispara el dibujo
//   prio      persona 0 · país 1 · emoción 2 · objeto específico 3 · genérico 4 (por defecto según la categoría)
//   moods     ánimos del director que lo prefieren cuando el verso no nombra nada
//   variantes ids extra que se eligen al azar con la semilla de la toma (ej. ['love_b', 'love_c'])
// RISO.people.detect(texto, límite) devuelve los ids que el verso nombra, por prioridad,
// respetando los interruptores de ajustes (CFG.catOff) y la frecuencia (CFG.catFreq).
// ============================================================
(() => {
  const R = window.RISO; if (!R) return;
  const PRIO = { famosos: 0, oficios: 1, deportes: 1, banderas: 1, paises: 1, emociones: 2, comida: 3, animales: 3, naturaleza: 3, transporte: 3, tecnologia: 3, musica: 3, simbolos: 3, fiestas: 3, ropa: 3, objetos: 4 };
  const RX = [], names = {}, cats = {}, info = {}, moodProps = {};
  const add = e => {
    if (!e || !e.id || !/^[a-z0-9_]+$/.test(e.id)) throw new Error('riso-catalog: id inválido ' + (e && e.id));
    if (info[e.id]) { const m = 'riso-catalog: id repetido «' + e.id + '»'; if (window.RISO_DEV) throw new Error(m); console.warn(m); return; }
    if (R.props && R.props.DEFS && !R.props.DEFS[e.id] && window.RISO_DEV) throw new Error('riso-catalog: «' + e.id + '» no tiene dibujo');
    const prio = e.prio ?? PRIO[e.cat] ?? 4, rx = e.alias instanceof RegExp ? e.alias : new RegExp(e.alias, 'i');
    info[e.id] = { ...e, prio, alias: rx }; (cats[e.cat] = cats[e.cat] || []).push(e.id); names[e.id] = e.label || e.id.toUpperCase();
    let i = RX.length; while (i > 0 && RX[i - 1][2] > prio) i--; RX.splice(i, 0, [e.id, rx, prio]);     // estable: dentro de una prioridad, el orden de registro
    for (const m of e.moods || []) (moodProps[m] = moodProps[m] || []).push(e.id);
    if (e.variantes?.length) R.props.variants[e.id] = [e.id, ...e.variantes];
  };
  const off = cat => { try { if (!window.CFG) return false; if (cat === 'banderas' && CFG.symbols === false) return true; return !!(CFG.catOn && CFG.catOn[cat] === false); } catch (e) { return false; } };
  const detect = (text, limit = 3) => {
    if (!text) return []; const out = [];
    for (const [id, rx] of RX) { if (out.length >= limit) break; if (off(info[id]?.cat)) continue; if (rx.test(text)) out.push(id); }
    const f = window.CFG && CFG.catFreq != null ? +CFG.catFreq : 1;               // 0 a 1: probabilidad de mostrar lo que se nombra
    return f >= 1 || !out.length ? out : (Math.random() < f ? out : []);
  };
  const pickVariant = (id, r) => { const v = R.props.variants[id]; return v && v.length > 1 ? v[Math.floor(r() * v.length)] : id; };
  // ---------- ajustes: un chip por categoría y un deslizador de frecuencia ----------
  const catLabel = {};
  function label(cat, text) {
    catLabel[cat] = text; if (!window.SETUI || !window.CFG) return;
    if (!label.row) { SETUI.addRow('contenido', ['catOn', 'Qué dibujar cuando se nombra', 'chips', [], 'apaga las categorías que no quieras ver en el clip'], {}); SETUI.addRow('contenido', ['catFreq', 'Frecuencia de lo nombrado', 'range', [.1, 1, .05], 'con qué frecuencia aparece un dibujo cuando el verso lo nombra'], 1); label.row = 1; }
    if (!CFG.catOn) CFG.catOn = {}; if (CFG.catOn[cat] === undefined) CFG.catOn[cat] = true;
    const g = document.querySelector('[data-chips=catOn]'); if (g && !g.querySelector(`[data-cv="${cat}"]`)) { const b = document.createElement('button'); b.dataset.cv = cat; b.textContent = text; g.appendChild(b); }
    if (typeof syncUI === 'function') syncUI();
  }
  R.catalog = { add, label, info, cats, moodProps, pickVariant, get count() { return Object.keys(info).length; } };
  R.people = R.people || { RX, names, detect };
  Object.assign(R.people, { RX, names, detect });
})();
