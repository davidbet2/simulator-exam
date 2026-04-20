/**
 * generate-og-image.mjs
 * Genera public/og-image.png (1200x630) y public/og-image-square.png (600x600)
 * usando Playwright (ya instalado como devDependency).
 *
 * Uso:
 *   node scripts/generate-og-image.mjs
 *
 * Agrega al package.json:
 *   "og:generate": "node scripts/generate-og-image.mjs"
 */

import { chromium } from '@playwright/test';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';
import { existsSync } from 'fs';

const __dirname = dirname(fileURLToPath(import.meta.url));
const templatePath = resolve(__dirname, 'og-image-template.html');
const outputDir = resolve(__dirname, '../public');
const outputOg = resolve(outputDir, 'og-image.png');
const outputSquare = resolve(outputDir, 'og-image-square.png');
const outputTwitter = resolve(outputDir, 'twitter-card.png');

if (!existsSync(templatePath)) {
  console.error('❌ Template not found:', templatePath);
  process.exit(1);
}

console.log('🎨 Generating OG images with Playwright...');

const browser = await chromium.launch();
const page = await browser.newPage();

// Load the template
await page.goto(`file://${templatePath}`);

// Wait for Google Fonts to load (if network available), else proceed after 1s
try {
  await page.waitForLoadState('networkidle', { timeout: 3000 });
} catch {
  await page.waitForTimeout(1000);
}

// --- 1. og-image.png (1200x630) — main OG + Twitter card
await page.setViewportSize({ width: 1200, height: 630 });
await page.screenshot({ path: outputOg, type: 'png' });
console.log('✅ og-image.png (1200×630)');

// Copy for Twitter (same dimensions work for summary_large_image)
await page.screenshot({ path: outputTwitter, type: 'png' });
console.log('✅ twitter-card.png (1200×630)');

// --- 2. og-image-square.png (600x600) — WhatsApp + some platforms
await page.setViewportSize({ width: 600, height: 600 });
// Adjust the template for square format
await page.evaluate(() => {
  document.body.style.width = '600px';
  document.body.style.height = '600px';
  const h1 = document.querySelector('h1');
  if (h1) h1.style.fontSize = '52px';
  const p = document.querySelector('.headline p');
  if (p) p.style.fontSize = '17px';
  const statNumber = document.querySelectorAll('.stat-number');
  statNumber.forEach(el => el.style.fontSize = '28px');
});
await page.screenshot({ path: outputSquare, type: 'png' });
console.log('✅ og-image-square.png (600×600)');

await browser.close();

console.log('');
console.log('🎉 Done! OG images generated in public/:');
console.log('   • og-image.png       → og:image, twitter:image');
console.log('   • og-image-square.png → WhatsApp, smaller previews');
console.log('   • twitter-card.png   → Twitter large card');
console.log('');
console.log('📌 Remember to deploy: firebase deploy --only hosting');
