// lumora frames: metraje local y montaje determinista sobre el reloj musical.
(() => {
  'use strict';
  const limit=80, asset='media/frames/gimme-more.mp4', editAsset='media/frames/gimme-more-boost.mp4';
  const norm=s=>String(s||'').normalize('NFKD').replace(/[\u0300-\u036f]/g,'').toLowerCase().replace(/[^a-z0-9]+/g,' ').trim();
  function detect(title,artist){
    const name=String(title||'').replace(/\s*[([](?:remaster(?:ed)?(?:\s+\d{4})?|original(?:\s+version)?|album version)[\])]/gi,'');
    return norm(name)==='gimme more'&&norm(artist)==='britney spears';
  }
  let boosted=false;try{boosted=localStorage.getItem('lm_frames_boost')==='1';}catch{}
  let video=null,editVideo=null,activeVideo=null,failed=false,editFailed=false,grid=null,editPlan=null;
  const playPending=new Set();
  const buffer=document.createElement('canvas'),b=buffer.getContext('2d');
  const reduced=()=>!!window.CFG?.reduceMotion||matchMedia('(prefers-reduced-motion: reduce)').matches;
  const homeOn=()=>document.getElementById('home')?.classList.contains('on');
  const matches=()=>ext.has()&&detect(ext.st.name,ext.st.artist);
  function footage(){
    if(video)return video;
    video=document.createElement('video');video.muted=true;video.defaultMuted=true;video.playsInline=true;video.preload='auto';video.src=asset;video.setAttribute('playsinline','');video.setAttribute('aria-hidden','true');
    video.addEventListener('error',()=>{failed=true;paint();});
    fetch('media/frames/gimme-more-beats.json').then(r=>{if(!r.ok)throw Error(r.status);return r.json();}).then(v=>{if(v.bpm>40&&v.bpm<240&&Number.isFinite(v.phase))grid=v;}).catch(()=>{});
    fetch('media/frames/gimme-more-edit.json').then(r=>{if(!r.ok)throw Error(r.status);return r.json();}).then(v=>{editPlan=v;paint();}).catch(()=>{});
    return video;
  }
  function edited(){
    if(editVideo)return editVideo;
    editVideo=document.createElement('video');editVideo.muted=true;editVideo.defaultMuted=true;editVideo.playsInline=true;editVideo.preload='auto';editVideo.src=editAsset;
    editVideo.setAttribute('playsinline','');editVideo.setAttribute('aria-hidden','true');
    editVideo.addEventListener('error',()=>{editFailed=true;paint();});return editVideo;
  }
  function stop(){for(const v of [video,editVideo])if(v&&!v.paused)v.pause();}

  function cue(time,tempo,phase=0){
    const period=60/(Number.isFinite(tempo)&&tempo>40&&tempo<240?tempo:100),beat=Math.max(0,(time-phase)/period),index=Math.floor(beat),fraction=beat-index;
    const shot=Math.floor(beat/8),local=(beat%8)*period,attack=Math.exp(-fraction*period*15),cut=Math.exp(-local*13);
    return {beat:index,shot,phase:fraction,progress:(beat%8)/8,attack,cut,kind:['push','pan','split','pull'][shot%4],direction:shot%2?-1:1};
  }
  function musicalCue(time){const g=matches()?grid:null;return cue(time,g?.bpm||IN.bpm||proc.bpm,g?.phase??IN.phase??0);}
  function sync(time,v=footage()){
    const playing=ext.st.state==='playing'&&!document.hidden&&!coverOpen;
    if(v.readyState>=1){
      const target=Math.max(0,Math.min(time,v.duration-.04));
      if(!v.seeking&&Math.abs(v.currentTime-target)>(playing?.18:.025))v.currentTime=target;
      v.playbackRate=1;
      if(playing&&v.paused&&!v.seeking&&!playPending.has(v)){playPending.add(v);v.play().catch(()=>{}).finally(()=>{playPending.delete(v);});}
      if(!playing&&!v.paused)v.pause();
    }
    return v;
  }
  function drawFootage(ctx,w,h,time,alpha=1){
    const raw=footage(),wantEdit=boosted&&!reduced()&&!editFailed;
    let v=sync(time,wantEdit?edited():raw);
    if(v.readyState<2||v.seeking){
      if(!wantEdit||failed)return false;
      v=sync(time,raw);if(v.readyState<2||v.seeking)return false;
    }
    activeVideo=v;
    for(const other of [video,editVideo])if(other&&other!==v&&!other.paused)other.pause();
    const s=Math.min(w/v.videoWidth,h/v.videoHeight),dw=v.videoWidth*s,dh=v.videoHeight*s;
    ctx.save();ctx.globalAlpha=alpha;ctx.fillStyle='#08090d';ctx.fillRect(0,0,w,h);ctx.drawImage(v,(w-dw)/2,(h-dh)/2,dw,dh);ctx.restore();return true;
  }
  function boostFootage(ctx,w,h,time,source,options={}){
    if(!boosted||reduced()||homeOn()||!window.LMFRAMESMONTAGE)return null;
    return LMFRAMESMONTAGE.render(ctx,w,h,time,source,options.grid??null,{
      duration:options.duration||limit,bpm:options.bpm||IN.bpm||proc.bpm,phase:options.phase??IN.phase,flashes:CFG.flashes});
  }
  function boostCanvas(ctx,w,h,time,external=false){
    if(!boosted||reduced()||homeOn())return;
    if(external)return; // el montaje externo ya está compilado, sin volver a procesarlo.
    const q=musicalCue(time),live=window.AUD?.live?Math.min(.35,Math.max(0,AUD.pulse||0)*.25):0;
    const travel=q.kind==='pull'?.035*(1-q.progress):q.kind==='push'?.035*q.progress:.012;
    const zoom=1.012+travel+q.attack*.025+q.cut*.025+live*.015;
    const bw=Math.max(1,Math.round(Math.min(w,1920))),bh=Math.max(1,Math.round(h*bw/w));
    if(buffer.width!==bw||buffer.height!==bh){buffer.width=bw;buffer.height=bh;}
    b.clearRect(0,0,bw,bh);b.drawImage(ctx.canvas,0,0,bw,bh);
    ctx.save();ctx.fillStyle='#08090d';ctx.fillRect(0,0,w,h);ctx.translate(w/2,h/2);
    ctx.rotate(q.direction*q.cut*.008);ctx.scale(zoom,zoom);
    ctx.drawImage(buffer,-w/2+q.direction*q.cut*w*.008,-h/2,w,h);ctx.restore();
    // un eco de encuadre en el primer pulso de cada ocho; nunca altera el reloj del gameplay.
    if(q.kind==='split'&&q.cut>.08){ctx.save();ctx.globalAlpha=q.cut*.12;ctx.globalCompositeOperation='screen';ctx.drawImage(buffer,q.direction*w*.014,0,w,h);ctx.restore();}
    if(q.kind==='pan'&&q.cut>.08){ctx.save();ctx.globalAlpha=q.cut*.15;ctx.fillStyle='#9bbcff';ctx.fillRect((q.direction>0?1-q.cut:q.cut)*w,0,w*.018,h);ctx.restore();}
    const shade=ctx.createRadialGradient(w/2,h/2,h*.22,w/2,h/2,Math.max(w,h)*.65);shade.addColorStop(0,'#0000');shade.addColorStop(1,'#0005');ctx.save();ctx.fillStyle=shade;ctx.fillRect(0,0,w,h);ctx.restore();
  }
  // la letra comparte reloj y controles con los motores ilustrados, pero se compone
  // después del montaje: los golpes de cámara nunca desplazan el texto.
  function drawLyrics(ctx,w,h,time){
    if(IN.show===false)return;
    const li=window.RISOCLIP?.h?.lineIdx(time)??-1,line=IN.lines[li];
    if(!line)return;
    const tr=IN.tr?.[li]?.trim()||'',main=IN.trMode==='es'&&tr?tr:line.text;
    const second=IN.trMode==='ambas'?tr:'';
    if(!main)return;
    ctx.save();ctx.textAlign='center';ctx.textBaseline='top';
    const serif=CFG.clip==='fabula',family=serif?'"Cormorant Garamond", Georgia, serif':'"Anybody", sans-serif';
    const maxW=w*.82,maxH=h*.28,scale=Math.max(.7,Math.min(1.6,+CFG.lyricSize||1));
    let size=Math.min(h*.052,w*.066)*scale;
    function wrapText(text,fs,translation=false){
      ctx.font=`${translation?'italic 500':'600'} ${fs}px ${family}`;
      const rows=[];let row='';
      for(const word of text.trim().split(/\s+/)){
        const next=row?row+' '+word:word;
        if(row&&ctx.measureText(next).width>maxW){rows.push(row);row='';}
        if(ctx.measureText(word).width<=maxW){row=row?row+' '+word:word;continue;}
        for(const char of word){
          if(row&&ctx.measureText(row+char).width>maxW){rows.push(row);row='';}row+=char;
        }
      }
      if(row.trim())rows.push(row.trim());return rows;
    }
    let lines,translations,total;
    do{lines=wrapText(main,size);translations=second?wrapText(second,size*.64,true):[];
      total=lines.length*size*1.16+(translations.length?size*.24+translations.length*size*.78:0);
      if(total<=maxH)break;size*=.9;
    }while(size>Math.min(w,h)*.012);
    const top=h*.78-total,pad=size*.5;
    const shade=ctx.createLinearGradient(0,top-pad*2,0,h*.82);
    shade.addColorStop(0,'#08090d00');shade.addColorStop(.35,'#08090dbb');shade.addColorStop(1,'#08090d00');
    ctx.fillStyle=shade;ctx.fillRect(0,top-pad*2,w,total+pad*4);
    ctx.shadowColor='#000';ctx.shadowBlur=size*.2;ctx.shadowOffsetY=size*.04;
    ctx.fillStyle='#fff8ed';ctx.font=`600 ${size}px ${family}`;
    let y=top;for(const row of lines){ctx.fillText(row,w/2,y);y+=size*1.16;}
    if(translations.length){y+=size*.24;ctx.fillStyle='#ead6af';ctx.font=`italic 500 ${size*.64}px ${family}`;
      for(const row of translations){ctx.fillText(row,w/2,y);y+=size*.78;}}
    ctx.restore();
  }
  function eligible(time){return !coverOpen&&!homeOn()&&!document.hidden&&matches()&&time>=0&&time<limit;}
  function before(ctx,w,h,time){
    if(!eligible(time)){stop();return false;}
    const drawn=drawFootage(ctx,w,h,time);
    if(drawn)drawLyrics(ctx,w,h,time);return drawn;
  }
  function after(ctx,w,h,time){
    if(window.RISO?.grief?.detect(ext.st?.name,ext.st?.artist))return;
    boostCanvas(ctx,w,h,time);
  }
  function setBoost(value){boosted=!!value;try{localStorage.setItem('lm_frames_boost',boosted?'1':'0');}catch{}paint();}
  const button=document.createElement('button');button.id='autFrames';button.className='aut-btn';button.type='button';
  button.textContent='boost with lumora frames';button.title='montaje automático al ritmo de la canción';
  button.addEventListener('click',()=>setBoost(!boosted));
  document.getElementById('autTop')?.insertBefore(button,document.getElementById('autSaved'));
  function paint(){
    const time=window.RISOCLIP?.h?.timeNow?.()??0;
    button.setAttribute('aria-pressed',String(boosted));button.classList.toggle('gold',boosted);
    button.title=editFailed?'edición no disponible · metraje original':editPlan?`edición musical · ${editPlan.shots.length} planos · ${editPlan.accents.length} acentos seleccionados`:'montaje automático al ritmo de la canción';
    if(!eligible(time)||mode!=='proc'||CFG.clip==='clasico'||CFG.clip==='portada')stop();
  }
  const timer=setInterval(paint,250);document.addEventListener('visibilitychange',()=>{if(document.hidden)stop();});addEventListener('pagehide',()=>{clearInterval(timer);stop();},{once:true});
  window.LMFRAMES={detect,cue,before,after,boostCanvas,boostFootage,setBoost,stop,get boosted(){return boosted;},get video(){return activeVideo||video;},get originalVideo(){return video;},get editedVideo(){return editVideo;},get editPlan(){return editPlan;},get editFailed(){return editFailed;},get grid(){return grid;},get failed(){return failed;}};paint();
})();
