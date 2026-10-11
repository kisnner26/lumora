"""contrato del director: tiempo musical, selección visual y render publicado."""
import importlib.util
import json
import subprocess
import unittest
from pathlib import Path

ROOT=Path(__file__).resolve().parents[1]
spec=importlib.util.spec_from_file_location('edit_frames', ROOT/'tools/edit_frames.py')
editor=importlib.util.module_from_spec(spec);spec.loader.exec_module(editor)

class EditTest(unittest.TestCase):
    def test_direction(self):
        grid=json.loads((ROOT/'media/frames/gimme-more-beats.json').read_text())
        # actividad visual distinta debe seleccionar momentos distintos con el mismo audio.
        def frames(shift):
            return [{'t':i/4,'light':.2,'motion':.7 if (i+shift)%7==0 else .02,'focus':.4} for i in range(320)]
        a=editor.direct(grid,frames(0));b=editor.direct(grid,frames(2))
        self.assertEqual(a,editor.direct(grid,frames(0)))
        self.assertNotEqual([s['source'] for s in a['shots']],[s['source'] for s in b['shots']])
        self.assertEqual(a['shots'][0]['start'],0);self.assertEqual(a['shots'][-1]['end'],80)
        for prev,next in zip(a['shots'],a['shots'][1:]):self.assertEqual(prev['end'],next['start'])
        for s in a['shots']:
            self.assertGreater(s['end'],s['start']);self.assertGreaterEqual(s['source'],0)
            self.assertLessEqual(s['source']+(s['end']-s['start'])*s['rate'],80)
            if s['rate']==0:self.assertLessEqual(s['end']-s['start'],.134)
        self.assertLessEqual(len(a['accents']),len(a['sections']))

    def test_baked_freeze(self):
        plan=json.loads((ROOT/'media/frames/gimme-more-edit.json').read_text())
        shot=next(s for s in plan['shots'] if s['rate']==0)
        start=round(shot['start']*30)
        data=subprocess.check_output(['ffmpeg','-v','error','-i',str(ROOT/'media/frames/gimme-more-boost.mp4'),'-vf',f'select=between(n\\,{start+1}\\,{start+2}),scale=160:90','-fps_mode','passthrough','-frames:v','2','-f','rawvideo','-pix_fmt','gray','-'])
        self.assertEqual(len(data),160*90*2)
        # compresión predictiva puede introducir diferencias de un nivel.
        diff=sum(abs(a-b) for a,b in zip(data[:14400],data[14400:]))/14400
        self.assertLess(diff,.6,'el congelado debe existir en los frames, no solo en el manifiesto')

if __name__=='__main__':unittest.main()
