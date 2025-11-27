
# testeo con el plugin "code emmiter"


1. en code emitter solo se pueden cargar librerias con el emulador Pyodide( numpy, matplotlib,scipy y algunas otras)
2. no hace falta correr el código. 
3. se importan usando `import micropip`



```python
import micropip
await micropip.install('numpy')
await micropip.install('matplotlib')

import numpy as np
import matplotlib.pyplot as plt

# Crear una matriz con un patrón simple
data = np.zeros((50,50))
data[10:40, 10:40] = 0.5
data[20:30, 20:30] = 1.0

# Mostrar con matplotlib
fig, ax = plt.subplots()
ax.imshow(data, cmap="viridis")
ax.set_title("Hello World Matrix")
ax.axis("off")
plt.show()
```



# execute-code

## animación

```run-python
html_code = """
<style>
@keyframes spin {
  from {transform: rotate(0deg);}
  to {transform: rotate(360deg);}
}
</style>
<div style="width: 50px; height: 50px; background: blue; animation: spin 2s linear infinite;"></div>
"""

@html(html_code)
```

