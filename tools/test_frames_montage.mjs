import assert from 'node:assert/strict';
import {writeFile} from 'node:fs/promises';
import {servidor,abrir,mock,BASE} from './lib.mjs';
const srv=await servidor(),{b,p,errores}=await abrir(1440,900);
try{
 await mock('song=gimme&pos=37&state=paused');await p.goto(BASE+'/index.html',{waitUntil:'domcontentloaded'});
 await p.waitForFunction(()=>window.LMFRAMESMONTAGE&&window.LMFRAMES&&ext.st.name==='Gimme More');
 await p.getByRole('button',{name:'lyric video',exact:true}).click();
 await p.evaluate(()=>{window.__time=37;ext.now=()=>window.__time;mode='proc';CFG.clip='fabula';IN.show=false;LMFRAMES.setBoost(true);});
 await p.waitForFunction(()=>{RISOCLIP.frame(.016);return LMFRAMES.grid?.strength?.length&&LMFRAMES.video?.readyState>=2&&!LMFRAMES.video.seeking&&Math.abs(LMFRAMES.video.currentTime-37)<.05;});
 const result=await p.evaluate(()=>{
  const M=LMFRAMESMONTAGE,grid=LMFRAMES.grid,plan=M.plan(grid,80),shots=plan.shots;
  const source=document.createElement('canvas');source.width=640;source.height=360;const s=source.getContext('2d');
  const gradient=s.createLinearGradient(0,0,640,360);gradient.addColorStop(0,'#d76633');gradient.addColorStop(.5,'#315588');gradient.addColorStop(1,'#b9bf9d');s.fillStyle=gradient;s.fillRect(0,0,640,360);
  for(let i=0;i<8;i++){s.fillStyle=i%2?'#151622':'#fff8e8';s.fillRect(i*80,30+i*20,36,150);}
  const canvas=document.createElement('canvas');canvas.width=640;canvas.height=360;const g=canvas.getContext('2d');
  const hashes=[],fractions=[],repeats=[],covered=new Set(),transitionPixels=[];
  const plain=s.getImageData(0,0,640,360).data;
  for(const shot of shots){
    const t=shot.start+(shot.end-shot.start)*.55;
    M.render(g,640,360,t,source,grid);const hash=canvas.toDataURL(),pixels=g.getImageData(0,0,640,360).data;let changed=0;
    for(let i=0;i<pixels.length;i+=4)if(Math.abs(pixels[i]-plain[i])+Math.abs(pixels[i+1]-plain[i+1])+Math.abs(pixels[i+2]-plain[i+2])>45)changed++;
    fractions.push(changed/(640*360));covered.add(M.sample(t,grid).kind);hashes.push(hash);
    M.render(g,640,360,79.9,source,grid);M.render(g,640,360,t,source,grid);repeats.push(hash===canvas.toDataURL());
    if(shot.index){M.render(g,640,360,shot.start+.03,source,grid);const start=canvas.toDataURL();M.render(g,640,360,shot.start+.20,source,grid);transitionPixels.push(start!==canvas.toDataURL());}
  }
  const gridQuiet={...grid,energy:grid.energy.map(()=>0),strength:grid.strength.map(()=>0)},gridLoud={...grid,energy:grid.energy.map(()=>1),strength:grid.strength.map(()=>1)};
  M.render(g,640,360,grid.beats[42]+.01,source,gridQuiet);const quiet=canvas.toDataURL();M.render(g,640,360,grid.beats[42]+.01,source,gridLoud);const responsive=quiet!==canvas.toDataURL();
  const alternate=M.plan(null,146,135,0);const other={end:alternate.shots.at(-1).end,period:alternate.period};
  // prueba de integración: el botón cambia toda la imagen decodificada, sin tocar su reloj.
  IN.show=false;LMFRAMES.setBoost(false);LMFRAMES.before(g,640,360,37);const raw=canvas.toDataURL(),at=LMFRAMES.video.currentTime;
  LMFRAMES.setBoost(true);LMFRAMES.before(g,640,360,37);const boosted=canvas.toDataURL();
  CFG.reduceMotion=true;LMFRAMES.before(g,640,360,37);const reduced=canvas.toDataURL();CFG.reduceMotion=false;
  // hoja de contacto con el mismo frame real: permite inspeccionar cada tratamiento.
  const sheet=document.createElement('canvas');sheet.width=1920;sheet.height=620;const c=sheet.getContext('2d');
  for(let i=0;i<M.looks.length;i++){
    const shot=shots.find(q=>q.kind===M.looks[i]),time=shot.start+(shot.end-shot.start)*.55;
    M.render(g,640,360,time,LMFRAMES.video,grid);
    const x=(i%4)*480,y=Math.floor(i/4)*310;c.drawImage(canvas,x,y,480,270);
    c.fillStyle='#111218';c.fillRect(x,y+270,480,40);c.fillStyle='#fff8ed';c.font='20px monospace';c.fillText(M.looks[i],x+15,y+297);
  }
  return{shots:shots.map(({start,end,kind,transition})=>({start,end,kind,transition})),fractions,repeats,covered:[...covered],unique:new Set(hashes).size,transitionPixels,responsive,other,
    integrated:raw!==boosted,reduced:raw===reduced,clock:at===LMFRAMES.video.currentTime,sheet:sheet.toDataURL()};
 });
 assert.ok(result.shots.length>=35);assert.equal(result.shots[0].start,0);assert.equal(result.shots.at(-1).end,80);
 for(let i=1;i<result.shots.length;i++)assert.equal(result.shots[i-1].end,result.shots[i].start);
 assert.equal(result.covered.length,8);assert.equal(new Set(result.shots.map(q=>q.transition)).size,5);
 assert.ok(result.fractions.every(v=>v>.20),'todos los planos deben modificar una parte sustancial de la imagen');
 assert.ok(result.repeats.every(Boolean),'los seeks deben reconstruir exactamente el montaje');assert.ok(result.transitionPixels.every(Boolean));
 assert.ok(result.unique>30);assert.equal(result.responsive,true);assert.equal(result.integrated,true);assert.equal(result.reduced,true);assert.equal(result.clock,true);
 assert.equal(result.other.end,146);assert.equal(result.other.period,60/135);
 await writeFile('/tmp/lumora-frames-montage.png',Buffer.from(result.sheet.split(',')[1],'base64'));
 // el compositor también se conecta al otro motor con metraje incrustado.
 await mock('song=grief&pos=40&state=paused');await p.waitForFunction(()=>ext.st.name==='Stalemate (Grief)');
 await p.evaluate(()=>{window.__time=40;CFG.clip='cine';RISOCLIP.frame(.016);});
 await p.waitForFunction(()=>{RISOCLIP.frame(.016);return RISO.grief.current?.ready&&!RISO.grief.current.seeking;});
 const grief=await p.evaluate(()=>{
  const c=document.createElement('canvas');c.width=640;c.height=360;const g=c.getContext('2d');
  const opts={duration:146.365,playing:false,text:'letra sobre el montaje'};
  LMFRAMES.setBoost(false);RISO.grief.render(g,640,360,40,opts);const plain=c.toDataURL();
  const text=[];const fill=g.fillText.bind(g);g.fillText=(t,...args)=>{text.push(t);fill(t,...args);};
  LMFRAMES.setBoost(true);RISO.grief.render(g,640,360,40,opts);
  return{changed:plain!==c.toDataURL(),lyrics:text.includes(opts.text)};
 });assert.deepEqual(grief,{changed:true,lyrics:true});
 assert.deepEqual(errores,[]);
 console.log(`montaje: ${result.shots.length} tomas, 8 tratamientos, 5 transiciones, energía, cobertura completa, seeks deterministas, integración y movimiento reducido: ok`);
}finally{await b.close();srv.stop();}
