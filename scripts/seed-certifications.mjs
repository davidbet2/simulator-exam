/**
 * Seeds the `certifications` Firestore collection.
 * Run: node scripts/seed-certifications.mjs
 */

import { initializeApp } from 'firebase/app';
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';
import { getFirestore, doc, setDoc, serverTimestamp } from 'firebase/firestore';
import { config } from 'dotenv';

config();

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

const certifications = [
  {
    id: 'developer-senior',
    label: 'Senior Developer',
    labelEs: 'Desarrollador Senior',
    category: 'developer',
    level: 'senior',
    questionCount: 50,
    timeMinutes: 60,
    passPercent: 60,
    available: true,
    color: 'blue',
    order: 1,
  },
  {
    id: 'developer-associate',
    label: 'Associate Developer',
    labelEs: 'Desarrollador Associate',
    category: 'developer',
    level: 'associate',
    questionCount: 60,
    timeMinutes: 60,
    passPercent: 72,
    available: true,
    color: 'green',
    order: 2,
  },
  {
    id: 'analyst-associate',
    label: 'Associate Analyst',
    labelEs: 'Analista Associate',
    category: 'analyst',
    level: 'associate',
    questionCount: 50,
    timeMinutes: 60,
    passPercent: 60,
    available: true,
    color: 'purple',
    order: 3,
  },
];

async function run() {
  const app = initializeApp(firebaseConfig);
  const auth = getAuth(app);
  const db = getFirestore(app);

  console.log(`🔐 Signing in as ${ADMIN_EMAIL}...`);
  await signInWithEmailAndPassword(auth, ADMIN_EMAIL, ADMIN_PASSWORD);
  console.log('   ✅ Authenticated\n');

  console.log('📋 Seeding certifications...');
  for (const cert of certifications) {
    const { id, ...data } = cert;
    await setDoc(doc(db, 'certifications', id), { ...data, updatedAt: serverTimestamp() });
    console.log(`   ✅ ${cert.labelEs}`);
  }

  console.log('\n🎉 Certifications seeded!');
  process.exit(0);
}

run().catch((err) => {
  console.error('❌ Error:', err.message);
  process.exit(1);
});
