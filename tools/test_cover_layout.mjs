import assert from 'node:assert/strict';
import {servidor,abrir,mock,BASE} from './lib.mjs';
const srv=await servidor(),{b,p,errores}=await abrir(1680,1050);
try{
 await mock('song=a&pos=24&state=paused');await p.goto(BASE+'/index.html',{waitUntil:'domcontentloaded'});await p.waitForFunction(()=>window.LMCOVER&&window.ext?.artUrl);
 await p.evaluate(()=>{CFG.reduceMotion=true;toggleCover(true);mode='proc';IN.lines=[{t:0,text:'gimme, gimme (more), gimme (more), gimme, gimme (more)'},{t:40,text:'la ciudad guarda una carta para nosotros'}];IN.tr=['dame más, una vez más','the city keeps a letter for us'];IN.trMode='ambas';CV.tab='letra';CV.lyr='linea';});
 const failures=[];let cases=0;
 for(const size of [{width:1680,height:1050},{width:1024,height:768},{width:390,height:844}]){
  await p.setViewportSize(size);
  for(const theme of ['fabula','risografia'])for(const layout of ['editorial','centrado','inmersivo'])for(const style of ['difuminado','cassette','vinilo','cd'])for(const artSize of ['s','m','l']){
   const result=await p.evaluate(({theme,layout,style,artSize})=>{
    CFG.clip=theme==='fabula'?'fabula':'cine';document.body.classList.toggle('fabula',theme==='fabula');Object.assign(CV,{layout,style,size:artSize});cvPaint();
    const rect=el=>{const r=el.getBoundingClientRect();return{x:r.x,y:r.y,right:r.right,bottom:r.bottom,width:r.width,height:r.height};};
    const image=rect(document.getElementById('coverImg')),verse=rect(document.querySelector('.cv-line')),dock=rect(document.querySelector('.cv-player'));
    const inside=r=>r.x>=-1&&r.y>=-1&&r.right<=innerWidth+1&&r.bottom<=innerHeight+1;
    return{image:inside(image),dock:inside(dock),overlap:image.x<verse.right&&image.right>verse.x&&image.y<verse.bottom&&image.bottom>verse.y,bounds:{image,verse,dock}};
   },{theme,layout,style,artSize});cases++;
   if(!result.image||!result.dock||result.overlap)failures.push({size,theme,layout,style,artSize,...result});
  }
 }
 assert.equal(failures.length,0,JSON.stringify(failures.map(({size,theme,layout,style,artSize,bounds})=>({w:size.width,h:size.height,theme,layout,style,artSize,image:bounds.image,verse:bounds.verse}))));
 await p.setViewportSize({width:1680,height:1050});await p.evaluate(()=>{CFG.clip='fabula';document.body.classList.add('fabula');Object.assign(CV,{layout:'editorial',style:'cassette',size:'l',tab:'letra'});cvPaint();document.getElementById('cover').classList.add('menu');});
 const colors=await p.evaluate(()=>{const m=document.getElementById('cvMenu'),player=document.querySelector('.cv-player');return{menu:getComputedStyle(m).backgroundColor,player:getComputedStyle(player).backgroundColor,text:getComputedStyle(m.querySelector('.cv-type-range')).color};});
 assert.equal(colors.menu,'rgba(17, 20, 26, 0.96)');assert.equal(colors.player,'rgba(17, 20, 26, 0.91)');assert.equal(colors.text,'rgb(246, 241, 232)');
 assert.ok((await p.locator('[data-font=novela]').boundingBox()).height>=28);
 const menuBounds=await p.locator('#cvMenu').boundingBox(),verseBounds=await p.locator('.cv-line').boundingBox();assert.ok(verseBounds.x+verseBounds.width<=menuBounds.x);
 assert.equal(await p.locator('[data-font=novela]').evaluate(el=>getComputedStyle(el).backgroundColor),'rgba(0, 0, 0, 0)');
 await p.screenshot({path:'/tmp/lumora-cover-fixed-fabula.png'});
 await p.locator('#cvType-lineSize').fill('44');assert.equal(await p.evaluate(()=>CV.lineSize),44);
 await p.keyboard.press('Escape');assert.equal(await p.evaluate(()=>coverOpen),true);assert.equal(await p.locator('#cover').evaluate(el=>el.classList.contains('menu')),false);
 await p.setViewportSize({width:390,height:844});await p.locator('#cvMenuBtn').click();const bounds=await p.locator('#cvMenu').boundingBox();assert.ok(bounds.x>=0&&bounds.y>=0&&bounds.x+bounds.width<=390&&bounds.y+bounds.height<=844);
 await p.screenshot({path:'/tmp/lumora-cover-fixed-mobile.png'});
 assert.deepEqual(errores,[]);console.log(`carátula: ${cases} combinaciones de tema, composición, fondo, tamaño y ventana sin recortes ni solapamientos; menú legible y teclado: ok`);
}finally{await b.close();srv.stop();}
