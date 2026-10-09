// errores de grabación, exclusión mutua y limpieza del bus de audio; sin esperar diez segundos reales.
import assert from 'node:assert/strict';
import vm from 'node:vm';
import { readFileSync } from 'node:fs';
let fail = true, connected = 0, disconnected = 0;
const downloads = [], tags = [], tracks = [];
const track = () => { const t = { stopped: false, stop() { this.stopped = true; } }; tracks.push(t); return t; };
const stream = () => { const list = [track()]; return { getTracks: () => list, getAudioTracks: () => list, addTrack(t) { list.push(t); } }; };
const REC = { on: false, canvas: { captureStream: stream } };
const noop = () => {};
const element = () => ({ dataset: {}, addEventListener: noop, setAttribute: noop, appendChild: noop, classList: { add: noop, remove: noop } });
const badge = element();
const E = { kind: 'file', graph: { master: { connect() { connected++; }, disconnect() { disconnected++; } } },
  ctx: { async resume() {}, createMediaStreamDestination() { return { stream: stream() }; } } };
const world = { settings: () => ({ seed: 'original', biome: 'costa' }), profile: () => ({ biome: 'costa' }) };
const context = vm.createContext({ window: { LMAUDIO: E, RISO: { world }, dispatchEvent: noop }, REC,
  document: { getElementById: () => null, querySelector: () => null, createElement: () => ({ ...element(), click() { downloads.push(this.download); } }) },
  $: () => badge, rc: new Proxy({}, { get: () => noop }), composeFrame: noop, recFormat: () => 'horizontal',
  recMime: () => ['video/mp4', 'mp4'], ext: { st: { name: 'prueba' } }, Blob,
  performance: { now: () => 0 }, requestAnimationFrame: () => 1, cancelAnimationFrame: noop,
  setTimeout: f => setImmediate(f), clearTimeout: clearImmediate,
  addEventListener: noop, removeEventListener: noop, CustomEvent: class {},
  URL: { createObjectURL: () => 'blob:prueba', revokeObjectURL: noop },
  navigator: { clipboard: { async writeText() {} } }, setTag: text => tags.push(text),
  MediaRecorder: class {
    constructor() { if (fail) throw Error('codificador no disponible'); this.state = 'inactive'; }
    start() { this.state = 'recording'; }
    stop() { this.state = 'inactive'; this.ondataavailable({ data: new Blob(['video de prueba']) }); queueMicrotask(() => this.onstop()); }
  } });
vm.runInContext(readFileSync(new URL('../js/app/recuerdo.js', import.meta.url), 'utf8'), context);
const capture = context.window.LMRECUERDO.capture;
await capture();
assert.equal(REC.busy, false);
assert.equal(connected, disconnected);
assert.ok(tracks.every(t => t.stopped));
assert.match(tags.at(-1), /codificador no disponible/);
fail = false;
const recording = capture();
assert.equal(REC.busy, true);
await capture(); // un segundo clic no crea otra grabación ni conecta otro bus
await recording;
assert.equal(downloads.length, 1);
assert.match(downloads[0], /\.mp4$/);
assert.equal(REC.busy, false);
assert.equal(connected, disconnected);
assert.ok(tracks.every(t => t.stopped));
REC.on = true;
await capture();
assert.equal(downloads.length, 1, 'un clip activo bloquea el recuerdo');
console.log('ok: recuerdo libera pistas y bus tras errores, permite reintentar y evita grabaciones simultáneas');
