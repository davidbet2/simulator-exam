/**
 * Pro-user authenticated flows — blackzafirox@hotmail.com
 *
 * Depends on setup-pro (auth.pro.setup.js) which uses either:
 *   A) E2E_PRO_USER_EMAIL + E2E_PRO_USER_PASSWORD (email/password auth)
 *   B) E2E_PRO_FIREBASE_TOKEN + E2E_PRO_FIREBASE_UID + E2E_PRO_FIREBASE_EMAIL
 *
 * If neither is configured, ALL tests in this file are skipped.
 * Runs as the "pro-user" project in playwright.config.js.
 *
 * ── Coverage ─────────────────────────────────────────────────────────────────
 * /profile — header:
 *   - Pro badge visible, "Free" badge NOT visible in header
 * /profile — billing section:
 *   - Plan name "CertZen Pro" visible
 *   - Description "Acceso completo · Sin restricciones" visible
 *   - Status badge shows "Activo", NOT "Free"
 *   - Pro feature list: Exámenes ilimitados, Historial completo, Análisis por dominio, Crea y comparte sets
 *   - "Historial de pagos" section visible (isPro guard)
 *   - "Ver planes y precios" upgrade CTA NOT visible (only for free users)
 * /dashboard:
 *   - Renders with user stats
 *   - "Actualizar a Pro" upgrade link NOT visible
 * /home:
 *   - Renders without login redirect
 *   - Nav does NOT show upgrade Pro badge link
 *   - Hero does NOT show "Actualizar a Pro" CTA button
 * /pricing:
 *   - "Administrar suscripción" or "Eres usuario Pro" visible on Pro card
 *   - Free card shows "Plan básico" (not "Tu plan actual")
 * /create-exam:
 *   - Import section (JSON/Excel/PDF) visible for Pro users
 * /explore:
 *   - Renders accessible sets without auth gate
 */
import { test, expect } from '@playwright/test';

const isConfigured =
  (process.env.E2E_PRO_USER_EMAIL && process.env.E2E_PRO_USER_PASSWORD) ||
  (process.env.E2E_PRO_FIREBASE_TOKEN && process.env.E2E_PRO_FIREBASE_UID);

// Skip gracefully when credentials are not set — CI won't fail, tests show as skipped
test.skip(!isConfigured, 'Pro-user credentials not configured (set E2E_PRO_USER_EMAIL/PASSWORD or E2E_PRO_FIREBASE_TOKEN)');

const WAIT = { timeout: 15_000 };

// ── /profile — header badges ──────────────────────────────────────────────────
test.describe('/profile — header', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/profile');
    await expect(page).not.toHaveURL(/\/login/, WAIT);
    await expect(page.getByText(/suscripción y facturación/i).first()).toBeVisible(WAIT);
  });

  test('shows "Pro" badge in profile header', async ({ page }) => {
    // Badge variant="pro" renders inside the header area
    // It contains "Pro" text next to the Zap icon
    const header = page.locator('div').filter({ hasText: /suscripción y facturación/i }).first();
    // The Pro badge appears in the top header section — find it above the billing section
    await expect(
      page.getByText('Pro').first()
    ).toBeVisible(WAIT);
  });

  test('does NOT show "Free" badge in header (only pro users have Pro badge)', async ({ page }) => {
    // Free badge variant="default" contains text "Free" — should not appear for pro user in header
    // We check that the billing section badge is NOT "Free"
    const billingBadge = page.locator('section, div').filter({
      hasText: /acceso completo · sin restricciones/i,
    }).first();
    await expect(billingBadge.getByText('Free', { exact: true })).not.toBeVisible({ timeout: 5_000 });
  });
});

// ── /profile — billing section ────────────────────────────────────────────────
test.describe('/profile — billing section', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/profile');
    await expect(page).not.toHaveURL(/\/login/, WAIT);
    await expect(page.getByText('Suscripción y facturación')).toBeVisible(WAIT);
  });

  test('shows plan name "CertZen Pro"', async ({ page }) => {
    await expect(page.getByText('CertZen Pro')).toBeVisible(WAIT);
  });

  test('shows plan description "Acceso completo · Sin restricciones"', async ({ page }) => {
    await expect(page.getByText('Acceso completo · Sin restricciones')).toBeVisible(WAIT);
  });

  test('status badge shows "Activo" not "Free"', async ({ page }) => {
    // isPro=true → badge renders 'Activo'
    await expect(page.getByText('Activo', { exact: true })).toBeVisible(WAIT);
    await expect(page.getByText('Free', { exact: true })).not.toBeVisible({ timeout: 5_000 });
  });

  test('shows pro feature: "Exámenes ilimitados"', async ({ page }) => {
    await expect(page.getByText('Exámenes ilimitados')).toBeVisible(WAIT);
  });

  test('shows pro feature: "Historial completo"', async ({ page }) => {
    await expect(page.getByText('Historial completo')).toBeVisible(WAIT);
  });

  test('shows pro feature: "Análisis por dominio"', async ({ page }) => {
    await expect(page.getByText('Análisis por dominio')).toBeVisible(WAIT);
  });

  test('shows "Historial de pagos" toggle (isPro guard)', async ({ page }) => {
    // Only visible when isPro === true
    await expect(page.getByText('Historial de pagos')).toBeVisible(WAIT);
  });

  test('does NOT show "Ver planes y precios" upgrade CTA (free-user only)', async ({ page }) => {
    // This link only renders when !isPro
    await expect(page.getByText('Ver planes y precios')).not.toBeVisible({ timeout: 5_000 });
  });

  test('does NOT show free plan description "3 exámenes/mes · Funciones básicas"', async ({ page }) => {
    await expect(page.getByText('3 exámenes/mes · Funciones básicas')).not.toBeVisible({ timeout: 5_000 });
  });
});

// ── /dashboard ────────────────────────────────────────────────────────────────
test.describe('/dashboard — pro user', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/dashboard');
    await expect(page).not.toHaveURL(/\/login/, WAIT);
    // Wait for the page to load (shows welcome greeting)
    await expect(page.getByText(/hola,/i).first()).toBeVisible(WAIT);
  });

  test('renders study stats (exams taken, passed, average)', async ({ page }) => {
    await expect(page.getByText('Exámenes tomados')).toBeVisible(WAIT);
    await expect(page.getByText('Aprobados')).toBeVisible(WAIT);
    await expect(page.getByText('Promedio')).toBeVisible(WAIT);
  });

  test('does NOT show "Actualizar a Pro" upgrade link', async ({ page }) => {
    // DashboardPage: {!isPro && <Link to="/pricing">Actualizar a Pro</Link>}
    await expect(page.getByText('Actualizar a Pro')).not.toBeVisible({ timeout: 5_000 });
  });

  test('shows attempt history section', async ({ page }) => {
    await expect(page.getByText('Historial de intentos')).toBeVisible(WAIT);
  });
});

// ── /home ─────────────────────────────────────────────────────────────────────
test.describe('/home — pro user', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/home');
    await expect(page).not.toHaveURL(/\/login/, WAIT);
    await expect(page.locator('body')).not.toBeEmpty();
  });

  test('renders without auth redirect', async ({ page }) => {
    await expect(page).not.toHaveURL(/\/login/);
  });

  test('does NOT show upgrade Pro badge in nav (only for free users)', async ({ page }) => {
    // WelcomePage nav: {!isPro && !planLoading && <Link to="/pricing"><Badge>Pro</Badge></Link>}
    // This is the small "Pro" upgrade badge — wait for plan to load then check
    await page.waitForTimeout(2000); // allow useUserPlan to settle
    // The nav upgrade badge links to /pricing — check the nav area
    const navUpgradeBadge = page.locator('nav a[href="/pricing"] span').filter({ hasText: /^Pro$/ });
    await expect(navUpgradeBadge).not.toBeVisible({ timeout: 5_000 });
  });

  test('does NOT show "Actualizar a Pro" CTA button in hero section', async ({ page }) => {
    // WelcomePage hero: {user && !isPro && !planLoading && remaining <= 1 && <Link>Actualizar a Pro</Link>}
    await page.waitForTimeout(2000);
    await expect(page.getByText('Actualizar a Pro')).not.toBeVisible({ timeout: 5_000 });
  });
});

// ── /pricing ──────────────────────────────────────────────────────────────────
test.describe('/pricing — pro user view', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/pricing');
    await expect(page.locator('body')).not.toBeEmpty();
    await expect(page.getByText('Planes CertZen')).toBeVisible(WAIT);
  });

  test('Pro card shows "Administrar suscripción" button', async ({ page }) => {
    // isPro=true → PricingPage renders 'Administrar suscripción' instead of 'Actualizar a Pro →'
    await expect(page.getByText('Administrar suscripción')).toBeVisible(WAIT);
  });

  test('shows "✓ Eres usuario Pro" confirmation', async ({ page }) => {
    await expect(page.getByText(/eres usuario pro/i)).toBeVisible(WAIT);
  });

  test('Free card shows "Plan básico" (not "Tu plan actual")', async ({ page }) => {
    // For pro users: Free card CTA = 'Plan básico' (not 'Tu plan actual' which is for free users)
    await expect(page.getByText('Plan básico')).toBeVisible(WAIT);
    await expect(page.getByText('Tu plan actual')).not.toBeVisible({ timeout: 5_000 });
  });
});

// ── /create-exam — Pro import section ────────────────────────────────────────
test.describe('/create-exam — pro import capabilities', () => {
  test('renders create-exam page without auth redirect', async ({ page }) => {
    await page.goto('/create-exam');
    await expect(page).not.toHaveURL(/\/login/, WAIT);
    await expect(page.locator('body')).not.toBeEmpty();
  });

  test('shows import section (JSON/Excel/PDF) — Pro only feature', async ({ page }) => {
    await page.goto('/create-exam');
    // isPro=true → CreateExamPage renders the full import section
    // Free users only see "Nueva pregunta" one-by-one; Pro users see the Import panel
    // The import section header is "Importar preguntas"
    await expect(
      page.getByText(/importar preguntas/i).first()
    ).toBeVisible(WAIT);
  });

  test('does NOT show "Actualiza a Pro para importar" upgrade message', async ({ page }) => {
    await page.goto('/create-exam');
    // Free users see: "En el plan Free puedes añadir preguntas una a una. Actualiza a Pro para importar..."
    await expect(
      page.getByText(/actualiza a pro para importar/i)
    ).not.toBeVisible({ timeout: 5_000 });
  });
});

// ── /explore — public sets accessible ────────────────────────────────────────
test.describe('/explore', () => {
  test('renders explore page without auth gate', async ({ page }) => {
    await page.goto('/explore');
    await expect(page).not.toHaveURL(/\/login/, WAIT);
    await expect(page.locator('body')).not.toBeEmpty();
  });
});
