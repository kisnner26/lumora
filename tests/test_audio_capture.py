"""ciclo de vida del tap con un proceso simulado: nunca captura el audio del usuario."""
import http.client
import os
import socket
import struct
import tempfile
import threading
import time
import unittest
from unittest.mock import patch

import bridge


class AudioCaptureTests(unittest.TestCase):
    def setUp(self):
        self.tmp = tempfile.TemporaryDirectory()
        self.helper = os.path.join(self.tmp.name, 'tap')
        self.server = bridge.Servidor(('127.0.0.1', 0), bridge.Handler)
        self.server.daemon_threads = True
        self.port = self.server.server_address[1]
        self.thread = threading.Thread(target=self.server.serve_forever, daemon=True)
        self.thread.start()
        self.patches = [patch.object(bridge, 'TOMADOR_BIN', self.helper),
                        patch.object(bridge, 'TOMADOR', {'proc': None, 'session': '', 'cancelled': {}}),
                        patch.object(bridge, 'PCM_START_TIMEOUT', .35), patch.object(bridge, 'PCM_IDLE_TIMEOUT', .35)]
        for p in self.patches:
            p.start()
        self.connections = []

    def tearDown(self):
        for c in self.connections:
            c.close()
        bridge.parar_tomador(bridge.TOMADOR['proc'])
        self.server.shutdown()
        self.server.server_close()
        self.thread.join()
        for p in reversed(self.patches):
            p.stop()
        self.tmp.cleanup()

    def helper_code(self, code):
        with open(self.helper, 'w') as f:
            f.write('#!/usr/bin/env python3\nimport sys,struct,time\n' + code + '\n')
        os.chmod(self.helper, 0o755)

    def get(self, session='test', agent=''):
        c = http.client.HTTPConnection('127.0.0.1', self.port, timeout=3)
        self.connections.append(c)
        c.request('GET', '/pcm?session=' + session, headers={'User-Agent': agent})
        return c, c.getresponse()

    def stop(self, session):
        c = http.client.HTTPConnection('127.0.0.1', self.port, timeout=3)
        self.connections.append(c)
        c.request('POST', '/pcm/stop?session=' + session)
        r = c.getresponse()
        r.read()
        self.assertEqual(r.status, 200)

    def wait_stopped(self, pr):
        deadline = time.monotonic() + 2
        while pr.poll() is None and time.monotonic() < deadline:
            time.sleep(.02)
        self.assertIsNotNone(pr.poll(), 'el tap debe morir y devolver el sonido original')

    def test_stalled_start_releases_tap(self):
        self.helper_code('time.sleep(20)')
        _, r = self.get()
        self.assertEqual(r.status, 503)
        r.read()

    def test_partial_header(self):
        self.helper_code('b=struct.pack("f",44100);sys.stdout.buffer.write(b[:2]);sys.stdout.buffer.flush();time.sleep(.05);sys.stdout.buffer.write(b[2:]);sys.stdout.buffer.flush()')
        _, r = self.get()
        self.assertEqual(r.status, 200)
        self.assertEqual(r.read(), struct.pack('f', 44100))

    def test_stalled_stream_releases_tap(self):
        self.helper_code('sys.stdout.buffer.write(struct.pack("f",48000));sys.stdout.buffer.flush();time.sleep(20)')
        _, r = self.get()
        pr = bridge.TOMADOR['proc']
        self.assertEqual(r.read(4), struct.pack('f', 48000))
        self.assertEqual(r.read(), b'')
        self.wait_stopped(pr)

    def test_disconnect_without_new_samples(self):
        self.helper_code('sys.stdout.buffer.write(struct.pack("f",48000));sys.stdout.buffer.flush();time.sleep(20)')
        with patch.object(bridge, 'PCM_IDLE_TIMEOUT', 10):
            c, r = self.get()
            pr = bridge.TOMADOR['proc']
            r.read(4)
            r.close()
            c.close()
            self.wait_stopped(pr)

    def test_stop_before_start_does_not_launch_tap(self):
        self.helper_code('time.sleep(20)')
        self.stop('cancelled')
        _, r = self.get('cancelled')
        self.assertEqual(r.status, 409)
        r.read()
        self.assertIsNone(bridge.TOMADOR['proc'])

    def test_stale_stop_does_not_kill_new_session(self):
        self.helper_code('sys.stdout.buffer.write(struct.pack("f",48000));sys.stdout.buffer.flush();time.sleep(20)')
        with patch.object(bridge, 'PCM_IDLE_TIMEOUT', 10):
            _, r = self.get('new')
            pr = bridge.TOMADOR['proc']
            r.read(4)
            self.stop('old')
            self.assertIsNone(pr.poll())
            self.stop('new')
            self.wait_stopped(pr)

    def test_playback_browser_is_excluded(self):
        self.helper_code('sys.stdout.buffer.write(struct.pack("f",48000));sys.stdout.buffer.flush();time.sleep(20)')
        with patch.object(bridge, 'PCM_IDLE_TIMEOUT', 10):
            _, r = self.get(agent='Mozilla Chrome/130 Safari/537.36')
            r.read(4)
            pr = bridge.TOMADOR['proc']
            self.assertEqual(pr.args[-2:], ['--exclude-bundle', 'com.google.chrome'])
            self.stop('test')
            self.wait_stopped(pr)
        self.assertEqual(bridge.navegador_audio('Chrome/130 Edg/130'), 'com.microsoft.edgemac')
        self.assertEqual(bridge.navegador_audio('Firefox/130'), 'org.mozilla.firefox')


if __name__ == '__main__':
    unittest.main()
