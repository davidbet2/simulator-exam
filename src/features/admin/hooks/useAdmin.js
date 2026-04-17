import { useState, useCallback } from 'react';
import {
  collection,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  getCountFromServer,
  serverTimestamp,
  setDoc,
  writeBatch,
  query,
  where,
  orderBy,
  limit,
  startAfter,
} from 'firebase/firestore';
import { db } from '../../../core/firebase/firebase';
import { useAuthStore } from '../../../core/store/useAuthStore';

export function useAdmin() {
  const user = useAuthStore((s) => s.user);
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [stats, setStats] = useState({});

  const fetchQuestions = useCallback(async (filters = {}) => {
    setLoading(true);
    setError(null);
    try {
      // Fetch all and filter client-side to avoid needing Firestore composite indexes
      const snapshot = await getDocs(collection(db, 'questions'));
      let data = snapshot.docs.map((d) => ({ id: d.id, ...d.data() }));
      if (filters.category) data = data.filter((q) => q.category === filters.category);
      if (filters.level) data = data.filter((q) => q.level === filters.level);
      setQuestions(data);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchStats = useCallback(async () => {
    try {
      const snapshot = await getDocs(collection(db, 'questions'));
      const counts = {};
      snapshot.docs.forEach((d) => {
        const { category, level } = d.data();
        const key = `${category}-${level}`;
        counts[key] = (counts[key] || 0) + 1;
      });
      setStats(counts);
    } catch (e) {
      console.error('Stats error:', e.message);
    }
  }, []);

  const addQuestion = useCallback(
    async (questionData) => {
      setLoading(true);
      try {
        await addDoc(collection(db, 'questions'), {
          ...questionData,
          createdBy: user?.email ?? 'admin',
          createdAt: serverTimestamp(),
        });
        return true;
      } catch (e) {
        setError(e.message);
        return false;
      } finally {
        setLoading(false);
      }
    },
    [user]
  );

  const updateQuestion = useCallback(async (id, questionData) => {
    setLoading(true);
    try {
      await updateDoc(doc(db, 'questions', id), {
        ...questionData,
        updatedAt: serverTimestamp(),
      });
      return true;
    } catch (e) {
      setError(e.message);
      return false;
    } finally {
      setLoading(false);
    }
  }, []);

  const deleteQuestion = useCallback(async (id) => {
    try {
      await deleteDoc(doc(db, 'questions', id));
      setQuestions((prev) => prev.filter((q) => q.id !== id));
      return true;
    } catch (e) {
      setError(e.message);
      return false;
    }
  }, []);

  const fetchCertSettings = useCallback(async (certId) => {
    try {
      const snap = await getDoc(doc(db, 'settings', certId));
      return snap.exists() ? snap.data() : null;
    } catch {
      return null;
    }
  }, []);

  const saveCertSettings = useCallback(async (certId, data) => {
    try {
      await setDoc(doc(db, 'settings', certId), data, { merge: true });
      return true;
    } catch (e) {
      setError(e.message);
      return false;
    }
  }, []);

  /**
   * Bulk-import questions via Firestore writeBatch.
   * Splits into chunks of 499 to stay under the 500-op batch limit.
   */
  const importQuestions = useCallback(
    async (questionsArray, category, level) => {
      const CHUNK = 499;
      try {
        for (let i = 0; i < questionsArray.length; i += CHUNK) {
          const batch = writeBatch(db);
          questionsArray.slice(i, i + CHUNK).forEach((q) => {
            const ref = doc(collection(db, 'questions'));
            batch.set(ref, {
              ...q,
              category,
              level,
              createdBy: user?.email ?? 'admin',
              createdAt: serverTimestamp(),
            });
          });
          await batch.commit();
        }
        return { ok: true, count: questionsArray.length };
      } catch (e) {
        return { ok: false, error: e.message };
      }
    },
    [user]
  );

  // Grant admin to another user by email
  const grantAdmin = useCallback(
    async (email) => {
      try {
        await setDoc(doc(db, 'admins', email), {
          grantedBy: user?.email ?? 'admin',
          grantedAt: serverTimestamp(),
        });
        return true;
      } catch (e) {
        setError(e.message);
        return false;
      }
    },
    [user]
  );

  // Revoke admin from a user by email
  const revokeAdmin = useCallback(async (email) => {
    try {
      await deleteDoc(doc(db, 'admins', email));
      return true;
    } catch (e) {
      setError(e.message);
      return false;
    }
  }, []);

  const fetchAdmins = useCallback(async () => {
    try {
      const snapshot = await getDocs(collection(db, 'admins'));
      return snapshot.docs.map((d) => ({ email: d.id, ...d.data() }));
    } catch (e) {
      setError(e.message);
      return [];
    }
  }, []);

  // ── Certifications ───────────────────────────────────────────────
  /** Returns sorted array or null (empty collection → needs seeding). */
  const fetchCertifications = useCallback(async () => {
    try {
      const snap = await getDocs(collection(db, 'certifications'));
      if (snap.empty) return null;
      return snap.docs
        .map((d) => ({ id: d.id, ...d.data() }))
        .sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
    } catch {
      return null;
    }
  }, []);

  /** Seed certifications collection from an array of {id, ...data} objects. */
  const seedCertifications = useCallback(async (certsArray) => {
    try {
      const CHUNK = 499;
      for (let i = 0; i < certsArray.length; i += CHUNK) {
        const batch = writeBatch(db);
        certsArray.slice(i, i + CHUNK).forEach(({ id, ...data }) => {
          batch.set(doc(db, 'certifications', id), data);
        });
        await batch.commit();
      }
      return true;
    } catch (e) {
      setError(e.message);
      return false;
    }
  }, []);

  /** Update (merge) a single certification by id. */
  const saveCertification = useCallback(async (id, data) => {
    try {
      await setDoc(doc(db, 'certifications', id), data, { merge: true });
      return true;
    } catch (e) {
      setError(e.message);
      return false;
    }
  }, []);

  /** Create a new certification (fails if doc already exists — use saveCertification to update). */
  const createCertification = useCallback(async (id, data) => {
    try {
      await setDoc(doc(db, 'certifications', id), data);
      return true;
    } catch (e) {
      setError(e.message);
      return false;
    }
  }, []);

  /** Delete a certification by id. */
  const deleteCertification = useCallback(async (id) => {
    try {
      await deleteDoc(doc(db, 'certifications', id));
      return true;
    } catch (e) {
      setError(e.message);
      return false;
    }
  }, []);

  // ── Users (real end-users, not admins) ──────────────────────────
  const fetchUsers = useCallback(async ({ pageSize = 25, afterDoc = null } = {}) => {
    try {
      const clauses = [orderBy('createdAt', 'desc')];
      if (afterDoc) clauses.push(startAfter(afterDoc));
      clauses.push(limit(pageSize));
      const snap = await getDocs(query(collection(db, 'users'), ...clauses));
      return {
        users:   snap.docs.map((d) => ({ id: d.id, ...d.data() })),
        lastDoc: snap.docs[snap.docs.length - 1] ?? null,
      };
    } catch (e) {
      setError(e.message);
      return { users: [], lastDoc: null };
    }
  }, []);

  const searchUserByEmail = useCallback(async (email) => {
    try {
      const q = query(
        collection(db, 'users'),
        where('email', '==', email.trim().toLowerCase()),
        limit(5),
      );
      const snap = await getDocs(q);
      return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
    } catch (e) {
      setError(e.message);
      return [];
    }
  }, []);

  const fetchUserById = useCallback(async (uid) => {
    try {
      const snap = await getDoc(doc(db, 'users', uid));
      return snap.exists() ? { id: snap.id, ...snap.data() } : null;
    } catch {
      return null;
    }
  }, []);

  const updateUserPlan = useCallback(
    async (uid, newPlan) => {
      try {
        await updateDoc(doc(db, 'users', uid), {
          plan:          newPlan,
          planChangedBy: user?.email ?? 'admin',
          planChangedAt: serverTimestamp(),
        });
        return true;
      } catch (e) {
        setError(e.message);
        return false;
      }
    },
    [user],
  );

  const setUserBanned = useCallback(
    async (uid, banned, reason = null) => {
      try {
        await updateDoc(doc(db, 'users', uid), {
          banned,
          bannedReason: banned ? (reason ?? '') : null,
          bannedBy:     banned ? (user?.email ?? 'admin') : null,
          bannedAt:     banned ? serverTimestamp() : null,
        });
        return true;
      } catch (e) {
        setError(e.message);
        return false;
      }
    },
    [user],
  );

  const fetchUserAttemptCount = useCallback(async (uid) => {
    try {
      const snap = await getDocs(
        query(collection(db, 'attempts'), where('uid', '==', uid)),
      );
      return snap.size;
    } catch {
      return 0;
    }
  }, []);

  // ── ExamSets (community-generated) ──────────────────────────────
  const fetchExamSets = useCallback(
    async ({ pageSize = 25, afterDoc = null, onlyPublished = false } = {}) => {
      try {
        const clauses = [];
        if (onlyPublished) clauses.push(where('published', '==', true));
        clauses.push(orderBy('createdAt', 'desc'));
        if (afterDoc) clauses.push(startAfter(afterDoc));
        clauses.push(limit(pageSize));
        const snap = await getDocs(query(collection(db, 'examSets'), ...clauses));
        return {
          sets:    snap.docs.map((d) => ({ id: d.id, ...d.data() })),
          lastDoc: snap.docs[snap.docs.length - 1] ?? null,
        };
      } catch (e) {
        setError(e.message);
        return { sets: [], lastDoc: null };
      }
    },
    [],
  );

  const fetchExamSetById = useCallback(async (setId) => {
    try {
      const [setSnap, qSnap] = await Promise.all([
        getDoc(doc(db, 'examSets', setId)),
        getDocs(collection(db, 'examSets', setId, 'questions')),
      ]);
      if (!setSnap.exists()) return null;
      return {
        id: setSnap.id,
        ...setSnap.data(),
        questions: qSnap.docs.map((d) => ({ id: d.id, ...d.data() })),
      };
    } catch (e) {
      setError(e.message);
      return null;
    }
  }, []);

  const setExamSetPublished = useCallback(
    async (setId, published) => {
      try {
        await updateDoc(doc(db, 'examSets', setId), {
          published,
          moderatedBy: user?.email ?? 'admin',
          moderatedAt: serverTimestamp(),
        });
        return true;
      } catch (e) {
        setError(e.message);
        return false;
      }
    },
    [user],
  );

  const softDeleteExamSet = useCallback(
    async (setId, reason = null) => {
      try {
        await updateDoc(doc(db, 'examSets', setId), {
          deleted:       true,
          deletedBy:     user?.email ?? 'admin',
          deletedAt:     serverTimestamp(),
          deletedReason: reason,
          published:     false,
        });
        return true;
      } catch (e) {
        setError(e.message);
        return false;
      }
    },
    [user],
  );

  const setExamSetFeatured = useCallback(async (setId, featured) => {
    try {
      await updateDoc(doc(db, 'examSets', setId), { featured });
      return true;
    } catch (e) {
      setError(e.message);
      return false;
    }
  }, []);

  // ── Attempts (read-only for admin) ──────────────────────────────
  const fetchAttempts = useCallback(
    async ({ pageSize = 30, afterDoc = null, uid = null } = {}) => {
      try {
        const clauses = [];
        if (uid) clauses.push(where('uid', '==', uid));
        clauses.push(orderBy('createdAt', 'desc'));
        if (afterDoc) clauses.push(startAfter(afterDoc));
        clauses.push(limit(pageSize));
        const snap = await getDocs(query(collection(db, 'attempts'), ...clauses));
        return {
          attempts: snap.docs.map((d) => ({ id: d.id, ...d.data() })),
          lastDoc:  snap.docs[snap.docs.length - 1] ?? null,
        };
      } catch (e) {
        setError(e.message);
        return { attempts: [], lastDoc: null };
      }
    },
    [],
  );

  // ── Dashboard KPIs ──────────────────────────────────────────────
  // Uses getCountFromServer for collection-level counts to avoid reading
  // all documents (cost-efficient with Blaze plan, scales with user growth).
  const fetchDashboardKPIs = useCallback(async () => {
    const now = Date.now();
    const D1  = now - 24 * 60 * 60 * 1000;
    const D7  = now - 7  * 24 * 60 * 60 * 1000;
    const D30 = now - 30 * 24 * 60 * 60 * 1000;
    const ts  = (d) => new Date(now - d);
    try {
      const [
        totalUsersSnap,
        proUsersSnap,
        newUsers7dSnap,
        newUsers30dSnap,
        bannedUsersSnap,
        totalAttemptsSnap,
        attempts24hSnap,
        attempts7dSnap,
        publishedSetsSnap,
        totalSetsSnap,
        questionsSnap,
      ] = await Promise.all([
        getCountFromServer(collection(db, 'users')),
        getCountFromServer(query(collection(db, 'users'), where('plan', '==', 'pro'))),
        getCountFromServer(query(collection(db, 'users'), where('createdAt', '>=', ts(D7)))),
        getCountFromServer(query(collection(db, 'users'), where('createdAt', '>=', ts(D30)))),
        getCountFromServer(query(collection(db, 'users'), where('banned', '==', true))),
        getCountFromServer(collection(db, 'attempts')),
        getCountFromServer(query(collection(db, 'attempts'), where('createdAt', '>=', ts(D1)))),
        getCountFromServer(query(collection(db, 'attempts'), where('createdAt', '>=', ts(D7)))),
        getCountFromServer(query(collection(db, 'examSets'), where('published', '==', true), where('deleted', '==', false))),
        getCountFromServer(query(collection(db, 'examSets'), where('deleted', '==', false))),
        getCountFromServer(collection(db, 'questions')),
      ]);

      const totalUsers    = totalUsersSnap.data().count;
      const proUsers      = proUsersSnap.data().count;
      const conversionPct = totalUsers > 0 ? Math.round((proUsers / totalUsers) * 100) : 0;

      return {
        totalUsers,
        proUsers,
        newUsers7d:    newUsers7dSnap.data().count,
        newUsers30d:   newUsers30dSnap.data().count,
        bannedUsers:   bannedUsersSnap.data().count,
        conversionPct,
        totalAttempts: totalAttemptsSnap.data().count,
        attempts24h:   attempts24hSnap.data().count,
        attempts7d:    attempts7dSnap.data().count,
        publishedSets: publishedSetsSnap.data().count,
        totalSets:     totalSetsSnap.data().count,
        totalQuestions: questionsSnap.data().count,
      };
    } catch (e) {
      console.error('KPI fetch error:', e.message);
      return null;
    }
  }, []);

  return {
    questions,
    loading,
    error,
    stats,
    fetchQuestions,
    fetchStats,
    addQuestion,
    updateQuestion,
    deleteQuestion,
    importQuestions,
    fetchCertSettings,
    saveCertSettings,
    grantAdmin,
    revokeAdmin,
    fetchAdmins,
    fetchCertifications,
    seedCertifications,
    saveCertification,
    createCertification,
    deleteCertification,
    // Users
    fetchUsers,
    searchUserByEmail,
    fetchUserById,
    updateUserPlan,
    setUserBanned,
    fetchUserAttemptCount,
    // ExamSets
    fetchExamSets,
    fetchExamSetById,
    setExamSetPublished,
    softDeleteExamSet,
    setExamSetFeatured,
    // Attempts
    fetchAttempts,
    // KPIs
    fetchDashboardKPIs,
  };
}
