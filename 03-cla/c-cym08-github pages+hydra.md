---
type: class
tags:
  - cym
  - música
  - visual
  - armonía
  - expandida
  - class
unit: 0
num: 8
year: 2023
---

<!-- slide bg="#010100"--> 
![[untref-logo-w.svg|100]]
CYM24

# Github pages

Github pages permite hospedar un sitio web directamente desde un repositorio en Github, con el dominio `github.io` o un dominio personalizado.

### pasos
1. Creá un repositorio de visibilidad pública
![](https://i.imgur.com/FlPGMZ9.png)
2. Inicializá un README o cargá tu html/css/js
3. Luego, en Settings, en la sección Code and automation, ir a Pages.
4. Seleccioná el source y el branch y guardá. Allí, debería crearte un link con el acceso a la página.


## ingeniería inversa

**view source** Ctrl+U (Windows PC) o Command+Option+U (Mac)
**inspect elements** F12 (Windows) o Command+SHIFT+C (Mac)

### Upstart

1) abrir Upstart
<iframe width="560" height="315" src="https://nickm.com/poems/upstart.html" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>

2) **view source** Ctrl+U (Windows PC) o Command+Option+U (Mac) y seleccionar todo (control o command A) y luego copiar (control o command C)
3) abrir codepen.io y pegar (control o command V) en la sección de html

### visualStudioCode

1) copiar y pegar el código en VisualStudioCode
2) hay dos formas de cargar los archivos a github:
	1) subiendo el archivo ![](https://i.imgur.com/yyzB4a4.png)
	2) desde la terminal del visualStudio **(SÓLO LA PRIMERA VEZ!)**
> [!INFO] > …or push an existing repository from the command line
git remote add origin https://github.com/dipaola-c/pruebacym2023.git
git branch -M main
git push -u origin main


- **En la terminal del visualStudio (dentro de nuestro folder), hacer git add . , luego git commit, i (insert) sobre data del commit, esc :wq , git push al repo remoto**
para más info ver: 
![[que es git#comandos básicos git]]

3) agregar archivos css y js en el html
```html
<link rel="stylesheet" href="./estilo.css">
<link rel="javascript" href="./main.js">
```


==Luego, en **VisualStudioCode**, para agregar cambios al repo remoto sobre los archivos ya existentes, guardarlos (control o command S) y en la terminal:==

>[!example] > git add .
git commit -m "mensaje sobre el commit"
git push

En github, en la sección 'Settings', ir a 'Pages' y acceder a la url de nuestra web.

## ejemplos código
<iframe height="600" width="800" src="https://codepen.io/isoden/pen/xRpQMO?editors=0110" allow="fullscreen" allowfullscreen="" style="height:100%;width:100%; aspect-ratio: 16 / 9; "></iframe>

<iframe height="600" width="800" src="https://ojack.xyz/PIXELSYNTH/" allow="fullscreen" allowfullscreen="" style="height:100%;width:100%; aspect-ratio: 16 / 9; "></iframe>



# hydra
[https://hydra.ojack.xyz/](https://hydra.ojack.xyz/)

by Olivia Jack

**Hydra** (JavaScript) es una plataforma de **live coding** inspirada en la síntesis modular. Sigue esta misma lógica (señal portadora-moduladora) desde el browser, con una sintaxis muy sencilla.

CTRL-Shift-Enter: corre todo el código  
CTRL-Enter: corre una sola línea  
CTRL-Shift-H: muestra/oculta el código  
CTRL-Shift-S: guarda un screenshot

### objetos y modificadores básicos
<iframe height="600" width="800" src="https://codepen.io/carodip/pen/OJZgrQZ" allow="fullscreen" allowfullscreen="" style="height:100%;width:100%; aspect-ratio: 16 / 9; "></iframe>


### variables
```js
let agua=1
let sonido= voronoi()
noise(agua).diff(sonido).modulate(sonido,agua).out()
```
<iframe src="https://hydra.ojack.xyz/?sketch_id=VDrHJSmaIYJPz8eh" name="myFrame" align="center" scrolling="no" style="width: 600px; height: 250px; border: solid 0px #000000;"></iframe>


### secuencias
```js
osc(20,0.1,1).colorama([25,0.33,0.66,1.0].fast(2)).out()
```
<iframe src="https://hydra.ojack.xyz/?sketch_id=1RB1afWhaorZKCLK" name="myFrame" align="center" scrolling="no" style="width: 600px; height: 250px; border: solid 0px #000000;"></iframe>


### movimiento y tiempo
```js
voronoi().color(0.9,0.25,0.15).rotate(({time})=>(time%360)/2).modulate(osc(25,0.1,0.5)  
            .kaleid(50)  
            .scale(({time})=>Math.sin(time*1)*0.5+1)  
            .modulate(noise(0.6,0.5)),  
            0.5).out(o0)
```
<iframe src="https://hydra.ojack.xyz/?sketch_id=xwXz8sDQfSSxZbys" name="myFrame" align="center" scrolling="no" style="width: 600px; height: 250px; border: solid 0px #000000;"></iframe>


### out y render
```js
voronoi(10).color(2,4,1.3).out(o0)
  noise(23).rotate(1,1).color(2,4,1.3).out(o1)
  osc(40).color(2,4,1.3).scale(34).out(o2)
  shape(6).colorama(2,4,1.3).out(o3)
  render()
```
<iframe src="https://hydra.ojack.xyz/?sketch_id=nEOVXvMmNbBM9Ua5" name="myFrame" align="center" scrolling="no" style="width: 600px; height: 250px; border: solid 0px #000000;"></iframe>
