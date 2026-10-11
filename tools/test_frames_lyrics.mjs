import assert from 'node:assert/strict';
import {servidor,abrir,BASE} from './lib.mjs';
const srv=await servidor(),{b,p,errores}=await abrir();
try{
 await p.goto(BASE+'/index.html',{waitUntil:'domcontentloaded'});await p.waitForFunction(()=>window.LMFRAMESLYRICS);await p.evaluate(()=>document.fonts.ready);
 const result=await p.evaluate(()=>{
  const c=document.createElement('canvas');c.width=1280;c.height=720;const ctx=c.getContext('2d');
  const source=document.createElement('canvas');source.width=640;source.height=360;const s=source.getContext('2d');
  const grid={bpm:120,phase:0,energy:Array(100).fill(.8),strength:Array(100).fill(.9)};
  const options={lines:[{t:10,text:'bajo las luces seguimos bailando'},{t:15,text:'otro capítulo'}],translations:['under the lights we keep dancing',''],trMode:'ambas',size:1,style:'cine',source,grid,animate:true,flashes:true};
  function background(color){s.fillStyle=color;s.fillRect(0,0,640,360);s.fillStyle='#000';s.fillRect(0,0,240,360);}
  function frame(time,o={}){ctx.clearRect(0,0,1280,720);const q=LMFRAMESLYRICS.render(ctx,1280,720,time,{...options,...o});return {q,pixels:c.toDataURL()};}
  background('#00cfff');const cyan=frame(11),later=frame(12),repeat=frame(11),entry=frame(9.82);
  const noFlashes=frame(11,{flashes:false});background('#ff0055');const pink=frame(11);
  const reducedA=frame(11,{reduced:true}),reducedB=frame(12,{reduced:true}),stillA=frame(11,{animate:false}),stillB=frame(12,{animate:false});
  const hidden=frame(11,{show:false});
  const bright=LMFRAMESLYRICS.sense(source);background('#000');const dark=LMFRAMESLYRICS.sense(source);
  const sizes=[.7,1.6].map(size=>frame(11,{size}).q.layout.size);
  const translated=frame(11,{trMode:'es'}).q.layout;
  const offset=frame(11,{off:4}).q.index;
  const bounds=[];
  for(const [w,h] of [[320,180],[720,1280],[2560,1440]]){
   const l=LMFRAMESLYRICS.layout(ctx,w,h,'una historia muy larga con luces y sombras y palabras extraordinariamenteextensasquenuncadebensalirsedellienzo','a very long translated line',{size:1.6,style:'fabula'});
   bounds.push(l.width<=w*.8+.1&&l.total<=h*.29+.1);
  }
  return {deterministic:cyan.pixels===repeat.pixels,animated:cyan.pixels!==later.pixels,color:cyan.q.accent.toString()!==pink.q.accent.toString(),entry:entry.q.entry<cyan.q.entry,reduced:reducedA.pixels===reducedB.pixels,disabled:stillA.pixels===stillB.pixels,hidden:hidden.q===null,contrast:bright.brightness>dark.brightness,sizes,bounds,offset,translated:translated.rows.map(r=>r.text).join(' '),noFlashes:noFlashes.q.pulse,normal:cyan.q.pulse,accentLuma:pink.q.accent[0]*.2126+pink.q.accent[1]*.7152+pink.q.accent[2]*.0722};
 });
 assert.equal(result.deterministic,true);assert.equal(result.animated,true);assert.equal(result.color,true);assert.equal(result.entry,true);
 assert.equal(result.reduced,true);assert.equal(result.disabled,true);assert.equal(result.hidden,true);assert.equal(result.contrast,true);assert.ok(result.sizes[1]>result.sizes[0]);assert.ok(result.bounds.every(Boolean));assert.equal(result.offset,1);
 assert.equal(result.translated,'under the lights we keep dancing');assert.equal(result.noFlashes,0);assert.ok(result.normal>0);assert.ok(result.accentLuma>=185);assert.deepEqual(errores,[]);
 console.log('letras: entradas, ritmo, color del metraje, contraste, tamaños, traducción, desfase, seek, movimiento reducido y límites: ok');
}finally{await b.close();srv.stop();}
