// utilidades compartidas de las pruebas con navegador: Playwright + Chromium/Chrome y el puente simulado.
// Funciona en Mac, Linux y en la nube. Busca Playwright y el navegador en este orden:
//   Playwright: PLAYWRIGHT_PATH, node_modules del proyecto, instalación global de npm, ruta de la nube
//   navegador:  CHROMIUM, el que trae Playwright, Google Chrome de macOS, rutas de Linux
// Sin Playwright, las pruebas de navegador se omiten (tools/check.sh) y las de node puro siguen corriendo.
import { spawn, execSync } from 'node:child_process';
import { existsSync } from 'node:fs';
import { pathToFileURL } from 'node:url';
import path from 'node:path';
export const RAIZ = path.resolve(path.dirname(new URL(import.meta.url).pathname), '..');
export const PORT = 8899, BASE = 'http://127.0.0.1:' + PORT;

let _pw = null;
async function cargarPlaywright() {
  if (_pw) return _pw;
  let global = ''; try { global = execSync('npm root -g', { stdio: ['ignore', 'pipe', 'ignore'] }).toString().trim(); } catch (e) {}
  const candidatos = [process.env.PLAYWRIGHT_PATH, 'playwright', 'playwright-core', global && path.join(global, 'playwright/index.mjs'), global && path.join(global, 'playwright-core/index.mjs'), '/opt/node22/lib/node_modules/playwright/index.mjs'].filter(Boolean);
  for (const c of candidatos) {
    try { const m = await import(path.isAbsolute(c) ? pathToFileURL(c).href : c); if (m.chromium || m.default?.chromium) return (_pw = m.chromium ? m : m.default); } catch (e) {}
  }
  throw new Error('No encuentro Playwright. Instálalo con "npm i -D playwright" y "npx playwright install chromium", o define PLAYWRIGHT_PATH. Las pruebas de node puro (test_falsos_positivos.mjs) no lo necesitan.');
}
export async function tienePlaywright() { try { await cargarPlaywright(); return true; } catch (e) { return false; } }

const NAVEGADORES = [process.env.CHROMIUM, '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome', '/Applications/Chromium.app/Contents/MacOS/Chromium', '/opt/pw-browsers/chromium', '/usr/bin/chromium', '/usr/bin/chromium-browser', '/usr/bin/google-chrome'].filter(Boolean);
async function lanzar(pw) {
  // en la nube y en Linux no hay gpu: webgl por software. En un Mac, la gpu de siempre (SOFTWARE_GL=1 para forzar el software)
  const soft = process.env.SOFTWARE_GL === '1' || process.platform === 'linux';
  const args = soft ? ['--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--ignore-gpu-blocklist', '--no-sandbox'] : ['--ignore-gpu-blocklist'];
  const intentos = [...(process.env.CHROMIUM ? [] : [undefined]), ...NAVEGADORES.filter(e => existsSync(e))];       // primero el navegador de Playwright, luego los del sistema
  let ultimo;
  for (const exe of intentos) { try { return await pw.chromium.launch(exe ? { executablePath: exe, args } : { args }); } catch (e) { ultimo = e; } }
  throw new Error('No pude abrir un navegador (' + (ultimo?.message || '').split('\n')[0] + '). Define CHROMIUM con la ruta de Chrome o ejecuta "npx playwright install chromium".');
}

export async function servidor() {
  try { await fetch(BASE + '/now'); return { stop() {} }; } catch (e) {}
  const p = spawn('python3', [path.join(RAIZ, 'tools/mock_bridge.py'), String(PORT)], { stdio: 'ignore', cwd: RAIZ });
  for (let i = 0; i < 30; i++) { try { await fetch(BASE + '/now'); break; } catch (e) { await new Promise(r => setTimeout(r, 200)); } }
  return { stop() { p.kill(); } };
}
export async function abrir(w = 1280, h = 720) {
  const pw = await cargarPlaywright(), b = await lanzar(pw);
  const p = await b.newPage({ viewport: { width: w, height: h } }), errores = [];
  const ruido = /fonts\.g|net::ERR|Failed to load resource|EventSource/;
  p.on('pageerror', e => errores.push('pageerror: ' + e.message));
  p.on('console', m => { if (m.type() === 'error' && !ruido.test(m.text())) errores.push('consola: ' + m.text()); });
  return { b, p, errores };
}
export const mock = (q) => fetch(BASE + '/mock?' + q).then(r => r.json());
export const espera = ms => new Promise(r => setTimeout(r, ms));
