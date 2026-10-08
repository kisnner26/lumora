// quién canta cada verso: tramos con confianza; lo dudoso o desconocido no se reparte al azar.
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import vm from 'node:vm';
const RISO = {}, ctx = vm.createContext({ window: { RISO }, localStorage: { getItem: () => null, setItem() {} }, dispatchEvent() {}, CustomEvent: class {} });
vm.runInContext(readFileSync(new URL('../js/riso/riso-voces.js', import.meta.url), 'utf8'), ctx);
const V = RISO.voices; assert.equal(V.singerAt(0), null, 'sin reparto no hay voz');
V.blocks = [{ desde: 0, hasta: 7, voz: 'XXXTENTACION', confianza: .9 }, { desde: 8, hasta: 18, voz: 'Trippie Redd', confianza: .9 }, { desde: 19, hasta: 22, voz: 'varios', confianza: .6 }, { desde: 23, hasta: 30, voz: 'PnB Rock', confianza: .4 }, { desde: 31, hasta: 39, voz: 'desconocido', confianza: 0 }];
assert.equal(V.singerAt(3).name, 'XXXTENTACION'); assert.equal(V.singerAt(12).name, 'Trippie Redd'); assert.equal(V.singerAt(20), 'varios');
assert.equal(V.singerAt(25), null, 'con poca confianza no se destaca a nadie'); assert.equal(V.singerAt(35), null, 'desconocido no se reparte'); assert.equal(V.singerAt(99), null);
console.log('ok: la voz de cada verso sale del reparto buscado; sin seguridad nadie se destaca');
