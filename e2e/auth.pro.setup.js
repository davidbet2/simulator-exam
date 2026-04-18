/**
 * Pro-user authentication setup.
 *
 * kathe9029@gmail.com is a Google-OAuth-only account (no password).
 * Two options:
 *
 * Option A (preferred) — link email/password in Firebase Console:
 *   Firebase Console → Authentication → kathe9029@gmail.com → Edit → Add Email/Password
 *   Then set E2E_PRO_USER_EMAIL=kathe9029@gmail.com + E2E_PRO_USER_PASSWORD=<linked pw>
 *
 * Option B — supply a valid Firebase idToken directly:
 *   Open the app in DevTools → Console:
 *     copy(await firebase.auth().currentUser.getIdToken())
 *   Set E2E_PRO_FIREBASE_TOKEN=<paste here> (valid for 1h)
 *   Set E2E_PRO_FIREBASE_UID=<user UID>
 *   Set E2E_PRO_FIREBASE_EMAIL=kathe9029@gmail.com
 *
 * If neither is set, pro-user tests are skipped gracefully.
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

  let authPayload;

  if (email && password) {
    // Option A: email/password linked to the Google account
    authPayload = await restSignIn(request, email, password);
  } else {
    // Option B: manually-obtained idToken
    authPayload = {
      idToken:      rawToken,
      refreshToken: '',
      expiresIn:    '3600',
      localId:      rawUid   || 'pro-user-uid',
      email:        rawEmail || 'kathe9029@gmail.com',
      displayName:  'Kathe',
      photoUrl:     '',
    };
  }

  await page.goto('/');
  await injectFirebaseAuth(page, authPayload);
  await page.reload({ waitUntil: 'load' });
  await page.context().storageState({ path: authFile, indexedDB: true });
});
