// genera docs/CATALOGO.md desde el catálogo real cargado en el navegador (ids, etiqueta, categoría, palabras que lo disparan)
import { servidor, abrir, espera, BASE } from './lib.mjs';
import fs from 'node:fs';
const srv = await servidor(); const { b, p } = await abrir();
await p.goto(BASE + '/index.html?menu=0'); await espera(1500);
const d = await p.evaluate(() => ({ info: Object.values(RISO.catalog.info).map(e => ({ id: e.id, cat: e.cat, label: e.label, alias: e.alias.source.replace(/\\b/g, '').replace(/\|/g, ' · ').slice(0, 240), prio: e.prio, variantes: e.variantes || [] })), base: Object.keys(RISO.props.DEFS).filter(i => !RISO.catalog.info[i]) }));
const by = {}; for (const e of d.info) (by[e.cat] = by[e.cat] || []).push(e);
let md = `# catálogo de dibujos\n\ngenerado con \`node tools/catalogo_md.mjs\` desde el motor real. total: **${d.info.length + d.base.length}** dibujos (${d.info.length} en el catálogo + ${d.base.length} originales).\n\n`;
md += '| categoría | dibujos |\n|---|---|\n' + Object.entries(by).map(([c, l]) => `| ${c} | ${l.length} |`).join('\n') + `\n| originales (js/riso/props/riso-props.js) | ${d.base.length} |\n\n`;
for (const [c, l] of Object.entries(by)) { md += `## ${c} (${l.length})\n\n| id | etiqueta | palabras que lo disparan |\n|---|---|---|\n` + l.map(e => `| \`${e.id}\` | ${e.label} | ${e.alias.replace(/\|/g, '/')} |`).join('\n') + '\n\n'; }
md += `## originales\n\n${d.base.map(i => '`' + i + '`').join(', ')}\n\nse disparan con el léxico de \`interpret.js\` (LEX).\n`;
fs.writeFileSync('docs/CATALOGO.md', md); console.log('docs/CATALOGO.md', d.info.length + d.base.length);
await b.close(); srv.stop();
