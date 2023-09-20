---
type: project
author: Marianela Ruiz Burtoli
tags: proyectual, web
publish: 2020
---
## Síntesis

Conexiones es una obra digital interactiva que relaciona sonidos con una representación visual que engloba el universo y partículas atómicas.

## Objetivos

-   Generar un vínculo interactivo entre el espectador y la obra, siendo este partícipe decisivo durante el desarrollo de la misma en cuanto a sonoridades a oír.
    
-   Promover el interés del espectador por obras artísticas relacionadas con las ciencias exactas.
    
-   Jugar con la ambigüedad de la representación de partículas atómicas y del universo.
    

## Descripción breve

“Conexiones” es una obra digital interactiva la cual consiste en una imagen llena de círculos en movimiento que representan tanto el mundo cuántico (partículas atómicas), como el universo observable.

El espectador interactúa con la obra mediante un dispositivo, seleccionando ciertas secciones predeterminadas de la interfaz, generando de esta manera un sonido diferente en cada caso.

Los distintos elementos sonoros producidos, están compuestos por sonidos reinterpretados provenientes de la nebulosa de Orión, obtenidos por el observatorio astronómico ALMA, ubicado en el norte de Chile, fusionados con sonidos cotidianos.

## Memoria conceptual

Tomando como punto de partida el hecho de que la música siempre tuvo una relación estrecha con la matemática y que ya en la Antigua Grecia Platón concibió “La teoría de las esferas”, basándose en la idea de que el universo estaría gobernado por proporciones numéricas armoniosas y que el movimiento de los cuerpos celestes se rige según proporciones musicales; llegando a la conclusión que las distancias entre estos planetas definirían los intervalos musicales.

Mucho tiempo después, Kepler, conocido por develar la forma elíptica de las órbitas planetarias escribió un tratado llamado “Harmonices mundi”, donde además de describir leyes astronómicas, le asignó a cada planeta notas musicales en función de su velocidad angular.

Los planetas cuya velocidad angular era más variable, abarcaban un mayor rango sonoro. Mientras que Venus, por ejemplo, adscrito casi a una circunferencia en su recorrido alrededor del sol, entonaba siempre la misma nota. Además, Kepler asignó voces a cada uno de ellos: desde Mercurio, la soprano, el planeta más cercano al sol y, por tanto, el de mayor frecuencia (el más veloz), hasta los bajos: Júpiter y Saturno (los más lentos y graves).

Figura 1: Johannes Kepler. Harmonices mundi V (1619)

Si bien ahora gracias a los avances de la ciencia sabemos que en el universo no existe sonido y lo anterior ha sido descartado, aunque podría entenderse como una metáfora, lo que es irrefutable es la curiosidad de la humanidad sobre la relación que existe, si la hay, entre la música, la matemática y el universo.

Ya en la actualidad, existen proyectos como “Collide International Award”, creado por el CERN y Foundation for Art and Creative Technology, Liverpool, el cual propone la interacción entre científicos y artistas, con el propósito de vincular arte con ciencia. Esto fue el puntapié inicial para comenzar a reflexionar sobre una obra que fusione sonidos, representaciones del universo y de gran parte de la composición del mismo, es decir los átomos.

Es por ello que el proyecto “Conexiones” intenta hacer reflexionar al espectador desde un lado artístico en el sentido de la ambigüedad que se presenta al representar el mundo cuántico y al universo como macro entidad.

Figura 2: Primeros bosquejos de la obra.
## Desarrollo  
### Explicación

El código utilizado para crear círculos aleatorios de distintos colores es el siguiente: float i=0;

void setup(){ fullScreen(P3D); noStroke();

background(0);  
while(i<100){  
ellipse_aleatorio(random(width), random(height), i); i++;  
}  
}  
void ellipse_aleatorio(float x, float y, float r){ ellipse(x, y, r, r);  
fill(random(0,192), random(0,57), random(0,43));  
}

Este código permite ejecutar elipses de tamaños aleatorios utilizado la función random, con colores creados a partir de RGB, utilizando el mismo criterio. La obra se proyecta fullscreen, es decir que ocupa toda una pantalla.

Se utiliza además la función expand para incrementar el tamaño de los círculos.

El sonido se ejecuta cada vez que se interacciona con distintas secciones de la interfaz. En total, las secciones son nueve.

Figura 2: Secciones donde suenan los diferentes elementos sonoros.

5.1.1. Sobrelacreacióndelsonido

### Sonidos ALMA

Los sonidos provenientes de la nebulosa de Orión, antes de ser un sonido audible por el ser humano, fueron radiación electromagnética emitida por el gas y el polvo que componen las nebulosas presentes en Orión. Luego de haber viajado 1500 años a la velocidad de la luz, fue captada por las antenas de ALMA, un observatorio ubicado en el norte de Chile.

El proceso siguiente fue identificar moléculas a partir del análisis de las ondas de radio que capta. Cada emisión específica corresponde a una molécula. Si bien los sonidos son ondas, son completamente diferentes a las ondas de radiofrecuencia, por lo tanto, hubo que, a través de distintos procesos, reinterpretar las ondas de radio como si fueran ondas de sonido. Una ardua labor ya que las ondas de radio vibran alrededor de 1000 millones de veces por segundo, mientras que el sonido audible para el ser humano vibra entre 20 y 20.000 veces por segundo.

A cada emisión captada desde Orión, se le asignó una combinación de ondas de sonido, creando una colección de sonidos del cosmos. Es decir, que se realizó una analogía entre ondas de radiofrecuencia y ondas de sonido audibles.

Figura 3: Representación del proceso de transformación de señal analógica a señal digital que se utilizó para crear la representación de la radiofrecuencia proveniente de las nebulosas de Orión.

### Sonidos en la obra

Los sonidos que se utilizan en la obra son una fusión entre la representación de los sonidos provenientes de las nebulosas de Orión y de sonidos cotidianos.

Para lograr esa fusión se utilizaron programas de edición. El único parámetro que se modificó fue la reverberación con el fin de mantener los sonidos más puros posibles.

Como la intención es jugar con la ambigüedad que se presenta en las representaciones del campo cuántico y del universo, lo que se transmite con el sonido sigue el mismo lineamiento con respecto a la ambigüedad entre la representación de los sonidos provenientes de las nebulosas de Orión y sonidos a los que estamos familiarizados. Los sonidos fusionados son:

-   Sección 1: spw17_fullespectrum_phase0_SR1000 y el sonido de un contrafagot.
    
-   Sección 2: spw17_lastfifth_Randomphase_SR32000 y el sonido de una ardilla.
    
-   Sección 3: spw1_3q_Randomphase_SR4000 y el sonido de un gong.
    
-   Sección 4: spw6_firstquarter_Randomphase_SR4000 y el sonido de
    
    una ballena.
    
-   Sección 5: spw1_2q_phase0_SR1000 con el sonido de distintos
    
    mamíferos en el océano.
    
-   Sección 6: spw3_fullespectrum_Randomphase_SR100 con el sonido
    
    de una olla.
    
-   Sección 7: spw5_firstquarter_phase0_SR2000 con el sonido de una
    
    pequeña pelota rebotando.
    
-   Sección 8: spw17_3q_Randomphase_SR1000 con el sonido de las
    
    cuerdas más agudas del violonchelo (I y II).
    
-   Sección 9: spw8_lastfifth_Randomphase_SR32000 y el sonido de un
    
    pájaro.  
    Todos los sonidos arriba mencionados pertenecen a la banca de sonidos de la página
    
    sonidosdealma.org los cuales son descargables.
    

## Requerimientos técnicos para uso particular

 Computadora.

-   Acceso a internet.
    
-   Processing 3.  Parlantes.
    
   ### Requerimientos técnicos en el caso de una exposición
    

-   Proyector portátil.
    
-   Computadora.
    
-   Arcade Track ball mouse led.
    
-   Acceso a internet.
    
-   Processing 3.
    
-   Una sala/aula/habitación acústica o al menos que cuente con puertas para aislar el sonido
    
    exterior con luces apagadas.
    
-   4 parlantes ubicados uno en cada esquina.
    
-   Alargues para la conexión de los parlantes.
    
-   Pantalla opcional para el proyector.
    
    Lo ideal es que la única luz que se utilice en la sala sea la del mouse y la obra. Se sugiere que tampoco sea una sala con ventanas ya que se podría filtrar luz natural. Una posible disposición sería la siguiente:
    

##  Vínculo con el público
    
 El vínculo con el público es de contemplación e interacción.
    
Los sonidos que se emitan dependerán de las decisiones que tome el espectador.
    
## Cronograma en caso de exposición 8.1. Etapas
    
 La obra se realiza en tres etapas:
    
-   Creación de la obra, creación de los sonidos, modificaciones hasta lograr el
     resultado deseado. Esta etapa lleva aproximadamente de uno a tres meses.
        
    -   Armado de la instalación y ejecución. Se calcula que dependiendo quien esté a
        
        cargo de dicha tarea, el tiempo será entre dos a tres horas.
        
    -   Interacción del espectador con la obra. El tiempo de esta etapa depende
        
        completamente del espectador y del tiempo que interactúe con la obra.
        
## Presupuesto
    
 Alquiler del lugar 1 10.000 10.000 Proyector portátil 1 5.200 5.200
    

|   |   |   |   |   |   |   |
|---|---|---|---|---|---|---|
|Rubro/materiales||Cantidad||Precio unitario||Precio total|

Computadora 1 Arcade Track ball 1 mouse led.  
Parlante 4 Alargue 4 Pantalla proyector 1

70.000 70.000 15.100 15.100

15.000 60.000 1.100 4.400 7.000 7.000

|   |   |   |   |   |   |   |
|---|---|---|---|---|---|---|
|TOTAL||||||171.700|

## Bibliografía

-   Almudena, M. Castro. (2014). “La música de las esferas”. Cuaderno de cultura científica. Recuperado de https://culturacientifica.com/2014/10/03/la-musica-de-las-esferas/
    
-   Collide International Award.
    
-   Hook, Richard. (2016). “ALMA Sounds, un Proyecto interactivo que busca un lenguaje
    
    cósmico común.” European Southern Observatory. Recuperado de https://www.eso.org/public/spain/announcements/ann16035/