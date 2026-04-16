import { useState, useEffect, useCallback } from 'react'
import {
  collection, query, where, getCountFromServer,
  Timestamp
} from 'firebase/firestore'
import { useAuthStore } from '../../../core/store/useAuthStore'
import { db } from '../../../core/firebase/firebase'

const FREE_LIMIT = 3 // exams per calendar month

/**
 * Returns { canTakeExam, usedThisMonth, remaining, isPro, isLoading }
 * Counts attempts in the current calendar month (UTC).
 */
export function useUserPlan() {
  const { user, isPro } = useAuthStore()
  const [usedThisMonth, setUsedThisMonth] = useState(0)
  const [isLoading, setIsLoading]         = useState(true)

  const refresh = useCallback(async () => {
    if (!user) { setIsLoading(false); return }
    if (isPro)  { setIsLoading(false); return }

    const now   = new Date()
    const start = new Date(now.getFullYear(), now.getMonth(), 1, 0, 0, 0, 0)

    const q = query(
      collection(db, 'attempts'),
      where('uid',       '==', user.uid),
      where('createdAt', '>=', Timestamp.fromDate(start))
    )
    const snap = await getCountFromServer(q)
    setUsedThisMonth(snap.data().count)
    setIsLoading(false)
  }, [user, isPro])

  // eslint-disable-next-line react-hooks/set-state-in-effect
  useEffect(() => { refresh() }, [refresh])

  const remaining    = isPro ? Infinity : Math.max(0, FREE_LIMIT - usedThisMonth)
  const canTakeExam  = isPro || remaining > 0

  return { canTakeExam, usedThisMonth, remaining, isPro, isLoading, refresh }
}
