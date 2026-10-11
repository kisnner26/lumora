"""emisión lan: el firmware recibe comandos espaciados, sin tocar luces reales."""
import sys
import unittest
from pathlib import Path
from unittest.mock import patch
sys.path.insert(0, str(Path(__file__).resolve().parents[1]))
import bridge

class LightsTest(unittest.TestCase):
    def test_spacing_and_protocol(self):
        clock = [0.0]; calls = []
        def sleep(dt): clock[0] += dt
        def send(ip, cmd, data): calls.append((clock[0], ip, cmd, data))
        with patch.object(bridge, 'govee_send', side_effect=send), patch.object(bridge.time, 'sleep', side_effect=sleep):
            bridge.lights_emit(['192.0.2.1'], {'on': True, 'rgb': [35, 115, 210], 'bright': 20})
        self.assertEqual([q[2] for q in calls], ['turn', 'colorwc', 'brightness'])
        self.assertEqual(calls[1][3]['color'], {'r': 35, 'g': 115, 'b': 210})
        self.assertEqual(calls[2][3], {'value': 20})
        self.assertTrue(all(b[0]-a[0] >= .039 for a,b in zip(calls,calls[1:])))

    def test_latest_state_and_clamps(self):
        with patch.dict(bridge.LIGHTS, {'pending': {}}):
            bridge.lights_cmd({'rgb': [300, -3, 40], 'bright': 20})
            bridge.lights_cmd({'bright': 35})
            self.assertEqual(bridge.LIGHTS['pending'], {'rgb': [255, 0, 40], 'bright': 35})
        with patch.object(bridge, 'govee_send') as send, patch.object(bridge.time, 'sleep'):
            bridge.lights_emit(['192.0.2.1'], {'bright': 150})
            send.assert_called_once_with('192.0.2.1', 'brightness', {'value': 100})

if __name__ == '__main__': unittest.main()
