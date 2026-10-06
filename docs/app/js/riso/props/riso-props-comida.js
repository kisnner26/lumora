// ============================================================
// riso-props-comida.js — comida y bebida (oleada 2 del catálogo). Ver riso-props-lib.js.
// ============================================================
(() => {
  const R = window.RISO; if (!R || !R.lib) return;
  const { add, L } = R.lib, C = 'comida';
  const A = (id, label, rx, shapes, opt) => add(id, C, label, rx, shapes, opt);
  const leaf = (x, y, r = 0, k = 1) => ({ p: `M${x} ${y} C${x - 40 * k} ${y - 30 * k} ${x - 30 * k} ${y - 80 * k} ${x + 10 * k} ${y - 90 * k} C${x + 40 * k} ${y - 50 * k} ${x + 30 * k} ${y - 20 * k} ${x} ${y} Z`, f: 1, ft: .9, s: 6, m: 'sway', a: .05, o: [x, y] });

  A('pan', 'PAN', /\b(pan|panes|bread|toast|tostadas?|panader[ií]a|bakery|baguette)\b/i, [
    { p: 'M-150 30 C-170 -60 -110 -110 0 -110 C110 -110 170 -60 150 30 V110 H-150 Z', f: 2, ft: .7, s: 9 }, { p: 'M-70 -90 L-90 -20 M0 -100 L-10 -20 M70 -90 L60 -20', s: 6 },
    { p: 'M-150 110 H150', s: 9 }, { p: 'M-30 -150 C-50 -175 -20 -185 -30 -200', s: 4, m: 'steam', a: 20 },
  ], { moods: ['nostalgico', 'sereno'] });
  A('pizza', 'PIZZA', /\b(pizzas?|pizzer[ií]a|pepperoni)\b/i, [
    { p: 'M0 170 L-120 -80 C-60 -120 60 -120 120 -80 Z', f: 2, ft: .7, s: 9 }, { p: 'M-125 -75 C-60 -125 60 -125 125 -75', s: 14 },
    { c: [-30, -40, 20], f: 1, ft: .9, s: 6 }, { c: [40, -30, 18], f: 1, ft: .9, s: 6 }, { c: [0, 40, 18], f: 1, ft: .9, s: 6 }, { c: [-10, 100, 12], f: 1, ft: .9, s: 5 },
    { p: 'M-20 -70 C-30 -50 -10 -50 -20 -20', s: 4, m: 'drift', a: 4 },
  ], { moods: ['feliz', 'euforico'] });
  A('hamburguesa', 'HAMBURGUESA', /\b(hamburguesas?|burgers?|hamburger|cheeseburger|mcdonald\w*)\b/i, [
    { p: 'M-150 -20 C-150 -130 150 -130 150 -20 Z', f: 2, ft: .8, s: 9 }, { p: 'M-60 -80 L-50 -75 M0 -95 L10 -90 M60 -80 L70 -75', s: 5 },
    { p: 'M-160 -10 C-130 20 -100 -20 -70 10 C-40 -20 -10 20 20 -10 C50 20 80 -20 110 10 C130 -10 150 10 160 -10 Z', f: 1, ft: .9, s: 6 },
    { p: L.rr(-155, 10, 310, 36, 16), f: 3, ft: .9, s: 8 }, { p: 'M-150 60 H150 V80 C150 130 -150 130 -150 80 Z', f: 2, ft: .8, s: 9 },
  ], { moods: ['feliz', 'euforico'] });
  A('taco', 'TACO', /\b(tacos?|burritos?|quesadillas?|tortillas?|nachos?|tex.?mex)\b/i, [
    { p: 'M-160 60 C-160 -100 160 -100 160 60 Z', f: 2, ft: .8, s: 9 }, { p: 'M-140 40 C-100 -60 100 -60 140 40', s: 5 },
    { p: 'M-110 -40 C-90 -80 -60 -70 -40 -85 C-20 -110 20 -100 30 -80 C60 -100 90 -70 100 -40', f: 1, ft: .9, s: 6, m: 'bob', a: 2 },
    { c: [-30, -10, 14], f: 3, ft: .8, s: 5 }, { c: [40, -20, 12], f: 3, ft: .8, s: 5 }, { p: 'M-190 130 H190', s: 8 },
  ], { moods: ['feliz'] });
  A('sushi', 'SUSHI', /\b(sushi|maki|nigiri|sashimi|onigiri|ramen|wasabi)\b/i, [
    { c: [-70, 30, 70], f: -1, s: 9 }, { c: [-70, 30, 44], f: 1, ft: .9, s: 5 }, { c: [-70, 30, 20], f: 3, ft: .7, s: 5 },
    { p: L.rr(20, 20, 160, 70, 30), f: -1, s: 9 }, { p: 'M20 40 C60 -30 140 -30 180 40 C140 30 60 30 20 40 Z', f: 2, ft: .85, s: 8 }, { p: 'M80 -20 V30 M110 -25 V30', s: 4 },
  ], { moods: ['sereno'] });
  A('helado', 'HELADO', /\b(helados?|ice cream|gelato|cono de helado|paleta helada|popsicle|sorbet)\b/i, [
    { p: 'M-60 -10 L0 190 L60 -10 Z', f: 2, ft: .6, s: 9 }, { p: 'M-60 40 L60 40 M-40 100 L40 100 M-25 -10 L25 150 M25 -10 L-25 150', s: 4 },
    { p: 'M-80 -10 C-100 -90 -40 -100 -30 -70 C-30 -140 50 -140 50 -80 C90 -90 100 -10 80 -10 Z', f: 3, ft: .85, s: 9, m: 'sway', a: .02, o: [0, -10] }, { c: [10, -160, 14], f: 1, ft: .95, s: 6 },
    { p: 'M-80 -10 C-60 10 -40 0 -20 12 C0 0 30 12 50 0 C70 8 80 0 80 -10', s: 6 },
  ], { moods: ['feliz', 'sereno'] });
  A('pastel', 'PASTEL', /\b(pastel(es)?|tartas?|cakes?|birthday cake|torta|bizcocho|pastel de cumplea[nñ]os)\b/i, [
    { p: L.rect(-140, 20, 280, 120), f: 2, ft: .7, s: 9 }, { p: 'M-140 20 C-120 60 -100 20 -70 55 C-40 20 -10 60 20 20 C50 60 80 20 110 55 C130 30 140 40 140 20', f: -1, s: 8 },
    { p: 'M-60 -60 H60 V20 H-60 Z', f: 3, ft: .8, s: 9 }, { p: 'M-40 -60 V-110 M0 -60 V-120 M40 -60 V-110', s: 6 },
    { p: 'M-40 -125 C-50 -140 -30 -145 -40 -160 M0 -135 C-10 -150 10 -155 0 -170 M40 -125 C30 -140 50 -145 40 -160', f: 2, ft: .95, s: 5, m: 'sway', a: .1, o: [0, -120], v: 2 },
  ], { moods: ['feliz', 'euforico'] });
  A('cupcake', 'CUPCAKE', /\b(cupcakes?|magdalenas?|muffins?)\b/i, [
    { p: 'M-90 20 L-65 150 H65 L90 20 Z', f: 3, ft: .8, s: 9 }, { p: 'M-40 20 L-30 150 M0 20 V150 M40 20 L30 150', s: 4 },
    { p: 'M-110 20 C-130 -30 -70 -50 -60 -20 C-70 -90 40 -100 40 -30 C90 -50 130 -10 110 20 Z', f: 2, ft: .85, s: 9 }, { c: [-10, -125, 22], f: 1, ft: .95, s: 7, m: 'bob', a: 3 },
  ], { moods: ['feliz'] });
  A('donut', 'DONA', /\b(donas?|donuts?|doughnuts?|rosquillas?|rosquilla)\b/i, [
    { c: [0, 0, 150], f: 3, ft: .65, s: 10 }, { c: [0, 0, 130], f: 2, ft: .8, s: 0 }, { c: [0, 0, 46], f: -1, s: 9 },
    { p: 'M-90 -60 L-70 -75 M50 -100 L70 -85 M90 20 L110 5 M-30 100 L-10 115 M-100 50 L-120 40', s: 6, i: 1 },
  ], { moods: ['feliz', 'euforico'] });
  A('galleta', 'GALLETA', /\b(galletas?|cookies?|biscuits?|oreo)\b/i, [
    { c: [0, 0, 150], f: 2, ft: .55, s: 10 }, { c: [-50, -50, 16], f: 1, ft: .95, s: 0 }, { c: [40, -70, 12], f: 1, ft: .95, s: 0 }, { c: [60, 20, 18], f: 1, ft: .95, s: 0 }, { c: [-70, 40, 14], f: 1, ft: .95, s: 0 }, { c: [0, 70, 12], f: 1, ft: .95, s: 0 },
    { p: 'M110 -80 C140 -60 150 -20 140 20', s: 4 },
  ], { moods: ['nostalgico', 'feliz'] });
  A('chocolate', 'CHOCOLATE', /\b(chocolates?|cacao|cocoa|bomb[oó]n|bombones|bonbon|nutella)\b/i, [
    { p: 'M-110 -150 H110 V150 H-110 Z', f: 1, ft: .8, s: 9 }, { p: 'M-110 -50 H110 M-110 50 H110 M-37 -150 V150 M37 -150 V150', s: 6 },
    { p: 'M-110 -150 L-170 -190 L-170 -60 L-110 -20 Z', f: 2, ft: .95, s: 8, m: 'sway', a: .03, o: [-110, -100] },
  ], { moods: ['romantico', 'nostalgico'] });
  A('manzana', 'MANZANA', /\b(manzanas?|apples?|pomme|apple pie)\b/i, [
    { p: 'M0 -60 C-40 -90 -140 -70 -130 30 C-125 110 -60 170 0 140 C60 170 125 110 130 30 C140 -70 40 -90 0 -60 Z', f: 1, ft: .85, s: 10 }, { p: 'M0 -60 C0 -100 10 -120 30 -140', s: 9 },
    { p: 'M30 -110 C70 -150 120 -130 110 -100 C80 -90 50 -90 30 -110 Z', f: 2, ft: .9, s: 6, m: 'sway', a: .05, o: [30, -110] }, { p: 'M-80 0 C-90 30 -85 50 -70 70', s: 4 },
  ], { moods: ['romantico', 'oscuro'] });
  A('banana', 'BANANA', /\b(bananas?|pl[aá]tanos?|bananos?|guineos?|banano)\b/i, [
    { p: 'M-150 -80 C-130 60 -30 150 110 110 C140 100 160 70 160 40 C60 90 -40 40 -100 -100 Z', f: 2, ft: .85, s: 10 }, { p: 'M-100 -100 L-120 -140 L-150 -130 L-150 -80', f: 1, ft: .9, s: 7 },
    { p: 'M-90 -60 C-50 30 20 70 100 80', s: 4 }, { p: 'M160 40 L175 30', s: 8 },
  ], { moods: ['feliz'] });
  A('uvas', 'UVAS', /\b(uvas?|racimo|grapes?|vi[nñ]edo|vineyard)\b/i, [
    ...[[-50, -30], [10, -40], [60, -20], [-80, 20], [-20, 15], [40, 20], [-50, 65], [10, 60], [-20, 105]].map(([x, y], i) => ({ c: [x, y, 28], f: i % 2 ? 3 : 1, ft: .75, s: 7 })),
    { p: 'M-10 -70 V-130', s: 9 }, leaf(-10, -110, 0, 1),
  ], { moods: ['romantico'] });
  A('fresa', 'FRESA', /\b(fresas?|strawberr\w+|frutilla|berries|frutos rojos)\b/i, [
    { p: 'M0 -80 C-90 -100 -140 -30 -110 40 C-90 100 -30 160 0 175 C30 160 90 100 110 40 C140 -30 90 -100 0 -80 Z', f: 1, ft: .85, s: 10 },
    ...[[-50, -20], [10, -30], [55, 0], [-30, 40], [30, 45], [0, 100]].map(([x, y]) => ({ e: [x, y, 5, 9], f: -1, s: 0 })),
    { p: 'M-60 -95 L-30 -70 L0 -100 L30 -70 L60 -95 L40 -60 H-40 Z', f: 2, ft: .9, s: 7 }, { p: 'M0 -100 V-135', s: 7 },
  ], { moods: ['romantico', 'feliz'] });
  A('sandia', 'SANDÍA', /\b(sand[ií]as?|watermelons?|melon(es)?|melons?)\b/i, [
    { p: 'M-170 -20 C-150 150 150 150 170 -20 Z', f: 2, ft: .9, s: 10 }, { p: 'M-140 -20 C-125 110 125 110 140 -20 Z', f: -1, s: 6 }, { p: 'M-140 -20 H140', s: 6 },
    ...[[-60, 10], [0, 30], [60, 10], [-30, 60], [35, 62]].map(([x, y]) => ({ e: [x, y, 6, 10], f: 1, s: 0 })),
  ], { moods: ['feliz', 'sereno'] });
  A('naranja', 'NARANJA', /\b(naranjas?|oranges?|mandarinas?|tangerines?|c[ií]tricos?|citrus)\b/i, [
    { c: [0, 20, 130], f: 2, ft: .9, s: 10 }, { p: 'M0 -110 V-140', s: 8 }, leaf(0, -110, 0, .9), { p: 'M-60 -30 C-90 10 -80 60 -50 90', s: 4 },
    { p: 'M-30 30 L-10 50 M20 10 L40 30 M30 70 L50 60', s: 4 },
  ], { moods: ['feliz'] });
  A('limon', 'LIMÓN', /\b(lim[oó]n(es)?|lim[oó]n|lemons?|limonada|lemonade|limes?)\b/i, [
    { p: 'M-170 10 C-140 -90 140 -90 170 10 C140 110 -140 110 -170 10 Z', f: 2, ft: .85, s: 10 }, { p: 'M-170 10 L-190 5 M170 10 L190 5', s: 9 },
    { p: 'M-90 0 C-50 -30 30 -30 70 -10', s: 4 }, leaf(60, -40, 0, .8),
  ], { moods: ['feliz'] });
  A('pina', 'PIÑA', /\b(pi[nñ]as?|pineapples?|pi[nñ]a colada)\b/i, [
    { e: [0, 60, 90, 115], f: 2, ft: .85, s: 10 }, { p: 'M-60 -20 L60 140 M60 -20 L-60 140 M-90 50 L0 150 M90 50 L0 150 M-90 50 L0 -40 M90 50 L0 -40', s: 4 },
    { p: 'M0 -55 L-40 -140 L-15 -100 L0 -170 L15 -100 L40 -140 Z', f: 1, ft: .9, s: 7, m: 'sway', a: .04, o: [0, -55] }, { p: 'M-30 -80 L-90 -120 L-45 -60 Z M30 -80 L90 -120 L45 -60 Z', f: 1, ft: .8, s: 6, m: 'sway', a: .05, o: [0, -55] },
  ], { moods: ['feliz', 'euforico'] });
  A('cereza', 'CEREZA', /\b(cerezas?|cherr(y|ies)|guindas?)\b/i, [
    { c: [-60, 90, 55], f: 1, ft: .9, s: 10 }, { c: [70, 100, 50], f: 1, ft: .9, s: 10 }, { p: 'M-60 35 C-40 -40 0 -100 30 -150 M70 50 C60 -20 40 -90 30 -150', s: 8, m: 'sway', a: .02, o: [30, -150] },
    { p: 'M30 -150 C60 -190 130 -170 120 -130 C90 -120 50 -130 30 -150 Z', f: 2, ft: .9, s: 6 }, { p: 'M-80 70 C-90 90 -85 100 -75 108', s: 4, i: 2 },
  ], { moods: ['romantico'] });
  A('durazno', 'DURAZNO', /\b(duraznos?|melocot[oó]n(es)?|peach(es)?|albaricoques?|apricots?)\b/i, [
    { p: 'M0 -60 C-100 -90 -160 10 -110 90 C-70 150 -20 160 0 140 C20 160 70 150 110 90 C160 10 100 -90 0 -60 Z', f: 2, ft: .7, s: 10 }, { p: 'M0 -60 C-20 0 -10 70 0 140', s: 5 },
    { p: 'M0 -60 C10 -100 40 -120 70 -130', s: 8 }, leaf(50, -110, 0, .8),
  ], { moods: ['romantico', 'sereno'] });
  A('aguacate', 'AGUACATE', /\b(aguacates?|avocados?|guacamole|palta)\b/i, [
    { p: 'M0 -170 C-40 -170 -50 -100 -90 -40 C-150 40 -110 160 0 160 C110 160 150 40 90 -40 C50 -100 40 -170 0 -170 Z', f: 1, ft: .85, s: 10 },
    { p: 'M0 -140 C-30 -140 -35 -90 -70 -40 C-115 30 -85 130 0 130 C85 130 115 30 70 -40 C35 -90 30 -140 0 -140 Z', f: 3, ft: .55, s: 6 }, { c: [0, 40, 42], f: 2, ft: .9, s: 8 },
  ], { moods: ['sereno'] });
  A('mango', 'MANGO', /\b(mangos?|mangoes|mango biche)\b/i, [
    { p: 'M-120 -20 C-110 -110 60 -140 130 -60 C170 -10 140 110 40 150 C-50 170 -130 100 -120 -20 Z', f: 2, ft: .85, s: 10 }, { p: 'M-30 -90 C-20 -120 0 -140 30 -140', s: 8 }, leaf(20, -120, 0, .9),
    { p: 'M-70 10 C-70 50 -40 90 0 100', s: 4 },
  ], { moods: ['feliz', 'sereno'] });
  A('coco', 'COCO', /\b(cocos?|coconuts?|palma de coco|coco loco|pi[nñ]a colada)\b/i, [
    { c: [0, 30, 120], f: 3, ft: .9, s: 10 }, { p: 'M-40 -20 C-20 -10 20 -10 40 -20 M-60 30 C-30 45 30 45 60 30', s: 4 }, { c: [-30, 10, 12], f: 1, s: 0 }, { c: [30, 10, 12], f: 1, s: 0 }, { c: [0, 45, 12], f: 1, s: 0 },
    { p: 'M0 -90 C-30 -150 -90 -160 -150 -130 M0 -90 C30 -150 90 -160 150 -130', f: 1, ft: .8, s: 8, m: 'sway', a: .03, o: [0, -90] },
  ], { moods: ['feliz', 'sereno'] });
  A('pera', 'PERA', /\b(peras?|pears?)\b/i, [
    { p: 'M0 -110 C40 -110 50 -60 60 -20 C70 30 140 50 130 110 C120 170 60 175 0 175 C-60 175 -120 170 -130 110 C-140 50 -70 30 -60 -20 C-50 -60 -40 -110 0 -110 Z', f: 1, ft: .7, s: 10 },
    { p: 'M0 -110 C0 -150 10 -165 30 -180', s: 8 }, leaf(15, -150, 0, .7), { p: 'M-70 60 C-80 90 -75 110 -60 125', s: 4 },
  ], { moods: ['sereno'] });
  A('tomate', 'TOMATE', /\b(tomates?|tomato(es)?|jitomate|ketchup|salsa roja|kétchup)\b/i, [
    { p: 'M-140 10 C-140 -80 140 -80 140 10 C140 100 60 140 0 140 C-60 140 -140 100 -140 10 Z', f: 1, ft: .9, s: 10 },
    { p: 'M-50 -60 L-20 -40 L0 -75 L20 -40 L50 -60 L40 -25 H-40 Z', f: 1, ft: .55, s: 7 }, { p: 'M0 -75 V-110', s: 8 }, { p: 'M-90 30 C-90 60 -70 80 -50 90', s: 4 },
  ], { moods: ['feliz'] });
  A('zanahoria', 'ZANAHORIA', /\b(zanahorias?|carrots?)\b/i, [
    { p: 'M-50 -80 C50 -100 80 -60 70 -30 L-20 170 C-30 180 -50 150 -60 100 Z', f: 2, ft: .9, s: 10, g: 0 }, { p: 'M-30 -30 L10 -35 M-20 20 L25 10 M-10 70 L30 55', s: 5 },
    { p: 'M-30 -85 C-40 -150 -70 -160 -80 -180 M0 -95 C0 -150 20 -170 10 -195 M30 -90 C50 -140 90 -150 100 -170', f: 1, ft: .8, s: 7, m: 'sway', a: .04, o: [0, -90] },
  ], { moods: ['feliz'] });
  A('maiz', 'MAÍZ', /\b(ma[ií]z|elotes?|corn|choclo|mazorca|cornfield|tamal(es)?)\b/i, [
    { e: [0, 0, 55, 145], f: 2, ft: .85, s: 10 }, ...[-30, 0, 30].flatMap(x => [-90, -50, -10, 30, 70].map(y => ({ c: [x, y, 9], f: -1, s: 4 }))),
    { p: 'M-30 150 C-130 100 -110 -30 -50 -90 M30 150 C130 100 110 -30 50 -90', f: 1, ft: .8, s: 8, m: 'sway', a: .02, o: [0, 150] },
  ], { moods: ['nostalgico', 'feliz'] });
  A('papa', 'PAPA', /\b(papas|papas? fritas?|patatas?|potato(es)?|tub[eé]rculos?|fries|french fries)\b/i, [
    { p: 'M-140 10 C-140 -70 -40 -100 40 -90 C120 -80 160 -20 140 50 C120 120 20 130 -60 110 C-120 100 -140 60 -140 10 Z', f: 2, ft: .6, s: 10 },
    { c: [-40, -20, 8], f: 1, ft: .8, s: 0 }, { c: [30, 30, 10], f: 1, ft: .8, s: 0 }, { c: [70, -30, 7], f: 1, ft: .8, s: 0 }, { c: [-70, 50, 8], f: 1, ft: .8, s: 0 },
  ], { moods: ['nostalgico'] });
  A('cebolla', 'CEBOLLA', /\b(cebollas?|onions?|scallions?|cebollino|chalotas?)\b/i, [
    { p: 'M0 -110 C60 -110 150 -30 130 50 C110 130 40 160 0 160 C-40 160 -110 130 -130 50 C-150 -30 -60 -110 0 -110 Z', f: 3, ft: .6, s: 10 },
    { p: 'M0 -110 C-30 -50 -50 40 -20 160 M0 -110 C30 -50 50 40 20 160', s: 5 }, { p: 'M0 -110 C-10 -140 10 -160 0 -190', s: 8 }, { p: 'M-20 160 L-30 185 M0 160 V190 M20 160 L30 185', s: 4 },
  ], { moods: ['triste'] });
  A('ajo', 'AJO', /\b(ajos?|garlic|dientes de ajo|ajillo)\b/i, [
    { p: 'M0 -110 C60 -60 140 -10 120 60 C100 130 30 150 0 150 C-30 150 -100 130 -120 60 C-140 -10 -60 -60 0 -110 Z', f: -1, s: 10 }, { p: 'M0 -110 V150 M-45 -50 C-70 20 -50 100 -20 150 M45 -50 C70 20 50 100 20 150', s: 5 },
    { p: 'M0 -110 C-10 -140 10 -160 0 -180', s: 8 }, { p: 'M-20 150 L-30 175 M0 150 V178 M20 150 L30 175', s: 4 },
  ], { moods: ['oscuro'] });
  A('chile', 'CHILE', /\b(chiles?|aj[ií]es?|chilis?|chillis?|jalape[nñ]os?|peppers?|picante|spicy|hot sauce|habanero)\b/i, [
    { p: 'M-120 -90 C-20 -110 60 -70 90 20 C120 80 150 150 190 170 C100 180 20 150 -20 80 C-60 10 -130 -20 -120 -90 Z', f: 1, ft: .9, s: 10 },
    { p: 'M-120 -90 C-130 -130 -100 -150 -70 -160 M-120 -90 L-160 -120', f: 1, ft: .9, s: 8 }, { p: 'M-60 -60 C-30 -50 0 -30 20 10', s: 4 },
    { p: 'M140 -60 C130 -90 150 -100 140 -130', s: 5, i: 2, m: 'steam', a: 30 },
  ], { moods: ['rabioso', 'euforico'] });
  A('brocoli', 'BRÓCOLI', /\b(br[oó]coli|broccoli|vegetal(es)?|verduras?|veggies?|vegetables?)\b/i, [
    { c: [-70, -60, 60], f: 1, ft: .85, s: 9 }, { c: [0, -95, 62], f: 1, ft: .85, s: 9 }, { c: [70, -55, 60], f: 1, ft: .85, s: 9 }, { c: [0, -30, 55], f: 1, ft: .7, s: 0 },
    { p: 'M-30 -20 C-25 40 -30 100 -35 160 H35 C30 100 25 40 30 -20 Z', f: 3, ft: .65, s: 9 },
  ], { moods: ['sereno'] });
  A('hongo', 'HONGO', /\b(hongos?|setas?|champi[nñ]ones?|mushrooms?|shrooms?)\b/i, [
    { p: 'M-160 30 C-160 -90 -60 -150 0 -150 C60 -150 160 -90 160 30 C100 45 -100 45 -160 30 Z', f: 1, ft: .9, s: 10 }, { c: [-70, -40, 20], f: -1, s: 0 }, { c: [30, -80, 16], f: -1, s: 0 }, { c: [80, -10, 14], f: -1, s: 0 },
    { p: 'M-40 40 C-50 100 -60 140 -70 160 H70 C60 140 50 100 40 40', f: -1, s: 9 },
  ], { moods: ['euforico', 'oscuro'] });
  A('huevo', 'HUEVO', /\b(huevos?|eggs?|omelette|tortilla de huevo|yema|yolk)\b/i, [
    { p: 'M-140 0 C-130 -90 -60 -120 0 -110 C70 -120 140 -80 140 0 C150 80 100 140 20 120 C-50 150 -150 100 -140 0 Z', f: -1, s: 10 }, { c: [0, 10, 55], f: 2, ft: .95, s: 8 }, { p: 'M-30 -10 C-20 -30 -5 -30 5 -25', s: 4, i: 3 },
  ], { moods: ['feliz'] });
  A('queso', 'QUESO', /\b(quesos?|cheese|fromage|mozzarella|cheddar|parmesano|parmesan)\b/i, [
    { p: 'M-170 90 L-130 -70 L170 -20 V90 Z', f: 2, ft: .85, s: 10 }, { p: 'M-130 -70 L-170 -30 V90', s: 8 }, { c: [-40, 20, 24], f: -1, s: 7 }, { c: [60, 50, 16], f: -1, s: 6 }, { c: [90, -20, 12], f: -1, s: 6 }, { c: [-100, 50, 10], f: -1, s: 5 },
  ], { moods: ['feliz'] });
  A('tocino', 'TOCINO', /\b(tocino|bacon|jam[oó]n|ham|salchichas?|sausages?|chorizo|embutidos?|hot ?dogs?|perritos? calientes?)\b/i, [
    { p: 'M-160 -60 C-100 -100 -60 -20 0 -60 C60 -100 100 -20 160 -60 V-10 C100 30 60 -50 0 -10 C-60 30 -100 -50 -160 -10 Z', f: 1, ft: .85, s: 9, m: 'sway', a: .01, o: [0, -40] },
    { p: 'M-160 60 C-100 20 -60 100 0 60 C60 20 100 100 160 60 V110 C100 150 60 70 0 110 C-60 150 -100 70 -160 110 Z', f: 1, ft: .85, s: 9, m: 'sway', a: .01, o: [0, 90], ph: 2 },
  ], { moods: ['feliz'] });
  A('pollo', 'POLLO FRITO', /\b(pollo|chicken|alitas|wings|nuggets|muslo|drumstick|fried chicken|gallina)\b/i, [
    { p: 'M-110 -130 C-30 -180 110 -140 110 -50 C110 20 40 60 -20 40 L-40 60 L-100 -10 C-140 -50 -150 -100 -110 -130 Z', f: 2, ft: .8, s: 10 }, { p: 'M-20 40 L-70 120', s: 12 },
    { c: [-100, 140, 18], f: -1, s: 8 }, { c: [-60, 150, 18], f: -1, s: 8 }, { p: 'M-40 -100 C0 -110 40 -90 50 -50', s: 4 },
  ], { moods: ['feliz'] });
  A('bistec', 'CARNE', /\b(carnes?|bistec|bisteces|steaks?|beef|asado|parrilla|barbacoa|bbq|barbecue|churrasco|grill)\b/i, [
    { p: 'M-150 -20 C-160 -100 -60 -120 0 -90 C80 -140 160 -70 140 0 C160 70 90 130 20 100 C-50 140 -150 90 -150 -20 Z', f: 1, ft: .8, s: 10 }, { c: [40, -10, 26], f: -1, s: 7 }, { p: 'M-110 -30 C-80 -50 -50 -30 -30 -50 M-100 30 C-70 10 -40 30 -20 10', s: 4 },
    { p: 'M-30 -120 C-40 -145 -20 -150 -30 -180', s: 4, m: 'steam', a: 30 },
  ], { moods: ['feliz'] });
  A('pescado', 'PESCADO', /\b(pescados?|fish|filete|salm[oó]n|salmon|at[uú]n(es)?|tuna|trucha|trout|ceviche)\b/i, [
    { p: 'M-170 0 C-100 -90 40 -90 100 0 C40 90 -100 90 -170 0 Z', f: 3, ft: .75, s: 10 }, { p: 'M100 0 L170 -60 L170 60 Z', f: 3, ft: .85, s: 9, m: 'wag', a: .1, o: [100, 0] },
    { c: [-110, -10, 10], f: -1, s: 6 }, { p: 'M-40 -60 C-20 -30 -20 30 -40 60 M10 -60 C30 -30 30 30 10 60', s: 4 }, { p: 'M-30 -75 L0 -120 L30 -70', f: 1, ft: .8, s: 7 },
  ], { moods: ['sereno'] });
  A('camaron', 'CAMARÓN', /\b(camar[oó]n(es)?|camar[oó]n|langostinos?|shrimps?|prawns?|langosta|lobsters?|cangrejos?|crabs?|mariscos?|seafood)\b/i, [
    { p: 'M-130 -20 C-130 -110 40 -140 100 -70 C140 -20 110 60 60 100 C30 130 -20 140 -50 110 C-10 110 40 80 50 40 C60 0 30 -50 -20 -40 C-70 -30 -100 30 -130 -20 Z', f: 2, ft: .85, s: 10 },
    { p: 'M-40 -60 C-60 -10 -40 40 0 50 M10 -70 C0 -20 30 20 50 20', s: 4 }, { p: 'M-130 -20 L-170 -50 M-120 -50 L-150 -90', s: 6 }, { c: [-100, -30, 8], f: 1, s: 0 },
  ], { moods: ['feliz'] });
  A('sopa', 'SOPA', /\b(sopas?|soups?|caldo|broth|guiso|stew|sancocho|pozole|menudo|estofado)\b/i, [
    { p: 'M-170 -10 H170 C170 100 90 160 0 160 C-90 160 -170 100 -170 -10 Z', f: 3, ft: .6, s: 10 }, { e: [0, -10, 170, 26], f: 2, ft: .8, s: 8 },
    { p: 'M-50 -60 C-70 -100 -30 -110 -50 -150 M0 -60 C-20 -100 20 -110 0 -160 M50 -60 C30 -100 70 -110 50 -150', s: 5, m: 'steam', a: 35 }, { c: [-40, -10, 8], f: 1, s: 0 }, { c: [30, -8, 8], f: 1, s: 0 },
  ], { moods: ['nostalgico', 'sereno'] });
  A('arroz', 'ARROZ', /\b(arroz|rice|paella|risotto|frijoles|gallo pinto)\b/i, [
    { p: 'M-150 -10 H150 C150 90 80 150 0 150 C-80 150 -150 90 -150 -10 Z', f: -1, s: 10 }, { p: 'M-140 -10 C-130 -90 130 -90 140 -10', f: -1, s: 8 },
    ...[[-60, -50], [-20, -70], [20, -60], [60, -45], [-40, -30], [0, -40], [40, -25], [-80, -20], [80, -15]].map(([x, y], i) => ({ e: [x, y, 10, 5, .6 * (i % 3 - 1)], f: 3, ft: .6, s: 4 })),
    { p: 'M-90 30 L-100 60 M-30 50 L-40 80', s: 4 },
  ], { moods: ['sereno'] });
  A('pasta', 'PASTA', /\b(pastas?|espaguetis?|spaghetti|fideos?|noodles?|macarr[oó]n(es)?|lasa[nñ]a|lasagna|ravioli|fettuccine)\b/i, [
    { p: 'M-160 0 H160 C160 90 90 150 0 150 C-90 150 -160 90 -160 0 Z', f: 3, ft: .55, s: 10 }, { p: 'M-140 0 C-100 -100 -50 -60 -30 -20 C0 -100 60 -110 80 -40 C100 -90 140 -50 140 0', s: 8, m: 'drift', a: 4 },
    { p: 'M-90 -20 C-60 -70 -10 -60 20 -20 M20 -20 C40 -60 90 -60 110 -10', s: 6, m: 'drift', a: -4 }, { c: [10, -70, 22], f: 1, ft: .9, s: 7 }, { p: 'M-140 175 L-170 195 M140 175 L170 195', s: 0 },
  ], { moods: ['feliz'] });
  A('ensalada', 'ENSALADA', /\b(ensaladas?|salads?|lechuga|lettuce|espinacas?|spinach|kale)\b/i, [
    { p: 'M-170 10 H170 C170 100 100 150 0 150 C-100 150 -170 100 -170 10 Z', f: 3, ft: .5, s: 10 },
    { p: 'M-130 10 C-160 -50 -100 -90 -70 -50 C-80 -110 -10 -120 0 -60 C10 -120 90 -110 70 -40 C110 -80 170 -30 130 10 Z', f: 1, ft: .85, s: 8 }, { c: [-40, -20, 16], f: 1, ft: .9, s: 6 }, { c: [30, -30, 14], f: 2, ft: .9, s: 6 },
  ], { moods: ['sereno'] });
  A('sandwich', 'SÁNDWICH', /\b(s[aá]ndwich(es)?|sandwich(es)?|emparedados?|bocadillos?|bagels?|croissants?)\b/i, [
    { p: 'M-140 -30 C-140 -110 140 -110 140 -30 Z', f: 2, ft: .7, s: 9 }, { p: 'M-150 -20 C-120 10 -90 -30 -60 0 C-30 -30 0 10 30 -20 C60 10 90 -30 120 0 C135 -15 145 -15 150 -20 V0 H-150 Z', f: 1, ft: .9, s: 6 },
    { p: L.rect(-145, 5, 290, 30), f: 3, ft: .9, s: 8 }, { p: 'M-140 45 H140 V70 C140 110 -140 110 -140 70 Z', f: 2, ft: .7, s: 9 },
  ], { moods: ['feliz'] });
  A('palomitas', 'PALOMITAS', /\b(palomitas?|pochoclo|cotufas|popcorn|movie snacks?)\b/i, [
    { p: 'M-90 0 L-70 170 H70 L90 0 Z', f: 1, ft: .8, s: 9 }, { p: 'M-30 0 L-25 170 M30 0 L25 170', f: -1, s: 6 },
    ...[[-70, -20], [-30, -50], [20, -40], [60, -20], [0, -85], [-50, -85], [45, -85]].map(([x, y], i) => ({ c: [x, y, 28], f: -1, s: 7, m: 'bob', a: 3, ph: i })),
  ], { moods: ['feliz', 'euforico'] });
  A('empanada', 'EMPANADA', /\b(empanadas?|pastel(es)? de carne|pastel(es)? salados?|pastelitos?|calzone|dumplings?|pierogi|samosas?|arepas?)\b/i, [
    { p: 'M-170 50 C-150 -90 150 -90 170 50 C120 60 -120 60 -170 50 Z', f: 2, ft: .75, s: 10 }, { p: 'M-150 40 C-110 60 -70 20 -30 55 C10 20 50 60 90 30 C120 55 140 50 150 40', s: 7 },
    { p: 'M-100 -10 C-60 -50 60 -50 100 -10', s: 4 }, { p: 'M-40 -30 L-20 -10 M20 -40 L40 -20', s: 4 },
  ], { moods: ['feliz', 'nostalgico'] });
  A('cerveza', 'CERVEZA', /\b(cervezas?|beers?|chelas?|birras?|brindis|brindar|lager|pilsner)\b/i, [
    { p: 'M-90 -60 H50 L40 150 C40 165 -80 165 -90 150 Z', f: 2, ft: .8, s: 10 }, { p: 'M50 -20 H100 C130 -20 130 80 100 80 H45', s: 9 },
    { p: 'M-105 -60 C-125 -110 -70 -130 -50 -100 C-40 -140 20 -140 30 -105 C60 -120 80 -80 60 -60 Z', f: -1, s: 8 }, { p: 'M-50 0 V110 M-15 0 V110 M20 0 V110', s: 3 },
    { c: [-30, 60, 5], s: 3, m: 'steam', a: 50 }, { c: [10, 90, 4], s: 3, m: 'steam', a: 60, ph: .5 },
  ], { moods: ['euforico', 'feliz'] });
  A('vino', 'VINO', /\b((?<=\b(?:de|con|un|el|tu|mi|este|ese|copa|copas|botella|botellas|tomando|bebiendo|beber|tomar|sirve|tinto|blanco|rosado)\s)vinos?|vino (?:tinto|blanco|rosado)|wine|tinto|red wine|merlot|vineyard|whisky|whiskey|rum|tequila|vodka|licor|liquor|brandy|cognac|champ[aá]n|champagne|shots)\b/i, [
    { p: 'M-70 -160 H70 C80 -60 60 10 0 20 C-60 10 -80 -60 -70 -160 Z', f: 1, ft: .55, s: 9 }, { p: 'M-75 -80 C-40 -60 40 -100 75 -80 C70 -30 50 10 0 15 C-50 10 -72 -30 -75 -80 Z', f: 1, ft: .95, s: 0, m: 'drift', a: 2 },
    { p: 'M0 20 V140 M-60 165 H60', s: 10 }, { p: 'M-50 -130 C-55 -100 -50 -70 -45 -50', s: 4 },
  ], { moods: ['romantico', 'melancolico'] });
  A('agua', 'AGUA', /\b(agua|waters?|thirst|thirsty|hidrat\w+|gota de agua|water drop)\b/i, [
    { p: 'M0 -170 C-40 -100 -110 -40 -110 30 C-110 100 -60 150 0 150 C60 150 110 100 110 30 C110 -40 40 -100 0 -170 Z', f: 3, ft: .75, s: 10, m: 'pulse', a: .03, o: [0, 30] },
    { p: 'M-60 40 C-60 80 -30 110 0 115', s: 5 }, { p: 'M-20 -80 C-40 -40 -60 -10 -68 20', s: 4 },
  ], { moods: ['sereno', 'triste'] });
  A('leche', 'LECHE', /\b(leche|milk|l[aá]cteos?|dairy|batido|milkshake|smoothie|yogur|yogurt|cereal)\b/i, [
    { p: 'M-70 -110 H70 V150 H-70 Z', f: -1, s: 10 }, { p: 'M-70 -110 L0 -170 L70 -110', f: -1, s: 9 }, { p: L.rect(-45, -70, 90, 100), f: 3, ft: .75, s: 6 }, { p: L.heart(0, -20, 2.5), f: 1, ft: .9, s: 4 },
    { p: 'M-70 80 H70', s: 4 },
  ], { moods: ['nostalgico', 'sereno'] });
  A('refresco', 'REFRESCO', /\b(refrescos?|sodas?|coca.?cola|gaseosas?|pepsi|sprite|fanta|jugo|juice|zumo|limonada|popote|pajilla)\b/i, [
    { p: 'M-75 -100 L-60 150 C-60 165 60 165 60 150 L75 -100 Z', f: 1, ft: .55, s: 10 }, { p: 'M-72 -60 H72', s: 6 }, { p: 'M-68 -20 L68 -20 L62 100 H-62 Z', f: 2, ft: .85, s: 0, m: 'drift', a: 2 },
    { p: 'M30 -100 L60 -190 H100', s: 8 }, { c: [-20, 40, 6], s: 3, m: 'steam', a: 60 }, { c: [20, 70, 5], s: 3, m: 'steam', a: 70, ph: .4 },
  ], { moods: ['feliz', 'euforico'] });
  A('piruleta', 'PIRULETA', /\b(piruletas?|paletas?|chupetes?|lollipops?|caramelos?|candy|candies|golosinas?|gomitas?|gummy|sugar candy)\b/i, [
    { c: [0, -60, 100], f: 2, ft: .85, s: 10 }, { p: 'M0 -60 C30 -60 30 -90 0 -90 C-50 -90 -50 -30 0 -30 C70 -30 70 -120 -10 -120 C-90 -120 -90 -10 0 0', s: 7, m: 'spin', a: .3, o: [0, -60] },
    { p: 'M0 40 V190', s: 11 }, { p: 'M-120 -160 L-90 -140 M120 -160 L90 -140', s: 4 },
  ], { moods: ['feliz', 'euforico'] });
  A('miel', 'MIEL', /\b(miel|honey|panal|honeycomb|colmena|beehive|dulzura)\b/i, [
    { p: 'M-100 -60 C-110 -100 110 -100 100 -60 V120 C100 160 -100 160 -100 120 Z', f: 2, ft: .85, s: 10 }, { p: L.rect(-110, -100, 220, 34), f: 3, ft: .7, s: 9 }, { p: 'M-70 -40 H70 M-70 20 H70', s: 3 },
    { p: 'M0 -66 C0 -30 -20 -10 -20 20 C-20 40 20 40 20 20 C20 -10 0 -30 0 -66', f: 2, ft: .95, s: 4 }, { p: 'M-80 90 L-50 70 L-20 90 L-50 110 Z', f: -1, s: 5 },
  ], { moods: ['nostalgico', 'sereno', 'romantico'] });
  A('croissant', 'CRUASÁN', /\b(cruasanes?|cruas[aá]n|croissants?|medialunas?|panecillos?|bollos?)\b/i, [
    { p: 'M-180 40 C-160 -20 -110 -50 -60 -50 C-40 -100 40 -100 60 -50 C110 -50 160 -20 180 40 C140 60 100 30 70 30 C50 60 -50 60 -70 30 C-100 30 -140 60 -180 40 Z', f: 2, ft: .8, s: 10 },
    { p: 'M-60 -50 C-70 -10 -60 20 -50 40 M0 -75 V50 M60 -50 C70 -10 60 20 50 40', s: 5 },
  ], { moods: ['nostalgico', 'feliz'] });
  A('cafe_grano', 'GRANO DE CAFÉ', /\b(granos? de caf[eé]|coffee beans?|cafeter[ií]a|caf[eé] con leche|espresso|latte|cappuccino|cafeina|caffeine)\b/i, [
    { e: [0, 0, 100, 150, .5], f: 1, ft: .85, s: 10 }, { p: 'M-40 -120 C30 -50 -30 50 40 120', s: 10, i: 3 }, { e: [-110, 120, 40, 60, -.4], f: 1, ft: .6, s: 7 }, { e: [120, -110, 30, 44, .7], f: 1, ft: .6, s: 7 },
  ], { moods: ['nostalgico', 'sereno'] });
  A('panqueques', 'PRETZEL', /\b(pretzels?|churros?|rosca|donut hole|waffles?|pancakes?|hotcakes?|panqueques?|crepas?|crepes?|panqueque)\b/i, [
    { e: [0, 30, 160, 60], f: 3, ft: .6, s: 10 }, { e: [0, 0, 160, 60], f: 2, ft: .8, s: 10 }, { e: [0, -30, 160, 60], f: 2, ft: .8, s: 10 }, { p: L.rr(-40, -110, 80, 40, 10), f: 1, ft: .95, s: 6, m: 'bob', a: 2 },
    { p: 'M-80 -30 C-60 0 -40 -20 -20 10 M40 -25 C60 5 80 -15 100 5', s: 4, i: 3 },
  ], { moods: ['feliz', 'nostalgico'] });
  A('nueces', 'NUECES', /\b(nueces?|nuts?|almendras?|almonds?|cacahuates?|man[ií]es?|peanuts?|pistachos?|pistachios?|avellanas?|hazelnuts?)\b/i, [
    { p: 'M-140 -10 C-140 -110 -30 -130 0 -100 C30 -130 140 -110 140 -10 C140 80 60 130 0 130 C-60 130 -140 80 -140 -10 Z', f: 2, ft: .6, s: 10 }, { p: 'M0 -100 C-20 -40 20 40 0 130', s: 7 },
    { p: 'M-90 -20 C-80 20 -60 50 -30 70 M90 -20 C80 20 60 50 30 70', s: 4 },
  ], { moods: ['nostalgico'] });
  A('fruta_cesta', 'FRUTA', /\b(frutas?|fruits?|frutales|jugosa|juicy)\b/i, [
    { p: 'M-170 20 H170 L130 150 H-130 Z', f: 3, ft: .6, s: 10 }, { p: 'M-140 60 H140 M-110 100 H110 M-60 20 L-50 150 M0 20 V150 M60 20 L50 150', s: 4 },
    { c: [-80, -30, 55], f: 1, ft: .85, s: 8 }, { c: [30, -50, 60], f: 2, ft: .9, s: 8 }, { c: [110, -10, 45], f: 3, ft: .8, s: 8 }, { p: 'M30 -110 C30 -130 40 -140 55 -150', s: 6 },
  ], { moods: ['feliz', 'sereno'] });
  A('banquete', 'BANQUETE', /\b(banquete|fest[ií]n|feast|banquet|dinner)\b/i, [
    { p: 'M-190 60 H190', s: 9 }, { p: 'M-170 60 V170 M170 60 V170', s: 9 }, { e: [0, 30, 120, 40], f: -1, s: 8 }, { e: [0, 24, 84, 26], f: 2, ft: .5, s: 4 },
    { p: 'M-170 10 V-60 M-150 10 V-60 M-130 10 V-60 M-150 -60 V-150 M150 10 V-150 M170 -20 C130 -20 130 -100 170 -100', s: 6 },
    { p: 'M-30 -30 C-50 -70 -10 -90 -30 -130 M20 -30 C0 -70 40 -90 20 -130', s: 5, m: 'steam', a: 35 },
  ], { moods: ['feliz', 'euforico'] });
})();
