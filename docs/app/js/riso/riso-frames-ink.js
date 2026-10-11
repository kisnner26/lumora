// filtros del nivel: geometría y luminancia del metraje, sin imágenes prefabricadas.
(() => {
  'use strict';
  const clamp=v=>Math.max(0,Math.min(1,v)),smooth=v=>{v=clamp(v);return v*v*(3-2*v);};
  const modes=['color','edges','stipple','sketch','pixels'];
  function sample(time,grid,options={}){
    if(options.reducedMotion||options.flashes===false)return {mode:'color',id:0,mix:0,reveal:1,pulse:0};
    const bpm=grid?.bpm||options.bpm||100,phase=grid?.phase??options.phase??0,beat=Math.max(0,(time-phase)*bpm/60);
    const block=Math.floor(beat/16),local=beat%16;
    const forced=modes.includes(options.filter),mode=forced?options.filter:modes[1+block%4];
    const mix=forced?(mode==='color'?0:1):smooth((local-8)/1.5)*smooth((16-local)/1.5);
    const reveal=options.reveal??(forced?1:smooth((local-8)/2));
    return {mode,id:modes.indexOf(mode),mix,reveal,pulse:Math.exp(-(beat%1)*7)*(grid?.strength?.[Math.floor(beat)]??.6)};
  }
  const vertex='attribute vec2 p; varying vec2 uv; void main(){uv=p*.5+.5;gl_Position=vec4(p,0.,1.);}';
  const fragment=`
    #ifdef GL_FRAGMENT_PRECISION_HIGH
    precision highp float;
    #else
    precision mediump float;
    #endif
    varying vec2 uv;
    uniform sampler2D image; uniform vec2 resolution; uniform float mode,reveal,pulse;
    float lum(vec2 p){vec3 c=texture2D(image,clamp(p,vec2(0.),vec2(1.))).rgb;return dot(c,vec3(.2126,.7152,.0722));}
    float noise(vec2 p){p=mod(p,128.);return fract(sin(dot(p,vec2(12.9898,78.233)))*437.5);}
    void main(){
      vec2 texel=1./resolution;float l=lum(uv);
      float tl=lum(uv+texel*vec2(-1.,1.)),t=lum(uv+texel*vec2(0.,1.)),tr=lum(uv+texel);
      float left=lum(uv-vec2(texel.x,0.)),right=lum(uv+vec2(texel.x,0.));
      float bl=lum(uv-texel),b=lum(uv-vec2(0.,texel.y)),br=lum(uv+texel*vec2(1.,-1.));
      float edge=clamp(length(vec2(tr+2.*right+br-tl-2.*left-bl,tl+2.*t+tr-bl-2.*b-br)),0.,1.);
      vec2 pixel=uv*resolution;vec3 color;
      if(mode<1.5){float ink=smoothstep(.08,.65,edge);color=vec3(clamp(ink+l*.08,0.,1.));}
      else if(mode<2.5){
        float cell=4.;vec2 id=floor(pixel/cell),center=(id+.5)*cell/resolution;
        float density=pow(lum(center),.65);vec2 dotPos=fract(pixel/cell)-.5;
        float radius=(.08+sqrt(density)*.35)*(1.+pulse*.06);
        float dotInk=(1.-smoothstep(radius-.06,radius,length(dotPos)))*smoothstep(.025,.13,density);
        color=vec3(dotInk);
      }else if(mode<3.5){
        float hatch=1.-smoothstep(.08,.3,abs(fract((pixel.x+pixel.y)/6.)-.5));
        float cross=1.-smoothstep(.07,.23,abs(fract((pixel.x-pixel.y)/8.)-.5));
        float ink=clamp(edge*.85+l*(hatch*.3+cross*.12),0.,.95);
        float paper=.94+noise(floor(pixel))*.035;
        color=vec3(paper,paper*.985,paper*.955)*(1.-ink);
      }else{
        float cell=5.;vec2 id=floor(pixel/cell),center=(id+.5)*cell/resolution;
        float density=pow(lum(center),.65),threshold=.08+noise(id)*.8;
        vec2 q=abs(fract(pixel/cell)-.5);float square=(1.-step(.36,max(q.x,q.y)));
        float order=center.y*.8+center.x*.2;
        float drawn=step(order,reveal);color=vec3(step(threshold,density)*square*drawn);
      }
      gl_FragColor=vec4(color,1.);
    }`;
  let gpu=null,attempted=false;
  function init(){
    if(attempted)return gpu;attempted=true;
    const canvas=document.createElement('canvas'),gl=canvas.getContext('webgl',{alpha:false,antialias:false,depth:false,preserveDrawingBuffer:true});
    if(!gl)return null;
    const shaders=[];let program,texture,buffer;
    function destroy(){for(const s of shaders)gl.deleteShader(s);if(program)gl.deleteProgram(program);if(texture)gl.deleteTexture(texture);if(buffer)gl.deleteBuffer(buffer);gpu=null;}
    try{
      function compile(type,code){const s=gl.createShader(type);shaders.push(s);gl.shaderSource(s,code);gl.compileShader(s);if(!gl.getShaderParameter(s,gl.COMPILE_STATUS))throw Error(gl.getShaderInfoLog(s));return s;}
      program=gl.createProgram();gl.attachShader(program,compile(gl.VERTEX_SHADER,vertex));gl.attachShader(program,compile(gl.FRAGMENT_SHADER,fragment));gl.linkProgram(program);if(!gl.getProgramParameter(program,gl.LINK_STATUS))throw Error(gl.getProgramInfoLog(program));
      const u=Object.fromEntries(['image','resolution','mode','reveal','pulse'].map(n=>[n,gl.getUniformLocation(program,n)])),position=gl.getAttribLocation(program,'p');
      buffer=gl.createBuffer();gl.bindBuffer(gl.ARRAY_BUFFER,buffer);gl.bufferData(gl.ARRAY_BUFFER,new Float32Array([-1,-1,1,-1,-1,1,1,1]),gl.STATIC_DRAW);
      texture=gl.createTexture();gl.bindTexture(gl.TEXTURE_2D,texture);gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_MIN_FILTER,gl.LINEAR);gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_MAG_FILTER,gl.LINEAR);gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_WRAP_S,gl.CLAMP_TO_EDGE);gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_WRAP_T,gl.CLAMP_TO_EDGE);
      canvas.addEventListener('webglcontextlost',e=>{e.preventDefault();gpu=null;});canvas.addEventListener('webglcontextrestored',()=>{destroy();attempted=false;});
      gpu={destroy,render(source,w,h,q){
        if(canvas.width!==w||canvas.height!==h){canvas.width=w;canvas.height=h;}
        gl.viewport(0,0,w,h);gl.useProgram(program);gl.bindBuffer(gl.ARRAY_BUFFER,buffer);gl.enableVertexAttribArray(position);gl.vertexAttribPointer(position,2,gl.FLOAT,false,0,0);
        gl.activeTexture(gl.TEXTURE0);gl.bindTexture(gl.TEXTURE_2D,texture);gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL,true);gl.texImage2D(gl.TEXTURE_2D,0,gl.RGBA,gl.RGBA,gl.UNSIGNED_BYTE,source);
        gl.uniform1i(u.image,0);gl.uniform2f(u.resolution,w,h);gl.uniform1f(u.mode,q.id);gl.uniform1f(u.reveal,q.reveal);gl.uniform1f(u.pulse,q.pulse);gl.drawArrays(gl.TRIANGLE_STRIP,0,4);return canvas;
      }};
    }catch{destroy();}
    return gpu;
  }
  const fallbackCanvas=document.createElement('canvas'),fc=fallbackCanvas.getContext('2d',{willReadFrequently:true});
  function fallback(source,iw,ih,q){
    const scale=Math.min(1,480/Math.max(iw,ih)),w=Math.max(1,Math.round(iw*scale)),h=Math.max(1,Math.round(ih*scale));
    if(fallbackCanvas.width!==w||fallbackCanvas.height!==h){fallbackCanvas.width=w;fallbackCanvas.height=h;}
    fc.drawImage(source,0,0,w,h);const pixels=fc.getImageData(0,0,w,h),d=pixels.data,luma=new Float32Array(w*h);
    for(let i=0;i<luma.length;i++)luma[i]=(d[i*4]*.2126+d[i*4+1]*.7152+d[i*4+2]*.0722)/255;
    const at=(x,y)=>luma[Math.max(0,Math.min(h-1,y))*w+Math.max(0,Math.min(w-1,x))];
    const hash=(x,y)=>{const v=Math.sin(x*12.9898+y*78.233)*437.5;return v-Math.floor(v);};
    for(let y=0;y<h;y++)for(let x=0;x<w;x++){
      const i=y*w+x,l=luma[i],edge=clamp(Math.hypot(at(x+1,y)-at(x-1,y),at(x,y+1)-at(x,y-1))*3);let v;
      if(q.id===1)v=clamp(smooth((edge-.08)/.57)+l*.08);
      else if(q.id===3){const hatch=(x+y)%3===0?.3:0,cross=(x-y+1000)%4===0?.12:0;v=(.94+hash(x,y)*.035)*(1-Math.min(.95,edge*.85+l*(hatch+cross)));}
      else{
        const cell=3,cx=Math.floor(x/cell),cy=Math.floor(y/cell),density=Math.pow(at(cx*cell+1,cy*cell+1),.65);
        if(q.id===2){const dx=(x%cell+.5)/cell-.5,dy=(y%cell+.5)/cell-.5,radius=(.08+Math.sqrt(density)*.35)*(1+q.pulse*.06);v=(1-smooth((Math.hypot(dx,dy)-radius+.06)/.06))*smooth((density-.025)/.105);}
        else v=density>=.08+hash(cx,cy)*.8&&x%cell<2&&y%cell<2&&((1-y/h)*.8+x/w*.2)<=q.reveal?1:0;
      }
      d[i*4]=Math.round(v*255);d[i*4+1]=Math.round(v*255*(q.id===3?.985:1));d[i*4+2]=Math.round(v*255*(q.id===3?.955:1));d[i*4+3]=255;
    }
    fc.putImageData(pixels,0,0);return fallbackCanvas;
  }
  function render(ctx,w,h,time,source,grid,options={}){
    const q=sample(time,grid,options);if(q.mix<=.001)return q;
    const iw=source.videoWidth||source.width,ih=source.videoHeight||source.height;if(!iw||!ih)return q;
    const scale=Math.min(w/iw,h/ih),dw=iw*scale,dh=ih*scale;
    const outputScale=Math.min(1,1280/Math.max(iw,ih)),rw=Math.max(1,Math.round(iw*outputScale)),rh=Math.max(1,Math.round(ih*outputScale));
    let result;try{const renderer=options.forceFallback?null:init();result=renderer?renderer.render(source,rw,rh,q):fallback(source,iw,ih,q);}catch{gpu?.destroy();try{result=fallback(source,iw,ih,q);}catch{return q;}}
    ctx.save();ctx.globalAlpha=q.mix;ctx.imageSmoothingEnabled=q.id!==4;ctx.drawImage(result,(w-dw)/2,(h-dh)/2,dw,dh);ctx.restore();return q;
  }
  addEventListener('pagehide',()=>gpu?.destroy(),{once:true});
  window.LMFRAMESINK={sample,render,modes,get backend(){return gpu?'webgl':'canvas';}};
})();
