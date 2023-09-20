---
type: project
author: Tomás Barbaglia
tags: proyectual
publish: 2019
---
##  Síntesis

La dirección de la mirada hacia el objeto como motor de su funcionamiento

Miradas dirigidas es una instalación interactiva que tiene como premisa la transformación del sonido a través de la mirada de los participantes.

## Objetivosdelproyecto

- Reflejar el concepto de tótem electrónico.
    
- Meditar sobre la mirada de los individuos.
    
### Justificación

 Tomamos como punto de partida las ideas del segundo libro de Émile Durkheim1 acerca del concepto de tótem, de donde resaltamos la centralidad del objeto totémico, su carácter sagrado, la importancia de lo colectivo vinculado a la noción de clan, y la manifestación del tótem como realidad del sujeto, como algo que está siendo visto en tiempo real y que también puede ser interpelado por el sujeto. En base a esto nos preguntamos cómo sería una posible reconfiguración del concepto de tótem en la actualidad y cuáles son los tótems que nos rodean. Para eso nos basamos en algunas premisas enunciadas por
    
Durkheim Émile, 1912, “Las formas elementales de la vida religiosa”, Libro segundo, “Las creencias elementales”, Alianza Editorial.
    

Daniel H. Cabrera2 sobre el importante rol que tiene la tecnología en nuestra sociedad, en nuestra realidad. Consideramos que la electrónica se vuelve totémica en la actualidad, debido a la incorporación de las nuevas tecnologías en nuestra vida diaria. Según Cabrera las nuevas tecnologías adquieren un carácter sagrado al poder brindar acceso a diversa información y modificar la realidad de manera instantánea. La electrónica también funciona de manera colectiva, ya que permite la conexión entre individuos en distintas partes del mundo y les permite interactuar entre sí.

Teniendo en cuenta todo esto nos proponemos realizar una instalación en donde haya una serie de pantallas sobre un pedestal en el centro de una habitación. Al ser vista una de las pantallas por un sujeto provoca que se encienda un sonido. La pantalla se presenta como un objeto central y estático. Lo que cambia es la materialidad, al existir la posibilidad de variar el sonido mediante la mirada de distintos sujetos en las distintas pantallas. Aquí aparece el carácter colectivo, con esta posibilidad de variación mediante la interacción de los sujetos con el objeto.

### Contexto 
#### Estado del Arte

• Enlightenment Compressed (1994) es una instalación de Nam June Paik que consiste en la estatua de un Buda mirando una pantalla de televisión,
donde se ve el reflejo de sí mismo. Lo que aquí se cuestiona es la manera en que circula la información en el tipo de transmisión comercial que es manejado por la industria. El televisor emite información hacia el espectador, se trata de una de una forma de comunicación lineal. En la instalación de Paik el sentido parece estar en la autorreflexión, en ir hacia el interior. Se estaría comparando, con cierto grado de ironía, esta actitud introspectiva relacionada con el zen, con el acto de ver televisión. Lograr mayor conciencia mediante la meditación Zen está al mismo nivel que ver televisión.

Nam June Paik, Enlightenment Compressed (1994)

- Pulse Index (2010) es una instalación interactiva diseñada por el artista electrónico Rafael Lozano Hemmer y trabaja la captación de la identidad y procesos biológicos del sujeto, como sus huellas digitales y pulso cardíaco, mediante sensores. Estos datos se proyectan en una pantalla, en la celda más grande de esta. El rol de los participantes es central dentro de la instalación, ya que funciona con los datos que estos ingresan.
    
- The Wall of Gazes (2011) es una obra / instalación de Mariano Sardón que funciona con el movimiento de los ojos. Se trata de varias pantallas
    

en las que los espectadores pueden ver como se revelan las imágenes de los retratos mediante los movimientos oculares de muchas personas en simultáneo. Para su realización se utiliza un dispositivo de seguimiento ocular que graba el movimiento de los ojos. La obra tiene como finalidad la conexión del individuo con las partes de la cara que son vistas, y las que no son vistas cuando la atención se centra en otra parte del retrato.

### Paradigma

John Berger ha tratado la cuestión de la mirada en su libro titulado Modos de ver3. Aquí habla de lo que es la mirada y lo que hacemos con ella. Según Berger, al mirar no solo miramos una cosa, sino que miramos una relación entre las cosas y entre nosotros mismos. Se entiende a la vista no como algo estático, sino como algo móvil. La mirada también se encuentra condicionada por nuestros saberes y creencias, y existe desde mucho antes que las palabras. Berger dice que la imagen es también una manera de ver, ya que es tomada con una cámara por un fotógrafo desde cierta perspectiva específica.

## Desarrollo  
### Explicación

Miradas dirigidas es una instalación interactiva que consiste en una habitación cerrada con poca iluminación, donde se encuentran 5 pantallas con cámaras adheridas, distribuidas en una superficie de madera, ahuecada y

3 Berger John, 1972, “Modos de ver”, edición inglesa.

escalonada, con apertura en la parte frontal que da al público. Debajo de la superficie hay 3 tomacorrientes dobles colocados en el suelo para efectuar las conexiones. Las pantallas reflejan las imágenes captadas por la cámara. El rostro del participante que mira la cámara se proyecta en la pantalla como si fuera un espejo.

Las pantallas van conectadas a una computadora central que está ubicada dentro de esta superficie, que es hueca por dentro para poder facilitar las conexiones y ocultar la computadora. Se ubican 3 de las pantallas en la parte más baja de la superficie, y las 2 pantallas restantes van en el nivel superior. En la parte inferior frontal de la superficie de madera va colocada una pared de parlantes monitores. Estos parlantes van conectados a una interfaz de audio que a su vez se conecta a la computadora.

La mirada de los participantes se capta mediante cámaras, y los datos obtenidos son procesados por un código algorítmico. Se utiliza la aplicación Face OSC para detección de movimientos oculares en conjunto con el programa Processing para asignar parámetros sonoros correspondientes a estos movimientos.

Esquema de la habitación:

Esquema de la ubicación de pantallas y parlantes monitores:

### Funcionamiento

La obra en estado inicial se encuentra en reposo y se activa cuando la mirada del espectador se posa sobre la cámara que está conectada a la pantalla 1. La cámara de esta pantalla detecta el movimiento del parpadeo de los ojos a través del programa Face OSC, que a su vez se encuentra enlazado con programas como Pure Data, Abbleton Live, o Processing. De esta forma, la cámara al detectar el movimiento envía instrucciones a dichos programas y se proyecta un sonido por los parlantes, que consiste de una altura estática, un Do# 2.

Si hay más participantes en la habitación será posible controlar diferentes parámetros del sonido mirando las distintas cámaras conectadas a las pantallas. A continuación se presenta una lista de los movimientos y parámetros correspondientes a cada pantalla:

- Pantalla 1: Control del encendido y apagado mediante el reconocimiento del parpadeo de los ojos
    
- Pantalla 2: Control de la intensidad según la apertura de los ojos. Cuanto mayor apertura haya el sonido es más intenso, cuanto menor apertura, es menos intenso.
    
- Pantalla 3: Control de filtrado de frecuencias según la apertura de los ojos. Cuanto mayor apertura haya se filtran las frecuencias graves, cuanto menor apertura se filtran las frecuencias agudas.
    
- Pantalla 4: Control de apagado mediante el parpadeo de los ojos. Permite la posibilidad de interrumpir el sonido continuo y generar trémolos.
    

• Pantalla 5: Control de la altura mediante la apertura de los ojos. Cuánto mayor apertura de ojos, la altura asciende, cuánto menor apertura desciende.

### Vínculo con el público

Miradas dirigidas se vincula con el público de manera interactiva principalmente, ya que se necesita la mirada de al menos un participante en la pantalla que se controla el encendido y apagado del sonido. El público también puede relacionarse con la obra de manera contemplativa escuchando el sonido, o puede interactuar con el mismo cambiando ciertos parámetros sonoros al mirar las distintas pantallas.

## Cronograma 5.1. Etapas

Preproducción:

Se conseguirá la habitación para realizar la instalación, se colocarán 3 tomacorrientes en el centro de la habitación que servirán para enchufar la computadora, los parlantes y los monitores. Luego se encargará la construcción de la superficie de madera que será utilizada para colocar las pantallas. Por último se instalarán la computadora, las pantallas y las cámaras.

Tiempo aproximado: una semana.

Ejecución:

Los participantes entran a la habitación y miran la pantalla 1 que enciende el sonido en la habitación. Luego pueden mirar las distintas pantallas y alterar parámetros del sonido.

Postproducción:

Se registrará en un video las miradas de los participantes grabadas desde las cámaras, y se hará una recopilación de información de los diferentes estados que fue tomando el sonido al verse modificado por las miradas de los participantes.

## Materiales 6.1. Rider

Esquema de la parte más baja de la superficie (vista posterior):

Esquema de la parte más alta de la superficie (vista posterior):

Esquema de la parte interior de la superficie (vista posterior):

### Planos

### Lista de materiales

- 5 Pantallas LCD 19 pulgadas
    
- 5 cámaras digitales
    
- 1 Computadora
    
- 4 bafles pasivos Moon Stage 12 de 250 W
    
- Superficie de madera hecha a medida
    
- 5 Cables HDMI
    
- Switch Divisor Hdmi con 5 puertos
    
- 4 Toma Corriente Doble Completo Jeluz Armado Toma
    
- 4 Cables plug o canon para conectar los JBL a la interfaz
    
- Placa de sonido Tascam Us 4x4 Interfaz USB Midi de 4 canales
    
- Cable USB
    

## Presupuesto  
Materiales Cantidad

Pantallas LCD 19 5 Pulgadas

Webcams 5 Computadora 1

Cables HDMI 5

Cables plug 4

Precio unitario 8000 (promedio)

200

335

340

Precio total 40000

1000

1675

1360

Entre 147.188 y 172.188

|   |   |   |   |
|---|---|---|---|
|Bafles pasivos Moon Stage 12 de 250 W|4|16062|64248|
|Superficie de madera hecha a medida|1|Entre 15.000 y 40.000|Entre 15.000 y 40.000|

|   |   |   |   |
|---|---|---|---|
|Switch divisor HDMI con 5 puertos|1|753|753|
|Toma Corrientes Dobles Completo Jeluz Armado Toma|3|84|252|

|   |   |   |   |
|---|---|---|---|
|Placa de sonido Tascam Us 4x4 Interfaz USB Midi de 4 canales (con cable USB incluido)|1|22.900|22.900|

TOTAL

## Referencias
### Bibliografía

- Berger John, 1972, “Modos de ver”, edición inglesa.
    
- Cabrera Daniel H., 2006, “Lo tecnológico y lo imaginario. Las nuevas
    
    tecnologías como creencias y esperanzas colectivas”, Biblos, Buenos
    
    Aires.
    
- Cohan James, 2009, “Nam June Paik Live Feed: 1972-1994”
    
    https://www.jamescohan.com/exhibitions/nam-june-paik2
    
- Durkheim Émile, 1912, “Las formas elementales de la vida religiosa”, Libro segundo, “Las creencias elementales”, Alianza Editorial.
    
- Kane, Carolyn, 2009, “The Cybernetic Pioneer of Video Art: Nam June Paik”
    
    https://rhizome.org/editorial/2009/may/06/the-cybernetic-pioneer-of-
    
    video-art-nam-june-paik/
    
- Lozano Hemmer, Rafael, 2010, “Pulse Index” http://www.lozano-hemmer.com/artworks/pulse_index.php
    
- Sardón, Mariano (2011), “The Wall of Gazes” http://www.marianosardon.com.ar/wall/wall.htm