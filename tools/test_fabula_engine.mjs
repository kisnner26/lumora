import assert from 'node:assert/strict';
import {servidor,abrir,BASE} from './lib.mjs';
const srv=await servidor(),{b,p,errores}=await abrir(1440,960);
try{
 await p.goto(BASE+'/index.html',{waitUntil:'domcontentloaded'});await p.waitForFunction(()=>RISO?.fabulaWorld);
 const result=await p.evaluate(()=>{
  const F=RISO.fabula,W=RISO.fabulaWorld;
  const lines=Array.from({length:48},(_,i)=>({t:i*4,text:i%3?'Gimme, gimme more':'I want more'}));
  const book=F.compile(lines,'britney|gimme more',{duration:240,artist:'Britney Spears',cuts:[0,32,64,96,128,160,192,224]});
  const instrumental=F.compile([],'instrumental',{duration:180});
  const overrides=F.compile([{t:0,text:'a flower for you'}],'editor',{edits:{lines:{0:{action:'give',camera:'detail',motif:'carta_abierta'}}}});
  const cv=document.createElement('canvas');cv.width=640;cv.height=360;const c=cv.getContext('2d');
  const image=t=>{F.render(c,640,360,t,{lines,key:'regression',duration:240,reduced:true,text:'more'});return cv.toDataURL();};
  const retina=document.createElement('canvas');retina.width=1280;retina.height=720;const retinaContext=retina.getContext('2d');F.render(retinaContext,640,360,53,{lines,key:'retina',reduced:true});const retinaFilled=retinaContext.getImageData(1279,719,1,1).data[3]===255;
  const prior={live:AUD.live,level:AUD.level};AUD.live=true;AUD.level=0;const audioOpts={lines:[{t:0,text:'dance'}],key:'audio',reduced:false};F.render(c,640,360,3,audioOpts);const quiet=cv.toDataURL();AUD.level=1;F.render(c,640,360,3,audioOpts);const audioReactive=quiet!==cv.toDataURL();Object.assign(AUD,prior);
  const textPositions=[],originalText=c.fillText;c.fillText=function(text,x,y,...rest){textPositions.push(y);return originalText.call(this,text,x,y,...rest);};F.render(c,640,360,3,{lines:[{t:0,text:'dance'}],key:'safe',safeBottom:100,text:'the story stays above the player',translation:'la historia permanece sobre el reproductor',reduced:true});c.fillText=originalText;const lyricsClear=textPositions.length>0&&Math.max(...textPositions)<260;
  const a=image(53),beforePixels=c.getImageData(0,0,640,360).data;image(133);image(11);const samePng=a===image(53),afterPixels=c.getImageData(0,0,640,360).data;let diff=0,maxDelta=0;for(let i=0;i<beforePixels.length;i+=4)if(beforePixels[i]!==afterPixels[i]||beforePixels[i+1]!==afterPixels[i+1]||beforePixels[i+2]!==afterPixels[i+2]){diff++;for(let ch=0;ch<4;ch++)maxDelta=Math.max(maxDelta,Math.abs(beforePixels[i+ch]-afterPixels[i+ch]));}
  const repeat=samePng||diff<=16&&maxDelta<=1; // tolerancia de rasterización al volver a crear un fondo expulsado de la caché.
  const variants=new Set([3,27,51,75,99,123,147,171,195,219].map(image)).size;
  const worldImages=new Set();const allWorlds=[];for(const place of F.places){try{c.save();c.setTransform(.4,0,0,.4,0,0);W.background(c,book,{place,seed:17});W.setPieces(c,book,{place,seed:17},4);W.motion(c,book,{place,seed:17},4,.5);c.restore();worldImages.add(cv.toDataURL());}catch(e){allWorlds.push(place+': '+e.message);}}
  const allProps=[];for(const id of Object.keys(RISO.props.DEFS)){try{c.clearRect(0,0,640,360);W.prop(c,id,320,180,.5,book.palette,1,0);}catch(e){allProps.push(id+': '+e.message);}}
  const sheet=document.createElement('canvas');sheet.id='sheet';sheet.width=1440;sheet.height=960;sheet.style.cssText='position:fixed;inset:0;width:1440px;height:960px;z-index:999999';document.body.append(sheet);
  const sc=sheet.getContext('2d'),terms=['portrait','garden','ocean','book','forest','city','dance','bridge','train','desert','stars','bed'];
  for(let i=0;i<terms.length;i++){const x=(i%4)*360,y=Math.floor(i/4)*320;
   cv.width=720;cv.height=560;F.render(c,720,560,3,{key:'atlas',artist:'Britney Spears',lines:[{t:0,text:terms[i]}],text:terms[i],reduced:true});
   sc.drawImage(cv,x,y,360,280);sc.fillStyle='#ded0ac';sc.fillRect(x,y+280,360,40);sc.fillStyle='#302f28';sc.font='20px Georgia';sc.fillText(terms[i],x+15,y+306);
  }
  return {diff,maxDelta,audioReactive,lyricsClear,retinaFilled,repeat,variants,props:Object.keys(RISO.props.DEFS).length,allProps,worlds:F.places.length,distinctWorlds:worldImages.size,allWorlds,places:new Set(book.timeline.map(v=>v.place)).size,shots:new Set(book.timeline.map(v=>v.seed)).size,instrumental:new Set(instrumental.timeline.map(v=>v.place)).size,override:F.at(overrides,0)};
 });
 assert.equal(result.audioReactive,true);assert.equal(result.lyricsClear,true);assert.equal(result.retinaFilled,true);assert.equal(result.repeat,true);assert.ok(result.variants>=3);assert.ok(result.props>500);assert.deepEqual(result.allProps,[]);
 assert.deepEqual(result.allWorlds,[]);assert.ok(result.worlds>=30);assert.ok(result.distinctWorlds>=30);assert.ok(result.places>=2&&result.places<=5);assert.ok(result.shots>=25);assert.ok(result.instrumental>=2&&result.instrumental<=5);
 assert.equal(result.override.action,'give');assert.equal(result.override.camera,'detail');assert.equal(result.override.motif,'carta_abierta');
 await p.locator('#sheet').screenshot({path:'/tmp/lumora-fabula-atlas.png'});
 assert.deepEqual(errores,[]);console.log('fábula motor: '+JSON.stringify({...result,override:undefined}));
}finally{await b.close();srv.stop();}
