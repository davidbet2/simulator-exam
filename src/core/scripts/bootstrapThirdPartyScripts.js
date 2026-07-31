import { onIdleOrTimeout } from './deferredThirdPartyScripts';

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

onIdleOrTimeout(() => {
  loadGtm();
  loadMetaPixelScript();
});
