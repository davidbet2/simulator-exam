/**
 * Vitest config for Firestore Rules emulator tests.
 *
 * Use with:
 *   firebase emulators:exec --only firestore "vitest run -c vitest.rules.config.js"
 *
 * Notes:
 *  - Node environment (no jsdom needed).
 *  - No React setup file.
 *  - Long timeout — emulator startup + rule compile is slow.
 */
import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    globals: true,
    environment: 'node',
    include: ['tests/rules/**/*.test.js'],
    testTimeout: 20000,
    hookTimeout: 30000,
  },
});
