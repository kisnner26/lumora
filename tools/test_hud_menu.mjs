import assert from 'node:assert/strict';
import { servidor, abrir, BASE } from './lib.mjs';
const srv = await servidor(), { b, p, errores } = await abrir();
try {
  await p.goto(BASE + '/index.html?menu=0');
  await p.waitForFunction(() => window.RISOCLIP);
  for (const width of [1280, 390]) {
    await p.setViewportSize({ width, height: 844 });
    await p.evaluate(() => { mode = 'proc'; wake(); });
    await p.locator('#hudMoreBtn').click();
    const menu = await p.locator('#hudMore').boundingBox(), hud = await p.locator('#hud').boundingBox();
    assert.ok(menu.y + menu.height <= hud.y, 'las herramientas quedan encima de toda la barra, sin tapar la canción');
    assert.ok(menu.x >= 0 && menu.x + menu.width <= width, 'el menú cabe en la ventana');
    assert.equal(await p.evaluate(() => document.activeElement.closest('#hudMore')?.id), 'hudMore');
    await p.keyboard.press('Escape');
    assert.equal(await p.locator('#hudMore').isVisible(), false);
    assert.equal(await p.evaluate(() => document.activeElement.id), 'hudMoreBtn');
    assert.equal(await p.locator('#hudMoreBtn').getAttribute('aria-expanded'), 'false');
  }
  assert.deepEqual(errores, []);
  console.log('ok: herramientas sin tapar la canción, dentro de la ventana y con foco de teclado');
} finally { await b.close(); srv.stop(); }
