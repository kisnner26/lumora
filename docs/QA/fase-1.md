# qa fase 1 · banderas

| prueba | resultado |
|---|---|
| `test_props.mjs`: 69 banderas sin excepción, dentro de -200..200, con etiqueta | ok. `flag_us` tenía 928 puntos y superaba el tope de 900: se redujo el muestreo de las estrellas |
| `test_deteccion.mjs`: 19 frases con país o gentilicio (nicas, boricua, New York, Paris, Tokyo, Berlín...) disparan la bandera esperada | 19/19 |
| 9 frases neutras (lluvia, amor, ciudad, café...) no disparan ninguna | 9/9 |
| captura real del clip con el verso "soy de Nicaragua": la bandera sale sola, con tintas índigo y naranja, con el trazo dibujándose y la letra escrita a mano | ok (`docs/img/catalogo-bandera-clip.jpg`) |
| hojas de contacto por juego de tintas revisadas a ojo | ver `docs/img/catalogo-banderas-a.jpg` y `-b.jpg` |

revisión visual: se reconocen todas por su composición, salvo corea del sur (débil) y el reino unido (aproximado). ver DECISIONES.md.
