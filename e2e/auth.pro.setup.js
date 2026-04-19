/**
 * Pro-user authentication setup.
 *
 * Supports three options in order of preference:
 *
 * Option A — REST API (fastest): email+password registered in Firebase Auth
 *   Set E2E_PRO_USER_EMAIL + E2E_PRO_USER_PASSWORD
 *
 * Option B — UI login fallback (automatic): email+password via the login page
 *   Same env vars as A — used automatically when REST API returns INVALID_LOGIN_CREDENTIALS
 *   (handles accounts where the password is set on Firebase but REST sign-in differs)
 *
 * Option C — manual idToken:
 *   Set E2E_PRO_FIREBASE_TOKEN + E2E_PRO_FIREBASE_UID + E2E_PRO_FIREBASE_EMAIL
 *
 * If none is set, pro-user tests are skipped gracefully.
 */
import { test as setup } from '@playwright/test';
import path from 'node:path';
import fs from 'node:fs';
import { restSignIn, injectFirebaseAuth } from './helpers/firebase-auth.js';

const authFile = path.join(process.cwd(), 'e2e/.auth/pro-user.json');

setup('authenticate-pro-user', async ({ page, request }) => {
  fs.mkdirSync(path.dirname(authFile), { recursive: true });

  const email    = process.env.E2E_PRO_USER_EMAIL;
  const password = process.env.E2E_PRO_USER_PASSWORD;
  const rawToken = process.env.E2E_PRO_FIREBASE_TOKEN;
  const rawUid   = process.env.E2E_PRO_FIREBASE_UID;
  const rawEmail = process.env.E2E_PRO_FIREBASE_EMAIL;

  if (!email && !rawToken) {
    fs.writeFileSync(authFile, JSON.stringify({ cookies: [], origins: [] }, null, 2));
    setup.skip(true, 'E2E_PRO_USER_EMAIL or E2E_PRO_FIREBASE_TOKEN not set — skipping pro-user auth setup');
    return;
  }

  if (rawToken) {
    // Option C: manually-obtained idToken
    const authPayload = {
      idToken:      rawToken,
      refreshToken: '',
      expiresIn:    '3600',
      localId:      rawUid   || 'pro-user-uid',
      email:        rawEmail || email || 'pro@certzen.app',
      displayName:  '',
      photoUrl:     '',
    };
    await page.goto('/');
    await injectFirebaseAuth(page, authPayload);
    await page.context().storageState({ path: authFile });
    return;
  }

  // Option A: try REST API first (fast, no browser UI)
  let usedUI = false;
  try {
    const authPayload = await restSignIn(request, email, password);
    await page.goto('/');
    await injectFirebaseAuth(page, authPayload);
  } catch (restErr) {
    // Option B: REST failed (e.g. INVALID_LOGIN_CREDENTIALS) — fall back to UI login
    console.warn(`[pro-setup] REST sign-in failed (${restErr.message}), falling back to UI login`);
    usedUI = true;
    await page.goto('/login');
    await page.getByLabel(/correo|email/i).fill(email);
    await page.getByLabel(/contraseña|password/i).fill(password);
    await page.getByRole('button', { name: /iniciar sesión|ingresar|sign in|login/i }).click();
    // Wait for successful redirect away from /login
    await page.waitForURL((url) => !url.pathname.includes('/login'), { timeout: 15_000 });
  }

  await page.context().storageState({ path: authFile });
  if (usedUI) console.info('[pro-setup] UI login succeeded, storageState saved.');
});
