// cuento ilustrado: composición procedural, capítulos semánticos y reloj de reproducción compartido.
(() => {
  const R = window.RISO;
  if (!R) return;
  const TAU = Math.PI * 2, clamp = R.clamp;
  const norm = s => String(s || '').normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();
  const hash = s => { let h = 2166136261; for (const ch of String(s)) h = Math.imul(h ^ ch.charCodeAt(0), 16777619); return h >>> 0; };
  const PALETTES = [
    { paper:'#ded0ac', light:'#f0dfb5', gold:'#b29351', rust:'#8b4838', ink:'#302f28', green:'#465444', mist:'#9baf9d', skin:'#c99878' },
    { paper:'#d3c6b5', light:'#eddfc8', gold:'#b7a072', rust:'#804c54', ink:'#34333d', green:'#455855', mist:'#9caba9', skin:'#c69b85' },
    { paper:'#d6c6a0', light:'#f3e2b5', gold:'#b29450', rust:'#994b35', ink:'#333c32', green:'#4c624b', mist:'#a6b48b', skin:'#cda078' },
  ];
  const PLACES = ['taller','jardin','mar','torre'];
  const NAMES = { taller:'el taller de los recuerdos', jardin:'el jardín que escucha', mar:'la orilla de lo que vuelve', torre:'la casa de las historias' };
  const RULES = [
    ['mar', /\b(sea|ocean|shore|boat|river|water|mar|oceano|orilla|barco|rio|agua|sail)\b/],
    ['jardin', /\b(forest|garden|flower|tree|woods|bird|bosque|jardin|flor|flores|arbol|pajaro|primavera)\b/],
    ['torre', /\b(home|house|door|window|book|castle|tower|casa|hogar|puerta|ventana|libro|castillo|torre)\b/],
    ['taller', /\b(paint|art|portrait|face|memory|remember|pintar|arte|retrato|rostro|recuerdo|recordar)\b/],
  ];
  function compile(lines = [], key = '') {
    const seed = hash(key), rng = R.rng(seed);
    let place = 'taller', chapter = 0;
    const beats = lines.map((line, i) => {
      const text = norm(line.text), next = RULES.find(([, rule]) => rule.test(text))?.[0];
      if (next && next !== place) { place = next; chapter++; }
      const sad = /\b(alone|gone|lost|goodbye|cry|tears|solo|sola|adios|llorar|lagrimas|sin ti)\b/.test(text);
      const hope = /\b(love|light|hope|sun|together|amor|luz|esperanza|sol|juntos)\b/.test(text);
      return { t:Number(line.t) || 0, li:i, place, chapter, mood:sad?'ausencia':hope?'encuentro':'memoria', motif:sad?'polilla':hope?'flor':'estrella' };
    });
    return { key, seed, palette:PALETTES[seed % PALETTES.length], hair: rng() > .5, curl:rng(), ornament:rng(), beats };
  }
  function at(book, time) {
    let lo=0, hi=book.beats.length;
    while(lo<hi) { const mid=(lo+hi)>>>1; if(book.beats[mid].t<=time)lo=mid+1;else hi=mid; }
    return book.beats[lo-1] || {t:0,li:-1,place:'taller',chapter:0,mood:'memoria',motif:'estrella'};
  }
  function path(c, d, fill, stroke, width=2) { const p = new Path2D(d); if(fill) {c.fillStyle=fill;c.fill(p);} if(stroke) {c.strokeStyle=stroke;c.lineWidth=width;c.stroke(p);} }
  function ellipse(c,x,y,rx,ry,fill,rotation=0) { c.beginPath();c.ellipse(x,y,rx,ry,rotation,0,TAU);c.fillStyle=fill;c.fill(); }
  function line(c,x,y,xx,yy,color,width=2) { c.beginPath();c.moveTo(x,y);c.lineTo(xx,yy);c.strokeStyle=color;c.lineWidth=width;c.stroke(); }
  function gradient(c,x,y,xx,yy,colors) { const g=c.createLinearGradient(x,y,xx,yy);colors.forEach((v,i)=>g.addColorStop(i/(colors.length-1),v));return g; }
  function leaf(c,x,y,size,angle,p) {
    c.save();c.translate(x,y);c.rotate(angle);
    path(c,`M0 0 Q${-size*.8} ${-size*.8} 0 ${-size*2} Q${size*.65} ${-size*.7} 0 0`,p.green);
    line(c,0,0,0,-size*1.7,p.gold,.8);c.restore();
  }
  function sprig(c,x,y,scale,flip,p,seed) {
    const rng=R.rng(seed);c.save();c.translate(x,y);c.scale(scale*flip,scale);
    path(c,'M0 100 Q-20 -100 65 -330',null,p.gold,3);
    for(let i=0;i<13;i++) {const yy=50-i*28,xx=i*i*.35;leaf(c,xx,yy,22+rng()*14,(i%2?1:-1)*.9,p);if(i%3===0){ellipse(c,xx+20,yy-13,5,7,p.rust);}}
    c.restore();
  }
  function medallion(c,p,seed) {
    const rng=R.rng(seed);c.save();c.translate(800,355);
    ellipse(c,0,0,367,367,p.gold);ellipse(c,0,0,357,357,p.ink);ellipse(c,0,0,351,351,p.light);
    for(let i=0;i<16;i++) {c.save();c.rotate(i*TAU/16);
      path(c,'M0 0 Q-40 -160 -70 -320 Q0 -350 70 -320 Q40 -160 0 0',i%2?p.paper:p.gold,p.rust,1.5);
      path(c,'M0 -50 Q-50 -210 0 -310 Q50 -210 0 -50',i%3?p.mist:p.rust,p.ink,2);
      path(c,'M0 -95 Q-22 -220 0 -275 Q22 -220 0 -95',p.light);
      ellipse(c,0,-332,4+rng()*3,7,p.rust);c.restore();
    }
    ellipse(c,0,0,157,157,p.paper);ellipse(c,0,0,147,147,p.light);
    for(let i=0;i<24;i++){const a=i*TAU/24;ellipse(c,Math.cos(a)*341,Math.sin(a)*341,2,2,p.light);}
    c.restore();
  }
  function scenery(c,book,beat) {
    const p=book.palette, rng=R.rng(book.seed+beat.chapter);
    c.fillStyle=gradient(c,0,0,0,900,[p.ink,p.green,p.paper]);c.fillRect(0,0,1600,900);
    medallion(c,p,book.seed);
    if(beat.place==='jardin') {
      for(let layer=0;layer<3;layer++) { c.globalAlpha=.18+layer*.16;
        for(let i=0;i<8;i++){const x=i*250-100+rng()*80,y=450+layer*80;path(c,`M${x} 800 Q${x+30} ${y} ${x-70} -40 L${x+15} -40 Q${x+120} ${y} ${x+60} 800`,p.ink);}
      }c.globalAlpha=1;
      for(let i=0;i<24;i++){const x=130+rng()*1340,y=580+rng()*190;leaf(c,x,y,18+rng()*30,rng()*2-1,p);}
    } else if(beat.place==='mar') {
      c.fillStyle=gradient(c,0,410,0,800,[p.mist,p.green,p.ink]);c.fillRect(140,420,1320,390);
      for(let i=0;i<35;i++){const y=435+i*10,x=160+rng()*300;line(c,x,y,1100+rng()*340,y,p.paper,1);}
      path(c,'M1020 570 Q1120 620 1240 570 L1210 611 L1060 611Z',p.ink,p.gold,2);
      path(c,'M1140 385 L1140 570 L1030 555 Q1070 470 1140 385',p.light,p.gold,2);
      line(c,1140,375,1140,583,p.ink,4);
    } else if(beat.place==='torre') {
      for(let i=0;i<5;i++){const xx=170+i*280,y=310+rng()*80;c.fillStyle=p.green;c.fillRect(xx,y,110,390);
        path(c,`M${xx-16} ${y} L${xx+55} ${y-130} L${xx+126} ${y}Z`,p.rust,p.gold,2);
        for(let j=0;j<4;j++){path(c,`M${xx+32} ${y+65+j*70} v-25 q23 -42 46 0 v25Z`,p.light,p.ink,3);}
      }
      path(c,'M950 700 Q1030 520 1160 700 L1160 800 L950 800Z',p.ink,p.gold,5);
    } else {
      c.fillStyle=gradient(c,0,630,0,850,[p.paper,p.ink]);c.fillRect(100,660,1400,240);
      for(let i=0;i<12;i++){const xx=100+i*125;line(c,800,600,xx,900,p.gold,1);}
      // pedestal del retrato que se está pintando.
      c.fillStyle=gradient(c,960,600,1210,740,[p.light,p.mist,p.green]);c.fillRect(940,570,265,250);
      path(c,'M925 565 L1190 565 L1222 585 L950 585Z',p.paper,p.gold,2);
      for(let i=0;i<9;i++)line(c,960+i*28,600,960+i*28,798,p.gold,.7);
    }
    for(let i=0;i<6;i++){sprig(c,70+i*42,650+i*24,.8+i*.08,1,p,book.seed+i);sprig(c,1530-i*40,620+i*33,.9+i*.07,-1,p,book.seed+i+19);}
    // marco grabado de la página.
    c.strokeStyle=p.gold;c.lineWidth=2;c.strokeRect(46,32,1508,818);c.strokeRect(55,41,1490,800);
    for(const x of [62,1538])for(const y of [48,834]){c.save();c.translate(x,y);c.rotate(Math.PI/4);c.fillStyle=p.rust;c.fillRect(-7,-7,14,14);c.restore();}
  }
  function bust(c,p,absence) {
    c.save();c.translate(1052,285);
    c.fillStyle=gradient(c,-70,-130,140,280,[p.light,p.mist,p.green]);
    path(c,'M-78 250 Q-65 220 -32 208 L-27 122 Q-93 95 -85 20 Q-112 -65 -48 -104 Q29 -150 88 -96 Q134 -65 110 25 L114 119 Q75 154 38 128 L45 208 Q87 225 125 250Z',c.fillStyle,p.gold,2);
    for(let i=0;i<22;i++) {const x=-85+i*9;path(c,`M${x} -55 Q${x-25} 10 ${x+8} 131`,null,p.paper,2+(i%3));}
    path(c,'M-49 18 Q-28 5 -9 17 M31 17 Q53 6 72 19',null,p.green,2);
    path(c,'M11 12 L-3 62 Q12 71 27 62 M-6 90 Q16 82 35 91',null,p.gold,2);
    path(c,'M-59 0 Q-39 -11 -17 -2 M29 -1 Q54 -12 76 0',null,p.gold,3);
    if(absence){path(c,'M56 54 l-10 26 18 19 -18 30 6 43',null,p.ink,1.4);}
    c.restore();
  }
  function person(c,book,t,energy,place) {
    const p=book.palette, breath=Math.sin(t*.85)*3, hand=Math.sin(t*.7)*.025;
    c.save();c.translate(place==='taller'?675:790,455+breath);
    // cape, shirt and back hair use layered washes rather than flat cartoon outlines.
    path(c,'M-150 -76 Q-235 -4 -214 140 L-285 329 Q-150 390 87 336 L90 160 Q63 30 12 -41Z',gradient(c,-200,-40,120,380,[p.paper,p.mist,p.green]),p.ink,3);
    path(c,`M-133 -62 Q-202 33 -192 132 L${-222+Math.sin(t*.65)*7} 355 L-82 355 Q-64 208 -52 78 L-22 -34Z`,gradient(c,-170,0,-40,270,[p.rust,p.ink]),p.ink,2);
    for(let i=0;i<9;i++)path(c,`M${-204+i*19} 117 Q${-194+i*21} 235 ${-250+i*31} 340`,null,i%2?p.gold:p.paper,.7);
    path(c,'M-98 -59 L-76 -146 L18 -156 L37 -72 Q-30 -21 -98 -59',gradient(c,-60,-160,60,-35,[p.skin,p.rust]),p.ink,2);
    // perfil: frente, nariz, labios y luz de mejilla.
    path(c,'M-102 -283 Q-31 -324 36 -274 Q67 -246 56 -205 L86 -161 L65 -153 Q73 -135 59 -130 Q67 -117 51 -108 Q36 -66 -18 -92 L-74 -126 Q-139 -185 -102 -283Z',gradient(c,-100,-230,70,-120,[p.rust,p.skin,p.light]),p.ink,2.5);
    ellipse(c,-72,-162,19,27,p.skin,-.2);
    path(c,'M-78 -178 Q-59 -181 -62 -151 Q-74 -158 -72 -143',null,p.rust,2);
    path(c,'M20 -205 Q39 -217 55 -205 M29 -201 Q43 -196 54 -204',null,p.ink,2.5);
    line(c,39,-202,40,-197,p.ink,3);line(c,54,-205,59,-211,p.ink,1);
    path(c,'M62 -151 Q50 -150 46 -145 M47 -130 Q56 -132 62 -130 M46 -112 Q29 -106 16 -111',null,p.rust,1.8);
    // mechones con variantes reproducibles por canción.
    path(c,'M-141 -65 Q-206 -72 -168 -151 Q-193 -231 -136 -289 Q-105 -351 -19 -327 Q60 -337 75 -264 Q79 -235 52 -215 Q30 -262 11 -275 Q-18 -219 -89 -188 Q-112 -143 -98 -117 Q-123 -70 -141 -65Z',gradient(c,-140,-340,10,-80,[p.ink,p.rust,p.ink]),p.ink,3);
    for(let i=0;i<30;i++){const f=i/30,xx=-145+f*175;
      path(c,`M${xx} ${-280-Math.sin(f*Math.PI)*36} Q${xx-52} -223 ${-160+f*88} ${book.hair?-70:-124} Q${-188+f*78} -80 ${-135+f*44} -55`,null,i%4?p.gold:p.skin,i%4?.65:1.1);
    }
    // manga y antebrazo articulados: el pincel acompaña al retrato.
    c.save();c.translate(-34,70);c.rotate(hand+energy*.015);
    path(c,'M-35 -11 Q-80 16 -53 95 Q19 170 124 76 L152 12 Q105 -5 72 22 Q15 72 -9 5Z',gradient(c,-40,0,100,100,[p.paper,p.mist,p.green]),p.ink,2.5);
    for(let i=0;i<5;i++)path(c,`M${20+i*13} ${60+i*2} Q${60+i*13} ${92-i*3} ${94+i*9} ${29+i*7}`,null,p.gold,1);
    path(c,'M123 72 Q149 42 158 2 L183 -59 Q188 -73 194 -66 L183 -15 L204 -57 Q213 -66 215 -52 L200 -5 L222 -37 Q233 -44 231 -30 L216 17 Q203 56 168 81Z',gradient(c,130,65,225,-55,[p.skin,p.light]),p.rust,2);
    if(place==='taller') {
      line(c,163,27,330,-57,p.ink,4);line(c,290,-37,330,-57,p.gold,5);
      path(c,'M327 -59 Q347 -70 359 -69 L333 -54Z',p.rust);
    } else if(place==='torre') {
      path(c,'M129 32 Q185 6 225 38 Q264 3 309 20 L297 100 Q258 84 222 112 Q178 83 140 101Z',p.paper,p.gold,2);
      path(c,'M225 38 L222 112',null,p.rust,2);
      for(let i=0;i<5;i++){line(c,154,47+i*9,204,52+i*9,p.gold,1);line(c,240,49+i*8,283,40+i*8,p.gold,1);}
    } else if(place==='mar') {
      path(c,'M196 -18 Q207 -62 219 -18',null,p.gold,2);
      path(c,'M180 -14 L234 -14 L240 65 L176 65Z',p.ink,p.gold,3);
      path(c,'M187 -5 L228 -5 L229 54 L184 54Z',p.light);
      ellipse(c,207,32,7,19,p.gold);line(c,207,-5,207,54,p.rust,2);
    } else {
      path(c,'M199 27 Q221 -10 211 -55',null,p.green,3);
      for(let i=0;i<6;i++){const a=i*TAU/6;ellipse(c,211+Math.cos(a)*14,-55+Math.sin(a)*14,9,16,p.rust,a);}
      ellipse(c,211,-55,8,8,p.gold);
    }
    c.restore();
    c.restore();
  }
  let cacheKey='', book=null, linesRef=null, texture=null;
  const pages=new Map();
  function paper(seed) {
    const canvas=document.createElement('canvas');canvas.width=1000;canvas.height=625;
    const c=canvas.getContext('2d'),rng=R.rng(seed);
    for(let i=0;i<18000;i++){c.fillStyle=i%2?'rgba(255,240,202,.09)':'rgba(38,31,22,.07)';c.fillRect(rng()*1000,rng()*625,1+rng()*2,1);}
    for(let i=0;i<700;i++){const x=rng()*1000,y=rng()*625;line(c,x,y,x+4+rng()*12,y+rng()*2,'rgba(239,221,178,.045)',.7);}
    return canvas;
  }
  function prepare(lines,key) {
    if(cacheKey!==key || linesRef!==lines) {cacheKey=key;linesRef=lines;book=compile(lines,key);pages.clear();texture=paper(book.seed);}
    return book;
  }
  function page(b,beat) {
    const key=beat.place+'|'+beat.chapter;
    if(!pages.has(key)) {const cv=document.createElement('canvas');cv.width=1600;cv.height=900;scenery(cv.getContext('2d'),b,beat);pages.set(key,cv);if(pages.size>2)pages.delete(pages.keys().next().value);}
    return pages.get(key);
  }
  function wrapped(c,text,width,size,maxLines=3) {
    const words=String(text||'').split(/\s+/);let rows=[];
    for(;size>=14;size-=2) {c.font=`500 ${size}px "Cormorant Garamond", Georgia, serif`;rows=[''];for(const word of words){const i=rows.length-1,next=(rows[i]+' '+word).trim();if(c.measureText(next).width>width&&rows[i])rows.push(word);else rows[i]=next;}if(rows.length<=maxLines)break;}
    return {rows,size:Math.max(14,size)};
  }
  function render(c,w,h,time,o={}) {
    const b=prepare(o.lines||[],o.key||o.title||'lumora'),beat=at(b,time),p=b.palette;
    const reduced=!!o.reduced||matchMedia('(prefers-reduced-motion: reduce)').matches, t=reduced?0:time;
    const energy=reduced?0:clamp(window.AUD?.live?window.AUD.level:window.LMAUDIO?.features?.rms||0);
    c.save();c.setTransform(1,0,0,1,0,0);c.globalAlpha=1;c.globalCompositeOperation='source-over';
    c.fillStyle=p.ink;c.fillRect(0,0,w,h);
    const footer=Math.max(h*.24,Math.min(170,h*.34)),artH=h-footer,scale=Math.max(w/1600,artH/900);
    c.save();c.beginPath();c.rect(0,0,w,artH);c.clip();c.translate(w/2,artH/2);
    // respiración del encuadre; respeta cámara y movimiento reducido.
    const move=!reduced&&window.CFG?.camera!==false, zoom=move?1+Math.sin(t*.08)*.008:1;
    c.scale(scale*zoom,scale*zoom);c.translate(-800+(move?Math.sin(t*.12)*4:0),-450);
    const chapterStart=b.beats.find(v=>v.chapter===beat.chapter), previous=chapterStart&&at(b,chapterStart.t-.001);
    const progress=reduced?1:clamp((time-(chapterStart?.t||0))/1.8);
    if(previous && previous.chapter!==beat.chapter && progress<1) {
      c.drawImage(page(b,previous),0,0);c.globalAlpha=progress;c.drawImage(page(b,beat),0,0);c.globalAlpha=1;
    } else c.drawImage(page(b,beat),0,0);
    if(beat.place==='taller') {c.globalAlpha=progress;bust(c,p,beat.mood==='ausencia');c.globalAlpha=1;}
    person(c,b,t,energy,beat.place);
    if(beat.place!=='taller') {c.save();c.translate(1070,540);c.rotate(Math.sin(t*.4)*.03);
      path(c,'M-90 90 Q-170 10 -118 -59 Q-140 -137 -61 -125 Q-22 -190 31 -118 Q109 -111 70 -39 Q138 37 52 90Z',p.green,p.gold,2);
      if(beat.motif==='flor')for(let i=0;i<7;i++){const a=i*TAU/7;ellipse(c,Math.cos(a)*22,-51+Math.sin(a)*22,14,24,p.rust,a);}
      else if(beat.motif==='polilla'){ellipse(c,-22,-62,25,13,p.paper,-.4);ellipse(c,22,-62,25,13,p.paper,.4);}
      else {path(c,'M0 -100 L10 -70 L42 -60 L10 -50 L0 -20 L-10 -50 L-42 -60 L-10 -70Z',p.light);}
      c.restore();
    }
    for(let i=0;i<20;i++){const rng=R.rng(b.seed+i*711),xx=rng()*1600,yy=rng()*800;
      c.globalAlpha=.15+(Math.sin(t*.5+i)+1)*.1;ellipse(c,xx+Math.sin(t*.2+i)*9,yy-Math.sin(t*.3+i)*12,1.5,2.7,p.light);}
    c.globalAlpha=.85;c.drawImage(texture,0,0,1600,900);c.globalAlpha=1;
    const vignette=c.createRadialGradient(800,380,150,800,450,870);vignette.addColorStop(0,'#18181200');vignette.addColorStop(1,'#181812a0');c.fillStyle=vignette;c.fillRect(0,0,1600,900);c.restore();
    c.fillStyle=p.ink;c.fillRect(0,artH,w,footer);line(c,w*.07,artH+1,w*.93,artH+1,p.gold,1);
    const narrow=w<600,margin=Math.max(20,w*.08),labelSize=narrow?10:12;
    c.fillStyle=p.gold;c.textAlign='center';c.font=`500 ${labelSize}px "Martian Mono", monospace`;
    const caption=`${String(beat.chapter+1).padStart(2,'0')} / ${NAMES[beat.place]}`;c.fillText(caption,w/2,artH+24);
    const text=o.showText===false?'':o.text||o.title||'una historia por escuchar', hasTr=o.showText!==false&&!!o.translation;
    const fit=wrapped(c,text,w-margin*2,Math.min(narrow?28:36,footer*.24)*(window.CFG?.lyricSize||1),hasTr?2:3);
    c.fillStyle=p.light;c.font=`500 ${fit.size}px "Cormorant Garamond", Georgia, serif`;
    fit.rows.forEach((row,i)=>c.fillText(row,w/2,artH+51+i*fit.size*1.08));
    if(hasTr) {const tr=wrapped(c,o.translation,w-margin*2,Math.min(18,footer*.13),2);c.font=`italic ${tr.size}px Georgia, serif`;c.fillStyle=p.paper;tr.rows.forEach((row,i)=>c.fillText(row,w/2,artH+54+fit.rows.length*fit.size*1.08+i*tr.size*1.1));}
    c.restore();
    return beat;
  }
  R.cuento={compile,at,prepare,render,places:PLACES,get book(){return book;},get cachedPages(){return pages.size;}};
})();
