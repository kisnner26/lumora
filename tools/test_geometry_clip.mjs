// integración real: instrumental, reproducción, seeks, salida a un clip normal y dibujo de perfiles.
import assert from 'node:assert/strict';
import { writeFileSync } from 'node:fs';
import { servidor, abrir, mock, BASE } from './lib.mjs';
const srv = await servidor();
const { b, p, errores } = await abrir(1600, 900);
try {
  await mock('song=gd&pos=18&state=paused');
  await p.goto(BASE + '/index.html?menu=0', { waitUntil: 'domcontentloaded' });
  await p.waitForFunction(() => window.RISOCLIP && window.ext?.st?.name === 'Stereo Madness');
  await p.evaluate(() => { HOME.hide(); document.querySelector('#panel').classList.add('hide'); document.querySelector('#hud').style.display = 'none'; CFG.clip = 'riso'; mode = 'proc'; paused = true; procFrame(18, .016); });
  assert.equal(await p.evaluate(() => RISOCLIP.geometry?.id), 1);
  assert.equal(await p.evaluate(() => RISOCLIP.on), true);
  assert.equal(await p.evaluate(() => IN.lines.filter(l => l.text).length), 0);
  await p.locator('#c').screenshot({ path: '/tmp/lumora-geometry-ship.png' });
  const renders = await p.evaluate(() => {
    const G = RISO.geometry, ctx = document.createElement('canvas').getContext('2d'); ctx.canvas.width = 1600; ctx.canvas.height = 900;
    let frames = 0;
    for (const l of G.levels) for (let i = 0; i < l.modes.length; i++) {
      G.render(ctx, 1600, 900, l, (i * 16 + 8) * 60 / l.bpm, { duration: 180 }); frames++;
    }
    // las dos resoluciones extremas y el modo de movimiento reducido también deben pintar.
    G.render(ctx, 390, 844, G.levels[21], 20, { reduced: true });
    G.render(ctx, 2560, 1080, G.levels[21], 60);
    return frames;
  });
  assert.ok(renders >= 70);
  await mock('song=gd&pos=3&state=paused');
  await p.waitForFunction(() => ext.st?.name === 'Stereo Madness' && ext.st.pos < 5);
  await p.evaluate(() => RISOCLIP.frame(0));
  assert.equal(await p.evaluate(() => RISO.geometry.state(RISOCLIP.geometry, RISOCLIP.time).form), 'cube');
  await p.locator('#c').screenshot({ path: '/tmp/lumora-geometry-cube.png' });
  await mock('song=dash&pos=10&state=paused');
  await p.waitForFunction(() => ext.st?.artist === 'MDK');
  await p.evaluate(() => { CFG.clip = 'clasico'; procFrame(10, .016); });
  assert.equal(await p.evaluate(() => RISOCLIP.geometry?.id), 22, 'la canción activa el modo incluso desde clásico');
  await p.locator('#c').screenshot({ path: '/tmp/lumora-geometry-dash.png' });
  await p.evaluate(() => { CFG.clip = 'portada'; RISOCLIP.frame(0); });
  assert.equal(await p.evaluate(() => RISOCLIP.geometry), null, 'respeta la portada fija');
  await mock('song=solo&pos=30&state=paused');
  await p.waitForFunction(() => ext.st?.artist === 'Shakira');
  await p.evaluate(() => { CFG.clip = 'riso'; RISOCLIP.frame(.016); if (RISOCLIP.mix?.on) RISOCLIP.mix.finish(); RISOCLIP.frame(.016); });
  assert.equal(await p.evaluate(() => RISOCLIP.geometry), null);
  assert.ok(await p.evaluate(() => !!RISOCLIP.shot));
  const profiles = await p.evaluate(() => {
    const R = RISO, ctx = R.K.c; R.K.c = document.createElement('canvas').getContext('2d');
    try { for (const profile of Object.values(R.artistFigures.profiles)) R.artistFigures.draw(R.K, profile.names[0], profile.id, 400, 760, 1, { active: true, time: 2, open: .5 }); }
    finally { R.K.c = ctx; }
    return Object.keys(R.artistFigures.profiles).length;
  });
  assert.ok(profiles >= 50);
  // muestra real de personajes con las tintas y la trama del motor compartido.
  const preview = await p.evaluate(() => {
    const R = RISO, st = R.stage, names = ['Bad Bunny', 'Lana Del Rey', 'Michael Jackson', 'Amy Winehouse', 'Twenty One Pilots', 'Shakira', 'Drake', 'Taylor Swift'];
    R.register({ id: 'artist_test', name: 'artistas', inks: 0, make: () => ({}), cam(c) { c.x = 0; c.y = 0; c.z = 1; c.r = 0; }, draw(K) {
      K.bg(-1); names.forEach((name, i) => { const x = 210 + i % 4 * 390, ground = i < 4 ? 410 : 830;
        R.artistFigures.draw(K, name, R.artistFigures.idOf(name), x, ground, .72, { active: true, time: 2 + i, open: .3 });
        K.txt(name.toLowerCase(), x, ground + 31, { font: 'display', size: 24, w: 700, align: 'center', i: 1 });
      });
    } });
    st.auto = false; st.notes = false; st.cut = null; st.fxAfter = null; st.pass = [1, 1, 1]; st.inkMix = null; st.regBoost = 0; st.resize(1600, 900); st.setInks(0); st.setScene('artist_test', { instant: true }); st.frame(.016);
    return st.canvas.toDataURL('image/png');
  });
  writeFileSync('/tmp/lumora-artistas.png', Buffer.from(preview.split(',')[1], 'base64'));
  assert.deepEqual(errores, []);
  console.log(`ok: ${renders} variantes de geometry dash, instrumental, seek, clásico, portada, salida normal y ${profiles} retratos sin errores`);
} finally { await b.close(); srv.stop(); }
