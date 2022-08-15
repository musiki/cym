
Git es un sistema de control de versiones distribuido. Un sistema de control de versiones:
rastrea los cambios en cualquier conjunto de archivos.

coordinar el trabajo y las contribuciones entre los programadores.
Su objetivo es preservar la integridad de los datos (no superposición
Creado por Linus Torvalds, fue uno de los principales pilares de la creación del núcleo Linux en 2005
Github ,Un servicio de alojamiento que alberga un repositorio git basado en la web. Incluye toda la fucncionalidad de git con características adicionales añadidas.
1. crear un repo desde una carpeta local
Actualmente no existe una forma estable de crear un repositorio desde una máquina local. Entonces, hay que crear una cuenta en github, y crear un repositorio en la página web. Sin embargo, presentamos dos formas de hacerlo desde el CLI:
curl -u usuario:pass <https://api.github.com/<nombre-de-usuario>/repos> -d
hub create [repo-name] //necesitas instalar el programa hub, en mac prueba: brew install hub
2. subir un archivo a un repo ya creado
elige la carpeta de destino // la carpeta que quieres subir
git init //inicializar el .git en la carpeta
git add [filaname] //añade el archivo , o git add . para añadir toda la carpeta
git commit -m "comentario sobre la actualización" // commit 
git remote add origen <https://github.com/zzigo/>[nombre del repositorio].git
git push origen [rama] //git push origen master -u

//git branch -M main

 
3. descargar un repo o un archivo
git clone