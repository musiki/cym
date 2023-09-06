---
type: project
author: Martin Tortorelli
tags: proyectual
publish: 2021
---
## SÍNTESIS:

El Generador de poemas sonorizados es una aplicación web que traduce poemas a sonoridades musicales relacionándolas con estados de ánimo.

## OBJETIVOS:

- ❖  Construir un generador de poemas musicales anímico-textuales.
    
- ❖  Generar secuencias de sonidos a partir de un texto poético.
    
- ❖  Estudiar la traducción entre poesía, sonido y estados de ánimo.
    
- ❖  Investigar sobre los puentes y relaciones entre expresividad musical y expresividad poética/literaria.
    
- ❖  Dotar a los usuarios de un tipo de escritura relacionada, generando una herramienta que permita la traducción intermodal.
    
- ❖  Repensar las premisas de la música programática a partir de la interrelación entre poesía y música.
    
    ### JUSTIFICACIÓN:
    
    A raíz de reflexionar sobre los límites y relaciones entre la expresión musical y la poesía, la búsqueda es ampliar el lenguaje añadiendo al texto escrito sonoridades musicales capaces de transmitir un estado de ánimo definido. La premisa principal
    

de la aplicación es experimentar con las posibilidades de creación de un abecedario paralelo al del habla, formado por muestras que se atañen a cada letra del alfabeto, interactuando de diferente forma según el estado de ánimo evocado por el texto y otorgando un lenguaje de sonoridades.

Un claro ejemplo de esto es el código morse (también conocido como alfabeto morse), el cual funciona como un sistema de representación de letras y números mediante señales emitidas de forma intermitente. Cada letra del alfabeto cuenta con su propio código sonoro, el cual está basado en la combinación entre puntos (duración mínima de la señal sonora) y rayas (tres veces la duración del punto). Entre cada par de símbolos de una misma letra existe una ausencia de señal con duración aproximada a la de un punto. Entre las letras de una misma palabra, la ausencia es aproximadamente tres puntos. Para la separación de palabras transmitidas el tiempo es de aproximadamente tres veces el de la raya.

## Alfabeto morse

A su vez en el siglo XIX, período romántico, la música programática buscó generar una traducción efectiva de la poesía (y otras artes) a la música. Uno de los referentes más importantes de esta corriente fue el compositor húngaro Franz Liszt, el cual compuso una serie de trece obras orquestales llamadas "Poemas sinfónicos". Estas composiciones intentaban ilustrar proyectos extramusicales derivados de una serie de trece poemas elegidos por el compositor.

Incluso en los conciertos de estas y otras obras de música programática, se le repartía al público un programa con los textos en los que se habían inspirado las piezas, de esta manera el oyente podía vislumbrar las relaciones entre la poesía y la expresividad de la música que habían sido construidas por el compositor.

El Generador de poemas sonorizados se basa en este tipo de construcciones de traducciones sonoras de la poesía y del alfabeto, incluyendo a su vez el factor del estado de ánimo como parámetro adicional de expresividad y comunicación.

## DESARROLLO:

¿Es posible generar un discurso musical automático que sea, en cierta medida, funcional a la expresividad de un poema? El Generador de poemas sonorizados busca ampliar nuestra percepción acerca de las posibilidades de relación entre texto y música, generando sonoridades y combinaciones que emergen a través de lo escrito dentro de la aplicación.

### Desglose

La aplicación se ejecuta mediante un sitio web, el cual dispone de la interfaz para poder jugar, siendo necesaria una conexión a internet.

Al ingresar el usuario debe añadir un texto poético, seleccionar entre los estados de ánimo ofrecidos el que mejor represente la expresividad del poema y luego interactuar con la barra de reproducción para empezar, parar y volver al principio.

El Generador de poemas sonorizados consiste en que el usuario pruebe con diferentes textos las secuencias musicales que son generadas automáticamente por la aplicación, pudiendo probar las distintas paletas de sonidos de cada estado de ánimo disponible. El usuario además tiene la opción de subir su creación al banco público de la aplicación, donde otros usuarios podrán escuchar y leer los poemas sonorizados del resto.

### Principio de funcionamiento

Cada letra del teclado de la computadora (27 contando la Ñ) tiene mapeada una muestra específica de duración corta (máximo un segundo por muestra), que se determina según el estado de ánimo que se haya seleccionado previamente. Hay cinco estados de ánimo posibles de elegir por el usuario, cada uno cuenta con un grupo distinto de 27 sonidos que se asignan a las letras del teclado, es decir que se cuenta con un total de 135 de muestras distintas sumando todos los sonidos disponibles por las cinco opciones seleccionables.

Al ingresar un texto y habiendo seleccionado el estado de ánimo que mejor aplica al escrito, el usuario debe pulsar el botón de reproducir para escuchar la secuencia resultante. Es posible cambiar el estado de ánimo para escuchar cómo queda el texto con las otras opciones disponibles. En la interfaz hay un botón de reproducción, otro de pausa y otro de stop (volver al principio).

A continuación se presenta un cuadro con el código ASCII de cada letra del teclado latino, el cual es el elegido para un correcto uso de la aplicación:

|   |   |
|---|---|
|CÓDIGO ASCII|LETRA|
|65 - 97|A- a|
|66 - 98|B -b|
|67 - 99|C- c|
|68 - 100|D -d|

|   |   |
|---|---|
|69 - 101|E- e|
|70 - 102|F -f|
|71 - 103|G- g|
|72 - 104|H -h|
|73 - 105|I -i|
|74 - 106|J- j|
|75 - 107|K- k|
|76 - 108|L- l|
|77 - 109|M- m|
|78 - 110|N -n|
|165 - 164|Ñ -ñ|
|79 - 111|O- o|
|80 - 112|P- p|
|81 - 113|Q- q|
|82 - 114|R- r|
|83 - 115|S- s|
|84 - 116|T- t|
|85 - 117|U -u|
|86 - 118|V- v|
|87 - 119|W- w|
|88 - 120|X- x|
|89 - 121|Y- y|
|90 - 122|Z- z|

JUGABILIDAD

● ●

●

●

●

El usuario entra a la aplicación utilizando su navegador web.

Al ingresar el usuario se encuentra con la Splash Screen (pantalla de inicio) donde debe escribir una poesía propia o copiar una ya existente.

Luego debe seleccionar en el recuadro de arriba a la izquierda una de las opciones del menú de estados de ánimo que mejor evoque la expresividad del texto. Las opciones son dichoso, enamorado, dolorido, contemplativo y desdichado. Cada una de estas cuenta con su propia paleta de sonidos.

Arriba del cuadro donde el usuario añade el texto anteriormente se encuentra la barra de reproducción, donde debe seleccionar el botón de reproducción para escuchar la secuencia musical resultante. Puede pausar la reproducción o seleccionar el botón de stop para volver al principio. Es posible cambiar el estado de ánimo para escuchar las otras posibilidades.

Una vez que el usuario se encuentre satisfecho con el resultado, éste puede subir su poema sonorizado al banco público de la aplicación, donde otros usuarios podrán escuchar su creación.

## REFERENCIAS

Patatap

https://patatap.com

La aplicación de muestras de sonido a cada letra del teclado fue anteriormente desarrollada en Patatap, una aplicación de kit de sonido visual con animaciones del programador informático Jono Brandel y el dúo electrónico japonés Lullatone.

Poemm

http://www.poemm.net/

Poemm es una aplicación creada por Jason Edward Lewis & Bruno Nadeau, la cual consiste en una interfaz para leer poemas famosos donde se puede interactuar con la predisposición y visualización de las palabras a través de dispositivos con pantallas táctiles.

## BIBLIOGRAFÍA

Calvet, Louis-Jean (2001). Historia de la escritura. Traducido por Javier Palacio Tauste. Paidós Ibérica.

Searle, Humphrey (1980). «Liszt, Franz». En Stanley Sadie, ed. The New Grove Dictionary of Music and Musicians 20 (1a edición). Londres: Macmillan.

MacDonald, Hugh (2001). «Symphonic Poem». En Stanley Sadie, ed. The New Grove Dictionary of Music and Musicians 29 (2a edición). Londres: Macmillan.

«Recommendation ITU-R M.1677-1(10/2009) International Morse code» (PDF). 26 de noviembre de 2009: 7.