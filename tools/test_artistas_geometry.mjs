// identidades, detección sin falsos positivos y reloj procedural independiente de frames.
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import vm from 'node:vm';
const RISO = { K: {}, catalog: {}, props: {}, clamp: x => Math.max(0, Math.min(1, x)), easeOut: x => x };
const context = vm.createContext({ window: { RISO }, Math });
for (const file of ['riso-artistas', 'riso-cantantes', 'riso-geometry']) vm.runInContext(readFileSync(new URL('../js/riso/' + file + '.js', import.meta.url), 'utf8'), context);
const { artistFigures: A, singers: S, geometry: G } = RISO;
assert.ok(Object.keys(A.profiles).length >= 50);
for (const p of Object.values(A.profiles)) for (const name of p.names) assert.equal(S.idOf(name), p.id, name);
assert.equal(S.idOf('The Weeknd Tribute'), null);
assert.equal(S.idOf('Queen Tribute Band'), null);
assert.equal(S.idOf('Selena Gomez'), 'selena_gomez');
assert.equal(S.idOf('Selena'), 'selena');
assert.equal(S.idOf('TWENTY ØNE PILØTS'), 'tyler_joseph');
assert.equal(S.idOf('Beyoncé'), 'beyonce');
assert.equal(S.plan(''), null);
assert.equal(S.plan('Artista Nuevo')[0].id, null);
assert.deepEqual(JSON.stringify(A.profile('Artista Nuevo')), JSON.stringify(A.profile('artista nuevo')));
assert.equal(S.plan('The Weeknd & Bad Bunny', 'Song (feat. Ariana Grande)').length, 3);
assert.equal(S.plan('Shakira, shakira').length, 1);
assert.equal(S.plan('The Weeknd & Abel Tesfaye').length, 1);
assert.equal(G.levels.length, 22);
for (const l of G.levels) {
  assert.equal(G.detect(l.title, l.author), l, l.title);
  assert.equal(G.detect(l.title + ' (Official Audio)', l.author), l);
  assert.equal(G.detect(l.title, 'artista ajeno'), null, 'no confundir: ' + l.title);
  assert.equal(G.detect(l.title, 'artista ajeno', 'Geometry Dash soundtrack'), l);
  for (let t = 0; t <= 180; t += .37) {
    const s = G.state(l, t);
    for (const key of ['y', 'scroll', 'angle', 'portal']) assert.ok(Number.isFinite(s[key]), l.title + '/' + key);
    assert.ok(s.y >= 170 && s.y <= 690, l.title + ' fuera del corredor');
    assert.equal(JSON.stringify(G.state(l, t)), JSON.stringify(s), 'determinismo tras buscar');
  }
  const forms = new Set(l.modes.map((_, i) => G.state(l, (i * 16 + 8) * 60 / l.bpm).mode));
  assert.equal(forms.size, new Set(l.modes).size);
  const a = G.state(l, 1, true), b = G.state(l, 1.1, true);
  assert.equal(a.y, b.y); assert.equal(a.scroll, b.scroll); assert.equal(a.angle, 0);
}
assert.equal(G.detect('Dash', 'otro'), null);
assert.equal(G.detect('Jumper', 'Third Eye Blind'), null);
assert.equal(G.detect('Time Machine', 'Alicia Keys'), null);
assert.equal(G.detect('Stereo Madness Remix', 'ForeverBound'), null);
assert.equal(G.detect('Fingerbang', 'MDK').id, 21);
assert.equal(G.detect('Geometry Dash (Official Theme Song)', 'MDK').id, 22);
assert.equal(G.detect('-BlastProcess-', 'Waterflame').id, 17);
assert.equal(G.detect("Can't Let Go", 'DJVI').id, 6);
assert.equal(G.detect('Clubstep', 'DJ-Nate').id, 14);
assert.equal(G.detect('otra canción', 'Waterflame'), null);
// la fase rápida no produce saltos de escenario al entrar ni al salir.
const electro = G.levels[14], fast = electro.modes.indexOf('fast');
for (const beat of [fast * 16, (fast + 1) * 16]) {
  const before = G.state(electro, (beat - .001) * 60 / electro.bpm).scroll;
  const after = G.state(electro, (beat + .001) * 60 / electro.bpm).scroll;
  assert.ok(after >= before && after - before < 1);
}
console.log(`ok: ${Object.keys(A.profiles).length} perfiles, aliases y colaboraciones; 22 niveles, variantes, falsos positivos, seeks y movimiento reducido`);
