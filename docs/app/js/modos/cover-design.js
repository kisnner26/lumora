// composición y tipografía de carátula; preferencias compartidas con la exportación.
(() => {
  const cover=$('cover'),menu=$('cvMenu');if(!cover||!menu)return;
  const defaults={layout:'editorial',font:'humanista',align:'left',lineSize:34,listSize:32,trSize:18,lyricWidth:42,leading:1.25,letterSpace:0,lyricLift:0,context:true,focus:false};
  const fonts={humanista:'"Anybody", system-ui, sans-serif',novela:'"Iowan Old Style", "Palatino Linotype", Georgia, serif',manuscrita:'"Caveat", cursive',mono:'"Martian Mono", monospace'};
  const ranges={lineSize:[16,72,1,'px'],listSize:[18,60,1,'px'],trSize:[12,32,1,'px'],lyricWidth:[28,65,1,'%'],leading:[1.05,1.8,.05,'×'],letterSpace:[-.04,.12,.01,'em'],lyricLift:[-60,60,2,'px']};
  Object.assign(CV_OPTS,{layout:[['editorial','editorial'],['centrado','centrado'],['inmersivo','inmersivo']],font:[['humanista','humanista'],['novela','novela'],['manuscrita','manuscrita'],['mono','mono']],align:[['left','izquierda'],['center','centro']]});
  const clean=()=>{
    for(const [key,[min,max]] of Object.entries(ranges)){const n=Number(CV[key]);CV[key]=Number.isFinite(n)?Math.max(min,Math.min(max,n)):defaults[key];}
    for(const key of ['layout','font','align'])if(!CV_OPTS[key].some(([v])=>v===CV[key]))CV[key]=defaults[key];
    for(const key of ['context','focus'])CV[key]=CV[key]===true;
  };
  clean();
  const options=key=>`<div class="cv-segs">${CV_OPTS[key].map(([v,label])=>`<button type="button" data-${key}="${v}">${label}</button>`).join('')}</div>`;
  const range=(key,label)=>{const [min,max,step]=ranges[key];return `<label class="cv-type-range" for="cvType-${key}"><span>${label}</span><output id="cvValue-${key}" for="cvType-${key}"></output><input id="cvType-${key}" type="range" data-cover-setting="${key}" min="${min}" max="${max}" step="${step}"></label>`;};
  menu.querySelector('.cv-tabs').insertAdjacentHTML('beforeend','<button type="button" data-tab="letra">letra</button><button type="button" data-tab="diseno">diseño</button>');
  const pane=document.createElement('div');pane.className='cv-pane cv-typography';pane.dataset.pane='letra';
  pane.innerHTML=`<h5>tipografía</h5>${options('font')}<h5>alineación</h5>${options('align')}<div class="cv-type-grid">${range('lineSize','tamaño del verso')}${range('listSize','letra completa')}${range('trSize','traducción')}${range('lyricWidth','ancho de lectura')}${range('leading','interlineado')}${range('letterSpace','espaciado')}${range('lyricLift','posición vertical')}</div><div class="cv-type-actions"><button type="button" data-cv-action="context">verso siguiente</button><button type="button" data-cv-action="reset">restablecer letra</button></div>`;
  menu.insertBefore(pane,menu.querySelector('.cv-foot'));
  const design=document.createElement('div');design.className='cv-pane cv-typography';design.dataset.pane='diseno';
  design.innerHTML=`<h5>composición</h5>${options('layout')}<h5>estilos preparados</h5><div class="cv-segs"><button type="button" data-cv-preset="editorial">sesión editorial</button><button type="button" data-cv-preset="lectura">leer la canción</button><button type="button" data-cv-preset="noche">escucha nocturna</button></div><div class="cv-type-actions"><button type="button" data-cv-action="focus">modo concentración</button><button type="button" data-cv-action="save">guardar mi estilo</button><button type="button" data-cv-action="restore">usar mi estilo</button><button type="button" data-cv-action="capture">guardar escena</button></div><p class="cv-desc" id="cvDesignStatus" role="status">tu diseño se guarda automáticamente. los controles de sonido siguen disponibles en su pestaña.</p>`;
  menu.insertBefore(design,menu.querySelector('.cv-foot'));
  // el menú se ancla a la ventana, fuera de la barra que se oculta al quedar inactiva.
  cover.append(menu);
  const main=cover.querySelector('.cv-main'),left=cover.querySelector('.cv-left'),line=cover.querySelector('.cv-line');
  const next=document.createElement('p');next.className='cv-next-verse';next.id='cvNextVerse';cover.querySelector('.cv-line').append(next);
  const css=document.createElement('style');css.textContent=`
  #cover,#cover .cv-float,#cover #cvMenu,#cover .cv-next{--paper:#f6f1e8!important;--gold:#99b8eb!important;--mute:#a9aeb8!important;--faint:#9096a2!important;--rule:#ffffff20!important;color:var(--paper)}
  #cover{background:#0c0d10}
  #cover .cv-pane{min-height:0!important;max-height:none;overflow:visible}
  #cover #cvMenu{background:#11141af5!important;color:var(--paper)!important;border:1px solid #ffffff20!important;border-radius:18px!important;box-shadow:0 24px 80px #0008!important;backdrop-filter:blur(24px)}
  #cover :is(.cv-tabs,.cv-segs){background:#ffffff05!important;border:1px solid #ffffff20!important;border-radius:9px!important;padding:3px!important}
  #cover :is(.cv-tabs,.cv-segs) button{color:var(--mute)!important;border-radius:6px!important;font:450 12px system-ui,sans-serif!important;text-transform:none!important;letter-spacing:0!important}
  #cover :is(.cv-tabs,.cv-segs) button.on{background:#ffffff12!important;color:var(--paper)!important}
  #cover :is(.cv-desc,.cv-desc b,.cv-menu h5,.cv-tiles button,.cv-chip){color:var(--mute)!important}
  #cover .cv-player{background:#11141ae8!important;border:1px solid #ffffff22!important;border-radius:20px!important;color:var(--paper)!important;box-shadow:0 20px 60px #0006!important}
  #cover :is(.cv-ctl button,.cv-tools button){color:var(--paper)!important;border-radius:12px!important}#cover .cv-ctl button.big{background:var(--gold)!important;border:0!important;box-shadow:none!important}#cover .cv-ctl button.big svg{fill:#101620!important}
  #cover :is(.cv-prog,.cv-prog span){color:var(--mute)!important}#cover .cv-bar{background:linear-gradient(#ffffff30,#ffffff30) center/100% 3px no-repeat!important}#cover .cv-bar i{background:var(--gold)!important;height:3px!important;margin-top:-1.5px!important;border:0!important}
  #cover :is(.covermeta b,.covermeta span,.cv-line b,.cv-clock b,.cv-clock span){background:none!important;border:0!important;box-shadow:none!important;padding:0!important;color:var(--paper)!important;text-shadow:none!important}
  #cover .covermeta span{color:var(--mute)!important}#cover .cv-line span{color:#c6cbd4!important;text-shadow:none!important}
  #cover .cv-art #coverImg{border:1px solid #ffffff20!important;border-radius:4px!important;box-shadow:0 30px 80px #0008!important}
  #cover .cv-foot{border-top:1px solid #ffffff20!important}#cover .cv-foot button{background:transparent!important;color:var(--paper)!important;border:1px solid #ffffff20!important;border-radius:8px!important;box-shadow:none!important}
  #cvMenu[data-tab=letra] [data-pane=letra],#cvMenu[data-tab=diseno] [data-pane=diseno]{display:block}
  .cv-tabs{flex-wrap:wrap}.cv-tabs button{min-height:40px}.cv-typography{max-height:min(56vh,480px);overflow:auto;overscroll-behavior:contain}
  .cv-type-grid{display:grid;grid-template-columns:1fr 1fr;gap:14px 18px;margin-top:20px}.cv-type-range{display:grid;grid-template-columns:1fr auto;gap:6px;font:400 12px system-ui,sans-serif;color:var(--paper)}
  .cv-type-range output{font-variant-numeric:tabular-nums;color:var(--gold)}.cv-type-range input{grid-column:1/-1;width:100%;margin:0;min-height:28px;accent-color:var(--gold)}
  .cv-type-actions{display:flex;flex-wrap:wrap;gap:8px;margin-top:20px}#cover .cv-type-actions button{color:var(--mute)!important;padding:10px 12px;border:1px solid var(--rule);border-radius:8px;min-height:40px;font:400 12px system-ui,sans-serif}
  #cover .cv-type-actions button[aria-pressed=true]{color:var(--paper)!important;border-color:var(--gold);background:#99b8eb18}#cover :focus-visible{outline:2px solid var(--gold)!important;outline-offset:4px}
  #cover{--cv-font:"Anybody",sans-serif;--cv-line:34px;--cv-list:32px;--cv-tr:18px;--cv-width:42vw;--cv-leading:1.25;--cv-spacing:0em;--cv-lift:0px}
  #cover .cv-line{max-height:min(55vh,calc(100vh - 280px));overflow:auto;width:min(var(--cv-width),880px);max-width:100%;text-align:var(--cv-align);transform:translateY(var(--cv-lift));min-height:0}
  #cover .cv-line b{font-family:var(--cv-font);font-size:var(--cv-line);font-weight:500;line-height:var(--cv-leading);letter-spacing:var(--cv-spacing);text-wrap:pretty}
  #cover .cv-line span{font-family:var(--cv-font);font-size:var(--cv-tr);line-height:1.4;opacity:.8;margin-top:12px}
  #cover .cv-next-verse{font:400 14px/1.5 var(--cv-font);opacity:.36;margin:18px 0 0;max-width:100%;text-wrap:pretty}#cover[data-context="0"] .cv-next-verse{display:none}
  #cover .cv-full{width:min(var(--cv-width),880px);height:min(68vh,740px);transform:translateY(var(--cv-lift))}
  #cover .cv-list :is(p,.cv-verse){display:block;width:100%;text-align:var(--cv-align);font-family:var(--cv-font);font-size:var(--cv-list);line-height:var(--cv-leading);letter-spacing:var(--cv-spacing);font-weight:500;color:#b7b2aa;background:none;border:0;padding:16px 4px;margin:0;cursor:pointer;transition:opacity .3s,transform .3s,color .3s}
  #cover .cv-list .cv-verse.on{color:var(--paper);transform:translateX(4px);text-shadow:none}#cover .cv-list .cv-verse.past{color:#7d7974}
  #cover .cv-list .cv-verse small{display:block;font:italic 400 var(--cv-tr)/1.4 var(--cv-font);margin-top:8px;color:#c4bba9}
  #cover .cv-main{box-sizing:border-box;width:100%;height:100%;max-height:100vh;overflow:auto;max-width:1600px;justify-self:center;min-width:0;align-items:safe center;justify-content:safe center}
  #cover .cv-left{min-width:0}
  /* aplicar la escala después del límite evita que s/m/l colapsen al mismo tamaño. */
  #cover .cv-art{--art:calc(var(--cv-art-cap) * var(--cv-art-scale))}
  #cover[data-size=s]{--cv-art-scale:.65}
  #cover[data-size=m]{--cv-art-scale:.85}
  #cover[data-size=l]{--cv-art-scale:1}
  #cover #cvMenu{position:absolute;right:24px;bottom:106px;width:min(410px,calc(100vw - 32px));max-height:calc(100vh - 140px);box-sizing:border-box;z-index:8;overflow:auto}
  #cover #cvMenu .cv-tabs{display:grid;grid-template-columns:repeat(5,minmax(0,1fr));gap:2px}
  #cover #cvMenu .cv-tabs button{padding:8px 3px!important;font-size:11px!important;line-height:1.3}
  #cover #cvMenu .cv-type-range{color:#f6f1e8}
  #cover #cvMenu h5{font:500 11px/1.4 system-ui,sans-serif;letter-spacing:.06em;margin:16px 0 10px}
  #cover .cv-tools button.on{background:#ffffff18!important;color:var(--gold)!important}
  #cover .cv-tools #cvLike.on svg{stroke:#99b8eb;fill:#99b8eb}
  #cover[data-layout=editorial] .cv-main{display:grid;grid-template-columns:minmax(0,1fr) minmax(0,1fr);align-content:center;align-items:center;gap:clamp(32px,4vw,64px);padding:48px 6vw 116px}
  #cover[data-layout=editorial] .cv-left{grid-column:1;grid-row:1;align-items:center;width:100%;justify-self:center;position:relative}
  #cover[data-layout=editorial] .cv-art{--cv-art-cap:min(30vw,calc(100vh - 330px),480px)}
  #cover[data-layout=editorial] .covermeta{text-align:center;max-width:100%}#cover[data-layout=editorial] .covermeta b{font-style:normal;font-size:clamp(24px,3vw,46px);font-weight:500;letter-spacing:-.04em}
  #cover[data-layout=editorial] .cv-main>.cv-line{grid-column:2;grid-row:1;position:relative;left:auto;top:auto;width:var(--cv-column);max-width:100%;min-width:0;align-self:center;justify-self:start}
  #cover[data-layout=editorial][data-lyr=completa] .cv-full{grid-column:2;grid-row:1;justify-self:start;max-width:100%}
  #cover[data-layout=editorial][data-lyr=no] .cv-main{grid-template-columns:minmax(0,1fr)}
  /* reserva el espacio real del disco o cassette que asoma detrás de la portada. */
  #cover[data-layout=editorial]:is([data-style=vinilo],[data-style=cd],[data-style=cassette]) .cv-art{--cv-art-cap:min(24vw,calc(100vh - 330px),400px);translate:-12% 0}
  #cover[data-layout=editorial][data-style=vinilo] .cv-art{translate:-32% 0}
  #cover[data-layout=centrado] .cv-art{--cv-art-cap:min(44vmin,calc(100vh - 470px),480px)}
  #cover[data-layout=centrado] .cv-line{max-height:24vh}
  #cover[data-lyr=completa][data-style=vinilo] .cv-art{translate:-32% 0}
  #cover[data-lyr=completa]:is([data-style=cd],[data-style=cassette]) .cv-art{translate:-20% 0}
  #cover[data-layout=inmersivo] .coverbg{opacity:.35}#cover[data-layout=inmersivo] .cv-art{--cv-art-cap:min(40vmin,calc(100vh - 360px),400px)}
  #cover[data-layout=inmersivo] .cv-main{background:linear-gradient(transparent,#08090bc9);padding-bottom:130px}
  #cover[data-focus="1"] :is(.covermeta,.cv-clock,.cv-next,.cv-trata){opacity:0;pointer-events:none}
  #cover:not(.show) .cv-amb i{animation-play-state:paused}
  @media(min-width:1400px){
  #cover.menu[data-layout=editorial] .cv-main{width:calc(100% - 440px);margin-right:440px}
  #cover.menu[data-layout=editorial] .cv-art{--cv-art-cap:min(22vw,calc(100vh - 330px),380px)}
  #cover.menu[data-layout=editorial]:is([data-style=vinilo],[data-style=cd],[data-style=cassette]) .cv-art{--cv-art-cap:min(19vw,calc(100vh - 330px),340px)}}
  @media(max-width:700px){#cover{--cv-width:calc(var(--cv-mobile-width) * 1vw)!important}#cover[data-layout=editorial] .cv-main{display:flex;flex-direction:column;gap:22px;padding:30px 24px 112px;overflow:auto}
  #cover[data-layout=editorial] .cv-left{align-items:center;width:100%}#cover[data-layout=editorial] .cv-art{--cv-art-cap:min(54vw,30vh,300px)}
  #cover[data-layout=editorial] .covermeta{text-align:center;max-width:85vw}#cover[data-layout=editorial] .cv-main>.cv-line{position:static;width:var(--cv-width);max-width:88vw}
  #cover .cv-line b{font-size:min(var(--cv-line),8vw)}#cover .cv-full{max-width:88vw;height:35vh}#cover .cv-list .cv-verse{font-size:min(var(--cv-list),8vw)}
  #cover .cv-art{--cv-art-cap:min(54vw,30vh,300px)!important}
  #cover:is([data-style=vinilo],[data-style=cd],[data-style=cassette]) .cv-art{--cv-art-cap:min(46vw,27vh,260px)!important}
  #cover #cvMenu{right:16px;bottom:96px;max-height:calc(100vh - 120px)}
  .cv-type-grid{grid-template-columns:1fr 1fr;gap:12px}.cv-typography{max-height:48vh}}
  @media(prefers-reduced-motion:reduce){#cover *{animation:none!important;transition:none!important}}
  body.reduce-motion #cover *,#cover[data-reduced="1"] *{animation:none!important;transition:none!important}
  `;document.head.append(css);
  function apply(){
    clean();
    if(CV.layout==='editorial'){if(line.parentElement!==main)main.insertBefore(line,cover.querySelector('.cv-full'));}else if(line.parentElement!==left)left.append(line);
    const v={'--cv-font':fonts[CV.font],'--cv-line':CV.lineSize+'px','--cv-list':CV.listSize+'px','--cv-tr':CV.trSize+'px','--cv-width':CV.lyricWidth+'vw','--cv-mobile-width':Math.min(88,CV.lyricWidth*2),'--cv-column':Math.min(100,CV.lyricWidth*2)+'%','--cv-leading':CV.leading,'--cv-spacing':CV.letterSpace+'em','--cv-lift':CV.lyricLift+'px','--cv-align':CV.align};
    for(const [key,value] of Object.entries(v))cover.style.setProperty(key,value);
    cover.dataset.reduced=cvReduced()?'1':'0';
    cover.dataset.layout=CV.layout;cover.dataset.context=CV.context?'1':'0';cover.dataset.focus=CV.focus?'1':'0';
    for(const [key,[,,step,unit]] of Object.entries(ranges)){const input=$('cvType-'+key);input.value=CV[key];$('cvValue-'+key).textContent=(step<1?Number(CV[key].toFixed(2)):CV[key])+unit;input.setAttribute('aria-valuetext',$('cvValue-'+key).textContent);}
    menu.querySelectorAll('[data-font],[data-align],[data-layout]').forEach(b=>{const key=['font','align','layout'].find(k=>b.dataset[k]);b.classList.toggle('on',b.dataset[key]===CV[key]);b.setAttribute('aria-pressed',String(b.classList.contains('on')));});
    for(const key of ['context','focus'])menu.querySelector(`[data-cv-action="${key}"]`).setAttribute('aria-pressed',String(CV[key]));
    CV.cur=-2;
  }
  const oldPaint=cvPaint;cvPaint=function(){oldPaint();apply();};
  const savedKeys=[...Object.keys(defaults),'style','lyr','size'];
  const prefs=()=>Object.fromEntries(savedKeys.map(key=>[key,CV[key]]));
  pane.addEventListener('input',e=>{const key=e.target.dataset.coverSetting;if(!ranges[key])return;CV[key]=Number(e.target.value);apply();cvSave();});
  const presets={editorial:{...defaults,lyr:'linea',style:'minimo'},lectura:{...defaults,lyr:'completa',font:'novela',listSize:38,lineSize:36,style:'difuminado'},noche:{...defaults,layout:'inmersivo',align:'center',font:'humanista',lyr:'linea',lineSize:40,style:'ambiente',focus:true}};
  document.addEventListener('click',e=>{
    const button=e.target.closest('[data-cv-action],[data-cv-preset]');if(!button||!menu.contains(button))return;e.stopPropagation();
    const action=button.dataset.cvAction,status=$('cvDesignStatus');
    if(button.dataset.cvPreset)Object.assign(CV,presets[button.dataset.cvPreset]);
    else if(action==='reset'){for(const key of Object.keys(defaults))if(!['layout','focus'].includes(key))CV[key]=defaults[key];}
    else if(action==='context'||action==='focus')CV[action]=!CV[action];
    else if(action==='save'){try{localStorage.setItem('lm_cover_design',JSON.stringify(prefs()));status.textContent='tu estilo está guardado en esta mac.';}catch{status.textContent='no se pudo guardar el estilo.';}}
    else if(action==='restore'){try{const saved=JSON.parse(localStorage.getItem('lm_cover_design')||'null');if(saved){for(const key of savedKeys)if(Object.hasOwn(saved,key)&&(!CV_OPTS[key]||CV_OPTS[key].some(([value])=>value===saved[key])))CV[key]=saved[key];}else status.textContent='todavía no has guardado un estilo.';}catch{status.textContent='no se pudo leer el estilo guardado.';}}
    else if(action==='capture'){const canvas=document.createElement('canvas');canvas.width=1920;canvas.height=1080;render(canvas.getContext('2d'),1920,1080);canvas.toBlob(blob=>{if(!blob)return;const url=URL.createObjectURL(blob),a=document.createElement('a');a.href=url;a.download='lumora-caratula.png';a.click();setTimeout(()=>URL.revokeObjectURL(url),5000);});}
    cvSave();cvPaint();
  },true);
  let lastNext='';
  const updateNext=()=>{
    if(coverOpen)cover.dataset.reduced=cvReduced()?'1':'0';
    if(coverOpen&&CV.context){const t=window.RISOCLIP?.h?.timeNow?.()??ext.now(),index=IN.lines.findLastIndex(l=>l.t<=t+(IN.off||0)+.2),value=IN.lines[index+1]?.text||'';if(value!==lastNext){lastNext=value;next.textContent=value;}}
  };
  const timer=setInterval(updateNext,200);addEventListener('pagehide',()=>clearInterval(timer),{once:true});
  function wrapText(c,text,width){const out=[''];for(const word of String(text||'').split(/\s+/)){const i=out.length-1,next=(out[i]+' '+word).trim();if(c.measureText(next).width>width&&out[i])out.push(word);else out[i]=next;}return out;}
  function render(c,w,h){
    clean();c.save();c.setTransform(1,0,0,1,0,0);c.fillStyle='#0c0d10';c.fillRect(0,0,w,h);
    const image=$('coverImg'),hasArt=image?.complete&&image.naturalWidth>0,portrait=h>w,editorial=CV.layout==='editorial'&&!portrait;
    if(hasArt&&CV.style!=='minimo'){c.save();c.globalAlpha=.2;const scale=Math.max(w/image.naturalWidth,h/image.naturalHeight),iw=image.naturalWidth*scale,ih=image.naturalHeight*scale;c.drawImage(image,(w-iw)/2,(h-ih)/2,iw,ih);c.restore();}
    const veil=c.createLinearGradient(0,0,w,h);veil.addColorStop(0,'#0c0d1080');veil.addColorStop(1,'#0c0d10ee');c.fillStyle=veil;c.fillRect(0,0,w,h);
    const size=Math.min(editorial?w*.34:w*.44,h*(portrait?.32:.43))*({s:.65,m:.85,l:1}[CV.size]||.85),ax=editorial?w*.09:(w-size)/2,ay=editorial?(h-size)/2:h*.09;
    if(hasArt){c.shadowColor='#0009';c.shadowBlur=40;c.drawImage(image,ax,ay,size,size);c.shadowBlur=0;}
    else{c.fillStyle='#25262d';c.fillRect(ax,ay,size,size);}
    const title=ext.st.name||proc.title||'sin título',artist=ext.st.artist||proc.artist||'';
    const tx=editorial?ax:w/2;if(!CV.focus){c.textAlign=editorial?'left':'center';c.fillStyle='#f6eee2';c.font=`500 ${Math.min(40,w*.03)}px Anybody,system-ui,sans-serif`;c.fillText(title,tx,ay+size+48,editorial?size:w*.8);c.fillStyle='#a9a7a2';c.font=`400 ${Math.min(20,w*.02)}px system-ui,sans-serif`;c.fillText(artist,tx,ay+size+80,editorial?size:w*.8);}
    if(CV.lyr!=='no'){
      const time=window.RISOCLIP?.h?.timeNow?.()??ext.now(),index=IN.lines.findLastIndex(l=>l.t<=time+(IN.off||0)+.2),original=IN.lines[index]?.text||'',tr=IN.tr?.[index]||'';
      const main=IN.trMode==='es'&&tr?tr:original,translation=IN.trMode==='ambas'?tr:'';
      const width=editorial?Math.min(w*.44,w*CV.lyricWidth/100):Math.min(w*.88,w*CV.lyricWidth/100),lx=editorial?w*.53+(CV.align==='center'?width/2:0):CV.align==='left'?(w-width)/2:w/2;
      let y=(editorial?h*.37:ay+size+145)+CV.lyricLift*h/900;
      const font=fonts[CV.font],base=CV.lineSize*(w/1280);let fs=Math.min(base,h*.075);c.textAlign=CV.align;c.fillStyle='#f6eee2';
      let rows;do{c.font=`500 ${fs}px ${font}`;rows=wrapText(c,main,width);if(rows.length*fs*CV.leading<h*.3)break;fs-=2;}while(fs>16);
      c.letterSpacing=CV.letterSpace+'em';for(const row of rows){c.fillText(row,lx,y,width);y+=fs*CV.leading;}
      if(translation){c.font=`italic 400 ${CV.trSize*w/1280}px ${font}`;c.fillStyle='#c4bba9';for(const row of wrapText(c,translation,width)){c.fillText(row,lx,y+12,width);y+=CV.trSize*w/1280*1.4;}}
    }
    c.restore();
  }
  window.LMCOVER={apply,render,prefs,defaults};apply();
})();
