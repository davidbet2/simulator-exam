# Patrón: Lottie JSON con imagen PNG embebida

**Creado:** 2026-04-15  
**Usado en:** `public/dolphin_full_system/` — mascota ZenDolphin

## Cuándo usar este patrón

Cuando necesitas animar una imagen existente (PNG/JPG) con Lottie sin rediseñar
el personaje en After Effects o en Lottie Editor. Ideal para:
- Imágenes generadas por IA (ChatGPT, Midjourney, etc.)
- Iconos con animaciones simples (scale, position, rotation, opacity)
- Prototipos rápidos donde la calidad vectorial no es crítica

## Script generador

```js
// Ejecutar con: node generate-lotties.js
// Desde: raíz del proyecto
const fs = require('fs');
const path = require('path');

const ASSETS_DIR = 'public/dolphin_full_system/assets';
const OUT_DIR    = 'public/dolphin_full_system';

function readPng(filename) {
  const buf = fs.readFileSync(path.join(ASSETS_DIR, filename));
  return {
    w:   buf.readUInt32BE(16),
    h:   buf.readUInt32BE(20),
    b64: 'data:image/png;base64,' + buf.toString('base64'),
  };
}

function makeLottie(nm, pngFile, totalFrames, animKs) {
  const { w, h, b64 } = readPng(pngFile);
  return {
    v: '5.7.4', fr: 60, ip: 0, op: totalFrames, w: 512, h: 512,
    nm, ddd: 0,
    assets: [{ id: 'img_0', w, h, u: '', p: b64, e: 1 }],
    layers: [{
      ddd: 0, ind: 1, ty: 2, nm: 'Image',
      refId: 'img_0',
      sr: 1, ao: 0, ip: 0, op: totalFrames, st: 0, bm: 0,
      ks: {
        o: { a: 0, k: 100 },
        r: { a: 0, k: 0 },
        p: { a: 0, k: [256, 256, 0] },
        a: { a: 0, k: [Math.round(w/2), Math.round(h/2), 0] },
        s: { a: 0, k: [100, 100, 100] },
        ...animKs,
      },
    }],
  };
}

// Helper para keyframes
const KF = (t, s, ix=[0.5], iy=[0.5], ox=[0.5], oy=[0.5]) =>
  ({ t, s, i: { x: ix, y: iy }, o: { x: ox, y: oy } });

// --- Define tus animaciones aquí ---
const animations = {
  'output.json': makeLottie('MyAnim', 'input_clean.png', 120, {
    s: { a: 1, k: [
      KF(0,   [0, 0, 100],     [0.2],[1.8],[0.8],[-0.8]),
      KF(60,  [105,105,100]),
      KF(80,  [98, 98, 100]),
      KF(120, [100,100,100]),
    ]},
  }),
};

for (const [outFile, data] of Object.entries(animations)) {
  fs.writeFileSync(path.join(OUT_DIR, outFile), JSON.stringify(data));
  console.log('wrote', outFile);
}
```

## Animaciones predefinidas (copiar y pegar)

### Pulso suave (ideal para loader/idle)
```js
s: { a: 1, k: [
  KF(0,   [90, 90, 100]),
  KF(90,  [102,102,100]),
  KF(180, [90, 90, 100]),  // mismo que frame 0 → loop perfecto
]}
```

### Bounce-in con spring (ideal para success/aparición)
```js
s: { a: 1, k: [
  KF(0,  [0,0,100],    [0.2],[1.8],[0.8],[-0.8]),  // overshoot
  KF(55, [108,108,100]),
  KF(75, [98, 98, 100]),
  KF(90, [100,100,100]),
]}
```

### Shake horizontal (ideal para error)
```js
p: { a: 1, k: [
  KF(0, [256,256,0]), KF(8, [224,256,0]), KF(16,[288,256,0]),
  KF(24,[232,256,0]), KF(32,[280,256,0]), KF(40,[244,256,0]),
  KF(50,[268,256,0]), KF(60,[256,256,0]),
]}
```

### Flotación vertical (ideal para empty/waiting)
```js
p: { a: 1, k: [
  KF(0,   [256,244,0]),
  KF(90,  [256,268,0]),
  KF(180, [256,244,0]),  // loop perfecto
]}
```

### Sway / balanceo (ideal para wave/greeting)
```js
r: { a: 1, k: [
  KF(0,   [-6]),
  KF(60,  [6]),
  KF(120, [-6]),
  KF(180, [-6]),
]}
```

## Limitaciones

- No soporta animación de partes del cuerpo (boca, ojos independently) — para eso necesitas Rive o AE
- Base64 añade ~33% de tamaño vs PNG binario → JSONs de ~200KB por archivo
- Si el PNG tiene fondo blanco: usar `mix-blend-mode: multiply` en el wrapper,
  o regenerar con fondo transparente real (PNG 32-bit con canal alpha)
