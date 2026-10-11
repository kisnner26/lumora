import assert from 'node:assert/strict';
import {servidor,abrir,mock,BASE} from './lib.mjs';
const srv=await servidor(),{b,p,errores}=await abrir();
try{
 await p.goto(BASE+'/index.html',{waitUntil:'domcontentloaded'});await p.waitForFunction(()=>window.LMFRAMESINK);
 const result=await p.evaluate(()=>{
  const source=document.createElement('canvas');source.width=640;source.height=360;const s=source.getContext('2d');
  s.fillStyle='#000';s.fillRect(0,0,640,360);s.fillStyle='#fff';s.fillRect(80,80,200,200);s.fillStyle='#00cfff';s.fillRect(400,140,120,80);
  const c=document.createElement('canvas');c.width=640;c.height=360;const ctx=c.getContext('2d'),grid={bpm:120,phase:0};
  function frame(filter,options={}){ctx.drawImage(source,0,0);const q=LMFRAMESINK.render(ctx,640,360,6,source,grid,{filter,...options});return {q,data:Array.from(ctx.getImageData(0,0,640,360).data),url:c.toDataURL()};}
  const modes=LMFRAMESINK.modes.slice(1),frames=modes.map(m=>frame(m)),again=frame('stipple'),fallback=modes.map(m=>frame(m,{forceFallback:true}));
  const dots=frames[1].data,pixels=frames[3].data;
  function coverage(data){let white=0,black=0;for(let y=90;y<270;y++)for(let x=90;x<270;x++){if(data[(y*640+x)*4]>128)white++;else black++;}return {white,black};}
  const empty=frame('pixels',{reveal:0}),partial=frame('pixels',{reveal:.5}),full=frames[3];
  const count=d=>d.filter((v,i)=>i%4===0&&v>128).length;
  const original=s.getImageData(0,0,640,360).data;
  const quiet=frame('sketch',{flashes:false}),reduced=frame('sketch',{reducedMotion:true});
  const schedule=Array.from({length:128},(_,i)=>LMFRAMESINK.sample(i/2,grid));
  const seen=[...new Set(schedule.filter(q=>q.mix>.9).map(q=>q.mode))];
  const monochrome=frames.filter((_,i)=>i!==2).every(f=>f.data.every((v,i)=>i%4!==0||(v===f.data[i+1]&&v===f.data[i+2])));
  return {backend:LMFRAMESINK.backend,unique:new Set(frames.map(f=>f.url)).size,deterministic:again.url===frames[1].url,dots:coverage(dots),pixels:coverage(pixels),monochrome,reveal:[count(empty.data),count(partial.data),count(full.data)],quiet:quiet.data.every((v,i)=>v===original[i]),reduced:reduced.data.every((v,i)=>v===original[i]),seen,rest:LMFRAMESINK.sample(1,grid).mix,transition:LMFRAMESINK.sample(4.3,grid).mix,fallback:fallback.every((f,i)=>f.url!==frame('color').url&&f.q.mode===modes[i])};
 });
 assert.equal(result.backend,'webgl');assert.equal(result.unique,4);assert.equal(result.deterministic,true);assert.equal(result.monochrome,true);
 for(const shape of [result.dots,result.pixels]){assert.ok(shape.white>100);assert.ok(shape.black>100);}
 assert.ok(result.reveal[0]<result.reveal[1]&&result.reveal[1]<result.reveal[2]);assert.equal(result.quiet,true);assert.equal(result.reduced,true);assert.equal(result.rest,0);assert.ok(result.transition>0&&result.transition<1);assert.equal(result.fallback,true);assert.equal(result.seen.length,4);assert.deepEqual(errores,[]);
 await mock('song=gimme&pos=23.52&state=paused');await p.goto(BASE+'/index.html',{waitUntil:'domcontentloaded'});
 await p.waitForFunction(()=>window.LMFRAMES&&ext.st.name==='Gimme More');await p.getByRole('button',{name:'lyric video',exact:true}).click();
 await p.evaluate(()=>{window.__inkTime=23.52;ext.now=()=>window.__inkTime;CFG.clip='cine';CFG.reduceMotion=false;CFG.flashes=true;LMFRAMES.setBoost(true);IN.show=false;IN.off=0;});
 await p.waitForFunction(()=>{RISOCLIP.frame(.016);const v=LMFRAMES.video;return LMFRAMES.grid&&v===LMFRAMES.editedVideo&&v.readyState>=2&&!v.seeking&&Math.abs(v.currentTime-window.__inkTime)<.05;});
 const exported=await p.evaluate(()=>{
  const c=document.createElement('canvas');c.width=640;c.height=360;const ctx=c.getContext('2d');LMFRAMES.before(ctx,640,360,window.__inkTime);const expected=c.toDataURL();
  const d=ctx.getImageData(0,0,640,360).data;let brightness=0;for(let i=0;i<d.length;i+=4)brightness+=d[i]/255;
  REC.canvas.width=640;REC.canvas.height=360;composeFrame();const same=REC.canvas.toDataURL()===expected;
  IN.show=true;IN.lines=[{t:22,text:'el nivel se dibuja con luz'}];IN.tr=['the level is drawn with light'];IN.trMode='ambas';
  const texts=[],fill=rc.fillText.bind(rc);rc.fillText=(text,...args)=>{texts.push(text);fill(text,...args);};composeFrame();
  return {same,brightness:brightness/(640*360),texts,withText:REC.canvas.toDataURL()!==expected};
 });
 assert.equal(exported.same,true);assert.ok(exported.brightness>.6);assert.equal(exported.withText,true);assert.ok(exported.texts.includes('el nivel se dibuja con luz'));assert.ok(exported.texts.includes('the level is drawn with light'));assert.deepEqual(errores,[]);
 console.log('filtros: cuatro tratamientos, geometría, blanco y negro, puntos, píxeles progresivos, reloj, descanso, fundidos, fallback y accesibilidad: ok');
}finally{await b.close();srv.stop();}
