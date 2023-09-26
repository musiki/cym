---
type: project
author: Sofía Garella
tags: proyectual
publish: 2018
---
## Sintesis

Videojuego laberíntico que fusiona la actividad lúdica con la creación musical.

## Contexto y antecedentes.

La industria del videojuego se ha ramificado en diversos géneros de tal manera que sus límites se han vuelto difusos.

¿Que es un videojuego? ¿Que no lo es?

Abundan en la internet videojuegos en donde no hay vidas, ni maneras de ganar, ni un “score” por el cual competir, sino que su escencia radica en la historia interactiva. El jugador no es un mero espectador del guión que se desarrolla frente a él, sino que él se vuelve protagonista e incide en los resultados obtenidos. Nos enfrentamos a una época en donde las disciplinas artísticas se confunden entre sí constantemente, y los videojuegos no son una execpción. Muchos de ellos son casi películas o videoclips interactivos (por ej. Lovedi) y en muchos casos nos encontramos con herramientas creativas. Un claro caso son aquellos videojuegos que permiten crear imágenes como el weavesilkii

Hay una vasta selección de videojuegos con fundamentos musicales, en su mayoría relacionados con la repetición de patrones rítmico-melódicos (ej. guitar hero), pero en el campo de la composición la oferta se reduce drásticamente. En aquellos casos en donde el jugador puede crear música, el funcionamiento suele ser algo simple, resultando en una experiencia no demasiado rica ni en lo lúdico ni en lo musical. (ej. trapcubeiii, dj sheepwolfiv)

“Dédalo” es un videojuego en donde el usuario debe de resolver diversos laberintos a traves de la escucha musical. El camino que escoja el jugador determinara el resultado sonoro, permitiéndole “crear” una composición a medida que recorra cada nivel. De esta manera se genera una experiencia de juego interesante, que simula el funcionamiento de los escape games, pero al mismo tiempo la experiencia de música generada algorítmicamente se ve sumamente enriquecida. Por otra parte, a través del uso de la tecnología audio 8D el usuario podra orientarse espacialmente en el nivel, permitiendole escoger el camino según como cambia el sonido en su entorno a medida que se mueve.

Este videojuego contaría entonces con una doble finalidad. La primera y más evidente, es la de resolver el puzzle, el laberinto. Pero se pretende buscar resultados sonoros interesantes. Además, esto le otorga al videojuego una característica muy valiosa : la de la re-jugabilidad.

## Objetivos.

-Generar una experiencia de valor lúdico  
-Expandir los límites de la concepción de videojuego y de composición musical -Explorar las posibilidades de la música generativa dentro del marco del videojuego -Desarrollar relaciones entre música-laberinto-juego de escape

## Desarrollo.

Cada nivel de “Dédalo” contara con un laberinto a resolver de características únicas y particulares. Los movimientos que realice el jugador incidiran en la música del nivel. Además, cada nivel tendrá un modo de funcionamiento independiente que el jugador deberá descubrir a partir de mínimas instrucciones.

Nivel 1.

Este será un laberinto tradicional, el jugador comienza desde un punto y debe encontrar la salida atravesando diferentes pasillos.

Ilustración 1: Organización de los sonidos del nivel 1

En cada esquina de los pasillos se insertará un objeto (unity) que reproduzca un track con sonoridades que respondan a las coordenadas del eje graficado, de manera que el jugador comenzará con una música tónica y consonante, y encontrará en la salida una sonoridad ruidosa y disonante. El tiempo que tarde el jugador en resolver el puzzle incidirá sobre la intensidad sonora de los objetos musicales.

(Tiempo a definir, es posible que los volúmenes se desarrollen en forma de ola. Es decir, crecen hasta cantidad de tiempo x, decrecen hasta cantidad de tiempo y, vuelven a crecer..etc)

Ilustración 2: Proceso de construcción del laberinto en Unity

Este nivel es simple en su funcionamiento ya que le sirve al jugador para familiarizarse con la dinámica del juego. Aquí el jugador descubrirá las posibilidades compositivas de su movimiento por el espacio.

Nivel 2.

En este laberinto se explorarán los conceptos de laberintos fractales, intertextualidad, y circularización de orden. La forma de este laberinto estará basada en las animaciones de tipo zoomquiltv en donde el jugador encontrará nuevos escenarios cada vez que se acerque a un objeto. La música de cada escenario respondera a este principio de funcionamiento.

Ilustración 3: ejemplo de zoomquilt

A diferencia del zoomquilt tradicional, que es unidireccional, por cada escenario el jugador podra elegir tres caminos (derecha, centro, izquierda) de los cuales solo uno de ellos llevará al escenario inicial, finalizando el nivel. Se generaría entonces el siguiente esquema que se asemeja a los sistemas lindenmayer

Ilustración 3: Posible esquema de laberinto inspirado en L-systems

Cada escenario contara con sus objetos sonoros que se enlazarán entre sí como las imágenes de un zoomquilt y responderán a los movimientos del jugador.

El objeto sonoro constará de intervalos (random) ascendentes cuando el jugador se mueva hacia delante, y de intervalos descendentes (random) al ir hacia atrás. Moverse a los costados no tendrá resultados sonoros. La velocidad con la cual el usuario se mueva por el espacio determinara el tempo de los objetos sonoros. La dinámica por la cantidad de tiempo que se permanezca en un escenario, generandose asi un fadeout al pasar de un escenario a otro.

Ilustración 4: Ejemplo de infinityzoom en Unity

Nivel 3

Este nivel explotara el concepto de laberinto menos tradicional de todos. El jugador se encontrará en un desierto total en donde no habrá paisaje ni objetos que puedan orientaro. Lo único que podrá darle sentido de dirección en el espacio será la música del nivel ( a través de la tecnología 8D)

La música provendrá de hojas de texto que contengan fragmentos del siguiente cuento corto:

“Cuentan los hombres dignos de fe (pero Alá sabe más) que en los primeros días hubo un rey de las islas de Babilonia que congregó a sus arquitectos y magos y les mandó a construir un laberinto tan perplejo y sutil que los varones más prudentes no se aventuraban a entrar, y los que entraban se perdían. Esa obra era un escándalo, porque la confusión y la maravilla son operaciones propias de Dios y no de los hombres. Con el andar del tiempo vino a su corte un rey de los árabes, y el rey de Babilonia (para hacer burla de la simplicidad de su huésped) lo hizo penetrar en el laberinto, donde

vagó afrentado y confundido hasta la declinación de la tarde. Entonces imploró socorro divino y dio con la puerta. Sus labios no profirieron queja ninguna, pero le dijo al rey de Babilonia que él en Arabia tenía otro laberinto y que, si Dios era servido, se lo daría a conocer algún día. Luego regresó a Arabia, juntó sus capitanes y sus alcaides y estragó los reinos de Babilonia con tan venturosa fortuna que derribo sus castillos, rompió sus gentes e hizo cautivo al mismo rey. Lo amarró encima de un camello veloz y lo llevó al desierto. Cabalgaron tres días, y le dijo: “Oh, rey del tiempo y substancia y cifra del siglo!, en Babilonia me quisiste perder en un laberinto de bronce con muchas escaleras, puertas y muros; ahora el Poderoso ha tenido a bien que te muestre el mío, donde no hay escaleras que subir, ni puertas que forzar, ni fatigosas galerías que recorrer, ni muros que veden el paso.” Luego le desató las ligaduras y lo abandonó en la mitad del desierto, donde murió de hambre y de sed. La gloria sea con aquel que no muere.

FIN”vi

Gracias a la utilización de la tecnología de sonido 8D el jugador oirá que se esta acercando a las pistas. Una vez recogida la pista, la música que emana ese objeto “se unirá” al jugador y se mezclará con las proximas pistas que se encuentren, generando diferentes armonías según el orden en el que se vayan encontrando.

Al encontrar todos los fragmentos, finalizará el nivel, y así, el juego.

## Cronograma

El desarrollo del videojuego comenzará en marzo del 2019 y conllevará de 6 a 12 meses de trabajo conjunto entre programadores y artistas.

## Materiales:

- PC completa
    
- Unity ( u otro engine con posibilidad de gráficos 3D) (+licencia correspondiente)
    
- Auriculares cerrados para generar experiencia 8D completa
    
    Presupuesto:
    
    Entre 6.000 y 10.000 pesos por cada nivel.
    

## REFERENCIAS:  
i https://www.kongregate.com/games/AlexanderOcias/loved?acomplete=loved

ii Https://www.weavesilk.com

iii

https://www.kongregate.com/games/ButtonBass1/buttonbass-trap-cube-2 ivhttps://www.kongregate.com/games/Filipe_Sheepwolf/dj-sheepwolf-mixer-4

v Https://www.zoomquilt.com  
vi Borges, Jorge Luis, “el aleph”, editorial emecé, Buenos Aires, 1957 https://www.youtube.com/watch?v=HmL7FB0ra_E  
Albarracín, Camila Soledad, “Sonomaze: juego interactivo para no videntes”, 2016  
Azzigotti, Luciano, MUGLA [laboratorio continuo de juegos musicales de la Plataforma Container]

Almeida, Ivan, “Borges, o los laberintos de la inmanencia”, https://www.borges.pitt.edu/bsol/pdf/laberinto.pdf