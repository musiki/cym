---
type: class
tags: cym, música visual, armonía expandida,class
unit: 0
num:  8
year: 2023
---

<!-- slide bg="#010100"--> 
![[untref-logo-w.svg|100]]
CYM24

# hydra + p5

Lo primero es llamar a la librería de p5 en nuestro código de hydra con `p1 = new P5()`. Cada vez que utilicemos un atributo propio de p5, se hace linkeando a esa librería con `p1.`
Luego, declaro el source 1 con `s1.init({src: p1.canvas})` y lo edito con funciones propias de hydra `src(s1).scrollY(0, -0.3).out()`

```js
p1 = new P5()

p1.textSize(70);
p1.fill(34, 160, 88);
p1.stroke(15, 252, 3);
p1.strokeWeight(5);
p1.textFont('monospace');
p1.text('hola mundo', (p1.displayWidth/12), (p1.displayHeight/10)); //posición
p1.hide()

s1.init({src: p1.canvas})
src(s1).scrollY(0, -0.3).out()
```
<iframe src="https://hydra.ojack.xyz/?sketch_id=ZNwJdUlDz78hti0a" name="myFrame" align="center" scrolling="no" style="width: 600px; height: 250px; border: solid 0px #000000;"></iframe>

### layers
```js
p1 = new P5()
p1.textSize(70);
p1.fill(0, 230, 248);
p1.stroke(15, 252, 3);
p1.strokeWeight(5);
p1.textFont('monospace');
p1.text('hola mundo', (p1.displayWidth/12), (p1.displayHeight/10)); //posición
p1.hide()
s1.init({src: p1.canvas})
osc(20, 0.3, 2.3).rotate(0.8).pixelate(200, 30).layer(src(s1).scrollY(0, -0.3)).out() //layers
```
<iframe src="https://hydra.ojack.xyz/?sketch_id=QMCReGyGerpApHH8" name="myFrame" align="center" scrolling="no" style="width: 600px; height: 250px; border: solid 0px #000000;"></iframe>


<iframe src="https://hydra.ojack.xyz/?sketch_id=8URh0QPiMyO5js7n" name="myFrame" align="center" scrolling="no" style="width: 600px; height: 250px; border: solid 0px #000000;"></iframe>

# hydra + p5.js
[p5glitch](http://p5.glitch.me/) es una clase [p5.js](https://p5js.org/) para el browser.
Aquí, también se debe cargar la librería en el hydra con la función `loadScript()`, además de cargar a p5 con `p=new P5()`

```js

await loadScript("https://cdn.jsdelivr.net/npm/p5.glitch@latest/p5.glitch.js")

//genero una variable
let glitch;

p = new P5()
glitch = new Glitch(p); //linkeo con la variable de p5(p)

//cargo imagen
p.loadImage('https://icones.pro/wp-content/uploads/2021/06/icone-github-orange.png', function(im) {
glitch.loadImage(im);
});

//antes de las funciones de p5
glitch.loadType('jpg');
glitch.loadQuality(0.1);
p.imageMode(p.CENTER);

p.draw = () => {
	p.clear();
	glitch.resetBytes(); 
	glitch.replaceBytes(100, 104); 
	glitch.randomBytes(100);
	glitch.limitBytes(0.1);
	glitch.buildImage();
	p.image(glitch.image, p.width/2,p.height/2)
}


p.hide();


s0.init({src: p.canvas}) 

osc(10).layer(src(s0).modulate(noise(2))).out()
```

<iframe src="https://hydra.ojack.xyz/?sketch_id=ZPzH7g6tB38IqwEp" name="myFrame" align="center" scrolling="no" style="width: 600px; height: 250px; border: solid 0px #000000;"></iframe>


## Sources
<iframe src="https://codepen.io/carodip/pen/ExryNBJ" name="myFrame" align="center" scrolling="no" style="width: 600px; height: 250px; border: solid 0px #000000;"></iframe>
