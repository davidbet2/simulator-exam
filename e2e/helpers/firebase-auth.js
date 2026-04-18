/**
 * firebase-auth.js — E2E helper
 *
 * Signs in via Firebase Auth REST API (bypasses browser UI + Turnstile).
 * Injects the resulting auth state into IndexedDB in the format the
 * Firebase v9+ modular SDK expects, so subsequent page loads are
 * already authenticated.
 *
 * Works for email/password accounts. For Google-only accounts supply
 * E2E_PRO_FIREBASE_TOKEN (a valid idToken obtained manually via the
 * app or Firebase console).
 */

/**
 * Sign in via REST API and return the Firebase auth payload.
 * @param {import('@playwright/test').APIRequestContext} request
 * @param {string} email
 * @param {string} password
 */
export async function restSignIn(request, email, password) {
  const apiKey = process.env.VITE_FIREBASE_API_KEY;
  if (!apiKey) throw new Error('VITE_FIREBASE_API_KEY is not set in environment');
  const identityUrl = `https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${apiKey}`;
  const resp = await request.post(identityUrl, {
    headers: { 'Content-Type': 'application/json' },
    data: { email, password, returnSecureToken: true },
  });
  if (!resp.ok()) {
    const body = await resp.json().catch(() => ({}));
    throw new Error(`Firebase sign-in failed (${resp.status()}): ${body?.error?.message}`);
  }
  return resp.json();
}

/**
 * Inject Firebase auth state into the browser's IndexedDB so it survives
 * across spec files without a visible login flow.
 *
 * @param {import('@playwright/test').Page} page
 * @param {object} authPayload  — response from restSignIn or {idToken, uid, email, ...}
 */
export async function injectFirebaseAuth(page, authPayload) {
  const apiKey = process.env.VITE_FIREBASE_API_KEY;
  const {
    idToken,
    refreshToken,
    expiresIn = '3600',
    localId,
    email,
    displayName = '',
    photoUrl = '',
  } = authPayload;

  const expirationTime = Date.now() + parseInt(expiresIn, 10) * 1000;

  // Value stored by the Firebase v9 SDK
  const authUser = {
    uid: localId,
    email,
    emailVerified: true,
    displayName: displayName || email.split('@')[0],
    photoURL: photoUrl || null,
    isAnonymous: false,
    providerData: [
      {
        uid: email,
        email,
        displayName: displayName || '',
        photoURL: photoUrl || null,
        providerId: 'password',
      },
    ],
    stsTokenManager: {
      refreshToken,
      accessToken: idToken,
      expirationTime,
    },
    createdAt: String(Date.now()),
    lastLoginAt: String(Date.now()),
    apiKey,
    appName: '[DEFAULT]',
  };

  await page.evaluate(
    ([key, value]) => {
      return new Promise((resolve, reject) => {
        const openReq = indexedDB.open('firebaseLocalStorageDb', 1);
        openReq.onupgradeneeded = (event) => {
          const db = event.target.result;
          if (!db.objectStoreNames.contains('firebaseLocalStorage')) {
            db.createObjectStore('firebaseLocalStorage', { keyPath: 'fbase_key' });
          }
        };
        openReq.onsuccess = () => {
          const db = openReq.result;
          const tx = db.transaction('firebaseLocalStorage', 'readwrite');
          const store = tx.objectStore('firebaseLocalStorage');
          store.put({ fbase_key: key, value });
          tx.oncomplete = resolve;
          tx.onerror = (e) => reject(e.target.error);
        };
        openReq.onerror = (e) => reject(e.target.error);
      });
    },
    [`firebase:authUser:${apiKey}:[DEFAULT]`, authUser]
  );
}
