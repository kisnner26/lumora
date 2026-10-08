// objetos de continuidad: una carta, una partida, un umbral, un recuerdo.
(() => {
  const R = window.RISO; if (!R?.lib) return;
  const { add, L } = R.lib;
  const a = (id, label, rx, shapes, moods = ['nostalgico', 'melancolico']) => add(id, 'relatos', label, rx, shapes, { moods, prio: 2 });
  R.catalog.label('relatos', 'relatos');
  a('carta_abierta', 'carta abierta', /\b(carta de amor|love letters?|carta abierta|open letter|sobre abierto|envelope)\b/i, [
    { p: 'M-160 -40 L0 -150 L160 -40 V130 H-160 Z', f: 3, ft: .35, s: 8 },
    { p: L.rect(-105, -115, 210, 190), f: -1, s: 6 }, { p: 'M-70 -70 H70 M-70 -35 H55 M-70 0 H35', s: 4 },
    { p: 'M-160 -40 L0 65 L160 -40 M-160 130 L-45 35 M160 130 L45 35', s: 7 },
  ]);
  a('maleta_viaje', 'maleta de viaje', /\b(maletas?|suitcases?|packed my bags|pack your bags|empac[oó]|equipaje|luggage)\b/i, [
    { p: L.rr(-140, -100, 280, 240, 18), f: 3, ft: .6, s: 9 }, { p: 'M-45 -100 V-145 H45 V-100', s: 9 },
    { p: 'M-85 -100 V140 M85 -100 V140', s: 7 }, { p: L.rect(-100, -15, 30, 45), f: 2, s: 5 },
    { p: L.rect(70, -15, 30, 45), f: 2, s: 5 }, { p: 'M-110 140 V160 M110 140 V160', s: 12 },
  ]);
  a('puerta_entreabierta', 'puerta entreabierta', /\b(puerta entreabierta|open door|half open door|threshold)\b/i, [
    { p: 'M-120 170 V-170 H120 V170', s: 10 }, { p: 'M-100 -150 L60 -120 V155 L-100 170 Z', f: 3, ft: .5, s: 8 },
    { p: 'M60 -120 L110 -150 V170 L60 155 Z', f: 2, ft: .45, s: 4 }, { c: [30, 25, 8], f: 1, s: 4 },
    { p: 'M-180 175 H180', s: 7 },
  ]);
  a('ventana_lluvia', 'ventana con lluvia', /\b(ventana con lluvia|rainy window|windowpane|cristal mojado)\b/i, [
    { p: L.rect(-135, -155, 270, 300), f: 3, ft: .3, s: 9 }, { p: 'M0 -155 V145 M-135 -5 H135', s: 8 },
    ...[-100, -60, 50, 95].map((x, i) => ({ p: `M${x} ${-110 + i * 30} L${x - 10} ${-75 + i * 30}`, s: 4, i: 2 })),
    { p: 'M-160 155 H160', s: 12 },
  ]);
  a('foto_rota', 'fotografía rota', /\b(foto rota|torn photograph|old photograph|fotograf[ií]a|photographs?|polaroid|foto vieja)\b/i, [
    { p: 'M-140 -160 H-10 L15 -85 L-20 -20 L20 65 L-10 165 H-140 Z', f: -1, s: 8 },
    { p: 'M10 -160 H140 V165 H10 L40 65 L0 -20 L35 -85 Z', f: -1, s: 8 },
    { p: 'M-115 -130 H-25 V100 H-115 Z M45 -130 H115 V100 H45 Z', f: 3, ft: .45, s: 4 },
    { c: [-75, -55, 24], f: 1, s: 3 }, { p: 'M-105 90 Q-100 -20 -45 -15 L-30 90 Z', f: 1, s: 4 },
  ]);
  a('banco_vacio', 'banco vacío', /\b(banco vac[ií]o|empty bench|park bench|banca|waiting for you|te espero|esper[aá]ndote)\b/i, [
    { p: L.rect(-150, -80, 300, 35), f: 3, ft: .6, s: 7 }, { p: L.rect(-150, -25, 300, 35), f: 3, ft: .6, s: 7 },
    { p: 'M-170 40 H170 V65 H-170 Z', f: 2, s: 7 }, { p: 'M-120 -80 V150 M120 -80 V150 M-120 100 H120', s: 9 },
  ]);
  a('hilo_rojo', 'hilo que une', /\b(hilo rojo|red thread|tied to you|atad[oa] a ti|destino compartido|invisible string)\b/i, [
    { p: 'M-180 -50 C-90 -170 -80 160 0 30 C80 -100 90 160 180 50', s: 8, i: 2 },
    { c: [-175, -50, 15], f: -1, s: 6 }, { c: [175, 50, 15], f: -1, s: 6 },
  ], ['romantico']);
  a('puente_camino', 'puente', /\b(puentes?|bridges?|cross the river|cruzar el r[ií]o)\b/i, [
    { p: 'M-180 80 Q0 -100 180 80 M-180 100 Q0 -80 180 100', s: 8 },
    ...[-150, -100, -50, 0, 50, 100, 150].map(x => ({ p: `M${x} ${-10 + x * x / 300} V${20 + x * x / 300}`, s: 5 })),
    { p: 'M-180 145 Q-90 120 0 145 Q90 170 180 145', s: 5, i: 3 },
  ], ['sereno', 'nostalgico']);
  a('escalera_salida', 'escalera', /\b(escaleras?|stairs?|stairway|steps to|pelda[nñ]os?)\b/i, [
    { p: 'M-160 160 V100 H-100 V40 H-40 V-20 H20 V-80 H80 V-140 H150 V160 Z', f: 3, ft: .4, s: 8 },
    { p: 'M-160 65 L150 -190 M-130 45 V100 M-10 -55 V-20 M110 -155 V-140', s: 6 },
  ], ['sereno', 'desafiante']);
  a('faro_costa', 'faro', /\b(faros?|lighthouse|beacon|guiding light|luz que gu[ií]a)\b/i, [
    { p: 'M-65 165 L-35 -100 H35 L65 165 Z', f: -1, s: 8 }, { p: 'M-45 -20 H45 M-52 60 H52', s: 16, i: 2 },
    { p: L.rect(-45, -140, 90, 40), f: 2, s: 7 }, { p: 'M-60 -140 L0 -185 L60 -140 Z', f: 1, s: 7 },
    { p: 'M-50 -120 L-185 -170 M50 -120 L185 -170', s: 5, i: 2 },
  ], ['sereno']);
  a('semilla_brote', 'brote nuevo', /\b(semillas?|seeds?|sprout|brote|volver a crecer|grow again|start again|empezar de nuevo)\b/i, [
    { p: 'M-170 140 Q0 100 170 140', s: 8 }, { p: 'M0 130 V-60', s: 8 },
    { p: 'M0 20 Q-120 20 -105 -90 Q-5 -95 0 20 Z', f: 3, ft: .65, s: 7 },
    { p: 'M0 -20 Q5 -130 110 -140 Q120 -30 0 -20 Z', f: 2, ft: .65, s: 7 },
    { p: 'M-70 -60 L0 20 L75 -105', s: 4 },
  ], ['feliz', 'sereno']);
  for (const [base, variant] of [['puerta', 'puerta_entreabierta'], ['ventana', 'ventana_lluvia'], ['carta', 'carta_abierta'], ['maleta', 'maleta_viaje']]) {
    R.catalog.grupo(base, [base, variant]); R.catalog.vincular(base, variant);
  }
  a('silla_ausente', 'silla vacía', /\b(silla vac[ií]a|empty chair|your empty seat|tu lugar vac[ií]o)\b/i, [
    { p: L.rr(-75, -160, 150, 140, 18), f: 3, ft: .4, s: 8 }, { p: 'M-75 -20 V45 M75 -20 V45', s: 8 },
    { p: 'M-100 45 H100 V70 H-100 Z', f: 2, s: 7 }, { p: 'M-80 70 L-100 170 M80 70 L100 170', s: 10 },
  ]);
})();
