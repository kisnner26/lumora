// ============================================================
// riso-props-famosos.js — famosos por emblema, nunca por retrato (oleada 4 del catálogo).
// Cada uno se dibuja con objetos que lo evocan (guante, balón, molino…); sin caras parecidas, sin logotipos,
// sin políticos ni líderes religiosos. Ver riso-props-lib.js.
// ============================================================
(() => {
  const R = window.RISO; if (!R || !R.lib) return;
  const { add, L } = R.lib, C = 'famosos';
  const A = (id, label, rx, shapes, opt) => add(id, C, label, rx, shapes, opt);
  const ball = (x, y, r = 60, ft = .8) => [{ c: [x, y, r], f: -1, s: 9 }, { p: L.poly([x - r * .3, y - r * .2], [x + r * .3, y - r * .2], [x + r * .4, y + r * .25], [x, y + r * .5], [x - r * .4, y + r * .25]), f: 1, ft: .9, s: 5 }, { p: `M${x - r * .3} ${y - r * .2} L${x - r * .7} ${y - r * .45} M${x + r * .3} ${y - r * .2} L${x + r * .7} ${y - r * .45} M${x + r * .4} ${y + r * .25} L${x + r * .75} ${y + r * .4} M${x} ${y + r * .5} V${y + r * .95} M${x - r * .4} ${y + r * .25} L${x - r * .75} ${y + r * .4}`, s: 4 }];
  const glove = (x, y, k = 1, f = 2) => ({ p: `M${x - 40 * k} ${y + 60 * k} V${y - 10 * k} C${x - 40 * k} ${y - 50 * k} ${x - 10 * k} ${y - 60 * k} ${x + 30 * k} ${y - 50 * k} C${x + 70 * k} ${y - 40 * k} ${x + 70 * k} ${y + 30 * k} ${x + 40 * k} ${y + 50 * k} V${y + 90 * k} H${x - 30 * k} Z`, f, ft: .9, s: 9 });
  const star = (x, y, r = 14, f = 2) => ({ p: L.star(x, y, r, 5, .45), f, ft: .95, s: 4, m: 'pulse', a: .2, o: [x, y] });
  const gnd = { p: 'M-190 170 H190', s: 8 };

  // ---------- música ----------
  A('michael_jackson', 'MICHAEL JACKSON', /\b(michael jackson|rey del pop|king of pop|moonwalk|thriller|billie jean)\b/i, [
    { p: 'M-120 -20 C-120 -80 -60 -100 0 -100 C60 -100 120 -80 120 -20 Z', f: 1, ft: .95, s: 9 }, { p: 'M-150 -20 H150 C150 -5 100 0 0 0 C-100 0 -150 -5 -150 -20 Z', f: 1, ft: .95, s: 9 }, { p: 'M-110 -30 H110', f: 2, s: 10 },
    { p: 'M-70 70 C-100 60 -100 130 -60 150 L-30 150 C-10 130 -10 80 -30 60 Z', f: -1, s: 8 }, { p: 'M-60 90 H-25 M-60 110 H-25 M-58 130 H-30', s: 3 }, ...[[-50, 40], [-10, 10], [30, 30], [70, 10]].map(([x, y]) => star(x, y, 9, 3)), { p: 'M20 170 H190', s: 8, i: 2 },
  ]);
  A('elvis', 'ELVIS', /\b(elvis|presley|el rey del rock|king of rock)\b/i, [
    { p: 'M-90 -20 C-100 -90 -40 -120 20 -110 C90 -120 130 -70 90 -20 C60 -50 -40 -50 -90 -20 Z', f: 1, ft: .95, s: 9, m: 'sway', a: .02, o: [0, 0] }, { p: 'M-90 20 H-20 M20 20 H90', s: 10 }, { c: [-55, 20, 36], f: 1, ft: .95, s: 9 }, { c: [55, 20, 36], f: 1, ft: .95, s: 9 }, { p: 'M-20 15 C-5 5 5 5 20 15', s: 8 },
    { p: 'M-150 150 L-90 90 H90 L150 150 Z', f: 2, ft: .85, s: 9 }, { p: 'M-90 90 L-40 130 L0 90 L40 130 L90 90', s: 5 }, { p: 'M-60 60 C-20 80 20 80 60 60', s: 4 },
  ]);
  A('bob_marley', 'BOB MARLEY', /\b(bob marley|marley|rastafari|rasta|reggae|jah)\b/i, [
    { p: 'M0 130 V-30', s: 9 }, ...[[-70, -70, -.7], [70, -70, .7], [-90, 0, -1.1], [90, 0, 1.1], [0, -130, 0]].map(([x, y, r]) => ({ p: `M0 ${y + 70} C${x * .5} ${y + 30} ${x} ${y + 30} ${x} ${y}`, s: 6 })),
    ...[[-70, -70], [70, -70], [-95, 10], [95, 10], [0, -140]].map(([x, y], i) => ({ e: [x, y, 22, 55, i === 0 ? -.6 : i === 1 ? .6 : i === 2 ? -1.1 : i === 3 ? 1.1 : 0], f: 1, ft: .85, s: 8, m: 'sway', a: .03, o: [0, 60], ph: i })), { p: 'M-90 150 H90', s: 6 }, { p: 'M-90 150 V170 M-30 150 V170 M30 150 V170 M90 150 V170', s: 8, i: 2 },
  ]);
  A('beatles', 'LOS BEATLES', /\b(the beatles|beatles|john lennon|paul mccartney|ringo|abbey road|yellow submarine)\b/i, [
    { e: [0, 0, 100, 60], f: 1, ft: .9, s: 10 }, { p: 'M-100 0 C-140 -50 -150 -30 -170 -60 M-60 -50 L-90 -100 M60 -50 L90 -100', s: 8 }, { p: 'M-40 -60 C-20 -75 20 -75 40 -60', f: -1, s: 5 }, { p: 'M-100 15 L-170 60 M-60 55 L-80 110 M0 60 V120 M60 55 L80 110 M100 15 L170 60', s: 6 },
    ...[-60, -20, 20, 60].map(x => ({ c: [x, 130, 22], f: 3, ft: .8, s: 6 })), { p: 'M-190 170 H190', s: 6, i: 2, m: 'drift', a: 4 }, { p: 'M-190 178 H190', s: 3 },
  ]);
  A('freddie_mercury', 'FREDDIE MERCURY', /\b(freddie mercury|freddie|bohemian rhapsody|queen band|we will rock you)\b/i, [
    { p: 'M-110 -60 C-40 -30 40 -30 110 -60 C80 -20 40 -10 0 -10 C-40 -10 -80 -20 -110 -60 Z', f: 1, ft: .95, s: 9 }, { c: [0, -70, 0], s: 0 }, { p: 'M-30 60 L0 100 L30 60', s: 0 },
    { c: [0, 40, 50], f: 3, ft: .7, s: 8 }, { p: 'M0 90 V170 M-40 175 H40', s: 10 }, { p: 'M-60 -100 L-30 -130 L0 -100 L30 -130 L60 -100 V-70 H-60 Z', f: 2, ft: .95, s: 8 }, { p: 'M-130 20 L-190 -20 M130 20 L190 -20', s: 5, m: 'pulse', a: .2, v: 3, o: [0, 20] },
  ]);
  A('david_bowie', 'DAVID BOWIE', /\b(david bowie|bowie|ziggy stardust|starman|major tom)\b/i, [
    { e: [0, 0, 100, 130], f: -1, s: 10 }, { p: 'M50 -150 L-10 -40 H30 L-40 60 L70 -50 H25 L60 -150 Z', f: 2, ft: .95, s: 8 }, { p: 'M-60 -110 C-90 -80 -110 -30 -120 40', s: 0 }, { p: L.star(-130, -110, 12, 4, .4), f: 1, s: 3, m: 'pulse', a: .4, o: [-130, -110] }, { p: L.star(140, 100, 10, 4, .4), f: 1, s: 3, m: 'pulse', a: .4, o: [140, 100], ph: 1 },
    { p: 'M-40 -30 H-10 M20 -30 H50', s: 7 }, { p: 'M-20 60 C0 70 20 70 40 60', s: 5 },
  ]);
  A('kurt_cobain', 'KURT COBAIN', /\b(kurt cobain|cobain|nirvana|smells like teen spirit|grunge)\b/i, [
    { p: 'M-150 -20 C-160 -120 -40 -130 -30 -60 C-20 -100 80 -120 100 -60 C130 -50 150 -10 130 40 C120 60 80 50 30 50 C-30 50 -100 60 -150 -20 Z', f: 3, ft: .6, s: 9 }, { p: 'M-40 -30 H-20 M30 -20 H50', s: 6 }, { p: 'M-190 170 L-90 60 L20 100 L120 60 L190 170 Z', f: 1, ft: .7, s: 9 }, { p: 'M-90 60 V170 M-40 80 V170 M0 90 V170', s: 3 },
    { p: 'M120 60 L170 -20 M160 -30 L190 -10', s: 8 }, { c: [0, 0, 8], f: 2, s: 0 },
  ]);
  A('jimi_hendrix', 'JIMI HENDRIX', /\b(jimi hendrix|hendrix|purple haze|woodstock)\b/i, [
    { p: 'M-30 40 C-110 40 -110 -30 -60 -30 C-100 -80 -20 -100 0 -60 C20 -100 100 -80 60 -30 C110 -30 110 40 30 40 C50 90 40 150 0 150 C-40 150 -50 90 -30 40 Z', f: 1, ft: .8, s: 9 }, { p: 'M0 -60 L60 -190', s: 12 }, { p: 'M-70 130 C-100 90 -60 60 -80 20 C-30 50 -50 100 -20 150 Z', f: 2, ft: .95, s: 6, m: 'sway', a: .06, o: [-60, 140] }, { p: 'M-110 100 C-140 60 -100 30 -120 -20 C-70 10 -90 60 -70 110 Z', f: 2, ft: .95, s: 6, m: 'sway', a: .06, o: [-90, 120], ph: 1 },
    { p: 'M40 -190 L120 -170 L100 -140 L30 -160 Z', f: 3, ft: .9, s: 5 },
  ], { g: { r: .3 } });
  A('bad_bunny', 'BAD BUNNY', /\b(bad bunny|benito|conejo malo|un verano sin ti|yhlqmdlg)\b/i, [
    { c: [0, 30, 90], f: -1, s: 10 }, { p: 'M-40 -40 C-70 -170 -20 -190 -15 -60 M15 -50 C30 -170 70 -180 45 -50', f: -1, s: 10 }, { p: 'M-32 -60 C-42 -140 -28 -150 -25 -60 M25 -60 C28 -130 45 -135 38 -60', f: 3, ft: .7, s: 0 },
    { p: L.rr(-80, -10, 160, 50, 20), f: 1, ft: .95, s: 9 }, { p: 'M-80 10 H80', s: 0 }, { p: 'M-20 90 C-5 105 5 105 20 90', s: 6 }, { c: [0, 75, 8], f: 1, s: 0 }, { p: L.star(130, -110, 16, 4, .4), f: 2, ft: .95, s: 4, m: 'pulse', a: .3, o: [130, -110] },
  ]);
  // capucha crema, máscara facetada y bastón cromado de la referencia escénica.
  A('the_weeknd', 'THE WEEKND', /\b(the weeknd|weeknd|abel tesfaye)\b/i, [
    { e: [0, 183, 104, 12, 0], f: 1, ft: .3, s: 0 },
    { p: 'M-45 55 L-47 174 H-10 L0 63 L12 174 H49 L43 55 Z', f: -1, s: 7 },
    { p: 'M-40 96 L-27 170 M32 92 L27 170 M0 65 V103', s: 4, i: 3 },
    { p: 'M-48 170 H-9 L-7 183 H-61 Z M12 170 H49 L60 183 H10 Z', f: 1, s: 5 },
    { p: 'M-49 -83 C-77 -79 -94 -59 -97 -22 L-90 150 L-47 161 L-28 42 H30 L47 160 L88 148 L79 -25 C79 -62 56 -80 42 -83 Z', f: -1, s: 8 },
    { p: 'M-64 -56 L-71 132 L-54 152 L-36 18 L-45 -65 M49 -63 L38 20 L58 150 L72 139 L63 -53', f: 3, ft: .25, s: 4 },
    { p: 'M-33 -67 L-38 44 Q0 60 38 44 L30 -67 Z', f: -1, s: 6 },
    { p: 'M-34 -47 L0 -16 L32 -47 M0 -15 V43 M-35 29 H35 M-27 44 L-36 63 L4 54 L36 65 L29 45', s: 4, i: 3 },
    { p: 'M-43 -69 L-15 -22 L0 -59 L17 -22 L43 -69', f: -1, s: 5 },
    { p: 'M-32 -126 L-26 -78 Q0 -57 27 -78 L34 -126 Z', f: 2, ft: .5, s: 5 },
    { p: 'M-47 -78 C-87 -100 -61 -155 -18 -187 L4 -198 L31 -184 C59 -151 70 -111 55 -78 L32 -62 L38 -130 Q5 -163 -33 -129 L-31 -66 Z', f: -1, s: 7 },
    { p: 'M-42 -85 Q-62 -116 -25 -163 M28 -173 Q60 -123 43 -86', s: 4, i: 3 },
    { p: 'M-34 -133 L-23 -159 L6 -168 L29 -155 L39 -130 L29 -100 L12 -90 L-13 -94 L-31 -109 Z', f: 3, ft: .8, s: 6 },
    { p: 'M-23 -159 L-12 -131 L6 -168 L9 -132 L29 -155 L25 -123 L39 -130 L24 -108 L10 -117 L-13 -94 L-9 -119 L-31 -109 L-22 -130 L-34 -133 Z', f: -1, s: 3 },
    { p: 'M-27 -134 L-10 -130 L-15 -123 L-28 -126 Z M12 -131 L29 -137 L27 -126 L14 -124 Z', f: 1, s: 3 },
    { p: 'M3 -139 L-4 -115 L10 -113 M-14 -101 Q0 -89 16 -102', s: 4, i: 1 },
    { p: 'M-25 -106 L-16 -85 L0 -77 L19 -86 L27 -105 L14 -100 L7 -107 H-7 L-14 -100 Z', f: 1, s: 3 },
    { p: 'M-8 -93 H9', s: 3, i: 2 },
    { p: 'M-70 -62 Q-98 -55 -103 -19 L-91 13 L-44 -3 L-49 -25 L-75 -18 L-66 -49', f: -1, s: 7 },
    { p: 'M-50 -26 L-30 -32 L-18 -19 L-25 -5 L-46 0 Z', f: 3, ft: .45, s: 5 },
    { p: 'M-42 -23 L-29 -17 M-43 -14 L-31 -9', s: 3 },
    { p: 'M63 -59 Q83 -51 89 -14 L81 26 L50 14 L58 -10 L61 -39', f: -1, s: 7 },
    { p: 'M101 174 C114 120 99 53 109 10 C122 -42 101 -103 91 -143 Q85 -160 102 -166 L126 -173 L132 -165 L111 -151 Q110 -142 115 -123 C137 -59 122 -20 122 15 C111 76 125 129 113 178 Z', f: 3, ft: .7, s: 6 },
    { p: 'M106 160 C116 110 104 57 116 13 M105 -143 Q116 -135 120 -102 M104 -160 L125 -167', s: 3, i: -1 },
    { p: 'M57 2 L78 -3 L105 6 L108 21 L94 31 L70 23 L51 17 Z', f: 3, ft: .45, s: 5 },
    { p: 'M78 5 L99 12 M76 13 L97 20', s: 3 },
    { p: 'M-75 56 L-81 130 M67 54 L77 126 M-60 0 L-55 24', s: 3, i: 3 },
  ], { moods: ['epico', 'oscuro'] });
  A('shakira', 'SHAKIRA', /\b(shakira|hips don't lie|waka waka|caderas|belly dance|danza del vientre)\b/i, [
    { p: 'M-40 -190 C-20 -100 -50 -50 -40 20 C-30 80 -60 130 -30 190', s: 10, m: 'sway', a: .04, o: [0, -190] }, { p: 'M40 -190 C20 -100 50 -50 40 20 C30 80 60 130 30 190', s: 10, m: 'sway', a: .04, o: [0, -190], ph: 1 }, { p: 'M-40 20 C-90 40 -90 90 -60 100 L60 100 C90 90 90 40 40 20 Z', f: 2, ft: .85, s: 9, m: 'sway', a: .06, o: [0, 20] },
    ...[-60, -30, 0, 30, 60].map((x, i) => ({ c: [x, 90, 6], f: -1, s: 5, m: 'bob', a: 3, ph: i })), { p: 'M-120 -120 C-90 -150 -50 -140 -30 -110', s: 5, i: 3 },
  ], { g: { s: .95 } });
  A('selena', 'SELENA', /\b(selena quintanilla|selena|bidi bidi bom bom|como la flor|reina del tex.?mex)\b/i, [
    { p: 'M0 130 C0 90 0 40 0 0', s: 9 }, ...Array.from({ length: 8 }, (_, i) => { const a = i / 8 * Math.PI * 2; return { e: [Math.cos(a) * 55, -40 + Math.sin(a) * 55, 34, 20, a], f: 1, ft: .85, s: 7, m: 'sway', a: .015, o: [0, 120] }; }), { c: [0, -40, 26], f: 2, ft: .95, s: 8 }, { p: 'M0 80 C-50 70 -80 40 -70 20 C-30 30 0 50 0 80 Z', f: 1, ft: .8, s: 6 },
    { p: 'M60 150 V90 M40 90 H80 M60 150 H40 M60 150 H80', s: 6, i: 3 },
  ]);
  A('celia_cruz', 'CELIA CRUZ', /\b(celia cruz|la reina de la salsa|az[uú]car)\b/i, [
    { p: L.rect(-70, -20, 140, 140), f: -1, s: 10, m: 'sway', a: .03, o: [0, 120] }, { p: 'M-70 20 L0 -20 L70 20 M-70 60 L0 20 L70 60 M-70 100 L0 60 L70 100', s: 3 }, { p: 'M-70 -20 L-30 -70 H100 L70 -20 Z', f: 3, ft: .6, s: 8 }, { p: 'M-90 -70 C-110 -160 110 -160 90 -70', f: 2, ft: .95, s: 9, m: 'sway', a: .02, o: [0, -70] },
    ...[-60, -20, 20, 60].map((x, i) => ({ p: L.star(x, -120, 10, 5, .45), f: 1, ft: .9, s: 3, m: 'pulse', a: .3, o: [x, -120], ph: i })),
  ]);
  A('luis_miguel', 'LUIS MIGUEL', /\b(luis miguel|el sol de m[eé]xico|luismi|la incondicional)\b/i, [
    { c: [0, 0, 90], f: 2, ft: .95, s: 10, m: 'pulse', a: .03, o: [0, 0] }, ...Array.from({ length: 16 }, (_, i) => { const a = i / 16 * Math.PI * 2; return { p: `M${(Math.cos(a) * 105).toFixed(0)} ${(Math.sin(a) * 105).toFixed(0)} L${(Math.cos(a) * (150 + (i % 2) * 30)).toFixed(0)} ${(Math.sin(a) * (150 + (i % 2) * 30)).toFixed(0)}`, s: 7, m: 'spin', a: .1, o: [0, 0] }; }),
    { p: L.rr(-50, -12, 100, 24, 8), f: 1, ft: .95, s: 7 }, { p: 'M-20 40 C-5 52 5 52 20 40', s: 5 },
  ]);
  A('beyonce', 'BEYONCÉ', /\b(beyonc[eé]|beyhive|queen bey|single ladies|crazy in love|lemonade)\b/i, [
    { p: 'M-90 60 C-90 -10 -50 -50 0 -50 C50 -50 90 -10 90 60 C50 30 -50 30 -90 60 Z', f: 2, ft: .9, s: 10 }, { p: 'M-70 40 C-30 30 30 30 70 40', s: 6, i: 1 }, { p: 'M-60 10 C-30 0 30 0 60 10', s: 5, i: 1 }, { p: 'M-40 -10 L-70 -40 L-100 -20 C-90 -10 -60 0 -40 -10 Z', f: -1, s: 5, m: 'flap', o: [-40, -10], v: 3 }, { p: 'M40 -10 L70 -40 L100 -20 C90 -10 60 0 40 -10 Z', f: -1, s: 5, m: 'flap', o: [40, -10], v: 3 },
    { p: 'M-40 80 H40 M-30 100 H30', s: 6 }, { p: 'M0 -50 V-80 M-8 -80 H8', s: 6 }, { p: 'M-50 130 L0 180 L50 130 L0 90 Z', f: 1, ft: .9, s: 8 },
  ]);
  A('rihanna', 'RIHANNA', /\b(rihanna|umbrella|diamonds in the sky|fenty)\b/i, [
    { p: 'M-150 20 C-150 -110 150 -110 150 20 C110 -10 70 20 30 -10 C-10 20 -50 -10 -70 20 C-100 -10 -130 20 -150 20 Z', f: 1, ft: .9, s: 10 }, { p: 'M0 20 V150 C0 175 40 175 40 150', s: 9 }, { p: 'M-90 -40 C-80 -60 -60 -60 -50 -40 M50 -60 C60 -75 80 -75 90 -55', s: 4, i: 2 },
    { p: 'M-100 -10 L-110 60 M-40 0 L-50 80 M60 0 L55 80 M110 -10 L120 60', s: 4, i: 3, m: 'fall', a: 60 }, { p: L.star(-160, -110, 12, 4, .4), f: 2, s: 3, m: 'pulse', a: .4, o: [-160, -110] },
  ]);
  A('taylor_swift', 'TAYLOR SWIFT', /\b(taylor swift|swifties?|eras tour|shake it off|love story taylor|cruel summer|folklore|evermore)\b/i, [
    { p: 'M-60 -100 L-80 100 H80 L60 -100 Z', f: 3, ft: .5, s: 9 }, { p: 'M-50 -60 H50 M-58 -20 H58 M-64 20 H64 M-70 60 H70', s: 3 }, { p: 'M-60 -100 C-60 -160 60 -160 60 -100', s: 9 },
    { p: 'M-190 130 C-140 100 -100 140 -60 120', s: 9, i: 2 }, ...[[-170, 120], [-130, 118], [-95, 130]].map(([x, y], i) => ({ c: [x, y, 9], f: [1, 2, 3][i], ft: .9, s: 4 })), { p: L.heart(120, -60, 3), f: 2, ft: .9, s: 6, m: 'pulse', a: .1, o: [120, -60], v: 2 },
    { p: L.rect(-20, -130, 40, 18), f: 2, ft: .95, s: 0 },
  ]);
  A('eminem', 'EMINEM', /\b(eminem|slim shady|marshall mathers|lose yourself|8 mile)\b/i, [
    { p: 'M-110 20 C-110 -80 110 -80 110 20 Z', f: 1, ft: .95, s: 10 }, { p: 'M-110 20 H150 C150 40 -110 40 -110 20 Z', f: 1, ft: .95, s: 9 }, { p: 'M-60 -10 H60', s: 5, i: 2 },
    { p: L.rr(-50, 60, 100, 100, 14), f: -1, s: 9 }, { p: 'M-30 80 V140 M-30 80 L0 110 L30 80 V140', s: 10 }, { p: 'M-190 170 H190', s: 8 },
  ]);
  A('tupac', 'TUPAC', /\b(tupac|2pac|shakur|all eyez on me|changes tupac)\b/i, [
    { p: 'M-100 -30 C-100 -110 100 -110 100 -30 C100 -10 60 0 0 0 C-60 0 -100 -10 -100 -30 Z', f: 1, ft: .9, s: 10 }, { p: 'M-100 -10 L-150 50 M100 -10 L150 50', s: 10 }, { p: 'M-90 -60 L-40 -80 M90 -60 L40 -80', s: 4, i: 2 },
    { c: [0, -50, 12], f: -1, s: 5 }, { p: 'M-190 170 L-100 100 L-40 140 L20 90 L100 150 L190 100 V170 Z', f: 3, ft: .6, s: 8 },
  ]);
  A('daddy_yankee', 'DADDY YANKEE', /\b(daddy yankee|gasolina|el cangri|dale don dale|la gasolina)\b/i, [
    { p: L.rr(-60, -100, 120, 180, 16), f: 1, ft: .9, s: 10 }, { p: L.rect(-40, -80, 80, 60), f: -1, s: 7 }, { p: 'M60 -60 H100 C120 -60 120 -20 100 -20 V60 L120 80', s: 9 }, { p: 'M-40 80 H40 V120 H-40 Z', f: 2, ft: .9, s: 8 }, { p: 'M-110 180 H110', s: 8 }, { p: 'M-20 -50 L0 -30 L20 -50', s: 5 },
    { p: 'M-100 -140 L-70 -110 M100 -140 L70 -110 M0 -170 V-130', s: 5, m: 'pulse', a: .2, v: 4, o: [0, -100] },
  ]);
  A('adele', 'ADELE', /\b(adele|hello from the other side|rolling in the deep|someone like you|skyfall adele)\b/i, [
    { p: 'M-30 -130 H30 C50 -130 55 -110 55 -90 V90 C55 110 50 130 30 130 H-30 C-50 130 -55 110 -55 90 V-90 C-55 -110 -50 -130 -30 -130 Z', f: 3, ft: .6, s: 10 }, { p: L.rect(-35, -100, 70, 150), f: 1, ft: .9, s: 5 }, { c: [0, 90, 14], s: 6 }, { p: 'M-80 -60 C-100 -100 -140 -110 -170 -90 M80 -60 C100 -100 140 -110 170 -90', s: 5, i: 2, m: 'pulse', a: .1, o: [0, -60], v: 2 },
    { c: [140, 40, 10], s: 3, m: 'fall', a: 100 },
  ]);
  A('amy_winehouse', 'AMY WINEHOUSE', /\b(amy winehouse|winehouse|back to black|rehab amy|valerie amy)\b/i, [
    { p: 'M-70 10 C-100 -60 -70 -160 -20 -180 C0 -195 40 -190 60 -170 C100 -130 90 -50 70 10 C40 -20 -40 -20 -70 10 Z', f: 1, ft: .95, s: 10, m: 'sway', a: .015, o: [0, 40] }, { p: 'M-40 -70 L-90 -85 M40 -70 L90 -85', s: 8 }, { p: 'M-70 10 C-30 30 30 30 70 10', s: 6 },
    { c: [0, 80, 40], f: 3, ft: .6, s: 8 }, { p: 'M-40 80 H40', s: 4 },
  ]);
  A('madonna', 'MADONNA', /\b(material girl|like a virgin|la reina del pop)\b/i, [
    { p: 'M-80 100 C-80 40 -40 20 0 20 C40 20 80 40 80 100 Z', f: 2, ft: .85, s: 10 }, { p: 'M0 20 L-20 -100 L20 -100 Z', f: 1, ft: .95, s: 9 }, { p: 'M-120 -20 L-50 -30 M120 -20 L50 -30', f: 1, s: 10 },
    ...[[-90, -60], [90, -60], [0, -140]].map(([x, y], i) => ({ c: [x, y, 12], f: 2, ft: .95, s: 6, m: 'pulse', a: .2, o: [x, y], ph: i })), { p: 'M-150 150 H150', s: 8 },
  ]);
  A('juanes', 'JUANES', /\b(juanes|la camisa negra|a dios le pido|colombia tengo el alma)\b/i, [
    { p: 'M-30 40 C-110 40 -110 -30 -60 -30 C-100 -80 -20 -100 0 -60 C20 -100 100 -80 60 -30 C110 -30 110 40 30 40 C50 90 40 150 0 150 C-40 150 -50 90 -30 40 Z', f: 1, ft: .95, s: 9 }, { p: 'M0 -60 V-190', s: 12 }, { p: 'M-14 -190 H14 V-160 H-14 Z', f: 2, ft: .9, s: 6 }, { c: [0, 60, 26], f: -1, s: 7 },
    { p: L.star(110, -120, 20, 5, .45), f: 2, ft: .95, s: 5, m: 'pulse', a: .1, o: [110, -120] },
  ]);

  // ---------- deporte ----------
  A('messi', 'MESSI', /\b(messi|lionel messi|leo messi|la pulga|la pulga atómica)\b/i, [
    ...ball(-40, 40, 70), { p: 'M20 -110 V-40 M20 -110 H90 V-40 H20', s: 8, m: 'pulse', a: .03, o: [55, -75] }, { p: 'M40 -95 V-55 M55 -95 L72 -55', s: 9, i: 2, m: 'pulse', a: .03, o: [55, -75] }, { p: 'M-190 170 H190', s: 8 }, { p: 'M-120 -60 L-90 -100 M-50 -100 L-40 -140', s: 5, m: 'pulse', a: .2, v: 3, o: [-50, -80] },
    { p: L.star(130, 30, 22, 5, .45), f: 2, ft: .95, s: 6, m: 'pulse', a: .1, o: [130, 30] },
  ]);
  A('lamine_yamal', 'LAMINE YAMAL', /\b(lamine yamal|lamine|yamal|lamine yamal nasraoui)\b/i, [
    { p: 'M-135 190 C-135 125 -95 92 -40 82 H40 C95 92 135 125 135 190 Z', f: -1, s: 9 },
    { p: 'M-124 112 L-70 92 M-130 130 L-78 108 M-136 148 L-86 124', s: 4, i: 1 }, { p: 'M124 112 L70 92 M130 130 L78 108 M136 148 L86 124', s: 4, i: 1 },
    { p: 'M-24 40 H24 V92 H-24 Z', f: 3, ft: .55, s: 7 },
    { p: 'M-52 76 L0 128 L52 76', s: 11, i: 1 }, { p: 'M-38 80 L0 116 L38 80', s: 5, i: 2 },
    { p: 'M-92 122 H-62 V146 C-62 158 -77 164 -77 164 C-77 164 -92 158 -92 146 Z', f: 2, ft: .9, s: 4 }, { p: L.star(-77, 108, 7, 5, .45), f: 1, s: 3, m: 'pulse', a: .15, o: [-77, 108] },
    { p: 'M-34 138 L-22 128 V176', s: 7, i: 1 }, { c: [14, 146, 14], f: -1, s: 7, i: 1 }, { p: 'M28 146 C28 164 24 172 10 176', s: 7, i: 1 },
    { c: [-48, -24, 11], f: 3, ft: .55, s: 6 }, { c: [48, -24, 11], f: 3, ft: .55, s: 6 },
    { c: [0, -98, 48], f: 1, ft: .95, s: 0 },
    ...Array.from({ length: 11 }, (_, k) => { const a = Math.PI * (1 + k / 10), x = Math.cos(a) * 66, y = -74 + Math.sin(a) * 60; return { c: [x, y, 24 + (k % 3) * 3], f: 1, ft: .95, s: 6 }; }),
    ...Array.from({ length: 9 }, (_, k) => { const a = Math.PI * (1.06 + k / 10.5), x = Math.cos(a) * 58, y = -78 + Math.sin(a) * 50; return { c: [x, y, 9], f: 2, ft: .85, s: 0, m: 'pulse', a: .06, o: [x, y], ph: k }; }),
    { p: 'M-44 -58 C-44 -8 -28 42 0 46 C28 42 44 -8 44 -58 C44 -92 -44 -92 -44 -58 Z', f: 3, ft: .55, s: 8 },
    { c: [-18, -26, 4.5], f: 1, s: 0 }, { c: [18, -26, 4.5], f: 1, s: 0 }, { p: 'M-30 -42 H-9 M9 -42 H30', s: 5 }, { p: 'M0 -22 L-6 0 H6', s: 3 }, { p: 'M-12 22 H12', s: 4 },
    { p: 'M-47 -56 C-22 -68 22 -68 47 -56', s: 10, i: 2 },
    ...[-38, -20, 0, 20, 38].map((x, k) => ({ c: [x, -72 - (k % 2) * 4, 13], f: 1, ft: .95, s: 5 })),
    ...[-28, 6, 30].map((x, k) => ({ c: [x, -74, 6], f: 2, ft: .85, s: 0, m: 'pulse', a: .06, o: [x, -74], ph: k })),
  ]);
  A('maradona', 'MARADONA', /\b(maradona|diego maradona|diego armando|la mano de dios|d10s|el pelusa)\b/i, [
    { p: 'M-60 100 V-20 C-60 -60 -30 -80 0 -80 C30 -80 60 -60 60 -20 V100 Z', f: 3, ft: .6, s: 9 }, { p: 'M-60 -20 H60 M-60 20 H60 M-60 60 H60', s: 12, i: 2 }, { p: 'M40 -70 C80 -140 130 -140 150 -110 L170 -160', s: 9 }, { p: 'M150 -110 C180 -100 190 -70 170 -50', f: -1, s: 6 },
    ...ball(-110, 130, 40), { p: 'M-190 180 H190', s: 8 }, { p: 'M0 -110 L0 -130 M-20 -100 L-30 -120 M20 -100 L30 -120', s: 5, m: 'pulse', a: .3, v: 3, o: [0, -90] },
  ]);
  A('pele', 'PELÉ', /\b(pel[eé]|edson arantes|o rei pel[eé]|rey pel[eé])\b/i, [
    ...ball(0, 60, 80), { p: 'M-70 -60 L-50 -110 L-20 -80 L0 -125 L20 -80 L50 -110 L70 -60 Z', f: 2, ft: .95, s: 9 }, ...[-40, 0, 40].map(x => ({ c: [x, -70, 6], f: 1, s: 0 })), { p: 'M-190 175 H190', s: 8 }, { c: [0, -140, 8], f: 1, s: 5, m: 'pulse', a: .3, o: [0, -140] },
  ]);
  A('cristiano', 'CRISTIANO RONALDO', /\b(cristiano ronaldo|cr7|siuuu+|ronaldo)\b/i, [
    { p: 'M-60 -100 L0 -170 L60 -100 L40 -30 H-40 Z', f: 2, ft: .8, s: 9 }, { p: 'M-30 -60 L0 -100 L30 -60', s: 6 }, ...ball(-120, 100, 45), { p: 'M20 -30 V100 M-20 -30 V100', s: 9 }, { p: 'M-40 100 H60 V150 H-40 Z', f: 1, ft: .9, s: 8 },
    { p: 'M110 -40 L170 -100 M100 0 L180 -20', s: 5, m: 'pulse', a: .2, v: 3, o: [100, -30] }, { p: 'M-190 175 H190', s: 8 },
  ]);
  A('michael_jordan', 'MICHAEL JORDAN', /\b(michael jordan|air jordan|his airness|chicago bulls|jordan 23)\b/i, [
    { c: [0, -20, 70], f: 2, ft: .85, s: 10 }, { p: 'M-70 -20 H70 M0 -90 V50 M-50 -60 C-20 -30 -20 10 -50 30 M50 -60 C20 -30 20 10 50 30', s: 4 }, { p: 'M-60 -50 C-110 -70 -170 -60 -190 -20 C-150 -30 -110 -20 -75 0 Z', f: -1, s: 7, m: 'flap', o: [-60, -20], v: .8 }, { p: 'M60 -50 C110 -70 170 -60 190 -20 C150 -30 110 -20 75 0 Z', f: -1, s: 7, m: 'flap', o: [60, -20], v: .8 },
    { p: 'M-40 100 H40 M-30 100 V150 M0 100 V150 M30 100 V150 M-40 150 H40', s: 5 }, { p: 'M-30 170 H30', s: 8 },
  ]);
  A('kobe_bryant', 'KOBE BRYANT', /\b(kobe bryant|kobe|black mamba|mamba mentality|lakers|24 y 8)\b/i, [
    { p: 'M-190 130 C-120 110 -60 140 -10 120 C30 100 60 60 20 30 C-20 0 -20 -60 20 -80 C60 -100 100 -70 90 -30 C100 -10 60 0 70 20 C100 40 130 80 80 110 C50 130 -10 160 -60 170 C-120 180 -170 160 -190 130 Z', f: 3, ft: .6, s: 9, m: 'sway', a: .02, o: [90, -30] }, { p: 'M90 -30 L130 -40 L100 -20', f: 2, ft: .95, s: 5 }, { c: [95, -50, 5], f: 2, s: 0 },
    { p: 'M-120 60 H-60 M-100 80 H-60', s: 4, i: 2 }, { c: [-100, -70, 46], f: 2, ft: .85, s: 8 }, { p: 'M-100 -116 V-24 M-146 -70 H-54', s: 3 },
  ]);
  A('lebron', 'LEBRON JAMES', /\b(lebron james|lebron|king james|el elegido)\b/i, [
    { p: 'M-90 30 L-100 -70 L-50 -30 L0 -110 L50 -30 L100 -70 L90 30 Z', f: 2, ft: .95, s: 10, m: 'pulse', a: .02, o: [0, 30] }, { p: 'M-90 30 H90 V60 H-90 Z', f: 1, ft: .9, s: 9 }, ...[-50, 0, 50].map(x => ({ c: [x, 45, 8], f: -1, s: 5 })), ...[[-100, -70], [0, -110], [100, -70]].map(([x, y]) => ({ c: [x, y, 10], f: -1, s: 6 })), ...ball(0, 130, 40),
  ]);
  A('muhammad_ali', 'MUHAMMAD ALI', /\b(muhammad ali|mohamed ali|cassius clay|the greatest ali|float like a butterfly|rumble in the jungle)\b/i, [
    glove(-70, 20, 1.1, 1), glove(80, -30, 1, 1), { p: 'M-30 -90 C-50 -130 -10 -150 10 -130 C40 -160 80 -130 60 -100 Z', f: -1, s: 0, m: 'flap', o: [10, -110], v: 1.5 }, { p: 'M-60 -110 C-90 -170 -30 -180 -20 -120 M40 -110 C70 -170 110 -160 90 -110', f: 2, ft: .85, s: 7, m: 'flap', o: [10, -110], v: 1.5 },
    { p: 'M-190 170 H190', s: 8 }, { p: 'M-160 130 L-130 110 M150 100 L180 80', s: 4, m: 'pulse', a: .3, v: 3, o: [0, 100] },
  ]);
  A('usain_bolt', 'USAIN BOLT', /\b(usain bolt|lightning bolt|rel[aá]mpago bolt|el hombre m[aá]s r[aá]pido|fastest man)\b/i, [
    { p: 'M60 -190 L-40 -10 H10 L-50 100 L80 -40 H30 L90 -190 Z', f: 2, ft: .95, s: 9, m: 'beat', a: .05, o: [20, 0] }, { p: 'M-190 60 H-90 M-190 100 H-110 M-190 20 H-100', s: 5, i: 3, m: 'drift', a: 14 }, { p: 'M-190 175 H190', s: 8 }, { p: 'M40 160 L70 120 L100 160', s: 6 },
    { p: 'M110 -60 L150 -90 M120 -20 L170 -30', s: 4, m: 'pulse', a: .3, v: 4, o: [110, -40] },
  ]);
  A('serena_williams', 'SERENA WILLIAMS', /\b(serena williams|venus williams|serena|wimbledon|grand slam)\b/i, [
    { e: [0, -50, 60, 80], f: -1, s: 10 }, ...[-30, -10, 10, 30].map(x => ({ p: `M${x} -115 V15`, s: 2 })), ...[-70, -40, -10, 20].map(y => ({ p: `M-55 ${y} H55`, s: 2 })), { p: 'M0 30 V150', s: 12 }, { p: 'M-14 150 H14 V175 H-14 Z', f: 1, ft: .9, s: 6 },
    { c: [110, -90, 22], f: 2, ft: .95, s: 7, m: 'bob', a: 12 }, { p: 'M95 -105 C105 -95 115 -95 125 -105', s: 3 },
  ]);
  A('tiger_woods', 'TIGER WOODS', /\b(tiger woods|masters augusta|golf legend)\b/i, [
    { p: 'M-100 150 L60 -110', s: 8 }, { p: 'M60 -110 L90 -100 L90 -70 L50 -80 Z', f: 1, ft: .9, s: 7 }, { c: [90, 100, 22], f: -1, s: 8 }, ...[[80, 92], [98, 100], [86, 112], [104, 88]].map(([x, y]) => ({ c: [x, y, 2], f: 1, s: 0 })), { p: 'M20 130 L60 100 M50 120 L20 60', s: 0 },
    { p: 'M-190 150 C-100 135 60 135 190 150 V175 H-190 Z', f: 1, ft: .6, s: 7 }, { p: 'M130 60 V150 M130 60 L170 75 L130 90', f: 2, ft: .95, s: 6, m: 'sway', a: .05, o: [130, 60] },
  ]);
  A('roberto_clemente', 'ROBERTO CLEMENTE', /\b(roberto clemente|el gran 21|pittsburgh pirates)\b/i, [
    glove(-20, 0, 1.4, 3), { c: [70, 50, 30], f: -1, s: 8 }, { p: 'M55 30 C65 45 65 60 55 72 M85 30 C75 45 75 60 85 72', s: 3, i: 2 }, { p: L.star(130, -120, 22, 5, .45), f: 2, ft: .95, s: 6, m: 'pulse', a: .1, o: [130, -120] }, { p: 'M-190 175 H190', s: 8 },
  ]);
  A('alexis_arguello', 'ALEXIS ARGÜELLO', /\b(alexis arg[uü]ello|arg[uü]ello|el flaco explosivo|flaco explosivo)\b/i, [
    glove(-60, 0, 1.3, 2), glove(90, 40, 1, 2), { p: 'M-190 165 H190', s: 8 }, { p: 'M-40 -110 L-20 -150 L0 -110 L20 -150 L40 -110 V-90 H-40 Z', f: 1, ft: .95, s: 8 }, { p: 'M110 -60 L150 -90 M120 -30 L170 -40', s: 4, m: 'pulse', a: .3, v: 4, o: [110, -40] },
  ]);

  // ---------- artes, letras y ciencia ----------
  A('einstein', 'EINSTEIN', /\b(albert einstein|einstein|e ?= ?mc|relatividad|relativity)\b/i, [
    { p: 'M-90 0 C-130 -60 -100 -110 -60 -100 C-70 -150 -10 -160 0 -130 C20 -160 80 -150 70 -100 C110 -110 140 -60 90 0 Z', f: -1, s: 9, m: 'sway', a: .02, o: [0, 40] }, { p: 'M-60 10 C-30 40 30 40 60 10', f: 3, ft: .6, s: 6 }, { c: [-30, -20, 6], f: 1, s: 0 }, { c: [30, -20, 6], f: 1, s: 0 },
    { p: 'M-70 60 H70 M-40 100 L-10 60 L20 100 L50 60 M-60 140 H60', s: 5, i: 2, m: 'drift', a: 3 }, { p: 'M-30 25 C0 15 30 25 40 30', s: 5 },
  ]);
  A('frida_kahlo', 'FRIDA KAHLO', /\b(frida kahlo|frida|kahlo|las dos fridas|casa azul)\b/i, [
    { p: 'M-90 -40 C-60 -75 -20 -55 0 -40 C20 -55 60 -75 90 -40', s: 14 }, ...Array.from({ length: 7 }, (_, i) => { const a = -Math.PI * .9 + i * Math.PI * .8 / 6; return { e: [Math.cos(a) * 100, -70 + Math.sin(a) * 70, 22, 14, a], f: [1, 2, 3][i % 3], ft: .9, s: 6 }; }), { p: 'M-60 60 C-40 40 40 40 60 60 V150 H-60 Z', f: 2, ft: .7, s: 9 },
    { c: [0, -60, 0], s: 0 }, { p: L.heart(0, 100, 2.5), f: 1, ft: .9, s: 5, m: 'pulse', a: .1, o: [0, 100], v: 2 },
  ]);
  A('picasso', 'PICASSO', /\b(pablo picasso|picasso|guernica|cubismo|cubism)\b/i, [
    { p: 'M-90 -120 L20 -150 L90 -60 L60 60 L-30 130 L-100 40 Z', f: 3, ft: .5, s: 9 }, { p: 'M-20 -150 L-30 130 M-90 -120 L90 -60', s: 3 }, { p: 'M-50 -40 L-10 -60 L-20 -20 Z', f: -1, s: 6 }, { c: [40, -20, 18], f: -1, s: 6 }, { c: [-30, -35, 5], f: 1, s: 0 }, { c: [40, -20, 5], f: 1, s: 0 },
    { p: 'M-10 10 L20 40 L-20 60', f: 2, ft: .9, s: 6 }, { p: 'M-40 90 C-10 110 30 100 50 70', s: 6 },
  ]);
  A('van_gogh', 'VAN GOGH', /\b(van gogh|vincent van gogh|noche estrellada|starry night|los girasoles)\b/i, [
    { c: [90, -110, 30], f: 2, ft: .95, s: 8, m: 'pulse', a: .05, o: [90, -110] }, { p: 'M-190 -80 C-140 -120 -100 -60 -50 -100 C0 -140 40 -60 90 -60 C130 -60 160 -40 190 -70', s: 8, m: 'drift', a: 8 }, { p: 'M-190 -20 C-140 -60 -100 0 -50 -40 C0 -80 40 0 90 0', s: 8, i: 2, m: 'drift', a: -8 },
    { p: 'M-190 60 L-130 20 L-70 60 L-10 20 L50 60 L110 20 L190 60 V170 H-190 Z', f: 1, ft: .8, s: 8 }, { p: 'M-100 170 V-20 C-120 -40 -100 -110 -90 -150 C-80 -110 -60 -40 -80 -20 V170', f: 1, ft: .95, s: 6 }, ...[[-150, -140], [-40, -150], [40, -120]].map(([x, y], i) => ({ p: L.star(x, y, 12, 8, .5), f: 2, ft: .9, s: 4, m: 'spin', a: .8, o: [x, y], ph: i })),
  ]);
  A('dali', 'DALÍ', /\b(salvador dal[ií]|dal[ií]|relojes derretidos|melting clocks|persistence of memory|surrealismo|surrealism)\b/i, [
    { p: 'M-100 -20 C-100 -80 100 -80 100 -20 C100 20 60 30 40 60 C10 100 -10 100 -40 60 C-60 30 -100 20 -100 -20 Z', f: 2, ft: .8, s: 9, m: 'sway', a: .015, o: [0, -60] }, { p: 'M-30 -20 C-15 -35 15 -35 30 -20 M-30 -20 C-20 0 20 0 30 -20', s: 5 }, { p: 'M-110 60 C-130 110 -120 150 -80 150 C-70 120 -80 90 -90 70 Z', f: 3, ft: .7, s: 7 }, { c: [-100, 100, 0], s: 0 },
    { p: 'M-120 -90 C-160 -110 -190 -100 -200 -85 M120 -90 C160 -110 190 -100 200 -85', s: 6, i: 1 }, { p: 'M-10 -60 C-10 -100 10 -100 10 -60', s: 5 },
  ]);
  A('da_vinci', 'LEONARDO DA VINCI', /\b(leonardo da vinci|da vinci|hombre de vitruvio|vitruvian man|mona lisa|la gioconda)\b/i, [
    { c: [0, 0, 150], s: 6 }, { p: L.rect(-110, -110, 220, 220), s: 6 }, { c: [0, -80, 20], f: -1, s: 7 }, { p: 'M0 -60 V40 M-110 -20 H110 M0 40 L-40 130 M0 40 L40 130 M0 -20 L-90 -60 M0 -20 L90 -60 M0 40 L-70 100 M0 40 L70 100', s: 8 },
  ]);
  A('mozart', 'MOZART', /\b(mozart|wolfgang amadeus|eine kleine nachtmusik|requiem mozart|amadeus)\b/i, [
    { p: 'M-70 -20 C-110 -60 -100 -120 -50 -130 C-40 -170 40 -170 50 -130 C100 -120 110 -60 70 -20 C50 -40 -50 -40 -70 -20 Z', f: -1, s: 9 }, { p: 'M-90 0 C-130 20 -110 70 -80 60 M90 0 C130 20 110 70 80 60', f: -1, s: 8 }, { c: [-55, 45, 0], s: 0 }, { p: 'M-40 -10 H-15 M15 -10 H40', s: 6 },
    { p: 'M-60 90 H60 V150 H-60 Z', f: 2, ft: .8, s: 8 }, { p: 'M-30 90 V150 M0 90 V150 M30 90 V150', s: 3 }, { p: 'M90 150 V60 L130 50 V140', s: 5, i: 3, m: 'bob', a: 4 }, { c: [80, 150, 12], f: 1, s: 6 },
  ]);
  A('beethoven', 'BEETHOVEN', /\b(beethoven|ludwig van|para elisa|f[uú]r elise|novena sinfon[ií]a|ninth symphony|oda a la alegr[ií]a)\b/i, [
    { p: 'M-90 30 C-140 -20 -120 -130 -40 -140 C-30 -190 50 -190 60 -140 C140 -130 150 -30 90 30 C60 0 -60 0 -90 30 Z', f: 1, ft: .9, s: 9, m: 'sway', a: .02, o: [0, 40] }, { p: 'M-40 -20 L-10 -30 M20 -30 L50 -20', s: 7 }, { p: 'M-30 20 C-10 30 10 30 30 20', s: 5 },
    { p: L.rect(-100, 80, 200, 90), f: -1, s: 8 }, { p: 'M-80 105 H80 M-80 125 H80 M-80 145 H80', s: 2 }, { c: [-30, 115, 7], f: 1, s: 0 }, { c: [30, 135, 7], f: 1, s: 0 },
  ]);
  A('shakespeare', 'SHAKESPEARE', /\b(shakespeare|william shakespeare|romeo y julieta|romeo and juliet|hamlet|ser o no ser|to be or not to be|macbeth)\b/i, [
    { p: 'M-60 -60 C-60 -120 60 -120 60 -60 V10 C60 40 30 50 30 80 H-30 C-30 50 -60 40 -60 10 Z', f: -1, s: 10 }, { c: [-25, -35, 16], f: 1, s: 0 }, { c: [25, -35, 16], f: 1, s: 0 }, { p: 'M-8 5 L0 -10 L8 5 Z', f: 1, s: 0 }, { p: 'M-30 50 V80 M-10 50 V80 M10 50 V80 M30 50 V80', s: 4 },
    { p: 'M100 150 C130 60 170 -20 180 -90 C160 -60 130 -20 110 50 Z', f: 2, ft: .85, s: 7, m: 'sway', a: .03, o: [100, 150] }, { p: 'M-190 170 H190', s: 8 },
  ]);
  A('garcia_marquez', 'GARCÍA MÁRQUEZ', /\b(garc[ií]a m[aá]rquez|gabriel garc[ií]a|gabo|cien a[nñ]os de soledad|macondo|realismo m[aá]gico)\b/i, [
    ...[[-120, -60, 1], [-40, -110, .8], [60, -70, 1.1], [130, -30, .8], [-70, 20, .7], [20, 40, .9], [110, 90, .7], [-120, 90, .9]].map(([x, y, k], i) => [{ p: `M${x} ${y} C${x - 60 * k} ${y - 50 * k} ${x - 70 * k} ${y + 10 * k} ${x} ${y + 10 * k} C${x + 70 * k} ${y + 10 * k} ${x + 60 * k} ${y - 50 * k} ${x} ${y} Z`, f: 2, ft: .95, s: 6, m: 'flap', o: [x, y], v: 1 + i * .15 }, { p: `M${x} ${y - 10} V${y + 30 * k}`, s: 4 }]).flat(), { p: 'M-190 175 H190', s: 6 },
  ]);
  A('neruda', 'NERUDA', /\b(pablo neruda|neruda|veinte poemas de amor|puedo escribir los versos|isla negra)\b/i, [
    { p: 'M-170 40 H170 L120 120 H-120 Z', f: 1, ft: .85, s: 9 }, { p: 'M0 40 V-150', s: 8 }, { p: 'M0 -150 C40 -130 80 -100 90 -40 C60 -60 30 -50 0 -50 Z', f: -1, s: 8, m: 'sway', a: .03, o: [0, 40] }, { p: 'M0 -110 C-40 -90 -70 -60 -80 -10 C-50 -30 -20 -20 0 -20 Z', f: -1, s: 8, m: 'sway', a: .03, o: [0, 40] },
    { p: 'M-190 130 C-120 110 -60 140 0 130 C60 120 120 140 190 125 V175 H-190 Z', f: 3, ft: .5, s: 6, m: 'drift', a: 8 }, { p: L.heart(-130, -100, 2), f: 2, ft: .9, s: 5, m: 'bob', a: 6 },
  ]);
  A('borges', 'BORGES', /\b(jorge luis borges|borges|el aleph|ficciones|laberinto de borges|la biblioteca de babel)\b/i, [
    { p: 'M-140 -140 H140 V140 H-140 Z', s: 8 }, { p: 'M-100 -100 H100 V100 H-100 Z', s: 7 }, { p: 'M-60 -60 H60 V60 H-60 Z', s: 6 }, { p: 'M-20 -20 H20 V20 H-20 Z', s: 5 }, { p: 'M-140 -140 V-100 M100 -100 V-60 M-100 100 V60 M60 60 V20 M-140 140 H-100', s: 8, i: 2 },
    { p: 'M-20 0 C0 -60 40 -60 30 -10 C40 -30 70 -10 60 20 L20 40 Z', f: 2, ft: .85, s: 6, m: 'pulse', a: .05, o: [20, 0] }, { p: 'M30 -10 L50 -20 M40 10 L60 10', s: 4 },
  ]);
  A('cervantes', 'CERVANTES', /\b(miguel de cervantes|cervantes|don quijote|quijote|sancho panza|dulcinea|el quijote)\b/i, [
    { p: 'M-50 170 L-30 -20 H30 L50 170 Z', f: -1, s: 9 }, { p: 'M-40 -20 L0 -60 L40 -20', f: 2, ft: .8, s: 8 }, { p: 'M0 -20 L-110 -110 M0 -20 L110 30 M0 -20 L-70 60 M0 -20 L60 -110', f: 3, ft: .6, s: 8, m: 'spin', a: .5, o: [0, -20] }, { p: 'M-190 90 L-90 60', s: 10, m: 'sway', a: .03, o: [-190, 90] }, { p: 'M-90 60 L-70 50 L-70 70 Z', f: 1, s: 5 },
    { p: 'M-190 175 H190', s: 8 }, { p: 'M100 175 V130 M90 130 H110', s: 6 },
  ]);
  A('ruben_dario', 'RUBÉN DARÍO', /\b(rub[eé]n dar[ií]o|azul dar[ií]o|sonatina|margarita est[aá] linda|felix rub[eé]n garc[ií]a sarmiento|poeta de nicaragua)\b/i, [
    { p: 'M-110 40 C-80 120 90 120 120 30 C90 40 60 30 20 20 C-40 0 -90 20 -110 40 Z', f: -1, s: 9 }, { p: 'M-60 25 C-140 -20 -100 -120 -50 -120 C-10 -120 -10 -70 -40 -70', s: 12, m: 'sway', a: .02, o: [-60, 25] }, { c: [-45, -122, 18], f: -1, s: 8 }, { p: 'M-62 -125 L-95 -118 L-62 -110 Z', f: 2, ft: .95, s: 5 }, { c: [-48, -128, 4], f: 1, s: 0 },
    { p: 'M-190 145 C-120 125 -60 155 0 145 C60 135 120 155 190 140 V175 H-190 Z', f: 3, ft: .6, s: 6, m: 'drift', a: 6 }, { p: L.star(110, -110, 22, 5, .45), f: 2, ft: .95, s: 5, m: 'pulse', a: .1, o: [110, -110] }, { p: 'M20 -30 H120 M20 -10 H100 M20 10 H110', s: 3, i: 3 },
  ]);
  A('chaplin', 'CHAPLIN', /\b(charlie chaplin|chaplin|charlot|tiempos modernos|modern times|the kid chaplin|cine mudo|silent film)\b/i, [
    { p: 'M-70 -30 C-70 -100 70 -100 70 -30 Z', f: 1, ft: .95, s: 10 }, { p: 'M-90 -30 H90', s: 10 }, { p: 'M-20 20 H20 V35 H-20 Z', f: 1, ft: .95, s: 7 }, { c: [-20, -5, 5], f: 1, s: 0 }, { c: [20, -5, 5], f: 1, s: 0 },
    { p: 'M40 60 C80 40 110 80 90 120 L70 150', s: 9 }, { p: 'M40 60 L20 30', s: 0 }, { p: 'M-120 170 C-100 140 -60 140 -40 170 M40 170 C60 140 100 140 120 170', f: 1, ft: .9, s: 8 }, { p: 'M-190 178 H190', s: 6 },
  ]);
  A('marilyn', 'MARILYN MONROE', /\b(marilyn monroe|marilyn|los caballeros las prefieren rubias|happy birthday mr president)\b/i, [
    { p: 'M-60 0 C-90 20 -110 60 -120 120 C-80 100 -60 60 -40 20 Z', f: -1, s: 8, m: 'sway', a: .05, o: [-40, 20] }, { p: 'M60 0 C90 20 110 60 120 120 C80 100 60 60 40 20 Z', f: -1, s: 8, m: 'sway', a: -.05, o: [40, 20] }, { p: 'M-40 20 H40 L20 90 H-20 Z', f: -1, s: 8 }, { p: 'M-40 -20 H40 M-40 -50 C-20 -80 20 -80 40 -50 V-20 H-40 Z', f: 2, ft: .5, s: 8 },
    { c: [-14, -60, 4], f: 1, s: 0 }, { c: [14, -60, 4], f: 1, s: 0 }, { c: [22, -38, 3], f: 1, s: 0 }, { p: 'M-190 175 H190', s: 6 }, { p: 'M-30 130 V175 M30 130 V175', s: 6 },
  ]);
  A('audrey_hepburn', 'AUDREY HEPBURN', /\b(audrey hepburn|hepburn|desayuno con diamantes|breakfast at tiffany|moon river)\b/i, [
    { p: 'M-60 60 C-60 -30 -40 -60 0 -60 C40 -60 60 -30 60 60', s: 10 }, ...Array.from({ length: 9 }, (_, i) => ({ c: [-60 + i * 15, 60 + Math.sin(i / 8 * Math.PI) * 30, 9], f: -1, s: 5 })), { p: 'M-70 -20 L-110 -10 L-70 10 M70 -20 L110 -10 L70 10 M-70 -10 H70', f: 1, ft: .95, s: 8 },
    { p: L.rr(-30, -100, 60, 30, 12), f: 1, ft: .95, s: 8 }, { p: 'M-110 130 H110', s: 8 }, { p: 'M0 120 V170 M-20 150 H20', s: 6 },
  ]);
  A('tesla_nikola', 'NIKOLA TESLA', /\b(nikola tesla|tesla coil|bobina tesla|corriente alterna|alternating current)\b/i, [
    { p: 'M-40 170 V40 C-40 -40 40 -40 40 40 V170 Z', f: 3, ft: .6, s: 9 }, ...[0, 1, 2, 3].map(i => ({ p: `M-40 ${60 + i * 25} H40`, s: 4 })), { c: [0, -30, 46], f: 3, ft: .7, s: 9 }, { p: 'M0 -70 L-40 -130 L-10 -120 L-70 -190 M0 -70 L50 -120 L30 -125 L90 -170 M20 -55 L120 -80 L100 -60 L170 -70', s: 5, i: 2, m: 'pulse', a: .1, v: 6, o: [0, -30] },
    { p: 'M-190 175 H190', s: 8 },
  ]);
  A('darwin', 'DARWIN', /\b(charles darwin|darwin|el origen de las especies|origin of species|evoluci[oó]n|evolution|teor[ií]a de la evoluci[oó]n)\b/i, [
    { p: 'M-120 40 C-120 -30 120 -30 120 40 C120 90 60 110 0 110 C-60 110 -120 90 -120 40 Z', f: 1, ft: .8, s: 10 }, { p: 'M-40 -20 L-50 60 M0 -30 V70 M40 -20 L50 60 M-90 20 H90', s: 4 }, { c: [-140, 60, 28], f: 1, ft: .9, s: 8 }, { p: 'M-165 55 L-190 60', s: 6 }, { p: 'M-70 110 V140 M70 110 V140', s: 10 },
    { p: 'M110 -60 C130 -90 170 -90 180 -60', s: 8, m: 'sway', a: .03, o: [110, -60] }, { p: 'M-190 165 H190', s: 8 }, { c: [150, -20, 10], f: 2, ft: .9, s: 5 },
  ]);
  A('marie_curie', 'MARIE CURIE', /\b(marie curie|madame curie|curie|radio y polonio|radium|polonium|radiactividad|radioactivity)\b/i, [
    { p: 'M-30 -120 H30 V-40 L100 100 C110 130 90 150 60 150 H-60 C-90 150 -110 130 -100 100 L-30 -40 Z', f: -1, s: 10 }, { p: 'M-70 60 C-30 40 30 80 70 60 L100 110 C110 130 90 150 60 150 H-60 C-90 150 -110 130 -100 110 Z', f: 2, ft: .9, s: 0, m: 'drift', a: 3 },
    { c: [-20, 90, 8], f: -1, s: 4, m: 'steam', a: 80 }, { c: [20, 100, 6], f: -1, s: 4, m: 'steam', a: 90, ph: .4 }, { p: 'M-40 -120 H40', s: 8 }, { p: 'M-130 -50 L-100 -70 M130 -50 L100 -70 M0 -170 V-140', s: 5, m: 'pulse', a: .3, v: 3, o: [0, -80] },
  ]);
  A('newton', 'NEWTON', /\b(isaac newton|newton|ley de la gravedad|law of gravity|gravitaci[oó]n universal|principia)\b/i, [
    { p: 'M0 170 C0 100 0 40 0 -20', s: 9 }, { p: 'M0 40 C-60 30 -90 -10 -80 -30 C-30 -20 -10 10 0 40 Z M0 10 C50 0 80 -40 70 -60 C30 -50 10 -20 0 10 Z', f: 1, ft: .8, s: 6 }, { p: 'M-190 175 H190', s: 8 },
    { p: 'M-30 -120 C-50 -150 -20 -180 10 -170 C60 -190 100 -140 70 -110 C90 -80 40 -60 20 -80 C-10 -60 -50 -90 -30 -120 Z', f: 1, ft: .7, s: 7 }, { c: [110, -60, 24], f: 1, ft: .9, s: 8, m: 'fall', a: 130 }, { p: 'M110 -90 V-80', s: 5, m: 'fall', a: 130 },
  ]);
  A('hawking', 'HAWKING', /\b(stephen hawking|hawking|agujero negro|black hole|breve historia del tiempo|brief history of time|radiaci[oó]n de hawking)\b/i, [
    { c: [0, 0, 70], f: 1, ft: .95, s: 10 }, { e: [0, 0, 170, 40, -.3], s: 12, i: 2, m: 'beat', a: .02, o: [0, 0] }, { e: [0, 0, 130, 28, -.3], s: 6, i: 3 }, { p: 'M-190 -120 C-140 -100 -110 -60 -80 -30 M190 120 C140 100 110 60 80 30', s: 4, i: 3 }, ...[[-150, 100], [140, -110], [-60, -150], [60, 150]].map(([x, y], i) => ({ p: L.star(x, y, 9, 4, .4), f: 2, s: 3, m: 'pulse', a: .5, o: [x, y], ph: i })),
  ]);
  A('bruce_lee', 'BRUCE LEE', /\b(bruce lee|bruce li|enter the dragon|kung fu|kungfu|jeet kune do|artes marciales|martial arts)\b/i, [
    { p: 'M-140 -20 L-60 -20 M-60 -20 L-30 40 L60 40', s: 0 }, { p: 'M-150 -80 L-60 -60 M-150 -110 L-70 -80 M-150 -50 L-70 -40', s: 8, i: 2, m: 'pulse', a: .05, v: 2, o: [-60, -60] }, { p: 'M-30 30 C-50 60 -30 140 30 140 C90 140 110 80 70 40 Z', f: -1, s: 0 },
    { p: 'M-190 -30 L-100 -30 L-80 -10 M-190 20 H-110 L-90 0 M-190 -80 H-110', s: 0 }, { p: 'M-60 160 L-20 60 L60 30 L110 -20', s: 10 }, { c: [130, -40, 22], f: 1, ft: .95, s: 8 }, { p: 'M20 -20 L60 -40 M40 10 L100 20', s: 5, m: 'pulse', a: .3, v: 3, o: [40, 0] }, { p: 'M-190 175 H190', s: 8 },
  ]);
})();
