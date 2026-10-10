// fábula: composición procedural, capítulos semánticos y reloj de reproducción compartido.
(() => {
  const R = window.RISO;
  if (!R) return;
  const EMPTY = Object.freeze([]);
  const TAU = Math.PI * 2, clamp = R.clamp;
  const norm = s => String(s || '').normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();
  const hash = s => { let h = 2166136261; for (const ch of String(s)) h = Math.imul(h ^ ch.charCodeAt(0), 16777619); return h >>> 0; };
  const PALETTES = [
    { paper:'#ded0ac', light:'#f0dfb5', gold:'#b29351', rust:'#8b4838', ink:'#302f28', green:'#465444', mist:'#9baf9d', skin:'#c99878' },
    { paper:'#d3c6b5', light:'#eddfc8', gold:'#b7a072', rust:'#804c54', ink:'#34333d', green:'#455855', mist:'#9caba9', skin:'#c69b85' },
    { paper:'#d6c6a0', light:'#f3e2b5', gold:'#b29450', rust:'#994b35', ink:'#333c32', green:'#4c624b', mist:'#a6b48b', skin:'#cda078' },
  ];
  const PLACES = Object.keys(R.fabulaWorld.names), NAMES=R.fabulaWorld.names;
  const sceneOf=text=>RULES.find(([,rx])=>rx.test(text))?.[0]||Object.entries(R.SCENE_RX||{}).find(([id,rx])=>PLACES.includes(id)&&rx.test(text))?.[0];
  const RULES = [
    ['mar', /\b(sea|ocean|shore|boat|river|water|mar|oceano|orilla|barco|rio|agua|sail)\b/],
    ['jardin', /\b(garden|flower|jardin|flor|flores|primavera)\b/],
    ['bosque', /\b(forest|tree|woods|bird|bosque|arbol|pajaro)\b/],
    ['torre', /\b(book|castle|tower|libro|castillo|torre)\b/],
    ['cuarto', /\b(home|house|door|window|bed|casa|hogar|puerta|ventana|cama)\b/],
    ['taller', /\b(paint|portrait|pintar|retrato)\b/],
    ['ciudad', /\b(city|street|taxi|car|ciudad|calle|coche|drive)\b/],
    ['teatro', /\b(dance|party|stage|sing|bailar|fiesta|escenario|cantar)\b/],
    ['estacion', /\b(train|station|leaving|tren|estacion|partir)\b/],
    ['puente', /\b(bridge|cross|puente|cruzar)\b/],
    ['desierto', /\b(desert|sand|desierto|arena)\b/],
    ['cielo', /\b(stars|space|moon|sky|estrellas|espacio|luna|cielo)\b/],
  ];
  function namedObjects(text,key,index){
    const out=[];
    for(const [id,rx] of R.people?.RX||[]){
      const cat=R.catalog?.info[id]?.cat;
      if(window.CFG?.catOn?.[cat]===false||window.CFG?.symbols===false&&cat==='banderas')continue;
      rx.lastIndex=0;const m=text.match(rx);
      if(m&&!/[a-z]/.test(text[m.index-1]||'')&&!/[a-z]/.test(text[m.index+m[0].length]||'')&&(hash(key+'|'+index+'|'+id)%1000)/1000<(window.CFG?.catFreq??1))out.push(id);
      if(out.length===3)break;
    }
    return out;
  }
  function atmosphere(lines){
    if(!R.atmos)return [];
    const {key,rows}=R.atmos,result=R.atmos.plan(lines);
    // una vista previa no debe cambiar el clima del motor que está reproduciendo música.
    R.atmos.key=key;R.atmos.rows=rows;return result;
  }
  function compile(lines = [], key = '', o={}) {
    const seed=hash(key),rng=R.rng(seed),duration=Math.max(o.duration||0,(lines.at(-1)?.t||0)+12,60);
    // instrumentales y pausas también reciben tomas: el motor nunca depende de encontrar una palabra.
    const film=R.film?.compile(lines,o.cuts||[],o.plans||[],duration,o.edits||{}), atmos=atmosphere(lines);
    const cast=(window.CFG?.singers===false?[]:R.singers?.plan(o.artist||'',o.title||'')||[]).map(v=>R.artistFigures?.profile(v.name,v.id,o.album||'')||{});
    const shots=[],beats=[],reprises=new Map();let lastPlace='',chapter=-1;
    const count=Math.ceil(duration/8);
    for(let i=0;i<count;i++){
      const t=i*8;let li=-1;for(let j=0;j<lines.length&&lines[j].t<=t;j++)li=j;
      const text=norm(lines[li]?.text),n=film?.beats[li],env=atmos[li]||{},literal=sceneOf(text);
      const section=n?.section?.role|| (i===0?'intro':i===count-1?'outro':'verse');
      const route=['ciudad','puente','jardin','bosque','mar','torre','estacion','cuarto','desierto','cielo','teatro'];
      let place=literal||route[(Math.floor(i/2)+seed)%route.length];
      // el estribillo retoma su escenario principal entre nuevas escenas del mismo viaje.
      if(section==='chorus'||section==='climax'){if(!reprises.has(text))reprises.set(text,literal||'teatro');place=i%4===0?reprises.get(text):['teatro','ciudad','puente','jardin','mar'][Math.floor(i/2)%5];}
      if(place!==lastPlace){chapter++;lastPlace=place;}
      const sad=/\b(alone|gone|lost|goodbye|cry|tears|solo|sola|adios|llorar|lagrimas)\b/.test(text);
      const named=namedObjects(text,key,i);
      const action=n?.action&&n.action!=='hold'?n.action:env.act|| (place==='teatro'?'dance':sad?'remember':['walk','wait','reach'][i%3]);
      const motif=(n?.manual?n.motif:null)||named[0]||n?.motif|| (sad?'foto_rota':'flowers');
      const camera=n?.manual?(n.kind==='prop'?'detail':n.camera):named.length&&i%3===1?'detail':['wide','medium','close','wide','reverse'][i%5];
      shots.push({t,li,place,chapter,seed:hash(key+'|'+i),camera,action,motif,named,weather:env.weather,daytime:env.time,section,mood:sad?'ausencia':'encuentro',narrative:n||null});
    }
    // las decisiones manuales y los cambios semánticos empiezan exactamente en el verso.
    for(let li=0;li<lines.length;li++){
      const t=Number(lines[li].t)||0,base=shots[Math.min(count-1,Math.max(0,Math.floor(t/8)))],n=film?.beats[li];
      const literal=sceneOf(norm(lines[li].text));
      const text=norm(lines[li].text),env=atmos[li]||{},named=namedObjects(text,key,li);
      const action=n?.manual?n.action:n?.action&&n.action!=='hold'?n.action:env.act||base.action;
      const camera=n?.manual?(n.kind==='prop'?'detail':n.camera):n?.action&&n.action!=='hold'?n.camera:named.length&&li%3===1?'detail':base.camera;
      beats.push({...base,t,li,place:literal||base.place,action,camera,named,weather:env.weather,daytime:env.time,narrative:n||null,motif:(n?.manual?n.motif:null)||named[0]||n?.motif||base.motif});
    }
    const timeline=[...shots,...beats].sort((a,b)=>a.t-b.t); // el verso gana los empates mediante orden estable.
    return {key,seed,palette:PALETTES[seed%PALETTES.length],hair:rng()>.5,curl:rng(),ornament:rng(),cast,beats,timeline,duration};
  }
  function at(book,time){const rows=book.timeline;let lo=0,hi=rows.length;while(lo<hi){const m=(lo+hi)>>>1;if(rows[m].t<=time)lo=m+1;else hi=m;}return rows[Math.max(0,lo-1)];}
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
    const p=book.palette;
    c.fillStyle=gradient(c,0,0,0,900,[p.ink,p.green,p.paper]);c.fillRect(0,0,1600,900);
    medallion(c,p,book.seed);
      c.fillStyle=gradient(c,0,630,0,850,[p.paper,p.ink]);c.fillRect(100,660,1400,240);
      for(let i=0;i<12;i++){const xx=100+i*125;line(c,800,600,xx,900,p.gold,1);}
      // pedestal del retrato que se está pintando.
      c.fillStyle=gradient(c,960,600,1210,740,[p.light,p.mist,p.green]);c.fillRect(940,570,265,250);
      path(c,'M925 565 L1190 565 L1222 585 L950 585Z',p.paper,p.gold,2);
      for(let i=0;i<9;i++)line(c,960+i*28,600,960+i*28,798,p.gold,.7);
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
  let cacheKey='', book=null, linesRef=null, texture=null, directorKey='';
  const pages=new Map();
  function paper(seed) {
    const canvas=document.createElement('canvas');canvas.width=1000;canvas.height=625;
    const c=canvas.getContext('2d'),rng=R.rng(seed);
    for(let i=0;i<18000;i++){c.fillStyle=i%2?'rgba(255,240,202,.09)':'rgba(38,31,22,.07)';c.fillRect(rng()*1000,rng()*625,1+rng()*2,1);}
    for(let i=0;i<700;i++){const x=rng()*1000,y=rng()*625;line(c,x,y,x+4+rng()*12,y+rng()*2,'rgba(239,221,178,.045)',.7);}
    return canvas;
  }
  function prepare(lines,key,o={}) {
    const signature=JSON.stringify([o.duration,o.artist,o.album,o.cuts,o.plans,o.edits,window.CFG?.catOn,window.CFG?.catFreq,window.CFG?.singers,window.CFG?.symbols]);
    if(cacheKey!==key || linesRef!==lines || directorKey!==signature) {directorKey=signature;cacheKey=key;linesRef=lines;book=compile(lines,key,o);pages.clear();texture=paper(book.seed);}
    return book;
  }
  function page(b,beat) {
    const key=beat.place+'|'+beat.seed;
    if(!pages.has(key)) {const cv=document.createElement('canvas');cv.width=1600;cv.height=900;if(beat.place==='taller')scenery(cv.getContext('2d'),b,beat);else R.fabulaWorld.background(cv.getContext('2d'),b,beat);pages.set(key,cv);if(pages.size>2)pages.delete(pages.keys().next().value);}
    return pages.get(key);
  }
  function wrapped(c,text,width,size,maxLines=3) {
    const words=String(text||'').split(/\s+/);let rows=[];
    for(;size>=14;size-=2) {c.font=`500 ${size}px "Iowan Old Style", "Palatino Linotype", Georgia, serif`;rows=[''];for(const word of words){const i=rows.length-1,next=(rows[i]+' '+word).trim();if(c.measureText(next).width>width&&rows[i])rows.push(word);else rows[i]=next;}if(rows.length<=maxLines)break;}
    return {rows,size:Math.max(14,size)};
  }
  function render(c,w,h,time,o={}) {
    const b=prepare(o.lines||EMPTY,o.key||o.title||'lumora',o),beat=at(b,time),p=b.palette;
    const reduced=!!o.reduced||matchMedia('(prefers-reduced-motion: reduce)').matches, t=reduced?0:time;
    const energy=reduced?0:clamp((window.AUD?.live?window.AUD.level:window.LMAUDIO?.features?.rms||0)*(window.CFG?.intensity||1));
    c.save();c.setTransform(c.canvas.width/w,0,0,c.canvas.height/h,0,0);c.globalAlpha=1;c.globalCompositeOperation='source-over';
    c.fillStyle=p.ink;c.fillRect(0,0,w,h);
    const safe=Math.max(0,Math.min(h*.35,o.safeBottom||0)),footer=o.wallpaper?0:Math.max(h*.22,Math.min(170,h*.34)),artH=h-footer-safe,scale=Math.max(w/1600,artH/900);
    c.save();c.beginPath();c.rect(0,0,w,artH);c.clip();c.translate(w/2,artH/2);
    // respiración del encuadre; respeta cámara y movimiento reducido.
    const move=!reduced&&window.CFG?.camera!==false, amount=clamp(window.CFG?.cameraAmt??1,.2,2), zoom=move?1+Math.sin(t*.08)*.008*amount:1;
    c.scale(scale*zoom,scale*zoom);c.translate(-800+(move?Math.sin(t*.12)*4*amount:0),-450);
    // cada toma nace del tiempo absoluto: búsqueda, exportación y reproducción comparten la imagen.
    const previous=at(b,beat.t-.001),progress=reduced||window.CFG?.transitions==='ninguna'?1:clamp((time-beat.t)/.65);
    const drawShot=(shot,alpha)=>{
      c.save();c.globalAlpha=alpha;
      const z=window.CFG?.camera===false?1:({wide:1,medium:1.18,close:1.8,detail:1.25,reverse:1.15}[shot.camera]||1);
      const focusX=shot.camera==='detail'?800:shot.camera==='close'?760:800, focusY=shot.camera==='close'?480:450;
      c.translate(800,450);c.scale(z,z);if(shot.camera==='reverse')c.scale(-1,1);c.translate(-focusX,-focusY);
      c.drawImage(page(b,shot),0,0);R.fabulaWorld.setPieces(c,b,shot,t);
      if(shot.place==='taller'&&shot.camera!=='detail'){bust(c,p,shot.mood==='ausencia');person(c,b,t,energy,'taller');}
      else if(shot.camera==='detail'){
        ellipse(c,800,520,270,180,p.ink+'88');
        R.fabulaWorld.object(c,b,shot,800,455,1.1+energy*.05,t,energy,reduced);
      }else{
        const walk=['walk','run','leave','return','board'].includes(shot.action)?Math.sin(t*.18)*140:0;
        const poseTime=reduced?0:t;
        R.fabulaWorld.actor(c,b,shot,760+walk,790,1.35,poseTime,energy);
        if(['give','reach','dance'].includes(shot.action))R.fabulaWorld.actor(c,b,shot,1040,780,1.16,poseTime+1,energy,true);
        if(shot.action==='open'){
          const open=reduced?1:clamp((time-shot.t)/3);c.save();c.translate(1070,300);c.scale(1-open*.7,1);path(c,'M0 0 L175 0 L175 490 L0 490Z',p.rust,p.gold,5);ellipse(c,145,250,8,8,p.gold);c.restore();
        }
        if(shot.action==='board')R.fabulaWorld.prop(c,'taxi',1160,710,.85,p,t,energy);
        for(let i=0;i<Math.min(2,shot.named.length);i++)if(shot.named[i]!==shot.motif)R.fabulaWorld.prop(c,shot.named[i],330+i*920,710,.45,p,t,energy);
      }
      R.fabulaWorld.motion(c,b,shot,t,energy);c.restore();
    };
    if(progress<1&&previous!==beat)drawShot(previous,1);
    drawShot(beat,progress);
    for(let i=0;i<20;i++){const rng=R.rng(b.seed+i*711),xx=rng()*1600,yy=rng()*800;
      c.globalAlpha=.15+(Math.sin(t*.5+i)+1)*.1;ellipse(c,xx+Math.sin(t*.2+i)*9,yy-Math.sin(t*.3+i)*12,1.5,2.7,p.light);}
    c.globalAlpha=.85;c.drawImage(texture,0,0,1600,900);c.globalAlpha=1;
    const vignette=c.createRadialGradient(800,380,150,800,450,870);vignette.addColorStop(0,'#18181200');vignette.addColorStop(1,'#181812a0');c.fillStyle=vignette;c.fillRect(0,0,1600,900);c.restore();
    if(o.wallpaper) { c.restore(); return beat; }
    c.fillStyle=p.ink;c.fillRect(0,artH,w,footer+safe);line(c,w*.07,artH+1,w*.93,artH+1,p.gold,1);
    const narrow=w<600,margin=Math.max(20,w*.08),labelSize=narrow?10:12;
    c.fillStyle=p.gold;c.textAlign='center';c.font=`500 ${labelSize}px "Iowan Old Style", Georgia, serif`;
    const caption=`${String(beat.chapter+1).padStart(2,'0')} / ${NAMES[beat.place]}`;c.fillText(caption,w/2,artH+24);
    const text=o.showText===false?'':o.text||o.title||'una historia por escuchar', hasTr=o.showText!==false&&!!o.translation;
    const fit=wrapped(c,text,w-margin*2,Math.min(narrow?28:36,footer*.24)*(window.CFG?.lyricSize||1),hasTr?2:3);
    c.fillStyle=p.light;c.font=`500 ${fit.size}px "Iowan Old Style", "Palatino Linotype", Georgia, serif`;
    fit.rows.forEach((row,i)=>c.fillText(row,w/2,artH+51+i*fit.size*1.08));
    if(hasTr) {const tr=wrapped(c,o.translation,w-margin*2,Math.min(18,footer*.13),2);c.font=`italic ${tr.size}px Georgia, serif`;c.fillStyle=p.paper;tr.rows.forEach((row,i)=>c.fillText(row,w/2,artH+54+fit.rows.length*fit.size*1.08+i*tr.size*1.1));}
    c.restore();
    return beat;
  }
  R.fabula={compile,at,prepare,render,places:PLACES,get book(){return book;},get cachedPages(){return pages.size;}};
})();
