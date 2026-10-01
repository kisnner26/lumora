// ============================================================
// riso-props-banderas.js — banderas de países ilustradas a mano (fase 1).
// Cada bandera es un dibujo con asta y una tela que ondea (movimiento propio con P.t y golpe con P.beat),
// trazo con temblor y relleno en trama. Ids flag_<iso2>.
//
// Los colores de cada bandera se mapean a las tres tintas (tinta 1 oscura, tinta 2 cálida, tinta 3 suave)
// con un juego de tintas propio (el clip lo elige con shot.inks) y una trama que los distingue:
//   juego 0 índigo y naranja:   B azul = tinta 1 sólida · R rojo = tinta 2 sólida · S celeste = tinta 3 sólida · O naranja = tinta 2 en trama gruesa · Y amarillo = tinta 2 en trama clara · G verde = tinta 1 en trama
//   juego 1 carmín y petróleo:  R rojo = tinta 2 · K negro = tinta 1 · Y amarillo = tinta 3 (ámbar) · B azul = tinta 1 en trama densa
//   juego 2 verde pino y rosa:  G verde = tinta 1 sólida · R rojo = tinta 2 (rosa) · B azul = tinta 3 (lavanda) · Y = tinta 2 en trama clara
//   juego 3 carbón y amarillo:  K negro = tinta 1 · Y amarillo = tinta 2 · S/B azules = tinta 3 · G verde = tinta 3 en trama · R rojo = tinta 1 en trama
//   juego 5 marino y mostaza:   B azul = tinta 1 · Y amarillo = tinta 2 (mostaza) · R rojo = tinta 3 (coral)
// El blanco es siempre el papel. Los escudos se simplifican a formas reconocibles.
// ============================================================
(() => {
  const R = window.RISO; if (!R || !R.props || !R.catalog) return;
  const PI = Math.PI, TAU = PI * 2, sin = Math.sin, cos = Math.cos;
  const MAP = {
    0: { R: [2, 1], B: [1, .95], S: [3, 1], O: [2, .5], Y: [2, .28], G: [1, .5], K: [1, 1], N: [1, 1] },
    1: { R: [2, 1], K: [1, 1], B: [1, .75], S: [3, .6], Y: [3, 1], O: [3, .55], G: [1, .45], N: [1, .9] },
    2: { G: [1, .95], R: [2, 1], B: [3, 1], S: [3, .5], Y: [2, .3], K: [1, 1], O: [2, .55], N: [1, .9] },
    3: { K: [1, 1], Y: [2, 1], S: [3, .7], B: [3, 1], G: [3, .55], R: [1, .55], O: [2, .6], N: [1, .9] },
    5: { B: [1, 1], Y: [2, 1], R: [3, 1], S: [1, .4], G: [1, .5], K: [1, 1], O: [2, .6], N: [1, 1] },
  };

  // ---------- constructores de figuras en coordenadas de bandera (u: 0..1 ancho, v: 0..1 alto) ----------
  const rc = (x, y, w, h, c) => ({ t: 'p', c, pts: [[x, y], [x + w, y], [x + w, y + h], [x, y + h]] });
  const H = (cols, w) => { w = w || cols.map(() => 1); const tot = w.reduce((a, b) => a + b, 0); let y = 0; return cols.map((c, i) => { const h = w[i] / tot, o = rc(0, y, 1, h, c); y += h; return o; }); };
  const V = (cols, w) => { w = w || cols.map(() => 1); const tot = w.reduce((a, b) => a + b, 0); let x = 0; return cols.map((c, i) => { const ww = w[i] / tot, o = rc(x, 0, ww, 1, c); x += ww; return o; }); };
  const ci = (x, y, r, c) => ({ t: 'c', c, x, y, r });
  const po = (pts, c) => ({ t: 'p', c, pts });
  const st = (x, y, r, c, n = 5, inner = .4, rot = -PI / 2) => ({ t: 'p', c, star: 1, pts: Array.from({ length: n * 2 }, (_, i) => { const a = rot + i * PI / n, rr = i % 2 ? r * inner : r; return [x + cos(a) * rr, y + sin(a) * rr]; }), A: 1 });
  const lo = (pts, c) => ({ t: 'l', c, pts });
  const A_ = 1.5;                                                        // proporción por defecto (3:2)
  // los círculos y estrellas se dan con radio relativo al alto; se corrigen por la proporción al dibujar (flag.A)
  const nordic = (cx, th, c) => [rc(0, .5 - th / 2, 1, th, c), { t: 'p', c, vbar: [cx, th] }];
  const saltire = (th, c) => [po([[0, 0], [th, 0], [1, 1 - th * 1.5], [1, 1], [1 - th, 1], [0, th * 1.5]], c), po([[1, 0], [1 - th, 0], [0, 1 - th * 1.5], [0, 1], [th, 1], [1, th * 1.5]], c)];
  const tri = (pts, c) => po(pts, c);

  // ---------- las banderas: [iso, proporción, juego de tintas, figuras, etiqueta, nombre en NATIONS, alias extra] ----------
  const F = [];
  const flag = (iso, A, set, ops, label, nat, extra) => F.push({ iso, A, set, ops, label, nat, extra });
  flag('ni', 1.6, 0, [...H(['B', 'W', 'B']), ci(.5, .5, .2, 'W'), tri([[.5, .33], [.42, .62], [.58, .62]], 'S'), lo([[.42, .62], [.5, .33], [.58, .62], [.42, .62]], 'B'), po([[.44, .58], [.5, .5], [.56, .58]], 'Y')], 'NICARAGUA', 'nicaragua', 'nic[aá]s?|nica|nicas|nicarag\\w*|managua|momotombo');
  flag('pr', 1.5, 0, [...H(['R', 'W', 'R', 'W', 'R']), po([[0, 0], [.42, .5], [0, 1]], 'B'), st(.13, .5, .17, 'W')], 'PUERTO RICO', 'puerto rico', 'boricua\\w*|borinquen|puertorrique[nñ]\\w*|puerto ?ricans?');
  flag('mx', 1.75, 2, [...V(['G', 'W', 'R']), ci(.5, .5, .17, 'G'), ci(.5, .5, .11, 'Y'), po([[.44, .52], [.5, .42], [.56, .52], [.5, .58]], 'R')], 'MÉXICO', 'méxico', 'mexic\\w*|mexican\\w*|cdmx|tenochtitl[aá]n');
  flag('co', 1.5, 1, [...H(['Y', 'B', 'R'], [2, 1, 1])], 'COLOMBIA', 'colombia', 'colombi\\w*|bogot[aá]|medell[ií]n|cali\\b|barranquilla|paisa\\w*|cafetero');
  flag('ve', 1.5, 1, [...H(['Y', 'B', 'R']), ...[0, 1, 2, 3, 4, 5, 6, 7].map(i => st(.22 + i * .08, .43 - sin(i / 7 * PI) * .07 + .07, .035, 'W'))], 'VENEZUELA', 'venezuela', 'venezolan\\w*|caracas|maracaibo|arepa');
  flag('ar', 1.6, 0, [...H(['S', 'W', 'S']), ci(.5, .5, .1, 'Y'), ...Array.from({ length: 8 }, (_, i) => lo([[.5 + cos(i * PI / 4) * .13 / 1.6, .5 + sin(i * PI / 4) * .13], [.5 + cos(i * PI / 4) * .17 / 1.6, .5 + sin(i * PI / 4) * .17]], 'Y'))], 'ARGENTINA', 'argentina', 'argentin\\w*|buenos aires|che boludo|tango');
  flag('br', 1.4, 2, [rc(0, 0, 1, 1, 'G'), po([[.5, .1], [.9, .5], [.5, .9], [.1, .5]], 'Y'), ci(.5, .5, .23, 'B'), po([[.3, .46], [.5, .52], [.7, .46], [.7, .52], [.5, .58], [.3, .52]], 'W')], 'BRASIL', 'brasil', 'brasil\\w*|brazil\\w*|brasile[nñ]\\w*|rio de janeiro|carnaval|samba');
  flag('cl', 1.5, 0, [rc(0, 0, 1, .5, 'W'), rc(0, .5, 1, .5, 'R'), rc(0, 0, .33, .5, 'B'), st(.165, .25, .13, 'W')], 'CHILE', 'chile', 'chilen\\w*|santiago de chile|valpara[ií]so');
  flag('pe', 1.5, 1, [...V(['R', 'W', 'R']), ci(.5, .5, .1, 'G')], 'PERÚ', 'perú', 'peruan\\w*|per[uú]\\b|lima\\b|machu picchu|cusco');
  flag('ec', 1.5, 1, [...H(['Y', 'B', 'R'], [2, 1, 1]), ci(.5, .5, .13, 'W'), ci(.5, .5, .08, 'S')], 'ECUADOR', 'ecuador', 'ecuator\\w*|quito|guayaquil');
  flag('bo', 1.5, 1, [...H(['R', 'Y', 'G']), ci(.5, .5, .09, 'B')], 'BOLIVIA', 'bolivia', 'bolivian\\w*|la paz|santa cruz de la sierra');
  flag('py', 1.6, 0, [...H(['R', 'W', 'B']), ci(.5, .5, .17, 'G'), ci(.5, .5, .12, 'W'), st(.5, .5, .09, 'Y')], 'PARAGUAY', 'paraguay', 'paragua\\w*|asunci[oó]n');
  flag('uy', 1.5, 0, [...H(['W', 'S', 'W', 'S', 'W', 'S', 'W', 'S', 'W']), rc(0, 0, .4, 5 / 9, 'W'), ci(.2, 5 / 18, .12, 'Y')], 'URUGUAY', 'uruguay', 'urugua\\w*|montevideo|charr[uú]a');
  flag('cu', 1.9, 0, [...H(['B', 'W', 'B', 'W', 'B']), po([[0, 0], [.43, .5], [0, 1]], 'R'), st(.13, .5, .16, 'W')], 'CUBA', 'cuba', 'cuba\\w*|la habana|havana|habanero');
  flag('do', 1.6, 0, [rc(0, 0, .5, .5, 'B'), rc(.5, 0, .5, .5, 'R'), rc(0, .5, .5, .5, 'R'), rc(.5, .5, .5, .5, 'B'), rc(0, .44, 1, .12, 'W'), rc(.5 - .04, 0, .08, 1, 'W'), ci(.5, .5, .08, 'G')], 'REP. DOMINICANA', 'dominicana', 'dominican\\w*|santo domingo|quisqueya|dominicano');
  flag('ht', 1.65, 0, [...H(['B', 'R']), rc(.36, .32, .28, .36, 'W'), ci(.5, .5, .07, 'G')], 'HAITÍ', 'haití', 'ha[ií]ti\\w*|port-au-prince');
  flag('jm', 2, 1, [rc(0, 0, 1, 1, 'K'), po([[0, 0], [.5, .5], [0, 1]], 'K'), po([[1, 0], [.5, .5], [1, 1]], 'K'), po([[0, 0], [1, 0], [.5, .5]], 'Y'), po([[0, 1], [1, 1], [.5, .5]], 'Y'), ...saltire(.16, 'Y'), po([[.16, 0], [.84, 0], [.5, .4]], 'K'), po([[.16, 1], [.84, 1], [.5, .6]], 'K')], 'JAMAICA', 'jamaica', 'jamaic\\w*|kingston|yardie|rasta\\w*|bob marley');
  flag('hn', 2, 0, [...H(['S', 'W', 'S']), ...[[.5, .5], [.4, .44], [.6, .44], [.4, .56], [.6, .56]].map(([x, y]) => st(x, y, .05, 'S'))], 'HONDURAS', 'honduras', 'hondure[nñ]\\w*|catrach\\w*|tegucigalpa');
  flag('sv', 1.7, 0, [...H(['B', 'W', 'B']), ci(.5, .5, .1, 'Y'), tri([[.5, .42], [.44, .56], [.56, .56]], 'G')], 'EL SALVADOR', 'el salvador', 'salvadore[nñ]\\w*|guanaco\\w*|san salvador');
  flag('gt', 1.6, 0, [...V(['S', 'W', 'S']), ci(.5, .5, .13, 'G'), ci(.5, .5, .08, 'Y')], 'GUATEMALA', 'guatemala', 'guatemal\\w*|chap[ií]n\\w*|quetzal');
  flag('cr', 1.6, 0, [...H(['B', 'W', 'R', 'W', 'B'], [1, 1, 2, 1, 1])], 'COSTA RICA', 'costa rica', 'costa ric\\w*|tico\\w*|ticos|pura vida|san jos[eé] cr');
  flag('pa', 1.5, 0, [rc(0, 0, .5, .5, 'W'), rc(.5, 0, .5, .5, 'R'), rc(0, .5, .5, .5, 'B'), st(.25, .25, .13, 'B'), st(.75, .75, .13, 'R')], 'PANAMÁ', 'panamá', 'panam[aá]\\w*|canal de panam[aá]');
  flag('us', 1.9, 0, [...H(['R', 'W', 'R', 'W', 'R', 'W', 'R', 'W', 'R', 'W', 'R', 'W', 'R']), rc(0, 0, .4, 7 / 13, 'B'), ...[0, 1, 2, 3].flatMap(i => [0, 1, 2].map(j => ci(.06 + i * .09, .09 + j * .14, .028, 'W')))], 'ESTADOS UNIDOS', 'estados unidos', 'usa\\b|u\\.s\\.a|americ\\w*|yankee\\w*|united states|new york|nueva york|nyc|brooklyn|manhattan|los [aá]ngeles|california|texas|miami|chicago|hollywood|estados unidos|eeuu');
  flag('ca', 2, 0, [...V(['R', 'W', 'R'], [1, 2, 1]), po([[.5, .18], [.55, .34], [.63, .3], [.6, .5], [.66, .48], [.6, .58], [.5, .55], [.4, .58], [.34, .48], [.4, .5], [.37, .3], [.45, .34]], 'R')], 'CANADÁ', 'canadá', 'canad[aá]\\w*|toronto|montreal|vancouver|maple');
  flag('es', 1.5, 1, [...H(['R', 'Y', 'R'], [1, 2, 1]), rc(.2, .38, .09, .24, 'R')], 'ESPAÑA', 'españa', 'espa[nñ]\\w*|spain|spanish|madrid|barcelona|sevilla|andaluc\\w*|flamenc\\w*');
  flag('pt', 1.5, 2, [...V(['G', 'R'], [2, 3]), ci(.4, .5, .15, 'Y'), ci(.4, .5, .09, 'W')], 'PORTUGAL', 'portugal', 'portugu\\w*|portugal|lisboa|lisbon|fado');
  flag('fr', 1.5, 0, [...V(['B', 'W', 'R'])], 'FRANCIA', 'francia', 'franc\\w*|france|french|par[ií]s\\b|paris\\b|eiffel|marseille|marsella');
  flag('it', 1.5, 2, [...V(['G', 'W', 'R'])], 'ITALIA', 'italia', 'ital\\w*|roma\\b|rome\\b|milan\\w*|napoli|venezia|venice|florencia|firenze');
  flag('de', 1.7, 1, [...H(['K', 'R', 'Y'])], 'ALEMANIA', 'alemania', 'german\\w*|alem[aá]n\\w*|berl[ií]n|berlin|munich|m[uú]nich|hamburg\\w*');
  flag('gb', 2, 0, [rc(0, 0, 1, 1, 'B'), ...saltire(.14, 'W'), ...saltire(.07, 'R'), rc(0, .36, 1, .28, 'W'), rc(.4, 0, .2, 1, 'W'), rc(0, .42, 1, .16, 'R'), rc(.44, 0, .12, 1, 'R')], 'REINO UNIDO', 'reino unido', 'reino unido|united kingdom|\\buk\\b|britain|british|brit[aá]nic\\w*|england|ingl\\w*|londres|london|scotland|escocia|wales|gales|big ben');
  flag('ie', 2, 2, [...V(['G', 'W', 'O'])], 'IRLANDA', 'irlanda', 'irland\\w*|ireland|irish|dubl[ií]n|dublin');
  flag('nl', 1.5, 0, [...H(['R', 'W', 'B'])], 'PAÍSES BAJOS', 'países bajos', 'holand\\w*|netherlands|dutch|amsterdam|[aá]msterdam|neerland\\w*');
  flag('be', 1.15, 3, [...V(['K', 'Y', 'R'])], 'BÉLGICA', 'bélgica', 'b[eé]lgic\\w*|belgi\\w*|bruselas|brussels');
  flag('ch', 1, 0, [rc(0, 0, 1, 1, 'R'), rc(.2, .4, .6, .2, 'W'), rc(.4, .2, .2, .6, 'W')], 'SUIZA', 'suiza', 'suiz\\w*|switzerland|swiss|z[uú]rich|ginebra|geneva');
  flag('se', 1.6, 5, [rc(0, 0, 1, 1, 'B'), rc(0, .42, 1, .16, 'Y'), rc(.28, 0, .1, 1, 'Y')], 'SUECIA', 'suecia', 'suec\\w*|swed\\w*|estocolmo|stockholm');
  flag('no', 1.375, 0, [rc(0, 0, 1, 1, 'R'), rc(0, .4, 1, .2, 'W'), rc(.27, 0, .16, 1, 'W'), rc(0, .45, 1, .1, 'B'), rc(.31, 0, .08, 1, 'B')], 'NORUEGA', 'noruega', 'noruega|norway|norwegian|noruec\\w*|oslo');
  flag('dk', 1.35, 0, [rc(0, 0, 1, 1, 'R'), rc(0, .43, 1, .14, 'W'), rc(.28, 0, .12, 1, 'W')], 'DINAMARCA', 'dinamarca', 'dinamarc\\w*|denmark|danish|copenhague|copenhagen');
  flag('fi', 1.6, 0, [rc(0, 0, 1, 1, 'W'), rc(0, .4, 1, .2, 'B'), rc(.27, 0, .16, 1, 'B')], 'FINLANDIA', 'finlandia', 'finland\\w*|finn\\w*|helsinki');
  flag('gr', 1.5, 0, [...H(['B', 'W', 'B', 'W', 'B', 'W', 'B', 'W', 'B']), rc(0, 0, .37, 5 / 9, 'B'), rc(0, .21, .37, .12, 'W'), rc(.125, 0, .12, 5 / 9, 'W')], 'GRECIA', 'grecia', 'grec\\w*|greece|greek|griego\\w*|atenas|athens|partenon|parthenon');
  flag('tr', 1.5, 0, [rc(0, 0, 1, 1, 'R'), ci(.4, .5, .22, 'W'), ci(.45, .5, .17, 'R'), st(.6, .5, .09, 'W', 5, .4, 0)], 'TURQUÍA', 'turquía', 'turqu\\w*|turk\\w*|estambul|istanbul|ankara');
  flag('ru', 1.5, 0, [...H(['W', 'B', 'R'])], 'RUSIA', 'rusia', 'rusia|russia\\w*|ruso\\w*|mosc[uú]|moscow|siberia|kremlin');
  flag('ua', 1.5, 5, [...H(['B', 'Y'])], 'UCRANIA', 'ucrania', 'ucrania|ukrain\\w*|kiev|kyiv');
  flag('pl', 1.6, 0, [...H(['W', 'R'])], 'POLONIA', 'polonia', 'polonia|poland|polish|polaco\\w*|varsovia|warsaw');
  flag('at', 1.5, 0, [...H(['R', 'W', 'R'])], 'AUSTRIA', 'austria', 'austria\\w*|viena|vienna');
  flag('hu', 2, 2, [...H(['R', 'W', 'G'])], 'HUNGRÍA', 'hungría', 'hungr\\w*|hungary|budapest');
  flag('ro', 1.5, 5, [...V(['B', 'Y', 'R'])], 'RUMANÍA', 'rumanía', 'ruman\\w*|romania\\w*|bucarest|bucharest');
  flag('cn', 1.5, 1, [rc(0, 0, 1, 1, 'R'), st(.17, .27, .17, 'Y'), st(.34, .11, .05, 'Y'), st(.4, .2, .05, 'Y'), st(.4, .33, .05, 'Y'), st(.34, .42, .05, 'Y')], 'CHINA', 'china', 'chin[ao]s?\\b|china|chinese|shanghai|pek[ií]n|beijing|hong kong');
  flag('jp', 1.5, 0, [rc(0, 0, 1, 1, 'W'), ci(.5, .5, .3, 'R')], 'JAPÓN', 'japón', 'jap[oó]n\\w*|japan\\w*|tokio|tokyo|osaka|kioto|kyoto|anime|samur[aá]i|sushi');
  flag('kr', 1.5, 0, [rc(0, 0, 1, 1, 'W'), ci(.5, .5, .2, 'R'), po(Array.from({ length: 13 }, (_, i) => [.5 + cos(i / 12 * PI) * .2 / 1.5, .5 + sin(i / 12 * PI) * .2]), 'B'), rc(.14, .18, .12, .04, 'K'), rc(.74, .78, .12, .04, 'K'), rc(.74, .18, .12, .04, 'K'), rc(.14, .78, .12, .04, 'K')], 'COREA', 'corea', 'korea\\w*|corea\\w*|se[uú]l\\b|seoul|k-?pop|busan');
  flag('in', 1.5, 0, [...H(['O', 'W', 'G']), ci(.5, .5, .1, 'B'), ci(.5, .5, .07, 'W'), ci(.5, .5, .015, 'B')], 'INDIA', 'india', 'india\\b|indian\\w*|hind[uú]|mumbai|delhi|bollywood|taj mahal');
  flag('th', 1.5, 0, [...H(['R', 'W', 'B', 'W', 'R'], [1, 1, 2, 1, 1])], 'TAILANDIA', 'tailandia', 'tailand\\w*|thai\\w*|bangkok');
  flag('ph', 2, 0, [...H(['B', 'R']), po([[0, 0], [.5, .5], [0, 1]], 'W'), st(.1, .5, .08, 'Y', 8, .5)], 'FILIPINAS', 'filipinas', 'filipin\\w*|philippin\\w*|manila');
  flag('vn', 1.5, 1, [rc(0, 0, 1, 1, 'R'), st(.5, .5, .27, 'Y')], 'VIETNAM', null, 'vietnam\\w*|hanoi|saig[oó]n');
  flag('id', 1.5, 0, [...H(['R', 'W'])], 'INDONESIA', null, 'indonesi\\w*|yakarta|jakarta|bali\\b');
  flag('pk', 1.5, 2, [rc(0, 0, 1, 1, 'G'), rc(0, 0, .25, 1, 'W'), ci(.62, .5, .2, 'W'), ci(.68, .46, .17, 'G'), st(.72, .35, .07, 'W')], 'PAKISTÁN', null, 'pakist\\w*|karachi|lahore|islamabad');
  flag('au', 2, 0, [rc(0, 0, 1, 1, 'B'), rc(0, 0, .5, .5, 'B'), ...saltire(.06, 'W'), rc(0, .2, .5, .1, 'W'), rc(.2, 0, .1, .5, 'W'), rc(0, .22, .5, .06, 'R'), rc(.22, 0, .06, .5, 'R'), st(.25, .75, .1, 'W', 7, .45), st(.72, .8, .05, 'W'), st(.62, .4, .05, 'W'), st(.85, .3, .05, 'W'), st(.75, .55, .05, 'W')], 'AUSTRALIA', 'australia', 'australia\\w*|sydney|melbourne|canguro|kangaroo');
  flag('nz', 2, 0, [rc(0, 0, 1, 1, 'B'), rc(0, 0, .5, .5, 'B'), rc(0, .2, .5, .1, 'W'), rc(.2, 0, .1, .5, 'W'), rc(0, .22, .5, .06, 'R'), rc(.22, 0, .06, .5, 'R'), st(.72, .8, .06, 'R'), st(.62, .4, .06, 'R'), st(.85, .3, .06, 'R'), st(.75, .55, .06, 'R')], 'NUEVA ZELANDA', null, 'nueva zelanda|new zealand|kiwi\\w*|auckland');
  flag('za', 1.5, 3, [...H(['R', 'B']), po([[0, 0], [.42, .5], [0, 1]], 'Y'), rc(.3, .34, .7, .32, 'W'), rc(.34, .4, .66, .2, 'G'), po([[0, .1], [.32, .5], [0, .9]], 'K')], 'SUDÁFRICA', 'sudáfrica', 'south africa\\w*|sud[aá]frica\\w*|johannesburg\\w*|cape town|ciudad del cabo');
  flag('ng', 2, 2, [...V(['G', 'W', 'G'])], 'NIGERIA', 'nigeria', 'nigeria\\w*|lagos');
  flag('gh', 1.5, 1, [...H(['R', 'Y', 'G']), st(.5, .5, .16, 'K')], 'GHANA', 'ghana', 'ghana\\w*|accra');
  flag('eg', 1.5, 1, [...H(['R', 'W', 'K']), ci(.5, .5, .1, 'Y')], 'EGIPTO', 'egipto', 'egipt\\w*|egypt\\w*|cairo|el cairo|pir[aá]mides|pyramids');
  flag('ma', 1.5, 2, [rc(0, 0, 1, 1, 'R'), ...[0, 1, 2, 3, 4].map(i => lo([[.5 + cos(-PI / 2 + i * TAU / 5 * 2) * .3 / 1.5, .5 + sin(-PI / 2 + i * TAU / 5 * 2) * .3], [.5 + cos(-PI / 2 + (i + 1) * TAU / 5 * 2) * .3 / 1.5, .5 + sin(-PI / 2 + (i + 1) * TAU / 5 * 2) * .3]], 'G'))], 'MARRUECOS', 'marruecos', 'marruecos|morocco|marroqu\\w*|marrakech|casablanca');
  flag('il', 1.45, 0, [rc(0, 0, 1, 1, 'W'), rc(0, .1, 1, .12, 'B'), rc(0, .78, 1, .12, 'B'), lo([[.5, .3], [.6, .55], [.4, .55], [.5, .3]], 'B'), lo([[.5, .7], [.4, .45], [.6, .45], [.5, .7]], 'B')], 'ISRAEL', 'israel', 'israel\\w*|jerusal[eé]n|tel aviv');
  flag('ae', 2, 2, [rc(0, 0, 1, 1, 'W'), rc(.25, 0, .75, 1 / 3, 'G'), rc(.25, 2 / 3, .75, 1 / 3, 'K'), rc(0, 0, .25, 1, 'R')], 'EMIRATOS', 'emiratos', 'emirat\\w*|dubai|dub[aá]i|abu dhabi');
  flag('bs', 2, 3, [...H(['S', 'Y', 'S']), po([[0, 0], [.45, .5], [0, 1]], 'K')], 'BAHAMAS', null, 'bahamas|bahamian\\w*|nassau');
  flag('tt', 1.67, 1, [rc(0, 0, 1, 1, 'R'), po([[0, 0], [.22, 0], [1, 1], [.78, 1]], 'W'), po([[.05, 0], [.17, 0], [.95, 1], [.83, 1]], 'K')], 'TRINIDAD Y TOBAGO', null, 'trinidad|tobago|trinbago|port of spain');
  flag('bb', 1.5, 5, [...V(['B', 'Y', 'B']), po([[.5, .25], [.44, .5], [.5, .48], [.56, .5]], 'K'), rc(.49, .4, .02, .3, 'K')], 'BARBADOS', null, 'barbados|barbad\\w*|bajan|bridgetown');
  flag('cz', 1.5, 0, [...H(['W', 'R']), po([[0, 0], [.5, .5], [0, 1]], 'B')], 'CHEQUIA', null, 'chequi\\w*|czech\\w*|praga|prague');
  flag('sa', 1.5, 2, [rc(0, 0, 1, 1, 'G'), rc(.25, .62, .5, .05, 'W'), rc(.3, .3, .4, .04, 'W')], 'ARABIA SAUDÍ', null, 'arabia saud\\w*|saudi\\w*|riad|riyadh|mecca|la meca');

  // ---------- geometría y dibujo ----------
  const dens = (pts, close = true) => { const o = [], n = pts.length; for (let i = 0; i < (close ? n : n - 1); i++) { const a = pts[i], b = pts[(i + 1) % n], k = Math.max(1, Math.ceil(Math.hypot(b[0] - a[0], b[1] - a[1]) / .085)); for (let j = 0; j < k; j++) o.push([a[0] + (b[0] - a[0]) * j / k, a[1] + (b[1] - a[1]) * j / k]); } if (close) o.push(pts[0]); else o.push(pts[n - 1]); return o; };
  const circ = (x, y, r, A, n = 26) => Array.from({ length: n + 1 }, (_, i) => [x + cos(i / n * TAU) * r / A, y + sin(i / n * TAU) * r]);
  const geom = new Map();
  const prep = f => { if (geom.has(f.iso)) return geom.get(f.iso);
    const g = f.ops.map(o => { let pts;
      if (o.t === 'c') pts = circ(o.x, o.y, o.r, f.A, o.r < .06 ? 6 : 24);
      else if (o.vbar) { const [cx, th] = o.vbar; pts = [[cx - th / 2 / f.A, 0], [cx + th / 2 / f.A, 0], [cx + th / 2 / f.A, 1], [cx - th / 2 / f.A, 1]]; }
      else pts = o.pts;
      // las estrellas se dibujaron con r relativo al alto: se corrige la x
      if (o.star) { const cxs = pts.reduce((a, p) => a + p[0], 0) / pts.length; pts = pts.map(p => [cxs + (p[0] - cxs) / f.A, p[1]]); }
      return { c: o.c, t: o.t, pts: dens(pts, o.t !== 'l' ? true : false), small: pts.length > 14 || o.t === 'c' || o.t === 'l' }; });
    geom.set(f.iso, g); return g; };

  const def = R.props.def;
  for (const f of F) {
    const id = 'flag_' + f.iso, W = Math.min(310, 205 * f.A), Hh = W / f.A, top = -150 + (205 - Hh) * .05, left = -160;
    def(id, (d, P) => {
      const ops = prep(f), map = MAP[f.set], amp = 9 + P.beat * 7;
      const wave = ([u, v]) => [left + u * W, top + v * Hh + sin(u * 5.4 - P.t * 3.4 + v * .9) * amp * (.15 + u * .85)];
      // asta
      d.s([[left - 8, -168], [left - 8, 190]], { lw: 9, amp: 1.2 }); d.dot(left - 8, -172, 9, 2);
      // la tela: primero los rellenos, después los contornos
      for (const o of ops) { const m = map[o.c]; if (o.c === 'W') d.f(o.pts.map(wave), -1, 1); else if (m && o.t !== 'l') d.f(o.pts.map(wave), m[0], m[1]); }
      for (const o of ops) { if (o.t === 'l') { const m = map[o.c] || [1, 1]; d.s(o.pts.map(wave), { lw: 5, i: m[0], single: true }); } }
      const big = ops.filter(o => !o.small);
      for (const o of big.slice(0, 5)) d.s(o.pts.map(wave), { lw: 4, single: true, amp: 1.4 });
      d.s(dens([[0, 0], [1, 0], [1, 1], [0, 1]]).map(wave), { lw: 8 });
    });
    const nat = f.nat && typeof NATIONS !== 'undefined' ? NATIONS.find(n => n[0] === f.nat) : null;
    const src = (nat ? nat[1].source + '|' : '') + '\\b(' + f.extra + ')\\b';
    R.catalog.add({ id, cat: 'banderas', label: f.label, alias: new RegExp(src, 'i'), prio: 1, moods: [], inks: f.set });
  }
  R.catalog.label('banderas', 'banderas de países');
  R.flags = { list: F.map(f => ({ iso: f.iso, label: f.label, set: f.set, A: f.A })), MAP };
})();
