// ============================================================
// reality.js — lo que la letra nombra, de verdad.
// Banderas reales (flagcdn), íconos oficiales de marcas (los que
// publica cada sitio) y fotos de Wikipedia de lugares, personas y
// cosas nombradas. Todo se pide en vivo por el puente; nada se guarda.
// ============================================================

const IMG = {};
function img(url) {
  if (!url) return null;
  if (IMG[url]) return IMG[url].complete && IMG[url].naturalWidth ? IMG[url] : null;
  const im = new Image(); im.src = url; IMG[url] = im; return null;
}
const via = u => '/img?u=' + encodeURIComponent(u);

// ---------- países: nombre, patrón y código ISO ----------
const COUNTRY = [
  ['puerto rico', 'pr'], ['cuba', 'cu'], ['estados unidos', 'us'], ['méxico', 'mx'], ['colombia', 'co'], ['venezuela', 've'],
  ['nicaragua', 'ni'], ['argentina', 'ar'], ['españa', 'es'], ['dominicana', 'do'], ['brasil', 'br'], ['jamaica', 'jm'],
  ['reino unido', 'gb'], ['francia', 'fr'], ['japón', 'jp'], ['chile', 'cl'], ['perú', 'pe'], ['italia', 'it'],
];
const CODE = Object.fromEntries(COUNTRY);
NATIONS.push(
  ['honduras',     /\b(honduras|hondureñ\w*|catrach\w*|tegucigalpa|san pedro sula)\b/i],
  ['el salvador',  /\b(el salvador|salvadoreñ\w*|guanaco\w*)\b/i],
  ['guatemala',    /\b(guatemal\w*|chap[ií]n\w*)\b/i],
  ['costa rica',   /\b(costa ric\w*|tico\w*|san jos[eé])\b/i],
  ['panamá',       /\b(panam[aá]\w*)\b/i],
  ['ecuador',      /\b(ecuador\w*|quito|guayaquil)\b/i],
  ['bolivia',      /\b(bolivia\w*|la paz)\b/i],
  ['paraguay',     /\b(paragua\w*|asunci[oó]n)\b/i],
  ['uruguay',      /\b(urugua\w*|montevideo)\b/i],
  ['haití',        /\b(ha[ií]ti\w*)\b/i],
  ['canadá',       /\b(canad[aá]\w*|toronto|montreal|vancouver)\b/i],
  ['alemania',     /\b(alemania|germany|german|alem[aá]n\w*|berl[ií]n)\b/i],
  ['portugal',     /\b(portugal|portugu[eé]s\w*|lisboa|lisbon)\b/i],
  ['países bajos', /\b(holand\w*|netherlands|dutch|amsterdam|[aá]msterdam)\b/i],
  ['irlanda',      /\b(irland\w*|ireland|irish|dubl[ií]n)\b/i],
  ['suecia',       /\b(suecia|sweden|swedish|estocolmo|stockholm)\b/i],
  ['grecia',       /\b(grecia|greece|greek|griego\w*|atenas|athens)\b/i],
  ['turquía',      /\b(turqu[ií]a|turkey|turco\w*|estambul|istanbul)\b/i],
  ['rusia',        /\b(rusia|russia\w*|ruso\w*|mosc[uú]|moscow)\b/i],
  ['china',        /\b(china|chinese|chino\w*|shanghai|pek[ií]n|beijing)\b/i],
  ['corea',        /\b(korea\w*|corea\w*|seoul|se[uú]l)\b/i],
  ['india',        /\b(india|indian|hind[uú]|mumbai|delhi)\b/i],
  ['nigeria',      /\b(nigeria\w*|lagos)\b/i],
  ['ghana',        /\b(ghana\w*|accra)\b/i],
  ['sudáfrica',    /\b(south africa\w*|sud[aá]frica\w*|johannesburg\w*|cape town)\b/i],
  ['egipto',       /\b(egipt\w*|egypt\w*|cairo|el cairo)\b/i],
  ['marruecos',    /\b(marruecos|morocco|marroqu[ií]\w*|marrakech)\b/i],
  ['australia',    /\b(australia\w*|sydney|melbourne)\b/i],
  ['israel',       /\b(israel\w*|jerusal[eé]n)\b/i],
  ['emiratos',     /\b(dubai|dub[aá]i|abu dhabi|emirat\w*)\b/i],
  ['tailandia',    /\b(tailandia|thailand|bangkok)\b/i],
  ['filipinas',    /\b(filipinas|philippines|manila)\b/i],
  ['suiza',        /\b(suiza|switzerland|swiss|z[uú]rich|ginebra|geneva)\b/i],
  ['bélgica',      /\b(b[eé]lgica|belgium|bruselas|brussels)\b/i],
  ['austria',      /\b(austria|viena|vienna)\b/i],
  ['polonia',      /\b(polonia|poland|polish|varsovia|warsaw)\b/i],
  ['ucrania',      /\b(ucrania|ukraine|kiev|kyiv)\b/i],
  ['noruega',      /\b(noruega|norway|oslo)\b/i],
  ['monaco',       /\b(m[oó]naco|monte ?carlo)\b/i],
  ['trinidad',     /\b(trinidad|tobago)\b/i],
  ['bahamas',      /\b(bahamas|nassau)\b/i],
  ['barbados',     /\b(barbados)\b/i],
);
Object.assign(CODE, {
  'honduras': 'hn', 'el salvador': 'sv', 'guatemala': 'gt', 'costa rica': 'cr', 'panamá': 'pa', 'ecuador': 'ec', 'bolivia': 'bo', 'paraguay': 'py',
  'uruguay': 'uy', 'haití': 'ht', 'canadá': 'ca', 'alemania': 'de', 'portugal': 'pt', 'países bajos': 'nl', 'irlanda': 'ie', 'suecia': 'se',
  'grecia': 'gr', 'turquía': 'tr', 'rusia': 'ru', 'china': 'cn', 'corea': 'kr', 'india': 'in', 'nigeria': 'ng', 'ghana': 'gh', 'sudáfrica': 'za',
  'egipto': 'eg', 'marruecos': 'ma', 'australia': 'au', 'israel': 'il', 'emiratos': 'ae', 'tailandia': 'th', 'filipinas': 'ph', 'suiza': 'ch',
  'bélgica': 'be', 'austria': 'at', 'polonia': 'pl', 'ucrania': 'ua', 'noruega': 'no', 'monaco': 'mc', 'trinidad': 'tt', 'bahamas': 'bs', 'barbados': 'bb',
});
// el patrón del concepto "bandera" ahora incluye todos los países
{ const i = LEX.findIndex(l => l[0] === 'nation'); if (i >= 0) LEX[i][1] = new RegExp(NATIONS.map(n => n[1].source).join('|'), 'i'); }

// bandera real ondeando (si aún no cargó, la dibujada de symbols.js)
const _wavingFlag = wavingFlag;
wavingFlag = function (name, fx, fy, fw, t, k) {
  const code = CODE[name], im = code && img(via(`https://flagcdn.com/w640/${code}.png`));
  if (!im) return _wavingFlag(name, fx, fy, fw, t, k);
  const iw = im.naturalWidth, ih = im.naturalHeight, fh = fw * ih / iw, cols = 36, cw = fw / cols;
  x.strokeStyle = `rgba(200,200,205,${k})`; x.lineWidth = 3; x.beginPath(); x.moveTo(fx, fy - 6); x.lineTo(fx, fy + fh * 2.6); x.stroke();
  x.globalAlpha = k;
  for (let i = 0; i < cols; i++) {
    const u = i / cols, off = Math.sin(u * 7 - t * 3.2) * fh * .07 * u, shade = Math.cos(u * 7 - t * 3.2) * .16 * u;
    x.drawImage(im, u * iw, 0, iw / cols + .5, ih, fx + i * cw, fy + off, cw + .6, fh);
    x.fillStyle = shade > 0 ? `rgba(255,255,255,${shade})` : `rgba(0,0,0,${-shade})`; x.fillRect(fx + i * cw, fy + off, cw + .6, fh);
  }
  x.globalAlpha = 1;
};

// ---------- marcas reales: su ícono oficial ----------
const BRAND_SITE = {
  chanel: 'chanel.com', gucci: 'gucci.com', prada: 'prada.com', dior: 'dior.com', 'louis vuitton': 'louisvuitton.com', lv: 'louisvuitton.com',
  balenciaga: 'balenciaga.com', versace: 'versace.com', fendi: 'fendi.com', hermes: 'hermes.com', hermès: 'hermes.com', cartier: 'cartier.com',
  rolex: 'rolex.com', patek: 'patek.com', audemars: 'audemarspiguet.com', moncler: 'moncler.com', bape: 'bape.com', supreme: 'supremenewyork.com',
  'off-white': 'off---white.com', offwhite: 'off---white.com', nike: 'nike.com', adidas: 'adidas.com', puma: 'puma.com', jordan: 'nike.com', yeezy: 'adidas.com',
  apple: 'apple.com', iphone: 'apple.com', ferrari: 'ferrari.com', lamborghini: 'lamborghini.com', lambo: 'lamborghini.com', porsche: 'porsche.com',
  bugatti: 'bugatti.com', benz: 'mercedes-benz.com', mercedes: 'mercedes-benz.com', bmw: 'bmw.com', tesla: 'tesla.com', maybach: 'mercedes-benz.com',
  bentley: 'bentleymotors.com', rolls: 'rolls-roycemotorcars.com', givenchy: 'givenchy.com', valentino: 'valentino.com', 'saint laurent': 'ysl.com',
  ysl: 'ysl.com', burberry: 'burberry.com', tiffany: 'tiffany.com',
  'coca-cola': 'coca-cola.com', coca: 'coca-cola.com', pepsi: 'pepsi.com', mcdonalds: 'mcdonalds.com', "mcdonald's": 'mcdonalds.com', starbucks: 'starbucks.com',
  'red bull': 'redbull.com', hennessy: 'hennessy.com', henny: 'hennessy.com', 'moët': 'moet.com', moet: 'moet.com', 'don julio': 'donjulio.com',
  patrón: 'patrontequila.com', patron: 'patrontequila.com', corona: 'corona.com', heineken: 'heineken.com', 'jack daniels': 'jackdaniels.com', bacardi: 'bacardi.com',
  instagram: 'instagram.com', insta: 'instagram.com', tiktok: 'tiktok.com', whatsapp: 'whatsapp.com', youtube: 'youtube.com', netflix: 'netflix.com',
  spotify: 'spotify.com', playstation: 'playstation.com', xbox: 'xbox.com', nintendo: 'nintendo.com', google: 'google.com', samsung: 'samsung.com',
  uber: 'uber.com', gatorade: 'gatorade.com', jeep: 'jeep.com', toyota: 'toyota.com', honda: 'honda.com', ford: 'ford.com', audi: 'audi.com',
};
const BRANDS2 = new RegExp('\\b(' + Object.keys(BRAND_SITE).sort((a, b) => b.length - a.length).map(k => k.replace(/[.*+?^${}()|[\]\\]/g, '\\$&').replace(/'/g, "['’]?")).join('|') + ')\\b', 'i');
{ const i = LEX.findIndex(l => l[0] === 'brand'); if (i >= 0) LEX[i][1] = BRANDS2; }
const _interpret3 = interpret;
interpret = function (text) {
  const found = _interpret3(text);
  const m = text.match(BRANDS2);
  if (m) { const k = m[1].toLowerCase().replace(/’/g, "'"); IN.brandSite = BRAND_SITE[k] || BRAND_SITE[k.replace(/'/g, '')]; IN.brand = m[1].toUpperCase(); }
  findEntities(text);
  return found;
};
MOTIF.brand = function (k, t, E) {
  const site = IN.brandSite, logo = site && img(via(`https://www.google.com/s2/favicons?domain=${site}&sz=256`));
  const s = S() * .15, cx = W * .8, cy = H * .3 + Math.sin(t * .8) * 6;
  x.save(); x.globalAlpha = k; x.translate(cx, cy); x.rotate(Math.sin(t * .5) * .03);
  x.shadowColor = 'rgba(0,0,0,.4)'; x.shadowBlur = 24; x.fillStyle = '#f6f4ef';
  x.beginPath(); x.roundRect(-s * .6, -s * .6, s * 1.2, s * 1.45, s * .12); x.fill(); x.shadowBlur = 0;
  if (logo) x.drawImage(logo, -s * .4, -s * .42, s * .8, s * .8);
  x.fillStyle = '#16161a'; x.font = `500 ${Math.max(10, s * .1)}px Inter`; x.textAlign = 'center';
  x.fillText((IN.brand || '').split('').join('\u2009'), 0, s * .68, s * 1.1);
  x.restore();
};

// ---------- lo que la letra nombra: foto real de Wikipedia ----------
const CARDS = [], ASKED = new Set();
const NOT_ENTITY = /^(i|oh|ay|yeah|baby|bebé|babe|mami|papi|dios|god|lord|señor|love|amor|hey|no|yo|tú|you|me|mi|my|la|el|lo|and|y|que|what|when|cause|'cause|okay|ok|uh|ah|eh|na|la la|mm|hmm|yeah yeah|let|come|go|tell|dime|dile|mira|look|nah|damn|shit|fuck|bitch|nigga|ni[gñ]a|girl|boy|man|mama|mamá|papa|papá|ma|pa|we|us|they|he|she|it|this|that|just|so|but|pero|si|sí|ya|now|ahora|all|todo|todos|every|everybody)$/i;
function findEntities(text) {
  if (!IN.synced) return;
  const words = text.split(/\s+/);
  const cand = [];
  for (let i = 1; i < words.length; i++) {                         // la primera palabra siempre va en mayúscula: no cuenta
    const w = words[i].replace(/^[^\p{L}]+|[^\p{L}.'’-]+$/gu, '');
    if (!/^\p{Lu}/u.test(w) || w.length < 3 || NOT_ENTITY.test(w)) continue;
    let name = w, j = i + 1;
    while (j < words.length && /^\p{Lu}/u.test(words[j]) && j - i < 3) { name += ' ' + words[j].replace(/[^\p{L}.'’-]+$/gu, ''); j++; }
    cand.push(name);
  }
  for (const [id] of LEX) {}                                       // (los conceptos ya se interpretan aparte)
  for (const q of cand.slice(0, 2)) askWiki(q);
}
async function askWiki(q) {
  const lang = IN.lang === 'es' ? 'es' : 'en', key = lang + ':' + q.toLowerCase();
  if (ASKED.has(key)) return; ASKED.add(key);
  try {
    let r = await fetch('/wiki?' + new URLSearchParams({ q, lang })).then(r => r.json());
    if (r.none && lang === 'es') r = await fetch('/wiki?' + new URLSearchParams({ q, lang: 'en' })).then(r => r.json());
    if (r.none || !r.img) return;
    img(r.img);
    CARDS.push({ title: r.title, desc: r.desc, url: r.img, at: 0, side: CARDS.length % 2 });
  } catch (e) {}
}
function drawCards(dt) {
  const c = CARDS[0]; if (!c) return;
  const im = img(c.url); if (!im) return;                          // espera a que cargue la foto
  if (!c.at) c.at = performance.now();
  const age = (performance.now() - c.at) / 1000, life = 6;
  if (age > life) { CARDS.shift(); return; }
  const a = clamp(age / .6) * clamp((life - age) / .8);
  const s = S() * .2, iw = im.naturalWidth, ih = im.naturalHeight, ph = s * Math.min(1.25, ih / iw);
  const cx = c.side ? W * .8 : W * .2, cy = H * .34 + (1 - a) * 20;
  x.save(); x.globalAlpha = a; x.translate(cx, cy); x.rotate((c.side ? 1 : -1) * .04);
  x.shadowColor = 'rgba(0,0,0,.45)'; x.shadowBlur = 22; x.fillStyle = '#f5f2ea';
  x.fillRect(-s / 2 - 8, -ph / 2 - 8, s + 16, ph + 46); x.shadowBlur = 0;
  x.drawImage(im, -s / 2, -ph / 2, s, ph);
  x.fillStyle = '#1b1b1f'; x.textAlign = 'center'; x.font = `italic 400 ${Math.max(12, s * .09)}px "Cormorant Garamond"`;
  x.fillText(c.title, 0, ph / 2 + 22, s);
  x.restore();
  if (CARDS.length > 3) CARDS.splice(1, CARDS.length - 3);        // nunca se acumulan
}
const _procFrame3 = procFrame;
procFrame = function (t, dt) {
  _procFrame3(t, dt);
  window.CAM ? CAM.layer(.9, () => drawCards(dt)) : drawCards(dt);
};
// al cambiar de canción, empezar limpio
const _loadSongMeta2 = loadSongMeta;
loadSongMeta = async function () { CARDS.length = 0; ASKED.clear(); IN.brandSite = ''; return _loadSongMeta2(); };
