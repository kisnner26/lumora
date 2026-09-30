// ============================================================
// riso-props-vida.js — fiestas, ropa y cuerpo (oleada 4 del catálogo). Ver riso-props-lib.js.
// ============================================================
(() => {
  const R = window.RISO; if (!R || !R.lib) return;
  const { add, L } = R.lib;
  const F = (id, label, rx, shapes, opt) => add(id, 'fiestas', label, rx, shapes, opt);
  const P = (id, label, rx, shapes, opt) => add(id, 'ropa', label, rx, shapes, opt);
  const B = (id, label, rx, shapes, opt) => add(id, 'cuerpo', label, rx, shapes, opt);
  const gnd = { p: 'M-190 170 H190', s: 8 };
  const finger = (x, y, h, w = 20) => ({ p: L.rr(x - w / 2, y - h, w, h, w / 2), f: -1, s: 8 });

  // ---------- fiestas ----------
  F('globos', 'GLOBOS', /\b(globos?|balloons?|fiesta de cumplea[nñ]os|birthday party|cumplea[nñ]os|birthday|feliz cumple|happy birthday)\b/i, [
    { p: 'M-90 -40 C-160 -110 -60 -190 -20 -110 C10 -50 -40 -10 -90 -40 Z', f: 1, ft: .9, s: 9, m: 'sway', a: .03, o: [-50, 100] }, { p: 'M-60 -20 C-50 40 -60 80 -50 100', s: 4 },
    { p: 'M20 -90 C-30 -170 90 -190 100 -110 C110 -50 60 -40 20 -90 Z', f: 2, ft: .9, s: 9, m: 'sway', a: .03, o: [60, 100], ph: 1 }, { p: 'M60 -40 C55 30 60 70 60 100', s: 4 },
    { p: 'M80 20 C60 -40 150 -70 160 0 C165 50 110 70 80 20 Z', f: 3, ft: .8, s: 9, m: 'sway', a: .04, o: [120, 120], ph: 2 }, { p: 'M120 60 C115 100 125 110 120 130', s: 4 }, { p: 'M-50 100 L60 100 L120 130', s: 3 }, gnd,
  ], { moods: ['feliz', 'euforico'] });
  F('pinata', 'PIÑATA', /\b(pi[nñ]atas?|pinatas?|fiesta mexicana|dulces de pi[nñ]ata|papel picado)\b/i, [
    { p: 'M-60 -40 L-40 -90 L0 -60 L40 -90 L60 -40 L100 -10 L60 20 L80 70 L20 60 L0 100 L-20 60 L-80 70 L-60 20 L-100 -10 Z', f: 2, ft: .9, s: 9, m: 'sway', a: .05, o: [0, -170] }, { p: 'M0 -170 V-90', s: 6 }, { p: 'M-60 -40 L100 -10 M-40 -90 L60 20 M40 -90 L-60 20', s: 3, i: 3 },
    { p: L.star(-130, 100, 12, 5, .45), f: 1, s: 3, m: 'fall', a: 60 }, { c: [130, 60, 8], f: 3, s: 4, m: 'fall', a: 70, ph: .4 }, { c: [90, 130, 8], f: 1, s: 4, m: 'fall', a: 50, ph: .7 },
  ], { moods: ['euforico', 'feliz'] });
  F('confeti', 'CONFETI', /\b(confeti|confetti|serpentinas?|streamers?|celebraci[oó]n|celebration|celebrar|celebrate|felicitaciones|congratulations|hooray|viva la fiesta)\b/i, [
    ...Array.from({ length: 22 }, (_, i) => { const x = -170 + (i * 89) % 340, y = -160 + (i * 53) % 320; return { p: L.rect(x, y, 14 + i % 3 * 6, 8 + i % 2 * 6), f: [1, 2, 3][i % 3], ft: .9, s: 3, m: 'fall', a: 40, ph: i * .13 }; }),
    { p: 'M-150 -150 C-100 -120 -170 -80 -110 -50 C-60 -20 -140 20 -80 60', s: 5, i: 2, m: 'sway', a: .05, o: [-150, -150] }, { p: 'M150 -150 C100 -110 160 -70 100 -30 C50 10 130 50 90 100', s: 5, i: 1, m: 'sway', a: .05, o: [150, -150], ph: 1 },
  ], { moods: ['euforico', 'feliz'] });
  F('calabaza_halloween', 'CALABAZA', /\b(calabazas?|pumpkins?|jack.?o.?lantern|halloween|noche de brujas|truco o trato|trick or treat)\b/i, [
    { p: 'M0 -80 C-80 -110 -170 -60 -150 20 C-130 100 -60 130 0 120 C60 130 130 100 150 20 C170 -60 80 -110 0 -80 Z', f: 2, ft: .9, s: 10 }, { p: 'M0 -80 C-40 -60 -50 60 0 120 M0 -80 C40 -60 50 60 0 120', s: 4 }, { p: 'M0 -80 V-120 C10 -140 30 -140 40 -125', s: 9 },
    { p: 'M-70 -10 L-30 -10 L-50 -50 Z M30 -10 L70 -10 L50 -50 Z', f: 1, ft: .95, s: 0 }, { p: 'M-60 40 L-30 60 L-10 40 L10 60 L30 40 L60 60', f: 1, ft: .95, s: 6 },
  ], { moods: ['oscuro'] });
  F('bruja', 'BRUJA', /\b(brujas?|witch(es)?|escoba m[aá]gica|broomstick|hechizo|spell|caldero|cauldron|poci[oó]n|potion|brujer[ií]a|witchcraft)\b/i, [
    { p: 'M-100 40 L-20 -40 L0 -160 L30 -60 L110 40 Z', f: 1, ft: .95, s: 10 }, { p: 'M-150 40 H150 C150 60 -150 60 -150 40 Z', f: 1, ft: .95, s: 9 }, { p: 'M-70 10 H80', f: 2, ft: .95, s: 8 },
    { p: 'M-190 130 L170 100', s: 8 }, { p: 'M170 100 L190 80 L190 130 L170 120 M180 95 L195 110 M180 115 L195 125', f: 2, ft: .9, s: 5, m: 'sway', a: .05, o: [170, 110] }, { p: L.star(-120, -100, 14, 4, .4), f: 2, s: 3, m: 'pulse', a: .5, o: [-120, -100] },
  ], { moods: ['oscuro'] });
  F('catrina', 'CALAVERA', /\b(calaveras?|skulls?|catrinas?|d[ií]a de muertos|day of the dead|dia de los muertos|ofrenda|altar de muertos|sugar skull|memento mori)\b/i, [
    { p: 'M-90 -20 C-100 -130 100 -130 90 -20 C90 20 60 30 50 60 H-50 C-60 30 -90 20 -90 -20 Z', f: -1, s: 10 }, { c: [-35, -20, 24], f: 1, ft: .95, s: 8 }, { c: [35, -20, 24], f: 1, ft: .95, s: 8 }, { p: L.star(-35, -20, 16, 8, .5), f: 2, ft: .95, s: 0 }, { p: L.star(35, -20, 16, 8, .5), f: 2, ft: .95, s: 0 },
    { p: 'M-8 15 L0 30 L8 15 Z', f: 1, s: 4 }, { p: 'M-45 55 V80 M-15 55 V80 M15 55 V80 M45 55 V80', s: 5 }, { p: 'M-90 -70 C-70 -100 -40 -100 -20 -80 M90 -70 C70 -100 40 -100 20 -80', f: 2, ft: .9, s: 6 },
    ...[[-140, 80], [140, 80], [0, -150]].map(([x, y], i) => ({ c: [x, y, 16], f: i === 2 ? 1 : 2, ft: .9, s: 6, m: 'pulse', a: .1, o: [x, y], ph: i })),
  ], { moods: ['oscuro', 'nostalgico'] });
  F('cempasuchil', 'CEMPASÚCHIL', /\b(cempas[uú]chil|cempoal|marigolds?|flor de muerto|flores de muerto|caléndula|calendula)\b/i, [
    ...Array.from({ length: 8 }, (_, i) => { const a = i / 8 * Math.PI * 2; return { e: [Math.cos(a) * 70, Math.sin(a) * 70, 40, 20, a], f: 2, ft: .9, s: 6, m: 'pulse', a: .03, o: [0, 0] }; }), ...Array.from({ length: 6 }, (_, i) => { const a = i / 6 * Math.PI * 2 + .5; return { e: [Math.cos(a) * 42, Math.sin(a) * 42, 26, 14, a], f: 1, ft: .8, s: 5 }; }), { c: [0, 0, 20], f: 2, ft: .95, s: 6 },
  ], { moods: ['nostalgico'] });
  F('cupido', 'CUPIDO', /\b(cupido|cupid|flecha de amor|love arrow|san valent[ií]n|valentine|d[ií]a de los enamorados|be my valentine)\b/i, [
    { p: L.heart(0, -10, 8), f: 1, ft: .9, s: 10, m: 'pulse', a: .05, o: [0, 0] }, { p: 'M-190 90 L190 -90', s: 8 }, { p: 'M190 -90 L160 -95 M190 -90 L175 -65', f: 2, s: 8 }, { p: 'M-190 90 L-165 70 M-190 90 L-170 110 M-175 80 L-150 60 M-180 100 L-155 85', s: 5, i: 2 },
    { p: L.heart(-130, -100, 2), f: 2, ft: .9, s: 4, m: 'bob', a: 8 }, { p: L.heart(130, 90, 1.6), f: 2, ft: .9, s: 4, m: 'bob', a: 8, ph: 1 },
  ], { moods: ['romantico'] });
  F('campanadas', 'AÑO NUEVO', /\b(a[nñ]o nuevo|new year|nochevieja|new year'?s eve|fin de a[nñ]o|feliz a[nñ]o|happy new year|medianoche|midnight|doce campanadas|countdown|cuenta regresiva)\b/i, [
    { c: [0, 0, 130], f: -1, s: 10 }, ...Array.from({ length: 12 }, (_, i) => { const a = -Math.PI / 2 + i / 12 * Math.PI * 2; return { p: `M${(Math.cos(a) * 110).toFixed(0)} ${(Math.sin(a) * 110).toFixed(0)} L${(Math.cos(a) * 125).toFixed(0)} ${(Math.sin(a) * 125).toFixed(0)}`, s: 5 }; }),
    { p: 'M0 0 V-100', s: 9, i: 2 }, { p: 'M0 0 V-100', s: 7, i: 1, m: 'spin', a: .01, o: [0, 0] }, { c: [0, 0, 12], f: 1, s: 0 }, { p: L.star(-150, -120, 14, 5, .45), f: 2, s: 3, m: 'pulse', a: .5, o: [-150, -120] }, { p: L.star(150, -120, 14, 5, .45), f: 1, s: 3, m: 'pulse', a: .5, o: [150, -120], ph: 1 },
  ], { moods: ['euforico', 'nostalgico'] });
  F('ramo_novia', 'RAMO DE NOVIA', /\b(ramo de novia|bouquet|boda|wedding|novia|bride|novio|groom|casarse|marry me|casamiento|altar de boda|luna de miel|honeymoon)\b/i, [
    { p: 'M-40 40 L0 170 L40 40 Z', f: -1, s: 9 }, { p: 'M-50 60 H50', s: 6, i: 2 }, ...[[-50, -20], [0, -50], [50, -20], [-30, 20], [30, 20], [0, -10]].map(([x, y], i) => ({ c: [x, y, 30], f: [1, 2, 3][i % 3], ft: .85, s: 8 })), ...[[-50, -20], [0, -50], [50, -20]].map(([x, y]) => ({ c: [x, y, 10], f: -1, s: 4 })),
    { p: 'M-20 150 L-60 190 M20 150 L60 190', s: 6, i: 2 },
  ], { moods: ['romantico'] });
  F('mono_novio', 'CORBATÍN', /\b(mo[nñ]o|bow tie|esmoquin|tuxedo|smoking|traje de gala|formal wear|gala|baile de graduaci[oó]n|prom)\b/i, [
    { p: 'M0 0 L-110 -70 V70 Z', f: 1, ft: .95, s: 10, m: 'sway', a: .01, o: [0, 0] }, { p: 'M0 0 L110 -70 V70 Z', f: 1, ft: .95, s: 10, m: 'sway', a: -.01, o: [0, 0] }, { p: L.rr(-24, -34, 48, 68, 12), f: 2, ft: .95, s: 9 }, { p: 'M-80 -40 L-40 -20 M-80 0 L-40 0 M-80 40 L-40 20 M80 -40 L40 -20 M80 0 L40 0 M80 40 L40 20', s: 3 },
  ], { moods: ['romantico', 'nostalgico'] });
  F('serpentina', 'FIESTA', /\b(fiestas?|party|parties|fiestita|rumba|parranda|farra|juerga|after party|pachanga|festejo|bash)\b/i, [
    { p: 'M-110 100 L0 -140 L110 100 Z', f: 2, ft: .9, s: 10 }, { p: 'M-70 60 H70 M-40 0 H40', s: 4, i: 1 }, ...[[-40, 30], [30, 60], [0, -40]].map(([x, y], i) => ({ c: [x, y, 10], f: [1, 3, 1][i], ft: .9, s: 4 })), { c: [0, -150, 16], f: 1, ft: .95, s: 8, m: 'pulse', a: .1, o: [0, -150] },
    { p: 'M-190 -50 C-150 -90 -100 -30 -60 -70 M190 -50 C150 -90 100 -30 60 -70', s: 5, i: 2, m: 'sway', a: .05, o: [0, -100] }, ...[[-150, 60], [150, 40], [-120, -130], [130, -140]].map(([x, y], i) => ({ p: L.star(x, y, 10, 5, .45), f: [1, 2][i % 2], s: 3, m: 'pulse', a: .5, o: [x, y], ph: i })), gnd,
  ], { moods: ['euforico', 'feliz'] });
  F('guirnalda', 'GUIRNALDA', /\b(guirnaldas?|garlands?|banderines|bunting|luces de fiesta|string lights|luces navide[nñ]as|christmas lights|lucecitas|fairy lights)\b/i, [
    { p: 'M-190 -80 C-100 40 100 40 190 -80', s: 5 }, ...[-150, -100, -50, 0, 50, 100, 150].map((x, i) => { const y = -80 + (1 - Math.pow(x / 190, 2)) * 100 * .95; return { p: `M${x - 14} ${y.toFixed(0)} L${x + 14} ${y.toFixed(0)} L${x} ${(y + 40).toFixed(0)} Z`, f: [1, 2, 3][i % 3], ft: .9, s: 6, m: 'sway', a: .04, o: [x, y], ph: i * .3 }; }),
    ...[[-120, 100], [0, 130], [120, 100]].map(([x, y], i) => ({ c: [x, y, 10], f: 2, ft: .95, s: 4, m: 'blink', v: 1.5, ph: i })),
  ], { moods: ['feliz', 'nostalgico'] });
  F('farolillo', 'FAROLILLO', /\b(linternas de papel|paper lanterns?|lanternas?|farolillos?|lantern|lanterns|luces flotantes|floating lanterns|festival de luces)\b/i, [
    { e: [0, 0, 80, 100], f: 2, ft: .85, s: 10, m: 'sway', a: .02, o: [0, -100] }, { p: 'M-60 -60 C-30 -40 30 -40 60 -60 M-80 0 H80 M-60 60 C-30 40 30 40 60 60', s: 4 }, { p: 'M-40 -100 H40 M-30 100 H30', s: 8 }, { p: 'M0 -100 V-170 M-20 -170 H20', s: 5 }, { p: 'M-20 100 V150 M0 100 V160 M20 100 V150', s: 5, i: 2, m: 'sway', a: .05, o: [0, 100] },
  ], { moods: ['sereno', 'nostalgico'] });
  F('cotillon', 'CORNETA', /\b(cotill[oó]n|party horn|corneta de fiesta|party blower|gorro de fiesta|party hat|sombrero de fiesta|noisemaker)\b/i, [
    { p: 'M-80 100 L0 -150 L80 100 Z', f: 1, ft: .9, s: 10 }, { p: 'M-60 50 H60 M-40 0 H40 M-20 -50 H20', s: 4, i: 2 }, ...[[-30, 60], [30, 20], [-10, -20]].map(([x, y], i) => ({ c: [x, y, 8], f: 2, ft: .95, s: 0 })), { c: [0, -160, 20], f: 2, ft: .95, s: 8, m: 'pulse', a: .1, o: [0, -160] },
    ...[[-110, -80], [110, -100], [130, 0]].map(([x, y], i) => ({ p: L.star(x, y, 10, 5, .45), f: [2, 1, 3][i], s: 3, m: 'pulse', a: .5, o: [x, y], ph: i })),
  ], { moods: ['euforico'] });
  F('fogata', 'FOGATA', /\b(fogata|campfire|hoguera|bonfire|acampar|camping|campamento|tienda de campa[nñ]a|tent|malvavisco|marshmallow)\b/i, [
    { p: 'M-110 150 L110 100 M110 150 L-110 100', s: 14 }, { p: 'M0 110 C-70 90 -60 20 -20 -10 C-30 40 0 50 10 20 C20 -30 50 -70 60 -130 C90 -70 110 -20 80 50 C70 90 40 110 0 110 Z', f: 1, ft: .85, s: 9, m: 'sway', a: .03, o: [0, 110] }, { p: 'M0 110 C-30 90 -20 50 0 40 C10 60 40 60 30 100 Z', f: 2, ft: .95, s: 6, m: 'sway', a: .05, o: [0, 110], ph: 1 },
    { c: [-100, -60, 5], f: 2, s: 0, m: 'steam', a: 60 }, { c: [110, -30, 4], f: 2, s: 0, m: 'steam', a: 70, ph: .5 }, gnd,
  ], { moods: ['nostalgico', 'sereno', 'romantico'] });
  F('picnic', 'PICNIC', /\b(picnic|pic-?nic|merienda|manta de picnic|picnic blanket|cesta de picnic|picnic basket)\b/i, [
    { p: 'M-190 130 L-140 60 H140 L190 130 Z', f: 1, ft: .6, s: 9 }, { p: 'M-165 95 H165 M-90 60 L-115 130 M0 60 V130 M90 60 L115 130', s: 3 }, { p: 'M-70 60 V0 H0 V60', f: 2, ft: .8, s: 8 }, { p: 'M-70 0 C-70 -60 0 -60 0 0', s: 8 }, { c: [60, 40, 20], f: 1, ft: .9, s: 7 }, { p: 'M50 20 L60 10', s: 3 },
    { p: 'M110 60 V30 H140 V60', f: -1, s: 6 }, { c: [130, -100, 34], f: 2, ft: .9, s: 6, m: 'pulse', a: .04, o: [130, -100] },
  ], { moods: ['feliz', 'sereno', 'romantico'] });
  F('sombrilla', 'SOMBRILLA DE PLAYA', /\b(sombrilla de playa|beach umbrella|playa|beach|arena y sol|sand and sun|vacaciones|vacation|holidays|verano|summer|veraneo|bronceado|suntan|tan lines)\b/i, [
    { p: 'M-150 -20 C-150 -140 150 -140 150 -20 C110 -40 70 -20 40 -40 C10 -20 -10 -20 -40 -40 C-70 -20 -110 -40 -150 -20 Z', f: 1, ft: .85, s: 10 }, { p: 'M-70 -110 L-40 -30 M0 -125 V-40 M70 -110 L40 -30', s: 4 }, { p: 'M0 -125 V150', s: 9 },
    { p: 'M-190 150 C-120 130 -60 160 0 150 C60 140 120 160 190 145 V180 H-190 Z', f: 2, ft: .5, s: 7 }, { c: [90, 40, 24], f: 2, ft: .9, s: 6 }, { p: 'M60 130 L120 130', s: 8 },
  ], { moods: ['feliz', 'sereno'] });
  F('bola_disco', 'BOLA DE DISCO', /\b(bola de disco|disco ball|mirror ball|discoteca ochentera|disco fever|saturday night|noche de baile|dancefloor|pista de baile|dance floor)\b/i, [
    { p: 'M0 -190 V-100', s: 6 }, { c: [0, 0, 100], f: -1, s: 10, m: 'spin', a: .3, o: [0, 0] }, ...[-60, -20, 20, 60].map(y => ({ p: `M-95 ${y} C-40 ${y + 20} 40 ${y + 20} 95 ${y}`, s: 3 })), ...[-60, -20, 20, 60].map(x => ({ p: `M${x} -95 C${x + 30} -30 ${x + 30} 30 ${x} 95`, s: 3 })),
    ...[[-150, -90], [150, -110], [-140, 100], [160, 90], [0, 150]].map(([x, y], i) => ({ p: L.star(x, y, 12, 4, .4), f: [1, 2][i % 2], s: 3, m: 'pulse', a: .6, v: 1.5, o: [x, y], ph: i * .6 })),
  ], { moods: ['euforico'] });
  F('champan', 'BRINDIS', /\b(brindis|toast|cheers|chin chin|champ[aá]n|champagne|espumante|sparkling wine|descorchar|uncork|copas en alto|raise a glass|prost)\b/i, [
    { p: 'M-130 -60 H-30 C-30 20 -50 60 -80 70 C-110 60 -130 20 -130 -60 Z', f: 2, ft: .55, s: 9, g: 0 }, { p: 'M-80 70 V140 M-120 150 H-40', s: 8 }, { p: 'M130 -60 H30 C30 20 50 60 80 70 C110 60 130 20 130 -60 Z', f: 2, ft: .55, s: 9 }, { p: 'M80 70 V140 M40 150 H120', s: 8 },
    ...[[-80, -20], [80, -30], [-60, 20], [60, 10]].map(([x, y], i) => ({ c: [x, y, 5], s: 3, m: 'steam', a: 50, ph: i * .25 })), ...[[0, -110], [-40, -140], [40, -140]].map(([x, y], i) => ({ p: L.star(x, y, 12, 5, .45), f: [2, 1, 2][i], s: 3, m: 'pulse', a: .5, o: [x, y], ph: i })),
  ], { moods: ['euforico', 'romantico'] });
  F('gorro_navidad', 'GORRO NAVIDEÑO', /\b(gorro de navidad|santa hat|santa claus|pap[aá] noel|navidad|christmas|xmas|nochebuena|villancicos?|carols?|reno de navidad|rudolph)\b/i, [
    { p: 'M-110 60 C-110 -60 -30 -130 60 -120 C110 -110 140 -60 130 0 C120 30 110 60 110 60 Z', f: 1, ft: .9, s: 10, m: 'sway', a: .02, o: [-100, 60] }, { p: L.rr(-130, 55, 260, 50, 25), f: -1, s: 9 }, { c: [135, 10, 30], f: -1, s: 9, m: 'sway', a: .05, o: [110, -60] },
    ...[[-80, 80], [-20, 85], [40, 80], [100, 85]].map(([x, y]) => ({ c: [x, y, 5], f: 3, ft: .6, s: 0 })), ...[[-150, -100], [150, -130], [-130, 130]].map(([x, y], i) => ({ p: L.star(x, y, 12, 6, .4), f: 3, s: 3, m: 'pulse', a: .5, o: [x, y], ph: i })),
  ], { moods: ['nostalgico', 'feliz'] });
  F('calcetin_navidad', 'CALCETÍN NAVIDEÑO', /\b(calcet[ií]n navide[nñ]o|christmas stocking|medias navide[nñ]as|stocking|regalos de navidad|christmas gifts|nieve navide[nñ]a|chimenea navide[nñ]a|fireplace)\b/i, [
    { p: 'M-50 -140 H50 V30 C50 60 90 70 100 100 C110 140 60 150 20 130 C-30 110 -50 90 -50 30 Z', f: 1, ft: .9, s: 10 }, { p: L.rr(-60, -160, 120, 40, 16), f: -1, s: 9 }, { p: 'M-50 -100 H50 M-50 -60 H50 M-50 -20 H50', s: 5, i: 2 }, { p: L.star(70, 110, 14, 5, .45), f: 2, s: 4, m: 'pulse', a: .3, o: [70, 110] },
    { p: 'M-190 170 H190', s: 8 }, { p: L.star(-140, -60, 12, 6, .4), f: 3, s: 3, m: 'pulse', a: .5, o: [-140, -60] },
  ], { moods: ['nostalgico', 'feliz'] });
  F('trineo', 'TRINEO', /\b(trineo|sled|sleigh|toboggan|patinaje sobre hielo|ice skating|patines de hielo|ice skates|pista de hielo|ice rink)\b/i, [
    { p: 'M-140 90 H120 C150 90 150 40 120 40', s: 9 }, { p: 'M-110 90 V30 H80 V90', f: 1, ft: .85, s: 9 }, { p: 'M-130 60 H-100', s: 5 }, { p: 'M-190 130 C-120 110 -60 140 0 130 C60 120 120 140 190 125', s: 6, i: 3, m: 'drift', a: 6 }, { p: 'M-190 150 H190', s: 4, i: 3 },
    { c: [-30, -20, 22], f: 2, ft: .9, s: 8 }, { p: 'M-30 2 V30', s: 8 }, { p: L.star(-140, -100, 12, 6, .4), f: 3, s: 3, m: 'fall', a: 80 }, { p: L.star(120, -60, 10, 6, .4), f: 3, s: 3, m: 'fall', a: 70, ph: .4 },
  ], { moods: ['feliz', 'nostalgico'] });

  // ---------- ropa ----------
  P('camisa', 'CAMISA', /\b(camisas?|shirts?|camiseta|t-?shirt|blusa|blouse|polera|playera|jersey|remera)\b/i, [
    { p: 'M-70 -110 L-160 -60 L-130 -10 L-90 -30 V130 H90 V-30 L130 -10 L160 -60 L70 -110 C50 -70 -50 -70 -70 -110 Z', f: 3, ft: .6, s: 10 }, { p: 'M-50 -100 L0 -40 L50 -100', s: 6 }, { p: 'M0 -40 V130', s: 4 }, ...[-10, 30, 70, 110].map(y => ({ c: [0, y, 4], f: 1, s: 0 })), { p: 'M-70 -110 C-50 -70 50 -70 70 -110', s: 8 },
  ], { moods: ['nostalgico'] });
  P('pantalon', 'PANTALÓN', /\b(pantalones?|pants|jeans|vaqueros?|trousers|mezclilla|denim|shorts|bermudas?)\b/i, [
    { p: 'M-90 -130 H90 L100 170 H30 L0 -20 L-30 170 H-100 Z', f: 1, ft: .8, s: 10 }, { p: 'M-90 -100 H90', s: 6 }, ...[-60, -30, 30, 60].map(x => ({ c: [x, -115, 4], f: -1, s: 0 })), { p: 'M-60 -90 V-40 M60 -90 V-40', s: 4 }, { p: 'M-100 150 H-30 M30 150 H100', s: 4, i: 2 }, { p: 'M0 -130 V-20', s: 4 },
  ], { moods: ['nostalgico'] });
  P('vestido', 'VESTIDO', /\b(vestidos?|dress(es)?|falda|skirt|traje de noche|evening gown|gown|minifalda|miniskirt)\b/i, [
    { p: 'M-30 -140 L-50 -50 C-90 20 -140 90 -160 160 H160 C140 90 90 20 50 -50 L30 -140 C10 -120 -10 -120 -30 -140 Z', f: 2, ft: .85, s: 10 }, { p: 'M-50 -50 H50', s: 6, i: 1 }, { p: 'M-60 40 C-30 60 30 60 60 40 M-100 100 C-50 125 50 125 100 100', s: 4 }, { p: 'M-30 -140 C-30 -180 30 -180 30 -140', s: 5 },
  ], { moods: ['romantico'] });
  P('tacones', 'TACONES', /\b(tacones?|tac[oó]n alto|high heels?|heels|stilettos?|zapatos de tac[oó]n|zapatillas de tac[oó]n|pumps)\b/i, [
    { p: 'M-140 90 C-140 30 -110 -30 -80 -80 L-30 -70 C-30 -20 0 20 60 40 C110 50 130 60 140 90 Z', f: 1, ft: .9, s: 10 }, { p: 'M-130 90 L-110 150 H-90 L-100 90', f: 1, ft: .95, s: 8 }, { p: 'M-60 -60 C-40 -20 0 20 60 40', s: 4, i: 2 }, { p: 'M-190 170 H190', s: 8 }, { p: 'M140 90 L160 100 L140 100', s: 4 },
  ], { moods: ['romantico', 'euforico'] });
  P('tenis_zapato', 'TENIS', /\b(zapatillas|sneakers?|tenis de correr|running shoes?|kicks|zapatos deportivos|trainers|air max|jordans|sneakerhead)\b/i, [
    { p: 'M-150 40 C-150 -20 -130 -70 -100 -80 L-40 -70 C-30 -30 20 0 80 10 C130 15 150 40 150 70 H-150 Z', f: 2, ft: .85, s: 10 }, { p: 'M-150 70 H150 V100 C150 110 -150 110 -150 100 Z', f: -1, s: 9 }, { p: 'M-90 -60 L-60 -20 M-70 -75 L-40 -35 M-50 -70 L-20 -30', s: 4 }, { p: 'M-40 20 C0 40 60 40 110 30', s: 4, i: 3 },
  ], { moods: ['euforico', 'desafiante'] });
  P('botas', 'BOTAS', /\b(botas?|boots?|botines?|ankle boots?|botas de cuero|cowboy boots?|botas vaqueras|rain boots|botas de lluvia|wellies)\b/i, [
    { p: 'M-60 -150 H40 V20 C40 40 130 50 140 90 V130 H-90 V30 C-70 0 -60 -60 -60 -150 Z', f: 3, ft: .65, s: 10 }, { p: 'M-90 130 H140 V150 H-90 Z', f: 1, ft: .9, s: 8 }, { p: 'M-60 -100 H40 M-60 -60 H40', s: 4 }, { p: 'M-60 -150 H40', s: 8, i: 2 }, { p: 'M-90 150 V170 H-60', s: 8 },
  ], { moods: ['desafiante', 'nostalgico'] });
  P('gorra', 'GORRA', /\b(gorras?|caps?|baseball cap|gorra de b[eé]isbol|snapback|visera|visor|sombrero de sol|sun hat|bucket hat|beanie|gorro de lana)\b/i, [
    { p: 'M-110 40 C-110 -70 110 -70 110 40 Z', f: 1, ft: .9, s: 10 }, { p: 'M-110 40 C-60 70 60 70 130 50 C170 45 190 60 190 60 C190 80 140 90 100 80 C50 100 -50 90 -110 60 Z', f: 1, ft: .95, s: 9 }, { c: [0, -60, 10], f: 2, s: 6 }, { p: 'M0 -55 V40 M-60 -30 C-50 0 -40 30 -30 45 M60 -30 C50 0 40 30 30 45', s: 3 },
  ], { moods: ['desafiante'] });
  P('bufanda', 'BUFANDA', /\b(bufandas?|scarf|scarves|pa[nñ]uelo|handkerchief|bandana|chalinas?|shawl|mantilla|pashmina)\b/i, [
    { p: 'M-130 -60 C-130 -110 130 -110 130 -60 C130 -20 100 0 60 -10 C20 -20 -20 -20 -60 -10 C-100 0 -130 -20 -130 -60 Z', f: 1, ft: .85, s: 10 }, { p: 'M40 -10 C60 20 60 80 50 150 H100 C110 80 110 20 90 -8', f: 1, ft: .85, s: 9, m: 'sway', a: .03, o: [70, -10] }, ...[-60, -20, 20, 60].map(x => ({ p: `M${x} -75 L${x + 20} -40`, s: 4, i: 2 })), { p: 'M50 150 V170 M65 150 V172 M80 150 V170 M95 150 V172', s: 4 },
  ], { moods: ['nostalgico', 'triste'] });
  P('guantes_lana', 'GUANTES', /\b(guantes?|mittens?|gloves?|mitones|manoplas)\b/i, [
    { p: 'M-90 150 V50 C-90 40 -100 -30 -80 -60 C-70 -70 -60 -60 -60 -40 V-100 C-60 -120 -30 -120 -30 -100 V-40 C-30 -130 0 -130 0 -100 V-30 C0 -130 30 -130 30 -100 V-20 C40 -100 60 -100 60 -80 V30 C70 20 90 20 90 40 C90 80 60 100 60 150 Z', f: 2, ft: .85, s: 9 }, { p: 'M-90 110 H60 M-90 130 H60', s: 5, i: 1 },
  ], { moods: ['triste', 'nostalgico'] });
  P('chaqueta', 'CHAQUETA', /\b(chaquetas?|jackets?|chamarra|cazadora|abrigos?|coats?|sudadera|hoodie|su[eé]ter|sweater|pullover|chompa|cardigan|chaleco|vest)\b/i, [
    { p: 'M-60 -120 L-160 -50 L-140 30 L-100 10 V130 H100 V10 L140 30 L160 -50 L60 -120 C40 -80 -40 -80 -60 -120 Z', f: 2, ft: .7, s: 10 }, { p: 'M0 -70 V130', s: 6 }, { p: 'M-60 -120 L-20 -60 L0 -70 L20 -60 L60 -120', s: 6 }, { p: L.rect(-80, 60, 50, 40), s: 4 }, { p: L.rect(30, 60, 50, 40), s: 4 }, ...[-20, 20, 60, 100].map(y => ({ c: [0, y, 4], f: 1, s: 0 })),
  ], { moods: ['nostalgico'] });
  P('corbata', 'CORBATA', /\b(corbatas?|necktie|tie and suit|traje y corbata|suit and tie|traje formal|business suit|trajeado|ejecutivo|executive|oficinista|office worker)\b/i, [
    { p: 'M-30 -130 H30 L20 -100 H-20 Z', f: 1, ft: .95, s: 9 }, { p: 'M-20 -100 L-50 60 L0 150 L50 60 L20 -100 Z', f: 1, ft: .85, s: 10 }, { p: 'M-30 -20 L30 20 M-38 30 L38 70', s: 4, i: 2 }, { p: 'M-110 -170 L-30 -130 M110 -170 L30 -130', s: 8 },
  ], { moods: ['oscuro', 'desafiante'] });
  P('bolso', 'BOLSO', /\b(bolsos?|bolsas?|handbags?|purses?|carteras?|clutch|tote bag|mochilas?|backpacks?|maleta de mano|shopping bag|bolsa de compras)\b/i, [
    { p: 'M-60 -30 C-60 -130 60 -130 60 -30', s: 10 }, { p: 'M-130 -20 H130 L150 140 H-150 Z', f: 2, ft: .8, s: 10 }, { p: 'M-130 20 H130', s: 4, i: 1 }, { p: L.rr(-24, 10, 48, 34, 8), f: 1, ft: .95, s: 6 }, { p: 'M-150 60 L-130 -20 M150 60 L130 -20', s: 0 },
  ], { moods: ['romantico'] });
  P('calcetin', 'CALCETÍN', /\b(calcetines?|socks?|calcetas?|medias|stockings|tights|pantimedias|leggings)\b/i, [
    { p: 'M-50 -150 H50 V20 C50 50 110 60 130 100 C150 140 110 160 70 150 C20 140 -50 100 -50 20 Z', f: 3, ft: .7, s: 10 }, { p: 'M-50 -110 H50 M-50 -70 H50', s: 6, i: 2 }, { p: 'M50 100 C80 120 100 120 120 130', s: 4 }, { p: 'M-190 170 H190', s: 8 },
  ], { moods: ['feliz'] });
  P('traje_bano', 'TRAJE DE BAÑO', /\b(traje de ba[nñ]o|bikini|swimsuit|swimwear|bathing suit|trunks|ba[nñ]ador|malla|speedo)\b/i, [
    { p: 'M-140 -20 C-140 -90 -30 -90 -20 -20 C-30 30 -130 30 -140 -20 Z', f: 2, ft: .9, s: 10 }, { p: 'M20 -20 C30 -90 140 -90 140 -20 C130 30 30 30 20 -20 Z', f: 2, ft: .9, s: 10 }, { p: 'M-140 -40 C-150 -100 -80 -160 -40 -170 M140 -40 C150 -100 80 -160 40 -170', s: 5 }, { p: 'M-70 60 H70 L50 130 H-50 Z', f: 2, ft: .9, s: 10 }, { p: 'M-70 60 C-70 40 70 40 70 60', s: 5, i: 1 },
  ], { moods: ['feliz', 'sereno'] });
  P('chancletas', 'CHANCLETAS', /\b(chancletas?|flip.?flops?|sandalias?|sandals?|ojotas|havaianas|zapatos de playa|slippers?|pantuflas?)\b/i, [
    { p: 'M-100 -130 C-140 -130 -140 40 -100 130 C-60 170 40 170 60 110 C80 30 40 -130 -100 -130 Z', f: 2, ft: .7, s: 10 }, { p: 'M-40 -120 C0 -60 -10 -20 -20 30 M-40 -120 C40 -80 60 -30 50 0', f: 1, ft: .95, s: 10 }, { c: [-20, 40, 6], s: 4 },
    { p: 'M110 -80 C130 -80 150 0 170 60', s: 0 },
  ], { moods: ['feliz', 'sereno'] });
  P('delantal', 'DELANTAL', /\b(delantales?|aprons?|bata de cocina|kitchen apron|overol|overalls?|mono de trabajo|uniforme|uniform)\b/i, [
    { p: 'M-50 -140 L-70 -40 H70 L50 -140', s: 8 }, { p: 'M-70 -40 L-100 150 H100 L70 -40 Z', f: -1, s: 10 }, { p: 'M-100 -40 L-140 -110 M100 -40 L140 -110', s: 6 }, { p: L.rect(-40, 40, 80, 50), f: 3, ft: .7, s: 6 }, { p: 'M-70 -40 H70', s: 4 },
  ], { moods: ['nostalgico'] });
  P('anteojos_negros', 'ROPA DE NOCHE', /\b(ropa|clothes|clothing|outfit|vestimenta|closet|armario|wardrobe|vestirse|get dressed|lentejuelas?|sequins?|encaje|lace|seda|silk|cuero|leather)\b/i, [
    { p: 'M-170 -110 H170', s: 8 }, { p: 'M0 -110 V-140 C0 -160 30 -160 30 -140', s: 7 }, { p: 'M0 -110 L-110 -30 H110 Z', s: 8 }, { p: 'M-110 -30 L-140 150 H-60 Z', f: 2, ft: .85, s: 9, m: 'sway', a: .02, o: [-110, -30] }, { p: 'M0 -30 L-30 150 H30 Z', f: 1, ft: .85, s: 9, m: 'sway', a: .02, o: [0, -30], ph: 1 }, { p: 'M110 -30 L140 150 H60 Z', f: 3, ft: .7, s: 9, m: 'sway', a: .02, o: [110, -30], ph: 2 },
  ], { moods: ['nostalgico'] });

  // ---------- cuerpo ----------
  B('oreja', 'OREJA', /\b(oreja|orejas|o[ií]dos?|ears?|sordo|deaf|susurro|whisper)\b/i, [
    { p: 'M-30 -150 C-110 -150 -120 -50 -80 0 C-60 30 -70 60 -50 90 C-30 130 30 120 40 80 C50 40 20 30 30 0 C50 -50 70 -150 -30 -150 Z', f: 3, ft: .6, s: 10 }, { p: 'M-30 -110 C-70 -110 -80 -50 -50 -20 C-30 0 -40 30 -20 50', s: 6 }, { p: 'M80 -120 C110 -100 110 -60 90 -30 M110 -140 C150 -110 150 -50 120 -10', s: 5, i: 2, m: 'pulse', a: .1, o: [60, -60], v: 2 },
  ], { moods: ['sereno', 'melancolico'] });
  B('dedo_apunta', 'DEDO QUE APUNTA', /\b(apunta|apuntar|dedo [ií]ndice|index finger|acusar|accuse)\b/i, [
    { p: 'M-150 40 H-40 C-20 40 -10 60 10 60 H60 C90 60 90 100 60 100 H80 C110 100 110 140 80 140 H70 C90 140 90 170 60 170 H-40 C-90 170 -150 150 -150 120 Z', f: -1, s: 9 }, { p: 'M-40 40 V-60 C-40 -80 10 -80 10 -60 V30', f: -1, s: 9 }, { p: 'M-40 -30 H10', s: 3 }, { p: 'M40 -70 L100 -110 M50 -30 L120 -30', s: 4, i: 2, m: 'pulse', a: .2, v: 3, o: [0, -30] },
  ], { moods: ['desafiante', 'rabioso'] });
  B('mano_saludo', 'MANO SALUDANDO', /\b(saludar|saludo|wave hello|waving|adi[oó]s con la mano|wave goodbye|bye bye)\b/i, [
    { p: 'M-70 150 V40 C-90 20 -100 -20 -90 -50 C-80 -60 -60 -40 -60 -20 V-120 C-60 -140 -30 -140 -30 -120 V-30 V-150 C-30 -170 0 -170 0 -150 V-40 V-140 C0 -160 30 -160 30 -140 V-20 V-110 C30 -130 60 -130 60 -110 V40 C70 90 60 130 50 150 Z', f: -1, s: 9, m: 'sway', a: .1, o: [0, 150] },
    { p: 'M90 -100 C120 -80 120 -40 100 -10 M120 -130 C160 -100 160 -30 130 10', s: 5, i: 2, m: 'pulse', a: .1, v: 3, o: [80, -50] },
  ], { moods: ['feliz', 'melancolico'] });
  B('mano_victoria', 'MANO EN V', /\b(victoria|victory sign|peace sign|se[nñ]al de paz|dos dedos|two fingers|amor y paz|love and peace|hippie|flower power|v de victoria)\b/i, [
    { p: 'M-40 150 V50 C-70 30 -80 10 -70 -10 L-30 -30 M-30 -30 L-60 -140 C-70 -170 -30 -180 -20 -150 L10 -40', f: -1, s: 9 }, { p: 'M10 -40 L50 -140 C60 -170 100 -160 90 -130 L50 -20 L60 30 C70 90 60 130 50 150', f: -1, s: 9 }, { p: 'M-30 -30 L10 -40 L50 -20', s: 0 }, { c: [130, -120, 8], f: 2, s: 0 }, { p: L.star(-130, -110, 14, 5, .45), f: 2, s: 3, m: 'pulse', a: .5, o: [-130, -110] },
  ], { moods: ['feliz', 'sereno'] });
  B('brazo_fuerte', 'BRAZO FUERTE', /\b(m[uú]sculo|muscle|muscles|brazo fuerte|flex|flexionar|bicep|b[ií]ceps|poderoso|powerful|superman|hercules)\b/i, [
    { p: 'M-150 150 V50 C-150 -20 -100 -70 -40 -70 C0 -120 70 -100 80 -50 C120 -80 160 -50 150 0 C160 50 120 70 80 60 C60 90 50 130 60 150 Z', f: -1, s: 10 }, { p: 'M-30 -20 C-10 -50 40 -50 60 -10 C40 10 -10 10 -30 -20 Z', f: 2, ft: .7, s: 7, m: 'pulse', a: .05, o: [15, -20], b: 1 }, { p: 'M-150 90 H-80 M60 110 H150', s: 4, i: 2 },
    { p: 'M110 -110 L140 -140 M140 -90 L180 -100', s: 4, m: 'pulse', a: .3, v: 3, o: [110, -90] },
  ], { moods: ['desafiante', 'euforico'] });
  B('cabello_largo', 'CABELLO LARGO', /\b(cabello|pelo|hair|cabellera|melena larga|long hair|rizos|curls|curly|trenzas?|braids?|pelo suelto|hair down|peinado|hairstyle|cabello al viento|hair in the wind)\b/i, [
    { p: 'M-90 -130 C-160 -60 -140 60 -110 120 C-90 160 -60 190 -70 200 M90 -130 C160 -60 140 60 110 120 C90 160 60 190 70 200', s: 10, m: 'sway', a: .03, o: [0, -130] }, { p: 'M-90 -130 C-60 -180 60 -180 90 -130 C40 -150 -40 -150 -90 -130 Z', f: 1, ft: .9, s: 9 },
    ...[-60, -30, 0, 30, 60].map((x, i) => ({ p: `M${x} -150 C${x - 20} -60 ${x + 20} 40 ${x} 130`, s: 5, i: 1, m: 'sway', a: .04, o: [x, -150], ph: i * .3 })), { p: 'M-120 30 C-100 40 -100 60 -110 70', s: 4, i: 2 },
  ], { moods: ['romantico', 'sereno'] });
  B('sonrisa', 'SONRISA', /\b(sonrisa|sonre[ií]r|sonriendo|smile|smiling|risa|laughter|re[ií]r|laugh|laughing|carcajada|giggle|reirse)\b/i, [
    { p: 'M-140 -20 C-120 90 120 90 140 -20 C60 20 -60 20 -140 -20 Z', f: -1, s: 10 }, { p: 'M-140 -20 C-60 20 60 20 140 -20 C120 60 -120 60 -140 -20', f: 1, ft: .95, s: 0 }, ...[-90, -50, -10, 30, 70, 110].map(x => ({ p: `M${x} -5 V${18 + Math.abs(x) * .1}`, s: 4 })), { p: 'M-160 -30 C-180 -20 -170 10 -150 0 M160 -30 C180 -20 170 10 150 0', s: 6 },
    { p: L.star(-100, -110, 14, 4, .4), f: 2, s: 3, m: 'pulse', a: .5, o: [-100, -110] }, { p: L.star(100, -120, 12, 4, .4), f: 2, s: 3, m: 'pulse', a: .5, o: [100, -120], ph: 1 },
  ], { moods: ['feliz', 'euforico'] });
  B('ojos_dormidos', 'OJOS CERRADOS', /\b(dormir|dormido|dormida|sleep|sleeping|asleep|sue[nñ]o profundo|siesta|nap|cerrar los ojos|close my eyes|eyes closed|closing my eyes|despertar|wake up|waking up|insomnio|insomnia|desvelado)\b/i, [
    { p: 'M-170 -10 C-120 40 -50 40 -10 -10', s: 10 }, { p: 'M10 -10 C50 40 120 40 170 -10', s: 10 }, ...[-150, -120, -90, -60, -30].map((x, i) => ({ p: `M${x} ${8 + Math.sin(i / 4 * Math.PI) * 20} L${x - 6} ${28 + Math.sin(i / 4 * Math.PI) * 22}`, s: 5 })), ...[30, 60, 90, 120, 150].map((x, i) => ({ p: `M${x} ${8 + Math.sin(i / 4 * Math.PI) * 20} L${x + 6} ${28 + Math.sin(i / 4 * Math.PI) * 22}`, s: 5 })),
    { p: 'M-60 -90 H-20 L-60 -60 H-20 M20 -120 H60 L20 -90 H60', s: 5, m: 'bob', a: 8 },
  ], { moods: ['sereno', 'melancolico'] });
  B('craneo', 'CRÁNEO', /\b(cr[aá]neo|skull and bones|calavera y huesos|huesos|bones?|esqueleto humano|jolly|veneno|poison|toxic|t[oó]xico|calaveras cruzadas)\b/i, [
    { p: 'M-90 -20 C-100 -130 100 -130 90 -20 C90 20 60 30 50 60 H-50 C-60 30 -90 20 -90 -20 Z', f: -1, s: 10 }, { c: [-35, -20, 22], f: 1, ft: .95, s: 8 }, { c: [35, -20, 22], f: 1, ft: .95, s: 8 }, { p: 'M-8 15 L0 30 L8 15 Z', f: 1, s: 4 }, { p: 'M-40 60 V80 M-15 60 V80 M15 60 V80 M40 60 V80', s: 5 },
    { p: 'M-170 90 L170 170 M170 90 L-170 170', s: 9 }, { c: [-170, 90, 10], f: -1, s: 6 }, { c: [170, 90, 10], f: -1, s: 6 }, { c: [-170, 170, 10], f: -1, s: 6 }, { c: [170, 170, 10], f: -1, s: 6 },
  ], { moods: ['oscuro'] });
  B('pulmones', 'PULMONES', /\b(pulmones?|lungs?|respirar|breathe|breathing|aliento|breath|sin aliento|breathless|suspiro|sigh|exhalar|exhale|inhalar|inhale)\b/i, [
    { p: 'M-20 -120 V-40 M20 -120 V-40 M-20 -40 C-50 -30 -60 -20 -70 -10 M20 -40 C50 -30 60 -20 70 -10', s: 8 }, { p: 'M-20 -50 C-90 -50 -140 20 -140 100 C-140 150 -100 160 -70 150 C-30 140 -20 100 -20 50 Z', f: 1, ft: .7, s: 10, m: 'pulse', a: .03, o: [-70, 60], v: .8 }, { p: 'M20 -50 C90 -50 140 20 140 100 C140 150 100 160 70 150 C30 140 20 100 20 50 Z', f: 1, ft: .7, s: 10, m: 'pulse', a: .03, o: [70, 60], v: .8 },
    { p: 'M-100 40 L-70 80 M-100 80 L-60 110 M100 40 L70 80 M100 80 L60 110', s: 3 },
  ], { moods: ['sereno', 'melancolico'] });
  B('abrazo', 'ABRAZO', /\b(abrazos?|abrazar|abrazame|abr[aá]zame|hugs?|hugging|embrace|cuddle|cuddles|entre tus brazos|in your arms|en mis brazos|in my arms|acurrucar)\b/i, [
    { c: [-60, -100, 30], f: 1, ft: .9, s: 9 }, { c: [60, -100, 30], f: 2, ft: .9, s: 9 }, { p: 'M-60 -70 C-70 20 -80 80 -70 150 M60 -70 C70 20 80 80 70 150', s: 12 }, { p: 'M-70 -30 C-20 -10 30 -10 80 -30 M-80 10 C-30 30 30 30 90 10', s: 12, i: 1 }, { p: 'M-150 80 C-120 40 -100 20 -70 -10 M150 80 C120 40 100 20 70 -10', s: 6, i: 3 },
    { p: L.heart(0, -40, 3), f: 2, ft: .9, s: 5, m: 'pulse', a: .1, o: [0, -40], v: 2 },
  ], { moods: ['romantico', 'sereno'] });
  B('beso', 'BESO', /\b(besos?|besar|besarte|kiss|kisses|kissing|beso de buenas noches|te doy un beso|smooch|mua)\b/i, [
    { p: 'M-110 0 C-90 -50 -40 -60 0 -30 C40 -60 90 -50 110 0 C90 50 40 70 0 70 C-40 70 -90 50 -110 0 Z', f: 1, ft: .9, s: 10, m: 'pulse', a: .03, o: [0, 0] }, { p: 'M-110 0 C-50 10 50 10 110 0', s: 6 }, { p: 'M-30 -20 C-10 -30 10 -30 30 -20', s: 4, i: 2 },
    { p: L.heart(-130, -100, 2.2), f: 2, ft: .9, s: 4, m: 'bob', a: 8 }, { p: L.heart(130, -110, 1.6), f: 2, ft: .9, s: 4, m: 'bob', a: 8, ph: 1 }, { p: L.heart(140, 90, 1.3), f: 2, ft: .9, s: 4, m: 'bob', a: 8, ph: 2 },
  ], { moods: ['romantico'] });
  B('huellas_pies', 'HUELLAS DE PIES', /\b(huellas|footprints?|footsteps?|caminar juntos|walk together|pisadas)\b/i, [
    ...[[-100, 110, 1], [-20, 50, -1], [60, -10, 1], [140, -70, -1]].flatMap(([x, y, s], i) => [{ e: [x, y, 22, 40, .2 * s], f: [1, 2][i % 2], ft: .85, s: 8, m: 'bob', a: 2, ph: i * .5 }, ...[-22, -8, 6, 20].map((dx, k) => ({ c: [x + dx * s * .9, y - 58 - (k % 2 ? 4 : 0), 8 - k], f: [1, 2][i % 2], ft: .9, s: 5 }))]),
    { p: 'M-190 170 H190', s: 0 },
  ], { moods: ['nostalgico', 'melancolico', 'romantico'] });
  B('cabeza_pensando', 'PENSAMIENTOS', /\b(pensamientos?|thoughts?|en mi cabeza|in my head|overthink)\b/i, [
    { p: 'M-70 130 C-100 60 -100 -60 -50 -110 C10 -160 100 -120 100 -50 C100 -20 70 0 80 40 L120 60 L80 80 V130 Z', f: 3, ft: .5, s: 10 }, { c: [30, -60, 8], f: 1, s: 0 }, { c: [110, -120, 10], s: 5, f: -1 }, { c: [140, -150, 16], s: 6, f: -1 }, { p: 'M100 -195 C140 -215 190 -190 180 -150 C170 -120 110 -130 100 -195 Z', f: 2, ft: .8, s: 5, m: 'pulse', a: .05, o: [140, -160] },
  ], { moods: ['melancolico', 'sereno'] });
  B('latido_ecg', 'LATIDO', /\b(latido|latidos|heartbeat|heartbeats|pulso|pulse|palpitar|palpita|pulsaciones|taquicardia|te llevo en el pecho|coraz[oó]n latiendo|beating heart)\b/i, [
    { p: 'M-190 20 H-100 L-70 -10 L-40 20 L-20 -100 L10 120 L40 -20 L60 20 H190', s: 10, i: 2, m: 'beat', a: .05, o: [0, 20] }, { p: L.heart(0, -110, 3.2), f: 1, ft: .9, s: 8, m: 'pulse', a: .12, o: [0, -110], v: 2, b: 1 }, { p: 'M-190 60 H190', s: 2, i: 3 }, { p: 'M-190 -20 H190', s: 2, i: 3 },
  ], { moods: ['romantico', 'euforico'] });
  B('gota_sangre', 'SANGRE', /\b(sangre|blood|sangrar|bleed|bleeding|herida|wound|cicatriz|scars?)\b/i, [
    { p: 'M0 -170 C-40 -100 -100 -40 -100 30 C-100 100 -50 150 0 150 C50 150 100 100 100 30 C100 -40 40 -100 0 -170 Z', f: 1, ft: .95, s: 10, m: 'pulse', a: .03, o: [0, 30] }, { p: 'M-60 40 C-60 80 -30 110 0 115', s: 5, i: 2 }, { p: 'M-20 -80 C-40 -40 -60 -10 -68 20', s: 4, i: 2 },
    { p: 'M120 -20 C110 0 130 20 120 40', f: 1, s: 5, m: 'fall', a: 120 }, { p: 'M-130 -30 C-140 -10 -120 10 -130 30', f: 1, s: 5, m: 'fall', a: 100, ph: .5 },
  ], { moods: ['rabioso', 'triste', 'oscuro'] });
  B('aplauso', 'APLAUSO', /\b(aplausos?|aplaudir|applause|clap|clapping|ovaci[oó]n|standing ovation|bravo|palmas|palmear|clap your hands)\b/i, [
    { p: 'M-30 150 C-90 100 -100 20 -80 -30 L-60 -40 L-60 -100 C-60 -120 -30 -120 -30 -100 L-30 -110 C-30 -130 0 -130 0 -110 L0 -100 C0 -120 30 -120 30 -100 V30 C30 90 10 130 -30 150 Z', f: -1, s: 9, m: 'wag', a: .04, o: [0, 150], v: 3 }, { p: 'M30 150 C90 100 100 20 80 -30 L60 -40 L60 -100 C60 -120 30 -120 30 -100 V30', f: 1, ft: .3, s: 9 },
    { p: 'M-130 -100 L-160 -130 M-140 -50 L-190 -60 M130 -100 L160 -130 M140 -50 L190 -60 M0 -170 V-140', s: 6, m: 'pulse', a: .3, v: 4, o: [0, -60] },
  ], { moods: ['euforico', 'feliz'] });
  B('hueso', 'HUESO', /\b(hueso|hueso roto|broken bone|fractura|fracture|bone|hueso duro|hard bone|esqueleto de dinosaurio)\b/i, [
    { p: 'M-140 -60 C-190 -100 -190 -20 -150 -20 C-170 20 -110 20 -100 -20 L100 60 C110 20 170 20 150 60 C190 100 190 20 140 20 C140 -20 90 -20 100 20 L-100 -60 Z', f: -1, s: 10 },
  ], { moods: ['oscuro'] });
  if (R.catalog && R.catalog.label) for (const [c, t] of [['objetos', 'objetos'], ['simbolos', 'símbolos'], ['emociones', 'emociones'], ['comida', 'comida y bebida'], ['paises', 'monumentos y países'], ['animales', 'animales'], ['naturaleza', 'naturaleza y cielo'], ['transporte', 'transporte'], ['tecnologia', 'tecnología'], ['musica', 'música'], ['famosos', 'famosos (emblemas)'], ['oficios', 'oficios'], ['deportes', 'deportes'], ['fiestas', 'fiestas'], ['ropa', 'ropa'], ['cuerpo', 'cuerpo']]) R.catalog.label(c, t);
})();
