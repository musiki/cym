---
type: obra
img: https://i.imgur.com/rYYhaD7.png
year: 1986
tags:
  - músicaescrita
  - orq
  - vidaartificial
person: "[[Iannis Xenakis]]"
premiereDate:
premierePlace:
url:
connect:
---


 Xenakis: grilla x–t con valores {0,1,2,4}, coloración tipo “Newton” mapeada a semitonos, y sonificación orquestal sencilla en WebAudio (síntesis mixta). Incluye botón start/stop que crea y destruye el AudioContext. Luego tienes el marco matemático y un comentario crítico con 20 preceptos.

1. DataviewJS: visualización + sonificación orquestal mínima



```dataviewjs
// Class 04.5 — CA-1D à la Xenakis: A/B/C selectable sieve + single-slider code mashup
// - Dropdown selects pitch sieve (A/B/C).
// - One slider morphs CA rule between A↔B↔C (piecewise blend).
// - Paneo por familia (brass/winds/strings). Reverb algorítmica. Start/Stop seguro.

// ---------- UI ----------
const ui=document.createElement('div'); ui.style.display='flex'; ui.style.gap='12px'; ui.style.alignItems='center';
const btn=document.createElement('button'); btn.textContent='▶ start';
const sel=document.createElement('select');
['A: Pelog (aprox)','B: Cuartas encajadas','C: Modular mayor'].forEach((t,i)=>{const o=document.createElement('option');o.value=String(i);o.textContent=t;sel.appendChild(o);});
const lab=document.createElement('label'); lab.textContent='mix A↔B↔C';
const rng=document.createElement('input'); rng.type='range'; rng.min=0; rng.max=100; rng.value=0; rng.style.width='180px';
const rtxt=document.createElement('span'); rtxt.textContent='A';
ui.append(btn, sel, lab, rng, rtxt);
this.container.appendChild(ui);

// ---------- Canvas ----------
const W=Math.max(560, this.container.clientWidth-8), H= Math.max(420, Math.floor(window.innerHeight*0.45));
const pad=12, cols=48, rows=32, baseMidi=48;
const can=document.createElement('canvas'); can.width=W; can.height=H; can.style.display='block'; can.style.margin='8px 0';
this.container.appendChild(can);
const ctx=can.getContext('2d');

// ---------- Color (Newton 12) ----------
const hue=k=>(k%12)*(360/12);
const colOfSemitone=k=>`hsl(${hue(k)},90%,55%)`;

// ---------- CA codes (maps: sum 0..12 → {0,1,2,4}) ----------
const mapA=[0,1,4,0,0,2,4,0,1,4,0,0,2];                      // 4200410 extendido
const mapB=[0,2,1,0,4,2,1,0,4,1,0,0,4];                      // variante
const mapC=[0,1,2,4,0,2,4,1,2,4,0,1,2];                      // otra distribución triádica

// Single-slider mixing A↔B↔C (piecewise). s∈[0,1]:
// s∈[0,.5]: A↔B;   s∈(.5,1]: B↔C
function pickMapValue(sum, s01){
  if(s01<=0.5){
    const t=s01/0.5;              // 0..1 between A and B
    return (Math.random()<t?mapB:mapA)[sum] ?? 0;
  }else{
    const t=(s01-0.5)/0.5;        // 0..1 between B and C
    return (Math.random()<t?mapC:mapB)[sum] ?? 0;
  }
}

// ---------- SIEVES (dropdown A/B/C) → pcOfCol(x) ----------
function makePc_A(){ // Pelog aprox (12-TET)
  const PEL=[0,1,3,7,8,10]; 
  return x=> PEL[x % PEL.length];
}
function makePc_B(){ // “dos cuartas encajadas”
  const fourth=(off,len=12)=>{const a=[]; let v=off%12; for(let k=0;k<len;k++){a.push(v); v=(v+5)%12;} return a;};
  const S1=fourth(0,12), S2=fourth(2,12);
  const SIEVE=Array.from(new Set([...S1,...S2]));
  return x=> SIEVE[x % SIEVE.length];
}
function makePc_C(){ // Mayor diatónica
  const MAJ=[0,2,4,5,7,9,11];
  return x=> MAJ[x % MAJ.length];
}
const sieveFns=[makePc_A(), makePc_B(), makePc_C()];
let pcOfCol=sieveFns[0];

// ---------- Build CA grid ----------
function evolveStep(prev, mix){ // mix ∈ [0..1]
  const next=new Array(cols).fill(0);
  for(let x=0;x<cols;x++){
    const L = x>0?prev[x-1]:0, C=prev[x], R = x<cols-1?prev[x+1]:0;
    const s=L+C+R;
    next[x]=pickMapValue(s, mix);
  }
  return next;
}
function buildGrid(mix){
  const grid=[];
  let row=new Array(cols).fill(0);
  row[Math.floor(cols*0.45)]=1; // semilla
  for(let r=0;r<rows;r++){
    grid.push(row);
    row=evolveStep(row, mix);
  }
  return grid;
}
let mix=0; // 0..1 from slider
let grid=buildGrid(mix);

// ---------- Drawing with numbers ----------
function midiOfCell(r,x){ // registro por fila + pc por columna
  const reg= baseMidi + Math.round((rows-1-r)*0.5);
  return reg + pcOfCol(x);
}
function draw(){
  ctx.clearRect(0,0,W,H);
  const cw=(W-2*pad)/cols, ch=(H-2*pad)/rows;
  const fs=Math.max(10, Math.floor(Math.min(cw,ch)*0.55));
  ctx.textAlign='center'; ctx.textBaseline='middle'; ctx.lineWidth=Math.max(1,fs*0.12);

  for(let r=0;r<rows;r++){
    for(let x=0;x<cols;x++){
      const v=grid[r][x]; if(v===0) continue;
      const m=midiOfCell(r,x), pc=m%12;
      const x0=pad+x*cw, y0=pad+r*ch, w=cw*0.95, h=ch*0.95, cx=x0+w/2, cy=y0+h/2;

      ctx.fillStyle=colOfSemitone(pc);
      ctx.globalAlpha=(v===4?0.9: v===2?0.75: 0.6);
      ctx.fillRect(x0,y0,w,h);

      ctx.globalAlpha=1; ctx.font=`${fs}px monospace`;
      ctx.strokeStyle='rgba(0,0,0,0.7)'; ctx.strokeText(String(pc),cx,cy);
      ctx.fillStyle='#fff'; ctx.fillText(String(pc),cx,cy);
    }
  }
}
draw();

// ---------- Audio engine ----------
let ac=null, running=false, tick=null, t0=0;
const ACTIVE=[];

const hz=m=>440*Math.pow(2,(m-69)/12);
function mkReverb(ctx){
  const con=ctx.createConvolver();
  const len=ctx.sampleRate*1.6, buf=ctx.createBuffer(2,len,ctx.sampleRate);
  for(let ch=0; ch<2; ch++){
    const d=buf.getChannelData(ch);
    for(let i=0;i<len;i++){ d[i]=(Math.random()*2-1)*Math.pow(1-i/len,3); }
  }
  con.buffer=buf; return con;
}
function panFor(val){ // 1 brass, 2 winds, 4 strings
  if(val===1) return -0.45 + (Math.random()-0.5)*0.2;
  if(val===2) return  0.00 + (Math.random()-0.5)*0.2;
  if(val===4) return  0.45 + (Math.random()-0.5)*0.2;
  return 0;
}

let master=null, rv=null, comp=null;

function playBrass(m,when,dur){
  const f=hz(m), o=ac.createOscillator(), sh=ac.createWaveShaper(), g=ac.createGain(), p=ac.createStereoPanner();
  const curve=new Float32Array(256); for(let i=0;i<256;i++){const x=i/128-1; curve[i]=Math.tanh(2.5*x);}
  sh.curve=curve; o.type='sawtooth'; o.frequency.value=f; p.pan.value=panFor(1);
  g.gain.setValueAtTime(0,when); g.gain.linearRampToValueAtTime(0.18,when+0.02); g.gain.exponentialRampToValueAtTime(1e-4, when+dur);
  o.connect(sh).connect(g).connect(p).connect(master);
  o.start(when); o.stop(when+dur+0.02); ACTIVE.push(o,g,p);
}
function playWinds(m,when,dur){
  const f=hz(m), c=ac.createOscillator(), mO=ac.createOscillator(), mg=ac.createGain(), g=ac.createGain(), p=ac.createStereoPanner();
  mO.frequency.value=3+Math.random()*6; mg.gain.value=f*0.015; c.frequency.value=f; p.pan.value=panFor(2);
  g.gain.setValueAtTime(0,when); g.gain.linearRampToValueAtTime(0.16,when+0.03); g.gain.exponentialRampToValueAtTime(1e-4, when+dur);
  mO.connect(mg).connect(c.frequency); c.connect(g).connect(p).connect(master);
  c.start(when); mO.start(when); c.stop(when+dur+0.02); mO.stop(when+dur+0.02); ACTIVE.push(c,mO,g,p);
}
function playStrings(m,when,dur){
  const f=hz(m), o=ac.createOscillator(), bp=ac.createBiquadFilter(), g=ac.createGain(), p=ac.createStereoPanner();
  bp.type='bandpass'; bp.frequency.value=f; bp.Q.value=8; o.type='sawtooth'; o.frequency.value=f; p.pan.value=panFor(4);
  g.gain.setValueAtTime(0,when); g.gain.linearRampToValueAtTime(0.14,when+0.04); g.gain.exponentialRampToValueAtTime(1e-4, when+dur);
  o.connect(bp).connect(g).connect(p).connect(master);
  o.start(when); o.stop(when+dur+0.02); ACTIVE.push(o,bp,g,p);
}

function schedule(){
  if(!running||!ac) return;
  const bpm = 100; // tempo estable para comparar
  const beat=60/bpm, dur=beat*0.9;
  const col = Math.floor(((ac.currentTime - t0)/beat) % cols);

  for(let r=0;r<rows;r++){
    const v=grid[r][col]; if(v===0) continue;
    const m= midiOfCell(r,col);
    const when= ac.currentTime + 0.02 + r*0.002;
    if(v===1) playBrass(m,when,dur);
    else if(v===2) playWinds(m,when,dur);
    else if(v===4) playStrings(m,when,dur);
  }
  tick=setTimeout(schedule, beat*1000);
}

// ---------- Hooks ----------
sel.onchange=()=>{
  pcOfCol = sieveFns[Number(sel.value)];
  grid = buildGrid(mix); draw();
};
rng.oninput=()=>{
  const s=Number(rng.value)/100;
  mix=s;
  rtxt.textContent = (s<0.5? `A↔B ${Math.round(s/0.5*100)}%` : `B↔C ${Math.round((s-0.5)/0.5*100)}%`);
  grid = buildGrid(mix); draw();
};

btn.onclick=async()=>{
  if(!ac){
    ac=new (window.AudioContext||window.webkitAudioContext)(); await ac.resume();
    master=ac.createGain(); master.gain.value=0.30;
    rv=mkReverb(ac); comp=ac.createDynamicsCompressor(); comp.threshold.value=-18; comp.knee.value=18; comp.ratio.value=2.5;
    master.connect(rv).connect(comp).connect(ac.destination);
    running=true; btn.textContent='■ stop'; t0=ac.currentTime; schedule();
  }else{
    running=false; if(tick){clearTimeout(tick); tick=null;}
    while(ACTIVE.length){ const n=ACTIVE.pop(); try{n.stop?n.stop():n.disconnect();}catch{} }
    try{ master.disconnect(); rv.disconnect(); comp.disconnect(); }catch{}
    await ac.close().catch(()=>{}); ac=null; master=null; rv=null; comp=null;
    btn.textContent='▶ start';
  }
};
```




2. Formalización matemática compacta

Sea una cinta 1D con celdas $x∈{0,…,N−1}$ y valores $v_t(x)∈A$, donde $A={0,1,2,4}$. Con vecindad de radio 1:
	1.	Suma local
$s_t(x)=v_t(x-1)+v_t(x)+v_t(x+1)$.
	2.	Regla por “código” c: función \phi:\{0,\dots,12\}\to A. Para el código 4200410 (extendido) se usa
$\phi(s)=\{0,1,4,0,0,2,4,0,1,4,0,0,2\}[s]$.
	3.	Evolución
v_{t+1}(x)=\phi\big(s_t(x)\big).
	4.	Orquestación por familias
v\in\{1,2,4\}\ \mapsto\ \text{brass, winds, strings},\quad v=0\mapsto\varnothing.
	5.	Mapeo a alturas sobre una criba S de semitonos
\text{midi}(t,x)=m_0 + f(r) + \pi(x),\qquad \pi(x)\in S,
donde f(r) fija el registro por fila r y π(x) asigna clase de altura por columna x. Las progresiones armónicas se leen por columnas t fijas rotadas 90°. Esta lectura y la asignación 1/2/4→familias están documentadas para Horos.  ￼  ￼

Coloración tipo Newton: asigna tono a clase de altura k con un círculo de 12 divisiones, hue = 360·k/12, saturación y luminancia fijas (interpolación lineal entre semitonos).

3. Por qué Xenakis usa CA en Horos (síntesis de fuentes)

Usa CA para decidir sucesiones de acordes dentro de una estructura perceptible, con criba de alturas no octaviantes; produce homofonía dinámica con densidad cambiante y combinaciones tímbricas ricas; mapea valores de celda a familias instrumentales, y recurre a “bricolage” manual para ajustar macro y microforma. Hay evidencia explícita del código 4200410 en compases 10 y 14–15; otra instancia en 16–18, y una mezcla de códigos más adelante.  ￼  ￼  ￼  ￼

## 4. Veinte preceptos clave (crítico–operativos)
1.	Usar CA para sucesiones armónicas no lineales.  ￼
2.	Restringir alturas mediante cribas no octaviantes.  ￼
3.	Mapear valores de celda a familias instrumentales.  ￼
4.	Favorecer homofonía dinámica con densidad variable.  ￼
5.	Admitir simetrías/fractalidad en la evolución.  ￼
6.	Alternar secciones por interpolación macroformal.  ￼
7.	Ajustar a mano huecos y licencias del modelo.  ￼
8.	Considerar CA como teoría tardía central.  ￼
9.	Relacionar con turbulencia/fluido a nivel masa.  ￼
10.	Usar dispositivos computacionales modestos (pocket).  ￼
11.	Elegir códigos con más de dos valores para timbre.  ￼
12.	Leer columnas como acordes, filas como tiempo.  ￼
13.	Garantizar perceptibilidad por bloques orquestales.  ￼
14.	Evitar linealidades melódicas triviales.  ￼
15.	Emplear mezclas de códigos si hay saturación.  ￼
16.	Tratar armonías como síntesis macroscópica.  ￼
17.	Permitir lecturas heterodoxas con bordes/condiciones.  ￼
18.	Integrar escalas exóticas (pelog, cuartas encajadas).  ￼
19.	Usar CA como “mecanismo” dentro de la formalización.  ￼
20.	Mantener economía de principios/reglas.  ￼


```dataviewjs
// Class 04.6 — CA-1D à la Xenakis (Realtime evolution + visual cursor)
// • Grid evolves row-by-row in realtime (each beat = next CA row).
// • Horizontal cursor highlights the CURRENT sounding row.
// • Dropdown chooses sieve (A/B/C). Slider morphs rule A↔B↔C.
// • Paneo por familia (brass=1, winds=2, strings=4). Reverb algorítmica.
// • One Start/Stop button that safely creates/destroys the AudioContext.

// ---------- UI ----------
const ui=document.createElement('div');
ui.style.display='flex'; ui.style.gap='12px'; ui.style.alignItems='center';
const btn=document.createElement('button'); btn.textContent='▶ start';
const sel=document.createElement('select');
['A: Pelog (aprox)','B: Cuartas encajadas','C: Modular mayor']
  .forEach((t,i)=>{const o=document.createElement('option');o.value=String(i);o.textContent=t;sel.appendChild(o);});
const lab=document.createElement('label'); lab.textContent='mix A↔B↔C';
const rng=document.createElement('input'); rng.type='range'; rng.min=0; rng.max=100; rng.value=0; rng.style.width='180px';
const rtxt=document.createElement('span'); rtxt.textContent='A';
ui.append(btn, sel, lab, rng, rtxt);
this.container.appendChild(ui);

// ---------- Canvas ----------
const W=Math.max(560, this.container.clientWidth-8);
const H=Math.max(420, Math.floor(window.innerHeight*0.45));
const pad=12, cols=48, rows=32, baseMidi=48;
const can=document.createElement('canvas'); can.width=W; can.height=H;
can.style.display='block'; can.style.margin='8px 0';
this.container.appendChild(can);
const cx=can.getContext('2d');

// ---------- Color (Newton 12) ----------
const hue=k=>(k%12)*(360/12);
const colOfSemitone=k=>`hsl(${hue(k)},90%,55%)`;

// ---------- CA codes (maps: sum 0..12 → {0,1,2,4}) ----------
const mapA=[0,1,4,0,0,2,4,0,1,4,0,0,2];                      // 4200410 extendido
const mapB=[0,2,1,0,4,2,1,0,4,1,0,0,4];                      // variante
const mapC=[0,1,2,4,0,2,4,1,2,4,0,1,2];                      // otra distribución triádica

// Single-slider mixing A↔B↔C (piecewise). s∈[0,1]:
// s∈[0,.5]: A↔B;   s∈(.5,1]: B↔C
function pickMapValue(sum, s01){
  if(s01<=0.5){
    const t=s01/0.5;              // 0..1 between A and B
    return (Math.random()<t?mapB:mapA)[sum] ?? 0;
  }else{
    const t=(s01-0.5)/0.5;        // 0..1 between B and C
    return (Math.random()<t?mapC:mapB)[sum] ?? 0;
  }
}

// ---------- SIEVES (dropdown A/B/C) → pcOfCol(x) ----------
function makePc_A(){ // Pelog aprox (12-TET)
  const PEL=[0,1,3,7,8,10]; 
  return x=> PEL[x % PEL.length];
}
function makePc_B(){ // “dos cuartas encajadas”
  const fourth=(off,len=12)=>{const a=[]; let v=off%12; for(let k=0;k<len;k++){a.push(v); v=(v+5)%12;} return a;};
  const S1=fourth(0,12), S2=fourth(2,12);
  const SIEVE=Array.from(new Set([...S1,...S2]));
  return x=> SIEVE[x % SIEVE.length];
}
function makePc_C(){ // Mayor diatónica
  const MAJ=[0,2,4,5,7,9,11];
  return x=> MAJ[x % MAJ.length];
}
const sieveFns=[makePc_A(), makePc_B(), makePc_C()];
let pcOfCol=sieveFns[0];

// ---------- CA state (realtime) ----------
// Grid is a rolling buffer of the last `rows` time-steps (each row is a CA state across columns).
let mix=0; // 0..1 from slider
let grid=[];          // Array<row>, row:Array<number> length=cols
let prevRow=null;     // last computed row (for next evolution)
const seedX=Math.floor(cols*0.45);

function evolveStep(prev, s01){ // prev: Array<cols>
  const next=new Array(cols).fill(0);
  for(let x=0;x<cols;x++){
    const L = x>0? prev[x-1]:0;
    const C = prev[x];
    const R = x<cols-1? prev[x+1]:0;
    const s=L+C+R;
    next[x]=pickMapValue(s, s01);
  }
  return next;
}

function initGrid(){
  grid.length=0;
  // start with rows-1 empty rows, then one seeded row in the end
  for(let r=0;r<rows-1;r++) grid.push(new Array(cols).fill(0));
  const seed=new Array(cols).fill(0); seed[seedX]=1;
  grid.push(seed);
  prevRow=seed;
}
initGrid();

// ---------- Pitch mapping ----------
function midiOfCell(rIdx,x){ // rIdx used for register; x → pitch class by sieve
  const reg= baseMidi + Math.round((rows-1-rIdx)*0.5);
  return reg + pcOfCol(x);
}

// ---------- Drawing (grid + numbers + cursor) ----------
function draw(currentRowIdx){
  cx.clearRect(0,0,W,H);
  const cw=(W-2*pad)/cols, ch=(H-2*pad)/rows;
  const fs=Math.max(10, Math.floor(Math.min(cw,ch)*0.55));
  cx.textAlign='center'; cx.textBaseline='middle'; cx.lineWidth=Math.max(1,fs*0.12);

  // cells
  for(let r=0;r<rows;r++){
    const row=grid[r];
    for(let x=0;x<cols;x++){
      const v=row[x]; if(v===0) continue;
      const m=midiOfCell(r,x), pc=m%12;
      const x0=pad+x*cw, y0=pad+r*ch, w=cw*0.95, h=ch*0.95, cxm=x0+w/2, cym=y0+h/2;

      cx.globalAlpha=(v===4?0.9: v===2?0.75: 0.6);
      cx.fillStyle=colOfSemitone(pc);
      cx.fillRect(x0,y0,w,h);

      cx.globalAlpha=1; cx.font=`${fs}px monospace`;
      cx.strokeStyle='rgba(0,0,0,0.7)'; cx.strokeText(String(pc),cxm,cym);
      cx.fillStyle='#fff'; cx.fillText(String(pc),cxm,cym);
    }
  }

  // cursor band over CURRENT row (audible row) — semi-transparent overlay
  if(typeof currentRowIdx==='number'){
    const yCur = pad + currentRowIdx*ch;
    cx.globalAlpha=0.22;
    cx.fillStyle='#ffffff';
    cx.fillRect(pad-2, yCur-2, W-2*pad+4, ch+4);
    cx.globalAlpha=1;
  }
}

// initial paint
draw(rows-1); // start highlighting the last row

// ---------- Audio engine ----------
let ac=null, running=false, tick=null, t0=0;
const ACTIVE=[];

const hz=m=>440*Math.pow(2,(m-69)/12);
function mkReverb(ctx){
  const con=ctx.createConvolver();
  const len=ctx.sampleRate*1.6, buf=ctx.createBuffer(2,len,ctx.sampleRate);
  for(let ch=0; ch<2; ch++){
    const d=buf.getChannelData(ch);
    for(let i=0;i<len;i++){ d[i]=(Math.random()*2-1)*Math.pow(1-i/len,3); }
  }
  con.buffer=buf; return con;
}
function panFor(val){ // 1 brass, 2 winds, 4 strings
  if(val===1) return -0.45 + (Math.random()-0.5)*0.2;
  if(val===2) return  0.00 + (Math.random()-0.5)*0.2;
  if(val===4) return  0.45 + (Math.random()-0.5)*0.2;
  return 0;
}

let master=null, rv=null, comp=null;

function playBrass(m,when,dur){
  const f=hz(m), o=ac.createOscillator(), sh=ac.createWaveShaper(), g=ac.createGain(), p=ac.createStereoPanner();
  const curve=new Float32Array(256); for(let i=0;i<256;i++){const x=i/128-1; curve[i]=Math.tanh(2.5*x);}
  sh.curve=curve; o.type='sawtooth'; o.frequency.value=f; p.pan.value=panFor(1);
  g.gain.setValueAtTime(0,when); g.gain.linearRampToValueAtTime(0.18,when+0.02); g.gain.exponentialRampToValueAtTime(1e-4, when+dur);
  o.connect(sh).connect(g).connect(p).connect(master);
  o.start(when); o.stop(when+dur+0.02); ACTIVE.push(o,g,p);
}
function playWinds(m,when,dur){
  const f=hz(m), c=ac.createOscillator(), mO=ac.createOscillator(), mg=ac.createGain(), g=ac.createGain(), p=ac.createStereoPanner();
  mO.frequency.value=3+Math.random()*6; mg.gain.value=f*0.015; c.frequency.value=f; p.pan.value=panFor(2);
  g.gain.setValueAtTime(0,when); g.gain.linearRampToValueAtTime(0.16,when+0.03); g.gain.exponentialRampToValueAtTime(1e-4, when+dur);
  mO.connect(mg).connect(c.frequency); c.connect(g).connect(p).connect(master);
  c.start(when); mO.start(when); c.stop(when+dur+0.02); mO.stop(when+dur+0.02); ACTIVE.push(c,mO,g,p);
}
function playStrings(m,when,dur){
  const f=hz(m), o=ac.createOscillator(), bp=ac.createBiquadFilter(), g=ac.createGain(), p=ac.createStereoPanner();
  bp.type='bandpass'; bp.frequency.value=f; bp.Q.value=8; o.type='sawtooth'; o.frequency.value=f; p.pan.value=panFor(4);
  g.gain.setValueAtTime(0,when); g.gain.linearRampToValueAtTime(0.14,when+0.04); g.gain.exponentialRampToValueAtTime(1e-4, when+dur);
  o.connect(bp).connect(g).connect(p).connect(master);
  o.start(when); o.stop(when+dur+0.02); ACTIVE.push(o,bp,g,p);
}

// ---------- Scheduler (realtime evolution) ----------
const bpm=100; // fixed tempo to compare
const beat=60/bpm;

function stepAndPlay(){
  if(!running||!ac) return;

  // 1) evolve CA one step
  const next = evolveStep(prevRow, mix);
  prevRow = next;
  grid.push(next);
  if(grid.length>rows) grid.shift();

  // 2) play CURRENT row (last row in grid)
  const rIdx = grid.length-1;
  const whenBase = ac.currentTime + 0.02;
  for(let x=0;x<cols;x++){
    const v = grid[rIdx][x]; if(v===0) continue;
    const m = midiOfCell(rIdx, x);
    const dur = beat*0.9;
    const when = whenBase + (x*0.0); // all together as chord (set small >0 for micro-stagger)
    if(v===1)      playBrass(m,when,dur);
    else if(v===2) playWinds(m,when,dur);
    else if(v===4) playStrings(m,when,dur);
  }

  // 3) redraw with cursor highlighting the current row
  draw(rIdx);

  // 4) schedule next step
  tick=setTimeout(stepAndPlay, beat*1000);
}

// ---------- Hooks ----------
sel.onchange=()=>{
  pcOfCol = sieveFns[Number(sel.value)];
  draw(grid.length-1);
};
rng.oninput=()=>{
  const s=Number(rng.value)/100;
  mix=s;
  rtxt.textContent = (s<0.5? `A↔B ${Math.round(s/0.5*100)}%` : `B↔C ${Math.round((s-0.5)/0.5*100)}%`);
  // No rebuild needed; affects future evolution
};

btn.onclick=async()=>{
  if(!ac){
    ac=new (window.AudioContext||window.webkitAudioContext)(); await ac.resume();
    const g=ac.createGain(); g.gain.value=0.30; // master
    const rv=mkReverb(ac);
    const cp=ac.createDynamicsCompressor(); cp.threshold.value=-18; cp.knee.value=18; cp.ratio.value=2.5;
    g.connect(rv).connect(cp).connect(ac.destination);
    master=g; comp=cp; running=true; btn.textContent='■ stop';
    // fresh CA (so A/B/C comparisons start from same seed)
    initGrid(); draw(grid.length-1);
    t0=ac.currentTime; stepAndPlay();
  }else{
    running=false; if(tick){clearTimeout(tick); tick=null;}
    while(ACTIVE.length){ const n=ACTIVE.pop(); try{n.stop?n.stop():n.disconnect();}catch{} }
    try{ master.disconnect(); comp.disconnect(); }catch{}
    await ac.close().catch(()=>{}); ac=null; master=null; comp=null;
    btn.textContent='▶ start';
  }
};
```


### lilypond version

```dataviewjs
// Class 04.7 — CA→LilyPond export (orquesta) + copiar al portapapeles
// - Evolución en tiempo real (como 04.6), cursor de fila actual
// - Dropdown de criba (A/B/C) + slider de mezcla A↔B↔C de la regla
// - Paneo por familia, reverb algorítmica, Start/Stop seguro
// - NUEVO: Textarea con partitura LilyPond y botón 📋 copiar
// Nota: edita la lista INSTR para que coincida con los nombres de tu partitura de Xenakis

/* ========== UI superior ========== */
const ui=document.createElement('div');
ui.style.display='flex'; ui.style.gap='12px'; ui.style.alignItems='center'; ui.style.flexWrap='wrap';
const btn=document.createElement('button'); btn.textContent='▶ start';
const sel=document.createElement('select');
['A: Pelog (aprox)','B: Cuartas encajadas','C: Modular mayor']
  .forEach((t,i)=>{const o=document.createElement('option');o.value=String(i);o.textContent=t;sel.appendChild(o);});
const lab=document.createElement('label'); lab.textContent='mix A↔B↔C';
const rng=document.createElement('input'); rng.type='range'; rng.min=0; rng.max=100; rng.value=0; rng.style.width='180px';
const rtxt=document.createElement('span'); rtxt.textContent='A';
ui.append(btn, sel, lab, rng, rtxt);
this.container.appendChild(ui);

/* ========== Canvas ========== */
const W=Math.max(560, this.container.clientWidth-8);
const H=Math.max(420, Math.floor(window.innerHeight*0.45));
const pad=12, cols=48;
let rows=32; // se ajustará a INSTR.length al exportar
const baseMidi=48;

const can=document.createElement('canvas'); can.width=W; can.height=H;
can.style.display='block'; can.style.margin='8px 0';
this.container.appendChild(can);
const cx=can.getContext('2d');

/* ========== Export UI (LilyPond) ========== */
const exWrap=document.createElement('div'); exWrap.style.display='grid'; exWrap.style.gridTemplateColumns='1fr auto'; exWrap.style.gap='8px';
const ta=document.createElement('textarea');
ta.rows=10; ta.style.width='100%'; ta.placeholder='LilyPond aparecerá aquí…';
const cp=document.createElement('button'); cp.textContent='📋 copiar';
cp.onclick=async()=>{ try{ await navigator.clipboard.writeText(ta.value); cp.textContent='✅ copiado'; setTimeout(()=>cp.textContent='📋 copiar',1500);}catch{ alert('No se pudo copiar'); } };
exWrap.append(ta, cp);
this.container.appendChild(exWrap);

/* ========== Color (Newton 12) ========== */
const hue=k=>(k%12)*(360/12);
const colOfSemitone=k=>`hsl(${hue(k)},90%,55%)`;

/* ========== Reglas CA (sum 0..12 → {0,1,2,4}) ========== */
const mapA=[0,1,4,0,0,2,4,0,1,4,0,0,2];   // 4200410 extendida
const mapB=[0,2,1,0,4,2,1,0,4,1,0,0,4];   // variante
const mapC=[0,1,2,4,0,2,4,1,2,4,0,1,2];   // triádica

function pickMapValue(sum, s01){
  if(s01<=0.5){
    const t=s01/0.5;              // 0..1 entre A y B
    return (Math.random()<t?mapB:mapA)[sum] ?? 0;
  }else{
    const t=(s01-0.5)/0.5;        // 0..1 entre B y C
    return (Math.random()<t?mapC:mapB)[sum] ?? 0;
  }
}

/* ========== Cribas A/B/C ========== */
function makePc_A(){ const PEL=[0,1,3,7,8,10]; return x=> PEL[x%PEL.length]; }
function makePc_B(){ const fourth=(off,len=12)=>{const a=[];let v=off%12;for(let k=0;k<len;k++){a.push(v);v=(v+5)%12;}return a;};
  const S1=fourth(0,12), S2=fourth(2,12); const SIEVE=Array.from(new Set([...S1,...S2])); return x=> SIEVE[x%SIEVE.length]; }
function makePc_C(){ const MAJ=[0,2,4,5,7,9,11]; return x=> MAJ[x%MAJ.length]; }
const sieveFns=[makePc_A(),makePc_B(),makePc_C()];
let pcOfCol=sieveFns[0];

/* ========== Estado CA (tiempo real) ========== */
let mix=0; // 0..1 del slider
let grid=[];         // buffer circular de filas
let prevRow=null;
const seedX=Math.floor(cols*0.45);

function evolveStep(prev, s01){
  const next=new Array(cols).fill(0);
  for(let x=0;x<cols;x++){
    const L=x>0?prev[x-1]:0, C=prev[x], R=x<cols-1?prev[x+1]:0;
    next[x]=pickMapValue(L+C+R, s01);
  }
  return next;
}
function initGrid(){
  grid.length=0;
  for(let r=0;r<rows-1;r++) grid.push(new Array(cols).fill(0));
  const seed=new Array(cols).fill(0); seed[seedX]=1;
  grid.push(seed); prevRow=seed;
}
initGrid();

/* ========== Mapeo de pitch ========== */
function midiOfCell(rIdx,x){
  const reg= baseMidi + Math.round((rows-1-rIdx)*0.5);
  return reg + pcOfCol(x);
}

/* ========== Dibujo (con cursor) ========== */
function draw(currentRowIdx){
  cx.clearRect(0,0,W,H);
  const cw=(W-2*pad)/cols, ch=(H-2*pad)/rows;
  const fs=Math.max(10, Math.floor(Math.min(cw,ch)*0.55));
  cx.textAlign='center'; cx.textBaseline='middle'; cx.lineWidth=Math.max(1,fs*0.12);

  for(let r=0;r<rows;r++){
    const row=grid[r];
    for(let x=0;x<cols;x++){
      const v=row[x]; if(v===0) continue;
      const m=midiOfCell(r,x), pc=m%12;
      const x0=pad+x*cw, y0=pad+r*ch, w=cw*0.95, h=ch*0.95, cxm=x0+w/2, cym=y0+h/2;

      cx.globalAlpha=(v===4?0.9: v===2?0.75: 0.6);
      cx.fillStyle=colOfSemitone(pc);
      cx.fillRect(x0,y0,w,h);

      cx.globalAlpha=1; cx.font=`${fs}px monospace`;
      cx.strokeStyle='rgba(0,0,0,0.7)'; cx.strokeText(String(pc),cxm,cym);
      cx.fillStyle='#fff'; cx.fillText(String(pc),cxm,cym);
    }
  }
  if(typeof currentRowIdx==='number'){
    const ch=(H-2*pad)/rows, yCur=pad+currentRowIdx*ch;
    cx.globalAlpha=0.22; cx.fillStyle='#fff';
    cx.fillRect(pad-2,yCur-2,W-2*pad+4,ch+4);
    cx.globalAlpha=1;
  }
}
draw(rows-1);

/* ========== Audio mínimo ========== */
let ac=null, running=false, tick=null; const ACTIVE=[];
const bpm=100, beat=60/bpm;

const hz=m=>440*Math.pow(2,(m-69)/12);
function mkReverb(ctx){ const con=ctx.createConvolver(); const len=ctx.sampleRate*1.6, buf=ctx.createBuffer(2,len,ctx.sampleRate);
  for(let ch=0; ch<2; ch++){ const d=buf.getChannelData(ch); for(let i=0;i<len;i++){ d[i]=(Math.random()*2-1)*Math.pow(1-i/len,3);} }
  con.buffer=buf; return con; }
function panFor(v){ if(v===1) return -0.45+(Math.random()-0.5)*0.2; if(v===2) return (Math.random()-0.5)*0.2; if(v===4) return 0.45+(Math.random()-0.5)*0.2; return 0; }

let master=null, rv=null, comp=null;
function playBrass(m,when,dur){ const f=hz(m), o=ac.createOscillator(), sh=ac.createWaveShaper(), g=ac.createGain(), p=ac.createStereoPanner();
  const curve=new Float32Array(256); for(let i=0;i<256;i++){const x=i/128-1; curve[i]=Math.tanh(2.5*x);} sh.curve=curve;
  o.type='sawtooth'; o.frequency.value=f; p.pan.value=panFor(1);
  g.gain.setValueAtTime(0,when); g.gain.linearRampToValueAtTime(0.18,when+0.02); g.gain.exponentialRampToValueAtTime(1e-4, when+dur);
  o.connect(sh).connect(g).connect(p).connect(master); o.start(when); o.stop(when+dur+0.02); ACTIVE.push(o,g,p); }
function playWinds(m,when,dur){ const f=hz(m), c=ac.createOscillator(), mO=ac.createOscillator(), mg=ac.createGain(), g=ac.createGain(), p=ac.createStereoPanner();
  mO.frequency.value=3+Math.random()*6; mg.gain.value=f*0.015; c.frequency.value=f; p.pan.value=panFor(2);
  g.gain.setValueAtTime(0,when); g.gain.linearRampToValueAtTime(0.16,when+0.03); g.gain.exponentialRampToValueAtTime(1e-4, when+dur);
  mO.connect(mg).connect(c.frequency); c.connect(g).connect(p).connect(master);
  c.start(when); mO.start(when); c.stop(when+dur+0.02); mO.stop(when+dur+0.02); ACTIVE.push(c,mO,g,p); }
function playStrings(m,when,dur){ const f=hz(m), o=ac.createOscillator(), bp=ac.createBiquadFilter(), g=ac.createGain(), p=ac.createStereoPanner();
  bp.type='bandpass'; bp.frequency.value=f; bp.Q.value=8; o.type='sawtooth'; o.frequency.value=f; p.pan.value=panFor(4);
  g.gain.setValueAtTime(0,when); g.gain.linearRampToValueAtTime(0.14,when+0.04); g.gain.exponentialRampToValueAtTime(1e-4, when+dur);
  o.connect(bp).connect(g).connect(p).connect(master); o.start(when); o.stop(when+dur+0.02); ACTIVE.push(o,bp,g,p); }

function stepAndPlay(){
  if(!running||!ac) return;
  const next=evolveStep(prevRow, mix); prevRow=next; grid.push(next); if(grid.length>rows) grid.shift();
  const rIdx=grid.length-1; const whenBase=ac.currentTime+0.02; const dur=beat*0.9;
  for(let x=0;x<cols;x++){
    const v=grid[rIdx][x]; if(v===0) continue; const m=midiOfCell(rIdx,x);
    const when=whenBase; if(v===1) playBrass(m,when,dur); else if(v===2) playWinds(m,when,dur); else if(v===4) playStrings(m,when,dur);
  }
  draw(rIdx); tick=setTimeout(stepAndPlay, beat*1000);
}

/* ========== Exportar a LilyPond ========== */
/*
  IMPORTANTE:
  - Ajusta INSTR para que coincida con tu plantilla (orden = filas de arriba hacia abajo).
  - Por defecto ponemos una orquesta simbólica amplia (nombres convencionales).
  - El export mapea por columnas → acordes simultáneos; cada columna = negra (4).
*/
const INSTR = [
  // Vientos
  "Flute 1","Flute 2","Oboe 1","Oboe 2","Clarinet in Bb 1","Clarinet in Bb 2","Bassoon 1","Bassoon 2",
  // Bronces
  "Horn in F 1","Horn in F 2","Trumpet in C 1","Trumpet in C 2","Trombone 1","Trombone 2",
  // Cuerdas (divide según filas)
  "Violin I a","Violin I b","Violin II a","Violin II b","Viola a","Viola b","Cello a","Cello b","Contrabass"
];
// Ajustar rows al número de instrumentos (top=0 → instrumento superior)
rows = INSTR.length; initGrid(); draw(rows-1);

function pitchNameLily(midi){
  // nombres en LilyPond (do=relat.) c d e f g a b con alteraciones is/es y octavas con comillas
  const names = ["c","cis","d","dis","e","f","fis","g","gis","a","ais","b"];
  const pc = ((midi%12)+12)%12;
  const name = names[pc];
  // Octava Lily: c' = MIDI 60; c = 48..59; c,, etc.
  const octave = Math.floor(midi/12)-1; // MIDI conv.
  // Lily base c' (MIDI 60) → octShift = octaveDiff from 4 (since C4=60)
  const octShift = octave - 4;
  let marks = "";
  if (octShift > 0) marks = "'".repeat(octShift);
  else if (octShift < 0) marks = ",".repeat(-octShift);
  return name + marks;
}

function makeLilyFromGrid(gridSnap){
  // gridSnap: Array<rows> de filas actuales (cada fila: array de length=cols con 0/1/2/4)
  // Construimos un acorde por columna para cada pentagrama si la celda activa pertenece a su fila.
  const beatsPerBar=4; // 4/4
  const dur="4";       // negra por columna
  const header = `\\version "2.24.0"
\\paper { indent = 0 }
\\header { title = "CA Orchestral Sketch" composer = "after Xenakis (study)" }
\\layout { }
`;

  // Para cada instrumento, recogemos notas por columnas
  const staves = [];
  for(let r=0;r<rows;r++){
    const instr = INSTR[r] || `Staff ${r+1}`;
    let music = [];
    for(let x=0;x<cols;x++){
      const v = gridSnap[r][x];
      if(v===0){ music.push("r"+dur); continue; }
      const m = midiOfCell(r,x);
      music.push(pitchNameLily(m) + dur);
    }
    // añade barras cada 4 negras
    const withBars = music.map((tok,i)=> ((i>0 && i%beatsPerBar===0) ? "| "+tok : tok)).join(" ");
    staves.push(`
  \\new Staff \\with { instrumentName = "${instr}" }
  { \\time 4/4 \\tempo 4 = ${Math.round(60/beat)}
    ${withBars} | 
  }`);
  }

  const score = `${header}
\\score {
<<
${staves.join("\n")}
>>
  \\midi { }
}
`;
  return score;
}

// actualizar textarea con una instantánea (grid actual)
function updateExport(){
  const snap = grid.slice(); // filas visibles (top..bottom)
  ta.value = makeLilyFromGrid(snap);
}
updateExport();

/* ========== Hooks ========== */
sel.onchange=()=>{ pcOfCol=sieveFns[Number(sel.value)]; draw(grid.length-1); updateExport(); };
rng.oninput=()=>{ const s=Number(rng.value)/100; mix=s; rtxt.textContent=(s<0.5?`A↔B ${Math.round(s/0.5*100)}%`:`B↔C ${Math.round((s-0.5)/0.5*100)}%`); };
btn.onclick=async()=>{
  if(!ac){
    ac=new (window.AudioContext||window.webkitAudioContext)(); await ac.resume();
    const g=ac.createGain(); g.gain.value=0.30; rv=mkReverb(ac);
    comp=ac.createDynamicsCompressor(); comp.threshold.value=-18; comp.knee.value=18; comp.ratio.value=2.5;
    g.connect(rv).connect(comp).connect(ac.destination); master=g; running=true; btn.textContent='■ stop';
    initGrid(); draw(grid.length-1); updateExport();
    stepAndPlay();
  }else{
    running=false; if(tick){clearTimeout(tick); tick=null;}
    while(ACTIVE.length){ const n=ACTIVE.pop(); try{n.stop?n.stop():n.disconnect();}catch{} }
    try{ master.disconnect(); rv.disconnect(); comp.disconnect(); }catch{}
    await ac.close().catch(()=>{}); ac=null; master=null; rv=null; comp=null; btn.textContent='▶ start';
  }
};

/* ========== Scheduler (realtime) ========== */
function stepAndPlay(){
  if(!running||!ac) return;
  const next=evolveStep(prevRow, mix); prevRow=next; grid.push(next); if(grid.length>rows) grid.shift();
  const rIdx=grid.length-1; const whenBase=ac.currentTime+0.02; const dur=beat*0.9;
  for(let x=0;x<cols;x++){
    const v=grid[rIdx][x]; if(v===0) continue; const m=midiOfCell(rIdx,x);
    const when=whenBase; if(v===1) playBrass(m,when,dur); else if(v===2) playWinds(m,when,dur); else if(v===4) playStrings(m,when,dur);
  }
  draw(rIdx); updateExport();
  tick=setTimeout(stepAndPlay, beat*1000);
}
```



## lilypond + format 


```dataviewjs
// CA→LilyPond (absolute pitches, safe staff range, extra vertical spacing)
// - Realtime 1D CA à la Xenakis
// - Export LilyPond with absolute note names, clamped to staff range
// - Textarea + copy button
// - Simple spacing in \paper/\layout to avoid staff collisions

/* UI */
const c=this.container;
const btn=document.createElement('button'); btn.textContent='▶ start';
const ta=Object.assign(document.createElement('textarea'),{rows:14,style:'width:100%;margin-top:8px'});
const cp=document.createElement('button'); cp.textContent='📋 copy'; cp.style.marginLeft='8px';
c.append(btn, cp, ta);

/* Canvas (compact preview) */
const W=Math.max(560, c.clientWidth-8), H=260, pad=10, cols=48;
let INSTR=[
  "Piccolo","Flute I","Flute II","Oboe I","Oboe II","Clarinet in Bb I","Clarinet in Bb II","Bassoon I","Bassoon II",
  "Horn in F I","Horn in F II","Trumpet in C I","Trumpet in C II","Trombone I","Trombone II","Tuba",
  "Violin I","Violin II","Viola","Violoncello","Contrabass"
]; // orden top→bottom
let rows=INSTR.length;
const cv=document.createElement('canvas'); cv.width=W; cv.height=H; cv.style.display='block'; cv.style.margin='8px 0'; c.appendChild(cv);
const g=cv.getContext('2d');

/* Color Newton 12 */
const hue=k=>(k%12)*(360/12);
const colOfSemitone=k=>`hsl(${hue(k)},90%,55%)`;

/* CA rules (sum 0..12 → {0,1,2,4}) */
const mapA=[0,1,4,0,0,2,4,0,1,4,0,0,2];     // 4200410 extendida
const mapB=[0,2,1,0,4,2,1,0,4,1,0,0,4];     // variante
const mapC=[0,1,2,4,0,2,4,1,2,4,0,1,2];     // triádica
let mix=0.25; // mezcla fija simple para esta versión

/* Sieve simple para alturas (puedes cambiar a tu criba) */
const MAJ=[0,2,4,5,7,9,11];
const pcOfCol=x=>MAJ[x%MAJ.length];

/* Estado CA en tiempo real */
let grid=[]; let prevRow=null;
const seedX=Math.floor(cols*0.45);
function pickMapValue(s, t){ // mezcla A↔B↔C en dos tramos
  if(t<=0.5){ const u=t/0.5; return (Math.random()<u?mapB:mapA)[s]??0; }
  const u=(t-0.5)/0.5; return (Math.random()<u?mapC:mapB)[s]??0;
}
function evolve(prev, t){
  const next=new Array(cols).fill(0);
  for(let x=0;x<cols;x++){
    const L=x>0?prev[x-1]:0, C=prev[x], R=x<cols-1?prev[x+1]:0;
    next[x]=pickMapValue(L+C+R,t);
  }
  return next;
}
function initGrid(){
  grid.length=0;
  for(let r=0;r<rows-1;r++) grid.push(new Array(cols).fill(0));
  const seed=new Array(cols).fill(0); seed[seedX]=1;
  grid.push(seed); prevRow=seed;
}
initGrid();

/* Mapeo pitch absoluto con clamp a rango legible (G3–E5 → MIDI 55..76) */
const clamp=(x,a,b)=>x<a?a: x>b?b: x;
const baseMidi=60; // ancla
function midiOfCell(r,x){
  const reg= baseMidi + Math.round((rows-1-r)*0.35); // pendiente suave por fila
  return clamp(reg + pcOfCol(x), 55, 76);            // clamp absoluto
}

/* Dibujo compact */
function draw(curRow){
  g.clearRect(0,0,W,H);
  const cw=(W-2*pad)/cols, ch=(H-2*pad)/rows;
  for(let r=0;r<rows;r++){
    for(let x=0;x<cols;x++){
      const v=grid[r][x]; if(!v) continue;
      const m=midiOfCell(r,x), pc=m%12;
      g.globalAlpha=(v===4?0.9: v===2?0.75: 0.6);
      g.fillStyle=colOfSemitone(pc);
      g.fillRect(pad+x*cw, pad+r*ch, cw*0.96, ch*0.92);
    }
  }
  if(typeof curRow==='number'){
    g.globalAlpha=0.18; g.fillStyle='#fff';
    g.fillRect(pad-2, pad+curRow*ch-2, W-2*pad+4, ch+4);
    g.globalAlpha=1;
  }
}
draw(rows-1);

/* Lily: absolute names, spacing to avoid collisions */
const NAMES=["c","cis","d","dis","e","f","fis","g","gis","a","ais","b"];
function lilyNameAbs(m){ const pc=((m%12)+12)%12, base=NAMES[pc], oct=Math.floor(m/12)-4; return base+(oct>0?"'".repeat(oct):",".repeat(-oct)); }

function makeLilyFromGrid(G){
  const header=`\\version "2.24.0"
\\paper{
  line-width = 160\\mm
  top-system-spacing.basic-distance = #14
  top-system-spacing.minimum-distance = #12
  system-system-spacing.basic-distance = #16
  system-system-spacing.minimum-distance = #14
  markup-system-spacing.padding = #6
}
\\layout{
  \\context{
    \\Score
    \\override NonMusicalPaperColumn.line-break-permission = ##t
  }
  \\context{
    \\Staff
    \\override VerticalAxisGroup.staff-staff-spacing.padding = #6
    \\override VerticalAxisGroup.nonstaff-relatedstaff-spacing.padding = #3
  }
}
\\header{ title = "CA Orchestral Sketch" composer = "after Xenakis (study)" tagline = ##f }
`;
  const beats="4"; // negra por columna
  const staves=[];
  for(let r=0;r<rows;r++){
    const instr=INSTR[r]||`Staff ${r+1}`;
    const tokens=[];
    for(let x=0;x<cols;x++){
      const v=G[r][x];
      if(!v){ tokens.push("r"+beats); continue; }
      const m=midiOfCell(r,x);
      tokens.push(lilyNameAbs(m)+beats);
    }
    const body=tokens.map((t,i)=> i>0 && i%4===0?("| "+t):t).join(" ");
    staves.push(
`  \\new Staff \\with { instrumentName = "${instr}" shortInstrumentName = "${instr}" }
  { \\absolute \\time 4/4 ${body} | }`);
  }
  return `${header}
\\score{
  <<
${staves.join("\n")}
  >>
  \\midi { }
}
`;
}

/* Audio opcional mínimo (silencioso por defecto para centrarse en export) */
let ac=null, run=false, tick=null; const bpm=96, beat=60/bpm;
function step(){
  if(!run) return;
  const next=evolve(prevRow, mix); prevRow=next; grid.push(next); if(grid.length>rows) grid.shift();
  draw(grid.length-1);
  ta.value=makeLilyFromGrid(grid);
  tick=setTimeout(step, beat*1000);
}

/* Handlers */
btn.onclick=async()=>{
  if(!run){
    run=true; btn.textContent='■ stop';
    initGrid(); draw(rows-1); ta.value=makeLilyFromGrid(grid);
    step();
  }else{
    run=false; btn.textContent='▶ start'; if(tick){clearTimeout(tick); tick=null;}
  }
};
cp.onclick=async()=>{ try{ await navigator.clipboard.writeText(ta.value); cp.textContent='✅'; setTimeout(()=>cp.textContent='📋 copy',900);}catch{cp.textContent='❌';} };

/* initial export */
ta.value=makeLilyFromGrid(grid);
```


## 5. Bibliografía
 
```bibtex
@inproceedings{Solomos2006,
  author = {Makis Solomos},
  title = {Cellular automata in Xenakis’s music. Theory and Practice},
  booktitle = {Definitive Proceedings of the International Symposium Iannis Xenakis},
  year = {2006},
  pages = {120--138},
  note = {Analiza Horos: código 4200410; mapeo 1/2/4 a familias; interpolaciones macroformales.}
}

@book{Xenakis1992,
  author = {Iannis Xenakis},
  title = {Formalized Music: Thought and Mathematics in Composition},
  edition = {2nd American ed.},
  year = {1992},
  publisher = {Pendragon Press},
  pages = {XII--XIII, 144--145, 182--200},
  note = {Prefacio sobre CA, sieves no octaviantes, entrevistas citadas en Solomos.}
}

@article{Wolfram1984,
  author = {Stephen Wolfram},
  title = {Cellular Automata},
  journal = {Scientific American},
  year = {1984},
  month = {Aug},
  pages = {190--201},
  note = {Divulgación y ejemplos de reglas multicategoría relacionadas con 4200410.}
}

```


```dataviewjs
// CA + WebAudio + WebRTC recording (canvas video + synth audio) → export .webm
// Buttons: ▶/■ audio+viz toggle, ⏺/⏹ record toggle, ⬇ download

/* ---------- UI ---------- */
const c=this.container;
const bPlay=document.createElement('button'); bPlay.textContent='▶ start';
const bRec=document.createElement('button'); bRec.textContent='⏺ rec'; bRec.style.marginLeft='8px';
const aSave=document.createElement('a'); aSave.textContent='⬇ download'; aSave.style.marginLeft='8px'; aSave.style.display='none';
c.append(bPlay,bRec,aSave);

/* ---------- Canvas (video source) ---------- */
const W=Math.max(560,c.clientWidth-8), H=320, pad=10, cols=64, rows=28;
const cv=document.createElement('canvas'); cv.width=W; cv.height=H; cv.style.display='block'; cv.style.margin='8px 0';
c.appendChild(cv); const g=cv.getContext('2d');

/* ---------- Simple 1D CA (visual only, fast) ---------- */
const hue=k=>(k%12)*(360/12), colOfSemitone=k=>`hsl(${hue(k)},90%,55%)`;
const MAJ=[0,2,4,5,7,9,11], pcOfCol=x=>MAJ[x%MAJ.length];
const mapA=[0,1,4,0,0,2,4,0,1,4,0,0,2];
let mix=0.25;
let grid=[], prevRow=null, seedX=Math.floor(cols*0.5);
function evolve(prev){ const n=new Array(cols).fill(0); for(let x=0;x<cols;x++){const L=x>0?prev[x-1]:0,C=prev[x],R=x<cols-1?prev[x+1]:0; n[x]=mapA[L+C+R]??0;} return n;}
function initGrid(){ grid.length=0; for(let r=0;r<rows-1;r++) grid.push(new Array(cols).fill(0)); const s=new Array(cols).fill(0); s[seedX]=1; grid.push(s); prevRow=s;}
initGrid();

function draw(curRow=-1){
  g.clearRect(0,0,W,H);
  const cw=(W-2*pad)/cols, ch=(H-2*pad)/rows;
  for(let r=0;r<rows;r++){
    for(let x=0;x<cols;x++){
      const v=grid[r][x]; if(!v) continue;
      const pc=pcOfCol(x), alpha=(v===4?0.9: v===2?0.75: 0.6);
      g.globalAlpha=alpha; g.fillStyle=colOfSemitone(pc);
      g.fillRect(pad+x*cw, pad+r*ch, cw*0.96, ch*0.92);
    }
  }
  if(curRow>=0){ g.globalAlpha=0.18; g.fillStyle='#fff'; const ch=(H-2*pad)/rows;
    g.fillRect(pad-2, pad+curRow*ch-2, W-2*pad+4, ch+4); g.globalAlpha=1; }
}
draw(rows-1);

/* ---------- WebAudio (synth mix) ---------- */
let ac=null, running=false, raf=0, tick=null;
let master=null, rv=null, comp=null, mediaDest=null; // MediaStreamDestination for recording
const ACTIVE=[];
const clamp=(x,a,b)=>x<a?a:x>b?b:x;
const baseMidi=60; const hz=m=>440*Math.pow(2,(m-69)/12);
function midiOfCell(r,x){ const reg=baseMidi+Math.round((rows-1-r)*0.35); return clamp(reg+pcOfCol(x),55,76); }

function mkReverb(ctx){ const con=ctx.createConvolver(); const L=ctx.sampleRate*1.4, b=ctx.createBuffer(2,L,ctx.sampleRate);
  for(let ch=0;ch<2;ch++){const d=b.getChannelData(ch); for(let i=0;i<L;i++) d[i]=(Math.random()*2-1)*Math.pow(1-i/L,3);} con.buffer=b; return con;}

function panFor(val){ if(val===1) return -0.4+(Math.random()-0.5)*0.2; if(val===2) return (Math.random()-0.5)*0.2; if(val===4) return 0.4+(Math.random()-0.5)*0.2; return 0; }
function playBrass(m,when,dur){
  const f=hz(m), o=ac.createOscillator(), sh=ac.createWaveShaper(), g=ac.createGain(), p=ac.createStereoPanner();
  const curve=new Float32Array(256); for(let i=0;i<256;i++){const x=i/128-1; curve[i]=Math.tanh(2.3*x);} sh.curve=curve;
  o.type='sawtooth'; o.frequency.value=f; p.pan.value=panFor(1);
  g.gain.setValueAtTime(0,when); g.gain.linearRampToValueAtTime(0.18,when+0.02); g.gain.exponentialRampToValueAtTime(1e-4,when+dur);
  o.connect(sh).connect(g).connect(p).connect(master); o.start(when); o.stop(when+dur+0.02); ACTIVE.push(o,g,p);
}
function playWinds(m,when,dur){
  const f=hz(m), c=ac.createOscillator(), mO=ac.createOscillator(), mg=ac.createGain(), g=ac.createGain(), p=ac.createStereoPanner();
  mO.frequency.value=3+Math.random()*6; mg.gain.value=f*0.015; c.frequency.value=f; p.pan.value=panFor(2);
  g.gain.setValueAtTime(0,when); g.gain.linearRampToValueAtTime(0.16,when+0.03); g.gain.exponentialRampToValueAtTime(1e-4,when+dur);
  mO.connect(mg).connect(c.frequency); c.connect(g).connect(p).connect(master);
  c.start(when); mO.start(when); c.stop(when+dur+0.02); mO.stop(when+dur+0.02); ACTIVE.push(c,mO,g,p);
}
function playStrings(m,when,dur){
  const f=hz(m), o=ac.createOscillator(), bp=ac.createBiquadFilter(), g=ac.createGain(), p=ac.createStereoPanner();
  bp.type='bandpass'; bp.frequency.value=f; bp.Q.value=8; o.type='sawtooth'; o.frequency.value=f; p.pan.value=panFor(4);
  g.gain.setValueAtTime(0,when); g.gain.linearRampToValueAtTime(0.14,when+0.04); g.gain.exponentialRampToValueAtTime(1e-4,when+dur);
  o.connect(bp).connect(g).connect(p).connect(master); o.start(when); o.stop(when+dur+0.02); ACTIVE.push(o,bp,g,p);
}

/* ---------- Animation + Scheduling ---------- */
const bpm=96, beat=60/bpm;
function animate(){ if(!running) return; draw(grid.length-1); raf=requestAnimationFrame(animate); }
function step(){
  if(!running) return;
  const next=evolve(prevRow); prevRow=next; grid.push(next); if(grid.length>rows) grid.shift();
  // play last row as chord
  const rIdx=grid.length-1; const when=ac.currentTime+0.02; const dur=beat*0.9;
  for(let x=0;x<cols;x++){
    const v=grid[rIdx][x]; if(!v) continue; const m=midiOfCell(rIdx,x);
    if(v===1) playBrass(m,when,dur); else if(v===2) playWinds(m,when,dur); else if(v===4) playStrings(m,when,dur);
  }
  tick=setTimeout(step, beat*1000);
}

/* ---------- WebRTC: capture canvas + audio → MediaRecorder ---------- */
let rec=null, chunks=[];
function setupRecorder(){
  const fps=30;
  const vs=cv.captureStream(fps); // video
  const as=mediaDest.stream;      // audio from WebAudio
  // merge tracks
  const ms=new MediaStream();
  vs.getVideoTracks().forEach(t=>ms.addTrack(t));
  as.getAudioTracks().forEach(t=>ms.addTrack(t));
  const mime = MediaRecorder.isTypeSupported('video/webm;codecs=vp9,opus')
    ? 'video/webm;codecs=vp9,opus'
    : MediaRecorder.isTypeSupported('video/webm;codecs=vp8,opus')
      ? 'video/webm;codecs=vp8,opus'
      : 'video/webm';
  rec=new MediaRecorder(ms,{mimeType:mime, videoBitsPerSecond:4_000_000});
  rec.ondataavailable=e=>{ if(e.data&&e.data.size) chunks.push(e.data); };
  rec.onstop=()=>{
    const blob=new Blob(chunks,{type:mime}); chunks=[];
    const url=URL.createObjectURL(blob);
    aSave.href=url; aSave.download='ca_export.webm';
    aSave.style.display='inline-block';
  };
}

/* ---------- Controls ---------- */
bPlay.onclick=async()=>{
  if(!ac){
    ac=new (window.AudioContext||window.webkitAudioContext)(); await ac.resume();
    master=ac.createGain(); master.gain.value=0.3;
    rv=mkReverb(ac); comp=ac.createDynamicsCompressor(); comp.threshold.value=-18; comp.knee.value=18; comp.ratio.value=2.5;
    mediaDest=ac.createMediaStreamDestination(); // recorder sink
    // split: to speakers and to recorder
    master.connect(rv).connect(comp).connect(ac.destination);
    master.connect(mediaDest);
    running=true; bPlay.textContent='■ stop';
    initGrid(); draw(rows-1);
    animate(); step();
  }else{
    running=false; bPlay.textContent='▶ start';
    if(raf){cancelAnimationFrame(raf); raf=0;}
    if(tick){clearTimeout(tick); tick=null;}
    while(ACTIVE.length){ const n=ACTIVE.pop(); try{n.stop?n.stop():n.disconnect();}catch{} }
    try{ master.disconnect(); rv.disconnect(); comp.disconnect(); }catch{}
    if(rec && rec.state==='recording'){ rec.stop(); bRec.textContent='⏺ rec'; }
    await ac.close().catch(()=>{}); ac=null; master=null; rv=null; comp=null; mediaDest=null;
  }
};

bRec.onclick=()=>{
  if(!ac || !mediaDest){ alert('Start first.'); return; }
  if(!rec){ setupRecorder(); }
  if(rec.state!=='recording'){ chunks=[]; rec.start(200); bRec.textContent='⏹ stop'; aSave.style.display='none';
  } else { rec.stop(); bRec.textContent='⏺ rec'; }
};
```



---


# ejemplo melo gattacca

```dataviewjs
// === PARÁMETROS ===
const pitches = ["c'", "cis'", "d'", "dis'", "e'", "f'", "fis'", "g'", "gis'", "a'", "ais'", "b'"];
const rhythms = ["16", "16", "\\tuplet 3/2 { 16 16 16 }", "8", "\\tuplet 3/2 { 8 8 8 }"];
const defaultAdn = "AGAATTACCCACCGGAAAAATTTCCAAACCATT";

// === ESTILO ===
const style = `
<style>
.melody-box {
  display: flex;
  flex-direction: column;
  gap: 10px;
  font-family: monospace;
}
textarea {
  width: 100%;
  height: 200px;
  font-size: 14px;
}
button {
  padding: 6px 12px;
  font-size: 14px;
  margin-right: 10px;
}
.controls {
  display: flex;
  flex-direction: row;
  align-items: center;
}
</style>
`;
dv.container.innerHTML += style;

// === CONTENEDOR ===
const container = document.createElement("div");
container.className = "melody-box";
dv.container.appendChild(container);

// === TEXTAREA ===
const textArea = document.createElement("textarea");
textArea.value = "";
container.appendChild(textArea);

// === INPUT ADN ===
const input = document.createElement("input");
input.type = "text";
input.value = defaultAdn;
input.placeholder = "ADN (ej. AGAATTAC...)";
container.appendChild(input);

// === BOTONES ===
const controls = document.createElement("div");
controls.className = "controls";

const genButton = document.createElement("button");
genButton.textContent = "Generar";

const copyButton = document.createElement("button");
copyButton.textContent = "Copiar";

controls.appendChild(genButton);
controls.appendChild(copyButton);
container.appendChild(controls);

// === FUNCIONES ===
function getRandom(array) {
  return array[Math.floor(Math.random() * array.length)];
}

function generateLilypond(adn) {
  let notes = adn.split("").map(() => {
    const pitch = getRandom(pitches);
    const rhythm = getRandom(rhythms);
    return `${pitch}${rhythm}`;
  });

  // Agrupar en compases de forma sencilla (cada ~8 notas)
  let measures = [];
  for (let i = 0; i < notes.length; i += 8) {
    measures.push(notes.slice(i, i + 8).join(" "));
  }

  return `
\\version "2.24.2"
\\score {
  \\new Staff {
    \\relative c' {
      ${measures.join(" |\n      ")} |
    }
  }
}`.trim();
}

// === EVENTOS ===
genButton.onclick = () => {
  const adn = input.value.toUpperCase().replace(/[^AGCT]/g, "");
  const lily = generateLilypond(adn);
  textArea.value = lily;
};

copyButton.onclick = () => {
  navigator.clipboard.writeText(textArea.value);
};
```


