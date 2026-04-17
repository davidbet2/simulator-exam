import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './src/test/setup.js',
    css: false,
    // Rules tests run against the Firestore emulator with a separate config.
    // Functions tests run with Jest in functions/ — exclude them from Vitest.
    exclude: [
      'node_modules/**',
      'dist/**',
      'tests/rules/**',
      'e2e/**',
      'functions/**',
      'load-tests/**',
    ],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'lcov', 'html'],
      exclude: [
        'node_modules/**',
        'src/test/**',
        '**/*.config.*',
        '**/main.jsx',
        'src/core/firebase/**',
      ],
    },
  },
});
