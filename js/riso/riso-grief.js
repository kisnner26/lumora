// montaje de grief: cortes por compases, rampas, cámara y tinta en gpu.
(() => {
  'use strict';
  const R = window.RISO;
  if (!R) return;
  const clamp = (v, a = 0, b = 1) => Math.max(a, Math.min(b, v));
  const ease = v => 1 - Math.pow(1 - clamp(v), 3);
  const norm = s => String(s || '').normalize('NFKD').replace(/[\u0300-\u036f]/g, '').toLowerCase().replace(/[^a-z0-9]+/g, ' ').trim();
  const detect = (name, artist, id = '') => id === '4uwxWWxb6zPMrNsK13VErG' || id === 'spotify:episode:4uwxWWxb6zPMrNsK13VErG' || norm(name) === 'pop culture madeon mix' || (norm(artist) === 'true adam' && norm(name) === 'stalemate grief');
  const footage = { gameplay: null, edit: null, hyperframes: null };
  let active = null, failure = '', gpu;
  function video(id) {
    if (footage[id]) return footage[id];
    const v = document.createElement('video');
    v.muted = true; v.defaultMuted = true; v.playsInline = true; v.preload = 'auto';
    v.setAttribute('playsinline', ''); v.setAttribute('aria-hidden', 'true');
    v.src = 'media/grief/' + id + '.mp4';
    v.addEventListener('error', () => { if (id !== 'hyperframes') failure = 'no se pudo cargar el gameplay'; });
    footage[id] = v;
    return v;
  }
  const BPM = 135, BEAT = 60 / BPM;
  // Planos escogidos del showcase: avances y reprises, no un recorrido estirado.
  const sources = [4, 14.8, 9.3, 50.9, 53.3, 14.8, 59.3, 61, 50.9, 69, 61, 86.2, 98.9, 105.6, 98.9, 122.3, 105.6, 130.2, 122.3, 136.7, 136.7, 130.2, 165, 165.7];
  function ramp(local, length) {
    const attack = .22, fast = 2.5, slow = .65, finish = 1.35;
    if (local < attack) return { distance: fast * local + (slow - fast) * local * local / (2 * attack), rate: fast + (slow - fast) * local / attack };
    const t = local - attack, span = Math.max(.01, length - attack);
    return { distance: (fast + slow) * attack / 2 + slow * t + (finish - slow) * t * t / (2 * span), rate: slow + (finish - slow) * t / span };
  }
  function timeline(time, duration = 146.365) {
    const d = Math.max(20, duration || 146.365), coda = d - 11.9, t = clamp(time, 0, d);
    if (t >= coda) return { id: 'edit', at: Math.min(11.85, t - coda), rate: 1, coda, duration: d, progress: t / d, shot: -1, local: t - coda, length: 11.9, phase: 1 };
    let start = 0, shot = 0, length;
    while (true) {
      const beats = start < 7 ? 16 : start < 35 ? 8 : start < 108 ? 4 : 8;
      length = Math.min(beats * BEAT, coda - start);
      if (t < start + length || length <= 0) break;
      start += length; shot++;
    }
    const local = t - start, speed = ramp(local, length);
    // Repartir el catálogo de planos por toda la canción conserva los cambios de sección.
    const base = Math.floor(start / coda * (sources.length - 1));
    const source = sources[Math.min(sources.length - 1, base + (shot % 7 === 5 ? 1 : 0))];
    return { id: 'gameplay', at: Math.min(170.65, source + speed.distance), rate: speed.rate, coda, duration: d, progress: t / d, shot, local, length, phase: local / length };
  }
  function treatment(cue, reduced = false) {
    if (cue.id === 'edit') return { zoom: 1, rotation: 0, x: 0, y: 0, blur: 0, split: 0, mono: 0, panels: false, impact: 0 };
    const direction = cue.shot % 2 ? -1 : 1;
    const impact = Math.pow(1 - clamp(cue.local / .24), 3);
    const release = Math.pow(clamp((cue.local - cue.length + .18) / .18), 2);
    const mono = cue.shot % 6 === 1 || cue.shot % 6 === 4 ? 1 : 0;
    if (reduced) return { zoom: 1.08, rotation: 0, x: 0, y: 0, blur: 0, split: 0, mono, panels: false, impact: 0 };
    return {
      zoom: 1.12 + .16 * cue.phase + .34 * impact + .18 * release,
      rotation: direction * (.018 * (1 - cue.phase) + .065 * impact - .04 * release),
      x: direction * (.025 * Math.sin(cue.phase * Math.PI) + .065 * release),
      y: .015 * Math.sin(cue.phase * Math.PI * 2),
      blur: Math.max(impact, release), split: .006 * Math.max(impact, release), mono,
      panels: cue.shot > 4 && cue.shot % 9 === 7, impact,
    };
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
      varying vec2 uv; uniform sampler2D image; uniform float pulse; uniform float reduced; uniform float mono; uniform float smear; uniform float split;
      void main(){
        vec2 p=vec2(uv.x,1.-uv.y); vec3 s=vec3(0.);
        // zoom radial acotado: siete muestras de la misma fuente y reloj.
        for(int i=0;i<7;i++) {
          vec2 q=(p-.5)*(1.-smear*float(i)*.018)+.5;
          s+=vec3(texture2D(image,q+vec2(split,0.)).r,texture2D(image,q).g,texture2D(image,q-vec2(split,0.)).b)/7.;
        }
        float lum=dot(s,vec3(.299,.587,.114));
        float screen=smoothstep(.17,.48,length(fract(gl_FragCoord.xy/3.)-.5));
        vec3 ink=pow(max(s,vec3(0.)),vec3(.78))*1.22;
        float red=clamp((s.r-s.g)*3.,0.,1.);
        ink=mix(ink,vec3(ink.r,ink.g*.45,ink.b*.55),red*.65);
        float printLight=smoothstep(.035,.55,lum);
        vec3 paper=vec3(printLight*(1.-screen*.68));
        ink=mix(ink,paper,mono);
        float vignette=1.-.8*dot(uv-.5,uv-.5);
        gl_FragColor=vec4(ink*vignette*(1.+pulse*.055*(1.-reduced)),1.);
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
  function texture(v, pulse, reduced, look) {
    if (gpu === undefined) { try { gpu = initGPU(); } catch (_) { gpu = null; } }
    if (!gpu) return v;
    try {
      const { gl, p, c } = gpu;
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE, v);
      gl.uniform1f(gl.getUniformLocation(p, 'pulse'), pulse);
      gl.uniform1f(gl.getUniformLocation(p, 'reduced'), reduced ? 1 : 0);
      gl.uniform1f(gl.getUniformLocation(p, 'mono'), look.mono);
      gl.uniform1f(gl.getUniformLocation(p, 'smear'), look.blur);
      gl.uniform1f(gl.getUniformLocation(p, 'split'), look.split);
      gl.drawArrays(gl.TRIANGLES, 0, 6);
      return c;
    } catch (_) { gpu = null; return v; }
  }
  function render(ctx, w, h, time, opts = {}) {
    const hf = video('hyperframes');
    const useHF = !opts.reduced && hf.readyState >= 1 && Number.isFinite(hf.duration) && hf.duration > 12;
    const total = opts.duration || hf.duration;
    const body = Math.max(1, hf.duration - 11.9);
    const at = total - time <= 11.9 ? hf.duration - Math.max(0, total - time) : time % body;
    const cue = useHF ? { id: 'hyperframes', at: Math.max(0, Math.min(hf.duration - .04, at)), rate: 1 } : timeline(time, opts.duration);
    const reduced = !!opts.reduced, look = useHF ? { zoom: 1, rotation: 0, x: 0, y: 0, panels: false } : treatment(cue, reduced);
    const v = sync(cue, !!opts.playing && !document.hidden && !window.HOME?.on);
    video('edit');
    const unit = Math.min(w / 1600, h / 900), end = cue.id === 'edit';
    const pulse = reduced ? 0 : Math.pow(1 - (time / BEAT) % 1, 4);
    ctx.save(); ctx.globalAlpha = 1; ctx.globalCompositeOperation = 'source-over'; ctx.filter = 'none';
    ctx.fillStyle = '#030204'; ctx.fillRect(0, 0, w, h);
    // imagen a pantalla completa, sin rótulos permanentes sobre el recorrido.
    const ratio = end ? 576 / 356 : 16 / 9;
    const vh = Math.min(h, w / ratio), vw = vh * ratio, vx = (w - vw) / 2, vy = (h - vh) / 2;
    ctx.save(); ctx.beginPath(); ctx.rect(vx, vy, vw, vh); ctx.clip();
    if (v.readyState >= 2) {
      const image = end || useHF ? v : texture(v, pulse, reduced, look);
      const draw = (cx, cy, width, height, mirror = false) => {
        ctx.save(); ctx.translate(cx + look.x * width, cy + look.y * height);
        ctx.rotate(look.rotation); ctx.scale((mirror ? -1 : 1) * look.zoom, look.zoom);
        ctx.drawImage(image, -width / 2, -height / 2, width, height); ctx.restore();
      };
      if (look.panels) {
        // díptico espejo durante un plano completo.
        for (let i = 0; i < 2; i++) {
          ctx.save(); ctx.beginPath(); ctx.rect(vx + i * vw / 2, vy, vw / 2, vh); ctx.clip();
          draw(vx + (i + .5) * vw / 2, vy + vh / 2, vw, vh, i === 1); ctx.restore();
        }
      } else draw(vx + vw / 2, vy + vh / 2, vw, vh);
    }
    // obturación negra breve en los cortes.
    if (!useHF && !end && !reduced && cue.local < .065 && cue.shot > 0) {
      ctx.fillStyle = `rgba(0,0,0,${.7 * (1 - cue.local / .065)})`; ctx.fillRect(vx, vy, vw, vh);
    }
    ctx.restore();
    const intro = useHF ? 0 : 1 - ease((time - 1.3) / 1.1);
    if (intro > .01) {
      ctx.save(); ctx.globalAlpha = intro;
      ctx.fillStyle = 'rgba(3,2,4,.52)'; ctx.fillRect(0, 0, w, h);
      ctx.translate(w / 2, h / 2); ctx.rotate(reduced ? 0 : -.06 + .035 * ease(time / 2));
      ctx.textAlign = 'center'; ctx.font = `900 ${Math.min(280 * unit, w * .25)}px "Anybody", "Arial Narrow", sans-serif`;
      ctx.fillStyle = '#7e0714'; ctx.fillText('GRIEF', 9 * unit, 22 * unit);
      ctx.strokeStyle = '#ee3043'; ctx.lineWidth = 1.5 * unit; ctx.strokeText('GRIEF', 0, 12 * unit);
      ctx.font = `500 ${13 * unit}px "Martian Mono", monospace`;
      ctx.fillStyle = '#d5bdc0'; ctx.fillText(opts.title || 'stalemate / true adam', 0, 64 * unit); ctx.restore();
    }
    if (v.readyState < 2) {
      ctx.textAlign = 'center'; ctx.font = `${15 * unit}px monospace`; ctx.fillStyle = '#cbaeb3';
      ctx.fillText(failure || 'preparando el montaje…', w / 2, h / 2 + 140 * unit);
    }
    ctx.restore();
    if (opts.text) {
      ctx.save();
      ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
      ctx.font = `700 ${Math.max(22, Math.min(44 * unit, w / 30))}px "Anybody", sans-serif`;
      const width = Math.min(w * .86, ctx.measureText(opts.text).width + 56 * unit);
      const y = h * .87;
      ctx.fillStyle = 'rgba(8,3,7,.82)'; ctx.fillRect((w - width) / 2, y - 34 * unit, width, 68 * unit);
      ctx.fillStyle = '#e5233f'; ctx.fillRect((w - width) / 2, y + 32 * unit, width, 3 * unit);
      ctx.fillStyle = '#f3dfe3'; ctx.fillText(opts.text, w / 2, y, w * .82);
      ctx.restore();
    }
    G.current = { ...cue, look, ready: v.readyState >= 2, sourceTime: v.currentTime, seeking: v.seeking, paused: v.paused };
  }
  const G = R.grief = { detect, timeline, treatment, render, stop, footage, current: null };
})();
