import { onIdleOrTimeout } from './deferredThirdPartyScripts';
import { readStoredConsent } from '../../features/consent/consent';

/**
 * Defers the actual network load of GTM and the Meta Pixel script.
 * The `fbq` stub and Consent Mode v2 wiring stay synchronous in index.html —
 * only the third-party script tags themselves are pushed to idle/timeout,
 * since dataLayer/fbq queue calls made before the scripts arrive.
 */
function loadGtm() {
  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push({ 'gtm.start': new Date().getTime(), event: 'gtm.js' });
  const script = document.createElement('script');
  script.async = true;
  script.src = 'https://www.googletagmanager.com/gtm.js?id=GTM-MXR43F8H';
  document.head.appendChild(script);
}

function loadMetaPixelScript() {
  const script = document.createElement('script');
  script.async = true;
  script.src = 'https://connect.facebook.net/en_US/fbevents.js';
  document.head.appendChild(script);
}

// Official Microsoft Clarity loader snippet, adapted to this project's style.
// No-ops if VITE_CLARITY_PROJECT_ID isn't configured (project without Clarity
// set up yet), and only ever runs once — guarded by `clarityLoaded` below.
let clarityLoaded = false;
function loadClarityScript() {
  const projectId = import.meta.env.VITE_CLARITY_PROJECT_ID;
  if (!projectId || clarityLoaded) return;
  clarityLoaded = true;

  window.clarity = window.clarity || function () { (window.clarity.q = window.clarity.q || []).push(arguments); };
  const script = document.createElement('script');
  script.async = true;
  script.src = `https://www.clarity.ms/tag/${projectId}`;
  document.head.appendChild(script);
}

onIdleOrTimeout(() => {
  loadGtm();
  loadMetaPixelScript();
  // Clarity carries analytics cookies, so it only loads once the user has
  // granted consent (Consent Mode v2 analytics_storage) — see consent.js.
  if (readStoredConsent() === 'granted') {
    loadClarityScript();
  }
});

// If the user answers the cookie banner after this initial idle/timeout
// window, load Clarity retroactively instead of waiting for a page reload.
window.addEventListener('certzen:consent-changed', (event) => {
  if (event.detail.granted === true) {
    loadClarityScript();
  }
});
