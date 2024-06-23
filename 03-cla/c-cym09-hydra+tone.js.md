---
type: class
tags: cym, música visual, armonía expandida,class
unit: 0
num:  9
year: 2023
---


<!-- slide bg="#010100"--> 
![[untref-logo-w.svg|100]]
CYM24

# hydra + tone.js

<iframe height="600" width="800" src="https://hydra.ojack.xyz/?sketch_id=r0XuPfXjThcTefyX" allow="fullscreen" allowfullscreen="" style="height:100%;width:100%; aspect-ratio: 16 / 9; "></iframe>


### Tone.Part
```js
const synth = new Tone.Synth().toDestination();

// use an array of objects as long as the object has a "time" attribute

const part = new Tone.Part(((time, value) => {

// the value is an object which contains both the note and the velocity

synth.triggerAttackRelease(value.note, "8n", time, value.velocity);

}), [{ time: 0, note: "C3", velocity: 0.9 },

{ time: "0:2", note: "C4", velocity: 0.5 }

]).start(0);

Tone.Transport.start();
```