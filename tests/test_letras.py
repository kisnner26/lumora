"""la letra propia del usuario manda sobre lrclib:  python3 -m unittest discover -s tests"""
import importlib, os, sys, tempfile, unittest

RAIZ = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))


class LetraPropia(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        cls.tmp = tempfile.TemporaryDirectory()
        os.environ['HOME'] = cls.tmp.name                    # LETRAS_DIR se calcula al importar
        sys.path.insert(0, RAIZ)
        cls.bridge = importlib.import_module('bridge')
        cls.dir = cls.bridge.LETRAS_DIR
        os.makedirs(cls.dir)

    @classmethod
    def tearDownClass(cls):
        cls.tmp.cleanup()

    def escribir(self, nombre, texto):
        with open(os.path.join(self.dir, nombre), 'w', encoding='utf-8') as f:
            f.write(texto)

    def test_lrc_con_tiempos(self):
        self.escribir('Artista Uno - Canción Uno.lrc', '[00:01.00]hola\n[00:05.00]mundo\n')
        r = self.bridge.fetch_lyrics('Artista Uno', 'Canción Uno', '', 200)
        self.assertEqual(r['source'], 'propia')
        self.assertIn('[00:01.00]hola', r['synced'])

    def test_txt_sin_tiempos_es_aproximada(self):
        self.escribir('Artista Dos - Canción Dos.txt', 'primera línea\nsegunda línea\n')
        r = self.bridge.fetch_lyrics('Artista Dos', 'Canción Dos', '', 200)
        self.assertEqual(r['source'], 'propia')
        self.assertEqual(r['approx'], 'plain')
        self.assertIn('primera línea', r['plain'])

    def test_ignora_mayusculas_feat_y_artistas_extra(self):
        self.escribir('artista tres - canción tres.lrc', '[00:02.00]uno\n')
        r = self.bridge.fetch_lyrics('Artista Tres, Invitado', 'Canción Tres (feat. Otro)', '', 200)
        self.assertEqual(r['source'], 'propia')

    def test_sin_archivo_no_hay_letra_propia(self):
        self.assertIsNone(self.bridge.letra_propia('Nadie', 'Nada'))


if __name__ == '__main__':
    unittest.main()
