import { useState, useEffect, useCallback, useRef } from 'react';
import { collection, query, where, getDocs, doc, getDoc } from 'firebase/firestore';
import { db } from '../../../core/firebase/firebase';
import { useAuthStore } from '../../../core/store/useAuthStore';
import { recordAnswer, recordAnswersBatch, fetchQuestionIdsForMode } from '../utils/questionStats';
import { analytics } from '../../../core/analytics/events';

// Modes that behave like study (reveal feedback, no timer): 'study', 'weak', 'srs', 'wager'.
const isStudyLikeMode = (m) => m === 'study' || m === 'weak' || m === 'srs' || m === 'wager';

// ─── Demo questions (general software dev knowledge, not domain-specific) ───
const DEMO_QUESTIONS = [
  {
    id: 'demo-q1',
    type: 'multiple',
    question: '¿Cuál de los siguientes es un principio fundamental del Manifiesto Ágil?',
    options: {
      A: 'Documentación exhaustiva sobre software funcionando',
      B: 'Individuos e interacciones sobre procesos y herramientas',
      C: 'Seguir el plan por encima de responder al cambio',
      D: 'Negociación de contratos sobre colaboración con el cliente',
    },
    answer: ['B'],
    domain: 'Metodologías Ágiles',
    difficulty: 'medium',
  },
  {
    id: 'demo-q2',
    type: 'multiple',
    question: '¿Qué patrón de diseño garantiza que una clase tenga una única instancia en toda la aplicación?',
    options: {
      A: 'Factory',
      B: 'Observer',
      C: 'Singleton',
      D: 'Strategy',
    },
    answer: ['C'],
    domain: 'Patrones de Diseño',
    difficulty: 'easy',
  },
  {
    id: 'demo-q3',
    type: 'multiple',
    question: 'En una API REST, ¿qué código HTTP indica que un recurso fue creado exitosamente?',
    options: {
      A: '200 OK',
      B: '201 Created',
      C: '204 No Content',
      D: '301 Moved Permanently',
    },
    answer: ['B'],
    domain: 'APIs y Servicios Web',
    difficulty: 'easy',
  },
  {
    id: 'demo-q4',
    type: 'multiple',
    question: '¿Cuál de las siguientes afirmaciones sobre Git es correcta?',
    options: {
      A: 'git rebase siempre crea commits de fusión (merge commits)',
      B: 'git fetch descarga cambios del remoto y los fusiona automáticamente',
      C: 'git pull combina git fetch y git merge en un solo comando',
      D: 'git stash elimina permanentemente los cambios no confirmados',
    },
    answer: ['C'],
    domain: 'Control de Versiones',
    difficulty: 'medium',
  },
  {
    id: 'demo-q5',
    type: 'multiple',
    question: '¿Cuál es la complejidad temporal de buscar un elemento en un árbol binario de búsqueda balanceado?',
    options: {
      A: 'O(1)',
      B: 'O(log n)',
      C: 'O(n)',
      D: 'O(n log n)',
    },
    answer: ['B'],
    domain: 'Estructuras de Datos',
    difficulty: 'medium',
  },
];

function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function sessionKey(certId, mode, domainFilter) {
  // v2 suffix for study mode invalidates old sessions that had shuffled options
  const suffix = domainFilter ? `_dom_${String(domainFilter).replace(/\W/g, '')}` : '';
  if (isStudyLikeMode(mode)) return `study_v2_session_${certId}_${mode}${suffix}`;
  return `${mode}_session_${certId}${suffix}`;
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

function isAnswerCorrect(dq, sel) {
  if (!sel || sel.length === 0) return false;
  if (dq.type === 'matching') {
    return dq.pairs.every((p, i) => sel[i] === p.correctMatch);
  }
  if (dq.type === 'ordering') {
    return sel.length === dq.correctOrder.length
      && sel.every((v, i) => v === dq.correctOrder[i]);
  }
  const correct = [...dq.answer].sort();
  const sortedSel = [...sel].sort();
  return sortedSel.length === correct.length && sortedSel.every((v, i) => v === correct[i]);
}

function computeScore(displayQuestions, answers) {
  return displayQuestions.reduce((acc, dq, idx) => {
    const sel = answers[idx] ?? [];
    return acc + (isAnswerCorrect(dq, sel) ? 1 : 0);
  }, 0);
}

export function useExam(certification, mode = 'exam', countOverride = null, domainFilter = null) {
  const { user } = useAuthStore();
  const [displayQuestions, setDisplayQuestions] = useState([]);
  const [current, setCurrent] = useState(0);
  const [answers, setAnswers] = useState({});   // { [idx]: string[] }
  const [flags, setFlags] = useState([]);        // boolean[]
  const [revealed, setRevealed] = useState([]);  // study mode: confirmed answers
  const [confidence, setConfidence] = useState({}); // wager mode: { [idx]: 1 | 2 | 3 }
  const [timeLeft, setTimeLeft] = useState(0);
  const [status, setStatus] = useState('loading');
  const [error, setError] = useState(null);
  const [isTimeOut, setIsTimeOut] = useState(false);
  const [passPercent, setPassPercent] = useState(certification?.passPercent ?? 60);
  const timerRef = useRef(null);

  const clearSession = useCallback(() => {
    if (!certification) return;
    sessionStorage.removeItem(sessionKey(certification.id, mode, domainFilter));
  }, [certification, mode, domainFilter]);

  useEffect(() => {
    if (status === 'finished') clearSession();
  }, [status, clearSession]);

  const loadQuestions = useCallback(async () => {
    if (!certification) return;

    // Demo mode — use hardcoded questions, skip Firestore entirely
    if (certification.isDemo) {
      const dqs = DEMO_QUESTIONS.map((q) => buildDisplayQuestion(q, mode === 'exam'));
      const totalSecs = certification.timeMinutes * 60;
      const initialFlags = new Array(dqs.length).fill(false);
      const initialRevealed = new Array(dqs.length).fill(false);
      setPassPercent(certification.passPercent ?? 60);
      setDisplayQuestions(dqs);
      setFlags(initialFlags);
      setRevealed(initialRevealed);
      setAnswers({});
      setConfidence({});
      setCurrent(0);
      setTimeLeft(totalSecs);
      setStatus('running');
      return;
    }

    const settingsSnap = await getDoc(doc(db, 'settings', certification.id)).catch(() => null);
    const settings = settingsSnap?.exists() ? settingsSnap.data() : {};
    const effectiveQuestionCount = settings.questionCount ?? certification.questionCount;
    const effectiveTimeMinutes = settings.timeMinutes ?? certification.timeMinutes;
    const effectivePassPercent = settings.passPercent ?? certification.passPercent;
    setPassPercent(effectivePassPercent);

    // Try to restore session
    const savedRaw = sessionStorage.getItem(sessionKey(certification.id, mode, domainFilter));
    if (savedRaw) {
      try {
        const saved = JSON.parse(savedRaw);
        let canRestore = false;
        let remaining = 0;
        if (isStudyLikeMode(mode) && saved.displayQuestions?.length > 0) {
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
          setConfidence(saved.confidence ?? {});
          setCurrent(saved.current ?? 0);
          if (mode === 'exam') setTimeLeft(remaining);
          setStatus('running');
          return;
        }
      } catch { /* start fresh */ }
      sessionStorage.removeItem(sessionKey(certification.id, mode, domainFilter));
    }

    // Fresh start
    setStatus('loading');
    try {
      // ExamSets path: fetch from examSets/{id}/questions (community + official sets)
      let all;
      if (certification.isExamSet && certification.setId) {
        const snapshot = await getDocs(collection(db, 'examSets', certification.setId, 'questions'));
        all = snapshot.docs.map((d) => ({ id: d.id, ...d.data() }));
      } else {
        const q = query(
          collection(db, 'questions'),
          where('category', '==', certification.category),
          where('level', '==', certification.level)
        );
        const snapshot = await getDocs(q);
        all = snapshot.docs.map((d) => ({ id: d.id, ...d.data() }));
      }
      if (all.length === 0) {
        setError('No hay preguntas disponibles para esta certificación aún.');
        setStatus('finished');
        return;
      }

      // Weak / SRS modes: filter to only questions matching the user's stats.
      if ((mode === 'weak' || mode === 'srs') && user?.uid && certification.setId) {
        const ids = await fetchQuestionIdsForMode({ uid: user.uid, setId: certification.setId, mode });
        if (!ids || ids.size === 0) {
          setError(mode === 'weak'
            ? 'No tienes preguntas falladas en este set todavía. Responde algunas en Estudio Guiado o Modo Examen primero.'
            : 'No tienes preguntas pendientes de repasar. ¡Todo al día!');
          setStatus('finished');
          return;
        }
        all = all.filter((q) => ids.has(q.id));
        if (all.length === 0) {
          setError('Las preguntas marcadas ya no existen en el set.');
          setStatus('finished');
          return;
        }
      }

      // Domain filter (used by Ruta de Dominio — study a single Appian domain).
      if (domainFilter) {
        const target = String(domainFilter).trim().toLowerCase();
        all = all.filter((q) => {
          const d = (q.domain || q.category || '').trim().toLowerCase();
          return d === target;
        });
        if (all.length === 0) {
          setError(`No hay preguntas en el dominio "${domainFilter}" para este set.`);
          setStatus('finished');
          return;
        }
      }

      // Study-like modes normally use all filtered questions; if an explicit countOverride is provided
      // (e.g. Quick Practice), shuffle and take that many questions.
      // Wager mode is study-like for reveal/recording but uses a bounded set (like exam) so the
      // calibration score is meaningful.
      const limited = countOverride && countOverride > 0 && countOverride < all.length;
      const isBoundedSession = mode === 'exam' || mode === 'wager' || limited;
      const selected = isBoundedSession
        ? shuffle(all).slice(0, limited ? countOverride : effectiveQuestionCount)
        : all;
      const dqs = selected.map((q) => buildDisplayQuestion(q, mode === 'exam'));
      const totalSecs = effectiveTimeMinutes * 60;
      const startTs = Date.now();
      const initialFlags = new Array(selected.length).fill(false);
      const initialRevealed = new Array(selected.length).fill(false);
      setDisplayQuestions(dqs);
      setFlags(initialFlags);
      setRevealed(initialRevealed);
      setAnswers({});
      setConfidence({});
      setCurrent(0);
      setTimeLeft(totalSecs);
      setStatus('running');
      analytics.examStart({
        certId:        certification.id,
        mode,
        questionCount: dqs.length,
      });
      sessionStorage.setItem(
        sessionKey(certification.id, mode, domainFilter),
        JSON.stringify({ displayQuestions: dqs, answers: {}, flags: initialFlags, revealed: initialRevealed, confidence: {}, current: 0, startTimestamp: startTs, totalSeconds: totalSecs })
      );
    } catch (e) {
      setError(e.message);
      setStatus('finished');
    }
  }, [certification, mode, countOverride, domainFilter, user]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    loadQuestions();
    return () => clearInterval(timerRef.current);
  }, [loadQuestions]);

  useEffect(() => {
    if (status !== 'running' || isStudyLikeMode(mode)) return;
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
    const savedRaw = sessionStorage.getItem(sessionKey(certification?.id, mode, domainFilter));
    if (savedRaw) {
      try {
        const saved = JSON.parse(savedRaw);
        sessionStorage.setItem(sessionKey(certification.id, mode, domainFilter), JSON.stringify({ ...saved, current: idx }));
      } catch { /* ignore */ }
    }
  }, [certification, mode, domainFilter]);

  const saveAnswer = useCallback((idx, keys) => {
    setAnswers((prev) => {
      const next = { ...prev, [idx]: keys };
      const savedRaw = sessionStorage.getItem(sessionKey(certification?.id, mode, domainFilter));
      if (savedRaw) {
        try {
          const saved = JSON.parse(savedRaw);
          sessionStorage.setItem(sessionKey(certification.id, mode, domainFilter), JSON.stringify({ ...saved, answers: next }));
        } catch { /* ignore */ }
      }
      return next;
    });
  }, [certification, mode, domainFilter]);

  const toggleFlag = useCallback((idx) => {
    setFlags((prev) => {
      const next = [...prev];
      next[idx] = !next[idx];
      const savedRaw = sessionStorage.getItem(sessionKey(certification?.id, mode, domainFilter));
      if (savedRaw) {
        try {
          const saved = JSON.parse(savedRaw);
          sessionStorage.setItem(sessionKey(certification.id, mode, domainFilter), JSON.stringify({ ...saved, flags: next }));
        } catch { /* ignore */ }
      }
      return next;
    });
  }, [certification, mode, domainFilter]);

  // Wager mode: set confidence multiplier (1, 2, or 3) for a given question.
  const setConfidenceFor = useCallback((idx, level) => {
    setConfidence((prev) => {
      const next = { ...prev, [idx]: level };
      const savedRaw = sessionStorage.getItem(sessionKey(certification?.id, mode, domainFilter));
      if (savedRaw) {
        try {
          const saved = JSON.parse(savedRaw);
          sessionStorage.setItem(sessionKey(certification.id, mode, domainFilter), JSON.stringify({ ...saved, confidence: next }));
        } catch { /* ignore */ }
      }
      return next;
    });
  }, [certification, mode, domainFilter]);

  const confirmAnswer = useCallback((idx) => {
    setRevealed((prev) => {
      const next = [...prev];
      next[idx] = true;
      const savedRaw = sessionStorage.getItem(sessionKey(certification?.id, mode, domainFilter));
      if (savedRaw) {
        try {
          const saved = JSON.parse(savedRaw);
          sessionStorage.setItem(sessionKey(certification.id, mode, domainFilter), JSON.stringify({ ...saved, revealed: next }));
        } catch { /* ignore */ }
      }
      return next;
    });
    // Record stats for study-like modes (study, weak, srs) — only for real examSets.
    if (isStudyLikeMode(mode) && user?.uid && certification?.setId) {
      const dq = displayQuestions[idx];
      const sel = answers[idx] ?? [];
      if (dq?.id) {
        recordAnswer({
          uid: user.uid,
          setId: certification.setId,
          questionId: dq.id,
          correct: isAnswerCorrect(dq, sel),
        }).catch(() => { /* best-effort, don't block UX */ });
      }
    }
  }, [certification, mode, domainFilter, user, displayQuestions, answers]);

  const submitExam = useCallback(() => {
    clearInterval(timerRef.current);
    setStatus('finished');
    // Batch-record stats for exam mode (study-like modes already recorded per confirm).
    if (mode === 'exam' && user?.uid && certification?.setId && displayQuestions.length > 0) {
      const results = displayQuestions.map((dq, idx) => ({
        questionId: dq.id,
        correct: isAnswerCorrect(dq, answers[idx] ?? []),
      })).filter((r) => r.questionId);
      if (results.length > 0) {
        recordAnswersBatch({ uid: user.uid, setId: certification.setId, results })
          .catch(() => { /* best-effort */ });
      }
    }
  }, [mode, user, certification, displayQuestions, answers]);

  const score = computeScore(displayQuestions, answers);

  return {
    displayQuestions,
    current,
    answers,
    flags,
    revealed,
    confidence,
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
    setConfidenceFor,
    confirmAnswer,
    submitExam,
  };
}
