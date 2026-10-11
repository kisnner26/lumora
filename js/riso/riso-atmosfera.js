// atmósfera: lo que la letra dice del lugar, el clima, la hora y lo que hace quien canta, con persistencia entre versos.
// se compila de la letra completa (buscar hacia atrás no cambia nada) y se dibuja a pantalla completa, con el reloj de la canción.
(() => {
  const R = window.RISO; if (!R) return;
  const norm = s => String(s || '').toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/[’]/g, "'").replace(/[^a-z0-9' ]/g, ' ').replace(/\s+/g, ' ').trim();
  const word = list => new RegExp('\\b(?:' + list + ')\\b');
  const PLACES = [['costa', word('sea|ocean|beach|waves?|shore|sand castle|mar|playa|olas?|orilla|oceano|marea|barco|boat|island|isla')],
    ['ciudad', word('city|streets?|neon|club|lights?|skyline|downtown|highway|taxi|train|subway|ciudad|calles?|luces|neon|discoteca|autopista|metro|tren|concreto|rooftop|azotea')],
    ['bosque', word('forest|trees?|woods|garden|river|meadow|field|flowers?|rose|bosque|arbol(?:es)?|jardin|rio|campo|flor(?:es)?|montana|mountains?|selva|hojas|leaves')],
    ['desierto', word('desert|dust|canyon|desierto|polvo|arena|volcan(?:es)?|volcano|cactus|caliente|burning sun|sol ardiente')],
    ['espacio', word('stars?|moon|galaxy|universe|planet|orbit|space|cosmos|estrellas?|luna|galaxia|universo|planeta|cielo|sky|heaven|cielos')],
    ['cuarto', word('room|bedroom|bed|house|home|window|mirror|kitchen|couch|casa|cuarto|habitacion|cama|ventana|espejo|cocina|sala|silencio|empty house')]];
  const WEATHER = [['tormenta', word('storm|thunder|lightning|tormenta|trueno|rayo|relampago|huracan|hurricane')],
    ['lluvia', word('rain(?:ing|y|drops?)?|drizzle|lluvia|llover|llueve|lloviendo|llovizna|tears? fall|cry(?:ing)? in the rain')],
    ['nieve', word('snow|snowing|winter|frozen|ice|nieve|nevando|invierno|hielo|helado|frio|cold')],
    ['niebla', word('fog|mist|smoke|haze|cloud(?:s|y)?|niebla|neblina|humo|nubes?|bruma')],
    ['fuego', word('fire|flames?|burn(?:ing|s|ed)?|ashes|ember|fuego|llamas?|arde|ardiendo|quemar|quemo|cenizas|incendio')],
    ['viento', word('wind|breeze|blowing|viento|brisa|soplar|huracan')]];
  const TIMES = [['noche', word('night|midnight|dark(?:ness)?|moonlight|tonight|late|noche|medianoche|oscuro|oscuridad|madrugada|anoche|esta noche')],
    ['amanecer', word('dawn|sunrise|morning|sunshine|manana|amanecer|alba|amaneciendo|good morning')],
    ['atardecer', word('sunset|evening|dusk|golden hour|atardecer|ocaso|tarde|crepusculo')],
    ['dia', word('daylight|noon|sunny|bright day|mediodia|soleado|de dia')]];
  const ACTS = [['drive', word('driv(?:e|ing|es)|car|highway|road trip|wheel|conduc(?:ir|o|es)|carro|coche|autopista|carretera|manejo|manejar')],
    ['dance', word('danc(?:e|es|ing)|party|club|baila(?:r|ndo|mos)?|fiesta|bailamos|movin|groove|perreo|rumba|disco')],
    ['cry', word('cry(?:ing)?|tears?|weep|sobbing|broken heart|lloro|llorar|llorando|lagrimas|llanto|dolor|hurts?|duele|heartbreak')],
    ['run', word('run(?:ning|s)?|chase|escape|corr(?:o|er|iendo)|huir|huyo|escapar|speed|rapido')],
    ['sleep', word('sleep(?:ing)?|dream(?:s|ing)?|bed|dormir|duermo|sueno|suenos|sonar|durmiendo|pesadilla|insomnia')],
    ['sing', word('sing(?:ing)?|song|voice|melody|scream|shout|canto|cantar|cancion|voz|melodia|grito|gritar')]];
  const find = (list, text) => list.find(([, rx]) => rx.test(text))?.[0] || null;
  const A = R.atmos = {
    key: '', rows: [],
    // un clima dura unos versos aunque no se repita la palabra; la hora y el lugar se quedan hasta que cambian
    plan(lines) {
      const key = JSON.stringify(lines.map(l => l.text)); if (key === this.key) return this.rows;
      let place = null, placeLeft = 0, time = null, timeLeft = 0, weather = null, weatherLeft = 0, act = null, actLeft = 0;
      this.rows = lines.map(line => {
        const t = norm(line.text); if (!t) return null;
        const p = find(PLACES, t), w = find(WEATHER, t), d = find(TIMES, t), a = find(ACTS, t);
        if (p) { place = p; placeLeft = 7; } else if (placeLeft > 0) placeLeft--; else place = null; if (d) { time = d; timeLeft = 5; } else if (timeLeft > 0) timeLeft--; else time = null;
        if (w) { weather = w; weatherLeft = 4; } else if (weatherLeft > 0) weatherLeft--; else weather = null;
        if (a) { act = a; actLeft = 1; } else if (actLeft > 0) actLeft--; else act = null;
        if (w === 'lluvia' && !a) { act = act || 'cry'; actLeft = Math.max(actLeft, 1); }
        return { place, weather: weatherLeft >= 0 ? weather : null, time, act };
      });
      this.key = key; return this.rows;
    },
    at(li) { return (this.rows[li]) || null; },
    // cielo: sol, luna y estrellas según la hora; k (0..1) es cuánto se ve, para fundir una hora con la siguiente
    sky(K, time, t, a, horizon = 500, k = 1) {
      const c = K.c, calm = !!window.CFG?.reduceMotion; if (k < .02) return;
      if (time === 'noche') {
        K.rect(-100, -100, 1800, 1100, { f: 1, ft: .16 * k, over: true });
        const n = Math.round(46 * k); for (let i = 0; i < n; i++) { const x = (i * 211 + 40) % 1600, y = 40 + (i * 97) % (horizon - 80), tw = calm ? .6 : .4 + .6 * Math.abs(Math.sin(t * (.6 + (i % 5) * .2) + i)); K.circ(x, y, 1.4 + (i % 3) * .9, { f: -1, ft: tw * k }); }
        K.glow(3, 1180, 190, 220 + a * 50, .5 * k);
      } else if (time === 'amanecer' || time === 'atardecer') {
        const rise = time === 'amanecer' ? Math.min(1, (t % 40) / 40) : 1, sy = horizon - 20 - (time === 'amanecer' ? rise * 90 : 0);
        K.rect(-100, horizon - 300, 1800, 340, { f: 2, ft: .06 * k, over: true });
        K.glow(2, 800, sy, 420 + a * 60, .4 * k); K.circ(800, sy, 74, { f: 2, ft: .8 * k, s: 1, lw: 4 * k + .5 });
        for (let i = 0; i < 16; i++) { const an = i / 16 * Math.PI * 2 + (calm ? 0 : t * .05); K.line(800 + Math.cos(an) * 96, sy + Math.sin(an) * 96, 800 + Math.cos(an) * (150 + (i % 2) * 50), sy + Math.sin(an) * (150 + (i % 2) * 50), 2, 3, .4 * k); }
      } else if (time === 'dia') K.glow(2, 1300, 150, 360, .45 * k);
    },
    // el escenario completo: cielo, mundo del lugar y clima, anclado al suelo. «view» mueve la cámara del fondo (paralaje)
    backdrop(K, { place, at = {}, now, beat = 0, ground = 710, cx = 800, view = {} }) {
      const c = K.c, interior = place === 'cuarto', wz = (interior ? 1 : 1.32) * (1 + (view.dolly || 0) * .5 + (view.punch || 0) * .6);
      c.save(); c.translate(800, ground); c.scale(wz, wz); c.rotate((view.roll || 0) * .6); c.translate(-800 - (view.x || 0) - (view.drift || 0), -ground - (view.y || 0));
      if (!interior) for (const [tm, kk] of view.skies || [[at.time, 1]]) this.sky(K, tm, now, beat, 520, kk);
      K.line(-300, ground, 1900, ground, 1, 5);
      if (R.world?.enabled) {
        const sc = view.scroll || 0;
        const tiles = prof => { const n0 = Math.floor(sc / 1300); for (let n = n0 - 1; n <= n0 + 2; n++) { const X = 800 + n * 1300 - sc; if (X < -700 || X > 2300) continue; c.save(); c.translate(X, 0); c.scale(n % 2 ? -1 : 1, 1); c.translate(-X, 0); R.world.draw(K, prof, now, { cx: X, ground }); c.restore(); } };
        if (interior || !sc) R.world.draw(K, R.world.profile(place), now, { cx: interior ? cx : 800, ground });
        else if (view.seam) {                                 // el cruce entre dos lugares: lo viejo queda atrás, lo nuevo entra por la derecha
          const xs = 800 + view.seam.u - sc;
          c.save(); c.beginPath(); c.rect(-4000, -4000, xs + 4000, 9000); c.clip(); tiles(R.world.profile(view.seam.from)); c.restore();
          c.save(); c.beginPath(); c.rect(xs, -4000, 9000, 9000); c.clip(); tiles(R.world.profile(view.seam.to)); c.restore();
          K.line(xs, 40, xs, ground, 1, 7, .85); K.line(xs + 14, 90, xs + 14, ground, 2, 3, .6);
        } else tiles(R.world.profile(place));
      }
      if (interior) for (const [tm, kk] of view.skies || [[at.time, 1]]) this.sky(K, tm, now, beat, 520, kk);
      if (!interior && R.world?.enabled) this.life(K, place, at.time, now, ground, view.scroll || 0, R.world.profile(place));
      for (const [wt, kk] of view.weathers || [[at.weather, 1]]) this.weather(K, wt, now, beat, ground, kk);
      c.restore();
    },
    // vida propia del lugar: tráfico y peatones lejanos, barcos y gaviotas, luciérnagas, un rodadero en el desierto; deterministas y a la velocidad del paisaje
    life(K, place, time, now, ground, sc = 0, prof = {}) {
      const calm = !!window.CFG?.reduceMotion, t = calm ? 0 : now, night = time === 'noche' || time === 'atardecer', c = K.c;
      const lane = (i, speed, off, span = 2200) => ((((i * 421 + off + speed * t) - sc * .35) % span) + span) % span - 300;
      if (place === 'ciudad') {
        for (let i = 0; i < 5; i++) {                                                  // coches por la calzada, en los dos sentidos
          const dir = i % 2 ? -1 : 1, x = dir > 0 ? lane(i, 140 + i * 17, 0) : 1900 - lane(i, 120 + i * 13, 600), y = ground + 22 + (i % 2) * 22, w = 62 + (i % 3) * 8;
          c.save(); c.translate(x, y); c.scale(dir, 1);
          K.poly([[-w / 2, 0], [-w / 2, -16], [-w / 4, -17], [-w / 7, -30], [w / 4, -30], [w / 3, -17], [w / 2, -14], [w / 2, 0]], { f: [2, 3, 1][i % 3], ft: .85, s: 1, lw: 3 });
          K.circ(-w / 3, 0, 8, { f: 1, s: 1, lw: 3 }); K.circ(w / 3, 0, 8, { f: 1, s: 1, lw: 3 }); if (night) K.glow(2, w / 2 + 6, -9, 38, .6);
          c.restore();
        }
        for (let i = 0; i < 6; i++) {                                                  // peatones diminutos en la acera
          const dir = i % 2 ? -1 : 1, x = dir > 0 ? lane(i + 7, 30 + (i % 3) * 7, 100) : 1900 - lane(i + 7, 28 + (i % 3) * 6, 300), y = ground - 44, ph = t * 4.2 + i, h = 30 + (i % 3) * 4;
          K.circ(x, y - h, 4.5, { f: -1, s: 1, lw: 2 }); K.line(x, y - h + 5, x, y - 12, [1, 2, 3][i % 3], 5);
          K.line(x, y - 12, x + Math.sin(ph) * 6, y, 1, 3); K.line(x, y - 12, x - Math.sin(ph) * 6, y, 1, 3);
        }
      } else if (place === 'costa') {
        const hz = prof.horizon || 600;
        for (let i = 0; i < 2; i++) {                                                  // barcos que cruzan el horizonte, con cabeceo
          const x = lane(i + 3, 18 + i * 9, i * 700, 2600), y = hz - 6 + Math.sin(t * .9 + i) * 3, k = i ? .8 : 1;
          K.poly([[x - 26 * k, y], [x + 28 * k, y], [x + 18 * k, y + 9 * k], [x - 18 * k, y + 9 * k]], { f: 1, ft: .9, s: 1, lw: 3 }); K.line(x, y, x, y - 34 * k, 1, 3);
          K.poly([[x + 2 * k, y - 32 * k], [x + 2 * k, y - 4 * k], [x + 24 * k, y - 4 * k]], { f: -1, s: 1, lw: 2.5 });
        }
        for (let i = 0; i < 4; i++) {                                                  // gaviotas
          const x = lane(i + 11, 52 + i * 11, i * 300, 2000), y = 150 + i * 46 + Math.sin(t * .7 + i * 2) * 18, w = Math.sin(t * 6 + i) * 6;
          K.line(x - 14, y - w, x, y, 1, 3); K.line(x, y, x + 14, y - w, 1, 3);
        }
      } else if (place === 'bosque') {
        if (night) for (let i = 0; i < 18; i++) { const x = (i * 197) % 1500 + Math.sin(t * .5 + i) * 40 - sc * .2, y = 300 + (i * 61) % 360 + Math.cos(t * .6 + i * 1.7) * 30, on = .5 + .5 * Math.sin(t * 1.8 + i * 2.2); K.glow(2, x, y, 26 + on * 16, .6); K.circ(x, y, 2 + on * 1.5, { f: 2 }); }
        for (let i = 0; i < 7; i++) { const ph = (t * .09 + i * .143) % 1, x = (i * 233) % 1500 + Math.sin(t + i) * 50 - ph * 200 - sc * .3, y = 80 + ph * (ground - 100); K.ell(x, y, 11, 5, t * 2 + i, { f: i % 2 ? 2 : 3, ft: .8, s: 1, lw: 2 }); }
      } else if (place === 'desierto') {
        const x = lane(2, 85, 0, 2400), y = ground + 24 - Math.abs(Math.sin(t * 3.4)) * 22, r = 20;      // rodadero que va dando saltos
        c.save(); c.translate(x, y - r); c.rotate(t * 5); K.circ(0, 0, r, { s: 1, lw: 3, st: .9 }); for (let k = 0; k < 6; k++) K.line(0, 0, Math.cos(k * 1.047) * r, Math.sin(k * 1.047) * r, 1, 2, .8); c.restore();
        for (let i = 0; i < 3; i++) { const a = t * .3 + i * 2.1, x2 = 520 + i * 260 + Math.cos(a) * 140, y2 = 130 + i * 36 + Math.sin(a) * 28; K.line(x2 - 16, y2 - 4, x2, y2, 1, 3); K.line(x2, y2, x2 + 16, y2 - 4, 1, 3); }
      } else if (place === 'espacio') {
        const ph = (t * .12) % 1; if (ph < .35) { const x = 1700 - ph * 3.2 * 1400, y = 80 + ph * 3.2 * 280; K.line(x, y, x + 120, y - 60, 3, 5, .9); K.line(x + 40, y - 20, x + 200, y - 100, -1, 2, .5); }
      }
    },
    // público visto de espaldas al pie del cuadro; levanta los brazos con el pulso
    crowd(K, now, beat, amp = 1, ground = 760) {
      const calm = !!window.CFG?.reduceMotion;
      for (let row = 0; row < 2; row++) for (let i = -1; i < 14; i++) {
        const x = i * 122 + (row ? 60 : 0) + ((i * 37 + row * 11) % 17), k = row ? .78 : 1, ph = i * .9 + row * 1.7, jump = calm ? 0 : Math.abs(Math.sin(now * 4 * .9 + ph)) * 16 * amp + beat * 10 * amp, y = ground + (row ? 104 : 150) - jump;
        const arm = !calm && (i + row) % 3 === 0 ? 1 : 0, tone = row ? .62 : .86;
        K.ell(x, y + 70 * k, 52 * k, 60 * k, 0, { f: 1, ft: tone, s: 1, lw: 3 });
        if (arm) { K.line(x - 30 * k, y + 20 * k, x - 52 * k, y - 62 * k - jump * .4, 1, 12 * k); K.circ(x - 52 * k, y - 70 * k - jump * .4, 9 * k, { f: -1, s: 1, lw: 2.5 }); }
        K.circ(x, y, 28 * k, { f: (i + row) % 2 ? 2 : 1, ft: tone, s: 1, lw: 3 });
      }
    },
    // clima: partículas deterministas a pantalla completa
    weather(K, type, t, a, ground = 710, k = 1) {
      if (!type || k < .02) return; const N = n => Math.max(1, Math.round(n * k)); const calm = !!window.CFG?.reduceMotion, tt = calm ? 0 : t;
      if (type === 'lluvia' || type === 'tormenta') {
        const n = N(type === 'tormenta' ? 120 : 76), sp = type === 'tormenta' ? 1500 : 1000;
        for (let i = 0; i < n; i++) { const x = ((i * 97 + tt * 110) % 1760) - 80, y = ((i * 173 + tt * sp * (.7 + (i % 5) * .08)) % 1000) - 60; K.line(x, y, x - 16, y + 52, 1, 2, .5 + (i % 3) * .12); }
        for (let i = 0; i < N(16); i++) { const ph = (tt * 2.2 + i * .37) % 1, x = (i * 331) % 1600; if (ph < .6) K.ell(x, ground + 20 + (i % 4) * 30, 8 + ph * 40, 2 + ph * 8, 0, { s: 1, lw: 2, st: .8 - ph }); }
        K.rect(-100, -100, 1800, 1100, { f: 3, ft: .1 * k, over: true });
        if (type === 'tormenta') { const flash = Math.max(0, 1 - ((tt * .45) % 3.2) * 4); if (flash > 0) { K.rect(-100, -100, 1800, 1100, { f: -1, ft: flash * .55, over: true }); const bx = 500 + (Math.floor(tt * .45 / 3.2) * 377) % 700; K.path(c => { c.moveTo(bx, 0); c.lineTo(bx - 40, 200); c.lineTo(bx + 20, 220); c.lineTo(bx - 60, 460); c.lineTo(bx - 10, 480); c.lineTo(bx - 90, ground); }, { s: 2, lw: 8, st: flash }); } }
      } else if (type === 'nieve') {
        for (let i = 0; i < N(100); i++) { const x = ((i * 131 + Math.sin(tt * .7 + i) * 36 + tt * 24) % 1700) - 50, y = ((i * 89 + tt * (46 + (i % 4) * 22)) % 960) - 30; K.circ(x, y, 2.5 + (i % 4) * 1.3, { f: -1, s: 1, lw: 1.6, st: .5 }); }
        K.rect(-100, -100, 1800, 1100, { f: 3, ft: .09 * k, over: true });
      } else if (type === 'niebla') {
        for (let i = 0; i < 6; i++) { const y = 260 + i * 78, d = ((tt * (7 + i * 3) + i * 300) % 2000) - 400; K.rect(-400 + d, y, 2200, 70 + (i % 3) * 18, { f: 3, ft: .16 * k, over: true }); K.rect(-1400 + d, y + 20, 2200, 40, { f: -1, ft: .22 * k, over: true }); }
      } else if (type === 'fuego') {
        K.glow(2, 800, ground + 40, 520 + a * 80, .16 * k);
        for (let i = 0; i < N(54); i++) { const x = (i * 149) % 1600 + Math.sin(tt * 1.4 + i) * 40, ph = (tt * (.18 + (i % 5) * .05) + i * .13) % 1, y = ground + 30 - ph * 760; K.circ(x, y, (1 - ph) * 7 + 1, { f: i % 3 ? 2 : -1, ft: 1 - ph * .6 }); }
      } else if (type === 'viento') {
        for (let i = 0; i < N(18); i++) { const y = 110 + i * 40 + Math.sin(i) * 20, x = ((i * 277 + tt * 520) % 2000) - 200, len = 140 + (i % 4) * 70; K.path(c => { c.moveTo(x, y); c.bezierCurveTo(x + len * .3, y - 14, x + len * .6, y + 14, x + len, y); }, { s: 1, lw: 2.5, st: .45 }); }
        for (let i = 0; i < N(8); i++) { const x = ((i * 421 + tt * 380) % 1900) - 150, y = 220 + (i * 83) % 460 + Math.sin(tt * 3 + i) * 30; K.ell(x, y, 16, 7, tt * 4 + i, { f: i % 2 ? 2 : 3, ft: .7 }); }
      }
    },
  };
})();
