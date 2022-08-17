# 1 - Azar
## 1.1 Secuencia aleatoria de 3 notas 16/08
Sobre lo trabajado en la clase de hoy:

- Logré que suene: había un problema con la variable *shift*. Aún no entiendo bien qué función cumplía, pero quitándola pudo arrancar.
- Aún así, a veces me devolvía algún error de consola, relativo a *Tone.start()*. Cambié el funcionamiento del botón play, tratando de seguir lo que indica el readme de Tone.js.
- Jugué un poco con los parámetros del sintetizador, para colorearlo un poco.

Problemas:
- El timing de los eventos parece funcionar de manera independiente al botón **Play**. Si se deja pasar mucho tiempo desde que carga el navegador, no se oirá la secuencia de alturas.

Posibles desarrollos:
- Agregar un botón **Stop** (desde aquí, se puede reiniciar presionando **Rerun** en esquina inferior derecha)
- Modificar algún parámetro del sintetizador en función del tiempo

https://codepen.io/nlpz404/pen/abYQRwQ?editors=1011
