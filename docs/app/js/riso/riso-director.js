// ============================================================
// riso-director.js — las escenas ilustradas (riso.js) como escenarios del director.
// Cada una entra en GENS con su nombre, así que el director de lumora, Claude y el
// modo autor las eligen igual que a las demás. Dibujan con el escenario compartido
// de RISO y lo pasan al lienzo del video; la letra va encima, como siempre.
// ============================================================
(() => {
  if (typeof GENS === 'undefined' || !window.RISO) return;
  const st = RISO.stage, RG = { last: 0, detail: 0 };
  const isRiso = sec => !!GENS[IN.blockGen?.[sec] ?? proc.order[sec % (proc.order.length || 1)]]?.riso;
  for (const id of RISO.order) {
    const sc = RISO.scenes[id];
    GENS.push({ name: id, riso: true,
      make: r => ({ inks: r() < .3 ? Math.floor(r() * RISO.INKS.length) : -1 }),         // casi siempre sus tintas; a veces otra combinación
      draw(p, t, dt, R, E) {
        const now = performance.now(), real = RG.last ? Math.min(.1, (now - RG.last) / 1000) : .016; RG.last = now;
        if (st.w !== innerWidth || st.h !== innerHeight) st.resize(innerWidth, innerHeight);
        st.notes = true; st.lyric = true; st.speed = 1; st.auto = true; st.margin = 96;         // el empujón de cámara recorta los bordes
        const want = window.LOWFX ? 1 : 2; if (RG.detail !== want) { RG.detail = want; st.setDetail(want, true); }
        if (st.sceneId !== id) st.setScene(id, { instant: true });
        st.setInks(R.inks);
        st.frame(real);
        x.drawImage(st.canvas, 0, 0, W, H);
      } });
  }
  // las escenas ilustradas ya traen su propio color y textura: sin espejo, simetría, gradación ni partículas encima,
  // y nunca como segundo escenario tenue (el escenario compartido dibuja de a uno)
  const _recipeFor = recipeFor;
  recipeFor = sec => {
    const r = _recipeFor(sec);
    if (isRiso(sec)) return { ...r, flip: false, dual: -1, dualParams: null, extra: null, hue: 0, sym: 'none', sys: [], grade: null, roll: 0 };
    return r.dual >= 0 && GENS[r.dual]?.riso ? { ...r, dual: -1, dualParams: null } : r;
  };
  if (typeof TEXT_SCENES !== 'undefined') for (const id of RISO.order) TEXT_SCENES.add(id);
})();
