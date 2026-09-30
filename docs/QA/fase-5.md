# fase 5, efectos de cine

- **tinta líquida** (corte `ink`): una mancha crece desde un punto con lóbulos y mal registro (tinta 1 y 2) hasta cubrir el cuadro; al cambiar la toma escurre hacia abajo dejando goteras. Capturas: docs/img/fx-tinta-liquida-1.jpg, -2.jpg.
- **papel rasgado** (corte `tear`): una hoja con el borde roto, fibras y cinta tapa la imagen y se retira. Captura: docs/img/fx-papel-rasgado.jpg.
- **palabras con peso**: la palabra clave cae con escala, más gruesa (900) y sombra mal registrada; al golpear sacude la cámara (`stage.kick`) y da un pulso de ritmo. Una vez por palabra.
- **taller de impresión**: la portada y el cierre se imprimen pasada por pasada (uniforme `uPass` en el shader), con marcas de registro, marcas de corte, barra de color y contador de pasada; cada corte desajusta el registro un instante. Captura: docs/img/fx-taller-impresion.jpg.
- los cortes nuevos se eligen solo al cambiar de estrofa (75 %), tinta líquida con ánimos fuertes y papel con los suaves; duran ~1,2 s. Respetan «transiciones» (ninguna: sin cortes; suaves: solo papel).
- ajustes > efectos > «efectos de cine»: un chip por efecto (`CFG.fxCine`).
- pruebas: tools/test_fx.mjs (fases congeladas de cada corte, pasadas del taller, golpe de palabra, apagado por efecto y por ajuste de transiciones).
- también: cada categoría del catálogo tiene su chip en ajustes > contenido.
- no verificado aquí: fluidez real a 60 fps (SwiftShader va lento) → docs/PENDIENTE-MAC.md.
