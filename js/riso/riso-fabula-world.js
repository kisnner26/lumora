// geometría propia de fábula: escenarios en capas y personajes articulados.
(() => {
  const R=window.RISO;if(!R)return;
  const tau=Math.PI*2;
  const ellipse=(c,x,y,rx,ry,color,a=0)=>{c.beginPath();c.ellipse(x,y,rx,ry,a,0,tau);c.fillStyle=color;c.fill();};
  const path=(c,d,f,s,w=2)=>{const q=new Path2D(d);if(f){c.fillStyle=f;c.fill(q);}if(s){c.strokeStyle=s;c.lineWidth=w;c.stroke(q);}};
  const line=(c,x,y,xx,yy,color,w=2)=>{c.beginPath();c.moveTo(x,y);c.lineTo(xx,yy);c.strokeStyle=color;c.lineWidth=w;c.lineCap='round';c.stroke();};
  const wash=(c,x,y,xx,yy,...colors)=>{const g=c.createLinearGradient(x,y,xx,yy);colors.forEach((v,i)=>g.addColorStop(i/(colors.length-1),v));return g;};
  const names={taller:'el taller de los recuerdos',jardin:'el jardín que escucha',mar:'la orilla de lo que vuelve',torre:'la casa de las historias',bosque:'el bosque de las promesas',ciudad:'la ciudad despierta',teatro:'el teatro de los deseos',puente:'el puente entre nosotros',estacion:'el último tren',desierto:'el desierto de los nombres',cielo:'el atlas de las estrellas',cuarto:'la habitación de las cartas'};
  Object.assign(names,{montana:'la montaña del regreso',cafe:'el café de las despedidas',carretera:'la carretera sin fin',vuelo:'el vuelo de los sueños',iglesia:'la catedral del silencio',cementerio:'el jardín de los ausentes',feria:'la feria de las pequeñas maravillas',laboratorio:'el gabinete de lo imposible',museo:'el museo de lo que fuimos',oficina:'el archivo de los días',escuela:'la escuela de las preguntas',campamento:'la noche junto al fuego',boda:'la promesa entre las flores',ring:'el círculo del valor',estadio2:'el estadio de las voces',azotea2:'la azotea sobre el mundo',playa:'la playa de las cartas',oceano:'el océano profundo',tormenta:'el mar en tormenta',club:'el salón de medianoche',concierto:'la canción sobre el escenario',hogar:'la casa que nos espera',calle2:'la calle de los encuentros',espacio:'el mapa de otros mundos',retrato:'el espejo de los nombres'});
  const families={playa:'mar',oceano:'mar',tormenta:'mar',club:'teatro',concierto:'teatro',hogar:'cuarto',calle2:'ciudad',espacio:'cielo',retrato:'cuarto',museo:'torre',oficina:'torre',escuela:'torre',laboratorio:'torre',boda:'jardin',campamento:'bosque',cementerio:'bosque',azotea2:'ciudad',estadio2:'teatro',ring:'teatro'};
  function tree(c,x,y,s,p,seed){const r=R.rng(seed);c.save();c.translate(x,y);c.scale(s,s);
    path(c,'M-16 0 Q3 -190 -22 -370 L9 -370 Q34 -150 20 0Z',p.ink);
    for(let i=0;i<15;i++){const xx=(r()-.5)*260,yy=-220-r()*230;line(c,0,-120,xx,yy,p.ink,5);ellipse(c,xx,yy,45+r()*45,25+r()*35,i%3?p.green:p.mist,-.5+r());}
    c.restore();}
  function building(c,x,y,w,h,p,seed){const r=R.rng(seed);c.fillStyle=wash(c,x,y,x+w,y,p.green,p.ink);c.fillRect(x,y,w,h);
    path(c,`M${x-12} ${y} L${x+w*.5} ${y-65} L${x+w+12} ${y}Z`,p.rust,p.gold);
    for(let a=24;a<w-12;a+=40)for(let b=35;b<h-20;b+=65){c.globalAlpha=.3+r()*.65;path(c,`M${x+a} ${y+b+26} v-22 q10 -24 20 0 v22Z`,p.light,p.gold,1);}c.globalAlpha=1;}
  function background(c,b,shot){const p=b.palette,r=R.rng(shot.seed),place=families[shot.place]||shot.place;
    c.fillStyle=wash(c,0,0,0,900,p.ink,p.mist,p.paper);c.fillRect(0,0,1600,900);
    ellipse(c,1170,shot.daytime==='atardecer'?390:170,65,65,p.light);if(shot.daytime==='noche')ellipse(c,1190,150,60,60,p.ink);
    // distant hills, then terrain: every environment has a different silhouette.
    for(let k=0;k<3;k++){c.globalAlpha=.2+k*.17;let d='M0 900 L0 '+(470+k*65);for(let x=0;x<=1700;x+=160)d+=` Q${x+80} ${320+k*85+r()*130} ${x+160} ${470+k*65+r()*45}`;path(c,d+' L1600 900Z',p.green);}c.globalAlpha=1;
    if(place==='montana'){
      for(let k=0;k<6;k++){const x=k*310-150,h=240+r()*250;path(c,`M${x-260} 780 L${x+160} ${h} L${x+530} 780Z`,k%2?p.green:p.mist,p.gold,1);path(c,`M${x+160} ${h} l-82 110 82 -30 72 20Z`,p.light);}
      path(c,'M0 900 Q650 670 1600 850 L1600 900Z',p.ink);
    }else if(place==='carretera'){
      path(c,'M590 900 L760 420 L840 420 L1190 900Z',p.ink,p.gold,3);for(let k=0;k<8;k++){const y=440+k*k*7;line(c,800+(y-440)*.15,y,800+(y-440)*.15,y+10+k*3,p.paper,2+k);}
      for(let k=0;k<8;k++)tree(c,k%2?1400-k*25:100+k*30,750-k*30,.6,p,shot.seed+k);
    }else if(place==='vuelo'){
      for(let k=0;k<12;k++){const x=r()*1600,y=200+r()*550;ellipse(c,x,y,130,40,p.paper+'99');ellipse(c,x-25,y-30,70,55,p.paper+'99');}
      path(c,'M800 160 L980 490 L1310 540 L980 570 L930 680 L820 560 L550 530 L760 490Z',wash(c,600,200,1100,650,p.light,p.mist,p.green),p.gold,3);
    }else if(place==='iglesia'){
      c.fillStyle=p.ink;c.fillRect(0,0,1600,900);for(let k=0;k<5;k++){const x=80+k*340;path(c,`M${x} 860 V260 Q${x+150} -120 ${x+300} 260 V860 L${x+255} 860 V280 Q${x+150} 10 ${x+45} 280 V860Z`,p.mist,p.gold,3);}
      for(let k=0;k<3;k++){const x=300+k*490;path(c,`M${x} 600 V230 Q${x+50} 100 ${x+100} 230 V600Z`,wash(c,x,100,x+100,600,p.rust,p.gold,p.light));}
    }else if(place==='cafe'){
      c.fillStyle=p.green;c.fillRect(0,0,1600,900);for(let k=0;k<3;k++){const x=80+k*500;path(c,`M${x} 550 V130 Q${x+210} 0 ${x+420} 130 V550Z`,wash(c,0,0,0,600,p.mist,p.light),p.gold,12);}
      for(let k=0;k<4;k++){const x=170+k*420;ellipse(c,x,665,140,35,p.paper);line(c,x,665,x,850,p.gold,12);}
    }else if(place==='feria'){
      for(let k=0;k<5;k++){const x=k*370-70;path(c,`M${x} 720 V380 L${x+150} 210 L${x+300} 380 V720Z`,k%2?p.paper:p.mist,p.gold,3);path(c,`M${x-25} 390 L${x+150} 210 L${x+325} 390Z`,p.rust,p.gold,2);}
      c.strokeStyle=p.gold;c.lineWidth=7;c.beginPath();c.arc(1150,270,180,0,tau);c.stroke();for(let k=0;k<10;k++){const a=k*tau/10;line(c,1150,270,1150+Math.cos(a)*180,270+Math.sin(a)*180,p.gold,2);ellipse(c,1150+Math.cos(a)*180,290+Math.sin(a)*180,20,25,p.rust);}
    }else if(['ciudad','estacion','puente'].includes(place)){
      for(let k=0;k<9;k++){const h=170+r()*300;building(c,k*210-90,620-h,150+r()*80,h,p,shot.seed+k);}
      c.fillStyle=p.ink;c.fillRect(0,650,1600,250);
      if(place==='puente'){path(c,'M-50 720 Q800 330 1650 720 L1650 790 Q800 470 -50 790Z',p.paper,p.gold,4);for(let x=0;x<1600;x+=80)line(c,x,690-Math.sin(x/1600*Math.PI)*200,x,760-Math.sin(x/1600*Math.PI)*160,p.gold,3);}
      else if(place==='estacion'){for(let x=0;x<1600;x+=240){line(c,x,120,x,665,p.gold,9);path(c,`M${x} 160 Q${x+120} -30 ${x+240} 160`,null,p.gold,7);}line(c,0,790,1600,790,p.paper,5);line(c,0,830,1600,830,p.gold,4);}
      else{for(let x=60;x<1600;x+=320){line(c,x,330,x,680,p.gold,5);ellipse(c,x,325,17,25,p.light);}path(c,'M0 900 L630 650 L980 650 L1600 900Z',p.mist);}
    }else if(['bosque','jardin'].includes(place)){
      for(let k=0;k<14;k++)tree(c,k*130-40,650+(k%3)*60,.65+r()*.55,p,shot.seed+k);
      path(c,'M600 900 Q700 660 1000 540 Q860 740 1100 900Z',wash(c,800,600,800,900,p.paper,p.gold));
      if(place==='jardin'){path(c,'M520 660 L520 310 Q800 -50 1080 310 L1080 660 L1030 660 L1030 330 Q800 20 570 330 L570 660Z',p.paper,p.gold,3);for(let i=0;i<20;i++){const x=r()*1600,y=690+r()*190;line(c,x,y,x,y-35,p.green,3);ellipse(c,x,y-40,10,16,p.rust);}}
    }else if(place==='mar'){
      c.fillStyle=wash(c,0,430,0,900,p.mist,p.green,p.ink);c.fillRect(0,430,1600,470);
      for(let k=0;k<55;k++){const y=450+k*8,x=r()*1500;line(c,x,y,x+50+r()*180,y,p.paper,.6+k*.035);}
      path(c,'M0 800 Q470 590 950 900 L0 900Z',p.paper);path(c,'M1210 500 L1210 190 L1060 490Z',p.light,p.gold,3);path(c,'M1040 520 Q1190 590 1360 520 L1310 580 L1090 580Z',p.ink,p.gold,3);
    }else if(place==='desierto'){
      for(let k=0;k<4;k++)path(c,`M0 ${550+k*90} Q${420+k*150} ${290+k*90} 1600 ${540+k*100} L1600 900 L0 900Z`,k%2?p.gold:p.paper,p.rust,1);
      for(let k=0;k<5;k++){const x=100+k*340;path(c,`M${x} 680 L${x+30} 300 L${x+55} 680Z`,p.green);}
    }else if(place==='cielo'){
      c.fillStyle=wash(c,0,0,1600,900,p.ink,p.green);c.fillRect(0,0,1600,900);
      for(let k=0;k<180;k++)ellipse(c,r()*1600,r()*900,1+r()*2,1+r()*2,p.light);
      for(let k=0;k<4;k++){const x=200+k*390,y=200+r()*330;ellipse(c,x,y,55+k*15,55+k*15,k%2?p.rust:p.mist);c.save();c.translate(x,y);c.scale(1,.3);c.strokeStyle=p.gold;c.lineWidth=3;c.beginPath();c.ellipse(0,0,100+k*20,100+k*20,.4,0,tau);c.stroke();c.restore();}
      path(c,'M0 900 Q800 650 1600 900Z',p.paper);
    }else if(place==='teatro'){
      c.fillStyle=p.ink;c.fillRect(0,0,1600,900);
      for(let k=0;k<4;k++)path(c,`M${80+k*400} 50 L${-180+k*400} 780 L${650+k*260} 780Z`,wash(c,800,0,800,850,p.gold+'08',p.paper+'55'));
      for(const side of [0,1])for(let k=0;k<7;k++){const x=side?1600-k*35:k*35;path(c,`M${x} 0 Q${x+(side?-130:130)} 430 ${x+(side?-20:20)} 800 L${side?1600:0} 900 L${side?1600:0} 0Z`,wash(c,x,0,x+(side?-80:80),0,p.rust,p.ink),p.gold,1);}
      for(let k=0;k<12;k++)line(c,800,690,k*150,900,p.gold,1);
    }else if(place==='cuarto'||place==='torre'){
      c.fillStyle=wash(c,0,0,1600,900,p.green,p.ink);c.fillRect(0,0,1600,900);
      for(let k=0;k<8;k++)line(c,k*220,0,k*220,900,p.gold,1);
      path(c,'M930 610 L930 160 Q1150 -80 1370 160 L1370 610Z',wash(c,1000,0,1200,600,p.light,p.mist),p.gold,12);line(c,1150,65,1150,610,p.gold,7);line(c,930,350,1370,350,p.gold,6);
      if(place==='torre')for(let k=0;k<5;k++){c.fillStyle=p.gold;c.fillRect(80,170+k*110,450,9);for(let j=0;j<18;j++){c.fillStyle=[p.rust,p.paper,p.mist][j%3];c.fillRect(90+j*24,90+k*110+r()*15,17,75);}}
      else{path(c,'M50 630 Q300 570 610 630 L610 800 L50 800Z',p.paper,p.gold,3);path(c,'M70 620 L560 620 L560 730 L70 730Z',p.rust);}
      path(c,'M0 900 L550 650 L1600 650 L1600 900Z',p.green,p.gold);for(let k=0;k<12;k++)line(c,800,650,k*160,900,p.gold,.7);
    }
  }
  function setPieces(c,b,shot,t){const p=b.palette;
    const groups={cafe:['cup','coffee','flowers'],museo:['retrato','statue','flowers'],oficina:['typewriter','clock','book'],escuela:['book','pencil','globe'],laboratorio:['microscope','atom','rocket'],campamento:['fire','guitar','moon'],boda:['flowers','love','ring'],cementerio:['tombstone','flowers','cross'],club:['disco_ball','bottle','music'],concierto:['guitar','drums','microphone'],playa:['palm','shell','sun'],oceano:['fish','whale','coral'],feria:['balloon','carousel','stars']};
    const ids=(groups[shot.place]||[]).filter(id=>R.props?.DEFS[id]);
    ids.forEach((id,i)=>prop(c,id,280+i*520,620,.5,p,t,0));
    if(['museo','retrato'].includes(shot.place)){
      for(let i=0;i<(shot.place==='retrato'?1:3);i++){const x=180+i*470;c.fillStyle=p.gold;c.fillRect(x,250,210,280);c.fillStyle=p.ink;c.fillRect(x+12,262,186,256);ellipse(c,x+105,350,35,48,p.mist);path(c,`M${x+40} 500 Q${x+105} 370 ${x+170} 500Z`,p.rust);}
    }
    if(['oficina','escuela','laboratorio'].includes(shot.place)){
      c.fillStyle=p.paper;c.fillRect(120,600,420,24);line(c,155,620,155,810,p.gold,12);line(c,510,620,510,810,p.gold,12);
      if(shot.place==='escuela'){c.fillStyle=p.ink;c.fillRect(90,180,420,240);line(c,140,250,460,250,p.paper,2);line(c,140,290,410,290,p.paper,2);path(c,'M160 380 L230 320 L300 380Z',null,p.paper,2);}
      if(shot.place==='laboratorio')for(let k=0;k<5;k++){const x=180+k*65;path(c,`M${x} 590 v-40 l18 -65 v-35 h18 v35 l18 65 v40Z`,p.mist,p.gold,2);ellipse(c,x+28,570,21,12,p.rust);}
      if(shot.place==='oficina')for(let k=0;k<8;k++){c.fillStyle=k%2?p.paper:p.gold;c.fillRect(150+k*30,520-k%3*10,110,8);}
    }
    if(shot.place==='hogar'){path(c,'M120 810 V460 H490 V810 H420 V570 Q300 490 200 570 V810Z',p.paper,p.gold,3);path(c,'M230 790 Q200 720 270 650 Q270 740 330 690 Q420 790 230 790Z',p.rust);}
    if(shot.place==='cementerio')for(let k=0;k<8;k++){const x=80+k*205,y=700+(k%2)*60;path(c,`M${x} ${y} v-120 q35 -80 70 0 v120Z`,p.mist,p.gold,2);line(c,x+35,y-120,x+35,y-40,p.ink,3);line(c,x+15,y-92,x+55,y-92,p.ink,3);}
    if(shot.place==='boda'){path(c,'M590 690 V250 Q800 20 1010 250 V690',null,p.light,14);for(let k=0;k<15;k++){const a=k*Math.PI/14;ellipse(c,800+Math.cos(a)*210,250-Math.sin(a)*180,16,25,k%2?p.rust:p.paper,a);}}
    if(shot.place==='campamento')path(c,'M150 800 L360 420 L590 800Z',p.paper,p.gold,4);
    if(shot.place==='club'){ellipse(c,800,200,85,85,p.mist);for(let k=-3;k<=3;k++){line(c,730,200+k*19,870,200+k*19,p.gold,2);line(c,800+k*19,130,800+k*19,270,p.gold,2);}}
    if(shot.place==='concierto'){line(c,1120,450,1120,810,p.gold,6);ellipse(c,1120,440,15,25,p.ink);path(c,'M100 840 L200 720 L350 720 L460 840Z',p.ink,p.gold,3);}
    if(shot.place==='playa'){for(const x of [140,1410]){path(c,`M${x} 800 Q${x+90} 580 ${x+35} 280`,null,p.rust,18);for(let k=0;k<7;k++)path(c,`M${x+35} 280 Q${x-150+k*45} ${150+k%2*170} ${x-220+k*75} ${300+k%2*50}`,null,p.green,18);}}
    if(shot.place==='oceano'){c.fillStyle=p.green+'88';c.fillRect(0,0,1600,900);for(let k=0;k<10;k++){const x=120+k*140,y=180+(k%4)*140;ellipse(c,x,y,35,14,p.gold);path(c,`M${x+25} ${y} l35 -22 v44Z`,p.rust);}}
    if(shot.place==='tormenta'){path(c,'M1080 0 L940 280 L1050 250 L880 480 L970 240 L870 270Z',p.light);}
    if(shot.place==='calle2'){for(let k=0;k<3;k++){c.fillStyle=p.rust;c.fillRect(80+k*520,540,170,100);path(c,`M${65+k*520} 540 l30 -50 h140 l30 50Z`,p.paper,p.gold,2);}}
    if(shot.place==='espacio'){c.strokeStyle=p.gold;c.lineWidth=2;c.beginPath();c.ellipse(800,400,600,260,-.25,0,tau);c.stroke();}
    if(shot.place==='estadio2')for(let k=0;k<120;k++){ellipse(c,60+(k%40)*38,400+Math.floor(k/40)*45,10,13,k%3?p.mist:p.gold);}
    if(['ring','estadio2'].includes(shot.place))for(let k=0;k<3;k++)line(c,180,590+k*65,1420,590+k*65,p.paper,5);
    if(shot.place==='azotea2'){c.fillStyle=p.ink;c.fillRect(0,700,1600,200);line(c,0,700,1600,700,p.gold,8);}
    if(shot.place==='campamento'){path(c,'M1060 800 Q970 740 1090 610 Q1080 710 1140 680 Q1240 810 1060 800Z',p.gold);path(c,'M1100 790 Q1050 745 1120 690 Q1090 740 1160 770Z',p.rust);}
  }
  function prop(c,id,x,y,s,p,t=0,energy=0){const def=R.props?.DEFS[id];if(!def)return false;
    const colors=[p.paper,p.ink,p.rust,p.gold,p.green,p.mist,p.light];
    const color=i=>i<0?p.light:colors[i%colors.length];
    const poly=pts=>{c.beginPath();pts.forEach((v,i)=>i?c.lineTo(v[0],v[1]):c.moveTo(v[0],v[1]));};
    const d={s(pts,o={}){poly(pts);c.strokeStyle=color(o.i??1);c.lineWidth=Math.min(5,o.lw||3);c.lineCap='round';c.lineJoin='round';c.stroke();},f(pts,i=2,tone=1){poly(pts);c.save();c.globalAlpha=Math.max(.15,Math.min(1,tone));c.fillStyle=color(i);c.fill();c.restore();},dot(x,y,r,i=1){ellipse(c,x,y,r,r,color(i));}};
    c.save();c.translate(x,y);c.scale(s,s);try{def.draw(d,{p:1,t,beat:energy,n:def.n});}finally{c.restore();}return true;
  }
  function object(c,b,shot,x,y,s,t,energy,reduced){
    const n=shot.narrative,state=n&&R.film.stateAt(n,Math.max(0,t-shot.t),reduced);
    const torn=shot.action==='tear'?state?.photo||0:0;
    if(torn>0){
      for(const side of [-1,1]){c.save();c.translate(x+side*torn*38,y+Math.abs(side)*torn*12);c.rotate(side*torn*.16);c.beginPath();c.rect(side<0?-350:0,-350,350,700);c.clip();prop(c,shot.motif,0,0,s,b.palette,t,energy);c.restore();}
    }else{c.save();c.translate(x,y);if(shot.action==='wilt')c.rotate((state?.flower||0)*.6);prop(c,shot.motif,0,0,s,b.palette,t,energy);c.restore();}
  }
  function actor(c,b,shot,x,y,s,t,energy,partner=false){const p=b.palette,profile=b.cast[partner?1:0]||{},act=shot.action;
    const gait=['walk','run','leave','return','board'].includes(act)?Math.sin(t*(act==='run'?7:3))* .38:act==='dance'?Math.sin(t*3)*.28:0;
    const lean=act==='cry'?-.16:act==='dance'?Math.sin(t*2)*.09:0;
    c.save();c.translate(x,y-(act==='dance'?Math.abs(Math.sin(t*3))*(6+energy*18):0));c.scale(s*(partner?-1:1)*(profile.build||1),s);c.rotate(act==='sleep'?-Math.PI/2:lean);
    ellipse(c,0,0,70,10,p.ink+'66');
    const limb=(xx,yy,len,a,color,w)=>{line(c,xx,yy,xx+Math.sin(a)*len,yy+Math.cos(a)*len,color,w);};
    limb(-19,-128,120,gait,p.ink,23);limb(19,-128,120,-gait,p.ink,23);
    path(c,'M-46 -270 Q-75 -205 -48 -112 Q0 -90 53 -112 L42 -255Z',wash(c,-60,-270,70,-110,partner?p.rust:p.mist,p.green,p.ink),p.gold,1.5);
    if(profile.outfit==='dress')path(c,'M-42 -225 L-85 -55 Q0 -25 85 -55 L42 -225Z',wash(c,-70,-220,70,-40,p.rust,p.ink),p.gold,2);
    if(profile.tie)path(c,'M-5 -270 L8 -270 L18 -183 L0 -170 L-13 -184Z',p.rust,p.gold,1);
    for(let k=0;k<7;k++)path(c,`M${-35+k*12} -240 Q${-50+k*16} -160 ${-42+k*14} -115`,null,p.gold,.7);
    const progress=Math.max(0,Math.min(1,(t-shot.t)/3));
    const reach=['give','open','reach'].includes(act)?-.15-progress*.95:act==='sing'?-2:act==='dance'?-2.3+Math.sin(t*3)*.3:act==='cry'?-2.7:.25+gait;
    limb(-40,-242,92,-gait-.15,p.green,26);limb(40,-242,90,reach,p.mist,25);
    const hx=40+Math.sin(reach)*90,hy=-242+Math.cos(reach)*90;ellipse(c,hx,hy,11,15,p.skin,.2);
    c.save();c.translate(0,-300);c.scale(profile.face?.width||1,profile.face?.height||1);c.rotate(act==='remember'?-.15:Math.sin(t*.7)*.02);
    ellipse(c,0,-10,39,52,wash(c,-45,-70,35,35,profile.skin>.35?p.ink:p.rust,p.skin,profile.skin>.35?p.rust:p.light));
    const hair=profile.hair|| (b.hair?'long':'waves'),long=['long','waves','bob','dreads','beehive'].includes(hair);
    path(c,`M-38 8 Q-63 -78 0 -76 Q59 -71 39 -13 Q20 -24 10 -52 Q-10 -30 -28 -22 L-32 ${long?70:12} L-47 ${long?68:5}Z`,wash(c,-45,-80,45,40,p.ink,profile.hairInk>=2?p.gold:p.rust,p.ink),p.ink,2);
    for(let k=0;k<9;k++)path(c,`M${-35+k*8} -61 Q${-50+k*9} -30 ${-40+k*9} ${long?38:-17}`,null,p.gold,.6);
    path(c,'M8 -15 Q20 -23 29 -16 M13 -10 L25 -10 M31 -12 L36 4 L28 8 M14 22 Q23 27 31 21',null,p.ink,1.6);
    if(hair==='afro'||hair==='curls')for(let k=0;k<15;k++){const a=k*Math.PI/14;ellipse(c,Math.cos(a)*40,-25-Math.sin(a)*50,15,17,p.ink);}
    if(hair==='bun'||hair==='beehive')ellipse(c,-10,-80,25,hair==='beehive'?40:25,p.ink);
    if(hair==='bald'||hair==='buzz'){ellipse(c,0,-35,35,28,p.skin);}
    if(profile.hat)path(c,'M-65 -52 L-39 -60 L-30 -100 L27 -100 L38 -60 L64 -52Z',p.ink,p.gold,2);
    if(profile.earrings)ellipse(c,-28,12,5,8,p.gold);
    if(profile.glasses){c.strokeStyle=p.ink;c.lineWidth=2;c.strokeRect(5,-23,28,20);}
    if(profile.beard)path(c,'M-13 15 Q15 40 34 10 Q27 48 0 40Z',p.ink);
    c.restore();
    if(act==='sing'){line(c,hx,hy,hx,hy-28,p.ink,5);ellipse(c,hx,hy-34,8,12,p.gold);}
    else if(window.CFG?.instruments!==false&&profile.instrument&&['sing','dance'].includes(act))prop(c,profile.instrument,hx-40,hy+30,.35,p,t,energy);
    else if(shot.motif&&['give','remember','reach','wilt','grow'].includes(act)&&shot.camera!=='detail')prop(c,shot.motif,hx,hy,.16,p,t,energy);
    c.restore();
  }
  function motion(c,b,shot,t,energy){const p=b.palette,r=R.rng(shot.seed+91);
    if(shot.place==='mar')for(let i=0;i<16;i++){const y=490+i*18;path(c,`M0 ${y} Q400 ${y+Math.sin(t*.7+i)*12} 800 ${y} T1600 ${y}`,null,p.paper+'55',1);}
    if(shot.place==='estacion'){const x=((t*45)%2400)-600;c.fillStyle=p.green;c.fillRect(x,440,620,195);for(let i=0;i<7;i++){c.fillStyle=p.light;c.fillRect(x+25+i*83,475,60,70);}for(let i=0;i<4;i++)ellipse(c,x+90+i*150,640,23,23,p.ink);}
    const rain=['lluvia','tormenta','nieve'].includes(shot.weather);
    for(let i=0;i<(rain?100:24);i++){const x=(r()*1700+t*(rain?22:5))%1700-50,y=(r()*950+t*(rain?150:12))%950-25;c.globalAlpha=.15+r()*.35;if(rain&&shot.weather!=='nieve')line(c,x,y,x-5,y+24,p.paper,1);else ellipse(c,x,y,2+energy*2,2+energy*2,p.light);}
    c.globalAlpha=1;
  }
  R.fabulaWorld={names,background,setPieces,actor,prop,object,motion};
})();
