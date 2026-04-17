/**
 * Playwright config — Simulator-Exam.
 *
 * SAFETY:
 *  - Default baseURL points to the local Vite dev server (http://localhost:5173).
 *  - Override with PLAYWRIGHT_BASE_URL only when targeting a STAGING project.
 *  - NEVER point this at the production Firebase project.
 *
 * Auth strategy: a one-time `setup` project authenticates with a test account
 * and persists IndexedDB (where Firebase Auth stores its token) via
 * `storageState({ indexedDB: true })`. Other projects reuse that state.
 *
 * Run:
 *   npm run e2e            # headless
 *   npm run e2e:headed     # visible browser
 *   npm run e2e:ui         # Playwright UI
 *
 * Required env (do NOT commit values):
 *   E2E_USER_EMAIL
 *   E2E_USER_PASSWORD
 *   PLAYWRIGHT_BASE_URL    (optional, defaults to http://localhost:5173)
 */
import { defineConfig, devices } from '@playwright/test';

const baseURL = process.env.PLAYWRIGHT_BASE_URL || 'http://localhost:5173';

export default defineConfig({
  testDir: './e2e',
  timeout: 60_000,
  expect: { timeout: 10_000 },
  fullyParallel: false, // payment + auth flows are stateful — keep serial
  retries: process.env.CI ? 1 : 0,
  reporter: [['list'], ['html', { open: 'never' }]],
  use: {
    baseURL,
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
  },
  projects: [
    { name: 'setup', testMatch: /.*\.setup\.js/ },
    {
      name: 'chromium',
      use: {
        ...devices['Desktop Chrome'],
        storageState: 'e2e/.auth/user.json',
      },
      dependencies: ['setup'],
    },
  ],
  webServer: process.env.PLAYWRIGHT_NO_SERVER
    ? undefined
    : {
        command: 'npm run dev',
        url: baseURL,
        reuseExistingServer: !process.env.CI,
        timeout: 120_000,
      },
});
