import { useState, useEffect, useCallback, useRef } from 'react';
import {
  collection, query, where, orderBy, limit, startAfter, getDocs,
} from 'firebase/firestore';
import { db } from '../../../core/firebase/firebase';

const BROWSE_PAGE_SIZE = 24;
const LOAD_MORE_SIZE   = 12;
/**
 * Max sets fetched server-side for client-side search filtering.
 * We load the 50 most recent published sets (within the selected domain)
 * and filter in-memory. This avoids a full-text search service while
 * keeping reads predictable at scale.
 *
 * At 10 k sets across multiple domains, a domain-scoped pool of 50 is
 * more than enough for a good match rate. Upgrade to Typesense/Algolia
 * when per-domain set counts consistently exceed 200–300.
 */
const SEARCH_POOL      = 50;
const SEARCH_DEBOUNCE  = 350; // ms

/**
 * Build a paginated Firestore query for published examSets.
 *
 * Indexes required (firestore.indexes.json):
 *   published ASC + createdAt DESC           (default browse)
 *   published ASC + domain ASC + createdAt DESC  (domain-filtered browse/search)
 */
function buildExploreQuery(domain, afterDoc, pageSize) {
  const clauses = [where('published', '==', true)];
  if (domain) clauses.push(where('domain', '==', domain));
  clauses.push(orderBy('createdAt', 'desc'));
  if (afterDoc) clauses.push(startAfter(afterDoc));
  clauses.push(limit(pageSize));
  return query(collection(db, 'examSets'), ...clauses);
}

/**
 * useExploreQuery — scalable exam-set loading hook for /explore.
 *
 * Browse mode  (searchTerm < 2 chars):
 *   Server-side cursor pagination ordered by createdAt DESC.
 *   24 sets initially, 12 more per "load more" click.
 *   Domain filter is applied server-side (one extra composite index).
 *
 * Search mode  (searchTerm >= 2 chars, debounced 350 ms):
 *   Fetches the top SEARCH_POOL sets server-side, then filters
 *   client-side by title / description / tags substring match.
 *   "Load more" is hidden in search mode (no cursor).
 *
 * Designed to scale to 10 k+ sets without loading all documents.
 */
export function useExploreQuery({ domain = '', searchTerm = '' }) {
  const [sets, setSets]               = useState([]);
  const [cursor, setCursor]           = useState(null);
  const [hasMore, setHasMore]         = useState(false);
  const [loading, setLoading]         = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const debounceRef = useRef(null);
  const isSearchMode = searchTerm.trim().length >= 2;

  // ── Browse mode: initial load or domain / mode change ────────────────────
  useEffect(() => {
    if (isSearchMode) return; // search effect handles this
    let cancelled = false;
    setLoading(true);
    setSets([]);
    setCursor(null);
    setHasMore(false);

    getDocs(buildExploreQuery(domain, null, BROWSE_PAGE_SIZE))
      .then((snap) => {
        if (cancelled) return;
        setSets(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
        setCursor(snap.docs[snap.docs.length - 1] ?? null);
        setHasMore(snap.docs.length === BROWSE_PAGE_SIZE);
        setLoading(false);
      })
      .catch((err) => {
        if (!cancelled) {
          console.error('[useExploreQuery] browse failed:', err);
          setLoading(false);
        }
      });

    return () => { cancelled = true; };
  }, [domain, isSearchMode]);

  // ── Search mode: debounced server fetch + client-side filter ─────────────
  useEffect(() => {
    if (!isSearchMode) {
      clearTimeout(debounceRef.current);
      return;
    }

    clearTimeout(debounceRef.current);
    setLoading(true);

    debounceRef.current = setTimeout(async () => {
      try {
        const snap = await getDocs(buildExploreQuery(domain, null, SEARCH_POOL));
        const needle = searchTerm.trim().toLowerCase();
        const matched = snap.docs
          .map((d) => ({ id: d.id, ...d.data() }))
          .filter((s) =>
            s.title?.toLowerCase().includes(needle) ||
            s.description?.toLowerCase().includes(needle) ||
            s.tags?.some?.((tag) => tag.toLowerCase().includes(needle)),
          );
        setSets(matched);
        setCursor(null);
        setHasMore(false);
        setLoading(false);
      } catch (err) {
        console.error('[useExploreQuery] search failed:', err);
        setLoading(false);
      }
    }, SEARCH_DEBOUNCE);

    return () => clearTimeout(debounceRef.current);
  }, [domain, searchTerm, isSearchMode]);

  // ── Load more: cursor-based, browse mode only ─────────────────────────────
  const loadMore = useCallback(async () => {
    if (!cursor || loadingMore || isSearchMode) return;
    setLoadingMore(true);
    try {
      const snap = await getDocs(buildExploreQuery(domain, cursor, LOAD_MORE_SIZE));
      setSets((prev) => [...prev, ...snap.docs.map((d) => ({ id: d.id, ...d.data() }))]);
      setCursor(snap.docs[snap.docs.length - 1] ?? null);
      setHasMore(snap.docs.length === LOAD_MORE_SIZE);
    } catch (err) {
      console.error('[useExploreQuery] loadMore failed:', err);
    } finally {
      setLoadingMore(false);
    }
  }, [cursor, domain, isSearchMode, loadingMore]);

  return {
    sets,
    loading,
    loadingMore,
    hasMore: hasMore && !isSearchMode,
    loadMore,
    isSearchMode,
  };
}
