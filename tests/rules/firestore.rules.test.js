/**
 * Firestore Security Rules — emulator tests.
 *
 * Cubre los escenarios críticos definidos en
 * memory/plans/2026-04-17-critical-fixes-plan.md (P1.1).
 *
 * Ejecutar:
 *   firebase emulators:exec --only firestore "vitest run tests/rules"
 *
 * Requisitos:
 *   - El emulador de Firestore debe estar corriendo (firestore.rules cargado).
 *   - FIRESTORE_EMULATOR_HOST se setea automáticamente por `emulators:exec`.
 */
import { describe, it, beforeAll, afterAll, beforeEach, expect } from 'vitest';
import {
  initializeTestEnvironment,
  assertFails,
  assertSucceeds,
} from '@firebase/rules-unit-testing';
import {
  doc,
  getDoc,
  setDoc,
  updateDoc,
  collection,
  addDoc,
  deleteDoc,
  query,
  where,
  limit,
  getDocs,
} from 'firebase/firestore';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PROJECT_ID = 'simulator-exam-rules-test';

const ADMIN_EMAIL = 'admin@example.com';
const USER_A_UID = 'userA';
const USER_A_EMAIL = 'a@example.com';
const USER_B_UID = 'userB';

let testEnv;

beforeAll(async () => {
  testEnv = await initializeTestEnvironment({
    projectId: PROJECT_ID,
    firestore: {
      rules: fs.readFileSync(
        path.resolve(__dirname, '../../firestore.rules'),
        'utf8'
      ),
      host: '127.0.0.1',
      port: 8080,
    },
  });
}, 30000);

afterAll(async () => {
  if (testEnv) await testEnv.cleanup();
});

beforeEach(async () => {
  if (!testEnv) return;
  await testEnv.clearFirestore();
  // Seed admin record (reglas leen /admins/{email}).
  await testEnv.withSecurityRulesDisabled(async (ctx) => {
    const db = ctx.firestore();
    await setDoc(doc(db, 'admins', ADMIN_EMAIL), { addedAt: Date.now() });
  });
});

// Helpers
const authedDb = (uid, email) =>
  testEnv.authenticatedContext(uid, email ? { email } : undefined).firestore();
const anonDb = () => testEnv.unauthenticatedContext().firestore();
const adminDb = () =>
  testEnv.authenticatedContext('adminUid', { email: ADMIN_EMAIL }).firestore();

describe('users/{uid}', () => {
  it('owner can create their profile with plan=free', async () => {
    const db = authedDb(USER_A_UID, USER_A_EMAIL);
    await assertSucceeds(
      setDoc(doc(db, 'users', USER_A_UID), {
        email: USER_A_EMAIL,
        plan: 'free',
        createdAt: Date.now(),
      })
    );
  });

  it('owner CANNOT seed plan=pro on create (privilege escalation)', async () => {
    const db = authedDb(USER_A_UID, USER_A_EMAIL);
    await assertFails(
      setDoc(doc(db, 'users', USER_A_UID), {
        email: USER_A_EMAIL,
        plan: 'pro',
      })
    );
  });

  it('owner CANNOT seed role=admin on create', async () => {
    const db = authedDb(USER_A_UID, USER_A_EMAIL);
    await assertFails(
      setDoc(doc(db, 'users', USER_A_UID), {
        email: USER_A_EMAIL,
        plan: 'free',
        role: 'admin',
      })
    );
  });

  it('owner CANNOT seed isPro=true on create', async () => {
    const db = authedDb(USER_A_UID, USER_A_EMAIL);
    await assertFails(
      setDoc(doc(db, 'users', USER_A_UID), {
        email: USER_A_EMAIL,
        plan: 'free',
        isPro: true,
      })
    );
  });

  it('owner CANNOT update their own plan to pro (exploit gate)', async () => {
    // Seed con admin
    await testEnv.withSecurityRulesDisabled(async (ctx) => {
      await setDoc(doc(ctx.firestore(), 'users', USER_A_UID), {
        email: USER_A_EMAIL,
        plan: 'free',
      });
    });
    const db = authedDb(USER_A_UID, USER_A_EMAIL);
    await assertFails(updateDoc(doc(db, 'users', USER_A_UID), { plan: 'pro' }));
  });

  it('owner CANNOT update isPro/role/banned/verifiedAuthor', async () => {
    await testEnv.withSecurityRulesDisabled(async (ctx) => {
      await setDoc(doc(ctx.firestore(), 'users', USER_A_UID), {
        email: USER_A_EMAIL,
        plan: 'free',
      });
    });
    const db = authedDb(USER_A_UID, USER_A_EMAIL);
    await assertFails(
      updateDoc(doc(db, 'users', USER_A_UID), { isPro: true })
    );
    await assertFails(
      updateDoc(doc(db, 'users', USER_A_UID), { role: 'admin' })
    );
    await assertFails(
      updateDoc(doc(db, 'users', USER_A_UID), { banned: false })
    );
    await assertFails(
      updateDoc(doc(db, 'users', USER_A_UID), { verifiedAuthor: true })
    );
  });

  it('owner CAN update non-privileged fields', async () => {
    await testEnv.withSecurityRulesDisabled(async (ctx) => {
      await setDoc(doc(ctx.firestore(), 'users', USER_A_UID), {
        email: USER_A_EMAIL,
        plan: 'free',
      });
    });
    const db = authedDb(USER_A_UID, USER_A_EMAIL);
    await assertSucceeds(
      updateDoc(doc(db, 'users', USER_A_UID), {
        displayName: 'Alice',
        photoURL: 'https://example.com/a.jpg',
      })
    );
  });

  it('user CANNOT read another user profile', async () => {
    await testEnv.withSecurityRulesDisabled(async (ctx) => {
      await setDoc(doc(ctx.firestore(), 'users', USER_B_UID), {
        email: 'b@example.com',
        plan: 'free',
      });
    });
    const db = authedDb(USER_A_UID, USER_A_EMAIL);
    await assertFails(getDoc(doc(db, 'users', USER_B_UID)));
  });

  it('admin CAN read another user profile', async () => {
    await testEnv.withSecurityRulesDisabled(async (ctx) => {
      await setDoc(doc(ctx.firestore(), 'users', USER_B_UID), {
        email: 'b@example.com',
        plan: 'free',
      });
    });
    const db = adminDb();
    await assertSucceeds(getDoc(doc(db, 'users', USER_B_UID)));
  });

  it('admin CAN update another user plan', async () => {
    await testEnv.withSecurityRulesDisabled(async (ctx) => {
      await setDoc(doc(ctx.firestore(), 'users', USER_B_UID), {
        email: 'b@example.com',
        plan: 'free',
      });
    });
    const db = adminDb();
    await assertSucceeds(
      updateDoc(doc(db, 'users', USER_B_UID), { plan: 'pro' })
    );
  });
});

describe('admins/{email}', () => {
  it('non-admin CANNOT add themselves as admin', async () => {
    const db = authedDb(USER_A_UID, USER_A_EMAIL);
    await assertFails(
      setDoc(doc(db, 'admins', USER_A_EMAIL), { addedAt: Date.now() })
    );
  });

  it('admin CAN promote another email', async () => {
    const db = adminDb();
    await assertSucceeds(
      setDoc(doc(db, 'admins', 'newadmin@example.com'), {
        addedAt: Date.now(),
      })
    );
  });

  it('user CAN read their own admin doc (to check status)', async () => {
    const db = authedDb(USER_A_UID, USER_A_EMAIL);
    // No admin doc exists for them → read succeeds (returns null)
    await assertSucceeds(getDoc(doc(db, 'admins', USER_A_EMAIL)));
  });
});

describe('attempts/{attemptId}', () => {
  it('user CAN create their own attempt', async () => {
    const db = authedDb(USER_A_UID, USER_A_EMAIL);
    await assertSucceeds(
      addDoc(collection(db, 'attempts'), {
        uid: USER_A_UID,
        score: 80,
        certId: 'developer-senior',
        createdAt: Date.now(),
      })
    );
  });

  it('user CANNOT create attempt with another uid', async () => {
    const db = authedDb(USER_A_UID, USER_A_EMAIL);
    await assertFails(
      addDoc(collection(db, 'attempts'), {
        uid: USER_B_UID,
        score: 80,
        certId: 'developer-senior',
      })
    );
  });

  it('user CANNOT update an attempt (immutable)', async () => {
    let attemptId;
    await testEnv.withSecurityRulesDisabled(async (ctx) => {
      const ref = await addDoc(collection(ctx.firestore(), 'attempts'), {
        uid: USER_A_UID,
        score: 50,
      });
      attemptId = ref.id;
    });
    const db = authedDb(USER_A_UID, USER_A_EMAIL);
    await assertFails(
      updateDoc(doc(db, 'attempts', attemptId), { score: 100 })
    );
  });

  it("user CANNOT read another user's attempt", async () => {
    let attemptId;
    await testEnv.withSecurityRulesDisabled(async (ctx) => {
      const ref = await addDoc(collection(ctx.firestore(), 'attempts'), {
        uid: USER_B_UID,
        score: 90,
      });
      attemptId = ref.id;
    });
    const db = authedDb(USER_A_UID, USER_A_EMAIL);
    await assertFails(getDoc(doc(db, 'attempts', attemptId)));
  });
});

describe('examSets/{setId}', () => {
  it('public CAN read a published set', async () => {
    await testEnv.withSecurityRulesDisabled(async (ctx) => {
      await setDoc(doc(ctx.firestore(), 'examSets', 'pub1'), {
        ownerUid: USER_B_UID,
        title: 'Public Set',
        questionCount: 10,
        published: true,
      });
    });
    const db = anonDb();
    await assertSucceeds(getDoc(doc(db, 'examSets', 'pub1')));
  });

  it('non-owner CANNOT read an unpublished set (anti-leak)', async () => {
    await testEnv.withSecurityRulesDisabled(async (ctx) => {
      await setDoc(doc(ctx.firestore(), 'examSets', 'draft1'), {
        ownerUid: USER_B_UID,
        title: 'Draft',
        questionCount: 5,
        published: false,
      });
    });
    const db = authedDb(USER_A_UID, USER_A_EMAIL);
    await assertFails(getDoc(doc(db, 'examSets', 'draft1')));
  });

  it('owner CAN read their own unpublished set', async () => {
    await testEnv.withSecurityRulesDisabled(async (ctx) => {
      await setDoc(doc(ctx.firestore(), 'examSets', 'draft1'), {
        ownerUid: USER_A_UID,
        title: 'My Draft',
        questionCount: 5,
        published: false,
      });
    });
    const db = authedDb(USER_A_UID, USER_A_EMAIL);
    await assertSucceeds(getDoc(doc(db, 'examSets', 'draft1')));
  });

  it('public list query MUST filter published==true', async () => {
    const db = anonDb();
    // Sin filtro published → la regla evalúa per-doc y al encontrar uno
    // con published==false rechaza la query completa.
    await assertFails(getDocs(query(collection(db, 'examSets'), limit(10))));
    // Con filtro published==true → debe pasar
    await assertSucceeds(
      getDocs(
        query(
          collection(db, 'examSets'),
          where('published', '==', true),
          limit(10)
        )
      )
    );
  });

  it('public list query CANNOT exceed limit 100', async () => {
    const db = anonDb();
    await assertFails(
      getDocs(
        query(
          collection(db, 'examSets'),
          where('published', '==', true),
          limit(500)
        )
      )
    );
  });

  it('user CANNOT create a set marking it as official', async () => {
    const db = authedDb(USER_A_UID, USER_A_EMAIL);
    await assertFails(
      setDoc(doc(db, 'examSets', 'fake-official'), {
        ownerUid: USER_A_UID,
        title: 'Fake Official',
        questionCount: 10,
        official: true,
      })
    );
  });

  it('user CANNOT create set with questionCount > 500', async () => {
    const db = authedDb(USER_A_UID, USER_A_EMAIL);
    await assertFails(
      setDoc(doc(db, 'examSets', 's1'), {
        ownerUid: USER_A_UID,
        title: 'Huge',
        questionCount: 9999,
      })
    );
  });

  it('non-owner CAN update aggregate counters (rating/favorites)', async () => {
    await testEnv.withSecurityRulesDisabled(async (ctx) => {
      await setDoc(doc(ctx.firestore(), 'examSets', 'set1'), {
        ownerUid: USER_B_UID,
        title: 'Set',
        questionCount: 5,
        published: true,
        ratingSum: 0,
        ratingCount: 0,
      });
    });
    const db = authedDb(USER_A_UID, USER_A_EMAIL);
    await assertSucceeds(
      updateDoc(doc(db, 'examSets', 'set1'), {
        ratingSum: 5,
        ratingCount: 1,
        ratingAvg: 5,
        updatedAt: Date.now(),
      })
    );
  });

  it('non-owner CANNOT update title or other non-aggregate fields', async () => {
    await testEnv.withSecurityRulesDisabled(async (ctx) => {
      await setDoc(doc(ctx.firestore(), 'examSets', 'set1'), {
        ownerUid: USER_B_UID,
        title: 'Original',
        questionCount: 5,
        published: true,
      });
    });
    const db = authedDb(USER_A_UID, USER_A_EMAIL);
    await assertFails(
      updateDoc(doc(db, 'examSets', 'set1'), { title: 'Hacked' })
    );
  });
});

describe('examSets/{setId}/ratings/{uid}', () => {
  beforeEach(async () => {
    await testEnv.withSecurityRulesDisabled(async (ctx) => {
      await setDoc(doc(ctx.firestore(), 'examSets', 'set1'), {
        ownerUid: USER_B_UID,
        title: 'Set',
        questionCount: 5,
        published: true,
      });
    });
  });

  it('user CAN rate a set (1-5 stars)', async () => {
    const db = authedDb(USER_A_UID, USER_A_EMAIL);
    await assertSucceeds(
      setDoc(doc(db, 'examSets', 'set1', 'ratings', USER_A_UID), {
        uid: USER_A_UID,
        stars: 4,
        createdAt: Date.now(),
      })
    );
  });

  it('user CANNOT rate with stars > 5', async () => {
    const db = authedDb(USER_A_UID, USER_A_EMAIL);
    await assertFails(
      setDoc(doc(db, 'examSets', 'set1', 'ratings', USER_A_UID), {
        uid: USER_A_UID,
        stars: 99,
      })
    );
  });

  it('owner CANNOT rate their own set', async () => {
    const db = authedDb(USER_B_UID, 'b@example.com');
    await assertFails(
      setDoc(doc(db, 'examSets', 'set1', 'ratings', USER_B_UID), {
        uid: USER_B_UID,
        stars: 5,
      })
    );
  });

  it('user CANNOT rate as another user (uid spoofing)', async () => {
    const db = authedDb(USER_A_UID, USER_A_EMAIL);
    await assertFails(
      setDoc(doc(db, 'examSets', 'set1', 'ratings', USER_B_UID), {
        uid: USER_B_UID,
        stars: 5,
      })
    );
  });
});

describe('users/{uid}/favorites,folders,questionStats', () => {
  it('owner CAN write their favorites', async () => {
    const db = authedDb(USER_A_UID, USER_A_EMAIL);
    await assertSucceeds(
      setDoc(doc(db, 'users', USER_A_UID, 'favorites', 'set-slug-1'), {
        addedAt: Date.now(),
      })
    );
  });

  it("user CANNOT read another user's favorites", async () => {
    await testEnv.withSecurityRulesDisabled(async (ctx) => {
      await setDoc(
        doc(ctx.firestore(), 'users', USER_B_UID, 'favorites', 'slug'),
        { addedAt: 1 }
      );
    });
    const db = authedDb(USER_A_UID, USER_A_EMAIL);
    await assertFails(
      getDoc(doc(db, 'users', USER_B_UID, 'favorites', 'slug'))
    );
  });

  it("user CANNOT write to another user's folders", async () => {
    const db = authedDb(USER_A_UID, USER_A_EMAIL);
    await assertFails(
      setDoc(doc(db, 'users', USER_B_UID, 'folders', 'f1'), {
        name: 'Hijack',
      })
    );
  });

  it("user CANNOT write another user's questionStats", async () => {
    const db = authedDb(USER_A_UID, USER_A_EMAIL);
    await assertFails(
      setDoc(doc(db, 'users', USER_B_UID, 'questionStats', 'set__q1'), {
        attempts: 10,
      })
    );
  });
});

describe('auditLog (tamper-evident)', () => {
  it('non-admin CANNOT read auditLog', async () => {
    const db = authedDb(USER_A_UID, USER_A_EMAIL);
    await assertFails(
      getDocs(query(collection(db, 'auditLog'), limit(5)))
    );
  });

  it('non-admin CANNOT write auditLog', async () => {
    const db = authedDb(USER_A_UID, USER_A_EMAIL);
    await assertFails(
      addDoc(collection(db, 'auditLog'), {
        actorEmail: USER_A_EMAIL,
        action: 'fake',
      })
    );
  });

  it('admin CAN create entries with their own email', async () => {
    const db = adminDb();
    await assertSucceeds(
      addDoc(collection(db, 'auditLog'), {
        actorEmail: ADMIN_EMAIL,
        action: 'plan_change',
        targetUid: USER_B_UID,
        at: Date.now(),
      })
    );
  });

  it('admin CANNOT create entry with spoofed actorEmail', async () => {
    const db = adminDb();
    await assertFails(
      addDoc(collection(db, 'auditLog'), {
        actorEmail: 'someone-else@example.com',
        action: 'plan_change',
      })
    );
  });

  it('admin CANNOT update or delete auditLog entries', async () => {
    let logId;
    await testEnv.withSecurityRulesDisabled(async (ctx) => {
      const ref = await addDoc(collection(ctx.firestore(), 'auditLog'), {
        actorEmail: ADMIN_EMAIL,
        action: 'x',
      });
      logId = ref.id;
    });
    const db = adminDb();
    await assertFails(
      updateDoc(doc(db, 'auditLog', logId), { action: 'tampered' })
    );
    await assertFails(deleteDoc(doc(db, 'auditLog', logId)));
  });
});

describe('Stripe extension paths (tamper-proof)', () => {
  it('owner CAN read their /customers doc', async () => {
    await testEnv.withSecurityRulesDisabled(async (ctx) => {
      await setDoc(doc(ctx.firestore(), 'customers', USER_A_UID), {
        stripeId: 'cus_test',
      });
    });
    const db = authedDb(USER_A_UID, USER_A_EMAIL);
    await assertSucceeds(getDoc(doc(db, 'customers', USER_A_UID)));
  });

  it("user CANNOT read another user's customer doc", async () => {
    await testEnv.withSecurityRulesDisabled(async (ctx) => {
      await setDoc(doc(ctx.firestore(), 'customers', USER_B_UID), {
        stripeId: 'cus_b',
      });
    });
    const db = authedDb(USER_A_UID, USER_A_EMAIL);
    await assertFails(getDoc(doc(db, 'customers', USER_B_UID)));
  });

  it('user CANNOT write subscription state directly', async () => {
    const db = authedDb(USER_A_UID, USER_A_EMAIL);
    await assertFails(
      setDoc(
        doc(db, 'customers', USER_A_UID, 'subscriptions', 'sub_1'),
        { status: 'active' }
      )
    );
  });

  it('user CANNOT write payment records directly', async () => {
    const db = authedDb(USER_A_UID, USER_A_EMAIL);
    await assertFails(
      setDoc(
        doc(db, 'customers', USER_A_UID, 'payments', 'pi_1'),
        { amount: 9999 }
      )
    );
  });
});
