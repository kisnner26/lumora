// ============================================================
// riso-props-emociones.js — emociones como imágenes simbólicas (oleada 2 del catálogo). Ver riso-props-lib.js.
// ============================================================
(() => {
  const R = window.RISO; if (!R || !R.lib) return;
  const { add, L } = R.lib, C = 'emociones';
  const A = (id, label, rx, shapes, opt) => add(id, C, label, rx, shapes, opt);
  const fig = (x, y, k = 1, ft = .8) => [{ c: [x, y - 60 * k, 20 * k], f: 1, ft: .9, s: 7 }, { p: `M${x} ${y - 38 * k} V${y + 30 * k} M${x - 26 * k} ${y - 10 * k} H${x + 26 * k} M${x} ${y + 30 * k} L${x - 20 * k} ${y + 80 * k} M${x} ${y + 30 * k} L${x + 20 * k} ${y + 80 * k}`, s: 7 }];

  A('soledad', 'SOLEDAD', /\b(soledad|solitari[oa]s?|lonely|loneliness|alone|solitude)\b/i, [
    { p: 'M-190 120 H190', s: 8 }, ...fig(-20, 40, 1.1), { p: 'M-20 120 L150 120 L170 132 L0 132 Z', f: 3, ft: .35, s: 0 },
    { c: [130, -120, 40], f: 2, ft: .55, s: 7, m: 'pulse', a: .04, o: [130, -120] }, { p: 'M-160 -100 C-140 -110 -120 -110 -100 -100', s: 4, m: 'drift', a: 10 },
  ], { moods: ['triste', 'melancolico'] });
  A('miedo', 'MIEDO', /\b(miedo|temor|susto|asustad[oa]s?|pánico|panico|terror|fear|afraid|scared|frightened|horror)\b/i, [
    { c: [0, 0, 170], f: 3, ft: .8, s: 0 }, { e: [-55, -20, 38, 46], f: -1, s: 7 }, { e: [55, -20, 38, 46], f: -1, s: 7 }, { c: [-55, -20, 10], f: 1, s: 0, m: 'wag', a: .1, o: [-55, -20] }, { c: [55, -20, 10], f: 1, s: 0, m: 'wag', a: .1, o: [55, -20] },
    { p: 'M-80 -85 L-30 -70 M80 -85 L30 -70', s: 7 }, { p: 'M-40 70 L-20 60 L0 72 L20 60 L40 70', s: 6, m: 'wag', a: .03, o: [0, 65] },
  ], { moods: ['oscuro', 'rabioso'] });
  A('ira', 'IRA', /\b(ira|rabia|furia|enojo|enojad[oa]s?|enfadad[oa]s?|coraje|angry|anger|rage|fury|furious)\b/i, [
    { p: 'M0 -180 L30 -90 L110 -140 L80 -50 L180 -40 L100 20 L160 110 L60 80 L40 180 L0 100 L-40 180 L-60 80 L-160 110 L-100 20 L-180 -40 L-80 -50 L-110 -140 L-30 -90 Z', f: 1, ft: .9, s: 9, m: 'pulse', a: .08, o: [0, 0], v: 2 },
    { p: 'M-70 -30 L-20 -10 M70 -30 L20 -10', s: 10 }, { p: 'M-45 50 C-20 30 20 30 45 50', s: 8 }, { p: 'M-30 -190 L-40 -215', s: 0 },
  ], { moods: ['rabioso', 'desafiante'] });
  A('alegria', 'ALEGRÍA', /\b(alegr[ií]a|alegre|feliz|felicidad|contento|contenta|gozo|happy|happiness|joy|joyful|cheerful)\b/i, [
    { c: [0, 0, 90], f: 2, ft: .9, s: 9 }, { p: 'M-45 20 C-20 60 20 60 45 20', s: 8 }, { c: [-30, -20, 8], f: 1, s: 0 }, { c: [30, -20, 8], f: 1, s: 0 },
    { p: 'M0 -120 V-170 M0 120 V170 M-120 0 H-170 M120 0 H170 M85 -85 L120 -120 M-85 -85 L-120 -120 M85 85 L120 120 M-85 85 L-120 120', s: 8, m: 'spin', a: .5, o: [0, 0] },
    { p: L.star(-150, -140, 14, 4, .4), f: 3, ft: .9, s: 4, m: 'bob', a: 8 }, { p: L.star(150, 140, 14, 4, .4), f: 1, ft: .9, s: 4, m: 'bob', a: 8, ph: 2 },
  ], { moods: ['feliz', 'euforico', 'sereno'] });
  A('nostalgia', 'NOSTALGIA', /\b(nostalgia|nost[aá]lgic[oa]s?|a[nñ]oranza|a[nñ]orar|a[nñ]oro|recuerdos?|memories|remember when|nostalgic|homesick)\b/i, [
    { p: L.rect(-120, -140, 240, 290), f: -1, s: 9, m: 'sway', a: .03, o: [0, 150] }, { p: L.rect(-95, -115, 190, 190), f: 3, ft: .55, s: 6, m: 'sway', a: .03, o: [0, 150] },
    { c: [40, -50, 30], f: 2, ft: .9, s: 5, m: 'sway', a: .03, o: [0, 150] }, { p: 'M-95 75 L-40 0 L0 50 L40 15 L95 75 Z', f: 1, ft: .7, s: 5, m: 'sway', a: .03, o: [0, 150] }, { p: 'M-70 110 H50', s: 4, m: 'sway', a: .03, o: [0, 150] },
  ], { moods: ['nostalgico', 'melancolico'] });
  A('esperanza', 'ESPERANZA', /\b(esperanza|esperanzad[oa]|ilusi[oó]n|hope|hopeful|hoping)\b/i, [
    { p: 'M-190 130 H-30 L-10 150 L20 120 L190 130', s: 9 }, { p: 'M0 125 C0 60 0 20 0 -30', s: 9, m: 'sway', a: .03, o: [0, 125] },
    { p: 'M0 20 C-60 30 -90 -10 -80 -50 C-30 -40 0 -10 0 20 Z', f: 1, ft: .9, s: 6, m: 'sway', a: .05, o: [0, 20] }, { p: 'M0 -20 C50 -10 80 -50 70 -90 C20 -80 -5 -50 0 -20 Z', f: 1, ft: .9, s: 6, m: 'sway', a: .05, o: [0, -20] },
    { c: [0, -150, 34], f: 2, ft: .95, s: 6, m: 'pulse', a: .06, o: [0, -150] }, { p: 'M0 -110 V-95 M-45 -125 L-58 -115 M45 -125 L58 -115 M-55 -160 H-75 M55 -160 H75 M-40 -195 L-52 -210 M40 -195 L52 -210', s: 6, m: 'pulse', a: .1, o: [0, -150] },
  ], { moods: ['sereno', 'feliz', 'romantico'] });
  A('celos', 'CELOS', /\b(celos|celoso|celosa|celosos|jealous|jealousy|envy|envidia|envidioso)\b/i, [
    { p: L.heart(-90, 40, 6), f: 2, ft: .9, s: 8 }, { p: L.heart(95, 40, 6), f: 3, ft: .7, s: 8 }, { p: 'M-190 -90 C-100 -160 100 -160 190 -90 C100 -30 -100 -30 -190 -90 Z', f: -1, s: 8 },
    { c: [40, -90, 34], f: 1, ft: .95, s: 6, m: 'drift', a: 18 }, { c: [40, -90, 12], f: -1, s: 0, m: 'drift', a: 18 }, { p: 'M-150 -130 L-120 -150 M150 -130 L120 -150', s: 6 },
  ], { moods: ['rabioso', 'oscuro'] });
  A('culpa', 'CULPA', /\b(culpa|culpable|culpabilidad|remordimiento|arrepentid[oa]|guilt|guilty|remorse|regret|arrepiento)\b/i, [
    { c: [90, 90, 70], f: 3, ft: .9, s: 10 }, { p: 'M20 90 C-20 30 -60 20 -100 -30', s: 8 }, { p: 'M-100 -30 C-130 -60 -100 -110 -60 -95 M-60 -95 L-30 -140', s: 8, m: 'sway', a: .05, o: [-100, -30] },
    { c: [-100, -30, 16], f: 1, ft: .9, s: 6 }, { p: 'M-190 150 H190', s: 8 }, { p: 'M70 60 L110 120 M110 60 L70 120', s: 5 },
  ], { moods: ['triste', 'oscuro'] });
  A('verguenza', 'VERGÜENZA', /\b(verg[uü]enza|averg[uü]enza\w*|sonroj\w*|sonrojo|ashamed|shame|shy|embarrass\w*|blush\w*|timid[oa])\b/i, [
    { c: [0, 0, 110], f: 2, ft: .55, s: 9 }, { e: [-60, 30, 26, 16], f: 1, ft: .95, s: 0, m: 'pulse', a: .08, o: [-60, 30] }, { e: [60, 30, 26, 16], f: 1, ft: .95, s: 0, m: 'pulse', a: .08, o: [60, 30] },
    { p: 'M-60 -10 H-25 M25 -10 H60', s: 7 }, { p: 'M-30 60 C-10 68 10 68 30 60', s: 6 },
    { p: 'M-130 60 C-140 0 -100 -30 -60 -25 L-40 40 C-70 80 -110 90 -130 60 Z', f: -1, s: 7 }, { p: 'M130 60 C140 0 100 -30 60 -25 L40 40 C70 80 110 90 130 60 Z', f: -1, s: 7 },
  ], { moods: ['romantico', 'sereno'] });
  A('sorpresa', 'SORPRESA', /\b(sorpresa|sorprendid[oa]s?|sorprender|asombro|incre[ií]ble|surprise|surprised|shocked|amazed|omg)\b/i, [
    { p: 'M0 -190 L25 -110 L90 -160 L70 -80 L170 -90 L100 -30 L170 30 L80 30 L110 110 L40 60 L0 140 L-30 60 L-110 110 L-80 30 L-170 30 L-100 -30 L-170 -90 L-70 -80 L-90 -160 L-25 -110 Z', f: 2, ft: .85, s: 9, m: 'beat', a: .1, o: [0, -20] },
    { p: 'M-14 -110 H14 L8 10 H-8 Z', f: 1, ft: .95, s: 6 }, { c: [0, 50, 12], f: 1, ft: .95, s: 6 },
  ], { moods: ['euforico', 'feliz'] });
  A('calma', 'CALMA', /\b(calma|calmado|calmada|tranquil[oa]s?|tranquilidad|serenidad|sereno|calm|peaceful|tranquility|relax\w*|relajad[oa])\b/i, [
    { e: [0, 60, 180, 50], f: 3, ft: .4, s: 8 }, { e: [0, 60, 120, 32], s: 5, m: 'pulse', a: .1, o: [0, 60], v: .6 }, { e: [0, 60, 60, 16], s: 4, m: 'pulse', a: .1, o: [0, 60], v: .6, ph: 1 },
    { p: 'M-40 40 C-60 -10 -20 -40 0 -70 C20 -40 60 -10 40 40 C20 30 -20 30 -40 40 Z', f: 1, ft: .8, s: 7, m: 'bob', a: 3 }, { p: 'M0 -70 C-15 -20 -15 10 0 40', s: 4, m: 'bob', a: 3 },
    { c: [110, -120, 30], f: 2, ft: .6, s: 6 },
  ], { moods: ['sereno', 'romantico'] });
  A('ansiedad', 'ANSIEDAD', /\b(ansiedad|ansios[oa]s?|nervios|nervios[oa]s?|angustia|estr[eé]s|estresad[oa]|anxiety|anxious|nervous|stress\w*|overthinking|panic attack)\b/i, [
    { p: 'M0 0 C40 -10 50 30 10 40 C-50 50 -70 -30 -10 -60 C70 -90 110 -10 80 60 C40 130 -80 120 -110 40 C-140 -50 -80 -130 10 -140 C110 -150 170 -60 150 30 C130 130 20 180 -70 160', s: 8, m: 'spin', a: .6, o: [0, 0] },
    { p: 'M-170 -150 L-140 -170 L-150 -140 Z M160 150 L190 130 L175 160 Z', f: 1, ft: .9, s: 4, m: 'wag', a: .2 },
  ], { moods: ['oscuro', 'rabioso'] });
  A('tristeza', 'TRISTEZA', /\b(tristeza|triste|tristes|apenad[oa]|deprimid[oa]|depresi[oó]n|melancol[ií]a|sad|sadness|sorrow|depressed|heartache|gloomy)\b/i, [
    { p: 'M-190 150 H190', s: 8 }, { p: 'M0 150 C0 70 10 10 40 -30', s: 9, m: 'sway', a: .02, o: [0, 150] },
    { p: 'M40 -30 C-30 -40 -70 0 -80 60 C-30 40 10 10 40 -30 Z', f: 3, ft: .6, s: 7, m: 'sway', a: .04, o: [40, -30] }, { p: 'M40 -30 C90 -20 120 20 120 80 C70 60 40 20 40 -30 Z', f: 3, ft: .6, s: 7, m: 'sway', a: .04, o: [40, -30] },
    { p: 'M-120 -150 C-100 -100 -140 -100 -120 -50 C-100 -100 -140 -100 -120 -150 Z', f: 2, ft: .8, s: 4, m: 'fall', a: 120 }, { p: L.cloud(90, -140, .7), f: 3, ft: .35, s: 7 },
  ], { moods: ['triste', 'melancolico'] });
  A('deseo', 'DESEO', /\b(deseo|desear|deseos|anhelo|ganas de ti|desire|crave|craving|longing|yearn\w*)\b/i, [
    { p: L.star(70, -90, 80, 5, .45), f: 2, ft: .9, s: 8, m: 'pulse', a: .1, o: [70, -90], v: 1.5 },
    { p: 'M-170 150 C-150 60 -110 20 -70 -10 L-40 -40 L-25 -55 L-10 -45 L-20 -25 L10 -60 L25 -50 L5 -15 C10 -20 30 -40 40 -30 L20 -5 C-10 40 -30 90 -30 150 Z', f: -1, s: 7, m: 'sway', a: .03, o: [-100, 150] },
    { p: 'M0 -120 L20 -110 M-20 -160 L0 -140', s: 4 },
  ], { moods: ['romantico', 'euforico'] });
  A('pasion', 'PASIÓN', /\b(pasi[oó]n|apasionad[oa]|ardiente|arder|passion|passionate|burning desire|fervor)\b/i, [
    { p: 'M-20 170 C-120 120 -110 30 -60 -20 C-70 60 -30 60 -20 20 C-10 -50 20 -110 50 -180 C60 -80 130 -20 110 70 C100 130 50 160 -20 170 Z', f: 1, ft: .9, s: 9, m: 'sway', a: .04, o: [0, 170] },
    { p: 'M30 170 C-20 140 -30 100 0 60 C10 100 40 90 50 60 C70 100 70 140 30 170 Z', f: 2, ft: .95, s: 6, m: 'sway', a: .06, o: [30, 170] },
    { p: L.heart(0, 95, 2.3), f: -1, s: 0 },
  ], { moods: ['romantico', 'euforico'] });
  A('libertad', 'LIBERTAD', /\b(libertad|libre|libres|liberarse|liberar|freedom|liberty|set me free|break free)\b/i, [
    { p: 'M-100 40 C-140 -10 -190 -60 -190 -90 C-150 -70 -110 -60 -70 -30 C-100 -70 -110 -120 -100 -150 C-70 -110 -40 -70 -10 -40 Z', f: 2, ft: .85, s: 7, m: 'flap', o: [-20, 20], v: .6 },
    { p: 'M100 40 C140 -10 190 -60 190 -90 C150 -70 110 -60 70 -30 C100 -70 110 -120 100 -150 C70 -110 40 -70 10 -40 Z', f: 2, ft: .85, s: 7, m: 'flap', o: [20, 20], v: .6 },
    { e: [0, 30, 40, 60], f: 1, ft: .9, s: 8 }, { c: [0, -50, 24], f: 1, ft: .9, s: 8 }, { p: 'M-20 120 L-40 170 M20 120 L40 170', s: 8 },
    { p: 'M-60 130 C-90 120 -110 140 -100 160 M-100 160 L-130 170', s: 6, m: 'drift', a: 6 },
  ], { moods: ['feliz', 'euforico', 'desafiante'] });
  A('orgullo', 'ORGULLO', /\b(orgullo|orgullos[oa]s?|orgullosamente|pride|proud|proudly|arrogante|arrogant)\b/i, [
    { p: 'M-190 150 L-80 20 L-20 70 L60 -50 L190 150 Z', f: 3, ft: .6, s: 9 }, { p: 'M60 -50 V-170', s: 9 }, { p: 'M60 -170 C100 -190 120 -150 160 -170 V-100 C120 -80 100 -120 60 -100 Z', f: 1, ft: .9, s: 7, m: 'sway', a: .04, o: [60, -150] },
    { c: [60, -50, 14], f: 2, ft: .9, s: 5 }, { p: L.star(-100, -90, 28, 5, .45), f: 2, ft: .9, s: 5, m: 'pulse', a: .1, o: [-100, -90] },
  ], { moods: ['desafiante', 'euforico'] });
  A('tension', 'TENSIÓN', /\b(tensi[oó]n|tenso|tensa|tensos|al l[ií]mite|tension|tense|on edge|breaking point|suspense|suspenso)\b/i, [
    { p: 'M-190 -20 C-100 -20 -40 -18 -20 -8 L-30 4 L-8 10 L-16 24 C-50 20 -100 20 -190 20', f: 3, ft: .5, s: 8, m: 'wag', a: .01, o: [0, 0] },
    { p: 'M190 -20 C100 -20 40 -18 20 -8 L30 4 L8 10 L16 24 C50 20 100 20 190 20', f: 3, ft: .5, s: 8, m: 'wag', a: .01, o: [0, 0] },
    { p: 'M-20 -60 L-10 -100 M20 -60 L10 -100 M0 -70 V-120 M-40 60 L-50 100 M40 60 L50 100', s: 6, m: 'pulse', a: .2, v: 3, o: [0, 0] },
    { p: 'M-190 -50 V50 M190 -50 V50', s: 12 },
  ], { moods: ['oscuro', 'rabioso'] });
  A('duda', 'DUDA', /\b(duda|dudas|dudar|dudo|dudando|incertidumbre|inseguro|inseguridad|doubt|doubts|doubting|uncertain)\b/i, [
    { p: 'M-70 -90 C-70 -190 80 -190 80 -100 C80 -40 10 -50 10 20 V40', s: 22, m: 'sway', a: .03, o: [0, 100] }, { c: [10, 100, 16], f: 1, ft: .95, s: 8 },
    { p: 'M-160 -60 C-160 -110 -130 -110 -130 -80 M150 60 C150 10 180 10 180 40', s: 6, m: 'drift', a: 8 }, { c: [-150, 100, 8], f: 3, s: 0, m: 'bob', a: 6 }, { c: [150, -120, 8], f: 2, s: 0, m: 'bob', a: 6, ph: 2 },
  ], { moods: ['melancolico', 'oscuro'] });
  A('olvido', 'OLVIDO', /\b(olvido|olvidar|olvidarte|olvid[oó]|olvidado|olvidada|forget|forgot|forgotten|forgetting|forget you|borrar|erase)\b/i, [
    { p: 'M-70 130 C-100 60 -100 -60 -50 -110 C10 -160 100 -120 100 -50 C100 -20 70 0 80 40 L120 60 L80 80 L80 130 Z', f: 3, ft: .5, s: 8 },
    ...[[60, -60], [100, -90], [140, -50], [130, -110], [170, -80], [120, -20], [160, -20], [180, -130], [90, -140]].map(([x, y], i) => ({ c: [x, y, 6 + i % 3 * 2], f: i % 2 ? 2 : 3, ft: .8, s: 0, m: 'drift', a: 8, ph: i })),
  ], { moods: ['melancolico', 'triste'] });
  A('abandono', 'ABANDONO', /\b(abandono|abandonar|abandonad[oa]|abandon\w*|left behind|deserted|plantad[oa])\b/i, [
    { e: [0, 60, 130, 60], f: 3, ft: .45, s: 9 }, { e: [0, 50, 90, 36], f: -1, s: 6 }, { p: 'M-130 60 C-150 40 -160 20 -170 -10 M130 60 C150 40 160 20 170 -10 M-60 110 L-90 140 M60 110 L90 140', s: 6 },
    { p: 'M-40 20 C-40 -10 -10 -10 0 10 M20 30 L60 20', s: 4 }, { p: 'M-190 150 H190', s: 8 },
    { p: 'M0 -150 L-10 -100 M40 -170 L30 -110', s: 3, m: 'drift', a: 10 },
  ], { moods: ['triste', 'melancolico'] });
  A('traicion', 'TRAICIÓN', /\b(traici[oó]n|traicion\w*|traidor|traidora|traicionar|traicionado|traicionaste|betray\w*|betrayal|traitor|backstab\w*|two.faced|dos caras)\b/i, [
    { p: 'M-120 -30 L60 -30 L70 -50 L110 -10 L70 30 L60 10 L-120 10 Z', f: -1, s: 8 },
    { p: 'M110 -10 L190 -10 M120 -30 V10', s: 8 }, { p: 'M-100 90 L20 -140 L40 -130 L-80 100 Z', f: 2, ft: .9, s: 8, m: 'beat', a: .04, o: [0, 0] }, { p: 'M-110 100 L-70 90 L-80 130 Z', f: 1, ft: .9, s: 7 },
    { p: 'M110 60 C130 80 130 100 150 110', s: 5, i: 2, m: 'fall', a: 20 },
  ], { moods: ['oscuro', 'rabioso'] });
  A('ternura', 'TERNURA', /\b(ternura|tierno|tierna|tiernamente|dulzura|caricia|acariciar|tenderness|tender|gentle|sweetness|cuddle|caress)\b/i, [
    { p: 'M-170 40 C-170 120 -90 150 0 150 C90 150 170 120 170 40 C120 70 60 60 0 90 C-60 60 -120 70 -170 40 Z', f: -1, s: 9 },
    { p: L.heart(0, -10, 6), f: 1, ft: .85, s: 8, m: 'pulse', a: .12, o: [0, -10], v: 1.4 }, { p: L.heart(-120, -100, 1.6), f: 2, ft: .8, s: 4, m: 'bob', a: 8 }, { p: L.heart(120, -120, 1.3), f: 2, ft: .8, s: 4, m: 'bob', a: 8, ph: 2 },
  ], { moods: ['romantico', 'sereno', 'feliz'] });
  A('euforia', 'EUFORIA', /\b(euforia|euf[oó]ric[oa]|[eé]xtasis|delirio|eufor\w*|euphoria|euphoric|ecstasy|ecstatic|high on life|on top of the world)\b/i, [
    { p: 'M0 -190 L20 -40 L170 -60 L50 10 L120 150 L0 50 L-120 150 L-50 10 L-170 -60 L-20 -40 Z', f: 2, ft: .9, s: 8, m: 'spin', a: .5, o: [0, 0] },
    { p: 'M0 -190 L20 -40 L170 -60 L50 10 L120 150 L0 50 L-120 150 L-50 10 L-170 -60 L-20 -40 Z', f: 1, ft: .7, s: 6, m: 'spin', a: -.5, o: [0, 0], ph: .8 },
    { c: [0, 0, 26], f: 3, ft: .9, s: 6, m: 'beat', a: .3, o: [0, 0] },
  ], { moods: ['euforico', 'feliz'] });
  A('vacio', 'VACÍO', /\b(vac[ií]o|vac[ií]a|vacios|hueco|void|emptiness|empty inside|hollow|nothingness|nothingness)\b/i, [
    { c: [0, 0, 170], f: 3, ft: .8, s: 8 }, { c: [0, 0, 120], f: -1, s: 7 }, { c: [0, 0, 70], f: 3, ft: .7, s: 6, m: 'pulse', a: .06, o: [0, 0], v: .8 }, { c: [0, 0, 26], f: 1, ft: .95, s: 0, m: 'pulse', a: .1, o: [0, 0], v: .8 },
  ], { moods: ['oscuro', 'melancolico', 'triste'] });
  A('cansancio', 'CANSANCIO', /\b(cansancio|cansad[oa]s?|agotad[oa]s?|agotamiento|fatiga|tired|exhausted|weary|fatigue|sleepy|drained|burnout|worn out)\b/i, [
    { p: L.rr(-140, -60, 260, 130, 20), f: -1, s: 9 }, { p: L.rr(120, -25, 30, 60, 8), f: 3, ft: .8, s: 7 }, { p: L.rr(-125, -45, 50, 100, 10), f: 1, ft: .9, s: 0, m: 'pulse', a: .05, o: [-100, 5], v: 1 },
    { p: 'M-30 -30 L-10 -30 L-30 0 L-10 0 M20 -30 L40 -30 L20 0 L40 0', s: 5, m: 'drift', a: 6 }, { p: 'M80 -110 H120 L80 -80 H120 M130 -150 H155 L130 -125 H155', s: 6, m: 'bob', a: 8 },
  ], { moods: ['melancolico', 'sereno', 'triste'] });
  A('obsesion', 'OBSESIÓN', /\b(obsesi[oó]n|obsesionad[oa]|obsesivo|obsess\w*|fixation|fixated|no puedo dejar de pensar|can'?t stop thinking|adicci[oó]n|addicted|addiction|adicto)\b/i, [
    { p: 'M0 0 ' + Array.from({ length: 60 }, (_, i) => { const a = i * .5, r = 4 + i * 2.7; return `L${(Math.cos(a) * r).toFixed(1)} ${(Math.sin(a) * r).toFixed(1)}`; }).join(' '), s: 9, m: 'spin', a: 1.4, o: [0, 0] },
    { c: [0, 0, 14], f: 1, ft: .95, s: 0, m: 'pulse', a: .3, o: [0, 0], v: 2 },
  ], { moods: ['oscuro', 'rabioso', 'romantico'] });
  A('confusion', 'CONFUSIÓN', /\b(confusi[oó]n|confundid[oa]s?|confundir|desorientad[oa]|perdid[oa] en|confusion|confused|lost in|disoriented|bewildered|mareo|mareado)\b/i, [
    { p: 'M-140 -60 C-140 -140 -20 -140 -20 -60 M-20 -60 L-50 -80 M-20 -60 L-4 -88', s: 8, m: 'spin', a: .4, o: [-80, -40] },
    { p: 'M140 60 C140 140 20 140 20 60 M20 60 L50 80 M20 60 L4 88', s: 8, m: 'spin', a: -.4, o: [80, 40] },
    { p: 'M-30 40 V-40 M-60 0 H30 M0 -40 L-30 -20', s: 7, m: 'wag', a: .15, o: [0, 0] }, { p: 'M60 -100 C60 -140 110 -140 110 -100 C110 -70 85 -75 85 -50', s: 8 }, { c: [85, -25, 6], f: 1, s: 0 },
    { p: L.star(-130, 100, 20, 4, .4), f: 2, ft: .9, s: 4, m: 'spin', a: 1.5, o: [-130, 100] },
  ], { moods: ['oscuro', 'melancolico'] });
  A('serenidad', 'SERENIDAD', /\b(paz interior|serenidad|equilibrio|zen|meditar|meditaci[oó]n|inner peace|mindful\w*|meditat\w*|armon[ií]a|harmony)\b/i, [
    { e: [0, 120, 110, 26], f: 3, ft: .6, s: 9 }, { e: [0, 60, 80, 32], f: 3, ft: .8, s: 9 }, { e: [0, 10, 52, 24], f: 1, ft: .8, s: 8 }, { e: [0, -25, 30, 16], f: 2, ft: .85, s: 7 },
    { p: 'M-190 150 H190', s: 8 }, { c: [110, -120, 26], f: 2, ft: .6, s: 6, m: 'pulse', a: .05, o: [110, -120], v: .7 },
  ], { moods: ['sereno'] });
  A('gratitud', 'GRATITUD', /\b(gratitud|agradecid[oa]s?|agradecer|agradezco|thankful|grateful|gratitude|thank you)\b/i, [
    { p: 'M-170 150 C-150 70 -110 30 -60 20 L-10 40 L40 20 L60 60 C30 110 -20 150 -40 150 Z', f: -1, s: 8 }, { p: 'M170 150 C150 70 110 30 60 20', s: 8 },
    { p: 'M0 20 C0 -30 0 -70 0 -100', s: 8 }, { p: 'M0 -100 C-40 -100 -60 -140 -40 -170 C-10 -160 0 -130 0 -100 Z M0 -100 C40 -100 60 -140 40 -170 C10 -160 0 -130 0 -100 Z', f: 2, ft: .9, s: 7, m: 'sway', a: .03, o: [0, 20] }, { c: [0, -120, 12], f: 1, ft: .95, s: 5 },
    { p: L.heart(130, -110, 1.6), f: 1, ft: .8, s: 4, m: 'bob', a: 8 },
  ], { moods: ['feliz', 'sereno', 'romantico'] });
})();
