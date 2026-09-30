// exploración (fase 7): mapa de ciudades, atlas de tu música y criatura. Capturas en /tmp/exp-*.jpg
import { servidor, abrir, mock, espera, BASE } from './lib.mjs';
const srv = await servidor(); await mock('scn=normal');
const { b, p, errores } = await abrir(1280, 900);
let ok = true; const chk = (n, c, x) => { console.log((c ? 'ok    ' : 'FALLA ') + n + (x ? '  ' + x : '')); if (!c) ok = false; };
await p.goto(BASE + '/index.html?menu=0'); await espera(5000);
const shot = n => p.screenshot({ path: `/tmp/exp-${n}.jpg`, type: 'jpeg', quality: 80 });
await p.evaluate(async () => { for (const c of ['historial', 'letras', 'criatura']) await RISOSTORE.clear(c); });
// (a) sin datos: los tres vistas dibujan y explican
await p.evaluate(() => RISOEXP.open('mapa')); await p.waitForSelector('#expWin canvas', { timeout: 60000 }); await espera(400); await shot('mapa-vacio');
chk('(a) el mapa vacío tiene más de 60 ciudades y ninguna encendida', await p.evaluate(() => RISOEXP.CITIES.length >= 60 && RISOEXP.pts.length === RISOEXP.CITIES.length && RISOEXP.pts.every(q => !q.n)), String(await p.evaluate(() => RISOEXP.CITIES.length)));
await p.click('#expWin [data-t=atlas]'); await espera(1500); await shot('atlas-vacio');
await p.click('#expWin [data-t=criatura]'); await espera(1500); await shot('criatura-huevo');
chk('(a) sin música la criatura es un huevo', await p.evaluate(() => RISOEXP.st.state === 'huevo' && RISOEXP.st.level === 0));
// datos de prueba
const now = Date.now();
await p.evaluate(async (now) => {
  const S = [['Noche de Neón', 'Los Ejemplos', 'pop', 'romantico', 9], ['Tren de Medianoche', 'Los Ejemplos', 'rock', 'oscuro', 4], ['Managua Blues', 'Nica Band', 'folk', 'nostalgico', 6], ['Brooklyn Nights', 'Dj Sol', 'house', 'euforico', 3], ['Lluvia en Madrid', 'La Sombra', 'pop', 'melancolico', 5],
    ['Bailando en Tokio', 'Dj Sol', 'house', 'euforico', 2], ['Sin ánimo', 'Nadie', '', '', 1], ['Mar de Cuba', 'Nica Band', 'folk', 'sereno', 7]];
  S.forEach(async ([name, artist, genre, mood, veces], i) => { await RISOSTORE.set('historial', 'k' + i, { key: 'k' + i, name, artist, album: '', dur: 200, genre, mood, veces, primera: now - 9e8, ultima: now - 3600e3 * (i % 3), completa: true }); });
  await RISOSTORE.set('letras', 'k2', { name: 'Managua Blues', artist: 'Nica Band', lineas: [[1, 'desde Managua con amor'], [5, 'otra noche sin ti'], [9, 'Managua me espera']], cuts: [0] });
  await RISOSTORE.set('letras', 'k3', { name: 'Brooklyn Nights', artist: 'Dj Sol', lineas: [[1, 'luces de Nueva York'], [5, 'Brooklyn no duerme']], cuts: [0] });
  await RISOSTORE.set('letras', 'k4', { name: 'Lluvia en Madrid', artist: 'La Sombra', lineas: [[1, 'llueve en Madrid otra vez'], [5, 'París queda lejos']], cuts: [0] });
  await RISOSTORE.set('letras', 'k5', { name: 'Bailando en Tokio', artist: 'Dj Sol', lineas: [[1, 'bailando en Tokio']], cuts: [0] });
  await RISOSTORE.set('letras', 'k7', { name: 'Mar de Cuba', artist: 'Nica Band', lineas: [[1, 'una noche en La Habana'], [4, 'nada de Santiago']], cuts: [0] });
}, now); await espera(800);
// (b) mapa con datos
await p.click('#expWin [data-t=mapa]'); await espera(1800); await shot('mapa');
const m = await p.evaluate(() => ({ lit: RISOEXP.pts.filter(q => q.n).map(q => q.id).sort(), hits: Object.fromEntries(Object.entries(RISOEXP.data.hits).map(([k, v]) => [k, v.n])) }));
chk('(b) se encienden las ciudades nombradas (con y sin acentos, sin falsos)', JSON.stringify(m.lit) === JSON.stringify(['habana', 'madrid', 'managua', 'nyc', 'paris', 'santiago', 'tokio']), JSON.stringify(m.hits));
chk('(b) Managua cuenta dos versos', m.hits.managua === 2);
// (c) seleccionar desde la lista y desde el mapa
await p.click('#expWin li[data-c=managua]'); await espera(1500); await shot('mapa-managua');
chk('(c) al elegir una ciudad salen sus canciones', await p.evaluate(() => /managua blues/i.test(document.getElementById("exSide").textContent) && RISOEXP.sel === 'managua'));
await p.evaluate(() => { RISOEXP.sel = null; }); await p.click('#expWin [data-t=mapa]'); await espera(1500);
const pos = await p.evaluate(() => { const pt = RISOEXP.pts.find(q => q.id === 'tokio'), out = document.querySelector('#expWin canvas'), r = out.getBoundingClientRect(), sK = out.height / 900; return { x: r.left + ((pt.x - 800) * sK + out.width / 2) / out.width * r.width, y: r.top + pt.y * sK / out.height * r.height }; });
await p.mouse.click(pos.x, pos.y); await espera(1500);
chk('(c) tocar el pin en el mapa lo selecciona', await p.evaluate(() => RISOEXP.sel === 'tokio' && /bailando en tokio/i.test(document.getElementById("exSide").textContent)));
// (d) atlas
await p.click('#expWin [data-t=atlas]'); await espera(1800); await shot('atlas');
const a = await p.evaluate(() => ({ pueblos: RISOEXP.pts.length, islas: RISOEXP.job.cells.map(c => c.m + ':' + c.g.length).join(',') }));
chk('(d) el atlas tiene un pueblito por canción y una isla por ánimo', a.pueblos === 8 && /euforico:2/.test(a.islas) && /:1/.test(a.islas), JSON.stringify(a));
await p.click('#expWin li[data-m=euforico]'); await espera(1500);
chk('(d) elegir una isla lista sus canciones', await p.evaluate(() => /brooklyn nights/i.test(document.getElementById("exSide").textContent) && /bailando en tokio/i.test(document.getElementById("exSide").textContent)));
// (e) criatura
await p.click('#expWin [data-t=criatura]'); await espera(2000); await shot('criatura');
const c1 = await p.evaluate(() => RISOEXP.st); chk('(e) el nombre automático es de sílabas reales', await p.evaluate(() => /^[A-Z][a-z]{3,6}$/.test(RISOEXP.st.name)), await p.evaluate(() => RISOEXP.st.name));
chk('(e) la criatura crece con las escuchas (nivel, estado, ánimo)', c1.total === 37 && c1.level === 6 && c1.state === 'contento' && c1.top === 'romantico', JSON.stringify({ t: c1.total, l: c1.level, s: c1.state, m: c1.top }));
await p.fill('#exName', 'Pipo'); await p.press('#exName', 'Tab'); await espera(500);
chk('(e) el nombre se guarda', await p.evaluate(async () => (await RISOSTORE.get('criatura', 'estado')).nombre === 'Pipo'));
await p.click('#expWin [data-t=mapa]'); await espera(1200); await p.click('#expWin [data-t=criatura]'); await espera(1500);
chk('(e) y vuelve con el nombre', await p.evaluate(() => RISOEXP.st.name === 'Pipo' && document.getElementById('exName').value === 'Pipo'));
await p.click('#expWin [data-a=pet]'); await espera(500); await shot('criatura-acaricia');
// hambre y sueño
await p.evaluate(async (now) => { const rows = await RISOSTORE.list('historial'); for (const r of rows) await RISOSTORE.set('historial', r.id, { ...r, ultima: now - 5 * 864e5 }); }, now); await p.click('#expWin [data-t=mapa]'); await espera(900); await p.click('#expWin [data-t=criatura]'); await espera(1500);
chk('(e) con 5 días sin música tiene hambre', await p.evaluate(() => RISOEXP.st.state) === 'hambriento'); await shot('criatura-hambre');
await p.evaluate(async (now) => { const rows = await RISOSTORE.list('historial'); for (const r of rows) await RISOSTORE.set('historial', r.id, { ...r, ultima: now - 20 * 864e5 }); }, now); await p.click('#expWin [data-t=mapa]'); await espera(900); await p.click('#expWin [data-t=criatura]'); await espera(1500);
chk('(e) con 20 días se duerme', await p.evaluate(() => RISOEXP.st.state) === 'dormido');
// (f) menú y cierre
await p.keyboard.press('Escape'); await espera(300); chk('(f) esc cierra', !(await p.evaluate(() => document.getElementById('expWin').classList.contains('on'))));
chk('(f) el ajuste «explorar» existe', await p.evaluate(() => !!SETUI.acts.explorar));
chk('sin errores de consola', errores.length === 0, errores.join(' | '));
await b.close(); srv.stop(); process.exit(ok ? 0 : 1);
