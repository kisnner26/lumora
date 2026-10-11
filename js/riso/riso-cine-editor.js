// mesa de dirección: los fotogramas usan el mismo dibujo que la reproducción.
(() => {
  const F = window.RISO?.film; if (!F || typeof AUT === 'undefined') return;
  const copy = v => JSON.parse(JSON.stringify(v));
  const style = document.createElement('style');
  style.textContent = `#cineBoard{display:flex;gap:8px;overflow:auto;padding:8px 12px;height:112px;border-bottom:1px solid var(--rule)}#cineBoard button{flex:0 0 130px;background:#231e1b;color:var(--paper);border:1px solid var(--rule);text-align:left;padding:4px;cursor:pointer}#cineBoard button[aria-pressed=true]{border-color:var(--gold)}#cineBoard canvas{position:static!important;inset:auto!important;display:block;width:120px;height:70px;background:#f6eee2}#cineBoard small{display:block;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;font:10px 'Martian Mono',monospace;padding-top:5px}#autTop{overflow-x:auto}#autTop>*{flex-shrink:0}#autTl{height:348px;grid-template-rows:38px 112px 1fr}.cine-grid{display:grid;grid-template-columns:1fr 1fr;gap:10px}.cine-grid label{font-size:12px;color:var(--mute)}.cine-grid select{margin-top:5px}#cineVersions{display:flex;gap:5px;align-items:center}#cineVersions select{max-width:130px;background:#231e1b;color:var(--paper);padding:7px;border:1px solid var(--rule)}#autor :focus-visible{outline:2px solid var(--gold);outline-offset:3px}@media(max-width:1200px){#autTop{gap:8px}#autTop .brand,#autTop .song{display:none}#autTop [data-act=claude],#autTop [data-act=blank]{display:none}}`;
  document.head.appendChild(style);
  const board = document.createElement('div'); board.id = 'cineBoard'; board.setAttribute('aria-label', 'fotogramas del guion');
  $('autTl').insertBefore(board, $('tlScroll'));
  const versions = document.createElement('div'); versions.id = 'cineVersions';
  versions.innerHTML = '<button class="aut-btn" id="cineSaveVersion">guardar versión</button><select id="cineVersion" aria-label="versiones de esta canción"><option value="">sin versiones</option></select><button class="aut-btn" id="cineRestore" disabled>restaurar</button>';
  $('autTop').insertBefore(versions, $('autSaved'));
  autEl.setAttribute('role', 'dialog'); autEl.setAttribute('aria-label', 'dirección del videoclip'); autEl.setAttribute('aria-modal', 'true');
  const status = document.createElement('span'); status.id = 'cineStatus'; status.setAttribute('role', 'status'); status.style.cssText = 'position:absolute;width:1px;height:1px;overflow:hidden;clip-path:inset(50%)'; autEl.appendChild(status);
  const announce = s => { status.textContent = s; toast(s); };
  autEl.querySelectorAll('button[title]').forEach(b => b.setAttribute('aria-label', b.title));
  const select = (field, label, choices, value = 'auto') => `<label>${label}<select data-cine="${field}" aria-label="${label}">${Object.entries(choices).map(([k, v]) => `<option value="${esc(k)}" ${value === k ? 'selected' : ''}>${esc(v)}</option>`).join('')}</select></label>`;
  const baseLine = renderLine, baseBlock = renderBlock, baseTimeline = drawTimeline, baseOpen = openAutor, baseClose = closeAutor;
  renderLine = function(i) {
    const e = AUT.P.cinema?.lines?.[i] || {};
    const controls = `<section><h4>dirección del verso</h4><div class="cine-grid">${select('action', 'acción', F.actions, e.action)}${select('camera', 'encuadre', F.cameras, e.camera)}${select('kind', 'tratamiento', {auto:'automático',tableau:'historia',singer:'artistas',scene:'escenario',prop:'objeto',giant:'tipografía'},e.kind)}${select('state', 'estado persistente', {auto:'automático',intact:'foto intacta',torn:'foto rota',fresh:'flor fresca',wilted:'flor marchita',occupied:'cuarto ocupado',empty:'cuarto vacío'},e.state)}${select('motif', 'objeto protagonista', {auto:'automático',...Object.fromEntries(Object.entries(RISO.catalog.info).map(([id,p])=>[id,p.label]))},e.motif || 'auto')}</div></section>`;
    return baseLine(i).replace('<section style=', controls + '<section style=');
  };
  renderBlock = function(i) { return baseBlock(i).replace('<section>', `<section><h4>estructura musical</h4>${select('role', 'función de la sección', F.roles, AUT.P.cinema?.sections?.[i])}<p style="font-size:12px;color:var(--mute)">la estimación usa repeticiones de la letra y energía del guion; puedes corregirla aquí.</p></section><section>`); };
  $('autIns').addEventListener('change', e => {
    const field = e.target.dataset.cine; if (!field) return;
    const value = e.target.value, sel = {...AUT.sel};
    edit(P => {
      P.cinema ||= {lines:{},sections:{}};
      if (field === 'role') P.cinema.sections[sel.i] = value;
      else { P.cinema.lines[sel.i] ||= {}; if (value === 'auto') delete P.cinema.lines[sel.i][field]; else P.cinema.lines[sel.i][field] = value; }
    });
    $('autIns').querySelector(`[data-cine="${field}"]`)?.focus();
  });
  let observer, boardKey = '', versionKey = '', versionRows = [], versionQueue = Promise.resolve();
  function thumbnail(canvas, beat) {
    const c = canvas.getContext('2d');
    c.fillStyle = '#000'; c.fillRect(0,0,canvas.width,canvas.height);
    const kit=RISO.K, previous={...kit}, stage=RISO.stage, previousInks=stage.inks, RC=RISOCLIP, scenes=RC.sceneState;
    const li=IN.lines.findIndex(l=>l.t===beat.t), time=beat.t+beat.duration*.48;
    const shot=RC.cardShot(li,beat.section.i,time);
    shot.narrative=beat;shot.k0=0;shot.text={li,text:IN.lines[li].text,t:beat.t,dur:beat.duration};shot.notes=[];
    Object.assign(kit,{c,t:beat.duration*.48,_base:canvas.width/1600,_pw:canvas.width,_ph:canvas.height,_cx:0,_cy:0,v:{l:0,t:0,r:1600,b:900,w:1600,h:900}});
    RC.sceneState={};c.save();c.scale(canvas.width/1600,canvas.height/900);
    try{RC.drawShot(shot,time,0);}finally{c.restore();Object.assign(kit,previous);stage.setInks(previousInks);RC.sceneState=scenes;}
    // la geometría de riso codifica tres planchas en rgb: revelar las tintas para la miniatura.
    const pixels=c.getImageData(0,0,canvas.width,canvas.height),d=pixels.data,paper=[246,238,226],inks=[[33,43,128],[246,111,36],[96,161,192]];
    for(let i=0;i<d.length;i+=4){const coverage=[d[i]/255,d[i+1]/255,d[i+2]/255];for(let j=0;j<3;j++)d[i+j]=paper[j]*coverage.reduce((v,t,k)=>v*(1-t*(1-inks[k][j]/255)),1);d[i+3]=255;}
    c.putImageData(pixels,0,0);
  }
  drawTimeline = function() {
    baseTimeline();
    for (const el of $('tlInner').querySelectorAll('[data-b],[data-l]')) { el.setAttribute('role','button'); el.tabIndex=0; el.setAttribute('aria-label',el.dataset.b!==undefined?'editar sección '+(+el.dataset.b+1):'editar verso '+(+el.dataset.l+1)); }
    const key = JSON.stringify([autorKey(),F.revision,AUT.P.cinema,IN.lines,IN.cuts]);
    if (key === boardKey) { board.querySelectorAll('button').forEach(b=>b.setAttribute('aria-pressed',String(AUT.sel.kind==='line' && AUT.sel.i===+b.dataset.cineLine))); return; }
    boardKey=key; observer?.disconnect();
    const film=F.compile(IN.lines,IN.cuts,AUT.P.blocks,songDur(),AUT.P.cinema);
    board.innerHTML=film.beats.map((b,i)=>b?`<button data-cine-line="${i}" aria-pressed="${AUT.sel.kind==='line'&&AUT.sel.i===i}" aria-label="editar verso ${i+1}: ${esc(IN.lines[i].text)}"><canvas width="240" height="140" aria-hidden="true"></canvas><small>${tfmt(b.t)} · ${esc(F.roles[b.section.role])}</small></button>`:'').join('');
    observer=new IntersectionObserver(entries=>entries.forEach(entry=>{if(!entry.isIntersecting)return; const b=entry.target; thumbnail(b.querySelector('canvas'),film.beats[+b.dataset.cineLine]); observer.unobserve(b);}),{root:board,rootMargin:'150px'});
    board.querySelectorAll('button').forEach(b=>observer.observe(b));
  };
  board.addEventListener('click',e=>{const b=e.target.closest('[data-cine-line]');if(!b)return;AUT.sel={kind:'line',i:+b.dataset.cineLine};AUT.q='';render();scrollToSel();});
  board.addEventListener('dblclick',()=>action('seekSel'));
  $('tlInner').addEventListener('keydown',e=>{if((e.key==='Enter'||e.key===' ')&&e.target.matches('[data-b],[data-l]')){e.preventDefault();e.stopPropagation();e.target.click();}});
  function refreshVersions() {
    $('cineVersion').innerHTML=versionRows.length?versionRows.map((v,i)=>`<option value="${i}">${esc(v.name)}</option>`).join(''):'<option value="">sin versiones</option>';
    $('cineRestore').disabled=!versionRows.length;
  }
  async function loadVersions() {
    const key=autorKey(); versionKey=key; versionRows=[];refreshVersions();
    const rows=await RISOSTORE.get('misc','versions|'+key);
    if(versionKey!==key)return; versionRows=Array.isArray(rows)?rows:[];refreshVersions();
  }
  $('cineSaveVersion').addEventListener('click',()=>{
    const key=autorKey(), snapshot=copy(AUT.P), source=JSON.stringify(IN.lines.map(l=>[l.t,l.text])), now=new Date();
    const name=now.toLocaleString('es-NI',{month:'short',day:'numeric',hour:'2-digit',minute:'2-digit',second:'2-digit'});
    versionQueue=versionQueue.then(async()=>{const rows=await RISOSTORE.get('misc','versions|'+key)||[];rows.unshift({name,created:now.toISOString(),source,project:snapshot});await RISOSTORE.set('misc','versions|'+key,rows.slice(0,30));if(autorKey()===key){versionRows=rows.slice(0,30);refreshVersions();announce('versión guardada');}}).catch(()=>announce('no se pudo guardar la versión'));
  });
  $('cineRestore').addEventListener('click',()=>{
    const v=versionRows[+$('cineVersion').value];if(!v)return;
    if(v.source!==JSON.stringify(IN.lines.map(l=>[l.t,l.text])))return announce('esta versión tiene otra sincronización de letra');
    edit(P=>{for(const k of Object.keys(P))delete P[k];Object.assign(P,copy(v.project));});announce('versión restaurada');
  });
  fitStage=function(){ if(!AUT.open)return;const aw=innerWidth-380-32,ah=innerHeight-56-348-32,k=Math.max(.05,Math.min(aw/innerWidth,ah/innerHeight));AUT.wrap.style.transform=`translate(${16+(aw-innerWidth*k)/2}px,${72+(ah-innerHeight*k)/2}px) scale(${k})`; };
  openAutor=async function(){const ok=await baseOpen();if(ok){AUT.wrap.inert=true;boardKey='';drawTimeline();await loadVersions();}return ok;};
  closeAutor=function(silent){if(AUT.wrap)AUT.wrap.inert=false;baseClose(silent);observer?.disconnect();boardKey='';};
  document.addEventListener('keydown',e=>{if(!AUT.open)return;
    if(e.target.closest('#cineBoard,#cineVersions')&&['ArrowLeft','ArrowRight','ArrowUp','ArrowDown',' '].includes(e.key))e.stopImmediatePropagation();
    if(e.key!=='Tab')return;const focus=[...autEl.querySelectorAll('button,select,input,textarea,[tabindex="0"]')].filter(el=>!el.disabled&&el.getClientRects().length);const first=focus[0],last=focus.at(-1);if(e.shiftKey&&document.activeElement===first){e.preventDefault();last?.focus();}else if(!e.shiftKey&&document.activeElement===last){e.preventDefault();first?.focus();}
  },true);
})();
