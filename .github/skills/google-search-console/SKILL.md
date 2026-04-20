---
name: google-search-console
description: >
  Google Search Console specialist for SimulatorExam. Monitors indexing health,
  Core Web Vitals field data, search performance (clicks/impressions/CTR/position),
  sitemaps, robots.txt, structured data, and SEO optimization for the React SPA.
  Use when asked about "SEO", "indexación", "sitemap", "Core Web Vitals",
  "robots.txt", "structured data", "tráfico orgánico", "Search Console", or "Google Search".
argument-hint: "<task: audit indexing | optimize SEO | debug traffic drop | submit sitemap>"
allowed-tools: Read Write Grep Glob fetch WebSearch
---

# Skill: Google Search Console Expert

## Cuándo se Activa
- "submit sitemap" / "configurar sitemap"
- "SEO" / "optimizar para Google"
- "páginas indexadas" / "indexación"
- "Core Web Vitals" / "LCP" / "CLS" / "FID"
- "robots.txt" / "noindex"
- "tráfico orgánico bajó" / "debug de SEO"
- "Search Console" / "GSC"
- "structured data" / "rich results" / "JSON-LD"

---

## Arquitectura de Indexación del Proyecto

```
✅ INDEXAR (público, tiene valor SEO):
  /                     → Página principal
  /explore              → Catálogo de exámenes
  /explore/:slug        → Página de cada set (mayor valor SEO)
  /pricing              → Página de precios

❌ NO INDEXAR (privado/dinámico):
  /dashboard            → Requiere auth
  /profile              → Requiere auth
  /exam/:id             → Sesión dinámica
  /results              → Post-examen
  /admin/*              → Panel admin
  /login                → Auth
```

---

## Flujo de Trabajo

```
FASE 1: DIAGNÓSTICO
  → Leer public/robots.txt y public/sitemap.xml si existen
  → Verificar SEOHead en páginas públicas (src/features/*/pages/)
  → Buscar noindex en páginas privadas
  → Identificar qué páginas tienen structured data

FASE 2: ANÁLISIS DE GAPS
  → ¿Faltan meta titles/descriptions únicos?
  → ¿El sitemap incluye los exam set pages dinámicos?
  → ¿Core Web Vitals en rango "Good"?
  → ¿React SPA renderiza contenido real para Googlebot?

FASE 3: IMPLEMENTACIÓN
  → robots.txt y sitemap.xml en public/
  → SEOHead actualizado en cada página pública
  → noindex en páginas privadas
  → JSON-LD en exam set landing pages
  → Pre-render si es necesario

FASE 4: VERIFICACIÓN EN GSC
  → URL Inspection en páginas clave
  → Sitemap submitted
  → Index Coverage sin errores nuevos
  → Core Web Vitals: monitorear 7 días post-deploy
```

---

## robots.txt Correcto para este Proyecto

```txt
# public/robots.txt
User-agent: *
Disallow: /dashboard
Disallow: /profile
Disallow: /admin/
Disallow: /exam/
Disallow: /results
Allow: /

Sitemap: https://simulatorexam.web.app/sitemap.xml
```

---

## Noindex en Páginas Privadas

```jsx
// ✅ Ya implementado con SEOHead — verificar que esté en TODAS las rutas privadas
<SEOHead noindex />

// Asegurar que el componente genere:
<meta name="robots" content="noindex, nofollow" />
```

---

## Sitemap Estático (public/sitemap.xml)

```xml
<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>https://simulatorexam.web.app/</loc>
    <changefreq>weekly</changefreq>
    <priority>1.0</priority>
  </url>
  <url>
    <loc>https://simulatorexam.web.app/explore</loc>
    <changefreq>daily</changefreq>
    <priority>0.9</priority>
  </url>
  <url>
    <loc>https://simulatorexam.web.app/pricing</loc>
    <changefreq>monthly</changefreq>
    <priority>0.8</priority>
  </url>
</urlset>
```

Para incluir exam set pages dinámicas, agregar a `scripts/generate-sitemap.mjs`:
```js
// Leer publicados desde Firestore y generar entradas XML
const sets = await db.collection('examSets').where('published', '==', true).get()
sets.docs.forEach(d => {
  const slug = d.id
  xml += `  <url>\n    <loc>https://simulatorexam.web.app/explore/${slug}</loc>\n    <changefreq>weekly</changefreq>\n    <priority>0.8</priority>\n  </url>\n`
})
```

---

## SEO Óptimo por Página

### Fórmula de títulos
```
Exam Set: "{Nombre Certificación} Simulator | {N} Practice Questions {Año}"
Explore:  "Practice Exams for Professional Certifications | SimulatorExam"
Home:     "SimulatorExam — Prepare for Any Certification | Free Practice"
```

### Structured Data: Exam Set (JSON-LD)
```jsx
// En ExamSetLandingPage.jsx — agregar al SEOHead o como <script> directo
const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Course",
  "name": examSet.title,
  "description": examSet.description,
  "provider": { "@type": "Organization", "name": "SimulatorExam", "url": "https://simulatorexam.web.app" },
  "url": `https://simulatorexam.web.app/explore/${slug}`,
  "numberOfCredits": examSet.questionCount,
  "inLanguage": "es",
}
// <script type="application/ld+json">{JSON.stringify(jsonLd)}</script>
```

---

## Monitoreo Semanal (10 min)

```
1. Performance → últimos 28 días
   ✓ Clicks y impresiones en tendencia ascendente?
   ✓ CTR promedio > 3%? (objetivo)
   ✓ Posición promedio < 15? (objetivo primario)

2. Coverage → errores = 0 es el objetivo
   ✓ "Valid" aumenta con nuevas páginas indexadas
   ✓ Investigar cualquier "Error" nuevo inmediatamente

3. Core Web Vitals → "Good URLs" > 75%
   ✓ Issues LCP: imagen LCP tiene fetchpriority="high"?
   ✓ Issues CLS: ¿elementos sin dimensiones explícitas?
   ✓ Issues FID/INP: ¿JS pesado bloquea interacciones?

4. Sitemaps → Status = "Success", 0 errores
```

---

## Quick Wins de SEO para React SPA

```
1. Pre-render páginas clave:
   npm install vite-plugin-prerender
   Páginas: /, /explore, /pricing, /explore/:slug (top slugs)

2. Lazy load imágenes below-fold:
   <img loading="lazy" />

3. Font preload:
   <link rel="preload" as="font" type="font/woff2" href="/fonts/inter.woff2" crossorigin>

4. LCP image hint:
   <img fetchpriority="high" src="/hero.webp" alt="...">

5. Canonical tags:
   <link rel="canonical" href="https://simulatorexam.web.app/explore/developer-senior">
```

---

## Checklist de Auditoría

- [ ] `public/robots.txt` con Disallow correcto
- [ ] `public/sitemap.xml` con todas las páginas públicas
- [ ] Sitemap enviado en GSC (Indexación → Sitemaps)
- [ ] SEOHead con `noindex` en /dashboard, /profile, /exam, /results
- [ ] SEOHead con `title` y `description` únicos en páginas públicas
- [ ] JSON-LD Course en ExamSetLandingPage
- [ ] Canonical URL configurada en SEOHead
- [ ] URL Inspection en `/` y `/explore/:slug` — verificar contenido real
- [ ] Core Web Vitals Mobile: LCP < 2.5s, CLS < 0.1
- [ ] GSC linked a GA4 (Admin → Search Console integration)
- [ ] Coverage report sin errores

---

## Documentación Oficial
- Get Started: https://developers.google.com/search/docs/monitor-debug/search-console-start
- SEO Starter Guide: https://developers.google.com/search/docs/fundamentals/seo-starter-guide
- Core Web Vitals: https://web.dev/explore/learn-core-web-vitals
- Structured Data: https://developers.google.com/search/docs/appearance/structured-data
- Sitemap: https://developers.google.com/search/docs/crawling-indexing/sitemaps/build-sitemap
- PageSpeed Insights: https://pagespeed.web.dev/
