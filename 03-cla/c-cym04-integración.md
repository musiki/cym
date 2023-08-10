---
type: class
tags: cym, música visual, armonía expandida,class
unit: 0
num:  4
year: 2023
---

<!-- slide bg="#010100" -->
UNTREF | CYM23 | 04
# integración JS

---

# partes de un código

---
# variables y array 

Una variable es un contenedor para un valor, que puede o no variar.


# tipo de variables

## String
Secuencia de texto en cadena

```js

let miVariable = 'myNote';
```

## Number

Esto es un número. Los números no tienen comillas.

```js
let miVariable = 440;
```


## Boolean

Tienen valor true/false

```js

let miVariable = true;
```

## Array

Permite almacenar varios valores en una sola referencia.

```js
let miVariable = [1,'myNote','C4',440];
```

Para llamar a cada valor del array: 
```js
miVariable[0]`, `miVariable[1]
```
etc.

---
# estructuras de decisión

## condicionales
```js
if (condición) {
  código a ejecutar si la condición es verdadera
} else {
  ejecuta este otro código si la condición es falsa
}
```
## operadores de comparación
```
= Igual a 
!= Diferente a 
=== Contenido y tipo igual a 
!== Contenido o tipo diferente de >`` Mayor que 
>= Mayor o igual que 
< Menor que 
<= Menor o igual que

## operadores lógicos
``&& and
|| or
! not

```

---
# bucles



---
# tonejs - generación

generadores de señales
---
# tonejs - scheduling

<iframe src="https://codepen.io/LucianoAzzigotti/pen/ZExgXew?editors=1111" allow="fullscreen" allowfullscreen="" style="height:100%;width:100%; aspect-ratio: 16 / 9; "></iframe>


<iframe src="https://codepen.io/carodip/pen/xxWvMwN" allow="fullscreen" allowfullscreen="" style="height:100%;width:100%; aspect-ratio: 16 / 9; "></iframe>

--
### step sequencer
<iframe src="https://codepen.io/jakealbaugh/pen/qxjPMM/" allow="fullscreen" allowfullscreen="" style="height:100%;width:100%; aspect-ratio: 16 / 9; "></iframe>
--
### custom livecoding


<iframe height="600" width="800" src="https://replit.com/@jsmusic/tonejslive-01?embed=true#index.html" allowfullscreen="" allow="fullscreen" style="aspect-ratio: 1.33333 / 1; width: 100%; height: 100%;"></iframe>

---

# tonejs - interacción 


### DOM

####  FADERS
<iframe height="600" width="800" src="https://replit.com/@jsmusic/sliders01?embed=true" allowfullscreen="" allow="fullscreen" style="aspect-ratio: 1.33333 / 1; width: 100%; height: 100%;"></iframe>

#### canvas
<iframe height="600" width="800" src="https://replit.com/@jsmusic/viewport02?embed=true" allowfullscreen="" allow="fullscreen" style="aspect-ratio: 1.33333 / 1; width: 100%; height: 100%;"></iframe>


#### flex-box
<iframe src="https://codepen.io/carodip/pen/BarXqdw" allow="fullscreen" allowfullscreen="" style="height:100%;width:100%; aspect-ratio: 16 / 9; "></iframe>


<iframe src="https://codepen.io/carodip/pen/rNdXbrv" allow="fullscreen" allowfullscreen="" style="height:100%;width:100%; aspect-ratio: 16 / 9; "></iframe>

### periféricos 

#### MOUSE
<iframe height="600" width="800" src="https://replit.com/@jsmusic/mouse01?embed=true" allowfullscreen="" allow="fullscreen" style="aspect-ratio: 1.33333 / 1; width: 100%; height: 100%;"></iframe>

<iframe height="600" width="800" src="https://replit.com/@jsmusic/mousesound04?embed=true#index.html" allowfullscreen="" allow="fullscreen" style="aspect-ratio: 1.33333 / 1; width: 100%; height: 100%;"></iframe>

#### TECLADO 
<iframe src="https://codepen.io/chriscoyier/pen/mPgoYJ" allow="fullscreen" allowfullscreen="" style="height:100%;width:100%; aspect-ratio: 16 / 9; "></iframe>




