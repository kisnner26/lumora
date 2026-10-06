"""pruebas del puente: arranque, /salud, puerto alterno, reutilización y salida limpia.
corren con la biblioteca estándar:  python3 -m unittest discover -s tests
"""
import json, os, signal, socket, subprocess, sys, tempfile, time, unittest, urllib.request

RAIZ = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))


def puerto_libre():
    with socket.socket() as s:
        s.bind(('127.0.0.1', 0))
        return s.getsockname()[1]


def pedir(puerto, ruta):
    with urllib.request.urlopen('http://127.0.0.1:%d%s' % (puerto, ruta), timeout=3) as r:
        return r.status, r.read()


class Puente:
    """lanza bridge.py en un HOME y una web temporales para no tocar los datos reales"""

    def __init__(self, puerto):
        self.tmp = tempfile.TemporaryDirectory()
        web = os.path.join(self.tmp.name, 'web')
        os.makedirs(web)
        with open(os.path.join(web, 'index.html'), 'w') as f:
            f.write('<title>prueba</title>')
        env = dict(os.environ, HOME=self.tmp.name, LUMORA_ROOT=web, LUMORA_PORT=str(puerto))
        self.proc = subprocess.Popen([sys.executable, '-u', os.path.join(RAIZ, 'bridge.py')], env=env,
                                     stdout=subprocess.PIPE, stderr=subprocess.STDOUT, text=True)
        self.puerto = puerto

    def esperar(self, hasta=15):
        limite = time.time() + hasta
        while time.time() < limite:
            if self.proc.poll() is not None:
                return False
            try:
                pedir(self.puerto, '/salud')
                return True
            except Exception:
                time.sleep(0.2)
        return False

    def diagnostico(self):
        """lo que imprimió el puente, para que un fallo en la integración continua diga por qué"""
        if self.proc.poll() is None:
            self.proc.terminate()
        try:
            salida, _ = self.proc.communicate(timeout=5)
        except Exception:
            salida = ''
        return 'el puente no arrancó (código %s). salida:\n%s' % (self.proc.returncode, salida)

    def cerrar(self):
        if self.proc.poll() is None:
            self.proc.send_signal(signal.SIGTERM)
            try:
                self.proc.wait(5)
            except subprocess.TimeoutExpired:
                self.proc.kill()
        self.tmp.cleanup()


class PruebasPuente(unittest.TestCase):
    def setUp(self):
        self.abiertos = []

    def tearDown(self):
        for p in self.abiertos:
            p.cerrar()

    def arrancado(self, p):
        if not p.esperar():                      # el diagnóstico solo se arma si falla
            self.fail(p.diagnostico())

    def lanzar(self, puerto):
        p = Puente(puerto)
        self.abiertos.append(p)
        return p

    def test_salud_y_web_desde_lumora_root(self):
        p = self.lanzar(puerto_libre())
        self.arrancado(p)
        estado, cuerpo = pedir(p.puerto, '/salud')
        datos = json.loads(cuerpo)
        self.assertEqual(estado, 200)
        self.assertTrue(datos['lumora'])
        for clave in ('version', 'puerto', 'root', 'osascript', 'oido', 'traducir', 'ffmpeg'):
            self.assertIn(clave, datos)
        self.assertEqual(datos['puerto'], p.puerto)
        self.assertIn(b'prueba', pedir(p.puerto, '/index.html')[1])

    def test_puerto_ocupado_usa_el_siguiente(self):
        base = puerto_libre()
        with socket.socket() as ocupado:
            ocupado.bind(('127.0.0.1', base))
            ocupado.listen(1)
            p = self.lanzar(base)
            siguiente = base + 1
            p.puerto = siguiente
            self.arrancado(p)
            self.assertEqual(json.loads(pedir(siguiente, '/salud')[1])['puerto'], siguiente)
            with open(os.path.join(p.tmp.name, 'Library/Application Support/Lumora/puerto')) as f:
                guardado = f.read().strip()
            self.assertEqual(guardado, str(siguiente))

    def test_segundo_puente_reutiliza_el_primero(self):
        primero = self.lanzar(puerto_libre())
        self.arrancado(primero)
        segundo = Puente(primero.puerto)
        self.abiertos.append(segundo)
        salida, _ = segundo.proc.communicate(timeout=15)
        segundo.proc.stdout.close()
        self.assertEqual(segundo.proc.returncode, 0)
        self.assertIn('ya hay un puente de lumora', salida)

    def test_sigterm_apaga_sin_hijos_huerfanos(self):
        p = self.lanzar(puerto_libre())
        self.arrancado(p)
        pid = p.proc.pid
        p.proc.send_signal(signal.SIGTERM)
        p.proc.wait(5)
        time.sleep(0.5)
        hijos = subprocess.run(['pgrep', '-P', str(pid)], capture_output=True, text=True).stdout.strip()
        self.assertEqual(hijos, '')


if __name__ == '__main__':
    unittest.main()
