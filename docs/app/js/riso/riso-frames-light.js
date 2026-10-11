// iluminación de metraje: tres pasadas gpu, reloj musical y negros preservados.
(() => {
  'use strict';
  const clamp=(x,a=0,b=1)=>Math.max(a,Math.min(b,x));
  function sample(time,grid,options={}){
    const bpm=grid?.bpm||options.bpm||100,phase=grid?.phase??options.phase??0;
    const beat=Math.max(0,(time-phase)*bpm/60),i=Math.floor(beat),f=beat-i;
    const energy=clamp(grid?.energy?.[i]??.55),strength=clamp(grid?.strength?.[i]??.6);
    const pulse=options.flashes===false?0:Math.exp(-f*7)*( .25+strength*.75);
    // transición continua entre paletas cada dieciséis pulsos, sin saltos al buscar.
    const palettes=[[.16,.8,1],[1,.22,.55],[.7,.35,1],[1,.62,.18]],phrase=beat/16,k=Math.floor(phrase),t=phrase-k,s=t*t*(3-2*t);
    const tint=palettes[k%4].map((v,j)=>v+(palettes[(k+1)%4][j]-v)*s);
    return {energy,pulse,tint,bloom:.38+energy*.38+pulse*.65,split:.00045+pulse*(.002+energy*.0014),saturation:1.12+energy*.18+pulse*.15};
  }
  const vertex='attribute vec2 p; varying vec2 uv; void main(){uv=p*.5+.5;gl_Position=vec4(p,0.,1.);}';
  const header='precision mediump float; varying vec2 uv; uniform sampler2D image;';
  const blur=header+`
    uniform vec2 stepSize; uniform float extract;
    vec3 tap(vec2 pos){vec3 c=texture2D(image,clamp(pos,vec2(0.),vec2(1.))).rgb;
      return mix(c,c*smoothstep(.26,.85,max(c.r,max(c.g,c.b))),extract);}
    void main(){vec3 c=tap(uv)*.227027;
      c+=(tap(uv+stepSize*1.384615)+tap(uv-stepSize*1.384615))*.316216;
      c+=(tap(uv+stepSize*3.230769)+tap(uv-stepSize*3.230769))*.070270;
      gl_FragColor=vec4(c,1.);}`;
  const composite=header+`
    uniform sampler2D glow; uniform vec3 tint; uniform float bloom,split,saturation;
    void main(){vec2 radial=(uv-.5)*2.;vec2 shift=radial*split;
      vec3 c=vec3(texture2D(image,clamp(uv+shift,vec2(0.),vec2(1.))).r,texture2D(image,uv).g,texture2D(image,clamp(uv-shift,vec2(0.),vec2(1.))).b);
      float l=dot(c,vec3(.2126,.7152,.0722));c=max(vec3(0.),mix(vec3(l),c,saturation));
      c*=mix(vec3(1.),vec3(.83)+tint*.38,.55);
      vec3 light=texture2D(glow,uv).rgb*(vec3(.58)+tint*.7)*bloom;
      // luz acotada: conserva detalle en las zonas brillantes.
      c=1.-(1.-clamp(c,0.,1.))*exp(-light*1.6);
      gl_FragColor=vec4(c,1.);}`;
  let gpu=null,attempted=false;
  function init(){
    if(attempted)return gpu;attempted=true;
    const canvas=document.createElement('canvas'),gl=canvas.getContext('webgl',{alpha:false,antialias:false,depth:false,preserveDrawingBuffer:true});
    if(!gl)return null;
    const shaders=[],programs=[],textures=[],buffers=[],targets=[];
    function destroy(){for(const x of programs)gl.deleteProgram(x);for(const x of shaders)gl.deleteShader(x);for(const x of textures)gl.deleteTexture(x);for(const x of buffers)gl.deleteBuffer(x);for(const x of targets)gl.deleteFramebuffer(x);gpu=null;}
    try{
      function shader(type,code){const s=gl.createShader(type);shaders.push(s);gl.shaderSource(s,code);gl.compileShader(s);if(!gl.getShaderParameter(s,gl.COMPILE_STATUS))throw Error(gl.getShaderInfoLog(s));return s;}
      const vs=shader(gl.VERTEX_SHADER,vertex);
      function program(code,names){const p=gl.createProgram();programs.push(p);gl.attachShader(p,vs);gl.attachShader(p,shader(gl.FRAGMENT_SHADER,code));gl.linkProgram(p);if(!gl.getProgramParameter(p,gl.LINK_STATUS))throw Error(gl.getProgramInfoLog(p));return {p,position:gl.getAttribLocation(p,'p'),u:Object.fromEntries(names.map(n=>[n,gl.getUniformLocation(p,n)]))};}
      const blurPass=program(blur,['image','stepSize','extract']),finish=program(composite,['image','glow','tint','bloom','split','saturation']);
      const quad=gl.createBuffer();buffers.push(quad);gl.bindBuffer(gl.ARRAY_BUFFER,quad);gl.bufferData(gl.ARRAY_BUFFER,new Float32Array([-1,-1,1,-1,-1,1,1,1]),gl.STATIC_DRAW);
      function texture(){const t=gl.createTexture();textures.push(t);gl.bindTexture(gl.TEXTURE_2D,t);gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_MIN_FILTER,gl.LINEAR);gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_MAG_FILTER,gl.LINEAR);gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_WRAP_S,gl.CLAMP_TO_EDGE);gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_WRAP_T,gl.CLAMP_TO_EDGE);return t;}
      const source=texture(),a=texture(),b=texture(),fa=gl.createFramebuffer(),fb=gl.createFramebuffer();targets.push(fa,fb);
      let bw=0,bh=0;
      function target(f,t,w,h){gl.bindTexture(gl.TEXTURE_2D,t);gl.texImage2D(gl.TEXTURE_2D,0,gl.RGBA,w,h,0,gl.RGBA,gl.UNSIGNED_BYTE,null);gl.bindFramebuffer(gl.FRAMEBUFFER,f);gl.framebufferTexture2D(gl.FRAMEBUFFER,gl.COLOR_ATTACHMENT0,gl.TEXTURE_2D,t,0);if(gl.checkFramebufferStatus(gl.FRAMEBUFFER)!==gl.FRAMEBUFFER_COMPLETE)throw Error('framebuffer');}
      function use(pass,input,frame,w,h){gl.bindFramebuffer(gl.FRAMEBUFFER,frame);gl.viewport(0,0,w,h);gl.useProgram(pass.p);gl.bindBuffer(gl.ARRAY_BUFFER,quad);gl.enableVertexAttribArray(pass.position);gl.vertexAttribPointer(pass.position,2,gl.FLOAT,false,0,0);gl.activeTexture(gl.TEXTURE0);gl.bindTexture(gl.TEXTURE_2D,input);gl.uniform1i(pass.u.image,0);}
      canvas.addEventListener('webglcontextlost',e=>{e.preventDefault();gpu=null;});
      canvas.addEventListener('webglcontextrestored',()=>{destroy();attempted=false;});
      gpu={canvas,destroy,render(input,w,h,q){
        w=Math.max(1,Math.round(w));h=Math.max(1,Math.round(h));
        if(canvas.width!==w||canvas.height!==h){canvas.width=w;canvas.height=h;}
        const nw=Math.max(1,Math.round(Math.min(w,480))),nh=Math.max(1,Math.round(h*nw/w));
        if(nw!==bw||nh!==bh){bw=nw;bh=nh;target(fa,a,bw,bh);target(fb,b,bw,bh);}
        gl.activeTexture(gl.TEXTURE0);gl.bindTexture(gl.TEXTURE_2D,source);gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL,true);gl.texImage2D(gl.TEXTURE_2D,0,gl.RGBA,gl.RGBA,gl.UNSIGNED_BYTE,input);
        use(blurPass,source,fa,bw,bh);gl.uniform2f(blurPass.u.stepSize,1.8/bw,0);gl.uniform1f(blurPass.u.extract,1);gl.drawArrays(gl.TRIANGLE_STRIP,0,4);
        use(blurPass,a,fb,bw,bh);gl.uniform2f(blurPass.u.stepSize,0,1.8/bh);gl.uniform1f(blurPass.u.extract,0);gl.drawArrays(gl.TRIANGLE_STRIP,0,4);
        use(finish,source,null,w,h);gl.activeTexture(gl.TEXTURE1);gl.bindTexture(gl.TEXTURE_2D,b);gl.uniform1i(finish.u.glow,1);
        gl.uniform3fv(finish.u.tint,q.tint);gl.uniform1f(finish.u.bloom,q.bloom);gl.uniform1f(finish.u.split,q.split);gl.uniform1f(finish.u.saturation,q.saturation);gl.drawArrays(gl.TRIANGLE_STRIP,0,4);
        return canvas;
      }};
    }catch{destroy();}
    return gpu;
  }
  const small=document.createElement('canvas'),s=small.getContext('2d'),channels=Array.from({length:3},()=>{const c=document.createElement('canvas');return {c,ctx:c.getContext('2d')};});
  function fallback(ctx,source,x,y,w,h,q){
    const sw=Math.max(1,Math.round(Math.min(w,480))),sh=Math.max(1,Math.round(h*sw/w));
    if(small.width!==sw||small.height!==sh){small.width=sw;small.height=sh;}
    s.clearRect(0,0,sw,sh);s.drawImage(source,0,0,sw,sh);
    const pixels=s.getImageData(0,0,sw,sh),data=pixels.data;
    for(let i=0;i<data.length;i+=4){const v=Math.max(data[i],data[i+1],data[i+2])/255,t=clamp((v-.26)/.59),gain=t*t*(3-2*t);for(let j=0;j<3;j++)data[i+j]*=gain;}
    s.putImageData(pixels,0,0);
    ctx.save();ctx.globalCompositeOperation='screen';
    for(let j=0;j<3;j++){
      const {c,ctx:b}=channels[j];if(c.width!==sw||c.height!==sh){c.width=sw;c.height=sh;}
      b.globalCompositeOperation='source-over';b.drawImage(small,0,0);b.globalCompositeOperation='multiply';b.fillStyle=['#ff0000','#00ff00','#0000ff'][j];b.fillRect(0,0,sw,sh);
      ctx.globalAlpha=Math.min(.8,q.bloom*(.3+q.tint[j]*.4));ctx.filter='blur('+Math.max(2,w*.007)+'px)';ctx.drawImage(c,x+(j-1)*w*q.split,y,w,h);
    }
    ctx.restore();
  }
  function render(ctx,w,h,time,source,grid,options={}){
    if(options.reducedMotion)return false;
    const iw=source.videoWidth||source.width,ih=source.videoHeight||source.height;if(!iw||!ih)return false;
    const scale=Math.min(w/iw,h/ih),dw=iw*scale,dh=ih*scale,x=(w-dw)/2,y=(h-dh)/2,q=sample(time,grid,options);
    const renderer=options.forceFallback?null:init();
    ctx.save();ctx.beginPath();ctx.rect(x,y,dw,dh);ctx.clip();
    try{
      if(renderer){const rw=Math.min(iw,1280),rh=Math.round(ih*rw/iw);ctx.drawImage(renderer.render(source,rw,rh,q),x,y,dw,dh);}
      else fallback(ctx,source,x,y,dw,dh,q);
    }catch{gpu?.destroy();fallback(ctx,source,x,y,dw,dh,q);}
    finally{ctx.restore();}
    window.LMFRAMESINK?.render(ctx,w,h,time,source,grid,options);
    return true;
  }
  addEventListener('pagehide',()=>gpu?.destroy(),{once:true});
  window.LMFRAMESLIGHT={sample,render,get backend(){return gpu?'webgl':'canvas';}};
})();
