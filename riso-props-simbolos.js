// ============================================================
// riso-props-simbolos.js — cuerpo y símbolos (oleada 1 del catálogo). Ver riso-props-lib.js.
// ============================================================
(() => {
  const R = window.RISO; if (!R || !R.lib) return;
  const { add, L } = R.lib, PI = Math.PI, C = 'simbolos';
  const A = (id, label, rx, shapes, opt) => add(id, C, label, rx, shapes, opt);

  A('manos_tocan', 'MANOS', /\b(manos?|hands?|holding hands|agarrad[oa]s de la mano|tu mano|your hand|de la mano)\b/i, [
    { p: 'M-160 40 C-120 10 -80 -10 -30 -10 L30 -10 C50 -10 50 20 30 20 H-10', f: 3, ft: .6, s: 9 }, { p: 'M-30 20 C-10 20 20 20 30 20 C40 30 30 45 10 45 H-30', s: 7 },
    { p: 'M160 -10 C120 -40 70 -50 20 -40 C0 -30 -10 -10 10 0 C30 0 60 0 80 20 C90 40 70 55 40 50 H-10', f: 2, ft: .75, s: 9, m: 'bob', a: 3 }, { p: L.heart(0, -110, 3.4), f: 2, ft: .9, s: 6, m: 'pulse', a: .15, o: [0, -110] },
  ], { moods: ['romantico'] });
  A('puno', 'PUÑO', /\b(pu[nñ]os?|fists?|resist\w*|fight back|levanta el pu[nñ]o|raise your fist|power to)\b/i, [
    { p: 'M-70 -20 C-70 -100 90 -100 90 -20 V80 C90 130 -70 130 -70 80 Z', f: 2, ft: .8, s: 10, m: 'beat', a: .05, o: [10, 40] }, { p: 'M-70 -20 H90 M-70 20 H90 M-70 55 H90', s: 6 }, { p: 'M-70 -20 C-110 -10 -120 30 -90 50', s: 8 },
    { p: 'M-40 130 V180 H70 V130', f: 3, ft: .5, s: 8 }, { p: 'M-130 -100 L-160 -130 M130 -100 L160 -130 M0 -130 V-170', s: 6, m: 'pulse', a: .2, o: [10, -30], v: 2 },
  ], { moods: ['rabioso', 'desafiante'] });
  A('mano_abierta', 'MANO ABIERTA', /\b(mano abierta|open hand|palm|palma|high five|choca esos|hello hand|saludo|saludar|wave)\b/i, [
    { p: 'M-70 150 C-100 90 -100 40 -100 -10 L-70 -20 L-60 50 V-120 C-60 -140 -30 -140 -30 -120 V-30 V-160 C-30 -180 0 -180 0 -160 V-30 V-150 C0 -170 30 -170 30 -150 V-20 V-110 C30 -130 60 -130 60 -110 V30 C80 10 110 10 110 40 C110 100 90 140 70 150 Z', f: 2, ft: .7, s: 9, m: 'sway', a: .06, o: [0, 150] },
    { p: 'M-40 90 C-10 110 30 110 60 90', s: 4 },
  ]);
  A('pie_descalzo', 'PIES', /\b(descalz[oa]s?|barefoot|pies?|feet|foot|footprints?|huellas de pies|toes?)\b/i, [
    { p: 'M-30 -120 C-60 -100 -60 -20 -40 40 C-30 90 -50 130 -20 160 C20 175 50 150 40 100 C30 60 50 20 50 -30 C50 -90 20 -140 -30 -120 Z', f: 2, ft: .7, s: 10 },
    { c: [-40, -150, 16], f: 2, ft: .8, s: 7 }, { c: [-5, -165, 14], f: 2, ft: .8, s: 7 }, { c: [27, -160, 13], f: 2, ft: .8, s: 7 }, { c: [53, -145, 12], f: 2, ft: .8, s: 7 }, { c: [72, -120, 11], f: 2, ft: .8, s: 7 },
    { p: 'M90 100 C110 80 140 90 130 120 C120 150 90 140 90 100 Z', f: 3, ft: .5, s: 5, m: 'fall', a: 10, v: .3 },
  ], { g: { r: .2, dx: -20 } });
  A('labios', 'LABIOS', /\b(labios?|lips?|kiss\w*|besos?|besar|bes[oó]|boca|mouth|lipstick|labial)\b/i, [
    { p: 'M-150 0 C-110 -60 -50 -70 0 -40 C50 -70 110 -60 150 0 C110 20 50 30 0 20 C-50 30 -110 20 -150 0 Z', f: 2, ft: .95, s: 10, m: 'beat', a: .06, o: [0, 20] },
    { p: 'M-150 0 C-100 90 100 90 150 0 C110 20 50 30 0 20 C-50 30 -110 20 -150 0 Z', f: 2, ft: .85, s: 10 }, { p: 'M-150 0 C-110 15 -50 25 0 20 C50 25 110 15 150 0', s: 6 },
    { p: 'M-60 -40 L-30 -50', s: 4, i: 3, m: 'pulse', a: .2, o: [-45, -45] }, { p: L.heart(100, -110, 2.5), f: 2, ft: .9, s: 0, m: 'bob', a: 5 },
  ], { moods: ['romantico', 'euforico'] });
  A('boca_canta', 'VOZ', /\b(sing\w*|cantar|cant[oó]|canta|voz|voice|scream\w*|gritar|grit[oó]|shout|yell|singing)\b/i, [
    { e: [0, 30, 100, 80], f: 1, ft: .95, s: 10, m: 'pulse', a: .15, o: [0, 30], b: 1.5 }, { p: 'M-70 20 H70 M-60 60 H60', s: 5 }, { e: [0, 70, 60, 28], f: 2, ft: .9, s: 6 },
    { p: 'M130 -30 C160 -50 160 -100 130 -120 M160 -10 C210 -50 210 -110 160 -150', s: 6, m: 'pulse', a: .1, o: [100, -60], v: 3 }, { p: 'M-130 -30 C-160 -50 -160 -100 -130 -120', s: 6, m: 'pulse', a: .1, o: [-100, -60], v: 3 },
    { p: L.rr(-24, -140, 48, 60, 24), s: 0 },
  ], { moods: ['euforico', 'desafiante'] });
  A('cerebro', 'MENTE', /\b(cerebro|brain|mente|mind|pensamientos?|thoughts?|overthink\w*|pensar|think\w*|cabeza|head)\b/i, [
    { p: 'M0 -130 C-80 -160 -160 -100 -140 -30 C-170 10 -150 80 -100 90 C-90 130 -30 150 0 120 C30 150 90 130 100 90 C150 80 170 10 140 -30 C160 -100 80 -160 0 -130 Z', f: 2, ft: .6, s: 10, m: 'pulse', a: .03, o: [0, 0], b: 1.5 },
    { p: 'M0 -130 V120 M-100 -60 C-60 -70 -40 -40 -70 -10 M100 -60 C60 -70 40 -40 70 -10 M-110 30 C-70 20 -50 50 -80 70 M110 30 C70 20 50 50 80 70', s: 5 },
    { p: 'M40 -180 L20 -150 L45 -150 L25 -120', s: 5, m: 'beat', a: .2, o: [30, -150], i: 2 },
  ]);
  A('corazon_anat', 'LATIDO', /\b(latido|latidos|heartbeat|beating heart|pulse|pulso|latiendo|beats?\b|coraz[oó]n latiendo)\b/i, [
    { p: 'M0 -100 C-70 -170 -170 -100 -110 0 C-70 70 -20 100 0 150 C20 100 70 70 110 0 C170 -100 70 -170 0 -100 Z', f: 2, ft: .85, s: 10, m: 'beat', a: .12, o: [0, 0] },
    { p: 'M-30 -120 C-30 -170 -60 -190 -70 -170 M30 -120 C30 -180 70 -180 80 -160', s: 9 }, { p: 'M-60 -30 C-30 -60 0 -30 -20 0', s: 4 },
    { p: 'M-180 170 H-90 L-70 130 L-40 200 L-10 150 H180', s: 5, m: 'drift', a: 8 },
  ], { moods: ['romantico', 'euforico'] });
  A('esqueleto', 'ESQUELETO', /\b(esqueletos?|skeletons?|bones?|huesos?|ribs|costillas|skull and bones|calaveras y huesos)\b/i, [
    { c: [0, -130, 42], f: -1, s: 9 }, { c: [-16, -136, 10], f: 1 }, { c: [16, -136, 10], f: 1 }, { p: 'M-16 -100 H16', s: 5 },
    { p: 'M0 -88 V60', s: 10 }, { p: 'M-60 -50 C-30 -70 30 -70 60 -50 M-55 -20 C-30 -40 30 -40 55 -20 M-50 10 C-25 -10 25 -10 50 10', s: 8 },
    { p: 'M-40 70 H40 L30 110 H-30 Z', f: -1, s: 8 }, { p: 'M-20 110 L-30 170 M20 110 L30 170', s: 10 }, { p: 'M-60 -50 L-100 30 L-80 90 M60 -50 L100 30 L80 90', s: 8, m: 'sway', a: .05, o: [0, -50] },
  ], { moods: ['oscuro'] });
  A('huella', 'HUELLA DIGITAL', /\b(huellas? digitales?|fingerprints?|identidad|identity|who am i|qui[eé]n soy|thumbprint)\b/i, [
    { e: [0, 0, 110, 150], f: 3, ft: .25, s: 8 }, { e: [0, 0, 88, 124], s: 6 }, { e: [0, 0, 66, 98], s: 6 }, { e: [0, 0, 44, 72], s: 6 }, { e: [0, 0, 22, 46], s: 6 },
    { p: 'M-40 90 C-60 50 -40 10 0 10 C40 10 60 50 40 90', s: 6, m: 'pulse', a: .03, o: [0, 0] },
  ]);
  A('sombra', 'SOMBRA', /\b(sombras?|shadows?|silhouettes?|siluetas?|dark side|lado oscuro|follows me|me sigue)\b/i, [
    { p: 'M-60 170 L200 200 L190 150 L40 150 Z', f: 1, ft: .45, s: 0, m: 'drift', a: 8 }, { p: 'M-60 170 L200 200', s: 4, m: 'drift', a: 8 },
    { c: [-70, -110, 34], f: 1, ft: .95, s: 9 }, { p: 'M-110 -60 H-30 L-20 30 H-40 L-42 170 H-70 L-72 30 H-90 Z', f: 1, ft: .95, s: 9, m: 'sway', a: .02, o: [-70, 170] },
    { p: 'M-110 -60 L-135 20 M-30 -60 L-5 20', s: 9 }, { p: L.cloud(90, -110, .5), f: 3, ft: .25, s: 5 },
  ], { moods: ['oscuro', 'melancolico'] });
  A('espejo_roto', 'ESPEJO ROTO', /\b(espejo roto|broken mirror|shattered|hecho pedazos|pedazos|shards?|pieces|fragments|rota por dentro)\b/i, [
    { e: [0, 0, 120, 165], f: 3, ft: .4, s: 11 }, { e: [0, 0, 100, 145], s: 4, st: .8 }, { p: 'M20 -30 L-90 -110 M20 -30 L100 -70 M20 -30 L60 100 M20 -30 L-80 70 M20 -30 L10 -150', s: 6, m: 'beat', a: .02, o: [20, -30] },
    { p: 'M20 -30 L80 -100 L104 -50 Z', f: -1, s: 5, m: 'drift', a: 4 }, { p: 'M-80 70 L-40 110 L-100 100 Z', f: 2, ft: .5, s: 4 }, { p: 'M-55 100 L-75 180 M55 100 L75 180 M-90 185 H90', s: 9 },
  ], { moods: ['triste', 'rabioso'] });
  A('cadena_rota', 'CADENA ROTA', /\b(cadenas? rotas?|broken chains?|free at last|libre|libertad|liberty|freedom|break free|romper las cadenas|free)\b/i, [
    { e: [-120, -20, 50, 30, -.3], s: 12 }, { e: [-60, 10, 50, 30, .3], s: 12 }, { p: 'M-20 20 L10 50 M-4 -6 L28 24', s: 9, m: 'sway', a: .12, o: [0, 30] },
    { e: [70, 50, 50, 30, -.3], s: 12, m: 'sway', a: .1, o: [30, 30] }, { e: [130, 90, 50, 30, .3], s: 12, m: 'sway', a: .1, o: [30, 30] },
    { p: L.star(-10, -70, 22, 6, .4), f: 2, ft: .9, s: 5, m: 'pulse', a: .3, o: [-10, -70], v: 3 }, { p: 'M-30 20 L-40 -20 M20 30 L40 -10', s: 5, m: 'beat', a: .2, o: [0, 20] },
  ], { moods: ['desafiante', 'euforico'] });
  A('puerta_abierta', 'PUERTA ABIERTA', /\b(puertas? abiertas?|open door|abre la puerta|open the door|welcome|bienvenid[oa]|come in|entra|adelante)\b/i, [
    { p: L.rect(-100, -170, 200, 340), f: 2, ft: .55, s: 9 }, { p: 'M-60 -160 L80 -140 V150 L-60 170 Z', f: 3, ft: .3, s: 0 }, { p: 'M-100 -170 L-170 -140 V190 L-100 170 Z', f: 1, ft: .55, s: 9, m: 'sway', a: .02, o: [-100, 0] },
    { c: [-140, 10, 10], f: 2, s: 5 }, { p: 'M-30 170 L40 40 L100 170', s: 0 }, { p: 'M-40 -130 L-40 150 M40 -125 L40 145', s: 3, m: 'pulse', a: .15, o: [0, 0] },
  ]);
  A('camino', 'CAMINO', /\b(caminos?|paths?|sendero|trail|journey|footpath|el camino|walk this way|camino largo|long road)\b/i, [
    { p: 'M-30 -110 L30 -110 L170 180 L-170 180 Z', f: 2, ft: .55, s: 10 }, { p: 'M0 -100 V-70 M0 -40 V0 M0 30 V80 M0 110 V170', s: 8, i: 1, m: 'fall', a: 26, v: 1.4 },
    { p: 'M-170 -20 C-100 -60 -80 -110 -30 -110 M170 -20 C100 -60 80 -110 30 -110', f: 3, ft: .5, s: 6 }, { c: [0, -150, 26], f: 2, ft: .9, s: 8, m: 'pulse', a: .08, o: [0, -150] },
    { p: 'M-130 130 C-170 110 -170 70 -140 60', s: 5, i: 2 }, { p: 'M140 120 C170 100 170 60 145 50', s: 5, i: 2 },
  ]);
  A('cruce_caminos', 'CRUCE DE CAMINOS', /\b(cruce de caminos|crossroads|dilema|dilemma|decisi[oó]n|decide|choose|elegir|choice|which way|qu[eé] camino)\b/i, [
    { p: 'M0 180 V-150', s: 12 }, { p: 'M-50 180 H50', s: 12 }, { p: 'M0 -130 H95 L128 -100 L95 -70 H0 Z', f: 2, ft: .85, s: 8, m: 'sway', a: .03, o: [0, -100] },
    { p: 'M0 -40 H-95 L-128 -10 L-95 20 H0 Z', f: 3, ft: .7, s: 8, m: 'sway', a: -.03, o: [0, -10] }, { p: 'M-30 -155 L30 -155 L0 -190 Z', f: 1, ft: .9, s: 6 }, { p: 'M-160 120 C-100 90 -70 110 -30 100 M30 100 C70 110 100 90 160 120', s: 4, i: 2 },
  ]);
  A('vela_consume', 'SE CONSUME', /\b(se consume|burning out|burn out|fading away|fade away|apag[aá]ndose|dwindl\w*|se apaga|running out|se acaba)\b/i, [
    { p: 'M-40 90 C-50 40 -30 20 -40 -10 C-20 -30 30 -20 40 -10 C30 20 50 40 40 90 Z', f: 3, ft: .6, s: 9 }, { p: 'M-40 90 C-30 120 -50 130 -40 150 H40 C50 130 30 120 40 90', f: 3, ft: .4, s: 7 },
    { p: 'M0 -14 V-30', s: 5 }, { p: 'M0 -34 C-30 -60 -14 -100 0 -130 C14 -100 30 -60 0 -34 Z', f: 2, ft: .9, s: 6, m: 'sway', a: .12, o: [0, -34] }, { p: 'M-60 155 H60', s: 9 },
    { p: 'M-50 130 C-90 120 -90 150 -60 150', s: 4, i: 2 },
  ], { moods: ['triste', 'melancolico'] });
  A('nudo', 'NUDO', /\b(nudo en la garganta|knot in my throat|knots?|tangled|enredad[oa]|entangle\w*|nudos?|tied up|lazos?|mo[nñ]os?|bows?|ribbons?|cintas?)\b/i, [
    { p: 'M0 0 C-70 -120 -175 -80 -150 0 C-130 70 -50 50 0 0 Z', f: 2, ft: .8, s: 10, m: 'sway', a: .03, o: [0, 0] }, { p: 'M0 0 C70 -120 175 -80 150 0 C130 70 50 50 0 0 Z', f: 2, ft: .8, s: 10, m: 'sway', a: -.03, o: [0, 0] },
    { p: 'M-110 -30 C-90 -50 -60 -40 -40 -20 M110 -30 C90 -50 60 -40 40 -20', s: 4 }, { p: 'M-8 20 C-30 90 -60 130 -95 165 M8 20 C30 90 60 130 95 165', s: 9, m: 'wag', a: .03, o: [0, 20] },
    { c: [0, 0, 32], f: 3, ft: .8, s: 9, m: 'beat', a: .1, o: [0, 0] },
  ]);
  A('hilo', 'AGUJA E HILO', /\b(hilos?|threads?|needles?|agujas?|sewing|coser|coses|stitch\w*|zurcir|costura|seamstress)\b/i, [
    { p: 'M-60 -170 L60 170', s: 6 }, { e: [-70, -140, 14, 34, -.3], f: -1, s: 6 }, { p: 'M-80 -150 C-160 -80 -140 20 -60 40 C10 60 60 0 30 -50 C0 -90 -80 -40 -20 30 C20 80 120 90 150 40', s: 5, i: 2, m: 'drift', a: 6 },
    { c: [130, 60, 24], f: 2, ft: .85, s: 8, m: 'spin', a: 1, o: [130, 60] }, { p: 'M130 60 L150 40', s: 4 },
  ]);
  A('telarana', 'TELARAÑA', /\b(telara[nñ]as?|spider ?webs?|cobwebs?|web of|atrapad[oa] en una red|red de|tangled web)\b/i, [
    { p: 'M0 0 L-170 -120 M0 0 L170 -120 M0 0 L-170 100 M0 0 L170 100 M0 0 V-190 M0 0 V190', s: 4 },
    { p: 'M-50 -30 L0 -50 L50 -30 L50 30 L0 50 L-50 30 Z', s: 5 }, { p: 'M-100 -60 L0 -100 L100 -60 L100 60 L0 100 L-100 60 Z', s: 5 }, { p: 'M-150 -100 L0 -160 L150 -100 L150 100 L0 160 L-150 100 Z', s: 5 },
    { c: [60, -100, 10], f: 1, s: 3, m: 'bob', a: 10 }, { p: 'M60 -90 V-60', s: 3, m: 'bob', a: 10 },
  ], { moods: ['oscuro'] });
  A('escalera_cielo', 'ESCALERA AL CIELO', /\b(escalera al cielo|stairway to heaven|stairs to heaven|highway to heaven|camino al cielo|way up)\b/i, [
    { p: 'M-120 170 H-60 V120 H0 V70 H60 V20 H120 V-30 H170', s: 10 }, { p: 'M-120 170 V190 M-60 120 V190', s: 5 }, { p: L.cloud(60, -110, .8), f: 3, ft: .35, s: 8, m: 'drift', a: 6 },
    { p: L.star(-40, -60, 18, 5, .4), f: 2, ft: .9, s: 4, m: 'pulse', a: .3, o: [-40, -60], v: 2 }, { p: 'M100 -30 V-70 M110 -30 L130 -60', s: 4 },
  ]);
  A('infinito', 'INFINITO', /\b(infinit\w*|infinity|forever and ever|para siempre|eternidad|eternity|eterno|endless|sin fin|por siempre)\b/i, [
    { p: 'M0 0 C-40 -80 -170 -80 -170 0 C-170 80 -40 80 0 0 C40 -80 170 -80 170 0 C170 80 40 80 0 0 Z', f: 2, ft: .45, s: 14, m: 'beat', a: .05, o: [0, 0] },
    { p: 'M0 0 C-40 -50 -130 -50 -130 0 C-130 50 -40 50 0 0 C40 -50 130 -50 130 0 C130 50 40 50 0 0', s: 5, i: 2, m: 'drift', a: 4 }, { c: [-120, -100, 6], f: 1, s: 0, m: 'bob', a: 8 }, { c: [130, 100, 6], f: 1, s: 0, m: 'bob', a: 8, ph: 1 },
  ], { moods: ['romantico', 'sereno'] });
  A('cruz', 'CRUZ', /\b(cruz|crosses?|cross|crucifi\w*|rosario|rosary|calvario)\b/i, [
    { p: 'M-30 -170 H30 V-70 H110 V-10 H30 V170 H-30 V-10 H-110 V-70 H-30 Z', f: 3, ft: .6, s: 11 }, { p: 'M0 -150 V150 M-90 -40 H90', s: 3, st: .7 },
    { p: 'M-150 -100 L-180 -130 M150 -100 L180 -130 M0 -190 V-215', s: 5, m: 'pulse', a: .15, o: [0, -40], v: 2 },
  ], { moods: ['triste', 'sereno'] });
  A('yin_yang', 'YIN YANG', /\b(yin yang|balance|equilibrio|dualidad|duality|light and dark|luz y oscuridad|opposites|opuestos)\b/i, [
    { c: [0, 0, 150], f: -1, s: 11, m: 'spin', a: .4, o: [0, 0] },
    { pts: (() => { const o = []; for (let i = 0; i <= 24; i++) { const a = -PI / 2 + i / 24 * PI; o.push([Math.cos(a) * 150, Math.sin(a) * 150]); } for (let i = 0; i <= 12; i++) { const a = PI / 2 + i / 12 * PI; o.push([Math.cos(a) * 75, 75 + Math.sin(a) * 75]); } for (let i = 0; i <= 12; i++) { const a = PI / 2 - i / 12 * PI; o.push([Math.cos(a) * 75, -75 + Math.sin(a) * 75]); } return o; })(), f: 1, ft: .95, s: 8, m: 'spin', a: .4, o: [0, 0] },
    { c: [0, -75, 22], f: -1, s: 0, m: 'spin', a: .4, o: [0, 0] }, { c: [0, 75, 22], f: 1, ft: .95, s: 0, m: 'spin', a: .4, o: [0, 0] },
  ]);
  A('paz', 'PAZ', /\b(paz|peace|peace sign|hippie|love and peace|no war|no m[aá]s guerra|make love not war|pacifis\w*)\b/i, [
    { c: [0, 0, 150], f: 3, ft: .25, s: 12, m: 'pulse', a: .03, o: [0, 0] }, { p: 'M0 -150 V150 M0 0 L-105 105 M0 0 L105 105', s: 12 },
    { p: 'M-60 -180 C-30 -200 30 -200 60 -180', s: 5, i: 2, m: 'drift', a: 6 },
  ], { moods: ['sereno', 'feliz'] });
  A('fantasma', 'FANTASMA', /\b(fantasmas?|ghosts?|spirits?|esp[ií]ritus?|haunt\w*|apariciones?|apparition|boo)\b/i, [
    { p: 'M-100 150 V-20 C-100 -160 100 -160 100 -20 V150 L70 120 L35 150 L0 120 L-35 150 L-70 120 Z', f: -1, s: 10, m: 'bob', a: 8 }, { c: [-36, -40, 16], f: 1, m: 'blink', o: [-36, -40] }, { c: [36, -40, 16], f: 1, m: 'blink', o: [36, -40] },
    { e: [0, 30, 20, 26], f: 1, ft: .9, s: 0, m: 'pulse', a: .2, o: [0, 30] }, { p: 'M-140 -60 L-170 -50 M140 -60 L170 -50', s: 5 },
  ], { moods: ['oscuro'] });
  A('rosa', 'ROSA', /\b(rosas?|roses?|red rose|rosa roja|ramo de rosas|bouquet of roses)\b/i, [
    { p: 'M0 40 C10 100 -10 130 0 190', s: 10, m: 'sway', a: .03, o: [0, 190] }, { p: 'M0 130 C-60 100 -95 120 -105 150 C-60 160 -20 150 0 130 Z', f: 3, ft: .8, s: 7 }, { p: 'M5 110 C50 90 85 100 100 125 C60 140 25 135 5 110 Z', f: 3, ft: .8, s: 7 },
    { p: 'M-95 -20 C-110 -100 -45 -135 0 -125 C50 -135 110 -100 95 -20 C85 45 40 62 0 62 C-40 62 -85 45 -95 -20 Z', f: 2, ft: .9, s: 10, m: 'pulse', a: .04, o: [0, -30] },
    { p: 'M-8 -85 C45 -90 55 -30 10 -22 C-35 -14 -42 -70 -2 -70 C25 -70 28 -38 8 -40', s: 6 }, { p: 'M-95 -20 C-70 10 -30 5 -12 -25 M95 -20 C70 10 30 5 12 -25 M-60 30 C-30 50 30 50 60 30', s: 5 },
  ], { moods: ['romantico'] });
  A('rosa_espinas', 'ESPINAS', /\b(espinas?|thorns?|prickly|spiky|thorny|pinchos?|barbed|de espinos)\b/i, [
    { p: 'M-160 100 C-100 40 -40 100 20 40 C80 -20 120 40 160 -20', s: 12, m: 'drift', a: 4 }, { p: 'M-120 70 L-130 30 M-60 90 L-50 130 M-10 70 L-20 30 M40 30 L30 -10 M100 20 L110 -30 M20 60 L40 100', s: 8 },
    { p: 'M60 -20 C40 -80 90 -110 110 -80 C130 -60 100 -30 80 -40', f: 2, ft: .85, s: 7, m: 'pulse', a: .08, o: [90, -70] },
  ], { moods: ['triste', 'rabioso'] });
  A('trebol', 'TRÉBOL', /\b(tr[eé]boles?|clovers?|four leaf|lucky charm|cuatro hojas|good luck|buena suerte|lucky)\b/i, [
    { c: [-55, -55, 55], f: 3, ft: .75, s: 9, m: 'pulse', a: .03, o: [0, 0] }, { c: [55, -55, 55], f: 3, ft: .75, s: 9, m: 'pulse', a: .03, o: [0, 0] }, { c: [-55, 55, 55], f: 3, ft: .75, s: 9, m: 'pulse', a: .03, o: [0, 0] }, { c: [55, 55, 55], f: 3, ft: .75, s: 9, m: 'pulse', a: .03, o: [0, 0] },
    { p: 'M-55 -55 L55 55 M55 -55 L-55 55', s: 3, st: .7 }, { p: 'M0 100 C10 150 40 170 70 190', s: 10 },
  ], { moods: ['feliz'] });
  A('estrella_fugaz', 'ESTRELLA FUGAZ', /\b(estrellas? fugaces?|shooting stars?|wish upon|falling star|meteor\w*|make a wish|pide un deseo|comet)\b/i, [
    { p: L.star(90, -60, 60, 5, .45), f: 2, ft: .9, s: 9, m: 'pulse', a: .08, o: [90, -60] }, { p: 'M50 -40 L-140 60 M40 -10 L-110 100 M60 -70 L-80 20', s: 6, m: 'drift', a: 10 },
    { p: 'M-140 60 C-120 80 -130 100 -110 100', s: 4, i: 2 }, { c: [130, 60, 6], f: 3, s: 0, m: 'pulse', a: .5, o: [130, 60], v: 3 }, { c: [-40, -120, 5], f: 2, s: 0, m: 'pulse', a: .5, o: [-40, -120], v: 4 },
  ], { moods: ['romantico', 'sereno', 'feliz'] });
  A('diente_leon', 'DIENTE DE LEÓN', /\b(diente de le[oó]n|dandelions?|soplar|blow away|blowing|soplo|deseos?|wishes)\b/i, [
    { p: 'M0 30 C-10 100 10 150 0 200', s: 9, m: 'sway', a: .03, o: [0, 200] }, { c: [0, -30, 24], f: 3, ft: .8, s: 6 },
    { p: 'M0 -30 L0 -130 M0 -30 L-70 -100 M0 -30 L70 -100 M0 -30 L-100 -40 M0 -30 L100 -40 M0 -30 L-80 30 M0 -30 L80 30', s: 4, m: 'sway', a: .03, o: [0, -30] },
    { c: [0, -135, 8], f: -1, s: 4 }, { c: [-72, -104, 8], f: -1, s: 4 }, { c: [72, -104, 8], f: -1, s: 4 }, { c: [-105, -40, 8], f: -1, s: 4 }, { c: [105, -40, 8], f: -1, s: 4 },
    { c: [140, -130, 8], f: -1, s: 4, m: 'drift', a: 30 }, { c: [-140, -150, 7], f: -1, s: 4, m: 'drift', a: 26, ph: 2 },
  ]);
  A('corazon_alas', 'CORAZÓN CON ALAS', /\b(coraz[oó]n con alas|winged heart|angel wings|alas de [aá]ngel|wings|alas|freedom to fly|volar alto)\b/i, [
    { p: 'M-40 -30 C-110 -90 -190 -60 -190 -10 C-150 -20 -130 0 -120 20 C-100 -10 -70 0 -60 30 C-50 10 -30 20 -20 40', f: -1, s: 8, m: 'flap', o: [-40, 0], v: .8 },
    { p: 'M40 -30 C110 -90 190 -60 190 -10 C150 -20 130 0 120 20 C100 -10 70 0 60 30 C50 10 30 20 20 40', f: -1, s: 8, m: 'flap', o: [40, 0], v: .8 },
    { p: L.heart(0, 0, 8), f: 2, ft: .9, s: 10, m: 'beat', a: .1, o: [0, 0] },
  ], { moods: ['romantico', 'feliz'] });
  A('corazon_candado', 'CORAZÓN CERRADO', /\b(coraz[oó]n cerrado|locked heart|guarded|no puedo amar|walls up|closed heart|muros|walls around)\b/i, [
    { p: L.heart(0, -20, 9), f: 2, ft: .8, s: 10 }, { p: L.rr(-50, 10, 100, 80, 12), f: 1, ft: .9, s: 8 }, { p: 'M-30 10 V-20 C-30 -70 30 -70 30 -20 V10', s: 9 }, { c: [0, 45, 10], f: -1, s: 0 }, { p: 'M0 50 V70', s: 6 },
    { p: 'M-140 -110 L-100 -90 M140 -110 L100 -90', s: 5, m: 'beat', a: .2, o: [0, -50] },
  ], { moods: ['triste', 'oscuro'] });
  A('corazon_llama', 'CORAZÓN EN LLAMAS', /\b(coraz[oó]n en llamas|heart on fire|burning love|pasi[oó]n|passion|deseo ardiente|fuego en el coraz[oó]n|on fire|ardiendo)\b/i, [
    { p: L.heart(0, 30, 8.5), f: 2, ft: .9, s: 10, m: 'beat', a: .08, o: [0, 30] }, { p: 'M-60 -80 C-90 -130 -40 -140 -50 -190 C-10 -160 -10 -110 -60 -80 Z', f: 2, ft: .9, s: 6, m: 'sway', a: .1, o: [-60, -80] },
    { p: 'M10 -100 C-20 -160 40 -170 30 -220 C80 -180 70 -130 10 -100 Z', f: 2, ft: .9, s: 6, m: 'sway', a: .1, o: [10, -100], ph: 1 }, { p: 'M70 -80 C50 -120 90 -130 90 -170 C120 -140 110 -100 70 -80 Z', f: 2, ft: .9, s: 6, m: 'sway', a: .1, o: [70, -80], ph: 2 },
  ], { g: { dy: 20, s: .9 }, moods: ['euforico', 'rabioso', 'romantico'] });
  A('ojo_llora', 'OJO LLORANDO', /\b(ojos? llorosos?|crying eyes?|teary eyes?|llorando|crying|sollozo|sobbing|weeping|llanto|tears in my eyes)\b/i, [
    { p: 'M-150 -20 C-80 -110 80 -110 150 -20 C80 60 -80 60 -150 -20 Z', f: -1, s: 10 }, { c: [0, -20, 52], f: 3, ft: .8, s: 8 }, { c: [0, -20, 24], f: 1, ft: .95, s: 0 }, { c: [-14, -34, 9], f: -1, s: 0 },
    { p: 'M-150 -20 C-160 -60 -120 -90 -90 -90', s: 6 }, { p: 'M-40 50 C-60 100 -20 120 -40 160 C-10 160 -10 90 -40 50 Z', f: 3, ft: .8, s: 6, m: 'fall', a: 60 }, { p: 'M50 60 C30 110 70 130 50 170 C80 170 80 100 50 60 Z', f: 3, ft: .8, s: 6, m: 'fall', a: 60, ph: .5 },
  ], { moods: ['triste', 'melancolico'] });
  A('pelo', 'CABELLO', /\b(cabello|hair|melena|pelo|hairstyle|long hair|pelo largo|peinar|comb|curls?|rizos?)\b/i, [
    { p: 'M-60 -170 C-150 -100 -100 0 -140 100 C-150 150 -110 190 -70 190 C-90 130 -50 60 -40 -20 C-30 -90 -30 -130 -60 -170 Z', f: 1, ft: .9, s: 9, m: 'sway', a: .03, o: [-60, -170] },
    { p: 'M-40 -175 C60 -190 130 -110 120 0 C110 90 150 140 110 190 C90 130 60 80 70 0 C80 -70 30 -130 -40 -175 Z', f: 1, ft: .9, s: 9, m: 'sway', a: -.03, o: [-40, -175] },
    { p: 'M-30 -120 C-10 -60 -30 20 -10 80 M30 -110 C50 -50 30 30 50 90', s: 4, i: 2, m: 'sway', a: .03, o: [0, -120] },
  ]);
  A('pulgar_arriba', 'ME GUSTA', /\b(likes?|me gusta|thumbs? up|pulgar|good job|bien hecho|approved|aprobad[oa]|great)\b/i, [
    { p: 'M-130 20 H-60 V170 H-130 Z', f: 3, ft: .7, s: 9 }, { p: 'M-60 40 C-10 20 20 -40 20 -110 C20 -160 80 -150 80 -100 C80 -70 60 -40 60 -20 H130 C160 -20 160 30 130 40 C150 60 150 100 120 110 C140 130 130 170 100 170 H-60', f: 2, ft: .8, s: 9, m: 'bob', a: 4, b: 2 },
    { p: 'M60 60 H110 M50 110 H100', s: 4 },
  ]);
})();
