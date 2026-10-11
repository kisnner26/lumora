// medición local reproducible: puente simulado, sin controlar reproductores ni luces reales.
import { servidor, abrir, mock, BASE, espera } from './lib.mjs';
const srv=await servidor(),{b,p,errores}=await abrir();
try {
 await mock('song=a&pos=20&state=paused');
 await p.goto(BASE+'/index.html',{waitUntil:'domcontentloaded'});
 await p.waitForFunction(()=>window.LMFRAMESLIGHT&&window.RISOCLIP&&ext.artUrl);
 await p.evaluate(()=>{HOME.hide();mode='proc';});
 const gpu=await p.evaluate(()=>{
  const source=document.createElement('canvas');source.width=3840;source.height=2160;
  const s=source.getContext('2d');s.fillStyle='#16a5d4';s.fillRect(0,0,3840,2160);s.fillStyle='#fff';s.fillRect(600,100,1000,1500);
  const target=document.createElement('canvas');target.width=1280;target.height=720;const c=target.getContext('2d'),samples=[];
  for(let i=0;i<24;i++){const start=performance.now();LMFRAMESLIGHT.render(c,1280,720,10+i*.016,source,{bpm:120,phase:0},{filter:'stipple'});c.getImageData(0,0,1,1);if(i>=4)samples.push(performance.now()-start);}
  samples.sort((a,b)=>a-b);return {medianMs:samples[Math.floor(samples.length/2)],p95Ms:samples[Math.floor(samples.length*.95)],backend:LMFRAMESLIGHT.backend};
 });
 await p.evaluate(()=>{toggleCover(true);CV.clock=true;CV.lyr='completa';cvPaint();window.__mutations=0;window.__coverObserver=new MutationObserver(records=>window.__mutations+=records.length);window.__coverObserver.observe(document.getElementById('cover'),{subtree:true,childList:true,characterData:true,attributes:true});});
 await espera(1600);
 const cover=await p.evaluate(()=>{window.__coverObserver.disconnect();return {mutations:window.__mutations};});
 console.log(JSON.stringify({gpu,cover,errors:errores}));
} finally {await b.close();srv.stop();}
