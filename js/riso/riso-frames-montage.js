// dirección ligera para metraje sin una edición compilada: continuidad y acentos aislados.
// gimme more usa el montaje temporal de tools/edit_frames.py, no esta capa de cámara.
(() => {
  'use strict';
  const clamp=(v,a=0,b=1)=>Math.max(a,Math.min(b,v));
  const cache=new WeakMap();
  function plan(grid,duration=80,tempo=100,phase=0){
    const bpm=clamp(grid?.bpm||tempo||100,40,240),period=60/bpm;
    const beats=grid?.beats||Array.from({length:Math.ceil(duration/period)},(_,i)=>phase+i*period);
    if(grid&&cache.get(grid)?.duration===duration)return cache.get(grid);
    const shots=[];let previous=.6;
    for(let i=0;i<beats.length&&beats[i]<duration;i+=16){
      const values=grid?.energy?.slice(i,i+16)||[.6],energy=values.reduce((a,b)=>a+b,0)/values.length;
      const rise=energy-previous,kind=rise>.09?'detail':rise<-.09?'release':'wide';
      shots.push({start:i?beats[i]:0,end:Math.min(duration,beats[i+16]??duration),kind,energy,transition:'cut',zoom:kind==='detail'?1.12:1.015});previous=energy;
    }
    const result={shots,beats,period,duration};if(grid)cache.set(grid,result);return result;
  }
  function sample(time,grid,duration=80,tempo=100,phase=0){
    const p=plan(grid,duration,tempo,phase),shot=p.shots.find(s=>time<s.end)||p.shots.at(-1);
    return{...shot,progress:clamp((time-shot.start)/(shot.end-shot.start))};
  }
  function render(ctx,w,h,time,source,grid,options={}){
    const sw=source.videoWidth||source.width,sh=source.videoHeight||source.height;if(!sw||!sh)return null;
    const q=sample(time,grid,options.duration||80,options.bpm,options.phase);
    const progress=q.kind==='release'?1-q.progress:q.progress,zoom=1+(q.zoom-1)*(progress*progress*(3-2*progress));
    const scale=Math.min(w/sw,h/sh)*zoom,dw=sw*scale,dh=sh*scale;
    ctx.save();ctx.fillStyle='#08090d';ctx.fillRect(0,0,w,h);ctx.drawImage(source,(w-dw)/2,(h-dh)/2,dw,dh);ctx.restore();return q;
  }
  window.LMFRAMESMONTAGE={plan,sample,render};
})();
