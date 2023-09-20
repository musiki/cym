
```dataview
TABLE    without ID ("![|100](" + photo + ")") as foto, file.link as name, year as year, tags, backlinks as backlinks
FROM "04-out/personas" 
SORT Status DESC
FLATTEN tags
```
