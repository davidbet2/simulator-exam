import { useState, useEffect, useCallback, useRef } from 'react';
import { collection, query, where, getDocs, doc, getDoc } from 'firebase/firestore';
import { db } from '../../../core/firebase/firebase';

function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function sessionKey(certId, mode) {
  // v2 suffix for study mode invalidates old sessions that had shuffled options
  if (mode === 'study') return `study_v2_session_${certId}`;
  return `${mode}_session_${certId}`;
}

/** Shuffles option values while keeping keys sorted A→B→C→D. Remaps answer keys.
 *  Also handles matching (shuffles match pool display order) and ordering (shuffles left pool).
 *  When shouldShuffle is false (study mode) options are kept in their original order. */
function buildDisplayQuestion(q, shouldShuffle = true) {
  if (!shouldShuffle) return { ...q };
  if (q.type === 'matching') {
    // Shuffle the display order of match options in the dropdown pool
    const shuffledEntries = shuffle(Object.entries(q.matches));
    return { ...q, matches: Object.fromEntries(shuffledEntries) };
  }
  if (q.type === 'ordering') {
    // Shuffle items so the left pool always starts in random order
    return { ...q, items: shuffle([...q.items]) };
  }
  // Multiple choice: shuffle values, remap answer keys
  const sortedKeys = Object.keys(q.options).sort();
  const shuffledValues = shuffle(sortedKeys.map((k) => q.options[k]));
  const newOptions = {};
  sortedKeys.forEach((key, i) => { newOptions[key] = shuffledValues[i]; });
  const newAnswer = q.answer.map((origKey) => {
    const origValue = q.options[origKey];
    return sortedKeys.find((k) => newOptions[k] === origValue);
  });
  return { ...q, options: newOptions, answer: newAnswer };
}

function computeScore(displayQuestions, answers) {
  return displayQuestions.reduce((acc, dq, idx) => {
    const sel = answers[idx] ?? [];
    if (!sel || sel.length === 0) return acc;

    if (dq.type === 'matching') {
      // sel[i] = selected matchKey for pairs[i]; '' means not selected
      const ok = dq.pairs.every((p, i) => sel[i] === p.correctMatch);
      return acc + (ok ? 1 : 0);
    }
    if (dq.type === 'ordering') {
      // sel is the ordered array of items placed on the right
      const ok = sel.length === dq.correctOrder.length &&
        sel.every((v, i) => v === dq.correctOrder[i]);
      return acc + (ok ? 1 : 0);
    }
    // Multiple choice
    const correct = [...dq.answer].sort();
    const sortedSel = [...sel].sort();
    const ok = sortedSel.length === correct.length && sortedSel.every((v, i) => v === correct[i]);
    return acc + (ok ? 1 : 0);
  }, 0);
}

export function useExam(certification, mode = 'exam') {
  const [displayQuestions, setDisplayQuestions] = useState([]);
  const [current, setCurrent] = useState(0);
  const [answers, setAnswers] = useState({});   // { [idx]: string[] }
  const [flags, setFlags] = useState([]);        // boolean[]
  const [revealed, setRevealed] = useState([]);  // study mode: confirmed answers
  const [timeLeft, setTimeLeft] = useState(0);
  const [status, setStatus] = useState('loading');
  const [error, setError] = useState(null);
  const [isTimeOut, setIsTimeOut] = useState(false);
  const [passPercent, setPassPercent] = useState(certification?.passPercent ?? 60);
  const timerRef = useRef(null);

  const clearSession = useCallback(() => {
    if (!certification) return;
    sessionStorage.removeItem(sessionKey(certification.id, mode));
  }, [certification, mode]);

  useEffect(() => {
    if (status === 'finished') clearSession();
  }, [status, clearSession]);

  const loadQuestions = useCallback(async () => {
    if (!certification) return;

    const settingsSnap = await getDoc(doc(db, 'settings', certification.id)).catch(() => null);
    const settings = settingsSnap?.exists() ? settingsSnap.data() : {};
    const effectiveQuestionCount = settings.questionCount ?? certification.questionCount;
    const effectiveTimeMinutes = settings.timeMinutes ?? certification.timeMinutes;
    const effectivePassPercent = settings.passPercent ?? certification.passPercent;
    setPassPercent(effectivePassPercent);

    // Try to restore session
    const savedRaw = sessionStorage.getItem(sessionKey(certification.id, mode));
    if (savedRaw) {
      try {
        const saved = JSON.parse(savedRaw);
        let canRestore = false;
        let remaining = 0;
        if (mode === 'study' && saved.displayQuestions?.length > 0) {
          canRestore = true;
        } else if (mode === 'exam') {
          const elapsed = Math.floor((Date.now() - saved.startTimestamp) / 1000);
          remaining = saved.totalSeconds - elapsed;
          canRestore = remaining > 5 && saved.displayQuestions?.length > 0;
        }
        if (canRestore) {
          setDisplayQuestions(saved.displayQuestions);
          setAnswers(saved.answers ?? {});
          setFlags(saved.flags ?? new Array(saved.displayQuestions.length).fill(false));
          setRevealed(saved.revealed ?? new Array(saved.displayQuestions.length).fill(false));
          setCurrent(saved.current ?? 0);
          if (mode === 'exam') setTimeLeft(remaining);
          setStatus('running');
          return;
        }
      } catch { /* start fresh */ }
      sessionStorage.removeItem(sessionKey(certification.id, mode));
    }

    // Fresh start
    setStatus('loading');
    try {
      const q = query(
        collection(db, 'questions'),
        where('category', '==', certification.category),
        where('level', '==', certification.level)
      );
      const snapshot = await getDocs(q);
      const all = snapshot.docs.map((d) => ({ id: d.id, ...d.data() }));
      if (all.length === 0) {
        setError('No hay preguntas disponibles para esta certificación aún.');
        setStatus('finished');
        return;
      }
      const selected = mode === 'study' ? all : shuffle(all).slice(0, effectiveQuestionCount);
      const dqs = selected.map((q) => buildDisplayQuestion(q, mode === 'exam'));
      const totalSecs = effectiveTimeMinutes * 60;
      const startTs = Date.now();
      const initialFlags = new Array(selected.length).fill(false);
      const initialRevealed = new Array(selected.length).fill(false);
      setDisplayQuestions(dqs);
      setFlags(initialFlags);
      setRevealed(initialRevealed);
      setAnswers({});
      setCurrent(0);
      setTimeLeft(totalSecs);
      setStatus('running');
      sessionStorage.setItem(
        sessionKey(certification.id, mode),
        JSON.stringify({ displayQuestions: dqs, answers: {}, flags: initialFlags, revealed: initialRevealed, current: 0, startTimestamp: startTs, totalSeconds: totalSecs })
      );
    } catch (e) {
      setError(e.message);
      setStatus('finished');
    }
  }, [certification, mode]);

  useEffect(() => {
    loadQuestions();
    return () => clearInterval(timerRef.current);
  }, [loadQuestions]);

  useEffect(() => {
    if (status !== 'running' || mode === 'study') return;
    timerRef.current = setInterval(() => {
      setTimeLeft((t) => {
        if (t <= 1) {
          clearInterval(timerRef.current);
          setIsTimeOut(true);
          setStatus('finished');
          return 0;
        }
        return t - 1;
      });
    }, 1000);
    return () => clearInterval(timerRef.current);
  }, [status, mode]);

  const navigateTo = useCallback((idx) => {
    setCurrent(idx);
    const savedRaw = sessionStorage.getItem(sessionKey(certification?.id, mode));
    if (savedRaw) {
      try {
        const saved = JSON.parse(savedRaw);
        sessionStorage.setItem(sessionKey(certification.id, mode), JSON.stringify({ ...saved, current: idx }));
      } catch { /* ignore */ }
    }
  }, [certification, mode]);

  const saveAnswer = useCallback((idx, keys) => {
    setAnswers((prev) => {
      const next = { ...prev, [idx]: keys };
      const savedRaw = sessionStorage.getItem(sessionKey(certification?.id, mode));
      if (savedRaw) {
        try {
          const saved = JSON.parse(savedRaw);
          sessionStorage.setItem(sessionKey(certification.id, mode), JSON.stringify({ ...saved, answers: next }));
        } catch { /* ignore */ }
      }
      return next;
    });
  }, [certification, mode]);

  const toggleFlag = useCallback((idx) => {
    setFlags((prev) => {
      const next = [...prev];
      next[idx] = !next[idx];
      const savedRaw = sessionStorage.getItem(sessionKey(certification?.id, mode));
      if (savedRaw) {
        try {
          const saved = JSON.parse(savedRaw);
          sessionStorage.setItem(sessionKey(certification.id, mode), JSON.stringify({ ...saved, flags: next }));
        } catch { /* ignore */ }
      }
      return next;
    });
  }, [certification, mode]);

  const confirmAnswer = useCallback((idx) => {
    setRevealed((prev) => {
      const next = [...prev];
      next[idx] = true;
      const savedRaw = sessionStorage.getItem(sessionKey(certification?.id, mode));
      if (savedRaw) {
        try {
          const saved = JSON.parse(savedRaw);
          sessionStorage.setItem(sessionKey(certification.id, mode), JSON.stringify({ ...saved, revealed: next }));
        } catch { /* ignore */ }
      }
      return next;
    });
  }, [certification, mode]);

  const submitExam = useCallback(() => {
    clearInterval(timerRef.current);
    setStatus('finished');
  }, []);

  const score = computeScore(displayQuestions, answers);

  return {
    displayQuestions,
    current,
    answers,
    flags,
    revealed,
    score,
    timeLeft,
    status,
    error,
    isTimeOut,
    passPercent,
    total: displayQuestions.length,
    navigateTo,
    saveAnswer,
    toggleFlag,
    confirmAnswer,
    submitExam,
  };
}
