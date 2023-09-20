
El CSS permite controlar la apariencia de una página web, en español «hojas de estilo en cascada».

## sintaxis
```css
elementosDelHtml {
	propiedad: valor;
}
```

```html
<elemento1>
	<elemento2>
	
	</elemento2>
</elemento2>
```

```css
elemento1 {
	propiedad:valor;
}

elemento1 elemento2 { /*en las etiquetas anidadas respeto la estructura para llamarlas en css*/
	propiedad:valor
}
```

### selección de html

```css
h1 {
   propiedad: valor;
}

.clase { /*agrupo propiedades en una misma clase para diferentes elementos del html*/
   propiedad: valor;
}

#id { /*asigno propiedad particular para un solo elemento*/
   propiedad: valor;
}
```