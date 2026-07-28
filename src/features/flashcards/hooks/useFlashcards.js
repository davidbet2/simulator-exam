import { useState, useEffect, useCallback } from 'react';
import { collection, doc, getDoc, getDocs } from 'firebase/firestore';
import { db } from '../../../core/firebase/firebase';
import { DEMO_QUESTIONS } from '../../../core/constants/demoQuestions';

const DEMO_SLUG = 'demo';

function shuffleArray(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

/**
 * Loads all questions of an exam set (any type — multiple/matching/ordering) as a
 * flashcard deck. Fully session-local: no Firestore writes, no Leitner/SRS integration.
 * Supports free navigation (previous/next/jump) plus a per-card known/unknown record
 * keyed by card id, so revisiting a card shows its last mark.
 */
export function useFlashcards(slug) {
  const [set, setSet] = useState(null);
  const [cards, setCards] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [statuses, setStatuses] = useState({}); // { [cardId]: 'known' | 'unknown' }
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadDeck = useCallback(async () => {
    if (!slug) return;
    setIsLoading(true);
    setError(null);

    // Public, no-login demo — same hardcoded questions as the /exam demo, no Firestore.
    if (slug === DEMO_SLUG) {
      setSet({ id: DEMO_SLUG, title: 'Demo' });
      setCards(DEMO_QUESTIONS);
      setCurrentIndex(0);
      setIsFlipped(false);
      setStatuses({});
      setIsLoading(false);
      return;
    }

    try {
      const setSnap = await getDoc(doc(db, 'examSets', slug));
      if (!setSnap.exists()) {
        setError('Este set no existe.');
        setIsLoading(false);
        return;
      }
      const questionsSnap = await getDocs(collection(db, 'examSets', slug, 'questions'));
      const all = questionsSnap.docs.map((d) => ({ id: d.id, ...d.data() }));
      if (all.length === 0) {
        setError('Este set no tiene preguntas todavía.');
        setIsLoading(false);
        return;
      }
      setSet({ id: setSnap.id, ...setSnap.data() });
      setCards(all);
      setCurrentIndex(0);
      setIsFlipped(false);
      setStatuses({});
      setIsLoading(false);
    } catch (e) {
      setError(e.message);
      setIsLoading(false);
    }
  }, [slug]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    loadDeck();
  }, [loadDeck]);

  const flip = useCallback(() => setIsFlipped((f) => !f), []);

  const next = useCallback(() => {
    setCurrentIndex((i) => i + 1);
    setIsFlipped(false);
  }, []);

  const previous = useCallback(() => {
    setCurrentIndex((i) => Math.max(0, i - 1));
    setIsFlipped(false);
  }, []);

  const goToIndex = useCallback((i) => {
    setCurrentIndex((prev) => {
      if (cards.length === 0) return prev;
      return Math.max(0, Math.min(i, cards.length - 1));
    });
    setIsFlipped(false);
  }, [cards.length]);

  const isFinished = !isLoading && !error && cards.length > 0 && currentIndex >= cards.length;
  const current = isFinished ? null : (cards[currentIndex] ?? null);
  const currentStatus = current ? statuses[current.id] : undefined;

  const markKnown = useCallback(() => {
    if (!current) return;
    setStatuses((prev) => ({ ...prev, [current.id]: 'known' }));
    next();
  }, [current, next]);

  const markUnknown = useCallback(() => {
    if (!current) return;
    setStatuses((prev) => ({ ...prev, [current.id]: 'unknown' }));
    next();
  }, [current, next]);

  const shuffle = useCallback(() => {
    setCards((prev) => shuffleArray(prev));
    setCurrentIndex(0);
    setIsFlipped(false);
    setStatuses({});
  }, []);

  const restart = useCallback(() => {
    setCurrentIndex(0);
    setIsFlipped(false);
    setStatuses({});
  }, []);

  const statusValues = Object.values(statuses);
  const knownCount = statusValues.filter((s) => s === 'known').length;
  const unknownCount = statusValues.filter((s) => s === 'unknown').length;

  return {
    set,
    cards,
    total: cards.length,
    currentIndex,
    current,
    isFlipped,
    statuses,
    currentStatus,
    flip,
    next,
    previous,
    goToIndex,
    shuffle,
    restart,
    markKnown,
    markUnknown,
    knownCount,
    unknownCount,
    isFinished,
    isLoading,
    error,
  };
}
