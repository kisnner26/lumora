import assert from 'node:assert/strict';
import { servidor, abrir, BASE } from './lib.mjs';
const srv = await servidor(); const { b, p, errores } = await abrir(1600, 900);
try {
  await p.goto(BASE + '/tools/galeria.html?cat=relatos');
  await p.waitForFunction('window.GAL_READY');
  assert.equal(await p.evaluate(() => GAL.pool.length), 12);
  await p.evaluate(() => render());
  await p.screenshot({ path: '/tmp/lumora-relatos-catalogo.png' });
  for (const src of ['riso-artistas', 'riso-cantantes', 'riso-relato']) await p.addScriptTag({ url: BASE + '/js/riso/' + src + '.js' });
  const result = await p.evaluate(() => {
    const R = RISO, st = R.stage, counts = { profiles: 0, tableaus: 0 };
    R.register({ id: 'qa', name: 'qa', inks: 0, make: () => ({}), cam(c) { c.x = 0; c.y = 0; c.z = 1; c.r = 0; }, draw(K) {
      for (const [i, profile] of Object.values(R.artistFigures.profiles).entries()) {
        R.artistFigures.draw(K, profile.names[0], profile.id, 80 + (i % 12) * 130, 145 + Math.floor(i / 12) * 125, .23, { active: true, open: .7, album: 'Trench' }); counts.profiles++;
      }
    } });
    st.setScene('qa', { instant: true }); st.frame(.016);
    return counts;
  });
  assert.equal(result.profiles, 71);
  await p.screenshot({ path: '/tmp/lumora-artistas-perfiles.png' });
  await p.evaluate(() => {
    const R = RISO, st = R.stage;
    const beats = R.narrative.compile([{ text: 'I wait for you at home' }, { text: 'Goodbye, I am leaving you' }, { text: 'Come back and hold my hand' }]);
    R.register({ id: 'qa-relato', name: 'qa', inks: 0, make: () => ({}), cam(c) { c.x = 0; c.y = 0; c.z = 1; c.r = 0; }, draw(K) {
      beats.forEach((beat, i) => { K.c.save(); K.c.translate(i * 530, 40); K.c.scale(.45, .8); K.c.translate(-790, 0); R.narrative.draw(K, { narrative: beat, props: [{ id: beat.motif }], seed: 7, flip: false }, 2); K.c.restore(); K.code(['espera', 'partida', 'regreso'][i], i * 530 + 265, 760, { align: 'center', size: 30 }); });
    } });
    st.setScene('qa-relato', { instant: true }); st.frame(.016);
  });
  await p.screenshot({ path: '/tmp/lumora-relato-secuencia.png' });
  assert.deepEqual(errores, []);
  await p.evaluate(() => {
    const R = RISO, st = R.stage, featured = ['tyler_joseph', 'josh_dun', 'taylor_swift', 'shakira', 'hozier', 'gustavo_cerati'];
    R.register({ id: 'qa-retratos', name: 'qa', inks: 0, make: () => ({}), cam(c) { c.x = 0; c.y = 0; c.z = 1; c.r = 0; }, draw(K) {
      featured.forEach((id, i) => { const cx = (i % 3 + .5) * 533, ground = 380 + Math.floor(i / 3) * 430;
        R.artistFigures.draw(K, R.artistFigures.profiles[id].names[0], id, cx, ground, .70, { active: true, open: .25, album: 'Clancy' });
        K.code(id.replaceAll('_', ' '), cx, ground + 40, { align: 'center', size: 23 }); });
    } }); st.setScene('qa-retratos', { instant: true }); st.frame(.016);
  });
  await p.locator('canvas').screenshot({ path: '/tmp/lumora-retratos.png' });
  // integración real: el clip usa el guion compilado y conserva su símbolo al buscar.
  await p.goto(BASE + '/index.html?menu=0'); await p.waitForFunction('window.RISOCLIP && window.RISO?.narrative');
  const shot = await p.evaluate(() => {
    IN.lines = [{ t: 0, text: 'I wait for you at home' }, { t: 5, text: 'A quiet moment' }]; IN.cuts = [0, 10]; SEM.plans = {};
    const a = RISOCLIP.cardShot(0, 0, 1), b = RISOCLIP.cardShot(0, 0, 8);
    return { kind: a.kind, motif: a.narrative.motif, same: a.seed === b.seed, props: a.props.map(p => p.id) };
  });
  assert.equal(shot.kind, 'tableau'); assert.equal(shot.motif, 'banco_vacio'); assert.equal(shot.same, true); assert.deepEqual(shot.props, ['banco_vacio']);
  await p.evaluate(() => {
    HOME.hide(); document.querySelector('#panel').classList.add('hide'); document.querySelector('#hud').style.display = 'none';
    ext.st.state = 'stopped'; paused = true; T = 2; proc.dur = 100; mode = 'proc';
    const RC = RISOCLIP; RC.lastKey = ext.key() + '|100'; RC.songKey = ext.key(); RC.shot = RC.cardShot(0, 0, 2); RC.shot.k0 = RISO.stage.t - 2;
    RISO.stage.cut = null; RC.pending = null; CFG.clip = 'riso'; RC.frame(0);
  });
  await p.locator('#c').screenshot({ path: '/tmp/lumora-relato-clip.png' });
  assert.deepEqual(errores, []);
  console.log('ok: 12 recursos, render de 71 perfiles, secuencia narrativa e integración del clip; capturas /tmp/lumora-*.png');
} finally { await b.close(); srv.stop(); }
