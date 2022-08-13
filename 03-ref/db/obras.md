```dataview
TABLE person AS "Autor", year, publisher, cover
FROM #obras
SORT year DESC
```

```button
name sumar bibliografía
type note(t-bibliografía,split) note
action t-bibliografía Note Template
templater true
```

