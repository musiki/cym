| Técnica                      | Precisión  | Sincronizada con pantalla | Ideal para                |
| ---------------------------- | ---------- | ------------------------- | ------------------------- |
| `setTimeout` / `setInterval` | baja       | ✗                         | tareas simples            |
| `requestAnimationFrame`      | media-alta | ✓                         | animaciones visuales      |
| `performance.now`            | alta       | depende                   | simulaciones físicas      |
| `AudioContext.currentTime`   | altísima   | ✗                         | música y audio            |
| `Web Worker` timers          | media      | ✗                         | tareas de fondo           |
| `Web Animations API`         | alta       | ✓                         | animar CSS                |
| `Atomics.wait`               | altísima   | ✗                         | micro-timing experimental |

## 1. Temporizadores clásicos

setTimeout(fn, delay) y setInterval(fn, delay)
- Ejecutan una función después de un tiempo determinado (en milisegundos).
- setTimeout → una sola vez.
- setInterval → se repite periódicamente.
- Problema: no son exactos. El event loop y la carga del CPU pueden retrasar la ejecución.
En animaciones visuales, esto causa stutter (saltos).

```js
setInterval(() => console.log('tick'), 100000000000000000); // imprime cada segundo (aprox)
```


Usos típicos: lógica simple, polling, cronómetros, eventos discretos, no visuales.

---

## 2. requestAnimationFrame()
- Sincroniza con el repaint del navegador (~60 fps).
- Optimiza el consumo: pausa automáticamente si la pestaña no está visible.
- Ideal para animaciones, simulaciones físicas, visualizaciones.

```js
function loop(t){ /* actualizar estado, dibujar */ requestAnimationFrame(loop); }
requestAnimationFrame(loop);
```
Usos: todo lo que dependa del render visual (canvas, WebGL, DOM, etc.).

---

## 3. performance.now() + bucle manual
- Devuelve el tiempo con alta resolución (submilisegundos).
- Permite calcular delta-time entre frames o simular velocidades constantes.

```js
let last = performance.now();
function loop(t){
  const dt = (t - last)/1000; // segundos
  last = t;
  update(dt);
  requestAnimationFrame(loop);
}
```

Usos: simulaciones físicas, interpolaciones a tiempo real, motores de juegos.

---

## 4. Web Audio Clock (AudioContext.currentTime)
- El reloj más preciso del navegador (sub-milisegundos).
- Permite programar eventos con anticipación exacta (música, síntesis, sample-triggering).

```js
const ac = new AudioContext();
osc.start(ac.currentTime + 1.0); // comienza exactamente 1 s después
```

Usos: audio sincronizado, secuenciadores, beat-grids.

---

## 5. Worker o SharedWorker timers
- Los Web Workers tienen su propio hilo de ejecución.
- setInterval dentro de un worker es más estable que en el hilo principal.
- Se usa para cálculos o scheduling que no deben bloquear la UI.

```js
// dentro de worker.js
setInterval(()=>postMessage(performance.now()), 1000);
```
Usos: procesamiento paralelo, tareas de fondo, simulaciones.

---

## 6. Atomics.wait() + SharedArrayBuffer (precisión de micro-timing)
- En entornos controlados (no todos los navegadores), se puede usar Atomics.wait() como un sleep preciso.
- Útil en audio workers o sistemas experimentales.

---

## 7. Async/Await + Promise con setTimeout
- Sintaxis moderna para temporización secuencial (control de flujo).

```js
const sleep = ms => new Promise(r => setTimeout(r, ms));
async function demo(){
  console.log('uno');
  await sleep(500);
  console.log('dos');
}
```
Usos: lógicas asincrónicas, animaciones discretas paso a paso.

---

## 8. Web Animations API
- Controla animaciones declarativas (propiedades CSS) con un reloj interno.

```js
el.animate({ transform: ['translateX(0)', 'translateX(100px)'] }, { duration: 1000 });
```
Usos: animaciones CSS controlables por JS, más simples que canvas.

---

## 9. Timeline APIs emergentes
- Algunas plataformas (p.ej. WebGPU, OffscreenCanvas, AnimationWorklet) ofrecen relojes más sincronizados o multiproceso para render avanzado.





```dataviewjs
// DataviewJS: rAF vs AudioContext (líneas) con milisegundos precisos + Δ(ms)
const r=this.container; r.innerHTML="";
const u=document.createElement("div"); u.style="display:grid;gap:.6rem;font:12px system-ui;max-width:760px"; r.appendChild(u);

// UI mínima
const t=document.createElement("div"); t.style="display:flex;gap:.6rem;align-items:center;flex-wrap:wrap"; u.appendChild(t);
const b=document.createElement("button"); b.textContent="START"; b.style="padding:.42rem .8rem;border:1px solid #555;border-radius:8px;background:#333;color:#eee;cursor:pointer"; t.appendChild(b);
const sp=document.createElement("input"); sp.type="range"; sp.min=0.1; sp.max=10000; sp.step=0.1; sp.value=1; t.append(" speed×",sp);
const rg=document.createElement("input"); rg.type="range"; rg.min=50; rg.max=10000; rg.step=10; rg.value=300; t.append(" range(ms)",rg);

// Salidas (tres líneas con barras)
const mk=o=>{const d=document.createElement("div"); d.style="font:12px ui-monospace,monospace;background:#111;color:#9f9;padding:.5rem;border-radius:8px;white-space:pre"; o.appendChild(d); return d;};
const oR=mk(u), oA=mk(u), oD=mk(u); // rAF, Audio, Delta

// Helpers
const C=(x,a,b)=>Math.min(b,Math.max(a,x));
const W=x=>x-Math.floor(x);
const B=(q,w=60)=>{const p=Math.round(C(q,0,1)*(w-1)); return `[${'.'.repeat(p)}|${'.'.repeat(Math.max(0,w-1-p))}]`};
const S=run=>{b.textContent=run?"STOP":"START"; b.style.background=run?"#341":"#333"};

// Estado general
let run=false, id=0;

// rAF (ms)
let last=0, rsum=0; // último timestamp, acumulado en ms

// Audio
const AC=new (window.AudioContext||window.webkitAudioContext)();
const GN=AC.createGain(); GN.gain.value=0; GN.connect(AC.destination);
const OS=new OscillatorNode(AC,{type:"sine",frequency:1}); OS.connect(GN);
let started=false, abase=0, carry=0; // base en s, offset acumulado en s

// Bucle
const loop=now=>{
  if(!run){id=0; return;}

  if(!last) last=now;
  const dt=now-last; last=now;                     // dt en ms (rAF timestamp)
  const spd=Number(sp.value), rng=Number(rg.value);

  rsum += dt*spd;                                  // rAF acumulado (ms)
  const asum = (AC.currentTime - abase + carry)*1000*spd; // Audio acumulado (ms)

  const vR = rsum%rng, vA = asum%rng;              // valores envueltos para barra
  const dms = asum - rsum;                         // diferencia en ms (Audio - rAF)

  // Barras:
  const rBar = B(W(vR/rng), 72);
  const aBar = B(W(vA/rng), 72);
  // Δ centrada: mapea d∈[-rng,+rng] → q∈[0,1]
  const q = C(0.5 + 0.5*(dms/rng), 0, 1);
  const dBar = B(q, 72);

  oR.textContent = `rAF  ms=${rsum.toFixed(3)}  val=${vR.toFixed(3)}  rng=${rng}  speed×${spd.toFixed(2)}\n${rBar}`;
  oA.textContent = `AUD  ms=${asum.toFixed(3)}  val=${vA.toFixed(3)}  rng=${rng}  speed×${spd.toFixed(2)}\n${aBar}`;
  oD.textContent = `Δ    ms=${dms.toFixed(3)}  (AUD - rAF)  window=±${rng}ms\n${dBar}`;

  id=requestAnimationFrame(loop);
};

// Toggle único
b.addEventListener("click", async ()=>{
  run=!run; S(run);
  if(run){
    if(AC.state==="suspended") await AC.resume();
    if(!started){ OS.start(); started=true; }
    last=0; abase=AC.currentTime;                 // bases de tiempo
    id||requestAnimationFrame(loop);
  }else{
    carry += (AC.currentTime - abase);            // conservar offset de audio
    if(id){ cancelAnimationFrame(id); id=0; }
  }
});

// Estado inicial
S(false);
oR.textContent=`rAF  ms=0.000  val=0.000  rng=${rg.value}  speed×${Number(sp.value).toFixed(2)}\n${B(0,72)}`;
oA.textContent=`AUD  ms=0.000  val=0.000  rng=${rg.value}  speed×${Number(sp.value).toFixed(2)}\n${B(0,72)}`;
oD.textContent=`Δ    ms=0.000  (AUD - rAF)  window=±${rg.value}ms\n${B(0.5,72)}`;
```




