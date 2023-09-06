---
type: project
author: Carolina Marazzi
tags: proyectual
publish: 2021
---

**Collage Sonoro (2021)**

**Carolina Marazzi**

1. Síntesis

El presente proyecto es una aplicación web musical, en la cual el usuario combina sonidos pregrabados en _loop_, así como cuadrados de colores. 

2. Objetivos

- Generar una relación entre sonido y color.
- Trasladar la idea visual de collage al ámbito del sonido. 
- Proporcionar los elementos para una creación artística por parte del usuario.
- Fomentar el arte interactivo.

3. Justificación / Memoria conceptual

La app web pretende ser una obra abierta, que precisa de una persona que manipule los botones para ser concretada. Esto quiere decir que es interactiva y que, además, puede tener limitados pero diversos resultados. En su libro _Obra Abierta_, Umberto Eco expresa que en este tipo de obras “[…] el usuario organiza y estructura, por el lado mismo de la producción y de la manualidad_,_ el discurso musical. Colabora a hacer la obra” (1979). La app se centra en esta idea de ofrecerle al jugador “una obra por acabar”, cuyo resultado no es completamente previsible. Me parece interesante trabajar este tipo de interacción entre el compositor y el intérprete, apartando la relación tradicional. Acerca de esto, Eco sostiene que la obra abierta “[…] establece una nueva relación entre contemplación y uso de la obra de arte” (1979). La obra/app en cuestión no está pensada solamente para ser contemplada o escuchada, sino también, y esencialmente, para ser utilizada como un medio para la creación artística. 

La investigadora Claudia Giannetti, acerca del arte interactivo, manifiesta un concepto similar al de obra abierta de Eco: “[…] cuando hablamos de arte interactivo, nos referimos a un tipo de producción concebida específicamente para proporcionar el diálogo con el usuario: la obra como tal se revela a partir de la actuación y de la intervención del espectador.” (2004, 2). Además, Giannetti expresa la idea de un partícipe necesario e indispensable en la interactividad: el diseño de interfaz. 

_“La adaptación de la estructura a un sistema de comunicación bidireccional implica el desarrollo de un “mediador” que desempeñe esta función, como es el caso del diseño de interfaz. Esto supone vincular los intereses puramente estéticos y personales a la creación de una relación interactiva entre el usuario y la producción.”_ (2004, 1)

En este sentido, es importante que el diseño de interfaz haga conveniente y práctica la interacción del usuario.

En el caso de Collage Sonoro, el diseño de interfaz es, sobre todo, minimalista. Se trata de una respuesta visual análoga a lo sonoro, que también lo es. Además, tiene presente algo esencial de la obra, que es la idea de la superposición, del arte de la combinación de estructuras ya dadas. Se debe a esto la decisión de utilizar la palabra collage en su nombre. 

El collage comenzó a emplearse a principios del siglo XX. Según la definición de la RAE, se trata de la “técnica pictórica que consiste en componer una obra plástica uniendo imágenes, fragmentos, objetos y materiales de procedencias diversas”. _Naturaleza muerta con silla de rejilla_, cuadro de Pablo Picasso, es considerado uno de los primeros collages de la historia del arte. 

_“Naturaleza muerta con silla de rejilla”, Pablo Picasso (1912)._

Saúl Yurkievich, en su ensayo _Estética de lo discontinuo y lo fragmentario: el collage_, expresa la siguiente reflexión: 

_“El collage es el ícono que vuelve visible la estética de lo inacabado, discontinuo y fragmentario, su manifestación sensible. Corresponde a la desarticulación de los antiguos marcos de referencia, a la pérdida de la noción de centro, a la multiplicación de dimensiones y direcciones, a una relativización generalizada, a una situación constantemente sujeta a cambio, a crisis, a colapsos.”_ (1986: 59)


4. Descripción 

Los sonidos enlistados a la derecha de la pantalla pueden escucharse individualmente haciendo un _click_ con el mouse. Este _click_, además, añade el sonido/cuadrado de color al plano general. Esta selección puede revertirse haciendo nuevamente un _click_ sobre el recuadro correspondiente de la lista. Es así como se va llenando la pantalla de cuadrados de colores hasta lograr el resultado visual final. El resultado sonoro, es decir, los sonidos elegidos sonando en superposición y en _loop_, recién puede escucharse al presionar la barra espaciadora. 

   4. 1 Gráfico


4. 2 Estados

Visualmente, hay un estado de inicio, donde la página principal se encuentra en blanco y solo aparece la lista de sonidos/cuadrados de colores a la derecha. En el estado intermedio, hay algunos cuadrados de colores en la página principal, que todavía pueden ser intercambiados por otros. En el estado final, luego de tocar la barra espaciadora, los cuadrados de colores en superposición se transforman en una imagen fija.

4. 3 Principio de funcionamiento 

La aplicación web se realiza mediante programación en _html_. Se utiliza como librería _tone.js_, un marco de trabajo de Web Audio para la creación de música interactiva en el navegador. Los sonidos elegidos se cargan en el código _javascript_, así como los cuadrados de colores se programan en _css_. Para organizar y dividir la pantalla en columnas, así como para la adaptación a distintas pantallas, se utiliza la librería Bootstrap.

5. Requerimientos técnicos 

Para poder utilizar esta aplicación, se necesita: 

- Computadora, tableta o celular. 

- Acceso a Internet. 

- Parlantes.

5. Bibliografía

**Eco, Umberto (1979)**

_Obra Abierta_. Editorial Ariel S.A.

**Gianetti, Claudia (2004)**

_El espectador como interactor_. Disponible en [http://www.artmetamedia.net/pdf/4Giannetti_InteractorES.pdf](http://www.artmetamedia.net/pdf/4Giannetti_InteractorES.pdf)

**Yurkievich, Saúl (1986)**

_Estética de lo discontinuo y lo fragmentario: el collage_. Acta poética (volumen 6, N° 1-2), 53-69.