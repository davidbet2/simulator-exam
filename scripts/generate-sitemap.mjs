/**
 * Generate a static sitemap.xml + robots.txt in /public at build time.
 *
 * Usage:
 *   node scripts/generate-sitemap.mjs [--base-url=https://certzen.app]
 *
 * It pulls published examSets from Firestore to include their landing URLs.
 */
import { initializeApp } from 'firebase/app';
import { getFirestore, collection, query, where, getDocs } from 'firebase/firestore';
import { writeFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { config } from 'dotenv';

config();

const args = Object.fromEntries(
  process.argv.slice(2).map((a) => {
    const [k, v] = a.replace(/^--/, '').split('=');
    return [k, v ?? true];
  }),
);
const BASE_URL = args['base-url'] ?? process.env.SITE_URL ?? 'https://certzen.app';

const __dirname = dirname(fileURLToPath(import.meta.url));
const PUBLIC_DIR = join(__dirname, '..', 'public');

const firebaseConfig = {
  apiKey: process.env.VITE_FIREBASE_API_KEY,
  authDomain: process.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: process.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.VITE_FIREBASE_APP_ID,
};

const app = initializeApp(firebaseConfig);
const db  = getFirestore(app);

const STATIC_ROUTES = [
  { loc: '/',         priority: '1.0', changefreq: 'weekly' },
  { loc: '/explore',  priority: '0.9', changefreq: 'daily' },
  { loc: '/pricing',  priority: '0.7', changefreq: 'monthly' },
  { loc: '/about',    priority: '0.5', changefreq: 'yearly' },
  { loc: '/privacy',  priority: '0.3', changefreq: 'yearly' },
  { loc: '/terms',    priority: '0.3', changefreq: 'yearly' },
  { loc: '/contact',  priority: '0.4', changefreq: 'yearly' },
];

const DOMAIN_ROUTES = ['appian', 'it', 'security', 'agile', 'health', 'english', 'logic'].map((d) => ({
  loc: `/explore?domain=${d}`,
  priority: '0.8',
  changefreq: 'weekly',
}));

function xmlEscape(s) {
  return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&apos;');
}

function toUrl(entry, base) {
  const lastmod = entry.lastmod ? `\n    <lastmod>${entry.lastmod}</lastmod>` : '';
  return `  <url>
    <loc>${xmlEscape(base + entry.loc)}</loc>${lastmod}
    <changefreq>${entry.changefreq}</changefreq>
    <priority>${entry.priority}</priority>
  </url>`;
}

async function main() {
  console.log(`🗺️  Generating sitemap for ${BASE_URL}…`);

  let setEntries = [];
  try {
    const snap = await getDocs(
      query(collection(db, 'examSets'), where('published', '==', true)),
    );
    setEntries = snap.docs.map((d) => {
      const data = d.data();
      const updatedAt = data.updatedAt?.toDate?.()?.toISOString?.()?.slice(0, 10);
      return {
        loc: `/exam-sets/${d.id}`,
        priority: data.official ? '0.9' : '0.7',
        changefreq: 'weekly',
        lastmod: updatedAt,
      };
    });
    console.log(`   · ${setEntries.length} published sets`);
  } catch (err) {
    console.warn('⚠️  Could not fetch sets from Firestore (continuing with static only):', err.message);
  }

  const all = [...STATIC_ROUTES, ...DOMAIN_ROUTES, ...setEntries];

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${all.map((e) => toUrl(e, BASE_URL)).join('\n')}
</urlset>
`;

  writeFileSync(join(PUBLIC_DIR, 'sitemap.xml'), xml);
  console.log(`   ✅ Wrote ${all.length} URLs to public/sitemap.xml`);

  const robots = `User-agent: *
Allow: /

Disallow: /admin
Disallow: /admin/*
Disallow: /dashboard
Disallow: /profile
Disallow: /create-exam
Disallow: /exam
Disallow: /results

Sitemap: ${BASE_URL}/sitemap.xml
`;
  writeFileSync(join(PUBLIC_DIR, 'robots.txt'), robots);
  console.log(`   ✅ Wrote public/robots.txt`);

  process.exit(0);
}

main().catch((err) => {
  console.error('❌ Sitemap generation failed:', err);
  process.exit(1);
});
