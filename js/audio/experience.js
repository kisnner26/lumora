// procesamiento real de la señal: archivo local, pestaña compartida o entrada de loopback.
(() => {
  const clamp=(v,a=0,b=1)=>Math.max(a,Math.min(b,v));
  const presets={original:{label:'original',room:0,echo:0,space:0,bass:0,air:0,decay:1},sala:{label:'sala íntima',room:.28,echo:.08,space:.2,bass:0,air:-1,decay:1.1},fiesta:{label:'desde la fiesta',room:.5,echo:.42,space:.42,bass:2,air:-3,decay:1.8},catedral:{label:'catedral',room:.85,echo:.25,space:.35,bass:-1,air:-2,decay:3.2},inmersivo:{label:'espacio binaural',room:.25,echo:.12,space:.85,bass:1,air:1,decay:1.6}};
  const defaults={preset:'original',room:0,echo:0,space:0,bass:0,air:0,volume:.8,follow:false};
  function clean(v={}){const out={...defaults};out.preset=Object.hasOwn(presets,v.preset)?v.preset:'original';for(const k of ['room','echo','space','volume'])out[k]=Number.isFinite(+v[k])?clamp(+v[k]):defaults[k];for(const k of ['bass','air'])out[k]=Number.isFinite(+v[k])?clamp(+v[k],-6,6):0;out.follow=v.follow===true;return out;}
  let stored={};try{stored=JSON.parse(localStorage.getItem('lumora_sonido')||'{}');}catch(e){}
  const E=window.LMAUDIO={presets,clean,settings:clean(stored),ctx:null,graph:null,source:null,stream:null,kind:'none',label:'sin fuente procesable',localMeta:null,features:{rms:0,low:0,mid:0,high:0,centroid:0,pulse:0},monitor:false,metering:false,generation:0,media:new WeakMap(),ir:new Map(),timer:null,
    context(){if(!this.ctx)this.ctx=new(window.AudioContext||window.webkitAudioContext)({latencyHint:'playback'});return this.ctx;},
    impulse(ctx,seconds){const key=ctx.sampleRate+'|'+seconds;if(this.ir.has(key))return this.ir.get(key);const n=Math.round(ctx.sampleRate*seconds),b=ctx.createBuffer(2,n,ctx.sampleRate);let seed=219879;for(let ch=0;ch<2;ch++){const d=b.getChannelData(ch);for(let i=0;i<n;i++){seed=(Math.imul(seed,1664525)+1013904223)>>>0;d[i]=i<ctx.sampleRate*.012?0:((seed/4294967296)*2-1)*Math.pow(1-i/n,2.8);}}if(this.ir.size>5)this.ir.clear();this.ir.set(key,b);return b;},
    build(ctx){
      const gain=v=>{const n=ctx.createGain();n.gain.value=v;return n;},input=gain(1),bass=ctx.createBiquadFilter(),air=ctx.createBiquadFilter(),analyser=ctx.createAnalyser(),split=ctx.createChannelSplitter(2),merge=ctx.createChannelMerger(2);
      input.channelCount=2;input.channelCountMode='explicit';input.channelInterpretation='speakers';bass.type='lowshelf';bass.frequency.value=180;air.type='highshelf';air.frequency.value=3500;analyser.fftSize=1024;analyser.smoothingTimeConstant=.65;
      input.connect(bass).connect(air);air.connect(analyser);air.connect(split);
      const ll=gain(1),rr=gain(1),lr=gain(0),rl=gain(0),stereo=gain(1),spatial=gain(0);
      split.connect(ll,0);split.connect(lr,0);split.connect(rr,1);split.connect(rl,1);ll.connect(merge,0,0);rl.connect(merge,0,0);lr.connect(merge,0,1);rr.connect(merge,0,1);merge.connect(stereo);
      const pan=()=>{const n=ctx.createPanner();n.panningModel='HRTF';n.distanceModel='inverse';n.refDistance=1;n.maxDistance=100;n.rolloffFactor=0;return n;},left=pan(),right=pan();split.connect(left,0);split.connect(right,1);left.connect(spatial);right.connect(spatial);
      const reverb=ctx.createConvolver(),reverbGain=gain(0),delay=ctx.createDelay(1.5),feedback=gain(0),echoGain=gain(0),damp=ctx.createBiquadFilter(),bus=gain(1),limiter=ctx.createDynamicsCompressor(),master=gain(.8),gate=gain(0);
      damp.type='lowpass';damp.frequency.value=4800;air.connect(reverb).connect(reverbGain).connect(bus);air.connect(delay).connect(damp);damp.connect(feedback).connect(delay);damp.connect(echoGain).connect(bus);stereo.connect(bus);spatial.connect(bus);
      limiter.threshold.value=-5;limiter.knee.value=6;limiter.ratio.value=12;limiter.attack.value=.003;limiter.release.value=.2;bus.connect(limiter).connect(master).connect(gate).connect(ctx.destination);
      const graph={ctx,input,bass,air,analyser,ll,rr,lr,rl,stereo,spatial,left,right,reverb,reverbGain,delay,feedback,echoGain,master,gate,limiter};this.configure(graph,this.settings,false);return graph;
    },
    configure(g,s,smooth=true){const now=g.ctx.currentTime,param=(p,v)=>{if(smooth){p.cancelScheduledValues(now);p.setTargetAtTime(v,now,.05);}else p.value=v;};const spec=presets[s.preset]||presets.original;
      param(g.bass.gain,s.bass);param(g.air.gain,s.air);param(g.master.gain,s.volume);
      const width=1+s.space*.3,sp=s.space*.65;param(g.ll.gain,(1+width)/2);param(g.rr.gain,(1+width)/2);param(g.lr.gain,(1-width)/2);param(g.rl.gain,(1-width)/2);param(g.stereo.gain,1-sp);param(g.spatial.gain,sp*.7);
      for(const [n,side]of [[g.left,-1],[g.right,1]]){param(n.positionX,side*(.5+s.space*1.5));param(n.positionY,s.space*.3);param(n.positionZ,-1);}
      const impulse=this.impulse(g.ctx,spec.decay);if(g.reverb.buffer!==impulse)g.reverb.buffer=impulse;
      param(g.reverbGain.gain,s.room*.28);param(g.echoGain.gain,s.echo*.3);param(g.feedback.gain,s.echo*.42);
      const bpm=typeof IN!=='undefined'?IN.bpm:0;param(g.delay.delayTime,clamp(bpm>40?60/bpm*.75:.29,.12,.7));
    },
    update(v){this.settings=clean({...this.settings,...v});if(this.graph)this.configure(this.graph,this.settings);try{localStorage.setItem('lumora_sonido',JSON.stringify(this.settings));}catch(e){}dispatchEvent(new CustomEvent('lumora:sonido'));},
    preset(id){if(!Object.hasOwn(presets,id))return;const p=presets[id];this.update({preset:id,room:p.room,echo:p.echo,space:p.space,bass:p.bass,air:p.air});},
    setMonitor(on){if(!on&&this.kind==='system'){this.detach();return;}this.monitor=!!on;if(this.graph){const p=this.graph.gate.gain;p.cancelScheduledValues(this.ctx.currentTime);p.setTargetAtTime(this.monitor?1:0,this.ctx.currentTime,.025);}dispatchEvent(new CustomEvent('lumora:sonido'));},
    async ready(){const ctx=this.context();if(ctx.state==='suspended')await ctx.resume();if(!this.graph)this.graph=this.build(ctx);return this.graph;},
    detach(){this.generation++;this.abort?.abort();this.abort=null;clearInterval(this.timer);this.timer=null;this.source?.disconnect();this.source=null;const old=this.stream;this.stream=null;old?.getTracks().forEach(t=>t.stop());this.kind='none';this.setMonitor(false);this.metering=false;this.label='sin fuente procesable';this.features={rms:0,low:0,mid:0,high:0,centroid:0,pulse:0};if(this.localMeta){audio.pause();this.localMeta=null;ext.refresh?.();}dispatchEvent(new CustomEvent('lumora:sonido'));},
    async attachElement(element){const g=await this.ready();if(this.source&&this.kind==='file'&&this.element===element)return g;this.detach();const node=this.media.get(element)||this.ctx.createMediaElementSource(element);this.media.set(element,node);node.connect(g.input);this.source=node;this.element=element;this.kind='file';this.label=element===audio?(this.fileName||'archivo local'):'reproductor local';this.setMonitor(true);this.startMeter();return g;},
    async loadFile(file){if(!file)return;audio.pause();this.detach();if(this.fileURL)URL.revokeObjectURL(this.fileURL);this.fileURL=URL.createObjectURL(file);this.fileName=file.name;audio.src=this.fileURL;audio.load();await this.attachElement(audio);const parts=file.name.replace(/\.[^.]+$/,'').split(' - ');this.localMeta={name:parts.length>1?parts.slice(1).join(' - '):parts[0],artist:parts.length>1?parts[0]:'archivo local',album:'sesión local',art:this.localCover(parts[0])};await ext.refresh?.();dispatchEvent(new CustomEvent('lumora:sonido'));},
    localCover(title){if(this.coverURL)URL.revokeObjectURL(this.coverURL);const c=document.createElement('canvas');c.width=c.height=512;const x=c.getContext('2d');x.fillStyle='#f6eee2';x.fillRect(0,0,512,512);let n=0;for(const ch of title)n=Math.imul(n^ch.charCodeAt(0),16777619);for(let i=0;i<18;i++){x.fillStyle=['#212b80','#f66f24','#60a1c0'][i%3];const y=(Math.sin(n+i*2.1)+1)*180;x.fillRect(i*32-20,y,20+(i%4)*7,320-y);}x.fillStyle='#212b80';x.font='bold 32px monospace';x.fillText('lumora / local',24,465);return c.toDataURL('image/png');},
    syncMeta(){return {...this.localMeta,src:'local',state:audio.paused?'paused':'playing',pos:audio.currentTime,dur:Number.isFinite(audio.duration)?audio.duration:0,at:0,server:0};},
    async localCommand(cmd){if(!this.localMeta)return false;if(cmd==='playpause'){if(audio.paused){await this.ctx?.resume();await audio.play();}else audio.pause();}else if(cmd==='start'||cmd==='prev')audio.currentTime=0;else if(cmd==='next')audio.pause();else if(cmd.startsWith('goto:'))audio.currentTime=clamp(+cmd.slice(5),0,Number.isFinite(audio.duration)?audio.duration:1e9);else if(cmd.startsWith('seek:'))audio.currentTime=clamp(audio.currentTime+(+cmd.slice(5)||0),0,Number.isFinite(audio.duration)?audio.duration:1e9);return true;},
    async connectStream(stream,label,kind,monitor=false){const g=await this.ready();this.detach();this.stream=stream;this.source=this.ctx.createMediaStreamSource(stream);this.source.connect(g.input);this.kind=kind;this.label=label;const generation=this.generation;stream.getAudioTracks().forEach(t=>t.addEventListener('ended',()=>{if(this.generation===generation)this.detach();},{once:true}));this.setMonitor(monitor);this.startMeter();},
    async capture(){if(!navigator.mediaDevices?.getDisplayMedia)throw Error('este navegador no permite capturar audio de una pestaña; usa un archivo o una entrada de loopback');const stream=await navigator.mediaDevices.getDisplayMedia({video:true,audio:{suppressLocalAudioPlayback:true,echoCancellation:false,noiseSuppression:false,autoGainControl:false},systemAudio:'include',selfBrowserSurface:'exclude'});const track=stream.getAudioTracks()[0];if(!track){stream.getTracks().forEach(t=>t.stop());throw Error('la selección no incluye audio. comparte una pestaña con sonido y activa compartir audio');}try{await this.connectStream(stream,'pestaña · '+track.label,'capture',track.getSettings().suppressLocalAudioPlayback===true);}catch(e){stream.getTracks().forEach(t=>t.stop());throw e;}},
    async system(solo=''){this.detach();const generation=this.generation,g=await this.ready(),ctx=this.ctx;if(this.generation!==generation)return;
      // la red y el relleno de muestras viven fuera del hilo principal: un worker lee y un worklet reproduce con un colchón propio
      if(!this.worklet){const code=`class P extends AudioWorkletProcessor{constructor(){super();this.cap=131072;this.mask=this.cap-1;this.L=new Float32Array(this.cap);this.R=new Float32Array(this.cap);this.w=0;this.r=0;this.base=1;this.target=sampleRate*.2;this.on=false;this.under=0;this.t=0;this.port.onmessage=e=>{if(e.data.port)e.data.port.onmessage=v=>this.get(v.data);};}
get(d){if(d.rate){this.base=d.rate/sampleRate;this.inputRate=d.rate;this.target=d.rate*.2;return;}const f=d.pcm,n=f.length>>1;if(this.w-this.r+n>this.cap*.9){this.r=this.w-this.target;}for(let i=0;i<n;i++){const k=(this.w+i)&this.mask;this.L[k]=f[i*2];this.R[k]=f[i*2+1];}this.w+=n;}
process(_,o){const out=o[0],n=out[0].length;let fill=this.w-this.r;if(!this.on){if(fill>=this.target)this.on=true;else return true;}
const e=(fill-this.target)/(this.inputRate||sampleRate),ratio=this.base*(1+Math.max(-.01,Math.min(.01,e*.05)));
for(let i=0;i<n;i++){fill=this.w-this.r;if(fill<ratio+2){this.on=false;this.under++;break;}const j=Math.floor(this.r),fr=this.r-j,a=j&this.mask,b=(j+1)&this.mask;out[0][i]=this.L[a]+(this.L[b]-this.L[a])*fr;out[1][i]=this.R[a]+(this.R[b]-this.R[a])*fr;this.r+=ratio;}
this.t+=n;if(this.t>sampleRate/2){this.t=0;this.port.postMessage({fill:(this.w-this.r)/(this.inputRate||sampleRate),under:this.under});}return true;}}registerProcessor('lumora-pcm',P);`;
        const url=URL.createObjectURL(new Blob([code],{type:'text/javascript'}));this.worklet=ctx.audioWorklet.addModule(url).catch(e=>{this.worklet=null;throw e;}).finally(()=>URL.revokeObjectURL(url));}
      await this.worklet;if(this.generation!==generation)return;
      const node=new AudioWorkletNode(ctx,'lumora-pcm',{numberOfInputs:0,outputChannelCount:[2]}),mc=new MessageChannel();node.port.postMessage({port:mc.port1},[mc.port1]);
      const wcode=`onmessage=async e=>{const{url,port}=e.data;let r;try{r=await fetch(url,{cache:'no-store'});}catch(x){postMessage({error:'no se pudo contactar con el tomador de audio; usa la app de lumora'});return;}
if(!r.ok){const j=await r.json().catch(()=>({}));postMessage({error:j.error||'el tomador de audio no está disponible',permiso:!!j.permiso});return;}
const rd=r.body.getReader();let carry=new Uint8Array(0),rate=0,announced=false;
try{for(;;){const{done,value}=await rd.read();if(done)break;let u=value;if(carry.length){u=new Uint8Array(carry.length+value.length);u.set(carry);u.set(value,carry.length);}let off=0;if(!rate){if(u.length<4){carry=u;continue;}rate=new DataView(u.buffer,u.byteOffset).getFloat32(0,true);if(!Number.isFinite(rate)||rate<8000||rate>384000)throw Error('frecuencia inválida');off=4;port.postMessage({rate});}
const frames=Math.floor((u.length-off)/8);carry=u.slice(off+frames*8);if(!frames)continue;const f=new Float32Array(frames*2);f.set(new Float32Array(u.buffer.slice(u.byteOffset+off,u.byteOffset+off+frames*8)));port.postMessage({pcm:f},[f.buffer]);if(!announced){announced=true;postMessage({ok:1});}}}catch(x){}
postMessage({ended:1});};`;
      const workerURL=URL.createObjectURL(new Blob([wcode],{type:'text/javascript'}));
      const worker=new Worker(workerURL),session=crypto.randomUUID();
      let stopped=false,finished=false,rejectReady,timer;
      const stop=()=>{
        if(stopped)return;stopped=true;clearTimeout(timer);
        rejectReady?.(Error('captura cancelada'));worker.terminate();URL.revokeObjectURL(workerURL);
        try{node.disconnect();}catch(e){}node.port.close?.();
        fetch('/pcm/stop?session='+encodeURIComponent(session),{method:'POST',keepalive:true}).catch(()=>{});
      };
      this.abort={abort:stop};
      try{
        await new Promise((resolve,reject)=>{
          rejectReady=reject;
          const failed=error=>{finished=true;reject(error);if(this.generation===generation&&this.kind==='system')this.detach();};
          timer=setTimeout(()=>failed(Error('el tomador no entregó audio a tiempo')),12000);
          worker.onmessage=e=>{
            if(e.data.ok){clearTimeout(timer);resolve();}
            else if(e.data.error)failed(Error(e.data.permiso?'macos no concedió el permiso de audio del sistema. actívalo para lumora en ajustes del sistema > privacidad y seguridad > grabación de audio del sistema':e.data.error));
            else if(e.data.ended)failed(Error('el tomador de audio se cerró'));
          };
          worker.onerror=()=>failed(Error('no se pudo iniciar el lector de audio'));
          worker.postMessage({url:location.origin+'/pcm?session='+encodeURIComponent(session)+(solo?'&solo='+encodeURIComponent(solo):''),port:mc.port2},[mc.port2]);
        });
        if(this.generation!==generation||finished){stop();return;}
      }catch(e){stop();if(this.generation!==generation)return;this.abort=null;throw e;}
      let seen=0;node.port.onmessage=e=>{this.sysStats=e.data;if(e.data.under>seen){seen=e.data.under;try{fetch('/log',{method:'POST',body:'audio del sistema: corte '+seen+' · colchón '+e.data.fill.toFixed(3)+' s · fs '+ctx.sampleRate});}catch(x){}}};
      node.connect(g.input);this.source=node;this.kind='system';this.label=solo?'sistema · '+solo:'audio del sistema';this.setMonitor(true);this.startMeter();dispatchEvent(new CustomEvent('lumora:sonido'));},
    async devices(){const temp=await navigator.mediaDevices.getUserMedia({audio:true});temp.getTracks().forEach(t=>t.stop());return (await navigator.mediaDevices.enumerateDevices()).filter(d=>d.kind==='audioinput');},
    async input(deviceId){if(!deviceId)throw Error('elige una entrada de música');const stream=await navigator.mediaDevices.getUserMedia({audio:{deviceId:{exact:deviceId},echoCancellation:false,noiseSuppression:false,autoGainControl:false},video:false});try{await this.connectStream(stream,stream.getAudioTracks()[0]?.label||'entrada de música','input',false);}catch(e){stream.getTracks().forEach(t=>t.stop());throw e;}},
    startMeter(){clearInterval(this.timer);const g=this.graph,fft=new Uint8Array(g.analyser.frequencyBinCount),wave=new Float32Array(g.analyser.fftSize);let average=0,variance=0,lastHit=0,fast=0,slow=0,lastFollow='';
      this.timer=setInterval(()=>{const live=this.kind!=='none'&&(this.kind!=='file'||!this.element.paused);this.metering=live;if(!live){this.features.rms=0;return;}g.analyser.getByteFrequencyData(fft);g.analyser.getFloatTimeDomainData(wave);let square=0,weighted=0,total=0;for(const s of wave)square+=s*s;const rms=Math.sqrt(square/wave.length),nyquist=this.ctx.sampleRate/2;const band=(lo,hi)=>{let sum=0,count=0;for(let i=Math.max(1,Math.floor(lo/nyquist*fft.length));i<Math.min(fft.length,Math.ceil(hi/nyquist*fft.length));i++){sum+=fft[i]/255;count++;}return sum/Math.max(1,count);};for(let i=1;i<fft.length;i++){weighted+=i*fft[i];total+=fft[i];}const low=band(30,220),mid=band(220,2500),high=band(2500,12000),now=performance.now(),flux=low-average;average+=.08*(low-average);variance+=.08*(flux*flux-variance);let hit=false;if(flux>Math.sqrt(variance)*1.5+.025&&now-lastHit>230){hit=true;lastHit=now;window.onOnset?.();}this.features={rms,low,mid,high,centroid:total?weighted/total/fft.length:0,pulse:hit?1:this.features.pulse*.8};
        if(window.AUD){AUD.lastMsg=now;AUD.live=true;AUD.status='audio procesable · '+this.label;AUD.level=clamp(rms*3);AUD.low=low;AUD.high=high;AUD.pulse=this.features.pulse;if(hit)AUD.hit=true;}fast+=.09*(rms*3-fast);slow+=.004*(rms*3-slow);if(typeof DROP!=='undefined')DROP.feed(fast,slow,now);
        if(this.settings.follow&&window.RISOCLIP?.shot?.narrative){const place=RISOCLIP.shot.narrative.place;if(place!==lastFollow){lastFollow=place;this.preset(place==='cuarto'?'sala':place==='espacio'?'inmersivo':place==='ciudad'?'fiesta':'original');}}
      },33);
    }
  };
  addEventListener('pagehide',()=>E.detach());
  audio.addEventListener('ended',()=>{if(E.localMeta){audio.pause();ext.refresh?.();}});
})();
