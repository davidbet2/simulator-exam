/**
 * Free-user authentication setup.
 *
 * Uses the Firebase Auth REST API directly — bypasses the browser login form
 * and Turnstile entirely. Persists the resulting localStorage state so all
 * specs in the `free-user` project start already logged in.
 *
 * Auth persistence strategy:
 *   - In test mode (`vite --mode test`), firebase.js uses `browserLocalPersistence`
 *     instead of the default IndexedDB, so Playwright's storageState can capture it.
 *   - injectFirebaseAuth writes the token directly to localStorage.
 *   - storageState is captured immediately (no reload needed).
 *
 * Required env vars (add to .env — do NOT commit):
 *   E2E_FREE_EMAIL      free-plan account email (e.g. davidbet2@hotmail.com)
 *   E2E_FREE_PASSWORD   password for that account
 *
 * Falls back gracefully when vars are absent (setup skipped, tests will fail auth checks).
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

  // Step 2: open the app and inject the auth state into localStorage
  await page.goto('/');
  await injectFirebaseAuth(page, authPayload);

  // Step 3: capture storage state immediately after injection — no reload needed.
  // With browserLocalPersistence (used in MODE=test), Firebase reads directly from
  // localStorage on init, so Playwright's storageState captures the token correctly.
  await page.context().storageState({ path: authFile });
});
