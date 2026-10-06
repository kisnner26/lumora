// ============================================================
// earth.js — la tierra también cuenta historias.
// Personas, objetos, lugares y escenarios terrestres para el
// intérprete; vocabulario en español (incluido el urbano);
// traducción al español en el dispositivo; eco de la palabra clave.
// ============================================================

// ---------- vocabulario nuevo (inglés, español y jerga urbana) ----------
LEX.push(
  ['woman',   /\b(woman|women|girl\w*|lady|shorty|she|her|mujer\w*|chica\w*|chamaca|nena\w*|mami\w*|gata\w*|jeva\w*|morena\w*|rubia\w*|bellaca\w*|diabla|reina|princesa)\b/i, 'ella'],
  ['man',     /\b(man|men|boy\w*|guy\w*|bro|brother|he|him|hombre\w*|chico\w*|papi\w*|hermano\w*|pana\w*|cabr[oó]n\w*|loco|mano|tipo)\b/i, 'él'],
  ['couple',  /\b(we|us|together|you and me|nosotros|juntos|juntas|tú y yo|contigo|conmigo|pareja)\b/i, 'nosotros'],
  ['crowd',   /\b(people|everybody|everyone|crowd|fans|gente|todos|todas|multitud|público|la calle entera|el barrio)\b/i, 'la gente'],
  ['phone',   /\b(phone\w*|call|calls|calling|called|text|texts|texting|texted|dm|ig|insta\w*|facetime|tel[eé]fono\w*|cel\w*|llamad\w*|llam[oaé]\w*|mensaje\w*|whatsapp|story|stories)\b/i, 'teléfono'],
  ['beach',   /\b(beach\w*|sand|island\w*|palm\w*|playa\w*|arena|isla\w*|palmera\w*|caribe|puerto rico|pr|miami|tropical|bikini)\b/i, 'playa'],
  ['mountain',/\b(mountain\w*|hill\w*|top|summit|montaña\w*|cerro\w*|cima|cumbre|valle)\b/i, 'montaña'],
  ['forest',  /\b(tree\w*|forest\w*|wood\w*|leaf|leaves|jungle|árbol\w*|arbol\w*|bosque\w*|hoja\w*|selva)\b/i, 'bosque'],
  ['drink',   /\b(drink\w*|drunk|bottle\w*|glass|shot\w*|whisk\w*|tequila|champagne|wine|beer|vodka|henny|trago\w*|copa\w*|botella\w*|vino|cerveza\w*|borrach\w*|beb\w*|pisto)\b/i, 'tragos'],
  ['smoke',   /\b(smok\w*|weed|blunt\w*|joint|high|cigar\w*|vape|humo|fum\w*|porro\w*|cigarr\w*|nota|pas[oó] el blunt|hookah|hierba)\b/i, 'humo'],
  ['fashion', /\b(chanel|gucci|prada|dior|louis|balenciaga|versace|fendi|drip|outfit|clothes|dress|jeans|ropa|vestido\w*|prenda\w*|marca\w*|cadena\w*|chain\w*|jewel\w*|joya\w*|anillo\w*|ring\w*|tenis|sneaker\w*|jordan\w*)\b/i, 'moda'],
  ['money',   /\b(money|cash|bills?|bank|pay\w*|dollar\w*|racks|paper|dinero|chavo\w*|feria|lana|plata|billete\w*|banco|pag\w*|cuenta\w*|millon\w*|million\w*)\b/i, 'dinero'],
  ['music',   /\b(music|song\w*|beat\w*|bass|radio|dj|speaker\w*|melod\w*|m[uú]sica|canci[oó]n\w*|ritmo|perreo|reggaet[oó]n|bajo|bocina\w*|disco|tema)\b/i, 'música'],
  ['plane',   /\b(plane\w*|jet\w*|flight\w*|airport|pilot\w*|avi[oó]n\w*|vuelo\w*|aeropuerto|piloto\w*|viaj\w*|travel\w*)\b/i, 'viaje'],
);
// jerga urbana que ya existía como concepto
LEX.push(
  ['dance',  /\b(perre\w*|twerk\w*|bellaque\w*|jangue\w*|janguear|party|disco\w*|discoteca\w*|club|pista|mueve\w*|men[eé]a\w*|culea\w*|bailoteo)\b/i, 'baile'],
  ['road',   /\b(lambo\w*|ferrari|porsche|benz|bmw|nave\w*|carro\w*|guagua\w*|moto\w*|bici\w*|calle\w*|avenida\w*|autopista)\b/i, 'carretera'],
  ['love',   /\b(beb[eé]|bebecita|mi amor|cari[nñ]o|te quiero|te amo|besit\w*|chingar|hacerlo|piel|labios|lips|body|cuerpo\w*)\b/i, 'amor'],
  ['dark',   /\b(tarde|madrugada|4am|3am|late night|after)\b/i, 'noche'],
  ['sun',    /\b(calor|caliente|hot|heat|sudor|sweat)\b/i, 'sol'],
);
// el humo deja de ser fuego
const fireIdx = LEX.findIndex(l => l[0] === 'fire');
if (fireIdx >= 0) LEX[fireIdx][1] = /\b(fire\w*|burn\w*|flame\w*|fuego\w*|quem\w*|arde\w*|llama\w*|hell|infierno)\b/i;
MOOD.push(
  [/\b(vacil\w*|goz\w*|disfrut\w*|rico|rica|brutal|dur[oa]|chulo|chula|lindo|linda|bonito|bonita|perfect\w*|perfecto|perfecta)\b/i, .45, .25],
  [/\b(despecho|ya no|olvid\w*|te fuiste|se fue|sin ti|sin mí|traici\w*|mentir\w*|mentira\w*|fake)\b/i, -.55, .1],
  [/\b(perre\w*|dale|fuego|en llamas|pa'l piso|hasta abajo|duro|turn up|lit)\b/i, .2, .6],
);

// ---------- figuras humanas originales (siluetas simples) ----------
// ---------- figuras humanas originales (siluetas con borde de luz) ----------
// mujer: pelo largo que cae hasta media espalda y se mueve con el ritmo, vestido acampanado
function womanFig(cx, by, s, sway, col, rim = C(0, .8, 25)) {
  x.save(); x.translate(cx, by); x.rotate(sway * .06);
  const hy = -s * 1.86, hr = s * .2, swing = Math.sin((IN.clock || 0) * 2.2) * s * .05 + sway * s * .08;
  const hair = () => {                                            // melena que enmarca la cara y cae a los lados (no tapa cuello ni cara)
    const ls = -hr * 1.45 + swing, rs = hr * 1.45 + swing, bot = -s * .98;
    x.beginPath(); x.moveTo(ls, bot);
    x.bezierCurveTo(-hr * 1.55, hy + s * .45, -hr * 1.5, hy - hr * .2, -hr * 1.1, hy - hr * .8);   // lado izquierdo, por fuera
    x.bezierCurveTo(-hr * .5, hy - hr * 1.5, hr * .5, hy - hr * 1.5, hr * 1.1, hy - hr * .8);       // coronilla
    x.bezierCurveTo(hr * 1.5, hy - hr * .2, hr * 1.55, hy + s * .45, rs, bot);                       // lado derecho, por fuera
    x.lineTo(rs - hr * .25, bot - s * .05); x.lineTo(rs - hr * .45, bot + s * .02);                  // puntas
    x.bezierCurveTo(hr * .95 + swing * .5, hy + s * .5, hr * .9, hy + hr * .5, hr * .82, hy);        // lado derecho, junto a la cara
    x.quadraticCurveTo(hr * .6, hy - hr * .75, 0, hy - hr * .62);                                    // flequillo
    x.quadraticCurveTo(-hr * .6, hy - hr * .75, -hr * .82, hy);
    x.bezierCurveTo(-hr * .9, hy + hr * .5, -hr * .95 + swing * .5, hy + s * .5, ls + hr * .45, bot + s * .02);
    x.lineTo(ls + hr * .25, bot - s * .05); x.closePath();
  };
  const strands = () => {                                         // mechones: textura de pelo
    for (const sd of [-1, 1]) for (let i = 0; i < 3; i++) {
      const o = hr * (1.05 + i * .13) * sd;
      x.beginPath(); x.moveTo(o * .9, hy - hr * .3); x.bezierCurveTo(o * 1.1, hy + s * .3, o * 1.05 + swing, hy + s * .6, o + swing, -s * 1.02 - i * s * .03); x.stroke();
    }
  };
  x.fillStyle = col; x.beginPath(); x.arc(0, hy, hr, 0, TAU); x.fill();                        // cabeza (la cara queda libre)
  x.fillStyle = col; hair(); x.fill();                                                      // pelo detrás del cuerpo
  x.beginPath(); x.moveTo(-s * .5, -s * .02); x.quadraticCurveTo(-s * .28, -s * .75, -s * .2, -s * 1.28);   // vestido con hombros
  x.quadraticCurveTo(-s * .27, -s * 1.5, -s * .1, -s * 1.56); x.lineTo(s * .1, -s * 1.56); x.quadraticCurveTo(s * .27, -s * 1.5, s * .2, -s * 1.28);
  x.quadraticCurveTo(s * .28, -s * .75, s * .5, -s * .02); x.closePath(); x.fill();
  x.strokeStyle = col; x.lineCap = 'round'; x.lineWidth = s * .08;
  x.beginPath(); x.moveTo(-s * .12, -s * .05); x.lineTo(-s * .13, s * .02); x.moveTo(s * .12, -s * .05); x.lineTo(s * .13, s * .02); x.stroke();   // piernas
  x.lineWidth = s * .07; x.beginPath(); x.moveTo(-s * .2, -s * 1.22); x.lineTo(-s * .46, -s * (.85 + sway * .25)); x.moveTo(s * .2, -s * 1.22); x.lineTo(s * .44, -s * (1.72 - sway * .3)); x.stroke();   // brazos
  x.beginPath(); x.moveTo(-s * .07, -s * 1.5); x.lineTo(-s * .06, -s * 1.7); x.lineTo(s * .06, -s * 1.7); x.lineTo(s * .07, -s * 1.5); x.fill();   // cuello
  x.fillStyle = col; hair(); x.fill();                                                      // melena encima de la cabeza
  x.strokeStyle = rim; x.lineWidth = 1.6; hair(); x.stroke();                               // borde de luz: el pelo se lee claro
  x.lineWidth = 1; x.globalAlpha *= .55; strands(); x.globalAlpha /= .55;
  x.beginPath(); x.moveTo(-s * .5, -s * .02); x.quadraticCurveTo(-s * .28, -s * .75, -s * .2, -s * 1.28); x.stroke();
  x.restore();
}
// hombre: pelo corto, hombros anchos, pantalón
function manFig(cx, by, s, sway, col, rim = C(2, .8, 25)) {
  x.save(); x.translate(cx, by); x.rotate(sway * .04); x.fillStyle = col; x.strokeStyle = col; x.lineCap = 'round';
  x.lineWidth = s * .17; x.beginPath(); x.moveTo(-s * .16, 0); x.lineTo(-s * .13, -s * .92); x.moveTo(s * .16, 0); x.lineTo(s * .13, -s * .92); x.stroke();   // pantalón
  const torso = () => { x.beginPath(); x.moveTo(-s * .3, -s * .85); x.lineTo(-s * .5, -s * 1.58); x.quadraticCurveTo(0, -s * 1.7, s * .5, -s * 1.58); x.lineTo(s * .3, -s * .85); x.closePath(); };
  torso(); x.fill();
  x.lineWidth = s * .13; x.beginPath(); x.moveTo(-s * .47, -s * 1.52); x.lineTo(-s * .6, -s * (.98 + sway * .3)); x.moveTo(s * .47, -s * 1.52); x.lineTo(s * .62, -s * (1.02 - sway * .3)); x.stroke();
  x.beginPath(); x.moveTo(-s * .08, -s * 1.62); x.lineTo(-s * .08, -s * 1.74); x.lineTo(s * .08, -s * 1.74); x.lineTo(s * .08, -s * 1.62); x.fill();
  x.beginPath(); x.arc(0, -s * 1.93, s * .21, 0, TAU); x.fill();                            // cabeza
  x.beginPath(); x.arc(0, -s * 1.97, s * .22, Math.PI * 1.05, Math.PI * 1.95); x.lineTo(s * .2, -s * 1.9); x.lineTo(-s * .2, -s * 1.9); x.fill();   // pelo corto
  x.strokeStyle = rim; x.lineWidth = 1.6; torso(); x.stroke();
  x.beginPath(); x.arc(0, -s * 1.93, s * .21, Math.PI * 1.1, Math.PI * 1.9); x.stroke();
  x.restore();
}

// ---------- capas terrestres ----------
Object.assign(MOTIF, {
  woman(k, t, E) {
    const s = S() * .16, sway = Math.sin(IN.beatCount * Math.PI / 2 + IN.beat) * .8;
    glow(W * .72, H * .72, s * 2.2, CA(0, 15), .25 * k);
    x.globalAlpha = k; womanFig(W * .72, H * .96, s, sway, 'rgba(6,6,10,.95)'); x.globalAlpha = 1;
    x.strokeStyle = C(0, .6 * k, 25); x.lineWidth = 1.5; x.beginPath(); x.arc(W * .72, H * .96 - s * 1.78, s * .21, Math.PI * 1.1, Math.PI * 1.8); x.stroke();
  },
  man(k, t, E) {
    const s = S() * .16, sway = Math.sin(IN.beatCount * Math.PI / 2) * .6;
    glow(W * .28, H * .72, s * 2.2, CA(2, 15), .25 * k);
    x.globalAlpha = k; manFig(W * .28, H * .96, s, sway, 'rgba(6,6,10,.95)'); x.globalAlpha = 1;
    x.strokeStyle = C(2, .6 * k, 25); x.lineWidth = 1.5; x.beginPath(); x.arc(W * .28, H * .96 - s * 1.9, s * .23, Math.PI * 1.1, Math.PI * 1.8); x.stroke();
  },
  couple(k, t, E) {
    const s = S() * .13, cx = W / 2, by = H * .97, lean = Math.sin(t * .8) * .3;
    glow(cx, by - s * 1.4, s * 3, CA(1, 20), .3 * k);
    x.globalAlpha = k;
    manFig(cx - s * .45, by, s, lean, 'rgba(6,6,10,.95)'); womanFig(cx + s * .45, by, s * .93, -lean, 'rgba(6,6,10,.95)');
    x.strokeStyle = 'rgba(6,6,10,.95)'; x.lineWidth = s * .1; x.beginPath(); x.moveTo(cx - s * .05, by - s * 1.05); x.quadraticCurveTo(cx, by - s * .95, cx + s * .1, by - s * 1.05); x.stroke();
    x.globalAlpha = 1;
  },
  crowd(k, t, E) {
    x.fillStyle = `rgba(4,4,8,${.95 * k})`;
    for (let i = 0; i < 26; i++) {
      const u = (i + .5) / 26, jump = Math.max(0, Math.sin(IN.beatCount * Math.PI + i * 1.7)) * IN.beat * 18, s = S() * (.05 + (i % 3) * .01);
      const cx = u * W, by = H + s * .4 - jump;
      x.beginPath(); x.ellipse(cx, by, s * 1.1, s * .9, 0, Math.PI, 0); x.fill();
      x.beginPath(); x.arc(cx, by - s * 1.2, s * .45, 0, TAU); x.fill();
      if (i % 4 === 0) { x.fillRect(cx + s * .5, by - s * 2.4 - jump * .3, s * .18, s * 1.3); }
    }
  },
  phone(k, t, E) {
    const w = S() * .16, h = w * 2, cx = W * .74, cy = H * .42;
    glow(cx, cy, w * 1.6, 'rgba(160,190,255,A)', .35 * k);
    x.fillStyle = `rgba(8,10,16,${.9 * k})`; x.strokeStyle = `rgba(220,230,255,${.7 * k})`; x.lineWidth = 2;
    x.beginPath(); x.roundRect(cx - w / 2, cy - h / 2, w, h, w * .16); x.fill(); x.stroke();
    x.fillStyle = `rgba(120,160,255,${.25 * k})`; x.beginPath(); x.roundRect(cx - w * .42, cy - h * .44, w * .84, h * .88, w * .1); x.fill();
    for (let i = 0; i < 4; i++) {
      const kk = (t * .25 + i / 4) % 1, bw = w * (.5 + (i % 2) * .2);
      x.fillStyle = `rgba(${i % 2 ? '120,190,120' : '240,240,250'},${k * Math.sin(kk * Math.PI) * .9})`;
      x.beginPath(); x.roundRect(cx - w * .36 + (i % 2) * w * .2, cy + h * .35 - kk * h * .7, bw, w * .14, w * .07); x.fill();
    }
  },
  beach(k, t, E) {
    const hz = H * .7;
    glow(W / 2, hz, S() * .5, 'rgba(255,150,90,A)', .35 * k);
    x.fillStyle = `rgba(255,200,140,${.8 * k})`; x.beginPath(); x.arc(W / 2, hz, S() * .06, Math.PI, 0); x.fill();
    for (let i = 0; i < 5; i++) { x.fillStyle = `rgba(255,190,130,${.3 * k})`; x.fillRect(W / 2 - S() * (.1 - i * .015), hz + 6 + i * 9, S() * (.2 - i * .03), 2); }
    const palm = (bx, s, dir) => {
      x.strokeStyle = `rgba(4,4,6,${k})`; x.lineWidth = s * .06; x.lineCap = 'round';
      x.beginPath(); x.moveTo(bx, H); x.quadraticCurveTo(bx + dir * s * .3, H - s * .6, bx + dir * s * .15, H - s * 1.1); x.stroke();
      const tx = bx + dir * s * .15, ty = H - s * 1.1;
      for (let j = 0; j < 7; j++) { const a = -Math.PI / 2 + (j - 3) * .45 + Math.sin(t + j) * .05;
        x.lineWidth = s * .03; x.beginPath(); x.moveTo(tx, ty); x.quadraticCurveTo(tx + Math.cos(a) * s * .35, ty + Math.sin(a) * s * .35 - s * .05, tx + Math.cos(a) * s * .6, ty + Math.sin(a) * s * .35 + s * .15); x.stroke(); }
    };
    palm(W * .08, S() * .7, 1); palm(W * .92, S() * .6, -1);
  },
  mountain(k, t) {
    for (let l = 0; l < 3; l++) {
      x.fillStyle = `rgba(${14 + l * 10},${16 + l * 12},${26 + l * 14},${.85 * k})`; x.beginPath(); x.moveTo(0, H);
      for (let i = 0; i <= 30; i++) { const u = i / 30, n = Math.abs(Math.sin(u * (5 + l * 3) + l * 2)) * .6 + Math.abs(Math.sin(u * 13 + l)) * .25;
        x.lineTo(u * W, H * (.55 + l * .12) - n * H * (.22 - l * .05)); }
      x.lineTo(W, H); x.fill();
      x.fillStyle = `rgba(230,235,245,${.05 * k})`; x.fillRect(0, H * (.62 + l * .12), W, 30);
    }
  },
  forest(k, t) {
    for (let i = 0; i < 18; i++) {
      const u = (i * .137 + .03) % 1, s = S() * (.12 + (i % 4) * .05), bx = u * W, by = H;
      x.fillStyle = `rgba(4,8,6,${.92 * k})`;
      for (let j = 0; j < 4; j++) { const w = s * (.5 - j * .1), y = by - s * (.3 + j * .35);
        x.beginPath(); x.moveTo(bx - w, y + s * .3); x.lineTo(bx, y - s * .25); x.lineTo(bx + w, y + s * .3); x.fill(); }
      x.fillRect(bx - s * .03, by - s * .3, s * .06, s * .3);
    }
    for (const d of P('leaf', 40, () => [rnd(), rnd(), rnd() * TAU, .5 + rnd()])) {
      const y = ((d[1] + t * .05 * d[3]) % 1) * H, xx = d[0] * W + Math.sin(t + d[2]) * 30;
      x.save(); x.translate(xx, y); x.rotate(t * d[3] + d[2]); x.fillStyle = `rgba(${150 + d[3] * 60},${120 + d[3] * 40},60,${.7 * k})`;
      x.beginPath(); x.ellipse(0, 0, 5, 2.5, 0, 0, TAU); x.fill(); x.restore();
    }
  },
  drink(k, t, E) {
    const cx = W * .5, cy = H * .55, s = S() * .12;
    x.strokeStyle = `rgba(243,236,223,${.6 * k})`; x.lineWidth = 2;
    x.beginPath(); x.moveTo(cx - s * .6, cy - s); x.lineTo(cx, cy); x.lineTo(cx + s * .6, cy - s); x.moveTo(cx, cy); x.lineTo(cx, cy + s * .8); x.moveTo(cx - s * .35, cy + s * .8); x.lineTo(cx + s * .35, cy + s * .8); x.stroke();
    x.fillStyle = C(0, .35 * k, 10); x.beginPath(); x.moveTo(cx - s * .45, cy - s * .75); x.lineTo(cx, cy); x.lineTo(cx + s * .45, cy - s * .75); x.fill();
    for (const d of P('bub', 90, () => [rnd(), rnd(), .3 + rnd()])) {
      const y = H - ((d[1] + t * .08 * d[2]) % 1) * H, xx = d[0] * W + Math.sin(t * 2 + d[0] * 30) * 6;
      x.strokeStyle = `rgba(255,240,210,${.45 * k})`; x.lineWidth = 1; x.beginPath(); x.arc(xx, y, 1.5 + d[2] * 3, 0, TAU); x.stroke();
    }
  },
  smoke(k, t) {
    for (const d of P('smoke', 16, () => [rnd(), rnd(), rnd() * TAU, .5 + rnd()])) {
      const kk = (d[1] + t * .03 * d[3]) % 1, y = H - kk * H * 1.1, xx = d[0] * W + Math.sin(t * .4 + d[2] + kk * 4) * 80;
      glow(xx, y, S() * (.1 + kk * .25), 'rgba(200,200,210,A)', .12 * k * Math.sin(kk * Math.PI));
    }
  },
  fashion(k, t, E) {
    for (let r = 0; r < 4; r++) {
      x.strokeStyle = C(r, .35 * k, 20); x.lineWidth = 10 - r * 2; x.lineCap = 'round'; x.beginPath();
      for (let i = 0; i <= 40; i++) { const u = i / 40, y = H * (.2 + r * .18) + Math.sin(u * 6 + t * (.6 + r * .2) + r) * H * .06;
        i ? x.lineTo(u * W, y) : x.moveTo(u * W, y); }
      x.stroke();
    }
    MOTIF.gold(k, t, E);
  },
  money(k, t) {
    for (const d of P('bill', 45, () => [rnd(), rnd(), rnd() * TAU, .5 + rnd()])) {
      const y = ((d[1] + t * .06 * d[3]) % 1.1 - .05) * H, xx = d[0] * W + Math.sin(t + d[2]) * 40;
      x.save(); x.translate(xx, y); x.rotate(Math.sin(t * d[3] + d[2]) * 1.2); x.scale(1, Math.cos(t * 2 * d[3] + d[2]));
      x.fillStyle = `rgba(120,170,110,${.75 * k})`; x.fillRect(-14, -7, 28, 14);
      x.strokeStyle = `rgba(40,70,40,${.8 * k})`; x.lineWidth = 1; x.strokeRect(-12, -5, 24, 10);
      x.beginPath(); x.arc(0, 0, 3, 0, TAU); x.stroke(); x.restore();
    }
  },
  music(k, t, E) {
    const n = 48, bw = W / n;
    for (let i = 0; i < n; i++) {
      const b = bands[Math.floor(i / n * 24)], h = (.04 + IN.beat * .12 + b * .2) * H * (.6 + .4 * Math.sin(i * .7 + t * 3) ** 2);
      x.fillStyle = C(i, .55 * k, 15); x.fillRect(i * bw + 1, H - h, bw - 2, h);
    }
  },
  plane(k, t) {
    const kk = (t * .06) % 1, px = lerp(-W * .1, W * 1.1, kk), py = H * (.3 - kk * .12);
    x.strokeStyle = `rgba(245,245,250,${.4 * k})`; x.lineWidth = 3; x.beginPath(); x.moveTo(-W * .1, H * .3); x.lineTo(px, py); x.stroke();
    x.fillStyle = `rgba(245,245,250,${.9 * k})`; x.save(); x.translate(px, py); x.rotate(-.12);
    x.fillRect(-14, -2, 28, 4); x.beginPath(); x.moveTo(-2, 0); x.lineTo(-8, -12); x.lineTo(2, -12); x.lineTo(6, 0); x.lineTo(2, 12); x.lineTo(-8, 12); x.fill(); x.restore();
    glow(px + 14, py, 10, 'rgba(255,90,80,A)', k * (Math.sin(t * 8) > 0 ? .8 : .1));
  },
  // el eco: la palabra que más pesa de la línea flota grande al fondo (sirve en cualquier idioma)
  echo(k, t) {
    const e = IN.echo; if (!e) return;
    const age = (performance.now() - e.born) / 1000, a = clamp(age / 1.2) * clamp((6 - age) / 2);
    if (a <= 0) return;
    x.save(); x.globalAlpha = a * .16 * k; x.fillStyle = C(e.c, 1, 25); x.textAlign = 'center';
    x.font = `italic 300 ${Math.min(S() * .32, W / Math.max(4, e.word.length) * 1.6)}px "Cormorant Garamond"`;
    x.fillText(e.word, W / 2 + e.dx + age * 6, H * .42 + e.dy); x.restore();
  },
});

// ---------- escenarios terrestres (base) ----------
GENS.push(
  { name: 'calle', make: r => ({ side: r() }),
    draw(p, t, dt, R, E) {
      bg('#05060c', '#0d0e18'); drawStars(t, .3, .3);
      const hz = H * .5, cx = W / 2;
      for (const sd of [-1, 1]) for (let i = 0; i < 9; i++) {
        const z = ((i / 9) + t * .06) % 1, zz = z * z, bx = cx + sd * (20 + zz * W * .7), bh = (40 + (i * 37 % 60)) * (0.3 + zz * 3), bw = 30 * (0.3 + zz * 3);
        x.fillStyle = `rgba(8,9,15,${.6 + zz * .4})`; x.fillRect(sd < 0 ? bx - bw : bx, hz - bh, bw, bh + zz * 40);
        for (let wy = hz - bh + 6; wy < hz - 4; wy += 8 + zz * 10) for (let wx = 0; wx < bw - 6; wx += 7 + zz * 8)
          if (Math.sin(i * 91 + wx * 7 + wy * 3) > .45) { x.fillStyle = C(i, .35 + zz * .5, 20); x.fillRect((sd < 0 ? bx - bw : bx) + 3 + wx, wy, 2 + zz * 3, 2 + zz * 4); }
      }
      x.fillStyle = '#07070b'; x.beginPath(); x.moveTo(cx - 4, hz); x.lineTo(cx + 4, hz); x.lineTo(W * .9, H); x.lineTo(W * .1, H); x.fill();
      for (let i = 0; i < 14; i++) { const z = ((i / 14) + t * .3) % 1, zz = z * z;
        x.fillStyle = `rgba(255,220,160,${.15 + zz * .6})`; x.fillRect(cx - 1 - zz * 4, hz + zz * (H - hz), 2 + zz * 8, 2 + zz * 24);
        for (const sd of [-1, 1]) glow(cx + sd * (10 + zz * W * .42), hz - 30 - zz * 160, 6 + zz * 50, CA(0, 25), .5 * (1 - z * .3)); }
      const g = x.createLinearGradient(0, hz, 0, H); g.addColorStop(0, 'rgba(0,0,0,0)'); g.addColorStop(1, C(0, .12 + E * .1, 10)); x.fillStyle = g; x.fillRect(0, hz, W, H - hz);
    } },
  { name: 'playa', make: r => ({ hue: r() * 40 }),
    draw(p, t, dt, R, E) {
      const g = x.createLinearGradient(0, 0, 0, H * .65);
      g.addColorStop(0, `hsl(${250 + R.hue},45%,14%)`); g.addColorStop(.6, `hsl(${340 + R.hue},55%,40%)`); g.addColorStop(1, `hsl(${25 + R.hue},85%,62%)`);
      x.fillStyle = g; x.fillRect(0, 0, W, H * .65); drawStars(t, .35, .25);
      const hz = H * .65, sy = hz - S() * lerp(.12, .02, p);
      glow(W / 2, sy, S() * (.35 + E * .05), 'rgba(255,190,120,A)', .6);
      x.fillStyle = '#ffd9a0'; x.beginPath(); x.arc(W / 2, sy, S() * .07, 0, TAU); x.fill();
      x.fillStyle = `hsl(${220 + R.hue},40%,16%)`; x.fillRect(0, hz, W, H * .22);
      for (let i = 0; i < 16; i++) { const yy = hz + 4 + i * 7; x.fillStyle = `rgba(255,200,140,${.35 - i * .02})`;
        x.fillRect(W / 2 - S() * (.08 + i * .012) + Math.sin(t * 2 + i) * 4, yy, S() * (.16 + i * .024), 2); }
      x.fillStyle = '#1b1410'; x.beginPath(); x.moveTo(0, H); x.lineTo(0, H * .87);
      for (let i = 0; i <= 30; i++) { const u = i / 30; x.lineTo(u * W, H * .87 + Math.sin(u * 4 + t * .5) * 6); } x.lineTo(W, H); x.fill();
      x.strokeStyle = 'rgba(255,240,220,.35)'; x.lineWidth = 1.5; x.beginPath();
      for (let i = 0; i <= 40; i++) { const u = i / 40; x.lineTo(u * W, H * .87 + Math.sin(u * 4 + t * .5) * 6 - 2); } x.stroke();
      MOTIF.beach(.9, t, E);
    } },
  { name: 'club', make: r => ({ lasers: 4 + Math.floor(r() * 5), h: r() * 360 }),
    draw(p, t, dt, R, E) {
      bg('#030306', '#07060c');
      for (let i = 0; i < R.lasers; i++) {
        const a = Math.PI / 2 + Math.sin(t * .8 + i * 1.3) * .9, ox = W * (i + .5) / R.lasers;
        x.strokeStyle = `hsla(${(R.h + i * 50) % 360},90%,60%,${.25 + E * .4})`; x.lineWidth = 2;
        x.beginPath(); x.moveTo(ox, 0); x.lineTo(ox + Math.cos(a) * H * 1.4, Math.sin(a) * H * 1.4); x.stroke();
      }
      const bt = IN.beat || 0;
      if (bt > .85 && IN.beatCount % 2 === 0) { x.fillStyle = 'rgba(255,255,255,.05)'; x.fillRect(0, 0, W, H); }
      for (let i = 0; i < 9; i++) glow(W * (i + .5) / 9, H * .08, 50 + E * 60, `hsla(${((R.h || 0) + i * 40) % 360},90%,60%,A)`, .3 + bt * .3);
      MOTIF.crowd(1, t, E);
    } },
  { name: 'campo', make: r => ({ gold: r() }),
    draw(p, t, dt, R, E) {
      const g = x.createLinearGradient(0, 0, 0, H * .7);
      g.addColorStop(0, `hsl(${205 - R.gold * 30},55%,${45 - R.gold * 15}%)`); g.addColorStop(1, `hsl(${35 + R.gold * 10},70%,${70 - R.gold * 10}%)`);
      x.fillStyle = g; x.fillRect(0, 0, W, H);
      for (const d of P('cloud', 10, () => [rnd(), rnd() * .35, .6 + rnd()])) {
        const cx = ((d[0] + t * .004 * d[2]) % 1.2 - .1) * W; for (let j = 0; j < 4; j++) glow(cx + j * 30 * d[2], H * d[1] + (j % 2) * 8, 50 * d[2], 'rgba(255,255,255,A)', .45);
      }
      MOTIF.mountain(.55, t);
      x.fillStyle = `hsl(${95 + R.gold * 20},35%,20%)`; x.beginPath(); x.moveTo(0, H);
      for (let i = 0; i <= 40; i++) { const u = i / 40; x.lineTo(u * W, H * .78 - Math.sin(u * 3 + 1) * 30); } x.lineTo(W, H); x.fill();
      x.strokeStyle = `hsla(${80 + R.gold * 30},40%,40%,.7)`; x.lineWidth = 1.2;
      for (let i = 0; i < 160; i++) { const u = (i * .618) % 1, bx = u * W, by = H * .82 + (i % 7) * H * .025, sw = Math.sin(t * 1.5 + u * 8) * 6 * (1 + E);
        x.beginPath(); x.moveTo(bx, by); x.quadraticCurveTo(bx + sw * .5, by - 10, bx + sw, by - 20); x.stroke(); }
    } },
);
Object.assign(SCENE_FOR, {
  city: 'calle', road: 'calle', sea: 'playa', sun: 'playa', beach: 'playa', dance: 'club', drink: 'club', music: 'club', crowd: 'club', smoke: 'club',
  forest: 'campo', mountain: 'campo', flowers: 'campo', home: 'campo', woman: 'mandala', man: 'red', couple: 'mandala', phone: 'red',
  money: 'órbitas', fashion: 'órbitas', plane: 'horizonte',
});

// ---------- idioma y traducción al español ----------
const EN_W = /\b(the|and|you|i|me|my|is|are|to|of|it|in|that|don't|i'm|your|we|with|for|on|what|just|when|all|know|can't|gonna|wanna|like|this|got)\b/gi;
const ES_W = /\b(el|la|los|las|y|que|de|en|yo|tú|me|mi|es|un|una|con|por|para|no|te|se|lo|pa'|pa|está|como|pero|cuando|todo|quiero|dime)\b/gi;
const PT_W = /\b(você|voce|não|nao|eu|meu|minha|com|uma|isso|isto|está|estou|são|sao|também|tambem|muito|agora|então|entao|pra|pro|dele|dela|nós|nos|vou|tô|tá|coração|saudade|obrigad\w*|ão|ões|ção)\b/gi;
function detectLang(lines) {
  const txt = lines.map(l => l.text).join(' ');
  const en = (txt.match(EN_W) || []).length, es = (txt.match(ES_W) || []).length, pt = (txt.match(PT_W) || []).length;
  if (pt > es && pt > en * .8) return 'pt';
  return en > es * 1.4 ? 'en' : es > en * 1.2 ? 'es' : en > es ? 'en' : 'es';
}
IN.trMode = (() => { try { return localStorage.getItem('tc_trmode') || 'ambas'; } catch (e) { return 'ambas'; } })();
// la traducción arranca en cuanto llega la letra (evento lyricsEarly) o, si no, al terminar de cargar
async function startTranslation(lines, key) {
  if (IN.trKey === key || !lines?.length) return;
  IN.trKey = key;
  IN.lang = detectLang(lines);
  const dst = IN.lang === 'es' ? 'en' : 'es';           // inglés o portugués -> español, español -> inglés
  const n = lines.length, CH = 6;
  IN.tr = Array(n).fill(''); IN.trHead = false;
  const label = () => (IN.lyrState || 'letra sincronizada').split(' · ')[0];
  IN.lyrState = label() + ' · traduciendo al ' + (dst === 'es' ? 'español' : 'inglés'); ui();
  const pending = i => !IN.tr[i] && lines[i]?.text;
  let done = 0, first = true;
  while (true) {
    if (ext.key() !== key) return;
    // primero lo que suena y lo que viene, después lo que ya pasó
    const now = ext.has() ? ext.now() + .2 + (IN.off || 0) : 0;
    let cur = lines.findLastIndex(l => l.t <= now); if (cur < 0) cur = 0;
    let a = -1;
    for (let i = cur; i < n; i++) if (pending(i)) { a = i; break; }
    if (a < 0) for (let i = 0; i < cur; i++) if (pending(i)) { a = i; break; }
    if (a < 0) break;
    const size = first ? 1 : IN.trHead ? CH : 12;         // 1.º: solo la línea que suena (lo más rápido posible) · luego la ventaja · luego por bloques
    first = false;
    const idx = []; for (let i = a; i < n && idx.length < size; i++) if (pending(i)) idx.push(i);
    try {
      const r = await fetch('/translate', { method: 'POST', body: JSON.stringify({ lines: idx.map(i => lines[i].text), src: IN.lang, dst }) }).then(r => r.json());
      if (ext.key() !== key) return;
      if (!r.lines) { IN.lyrState = label() + ' · ' + (r.error || 'sin traducción'); ui(); return; }
      r.lines.forEach((t, j) => IN.tr[idx[j]] = t || ' ');
      // la línea en pantalla recibe su traducción sin reconstruirse (sin parpadeo)
      if (idx.includes(IN.shown) && IN.trMode !== 'orig') {
        const el = document.querySelector('#lyr .line:not(.out)'), tr = IN.tr[IN.shown]?.trim();
        if (el && tr && !el.querySelector('.tr, .tr-fx')) {
          if (IN.trMode === 'es') IN.shown = -2;
          else { const t = document.createElement('div'); t.className = el.classList.contains('L-scatter') || el.classList.contains('L-vertical') ? 'tr-fx' : 'tr'; t.textContent = tr; t.style.animationDelay = '0s'; el.appendChild(t); }
        }
      }
      // ventaja cubierta: lo que suena y las ~12 líneas siguientes ya tienen traducción
      { const c0 = Math.max(0, lines.findLastIndex(l => l.t <= (ext.has() ? ext.now() : 0)));
        let ok = true; for (let k = c0; k < Math.min(n, c0 + 12); k++) if (lines[k]?.text && !IN.tr[k]) { ok = false; break; }
        if (ok) IN.trHead = true; }
    } catch (e) { IN.lyrState = label() + ' · sin traducción'; ui(); return; }
    done += idx.length; IN.lyrState = label() + ' · traduciendo ' + Math.min(100, Math.round(done / lines.filter(l => l.text).length * 100)) + '%'; ui();
  }
  IN.lyrState = label() + ' · traducida al ' + (dst === 'es' ? 'español' : 'inglés'); ui();
}
addEventListener('lyricsEarly', e => { if (e.detail.key === ext.key()) startTranslation(e.detail.lines, e.detail.key); });

const _loadSongMeta = loadSongMeta;
loadSongMeta = async function () {
  IN.tr = null; IN.lang = ''; IN.trKey = null; IN.trHead = false;
  await _loadSongMeta();
  if (!IN.synced) return;
  if (!IN.lang) IN.lang = detectLang(IN.lines);
  startTranslation(IN.lines, ext.key());               // letras sin tiempos o aproximadas: arranca aquí
};

// ---------- mostrar la línea (original, traducción o ambas) + eco ----------
const STOP = /^(the|and|you|your|that|this|with|what|when|just|like|have|been|from|they|them|there|then|than|dont|cant|wont|im|ive|youre|gonna|wanna|para|pero|como|cuando|donde|porque|todo|toda|esta|este|eso|esto|estoy|estas|tengo|quiero|sabes|dime|nada|algo|contigo|conmigo|también|siempre|nunca|ahora|aquí|allí)$/i;
function salient(text) {
  const words = text.replace(/[^\p{L}\p{N}' ]/gu, ' ').split(/\s+/).filter(w => w.length >= 4 && !STOP.test(w.replace(/'/g, '')));
  const keyed = words.find(w => LEX.some(([, re]) => re.test(w)));
  return keyed || words.sort((a, b) => b.length - a.length)[0] || '';
}
function buildChars(el, text, per, markKeys) {
  let n = 0;
  text.split(' ').forEach((word, wi) => {
    if (wi) el.appendChild(document.createTextNode(' '));
    const w = document.createElement('span');
    w.className = 'w' + (markKeys && LEX.some(([, re]) => re.test(word)) ? ' key' : '');
    for (const c of word) { const s = document.createElement('span'); s.className = 'ch'; s.textContent = c; s.style.animationDelay = (n++ * per) + 's'; w.appendChild(s); }
    n++; el.appendChild(w);
  });
  return n * per;
}
function showProcLine(i) {
  for (const el of lyr.querySelectorAll('.line:not(.out)')) { el.classList.add('out'); setTimeout(() => el.remove(), 1000); }
  IN.shown = i; IN.curTr = '';
  if (i < 0) return;
  const l = IN.lines[i], next = IN.lines[i + 1], dur = next ? next.t - l.t : 4, tr = IN.tr?.[i] || '';
  IN.curTr = tr;
  const word = salient(l.text);
  if (word) { IN.echo = { word, born: performance.now(), dx: (Math.random() - .5) * W * .3, dy: (Math.random() - .5) * H * .2, c: Math.floor(Math.random() * 3) };
    const m = IN.motifs.echo || (IN.motifs.echo = { k: 0 }); m.target = 1; m.hold = 6; }
  if (!IN.show) return;
  const main = tr && IN.trMode === 'es' ? tr : l.text, second = tr && IN.trMode === 'ambas' ? tr : '';
  const el = document.createElement('div'); el.className = 'line fast';
  const per = clamp(Math.min(dur * .18, .7) / Math.max(1, main.length), .006, .03);
  const took = buildChars(el, main, per, true);
  if (second) { const s = document.createElement('span'); s.className = 'tr'; s.textContent = second; s.style.animationDelay = '0.08s'; el.appendChild(s); }
  lyr.appendChild(el);
}
// la traducción también alimenta al intérprete (más precisión con el léxico en español)
const _interpret = interpret;
interpret = function (text) { return _interpret(IN.curTr ? text + ' • ' + IN.curTr : text); };

// t: ambas / solo traducción / solo original
addEventListener('keydown', e => {
  if (e.key !== 't' || mode !== 'proc' || /TEXTAREA|INPUT/.test(document.activeElement?.tagName || '')) return;
  IN.trMode = { ambas: 'es', es: 'orig', orig: 'ambas' }[IN.trMode];
  try { localStorage.setItem('tc_trmode', IN.trMode); } catch (err) {}
  IN.shown = -2; setTag({ ambas: 'original y traducción', es: 'solo traducción', orig: 'solo original' }[IN.trMode]);
});
