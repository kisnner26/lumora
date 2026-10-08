// atmósfera de la letra: lugar, clima, hora y acción con persistencia determinista.
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import vm from 'node:vm';
const RISO = {}, context = vm.createContext({ window: { RISO }, Math });
vm.runInContext(readFileSync(new URL('../js/riso/riso-atmosfera.js', import.meta.url), 'utf8'), context);
const A = RISO.atmos, L = t => ({ t: 0, text: t });
const rows = A.plan(['walking alone in the rain tonight', 'the city lights are burning in my head', '', 'we dance until the morning sun', 'driving down the highway in a car', 'me quedo en la playa mirando el mar', 'nobody knows how much i cry', 'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'].map(L));
assert.equal(rows[0].weather, 'lluvia'); assert.equal(rows[0].time, 'noche'); assert.equal(rows[0].act, 'cry');
assert.equal(rows[1].place, 'ciudad'); assert.equal(rows[1].weather, 'fuego');
assert.equal(rows[2], null);
assert.equal(rows[3].act, 'dance'); assert.equal(rows[3].time, 'amanecer');
assert.equal(rows[4].act, 'drive'); assert.equal(rows[5].place, 'costa'); assert.equal(rows[6].act, 'cry');
// la hora, el lugar y el clima caducan: no dominan toda la canción
assert.equal(rows[14].time, null); assert.equal(rows[14].place, null); assert.equal(rows[14].weather, null);
// determinista y sin falsos positivos por subcadenas
assert.deepEqual(A.plan(['walking alone in the rain tonight', 'the city lights are burning in my head'].map(L)).slice(0, 2), rows.slice(0, 2));
const r2 = A.plan(['carpet drain', 'seashell', 'cargo'].map(L)); assert.ok(r2.every(r => !r.weather && !r.act && !r.place));
console.log('ok: lugar, clima, hora y acción de la letra, con caducidad y sin falsos positivos');
