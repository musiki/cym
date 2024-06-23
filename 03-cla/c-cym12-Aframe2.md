---
type: class
tags: cym, música visual, armonía expandida,class
unit: 0
num:  12
year: 2023
---


<!-- slide bg="#010100"--> 
![[untref-logo-w.svg|100]]
CYM24

# a-frame

---
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