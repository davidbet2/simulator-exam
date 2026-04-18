/**
 * Free-user authentication setup.
 *
 * Uses the Firebase Auth REST API directly — bypasses the browser login form
 * and Turnstile entirely. Persists the resulting IndexedDB state so all
 * specs in the `authenticated-free` project start already logged in.
 *
 * Required env vars:
 *   E2E_FREE_EMAIL      (free-plan account, email/password)
 *   E2E_FREE_PASSWORD
 *
 * Falls back gracefully when vars are absent.
 */
import { test as setup } from '@playwright/test';
import path from 'node:path';
import fs from 'node:fs';
import { restSignIn, injectFirebaseAuth } from './helpers/firebase-auth.js';

const authFile = path.join(process.cwd(), 'e2e/.auth/free-user.json');

setup('authenticate-free-user', async ({ page, request }) => {
  const email    = process.env.E2E_FREE_EMAIL    || process.env.E2E_USER_EMAIL;
  const password = process.env.E2E_FREE_PASSWORD || process.env.E2E_USER_PASSWORD;

  fs.mkdirSync(path.dirname(authFile), { recursive: true });

  if (!email || !password) {
    fs.writeFileSync(authFile, JSON.stringify({ cookies: [], origins: [] }, null, 2));
    setup.skip(true, 'E2E_FREE_EMAIL/PASSWORD not set — skipping free-user auth setup');
    return;
  }

  // Step 1: sign in via REST API (no browser UI, no Turnstile)
  const authPayload = await restSignIn(request, email, password);

  // Step 2: open the app and inject the auth state into IndexedDB
  await page.goto('/');
  await injectFirebaseAuth(page, authPayload);

  // Step 3: reload so the Firebase SDK picks up the injected state
  // Use 'load' instead of 'networkidle' — Firestore/RTL listeners keep network busy indefinitely
  await page.reload({ waitUntil: 'load' });

  // Step 4: persist IndexedDB (Firebase Auth token lives there)
  await page.context().storageState({ path: authFile, indexedDB: true });
});
