> [!important] > Atención! para correr los snippets de javascript es necesario ir a configuración del plugin Executc de node.js. (ademas de tener instalado node.js) En windows la ruta es C:\Program Files\nodejs\node.exe


```mermaid
graph LR

a[internet music]
b[js]
b0[variables]
b01[types]
b02[arrays]
b03[scope]
b1[make decisions]
b11[conditionals]
b111[if...else]
b112[else...if]
b12[comparision operators]
b13[logical operators]
b14[switch statements]
b2[make loops]
b4[reusable blocks]


a --> b 
b --> b0 & b1 & b2 & b3 & b4
b0 --> b01 & b02 & b03
b1 --> b11 & b12
b11 --> b111 & b112 



classDef default stroke-width:1px;
classDef c1 stroke:#DFFF00;
classDef c2 stroke:#FFBF00;
classDef c3 stroke:#FF7F50;
classDef c4 stroke:#DE163;
classDef c5 stroke:#40E0D0;
classDef c6 stroke:#CCCCFF;

class a c1;
class b c2;
class c c3;






```


# variables
un espacio de memoria asignable mediante un nombre y un valor. Tres aspectos fundamentales de las variable en js son: los tipos (enteros, reales, cadenas de texto, boleanos, null y undefined),  el scope y el uso de variables como objetos. 

```javascript

var a = 10;
var b = 12;
console.log (a + b)

var  f = true;

```


# arrays
```javascript
var notas=["C","C#","D","D#", "E","F","G","G#","A","A#","B"]

var total = notas.length;

console.log ("listar toda la escala :", notas, "\n" , 
			'la cantidad de notas es :', total, "\n",
			'la tercera nota es : ', notas[3], "\n", 
			'la posición de la nota F es : ', notas.lastIndexOf('F'), "\n",
			'las tres últimas notas som : ',notas.slice(total-3,total), "\n",
			'la escala retrógrada es : ', notas.reverse(), '\n',

			'la escala contiene un Bb : ', notas.includes('Bb'), "\n",
		    'la escala contiene un G# : ', notas.includes('G#')
)


```

```javascript
var notas=["C","C#","D","E","F","G","A","B"]

console.log ("listar toda la escala", notas)

```
#
```
# librerias
## tone.js

