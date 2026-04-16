# ADR: Lottie JSON — ty:2 image layer con base64 vs ty:4 shape layer

**Fecha:** 2026-04-15  
**Estado:** Aceptado  

## Contexto

ChatGPT generó los Lottie JSONs usando `ty:4` (shape layer) con formas geométricas
(círculos, rectángulos). El resultado en producción mostraba un círculo cyan en lugar
del delfín. Se necesitaba encontrar el formato correcto para embeber la imagen PNG real.

## Problema con ty:4

`ty:4` es Shape Layer — requiere paths bezier del personaje, que ChatGPT no puede generar
con fidelidad. Los shapes que generó eran placeholders sin relación visual con el delfín.

## Decisión

**Usar `ty:2` (Image Layer) con la imagen PNG embebida como base64 en `assets[].p` con `e:1`.**

```json
{
  "assets": [{ "id": "img_0", "w": 354, "h": 329, "u": "", "p": "data:image/png;base64,...", "e": 1 }],
  "layers": [{ "ty": 2, "refId": "img_0", "ks": { ... } }]
}
```

## Reglas que deben respetarse siempre

- `ty: 2` + `refId` apunta al asset PNG
- `e: 1` en el asset = embebido (no URL remota)
- `a` (anchor) en `ks` = `[w/2, h/2, 0]` para centrar la imagen
- `p` (position) en `ks` = `[256, 256, 0]` (centro del canvas 512×512)
- keyframes animados: `a:1` con array de objetos `{t, s, i, o}`
- keyframes estáticos: `a:0` con valor directo en `k` (no array)
- El script generador vive en `memory/patterns/lottie-image-layer.md`

## Consecuencias

- JSONs de ~200KB por archivo (PNG en base64 ≈ 33% más grande que binario)
- Si se cambia un PNG, regenerar con el script en `memory/patterns/`
- Validación: abrir en https://lottiefiles.com/preview — debe mostrar el personaje
