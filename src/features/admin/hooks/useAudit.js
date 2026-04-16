import { useCallback } from 'react';
import {
  addDoc,
  collection,
  getDocs,
  limit,
  orderBy,
  query,
  serverTimestamp,
  startAfter,
  where,
} from 'firebase/firestore';
import { db } from '../../../core/firebase/firebase';
import { useAuthStore } from '../../../core/store/useAuthStore';

/**
 * Audit log hook — records every privileged admin action and provides a read API.
 *
 * Each entry: { actorEmail, action, target, targetId, diff, createdAt }
 * Rules:    create (admin only, actorEmail must match auth email), read/list (admin only).
 * There is no update or delete by design — tamper-evident append-only log.
 */
export function useAudit() {
  const user = useAuthStore((s) => s.user);

  /**
   * Record an admin action. Failures are logged to console but do NOT throw
   * to avoid blocking the primary action (we still have the business change).
   */
  const logAction = useCallback(
    async ({ action, target, targetId, diff = null, note = null }) => {
      if (!user?.email) return false;
      try {
        await addDoc(collection(db, 'auditLog'), {
          actorEmail: user.email,
          actorUid:   user.uid,
          action,       // e.g. 'user.plan.update', 'examSet.unpublish', 'admin.grant'
          target,       // e.g. 'users', 'examSets'
          targetId,     // document id the action affected
          diff,         // optional object with before/after snapshot
          note,         // optional human-readable note
          createdAt:    serverTimestamp(),
        });
        return true;
      } catch (e) {
        console.error('[audit] Failed to write log entry:', e.message);
        return false;
      }
    },
    [user],
  );

  /**
   * Read paginated audit log. Returns { entries, lastDoc } so the caller
   * can request the next page via startAfter(lastDoc).
   */
  const fetchLog = useCallback(async ({ pageSize = 30, afterDoc = null, actionFilter = null } = {}) => {
    try {
      const clauses = [];
      if (actionFilter) clauses.push(where('action', '==', actionFilter));
      clauses.push(orderBy('createdAt', 'desc'));
      if (afterDoc) clauses.push(startAfter(afterDoc));
      clauses.push(limit(pageSize));

      const snap = await getDocs(query(collection(db, 'auditLog'), ...clauses));
      return {
        entries: snap.docs.map((d) => ({ id: d.id, ...d.data() })),
        lastDoc: snap.docs[snap.docs.length - 1] ?? null,
      };
    } catch (e) {
      console.error('[audit] Failed to read log:', e.message);
      return { entries: [], lastDoc: null };
    }
  }, []);

  return { logAction, fetchLog };
}
