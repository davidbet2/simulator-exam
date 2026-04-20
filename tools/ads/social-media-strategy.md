# 📱 Social Media Advertising Strategy — CertZen
> Fecha: 2026-04-19 | Fase: Lanzamiento (mes 1-2)

---

## 1. Resumen Ejecutivo

CertZen es un simulador de certificaciones profesionales (IT, Deportes, Salud, Inglés y más) con modelo freemium. El objetivo de las campañas iniciales es:

1. **Awareness:** que el público objetivo sepa que existe CertZen
2. **Registro:** llevar tráfico cualificado a certzen.app para que se registren gratis
3. **Conversión a Pro:** nurturing hacia el plan de pago (~$9–15/mes)

---

## 2. Presupuesto Recomendado

### Mes 1–2 (Fase de Prueba): $150 USD/mes

| Canal | Presupuesto | Objetivo |
|-------|-------------|---------|
| Meta Ads (Instagram + Facebook) | $100/mes | Awareness + registros |
| LinkedIn Ads | $50/mes | IT professionals, alta intención |
| TikTok / Reels orgánico | $0 | Contenido, sin inversión inicial |
| **TOTAL** | **$150/mes** | |

### Mes 3+ (si ROAS positivo): $300–500 USD/mes
- Duplicar el canal que mejor convierte
- Añadir retargeting a quienes visitaron certzen.app sin registrarse

### ¿Por qué empezar con $150?
- Suficiente para obtener datos estadísticos significativos (500–1000 impresiones/día)
- CPC esperado en LATAM: $0.10–$0.50 Meta, $1.50–$4.00 LinkedIn
- Objetivo mes 1: **30–60 registros nuevos** a un costo de adquisición < $5/usuario

---

## 3. Plataformas de Gestión

### Meta Ads Manager (Facebook + Instagram)
- **URL:** https://adsmanager.facebook.com
- **Costo:** Gratis (solo pagas el presupuesto de ads)
- **Setup obligatorio:**
  - [ ] Crear Business Manager: business.facebook.com
  - [ ] Agregar pixel de Meta al sitio (ver sección 7)
  - [ ] Conectar cuenta de Instagram al Business Manager
  - [ ] Crear App en Facebook (para pixel y CAPI)

### LinkedIn Campaign Manager
- **URL:** https://www.linkedin.com/campaignmanager
- **Costo:** Gratis (mínimo de gasto: $10/día en LinkedIn)
- **Setup obligatorio:**
  - [ ] Crear cuenta de empresa en LinkedIn (si no existe)
  - [ ] Instalar LinkedIn Insight Tag en el sitio

### Metricool (gestión de posts orgánicos)
- **URL:** https://metricool.com
- **Plan Free:** hasta 1 marca, programación básica, analytics básico
- **Uso:** programar posts orgánicos de Instagram, Facebook, LinkedIn, TikTok desde una sola pantalla

---

## 4. Audiencias Target por Red

### Meta Ads (Instagram + Facebook)

#### Audiencia 1 — IT Professionals (mayor banco de preguntas disponible)
- **Edad:** 22–40 años
- **Intereses:** programación, software development, tecnología empresarial, BPM, automatización
- **Comportamientos:** usuarios de dispositivos de gama alta, compras online
- **Países LATAM:** Colombia, México, Argentina, Perú, Chile
- **Mensaje clave:** Certifícate en [tecnología] con el simulador más moderno del mercado

#### Audiencia 2 — Salud / Enfermería
- **Edad:** 20–45 años
- **Intereses:** enfermería, salud, medicina, NCLEX, certificaciones médicas
- **Países:** Colombia, México, España
- **Mensaje clave:** Practica para tu examen de certificación de salud. Gratis para empezar.

#### Audiencia 3 — Inglés (IELTS/TOEFL)
- **Edad:** 18–35 años
- **Intereses:** inglés, IELTS, TOEFL, idiomas, estudio en el exterior, visa
- **Países:** Colombia, México, Perú, Venezuela
- **Mensaje clave:** Simulador de examen IELTS/TOEFL en español. Practica como en el examen real.

#### Audiencia 4 — Deportes / Entrenamiento personal
- **Edad:** 20–38 años
- **Intereses:** fitness, entrenamiento personal, NASM, ACE, gimnasio, coaching deportivo
- **Países:** Colombia, México, Argentina, España
- **Mensaje clave:** Certifícate como entrenador personal. Simulador de examen NASM/ACE.

### LinkedIn Ads

#### Audiencia 1 — IT (segmento principal)
- **Cargo:** Software Developer, IT Consultant, BPM Developer, Solutions Architect, Systems Analyst
- **Empresa:** IT Consulting, Big 4, tecnología, telecomunicaciones
- **Experiencia:** 1–8 años
- **Países:** Colombia, México, Argentina, España

#### Audiencia 2 — Salud (secundario)
- **Cargo:** Nurse, RN, Healthcare Professional, Farmacéutico
- **Empresa:** hospitales, clínicas, farmacéuticas
- **Países:** LATAM

---

## 5. Objetivos de Campaña por Canal

### Meta Ads
| Campaña | Objetivo Meta | KPI | Meta mes 1 |
|---------|--------------|-----|-----------|
| Awareness IT | Brand Awareness | Impresiones, alcance | 50,000 impresiones |
| Conversión Registro | Leads / Traffic | CPC, CTR, registros | 30 registros |
| Retargeting (mes 2+) | Conversions | ROAS, costo/conversión | 5 upgrades Pro |

### LinkedIn Ads
| Campaña | Objetivo LinkedIn | KPI | Meta mes 1 |
|---------|--------------------|-----|-----------|
| IT Professionals | Website Visits | CTR, CPC | 20 visitas cualificadas |

---

## 6. Estructura de Campañas Recomendada

### Meta Ads — Estructura

```
Cuenta de Ads
└── Campaña 1: "CertZen — Registros LATAM IT"
    ├── Ad Set 1.1: IT Professionals Colombia
    │   ├── Ad A: Video 15s (demo del simulador)
    │   └── Ad B: Carrusel (3 certificaciones disponibles)
    └── Ad Set 1.2: IT Professionals México
        ├── Ad A: Video 15s
        └── Ad B: Imagen estática con CTA

└── Campaña 2: "CertZen — Registros LATAM Inglés"
    └── Ad Set 2.1: IELTS/TOEFL aspirantes
        ├── Ad A: Imagen "¿Te preparas para el IELTS?"
        └── Ad B: Story vertical

└── Campaña 3: RETARGETING (activar mes 2)
    └── Ad Set 3.1: Visitantes certzen.app sin registro (últimos 30 días)
        └── Ad A: "Te quedaste a un paso. Regístrate gratis."
```

### LinkedIn Ads — Estructura

```
Cuenta de Ads
└── Campaña 1: "CertZen IT — LinkedIn LATAM"
    └── Ad Group 1.1: Developers + Consultants IT
        ├── Ad A: Single Image Ad
        └── Ad B: Document Ad (carrusel "Guía ACD101")
```

---

## 7. Pixel / Tracking Setup

### Meta Pixel (OBLIGATORIO antes de gastar)
Agregar en `index.html` antes de `</head>`:
```html
<!-- Meta Pixel Code -->
<script>
!function(f,b,e,v,n,t,s)
{if(f.fbq)return;n=f.fbq=function(){n.callMethod?
n.callMethod.apply(n,arguments):n.queue.push(arguments)};
if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
n.queue=[];t=b.createElement(e);t.async=!0;
t.src=v;s=b.getElementsByTagName(e)[0];
s.parentNode.insertBefore(t,s)}(window, document,'script',
'https://connect.facebook.net/en_US/fbevents.js');
fbq('init', 'TU_PIXEL_ID_AQUI');
fbq('track', 'PageView');
</script>
```

Eventos a trackear en la app:
- `fbq('track', 'ViewContent')` — al ver la landing
- `fbq('track', 'CompleteRegistration')` — al registrarse
- `fbq('track', 'StartTrial')` — al iniciar primer examen
- `fbq('track', 'Purchase', {value: 9.00, currency: 'USD'})` — al comprar Pro

### LinkedIn Insight Tag
Agregar en `index.html`:
```html
<script type="text/javascript">
_linkedin_partner_id = "TU_PARTNER_ID";
window._linkedin_data_partner_ids = window._linkedin_data_partner_ids || [];
window._linkedin_data_partner_ids.push(_linkedin_partner_id);
</script>
<script type="text/javascript">
(function(l) {
if (!l){window.lintrk = function(a,b){window.lintrk.q.push([a,b])};
window.lintrk.q=[]}
var s = document.getElementsByTagName("script")[0];
var b = document.createElement("script");
b.type = "text/javascript";b.async = true;
b.src = "https://snap.licdn.com/li.lms-analytics/insight.min.js";
s.parentNode.insertBefore(b, s);})(window.lintrk);
</script>
```

---

## 8. Calendario de Lanzamiento

### Semana 1 — Setup (sin gastar aún)
- [ ] Crear Business Manager en Meta
- [ ] Instalar Meta Pixel + LinkedIn Insight Tag en la app
- [ ] Verificar dominio certzen.app en Meta Business Manager
- [ ] Abrir cuenta LinkedIn Campaign Manager
- [ ] Crear página de empresa en LinkedIn (si no existe)
- [ ] Instalar Metricool y conectar cuentas

### Semana 2 — Primer contenido orgánico
- [ ] Publicar 3 posts orgánicos en Instagram/LinkedIn (ver `creative-brief.md`)
- [ ] Verificar que el pixel está recibiendo eventos (Meta Events Manager)
- [ ] Crear las audiencias custom en Meta (visitors de certzen.app)

### Semana 3 — Lanzar primera campaña pagada
- [ ] Lanzar Campaña 1 en Meta: "CertZen Registros IT LATAM" — $50 total para la primera semana
- [ ] Lanzar Campaña en LinkedIn: IT Professionals — $50 total primera semana
- [ ] Monitorear diariamente: CTR, CPC, registros en GA4

### Semana 4 — Optimización
- [ ] Desactivar los ad sets con CTR < 0.5% en Meta
- [ ] Escalar los ad sets que traen registros a < $5 CAC
- [ ] Activar campaña de retargeting si hay > 100 visitors sin registro

---

## 9. KPIs y Benchmarks de Referencia

| Métrica | Meta Ads LATAM | LinkedIn LATAM | Objetivo CertZen |
|---------|---------------|----------------|-----------------|
| CTR | 0.5–2% | 0.3–0.8% | > 1% |
| CPC | $0.10–0.50 | $1.50–4.00 | < $0.50 Meta, < $3 LI |
| CPR (costo/registro) | $1–5 | $5–15 | < $5 promedio |
| Conversión landing→registro | — | — | > 15% |

---

## 10. Herramientas Gratuitas de Apoyo

| Herramienta | Uso | URL |
|-------------|-----|-----|
| Canva Free | Crear creativos de ads (formatos exactos incluidos en `creative-brief.md`) | canva.com |
| Meta Ads Manager | Gestión Facebook + Instagram | adsmanager.facebook.com |
| LinkedIn Campaign Manager | Gestión LinkedIn | linkedin.com/campaignmanager |
| Metricool Free | Programar posts orgánicos | metricool.com |
| Meta Business Suite | Gestión de páginas + inbox | business.facebook.com |
| Google Analytics 4 | Tracking de registros y upgrades | (ya implementado) |
