import assert from 'node:assert/strict';
import {servidor,abrir,BASE} from './lib.mjs';
const srv=await servidor(),{b,p,errores}=await abrir();
try{
 await p.goto(BASE+'/index.html',{waitUntil:'domcontentloaded'});
 await p.waitForFunction(()=>window.LMFRAMESLIGHT);
 const result=await p.evaluate(()=>{
  const source=document.createElement('canvas');source.width=640;source.height=360;const s=source.getContext('2d');
  s.fillStyle='#000';s.fillRect(0,0,640,360);s.fillStyle='#fff';s.fillRect(90,90,10,180);s.fillStyle='#00dbff';s.fillRect(400,120,80,8);s.fillStyle='#ff0055';s.fillRect(400,240,80,8);
  const c=document.createElement('canvas');c.width=640;c.height=360;const ctx=c.getContext('2d');
  const grid={bpm:120,phase:0,energy:Array(100).fill(.8),strength:Array(100).fill(.9)};
  function frame(time,options={}){ctx.clearRect(0,0,640,360);ctx.drawImage(source,0,0);LMFRAMESLIGHT.render(ctx,640,360,time,source,grid,options);return ctx.getImageData(0,0,640,360).data;}
  const peak=frame(0),quiet=frame(.3),again=frame(0),other=frame(8),fallback=frame(0,{forceFallback:true});
  const diff=(a,b)=>a.reduce((n,v,i)=>n+Math.abs(v-b[i]),0)/a.length;
  const at=(d,x,y)=>Array.from(d.slice((y*640+x)*4,(y*640+x)*4+3));
  const original=s.getImageData(0,0,640,360).data;
  const noMotion=frame(0,{reducedMotion:true});
  return {backend:LMFRAMESLIGHT.backend,deterministic:diff(peak,again),rhythm:diff(peak,quiet),palette:diff(peak,other),halo:at(peak,85,180),black:at(peak,300,300),split:at(peak,89,180),fallback:diff(fallback,original),reduced:diff(noMotion,original),noFlashes:LMFRAMESLIGHT.sample(0,grid,{flashes:false}).pulse};
 });
 assert.equal(result.backend,'webgl');assert.equal(result.deterministic,0);assert.ok(result.rhythm>.1);assert.ok(result.palette>.1);
 assert.ok(Math.max(...result.halo)>5,'bloom ilumina alrededor del objeto');assert.ok(Math.max(...result.black)<3,'conserva los negros');
 assert.ok(Math.max(...result.split)-Math.min(...result.split)>10,'separa los canales en el borde');
 assert.ok(result.fallback>.05);assert.equal(result.reduced,0);assert.equal(result.noFlashes,0);
 await p.evaluate(()=>{
  const source=document.createElement('canvas');source.width=1280;source.height=720;const s=source.getContext('2d');s.fillStyle='#000';s.fillRect(0,0,1280,720);s.fillStyle='#00cfff';s.fillRect(100,100,300,8);s.fillStyle='#ff1760';s.fillRect(800,480,260,8);
  const c=document.createElement('canvas');c.width=1280;c.height=720;const ctx=c.getContext('2d');ctx.drawImage(source,0,0);LMFRAMESLIGHT.render(ctx,1280,720,16,source,null);c.id="lightTest";c.style.cssText="position:fixed;inset:0;z-index:99999";document.body.append(c);
 });
 await p.locator('#lightTest').screenshot({path:'/tmp/lumora-light-neon.png'});
 assert.deepEqual(errores,[]);console.log('iluminación: bloom selectivo, aberración, paletas, ritmo, seek determinista, canvas fallback y accesibilidad: ok',result);
}finally{await b.close();srv.stop();}
