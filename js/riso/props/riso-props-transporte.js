// ============================================================
// riso-props-transporte.js — vehículos (oleada 3 del catálogo). Ver riso-props-lib.js.
// ============================================================
(() => {
  const R = window.RISO; if (!R || !R.lib) return;
  const { add, L } = R.lib, C = 'transporte';
  const A = (id, label, rx, shapes, opt) => add(id, C, label, rx, shapes, opt);
  const wheel = (x, y, r = 28) => [{ c: [x, y, r], f: 1, ft: .95, s: 9, m: 'spin', a: 3, o: [x, y] }, { c: [x, y, r * .4], f: -1, s: 5 }, { p: `M${x - r * .8} ${y} H${x + r * .8} M${x} ${y - r * .8} V${y + r * .8}`, s: 3, m: 'spin', a: 3, o: [x, y] }];
  const gnd = { p: 'M-190 150 H190', s: 8 };

  A('avion', 'AVIÓN', /\b(avi[oó]n(es)?|avi[oó]n|airplanes?|jets?|aeropuerto|airport|aterrizar|despegar|takeoff|landing|volar en avi[oó]n)\b/i, [
    { p: 'M-190 10 C-100 -30 100 -30 170 -5 C190 0 190 20 170 25 C100 40 -100 40 -190 10 Z', f: -1, s: 9 }, { p: 'M-20 25 L-90 110 L-50 110 L40 30 Z M-20 -10 L-80 -100 L-40 -100 L40 -14 Z', f: 3, ft: .8, s: 8 }, { p: 'M-180 10 L-200 -50 L-160 -50 L-120 0', f: 2, ft: .9, s: 8 },
    ...[-60, -20, 20, 60, 100].map(x => ({ c: [x, 5, 6], f: 3, s: 4 })), { p: 'M-190 150 C-120 140 -60 160 0 150', s: 4, i: 3, m: 'drift', a: 20 },
  ], { moods: ['euforico', 'nostalgico'] });
  A('barco', 'BARCO', /\b(barcos?|ships?|boats?|navíos?|crucero|cruise|ferry|buques?|nav[ií]o|marinero|sailor|puerto|harbou?r)\b/i, [
    { p: 'M-170 20 H170 L120 100 H-110 Z', f: 1, ft: .85, s: 10 }, { p: L.rect(-80, -60, 140, 80), f: -1, s: 9 }, { p: L.rect(-40, -110, 60, 50), f: -1, s: 8 }, { p: 'M-10 -110 V-160 H10 V-110', f: 2, ft: .9, s: 8, m: 'steam', a: 0 },
    ...[-60, -25, 10, 45].map(x => ({ c: [x, -20, 8], f: 3, s: 4 })), { p: 'M-190 115 C-120 95 -60 125 0 115 C60 105 120 125 190 110 V170 H-190 Z', f: 3, ft: .55, s: 7, m: 'drift', a: 8 }, { p: 'M0 -165 C-10 -180 10 -185 0 -195', s: 4, m: 'steam', a: 8 },
  ], { moods: ['sereno', 'nostalgico'] });
  A('tren', 'TREN', /\b(tren(es)?|trains?|locomotora|locomotive|ferrocarril|railway|railroad|riel(es)?|rails?|estaci[oó]n de tren|train station|vag[oó]n)\b/i, [
    { p: L.rr(-170, -50, 250, 130, 16), f: 1, ft: .85, s: 10 }, { p: L.rect(80, -30, 90, 110), f: 2, ft: .85, s: 9 }, { p: 'M80 -30 L110 -80 H170 V-30', f: 2, ft: .95, s: 8 }, { p: L.rect(-140, -25, 50, 45), f: -1, s: 6 }, { p: L.rect(-70, -25, 50, 45), f: -1, s: 6 },
    ...wheel(-110, 100, 26), ...wheel(-30, 100, 26), ...wheel(110, 100, 26), { p: 'M-190 128 H190', s: 8 }, { p: 'M-190 145 H190 M-160 128 V150 M-100 128 V150 M-40 128 V150 M20 128 V150 M80 128 V150 M140 128 V150', s: 4 }, { p: 'M140 -90 C130 -120 150 -130 140 -160', s: 5, m: 'steam', a: 30 },
  ], { moods: ['nostalgico', 'melancolico'] });
  A('autobus', 'AUTOBÚS', /\b(autobuses|autob[uú]s|buses|bus|guagua|colectivo|transporte p[uú]blico|public transport|parada de bus|bus stop)\b/i, [
    { p: L.rr(-170, -80, 340, 170, 20), f: 2, ft: .85, s: 10 }, ...[-130, -70, -10, 50, 110].map(x => ({ p: L.rect(x - 22, -55, 44, 50), f: -1, s: 6 })), { p: L.rect(90, 0, 70, 90), f: 3, ft: .6, s: 6 }, { p: 'M-170 25 H170', s: 5 },
    ...wheel(-100, 100, 30), ...wheel(100, 100, 30), gnd,
  ], { moods: ['feliz'] });
  A('moto', 'MOTO', /\b(motos?|motocicletas?|motorcycles?|motorbikes?|scooters?|vespa|harley|biker|motorista|motorcycle)\b/i, [
    ...wheel(-100, 90, 55), ...wheel(110, 90, 55), { p: 'M-100 90 L-30 20 H60 L110 90 M60 20 L40 -30 H0', s: 10 }, { p: 'M0 -30 L30 -60 H80', s: 9 }, { p: 'M-40 20 C-20 -20 50 -10 60 20 Z', f: 1, ft: .9, s: 8 }, { p: 'M-30 40 H70 L60 70 H-20 Z', f: 3, ft: .7, s: 7 },
    { p: 'M110 90 L90 20 L80 -40 L110 -50', s: 8 }, { c: [110, -40, 14], f: 2, ft: .95, s: 6, m: 'pulse', a: .1, o: [110, -40] }, { p: 'M-190 150 H190', s: 8 }, { p: 'M-170 30 H-140 M-180 60 H-130', s: 4, m: 'drift', a: 10 },
  ], { moods: ['desafiante', 'euforico', 'rabioso'] });
  A('taxi', 'TAXI', /\b(taxis?|cabs?|uber|ride ?share|carrera en taxi|taxista|cab driver)\b/i, [
    { p: 'M-170 40 C-160 10 -130 10 -100 10 L-60 -40 H60 L110 10 C150 10 170 20 170 40 V80 H-170 Z', f: 2, ft: .9, s: 10 }, { p: 'M-50 -35 L-80 10 H-10 V-35 Z M10 -35 V10 H90 L60 -35 Z', f: -1, s: 6 }, { p: L.rr(-30, -75, 60, 30, 8), f: 1, ft: .95, s: 7 },
    { p: 'M-170 45 H170', s: 4 }, ...[-120, -80, -40, 0, 40, 80, 120].map((x, i) => ({ p: L.rect(x - 10, 55, 10, 10), f: i % 2 ? 1 : -1, s: 2 })), ...wheel(-100, 85, 30), ...wheel(100, 85, 30), gnd,
  ], { moods: ['nostalgico', 'oscuro', 'melancolico'] });
  A('camion', 'CAMIÓN', /\b(cami[oó]n(es)?|cami[oó]n|trucks?|truck driver|camionero|trailer|tr[aá]iler|tractomula|freight)\b/i, [
    { p: L.rect(-180, -70, 190, 130), f: 3, ft: .6, s: 10 }, { p: 'M10 -30 H90 L130 20 V60 H10 Z', f: 2, ft: .85, s: 10 }, { p: 'M30 -20 H80 L105 15 H30 Z', f: -1, s: 6 }, ...wheel(-130, 80, 28), ...wheel(-50, 80, 28), ...wheel(100, 80, 28), { p: 'M-150 -30 H-40 M-150 0 H-40', s: 4 }, gnd,
  ], { moods: ['nostalgico'] });
  A('ambulancia', 'AMBULANCIA', /\b(ambulancias?|ambulance|urgencias|emergency room|paramedic|param[eé]dicos?|hospital|911|emergencia|emergency)\b/i, [
    { p: 'M-170 -60 H40 L100 -10 H170 V70 H-170 Z', f: -1, s: 10 }, { p: 'M-90 -40 V10 M-115 -15 H-65', s: 14, i: 2 }, { p: 'M60 -35 L95 -5 H60 Z', f: 3, ft: .6, s: 6 }, { c: [-10, -85, 14], f: 2, ft: .95, s: 7, m: 'blink', v: 3 }, { p: 'M-30 -75 L-50 -95 M10 -75 L30 -95', s: 5, m: 'pulse', a: .3, v: 4, o: [-10, -80] },
    ...wheel(-100, 85, 28), ...wheel(100, 85, 28), gnd,
  ], { moods: ['oscuro', 'rabioso'] });
  A('patrulla', 'PATRULLA', /\b(patrullas?|police car|polic[ií]a|police|sirenas?|sirens?|cops?|sheriff|comisar[ií]a|arresto|arrest|detenid[oa])\b/i, [
    { p: 'M-170 40 C-160 10 -130 10 -100 10 L-60 -40 H60 L110 10 C150 10 170 20 170 40 V80 H-170 Z', f: 1, ft: .9, s: 10 }, { p: 'M-170 40 H170 M-40 10 V80 M40 10 V80', s: 4, i: 3 }, { p: 'M-50 -35 L-80 10 H-10 V-35 Z M10 -35 V10 H90 L60 -35 Z', f: -1, s: 6 },
    { p: L.rect(-25, -70, 22, 28), f: 2, ft: .95, s: 6, m: 'blink', v: 4 }, { p: L.rect(3, -70, 22, 28), f: 1, ft: .95, s: 6, m: 'blink', v: 4, ph: 1 }, ...wheel(-100, 85, 30), ...wheel(100, 85, 30), gnd,
  ], { moods: ['oscuro', 'rabioso', 'desafiante'] });
  A('helicoptero', 'HELICÓPTERO', /\b(helic[oó]pteros?|helicopters?|chopper|rotor|hel[ií]ceros?|helipuerto)\b/i, [
    { p: 'M-90 -20 C-90 -70 40 -80 80 -20 C100 20 60 70 -20 70 C-80 70 -100 30 -90 -20 Z', f: 1, ft: .85, s: 10 }, { p: 'M-70 -30 C-70 -55 0 -60 20 -30 Z', f: -1, s: 6 }, { p: 'M70 -10 L190 -30 L190 -5 L75 20 Z', f: 1, ft: .85, s: 8 }, { p: 'M-40 -80 V-100 M40 -80 V-100', s: 6 },
    { p: 'M-190 -105 H190', s: 8, m: 'wag', a: .05, o: [0, -105], v: 6 }, { p: 'M190 -60 V10', s: 6, m: 'wag', a: .2, v: 6, o: [190, -25] }, { p: 'M-70 90 H60 M-40 70 V90 M30 70 V90', s: 8 },
  ], { moods: ['desafiante', 'oscuro'] });
  A('cohete', 'COHETE', /\b(cohetes?|rockets?|nave espacial|spaceship|spacecraft|astronautas?|astronauts?|luna landing|apollo|space shuttle|lanzamiento espacial|liftoff|blast off|cosmonaut)\b/i, [
    { p: 'M0 -190 C50 -130 60 -40 50 60 H-50 C-60 -40 -50 -130 0 -190 Z', f: -1, s: 10 }, { c: [0, -60, 24], f: 3, ft: .7, s: 8 }, { p: 'M-50 60 L-100 130 L-50 110 Z M50 60 L100 130 L50 110 Z', f: 2, ft: .9, s: 8 }, { p: 'M-20 60 H20 V80 H-20 Z', f: 1, ft: .9, s: 6 },
    { p: 'M-30 90 C-40 130 -10 150 0 190 C10 150 40 130 30 90 Z', f: 2, ft: .95, s: 6, m: 'pulse', a: .15, o: [0, 90], v: 4 }, { p: 'M0 -190 V-200', s: 0 }, { p: L.star(-130, -90, 10, 4, .4), f: 3, s: 3, m: 'pulse', a: .5, o: [-130, -90] }, { p: L.star(130, -60, 8, 4, .4), f: 2, s: 3, m: 'pulse', a: .5, o: [130, -60], ph: 1 },
  ], { moods: ['euforico', 'desafiante'] });
  A('submarino', 'SUBMARINO', /\b(submarinos?|submarines?|yellow submarine|periscopio|periscope|bajo el mar|under the sea|abismo|abyss|deep sea|sumergirse|submerge)\b/i, [
    { p: 'M-170 10 C-170 -50 -100 -60 0 -60 C100 -60 170 -50 170 10 C170 70 100 80 0 80 C-100 80 -170 70 -170 10 Z', f: 2, ft: .9, s: 10 }, { p: L.rect(-30, -100, 60, 40), f: 2, ft: .9, s: 9 }, { p: 'M0 -100 V-140 H30', s: 7 }, ...[-90, -30, 30, 90].map(x => ({ c: [x, 10, 16], f: -1, s: 6 })),
    { p: 'M-170 10 L-200 -20 M-170 10 L-200 40', s: 8 }, { p: 'M-200 -10 C-210 0 -210 20 -200 30', s: 6, m: 'wag', a: .3, v: 6, o: [-190, 10] }, { c: [-130, -100, 8], s: 3, m: 'steam', a: 60 }, { c: [-110, -140, 5], s: 3, m: 'steam', a: 70, ph: .5 },
  ], { moods: ['oscuro', 'sereno'] });
  A('velero', 'VELERO', /\b(veleros?|sailboats?|sailing|navegar|navegando|vela de barco|regata|velas al viento|yacht|yate)\b/i, [
    { p: 'M-140 90 H140 L90 150 H-90 Z', f: 3, ft: .8, s: 10 }, { p: 'M0 90 V-170', s: 9 }, { p: 'M10 -160 C80 -90 100 -10 100 80 H10 Z', f: -1, s: 9, m: 'sway', a: .02, o: [10, 80] }, { p: 'M-10 -100 C-70 -50 -90 20 -100 80 H-10 Z', f: 2, ft: .85, s: 9, m: 'sway', a: .02, o: [-10, 80] },
    { p: 'M0 -170 L40 -160 L0 -150 Z', f: 1, ft: .95, s: 4, m: 'sway', a: .1, o: [0, -160] }, { p: 'M-190 150 C-120 130 -60 160 0 150 C60 140 120 160 190 145', s: 6, m: 'drift', a: 8 },
  ], { moods: ['sereno', 'romantico', 'nostalgico'] });
  A('ovni', 'OVNI', /\b(ovnis?|ufos?|platillo volador|flying saucer|extraterrestres?|aliens?|marcianos?|martians?|abducci[oó]n|abduction|area 51)\b/i, [
    { p: 'M-40 -30 C-40 -100 40 -100 40 -30 Z', f: 3, ft: .5, s: 8 }, { p: 'M-190 10 C-190 -20 -100 -35 0 -35 C100 -35 190 -20 190 10 C190 40 100 50 0 50 C-100 50 -190 40 -190 10 Z', f: 1, ft: .85, s: 10 }, ...[-130, -70, 0, 70, 130].map((x, i) => ({ c: [x, 10, 10], f: 2, ft: .95, s: 4, m: 'blink', v: 2, ph: i })),
    { p: 'M-60 50 L-120 170 H120 L60 50 Z', f: 2, ft: .35, s: 4, m: 'pulse', a: .05, o: [0, 50], v: 2 }, { c: [0, -55, 12], f: 1, s: 0 },
  ], { moods: ['oscuro', 'euforico'] });
  A('patineta', 'PATINETA', /\b(patinetas?|skateboards?|skater|patinar|skating|longboard|trucos de skate|kickflip)\b/i, [
    { p: 'M-170 20 C-150 40 150 40 170 20 C150 10 -150 10 -170 20 Z', f: 2, ft: .9, s: 10 }, ...wheel(-100, 70, 20), ...wheel(100, 70, 20), { p: 'M-110 45 V52 M110 45 V52', s: 8 }, { p: 'M-190 150 H190', s: 8 }, { p: 'M-140 -60 L-100 -100 M-60 -80 L-40 -130 M60 -90 L90 -140', s: 4, m: 'bob', a: 6 },
  ], { moods: ['desafiante', 'euforico'] });
  A('tractor', 'TRACTOR', /\b(tractor(es)?|tractors?|granjero|farmer|arado|plow|plough|finca|rancho|campesino|labranza)\b/i, [
    { p: 'M-110 40 V-20 H10 L40 -70 H90 V40 Z', f: 1, ft: .85, s: 10 }, { p: 'M40 -70 V-110 H90 V-70', s: 8 }, { p: 'M50 -60 H80 V-10 H50 Z', f: -1, s: 5 }, { p: L.rect(-110, -20, 110, 60), f: 2, ft: .8, s: 8 },
    ...wheel(-70, 80, 50), ...wheel(90, 100, 30), gnd, { p: 'M-150 140 H-170 M-140 120 H-180', s: 4, m: 'drift', a: 10 },
  ], { moods: ['nostalgico', 'sereno'] });
  A('metro', 'METRO', /\b(metros?|subway|underground|tube|el tren subterr[aá]neo|subte|estaci[oó]n de metro|metro station)\b/i, [
    { p: 'M-190 -90 H190 V140 H-190 Z', f: 3, ft: .5, s: 9 }, { p: 'M-190 60 H190', s: 8 }, { p: 'M-150 -20 H150 V60 H-150 Z', f: 1, ft: .7, s: 8 }, ...[-100, -30, 40, 110].map(x => ({ p: L.rect(x - 22, -10, 44, 40), f: -1, s: 5 })),
    { p: 'M-180 140 V80 M-100 140 V80 M0 140 V80 M100 140 V80 M180 140 V80', s: 4 }, { c: [-150, -50, 14], f: 2, ft: .95, s: 6, m: 'blink', v: 2 }, { p: 'M-190 100 H190', s: 5, i: 3 },
  ], { moods: ['oscuro', 'melancolico', 'nostalgico'] });
  A('canoa', 'CANOA', /\b(canoas?|canoes?|kayak|kayaks|remo|remar|rowing|piragua|lancha|motorboat|balsa|raft)\b/i, [
    { p: 'M-190 20 C-140 80 140 80 190 20 C140 40 -140 40 -190 20 Z', f: 2, ft: .85, s: 10 }, { p: 'M-120 -140 L60 100 M45 100 L75 90', s: 8, m: 'sway', a: .05, o: [-30, -20] }, { p: 'M-140 -150 L-100 -130 L-110 -150 Z', f: 1, ft: .9, s: 5 },
    { p: 'M-190 90 C-120 70 -60 100 0 90 C60 80 120 100 190 85', s: 5, m: 'drift', a: 8 }, { p: 'M-190 115 C-120 95 -60 125 0 115 C60 105 120 125 190 110', s: 4, m: 'drift', a: -8 },
  ], { moods: ['sereno'] });
  A('paracaidas', 'PARACAÍDAS', /\b(paracaidas|paracaídas|parachutes?|skydiv\w*|paracaidismo|salto en paracaídas|parapente|paragliding|hang glid\w*|deslizador)\b/i, [
    { p: 'M-150 -20 C-150 -140 150 -140 150 -20 C100 -40 60 -20 0 -20 C-60 -20 -100 -40 -150 -20 Z', f: 2, ft: .85, s: 10, m: 'sway', a: .02, o: [0, 100] }, { p: 'M-40 -120 C-50 -60 -30 -20 0 -20 C30 -20 50 -60 40 -120', s: 5 }, { p: 'M-150 -20 L-15 100 M150 -20 L15 100 M0 -20 V100 M-75 -25 L-10 100 M75 -25 L10 100', s: 4 },
    { c: [0, 115, 15], f: 1, ft: .95, s: 8 }, { p: 'M0 130 V170 M-25 145 H25 M0 170 L-20 190 M0 170 L20 190', s: 6 },
  ], { moods: ['euforico', 'sereno'] });
  A('tranvia', 'TRANVÍA', /\b(tranv[ií]as?|trams?|streetcars?|trolleys?|cable car|funicular|telef[eé]rico|gondola lift|carrito de cable)\b/i, [
    { p: 'M-130 -10 H130 V100 H-130 Z', f: 1, ft: .85, s: 10 }, { p: 'M-130 -10 L-100 -40 H100 L130 -10', f: 2, ft: .8, s: 9 }, ...[-90, -30, 30, 90].map(x => ({ p: L.rect(x - 20, 10, 40, 40), f: -1, s: 5 })), { p: 'M0 -40 L-40 -110 M0 -40 L40 -110 M-60 -110 H60', s: 6 }, { p: 'M-190 -140 H190', s: 4, i: 3 },
    { p: 'M-110 100 V125 M110 100 V125', s: 8 }, { p: 'M-190 130 H190', s: 8 },
  ], { moods: ['nostalgico'] });
  A('limusina', 'LIMUSINA', /\b(limusinas?|limousines?|limo|carro de lujo|luxury car|rolls royce|ferrari|lamborghini|bmw|porsche|bugatti|maserati|sports car)\b/i, [
    { p: 'M-190 50 C-180 30 -150 30 -120 30 L-70 -20 H10 L40 30 H150 C180 30 190 40 190 50 V80 H-190 Z', f: 1, ft: .9, s: 10 }, { p: 'M-70 -15 L-100 28 H-20 V-15 Z M-5 -15 V28 H30 L10 -15 Z', f: -1, s: 6 }, { p: 'M-190 55 H190', s: 4, i: 2 },
    ...wheel(-120, 85, 26), ...wheel(110, 85, 26), { p: 'M190 45 L200 40', s: 4 }, gnd, { p: 'M-190 -40 H-150 M-180 -20 H-130', s: 4, m: 'drift', a: 10 },
  ], { moods: ['euforico', 'desafiante'] });
  A('carruaje', 'CARRUAJE', /\b(carruajes?|carrozas?|carriages?|caleche|carreta|carreta de bueyes|wagon|diligencia|stagecoach|cenicienta|cinderella)\b/i, [
    { p: 'M-90 -60 C-90 -110 90 -110 90 -60 V40 H-90 Z', f: 2, ft: .85, s: 10 }, { p: 'M-60 -50 C-60 -80 60 -80 60 -50 V0 H-60 Z', f: -1, s: 6 }, { p: 'M-110 40 H110', s: 9 }, ...wheel(-80, 90, 44), ...wheel(80, 90, 32),
    { p: 'M110 10 L190 0 M110 30 L190 30', s: 6 }, { p: L.star(0, -120, 14, 5, .45), f: 3, ft: .95, s: 4, m: 'pulse', a: .2, o: [0, -120] }, gnd,
  ], { moods: ['romantico', 'nostalgico'] });
  A('camioneta_pickup', 'PICKUP', /\b(pickups?|pick.?up|truck bed|cuatro por cuatro|4x4|jeep|suv|todo terreno|off.?road|monster truck)\b/i, [
    { p: 'M-190 40 V-10 H-60 V40 Z', f: 3, ft: .6, s: 9 }, { p: 'M-60 40 V-50 H0 L40 -50 L80 -10 H180 V40 Z', f: 1, ft: .85, s: 10 }, { p: 'M-40 -30 H-5 L30 -30 L50 -5 H-40 Z', f: -1, s: 5 },
    ...wheel(-110, 75, 34), ...wheel(110, 75, 34), gnd, { p: 'M-120 130 L-90 120 M100 130 L130 120', s: 3, m: 'drift', a: 6 },
  ], { moods: ['desafiante'] });
  A('semaforo_mano', 'CALLE', /\b(calles?|streets?|avenidas?|avenues?|acera|esquina|asfalto|asphalt|tr[aá]fico|traffic)\b/i, [
    { p: 'M-190 -30 H190 V60 H-190 Z', f: 3, ft: .55, s: 9 }, { p: 'M-190 20 H-130 M-100 20 H-40 M-10 20 H50 M80 20 H140 M170 20 H190', s: 7, i: 2 }, { p: 'M-190 60 H190 V90 H-190 Z', f: -1, s: 7 }, { p: 'M-150 -30 V-140 H-120 V-30', s: 8 },
    { p: L.rect(-160, -190, 44, 60), f: 1, ft: .9, s: 8 }, { c: [-138, -175, 8], f: 2, ft: .95, s: 0 }, { c: [-138, -150, 8], f: -1, s: 0 }, { p: 'M60 -30 V-100 M40 -100 H110', s: 7 },
  ], { moods: ['oscuro', 'nostalgico'] });
})();
