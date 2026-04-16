import { motion } from 'framer-motion';
import { CheckCircle2, Layers, Lock } from 'lucide-react';

/**
 * DomainPath — vertical progression map of domains within an exam set.
 * Each node displays a mastery ring (% of questions in Leitner box ≥ 4).
 *
 * Props:
 *  - domains: [{ domain, label, total, seen, mastered, percent }]
 *  - onSelect: (domainName) => void
 *  - locked: boolean  — anon user, click redirects to register
 */
export default function DomainPath({ domains, onSelect, locked = false }) {
  if (!domains?.length) return null;

  return (
    <div className="relative">
      {/* connector line */}
      <div className="absolute left-[27px] top-6 bottom-6 w-px bg-gradient-to-b from-brand-500/40 via-surface-border to-surface-border" aria-hidden />

      <ul className="space-y-3 relative">
        {domains.map((d, i) => (
          <DomainNode
            key={d.domain}
            domain={d}
            index={i}
            locked={locked}
            onSelect={() => onSelect?.(d.domain)}
          />
        ))}
      </ul>
    </div>
  );
}

function DomainNode({ domain, index, locked, onSelect }) {
  const { label, total, seen, mastered, percent } = domain;
  const isMastered = percent >= 80;
  const isStarted = seen > 0;
  const colorTone = isMastered ? 'emerald' : isStarted ? 'brand' : 'neutral';

  const ringColor =
    colorTone === 'emerald' ? 'stroke-emerald-500'
      : colorTone === 'brand' ? 'stroke-brand-500'
        : 'stroke-surface-border';

  const bgColor =
    colorTone === 'emerald' ? 'bg-emerald-500/10 border-emerald-500/30'
      : colorTone === 'brand' ? 'bg-brand-500/10 border-brand-500/30'
        : 'bg-surface-soft border-surface-border';

  // SVG ring math (r=22, circ ≈ 138)
  const R = 22;
  const CIRC = 2 * Math.PI * R;
  const dash = (percent / 100) * CIRC;

  return (
    <motion.li
      initial={{ opacity: 0, x: -8 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 0.04 * index, duration: 0.25 }}
    >
      <button
        type="button"
        onClick={onSelect}
        className={`w-full group flex items-center gap-3 p-3 rounded-xl border transition-all text-left
          ${bgColor}
          hover:border-brand-500/60 hover:shadow-sm hover:-translate-y-[1px]
          focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500/40`}
        aria-label={`Practicar dominio ${label}: ${mastered} de ${total} dominadas`}
      >
        {/* Ring + icon */}
        <div className="relative shrink-0" style={{ width: 54, height: 54 }}>
          <svg width="54" height="54" viewBox="0 0 54 54" className="-rotate-90">
            <circle cx="27" cy="27" r={R} className="stroke-surface-border/60 fill-transparent" strokeWidth="3" />
            <circle
              cx="27" cy="27" r={R}
              className={`${ringColor} fill-transparent transition-[stroke-dashoffset] duration-500`}
              strokeWidth="3"
              strokeLinecap="round"
              strokeDasharray={CIRC}
              strokeDashoffset={CIRC - dash}
            />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            {locked ? (
              <Lock size={18} className="text-ink-muted" />
            ) : isMastered ? (
              <CheckCircle2 size={20} className="text-emerald-500" />
            ) : (
              <Layers size={18} className={isStarted ? 'text-brand-600' : 'text-ink-muted'} />
            )}
          </div>
        </div>

        {/* Label + progress */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-sm font-semibold text-ink truncate">{label}</span>
            {isMastered && (
              <span className="text-[10px] font-bold uppercase tracking-wide px-1.5 py-0.5 rounded bg-emerald-500/15 text-emerald-600 dark:text-emerald-300">
                Dominado
              </span>
            )}
          </div>
          <div className="mt-1 flex items-center gap-2 text-xs text-ink-soft">
            <span className="tabular-nums">{mastered}/{total} dominadas</span>
            <span className="text-ink-muted">·</span>
            <span className="tabular-nums">{percent}%</span>
            {isStarted && !isMastered && (
              <>
                <span className="text-ink-muted">·</span>
                <span className="text-ink-muted">{seen} vistas</span>
              </>
            )}
          </div>
        </div>

        {/* Call to action */}
        <span className="shrink-0 text-xs font-medium text-brand-600 opacity-0 group-hover:opacity-100 transition-opacity">
          Practicar →
        </span>
      </button>
    </motion.li>
  );
}
