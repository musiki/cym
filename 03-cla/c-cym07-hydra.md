---
type: class
tags: cym, música visual, armonía expandida,class
unit: 0
num:  7
year: 2023
---

<!-- slide bg="#010100" -->
UNTREF | CYM23 | 07

# Github pages

Github pages permite hospedar un sitio web directamente desde un repositorio en Github, con el dominio `github.io` o un dominio personalizado.

### pasos
1. Creá un repositorio de visibilidad pública
![](https://i.imgur.com/FlPGMZ9.png)
2. Inicializá un README o cargá tu html/css/js
3. Luego, en Settings, en la sección Code and automation, ir a Pages.
4. Seleccioná el source y el branch y guardá. Allí, debería crearte un link con el acceso a la página.


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
