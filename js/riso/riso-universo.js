// gramática de lugares: una semilla conserva el mundo; el tiempo y el sonido lo habitan.
(() => {
  const R=window.RISO;if(!R)return;
  const hash=s=>{let h=2166136261;for(const c of String(s))h=Math.imul(h^c.charCodeAt(0),16777619);return h>>>0;};
  const clamp=(v,a=0,b=1)=>Math.max(a,Math.min(b,v));
  const rng=seed=>{let a=hash(seed);return()=>{a+=0x6d2b79f5;let t=Math.imul(a^a>>>15,a|1);t^=t+Math.imul(t^t>>>7,t|61);return((t^t>>>14)>>>0)/4294967296;};};
  let saved={};try{saved=JSON.parse(localStorage.getItem('lumora_universos')||'{}');}catch(e){}
  const U=R.world={enabled:true,biomes:{auto:'según la historia',ciudad:'ciudad',bosque:'bosque',costa:'costa',desierto:'desierto',espacio:'órbita',cuarto:'interior'},cache:new Map(),hash,rng,
    key(){return typeof ext!=='undefined'?(ext.st.name||'lumora')+'|'+(ext.st.artist||''): 'lumora';},
    settings(){const v=saved[this.key()]||{};return {seed:typeof v.seed==='string'?v.seed:'original',biome:this.biomes[v.biome]?v.biome:'auto',density:clamp(Number(v.density)||1,.4,1.5)};},
    set(values){const old=this.settings(),v={...old,...values};v.seed=String(v.seed||'original').slice(0,64);if(!Object.hasOwn(this.biomes,v.biome))v.biome='auto';v.density=clamp(Number(v.density)||1,.4,1.5);delete saved[this.key()];saved[this.key()]=v;const keys=Object.keys(saved);while(keys.length>100)delete saved[keys.shift()];try{localStorage.setItem('lumora_universos',JSON.stringify(saved));}catch(e){}this.cache.clear();if(window.RISOCLIP){RISOCLIP.shot=null;RISOCLIP.sceneState={};}dispatchEvent(new CustomEvent('lumora:universo',{detail:v}));return v;},
    next(){const words=new Uint32Array(4);crypto.getRandomValues(words);return this.set({seed:Array.from(words,n=>n.toString(16).padStart(8,'0')).join('')});},
    profile(place='ciudad',key=this.key(),settings=this.settings()){
      const biome=settings.biome==='auto'?Object.hasOwn(this.biomes,place)&&place!=='auto'?place:'ciudad':settings.biome;
      const signature=key+'|'+settings.seed+'|'+biome+'|'+settings.density;if(this.cache.has(signature))return this.cache.get(signature);
      const r=rng(signature),p={signature,biome,seed:hash(signature),density:settings.density,horizon:570+r()*100,moon:30+r()*38,phase:r()*6.28,roof:r(),width:45+r()*65,wind:(r()-.5)*2,flora:[],buildings:[],stars:[],ridges:[]};
      for(let i=0;i<18;i++)p.buildings.push({x:-570+i*66+r()*22,h:75+r()*270,w:38+r()*34,roof:r(),windows:2+Math.floor(r()*4)});
      for(let i=0;i<18;i++)p.flora.push({x:-590+i*68+r()*34,h:90+r()*200,spread:22+r()*55,branches:3+Math.floor(r()*5),lean:(r()-.5)*.35});
      for(let i=0;i<64;i++)p.stars.push({x:r()*1300-650,y:110+r()*370,r:1+r()*3,phase:r()*6.28});
      for(let j=0;j<3;j++)p.ridges.push(Array.from({length:25},(_,i)=>[-650+i*55,p.horizon-50-j*42-r()*100]));
      if(this.cache.size>=64)this.cache.delete(this.cache.keys().next().value);this.cache.set(signature,p);return p;
    },
    draw(K,p,time=0,{cx=1130,ground=710,audio=R.A,detail=K.d||2}={}){
      const c=K.c,reduced=window.CFG?.reduceMotion||matchMedia('(prefers-reduced-motion: reduce)').matches,t=reduced?0:time;
      const energy=clamp(audio?.e||0),low=clamp(window.LMAUDIO?.features?.low??audio?.low??0),high=clamp(window.LMAUDIO?.features?.high||0),h=p.horizon,amount=Math.max(6,Math.round((detail<2?9:18)*p.density));
      c.save();c.translate(cx,0);
      if(p.biome==='cuarto'){
        K.rect(-305,165,610,ground-165,{f:3,ft:.05,s:3,lw:4});
        const wx=-260+(p.roof*45),wy=220;K.rect(wx,wy,145,190,{f:3,ft:.12,s:1,lw:4});K.line(wx+72,wy,wx+72,wy+190,1,3);K.line(wx,wy+90,wx+145,wy+90,1,3);
        for(let i=0;i<6;i++)K.line(-305+i*104,ground,-170+i*60,ground-100,3,1,.25);
        K.line(40,240,160,240,1,5);for(let i=0;i<5;i++)K.rect(50+i*20,190+(i%2)*8,13,50-(i%2)*8,{f:i%3+1,ft:.3,s:1,lw:2});
        K.poly([[wx,ground-120],[wx+145,ground-120],[wx+250,ground],[wx-30,ground]],{f:2,ft:.06+energy*.04});
      }else{
        if(p.biome!=='bosque'){K.circ(210+Math.sin(p.phase)*70,210,p.moon,{f:2,ft:.55+energy*.15,s:1,lw:3});if(p.roof>.5)K.circ(225+Math.sin(p.phase)*70,200,p.moon*.85,{f:-1});}
        if(p.biome==='ciudad'){
          for(const [i,b]of p.buildings.slice(0,amount).entries()){
            const by=ground-55,bx=b.x,bh=b.h;K.rect(bx,by-bh,b.w,bh,{f:3,ft:.12+(i%3)*.05,s:1,lw:2});
            if(b.roof>.65)K.poly([[bx-4,by-bh],[bx+b.w/2,by-bh-22],[bx+b.w+4,by-bh]],{f:1,ft:.3,s:1,lw:2});
            if(detail>=2)for(let row=0;row<Math.min(9,Math.floor(bh/25));row++)for(let col=0;col<b.windows;col++)if(((i*13+row*7+col*17+p.seed)%5)>1)K.rect(bx+6+col*(b.w-10)/b.windows,by-bh+12+row*25,5,9,{f:2,ft:.2+low*.22});
          }
          K.line(-650,ground-55,650,ground-55,1,4);for(let i=0;i<9;i++)K.line(-600+i*150,ground+24,-550+i*150,ground+24,2,4,.35);
        }else if(p.biome==='bosque'){
          p.ridges.slice(0,2).forEach((ridge,j)=>K.poly([...ridge,[650,ground],[-650,ground]],{f:3,ft:.08+j*.04}));
          for(const [i,b]of p.flora.slice(0,amount).entries()){
            const sway=Math.sin(t*.45+i+p.phase)*p.wind*5;K.line(b.x,ground,b.x+b.lean*b.h+sway,ground-b.h,1,3);
            for(let j=0;j<b.branches;j++){const y=ground-b.h+j*b.h/b.branches*.8,w=b.spread*(.4+j/b.branches),dx=b.lean*(ground-y)+sway;K.poly([[b.x+dx,y-25],[b.x+dx-w,y+40],[b.x+dx+w,y+40]],{f:3,ft:.2+(i%3)*.14,s:1,lw:2});}
          }
        }else if(p.biome==='costa'){
          K.poly([[-650,h],[-360,h-90],[-250,h],[-20,h-35],[160,h],[650,h],[650,ground],[-650,ground]],{f:3,ft:.18,s:1,lw:2});
          for(let j=0;j<8;j++){const y=h+j*22;c.beginPath();for(let i=0;i<=32;i++){const px=-650+i*42,py=y+Math.sin(i*.48+t*.65+j+p.phase)*(3+low*6);i?c.lineTo(px,py):c.moveTo(px,py);}K.paint({s:j%3+1,st:.2,lw:2});}
        }else if(p.biome==='desierto'){
          p.ridges.forEach((ridge,j)=>{c.beginPath();c.moveTo(-650,ground);c.lineTo(ridge[0][0],ridge[0][1]);for(let i=1;i<ridge.length;i++)c.quadraticCurveTo(ridge[i-1][0],ridge[i-1][1],(ridge[i-1][0]+ridge[i][0])/2,(ridge[i-1][1]+ridge[i][1])/2);c.lineTo(650,ground);c.closePath();K.paint({f:j%2+2,ft:.12+j*.08,s:1,st:.3,lw:2});});
          for(let i=0;i<amount;i++){const f=p.flora[i];K.line(f.x,ground-4,f.x+7,ground-f.h*.18,3,3);K.line(f.x+3,ground-20,f.x-10,ground-30,3,2);}
        }else if(p.biome==='espacio'){
          K.ell(30,460,270,72,-.22,{s:3,st:.3,lw:3});K.ell(30,460,340,106,.22,{s:1,st:.15,lw:2});K.circ(30,460,92,{f:3,ft:.2,s:1,lw:4});
          K.ell(30,460,170,30,-.3,{s:2,st:.8,lw:5});
        }
        for(const [i,s]of p.stars.slice(0,detail<2?20:48).entries())if(p.biome==='espacio'||i%4===0){K.circ(s.x,s.y,s.r*(1+high*.4),{f:i%3+1,ft:.18+(reduced?.15:(Math.sin(t*.5+s.phase)+1)*.12)});if(p.biome==='espacio'&&i%7===0){const n=p.stars[(i+1)%p.stars.length];K.line(s.x,s.y,n.x,n.y,3,1,.16);}}
      }
      c.restore();
    },
    decode(c){const im=c.getImageData(0,0,c.canvas.width,c.canvas.height),d=im.data,paper=[246,238,226],inks=[[33,43,128],[246,111,36],[96,161,192]];for(let i=0;i<d.length;i+=4){const coverage=[d[i]/255,d[i+1]/255,d[i+2]/255];for(let j=0;j<3;j++)d[i+j]=paper[j]*coverage.reduce((v,t,k)=>v*(1-t*(1-inks[k][j]/255)),1);d[i+3]=255;}c.putImageData(im,0,0);}
  };
  R.register({id:'universo',name:'universo procedural',inks:0,make:()=>({}),cam(cam,t){cam.x=Math.sin(t*.06)*18;cam.y=0;cam.z=1;cam.r=0;},draw(K,s,t){const p=U.profile(U.settings().biome==='auto'?'costa':U.settings().biome);U.draw(K,p,t,{cx:800,ground:760});K.code('universo · '+U.settings().seed.slice(0,16),80,825,{size:16});}});
})();
