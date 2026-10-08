// retratos vectoriales por rasgos: el perfil fija la identidad; la canción anima la figura.
(() => {
  const R = window.RISO; if (!R) return;
  const profiles = {}, paths = new Map();
  function add(id, names, look) { profiles[id] = { id, names: names.split('|'), skin: .12, hair: 'short', hairInk: 1, outfit: 'jacket', clothes: 1, ...look }; }
  add('michael_jackson', 'michael jackson|mj', { hair: 'curls', hat: 'fedora', outfit: 'military', clothes: 2, glove: true });
  add('elvis', 'elvis|elvis presley', { hair: 'quiff', sideburns: true, outfit: 'jumpsuit', clothes: -1, glasses: true });
  add('bob_marley', 'bob marley|marley', { skin: .55, hair: 'dreads', beard: true, outfit: 'shirt', clothes: 3 });
  add('beatles', 'the beatles|beatles', { hair: 'mop', outfit: 'suit', clothes: 1, tie: true });
  add('freddie_mercury', 'queen|freddie mercury', { hair: 'short', moustache: true, outfit: 'military', clothes: 2 });
  add('david_bowie', 'david bowie|bowie', { hair: 'quiff', hairInk: 2, bolt: true, outfit: 'suit', clothes: 3 });
  add('kurt_cobain', 'nirvana|kurt cobain', { hair: 'long', hairInk: 3, beard: true, outfit: 'cardigan', clothes: 3 });
  add('jimi_hendrix', 'jimi hendrix|hendrix', { skin: .5, hair: 'afro', headband: true, outfit: 'military', clothes: 3 });
  add('bad_bunny', 'bad bunny|benito antonio martinez ocasio', { skin: .28, hair: 'curls', beard: true, glasses: true, earrings: true, outfit: 'shirt', clothes: 2 });
  add('the_weeknd', 'the weeknd|weeknd|abel tesfaye', { custom: true });
  add('shakira', 'shakira', { hair: 'waves', hairInk: 3, outfit: 'crop', clothes: 2 });
  add('selena', 'selena|selena quintanilla|selena y los dinos', { hair: 'long', fringe: true, outfit: 'jumpsuit', clothes: 3, earrings: true });
  add('celia_cruz', 'celia cruz', { skin: .5, hair: 'afro', hairInk: 2, outfit: 'dress', clothes: 3, earrings: true });
  add('luis_miguel', 'luis miguel|luismi', { hair: 'slick', outfit: 'suit', clothes: 1, tie: true });
  add('beyonce', 'beyonce|beyoncé', { skin: .3, hair: 'waves', hairInk: 3, outfit: 'dress', clothes: 2 });
  add('rihanna', 'rihanna', { skin: .4, hair: 'bob', outfit: 'coat', clothes: 2, earrings: true });
  add('taylor_swift', 'taylor swift', { hair: 'long', hairInk: 3, fringe: true, outfit: 'dress', clothes: 2, lipstick: true });
  add('eminem', 'eminem|slim shady|marshall mathers', { hair: 'buzz', hairInk: 3, outfit: 'hoodie', clothes: 1 });
  add('tupac', 'tupac|2pac|tupac shakur', { skin: .5, hair: 'bald', headband: true, moustache: true, outfit: 'shirt', clothes: -1, chain: true });
  add('daddy_yankee', 'daddy yankee', { skin: .25, hair: 'buzz', hat: 'cap', glasses: true, outfit: 'jacket', clothes: 3, chain: true });
  add('adele', 'adele', { hair: 'bun', hairInk: 3, outfit: 'dress', clothes: 1, eyeliner: true });
  add('amy_winehouse', 'amy winehouse', { hair: 'beehive', outfit: 'dress', clothes: 1, eyeliner: true, earrings: true });
  add('madonna', 'madonna', { hair: 'waves', hairInk: 3, outfit: 'jacket', clothes: 1, lipstick: true, chain: true });
  add('juanes', 'juanes', { hair: 'long', beard: true, outfit: 'shirt', clothes: 1 });
  add('lana_del_rey', 'lana del rey', { hair: 'waves', outfit: 'dress', clothes: -1, flower: true, eyeliner: true });
  add('zayn', 'zayn|zayn malik', { skin: .24, hair: 'quiff', beard: true, outfit: 'jacket', clothes: 1 });
  add('xxxtentacion', 'xxxtentacion', { skin: .5, hair: 'dreads', splitHair: true, outfit: 'hoodie', clothes: 1 });
  add('travis_scott', 'travis scott', { skin: .55, hair: 'braids', outfit: 'jacket', clothes: 3, chain: true });
  add('drake', 'drake', { skin: .32, hair: 'buzz', beard: true, outfit: 'hoodie', clothes: 1 });
  add('tyler_joseph', 'twenty one pilots|twenty øne piløts|twentyonepilots|tyler joseph', { hair: 'short', hat: 'beanie', outfit: 'jacket', clothes: 1, tape: true });
  add('billie_eilish', 'billie eilish', { hair: 'long', splitHair: true, outfit: 'hoodie', clothes: 3 });
  add('ariana_grande', 'ariana grande', { skin: .2, hair: 'ponytail', outfit: 'dress', clothes: 3, eyeliner: true });
  add('dua_lipa', 'dua lipa', { hair: 'long', outfit: 'crop', clothes: 2, earrings: true });
  add('olivia_rodrigo', 'olivia rodrigo', { skin: .2, hair: 'long', outfit: 'dress', clothes: 3 });
  add('sabrina_carpenter', 'sabrina carpenter', { hair: 'waves', hairInk: 3, fringe: true, outfit: 'dress', clothes: 3, lipstick: true });
  add('selena_gomez', 'selena gomez', { skin: .2, hair: 'bob', outfit: 'dress', clothes: 2 });
  add('sza', 'sza', { skin: .55, hair: 'waves', outfit: 'crop', clothes: 3 });
  add('doja_cat', 'doja cat', { skin: .35, hair: 'buzz', outfit: 'jumpsuit', clothes: 2, earrings: true });
  add('karol_g', 'karol g', { skin: .25, hair: 'waves', hairInk: 3, outfit: 'crop', clothes: 2 });
  add('rosalia', 'rosalia|rosalía', { hair: 'ponytail', outfit: 'jacket', clothes: 2, earrings: true });
  add('rauw_alejandro', 'rauw alejandro', { skin: .3, hair: 'braids', beard: true, outfit: 'jacket', clothes: 3, glasses: true });
  add('j_balvin', 'j balvin|j. balvin', { skin: .24, hair: 'buzz', hairInk: 2, beard: true, outfit: 'jacket', clothes: 3 });
  add('feid', 'feid|ferxxo', { skin: .22, hair: 'short', hat: 'cap', glasses: true, outfit: 'shirt', clothes: 3 });
  add('peso_pluma', 'peso pluma', { skin: .2, hair: 'mullet', outfit: 'jacket', clothes: 1, chain: true });
  add('bruno_mars', 'bruno mars', { skin: .3, hair: 'curls', hat: 'fedora', outfit: 'suit', clothes: 2, glasses: true });
  add('ed_sheeran', 'ed sheeran', { hair: 'messy', hairInk: 2, beard: true, outfit: 'shirt', clothes: 3 });
  add('harry_styles', 'harry styles', { hair: 'wavesShort', outfit: 'suit', clothes: 3, necklace: true });
  add('post_malone', 'post malone', { hair: 'short', beard: true, tattoos: true, outfit: 'shirt', clothes: 3 });
  add('snoop_dogg', 'snoop dogg|snoop doggy dogg', { skin: .55, hair: 'braids', moustache: true, glasses: true, outfit: 'shirt', clothes: 3, chain: true });
  add('kendrick_lamar', 'kendrick lamar', { skin: .55, hair: 'braids', beard: true, outfit: 'hoodie', clothes: 1 });
  add('kanye_west', 'kanye west|ye', { skin: .55, hair: 'buzz', beard: true, outfit: 'hoodie', clothes: 1 });
  add('chris_martin', 'coldplay|chris martin', { hair: 'messy', outfit: 'shirt', clothes: 1, tape: true });
  add('chester_bennington', 'linkin park|chester bennington', { hair: 'buzz', glasses: true, outfit: 'shirt', clothes: 1, tattoos: true });
  add('gerard_way', 'my chemical romance|gerard way', { hair: 'long', outfit: 'military', clothes: 1, eyeliner: true });
  add('hayley_williams', 'paramore|hayley williams', { hair: 'long', hairInk: 2, fringe: true, outfit: 'shirt', clothes: -1 });
  add('daft_punk', 'daft punk', { helmet: true, outfit: 'suit', clothes: 1 });
  add('josh_dun', 'josh dun', { hair: 'messy', hairInk: 2, outfit: 'shirt', clothes: 1, tattoos: true });
  add('sia', 'sia', { hair: 'bob', fringe: true, splitHair: true, outfit: 'dress', clothes: 1 });
  add('aurora', 'aurora|aurora aksnes', { hair: 'bob', fringe: true, hairInk: 3, outfit: 'dress', clothes: -1 });
  add('hozier', 'hozier|andrew hozier byrne', { hair: 'waves', beard: true, outfit: 'coat', clothes: 1 });
  add('florence_welch', 'florence + the machine|florence and the machine|florence welch', { hair: 'waves', hairInk: 2, outfit: 'dress', clothes: 3 });
  add('alex_turner', 'arctic monkeys|alex turner', { hair: 'slick', outfit: 'suit', clothes: 1 });
  add('thom_yorke', 'radiohead|thom yorke', { hair: 'messy', beard: true, outfit: 'shirt', clothes: 1 });
  add('robert_smith', 'the cure|robert smith', { hair: 'messy', outfit: 'coat', clothes: 1, eyeliner: true, lipstick: true });
  add('gustavo_cerati', 'soda stereo|gustavo cerati|cerati', { hair: 'curls', outfit: 'jacket', clothes: 1 });
  add('fito_paez', 'fito paez|fito páez', { hair: 'curls', glasses: true, outfit: 'jacket', clothes: 3 });
  add('mon_laferte', 'mon laferte', { hair: 'waves', fringe: true, flower: true, eyeliner: true, outfit: 'dress', clothes: 2 });
  add('natalia_lafourcade', 'natalia lafourcade', { hair: 'bob', fringe: true, outfit: 'dress', clothes: 3 });
  add('residente', 'residente|rene perez|rené pérez', { skin: .25, hair: 'buzz', beard: true, tattoos: true, outfit: 'shirt', clothes: 1 });
  add('mora', 'mora', { skin: .25, hair: 'short', glasses: true, beard: true, outfit: 'jacket', clothes: 3 });
  add('tame_impala', 'tame impala|kevin parker', { hair: 'long', beard: true, outfit: 'shirt', clothes: 3 });
  add('john_lennon', 'john lennon', { hair: 'long', glasses: true, beard: true, outfit: 'suit', clothes: -1, instrument: 'guitar' });
  add('paul_mccartney', 'paul mccartney', { hair: 'mop', outfit: 'suit', clothes: 1, instrument: 'bass' });
  add('george_harrison', 'george harrison', { hair: 'long', beard: true, outfit: 'suit', clothes: 3, instrument: 'guitar' });
  add('ringo_starr', 'ringo starr', { hair: 'mop', moustache: true, outfit: 'suit', clothes: 2, instrument: 'drums' });
  add('brian_may', 'brian may', { hair: 'waves', outfit: 'shirt', clothes: -1, instrument: 'guitar' });
  add('roger_taylor', 'roger taylor', { hair: 'long', hairInk: 3, outfit: 'shirt', clothes: 1, instrument: 'drums' });
  add('john_deacon', 'john deacon', { hair: 'wavesShort', outfit: 'shirt', clothes: 3, instrument: 'bass' });
  add('dave_grohl', 'dave grohl', { hair: 'long', beard: true, outfit: 'shirt', clothes: 1, instrument: 'drums' });
  add('krist_novoselic', 'krist novoselic', { hair: 'long', outfit: 'shirt', clothes: 3, instrument: 'bass', build: .9 });
  for (const id of ['kurt_cobain', 'jimi_hendrix', 'ed_sheeran', 'hozier', 'gustavo_cerati', 'juanes', 'alex_turner']) profiles[id].instrument = 'guitar';
  profiles.josh_dun.instrument = 'drums'; profiles.tyler_joseph.instrument = 'ukulele';
  profiles.fito_paez.instrument = 'keys'; profiles.chris_martin.instrument = 'keys';
  // proporciones de ilustración, no medidas biométricas. cada perfil comparte todos sus aliases.
  const faces = {
    john_lennon: [1.02, 1.06, .92, 1, 1.04, .85], paul_mccartney: [.95, 1.04, .81, 1.08, .95, 1.06],
    george_harrison: [.85, 1.16, .82, 1, 1.15, .82], ringo_starr: [.94, 1.08, .94, .95, 1.35, .84],
    brian_may: [.86, 1.14, .84, 1.04, 1.13, .90], roger_taylor: [1.03, .98, 1.03, 1.04, .97, 1.05],
    john_deacon: [.90, 1.07, .90, .97, 1.03, .85], dave_grohl: [1.02, 1.08, 1.12, .95, 1.02, 1.08],
    krist_novoselic: [.87, 1.18, .96, 1, 1.18, .92],
    tyler_joseph: [ .88, 1.10, .82, .88, 1.16, .84 ], josh_dun: [1.06, .94, 1.10, 1.02, .88, 1.08],
    taylor_swift: [.86, 1.10, .75, 1.06, .88, 1.15], billie_eilish: [1.10, .98, .90, 1.12, .80, 1.15],
    ariana_grande: [.82, .97, .72, 1.08, .78, 1.12], lana_del_rey: [1.02, 1.08, .90, 1.03, .98, 1.28],
    shakira: [.97, .95, .83, 1.12, .87, 1.15], michael_jackson: [.88, 1.08, .76, .95, .78, .92],
    freddie_mercury: [.98, 1.08, 1.10, .86, 1.12, 1.04], david_bowie: [.82, 1.13, .76, 1.07, 1.10, .85],
    bad_bunny: [1.08, .98, 1.12, .92, .98, 1.05], drake: [1.08, 1.08, 1.16, .93, 1.04, 1.04],
    ed_sheeran: [1.12, .94, 1.04, .94, .92, .90], snoop_dogg: [.83, 1.19, .78, .94, 1.13, .95],
    adele: [1.14, .98, 1.04, 1.08, .92, 1.15], hozier: [.90, 1.18, .96, .95, 1.16, .92],
    olivia_rodrigo: [.87, 1.04, .80, 1.10, .86, 1.08], dua_lipa: [.92, 1.10, 1.04, 1.12, .99, 1.18],
    bruno_mars: [1.02, .93, 1.00, .96, .89, 1.07], eminem: [.95, 1.06, 1.07, .90, 1.03, .85],
    kurt_cobain: [.93, 1.08, .91, 1.02, 1.04, .91], aurora: [.85, 1.02, .78, 1.16, .82, .87],
    thom_yorke: [.90, 1.10, .82, .94, 1.12, .84], gustavo_cerati: [.96, 1.13, .93, 1.04, 1.15, .98],
  };
  for (const p of Object.values(profiles)) {
    const [width, height, jaw, eyes, nose, lips] = faces[p.id] || [1, 1, 1, 1, 1, 1];
    p.face = { width, height, jaw, eyes, nose, lips };
    p.build = p.build || (['snoop_dogg', 'hozier', 'taylor_swift'].includes(p.id) ? .90 : ['adele', 'drake'].includes(p.id) ? 1.10 : 1);
  }
  const norm = s => String(s || '').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/ø/g, 'o').replace(/\s+/g, ' ').trim();
  const aliases = new Map(Object.values(profiles).flatMap(p => p.names.map(n => [norm(n), p.id])));
  const hash = s => { let h = 2166136261; for (const c of norm(s)) h = Math.imul(h ^ c.charCodeAt(0), 16777619); return h >>> 0; };
  const api = R.artistFigures = { profiles, idOf: name => aliases.get(norm(name)) || null,
    profile(name, id, album = '') { const known = profiles[id || this.idOf(name)]; if (known) {
      // el vestuario sigue eras explícitas del álbum, sin contaminar el perfil base.
      if (known.id === 'tyler_joseph') {
        if (/clancy|blurryface/i.test(album)) return { ...known, hat: null, hair: 'short', clothes: 1, tape: true };
        if (/trench/i.test(album)) return { ...known, hat: null, outfit: 'coat', clothes: 3, tape: true };
        if (/scaled and icy/i.test(album)) return { ...known, hat: null, hair: 'messy', hairInk: 3, clothes: 2, tape: false };
      }
      if (['john_lennon', 'paul_mccartney', 'george_harrison', 'ringo_starr'].includes(known.id) && /please please me|with the beatles|hard day|help!|rubber soul/i.test(album)) return { ...known, hair: 'mop', beard: false, moustache: false, glasses: false, clothes: 1, tie: true };
      if (known.id === 'freddie_mercury' && /queen ii|sheer heart attack|night at the opera|day at the races/i.test(album)) return { ...known, hair: 'long', moustache: false, outfit: 'shirt', clothes: -1 };
      if (known.id === 'josh_dun' && /trench/i.test(album)) return { ...known, hairInk: 3, tape: true, clothes: 3 };
      if (known.id === 'billie_eilish' && /hit me hard and soft|happier than ever/i.test(album)) return { ...known, splitHair: false };
      return known;
    }
      // un nombre desconocido no aporta información sobre su aspecto real.
      const h = hash(name); return { id: null, skin: .15, hair: ['short', 'mop', 'messy'][h % 3], hairInk: 1, outfit: ['jacket', 'shirt', 'hoodie'][h % 3], clothes: 2 + h % 2 }; },
    draw(K, name, id, x, ground, scale, motion = {}) {
      const p = this.profile(name, id, motion.album), c = K.c, t = window.CFG?.reduceMotion ? 0 : motion.time || 0, active = !!motion.active;
      const instrument = motion.instrument || p.instrument;
      const bob = Math.sin(t * 2.2) * (active ? 3 : 1), open = motion.open || 0;
      c.save(); c.translate(x, ground); c.scale(scale * (p.build || 1), scale); c.rotate(Math.sin(t * 1.6) * (active ? .018 : .007));
      const path = (d, f, tone = 1, lw = 4, ink = 1) => { let q = paths.get(d); if (!q) { q = new Path2D(d); if (paths.size < 2048) paths.set(d, q); } if (f !== undefined) { c.fillStyle = f === -1 ? K.PAPER : K.ink(f, tone); c.fill(q); } c.strokeStyle = K.ink(ink); c.lineWidth = lw; c.lineJoin = 'round'; c.lineCap = 'round'; c.stroke(q); };
      const circle = (x, y, r, f, ft = 1) => K.circ(x, y, r, { f, ft, s: 1, lw: 4 });
      const skin = d => { path(d, -1); if (p.skin) path(d, 3, p.skin); };
      K.ell(0, 5, 83, 12, 0, { f: 1, ft: .25 });
      path('M-36 -185 L-33 -16 H-6 L0 -176 L10 -16 H36 L38 -185 Z', 1, .85, 6);
      path('M-35 -22 H-5 L-1 0 H-52 L-49 -10 Z M10 -22 H36 L53 -6 V0 H9 Z', 1);
      c.translate(0, bob);
      if (['long', 'waves', 'ponytail', 'braids', 'dreads', 'mullet', 'bob'].includes(p.hair)) {
        if (p.hair === 'bob') path('M-43 -423 Q-70 -410 -60 -335 L-25 -335 L-25 -413 Z M25 -413 L25 -335 H60 Q70 -410 43 -423 Z', p.hairInk);
        else path('M-41 -421 Q-79 -402 -62 -299 L-70 -252 L-29 -267 L-22 -410 Z M25 -413 Q76 -412 63 -320 L73 -265 L27 -270 Z', p.hairInk, .95);
        if (p.hair === 'waves') for (const side of [-1, 1]) for (let i = 0; i < 5; i++) circle(side * (53 + Math.sin(i * 2) * 8), -390 + i * 25, 17, p.hairInk);
        if (p.hair === 'ponytail') path('M39 -424 Q99 -432 90 -346 L64 -288 L60 -368 Z', p.hairInk);
        if (p.hair === 'braids' || p.hair === 'dreads') for (let i = 0; i < 8; i++) path(`M${-58 + i * 16} -407 Q${-74 + i * 20} -338 ${-64 + i * 18} -276`, undefined, 1, p.hair === 'dreads' ? 9 : 5);
      }
      if (p.outfit === 'hoodie') path('M-53 -334 Q-75 -379 -43 -424 Q0 -454 43 -424 Q72 -378 52 -334 Z', p.clothes, .9, 6);
      const dress = p.outfit === 'dress', coat = p.outfit === 'coat';
      path(dress ? 'M-50 -340 L-38 -269 L-86 -82 Q0 -52 86 -82 L38 -269 L50 -340 Z' : coat ? 'M-58 -340 L-79 -73 L-17 -61 L0 -210 L18 -61 L80 -73 L58 -340 Z' : 'M-53 -340 L-65 -298 L-40 -184 Q0 -174 40 -184 L65 -298 L53 -340 Z', p.clothes, .9, 6);
      if (p.outfit === 'crop') { skin('M-36 -229 L-32 -185 H33 L37 -229 Z'); path('M-48 -337 L-42 -237 H42 L49 -337 Z', p.clothes); }
      skin('M-14 -366 V-332 Q0 -317 14 -332 V-366 Z');
      if (['suit', 'jacket', 'military', 'cardigan', 'jumpsuit', 'coat'].includes(p.outfit)) {
        path('M-46 -335 L-11 -302 L-29 -275 L0 -245 L30 -275 L11 -302 L46 -335 M0 -301 V-187', undefined, 1, 4, p.clothes === 1 ? 3 : 1);
        if (p.outfit === 'suit') { path('M-17 -332 L0 -303 L17 -332', -1); if (p.tie) path('M0 -315 L-6 -304 L0 -267 L6 -304 Z', 2); }
        if (p.outfit === 'military') for (let y = -295; y < -210; y += 22) { K.line(-32, y, 32, y, 3, 5); circle(-25, y, 3, 2); circle(25, y, 3, 2); }
        if (p.outfit === 'jumpsuit') for (let i = -2; i <= 2; i++) circle(i * 15, -230, 3, 3);
      }
      if (p.outfit === 'hoodie') { path('M-27 -328 Q0 -290 27 -328 M-14 -310 V-274 M14 -310 V-274 M-24 -223 Q0 -237 24 -223', undefined, 1, 4, 3); }
      if (p.tape) { K.rect(31, -315, 17, 61, { f: 2 }); K.rect(-42, -201, 24, 11, { f: 2 }); }
      if (p.chain || p.necklace) path('M-25 -329 Q0 -263 25 -329', undefined, 1, p.chain ? 7 : 3, 3);
      if (p.chain) path('M0 -282 L-7 -271 L0 -261 L7 -271 Z', 3);
      // manos y brazos: el micrófono sube durante el verso de esta voz.
      const handY = active ? -323 : -236;
      if (!instrument) {
      path('M-51 -326 Q-77 -297 -75 -249 L-61 -209', undefined, 1, 22, p.clothes === -1 ? 3 : p.clothes);
      skin('M-70 -220 Q-84 -208 -72 -194 Q-56 -186 -53 -205 L-56 -218 Z');
      path(`M51 -326 Q83 -273 67 -252 L25 ${handY + 12}`, undefined, 1, 23, p.clothes === -1 ? 3 : p.clothes);
      skin(`M18 ${handY - 8} Q3 ${handY - 2} 15 ${handY + 15} Q34 ${handY + 24} 37 ${handY + 5} L31 ${handY - 8} Z`);
      if (p.glove) path(`M18 ${handY - 8} Q3 ${handY - 2} 15 ${handY + 15} Q34 ${handY + 24} 37 ${handY + 5} L31 ${handY - 8} Z`, -1);
      } else {
        const ly = instrument === 'keys' ? -184 : instrument === 'drums' ? -220 : -235;
        const ry = instrument === 'keys' ? -184 : instrument === 'drums' ? -220 : -306;
        path(`M-51 -326 Q-78 -270 -28 ${ly} M51 -326 Q76 -270 30 ${ry}`, undefined, 1, 21, p.clothes === -1 ? 3 : p.clothes);
        circle(-28, ly, 11, -1); circle(30, ry, 11, -1);
      }
      if (p.tattoos) { path('M-73 -260 L-60 -251 L-73 -239 M61 -284 L73 -277 L65 -263', undefined, 1, 3); }
      const face = p.face || { width: 1, height: 1, jaw: 1, eyes: 1, nose: 1, lips: 1 };
      c.save(); c.translate(0, -390); c.scale(face.width, face.height); c.translate(0, 390);
      skin(`M-43 -405 Q-47 -356 ${-22 * face.jaw} -344 Q0 ${-344 + 12 * face.jaw} ${22 * face.jaw} -344 Q47 -356 43 -405 Q32 -440 0 -438 Q-32 -440 -43 -405 Z`);
      // nariz, ojos, labios y detalles que distinguen cada silueta.
      path(`M2 -391 L${-4 * face.nose} ${-391 + 21 * face.nose} L5 ${-390 + 21 * face.nose}`, undefined, 1, 3);
      c.save(); c.scale(face.eyes, 1);
      path('M-28 -390 Q-18 -396 -10 -390 M11 -390 Q21 -396 30 -390', undefined, 1, p.eyeliner ? 5 : 3);
      c.restore();
      K.ell(0, -353, 10 * face.lips + open * 4, 2 + open * 8, 0, { f: p.lipstick ? 2 : 1, s: 1, lw: 2 });
      if (p.eyeliner) path('M-30 -390 L-38 -396 M30 -390 L38 -396', undefined, 1, 3);
      if (p.beard) path('M-39 -371 L-29 -345 Q0 -321 29 -345 L39 -371 L21 -359 L10 -365 H-10 L-21 -359 Z', 1, .85, 3);
      if (p.moustache || p.beard) path('M-16 -361 Q-7 -370 0 -364 Q8 -370 16 -361', undefined, 1, 6);
      if (p.sideburns) { path('M-43 -399 L-32 -366 L-42 -370 Z M43 -399 L32 -366 L42 -370 Z', 1); }
      const hair = p.hair, hi = p.hairInk;
      if (hair === 'afro' || hair === 'curls') {
        const n = hair === 'afro' ? 12 : 9, r = hair === 'afro' ? 19 : 12;
        for (let i = 0; i < n; i++) { const a = Math.PI + i / (n - 1) * Math.PI; circle(Math.cos(a) * 44, -401 + Math.sin(a) * 35, r, hi); }
      } else if (hair === 'bun' || hair === 'beehive') { K.ell(0, hair === 'beehive' ? -465 : -451, hair === 'beehive' ? 43 : 27, hair === 'beehive' ? 63 : 25, 0, { f: hi, s: 1, lw: 4 }); path('M-43 -392 Q-56 -449 0 -444 Q53 -446 44 -391 L23 -418 L-14 -423 Z', hi); }
      else if (hair === 'quiff' || hair === 'slick') path('M-44 -396 Q-62 -447 -13 -453 Q20 -474 48 -436 L39 -402 L18 -428 Q-15 -413 -44 -396 Z', hi);
      else if (hair === 'messy' || hair === 'wavesShort') path('M-44 -395 L-55 -418 L-40 -418 L-47 -437 L-25 -432 L-15 -452 L4 -439 L20 -448 L30 -430 L47 -431 L43 -396 L19 -415 L0 -410 L-20 -417 Z', hi);
      else if (hair !== 'bald') path(hair === 'buzz' ? 'M-43 -407 Q0 -456 43 -407 L39 -399 Q0 -427 -39 -399 Z' : 'M-43 -388 Q-58 -435 -24 -441 Q29 -460 44 -418 L43 -386 L25 -412 L10 -401 L-6 -415 L-29 -401 Z', hi);
      if (p.fringe) path('M-40 -419 Q0 -440 40 -419 L33 -392 L18 -400 L0 -392 L-17 -401 L-35 -393 Z', hi);
      if (p.splitHair) path('M0 -440 Q35 -445 44 -410 L38 -394 L17 -413 L0 -407 Z', 3, .95);
      if (p.headband) { path('M-46 -415 Q0 -428 46 -415 L45 -403 Q0 -414 -45 -403 Z', 2); path('M41 -413 L74 -436 L64 -412 L78 -397 L42 -403 Z', 2); }
      if (p.glasses) { path('M-38 -396 H-7 V-382 Q-25 -368 -36 -384 Z M7 -396 H38 L36 -384 Q25 -368 7 -382 Z', 1); K.line(-7, -392, 7, -392, 1, 4); }
      if (p.bolt) path('M8 -424 L-13 -390 L1 -391 L-11 -367 L22 -399 L8 -399 L24 -424 Z', 2, .9, 2);
      if (p.earrings) { circle(-44, -366, 8, 3); circle(44, -366, 8, 3); }
      if (p.flower) for (let i = 0; i < 5; i++) circle(43 + Math.cos(i * 1.26) * 9, -419 + Math.sin(i * 1.26) * 9, 7, -1);
      if (p.hat === 'fedora') { path('M-37 -440 L-27 -479 H24 L39 -440 Z', 1); K.ell(0, -438, 65, 12, -.06, { f: 1, s: 1, lw: 4 }); K.line(-34, -450, 35, -450, 2, 8); }
      if (p.hat === 'cap') { path('M-45 -413 Q-48 -464 0 -465 Q49 -461 46 -413 Z', p.clothes); path('M-46 -419 H43 L78 -406 H-46 Z', p.clothes); }
      if (p.hat === 'beanie') { path('M-45 -415 Q-48 -465 0 -468 Q49 -465 45 -415 Z', 2); K.rect(-46, -425, 92, 18, { f: 2, s: 1, lw: 3 }); }
      if (p.helmet) { path('M-45 -402 Q-46 -452 0 -454 Q47 -450 45 -401 L35 -348 H-35 Z', 3, .8, 5); path('M-37 -407 H37 L31 -376 H-31 Z', 1); K.line(-24, -397, 25, -397, -1, 4); }
      c.restore();
      if (instrument === 'guitar' || instrument === 'bass' || instrument === 'ukulele') {
        const k = instrument === 'ukulele' ? .66 : 1;
        c.save(); c.translate(-10, -244); c.scale(k, k); c.rotate(-.3);
        path('M-8 -20 C-24 -55 -65 -47 -52 -12 C-89 15 -62 63 -27 44 C7 69 35 37 15 12 C37 -18 15 -42 -8 -20 Z', instrument === 'bass' ? 1 : 3, .85, 5);
        path('M-8 -15 L57 -112 L69 -104 L5 -7 Z', 2, .8, 4); circle(-13, 9, 12, 1);
        path('M-18 31 L61 -109 M-13 33 L65 -107', undefined, 1, 1.5, 1);
        path(`M35 -35 L${-5 + Math.sin(t * 12) * (active ? 8 : 0)} 15`, undefined, 1, 10, p.clothes);
        c.restore();
      } else if (instrument === 'drums') {
        for (const sd of [-1, 1]) { path(`M${sd * 70} -168 L${sd * 90} -24 M${sd * 90 - 20} -24 H${sd * 90 + 20}`, undefined, 1, 4); K.ell(sd * 77, -170, 48, 9, sd * .1, { f: 3, s: 1, lw: 3 }); }
        circle(0, -80, 57, 2); circle(0, -80, 43, -1);
        K.ell(-45, -150, 35, 21, -.1, { f: 3, s: 1, lw: 4 }); K.ell(40, -150, 35, 21, .1, { f: 3, s: 1, lw: 4 });
        const hit = Math.sin(t * 12) * (active ? 18 : 0);
        path(`M-55 -230 L-23 ${-176 + hit} M52 -230 L25 ${-176 - hit}`, undefined, 1, 9, p.clothes);
        path(`M-23 ${-176 + hit} L-2 ${-147 + hit} M25 ${-176 - hit} L6 ${-147 - hit}`, undefined, 1, 4, 3);
      } else if (instrument === 'keys') {
        path('M-100 -195 H100 V-158 H-100 Z', -1, 1, 5);
        for (let i = -4; i <= 4; i++) K.line(i * 20, -195, i * 20, -158, 1, 2);
        path('M-80 -158 L70 -16 M80 -158 L-70 -16', undefined, 1, 6);
      } else { K.line(25, handY + 7, 35, handY - 23, 1, 9); circle(36, handY - 28, 11, 2); }
      c.restore();
    }
  };
})();
