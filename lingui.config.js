/** @type {import('@lingui/conf').LinguiConfig} */
export default {
  locales: ['en', 'es', 'fr', 'pt', 'de', 'it', 'zh', 'ja'],
  sourceLocale: 'en',
  fallbackLocales: { default: 'en' },
  catalogs: [
    {
      path: '<rootDir>/src/locales/{locale}/messages',
      include: ['src'],
      exclude: ['**/*.test.*', '**/*.spec.*', '**/node_modules/**', '**/dist/**'],
    },
  ],
  format: 'po',
  compileNamespace: 'es',
};
