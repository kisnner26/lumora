// ============================================================
// more.js — más marcas, famosos y perfiles de artistas.
// Marcas: ícono oficial de su sitio. Famosos: foto real de Wikipedia
// (personas reales; nunca personajes de ficción). Artistas: solo
// estética (paleta, escenarios, capas, tipografía).
// ============================================================

// ---------- marcas (se omiten las que también son palabras comunes) ----------
Object.assign(BRAND_SITE, {
  lexus: 'lexus.com', jaguar: 'jaguar.com', maserati: 'maserati.com', mclaren: 'mclaren.com', 'aston martin': 'astonmartin.com', koenigsegg: 'koenigsegg.com',
  pagani: 'pagani.com', cadillac: 'cadillac.com', chevrolet: 'chevrolet.com', chevy: 'chevrolet.com', dodge: 'dodge.com', 'range rover': 'rangerover.com',
  'g-wagon': 'mercedes-benz.com', 'rolls-royce': 'rolls-roycemotorcars.com', bentayga: 'bentleymotors.com', 'cullinan': 'rolls-roycemotorcars.com',
  balmain: 'balmain.com', celine: 'celine.com', loewe: 'loewe.com', 'bottega': 'bottegaveneta.com', 'miu miu': 'miumiu.com', 'alexander mcqueen': 'alexandermcqueen.com',
  vetements: 'vetementswebsite.com', 'rick owens': 'rickowens.eu', 'chrome hearts': 'chromehearts.com', 'stone island': 'stoneisland.com', 'palm angels': 'palmangels.com',
  amiri: 'amiri.com', 'gallery dept': 'gallerydept.com', 'fear of god': 'fearofgod.com', trapstar: 'trapstarlondon.com', 'stüssy': 'stussy.com', stussy: 'stussy.com',
  carhartt: 'carhartt.com', 'north face': 'thenorthface.com', 'canada goose': 'canadagoose.com', timberland: 'timberland.com', 'new balance': 'newbalance.com',
  reebok: 'reebok.com', 'ralph lauren': 'ralphlauren.com', lacoste: 'lacoste.com', 'calvin klein': 'calvinklein.com', 'tommy hilfiger': 'tommy.com', zara: 'zara.com',
  'fashion nova': 'fashionnova.com', fenty: 'fentybeauty.com', 'victoria\'s secret': 'victoriassecret.com', sephora: 'sephora.com',
  'richard mille': 'richardmille.com', hublot: 'hublot.com', omega: 'omegawatches.com', breitling: 'breitling.com', 'tag heuer': 'tagheuer.com',
  'van cleef': 'vancleefarpels.com', bvlgari: 'bulgari.com', bulgari: 'bulgari.com',
  'clase azul': 'claseazul.com', 'ace of spades': 'armanddebrignac.com', casamigos: 'casamigos.com', 'grey goose': 'greygoose.com', belvedere: 'belvederevodka.com',
  ciroc: 'ciroc.com', 'cîroc': 'ciroc.com', jameson: 'jamesonwhiskey.com', 'johnnie walker': 'johnniewalker.com', buchanan: 'buchanans.com', "buchanan's": 'buchanans.com',
  smirnoff: 'smirnoff.com', modelo: 'modeloUSA.com', budweiser: 'budweiser.com', 'dom pérignon': 'domperignon.com', 'dom perignon': 'domperignon.com', cristal: 'louis-roederer.com',
  kfc: 'kfc.com', 'burger king': 'bk.com', 'taco bell': 'tacobell.com', chipotle: 'chipotle.com', popeyes: 'popeyes.com', "wendy's": 'wendys.com', "domino's": 'dominos.com',
  'pizza hut': 'pizzahut.com', dunkin: 'dunkindonuts.com', oreo: 'oreo.com',
  sony: 'sony.com', snapchat: 'snapchat.com', facebook: 'facebook.com', discord: 'discord.com', twitch: 'twitch.tv', lyft: 'lyft.com', paypal: 'paypal.com',
  'cash app': 'cash.app', venmo: 'venmo.com', bitcoin: 'bitcoin.org', ethereum: 'ethereum.org', 'lamborghini urus': 'lamborghini.com',
});
{ const re = new RegExp('\\b(' + Object.keys(BRAND_SITE).sort((a, b) => b.length - a.length).map(k => k.replace(/[.*+?^${}()|[\]\\]/g, '\\$&').replace(/'/g, "['’]?")).join('|') + ')\\b', 'i');
  const i = LEX.findIndex(l => l[0] === 'brand'); if (i >= 0) LEX[i][1] = re;
  // reality.js busca con BRANDS2: se reemplaza por la lista ampliada
  const _interp = interpret;
  interpret = function (text) { const f = _interp(text); const m = text.match(re); if (m) { const k = m[1].toLowerCase().replace(/’/g, "'"); IN.brandSite = BRAND_SITE[k] || BRAND_SITE[k.replace(/'/g, '')]; IN.brand = m[1].toUpperCase(); } return f; };
}

// ---------- famosos: foto real cuando la letra los nombra (aunque vaya en minúsculas) ----------
const FAMOUS = [
  'michael jordan', 'kobe bryant', 'lebron james', 'stephen curry', 'shaquille', 'lionel messi', 'cristiano ronaldo', 'neymar', 'mbappé', 'maradona', 'pelé',
  'mike tyson', 'muhammad ali', 'floyd mayweather', 'canelo', 'usain bolt', 'serena williams', 'tiger woods', 'tom brady', 'ohtani',
  'michael jackson', 'tupac', '2pac', 'biggie', 'notorious b.i.g.', 'jay-z', 'kanye', 'beyoncé', 'beyonce', 'rihanna', 'nicki minaj', 'cardi b', 'eminem',
  'madonna', 'prince', 'elvis', 'freddie mercury', 'kurt cobain', 'bob marley', 'frank sinatra', 'whitney houston', 'amy winehouse', 'selena quintanilla',
  'celia cruz', 'héctor lavoe', 'hector lavoe', 'vicente fernández', 'juan gabriel', 'shakira', 'jennifer lopez', 'j.lo', 'daddy yankee', 'don omar',
  'marilyn monroe', 'audrey hepburn', 'james dean', 'bruce lee', 'al pacino', 'leonardo dicaprio', 'brad pitt', 'angelina jolie', 'scarlett johansson',
  'zendaya', 'kim kardashian', 'kylie jenner', 'paris hilton', 'elon musk', 'steve jobs', 'bill gates', 'mark zuckerberg', 'jeff bezos',
  'albert einstein', 'einstein', 'picasso', 'frida kahlo', 'van gogh', 'da vinci', 'basquiat', 'andy warhol', 'salvador dalí', 'dalí', 'napoleón', 'napoleon',
  'cleopatra', 'martin luther king', 'gandhi', 'nelson mandela', 'che guevara', 'princess diana', 'princesa diana', 'marie curie', 'stephen hawking',
];
const FAMOUS_RE = new RegExp('\\b(' + FAMOUS.map(n => n.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')).join('|') + ')\\b', 'i');
const _interpretF = interpret;
interpret = function (text) {
  const f = _interpretF(text);
  const m = text.match(FAMOUS_RE);
  if (m && typeof askWiki === 'function') askWiki(m[1].replace(/\b\w/g, c => c.toUpperCase()));
  return f;
};

// ---------- más perfiles de artistas (solo estética) ----------
const A = (id, re, label, font, scenes, ambient, eras) => ({ id, re, label, font, scenes, ambient, eras });
ARTISTS.push(
  A('top', /twenty one pilots/i, 'twenty one pilots', 'heavy', ['campo', 'túnel', 'calle', 'nebulosa'], ['filmgrain', 'rain', 'neonrings'], [
    [/trench/i, [52, 70, 0], ['campo', 'horizonte']], [/blurryface/i, [0, 0, 210], ['calle', 'túnel']], [/scaled and icy/i, [190, 330, 50], ['escenario', 'cielo']],
    [/clancy/i, [0, 45, 220], ['campo', 'túnel']], [/vessel/i, [215, 200, 0], ['nebulosa', 'horizonte']], [/regional at best|twenty one pilots/i, [200, 30, 120], ['campo', 'cielo']], [/.*/, [52, 0, 210]]]),
  A('neighbourhood', /the neighbourhood/i, 'the neighbourhood', 'mono', ['calle', 'playa', 'habitación'], ['filmgrain', 'lightleak', 'rain'], [[/.*/, [0, 0, 210]]]),
  A('sza', /\bsza\b/i, 'sza', 'serif', ['playa', 'cielo', 'habitación'], ['butterflies', 'lightleak', 'silk'], [[/sos/i, [200, 190, 30]], [/ctrl/i, [100, 40, 20]], [/.*/, [200, 30, 330]]]),
  A('frank', /frank ocean/i, 'frank ocean', 'thin', ['playa', 'cielo', 'calle'], ['filmgrain', 'lightleak', 'stars'], [[/blonde/i, [50, 120, 200]], [/channel orange/i, [25, 35, 200]], [/.*/, [40, 200, 330]]]),
  A('kendrick', /kendrick lamar/i, 'kendrick lamar', 'clean', ['calle', 'azotea', 'red'], ['speakers', 'filmgrain', 'vhs'], [[/damn/i, [0, 0, 210]], [/butterfly/i, [40, 30, 0]], [/gnx/i, [0, 30, 210]], [/.*/, [30, 0, 210]]]),
  A('ye', /kanye west|\bye\b/i, 'ye', 'heavy', ['túnel', 'horizonte', 'nebulosa'], ['psyche', 'filmgrain', 'neonrings'], [[/yeezus/i, [0, 0, 0]], [/graduation/i, [300, 200, 30]], [/.*/, [30, 0, 210]]]),
  A('rihanna', /rihanna/i, 'rihanna', 'bold', ['club', 'playa', 'escenario'], ['neonpalms', 'disco', 'sparkle'], [[/anti/i, [0, 350, 30]], [/.*/, [340, 45, 190]]]),
  A('beyonce', /beyonc[eé]/i, 'beyoncé', 'serif', ['escenario', 'horizonte', 'club'], ['disco', 'sparkle', 'silk'], [[/renaissance/i, [210, 0, 200]], [/cowboy carter/i, [25, 0, 210]], [/lemonade/i, [52, 40, 30]], [/.*/, [45, 30, 330]]]),
  A('billie', /billie eilish/i, 'billie eilish', 'thin', ['nebulosa', 'habitación', 'aurora'], ['filmgrain', 'rain', 'flicker'], [[/hit me hard/i, [220, 200, 0]], [/happier than ever/i, [40, 30, 0]], [/.*/, [100, 0, 220]]]),
  A('olivia', /olivia rodrigo/i, 'olivia rodrigo', 'hand', ['habitación', 'escenario', 'calle'], ['polaroids', 'sparkle', 'butterflies'], [[/guts/i, [270, 330, 0]], [/sour/i, [280, 320, 60]], [/.*/, [275, 330, 50]]]),
  A('dua', /dua lipa/i, 'dua lipa', 'bold', ['club', 'escenario', 'cielo'], ['disco', 'neonrings', 'sparkle'], [[/future nostalgia/i, [320, 190, 50]], [/radical optimism/i, [200, 190, 40]], [/.*/, [320, 190, 60]]]),
  A('ariana', /ariana grande/i, 'ariana grande', 'serif', ['cielo', 'escenario', 'mandala'], ['sparkle', 'butterflies', 'silk'], [[/eternal sunshine/i, [210, 200, 30]], [/.*/, [330, 280, 45]]]),
  A('harry', /harry styles/i, 'harry styles', 'serif', ['playa', 'cielo', 'escenario'], ['butterflies', 'sparkle', 'lightleak'], [[/.*/, [200, 330, 45]]]),
  A('post', /post malone/i, 'post malone', 'clean', ['calle', 'horizonte', 'club'], ['filmgrain', 'neonrings', 'rain'], [[/.*/, [210, 30, 0]]]),
  A('juice', /juice wrld/i, 'juice wrld', 'heavy', ['nebulosa', 'túnel', 'aurora'], ['psyche', 'rain', 'neonrings'], [[/.*/, [150, 280, 190]]]),
  A('peep', /lil peep/i, 'lil peep', 'hand', ['habitación', 'nebulosa', 'calle'], ['filmgrain', 'rain', 'flicker'], [[/.*/, [320, 280, 0]]]),
  A('carti', /playboi carti/i, 'playboi carti', 'heavy', ['túnel', 'red', 'club'], ['vhs', 'flicker', 'speakers'], [[/whole lotta red/i, [0, 0, 0]], [/.*/, [0, 280, 0]]]),
  A('tyler', /tyler, the creator|tyler the creator/i, 'tyler, the creator', 'wide', ['campo', 'cielo', 'escenario'], ['butterflies', 'flowers', 'sparkle'], [[/igor/i, [330, 50, 200]], [/flower boy/i, [45, 110, 200]], [/chromakopia/i, [120, 45, 0]], [/.*/, [45, 330, 120]]]),
  A('cole', /j\. ?cole/i, 'j. cole', 'serif', ['campo', 'calle', 'horizonte'], ['filmgrain', 'lightleak', 'rain'], [[/.*/, [35, 20, 200]]]),
  A('future', /\bfuture\b/i, 'future', 'heavy', ['calle', 'túnel', 'club'], ['taillights', 'speakers', 'rain'], [[/.*/, [270, 0, 190]]]),
  A('savage', /21 savage/i, '21 savage', 'mono', ['calle', 'azotea', 'sistema'], ['speakers', 'rain', 'vhs'], [[/.*/, [0, 210, 0]]]),
  A('metro', /metro boomin/i, 'metro boomin', 'heavy', ['túnel', 'sistema', 'calle'], ['neonrings', 'speakers', 'vhs'], [[/spider-verse/i, [0, 280, 190]], [/heroes & villains/i, [0, 220, 0]], [/.*/, [0, 280, 0]]]),
  A('rauw', /rauw alejandro/i, 'rauw alejandro', 'wide', ['club', 'deriva', 'playa'], ['neonrings', 'disco', 'neonpalms'], [[/saturno/i, [260, 200, 300]], [/cosa nuestra/i, [0, 40, 0]], [/.*/, [260, 190, 320]]]),
  A('feid', /\bfeid\b/i, 'feid', 'bold', ['club', 'calle', 'playa'], ['neonpalms', 'speakers', 'sparkle'], [[/.*/, [110, 90, 150]]]),
  A('karol', /karol g/i, 'karol g', 'bold', ['playa', 'club', 'escenario'], ['neonpalms', 'sparkle', 'butterflies'], [[/mañana será bonito/i, [190, 330, 50]], [/tropicoqueta/i, [330, 25, 150]], [/.*/, [330, 190, 50]]]),
  A('balvin', /j balvin/i, 'j balvin', 'wide', ['club', 'mandala', 'escenario'], ['disco', 'psyche', 'sparkle'], [[/colores/i, [0, 120, 240]], [/.*/, [50, 300, 180]]]),
  A('ozuna', /\bozuna\b/i, 'ozuna', 'bold', ['club', 'playa', 'cielo'], ['neonpalms', 'sparkle', 'stars'], [[/.*/, [190, 45, 330]]]),
  A('anuel', /anuel/i, 'anuel aa', 'heavy', ['calle', 'azotea', 'club'], ['speakers', 'rain', 'taillights'], [[/.*/, [0, 210, 45]]]),
  A('peso', /peso pluma/i, 'peso pluma', 'heavy', ['campo', 'calle', 'horizonte'], ['filmgrain', 'speakers', 'lightleak'], [[/.*/, [35, 0, 120]]]),
  A('daddy', /daddy yankee/i, 'daddy yankee', 'bold', ['club', 'playa', 'calle'], ['speakers', 'neonpalms', 'disco'], [[/.*/, [45, 0, 200]]]),
  A('rosalia', /rosal[ií]a/i, 'rosalía', 'serif', ['escenario', 'mandala', 'calle'], ['silk', 'flowers', 'sparkle'], [[/motomami/i, [0, 350, 45]], [/el mal querer/i, [0, 30, 45]], [/.*/, [350, 30, 200]]]),
  A('shakira', /shakira/i, 'shakira', 'bold', ['playa', 'escenario', 'club'], ['sparkle', 'neonpalms', 'butterflies'], [[/.*/, [45, 190, 330]]]),
  A('arctic', /arctic monkeys/i, 'arctic monkeys', 'vintage', ['calle', 'habitación', 'horizonte'], ['filmgrain', 'lightleak', 'rain'], [[/\bam\b/i, [0, 0, 220]], [/tranquility base/i, [30, 200, 0]], [/.*/, [30, 0, 220]]]),
  A('coldplay', /coldplay/i, 'coldplay', 'wide', ['cielo', 'mandala', 'escenario'], ['butterflies', 'fireworks', 'rainbow'], [[/.*/, [200, 300, 45]]]),
  A('imagine', /imagine dragons/i, 'imagine dragons', 'heavy', ['horizonte', 'estadio', 'túnel'], ['fireworks', 'neonrings', 'speakers'], [[/.*/, [200, 25, 0]]]),
  A('calvin', /calvin harris/i, 'calvin harris', 'wide', ['playa', 'club', 'cielo'], ['neonpalms', 'disco', 'lanterns'], [[/.*/, [190, 45, 330]]]),
  A('avicii', /avicii/i, 'avicii', 'thin', ['campo', 'cielo', 'horizonte'], ['lanterns', 'butterflies', 'lightleak'], [[/.*/, [45, 190, 120]]]),
  A('garrix', /martin garrix/i, 'martin garrix', 'wide', ['estadio', 'túnel', 'deriva'], ['fireworks', 'neonrings', 'speakers'], [[/.*/, [190, 280, 0]]]),
  A('skrillex', /skrillex/i, 'skrillex', 'heavy', ['túnel', 'sistema', 'red'], ['vhs', 'binary', 'psyche'], [[/.*/, [300, 150, 0]]]),
  A('fredagain', /fred again/i, 'fred again..', 'mono', ['calle', 'cielo', 'habitación'], ['filmgrain', 'lightleak', 'lanterns'], [[/.*/, [30, 200, 0]]]),
);

// tipografías de los perfiles nuevos
{ const st = document.createElement('style');
  st.textContent = `
    #lyr[data-font="hand"] .line { font-family:'Permanent Marker', cursive; letter-spacing:.01em; }
    #lyr[data-font="wide"] .line { font:800 clamp(22px,3.6vw,48px)/1.2 'Unbounded', sans-serif; letter-spacing:-.01em; }`;
  document.head.appendChild(st); }
