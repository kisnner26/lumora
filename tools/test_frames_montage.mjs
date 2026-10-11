import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {execFileSync} from 'node:child_process';
import {servidor,abrir,mock,BASE} from './lib.mjs';
const profile=JSON.parse(await readFile(new URL('../media/frames/gimme-more-edit.json',import.meta.url)));
assert.equal(profile.schema,2);assert.equal(profile.shots[0].start,0);assert.equal(profile.shots.at(-1).end,80);
for(let i=1;i<profile.shots.length;i++)assert.equal(profile.shots[i-1].end,profile.shots[i].start);
assert.ok(profile.shots.some(s=>s.rate===0));assert.ok(profile.shots.some(s=>s.rate>1));assert.ok(profile.shots.some(s=>s.rate>0&&s.rate<1));
assert.ok(new Set(profile.shots.map(s=>(s.end-s.start).toFixed(2))).size>8);
assert.ok(profile.shots.filter(s=>s.transition!=='cut').length<profile.sections.length);
const probe=JSON.parse(execFileSync('ffprobe',['-v','error','-show_streams','-of','json','media/frames/gimme-more-boost.mp4']));
assert.equal(probe.streams.length,1);assert.equal(probe.streams[0].codec_name,'h264');assert.equal(probe.streams[0].nb_frames,'2400');assert.equal(+probe.streams[0].duration,80);
const srv=await servidor(),{b,p,errores}=await abrir(1440,900);
try{
 const range=await fetch(BASE+'/media/frames/gimme-more-boost.mp4',{headers:{Range:'bytes=20-21'}});assert.equal(range.status,206);assert.equal((await range.arrayBuffer()).byteLength,2);
 await mock('song=gimme&pos=37&state=paused');await p.goto(BASE+'/index.html',{waitUntil:'domcontentloaded'});
 await p.waitForFunction(()=>window.LMFRAMES&&ext.st.name==='Gimme More');await p.getByRole('button',{name:'lyric video',exact:true}).click();
 await p.evaluate(()=>{window.__time=37;ext.now=()=>window.__time;mode='proc';CFG.clip='fabula';IN.show=false;});
 async function at(time,boost,reduced=false){
  await p.evaluate(({time,boost,reduced})=>{window.__time=time;LMFRAMES.setBoost(boost);CFG.reduceMotion=reduced;RISOCLIP.frame(.016);},{time,boost,reduced});
  await p.waitForFunction(({time,boost,reduced})=>{RISOCLIP.frame(.016);const v=LMFRAMES.video;return v?.readyState>=2&&!v.seeking&&Math.abs(v.currentTime-time)<.05&&v===(boost&&!reduced&&!LMFRAMES.editFailed?LMFRAMES.editedVideo:LMFRAMES.originalVideo);},{time,boost,reduced});
 }
 async function pixels(){return p.evaluate(()=>{const c=document.createElement('canvas');c.width=640;c.height=360;LMFRAMES.before(c.getContext('2d'),640,360,window.__time);return c.toDataURL();});}
 await at(37,false);const original=await pixels();await at(37,true);const edited=await pixels();assert.notEqual(edited,original);
 assert.equal(await p.evaluate(()=>LMFRAMES.video.muted&&LMFRAMES.video.paused&&LMFRAMES.video.playbackRate===1),true);
 await p.waitForFunction(()=>LMFRAMES.editPlan?.schema===2);
 await at(12,true);await at(37,true);assert.equal(await pixels(),edited,'buscar reconstruye el mismo frame del montaje');
 await at(37,true,true);assert.equal(await pixels(),original,'movimiento reducido recupera el original');
 await at(37,true);const exported=await p.evaluate(()=>{
   IN.show=true;IN.lines=[{t:35,text:'la edición sigue la música'}];IN.tr=['the edit follows the music'];IN.trMode='ambas';IN.off=0;
   const texts=[],fill=rc.fillText.bind(rc);rc.fillText=(text,...args)=>{texts.push(text);fill(text,...args);};
   REC.canvas.width=1280;REC.canvas.height=720;composeFrame();
   return{texts,pixels:REC.canvas.toDataURL()};
 });assert.ok(exported.texts.includes('la edición sigue la música'));assert.ok(exported.texts.includes('the edit follows the music'));
 await p.locator('#c').screenshot({path:'/tmp/lumora-directed-player.png'});
 await at(79.8,true);await p.evaluate(()=>{window.__time=80;RISOCLIP.frame(.016);});
 assert.equal(await p.evaluate(()=>RISOCLIP.framesFootage),false);assert.equal(await p.evaluate(()=>LMFRAMES.video.paused),true);
 await mock('song=gimme&pos=3&state=playing&src=spotify');await p.waitForFunction(()=>ext.st.src==='spotify'&&ext.st.state==='playing');await at(3,true);
 await p.waitForFunction(()=>!LMFRAMES.editedVideo.paused&&LMFRAMES.originalVideo.paused);
 await p.evaluate(()=>toggleCover(true));await p.waitForFunction(()=>LMFRAMES.editedVideo.paused&&LMFRAMES.originalVideo.paused);
 // un render ausente recupera el gameplay, sin volver a la vieja cadena de efectos.
 await p.route('**/media/frames/gimme-more-boost.mp4',r=>r.abort());await mock('song=gimme&pos=12&state=paused');await p.reload({waitUntil:'domcontentloaded'});
 await p.waitForFunction(()=>window.LMFRAMES&&ext.st.name==='Gimme More');await p.getByRole('button',{name:'lyric video',exact:true}).click();
 await p.evaluate(()=>{window.__time=12;ext.now=()=>window.__time;CFG.clip='fabula';LMFRAMES.setBoost(true);});
 await p.waitForFunction(()=>{RISOCLIP.frame(.016);return LMFRAMES.editFailed&&RISOCLIP.framesFootage&&LMFRAMES.video===LMFRAMES.originalVideo;});
 assert.deepEqual(errores,[]);
 console.log('montaje dirigido: retiming real, congelados, 80 s sin audio, selección de fuente, seek, letras, grabación, spotify, movimiento reducido y fallback: ok');
}finally{await b.close();srv.stop();}
