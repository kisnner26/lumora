// guion local: se compila desde la letra completa; buscar hacia atrás no cambia la historia.
(() => {
  const R = window.RISO; if (!R) return;
  const norm = s => String(s || '').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[’]/g, "'").replace(/[^a-z0-9' ]/g, ' ').replace(/\s+/g, ' ').trim();
  const actions = [
    ['leave', /\b(goodbye|farewell|leaving|left you|walk away|adios|me fui|te fuiste|me voy|marcharme|partir)\b/],
    ['return', /\b(come back|coming home|back home|return|regres[oa]|regresar|volv[ie]|vuelve|volver a casa)\b/],
    ['wait', /\b(wait|waiting|esper[oa]|esperando|esperarte|esperandote)\b/],
    ['reach', /\b(hold my hand|take my hand|hold you|embrace|hug|abraz[oa]|abrazarte|tu mano|besarte|kiss you)\b/],
    ['walk', /\b(walking|walk|running|run|camino|caminar|corriendo|correr)\b/],
    ['remember', /\b(remember|memories|recuerdo|recordar|olvidar|forget|fotografia|photograph)\b/],
    ['grow', /\b(start again|grow again|empezar de nuevo|volver a crecer|renacer|amanecer|sunrise)\b/],
  ];
  const places = [
    ['cuarto', /\b(room|bedroom|bed|home|casa|cuarto|habitacion|cama|window|ventana|door|puerta)\b/],
    ['ciudad', /\b(street|city|road|train|station|calle|ciudad|carretera|tren|estacion|taxi)\b/],
    ['bosque', /\b(forest|trees|river|garden|bosque|arbol|rio|jardin|flowers|flores)\b/],
    ['espacio', /\b(stars|moon|galaxy|sky|estrellas|luna|galaxia|cielo)\b/],
  ];
  const symbol = { leave: 'maleta_viaje', return: 'puerta_entreabierta', wait: 'banco_vacio', reach: 'hilo_rojo', walk: 'road', remember: 'foto_rota', grow: 'semilla_brote' };
  const moods = { leave: 'melancolico', return: 'sereno', wait: 'nostalgico', reach: 'romantico', remember: 'nostalgico', grow: 'feliz' };
  const N = R.narrative = { compile(lines) {
    let place = 'cuarto', motif = null, action = null, mood = 'sereno', chapter = 0, cast = 1;
    const repeats = new Map(), frames = [];
    return lines.map((line, li) => {
      const text = norm(line.text); if (!text) return null;
      const neg = /\b(?:don't|dont|never|no|nunca|not)\s+(?:ever\s+)?(?:leave|go|return|come back|wait|remember|volver|vuelvas|regreses|esperes|olvides|te vayas)\b/.test(text);
      if (neg) action = null;
      const event = neg ? null : actions.find(([, rx]) => rx.test(text))?.[0];
      const location = places.find(([, rx]) => rx.test(text))?.[0];
      if (location && location !== place) { place = location; chapter++; }
      if (event && event !== action) { action = event; chapter++; }
      if (event) { motif = symbol[event]; mood = moods[event] || mood; }
      if (/\b(you|we|us|together|tu|ti|nosotros|juntos|ella|ellos|nosotras)\b/.test(text)) cast = 2;
      const previous = repeats.get(text);
      // un estribillo recupera su composición y símbolo aunque cambie la estrofa.
      const beat = { li, action: event || (action ? 'hold' : null), carry: action, place, motif, mood, cast, chapter, visualChapter: chapter, reprise: previous !== undefined, anchor: previous ?? li };
      if (previous !== undefined) { const first = frames[previous]; if (first) {
        Object.assign(beat, { place: first.place, motif: first.motif, cast: first.cast, action: first.action, carry: first.carry, mood: first.mood, visualChapter: first.visualChapter });
        place = first.place; motif = first.motif; cast = first.cast; action = first.carry; mood = first.mood;
      } }
      repeats.set(text, previous ?? li);
      // el mapa local guarda la composición original sin depender del orden de reproducción.
      frames[li] = beat;
      return beat;
    });
  }, plan(lines) {
    const key = JSON.stringify(lines.map(l => [l.t, l.text]));
    if (key !== this.key) { this.beats = this.compile(lines); this.key = key; }
    return this.beats || [];
  }, draw(K, shot, elapsed) {
    const beat = shot.narrative, reduced = !!window.CFG?.reduceMotion;
    const p = reduced ? 1 : R.easeOut(R.clamp(elapsed / 2.4)), cx = shot.flip ? 470 : 1130, ground = 700;
    const action = beat.action === 'hold' ? beat.carry : beat.action;
    const gap = action === 'leave' ? 85 : action === 'reach' || action === 'return' ? 190 - p * 110 : 150;
    const depart = action === 'leave' ? -p * 140 : 0;
    const drift = action === 'walk' && !reduced ? p * 85 - 42 : 0;
    // marco espacial compartido y un solo objeto focal: la letra conserva su mitad del cuadro.
    K.line(cx - 310, ground + 4, cx + 310, ground + 4, 1, 5);
    if (beat.place === 'cuarto') { K.rect(cx - 285, 160, 570, 540, { s: 3, lw: 4 }); K.line(cx - 285, 530, cx + 285, 530, 3, 3); }
    if (beat.place === 'ciudad') for (let i = -2; i <= 2; i++) K.rect(cx + i * 110 - 45, 250 - (i % 2) * 60, 90, 350 + (i % 2) * 60, { f: 3, ft: .16, s: 3, lw: 3 });
    if (beat.place === 'bosque') for (const side of [-1, 1]) { K.line(cx + side * 260, 700, cx + side * 260, 250, 3, 8); K.ell(cx + side * 260, 260, 65, 110, 0, { f: 3, ft: .3, s: 1, lw: 3 }); }
    if (beat.place === 'espacio') K.circ(cx + 190, 220, 65, { f: 3, ft: .3, s: 1, lw: 4 });
    const person = (px, secondary) => {
      K.c.save(); K.c.translate(px, ground);
      const step = action === 'walk' && !reduced ? Math.sin(p * Math.PI * 4) * 14 : 0;
      K.ell(0, 5, 49, 8, 0, { f: 1, ft: .15 });
      K.line(-12, -105, -22 - step, 0, 1, 12); K.line(12, -105, 22 + step, 0, 1, 12);
      K.poly([[-27, -205], [27, -205], [36, -100], [-36, -100]], { f: secondary ? 3 : 2, ft: .8, s: 1, lw: 5 });
      if (secondary) K.ell(0, -240, 35, 39, 0, { f: 3, s: 1, lw: 3 });
      K.circ(0, -240, 28, { f: -1, s: 1, lw: 5 });
      if (!secondary) K.ell(0, -257, 30, 15, -.12, { f: 1, s: 1, lw: 3 });
      K.line(secondary ? -10 : 5, -241, secondary ? -5 : 10, -241, 1, 3);
      const hand = action === 'reach' || action === 'return' ? (secondary ? -55 : 55) : (secondary ? -36 : 36);
      K.line(secondary ? -23 : 23, -190, hand, action === 'reach' ? -160 : -135, 1, 9);
      K.circ(hand, action === 'reach' ? -160 : -135, 7, { f: -1, s: 1, lw: 3 });
      K.c.restore();
    };
    person(cx - (beat.cast === 2 ? gap : 0) + drift + depart, false);
    if (beat.cast === 2) person(cx + gap, true);
    const id = shot.props?.[0]?.id;
    const placement = { maleta_viaje: [cx - gap + depart - 45, ground - 60, .30], carta_abierta: [cx - gap + drift + 40, ground - 155, .20], foto_rota: [cx - gap + drift + 45, ground - 155, .22], banco_vacio: [cx, ground - 70, .62], hilo_rojo: [cx, ground - 145, .48], puerta_entreabierta: [cx + 205, ground - 180, .9] }[id] || [cx, 330, .45];
    if (id && R.props.DEFS[id]) R.props.drawProp(K, id, ...placement, reduced ? 1 : R.easeOut(R.clamp(elapsed / 1.1)), { seed: shot.seed, ph: 0, rot: -.025 });
  } };
})();
