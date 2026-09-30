// ============================================================
// riso-props-naturaleza.js — naturaleza y cielo (oleada 3 del catálogo). Ver riso-props-lib.js.
// ============================================================
(() => {
  const R = window.RISO; if (!R || !R.lib) return;
  const { add, L } = R.lib, C = 'naturaleza';
  const A = (id, label, rx, shapes, opt) => add(id, C, label, rx, shapes, opt);
  const gnd = { p: 'M-190 170 H190', s: 8 };

  A('arbol', 'ÁRBOL', /\b([aá]rbol(es)?|trees?|rama|ramas|branch(es)?|roble|oak|tronco|trunk|sombra del [aá]rbol)\b/i, [
    { p: 'M-20 170 C-20 100 -10 60 -30 20 M20 170 C20 100 10 60 30 20 M-30 20 H30', f: 3, ft: .6, s: 10 }, { p: 'M-20 170 V20 H20 V170 Z', f: 3, ft: .7, s: 9 },
    { p: 'M-90 30 C-160 30 -170 -60 -110 -80 C-130 -150 -30 -190 0 -150 C30 -190 130 -150 110 -80 C170 -60 160 30 90 30 Z', f: 1, ft: .8, s: 10, m: 'sway', a: .015, o: [0, 30] }, { p: 'M-60 -40 C-40 -60 -20 -50 0 -70 M20 -20 C40 -40 60 -30 70 -50', s: 4 }, gnd,
  ], { moods: ['sereno', 'nostalgico'] });
  A('hoja', 'HOJA', /\b(hojas?|leaf|leaves|oto[nñ]o|autumn|hojarasca)\b/i, [
    { p: 'M-100 120 C-140 20 -60 -100 100 -120 C120 20 40 120 -100 120 Z', f: 2, ft: .85, s: 10, m: 'sway', a: .05, o: [-100, 120] }, { p: 'M-100 120 C-40 60 20 0 80 -90 M-40 60 L-40 20 M0 20 L20 40 M20 -30 L50 -20 M-10 30 L-30 70', s: 6, m: 'sway', a: .05, o: [-100, 120] },
    { p: 'M120 -150 C130 -130 110 -120 120 -100', f: 1, ft: .8, s: 4, m: 'fall', a: 90 }, { p: 'M-140 -140 C-130 -120 -150 -110 -140 -90', f: 1, ft: .8, s: 4, m: 'fall', a: 100, ph: .5 },
  ], { moods: ['melancolico', 'nostalgico'] });
  A('volcan', 'VOLCÁN', /\b(volc[aá]n(es)?|volcano(es)?|lava|erupci[oó]n|eruption|magma|cr[aá]ter|crater)\b/i, [
    { p: 'M-190 170 L-50 -50 H50 L190 170 Z', f: 3, ft: .65, s: 10 }, { p: 'M-50 -50 C-20 -30 20 -30 50 -50', s: 6 }, { p: 'M-20 -40 C-30 20 -10 60 -40 110 M10 -35 C20 30 0 70 30 120', s: 7, i: 2 },
    { p: 'M-30 -60 C-60 -120 0 -130 -10 -190 M20 -60 C50 -110 10 -140 40 -190', f: 3, ft: .35, s: 6, m: 'steam', a: 30 }, { c: [-60, -100, 8], f: 1, s: 0, m: 'fall', a: -50 }, { c: [70, -110, 7], f: 1, s: 0, m: 'steam', a: 40, ph: .5 },
  ], { moods: ['rabioso', 'desafiante'] });
  A('rio', 'RÍO', /\b(r[ií]os?|rivers?|arroyo|stream|creek|corriente|current|torrente|caudal)\b/i, [
    { p: 'M-190 -150 H-60 C-30 -100 60 -60 40 -10 C20 40 -30 60 60 110 C90 130 120 150 130 170 H10 C0 140 -30 120 -70 90 C-130 50 -60 0 -80 -30 C-90 -60 -190 -60 -190 -150 Z', f: 3, ft: .35, s: 8 },
    { p: 'M-50 -80 C-30 -50 20 -30 10 10 M0 60 C10 80 30 100 50 130', s: 4, m: 'drift', a: 6 }, { p: 'M-190 -130 L-150 -160 M150 -130 L190 -160 M150 20 H190', s: 0 }, { p: 'M140 -60 L160 -90 L180 -60 Z M150 -60 V-40', f: 1, ft: .8, s: 5 },
  ], { moods: ['sereno'] });
  A('cactus', 'CACTUS', /\b(cactus|cacto|cactos|nopal|saguaro|desierto florido|tumbleweed)\b/i, [
    { p: L.rr(-30, -150, 60, 320, 30), f: 1, ft: .8, s: 10 }, { p: 'M-30 20 H-80 C-100 20 -100 -60 -80 -60 M30 -10 H80 C100 -10 100 -90 80 -90', s: 12, i: 1 }, { p: 'M-80 20 H-30 M30 -10 H80', f: 1, ft: .8, s: 0 },
    { p: 'M0 -140 V160 M-15 -100 V140 M15 -100 V140', s: 3 }, { p: 'M-30 -60 H-45 M30 40 H45 M-30 90 H-45', s: 4 }, { p: 'M0 -150 L10 -175 L0 -190 L-10 -175 Z', f: 2, ft: .95, s: 4 }, gnd,
  ], { moods: ['sereno', 'oscuro'] });
  A('nube', 'NUBE', /\b(nubes?|clouds?|nublado|cloudy|nubarr[oó]n|overcast|cielo gris|grey sky)\b/i, [
    { p: L.cloud(0, 0, 1.4), f: -1, s: 10, m: 'drift', a: 10 }, { p: L.cloud(70, 80, .8), f: 3, ft: .4, s: 7, m: 'drift', a: -8, ph: 1 }, { p: 'M-60 40 C-40 50 -20 45 0 50', s: 4 },
  ], { moods: ['sereno', 'melancolico'] });
  A('arcoiris', 'ARCOÍRIS', /\b(arco.?[ií]ris|rainbows?)\b/i, [
    ...[[170, 1], [140, 2], [110, 3], [80, -1]].map(([r, i]) => ({ p: L.arc(0, 130, r, Math.PI, Math.PI * 2), s: 22, i: i === -1 ? 1 : i, m: 'beat', a: .01, o: [0, 130] })), { p: L.cloud(-150, 130, .5), f: -1, s: 7 }, { p: L.cloud(150, 130, .5), f: -1, s: 7 },
  ], { moods: ['feliz', 'euforico', 'sereno'] });
  A('tornado', 'TORNADO', /\b(tornados?|tornadoes|hurac[aá]n|hurricanes?|cicl[oó]n(es)?|cyclones?|tif[oó]n(es)?|typhoons?|remolino|whirlwind|twister)\b/i, [
    { p: 'M-160 -140 H160 L100 -80 H-100 Z', f: 3, ft: .5, s: 9 }, { p: 'M-100 -80 L80 -30 L-60 10 L50 50 L-30 90 L10 170 L20 170', s: 10, m: 'sway', a: .03, o: [0, 170] }, { p: 'M-120 -110 C-60 -90 60 -90 130 -110 M-80 -50 C-20 -30 40 -30 70 -50 M-40 10 C0 25 30 25 40 10', s: 5, m: 'drift', a: 8 },
    { p: 'M120 20 L150 10 M-140 60 L-110 50 M100 100 L130 90', s: 4, m: 'drift', a: 20 },
  ], { moods: ['rabioso', 'oscuro'] });
  A('ola', 'OLA', /\b(olas?|waves|tsunami|surf\w*|marejada|oleaje|swell)\b/i, [
    { p: 'M-190 170 C-190 60 -100 -40 -20 -60 C60 -80 130 -40 120 20 C110 60 60 50 60 20 C60 0 80 -10 90 0 C80 -40 20 -30 0 10 C-20 60 -40 120 -20 170 Z', f: 3, ft: .65, s: 10 },
    { p: 'M-30 -60 C-10 -90 60 -110 90 -60 M-140 40 C-100 10 -60 30 -50 70', s: 5 }, { p: 'M-190 170 C-120 150 -60 180 0 170 C60 160 120 180 190 165 V190 H-190 Z', f: 1, ft: .7, s: 7, m: 'drift', a: 8 },
    { c: [130, -80, 6], s: 3, m: 'fall', a: 60 }, { c: [150, -50, 5], s: 3, m: 'fall', a: 70, ph: .4 },
  ], { moods: ['euforico', 'sereno'] });
  A('cueva', 'CUEVA', /\b(cuevas?|caves?|caverna|cavern|gruta|grotto|t[uú]nel|tunnel|cave)\b/i, [
    { p: 'M-190 170 V-20 C-190 -150 -60 -170 0 -170 C60 -170 190 -150 190 -20 V170 Z', f: 3, ft: .7, s: 10 }, { p: 'M-90 170 V60 C-90 -30 90 -30 90 60 V170 Z', f: 1, ft: .95, s: 9 }, { p: 'M-60 -150 L-50 -110 L-40 -150 M20 -160 L30 -100 L40 -160 M70 -150 L80 -115 L90 -150', s: 6 },
    { p: 'M-40 170 L-30 130 L-20 170 M20 170 L35 120 L50 170', s: 5, i: 3 }, { c: [0, 90, 8], f: 2, ft: .95, s: 0, m: 'pulse', a: .4, o: [0, 90], v: 2 },
  ], { moods: ['oscuro'] });
  A('girasol', 'GIRASOL', /\b(girasol(es)?|sunflowers?|margaritas?|daisy|daisies|campo de flores|flower field)\b/i, [
    { p: 'M0 170 V20', s: 10 }, { p: 'M0 120 C-60 110 -80 70 -70 50 C-30 60 -10 90 0 120 Z M0 90 C50 80 70 40 60 20 C30 30 10 60 0 90 Z', f: 1, ft: .8, s: 6 },
    ...Array.from({ length: 9 }, (_, i) => { const a = i / 9 * Math.PI * 2, x = Math.cos(a) * 70, y = -70 + Math.sin(a) * 70; return { e: [x, y, 34, 14, a], f: 2, ft: .9, s: 6 }; }), { c: [0, -70, 44], f: 3, ft: .9, s: 9 }, { c: [0, -70, 24], f: 1, ft: .9, s: 0 },
  ], { moods: ['feliz', 'sereno'] });
  A('roca', 'ROCA', /\b(rocas?|piedras?|pe[nñ]as?|peñasco|boulder|pedregal|cantera|pebbles?)\b/i, [
    { p: 'M-170 150 L-140 30 L-80 -30 L-20 -60 L50 -40 L110 10 L150 90 L170 150 Z', f: 3, ft: .65, s: 10 }, { p: 'M-80 -30 L-60 40 L-20 -60 M-60 40 L10 80 L50 -40 M10 80 L30 150 M-140 30 L-100 100', s: 5 }, { p: 'M-190 150 H190', s: 8 }, { p: 'M110 100 L150 110 L140 150 H100 Z', f: 1, ft: .6, s: 6 },
  ], { moods: ['sereno', 'oscuro'] });
  A('eclipse', 'ECLIPSE', /\b(eclipses?|eclipse solar|solar eclipse|lunar eclipse|eclipse lunar|corona solar)\b/i, [
    { c: [0, 0, 130], f: 1, ft: .95, s: 10 }, ...Array.from({ length: 20 }, (_, i) => { const a = i / 20 * Math.PI * 2; return { p: `M${(Math.cos(a) * 140).toFixed(0)} ${(Math.sin(a) * 140).toFixed(0)} L${(Math.cos(a) * (170 + (i % 3) * 12)).toFixed(0)} ${(Math.sin(a) * (170 + (i % 3) * 12)).toFixed(0)}`, s: 5, i: 2, m: 'pulse', a: .05, o: [0, 0], ph: i }; }),
    { c: [0, 0, 152], s: 3, i: 2 },
  ], { moods: ['oscuro', 'desafiante'] });
  A('aurora', 'AURORA BOREAL', /\b(aurora boreal|northern lights|aurora austral|aurora polar)\b/i, [
    { p: 'M-190 -140 C-120 -60 -80 -180 0 -100 C60 -40 120 -160 190 -80 V40 C120 -40 60 60 0 0 C-80 -80 -120 40 -190 -40 Z', f: 1, ft: .55, s: 8, m: 'drift', a: 10 }, { p: 'M-190 -60 C-120 20 -80 -100 0 -40 C60 20 120 -80 190 0 V80 C120 0 60 100 0 60 C-80 -10 -120 100 -190 40 Z', f: 3, ft: .55, s: 8, m: 'drift', a: -10 },
    { p: 'M-190 170 L-110 60 L-60 110 L0 30 L80 130 L130 80 L190 170 Z', f: 3, ft: .8, s: 9 }, ...[[-140, -170], [80, -180], [150, -140], [-40, -150]].map(([x, y], i) => ({ p: L.star(x, y, 9, 4, .4), f: 2, ft: .9, s: 3, m: 'pulse', a: .5, o: [x, y], ph: i })),
  ], { moods: ['sereno', 'romantico'] });
  A('planeta', 'PLANETA', /\b(planetas?|planets?|saturno|saturn|j[uú]piter|jupiter|marte|mars|venus|neptuno|urano|plut[oó]n|pluto|mercurio|sistema solar|solar system|[oó]rbita|orbit)\b/i, [
    { c: [0, 0, 90], f: 2, ft: .85, s: 10 }, { p: 'M-70 -30 C-20 -50 40 -50 80 -30 M-85 10 C-30 -10 40 -10 85 10', s: 5 }, { e: [0, 0, 170, 40, -.35], s: 8, i: 1, m: 'beat', a: .02, o: [0, 0] }, { c: [-120, -100, 8], f: 3, s: 5, m: 'spin', a: .4, o: [0, 0] }, { p: L.star(120, -130, 12, 4, .4), f: 3, s: 3, m: 'pulse', a: .4, o: [120, -130] },
  ], { moods: ['sereno', 'romantico', 'oscuro'] });
  A('galaxia', 'GALAXIA', /\b(galaxias?|galaxy|galaxies|v[ií]a l[aá]ctea|milky way|nebulosa|nebula|cosmos|universo|universe|espacio exterior|outer space)\b/i, [
    { p: 'M0 0 ' + Array.from({ length: 80 }, (_, i) => { const a = i * .28, r = 6 + i * 2; return `L${(Math.cos(a) * r).toFixed(1)} ${(Math.sin(a) * r * .55).toFixed(1)}`; }).join(' '), s: 12, i: 1, m: 'spin', a: .15, o: [0, 0] },
    { p: 'M0 0 ' + Array.from({ length: 80 }, (_, i) => { const a = i * .28 + Math.PI, r = 6 + i * 2; return `L${(Math.cos(a) * r).toFixed(1)} ${(Math.sin(a) * r * .55).toFixed(1)}`; }).join(' '), s: 12, i: 2, m: 'spin', a: .15, o: [0, 0] }, { c: [0, 0, 24], f: 3, ft: .9, s: 0 },
    ...[[-150, -90], [140, -100], [-120, 100], [160, 90], [40, -110], [-60, 90]].map(([x, y], i) => ({ p: L.star(x, y, 9, 4, .4), f: 2, ft: .9, s: 3, m: 'pulse', a: .5, o: [x, y], ph: i })),
  ], { moods: ['sereno', 'romantico', 'oscuro'] });
  A('viento', 'VIENTO', /\b(viento|vientos|wind|winds|brisa|breeze|ventarr[oó]n|gale|ráfagas?|gust|aire fresco)\b/i, [
    { p: 'M-190 -60 H60 C110 -60 110 -130 60 -120 C40 -115 40 -90 60 -90', s: 8, m: 'drift', a: 14 }, { p: 'M-170 10 H100 C160 10 170 90 110 90 C80 90 80 55 105 55', s: 8, m: 'drift', a: -14 }, { p: 'M-140 80 H-20 C20 80 20 130 -20 130', s: 8, m: 'drift', a: 10, ph: 1 },
    { p: 'M120 -150 C130 -140 120 -130 130 -120', f: 1, ft: .8, s: 4, m: 'drift', a: 30 }, { p: 'M150 40 C160 50 150 60 160 70', f: 1, ft: .8, s: 4, m: 'drift', a: 24, ph: 1 },
  ], { moods: ['sereno', 'melancolico'] });
  A('niebla', 'NIEBLA', /\b(nieblas?|fog|foggy|neblina|mist|misty|bruma|haze|hazy|brumoso|smog)\b/i, [
    ...[-110, -60, -10, 40, 90].map((y, i) => ({ p: `M-190 ${y} C-130 ${y - 30} -70 ${y + 30} 0 ${y} C70 ${y - 30} 130 ${y + 30} 190 ${y}`, s: 12, i: 3, m: 'drift', a: 14 * (i % 2 ? 1 : -1), ph: i })), { p: 'M-60 170 V20 M-70 20 C-70 -40 -30 -60 -60 -100 M-60 20 C-50 -40 -90 -50 -80 -90', s: 6, i: 1 }, { p: 'M90 170 V60 M80 60 C80 10 100 0 90 -30', s: 6, i: 1 },
  ], { moods: ['melancolico', 'oscuro'] });
  A('iceberg', 'ICEBERG', /\b(icebergs?|hielo|ice|glaciar(es)?|glaciers?|banquisa|congelad[oa])\b/i, [
    { p: 'M-190 50 H190', s: 7 }, { p: 'M-60 50 L-40 -50 L-10 -20 L20 -120 L60 -30 L90 50 Z', f: -1, s: 10 }, { p: 'M20 -120 L10 -40 L-10 -20 M20 -120 L40 -50 L60 -30', s: 4 }, { p: 'M-100 50 L-60 170 H110 L90 50 Z', f: 3, ft: .55, s: 9 }, { p: 'M-30 80 L-10 120 M30 90 L40 140', s: 4, i: 1 },
    { p: 'M-190 55 C-120 45 -60 65 0 55 C60 45 120 65 190 55', s: 5, m: 'drift', a: 8 },
  ], { moods: ['sereno', 'triste'] });
  A('atardecer', 'ATARDECER', /\b(atardeceres?|atardecer|sunset|puesta de sol|ocaso|crep[uú]sculo|twilight|dusk|sunsets|golden hour)\b/i, [
    { c: [0, 60, 100], f: 2, ft: .95, s: 9, m: 'pulse', a: .03, o: [0, 60] }, { p: 'M-190 60 H190 V170 H-190 Z', f: 3, ft: .6, s: 8 }, { p: 'M-190 60 H190', s: 9 }, { p: 'M-60 90 H60 M-40 115 H40 M-20 140 H20', s: 6, i: 2 },
    { p: 'M-150 -60 H-70 M50 -100 H140 M-100 -110 H-30', s: 5, i: 3, m: 'drift', a: 12 }, { p: 'M120 20 L140 0 L160 20 M100 -10 L112 -22 L124 -10', s: 5 },
  ], { moods: ['romantico', 'nostalgico', 'sereno'] });
  A('amanecer', 'AMANECER', /\b(amaneceres?|amanecer|sunrise|el alba|dawn|madrugada|daybreak|first light|primera luz)\b/i, [
    { p: 'M-190 90 H190', s: 9 }, { p: 'M-100 90 C-100 20 -50 -20 0 -20 C50 -20 100 20 100 90 Z', f: 2, ft: .95, s: 9, m: 'pulse', a: .03, o: [0, 90] },
    { p: 'M0 -60 V-110 M-90 -30 L-125 -60 M90 -30 L125 -60 M-130 30 L-180 20 M130 30 L180 20', s: 7, m: 'pulse', a: .1, o: [0, 90] }, { p: 'M-190 90 C-100 120 -60 150 0 130 C60 150 100 120 190 90 V170 H-190 Z', f: 3, ft: .5, s: 7 },
  ], { moods: ['feliz', 'sereno', 'euforico'] });
  A('trigo', 'TRIGO', /\b(trigo|wheat|cebada|barley|espigas?|cereal(es)?|cereal fields?|campo de trigo|cosecha|harvest|spikelet)\b/i, [
    ...[-70, 0, 70].flatMap((x, i) => [{ p: `M${x} 170 C${x + 5} 100 ${x - 5} 40 ${x} -60`, s: 6, m: 'sway', a: .03, o: [x, 170], ph: i }, ...[0, 1, 2].flatMap(k => [{ p: `M${x} ${-60 + k * 22} C${x - 30} ${-80 + k * 22} ${x - 30} ${-100 + k * 22} ${x - 8} ${-100 + k * 22}`, f: 2, ft: .85, s: 4, m: 'sway', a: .03, o: [x, 170], ph: i }, { p: `M${x} ${-60 + k * 22} C${x + 30} ${-80 + k * 22} ${x + 30} ${-100 + k * 22} ${x + 8} ${-100 + k * 22}`, f: 2, ft: .85, s: 4, m: 'sway', a: .03, o: [x, 170], ph: i }])]), gnd,
  ], { moods: ['nostalgico', 'sereno'] });
  A('pino', 'PINO', /\b(pinos?|pines?|abeto|fir|conífera|conifer|navidad campestre|christmas tree|arbolito de navidad|spruce|cedro|cedar)\b/i, [
    { p: 'M0 -170 L-50 -90 H-25 L-80 -10 H-40 L-110 80 H-15 V150 H15 V80 H110 L40 -10 H80 L25 -90 H50 Z', f: 1, ft: .8, s: 9, m: 'sway', a: .015, o: [0, 150] }, { p: L.star(0, -178, 14, 5, .45), f: 2, ft: .95, s: 4 }, ...[[-30, -60], [30, 10], [-50, 60], [40, 70]].map(([x, y]) => ({ c: [x, y, 7], f: 2, ft: .95, s: 4 })), gnd,
  ], { moods: ['nostalgico', 'sereno'] });
  A('meteorito', 'METEORITO', /\b(meteoritos?|meteors?|asteroides?|asteroids?|meteorites?|impacto|armagedd[oó]n|apocalipsis|apocalypse)\b/i, [
    { p: 'M-190 -170 L-40 -30', s: 22, i: 2, m: 'drift', a: 6 }, { p: 'M-190 -130 L-60 -20 M-160 -190 L-30 -50', s: 8, i: 1 }, { p: 'M-60 -50 C-20 -70 40 -40 50 0 C60 40 20 70 -20 60 C-60 50 -80 -20 -60 -50 Z', f: 3, ft: .8, s: 10, m: 'spin', a: .3, o: [0, 0] }, { c: [-10, 0, 12], s: 4 }, { c: [30, 20, 8], s: 4 },
    { p: 'M60 90 C100 100 130 130 150 170 M100 60 C140 70 170 100 190 140', f: 2, ft: .6, s: 5, m: 'pulse', a: .08, o: [100, 100] },
  ], { moods: ['oscuro', 'rabioso'] });
  A('isla_lejana', 'ISLA', /\b(islas?|islands?|islote|islet|archipi[eé]lago|archipelago|n[aá]ufrago|castaway|robinson)\b/i, [
    { p: 'M-190 90 H190', s: 8 }, { p: 'M-100 90 C-90 60 -50 50 -10 60 C40 40 90 60 100 90 Z', f: 2, ft: .6, s: 9 }, { p: 'M0 55 C0 20 5 0 10 -30', s: 9 }, { p: 'M10 -30 C-30 -50 -60 -40 -80 -20 M10 -30 C40 -60 70 -50 90 -25 M10 -30 C0 -70 10 -80 20 -90', f: 1, ft: .85, s: 7, m: 'sway', a: .04, o: [10, -30] },
    { p: 'M-190 110 C-100 90 -50 120 0 110 C50 100 100 120 190 105 V170 H-190 Z', f: 3, ft: .5, s: 6, m: 'drift', a: 8 }, { c: [120, -110, 24], f: 2, ft: .9, s: 5 },
  ], { moods: ['sereno', 'melancolico'] });
})();
