---
type: class
tags: cym, música visual, armonía expandida,class, diy, imi
unit: 1
num:  6
year: 2022
---

<!-- slide bg="#010100" -->
UNTREF | CYM22 | 06
# un instrumento online colectivo
---

# introducción 

que es un exo-instrumento?

Bernard Stiegler 

---
# objetivos

- kiss [keep it simple stupid]
- screenless
- musical
	- adsr  e intensidad controlable
	- modulación tímbrica
- objetivos de mínima
	- interface en red. 
- objetivos de máxima
	- networking performance
---
![](https://i.imgur.com/ofxL8ML.png)


---
hay un destination o varios?
  1 solo. 

? como se definen los generadores 
	tipos [ var generadores = [{tipo: 1, tonejscommand : "Tone.FMsynth", formaOnda: "sin"}]

Mousetrap ("qwer", generadores[1])

Mousetrap ("sq", generadores[1].formaOnda: "square")
como se disparan los generadores

-> pantalla bienvenida ingresando nombre interactor. 
-> hacer un circulo 

# algunos ejemplos

---

https://petet.itch.io/valence-aleator

---
estructura de la web

local
frontend [navegador]
usuario 
js , html, css
var, arrays , functions, class, 

API -> webaudioAPI, 
AJAX -> webRTC -> socket.io 
|
|
remoto
backend [servidor]
server
c++, php, mysql, apache, nginx [>node.js]
nps, yaml

# screenless basics

## teclado

<iframe height="600" width="800" src="https://replit.com/@jsmusic/generators05-simple?embed=true#index.html" allowfullscreen="" allow="fullscreen" style="aspect-ratio: 1.33333 / 1; width: 100%; height: 100%;"></iframe>

<<<<<<< HEAD:03-cla/c-cym06-un instrumento online colectivo.md

# mouse

=======
---

# Mousetrap

Mousetrap es una librería que utiliza shortcuts del teclado con JavaScript.


```java
//single keys
Mousetrap.bind("s", function(e) {        //haz lo que quieras  
});
```

<iframe height="600" width="800" src="https://codepen.io/carodip/pen/poVEJxB?editors=0110" allow="fullscreen" allowfullscreen="" style="height:100%;width:100%; aspect-ratio: 16 / 9; "></iframe>

---

```java
//combinations
Mousetrap.bind("command+k", function(e) {        //haz lo que quieras  
```

<iframe height="600" width="800" src="https://codepen.io/carodip/pen/GRdjErX" allow="fullscreen" allowfullscreen="" style="height:100%;width:100%; aspect-ratio: 16 / 9; "></iframe>

---

<iframe height="600" width="800" src="https://codepen.io/carodip/pen/xxjEPJX" allow="fullscreen" allowfullscreen="" style="height:100%;width:100%; aspect-ratio: 16 / 9; "></iframe>

---
### mouseTrap - grid

<iframe height="600" width="800" src="https://codepen.io/carodip/pen/LYmRQWV" allow="fullscreen" allowfullscreen="" style="height:100%;width:100%; aspect-ratio: 16 / 9; "></iframe>
>>>>>>> origin/main:03-ref/clases/c-cym06-un instrumento online colectivo.md
