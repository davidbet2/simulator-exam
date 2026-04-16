import {
  collection, doc, getDoc, getDocs, query, where, writeBatch,
  serverTimestamp, Timestamp,
} from 'firebase/firestore';
import { db } from '../../../core/firebase/firebase';

// Leitner-box intervals in milliseconds. Box 1 = due same day, Box 5 = mastered (~30 days).
const BOX_INTERVALS_MS = {
  1: 0,
  2: 1 * 24 * 60 * 60 * 1000,
  3: 3 * 24 * 60 * 60 * 1000,
  4: 7 * 24 * 60 * 60 * 1000,
  5: 30 * 24 * 60 * 60 * 1000,
};
export const LEITNER_MAX_BOX = 5;

// Firestore doc IDs cannot contain '/'. We combine setId + questionId with a safe separator.
export function statDocId(setId, questionId) {
  return `${setId}__${questionId}`;
}

/**
 * Compute next Leitner box + due date given previous stat and correctness.
 */
export function nextLeitnerState(prev, correct) {
  const prevBox = prev?.box ?? 1;
  const nextBox = correct ? Math.min(prevBox + 1, LEITNER_MAX_BOX) : 1;
  const dueAt = Timestamp.fromMillis(Date.now() + BOX_INTERVALS_MS[nextBox]);
  return { box: nextBox, dueAt };
}

/**
 * Record a single answer result. Merges with existing stats doc.
 * Safe to call multiple times; uses getDoc + setDoc (merge) to preserve counters.
 */
export async function recordAnswer({ uid, setId, questionId, correct }) {
  if (!uid || !setId || !questionId) return;
  const ref = doc(db, 'users', uid, 'questionStats', statDocId(setId, questionId));
  const snap = await getDoc(ref);
  const prev = snap.exists() ? snap.data() : null;
  const { box, dueAt } = nextLeitnerState(prev, correct);
  const batch = writeBatch(db);
  batch.set(ref, {
    setId,
    questionId,
    rightCount: (prev?.rightCount ?? 0) + (correct ? 1 : 0),
    wrongCount: (prev?.wrongCount ?? 0) + (correct ? 0 : 1),
    lastResult: correct ? 'right' : 'wrong',
    lastSeenAt: serverTimestamp(),
    box,
    dueAt,
  }, { merge: true });
  await batch.commit();
}

/**
 * Record many answer results at once (e.g. exam submit). Uses a single batched write.
 */
export async function recordAnswersBatch({ uid, setId, results }) {
  if (!uid || !setId || !results?.length) return;
  // Fetch existing stats in one roundtrip to compute correct increments.
  const prevByQid = new Map();
  const existingSnap = await getDocs(query(
    collection(db, 'users', uid, 'questionStats'),
    where('setId', '==', setId),
  ));
  existingSnap.forEach((d) => { prevByQid.set(d.data().questionId, d.data()); });

  const batch = writeBatch(db);
  for (const { questionId, correct } of results) {
    const prev = prevByQid.get(questionId) ?? null;
    const { box, dueAt } = nextLeitnerState(prev, correct);
    const ref = doc(db, 'users', uid, 'questionStats', statDocId(setId, questionId));
    batch.set(ref, {
      setId,
      questionId,
      rightCount: (prev?.rightCount ?? 0) + (correct ? 1 : 0),
      wrongCount: (prev?.wrongCount ?? 0) + (correct ? 0 : 1),
      lastResult: correct ? 'right' : 'wrong',
      lastSeenAt: serverTimestamp(),
      box,
      dueAt,
    }, { merge: true });
  }
  await batch.commit();
}

/**
 * Fetch question IDs for a set that match a given mode filter.
 * Returns a Set<string> of questionIds (or null if no filtering should apply).
 *
 * - 'weak': last answer was wrong (or never answered correctly).
 * - 'srs':  Leitner dueAt <= now.
 */
export async function fetchQuestionIdsForMode({ uid, setId, mode }) {
  if (!uid || !setId) return null;
  if (mode !== 'weak' && mode !== 'srs') return null;
  const snap = await getDocs(query(
    collection(db, 'users', uid, 'questionStats'),
    where('setId', '==', setId),
  ));
  const now = Date.now();
  const ids = new Set();
  snap.forEach((d) => {
    const s = d.data();
    if (mode === 'weak' && s.lastResult === 'wrong') ids.add(s.questionId);
    else if (mode === 'srs' && s.dueAt && s.dueAt.toMillis() <= now) ids.add(s.questionId);
  });
  return ids;
}

/**
 * Summary counts used by the landing page to show per-mode badges
 * (e.g. "12 preguntas por repasar").
 */
export async function fetchStatsSummary({ uid, setId }) {
  if (!uid || !setId) return { weak: 0, due: 0, mastered: 0, seen: 0 };
  const snap = await getDocs(query(
    collection(db, 'users', uid, 'questionStats'),
    where('setId', '==', setId),
  ));
  const now = Date.now();
  let weak = 0, due = 0, mastered = 0;
  snap.forEach((d) => {
    const s = d.data();
    if (s.lastResult === 'wrong') weak += 1;
    if (s.dueAt && s.dueAt.toMillis() <= now) due += 1;
    if ((s.box ?? 1) >= LEITNER_MAX_BOX) mastered += 1;
  });
  return { weak, due, mastered, seen: snap.size };
}

/**
 * Compute per-domain mastery for a set by joining user question stats with each
 * question's `domain` field. Mastery = % of domain questions with Leitner box >= 4.
 *
 * Returns an array of { domain, label, total, mastered, seen, percent } sorted by domain label.
 */
export async function fetchDomainMastery({ uid, setId, questions }) {
  if (!setId || !Array.isArray(questions) || questions.length === 0) return [];
  // Group all questions by their domain field (fallback 'Otros').
  const byDomain = new Map();
  for (const q of questions) {
    const d = (q.domain || q.category || 'Otros').trim() || 'Otros';
    if (!byDomain.has(d)) byDomain.set(d, []);
    byDomain.get(d).push(q.id);
  }
  // Load user stats (best effort — anon users get zeroed mastery).
  let statsByQid = new Map();
  if (uid) {
    try {
      const snap = await getDocs(query(
        collection(db, 'users', uid, 'questionStats'),
        where('setId', '==', setId),
      ));
      snap.forEach((d) => {
        const s = d.data();
        statsByQid.set(s.questionId, s);
      });
    } catch { /* fall through with empty map */ }
  }
  const rows = [];
  for (const [domain, qids] of byDomain.entries()) {
    let mastered = 0;
    let seen = 0;
    for (const qid of qids) {
      const s = statsByQid.get(qid);
      if (s) {
        seen += 1;
        if ((s.box ?? 1) >= 4) mastered += 1;
      }
    }
    const total = qids.length;
    rows.push({
      domain,
      label: domain,
      total,
      seen,
      mastered,
      percent: total > 0 ? Math.round((mastered / total) * 100) : 0,
    });
  }
  rows.sort((a, b) => a.label.localeCompare(b.label));
  return rows;
}
