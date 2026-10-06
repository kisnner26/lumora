// ============================================================
// riso-props-oficios.js — oficios y deportes (oleada 4 del catálogo). Ver riso-props-lib.js.
// ============================================================
(() => {
  const R = window.RISO; if (!R || !R.lib) return;
  const { add, L } = R.lib;
  const O = (id, label, rx, shapes, opt) => add(id, 'oficios', label, rx, shapes, opt);
  const D = (id, label, rx, shapes, opt) => add(id, 'deportes', label, rx, shapes, opt);
  const gnd = { p: 'M-190 170 H190', s: 8 };

  // ---------- oficios ----------
  O('medico', 'MÉDICO', /\b(m[eé]dic[oa]s?|doctor(es|a|as)?|doctors?|estetoscopio|stethoscope|cirujan[oa]s?|surgeons?|bata blanca|paciente|patient|enfermer[oa]s?|nurses?|consulta m[eé]dica)\b/i, [
    { p: 'M-70 -140 V-40 C-70 30 70 30 70 -40 V-140', s: 9 }, { p: 'M0 30 V80 C0 130 60 130 60 90', s: 9 }, { c: [60, 70, 24], f: 2, ft: .9, s: 9 }, { c: [60, 70, 8], f: -1, s: 4 }, { c: [-70, -145, 12], f: 1, s: 6 }, { c: [70, -145, 12], f: 1, s: 6 },
    { p: 'M-140 150 H140', s: 8 }, { p: 'M-120 -40 H-160 M-140 -60 V-20', s: 8, i: 2 },
  ], { moods: ['sereno'] });
  O('bombero', 'BOMBERO', /\b(bomberos?|firefighters?|firemen|fireman|casco de bombero|manguera|fire hose|fire truck|camion de bomberos)\b/i, [
    { p: 'M-110 20 C-110 -80 110 -80 110 20 Z', f: 1, ft: .9, s: 10 }, { p: 'M-140 20 H140 C140 40 -140 40 -140 20 Z', f: 1, ft: .9, s: 9 }, { p: 'M-50 -40 V-100 H50 V-40', s: 8, f: 2, ft: .9 }, { p: L.rect(-24, -80, 48, 34), f: -1, s: 5 }, { p: 'M0 -110 V-140', s: 7 },
    { p: 'M-30 90 C-90 90 -90 150 -30 150 M60 60 C130 90 130 150 60 170', s: 10, i: 2 }, { p: 'M90 80 C120 70 140 50 150 30', s: 5, i: 3, m: 'steam', a: 20 },
  ], { moods: ['rabioso'] });
  O('policia_placa', 'POLICÍA', /\b(polic[ií]as?|policemen|policeman|placa de polic[ií]a|sheriff|agente de polic[ií]a)\b/i, [
    { p: L.star(0, 0, 150, 6, .6), f: 2, ft: .85, s: 10 }, { c: [0, 0, 65], f: -1, s: 8 }, { p: L.star(0, 0, 40, 5, .45), f: 1, ft: .9, s: 5 }, ...Array.from({ length: 6 }, (_, i) => { const a = -Math.PI / 2 + i * Math.PI / 3; return { c: [Math.cos(a) * 150, Math.sin(a) * 150, 9], f: 1, s: 4 }; }),
  ], { moods: ['oscuro', 'desafiante'] });
  O('maestro', 'MAESTRO', /\b(maestr[oa]s?|profesor(es|a|as)?|teachers?|professors?|escuela|school|pizarr[oó]n|blackboard|alumnos?|homework)\b/i, [
    { p: L.rect(-160, -130, 320, 200), f: 3, ft: .8, s: 10 }, { p: 'M-130 -90 H-40 M-130 -60 H10 M-130 -30 H-60 M20 -90 L100 -20 M100 -90 L20 -20', s: 5, i: 1 }, { p: 'M-170 70 H170 V90 H-170 Z', f: 2, ft: .8, s: 8 }, { p: L.rect(-40, 55, 40, 15), f: -1, s: 5 }, { p: 'M80 150 V100 L150 30', s: 8 },
    { p: 'M-120 150 H0', s: 6 },
  ], { moods: ['nostalgico'] });
  O('cocinero', 'COCINERO', /\b(cocineros?|chefs?|cocinar|cooking|cocina|kitchen|restaurante|restaurant|receta|recipe|delantal|apron)\b/i, [
    { p: 'M-60 60 V-20 C-130 -20 -130 -120 -50 -110 C-40 -170 40 -170 50 -110 C130 -120 130 -20 60 -20 V60 Z', f: -1, s: 10 }, { p: 'M-60 20 H60', s: 5 }, { p: 'M-80 60 H80 V90 H-80 Z', f: 3, ft: .7, s: 8 },
    { p: 'M-150 170 L-150 120 H-70 L-60 170 Z', f: 3, ft: .6, s: 8 }, { p: 'M-150 120 L-190 90', s: 7 }, { p: 'M-110 100 C-120 70 -100 60 -110 30', s: 4, m: 'steam', a: 30 }, { p: 'M100 110 L170 170 M120 100 L190 150', s: 8 },
  ], { moods: ['feliz'] });
  O('piloto', 'PILOTO', /\b(pilotos?|pilots?|aviador(es)?|aviator|cabina|cockpit|capit[aá]n del avi[oó]n|aviaci[oó]n|aviation)\b/i, [
    { p: 'M-150 40 C-100 -40 -30 -60 0 -60 C30 -60 100 -40 150 40 Z', f: 1, ft: .85, s: 10 }, { p: 'M-40 -60 L0 -100 L40 -60', f: 2, ft: .9, s: 8 }, { p: 'M-190 60 C-140 20 -60 60 0 60 C60 60 140 20 190 60 C140 100 60 90 0 90 C-60 90 -140 100 -190 60 Z', f: -1, s: 9 }, { p: 'M-100 60 L-140 110 L-100 100 Z M100 60 L140 110 L100 100 Z', f: 2, ft: .9, s: 6 },
    { p: L.star(0, 60, 22, 5, .45), f: 2, ft: .95, s: 5 },
  ], { moods: ['euforico'] });
  O('astronauta', 'ASTRONAUTA', /\b(astronautas?|astronauts?|cosmonautas?|traje espacial|spacesuit|space suit|viaje espacial|space walk|caminata espacial)\b/i, [
    { c: [0, -60, 70], f: -1, s: 10 }, { p: 'M-50 -60 C-50 -100 50 -100 50 -60 C50 -20 -50 -20 -50 -60 Z', f: 3, ft: .8, s: 7 }, { p: 'M-30 -80 C-20 -90 0 -90 10 -85', s: 3 }, { p: 'M-60 20 H60 V130 H-60 Z', f: -1, s: 10 }, { p: 'M-60 40 L-120 90 M60 40 L120 90', s: 14 }, { p: 'M-40 130 V170 M40 130 V170', s: 14 }, { c: [0, 70, 12], f: 2, ft: .95, s: 5 },
    { p: L.star(-140, -120, 10, 4, .4), f: 2, s: 3, m: 'pulse', a: .5, o: [-140, -120] },
  ], { moods: ['sereno', 'euforico'] });
  O('pintor', 'PINTOR', /\b(pintor(es|a|as)?|painters?|paleta de colores|color palette|lienzo|caballete|easel|pintar|painting|cuadro)\b/i, [
    { p: 'M-150 20 C-170 -60 -80 -130 40 -120 C160 -110 170 -10 110 30 C90 45 60 20 40 40 C20 60 50 120 0 130 C-70 140 -130 100 -150 20 Z', f: -1, s: 10 }, { c: [-90, -10, 20], f: 1, ft: .95, s: 6 }, { c: [-40, -60, 20], f: 2, ft: .95, s: 6 }, { c: [30, -70, 20], f: 3, ft: .9, s: 6 }, { c: [90, -30, 20], f: 1, ft: .7, s: 6 }, { c: [0, 80, 18], s: 6 },
    { p: 'M60 130 L190 -60', s: 9 }, { p: 'M190 -60 L170 -110 L150 -95 L180 -50 Z', f: 2, ft: .95, s: 6 },
  ], { moods: ['romantico', 'nostalgico'] });
  O('carpintero', 'CARPINTERO', /\b(carpinter[oa]s?|carpenters?|sierra|saws?|serrucho|madera|woodwork|clavo|nails|taladro|drill)\b/i, [
    { p: 'M-170 40 L-40 -40 L170 -40 V20 L-40 20 L-90 80 Z', f: 3, ft: .6, s: 9 }, ...Array.from({ length: 12 }, (_, i) => ({ p: `M${-120 + i * 24} 20 L${-108 + i * 24} 45 L${-96 + i * 24} 20`, s: 3 })), { p: 'M-40 -40 L-90 -110 H-40 L60 -40', f: 2, ft: .85, s: 9 }, { p: 'M-90 80 L-100 120', s: 8 },
    { p: 'M100 100 H190 M110 90 V120 M170 90 V120', s: 8 }, { p: 'M-190 170 H190', s: 8 },
  ], { moods: ['nostalgico'] });
  O('albanil', 'ALBAÑIL', /\b(alba[nñ]iles?|bricklayers?|constructor(es|a|as)?|builders?|obreros?|construcci[oó]n|construction|casco de obra|hard hat|andamio|scaffold|cemento|cement)\b/i, [
    { p: 'M-140 -10 C-140 -90 140 -90 140 -10 Z', f: 2, ft: .9, s: 10 }, { p: 'M-170 -10 H170', s: 10 }, { p: 'M-30 -90 V-10 M0 -95 V-10 M30 -90 V-10', s: 4 }, { p: 'M-170 40 H-110 V170 H-170 M170 40 H110 V170 H170', s: 0 },
    { p: 'M-110 60 H110 V100 H-110 Z', f: 3, ft: .6, s: 8 }, { p: 'M-110 100 H110 V140 H-110 Z', f: 2, ft: .8, s: 8 }, { p: 'M-40 60 V100 M40 100 V140 M-20 100 V140', s: 4 }, { p: 'M90 160 L150 100 L170 120 L120 170 Z', f: -1, s: 6 },
  ], { moods: ['nostalgico'] });
  O('mecanico', 'MECÁNICO', /\b(mec[aá]nic[oa]s?|mechanics?|taller mec[aá]nico|garage|llave inglesa|wrench|tuerca|nut and bolt|tornillo|screw|engranaje|gears)\b/i, [
    { p: 'M-170 150 L-50 30 C-90 -10 -60 -80 -10 -70 L-20 -40 L10 -20 L40 -40 C60 10 20 60 -10 50 L-140 170 Z', f: 3, ft: .7, s: 10 }, { c: [90, -30, 60], f: 2, ft: .85, s: 10, m: 'spin', a: .5, o: [90, -30] }, ...Array.from({ length: 8 }, (_, i) => { const a = i / 8 * Math.PI * 2; return { p: L.rect(90 + Math.cos(a) * 60 - 8, -30 + Math.sin(a) * 60 - 8, 16, 16), f: 2, ft: .9, s: 5, m: 'spin', a: .5, o: [90, -30] }; }), { c: [90, -30, 20], f: -1, s: 6, m: 'spin', a: .5, o: [90, -30] },
  ], { moods: ['oscuro'] });
  O('electricista', 'ELECTRICISTA', /\b(electricistas?|electricians?|alicates|pliers|corto ?circuito|short circuit|cable pelado|voltios|volts)\b/i, [
    { p: 'M-60 -170 L-100 20 L-10 -10 L-40 100 L60 -50 L-20 -30 L30 -170 Z', f: 2, ft: .95, s: 9, m: 'beat', a: .05, o: [0, 0] }, { p: 'M40 60 L150 150 M60 40 L170 130', s: 8 }, { p: 'M140 130 C170 110 190 130 170 160 Z', f: 1, ft: .9, s: 6 }, { p: 'M-140 -100 L-170 -120 M-150 -60 L-190 -60', s: 4, m: 'pulse', a: .3, v: 4, o: [-120, -80] },
  ], { moods: ['rabioso'] });
  O('soldado', 'SOLDADO', /\b(soldados?|soldiers?|militar(es)?|military|guerra|ej[eé]rcito|army|batall[oó]n|battle|trinchera|trench|fusil|rifle|veterano|veteran)\b/i, [
    { p: 'M-130 20 C-130 -90 130 -90 130 20 Z', f: 1, ft: .8, s: 10 }, { p: 'M-160 20 H160 C160 40 -160 40 -160 20 Z', f: 1, ft: .8, s: 9 }, { p: 'M-40 -30 L-10 -60 L20 -30 L60 -50', s: 5, i: 3 }, { p: L.star(0, -30, 20, 5, .45), f: 2, ft: .95, s: 5 },
    { p: 'M-190 130 H190', s: 8 }, { p: 'M-50 130 V90 H50 V130', s: 7 }, { p: 'M-70 80 C-70 60 70 60 70 80', s: 6 },
  ], { moods: ['oscuro', 'rabioso'] });
  O('abogado', 'ABOGADO', /\b(abogad[oa]s?|lawyers?|attorneys?|juez(es)?|judges?|tribunal|court|juicio|sentencia|verdict|justicia|justice|mazo|gavel|testigo)\b/i, [
    { p: L.rr(-90, -100, 180, 70, 16), f: 2, ft: .85, s: 10, m: 'beat', a: .03, o: [0, -65] }, { p: 'M-50 -60 V-30 M50 -60 V-30', s: 8 }, { p: 'M0 -30 L60 130 L40 140 L-20 -20', f: 3, ft: .7, s: 8 }, { p: L.rr(-80, 130, 160, 30, 8), f: 1, ft: .9, s: 8 }, { p: 'M-140 170 H140', s: 8 },
    { p: 'M110 -60 L140 -90 M130 -20 L170 -30 M-110 -60 L-140 -90', s: 4, m: 'pulse', a: .3, v: 3, o: [0, -60] },
  ], { moods: ['desafiante', 'oscuro'] });
  O('microscopio', 'CIENTÍFICO', /\b(cient[ií]fic[oa]s?|scientists?|microscopio|microscope|laboratorio|laboratory|laboratory|experimento|investigador|researcher|qu[ií]mica|chemistry|f[ií]sica|physics|biolog[ií]a|biology)\b/i, [
    { p: 'M-30 -150 L20 -170 L50 -100 L0 -80 Z', f: 3, ft: .8, s: 9 }, { p: 'M20 -80 L40 -20 M-10 -90 L50 -30', s: 8 }, { p: 'M-70 -20 C-100 40 -60 110 20 110 C90 110 100 60 80 20', s: 12 }, { p: 'M-80 130 H110 V150 H-80 Z', f: 1, ft: .9, s: 8 }, { p: 'M-130 170 H150', s: 8 },
    { p: L.circ ? '' : 'M0 0', s: 0 }, { c: [120, -60, 18], f: -1, s: 6, m: 'bob', a: 6 }, { c: [-130, 20, 12], f: 2, ft: .9, s: 5, m: 'bob', a: 5, ph: 1 },
  ], { moods: ['sereno'] });
  O('detective', 'DETECTIVE', /\b(detective|detectives|investigador privado|private eye|gabardina|trench coat|sherlock|holmes|caso sin resolver|cold case|sospechoso|suspect)\b/i, [
    { p: 'M-140 20 L-90 -50 L-40 -60 L0 -80 L40 -60 L90 -50 L140 20 Z', f: 3, ft: .7, s: 10 }, { p: 'M-190 20 H190', s: 9 }, { p: 'M-40 -60 H40', s: 6, i: 2 }, { p: 'M-110 20 L-140 150 H140 L110 20', s: 0 },
    { c: [80, 90, 44], f: -1, s: 9 }, { p: 'M112 122 L170 175', s: 12 }, { c: [80, 90, 20], s: 3, i: 2 },
  ], { moods: ['oscuro'] });
  O('mago', 'MAGO', /\b(mag[oa]s?|magicians?|wizards?|hechicer[oa]s?|varita|wand|truco de magia|magic trick|abracadabra|ilusionista|illusionist|sombrero de copa|top hat|conejo del sombrero)\b/i, [
    { p: 'M-70 60 L-60 -100 H60 L70 60 Z', f: 1, ft: .95, s: 10 }, { p: 'M-110 60 H110 C110 80 -110 80 -110 60 Z', f: 1, ft: .95, s: 9 }, { p: 'M-64 -20 H64', f: 2, ft: .95, s: 8 },
    { p: 'M-40 -100 C-70 -170 -20 -190 -15 -120 M15 -110 C30 -170 70 -180 45 -110', f: -1, s: 8, m: 'sway', a: .05, o: [0, -100] }, { p: 'M80 130 L170 60', s: 8 }, { p: L.star(170, 55, 16, 5, .45), f: 2, ft: .95, s: 4, m: 'pulse', a: .3, o: [170, 55] }, { p: L.star(-130, 100, 12, 4, .4), f: 3, s: 3, m: 'pulse', a: .5, o: [-130, 100] },
  ], { moods: ['euforico', 'romantico'] });
  O('payaso', 'PAYASO', /\b(payas[oa]s?|clowns?|circo|circus|arlequ[ií]n|harlequin|malabares|juggling|acr[oó]bata|acrobat|trapecio|trapeze)\b/i, [
    { c: [0, 0, 90], f: -1, s: 10 }, { c: [0, 10, 26], f: 1, ft: .95, s: 8 }, { p: 'M-50 -20 C-70 -40 -60 -60 -40 -50 M50 -20 C70 -40 60 -60 40 -50', s: 6 }, { c: [-40, -20, 8], f: 1, s: 0 }, { c: [40, -20, 8], f: 1, s: 0 }, { p: 'M-40 50 C-20 75 20 75 40 50', s: 8, i: 2 },
    { p: 'M-90 -20 C-160 -60 -150 -130 -100 -110 M90 -20 C160 -60 150 -130 100 -110', f: 2, ft: .9, s: 8 }, { p: 'M-60 -80 L0 -150 L60 -80 Z', f: 3, ft: .8, s: 8 }, { c: [0, -155, 12], f: 1, s: 6 },
  ], { moods: ['feliz', 'euforico'] });
  O('pescador', 'PESCADOR', /\b(pescador(es|a|as)?|fishermen|fisherman|fishing|pescar|ca[nñ]a de pescar|fishing rod|anzuelo|red de pesca|fishing net|carnada|bait)\b/i, [
    { p: 'M-170 170 L60 -140', s: 9 }, { p: 'M60 -140 C130 -150 170 -100 170 -40 V60', s: 3 }, { p: 'M170 60 C170 100 140 100 140 70', s: 6 }, { p: 'M140 70 L130 60', s: 5 }, { p: 'M-190 130 C-120 110 -60 140 0 130 C60 120 120 140 190 125 V175 H-190 Z', f: 3, ft: .5, s: 6, m: 'drift', a: 8 },
    { p: 'M100 150 C120 130 150 130 170 150 C150 170 120 170 100 150 Z', f: 2, ft: .9, s: 7 }, { p: 'M170 150 L190 135 V165 Z', f: 2, ft: .9, s: 6 },
  ], { moods: ['sereno'] });
  O('timon', 'TIMÓN', /\b(tim[oó]n|helm|rueda del barco|ship'?s wheel|capit[aá]n de barco|captain|marinero|sailor|navegante|navigator)\b/i, [
    { c: [0, 0, 100], f: 2, ft: .7, s: 12, m: 'spin', a: .1, o: [0, 0] }, { c: [0, 0, 30], f: 1, ft: .9, s: 9 }, ...Array.from({ length: 8 }, (_, i) => { const a = i / 8 * Math.PI * 2; return { p: `M${(Math.cos(a) * 30).toFixed(0)} ${(Math.sin(a) * 30).toFixed(0)} L${(Math.cos(a) * 170).toFixed(0)} ${(Math.sin(a) * 170).toFixed(0)}`, s: 10, m: 'spin', a: .1, o: [0, 0] }; }),
  ], { moods: ['nostalgico', 'sereno'] });
  O('minero', 'MINERO', /\b(mineros?|miners?|carb[oó]n|coal|pico y pala|pickaxe|excavar|oro y plata|gold rush|cantera)\b/i, [
    { p: 'M-110 -10 C-110 -90 110 -90 110 -10 Z', f: 2, ft: .85, s: 10 }, { p: 'M-130 -10 H130', s: 9 }, { c: [0, -50, 22], f: -1, s: 8 }, { c: [0, -50, 8], f: 2, ft: .95, s: 0, m: 'pulse', a: .4, o: [0, -50], v: 2 }, { p: 'M0 -50 L-60 60 H60 Z', f: 2, ft: .2, s: 0 },
    { p: 'M-20 170 L60 50 M10 40 C50 30 100 50 120 80 M10 40 C-30 30 -80 50 -100 80', s: 10 },
  ], { moods: ['oscuro'] });
  O('barbero', 'BARBERO', /\b(barberos?|barbers?|barber[ií]a|barbershop|peluquer[ií]a|hair salon|peluquer[oa]s?|hairdresser|corte de pelo|haircut|navaja|razor|afeitar|shave)\b/i, [
    { p: L.rr(-40, -130, 80, 260, 20), f: -1, s: 10 }, ...[-90, -30, 30, 90].map(y => ({ p: `M-40 ${y} L40 ${y - 40}`, s: 12, i: y % 60 ? 2 : 1, m: 'drift', a: 0 })), { p: 'M-50 -140 H50 M-50 140 H50', s: 10 }, { c: [0, -160, 16], f: 2, ft: .9, s: 6 }, { c: [0, 160, 16], f: 2, ft: .9, s: 6 },
    { p: 'M-190 -40 L-110 -40 L-100 -70 L-130 -70 Z', f: 3, ft: .8, s: 6 }, { p: 'M110 30 C160 0 180 40 150 60 L110 60 Z', f: 1, ft: .9, s: 6 },
  ], { moods: ['nostalgico'] });
  O('panadero', 'PANADERO', /\b(panaderos?|bakers?|panader[ií]a|bakery|horno|oven|hornear|bake|amasar|knead|harina|flour|masa|dough)\b/i, [
    { p: 'M-150 60 H150 V150 H-150 Z', f: 3, ft: .6, s: 10 }, { p: 'M-120 60 V-20 C-120 -80 120 -80 120 -20 V60', s: 9 }, { p: L.rr(-90, 80, 180, 50, 12), f: 2, ft: .5, s: 6 }, { p: 'M-60 -50 H60', s: 4 },
    { p: 'M-70 40 C-70 0 70 0 70 40 Z', f: 2, ft: .85, s: 8 }, { p: 'M-20 20 L-10 40 M20 20 L30 40', s: 4 }, { p: 'M-60 -100 C-80 -130 -40 -140 -60 -170 M0 -110 C-20 -140 20 -150 0 -180 M60 -100 C40 -130 80 -140 60 -170', s: 5, m: 'steam', a: 30 },
  ], { moods: ['nostalgico', 'feliz'] });
  O('dentista', 'DENTISTA', /\b(dentistas?|dentists?|muela|molar|tooth|teeth|dientes|caries|cavity|ortodoncia|braces|sonrisa perfecta)\b/i, [
    { p: 'M-90 -100 C-90 -150 -30 -150 0 -110 C30 -150 90 -150 90 -100 C90 -30 60 20 60 100 C60 150 40 160 30 130 C20 90 10 60 0 60 C-10 60 -20 90 -30 130 C-40 160 -60 150 -60 100 C-60 20 -90 -30 -90 -100 Z', f: -1, s: 10 }, { p: 'M-60 -100 C-40 -80 40 -80 60 -100', s: 5 },
    { p: L.star(110, -110, 18, 4, .4), f: 2, ft: .95, s: 5, m: 'pulse', a: .3, o: [110, -110] }, { p: 'M-140 110 L-100 40', s: 8 }, { p: 'M-100 40 L-80 20 L-60 45 Z', f: 3, ft: .8, s: 6 },
  ], { moods: ['feliz'] });
  O('cartero', 'CARTERO', /\b(carteros?|mail ?man|mailmen|postal|post office|oficina de correos|paquete|package|parcel|encomienda|delivery|repartidor|courier)\b/i, [
    { p: 'M-120 -20 H120 V130 H-120 Z', f: 2, ft: .8, s: 10 }, { p: 'M-120 -20 C-120 -80 120 -80 120 -20', s: 9 }, { p: 'M-30 -20 V130 M30 -20 V130', s: 4 }, { p: L.rect(-50, 40, 100, 50), f: -1, s: 7 }, { p: 'M-50 60 L0 90 L50 60', s: 5 }, { p: 'M-140 -110 C-100 -150 100 -150 140 -110', s: 9, i: 3 },
  ], { moods: ['nostalgico'] });
  O('bailarina', 'BAILARINA', /\b(bailarin(es|a|as)?|dancers?|ballet|zapatillas de ballet|ballerinas?|danza|dancing shoes|tut[uú])\b/i, [
    { p: 'M-70 20 C-130 10 -150 60 -110 90 C-90 105 -70 90 -70 70 C-40 50 -10 50 20 70 C30 90 70 100 100 80 C140 60 120 20 70 20 Z', f: 2, ft: .85, s: 9 }, { p: 'M-70 20 C-20 -10 30 -10 70 20', s: 6 }, { p: 'M-30 70 C-10 95 30 95 50 70', s: 4 },
    { p: 'M-30 -50 C-30 -110 30 -110 30 -50 C30 -20 -30 -20 -30 -50 Z', f: 3, ft: .6, s: 8 }, { p: 'M-90 150 C-30 170 30 170 90 150', s: 7, m: 'drift', a: 8 }, { p: 'M0 -120 V-160 M-10 -150 H10', s: 5 },
  ], { moods: ['romantico', 'sereno'] });
  O('pirata', 'PIRATA', /\b(pirat(as?|es)|pirates?|parche|eyepatch|tesoro pirata|pirate ship|jolly roger|calavera pirata|corsario|buccaneer|capit[aá]n garfio)\b/i, [
    { p: 'M-130 0 C-130 -110 130 -110 130 0 Z', f: 1, ft: .95, s: 10 }, { p: 'M-40 -60 C-40 -90 40 -90 40 -60', s: 0 }, { c: [0, -50, 22], f: -1, s: 8 }, { p: 'M-16 -40 L-8 -30 M16 -40 L8 -30', s: 0 }, { p: 'M-90 30 L90 130 M90 30 L-90 130', s: 12, i: 1 }, { c: [0, 50, 40], f: -1, s: 9 }, { c: [-14, 44, 9], f: 1, s: 0 }, { c: [14, 44, 9], f: 1, s: 0 }, { p: 'M-14 70 H14', s: 5 },
    { p: 'M-40 0 H40', s: 0 },
  ], { moods: ['desafiante', 'oscuro'] });
  O('arquitecto', 'ARQUITECTO', /\b(arquitect[oa]s?|architects?|planos?|blueprints?|dise[nñ]ador de edificios|regla y comp[aá]s|compass and ruler|ingenier[oa]s?|engineers?|maqueta)\b/i, [
    { p: L.rect(-160, -120, 320, 240), f: 3, ft: .5, s: 9 }, { p: 'M-130 -90 H130 M-130 -60 H130 M-130 -30 H130 M-130 0 H130 M-130 30 H130 M-130 60 H130 M-130 90 H130 M-100 -120 V120 M-60 -120 V120 M-20 -120 V120 M20 -120 V120 M60 -120 V120 M100 -120 V120', s: 1, i: 1 },
    { p: 'M-90 60 V-20 L-20 -80 L50 -20 V60 Z', s: 8, i: 2 }, { p: 'M-40 60 V20 H0 V60', s: 6, i: 2 }, { p: 'M60 130 L130 -40', s: 9 }, { p: 'M130 -40 L145 -85 L125 -50', f: 2, s: 4 },
  ], { moods: ['sereno'] });
  O('jardinero', 'JARDINERO', /\b(jardiner[oa]s?|gardeners?|jard[ií]n|garden|regadera|watering can|sembrar|sow|planting|huerto|orchard|maceta|flower pot)\b/i, [
    { p: 'M-90 -10 H70 L60 100 C50 120 -70 120 -80 100 Z', f: 3, ft: .6, s: 10 }, { p: 'M70 20 L150 -50 H170', s: 9 }, { p: 'M150 -50 L190 -70 L190 -20 Z', f: 3, ft: .8, s: 6 }, { p: 'M-90 -10 C-100 -30 -110 -40 -120 -30', s: 7 }, ...[[170, 20], [150, 40], [190, 45], [165, 65]].map(([x, y], i) => ({ c: [x, y, 4], f: -1, s: 3, m: 'fall', a: 40, ph: i * .25 })),
    { p: 'M-190 170 H190', s: 8 }, { p: 'M-130 170 V100 M-130 100 C-160 90 -150 70 -130 80 C-110 70 -100 90 -130 100', s: 6, f: 1 },
  ], { moods: ['sereno', 'feliz'] });
  O('sastre', 'SASTRE', /\b(sastres?|tailors?|costurer[oa]s?|seamstress|m[aá]quina de coser|sewing machine|coser|sew|aguja e hilo|needle and thread|dobladillo|hem)\b/i, [
    { p: 'M-60 -150 C-80 -100 -80 100 -60 150', s: 6 }, { p: 'M-40 -160 L40 40', s: 5 }, { c: [-40, -160, 6], s: 4 }, { p: 'M40 40 C60 60 30 80 60 110 C90 140 60 160 80 170', s: 6, i: 2, m: 'sway', a: .03, o: [40, 40] },
    { p: 'M-190 -80 L-110 -20 M-190 -20 L-110 -80', s: 8 }, { c: [-190, -100, 12], s: 8 }, { p: 'M40 -100 H160 V-40 H40 Z', f: 3, ft: .7, s: 7 }, { p: 'M50 -85 H150 M50 -70 H120 M50 -55 H140', s: 2 },
  ], { moods: ['nostalgico'] });

  // ---------- deportes ----------
  D('porteria', 'PORTERÍA', /\b(porter[ií]a|goal post|arco de f[uú]tbol|f[uú]tbol|soccer|football|gol(es)?|penal(ti)?|penalty|estadio|stadium)\b/i, [
    { p: 'M-170 150 V-90 H170 V150', s: 12 }, ...[-130, -90, -50, -10, 30, 70, 110, 150].map(x => ({ p: `M${x} -90 V150`, s: 2 })), ...[-50, 0, 50, 100].map(y => ({ p: `M-170 ${y} H170`, s: 2 })), { c: [-40, 120, 36], f: -1, s: 8, m: 'bob', a: 4 }, { p: L.star(-40, 120, 14, 5, .5), f: 1, ft: .9, s: 3 }, { p: 'M-190 170 H190', s: 8 },
  ], { moods: ['euforico'] });
  D('canasta', 'CANASTA', /\b(canasta|basket|baloncesto|basketball|b[aá]squet(bol)?|nba|encestar|dunk|clavada|tiro triple|three pointer)\b/i, [
    { p: L.rect(-100, -160, 200, 130), f: -1, s: 10 }, { p: L.rect(-40, -100, 80, 60), s: 8, i: 2 }, { p: 'M-50 -30 H50', s: 10, i: 2 }, { p: 'M-50 -30 L-30 60 M-25 -30 L-15 60 M0 -30 V60 M25 -30 L15 60 M50 -30 L30 60 M-40 20 H40', s: 3 },
    { c: [0, 120, 40], f: 2, ft: .85, s: 9, m: 'fall', a: -80 }, { p: 'M-40 120 H40 M0 80 V160', s: 3 },
  ], { moods: ['euforico'] });
  D('beisbol', 'BÉISBOL', /\b(b[eé]isbol|baseball|home run|jonr[oó]n|softball|grandes ligas|major league|pitcher|lanzador|catcher)\b/i, [
    { p: 'M-160 150 L60 -60 L100 -20 L-120 190 Z', f: 2, ft: .8, s: 10 }, { c: [100, 90, 50], f: -1, s: 10 }, { p: 'M70 60 C90 80 90 100 70 120 M130 60 C110 80 110 100 130 120', s: 3, i: 2 }, { p: 'M60 -60 L90 -90 L110 -70 L100 -20 Z', f: 2, ft: .9, s: 7 },
    { p: 'M120 30 L160 -20 M150 60 L190 40', s: 5, m: 'pulse', a: .3, v: 4, o: [120, 40] },
  ], { moods: ['nostalgico', 'euforico'] });
  D('tenis_raqueta', 'TENIS', /\b(tenis|tennis|raquetas?|rackets?|racquet|pelota de tenis|tennis ball|cancha de tenis)\b/i, [
    { e: [-30, -50, 70, 90, -.4], f: -1, s: 10 }, ...[-40, -20, 0, 20, 40].map(x => ({ p: `M${x - 30} -120 L${x - 10} 20`, s: 2 })), ...[-90, -60, -30, 0].map(y => ({ p: `M-90 ${y - 20} L30 ${y + 10}`, s: 2 })), { p: 'M10 40 L110 140', s: 12 }, { p: 'M100 130 L130 160', f: 1, s: 8 },
    { c: [110, -100, 24], f: 2, ft: .95, s: 8, m: 'bob', a: 10 }, { p: 'M95 -110 C105 -95 115 -95 125 -110', s: 3 },
  ], { moods: ['sereno', 'euforico'] });
  D('nadador', 'NADADOR', /\b(nadadores?|swimmers?|nataci[oó]n|swimming|nadar|swim|piscina|swimming pool|trampol[ií]n)\b/i, [
    { p: 'M-190 60 C-140 40 -100 80 -50 60 C0 40 40 80 90 60 C130 45 160 70 190 55 V170 H-190 Z', f: 3, ft: .5, s: 8, m: 'drift', a: 8 }, { c: [-60, 20, 24], f: 1, ft: .95, s: 8 }, { p: 'M-40 40 L60 50 M-30 30 L-110 -40 M60 50 L110 60', s: 10 }, { p: 'M-90 60 C-70 20 -30 20 -10 60', s: 0 },
    { c: [-130, -60, 6], s: 3, m: 'fall', a: 70 }, { c: [140, 10, 5], s: 3, m: 'fall', a: 50 },
  ], { moods: ['sereno', 'feliz'] });
  D('guantes_boxeo', 'BOXEO', /\b(boxeo|boxing|boxeador(es)?|boxers?|guantes de boxeo|boxing gloves?|cuadril[aá]tero|nocaut|knockout|pelea de box)\b/i, [
    { p: 'M-140 60 V-10 C-140 -70 -100 -90 -50 -80 C0 -70 20 -20 -10 30 V100 H-130 Z', f: 1, ft: .9, s: 10 }, { p: 'M-130 60 H-10', s: 6 }, { p: 'M20 90 V40 C20 -20 60 -40 110 -30 C160 -20 180 30 150 80 V130 H30 Z', f: 2, ft: .9, s: 10 }, { p: 'M30 90 H150', s: 6 },
    { p: 'M-190 170 H190', s: 8 }, { p: 'M-160 -60 L-190 -90 M170 -70 L190 -100', s: 4, m: 'pulse', a: .3, v: 4, o: [0, 0] },
  ], { moods: ['rabioso', 'desafiante'] });
  D('esqui', 'ESQUÍ', /\b(esqu[ií](ar)?|ski|skiing|esquiador|skier|snowboard|pista de esqu[ií]|slope)\b/i, [
    { p: 'M-190 -60 L190 80 V170 H-190 Z', f: -1, s: 9 }, { p: 'M-90 -20 L100 80', s: 6, i: 2 }, { p: 'M-70 -60 L60 40 M-90 -30 L40 70', s: 8, i: 1 }, { c: [-40, -60, 16], f: 1, ft: .95, s: 8 }, { p: 'M-40 -44 L-10 20 L30 40 M-30 -30 L-70 -10 M-10 20 L-30 70', s: 8 },
    { p: 'M110 -20 L130 -60 L150 -20 Z', f: 1, ft: .8, s: 6 },
  ], { moods: ['euforico', 'sereno'] });
  D('surf', 'SURF', /\b(surf|surfing|surfista|surfers?|tabla de surf|surfboard|olas para surfear|hang ten)\b/i, [
    { p: 'M-90 150 C-100 60 -30 -60 30 -120 C70 -50 70 60 30 150 C0 170 -70 170 -90 150 Z', f: 2, ft: .85, s: 10 }, { p: 'M-60 100 C-20 30 20 -40 50 -110', s: 4, i: 1 }, { p: 'M-190 150 C-130 110 -60 170 0 150 C60 130 130 170 190 140 V180 H-190 Z', f: 3, ft: .55, s: 7, m: 'drift', a: 8 },
    { c: [120, -80, 30], f: 2, ft: .9, s: 6, m: 'pulse', a: .05, o: [120, -80] },
  ], { moods: ['feliz', 'euforico'] });
  D('voleibol', 'VOLEIBOL', /\b(voleibol|volleyball|voley|v[oó]ley|red de voleibol|voley playa|beach volley)\b/i, [
    { p: 'M-190 -20 H190 V70 H-190 Z', f: -1, s: 8 }, ...[-170, -130, -90, -50, -10, 30, 70, 110, 150, 180].map(x => ({ p: `M${x} -20 V70`, s: 2 })), { p: 'M-190 20 H190', s: 2 }, { p: 'M-170 -20 V150 M170 -20 V150', s: 10 }, { c: [0, -100, 44], f: -1, s: 9, m: 'bob', a: 10 }, { p: 'M-40 -100 C-20 -70 20 -70 40 -100 M0 -144 C-20 -110 -20 -90 0 -56', s: 4 },
    { p: 'M-190 170 H190', s: 8 },
  ], { moods: ['feliz', 'euforico'] });
  D('pesas', 'PESAS', /\b(pesas?|weights?|gimnasio|gym|mancuernas?|dumbbells?|barbell|halterofilia|weightlifting|entrenar|workout|levantar pesas|bodybuilding)\b/i, [
    { p: 'M-150 0 H150', s: 14 }, { p: L.rr(-140, -70, 40, 140, 8), f: 1, ft: .9, s: 10 }, { p: L.rr(-190, -40, 40, 80, 8), f: 2, ft: .9, s: 9 }, { p: L.rr(100, -70, 40, 140, 8), f: 1, ft: .9, s: 10 }, { p: L.rr(150, -40, 40, 80, 8), f: 2, ft: .9, s: 9 },
    { p: 'M-40 -110 L0 -150 L40 -110', s: 6, m: 'bob', a: 8 }, { p: 'M-190 170 H190', s: 8 },
  ], { moods: ['desafiante', 'rabioso'] });
  D('golf_hoyo', 'GOLF', /\b(golf|golfista|golfer|hoyo en uno|hole in one|campo de golf|golf course|caddie|birdie)\b/i, [
    { p: 'M-190 130 C-100 100 100 100 190 130 V170 H-190 Z', f: 1, ft: .7, s: 9 }, { e: [0, 118, 40, 10], f: 1, ft: .95, s: 7 }, { p: 'M0 118 V-100', s: 8 }, { p: 'M0 -100 L80 -75 L0 -50 Z', f: 2, ft: .95, s: 7, m: 'sway', a: .08, o: [0, -75] }, { c: [-90, 100, 14], f: -1, s: 7 }, { p: 'M-130 130 L-60 60', s: 0 },
  ], { moods: ['sereno'] });
  D('ajedrez', 'AJEDREZ', /\b(ajedrez|chess|jaque mate|checkmate|tablero de ajedrez|chessboard|peones?|pawns?|reina y rey|caballo y torre|gambito|gambit)\b/i, [
    ...[0, 1, 2, 3, 4, 5].flatMap(r => [0, 1, 2, 3, 4, 5].map(c => (r + c) % 2 ? { p: L.rect(-150 + c * 50, 20 + r * 25, 50, 25), f: 1, ft: .85, s: 2 } : null)).filter(Boolean), { p: L.rect(-150, 20, 300, 150), s: 8 },
    { p: 'M-20 20 V-60 C-50 -80 -40 -110 0 -110 C40 -110 50 -80 20 -60 V20 Z', f: -1, s: 9 }, { p: 'M-30 20 H30', s: 8 }, { p: 'M0 -110 V-150 M-15 -135 H15', s: 6 },
  ], { moods: ['oscuro', 'desafiante'] });
  D('meta_carrera', 'META', /\b(carrera|running|correr|maratones?|marathon|atletismo|athletics|l[ií]nea de meta|finish line|sprint|corredor(es)?|runners?|jogging)\b/i, [
    { p: 'M-190 150 C-100 130 100 130 190 150 V180 H-190 Z', f: 2, ft: .55, s: 8 }, { p: 'M-140 130 V-90 M140 130 V-90', s: 10 }, { p: L.rect(-140, -90, 280, 50), s: 8 }, ...Array.from({ length: 14 }, (_, i) => ({ p: L.rect(-140 + i * 20, -90 + (i % 2) * 25, 20, 25), f: 1, ft: .95, s: 0 })),
    { p: 'M-190 60 H-140 M-190 90 H-150', s: 4, m: 'drift', a: 20 }, { c: [0, 60, 20], f: 2, ft: .9, s: 8 }, { p: 'M0 80 L-20 130 M0 80 L20 130 M0 60 L-30 90 M0 60 L30 40', s: 7 },
  ], { moods: ['euforico', 'desafiante'] });
  D('gimnasta', 'GIMNASIA', /\b(gimnasta|gymnast|gimnasia|gymnastics|cinta de gimnasia|ribbon dance|barra de equilibrio|balance beam|acrobacia|acrobatics|yoga|pilates|estiramiento|stretching)\b/i, [
    { p: 'M-130 60 H130', s: 9 }, { c: [0, -60, 22], f: 1, ft: .95, s: 8 }, { p: 'M0 -38 V20 M0 -20 L-70 -60 M0 -20 L70 -60 M0 20 L-30 60 M0 20 L40 50', s: 9 }, { p: 'M70 -60 C110 -100 150 -40 120 -20 C90 0 130 40 170 20', s: 4, i: 2, m: 'sway', a: .1, o: [70, -60] },
    { p: 'M-190 150 H190', s: 8 },
  ], { moods: ['sereno', 'feliz'] });
})();
