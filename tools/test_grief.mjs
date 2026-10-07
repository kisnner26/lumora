// reproducción real y seek de ambos homenajes; no controla música del usuario.
import assert from 'node:assert/strict';
import { servidor, abrir, mock, BASE } from './lib.mjs';
const srv = await servidor();
const { b, p, errores } = await abrir(1600, 900);
try {
  const response = await fetch(BASE + '/media/grief/gameplay.mp4', { headers: { Range: 'bytes=0-1' } });
  assert.equal(response.status, 206);
  assert.equal((await response.arrayBuffer()).byteLength, 2);
  await mock('song=grief&pos=18&state=paused');
  await p.goto(BASE + '/index.html?menu=0', { waitUntil: 'domcontentloaded' });
  await p.waitForFunction(() => window.RISOCLIP && ext.st?.artist === 'TRUE ADAM');
  await p.evaluate(() => { HOME.hide(); document.querySelector('#panel').classList.add('hide'); document.querySelector('#hud').style.display = 'none'; CFG.clip = 'clasico'; mode = 'proc'; paused = true; procFrame(18, .016); });
  await p.waitForFunction(() => { RISO.grief.render(x, W, H, 18, {duration:146.365,playing:false}); return RISO.grief.current?.ready && RISO.grief.current.id === 'hyperframes' && !RISO.grief.footage.hyperframes.seeking; });
  await p.waitForFunction(() => RISO.grief.footage.hyperframes?.readyState >= 2);
  await p.evaluate(() => procFrame(18, .016));
  assert.equal(await p.evaluate(() => RISO.grief.current.id), 'hyperframes');
  assert.equal(await p.evaluate(() => RISOCLIP.grief), true);
  const detection = await p.evaluate(() => {
    const g = RISO.grief;
    return [g.detect('Stalemate (Grief)', 'TRUE ADAM'), g.detect('Stalemate - Grief', 'true adam'), g.detect('Stalemate', 'TRUE ADAM'), g.detect('Stalemate - Grief', 'Other artist'), g.detect('POP CULTURE - Madeon mix', 'publisher'), g.detect('episode', 'publisher', '4uwxWWxb6zPMrNsK13VErG'), g.detect('pop culture', 'Madeon')];
  });
  assert.deepEqual(detection, [true, true, false, false, true, true, false]);
  await p.evaluate(() => { window.griefTestFrame = procFrame; procFrame = () => {}; });
  async function frame(t, file, reduced = false) {
    await p.evaluate(({t, reduced}) => { CFG.reduceMotion = reduced; RISO.grief.render(x, W, H, t, { duration: 146.365, reduced, playing: false }); }, {t, reduced});
    await p.waitForFunction(({t, reduced}) => { RISO.grief.render(x, W, H, t, { duration: 146.365, reduced, playing: false }); const g = RISO.grief, c = g.current?.id === 'hyperframes' ? g.current : g.timeline(t, 146.365), v = g.footage[c.id]; return v?.readyState >= 2 && !v.seeking && Math.abs(v.currentTime - c.at) < .1; }, {t, reduced});
    await p.evaluate(({t, reduced}) => RISO.grief.render(x, W, H, t, { duration: 146.365, reduced, playing: false }), {t, reduced});
    if (file) await p.locator('#c').screenshot({ path: file });
  }
  const editPlan = await p.evaluate(() => {
    const g = RISO.grief, shots = new Set(), looks = new Set();
    for (let t = 0; t < 134; t += .1) {
      const cue = g.timeline(t, 146.365), look = g.treatment(cue);
      shots.add(cue.shot); looks.add(look.mono); looks.add(look.panels ? 'mirror' : 'single');
      if (!Number.isFinite(cue.at) || cue.at < 0 || cue.at > 170.7) throw Error('fuente fuera de rango');
    }
    const cut = 16 * 60 / 135;
    const before = g.timeline(cut - .001), after = g.timeline(cut + .001);
    const quiet = g.treatment(after, true);
    return { cuts: shots.size, looks: [...looks], jump: Math.abs(before.at - after.at), quiet,
      ramp: [g.timeline(1).rate, g.timeline(.01).rate],
      repeat: JSON.stringify(g.timeline(37)) === JSON.stringify(g.timeline(37)) };
  });
  assert.ok(editPlan.cuts > 40);
  assert.ok(editPlan.jump > 1);
  assert.ok(editPlan.looks.includes(1) && editPlan.looks.includes('mirror'));
  assert.ok(editPlan.ramp[1] > editPlan.ramp[0]);
  assert.ok(editPlan.repeat);
  assert.equal(editPlan.quiet.blur, 0);
  assert.equal(editPlan.quiet.rotation, 0);
  await frame(7.5, '/tmp/lumora-grief-monochrome.png');
  await frame(2, '/tmp/lumora-grief-intro.png');
  await frame(37, '/tmp/lumora-grief-gameplay.png');
  await frame(90, '/tmp/lumora-grief-pressure.png');
  await frame(143, '/tmp/lumora-grief-coda.png');
  await frame(12, null, true);
  const stopped = await p.evaluate(() => Object.values(RISO.grief.footage).every(v => !v || v.paused));
  assert.ok(stopped);
  await p.evaluate(() => RISO.grief.render(x, W, H, 12, { duration: 146.365, playing: true }));
  await p.waitForFunction(() => { RISO.grief.render(x, W, H, 12, { duration:146.365, playing:true }); return !RISO.grief.footage[RISO.grief.current.id].paused; });
  const start = await p.evaluate(() => RISO.grief.footage[RISO.grief.current.id].currentTime);
  await p.waitForTimeout(300);
  assert.ok(await p.evaluate(start => RISO.grief.footage[RISO.grief.current.id].currentTime > start, start));
  if (await p.evaluate(() => RISO.grief.footage.hyperframes?.readyState >= 2)) {
    for (const t of [18, 160, 279]) {
      await p.evaluate(t => RISO.grief.render(x, W, H, t, { duration: 284.235, playing: false, text: 'missing you' }), t);
      await p.waitForFunction(t => {
        RISO.grief.render(x, W, H, t, { duration: 284.235, playing: false, text: 'missing you' });
        const g = RISO.grief, v = g.footage.hyperframes;
        return g.current.id === 'hyperframes' && !v.seeking && Math.abs(v.currentTime - g.current.at) < .1 && v.paused;
      }, t);
    }
    await p.locator('#c').screenshot({ path: '/tmp/lumora-hyperframes-lyrics.png' });
  }
  await p.evaluate(() => { procFrame = window.griefTestFrame; });
  await mock('song=grief2&pos=70&state=paused');
  await p.waitForFunction(() => ext.st?.name === 'Stalemate - Grief');
  await p.evaluate(() => procFrame(70, .016));
  assert.equal(await p.evaluate(() => RISOCLIP.grief), true);
  await p.evaluate(() => { CFG.clip = 'portada'; RISOCLIP.frame(0); });
  assert.ok(await p.evaluate(() => !RISOCLIP.grief && Object.values(RISO.grief.footage).every(v => !v || v.paused)));
  await mock('song=solo&pos=30&state=paused');
  await p.waitForFunction(() => ext.st?.artist === 'Shakira');
  await p.evaluate(() => { CFG.clip = 'riso'; RISOCLIP.frame(.016); });
  assert.equal(await p.evaluate(() => RISOCLIP.grief), false);
  assert.deepEqual(errores, []);
  console.log('ok: grief, dos títulos, video decodificado, rangos, intro, coda, pausa, seek, movimiento reducido y salida');
} catch (e) { console.error(await p.evaluate(() => ({current:RISO.grief.current, videos:Object.fromEntries(Object.entries(RISO.grief.footage).map(([k,v])=>[k,v && {src:v.src,ready:v.readyState,seeking:v.seeking,time:v.currentTime,duration:v.duration,error:v.error?.message}]))}))); throw e; } finally { await b.close(); srv.stop(); }
