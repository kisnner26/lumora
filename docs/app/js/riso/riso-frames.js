// lumora frames: metraje local y montaje determinista sobre el reloj musical.
(() => {
  'use strict';
  const limit=80, asset='media/frames/gimme-more.mp4';
  const norm=s=>String(s||'').normalize('NFKD').replace(/[\u0300-\u036f]/g,'').toLowerCase().replace(/[^a-z0-9]+/g,' ').trim();
  function detect(title,artist){
    const name=String(title||'').replace(/\s*[([](?:remaster(?:ed)?(?:\s+\d{4})?|original(?:\s+version)?|album version)[\])]/gi,'');
    return norm(name)==='gimme more'&&norm(artist)==='britney spears';
  }
  let boosted=false;try{boosted=localStorage.getItem('lm_frames_boost')==='1';}catch{}
  let video=null,failed=false,grid=null,playPending=false;
  const buffer=document.createElement('canvas'),b=buffer.getContext('2d');
  const reduced=()=>!!window.CFG?.reduceMotion||matchMedia('(prefers-reduced-motion: reduce)').matches;
  const homeOn=()=>document.getElementById('home')?.classList.contains('on');
  const matches=()=>ext.has()&&detect(ext.st.name,ext.st.artist);
  function footage(){
    if(video)return video;
    video=document.createElement('video');video.muted=true;video.defaultMuted=true;video.playsInline=true;video.preload='auto';video.src=asset;video.setAttribute('playsinline','');video.setAttribute('aria-hidden','true');
    video.addEventListener('error',()=>{failed=true;paint();});
    fetch('media/frames/gimme-more-beats.json').then(r=>{if(!r.ok)throw Error(r.status);return r.json();}).then(v=>{if(v.bpm>40&&v.bpm<240&&Number.isFinite(v.phase))grid=v;}).catch(()=>{});
    return video;
  }
  function stop(){if(video&&!video.paused)video.pause();}
  function cue(time,tempo,phase=0){
    const period=60/(Number.isFinite(tempo)&&tempo>40&&tempo<240?tempo:100),beat=Math.max(0,(time-phase)/period),index=Math.floor(beat),fraction=beat-index;
    const shot=Math.floor(beat/8),local=(beat%8)*period,attack=Math.exp(-fraction*period*15),cut=Math.exp(-local*13);
    return {beat:index,shot,phase:fraction,progress:(beat%8)/8,attack,cut,kind:['push','pan','split','pull'][shot%4],direction:shot%2?-1:1};
  }
  function musicalCue(time){const g=matches()?grid:null;return cue(time,g?.bpm||IN.bpm||proc.bpm,g?.phase??IN.phase??0);}
  function sync(time){
    const v=footage(),playing=ext.st.state==='playing'&&!document.hidden&&!coverOpen;
    if(v.readyState>=1){
      const target=Math.max(0,Math.min(time,v.duration-.04));
      if(!v.seeking&&Math.abs(v.currentTime-target)>(playing?.18:.025))v.currentTime=target;
      v.playbackRate=1;
      if(playing&&v.paused&&!v.seeking&&!playPending){playPending=true;v.play().catch(()=>{}).finally(()=>{playPending=false;});}
      if(!playing&&!v.paused)v.pause();
    }
    return v;
  }
  function drawFootage(ctx,w,h,time,alpha=1){
    if(failed)return false;const v=sync(time);if(v.readyState<2||v.seeking)return false;
    const s=Math.min(w/v.videoWidth,h/v.videoHeight),dw=v.videoWidth*s,dh=v.videoHeight*s;
    ctx.save();ctx.globalAlpha=alpha;ctx.fillStyle='#08090d';ctx.fillRect(0,0,w,h);ctx.drawImage(v,(w-dw)/2,(h-dh)/2,dw,dh);ctx.restore();return true;
  }
  function boostCanvas(ctx,w,h,time){
    if(!boosted||reduced()||homeOn())return;
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
  function eligible(time){return !coverOpen&&!homeOn()&&!document.hidden&&matches()&&time>=0&&time<limit;}
  function before(ctx,w,h,time){
    if(!eligible(time)){stop();return false;}
    if(time>=limit-.4&&!reduced())return false;
    const drawn=drawFootage(ctx,w,h,time);if(drawn)boostCanvas(ctx,w,h,time);return drawn;
  }
  function after(ctx,w,h,time){
    if(eligible(time)&&time>=limit-.4&&!reduced())drawFootage(ctx,w,h,time,(limit-time)/.4);
    boostCanvas(ctx,w,h,time);
  }
  function setBoost(value){boosted=!!value;try{localStorage.setItem('lm_frames_boost',boosted?'1':'0');}catch{}paint();}
  const style=document.createElement('style');style.textContent=`
  #lumoraFramesBar{position:fixed;top:max(20px,env(safe-area-inset-top));right:max(20px,env(safe-area-inset-right));z-index:22;display:flex;align-items:center;gap:12px;padding:8px 10px 8px 16px;background:#101318eb;border:1px solid #ffffff26;border-radius:14px;color:#f5f0e7;box-shadow:0 12px 40px #0005;font:400 11px system-ui,sans-serif}
  #lumoraFramesBar[hidden]{display:none}#lumoraFramesBar button{background:#ffffff0c;border:1px solid #ffffff28;color:#f5f0e7;padding:10px 12px;border-radius:8px;font:500 11px system-ui,sans-serif;cursor:pointer}#lumoraFramesBar button[aria-pressed=true]{background:#99b8eb;color:#111720;border-color:#99b8eb}
  #lumoraFramesBar button:focus-visible{outline:2px solid #99b8eb;outline-offset:3px}
  @media(max-width:700px){#lumoraFramesBar{top:12px;right:12px;left:12px;justify-content:space-between;gap:6px;font-size:10px}#lumoraFramesBar button{padding:10px 8px;font-size:10px}}
  `;document.head.append(style);
  const bar=document.createElement('div');bar.id='lumoraFramesBar';bar.hidden=true;
  const status=document.createElement('span'),button=document.createElement('button');button.type='button';button.textContent='boost with lumora frames';button.addEventListener('click',()=>setBoost(!boosted));bar.append(status,button);document.body.append(bar);
  const more=document.createElement('button');more.id='hudFrames';more.type='button';more.dataset.label='boost with lumora frames';more.title='boost with lumora frames';more.setAttribute('aria-label',more.title);more.innerHTML='<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M3 4h18v16H3zm2 2v12h14V6zM9 8l7 4-7 4z"/></svg>';more.addEventListener('click',()=>setBoost(!boosted));document.getElementById('hudMore')?.append(more);
  function paint(){
    const match=matches(),time=window.RISOCLIP?.h?.timeNow?.()??0;
    bar.hidden=!match||homeOn()||mode!=='proc'||coverOpen||CFG.clip==='clasico'||CFG.clip==='portada';
    for(const el of [button,more])el.setAttribute('aria-pressed',String(boosted));
    more.classList.toggle('on',boosted);
    status.textContent=failed?'gameplay no disponible · animación activa':time>=limit?'animación · '+(CFG.clip==='fabula'?'fábula':'risografía'):'geometry dash · '+Math.floor(Math.max(0,time)/60)+':'+String(Math.floor(Math.max(0,time)%60)).padStart(2,'0')+' / 1:20';
    if(bar.hidden||document.hidden||time>=limit)stop();
  }
  const timer=setInterval(paint,250);document.addEventListener('visibilitychange',()=>{if(document.hidden)stop();});addEventListener('pagehide',()=>{clearInterval(timer);stop();},{once:true});
  window.LMFRAMES={detect,cue,before,after,boostCanvas,setBoost,stop,get boosted(){return boosted;},get video(){return video;},get grid(){return grid;},get failed(){return failed;}};paint();
})();
