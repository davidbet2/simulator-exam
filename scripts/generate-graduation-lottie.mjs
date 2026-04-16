// scripts/generate-graduation-lottie.mjs v4
// 1. Remove background via flood-fill from edges
// 2. Auto-trim + resize centered to 512x512
// 3. Motion transforms: position Y arc, squash/stretch, rotation
// 4. Crossfade opacity
// 5. Vector confetti explosion + sparkle stars

import { readFileSync, writeFileSync, existsSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import sharp from 'sharp';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root      = join(__dirname, '..');
const assetsDir = join(root, 'public/dolphin_full_system/assets');
const outDir    = join(root, 'public/dolphin_full_system');

// posY: Y center in 512px canvas. Safe range [215,302] keeps character fully on screen.
// scX/scY: scale % for squash/stretch physics
// rot: rotation degrees
const FRAMES = [
  { file: 'grad_f01', ip:   0, op:  25, name: 'Reposo',            xfade: 4,  posY: 256, scX: 100, scY: 100, rot:   0 },
  { file: 'grad_f02', ip:  25, op:  45, name: 'Anticipacion',      xfade: 4,  posY: 272, scX: 108, scY:  92, rot:   3 },
  { file: 'grad_f03', ip:  45, op:  58, name: 'InicioLanzamiento', xfade: 3,  posY: 242, scX:  92, scY: 112, rot:  -5 },
  { file: 'grad_f04', ip:  58, op:  72, name: 'SmearLanzamiento',  xfade: 3,  posY: 228, scX:  88, scY: 118, rot: -12 },
  { file: 'grad_f05', ip:  72, op:  95, name: 'VueloAscendente',   xfade: 5,  posY: 220, scX:  92, scY: 110, rot:  -8 },
  { file: 'grad_f06', ip:  95, op: 135, name: 'Climax',            xfade: 8,  posY: 216, scX: 112, scY: 108, rot:   0 },
  { file: 'grad_f07', ip: 135, op: 170, name: 'SettleDown',        xfade: 7,  posY: 248, scX: 108, scY:  90, rot:   5 },
  { file: 'grad_f08', ip: 170, op: 210, name: 'VictoriaHold',      xfade: 8,  posY: 256, scX: 100, scY: 100, rot:   0 },
];

const CANVAS  = 512;
const FILL_PC = 0.95;
const TOTAL   = 218; // 210 + xfade of last frame (8) so fade-out completes before loop
const FPS     = 60;

// --- Background removal via flood-fill from edges --------------------------
// Supports two modes:
//   BG_MODE = 'solid'  → expects a flat solid color (e.g. magenta #FF00FF from Gemini)
//                         Uses euclidean RGB distance ≤ BG_TOLERANCE from BG_COLOR.
//                         BEST quality: tell Gemini "fondo sólido magenta #FF00FF sin gradiente"
//   BG_MODE = 'gray'   → legacy: grayscale-bright heuristic for the current gray-gradient images
//
// Switch to 'solid' + update BG_COLOR once new images from Gemini arrive.
const BG_MODE      = 'solid';         // 'solid' = magenta bg from Gemini | 'gray' = legacy
const BG_TOLERANCE = 80;              // euclidean distance; 80 safe (dolphin colors >250 from magenta)
// Legacy gray mode params (kept for fallback)
const GRAY_MAX_DIFF = 18;
const BRIGHT_MIN    = 148;

async function removeBgByColor(fpath) {
  const { width, height } = await sharp(fpath).metadata();
  const rgb = await sharp(fpath).removeAlpha().raw().toBuffer();

  // Auto-detect bg color from ALL border pixels (handles Gemini's gradient drift)
  let sr=0, sg=0, sb=0, count=0;
  for (let x = 0; x < width; x++) {
    const t = x*3, b_ = ((height-1)*width+x)*3;
    sr+=rgb[t];   sg+=rgb[t+1];   sb+=rgb[t+2];
    sr+=rgb[b_];  sg+=rgb[b_+1];  sb+=rgb[b_+2];
    count += 2;
  }
  for (let y = 1; y < height - 1; y++) {
    const l = y*width*3, r_ = (y*width+width-1)*3;
    sr+=rgb[l];   sg+=rgb[l+1];   sb+=rgb[l+2];
    sr+=rgb[r_];  sg+=rgb[r_+1];  sb+=rgb[r_+2];
    count += 2;
  }
  const BG_COLOR = [sr/count, sg/count, sb/count];

  function isBgPx(idx) {
    const r = rgb[idx * 3], g = rgb[idx * 3 + 1], b = rgb[idx * 3 + 2];
    if (BG_MODE === 'solid') {
      const dr = r - BG_COLOR[0], dg = g - BG_COLOR[1], db = b - BG_COLOR[2];
      return Math.sqrt(dr*dr + dg*dg + db*db) <= BG_TOLERANCE;
    }
    // gray mode
    return (Math.max(r, g, b) - Math.min(r, g, b)) <= GRAY_MAX_DIFF
        && (r + g + b) / 3 >= BRIGHT_MIN;
  }

  // 0=unknown, 1=bg, 2=fg-boundary
  const mask  = new Uint8Array(width * height);
  const stack = [];

  // Seed: all border pixels that match bg color
  for (let x = 0; x < width;  x++) {
    const t = x, b_ = (height - 1) * width + x;
    if (!mask[t]  && isBgPx(t))  { mask[t]  = 1; stack.push(t); }
    if (!mask[b_] && isBgPx(b_)) { mask[b_] = 1; stack.push(b_); }
  }
  for (let y = 0; y < height; y++) {
    const l = y * width, r_ = y * width + width - 1;
    if (!mask[l]  && isBgPx(l))  { mask[l]  = 1; stack.push(l); }
    if (!mask[r_] && isBgPx(r_)) { mask[r_] = 1; stack.push(r_); }
  }

  // DFS flood-fill
  while (stack.length > 0) {
    const idx = stack.pop();
    const x = idx % width, y = (idx / width) | 0;
    const neighbors = [];
    if (x > 0)         neighbors.push(idx - 1);
    if (x < width - 1) neighbors.push(idx + 1);
    if (y > 0)         neighbors.push(idx - width);
    if (y < height - 1)neighbors.push(idx + width);
    for (const n of neighbors) {
      if (mask[n]) continue;
      if (isBgPx(n)) { mask[n] = 1; stack.push(n); }
      else             { mask[n] = 2; }
    }
  }

  // Build RGBA: bg-connected pixels → (0,0,0,0)
  // Also despill magenta fringe on antialiased edges:
  //   A pixel is "magenta-tinted fringe" if it's foreground but its color is closer
  //   to the bg than to any real character color: use alpha = 1 - (distance/BG_TOLERANCE)^0.5
  const rgba = Buffer.alloc(width * height * 4);
  for (let i = 0; i < width * height; i++) {
    const r = rgb[i * 3], g = rgb[i * 3 + 1], b = rgb[i * 3 + 2];
    if (mask[i] === 1) {
      // confirmed background
      rgba[i * 4] = rgba[i * 4 + 1] = rgba[i * 4 + 2] = rgba[i * 4 + 3] = 0;
    } else {
      // foreground or unknown — apply magenta despill
      const dr = r - BG_COLOR[0], dg = g - BG_COLOR[1], db = b - BG_COLOR[2];
      const dist = Math.sqrt(dr*dr + dg*dg + db*db);
      if (BG_MODE === 'solid' && dist < BG_TOLERANCE * 1.4) {
        // near-bg pixel: fade alpha proportionally (removes fringe)
        const alpha = Math.round(Math.min(255, (dist / (BG_TOLERANCE * 1.4)) * 255));
        // Also subtract bg color contribution from RGB (color unmixing)
        const t = dist < BG_TOLERANCE ? 0 : (dist - BG_TOLERANCE) / (BG_TOLERANCE * 0.4);
        rgba[i * 4]     = Math.round(r * t + (r > BG_COLOR[0] ? r - BG_COLOR[0]*(1-t) : r));
        rgba[i * 4 + 1] = Math.round(g);
        rgba[i * 4 + 2] = Math.round(b * t + (b > BG_COLOR[2] ? b - BG_COLOR[2]*(1-t) : b));
        rgba[i * 4 + 3] = alpha;
      } else {
        rgba[i * 4]     = r;
        rgba[i * 4 + 1] = g;
        rgba[i * 4 + 2] = b;
        rgba[i * 4 + 3] = 255;
      }
    }
  }

  return sharp(rgba, { raw: { width, height, channels: 4 } }).png().toBuffer();
}

// --- Easing presets --------------------------------------------------------
const EI  = { x: [0.42, 0.42, 0.42], y: [0, 0, 0] };
const EO  = { x: [0.58, 0.58, 0.58], y: [1, 1, 1] };
const EI1 = { x: [0.42], y: [0] };
const EO1 = { x: [0.58], y: [1] };
// Cubic bezier for spring overshoot (ease-out spring feel)
const EI_SP = { x: [0.175, 0.175, 0.175], y: [0.885, 0.885, 0.885] };
const EO_SP = { x: [0.32,  0.32,  0.32 ], y: [1.275, 1.275, 1.275] };

// Seeded pseudo-random (deterministic per particle)
function sr(seed) {
  const x = Math.sin(seed * 9301 + 49297) * 233280;
  return x - Math.floor(x);
}

// --- Keyframe constructors -------------------------------------------------
function posKf(t, x, y, spring = false) {
  return { t, s: [x, y, 0], i: spring ? EI_SP : EI, o: spring ? EO_SP : EO };
}
function scaleKf(t, sx, sy) {
  return { t, s: [sx, sy, 100], i: EI, o: EO };
}
function rotKf(t, deg) {
  return { t, s: [deg], i: EI1, o: EO1 };
}
function opKf(t, v) {
  return { t, s: [v], i: EI1, o: EO1 };
}
function animProp(kfs) {
  // Remove i/o from last keyframe (endpoint in Lottie)
  const last = kfs[kfs.length - 1];
  delete last.i; delete last.o;
  return kfs.length === 1 ? { a: 0, k: kfs[0].s } : { a: 1, k: kfs };
}

// --- Per-frame animated transforms -----------------------------------------
function makePosition(frm, extIp, prevPosY) {
  const cx = CANVAS / 2;
  const { ip, op, posY, name } = frm;
  const kfs = [];
  if (extIp < ip && prevPosY !== posY) {
    kfs.push(posKf(extIp, cx, prevPosY));
    kfs.push(posKf(ip, cx, posY, true));
  } else {
    kfs.push(posKf(extIp, cx, posY));
  }
  if (name === 'Climax') {
    kfs.push(posKf(ip + 10, cx, posY - 6));
    kfs.push(posKf(ip + 26, cx, posY + 4));
    kfs.push(posKf(op, cx, posY));
  } else if (name === 'VictoriaHold') {
    kfs.push(posKf(ip + 12, cx, posY - 8, true));
    kfs.push(posKf(ip + 30, cx, posY + 4));
    kfs.push(posKf(op, cx, posY));
  } else {
    kfs.push(posKf(op, cx, posY));
  }
  return animProp(kfs);
}

function makeScale(frm, extIp) {
  const { ip, op, scX, scY, name } = frm;
  const kfs = [scaleKf(extIp, scX, scY)];
  if (name === 'Climax') {
    kfs.push(scaleKf(ip + 5,  scX + 6, scY + 6));
    kfs.push(scaleKf(ip + 18, 100, 100));
    kfs.push(scaleKf(op, 100, 100));
  } else if (name === 'SettleDown') {
    kfs.push(scaleKf(ip + 5,  scX, scY));
    kfs.push(scaleKf(ip + 18, 112, 86));
    kfs.push(scaleKf(op, 100, 100));
  } else if (name === 'VictoriaHold') {
    kfs.push(scaleKf(ip + 8,  106, 96));
    kfs.push(scaleKf(op, 100, 100));
  } else {
    kfs.push(scaleKf(op, scX, scY));
  }
  return animProp(kfs);
}

function makeRotation(frm, extIp) {
  const { ip, op, rot, name } = frm;
  const kfs = [rotKf(extIp, rot)];
  if (name === 'Climax') {
    kfs.push(rotKf(ip + 8,  3));
    kfs.push(rotKf(op, 0));
  } else if (name === 'VictoriaHold') {
    kfs.push(rotKf(ip + 10, -5));
    kfs.push(rotKf(ip + 22,  5));
    kfs.push(rotKf(op, 0));
  } else {
    kfs.push(rotKf(op, rot));
  }
  return animProp(kfs);
}

// --- Crossfade helpers (opacity) -------------------------------------------
function easeKf(t, v) {
  return { t, s: [v], i: { x: [0.42], y: [0] }, o: { x: [0.58], y: [1] } };
}

function makeOpacity(extIp, coreIp, coreOp, extOp) {
  const ks = [];
  if (extIp < coreIp) { ks.push(easeKf(extIp, 0)); ks.push(easeKf(coreIp, 100)); }
  else { ks.push(easeKf(extIp, 100)); }
  if (coreOp > coreIp + 2) ks.push(easeKf(coreOp, 100));
  if (extOp > coreOp) ks.push({ t: extOp, s: [0] });
  if (ks.length <= 1) return { a: 0, k: 100 };
  return { a: 1, k: ks };
}

// --- Vector confetti particles (burst at climax) ---------------------------
function buildConfettiLayers(startInd) {
  const ORIGIN     = [CANVAS / 2, 145];
  const BURST_IP   = 88;
  const BURST_OP   = 178;
  const COLORS = [
    [1, 0.85, 0.1,  1],   // gold
    [0.13, 0.18, 0.42, 1],// navy
    [0.18, 0.75, 0.87, 1],// cyan
    [1, 0.42, 0.1,  1],   // orange
    [0.85, 0.85, 0.85, 1],// silver
  ];
  const layers = [];
  for (let i = 0; i < 24; i++) {
    const angle  = (i / 24) * Math.PI * 2 + (sr(i) * 0.5 - 0.25);
    const speed  = 70 + sr(i + 100) * 80;
    const delay  = Math.floor(sr(i + 200) * 10);
    const w      = 8  + sr(i + 300) * 8;  // rect width
    const h      = 12 + sr(i + 400) * 8;  // rect height
    const color  = COLORS[i % COLORS.length];
    const ip     = BURST_IP + delay;
    const op     = BURST_OP;
    const endX   = ORIGIN[0] + Math.cos(angle) * speed;
    const endY   = ORIGIN[1] + Math.sin(angle) * speed + 55; // gravity arc
    const midX   = ORIGIN[0] + Math.cos(angle) * speed * 0.45;
    const midY   = ORIGIN[1] + Math.sin(angle) * speed * 0.45 - 28;
    const posKfs = [
      { t: ip,         s: [...ORIGIN, 0],   i: EI, o: EO },
      { t: ip + 22,    s: [midX, midY, 0],  i: EI, o: EO },
      { t: op - 5,     s: [endX, endY, 0] },
    ];
    const opKfs = [
      { t: ip,      s: [100], i: EI1, o: EO1 },
      { t: ip + 28, s: [100], i: EI1, o: EO1 },
      { t: op,      s: [0]   },
    ];
    const spin = sr(i + 500) > 0.5 ? 360 : -360;
    const rotKfs = [
      { t: ip, s: [0], i: EI1, o: EO1 },
      { t: op, s: [spin] },
    ];
    layers.push({
      ddd: 0, ind: startInd + i, ty: 4,
      nm: 'confetti_' + String(i).padStart(2, '0'),
      ip, op, st: 0, sr: 1, bm: 0,
      shapes: [
        { ty: 'rc', nm: 'rect', d: 1,
          s: { a: 0, k: [w, h] },
          p: { a: 0, k: [0, 0] },
          r: { a: 0, k: 2 } },
        { ty: 'fl', nm: 'fill',
          c: { a: 0, k: color },
          o: { a: 0, k: 100 }, r: 1 },
      ],
      ks: {
        o: { a: 1, k: opKfs },
        p: { a: 1, k: posKfs },
        s: { a: 0, k: [100, 100, 100] },
        r: { a: 1, k: rotKfs },
        a: { a: 0, k: [0, 0, 0] },
      },
    });
  }
  return layers;
}

// --- Sparkle stars (around diploma at climax) ------------------------------
function buildStarLayers(startInd) {
  const STAR_POSITIONS = [
    [295, 98], [218, 88], [325, 148], [198, 128],
    [342, 108], [192, 162], [308, 78],
  ];
  const STAR_COLORS = [
    [1, 0.92, 0.18, 1],     // gold
    [1, 1, 1, 1],            // white
    [0.18, 0.75, 0.87, 1],  // cyan
  ];
  const layers = [];
  for (let i = 0; i < STAR_POSITIONS.length; i++) {
    const [px, py] = STAR_POSITIONS[i];
    const ip = 88 + i * 7;
    const op = ip + 52;
    const color = STAR_COLORS[i % STAR_COLORS.length];
    const scKfs = [
      { t: ip,      s: [0,   0,   100], i: EI, o: EO },
      { t: ip + 10, s: [125, 125, 100], i: EI, o: EO },
      { t: ip + 22, s: [100, 100, 100], i: EI, o: EO },
      { t: op - 10, s: [80,  80,  100], i: EI, o: EO },
      { t: op,      s: [0,   0,   100] },
    ];
    const rKfs = [
      { t: ip, s: [0],  i: EI1, o: EO1 },
      { t: op, s: [45] },
    ];
    layers.push({
      ddd: 0, ind: startInd + i, ty: 4,
      nm: 'star_' + i,
      ip, op, st: 0, sr: 1, bm: 0,
      shapes: [
        { ty: 'sr', nm: 'star', d: 1, sy: 1,
          pt: { a: 0, k: 4 },
          p:  { a: 0, k: [0, 0] },
          r:  { a: 0, k: 0 },
          ir: { a: 0, k: 4  },
          or: { a: 0, k: 14 },
          is: { a: 0, k: 0  },
          os: { a: 0, k: 0  } },
        { ty: 'fl', nm: 'fill',
          c: { a: 0, k: color },
          o: { a: 0, k: 100 }, r: 1 },
      ],
      ks: {
        o: { a: 0, k: 100 },
        p: { a: 0, k: [px, py, 0] },
        s: { a: 1, k: scKfs },
        r: { a: 1, k: rKfs },
        a: { a: 0, k: [0, 0, 0] },
      },
    });
  }
  return layers;
}

// --- Main -----------------------------------------------------------------
console.log('\n ZenDolphin Graduation - Lottie Generator v3\n');

const assets = [], layers = [];
let missing = 0;

for (let i = 0; i < FRAMES.length; i++) {
  const frm = FRAMES[i];
  const { file, ip, op, name, xfade } = frm;
  const fpath = join(assetsDir, file + '.png');

  if (!existsSync(fpath)) { console.warn('FALTA:', fpath); missing++; continue; }

  process.stdout.write('  ' + String(i + 1).padStart(2) + '. ' + name.padEnd(22) + ' -> ...');

  // 1. Remove background
  const noBg = await removeBgByColor(fpath);

  // 2. Manual bounding box — trim() falla por artifacts en bordes; usamos alpha>20
  const { width, height } = await sharp(noBg).metadata();
  const raw4 = await sharp(noBg).raw().toBuffer();
  let minX = width, maxX = 0, minY = height, maxY = 0;
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      if (raw4[(y * width + x) * 4 + 3] > 20) {
        if (x < minX) minX = x;
        if (x > maxX) maxX = x;
        if (y < minY) minY = y;
        if (y > maxY) maxY = y;
      }
    }
  }
  // 3% margin around the character
  const mw = Math.round((maxX - minX + 1) * 0.03);
  const mh = Math.round((maxY - minY + 1) * 0.03);
  const cropX = Math.max(0, minX - mw);
  const cropY = Math.max(0, minY - mh);
  const cropW = Math.min(width  - cropX, maxX - minX + 1 + mw * 2);
  const cropH = Math.min(height - cropY, maxY - minY + 1 + mh * 2);
  const tw = cropW, th = cropH;

  const trimmed = await sharp(noBg)
    .extract({ left: cropX, top: cropY, width: cropW, height: cropH })
    .toBuffer();

  // 3. Resize to FILL_PC of canvas, centered
  const charSize = Math.round(CANVAS * FILL_PC);
  const pad      = Math.round((CANVAS - charSize) / 2);

  const final = await sharp(trimmed)
    .resize(charSize, charSize, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } })
    .extend({
      top:    pad,
      bottom: CANVAS - charSize - pad,
      left:   pad,
      right:  CANVAS - charSize - pad,
      background: { r: 0, g: 0, b: 0, alpha: 0 },
    })
    .png()
    .toBuffer();

  const id = 'img_' + String(i).padStart(2, '0');
  const kb = Math.round(final.length / 1024);

  assets.push({ id, w: CANVAS, h: CANVAS, u: '', p: 'data:image/png;base64,' + final.toString('base64'), e: 1 });

  const extIp = Math.max(0, ip - xfade);
  const extOp = Math.min(TOTAL, op + xfade);

  const prevPosY = i > 0 ? FRAMES[i - 1].posY : frm.posY;
  layers.push({
    ddd: 0, ind: i + 1, ty: 2, nm: name, refId: id, sr: 1, ao: 0,
    ip: extIp, op: extOp, st: 0, bm: 0,
    ks: {
      o: makeOpacity(extIp, ip, op, extOp),
      r: makeRotation(frm, extIp),
      p: makePosition(frm, extIp, prevPosY),
      a: { a: 0, k: [CANVAS / 2, CANVAS / 2, 0] },
      s: makeScale(frm, extIp),
    },
  });

  const dur = ((op - ip) / FPS * 1000).toFixed(0);
  process.stdout.write(' OK ' + dur + 'ms xfade:' + xfade + 'f (' + kb + 'KB) trimmed:' + tw + 'x' + th + '\n');
}

if (missing > 0) { console.error('Faltan frames:', missing); process.exit(1); }

// Vector overlay layers — dolphin images on top, effects behind
// In Lottie: array index 0 = topmost (rendered last). Images must come first.
const confettiLayers = buildConfettiLayers(100);
const starLayers     = buildStarLayers(200);
const allLayers      = [...layers, ...confettiLayers, ...starLayers];

const lottie = {
  v: '5.7.4', fr: FPS, ip: 0, op: TOTAL, w: CANVAS, h: CANVAS,
  nm: 'ZenDolphin Graduation - v4 motion',
  ddd: 0, assets, layers: allLayers,
};

const outPath = join(outDir, 'onboarding.json');
writeFileSync(outPath, JSON.stringify(lottie));
const finalKb = Math.round(readFileSync(outPath).length / 1024);

console.log('\nonboarding.json listo: ' + allLayers.length + ' layers (' + layers.length + ' frames + ' + confettiLayers.length + ' confetti + ' + starLayers.length + ' stars), ' + finalKb + 'KB\n');
