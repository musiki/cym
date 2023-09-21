---
tags:
  - tp
project: cym23
date: 2023-08-29
---

- [x] TP1  - topoi ⏫ 📅 2023-08-29 ✅ 2023-09-21

> [!INFO] >la lista de topoi puede ser consultada en https://musiki.org.ar/Topoi

## Objetivos

definir temas para comprender el mundo actual, crear o editar artículos para y , vincular los contenidos con traducciones a aplicaciones musicales y/o resonantes.

## Consignas

-   elegir uno de los topoi propuestos o proponer uno. Los temas deben dialogar con problemas estéticos, filosóficos y/o político-sociales de los últimos 20 años, o que hayan tenido un impacto notable en las sociedades del siglo XXI.

-   Antes de crear un artículo siempre es prioridad enriquecer y editar una entrada ya creada.  

-   El artículo debe tener un mínimo de 1000 y un máximo de 5000 palabras. Debe contar con todos los elementos y recursos posibles en el lenguaje wiki (fuentes abiertas, hipervínculos, usos de wikicommons si fuera necesario, índices de wikidata, y links a otros recursos de musiki.


# entregas


```dataview
Table  without ID("![|100](" + banner + ")") as foto, file.link as name, author as author, publish as "año", tags
FROM "04-out/topoi"
WHERE contains(publish,2023)
SORT publish DESC
```


# Guía de textos 

```dataview
Table author as Author, ("![|100](" + coverUrl + ")") as Cover, publish as "año", category as category, colabs
From "04-out/bibliografía"
SORT Status DESC
```