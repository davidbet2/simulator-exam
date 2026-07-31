/**
 * Static prerender for public marketing/landing routes.
 *
 * Social/link-unfurl crawlers (Facebook, LinkedIn, Slack, WhatsApp, X) do not execute
 * JS, so they only ever saw the generic homepage OG tags baked into index.html —
 * regardless of which route was actually shared. This script serves the built `dist/`
 * with `vite preview`, drives headless Chrome to each public route so react-helmet-async
 * emits the real per-page <title>/description/OG/JSON-LD, and writes the resulting HTML
 * as a static file (`dist/<route>.html`), matched by Firebase Hosting's `cleanUrls`.
 *
 * Gated/private routes (/exam, /results, /dashboard, /profile, /admin, …) are
 * intentionally excluded — they're already blocked in robots.txt and have nothing to
 * unfurl.
 *
 * Usage: node scripts/prerender.mjs   (must run after `vite build`)
 */
import { initializeApp } from 'firebase/app';
import { getFirestore, collection, query, where, orderBy, limit, startAfter, getDocs } from 'firebase/firestore';
import { spawn, spawnSync } from 'child_process';
import { writeFileSync, mkdirSync, rmSync, cpSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import puppeteer from 'puppeteer';
import { config } from 'dotenv';

config();

const __dirname = dirname(fileURLToPath(import.meta.url));
const DIST_DIR = join(__dirname, '..', 'dist');
// `vite preview` serves dist/index.html as the SPA fallback for every route it
// doesn't have a literal file for. If we wrote straight into dist/, prerendering
// '/' would overwrite that fallback shell with a fully-baked root-page snapshot —
// every route captured afterward would then load THAT stale snapshot instead of
// a clean bootstrap shell, and its already-resolved title would look "stable"
// instantly. Stage output here and copy into dist/ only once every route is done.
const STAGING_DIR = join(__dirname, '..', '.prerender-staging');
const PORT = 4783;
const ORIGIN = `http://localhost:${PORT}`;
const SITE_URL = 'https://certzen.app';

// Expected page-specific <title> text per route (must match src/features/**/pages/*.jsx
// exactly) — used to validate a capture landed on the real page, not a stale/unresolved
// one. Update this alongside the corresponding page's SEOHead title prop.
const EXPECTED_TITLES = {
  '/': 'Simuladores de Certificación Profesional',
  '/about': 'Sobre la plataforma',
  '/pricing': 'Planes y precios',
  '/privacy': 'Política de Privacidad',
  '/terms': 'Términos de Uso',
  '/contact': 'Contacto',
  '/explore': 'Explorar exámenes de certificación',
};
const STATIC_ROUTES = Object.keys(EXPECTED_TITLES);
// Domain category pages now live at a real pathname (/explore/:domain), so each one
// can be prerendered to its own static file (dist/explore/<domain>.html) — unlike the
// legacy /explore?domain=X form, which stays CSR-only since query strings can't map to
// distinct static files. Keep this list in sync with DOMAINS in
// src/core/constants/domains.js and generate-sitemap.mjs's DOMAIN_ROUTES.
const DOMAIN_IDS = ['it', 'security', 'agile', 'health', 'english', 'logic', 'business', 'sports'];
const DOMAIN_ROUTES = DOMAIN_IDS.map((d) => `/explore/${d}`);

const BLOCKED_HOSTS = [
  'googletagmanager.com',
  'google-analytics.com',
  'googlesyndication.com',
  'doubleclick.net',
  'adservice.google.com',
  'adtrafficquality.google',
];

async function fetchExamSetSlugs() {
  const firebaseConfig = {
    apiKey: process.env.VITE_FIREBASE_API_KEY,
    authDomain: process.env.VITE_FIREBASE_AUTH_DOMAIN,
    projectId: process.env.VITE_FIREBASE_PROJECT_ID,
    storageBucket: process.env.VITE_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.VITE_FIREBASE_APP_ID,
  };
  try {
    const app = initializeApp(firebaseConfig);
    const db = getFirestore(app);
    // Firestore security rules cap anonymous listing of examSets at
    // limit <= 100 per query (see firestore.rules), so paginate by
    // document ID (ordered, indexless) in pages of 100 to cover all sets.
    const PAGE_SIZE = 100;
    const slugs = [];
    let cursor = null;
    for (;;) {
      const constraints = [
        where('published', '==', true),
        orderBy('__name__'),
        ...(cursor ? [startAfter(cursor)] : []),
        limit(PAGE_SIZE),
      ];
      const snap = await getDocs(query(collection(db, 'examSets'), ...constraints));
      if (snap.empty) break;
      slugs.push(...snap.docs.map((d) => `/exam-sets/${d.id}`));
      if (snap.docs.length < PAGE_SIZE) break;
      cursor = snap.docs[snap.docs.length - 1];
    }
    return slugs;
  } catch (err) {
    console.warn('⚠️  Could not fetch exam sets for prerender (continuing with static routes only):', err.message);
    return [];
  }
}

async function waitForServer(timeoutMs) {
  const deadline = Date.now() + timeoutMs;
  while (Date.now() < deadline) {
    try {
      const res = await fetch(ORIGIN);
      if (res.ok || res.status < 500) return;
    } catch { /* not up yet */ }
    await new Promise((r) => setTimeout(r, 300));
  }
  throw new Error('vite preview did not start in time');
}

async function startPreviewServer() {
  const proc = spawn(
    'npx',
    ['vite', 'preview', '--port', String(PORT), '--strictPort'],
    { cwd: join(__dirname, '..'), shell: true, stdio: ['ignore', 'ignore', 'pipe'] },
  );
  proc.on('error', (err) => { throw err; });
  await waitForServer(20000);
  return proc;
}

function stopPreviewServer(proc) {
  // spawn(..., { shell: true }) on Windows makes `proc` the cmd.exe wrapper,
  // not the actual vite process — proc.kill() only kills the wrapper and
  // leaves vite (and the port) running, which then hangs anything that
  // waits on this script to fully exit (e.g. `npm run deploy`'s next step).
  // `taskkill /T` kills the whole process tree instead.
  if (process.platform === 'win32') {
    spawnSync('taskkill', ['/pid', String(proc.pid), '/T', '/F'], { stdio: 'ignore' });
  } else {
    proc.kill();
  }
}

function routeToFilePath(route) {
  const [pathname] = route.split('?');
  const clean = pathname === '/' ? '/index' : pathname;
  return join(STAGING_DIR, `${clean}.html`);
}

async function prerenderRoute(browser, route) {
  const page = await browser.newPage();
  await page.setRequestInterception(true);
  page.on('request', (req) => {
    const url = req.url();
    if (BLOCKED_HOSTS.some((host) => url.includes(host))) {
      req.abort();
    } else {
      req.continue();
    }
  });

  const [pathname] = route.split('?');
  const expectedCanonical = `${SITE_URL}${pathname}`;
  // Known static routes have a fixed title text (see EXPECTED_TITLES); dynamic
  // routes (/exam-sets/:slug) don't, so for those we can only check the title
  // changed away from the static index.html default.
  const expectedTitleText = EXPECTED_TITLES[pathname];
  const staticDefaultTitle = 'CertZen — Simula el Examen. Aprueba al Primero.';
  const isReady = (title) => (expectedTitleText
    ? title === `${expectedTitleText} — CertZen`
    : title !== staticDefaultTitle && title !== '');

  // Firebase (Firestore listeners, auth) keeps persistent connections open, so
  // 'networkidle0'/'networkidle2' never resolve — wait for the initial document
  // load instead, then poll until the title matches what this route is
  // expected to show. A fixed delay isn't enough: react-router's lazy chunk
  // loading and lingui's async catalog load both race against any fixed wait.
  await page.goto(`${ORIGIN}${route}`, { waitUntil: 'load', timeout: 30000 });
  let ready = false;
  for (let i = 0; i < 30 && !ready; i += 1) {
    ready = isReady(await page.title());
    if (!ready) await new Promise((r) => setTimeout(r, 300));
  }

  // react-helmet-async doesn't recognize the static SEO tags baked into
  // index.html (title, description, canonical, OG/Twitter), so it appends its
  // own instead of replacing them — leaving each one duplicated. Helmet's
  // <title> ends up first, everything else last; strip the static leftovers
  // so naive HTML parsers (link-unfurl bots) don't pick the wrong one.
  const result = await page.evaluate((expected) => {
    document.querySelectorAll('title').forEach((el, i) => { if (i > 0) el.remove(); });

    // The cookie consent banner reflects this headless browser's (empty) localStorage,
    // not the real visitor's — baking it into the static snapshot as "visible" made it
    // flash on every load for returning visitors who'd already answered, since hydration
    // immediately hides it once React reads their actual stored choice. It's purely
    // client-state-dependent, so it has no business in the static HTML at all.
    document.querySelector('[aria-label="Consentimiento de cookies"]')?.remove();

    const keyOf = (el) => (el.tagName === 'META'
      ? `meta:${el.getAttribute('name') || el.getAttribute('property')}`
      : `link:${el.getAttribute('rel')}`);
    const groups = new Map();
    document.head.querySelectorAll('meta[name], meta[property], link[rel="canonical"]').forEach((el) => {
      const key = keyOf(el);
      if (!groups.has(key)) groups.set(key, []);
      groups.get(key).push(el);
    });
    for (const els of groups.values()) {
      if (els.length > 1) els.slice(0, -1).forEach((el) => el.remove());
    }

    const titles = document.querySelectorAll('title');
    const canonicals = document.querySelectorAll('link[rel="canonical"]');
    return {
      titleCount: titles.length,
      canonicalCount: canonicals.length,
      canonicalHref: canonicals[0]?.getAttribute('href'),
      matchesExpected: canonicals[0]?.getAttribute('href') === expected,
    };
  }, expectedCanonical);

  const title = await page.title();
  if (result.titleCount !== 1 || result.canonicalCount !== 1 || !result.matchesExpected || !isReady(title)) {
    await page.close();
    throw new Error(
      `unstable capture for ${route}: titles=${result.titleCount} canonicals=${result.canonicalCount} `
      + `canonicalHref=${result.canonicalHref} (expected ${expectedCanonical}) title="${title}"`,
    );
  }

  const html = await page.content();
  await page.close();

  const filePath = routeToFilePath(route);
  mkdirSync(dirname(filePath), { recursive: true });
  writeFileSync(filePath, html);
  console.log(`   ✅ ${route}`);
}

async function main() {
  console.log('🖨️  Prerendering public routes…');

  const setRoutes = await fetchExamSetSlugs();
  const routes = [...STATIC_ROUTES, ...DOMAIN_ROUTES, ...setRoutes];
  console.log(`   · ${routes.length} routes to prerender (${DOMAIN_ROUTES.length} domains, ${setRoutes.length} exam sets)`);

  rmSync(STAGING_DIR, { recursive: true, force: true });
  mkdirSync(STAGING_DIR, { recursive: true });

  const server = await startPreviewServer();
  const browser = await puppeteer.launch({ headless: true });

  const failed = [];
  try {
    for (const route of routes) {
      let ok = false;
      for (let attempt = 1; attempt <= 3 && !ok; attempt += 1) {
        try {
          await prerenderRoute(browser, route);
          ok = true;
        } catch (err) {
          console.warn(`⚠️  Failed to prerender ${route} (attempt ${attempt}):`, err.message);
        }
      }
      if (!ok) failed.push(route);
    }
  } finally {
    await browser.close();
    stopPreviewServer(server);
  }

  if (failed.length > 0) {
    rmSync(STAGING_DIR, { recursive: true, force: true });
    console.error(`❌ Prerender finished with ${failed.length} failing route(s): ${failed.join(', ')}`);
    process.exit(1);
  }

  cpSync(STAGING_DIR, DIST_DIR, { recursive: true });
  rmSync(STAGING_DIR, { recursive: true, force: true });
  console.log('✅ Prerender complete.');
  // Explicit exit as a safety net: any lingering handle (an orphaned child
  // process, an open socket) would otherwise keep the event loop alive and
  // hang whatever npm script chain called this (e.g. `npm run deploy`).
  process.exit(0);
}

main().catch((err) => {
  console.error('❌ Prerender failed:', err);
  process.exit(1);
});
