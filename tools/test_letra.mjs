// la letra cabe en el encuadre y no pisa la traducción (con peso, lados, tamaños y versos largos). Capturas /tmp/letra-*.jpg
import { servidor, abrir, mock, espera, BASE } from './lib.mjs';
const srv = await servidor(); await mock('scn=normal');
const { b, p, errores } = await abrir(1280, 800);
let ok = true; const chk = (n, c, x) => { console.log((c ? 'ok    ' : 'FALLA ') + n + (x ? '  ' + x : '')); if (!c) ok = false; };
await p.goto(BASE + '/index.html?menu=0'); await espera(6000); await mock('song=a&pos=30'); await espera(4000);
const LARGO = 'Cada vez que yo me doy un look bacano, que me gusta, yo digo: "guau, qué estilazo tengo" y nadie me lo quita';
const TR = 'Every time I give myself a cool look that I like, I say: "wow, what a style I have" and nobody takes it from me';
// mide dónde caen los textos: envuelve K.txt y K.measure para registrar los cuadros que se escriben
const r = await p.evaluate(({ LARGO, TR }) => {
  paused = true; const RC = RISOCLIP, st = RISO.stage, K = RISO.K, out = [];
  for (const cfg of [{ lyricSize: 1, peso: true }, { lyricSize: 1.6, peso: true }, { lyricSize: 1, peso: false }, { lyricSize: .7, peso: true }]) {
    CFG.lyricSize = cfg.lyricSize; CFG.fxCine = { tinta: true, papel: true, peso: cfg.peso, taller: true };
    for (const kind of ['prop', 'scene', 'giant']) for (const flip of [false, true]) {
      const li = RC.h.lineIdx(RC.h.timeNow()); let s = null; for (let i = 0; i < 60 && !(s && s.kind === kind); i++) s = RC.makeShot(li, 0, 30, '');
      if (!s) continue; s.flip = flip; s.k0 = K.t - 5; s.text = { li, t: RC.h.timeNow() - 4 - (IN.off || 0), text: LARGO, dur: 8, tr: TR }; RC.shot = s; st.cut = null; RC.pending = null;
      const boxes = []; const tx = K.txt.bind(K); K.txt = function (str, x, y, o = {}) { const w = K.measure(str, o), al = o.align || 'left', l = al === 'center' ? x - w / 2 : al === 'right' ? x - w : x; boxes.push({ str, l, r: l + w, y, size: o.size || 40 }); return tx(str, x, y, o); };
      RC.frame(0); K.txt = tx; const v = K.v;
      // palabras de la letra original (tinta a mano o imprenta grande) que se salen del cuadro visible
      const fuera = boxes.filter(b => b.str && /[a-záéíóú]/i.test(b.str) && b.size >= 30 && (b.l < v.l - 1 || b.r > v.r + 1));
      out.push({ kind, flip, size: cfg.lyricSize, peso: cfg.peso, fuera: fuera.map(b => b.str + '@' + Math.round(b.r)).slice(0, 3), v: [Math.round(v.l), Math.round(v.r)] });
    }
  }
  return out;
}, { LARGO, TR });
const malos = r.filter(x => x.fuera.length);
chk('(a) ninguna palabra se sale del encuadre (prop, escena, gigante; ambos lados; tamaños; con y sin peso)', malos.length === 0, JSON.stringify(malos.slice(0, 4)) + ' de ' + r.length);
// (b) la caja de la traducción no pisa el verso original
const solapa = await p.evaluate(({ LARGO, TR }) => {
  const RC = RISOCLIP, st = RISO.stage, K = RISO.K, res = [];
  CFG.lyricSize = 1; CFG.fxCine = { tinta: true, papel: true, peso: true, taller: true };
  for (const kind of ['prop', 'scene', 'giant']) for (const flip of [false, true]) {
    const li = RC.h.lineIdx(RC.h.timeNow()); let s = null; for (let i = 0; i < 60 && !(s && s.kind === kind); i++) s = RC.makeShot(li, 0, 30, '');
    if (!s) continue; s.flip = flip; s.k0 = K.t - 5; s.text = { li, t: RC.h.timeNow() - 4 - (IN.off || 0), text: LARGO, dur: 8, tr: TR }; RC.shot = s; st.cut = null; RC.pending = null;
    const rects = [], txts = []; const rc = K.rect.bind(K), tx = K.txt.bind(K);
    K.rect = function (x, y, w, h, o = {}) { if (o.f === -1 && o.s === 1 && (o.lw === 3.5 || o.lw === 4)) rects.push({ x, y, w, h }); return rc(x, y, w, h, o); };
    K.txt = function (str, x, y, o = {}) { const w = K.measure(str, o), al = o.align || 'left', l = al === 'center' ? x - w / 2 : al === 'right' ? x - w : x; if (/[a-z]{3}/i.test(str) && (o.size || 40) >= 30) txts.push({ str, l, r: l + w, t: y - (o.size || 40) * .8, b: y + (o.size || 40) * .2, font: o.font }); return tx(str, x, y, o); };
    RC.frame(0); K.rect = rc; K.txt = tx;
    // letra original = texto con LARGO; la caja de traducción = rectángulo papel con tinta 1 cuyo texto es de la traducción
    const orig = txts.filter(t => !/\s/.test(t.str.trim())), trt = txts.filter(t => /\s/.test(t.str.trim()));   // el verso se escribe palabra a palabra; la traducción, línea a línea
    const inter = orig.filter(o => trt.some(q => o.l < q.r && o.r > q.l && o.t < q.b && o.b > q.t)).map(o => o.str);
    res.push({ kind, flip, inter: inter.slice(0, 3) });
  } return res;
}, { LARGO, TR });
const pisa = solapa.filter(x => x.inter.length);
chk('(b) la traducción no se monta sobre el verso original', pisa.length === 0, JSON.stringify(pisa.slice(0, 3)));
for (const [k, n] of [['prop', 'prop'], ['scene', 'escena'], ['giant', 'gigante']]) {
  await p.evaluate(({ LARGO, TR, k }) => { const RC = RISOCLIP, st = RISO.stage, K = RISO.K; CFG.lyricSize = 1; const li = RC.h.lineIdx(RC.h.timeNow()); let s = null; for (let i = 0; i < 60 && !(s && s.kind === k); i++) s = RC.makeShot(li, 0, 30, ''); s.flip = true; s.k0 = K.t - 5; s.text = { li, t: RC.h.timeNow() - 4 - (IN.off || 0), text: LARGO, dur: 8, tr: TR }; RC.shot = s; st.cut = null; RC.pending = null; RC.frame(0); }, { LARGO, TR, k });
  await espera(250); await p.screenshot({ path: `/tmp/letra-${n}.jpg`, type: 'jpeg', quality: 80 });
}
chk('sin errores de consola', errores.length === 0, errores.join(' | '));
await b.close(); srv.stop(); process.exit(ok ? 0 : 1);
