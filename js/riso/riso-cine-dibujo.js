// la cámara afecta a la acción; la letra permanece en su zona de lectura.
(() => {
  const R = window.RISO, F = R?.film; if (!F) return;
  const mix = (a, b, t) => a + (b - a) * t;
  F.draw = function (K, shot, elapsed, options = {}) {
    const b = shot.narrative, reduced = !!window.CFG?.reduceMotion, pose = this.pose(b, elapsed, reduced), state = this.stateAt(b, elapsed, reduced);
    const cx = shot.flip ? 470 : 1130, ground = 710, camera = this.camera(b, elapsed, cx, reduced), c = K.c;
    const action = b.action === 'hold' ? null : b.action, gap = b.cast === 2 || ['give', 'reach'].includes(action) ? 120 : 0;
    const left = cx - gap + pose.x, right = cx + gap;
    c.save(); c.beginPath(); c.rect(cx - 330, 120, 660, 640); c.clip();
    c.translate(cx, 450); c.scale(camera.reverse ? -camera.z : camera.z, camera.z); c.translate(-camera.x, -camera.y);
    // decorado persistente. no gira de escenario durante una misma acción.
    K.line(cx - 390, ground, cx + 390, ground, 1, 5);
    if (R.world?.enabled) R.world.draw(K,R.world.profile(b.place),b.t+elapsed,{cx,ground});
    else if (b.place === 'cuarto') {
      K.rect(cx - 300, 150, 600, 560, { s: 3, lw: 4 });
      K.rect(cx - 250, 215, 135, 160, { f: 3, ft: .10, s: 3, lw: 3 });
      K.line(cx - 182, 215, cx - 182, 375, 3, 3); K.line(cx - 250, 295, cx - 115, 295, 3, 3);
    } else if (b.place === 'ciudad') {
      for (let i = -3; i <= 3; i++) { const h = 210 + (i * i % 3) * 55; K.rect(cx + i * 110 - 45, ground - h - 80, 85, h, { f: 3, ft: .18, s: 3, lw: 3 }); }
      K.line(cx - 390, 745, cx + 390, 745, 2, 5);
    } else if (b.place === 'bosque') {
      for (const sd of [-1, 1]) { K.line(cx + sd * 275, ground, cx + sd * 275, 230, 3, 8); K.ell(cx + sd * 275, 250, 70, 120, .12 * sd, { f: 3, ft: .35, s: 1, lw: 4 }); }
    } else K.circ(cx + 240, 235, 68, { f: 3, ft: .3, s: 1, lw: 4 });
    // puerta articulada: el ancho visible del panel cambia con la apertura.
    if (action === 'open' || action === 'return' || b.motif === 'puerta_entreabierta') {
      const dx = cx + 165, top = ground - 350, w = 120, opened = state.door;
      K.rect(dx - 10, top - 10, w + 20, 360, { f: 1, ft: .18, s: 1, lw: 6 });
      const edge = dx + w * (1 - opened * .84), rise = opened * 22;
      K.poly([[dx, top], [edge, top + rise], [edge, ground - rise], [dx, ground]], { f: 3, ft: .5, s: 1, lw: 5 });
      K.circ(edge - 13, top + 200, 5, { f: 2, s: 1, lw: 2 });
      if (opened > .05) K.poly([[edge, ground - rise], [dx + w, ground], [dx + w + opened * 90, ground + 60], [edge - opened * 50, ground + 60]], { f: 2, ft: .16 });
    }
    const actor = (px, second) => {
      const lean = second ? 0 : pose.head, gait = second ? 0 : pose.gait, ink = second ? 3 : 2;
      c.save(); c.translate(px, ground);
      K.ell(0, 4, 40, 7, 0, { f: 1, ft: .16 });
      K.line(-12, -105, -22 - gait, -4, 1, 11); K.line(12, -105, 22 + gait, -4, 1, 11);
      K.line(-22 - gait, -4, -38 - gait, -4, 1, 7); K.line(22 + gait, -4, 38 + gait, -4, 1, 7);
      K.poly([[-28, -205], [28, -205], [36, -100], [-36, -100]], { f: ink, ft: .75, s: 1, lw: 5 });
      K.line(-24, -190, -40, -136, ink, 13);
      const hx = second ? -45 - (action === 'give' ? pose.move * 35 : action === 'reach' ? pose.move * 25 : 0) : pose.handX;
      const hy = second ? -155 : pose.handY, elbow = second ? -48 : 40;
      K.line(second ? -24 : 24, -190, elbow, -170, ink, 13); K.line(elbow, -170, hx, hy, ink, 11);
      K.circ(hx, hy, 7, { f: -1, s: 1, lw: 3 });
      c.save(); c.translate(0, -235); c.rotate(lean);
      if (second) K.ell(0, 0, 33, 38, 0, { f: 3, s: 1, lw: 3 });
      K.ell(0, 0, 26, 30, 0, { f: -1, s: 1, lw: 4 });
      K.ell(0, -22, 27, 11, -.12, { f: second ? 3 : 1, s: 1, lw: 3 });
      K.line(second ? -11 : 7, -2, second ? -6 : 12, -2, 1, 3);
      K.line(second ? -21 : 20, 4, second ? -25 : 25, 10, 1, 2); c.restore(); c.restore();
    };
    const empty = b.place === 'cuarto' && (action === 'leave' ? pose.p >= .98 : state.empty >= .99);
    if (!empty && !(action === 'board' && pose.p > .86)) actor(left, false);
    if (!empty && gap) actor(right, true);
    const id = shot.props?.[0]?.id || b.motif;
    if (action === 'board' || id === 'taxi') {
      const tx = cx + 140;
      K.poly([[tx - 150, ground - 115], [tx - 75, ground - 115], [tx - 35, ground - 180], [tx + 85, ground - 180], [tx + 125, ground - 115], [tx + 185, ground - 105], [tx + 185, ground - 25], [tx - 150, ground - 25]], { f: 2, ft: .85, s: 1, lw: 6 });
      K.poly([[tx - 25, ground - 168], [tx + 70, ground - 168], [tx + 105, ground - 115], [tx - 55, ground - 115]], { f: -1, s: 1, lw: 4 });
      for (const dx of [-85, 125]) { K.circ(tx + dx, ground - 25, 28, { f: 1, s: 1, lw: 5 }); K.circ(tx + dx, ground - 25, 11, { f: -1, s: 1, lw: 3 }); }
      K.rect(tx + 5, ground - 200, 48, 20, { f: -1, s: 1, lw: 3 });
      if (state.taxi > .85) K.circ(tx, ground - 140, 16, { f: -1, s: 1, lw: 3 });
    } else if (id === 'foto_rota') {
      const px = left + 45, py = ground - 158, split = state.photo * 22;
      c.save(); c.translate(px, py); c.scale(.62, .62);
      for (const sd of [-1, 1]) { c.save(); c.translate(sd * split, sd * split * .4); c.rotate(sd * state.photo * .12);
        K.poly(sd < 0 ? [[-60, -55], [0, -55], [9, -20], [-6, 10], [0, 65], [-60, 65]] : [[0, -55], [60, -55], [60, 65], [0, 65], [-6, 10], [9, -20]], { f: -1, s: 1, lw: 4 });
        K.rect(sd < 0 ? -50 : 10, -43, 40, 80, { f: 3, ft: .5, s: 1, lw: 2 }); c.restore(); }
      c.restore();
    } else if (id === 'flowers' || id === 'semilla_brote') {
      const wilt = state.flower, px = cx, stemY = ground - 45, headY = ground - 185 + wilt * 65, headX = px + wilt * 55;
      K.line(px, stemY, px + wilt * 22, ground - 125, 3, 6); K.line(px + wilt * 22, ground - 125, headX, headY, 3, 6);
      K.ell(px - 20, ground - 115, 28, 11, -.6 + wilt, { f: 3, s: 1, lw: 3 });
      for (let i = 0; i < 6; i++) { const a = i * Math.PI / 3; K.ell(headX + Math.cos(a) * 21, headY + Math.sin(a) * (21 - wilt * 11), 15, 9, a + wilt, { f: 2, ft: .9 - wilt * .5, s: 1, lw: 3 }); }
      K.circ(headX, headY, 10, { f: 3, s: 1, lw: 3 });
    } else if (id === 'carta_abierta') {
      const transfer = state.letter, px = mix(left + pose.handX, right - 80, transfer);
      K.rect(px - 22, ground - 177, 44, 31, { f: -1, s: 1, lw: 3 });
      K.line(px - 22, ground - 177, px, ground - 160, 1, 2); K.line(px, ground - 160, px + 22, ground - 177, 1, 2);
    } else if (id && !['puerta_entreabierta', 'taxi'].includes(id) && R.props.DEFS[id]) {
      const where = id === 'maleta_viaje' ? [left - 45, ground - 62, .3] : id === 'banco_vacio' ? [cx, ground - 60, .55] : [cx, 310, .45];
      R.props.drawProp(K, id, ...where, 1, { seed: shot.seed, ph: 0, rot: 0 });
    }
    c.restore();
    if (!options.thumbnail) K.code(`${F.roles[b.section?.role] || 'verso'} · ${F.cameras[b.camera] || 'plano medio'}`, cx, 795, { align: 'center', size: 14 });
  };
})();
