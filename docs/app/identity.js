// ============================================================
// identity.js — personajes con identidad.
// Las figuras de cada artista se ven igual en todas sus canciones:
// mismo color de luz, misma estatura, mismos accesorios y la misma
// franja de color en la ropa. Todo sale del nombre del artista, así
// que no hay que guardar nada y cada artista es un universo propio.
// ============================================================
const IDN = { key: '', v: null };
function artistIdentity() {
  const main = ((typeof ext !== 'undefined' && ext.st.artist) || proc.artist || '').split(/,|&| feat\.?| ft\.?| x /i)[0].trim().toLowerCase();
  if (main === IDN.key && IDN.v) return IDN.v;
  const r = mulberry(hashStr('identidad|' + main));
  const pick = a => a[Math.floor(r() * a.length)];
  const hue = Math.floor(r() * 360);
  IDN.key = main;
  IDN.v = main ? {
    hue, rim: `hsla(${hue}, 85%, 68%, .9)`, trim: `hsla(${(hue + 30) % 360}, 80%, 58%, .95)`,
    scale: .94 + r() * .14,
    man: [pick(['gorra', 'gorro', 'capucha', 'nada']), pick(['lentes', 'cadena', 'nada', 'lentes'])],
    woman: [pick(['aretes', 'mono', 'nada']), pick(['lentes', 'collar', 'nada', 'collar'])],
  } : null;
  return IDN.v;
}

// accesorios sobre la silueta (mismo sistema de coordenadas que las figuras de earth.js)
function manExtras(cx, by, s, sway, id) {
  x.save(); x.translate(cx, by); x.rotate(sway * .04);
  const hy = -s * 1.93, hr = s * .21, dark = 'rgba(6,6,10,.97)';
  x.strokeStyle = id.trim; x.lineWidth = Math.max(1.5, s * .035); x.lineCap = 'round';
  x.beginPath(); x.moveTo(-s * .44, -s * 1.5); x.lineTo(-s * .33, -s * .9); x.moveTo(s * .44, -s * 1.5); x.lineTo(s * .33, -s * .9); x.stroke();   // franja del saco
  for (const a of id.man) {
    if (a === 'gorra') { x.fillStyle = dark; x.beginPath(); x.arc(0, hy - hr * .15, hr * 1.02, Math.PI, 0); x.fill(); x.fillRect(0, hy - hr * .25, hr * 1.7, hr * .22);
      x.strokeStyle = id.rim; x.lineWidth = 1.4; x.beginPath(); x.arc(0, hy - hr * .15, hr * 1.02, Math.PI * 1.1, Math.PI * 1.9); x.stroke(); }
    if (a === 'gorro') { x.fillStyle = dark; x.beginPath(); x.ellipse(0, hy - hr * .55, hr * 1.02, hr * .8, 0, Math.PI, 0); x.fill(); x.fillRect(-hr * 1.05, hy - hr * .6, hr * 2.1, hr * .32);
      x.fillStyle = id.trim; x.fillRect(-hr * 1.05, hy - hr * .6, hr * 2.1, hr * .1); }
    if (a === 'capucha') { x.strokeStyle = id.rim; x.lineWidth = 1.6; x.fillStyle = dark; x.beginPath(); x.arc(0, hy + hr * .1, hr * 1.35, Math.PI * .95, Math.PI * 2.05); x.lineTo(s * .3, -s * 1.62); x.lineTo(-s * .3, -s * 1.62); x.closePath(); x.fill(); x.stroke();
      x.fillStyle = 'rgba(6,6,10,1)'; x.beginPath(); x.arc(0, hy + hr * .1, hr * .95, 0, Math.PI * 2); x.fill(); }
    if (a === 'lentes') { x.fillStyle = 'rgba(0,0,0,.95)'; x.fillRect(-hr * .85, hy - hr * .12, hr * 1.7, hr * .34); x.fillStyle = id.rim; x.fillRect(-hr * .7, hy - hr * .08, hr * .35, hr * .07); }
    if (a === 'cadena') { x.strokeStyle = 'rgba(255,214,140,.95)'; x.lineWidth = Math.max(1.5, s * .025); x.beginPath(); x.arc(0, -s * 1.62, s * .2, Math.PI * .15, Math.PI * .85); x.stroke();
      x.fillStyle = 'rgba(255,214,140,.95)'; x.beginPath(); x.arc(0, -s * 1.41, s * .035, 0, Math.PI * 2); x.fill(); }
  }
  x.restore();
}
function womanExtras(cx, by, s, sway, id) {
  x.save(); x.translate(cx, by); x.rotate(sway * .06);
  const hy = -s * 1.86, hr = s * .2;
  x.strokeStyle = id.trim; x.lineWidth = Math.max(1.5, s * .035); x.lineCap = 'round';
  x.beginPath(); x.moveTo(-s * .46, -s * .09); x.quadraticCurveTo(0, -s * .03, s * .46, -s * .09); x.stroke();                                   // franja del vestido
  for (const a of id.woman) {
    if (a === 'aretes') { x.fillStyle = id.rim; for (const sd of [-1, 1]) { x.beginPath(); x.arc(sd * hr * .95, hy + hr * .55, Math.max(1.6, hr * .13), 0, Math.PI * 2); x.fill(); } }
    if (a === 'mono') { x.fillStyle = 'rgba(6,6,10,.97)'; x.beginPath(); x.arc(0, hy - hr * 1.35, hr * .55, 0, Math.PI * 2); x.fill(); x.strokeStyle = id.rim; x.lineWidth = 1.4; x.stroke(); }
    if (a === 'lentes') { x.fillStyle = 'rgba(0,0,0,.95)'; x.fillRect(-hr * .8, hy - hr * .1, hr * 1.6, hr * .3); x.fillStyle = id.rim; x.fillRect(-hr * .66, hy - hr * .06, hr * .3, hr * .06); }
    if (a === 'collar') { x.strokeStyle = id.rim; x.lineWidth = Math.max(1.3, s * .02); x.beginPath(); x.arc(0, -s * 1.58, s * .13, Math.PI * .15, Math.PI * .85); x.stroke(); }
  }
  x.restore();
}

// las figuras de earth.js pasan por aquí: color de luz y estatura del artista, y sus accesorios encima
{ const _w = womanFig, _m = manFig;
  womanFig = function (cx, by, s, sway, col, rim) { const id = artistIdentity(); if (!id) return _w(cx, by, s, sway, col, rim); const ss = s * id.scale; _w(cx, by, ss, sway, col, rim || id.rim); womanExtras(cx, by, ss, sway, id); };
  manFig = function (cx, by, s, sway, col, rim) { const id = artistIdentity(); if (!id) return _m(cx, by, s, sway, col, rim); const ss = s * id.scale; _m(cx, by, ss, sway, col, rim || id.rim); manExtras(cx, by, ss, sway, id); };
}
