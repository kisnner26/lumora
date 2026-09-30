// captura tomas reales del clip con el puente simulado: node tools/clip_shot.mjs <salida-prefijo> <pos1> [pos2 ...]   (posiciones en segundos de la canción a)
import { servidor, abrir, mock, espera, BASE } from './lib.mjs';
const [out, ...pos] = process.argv.slice(2);
const srv = await servidor(); await mock('scn=normal');
const { b, p, errores } = await abrir(); await p.goto(BASE + '/index.html?menu=0'); await espera(3500);
for (const s of pos) {
  await mock(`song=a&pos=${s}`); await espera(+(process.env.ESPERA || 4200));
  const info = await p.evaluate(() => ({ k: RISOCLIP.shot?.kind, props: RISOCLIP.shot?.props?.map(q => q.id), scene: RISOCLIP.shot?.scene, txt: RISOCLIP.shot?.text?.text, inks: RISOCLIP.shot?.inks }));
  console.log(s, JSON.stringify(info)); await p.screenshot({ path: `${out}-${s}.png` });
}
for (const e of errores) console.log(e);
await b.close(); srv.stop();
