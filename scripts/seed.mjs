/**
 * Firebase Seed Script — Run ONCE to set up the database.
 *
 * Usage:
 *   1. Copy .env.example → .env and fill Firebase values
 *   2. npm run seed
 *
 * What it does:
 *   - Creates admin user: david.betancur@pragma.com.co / Appian123!
 *   - Adds that email to the `admins` collection
 *   - Seeds all Senior Developer questions from preguntas.json
 */

import { initializeApp } from 'firebase/app';
import {
  getAuth,
  createUserWithEmailAndPassword,
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

config(); // Load .env

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

// Validate config
const missing = Object.entries(firebaseConfig)
  .filter(([, v]) => !v)
  .map(([k]) => k);
if (missing.length > 0) {
  console.error('❌ Missing environment variables:', missing.join(', '));
  console.error('   Copy .env.example → .env and fill in the values.');
  process.exit(1);
}

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

// ─── Admin credentials ───────────────────────────────────────────────────────
const ADMIN_EMAIL = 'david.betancur@pragma.com.co';
const ADMIN_PASSWORD = 'Appian123!';

// ─── Load questions ───────────────────────────────────────────────────────────
const preguntasPath = join(__dirname, '..', '..', 'preguntas.json');
const questions = JSON.parse(readFileSync(preguntasPath, 'utf8'));

// ─── Main seed function ───────────────────────────────────────────────────────
async function seed() {
  console.log('🌱 Starting seed...\n');

  // 1. Create or sign in admin user
  console.log(`👤 Setting up admin: ${ADMIN_EMAIL}`);
  let uid;
  try {
    const cred = await createUserWithEmailAndPassword(auth, ADMIN_EMAIL, ADMIN_PASSWORD);
    uid = cred.user.uid;
    console.log('   ✅ Admin user created');
  } catch (err) {
    if (err.code === 'auth/email-already-in-use') {
      const cred = await signInWithEmailAndPassword(auth, ADMIN_EMAIL, ADMIN_PASSWORD);
      uid = cred.user.uid;
      console.log('   ℹ️  Admin user already exists, using existing account');
    } else {
      throw err;
    }
  }

  // 2. Grant admin role in Firestore
  await setDoc(doc(db, 'admins', ADMIN_EMAIL), {
    grantedBy: 'seed',
    grantedAt: serverTimestamp(),
  });
  console.log('   ✅ Admin role granted in Firestore\n');

  // 3. Seed questions (skip if already seeded)
  console.log(`📚 Seeding Senior Developer questions...`);
  const existing = await getDocs(collection(db, 'questions'));
  const existingSet = new Set(existing.docs.map((d) => d.data().question?.trim()));

  let added = 0;
  let skipped = 0;

  for (const q of questions) {
    const questionText = q.question?.trim();
    if (existingSet.has(questionText)) {
      skipped++;
      continue;
    }
    await addDoc(collection(db, 'questions'), {
      question: q.question,
      options: q.options,
      answer: q.answer,
      category: 'developer',
      level: 'senior',
      createdBy: ADMIN_EMAIL,
      createdAt: serverTimestamp(),
    });
    added++;
  }

  console.log(`   ✅ ${added} questions added, ${skipped} skipped (already exist)\n`);

  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('✅ Seed complete!');
  console.log(`   Admin: ${ADMIN_EMAIL}`);
  console.log(`   Password: ${ADMIN_PASSWORD}`);
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  process.exit(0);
}

seed().catch((err) => {
  console.error('❌ Seed failed:', err.message);
  process.exit(1);
});
