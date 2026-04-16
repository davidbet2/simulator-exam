---
name: lottie-animation-scripter
description: >
  Diseña y genera animaciones Lottie profesionales frame-by-frame a partir de
  imágenes PNG estáticas. Produce: guión de escenas detallado, prompts de imagen
  para Gemini/ChatGPT, y el JSON Lottie final listo para producción.
  Uso: "crea animación de X", "guión lottie para Y", "anima estas imágenes".
argument-hint: "<descripción del personaje o concepto a animar>"
allowed-tools: Read Write Grep Glob
---

# Skill: Lottie Animation Scripter

## Cuándo se Activa

- "crea una animación de X"
- "quiero animar [personaje/mascota/elemento]"
- "guión lottie para X"
- "cuántos frames necesito para animar X"
- "anima estas imágenes como Lottie"
- "crea el prompt para Gemini/ChatGPT de esta animación"

---

## Filosofía de Diseño

Una animación profesional se construye sobre tres pilares:

```
1. STORYTELLING   → Cada frame cuenta un micro-momento de la historia
2. EASING         → Los movimientos siguen curvas de aceleración, no son lineales
3. ANTICIPATION   → Siempre hay una pose de "antes" que da intención al movimiento
```

**Regla de oro:** No limitar el número de frames por economía. Usar tantos como la fluidez requiera. Una animación de 8 frames bien diseñada es superior a una de 3 mal espaciada.

---

## Flujo de Ejecución (6 fases — en orden estricto)

```
FASE 1: ANÁLISIS DE INTENCIÓN
      ↓
FASE 2: DISEÑO DEL GUIÓN DE ESCENAS
      ↓
FASE 3: MAPA DE TIMING
      ↓
FASE 4: PROMPTS DE IMAGEN POR FRAME
      ↓
FASE 5: GENERACIÓN DEL JSON LOTTIE
      ↓
FASE 6: VALIDACIÓN Y ENTREGA
```

---

## FASE 1 — Análisis de Intención

Antes de diseñar cualquier frame, responde estas preguntas:

| Pregunta | Propósito |
|---|---|
| ¿Cuál es la acción principal que se anima? | Define el arco narrativo |
| ¿Cuánto debe durar la animación total? | Define el presupuesto de frames |
| ¿Es loop o one-shot? | Loop: inicio = fin; One-shot: hay un estado final |
| ¿Qué emoción debe transmitir? | Define las expresiones en cada frame |
| ¿Hay objetos secundarios (props)? | Requieren frames adicionales |
| ¿Cuál es el contexto de uso (hero, botón, estado)? | Define velocidad y énfasis |

**Output esperado de esta fase:** Una oración que resume: `[Personaje] hace [acción] transmitiendo [emoción], dura [X] segundos, es [loop/one-shot]`

---

## FASE 2 — Diseño del Guión de Escenas

### Principios de Animación Profesional Aplicados

```
ANTICIPATION    → Frame de preparación antes de la acción principal
SQUASH/STRETCH  → El objeto se deforma levemente en el punto de máximo impacto
FOLLOW-THROUGH  → El movimiento no para abruptamente — tiene cola
SECONDARY ACTION → Elementos secundarios reaccionan al movimiento principal
STAGING         → Cada frame tiene un propósito narrativo claro
```

### Tabla de Escenas (llenar para cada animación)

Cada fila es un frame PNG a generar:

| # | Nombre del Frame | Archivo | Descripción de Pose | Duración (frames @60fps) | Tipo |
|---|---|---|---|---|---|
| 1 | IDLE/REST | `anim_f01.png` | Pose de reposo antes de la acción | variable | Anticipation |
| 2 | ANTICIPATION | `anim_f02.png` | Pose contraria a la acción (carga) | 8-15 frames | Hold |
| 3 | ACTION_START | `anim_f03.png` | Inicio del movimiento principal | 5-10 frames | Action |
| 4 | ACTION_PEAK | `anim_f04.png` | Momento de máxima acción / climax | 5-8 frames | Squash/Stretch |
| 5 | FOLLOW_THROUGH | `anim_f05.png` | El movimiento tiene inercia / rebota | 8-12 frames | Follow-through |
| 6 | SECONDARY_REACT | `anim_f06.png` | Elemento secundario reacciona | 5-10 frames | Secondary |
| 7 | SETTLE | `anim_f07.png` | El personaje "aterriza" en la pose final | 10-15 frames | Ease-out |
| 8 | FINAL/HOLD | `anim_f08.png` | Pose final sostenida | 15-30 frames | Hold |

> **Nota:** No todas las animaciones requieren los 8. Usar el mínimo que produzca fluidez. Para acciones simples: 5 frames. Para acciones complejas: 8-12 frames.

### Templates de Guión por Tipo de Animación

#### Template A: Celebración / Victoria (5-8 frames)
```
F1: REPOSO        → personaje sereno, neutro
F2: ANTICIPACIÓN  → cuerpo tenso, preparándose
F3: LANZAMIENTO   → máximo esfuerzo, objeto en movimiento
F4: CLIMAX        → punto de mayor expresión
F5: FOLLOW-THROUGH → cuerpo continúa el movimiento por inercia
F6: SETTLE        → cuerpo vuelve a equilibrio
F7: VICTORIA      → pose final orgullosa (loop point si es loop)
```

#### Template B: Error / Negación (4-6 frames)
```
F1: REPOSO        → expresión normal
F2: IMPACTO       → sorpresa inicial (ojos abiertos, cuerpo rígido)
F3: REACCIÓN      → expresión de error (ceño, sudor)
F4: SHAKE_LEFT    → sacudida izquierda
F5: SHAKE_RIGHT   → sacudida derecha
F6: RECOVER       → vuelve al centro, expresión resignada
```

#### Template C: Idle / Flotación (3-5 frames, loop)
```
F1: NEUTRAL       → posición central
F2: UP            → posición alta (acento hacia arriba)
F3: DOWN          → posición baja
[ loop back to F1 ]
```

#### Template D: Entrada / Aparición (5-7 frames, one-shot)
```
F1: TINY          → escala 0%, invisible
F2: OVERSHOOT     → escala 120%, con squash
F3: BOUNCE_BACK   → escala 90%
F4: SETTLE        → escala 100%, estable
F5: REACT         → elemento secundario reacciona a la entrada
F6: HOLD          → pose final
```

#### Template E: Transformación / Cambio (6-10 frames)
```
F1: ESTADO_A      → estado inicial del personaje
F2: INICIO_TRANS  → primer signo de cambio
F3: MITAD_TRANS   → mitad de la transformación
F4: CLIMAX_TRANS  → punto de mayor distorsión/cambio
F5: EMERGENCIA    → nuevo estado emerges
F6: SETTLE        → nuevo estado se estabiliza
F7: ESTADO_B      → estado final consolidado
```

---

## FASE 3 — Mapa de Timing

Una vez definidas las escenas, mapear los frames a fotogramas Lottie:

### Principios de Timing Profesional

```
SLOW IN / SLOW OUT: Los movimientos aceleran al inicio y desaceleran al final
HOLD ON ACTION:     Las poses importantes duran más (mínimo 8 frames a 60fps)
SMEAR FRAME:        El frame de transición rápida puede ser borroso/exagerado
```

### Tabla de Timing (plantilla)

```
fps: 60
duración total: [X] segundos = [X * 60] frames

FRAME    IP    OP    DURACIÓN    TIPO DE TRANSICIÓN
-------  ----  ----  ----------  -------------------
f01      0     20    0.33s       ease-in → f02
f02      20    35    0.25s       snap → f03
f03      35    50    0.25s       ease-out → f04
f04      50    65    0.25s       hold → f05
f05      65    90    0.42s       ease-out → f06
f06      90    110   0.33s       ease-in-out → f07
f07      110   140   0.50s       ease-out → f08
f08      140   180   0.67s       hold (loop point)
```

### Tabla de Easing Curves para Lottie

| Tipo de movimiento | ix | iy | ox | oy | Sensación |
|---|---|---|---|---|---|
| Lineal | 0.5 | 0.5 | 0.5 | 0.5 | Mecánico, robótico |
| Ease suave | 0.4 | 0.0 | 0.6 | 1.0 | Natural, orgánico |
| Spring (entrada) | 0.2 | 1.8 | 0.8 | -0.8 | Elástico, cartoon |
| Snap (salida) | 0.0 | 0.9 | 0.1 | 1.0 | Impacto, duro |
| Bounce | 0.3 | 2.0 | 0.7 | -1.2 | Rebote exagerado |
| Suave orbital | 0.45 | 0.05 | 0.55 | 0.95 | Animación de UI |

---

## FASE 4 — Prompts de Imagen por Frame

### Estructura del Prompt para Cada Frame

```
[PROMPT BASE shared por todos los frames]
+
[DESCRIPCIÓN DE POSE específica de este frame]
+
[INSTRUCCIÓN DE CONTINUIDAD — "mantener consistencia con frame N anterior"]
+
[ESPECIFICACIONES TÉCNICAS — siempre PNG RGBA, dimensiones, estilo]
```

### Plantilla de Prompt Base (para cualquier personaje)

```
[Nombre del personaje], [descripción del personaje en 1 frase].
Estilo: flat design cartoon 2D, similar a Duolingo.
Paleta estricta: [listar colores HEX por elemento].
Canvas: [W]×[H] píxeles, fondo 100% TRANSPARENTE (PNG-32 con canal alpha).
Personaje centrado, ocupa el [X]% del canvas.
Sin fondos, sin sombras al suelo, sin gradientes complejos.
Mantener exactamente la misma apariencia del personaje que en el frame anterior.
ESTE ES EL FRAME [N] DE [TOTAL].
```

### Reglas de Consistencia entre Frames

```
ANATOMÍA:    Mismas proporciones, mismo tamaño relativo, mismo estilo
COLORES:     Usar los HEX exactos de la paleta — no variar nunca
ACCESORIOS:  Los objetos siempre presentes deben estar en todos los frames
LÍNEA:       Mismo grosor de línea de contorno en todos los frames
EXPRESIÓN:   Cambiar solo lo necesario para comunicar el micro-momento
```

### Instrucción de Continuidad (pegar siempre entre frames)

```
IMPORTANTE: Esta imagen forma parte de una secuencia de animación.
El personaje debe verse IDÉNTICO en anatomía, proporciones y estilo al frame anterior.
Solo cambia la pose/expresión descrita. Mantén exactamente:
- Mismas proporciones corporales
- Mismos colores HEX
- Mismo grosor de líneas
- Mismos accesorios visibles
```

---

## FASE 5 — Generación del JSON Lottie

### Script Node.js Generador (multi-frame profesional)

```javascript
// Uso: node generate-lottie.js
// Requiere los PNG en: public/[nombre-anim]/frames/
const fs = require('fs');
const path = require('path');

// ===== CONFIGURACIÓN =====
const CONFIG = {
  name: 'MyAnimation',          // nombre de la animación
  fps: 60,                      // framerate
  totalFrames: 180,             // duración total
  width: 512,
  height: 512,
  assetsDir: 'public/my-anim/frames',
  outputPath: 'public/my-anim/animation.json',
  
  // Definición de frames: archivo PNG + ventana temporal
  frames: [
    { file: 'anim_f01.png', ip: 0,   op: 20,  name: 'Rest'          },
    { file: 'anim_f02.png', ip: 20,  op: 35,  name: 'Anticipation'  },
    { file: 'anim_f03.png', ip: 35,  op: 50,  name: 'ActionStart'   },
    { file: 'anim_f04.png', ip: 50,  op: 65,  name: 'ActionPeak'    },
    { file: 'anim_f05.png', ip: 65,  op: 90,  name: 'FollowThrough' },
    { file: 'anim_f06.png', ip: 90,  op: 110, name: 'SecondaryReact'},
    { file: 'anim_f07.png', ip: 110, op: 140, name: 'Settle'        },
    { file: 'anim_f08.png', ip: 140, op: 180, name: 'Hold'          },
  ],
  
  // Transform global aplicado a TODOS los frames (opcional)
  // Para un idle float: mover p Y de 250 a 262 en loop
  globalTransform: null, // o { type: 'float', amplitude: 12 }
};
// =========================

function readPng(filepath) {
  const buf = fs.readFileSync(filepath);
  return {
    w:   buf.readUInt32BE(16),
    h:   buf.readUInt32BE(20),
    b64: 'data:image/png;base64,' + buf.toString('base64'),
  };
}

function buildLottie(config) {
  const { name, fps, totalFrames, width, height, frames } = config;
  const cx = width / 2, cy = height / 2;

  const assets = [];
  const layers = [];

  frames.forEach((frame, i) => {
    const filepath = path.join(config.assetsDir, frame.file);
    
    if (!fs.existsSync(filepath)) {
      console.warn(`⚠️  Frame no encontrado: ${filepath} — usando placeholder`);
      return;
    }

    const { w, h, b64 } = readPng(filepath);
    const id = `img_${String(i).padStart(2, '0')}`;

    assets.push({ id, w, h, u: '', p: b64, e: 1 });

    // Transform base
    const ks = {
      o: { a: 0, k: 100 },
      r: { a: 0, k: 0 },
      p: { a: 0, k: [cx, cy, 0] },
      a: { a: 0, k: [Math.round(w / 2), Math.round(h / 2), 0] },
      s: { a: 0, k: [100, 100, 100] },
    };

    layers.push({
      ddd: 0,
      ind: i + 1,
      ty: 2,
      nm: frame.name || frame.file,
      refId: id,
      sr: 1, ao: 0,
      ip: frame.ip,
      op: frame.op,
      st: 0,
      bm: 0,
      ks,
    });
  });

  return {
    v: '5.7.4',
    fr: fps,
    ip: 0,
    op: totalFrames,
    w: width,
    h: height,
    nm: name,
    ddd: 0,
    assets,
    layers,
  };
}

// Generar
const lottie = buildLottie(CONFIG);
fs.mkdirSync(path.dirname(CONFIG.outputPath), { recursive: true });
fs.writeFileSync(CONFIG.outputPath, JSON.stringify(lottie));

const kb = Math.round(fs.statSync(CONFIG.outputPath).size / 1024);
console.log(`✅ ${CONFIG.outputPath} generado`);
console.log(`   Frames: ${CONFIG.frames.length} | Duración: ${CONFIG.totalFrames / CONFIG.fps}s | Tamaño: ${kb}KB`);
console.log(`   Layers: ${lottie.layers.length} assets embebidos`);
```

### Agregando Transform Global (idle float sobre multi-frame)

Si la animación necesita un movimiento global continuo (flotar, respirar) además de los frames, añadir **una capa extra** de transform sobre todas las image layers usando un null layer o un shape layer vacío con el movimiento.

```javascript
// Añadir después de generar los layers de imagen:
// Capa de "float" global — mueve todo el contenido suavemente
const floatLayer = {
  ddd: 0, ind: layers.length + 1, ty: 4, nm: 'Float',
  sr: 1, ao: 0, ip: 0, op: totalFrames, st: 0, bm: 0,
  shapes: [],
  ks: {
    o: { a: 0, k: 0 }, // 0% opacidad — es solo para mover
    p: { a: 1, k: [
      { t: 0,   s: [cx, cy - 8,  0] },
      { t: 90,  s: [cx, cy + 8,  0] },
      { t: 180, s: [cx, cy - 8,  0] },
    ]},
    a: { a: 0, k: [0, 0, 0] },
    s: { a: 0, k: [100, 100, 100] },
    r: { a: 0, k: 0 },
  },
};
// Nota: este patrón es para referencia — en Lottie ty:4 es shapes,
// el float real se logra con precomps o en las ks de los image layers
```

---

## FASE 6 — Validación y Entrega

### Checklist de Calidad Profesional

```
VISUAL:
  [ ] Todos los frames tienen fondo 100% transparente (PNG RGBA)
  [ ] El personaje mantiene proporciones consistentes entre frames
  [ ] Los colores son idénticos en todos los frames (mismos HEX)
  [ ] No hay artefactos de borde ni halos blancos alrededor del personaje
  [ ] Cada frame comunica claramente su micro-momento

TIMING:
  [ ] La acción principal dura lo suficiente para ser percibida (≥8 frames)
  [ ] Los holds (poses estáticas) no son tan cortos que parezcan flashes
  [ ] Los holds no son tan largos que parezcan congelados
  [ ] La animación loop: el primer y último frame tienen la misma pose

TÉCNICO (Lottie JSON):
  [ ] Canvas correcto (w, h)
  [ ] Todos los assets tienen e:1 (embedded)
  [ ] Todos los assets tienen base64 PNG válido (empieza con data:image/png;base64,)
  [ ] Cada layer tiene ip/op dentro del rango [0, totalFrames]
  [ ] No hay layers sin refId
  [ ] El JSON no supera 5MB (si supera, reducir resolución de PNGs a 400×400)

INTEGRACIÓN:
  [ ] Previsualizó correctamente en https://lottiefiles.com/preview
  [ ] Se ve bien en el tamaño de uso real (no solo en 512×512)
  [ ] En pantallas dark mode no aparece el fondo
```

### Script de Validación Automática

```javascript
// node validate-lottie.js <archivo.json>
const fs = require('fs');
const file = process.argv[2];
if (!file) { console.error('Uso: node validate-lottie.js <archivo.json>'); process.exit(1); }

const data = JSON.parse(fs.readFileSync(file, 'utf8'));
const errors = [];
const warnings = [];

// Canvas
if (!data.w || !data.h) errors.push('Canvas w/h no definido');
if (data.fr !== 60 && data.fr !== 30) warnings.push(`fps inusual: ${data.fr}`);

// Assets
(data.assets || []).forEach((a, i) => {
  if (!a.p?.startsWith('data:image/')) errors.push(`Asset[${i}] sin imagen base64`);
  if (a.e !== 1) errors.push(`Asset[${i}] sin e:1 (no embebido)`);
  if (!a.w || !a.h) warnings.push(`Asset[${i}] sin dimensiones`);
});

// Layers
(data.layers || []).forEach((l, i) => {
  if (l.ty === 2 && !l.refId) errors.push(`Layer[${i}] tipo imagen sin refId`);
  if (l.ip >= l.op) errors.push(`Layer[${i}] ip(${l.ip}) >= op(${l.op})`);
  if (l.op > data.op) warnings.push(`Layer[${i}] op(${l.op}) excede duración total(${data.op})`);
});

// Tamaño
const kb = Math.round(fs.statSync(file).size / 1024);
if (kb > 5000) warnings.push(`Archivo muy grande: ${kb}KB (recomendado < 5000KB)`);

// Reporte
console.log(`\n=== Validación: ${file} ===`);
console.log(`   Canvas: ${data.w}×${data.h} | ${data.fr}fps | ${data.op}fr (${(data.op/data.fr).toFixed(1)}s) | ${kb}KB`);
console.log(`   Assets: ${(data.assets||[]).length} | Layers: ${(data.layers||[]).length}`);
if (errors.length)   errors.forEach(e   => console.log(`   ❌ ${e}`));
if (warnings.length) warnings.forEach(w => console.log(`   ⚠️  ${w}`));
if (!errors.length)  console.log(`\n✅ JSON válido para producción`);
else                 console.log(`\n❌ ${errors.length} errores — corregir antes de usar`);
```

---

## Output de la Skill

Cuando se invoca esta skill, producir:

### 1. Guión de Escenas (`memory/patterns/lottie-script-<nombre>.md`)
```
# Lottie Script: <Nombre de la Animación>
Fecha: YYYY-MM-DD
Tipo: loop | one-shot
Duración: Xs (@60fps = N frames)

## Escenas
[Tabla completa de frames con nombre, pose, timing, tipo]

## Mapa de Timing
[Tabla ip/op con easing por transición]

## Design Bible
[Paleta HEX, anatomía, accesorios fijos]
```

### 2. Prompts de Imagen (`tools/prompts/<nombre>-frames-prompt.md`)
```
Prompt completo listo para pegar en Gemini/ChatGPT
— Prompt BASE (igual para todos)
— Prompt por frame (con instrucción de continuidad)
— Instrucciones de entrega (nombres de archivo, transparencia)
```

### 3. Script Generador (`scripts/generate-<nombre>.js`)
```
Script Node.js listo para correr
— CONFIG con todos los frames y su timing
— buildLottie() function
— Validación inline al generar
```

---

## Ejemplo de Uso

**Usuario:** "crea la animación de graduación del ZenDolphin"

**Respuesta esperada:**

```
Fase 1 — Análisis:
"ZenDolphin lanza su birrete de graduación transmitiendo júbilo máximo,
dura 3 segundos, es loop (vuelve a reposo)."

Fase 2 — Guión propuesto (7 frames):
F1 REPOSO      → 0-20fr    birrete en cabeza, pose serena
F2 ANTICIP     → 20-38fr   cuerpo tenso, aleta con birrete levantada
F3 LANZAMIENTO → 38-52fr   momento de soltar, smear frame
F4 VUELO       → 52-70fr   birrete en trayectoria ascendente con estelas
F5 CLIMAX      → 70-100fr  ambas aletas arriba, boca abierta, destellos
F6 SETTLE      → 100-130fr cuerpo asentándose, toga flotante por inercia
F7 VICTORIA    → 130-180fr pose final orgullosa (loop point = frame 1)

¿Apruebas este guión o quieres ajustar algún frame?
```
