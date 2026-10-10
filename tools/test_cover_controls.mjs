import assert from 'node:assert/strict';
import {servidor,abrir,mock,BASE} from './lib.mjs';
const srv=await servidor(),{b,p,errores}=await abrir(1680,1050);
try{
 await mock('song=a&pos=24&state=paused');await p.goto(BASE+'/index.html',{waitUntil:'domcontentloaded'});await p.waitForFunction(()=>window.LMCOVER&&window.ext?.artUrl);
 await p.evaluate(()=>{CFG.reduceMotion=true;toggleCover(true);mode='proc';IN.lines=[{t:0,text:'una carta bajo la lluvia'},{t:40,text:'volvemos a casa'}];IN.tr=[];IN.off=0;CV.lyr='linea';CV.tab='vista';cvPaint();});
 await p.locator('#cvMenuBtn').click();
 let cases=0;
 for(const viewport of [{width:1680,height:1050},{width:1024,height:768},{width:390,height:844}]){
  await p.setViewportSize(viewport);
  for(const layout of ['editorial','centrado','inmersivo'])for(const style of ['difuminado','vinilo','cd','cassette'])for(const lyr of ['linea','completa','no']){
   await p.evaluate(({layout,style,lyr})=>{Object.assign(CV,{layout,style,lyr,tab:'vista'});cvPaint();}, {layout,style,lyr});
   const widths=[];
   for(const size of ['s','m','l']){
    await p.locator(`#cvMenu button[data-size=${size}]`).click();
    assert.equal(await p.locator(`#cvMenu button[data-size=${size}]`).getAttribute('aria-pressed'),'true');
    assert.equal(await p.evaluate(()=>JSON.parse(localStorage.getItem('lm_cover2')).size),size);
    widths.push((await p.locator('#coverImg').boundingBox()).width);
   }
   assert.ok(widths[1]>widths[0]+10&&widths[2]>widths[1]+10,JSON.stringify({viewport,layout,style,lyr,widths}));
   await p.keyboard.press('Escape');
   const closed=[];
   for(const size of ['s','m','l']){await p.evaluate(size=>{CV.size=size;cvPaint();},size);closed.push((await p.locator('#coverImg').boundingBox()).width);}
   assert.ok(closed[0]<closed[1]&&closed[1]<closed[2],JSON.stringify({viewport,layout,style,lyr,closed}));
   await p.locator('#cvMenuBtn').click();cases++;
  }
 }
 await p.setViewportSize({width:1440,height:900});
 await p.evaluate(()=>{Object.assign(CV,{layout:'editorial',style:'minimo',lyr:'linea',tab:'vista',focus:false});cvPaint();});
 for(const [id,key] of [['cvBeat','beat'],['cvClockBtn','clock'],['cvPin','pin'],['cvReact','react'],['cvRing','ring'],['cvHolo','holo'],['cvDepth','depth'],['cvTrataBtn','trata']]){
  const before=await p.evaluate(key=>CV[key],key);await p.locator('#'+id).click();assert.equal(await p.evaluate(key=>CV[key],key),!before);assert.equal(await p.locator('#'+id).getAttribute('aria-pressed'),String(!before));
  if(key==='clock'||key==='ring')await p.locator(key==='clock'?'.cv-clock':'.cv-ring').waitFor({state:before?'hidden':'visible',timeout:3000});
  if(key==='holo')assert.equal(await p.locator('.cv-holo').evaluate(el=>Number(getComputedStyle(el).opacity)>0),!before);
  await p.locator('#'+id).click();assert.equal(await p.evaluate(key=>CV[key],key),before);
 }
 // todos los fondos deben responder a su botón y mantener el estado elegido.
 await p.locator('#cvMenu [data-tab=fondo]').click();
 for(const style of ['difuminado','ambiente','escena','minimo','vinilo','cassette','cd','estanteria','artista','universo']){
  await p.locator(`#cvMenu button[data-style=${style}]`).click();assert.equal(await p.locator('#cover').getAttribute('data-style'),style);assert.equal(await p.locator(`#cvMenu button[data-style=${style}]`).getAttribute('aria-pressed'),'true');
 }
 await p.evaluate(()=>{CV.style='minimo';cvPaint();});
 // el ancho debe responder también en móvil y el PNG debe respetar s/m/l.
 await p.setViewportSize({width:390,height:844});await p.locator('#cvMenu [data-tab=letra]').click();
 await p.locator('#cvType-lyricWidth').fill('28');const narrow=(await p.locator('.cv-line').boundingBox()).width;
 await p.locator('#cvType-lyricWidth').fill('44');assert.ok((await p.locator('.cv-line').boundingBox()).width>narrow+50);
 const images=await p.evaluate(()=>{const c=document.createElement('canvas');c.width=1280;c.height=720;return ['s','m','l'].map(size=>{CV.size=size;LMCOVER.render(c.getContext('2d'),1280,720);return c.toDataURL();});});assert.equal(new Set(images).size,3);
 await p.locator('[data-cv-action=context]').click();
 assert.equal(await p.locator('[data-cv-action=context]').getAttribute('aria-pressed'),'false');assert.equal(await p.locator('#cvNextVerse').isVisible(),false);
 await p.locator('#cvMenu [data-tab=diseno]').click();await p.locator('[data-cv-action=focus]').click();assert.equal(await p.locator('.covermeta').evaluate(el=>getComputedStyle(el).opacity),'0');
 assert.equal(await p.locator('[data-cv-action=focus]').evaluate(el=>getComputedStyle(el).color),'rgb(246, 241, 232)');
 await p.evaluate(()=>{IN.off=3;CV.lyr='completa';CV.layout='editorial';window.__seek='';ext.cmd=async cmd=>{window.__seek=cmd;};cvPaint();});await p.keyboard.press('Escape');await p.waitForFunction(()=>document.querySelectorAll('#cvList .cv-verse').length===2);
 await p.locator('#cvList .cv-verse').nth(1).focus();await p.keyboard.press('Enter');assert.equal(await p.evaluate(()=>window.__seek),'goto:36.85');
 await p.setViewportSize({width:1440,height:900});await p.evaluate(()=>{IN.off=0;Object.assign(CV,{layout:'editorial',style:'vinilo',lyr:'linea',focus:false,tab:'vista'});cvPaint();});
 for(const size of ['s','m','l']){await p.locator('#cvMenuBtn').click();await p.locator(`#cvMenu button[data-size=${size}]`).click();await p.keyboard.press('Escape');await p.screenshot({path:`/tmp/lumora-cover-size-${size}.png`});}
 assert.deepEqual(errores,[]);console.log(`carátula: s/m/l distintos en ${cases} vistas con menú abierto y cerrado; efectos, ancho móvil, exportación y desfase: ok`);
}finally{await b.close();srv.stop();}
