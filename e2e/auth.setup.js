/**
 * One-time authentication setup. Persists Firebase Auth state (IndexedDB)
 * so subsequent specs run already logged-in.
 *
 * Skipped automatically if E2E_USER_EMAIL/PASSWORD are not provided —
 * useful for the public-route specs (e.g., /payment-success exploit gate)
 * that must run anonymously.
 */
import { test as setup, expect } from '@playwright/test';
import path from 'node:path';
import fs from 'node:fs';

const authFile = path.join(process.cwd(), 'e2e/.auth/user.json');

setup('authenticate', async ({ page }) => {
  const email = process.env.E2E_USER_EMAIL;
  const password = process.env.E2E_USER_PASSWORD;

  if (!email || !password) {
    // Write an empty storage state so dependent projects can still load.
    fs.mkdirSync(path.dirname(authFile), { recursive: true });
    fs.writeFileSync(
      authFile,
      JSON.stringify({ cookies: [], origins: [] }, null, 2)
    );
    setup.skip(true, 'E2E_USER_EMAIL/PASSWORD not set — skipping auth setup');
    return;
  }

  await page.goto('/login');
  await page.getByLabel(/correo|email/i).fill(email);
  await page.getByLabel(/contraseña|password/i).fill(password);
  await page.getByRole('button', { name: /iniciar sesión|sign in|login/i }).click();

  // Wait for post-login redirect to a protected route
  await page.waitForURL(/\/(welcome|dashboard|profile)/, { timeout: 20_000 });
  await expect(page).toHaveURL(/\/(welcome|dashboard|profile)/);

  // CRITICAL: Firebase Auth stores its token in IndexedDB, not cookies.
  // Without `indexedDB: true` the session would be lost between specs.
  await page.context().storageState({ path: authFile, indexedDB: true });
});
