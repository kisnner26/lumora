// efectos de cine (fase 5): tinta líquida, papel rasgado, palabras con peso y taller de impresión.
// Congela el tiempo (paused) y coloca cada corte en fases fijas. Capturas en /tmp/fx-*.jpg
import { servidor, abrir, mock, espera, BASE } from './lib.mjs';
const srv = await servidor(); await mock('scn=normal');
const { b, p, errores } = await abrir();
let ok = true; const chk = (n, c, x) => { console.log((c ? 'ok    ' : 'FALLA ') + n + (x ? '  ' + x : '')); if (!c) ok = false; };
await p.goto(BASE + '/index.html?menu=0'); await espera(9000);
const shot = name => p.screenshot({ path: `/tmp/fx-${name}.jpg`, type: 'jpeg', quality: 80 });
await p.evaluate(() => { paused = true; });
// (a)(b) cortes de tinta y de papel en cuatro fases
for (const kind of ['ink', 'tear']) {
  await p.evaluate(k => { const st = RISO.stage; st.cut = null; st.cutTo(() => {}, k); }, kind);
  for (const [name, t] of [['out-mitad', .28], ['out-casi', .53], ['in-inicio', .62], ['in-mitad', .95]]) {
    await p.evaluate(t2 => { const c = RISO.stage.cut; c.hold = true; c.t = t2; RISOCLIP.frame(0); }, t); await espera(200); await shot(`${kind}-${name}`);
  }
  const r = await p.evaluate(() => { const c = RISO.stage.cut; return c ? { ph: c.ph, kind: c.kind } : null; });
  chk(`(${kind}) el corte está activo y llegó a la fase de entrada`, r && r.ph === 'in', JSON.stringify(r));
  await p.evaluate(() => { RISO.stage.cut = null; });
}
// (c) el corte termina y la toma nueva queda
await p.evaluate(() => { const st = RISO.stage; st.cut = null; let swapped = 0; window.__sw = () => swapped; st.cutTo(() => { swapped = 1; }, 'ink'); window.__c = st.cut; st.cut.t = 1.3; st.cut.hold = true; RISOCLIP.frame(0); st.cut && (st.cut.hold = false); });
await espera(100); await p.evaluate(() => { const c = RISO.stage.cut; if (c) { c.hold = false; c.t = 5; } RISOCLIP.frame(0); });
const sw = await p.evaluate(() => ({ s: __sw(), done: RISO.stage.cut !== __c }));
chk('(c) al pasar la mitad se cambia la toma (swap) y luego el corte se limpia', sw.s === 1 && sw.done, JSON.stringify(sw));
// (d) palabras con peso: la palabra clave golpea y sacude la cámara
const kick = await p.evaluate(() => { paused = false; RISO.fx.hits.clear(); const st = RISO.stage; st.kick = 0; RISO.fx.slam('t|w'); return st.kick; });
chk('(d) el golpe de una palabra sacude la cámara', kick > .5, String(kick)); await espera(1500);
const k2 = await p.evaluate(() => RISO.stage.kick); chk('(d) y el golpe se apaga solo', k2 < .05, String(k2));
const again = await p.evaluate(() => { RISO.stage.kick = 0; RISO.fx.slam('t|w'); return RISO.stage.kick; }); chk('(d) la misma palabra no golpea dos veces', again === 0, String(again));
// (e) taller de impresión: la portada se imprime pasada por pasada
await p.evaluate(() => { paused = true; const s = RISOCLIP.shot; RISOCLIP.shot = { ...s, kind: 'title', k0: RISO.K.t - .2 }; RISO.stage.cut = null; RISOCLIP.frame(0); });
let pass = await p.evaluate(() => RISO.stage.pass.map(v => +v.toFixed(2))); chk('(e) al inicio solo entra la primera tinta', pass[0] > 0 && pass[1] === 0 && pass[2] === 0, JSON.stringify(pass)); await shot('taller-1');
await p.evaluate(() => { RISOCLIP.shot.k0 = RISO.K.t - .75; RISOCLIP.frame(0); }); pass = await p.evaluate(() => RISO.stage.pass.map(v => +v.toFixed(2))); chk('(e) después entra la segunda', pass[0] === 1 && pass[1] > 0 && pass[2] === 0, JSON.stringify(pass)); await shot('taller-2');
await p.evaluate(() => { RISOCLIP.shot.k0 = RISO.K.t - 2; RISOCLIP.frame(0); }); pass = await p.evaluate(() => RISO.stage.pass.map(v => +v.toFixed(2))); chk('(e) al final las tres', pass.every(v => v === 1), JSON.stringify(pass)); await espera(150); await shot('taller-3');
// (f) apagar cada efecto
await p.evaluate(() => { CFG.fxCine = { tinta: false, papel: false, peso: false, taller: false }; RISOCLIP.shot.k0 = RISO.K.t - .2; RISOCLIP.frame(0); });
pass = await p.evaluate(() => RISO.stage.pass); chk('(f) con «taller» apagado la portada sale completa', pass.every(v => v === 1), JSON.stringify(pass));
const pk = await p.evaluate(() => RISO.fx.pickCut({ mood: 'rabioso' }, { kind: 'prop' })); chk('(f) con tinta y papel apagados no se elige ninguno', pk === null, String(pk));
await p.evaluate(() => { CFG.fxCine = { tinta: true, papel: true, peso: true, taller: true }; CFG.transitions = 'ninguna'; });
let n = 0; for (let i = 0; i < 40; i++) if (await p.evaluate(() => RISO.fx.pickCut({ mood: 'rabioso' }, { kind: 'prop' }))) n++; chk('(f) con transiciones en «ninguna» tampoco', n === 0, String(n));
await p.evaluate(() => { CFG.transitions = 'todas'; });
const kinds = new Set(); for (let i = 0; i < 80; i++) kinds.add(await p.evaluate(m => RISO.fx.pickCut({ mood: m }, { kind: 'prop' }), i % 2 ? 'rabioso' : 'nostalgico')); chk('(f) con todo encendido salen los dos cortes', kinds.has('ink') && kinds.has('tear'), [...kinds].join(','));
chk('sin errores de consola', errores.length === 0, errores.join(' | '));
await b.close(); srv.stop(); process.exit(ok ? 0 : 1);
