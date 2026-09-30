# fase 4, oleada 3

- animales (49), naturaleza (25), transporte (24), tecnología (25) y música (20); total del catálogo: 578 dibujos.
- test_props verde: sin excepciones, dentro de -200..200, máx. 900 puntos, todos con etiqueta.
- hojas de contacto revisadas una por una (docs/img/catalogo-<categoria>-grande-N.jpg). Se corrigieron guitarras y violín (cuerpo parecía una flor) y se acortaron antena, teclado, girasol y trigo (límite de puntos).
- detección: 52 positivos y 17 negativos (tools/test_deteccion.mjs), todos bien.
- error encontrado y corregido: patrones "Xes?" exigen la e en singular (tren, león, altavoz, ratón...); se reescribieron con (es)? en todos los archivos del catálogo.
- alias genéricos recortados (beat, live, voz, memoria, bajo, club aparte, etc.).
- débiles anotadas: lobo, serpiente, cebra, ballena, dragón, arpa, gran muralla.
