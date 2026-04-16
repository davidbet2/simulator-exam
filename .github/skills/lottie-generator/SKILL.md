# SKILL: lottie-generator — Frame-by-Frame PNG → Lottie JSON con Crossfades

> **Versión:** 2.0 — Crossfade multi-frame  
> **Stack:** Node.js ESM · lottie-web ty:2 image layers · PNG-32 RGBA  
> **Casos de uso:** Animaciones basadas en imágenes PNG estáticas como capas Lottie con transiciones suaves

---

## Problema que resuelve

Una animación Lottie con capas `ty:2` (image layer) que usan `ip`/`op` sin keyframes de opacidad produce **frame snapping** — transiciones bruscas e instantáneas entre imágenes.

Este skill genera un JSON Lottie donde cada capa tiene **keyframes de opacidad** que crean fundidos cruzados (crossfades) entre frames consecutivos, eliminando los cortes abruptos.

---

## Principio técnico: Crossfade con opacity keyframes

```
Frame N:    [░░░░████████████████▓▓▓░]   (fade-in 4f · hold · fade-out 4f)
Frame N+1:        [░░░░███████████████▓▓▓░███...]
                  ↑                   ↑
           límite ip               límite op
```

Cada capa extiende su `ip`/`op` en `±xfade` frames y usa keyframes de opacidad:
- **Fade-in:** 0→100 en los primeros `xfade` frames
- **Hold:** 100 durante el cuerpo del frame  
- **Fade-out:** 100→0 en los últimos `xfade` frames

El resultado: mientras frame N se desvanece, frame N+1 ya está apareciendo → crossfade real.

---

## Duración de crossfade recomendada por tipo de frame

| Tipo de frame | Duración total | xfade recomendado |
|---|---|---|
| Smear / muy rápido | < 15 frames | 3 frames (0.05s) |
| Acción rápida | 15-25 frames | 4 frames (0.07s) |
| Transición normal | 25-40 frames | 5-6 frames (0.08-0.1s) |
| Hold / Climax | > 35 frames | 7-10 frames (0.12-0.17s) |

---

## Script generador completo

Guardar como `scripts/generate-graduation-lottie.mjs` y ejecutar con `node scripts/generate-graduation-lottie.mjs`.

```javascript
// scripts/generate-graduation-lottie.mjs
// Genera onboarding.json con crossfades suaves entre los 8 frames de graduación
import { readFileSync, writeFileSync, existsSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root      = join(__dirname, '..');
const assetsDir = join(root, 'public/dolphin_full_system/assets');
const outDir    = join(root, 'public/dolphin_full_system');

// ===== STORYBOARD — por gemini-zendolphin-graduacion.md =====
// Principios: Staging · Anticipation · Startup · Squash/Stretch/Smear
//             Follow-through · Secondary Action + Hold · Ease-out · Victory Hold
const FRAMES = [
  { file: 'grad_f01', ip:   0, op:  25, name: 'Reposo',            xfade: 4 },
  { file: 'grad_f02', ip:  25, op:  45, name: 'Anticipacion',      xfade: 4 },
  { file: 'grad_f03', ip:  45, op:  58, name: 'InicioLanzamiento', xfade: 3 },
  { file: 'grad_f04', ip:  58, op:  72, name: 'SmearLanzamiento',  xfade: 3 },
  { file: 'grad_f05', ip:  72, op:  95, name: 'VueloAscendente',   xfade: 5 },
  { file: 'grad_f06', ip:  95, op: 135, name: 'Climax',            xfade: 8 },
  { file: 'grad_f07', ip: 135, op: 170, name: 'SettleDown',        xfade: 7 },
  { file: 'grad_f08', ip: 170, op: 210, name: 'VictoriaHold',      xfade: 8 },
];

const TOTAL = 210;
const FPS   = 60;

// ── Helpers ────────────────────────────────────────────────────────────────
function kf(t, v) { return { t, s: [v] }; }

function easeKf(t, v) {
  return { t, s: [v], i: { x: [0.42], y: [0] }, o: { x: [0.58], y: [1] } };
}

/**
 * Genera keyframes de opacidad con fade-in y fade-out suaves.
 * extIp → coreIp: fade in de 0 a 100
 * coreIp → coreOp: hold a 100
 * coreOp → extOp:  fade out de 100 a 0
 */
function makeOpacity(extIp, coreIp, coreOp, extOp) {
  const ks = [];

  if (extIp < coreIp) {
    ks.push(easeKf(extIp,  0));
    ks.push(easeKf(coreIp, 100));
  } else {
    ks.push(easeKf(extIp,  100));
  }

  if (coreOp > coreIp + 2) {
    ks.push(easeKf(coreOp, 100));
  }

  if (extOp > coreOp) {
    ks.push(kf(extOp, 0));
  }

  if (ks.length <= 1) return { a: 0, k: 100 };
  return { a: 1, k: ks };
}

// ── Procesar frames ────────────────────────────────────────────────────────
const assets = [], layers = [];
let missing = 0;

FRAMES.forEach(({ file, ip, op, name, xfade }, i) => {
  const fpath = join(assetsDir, file + '.png');
  if (!existsSync(fpath)) {
    console.warn('⚠️  FALTA:', fpath);
    missing++;
    return;
  }

  const buf = readFileSync(fpath);
  const w   = buf.readUInt32BE(16);
  const h   = buf.readUInt32BE(20);
  const id  = 'img_' + String(i).padStart(2, '0');

  assets.push({ id, w, h, u: '', p: 'data:image/png;base64,' + buf.toString('base64'), e: 1 });

  const extIp = Math.max(0, ip - xfade);
  const extOp = Math.min(TOTAL, op + xfade);

  layers.push({
    ddd: 0, ind: i + 1, ty: 2, nm: name,
    refId: id, sr: 1, ao: 0,
    ip: extIp, op: extOp, st: 0, bm: 0,
    ks: {
      o: makeOpacity(extIp, ip, op, extOp),
      r: { a: 0, k: 0 },
      p: { a: 0, k: [256, 256, 0] },
      a: { a: 0, k: [Math.round(w / 2), Math.round(h / 2), 0] },
      s: { a: 0, k: [100, 100, 100] },
    },
  });

  const dur = ((op - ip) / FPS * 1000).toFixed(0);
  console.log(`  ✅ ${String(i+1).padStart(2)}. ${name.padEnd(22)} [${extIp}→${extOp}]  ${dur}ms  xfade:${xfade}f  (${Math.round(buf.length/1024)}KB)`);
});

if (missing > 0) {
  console.error(`\n❌  Faltan ${missing} frames — coloca los PNGs en:\n   ${assetsDir}`);
  process.exit(1);
}

// ── Ensamblar y escribir ───────────────────────────────────────────────────
const lottie = {
  v: '5.7.4', fr: FPS, ip: 0, op: TOTAL, w: 512, h: 512,
  nm: 'ZenDolphin Graduation — crossfade v2',
  ddd: 0, assets, layers,
};

const outPath = join(outDir, 'onboarding.json');
writeFileSync(outPath, JSON.stringify(lottie));
const kb = Math.round(readFileSync(outPath).length / 1024);

console.log(`\n╔══════════════════════════════════════════╗`);
console.log(`║  onboarding.json generado               ║`);
console.log(`║  Layers : ${String(layers.length).padEnd(32)}║`);
console.log(`║  Duración: ${(TOTAL/FPS).toFixed(1)}s @ ${FPS}fps               ║`);
console.log(`║  Tamaño : ${String(kb+'KB').padEnd(32)}║`);
console.log(`║  Crossfades: activos en todas las juntas ║`);
console.log(`╚══════════════════════════════════════════╝`);
```

---

## Cómo agregar frames nuevos

Para añadir un frame intermedio entre F3 y F4 (por ejemplo):

```javascript
// En el array FRAMES, insertar:
{ file: 'grad_f03b', ip: 54, op: 58, name: 'StretchPeak', xfade: 2 },
// Y ajustar el op del anterior:
{ file: 'grad_f03', ip: 45, op: 54, name: 'InicioLanzamiento', xfade: 3 },
```

El generador calcula automáticamente los crossfades. Solo asegurarse de que los `ip`/`op` sean consecutivos y no se solapen (los `xfade` se encargan del solapamiento).

---

## Regla de naming de archivos

```
grad_f01.png  ← frame principal (número con 0-padding)
grad_f03b.png ← frame intermedio insertado después de f03
grad_f06h.png ← variante "hold" del frame 6
```

---

## Validar el JSON generado

```powershell
node -e "
const d = JSON.parse(require('fs').readFileSync('public/dolphin_full_system/onboarding.json'));
console.log('fr:', d.fr, '| op:', d.op, '| layers:', d.layers.length);
d.layers.forEach(l => {
  const hasKf = l.ks.o.a === 1;
  console.log(l.nm.padEnd(22), 'ip:', String(l.ip).padEnd(4), 'op:', String(l.op).padEnd(4), hasKf ? 'crossfade ✅' : 'static opacity');
});
"
```

---

## Integración con ZenDolphin.jsx

El componente debe usar `renderer="svg"` para evitar el checkerboard en canvas:

```jsx
<Lottie
  animationData={animData}
  renderer="svg"        // ← CRÍTICO: evita el fondo checkerboard de canvas
  loop
  autoplay
  style={{ width: size, height: size }}
/>
```

---

## Anti-patrones a evitar

- ❌ `renderer="canvas"` sin background explícito → checkerboard visible
- ❌ `o: { a: 0, k: 100 }` en todas las capas → frame snapping, sin crossfade
- ❌ `xfade` mayor que la mitad de la duración del frame → opacity siempre en transición, nunca hold
- ❌ Layers con ip/op completamente superpuestos → ambas imágenes visibles simultáneamente al 100%
