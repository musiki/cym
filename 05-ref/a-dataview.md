
## tipos de query

hay tres tipos de queries, TABLE (yaml metadata), LIST (páginas) y TASK(checkboxes)

el formato básico es 
```

```dataview
 TABLE|LIST|TASK <field> [AS "Column Name"], <field>, ..., <field> FROM <source> 
 WHERE <expression>
  SORT <expression> [ASC/DESC]
   ... other data commands ```

```

## listar entradas de la carpeta topoi

```dataview
TABLE
 tags

FROM "03-ref/topoi"
SORT rating DESC

```

## list tasks
```dataview
TASK FROM "01-proj"

```

## list files in the book folder
```dataview
TABLE  file.name AS "libro", file.mtime AS "última modificación"
FROM "03-ref/bibliografía"
SORT file.mtime DESC

```

## inline


```dataview
LIST FROM #topoi

```


# inline fields

- que es un "field"?
Un campo de metadatos es un par formado por una clave y un valor. El valor de un campo tiene un tipo de datos (más información aquí) que determina cómo se comportará este campo al consultarlo.

Puede añadir cualquier número de campos a una nota, un elemento de lista o una tarea.

---
alias "cat"
last-reviewed: 2023-07-03
thoughts:
	rating: 9
	reviewable: false
---

con esto creamos una metadata llamada alias, last-reviewed y thoughts, cada uno con data-types distintas.



{{o|toplab|hace esto|https://www.youtube.com/watch?v=jBRqOp5ws58}}



