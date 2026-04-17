# PROMPT AGENTE — ZenDolphin Mascot Creator para ChatGPT

> **Cómo usarlo:**  
> 1. Copia TODO el bloque entre las líneas `=== INICIO DEL PROMPT ===` y `=== FIN DEL PROMPT ===`  
> 2. Pégalo como el PRIMER mensaje en una conversación nueva de ChatGPT (GPT-4o con DALL-E + Code Interpreter activados)  
> 3. ChatGPT ejecutará las fases en orden y al final te dará un ZIP para descargar  
> 4. Descarga el ZIP, extrae la carpeta `dolphin_full_system/` y sustitúyela en `public/dolphin_full_system/`  

---

```
=== INICIO DEL PROMPT ===

# Agente: ZenDolphin Mascot Creator

## Tu rol
Eres un agente experto en diseño de mascotas e implementación de animaciones Lottie.
Tu misión es ejecutar TODAS las fases de este documento en orden, sin saltarte ningún paso.
Al terminar, entregas un ZIP descargable con todo listo.

---

## Contexto del proyecto

**App:** Simulator-Exam — simulador de exámenes de certificación  
**Stack:** React 19 + Vite + Tailwind CSS  
**Mascota:** ZenDolphin — un delfín animado que acompaña al usuario  
**Uso:** Hero de la WelcomePage, indicador de estado en examen (cargando, éxito, error, vacío, bienvenida)  
**Librería:** @lottiefiles/dotlottie-react que lee archivos `.json` Lottie  

---

## FASE 1 — DISEÑO VISUAL DE LA MASCOTA (Design Bible)

Antes de generar cualquier imagen, confirma que entendiste estas especificaciones.
La coherencia visual entre las 5 imágenes es CRÍTICA.

### Descripción del personaje

**Especie:** Delfín nariz de botella (bottlenose dolphin)  
**Estilo:** Flat design cartoon, inspirado en Duolingo (Duo the owl). Limpio, vectorial, sin gradientes complejos.  
**Personalidad:** Amigable, alentador, celebratorio. Como un compañero de estudio entusiasta.  
**Audiencia:** Adultos jóvenes profesionales que estudian certificaciones.  

### Paleta de colores EXACTA — NO desviarse

| Elemento        | Color HEX  | Descripción                |
|----------------|------------|----------------------------|
| Cuerpo principal | #2EC4F0  | Azul cian brillante         |
| Vientre/pecho   | #F0F9FF    | Blanco azulado muy suave    |
| Aleta dorsal    | #1BA8D4    | Azul ligeramente más oscuro |
| Ojo (blanco)    | #FFFFFF    | Blanco puro                 |
| Pupila          | #1A1A2E    | Negro azulado               |
| Brillo pupila   | #FFFFFF    | Punto blanco de luz         |
| Birrete (cuerpo)| #2D2D44    | Negro azulado oscuro        |
| Birrete (borla) | #FFD700    | Dorado                      |
| Fondo PNG       | TRANSPARENTE | Alpha channel completo    |

### Anatomía del personaje
- **Cuerpo:** Oval redondeado, proporciones kawaii (cabeza grande ~40% del total)
- **Ojos:** MUY grandes y expresivos, con pupila redonda y un punto de brillo blanco
- **Boca:** Simple curva sonriente o expresión según estado
- **Aleta dorsal:** Una sola aleta en la parte superior del cuerpo
- **Cola:** Bifurcada, horizontal (como delfín real), visible en la parte inferior
- **Aletas laterales:** Dos aletas pequeñas y redondas a los lados
- **Birrete:** SIEMPRE presente en todas las imágenes, colocado sobre la cabeza inclinado ligeramente

### Especificaciones técnicas de las imágenes
- **Formato:** PNG-32 con canal alpha COMPLETO (fondo 100% transparente)
- **Dimensiones:** 512×512 píxeles
- **Posición:** Personaje centrado, ocupando ~70-80% del canvas
- **Sin sombras de fondo:** No drop shadows, no ground shadows
- **Sin elementos de entorno:** Solo el personaje solo, sin fondos, sin decoraciones externas

---

## FASE 2 — GENERACIÓN DE IMÁGENES (5 estados)

**REGLA:** Antes de generar la imagen 2, 3, 4 y 5, SIEMPRE hazte referencia a la imagen anterior para mantener coherencia visual.

Usa este prompt BASE para cada imagen y añade el MODIFICADOR específico al final:

### PROMPT BASE (igual para todas las imágenes)
```
A cute cartoon bottlenose dolphin mascot character, flat vector art style similar to Duolingo.
Body color: bright cyan blue (#2EC4F0), belly: very light blue-white (#F0F9FF).
Big round expressive eyes with white sclera, dark round pupils with a white highlight dot.
Wearing a small dark graduation cap (mortarboard) with a golden tassel, tilted slightly.
Clean flat design, no gradients, no shadows, no background elements.
PNG format, 512x512 pixels, FULLY TRANSPARENT BACKGROUND with alpha channel.
Character centered, takes up about 75% of the canvas.
Consistent character design across all variations.
```

### Imagen 1: LOADER (archivo: loader_clean.png)
**Estado:** Esperando / Cargando  
**Modificador a agregar al PROMPT BASE:**
```
The dolphin is in a neutral, calm swimming pose. Slight forward lean, fins slightly raised.
Mouth closed with a gentle, expectant small smile. Eyes looking straight ahead, slightly wide.
Expression: curious and patient, like waiting for something exciting.
```

### Imagen 2: SUCCESS (archivo: success_clean.png)
**Estado:** Éxito / Alegría  
**Modificador a agregar al PROMPT BASE:**
```
The dolphin is jumping upward with excitement, body arched in a happy jump pose.
Both fins raised up in a "celebrating" gesture. Mouth open in a big happy smile showing small teeth.
Eyes squinted with joy (happy expression). Golden stars or sparkles floating around the dolphin.
Expression: pure joy and celebration, like just aced an exam.
```

### Imagen 3: ERROR (archivo: error_clean.png)
**Estado:** Error / Frustración leve  
**Modificador a agregar al PROMPT BASE:**
```
The dolphin has a slightly worried or surprised expression. Body slightly tense, fins close to body.
Eyebrows slightly furrowed (worried look), eyes wide, mouth making a small "oh no" oval shape.
Small sweat drop on the forehead (anime style). NOT crying, just mildly stressed.
Expression: "oops, that was wrong" — mild concern, not devastation.
```

### Imagen 4: EMPTY (archivo: empty_clean.png)
**Estado:** Sin contenido / Esperando  
**Modificador a agregar al PROMPT BASE:**
```
The dolphin is floating gently, looking slightly bored or wistful.
Body relaxed, one fin raised with a small question mark above the head (floating symbol).
Eyes half-closed / sleepy looking, mouth in a neutral or small pout.
Expression: "hmm, nothing here yet" — calm but slightly bored.
```

### Imagen 5: ONBOARDING (archivo: onboarding_clean.png)
**Estado:** Bienvenida / Presentación  
**Modificador a agregar al PROMPT BASE:**
```
The dolphin is waving hello enthusiastically with one raised fin, like greeting someone.
Body slightly turned to face the viewer, leaning forward in a welcoming posture.
Big happy open smile, eyes wide and excited. Small sparkles or stars around.
Expression: "Welcome! I'm so glad you're here!" — maximum friendliness and energy.
```

**INSTRUCCIÓN IMPORTANTE:** Genera una imagen a la vez. Después de cada imagen, pregúntame si la apruebo antes de continuar con la siguiente. Si no la apruebo, descríbeme el problema y regenera.

---

## FASE 3 — ELIMINACIÓN DE FONDO (si es necesario)

Si alguna imagen generada tiene fondo blanco o no es completamente transparente:

1. Usa Python con la librería `rembg` o `Pillow` para eliminar el fondo
2. Asegúrate de que el resultado sea PNG-32 con canal alpha
3. El personaje debe tener bordes suaves (no aliasing duro)

**Script de verificación de transparencia:**
```python
from PIL import Image
import io

def verify_transparency(img_data):
    img = Image.open(io.BytesIO(img_data)).convert('RGBA')
    pixels = list(img.getdata())
    transparent = sum(1 for p in pixels if p[3] == 0)
    total = len(pixels)
    pct = (transparent / total) * 100
    print(f"Píxeles transparentes: {transparent}/{total} ({pct:.1f}%)")
    if pct < 10:
        print("⚠️ ADVERTENCIA: Muy pocos píxeles transparentes. El fondo puede no estar eliminado.")
    elif pct > 30:
        print("✅ Transparencia detectada correctamente.")
    return pct > 10
```

---

## FASE 4 — GENERACIÓN DE LOTTIE JSONs

Una vez que las 5 imágenes estén aprobadas, ejecuta este script Python completo.
Guarda las imágenes como: `loader.png`, `success.png`, `error.png`, `empty.png`, `onboarding.png`

```python
import json, base64, struct, os, zipfile
from pathlib import Path
from PIL import Image
import io

# ===== CONFIGURACIÓN =====
IMAGES = {
    "loader": "loader.png",
    "success": "success.png",
    "error": "error.png",
    "empty": "empty.png",
    "onboarding": "onboarding.png",
}
OUTPUT_DIR = Path("dolphin_full_system")
ASSETS_DIR = OUTPUT_DIR / "assets"
OUTPUT_DIR.mkdir(exist_ok=True)
ASSETS_DIR.mkdir(exist_ok=True)

# ===== HELPERS =====
def read_png(path):
    data = open(path, "rb").read()
    w = struct.unpack('>I', data[16:20])[0]
    h = struct.unpack('>I', data[20:24])[0]
    b64 = "data:image/png;base64," + base64.b64encode(data).decode()
    return w, h, b64, data

def kf(t, s, ix=None, iy=None, ox=None, oy=None):
    frame = {"t": t, "s": s}
    if ix is not None:
        frame["i"] = {"x": ix, "y": iy}
        frame["o"] = {"x": ox, "y": oy}
    return frame

def make_lottie(name, png_path, total_frames, anim_ks):
    w, h, b64, _ = read_png(png_path)
    ax, ay = w // 2, h // 2

    base_ks = {
        "o": {"a": 0, "k": 100},
        "r": {"a": 0, "k": 0},
        "p": {"a": 0, "k": [256, 256, 0]},
        "a": {"a": 0, "k": [ax, ay, 0]},
        "s": {"a": 0, "k": [100, 100, 100]},
    }
    base_ks.update(anim_ks)

    return {
        "v": "5.7.4", "fr": 60, "ip": 0, "op": total_frames, "w": 512, "h": 512,
        "nm": name, "ddd": 0,
        "assets": [{"id": "img_0", "w": w, "h": h, "u": "", "p": b64, "e": 1}],
        "layers": [{
            "ddd": 0, "ind": 1, "ty": 2, "nm": "Dolphin",
            "refId": "img_0",
            "sr": 1, "ao": 0, "ip": 0, "op": total_frames, "st": 0, "bm": 0,
            "ks": base_ks
        }]
    }

# ===== DEFINICIÓN DE ANIMACIONES =====
# loader: pulso suave (escala 90%→102%→90%, loop infinito 3s)
loader_lottie = make_lottie("Loader", IMAGES["loader"], 180, {
    "s": {"a": 1, "k": [
        kf(0,   [90,90,100]),
        kf(90,  [102,102,100]),
        kf(180, [90,90,100])
    ]}
})

# success: rebote de entrada con spring physics (escala 0→108%→98%→100%)
success_lottie = make_lottie("Success", IMAGES["success"], 90, {
    "s": {"a": 1, "k": [
        kf(0,  [0,0,100],    [0.2],[1.8],[0.8],[-0.8]),
        kf(55, [108,108,100],[0.5],[0.5],[0.5],[0.5]),
        kf(75, [98,98,100],  [0.5],[0.5],[0.5],[0.5]),
        kf(90, [100,100,100])
    ]}
})

# error: sacudida horizontal (posición X oscila) 
error_lottie = make_lottie("Error", IMAGES["error"], 80, {
    "p": {"a": 1, "k": [
        kf(0,  [256,256,0]),
        kf(8,  [224,256,0]),
        kf(16, [288,256,0]),
        kf(24, [232,256,0]),
        kf(32, [280,256,0]),
        kf(40, [244,256,0]),
        kf(50, [268,256,0]),
        kf(60, [256,256,0])
    ]}
})

# empty: flotación vertical suave (posición Y sube y baja lentamente)
empty_lottie = make_lottie("Empty", IMAGES["empty"], 180, {
    "p": {"a": 1, "k": [
        kf(0,   [256,244,0]),
        kf(90,  [256,268,0]),
        kf(180, [256,244,0])
    ]}
})

# onboarding: bounce-in de entrada + movimiento de saludo (rotación oscilante)
onboarding_lottie = make_lottie("Onboarding", IMAGES["onboarding"], 180, {
    "s": {"a": 1, "k": [
        kf(0,  [0,0,100],    [0.2],[1.8],[0.8],[-0.8]),
        kf(35, [108,108,100],[0.5],[0.5],[0.5],[0.5]),
        kf(50, [98,98,100],  [0.5],[0.5],[0.5],[0.5]),
        kf(60, [100,100,100],[0.5],[0.5],[0.5],[0.5]),
        kf(180,[100,100,100])
    ]},
    "r": {"a": 1, "k": [
        kf(60,  [-6]),
        kf(100, [6]),
        kf(140, [-6]),
        kf(180, [-6])
    ]}
})

# ===== ESCRIBIR JSONs =====
lotties = {
    "loader":     loader_lottie,
    "success":    success_lottie,
    "error":      error_lottie,
    "empty":      empty_lottie,
    "onboarding": onboarding_lottie,
}

for name, data in lotties.items():
    out_path = OUTPUT_DIR / f"{name}.json"
    with open(out_path, "w") as f:
        json.dump(data, f)
    size_kb = os.path.getsize(out_path) // 1024
    print(f"✅ {name}.json — {size_kb}KB")

# ===== COPIAR PNGs A ASSETS =====
import shutil
for key, filename in IMAGES.items():
    # Guardar como *_clean.png en assets/
    clean_name = f"{key}_clean.png"
    shutil.copy(filename, ASSETS_DIR / clean_name)
    print(f"📁 assets/{clean_name} copiado")

# ===== CREAR ZIP =====
zip_path = "dolphin_full_system.zip"
with zipfile.ZipFile(zip_path, "w", zipfile.ZIP_DEFLATED) as zf:
    for file in OUTPUT_DIR.rglob("*"):
        if file.is_file():
            zf.write(file, file.relative_to(OUTPUT_DIR.parent))

print(f"\n🎉 ZIP creado: {zip_path}")
print(f"📦 Contenido:")
with zipfile.ZipFile(zip_path) as zf:
    for name in sorted(zf.namelist()):
        info = zf.getinfo(name)
        print(f"   {name} ({info.file_size // 1024}KB)")
print("\nDescarga el archivo dolphin_full_system.zip")
```

---

## FASE 5 — VALIDACIÓN

Antes de crear el ZIP, ejecuta este script de validación:

```python
import json, zipfile
from pathlib import Path

print("=== VALIDACIÓN DE LOTTIE JSONs ===\n")
errors_found = False

for name in ["loader", "success", "error", "empty", "onboarding"]:
    path = Path("dolphin_full_system") / f"{name}.json"
    with open(path) as f:
        data = json.load(f)
    
    issues = []
    
    # Check canvas 512x512
    if data.get("w") != 512 or data.get("h") != 512:
        issues.append(f"Canvas no es 512x512 (es {data.get('w')}x{data.get('h')})")
    
    # Check tiene assets
    if not data.get("assets") or len(data["assets"]) == 0:
        issues.append("Sin assets (imagen no embebida)")
    else:
        asset = data["assets"][0]
        if not asset.get("p", "").startswith("data:image/png;base64,"):
            issues.append("Asset no tiene imagen base64 PNG válida")
        if asset.get("e") != 1:
            issues.append("Asset no tiene e:1 (embedded flag)")
    
    # Check tiene layers con ty:2
    layers = data.get("layers", [])
    if not layers:
        issues.append("Sin layers")
    else:
        layer = layers[0]
        if layer.get("ty") != 2:
            issues.append(f"Layer tipo {layer.get('ty')} (esperado: 2 para imagen)")
        if layer.get("refId") != "img_0":
            issues.append("Layer no referencia img_0")
    
    # Check animación tiene keyframes
    ks = data.get("layers", [{}])[0].get("ks", {})
    has_animation = any(prop.get("a") == 1 for prop in ks.values() if isinstance(prop, dict))
    
    status = "✅" if not issues else "❌"
    anim_status = "🎬 animado" if has_animation else "📌 estático"
    total_frames = data.get("op", 0)
    duration_s = total_frames / data.get("fr", 60)
    
    print(f"{status} {name}.json — {total_frames}fr ({duration_s:.1f}s) {anim_status}")
    for issue in issues:
        print(f"   ⚠️  {issue}")
        errors_found = True

if not errors_found:
    print("\n✅ TODOS LOS ARCHIVOS SON VÁLIDOS — listo para crear ZIP")
else:
    print("\n❌ Hay errores. Corrígelos antes de continuar.")
```

---

## FASE 6 — ENTREGA

Si la validación es exitosa:

1. Ejecuta el script de la Fase 4 completo (generará el ZIP)
2. Proporciona el link de descarga del archivo `dolphin_full_system.zip`
3. Incluye un resumen con:
   - Screenshots de las 5 imágenes generadas
   - Descripción de la animación de cada estado
   - Instrucciones de instalación

---

## Instrucciones de instalación (incluir en el resumen de entrega)

Cuando el usuario descargue el ZIP:

```
1. Extraer el ZIP
2. Reemplazar la carpeta completa:
   public/dolphin_full_system/ 
   con el contenido extraído

3. La estructura debe quedar así:
   public/
   └── dolphin_full_system/
       ├── loader.json      (animación loop: pulso suave)
       ├── success.json     (animación one-shot: bounce de entrada)
       ├── error.json       (animación one-shot: sacudida horizontal)
       ├── empty.json       (animación loop: flotación vertical)
       ├── onboarding.json  (animación: bounce-in + saludo oscilante)
       └── assets/
           ├── loader_clean.png
           ├── success_clean.png
           ├── error_clean.png
           ├── empty_clean.png
           └── onboarding_clean.png

4. Ejecutar en terminal:
   npm run build
   npx firebase deploy --only hosting
```

---

## RESTRICCIONES IMPORTANTES

- ❌ NO generar todas las imágenes de golpe sin confirmación
- ❌ NO usar fondos blancos en los PNGs — SIEMPRE transparente
- ❌ NO cambiar la paleta de colores definida en la Fase 1
- ❌ NO omitir el birrete de graduación en ninguna imagen
- ✅ Confirmar aprobación visual en cada imagen antes de continuar
- ✅ Ejecutar el script de validación antes del ZIP final
- ✅ Proporcionar el ZIP como archivo descargable

---

¿Entendiste las instrucciones? Confirma brevemente qué vas a hacer y empieza con la Fase 1 mostrando un resumen del diseño del personaje que vas a crear. Luego pide autorización para empezar a generar la primera imagen.

=== FIN DEL PROMPT ===
```

---

## Flujo esperado en ChatGPT

```
TÚ:          [pega el prompt completo]
ChatGPT:     "Entendido. ZenDolphin es un delfín flat design con estas características..."
             "¿Autorizo generar la imagen 1 (loader)?"
TÚ:          "sí"
ChatGPT:     [genera loader_clean.png]
             "¿La apruebas o quieres ajustes?"
TÚ:          "aprobada" / "cámbia los ojos"
ChatGPT:     [continúa con imagen 2...]
             ...
             [Fase 4: genera los 5 JSONs]
             [Fase 5: valida]
             [Fase 6: proporciona ZIP para descargar]
TÚ:          [descarga ZIP, lo pega en public/]
```

## Tiempo estimado: 15-25 minutos (5 imágenes × 3-5 min c/u + generación de código)
