/**
 * Public pages smoke tests — anonymous (no auth required).
 *
 * Covers all publicly accessible routes of certzen.app.
 * These tests MUST pass before any authenticated flows are validated.
 */
import { test, expect } from '@playwright/test';

// Force anonymous — no auth state from any setup
test.use({ storageState: { cookies: [], origins: [] } });

// ── Helper ───────────────────────────────────────────────────────────────────
async function expectPageLoadsCleanly(page, path, descriptionSelector) {
  const errors = [];
  page.on('pageerror', (e) => errors.push(e.message));

  const res = await page.goto(path);
  expect(res?.status(), `HTTP status for ${path}`).toBeLessThan(500);
  await expect(page.locator('body'), `body not empty at ${path}`).not.toBeEmpty();

  // Zero unhandled JS errors on load
  expect(errors, `JS errors at ${path}`).toEqual([]);

  if (descriptionSelector) {
    await expect(page.locator(descriptionSelector).first()).toBeVisible();
  }
}

// ── Public landing page ───────────────────────────────────────────────────────
test.describe('/ — Welcome / landing', () => {
  test('renders without JS errors', async ({ page }) => {
    await expectPageLoadsCleanly(page, '/');
  });

  test('shows CertZen branding', async ({ page }) => {
    await page.goto('/');
    await expect(page.getByText('CertZen').first()).toBeVisible();
  });

  test('has login and register CTAs', async ({ page }) => {
    await page.goto('/');
    await expect(page.getByRole('link', { name: /ingresar/i }).first()).toBeVisible();
    await expect(page.getByRole('link', { name: /registro/i }).first()).toBeVisible();
  });
});

// ── Auth pages ────────────────────────────────────────────────────────────────
test.describe('/login', () => {
  test('renders login form', async ({ page }) => {
    await page.goto('/login');
    await expect(page.getByLabel(/correo|email/i)).toBeVisible();
    await expect(page.getByLabel(/contraseña|password/i)).toBeVisible();
    // Use the submit button explicitly — avoids matching 'Ingresar con Google'
    await expect(page.locator('button[type="submit"]')).toBeVisible();
  });

  test('shows error for wrong credentials', async ({ page }) => {
    // Mock Cloudflare Turnstile script — auto-calls the success callback with a fake token
    await page.route('**/challenges.cloudflare.com/**', async (route) => {
      await route.fulfill({
        contentType: 'application/javascript',
        body: `
          window.__cfTurnstileCallbacks = window.__cfTurnstileCallbacks || {};
          window.turnstile = {
            render: (el, opts) => {
              if (opts && opts.callback) setTimeout(() => opts.callback('e2e-fake-token'), 100);
              return 'fake-widget-id';
            },
            reset: () => {},
            remove: () => {},
            getResponse: () => 'e2e-fake-token',
          };
        `,
      });
    });
    // Mock the verifyTurnstile Cloud Function — always returns success
    await page.route('**/verifyTurnstile**', async (route) => {
      await route.fulfill({ status: 200, contentType: 'application/json', body: '{"success":true}' });
    });

    await page.goto('/login');
    await page.getByLabel(/correo|email/i).fill('nobody@example.com');
    await page.getByLabel(/contraseña|password/i).fill('WrongPassword1!');
    await page.locator('button[type="submit"]').click();
    // Firebase returns an error — the form must show it
    await expect(
      page.locator('[role="alert"]').first()
    ).toBeVisible({ timeout: 15_000 });
  });
});

test.describe('/register', () => {
  test('renders registration form', async ({ page }) => {
    await page.goto('/register');
    await expect(page.getByLabel(/nombre/i)).toBeVisible();
    await expect(page.getByLabel(/correo|email/i)).toBeVisible();
    // Use the submit button explicitly — avoids matching 'Registrarse con Google'
    await expect(page.locator('button[type="submit"]')).toBeVisible();
  });
});

test.describe('/forgot-password', () => {
  test('renders reset form', async ({ page }) => {
    await page.goto('/forgot-password');
    await expect(page.getByLabel(/correo|email/i)).toBeVisible();
  });
});

// ── Content pages ──────────────────────────────────────────────────────────
test.describe('/about', () => {
  test('renders without errors', async ({ page }) => {
    await expectPageLoadsCleanly(page, '/about');
  });
});

test.describe('/pricing', () => {
  test('renders pricing cards', async ({ page }) => {
    await page.goto('/pricing');
    await expect(page.locator('body')).not.toBeEmpty();
    // At least one pricing card or section visible
    await expect(
      page.getByText(/pro|gratis|free/i).first()
    ).toBeVisible({ timeout: 10_000 });
  });
});

test.describe('/explore', () => {
  test('renders without auth', async ({ page }) => {
    await expectPageLoadsCleanly(page, '/explore');
  });

  test('shows exam sets or empty state', async ({ page }) => {
    await page.goto('/explore');
    // Main content area renders — either cards, a heading, or a CTA
    await expect(page.locator('main, [role="main"]').first()).toBeVisible({ timeout: 15_000 });
  });
});

test.describe('/about, /privacy, /terms, /contact', () => {
  for (const path of ['/about', '/privacy', '/terms', '/contact']) {
    test(`${path} renders without errors`, async ({ page }) => {
      await expectPageLoadsCleanly(page, path);
    });
  }
});

// ── Demo exam (public, no auth) ───────────────────────────────────────────────
test.describe('/exam?cert=demo', () => {
  test('renders demo exam page', async ({ page }) => {
    await page.goto('/exam?cert=demo&mode=exam');
    await expect(page.locator('body')).not.toBeEmpty();
    // Should not redirect to login
    await expect(page).not.toHaveURL(/\/login/);
  });
});

// ── Protected-route redirects ─────────────────────────────────────────────────
test.describe('Protected routes redirect anonymous users', () => {
  const protectedPaths = [
    '/profile',
    '/dashboard',
    '/home',
    '/payment-success',
    '/create-exam',
    '/settings',
  ];

  for (const path of protectedPaths) {
    test(`${path} → redirects to /login`, async ({ page }) => {
      await page.goto(path);
      await expect(page).toHaveURL(/\/login/, { timeout: 10_000 });
    });
  }
});
