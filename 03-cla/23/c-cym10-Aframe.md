---
type: class
tags: [cym, visualmusic, armoníaexpandida,class]
unit: 0
num:  10 - 11
year: 2023
---

<!-- slide bg="#010100"--> 
![[untref-logo-w.svg|100]]
CYM24
# A-frame

Es un framework en javascript para crear experiencias de realidad virtual. Utiliza la arquitectura ECS (Entity Component System) donde cada objeto es una entidad.

Para incluirlo en html --> 
```html
<script src="https://aframe.io/releases/1.3.0/aframe.min.js"></script>
```

**Entidades**: objetos contenedores
**Componentes**: propiedades de comportamiento, apariencia y funcionalidad (módulos reutilizables)
**Sistemas**: provienen el entorno donde manejar y desarrollar los componentes

Las entidades son representadas con`` <a-entity> ``los componentes son representados mediante las propiedades html en ``<a-entity>``. 

Sintaxis:
```html
<a-entity ${componentName}="${propertyName1}: ${propertyValue1}; ${propertyName2:}: ${propertyValue2}">
```

Ejemplo: 
```html
<a-entity geometry="primitive: sphere; radius: 1.5"
		         light="type: point; color: white; intensity: 2"
		         material="color: white; shader: flat; src: glow.jpg"
		         position="0 0 -5"></a-entity>
		         ```

Componente simple: 
```html
<a-entity position="0 0 5"></a-entity>
```

Componente compuesto:
```html
<a-entity light="type: point; color: white; intensity: 2"></a-entity>
```

Sinónimos
```html
<a-entity geometry="primitive: box; position: 1 0 3"></a-entity>
```
=
```html
<a-box position="1 0 3"></a-box>
```
 (etiqueta semántica)


<iframe height="600" width="800" src="https://aframe1.zzigo.repl.co/" allow="fullscreen" allowfullscreen="" style="height:100%;width:100%; aspect-ratio: 16 / 9; "></iframe>



## Transformation

- position
- rotation
- scale

## Texturas

- img src

```html
<a-scene>

<a-assets>

<img id="texture" src="img/texture.jpg">

</a-assets>

<a-box color="#FFFFFF" width="1" height="1" depth="1"

position="0 0 0"

rotation="45 45 45"

scale="1 2.5 1"

src="#texture"></a-box>

</a-scene>
```

## Animaciones

```html
<a-animation attribute="rotation" repeat="indefinite" to="0 360 0"></a-animation>
```

## Posición de la camara
```html
<a-camera position="0 7 5"> <!--posicion camara general-->
    <a-cursor color="red"/>
    </a-camera>
```

## Interacción con el mouse
```html
<script>
  
    var box = document.querySelector( 'a-box' );
            box.addEventListener( 'mouseenter', function ( )
            {
                box.setAttribute( 'scale',
                {
                    x: 4,
                    y: 1,
                    z: 6
                } );
            } );
  </script>
```

## Light
```html
<a-light type="spot" color="#FF0000" position="-20 0 0" look-at="a-box"></a-light>

<a-light type="point" color="#00FF00" position="0 5 0"></a-light>
```
