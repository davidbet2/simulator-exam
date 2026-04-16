# PROMPT — ZenDolphin Graduation para Gemini (Versión Profesional — 8 frames)

> **Skill aplicada:** `lottie-animation-scripter` v2 — Template A (Celebración/Victoria) extendido  
> **Análisis de intención:** "ZenDolphin lanza su birrete de graduación transmitiendo júbilo máximo, dura 3.5 segundos loop."  
> **Principios aplicados:** Anticipation · Squash/Stretch · Follow-through · Secondary Action · Staging  
>
> Copia el bloque completo entre `=== INICIO ===` y `=== FIN ===` y pégalo directamente en Gemini 2.5 Pro.  
> No hay nada que editar — está listo tal cual.

---

## Guión de Escenas (resumen interno — no va en el prompt)

| # | Archivo | Principio | Frames (60fps) | Duración | Descripción |
|---|---|---|---|---|---|
| F1 | grad_f01.png | Staging / Loop point | 0 → 25 | 0.42s | Reposo elegante — birrete en cabeza |
| F2 | grad_f02.png | Anticipation | 25 → 45 | 0.33s | Compresión del cuerpo (carga del resorte) |
| F3 | grad_f03.png | Startup / Stretch | 45 → 58 | 0.22s | Cuerpo elongado, birrete en aleta a punto de soltar |
| F4 | grad_f04.png | Squash/Stretch + Smear | 58 → 72 | 0.23s | Smear del lanzamiento — máxima extensión + estelas |
| F5 | grad_f05.png | Follow-through | 72 → 95 | 0.38s | Birrete en vuelo ascendente, cuerpo con inercia, toga atrás |
| F6 | grad_f06.png | Secondary Action + Hold | 95 → 135 | 0.67s | Climax — birrete en el punto más alto, destellos, aletas arriba |
| F7 | grad_f07.png | Ease-out + Secondary | 135 → 170 | 0.58s | Cuerpo settling, toga y cadena del monóculo oscilando |
| F8 | grad_f08.png | Hold / Victory | 170 → 210 | 0.67s | Pose final de orgullo — birrete vuelve a la cabeza → loop |

**Total: 210 frames = 3.5 segundos @ 60fps**

---

```
=== INICIO ===

Quiero que generes 8 imágenes de una mascota oficial para una app de simulador de certificaciones Appian. La mascota es un delfín llamado ZenDolphin. Estas imágenes son los FRAMES CLAVE de una animación Lottie frame-by-frame — la consistencia visual entre todos los frames es CRÍTICA para que la animación se vea profesional y fluida.

---

## PERSONAJE: ZenDolphin — Animación de Lanzamiento de Birrete (8 frames clave)

### Descripción principal
Un delfín cartoon (bottlenose dolphin) en una secuencia de 8 poses que forman una animación de graduación cinematográfica.
Estilo: flat design cartoon 2D similar a Duolingo, pero con expresiones exageradas al estilo anime en los momentos de máxima emoción.
Formas redondeadas, colores vibrantes, movimientos con principios de animación profesional.

### Accesorios obligatorios — presentes en los 8 frames sin excepción
1. **Toga de graduación** — capa negra/azul oscura envolviendo el cuerpo, bordes y detalles dorados. La toga reacciona al movimiento: se comprime en F2, flota hacia atrás en F4/F5.
2. **Monóculo** — aro dorado + cristal azul translúcido (#9FDFFF, 60% opacidad) + cadenita dorada. Siempre en el ojo derecho. La cadena oscila/balancea en F7.
3. **Birrete** — posición cambia en cada frame según el guión de movimiento detallado abajo.

### Paleta de colores EXACTA — usar estos HEX sin variación en los 8 frames

| Elemento | Color HEX | Notas |
|---|---|---|
| Cuerpo del delfín | #2EC4F0 | Azul cian brillante |
| Vientre/pecho | #F0F9FF | Blanco azulado muy suave |
| Aleta dorsal | #1BA8D4 | Azul ligeramente más oscuro |
| Línea de contorno | #0D8FB3 | Solo si el estilo usa bordes |
| Toga (cuerpo) | #1E1E3A | Casi negro azulado |
| Toga (bordes/detalles) | #FFD700 | Dorado |
| Borla del birrete | #FFD700 | Dorado |
| Birrete (cuerpo) | #1E1E3A | Mismo que toga |
| Monóculo (aro) | #FFD700 | Dorado |
| Monóculo (cristal) | #9FDFFF | Azul cristal, 60% opacidad |
| Cadena del monóculo | #FFD700 | Dorado |
| Ojo (esclerótica) | #FFFFFF | Blanco puro |
| Pupila | #1A1A2E | Negro azulado |
| Brillo de pupila | #FFFFFF | Punto blanco pequeño |
| Destellos/estrellas | #FFD700 + #FFFFFF | Dorado y blanco |
| Fondo | TRANSPARENTE | Canal alpha — NUNCA blanco |

### Anatomía del delfín — igual en los 8 frames
- Cabeza grande y redonda (proporciones kawaii — cabeza ≈ 40% de la altura total)
- Ojos MUY grandes y expresivos, cambian de forma según la emoción
- Cuerpo oval redondeado, proporciones cute
- Dos aletas laterales pequeñas y redondas
- Cola bifurcada horizontal visible en la parte inferior
- Una aleta dorsal en la parte superior del cuerpo
- La POSE cambia — la anatomía base nunca

### Especificaciones técnicas — igual para los 8 frames
- **Canvas:** 512×512 píxeles
- **Formato:** PNG-32 con canal alpha COMPLETO — fondo 100% transparente, cero relleno de color
- **Posición:** Personaje centrado, ocupa ~75% del canvas. Los destellos y elementos de movimiento pueden llegar al borde.
- **Estilo:** Flat design limpio. Sin sombras proyectadas al suelo. Sin gradientes de más de 2 colores.
- **Sin fondo:** Nada de cielo, suelo, mar ni decoración de entorno. Solo el delfín y sus efectos de movimiento.

---

## LOS 8 FRAMES — genera UNO a la vez, espera mi aprobación antes del siguiente

### FRAME 1 de 8 — REPOSO (archivo: grad_f01.png)
**Principio de animación:** Staging — establece el personaje antes de la acción. Es también el loop point (inicio = fin).
**Pose:**
- Cuerpo erguido, ligeramente de frente al espectador. Dignidad tranquila.
- Birrete puesto en la cabeza, inclinado ~15° hacia la derecha del delfín, con borla cayendo hacia ese lado.
- Ambas aletas a los lados, relajadas y levemente hacia abajo.
- Boca cerrada con sonrisa suave y confiada.
- Ojos grandes abiertos, mirada serena y elegante.
- Toga cayendo naturalmente, sin movimiento.
- Monóculo en el ojo derecho, cadena colgando en reposo.
- Sin destellos especiales — ambiente tranquilo.

### FRAME 2 de 8 — ANTICIPACIÓN (archivo: grad_f02.png)
**Principio de animación:** Anticipation — el cuerpo se "comprime como un resorte" antes de la acción. Esto da poder e intención al movimiento. Es el frame más corto.
**Pose:**
- Cuerpo doblado hacia abajo y adelante, como si se encogiera para tomar impulso. Cabeza inclinada levemente hacia abajo.
- Birrete aún en la cabeza pero ahora sujeto por la aleta derecha que lo sostiene por el borde.
- Aleta derecha levantada sosteniendo el birrete listo para lanzar.
- Aleta izquierda hacia atrás y abajo como contrapeso.
- Ojos muy abiertos, anticipación y emoción creciente — cejas/marcas de expresión levantadas.
- Boca abierta en "¡ya viene!", dientes visibles.
- Toga comprimida por el agachado, pliegues visibles.
- Un pequeño "tension line" o líneas de vibración cerca del cuerpo indicando energía acumulada.

### FRAME 3 de 8 — INICIO DEL LANZAMIENTO (archivo: grad_f03.png)
**Principio de animación:** Startup — el cuerpo comenzó a moverse hacia arriba, el birrete está en el último punto de contacto con la aleta.
**Pose:**
- Cuerpo comenzando a enderezarse hacia arriba. La parte superior del cuerpo va hacia adelante y arriba.
- Aleta derecha extendida completamente hacia arriba diagonal, el birrete en la punta de la aleta — un instante antes de soltarlo.
- Aleta izquierda se abre hacia el costado como equilibrio.
- Ojos muy abiertos, explosión de emoción.
- Boca completamente abierta en grito de alegría, "¡YAAAAS!", algunas líneas de expresión anime alrededor del rostro.
- Toga empieza a separarse hacia atrás por el movimiento.
- Cadena del monóculo levemente elevada por la aceleración.

### FRAME 4 de 8 — SMEAR DEL LANZAMIENTO (archivo: grad_f04.png)
**Principio de animación:** Squash/Stretch + Smear — el frame más exagerado visualmente. En animación profesional, el "smear frame" es intencionalmente distorsionado para comunicar velocidad y energía explosiva. Duolingo y Disney usan este recurso.
**Pose:**
- Cuerpo completamente elongado/estirado hacia arriba como una flecha — EXAGERADO. El cuerpo puede ser 20% más alto de lo normal para comunicar el estiramiento máximo.
- El birrete ACABA de dejar la aleta — está a 5-10px del dedo/aleta con un rastro de movimiento (motion trail) de estelas cortas y circulares doradas detrás de él.
- Aleta derecha aún apuntando al cielo, llegó a su punto más alto.
- Aleta izquierda muy abierta hacia el costado en pose de "¡DESPEGÓ!".
- Expresión: ojos en forma de estrella o chibi-wide, boca en un "O" perfecto de emoción.
- Líneas de velocidad radiales detrás de todo el cuerpo indicando el impulso.
- La toga está completamente extendida hacia atrás por el tirón del movimiento — como una capa de superhéroe en el viento.

### FRAME 5 de 8 — VUELO ASCENDENTE (archivo: grad_f05.png)
**Principio de animación:** Follow-through — el cuerpo continúa el movimiento por inercia aunque la acción principal (lanzar) terminó.
**Pose:**
- Cuerpo levemente inclinado hacia atrás por la inercia, volviendo a una posición más normal pero aún en "momentum hacia arriba".
- Birrete en pleno vuelo ascendente, en la mitad superior del canvas. Estelas de velocidad detrás de él, rotando levemente.
- Aleta derecha bajando desde su punto más alto, aún extendida pero empezando a regresar.
- Aleta izquierda abierta hacia el costado, disfrutando el momento.
- Ojos brillantes chequeando el vuelo del birrete (mirando hacia arriba donde está el birrete).
- Boca en gran sonrisa abierta, todavía en el momento de emoción.
- Toga flotando hacia atrás, siguiendo la inercia del movimiento.
- La cadena del monóculo oscilando hacia atrás (secondary action).
- Pequeñas chispas doradas en el rastro del birrete.

### FRAME 6 de 8 — CLIMAX (archivo: grad_f06.png)
**Principio de animación:** Secondary Action + Hold — el clímax emocional. El birrete está en su punto más alto. Este frame dura más tiempo que los demás para que el espectador lo "procese" y sienta la celebración.
**Pose:**
- Cuerpo inclinado hacia atrás en pose de victoria total. "¡LO LOGRÉ!" escrito en cada ángulo.
- Birrete en la parte superior del canvas, casi en el borde superior derecho o izquierdo, con una explosión de destellos dorados alrededor: estrellas de 4 y 6 puntas, círculos brillantes, rayos de luz.
- Ambas aletas levantadas por encima de la cabeza en pose de "¡SÍ!" máximo.
- Boca completamente abierta en celebración total, mostrando todos los dientes, con líneas de expresión anime alrededor de la cara.
- Ojos: pueden estar entrecerrados de felicidad máxima (ojos en forma de X o de media luna) o absolutamente abiertos con brillos extra. Elige el que se vea más explosivo.
- Lágrimas de felicidad opcionales — pequeñas gotitas en las comisuras de los ojos (no tristeza, son de emoción).
- Monóculo brillando con destello extra — un "bling" de luz en el cristal.
- Toga muy abierta hacia los lados como un manto de triunfo.
- Destellos y estrellas distribuidos en todo el canvas, especialmente alrededor de la cabeza.

### FRAME 7 de 8 — SETTLE DOWN (archivo: grad_f07.png)
**Principio de animación:** Ease-out + Secondary Action — el cuerpo regresa al equilibrio. Los elementos con secondary action (toga, cadena del monóculo) aún se mueven por inercia, ligeramente por detrás del cuerpo.
**Pose:**
- Cuerpo regresando a posición vertical, pero aún relajado y flotante, no completamente rígido. Un 15% de inclinación lateral izquierda, como asentándose.
- Birrete descendiendo desde el punto más alto — ahora está a media altura del canvas, en trayectoria de bajada. Menos estelas que en F5, más lento.
- Aleta derecha bajando hacia su posición natural, aún levemente elevada.
- Aleta izquierda regresando también, extendiéndose hacia el costado en descanso.
- Sonrisa grande pero más serena que F6 — la emoción explosiva se convierte en felicidad profunda y orgullo.
- Ojos semi-cerrados de satisfacción profunda (expresión de "lo logramos...").
- SECONDARY ACTION: La cadena del monóculo oscilando —visible y claramente separada del ojo, swinging hacia el lado opuesto al movimiento del cuerpo.
- SECONDARY ACTION: La toga cayendo todavía con movimiento, pliegues en el lado opuesto a donde se inclinó el cuerpo.
- Menos destellos que F6, solo algunos pocos cerca del birrete que baja.

### FRAME 8 de 8 — VICTORIA HOLD (archivo: grad_f08.png)
**Principio de animación:** Hold — la pose final que se sostiene antes del loop. Elegante, orgullosa, con clase. El birrete vuelve a la cabeza (igual que F1 — punto de loop).
**Pose:**
- Cuerpo completamente erguido, pecho hacia adelante, postura de máximo orgullo y dignidad. Como un académico que acaba de graduarse.
- Birrete de vuelta en la cabeza, ligeramente inclinado — pero ahora con la borla al lado opuesto a F1 (giró durante el vuelo), lo que da sensación de que el ciclo se completó con algo sutil cambiado.
- Aleta derecha cruzada elegantemente sobre el pecho, "mano en el corazón" de orgullo.
- Aleta izquierda extendida hacia afuera en un gesto de presentación o bienvenida al espectador.
- Sonrisa enorme pero majestuosa — no el grito de F6, sino la satisfacción del triunfo tranquilo.
- Ojos entrecerrados con satisfacción, con un pequeño brillo extra en las pupilas.
- Monóculo con un destello especial — el "bling" final que dice "llegamos".
- Toga cayendo perfectamente, majestuosa y plena.
- Un halo sutil de pequeñas estrellas doradas alrededor de la cabeza — corona invisible de graduado.
- Esta es la pose más elegante de las 8. Menos energía explosiva, más presencia y carisma.

---

## Instrucciones de trabajo para Gemini

### Reglas de consistencia entre frames (CRÍTICO)
```
ANATOMÍA:    Mismas proporciones, mismo tamaño relativo, mismo estilo en los 8.
COLORES:     Los HEX de la paleta son ABSOLUTOS — no interpretar ni variar.
ACCESORIOS:  Toga, monóculo y birrete presentes en TODOS los frames.
LÍNEA:       Mismo grosor de contorno en todos.
REFERENCIA:  Después de aprobar F1, úsalo como referencia para todos los demás.
```

### Instrucción de continuidad (copiar entre frames)
```
IMPORTANTE: Esta pose es parte de una secuencia de 8 frames para una animación.
Mantener EXACTAMENTE igual en todos los frames:
- Mismas proporciones corporales del delfín
- Mismos colores HEX de la paleta
- Mismo estilo de trazo y grosor de líneas
- Los mismos 3 accesorios (toga + monóculo + birrete) siempre visibles
Solo debe cambiar la pose/posición/expresión descrita en este frame específico.
```

### Secuencia de generación
1. Genera FRAME 1 y muéstramelo
2. Espera mi aprobación — si no apruebo, aplica mis comentarios y regenera
3. Al aprobar, úsalo como referencia visual base para los frames siguientes
4. Repite hasta frame 8
5. Al terminar los 8, muéstralos en secuencia (storyboard) para verificar la historia completa

### Verificación de transparencia (ejecutar cuando los 8 estén aprobados)

```python
from PIL import Image
import os

frames = [f"grad_f{str(i).zfill(2)}.png" for i in range(1, 9)]
print("=== VERIFICACIÓN DE TRANSPARENCIA — ZenDolphin Graduation ===\n")
all_ok = True
for f in frames:
    if not os.path.exists(f):
        print(f"❌ No encontrado: {f}")
        all_ok = False
        continue
    img = Image.open(f).convert('RGBA')
    pixels = list(img.getdata())
    transparent = sum(1 for p in pixels if p[3] == 0)
    pct = transparent / len(pixels) * 100
    ok = pct > 15 and img.mode == 'RGBA'
    status = "✅" if ok else "❌"
    if not ok: all_ok = False
    print(f"{status} {f} — {pct:.0f}% transparente — {img.size[0]}×{img.size[1]}px — {img.mode}")

print("\n✅ Todos los frames listos." if all_ok else "\n❌ Hay frames con fondo. Usar rembg para limpiar.")
```

Si alguno falla, ejecutar:
```python
from rembg import remove
import os
for f in [f"grad_f{str(i).zfill(2)}.png" for i in range(1, 9)]:
    if os.path.exists(f):
        with open(f, 'rb') as inp:
            result = remove(inp.read())
        with open(f, 'wb') as out:
            out.write(result)
        print(f"✅ Fondo eliminado: {f}")
```

=== FIN ===
```

---

## Mapa de timing profesional (referencia para el Node.js)

| Frame | Archivo | ip | op | Duración | Principio | Easing salida |
|---|---|---|---|---|---|---|
| F1 | grad_f01.png | 0 | 25 | 0.42s | Staging / Loop point | ease-in lento |
| F2 | grad_f02.png | 25 | 45 | 0.33s | Anticipation | snap rápido |
| F3 | grad_f03.png | 45 | 58 | 0.22s | Startup | snap rápido |
| F4 | grad_f04.png | 58 | 72 | 0.23s | Smear / Squash-Stretch | snap inmediato |
| F5 | grad_f05.png | 72 | 95 | 0.38s | Follow-through | ease-out |
| F6 | grad_f06.png | 95 | 135 | 0.67s | Climax Hold | ease-in-out |
| F7 | grad_f07.png | 135 | 170 | 0.58s | Settle + Secondary | ease-out suave |
| F8 | grad_f08.png | 170 | 210 | 0.67s | Victory Hold → loop | ease-out lento |

**Total: 210 frames = 3.5 segundos @ 60fps**

**Nota sobre el loop:** El F8 tiene la misma pose base que F1, por lo que el corte de loop a 210→0 es imperceptible.

---

## Copiar frames al proyecto

Renombra los archivos de Gemini y cópialos a:
```
public/dolphin_full_system/assets/grad_f01.png
public/dolphin_full_system/assets/grad_f02.png
public/dolphin_full_system/assets/grad_f03.png
public/dolphin_full_system/assets/grad_f04.png
public/dolphin_full_system/assets/grad_f05.png
public/dolphin_full_system/assets/grad_f06.png
public/dolphin_full_system/assets/grad_f07.png
public/dolphin_full_system/assets/grad_f08.png
```

## Generar el Lottie multi-frame y hacer deploy

```powershell
cd C:\Users\david.betancur_pragm\Desktop\SimulatorExam
node -e "
const fs = require('fs'), path = require('path');
const assetsDir = 'public/dolphin_full_system/assets';
const outDir    = 'public/dolphin_full_system';

// ===== TIMING — lottie-animation-scripter Template A (Celebración) 8 frames =====
// Principios: Anticipation · Squash/Stretch · Follow-through · Secondary Action
const FRAMES = [
  { file: 'grad_f01', ip: 0,   op: 25,  name: 'Reposo'            }, // Staging / Loop point
  { file: 'grad_f02', ip: 25,  op: 45,  name: 'Anticipacion'      }, // Anticipation
  { file: 'grad_f03', ip: 45,  op: 58,  name: 'InicioLanzamiento' }, // Startup
  { file: 'grad_f04', ip: 58,  op: 72,  name: 'SmearLanzamiento'  }, // Squash/Stretch
  { file: 'grad_f05', ip: 72,  op: 95,  name: 'VueloAscendente'   }, // Follow-through
  { file: 'grad_f06', ip: 95,  op: 135, name: 'Climax'            }, // Secondary Action + Hold
  { file: 'grad_f07', ip: 135, op: 170, name: 'SettleDown'        }, // Ease-out + Secondary
  { file: 'grad_f08', ip: 170, op: 210, name: 'VictoriaHold'      }, // Hold → loop
];

const assets = [], layers = [];

FRAMES.forEach(({ file, ip, op, name }, i) => {
  const fpath = path.join(assetsDir, file + '.png');
  if (!fs.existsSync(fpath)) {
    console.warn('⚠️  No encontrado:', fpath, '— frame saltado');
    return;
  }
  const buf = fs.readFileSync(fpath);
  const w = buf.readUInt32BE(16), h = buf.readUInt32BE(20);
  const b64 = 'data:image/png;base64,' + buf.toString('base64');
  const id = 'img_' + String(i).padStart(2, '0');

  assets.push({ id, w, h, u: '', p: b64, e: 1 });
  layers.push({
    ddd: 0, ind: i + 1, ty: 2, nm: name,
    refId: id,
    sr: 1, ao: 0, ip, op, st: 0, bm: 0,
    ks: {
      o: { a: 0, k: 100 },
      r: { a: 0, k: 0 },
      p: { a: 0, k: [256, 256, 0] },
      a: { a: 0, k: [Math.round(w / 2), Math.round(h / 2), 0] },
      s: { a: 0, k: [100, 100, 100] }
    }
  });
  console.log('frame', String(i+1).padStart(2,'0'), '/', FRAMES.length, '—', name, '('+Math.round(buf.length/1024)+'KB)');
});

const lottie = {
  v: '5.7.4', fr: 60, ip: 0, op: 210, w: 512, h: 512,
  nm: 'ZenDolphin Graduation', ddd: 0,
  assets, layers
};

const outPath = path.join(outDir, 'onboarding.json');
fs.writeFileSync(outPath, JSON.stringify(lottie));
const kb = Math.round(fs.statSync(outPath).size / 1024);
console.log('\n✅ onboarding.json generado');
console.log('   Frames:', layers.length, '| Duración: 3.5s | Tamaño:', kb + 'KB');
"
npm run build
npx firebase deploy --only hosting
```

## Verificar en producción

Abre https://simulatorexam-dec4b.web.app — el delfín del home mostrará la animación de graduación completa.
