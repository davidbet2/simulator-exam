/**
 * Free-user authenticated flows — davidbet2@hotmail.com
 *
 * Depends on setup-free (auth.setup.js) which injects auth into storageState.
 * These tests run as the "free-user" project in playwright.config.js.
 *
 * Covers every free-user-specific condition visible in the app:
 *   - Profile header: "Free" badge visible, no "Pro" badge
 *   - Account data: display name, email, access method, join date
 *   - Billing section: "Plan Gratuito" label, free description, "Free" status badge
 *   - Billing section: free feature list items visible
 *   - Billing section: subscription dates NOT visible (isPro guard)
 *   - Billing section: payment history toggle NOT visible (isPro guard)
 *   - Billing section: cancel-renewal button NOT visible (isPro guard)
 *   - Billing section: "Ver planes y precios" upgrade CTA links to /pricing
 *   - /payment-success exploit gate: renders "No encontramos un pago activo"
 */
import { test, expect } from '@playwright/test';

// ── Redirect ──────────────────────────────────────────────────────────────────
test.describe('Authenticated redirect', () => {
  test('/ redirects to /home when logged in', async ({ page }) => {
    await page.goto('/');
    await expect(page).toHaveURL(/\/home/, { timeout: 15_000 });
  });
});

// ── Home page ─────────────────────────────────────────────────────────────────
test.describe('/home', () => {
  test('renders without JS errors', async ({ page }) => {
    const errors = [];
    page.on('pageerror', (e) => errors.push(e.message));
    await page.goto('/home');
    await expect(page).not.toHaveURL(/\/login/);
    await expect(page.locator('body')).not.toBeEmpty();
    expect(errors).toEqual([]);
  });
});

// ── Dashboard ─────────────────────────────────────────────────────────────────
test.describe('/dashboard', () => {
  test('renders study stats without redirect', async ({ page }) => {
    await page.goto('/dashboard');
    await expect(page).not.toHaveURL(/\/login/);
    await expect(page.locator('body')).not.toBeEmpty();
  });
});

// ── Profile page — header ─────────────────────────────────────────────────────
test.describe('/profile — header badges', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/profile');
    await expect(page).not.toHaveURL(/\/login/, { timeout: 15_000 });
    // Wait for profile data to finish loading (name or email visible)
    await expect(page.getByText('@', { exact: false }).or(page.locator('h1')).first())
      .toBeVisible({ timeout: 15_000 });
  });

  test('shows "Free" badge in profile header', async ({ page }) => {
    // Badge variant="default" renders the text "Free" (not Pro)
    await expect(page.getByText('Free').first()).toBeVisible({ timeout: 10_000 });
  });

  test('does NOT show Pro badge in profile header', async ({ page }) => {
    // The "Pro" badge is only rendered when isPro === true.
    // Look for a badge-styled element that contains exactly "Pro" — Zap+Pro is the Pro badge.
    // Lingui renders <Badge variant="pro">Pro</Badge> only for isPro users.
    const proBadgeCandidates = page.locator('span, div').filter({ hasText: /^Pro$/ });
    await expect(proBadgeCandidates).toHaveCount(0, { timeout: 10_000 });
  });

  test('shows user email in profile header', async ({ page }) => {
    const email = process.env.E2E_FREE_EMAIL ?? 'davidbet2@hotmail.com';
    await expect(page.getByText(email, { exact: false }).first()).toBeVisible({ timeout: 10_000 });
  });
});

// ── Profile page — account data section ──────────────────────────────────────
test.describe('/profile — datos de cuenta', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/profile');
    await expect(page).not.toHaveURL(/\/login/, { timeout: 15_000 });
    await expect(page.getByText('Datos de cuenta')).toBeVisible({ timeout: 15_000 });
  });

  test('shows "Correo electrónico" label and user email', async ({ page }) => {
    const email = process.env.E2E_FREE_EMAIL ?? 'davidbet2@hotmail.com';
    await expect(page.getByText('Correo electrónico')).toBeVisible();
    await expect(page.getByText(email, { exact: false }).first()).toBeVisible();
  });

  test('shows "Método de acceso" field', async ({ page }) => {
    await expect(page.getByText('Método de acceso')).toBeVisible();
  });

  test('shows "Miembro desde" join date field', async ({ page }) => {
    await expect(page.getByText('Miembro desde')).toBeVisible();
  });
});

// ── Profile page — billing / subscription section ────────────────────────────
test.describe('/profile — suscripción y facturación (free user)', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/profile');
    await expect(page).not.toHaveURL(/\/login/, { timeout: 15_000 });
    // Wait for billing section heading
    await expect(page.getByText('Suscripción y facturación')).toBeVisible({ timeout: 15_000 });
  });

  test('shows "Plan Gratuito" as plan name', async ({ page }) => {
    await expect(page.getByText('Plan Gratuito')).toBeVisible();
  });

  test('shows free-tier description "3 exámenes/mes · Funciones básicas"', async ({ page }) => {
    await expect(page.getByText('3 exámenes/mes · Funciones básicas')).toBeVisible();
  });

  test('billing status badge shows "Free" (not "Activo")', async ({ page }) => {
    // For isPro: badge shows 'Activo'. For free: badge shows 'Free'.
    // We assert "Free" is visible and "Activo" is NOT visible in the billing area.
    await expect(page.getByText('Free').first()).toBeVisible();
    await expect(page.getByText('Activo', { exact: true })).not.toBeVisible();
  });

  test('shows free feature list items', async ({ page }) => {
    await expect(page.getByText('3 exámenes por mes')).toBeVisible();
    await expect(page.getByText('Acceso a certificaciones oficiales')).toBeVisible();
    await expect(page.getByText('Resultados básicos')).toBeVisible();
  });

  test('does NOT show subscription dates block (isPro guard)', async ({ page }) => {
    // Dates section only renders when isPro && (subscriptionStartedAt || subscriptionRenewsAt).
    // Only check 'Próxima renovación' — 'Inicio' also appears in the nav sidebar.
    await expect(page.getByText('Próxima renovación')).not.toBeVisible();
  });

  test('does NOT show payment history toggle (isPro guard)', async ({ page }) => {
    // "Historial de pagos" button only renders when isPro
    await expect(page.getByText('Historial de pagos')).not.toBeVisible();
  });

  test('does NOT show "Cancelar renovación automática" button (isPro guard)', async ({ page }) => {
    // Cancel renewal button only renders when isPro && dodoSubscriptionId
    await expect(page.getByText('Cancelar renovación automática')).not.toBeVisible();
  });

  test('shows "Ver planes y precios" upgrade CTA linking to /pricing', async ({ page }) => {
    const upgradeLink = page.getByRole('link', { name: /ver planes y precios/i });
    await expect(upgradeLink).toBeVisible();
    const href = await upgradeLink.getAttribute('href');
    expect(href).toMatch(/\/pricing/);
  });
});

// ── Settings ──────────────────────────────────────────────────────────────────
test.describe('/settings', () => {
  test('renders without redirect', async ({ page }) => {
    await page.goto('/settings');
    await expect(page).not.toHaveURL(/\/login/);
    await expect(page.locator('body')).not.toBeEmpty();
  });
});

// ── Pricing ───────────────────────────────────────────────────────────────────
test.describe('/pricing — free user view', () => {
  test('renders without redirecting', async ({ page }) => {
    await page.goto('/pricing');
    await expect(page.locator('body')).not.toBeEmpty();
  });

  test('shows paid plan upgrade option', async ({ page }) => {
    await page.goto('/pricing');
    await expect(page.getByText(/pro|premium/i).first()).toBeVisible({ timeout: 10_000 });
  });
});

// ── Explore ───────────────────────────────────────────────────────────────────
test.describe('/explore — authenticated', () => {
  test('renders without redirect', async ({ page }) => {
    await page.goto('/explore');
    await expect(page).not.toHaveURL(/\/login/);
    await expect(page.locator('body')).not.toBeEmpty();
  });
});

// ── Payment success exploit gate (P0) ─────────────────────────────────────────
test.describe('/payment-success — free user without purchase', () => {
  test('shows "No encontramos un pago activo" for free user (exploit gate)', async ({ page }) => {
    // Free user visits /payment-success without a real purchase.
    // Mock syncDodoSubscription so the test is deterministic (avoids real CF cold-start latency).
    // NOTE: React StrictMode runs effects twice; the `cancelled` flag ensures only the second
    // run's CF call completes. The route mock intercepts that call and returns { synced: false }.
    await page.route(/syncDodoSubscription/, (route) =>
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ result: { synced: false } }),
      })
    );

    await page.goto('/payment-success');
    await expect(page).not.toHaveURL(/\/login/, { timeout: 10_000 });
    await expect(
      page.getByRole('heading', { name: /no encontramos un pago activo/i })
    ).toBeVisible({ timeout: 15_000 });
  });

  test('does NOT show "Pago exitoso" success state for free user', async ({ page }) => {
    await page.goto('/payment-success');
    // Wait until the page resolves (exploit gate or any final state)
    await expect(
      page.getByRole('heading', { name: /no encontramos|verificando|pago exitoso/i })
    ).toBeVisible({ timeout: 30_000 });
    // Must not show success confirmation
    await expect(
      page.getByRole('heading', { name: /pago exitoso/i })
    ).not.toBeVisible();
  });
});

// ── Logout ────────────────────────────────────────────────────────────────────
test.describe('Logout', () => {
  test('logging out takes user to login/landing page', async ({ page }) => {
    await page.goto('/profile');
    const logoutBtn = page.getByRole('button', { name: /cerrar sesión|logout|sign out/i });
    await expect(logoutBtn).toBeVisible({ timeout: 15_000 });
    await logoutBtn.click();
    await expect(page).toHaveURL(/\/(login|$)/, { timeout: 10_000 });
  });
});
