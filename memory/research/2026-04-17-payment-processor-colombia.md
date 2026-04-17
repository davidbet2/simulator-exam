# Research: Payment Processor for Colombian Merchant — SaaS Subscriptions

**Date:** 2026-04-17  
**Stack:** React 19 · Vite 5 · Firebase 12 (Auth + Firestore + Hosting)  
**Context:** Stripe no soporta Colombia como merchant. Necesitamos MoR para suscripción $9.99/mes, vendedor colombiano, compradores globales.

---

## Hallazgos Clave

### 🏆 Recomendación Principal: Dodo Payments

- **Colombia como merchant:** ✅ Probablemente sí (diseñado para mercados emergentes, guía explícita de Colombia)
- **Compradores globales:** ✅ 150+ países, 80+ monedas
- **Comisión en $9.99:** ~$0.85 (4.5% + $0.40) — el más barato
- **MoR (IVA/impuestos):** ✅ Maneja IVA colombiano automáticamente
- **Suscripciones:** ✅ Soporte nativo
- **Pago a Colombia:** USD SWIFT, $5 fee si <$1000 mes, $25 por payout
- **SDK:** `dodopayments` v2.28.1 (33K descargas/semana)
- **React SDK:** billingsdk.com (componentes gratis)
- **Mínimo pago:** $5 fee si <$1k, gratis si >$1k
- **Score:** 8/10

### ⚠️ Lemon Squeezy — RIESGO en 2026

- Colombia sí está en la lista actual, PERO...
- Stripe adquirió LS en julio 2024
- Migrando a "Stripe Managed Payments" (35 países, Colombia NO confirmada)
- CEO recomienda Stripe Atlas para países no soportados
- SDK no actualizado en >1 año
- **NO recomendado para nueva integración**

### ❌ Descartados

| Procesador | Razón |
|---|---|
| Paddle | Colombia no confirmada, soporte pésimo |
| Gumroad | Usa Stripe internamente → mismo problema |
| PayU | Solo Colombia doméstico, no MoR |
| Wompi | Solo COP, no global |

---

## Tabla Comparativa

| Criterio | Dodo Payments | Lemon Squeezy | Paddle |
|---|---|---|---|
| Colombia merchant | ⚠️ Likely | ✅ Actual / ⚠️ Futuro | ❓ |
| Compradores globales | ✅ 150+ | ✅ 200+ | ✅ |
| Fee en $9.99 | ~$0.85 | ~$1.00 | ~$1.00 |
| MoR (IVA) | ✅ | ✅ | ✅ |
| Suscripciones | ✅ | ✅ | ✅ |
| SDK gzipped | 14.3kB | 3.1kB | ~5kB |
| Estabilidad 2026 | ✅ Creciendo | ⚠️ Transición | ✅ |

---

## Arquitectura de Integración con Firebase

```
Cliente React
    └→ Cloud Function (crea checkout session via Dodo API)
         └→ Redirect a Dodo hosted checkout URL

Dodo Webhook
    └→ Cloud Function (valida HMAC-SHA256 signature)
         └→ Firestore: users/{uid}.plan = 'pro' | 'free'
```

**Reemplaza:** `@invertase/firestore-stripe-payments` (Firebase Extension)  
**Sin Extension:** La lógica vive en 2 Cloud Functions propias

---

## Pasos de Implementación (cuando se apruebe)

1. Crear cuenta en app.dodopayments.com (KYC < 1 hora según comunidad)
2. Crear producto "CertZen Pro" — $9.99/mes USD
3. Guardar `DODO_API_KEY` y `DODO_WEBHOOK_SECRET` en Firebase Environment (nunca en cliente)
4. Cloud Function `createDodoCheckout`: llama Dodo API → retorna `checkoutUrl`
5. Cloud Function `dodoWebhook`: valida firma → actualiza Firestore
6. Client: redirige a `checkoutUrl` (zero SDK en cliente)

---

## Seguridad

- Webhook: `standardwebhooks` (incluido en Dodo SDK) — HMAC-SHA256
- API keys: solo en Cloud Functions environment, nunca en `.env` del cliente
- PCI DSS Level 1 (Dodo)
