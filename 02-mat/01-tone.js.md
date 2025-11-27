person: Yotam
year: 2012
tag: #webaudio
---


# intro

```js
//create a synth and connect it to the master output (your speakers)
var synth = new Tone.Synth().toMaster()

//play a middle 'C' for the duration of an 8th note
synth.triggerAttackRelease('C4', '8n')

```

# botones

https://codepen.io/LucianoAzzigotti/pen/qBoQGbJ


# fuentes sonoras

Son audionodos que producen sonidos. Son basicamente de cuatro tipos:

- osciladores 
	- sawtooth
	- square
	- pwm
	- pulse
	- sine
	- triangle
	- fm
	- am
	- fat
- noise
	- white
	- pink
	- brown
- player
- UserMedia


# efectos 

los efectos modifican la señal de entrada y se conectan en serio o en paralelo de igual modo que los pedales de guitarra.

para agregar un efecto a tu cadena de audio debes conectar el efecto entre la fuente y el Destination. 

# tiempo
https://github.com/Tonejs/Tone.js/wiki/Time