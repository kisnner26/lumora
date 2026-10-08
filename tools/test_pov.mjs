// escenas en primera persona: registro, palabras que las piden y que no entren al sorteo ciego.
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import vm from 'node:vm';
const scenes = {}, order = [], RISO = { scenes, order, register: sc => { scenes[sc.id] = sc; order.push(sc.id); } };
vm.runInContext(readFileSync(new URL('../js/riso/riso-pov.js', import.meta.url), 'utf8'), vm.createContext({ window: { RISO }, Math }));
const P = RISO.pov, r0 = () => 0.1, never = () => 0.99;
assert.equal(P.ids.length, 6); for (const id of P.ids) { assert.ok(scenes[id], id); assert.equal(typeof scenes[id].draw, 'function'); assert.equal(typeof scenes[id].make, 'function'); }
assert.deepEqual(order.filter(id => id.startsWith('pov-')), [], 'no entran al sorteo ciego');
for (const [text, id] of [['driving down the highway in a car', 'pov-carretera'], ['the train leaves the station at dawn', 'pov-ventana'], ['we dance until the morning sun', 'pov-baile'], ['sleeping alone in this empty house', 'pov-cama'], ['te mando un mensaje por whatsapp', 'pov-celular'], ['caminando solo por la calle', 'pov-caminar']]) assert.ok([id, 'pov-caminar', 'pov-cama'].includes(P.pick(text, 'sereno', r0, 0)), text);
assert.equal(P.pick('nada que ver con nada', 'sereno', never, 0.2), null, 'sin palabras ni suerte no aparece');
assert.ok(P.ids.includes(P.pick('nada que ver', 'euforico', r0, 1)), 'por ánimo cuando toca');
assert.equal(P.pick('nada que ver', 'euforico', r0, 0), null, 'con el plan fijo, el ánimo no manda');
console.log('ok: seis escenas en primera persona, elegidas por la letra y por el ánimo');
