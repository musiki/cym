---
title: digital garden
---


<iframe title="cym tutorial digital garden plugin" src="https://www.youtube.com/embed/UFngHjGWZwI?feature=oembed" height="113" width="200" allowfullscreen="" allow="fullscreen" style="aspect-ratio: 1.76991 / 1; width: 100%; height: 100%;"></iframe>

utilizamos el plugin desarrollado por Ole Steensen, github, vercel, y un repo template para simplificar el proceso. Aqui la [documentación original](https://dg-docs.ole.dev/)

//para mac
0. abrir terminal / instalar homebrew
```bash

/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
brew install git
```
//para windows
1. abrir terminal / instalar wsl.exe --install / 0
2. Instalar el plugin Digital Garden desde el Community Plugins de Obsidian
![](https://i.imgur.com/QXrJSdd.png)
---
2. Crear una cuenta en [github](https://github.com/settings/tokens/new?scopes=repo) y mantenerse logueadx
---
3. con el user activo crear un github TOKEN o bien siguiendo este [link](https://github.com/settings/tokens/new?scopes=repo)  o en github / settings / developers settings (abajo a la izquierda de la barra lateral) / token / classic token (para todos los repo) o finegrain token (para un único repo), ante la duda classic. Presionar "Generate Token" y guardar con cuidado la clave ya que no se puede volver a recuperar.  La configuración correcta ya debería estar aplicada. (Si no querés generar esto cada pocos meses, elige la opción «Sin caducidad»). 
---
4. Crear una cuenta en Vercel para deployment, siguiendo este [link](https://vercel.com/signup) 
---
5. Abrir este **[repo template](https://github.com/oleeskild/digitalgarden)** y clickear en el boton "Deploy"
![](https://i.imgur.com/hGcAytG.png)

Esto debería abrir Vercel y crear una copia de este repositorio en tu cuenta de GitHub. Dale un nombre adecuado, como «mi-blog». Seguí los pasos que se indican en Vercel para publicar tu sitio en Internet.

---
6. Volver a Obsidian y setear los datos de **github repo name** , **github username**  y **github token**

![](https://i.imgur.com/zUpS1aJ.png)


---
7. con todo esto ya podemos publicar nuestra primera nota , necesitamos al menos dos tipos, una dg-home que será la portada de nuestro blog y las restantes con la propiedad dg-publish ambas en el YAML.
8. Para hacer un YAML , ponemos en la cabecera de una nota :

```bash
---
dg-home: true
dg-publish: true
---
```


---
9. Abri tu paleta de comandos pulsando CTRL+P en Windows/Linux (CMD+P en Mac) y busca el comando «Digital Garden: Publish Single Note» (Jardín digital: publicar una sola nota). Pulsa Intro.


Ahora que ya está todo listo y en funcionamiento, puede echar un vistazo a los [comandos](https://dg-docs.ole.dev/getting-started/02-commands/) disponibles o a las distintas [configuraciones de notas](https://dg-docs.ole.dev/getting-started/03-note-settings/) disponibles. ¿O tal vez querés cambiar tu [tema](https://dg-docs.ole.dev/getting-started/04-appearance-settings/)?


---
## Para clonar template de CYM:

0. Realizar paso 0 anterior (Windows/mac), en caso de no haberlo realizado.
---
1. Abrir el **[repo template](https://github.com/musiki/cym-astro-obsidian-template)** de CYM y clickear en el boton "Deploy"
![](https://i.imgur.com/hGcAytG.png)
Esto también debería abrir Vercel y crear una copia de este repositorio en tu cuenta de GitHub. Asignale un nombre a tu repo.

-----
2. En github, buscar ese repositorio y copiar el link. En la terminal, en la carpeta elegida, vamos a clonar nuestro propio repo
```bash
git clone https://github.com/USUARIO/REPOSITORIO
```
---
3. Con 'cd' accedo a diferentes archivos (dentro de la terminal) e instalo las dependencias
```bash
cd MICARPETACLONADA
npm install
```
---
4. Corre el servidor de desarrollo
```bash
npm run dev
```
---
5. Abrir obsidian y abrir un nuevo vault, seleccionando la carpeta del MIREPOCLONADO/src/content/vault
---
6. Instalar el plugin de Digital Garden y completar datos de **github repo name** , **github username**  y **github token**.

![](https://i.imgur.com/zUpS1aJ.png)

---
7. Aún dentro de Obsidian, instalar el plugin de Git y habilitar.
---
8. Realizar, dentro de obsidian, ejecutar 'git: commit all changes' y luego 'git: push'. 
---
9. También dentro de obsidian, ejecutar 'digital garden: publish multiple notes'.
---
10. **Ya está publicada la web en Vercel y updateado el repo en Github. Cada vez que se realice un cambio se debe repetir el paso 8 y 9.**