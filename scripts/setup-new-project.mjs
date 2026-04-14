/**
 * Setup script for new Firebase project.
 * 
 * What it does:
 *   1. Grants admin role to SETUP_ADMIN_EMAIL in Firestore (user must already exist in Auth)
 *   2. Seeds questions from src/assets/preguntas-associate-new-types.json (developer-senior)
 * 
 * Usage:
 *   Add to .env: SETUP_ADMIN_EMAIL=davbetancur@gmail.com
 *   node scripts/setup-new-project.mjs
 */

import { initializeApp } from 'firebase/app';
import {
  getAuth,
  signInWithEmailAndPassword,
} from 'firebase/auth';
import {
  getFirestore,
  collection,
  doc,
  setDoc,
  addDoc,
  getDocs,
  serverTimestamp,
} from 'firebase/firestore';
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { config } from 'dotenv';

config();

const __dirname = dirname(fileURLToPath(import.meta.url));

// ─── Firebase config from .env ──────────────────────────────────────────────
const firebaseConfig = {
  apiKey: process.env.VITE_FIREBASE_API_KEY,
  authDomain: process.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: process.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.VITE_FIREBASE_APP_ID,
};

const ADMIN_EMAIL = process.env.SETUP_ADMIN_EMAIL;
const ADMIN_PASSWORD = process.env.SETUP_ADMIN_PASSWORD;

// ─── Validate config ─────────────────────────────────────────────────────────
const missing = Object.entries(firebaseConfig)
  .filter(([, v]) => !v)
  .map(([k]) => k);
if (missing.length > 0) {
  console.error('❌ Missing Firebase env vars:', missing.join(', '));
  process.exit(1);
}
if (!ADMIN_EMAIL || !ADMIN_PASSWORD) {
  console.error('❌ SETUP_ADMIN_EMAIL and SETUP_ADMIN_PASSWORD are required in .env');
  process.exit(1);
}

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

// ─── Load questions ───────────────────────────────────────────────────────────
const questionsPath = join(__dirname, '..', 'src', 'assets', 'preguntas-associate-new-types.json');
const questions = JSON.parse(readFileSync(questionsPath, 'utf8'));

// ─── Main ─────────────────────────────────────────────────────────────────────
async function setup() {
  console.log(`\n🚀 Setting up project: ${firebaseConfig.projectId}\n`);

  // 0. Sign in to get authenticated context for Firestore
  console.log(`🔐 Signing in as: ${ADMIN_EMAIL}`);
  await signInWithEmailAndPassword(auth, ADMIN_EMAIL, ADMIN_PASSWORD);
  console.log('   ✅ Authenticated\n');

  // 1. Grant admin role
  console.log(`👤 Granting admin to: ${ADMIN_EMAIL}`);
  await setDoc(doc(db, 'admins', ADMIN_EMAIL), {
    grantedBy: 'setup-script',
    grantedAt: serverTimestamp(),
  });
  console.log('   ✅ Admin role granted\n');

  // 2. Seed questions (skip duplicates by question text)
  console.log(`📚 Seeding questions from preguntas-associate-new-types.json...`);
  const existing = await getDocs(collection(db, 'questions'));
  const existingSet = new Set(
    existing.docs.map((d) => d.data().question?.trim()).filter(Boolean)
  );

  let added = 0;
  let skipped = 0;

  for (const q of questions) {
    const key = q.question?.trim();
    if (key && existingSet.has(key)) {
      skipped++;
      continue;
    }
    await addDoc(collection(db, 'questions'), {
      ...q,
      category: 'developer',
      level: 'senior',
      createdBy: ADMIN_EMAIL,
      createdAt: serverTimestamp(),
    });
    added++;
  }

  console.log(`   ✅ ${added} questions added, ${skipped} skipped (already exist)\n`);
  console.log('🎉 Setup complete!');
  console.log(`   App URL: https://${firebaseConfig.projectId}.web.app`);
  process.exit(0);
}

setup().catch((err) => {
  console.error('❌ Setup failed:', err.message);
  process.exit(1);
});
