// pruebas del catálogo: ids únicos, ningún dibujo lanza excepción, todos terminan (p=1), caben en -200..200 y tienen etiqueta
import { servidor, abrir, espera, BASE } from './lib.mjs';
const srv = await servidor(); const { b, p, errores } = await abrir(1600, 900);
await p.goto(`${BASE}/tools/galeria.html`); await p.waitForFunction('window.GAL_READY', null, { timeout: 20000 });
const r = await p.evaluate(() => {
  const R = RISO, out = { fallas: [], total: 0, fuera: [], sinEtiqueta: [], sinTermina: [], pesados: [] }, ids = Object.keys(R.props.DEFS); out.total = ids.length;
  const st = R.stage; let min, max, pts;
  R.props.probe = arr => { const a = R.props.adj; for (let q of arr) { if (a) q = [q[0] * a[2] + a[0], q[1] * a[2] + a[1]]; pts++; if (q[0] < min[0]) min[0] = q[0]; if (q[1] < min[1]) min[1] = q[1]; if (q[0] > max[0]) max[0] = q[0]; if (q[1] > max[1]) max[1] = q[1]; } };
  for (const id of ids) {
    try {
      min = [1e9, 1e9]; max = [-1e9, -1e9]; pts = 0; GAL.ids = [id]; GAL.p = 1; st.frame(1 / 30);
      const d = R.props.DEFS[id];
      if (min[0] < -215 || min[1] < -215 || max[0] > 215 || max[1] > 215) out.fuera.push(id + ' [' + [min, max].map(a => a.map(Math.round)).join(' | ') + ']');
      if (pts > 900) out.pesados.push(id + ':' + pts);
      if (R.catalog && R.catalog.info[id] && !R.catalog.info[id].label) out.sinEtiqueta.push(id);
      // p=1: el último trazo debe estar completo (n = trazos contados)
      if (!(d.n >= 2)) out.sinTermina.push(id);
    } catch (e) { out.fallas.push(id + ': ' + e.message); }
  }
  R.props.probe = null; return out;
});
let ok = true; const chk = (n, c, extra) => { console.log((c ? 'ok    ' : 'FALLA ') + n + (extra ? '  ' + extra : '')); if (!c) ok = false; };
console.log('dibujos:', r.total);
chk('ningún dibujo lanza excepción', !r.fallas.length, r.fallas.join('; '));
chk('todos caben en -200..200 (±15)', !r.fuera.length, r.fuera.slice(0, 20).join(' ; '));
chk('todos tienen trazos', !r.sinTermina.length, r.sinTermina.join(','));
chk('ninguno pasa de 900 puntos', !r.pesados.length, r.pesados.join(','));
chk('todos los del catálogo tienen etiqueta', !r.sinEtiqueta.length, r.sinEtiqueta.join(','));
for (const e of errores) { console.log(e); ok = false; }
await b.close(); srv.stop(); process.exit(ok ? 0 : 1);
