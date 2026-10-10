// personajes de cuento: proporciones adultas, ropa con volumen y brazos con dos articulaciones.
(() => {
  const R=window.RISO,W=R?.fabulaWorld;if(!W)return;
  const tau=Math.PI*2,clamp=v=>Math.max(0,Math.min(1,v));
  const path=(c,d,f,s,w=1)=>{const q=new Path2D(d);if(f){c.fillStyle=f;c.fill(q);}if(s){c.strokeStyle=s;c.lineWidth=w;c.stroke(q);}};
  const ellipse=(c,x,y,rx,ry,f,a=0)=>{c.beginPath();c.ellipse(x,y,rx,ry,a,0,tau);c.fillStyle=f;c.fill();};
  const wash=(c,x,y,xx,yy,...colors)=>{const g=c.createLinearGradient(x,y,xx,yy);colors.forEach((v,i)=>g.addColorStop(i/(colors.length-1),v));return g;};
  function arm(c,sx,sy,hx,hy,p,back){
    const dx=hx-sx,dy=hy-sy,d=Math.max(1,Math.hypot(dx,dy)),len=95,a=Math.acos(Math.min(1,d/(len*2))),angle=Math.atan2(dy,dx)+(back?-a:a),ex=sx+Math.cos(angle)*len,ey=sy+Math.sin(angle)*len;
    const sleeve=wash(c,sx-25,sy,ex+25,hy,p.paper,p.mist,p.green);
    path(c,`M${sx-17} ${sy} Q${ex-24} ${ey-12} ${hx-10} ${hy} Q${hx} ${hy+16} ${hx+12} ${hy+4} Q${ex+24} ${ey+14} ${sx+18} ${sy+8}Z`,sleeve,p.ink,1.5);
    path(c,`M${sx-8} ${sy+20} Q${ex-12} ${ey+18} ${hx-2} ${hy+6}`,null,p.gold,.8);
    ellipse(c,hx,hy+3,10,14,wash(c,hx-8,hy-12,hx+8,hy+12,p.light,p.skin,p.rust),-.2);
    path(c,`M${hx+4} ${hy-6} q12 -9 12 2 l-5 10`,null,p.rust,1.2);
  }
  function actor(c,b,shot,x,y,s,time,energy,partner=false,reduced=false){
    const p=b.palette,profile=b.cast[partner?1:0]||{},pose=R.fabulaDirector.pose(shot,time,reduced),act=shot.action,t=reduced?0:time;
    const gait=pose.gait,breathe=Math.sin(t*1.2)*1.4,dance=act==='dance'?Math.sin(t*3)*(4+energy*8):0,clothes=partner?p.rust:p.green;
    const skin=profile.skin>.35?'#9f7053':p.skin,hair=profile.hair||(partner?'bun':'waves'),hairColor=profile.hairInk>=2?p.gold:p.ink;
    ellipse(c,x,y+6,80*s,13*s,p.ink+'66');
    c.save();c.translate(x,y-breathe-Math.abs(dance));c.scale(s*(partner?-1:1)*(profile.build||1),s);c.rotate(act==='sleep'?-1.35:act==='cry'?-.07:dance*.003);
    for(const side of [-1,1]){
      const hip=side*22,knee=side*27+gait*side*29,foot=side*32-gait*side*44;
      path(c,`M${hip-17} -220 Q${knee-19} -129 ${foot-14} -17 L${foot+13} -17 Q${knee+16} -126 ${hip+17} -220Z`,wash(c,hip-20,-200,hip+30,-10,p.ink,clothes,p.ink),p.ink,1.4);
      path(c,`M${hip} -190 Q${knee-5} -110 ${foot} -33`,null,p.gold,.6);
      path(c,`M${foot-15} -23 Q${foot+2} -28 ${foot+18} -12 L${foot+34} -4 Q${foot+40} 7 ${foot-19} 1Z`,p.ink,p.gold,1);
    }
    arm(c,-43,-370,-57-gait*18,-230,p,true);
    path(c,'M-33 -403 Q-70 -384 -66 -332 L-47 -215 Q-3 -198 49 -214 L61 -343 Q53 -390 27 -403Z',wash(c,-60,-360,65,-210,p.mist,clothes,p.ink),p.ink,1.5);
    // paños y pliegues siguen la anatomía, sin reducir el cuerpo a líneas gruesas.
    if(['dress','coat'].includes(profile.outfit))path(c,`M-43 -300 Q-42 -190 ${-72+Math.sin(t)*4} -95 Q0 -72 78 -99 Q47 -190 43 -300Z`,wash(c,-60,-280,80,-100,p.mist,clothes,p.ink),p.ink,1.4);
    for(let i=0;i<7;i++)path(c,`M${-39+i*12} -357 Q${-48+i*16} -282 ${-34+i*11} -221`,null,p.gold,.6);
    path(c,`M-33 -397 Q-56 -341 -46 -252 L${-62+Math.sin(t*.9)*5} -155 L-5 -158 Q-24 -308 -7 -399Z`,wash(c,-50,-390,20,-150,p.rust,p.ink),p.gold,1);
    path(c,'M-15 -443 L-16 -403 Q4 -385 23 -402 L18 -447Z',wash(c,-20,-440,30,-395,p.rust,skin,p.light),p.ink,1);
    c.save();c.translate(0,-465);c.rotate(act==='cry'||act==='remember'?.12:act==='reach'?-.08:Math.sin(t*.7)*.015);c.scale(profile.face?.width||1,profile.face?.height||1);
    // rostro en tres cuartos: mandíbula, pómulo, nariz, párpados y boca independientes.
    path(c,'M-28 -45 Q11 -65 31 -38 Q41 -20 31 -4 L43 9 L32 14 Q38 25 26 27 Q22 47 3 42 L-24 20 Q-43 -8 -28 -45Z',wash(c,-35,-30,40,28,p.rust,skin,p.light),p.ink,1.1);
    ellipse(c,-23,5,8,13,skin,-.2);path(c,'M-26 -2 Q-17 -7 -18 10',null,p.rust,1);
    const long=['long','waves','dreads','bob','beehive'].includes(hair);
    if(hair!=='bald')path(c,`M-35 24 Q-58 -28 -23 -53 Q10 -78 36 -46 Q50 -28 29 -15 Q16 -31 7 -40 Q-8 -19 -28 -11 L-21 ${long?70:26} L-43 ${long?78:25}Z`,wash(c,-45,-60,35,50,hairColor,p.rust,hairColor),p.ink,1.2);
    if(hair==='curls'||hair==='afro')for(let i=0;i<12;i++){const a=i*Math.PI/11;ellipse(c,Math.cos(a)*33,-28-Math.sin(a)*33,11,13,hairColor);}
    if(hair==='bun'||hair==='beehive')ellipse(c,-23,-56,18,hair==='beehive'?29:20,hairColor);
    if(long)for(let i=0;i<12;i++)path(c,`M${-34+i*4} -42 Q${-50+i*5} -12 ${-35+i*2} ${40+i%3*9}`,null,p.gold,.55);
    const blink=!reduced&&t%5.3<.12,down=act==='cry'||act==='remember';
    path(c,`M10 -8 Q20 ${down?-9:-15} 29 -8 M12 ${blink?-5:-3} Q20 ${blink?-5:0} 28 -5`,null,p.ink,1.3);
    if(!blink)ellipse(c,23,-4,1.6,2.2,p.ink);
    path(c,`M12 -20 Q23 ${act==='cry'?-24:-23} 29 -17 M31 2 l-5 9 M15 29 Q23 ${act==='cry'?23:32} 30 27`,null,p.rust,1.1);
    if(act==='sing')ellipse(c,23,29,4,6,p.rust);
    if(act==='cry')ellipse(c,25,9+(t%2)*8,1.8,4,p.light);
    if(profile.glasses){path(c,'M6 -12 h24 v15 H6Z M-15 -10 L6 -7',null,p.ink,1.5);}
    if(profile.beard)path(c,'M-10 28 Q16 50 32 20 Q25 51 1 45Z',hairColor);
    if(profile.earrings)ellipse(c,-24,18,3,6,p.gold);
    if(profile.hat)path(c,'M-54 -28 L-32 -37 L-26 -72 L23 -69 L31 -35 L48 -27Z',p.ink,p.gold,1.3);
    c.restore();
    let hx=58+gait*16,hy=-242;
    if(['give','reach','open'].includes(act)){hx=70+pose.ease*90;hy=-300-pose.ease*15;}
    if(act==='remember'){hx=45;hy=-345;}
    if(act==='cry'){hx=35;hy=-442;}
    if(act==='sing'){hx=42;hy=-427;}
    if(act==='dance'){hx=70+Math.sin(t*3)*25;hy=-350-Math.cos(t*3)*45;}
    if(partner&&act==='give'){hx=70+pose.ease*60;hy=-313;}
    arm(c,43,-370,hx,hy,p,false);
    const owns=act==='give'?partner===pose.letterGiven:!partner;
    if(owns&&shot.motif&&['give','remember','wilt','grow','reach'].includes(act))W.prop(c,shot.motif,hx+10,hy,.16,p,t,energy);
    if(act==='sing'){path(c,`M${hx} ${hy} l4 -25`,null,p.ink,5);ellipse(c,hx+4,hy-30,7,10,p.gold);}
    if(window.CFG?.instruments!==false&&profile.instrument&&['sing','dance'].includes(act))W.prop(c,profile.instrument,10,-290,.36,p,t,energy);
    c.restore();
  }
  W.detail=(c,b,shot,time,reduced)=>{
    const p=b.palette,pose=R.fabulaDirector.pose(shot,time,reduced),give=shot.action==='give',tear=shot.action==='tear';
    const hand=(x,y,flip)=>{c.save();c.translate(x,y);c.scale(flip,1);
      path(c,'M-420 150 L-140 38 Q-90 5 -50 -2 L35 -58 Q55 -65 48 -44 L-5 -3 L70 -30 Q91 -31 77 -13 L17 16 L79 5 Q99 12 78 24 L27 43 Q-15 72 -96 87 L-420 240Z',wash(c,-260,180,20,-20,p.rust,p.skin,p.light),p.rust,2);
      path(c,'M-420 132 L-181 32 L-120 130 L-420 251Z',wash(c,-350,130,-140,160,p.paper,p.mist,p.green),p.ink,2);
      for(let i=0;i<5;i++)path(c,`M${-350+i*30} ${112-i*6} l50 112`,null,p.gold,1);c.restore();};
    const offset=tear?pose.ease*65:0;
    hand(730-offset,570,1);
    if(give||tear)hand(1040-(give?pose.ease*180:0)+offset,560,-1);
    return give?760+pose.ease*100:800;
  };
  W.actor=actor;
})();
