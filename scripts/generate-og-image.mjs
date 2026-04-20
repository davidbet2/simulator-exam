/**
 * generate-og-image.mjs
 * Toma screenshots REALES del sitio en producción (certzen.app) usando Playwright.
 * Genera public/og-image.png (1200×630) y public/og-image-square.png (600×600).
 *
 * Uso:
 *   node scripts/generate-og-image.mjs          → screenshot de https://certzen.app
 *   node scripts/generate-og-image.mjs --local  → screenshot de http://localhost:5173
 *
 * Requiere:
 *   npx playwright install chromium  (una sola vez)
 */

import { chromium } from '@playwright/test';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const outputDir = resolve(__dirname, '../public');
const outputOg     = resolve(outputDir, 'og-image.png');
const outputSquare = resolve(outputDir, 'og-image-square.png');
const outputTwitter = resolve(outputDir, 'twitter-card.png');

const useLocal = process.argv.includes('--local');
const SITE_URL = useLocal ? 'http://localhost:5173' : 'https://certzen.app';

console.log(`🌐 Taking screenshots from: ${SITE_URL}`);

const browser = await chromium.launch();

// ── Helper ────────────────────────────────────────────────────────────────────
async function shootPage(width, height) {
  const page = await browser.newPage();
  await page.setViewportSize({ width, height });

  // 'load' is safe for SPAs — avoids infinite networkidle from Firebase listeners
  await page.goto(SITE_URL, { waitUntil: 'load', timeout: 30_000 });

  // Wait for meaningful content: any heading or main element
  try {
    await page.waitForSelector('h1, main, [class*="hero"], [class*="welcome"]', { timeout: 8_000 });
  } catch { /* content may already be visible — continue */ }

  // Let animations/fonts settle
  await page.waitForTimeout(2000);

  // Dismiss any auth/cookie modal that might obscure content
  try {
    const overlay = page.locator('[data-testid="modal"], [role="dialog"]');
    if (await overlay.isVisible({ timeout: 1000 })) {
      await page.keyboard.press('Escape');
      await page.waitForTimeout(400);
    }
  } catch { /* no overlay — continue */ }

  const buffer = await page.screenshot({ type: 'png', clip: { x: 0, y: 0, width, height } });
  await page.close();
  return buffer;
}

// ── 1. og-image.png  1200×630 ─────────────────────────────────────────────────
import { writeFileSync } from 'fs';

const ogBuffer = await shootPage(1200, 630);
writeFileSync(outputOg, ogBuffer);
console.log('✅ og-image.png (1200×630)');

writeFileSync(outputTwitter, ogBuffer);
console.log('✅ twitter-card.png (1200×630)');

// ── 2. og-image-square.png  600×600 ──────────────────────────────────────────
const squareBuffer = await shootPage(600, 600);
writeFileSync(outputSquare, squareBuffer);
console.log('✅ og-image-square.png (600×600)');

await browser.close();

console.log('');
console.log('🎉 Done! OG images generated in public/:');
console.log('   • og-image.png        → og:image, twitter:image');
console.log('   • og-image-square.png → WhatsApp previews');
console.log('   • twitter-card.png    → Twitter large card');
console.log('');
console.log('📌 Next: firebase deploy --only hosting');
