---
type: help
---


## como instalar git 
###  
git está preinstalado.‮
### ⊞ 
1. presionando la tecla Windows, abri el 'command.exe'
2. introducí está linea de código para instalar git mediante winget
	
```bash
winget install -e --id Git.Git
```

## como bajar el repositorio

```bash
git clone https://github.com/musiki/cym.git
```

# instalación de python

## método 1 terminal / command

### ‮

prerequisito: tener instalado homebrew 

```bash
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
```

```bash
brew install python
```
### ⊞

```bash
winget install -e --id Python.Python.3.9 --scope machine
```

## método 2 GUI installer

### 
ir a https://www.python.org/downloads/  y bajar el instalador.
### ⊞

Abrir Microsoft Store y buscar 'python'


##  plugin: Execute Code

1. ir al setup de Obsidian (cmd + ;)
2. Buscar el plugin Execute Code en Community Plugins
3. En la configuración agregar tu path de python
`
```js
Python path : 
```

con el path de python correspondiente. Para conocer el path: 

⊞ 
```bash
where python
```
‮
```bash
which python
```


### ⊞
> [! note] enviromental variables
> en windows a veces es necesario chequear las variables de entorno que mantienen el acceso a las librerias de Python . Para ello :
> 1. presioná Win + R, buscá `sysdm.cpl` y presioná Enter.
> 2. Andá a la pestaña **Advanced** y luego buscá → click **Environment Variables...***
> 3. Seleccioná Path → Edit , y tendrias que sumar una libea parecifa a esta :
>    
>    C:\Users\YourName\AppData\Local\Programs\Python\Python311\Scripts\
>    
>    (dependiendo de la versión de Python).
> 4. Click Ok → Ok → Ok.
> 5. cerrá el command y obsidian y volvé a abrir todo para que tome efecto el path cambiado. 



