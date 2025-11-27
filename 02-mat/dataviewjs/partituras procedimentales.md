

# con ABC guido




```dataviewjs
(()=> {
  // === 1) Ruta relativa en el vault (ajustá esto) ===
  const ABC_LOCAL_PATH = "05-obs/lib/abcjs.js"; // p.ej. "assets/libs/abcjs-basic-min.js"

  // === 2) Helpers ===
  function getVaultUrl(vaultRelPath){
    // Usa la API de Obsidian para generar una URL app:// segura del archivo
    const f = app.vault.getAbstractFileByPath(vaultRelPath);
    if(!f){ throw new Error("No existe el archivo en el vault: "+vaultRelPath); }
    return app.vault.adapter.getResourcePath(f.path);
  }
  function loadScriptUrl(url){
    return new Promise((res, rej)=>{
      const s=document.createElement("script");
      s.src=url; s.onload=()=>res(true);
      s.onerror=()=>rej(new Error("No pude cargar: "+url));
      document.head.appendChild(s);
    });
  }

  // === 3) UI mínima ===
  const wrap = dv.el("div","");
  wrap.innerHTML = `
    <style>.msg{font:12px system-ui;color:var(--text-muted)}</style>
    <div class="msg" id="msg">Resolviendo ruta…</div>
    <div id="score"></div>
  `;
  const msg = wrap.querySelector("#msg");
  const score = wrap.querySelector("#score");

  // === 4) ABC de prueba (Do mayor) ===
  const ABC = [
    "X:1",
    "T:Do M",
    "M:4/4",
    "L:1/8",
    "K:C",
    "C D E F | G A B c |"
  ].join("\n");

  // === 5) Flow ===
  (async () => {
    try{
      const url = getVaultUrl(ABC_LOCAL_PATH); // <-- URL app://… correcta
      msg.textContent = "Cargando abcjs desde: "+url;
      await loadScriptUrl(url);
      if(!window.ABCJS) throw new Error("ABCJS no se expuso en window");
      msg.textContent = "abcjs cargado ✓";
      window.ABCJS.renderAbc(score, ABC, { add_classes:true, staffwidth: 680 });
    }catch(e){
      msg.textContent = "Error: "+e.message;
    }
  })();
})();
```

# con vexFlow

```dataviewjs
(()=> {
  // --- Ruta local al bundle UMD de VexFlow (NO cjs/ ni esm/) ---
  const VEX_LOCAL_PATH = "05-obs/lib/vexflow.js"; // ← ajustá según tu vault

  // Helpers mínimos: resolver URL del vault y cargar script
  function getVaultUrl(rel){
    const f = app.vault.getAbstractFileByPath(rel);
    if(!f) throw new Error("No existe en el vault: "+rel);
    return app.vault.adapter.getResourcePath(f.path);
  }
  function loadScript(url){
    return new Promise((res,rej)=>{
      const s=document.createElement("script");
      s.src=url; s.onload=()=>res(); s.onerror=()=>rej(new Error("No pude cargar: "+url));
      document.head.appendChild(s);
    });
  }

  // Contenedor
  const out = dv.el("div","");

  // Flujo: cargar lib → dibujar
  (async () => {
    if(!(window.Vex && window.Vex.Flow)){
      const url = getVaultUrl(VEX_LOCAL_PATH);
      await loadScript(url);
    }
    const VF = window.Vex.Flow;

    // Renderer SVG
    const renderer = new VF.Renderer(out, VF.Renderer.Backends.SVG);
    renderer.resize(720, 200);
    const ctx = renderer.getContext();

    // Pentagrama
    const stave = new VF.Stave(20, 40, 680);
    stave.addClef("treble").addTimeSignature("4/4");
    stave.setContext(ctx).draw();

    // Escala de Do mayor en negras: C D E F G A B C
    const notes = [
      new VF.StaveNote({ keys:["c/4"], duration:"q" }),
      new VF.StaveNote({ keys:["d/4"], duration:"q" }),
      new VF.StaveNote({ keys:["e/4"], duration:"q" }),
      new VF.StaveNote({ keys:["f/4"], duration:"q" }),
      new VF.StaveNote({ keys:["g/4"], duration:"q" }),
      new VF.StaveNote({ keys:["a/4"], duration:"q" }),
      new VF.StaveNote({ keys:["b/4"], duration:"q" }),
      new VF.StaveNote({ keys:["c/5"], duration:"q" }),
    ];

    // Voz + formateo + dibujo
    const voice = new VF.Voice({ num_beats: 8, beat_value: 4 });
    voice.addTickables(notes);
    new VF.Formatter().joinVoices([voice]).format([voice], 600);
    voice.draw(ctx, stave);
  })();
})();
```


### pseudo lilypond rendereando en vexflow

```dataviewjs
(()=> {
  // === Ruta local al bundle UMD de VexFlow (ajustá a tu vault) ===
  const VEX_LOCAL_PATH = "05-obs/lib/vexflow.js";

  // --- Helpers mínimos para cargar desde el vault ---
  function getVaultUrl(rel){
    const f = app.vault.getAbstractFileByPath(rel);
    if(!f) throw new Error("No existe en el vault: "+rel);
    return app.vault.adapter.getResourcePath(f.path);
  }
  function loadScript(url){
    return new Promise((res,rej)=>{
      const s=document.createElement("script");
      s.src=url; s.onload=()=>res(); s.onerror=()=>rej(new Error("No pude cargar: "+url));
      document.head.appendChild(s);
    });
  }

  // --- UI mínima: editor + render ---
  const wrap = dv.el("div","");
  wrap.innerHTML =
    '<style>.mini{font:12px system-ui;color:var(--text-muted)} .row{margin:6px 0} .code{width:100%;height:120px;font:12px ui-monospace,monospace}</style>'+
    '<div class="row"><textarea id="src" class="code"></textarea></div>'+
    '<div class="row"><button id="render">Render</button> <span id="msg" class="mini"></span></div>'+
    '<div id="out"></div>';
  const ta = wrap.querySelector("#src");
  const msg = wrap.querySelector("#msg");
  const out = wrap.querySelector("#out");

  // --- Ejemplo de entrada tipo LilyPond muy básico ---
  ta.value = [
    '\\title "Escala de Do Mayor"',
    '\\clef treble',
    '\\time 4/4',
    '\\tempo 4=96',
    'c4 d e f | g a b c\'',
    '\\p c\'4 d\' e\' f\' \\< g\' a\' b\' c\'\' \\! \\ff',
    'r4 r4 c4. d8'
  ].join('\n');

  // --- Parser simple ---
  function parse(src){
    const lines = src.split(/\r?\n/).map(s=>s.trim()).filter(Boolean);
    const meta = { title:null, clef:'treble', time:'4/4', tempo:'4=96' };
    const tokens = [];
    for(const line of lines){
      let m;
      if((m=line.match(/^\\title\s+"([^"]+)"/))) { meta.title=m[1]; continue; }
      if((m=line.match(/^\\clef\s+(treble|bass)/))) { meta.clef=m[1]; continue; }
      if((m=line.match(/^\\time\s+(\d+\/\d+)/))) { meta.time=m[1]; continue; }
      if((m=line.match(/^\\tempo\s+(.+)/))) { meta.tempo=m[1]; continue; }
      // resto
      for(const tok of line.split(/\s+/)){
        if(tok==='|') tokens.push({type:'bar'});
        else tokens.push({type:'tok', v:tok});
      }
    }
    return { meta, tokens };
  }

  // --- Compilación a VexFlow ---
  function compileToVF(ast, VF){
    const notes = [];
    const hairpins = []; // {startIdx,endIdx,type}
    let dynPending = null;
    let hairpinStart = null, hairpinType = null;

    const durMap = { '1':'w', '2':'h', '4':'q', '8':'8', '16':'16' };

    function makeNote(sym){
      if(sym[0]==='r'){ // silencio
        const m = sym.match(/^r(\d+)(\.*)?$/);
        const dnum = (m && m[1]) || '4';
        const dots = m && m[2] ? m[2].length : 0;
        const dur = (durMap[dnum]||'q')+'r';
        const n = new VF.StaveNote({ keys:['b/4'], duration:dur, clef:ast.meta.clef });
        for(let i=0;i<dots;i++) VF.Dot.buildAndAttach([n], { all: true });
        if(dynPending){
          n.addModifier(new VF.Annotation(dynPending)
            .setFont("Times", 12)
            .setVerticalJustification(VF.Annotation.VerticalJustify.BOTTOM), 0);
          dynPending=null;
        }
        return n;
      }
      const m = sym.match(/^([a-gA-G])([#bn]?)([',]*)(\d+)?(\.*)?$/);
      if(!m) return null;
      const letter = m[1].toLowerCase();
      const acc = m[2]||'';
      const octMods = m[3]||'';
      const dnum = m[4]||'4';
      const dots = m[5]? m[5].length : 0;

      let oct = 4;
      for(let i=0;i<octMods.length;i++){
        const ch = octMods[i];
        if(ch=="'") oct++;
        else if(ch==",") oct--;
      }
      const key = letter + '/' + oct;
      const dur = durMap[dnum]||'q';
      const n = new VF.StaveNote({ keys:[key], duration:dur, clef:ast.meta.clef });
      if(acc){
        const amap = { '#':'#', 'b':'b', 'n':'n' };
        n.addAccidental(0, new VF.Accidental(amap[acc]));
      }
      for(let i=0;i<dots;i++) VF.Dot.buildAndAttach([n], { all: true });
      if(dynPending){
        n.addModifier(new VF.Annotation(dynPending)
          .setFont("Times", 12)
          .setVerticalJustification(VF.Annotation.VerticalJustify.BOTTOM), 0);
        dynPending=null;
      }
      return n;
    }

    for(const t of ast.tokens){
      if(t.type==='bar') continue;
      const v=t.v;

      // dinámicas
      if(/^\\(pp|p|mp|mf|f|ff)$/.test(v)){ dynPending = v.slice(1); continue; }
      // hairpins
      if(v==='\\<' || v==='\\>'){ hairpinStart = notes.length; hairpinType = (v==='\\<') ? "crescendo" : "decrescendo"; continue; }
      if(v==='\\!'){
        const end = notes.length-1;
        if(hairpinStart!=null && end>=hairpinStart){
          hairpins.push({ startIdx: hairpinStart, endIdx: end, type: hairpinType });
        }
        hairpinStart=null; hairpinType=null; continue;
      }

      const n = makeNote(v);
      if(n) notes.push(n);
    }

    return { notes, hairpins };
  }

  // --- Render ---
  async function render(){
    msg.textContent = "";
    if(!(window.Vex && window.Vex.Flow)){
      const url = getVaultUrl(VEX_LOCAL_PATH);
      await loadScript(url);
    }
    const VF = window.Vex.Flow;

    const ast = parse(ta.value);
    const comp = compileToVF(ast, VF);

    out.innerHTML = "";
    const renderer = new VF.Renderer(out, VF.Renderer.Backends.SVG);
    renderer.resize(780, 260);
    const ctx = renderer.getContext();

    // Título / tempo
    if(ast.meta.title){ ctx.setFont("Arial", 14, ""); ctx.fillText(ast.meta.title, 300, 20); }
    if(ast.meta.tempo){ ctx.setFont("Arial", 12, ""); ctx.fillText("♩ = "+ast.meta.tempo, 120, 36); }

    // Stave
    const stave = new VF.Stave(20, 48, 740);
    stave.addClef(ast.meta.clef);
    if(ast.meta.time) stave.addTimeSignature(ast.meta.time);
    stave.setContext(ctx).draw();

    // Voz (no validamos compases, es un demo)
    const voice = new VF.Voice({ num_beats: 4, beat_value: 4 }).setMode(VF.Voice.Mode.SOFT);
    voice.addTickables(comp.notes);
    new VF.Formatter().joinVoices([voice]).format([voice], 660);
    voice.draw(ctx, stave);

    // Hairpins (usar strings en VexFlow 4)
    for(const hp of comp.hairpins){
      const h = new VF.StaveHairpin(
        { first_note: comp.notes[hp.startIdx], last_note: comp.notes[hp.endIdx] },
        hp.type // "crescendo" | "decrescendo"
      );
      h.setContext(ctx).setRenderOptions({ y_shift: 25 }).draw();
    }
  }

  wrap.querySelector("#render").addEventListener("click", ()=>{ render().catch(e=> msg.textContent=e.message); });
  render().catch(e=> msg.textContent=e.message);
})();
```



# con lilypond


## render desde dataviewjs


```dataviewjs
(()=>{
  // === CONFIG RÁPIDA ===
  const LILY_DIR  = "05-obs/lib";    // carpeta vigilada por tu watcher
  const LY_NAME   = "score";         // base de archivo (score.ly, score.svg)
  const widthCm   = 20;              // ancho del papel en cm
  const heightCm  = 5;               // alto del papel en cm

  // Partitura LilyPond (editá esta variable)
  const lilyScore = `
\\version "2.24.0"
\\header { title = "Escala de Do Mayor (JS→LilyPond→SVG)" }
\\paper {
  tagline = ##f
  paper-width  = #(* ${widthCm} cm)
  paper-height = #(* ${heightCm} cm)
  system-count = #1
}
\\score {
  \\relative c' {
    \\clef treble
    \\key c \\major
    \\time 4/4
    \\tempo 4 = 120
    c d eis f | g aes b c
  }
  \\layout { }
}
`.trim();

  // === HELPER OBSIDIAN: rutas + guardar ===
  const LY_PATH  = `${LILY_DIR}/${LY_NAME}.ly`;
  const SVG_PATH = `${LILY_DIR}/${LY_NAME}.svg`;
  const wrap = dv.el("div","");
  wrap.innerHTML = `<div id="msg" style="font:12px system-ui;color:var(--text-muted)"></div><div id="svg"></div>`;
  const msg = wrap.querySelector("#msg"), svgDiv = wrap.querySelector("#svg");

  function getVaultUrl(rel){
    const f = app.vault.getAbstractFileByPath(rel);
    return f ? app.vault.adapter.getResourcePath(f.path) : null;
  }

  async function ensureFolder(folder){
    if(!app.vault.getAbstractFileByPath(folder)) await app.vault.createFolder(folder);
  }

  async function saveLy(text){
    await ensureFolder(LILY_DIR);
    const f = app.vault.getAbstractFileByPath(LY_PATH);
    if(!f) await app.vault.create(LY_PATH, text); else await app.vault.modify(f, text);
  }

  function showSvgOrWait(retries=20, delay=500){
    const url = getVaultUrl(SVG_PATH);
    if(url){
      const bust = url + "?t=" + Date.now();
      svgDiv.innerHTML = `<img alt="partitura" src="${bust}" style="max-width:100%;border:1px solid var(--background-modifier-border)"/>`;
      msg.textContent = `Mostrando ${SVG_PATH}`;
    } else if(retries>0){
      msg.textContent = `Esperando SVG… (watcher LilyPond)`;
      setTimeout(()=>showSvgOrWait(retries-1, delay), delay);
    } else {
      msg.textContent = `No se encontró ${SVG_PATH}. ¿Está corriendo el watcher lilypond --svg?`;
    }
  }

  // === FLUJO: guardar .ly y mostrar .svg ===
  (async ()=>{
    await saveLy(lilyScore);
    msg.textContent = `Guardado ${LY_PATH} · compilando…`;
    showSvgOrWait(); // intenta cargar el SVG y reintenta un rato
  })().catch(e=> msg.textContent = e.message);
})();
```




# con node wrapper de lilypond

en bash

```bash
 node "/Users/zztt/Library/Mobile Documents/iCloud~md~obsidian/Documents/cym/05-obs/lib/lily-watch.js"  "/Users/zztt/Library/Mobile Documents/iCloud~md~obsidian/Documents/cym/05-obs/lib" --bin "/opt/homebrew/bin/lilypond"
```

luego ejecutar el dataviewjs

```dataviewjs
(()=>{
  // === CONFIG RÁPIDA ===
  const LILY_DIR  = "05-obs/lib";    // carpeta vigilada por tu watcher
  const LY_NAME   = "score";         // base de archivo (score.ly, score.svg)
  const widthCm   = 20;              // ancho del papel en cm
  const heightCm  = 5;               // alto del papel en cm

  // Partitura LilyPond (editá esta variable)
  const lilyScore = `
\\version "2.24.0"
\\header { title = "Escala de Do Mayor (JS→LilyPond→SVG)" }
\\paper {
  tagline = ##f
  paper-width  = #(* ${widthCm} cm)
  paper-height = #(* ${heightCm} cm)
  system-count = #1
}
\\score {
  \\relative c' {
    \\clef bass
    \\key c \\major
    \\time 4/4
    \\tempo 4 = 80
    cis d e f | g a b c
  }
  \\layout { }
}
`.trim();

  // === HELPER OBSIDIAN: rutas + guardar ===
  const LY_PATH  = `${LILY_DIR}/${LY_NAME}.ly`;
  const SVG_PATH = `${LILY_DIR}/${LY_NAME}.svg`;
  const wrap = dv.el("div","");
  wrap.innerHTML = `<div id="msg" style="font:12px system-ui;color:var(--text-muted)"></div><div id="svg"></div>`;
  const msg = wrap.querySelector("#msg"), svgDiv = wrap.querySelector("#svg");

  function getVaultUrl(rel){
    const f = app.vault.getAbstractFileByPath(rel);
    return f ? app.vault.adapter.getResourcePath(f.path) : null;
  }

  async function ensureFolder(folder){
    if(!app.vault.getAbstractFileByPath(folder)) await app.vault.createFolder(folder);
  }

  async function saveLy(text){
    await ensureFolder(LILY_DIR);
    const f = app.vault.getAbstractFileByPath(LY_PATH);
    if(!f) await app.vault.create(LY_PATH, text); else await app.vault.modify(f, text);
  }

  function showSvgOrWait(retries=20, delay=500){
    const url = getVaultUrl(SVG_PATH);
    if(url){
      const bust = url + "?t=" + Date.now();
      svgDiv.innerHTML = `<img alt="partitura" src="${bust}" style="max-width:100%;border:1px solid var(--background-modifier-border)"/>`;
      msg.textContent = `Mostrando ${SVG_PATH}`;
    } else if(retries>0){
      msg.textContent = `Esperando SVG… (watcher LilyPond)`;
      setTimeout(()=>showSvgOrWait(retries-1, delay), delay);
    } else {
      msg.textContent = `No se encontró ${SVG_PATH}. ¿Está corriendo el watcher lilypond --svg?`;
    }
  }

  // === FLUJO: guardar .ly y mostrar .svg ===
  (async ()=>{
    await saveLy(lilyScore);
    msg.textContent = `Guardado ${LY_PATH} · compilando…`;
    showSvgOrWait(); // intenta cargar el SVG y reintenta un rato
  })().catch(e=> msg.textContent = e.message);
})();
```



