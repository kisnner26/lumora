// ============================================================
// tech.js — software, sistemas y binarios.
// Placa de circuitos, lluvia binaria, volcado hexadecimal, desensamblador,
// terminal, red de nodos, osciloscopio y mapa de memoria. Todo generado:
// los bytes salen de la propia canción (título, artista, tempo, posición).
// ============================================================

LEX.push(['tech', /\b(computer\w*|computador\w*|ordenador\w*|pc|laptop|code|coding|c[oó]digo\w*|software|program\w*|sistem\w*|system\w*|binar\w*|bits?|bytes?|data|datos|digital\w*|hack\w*|hacker\w*|glitch\w*|virus|malware|error\w*|bug\w*|crash\w*|reboot|reinici\w*|download\w*|descarg\w*|upload\w*|internet|wi-?fi|online|offline|red\b|network\w*|server\w*|servidor\w*|robot\w*|machine\w*|m[aá]quina\w*|ai\b|ia\b|algoritm\w*|algorithm\w*|cyber\w*|ciber\w*|pixel\w*|p[ií]xel\w*|screen\w*|pantalla\w*|password\w*|contraseñ\w*|signal\w*|señal\w*|matrix|chip\w*|cpu|memory|memoria\w*|terminal|console|consola)\b/i, 'sistema']);
SCENE_FOR.tech = 'sistema';

// bytes determinísticos de la canción actual
function songBytes(n, salt = 0) {
  const r = mulberry(hashStr((ext.st.name || 'taxi cab') + '|' + (ext.st.artist || '') + '|' + salt));
  return Array.from({ length: n }, () => Math.floor(r() * 256));
}
const hex2 = b => b.toString(16).padStart(2, '0');
const MONO = '"Space Mono", ui-monospace, Menlo, monospace';

// ---------- escenario: placa de circuitos ----------
GENS.push({ name: 'sistema', make: r => ({ seed: r() * 1e6, lanes: 18 + Math.floor(r() * 14) }),
  draw(p, t, dt, R, E) {
    bg('#020806', '#04120c');
    const g = 26; x.strokeStyle = 'rgba(40,120,90,.08)'; x.lineWidth = 1;
    for (let i = 0; i < W; i += g) { x.beginPath(); x.moveTo(i, 0); x.lineTo(i, H); x.stroke(); }
    for (let j = 0; j < H; j += g) { x.beginPath(); x.moveTo(0, j); x.lineTo(W, j); x.stroke(); }
    const cx = W / 2, cy = H * .45, cs = S() * .16;
    const rr = mulberry(R.seed | 0), lanes = [];
    for (let i = 0; i < R.lanes; i++) {
      const side = i % 4, off = (rr() - .5) * cs * .9, pts = [];
      let px = side === 0 ? cx - cs / 2 : side === 1 ? cx + cs / 2 : cx + off, py = side === 2 ? cy - cs / 2 : side === 3 ? cy + cs / 2 : cy + off;
      pts.push([px, py]);
      for (let k = 0; k < 4; k++) {
        const len = 40 + rr() * 140;
        if ((k + side) % 2 === 0) px += (side === 0 ? -1 : side === 1 ? 1 : (rr() < .5 ? -1 : 1)) * len; else py += (side === 2 ? -1 : side === 3 ? 1 : (rr() < .5 ? -1 : 1)) * len;
        pts.push([px, py]);
      }
      lanes.push(pts);
    }
    for (const pts of lanes) {
      x.strokeStyle = 'rgba(70,200,140,.35)'; x.lineWidth = 2; x.beginPath(); pts.forEach(([a, b], i) => i ? x.lineTo(a, b) : x.moveTo(a, b)); x.stroke();
      const [ex, ey] = pts.at(-1); x.fillStyle = 'rgba(70,200,140,.6)'; x.beginPath(); x.arc(ex, ey, 4, 0, TAU); x.fill();
    }
    lanes.forEach((pts, i) => {                                     // paquetes que viajan por las pistas al ritmo
      const k = ((IN.clock * .25 + i * .137) % 1), seg = k * (pts.length - 1), si = Math.floor(seg), f = seg - si;
      const [ax, ay] = pts[si], [bx, by] = pts[Math.min(si + 1, pts.length - 1)];
      glow(lerp(ax, bx, f), lerp(ay, by, f), 10 + (IN.beat || 0) * 14, 'rgba(120,255,190,A)', .9);
    });
    x.fillStyle = '#0b1d16'; x.fillRect(cx - cs / 2, cy - cs / 2, cs, cs);
    x.strokeStyle = 'rgba(120,255,190,.7)'; x.lineWidth = 2; x.strokeRect(cx - cs / 2, cy - cs / 2, cs, cs);
    for (let i = 0; i < 12; i++) { const u = (i + .5) / 12 * cs - cs / 2; x.fillStyle = 'rgba(180,200,190,.7)';
      x.fillRect(cx + u - 2, cy - cs / 2 - 8, 4, 8); x.fillRect(cx + u - 2, cy + cs / 2, 4, 8); x.fillRect(cx - cs / 2 - 8, cy + u - 2, 8, 4); x.fillRect(cx + cs / 2, cy + u - 2, 8, 4); }
    glow(cx, cy, cs * (.9 + (IN.beat || 0) * .3), 'rgba(90,255,170,A)', .25 + E * .3);
    x.fillStyle = 'rgba(160,255,210,.85)'; x.font = `400 ${Math.max(10, cs * .09)}px ${MONO}`; x.textAlign = 'center';
    x.fillText('0x' + hex2(songBytes(1, Math.floor(IN.clock))[0]) + hex2(IN.beatCount & 255), cx, cy + 4);
  } });

// ---------- capas del sistema ----------
Object.assign(MOTIF, {
  tech(k, t, E) {                                                  // el concepto elige una capa distinta cada vez
    const kinds = ['binary', 'hexdump', 'disasm', 'terminal', 'network', 'scope', 'memmap'];
    MOTIF[kinds[(IN.beatCount >> 4) % kinds.length]](k, t, E);
  },
  binary(k, t) {
    const cols = Math.floor(W / 18); x.font = `400 14px ${MONO}`; x.textAlign = 'center';
    for (let i = 0; i < cols; i++) {
      const sp = .5 + ((i * 37) % 10) / 10, head = ((t * sp * .35 + i * .173) % 1.3) * H;
      for (let j = 0; j < 16; j++) { const y = head - j * 18; if (y < 0 || y > H) continue;
        x.fillStyle = j === 0 ? `rgba(220,255,235,${k})` : `rgba(80,230,150,${k * (1 - j / 16) * .8})`;
        x.fillText(((i * 31 + j * 17 + Math.floor(t * 8)) % 7) % 2 ? '1' : '0', i * 18 + 9, y); }
    }
  },
  hexdump(k, t) {
    const bytes = songBytes(256, 7), rows = 14, x0 = W * .06, y0 = H * .14, lh = Math.max(14, H * .024), off = Math.floor(t * 3) % 16;
    x.font = `400 ${lh * .78}px ${MONO}`; x.textAlign = 'left';
    for (let r = 0; r < rows; r++) {
      const base = ((r + off) * 16) % 256, row = bytes.slice(base, base + 16);
      x.fillStyle = `rgba(120,160,150,${.6 * k})`; x.fillText((base + 0x401000).toString(16).padStart(8, '0'), x0, y0 + r * lh);
      row.forEach((b, i) => { const hot = (IN.beatCount + r + i) % 29 === 0; x.fillStyle = hot ? `rgba(255,230,120,${k})` : `rgba(180,240,210,${.75 * k})`;
        x.fillText(hex2(b), x0 + lh * 5.2 + i * lh * 1.55 + (i > 7 ? lh * .5 : 0), y0 + r * lh); });
      x.fillStyle = `rgba(120,160,150,${.55 * k})`;
      x.fillText(row.map(b => b > 32 && b < 127 ? String.fromCharCode(b) : '.').join(''), x0 + lh * 31, y0 + r * lh);
    }
  },
  disasm(k, t) {
    const ops = ['mov', 'xor', 'push', 'pop', 'call', 'jmp', 'jne', 'cmp', 'lea', 'add', 'sub', 'test', 'ret', 'shl', 'and'];
    const regs = ['rax', 'rbx', 'rcx', 'rdx', 'rsi', 'rdi', 'r8', 'r9', 'rsp', 'rbp'];
    const b = songBytes(512, 3), n = 18, lh = Math.max(15, H * .026), x0 = W * .58, y0 = H * .12, scroll = Math.floor(t * 2.5);
    x.font = `400 ${lh * .72}px ${MONO}`; x.textAlign = 'left';
    const lines = [];
    for (let i = 0; i < n; i++) {
      const j = (i + scroll) * 3 % 500, op = ops[b[j] % ops.length], r1 = regs[b[j + 1] % regs.length], r2 = regs[b[j + 2] % regs.length];
      const arg = /call|jmp|jne/.test(op) ? '0x' + (0x401000 + b[j + 1] * 16).toString(16) : op === 'ret' ? '' : op === 'push' || op === 'pop' ? r1 : `${r1}, ${b[j + 2] % 3 ? r2 : '0x' + hex2(b[j + 2])}`;
      lines.push({ op, arg, jump: /jmp|jne/.test(op) });
      const y = y0 + i * lh, cur = i === n >> 1;
      if (cur) { x.fillStyle = `rgba(90,255,170,${.12 * k})`; x.fillRect(x0 - 8, y - lh * .8, W * .38, lh); }
      x.fillStyle = `rgba(110,150,140,${.6 * k})`; x.fillText((0x401000 + (j * 4)).toString(16), x0, y);
      x.fillStyle = cur ? `rgba(255,240,160,${k})` : /call|jmp|jne|ret/.test(op) ? `rgba(255,150,120,${.9 * k})` : `rgba(170,235,210,${.85 * k})`;
      x.fillText(op.padEnd(6) + arg, x0 + lh * 5.5, y);
    }
    lines.forEach((l, i) => { if (!l.jump) return; const to = (i + 3 + (i % 4)) % n, y1 = y0 + i * lh - lh * .3, y2 = y0 + to * lh - lh * .3, ax = x0 - 14 - (i % 3) * 6;
      x.strokeStyle = `rgba(255,150,120,${.5 * k})`; x.lineWidth = 1.2; x.beginPath(); x.moveTo(x0 - 6, y1); x.lineTo(ax, y1); x.lineTo(ax, y2); x.lineTo(x0 - 6, y2); x.stroke(); });
  },
  terminal(k, t) {
    const w = Math.min(W * .5, 620), h = H * .36, x0 = W * .06, y0 = H * .52, lh = 18;
    x.fillStyle = `rgba(6,10,9,${.88 * k})`; x.beginPath(); x.roundRect(x0, y0, w, h, 10); x.fill();
    x.fillStyle = `rgba(40,50,48,${k})`; x.beginPath(); x.roundRect(x0, y0, w, 24, [10, 10, 0, 0]); x.fill();
    ['#ff5f56', '#ffbd2e', '#27c93f'].forEach((c, i) => { x.fillStyle = c; x.globalAlpha = k; x.beginPath(); x.arc(x0 + 16 + i * 16, y0 + 12, 5, 0, TAU); x.fill(); x.globalAlpha = 1; });
    const song = (ext.st.name || 'track').toLowerCase().replace(/[^a-z0-9]+/g, '_').slice(0, 22);
    const cmds = [
      `$ ./visual --track ${song}`, `  bpm: ${Math.round(IN.bpm || 0)}  fase: ${(IN.phase || 0).toFixed(2)}s`, `$ lrc --sync --offset ${(IN.off || 0).toFixed(1)}`,
      `  líneas: ${IN.lines?.length || 0}  bloques: ${IN.cuts?.length || 0}`, `$ render --depth 4 --grade auto`, `  escena: ${GENS[IN.blockGen?.[0]]?.name || '—'}`,
      `$ strings /dev/audio | grep -i drop`, `  beat #${IN.beatCount || 0}`,
    ];
    const shown = Math.floor((t * 1.2) % (cmds.length + 3));
    x.font = `400 13px ${MONO}`; x.textAlign = 'left';
    cmds.slice(0, shown).forEach((c, i) => { x.fillStyle = c.startsWith('$') ? `rgba(120,255,180,${k})` : `rgba(200,210,205,${.8 * k})`; x.fillText(c, x0 + 14, y0 + 44 + i * lh); });
    if (Math.floor(t * 2) % 2) { x.fillStyle = `rgba(120,255,180,${k})`; x.fillRect(x0 + 14, y0 + 34 + Math.min(shown, cmds.length) * lh, 8, 14); }
  },
  network(k, t) {
    const n = 16, nodes = [];
    for (let i = 0; i < n; i++) { const a = i / n * TAU + i * .7; nodes.push([W / 2 + Math.cos(a) * W * (.18 + (i % 3) * .1), H * .45 + Math.sin(a) * H * (.16 + (i % 4) * .06)]); }
    x.lineWidth = 1;
    for (let i = 0; i < n; i++) for (const j of [(i + 1) % n, (i + 5) % n]) {
      x.strokeStyle = `rgba(90,200,255,${.2 * k})`; x.beginPath(); x.moveTo(...nodes[i]); x.lineTo(...nodes[j]); x.stroke();
      const q = (t * .5 + i * .31) % 1; glow(lerp(nodes[i][0], nodes[j][0], q), lerp(nodes[i][1], nodes[j][1], q), 6, 'rgba(140,230,255,A)', .9 * k);
    }
    nodes.forEach(([a, b], i) => { x.fillStyle = `rgba(20,30,40,${k})`; x.strokeStyle = `rgba(140,230,255,${.8 * k})`; x.beginPath(); x.arc(a, b, 7, 0, TAU); x.fill(); x.stroke();
      if ((IN.beatCount + i) % 8 === 0) glow(a, b, 24, 'rgba(140,230,255,A)', .6 * k); });
  },
  scope(k, t) {
    const cy = H * .78, h = H * .1;
    x.strokeStyle = `rgba(90,255,170,${.15 * k})`; x.lineWidth = 1; for (let i = 0; i <= 10; i++) { x.beginPath(); x.moveTo(i * W / 10, cy - h); x.lineTo(i * W / 10, cy + h); x.stroke(); }
    x.strokeStyle = `rgba(120,255,190,${.9 * k})`; x.lineWidth = 2; x.shadowColor = 'rgba(90,255,170,1)'; x.shadowBlur = 10; x.beginPath();
    const amp = h * (.3 + (window.AUD?.live ? AUD.level : .4) + (IN.beat || 0) * .4);
    for (let i = 0; i <= 200; i++) { const u = i / 200, y = cy + Math.sin(u * 40 + t * 10) * Math.sin(u * 7 - t * 3) * amp * (.6 + .4 * Math.sin(u * 90 + t * 20)); i ? x.lineTo(u * W, y) : x.moveTo(u * W, y); }
    x.stroke(); x.shadowBlur = 0;
  },
  memmap(k, t) {
    const cols = 32, rows = 10, cw = W * .7 / cols, ch = H * .3 / rows, x0 = W * .15, y0 = H * .08, b = songBytes(cols * rows, 11);
    for (let i = 0; i < cols; i++) for (let j = 0; j < rows; j++) { const v = b[j * cols + i], live = (i + j * 3 + (IN.beatCount || 0)) % 23 === 0;
      x.fillStyle = live ? `rgba(255,230,120,${.9 * k})` : v > 200 ? `rgba(255,120,120,${.5 * k})` : v > 120 ? `rgba(90,200,255,${.4 * k})` : `rgba(90,255,170,${.18 * k})`;
      x.fillRect(x0 + i * cw + 1, y0 + j * ch + 1, cw - 2, ch - 2); }
  },
});
['hexdump', 'disasm', 'terminal', 'memmap'].forEach(id => typeof NEAR !== 'undefined' && NEAR.add(id));

// ---------- también entra en la mezcla procedural ----------
if (typeof PS !== 'undefined') {
  PS.binary = (k, t) => MOTIF.binary(k * .5, t);
  PS.scope = (k, t) => MOTIF.scope(k * .7, t);
  PS_NAMES.push('binary', 'scope');
}
if (GENRE.rap) GENRE.rap.scenes.push('sistema');

// ---------- dos transiciones del sistema ----------
if (typeof TR !== 'undefined') {
  Object.assign(TR, {
    // decodificar: la escena se deshace en caracteres binarios
    decode(e, s, w, h) {
      const c = 64, r = 36, tw = w / c, th = h / r;
      x.font = `400 ${Math.floor(th * .9)}px ${MONO}`; x.textAlign = 'center'; x.textBaseline = 'middle';
      for (let i = 0; i < c; i++) for (let j = 0; j < r; j++) {
        const n = (Math.sin(i * 12.9898 + j * 78.233) * 43758.5453) % 1, v = Math.abs(n);
        if (v < e - .15) continue;
        if (v < e + .1) { x.fillStyle = `rgba(90,255,170,${1 - e})`; x.fillText((i + j) % 2 ? '1' : '0', i * tw + tw / 2, j * th + th / 2); }
        else x.drawImage(s, i * tw, j * th, tw + 1, th + 1, i * tw, j * th, tw + 1, th + 1);
      }
      x.textBaseline = 'alphabetic';
    },
    // apagado de CRT: se aplasta a una línea, luego a un punto
    crt(e, s, w, h) {
      const a = clamp(e / .6), b = clamp((e - .6) / .4);
      const sh = Math.max(2, h * (1 - a)), sw = Math.max(2, w * (1 - b));
      x.fillStyle = '#000'; x.globalAlpha = 1;
      x.drawImage(s, w / 2 - sw / 2, h / 2 - sh / 2, sw, sh);
      x.globalCompositeOperation = 'lighter'; x.fillStyle = `rgba(220,255,240,${a * (1 - b)})`; x.fillRect(w / 2 - sw / 2, h / 2 - sh / 2, sw, sh);
      if (b > 0) { const g = x.createRadialGradient(w / 2, h / 2, 0, w / 2, h / 2, 40); g.addColorStop(0, `rgba(255,255,255,${1 - b})`); g.addColorStop(1, 'rgba(255,255,255,0)'); x.fillStyle = g; x.fillRect(w / 2 - 40, h / 2 - 40, 80, 80); }
    },
  });
  KINDS.length = 0; KINDS.push(...Object.keys(TR));
}
