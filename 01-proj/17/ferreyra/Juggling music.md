---
type: project
author: Santiago Ferreyra
tags: proyectual
publish: 2017
---
Guantes de malabarear interactivos Accesorio traductor del gesto corporal al gesto musical

“ ...la acción o existencia musical puede ocurrir en cualquier punto, o a lo largo de cualquier línea o

curva, o de lo que sea, en el espacio sonoro total... estamos, de hecho, técnicamente equipados

para transformar en arte nuestra idea contemporánea de cómo opera la naturaleza.” (Cage,1959)

## Síntesis:  
A través de una interfaz de unos guantes y un ordenador se busca relacionar sonidos con movimientos humanos teniendo como objetivo final el descubrir una música desde los sonidos programados y los ritmos del cuerpo en acción.

## Contexto:

Accesorio musical

### Justificación:

El gesto, otrora, de un instrumentista estaba expresado en una obra de forma implícita desde la composición. La novedad con este instrumento es poder cuantificar el movimiento e integrar a la obra, en términos sonoros, la interacción corporal, a través de una relación de interfaces y la programación de un modelo de control de flujo de datos que respondan lógicamente con una representación audible respecto a la actividad del malabarista (instrumentista). La finalidad de este proyecto es la de estructurar, dado un tipo de programación con Pd (puredata), un tipo de respuesta o sonificación1 de las acciones conscientes y respuestas inconscientes o no controladas por el malabarista a la hora de malabarear

1La sonificación entendida como la transformación de relaciones de datos en cuestiones acústicas con el propósito de facilitar la comunicación y la interpretación.

Memoria perceptiva /Dos acercamientos a la presencia del sonido:

-El sonido presente, el cuerpo ausente:

A veces los sonidos pretenden ser. El sonido sin cuerpo resuena en la imaginación. El sonido sin cuerpo es aquel fenómeno acusmático, fenómeno del cual se percibe esa presencia pero no se puede identificar la fuente. El sonido está por fuera de un encuadre, nuestra escucha es omnidireccional. Junto a esa cualidad nos encontramos con una dificultad, sin una captación total de las dimensiones y proporciones del objeto sonoro debido a que salvo por el sentido de la vista,los otros sentidos no nos orientan con tamaña precisión, el sonido se nos vuelve además anónimo. Recurrimos a la imaginación para relacionar aquello que suena con algún elemento que se acerque según nuestros criterios, a ser la fuente original de ese sonido. Por lo tanto ese sonido es un sonido virtual, fantasma, sin cuerpo.

-El sonido visualizado:

El sonido es vinculable a un hecho visual que lo produce: el sonido tiene relación con algo que percibimos visualmente, una persona tocando un instrumento, una máquina en funcionamiento, un objeto que al ser intervenido devuelve una respuesta acústica. Podría cuestionarse si el aparato

(los guantes) tiene una lógica con el sonido natural o artificial; siendo que el primero es conforme a su naturaleza original sin estar mediado por una lógica constructiva del hombre. Siendo el caso que incumbe al instrumento que presento, responde a una construcción que aproximo desde un lugar de base artificial, construir un instrumento analógico-digital que sea a la vez natural-artificial. “Natural” respondiendo a las acciones producidas por el malabarista: intervalos de tiempo en la caída de una pelota y otra, ritmo y velocidad, distinción de alturas entre un ataque (recepción a la palma) para diferenciar los puntos del malabar.

Los guantes mandan la señal a la computadora a partir del contacto que se produce al atrapar las pelotas

### Estado del arte (Antecedentes)

Arte vestible

Disciplina que combina el universo de la moda con la tecnología. Reflexiona sobre las posibilidades de aplicación y combinación para desarrollar prendas y objetos con componentes electrónicos, su utilización y funcionalidad. Se trata de objetos con circuitos flexibles, materiales inteligentes y sensores.

GloveMusic

Se trata de la música, o la creación de sonidos partir de la utilización de guantes. Traducir el movimiento de las manos y los dedos en sonidos. Parte de una corriente de músicos que experimentan en la búsqueda y creación de instrumentos musicales que respondan a la gestualidad del cuerpo. Tanto los guantes como diferentes tipos de nuevos instrumentos tratan de materializar en el sonido lo que el cuerpo puede accionar.

Arte de acción.  
Se denomina arte de acción (action art o life art) a un grupo variado de técnicas o estilos artísticos que hacen énfasis al acto creador del artista, a la acción. Las primeras manifestaciones al respecto se pueden encontrar en las primeras vanguardias, en las veladas surrealistas, veladas futuristas o sesiones dadaístas Estas técnicas y actividades generadoras de un tipo especial de discurso o manifestación artística dieron origen a una vertiente de expresiones que más tarde se conocerían y practicarían dentro del género arte gestual/ de acción.  
El género arte de acción se ramificó en expresiones o subgéneros como la performance, el happening, el ready-made y otros que ponen la relación directa entre el arte y la presencia física del artista.

Performance

La performance, que conlleva la presencia del artista y la utilización de accesorios y un guión más o menos preciso, tiene relación con determinados aspectos de una situación teatral, reivindicando sin embargo una transgresión de las formas tradicionales del arte para ahondar en el cuerpo, los datos sensoriales, la palabra, el gesto y los comportamientos sociales.

## Funcionamiento:
Los guantes conectados de forma directa, desde un cable con entrada mini plug, a la computadora mandan una señal por cada atrapada de pelotas tanto como con la mano izquierda y con la derecha. Esa señal es captada e interpretada bajo unidades donde se programó un código (“patch) de Pd. Los patchs constan de diferentes objetos interconectados entre ellos. En su parte superior encontraremos las entradas, donde se les enviaran valores numéricos u otros tipos de datos, y en la inferior la salida de estos. En resumen, cuando la pelota toque el micrófono de contacto instalado en la palma del guante lo que se obtendrá será un sonido determinado (desarrollar más cualidades técnicas al aparato...pendiente a la fecha de entrega)

Estados de Patch:

-Primer estado en Pd


-Segundo estado en Pd


-Estado 3. Final


## Lista de materiales

-Par de Guantes  
-Goma Eva  
-2 piezoeléctricos. Micrófonos de contacto  
-Cable mini plug estéreo a dos RCA. Largo en relación al alcance entre la entrada de la computadora y el malabarista. Utilizar un alargue en caso de no llegar, siempre miniplug. - Computadora.  
-Descargar el “patch” de Pd con el comando interno para poner a funcionar la lógica del sonido/movimiento.  
- Cantidad de pelotas de malabar en relación a los propósitos dinámicos propuestos.

Fotografía del modelo original de guantes. Se muestra cableado interno
