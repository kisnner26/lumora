// historia: arco de lugares y horas, otro personaje, planos y camino determinista.
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import vm from 'node:vm';
const RISO = {}, context = vm.createContext({ window: { RISO }, Math });
for (const f of ['riso-atmosfera', 'riso-historia']) vm.runInContext(readFileSync(new URL('../js/riso/' + f + '.js', import.meta.url), 'utf8'), context);
const T = [[0, 'walking alone in the rain tonight'], [4, 'the city lights are burning in my head'], [8, 'i miss you baby, i miss your smile'], [14, 'we dance until the morning sun'], [18, 'hold me close, te quiero mi vida'], [22, 'driving down the highway in a car'], [30, 'the moon is falling on the sea'], [34, 'tengo el corazon hecho pedazos'], [40, 'sleeping alone in this empty house'], [46, 'love is a flower that never learned to die']];
const lines = T.map(([t, text]) => ({ t, text }));
const sections = [{ i: 0, start: 0, end: 14, role: 'verse', energy: 4 }, { i: 1, start: 14, end: 30, role: 'chorus', energy: 8 }, { i: 2, start: 30, end: 40, role: 'bridge', energy: 3 }, { i: 3, start: 40, end: 52, role: 'outro', energy: 3 }];
const beats = lines.map((l, li) => ({ li, mood: li > 6 ? 'triste' : 'sereno', t: l.t }));
const S = RISO.story, d = S.plan(lines, { sections, beats }, [], 52, 'cancion');
assert.equal(d.secs.length, 4);
assert.ok(d.secs.every(s => ['ciudad', 'costa', 'bosque', 'desierto', 'espacio', 'cuarto'].includes(s.place)));
assert.ok(d.secs.every(s => ['amanecer', 'dia', 'atardecer', 'noche'].includes(s.time)));
// la hora avanza: el tramo final no repite el inicial, y la letra manda sobre el arco
assert.equal(S.at(0).time, 'noche'); assert.equal(S.at(0).weather, 'lluvia');
assert.equal(S.at(5).act, 'drive');
// el otro personaje: ausente al principio, llega, se abraza, se aleja
assert.equal(S.at(2).partner === 'apart', true); assert.equal(S.at(4).partner, 'embrace'); assert.equal(S.at(4).act, 'hug');
// planos: presentar, y despedir al final
assert.equal(S.at(0).shot, 'establishing'); assert.equal(S.at(9).shot, 'pull');
// camino determinista y creciente
const a = [0, 5, 14, 15, 16, 20, 40].map(t => S.scroll(t)); for (let i = 1; i < a.length; i++) assert.ok(a[i] >= a[i - 1], 'el camino no retrocede');
assert.equal(S.scroll(17.3), S.scroll(17.3));
// al empezar un tramo con otro lugar camina hasta que aparece el siguiente (sin interiores)
for (const m of d.seams) { assert.ok(m.u > S.scroll(m.t)); assert.ok(S.scroll(m.t + 3.4) - S.scroll(m.t) > 1000, 'camina lo bastante'); const v = S.view(m.t + 5); assert.equal(v.seam, undefined); const v0 = S.view(m.t + .2); assert.equal(v0.seam?.to, m.to); }
// sin lugares en la letra, cada canción hace su propio recorrido, sin repetir lugar seguido
const neutral = T.map(([t]) => ({ t, text: 'la la la ' + t }));
const n1 = S.plan(neutral, { sections, beats }, [], 52, 'cancion uno').secs.map(s => s.place), n2 = S.plan(neutral, { sections, beats }, [], 52, 'cancion dos').secs.map(s => s.place);
assert.notDeepEqual(n1, n2); for (const n of [n1, n2]) for (let i = 1; i < n.length; i++) assert.notEqual(n[i], n[i - 1]);
console.log('ok: historia con arco de lugares y horas, otro personaje, planos y camino determinista');
