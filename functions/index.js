const { onDocumentWritten, onDocumentCreated } = require('firebase-functions/v2/firestore')
const { onCall, HttpsError } = require('firebase-functions/v2/https')
const { defineSecret } = require('firebase-functions/params')
const { initializeApp } = require('firebase-admin/app')
const { getFirestore } = require('firebase-admin/firestore')

initializeApp()

// Turnstile secret key stored in Firebase Secret Manager (never in client code).
// Deploy with: firebase functions:secrets:set TURNSTILE_SECRET_KEY
const TURNSTILE_SECRET = defineSecret('TURNSTILE_SECRET_KEY')

/**
 * Verifies a Cloudflare Turnstile token server-side.
 * Called from LoginPage/RegisterPage BEFORE Firebase Auth login/register.
 * Returns { valid: true } or throws HttpsError('permission-denied').
 */
exports.verifyTurnstile = onCall(
  {
    secrets: [TURNSTILE_SECRET],
    cors: true,
  },
  async (request) => {
    const { token } = request.data
    if (!token || typeof token !== 'string') {
      throw new HttpsError('invalid-argument', 'Missing captcha token')
    }

    const secret = TURNSTILE_SECRET.value()
    // Skip verification in emulator/dev if no secret is configured
    if (!secret) {
      console.warn('verifyTurnstile: TURNSTILE_SECRET_KEY not set — skipping verification')
      return { valid: true }
    }

    const res = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        secret,
        response: token,
        remoteip: request.rawRequest?.ip,
      }),
    })

    if (!res.ok) {
      throw new HttpsError('internal', 'Failed to reach Turnstile verification endpoint')
    }

    const outcome = await res.json()
    if (!outcome.success) {
      console.warn('verifyTurnstile: captcha failed', outcome['error-codes'])
      throw new HttpsError('permission-denied', 'Captcha verification failed')
    }

    return { valid: true }
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
