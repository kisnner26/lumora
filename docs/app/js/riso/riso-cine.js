// dirección determinista: estructura, acciones, utilería y encuadres desde el reloj de la canción.
(() => {
  const R = window.RISO; if (!R) return;
  const clamp = v => Math.max(0, Math.min(1, v)), mix = (a, b, t) => a + (b - a) * t;
  const norm = s => String(s || '').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9 ]/g, ' ').replace(/\s+/g, ' ').trim();
  const F = R.film = { actions: { auto: 'automática', none: 'sin acción', open: 'abrir la puerta', give: 'entregar una carta', board: 'subir al taxi', leave: 'marcharse', return: 'regresar', wait: 'esperar', reach: 'abrazarse', walk: 'caminar', remember: 'recordar', grow: 'renacer', tear: 'romper la foto', wilt: 'marchitar la flor' },
    cameras: { auto: 'automático', wide: 'plano general', medium: 'plano medio', close: 'primer plano', detail: 'detalle del objeto', reverse: 'contraplano' },
    roles: { auto: 'estimada', intro: 'introducción', verse: 'verso', chorus: 'coro', bridge: 'puente', climax: 'clímax', outro: 'cierre' },
    edits: { lines: {}, sections: {} }, key: '', cache: '', revision: 0,
    songKey() { return typeof ext !== 'undefined' ? (ext.st.name || '') + '|' + (ext.st.artist || '') : ''; },
    setEdits(value, key = this.songKey()) { this.key = key; this.edits = this.clean(value); this.revision++; this.cache = ''; },
    clean(value) {
      const out = { lines: {}, sections: {} };
      for (const [i, line] of Object.entries(value?.lines || {})) {
        if (!/^\d+$/.test(i) || !line || typeof line !== 'object') continue;
        const e = {};
        if (Object.hasOwn(this.actions, line.action)) e.action = line.action;
        if (Object.hasOwn(this.cameras, line.camera)) e.camera = line.camera;
        if (['auto', 'tableau', 'singer', 'scene', 'prop', 'giant'].includes(line.kind)) e.kind = line.kind;
        if (R.props?.DEFS[line.motif]) e.motif = line.motif;
        if (['auto', 'intact', 'torn', 'fresh', 'wilted', 'occupied', 'empty'].includes(line.state)) e.state = line.state;
        out.lines[i] = e;
      }
      for (const [i, role] of Object.entries(value?.sections || {})) if (/^\d+$/.test(i) && Object.hasOwn(this.roles, role)) out.sections[i] = role;
      return out;
    },
    structure(lines, cuts, plans = [], duration = 0) {
      const end = Math.max(duration || 0, (lines.at(-1)?.t || 0) + 4, 1);
      const starts = [...new Set([0, ...cuts.filter(t => Number.isFinite(t) && t >= 0 && t < end)])].sort((a, b) => a - b);
      const counts = new Map(); for (const l of lines) { const s = norm(l.text); if (s) counts.set(s, (counts.get(s) || 0) + 1); }
      const blocks = starts.map((start, i) => {
        const stop = starts[i + 1] ?? end, ls = lines.filter(l => l.t >= start && l.t < stop && norm(l.text));
        const repeated = ls.filter(l => counts.get(norm(l.text)) > 1).length;
        const energy = Number.isFinite(plans[i]?.energy) ? Math.max(0, Math.min(10, plans[i].energy)) : Math.min(8, 3 + ls.length / Math.max(1, stop - start) * 8);
        const role = !ls.length ? (i === 0 ? 'intro' : i === starts.length - 1 ? 'outro' : 'bridge') : ls.length >= 2 && repeated / ls.length >= .6 ? 'chorus' : 'verse';
        return { i, start, end: stop, role, energy, estimated: true };
      });
      const choruses = blocks.filter(b => b.role === 'chorus');
      if (choruses.length > 1) {
        const peak = [...choruses].sort((a, b) => b.energy - a.energy || b.start - a.start)[0]; peak.role = 'climax';
        for (const b of blocks) if (b.role === 'verse' && b.start > choruses[0].start && b.end <= peak.start && !blocks.some(o => o !== b && o.role === 'verse' && o.start > b.start && o.end <= peak.start)) b.role = 'bridge';
      }
      return blocks;
    },
    compile(lines, cuts = [], plans = [], duration = 0, edits = {}) {
      const sections = this.structure(lines, cuts, plans, duration), base = R.narrative.compile(lines), clean = this.clean(edits);
      for (const s of sections) if (clean.sections[s.i] && clean.sections[s.i] !== 'auto') { s.role = clean.sections[s.i]; s.estimated = false; }
      let state = { photo: 0, flower: 0, letter: 0, door: 0, taxi: 0, empty: 0 };
      const beats = base.map((b, i) => {
        if (!b) return null;
        const e = clean.lines[i] || {}, action = e.action && e.action !== 'auto' ? e.action === 'none' ? null : e.action : b.action === 'hold' ? null : b.action;
        const section = sections.find(s => lines[i].t >= s.start && lines[i].t < s.end) || sections.at(-1);
        const before = { ...state };
        const field = { tear: 'photo', wilt: 'flower', give: 'letter', open: 'door', board: 'taxi', leave: 'empty' }[action];
        if (field) state[field] = 1;
        if (action === 'return') { state.empty = 0; state.door = 1; }
        if (action === 'grow') state.flower = 0;
        const custom = { intact: ['photo', 0], torn: ['photo', 1], fresh: ['flower', 0], wilted: ['flower', 1], occupied: ['empty', 0], empty: ['empty', 1] }[e.state];
        if (custom) { state[custom[0]] = custom[1]; before[custom[0]] = custom[1]; }
        const motif = e.motif || { open: 'puerta_entreabierta', give: 'carta_abierta', board: 'taxi', tear: 'foto_rota', wilt: 'flowers' }[action] || b.motif;
        const camera = e.camera && e.camera !== 'auto' ? e.camera : ['give', 'tear', 'wilt'].includes(action) ? 'detail' : action === 'open' ? 'medium' : action === 'reach' ? 'close' : b.reprise ? 'reverse' : section.role === 'climax' ? 'wide' : i % 4 === 0 ? 'wide' : 'medium';
        return { ...b, action: action || (e.action === 'none' ? null : b.action), carry: e.action === 'none' ? null : action || b.carry, motif, camera, kind: e.kind || 'auto', section, before, state: { ...state }, duration: Math.max(1, Math.min(8, (lines[i + 1]?.t ?? lines[i].t + 4) - lines[i].t)), t: lines[i].t, manual: Object.keys(e).length > 0 };
      });
      return { sections, beats };
    },
    plan(lines, cuts, plans, duration) {
      const key = this.songKey(); if (this.key !== key) this.setEdits({}, key);
      const signature = JSON.stringify([key, lines, cuts, plans, duration, this.revision]);
      if (signature !== this.cache) { this.result = this.compile(lines, cuts, plans, duration, this.edits); this.cache = signature; }
      return this.result;
    },
    progress(beat, elapsed, reduced = false) { return reduced || beat.action === 'hold' ? 1 : clamp(elapsed / Math.max(1, beat.duration * .85)); },
    stateAt(beat, elapsed, reduced = false) {
      const p = this.progress(beat, elapsed, reduced), q = clamp((p - .2) / .6);
      return Object.fromEntries(Object.keys(beat.state).map(k => [k, mix(beat.before[k], beat.state[k], q)]));
    },
    camera(beat, elapsed, cx, reduced) {
      const p = reduced ? 1 : this.progress(beat, elapsed), pose = this.pose(beat, elapsed, reduced);
      const target = beat.camera === 'detail' ? [cx + pose.handX, 530] : beat.camera === 'close' ? [cx, 465] : [cx, 460];
      const zoom = { wide: .88, medium: 1, close: 1.48, detail: 1.75, reverse: 1.08 }[beat.camera] || 1;
      return { x: target[0], y: target[1], z: zoom * (reduced ? 1 : 1 + Math.sin(p * Math.PI) * .025), reverse: beat.camera === 'reverse' };
    },
    pose(beat, elapsed, reduced = false) {
      const p = this.progress(beat, elapsed, reduced), act = beat.action === 'hold' ? null : beat.action;
      const move = clamp((p - .22) / .55), release = clamp((p - .78) / .22);
      const gait = reduced ? 0 : Math.sin(p * Math.PI * 6) * (act === 'walk' || act === 'leave' || act === 'board' ? 18 : 0);
      return { p, move, release, gait, x: act === 'leave' ? -move * 190 : act === 'board' ? move * 170 : act === 'return' ? -160 * (1 - move) : act === 'walk' ? move * 90 - 45 : 0,
        handX: act === 'give' ? 45 + move * 100 : act === 'open' ? 40 + move * 115 : act === 'reach' ? 55 + move * 65 : 40,
        handY: act === 'open' ? -155 : act === 'give' ? -160 : -135,
        head: act === 'remember' || act === 'wilt' ? -.16 * move : act === 'reach' ? .09 * move : 0 };
    }
  };
})();
