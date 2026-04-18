const { onDocumentWritten, onDocumentCreated } = require('firebase-functions/v2/firestore')
const { onCall, onRequest, HttpsError } = require('firebase-functions/v2/https')
const { defineSecret } = require('firebase-functions/params')
const { initializeApp } = require('firebase-admin/app')
const { getFirestore } = require('firebase-admin/firestore')

initializeApp()

// ─── Secrets ──────────────────────────────────────────────────────────────────
// Turnstile secret key stored in Firebase Secret Manager (never in client code).
// Deploy with: firebase functions:secrets:set TURNSTILE_SECRET_KEY
const TURNSTILE_SECRET = defineSecret('TURNSTILE_SECRET_KEY')

// Dodo Payments secrets
// Deploy with: firebase functions:secrets:set DODO_API_KEY
//              firebase functions:secrets:set DODO_WEBHOOK_KEY
const DODO_API_KEY     = defineSecret('DODO_API_KEY')
const DODO_WEBHOOK_KEY = defineSecret('DODO_WEBHOOK_KEY')

/**
 * Verifies a Cloudflare Turnstile token server-side.
 * Called from LoginPage/RegisterPage BEFORE Firebase Auth login/register.
 * Using onRequest (not onCall) so that we can set CORS headers manually for
 * the OPTIONS preflight — onCall+secrets blocks OPTIONS at the Cloud Run level.
 */
const ALLOWED_ORIGINS_TURNSTILE = [
  'https://certzen.app',
  'https://www.certzen.app',
  'https://simulatorexam-dec4b.web.app',
  'https://simulatorexam-dec4b.firebaseapp.com',
]

function setCorsHeaders(req, res) {
  const origin = req.headers.origin
  if (origin && (ALLOWED_ORIGINS_TURNSTILE.includes(origin) || /^http:\/\/localhost:\d+$/.test(origin))) {
    res.set('Access-Control-Allow-Origin', origin)
  }
  res.set('Access-Control-Allow-Methods', 'POST, OPTIONS')
  res.set('Access-Control-Allow-Headers', 'Content-Type')
  res.set('Access-Control-Max-Age', '3600')
}

exports.verifyTurnstile = onRequest(
  { secrets: [TURNSTILE_SECRET] },
  async (req, res) => {
    setCorsHeaders(req, res)

    if (req.method === 'OPTIONS') {
      res.status(204).send('')
      return
    }

    if (req.method !== 'POST') {
      res.status(405).json({ error: 'Method not allowed' })
      return
    }

    const { token } = req.body
    if (!token || typeof token !== 'string') {
      res.status(400).json({ error: 'Missing captcha token' })
      return
    }

    const secret = TURNSTILE_SECRET.value()
    // Skip verification in emulator/dev if no secret is configured
    if (!secret) {
      console.warn('verifyTurnstile: TURNSTILE_SECRET_KEY not set — skipping verification')
      res.json({ valid: true })
      return
    }

    const verifyRes = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        secret,
        response: token,
        remoteip: req.ip,
      }),
    })

    if (!verifyRes.ok) {
      res.status(500).json({ error: 'Failed to reach Turnstile verification endpoint' })
      return
    }

    const outcome = await verifyRes.json()
    if (!outcome.success) {
      console.warn('verifyTurnstile: captcha failed', outcome['error-codes'])
      res.status(403).json({ error: 'Captcha verification failed' })
      return
    }

    res.json({ valid: true })
  }
)

/**
 * Bridge function: syncs subscription status from the Invertase Stripe Extension
 * to the app's users/{uid}.plan field so that useAuthStore/useUserPlan work unchanged.
 *
 * Triggered when the Extension writes to customers/{uid}/subscriptions/{subId}
 * after a Stripe webhook event (checkout.session.completed, subscription updated/deleted).
 */
exports.syncSubscriptionPlan = onDocumentWritten(
  'customers/{uid}/subscriptions/{subId}',
  async (event) => {
    const uid = event.params.uid
    const subData = event.data.after.exists ? event.data.after.data() : null

    const isActive =
      subData !== null &&
      (subData.status === 'active' || subData.status === 'trialing')

    try {
      await getFirestore()
        .doc(`users/${uid}`)
        .set({ plan: isActive ? 'pro' : 'free' }, { merge: true })
    } catch (err) {
      console.error(`syncSubscriptionPlan: failed to update users/${uid}.plan`, err)
      throw err
    }
  }
)

// ─────────────────────────────────────────────────────────────────────────────
// sendWelcomeEmail — fires when a new document is created at users/{uid}.
// Both register() and loginWithGoogle() (first time) write this document,
// so all registration paths are covered with a single v2 Firestore trigger.
// No App Engine SA required (v2 uses the Compute SA already configured).
// Deploy secret: firebase functions:secrets:set RESEND_API_KEY
// ─────────────────────────────────────────────────────────────────────────────
const RESEND_SECRET = defineSecret('RESEND_API_KEY')

exports.sendWelcomeEmail = onDocumentCreated(
  {
    document: 'users/{uid}',
    secrets: [RESEND_SECRET],
  },
  async (event) => {
    const data = event.data?.data()
    if (!data) return

    const { email, displayName } = data

    // Guard: skip if no email
    if (!email) return

    const apiKey = RESEND_SECRET.value()
    if (!apiKey) {
      console.warn('sendWelcomeEmail: RESEND_API_KEY not set — skipping')
      return
    }

    const { Resend } = require('resend')
    const resend = new Resend(apiKey)

    const name = displayName || email.split('@')[0]

    const { error } = await resend.emails.send({
      from: 'CertZen <hola@certzen.app>',
      to: email,
      subject: '¡Bienvenido/a a CertZen! 🎯',
      html: `
        <!DOCTYPE html>
        <html lang="es">
        <head>
          <meta charset="UTF-8" />
          <meta name="viewport" content="width=device-width, initial-scale=1.0" />
          <title>Bienvenido a CertZen</title>
        </head>
        <body style="margin:0;padding:0;background:#0f1117;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;">
          <table width="100%" cellpadding="0" cellspacing="0" style="background:#0f1117;padding:40px 20px;">
            <tr>
              <td align="center">
                <table width="540" cellpadding="0" cellspacing="0" style="background:#1a1d2e;border-radius:16px;border:1px solid #2a2d3e;overflow:hidden;">

                  <!-- Header -->
                  <tr>
                    <td style="padding:40px 40px 32px;text-align:center;border-bottom:1px solid #2a2d3e;">
                      <div style="display:inline-block;width:56px;height:56px;background:rgba(99,102,241,0.15);border-radius:16px;line-height:56px;text-align:center;font-size:28px;margin-bottom:16px;">🛡️</div>
                      <h1 style="margin:0;font-size:24px;font-weight:700;color:#f1f5f9;letter-spacing:-0.5px;">CertZen</h1>
                      <p style="margin:4px 0 0;color:#94a3b8;font-size:14px;">Certificaciones Appian</p>
                    </td>
                  </tr>

                  <!-- Body -->
                  <tr>
                    <td style="padding:40px;">
                      <h2 style="margin:0 0 16px;font-size:20px;font-weight:600;color:#f1f5f9;">¡Hola, ${name}! 👋</h2>
                      <p style="margin:0 0 20px;color:#94a3b8;font-size:15px;line-height:1.6;">
                        Tu cuenta en <strong style="color:#f1f5f9;">CertZen</strong> está lista. Ahora puedes practicar para tus certificaciones Appian con preguntas actualizadas y simuladores de examen.
                      </p>

                      <!-- CTA Button -->
                      <table cellpadding="0" cellspacing="0" style="margin:28px 0;">
                        <tr>
                          <td style="background:#6366f1;border-radius:10px;">
                            <a href="https://certzen.app" style="display:inline-block;padding:14px 32px;color:#ffffff;font-size:15px;font-weight:600;text-decoration:none;letter-spacing:0.1px;">
                              Empezar a practicar →
                            </a>
                          </td>
                        </tr>
                      </table>

                      <p style="margin:0 0 8px;color:#94a3b8;font-size:14px;line-height:1.6;">
                        Lo que puedes hacer ahora:
                      </p>
                      <ul style="margin:0 0 24px;padding-left:20px;color:#94a3b8;font-size:14px;line-height:1.8;">
                        <li>Practicar con el simulador de <strong style="color:#f1f5f9;">Appian Senior Developer</strong></li>
                        <li>Revisar tus resultados y analizar errores</li>
                        <li>Repetir los exámenes hasta dominar cada tema</li>
                      </ul>
                    </td>
                  </tr>

                  <!-- Footer -->
                  <tr>
                    <td style="padding:24px 40px;border-top:1px solid #2a2d3e;text-align:center;">
                      <p style="margin:0;color:#475569;font-size:12px;line-height:1.6;">
                        Recibiste este email porque creaste una cuenta en
                        <a href="https://certzen.app" style="color:#6366f1;text-decoration:none;">certzen.app</a>.
                        <br/>Si no fuiste tú, puedes ignorar este mensaje.
                      </p>
                    </td>
                  </tr>

                </table>
              </td>
            </tr>
          </table>
        </body>
        </html>
      `,
    })

    if (error) {
      console.error('sendWelcomeEmail: Resend error', error)
      // Don't throw — a failed welcome email must not affect user document creation
    } else {
      console.log(`sendWelcomeEmail: sent to ${email}`)
    }
  }
)

// ─────────────────────────────────────────────────────────────────────────────
// sendContactEmail — forwards a contact form submission to the admin inbox.
// Called from ContactPage via Firebase callable (not mailto:).
// Secrets:
//   RESEND_API_KEY   — already configured (re-used from sendWelcomeEmail)
//   CONTACT_EMAIL    — admin destination address (never committed)
//                      Set with: echo "you@example.com" | firebase functions:secrets:set CONTACT_EMAIL
// ─────────────────────────────────────────────────────────────────────────────
const CONTACT_EMAIL = defineSecret('CONTACT_EMAIL')

const ALLOWED_SUBJECTS = new Set(['support', 'billing', 'content', 'other'])
const SUBJECT_LABELS = {
  support: 'Soporte técnico',
  billing: 'Cuenta y facturación',
  content: 'Reporte de contenido',
  other:   'Otro',
}

exports.sendContactEmail = onCall(
  {
    cors: true,
    secrets: [RESEND_SECRET, CONTACT_EMAIL],
  },
  async (request) => {
    const { name, email, subject, message } = request.data ?? {}

    // ── Server-side validation (OWASP A03 — Injection prevention) ──────────
    if (typeof name !== 'string' || name.trim().length < 2 || name.trim().length > 120) {
      throw new HttpsError('invalid-argument', 'Invalid name')
    }
    if (typeof email !== 'string' || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim()) || email.length > 200) {
      throw new HttpsError('invalid-argument', 'Invalid email')
    }
    if (!ALLOWED_SUBJECTS.has(subject)) {
      throw new HttpsError('invalid-argument', 'Invalid subject')
    }
    if (typeof message !== 'string' || message.trim().length < 20 || message.trim().length > 5000) {
      throw new HttpsError('invalid-argument', 'Invalid message length')
    }

    const cleanName    = name.trim()
    const cleanEmail   = email.trim()
    const cleanMessage = message.trim()
    const subjectLabel = SUBJECT_LABELS[subject]

    const apiKey       = RESEND_SECRET.value()
    const toEmail      = CONTACT_EMAIL.value()

    if (!apiKey || !toEmail) {
      console.warn('sendContactEmail: RESEND_API_KEY or CONTACT_EMAIL not configured')
      throw new HttpsError('internal', 'Email service not configured')
    }

    const { Resend } = require('resend')
    const resend = new Resend(apiKey)

    const { error } = await resend.emails.send({
      from:    'CertZen <soporte@certzen.app>',
      to:      toEmail,
      replyTo: cleanEmail,
      subject: `[CertZen Soporte] ${subjectLabel}`,
      html: `
        <!DOCTYPE html>
        <html lang="es">
        <head><meta charset="UTF-8" /><title>Contacto CertZen</title></head>
        <body style="margin:0;padding:32px;background:#f8fafc;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;">
          <div style="max-width:560px;margin:0 auto;background:#ffffff;border-radius:12px;border:1px solid #e2e8f0;padding:32px;">
            <p style="margin:0 0 4px;font-size:11px;font-weight:600;color:#94a3b8;text-transform:uppercase;letter-spacing:0.05em;">Mensaje de contacto — CertZen</p>
            <h2 style="margin:0 0 24px;font-size:18px;font-weight:700;color:#0f172a;">${subjectLabel}</h2>
            <table style="width:100%;border-collapse:collapse;margin-bottom:20px;">
              <tr>
                <td style="padding:8px 12px;background:#f8fafc;border:1px solid #e2e8f0;font-size:12px;font-weight:600;color:#64748b;width:100px">De</td>
                <td style="padding:8px 12px;border:1px solid #e2e8f0;font-size:13px;color:#0f172a;">${cleanName}</td>
              </tr>
              <tr>
                <td style="padding:8px 12px;background:#f8fafc;border:1px solid #e2e8f0;font-size:12px;font-weight:600;color:#64748b;">Email</td>
                <td style="padding:8px 12px;border:1px solid #e2e8f0;font-size:13px;color:#6366f1;"><a href="mailto:${cleanEmail}" style="color:#6366f1;">${cleanEmail}</a></td>
              </tr>
              <tr>
                <td style="padding:8px 12px;background:#f8fafc;border:1px solid #e2e8f0;font-size:12px;font-weight:600;color:#64748b;">Asunto</td>
                <td style="padding:8px 12px;border:1px solid #e2e8f0;font-size:13px;color:#0f172a;">${subjectLabel}</td>
              </tr>
            </table>
            <div style="background:#f8fafc;border:1px solid #e2e8f0;border-radius:8px;padding:16px;margin-bottom:24px;">
              <p style="margin:0;font-size:13px;color:#334155;line-height:1.7;white-space:pre-wrap;">${cleanMessage}</p>
            </div>
            <p style="margin:0;font-size:11px;color:#94a3b8;">Responde directamente a este email — el Reply-To apunta a ${cleanEmail}</p>
          </div>
        </body>
        </html>
      `,
    })

    if (error) {
      console.error('sendContactEmail: Resend error', error)
      throw new HttpsError('internal', 'Failed to send email')
    }

    console.log(`sendContactEmail: forwarded from ${cleanEmail} → ${toEmail}`)
    return { ok: true }
  }
)

/**
 * Public HTTP endpoint that returns featureFlags/global without requiring App Check.
 * Used as fallback by useFeatureFlags when App Check blocks the Firestore SDK
 * (e.g. incognito windows where reCAPTCHA v3 scores too low).
 */
exports.getPublicFlags = onRequest({ cors: true }, async (req, res) => {
  try {
    const snap = await getFirestore().doc('featureFlags/global').get()
    const data = snap.exists ? snap.data() : {}
    // Strip server-side metadata fields before returning to client
    const { updatedAt, updatedBy, ...flags } = data
    res.json({ ok: true, flags })
  } catch (err) {
    console.error('getPublicFlags error:', err)
    res.status(500).json({ ok: false, flags: {} })
  }
})

// ─── Dodo Payments ────────────────────────────────────────────────────────────

/**
 * Creates a Dodo Payments checkout session for the Pro plan.
 * Called from PricingPage → opens overlay checkout via dodopayments-checkout.
 */
exports.createDodoCheckout = onCall(
  { secrets: [DODO_API_KEY] },
  async (request) => {
    if (!request.auth) {
      throw new HttpsError('unauthenticated', 'Login required')
    }

    const DodoPayments = require('dodopayments').default
    const client = new DodoPayments({
      bearerToken: DODO_API_KEY.value(),
      environment: 'live_mode',
    })

    const { productId } = request.data
    if (!productId || typeof productId !== 'string') {
      throw new HttpsError('invalid-argument', 'Missing productId')
    }

    let session
    try {
      session = await client.checkoutSessions.create({
        product_cart: [{ product_id: productId, quantity: 1 }],
        customer: {
          email: request.auth.token.email,
          name:  request.auth.token.name ?? request.auth.token.email.split('@')[0],
          create_new_customer: false,
        },
        return_url: 'https://certzen.app/payment-success',
      })
    } catch (err) {
      console.error('createDodoCheckout: Dodo API error', {
        message: err.message,
        status:  err.status,
        body:    err.error ?? err.body ?? null,
      })
      throw new HttpsError('internal', `Dodo API error: ${err.message}`)
    }

    const checkoutUrl = session.checkout_url
    if (!checkoutUrl) {
      console.error('createDodoCheckout: no checkout_url in response', JSON.stringify(session))
      throw new HttpsError('internal', 'No checkout URL returned from Dodo')
    }

    console.log('createDodoCheckout: success', checkoutUrl.substring(0, 60))
    return { checkoutUrl }
  }
)

/**
 * Receives Dodo Payments webhooks, verifies the signature, and updates
 * the user's plan in Firestore.
 * Register this URL in Dodo Dashboard → Webhooks:
 *   https://certzen.app/api/dodo/webhook
 */
exports.dodoWebhook = onRequest(
  {
    secrets: [DODO_API_KEY, DODO_WEBHOOK_KEY],
    // Rate-limiting / DoS hardening:
    //  - concurrency: cap simultaneous in-flight requests per instance.
    //    Dodo retries are per-event, so 20 is plenty headroom.
    //  - maxInstances: hard ceiling on horizontal scale; protects billing
    //    from runaway loops and limits blast radius if signature
    //    verification is bypassed for any reason.
    //  - cpu: 1 is enough for signature verify + 1-2 Firestore writes.
    concurrency: 20,
    maxInstances: 10,
    cpu: 1,
  },
  async (req, res) => {
    const DodoPayments = require('dodopayments').default
    const client = new DodoPayments({
      bearerToken:  DODO_API_KEY.value(),
      webhookKey:   DODO_WEBHOOK_KEY.value(),
      environment:  'live_mode',
    })

    const rawBody   = req.rawBody?.toString() ?? ''
    const webhookId = req.headers['webhook-id']

    // Idempotency — skip already-processed events
    const db = getFirestore()
    const processed = await db.collection('processedWebhooks').doc(webhookId).get()
    if (processed.exists) {
      res.status(200).json({ received: true, duplicate: true })
      return
    }

    let event
    try {
      event = client.webhooks.unwrap(rawBody, {
        headers: {
          'webhook-id':        req.headers['webhook-id'],
          'webhook-signature': req.headers['webhook-signature'],
          'webhook-timestamp': req.headers['webhook-timestamp'],
        },
      })
    } catch (err) {
      console.error('dodoWebhook: invalid signature', err.message)
      res.status(401).json({ error: 'Invalid signature' })
      return
    }

    // Respond 200 immediately — Dodo retries if we take > 15s
    res.status(200).json({ received: true })

    // Mark as processed
    await db.collection('processedWebhooks').doc(webhookId).set({
      processedAt: new Date(),
      eventType:   event.type,
    })

    console.log('dodoWebhook event:', event.type)

    try {
      switch (event.type) {
        case 'subscription.active':
        case 'subscription.renewed': {
          // Find user by email and upgrade to pro
          const email = event.data?.customer?.email
          if (email) {
            const users = await db.collection('users').where('email', '==', email).limit(1).get()
            if (!users.empty) {
              await users.docs[0].ref.update({
                plan:                  'pro',
                isPro:                 true,
                dodoSubscriptionId:    event.data?.subscription_id ?? null,
                dodoCustomerId:        event.data?.customer?.customer_id ?? null,
                subscriptionStatus:    event.data?.status ?? 'active',
                subscriptionStartedAt: event.data?.previous_billing_date ?? event.data?.created_at ?? null,
                subscriptionRenewsAt:  event.data?.next_billing_date ?? null,
                updatedAt:             new Date(),
              })
            }
          }
          break
        }

        case 'subscription.cancelled':
        case 'subscription.expired':
        case 'subscription.failed': {
          const email = event.data?.customer?.email
          if (email) {
            const users = await db.collection('users').where('email', '==', email).limit(1).get()
            if (!users.empty) {
              await users.docs[0].ref.update({
                plan:               'free',
                isPro:              false,
                subscriptionStatus: event.type.split('.')[1],
                subscriptionEndedAt: new Date(),
                updatedAt:          new Date(),
              })
            }
          }
          break
        }

        case 'subscription.on_hold':
        case 'subscription.past_due': {
          // Payment failed but user still has access — give grace period
          const email = event.data?.customer?.email
          if (email) {
            const users = await db.collection('users').where('email', '==', email).limit(1).get()
            if (!users.empty) {
              await users.docs[0].ref.update({
                subscriptionStatus: event.type.split('.')[1],
                updatedAt:          new Date(),
              })
            }
          }
          break
        }

        default:
          console.log('dodoWebhook: unhandled event type', event.type)
      }
    } catch (err) {
      console.error('dodoWebhook: error processing event', event.type, err)
    }
  }
)


/**
 * Manual sync fallback: queries Dodo API for the user's active subscription
 * and updates Firestore. Called from PaymentSuccessPage if the webhook
 * hasn't arrived yet (eventual consistency).
 */
exports.syncDodoSubscription = onCall(
  { secrets: [DODO_API_KEY] },
  async (request) => {
    if (!request.auth) {
      throw new HttpsError('unauthenticated', 'Login required')
    }

    const email = request.auth.token.email
    if (!email) {
      throw new HttpsError('invalid-argument', 'No email on auth token')
    }

    const DodoPayments = require('dodopayments').default
    const client = new DodoPayments({
      bearerToken: DODO_API_KEY.value(),
      environment: 'live_mode',
    })

    // List subscriptions for this email � most recent active first
    let subs
    try {
      subs = await client.subscriptions.list({ customer_email: email, status: 'active' })
    } catch (err) {
      console.error('syncDodoSubscription: list failed', err.message)
      throw new HttpsError('internal', 'Failed to query Dodo subscriptions')
    }

    const items = subs?.items ?? subs?.data ?? []
    if (items.length === 0) {
      return { synced: false, reason: 'no_active_subscription' }
    }

    const sub = items[0]
    const db  = getFirestore()
    const users = await db.collection('users').where('email', '==', email).limit(1).get()
    if (users.empty) {
      throw new HttpsError('not-found', 'User not found in Firestore')
    }

    await users.docs[0].ref.update({
      plan:                  'pro',
      isPro:                 true,
      dodoSubscriptionId:    sub.subscription_id ?? sub.id ?? null,
      dodoCustomerId:        sub.customer?.customer_id ?? null,
      subscriptionStatus:    sub.status ?? 'active',
      subscriptionRenewsAt:  sub.next_billing_date ?? null,
      subscriptionStartedAt: sub.previous_billing_date ?? sub.created_at ?? null,
      updatedAt:             new Date(),
    })

    return { synced: true, subscriptionId: sub.subscription_id ?? sub.id }
  }
)

/**
 * Cancels the auto-renewal of a Dodo subscription (not immediate — user
 * keeps access until the current billing period ends).
 * The Dodo API sets status to 'cancelled' after the last renewal date.
 */
exports.cancelDodoSubscription = onCall(
  { secrets: [DODO_API_KEY] },
  async (request) => {
    if (!request.auth) {
      throw new HttpsError('unauthenticated', 'Login required')
    }

    const { subscriptionId } = request.data ?? {}
    if (!subscriptionId || typeof subscriptionId !== 'string') {
      throw new HttpsError('invalid-argument', 'Missing subscriptionId')
    }

    // Verify ownership: the stored dodoSubscriptionId in Firestore must match
    const db = getFirestore()
    const users = await db.collection('users').where('email', '==', request.auth.token.email).limit(1).get()
    if (users.empty) {
      throw new HttpsError('not-found', 'User not found')
    }
    const profile = users.docs[0].data()
    if (profile.dodoSubscriptionId !== subscriptionId) {
      throw new HttpsError('permission-denied', 'Subscription does not belong to this account')
    }

    const DodoPayments = require('dodopayments').default
    const client = new DodoPayments({
      bearerToken: DODO_API_KEY.value(),
      environment: 'live_mode',
    })

    try {
      await client.subscriptions.update(subscriptionId, { status: 'cancelled' })
    } catch (err) {
      console.error('cancelDodoSubscription: failed', err.message)
      throw new HttpsError('internal', 'Could not cancel subscription via Dodo API')
    }

    // Reflect cancellation intent in Firestore immediately (webhook will confirm)
    await users.docs[0].ref.update({
      subscriptionStatus: 'cancelled',
      updatedAt:          new Date(),
    })

    return { cancelled: true }
  }
)

/**
 * Returns the payment history for the authenticated user from Dodo Payments.
 */
exports.getDodoPayments = onCall(
  { secrets: [DODO_API_KEY] },
  async (request) => {
    if (!request.auth) {
      throw new HttpsError('unauthenticated', 'Login required')
    }

    const email = request.auth.token.email
    if (!email) {
      throw new HttpsError('invalid-argument', 'No email on auth token')
    }

    const DodoPayments = require('dodopayments').default
    const client = new DodoPayments({
      bearerToken: DODO_API_KEY.value(),
      environment: 'live_mode',
    })

    try {
      const result = await client.payments.list({ customer_email: email })
      const items = result?.items ?? result?.data ?? []
      // Return only the fields the UI needs — avoids leaking raw Dodo objects
      const payments = items.slice(0, 24).map((p) => ({
        payment_id:   p.payment_id ?? p.id,
        created_at:   p.created_at,
        total_amount: p.total_amount,
        currency:     p.currency,
        status:       p.status,
        receipt_url:  p.receipt_url ?? null,
      }))
      return { payments }
    } catch (err) {
      console.error('getDodoPayments: failed', err.message)
      throw new HttpsError('internal', 'Could not retrieve payment history')
    }
  }
)

/**
 * Reactivates a previously cancelled Dodo subscription (re-enables auto-renewal).
 * The subscription must still be within its active period (not yet expired).
 */
exports.reactivateDodoSubscription = onCall(
  { secrets: [DODO_API_KEY] },
  async (request) => {
    if (!request.auth) {
      throw new HttpsError('unauthenticated', 'Login required')
    }

    const { subscriptionId } = request.data ?? {}
    if (!subscriptionId || typeof subscriptionId !== 'string') {
      throw new HttpsError('invalid-argument', 'Missing subscriptionId')
    }

    // Verify ownership
    const db = getFirestore()
    const users = await db.collection('users').where('email', '==', request.auth.token.email).limit(1).get()
    if (users.empty) {
      throw new HttpsError('not-found', 'User not found')
    }
    const profile = users.docs[0].data()
    if (profile.dodoSubscriptionId !== subscriptionId) {
      throw new HttpsError('permission-denied', 'Subscription does not belong to this account')
    }

    const DodoPayments = require('dodopayments').default
    const client = new DodoPayments({
      bearerToken: DODO_API_KEY.value(),
      environment: 'live_mode',
    })

    try {
      await client.subscriptions.update(subscriptionId, { status: 'active' })
    } catch (err) {
      console.error('reactivateDodoSubscription: failed', err.message)
      throw new HttpsError('internal', 'Could not reactivate subscription via Dodo API')
    }

    await users.docs[0].ref.update({
      subscriptionStatus: 'active',
      updatedAt:          new Date(),
    })

    return { reactivated: true }
  }
)

