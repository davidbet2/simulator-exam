export const CONSENT_STORAGE_KEY = 'cookie-consent';

/** Reads the stored consent decision: 'granted' | 'denied' | null (undecided) */
export function readStoredConsent() {
  const stored = localStorage.getItem(CONSENT_STORAGE_KEY);
  return stored === 'granted' || stored === 'denied' ? stored : null;
}

/**
 * Pushes a Consent Mode v2 update for GTM/GA4. Goes through window.gtag (not a
 * raw dataLayer.push) because index.html wraps gtag to also init Meta Pixel
 * when ad_storage is granted — bypassing it would leave Meta Pixel dead.
 *
 * Also broadcasts a DOM event so components outside the gtag/dataLayer chain
 * (e.g. AdBanner, which decides whether to load Google AdSense) can react to
 * the choice without polling localStorage.
 */
export function updateConsent(granted) {
  const state = granted ? 'granted' : 'denied';
  window.dataLayer = window.dataLayer || [];
  const gtag = window.gtag || function () { window.dataLayer.push(arguments); };
  gtag('consent', 'update', {
    ad_storage:              state,
    ad_user_data:            state,
    ad_personalization:      state,
    analytics_storage:       state,
    functionality_storage:   state,
    personalization_storage: state,
  });
  window.dispatchEvent(new CustomEvent('certzen:consent-changed', { detail: { granted } }));
}
