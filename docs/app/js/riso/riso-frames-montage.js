// montaje de vídeo externo: tomas y transiciones calculadas desde el reloj musical.
// sin acumulación de frames: pausa, búsqueda y grabación reconstruyen el mismo plano.
(() => {
  'use strict';
  const clamp=(v,a=0,b=1)=>Math.max(a,Math.min(b,v));
  const ease=t=>1-Math.pow(1-clamp(t),3);
  const looks=['cinema','triptych','diagonal','mirror','filmstrip','tunnel','split','orbit'];
  const transitions=['whip','shutter','iris','slide','prism'];
  const outgoing=document.createElement('canvas'),incoming=document.createElement('canvas');
  const a=outgoing.getContext('2d'),b=incoming.getContext('2d');
  const chroma=document.createElement('canvas'),rgb=chroma.getContext('2d');
  let cachedGrid=null,cachedDuration=0,cachedTempo=0,cachedPhase=0,cachedPlan=null;
  function plan(grid,duration=80,tempo=100,phase=0){
    if(cachedPlan&&grid===cachedGrid&&duration===cachedDuration&&tempo===cachedTempo&&phase===cachedPhase)return cachedPlan;
    const bpm=clamp(+grid?.bpm||+tempo||100,40,240),period=60/bpm,origin=+grid?.phase||phase||0;
    const beats=grid?.beats?.length?grid.beats:Array.from({length:Math.ceil(duration/period)},(_,i)=>origin+i*period);
    const shots=[];
    for(let i=0;i<beats.length&&beats[i]<duration;i+=4){
      const start=i===0?0:beats[i],end=Math.min(duration,beats[i+4]??duration);
      const energy=grid?.energy?.slice(i,i+4),level=energy?.length?energy.reduce((v,n)=>v+n,0)/energy.length:.65;
      const index=shots.length,section=Math.floor(i/16);
      shots.push({index,start,end,firstBeat:i,kind:looks[(index+section*3)%looks.length],
        transition:transitions[(index+Math.floor(section/2))%transitions.length],energy:clamp(level),direction:index%2?-1:1});
    }
    if(!shots.length)shots.push({index:0,start:0,end:duration,firstBeat:0,kind:'cinema',transition:'whip',energy:.6,direction:1});
    cachedGrid=grid;cachedDuration=duration;cachedTempo=tempo;cachedPhase=phase;cachedPlan={shots,beats,period,duration};return cachedPlan;
  }
  function sample(time,grid,duration=80,tempo=100,phase=0){
    const timeline=plan(grid,duration,tempo,phase),t=clamp(time,0,duration);
    let index=timeline.shots.findIndex(s=>t<s.end);if(index<0)index=timeline.shots.length-1;
    const shot=timeline.shots[index],previous=timeline.shots[Math.max(0,index-1)];
    let beat=timeline.beats.findIndex(v=>v>t)-1;if(beat<-1)beat=timeline.beats.length-1;
    const beatTime=timeline.beats[beat]??0,age=Math.max(0,t-beatTime);
    const strength=clamp(grid?.strength?.[beat]??.6),energy=clamp(grid?.energy?.[beat]??shot.energy);
    const transitionDuration=Math.min(.3,timeline.period*.52);
    return{...shot,previous,beat,progress:clamp((t-shot.start)/(shot.end-shot.start)),
      transitionProgress:index?clamp((t-shot.start)/transitionDuration):1,
      attack:beat<0?0:Math.exp(-age*17)*(.3+strength*.7),energy,strength};
  }
  function dimensions(source){return [source.videoWidth||source.width,source.videoHeight||source.height];}
  function cover(ctx,source,w,h,zoom=1,px=0,py=0){
    const [sw,sh]=dimensions(source),scale=Math.max(w/sw,h/sh)*zoom,dw=sw*scale,dh=sh*scale;
    ctx.drawImage(source,(w-dw)/2+px,(h-dh)/2+py,dw,dh);
  }
  function panel(ctx,source,x,y,w,h,zoom=1,dx=0,dy=0,flip=false){
    ctx.save();ctx.beginPath();ctx.rect(x,y,w,h);ctx.clip();ctx.translate(x,y);
    if(flip){ctx.translate(w,0);ctx.scale(-1,1);}cover(ctx,source,w,h,zoom,dx,dy);ctx.restore();
  }
  function shot(ctx,source,w,h,q,progress,attack){
    ctx.save();ctx.clearRect(0,0,w,h);ctx.fillStyle='#08090d';ctx.fillRect(0,0,w,h);
    const level=.55+q.energy*.45,zoom=1.08+progress*.17+attack*.10*level,dir=q.direction;
    switch(q.kind){
      case 'triptych':
        for(let i=0;i<3;i++)panel(ctx,source,i*w/3,0,w/3-2,h,zoom+(i===1?.18:0),dir*(progress-.5)*w*.08,0,i===2);
        break;
      case 'diagonal':
        cover(ctx,source,w,h,zoom);
        for(let i=0;i<5;i++){
          ctx.save();ctx.beginPath();const xx=i*w/5;
          ctx.moveTo(xx-h*.12,0);ctx.lineTo(xx+w/5-h*.12,0);ctx.lineTo(xx+w/5+h*.12,h);ctx.lineTo(xx+h*.12,h);ctx.closePath();ctx.clip();
          cover(ctx,source,w,h,zoom+.1,(i%2?1:-1)*(w*.055+attack*w*.025),0);ctx.restore();
        }break;
      case 'mirror':
        panel(ctx,source,0,0,w/2,h,1.16+attack*.12,progress*w*.05,0);
        panel(ctx,source,w/2,0,w/2,h,1.16+attack*.12,progress*w*.05,0,true);break;
      case 'filmstrip':
        for(let i=0;i<3;i++)panel(ctx,source,0,i*h/3,w,h/3-3,1.05+attack*.12,dir*(i-1)*w*.07,0,i===1);
        ctx.fillStyle='#090a0e';for(let y=8;y<h;y+=h/16){ctx.fillRect(6,y,8,h/35);ctx.fillRect(w-14,y,8,h/35);}break;
      case 'tunnel':
        cover(ctx,source,w,h,zoom);
        for(let i=1;i<=4;i++){
          const scale=Math.pow(.78,i)*(1+attack*.08),pw=w*scale,ph=h*scale;
          panel(ctx,source,(w-pw)/2,(h-ph)/2,pw,ph,1.05+progress*.3,0,0,i%2===0);
          ctx.strokeStyle=i%2?'#e3ce9c99':'#a5bff799';ctx.lineWidth=2;ctx.strokeRect((w-pw)/2,(h-ph)/2,pw,ph);
        }break;
      case 'split':
        panel(ctx,source,0,0,w,h/2-2,zoom,dir*w*.10*(1-progress));
        panel(ctx,source,0,h/2+2,w,h/2-2,zoom,-dir*w*.10*(1-progress),0,true);break;
      case 'orbit':
        ctx.translate(w/2,h/2);ctx.rotate(dir*(.055*Math.sin(progress*Math.PI)+attack*.018));
        ctx.translate(-w/2,-h/2);cover(ctx,source,w,h,zoom+.15,dir*Math.sin(progress*Math.PI)*w*.035);break;
      default:cover(ctx,source,w,h,zoom,dir*(progress-.5)*w*.06);break;
    }
    // gradación de color continua, sin parpadeo de toda la pantalla.
    ctx.globalCompositeOperation='soft-light';ctx.fillStyle=q.index%2?'#25779333':'#a849562e';ctx.fillRect(0,0,w,h);ctx.restore();
  }
  function transition(ctx,w,h,q){
    const t=q.transitionProgress,p=q.transition==='whip'?(t<.5?4*t*t*t:1-Math.pow(-2*t+2,3)/2):ease(t),dir=q.direction;
    ctx.drawImage(outgoing,0,0,w,h);
    ctx.save();
    switch(q.transition){
      case 'whip':
        ctx.clearRect(0,0,w,h);
        ctx.drawImage(outgoing,-dir*p*w,0,w,h);ctx.drawImage(incoming,dir*(1-p)*w,0,w,h);
        // ecos espaciales acotados, independientes del fotograma anterior.
        if(p>.05&&p<.95){ctx.globalAlpha=.12;for(let i=1;i<=3;i++)ctx.drawImage(incoming,dir*(1-p)*w-dir*i*w*.018,0,w,h);}break;
      case 'shutter':
        for(let i=0;i<10;i++){
          const reveal=clamp(p*1.35-i*.035),sh=h/10;
          if(reveal<=0)continue;
          ctx.drawImage(incoming,0,i*incoming.height/10,incoming.width,incoming.height/10,dir>0?0:w*(1-reveal),i*sh,w*reveal,sh+1);
        }break;
      case 'iris':
        ctx.beginPath();ctx.arc(w/2,h/2,Math.hypot(w,h)*.5*p,0,Math.PI*2);ctx.clip();ctx.drawImage(incoming,0,0,w,h);break;
      case 'slide':
        ctx.drawImage(incoming,0,(1-p)*h,w,h);break;
      case 'prism':
        for(let i=0;i<6;i++){
          ctx.save();ctx.beginPath();ctx.rect(i*w/6,0,w/6+1,h);ctx.clip();
          ctx.drawImage(incoming,dir*(1-p)*w*(i%2?.45:-.45),0,w,h);ctx.globalAlpha=1-p;ctx.drawImage(outgoing,0,0,w,h);ctx.restore();
        }break;
    }
    ctx.restore();
  }
  function render(ctx,w,h,time,source,grid,options={}){
    const [sw,sh]=dimensions(source);if(!sw||!sh)return null;
    const q=sample(time,grid,options.duration||80,options.bpm,options.phase);
    const bw=Math.max(1,Math.round(Math.min(w,1280))),bh=Math.max(1,Math.round(h*bw/w));
    for(const canvas of [outgoing,incoming,chroma])if(canvas.width!==bw||canvas.height!==bh){canvas.width=bw;canvas.height=bh;}
    shot(b,source,bw,bh,q,q.progress,q.attack);
    ctx.save();ctx.fillStyle='#08090d';ctx.fillRect(0,0,w,h);
    if(q.transitionProgress<1){shot(a,source,bw,bh,q.previous,1,0);transition(ctx,w,h,q);}else ctx.drawImage(incoming,0,0,w,h);
    // acentos de los ataques reales: bandas desplazadas y eco cromático del metraje.
    if(q.attack>.12&&q.strength>.2){
      ctx.save();ctx.globalAlpha=q.attack*.28;ctx.globalCompositeOperation='screen';
      for(const [i,color] of ['#ff4455','#33ddff'].entries()){
        rgb.globalCompositeOperation='source-over';rgb.drawImage(incoming,0,0);
        rgb.globalCompositeOperation='multiply';rgb.fillStyle=color;rgb.fillRect(0,0,bw,bh);
        ctx.drawImage(chroma,(i?1:-1)*q.direction*w*.025*q.attack,0,w,h);
      }
      rgb.globalCompositeOperation='source-over';ctx.restore();
      if(q.kind==='diagonal'||q.kind==='filmstrip'){
        for(let i=0;i<3;i++){const sy=((q.beat*17+i*29)%89)/100*bh,sh=Math.max(1,bh*.025);
          ctx.drawImage(incoming,0,sy,bw,sh,q.direction*w*.045*q.attack,sy*h/bh,w,sh*h/bh);}
      }
    }
    if(options.flashes!==false&&q.strength>.65&&q.attack>.25){
      ctx.globalCompositeOperation='soft-light';ctx.globalAlpha=q.attack*.26;ctx.fillStyle='#9bcbef';ctx.fillRect(0,0,w,h);
    }
    ctx.restore();return q;
  }
  window.LMFRAMESMONTAGE={plan,sample,render,looks,transitions};
})();
