# ADR: Mascota ZenDolphin — LottieFiles vs SVG hand-coded

**Fecha:** 2026-04-15  
**Estado:** Aceptado  

## Contexto

Se necesitaba una mascota animada (delfín con birrete) para la WelcomePage de CertZen.
Se intentó primero con SVG hand-coded (2 iteraciones).

## Opciones evaluadas

| Opción | Pros | Contras |
|--------|------|---------|
| SVG hand-coded | Sin dependencias | Requiere skill de ilustración; resultado aceptable visualmente pero el usuario lo rechazó ("está peor que antes") |
| LottieFiles CDN | Animación profesional inmediata | Dependencia de CDN externo; animación genérica no del personaje |
| Lottie JSON local con PNG embebido | Personaje real, sin CDN, control total | JSONs grandes (~200KB c/u); requiere script de generación |
| Rive (.riv) | Calidad Duolingo, estados interactivos | Requiere diseño en editor Rive; binario no generabe por código |

## Decisión

**`@lottiefiles/dotlottie-react` con JSONs locales que embeben los PNGs como base64.**

Razones:
1. Los PNGs del personaje ya existen (generados por ChatGPT) — no hay que dibujar nada
2. Sin dependencia de CDN: los JSON viven en `public/dolphin_full_system/`
3. El sistema de `mood` (9 estados → 5 archivos) permite cambiar expresión según contexto
4. Script Node reproducible para regenerar si cambian las imágenes

## Consecuencias

- Bundle de precache crece ~1MB (5 JSONs × ~200KB)
- Los PNGs `_clean.png` todavía tienen fondo blanco — pendiente fix con alpha real o `mix-blend-mode: multiply`
- Prop `bob` en WelcomePage es ignorada silenciosamente (no existe en la implementación)
- Para llegar a calidad Duolingo real → migrar a Rive cuando haya diseñador disponible

## Archivos afectados

- `src/components/mascot/ZenDolphin.jsx`
- `public/dolphin_full_system/*.json`
- `public/dolphin_full_system/assets/*_clean.png`
