---
type: topoi
tags: azar, generativad, topoi, cym
unit: 32
publish: 2021
author: zztt
banner: "https://noosphere.princeton.edu/images/movie256_b.gif"
---

### unit: 0

Según [[Jacques Monod]] en [[El Azar y la Necesidad]] la vida es una cuestión de azar puro: la consecuencia de elementos químicos convergentes mas condiciones apropiadas para la transformación. En otras palabras la sopa primigenia. Una vez que se forman los primeros aminoácidos, la evolución de las formas de la vida depende de un grado de complejización necesaria.

El azar es una de las primeras acciones posibles de realizar en una computadora. Esto es conocido como RGn (random number generation).

Si pensamos en las formas mas simples de azar , podemos trazar una relación directamente proporcional entre su eficiencia y la cantidad de impredictibilidad (en general dada por la cantidad de los factores). Entre comparar el arrojar una moneda y un dado, entendemos que la impredictibilidad de la moneda es 2 y la del dado 6, y la cantidad de factores la suma de fuerzas, condiciones ambientales, ejecutivas etc.

En el casos de las computadores se utilizan fenómenos físicos como el decaimiento radiactivo, el ruido térmico, los picos de los diodos Zener, aunque el método mas común es el PRnG y el generador linear congruente.

$X\_{n+1} = (a X\_n + b), \textrm{mod}, m$

### azar libre

```js

console.log (Math.random())

```

## random limitado

```js

var limiteInferior = 10;
var limiteSuperior = 30;
var rango = limiteSuperior - limiteInferior;

var numRandom = Math.random() * rango + limiteInferior

console.log ("random limitado :", numRandom, "\n", "random limitado entero :", Math.round(numRandom) )

```

> [!TODO] > hacer un generador melódico de solo 3 notas sucesivas de la escala.


## Solución


