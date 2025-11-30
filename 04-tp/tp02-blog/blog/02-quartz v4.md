
1. clonar repo
```bash
git clone https://github.com/jackyzha0/quartz.git
cd quartz
npm i
● Copy an existing folder
[copiar el path de la carpeta]
● Treat links as shortest path ((default))
```

2. crear un repo propio donde vas a alojar la publicación

```bash
# ejemplo de repo de publicaciones de cym
https://github.com/musiki/cym-p
```

3. correr npx quart

```bash
npx quartz create
```

4. borrar el .git

```bash
rm -rf .git
```

5. apuntar el url a nuestro repo de publicación
```bash
git init
git add .
git commit -m "first quartz"
git branch -M main
git remote add origin https://github.com/musiki/cym-p
git remote set-url origin https://github.com/musiki/cym-p.git
npx quartz sync --no-pull
```

6. crear deploy.yml

```
cd .github/workflows

nano deploy.yml

#copiar este código
```

### deploy.yml

el deploy.yml es un Github Actions para generar en ci/cd las páginas de quartz 

```bash
name: Deploy Quartz to GitHub Pages

on:
  push:
    branches: [ main ]
  workflow_dispatch:

permissions:
  contents: read
  pages: write
  id-token: write

concurrency:
  group: quartz-pages
  cancel-in-progress: true

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - uses: actions/setup-node@v4
        with:
          node-version: 22
          cache: 'npm'

      - run: npm i -g npm@latest
      - run: npm ci || npm i

      - run: npx quartz build

      - uses: actions/upload-pages-artifact@v3
        with:
          path: ./public

  deploy:
    needs: build
    runs-on: ubuntu-latest
    environment:
      name: github-pages
    steps:
      - id: deployment
        uses: actions/deploy-pages@v4
```
7. ir a github / settings / pages 
Head to “Settings” tab of your forked repository and in the sidebar, click “Pages”. Under “Source”, select “GitHub Actions”.
Commit these changes by doing `npx quartz sync`. This should deploy your site to `<github-username>.github.io/<repository-name>`.
8. elegir Github Actions
9. Actions - deploy quartz to github pages - run workflow
10. eliminar del .gitignore la carpeta public




- Idea: pensado para publicar directamente un vault de Obsidian como sitio estático; trae KaTeX por defecto y acepta HTML en notas, por lo que puedes incrustar scripts.
- Pasos:
1.Crear repo a partir del template de Quartz v4 y copiar tus notas a content/ (o clonar y adaptar).
2.Math: ya viene activo; usa delimitadores $…$ y $$…$$.
3.JS ejecutable: en una nota puedes escribir HTML+JS crudo. Ejemplo en una nota .md


<div id="demo"></div>
<script>
  const el=document.getElementById('demo');el.textContent='Hola desde JS';
</script>


Para reutilizar, coloca un archivo en public/js/app.js y referencia:

<script src="/js/app.js"></script>


4.Despliegue:
- GitHub Pages: usa la acción específica para build de Quartz o configura Pages para servir la carpeta de salida generada por la acción.  ￼
- Vercel: importa el repo y en “Build Command” usa npx quartz build.  ￼

- Pros: configuración mínima, KaTeX integrado, muy cercano a Obsidian. Concede HTML crudo, por tanto snippets activos funcionan.  ￼
- Contras: menos control fino del pipeline y de la seguridad de scripts; si tus alumnos pegan scripts externos, conviene enseñar prácticas básicas de CSP.

2.Eleventy (11ty) + Markdown-it + KaTeX [intermedio, muy controlable]

- Idea: SSG simple en Node que procesa Markdown; acepta HTML crudo y puedes activar KaTeX/MathJax vía plugins de Markdown-it.
- Pasos:
1.Inicializar:

npm i -D @11ty/eleventy markdown-it @mdit/plugin-katex


2.Configuración .eleventy.js mínima con KaTeX:

const markdownIt=require('markdown-it');
const katex=require('@mdit/plugin-katex');
module.exports=function(eleventyConfig){
  const md=markdownIt({html:true,linkify:true,typographer:true}).use(katex);
  eleventyConfig.setLibrary('md',md);
  eleventyConfig.addPassthroughCopy({'public':'/'}); // para js/css
  return {dir:{input:'src',output:'_site'}};
}

En src/posts/ tus .md de Obsidian; coloca estilos KaTeX en public/katex.min.css si el plugin no los inyecta.

3.JS ejecutable: igual que arriba, HTML+script en la nota o  desde public/js/app.js. Eleventy permite HTML directo en Markdown.  ￼
4.Math: delimitadores $…$ y $$…$$ con KaTeX.  ￼
5.Despliegue:
- GitHub Pages: workflow con actions-gh-pages que empuja _site a gh-pages; configura Pages para ese branch.  ￼
- Vercel: importa el repo, “Build Command”: npx @11ty/eleventy, “Output dir”: _site.  ￼

- Pros: curva de aprendizaje suave, control de pipeline y plantillas, HTML crudo admitido; perfecto para enseñar fundamentos.
- Contras: necesitas añadir KaTeX y CSS; más pasos que Quartz.


