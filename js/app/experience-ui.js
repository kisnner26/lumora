// una mesa compartida: música, acústica y universo visual, sin duplicar ajustes entre modos.
(() => {
  const E=window.LMAUDIO,U=window.RISO?.world;if(!E||!U)return;
  const $=id=>document.getElementById(id),esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const css=document.createElement('style');css.textContent=`
#experience{--ink:var(--rk1,#212b80);--paper:var(--rkl,#faf3e4);--hot:var(--rk2,#f66f24);--mute:#212b80a8;--rule:#212b8030;width:min(900px,calc(100vw - 24px));max-height:calc(100dvh - 24px);padding:0;border:3px solid var(--ink);background:var(--paper);color:var(--ink);font:15px/1.45 'Anybody',sans-serif;box-shadow:12px 12px 0 #212b8030;overflow:auto;overscroll-behavior:contain}
#experience::backdrop{background:#0a080ce8}
#experience *{box-sizing:border-box}#experience button,#experience select,#experience input{font-family:inherit}#experience [hidden]{display:none!important}
#experience .xp-mono,#experience .xp-micro{font:600 10px/1.2 'Martian Mono',monospace;letter-spacing:.14em;text-transform:uppercase}
#experience .xp-top{display:flex;align-items:flex-start;justify-content:space-between;gap:16px;padding:22px 28px 0}
#experience .xp-kicker{color:var(--mute);margin:0 0 10px}
#experience h2{margin:0;font:900 clamp(46px,9vw,84px)/.84 'Anybody',sans-serif;font-stretch:62%;text-transform:uppercase;letter-spacing:-.02em}#experience h2 em{font-style:normal;color:var(--hot)}
#experience .xp-close{min-height:36px;padding:0 14px;border:2px solid var(--ink);background:transparent;color:var(--ink);font:600 10px 'Martian Mono',monospace;letter-spacing:.14em;text-transform:uppercase;cursor:pointer}
#experience .xp-close:hover{background:var(--ink);color:var(--paper)}
#experience .xp-bar{display:flex;align-items:center;gap:14px;margin:20px 28px 0;padding:10px 14px;border:2px solid var(--ink);background:#212b8010}
#experience .xp-led{width:10px;height:10px;border-radius:50%;border:2px solid var(--ink);flex:none}#experience .xp-bar[data-on="1"] .xp-led{background:var(--hot);border-color:var(--hot);box-shadow:0 0 0 4px #f66f2430}
#experience #xpStatusText{flex:1;min-width:0;overflow-wrap:anywhere}
#experience .xp-vu{display:flex;align-items:flex-end;gap:3px;height:22px;flex:none}#experience .xp-vu i{display:block;width:5px;height:100%;background:var(--ink);transform-origin:bottom;transform:scaleY(.08);opacity:.85}
#experience nav{display:flex;gap:0;margin:22px 28px 0;border-bottom:2px solid var(--ink)}
#experience nav button{flex:1;display:flex;gap:10px;align-items:baseline;justify-content:center;padding:12px 6px 11px;border:0;background:transparent;color:var(--mute);cursor:pointer;position:relative}
#experience nav button b{font:600 9px 'Martian Mono',monospace;color:var(--hot)}#experience nav button span{font:800 17px 'Anybody',sans-serif;font-stretch:70%;text-transform:uppercase;letter-spacing:.02em}
#experience nav button[aria-pressed=true]{color:var(--ink)}#experience nav button[aria-pressed=true]::after{content:'';position:absolute;left:0;right:0;bottom:-2px;height:5px;background:var(--hot)}
#experience nav button:hover{color:var(--ink)}
#experience .xp-body{padding:24px 28px 26px}
#experience .xp-lead{margin:0 0 18px;max-width:60ch;color:var(--ink);font-size:14px}
#experience .xp-hero{width:100%;display:flex;align-items:center;justify-content:space-between;gap:18px;padding:18px 22px;border:3px solid var(--ink);background:var(--hot);color:#fff;text-align:left;cursor:pointer;box-shadow:6px 6px 0 var(--ink);transition:transform .12s,box-shadow .12s}
#experience .xp-hero:hover{transform:translate(-2px,-2px);box-shadow:8px 8px 0 var(--ink)}#experience .xp-hero:active{transform:translate(3px,3px);box-shadow:3px 3px 0 var(--ink)}
#experience .xp-hero strong{display:block;font:900 clamp(26px,5vw,40px)/.9 'Anybody',sans-serif;font-stretch:66%;text-transform:uppercase}#experience .xp-hero small{display:block;margin-top:8px;font:500 10px/1.4 'Martian Mono',monospace;letter-spacing:.08em;text-transform:uppercase;opacity:.92}
#experience .xp-hero .xp-arrow{font:700 34px/1 'Martian Mono',monospace;flex:none}
#experience .xp-grid3{display:grid;grid-template-columns:repeat(3,1fr);gap:14px;margin-top:18px}
#experience .xp-card{position:relative;display:flex;flex-direction:column;gap:6px;min-height:104px;padding:14px;border:2px solid var(--ink);background:var(--paper);color:var(--ink);text-align:left;cursor:pointer;transition:background .12s,color .12s}
#experience .xp-card:hover,#experience .xp-card:focus-within{background:var(--ink);color:var(--paper)}#experience .xp-card:hover .xp-micro,#experience .xp-card:focus-within .xp-micro{color:var(--paper)}
#experience .xp-card b{font:800 20px/1 'Anybody',sans-serif;font-stretch:70%;text-transform:uppercase}#experience .xp-card .xp-micro{color:var(--mute)}#experience .xp-card p{margin:auto 0 0;font-size:12px;line-height:1.35;opacity:.88}
#experience .xp-card input[type=file]{position:absolute;inset:0;opacity:0;cursor:pointer;width:100%}
#experience .xp-card:has(input:focus-visible){outline:3px solid var(--hot);outline-offset:3px}
#experience .xp-section{margin:26px 0 0;padding-top:16px;border-top:2px solid var(--rule)}#experience .xp-section:first-child{margin-top:0;padding-top:0;border:0}
#experience .xp-row{display:flex;align-items:center;gap:10px;flex-wrap:wrap}
#experience .xp-btn{min-height:42px;padding:0 18px;border:2px solid var(--ink);background:var(--paper);color:var(--ink);font:600 11px 'Martian Mono',monospace;letter-spacing:.1em;text-transform:uppercase;cursor:pointer;transition:background .12s,color .12s}
#experience .xp-btn:hover:not(:disabled){background:var(--ink);color:var(--paper)}#experience .xp-btn.primary{background:var(--ink);color:var(--paper)}#experience .xp-btn.primary:hover:not(:disabled){background:var(--hot);border-color:var(--hot)}
#experience .xp-btn:disabled{opacity:.4;cursor:default}
#experience :focus-visible{outline:3px solid var(--hot);outline-offset:3px}
#experience .xp-presets{display:grid;grid-template-columns:repeat(5,1fr);gap:10px}
#experience .xp-preset{display:flex;flex-direction:column;gap:8px;min-height:116px;padding:12px;border:2px solid var(--ink);background:var(--paper);color:var(--ink);text-align:left;cursor:pointer;transition:background .12s,color .12s}
#experience .xp-preset b{font:800 18px/.95 'Anybody',sans-serif;font-stretch:68%;text-transform:uppercase}#experience .xp-preset .xp-micro{color:var(--hot)}#experience .xp-preset p{margin:auto 0 0;font:500 9px/1.5 'Martian Mono',monospace;letter-spacing:.04em;text-transform:uppercase;opacity:.8}
#experience .xp-preset:hover{background:#212b8014}#experience .xp-preset[aria-pressed=true]{background:var(--ink);color:var(--paper);box-shadow:5px 5px 0 var(--hot)}
#experience .xp-sliders{display:grid;grid-template-columns:1fr 1fr;gap:20px 34px}
#experience .xp-slider{display:grid;gap:8px}#experience .xp-slider>div{display:flex;justify-content:space-between;align-items:baseline}
#experience .xp-slider .xp-val{color:var(--hot);font-size:12px}
#experience input[type=range]{-webkit-appearance:none;appearance:none;width:100%;height:28px;background:transparent;cursor:pointer;--p:50%}
#experience input[type=range]::-webkit-slider-runnable-track{height:8px;border:2px solid var(--ink);background:linear-gradient(90deg,var(--hot) var(--p),transparent var(--p));border-radius:0}
#experience input[type=range]::-webkit-slider-thumb{-webkit-appearance:none;width:16px;height:26px;margin-top:-10px;border:2px solid var(--ink);background:var(--paper);box-shadow:3px 3px 0 var(--ink);border-radius:0}
#experience input[type=range]::-moz-range-track{height:8px;border:2px solid var(--ink);background:linear-gradient(90deg,var(--hot) var(--p),transparent var(--p));border-radius:0}
#experience input[type=range]::-moz-range-thumb{width:12px;height:22px;border:2px solid var(--ink);background:var(--paper);border-radius:0}
#experience details{margin-top:22px;border-top:2px solid var(--rule)}#experience summary{padding:14px 0;cursor:pointer;list-style:none}#experience summary::-webkit-details-marker{display:none}#experience summary::before{content:'+ ';color:var(--hot)}#experience details[open] summary::before{content:'− '}
#experience .xp-toggle{display:flex;align-items:center;gap:12px;cursor:pointer;margin-top:18px}#experience .xp-toggle input{appearance:none;-webkit-appearance:none;width:44px;height:24px;border:2px solid var(--ink);background:transparent;position:relative;cursor:pointer;flex:none}
#experience .xp-toggle input::after{content:'';position:absolute;top:2px;left:2px;width:16px;height:16px;background:var(--ink);transition:transform .15s,background .15s}#experience .xp-toggle input:checked{background:var(--ink)}#experience .xp-toggle input:checked::after{transform:translateX(20px);background:var(--hot)}
#experience .xp-toggle span{font-size:13px}
#experience .xp-note{margin:20px 0 0;color:var(--mute);font:500 10px/1.6 'Martian Mono',monospace;letter-spacing:.04em;text-transform:uppercase;max-width:78ch}
#experience .xp-uni{display:grid;grid-template-columns:1.25fr 1fr;gap:26px;align-items:start}
#xpPreview{position:static!important;inset:auto!important;width:100%;height:auto;display:block;border:3px solid var(--ink);aspect-ratio:16/9;box-shadow:6px 6px 0 var(--ink)}
#experience .xp-cap{display:flex;justify-content:space-between;margin-top:14px;color:var(--mute)}
#experience .xp-field{display:grid;gap:8px;margin-bottom:16px}#experience input[type=text]{min-height:42px;width:100%;padding:0 12px;border:2px solid var(--ink);background:#fff8;color:var(--ink);font:600 12px 'Martian Mono',monospace;letter-spacing:.06em}
#experience .xp-chips{display:flex;flex-wrap:wrap;gap:6px}#experience .xp-chip{min-height:34px;padding:0 12px;border:2px solid var(--ink);background:transparent;color:var(--ink);font:600 10px 'Martian Mono',monospace;letter-spacing:.1em;text-transform:uppercase;cursor:pointer}
#experience .xp-chip:hover{background:#212b8014}#experience .xp-chip[aria-pressed=true]{background:var(--ink);color:var(--paper)}
#experience #xpError{margin:0;padding:0 28px;min-height:0;color:#b4261a;font:600 11px/1.5 'Martian Mono',monospace;letter-spacing:.04em}#experience #xpError:not(:empty){padding:14px 28px 0}
#experience #xpTimeline{margin-top:14px}#experience #xpTime{margin:4px 0 0;color:var(--mute)}
#experience .xp-foot{display:flex;justify-content:space-between;gap:12px;flex-wrap:wrap;padding:14px 28px;border-top:2px solid var(--rule);color:var(--mute)}
@media(max-width:760px){#experience .xp-grid3{grid-template-columns:1fr}#experience .xp-presets{grid-template-columns:1fr 1fr}#experience .xp-sliders{grid-template-columns:1fr}#experience .xp-uni{grid-template-columns:1fr}#experience .xp-top,#experience .xp-body,#experience .xp-foot{padding-left:18px;padding-right:18px}#experience .xp-bar,#experience nav{margin-left:18px;margin-right:18px}#experience nav button span{font-size:14px}#experience nav button b{display:none}#experience .xp-foot{flex-direction:column}}
@media(prefers-reduced-motion:reduce){#experience *{transition:none!important}}`;
  document.head.appendChild(css);
  const d=document.createElement('dialog');d.id='experience';d.setAttribute('aria-labelledby','xpTitle');
  const slider=(key,label,min=0,max=1,step=.01)=>`<div class="xp-slider"><div><label class="xp-micro" for="xp_${key}">${label}</label><span class="xp-mono xp-val" data-output="${key}"></span></div><input id="xp_${key}" type="range" data-audio="${key}" min="${min}" max="${max}" step="${step}"></div>`;
  const presetBlurb=p=>`reverb ${Math.round(p.room*100)} · eco ${Math.round(p.echo*100)} · espacio ${Math.round(p.space*100)}`;
  d.innerHTML=`<div class="xp-top"><div><p class="xp-micro xp-kicker">lumora / 07 · audio</p><h2 id="xpTitle">experiencia<em>.</em></h2></div><button id="xpClose" class="xp-close" aria-label="cerrar experiencia">esc · cerrar</button></div>
    <div class="xp-bar" id="xpBar" data-on="0"><i class="xp-led" aria-hidden="true"></i><span class="xp-mono" id="xpStatusText" role="status"></span><div class="xp-vu" id="xpVu" aria-hidden="true"><i></i><i></i><i></i><i></i><i></i></div></div>
    <p id="xpError" role="alert"></p>
    <nav aria-label="secciones de experiencia">${[['fuente','01','música'],['sonido','02','sonido'],['universo','03','universo']].map(([id,n,label])=>`<button data-xp-tab="${id}" aria-pressed="false"><b>${n}</b><span>${label}</span></button>`).join('')}</nav>
    <div class="xp-body">
    <section data-xp-pane="fuente"><p class="xp-lead">lumora procesa el sonido de verdad: lo toma, le pone espacio y te lo devuelve. elige de dónde viene.</p>
      <button id="xpSystem" class="xp-hero"><span><strong>audio del mac</strong><small>spotify, música y otras apps · el original se silencia y lo oyes procesado</small></span><span class="xp-arrow" aria-hidden="true">↗</span></button>
      <p class="xp-note">el audio del navegador que reproduce lumora queda fuera de la captura. para música en ese mismo navegador, comparte su pestaña. al apagar la salida procesada del mac se desconecta la captura y vuelve el original.</p>
      <div class="xp-grid3">
        <label class="xp-card"><span class="xp-micro">a · archivo</span><b>música local</b><p>mp3, flac, wav, m4a · con barra de tiempo</p><input id="xpFile" type="file" accept="audio/*,.flac,.wav,.mp3,.m4a,.ogg,.aac" aria-label="abrir música local"></label>
        <button class="xp-card" id="xpCapture"><span class="xp-micro">b · pestaña</span><b>pestaña con audio</b><p>comparte una pestaña del navegador con sonido</p></button>
        <button class="xp-card" id="xpDevices"><span class="xp-micro">c · loopback</span><b>entrada externa</b><p>blackhole, loopback o una interfaz de audio</p></button>
      </div>
      <div class="xp-section" id="xpFileBox"><div class="xp-row"><button id="xpPlay" class="xp-btn">reproducir / pausa</button></div><input id="xpTimeline" type="range" min="0" max="1" step=".01" value="0" aria-label="posición del archivo local"><p class="xp-mono xp-micro" id="xpTime"></p></div>
      <div class="xp-section" id="xpInputBox" hidden><span class="xp-micro">entrada de música</span><div class="xp-row" style="margin-top:10px"><select id="xpInput" class="xp-btn" aria-label="entrada de música" style="flex:1;min-width:180px"><option value="">detecta las entradas primero</option></select><button id="xpConnect" class="xp-btn primary">conectar</button></div></div>
      <div class="xp-section"><div class="xp-row" style="justify-content:space-between"><label class="xp-toggle" style="margin:0"><input id="xpMonitor" type="checkbox"><span>escuchar la señal procesada</span></label><button id="xpDisconnect" class="xp-btn">desconectar fuente</button></div>
      <p class="xp-note">en capturas y entradas externas la salida empieza apagada, para que no oigas el original y el procesado a la vez. no pongas un micrófono frente a los altavoces.</p></div></section>
    <section data-xp-pane="sonido" hidden><div class="xp-section"><span class="xp-micro">ambiente acústico</span><div class="xp-presets" role="group" aria-label="ambiente acústico" style="margin-top:12px">${Object.entries(E.presets).map(([id,p],i)=>`<button class="xp-preset" data-preset="${id}" aria-pressed="false"><span class="xp-micro">0${i+1}</span><b>${p.label}</b><p>${presetBlurb(p)}</p></button>`).join('')}</div></div>
      <div class="xp-section"><span class="xp-micro">mezcla</span><div class="xp-sliders" style="margin-top:14px">${slider('room','reverberación')}${slider('echo','eco al tempo')}${slider('space','espacio binaural')}${slider('volume','volumen de salida')}</div></div>
      <details><summary class="xp-micro">tono y dirección</summary><div class="xp-sliders">${slider('bass','graves',-6,6,.5)}${slider('air','brillo',-6,6,.5)}</div><label class="xp-toggle"><input id="xpFollow" type="checkbox"><span>adaptar el ambiente a la historia visual</span></label></details>
      <p class="xp-note">estos efectos necesitan una fuente conectada en la pestaña 01. el espacio binaural trabaja sobre la señal estéreo para auriculares: no decodifica ni sustituye una mezcla dolby atmos.</p></section>
    <section data-xp-pane="universo" hidden><p class="xp-lead">la misma canción, otro lugar. una semilla guarda la arquitectura y la composición del mundo; cambia la semilla y nace otro.</p>
      <div class="xp-uni"><div><canvas id="xpPreview" width="480" height="270" aria-label="vista previa del universo procedural"></canvas><div class="xp-cap xp-micro"><span>vista previa</span><span id="xpSeedTag"></span></div></div>
        <div><div class="xp-field"><label class="xp-micro" for="xpSeed">semilla del universo</label><input id="xpSeed" type="text" maxlength="64" spellcheck="false"><div class="xp-row"><button id="xpApply" class="xp-btn">aplicar</button><button id="xpNext" class="xp-btn primary">otro universo ↗</button></div></div>
          <div class="xp-field"><span class="xp-micro">paisaje</span><div class="xp-chips" role="group" aria-label="paisaje">${Object.entries(U.biomes).map(([id,n])=>`<button class="xp-chip" data-biome="${id}" aria-pressed="false">${n}</button>`).join('')}</div></div>
          <div class="xp-slider"><div><label class="xp-micro" for="xpDensity">riqueza del paisaje</label><span class="xp-mono xp-val" id="xpDensityValue"></span></div><input id="xpDensity" type="range" min=".4" max="1.5" step=".05"></div></div></div>
      <p class="xp-note">se recuerda por canción y se comparte entre el videoclip, la carátula y explorar. el lugar cambia con la historia; la arquitectura conserva su identidad.</p></section>
    </div><div class="xp-foot xp-micro"><span>solo en este mac · no se graba nada</span><span>lumora experiencia</span></div>`;
  document.body.appendChild(d);let tab='fuente',frame=0,last=0,busy=false,trigger=null;
  const fill=input=>{const min=+input.min||0,max=+input.max||1;input.style.setProperty('--p',((+input.value-min)/(max-min)*100).toFixed(1)+'%');};
  function sync(){const s=E.settings,w=U.settings(),on=E.kind!=='none';
    $('xpBar').dataset.on=on?'1':'0';
    $('xpStatusText').textContent=on?(E.label+' · '+(E.monitor?'salida procesada activa':'solo análisis, salida apagada')):(window.AUD?.live?'visualización con el audio del sistema · conecta una fuente para procesarlo':'sin fuente · conecta audio del mac, abre música local o elige una entrada');
    $('xpMonitor').checked=E.monitor;$('xpFollow').checked=s.follow;d.querySelectorAll('[data-preset]').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.preset===s.preset)));
    for(const input of d.querySelectorAll('[data-audio]')){input.value=s[input.dataset.audio];fill(input);d.querySelector(`[data-output="${input.dataset.audio}"]`).textContent=['bass','air'].includes(input.dataset.audio)?(s[input.dataset.audio]>0?'+':'')+s[input.dataset.audio]+' db':Math.round(s[input.dataset.audio]*100)+'%';}
    $('xpSeed').value=w.seed;$('xpSeedTag').textContent='semilla '+w.seed.slice(0,10);d.querySelectorAll('[data-biome]').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.biome===w.biome)));$('xpDensity').value=w.density;fill($('xpDensity'));$('xpDensityValue').textContent=w.density.toFixed(2)+'×';
    $('xpFileBox').hidden=E.kind!=='file';$('xpPlay').disabled=E.kind!=='file';$('xpTimeline').disabled=E.kind!=='file';$('xpDisconnect').disabled=!on;$('xpCapture').disabled=!navigator.mediaDevices?.getDisplayMedia;$('xpSystem').disabled=!!window.WEB||E.kind==='system';
  }
  const bars=[...d.querySelectorAll('#xpVu i')];
  function paint(now){if(!d.open)return;const f=E.kind==='none'?null:E.features,v=f?[f.low,(f.low+f.mid)/2,f.mid,(f.mid+f.high)/2,f.high]:[0,0,0,0,0];bars.forEach((b,i)=>{b.style.transform=`scaleY(${Math.max(.08,Math.min(1,v[i]*1.6+(f?f.pulse*.15:0))).toFixed(3)})`;});
    if(now-last>100){last=now;if(tab==='universo'){const canvas=$('xpPreview'),c=canvas.getContext('2d'),K={...RISO.K,c,d:1};c.fillStyle='#000';c.fillRect(0,0,480,270);c.save();c.scale(.3,.3);U.draw(K,U.profile(U.settings().biome==='auto'?'costa':U.settings().biome),ext.now()||0,{cx:800,ground:740,detail:1});c.restore();U.decode(c);}if(E.kind==='file'){const dur=Number.isFinite(audio.duration)?audio.duration:0;if(document.activeElement!==$('xpTimeline'))$('xpTimeline').value=dur?audio.currentTime/dur:0;$('xpTime').textContent=fmtT(audio.currentTime)+' / '+fmtT(dur);}}frame=requestAnimationFrame(paint);}
  function select(id){tab=id;d.querySelectorAll('[data-xp-pane]').forEach(p=>p.hidden=p.dataset.xpPane!==id);d.querySelectorAll('[data-xp-tab]').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.xpTab===id)));}
  const X=window.LMEXPERIENCE={open(id='fuente'){trigger=document.activeElement;select(id);sync();$('xpError').textContent='';if(!d.open)d.showModal();cancelAnimationFrame(frame);frame=requestAnimationFrame(paint);},close(){d.close();}};
  d.addEventListener('close',()=>{cancelAnimationFrame(frame);trigger?.focus();});d.addEventListener('keydown',e=>e.stopPropagation());
  async function run(fn){if(busy)return;busy=true;d.setAttribute('aria-busy','true');$('xpError').textContent='';try{await fn();sync();}catch(e){$('xpError').textContent=e.name==='NotAllowedError'?'no se concedió permiso para esa fuente':e.message||'no se pudo conectar el audio';}finally{busy=false;d.removeAttribute('aria-busy');}}
  d.addEventListener('click',e=>{const b=e.target.closest('button');if(!b)return;if(b.dataset.xpTab)return select(b.dataset.xpTab);if(b.dataset.preset){E.preset(b.dataset.preset);return sync();}if(b.dataset.biome){U.set({biome:b.dataset.biome});return sync();}const actions={xpClose:()=>X.close(),xpPlay:()=>run(()=>ext.cmd('playpause')),xpCapture:()=>run(()=>E.capture()),xpSystem:()=>run(()=>E.system()),xpDevices:()=>run(async()=>{const devices=await E.devices();$('xpInputBox').hidden=false;$('xpInput').innerHTML='<option value="">elige una entrada</option>'+devices.map(v=>`<option value="${esc(v.deviceId)}">${esc(v.label||'entrada de audio')}</option>`).join('');}),xpConnect:()=>run(()=>E.input($('xpInput').value)),xpDisconnect:()=>{E.detach();sync();},xpApply:()=>{U.set({seed:$('xpSeed').value});sync();},xpNext:()=>{U.next();sync();}};actions[b.id]?.();});
  d.addEventListener('input',e=>{const k=e.target.dataset.audio;if(e.target.type==='range')fill(e.target);if(k){E.update({[k]:+e.target.value});sync();}if(e.target.id==='xpDensity')$('xpDensityValue').textContent=(+e.target.value).toFixed(2)+'×';});
  d.addEventListener('change',e=>{if(e.target.id==='xpFile')run(()=>E.loadFile(e.target.files[0]));if(e.target.id==='xpMonitor')E.setMonitor(e.target.checked);if(e.target.id==='xpFollow')E.update({follow:e.target.checked});if(e.target.id==='xpDensity')U.set({density:+e.target.value});if(e.target.id==='xpTimeline'&&E.kind==='file'&&Number.isFinite(audio.duration))audio.currentTime=+e.target.value*audio.duration;});
  addEventListener('lumora:sonido',()=>{if(d.open)sync();});addEventListener('lumora:universo',()=>{if(d.open)sync();});
  if(window.SETUI)SETUI.addRow('experiencia',['experiencia','música y universo','btn',{texto:'abrir experiencia',fn:()=>X.open()},'procesamiento de sonido real, ambientes acústicos y mundos procedurales por canción']);
  const button=document.createElement('button');button.id='hudExperience';button.innerHTML='<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 10h2v4H4zm4-4h2v12H8zm4-3h2v18h-2zm4 5h2v8h-2zm4 2h2v4h-2z"/></svg>';button.title='sonido y universo procedural';button.setAttribute('aria-label','experiencia: sonido y universo procedural');button.addEventListener('click',()=>X.open('sonido'));($('hudMain')||$('hudTools'))?.prepend(button);
  const homeButton=document.createElement('button');homeButton.className='aut-btn';homeButton.textContent='música local / sonido';homeButton.addEventListener('click',()=>X.open());document.querySelector('#home .home-foot')?.appendChild(homeButton);
})();
