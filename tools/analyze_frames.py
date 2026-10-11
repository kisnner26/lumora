"""añade energía y ataques por pulso a una rejilla existente usando el audio local."""
import argparse
import array
import json
import math
import subprocess
from pathlib import Path

parser = argparse.ArgumentParser(description=__doc__)
parser.add_argument('source', type=Path)
parser.add_argument('grid', type=Path)
args = parser.parse_args()
grid = json.loads(args.grid.read_text())
rate = 8000
raw = subprocess.check_output(['ffmpeg', '-v', 'error', '-i', str(args.source), '-t', str(grid['duration']), '-vn', '-ac', '1', '-ar', str(rate), '-f', 's16le', '-'])
samples = array.array('h', raw)
# rms a 10 ms: los ataques se estiman por el aumento de energía, sin inventar beats.
step = rate // 100
rms = [math.sqrt(sum(v*v for v in samples[i:i+step])/max(1,len(samples[i:i+step]))) for i in range(0,len(samples),step)]
energy, strength = [], []
for beat in grid['beats']:
    a, b = max(0, int((beat-.04)*100)), min(len(rms), int((beat+.15)*100)+1)
    window = rms[a:b] or [0]
    energy.append(sum(window)/len(window))
    strength.append(max((max(0,rms[i]-rms[max(0,i-3)]) for i in range(a,b)), default=0))
def normalize(values):
    low, high = min(values), max(values)
    return [round((v-low)/max(1,high-low),4) for v in values]
grid['energy'] = normalize(energy)
grid['strength'] = normalize(strength)
grid['analysis'] = 'rms and positive energy rise, 10 ms windows, supplied source audio; fixed estimated beat grid'
args.grid.write_text(json.dumps(grid, ensure_ascii=False, indent=2)+'\n')
print(f'{len(energy)} pulsos analizados; duración {grid["duration"]} s')
