// homenaje con gameplay real: dos fuentes mudas, reloj musical y tinta en gpu.
(() => {
  'use strict';
  const R = window.RISO;
  if (!R) return;
  const clamp = (v, a = 0, b = 1) => Math.max(a, Math.min(b, v));
  const ease = v => 1 - Math.pow(1 - clamp(v), 3);
  const norm = s => String(s || '').normalize('NFKD').replace(/[\u0300-\u036f]/g, '').toLowerCase().replace(/[^a-z0-9]+/g, ' ').trim();
  const detect = (name, artist) => norm(artist) === 'true adam' && norm(name) === 'stalemate grief';
  const footage = { gameplay: null, edit: null };
  let active = null, failure = '', gpu;
  function video(id) {
    if (footage[id]) return footage[id];
    const v = document.createElement('video');
    v.muted = true; v.defaultMuted = true; v.playsInline = true; v.preload = 'auto';
    v.setAttribute('playsinline', ''); v.setAttribute('aria-hidden', 'true');
    v.src = 'media/grief/' + id + '.mp4';
    v.addEventListener('error', () => { failure = 'no se pudo cargar el gameplay'; });
    footage[id] = v;
    return v;
  }
  function timeline(time, duration = 146.365) {
    const d = Math.max(20, duration || 146.365), coda = d - 11.9, t = clamp(time, 0, d);
    return t >= coda ? { id: 'edit', at: Math.min(11.85, t - coda), rate: 1, coda, duration: d, progress: t / d }
      : { id: 'gameplay', at: t / coda * 170.7, rate: 170.7 / coda, coda, duration: d, progress: t / d };
  }
  function sync(cue, playing) {
    const v = video(cue.id);
    if (active !== cue.id) {
      if (active) footage[active]?.pause();
      active = cue.id;
    }
    if (v.readyState >= 1) {
      const at = Math.min(cue.at, Math.max(0, v.duration - .04));
      if (!v.seeking && Math.abs(v.currentTime - at) > (playing ? .22 : .035)) v.currentTime = at;
      v.playbackRate = clamp(cue.rate, .25, 4);
      if (playing && v.paused && !v.seeking) v.play().catch(() => {});
      else if (!playing && !v.paused) v.pause();
    }
    return v;
  }
  function stop() {
    for (const v of Object.values(footage)) if (v && !v.paused) v.pause();
    active = null;
  }
  // la ocultación del menú también suspende decodificación; el siguiente frame restablece el reloj.
  document.addEventListener('visibilitychange', () => { if (document.hidden) stop(); });
  function initGPU() {
    const c = document.createElement('canvas'); c.width = 1280; c.height = 720;
    const gl = c.getContext('webgl', { alpha: false, antialias: false, preserveDrawingBuffer: true });
    if (!gl) return null;
    const shader = (type, src) => {
      const s = gl.createShader(type); gl.shaderSource(s, src); gl.compileShader(s);
      if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) throw Error(gl.getShaderInfoLog(s));
      return s;
    };
    const p = gl.createProgram();
    gl.attachShader(p, shader(gl.VERTEX_SHADER, 'attribute vec2 a; varying vec2 uv; void main(){uv=(a+1.0)*.5;gl_Position=vec4(a,0.,1.);}'));
    gl.attachShader(p, shader(gl.FRAGMENT_SHADER, `precision mediump float;
      varying vec2 uv; uniform sampler2D image; uniform float pulse; uniform float reduced;
      void main(){
        vec2 p=vec2(uv.x,1.-uv.y); vec3 s=texture2D(image,p).rgb;
        float lum=dot(s,vec3(.299,.587,.114));
        float dotInk=smoothstep(.22,.48,length(fract(gl_FragCoord.xy/3.)-.5));
        vec3 ink=mix(vec3(.018,.009,.017),vec3(.48,.035,.065),smoothstep(.025,.20,lum));
        ink=mix(ink,vec3(.94,.23,.12),smoothstep(.20,.58,lum));
        ink=mix(ink,s*1.15,.38);
        float pink=clamp((s.b-s.g)*3.5,0.,1.);
        ink=mix(ink,s*1.2,pink*.9);
        ink=mix(ink,ink*.52,dotInk*.34);
        ink=mix(ink,vec3(.94,.86,.70),smoothstep(.72,.98,lum)*.78);
        float vignette=1.-.37*dot(uv-.5,uv-.5);
        gl_FragColor=vec4(ink*vignette*(1.+pulse*.07*(1.-reduced)),1.);
      }`));
    gl.linkProgram(p);
    if (!gl.getProgramParameter(p, gl.LINK_STATUS)) return null;
    gl.useProgram(p);
    const buf = gl.createBuffer(); gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1,-1,1,-1,-1,1,-1,1,1,-1,1,1]), gl.STATIC_DRAW);
    const a = gl.getAttribLocation(p, 'a'); gl.enableVertexAttribArray(a); gl.vertexAttribPointer(a, 2, gl.FLOAT, false, 0, 0);
    gl.bindTexture(gl.TEXTURE_2D, gl.createTexture());
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR); gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE); gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    c.addEventListener('webglcontextlost', e => { e.preventDefault(); gpu = null; });
    return { c, gl, p };
  }
  function texture(v, pulse, reduced) {
    if (gpu === undefined) { try { gpu = initGPU(); } catch (_) { gpu = null; } }
    if (!gpu) return v;
    try {
      const { gl, p, c } = gpu;
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE, v);
      gl.uniform1f(gl.getUniformLocation(p, 'pulse'), pulse);
      gl.uniform1f(gl.getUniformLocation(p, 'reduced'), reduced ? 1 : 0);
      gl.drawArrays(gl.TRIANGLES, 0, 6);
      return c;
    } catch (_) { gpu = null; return v; }
  }
  function render(ctx, w, h, time, opts = {}) {
    const cue = timeline(time, opts.duration), reduced = !!opts.reduced;
    const v = sync(cue, !!opts.playing && !document.hidden && !window.HOME?.on);
    // precarga el cierre sin reproducir su audio ni su imagen antes de tiempo.
    video('edit');
    const unit = Math.min(w / 1600, h / 900), m = 40 * unit;
    const beat = time * 135 / 60, pulse = reduced ? 0 : Math.pow(1 - beat % 1, 4);
    const end = cue.id === 'edit', intro = 1 - ease((time - 2.8) / 2.6);
    ctx.save(); ctx.globalAlpha = 1; ctx.globalCompositeOperation = 'source-over'; ctx.filter = 'none'; ctx.fillStyle = '#0b070c'; ctx.fillRect(0, 0, w, h);
    // trama de papel en el margen; la acción conserva toda su relación de aspecto.
    ctx.fillStyle = '#2d111b';
    for (let i = 8 * unit; i < w; i += 14 * unit) for (let j = 8 * unit; j < h; j += 14 * unit) {
      ctx.beginPath(); ctx.arc(i, j, .85 * unit, 0, Math.PI * 2); ctx.fill();
    }
    const top = 70 * unit, bottom = 82 * unit;
    let vh = Math.min(h - top - bottom, (w - m * 2) * (end ? 356 / 576 : 9 / 16));
    if (end) vh *= .86 + (reduced ? 0 : .025 * ease((time - cue.coda) / 8));
    const vw = vh * (end ? 576 / 356 : 16 / 9), vx = (w - vw) / 2, vy = top + (h - top - bottom - vh) / 2;
    ctx.fillStyle = '#aa2027'; ctx.fillRect(vx + 7 * unit, vy + 7 * unit, vw, vh);
    ctx.save(); ctx.beginPath(); ctx.rect(vx, vy, vw, vh); ctx.clip();
    if (v.readyState >= 2) {
      const zoom = reduced || end ? 1 : 1 + .006 * pulse;
      ctx.drawImage(texture(v, pulse, reduced), vx - vw * (zoom - 1) / 2, vy - vh * (zoom - 1) / 2, vw * zoom, vh * zoom);
    } else {
      ctx.fillStyle = '#19090f'; ctx.fillRect(vx, vy, vw, vh);
    }
    // velo editorial durante la entrada; sale antes del primer corredor largo.
    if (intro > 0) { ctx.fillStyle = `rgba(11,7,12,${intro * .6})`; ctx.fillRect(vx, vy, vw, vh); }
    ctx.restore();
    ctx.strokeStyle = '#b72d32'; ctx.lineWidth = unit; ctx.strokeRect(vx, vy, vw, vh);
    const txt = (s, px, py, size, color = '#eddfc0', align = 'left', display = false) => {
      ctx.textAlign = align; ctx.fillStyle = color;
      ctx.font = `${display ? 900 : 500} ${size * unit}px ${display ? '"Anybody", "Arial Narrow", sans-serif' : '"Martian Mono", monospace'}`;
      ctx.fillText(s, px, py);
    };
    txt('lumora / geometry dash', m, 37 * unit, 13);
    txt('stalemate · true adam', w - m, 37 * unit, 13, '#eddfc0', 'right');
    ctx.fillStyle = '#b72d32'; ctx.fillRect(m, 50 * unit, w - m * 2, unit);
    if (intro > .01) {
      ctx.save(); ctx.globalAlpha = intro;
      const size = Math.min(300, w / unit * .22);
      const y = h / 2 + 60 * unit + (reduced ? 0 : (1 - ease(time / 1.8)) * 35 * unit);
      txt('grief', w / 2 + 6 * unit, y + 7 * unit, size, '#941d28', 'center', true);
      txt('grief', w / 2, y, size, '#eddfc0', 'center', true);
      txt('lo imposible también termina.', w / 2, y + 50 * unit, 16, '#eddfc0', 'center');
      ctx.restore();
    }
    if (v.readyState < 2) txt(failure || 'preparando el homenaje…', w / 2, h / 2 + 140 * unit, 15, '#eddfc0', 'center');
    // acentos de doble registro en las fronteras de capítulo, siempre derivados del reloj.
    const chapterTime = time % (cue.coda / 5);
    const impact = !reduced && !end && time > 6 ? Math.max(0, 1 - chapterTime / .8) : 0;
    if (impact > 0) {
      ctx.save(); ctx.globalAlpha = impact * .65; ctx.strokeStyle = '#f0645a'; ctx.lineWidth = 3 * unit;
      const offset = 18 * unit * impact;
      ctx.strokeRect(vx - offset, vy - offset, vw + offset * 2, vh + offset * 2);
      ctx.restore();
    }
    const sections = ['umbral', 'descenso', 'presión', 'resistencia', 'el último tramo'];
    const chapter = Math.min(4, Math.floor(time / cue.coda * 5));
    txt(end ? 'epílogo / tu edit' : `0${chapter + 1} / ${sections[chapter]}`, m, h - 42 * unit, 13, '#e26963');
    txt(end ? 'homenaje a su verificación' : 'grief / un límite superado', w - m, h - 42 * unit, 13, '#eddfc0', 'right');
    ctx.fillStyle = '#38202a'; ctx.fillRect(m, h - 22 * unit, w - m * 2, 3 * unit);
    ctx.fillStyle = '#de3e3f'; ctx.fillRect(m, h - 22 * unit, (w - m * 2) * cue.progress, 3 * unit);
    // las marcas de imprenta enlazan el footage con la risografía de lumora.
    ctx.strokeStyle = '#eddfc0'; ctx.lineWidth = unit;
    for (const [cx, cy, sx, sy] of [[vx,vy,-1,-1],[vx+vw,vy,1,-1],[vx,vy+vh,-1,1],[vx+vw,vy+vh,1,1]]) {
      ctx.beginPath(); ctx.moveTo(cx+sx*8*unit,cy); ctx.lineTo(cx+sx*18*unit,cy); ctx.moveTo(cx,cy+sy*8*unit); ctx.lineTo(cx,cy+sy*18*unit); ctx.stroke();
    }
    ctx.restore();
    G.current = { ...cue, ready: v.readyState >= 2, sourceTime: v.currentTime, seeking: v.seeking, paused: v.paused };
  }
  const G = R.grief = { detect, timeline, render, stop, footage, current: null };
})();
