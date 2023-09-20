---
type: project
author: Santiago Micó
tags: proyectual
publish: 2022
---
## Una obra interactiva en donde existe un mapa y distintos caminos

Dónde está el camino es una obra para clarinete solista y electrónica en donde si bien existe una partitura, el intérprete puede elegir cuál camino seguir. Explora las posibilidades de los diferentes parámetros musicales y la relación de estos con diferentes procesos de efectos sonoros electrónicos.

### Objetivos

- ❖  Explorar los resultados estéticos a nivel formal, obtenidos a través del recorrido que plantea la obra.
    
- ❖  Investigar propuestas estéticas resultantes de la búsqueda de conexiones o sistemas análogos entre parámetros musicales y efectos sonoros digitales.
    
- ❖  Brindar al intérprete libertad de elecciones a nivel formal y observar su implicancia en lo micro.
    
    ### Contexto y motivación
    
    ¿Qué es un instrumento musical? En su Tratado de los Objetos Musicales, Pierre Schaeffer nos da una definición de instrumento musical como "cualquier dispositivo que nos permita obtener una colección variada de objetos sonoros manteniendo en espíritu la presencia de una causa".1 Esa presencia que unifica toda la colección de sonidos posibles está íntimamente ligada a los fundamentos técnicos de dicho instrumento.
    
    Por otro lado, haber estudiado técnicas de composición para clarinete, influenció también la composición de esta obra. Este estudio, motivó la idea de que ciertas técnicas instrumentales pueden ser análogas a diferentes configuraciones y seteos de efectos electrónicos/digitales. Ejemplos pueden ser desde un bisbigliando que puede ser análogo con ecualización, o filtros, o un doble picado, ser análogo a un delay.
    
    Por otro lado también se exploraron las posibilidades de ciertos multifónicos, a través de la búsqueda en textos como El clarinete bajo. Una historia personal, de Harry Sparnaay y The Clarinet of the Twenty-First Century de Edwin M. Richards.
    
    Si bien esta obra tiene algunas cualidades de obra abierta y otras que no, encontré cierto interés a partir del estudio de este tipo de obras, en la materia Estructuras Musicales IV, de la Lic. en Música de la UNTREF.
    

### Materiales

❖ Clarinete en si bemol.  
❖ Partitura  
❖ Computadora con supercollider 
❖ Micrófono  
❖ Cables plug  
❖ Parlantes

### Desarrollo

La obra tiene secciones en donde transcurre música escrita y 7 pasajes en particular en donde el intérprete debe elegir entre dos opciones, y cualquiera sea la opción elegida, supercollider tomará un parámetro determinado en código y repetirá el pasaje elegido en un loop de tres repeticiones pasando siempre por algún tipo de efecto sonoro electrónico. A partir de esto, hemos podido establecer el siguiente esquema macro formal el cual luego desarrollaremos.

#### Esquema macro formal

En el primer pasaje donde se plantea lo mencionado, el intérprete deberá elegir entre tocar en una dinámica pp o ff. Supercolider tendrá un código en el cual quedarán definidos dos umbrales en decibelios, y dependiendo de cual tome (elección del intérprete), arrojará un loop con un procesamiento determinado. Si el intérprete eligiera pp, se aplicarán efectos de reverberación, y si eligiera ff, se aplicará un proceso de saturación.

Opción 1

Opción 2

En este punto, la obra ya pasará a tener dos caminos diferentes, traduciéndose esto en dos variables formales.

En la variable 1, se pondrá en juego el parámetro altura. El intérprete deberá elegir entre dos opciones, una frase tendrá sonidos por encima de del LA4 y otra con sonidos por debajo de esta altura. Supercollider tendrá un código que defina un umbral de 440 hz y arrojará dos procesos diferentes dependiendo la opción que se elija. Si se eligiera la primera opción, arrojará un loop con un proceso de barrido de filtros hacia el registro grave, y si se eligiera la opción 2, supercollider arrojará un loop con un barrido de filtros hacia el registro agudo.

Variable 1. Opción 1

Variable 1. Opción 2

En la variable 2, el parámetro utilizado será la duración. Una opción con sonidos cortos y otra con sonidos largos. Supercollider tomará segundos para arrojar un loop y su procesamiento dependiendo de la elección del intérprete. El proceso que se aplicará si se eligiera la opción 1 (sonidos de corta duración), será con diferentes delays, y si se eligiera la opción 2 (sonidos de larga duración), el proceso tendrá un proceso de trémolos.

Variable 2. Opción 1

Variable 2. Opción 2

A partir de este punto, ya tendremos 4 variables formales más, las variables 3, 4, 5 y 6. En todas estas variables , supercollider trabajara con hz. La variable 3, tendrá dos opciones que exploran los microtonos. Supercollirder tendrá definidos dos extremos en hz que comprendan la distancia entre la primera y la última nota del pasaje. Dependiendo qué opción se elija, arrojará un chorus con diferentes configuraciones.

Variable 3. Opción 1

Variable 3. Opción 2

En la variable 4 , el intérprete deberá elegir entre ruido de aire y sonido puro. Si se eligiera la opción número 1, supercollider tomará el umbral de ruido y arrojará un loop con un efecto de phaser. Si se eligiera la opción 2, supercollider arrojará un loop con un efecto reverse.

Variable 4. Opción 1

Variable 4. Opción 2

En la variable 5, las opciones serán dos glissandos, cada uno desemboca en una frecuencia particular. En este caso, cualquiera sea la opción que se elija, supercollider

tomará la altura de la nota de destino del glissando y arrojará el pasaje en loop con un flanger. Dependiendo de qué opción se toque, habrá una configuración de flanger diferente para cada loop.

Variable 5. Opción 1

Variable 5. Opción 2

La variable 6 tendrá dos multifónicos diferentes a elegir por el intérprete. En este caso, se aplicará al loop, un efecto de reverberación con una configuración particular para cada opción que se elija.

Variable 6. Opción 1

Variable 6. Opción 2

De este modo, nos quedan 8 variables más, que ya no tendrán bifurcaciones, pero sí serán diferentes entre sí, dando a la obra 8 posibles finales.

### Bibliografía

❖ Schaeffer, P. (1988). Tratado de los objetos musicales. Madrid: Alianza editorial.

❖ Sparnaay, Harry (2011). El clarinete bajo. Una historia personal. Periferia Music

❖ Richards, E. Michael (1992). The Clarinet of the Twenty-first Century. Nueva York: E & K Pub.