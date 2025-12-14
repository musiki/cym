---
title: "Autoevaluación: Conceptos Básicos"
description: "Evalúa tu comprensión sobre aleatoriedad y generatividad"
pubDate: 2024-01-15
visibility: enrolled-only
tags: ["evaluación", "conceptos"]
---

# Autoevaluación: Conceptos Básicos

Responde las siguientes preguntas para evaluar tu comprensión de los conceptos vistos hasta ahora.

## Pregunta 1: Aleatoriedad en Arte Generativo

```eval
id: gen-art-u1-q1
type: mcq
mode: self
points: 1
prompt: "¿Cuál es la principal característica del arte generativo?"
options:
  - "[ ] Se dibuja manualmente pixel por pixel"
  - "[x] Se crea mediante reglas y algoritmos que generan variaciones"
  - "[ ] Solo usa colores primarios"
  - "[ ] Requiere siempre intervención humana en cada paso"
explanation: "El arte generativo se basa en definir sistemas de reglas que pueden generar múltiples resultados únicos. El artista diseña el proceso, no el resultado final."
```

## Pregunta 2: Números Aleatorios

```eval
id: gen-art-u1-q2
type: mcq
mode: self
points: 1
prompt: "En programación, ¿qué hace la función random()?"
options:
  - "[ ] Genera siempre el mismo número"
  - "[ ] Solo funciona con enteros"
  - "[x] Genera un número pseudo-aleatorio diferente en cada llamada"
  - "[ ] Requiere una semilla obligatoriamente"
explanation: "random() genera números pseudo-aleatorios. Cada vez que la llamas obtienes un valor diferente, pero estos números son determinísticos si estableces una semilla (seed) específica."
```

## Pregunta 3: Semilla (Seed)

```eval
id: gen-art-u1-q3
type: mcq
mode: self
points: 1
prompt: "¿Para qué sirve establecer una semilla (seed) en randomSeed()?"
options:
  - "[ ] Para hacer que random() deje de funcionar"
  - "[x] Para generar la misma secuencia de números aleatorios cada vez"
  - "[ ] Para aumentar la velocidad del programa"
  - "[ ] Para cambiar los colores del sketch"
explanation: "Al establecer una semilla fija con randomSeed(), la secuencia de números pseudo-aleatorios se vuelve reproducible. Esto es útil para debuggear o para generar la misma composición múltiples veces."
```

## Pregunta 4: Variación Controlada

```eval
id: gen-art-u1-q4
type: mcq
mode: self
points: 1
prompt: "¿Qué técnica permite tener aleatoriedad pero con límites definidos?"
options:
  - "[ ] Usar solo números primos"
  - "[ ] Evitar usar loops"
  - "[x] Usar random(min, max) para especificar rangos"
  - "[ ] Dibujar solo en blanco y negro"
explanation: "random(min, max) te permite definir el rango de valores posibles, dando control sobre la variación. Por ejemplo, random(100, 200) solo devolverá valores entre 100 y 200."
```

## Reflexión

Ahora que has completado estas preguntas, piensa en:
- ¿Cómo podrías usar aleatoriedad controlada en tu próximo proyecto?
- ¿Qué diferencia hay entre azar "puro" y azar "con intención"?
- ¿En qué situaciones preferirías usar una semilla fija vs. aleatoriedad completa?

## Recursos Adicionales

- [Nature of Code - Chapter 0: Randomness](https://natureofcode.com/random/)
- [P5.js Reference: random()](https://p5js.org/reference/#/p5/random)
- [Generative Design Book](http://www.generative-gestaltung.de/)

---

**Siguiente**: [Ejercicio Práctico](./04-ejercicio-practico.md)
