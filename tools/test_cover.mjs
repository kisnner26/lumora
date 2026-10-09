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
  await p.locator('#cvMenuBtn').click();
  await p.locator('#cover [data-tab="sonido"]').click();
  await p.locator('#cvPaneSonido [data-amb="fiesta"]').click();
  assert.equal(await p.evaluate(() => LMAUDIO.settings.preset), 'fiesta');
  assert.equal(await p.locator('#cvPaneSonido [data-amb="fiesta"]').getAttribute('aria-pressed'), 'true');
  await p.locator('#cvPaneSonido [data-bio="bosque"]').focus();
  await p.keyboard.press('Enter');
  assert.equal(await p.evaluate(() => RISO.world.settings().biome), 'bosque');
  const seed = await p.evaluate(() => RISO.world.settings().seed);
  await p.locator('#cvSndNext').click();
  assert.notEqual(await p.evaluate(() => RISO.world.settings().seed), seed);
  await p.locator('#cvSndHome').click();
  assert.equal(await p.evaluate(() => RISO.world.settings().seed), 'original');
  await p.evaluate(() => { window.__systemCalls = 0; LMAUDIO.system = async () => { window.__systemCalls++; }; });
  await p.locator('#cvSndSys').click();
  assert.equal(await p.evaluate(() => window.__systemCalls), 1);
  await p.keyboard.press('Escape'); // cierra las opciones antes de salir de carátula
  await p.keyboard.press('Escape');
  await p.waitForFunction(() => !document.body.classList.contains('cover-open'));
  assert.equal(await p.locator('#panel').isVisible(), true);
  assert.deepEqual(errores, []);
  console.log('carátula desde el menú: ok');
} finally {
  await b.close(); srv.stop();
}
