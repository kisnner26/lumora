// ============================================================
// riso-props-paises.js — monumentos, animales y objetos de países (oleada 2 del catálogo).
// Complementan las banderas: nunca nombran al país, dibujan lo que se ve en su postal. Ver riso-props-lib.js.
// ============================================================
(() => {
  const R = window.RISO; if (!R || !R.lib) return;
  const { add, L } = R.lib, C = 'paises';
  const A = (id, label, rx, shapes, opt) => add(id, C, label, rx, shapes, opt);
  const G = { p: 'M-190 160 H190', s: 8 };
  const sun = (x, y, r = 30) => ({ c: [x, y, r], f: 2, ft: .8, s: 6, m: 'pulse', a: .04, o: [x, y] });

  A('torre_eiffel', 'TORRE EIFFEL', /\b(torre eiffel|eiffel|eiffel tower)\b/i, [
    { p: 'M-90 160 C-50 60 -25 -20 0 -170 C25 -20 50 60 90 160 Z', f: 1, ft: .55, s: 9 }, { p: 'M-60 95 H60 M-38 30 H38 M-22 -40 H22', s: 7 }, { p: 'M-50 160 C-30 110 30 110 50 160', s: 7 }, { p: 'M0 -170 V-200', s: 5 }, G,
    { p: 'M-120 -100 L-110 -120 M120 -100 L110 -120', s: 4, m: 'pulse', a: .3, v: 3, o: [0, -100] },
  ], { moods: ['romantico', 'nostalgico'] });
  A('coliseo', 'COLISEO', /\b(coliseo|colosseum|coliseum|anfiteatro)\b/i, [
    { p: 'M-170 150 V-40 C-100 -100 100 -100 170 -40 V150 Z', f: 2, ft: .6, s: 9 },
    ...[-120, -60, 0, 60, 120].flatMap(x => [{ p: `M${x - 18} 20 V-10 C${x - 18} -30 ${x + 18} -30 ${x + 18} -10 V20`, s: 5 }, { p: `M${x - 18} 110 V80 C${x - 18} 60 ${x + 18} 60 ${x + 18} 80 V110`, s: 5 }]), G,
  ], { moods: ['nostalgico'] });
  A('machu_picchu', 'MACHU PICCHU', /\b(machu picchu|inca|incas|cusco|cuzco|sacsayhuam[aá]n)\b/i, [
    { p: 'M-190 160 L-120 20 L-60 60 L0 -110 L70 30 L120 -20 L190 160 Z', f: 1, ft: .7, s: 9 }, { p: 'M-60 130 H50 M-40 100 H30 M-30 70 H20', s: 8 },
    { p: L.rect(-50 - 30, 130, 20, 30), f: -1, s: 5 }, { p: 'M-20 100 V80 L0 60 L20 80 V100 Z', f: 2, ft: .85, s: 5 }, sun(120, -110, 24), G,
  ], { moods: ['sereno'] });
  A('cristo_redentor', 'CRISTO REDENTOR', /\b(cristo redentor|corcovado|christ the redeemer)\b/i, [
    { p: 'M-190 160 C-150 60 -100 40 -60 90 C-30 40 30 40 60 90 C100 40 150 60 190 160 Z', f: 1, ft: .6, s: 9 }, { p: 'M0 40 V-90 M-110 -80 H110', s: 12 }, { p: 'M-14 -90 V-110', s: 0 },
    { c: [0, -112, 20], f: -1, s: 8 }, { p: 'M-24 40 L-30 -90 H30 L24 40 Z', f: -1, s: 7 }, { p: 'M-40 160 V60 M40 160 V60', s: 0 }, sun(-140, -120, 22),
  ], { moods: ['sereno', 'euforico'] });
  A('gran_muralla', 'GRAN MURALLA', /\b(gran muralla|great wall|muralla china)\b/i, [
    { p: 'M-190 130 L-100 60 L-40 90 L40 10 L120 40 L190 -30', s: 20 }, { p: 'M-190 130 L-100 60 L-40 90 L40 10 L120 40 L190 -30 V10 L120 90 L40 60 L-40 140 L-100 110 L-190 170 Z', f: 2, ft: .6, s: 8 },
    { p: L.rect(-70, 50, 50, 50), f: 1, ft: .8, s: 7 }, { p: L.rect(90, -30, 50, 60), f: 1, ft: .8, s: 7 }, { p: 'M-60 50 V35 H-40 V50 M100 -30 V-45 H120 V-30', s: 5 },
  ], { moods: ['nostalgico', 'desafiante'] });
  A('piramides', 'PIRÁMIDES', /\b(pir[aá]mides?|pyramids?|egipto|egypt|esfinge|sphinx|fara[oó]n|pharaoh)\b/i, [
    { p: 'M-190 150 L-60 -70 L70 150 Z', f: 2, ft: .7, s: 9 }, { p: 'M-20 150 L90 -20 L190 150 Z', f: 3, ft: .6, s: 9 }, { p: 'M-60 -70 L-20 150', s: 5 }, { p: 'M90 -20 L70 150', s: 5 }, sun(140, -120, 30), G,
  ], { moods: ['nostalgico', 'oscuro'] });
  A('taj_mahal', 'TAJ MAHAL', /\b(taj mahal|mausoleo)\b/i, [
    { p: 'M-70 150 V20 C-70 -40 70 -40 70 20 V150 Z', f: -1, s: 9 }, { p: 'M-30 -30 C-30 -90 30 -90 30 -30', f: -1, s: 8 }, { p: 'M0 -90 V-130', s: 6 }, { c: [0, -135, 8], f: 2, s: 4 },
    { p: 'M-150 150 V-20 M-110 150 V-20 M150 150 V-20 M110 150 V-20', s: 8 }, { p: 'M-40 150 V60 C-40 30 40 30 40 150', f: 3, ft: .6, s: 6 }, { p: 'M-190 150 H190', s: 8 },
  ], { moods: ['romantico', 'nostalgico'] });
  A('estatua_libertad', 'ESTATUA DE LA LIBERTAD', /\b(estatua de la libertad|statue of liberty|lady liberty|nueva york skyline)\b/i, [
    { p: 'M-50 160 H50 L40 60 H-40 Z', f: 3, ft: .6, s: 9 }, { p: 'M-30 60 C-40 0 -30 -60 0 -80 C30 -60 40 0 30 60 Z', f: 1, ft: .7, s: 9 }, { c: [0, -100, 24], f: 1, ft: .9, s: 8 },
    { p: 'M-16 -118 L-30 -150 M0 -124 V-160 M16 -118 L30 -150 M-6 -124 L-14 -158', s: 6 }, { p: 'M28 -30 L70 -90 L70 -130 M60 -140 C50 -150 80 -160 90 -140 L80 -120 Z', f: 2, ft: .95, s: 6, m: 'pulse', a: .05, o: [75, -130] }, { p: 'M-30 20 L-90 0 L-80 40', f: 1, ft: .6, s: 6 },
  ], { moods: ['euforico', 'desafiante'] });
  A('big_ben', 'BIG BEN', /\b(big ben|torre del reloj|elizabeth tower|westminster)\b/i, [
    { p: 'M-50 170 V-40 H50 V170 Z', f: 2, ft: .65, s: 9 }, { p: 'M-60 -40 H60 V-110 H-60 Z', f: 2, ft: .8, s: 9 }, { c: [0, -75, 26], f: -1, s: 7 }, { p: 'M0 -75 V-95 M0 -75 L14 -66', s: 5, m: 'spin', a: .1, o: [0, -75] },
    { p: 'M-60 -110 L0 -190 L60 -110 Z', f: 1, ft: .8, s: 8 }, { p: 'M-30 20 V100 M0 20 V100 M30 20 V100', s: 4 }, { p: 'M-190 170 H190', s: 8 },
  ], { moods: ['nostalgico'] });
  A('sagrada_familia', 'SAGRADA FAMILIA', /\b(sagrada familia|gaud[ií]|gaudi|park g[uü]ell)\b/i, [
    ...[-110, -40, 40, 110].map((x, i) => ({ p: `M${x - 25} 160 V${-20 - (i % 2) * 40} C${x - 25} ${-100 - i % 2 * 30} ${x + 25} ${-100 - i % 2 * 30} ${x + 25} ${-20 - (i % 2) * 40} V160 Z`, f: i % 2 ? 2 : 1, ft: .7, s: 8 })),
    { p: 'M-110 -110 V-160 M-40 -140 V-190 M40 -140 V-190 M110 -110 V-160', s: 6 }, { p: 'M-110 40 V10 M-40 40 V10 M40 40 V10 M110 40 V10', s: 5 }, { p: 'M-190 160 H190', s: 8 },
  ], { moods: ['nostalgico', 'romantico'] });
  A('molino', 'MOLINO', /\b(molinos? de viento|molinos?|windmills?|tulipanes?|tulips?)\b/i, [
    { p: 'M-50 160 L-30 -20 H30 L50 160 Z', f: 2, ft: .6, s: 9 }, { p: 'M-40 -20 L0 -60 L40 -20', f: 1, ft: .8, s: 8 }, { p: 'M0 -20 L-100 -110 M0 -20 L100 30 M0 -20 L-70 60 M0 -20 L60 -110', f: 3, ft: .6, s: 8, m: 'spin', a: .5, o: [0, -20] }, { p: 'M-190 160 H190', s: 8 },
    { p: 'M120 160 V110 M140 160 V100 M160 160 V115', s: 5 }, { c: [120, 105, 8], f: 1, s: 0 }, { c: [140, 95, 8], f: 2, s: 0 }, { c: [160, 110, 8], f: 1, s: 0 },
  ], { moods: ['sereno', 'nostalgico'] });
  A('opera_sydney', 'ÓPERA DE SÍDNEY', /\b(sydney|s[ií]dney|opera house|[oó]pera de s[ií]dney)\b/i, [
    { p: 'M-150 120 C-150 40 -110 -50 -60 -90 C-50 0 -40 80 -20 120 Z', f: -1, s: 9 }, { p: 'M-30 120 C-30 30 10 -70 70 -120 C80 -20 70 70 60 120 Z', f: -1, s: 9 }, { p: 'M50 120 C60 60 90 0 140 -30 C150 30 140 80 130 120 Z', f: -1, s: 9 },
    { p: 'M-190 120 H190', s: 9 }, { p: 'M-190 130 C-100 150 100 150 190 130 V170 H-190 Z', f: 3, ft: .55, s: 7, m: 'drift', a: 4 },
  ], { moods: ['sereno'] });
  A('monte_fuji', 'MONTE FUJI', /\b(monte fuji|fuji|fujiyama|mount fuji)\b/i, [
    { p: 'M-190 150 L-40 -80 H40 L190 150 Z', f: 3, ft: .6, s: 9 }, { p: 'M-40 -80 L-25 -50 L-10 -70 L5 -45 L20 -70 L40 -80', f: -1, s: 7 }, { c: [130, -110, 34], f: 1, ft: .9, s: 0 },
    { p: 'M-190 150 C-130 130 -80 170 -20 150 C40 130 90 170 190 150', s: 6, m: 'drift', a: 6 }, { p: 'M-110 -120 C-90 -130 -60 -130 -40 -120', s: 4, m: 'drift', a: 10 },
  ], { moods: ['sereno', 'romantico'] });
  A('torre_pisa', 'TORRE DE PISA', /\b(torre de pisa|leaning tower|pisa)\b/i, [
    { p: 'M-40 160 L-20 -130 L50 -110 L45 160 Z', f: -1, s: 9, g: 0 }, { p: 'M-30 -60 L45 -50 M-32 -10 L45 -3 M-34 40 L45 43 M-36 90 L45 92', s: 6 }, { p: 'M-20 -130 L-15 -170 L45 -155 L50 -110', f: 2, ft: .7, s: 8 }, { p: 'M-190 160 H190', s: 8 },
  ], { g: { r: .12, dx: 0, dy: 10 }, moods: ['nostalgico'] });
  A('partenon', 'PARTENÓN', /\b(partenon|parten[oó]n|acr[oó]polis|acropolis|columnas griegas)\b/i, [
    { p: 'M-170 -10 L0 -90 L170 -10 Z', f: 2, ft: .7, s: 9 }, { p: L.rect(-170, -10, 340, 20), f: -1, s: 8 }, ...[-130, -78, -26, 26, 78, 130].map(x => ({ p: L.rect(x - 12, 10, 24, 130), f: -1, s: 7 })), { p: L.rect(-180, 140, 360, 26), f: 3, ft: .7, s: 8 },
  ], { moods: ['nostalgico', 'sereno'] });
  A('brandeburgo', 'PUERTA DE BRANDEMBURGO', /\b(brandeburgo|brandenburg\w*|muro de berl[ií]n|berlin wall)\b/i, [
    ...[-140, -70, 0, 70, 140].map(x => ({ p: L.rect(x - 16, -40, 32, 190), f: 2, ft: .65, s: 8 })), { p: L.rect(-170, -90, 340, 50), f: 2, ft: .85, s: 9 }, { p: 'M-40 -90 C-30 -140 30 -140 40 -90 M0 -125 V-160', s: 7 }, { p: 'M-190 150 H190', s: 8 },
  ], { moods: ['oscuro', 'nostalgico'] });
  A('catedral_rusa', 'CATEDRAL RUSA', /\b(san basilio|catedral rusa|kremlin|plaza roja|red square|saint basil|cebolla|onion dome)\b/i, [
    ...[[-100, 30], [0, -30], [100, 30], [-50, 80], [50, 80]].map(([x, y], i) => ({ p: `M${x - 32} 150 V${y + 20} C${x - 50} ${y - 20} ${x - 10} ${y - 40} ${x} ${y - 80} C${x + 10} ${y - 40} ${x + 50} ${y - 20} ${x + 32} ${y + 20} V150 Z`, f: [1, 2, 3, 2, 1][i], ft: .8, s: 8 })),
    { p: 'M0 -110 V-140 M-100 -50 V-80 M100 -50 V-80', s: 5 }, { p: 'M-190 150 H190', s: 8 },
  ], { moods: ['nostalgico', 'oscuro'] });
  A('pagoda', 'PAGODA', /\b(pagodas?|templo asi[aá]tico|shaolin|buda|buddha|budismo|buddhism)\b/i, [
    ...[0, 1, 2].map(i => ({ p: `M${-120 + i * 25} ${20 - i * 65} C${-60 + i * 12} ${10 - i * 65} ${60 - i * 12} ${10 - i * 65} ${120 - i * 25} ${20 - i * 65} L${90 - i * 20} ${50 - i * 65} H${-90 + i * 20} Z`, f: [2, 1, 2][i], ft: .8, s: 8 })),
    { p: L.rect(-70, 50, 140, 100), f: 3, ft: .5, s: 9 }, { p: 'M0 -160 V-200', s: 6 }, { p: 'M-20 110 V150 M20 110 V150', s: 5 }, { p: 'M-190 150 H190', s: 8 },
  ], { moods: ['sereno'] });
  A('torii', 'TORII', /\b(torii|santuario|shrine|shinto|japon[eé]s|japanese|kioto|kyoto|tokio|tokyo|geisha|samur[aá]i|samurai)\b/i, [
    { p: 'M-140 -60 C-90 -80 90 -80 140 -60 L150 -100 C90 -130 -90 -130 -150 -100 Z', f: 1, ft: .9, s: 9 }, { p: 'M-110 -55 V160 M110 -55 V160', f: 1, ft: .9, s: 14 }, { p: 'M-140 -10 H140', s: 12 }, { p: 'M0 -80 V-10', s: 8 }, { p: 'M-190 160 H190', s: 8 },
  ], { moods: ['sereno', 'romantico'] });
  A('moai', 'MOAI', /\b(moais?|isla de pascua|easter island|rapa nui)\b/i, [
    { p: 'M-60 160 L-70 -20 C-80 -100 -40 -170 10 -170 C50 -170 70 -120 70 -60 L60 160 Z', f: 3, ft: .65, s: 10 }, { p: 'M-60 -60 H60', s: 8 }, { p: 'M-50 -50 C-20 -30 20 -30 50 -50', s: 6 }, { p: 'M0 -90 C-10 -50 0 -30 10 -30', s: 5 }, { p: 'M-40 -110 C-20 -125 20 -125 40 -110', s: 5 }, { p: 'M-190 160 H190', s: 8 },
  ], { moods: ['oscuro', 'sereno'] });
  A('chichen_itza', 'PIRÁMIDE MAYA', /\b(chich[eé]n itz[aá]|mayas?|mayan?|azteca|aztecs?|tikal|teotihuac[aá]n|templo maya|calendario azteca)\b/i, [
    { p: 'M-170 160 H170 L140 110 H-140 Z', f: 2, ft: .6, s: 8 }, { p: 'M-130 110 H130 L100 60 H-100 Z', f: 2, ft: .7, s: 8 }, { p: 'M-90 60 H90 L60 10 H-60 Z', f: 2, ft: .8, s: 8 }, { p: 'M-50 10 H50 L30 -40 H-30 Z', f: 2, ft: .9, s: 8 },
    { p: L.rect(-30, -90, 60, 50), f: 1, ft: .9, s: 8 }, { p: 'M0 160 V-40', s: 6 }, { p: 'M-20 -70 H20', s: 4 },
  ], { moods: ['nostalgico', 'oscuro'] });
  A('obelisco', 'OBELISCO', /\b(obelisco|obelisk|washington monument)\b/i, [
    { p: 'M-40 160 L-25 -140 L0 -190 L25 -140 L40 160 Z', f: -1, s: 10 }, { p: 'M-25 -140 H25', s: 5 }, { p: 'M-70 160 H70 V130 H-70 Z', f: 3, ft: .7, s: 8 }, { p: 'M0 -190 V-200', s: 0 }, { p: 'M-190 160 H190', s: 8 },
  ], { moods: ['sereno'] });
  A('golden_gate', 'PUENTE COLGANTE', /\b(golden gate|puente colgante|suspension bridge|brooklyn bridge)\b/i, [
    { p: 'M-100 160 V-100 M100 160 V-100', s: 14 }, { p: 'M-110 -40 H-90 M-110 40 H-90 M90 -40 H110 M90 40 H110', s: 8 }, { p: 'M-190 60 C-140 60 -110 -100 -100 -100 C-60 20 60 20 100 -100 C110 -100 140 60 190 60', s: 6 },
    { p: 'M-190 70 H190 V90 H-190 Z', f: 1, ft: .8, s: 8 }, ...[-70, -40, -10, 20, 50, 80].map(x => ({ p: `M${x} ${x < 0 ? 5 : 5} V70`, s: 3 })), { p: 'M-190 130 C-100 150 100 150 190 130', s: 6, m: 'drift', a: 5 },
  ], { moods: ['sereno', 'romantico'] });
  A('castillo', 'CASTILLO', /\b(castillos?|castles?)\b/i, [
    { p: L.rect(-100, -20, 200, 180), f: 3, ft: .55, s: 9 }, { p: 'M-140 160 V-80 H-100 V160 M100 160 V-80 H140 V160', f: 3, ft: .7, s: 9 }, { p: 'M-140 -80 L-120 -130 L-100 -80 M100 -80 L120 -130 L140 -80', f: 1, ft: .85, s: 8 },
    { p: 'M-40 -20 V-60 H0 V-90 H40 V-20', f: 3, ft: .8, s: 7 }, { p: 'M-30 160 V80 C-30 50 30 50 30 160', f: 1, ft: .8, s: 8 }, { p: 'M0 -90 V-130 L30 -120 L0 -110', f: 2, ft: .95, s: 5, m: 'sway', a: .06, o: [0, -90] },
  ], { moods: ['nostalgico', 'romantico'] });
  A('mezquita', 'MEZQUITA', /\b(mezquitas?|mosques?|minarete|minaret|meca|mecca|alham?bra|isl[aá]mic\w*|ramad[aá]n)\b/i, [
    { p: 'M-70 160 V30 C-70 -70 70 -70 70 30 V160 Z', f: -1, s: 9 }, { p: 'M0 -50 V-90 M-10 -80 C-5 -100 15 -100 10 -80', s: 6 },
    { p: 'M-120 160 V-30 L-105 -70 L-90 -30 V160 M90 160 V-30 L105 -70 L120 -30 V160', f: 2, ft: .7, s: 8 }, { p: 'M-30 160 V90 C-30 60 30 60 30 160', f: 3, ft: .6, s: 6 }, { p: 'M-190 160 H190', s: 8 }, sun(150, -120, 22),
  ], { moods: ['sereno', 'nostalgico'] });
  A('cascada', 'CATARATAS', /\b(cataratas?|iguaz[uú]|iguazu|niagara|niágara|waterfalls?|cascadas?|salto [aá]ngel|angel falls)\b/i, [
    { p: 'M-190 -60 H-60 V160 H-190 Z', f: 1, ft: .6, s: 9 }, { p: 'M190 -60 H60 V160 H190 Z', f: 1, ft: .6, s: 9 }, { p: 'M-60 -60 H60 V160 H-60 Z', f: 3, ft: .35, s: 8 },
    { p: 'M-40 -60 V150 M-10 -60 V150 M20 -60 V150 M45 -60 V150', s: 4, m: 'fall', a: 20 }, { c: [0, 165, 50], f: -1, s: 0, m: 'pulse', a: .1, o: [0, 165] }, { p: 'M-90 -60 C-80 -120 80 -120 90 -60', s: 5, m: 'steam', a: 20 },
  ], { moods: ['sereno', 'euforico'] });
  A('palmera_playa', 'PALMERA', /\b(palmeras?|palm trees?|playa tropical|tropical beach|caribe|caribbean|para[ií]so tropical)\b/i, [
    { p: 'M-10 170 C-20 100 -10 30 20 -60', s: 12, m: 'sway', a: .01, o: [0, 170] }, { p: 'M20 -60 C-40 -130 -100 -110 -150 -60 M20 -60 C-20 -150 40 -180 90 -150 M20 -60 C60 -130 120 -110 160 -50 M20 -60 C-10 -100 -20 -150 -50 -170', f: 1, ft: .85, s: 8, m: 'sway', a: .03, o: [20, -60] },
    { c: [30, -50, 12], f: 3, s: 5 }, { c: [10, -45, 12], f: 3, s: 5 }, { p: 'M-190 170 C-120 130 -60 150 0 170 H190', f: 2, ft: .5, s: 8 }, sun(-120, -140, 28),
  ], { moods: ['feliz', 'sereno'] });
  A('canguro', 'CANGURO', /\b(canguros?|kangaroos?|koalas?|australia|australian?o?|outback)\b/i, [
    { p: 'M-30 160 C-100 120 -110 40 -70 -20 C-50 -50 -30 -90 -20 -130 C-10 -170 40 -170 50 -130 L70 -100 L40 -95 C40 -50 60 -10 60 30 C60 90 30 130 60 160 Z', f: 2, ft: .8, s: 9 },
    { p: 'M-20 -140 L-30 -190 M20 -145 L30 -190', s: 6 }, { c: [20, -130, 4], f: 1, s: 0 }, { p: 'M-80 90 C-140 90 -170 140 -190 160', s: 9, m: 'sway', a: .03, o: [-80, 90] }, { p: 'M20 -20 C40 -10 50 0 40 20', s: 6 }, { p: 'M-190 165 H190', s: 8 },
  ], { moods: ['feliz'] });
  A('panda', 'PANDA', /\b(pandas?|oso panda|bamb[uú]|bamboo)\b/i, [
    { e: [0, 70, 100, 90], f: -1, s: 9 }, { c: [0, -70, 65], f: -1, s: 9 }, { c: [-50, -125, 26], f: 1, ft: .95, s: 8 }, { c: [50, -125, 26], f: 1, ft: .95, s: 8 },
    { e: [-27, -72, 16, 20, .3], f: 1, ft: .95, s: 0 }, { e: [27, -72, 16, 20, -.3], f: 1, ft: .95, s: 0 }, { c: [0, -50, 9], f: 1, s: 0 }, { p: 'M-90 60 C-120 100 -100 150 -70 150 M90 60 C120 100 100 150 70 150', f: 1, ft: .95, s: 8 },
    { p: 'M150 170 V-60 M130 60 L150 50 M170 -10 L150 -20', s: 8, i: 3 },
  ], { moods: ['feliz', 'sereno'] });
  A('llama_andina', 'LLAMA', /\b(llamas?|alpacas?|vicu[nñ]as?|guanacos?|andes|andino|andina|altiplano)\b/i, [
    { p: 'M-90 160 V50 C-110 30 -90 -30 -50 -30 L-30 -30 C-40 -80 -40 -120 -30 -150 L-10 -130 L10 -150 L20 -130 L30 -110 V-40 C60 -30 100 -20 100 40 V160 M-40 160 V90 M60 160 V90', f: -1, s: 9 },
    { c: [10, -120, 4], f: 1, s: 0 }, { p: 'M-10 -150 L-15 -190 M12 -150 L18 -190', s: 6 }, { p: 'M-60 -10 C-20 10 40 10 90 -10', f: 2, ft: .85, s: 8 }, { p: 'M-190 165 H190', s: 8 },
  ], { moods: ['sereno'] });
  A('condor', 'CÓNDOR', /\b(c[oó]ndor|condor|[aá]guila|eagle|halc[oó]n|falcon|hawk)\b/i, [
    { p: 'M0 -20 C-60 -60 -130 -70 -190 -20 C-150 -30 -120 -10 -100 20 C-70 -10 -30 -10 0 30', f: 1, ft: .9, s: 8, m: 'flap', o: [0, 0], v: .5 }, { p: 'M0 -20 C60 -60 130 -70 190 -20 C150 -30 120 -10 100 20 C70 -10 30 -10 0 30', f: 1, ft: .9, s: 8, m: 'flap', o: [0, 0], v: .5 },
    { e: [0, 20, 22, 50], f: 1, ft: .95, s: 8 }, { c: [0, -32, 16], f: -1, s: 7 }, { p: 'M-8 -30 L-4 -20 L4 -30', f: 2, ft: .95, s: 4 }, { p: 'M-15 70 L-25 110 M15 70 L25 110', s: 5 },
  ], { moods: ['desafiante', 'euforico'] });
  A('jaguar', 'JAGUAR', /\b(jaguar(es)?|jaguars?|leopardos?|leopards?|pumas?|panteras?|panthers?|tigres?|tigers?|guepardos?|cheetahs?)\b/i, [
    { p: 'M-170 40 C-170 -30 -110 -60 -60 -50 C-20 -90 40 -90 70 -50 C130 -60 170 -20 170 40 C170 90 130 100 100 100 V160 M-100 100 C-140 100 -170 90 -170 40 M-100 100 V160', f: 2, ft: .8, s: 9 },
    { c: [-30, -70, 0], s: 0 }, { p: 'M-60 -50 L-70 -90 L-40 -70 M70 -50 L80 -90 L50 -70', f: 2, ft: .9, s: 6 }, ...[[-90, 0], [-40, 20], [10, -10], [60, 20], [110, 0], [-10, 60], [50, 70]].map(([x, y]) => ({ c: [x, y, 12], f: 1, ft: .95, s: 3 })),
    { p: 'M150 20 C190 0 190 -60 150 -70', s: 8, m: 'sway', a: .05, o: [150, 20] },
  ], { moods: ['desafiante', 'oscuro'] });
  A('quetzal', 'QUETZAL', /\b(quetzal(es)?|colibr[ií]es?|hummingbirds?|guacamayas?|macaws?|loros?|parrots?|tuc[aá]n(es)?|toucans?|aves tropicales)\b/i, [
    { e: [-20, 0, 60, 34, -.3], f: 1, ft: .85, s: 8 }, { c: [40, -40, 26], f: 1, ft: .85, s: 8 }, { p: 'M64 -46 L100 -38 L64 -30', f: 2, ft: .95, s: 6 }, { c: [46, -44, 4], f: -1, s: 0 },
    { p: 'M-70 20 C-100 80 -60 130 -100 190 M-60 30 C-70 90 -30 130 -60 190', s: 6, m: 'sway', a: .05, o: [-70, 20] }, { p: 'M-20 -10 C-50 -60 -90 -70 -120 -60 C-100 -30 -60 0 -20 10', f: 2, ft: .85, s: 7, m: 'flap', o: [-20, 0], v: .6 },
    { p: 'M-30 40 L-40 80 M-10 40 L-14 80', s: 5 },
  ], { moods: ['feliz', 'euforico'] });
  A('elefante', 'ELEFANTE', /\b(elefantes?|elephants?|safari|savana|savanna|africa|[aá]frica|africano|african)\b/i, [
    { e: [10, 20, 110, 80], f: 3, ft: .75, s: 9 }, { c: [-100, -20, 55], f: 3, ft: .75, s: 9 }, { p: 'M-140 -10 C-190 40 -170 110 -150 130', s: 12 }, { p: 'M-70 -70 C-40 -130 20 -80 0 -20', f: 3, ft: .5, s: 8, m: 'sway', a: .04, o: [-70, -50] },
    { c: [-105, -30, 5], f: 1, s: 0 }, { p: 'M-60 90 V150 M-10 100 V160 M50 100 V160 M100 90 V150', s: 12 }, { p: 'M-105 5 L-130 30', s: 5, i: 2 }, { p: 'M110 -10 C140 -20 150 20 130 50', s: 8, m: 'wag', a: .1, o: [110, -10] },
  ], { moods: ['sereno'] });
  A('camello', 'CAMELLO', /\b(camellos?|camels?|dromedarios?|desierto|sahara|dunas?|dunes?|beduino|bedouin)\b/i, [
    { p: 'M-110 60 C-110 -20 -70 -50 -50 -20 C-30 -80 30 -80 50 -20 C70 -50 100 -10 100 60 Z', f: 2, ft: .7, s: 9 }, { p: 'M-110 20 C-130 -40 -140 -80 -120 -110 C-100 -130 -70 -110 -80 -90', s: 9 }, { c: [-100, -105, 4], f: 1, s: 0 },
    { p: 'M-80 60 V150 M-30 60 V150 M40 60 V150 M90 60 V150', s: 9 }, { p: 'M-190 165 C-100 130 -60 170 0 160 C60 150 120 170 190 155', f: 2, ft: .4, s: 7 }, sun(120, -120, 28),
  ], { moods: ['sereno', 'nostalgico'] });
  A('flamenco_ave', 'FLAMENCO', /\b(flamencos?|flamingos?|garzas?|herons?|cigüe[nñ]as?|storks?)\b/i, [
    { p: 'M-20 170 V50 M20 170 V60', s: 6 }, { e: [0, 20, 70, 42], f: 2, ft: .9, s: 9 }, { p: 'M50 10 C100 -60 60 -140 20 -110 C0 -95 30 -60 60 -90', s: 10 }, { c: [40, -120, 16], f: 2, ft: .9, s: 7 }, { p: 'M52 -122 L90 -105 L58 -105', f: 1, ft: .9, s: 5 },
    { p: 'M-70 10 C-100 -10 -100 40 -60 50 Z', f: 2, ft: .7, s: 6, m: 'flap', o: [-40, 20], v: .4 }, { p: 'M-190 170 H190', s: 8 },
  ], { moods: ['romantico', 'sereno'] });
  A('sombrero_charro', 'SOMBRERO', /\b(sombreros?|charro|mariachi|mariachis|vaqueros?|cowboys?|rancheras?|ranchero|texas hat)\b/i, [
    { e: [0, 60, 190, 44], f: 2, ft: .8, s: 9 }, { p: 'M-70 60 C-70 -40 -40 -120 0 -120 C40 -120 70 -40 70 60 Z', f: 2, ft: .9, s: 9 }, { p: 'M-70 30 C-30 45 30 45 70 30', f: 1, ft: .95, s: 8 }, { p: 'M-150 60 C-100 75 100 75 150 60', s: 5 },
    { p: 'M-30 -60 L-10 -50 M20 -80 L40 -70', s: 4 }, { p: 'M-170 62 C-190 50 -190 80 -170 78', s: 5 },
  ], { moods: ['euforico', 'feliz'] });
  A('guitarra_flamenca', 'GUITARRA ESPAÑOLA', /\b(guitarra espa[nñ]ola|flamenco|flamenca|sevillanas?|castañuelas?|castanets|toro de lidia|torero|bullfight\w*|corrida)\b/i, [
    { p: 'M-40 -10 C-60 -50 -20 -78 0 -72 C25 -78 60 -50 40 -10 C20 5 20 22 45 38 C82 68 70 138 0 138 C-70 138 -82 68 -45 38 C-20 22 -20 5 -40 -10 Z', f: 2, ft: .8, s: 9 },
    { c: [0, 60, 26], f: 1, ft: .95, s: 8 }, { p: 'M0 -72 V-190', s: 12 }, { p: 'M-14 -190 H14 V-160 H-14 Z', f: 1, ft: .9, s: 6 }, { p: 'M-24 115 H24', s: 7 },
  ], { g: { r: .5, dx: 10, dy: 20 }, moods: ['romantico', 'nostalgico', 'rabioso'] });
  A('tambor_samba', 'PANDEIRO', /\b(pandeiros?|tamborines?|tambourine|tambor(es)?|drums? line|percusi[oó]n|bater[ií]a de samba|bongos?|congas?|timbales?|bater[ií]a)\b/i, [
    { p: 'M-100 -60 C-100 -100 100 -100 100 -60 V60 C100 100 -100 100 -100 60 Z', f: 2, ft: .8, s: 10, m: 'beat', a: .06, o: [0, 0] }, { e: [0, -60, 100, 24], f: -1, s: 8 }, { p: 'M-70 -30 L-30 90 M-30 -30 L10 90 M20 -30 L50 90 M60 -30 L80 80', s: 5 },
    { p: 'M-130 -150 L-30 -80 M130 -150 L30 -80', f: 1, s: 12, m: 'wag', a: .1, o: [0, -80], b: 3 },
  ], { moods: ['euforico', 'feliz'] });
  A('mate_calabaza', 'MATE', /\b(yerba mate|gaucho|gauchos|pampas?|asado argentino|chimichurri)\b/i, [
    { p: 'M-90 -40 H90 C100 60 60 130 0 130 C-60 130 -100 60 -90 -40 Z', f: 2, ft: .7, s: 10 }, { e: [0, -40, 90, 18], f: 1, ft: .9, s: 8 }, { p: 'M-40 -40 L80 -170 M70 -170 H100', s: 8, i: 3 },
    { p: 'M-70 10 C-40 60 20 50 60 30', s: 4 }, { p: 'M-20 -80 C-30 -110 -10 -125 -20 -150', s: 4, m: 'steam', a: 30 },
  ], { moods: ['nostalgico', 'sereno'] });
  A('gaita', 'GAITA', /\b(gaitas?|bagpipes?|escocia|scotland|scottish|highlands?|celta|celtic|tartan|kilt)\b/i, [
    { e: [0, 20, 90, 70, .3], f: 1, ft: .85, s: 9 }, { p: 'M-40 -30 L-90 -150 M-10 -50 L-30 -170 M40 -30 L90 -130', s: 10 }, { p: 'M70 60 L170 100', s: 9 }, { p: 'M-60 20 L60 20 M-40 -20 L40 60 M40 -20 L-40 60', s: 4, i: 2 },
    { c: [-90, -155, 8], f: 2, s: 4 }, { c: [-30, -175, 8], f: 2, s: 4 }, { c: [90, -135, 8], f: 2, s: 4 },
  ], { moods: ['nostalgico', 'desafiante'] });
  A('oso_polar', 'OSO POLAR', /\b(osos? polar(es)?|polar bears?|ártico|arctic|antártida|antarctica|iglú|igloo|tundra|groenlandia|greenland)\b/i, [
    { e: [0, 60, 140, 70], f: -1, s: 10 }, { c: [-120, 10, 45], f: -1, s: 10 }, { p: 'M-150 -20 L-140 -50 L-120 -35', f: -1, s: 7 }, { c: [-135, 5, 5], f: 1, s: 0 }, { c: [-160, 20, 8], f: 1, s: 0 },
    { p: 'M-60 110 V160 M50 110 V160 M110 90 V150', s: 12 }, { p: 'M-190 165 C-100 145 100 175 190 155', f: 3, ft: .5, s: 7 }, { p: 'M40 -120 L60 -140 M80 -100 L110 -110 M100 -150 L110 -170', s: 3, m: 'fall', a: 40 },
  ], { moods: ['sereno', 'triste'] });
  A('paella', 'PAELLA', /\b(paella|tapas|jam[oó]n ib[eé]rico|sangr[ií]a|gazpacho|tortilla espa[nñ]ola|pintxos?|fideu[aá])\b/i, [
    { e: [0, 30, 180, 90], f: 3, ft: .6, s: 10 }, { e: [0, 25, 150, 70], f: 2, ft: .6, s: 6 }, { p: 'M-180 30 H-200 M180 30 H200', s: 9 },
    ...[[-60, 10], [0, 40], [60, 10], [-20, -10], [40, 50], [-70, 50]].map(([x, y], i) => ({ c: [x, y, 14], f: i % 2 ? 1 : -1, ft: .9, s: 6 })), { p: 'M-30 -10 C-40 -30 -20 -30 -30 -50', s: 4, m: 'steam', a: 20 },
  ], { moods: ['feliz'] });
  A('ceviche', 'CEVICHE', /\b(ceviche|cebiche|pisco|lomo saltado|empanadas? chilenas?|pollo a la brasa|pupusas?|baleadas?|gallo pinto|fritanga|nacatamal|vigor[oó]n|mofongo)\b/i, [
    { p: 'M-170 -10 H170 C170 100 90 150 0 150 C-90 150 -170 100 -170 -10 Z', f: -1, s: 10 }, ...[[-90, -50], [-30, -70], [30, -55], [90, -40], [-60, -20], [0, -30], [60, -15]].map(([x, y], i) => ({ p: L.rr(x - 14, y - 12, 30, 24, 8), f: [2, 3, 1][i % 3], ft: .85, s: 5 })),
    { p: 'M110 -100 L150 -140 L150 -60', f: 1, ft: .9, s: 6 },
  ], { moods: ['feliz'] });
  A('pasaporte_avion', 'VIAJE AL MUNDO', /\b(pasaporte|passport|viajar por el mundo|around the world|world tour|vuelta al mundo|emigrar|emigrate|inmigrante|immigrant|migrar)\b/i, [
    { p: L.rr(-90, -130, 180, 250, 14), f: 1, ft: .85, s: 10 }, { c: [0, -30, 50], f: -1, s: 7 }, { p: 'M-50 -30 H50 M0 -80 V20 M-35 -55 C-10 -30 10 -30 35 -55 M-35 5 C-10 -20 10 -20 35 5', s: 4 }, { p: 'M-50 60 H50 M-50 85 H30', s: 5, i: 2 },
    { p: 'M110 -130 L190 -150 L160 -110 L130 -100 Z', f: 2, ft: .95, s: 6, m: 'drift', a: 10 },
  ], { moods: ['nostalgico', 'euforico'] });
  A('desfile_carnaval', 'CARNAVAL', /\b(carnaval|carnival|comparsa|mardi gras|m[aá]scaras? venecianas?|masquerade)\b/i, [
    { p: 'M-110 -30 C-110 -100 110 -100 110 -30 C110 40 40 30 0 -10 C-40 30 -110 40 -110 -30 Z', f: 2, ft: .85, s: 10 }, { e: [-50, -40, 24, 14, -.2], f: -1, s: 7 }, { e: [50, -40, 24, 14, .2], f: -1, s: 7 },
    { p: 'M-110 -30 C-160 -60 -170 -120 -150 -170 M110 -30 C160 -60 170 -120 150 -170 M0 -85 C-10 -140 10 -170 0 -200', f: 1, ft: .8, s: 7, m: 'sway', a: .05, o: [0, -40] }, { p: L.star(-150, 90, 16, 5, .4), f: 3, ft: .9, s: 4, m: 'spin', a: 1.5, o: [-150, 90] },
    { p: L.star(150, 100, 14, 5, .4), f: 1, ft: .9, s: 4, m: 'spin', a: -1.5, o: [150, 100] },
  ], { moods: ['euforico', 'feliz'] });
})();
