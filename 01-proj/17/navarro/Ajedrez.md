---
type: project
author: Sebastián Navarro
tags: proyectual
publish: 2017
---
# Síntesis

Variante de un juego de ajedrez sonorizado.

Contexto y antecedentes

- Ajedrez de Alicia

El ajedrez de Alicia es una variante del juego de ajedrez inventada en 1953 por V. R. Parton. Debe su nombre al personaje de Alicia del libro Through the looking-glass, and what Alice found there.

Este juego sigue las reglas del ajedrez estándar pero se juega con dos tableros, A y B. El juego comienza con la disposición normal de piezas en el tablero A mientras que el tablero B se encuentra vacío.

Deben seguirse tres reglas básicas:

- Un movimiento debe ser legal en el tablero en el que es realizado.

- Una pieza solo se puede mover o capturar si el casillero de destino correspondiente esta libre en el otro tablero.

- Después de realizado el movimiento, la pieza se transfiere al casillero correspondiente en el otro tablero.

-Through the looking-glass, and what Alice found there

Sebastián Navarro

A través del espejo, y lo que Alicia encontró allí es una novela escrita por Lewis Carroll en 1871, continuación de Alicia en el país de las maravillas. En el libro, Alicia ingresa a través de un espejo a un mundo fantástico donde todo ha sido invertido.

Una vez allí es partícipe de una partida de ajedrez gigante que no respeta íntegramente sus reglas, teniendo como objetivo convertirse en reina (llegando a la última fila). Durante el transcurso se encontrará con diversos personajes que personifican a algunas piezas del juego.

En el transcurso del libro se producen movimientos del ajedrez, siguiendo las indicaciones del propio Carroll:

(Fig. 1. juego de ajedrez en Alicia a través del espejo)

-Reunion

Se pueden rastrear antecedentes de partidas de ajedrez sonoras remontándonos a Reunion (1968), una performance interpretada por John Cage y Marcel Duchamp. Esta obra se desarrolla sobre un tablero diseñado por Lowell Cross, el cuál poseía 64 foto-resistores (uno por cada casillero) y 9 micrófonos de contacto. La combinación de fichas sobre el tablero permite que ciertos foto-resistores reciban, o no, luz lo cual provoca la reproducción de fragmentos de música compuestas por David Tudor, Gordon Mumma y David Behrman. Estos sonidos serían distribuidos por distintos parlantes ubicados en la sala, existiendo la posibilidad de que el mismo fragmento de música sea reproducido en distintos parlantes dependiendo de la disposición de las piezas sobre el tablero.

(Fig. 2. Circuito básico del tablero de Reunion)

- Jaque al tablero

Un antecedente más reciente es Jaque al tablero (2013), una performance multimedia de Yamil Burguener. Los dos performers juegan una partida de ajedrez sobre un tablero que funciona como sampler y secuenciador el cual reproduce pistas pregrabadas por los mismos intérpretes. Las pistas se reproducen en función de la ubicación de las piezas en el tablero, detectadas por una cámara kinect. La performance se complementa con una imagen proyectada que refleja la disposición de las piezas en el tablero, junto con diversos textos.

Objetivos

-   Generar una experiencia lúdica.
    
-   Crear una variante original del juego que incluya al sistema auditivo.
    
-   Establecer un diálogo entre las acciones de los participantes del
    
    juego y las reacciones sonoras.
    
-   Lograr una mayor relación entre el juego ajedrez de Alicia y la obra
    
    literaria a la que hace referencia.
    
-   Transmitir, en última instancia, fragmentos del texto que inviten a la
    
    reflexión.
    
    Métodos y materiales
    
    La obra consiste en una instalación reactiva para dos participantes activos y n-cantidad de espectadores pasivos.
    
    En esta instalación los participantes activos juegan una partida de una variante de ajedrez de Alicia desarrollada especialmente para esta obra.
    

Se emplean dos tableros de 9 escaques cada uno (3x3) colocados uno al lado del otro, separados por un espejo bifaz dispuesto de manera transversal a los tableros.

Tablero  
A Espejo Tablero B

(Fig. 3. Disposición de los tableros)

Ambos jugadores disponen de las siguientes fichas para distribuir libremente en el tablero A al comenzar la partida: un rey, una dama, un caballo y un peón. El tablero B debe quedar vacío, así como uno sólo de los escaques del tablero A.

En esta versión del juego, ninguna pieza puede ser capturada en el tablero A. Las capturas solo pueden realizarse en el tablero B.

Al igual que en el ajedrez de Alicia, al realizar un movimiento en el tablero A la pieza se desplaza al escaque correspondiente del tablero B y viceversa. Las piezas en el tablero A no pueden ocupar un casillero que este siendo ocupado en el tablero B y viceversa.

En esta versión del juego es posible realizar movimientos nulos desplazando una pieza de un tablero al otro sin cambiar de escaque. Este movimiento no será disponible para el rey si se encuentra en jaque.

El resto de las reglas se corresponde con las reglas de una partida de ajedrez tradicional.

La duración de la partida será libre, hasta que se produzca un jaque mate o tablas, sin utilizar cronómetros. Al finalizar la partida se retirarán las piezas que queden en los tableros para que los siguientes participantes decidan la ubicación inicial de estas.

El juego de ajedrez se encuentra acompañado por elementos sonoros que mutan en función de las piezas que se encuentren en juego, su posición en el tablero y el ángulo de rotación de las mismas. Estos sonidos serán reproducidos a través de ocho parlantes distribuidos por la sala.

(Fig. 4. Distribución de parlantes en la sala)

Principio de funcionamiento

Cada pieza se construye sobre una base cuadrada de 57 mm de lado. Debajo de esta se encuentra pegado un código fiducial diferente para cada una de las piezas. Este código es el que permitirá su identificación.

(Fig. 5. Códigos fiducial)

Los tableros se construyen con un acrílico transparente que permita que una cámara dispuesta por debajo de ellos capte los códigos fiducial de cada pieza. De esta manera se detectará que piezas están en juego, sus coordenadas x-y en el tablero y su ángulo de rotación. Cada tablero medirá 17,1cm de lado y estarán separados por un espejo de 3mm de espesor, dando como resultado una superficie de 34,5cm x 17,1cm total.

Los datos recogidos serán enviados a un patch de PureData que los interpretará y reaccionará en función de estos.

A partir del número de identificación de cada fiducial en juego se activará la reproducción de un archivo de audio. La captura de dicha pieza implicará el retiro de esta del tablero y, por ende, la detención de la reproducción de dicho archivo de audio.

Los archivos de audio están compuestos a partir de fragmentos del libro Through the looking-glass, and what Alice found there y el procesamiento de esos textos recitados.

La elección de las piezas a utilizar en el juego se corresponden con las piezas utilizadas por Carroll en su partida de ajedrez, reemplazando la torre blanca por un peón negro para igualar las condiciones entre los dos jugadores. Estas piezas que intervienen en el juego de Carroll se manifiestan como personajes del libro, y es a partir de los fragmentos del libro correspondientes a estos personajes que se confeccionan los archivos de audio correspondiente a cada pieza.

Al ser detectadas las piezas en el tablero inicial los audios se reproducen de manera invertida creando un diálogo con el mundo descripto en el libro, donde todo ocurre desde adelante hacia atrás.

El ángulo de rotación de cada pieza determina la velocidad de reproducción de los archivos, en un rango que va desde un décimo de su velocidad normal hasta diez veces más rápido, coincidiendo la velocidad normal de reproducción con la orientación de las piezas hacia el espejo que separa los tableros.

Su ubicación en x-y determinará que parlante reproducirá cada audio, ya que la distribución de los parlantes permite trazar un tablero imaginario

dividido en 3x3 donde cada casillero es ocupado por un parlante, excepto el casillero central. La pieza que ocupe el casillero central provocará la reproducción del archivo de audio correspondiente en todos los parlantes en simultaneo.

La ubicación en x-y no solo determinará el paneo de los audios, sino que además provocará una modificación en estos. Un desplazamiento de una pieza en el eje x implicará una modificación mediante la aplicación de un efecto de delay, mientras que un desplazamiento en el eje y aplicará un efecto de reverberación.

De esta manera se traza una curva de inteligibilidad-ininteligibilidad en función del desarrollo de la partida.

Tablero A

Espejo Tablero B

|   |   |   |
|---|---|---|
|||Mayor inteligibilidad (c3)|
||||
|Menor inteligibilidad (a1)|||

|   |   |   |
|---|---|---|
|Mayor inteligibilidad (a3)|||
||||
|||Menor inteligibilidad (c1)|

(Fig. 6. Esquema de inteligibilidad.)

Resultará a1 del tablero A el punto de menor inteligibilidad de este tablero y c3 el de mayor inteligibilidad. Para el tablero B se tomará una correspondencia como reflejo del tablero A provocando que los puntos de

mayor y menor inteligibilidad se encuentren opuestos, resaltando las metáforas planteadas por la instalación.

A su vez esta curva se ve afectada por diversos factores: la cantidad de piezas en juego, el ángulo de rotación de cada pieza y en qué tablero se encuentran.

Con el desarrollo de la partida el índice de inteligibilidad tenderá a aumentar ya que: se reducirán la cantidad de piezas, habrá una tendencia a jugar sobre el tablero B (ya que permite la captura de piezas) y con el transcurso del tiempo aumentarán las probabilidades de que los usuarios decodifiquen el funcionamiento de la rotación de las piezas.

La obra plantea una multiplicidad divergente de estados pre-finales (el momento del jaque mate), donde idealmente al menos uno de los textos incluidos en los audios se comprenda en su totalidad. A partir de la decodificación por parte de los usuarios del funcionamiento del tablero durante el desarrollo de la partida es posible forzar intencionalmente alguno de los estados finales de la obra, pero no será posible comprender todos los textos en una sola partida debido a las condiciones de inteligibilidad del tablero. De esta forma, los usuarios que pretendan comprender la totalidad del texto deberán jugar varias partidas teniendo el cuenta el desarrollo de las mismas a partir del estado inicial de la instalación: los tableros vacíos, en silencio, antes de posicionar las piezas y comenzar la partida.

Cronograma

Actividad/Semana

1

2

3

4

5

6

7

8

9

Diseño de piezas

Diseño del tablero

Manufactura de piezas

Manufactura de tablero

Diseño sonoro

Programación en PureData

Testeo y corrección de la programación

Montaje del tablero y parlantes

Presupuesto

- Madera de tilo. 60 cm x 10 cm x 10 cm. $3.075  
- Plancha de acrílico transparente 35cm x 18cm. $100 - Cámara web genérica. $200 - $300  
- Espejo bifaz 20cm x 20 cm. $100  
- Parlantes x 8. $10.000  
- Misceláneos para el montaje. $2.000  
- Mano de obra: - Diseño de piezas y tablero. $3500

- Manufactura. $2500  
- Programación. $10.200 - Montaje. $1.000

Total. $32.775 (Calculado al 22 de noviembre de 2017)

Referencias

Ganzo, Julio. Historia general del ajedrez. Ed. Ricardo Aguilera. Madrid, 1966.

Pascual, Pau. Alicia en el país del ajedrez. Disponible en http://librodenotas.com/viajealajedrez/23617/alicia-en-el-pais-del-ajedrez- primera-parte. Consultado el 21 de noviembre de 2017.

Cross, Lowell. Reunion: John Cage, Marcel Duchamp, electronic music and chess. En revista Leonardo music journal, vol. 9. 1999.

Sobre Jaque al tablero http://www.yamilburguener.com.ar/jaque-al-tablero Sobre el ajedrez de Alicia http://www.chessvariants.com/other.dir/alice.html