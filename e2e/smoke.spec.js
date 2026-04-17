/**
 * Smoke test — public landing page renders without errors.
 * This is the lowest-risk E2E check we can ship without staging infra.
 */
import { test, expect } from '@playwright/test';

test.use({ storageState: { cookies: [], origins: [] } });

test('home page renders and is not a blank screen', async ({ page }) => {
  const errors = [];
  page.on('pageerror', (e) => errors.push(e.message));

  await page.goto('/');
  // Some content must be visible
  await expect(page.locator('body')).not.toBeEmpty();
  // Zero unhandled JS errors on first paint
  expect(errors).toEqual([]);
});
