---
type: project
author: Augusto Paladino
tags: proyectual
publish: 2017
---
No-Music Player - en adelante NMP - es una aplicación para dispositivos móviles que reconoce sonidos ambiente y devuelve una respuesta sonora a modo de interacción.

## Memoria descriptiva

Se han desarrollado investigaciones en el área que son pertinentes para el área en la cual pretendemos indagar.

En primer lugar, el escritor, compositor, educador, pedagogo musical y ambientalista canadiense Raymond Murray Schafer conceptualizó en la década de los ‘60 el término "paisaje sonoro" para describir a la identidad sonora de cada ambiente, lo que refiere tanto a un entorno urbano como a un entorno natural. El interés de Schafer no sólo se centró en el aprendizaje y experiencia de la escucha humana, sino que también estuvo influenciado por un fuerte discurso ecologista de preservación de estos paisajes sonoros. El concepto de paisaje sonoro ha evolucionado con el correr de los años, en el centro de distintas discusiones teóricas. Por fuera de los ámbitos académicos, el concepto influenció la creación de diversos géneros musicales tales como el Ambient, entre otros. En este sentido pensamos en una variante del concepto de “paisaje sonoro” como un marco conceptual pertinente para este proyecto, el cual creemos que es preciso definirlo dentro de un concepto que se adecúe a la propuesta de NMP. La variante que aquí proponemos de dicho concepto incluye aquí al individuo situado en un lugar y momento particular de su cotidianeidad, por un lado, y por otro, siendo este el que decide interactuar con aquello que escucha. De esta manera, proponemos abrir el concepto hacia situaciones cotidianas que en lugar de permanecer en lugares
particulares, pueden acompañar al interlocutor y, al mismo tiempo, pueden ser ampliadas o aumentadas desde la virtualidad que ofrece la aplicación.

En segundo lugar, se han desarrollado aplicaciones para dispositivos móviles orientadas al aprendizaje musical - como instrumentos virtuales, herramientas de estudio para lecto-escritura, herramientas de entrenamiento de audio-perceptiva, etc.-, también se han desarrollado sintetizadores móviles; Dentro de estos casos, la más pertinente de las aplicaciones móviles es myNoise®, la cual surgió como página web en el año 2013 orientada al diseño sonoro con una mirada científica de la escucha humana y con el objetivo de promover la salud y el bienestar de sus usarios. La propuesta de myNoise® se centra en la posibilidad del usuario de configurar un paisaje sonoro a su gusto. Utilizando el esquema de un ecualizador gráfico de diez bandas para diferenciar entre las distintas partes constitutivas de cada sonido - graves, medios graves, medios, medios agudos, etc.-. La aplicación ofrece una amplia variedad de paisajes sonoros con sus respectivos ecualizadores que pueden ser modificados de esta manera.

En tercer y último lugar, es preciso mencionar la propuesta artística del Soundwalk, el cual es un paseo que centra la atención y la escucha en el entorno, que a su vez puede estar intervenido de diversas maneras (AMCNN, “Christina Kubisch – Electrical Walks” YouTube. YouTube, LLC), o puede simplemente ser contemplado con el objetivo de disparar ideas musicales posteriores.

En suma, lo que proponemos aquí, con NMP, es reunir estos conceptos provenientes de distintos lugares y distintas épocas para la creación y realización de una situación de experiencia musical que se desplace en el tiempo y en el espacio dependiendo exclusivamente del usuario, ya que la movilidad le permite llevar la obra consigo y decidir sobre lo que quiere experimentar. De esta manera, cada usuario puede elegir interactuar con los sonidos del entorno que lo rodea y explorar la potencialidad musical de aquellos sonidos.
(Fig.1. Railroads Noise Generator de myNoise®)

## Objetivos

1. Promover la experimentación y el ejercicio de la escucha.
    
2. Invitar a observar los fenómenos sonoros de la cotidianeidad
    
3. Invitar a interactuar con ellos por medio de la aplicación.

## Métodos y Materiales

La idea central es que NMP reciba un estímulo sonoro, busque en una base de datos, y seleccione basándose en cualidades tímbricas, que resultarán ser constrastantes o complementarias al estímulo inicial. Usando un método de identificación de timbre (Timbre ID, el cual se puede consultar mediante video a partir del escaneo del código QR al final del documento) podemos lograr que el programa aprenda del estímulo recibido y se entrene respecto de sus cualidades sonoras generales. Luego, con arbitrariedad en el criterio de selección de los audios que serán reproducidos como respuestas y al mismo tiempo con el uso de la lógica condicional el programa seleccionará una respuesta sonora dentro de una cantida limitada de posibilidades.

Mediante entradas a partir de archivos de audio se puede entrenar al programa para que en un estado posterior pase a identificar los timbres y elegir entre una u otra respuesta sonora. Luego del entrenamiento, hay un elemento en la cadena de programación que dependiendo de los valores numéricos que resulten de la identificación del timbre deberá devolver un audio u otro. Es decir, por ejemplo, si durante la identificación de un timbre el valor numérico devuelto coincide con el valor asignado a alguno de los sonidos previamente diseñados y grabados, entonces será reproducido instantáneamente. Es preciso refinar este procedimiento para evitar que, durante la respuesta, el programa devuelva de manera simultánea más de un sonido a la vez.

Las categorías que la aplicación identificará y procesará son:

1. Agua
    
2. Ambiente de ciudad
    
3. Tren
    
4. Pasos
    
5. Fuegos Artificiales
    
6. Sirenas
    
7. Obras/Construcción
    

Cabe mencionar que los audios que devuelve el programa como respuestas serán diseñados y grabados previamente con un criterio adecuado a cada una de las categorías sonoras. Dicho diseño sonoro incluye tanto de un proceso de producción creativa, como de un proceso de post-producción técnica con el cual se ajustarán los detalles finales que garanticen una buena señal de audio para el usuario.

Como respuestas sonoras se utilizarán:

1. Sonidos electrónicos.
    
2. Sonidos inarmónicos con distintos registros.
    
3. Instrumentos convencionales.
    
4. Procesadores de efectos (que tomen y transformen la fuente
    

sonora original y la devuelvan procesada como respuesta).

a) Delay b) Reverb c) Phaser d) Reverse

Para usar la aplicación cada usuario necesita:

1. – Smartphone (con Android OS, o iOS)
    
2. – Auriculares (preferentemente Headphones)
    

## Justificación

Desde esta perspectiva, la contaminación sonora en la vía pública es un buen material digno de ser reciclado. La existencia de este factor es un buen punto de partida para convertir eso que entendemos por ruido en algo que pueda ser un material musical. El interés personal surge a partir de la propuesta de devolver al sentido de la audición la importancia que otrora ha tenido, y a su vez orientar esta percepción hacia el desarrollo de la capacidad reflexiva, es decir, de un autoaprendizaje en lo que respecta a las cualidades sonoras en general y a las de los que conforman cada paisaje sonoro en particular.

|Cronograma|
|*La dedicación mensual es de 30 horas, lo que daría un total de 180hs en los 6 meses. Presupuesto|

1. -30 horas de grabación en estudio: $16.000
    
2. -30 horas de programación: $26.000
    
3. -Diseño gráfico: $2000
    

-Total: $44.000 (Calculado al 01/12/2017)

## Referencias

Schaffer, R. Murray, El paisaje sonoro y la afinación del mundo. Editorial INTERMEDIO, 2013.

Truax, Barry, Paisaje sonoro, comunicación visual y composición con sonidos ambientales. Disponible en http://www.eumus.edu.uy/eme/ps/txt/truax.html. [Consultado el 01/12/2017]

Kato, Sawako, Soundwalk, Digital Media, and Sound Art. http://acousticecologyaustralia.org/symposium2003/proceedings/papers/sKato.pdf. [Consultado el 01/12/2017]

myNoise®, https://mynoise.net/[Consultadoel01/12/2017]

*Debajo el código QR que contiene el link al video que muestra el prototipo de NMP .
