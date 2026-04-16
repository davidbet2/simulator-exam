import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { collection, query, where, orderBy, limit, getDocs } from 'firebase/firestore'
import { Search, BookOpen, Users, Star, Plus } from 'lucide-react'
import { db } from '../../../core/firebase/firebase'
import { useAuthStore } from '../../../core/store/useAuthStore'
import { Card, CardBody } from '../../../components/ui/Card'
import { Badge } from '../../../components/ui/Badge'
import Button from '../../../components/ui/Button'

function ExamSetCard({ set }) {
  return (
    <Card className="hover:border-brand-500/50 transition-colors cursor-pointer">
      <CardBody className="p-5 space-y-3">
        <div className="flex items-start justify-between gap-2">
          <h3 className="font-semibold text-ink text-sm leading-snug flex-1">{set.title}</h3>
          {set.official && <Badge variant="brand">Oficial</Badge>}
        </div>
        {set.description && (
          <p className="text-xs text-ink-soft line-clamp-2">{set.description}</p>
        )}
        <div className="flex items-center gap-3 text-xs text-ink-soft">
          <span className="flex items-center gap-1"><BookOpen size={11} />{set.questionCount ?? '?'} preguntas</span>
          <span className="flex items-center gap-1"><Users size={11} />{set.attempts ?? 0}</span>
          {set.rating && <span className="flex items-center gap-1"><Star size={11} className="text-amber-400" />{set.rating}</span>}
        </div>
      </CardBody>
    </Card>
  )
}

export function ExploreExamsPage() {
  const { user } = useAuthStore()
  const navigate = useNavigate()
  const [sets, setSets] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')

  useEffect(() => {
    const q = query(
      collection(db, 'examSets'),
      where('published', '==', true),
      orderBy('attempts', 'desc'),
      limit(50)
    )
    getDocs(q).then((snap) => {
      setSets(snap.docs.map((d) => ({ id: d.id, ...d.data() })))
      setLoading(false)
    }).catch(() => setLoading(false))
  }, [])

  const filtered = sets.filter((s) =>
    s.title?.toLowerCase().includes(search.toLowerCase()) ||
    s.description?.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="min-h-screen bg-surface">
      <header className="border-b border-surface-border bg-surface-soft/60 backdrop-blur-md sticky top-0 z-10">
        <div className="max-w-5xl mx-auto px-4 h-16 flex items-center justify-between">
          <Link to="/" className="text-xl font-bold bg-gradient-to-r from-brand-400 to-brand-600 bg-clip-text text-transparent">
            CertZen
          </Link>
          <div className="flex items-center gap-3">
            {user
              ? <Link to="/dashboard" className="text-sm text-ink-soft hover:text-ink">Dashboard</Link>
              : <Link to="/login"><Button size="sm">Ingresar</Button></Link>
            }
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 py-8 space-y-6">
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}>
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div>
              <h1 className="text-2xl font-bold text-ink">Explorar sets de exámenes</h1>
              <p className="text-ink-soft text-sm mt-1">Creados por la comunidad y certificaciones oficiales</p>
            </div>
            {user && (
              <Button onClick={() => navigate('/create-exam')}>
                <Plus size={16} />
                Crear set
              </Button>
            )}
          </div>
        </motion.div>

        {/* Search */}
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
          <div className="relative">
            <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-ink-soft" />
            <input
              type="search"
              placeholder="Buscar por título o descripción…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="h-11 w-full rounded-xl border border-surface-border bg-surface-soft pl-10 pr-4 text-sm text-ink placeholder-slate-500 focus:outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20"
              aria-label="Buscar sets de examen"
            />
          </div>
        </motion.div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="h-32 rounded-2xl bg-surface-soft animate-pulse" />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-16 space-y-3">
            <BookOpen size={40} className="text-slate-600 mx-auto" />
            <p className="text-ink-soft">{search ? 'No se encontraron resultados.' : 'Aún no hay sets publicados.'}</p>
            {user && (
              <Button onClick={() => navigate('/create-exam')} variant="secondary" size="sm">
                <Plus size={14} />
                Crea el primero
              </Button>
            )}
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.15 }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
          >
            {filtered.map((set) => <ExamSetCard key={set.id} set={set} />)}
          </motion.div>
        )}
      </main>
    </div>
  )
}
