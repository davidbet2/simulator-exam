import { useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, ChevronDown, Layers, Lock } from 'lucide-react';

/**
 * DomainPath — compact mastery grid for exam-set domains.
 *
 * - Responsive grid (1/2/3 cols).
 * - Collapsible when > INITIAL_VISIBLE (prevents long scroll).
 * - Smart order: in-progress first → unstarted → mastered last.
 */
const INITIAL_VISIBLE = 6;

export default function DomainPath({ domains, onSelect, locked = false }) {
  const [expanded, setExpanded] = useState(false);

  const sorted = useMemo(() => {
    if (!domains?.length) return [];
    return [...domains].sort((a, b) => {
      const rank = (d) => {
        if (d.percent >= 80) return 2;        // mastered → last
        if (d.seen > 0) return 0;              // in-progress → first
        return 1;                              // unstarted → middle
      };
      const ra = rank(a); const rb = rank(b);
      if (ra !== rb) return ra - rb;
      if (ra === 0) return b.percent - a.percent;
      return a.label.localeCompare(b.label);
    });
  }, [domains]);

  if (!sorted.length) return null;

  const overflow = sorted.length > INITIAL_VISIBLE;
  const visible = expanded || !overflow ? sorted : sorted.slice(0, INITIAL_VISIBLE);

  const masteredCount = sorted.filter((d) => d.percent >= 80).length;
  const inProgressCount = sorted.filter((d) => d.seen > 0 && d.percent < 80).length;
  const untouchedCount = sorted.length - masteredCount - inProgressCount;

  return (
    <div className="space-y-3">
      {/* Summary chips */}
      <div className="flex items-center gap-2 flex-wrap text-xs">
        <SummaryChip tone="emerald" label={`${masteredCount} dominado${masteredCount !== 1 ? 's' : ''}`} />
        <SummaryChip tone="brand" label={`${inProgressCount} en progreso`} />
        <SummaryChip tone="neutral" label={`${untouchedCount} sin empezar`} />
      </div>

      {/* Grid */}
      <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
        <AnimatePresence initial={false}>
          {visible.map((d, i) => (
            <DomainNode
              key={d.domain}
              domain={d}
              index={i}
              locked={locked}
              onSelect={() => onSelect?.(d.domain)}
            />
          ))}
        </AnimatePresence>
      </ul>

      {/* Expand toggle */}
      {overflow && (
        <div className="flex justify-center pt-1">
          <button
            type="button"
            onClick={() => setExpanded((v) => !v)}
            className="inline-flex items-center gap-1.5 text-xs font-medium text-brand-600 dark:text-brand-400 hover:text-brand-700 dark:hover:text-brand-300 px-3 py-1.5 rounded-full bg-brand-500/5 hover:bg-brand-500/10 border border-brand-500/20 transition-colors"
            aria-expanded={expanded}
          >
            {expanded ? 'Ver menos' : `Ver todos (${sorted.length})`}
            <ChevronDown size={14} className={`transition-transform ${expanded ? 'rotate-180' : ''}`} />
          </button>
        </div>
      )}
    </div>
  );
}

function SummaryChip({ tone, label }) {
  const toneMap = {
    emerald: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-300 border-emerald-500/25',
    brand: 'bg-brand-500/10 text-brand-600 dark:text-brand-300 border-brand-500/25',
    neutral: 'bg-surface-soft text-ink-soft border-surface-border',
  };
  return (
    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full border tabular-nums ${toneMap[tone]}`}>
      {label}
    </span>
  );
}

function DomainNode({ domain, index, locked, onSelect }) {
  const { label, total, seen, mastered, percent } = domain;
  const isMastered = percent >= 80;
  const isStarted = seen > 0;
  const tone = isMastered ? 'emerald' : isStarted ? 'brand' : 'neutral';

  const ringColor =
    tone === 'emerald' ? 'stroke-emerald-500'
      : tone === 'brand' ? 'stroke-brand-500'
        : 'stroke-ink-muted/60';

  const cardBg =
    tone === 'emerald' ? 'bg-emerald-500/5 border-emerald-500/25 hover:border-emerald-500/60'
      : tone === 'brand' ? 'bg-brand-500/5 border-brand-500/25 hover:border-brand-500/60'
        : 'bg-surface-soft border-surface-border hover:border-brand-500/40';

  const R = 16;
  const CIRC = 2 * Math.PI * R;
  const dash = (percent / 100) * CIRC;

  return (
    <motion.li
      layout
      initial={{ opacity: 0, y: 4 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -4 }}
      transition={{ delay: Math.min(index, 6) * 0.025, duration: 0.2 }}
    >
      <button
        type="button"
        onClick={onSelect}
        className={`w-full group flex items-center gap-2.5 px-3 py-2.5 rounded-lg border transition-all text-left
          ${cardBg}
          hover:shadow-sm hover:-translate-y-[1px]
          focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500/40`}
        aria-label={`Practicar ${label}: ${mastered} de ${total} dominadas, ${percent}%`}
      >
        <div className="relative shrink-0" style={{ width: 40, height: 40 }}>
          <svg width="40" height="40" viewBox="0 0 40 40" className="-rotate-90">
            <circle cx="20" cy="20" r={R} className="stroke-surface-border/60 fill-transparent" strokeWidth="3" />
            <circle
              cx="20" cy="20" r={R}
              className={`${ringColor} fill-transparent transition-[stroke-dashoffset] duration-500`}
              strokeWidth="3"
              strokeLinecap="round"
              strokeDasharray={CIRC}
              strokeDashoffset={CIRC - dash}
            />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            {locked ? (
              <Lock size={13} className="text-ink-muted" />
            ) : isMastered ? (
              <CheckCircle2 size={15} className="text-emerald-500" />
            ) : (
              <Layers size={13} className={isStarted ? 'text-brand-600 dark:text-brand-400' : 'text-ink-muted'} />
            )}
          </div>
        </div>

        <div className="flex-1 min-w-0">
          <div className="text-sm font-semibold text-ink truncate leading-tight">{label}</div>
          <div className="mt-0.5 flex items-center gap-1.5 text-[11px] text-ink-soft tabular-nums">
            <span>{mastered}/{total}</span>
            <span className="text-ink-muted">·</span>
            <span className={isMastered ? 'text-emerald-600 dark:text-emerald-400 font-medium' : ''}>
              {percent}%
            </span>
          </div>
        </div>

        <span className="shrink-0 text-ink-muted group-hover:text-brand-600 dark:group-hover:text-brand-400 opacity-0 group-hover:opacity-100 transition-all translate-x-[-4px] group-hover:translate-x-0">
          →
        </span>
      </button>
    </motion.li>
  );
}
