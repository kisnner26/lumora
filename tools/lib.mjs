// utilidades compartidas de las pruebas: navegador sin pantalla con webgl por software y puente simulado
import { chromium } from '/opt/node22/lib/node_modules/playwright/index.mjs';
import { spawn } from 'node:child_process';
export const PORT = 8899, BASE = 'http://127.0.0.1:' + PORT;
export async function servidor() {
  try { await fetch(BASE + '/now'); return { stop() {} }; } catch (e) {}
  const p = spawn('python3', ['tools/mock_bridge.py', String(PORT)], { stdio: 'ignore' });
  for (let i = 0; i < 30; i++) { try { await fetch(BASE + '/now'); break; } catch (e) { await new Promise(r => setTimeout(r, 200)); } }
  return { stop() { p.kill(); } };
}
export async function abrir(w = 1280, h = 720) {
  const b = await chromium.launch({ executablePath: process.env.CHROMIUM || '/opt/pw-browsers/chromium', args: ['--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--ignore-gpu-blocklist', '--no-sandbox'] });
  const p = await b.newPage({ viewport: { width: w, height: h } }), errores = [];
  const ruido = /fonts\.g|net::ERR|Failed to load resource|EventSource/;
  p.on('pageerror', e => errores.push('pageerror: ' + e.message));
  p.on('console', m => { if (m.type() === 'error' && !ruido.test(m.text())) errores.push('consola: ' + m.text()); });
  return { b, p, errores };
}
export const mock = (q) => fetch(BASE + '/mock?' + q).then(r => r.json());
export const espera = ms => new Promise(r => setTimeout(r, ms));
