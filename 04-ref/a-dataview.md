# dataview

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


basic field:: hellow

```dataview
LIST FTOM "#basic field"

```



# inline fields

videos sobre livecoding por ejemplo 
{{o|toplab|hace esto|https://www.youtube.com/watch?v=jBRqOp5ws58}}



