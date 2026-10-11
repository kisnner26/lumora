import assert from 'node:assert/strict';
import {servidor,abrir,mock,BASE} from './lib.mjs';
const srv=await servidor(),{b,p,errores}=await abrir(1440,900);
try{
 const range=await fetch(BASE+'/media/frames/gimme-more.mp4',{headers:{Range:'bytes=0-1'}});assert.equal(range.status,206);assert.equal((await range.arrayBuffer()).byteLength,2);
 await mock('song=gimme&pos=12&state=paused&src=music');await p.goto(BASE+'/index.html',{waitUntil:'domcontentloaded'});await p.waitForFunction(()=>window.LMFRAMES&&window.RISOCLIP&&ext.st.name==='Gimme More');
 await p.getByRole('button',{name:'lyric video',exact:true}).click();await p.waitForFunction(()=>!document.getElementById('home').classList.contains('on')&&mode==='proc');
 const detection=await p.evaluate(()=>[
  LMFRAMES.detect('Gimme More','Britney Spears'),LMFRAMES.detect('gimme more (remastered)','BRITNEY SPEARS'),
  LMFRAMES.detect('Gimme More (Remix)','Britney Spears'),LMFRAMES.detect('Gimme More','Britney Spears Tribute'),LMFRAMES.detect('Gimme More','otra persona')]);assert.deepEqual(detection,[true,true,false,false,false]);
 await p.evaluate(()=>{window.__time=12;ext.now=()=>window.__time;mode='proc';CFG.clip='fabula';proc.dur=251;IN.lines=[{t:0,text:'un recuerdo bajo las luces'},{t:35,text:'un recuerdo bajo las luces'},{t:40,text:'otro capítulo'},{t:80,text:'la historia continúa'}];IN.cuts=[0,35,80];IN.tr=['','a memory under the lights','',''];IN.show=true;IN.trMode='ambas';IN.off=0;});
 async function at(t,clip='fabula'){
  await p.evaluate(({t,clip})=>{window.__time=t;CFG.clip=clip;RISOCLIP.frame(.016);},{t,clip});
  if(t<80)await p.waitForFunction(t=>{RISOCLIP.frame(.016);const v=LMFRAMES.video;return v?.readyState>=2&&!v.seeking&&Math.abs(v.currentTime-t)<.08&&RISOCLIP.framesFootage&&(!LMFRAMES.boosted||LMFRAMES.editFailed||CFG.reduceMotion||v===LMFRAMES.editedVideo);},t);
  else await p.evaluate(()=>RISOCLIP.frame(.016));
 }
 await at(12);assert.equal(await p.evaluate(()=>ext.st.src),'music');assert.equal(await p.evaluate(()=>LMFRAMES.video.muted&&LMFRAMES.video.paused),true);
 const paused=await p.evaluate(()=>LMFRAMES.video.currentTime);await p.waitForTimeout(150);assert.equal(await p.evaluate(()=>LMFRAMES.video.currentTime),paused);
 await p.waitForFunction(()=>LMFRAMES.grid?.bpm>0);
 assert.equal(await p.locator('#lumoraFramesBar, #hudFrames').count(),0);
 assert.equal(await p.locator('#autFrames').isVisible(),false);
 await p.evaluate(()=>openAutor());await p.locator('#autFrames').click();assert.equal(await p.locator('#autFrames').getAttribute('aria-pressed'),'true');
 await p.evaluate(()=>closeAutor());assert.equal(await p.locator('#autFrames').isVisible(),false);
 await at(37,'cine');await p.locator('#c').screenshot({path:'/tmp/lumora-frames-gameplay.png'});
 // texto visible en píxeles y en exportación, con traducción, offset y tamaños.
 const lyrics=await p.evaluate(()=>{
   const c=document.createElement('canvas');c.width=1280;c.height=720;const g=c.getContext('2d'),calls=[];
   const fill=g.fillText.bind(g);g.fillText=(text,x,y)=>{calls.push({text,x,y,font:g.font});fill(text,x,y);};
   IN.show=false;LMFRAMES.before(g,1280,720,37);const plain=c.toDataURL();
   IN.show=true;LMFRAMES.before(g,1280,720,37);const text=c.toDataURL(),both=calls.splice(0);
   IN.trMode='es';LMFRAMES.before(g,1280,720,37);const spanish=calls.splice(0);
   IN.trMode='orig';CFG.lyricSize=1.5;LMFRAMES.before(g,1280,720,37);const large=calls.splice(0);
   IN.off=5;LMFRAMES.before(g,1280,720,37);const offset=calls.splice(0);IN.off=0;CFG.lyricSize=1;IN.trMode='ambas';
   REC.canvas.width=1280;REC.canvas.height=720;IN.show=false;composeFrame();const noText=REC.canvas.toDataURL();
   IN.show=true;composeFrame();const exported=REC.canvas.toDataURL();
   REC.canvas.width=720;REC.canvas.height=1280;composeFrame();
   return{changes:plain!==text,both,spanish,large,offset,exported:noText!==exported};
 });
 assert.equal(lyrics.changes,true);assert.equal(lyrics.exported,true);
 assert.ok(lyrics.both.some(c=>c.text==='un recuerdo bajo las luces'));assert.ok(lyrics.both.some(c=>c.text==='a memory under the lights'));
 assert.ok(lyrics.both.every(c=>c.y>=0&&c.y<720*.79));assert.deepEqual([...new Set(lyrics.spanish.map(c=>c.text))],['a memory under the lights']);
 assert.ok(parseFloat(lyrics.large[0].font.split(' ')[1])>parseFloat(lyrics.both[0].font.split(' ')[1]));assert.equal(lyrics.offset[0].text,'otro capítulo');
 const rendering=await p.evaluate(()=>{const c=document.createElement('canvas');c.width=320;c.height=180;const g=c.getContext('2d');const reset=()=>{g.fillStyle='#c25935';g.fillRect(0,0,320,180);g.fillStyle='#fff';g.fillRect(140,20,30,100);};reset();const plain=c.toDataURL();LMFRAMES.boostCanvas(g,320,180,37);const boost=c.toDataURL();reset();CFG.reduceMotion=true;LMFRAMES.boostCanvas(g,320,180,37);const quiet=c.toDataURL();CFG.reduceMotion=false;return{changes:plain!==boost,reduced:plain===quiet};});assert.deepEqual(rendering,{changes:true,reduced:true});
 const edit=await p.evaluate(()=>{const values=Array.from({length:80},(_,t)=>LMFRAMES.cue(t,113.32,.225));return {kinds:new Set(values.map(c=>c.kind)).size,repeat:JSON.stringify(LMFRAMES.cue(37,113.32,.225))===JSON.stringify(LMFRAMES.cue(37,113.32,.225))};});assert.equal(edit.kinds,4);assert.equal(edit.repeat,true);
 // la grabación hereda el metraje incluso cuando está seleccionado fábula.
 await at(37);const exported=await p.evaluate(()=>{REC.canvas.width=1280;REC.canvas.height=720;composeFrame();const d=rc.getImageData(0,0,1280,720).data;let n=0;for(let i=0;i<d.length;i+=16)if(d[i]+d[i+1]+d[i+2]>30)n++;return n;});assert.ok(exported>5000);
 await at(79.8);assert.equal(await p.evaluate(()=>RISOCLIP.framesFootage),true);
 for(const clip of ['fabula','cine']){await at(80,clip);assert.equal(await p.evaluate(()=>RISOCLIP.framesFootage),false);assert.equal(await p.evaluate(()=>LMFRAMES.video.paused),true);}
 await at(3);assert.ok(await p.evaluate(()=>Math.abs(LMFRAMES.video.currentTime-3)<.08));
 await mock('song=gimme&pos=3&state=playing&src=spotify');await p.waitForFunction(()=>ext.st.src==='spotify'&&ext.st.state==='playing');await at(3);await p.waitForFunction(()=>!LMFRAMES.video.paused);
 await p.evaluate(()=>toggleCover(true));await p.waitForFunction(()=>LMFRAMES.video.paused);await p.evaluate(()=>toggleCover(false));
 await mock('song=a&pos=20&state=paused');await p.waitForFunction(()=>ext.st.name==='Noche de Neón');await at(90);assert.equal(await p.evaluate(()=>LMFRAMES.video.paused),true);assert.equal(await p.evaluate(()=>RISOCLIP.framesFootage),false);
 // una fuente ausente deja activo el motor procedural.
 await p.route('**/media/frames/*.mp4',r=>r.abort());await mock('song=gimme&pos=12&state=paused');await p.reload({waitUntil:'domcontentloaded'});await p.waitForFunction(()=>window.LMFRAMES&&ext.st.name==='Gimme More');
 await p.getByRole('button',{name:'lyric video',exact:true}).click();await p.waitForFunction(()=>!document.getElementById('home').classList.contains('on'));await p.evaluate(()=>{mode='proc';CFG.clip='fabula';RISOCLIP.frame(.016);});await p.waitForFunction(()=>LMFRAMES.failed);assert.equal(await p.evaluate(()=>RISOCLIP.framesFootage),false);
 assert.equal(await p.evaluate(()=>localStorage.getItem('lm_frames_boost')),'1');assert.deepEqual(errores,[]);
 console.log('frames: música y spotify, detección exacta, pausa, seek, 80 s, ambos motores, boost, grabación, carátula y vídeo ausente: ok');
}finally{await b.close();srv.stop();}
