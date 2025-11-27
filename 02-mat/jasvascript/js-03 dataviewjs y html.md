
# que es dataviewjs

En Obsidian, un bloque dataviewjs permite ejecutar código JavaScript directamente dentro de una nota. A diferencia de un archivo HTML normal, el bloque no crea una página nueva sino que se inyecta dentro del [[DOM]] de la nota en curso. Eso explica la diferencia clave: no tenés document.body como raíz propia, sino un this.container donde se montan tus elementos.


```js
```dataviewjs
const root = this.container;
const p = document.createElement("pre");
p.textContent = "DataviewJS OK";
root.appendChild(p);
.```
```



```dataviewjs
const root = this.container;
const p = document.createElement("pre");
p.textContent = "DataviewJS OK";
root.appendChild(p);
```




##  ejemplo línea por línea:

`const root = this.container;`

- this.container es el nodo raíz que DataviewJS asigna al bloque actual dentro de la nota. En vez de escribir en toda la página, solo tenés permiso para modificar este “contenedor local”.
- Guardamos esa referencia en la constante root para usarla luego.

const p = document.createElement("pre");

- Creamos un elemento HTML `<pre>` (texto preformateado).
- En un archivo HTML usarías igual document.createElement, pero ahí se referiría al documento completo. Acá sigue siendo el mismo API DOM, solo que lo vamos a insertar dentro del container.

p.textContent = "DataviewJS OK";

- Asignamos el texto que mostrará el elemento `<pre>`.
- textContent asegura que se muestre como texto plano (no interpreta HTML).

root.appendChild(p);

- Finalmente, insertamos el `<pre>` dentro del contenedor del bloque dataviewjs.
- En HTML común, lo harías con document.body.appendChild(p) o el contenedor que quieras. En DataviewJS siempre conviene usar this.container para no contaminar otras partes de la nota.


## Diferencia con HTML

html
	header
		style
		script (javascript)
	body

	
```html
<!DOCTYPE html>
<html lang="es">
<head><meta charset="utf-8"><title>Mini ejemplo</title></head>
<body>
  <div id="app"></div>
  <script>
    // 1) raíz (antes: this.container)
    const root = document.getElementById("app"); // o document.body

    // 2) crear elemento
    const p = document.createElement("pre");

    // 3) contenido de texto
    p.textContent = "DataviewJS OK";

    // 4) montar en el DOM
    root.appendChild(p);
  </script>
</body>
</html>
```



- En HTML 1-page: todo el documento es tuyo; podés usar` <html>`, `<head>`, `<body>`, y manipular document.body.
- En DataviewJS: no definís `<html>` ni `<body>`. El plugin ya te da un entorno y un container aislado. Solo podés renderizar dentro de ese bloque.
- El código JS es casi el mismo, pero el “scope visual” cambia: en la web manejás toda la ventana; en DataviewJS, solo la cajita del bloque donde pegaste tu script.


## hola mundo de webaudioAPI y dataviewjs

```dataviewjs
// HELLO WORLD – animación en canvas dentro de dataviewjs

const container = this.container;
container.innerHTML = `
<canvas id="helloCanvas" width="600"height="200" style="border:0px solid #ccc;"></canvas>
`;

const canvas = container.querySelector("#helloCanvas");
const ctx = canvas.getContext("2d");

let angle = 0;
function draw() {
    ctx.clearRect(0,0,canvas.width,canvas.height);

    // fondo
    ctx.fillStyle = "transparent";
    ctx.fillRect(0,0,canvas.width,canvas.height);

    // círculo girando
    const x = 100 + 60 * Math.cos(angle);
    const y = 100 + 60 * Math.sin(angle);

    ctx.beginPath();
    ctx.arc(x,y,20,0,Math.PI*2);
    ctx.fillStyle = "magenta";
    ctx.fill();

    angle += 0.05;
    requestAnimationFrame(draw);
}

draw();
```

- Usa this.container como raíz (DataviewJS).
- Cada click alterna entre crear y destruir el grafo de audio.
- `ctx.close()` asegura que el destino se libere, así no queda colgado el AudioContext.


```dataviewjs
// raíz donde se monta todo
const r=this.container;
// botón único
const b=document.createElement("button");b.textContent="Play";r.appendChild(b);

// estado audio
let ctx=null,osc=null,g=null,play=false;

// acción del botón
b.onclick=()=>{ 
  if(!play){ 
    // crear contexto y nodos
    ctx=new (AudioContext||webkitAudioContext)();
    osc=ctx.createOscillator(); g=ctx.createGain();
    osc.type="sine"; osc.frequency.value=220; g.gain.value=0.2;
    osc.connect(g).connect(ctx.destination); osc.start();
    play=true; b.textContent="Stop"; 
  }else{ 
    // apagar y limpiar
    try{osc.stop();osc.disconnect();g.disconnect();ctx.close();}catch(e){}
    osc=g=ctx=null; play=false; b.textContent="Play"; 
  }
};
```

```dataviewjs
// WebAudio API Hello World — un botón y una sinusoide

const el = this.container;
el.innerHTML = `
  <div style="font-family:system-ui,Segoe UI,Roboto,Helvetica,Arial,sans-serif;display:flex;align-items:center;gap:10px">
    <button id="toneBtn" style="padding:6px 10px;border:1px solid #ccc;border-radius:8px;background:#f7f7f7;cursor:pointer">Play</button>
    <span id="status" style="color:#666">sine 440 Hz</span>
  </div>
`;

let actx = null;
let osc = null;
let gain = null;
let playing = false;

async function startTone() {
  if (!actx) {
    actx = new (window.AudioContext || window.webkitAudioContext)();
  }
  if (actx.state === "suspended") {
    await actx.resume();
  }
  gain = actx.createGain();
  gain.gain.value = 0.1; // volumen bajo
  gain.connect(actx.destination);

  osc = actx.createOscillator();
  osc.type = "sine";
  osc.frequency.value = 440; // A4
  osc.connect(gain);
  osc.start();

  playing = true;
  uiUpdate();
}

function stopTone() {
  if (osc) {
    try { osc.stop(); } catch(e) {}
    osc.disconnect();
    osc = null;
  }
  if (gain) {
    gain.disconnect();
    gain = null;
  }
  playing = false;
  uiUpdate();
}

function uiUpdate() {
  el.querySelector("#toneBtn").textContent = playing ? "Stop" : "Play";
  el.querySelector("#status").textContent = playing ? "reproduciendo 440 Hz" : "sine 440 Hz";
}

el.querySelector("#toneBtn").onclick = async () => {
  if (!playing) await startTone();
  else stopTone();
};

uiUpdate();
```


### glissando

```dataviewjs
// WebAudio + Visual glissando — punto moviéndose en XY (tipo mini osciloscopio)

const el = this.container;
el.innerHTML = `
  <div style="font-family:system-ui,Segoe UI,Roboto,Helvetica,Arial,sans-serif;max-width:560px">
    <div style="display:flex;align-items:center;gap:10px;margin-bottom:8px;">
      <button id="btn" style="padding:6px 10px;border:1px solid #ccc;border-radius:8px;background:#f7f7f7;cursor:pointer">Play</button>
      <span id="status" style="color:#666">glissando 220 → 880 Hz</span>
    </div>
    <canvas id="cv" width="400" height="300" style="width:100%;background:#0b0b0b;border:1px solid #222;border-radius:8px"></canvas>
  </div>
`;

const cv = el.querySelector("#cv");
const ctx = cv.getContext("2d", { willReadFrequently:true });

let actx=null, osc=null, gain=null, playing=false;
let t0=0, dur=3.0; // segundos del glissando
let rafId=null;

function drawFrame(){
  const now = (actx ? actx.currentTime : 0);
  const t = Math.min(1, (now - t0) / dur);
  // mapea t a frecuencia y a posición visual
  const f = 220 + t * (880-220);      // 220→880 Hz (lineal)
  const x = 20 + t * (cv.width-40);   // movimiento horizontal
  const phase = now*2*Math.PI*f*0.002; // factor lento para Y
  const y = cv.height*0.5 + Math.sin(phase)* (cv.height*0.35);

  // fondo
  ctx.fillStyle = "#0b0b0b";
  ctx.fillRect(0,0,cv.width,cv.height);

  // ejes
  ctx.strokeStyle = "#222";
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(20, cv.height*0.5);
  ctx.lineTo(cv.width-20, cv.height*0.5);
  ctx.moveTo(20, 20);
  ctx.lineTo(20, cv.height-20);
  ctx.stroke();

  // punto
  ctx.fillStyle = "#41a5ff";
  ctx.beginPath();
  ctx.arc(x, y, 6, 0, Math.PI*2);
  ctx.fill();

  // etiqueta frecuencia
  ctx.fillStyle = "#8aa1b1";
  ctx.font = "12px system-ui, sans-serif";
  ctx.fillText(f.toFixed(1)+" Hz", x+10, y-10);

  if (playing) rafId = requestAnimationFrame(drawFrame);
}

async function start(){
  if (!actx) actx = new (window.AudioContext||window.webkitAudioContext)();
  if (actx.state === "suspended") await actx.resume();

  gain = actx.createGain();
  gain.gain.value = 0.12;
  gain.connect(actx.destination);

  osc = actx.createOscillator();
  osc.type = "sine";
  osc.connect(gain);

  // planifica glissando lineal en 3s
  const tStart = actx.currentTime + 0.02;
  t0 = tStart;
  osc.frequency.setValueAtTime(220, tStart);
  osc.frequency.linearRampToValueAtTime(880, tStart + dur);

  osc.start(tStart);
  osc.stop(tStart + dur);

  playing = true;
  el.querySelector("#btn").textContent = "Stop";
  el.querySelector("#status").textContent = "reproduciendo…";
  drawFrame();

  // parar y limpiar al final
  setTimeout(() => { stop(true); }, (dur+0.1)*1000);
}

function stop(silent=false){
  if (rafId) { cancelAnimationFrame(rafId); rafId=null; }
  if (osc){ try{osc.stop();}catch(e){} osc.disconnect(); osc=null; }
  if (gain){ gain.disconnect(); gain=null; }
  playing = false;
  if (!silent){
    el.querySelector("#btn").textContent = "Play";
    el.querySelector("#status").textContent = "glissando 220 → 880 Hz";
  }
  // limpiar canvas
  ctx.fillStyle = "#0b0b0b"; ctx.fillRect(0,0,cv.width,cv.height);
}

el.querySelector("#btn").onclick = async ()=>{
  if (!playing) await start(); else stop();
};
```

## hola fm 

- FM en tiempo real asegurada usando setTargetAtTime sobre carrier.frequency, mod.frequency y mg.gain.
- El segundo slider controla la frecuencia de la modulante y, para que se oiga bien sin un tercer control, también ajusta la profundidad de modulación (`mg.gain ≈ 0.6*mod`).
- La línea de estado aparece en gris e inline: carrier: … Hz | mod: … Hz.
- ` stop()` destruye todo: `stop()`, `disconnect()` y `ctx.close()` para que no quede colgado el *destination*.
- como usamos [[try]] y las [[arrow functions ⇒]]

```dataviewjs
// raíz + helpers UI
const r=this.container,m=(t,p={})=>Object.assign(document.createElement(t),p);
const btn=m("button",{textContent:"Play"}),lc=m("label",{textContent:" Carrier "}),ic=m("input"),lm=m("label",{textContent:" Mod "}),im=m("input"),sel=m("select"),st=m("span");st.style.color="#888";
ic.type="range";ic.min="50";ic.max="1000";ic.step="1";ic.value="220";
im.type="range";im.min="0";im.max="1000";im.step="1";im.value="100";
["sine","square","triangle","sawtooth"].forEach(w=>{const o=m("option");o.text=o.value=w;sel.appendChild(o);});
[btn,lc,ic,lm,im,sel,st].forEach(e=>r.appendChild(e));

// estado audio
let ctx=null,car=null,mod=null,mg=null,on=false;
const updHUD=()=>st.textContent=`  carrier: ${(+ic.value).toFixed(0)} Hz | mod: ${(+im.value).toFixed(0)} Hz`;

// arrancar/parar con limpieza total
const start=()=>{
  ctx=new (AudioContext||webkitAudioContext)();
  car=ctx.createOscillator(); mod=ctx.createOscillator(); mg=ctx.createGain();
  car.type=sel.value; car.frequency.setValueAtTime(+ic.value,ctx.currentTime);
  mod.frequency.setValueAtTime(+im.value,ctx.currentTime);
  mg.gain.setValueAtTime(Math.max(0,+im.value*0.6),ctx.currentTime); // profundidad ≈ 0.6*mod (audible)
  mod.connect(mg).connect(car.frequency); car.connect(ctx.destination);
  car.start(); mod.start(); on=true; btn.textContent="Stop"; updHUD();
};
const stop=()=>{
  try{car.stop();mod.stop();}catch(e){}
  try{car.disconnect();mod.disconnect();mg.disconnect();}catch(e){}
  try{ctx.close();}catch(e){}
  ctx=car=mod=mg=null; on=false; btn.textContent="Play"; updHUD();
};

// eventos (realtime)
btn.onclick=()=>on?stop():start();
ic.oninput =()=>{ if(car&&ctx){ car.frequency.setTargetAtTime(+ic.value,ctx.currentTime,0.015); } updHUD(); };
im.oninput =()=>{ if(mod&&mg&&ctx){ const f=+im.value; mod.frequency.setTargetAtTime(f,ctx.currentTime,0.015); mg.gain.setTargetAtTime(Math.max(0,f*0.6),ctx.currentTime,0.015);} updHUD(); };
sel.onchange=()=>{ if(car) car.type=sel.value; };
updHUD();
```




## hola threejs

```dataviewjs
try{
  const r=this.container;                                        // raíz del bloque
  const load=s=>new Promise((ok,ko)=>{                           // carga script una sola vez
    if([...document.scripts].some(x=>x.src.includes(s)))return ok();
    const t=document.createElement('script');t.src=s;t.onload=ok;t.onerror=ko;document.head.appendChild(t);
  });
  if(!window.THREE) await load('https://unpkg.com/three@0.149.0/build/three.min.js'); // three r149 no-module

  const W=r.clientWidth||600,H=320;                              // tamaño canvas
  const ren=new THREE.WebGLRenderer({antialias:true,alpha:true});ren.setSize(W,H);r.appendChild(ren.domElement); // renderer+canvas
  const scn=new THREE.Scene();                                   // escena
  const cam=new THREE.PerspectiveCamera(60,W/H,.1,100);cam.position.set(3,2,4); // cámara
  scn.add(new THREE.AmbientLight(0xffffff,.6));const dl=new THREE.DirectionalLight(0xffffff,.8);dl.position.set(3,5,2);scn.add(dl); // luces
  const mesh=new THREE.Mesh(new THREE.BoxGeometry(1,1,1),new THREE.MeshStandardMaterial({roughness:.4,metalness:.1}));scn.add(mesh); // cubo
  scn.add(new THREE.AxesHelper(1.5));                             // ejes

  // Orbit minimal: arrastra para orbitar, rueda para zoom
  class Orbit{
    constructor(c,d){ this.c=c; this.d=d; this.t=new THREE.Vector3();          // target (0,0,0)
      this.s=new THREE.Spherical().setFromVector3(c.position.clone());         // (radius,phi,theta) desde la pos de cámara
      this.min=.01; this.max=Math.PI-.01; this.rmin=1; this.rmax=50;           // límites
      this.rot=.008; this.zoom=1.1; this.drag=false; this.p={x:0,y:0};         // sensibilidad+estado
      d.addEventListener('pointerdown',e=>{this.drag=true;this.p.x=e.clientX;this.p.y=e.clientY;});
      d.addEventListener('pointerup',()=>this.drag=false);
      d.addEventListener('pointermove',e=>{ if(!this.drag)return;              // rotación
        const dx=e.clientX-this.p.x,dy=e.clientY-this.p.y; this.p.x=e.clientX; this.p.y=e.clientY;
        this.s.theta-=dx*this.rot; this.s.phi=Math.min(this.max,Math.max(this.min,this.s.phi-dy*this.rot)); this.upd();
      });
      d.addEventListener('wheel',e=>{ e.preventDefault();                      // zoom
        this.s.radius=e.deltaY>0?Math.min(this.rmax,this.s.radius*this.zoom):Math.max(this.rmin,this.s.radius/this.zoom); this.upd();
      },{passive:false});
      this.upd();
    }
    upd(){ this.c.position.setFromSpherical(this.s).add(this.t); this.c.lookAt(this.t); } // aplica esféricas→posición
  }
  const orb=new Orbit(cam,ren.domElement);                       // activa orbit

  (function loop(){ requestAnimationFrame(loop);                 // render loop
    mesh.rotation.y+=.01; mesh.rotation.x+=.006;                 // animación simple
    ren.render(scn,cam);
  })();

  window.addEventListener('resize',()=>{                         // responsivo básico (altura fija)
    const w=r.clientWidth||W,h=H; ren.setSize(w,h); cam.aspect=w/h; cam.updateProjectionMatrix();
  });
}catch(e){ const pre=document.createElement('pre'); pre.textContent='ERROR:\n'+(e&&e.stack||e); this.container.appendChild(pre); }
```



## hola mundo completo en dataviewjs

```dataviewjs
try {
  // =========================
  // Raíz y estilos
  // =========================
  const rootId = "cym-hello-web-root";
  let root = this.container.querySelector("#" + rootId);
  if (root) root.remove();
  root = this.container.createEl("div", {attr:{id:rootId}, cls:"cym-root"});
  const style = document.createElement("style");
  style.textContent = `
    .cym-root{position:relative;border:1px solid #ccc;padding:12px;border-radius:8px}
    .cym-ui{display:grid;grid-template-columns:repeat(4,minmax(160px,1fr));gap:12px;align-items:center;margin-bottom:12px}
    .cym-ui>div{display:flex;gap:8px;align-items:center}
    .cym-canvas-wrap{position:relative;width:100%;height:420px;background:transparent}
    .cym-hud{position:absolute;left:8px;top:8px;padding:8px 10px;background:rgba(0,0,0,.35);color:#fff;font:12px/1.2 system-ui,sans-serif;border-radius:6px;pointer-events:none;white-space:pre;min-width:220px}
    .cym-btn{padding:6px 10px;border:1px solid #aaa;border-radius:6px;background:#eee;cursor:pointer}
    .cym-btn:active{transform:translateY(1px)}
    .cym-number{width:110px}.cym-input{width:160px}
    canvas{outline:none}
  `;
  root.appendChild(style);

  // =========================
  // Carga Three.js (r149 no-module)
  // =========================
  function loadScriptOnce(src){return new Promise((res,rej)=>{if([...document.scripts].some(s=>s.src.includes(src)))return res();const s=document.createElement("script");s.src=src;s.onload=()=>res();s.onerror=e=>rej(e);document.head.appendChild(s);});}
  async function ensureThree(){
    if(!window.THREE){await loadScriptOnce("https://unpkg.com/three@0.149.0/build/three.min.js");}
  }

  // =========================
  // UI
  // =========================
  const ui = document.createElement("div"); ui.className="cym-ui"; root.appendChild(ui);
  const make = (html)=>{const d=document.createElement("div");d.innerHTML=html.trim();return d.firstElementChild;}

  const sliderWrap = document.createElement("div");
  const sliderLbl = make("<label>Velocidad</label>");
  const slider = make('<input type="range" min="0.1" max="5" step="0.1" value="1.2">');
  sliderWrap.append(sliderLbl, slider); ui.appendChild(sliderWrap);

  const clickWrap = document.createElement("div");
  const clickBtn = make('<button class="cym-btn">Botón</button>');
  clickWrap.append(document.createTextNode("Acción"), clickBtn); ui.appendChild(clickWrap);
  const clickState = {count:0}; clickBtn.addEventListener("click", ()=>{clickState.count++; updateHUD();});

  const textWrap = document.createElement("div");
  const textLbl = make("<label>Texto</label>");
  const textInput = make('<input class="cym-input" type="text" placeholder="Escribe...">');
  textInput.value = "Ciencia y Música";
  textInput.addEventListener("input", updateHUD);
  textWrap.append(textLbl, textInput); ui.appendChild(textWrap);

  const numWrap = document.createElement("div");
  const numLbl = make("<label>Número</label>");
  const numInput = make('<input class="cym-number" type="number" step="1" value="3">');
  numInput.addEventListener("input", updateHUD);
  numWrap.append(numLbl, numInput); ui.appendChild(numWrap);

  const audioWrap = document.createElement("div");
  const audioBtn = make('<button class="cym-btn">Play Sine</button>');
  audioWrap.append(document.createTextNode("Audio"), audioBtn); ui.appendChild(audioWrap);

  const canvasWrap = document.createElement("div"); canvasWrap.className="cym-canvas-wrap"; root.appendChild(canvasWrap);
  const hud = document.createElement("div"); hud.className="cym-hud"; hud.textContent="HUD"; canvasWrap.appendChild(hud);

  // =========================
  // WebAudio
  // =========================
  let audioCtx=null, osc=null, gain=null, isPlaying=false;
  function startTone(){
    if(!audioCtx) audioCtx = new (window.AudioContext||window.webkitAudioContext)();
    osc = audioCtx.createOscillator(); gain = audioCtx.createGain();
    const baseHz = 110 * Math.max(1, Number(numInput.value||1));
    osc.frequency.value = baseHz; gain.gain.value = 0.15;
    osc.connect(gain).connect(audioCtx.destination); osc.start();
    isPlaying=true; audioBtn.textContent="Stop Sine";
  }
  function stopTone(){
    try{if(osc){osc.stop();osc.disconnect();}}catch(e){}
    try{if(gain){gain.disconnect();}}catch(e){}
    osc=null; gain=null; isPlaying=false; audioBtn.textContent="Play Sine";
  }
  audioBtn.addEventListener("click", ()=>{isPlaying?stopTone():startTone();});

  // =========================
  // Custom Orbit (desde cero)
  // - Drag izquierdo: orbitar
  // - Wheel: zoom (cambia radio)
  // =========================
  class SimpleOrbit {
    constructor(camera, dom, target=new THREE.Vector3(0,0,0)){
      this.camera = camera; this.dom = dom; this.target = target.clone();
      // Init a partir de la posición de la cámara
      const rel = new THREE.Vector3().subVectors(camera.position, this.target);
      this.sph = new THREE.Spherical().setFromVector3(rel); // {radius, phi, theta}
      // Límites suaves
      this.minPhi = 0.01; this.maxPhi = Math.PI - 0.01;
      this.minR = 1.2; this.maxR = 50;
      // Estado de interacción
      this.dragging = false; this.last = {x:0,y:0};
      // Sensibilidades
      this.rotSpeed = 0.008;
      this.zoomSpeed = 1.1; // factor por rueda

      // Listeners
      this._onDown = e => { this.dragging = true; this.last.x = e.clientX; this.last.y = e.clientY; this.dom.setPointerCapture?.(e.pointerId||0); };
      this._onMove = e => {
        if(!this.dragging) return;
        const dx = e.clientX - this.last.x;
        const dy = e.clientY - this.last.y;
        this.last.x = e.clientX; this.last.y = e.clientY;
        this.sph.theta -= dx * this.rotSpeed;
        this.sph.phi   -= dy * this.rotSpeed;
        this.sph.phi = Math.max(this.minPhi, Math.min(this.maxPhi, this.sph.phi));
        this.updateCamera();
      };
      this._onUp = e => { this.dragging = false; this.dom.releasePointerCapture?.(e.pointerId||0); };
      this._onWheel = e => {
        e.preventDefault();
        const dir = Math.sign(e.deltaY);
        if (dir > 0) this.sph.radius = Math.min(this.maxR, this.sph.radius * this.zoomSpeed);
        else this.sph.radius = Math.max(this.minR, this.sph.radius / this.zoomSpeed);
        this.updateCamera();
      };

      // Pointer events (compatibles)
      dom.addEventListener("pointerdown", this._onDown);
      dom.addEventListener("pointermove", this._onMove);
      dom.addEventListener("pointerup", this._onUp);
      dom.addEventListener("wheel", this._onWheel, {passive:false});

      this.updateCamera();
    }
    lookAt(target){ this.target.copy(target); this.updateCamera(); }
    updateCamera(){
      const v = new THREE.Vector3().setFromSpherical(this.sph).add(this.target);
      this.camera.position.copy(v);
      this.camera.lookAt(this.target);
    }
    dispose(){
      const d=this.dom;
      d.removeEventListener("pointerdown", this._onDown);
      d.removeEventListener("pointermove", this._onMove);
      d.removeEventListener("pointerup", this._onUp);
      d.removeEventListener("wheel", this._onWheel);
    }
  }

  // =========================
  // Three.js
  // =========================
  let scene,camera,renderer,orbit,sphere,t=0;
  function initThree(){
    const W = canvasWrap.clientWidth, H = canvasWrap.clientHeight;
    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(60, W/H, 0.1, 100);
    camera.position.set(3,2.2,3);

    renderer = new THREE.WebGLRenderer({antialias:true, alpha:true});
    renderer.setSize(W,H); renderer.setPixelRatio(window.devicePixelRatio||1);
    canvasWrap.appendChild(renderer.domElement);

    orbit = new SimpleOrbit(camera, renderer.domElement);

    scene.add(new THREE.AxesHelper(2.0));
    const dl = new THREE.DirectionalLight(0xffffff,1.0); dl.position.set(3,5,2); scene.add(dl);
    scene.add(new THREE.AmbientLight(0xffffff,0.25));

    sphere = new THREE.Mesh(new THREE.SphereGeometry(0.35,32,16), new THREE.MeshStandardMaterial({metalness:0.1,roughness:0.4}));
    sphere.position.set(0,0.35,0); scene.add(sphere);

    window.addEventListener("resize", onResize); onResize(); animate();
  }
  function onResize(){
    const W = canvasWrap.clientWidth, H = canvasWrap.clientHeight;
    camera.aspect=W/H; camera.updateProjectionMatrix(); renderer.setSize(W,H);
  }
  function animate(){
    requestAnimationFrame(animate);
    const v = parseFloat(slider.value); t += 0.01*v;
    sphere.position.x = Math.sin(t*1.3)*0.9;
    sphere.position.y = 0.35 + Math.abs(Math.sin(t*0.9))*0.5;
    sphere.position.z = Math.cos(t*1.1)*0.9;
    sphere.rotation.y += 0.01*v;

    if(isPlaying && osc){
      const baseHz = 110 * Math.max(1, Number(numInput.value||1));
      const mod = 1 + sphere.position.y;
      osc.frequency.setTargetAtTime(baseHz*mod, osc.context.currentTime, 0.02);
    }

    renderer.render(scene,camera);
    updateHUD();
  }
  function updateHUD(){
    const p = sphere ? sphere.position : {x:0,y:0,z:0};
    hud.textContent =
      "Slider (velocidad): " + slider.value + "\n" +
      "Clicks botón: " + clickState.count + "\n" +
      "Texto: " + textInput.value + "\n" +
      "Número: " + numInput.value + "\n" +
      "Esfera xyz: " + p.x.toFixed(3)+", "+p.y.toFixed(3)+", "+p.z.toFixed(3);
  }

  // =========================
  // Boot
  // =========================
  await ensureThree();
  initThree();

} catch(err) {
  const pre = document.createElement("pre");
  pre.style.whiteSpace = "pre-wrap";
  pre.textContent = "ERROR DataviewJS:\n" + (err && err.stack ? err.stack : err);
  this.container.appendChild(pre);
}
```




## hola mundo en html


```html
<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>Ciencia y Música — Hello Web</title>
  <style>
    .cym-root { position: relative; border: 1px solid #ccc; padding: 12px; border-radius: 8px; max-width: 1100px; margin: 24px auto; }
    .cym-ui { display: grid; grid-template-columns: repeat(4, minmax(160px, 1fr)); gap: 12px; align-items: center; margin-bottom: 12px; }
    .cym-ui > div { display: flex; gap: 8px; align-items: center; }
    .cym-canvas-wrap { position: relative; width: 100%; height: 520px; background: transparent; }
    .cym-hud {
      position: absolute; inset: 8px auto auto 8px; padding: 8px 10px;
      background: rgba(0,0,0,0.35); color: #fff; font: 12px/1.2 system-ui, sans-serif; border-radius: 6px;
      pointer-events: none; white-space: pre; min-width: 220px;
    }
    .cym-btn { padding: 6px 10px; border: 1px solid #aaa; border-radius: 6px; background: #eee; cursor: pointer; }
    .cym-btn:active { transform: translateY(1px); }
    .cym-number { width: 110px; }
    .cym-input { width: 160px; }
  </style>
  <!-- Three.js r149 legacy + OrbitControls no-module (global THREE) -->
  <script src="https://unpkg.com/three@0.149.0/build/three.min.js"></script>
  <script src="https://unpkg.com/three@0.149.0/examples/js/controls/OrbitControls.js"></script>
</head>
<body>
  <div class="cym-root" id="cym-hello-web-root">
    <div class="cym-ui">
      <div>
        <label>Velocidad</label>
        <input id="slider" type="range" min="0.1" max="5" step="0.1" value="1.2" />
      </div>
      <div>
        Acción
        <button id="btn" class="cym-btn">Botón</button>
      </div>
      <div>
        <label>Texto</label>
        <input id="text" class="cym-input" type="text" value="Ciencia y Música" placeholder="Escribe..." />
      </div>
      <div>
        <label>Número</label>
        <input id="num" class="cym-number" type="number" step="1" value="3" />
      </div>
      <div>
        Audio
        <button id="audioBtn" class="cym-btn">Play Sine</button>
      </div>
    </div>
    <div class="cym-canvas-wrap" id="canvasWrap">
      <div class="cym-hud" id="hud">HUD</div>
    </div>
  </div>

  <script>
    // ============================================================
    // Ciencia y Música — Hello Web (Standalone)
    // ============================================================

    // -------------------------
    // 1) Referencias DOM
    // -------------------------
    const root = document.getElementById("cym-hello-web-root");
    const slider = document.getElementById("slider");
    const btn = document.getElementById("btn");
    const textInput = document.getElementById("text");
    const numInput = document.getElementById("num");
    const audioBtn = document.getElementById("audioBtn");
    const canvasWrap = document.getElementById("canvasWrap");
    const hud = document.getElementById("hud");

    // -------------------------
    // 2) Estado UI simple
    // -------------------------
    const clickState = { count: 0 };
    btn.addEventListener("click", () => { clickState.count++; updateHUD(); });
    textInput.addEventListener("input", updateHUD);
    numInput.addEventListener("input", updateHUD);

    // -------------------------
    // 3) WebAudio: sine tone
    // -------------------------
    let audioCtx = null, osc = null, gain = null, isPlaying = false;
    function startTone() {
      if (!audioCtx) audioCtx = new (window.AudioContext || window.webkitAudioContext)();
      osc = audioCtx.createOscillator();
      gain = audioCtx.createGain();
      const baseHz = 110 * Math.max(1, Number(numInput.value || 1));
      osc.frequency.value = baseHz;
      gain.gain.value = 0.15;
      osc.connect(gain).connect(audioCtx.destination);
      osc.start();
      isPlaying = true; audioBtn.textContent = "Stop Sine";
    }
    function stopTone() {
      try { if (osc) { osc.stop(); osc.disconnect(); } } catch(e) {}
      try { if (gain) { gain.disconnect(); } } catch(e) {}
      osc = null; gain = null; isPlaying = false; audioBtn.textContent = "Play Sine";
    }
    audioBtn.addEventListener("click", () => { isPlaying ? stopTone() : startTone(); });

    // -------------------------
    // 4) Three.js escena
    // -------------------------
    let scene, camera, renderer, controls, sphere, t = 0;

    function initThree() {
      const W = canvasWrap.clientWidth, H = canvasWrap.clientHeight;

      scene = new THREE.Scene();
      camera = new THREE.PerspectiveCamera(60, W/H, 0.1, 100);
      camera.position.set(3, 2.2, 3);

      renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
      renderer.setSize(W, H);
      renderer.setPixelRatio(window.devicePixelRatio || 1);
      canvasWrap.appendChild(renderer.domElement);

      controls = new THREE.OrbitControls(camera, renderer.domElement);
      controls.enableDamping = true; controls.dampingFactor = 0.08; controls.rotateSpeed = 0.6;

      const axes = new THREE.AxesHelper(2.0); scene.add(axes);
      const light = new THREE.DirectionalLight(0xffffff, 1.0); light.position.set(3, 5, 2); scene.add(light);
      scene.add(new THREE.AmbientLight(0xffffff, 0.25));

      const geo = new THREE.SphereGeometry(0.35, 32, 16);
      const mat = new THREE.MeshStandardMaterial({ metalness: 0.1, roughness: 0.4 });
      sphere = new THREE.Mesh(geo, mat); sphere.position.set(0, 0.35, 0);
      scene.add(sphere);

      window.addEventListener("resize", onResize);
      onResize();
      animate();
    }

    function onResize() {
      const W = canvasWrap.clientWidth, H = canvasWrap.clientHeight;
      camera.aspect = W / H; camera.updateProjectionMatrix();
      renderer.setSize(W, H);
    }

    function animate() {
      requestAnimationFrame(animate);
      const v = parseFloat(slider.value);
      t += 0.01 * v;
      sphere.position.x = Math.sin(t * 1.3) * 0.9;
      sphere.position.y = 0.35 + Math.abs(Math.sin(t * 0.9)) * 0.5;
      sphere.position.z = Math.cos(t * 1.1) * 0.9;
      sphere.rotation.y += 0.01 * v;

      if (isPlaying && osc) {
        const baseHz = 110 * Math.max(1, Number(numInput.value || 1));
        const mod = 1 + sphere.position.y;
        osc.frequency.setTargetAtTime(baseHz * mod, osc.context.currentTime, 0.02);
      }

      controls.update();
      renderer.render(scene, camera);
      updateHUD();
    }

    function updateHUD() {
      const p = sphere ? sphere.position : {x:0,y:0,z:0};
      hud.textContent =
        "Slider (velocidad): " + slider.value + "\n" +
        "Clicks botón: " + clickState.count + "\n" +
        "Texto: " + textInput.value + "\n" +
        "Número: " + numInput.value + "\n" +
        "Esfera xyz: " +
          p.x.toFixed(3) + ", " + p.y.toFixed(3) + ", " + p.z.toFixed(3);
    }

    // -------------------------
    // 5) Inicio
    // -------------------------
    initThree();
  </script>
</body>
</html>
```



## interactuando con el vault de obsidian

```dataviewjs
try{
  // -------- CONFIG --------
  const LABEL_SIZE = 24; // px base para las letras (cambiá acá el tamaño)

  // -------- DATOS --------
  const cur=dv.current().file, base=s=>s.split('/').pop().replace(/\.[^/.]+$/,'');
  const out=(cur.outlinks||[]).map(l=>l.path), inc=(cur.inlinks||[]).map(l=>l.path);
  const uniq=a=>[...new Set(a)], neigh=uniq(out.concat(inc));
  const edges=[...out.map(p=>({a:cur.path,b:p})), ...inc.map(p=>({a:p,b:cur.path}))];

  // -------- THREE --------
  const load=s=>new Promise((ok,ko)=>{if([...document.scripts].some(x=>x.src.includes(s)))return ok();const t=document.createElement('script');t.src=s;t.onload=ok;t.onerror=ko;document.head.appendChild(t);});
  if(!window.THREE) await load('https://unpkg.com/three@0.149.0/build/three.min.js');

  const r=this.container; r.innerHTML="";
  const W=()=>r.clientWidth||640, H=()=>420;
  const ren=new THREE.WebGLRenderer({antialias:true,alpha:true}); ren.setSize(W(),H()); r.appendChild(ren.domElement);
  const scn=new THREE.Scene(), cam=new THREE.PerspectiveCamera(60,W()/H(),.1,100); cam.position.set(0,0,6);
  scn.add(new THREE.AmbientLight(0xffffff,.7)); const dl=new THREE.DirectionalLight(0xffffff,.6); dl.position.set(3,5,4); scn.add(dl);

  // -------- SPRITES DE TEXTO --------
// Sprite de texto con DPI y escala proporcional (ancho = alto * w/h)
const makeTextSprite=(txt)=>{
  const pad=6, DPR=Math.min(2,window.devicePixelRatio||1);
  const font=`${LABEL_SIZE}px system-ui, sans-serif`;

  // medir en un canvas efímero
  const mcv=document.createElement('canvas'), mctx=mcv.getContext('2d');
  mctx.font=font; const w=mctx.measureText(txt).width+pad*2, h=LABEL_SIZE+pad*2;

  // canvas real con DPI
  const c=document.createElement('canvas'), ctx=c.getContext('2d');
  c.width=Math.ceil(w*DPR); c.height=Math.ceil(h*DPR); ctx.scale(DPR,DPR);
  ctx.font=font; ctx.textBaseline="top";
  ctx.fillStyle="rgba(0,0,0,.45)"; ctx.fillRect(0,0,w,h);
  ctx.fillStyle="#fff"; ctx.fillText(txt,pad,pad);

  const tex=new THREE.CanvasTexture(c); tex.minFilter=THREE.LinearFilter; tex.magFilter=THREE.LinearFilter;
  const spr=new THREE.Sprite(new THREE.SpriteMaterial({map:tex,transparent:true}));

  // alto en unidades 3D, ancho por aspecto
  const height=0.015*LABEL_SIZE, aspect=w/h;
  spr.scale.set(height*aspect, height, 1);
  return spr;
};

  // -------- GRAFO --------
  const G=new THREE.Group(); scn.add(G);
  const gC=new THREE.SphereGeometry(.25,24,16), gN=new THREE.SphereGeometry(.16,16,12);
  const mC=new THREE.MeshStandardMaterial({color:0x3399ff}), mN=new THREE.MeshStandardMaterial({color:0xcccccc});
  const mE=new THREE.LineBasicMaterial({color:0x999999});
  const idx=new Map();

  const center=new THREE.Mesh(gC,mC); center.position.set(0,0,0); G.add(center);
  const lblC=makeTextSprite(base(cur.path)); lblC.position.set(0,.55,0); center.add(lblC);
  idx.set(cur.path,{pos:center.position,mesh:center,label:lblC,clickable:lblC});

  const R=2.4, N=Math.max(neigh.length,1);
  neigh.forEach((p,i)=>{
    const th=i/N*Math.PI*2, x=Math.cos(th)*R, y=Math.sin(th)*R;
    const mesh=new THREE.Mesh(gN,mN); mesh.position.set(x,y,0); G.add(mesh);
    const lbl=makeTextSprite(base(p)); lbl.position.set(0,.45,0); mesh.add(lbl);
    idx.set(p,{pos:mesh.position,mesh,label:lbl,clickable:lbl});
  });

  edges.forEach(e=>{ const A=idx.get(e.a)?.pos,B=idx.get(e.b)?.pos; if(A&&B) G.add(new THREE.Line(new THREE.BufferGeometry().setFromPoints([A.clone(),B.clone()]),mE)); });

  // -------- PICKING --------
  const ray=new THREE.Raycaster(), mouse=new THREE.Vector2();
  const spriteToPath=new Map(); idx.forEach((v,k)=>{spriteToPath.set(v.clickable,k);});
  ren.domElement.addEventListener('click',ev=>{
    const rect=ren.domElement.getBoundingClientRect();
    mouse.x=((ev.clientX-rect.left)/rect.width)*2-1; mouse.y=-((ev.clientY-rect.top)/rect.height)*2+1;
    ray.setFromCamera(mouse,cam);
    const hit=ray.intersectObjects([...spriteToPath.keys()],true)[0];
    if(hit){const path=spriteToPath.get(hit.object); app.workspace.openLinkText(base(path),cur.path);}
  });

  // -------- LOOP --------
  (function loop(){requestAnimationFrame(loop); G.rotation.z+=0.003; ren.render(scn,cam);})();
  window.addEventListener('resize',()=>{ren.setSize(W(),H());cam.aspect=W()/H();cam.updateProjectionMatrix();});
}catch(e){const pre=document.createElement('pre');pre.textContent='ERROR:\n'+(e&&e.stack||e);this.container.appendChild(pre);}
```















