
Git es un sistema de control de versiones distribuido. Un sistema de control de versiones:
rastrea los cambios en cualquier conjunto de archivos.

coordinar el trabajo y las contribuciones entre los programadores.
Su objetivo es preservar la integridad de los datos (no superposición
Creado por Linus Torvalds, fue uno de los principales pilares de la creación del núcleo Linux en 2005
Github ,Un servicio de alojamiento que alberga un repositorio git basado en la web. Incluye toda la funcionalidad de git con características adicionales añadidas.

![](https://i.imgur.com/0wPuhkN.png)

<iframe width="560" height="315" src="https://www.youtube.com/embed/abA9DG66MyU?si=w768yhIwGaFDgln1" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>
<iframe width="560" height="315" src="https://www.youtube.com/embed/RkxZfEzdfbg?si=6BS59S4npAenGK8t" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>



> [!INFO] > **Para abrir la línea de comandos de Windows o símbolo del sistema, tan solo tienes que ir a Inicio > Ejecutar o Buscar > CMD.exe y se abrirá una pequeña ventana que te recordará al antiguo MS-DOS, o a Inici↬Git→Git Bash.**
**Para abrir la terminal de Mac OS haz clic en el icono "Finder" situado en el Dock, luego selecciona "Aplicaciones > Utilidades", y finalmente dale doble clic al icono "Terminal".
**

### comandos básicos
-  /?: si quieres saber más de un comando, añade /? para ver la ayuda relacionada. Te será muy útil para ver las muchas opciones de cada comando.
-  HELP: te mostrará una lista de comandos disponibles.
-  DIR: es el comando más conocido de DOS y sirve para ver el contenido de una carpeta (en MAC-OS usar LS).CD: sirve para entrar en una carpeta o salir de ella (CD…).
- CLEAR: limpia la consola.
- MKDIR: con este comando crearás una carpeta nueva. Con RMDIR podrás eliminarla.
- MOVE y COPY: son los comandos para mover y copiar archivos respectivamente. Deberás indicar el nombre del archivo con su ruta (si está en otra carpeta en la que te encuentras) y la ruta de destino.
- DEL: es el comando para eliminar un archivo. Recuerda que no irá a la Papelera, así que piensa muy bien antes de borrar algo. Y para eliminar carpeta usa el comando RD (en MAC-OS usar RM para archivos / para eliminar carpetas RM -RF).
- EXIT: cierra la ventana de la línea de comandos o símbolo del sistema.
- COPY CON: crear archivos (en MAC-OS usar TOUCH).
- RENAME: sirve para renombrar un archivo o carpeta. Hay que indicar el nombre original y el definitivo.
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

<iframe width="560" height="315" src="https://www.youtube.com/embed/ysBC0oQ-M84?si=D3gmNRXV14ebppui" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>