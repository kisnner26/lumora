// abrir carátula desde el menú oculta la bienvenida y la restaura al salir.
import assert from 'node:assert/strict';
import { servidor, abrir, mock, BASE } from './lib.mjs';
const srv = await servidor();
const { b, p, errores } = await abrir();
try {
  await mock('song=a&pos=0&state=paused');
  await p.goto(BASE + '/index.html', { waitUntil: 'domcontentloaded' });
  await p.waitForFunction(() => window.ext?.artUrl);
  await p.locator('#panel').waitFor({ state: 'visible' });
  await p.getByRole('button', { name: 'modo carátula', exact: true }).click();
  await p.waitForFunction(() => document.body.classList.contains('cover-open'));
  assert.equal(await p.locator('#panel').isVisible(), false);
  assert.equal(await p.locator('#home').isVisible(), false);
  await p.waitForFunction(() => document.querySelector('#coverImg').naturalWidth > 0);
  await p.keyboard.press('Escape');
  await p.waitForFunction(() => !document.body.classList.contains('cover-open'));
  assert.equal(await p.locator('#panel').isVisible(), true);
  assert.deepEqual(errores, []);
  console.log('carátula desde el menú: ok');
} finally {
  await b.close(); srv.stop();
}
