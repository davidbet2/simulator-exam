import { useState, useCallback } from 'react';
import {
  collection,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  serverTimestamp,
  setDoc,
  writeBatch,
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
  };
}
