// ============================================================
// riso-xr.js — panorama 360° y visor WebXR mínimo (fase 9, experimental).
//   · RISOXR.panorama(escena) dibuja una escena ilustrada en equirectangular 2:1 (4096x2048) con las costuras unidas
//   · RISOXR.exportar(escena) la baja como PNG (se abre en cualquier visor 360°, Quest, Vision Pro, Facebook…)
//   · ?xr=1&escena=bosque abre un visor a pantalla completa: arrastra para mirar; si el navegador tiene WebXR
//     aparece «entrar en VR» y se ve dentro de la esfera con las vistas del visor (solo cabeza, sin controles)
// WebGL crudo, sin librerías. El modo VR no se puede probar sin visor: ver docs/PENDIENTE-MAC.md.
// ============================================================
(() => {
  const R = window.RISO, EXP = window.RISOEXP; if (!R) return;
  const XR = window.RISOXR = { w: 4096, seam: .12 };
  const scenes = () => R.order.filter(id => !['clip', 'exp', 'poster'].includes(id));
  XR.scenes = scenes;

  // ---------- panorama ----------
  XR.panorama = function (id, w = XR.w) {
    id = R.scenes[id] ? id : 'bosque'; const sc = R.scenes[id], h = Math.round(w / 2);
    const state = sc.make(R.rng(hash(id)), R.K) || {};
    const cv = EXP.paint(w, h, sc.inks ?? 0, (K) => { K.c.save(); try { sc.draw(K, state, 5, .016, R.A); } finally { K.c.restore(); } }, {});
    const out = document.createElement('canvas'); out.width = w; out.height = h; const g = out.getContext('2d'); g.drawImage(cv, 0, 0);
    // costura: el borde derecho se funde con el espejo del izquierdo, así el píxel 0 y el último son el mismo
    const b = Math.round(w * XR.seam), band = document.createElement('canvas'); band.width = b; band.height = h; const bg = band.getContext('2d');
    bg.save(); bg.translate(b, 0); bg.scale(-1, 1); bg.drawImage(out, 0, 0, b, h, 0, 0, b, h); bg.restore();
    bg.globalCompositeOperation = 'destination-in'; const gr = bg.createLinearGradient(0, 0, b, 0); gr.addColorStop(0, 'rgba(0,0,0,0)'); gr.addColorStop(1, 'rgba(0,0,0,1)'); bg.fillStyle = gr; bg.fillRect(0, 0, b, h);
    g.drawImage(band, w - b, 0);
    out.id_ = id; return out;
  };
  const hash = s => { let h = 2166136261; for (const c of String(s)) h = Math.imul(h ^ c.charCodeAt(0), 16777619); return h >>> 0; };
  XR.exportar = async function (id, w) {
    const cv = XR.panorama(id, w), blob = await new Promise(ok => cv.toBlob(ok, 'image/png')), nm = `lumora-360-${cv.id_}.png`;
    const u = URL.createObjectURL(blob), a = document.createElement('a'); a.href = u; a.download = nm; a.click(); setTimeout(() => URL.revokeObjectURL(u), 8000); return { nombre: nm, bytes: blob.size, w: cv.width, h: cv.height };
  };

  // ---------- visor ----------
  const VS = 'attribute vec3 p; attribute vec2 t; uniform mat4 uP, uV; varying vec2 v; void main(){ v = t; gl_Position = uP * uV * vec4(p, 1.); }';
  const FS = 'precision mediump float; varying vec2 v; uniform sampler2D uT; void main(){ gl_FragColor = texture2D(uT, v); }';
  const mat = { persp(fov, asp, n, f) { const t = 1 / Math.tan(fov / 2); return [t / asp, 0, 0, 0, 0, t, 0, 0, 0, 0, (f + n) / (n - f), -1, 0, 0, 2 * f * n / (n - f), 0]; },
    view(yaw, pit) { const cy = Math.cos(yaw), sy = Math.sin(yaw), cp = Math.cos(pit), sp = Math.sin(pit); // rotación inversa: primero yaw (Y), luego pitch (X)
      return [cy, sy * sp, -sy * cp, 0, 0, cp, sp, 0, sy, -cy * sp, cy * cp, 0, 0, 0, 0, 1]; } };
  XR.visor = async function (id) {
    if (XR.el) XR.el.remove();
    const el = XR.el = document.createElement('div'); el.id = 'xrView'; el.style.cssText = 'position:fixed;inset:0;z-index:60;background:#0b0d22;touch-action:none;';
    const cv = document.createElement('canvas'); cv.style.cssText = 'position:absolute;inset:0;width:100%;height:100%;cursor:grab;display:block;'; el.append(cv);
    const bar = document.createElement('div'); bar.style.cssText = "position:absolute;left:16px;top:14px;display:flex;gap:10px;align-items:center;font:600 13px 'Martian Mono',monospace;letter-spacing:.06em;text-transform:uppercase;color:#faf3e4;text-shadow:0 1px 4px #000;"; el.append(bar);
    const info = document.createElement('span'); bar.append(info);
    const mk = (t, f) => { const b = document.createElement('button'); b.textContent = t; b.style.cssText = "padding:8px 12px;border:3px solid #faf3e4;background:#212b80;color:#faf3e4;font:700 12px 'Anybody',sans-serif;text-transform:uppercase;cursor:pointer;"; b.onclick = f; bar.append(b); return b; };
    document.body.append(el);
    const gl = cv.getContext('webgl', { antialias: true, xrCompatible: true }); if (!gl) { info.textContent = 'sin webgl'; return XR; }
    const pr = gl.createProgram(); for (const [ty, src] of [[gl.VERTEX_SHADER, VS], [gl.FRAGMENT_SHADER, FS]]) { const s = gl.createShader(ty); gl.shaderSource(s, src); gl.compileShader(s); gl.attachShader(pr, s); } gl.linkProgram(pr); gl.useProgram(pr);
    const N = 48, M = 96, pos = [], uv = [], idx = [];
    for (let i = 0; i <= N; i++) for (let j = 0; j <= M; j++) { const th = i / N * Math.PI, ph = j / M * Math.PI * 2; pos.push(-Math.sin(th) * Math.sin(ph), Math.cos(th), -Math.sin(th) * Math.cos(ph)); uv.push(j / M, i / N); }
    for (let i = 0; i < N; i++) for (let j = 0; j < M; j++) { const a = i * (M + 1) + j, b = a + M + 1; idx.push(a, b, a + 1, b, b + 1, a + 1); }
    const buf = (d, loc, n) => { const b = gl.createBuffer(); gl.bindBuffer(gl.ARRAY_BUFFER, b); gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(d), gl.STATIC_DRAW); const l = gl.getAttribLocation(pr, loc); gl.enableVertexAttribArray(l); gl.vertexAttribPointer(l, n, gl.FLOAT, false, 0, 0); };
    buf(pos, 'p', 3); buf(uv, 't', 2); const ib = gl.createBuffer(); gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, ib); gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(idx), gl.STATIC_DRAW);
    const pano = XR.panorama(id), tex = gl.createTexture(); gl.bindTexture(gl.TEXTURE_2D, tex);
    gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true); gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, pano);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR); gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR); gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.REPEAT); gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    const uP = gl.getUniformLocation(pr, 'uP'), uV = gl.getUniformLocation(pr, 'uV');
    XR.state = { yaw: 0, pit: 0, fov: 1.6, id: pano.id_, gl, xr: false, frames: 0 }; const S = XR.state;
    const draw = (vm, pm) => { gl.uniformMatrix4fv(uP, false, pm); gl.uniformMatrix4fv(uV, false, vm); gl.drawElements(gl.TRIANGLES, idx.length, gl.UNSIGNED_SHORT, 0); S.frames++; };
    const flat = () => { if (S.xr) return; const w = cv.clientWidth * Math.min(2, devicePixelRatio || 1), h = cv.clientHeight * Math.min(2, devicePixelRatio || 1); if (cv.width !== w) cv.width = w; if (cv.height !== h) cv.height = h; gl.bindFramebuffer(gl.FRAMEBUFFER, null); gl.viewport(0, 0, cv.width, cv.height); gl.disable(gl.CULL_FACE); gl.clearColor(0, 0, 0, 1); gl.clear(gl.COLOR_BUFFER_BIT);
      draw(mat.view(S.yaw, S.pit), mat.persp(S.fov, cv.width / cv.height, .1, 10)); S.raf = requestAnimationFrame(flat); };
    let drag = null; cv.addEventListener('pointerdown', e => { drag = [e.clientX, e.clientY, S.yaw, S.pit]; cv.setPointerCapture(e.pointerId); cv.style.cursor = 'grabbing'; });
    cv.addEventListener('pointermove', e => { if (!drag) return; const k = S.fov / cv.clientHeight; S.yaw = drag[2] - (e.clientX - drag[0]) * k; S.pit = Math.max(-1.45, Math.min(1.45, drag[3] - (e.clientY - drag[1]) * k)); });
    cv.addEventListener('pointerup', () => { drag = null; cv.style.cursor = 'grab'; });
    cv.addEventListener('wheel', e => { e.preventDefault(); S.fov = Math.max(.6, Math.min(2.0, S.fov + e.deltaY * .001)); }, { passive: false });
    const ids = scenes(); const sel = document.createElement('select'); sel.style.cssText = "padding:7px;border:3px solid #faf3e4;background:#212b80;color:#faf3e4;font:700 12px 'Anybody',sans-serif;text-transform:uppercase;"; ids.forEach(s => { const o = document.createElement('option'); o.value = s; o.textContent = R.scenes[s].name; sel.append(o); }); sel.value = pano.id_; sel.onchange = () => XR.visor(sel.value); bar.append(sel);
    mk('cerrar', () => { cancelAnimationFrame(S.raf); el.remove(); XR.el = null; });
    info.textContent = 'arrastra para mirar · rueda para acercar';
    // WebXR: solo si existe; si no, el visor plano sigue funcionando
    let vr = null; if (navigator.xr && navigator.xr.isSessionSupported) { try { if (await navigator.xr.isSessionSupported('immersive-vr')) vr = mk('entrar en VR', enterVR); } catch (e) {} }
    if (!vr) { const n = document.createElement('span'); n.textContent = navigator.xr ? '· sin visor VR disponible' : '· este navegador no tiene WebXR'; n.style.opacity = '.75'; bar.append(n); }
    async function enterVR() {
      try { const ses = await navigator.xr.requestSession('immersive-vr'); await gl.makeXRCompatible(); cancelAnimationFrame(S.raf); S.xr = true; ses.updateRenderState({ baseLayer: new XRWebGLLayer(ses, gl) });
        const ref = await ses.requestReferenceSpace('local'); ses.addEventListener('end', () => { S.xr = false; gl.bindFramebuffer(gl.FRAMEBUFFER, null); flat(); });
        const loop = (t, fr) => { ses.requestAnimationFrame(loop); const pose = fr.getViewerPose(ref); if (!pose) return; const L = ses.renderState.baseLayer; gl.bindFramebuffer(gl.FRAMEBUFFER, L.framebuffer); gl.clearColor(0, 0, 0, 1); gl.clear(gl.COLOR_BUFFER_BIT);
          for (const v of pose.views) { const vp = L.getViewport(v); gl.viewport(vp.x, vp.y, vp.width, vp.height); const m = Array.from(v.transform.inverse.matrix); m[12] = m[13] = m[14] = 0; draw(m, v.projectionMatrix); } };
        ses.requestAnimationFrame(loop); } catch (e) { info.textContent = 'no se pudo entrar en VR: ' + e.message; }
    }
    flat(); return XR;
  };

  // ?xr=1 abre el visor directo
  const q = new URLSearchParams(location.search);
  if (q.get('xr') === '1') addEventListener('load', () => setTimeout(() => XR.visor(q.get('escena') || 'bosque'), 1800));

  if (window.SETUI) {
    const cur = () => { const s = R.stage.sceneId; return scenes().includes(s) ? s : 'bosque'; };
    SETUI.addRow('imagen', ['xrExport', 'Exportar panorama 360°', 'btn', { texto: 'guardar png', fn: () => XR.exportar(cur()) }, 'experimental: la escena de fondo como imagen equirectangular 4096×2048, para visores 360° y de realidad virtual']);
    SETUI.addRow('imagen', ['xrVisor', 'Visor 360° / VR', 'btn', { texto: 'abrir visor', fn: () => XR.visor(cur()) }, 'experimental: mira la escena por dentro; con WebXR (Quest, Vision Pro) aparece «entrar en VR». También con ?xr=1']);
  }
})();
