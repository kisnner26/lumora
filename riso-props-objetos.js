// ============================================================
// riso-props-objetos.js — objetos cotidianos (oleada 1 del catálogo). Ver riso-props-lib.js.
// ============================================================
(() => {
  const R = window.RISO; if (!R || !R.lib) return;
  const { add, L } = R.lib, PI = Math.PI, C = 'objetos';
  const A = (id, label, rx, shapes, opt) => add(id, C, label, rx, shapes, opt);

  A('llave', 'LLAVE', /\b(llaves?|keys?)\b/i, [
    { c: [-100, -20, 62], f: 2, ft: .85, s: 8 }, { c: [-100, -20, 22], f: -1, s: 6 },
    { p: 'M-40 -32 H150 V4 H120 V30 H95 V4 H60 V22 H36 V4 H-40 Z', f: 2, ft: .55, s: 8, m: 'sway', a: .03, o: [-100, -20] },
  ], { g: { r: -.5, dx: 20, dy: 20 }, moods: ['romantico', 'nostalgico'] });
  A('candado', 'CANDADO', /\b(candados?|padlocks?|locked|bajo llave)\b/i, [
    { p: 'M-60 -30 V-70 C-60 -150 60 -150 60 -70 V-30', s: 14, m: 'sway', a: .03, o: [0, -30] },
    { p: L.rr(-95, -30, 190, 150, 20), f: 2, ft: .85, s: 8 }, { c: [0, 30, 20], f: 1, ft: .95, s: 5 }, { p: 'M0 40 V80', s: 9 },
  ]);
  A('puerta', 'PUERTA', /\b(puertas?|doors?|doorway|umbral)\b/i, [
    { p: L.rect(-95, -170, 190, 340), f: 3, ft: .55, s: 9 }, { p: L.rect(-70, -145, 140, 130), s: 6 }, { p: L.rect(-70, 15, 140, 130), s: 6 },
    { c: [55, 10, 12], f: 2, ft: .95, s: 5, m: 'beat', a: .15, o: [55, 10] }, { p: 'M-95 170 H95', s: 9 },
    { p: 'M95 -170 L150 -140 V190 L95 170 Z', f: 1, ft: .5, s: 7, m: 'sway', a: .02, o: [95, 0] },
  ]);
  A('ventana', 'VENTANA', /\b(ventanas?|windows?|cristal|panes?)\b/i, [
    { p: L.rr(-110, -140, 220, 280, 12), f: 3, ft: .35, s: 9 }, { p: 'M0 -140 V140 M-110 0 H110', s: 8 },
    { p: 'M-80 -100 L-30 -100 L-80 -50 Z M10 30 L80 30 L10 100 Z', f: -1, s: 3, m: 'bob', a: 3 },
    { p: L.rect(-135, 140, 270, 22), f: 2, ft: .8, s: 7 },
    { p: 'M-110 -140 C-150 -100 -150 -20 -128 40', s: 6, m: 'sway', a: .05, o: [-110, -140] },
  ]);
  A('espejo', 'ESPEJO', /\b(espejos?|mirrors?|reflejo|reflection)\b/i, [
    { e: [0, -20, 105, 150], f: 2, ft: .75, s: 10 }, { e: [0, -20, 82, 128], f: 3, ft: .35, s: 6 },
    { p: 'M-45 -90 L-15 -100 M-52 -60 L-30 -70', s: 5, m: 'drift', a: 12 }, { p: 'M-60 130 L-80 175 M60 130 L80 175', s: 9 }, { p: 'M-85 178 H85', s: 9 },
  ]);
  A('cama', 'CAMA', /\b(camas?|beds?|s[aá]banas?|sheets|pillows?|almohadas?)\b/i, [
    { p: L.rect(-150, -40, 300, 26), f: 2, ft: .7, s: 8 }, { p: 'M-150 -130 V90 M150 -80 V90', s: 12 }, { p: L.rr(-140, -14, 280, 60, 14), f: 3, ft: .75, s: 8 },
    { p: L.rr(-125, -40, 90, 34, 16), f: -1, s: 7, m: 'beat', a: .04, o: [-80, -25] }, { p: 'M-30 -14 C20 -40 90 -10 140 -14', s: 5 }, { p: 'M-150 90 H150', s: 9 },
  ]);
  A('silla', 'SILLA', /\b(sillas?|chairs?|asiento)\b/i, [
    { p: L.rr(-70, -150, 130, 150, 14), f: 2, ft: .7, s: 9 }, { p: L.rr(-90, -10, 170, 36, 12), f: 2, ft: .9, s: 9 }, { p: 'M-70 26 V150 M60 26 V150 M-90 26 L-100 150 M80 26 L92 150', s: 11 },
    { p: 'M-40 -110 H30 M-40 -70 H30', s: 4 },
  ], { g: { r: -.08 } });
  A('mesa', 'MESA', /\b(mesas?|tables?|desk|escritorio)\b/i, [
    { p: L.rr(-160, -60, 320, 34, 10), f: 2, ft: .85, s: 9 }, { p: 'M-130 -26 L-145 150 M130 -26 L145 150', s: 12 }, { p: 'M-125 60 H125', s: 7 },
    { p: L.rr(-40, -110, 80, 50, 8), f: 3, ft: .55, s: 6, m: 'bob', a: 2 }, { c: [90, -80, 22], f: -1, s: 6 },
  ]);
  A('lampara', 'LÁMPARA', /\b(l[aá]mparas?|lamps?|lamparita|desk lamp)\b/i, [
    { p: 'M-70 -20 L-40 -140 H40 L70 -20 Z', f: 2, ft: .8, s: 9 }, { p: 'M0 -20 V120', s: 12 }, { p: L.rr(-60, 118, 120, 30, 10), f: 1, ft: .8, s: 8 },
    { c: [0, 0, 26], f: 2, ft: .3, s: 5, m: 'pulse', a: .15, o: [0, 0] }, { p: 'M-90 -30 L-130 -10 M90 -30 L130 -10 M0 -160 V-190', s: 5, m: 'beat', a: .1, o: [0, -20] },
  ], { moods: ['romantico', 'melancolico'] });
  A('vela', 'VELA', /\b(velas?|candles?|candlelight|candle)\b/i, [
    { p: L.rr(-45, -20, 90, 170, 10), f: 3, ft: .6, s: 9 }, { p: 'M-45 30 C-20 55 20 30 45 55', s: 5 }, { p: 'M0 -20 V-45', s: 6 },
    { p: 'M0 -50 C-40 -80 -20 -130 0 -170 C20 -130 40 -80 0 -50 Z', f: 2, ft: .9, s: 6, m: 'sway', a: .1, o: [0, -50], b: 1.5 }, { p: 'M0 -55 C-14 -75 -6 -100 0 -115 C6 -100 14 -75 0 -55 Z', f: -1, s: 3, m: 'sway', a: .1, o: [0, -55] },
    { p: 'M-60 150 H60', s: 9 },
  ], { moods: ['romantico', 'triste', 'nostalgico'] });
  A('telefono_fijo', 'TELÉFONO', /\b(tel[eé]fono fijo|landline|telephone|hello\?|rotary phone|llamada perdida|dial)\b/i, [
    { p: L.rr(-120, 40, 240, 100, 20), f: 2, ft: .8, s: 9 }, { c: [0, 90, 42], f: -1, s: 6 }, { p: 'M0 60 V120 M-20 70 L20 110 M-20 110 L20 70', s: 3 },
    { p: 'M-140 10 C-140 -50 -100 -60 -60 -50 H60 C100 -60 140 -50 140 10 C140 30 100 30 100 10 V0 H-100 V10 C-100 30 -140 30 -140 10 Z', f: 1, ft: .85, s: 8, m: 'wag', a: .03, o: [0, 10] },
    { p: 'M-60 -80 C-30 -110 30 -110 60 -80', s: 4, m: 'pulse', a: .1, o: [0, -90] },
  ]);
  A('radio', 'RADIO', /\b(radios?|fm|am dial|estaci[oó]n de radio|on the radio|en la radio)\b/i, [
    { p: L.rr(-150, -70, 300, 190, 22), f: 2, ft: .8, s: 9 }, { c: [-70, 30, 52], f: -1, s: 7 }, { c: [-70, 30, 52], f: 1, ft: .35, s: 0, m: 'pulse', a: .08, o: [-70, 30] },
    { p: L.rect(20, -30, 100, 40), f: 3, ft: .5, s: 6 }, { p: 'M40 -10 L100 -10', s: 4, m: 'drift', a: 30 }, { c: [50, 70, 14], f: 1, s: 5 }, { c: [95, 70, 14], f: 1, s: 5 }, { p: 'M-110 -70 L-60 -170', s: 7, m: 'sway', a: .06, o: [-110, -70] },
  ], { moods: ['nostalgico'] });
  A('televisor', 'TELEVISOR', /\b(tv|televisi[oó]n|televisor|television|screen|pantalla|channel|canal)\b/i, [
    { p: L.rr(-150, -110, 300, 210, 24), f: 1, ft: .9, s: 9 }, { p: L.rr(-125, -85, 250, 160, 12), f: 3, ft: .6, s: 6 },
    { p: 'M-125 -20 H125', s: 3, m: 'fall', a: 100, v: .8 }, { p: 'M-90 -50 L-30 10 L20 -40 L90 20', s: 5, m: 'drift', a: 10 },
    { p: 'M-60 100 L-90 140 M60 100 L90 140', s: 9 }, { p: 'M-30 -110 L-70 -170 M30 -110 L70 -170', s: 7, m: 'sway', a: .05, o: [0, -110] },
  ]);
  A('camara_foto', 'CÁMARA', /\b(c[aá]maras? de fotos?|camera|polaroid|photo|foto(?:graf[ií]a)?s?|selfie)\b/i, [
    { p: L.rr(-160, -80, 320, 190, 26), f: 1, ft: .85, s: 9 }, { p: 'M-70 -80 L-45 -120 H45 L70 -80', f: 2, ft: .8, s: 8 },
    { c: [0, 20, 72], f: 3, ft: .7, s: 9 }, { c: [0, 20, 44], f: 1, ft: .9, s: 7 }, { c: [-16, 4, 12], f: -1, s: 0, m: 'beat', a: .3, o: [0, 20] },
    { c: [110, -45, 14], f: 2, ft: .95, s: 5, m: 'blink', v: 2 }, { p: L.rect(-140, -105, 50, 26), f: 2, ft: .6, s: 5 },
  ], { moods: ['nostalgico'] });
  A('libro', 'LIBRO', /\b(libros?|books?|p[aá]ginas?|pages?|leer|reading|novela|novel)\b/i, [
    { p: 'M0 -100 C-50 -130 -120 -125 -160 -100 V90 C-120 65 -50 60 0 90 Z', f: 3, ft: .55, s: 9 }, { p: 'M0 -100 C50 -130 120 -125 160 -100 V90 C120 65 50 60 0 90 Z', f: 2, ft: .6, s: 9, m: 'flap', a: 0, o: [0, 0] },
    { p: 'M-130 -70 C-90 -85 -50 -85 -20 -70 M-130 -40 C-90 -55 -50 -55 -20 -40 M-130 -10 C-90 -25 -50 -25 -20 -10', s: 3 }, { p: 'M20 -70 C60 -85 100 -85 130 -70 M20 -40 C60 -55 100 -55 130 -40', s: 3 },
    { p: 'M-160 100 C-100 125 -40 120 0 100 C40 120 100 125 160 100', s: 6 },
  ]);
  A('carta', 'CARTA', /\b(cartas?|letters?|handwritten|manuscrit\w*|te escribo|dear)\b/i, [
    { p: L.rr(-120, -150, 240, 300, 8), f: -1, s: 9, m: 'sway', a: .03, o: [0, 150] }, { p: 'M-80 -100 H80 M-80 -60 H80 M-80 -20 H30 M-80 20 H80 M-80 60 H10', s: 5 },
    { p: 'M40 70 L110 20 L130 40 L60 110 Z', f: 2, ft: .85, s: 6, m: 'wag', a: .05, o: [60, 110] }, { p: L.heart(60, 90, 3), f: 2, ft: .85, s: 0 },
  ], { moods: ['romantico', 'nostalgico', 'triste'] });
  A('sobre', 'SOBRE', /\b(sobres?|envelopes?|mailed|by mail|correo|mail)\b/i, [
    { p: L.rr(-160, -95, 320, 200, 12), f: 3, ft: .5, s: 9 }, { p: 'M-160 -95 L0 30 L160 -95', s: 8, m: 'flap', a: 0, o: [0, -95] }, { p: 'M-160 105 L-40 5 M160 105 L40 5', s: 5 },
    { p: L.heart(0, 40, 4), f: 2, ft: .9, s: 5, m: 'pulse', a: .2, o: [0, 40] },
  ]);
  A('reloj_arena', 'RELOJ DE ARENA', /\b(reloj de arena|hourglass|sand time|se acaba el tiempo|running out of time)\b/i, [
    { p: 'M-90 -160 H90 M-90 160 H90', s: 12 }, { p: 'M-75 -160 C-75 -60 -10 -20 -10 0 C-10 20 -75 60 -75 160 H75 C75 60 10 20 10 0 C10 -20 75 -60 75 -160 Z', f: 3, ft: .3, s: 8 },
    { p: 'M-50 -145 C-50 -80 -8 -40 0 -20 C8 -40 50 -80 50 -145 Z', f: 2, ft: .85, s: 0, m: 'pulse', a: .03, o: [0, -100] }, { p: 'M0 -20 V110', s: 4, m: 'fall', a: 30 },
    { p: 'M-60 160 C-30 100 30 100 60 160 Z', f: 2, ft: .85, s: 0 },
  ], { moods: ['nostalgico', 'triste'] });
  A('brujula', 'BRÚJULA', /\b(br[uú]jula|compass|north|norte|rumbo|direction|sin rumbo|lost)\b/i, [
    { c: [0, 0, 150], f: 2, ft: .65, s: 10 }, { c: [0, 0, 118], f: -1, s: 6 },
    { p: 'M0 -100 L22 0 L0 100 L-22 0 Z', f: 3, ft: .5, s: 5 }, { p: 'M0 -100 L22 0 L-22 0 Z', f: 1, ft: .95, s: 5, m: 'sway', a: .5, o: [0, 0], v: .7 },
    { p: 'M0 -118 V-100 M0 100 V118 M-118 0 H-100 M100 0 H118', s: 5 }, { c: [0, 0, 8], f: 1, s: 4 }, { p: 'M0 -150 V-185', s: 9 },
  ]);
  A('mapa', 'MAPA', /\b(mapas?|maps?|treasure map|carta de navegaci[oó]n|x marks)\b/i, [
    { p: 'M-160 -100 L-55 -125 L55 -95 L160 -125 V95 L55 125 L-55 95 L-160 125 Z', f: 3, ft: .35, s: 9 }, { p: 'M-55 -125 V95 M55 -95 V125', s: 5 },
    { p: 'M-125 40 C-100 -10 -80 40 -30 -20 S30 30 70 -10 S110 40 130 10', s: 5, m: 'drift', a: 4, i: 1 }, { p: 'M40 -40 L80 -80 M80 -40 L40 -80', s: 10, m: 'pulse', a: .2, o: [60, -60], i: 1 },
    { p: L.star(-110, -60, 22, 4, .3), f: 2, ft: .9, s: 4 },
  ]);
  A('globo_aire', 'GLOBO', /\b(globos?|balloons?|helium)\b/i, [
    { p: 'M0 -160 C-100 -160 -110 -40 -30 40 L-20 55 H20 L30 40 C110 -40 100 -160 0 -160 Z', f: 2, ft: .85, s: 9, m: 'sway', a: .05, o: [0, 60] },
    { p: 'M-20 55 L20 55 L12 70 H-12 Z', f: 2, ft: .6, s: 6, m: 'sway', a: .05, o: [0, 60] }, { p: 'M-50 -110 C-70 -80 -70 -60 -60 -40', s: 4, m: 'sway', a: .05, o: [0, 60] },
    { p: 'M0 70 C-20 100 20 130 0 160 C-20 190 10 200 0 210', s: 4, m: 'sway', a: .1, o: [0, 70] },
  ], { g: { dy: -20, s: .9 } });
  A('paraguas', 'PARAGUAS', /\b(paraguas|umbrellas?|umbrella|rain(y)? day|d[ií]a de lluvia)\b/i, [
    { p: 'M-160 0 C-150 -110 -70 -160 0 -160 C70 -160 150 -110 160 0 C130 -30 100 -30 80 0 C60 -30 30 -30 0 0 C-30 -30 -60 -30 -80 0 C-100 -30 -130 -30 -160 0 Z', f: 2, ft: .85, s: 9 },
    { p: 'M0 -160 V-185 M0 0 V120 C0 160 -50 160 -50 130', s: 9 }, { p: 'M-80 0 C-70 -70 -40 -130 0 -160 M80 0 C70 -70 40 -130 0 -160', s: 4 },
    { p: 'M-110 40 V70 M-40 50 V85 M40 45 V80 M110 40 V72', s: 5, m: 'fall', a: 50, v: 1.2 },
  ], { moods: ['triste', 'melancolico'] });
  A('bicicleta', 'BICICLETA', /\b(bicicletas?|bikes?|bicycle|cycling|pedal\w*|ciclista)\b/i, [
    { c: [-100, 60, 70], s: 9, m: 'spin', a: 2, o: [-100, 60] }, { c: [110, 60, 70], s: 9, m: 'spin', a: 2, o: [110, 60] },
    { p: 'M-100 60 L-30 -40 H60 L110 60 M-30 -40 L20 60 H-100 M60 -40 L20 60', s: 8 }, { p: 'M-40 -70 H0 M50 -40 L40 -85 H75', s: 8 },
    { c: [20, 60, 14], f: 2, ft: .9, s: 5, m: 'spin', a: 3, o: [20, 60] },
  ]);
  A('anillo', 'ANILLO', /\b(anillos?|rings?|engagement|compromiso|wedding ring|sortija|alianza)\b/i, [
    { e: [0, 50, 100, 95], s: 16 }, { e: [0, 50, 100, 95], s: 6, i: 2 }, { e: [0, 50, 76, 72], f: 3, ft: .3, s: 0 },
    { p: 'M-50 -55 L-30 -105 H30 L50 -55 L0 -20 Z', f: 3, ft: .8, s: 8, m: 'beat', a: .06, o: [0, -50] }, { p: 'M-30 -105 L0 -20 L30 -105 M-50 -55 H50', s: 4 },
    { p: L.star(75, -110, 22, 4, .28), f: 2, ft: .9, s: 4, m: 'pulse', a: .3, o: [75, -110], v: 2 }, { p: L.star(-90, -85, 14, 4, .28), f: 2, ft: .9, s: 3, m: 'pulse', a: .3, o: [-90, -85], v: 2.6 },
  ], { moods: ['romantico'] });
  A('collar', 'COLLAR', /\b(collares?|necklace|pendants?|colgante|jewelry|joyas?|chain around|cadena de oro)\b/i, [
    { p: 'M-140 -110 C-140 60 -70 130 0 130 C70 130 140 60 140 -110', s: 6, m: 'sway', a: .02, o: [0, -110] }, { p: L.heart(0, 132, 4), f: 2, ft: .9, s: 7, m: 'pulse', a: .1, o: [0, 132] },
    { c: [-100, 40, 10], f: 3, ft: .8, s: 4 }, { c: [-60, 88, 10], f: 3, ft: .8, s: 4 }, { c: [60, 88, 10], f: 3, ft: .8, s: 4 }, { c: [100, 40, 10], f: 3, ft: .8, s: 4 },
  ]);
  A('maleta', 'MALETA', /\b(maletas?|suitcase|luggage|baggage|equipaje|packing|empacar|travel bag|bag(s)?)\b/i, [
    { p: L.rr(-140, -70, 280, 220, 20), f: 2, ft: .75, s: 9 }, { p: 'M-50 -70 V-110 H50 V-70', s: 9 }, { p: 'M-140 40 H140', s: 5 }, { p: L.rr(-24, 20, 48, 40, 6), f: 1, ft: .8, s: 5 },
    { p: 'M-90 -70 V150 M90 -70 V150', s: 5 }, { p: 'M-100 150 V175 M100 150 V175', s: 10 },
  ], { g: { r: -.05 } });
  A('billetera', 'BILLETERA', /\b(billeteras?|wallets?|purse|cartera|bolsillo|pocket|cash in hand)\b/i, [
    { p: L.rr(-150, -90, 300, 200, 26), f: 2, ft: .8, s: 9 }, { p: 'M-150 -30 H150', s: 6 }, { p: L.rr(60, 10, 100, 60, 14), f: 1, ft: .85, s: 7 }, { c: [95, 40, 10], f: -1, s: 4 },
    { p: L.rect(-100, -125, 130, 42), f: 3, ft: .8, s: 6, m: 'bob', a: 4 }, { p: 'M-70 -110 H0', s: 3 },
  ]);
  A('tijeras', 'TIJERAS', /\b(tijeras|scissors|cortar|cut it|corte|snip)\b/i, [
    { p: 'M-20 -10 L58 -172 L82 -162 L14 12 Z', f: -1, s: 8, m: 'sway', a: .1, o: [0, 0], v: 1.4 }, { p: 'M20 -10 L-58 -172 L-82 -162 L-14 12 Z', f: -1, s: 8, m: 'sway', a: -.1, o: [0, 0], v: 1.4 },
    { p: 'M-14 12 L-78 96 M14 12 L78 96', s: 10, m: 'sway', a: .06, o: [0, 0], v: 1.4 },
    { e: [-84, 122, 42, 34, -.4], f: 2, ft: .85, s: 9 }, { e: [84, 122, 42, 34, .4], f: 2, ft: .85, s: 9 }, { c: [0, 0, 10], f: 1, s: 5 },
  ]);
  A('martillo', 'MARTILLO', /\b(martillos?|hammers?|gavel|mazo|golpear|hammering|construct\w*)\b/i, [
    { p: L.rr(-20, -120, 40, 260, 10), f: 3, ft: .6, s: 9 }, { p: L.rr(-110, -170, 220, 70, 14), f: 1, ft: .85, s: 9 }, { p: 'M60 -170 L130 -190 V-100 L60 -100', f: 1, ft: .85, s: 7 },
    { p: 'M-20 -50 H20 M-20 0 H20 M-20 50 H20', s: 4 },
  ], { g: { r: -.5, dx: -10, dy: 20, s: .8 }, moods: ['desafiante'] });
  A('cuerda', 'CUERDA', /\b(cuerdas?|ropes?|knots?|nudo|tied|atad[oa]|string)\b/i, [
    { p: 'M-140 -80 C-60 -140 0 -20 60 -80 S140 -20 150 -100', s: 14, m: 'drift', a: 6 }, { p: 'M-140 -20 C-60 -80 0 40 60 -20 S140 40 150 -40', s: 14, m: 'drift', a: 6, ph: 1 },
    { p: 'M-130 50 C-60 -10 0 110 60 50 S140 110 150 30', s: 14, m: 'drift', a: 6, ph: 2 }, { p: 'M-130 120 C-60 60 0 170 60 120 S140 170 150 100', s: 6, m: 'drift', a: 6, ph: 3 },
    { p: 'M-140 -80 L-160 -100 M-140 -80 L-165 -70', s: 5 },
  ]);
  A('ancla', 'ANCLA', /\b(anclas?|anchors?|anclad[oa]|sailor|marinero|naval)\b/i, [
    { c: [0, -150, 28], s: 10 }, { p: 'M0 -122 V140', s: 14 }, { p: 'M-60 -80 H60', s: 12 },
    { p: 'M-140 40 C-140 130 -60 170 0 150 C60 170 140 130 140 40 M-140 40 L-170 70 M140 40 L170 70', s: 12, m: 'sway', a: .02, o: [0, -100] },
    { p: 'M0 150 V170', s: 8 }, { p: 'M-160 -190 C-90 -120 -40 -200 0 -180', s: 4, m: 'drift', a: 12 },
  ], { moods: ['triste', 'melancolico'] });
  A('escalera', 'ESCALERA', /\b(escaleras?|ladders?|stairs?|steps|peldaños?|subir|climb)\b/i, [
    { p: 'M-70 -180 L-95 180 M70 -180 L95 180', s: 12 }, { p: 'M-78 -120 H78 M-82 -60 H82 M-86 0 H86 M-90 60 H90 M-94 120 H94', s: 9 },
    { p: L.star(0, -195, 20, 5, .4), f: 2, ft: .9, s: 4, m: 'pulse', a: .3, o: [0, -195], v: 2 },
  ], { g: { s: .95 } });
  A('cadena', 'CADENA', /\b(cadenas?|chains?|encadenad[oa]|shackles|atado a)\b/i, [
    { e: [-110, -70, 60, 34, -.5], s: 12, m: 'sway', a: .03, o: [0, 0] }, { e: [-30, -20, 60, 34, .1], s: 12, m: 'sway', a: .03, o: [0, 0] }, { e: [50, 30, 60, 34, -.4], s: 12, m: 'sway', a: .03, o: [0, 0] },
    { e: [125, 85, 60, 34, .2], s: 12, m: 'sway', a: .03, o: [0, 0] }, { e: [-110, -70, 36, 14, -.5], f: -1, s: 0 },
  ], { moods: ['desafiante', 'oscuro'] });
  A('bombilla', 'BOMBILLA', /\b(bombillas?|light ?bulbs?|bulb|idea|bright idea|foco)\b/i, [
    { p: 'M0 -160 C-90 -160 -110 -70 -60 -10 C-45 10 -40 30 -40 50 H40 C40 30 45 10 60 -10 C110 -70 90 -160 0 -160 Z', f: 2, ft: .55, s: 9, m: 'pulse', a: .04, o: [0, -50] },
    { p: L.rr(-38, 50, 76, 60, 8), f: 1, ft: .75, s: 8 }, { p: 'M-30 78 H30', s: 4 }, { p: 'M-30 -30 L-15 20 L0 -10 L15 20 L30 -30', s: 5, m: 'beat', a: .1, o: [0, 0] },
    { p: 'M-125 -125 L-150 -140 M125 -125 L150 -140 M-140 -50 H-165 M140 -50 H165', s: 6, m: 'pulse', a: .12, o: [0, -60] },
  ], { moods: ['feliz', 'euforico'] });
  A('botella', 'BOTELLA', /\b(botellas?|bottles?|message in a bottle|embotellad\w*|bottle service)\b/i, [
    { p: 'M-30 -170 H30 V-100 C30 -80 70 -60 70 -20 V140 C70 165 -70 165 -70 140 V-20 C-70 -60 -30 -80 -30 -100 Z', f: 3, ft: .55, s: 9 },
    { p: 'M-38 -190 H38 V-165 H-38 Z', f: 1, ft: .9, s: 7 }, { p: 'M-70 10 H70 V90 H-70 Z', f: -1, s: 5 }, { c: [0, 50, 20], f: 2, ft: .85, s: 4, m: 'pulse', a: .1, o: [0, 50] },
    { p: 'M-45 -20 V120', s: 3, st: .6 }, { c: [10, -130, 6], s: 3, m: 'steam', a: 30 },
  ], { g: { r: .12 } });
  A('copa', 'COPA', /\b(copas?|wine glass|glass of wine|champagne|champa[nñ]a|brindis|toast|cheers|salud)\b/i, [
    { p: 'M-90 -150 H90 C90 -30 50 20 0 20 C-50 20 -90 -30 -90 -150 Z', f: 3, ft: .5, s: 9 }, { p: 'M-88 -90 C-40 -70 40 -110 88 -90 C82 -30 46 12 0 12 C-46 12 -82 -30 -88 -90 Z', f: 2, ft: .85, s: 0, m: 'drift', a: 3 },
    { p: 'M0 20 V140 M-60 150 H60', s: 12 }, { c: [40, -60, 8], s: 3, m: 'steam', a: 40 }, { c: [-30, -40, 6], s: 3, m: 'steam', a: 50, ph: .4 },
  ], { moods: ['euforico', 'romantico'] });
  A('taza', 'TAZA', /\b(tazas?|mugs?|cups?|coffee cup|caf[eé]|coffee|t[eé])\b/i, [
    { p: 'M-90 -60 H70 L60 90 C50 120 -80 120 -90 90 Z', f: 2, ft: .75, s: 9 }, { p: 'M70 -30 C130 -30 130 60 66 60', s: 9 }, { p: 'M-90 -60 C-90 -80 70 -80 70 -60', s: 6 },
    { p: 'M-40 -85 C-55 -110 -25 -125 -40 -150', s: 5, m: 'steam', a: 30 }, { p: 'M0 -85 C-15 -110 15 -125 0 -150', s: 5, m: 'steam', a: 34, ph: .3 }, { p: 'M40 -85 C25 -110 55 -125 40 -150', s: 5, m: 'steam', a: 30, ph: .6 },
    { p: 'M-40 20 L-10 50 L30 10', s: 4 },
  ], { moods: ['nostalgico', 'sereno'] });
  A('plato', 'PLATO', /\b(platos?|plates?|dish(es)?|dinner|cena|supper)\b/i, [
    { e: [0, 30, 170, 70], f: 3, ft: .45, s: 9 }, { e: [0, 30, 120, 44], f: -1, s: 6 }, { e: [0, 24, 84, 28], f: 2, ft: .5, s: 4 },
    { p: 'M-40 -30 C-60 -70 -20 -100 -40 -140 M20 -30 C0 -70 40 -100 20 -140', s: 5, m: 'steam', a: 50 },
  ]);
  A('cubiertos', 'CUBIERTOS', /\b(cubiertos?|forks?|knife|knives|spoons?|tenedor|cuchillo|cuchara|cutlery)\b/i, [
    { p: 'M-110 -160 V-40 C-110 -20 -70 -20 -70 -40 V-160 M-90 -160 V-40 M-90 -40 V160', s: 9 }, { p: 'M-90 -40 V160', s: 12 },
    { p: 'M20 -160 C-10 -100 -10 -20 20 20 V160', f: 1, ft: .8, s: 9 }, { e: [100, -90, 34, 60], f: 2, ft: .8, s: 9 }, { p: 'M100 -30 V160', s: 12 },
  ], { g: { r: .1 } });
  A('regalo', 'REGALO', /\b(regalos?|gifts?|presents?|obsequio|sorpresa|surprise)\b/i, [
    { p: L.rect(-120, -30, 240, 170), f: 2, ft: .8, s: 9 }, { p: L.rect(-135, -80, 270, 56), f: 2, ft: .55, s: 9 }, { p: L.rect(-24, -80, 48, 220), f: 3, ft: .85, s: 6 },
    { p: 'M0 -80 C-60 -150 -110 -110 -60 -80 M0 -80 C60 -150 110 -110 60 -80', f: 3, ft: .85, s: 8, m: 'pulse', a: .06, o: [0, -80], b: 1.5 }, { p: L.star(-100, 60, 14, 4, .3), f: -1, s: 3 },
  ], { moods: ['feliz'] });
  A('caja', 'CAJA', /\b(cajas?|boxes?|cardboard|carton|caja de cart[oó]n|package|paquete)\b/i, [
    { p: 'M-130 -60 L0 -120 L130 -60 L0 0 Z', f: 3, ft: .55, s: 9 }, { p: 'M-130 -60 V80 L0 140 V0', f: 2, ft: .65, s: 9 }, { p: 'M130 -60 V80 L0 140', f: 2, ft: .45, s: 9 },
    { p: 'M-40 -100 L90 -40', s: 7 }, { p: 'M-130 -60 L-160 -110 M130 -60 L160 -110', s: 6, m: 'flap', a: 0, o: [0, -60] },
  ]);
  A('pelota', 'PELOTA', /\b(pelotas?|balls?|bal[oó]n|soccer ball|f[uú]tbol|basketball|baloncesto)\b/i, [
    { c: [0, 0, 130], f: -1, s: 10, m: 'bob', a: 10 }, { p: L.star(0, 0, 55, 5, .95), f: 1, ft: .9, s: 6, m: 'spin', a: 1.2, o: [0, 0] },
    { p: 'M0 -55 V-130 M52 -17 L124 -40 M32 45 L76 106 M-32 45 L-76 106 M-52 -17 L-124 -40', s: 6, m: 'spin', a: 1.2, o: [0, 0] },
  ]);
  A('dados', 'DADOS', /\b(dados?|dice|gambl\w*|apostar|apuesta|bet|roll the dice|suerte|luck)\b/i, [
    { p: L.rr(-140, -80, 130, 130, 20), f: -1, s: 9, m: 'sway', a: .1, o: [-75, -15], v: .8 }, { c: [-110, -50, 11], f: 1 }, { c: [-40, 20, 11], f: 1 }, { c: [-75, -15, 11], f: 1 },
    { p: L.rr(10, 10, 130, 130, 20), f: 2, ft: .7, s: 9, m: 'sway', a: -.1, o: [75, 75], v: .8 }, { c: [40, 40, 11], f: -1 }, { c: [110, 40, 11], f: -1 }, { c: [40, 110, 11], f: -1 }, { c: [110, 110, 11], f: -1 },
  ]);
  A('cartas_poker', 'CARTAS', /\b(cartas de p[oó]ker|playing cards?|poker|ace of spades|as de|baraja|deck of cards|blackjack)\b/i, [
    { p: L.rr(-110, -130, 120, 180, 12), f: -1, s: 9, m: 'sway', a: -.05, o: [-50, 50] }, { p: L.rr(-50, -140, 120, 180, 12), f: -1, s: 9, m: 'sway', a: .02, o: [10, 40] },
    { p: L.rr(10, -125, 120, 180, 12), f: -1, s: 9, m: 'sway', a: .06, o: [70, 50] }, { p: L.heart(70, -50, 3.5), f: 2, ft: .95, s: 0, m: 'pulse', a: .1, o: [70, -50] },
    { p: 'M-20 -70 C-40 -100 -10 -110 -10 -85 C-10 -110 20 -100 0 -70 L-10 -55 Z', f: 1, ft: .9, s: 0 },
  ]);
  A('ficha', 'FICHA', /\b(fichas?|chips?|casino|poker chip|jackpot|slot machine|tragamonedas)\b/i, [
    { e: [0, 60, 130, 50], f: 2, ft: .8, s: 9 }, { e: [0, 30, 130, 50], f: 2, ft: .8, s: 9 }, { e: [0, 0, 130, 50], f: 3, ft: .8, s: 9 },
    { p: 'M-130 0 V60 M130 0 V60', s: 9 }, { e: [0, -30, 130, 50], f: 2, ft: .95, s: 9, m: 'bob', a: 4 }, { e: [0, -30, 80, 28], f: -1, s: 5 }, { p: L.star(0, -30, 12, 5, .4), f: 1, s: 0 },
  ]);
  A('espada', 'ESPADA', /\b(espadas?|swords?|blades?|filo|sable|dagger|daga|fight with)\b/i, [
    { p: 'M-14 -180 L14 -180 L20 60 H-20 Z', f: -1, s: 9 }, { p: 'M0 -170 V50', s: 3, st: .7 }, { p: 'M-90 60 H90 V84 H-90 Z', f: 2, ft: .9, s: 9 }, { p: 'M-14 84 V140 H14 V84', f: 1, ft: .8, s: 8 },
    { c: [0, 160, 22], f: 2, ft: .85, s: 8 }, { p: 'M14 -170 L60 -190 M-14 -140 L-50 -160', s: 4, m: 'pulse', a: .3, o: [0, -160], v: 3 },
  ], { g: { r: .35 }, moods: ['rabioso', 'desafiante'] });
  A('escudo', 'ESCUDO', /\b(escudos?|shields?|protect\w*|protecci[oó]n|armor|armadura|defens\w*)\b/i, [
    { p: 'M0 -170 C60 -150 110 -150 140 -160 C140 0 110 100 0 170 C-110 100 -140 0 -140 -160 C-110 -150 -60 -150 0 -170 Z', f: 1, ft: .8, s: 10 },
    { p: 'M0 -140 C50 -125 90 -125 118 -132 C116 -10 90 80 0 142 Z', f: 2, ft: .85, s: 5 }, { p: 'M0 -140 V142 M-118 -20 H118', s: 6 }, { p: L.star(0, -20, 34, 5, .45), f: 3, ft: .9, s: 5, m: 'pulse', a: .08, o: [0, -20] },
  ], { moods: ['desafiante'] });
  A('corona', 'CORONA', /\b(coronas?|crowns?|kings?|reyes|reyna|queens?|reinas?|royal\w*|reyes magos|throne|trono)\b/i, [
    { p: 'M-140 90 L-150 -60 L-75 20 L0 -120 L75 20 L150 -60 L140 90 Z', f: 2, ft: .85, s: 10 }, { p: L.rect(-140, 90, 280, 40), f: 1, ft: .8, s: 9 },
    { c: [-150, -70, 16], f: 3, ft: .85, s: 6, m: 'pulse', a: .2, o: [-150, -70] }, { c: [0, -130, 18], f: 3, ft: .85, s: 6, m: 'pulse', a: .2, o: [0, -130] }, { c: [150, -70, 16], f: 3, ft: .85, s: 6, m: 'pulse', a: .2, o: [150, -70] },
    { c: [-60, 110, 8], f: -1, s: 0 }, { c: [0, 110, 8], f: -1, s: 0 }, { c: [60, 110, 8], f: -1, s: 0 },
  ], { moods: ['desafiante', 'euforico'] });
  A('trofeo', 'TROFEO', /\b(trofeos?|trophy|champions?|campe[oó]n\w*|winner|ganador|copa del mundo|world cup|victory|victoria|win\w*)\b/i, [
    { p: 'M-90 -150 H90 C90 -50 60 20 0 30 C-60 20 -90 -50 -90 -150 Z', f: 2, ft: .85, s: 10 }, { p: 'M-90 -130 C-160 -130 -150 -50 -80 -40 M90 -130 C160 -130 150 -50 80 -40', s: 9 },
    { p: 'M0 30 V90', s: 14 }, { p: L.rr(-60, 90, 120, 34, 8), f: 1, ft: .85, s: 9 }, { p: L.rr(-85, 124, 170, 30, 8), f: 1, ft: .6, s: 9 }, { p: L.star(0, -70, 30, 5, .45), f: -1, s: 5, m: 'pulse', a: .2, o: [0, -70] },
  ], { moods: ['euforico', 'desafiante'] });

  // ---------- segunda tanda ----------
  A('medalla', 'MEDALLA', /\b(medallas?|medals?|podium|podio|gold medal|oro ol[ií]mpico)\b/i, [
    { p: 'M-70 -170 L-10 -60 M70 -170 L10 -60', s: 12 }, { p: 'M-90 -170 H-40 L10 -70 M90 -170 H40 L-10 -70', f: 3, ft: .7, s: 6 },
    { c: [0, 30, 90], f: 2, ft: .9, s: 10, m: 'sway', a: .05, o: [0, -60] }, { c: [0, 30, 62], f: -1, s: 6 }, { p: L.star(0, 30, 42, 5, .45), f: 2, ft: .85, s: 5 },
  ]);
  A('campana', 'CAMPANA', /\b(campanas?|bells?|church bell|ring the bell|campanario|tolling|doblar)\b/i, [
    { p: 'M-110 100 C-110 20 -90 -20 -70 -70 C-50 -130 50 -130 70 -70 C90 -20 110 20 110 100 Z', f: 2, ft: .8, s: 10, m: 'sway', a: .12, o: [0, -130], b: 1.5 },
    { p: 'M-125 100 H125', s: 10, m: 'sway', a: .12, o: [0, -130], b: 1.5 }, { c: [0, 128, 22], f: 1, ft: .9, s: 8, m: 'sway', a: .3, o: [0, -130] }, { p: 'M0 -130 V-165', s: 9 },
  ]);
  A('linterna', 'LINTERNA', /\b(linternas?|flashlight|torch|lantern|farol|in the dark with)\b/i, [
    { p: 'M-40 -30 H40 L60 -80 H-60 Z', f: 2, ft: .85, s: 9 }, { p: L.rr(-40, -30, 80, 190, 14), f: 1, ft: .85, s: 9 }, { p: 'M-60 -80 L-150 -160 M60 -80 L150 -160', s: 5, m: 'pulse', a: .1, o: [0, -80] },
    { p: 'M-30 -120 L30 -120', s: 4, m: 'drift', a: 20 }, { c: [0, 40, 12], f: 2, ft: .9, s: 5 },
  ]);
  A('pincel', 'PINCEL', /\b(pinceles?|paintbrush|brush|pintar|painting|paint(er)?|pintura|arte|art)\b/i, [
    { p: 'M-150 150 L100 -100', s: 16 }, { p: 'M90 -110 C110 -170 160 -170 170 -150 C170 -100 120 -60 80 -80 Z', f: 2, ft: .9, s: 9, m: 'wag', a: .03, o: [90, -100] }, { p: 'M60 -80 L90 -50 L110 -70 L80 -100 Z', f: 1, ft: .8, s: 6 },
    { p: 'M-160 160 C-130 110 -90 150 -60 120 C-30 160 30 130 60 150', s: 6, i: 2, m: 'drift', a: 4 }, { c: [-100, 130, 8], f: 2, ft: .9, s: 0 },
  ]);
  A('lapiz', 'LÁPIZ', /\b(l[aá]pi(z|ces)|pencils?|escribir|writing|pens?|bol[ií]grafo|pluma fuente|draw)\b/i, [
    { p: 'M-140 -80 L100 -80 L160 0 L100 80 L-140 80 Z', f: 2, ft: .85, s: 9 }, { p: 'M100 -80 L160 0 L100 80', f: -1, s: 7 }, { p: 'M135 -35 L160 0 L135 35', f: 1, ft: .95, s: 4 },
    { p: 'M-90 -80 V80 M-50 -80 V80', s: 4 }, { p: L.rect(-170, -80, 30, 160), f: 3, ft: .6, s: 8 }, { p: 'M170 0 C190 -20 200 20 190 10', s: 4 },
  ], { g: { r: -.5, s: .9 } });
  A('maquina_escribir', 'MÁQUINA DE ESCRIBIR', /\b(m[aá]quina de escribir|typewriter|typing|escritor|writer|poeta|poem|poema|poet)\b/i, [
    { p: L.rr(-140, 0, 280, 130, 18), f: 1, ft: .85, s: 9 }, { p: L.rect(-100, -110, 200, 110), f: -1, s: 8 }, { p: 'M-70 -80 H70 M-70 -50 H40 M-70 -20 H60', s: 4, m: 'drift', a: 6 },
    { p: L.rr(-150, -20, 30, 24, 8), f: 2, ft: .9, s: 6 }, { p: L.rr(120, -20, 30, 24, 8), f: 2, ft: .9, s: 6 },
    { c: [-90, 50, 12], f: -1, s: 4, m: 'beat', a: .2, o: [-90, 50] }, { c: [-45, 50, 12], f: -1, s: 4 }, { c: [0, 50, 12], f: -1, s: 4, m: 'beat', a: .2, o: [0, 50] }, { c: [45, 50, 12], f: -1, s: 4 }, { c: [90, 50, 12], f: -1, s: 4 },
    { p: 'M-80 92 H80', s: 5 },
  ], { moods: ['nostalgico'] });
  A('gafas', 'GAFAS', /\b(gafas|lentes|glasses|eyeglasses|spectacles|see clearly|ver claro)\b/i, [
    { c: [-75, 0, 65], f: 3, ft: .35, s: 10 }, { c: [75, 0, 65], f: 3, ft: .35, s: 10 }, { p: 'M-10 -10 C-3 -22 3 -22 10 -10', s: 8 }, { p: 'M-140 -8 L-175 -40 M140 -8 L175 -40', s: 9 },
    { p: 'M-105 -30 L-70 -50 M45 -30 L80 -50', s: 4, m: 'drift', a: 6 },
  ]);
  A('gafas_sol', 'GAFAS DE SOL', /\b(gafas de sol|sunglasses|shades|cool guy|wayfarer)\b/i, [
    { p: 'M-150 -40 H-10 C-10 40 -40 80 -80 80 C-120 80 -150 40 -150 -40 Z', f: 1, ft: .95, s: 9 }, { p: 'M10 -40 H150 C150 40 120 80 80 80 C40 80 10 40 10 -40 Z', f: 1, ft: .95, s: 9 },
    { p: 'M-10 -30 C-3 -50 3 -50 10 -30', s: 9 }, { p: 'M-150 -30 L-180 -60 M150 -30 L180 -60', s: 9 }, { p: 'M-125 -15 L-90 -15 M35 -15 L70 -15', s: 4, m: 'drift', a: 8, i: 2 },
  ], { moods: ['euforico', 'desafiante'] });
  A('reloj_pulsera', 'RELOJ', /\b(reloj de pulsera|wristwatch|watch|rolex|smartwatch)\b/i, [
    { p: 'M-50 -150 H50 L60 -60 H-60 Z', f: 1, ft: .7, s: 8 }, { p: 'M-50 150 H50 L60 60 H-60 Z', f: 1, ft: .7, s: 8 }, { c: [0, 0, 82], f: 2, ft: .55, s: 10 }, { c: [0, 0, 62], f: -1, s: 6 },
    { p: 'M0 0 V-40', s: 7, m: 'spin', a: .1, o: [0, 0] }, { p: 'M0 0 H36', s: 5, m: 'spin', a: 1, o: [0, 0] }, { p: 'M0 -62 V-52 M0 52 V62 M-62 0 H-52 M52 0 H62', s: 4 },
  ]);
  A('despertador', 'DESPERTADOR', /\b(despertadores?|alarm clock|wake up|despierta|snooze|3 ?a\.?m|alarma)\b/i, [
    { c: [0, 20, 118], f: 2, ft: .7, s: 10 }, { c: [0, 20, 90], f: -1, s: 6 }, { p: 'M0 20 V-40', s: 8, m: 'spin', a: .2, o: [0, 20] }, { p: 'M0 20 L40 40', s: 6, m: 'spin', a: 1.4, o: [0, 20] },
    { e: [-90, -100, 44, 30, -.5], f: 1, ft: .9, s: 8, m: 'wag', a: .1, o: [-90, -100] }, { e: [90, -100, 44, 30, .5], f: 1, ft: .9, s: 8, m: 'wag', a: -.1, o: [90, -100] }, { p: 'M-70 130 L-95 170 M70 130 L95 170', s: 9 },
    { p: 'M-150 -60 L-175 -75 M150 -60 L175 -75', s: 5, m: 'pulse', a: .2, o: [0, 0], v: 3 },
  ]);
  A('calendario', 'CALENDARIO', /\b(calendarios?|calendar|date|fecha|monday|lunes|birthday date|d[ií]as?)\b/i, [
    { p: L.rr(-130, -120, 260, 270, 14), f: -1, s: 9 }, { p: L.rect(-130, -120, 260, 70), f: 2, ft: .85, s: 9 }, { p: 'M-70 -150 V-100 M70 -150 V-100', s: 11 },
    { p: 'M-90 -10 H90 M-90 40 H90 M-90 90 H90 M-30 -30 V120 M30 -30 V120', s: 3 }, { c: [30, 65, 22], s: 6, i: 2, m: 'pulse', a: .1, o: [30, 65] }, { p: 'M-20 55 L30 75', s: 0 },
  ]);
  A('balanza', 'BALANZA', /\b(balanzas?|scales?|justice|justicia|balance|equilibrio|weigh|peso)\b/i, [
    { p: 'M0 -160 V140 M-60 150 H60', s: 12 }, { p: 'M-130 -110 H130', s: 10, m: 'sway', a: .06, o: [0, -110], v: .9 },
    { p: 'M-130 -110 L-170 10 H-90 Z', f: 2, ft: .85, s: 8, m: 'sway', a: .06, o: [0, -110], v: .9 }, { p: 'M130 -110 L90 10 H170 Z', f: 3, ft: .85, s: 8, m: 'sway', a: .06, o: [0, -110], v: .9 },
    { p: 'M-170 10 C-170 40 -90 40 -90 10 M90 10 C90 40 170 40 170 10', s: 8, m: 'sway', a: .06, o: [0, -110], v: .9 }, { c: [0, -165, 14], f: 1, s: 6 },
  ]);
  A('cofre_tesoro', 'COFRE DEL TESORO', /\b(cofres?|treasure chest|tesoros?|treasures?|piratas?|pirates?|booty|botín)\b/i, [
    { p: 'M-140 -20 C-140 -120 140 -120 140 -20 Z', f: 2, ft: .75, s: 10, m: 'flap', a: 0, o: [0, -20] }, { p: L.rect(-140, -20, 280, 150), f: 2, ft: .55, s: 10 }, { p: 'M-60 -20 V130 M60 -20 V130', s: 7 },
    { p: L.rr(-24, -10, 48, 56, 8), f: 1, ft: .9, s: 7 }, { c: [0, 20, 8], f: -1 }, { p: L.star(-100, -80, 16, 4, .3), f: 3, ft: .9, s: 4, m: 'pulse', a: .4, o: [-100, -80], v: 3 }, { p: L.star(100, -100, 12, 4, .3), f: 3, ft: .9, s: 4, m: 'pulse', a: .4, o: [100, -100], v: 2 },
  ]);
  A('lupa', 'LUPA', /\b(lupas?|magnifying glass|search|buscar|detective|investigat\w*|looking for|busco|find)\b/i, [
    { c: [-40, -40, 100], f: 3, ft: .3, s: 11 }, { c: [-40, -40, 80], s: 4, i: 2 }, { p: 'M30 30 L140 140', s: 20 }, { p: 'M35 35 L120 120', s: 8, i: 2 },
    { p: 'M-90 -60 C-70 -95 -40 -105 -10 -95', s: 5, m: 'pulse', a: .06, o: [-40, -40] },
  ]);
  A('pluma', 'PLUMA', /\b(plumas?|feathers?|quill|ligero|light as|pluma de ave|plumaje)\b/i, [
    { p: 'M-140 150 C-100 40 -20 -130 130 -160 C100 -60 30 40 -140 150 Z', f: 3, ft: .6, s: 9, m: 'sway', a: .05, o: [-140, 150] }, { p: 'M-140 150 C-40 40 40 -60 130 -160', s: 7 },
    { p: 'M-60 60 L-20 70 M-30 20 L20 30 M0 -20 L50 -10 M30 -60 L80 -50', s: 4 }, { p: 'M-140 150 L-170 175', s: 8 },
  ]);
  A('pala', 'PALA', /\b(palas?|shovels?|dig|cavar|dug|excav\w*|grave digger|bury)\b/i, [
    { p: 'M-30 -170 H30 M0 -170 V0', s: 12 }, { p: 'M-70 -10 C-70 100 -40 150 0 170 C40 150 70 100 70 -10 Z', f: 1, ft: .75, s: 10 }, { p: 'M0 -10 V150', s: 4 },
    { p: 'M-110 170 C-70 150 -40 180 0 165 C40 180 80 150 110 170', s: 5, i: 2, m: 'drift', a: 4 },
  ], { g: { r: .35 } });
  A('hacha', 'HACHA', /\b(hachas?|axe|lumberjack|le[nñ]ador|chop|talar|woodcutter)\b/i, [
    { p: 'M-40 170 L-8 -150 L14 -146 L-14 172 Z', f: 3, ft: .65, s: 9 }, { p: 'M-6 -150 C40 -195 130 -170 150 -100 C120 -125 90 -115 60 -80 C40 -90 20 -100 12 -120 Z', f: 1, ft: .9, s: 10 },
    { p: 'M40 -150 C80 -160 110 -145 125 -115', s: 4, i: 2 }, { p: 'M-30 90 L-22 30 M-34 130 L-28 60', s: 4 },
  ], { g: { r: .2, s: .95 } });
  A('rueda', 'RUEDA', /\b(ruedas?|wheels?|tire|llanta|neum[aá]tico|rolling|spinning wheel)\b/i, [
    { c: [0, 0, 140], f: 1, ft: .9, s: 11, m: 'spin', a: 1.6, o: [0, 0] }, { c: [0, 0, 92], f: 3, ft: .5, s: 7, m: 'spin', a: 1.6, o: [0, 0] }, { c: [0, 0, 22], f: 2, ft: .9, s: 6 },
    { p: 'M0 -92 V92 M-92 0 H92 M-65 -65 L65 65 M65 -65 L-65 65', s: 5, m: 'spin', a: 1.6, o: [0, 0] },
  ]);
  A('cuna', 'CUNA', /\b(cunas?|cradle|crib|baby|beb[eé]s?|newborn|reci[eé]n nacido|lullaby|canci[oó]n de cuna)\b/i, [
    { p: 'M-150 -20 C-150 100 150 100 150 -20 Z', f: 3, ft: .7, s: 10, m: 'sway', a: .05, o: [0, -100], v: .8 }, { p: 'M-150 -20 V-110 M150 -20 V-110', s: 10, m: 'sway', a: .05, o: [0, -100], v: .8 },
    { p: 'M-100 -20 C-100 -90 100 -90 100 -20', f: 2, ft: .6, s: 7, m: 'sway', a: .05, o: [0, -100], v: .8 }, { p: L.heart(0, 30, 3.5), f: 2, ft: .9, s: 0 }, { p: 'M-170 100 C-100 130 100 130 170 100', s: 8 },
  ], { moods: ['sereno', 'romantico'] });
  A('columpio', 'COLUMPIO', /\b(columpios?|swings?|swing set|playground|parque infantil|niñez|childhood)\b/i, [
    { p: 'M-140 170 L-100 -150 H100 L140 170', s: 12 }, { p: 'M-40 -150 V70 M40 -150 V70', s: 6, m: 'sway', a: .12, o: [0, -150] }, { p: L.rr(-60, 70, 120, 20, 8), f: 2, ft: .9, s: 8, m: 'sway', a: .12, o: [0, -150] },
    { c: [0, 30, 20], f: -1, s: 5, m: 'sway', a: .12, o: [0, -150] },
  ], { moods: ['nostalgico', 'feliz'] });
  A('buzon', 'BUZÓN', /\b(buz[oó]n|mailbox|post ?box|send a letter|correo)\b/i, [
    { p: 'M-90 -20 C-90 -140 90 -140 90 -20 V90 H-90 Z', f: 1, ft: .85, s: 10 }, { p: 'M-50 -20 H50', s: 8 }, { p: L.rect(-50, -20, 100, 20), f: -1, s: 6 }, { p: 'M0 90 V170 M-40 170 H40', s: 12 },
    { p: L.rect(-60, -110, 60, 40), f: 2, ft: .85, s: 5, m: 'sway', a: -.1, o: [-60, -70] }, { p: 'M40 30 L70 0', s: 4 },
  ]);
  A('semaforo', 'SEMÁFORO', /\b(sem[aá]foros?|traffic lights?|red light|luz roja|green light|luz verde|stoplight|stop)\b/i, [
    { p: L.rr(-50, -170, 100, 260, 20), f: 1, ft: .9, s: 10 }, { c: [0, -120, 28], f: 2, ft: .95, s: 6, m: 'pulse', a: .1, o: [0, -120] }, { c: [0, -50, 28], f: 3, ft: .6, s: 6 }, { c: [0, 20, 28], f: 3, ft: .3, s: 6 },
    { p: 'M0 90 V180 M-30 180 H30', s: 12 },
  ]);
  A('farola', 'FAROLA', /\b(farolas?|street ?lights?|streetlamp|lamp post|poste de luz|alumbrado)\b/i, [
    { p: 'M0 170 V-100 C0 -150 30 -160 80 -160', s: 12 }, { p: 'M50 -160 H130 L120 -125 H60 Z', f: 2, ft: .85, s: 8 }, { p: L.rr(-30, 150, 60, 24, 8), f: 1, ft: .8, s: 8 },
    { p: 'M70 -120 L40 -20 M90 -120 V0 M110 -120 L140 -20', s: 3, m: 'pulse', a: .1, o: [90, -125] }, { p: 'M-10 120 H10', s: 7 },
  ], { moods: ['melancolico', 'oscuro'] });
  A('banco_parque', 'BANCO DE PARQUE', /\b(banco del parque|park bench|bench|banca|sitting alone|sentad[oa] solo)\b/i, [
    { p: 'M-150 -60 H150 M-150 -20 H150', s: 11 }, { p: 'M-140 -80 V60 M140 -80 V60', s: 10 }, { p: L.rr(-160, 20, 320, 30, 8), f: 2, ft: .8, s: 9 }, { p: 'M-120 50 V150 M120 50 V150', s: 10 },
    { p: 'M-60 -60 V20 M0 -60 V20 M60 -60 V20', s: 5 }, { p: 'M-40 165 C-10 150 30 175 70 160', s: 4, i: 2, m: 'drift', a: 6 },
  ], { moods: ['melancolico', 'nostalgico'] });
  A('fuente', 'FUENTE', /\b(fuentes?|fountains?|make a wish|pide un deseo|wishing well|pozo)\b/i, [
    { p: 'M-150 90 C-150 30 150 30 150 90 Z', f: 3, ft: .6, s: 10 }, { p: 'M-120 90 V150 H120 V90', f: 3, ft: .35, s: 9 }, { p: 'M0 30 V-100', s: 12 }, { p: 'M-60 -100 C-60 -140 60 -140 60 -100 Z', f: 3, ft: .6, s: 9 },
    { p: 'M0 -140 C-30 -190 -90 -140 -110 -60 M0 -140 C30 -190 90 -140 110 -60', s: 5, m: 'pulse', a: .05, o: [0, -120] }, { c: [-40, -40, 8], s: 3, m: 'fall', a: 60 }, { c: [40, -30, 8], s: 3, m: 'fall', a: 60, ph: .5 },
    { p: 'M-100 60 C-60 50 -40 70 0 60 S60 50 100 60', s: 4, i: 2, m: 'drift', a: 6 },
  ]);
  A('cortina', 'CORTINA', /\b(cortinas?|curtains?|drapes?|blinds?|persianas?|telón|curtain call)\b/i, [
    { p: 'M-160 -160 H160', s: 11 }, { p: 'M-150 -160 C-120 -60 -130 40 -150 150 H-40 C-60 40 -50 -60 -30 -160 Z', f: 2, ft: .8, s: 9, m: 'sway', a: .03, o: [-90, -160] },
    { p: 'M150 -160 C120 -60 130 40 150 150 H40 C60 40 50 -60 30 -160 Z', f: 2, ft: .8, s: 9, m: 'sway', a: -.03, o: [90, -160] }, { p: 'M-110 -140 C-120 0 -110 100 -100 150 M-70 -140 C-80 0 -70 100 -60 150', s: 4 },
    { p: 'M110 -140 C120 0 110 100 100 150 M70 -140 C80 0 70 100 60 150', s: 4 },
  ]);
  A('chimenea', 'CHIMENEA', /\b(chimeneas?|fireplace|hearth|hogar de le[nñ]a|christmas eve|fuego del hogar)\b/i, [
    { p: L.rect(-150, -140, 300, 290), f: 1, ft: .5, s: 10 }, { p: 'M-110 150 V-40 C-110 -100 110 -100 110 -40 V150', f: -1, s: 9 }, { p: L.rect(-165, -160, 330, 26), f: 2, ft: .7, s: 9 },
    { p: 'M-30 150 C-60 90 -20 60 0 20 C10 60 60 90 30 150 Z', f: 2, ft: .95, s: 6, m: 'sway', a: .06, o: [0, 150], b: 2 }, { p: 'M-70 150 H70', s: 8 },
  ], { moods: ['nostalgico', 'romantico'] });
  A('cometa_papalote', 'PAPALOTE', /\b(papalotes?|cometas? de papel|kite|volar un papalote|fly a kite|barrilete|chiringa)\b/i, [
    { p: 'M0 -160 L90 -40 L0 60 L-90 -40 Z', f: 2, ft: .85, s: 9, m: 'sway', a: .06, o: [0, 60] }, { p: 'M0 -160 V60 M-90 -40 H90', s: 5, m: 'sway', a: .06, o: [0, 60] },
    { p: 'M0 60 C-40 100 40 130 0 170 C-30 200 30 200 20 210', s: 5, m: 'drift', a: 10 }, { p: 'M-20 90 L-40 110 L-20 120 M10 130 L-10 150 L10 160', f: 3, ft: .8, s: 4, m: 'drift', a: 10 },
  ], { g: { dy: -10, s: .9 }, moods: ['feliz', 'nostalgico'] });
  A('osito', 'OSITO DE PELUCHE', /\b(osito|peluches?|teddy( bear)?|stuffed animal|juguetes? de peluche|plush)\b/i, [
    { c: [-70, -105, 32], f: 2, ft: .85, s: 9 }, { c: [70, -105, 32], f: 2, ft: .85, s: 9 }, { c: [0, -50, 80], f: 2, ft: .85, s: 10 }, { e: [0, 90, 80, 90], f: 2, ft: .75, s: 10 },
    { e: [0, -30, 32, 26], f: 3, ft: .6, s: 6 }, { c: [-28, -66, 9], f: 1, m: 'blink', o: [-28, -66] }, { c: [28, -66, 9], f: 1, m: 'blink', o: [28, -66] }, { p: 'M-8 -34 L8 -34 L0 -22 Z', f: 1, s: 4 },
    { p: 'M-80 30 C-130 40 -140 90 -100 100 M80 30 C130 40 140 90 100 100', f: 2, ft: .85, s: 9, m: 'sway', a: .06, o: [0, 30] }, { p: L.heart(0, 95, 3.2), f: 3, ft: .9, s: 0 },
  ], { moods: ['nostalgico', 'triste', 'romantico'] });
  A('globo_terraqueo', 'GLOBO TERRÁQUEO', /\b(globo terr[aá]queo|globe|world map|around the world|alrededor del mundo|el mundo entero|whole world)\b/i, [
    { c: [0, -10, 120], f: 3, ft: .55, s: 10 }, { p: 'M-70 -60 C-40 -90 -10 -50 -20 -20 C-40 10 -90 -10 -70 -60 Z M30 10 C70 0 100 40 70 80 C40 70 20 40 30 10 Z', f: 2, ft: .85, s: 5, m: 'drift', a: 8 },
    { p: 'M-120 -10 C-60 40 60 40 120 -10', s: 4 }, { p: 'M0 -130 V110', s: 4 }, { p: 'M-150 -80 C-80 -180 80 -180 150 -80', s: 8 }, { p: 'M0 110 V145 M-50 155 H50', s: 12 },
  ]);
  A('jaula', 'JAULA', /\b(jaulas?|cages?|caged|enjaulad[oa]|trapped|atrapad[oa]|prison|pris[oi][oó]n|c[aá]rcel|jail)\b/i, [
    { p: 'M-110 90 C-110 -90 110 -90 110 90 Z', f: 3, ft: .25, s: 9 }, { p: 'M-60 90 C-60 -80 -30 -70 -25 90 M0 90 V-80 M60 90 C60 -80 30 -70 25 90', s: 6 }, { p: 'M-110 90 H110 V115 H-110 Z', f: 2, ft: .8, s: 8 },
    { p: 'M0 -110 V-150 C-10 -170 10 -170 0 -150', s: 8 }, { p: 'M-30 20 C-10 0 20 0 30 20 C20 50 -20 50 -30 20 Z', f: 2, ft: .9, s: 5, m: 'bob', a: 4 }, { c: [20, 12, 4], f: 1, s: 0 },
  ], { moods: ['triste', 'oscuro', 'rabioso'] });
  A('telescopio', 'TELESCOPIO', /\b(telescopios?|telescope|binoculars?|prism[aá]ticos?|stargaz\w*|looking at the stars|mirando las estrellas)\b/i, [
    { p: 'M-140 40 L100 -90 L130 -40 L-110 90 Z', f: 2, ft: .8, s: 10, m: 'sway', a: .03, o: [0, 60] }, { p: 'M100 -90 L150 -120 L170 -85 L130 -40 Z', f: 1, ft: .9, s: 8 }, { p: 'M-140 40 L-110 90', s: 9 },
    { p: 'M0 50 L-60 170 M0 50 L60 170 M0 50 V150', s: 9 }, { p: L.star(130, -160, 18, 4, .3), f: 3, ft: .9, s: 4, m: 'pulse', a: .3, o: [130, -160], v: 2 },
  ]);
  A('arco_flecha', 'ARCO Y FLECHA', /\b(arcos? y flechas?|bow and arrow|arrows?|flechas?|archer\w*|arquero|cupid|cupido)\b/i, [
    { p: 'M-40 -170 C130 -110 130 110 -40 170', s: 12 }, { p: 'M-40 -170 L-40 170', s: 4 }, { p: 'M-40 0 H140 M140 0 L110 -25 M140 0 L110 25', s: 8, m: 'drift', a: 8 }, { p: 'M-40 0 L-70 -20 M-40 0 L-70 20', s: 6, m: 'drift', a: 8 },
    { p: L.heart(150, 0, 3), f: 2, ft: .9, s: 0, m: 'pulse', a: .15, o: [150, 0] },
  ], { moods: ['romantico'] });
  A('diana', 'DIANA', /\b(dianas?|targets?|bullseye|objetivo|goal|meta|aim|apuntar|hit the mark)\b/i, [
    { c: [0, 0, 150], f: 2, ft: .85, s: 10 }, { c: [0, 0, 110], f: -1, s: 7 }, { c: [0, 0, 70], f: 2, ft: .85, s: 7 }, { c: [0, 0, 30], f: 1, ft: .9, s: 6, m: 'pulse', a: .15, o: [0, 0] },
    { p: 'M0 0 L130 -130 M130 -130 L100 -130 M130 -130 L130 -100', s: 8, m: 'beat', a: .05, o: [0, 0] },
  ]);
  A('ladrillos', 'LADRILLOS', /\b(ladrillos?|bricks?|wall|pared|muro|walls?|brick wall|tear down)\b/i, [
    { p: L.rect(-150, -120, 300, 240), f: 2, ft: .6, s: 10 }, { p: 'M-150 -60 H150 M-150 0 H150 M-150 60 H150', s: 6 }, { p: 'M-50 -120 V-60 M50 -60 V0 M-50 0 V60 M50 60 V120 M-100 60 V120', s: 6 },
    { p: 'M0 -60 V0 M-100 -60 V0 M100 -120 V-60 M100 0 V60 M0 60 V120', s: 6 }, { p: 'M60 20 L100 60 L80 90 L120 120', s: 4, i: 2, m: 'beat', a: .05, o: [0, 0] },
  ]);
  A('bandera_asta', 'BANDERA', /\b(bandera|flag|banner|estandarte|colors of the flag)\b/i, [
    { p: 'M-110 -170 V170', s: 12 }, { c: [-110, -178, 10], f: 2, ft: .9, s: 6 },
    { p: 'M-104 -160 C-50 -190 20 -130 80 -160 C130 -180 150 -150 150 -150 V-40 C120 -30 90 -60 40 -30 C-10 -10 -50 -50 -104 -30 Z', f: 2, ft: .85, s: 9, m: 'drift', a: 6 },
    { p: L.star(20, -95, 28, 5, .45), f: -1, s: 5, m: 'drift', a: 6 },
  ]);
})();
