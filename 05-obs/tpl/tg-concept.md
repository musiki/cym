---
promptId: concepts
name: "🗞️concepts "
description: generate concepts in academic terms
author: Luciano Azzigotti
tags: 
version: 0.0.1
disableProvider: false
---
contenido:
{{title}}
{{contexto}}

prompt:
Eres un escritor académico en el campo de la nueva organología, la composición con extensiones a las matemáticas, la codificación, la fabricación digital y la filosofía especulativa. Estructura la respuesta en tres secciones: primero una sinopsis, texto puro, sin títulos, sin jerga, sin introducción, sólo definiciones duras. En segundo lugar, el **núcleo**, con las ideas principales en forma de lista, utilizando los destacados indicados si procede, y las **cuestiones de investigación**. Asegúrese de que las preguntas de investigación sean fundamentales, inventivas y de vanguardia, con citas en línea de los trabajos y publicaciones fundacionales. Incluya un **bloque de referencias BibTeX** al final.

- **Si existen notas relacionadas**, intégrelas utilizando **la sintaxis wiki-links de Obsidian (`[[ ]]`)**.
- **Sugiere conexiones significativas** entre {{title}} y otros conceptos de mis notas, utilizando `[[Related Note]]` si procede.
- **Utilizar citas en línea** de fuentes académicas y referenciarlas en un **bloque BibTeX**.

---

## Núcleo

Desglosar los principios fundamentales de {{title}} en una lista estructurada.  
- Utilice **puntos concisos y bien referenciados** que expliquen las ideas clave.  
- Si procede, sugiera **conexiones con notas existentes** utilizando `[[ ]]`.
- Si son necesarias ecuaciones matemáticas, hágalas en látex en línea utilizando $ $ y en párrafo utilizando $$ $$. 
- Resaltar, ser selectivo y elegante, tiempo al tiempo, nunca títulos, y sólo una palabra con estos criterios: 
	- **conceptos relevantes** con etiquetas <mark class='hltr-blue'>.   
	- si es controvertido, polémico, ambiguo, discutido por la academia, no consensuado, antagónico, incluir **referencias históricas** y **discusiones críticas** con <mark class='hltr-red'>.
- con <mark class=«hltr-verde»>: ideas centrales (pocas no más de 3 por texto) hasta 3.
- con <mark class=«hltr-amarillo»> etiquetas: autores, obras de arte, datos concretos, fechas de giro.
- con <mark class=«hltr-purple»>: imaginativo, inspirador para extenderse en la imaginación o campos creativos, onírico. ( hasta 2)
- con <mark class=«hltr-naranja»>metodologías, métodos, métodos de análisis, construcciones y técnicas de composición
- No TE OLVIDES de cerrar las marcas </mark> cuando la definición esté puesta.
- Cite las fuentes **en línea** utilizando `(@autor AÑO : Nümero de Página)`.  

---

## Preguntas de investigación

- **¿Cuáles son los retos teóricos emergentes en {{title}}?**.  
- ¿Cómo se relaciona {{título}} con los debates contemporáneos en [campo relevante]**?  
- ¿A qué aplicaciones especulativas o disruptivas podría dar lugar {{title}} en un futuro próximo?**.  

Apoye cada pregunta con una **cita académica** en línea.

---

## Referencias
Proporcione referencias extensas en formato BibTeX, utilizando el blocktext «```bibtex» incluyendo trabajos fundacionales y las últimas investigaciones sobre {{title}} y {{content}}.
Hasta 6.  Utilice exclusivamente obras citadas en {{content}} sincronizando la referencia o actualizándola. 



