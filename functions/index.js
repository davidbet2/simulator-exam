const { onDocumentWritten } = require('firebase-functions/v2/firestore')
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
