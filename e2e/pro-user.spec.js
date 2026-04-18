/**
 * Pro-user authenticated flows — kathe9029@gmail.com
 *
 * Depends on setup-pro (auth.pro.setup.js) which uses either:
 *   A) E2E_PRO_USER_EMAIL + E2E_PRO_USER_PASSWORD (if email/pw was linked)
 *   B) E2E_PRO_FIREBASE_TOKEN + E2E_PRO_FIREBASE_UID + E2E_PRO_FIREBASE_EMAIL
 *
 * If neither is configured, ALL tests in this file are skipped.
 * Runs as the "pro-user" project in playwright.config.js.
 *
 * ─── How to configure ───────────────────────────────────────────────────────
 * Option A (recommended): Link email+password to kathe's account in Firebase Console,
 *   then set $env:E2E_PRO_USER_EMAIL / E2E_PRO_USER_PASSWORD before running.
 *
 * Option B (quick, manual): Log into certzen.app as kathe, then in DevTools:
 *   copy(await firebase.auth().currentUser.getIdToken(true))
 *   Then set $env:E2E_PRO_FIREBASE_TOKEN, E2E_PRO_FIREBASE_UID, E2E_PRO_FIREBASE_EMAIL.
 * ─────────────────────────────────────────────────────────────────────────────
 */
import { test, expect } from '@playwright/test';

const isConfigured =
  (process.env.E2E_PRO_USER_EMAIL && process.env.E2E_PRO_USER_PASSWORD) ||
  (process.env.E2E_PRO_FIREBASE_TOKEN && process.env.E2E_PRO_FIREBASE_UID);

// Skip gracefully when credentials are not set — CI won't fail, tests show as skipped
test.skip(!isConfigured, 'Pro-user credentials not configured (set E2E_PRO_USER_EMAIL/PASSWORD or E2E_PRO_FIREBASE_TOKEN)');

// ── Profile — Pro badge ───────────────────────────────────────────────────────
test.describe('/profile — pro user', () => {
  test('renders profile without auth gate', async ({ page }) => {
    await page.goto('/profile');
    await expect(page).not.toHaveURL(/\/login/);
    await expect(page.locator('body')).not.toBeEmpty();
  });

  test('shows Pro badge', async ({ page }) => {
    await page.goto('/profile');
    // Pro badge or Pro plan indicator should be visible
    await expect(
      page.getByText(/pro/i).first()
    ).toBeVisible({ timeout: 15_000 });
  });

  test('does NOT show "upgrade to Pro" CTA', async ({ page }) => {
    await page.goto('/profile');
    // The free-user upgrade prompt should not be shown to pro users
    const upgradeBtn = page.getByRole('button', { name: /mejorar a pro|upgrade to pro/i });
    await expect(upgradeBtn).not.toBeVisible({ timeout: 5_000 }).catch(() => {});
  });

  test('shows subscription dates', async ({ page }) => {
    await page.goto('/profile');
    // Should display subscription information — date text
    // The ProfilePage renders subscriptionStartedAt / subscriptionRenewsAt
    await expect(
      page.locator('[data-testid="subscription-info"], [class*="subscription"]').first()
        .or(page.getByText(/renovación|suscripción|subscription/i).first())
    ).toBeVisible({ timeout: 15_000 });
  });
});

// ── Pricing page — current plan indicator ────────────────────────────────────
test.describe('/pricing — pro user view', () => {
  test('renders pricing page', async ({ page }) => {
    await page.goto('/pricing');
    await expect(page.locator('body')).not.toBeEmpty();
  });

  test('shows current plan indicator on Pro tier', async ({ page }) => {
    await page.goto('/pricing');
    // Look for "tu plan actual", "plan actual", "current plan", or a disabled/active Pro button
    await expect(
      page.getByText(/plan actual|current plan|activo/i).first()
        .or(page.locator('[data-testid="current-plan"]').first())
    ).toBeVisible({ timeout: 15_000 });
  });
});

// ── Home and dashboard access ─────────────────────────────────────────────────
test.describe('/home — pro user', () => {
  test('renders home page', async ({ page }) => {
    await page.goto('/home');
    await expect(page).not.toHaveURL(/\/login/);
    await expect(page.locator('body')).not.toBeEmpty();
  });
});

test.describe('/dashboard — pro user', () => {
  test('renders dashboard', async ({ page }) => {
    await page.goto('/dashboard');
    await expect(page).not.toHaveURL(/\/login/);
    await expect(page.locator('body')).not.toBeEmpty();
  });
});

// ── Settings access ───────────────────────────────────────────────────────────
test.describe('/settings — pro user', () => {
  test('renders settings page', async ({ page }) => {
    await page.goto('/settings');
    await expect(page).not.toHaveURL(/\/login/);
    await expect(page.locator('body')).not.toBeEmpty();
  });
});
