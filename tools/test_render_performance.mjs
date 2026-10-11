import assert from 'node:assert/strict';
import {servidor,abrir,mock,BASE,espera} from './lib.mjs';
const srv=await servidor(),{b,p,errores}=await abrir();
try{
 await p.addInitScript(()=>{
  window.__allocations=[];window.__updates=0;
  const proto=WebGLRenderingContext.prototype,allocate=proto.texImage2D,update=proto.texSubImage2D;
  proto.texImage2D=function(...args){if(args.length===9)window.__allocations.push([args[3],args[4]]);return allocate.apply(this,args);};
  proto.texSubImage2D=function(...args){window.__updates++;return update.apply(this,args);};
 });
 await mock('song=a&pos=20&state=paused');await p.goto(BASE+'/index.html',{waitUntil:'domcontentloaded'});
 await p.waitForFunction(()=>window.LMFRAMESLIGHT&&window.RISOCLIP&&ext.artUrl);
 const uploads=await p.evaluate(()=>{
  const source=document.createElement('canvas');source.width=3840;source.height=2160;const s=source.getContext('2d');s.fillStyle='#fff';s.fillRect(0,0,3840,2160);
  const target=document.createElement('canvas');target.width=1280;target.height=720;const c=target.getContext('2d');window.__allocations=[];window.__updates=0;
  const draw=()=>LMFRAMESLIGHT.render(c,1280,720,10,source,{bpm:120},{filter:'stipple'});
  draw();const first=window.__allocations.length;draw();draw();
  return {first,total:window.__allocations.length,allocations:window.__allocations,updates:window.__updates,backend:LMFRAMESLIGHT.backend,ink:LMFRAMESINK.backend};
 });
 assert.equal(uploads.backend,'webgl');assert.equal(uploads.ink,'webgl');assert.ok(uploads.first>=4);
 assert.equal(uploads.first,uploads.total,'no reasigna texturas del mismo tamaño');assert.ok(uploads.updates>=6);
 assert.ok(uploads.allocations.every(([w,h])=>w<=1280&&h<=1280),'no sube texturas 4k a filtros 720p');
 await p.evaluate(()=>{HOME.hide();mode='proc';CFG.clip='fabula';toggleCover(true);CV.style='minimo';CV.lyr='completa';cvPaint();});
 await p.waitForFunction(()=>RISOCLIP.suspended===true&&cvRaf!==0);
 await p.evaluate(()=>{CV.style='escena';cvPaint();});await p.waitForFunction(()=>RISOCLIP.suspended===false);
 await p.evaluate(()=>{CV.style='minimo';REC.on=true;cvPaint();});await p.waitForFunction(()=>RISOCLIP.suspended===false);
 await p.evaluate(()=>{REC.on=false;IN.lines=[{t:0,text:'primera línea'}];IN.tr=[];CV.listKey='';});
 await p.waitForFunction(()=>document.getElementById('cvList').textContent.includes('primera línea'));
 await p.evaluate(()=>{IN.lines[0].text='línea corregida';});await p.waitForFunction(()=>document.getElementById('cvList').textContent.includes('línea corregida'));
 await p.evaluate(()=>{Object.defineProperty(document,'hidden',{configurable:true,value:true});document.dispatchEvent(new Event('visibilitychange',{bubbles:true}));window.__lightTicks=0;window.__lightsTick=lightsTick;lightsTick=()=>{window.__lightTicks++;};});
 await espera(150);assert.equal(await p.evaluate(()=>cvRaf),0);assert.ok(await p.evaluate(()=>window.__lightTicks>0),'el ahorro visual conserva el servicio de luces');
 await p.evaluate(()=>{lightsTick=window.__lightsTick;delete document.hidden;document.dispatchEvent(new Event('visibilitychange',{bubbles:true}));});await p.waitForFunction(()=>cvRaf!==0);
 await p.evaluate(()=>toggleCover(false));assert.equal(await p.evaluate(()=>cvRaf),0);
 await p.waitForFunction(()=>RISOCLIP.suspended===false);
  await p.evaluate(()=>{HOME.show();mode='proc';});await p.waitForFunction(()=>RISOCLIP.suspended===true);
  await p.evaluate(()=>HOME.hide());await p.waitForFunction(()=>RISOCLIP.suspended===false);
 assert.deepEqual(errores,[]);
 console.log('rendimiento: texturas acotadas y reutilizadas, carátula sin dibujo oculto, escena y grabación conservadas, edición de letra, suspensión y reanudación: ok');
}finally{await b.close();srv.stop();}
