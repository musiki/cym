```dataviewjs
for (let page of dv.pages().where(p => p.dossiers)) {
  dv.paragraph(`## dossiers  <br> <br>[[${page.file.name}]]: ${page.dossiers}`);
}
```






