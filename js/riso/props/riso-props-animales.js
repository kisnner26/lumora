// ============================================================
// riso-props-animales.js — animales y criaturas (oleada 3 del catálogo). Ver riso-props-lib.js.
// ============================================================
(() => {
  const R = window.RISO; if (!R || !R.lib) return;
  const { add, L } = R.lib, C = 'animales';
  const A = (id, label, rx, shapes, opt) => add(id, C, label, rx, shapes, opt);
  const eye = (x, y, r = 5) => ({ c: [x, y, r], f: 1, s: 0 });
  const legs = (xs, y0, y1, s = 10) => ({ p: xs.map(x => `M${x} ${y0} V${y1}`).join(' '), s });
  const gnd = { p: 'M-190 170 H190', s: 8 };

  A('perro', 'PERRO', /\b(perros?|perritos?|dogs?|puppy|puppies|cachorros?|doggy)\b/i, [
    { e: [10, 30, 90, 55], f: 2, ft: .75, s: 9 }, { c: [-90, -20, 48], f: 2, ft: .75, s: 9 }, { p: 'M-125 -40 C-150 -30 -150 20 -125 30 Z', f: 1, ft: .9, s: 7 }, { p: 'M-60 -60 C-60 -90 -30 -80 -40 -50 Z', f: 1, ft: .9, s: 6 },
    eye(-85, -30), { c: [-128, -10, 8], f: 1, s: 0 }, legs([-50, -10, 60, 90], 70, 150), { p: 'M100 10 C140 -20 150 -60 130 -80', s: 9, m: 'wag', a: .3, o: [100, 10] }, gnd,
  ], { moods: ['feliz', 'nostalgico'] });
  A('gato', 'GATO', /\b(gatos?|gatitos?|cats?|kitty|kitten|felino dom[eé]stico|michi|minino)\b/i, [
    { e: [0, 90, 80, 70], f: 3, ft: .65, s: 9 }, { c: [0, -30, 60], f: 3, ft: .65, s: 9 }, { p: 'M-55 -60 L-60 -125 L-15 -80 M55 -60 L60 -125 L15 -80', f: 3, ft: .65, s: 8 },
    { e: [-22, -35, 9, 14], f: 2, ft: .95, s: 4 }, { e: [22, -35, 9, 14], f: 2, ft: .95, s: 4 }, { p: 'M-8 -12 L0 -5 L8 -12 Z', f: 1, s: 3 }, { p: 'M-70 -20 L-120 -30 M-70 -8 L-120 0 M70 -20 L120 -30 M70 -8 L120 0', s: 3 },
    { p: 'M80 130 C150 130 170 60 130 20', s: 11, m: 'sway', a: .08, o: [80, 130] }, gnd,
  ], { moods: ['sereno', 'romantico'] });
  A('caballo', 'CABALLO', /\b(caballos?|horses?|potro|yegua|stallion|ponis?|ponies|pony|jinete|equitaci[oó]n)\b/i, [
    { e: [20, 40, 100, 55], f: 2, ft: .8, s: 9 }, { p: 'M-50 20 C-70 -50 -60 -110 -20 -140 L20 -150 L20 -120 C40 -100 60 -50 70 -10', f: 2, ft: .8, s: 9 }, { p: 'M-20 -140 L-70 -100 L-90 -60 L-60 -60 L-40 -70', f: 2, ft: .9, s: 8 },
    { p: 'M20 -150 C50 -130 60 -90 60 -50 C30 -90 20 -120 20 -150 Z', f: 1, ft: .9, s: 6, m: 'sway', a: .04, o: [20, -150] }, eye(-30, -105), legs([-60, -20, 70, 110], 80, 165), { p: 'M115 20 C160 40 160 100 140 130', s: 9, m: 'sway', a: .08, o: [115, 20] },
  ], { moods: ['desafiante', 'sereno'] });
  A('vaca', 'VACA', /\b(vacas?|cows?|toros?|bulls?|ganado|cattle)\b/i, [
    { p: L.rr(-90, -10, 190, 100, 40), f: -1, s: 9 }, { c: [-40, 30, 26], f: 1, ft: .9, s: 0 }, { c: [40, 20, 30], f: 1, ft: .9, s: 0 }, { p: L.rr(-160, -30, 80, 70, 24), f: -1, s: 9 }, { p: 'M-150 -30 L-160 -60 M-110 -30 L-100 -60', s: 7 },
    { c: [-140, 20, 8], f: 2, ft: .9, s: 3 }, eye(-120, -8), legs([-70, -40, 60, 90], 90, 160, 10), { p: 'M100 20 C130 30 130 80 120 100', s: 6 }, { c: [0, 100, 14], f: 2, ft: .8, s: 5 }, gnd,
  ], { moods: ['sereno'] });
  A('cerdo', 'CERDO', /\b(cerdos?|cochinos?|puercos?|chanchos?|pigs?|piggy|marranos?|hogs?)\b/i, [
    { e: [0, 30, 110, 80], f: 2, ft: .6, s: 9 }, { c: [-110, 20, 46], f: 2, ft: .6, s: 9 }, { e: [-150, 30, 20, 26], f: 2, ft: .9, s: 6 }, { c: [-152, 28, 3], f: 1, s: 0 }, { c: [-146, 40, 3], f: 1, s: 0 }, { p: 'M-95 -20 L-85 -60 L-65 -25', f: 2, ft: .8, s: 6 },
    eye(-105, 8), legs([-60, -20, 40, 80], 90, 150), { p: 'M105 20 C130 0 150 30 125 40 C150 50 130 70 115 60', s: 6 }, gnd,
  ], { moods: ['feliz'] });
  A('oveja', 'OVEJA', /\b(ovejas?|carneros?|corderos?|sheep|lambs?)\b/i, [
    ...[[-60, 10], [0, -10], [60, 10], [-30, 50], [30, 50], [-80, 60], [80, 60]].map(([x, y]) => ({ c: [x, y, 40], f: -1, s: 8 })), { p: L.rr(-160, -20, 60, 70, 22), f: 1, ft: .85, s: 8 }, eye(-140, 5), legs([-50, -10, 40, 80], 90, 155, 9), gnd,
  ], { moods: ['sereno'] });
  A('gallo', 'GALLO', /\b(gallos?|gallinas?|pollitos?|roosters?|amanecer campestre)\b/i, [
    { p: 'M-70 -20 C-80 60 -20 120 60 100 C110 80 100 20 80 -20 C60 -50 -50 -50 -70 -20 Z', f: 2, ft: .85, s: 9 }, { c: [-70, -70, 34], f: 2, ft: .85, s: 9 }, { p: 'M-80 -100 L-70 -125 L-58 -105 L-45 -125 L-40 -95', f: 1, ft: .95, s: 7 },
    { p: 'M-102 -72 L-135 -62 L-102 -55 Z', f: 3, ft: .9, s: 6 }, eye(-75, -78), { p: 'M60 -10 C120 -80 150 -30 130 20 C110 -20 90 0 80 30', f: 1, ft: .8, s: 8, m: 'sway', a: .05, o: [70, 0] }, legs([-20, 20], 100, 165, 8), gnd,
  ], { moods: ['feliz', 'desafiante'] });
  A('pato', 'PATO', /\b(patos?|patitos?|ducks?|duckling|ganso|goose|geese)\b/i, [
    { p: 'M-110 40 C-90 120 90 130 130 40 C150 0 120 10 100 20 C60 -20 -60 0 -110 40 Z', f: 2, ft: .85, s: 9 }, { c: [-70, -30, 44], f: 2, ft: .85, s: 9 }, { p: 'M-108 -30 C-150 -30 -150 0 -104 -10 Z', f: 1, ft: .95, s: 7 }, eye(-72, -40), { p: 'M-20 40 C10 20 50 30 70 50', s: 5 },
    { p: 'M-190 150 C-120 130 -60 160 0 150 C60 140 120 160 190 145', s: 7, m: 'drift', a: 6 }, { p: 'M-190 165 C-120 145 -60 175 0 165', s: 4, m: 'drift', a: -6 },
  ], { moods: ['feliz', 'sereno'] });
  A('conejo', 'CONEJO', /\b(conejos?|conejitos?|bunny|bunnies|rabbits?|liebres?|hares?|madriguera)\b/i, [
    { e: [0, 90, 80, 75], f: -1, s: 9 }, { c: [-10, -20, 52], f: -1, s: 9 }, { p: 'M-40 -60 C-70 -170 -20 -190 -15 -70 M15 -60 C30 -170 70 -180 45 -60', f: -1, s: 9, m: 'sway', a: .03, o: [-10, -60] }, { p: 'M-35 -80 C-45 -140 -28 -150 -25 -80 M20 -80 C25 -130 45 -135 35 -80', f: 1, ft: .7, s: 0 },
    eye(-28, -25), eye(8, -25), { c: [-10, -8, 6], f: 1, s: 0 }, { c: [85, 120, 22], f: -1, s: 8 }, legs([-40, 40], 150, 168, 9), gnd,
  ], { moods: ['feliz', 'sereno'] });
  A('raton', 'RATÓN', /\b(ratas?|rat[oó]n(es)?|ratoncito|mice|mouse|rats?|roedor|rodent)\b/i, [
    { p: 'M-130 50 C-130 -30 20 -50 80 20 C100 50 80 90 20 90 H-90 C-120 90 -130 70 -130 50 Z', f: 3, ft: .6, s: 9 }, { c: [-100, 0, 34], f: 3, ft: .8, s: 8 }, { c: [-70, -30, 28], f: 1, ft: .85, s: 7 }, eye(-125, 45, 5), { c: [-135, 55, 6], f: 1, s: 0 },
    { p: 'M-95 80 L-180 78 M100 60 C150 50 170 90 190 60', s: 5, m: 'wag', a: .1 }, { p: 'M-140 40 L-185 30 M-140 50 L-185 55', s: 3 }, legs([-60, 30], 90, 120, 6), gnd,
  ], { moods: ['oscuro'] });
  A('lobo', 'LOBO', /\b(lobos?|wolf|wolves|aullido|howl\w*|manada|wolfpack|lobo solitario)\b/i, [
    { p: 'M-110 170 L-90 60 C-100 0 -60 -40 -30 -60 L-40 -130 L0 -90 L40 -140 L40 -70 C90 -50 110 10 90 60 L120 170 Z', f: 3, ft: .7, s: 9 }, { p: 'M-30 -60 C-60 -40 -100 -20 -120 -50 C-100 -70 -70 -80 -40 -90', f: 3, ft: .9, s: 8 },
    { p: 'M-60 -100 C-70 -130 -60 -160 -50 -190 M-50 -100 L-20 -150', s: 0 }, { c: [120, -110, 40], f: 2, ft: .8, s: 6, m: 'pulse', a: .04, o: [120, -110] }, { p: 'M-20 20 C10 40 50 20 70 40 M-40 80 C0 100 50 80 80 100', s: 4 }, { p: 'M-190 170 H190', s: 8 },
  ], { moods: ['oscuro', 'desafiante'] });
  A('zorro', 'ZORRO', /\b(zorros?|zorras?|foxes|fox|astuto|sly|coyotes?)\b/i, [
    { p: 'M-30 -70 L-60 -140 L-10 -100 L30 -100 L70 -140 L50 -70 C40 -30 20 20 0 60 C-20 20 -50 -30 -30 -70 Z', f: 2, ft: .9, s: 9 }, { p: 'M-30 -30 C-10 10 10 10 30 -30 C20 30 5 50 0 60 C-5 50 -20 30 -30 -30 Z', f: -1, s: 5 },
    { c: [0, 55, 7], f: 1, s: 0 }, eye(-26, -50), eye(26, -50), { p: 'M-80 100 C-30 70 40 70 80 100 L100 170 H-100 Z', f: 2, ft: .85, s: 9 }, { p: 'M80 110 C150 100 190 140 180 170 C150 160 120 165 100 150', f: 2, ft: .95, s: 8, m: 'sway', a: .05, o: [90, 130] },
  ], { moods: ['desafiante', 'oscuro'] });
  A('oso', 'OSO', /\b(osos?|bears?|osito|teddy bear|grizzly|hibernar|hibernate)\b/i, [
    { e: [0, 70, 100, 95], f: 2, ft: .55, s: 10 }, { c: [0, -70, 62], f: 2, ft: .55, s: 10 }, { c: [-50, -120, 22], f: 2, ft: .55, s: 9 }, { c: [50, -120, 22], f: 2, ft: .55, s: 9 }, { e: [0, -50, 30, 22], f: 2, ft: .95, s: 6 }, { c: [0, -58, 8], f: 1, s: 0 },
    eye(-25, -80), eye(25, -80), { p: 'M-95 60 C-140 90 -120 140 -90 140 M95 60 C140 90 120 140 90 140', f: 2, ft: .55, s: 9 }, { p: 'M0 -40 V-30', s: 4 }, gnd,
  ], { moods: ['sereno', 'nostalgico'] });
  A('ciervo', 'CIERVO', /\b(ciervos?|venados?|deer|reno|reindeer|bambi|alce|moose|elk|astas|antlers)\b/i, [
    { e: [10, 50, 90, 50], f: 2, ft: .8, s: 9 }, { p: 'M-50 40 C-70 -10 -60 -60 -40 -90 L0 -100 L0 -60 C20 -30 30 0 40 30', f: 2, ft: .8, s: 9 }, { c: [-50, -100, 26], f: 2, ft: .9, s: 8 }, eye(-56, -105),
    { p: 'M-50 -125 L-70 -180 M-70 -180 L-100 -165 M-70 -180 L-60 -195 M-30 -125 L-10 -185 M-10 -185 L20 -170 M-10 -185 L-20 -200', s: 7 }, legs([-30, -5, 60, 90], 90, 165, 8), { c: [100, 40, 8], f: -1, s: 5 }, gnd,
  ], { moods: ['sereno', 'melancolico'] });
  A('leon', 'LEÓN', /\b(le[oó]n(es)?|leonas?|lions?|lioness|rey de la selva|melena|manes?)\b/i, [
    { c: [0, 0, 130], f: 2, ft: .85, s: 10, m: 'pulse', a: .03, o: [0, 0] }, ...Array.from({ length: 12 }, (_, i) => { const a = i / 12 * Math.PI * 2; return { p: `M${(Math.cos(a) * 110).toFixed(0)} ${(Math.sin(a) * 110).toFixed(0)} L${(Math.cos(a) * 165).toFixed(0)} ${(Math.sin(a) * 165).toFixed(0)}`, s: 7, i: 2 }; }),
    { c: [0, 10, 75], f: 3, ft: .55, s: 9 }, { e: [0, 40, 34, 24], f: -1, s: 6 }, { p: 'M-10 25 L0 35 L10 25 Z', f: 1, s: 4 }, eye(-30, -10), eye(30, -10), { p: 'M-50 -55 L-60 -85 L-25 -60 M50 -55 L60 -85 L25 -60', f: 3, ft: .8, s: 6 },
  ], { moods: ['desafiante', 'euforico'] });
  A('jirafa', 'JIRAFA', /\b(jirafas?|giraffes?|cuello largo)\b/i, [
    { p: 'M-50 170 L-45 30 C-45 -30 -50 -100 -40 -150 L30 -150 C40 -100 50 -30 60 30 L70 170 Z', f: 2, ft: .6, s: 9 }, { e: [10, -160, 50, 30, -.2], f: 2, ft: .8, s: 9 }, { p: 'M-15 -180 L-20 -205 M25 -185 L30 -208', s: 6 }, eye(25, -165),
    ...[[-20, -100], [30, -70], [-25, -30], [40, 20], [-20, 60], [30, 100]].map(([x, y]) => ({ p: L.rr(x - 12, y - 12, 26, 24, 8), f: 1, ft: .85, s: 3 })), gnd,
  ], { moods: ['feliz'] });
  A('cebra', 'CEBRA', /\b(cebras?|zebras?|rayas de cebra|paso de cebra)\b/i, [
    { e: [0, 30, 110, 60], f: -1, s: 9 }, { p: 'M-60 10 C-90 -60 -60 -110 -20 -130 L40 -140 L50 -110 C20 -90 20 -50 30 -10', f: -1, s: 9 }, { p: 'M-20 -130 L-70 -90 L-80 -50 L-40 -50', f: -1, s: 8 },
    ...[-60, -30, 0, 30, 60].map(x => ({ p: `M${x} -20 C${x + 10} 20 ${x} 50 ${x + 8} 90`, s: 8, i: 1 })), { p: 'M-30 -120 L-55 -80 M-10 -125 L-40 -90 M10 -130 L-15 -95', s: 5 }, legs([-70, -30, 40, 80], 80, 165, 9), { p: 'M105 20 C140 30 150 80 135 110', s: 8, m: 'sway', a: .08, o: [105, 20] },
  ], { moods: ['sereno'] });
  A('hipopotamo', 'HIPOPÓTAMO', /\b(hipop[oó]tamos?|hippos?|hippopotamus|rinocerontes?|rhinos?|rhinoceros)\b/i, [
    { p: 'M-150 40 C-150 -40 -80 -70 0 -70 C90 -70 150 -30 150 40 C150 100 100 130 0 130 C-100 130 -150 100 -150 40 Z', f: 3, ft: .65, s: 10 }, { p: 'M-190 20 C-190 -20 -140 -40 -120 -10 C-100 20 -140 60 -190 50 Z', f: 3, ft: .7, s: 9 }, { c: [-165, 15, 4], f: 1, s: 0 }, { c: [-150, 25, 4], f: 1, s: 0 },
    eye(-110, -30), { p: 'M-90 -60 L-95 -85 M-60 -60 L-60 -85', s: 8 }, { p: 'M-60 130 V160 M20 130 V160 M100 120 V150', s: 12 }, { p: 'M-190 165 C-100 150 100 170 190 155', f: 3, ft: .4, s: 6, m: 'drift', a: 6 },
  ], { moods: ['sereno'] });
  A('mono', 'MONO', /\b(monos?|monkeys?|simios?|chimpanc[eé]s?|primates?|orangut[aá]n|gorilas?|gorillas?)\b/i, [
    { e: [0, 80, 60, 80], f: 2, ft: .6, s: 9 }, { c: [0, -60, 50], f: 2, ft: .6, s: 9 }, { e: [0, -50, 34, 30], f: 2, ft: .95, s: 6 }, { c: [-58, -60, 20], f: 2, ft: .95, s: 7 }, { c: [58, -60, 20], f: 2, ft: .95, s: 7 }, eye(-15, -70), eye(15, -70), { p: 'M-14 -35 C-5 -28 5 -28 14 -35', s: 4 },
    { p: 'M-60 50 C-110 80 -120 130 -90 150 M60 50 C110 70 100 120 70 140', s: 9 }, { p: 'M50 130 C130 130 160 60 120 20 C100 0 130 -40 160 -30', s: 9, m: 'sway', a: .05, o: [50, 130] },
  ], { moods: ['feliz', 'euforico'] });
  A('serpiente', 'SERPIENTE', /\b(serpientes?|v[ií]boras?|culebras?|snakes?|cobras?|reptil\w*|anaconda)\b/i, [
    { p: 'M-150 120 C-190 60 -100 40 -70 80 C-40 120 40 130 70 80 C100 30 30 -10 -10 -40 C-50 -70 -30 -140 30 -140 C80 -140 90 -90 60 -80', f: 1, ft: .8, s: 24, m: 'drift', a: 4 },
    { p: 'M-150 120 C-190 60 -100 40 -70 80 C-40 120 40 130 70 80 C100 30 30 -10 -10 -40 C-50 -70 -30 -140 30 -140 C80 -140 90 -90 60 -80', f: 2, ft: .9, s: 8, m: 'drift', a: 4 },
    { c: [60, -85, 20], f: 1, ft: .9, s: 8 }, eye(62, -90), { p: 'M78 -80 L110 -70 M96 -75 L110 -85 M96 -75 L112 -62', s: 4, i: 2 },
  ], { moods: ['oscuro', 'rabioso'] });
  A('cocodrilo', 'COCODRILO', /\b(cocodrilos?|caim[aá]n(es)?|caim[aá]n|crocodiles?|alligators?|lagarto|lizards?|iguanas?|dinosaurios?|dinosaurs?|dino)\b/i, [
    { p: 'M-190 20 L-100 -10 L-60 -30 L20 -20 L120 0 L190 40 L120 50 L20 60 L-60 50 L-100 50 Z', f: 1, ft: .8, s: 9 }, { p: 'M-190 20 L-100 20 M-185 30 L-100 40', s: 5 }, ...[-40, 0, 40, 80, 120].map(x => ({ p: `M${x} -20 L${x + 10} -40 L${x + 20} -18`, f: 1, ft: .9, s: 5 })),
    eye(-80, -25), { p: 'M-120 15 L-115 30 L-105 15 M-160 20 L-155 35 L-145 20', f: -1, s: 3 }, legs([-50, 60], 55, 100, 12), { p: 'M-190 165 H190', s: 8 },
  ], { moods: ['oscuro', 'desafiante'] });
  A('tortuga', 'TORTUGA', /\b(tortugas?|turtles?|tortoise|galápagos)\b/i, [
    { p: 'M-110 60 C-110 -50 110 -50 110 60 Z', f: 1, ft: .8, s: 10 }, { p: 'M-40 -30 L-60 30 M0 -40 V40 M40 -30 L60 30 M-90 20 H90', s: 5 }, { p: L.poly([-25, -25], [25, -25], [35, 15], [-35, 15]), s: 4 },
    { c: [-140, 30, 30], f: 1, ft: .9, s: 8 }, eye(-148, 25), { p: 'M-70 60 V100 H-30 V60 M30 60 V100 H70 V60', f: 1, ft: .9, s: 8 }, { p: 'M110 50 L160 60 L110 65', f: 1, ft: .9, s: 7 }, gnd,
  ], { moods: ['sereno'] });
  A('rana', 'RANA', /\b(ranas?|sapos?|frogs?|toads?|croar|croak|renacuajo|tadpole)\b/i, [
    { e: [0, 50, 110, 80], f: 1, ft: .8, s: 10 }, { c: [-50, -35, 32], f: 1, ft: .8, s: 9 }, { c: [50, -35, 32], f: 1, ft: .8, s: 9 }, { c: [-50, -35, 14], f: -1, s: 6 }, { c: [50, -35, 14], f: -1, s: 6 }, eye(-50, -35, 6), eye(50, -35, 6),
    { p: 'M-70 60 C0 100 0 100 70 60', s: 6 }, { p: 'M-110 90 C-160 100 -170 140 -130 150 L-90 140 M110 90 C160 100 170 140 130 150 L90 140', f: 1, ft: .8, s: 8 }, { p: 'M-190 165 H190', s: 8 },
  ], { moods: ['feliz'] });
  A('pez', 'PEZ', /\b(peces?|pez|pecera|goldfish|aquarium|acuario|pececito|fishes|fishbowl)\b/i, [
    { p: 'M-110 0 C-60 -70 40 -70 80 0 C40 70 -60 70 -110 0 Z', f: 2, ft: .85, s: 9 }, { p: 'M80 0 L150 -50 L140 0 L150 50 Z', f: 2, ft: .95, s: 8, m: 'wag', a: .1, o: [80, 0] }, eye(-70, -10, 7), { p: 'M-30 -50 C0 -90 20 -80 30 -55', f: 2, ft: .7, s: 7 },
    { p: 'M-20 -35 C-10 -10 -10 10 -20 35 M10 -40 C20 -10 20 10 10 40', s: 4 }, { c: [-140, -60, 10], s: 4, m: 'steam', a: 50 }, { c: [-120, -100, 6], s: 3, m: 'steam', a: 60, ph: .4 },
  ], { moods: ['sereno'] });
  A('tiburon', 'TIBURÓN', /\b(tiburon(es)?|tibur[oó]n|sharks?|jaws|megalodon|squalo)\b/i, [
    { p: 'M-190 20 C-120 -50 20 -60 100 -20 C140 -60 160 -100 190 -130 C170 -80 170 -50 180 0 C170 30 160 70 190 130 C150 100 120 60 100 40 C20 90 -120 80 -190 20 Z', f: 3, ft: .75, s: 10 },
    { p: 'M-20 -50 L20 -140 L60 -40 Z', f: 3, ft: .9, s: 9 }, eye(-125, 0, 6), { p: 'M-190 30 C-150 50 -120 50 -100 35 M-160 35 L-150 50 M-140 40 L-130 52 M-120 42 L-112 50', s: 4 },
    { p: 'M-190 130 C-100 110 100 150 190 125', s: 5, m: 'drift', a: 6 },
  ], { moods: ['oscuro', 'rabioso'] });
  A('ballena', 'BALLENA', /\b(ballenas?|whales?|orcas?|cachalote|humpback|moby)\b/i, [
    { p: 'M-180 30 C-180 -60 -60 -90 40 -50 C110 -20 130 -70 170 -120 C160 -70 180 -20 190 20 C130 10 100 60 30 90 C-70 120 -180 100 -180 30 Z', f: 3, ft: .75, s: 10 },
    { p: 'M-150 60 C-80 90 0 90 50 70', f: -1, s: 5 }, eye(-140, 0, 6), { p: 'M-100 -60 C-110 -100 -90 -130 -110 -160 M-100 -60 C-90 -100 -70 -130 -50 -150', s: 6, m: 'steam', a: 30 }, { p: 'M-190 150 C-100 130 100 170 190 140', s: 6, m: 'drift', a: 8 },
  ], { moods: ['sereno', 'melancolico'] });
  A('delfin', 'DELFÍN', /\b(delf[ií]n(es)?|delf[ií]n|dolphins?|marsopa|porpoise)\b/i, [
    { p: 'M-170 40 C-110 -90 20 -110 80 -40 C110 -10 150 -30 175 -70 C170 -10 150 30 100 50 C40 80 -60 70 -100 30 L-140 50 Z', f: 3, ft: .7, s: 10 }, { p: 'M-170 40 L-120 -10 L-130 40', f: 3, ft: .8, s: 8 }, eye(-105, -10, 5),
    { p: 'M-20 -50 C10 -100 30 -100 40 -60', f: 3, ft: .9, s: 8 }, { p: 'M-20 40 C0 90 30 90 40 50', f: 3, ft: .9, s: 7 }, { p: 'M-100 20 C-60 40 -20 40 20 20', s: 4 }, { c: [110, -110, 10], s: 4, m: 'fall', a: 60 },
  ], { moods: ['feliz', 'euforico'] });
  A('pulpo', 'PULPO', /\b(pulpos?|octopus|calamar(es)?|squids?|kraken|tent[aá]culos?|tentacles?)\b/i, [
    { p: 'M-70 -20 C-80 -140 80 -140 70 -20 Z', f: 1, ft: .8, s: 10 }, eye(-28, -50, 7), eye(28, -50, 7),
    ...[-60, -30, 0, 30, 60].map((x, i) => ({ p: `M${x} -20 C${x - 30 + i * 8} 40 ${x + 40 - i * 10} 90 ${x - 20 + i * 5} 150 C${x - 10} 170 ${x + 20} 160 ${x + 10} 140`, s: 9, m: 'sway', a: .05, o: [x, -20], ph: i })), { p: 'M-30 -20 C-10 -5 10 -5 30 -20', s: 5 },
  ], { moods: ['oscuro'] });
  A('medusa', 'MEDUSA', /\b(medusas?|jellyfish|aguaviva|aguamala)\b/i, [
    { p: 'M-110 20 C-110 -120 110 -120 110 20 C60 0 40 30 0 20 C-40 30 -60 0 -110 20 Z', f: 3, ft: .6, s: 10, m: 'pulse', a: .06, o: [0, -40] }, { c: [-40, -40, 12], f: -1, s: 0 }, { c: [30, -60, 8], f: -1, s: 0 },
    ...[-70, -35, 0, 35, 70].map((x, i) => ({ p: `M${x} 25 C${x - 20} 70 ${x + 20} 110 ${x} 160`, s: 5, i: 2, m: 'sway', a: .07, o: [x, 25], ph: i })),
  ], { moods: ['sereno', 'oscuro'] });
  A('estrella_mar', 'ESTRELLA DE MAR', /\b(estrellas? de mar|starfish|sea star|erizo de mar)\b/i, [
    { p: L.star(0, 0, 160, 5, .42), f: 2, ft: .85, s: 10, m: 'spin', a: .05, o: [0, 0] }, ...[0, 1, 2, 3, 4].flatMap(i => { const a = -Math.PI / 2 + i * Math.PI * 2 / 5; return [0.35, 0.6, 0.85].map(k => ({ c: [Math.cos(a) * 160 * k, Math.sin(a) * 160 * k, 6], f: 1, s: 0 })); }),
  ], { moods: ['sereno'] });
  A('caracol', 'CARACOL', /\b(caracol(es)?|snails?|babosas?|slugs?)\b/i, [
    { c: [20, -10, 80], f: 2, ft: .7, s: 10 }, { p: 'M20 -10 C40 -10 50 10 30 20 C0 30 -20 -10 10 -40 C50 -60 90 -20 70 30', s: 6 }, { p: 'M-190 130 C-130 140 -60 150 20 150 C90 150 130 130 130 110 H-190 Z', f: 1, ft: .8, s: 9 },
    { p: 'M-190 110 C-190 80 -170 60 -160 30', s: 8 }, { p: 'M-170 70 L-180 30 M-155 70 L-150 30', s: 5, m: 'sway', a: .1, o: [-165, 70] }, { c: [-180, 28, 6], f: 1, s: 0 },
  ], { moods: ['sereno', 'melancolico'] });
  A('mariposa', 'MARIPOSA', /\b(mariposas?|butterfl(y|ies)|polilla|moth|monarca|monarch|metamorfosis)\b/i, [
    { p: 'M0 -10 C-40 -110 -150 -130 -160 -50 C-165 10 -80 40 0 20 Z', f: 2, ft: .85, s: 9, m: 'flap', o: [0, 0], v: .6 }, { p: 'M0 20 C-60 30 -110 90 -70 130 C-30 160 -10 90 0 20 Z', f: 1, ft: .8, s: 8, m: 'flap', o: [0, 0], v: .6 },
    { p: 'M0 -10 C40 -110 150 -130 160 -50 C165 10 80 40 0 20 Z', f: 2, ft: .85, s: 9, m: 'flap', o: [0, 0], v: .6 }, { p: 'M0 20 C60 30 110 90 70 130 C30 160 10 90 0 20 Z', f: 1, ft: .8, s: 8, m: 'flap', o: [0, 0], v: .6 },
    { e: [0, 30, 9, 60], f: 1, s: 8 }, { p: 'M-4 -35 C-20 -80 -40 -90 -50 -100 M4 -35 C20 -80 40 -90 50 -100', s: 5 },
  ], { moods: ['romantico', 'feliz', 'sereno'] });
  A('abeja', 'ABEJA', /\b(abejas?|bees?|avispas?|wasps?|zumbido|abejorros?|bumblebee)\b/i, [
    { e: [0, 20, 80, 55], f: 2, ft: .9, s: 9 }, { p: 'M-25 -30 V70 M15 -35 V75 M50 -20 V60', s: 12, i: 1 }, { c: [-90, 15, 30], f: 1, ft: .9, s: 8 }, eye(-98, 8, 4), { p: 'M-110 -10 L-135 -35 M-100 -12 L-115 -40', s: 4 },
    { p: 'M-20 -30 C-40 -110 40 -130 20 -35 Z', f: -1, s: 6, m: 'flap', o: [0, -30], v: 3 }, { p: 'M20 -30 C40 -100 100 -100 60 -25 Z', f: -1, s: 6, m: 'flap', o: [30, -30], v: 3 }, { p: 'M80 20 L110 20', s: 6 },
    { p: 'M-150 90 C-100 60 -50 130 0 100', s: 3, m: 'drift', a: 6 },
  ], { moods: ['feliz'] });
  A('arana', 'ARAÑA', /\b(ara[nñ]as?|spiders?|tar[aá]ntulas?|tarantulas?|viuda negra|black widow)\b/i, [
    { c: [0, 20, 50], f: 1, ft: .9, s: 10 }, { c: [0, -50, 30], f: 1, ft: .9, s: 9 }, eye(-10, -55, 5), eye(10, -55, 5), { p: 'M-40 10 C-100 -30 -140 -20 -160 40 M-45 30 C-100 20 -150 60 -170 120 M-40 50 C-90 70 -110 120 -120 170 M-30 60 C-50 100 -60 140 -60 175', s: 6 },
    { p: 'M40 10 C100 -30 140 -20 160 40 M45 30 C100 20 150 60 170 120 M40 50 C90 70 110 120 120 170 M30 60 C50 100 60 140 60 175', s: 6 }, { p: 'M0 -190 V-80', s: 3, m: 'bob', a: 6 },
  ], { moods: ['oscuro'] });
  A('libelula', 'LIBÉLULA', /\b(lib[eé]lulas?|dragonfl(y|ies)|caballito del diablo|damselfl(y|ies))\b/i, [
    { p: 'M-130 0 H100', s: 10 }, { c: [110, 0, 20], f: 3, ft: .9, s: 8 }, { p: 'M-20 -5 C-60 -80 -130 -70 -140 -30 C-100 -20 -50 -10 -20 -5 Z', f: 3, ft: .4, s: 6, m: 'flap', o: [-10, 0], v: 2 }, { p: 'M20 -5 C60 -80 130 -70 140 -30 C100 -20 50 -10 20 -5 Z', f: 3, ft: .4, s: 6, m: 'flap', o: [10, 0], v: 2 },
    { p: 'M-20 5 C-60 80 -130 70 -140 30 C-100 20 -50 10 -20 5 Z', f: 3, ft: .4, s: 6, m: 'flap', o: [-10, 0], v: 2, ph: 1 }, { p: 'M20 5 C60 80 130 70 140 30 C100 20 50 10 20 5 Z', f: 3, ft: .4, s: 6, m: 'flap', o: [10, 0], v: 2, ph: 1 }, eye(118, -6, 4),
  ], { moods: ['sereno', 'romantico'] });
  A('luciernaga', 'LUCIÉRNAGA', /\b(luci[eé]rnagas?|fireflies|firefly|cocuyos?|lightning bugs?|bichitos de luz)\b/i, [
    { e: [0, 0, 40, 26], f: 1, ft: .9, s: 8 }, { c: [-45, 0, 18], f: 1, ft: .9, s: 7 }, { e: [40, 4, 28, 20], f: 2, ft: .95, s: 6, m: 'pulse', a: .4, o: [40, 4], v: 2 }, { c: [40, 4, 70], f: 2, ft: .25, s: 0, m: 'pulse', a: .3, o: [40, 4], v: 2 },
    { p: 'M-10 -20 C-30 -70 30 -70 10 -20 Z', f: -1, s: 5, m: 'flap', o: [0, -20], v: 4 }, ...[[-140, -90], [130, -100], [-120, 100], [150, 90], [0, -140]].map(([x, y], i) => ({ c: [x, y, 8], f: 2, ft: .95, s: 0, m: 'pulse', a: .6, v: 1.5, ph: i, o: [x, y] })),
  ], { moods: ['romantico', 'sereno', 'oscuro'] });
  A('buho', 'BÚHO', /\b(b[uú]hos?|lechuzas?|owls?|mochuelo|tecolote|noctambulo|night owl)\b/i, [
    { p: 'M-80 -60 C-90 40 -70 130 0 140 C70 130 90 40 80 -60 C60 -110 -60 -110 -80 -60 Z', f: 2, ft: .7, s: 10 }, { p: 'M-80 -60 L-90 -110 L-40 -85 M80 -60 L90 -110 L40 -85', f: 2, ft: .8, s: 8 }, { c: [-35, -40, 30], f: -1, s: 8 }, { c: [35, -40, 30], f: -1, s: 8 }, eye(-35, -40, 12), eye(35, -40, 12),
    { p: 'M-8 -30 L0 -8 L8 -30 Z', f: 2, ft: .95, s: 5 }, { p: 'M-40 30 C-30 50 -20 30 -10 50 M10 50 C20 30 30 50 40 30 M-30 70 C-20 90 -10 70 0 90 C10 70 20 90 30 70', s: 4 }, { p: 'M-190 140 H190', s: 8 }, { p: 'M-60 140 L-70 165 M60 140 L70 165', s: 7 },
  ], { moods: ['oscuro', 'sereno'] });
  A('cuervo', 'CUERVO', /\b(cuervos?|cuervo|crows?|ravens?|urraca|magpie|grajo)\b/i, [
    { p: 'M-120 -10 C-100 -70 -30 -70 20 -40 C60 -60 110 -30 100 10 C130 40 170 60 190 110 C140 90 100 70 60 60 C20 90 -60 80 -100 50 C-120 30 -125 10 -120 -10 Z', f: 1, ft: .95, s: 9 }, { p: 'M-120 -10 L-170 0 L-120 15 Z', f: 1, ft: .95, s: 7 }, eye(-100, -20, 6), { c: [-100, -20, 2], f: -1, s: 0 },
    { p: 'M0 70 L-10 130 M30 70 L28 130', s: 7 }, { p: 'M-60 130 H90', s: 9 }, { p: 'M-190 150 H190', s: 0 },
  ], { moods: ['oscuro', 'triste'] });
  A('paloma', 'PALOMA', /\b(palomas?|palomitas blancas?|doves?|pigeons?|paloma de la paz|peace dove)\b/i, [
    { p: 'M-110 20 C-90 -30 -30 -40 30 -20 C70 -60 110 -50 130 -20 C110 -10 100 10 90 30 C60 50 0 70 -60 60 Z', f: -1, s: 9 }, { c: [-100, 0, 24], f: -1, s: 8 }, { p: 'M-124 0 L-150 10 L-124 14', f: 2, ft: .9, s: 5 }, eye(-104, -4),
    { p: 'M20 -20 C-20 -100 -80 -120 -110 -100 C-70 -70 -30 -50 0 -10 Z', f: -1, s: 8, m: 'flap', o: [10, -15], v: .6 }, { p: 'M90 30 L150 70 L110 60 L100 90 Z', f: -1, s: 6 }, { p: 'M-150 12 C-170 20 -170 40 -150 50 C-140 30 -140 22 -150 12', f: 1, ft: .9, s: 5 },
  ], { moods: ['sereno', 'romantico'] });
  A('pinguino', 'PINGÜINO', /\b(ping[uü]inos?|penguins?|emperador|antártida|antarctic)\b/i, [
    { p: 'M0 -150 C70 -150 90 -60 90 30 C90 110 60 160 0 160 C-60 160 -90 110 -90 30 C-90 -60 -70 -150 0 -150 Z', f: 1, ft: .95, s: 10 }, { p: 'M0 -100 C50 -100 60 -20 55 40 C50 110 30 140 0 140 C-30 140 -50 110 -55 40 C-60 -20 -50 -100 0 -100 Z', f: -1, s: 6 },
    eye(-20, -100), eye(20, -100), { p: 'M-14 -85 L0 -65 L14 -85 Z', f: 2, ft: .95, s: 5 }, { p: 'M-90 0 C-140 30 -140 80 -100 90 M90 0 C140 30 140 80 100 90', f: 1, ft: .95, s: 8, m: 'sway', a: .04, o: [0, 0] }, { p: 'M-40 160 L-60 180 H-10 M40 160 L60 180 H10', f: 2, ft: .95, s: 6 }, { p: 'M-190 185 H190', s: 8 },
  ], { moods: ['feliz', 'sereno'] });
  A('cisne', 'CISNE', /\b(cisnes?|swans?|cisne negro|black swan|ugly duckling)\b/i, [
    { p: 'M-110 40 C-80 120 90 120 120 30 C90 40 60 30 20 20 C-40 0 -90 20 -110 40 Z', f: -1, s: 9 }, { p: 'M-60 25 C-140 -20 -100 -120 -50 -120 C-10 -120 -10 -70 -40 -70', s: 12, m: 'sway', a: .02, o: [-60, 25] }, { c: [-45, -122, 18], f: -1, s: 8 }, { p: 'M-62 -125 L-95 -118 L-62 -110 Z', f: 2, ft: .95, s: 5 },
    eye(-48, -128), { p: 'M20 30 C0 -30 60 -40 80 20', f: -1, s: 6, m: 'flap', o: [50, 30], v: .4 }, { p: 'M-190 145 C-120 125 -60 155 0 145 C60 135 120 155 190 140', s: 7, m: 'drift', a: 6 },
  ], { moods: ['romantico', 'sereno'] });
  A('pavo_real', 'PAVO REAL', /\b(pavos? reales?|pavo real|peacocks?|peafowl|pavos?)\b/i, [
    ...Array.from({ length: 9 }, (_, i) => { const a = -Math.PI + (i + .5) * Math.PI / 9, x = Math.cos(a) * 130, y = 30 + Math.sin(a) * 140; return [{ p: `M0 40 L${x.toFixed(0)} ${y.toFixed(0)}`, s: 5, i: 3 }, { c: [x * 1.0, y, 22], f: i % 2 ? 1 : 3, ft: .8, s: 6, m: 'pulse', a: .05, o: [x, y], ph: i }, { c: [x, y, 8], f: 2, ft: .95, s: 0 }]; }).flat(),
    { e: [0, 90, 34, 55], f: 1, ft: .9, s: 9 }, { c: [0, 30, 20], f: 1, ft: .9, s: 8 }, { p: 'M-6 10 L-8 -14 M6 10 L8 -14', s: 4 }, { p: 'M-20 145 V170 M20 145 V170', s: 6 },
  ], { moods: ['euforico', 'romantico', 'desafiante'] });
  A('murcielago', 'MURCIÉLAGO', /\b(murci[eé]lagos?|bats|vampiros?|vampires?|dr[aá]cula|dracula|batman|noche de brujas|halloween)\b/i, [
    { p: 'M0 30 C-20 -20 -50 -40 -100 -30 C-130 -80 -170 -70 -190 -20 C-160 -10 -150 20 -140 50 C-120 30 -90 40 -70 70 C-50 40 -20 50 0 90 Z', f: 1, ft: .95, s: 8, m: 'flap', o: [0, 20], v: .5 },
    { p: 'M0 30 C20 -20 50 -40 100 -30 C130 -80 170 -70 190 -20 C160 -10 150 20 140 50 C120 30 90 40 70 70 C50 40 20 50 0 90 Z', f: 1, ft: .95, s: 8, m: 'flap', o: [0, 20], v: .5 },
    { e: [0, 30, 26, 44], f: 1, ft: .95, s: 8 }, { p: 'M-20 -10 L-25 -45 L-8 -18 M20 -10 L25 -45 L8 -18', f: 1, s: 6 }, { c: [-8, 20, 3], f: 2, s: 0 }, { c: [8, 20, 3], f: 2, s: 0 }, { c: [110, -140, 34], f: 2, ft: .5, s: 6 },
  ], { moods: ['oscuro'] });
  A('dragon', 'DRAGÓN', /\b(drag[oó]n(es)?|dragons?|drag[oó]n chino|wyvern|smaug|fire.?breathing)\b/i, [
    { p: 'M-170 80 C-120 20 -60 70 -20 20 C30 -30 80 20 100 -20 C110 -40 100 -70 80 -80', s: 26, m: 'sway', a: .02, o: [0, 0] }, { p: 'M-170 80 C-120 20 -60 70 -20 20 C30 -30 80 20 100 -20 C110 -40 100 -70 80 -80', f: 1, ft: .8, s: 8, m: 'sway', a: .02, o: [0, 0] },
    { p: 'M80 -80 L130 -100 L170 -75 L120 -55 Z', f: 1, ft: .9, s: 8 }, { p: 'M95 -85 L90 -125 L110 -95 M120 -95 L125 -130 L135 -95', s: 6 }, eye(120, -80), { p: 'M-20 20 C-40 -60 -100 -90 -150 -70 C-110 -50 -80 -20 -60 40 Z', f: 2, ft: .85, s: 8, m: 'flap', o: [-20, 20], v: .5 },
    { p: 'M170 -70 C190 -60 200 -50 190 -30 C180 -50 170 -60 160 -60', f: 2, ft: .95, s: 4, m: 'pulse', a: .2, o: [165, -65], v: 3 },
  ], { moods: ['oscuro', 'desafiante', 'euforico'] });
  A('unicornio', 'UNICORNIO', /\b(unicornios?|unicorns?|pegaso|pegasus|arco iris m[aá]gico|magical creature)\b/i, [
    { e: [10, 40, 100, 55], f: -1, s: 9 }, { p: 'M-40 20 C-60 -40 -60 -100 -30 -120 L20 -125 C40 -100 50 -50 60 -10', f: -1, s: 9 }, { p: 'M-30 -120 L-70 -90 L-80 -55 L-40 -55', f: -1, s: 8 }, { p: 'M-30 -125 L-15 -200 L-5 -125', f: 2, ft: .95, s: 7 },
    { p: 'M20 -125 C50 -110 60 -70 50 -30 C30 -60 20 -90 20 -125 Z', f: 1, ft: .85, s: 6, m: 'sway', a: .05, o: [20, -125] }, eye(-40, -95), legs([-40, 0, 70, 105], 80, 165, 8), { p: 'M115 30 C160 50 160 100 140 130', f: 1, ft: .3, s: 8, m: 'sway', a: .08, o: [115, 30] }, { p: L.star(130, -110, 16, 4, .4), f: 2, ft: .9, s: 4, m: 'pulse', a: .2, o: [130, -110] },
  ], { moods: ['romantico', 'feliz', 'euforico'] });
  A('ardilla', 'ARDILLA', /\b(ardillas?|squirrels?|chipmunk|ardilla\w*)\b/i, [
    { e: [0, 60, 50, 80], f: 2, ft: .8, s: 9 }, { c: [0, -50, 38], f: 2, ft: .8, s: 9 }, { p: 'M-30 -75 L-35 -110 L-10 -85 M30 -75 L35 -110 L10 -85', f: 2, ft: .9, s: 6 }, eye(-14, -55), eye(14, -55), { c: [0, -38, 5], f: 1, s: 0 },
    { p: 'M40 110 C120 120 150 30 110 -30 C90 -70 130 -110 90 -130 C60 -70 60 -10 50 20', f: 2, ft: .85, s: 9, m: 'sway', a: .05, o: [45, 110] }, { c: [-40, 40, 16], f: 3, ft: .8, s: 7 }, { p: 'M-30 130 L-45 150 M30 130 L45 150', s: 6 }, gnd,
  ], { moods: ['feliz'] });
  A('erizo', 'ERIZO', /\b(erizos?|hedgehogs?|puercoespines?|porcupines?)\b/i, [
    { p: 'M-140 90 C-150 0 -60 -90 50 -80 C130 -70 160 10 140 90 Z', f: 1, ft: .9, s: 9 }, ...Array.from({ length: 14 }, (_, i) => { const a = -Math.PI + .3 + i * (Math.PI - .6) / 13; return { p: `M${(Math.cos(a) * 130 + 0).toFixed(0)} ${(90 + Math.sin(a) * 140 * .8).toFixed(0)} L${(Math.cos(a) * 175).toFixed(0)} ${(90 + Math.sin(a) * 190 * .8).toFixed(0)}`, s: 6 }; }),
    { p: 'M-140 90 C-190 90 -190 50 -150 50', f: 2, ft: .8, s: 8 }, eye(-165, 60), { c: [-186, 68, 6], f: 1, s: 0 }, { p: 'M-90 90 V110 M60 90 V110', s: 8 }, gnd,
  ], { moods: ['sereno', 'desafiante'] });
  A('hormiga', 'HORMIGA', /\b(hormigas?|ants?|hormiguero|anthill|colonia de hormigas|termitas?)\b/i, [
    { c: [-70, 0, 30], f: 1, ft: .9, s: 8 }, { c: [0, 0, 24], f: 1, ft: .9, s: 8 }, { e: [80, 10, 50, 36], f: 1, ft: .9, s: 8 }, eye(-80, -8, 4), { p: 'M-90 -20 L-110 -55 M-75 -25 L-80 -60', s: 4 },
    { p: 'M-10 15 L-30 60 M0 20 L0 65 M10 15 L30 60 M-5 -5 L-30 -50 M8 -6 L20 -45', s: 4 }, { p: 'M-190 60 H190', s: 0 }, { p: 'M-30 -50 C0 -60 30 -55 50 -40', s: 0 },
  ], { moods: ['oscuro', 'sereno'] });
  A('oruga', 'ORUGA', /\b(orugas?|caterpillars?|gusanos?|larvas?|capullo|cocoon|chrysalis)\b/i, [
    ...[0, 1, 2, 3, 4].map(i => ({ c: [-120 + i * 55, 50 - Math.sin(i * 1.2) * 20, 34], f: i % 2 ? 1 : 2, ft: .85, s: 8, m: 'bob', a: 4, ph: i * .5 })), { c: [150, 30, 38], f: 1, ft: .95, s: 9 }, eye(165, 22), { p: 'M140 -5 L130 -40 M160 -8 L172 -40', s: 5 },
    { p: 'M-190 130 H190', s: 8 }, { p: 'M0 130 C0 100 -30 80 -40 60', s: 0 },
  ], { moods: ['sereno', 'feliz'] });
})();
