// ============================================================
// director.js — el director de lumora, sin IA.
// Lee la canción entera en milisegundos y escribe el mismo guion que
// escribiría Claude (por estrofa y por verso), con reglas propias:
//   · estructura: los versos que se repiten son el coro; cada coro que
//     vuelve reusa sus imágenes. Intro, puente y final se reconocen solos.
//   · ánimo por estrofa: léxico de emociones en español e inglés, más
//     el tempo y el género como contexto.
//   · energía: la estructura manda (estrofa < coro), afinada por la
//     densidad de versos, el bpm y el ánimo.
//   · escenario: los lugares que la letra nombra; si no nombra ninguno,
//     los del artista o del género, y si no, los que pide el ánimo.
//   · objetos: el léxico de la app (LEX), el mismo que dibuja MOTIF.
//   · un color para toda la canción (su tonalidad) y una hora del día.
//   · "de qué trata": frases propias por tema, nunca la letra.
// Todo es determinista: la misma canción da siempre el mismo guion.
// ============================================================

const DIR = (() => {
  const norm = t => (t || '').toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '');
  const tokens = t => norm(t).match(/[a-zñ0-9']+/g) || [];
  const same = t => norm(t).replace(/[^a-zñ0-9 ]/g, ' ').replace(/\s+/g, ' ').trim();
  const hash = s => { let h = 2166136261; for (const c of s) h = Math.imul(h ^ c.charCodeAt(0), 16777619); return h >>> 0; };
  const pick = (arr, seed) => arr[seed % arr.length];
  const count = (re, text) => (text.match(new RegExp(re.source, 'g')) || []).length;

  const STOP = new Set(('the a an and or but of to in on at for with from by is are was were be been am i you he she it we they me my your his her our their this that these those ' +
    'so no not yes oh ooh yeah ya ey uh eh ah la na da just like what when where who how all can cant dont do did got get gonna wanna im youre its ive ill id ' +
    'el la los las un una unos unas y o pero de del al a en con por para que qué se su sus mi mis tu tus te me lo le les nos es son fue era ser estar esta este esto ' +
    'eso esa ese yo tu el ella nosotros ellos si ya muy mas más como cuando donde quien porque pa na ay oh uoh eh ah hey baby').split(' '));

  // ---------- emociones (sobre texto sin tildes) ----------
  const EMO = {
    euforico: /\b(party|fiesta|dance|dancin\w*|bail\w*|perre\w*|jump|salt\w*|wild|loc[oa]s?|locura|crazy|lit|turn up|celebr\w*|alive|viv[oa]s?|hands up|lets go|vamos|duro|hasta abajo)\b/,
    feliz: /\b(happy|feliz\w*|smil\w*|sonri\w*|sunshine|alegr\w*|laugh\w*|reir|fun|diversi\w*|beautiful|hermos\w*|bonit\w*|lucky|suerte|good vibes|good times?)\b/,
    romantico: /\b(love|lovin\w*|amor|amar|amo|te quiero|kiss\w*|bes\w*|carino|heart|corazon|hold me|abraz\w*|forever|para siempre|darling|honey|mi vida|mi reina|juntos|together|baby|bebe|your touch|tu piel)\b/,
    sereno: /\b(calm|calma|peace|paz|slow|despacio|breathe|respir\w*|quiet|silenc\w*|tranquil\w*|float\w*|flot\w*|breeze|brisa|gentle|suave)\b/,
    nostalgico: /\b(remember|recuerd\w*|memor\w*|used to|back then|ayer|yesterday|old days|childhood|ninez|photos?|fotos?|years ago|anos atras|te extrano|extran\w*|miss you|pasado|back in the day|aquellos tiempos)\b/,
    melancolico: /\b(alone|sol[oa]s?|lonely|soledad|empty|vaci[oa]\w*|cold|gray|gris|lost|perdid[oa]s?|far away|lejos|distance|distancia|without you|sin ti|nobody|nadie)\b/,
    triste: /\b(cry\w*|llor\w*|tears?|lagrima\w*|sad|trist\w*|pain|dolor|duele|hurt\w*|broken|rot[oa]s?|goodbye|adios|sorry|perdon|te fuiste|se fue|gone|heartbreak|herida\w*)\b/,
    oscuro: /\b(dark\w*|oscur\w*|devil|diablo|demon\w*|hell|infierno|death|muerte|dead|muert[oa]s?|blood|sangre|shadow\w*|sombra\w*|ghost\w*|fantasma\w*|nightmare\w*|pesadilla\w*|grave|tumba|poison|veneno|drugs?|drogas?|pills?|pastillas?)\b/,
    rabioso: /\b(hate|odi\w*|fight\w*|pelea\w*|war|guerra|kill\w*|matar|mato|rage|rabia|fuck\w*|mierda|shit|gun\w*|pistol\w*|bullets?|balas?|shoot\w*|dispar\w*|enem\w*|revenge|venganza|destroy\w*|destru\w*)\b/,
    desafiante: /\b(king|rey|queen|boss|jef[ea]s?|number one|numero uno|stand up|fearless|sin miedo|money|dinero|cash|rich|flex\w*|drip|chains?|cadenas?|winnin\w*|champion|campeon\w*|haters?|real ones?)\b/,
  };
  const MOODS = Object.keys(EMO);
  const GENRE_MOOD = { rap: { desafiante: .35, oscuro: .1 }, rnb: { romantico: .35, melancolico: .1 }, urbano: { euforico: .3, romantico: .2 }, pop: { feliz: .3, euforico: .15 } };
  const AROUSAL = { euforico: .9, feliz: .4, romantico: .1, sereno: -.5, nostalgico: -.3, melancolico: -.3, triste: -.4, oscuro: .2, rabioso: .9, desafiante: .7 };

  // ---------- temas: de qué trata ----------
  const THEMES = [
    ['desamor', /\b(goodbye|adios|te fuiste|se fue|left me|leave me|sin ti|without you|miss you|te extrano|olvid\w*|forget|broken heart|heartbreak|ya no (estas|me quieres)|someone (else|like you)|moved on|settled down|married|its over|se acabo|wish you (the best|well)|old friend|used to love|no vuelvas|otra persona)\b/],
    ['deseo', /\b(want you|body|cuerpo|touch\w*|toca\w*|bed|cama|skin|piel|lips|labios|desire|deseo|ganas|sexy|dirty)\b/],
    ['amor', /\b(love|amor|kiss\w*|bes\w*|heart|corazon|te quiero|forever|para siempre|mi vida|together|juntos)\b/],
    ['fiesta', /\b(party|fiesta|club|dance|bail\w*|perre\w*|drink\w*|tragos?|shots?|tonight|esta noche|dj|disco)\b/],
    ['exito', /\b(money|dinero|cash|rich|ric[oa]s?|chains?|flex\w*|drip|diamonds?|diamantes?|gold|oro|benz|lambo|rolex|millions?|millon\w*|boss|jef[ea])\b/],
    ['soledad', /\b(alone|sol[oa]|lonely|soledad|empty|vaci[oa]|nobody|nadie)\b/],
    ['recuerdo', /\b(remember|recuerd\w*|memor\w*|used to|ayer|yesterday|years ago|anos atras|back in the day|fotos?|photos?)\b/],
    ['libertad', /\b(free|libre|libertad|fly|volar|vuel\w*|run away|escap\w*|road|carretera|drive|manej\w*)\b/],
    ['lucha', /\b(fight\w*|pelea\w*|war|guerra|rise up|levant\w*|survive|sobreviv\w*|never give up|no me rindo|rendir\w*|enem\w*|opps?|beef|diss|rivals?|rival\w*)\b/],
    ['fe', /\b(heaven|pray\w*|rez\w*|angel\w*|faith|soul|alma|bless\w*|bendic\w*|church|iglesia|jesus|cristo|lord|senor)\b/, /\b(god|dios)\b/],   // "oh my god" no es fe: Dios solo suma si hay más
    ['mente', /\b(mind|mente|head|cabeza|thoughts?|pensa\w*|anxiety|ansiedad|demons?|demonios?|voices|voces|insomnia|insomnio)\b/],
    ['noche', /\b(night|noche|midnight|medianoche|3 ?am|madrugada|late)\b/],
  ];
  const SUM = {
    amor: ['alguien que se vuelve todo', 'el amor dicho sin rodeos', 'dos personas que se eligen', 'una promesa que se sostiene'],
    desamor: ['lo que queda cuando alguien se va', 'aprender a vivir con la ausencia', 'un adiós que todavía duele', 'hablarle a quien ya no está'],
    deseo: ['las ganas que no se esconden', 'la tensión entre dos cuerpos', 'acercarse hasta que no hay distancia'],
    fiesta: ['la noche que no quiere terminar', 'todo el mundo en la pista', 'soltarse y dejarse llevar', 'la fiesta en su punto más alto'],
    exito: ['presumir lo que costó ganar', 'de abajo hasta arriba', 'el éxito como respuesta', 'todo esto se ganó a pulso'],
    soledad: ['una habitación demasiado grande', 'rodeado de gente y sintiéndose solo', 'la soledad hablando en voz alta'],
    recuerdo: ['volver a un tiempo que no vuelve', 'los recuerdos pesan más de noche', 'lo que fuimos, visto desde lejos'],
    libertad: ['irse lejos sin mirar atrás', 'soltarlo todo y seguir', 'el camino como única casa'],
    lucha: ['levantarse cada vez que cae', 'nadie va a detener esto', 'pelear por lo que es suyo'],
    fe: ['buscar algo más grande arriba', 'una plegaria en medio del ruido', 'la fe como refugio'],
    mente: ['una cabeza que no se apaga', 'pelear contra los propios pensamientos', 'el ruido de adentro'],
    noche: ['la ciudad despierta mientras todos duermen', 'confesiones que solo salen de noche', 'la madrugada lo vuelve todo real'],
    _: ['la historia sigue su curso', 'la canción toma impulso', 'lo que se siente, sin decirlo del todo'],
  };
  const ROLE_SUM = {
    intro: ['todo empieza en silencio', 'la canción abre la puerta', 'el escenario se prepara'],
    outro: ['lo que queda cuando baja el telón', 'la historia se despide despacio', 'un último eco'],
    instrumental: ['la música habla sola', 'un respiro sin palabras', 'el ritmo toma el control'],
  };
  // pistas sin letra: lo que se dice es lo que hace la música, nunca una historia inventada
  const INST_SUM = {
    arranque: ['la pista empieza a moverse', 'todo arranca desde el pulso', 'el ritmo se asoma'],
    subida: ['el tema toma vuelo', 'la tensión se va acumulando', 'sube sin frenar', 'cada vuelta suma una capa'],
    cuerpo: ['el ritmo sostiene la pista', 'la base no suelta', 'todo gira sobre el mismo pulso'],
    climax: ['el punto más alto', 'todo suena a la vez', 'la pista revienta'],
    respiro: ['baja para tomar aire', 'un respiro antes de volver', 'se queda casi en silencio'],
    cierre: ['el tema se desarma despacio', 'lo último que queda sonando', 'se apaga con el pulso'],
  };
  const THEME_TXT = { amor: 'el amor', desamor: 'alguien que se fue', deseo: 'el deseo', fiesta: 'una noche de fiesta', exito: 'llegar arriba',
    soledad: 'la soledad', recuerdo: 'lo que ya pasó', libertad: 'irse y ser libre', lucha: 'no rendirse', fe: 'la fe', mente: 'una cabeza que no descansa',
    noche: 'la noche', _: 'lo que se siente' };

  // ---------- lugares que la letra nombra ----------
  const SCENE_WORDS = {
    calle: /\b(streets?|calles?|avenue|avenida|block|barrio|hood|corner|esquina|downtown|sidewalk|acera)\b/,
    playa: /\b(beach|playa|sand|arena|ocean|oceano|sea|mar|waves?|olas?|shore|orilla|island|isla|tropic\w*)\b/,
    club: /\b(club|discoteca|dance ?floor|pista|dj|bottles?|botellas?|vip)\b/,
    campo: /\b(fields?|campo|grass|pasto|hierba|farm|granja|countryside|valley|valle|river|rio|trees?|arbol\w*)\b/,
    cielo: /\b(sky|skies|clouds?|nubes?)\b/,
    habitacion: /\b(room|cuarto|habitacion|bed|cama|window|ventana|walls?|paredes?|sheets|sabanas|en casa)\b/,
    escenario: /\b(stage|escenario|crowd|publico|mic|microfono|spotlight|concert|concierto|show|tour|gira)\b/,
    azotea: /\b(rooftop|azotea|terraza|skyline|penthouse)\b/,
    estadio: /\b(stadium|estadio|touchdown|goal|gol|champions?|campeon\w*)\b/,
    sistema: /\b(computer|computadora|code|codigo|system|sistema|digital|screens?|pantallas?|internet|online|glitch|matrix)\b/,
    nebulosa: /\b(dreams?|dreamin\w*|suen\w*|sonar|mind|mente|galax\w*|cosmic|cosmos|universe|universo|high|volad[oa])\b/,
    deriva: /\b(fly|flyin\w*|volar|vuel\w*|stars?|estrellas?|float\w*|escape|escap\w*|away|lejos)\b/,
    orbitas: /\b(orbit\w*|planets?|planetas?|moon|luna|gravity|gravedad|around you|alrededor|circles?|circulos?|destiny|destino)\b/,
    aurora: /\b(rain\w*|lluvi\w*|cold|frio|ice|hielo|snow|nieve|tears|lagrimas?|water|agua)\b/,
    horizonte: /\b(horizon|horizonte|sunrise|amanecer|sunset|atardecer|sun|sol|hope|esperanza|light|luz|heaven|faith)\b/,
    tunel: /\b(tunnel|tunel|highway|autopista|road|carretera|drive|drivin\w*|manej\w*|speed|velocidad|fast|rapido|run|runnin\w*|corr\w*|clock|reloj)\b/,
    mandala: /\b(soul|alma|spirit\w*|trance|hypno\w*|sacred|sagrad\w*|meditat\w*|universe)\b/,
    oficina: /\b(office|oficina|desk|escritorio|monday|lunes|meeting|reunion|deadline|paycheck|nine to five|9 to 5|cubiculo|cubicle|commut\w*)\b/,
    cuarto: /\b(bedroom|midnight|medianoche|insomnia|insomnio|sleep\w*|dormir|duerm\w*|pillow|almohada|3 ?am|madrugada|lamp|lampara|alarm clock|despertador)\b/,
    ciudad: /\b(city|ciudad|skyline|buildings?|edificios?|traffic|trafico|subway|metro|train|tren|taxi|cab|downtown|rush hour)\b/,
    espacio: /\b(space|espacio|astronaut\w*|rocket|cohete|planets?|planetas?|saturn|saturno|mars|marte|satellite|satelite|cosmos|milky way|via lactea)\b/,
    bosque: /\b(forest|bosque|woods|pines?|pinos?|fox|zorro|leaves|hojas|mountains?|montanas?|fireflies|luciernagas|trail|sendero|camping)\b/,
    retrato: /\b(face|cara|rostro|eyes|ojos|headphones|audifonos|earphones|mirror|espejo|portrait|retrato|looking at me|me miras|mirada)\b/,
    museo: /\b(museum|museo|antique|antiguo|antigua|relic|reliquia|vintage|history|historia|ancient|old school|retired|retirad[oa]|archive|archivo)\b/,
    red: /\b(phone|telefono|celular|texts?|textin\w*|mensajes?|calls?|callin\w*|llam\w*|connect\w*|conect\w*|network|social|followers|seguidores)\b/,
    corriente: /\b(fire|fuego|burn\w*|quem\w*|flames?|llamas?|rage|rabia|storm|tormenta|chaos|caos|thunder|trueno|electric\w*|energy|energia|passion|pasion)\b/,
  };
  const MOOD_SCENES = { euforico: ['club', 'corriente', 'mandala'], feliz: ['playa', 'horizonte', 'campo'], romantico: ['mandala', 'azotea', 'habitacion'],
    sereno: ['aurora', 'cielo', 'campo'], nostalgico: ['horizonte', 'cielo', 'habitacion'], melancolico: ['aurora', 'calle', 'habitacion'],
    triste: ['aurora', 'habitacion', 'nebulosa'], oscuro: ['nebulosa', 'calle', 'corriente'], rabioso: ['corriente', 'tunel', 'calle'], desafiante: ['azotea', 'escenario', 'tunel'] };
  // las escenas ilustradas (riso.js) se suman a cada ánimo, un poco detrás de las de siempre
  const RISO_MOOD = { euforico: ['ciudad'], feliz: ['bosque'], romantico: ['cuarto'], sereno: ['bosque'], nostalgico: ['museo'], melancolico: ['cuarto'], triste: ['cuarto'], oscuro: ['retrato'], rabioso: ['ciudad'], desafiante: ['oficina'] };
  const RISO_MOOD2 = { euforico: ['retrato'], feliz: ['ciudad'], romantico: ['retrato'], sereno: ['espacio'], nostalgico: ['museo'], melancolico: ['retrato'], triste: ['museo'], oscuro: ['espacio'], rabioso: ['oficina'], desafiante: ['museo'] };
  for (const m in RISO_MOOD) { MOOD_SCENES[m].push(...RISO_MOOD[m]); }
  const LOUD = new Set(['club', 'escenario', 'estadio', 'corriente', 'tunel']), QUIET = new Set(['habitacion', 'aurora', 'cielo', 'campo', 'cuarto', 'bosque', 'museo']);
  const MOOD_SCENES2 = { euforico: ['orbitas', 'deriva', 'red', 'tunel'], feliz: ['cielo', 'mandala', 'orbitas', 'deriva'],
    romantico: ['aurora', 'cielo', 'orbitas', 'nebulosa'], sereno: ['horizonte', 'nebulosa', 'deriva', 'orbitas'],
    nostalgico: ['aurora', 'campo', 'nebulosa', 'cielo'], melancolico: ['nebulosa', 'cielo', 'deriva', 'red'],
    triste: ['cielo', 'horizonte', 'deriva', 'orbitas'], oscuro: ['tunel', 'red', 'deriva', 'orbitas'],
    rabioso: ['red', 'nebulosa', 'estadio', 'azotea'], desafiante: ['red', 'corriente', 'orbitas', 'calle'] };
  for (const m in RISO_MOOD2) MOOD_SCENES2[m].push(...RISO_MOOD2[m]);
  const MOOD_OBJS = { euforico: ['disco', 'sparkle', 'speakers', 'neonrings'], feliz: ['sun', 'sparkle', 'flowers'],
    romantico: ['love', 'candles', 'silk'], sereno: ['stars', 'moon', 'sea'], nostalgico: ['filmgrain', 'lightleak', 'polaroids'],
    melancolico: ['rain', 'blinds', 'smoke'], triste: ['rain', 'tears', 'candles'], oscuro: ['smoke', 'dark', 'flicker'],
    rabioso: ['fire', 'thunder', 'speakers'], desafiante: ['gold', 'city', 'speakers'] };
  const KEY_OF = { 'habitación': 'habitacion', 'órbitas': 'orbitas', 'túnel': 'tunel', 'ciudad héroe': 'ciudadHeroe' };
  const sceneKey = n => KEY_OF[n] || n;

  // ---------- hora y color ----------
  const TIME_WORDS = {
    madrugada: /\b(3 ?am|4 ?am|madrugada|late night|insomni\w*|cant sleep|no puedo dormir)\b/,
    noche: /\b(night|noche|tonight|esta noche|midnight|medianoche|moon|luna|stars?|estrellas?)\b/,
    amanecer: /\b(morning|manana|sunrise|amanecer|dawn|alba|wake up|despert\w*)\b/,
    atardecer: /\b(sunset|atardecer|evening|tarde|golden hour|dusk|ocaso)\b/,
    dia: /\b(sunshine|sunny|summer|verano|daylight|midday|mediodia|sol)\b/,
  };
  const MOOD_TIME = { euforico: 'noche', feliz: 'dia', romantico: 'atardecer', sereno: 'amanecer', nostalgico: 'atardecer', melancolico: 'noche',
    triste: 'madrugada', oscuro: 'noche', rabioso: 'noche', desafiante: 'noche' };
  const COLOR_WORDS = { rojo: /\b(red|rojo|roja|scarlet|crimson|carmesi)\b/, azul: /\b(blue|azul|navy)\b/, dorado: /\b(gold|golden|oro|dorad[oa])\b/,
    verde: /\b(green|verde)\b/, violeta: /\b(purple|violet|morad[oa]|violeta|lila)\b/, neon: /\b(neon)\b/, pastel: /\b(pink|rosa|rosad[oa]|pastel)\b/ };
  const MOOD_COLOR = { euforico: 'neon', feliz: 'calido', romantico: 'rojo', sereno: 'azul', nostalgico: 'dorado', melancolico: 'frio', triste: 'azul',
    oscuro: 'violeta', rabioso: 'rojo', desafiante: 'dorado' };

  const PERSON = { woman: /\b(she|her|ella|girl|chica|mami|shorty|lady|mujer|baby girl)\b/, man: /\b(he|him|boy|chico|papi|hombre)\b/,
    couple: /\b(we|us|nosotros|together|juntos|you and me|tu y yo)\b/ };
  const DREAMY = /\b(dream\w*|suen\w*|remember|recuerd\w*|memor\w*|float\w*|flot\w*|high)\b/, FAST = /\b(run\w*|corr\w*|fast|rapido|speed|velocidad|drive|manej\w*|escape|escap\w*|go go)\b/;

  // ---------- el guion ----------
  function plan() {
    const title = ext.st.name || proc.title || '', artist = ext.st.artist || '';
    const seed = hash(norm(title + '|' + artist));
    const cuts = IN.cuts, n = cuts.length, bpm = IN.bpm || 0, genre = IN.genre || '';
    const all = IN.lines.map((l, i) => ({ i, t: l.t, text: l.text || '' })).filter(l => l.text.trim());
    if (!all.length) return planInstrumental();                      // sin letra: el guion sale de la estructura
    if (n < 1) return { error: 'sin estructura' };
    const avail = id => typeof MOTIF === 'undefined' || !!MOTIF[id];

    // repeticiones: un verso que vuelve 2+ veces es parte de un coro
    const reps = {};
    for (const l of all) { const k = same(l.text); if (k.split(' ').length >= 2) reps[k] = (reps[k] || 0) + 1; }
    const B = [];
    for (let b = 0; b < n; b++) {
      const a = cuts[b], z = cuts[b + 1] ?? Infinity, lines = all.filter(l => l.t >= a && l.t < z);
      const raw = lines.map(l => l.text).join('\n'), txt = norm(raw);
      const repeated = lines.filter(l => (reps[same(l.text)] || 0) >= 2).length;
      B.push({ n: b, a, z: z === Infinity ? (proc.dur || a + 20) : z, lines, raw, txt, chorus: lines.length >= 2 && repeated / lines.length >= .5 });
    }
    const firstLyric = B.findIndex(b => b.lines.length), lastLyric = B.findLastIndex(b => b.lines.length);
    // coros que se parecen = el mismo coro: comparten escenario, objetos y resumen
    const sig = b => new Set(b.lines.map(l => same(l.text)));
    B.forEach(b => {
      if (!b.chorus) return;
      const s = sig(b);
      const twin = B.find(o => o.n < b.n && o.chorus && o.group === o.n && [...sig(o)].filter(x => s.has(x)).length / Math.max(1, Math.min(s.size, sig(o).size)) >= .4);
      b.group = twin ? twin.n : b.n;
    });
    const chorusSeen = B.filter(b => b.chorus).length;
    B.forEach(b => {
      b.role = !b.lines.length ? (b.n < firstLyric ? 'intro' : b.n > lastLyric ? 'outro' : 'instrumental')
        : b.chorus ? 'coro' : (chorusSeen >= 2 && b.n > B.find(x => x.chorus)?.n && b.n < B.findLast(x => x.chorus)?.n && !B.some(o => o !== b && !o.chorus && o.lines.length && [...sig(o)].some(x => sig(b).has(x))) ? 'puente' : 'estrofa');
    });

    // el ánimo de la canción entera: contexto para cada estrofa
    const song = norm(all.map(l => l.text).join('\n'));
    const prior = {};
    for (const m of MOODS) prior[m] = count(EMO[m], song) / Math.max(1, all.length) * 6;
    const beat = bpm > 150 ? bpm / 2 : bpm;                          // 170 bpm suele sentirse como 85 (doble tiempo)
    if (beat >= 118) { prior.euforico += .25; prior.desafiante += .12; }
    if (beat && beat < 88) { prior.sereno += .15; prior.romantico += .15; prior.melancolico += .12; }
    for (const [m, v] of Object.entries(GENRE_MOOD[genre] || {})) prior[m] += v;
    const hurtOf = sc => sc.triste + sc.melancolico + sc.nostalgico;
    const heartbreak = sc => sc.romantico > 0 && hurtOf(sc) >= sc.romantico * .6;          // amor + dolor = desamor, no romance
    const bestMood = sc => heartbreak(sc) ? ['nostalgico', 'melancolico', 'triste'].reduce((a, m) => sc[m] > sc[a] ? m : a, 'melancolico') : MOODS.reduce((a, m) => sc[m] > sc[a] ? m : a, 'feliz');
    const songMood = bestMood(prior);
    // el tema lo decide la letra, con el ánimo como desempate: una canción furiosa que nombra a Dios sigue siendo una pelea
    const THEME_MOOD = { rabioso: { lucha: 2 }, desafiante: { exito: 1.5, lucha: .5 }, euforico: { fiesta: 1 }, triste: { desamor: 1 }, melancolico: { soledad: 1, desamor: .5 },
      nostalgico: { recuerdo: 1 }, romantico: { amor: 1 }, feliz: { amor: .5, fiesta: .5 }, oscuro: { mente: 1 } };
    const themeOf = (t, m) => { let best = '_', score = 0; for (const [th, re, weak] of THEMES) { const c0 = count(re, t), c = c0 + (weak && c0 ? count(weak, t) * .5 : 0) + (c0 ? THEME_MOOD[m]?.[th] || 0 : 0); if (c > score) { score = c; best = th; } } return best; };
    const songTheme = heartbreak(prior) && themeOf(song, songMood) === 'amor' ? 'desamor' : themeOf(song, songMood);

    // hora y color de la canción: uno solo, salvo que la letra nombre otro
    const tv = {}; for (const [h, re] of Object.entries(TIME_WORDS)) tv[h] = count(re, song);
    const songTime = Object.entries(tv).sort((p, q) => q[1] - p[1])[0][1] > 1 ? Object.entries(tv).sort((p, q) => q[1] - p[1])[0][0] : MOOD_TIME[songMood];
    const cv = Object.entries(COLOR_WORDS).map(([c, re]) => [c, count(re, song)]).sort((p, q) => q[1] - p[1])[0];
    const songColor = cv[1] >= 2 ? cv[0] : MOOD_COLOR[songMood];

    const G = (typeof GENRE !== 'undefined' && GENRE[genre]?.scenes || []).map(sceneKey);
    const out = [], byGroup = {}, used = {}, said = {};
    const say = (list, key) => { const k = said[key] = (said[key] ?? seed % list.length) + 1; return list[k % list.length]; };
    let prevScene = '', prevEnergy = 3;
    for (const b of B) {
      // ánimo de la estrofa: sus palabras, con la canción de fondo
      const hits = {}, sc = {};
      for (const m of MOODS) { hits[m] = count(EMO[m], b.txt); sc[m] = hits[m] * 1.4 + prior[m] * .5; }
      let mood = b.lines.length ? bestMood(sc) : songMood;
      if (mood !== songMood && hits[mood] < 2 && !heartbreak(sc)) mood = songMood;                // una palabra suelta no cambia el ánimo
      // energía: la estructura manda
      const dens = b.lines.length / Math.max(4, b.z - b.a) * 10;
      let e = 4.2 + (bpm ? clamp((bpm - 95) / 30, -1.2, 1.8) : 0) + AROUSAL[mood] * 1.6 + clamp((dens - 2.2) * .6, -1, 1.4)
        + ({ coro: 2.4, intro: -2.2, outro: -1.8, instrumental: bpm >= 115 ? 1 : -1, puente: -1.4, estrofa: 0 })[b.role]
        + (/!/.test(b.raw) ? .4 : 0);
      if (b.n === lastLyric && b.chorus) e += .6;                                   // el último coro, un poco más arriba
      const energy = Math.round(clamp(e, 1, 10));
      const twin = b.chorus && b.group !== b.n ? byGroup[b.group] : null;

      // objetos: lo que la letra nombra, contado (LEX es el mismo que dibuja la app)
      const oc = {};
      for (const [id, re] of LEX) { if (!avail(id)) continue; let c = 0; for (const l of b.lines) if (re.test(l.text)) c++; if (c) oc[id] = c; }
      for (const [id, re] of Object.entries(PERSON)) if (avail(id) && count(re, b.txt) >= 2) oc[id] = (oc[id] || 0) + 1;
      let objects = twin ? twin.objects : Object.entries(oc).sort((p, q) => q[1] - p[1]).slice(0, 3).map(e => e[0]);

      // escenario: lugares nombrados > lo que sugieren sus objetos > artista/género > ánimo
      let scene = twin?.scene, scene2 = twin?.scene2 || 'ninguno';
      if (!scene) {
        const vote = {};
        for (const [s, re] of Object.entries(SCENE_WORDS)) { const c = count(re, b.txt); if (c) vote[s] = c * 2; }
        for (const id of objects) { const s = typeof SCENE_FOR !== 'undefined' && SCENE_FOR[id]; if (s) vote[sceneKey(s)] = (vote[sceneKey(s)] || 0) + oc[id]; }
        G.forEach((s, k) => { vote[s] = (vote[s] || 0) + .6 - k * .1; });
        MOOD_SCENES[mood].forEach((s, k) => { vote[s] = (vote[s] || 0) + .5 - k * .12; });
        const calm = ['triste', 'melancolico', 'nostalgico', 'sereno', 'romantico'].includes(mood);
        for (const s in vote) {
          if (s === prevScene) vote[s] -= 1.5;
          vote[s] -= (used[s] || 0) * .45;                                               // variedad con sentido
          if (LOUD.has(s) && (energy <= 4 || (calm && energy < 7))) vote[s] -= 1.6;
          if (QUIET.has(s) && energy >= 8 && !calm) vote[s] -= 1.2;
        }
        const ranked = Object.entries(vote).sort((p, q) => q[1] - p[1] || (hash(p[0] + seed) % 7) - (hash(q[0] + seed) % 7));
        scene = ranked[0]?.[0] || pick(MOOD_SCENES[mood], seed + b.n);
        scene2 = ranked[1] && ranked[1][1] >= 2 ? ranked[1][0] : 'ninguno';
      }
      used[scene] = (used[scene] || 0) + 1;

      // capa ambiental: el clima que la letra nombra, o el grano del recuerdo
      const atmos = twin ? twin.atmos : objects.find(o => ['rain', 'snow', 'smoke', 'leaves'].includes(o)) || (mood === 'nostalgico' && avail('filmgrain') ? 'filmgrain' : 'ninguno');
      objects = objects.filter(o => o !== atmos);

      // hora y color: los de la canción, salvo que esta estrofa nombre otros
      const th = Object.entries(TIME_WORDS).find(([, re]) => re.test(b.txt));
      const time = th ? th[0] : songTime;
      const ch = Object.entries(COLOR_WORDS).find(([, re]) => re.test(b.txt));
      const color = ch ? ch[0] : (mood !== songMood && ['triste', 'oscuro', 'rabioso', 'euforico'].includes(mood) ? MOOD_COLOR[mood] : songColor);

      // transición de entrada
      const transition = b.n === 0 ? 'suave' : b.chorus && energy - prevEnergy >= 2 ? 'impacto' : FAST.test(b.txt) && energy >= 6 ? 'velocidad'
        : DREAMY.test(b.txt) || b.role === 'puente' ? 'onirico' : prevEnergy - energy >= 2 ? 'suave' : scene !== prevScene ? 'corte' : 'suave';

      // de qué trata: frases propias por tema; cada coro repetido dice lo mismo
      const bt = b.lines.length ? themeOf(b.txt, mood) : '', theme = !b.lines.length ? '' : bt === '_' ? songTheme : bt;
      const summary = twin ? twin.summary : !b.lines.length ? say(ROLE_SUM[b.role] || ROLE_SUM.instrumental, b.role) : say(SUM[theme] || SUM._, theme);

      const p = { n: b.n, scene, scene2, objects, atmos, mood, energy, time, color, transition, summary };
      out.push(p); if (b.chorus && b.group === b.n) byGroup[b.n] = p;
      prevScene = scene; prevEnergy = energy;
    }

    // versos: la palabra que manda, lo que aparece y los ganchos en grande (máximo uno de cada cinco)
    const emoAll = new RegExp(MOODS.map(m => EMO[m].source).join('|'));
    const hook = Object.entries(reps).sort((p, q) => q[1] - p[1])[0]?.[0];
    const L = [];
    for (const l of all) {
      const ids = []; let word = '';
      for (const [id, re] of LEX) {
        if (!avail(id)) continue;
        const m = l.text.match(re); if (!m) continue;
        ids.push(id); if (!word) word = m[0].split(/\s+/)[0];
      }
      if (!word) { const m = norm(l.text).match(emoAll); if (m) word = (l.text.match(new RegExp('\\b' + m[0].split(' ')[0].replace(/[^a-z]/g, '.') + '\\w*', 'i')) || [''])[0]; }
      if (!word) word = (l.text.match(/[\p{L}']+/gu) || []).filter(w => w.length >= 4 && !w.includes("'") && !STOP.has(norm(w).replace(/'/g, ''))).sort((p, q) => q.length - p.length)[0] || '';
      const k = same(l.text), wc = k.split(' ').length;
      const score = (k === hook ? 3 : 0) + ((reps[k] || 0) >= 3 ? 1.5 : 0) + (wc <= 5 ? 1 : 0) + (/!/.test(l.text) ? .5 : 0) + (ids.length ? .5 : 0);
      L.push({ i: l.i, objects: ids.slice(0, 2), word, big: false, person: '', score });
    }
    const quota = Math.max(1, Math.floor(L.length / 5)), best = [...L].filter(x => x.score >= 2.5 && x.word).sort((p, q) => q.score - p.score);
    const bigSet = new Set();
    for (const x of best) { if (bigSet.size >= quota) break; if (bigSet.has(x.i - 1) || bigSet.has(x.i + 1)) continue; bigSet.add(x.i); x.big = true; }
    const lines = L.filter(x => x.objects.length || x.big || x.word).map(({ score, ...x }) => x);

    // la historia, en una frase: el tema y cómo cambia de principio a fin
    const lyr = out.filter((p, k) => B[k].lines.length), first = lyr[0], peak = lyr.reduce((a, p) => p.energy > a.energy ? p : a, lyr[0] || out[0]), last = lyr.at(-1);
    const ADJ = { euforico: 'eufórica', feliz: 'luminosa', romantico: 'romántica', sereno: 'serena', nostalgico: 'nostálgica', melancolico: 'melancólica',
      triste: 'triste', oscuro: 'oscura', rabioso: 'furiosa', desafiante: 'desafiante' };
    const arc = !first ? '' : peak.energy - first.energy >= 3 ? `Empieza ${ADJ[first.mood]} y ${peak.energy >= 8 ? 'explota' : 'crece'} en el coro.`
      : last && first.energy - last.energy >= 2 ? `Arranca con fuerza y ${['triste', 'melancolico', 'nostalgico', 'sereno', 'romantico'].includes(last.mood) ? 'se apaga ' + ADJ[last.mood] : 'cierra más suave'}.` : `Se mantiene ${ADJ[songMood]} de principio a fin.`;
    const story = `Una canción sobre ${THEME_TXT[songTheme]}. ${arc}`.trim();
    return { story, blocks: out, lines, via: 'local' };
  }
  // ---------- sin letra: la estructura la dan el tempo y las frases ----------
  function planInstrumental() {
    const title = ext.st.name || proc.title || '', album = ext.st.album || '', artist = ext.st.artist || '';
    const seed = hash(norm(title + '|' + artist));
    const n = IN.cuts.length, bpm = IN.bpm || 0, genre = IN.genre || '';
    if (n < 2) return { error: 'sin estructura' };
    const meta = norm(title + ' ' + album);
    const avail = id => typeof MOTIF === 'undefined' || !!MOTIF[id];

    // ánimo: lo poco que dice el título, y si no, el tempo y el género
    const sc = {};
    // sin letra, el género es la señal más fuerte que hay: pesa más que el tempo
    for (const m of MOODS) sc[m] = count(EMO[m], meta) * 2 + (GENRE_MOOD[genre]?.[m] || 0) * 2.2;
    const beat = bpm > 150 ? bpm / 2 : bpm;
    if (beat >= 122) { sc.euforico += .9; sc.desafiante += .4; }
    else if (beat >= 100) { sc.desafiante += .5; sc.euforico += .3; }
    else if (beat) { sc.sereno += .5; sc.melancolico += .35; sc.nostalgico += .25; }
    const mood = MOODS.reduce((a, m) => sc[m] > sc[a] ? m : a, 'sereno');

    // el arco: entra baja, crece hasta cerca del 60 %, respira y cierra
    const bd = n >= 7 ? Math.round(n * .58) : -1;                      // el respiro de la segunda mitad
    const E = [];
    for (let i = 0; i < n; i++) {
      const x = n > 1 ? i / (n - 1) : 0;
      let e = 3 + 5.8 * Math.sin(Math.PI * Math.pow(x, 1.35));
      if (i % 4 === 3) e += 1.2;                                       // cada cuatro frases, un escalón: así entran los drops
      if (i === bd) e -= 3.4; else if (i === bd + 1) e -= 1.4;
      if (i === 0) e -= 2; if (i === n - 1) e -= 2.2;
      if (beat >= 122) e += .6; else if (beat && beat < 92) e -= .7;
      E.push(Math.round(clamp(e, 1, 10)));
    }
    const peak = E.indexOf(Math.max(...E));
    const roleOf = i => i === 0 ? 'arranque' : i === n - 1 ? 'cierre'
      : i === bd || (E[i] <= 3 && E[i] < E[i - 1] - 1) ? 'respiro'
      : E[i] >= 8 ? 'climax' : E[i] > E[i - 1] ? 'subida' : 'cuerpo';

    // color y hora: del título si dice algo, si no del ánimo
    const th = Object.entries(TIME_WORDS).find(([, re]) => re.test(meta));
    const time = th ? th[0] : MOOD_TIME[mood];
    const ch = Object.entries(COLOR_WORDS).find(([, re]) => re.test(meta));
    const color = ch ? ch[0] : MOOD_COLOR[mood];

    // lo que se dibuja: lo que nombra el título, y las capas del artista o del género
    const titleObjs = [];
    for (const [id, re] of LEX) if (avail(id) && re.test(title)) titleObjs.push(id);
    const amb = ((typeof GENRE !== 'undefined' && GENRE[genre]?.ambient) || []).filter(avail);
    const pool = [...new Set([...titleObjs, ...amb, ...MOOD_OBJS[mood].filter(avail)])];
    const scenes = [...new Set([...((typeof GENRE !== 'undefined' && GENRE[genre]?.scenes) || []).map(sceneKey), ...MOOD_SCENES[mood], ...MOOD_SCENES2[mood]])];

    const out = [], used = {}, said = {};
    const say = (list, k) => { const c = said[k] = (said[k] ?? seed % list.length) + 1; return list[c % list.length]; };
    let prevScene = '';
    for (let i = 0; i < n; i++) {
      const energy = E[i], role = roleOf(i), calm = energy <= 4;
      const vote = {};
      scenes.forEach((s, k) => { vote[s] = 1 - k * .1; });
      for (const s in vote) {
        if (s === prevScene) vote[s] -= 1.5;
        vote[s] -= (used[s] || 0) * .5;
        if (LOUD.has(s) && calm) vote[s] -= 1.6;                        // una pista tranquila no va al club
        if (QUIET.has(s) && energy >= 8) vote[s] -= 1.2;
        vote[s] += (hash(s + seed + i) % 100) / 400;                    // desempate estable
      }
      const scene = Object.entries(vote).sort((p, q) => q[1] - p[1])[0]?.[0] || pick(MOOD_SCENES[mood], seed + i);
      used[scene] = (used[scene] || 0) + 1;
      const objects = pool.length ? [pool[i % pool.length], ...(energy >= 7 && pool.length > 1 ? [pool[(i + 1) % pool.length]] : [])] : [];
      const transition = i === 0 ? 'suave' : energy - E[i - 1] >= 2 ? 'impacto' : E[i - 1] - energy >= 3 ? 'onirico'
        : energy >= 8 && beat >= 122 ? 'velocidad' : scene !== prevScene ? 'corte' : 'suave';
      out.push({ n: i, scene, scene2: 'ninguno', objects: objects.slice(0, 2), atmos: 'ninguno', mood, energy, time, color, transition, summary: say(INST_SUM[role], role) });
      prevScene = scene;
    }
    const tempo = bpm ? ` a ${Math.round(bpm)} bpm` : '';
    const story = `Un instrumental${tempo}: ${bd > 0 ? 'crece, respira a la mitad y vuelve a subir' : 'crece hasta el clímax'}, y cierra bajando.`;
    return { story, blocks: out, lines: [], via: 'local', instrumental: true, peak };
  }

  return { plan, planInstrumental };
})();
