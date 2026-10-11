// cancelación, cambio de fuente y remuestreo sin capturar ni reproducir audio real.
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import vm from 'node:vm';
import { randomUUID } from 'node:crypto';

const blobs = new Map(), requests = [], workers = [];
let held = false, workletCode;
class Worker {
  constructor() { workers.push(this); }
  postMessage(data) { this.data = data; if (!held) queueMicrotask(() => this.onmessage?.({ data: { ok: 1 } })); }
  terminate() { this.terminated = true; }
}
class AudioWorkletNode {
  constructor() { this.port = { postMessage() {}, close() {} }; }
  connect() {}
  disconnect() {}
}
const context = vm.createContext({ window: {}, localStorage: { getItem() {}, setItem() {} }, Blob,
  URL: { createObjectURL: blob => { const key = randomUUID(); blobs.set(key, blob); return key; }, revokeObjectURL: key => blobs.delete(key) },
  Worker, AudioWorkletNode, MessageChannel: class { constructor() { this.port1 = {}; this.port2 = {}; } },
  crypto: { randomUUID }, location: { origin: 'http://localhost' },
  fetch: async (url, options) => { requests.push({ url, options }); return {}; },
  audio: { addEventListener() {} }, addEventListener() {}, dispatchEvent() {}, CustomEvent: class {},
  setTimeout, clearTimeout, clearInterval, setInterval });
vm.runInContext(readFileSync(new URL('../js/audio/experience.js', import.meta.url), 'utf8'), context);
const E = context.window.LMAUDIO;
const param = { cancelScheduledValues() {}, setTargetAtTime() {} };
E.ctx = { state: 'running', currentTime: 0, sampleRate: 48000, audioWorklet: { async addModule(url) { workletCode = await blobs.get(url).text(); } } };
E.graph = { input: {}, gate: { gain: param } };
E.startMeter = () => {};
const tick = () => new Promise(resolve => setImmediate(resolve));

held = true;
const starting = E.system();
await tick();
assert.equal(workers.length, 1);
E.detach();
await starting;
assert.equal(workers[0].terminated, true);
assert.equal(E.kind, 'none');
assert.match(requests[0].url, /\/pcm\/stop\?session=/);

const oldStart = E.system();
await tick();
held = false;
await E.system();
await oldStart;
assert.equal(E.kind, 'system');
assert.equal(E.monitor, true);
assert.equal(workers[1].terminated, true);
assert.notEqual(workers[1].data.url, workers[2].data.url);
E.setMonitor(false);
assert.equal(E.kind, 'none', 'apagar la salida libera el tap y devuelve el original');
assert.equal(workers[2].terminated, true);
assert.equal(blobs.size, 0, 'los módulos y workers no dejan urls de objetos vivas');

// el colchón se mide en muestras de entrada, también al remuestrear 44,1 / 48 / 96 kHz.
for (const inputRate of [44100, 48000, 96000]) {
  let Processor;
  vm.runInNewContext(workletCode, { sampleRate: 48000, Float32Array,
    AudioWorkletProcessor: class { constructor() { this.port = { postMessage() {} }; } },
    registerProcessor(name, p) { Processor = p; } });
  const proc = new Processor();
  proc.get({ rate: inputRate });
  assert.equal(proc.target, inputRate * .2);
  let phase = 0, carry = 0, rendered = 0;
  const feed = n => {
    const pcm = new Float32Array(n * 2);
    for (let i = 0; i < n; i++) { pcm[i * 2] = Math.sin(phase++ * 2 * Math.PI * 440 / inputRate) * .3; pcm[i * 2 + 1] = -pcm[i * 2]; }
    proc.get({ pcm });
  };
  feed(Math.ceil(inputRate * .22));
  for (let i = 0; i < 750; i++) {
    carry += 128 * inputRate / 48000;
    const n = Math.floor(carry); carry -= n; feed(n);
    const out = [new Float32Array(128), new Float32Array(128)];
    proc.process([], [out]);
    for (let j = 0; j < 128; j++) {
      assert.ok(Number.isFinite(out[0][j]));
      assert.ok(Math.abs(out[0][j] + out[1][j]) < 1e-6, 'no mezcla los canales');
      rendered += out[0][j] ** 2;
    }
  }
  assert.equal(proc.under, 0, `sin cortes a ${inputRate} Hz`);
  assert.ok(rendered > 1000);
}
console.log('ok: cancelación durante arranque, cambios de fuente, salida original, limpieza y PCM a 44,1 / 48 / 96 kHz');
