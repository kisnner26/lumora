import assert from 'node:assert/strict';
import { servidor, abrir, BASE } from './lib.mjs';
const srv=await servidor(),{b,p,errores}=await abrir();
try {
  await p.goto(BASE+'/index.html',{waitUntil:'domcontentloaded'});
  await p.waitForFunction(()=>window.RISO?.fabula);
  const result=await p.evaluate(()=>{
    const C=RISO.fabula,lines=[{t:0,text:'I remember your portrait'},{t:6,text:'flowers in the garden'},{t:12,text:'we wait together'},{t:18,text:'the ocean takes us home'},{t:24,text:'a book behind the door'}];
    const book=C.compile(lines,'una canción'),again=C.compile(lines,'una canción');
    const cv=document.createElement('canvas');cv.width=1280;cv.height=720;
    const c=cv.getContext('2d');
    let images=[];
    for(const time of [3,9,15,21,27]){C.render(c,1280,720,time,{key:'una canción',lines,text:lines[Math.floor(time/6)].text,title:'el retrato',reduced:true});images.push(cv.toDataURL());}
    const repeat=()=>{C.render(c,1280,720,9,{key:'una canción',lines,text:'flowers in the garden',reduced:true});return cv.toDataURL();};
    const a=repeat(),z=repeat();
    C.render(c,1280,720,10,{key:'una canción',lines,text:'flowers in the garden',reduced:true});
    const still=a===cv.toDataURL();
    C.render(c,1280,720,10,{key:'una canción',lines,text:'flowers in the garden',reduced:false});
    const moving=a!==cv.toDataURL();
    return {stable:JSON.stringify(book)===JSON.stringify(again),places:book.beats.map(v=>v.place),carry:C.at(book,15).chapter===C.at(book,9).chapter,changed:C.compile(lines,'otra canción').seed!==book.seed,unique:new Set(images).size,repeat:a===z,still,moving,pages:C.cachedPages};
  });
  assert.equal(result.stable,true);assert.deepEqual(result.places.slice(0,2),['taller','jardin']);assert.equal(result.places[3],'mar');assert.equal(result.places[4],'torre');
  assert.equal(result.changed,true);assert.equal(result.unique,5);assert.equal(result.repeat,true);assert.equal(result.still,true);assert.equal(result.moving,true);assert.ok(result.pages<=2);
  await p.evaluate(()=>toggleSettings(true));
  const button=p.locator('[data-key="clip"] [data-v="fabula"]');
  await button.focus();await p.keyboard.press('Enter');
  assert.equal(await p.evaluate(()=>CFG.clip),'fabula');
  assert.equal(await button.getAttribute('aria-pressed'),'true');
  assert.equal(await p.evaluate(()=>JSON.parse(localStorage.getItem('tc_cfg')).clip),'fabula');
  assert.match(await p.locator('#settings h2').evaluate(el=>getComputedStyle(el).fontFamily), /Iowan/);
  assert.equal(await p.locator('[data-row=fxCine]').isVisible(), false);
  await p.evaluate(()=>RISOAJ.preview());
  await p.locator('#settings').screenshot({path:'/tmp/lumora-fabula-ajustes.png'});
  await p.evaluate(()=>{
    toggleSettings(false);HOME.hide();ext.st.state='paused';ext.on=false;
    IN.lines=[{t:0,text:'I remember your portrait'},{t:6,text:'flowers in the garden'}];IN.off=0;IN.show=true;
    proc.title='el retrato';proc.artist='lumora';proc.dur=120;T=9;mode='proc';paused=true;
    const previous=RISO.stage.frame; RISO.stage.frame=()=>{throw Error('fábula entró en risografía');};
    try { document.getElementById('hud').classList.add('show');RISOCLIP.frame(.016); REC.canvas.width=720;REC.canvas.height=1280;composeFrame(); } finally {RISO.stage.frame=previous;}
  });
  await p.screenshot({path:'/tmp/lumora-fabula-player.png'});
  assert.equal(await p.evaluate(()=>RISO.fabula.book.beats.length),2);
  assert.equal(await p.evaluate(()=>!!RISOCLIP.err),false);
  await p.evaluate(()=>{
    const cv=document.createElement('canvas');cv.id='fabulaQA';cv.width=1440;cv.height=900;
    cv.style.cssText='position:fixed;inset:0;width:100%;height:100%;z-index:999999';document.body.append(cv);
    RISO.fabula.render(cv.getContext('2d'),1440,900,3,{key:'el retrato',title:'el retrato',text:'lo que amamos encuentra otra forma de quedarse',lines:[{t:0,text:'I remember your portrait'}],reduced:true});
  });
  await p.locator('#fabulaQA').screenshot({path:'/tmp/lumora-fabula-desktop.png'});
  await p.setViewportSize({width:390,height:844});
  await p.evaluate(()=>{const cv=document.querySelector('#fabulaQA');cv.width=390;cv.height=844;RISO.fabula.render(cv.getContext('2d'),390,844,10,{key:'el jardín',text:'las flores guardan tu nombre',translation:'the flowers keep your name',lines:[{t:0,text:'flowers in the garden'}],reduced:true});});
  await p.locator('#fabulaQA').screenshot({path:'/tmp/lumora-fabula-mobile.png'});
  await p.evaluate(()=>{document.querySelector('#fabulaQA').remove();toggleSettings(true);});
  await p.locator('[data-key=clip] [data-v=riso]').click();
  assert.equal(await p.evaluate(()=>document.body.classList.contains('fabula')),false);
  assert.match(await p.locator('#settings h2').evaluate(el=>getComputedStyle(el).fontFamily),/Anybody/);
  assert.equal(await p.locator('[data-row=fxCine]').isVisible(),true);
  await p.evaluate(()=>{const cfg=JSON.parse(localStorage.getItem('tc_cfg'));cfg.clip='cuento';localStorage.setItem('tc_cfg',JSON.stringify(cfg));});
  await p.reload({waitUntil:'domcontentloaded'});
  await p.waitForFunction(()=>CFG.clip==='fabula'&&document.body.classList.contains('fabula'));
  assert.equal(await p.evaluate(()=>JSON.parse(localStorage.getItem('tc_cfg')).clip),'fabula');
  assert.deepEqual(errores,[]);
  console.log('fábula: capítulos, continuidad, semillas, caché, teclado, persistencia, integración y render: ok');
} finally {await b.close();srv.stop();}
