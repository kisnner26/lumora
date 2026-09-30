// ============================================================
// riso-props-tecnomusica.js — tecnología e instrumentos (oleada 3 del catálogo). Ver riso-props-lib.js.
// ============================================================
(() => {
  const R = window.RISO; if (!R || !R.lib) return;
  const { add, L } = R.lib;
  const T = (id, label, rx, shapes, opt) => add(id, 'tecnologia', label, rx, shapes, opt);
  const M = (id, label, rx, shapes, opt) => add(id, 'musica', label, rx, shapes, opt);
  const gnd = { p: 'M-190 160 H190', s: 8 };

  // ---------- tecnología ----------
  T('computadora', 'COMPUTADORA', /\b(computadoras?|computador|ordenador|computers?|monitor|escritorio digital|desktop|programador|programmer|hacker|hackear|hacking)\b/i, [
    { p: L.rr(-130, -140, 260, 170, 14), f: 3, ft: .5, s: 10 }, { p: L.rect(-108, -118, 216, 126), f: 1, ft: .85, s: 6 }, { p: 'M-20 30 V80 M-70 90 H70 L60 80 H-60 Z', f: 3, ft: .7, s: 8 }, { p: L.rr(-120, 100, 240, 40, 10), f: -1, s: 8 },
    { p: 'M-80 -90 H-30 M-80 -65 H20 M-80 -40 H-10', s: 4, i: 2 }, { p: 'M-90 118 H90', s: 3 },
  ], { moods: ['oscuro', 'desafiante'] });
  T('laptop', 'LAPTOP', /\b(laptops?|port[aá]til|notebook|macbook|computadora port[aá]til|trabajar desde casa|home office|remote work)\b/i, [
    { p: L.rr(-110, -110, 220, 140, 12), f: 3, ft: .5, s: 10 }, { p: L.rect(-92, -92, 184, 104), f: 2, ft: .7, s: 5 }, { p: 'M-160 30 H160 L140 70 H-140 Z', f: -1, s: 9 }, { p: 'M-60 45 H60', s: 5 }, { p: 'M-30 -60 L0 -30 L30 -70', s: 5, m: 'drift', a: 4 },
  ], { moods: ['sereno', 'nostalgico'] });
  T('tablet', 'TABLET', /\b(tablets?|ipad|pantalla t[aá]ctil|touchscreen|touch screen|kindle|e-?reader)\b/i, [
    { p: L.rr(-100, -150, 200, 300, 24), f: 3, ft: .5, s: 10 }, { p: L.rect(-80, -125, 160, 240), f: 1, ft: .8, s: 6 }, { c: [0, 135, 9], s: 5 }, { c: [30, -20, 20], s: 4, i: 2, m: 'pulse', a: .2, o: [30, -20], v: 2 }, { c: [30, -20, 6], f: 2, s: 0 },
  ], { moods: ['sereno'] });
  T('drone', 'DRON', /\b(drones?|dron|quadcopter|multirotor|cuadric[oó]ptero|uav)\b/i, [
    { e: [0, 0, 50, 30], f: 1, ft: .9, s: 10 }, { c: [0, 35, 14], f: -1, s: 7 }, { p: 'M-40 -10 L-120 -50 M40 -10 L120 -50 M-40 10 L-120 50 M40 10 L120 50', s: 8 }, ...[[-120, -50], [120, -50], [-120, 50], [120, 50]].map(([x, y], i) => ({ p: `M${x - 50} ${y - 14} H${x + 50}`, s: 6, m: 'wag', a: .1, v: 8, o: [x, y - 14], ph: i })),
    { p: 'M0 60 L-40 160 H40 Z', f: 2, ft: .2, s: 0 },
  ], { moods: ['oscuro', 'desafiante'] });
  T('robot', 'ROBOT', /\b(robots?|rob[oó]tico|robotic|androide|android|cyborg|ciborg|inteligencia artificial|artificial intelligence|\bai\b|m[aá]quina pensante|autom[aá]tas?|automaton)\b/i, [
    { p: L.rr(-60, -100, 120, 90, 14), f: 3, ft: .6, s: 10 }, { p: L.rr(-80, -5, 160, 130, 16), f: 3, ft: .8, s: 10 }, { c: [-25, -55, 14], f: 2, ft: .95, s: 6, m: 'blink', v: 1 }, { c: [25, -55, 14], f: 2, ft: .95, s: 6, m: 'blink', v: 1 }, { p: 'M-30 -25 H30', s: 6 },
    { p: 'M0 -100 V-150 M0 -150 H-8', s: 6 }, { c: [0, -160, 10], f: 1, s: 6, m: 'pulse', a: .3, o: [0, -160], v: 2 }, { p: 'M-80 30 L-140 70 M80 30 L140 70', s: 10 }, { c: [0, 45, 22], f: -1, s: 6 }, { p: 'M-40 125 V170 M40 125 V170', s: 12 },
  ], { moods: ['oscuro', 'desafiante'] });
  T('wifi', 'WIFI', /\b(wi-?fi|internet|online|en l[ií]nea|red inal[aá]mbrica|bluetooth|sin cobertura|no signal|offline)\b/i, [
    { p: L.arc(0, 90, 160, -Math.PI * .8, -Math.PI * .2), s: 16, i: 1, m: 'pulse', a: .03, o: [0, 90] }, { p: L.arc(0, 90, 110, -Math.PI * .8, -Math.PI * .2), s: 16, i: 2, m: 'pulse', a: .03, o: [0, 90], ph: .5 }, { p: L.arc(0, 90, 60, -Math.PI * .8, -Math.PI * .2), s: 16, i: 1, m: 'pulse', a: .03, o: [0, 90], ph: 1 }, { c: [0, 90, 18], f: 2, ft: .95, s: 8 },
  ], { moods: ['oscuro', 'sereno'] });
  T('bateria', 'BATERÍA', /\b(bater[ií]a baja|bater[ií]a|battery|low battery|recargar|recharge|cargador|charger|sin energ[ií]a|power bank)\b/i, [
    { p: L.rr(-120, -70, 220, 140, 16), f: -1, s: 10 }, { p: L.rect(100, -30, 30, 60), f: 3, ft: .8, s: 8 }, { p: L.rect(-100, -50, 60, 100), f: 2, ft: .95, s: 0, m: 'pulse', a: .03, o: [-100, 0] }, { p: L.rect(-30, -50, 60, 100), f: 2, ft: .95, s: 0 }, { p: 'M10 -90 L-20 -20 H10 L-10 50 L40 -30 H10 Z', f: 1, ft: .95, s: 6, m: 'beat', a: .08, o: [10, -20] },
  ], { moods: ['euforico', 'melancolico'] });
  T('enchufe', 'ENCHUFE', /\b(enchufes?|plugs?|socket|tomacorriente|outlet|cable|cables|cord|extensi[oó]n el[eé]ctrica|electricidad|electricity|corriente el[eé]ctrica|voltaje|voltage)\b/i, [
    { p: L.rr(-50, -120, 100, 130, 16), f: 3, ft: .6, s: 10 }, { p: 'M-25 -120 V-170 M25 -120 V-170', s: 12 }, { p: 'M-30 10 C-30 90 60 60 60 130 C60 170 -20 170 -60 170', s: 10 }, { c: [-16, -60, 8], f: 1, s: 0 }, { c: [16, -60, 8], f: 1, s: 0 },
    { p: 'M80 -120 L100 -160 M110 -100 L150 -130 M100 -60 L150 -70', s: 4, i: 2, m: 'pulse', a: .3, v: 4, o: [60, -80] },
  ], { moods: ['rabioso', 'euforico'] });
  T('usb', 'USB', /\b(usb|pendrive|memoria usb|flash drive|memory stick|disco duro|hard drive|hard disk|sd card)\b/i, [
    { p: L.rr(-50, -90, 100, 210, 10), f: 3, ft: .7, s: 10 }, { p: L.rect(-32, -160, 64, 70), f: -1, s: 9 }, { c: [-14, -130, 6], f: 1, s: 0 }, { c: [14, -130, 6], f: 1, s: 0 }, { p: 'M-30 -50 H30 M-30 -20 H30', s: 4 }, { c: [0, 70, 16], s: 6, m: 'blink', v: 1.5 },
  ], { moods: ['nostalgico'] });
  T('teclado', 'TECLADO', /\b(teclados?|keyboards?|teclas?|keys? de pc|tecleando|typing|tipeando)\b/i, [
    { p: L.rr(-180, -60, 360, 140, 16), f: -1, s: 10 }, ...[0, 1, 2].flatMap(r => Array.from({ length: 8 - r }, (_, i) => ({ p: L.rect(-150 + r * 14 + i * 38, -45 + r * 36, 30, 28), f: (i + r) % 4 === 0 ? 2 : 3, ft: .7, s: 4 }))), { p: L.rr(-90, 62, 180, 14, 4), f: 3, ft: .8, s: 4 },
  ], { moods: ['nostalgico', 'oscuro'] });
  T('servidor', 'SERVIDOR', /\b(servidor(es)?|servers?|data ?center|centro de datos|base de datos|database|hosting|nube digital|cloud storage|red de computadoras|mainframe)\b/i, [
    ...[-110, -30, 50].map((y, i) => ({ p: L.rr(-110, y, 220, 64, 8), f: i % 2 ? 3 : -1, ft: .7, s: 9 })), ...[-110, -30, 50].flatMap((y, i) => [{ c: [-80, y + 32, 8], f: 2, ft: .95, s: 4, m: 'blink', v: 1.5, ph: i }, { c: [-55, y + 32, 8], f: 1, s: 0 }, { p: `M10 ${y + 22} H90 M10 ${y + 42} H90`, s: 3 }]), { p: 'M-70 120 H70 M-40 114 V130 M40 114 V130', s: 8 },
  ], { moods: ['oscuro'] });
  T('satelite', 'SATÉLITE', /\b(sat[eé]lites?|satellites?|gps|sputnik|estaci[oó]n espacial|space station|antena parab[oó]lica|parabolic|orbitando|starlink)\b/i, [
    { p: L.rr(-40, -40, 80, 80, 8), f: 3, ft: .7, s: 10, m: 'sway', a: .05, o: [0, 0] }, { p: L.rect(-170, -20, 100, 40), f: 1, ft: .85, s: 8, m: 'sway', a: .05, o: [0, 0] }, { p: L.rect(70, -20, 100, 40), f: 1, ft: .85, s: 8, m: 'sway', a: .05, o: [0, 0] }, { p: 'M-140 -20 V20 M-110 -20 V20 M110 -20 V20 M140 -20 V20', s: 3 },
    { p: 'M0 40 V90 M-25 110 C-15 80 15 80 25 110 Z', f: 2, ft: .8, s: 7 }, { p: L.arc(0, 110, 60, 0.2, Math.PI - 0.2), s: 4, i: 2, m: 'pulse', a: .1, o: [0, 110] }, { p: L.star(-140, -120, 10, 4, .4), f: 2, s: 3, m: 'pulse', a: .5, o: [-140, -120] },
  ], { moods: ['oscuro', 'sereno'] });
  T('antena', 'ANTENA', /\b(antenas?|antennas?|torre de se[nñ]al|radio tower|transmisi[oó]n|broadcast|transmitir|transmit|onda de radio|radio wave|frecuencia|frequency)\b/i, [
    { p: 'M-60 170 L0 -100 L60 170 Z', s: 9 }, { p: 'M-45 110 H45 M-30 50 H30 M-15 -10 H15 M-45 110 L30 50 M45 110 L-30 50 M-30 50 L15 -10 M30 50 L-15 -10', s: 4 }, { c: [0, -115, 14], f: 2, ft: .95, s: 8 },
    ...[30, 55, 80].flatMap((r, i) => [{ p: L.arc(0, -115, r, -Math.PI * .8, -Math.PI * .2), s: 6, i: 1, m: 'pulse', a: .05, o: [0, -115], ph: i * .5 }, { p: L.arc(0, -115, r, Math.PI * 1.2, Math.PI * 1.8), s: 6, i: 1, m: 'pulse', a: .05, o: [0, -115], ph: i * .5 }]),
  ], { moods: ['oscuro', 'sereno'] });
  T('chip', 'CHIP', /\b(chips?|microchip|procesador|processor|cpu|circuito|circuit|circuitos|circuitry|placa base|motherboard|silicio|silicon|transistor)\b/i, [
    { p: L.rr(-90, -90, 180, 180, 14), f: 3, ft: .7, s: 10 }, { p: L.rect(-50, -50, 100, 100), f: 1, ft: .9, s: 7 }, ...[-60, -20, 20, 60].map(v => ({ p: `M${v} -90 V-130 M${v} 90 V130 M-90 ${v} H-130 M90 ${v} H130`, s: 6 })), { c: [0, 0, 16], f: 2, ft: .95, s: 4, m: 'pulse', a: .2, o: [0, 0], v: 2 },
    { p: 'M-170 -60 H-130 L-110 -30 M170 60 H130 L110 90', s: 3, i: 2 },
  ], { moods: ['oscuro'] });
  T('chat', 'MENSAJE', /\b(mensajes?|messages?|chats?|texting|textear|whatsapp|inbox|bandeja de entrada|notificaci[oó]n|notification|notificaciones|visto|read receipt|escribiendo)\b/i, [
    { p: 'M-170 -110 H50 C70 -110 80 -100 80 -80 V-10 C80 10 70 20 50 20 H-50 L-100 60 V20 H-170 C-190 20 -190 10 -190 -10 V-80 C-190 -100 -190 -110 -170 -110 Z', f: 3, ft: .6, s: 9 },
    { p: 'M170 -20 H-10 C-30 -20 -40 -10 -40 10 V80 C-40 100 -30 110 -10 110 H70 L120 150 V110 H170 C190 110 190 100 190 80 V10 C190 -10 190 -20 170 -20 Z', f: 2, ft: .85, s: 9 },
    ...[-120, -80, -40].map((x, i) => ({ c: [x, -45, 8], f: 1, s: 0, m: 'bob', a: 6, ph: i * .6 })), { p: 'M0 40 H140 M0 70 H100', s: 4 },
  ], { moods: ['romantico', 'melancolico'] });
  T('correo', 'CORREO', /\b(correos?|e-?mail|emails?|correo electr[oó]nico|mailbox|spam|arroba|newsletter)\b/i, [
    { p: L.rr(-150, -90, 300, 190, 12), f: -1, s: 10 }, { p: 'M-150 -80 L0 30 L150 -80', s: 8 }, { p: 'M-150 90 L-40 0 M150 90 L40 0', s: 5 }, { c: [110, -85, 26], f: 2, ft: .95, s: 6, m: 'pulse', a: .1, o: [110, -85], v: 2 }, { p: 'M100 -85 H120 M110 -95 V-75', s: 4 },
  ], { moods: ['nostalgico'] });
  T('consola', 'CONSOLA', /\b(videojuegos?|video ?games?|consolas?|consoles?|gamers?|gaming|joystick|gamepad|playstation|xbox|nintendo|arcade|control remoto de juego|game over|press start)\b/i, [
    { p: 'M-170 -20 C-180 -70 -100 -90 -60 -60 H60 C100 -90 180 -70 170 -20 L150 100 C140 140 100 130 80 90 L60 60 H-60 L-80 90 C-100 130 -140 140 -150 100 Z', f: 3, ft: .7, s: 10 },
    { p: 'M-110 -20 V20 M-130 0 H-90', s: 10 }, { c: [90, -20, 12], f: 2, ft: .95, s: 6 }, { c: [120, 5, 12], f: 1, ft: .95, s: 6 }, { c: [60, 5, 12], f: 1, ft: .95, s: 6 }, { c: [90, 30, 12], f: 2, ft: .95, s: 6 }, { p: 'M-30 -10 H30', s: 4 },
  ], { moods: ['euforico', 'desafiante'] });
  T('gps_mapa', 'UBICACIÓN', /\b(ubicaci[oó]n|location|coordenadas|coordinates|geolocalizaci[oó]n|rastrear|tracking|localizador|pin en el mapa|map pin)\b/i, [
    { p: 'M0 170 C-60 90 -100 50 -100 -10 C-100 -70 -55 -120 0 -120 C55 -120 100 -70 100 -10 C100 50 60 90 0 170 Z', f: 1, ft: .9, s: 10 }, { c: [0, -10, 36], f: -1, s: 8 }, { c: [0, -10, 12], f: 2, s: 0, m: 'pulse', a: .3, o: [0, -10], v: 2 },
    { e: [0, 172, 80, 16], s: 5, m: 'pulse', a: .1, o: [0, 172] }, { p: 'M-190 -150 H-120 M120 -150 H190', s: 3, i: 3 },
  ], { moods: ['sereno', 'romantico'] });
  T('smartwatch', 'RELOJ INTELIGENTE', /\b(smart ?watch|reloj inteligente|apple watch|pulsera inteligente|fitness band|fitbit|rastreador de actividad|pulsaciones|heart rate|ritmo card[ií]aco)\b/i, [
    { p: 'M-40 -40 L-30 -170 H30 L40 -40 M-40 40 L-30 170 H30 L40 40', f: 3, ft: .6, s: 9 }, { p: L.rr(-70, -70, 140, 140, 30), f: 3, ft: .5, s: 10 }, { p: L.rr(-52, -52, 104, 104, 20), f: 1, ft: .9, s: 5 }, { p: 'M-40 10 H-20 L-10 -25 L5 40 L15 0 H40', s: 5, i: 2, m: 'pulse', a: .1, o: [0, 0], v: 2 },
  ], { moods: ['sereno'] });
  T('impresora', 'IMPRESORA', /\b(impresoras?|printers?|imprimir|print|fotocopiadora|copier|photocopy|xerox|escaner|scanner|fax)\b/i, [
    { p: L.rr(-160, -20, 320, 120, 14), f: 3, ft: .6, s: 10 }, { p: L.rect(-100, -110, 200, 90), f: -1, s: 8 }, { p: L.rect(-90, 60, 180, 90), f: -1, s: 8 }, { p: 'M-70 90 H70 M-70 115 H40 M-70 135 H60', s: 4 }, { c: [130, 10, 8], f: 2, ft: .95, s: 4, m: 'blink', v: 1 }, { p: 'M-70 -80 H60 M-70 -55 H30', s: 3 },
  ], { moods: ['nostalgico'] });
  T('camara_video', 'CÁMARA DE VIDEO', /\b(c[aá]maras? de video|video ?c[aá]maras?|camcorder|filmar|filming|grabando|videoclip|music video|cinta de video|vhs|director de cine)\b/i, [
    { p: L.rr(-150, -60, 200, 130, 14), f: 3, ft: .7, s: 10 }, { p: 'M50 -20 L150 -70 V80 L50 30 Z', f: 1, ft: .85, s: 9 }, { c: [-100, -100, 40], f: -1, s: 8 }, { c: [-40, -100, 40], f: -1, s: 8 }, { c: [-100, -100, 12], f: 3, s: 4, m: 'spin', a: 2, o: [-100, -100] }, { c: [-40, -100, 12], f: 3, s: 4, m: 'spin', a: 2, o: [-40, -100] },
    { c: [-110, -20, 10], f: 2, ft: .95, s: 4, m: 'blink', v: 1 }, { p: 'M-110 120 H100 M-40 70 V120', s: 6 },
  ], { moods: ['nostalgico', 'euforico'] });
  T('redes_like', 'REDES SOCIALES', /\b(redes sociales|social media|instagram|tiktok|twitter|facebook|snapchat|followers|seguidores|likes?|viral|influencer|hashtag|trending|selfies?)\b/i, [
    { p: L.rr(-90, -150, 180, 300, 26), f: 3, ft: .45, s: 10 }, { p: L.rect(-72, -110, 144, 180), f: -1, s: 5 }, { c: [-50, -130, 8], f: 1, s: 0 }, { p: L.heart(0, -20, 4), f: 2, ft: .95, s: 7, m: 'pulse', a: .2, o: [0, -20], v: 2 }, { p: 'M-72 90 H72 M-72 115 H30', s: 4 },
    { p: L.heart(120, -70, 1.6), f: 2, ft: .9, s: 3, m: 'fall', a: -60 }, { p: L.heart(-125, -30, 1.3), f: 2, ft: .9, s: 3, m: 'fall', a: -70, ph: .5 },
  ], { moods: ['euforico'] });
  T('disco_cd', 'DISCO COMPACTO', /\b(cd|cds|dvd|compact disc|disco compacto|disquete|floppy|disc|quemar un cd|grabar un cd)\b/i, [
    { c: [0, 0, 160], f: 3, ft: .35, s: 10, m: 'spin', a: 1, o: [0, 0] }, { c: [0, 0, 130], s: 3, i: 2, m: 'spin', a: 1, o: [0, 0] }, { c: [0, 0, 100], s: 3, i: 1, m: 'spin', a: 1, o: [0, 0] }, { c: [0, 0, 40], f: -1, s: 8 }, { c: [0, 0, 12], f: 1, s: 0 }, { p: 'M50 -110 C90 -80 110 -40 110 -10', s: 5, i: 2, m: 'spin', a: 1, o: [0, 0] },
  ], { moods: ['nostalgico'] });
  T('pantalla_glitch', 'PANTALLA ROTA', /\b(glitch|pantalla rota|broken screen|404|se rompi[oó] la pantalla|se cay[oó] el sistema|system failure|malware|hackeado|hacked)\b/i, [
    { p: L.rr(-140, -110, 280, 200, 14), f: 3, ft: .5, s: 10 }, { p: 'M-60 -110 L-30 -60 L-70 -20 L-10 20 L-40 90', s: 7, i: 2 }, { p: 'M-30 -60 L40 -80 M-10 20 L60 0 M-70 -20 L-120 -30', s: 4 }, { p: L.rect(20, -50, 90, 22), f: 2, ft: .95, s: 0, m: 'drift', a: 20 }, { p: L.rect(-120, 30, 100, 14), f: 1, ft: .95, s: 0, m: 'drift', a: -20 },
    { p: 'M-60 90 V130 M60 90 V130 M-100 130 H100', s: 8 },
  ], { moods: ['oscuro', 'rabioso'] });
  T('codigo', 'CÓDIGO', /\b(c[oó]digo|code|coding|c[oó]digo binario|binary|matrix|programar|programming|algoritmo|algorithm|software|hardware|ceros y unos|zeros and ones|pixel|pixeles|pixels)\b/i, [
    { p: L.rr(-160, -120, 320, 240, 14), f: 3, ft: .8, s: 10 }, ...[-90, -60, -30, 0, 30, 60].map((y, i) => ({ p: `M${-130 + (i % 3) * 20} ${y} H${-40 + ((i * 37) % 120)}`, s: 5, i: i % 3 === 0 ? 2 : 1 })), { p: 'M-130 -100 L-100 -80 L-130 -60', s: 5, i: 2 }, { p: L.rect(30, 70, 14, 26), f: 2, ft: .95, s: 0, m: 'blink', v: 1.5 },
  ], { moods: ['oscuro', 'desafiante'] });

  // ---------- música ----------
  M('guitarra_electrica', 'GUITARRA ELÉCTRICA', /\b(guitarras? el[eé]ctricas?|electric guitar|riff|solo de guitarra|guitar solo|rock ?(and|n) ?roll|heavy metal|metalero|punk|rockero|rocker|amplificador)\b/i, [
    { p: 'M-40 -10 C-60 -50 -20 -78 0 -72 C25 -78 60 -50 40 -10 C20 5 20 22 45 38 C82 68 70 138 0 138 C-70 138 -82 68 -45 38 C-20 22 -20 5 -40 -10 Z', f: 1, ft: .85, s: 9 }, { p: L.rect(-16, 20, 32, 14), f: -1, s: 4 }, { p: L.rect(-16, 50, 32, 14), f: -1, s: 4 }, { c: [-20, 100, 8], f: 2, s: 4 }, { c: [20, 100, 8], f: 2, s: 4 },
    { p: 'M0 -72 V-190', s: 14 }, { p: 'M-14 -190 H14 V-160 H-14 Z', f: 2, ft: .9, s: 6 }, { p: 'M-8 -20 V90', s: 3, i: 2 }, { c: [0, 50, 9], f: -1, s: 5 },
  ], { g: { r: .5, dx: 10, dy: 20 }, moods: ['rabioso', 'desafiante', 'euforico'] });
  M('guitarra_acustica', 'GUITARRA', /\b(guitarras?|guitars?|guitarrista|guitarist|acordes?|chords?|serenata|serenade|rasgue|strum\w*|acoustic)\b/i, [
    { p: 'M-40 -10 C-60 -50 -20 -78 0 -72 C25 -78 60 -50 40 -10 C20 5 20 22 45 38 C82 68 70 138 0 138 C-70 138 -82 68 -45 38 C-20 22 -20 5 -40 -10 Z', f: 2, ft: .7, s: 9 }, { c: [0, 60, 26], f: 1, ft: .95, s: 8 }, { p: 'M-30 112 H30', s: 8 }, { p: 'M0 -72 V-190', s: 12 }, { p: 'M-14 -190 H14 V-160 H-14 Z', f: 1, ft: .9, s: 6 },
  ], { g: { r: .5, dx: 10, dy: 20 }, moods: ['romantico', 'nostalgico', 'sereno'] });
  M('piano', 'PIANO', /\b(pianos?|pianista|pianist|teclas de piano|piano keys|sinfon[ií]a|symphony|concierto de piano|ballad|balada)\b/i, [
    { p: L.rr(-170, -30, 340, 130, 10), f: -1, s: 10 }, ...Array.from({ length: 10 }, (_, i) => ({ p: `M${-150 + i * 33} -30 V100`, s: 4 })), ...[0, 1, 3, 4, 5, 7, 8].map(i => ({ p: L.rect(-140 + i * 33, -30, 22, 70), f: 1, ft: .95, s: 4 })), { p: L.rr(-170, -110, 340, 80, 10), f: 3, ft: .6, s: 9 }, { p: 'M-170 -110 L-190 -170 H-30 L-10 -110', f: 3, ft: .8, s: 8 },
    { p: 'M-150 100 V150 M150 100 V150', s: 10 },
  ], { moods: ['romantico', 'melancolico', 'nostalgico'] });
  M('bateria_drums', 'BATERÍA', /\b(bater[ií]a musical|drums?|drummer|baterista|platillos?|cymbals?|redoblante|snare|bombo|kick drum|baquetas|drumsticks?|tambor|tambores)\b/i, [
    { p: L.rr(-50, 30, 100, 100, 10), f: 2, ft: .85, s: 10 }, { e: [0, 30, 50, 14], f: -1, s: 7 }, { p: L.rr(-160, -20, 80, 60, 8), f: 3, ft: .7, s: 9 }, { p: L.rr(80, -20, 80, 60, 8), f: 3, ft: .7, s: 9 },
    { e: [-140, -100, 50, 10, -.15], f: 2, ft: .95, s: 6, m: 'beat', a: .08, o: [-140, -100] }, { p: 'M-140 -90 V150', s: 5 }, { e: [140, -100, 50, 10, .15], f: 2, ft: .95, s: 6, m: 'beat', a: .08, o: [140, -100] }, { p: 'M140 -90 V150', s: 5 },
    { p: 'M-90 -130 L-20 -50 M90 -130 L20 -50', s: 8, m: 'wag', a: .1, o: [0, -50], b: 3 },
  ], { moods: ['rabioso', 'euforico', 'desafiante'] });
  M('violin', 'VIOLÍN', /\b(viol[ií]n(es)?|violins?|violinista|fiddle|violonchelo|cello|orquesta|orchestra|cuerdas|strings|viola)\b/i, [
    { p: 'M-25 -10 C-40 -30 -20 -45 0 -40 C20 -45 40 -30 25 -10 C15 0 15 12 30 25 C50 45 40 100 0 100 C-40 100 -50 45 -30 25 C-15 12 -15 0 -25 -10 Z', f: 2, ft: .85, s: 9 }, { p: 'M-15 -25 L-10 -10 M15 -25 L10 -10', s: 3 }, { p: 'M0 -40 V-170', s: 10 }, { p: 'M-10 -180 H10 V-155 H-10 Z', f: 1, ft: .9, s: 6 },
    { p: 'M-90 90 L100 -50', s: 8, m: 'drift', a: 10, b: 1 }, { p: 'M-8 -20 V100 M8 -20 V100', s: 2 }, { p: 'M-100 -120 C-80 -140 -60 -140 -40 -120', s: 4, m: 'bob', a: 6 },
  ], { moods: ['melancolico', 'romantico', 'triste'] });
  M('trompeta', 'TROMPETA', /\b(trompetas?|trumpets?|trompetista|metales|brass|cornetas?|bugle|clar[ií]n(es)?|fanfarria|fanfare|jazz)\b/i, [
    { p: 'M-170 20 H-60', s: 8 }, { p: 'M-60 -20 H90 C130 -20 130 60 90 60 H-60 C-100 60 -100 -20 -60 -20 Z', s: 8 }, { p: 'M90 -20 L190 -80 V100 L90 60 Z', f: 2, ft: .85, s: 9 }, { p: 'M-30 -20 V-70 M0 -20 V-70 M30 -20 V-70', s: 6 }, { c: [-30, -75, 8], f: 1, s: 5 }, { c: [0, -75, 8], f: 1, s: 5 }, { c: [30, -75, 8], f: 1, s: 5 },
    { p: 'M-170 10 H-190 M-170 30 H-190', s: 6 }, { p: 'M150 -120 C170 -140 180 -160 190 -180', s: 4, m: 'pulse', a: .2, v: 3, o: [150, -120] },
  ], { moods: ['euforico', 'nostalgico'] });
  M('saxofon', 'SAXOFÓN', /\b(sax[oó]f[oó]n(es)?|saxophones?|sax|saxo|clarinete|clarinet|oboe|flautista|blues|smooth jazz|jazzy)\b/i, [
    { p: 'M-50 -160 L-20 -160 C-10 -100 40 -40 50 40 C60 120 20 160 -30 150 C-70 140 -70 90 -40 80 C-10 70 0 100 -20 110', s: 22 }, { p: 'M-50 -160 L-20 -160 C-10 -100 40 -40 50 40 C60 120 20 160 -30 150 C-70 140 -70 90 -40 80 C-10 70 0 100 -20 110', f: 2, ft: .9, s: 8 },
    { p: 'M-20 -170 L-70 -190 L-100 -170', s: 7 }, ...[-90, -50, -10, 30, 70].map((y, i) => ({ c: [10 + i * 8, y, 7], f: -1, s: 4 })), { p: 'M-40 150 C-20 190 40 190 60 150', f: 2, ft: .95, s: 0 },
  ], { moods: ['romantico', 'oscuro', 'nostalgico'] });
  M('microfono', 'MICRÓFONO', /\b(micr[oó]fonos?|microphones?|mic|cantante|singer|vocalista|karaoke|cantar en el escenario|discurso)\b/i, [
    { c: [0, -70, 62], f: 3, ft: .6, s: 10 }, { p: 'M-50 -100 H50 M-58 -70 H58 M-50 -40 H50 M-28 -128 V-12 M0 -132 V-8 M28 -128 V-12', s: 4 }, { p: 'M-40 -20 L-30 70 H30 L40 -20', f: 1, ft: .9, s: 9 }, { p: 'M0 70 V150 M-50 160 H50', s: 10 },
    { p: L.arc(0, -70, 100, -Math.PI * .3, Math.PI * .3), s: 5, i: 2, m: 'pulse', a: .05, o: [0, -70], b: 1 }, { p: L.arc(0, -70, 100, Math.PI * .7, Math.PI * 1.3), s: 5, i: 2, m: 'pulse', a: .05, o: [0, -70], b: 1 },
  ], { moods: ['euforico', 'desafiante'] });
  M('auriculares', 'AURICULARES', /\b(auriculares?|auricular|headphones?|aud[ií]fonos?|earphones?|earbuds?|airpods?|cascos de m[uú]sica|escuchando m[uú]sica|listening to music|playlist|walkman)\b/i, [
    { p: 'M-110 40 C-120 -150 120 -150 110 40', s: 14 }, { p: L.rr(-140, 10, 60, 110, 24), f: 2, ft: .9, s: 10 }, { p: L.rr(80, 10, 60, 110, 24), f: 2, ft: .9, s: 10 }, { p: L.rr(-125, 30, 30, 70, 14), f: 1, ft: .95, s: 0 }, { p: L.rr(95, 30, 30, 70, 14), f: 1, ft: .95, s: 0 },
    { p: 'M-30 -30 V-80 L20 -95 V-45 M-30 -30 c0 0 -25 0 -25 12 s25 12 25 -12 M20 -45 c0 0 -25 0 -25 12 s25 12 25 -12', s: 4, i: 3, m: 'bob', a: 4 },
  ], { moods: ['sereno', 'melancolico', 'nostalgico'] });
  M('vinilo', 'VINILO', /\b(vinilos?|vinyls?|tocadiscos|turntable|record player|lp|disco de vinilo|discos? de vinilo|gramophone|gram[oó]fono|fonograf[oó]|phonograph|needle|aguja)\b/i, [
    { c: [-20, 0, 150], f: 1, ft: .95, s: 10, m: 'spin', a: 1.5, o: [-20, 0] }, ...[120, 95, 70].map(r => ({ c: [-20, 0, r], s: 2, i: 3, m: 'spin', a: 1.5, o: [-20, 0] })), { c: [-20, 0, 42], f: 2, ft: .95, s: 6, m: 'spin', a: 1.5, o: [-20, 0] }, { c: [-20, 0, 6], f: -1, s: 0 },
    { p: 'M120 -150 L60 -30 L40 -5', s: 8, m: 'sway', a: .02, o: [120, -150] }, { p: 'M28 -10 L50 6 L52 -16 Z', f: 3, ft: .9, s: 4, m: 'sway', a: .02, o: [120, -150] },
  ], { moods: ['nostalgico', 'romantico'] });
  M('casete', 'CASETE', /\b(casetes?|cassettes?|cintas? de audio|cinta magn[eé]tica|mixtape|cassette tape|rebobinar|rewind)\b/i, [
    { p: L.rr(-160, -90, 320, 180, 14), f: 2, ft: .7, s: 10 }, { p: L.rr(-120, -70, 240, 70, 8), f: -1, s: 6 }, { c: [-60, -35, 22], f: 3, ft: .8, s: 7, m: 'spin', a: 2, o: [-60, -35] }, { c: [60, -35, 22], f: 3, ft: .8, s: 7, m: 'spin', a: 2, o: [60, -35] }, { p: 'M-60 -35 H60', s: 3 },
    { p: 'M-70 90 L-50 40 H50 L70 90', f: 3, ft: .8, s: 7 }, { c: [-30, 65, 7], s: 4 }, { c: [30, 65, 7], s: 4 },
  ], { moods: ['nostalgico'] });
  M('altavoz', 'ALTAVOZ', /\b(altavo(z|ces)|speakers?|bocinas?|parlantes?|woofer|subwoofer|sound system|equipo de sonido|a todo volumen|turn it up|boombox)\b/i, [
    { p: L.rr(-100, -170, 200, 340, 20), f: 3, ft: .6, s: 10 }, { c: [0, -80, 36], f: 1, ft: .85, s: 8, m: 'beat', a: .15, o: [0, -80] }, { c: [0, -80, 12], f: -1, s: 5 }, { c: [0, 60, 62], f: 1, ft: .9, s: 9, m: 'beat', a: .2, o: [0, 60] }, { c: [0, 60, 34], f: 3, ft: .6, s: 6, m: 'beat', a: .2, o: [0, 60] }, { c: [0, 60, 12], f: -1, s: 0 },
    { p: L.arc(0, 60, 90, -.5, .5), s: 4, i: 2, m: 'pulse', a: .1, o: [0, 60], b: 1 },
  ], { moods: ['euforico', 'rabioso'] });
  M('notas', 'NOTAS MUSICALES', /\b(notas musicales|musical notes?|do re mi|melod[ií]a|melody|armon[ií]a musical|pentagrama|staff|solfeo|compás|tempo|ritmo|rhythm|beat|beats)\b/i, [
    { p: 'M-140 -60 H140 M-140 -30 H140 M-140 0 H140 M-140 30 H140 M-140 60 H140', s: 3 }, { c: [-70, 55, 20], f: 1, s: 8 }, { p: 'M-52 50 V-60', s: 8 }, { c: [10, 20, 20], f: 2, ft: .95, s: 8, m: 'bob', a: 4 }, { p: 'M28 15 V-90', s: 8, m: 'bob', a: 4 }, { p: 'M-52 -60 H28', s: 12 },
    { c: [90, 40, 20], f: 1, s: 8 }, { p: 'M108 35 V-70 C130 -60 140 -40 130 -20', s: 8 }, { p: 'M-170 -100 V100', s: 6 },
  ], { moods: ['feliz', 'romantico', 'euforico'] });
  M('partitura', 'PARTITURA', /\b(partituras?|sheet music|songbook|cancionero|escribir una canci[oó]n|songwriting|songwriter|compositor|composer)\b/i, [
    { p: L.rect(-120, -160, 240, 320), f: -1, s: 9, m: 'sway', a: .015, o: [0, 160] }, ...[-110, -40, 30, 100].flatMap(y => [0, 1, 2, 3, 4].map(k => ({ p: `M-95 ${y + k * 8} H95`, s: 2 }))), { c: [-40, -85, 8], f: 1, s: 0 }, { p: 'M-33 -85 V-115', s: 3 }, { c: [30, -60, 8], f: 1, s: 0 }, { p: 'M37 -60 V-90', s: 3 }, { c: [10, 15, 8], f: 1, s: 0 }, { p: 'M17 15 V-15', s: 3 },
    { p: 'M110 100 L170 30 L190 50 L130 120 L105 125 Z', f: 2, ft: .9, s: 6 },
  ], { moods: ['nostalgico', 'romantico'] });
  M('dj_mixer', 'DJ', /\b(djs?|disc ?jockey|mezcla|mixer|mezclador|turntables|tornamesa|fiesta electr[oó]nica|electronic music|techno|house music|edm|rave|club|discoteca|nightclub|antro|perreo|reggaet[oó]n|reguet[oó]n)\b/i, [
    { p: L.rr(-170, -20, 340, 150, 14), f: 3, ft: .6, s: 10 }, { c: [-100, 50, 50], f: 1, ft: .95, s: 8, m: 'spin', a: 2, o: [-100, 50] }, { c: [100, 50, 50], f: 1, ft: .95, s: 8, m: 'spin', a: -2, o: [100, 50] }, { c: [-100, 50, 12], f: 2, s: 0 }, { c: [100, 50, 12], f: 2, s: 0 },
    { p: 'M-30 0 V110 M0 0 V110 M30 0 V110', s: 4 }, ...[[-30, 30], [0, 70], [30, 50]].map(([x, y]) => ({ p: L.rect(x - 8, y - 6, 16, 12), f: 2, ft: .95, s: 4 })), { p: 'M-140 -60 L-110 -100 M140 -60 L110 -100 M0 -80 V-130', s: 5, m: 'pulse', a: .2, v: 4, o: [0, -60] },
  ], { moods: ['euforico'] });
  M('arpa', 'ARPA', /\b(arpas?|harps?|lira|lyre|laúd|lute|[aá]ngel tocando|celestial music|m[uú]sica celestial)\b/i, [
    { p: 'M-90 170 C-100 70 -60 -60 -20 -150 C40 -180 100 -140 100 -80 C60 -100 20 -20 0 120 L-10 170 Z', f: 2, ft: .55, s: 10 }, ...[-40, -20, 0, 20, 40, 60, 80].map((x, i) => ({ p: `M${x - 10} ${-130 + i * 10 + 40} L${-40 + i * 16} ${150 - i * 10}`, s: 3 })), { p: 'M-50 170 H30', s: 8 },
  ], { moods: ['sereno', 'romantico'] });
  M('flauta', 'FLAUTA', /\b(flautas?|flutes?|flautista|zampo[nñ]a|pan flute|quena|ocarina|armónica|harmonica|silbato|whistle|silbido|silbar)\b/i, [
    { p: L.rr(-190, -22, 380, 44, 22), f: 3, ft: .6, s: 10, g: 0 }, ...[-90, -50, -10, 30, 70, 110].map(x => ({ c: [x, 0, 9], f: 1, ft: .95, s: 5 })), { e: [-150, 0, 14, 8], f: 1, s: 5 }, { p: 'M-190 -22 V22', s: 8 }, { p: 'M170 -60 C180 -90 200 -80 190 -110', s: 4, m: 'steam', a: 30 },
  ], { g: { r: -.35 }, moods: ['sereno'] });
  M('acordeon', 'ACORDEÓN', /\b(acorde[oó]n(es)?|accordions?|bandone[oó]n|vallenato|cumbia|norte[nñ]o|polka|conjunto norte[nñ]o|tango)\b/i, [
    { p: L.rr(-170, -90, 70, 180, 10), f: 1, ft: .9, s: 10 }, { p: L.rr(100, -90, 70, 180, 10), f: 1, ft: .9, s: 10 }, ...Array.from({ length: 9 }, (_, i) => ({ p: `M${-100 + i * 22} -85 V85`, s: 6, i: 2, m: 'beat', a: .01, o: [0, 0] })), { p: L.rect(-100, -90, 200, 6), s: 4 }, { p: L.rect(-100, 84, 200, 6), s: 4 },
    ...[-130, -110, -150].map((x, i) => ({ c: [x, -50 + i * 40, 9], f: -1, s: 5 })), ...[130, 150, 110].map((x, i) => ({ c: [x, -50 + i * 40, 9], f: -1, s: 5 })),
  ], { moods: ['feliz', 'nostalgico', 'euforico'] });
  M('maracas', 'MARACAS', /\b(maracas?|guiro|g[uü]iro|percusi[oó]n latina|cascabel|rattle|sonajero|shaker|caribe musical|salsa|merengue|bachata)\b/i, [
    { e: [-60, -50, 46, 66, -.4], f: 2, ft: .9, s: 10, m: 'wag', a: .2, o: [-20, 50] }, { p: 'M-30 -5 L-5 100', s: 12, m: 'wag', a: .2, o: [-20, 50] }, { e: [60, -50, 46, 66, .4], f: 1, ft: .9, s: 10, m: 'wag', a: -.2, o: [20, 50], ph: 1 }, { p: 'M30 -5 L5 100', s: 12, m: 'wag', a: -.2, o: [20, 50], ph: 1 },
    { p: 'M-80 -90 L-70 -60 M-40 -90 L-45 -55 M50 -70 L60 -45', s: 4, i: 3 }, ...[[-130, -130], [130, -120], [0, -150]].map(([x, y], i) => ({ p: L.star(x, y, 10, 4, .4), f: 3, s: 3, m: 'pulse', a: .5, o: [x, y], ph: i })),
  ], { moods: ['feliz', 'euforico'] });
  M('escenario', 'ESCENARIO', /\b(escenarios?|stage|conciertos?|concerts?|tarima|gira|festival|banda en vivo|live band|spotlight|reflectores|telón|curtain|aplausos|applause|encore)\b/i, [
    { p: 'M-190 90 H190 V170 H-190 Z', f: 3, ft: .6, s: 9 }, { p: 'M-190 -170 C-150 -100 -150 20 -190 90 M190 -170 C150 -100 150 20 190 90', f: 2, ft: .8, s: 9 }, { p: 'M-190 -170 H190', s: 9 },
    { p: 'M-90 -150 L-140 90 H-40 Z', f: 1, ft: .3, s: 0, m: 'pulse', a: .05, v: 2, o: [-90, -150] }, { p: 'M90 -150 L40 90 H140 Z', f: 2, ft: .3, s: 0, m: 'pulse', a: .05, v: 2, o: [90, -150], ph: 1 }, { c: [-90, -155, 12], f: 2, ft: .95, s: 6 }, { c: [90, -155, 12], f: 2, ft: .95, s: 6 },
    { c: [0, 30, 20], f: 1, ft: .9, s: 8 }, { p: 'M0 50 V90 M-20 70 H20', s: 8 },
  ], { moods: ['euforico', 'desafiante'] });
})();
