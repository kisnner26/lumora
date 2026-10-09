"""prueba el escritor nativo con buffers sintéticos, sin crear taps ni pedir permisos."""
import os
from pathlib import Path
import select
import shutil
import struct
import subprocess
import sys
import tempfile
import unittest


@unittest.skipUnless(sys.platform == 'darwin' and shutil.which('swiftc'), 'requiere el compilador de swift en macos')
class NativePCMTests(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        cls.tmp = tempfile.TemporaryDirectory()
        root = Path(__file__).resolve().parents[1]
        source = (root / 'tools/tomador.swift').read_text()
        writer = source[source.index('final class SalidaPCM'):source.index('let writer = SalidaPCM()')]
        fixture = '''
let writer = SalidaPCM()
let samples = UnsafeMutablePointer<Float32>.allocate(capacity: 2048)
for i in 0..<2048 { samples[i] = Float32(i % 16) / 16 }
let slow = CommandLine.arguments.contains("slow")
let channels: UInt32 = slow ? 2 : 1
var buffer = AudioBufferList(mNumberBuffers: 1, mBuffers: AudioBuffer(mNumberChannels: channels, mDataByteSize: slow ? 8192 : 32, mData: samples))
withUnsafeMutablePointer(to: &buffer) { p in
    for _ in 0..<(slow ? 20000 : 1) { writer.push(UnsafeMutableAudioBufferListPointer(p)) }
}
FileHandle.standardError.write(Data("callback libre\\n".utf8))
dispatchMain()
'''
        swift = Path(cls.tmp.name) / 'main.swift'
        swift.write_text('import Foundation\nimport CoreAudio\nimport AudioToolbox\n' + writer + fixture)
        cls.binary = str(Path(cls.tmp.name) / 'writer')
        subprocess.run(['swiftc', '-O', str(swift), '-o', cls.binary], check=True, capture_output=True)

    @classmethod
    def tearDownClass(cls):
        cls.tmp.cleanup()

    def run_writer(self, slow=False):
        pr = subprocess.Popen([self.binary] + (['slow'] if slow else []), stdout=subprocess.PIPE, stderr=subprocess.PIPE)
        self.addCleanup(lambda: self.stop(pr))
        return pr

    @staticmethod
    def stop(pr):
        pr.kill()
        pr.wait()
        pr.stdout.close()
        pr.stderr.close()

    def test_mono_is_duplicated_as_stereo(self):
        pr = self.run_writer()
        self.assertTrue(select.select([pr.stdout], [], [], 3)[0])
        out = struct.unpack('16f', pr.stdout.read(64))
        self.assertEqual(out, tuple(v / 16 for i in range(8) for v in [i, i]))

    def test_slow_reader_does_not_block_callback(self):
        pr = self.run_writer(slow=True)
        # no se lee stdout: el pipe se llena mientras el callback sigue entregando bloques.
        self.assertTrue(select.select([pr.stderr], [], [], 3)[0], 'el callback se bloqueó esperando al lector')
        self.assertEqual(pr.stderr.readline(), b'callback libre\n')


if __name__ == '__main__':
    unittest.main()
