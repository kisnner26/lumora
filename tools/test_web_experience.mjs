import assert from 'node:assert/strict';
import { servidor, abrir, BASE } from './lib.mjs';
const srv = await servidor(), { b, p, errores } = await abrir();
try {
  await p.goto(BASE + '/docs/app/index.html?web=1&menu=0');
  await p.waitForFunction(() => window.WEB && window.LMAUDIO && window.RISO?.world && window.LMRECUERDO);
  const result = await p.evaluate(async () => {
    LMEXPERIENCE.open('fuente');
    const statuses = await Promise.all(['/cara', '/artista', '/voces', '/convert'].map(url => fetch(url).then(r => r.status)));
    let error = ''; try { await LMAUDIO.system(); } catch (e) { error = e.message; }
    const before = RISO.world.settings().seed; RISO.world.next();
    return { statuses, error, changed: before !== RISO.world.settings().seed, hasPOV: !!RISO.pov, hasStory: !!RISO.story, disabled: document.getElementById('xpSystem').disabled };
  });
  assert.deepEqual(result.statuses, [501, 501, 501, 501]);
  assert.match(result.error, /necesita la app/);
  assert.equal(result.changed, true);
  assert.equal(result.hasStory, true);
  assert.equal(result.hasPOV, true);
  assert.equal(result.disabled, true);
  assert.deepEqual(errores, []);
  console.log('ok: copia web actualizada, universos y audio disponibles; funciones nativas señalan su límite');
} finally { await b.close(); srv.stop(); }
