
```dataview
TABLE    without ID ("![|200](" + photo + ")") as foto, file.link as name, file.frontmatter.born as "year", tags, file.outlinks as "backlinks"
FROM "04-out/personas" 
FLATTEN tags
```