// letras cinéticas para metraje: reloj musical, luz del fondo y composición estable.
(() => {
  'use strict';
  const clamp=(v,a=0,b=1)=>Math.max(a,Math.min(b,v));
  const ease=v=>1-Math.pow(1-clamp(v),3);
  const probe=document.createElement('canvas');probe.width=48;probe.height=27;
  const px=probe.getContext('2d',{willReadFrequently:true}),layouts=new Map();
  function sense(source){
    const fallback={brightness:0,activity:0,focus:0,color:[130,215,255]};
    if(!source||(source.readyState!==undefined&&source.readyState<2))return fallback;
    try{
      px.clearRect(0,0,48,27);px.drawImage(source,0,0,48,27);
      const d=px.getImageData(0,0,48,27).data;let light=0,edges=0,weight=0,center=0,r=0,g=0,b=0,colors=0,count=0;
      for(let y=13;y<24;y++)for(let x=2;x<46;x++){
        const i=(y*48+x)*4,l=(d[i]*.2126+d[i+1]*.7152+d[i+2]*.0722)/255;
        light+=l;weight+=l;center+=(x/47-.5)*l;count++;
        edges+=Math.abs(l-(d[i-4]*.2126+d[i-3]*.7152+d[i-2]*.0722)/255);
        const saturation=(Math.max(d[i],d[i+1],d[i+2])-Math.min(d[i],d[i+1],d[i+2]))/255;
        const k=saturation*l;r+=d[i]*k;g+=d[i+1]*k;b+=d[i+2]*k;colors+=k;
      }
      return {brightness:light/count,activity:clamp(edges/count*5),focus:weight?center/weight:0,color:colors>1?[r/colors,g/colors,b/colors]:fallback.color};
    }catch{return fallback;}
  }
  function layout(ctx,w,h,main,translation,options){
    const serif=options.style==='fabula',family=serif?'"Cormorant Garamond", Georgia, serif':'"Anybody", sans-serif';
    const sizeScale=clamp(+options.size||1,.7,1.6),key=[w,h,main,translation,serif,sizeScale].join('|');
    if(layouts.has(key))return layouts.get(key);
    const maxW=w*.8,maxH=h*.29,weight=serif?600:700;
    let size=Math.min(h*.065,w*.075)*sizeScale;
    function wrap(text,fs,translated=false){
      ctx.font=`${translated?'italic 500':weight} ${fs}px ${family}`;
      const rows=[];let row='';
      for(const word of text.trim().split(/\s+/)){
        const next=row?row+' '+word:word;
        if(row&&ctx.measureText(next).width>maxW){rows.push(row);row='';}
        if(ctx.measureText(word).width<=maxW){row=row?row+' '+word:word;continue;}
        for(const char of word){if(row&&ctx.measureText(row+char).width>maxW){rows.push(row);row='';}row+=char;}
      }
      if(row)rows.push(row);
      return rows.map(text=>({text,width:ctx.measureText(text).width}));
    }
    let rows,translations,total;
    do{
      rows=wrap(main,size);translations=translation?wrap(translation,size*.56,true):[];
      total=rows.length*size*1.12+(translations.length?size*.32+translations.length*size*.7:0);
      if(total<=maxH)break;size*=.9;
    }while(size>1);
    // posiciones y avance medidos una vez; el ritmo solo transforma el bloque.
    const words=[];ctx.font=`${weight} ${size}px ${family}`;
    let units=0;
    for(let row=0;row<rows.length;row++){
      const text=rows[row].text;rows[row].units=units;
      for(const match of text.matchAll(/\S+/g))words.push({row,start:units+match.index,end:units+match.index+match[0].length,x:ctx.measureText(text.slice(0,match.index)).width,width:ctx.measureText(match[0]).width});
      units+=text.length+1;
    }
    const result={rows,translations,total,size,family,weight,units:Math.max(1,units-1),words,width:Math.max(...rows.map(r=>r.width),1)};
    if(layouts.size>=96)layouts.delete(layouts.keys().next().value);layouts.set(key,result);return result;
  }
  function sample(time,start,end,grid,scene,options={}){
    const reduced=!!options.reduced||options.animate===false,age=(time+.2+(options.off||0))-start;
    const duration=Math.max(.35,Math.min(12,end-start)),remaining=duration-age;
    const music=window.LMFRAMESLIGHT?.sample(time,grid,{bpm:options.bpm,phase:options.phase,flashes:options.flashes})||{pulse:0,energy:.5,tint:[.4,.8,1]};
    const pulse=reduced||options.flashes===false?0:music.pulse;
    const entry=reduced?1:ease(age/.34),exit=reduced?1:clamp(remaining/.2);
    let accent=scene.color.map((v,i)=>clamp(v*.58+music.tint[i]*255*.42,65,255));
    const luminance=accent[0]*.2126+accent[1]*.7152+accent[2]*.0722;
    const lift=luminance<186?(186-luminance)/(255-luminance):0;
    accent=accent.map(v=>Math.round(v+(255-v)*lift));
    return {entry,exit,pulse,age,duration,progress:clamp(age/duration),accent,
      scale:reduced?1:1+(1-entry)*.055+pulse*.012,
      x:reduced?0:-scene.focus*options.width*.014*scene.activity,
      y:reduced?0:(1-entry)*options.height*.025-pulse*options.height*.003,
      backdrop:.24+scene.brightness*.5,glow:reduced?0:3+scene.activity*3+pulse*7,reduced};
  }
  function render(ctx,w,h,time,options={}){
    if(options.show===false)return null;
    const lines=options.lines||[],lt=time+.2+(options.off||0);
    let index=-1;for(let i=0;i<lines.length;i++){if(lines[i].t<=lt)index=i;else break;}
    const line=index>=0&&lt-lines[index].t<=12?lines[index]:null;
    const tr=line?options.translations?.[index]?.trim()||'':'';
    const main=options.text??(line?(options.trMode==='es'&&tr?tr:line.text):'');
    if(!main?.trim())return null;
    const translation=options.translation??(options.trMode==='ambas'?tr:'');
    const start=line?.t??Math.floor(lt/4)*4,end=lines[index+1]?.t??start+4.8;
    const scene=options.reduced?{brightness:.4,activity:0,focus:0,color:[170,210,240]}:sense(options.source);
    const q=sample(time,start,end,options.grid,scene,{...options,width:w,height:h});
    ctx.save();
    const l=layout(ctx,w,h,main,translation,options),bottom=h*.78,top=bottom-l.total;
    const rgb=q.accent.join(','),accent=`rgb(${rgb})`,shade=ctx.createLinearGradient(0,top-l.size,0,bottom+l.size*.6);
    shade.addColorStop(0,'rgba(4,6,12,0)');shade.addColorStop(.4,`rgba(4,6,12,${q.backdrop})`);shade.addColorStop(1,'rgba(4,6,12,0)');
    ctx.fillStyle=shade;ctx.fillRect(0,top-l.size,w,l.total+l.size*1.6);
    ctx.translate(w/2+q.x,top+q.y);ctx.scale(q.scale,q.scale);
    ctx.textAlign='center';ctx.textBaseline='top';ctx.lineJoin='round';
    ctx.font=`${l.weight} ${l.size}px ${l.family}`;
    ctx.strokeStyle='rgba(3,4,10,.88)';ctx.lineWidth=Math.max(1,l.size*.055);ctx.shadowColor='#000';ctx.shadowBlur=l.size*.16;
    const cursor=q.progress*l.units,current=l.words.find(word=>cursor>=word.start&&cursor<=word.end)||null;
    for(let i=0;i<l.rows.length;i++){
      const row=l.rows[i],y=i*l.size*1.12;
      const arrival=q.reduced?1:ease((q.age-Math.min(.18,i*.045))/.28),rise=q.reduced?0:(1-arrival)*l.size*.28;
      ctx.save();ctx.globalAlpha=(.3+.7*arrival)*q.exit;ctx.translate(0,rise);
      ctx.strokeText(row.text,0,y);ctx.fillStyle='#fff8ef';ctx.fillText(row.text,0,y);
      if(!q.reduced){
        // un barrido de énfasis estimado dentro del verso, sin ocultar palabras futuras.
        const coverage=clamp((cursor-row.units)/Math.max(1,row.text.length));
        if(coverage>0){ctx.save();ctx.beginPath();ctx.rect(-row.width/2-l.size*.02,y-l.size*.12,row.width*coverage+l.size*.04,l.size*1.35);ctx.clip();
          ctx.shadowColor=accent;ctx.shadowBlur=Math.min(l.size*.35,q.glow*h/720);ctx.fillStyle=accent;ctx.fillText(row.text,0,y);ctx.restore();}
        if(current?.row===i){
          ctx.shadowColor=accent;ctx.shadowBlur=q.glow*h/720;ctx.fillStyle=`rgba(${rgb},${.55+q.pulse*.3})`;
          ctx.fillRect(-row.width/2+current.x,y+l.size*1.02,current.width,Math.max(1.5,l.size*.045));
        }
      }
      ctx.restore();
    }
    if(l.translations.length){
      ctx.globalAlpha=q.exit*(q.reduced?1:.65+.35*ease((q.age-.08)/.32));ctx.fillStyle='#ece3d5';ctx.shadowColor='#000';ctx.shadowBlur=l.size*.12;
      ctx.font=`italic 500 ${l.size*.56}px ${l.family}`;
      let y=l.rows.length*l.size*1.12+l.size*.32;
      for(const row of l.translations){ctx.fillText(row.text,0,y);y+=l.size*.7;}
    }
    ctx.restore();return {index,...q,layout:l};
  }
  const clear=()=>layouts.clear();document.fonts?.addEventListener('loadingdone',clear);
  addEventListener('pagehide',()=>{clear();document.fonts?.removeEventListener('loadingdone',clear);},{once:true});
  window.LMFRAMESLYRICS={render,sense,sample,layout};
})();
