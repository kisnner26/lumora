import assert from 'node:assert/strict';
import { servidor, abrir, mock, BASE, espera } from './lib.mjs';
const srv = await servidor(), { b, p, errores } = await abrir();
const sent = []; let fail = false;
try {
  await p.route(url => url.pathname === '/lights', async route => {
    const request = route.request();
    if (request.method() === 'POST') {
      sent.push({ at: Date.now(), body: request.postDataJSON() });
      await route.fulfill({ status: fail ? 503 : 200, json: { ok: !fail } });
    } else await route.fulfill({ json: { devices: [{ ip: '192.0.2.1', id: 'test', sku: 'H619D' }] } });
  });
  await mock('song=gimme&pos=30&state=playing');
  await p.goto(BASE + '/index.html', { waitUntil: 'domcontentloaded' });
  await p.waitForFunction(() => typeof lightsTick === 'function' && LT.devices.length && ext.st.name === 'Gimme More');
  await p.getByRole('button', { name: 'lyric video', exact: true }).evaluate(el => el.click());
  await p.evaluate(() => {
    IN.period = .5; IN.phase = 0; IN.bpm = 120;
    setLightsOpt('mode', 'pulso'); setLightsOpt('color', 'fijo'); setLightsOpt('hue', 200);
  });
  // no llamar lightsTick ni procFrame: comprobar el bucle real de cada renderizador.
  for (const clip of ['riso', 'fabula', 'cine', 'portada']) {
    await p.evaluate(clip => { CFG.clip = clip; LT.sentRgb = null; LT.sent = -1; }, clip);
    const start = sent.length; await espera(1600);
    const frames = sent.slice(start);
    assert.ok(frames.some(q => q.body.rgb), 'envía color en ' + clip);
    assert.ok(new Set(frames.map(q => q.body.bright).filter(v => v !== undefined)).size > 3, 'pulsa en ' + clip);
  }
  const pulse = await p.evaluate(() => {
    AUD.live = true; AUD.pulse = .8; IN.beat = 0;
    const hit = pulseEnv(.7); AUD.pulse = 0; IN.beat = 1;
    const rest = pulseEnv(.7); AUD.live = false;
    return { hit, rest };
  });
  assert.deepEqual(pulse, { hit: .8, rest: 0 });
  fail = true; let start = sent.length; await espera(2300);
  assert.ok(sent.length - start <= 4, 'reintenta sin saturar al puente');
  fail = false; start = sent.length; await espera(1500);
  assert.ok(sent.slice(start).some(q => q.body.on && q.body.rgb && q.body.bright), 'reenvía estado completo tras fallo');
  await p.evaluate(() => { LT.on = false; });
  await espera(150); start = sent.length; await espera(650);
  assert.equal(sent.length, start, 'desactivadas: no emite');
  await p.evaluate(() => { LT.on = true; setLightsOpt('mode', 'quieta'); });
  assert.equal(await p.evaluate(() => pulseEnv(.8)), 0, 'respeta quieta');
  assert.deepEqual(errores, []);
  console.log('luces: bucle real en risografía, fábula, vídeo y carátula; pulso real; reconexión y desactivación: ok');
} finally { await b.close(); srv.stop(); }
