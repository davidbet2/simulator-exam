/**
 * Playwright config — Simulator-Exam.
 *
 * Projects:
 *   setup-free     — authenticates davidbet2@hotmail.com (free plan)
 *   setup-pro      — authenticates kathe9029@gmail.com (pro plan, see auth.pro.setup.js)
 *   anonymous      — public pages, no auth, runs immediately
 *   free-user      — authenticated specs (depends on setup-free)
 *   pro-user       — authenticated specs (depends on setup-pro)
 *
 * Auth strategy: Firebase REST API login → IndexedDB injection (bypasses Turnstile).
 *
 * Run:
 *   npm run e2e                                  # headless, all projects
 *   npm run e2e:headed                           # visible browser
 *   npm run e2e:ui                               # Playwright UI
 *   npx playwright test --project=anonymous      # only public tests
 *   npx playwright test --project=free-user      # only free-user tests
 *
 * Required env vars (do NOT commit values):
 *   E2E_FREE_EMAIL      / E2E_FREE_PASSWORD      — davidbet2@hotmail.com
 *   E2E_PRO_USER_EMAIL  / E2E_PRO_USER_PASSWORD  — pro account with email/password linked
 *   OR E2E_PRO_FIREBASE_TOKEN + E2E_PRO_FIREBASE_UID + E2E_PRO_FIREBASE_EMAIL
 *   VITE_FIREBASE_API_KEY  (already in .env — used by REST login helper)
 *   PLAYWRIGHT_BASE_URL    (optional, defaults to http://localhost:5174)
 *
 * NOTE: The test server runs on port 5174 (not 5173) to avoid colliding with
 * the dev server. Never reuse an existing dev server — it may lack --mode test.
 */
import { defineConfig, devices } from '@playwright/test';
import { config as loadDotenv } from 'dotenv';

// Explicitly load .env so VITE_* vars are available to Node.js test helpers
// (Playwright's auto-dotenv runs after module evaluation — this ensures it's ready)
loadDotenv({ path: '.env', override: false });

const baseURL = process.env.PLAYWRIGHT_BASE_URL || 'http://localhost:5174';

export default defineConfig({
  testDir: './e2e',
  timeout: 60_000,
  expect: { timeout: 10_000 },
  fullyParallel: false, // auth state is shared — keep serial
  retries: process.env.CI ? 1 : 0,
  reporter: [['list'], ['html', { open: 'never' }]],
  use: {
    baseURL,
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
  },

  projects: [
    // ── Setup projects (run once, produce .auth/*.json) ──────────────────────
    {
      name: 'setup-free',
      testMatch: /auth\.setup\.js/,
    },
    {
      name: 'setup-pro',
      testMatch: /auth\.pro\.setup\.js/,
    },

    // ── Anonymous (no auth, no setup dependency) ─────────────────────────────
    {
      name: 'anonymous',
      testMatch: /public\.spec\.js|exploit\.spec\.js|smoke\.spec\.js/,
      use: {
        ...devices['Desktop Chrome'],
        storageState: { cookies: [], origins: [] },
      },
    },

    // ── Free user ─────────────────────────────────────────────────────────────
    {
      name: 'free-user',
      testMatch: /free-user\.spec\.js/,
      use: {
        ...devices['Desktop Chrome'],
        storageState: 'e2e/.auth/free-user.json',
      },
      dependencies: ['setup-free'],
    },

    // ── Pro user ──────────────────────────────────────────────────────────────
    {
      name: 'pro-user',
      testMatch: /pro-user\.spec\.js/,
      use: {
        ...devices['Desktop Chrome'],
        storageState: 'e2e/.auth/pro-user.json',
      },
      dependencies: ['setup-pro'],
    },
  ],

  // Start local Vite dev server in test mode (disables Turnstile via .env.test)
  webServer: process.env.PLAYWRIGHT_NO_SERVER
    ? undefined
    : {
        command: 'npx vite --mode test --port 5174',
        url: baseURL,
        reuseExistingServer: false, // never reuse dev server — it may lack --mode test
        timeout: 120_000,
      },
});
