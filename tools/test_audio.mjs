// renderiza la señal fuera de la salida de audio: comprueba los efectos sin tocar el sonido del mac.
import assert from 'node:assert/strict';
import { servidor, abrir, BASE } from './lib.mjs';
const srv = await servidor(), { b, p, errores } = await abrir();
try {
  await p.goto(BASE + '/index.html?menu=0');
  await p.waitForFunction(() => window.LMAUDIO);
  const rendered = await p.evaluate(async () => {
    const E = LMAUDIO, original = E.settings, result = {};
    try {
      for (const preset of ['original', 'fiesta', 'catedral', 'inmersivo']) {
        const ctx = new OfflineAudioContext(2, 48000 * 4, 48000), spec = E.presets[preset];
        E.settings = E.clean({ ...spec, preset, volume: .8 });
        const graph = E.build(ctx); graph.gate.gain.value = 1;
        const signal = ctx.createBuffer(2, 960, 48000);
        for (let ch = 0; ch < 2; ch++) {
          const d = signal.getChannelData(ch);
          for (let i = 0; i < d.length; i++) d[i] = Math.sin(i * 2 * Math.PI * (ch ? 660 : 440) / 48000) * .15;
        }
        const source = ctx.createBufferSource(); source.buffer = signal; source.connect(graph.input); source.start();
        const out = await ctx.startRendering();
        let energy = 0, tail = 0, late = 0, peak = 0, finite = true;
        for (let ch = 0; ch < 2; ch++) {
          const d = out.getChannelData(ch);
          for (let i = 0; i < d.length; i++) { finite &&= Number.isFinite(d[i]); energy += d[i] ** 2; if (i > 2400) tail += d[i] ** 2; if (i > 48000) late += d[i] ** 2; peak = Math.max(peak, Math.abs(d[i])); }
        }
        result[preset] = { energy, tail, late, peak, finite };
      }
    } finally { E.settings = original; }
    return result;
  });
  for (const value of Object.values(rendered)) {
    assert.equal(value.finite, true);
    assert.ok(value.energy > .01 && value.peak < 1, 'señal audible sin valores inválidos ni saturación');
  }
  assert.ok(rendered.original.tail < 1e-6, 'sin eco ni reverb en original');
  assert.ok(rendered.fiesta.tail > .01, 'la fiesta modifica el audio y deja una cola real');
  assert.ok(rendered.catedral.late > rendered.fiesta.late, 'la catedral deja una cola más larga');
  assert.notEqual(rendered.inmersivo.energy, rendered.original.energy);
  assert.deepEqual(errores, []);
  console.log('ok: original, eco, reverb y espacio binaural procesan señal real sin saturación');
} finally { await b.close(); srv.stop(); }
