---
dg-publish: true
dg-home: true
dg-note-icon: 02-mat/obs/img/logo-musiki-only.png
---

bienvenidxs al repositorio público de información musical de la cátedra de Ciencia y Música, UNTREF, Buenos Aires Argentina. 

## topoi

```dataview
List  without ID ("![|(" + banner + ")") as foto, file.link as name, author as author, publish as "año", tags
FROM "04-out/topoi"
WHERE contains(dg-publish,true)
SORT publish DESC
```


