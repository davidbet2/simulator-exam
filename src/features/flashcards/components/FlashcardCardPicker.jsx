import { Trans } from '@lingui/react/macro';
import { Modal } from '../../../components/ui/Modal';

function chipClasses(isCurrent, status) {
  if (isCurrent) return 'bg-zen-brand text-white shadow-zen';
  if (status === 'known') return 'bg-zen-success/20 text-emerald-700 dark:text-zen-success';
  if (status === 'unknown') return 'bg-zen-danger/20 text-rose-700 dark:text-zen-danger';
  return 'bg-glass-light-1 text-zen-ink/60 dark:bg-glass-dark-1 dark:text-white/50';
}

function LegendDot({ className, label }) {
  return (
    <span className="inline-flex items-center gap-1.5 text-xs text-zen-ink/60 dark:text-white/50">
      <span className={`h-2 w-2 rounded-full ${className}`} />
      {label}
    </span>
  );
}

export function FlashcardCardPicker({ open, onClose, cards, currentIndex, statuses, onSelect }) {
  return (
    <Modal open={open} onClose={onClose} title={<Trans>Ir a una tarjeta</Trans>} size="lg">
      <p className="-mt-2 mb-4 text-sm text-zen-ink/60 dark:text-white/50">
        <Trans>Salta directamente a cualquier tarjeta del mazo</Trans>
      </p>
      <div className="grid grid-cols-4 gap-2 sm:grid-cols-6">
        {cards.map((card, i) => (
          <button
            key={card.id}
            type="button"
            onClick={() => { onSelect(i); onClose(); }}
            className={`flex h-11 items-center justify-center rounded-lg text-sm font-semibold transition-all hover:brightness-110 ${chipClasses(i === currentIndex, statuses[card.id])}`}
          >
            {i + 1}
          </button>
        ))}
      </div>
      <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-1.5 border-t border-glass-light-border pt-4 dark:border-glass-dark-border">
        <LegendDot className="bg-zen-brand" label={<Trans>Actual</Trans>} />
        <LegendDot className="bg-zen-success" label={<Trans>Dominada</Trans>} />
        <LegendDot className="bg-zen-danger" label={<Trans>A repasar</Trans>} />
        <LegendDot className="bg-zen-ink/30 dark:bg-white/30" label={<Trans>Pendiente</Trans>} />
      </div>
    </Modal>
  );
}
