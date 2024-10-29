
```dataview
TABLE    without ID ("![|100](" + photo + ")") as foto, file.link as name, year as year, backlinks as backlinks
FROM "04-out/personas"  AND -#pioneer AND -#argentina
SORT year ASC
```


## pioneers

```dataview
TABLE    without ID ("![|100](" + photo + ")") as foto, file.link as name, year as year, backlinks as backlinks
FROM #pioneer 
SORT year ASC
```

## argentinos

```dataview
TABLE    without ID ("![|100](" + photo + ")") as foto, file.link as name, year as year, backlinks as backlinks
WHERE contains(tags, "argentina") 
SORT year ASC
```
