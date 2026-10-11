"""dirige y compila un montaje musical local a partir de beats y actividad visual."""
import argparse
import hashlib
import json
import subprocess
import tempfile
from pathlib import Path

FPS = 30

def run(args):
    subprocess.run(['ffmpeg', '-v', 'error', '-threads', '2', '-filter_threads', '1', '-y', *map(str, args)], check=True)

def analyze(source, duration):
    data = subprocess.check_output(['ffmpeg', '-v', 'error', '-i', str(source), '-t', str(duration), '-vf', 'fps=4,scale=96:54', '-f', 'rawvideo', '-pix_fmt', 'gray', '-'])
    size = 96*54
    frames, previous = [], None
    for i in range(0, len(data)-size+1, size):
        pixels = data[i:i+size]
        mean = sum(pixels)/size
        motion = sum(abs(a-b) for a,b in zip(pixels,previous))/size if previous else 0
        # centro de actividad, limitado para que un destello lateral no expulse el plano.
        cells = []
        for x in range(8,88,8):
            activity = sum(abs(pixels[y*96+x]-pixels[y*96+x-2]) for y in range(8,46))
            cells.append((activity,x/96))
        total = sum(v for v,_ in cells) or 1
        focus = max(.28,min(.72,sum(v*x for v,x in cells)/total))
        frames.append({'t':round(i/size/4,3), 'light':round(mean/255,4), 'motion':round(motion/255,4), 'focus':round(focus,4)})
        previous = pixels
    return frames

def direct(grid, frames):
    duration = grid['duration']; beats = grid['beats']; period = 60/grid['bpm']
    energies = grid.get('energy') or [.6]*len(beats)
    strengths = grid.get('strength') or [.5]*len(beats)
    sections, accents, edges = [], [], {0,round(duration*FPS)}
    for i in range(0,len(beats),16):
        start = 0 if i==0 else beats[i]
        end = min(duration,beats[i+16] if i+16<len(beats) else duration)
        level = sum(energies[i:i+16])/len(energies[i:i+16])
        previous = sections[-1]['energy'] if sections else level
        role = 'entrada' if i==0 else 'respiro' if level<previous-.06 else 'impulso' if level>previous+.06 else 'sostén'
        step = 4 if level>.79 else 8 if level>.65 else 16
        section = {'start':round(start,4),'end':round(end,4),'energy':round(level,4),'role':role}
        sections.append(section)
        for j in range(i,min(i+16,len(beats)),step): edges.add(round((0 if j==0 else beats[j])*FPS))
        edges.add(round(end*FPS))
        # un acento como máximo por frase; requiere ataque y movimiento en el metraje.
        candidates = []
        for j in range(i+3,min(i+14,len(beats))):
            near = [f for f in frames if abs(f['t']-beats[j])<.6 and f['light']>.025]
            if near:
                visual = max(near,key=lambda f:f['motion'])
                candidates.append((strengths[j]*(.5+visual['motion']*5),j,visual))
        if candidates and level>.68:
            score,j,visual = max(candidates)
            if strengths[j]>.68:
                t=round(beats[j]*FPS)/FPS
                accents.append({'t':t,'source':visual['t'],'strength':strengths[j],'focus':visual['focus'],'section':len(sections)-1})
                for value in [t-period*.7,t,t+.1,t+period*.65]: edges.add(round(value*FPS))
    boundaries = sorted(v for v in edges if 0<=v<=round(duration*FPS))
    shots=[]
    for start_frame,end_frame in zip(boundaries,boundaries[1:]):
        if end_frame<=start_frame: continue
        start,end=start_frame/FPS,end_frame/FPS
        section=next(s for s in sections if s['end']>start+.01)
        accent=next((a for a in accents if a['t']-period*.75<=start<a['t']+period*.65),None)
        action='hold'; rate=1.; freeze=False
        if accent:
            delta=start-accent['t']
            if delta<-.02: action='accelerate';rate=1.5
            elif delta<.08:action='freeze';rate=0;freeze=True
            else:action='release';rate=.62
        elif section['role']=='impulso' and section['energy']>.78:action='push';rate=1.08
        elif section['role']=='respiro':action='breathe';rate=.88
        near=[f for f in frames if max(.5,start-.5)<=f['t']<=min(duration-1,end+.5) and f['light']>.025]
        visual=max(near,key=lambda f:f['motion']*.7+f['light']*.3) if near else {'t':start,'focus':.5,'motion':0}
        source_start=accent['source'] if freeze else start
        if action=='accelerate':source_start=max(0,accent['source']-(end-start)*rate)
        elif action=='release':source_start=accent['source']+.033
        # el cierre recupera actividad real antes de los créditos estáticos.
        elif start>duration-5:
            candidates=[f for f in frames if duration*.4<f['t']<duration-8 and f['light']>.04]
            visual=max(candidates,key=lambda f:f['motion']) if candidates else visual
            source_start=visual['t']-(end-start)*.35;action='recall';rate=1.12
            if shots and shots[-1]['action']=='recall':
                prev=shots[-1];source_start=prev['source']+(prev['end']-prev['start'])*prev['rate']
        if start==0:
            visible=next((f['t'] for f in frames if f['light']>.025),0)
            source_start=max(source_start,visible)
        source_start=max(0,min(duration-max(.04,(end-start)*max(rate,.1))-.3,source_start))
        strong=action in ['accelerate','freeze','release','push','recall']
        # transiciones solo en cambios de frase/energía, no en cada golpe.
        incoming='cut'
        if shots and abs(start-section['start'])<.04 and section['role'] in ['impulso','respiro']:
            incoming='smoothleft' if section['role']=='impulso' else 'fade'
        shots.append({'start':start,'end':end,'source':round(source_start,4),'rate':rate,'action':action,
          'focus':visual['focus'],'zoom':1.16 if freeze else 1.13 if strong else 1.025,
          'transition':incoming,'overlap':4/FPS if incoming!='cut' else 0,
          'reason':section['role']+(' · ataque con actividad visual' if accent else ' · continuidad')})
    return {'schema':2,'duration':duration,'fps':FPS,'bpm':grid['bpm'],'sections':sections,'accents':accents,'shots':shots,
      'analysis':'estimated beat grid, rms phrases and source motion; source-time edit, bounded ramps and selected freezes'}

def render(source, output, plan):
    shots=plan['shots']
    with tempfile.TemporaryDirectory(prefix='lumora-edit-') as folder:
        folder=Path(folder); clips=[]
        for i,s in enumerate(shots):
            extra=shots[i+1]['overlap'] if i+1<len(shots) else 0
            frames=round((s['end']-s['start']+extra)*FPS); seconds=frames/FPS
            rate=s['rate']; clip=folder/f'{i:03}.mp4'; clips.append(clip)
            if rate==0:
                filters=f'trim=end_frame=1,setpts=PTS-STARTPTS,tpad=stop_mode=clone:stop_duration={seconds}'
            else:filters=f'setpts=(PTS-STARTPTS)/{rate}'
            zoom=s['zoom']; focus=s['focus']
            # el zoom crece antes del ataque y se relaja después; el plano normal respira.
            z=f'{zoom}-.09*on/{max(1,frames)}' if s['action']=='release' else f'1+({zoom}-1)*on/{max(1,frames)}'
            if rate==0:z=str(zoom)
            filters+=f",fps={FPS},scale=1600:900,zoompan=z='{z}':x='max(0,min(iw-iw/zoom,iw*{focus}-iw/zoom/2))':y='ih/2-ih/zoom/2':d=1:s=1280x720:fps={FPS}"
            filters+=',eq=gamma=1.10:contrast=1.045:saturation=1.13,setsar=1,format=yuv420p'
            if s['action']=='accelerate':filters+=",chromashift=cbh=7:crh=-7:enable='gte(t,"+str(max(0,seconds-.10))+ ")'"
            run(['-ss',s['source'],'-i',source,'-an','-vf',filters,'-frames:v',frames,'-c:v','libx264','-preset','veryfast','-crf','21','-threads','2',clip])
            print(f'{i+1}/{len(shots)} {s["start"]:.2f}–{s["end"]:.2f} {s["action"]}',flush=True)
        # cortes directos; fundido solo en cambios de frase seleccionados.
        graph=[];current='v0'
        for i in range(len(clips)):graph.append(f'[{i}:v]settb=1/{FPS},setpts=PTS-STARTPTS[v{i}]')
        elapsed=shots[0]['end']-shots[0]['start']+(shots[1]['overlap'] if len(shots)>1 else 0)
        for i in range(1,len(clips)):
            s=shots[i];label=f'join{i}'
            if s['overlap']:
                graph.append(f'[{current}][v{i}]xfade=transition={s["transition"]}:duration={s["overlap"]}:offset={elapsed-s["overlap"]}[{label}]')
            else:graph.append(f'[{current}][v{i}]concat=n=2:v=1:a=0,settb=1/{FPS},fps={FPS}[{label}]')
            current=label
            elapsed+=s['end']-s['start']+(shots[i+1]['overlap'] if i+1<len(shots) else 0)-s['overlap']
        # la salida conserva la duración exacta, incluidos los solapamientos.
        graph.append(f'[{current}]fps={FPS},tpad=stop_mode=clone:stop_duration=1,trim=end_frame={round(plan["duration"]*FPS)},setpts=PTS-STARTPTS[final]')
        script=folder/'join.txt';script.write_text(';\n'.join(graph))
        args=['-filter_complex_threads','1']
        for clip in clips:args+=['-i',clip]
        args+=['-filter_complex_script',script,'-map','[final]','-an','-c:v','libx264','-preset','fast','-crf','21','-threads','2','-movflags','+faststart',output]
        run(args)

if __name__=='__main__':
    parser=argparse.ArgumentParser(description=__doc__)
    parser.add_argument('source',type=Path);parser.add_argument('grid',type=Path);parser.add_argument('plan',type=Path)
    parser.add_argument('--output',type=Path)
    args=parser.parse_args();grid=json.loads(args.grid.read_text())
    frames=analyze(args.source,grid['duration']);plan=direct(grid,frames)
    plan['source_sha256']=hashlib.sha256(args.source.read_bytes()).hexdigest()
    args.plan.write_text(json.dumps(plan,ensure_ascii=False,indent=2)+'\n')
    print(f'{len(plan["sections"])} frases, {len(plan["shots"])} planos, {len(plan["accents"])} acentos seleccionados',flush=True)
    if args.output:
        render(args.source,args.output,plan)
        plan['output_sha256']=hashlib.sha256(args.output.read_bytes()).hexdigest()
        args.plan.write_text(json.dumps(plan,ensure_ascii=False,indent=2)+'\n')
