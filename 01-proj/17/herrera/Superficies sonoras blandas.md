---
type: project
author: Lucas Herrera
tags: proyectual
publish: 2017
---
**Superficies sonoras blandas** 

**Síntesis** 

Es un instrumento musical de que propone una interacción táctil, visual y sonora a través de un sistema analógico-digital que transforma el movimiento de una mano sobre una superficie lisa y elástica, en sonido, mediante proceso en tiempo real. 

**Objetivos** 

El objetivo inicial de este trabajo es concretar un dispositivo como el descripto en funcionamiento. Un prototipo que siente las bases para expandirse a experiencias más grandes e inmersivas. En primera instancia lo importante es contar con un instrumento de dimensiones pequeñas, transportable, práctico y atractivo visualmente. En una instancia superadora se buscará la expansión del mismo a superficies grandes como paredes, pisos y techos con el fin de concretar instalaciones transitables sonoras en su totalidad.

**Antecedentes / Memoria conceptual** 

"De qué manera el mundo se crea con cada interacción, o intervención, en la que el sistema no sería una representación de la evolución del mundo en un tiempo comprimido, sino una pregunta acerca de cómo el mundo podría ser" (Hernández, Ileana en "Interactividad, vida artificial y espacio/tiempo en las instalaciones inmersivas" [http://sedici.unlp.edu.ar/bitstream/handle/10915/46253/Documento_completo__.pdf?sequence=1](http://sedici.unlp.edu.ar/bitstream/handle/10915/46253/Documento_completo__.pdf?sequence=1)) 

  

**Neo luthería**

1. CONTACT - Felix Faire (2016) 

[https://vimeo.com/felixfaire/contact](https://vimeo.com/felixfaire/contact)

1. REACTABLE 

[http://reactable.com/](http://reactable.com/)

**Realidad aumentada**

1. INFINITY OF FLOWERS - TeamLab

[https://www.teamlab.art/w/infinity-of-flowers/](https://www.teamlab.art/w/infinity-of-flowers/)

1. THE LIVING ROOM - Mignonneau & Sommerer (2001)

[http://www.interface.ufg.ac.at/christa-laurent/WORKS/MOVIES/TheLivingRoom.html](http://www.interface.ufg.ac.at/christa-laurent/WORKS/MOVIES/TheLivingRoom.html)

**Instalaciones inmersivas**

1. CRYSTAL UNIVERSE - TeamLab

[https://www.teamlab.art/w/dmm-crystaluniverse/](https://www.teamlab.art/w/dmm-crystaluniverse/)

1. LA MENESUNDA (1965) 

[https://www.youtube.com/watch?v=4CRAq6c3_H8](https://www.youtube.com/watch?v=4CRAq6c3_H8)

  

**Desarrollo** 

**- Materiales:**

- proyector 
- tela semi transparente (tul) 
- cámara web o celular 
- P.C. o smartphone 
- parlantes. 

**- Funcionamiento -**

**Entrada** 

El dispositivo puede ser dispuesto de manera horizontal o vertical. El ejecutante toca y hunde la tela hacia el haz de luz emitido por el proyector. Al hacerlo, el sector de la tela hundido por la yema de los dedos tomará un color determinado por la profundidad del toque.

Una cámara web o de celular recibirá esa información y la enviará a la P.C (eventualmente a una versión móvil para celulares) para, mediante Pd, obtener una salida sonora según las variables que se le sean asignadas.

Para generar correctamente la información necesaria para ser transformada en Pure Data es necesario tener en cuenta lo siguiente: 

a) el recorrido del dedo sobre el plano (eje x, y). Puede ser resuelto por algún "patch" como los que identifican el movimiento del _mouse_ (_mouse tracker_), que resultará en información de posición sobre el plano que abarca la cámara, dando valores X - Y asignables.

b) detección y diferenciación de los colores. Algún _patch_ como el color-tracking.pd nos permite identificar en todo el plano visible la aparición de los colores.

**Transformación** 

Diferentes estrategias pueden ser planteadas para el proceso interno del dispositivo. Las variables principales a tener en cuenta son tres: 

- Eje X (altura)
- Eje Y (ancho 
- Eje Z (profundidad - color)

(Una cuarta variable puede ser la velocidad del movimiento sobre el plano)

Algunas opciones posibles pueden ser:

a) X= LFO o Filtro - Y= LFO o filtro - Z= Frecuencia (nota)

b) X= Frecuencia (nota) - Y= amplitud - Z= LFO o filtro

**Salida** 

El objetivo es lograr una interfáz áptica, realista, que unifique el movimiento con el sonido y sus modulaciones (criterio del sonido resultante no definido aún)

La salida del audio, enn el caso de contar con una P.C será mediante parlantes externos o auriculares. Si el medio utilizado es un smartphone puede utilizarse el parlante del mismo, uno externo o auriculares.

## Cronograma

El conograma correspondiente al proyecto se entrega en archivo PDF adjunto bajo el título:

Superficies sonoras blandas_cronograma prototipo.pdf

## Presupuesto

El presupuesto correspondiente al pruyecto se entrega en archivo PDF adjunto bajo el título:

Superficies sonoras blandas_presupuesto prototipo.pdf

## Referencias y bibliografía

[1] HERNÁNDEZ, Ileana (2001) "Interactividad, vida artificial y espacio/tiempo en las instalaciones inmersivas" http: //sedici. unlp. edu. ar/bitstream/handle/10915/46253/Documento_completo__. pdf? sequence=1, (último ingreso 14/11/2017)

[2] RENA, MEHRA, LIN, COPOSKY (2005) "Designing Virtual Instruments with Touch-Enabled Interface" http://gamma.cs.unc.edu/TabletopEnsemble/VirtualInstrumentsCaseStudy.pdf (último ingreso 14/11/2017)

Software de la obra CONTACT: (último ingreso 14/11/2017)

https://github.com/felixfaire/CONTACT/tree/master/FelixFaireContactTable  
Web Oficial de Felix Faire: http://www.floatpr.com/felix-faire (último ingreso 14/11/2017)