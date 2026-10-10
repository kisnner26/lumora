import assert from 'node:assert/strict';
import {servidor,abrir,BASE} from './lib.mjs';
const srv=await servidor(),{b,p,errores}=await abrir(1440,960);
try{
 await p.goto(BASE+'/index.html',{waitUntil:'domcontentloaded'});await p.waitForFunction(()=>window.RISO?.fabulaDirector);
 const result=await p.evaluate(()=>{
  const F=RISO.fabula,D=RISO.fabulaDirector;
  const lines=[{t:0,text:'I remember the photograph in this room'},{t:9,text:'I open the door'},{t:18,text:'we walk into the city'},{t:27,text:'I give you a letter'},{t:36,text:'take my hand'},{t:46,text:'the bridge keeps our promise'},{t:58,text:'we wait beside the ocean'},{t:72,text:'come back to the city'},{t:84,text:'I remember the photograph'},{t:98,text:'the garden will grow again'},{t:112,text:'take my hand'},{t:128,text:'back home behind the door'},{t:140,text:'the letter stays with you'}];
  const opts={key:'el viaje de una carta',title:'el viaje de una carta',artist:'Lana Del Rey',lines,duration:152,cuts:[0,18,46,72,98,128],reduced:false};
  const book=F.compile(lines,opts.key,opts),give=F.at(book,27),before=D.pose(give,27,false),after=D.pose(give,35,false);
  const city=book.timeline.filter(v=>v.place==='ciudad'),fixedCity=new Set(city.map(v=>v.environmentSeed)).size===1;
  const cv=document.createElement('canvas');cv.width=720;cv.height=480;const c=cv.getContext('2d',{willReadFrequently:true});
  const image=time=>{F.render(c,720,480,time,{...opts,text:lines.findLast(l=>l.t<=time)?.text||''});return cv.toDataURL();};
  const atThirty=image(30),aPixels=c.getImageData(0,0,720,480).data;image(140);const samePng=atThirty===image(30),bPixels=c.getImageData(0,0,720,480).data;let diff=0,maxDelta=0;for(let i=0;i<aPixels.length;i++)if(aPixels[i]!==bPixels[i]){diff++;maxDelta=Math.max(maxDelta,Math.abs(aPixels[i]-bPixels[i]));}const seek=samePng||diff<100&&maxDelta<=1;
  const reducedOpts={...opts,reduced:true,text:'I give you a letter'};F.render(c,720,480,29,reducedOpts);const still=cv.toDataURL();F.render(c,720,480,30,reducedOpts);const reducedStable=still===cv.toDataURL();
  const sheet=document.createElement('canvas');sheet.id='story';sheet.width=1440;sheet.height=960;sheet.style.cssText='position:fixed;inset:0;z-index:999999;width:1440px;height:960px';document.body.append(sheet);const sc=sheet.getContext('2d');
  for(const [i,time] of [4,12,22,28,33,39,49,63,81,89,118,145].entries()){image(time);const x=i%4*360,y=Math.floor(i/4)*320;sc.drawImage(cv,x,y,360,240);sc.fillStyle='#ded0ac';sc.fillRect(x,y+240,360,80);sc.fillStyle='#302f28';sc.font='18px Georgia';const shot=F.at(F.book,time);sc.fillText(`${time}s · ${shot.place} · ${shot.action}`,x+12,y+272);sc.font='14px Georgia';sc.fillText(shot.camera,x+12,y+298);}
  return {diff,maxDelta,give:give.action,initialOwner:before.letterGiven,finalOwner:after.letterGiven,fixedCity,seek,reducedStable,places:[...new Set(book.timeline.map(v=>v.place))]};
 });
 assert.equal(result.give,'give');assert.equal(result.initialOwner,false);assert.equal(result.finalOwner,true);assert.equal(result.fixedCity,true);assert.equal(result.seek,true);assert.equal(result.reducedStable,true);
 await p.locator('#story').screenshot({path:'/tmp/lumora-fabula-story.png'});assert.deepEqual(errores,[]);console.log('fábula: secuencia completa, entrega, continuidad de escenario, búsqueda y movimiento reducido: ok');
}finally{await b.close();srv.stop();}
