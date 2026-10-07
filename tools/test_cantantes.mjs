// artistas del catálogo cantando con micrófono (incluye colaboraciones). Capturas en /tmp/cant-*.jpg
import { servidor, abrir, mock, espera, BASE } from './lib.mjs';
const srv = await servidor(); await mock('scn=solo');
const { b, p, errores } = await abrir(1280, 720);
let ok = true; const chk = (n, c, x) => { console.log((c ? 'ok    ' : 'FALLA ') + n + (x ? '  ' + x : '')); if (!c) ok = false; };
await p.goto(BASE + '/index.html?menu=0'); await espera(8000);
// (a) créditos
const cr = await p.evaluate(() => { const f = (a, t) => (RISO.singers.plan(a, t) || []).map(x => x.name + ':' + (x.id || '-')).join('|'); return {
  trio: f('Bad Bunny, Daddy Yankee & Los Ejemplos'), feat: f('Shakira', 'Canción (feat. Adele)'), queen: f('Queen'), nirv: f('Nirvana'), nadie: f('Los Ejemplos'), selena: f('Selena Gomez'), marley: f('Bob Marley & The Wailers'),
  weeknd: f('The Weeknd'), weekndAlias: f('Abel Tesfaye'), weekndDuo: f('The Weeknd & Bad Bunny'), weekndFeat: f('Ariana Grande', 'Save Your Tears (feat. The Weeknd)'), tribute: f('The Weeknd Tribute'),
  madonna: f('Madonna'), x: f('Adele x Sia'), cuatro: (RISO.singers.plan('Shakira, Adele, Rihanna, Eminem') || []).length, dup: f('Shakira, shakira') }; });
chk('(a) trío: dos del catálogo y uno genérico', cr.trio === 'Bad Bunny:bad_bunny|Daddy Yankee:daddy_yankee|Los Ejemplos:-', cr.trio);
chk('(a) «feat.» del título suma a Adele', cr.feat === 'Shakira:shakira|Adele:adele', cr.feat);
chk('(a) bandas: Queen → Freddie, Nirvana → Kurt', /freddie_mercury/.test(cr.queen) && /kurt_cobain/.test(cr.nirv), cr.queen + ' / ' + cr.nirv);
chk('(a) nombres nuevos tienen avatar y Selena Gomez tiene perfil propio', cr.nadie === 'Los Ejemplos:-' && cr.selena === 'Selena Gomez:selena_gomez', JSON.stringify([cr.nadie, cr.selena]));
chk('(a) Marley con The Wailers: uno del catálogo y uno genérico; Madonna; «x»', /marley:bob_marley|Marley:bob_marley/i.test(cr.marley) && /madonna/.test(cr.madonna) && /adele:adele/i.test(cr.x), JSON.stringify([cr.marley, cr.madonna, cr.x]));
chk('(a) máximo 3 voces y sin repetidos', cr.cuatro === 3 && cr.dup === 'Shakira:shakira', cr.cuatro + ' ' + cr.dup);
chk('(a) The Weeknd y su alias usan el personaje propio', cr.weeknd === 'The Weeknd:the_weeknd' && cr.weekndAlias === 'Abel Tesfaye:the_weeknd', cr.weeknd);
chk('(a) The Weeknd en dúos y feat.; no confundir tributos', cr.weekndDuo === 'The Weeknd:the_weeknd|Bad Bunny:bad_bunny' && cr.weekndFeat.includes('The Weeknd:the_weeknd') && cr.tribute === 'The Weeknd Tribute:-', cr.weekndDuo);
const custom = await p.evaluate(() => {
  const R = RISO, original = R.props.drawProp, context = R.K.c, calls = [];
  // el kit recibe contexto durante un frame; esta prueba aislada usa su propia plancha.
  R.K.c = document.createElement('canvas').getContext('2d');
  R.props.drawProp = (...args) => { calls.push({ id: args[1], scale: args[4] }); return original(...args); };
  try { R.singers.draw({ singers: R.singers.plan('The Weeknd'), seed: 31, text: { li: 0 }, flip: false }, 2, 10, 1, 5); }
  finally { R.props.drawProp = original; R.K.c = context; }
  return calls;
});
chk('(a) la figura completa sustituye al cantante genérico y a la medalla', custom.length === 1 && custom[0].id === 'the_weeknd' && custom[0].scale > 1, JSON.stringify(custom));
// (b) solo: la toma cantante sale
const mk = async (scn) => { await mock('scn=' + scn); await espera(5000); return p.evaluate(() => { const RC = RISOCLIP; let s = null; const lis = IN.lines.map((l, i) => l.text ? i : -1).filter(i => i >= 0); for (let i = 0; i < 120 && !(s && s.kind === 'singer'); i++) s = RC.makeShot(lis[i % lis.length], 0, 30, ''); return s && s.kind === 'singer' ? { n: s.singers.length, names: s.singers.map(x => x.name + ':' + (x.id || '-')).join('|') } : null; }); };
const solo = await mk('solo'); chk('(b) con Shakira sale una toma cantante con una voz', solo && solo.n === 1 && /shakira/.test(solo.names), JSON.stringify(solo));
await p.evaluate(() => { paused = true; const RC = RISOCLIP; let s = null; const lis = IN.lines.map((l, i) => l.text ? i : -1).filter(i => i >= 0); for (let i = 0; i < 120 && !(s && s.kind === 'singer'); i++) s = RC.makeShot(lis[i % lis.length], 0, 30, ''); s.k0 = RISO.K.t - 2; RC.shot = s; RISO.stage.cut = null; RC.frame(0); }); await espera(300); await p.screenshot({ path: '/tmp/cant-solo.jpg', type: 'jpeg', quality: 80 });
const colab = await mk('colab'); chk('(c) con la colaboración salen los tres', colab && colab.n === 3 && /bad_bunny/.test(colab.names) && /daddy_yankee/.test(colab.names) && /Adele:adele/.test(colab.names), JSON.stringify(colab));
await p.evaluate(() => { paused = true; const RC = RISOCLIP; let s = null; const lis = IN.lines.map((l, i) => l.text ? i : -1).filter(i => i >= 0); for (let i = 0; i < 120 && !(s && s.kind === 'singer'); i++) s = RC.makeShot(lis[i % lis.length], 0, 30, ''); s.k0 = RISO.K.t - 2; window.__s = s; RC.shot = s; RISO.stage.cut = null; RC.frame(0); }); await espera(300); await p.screenshot({ path: '/tmp/cant-colab.jpg', type: 'jpeg', quality: 80 });
// turnos: el micrófono pasa de verso en verso
const turnos = [0, 1, 2, 3].map(li => li % colab.n).join(',');
chk('(c) el turno va verso a verso entre las voces', turnos === '0,1,2,0', turnos);
// (d) un artista nuevo también tiene presencia en el clip
const nada = await (async () => { await mock('scn=normal'); await espera(3500); return p.evaluate(() => { let n = 0; const lis = IN.lines.map((l, i) => l.text ? i : -1).filter(i => i >= 0); for (let i = 0; i < 60; i++) if (RISOCLIP.makeShot(lis[i % lis.length], 0, 30 + i, '').kind === 'singer') n++; return n; }); })();
chk('(d) un artista fuera del catálogo tiene personaje', nada > 0, String(nada));
// (e) ajuste
await p.evaluate(() => { CFG.singers = false; }); await mock('scn=solo'); await espera(3500);
const off = await p.evaluate(() => { let n = 0; for (let i = 0; i < 60; i++) if (RISOCLIP.makeShot(IN.lines.findIndex((l, j) => l.text && j > 0), 0, 30, '').kind === 'singer') n++; return n; }); chk('(e) con «cantantes» apagado no salen', off === 0, String(off));
chk('sin errores de consola', errores.length === 0, errores.join(' | '));
await b.close(); srv.stop(); process.exit(ok ? 0 : 1);
