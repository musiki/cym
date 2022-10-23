---
type: class
tags: cym, música visual, armonía expandida,class
unit: 0
num:  11
year: 2022
---

<!-- slide bg="#010100" -->
UNTREF | CYM22 | 11

# Arte generativo

Philip Galanter es un artista y teórico interesado en sistemas complejos y en la interconexión entre ciencia y humanidad.

Según Galanter, el arte generativo es una práctica donde los variados resultados pueden provenir utilizando un mismo de sistema generativo, donde la complejidad, orden y desorden son los principios organizativos de estos sistemas.

_El arte generativo se refiere a cualquier práctica de la técnica donde el artista utiliza un sistema, probado como un conjunto de reglas de lenguaje natural, un programa de ordenador, una máquina, o otra invención de procedimiento, todo lo cual se pone en movimiento con un cierto grado de autonomía que contribuye a o resultante en una obra de arte completa._
Entonces, aquí la importancia está en el sistema al cual el artista cede su total o parcial control.

El término hace referencia a cómo se hace y no sobre qué, por ende no necesariamente se relaciona con la tecnología. El arte basado en 'reglas' no necesariamente es generativo, el sistema debe ser completamente autónomo.

**El arte generativo es tan antiguo como el arte mismo.** 

Haciendo referencia a la ciencia y sus sistemas, Galanter, designa como complejos a los sistemas que constan de muchos componentes (células, cromosomas, ciudadanos, etc.) que interactúan con otros cercanos a ellos, generando un patrón coherente independiente ('el todo es mucho más que la suma de las partes').

Aquí, atribuye la posibilidad del caos a los sistemas complejos por su dificultad de predicción, pero los distingue completamente de los sistemas aleatorios.

En este sentido, el término _complejidad efectiva_ se encuentra entre sistemas altamente ordenados y altamente desordenados.

 ![[galanter.jpeg]]

Leonardo Soolas, tomando los conceptos de autonomía e impersonalidad de Galanter, expone la definición de _molde interno_ de Georges‐Louis Leclerc como punto de partida para pensar la generatividad. Este término fue una explicación de la generación de los animales por la combinación de dos semillas, que daban origen al embrión mediante la mezcla de sus partes, por la acción de microfuerzas de atracción de Newton. Este molde interno entonces hace referencia al campo de fuerzas organizado que **asimilaban** la materia en el orden indicado para el **desarrollo** del embrión.

En este sentido, en comparación con la práctica artística y puntualmente con la noción de 'forma artística', Soolas manifiesta que con la idea de molde interno _''ya no hablamos de adición o sustracción para la creación artística, sino desarrollo"_. No es una manipulación directa de la forma, sino de la disposición de un sistema que hace forma *por sí solo*.

Para Soolas, compartiendo la definición de arte generativo de Galanter, expresa que es una colaboración creativa entre un artista humano y un agente no humano, siendo consciente del problema de conjunción y frontera entre lo "humano" y lo "no‐humano".

Aquí Soolas señala entonces la posibilidad de que todo material es en un sentido autómomo y que todo artista entra en relación con esa "voluntad". La diferencia está entre la intención de dominar esa voluntad y la de liberarla: "es decir, de trabajar contra o con el material, de concebir esa relación como una lucha o como una colaboración."

La generatividad es más bien una regulación de la dialéctica entre control y descontrol. Es una cuestión de *procedimiento*. Lo que está en juego no es la presencia de un autómata creador, por oposición a un 'arte en general' donde estaría ausente, sino su puesta en escena. El arte generativo muestra a este sistema autónomo en la obra, lo convierte en parte manifiesta de su materialidad sensible, teniendo en cuenta al artista creador como sujeto en red.

### Bibliografía

GALANTER, P. (2011). _Entre dos fuegos: el arte-ciencia y la guerra entre ciencia y humanidades_. En: Edward A. SHANKEN (coord.). «Nuevos medios, arte-ciencia y arte contemporáneo: ¿hacia un discurso híbrido?» Artnodes. N.º 11, págs. 33-38. UOC.

GALANTER, P. (2003). _What is Generative Art? Complexity theory as a context for art theory. International Conference on Generative Art. Milán: Milan Polytechnic.

SOOLAS, L. (2010) _GENERATIVIDAD Y MOLDE INTERNO: Los sistemas de reglas en el desarrollo de la forma artística_

## Ejemplos música generativa

<iframe width="560" height="315" src="https://www.youtube.com/embed/4km5eb2EWOw" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
<iframe src="https://player.vimeo.com/video/170847460?h=3fd10607ad&color=0344fc&title=0&byline=0&portrait=0" width="640" height="360" frameborder="0" allow="autoplay; fullscreen; picture-in-picture" allowfullscreen></iframe>
<iframe width="560" height="315" src="https://www.youtube.com/embed/u9-TY-Cie_k" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>

## Instalaciones sonoras

<iframe src="https://player.vimeo.com/video/50200793?h=def2ffab77" width="640" height="360" frameborder="0" allow="autoplay; fullscreen; picture-in-picture" allowfullscreen></iframe>
<iframe width="560" height="315" src="https://www.youtube.com/embed/UA8Vie6dopw" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>


# A-frame

Es un framework en javascript para crear experiencias de realidad virtual. Utiliza la arquitectura ECS (Entity Component System) donde cada objeto es una entidad.

Para incluirlo en html --> 
```html
<script src="https://aframe.io/releases/1.3.0/aframe.min.js"></script>
```

**Entidades**: objetos contenedores
**Componentes**: propiedades de comportamiento, apariencia y funcionalidad (módulos reutilizables)
**Sistemas**: provienen el entorno donde manejar y desarrollar los componentes

Las entidades son representadas con`` <a-entity> ``los componentes son representados mediante las propiedades html en ``<a-entity>``. 

Sintaxis:
```html
<a-entity ${componentName}="${propertyName1}: ${propertyValue1}; ${propertyName2:}: ${propertyValue2}">
```

Ejemplo: 
```html
<a-entity geometry="primitive: sphere; radius: 1.5"
		         light="type: point; color: white; intensity: 2"
		         material="color: white; shader: flat; src: glow.jpg"
		         position="0 0 -5"></a-entity>
		         ```

Componente simple: 
```html
<a-entity position="0 0 5"></a-entity>
```

Componente compuesto:
```html
<a-entity light="type: point; color: white; intensity: 2"></a-entity>
```

Sinónimos
```html
<a-entity geometry="primitive: box; position: 1 0 3"></a-entity>
```
=
```html
<a-box position="1 0 3"></a-box>
```
 (etiqueta semántica)


<iframe height="600" width="800" src="https://aframe1.zzigo.repl.co/" allow="fullscreen" allowfullscreen="" style="height:100%;width:100%; aspect-ratio: 16 / 9; "></iframe>



