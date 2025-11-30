---
type: obra
img: https://i.imgur.com/oBUjFDy.png
year: 1973
tags:
  - instalación
person: "[[David Tudor]]"
premiereDate:
premierePlace:
url:
connect:
---

1.Rainforest IV es una instalación sonora colectiva en la que objetos resonantes cotidianos (metales, tubos, muelles, cubos, etc.) actúan como resonadores-acústicos y altavoces mediante excitadores/transductores.
2. Cada objeto transforma señales eléctricas en vibración mecánica, creando un ecosistema acústico realimentado, descentralizado y emergente.





 Modelización MOAIE

La estructura básica de cada objeto resonante se puede representar como:

$$
\agn_{\text{señal eléctrica}} \rightarrow \obj_{\text{objeto cotidiano}}  \leftrightarrow_{\text{transductor}} \rightarrow \mat_{\text{metal, madera, plástico}} \rightarrow \ent{\text{espacio compartido}}
$$

Donde:
	•	$\agn$ = señal eléctrica individual por performer (a veces con modulación en vivo)
	•	$\obj$ = objeto físico resonante (ej: tambor de lavarropas)
	•	$\int$ = acoplamiento vibracional mediante excitador piezoeléctrico
	•	$\mat$ = material del objeto (define el espectro resonante)
	•	$\ent{}$ = entorno común → sumatoria acústica de todos los objetos + espacio

---

## Sistema total de la instalación

Como el sistema es colectivo y de múltiples nodos interconectados, modelamos la instalación como un grafo vibracional distribuido:

$$
\sum_{i=1}^{N} \left( \agn_i \rightarrow \obj_i \leftrightarrow_i \mat_i \right) \rightarrow \ent{\sum \text{(acústico)}}
$$

---

 ## Realimentación abierta

En muchos casos, los micrófonos y parlantes están dispuestos de manera tal que crean feedback acústico y eléctrico, por lo que se incluye:

$$
\agn_i(t) = f\left( s_{\text{mic}_j}(t - \tau) \right)
$$

donde:
	•	$s_{\text{mic}_j}(t)$ es el sonido captado por un micrófono ubicado en el entorno
	•	$\tau$ = delay acústico / eléctrico
	•	$f$ = función de transformación (filtros, compresores, distorsión, etc.)

⸻

## Fórmula completa

Sistema total de Rainforest IV en versión simbólica y funcional:

$$
\boxed{
\sum_{i=1}^{N}
\left[
\agn_i(t) = f\left( s_{\text{mic}_j}(t - \tau) \right)
\rightarrow
\obj_i  \leftrightarrow_i  \mat_i
\right]
\rightarrow
\ent{\sum \text{resonancias emergentes}}
}
$$
