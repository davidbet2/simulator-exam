const { onDocumentWritten, onDocumentCreated } = require('firebase-functions/v2/firestore')
const { onCall, onRequest, HttpsError } = require('firebase-functions/v2/https')
const { onSchedule } = require('firebase-functions/v2/scheduler')
const { defineSecret } = require('firebase-functions/params')
const { initializeApp } = require('firebase-admin/app')
const { getFirestore } = require('firebase-admin/firestore')
const { getDatabase } = require('firebase-admin/database')
const { getAuth } = require('firebase-admin/auth')
const { randomUUID } = require('crypto')

// databaseURL must be explicit — Admin SDK cannot reliably auto-detect the
// Realtime Database instance URL in the Cloud Functions Gen2 runtime.
initializeApp({
  databaseURL: 'https://simulatorexam-dec4b-default-rtdb.firebaseio.com',
})

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
                      <p style="margin:4px 0 0;color:#94a3b8;font-size:14px;">Simulador de certificaciones</p>
                    </td>
                  </tr>

                  <!-- Body -->
                  <tr>
                    <td style="padding:40px;">
                      <h2 style="margin:0 0 16px;font-size:20px;font-weight:600;color:#f1f5f9;">¡Hola, ${name}! 👋</h2>
                      <p style="margin:0 0 20px;color:#94a3b8;font-size:15px;line-height:1.6;">
                        Tu cuenta en <strong style="color:#f1f5f9;">CertZen</strong> está lista. Ahora puedes practicar para tus certificaciones con preguntas actualizadas y simuladores de examen.
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
                        <li>Practicar con el <strong style="color:#f1f5f9;">simulador de tu certificación</strong></li>
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

function escapeHtml(value) {
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
}

// ─────────────────────────────────────────────────────────────────────────────
// sendVerificationEmail / sendPasswordResetEmailCustom — branded replacements
// for Firebase Auth's built-in verification/reset emails.
//
// Firebase Auth's own email delivery only supports customization through the
// Console template editor (Authentication → Templates), which this project's
// account currently cannot save changes to ("no se pueden actualizar las
// plantillas de correo electrónico de este proyecto" — a Firebase-side
// restriction, not something fixable from here). Rather than wait on that,
// these callables generate the same real Firebase oobCode link with the
// Admin SDK (generateEmailVerificationLink / generatePasswordResetLink) and
// deliver it ourselves via Resend — same transport as sendWelcomeEmail above,
// same %LINK%-style branded HTML. The generated link still lands on
// /auth/action?mode=verifyEmail|resetPassword&oobCode=..., so
// AuthActionPage.jsx keeps handling it exactly as before.
//
// Secrets: RESEND_API_KEY (already configured, re-used from sendWelcomeEmail)
// ─────────────────────────────────────────────────────────────────────────────
const ACTION_URL = 'https://certzen.app/auth/action'

function emailShell({ badgeIcon, title, subtitle, bodyHtml, ctaHref, ctaLabel, extraHtml, footerNote }) {
  return `
    <!DOCTYPE html>
    <html lang="es">
    <head>
      <meta charset="UTF-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <title>${title}</title>
    </head>
    <body style="margin:0;padding:0;background:#0d0d20;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;">
      <table width="100%" cellpadding="0" cellspacing="0" style="background:#0d0d20;padding:40px 20px;">
        <tr>
          <td align="center">
            <table width="560" cellpadding="0" cellspacing="0" bgcolor="#15142f" style="background-image:linear-gradient(160deg,#0F0F2A 0%,#1A0E3C 55%,#0D1F3C 100%);background-color:#15142f;border-radius:20px;border:1px solid #2a2450;overflow:hidden;">
              <tr>
                <td style="padding:44px 40px 0;">
                  <table cellpadding="0" cellspacing="0">
                    <tr>
                      <td style="width:34px;height:34px;background:#6366f1;background-image:linear-gradient(0deg,#6366f1 0%,#8b5cf6 100%);border-radius:10px;text-align:center;vertical-align:middle;font-size:16px;">🛡️</td>
                      <td style="padding-left:10px;color:#ffffff;font-size:19px;font-weight:700;">CertZen</td>
                    </tr>
                  </table>

                  <div style="margin:30px 0 0;width:64px;height:64px;background:#6366f1;background-image:linear-gradient(0deg,#6366f1 0%,#8b5cf6 100%);border-radius:16px;text-align:center;line-height:64px;font-size:28px;">${badgeIcon}</div>

                  <h1 style="margin:22px 0 10px;font-size:26px;line-height:1.25;font-weight:800;color:#ffffff;letter-spacing:-0.3px;">${title}</h1>
                  <p style="margin:0 0 26px;font-size:15px;line-height:1.55;color:rgba(255,255,255,0.6);">${subtitle}</p>

                  ${bodyHtml}

                  <table cellpadding="0" cellspacing="0" width="100%" style="margin:26px 0 0;">
                    <tr>
                      <td align="center" style="background:#6366f1;background-image:linear-gradient(0deg,#6366f1 0%,#8b5cf6 100%);border-radius:14px;">
                        <a href="${ctaHref}" style="display:block;padding:16px 24px;color:#ffffff;font-size:16px;font-weight:700;text-decoration:none;text-align:center;">${ctaLabel}</a>
                      </td>
                    </tr>
                  </table>

                  ${extraHtml || ''}

                  <p style="margin:22px 0 0;font-size:12px;line-height:1.5;color:rgba(255,255,255,0.35);word-break:break-all;">
                    Si el botón no funciona, copia y pega este enlace: <a href="${ctaHref}" style="color:#8b8bf5;">${ctaHref}</a>
                  </p>
                </td>
              </tr>
              <tr>
                <td style="padding:28px 40px 40px;">
                  <div style="height:1px;background:rgba(255,255,255,0.08);margin-bottom:20px;"></div>
                  <p style="margin:0 0 6px;font-size:13px;font-weight:600;color:rgba(255,255,255,0.4);">CertZen — Simulador de certificaciones</p>
                  <p style="margin:0;font-size:12px;line-height:1.5;color:rgba(255,255,255,0.4);">${footerNote}</p>
                </td>
              </tr>
            </table>
          </td>
        </tr>
      </table>
    </body>
    </html>
  `
}

function verificationEmailHtml({ name, link }) {
  return emailShell({
    badgeIcon: '📩',
    title: 'Verifica tu correo electrónico',
    subtitle: 'Confirma que esta dirección te pertenece para asegurar tu cuenta en CertZen.',
    bodyHtml: `
      <p style="margin:0 0 4px;font-size:15px;line-height:1.6;color:rgba(255,255,255,0.6);">Hola, ${escapeHtml(name)}:</p>
      <p style="margin:0;font-size:15px;line-height:1.6;color:rgba(255,255,255,0.6);">Recibimos tu registro en CertZen. Para activar tu cuenta y acceder a los simulacros, confirma tu correo electrónico con el botón de abajo.</p>
    `,
    ctaHref: link,
    ctaLabel: 'Verificar mi correo',
    extraHtml: `
      <p style="margin:20px 0 0;font-size:13px;line-height:1.5;color:rgba(255,255,255,0.4);">Si no creaste una cuenta en CertZen, puedes ignorar este correo sin problema.</p>
    `,
    footerNote: 'Recibiste este correo porque te registraste en certzen.app. Si no fuiste tú, ignóralo.',
  })
}

function passwordResetEmailHtml({ link }) {
  return emailShell({
    badgeIcon: '🔑',
    title: 'Restablece tu contraseña',
    subtitle: 'Recibimos una solicitud para cambiar la contraseña de tu cuenta en CertZen.',
    bodyHtml: `
      <p style="margin:0;font-size:15px;line-height:1.6;color:rgba(255,255,255,0.6);">Haz clic en el botón siguiente para crear una contraseña nueva. Por seguridad, este enlace es válido solo un tiempo limitado y puede usarse una sola vez.</p>
    `,
    ctaHref: link,
    ctaLabel: 'Restablecer contraseña',
    extraHtml: `
      <table cellpadding="0" cellspacing="0" width="100%" style="margin:16px 0 0;background:#241521;border:1px solid rgba(251,113,133,0.25);border-radius:14px;">
        <tr>
          <td style="padding:14px 16px;font-size:13px;line-height:1.5;color:rgba(255,255,255,0.6);">
            ⚠️ Si no solicitaste este cambio, ignora este correo: tu contraseña actual seguirá sin cambios.
          </td>
        </tr>
      </table>
    `,
    footerNote: 'Recibiste este correo porque se solicitó un restablecimiento para tu cuenta en certzen.app.',
  })
}

exports.sendVerificationEmail = onCall(
  { secrets: [RESEND_SECRET] },
  async (request) => {
    if (!request.auth) {
      throw new HttpsError('unauthenticated', 'Login required')
    }
    const user = await getAuth().getUser(request.auth.uid)
    if (!user.email) {
      throw new HttpsError('failed-precondition', 'La cuenta no tiene correo asociado.')
    }
    if (user.emailVerified) {
      return { alreadyVerified: true }
    }

    const link = await getAuth().generateEmailVerificationLink(user.email, {
      url: ACTION_URL,
      handleCodeInApp: false,
    })

    const apiKey = RESEND_SECRET.value()
    if (!apiKey) {
      console.warn('sendVerificationEmail: RESEND_API_KEY not set — skipping')
      throw new HttpsError('internal', 'Servicio de correo no disponible.')
    }
    const { Resend } = require('resend')
    const resend = new Resend(apiKey)
    const name = user.displayName || user.email.split('@')[0]

    const { error } = await resend.emails.send({
      from: 'CertZen <hola@certzen.app>',
      to: user.email,
      subject: 'Verifica tu correo en CertZen 🔐',
      html: verificationEmailHtml({ name, link }),
    })

    if (error) {
      console.error('sendVerificationEmail: Resend error', error)
      throw new HttpsError('internal', 'No se pudo enviar el correo de verificación.')
    }
    console.log(`sendVerificationEmail: sent to ${user.email}`)
    return { sent: true }
  }
)

exports.sendPasswordResetEmailCustom = onCall(
  { secrets: [RESEND_SECRET] },
  async (request) => {
    const email = request.data?.email
    if (!email || typeof email !== 'string') {
      throw new HttpsError('invalid-argument', 'Email requerido.')
    }

    let link
    try {
      link = await getAuth().generatePasswordResetLink(email, {
        url: ACTION_URL,
        handleCodeInApp: false,
      })
    } catch (err) {
      // Don't reveal whether the email exists (OWASP A07 — account enumeration).
      if (err.code === 'auth/user-not-found') {
        return { sent: true }
      }
      throw err
    }

    const apiKey = RESEND_SECRET.value()
    if (!apiKey) {
      console.warn('sendPasswordResetEmailCustom: RESEND_API_KEY not set — skipping')
      throw new HttpsError('internal', 'Servicio de correo no disponible.')
    }
    const { Resend } = require('resend')
    const resend = new Resend(apiKey)

    const { error } = await resend.emails.send({
      from: 'CertZen <hola@certzen.app>',
      to: email,
      subject: 'Restablece tu contraseña en CertZen 🔑',
      html: passwordResetEmailHtml({ link }),
    })

    if (error) {
      console.error('sendPasswordResetEmailCustom: Resend error', error)
      throw new HttpsError('internal', 'No se pudo enviar el correo.')
    }
    console.log(`sendPasswordResetEmailCustom: sent to ${email}`)
    return { sent: true }
  }
)

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

    const safeName    = escapeHtml(cleanName)
    const safeEmail   = escapeHtml(cleanEmail)
    const safeMessage = escapeHtml(cleanMessage)
    const safeSubject = escapeHtml(subjectLabel)

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
            <h2 style="margin:0 0 24px;font-size:18px;font-weight:700;color:#0f172a;">${safeSubject}</h2>
            <table style="width:100%;border-collapse:collapse;margin-bottom:20px;">
              <tr>
                <td style="padding:8px 12px;background:#f8fafc;border:1px solid #e2e8f0;font-size:12px;font-weight:600;color:#64748b;width:100px">De</td>
                <td style="padding:8px 12px;border:1px solid #e2e8f0;font-size:13px;color:#0f172a;">${safeName}</td>
              </tr>
              <tr>
                <td style="padding:8px 12px;background:#f8fafc;border:1px solid #e2e8f0;font-size:12px;font-weight:600;color:#64748b;">Email</td>
                <td style="padding:8px 12px;border:1px solid #e2e8f0;font-size:13px;color:#6366f1;"><a href="mailto:${safeEmail}" style="color:#6366f1;">${safeEmail}</a></td>
              </tr>
              <tr>
                <td style="padding:8px 12px;background:#f8fafc;border:1px solid #e2e8f0;font-size:12px;font-weight:600;color:#64748b;">Asunto</td>
                <td style="padding:8px 12px;border:1px solid #e2e8f0;font-size:13px;color:#0f172a;">${safeSubject}</td>
              </tr>
            </table>
            <div style="background:#f8fafc;border:1px solid #e2e8f0;border-radius:8px;padding:16px;margin-bottom:24px;">
              <p style="margin:0;font-size:13px;color:#334155;line-height:1.7;white-space:pre-wrap;">${safeMessage}</p>
            </div>
            <p style="margin:0;font-size:11px;color:#94a3b8;">Responde directamente a este email — el Reply-To apunta a ${safeEmail}</p>
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

// sendSuggestionEmail — stores a suggestion in Firestore and forwards it to
// the admin inbox. Called from the SuggestionModal FAB (see SPEC 11).
// Auth is required so uid/email come from the verified token, never the body.
// Reuses the same secrets as sendContactEmail (RESEND_API_KEY, CONTACT_EMAIL).
const SUGGESTION_COOLDOWN_MS = 5 * 60 * 1000

exports.sendSuggestionEmail = onCall(
  {
    cors: true,
    secrets: [RESEND_SECRET, CONTACT_EMAIL],
  },
  async (request) => {
    if (!request.auth) {
      throw new HttpsError('unauthenticated', 'Login required')
    }

    const uid   = request.auth.uid
    const email = request.auth.token.email
    if (!email) {
      throw new HttpsError('invalid-argument', 'No email on auth token')
    }

    const { message, rating } = request.data ?? {}

    if (typeof message !== 'string' || message.trim().length < 10 || message.trim().length > 1000) {
      throw new HttpsError('invalid-argument', 'Invalid message length')
    }
    if (rating !== null && rating !== undefined
        && (!Number.isInteger(rating) || rating < 1 || rating > 5)) {
      throw new HttpsError('invalid-argument', 'Invalid rating')
    }

    const cleanMessage = message.trim()
    const cleanRating  = Number.isInteger(rating) ? rating : null

    const db = getFirestore()

    const lastSnap = await db.collection('suggestions')
      .where('uid', '==', uid)
      .orderBy('createdAt', 'desc')
      .limit(1)
      .get()

    if (!lastSnap.empty) {
      const lastCreatedAt = lastSnap.docs[0].data().createdAt?.toDate?.() ?? null
      if (lastCreatedAt && Date.now() - lastCreatedAt.getTime() < SUGGESTION_COOLDOWN_MS) {
        throw new HttpsError('resource-exhausted', 'Please wait before sending another suggestion')
      }
    }

    const createdAt = new Date()
    await db.collection('suggestions').add({
      uid,
      email,
      message:   cleanMessage,
      rating:    cleanRating,
      createdAt,
    })

    const apiKey  = RESEND_SECRET.value()
    const toEmail = CONTACT_EMAIL.value()

    if (!apiKey || !toEmail) {
      console.warn('sendSuggestionEmail: RESEND_API_KEY or CONTACT_EMAIL not configured')
      throw new HttpsError('internal', 'Email service not configured')
    }

    {
      const safeEmail   = escapeHtml(email)
      const safeMessage = escapeHtml(cleanMessage)
      const ratingLabel = cleanRating ? `${'⭐'.repeat(cleanRating)} (${cleanRating}/5)` : 'Sin calificación'

      const { Resend } = require('resend')
      const resend = new Resend(apiKey)

      const { error } = await resend.emails.send({
        from:    'CertZen <soporte@certzen.app>',
        to:      toEmail,
        replyTo: email,
        subject: '[CertZen Sugerencia] Nueva sugerencia de usuario',
        html: `
          <!DOCTYPE html>
          <html lang="es">
          <head><meta charset="UTF-8" /><title>Sugerencia CertZen</title></head>
          <body style="margin:0;padding:32px;background:#f8fafc;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;">
            <div style="max-width:560px;margin:0 auto;background:#ffffff;border-radius:12px;border:1px solid #e2e8f0;padding:32px;">
              <p style="margin:0 0 4px;font-size:11px;font-weight:600;color:#94a3b8;text-transform:uppercase;letter-spacing:0.05em;">Buzón de sugerencias — CertZen</p>
              <h2 style="margin:0 0 24px;font-size:18px;font-weight:700;color:#0f172a;">Nueva sugerencia</h2>
              <table style="width:100%;border-collapse:collapse;margin-bottom:20px;">
                <tr>
                  <td style="padding:8px 12px;background:#f8fafc;border:1px solid #e2e8f0;font-size:12px;font-weight:600;color:#64748b;width:100px">Usuario</td>
                  <td style="padding:8px 12px;border:1px solid #e2e8f0;font-size:13px;color:#6366f1;"><a href="mailto:${safeEmail}" style="color:#6366f1;">${safeEmail}</a></td>
                </tr>
                <tr>
                  <td style="padding:8px 12px;background:#f8fafc;border:1px solid #e2e8f0;font-size:12px;font-weight:600;color:#64748b;">Rating</td>
                  <td style="padding:8px 12px;border:1px solid #e2e8f0;font-size:13px;color:#0f172a;">${ratingLabel}</td>
                </tr>
              </table>
              <div style="background:#f8fafc;border:1px solid #e2e8f0;border-radius:8px;padding:16px;margin-bottom:24px;">
                <p style="margin:0;font-size:13px;color:#334155;line-height:1.7;white-space:pre-wrap;">${safeMessage}</p>
              </div>
              <p style="margin:0;font-size:11px;color:#94a3b8;">Responde directamente a este email — el Reply-To apunta a ${safeEmail}</p>
            </div>
          </body>
          </html>
        `,
      })

      if (error) {
        console.error('sendSuggestionEmail: Resend error', error)
        throw new HttpsError('internal', 'Failed to send email')
      }
    }

    console.log(`sendSuggestionEmail: saved suggestion from ${email}`)
    return { ok: true, createdAt: createdAt.toISOString() }
  }
)

// ─── Single-session enforcement (SPEC 06 v2 — RTDB + custom claims) ──────────
// The client can never write users/{uid}.activeSessionId or /sessions/{uid}
// directly (blocked by firestore.rules / database.rules.json) — only these
// Admin-SDK-backed functions may rotate the session marker, so clearing
// localStorage/IndexedDB on the client cannot forge or bypass it.

/**
 * Called right after a successful sign-in (email/password, Google, register).
 * Mints a new sessionId, becomes the single source of truth in RTDB
 * (used for the realtime "kick" listener) and Firestore (used by security
 * rules), and stamps it as a custom claim so rules can verify it per-request
 * without a get() roundtrip.
 */
exports.rotateSession = onCall(async (request) => {
  if (!request.auth) {
    throw new HttpsError('unauthenticated', 'Login required')
  }
  const uid = request.auth.uid
  // The caller generates and persists the id to its own localStorage BEFORE
  // this call resolves (see rotateSession() in useAuthStore.js) — writing
  // the value the client already committed to, rather than a fresh
  // server-generated one, avoids a race where the RTDB listener (attached
  // independently by onAuthStateChanged) observes the new remote value
  // before the caller's own localStorage write lands, causing a spurious
  // self-logout. A UUID-shaped string is accepted as-is; anything else
  // falls back to a server-generated id (does not affect security — the
  // value's origin doesn't matter, only Admin SDK can ever write it).
  const requestedId = request.data?.sessionId
  const sessionId = typeof requestedId === 'string' && /^[0-9a-f-]{36}$/i.test(requestedId)
    ? requestedId
    : randomUUID()

  await Promise.all([
    getDatabase().ref(`sessions/${uid}`).set({ sessionId, updatedAt: Date.now() }),
    getFirestore().doc(`users/${uid}`).update({ activeSessionId: sessionId }),
    getAuth().setCustomUserClaims(uid, { sessionId }),
  ])

  return { sessionId }
})

/** Called on manual logout — clears the session marker everywhere. */
exports.clearSession = onCall(async (request) => {
  if (!request.auth) {
    throw new HttpsError('unauthenticated', 'Login required')
  }
  const uid = request.auth.uid

  await Promise.all([
    getDatabase().ref(`sessions/${uid}`).remove(),
    getFirestore().doc(`users/${uid}`).update({ activeSessionId: null }),
    getAuth().setCustomUserClaims(uid, null),
  ])

  return { ok: true }
})

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

        case 'refund.succeeded': {
          // Partial refunds (e.g. proration adjustments) shouldn't revoke access
          if (event.data?.is_partial) break

          const email = event.data?.customer?.email
          if (email) {
            const users = await db.collection('users').where('email', '==', email).limit(1).get()
            if (!users.empty) {
              const profile = users.docs[0].data()
              await users.docs[0].ref.update({
                plan:                'free',
                isPro:               false,
                subscriptionStatus:  'refunded',
                subscriptionEndedAt: new Date(),
                updatedAt:           new Date(),
              })

              // Stop future renewals so the customer isn't charged again after a refund
              if (profile.dodoSubscriptionId) {
                try {
                  await client.subscriptions.update(profile.dodoSubscriptionId, { status: 'cancelled' })
                } catch (err) {
                  console.error('dodoWebhook: failed to cancel subscription after refund', err.message)
                }
              }
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
 * Safety-net fallback for expired subscriptions: the plan downgrade is
 * normally driven by the Dodo webhook (subscription.cancelled/expired/failed
 * above). If that webhook is ever missed or misrouted, a 'pro' user's plan
 * would otherwise never get corrected. This runs daily and downgrades any
 * 'pro' user whose subscriptionRenewsAt is more than 3 days in the past
 * (grace period covers normal renewal/webhook latency).
 */
exports.expireStalePlans = onSchedule(
  { schedule: 'every day 03:00', timeZone: 'America/Bogota' },
  async () => {
    const db = getFirestore()
    const graceMs = 3 * 24 * 60 * 60 * 1000
    const cutoff = Date.now() - graceMs

    const snap = await db.collection('users').where('plan', '==', 'pro').get()
    const batch = db.batch()
    let downgraded = 0

    snap.forEach((doc) => {
      const renewsAt = doc.data().subscriptionRenewsAt
      const renewsAtMs = renewsAt ? new Date(renewsAt).getTime() : NaN
      if (!Number.isNaN(renewsAtMs) && renewsAtMs < cutoff) {
        batch.update(doc.ref, {
          plan:                'free',
          isPro:               false,
          subscriptionStatus:  'expired',
          subscriptionEndedAt: new Date(),
          updatedAt:           new Date(),
        })
        downgraded++
      }
    })

    if (downgraded > 0) await batch.commit()
    console.log(`expireStalePlans: downgraded ${downgraded} stale pro user(s)`)
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

