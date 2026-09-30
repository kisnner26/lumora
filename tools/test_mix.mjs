// prueba de la mezcla entre canciones (fase 3): animación por pasos, cambio sin solape (3 s), cambio con solape (pos 7 s),
// continuidad al terminar, ajuste apagado, misma canción repetida y errores de consola. Capturas en /tmp/mix-*.jpg
import { servidor, abrir, mock, espera, BASE } from './lib.mjs';
const srv = await servidor(); await mock('scn=normal');
const { b, p, errores } = await abrir();
let ok = true; const chk = (n, c, x) => { console.log((c ? 'ok    ' : 'FALLA ') + n + (x ? '  ' + x : '')); if (!c) ok = false; };
await p.goto(BASE + '/index.html?menu=0'); await espera(9000);
const st = () => p.evaluate(() => ({ on: RISOMIX.on, p: +RISOMIX.p.toFixed(2), D: RISOMIX.D, shot: RISOCLIP.shot?.kind, cancion: ext.st.name, mode, err: !!RISOCLIP.err }));
// (a) animación por pasos con el atajo
await p.evaluate(() => RISOMIX.start({ duration: 8, hold: 0 })); await espera(1500);
for (const q of [0, .25, .5, .75, 1]) { await p.evaluate(v => { RISOMIX.hold = v; }, q); await espera(1600); await p.screenshot({ path: `/tmp/mix-p${Math.round(q * 100)}.jpg`, type: 'jpeg', quality: 80 }); }
let s = await st(); chk('(a) la mezcla dibuja en p=1 sin errores', s.on && !s.err, JSON.stringify(s));
await p.evaluate(() => { RISOMIX.hold = null; RISOMIX.p = .999; }); await espera(700); s = await st();
chk('(d) al terminar la mezcla sigue el videoclip normal (toma de título)', !s.on && s.shot === 'title', JSON.stringify(s));
await espera(6000); s = await st(); chk('(d) y luego avanza a tomas normales', ['prop', 'scene', 'giant'].includes(s.shot), s.shot);
// (b) cambio de canción sin solape
await mock('scn=cambio'); await espera(1800); s = await st();
chk('(b) cambio con posición 0: mezcla fija de 3 s', s.on && s.D === 3 && s.p < .8, JSON.stringify(s)); await p.screenshot({ path: '/tmp/mix-cambio.jpg', type: 'jpeg', quality: 80 });
await espera(4500); s = await st(); chk('(b) termina sola', !s.on && s.cancion === 'Tren de Medianoche', JSON.stringify(s));
// (c) cambio con la posición ya en 7 s (crossfade)
await espera(3000); await mock('scn=normal'); await espera(4500); await mock('scn=crossfade'); await espera(1500); s = await st();
chk('(c) crossfade con la posición en 7 s: dura ~10 s y empieza avanzada', s.on && s.D >= 9 && s.p >= .5, JSON.stringify(s)); await p.screenshot({ path: '/tmp/mix-crossfade.jpg', type: 'jpeg', quality: 80 });
await espera(9000); s = await st(); chk('(c) termina', !s.on, JSON.stringify(s));
// (g) misma canción repetida: no hay mezcla ni errores
await mock('scn=repetir'); await espera(2500); s = await st(); chk('(g) repetir la misma canción no dispara la mezcla', !s.on && !s.err, JSON.stringify(s));
// (e) ajuste apagado: corte seco
await p.evaluate(() => { CFG.mix = false; }); await mock('scn=cambio'); await espera(1500); s = await st(); chk('(e) con «mezcla entre canciones» apagada vuelve el corte', !s.on, JSON.stringify(s));
await p.evaluate(() => { CFG.mix = true; CFG.transitions = 'ninguna'; }); await espera(3000); await mock('scn=normal'); await espera(1500); s = await st(); chk('(e) con transiciones en «ninguna» también', !s.on, JSON.stringify(s));
await p.evaluate(() => { CFG.transitions = 'todas'; });
const log = await p.evaluate(() => RISOMIX.log); console.log('registro', JSON.stringify(log));
chk('(h) sin errores en consola', !errores.length, errores.join(' | '));
await b.close(); srv.stop(); process.exit(ok ? 0 : 1);
