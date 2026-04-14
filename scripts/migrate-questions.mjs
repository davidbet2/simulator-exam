/**
 * Migrates questions from appian-simulator (original) → simulatorexam-dec4b (new).
 * 
 * - Reads questions from old Firestore (public read, no auth needed)
 * - Authenticates with new project and bulk-imports
 * 
 * Run: node scripts/migrate-questions.mjs
 */

import { initializeApp } from 'firebase/app';
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';
import {
  getFirestore,
  collection,
  getDocs,
  writeBatch,
  doc,
  serverTimestamp,
} from 'firebase/firestore';
import { config } from 'dotenv';

config();

// ─── Source (original project) — public read, no auth needed ────────────────
const sourceConfig = {
  apiKey: 'AIzaSyA5NRLfQmVU2JBd-ApUJUXdX8KCQ9kBhtY',
  authDomain: 'appian-simulator.firebaseapp.com',
  projectId: 'appian-simulator',
  storageBucket: 'appian-simulator.firebasestorage.app',
  messagingSenderId: '778922950756',
  appId: '1:778922950756:web:c532fc6e1ca67dbf539f71',
};

// ─── Destination (new project) — from .env ───────────────────────────────────
const destConfig = {
  apiKey: process.env.VITE_FIREBASE_API_KEY,
  authDomain: process.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: process.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.VITE_FIREBASE_APP_ID,
};

const ADMIN_EMAIL = process.env.SETUP_ADMIN_EMAIL;
const ADMIN_PASSWORD = process.env.SETUP_ADMIN_PASSWORD;

const CHUNK = 499;

async function run() {
  console.log('\n🔄 Migration: appian-simulator → simulatorexam-dec4b\n');

  // Init two separate Firebase app instances
  const sourceApp = initializeApp(sourceConfig, 'source');
  const destApp = initializeApp(destConfig, 'dest');

  const sourceDb = getFirestore(sourceApp);
  const destAuth = getAuth(destApp);
  const destDb = getFirestore(destApp);

  // 1. Authenticate with destination
  console.log(`🔐 Signing into destination as ${ADMIN_EMAIL}...`);
  await signInWithEmailAndPassword(destAuth, ADMIN_EMAIL, ADMIN_PASSWORD);
  console.log('   ✅ Authenticated\n');

  // 2. Read ALL questions from source
  console.log('📥 Reading questions from appian-simulator...');
  const snapshot = await getDocs(collection(sourceDb, 'questions'));
  const questions = snapshot.docs.map((d) => d.data());
  console.log(`   ✅ ${questions.length} questions fetched\n`);

  if (questions.length === 0) {
    console.log('⚠️  No questions found in source. Aborting.');
    process.exit(0);
  }

  // 3. Bulk-write to destination in chunks of 499
  console.log(`📤 Writing to simulatorexam-dec4b...`);
  let written = 0;
  for (let i = 0; i < questions.length; i += CHUNK) {
    const chunk = questions.slice(i, i + CHUNK);
    const batch = writeBatch(destDb);
    chunk.forEach((q) => {
      const ref = doc(collection(destDb, 'questions'));
      batch.set(ref, { ...q, migratedAt: serverTimestamp() });
    });
    await batch.commit();
    written += chunk.length;
    console.log(`   ✅ ${written}/${questions.length} written`);
  }

  console.log(`\n🎉 Migration complete! ${written} questions imported.`);
  process.exit(0);
}

run().catch((err) => {
  console.error('❌ Migration failed:', err.message);
  process.exit(1);
});
