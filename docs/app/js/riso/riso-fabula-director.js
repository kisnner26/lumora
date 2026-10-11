// continuidad: un escenario permanece entre planos y los objetos conservan su historia.
(() => {
  const R=window.RISO;if(!R)return;
  const hash=text=>{let n=2166136261;for(const ch of String(text))n=Math.imul(n^ch.charCodeAt(0),16777619);return n>>>0;};
  function arrange(book,lines,film,o,sceneOf,namedObjects,atmos){
    const duration=book.duration,bpm=Math.max(55,Math.min(190,Number(o.bpm)||110));
    const cadence=60/bpm*16,route=['cuarto','ciudad','puente','mar','jardin'];
    const sections=film?.sections?.length>1?film.sections:Array.from({length:Math.ceil(duration/32)},(_,i)=>({i,start:i*32,end:Math.min(duration,(i+1)*32),role:i===0?'intro':i===Math.floor(duration/32)?'outro':'verse'}));
    const times=[0,...lines.map(l=>l.t),...sections.map(s=>s.start)];
    for(let t=cadence;t<duration;t+=cadence)if(!lines.some(l=>Math.abs(l.t-t)<2.5))times.push(t);
    const ordered=[...new Set(times.filter(t=>Number.isFinite(t)&&t>=0&&t<duration))].sort((a,b)=>a-b);
    const firstPlace=lines.map(l=>sceneOf(l.text.toLowerCase())).find(Boolean)||route[book.seed%route.length];
    const anchors=new Map(),timeline=[];let location=firstPlace,chapter=0,lastSection=-1,lastLiteral='',lastActionAt=0;
    for(const time of ordered){
      const li=lines.findLastIndex(l=>l.t<=time),line=lines[li],n=film?.beats[li],env=atmos[li]||{},text=String(line?.text||'').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'');
      const section=sections.find(s=>time>=s.start&&time<s.end)||sections.at(-1),literal=sceneOf(text),atLine=line&&Math.abs(time-line.t)<.001;
      let next=location;
      if(literal&&literal!==lastLiteral){next=literal;lastLiteral=literal;}
      else if(section.i!==lastSection&&lastSection>=0){
        if(['chorus','climax'].includes(section.role))next=section.role==='climax'||section.i%2===0?anchors.get(text)?.place||firstPlace:route[(Math.max(0,route.indexOf(firstPlace))+1)%route.length];
        else next=route[(route.indexOf(location)+1+route.length)%route.length];
      }
      if(next!==location){chapter++;location=next;}
      lastSection=section.i;
      if(atLine&&!anchors.has(text))anchors.set(text,{place:location,motif:n?.motif});
      let action=n?.manual?n.action:n?.action&&n.action!=='hold'?n.action:env.act||n?.carry||'wait';
      if(/\b(paint|painting|pintar|pintando)\b/.test(text))action='paint';
      if(atLine&&action!==timeline.at(-1)?.action)lastActionAt=time;
      const named=namedObjects(text,book.key,li),motif=n?.motif||named[0]||anchors.get(text)?.motif||'carta_abierta';
      const age=time-(timeline.at(-1)?.t||0),establish=!timeline.length||timeline.at(-1).place!==location;
      let camera=establish?'wide':['give','tear','wilt'].includes(action)?'detail':action==='reach'?'medium':action==='remember'||action==='cry'?'close':timeline.length%3===1?'medium':'wide';
      if(n?.manual)camera=n.kind==='prop'?'detail':n.camera;
      // un verso breve actualiza la acción sin obligar a cambiar el encuadre.
      if(!establish&&!n?.manual&&age<2.5)camera=timeline.at(-1).camera;
      const inherited=book.beats[li]||book.timeline[0];
      timeline.push({...inherited,t:time,li,place:location,chapter,seed:hash(book.key+'|'+time),environmentSeed:hash(book.key+'|'+location),camera,action,actionAt:lastActionAt,motif,named,weather:env.weather,daytime:env.time,section:section.role,narrative:n||null,castCount:n?.cast||1,mood:/\b(alone|lost|gone|cry|solo|adios|llorar)\b/.test(text)?'ausencia':'encuentro',reprise:n?.reprise||false});
    }
    book.timeline=timeline;book.beats=lines.map((l,i)=>timeline.findLast(s=>s.t<=l.t)||timeline[0]);
    book.sections=sections;return book;
  }
  function pose(shot,time,reduced){
    const elapsed=Math.max(0,time-(shot.actionAt??shot.t)),duration=Math.max(3,shot.narrative?.duration||5),p=reduced?1:Math.min(1,elapsed/duration);
    const ease=p*p*(3-2*p),act=shot.action;
    const moving=['walk','run','leave','return','board'].includes(act);
    const x=act==='leave'?-ease*430:act==='board'?ease*320:act==='return'?-230*(1-ease):moving?ease*130-65:act==='reach'?ease*55:0;
    return {p,ease,x,gait:reduced?0:moving?Math.sin(elapsed*(act==='run'?9:4.4))*(p<1?1:.12):0,partner:shot.castCount>1||['give','reach','dance'].includes(act),letterGiven:(shot.narrative?.state?.letter||0)>0&&(!['give'].includes(act)||p>.78)};
  }
  R.fabulaDirector={arrange,pose};
})();
