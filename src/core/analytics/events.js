/**
 * analytics/events.js — GA4 event tracking module
 *
 * Usage:
 *   import { analytics } from '../../../core/analytics/events'
 *   analytics.examStart({ certId: 'appian-developer', mode: 'exam' })
 *
 * NEVER pass PII (email, uid, displayName) as event parameters.
 * GA4 Measurement ID: G-8D9V2T76SG (managed via GTM-MXR43F8H)
 */

function gtag(...args) {
  if (typeof window === 'undefined') return;
  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push(args);
}

export const analytics = {
  /** Fired when user starts an exam session */
  examStart({ certId, mode, questionCount } = {}) {
    gtag('event', 'exam_start', {
      cert_id:        certId  ?? 'unknown',
      exam_mode:      mode    ?? 'exam',
      question_count: questionCount ?? 0,
    });
  },

  /** Fired when user finishes an exam (reaches results) */
  examComplete({ certId, mode, score, total, passed } = {}) {
    const pct = total > 0 ? Math.round((score / total) * 100) : 0;
    gtag('event', 'exam_complete', {
      cert_id:    certId ?? 'unknown',
      exam_mode:  mode   ?? 'exam',
      score_pct:  pct,
      passed:     passed ? 'true' : 'false',
    });
  },

  /** Fired on first-time Google Sign-In or email/password registration */
  signUp({ method } = {}) {
    gtag('event', 'sign_up', { method: method ?? 'email' });
  },

  /** Fired on subsequent logins (existing user) */
  login({ method } = {}) {
    gtag('event', 'login', { method: method ?? 'email' });
  },

  /** Fired when user clicks any "Upgrade to Pro" CTA */
  selectPromotion({ location } = {}) {
    gtag('event', 'select_promotion', {
      promotion_name: 'upgrade_to_pro',
      location:       location ?? 'unknown',
    });
  },

  /** Fired on successful plan purchase */
  purchase({ planId, value, currency = 'USD' } = {}) {
    gtag('event', 'purchase', {
      currency,
      value:   value ?? 0,
      items: [{ item_id: planId ?? 'pro', item_name: 'CertZen Pro' }],
    });
  },

  /** SPA route change — called by AppRouter ScrollToTop */
  pageView({ path, title } = {}) {
    gtag('event', 'page_view', {
      page_path:  path  ?? window.location.pathname,
      page_title: title ?? document.title,
      send_to:    'G-8D9V2T76SG',
    });
  },
};
