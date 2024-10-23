---
tags: #1
name: 1
val1: text1
val2: text2
---


1. define an inline variable  
> 			a:: #label-a
1. call the variable 
> 			'=this.a'
1. inline dataview js
>	`$= dv.current().file.mtime


produce la fecha actual en la variable dv

	```dataview
	LIST FROM #libros 
	```


	```dataview 
	LIST 'File Path: ' + file.path FROM "04-out"
	```

```dataview 
LIST "File Path: "  + file.path FROM "03-cla"
```
````

