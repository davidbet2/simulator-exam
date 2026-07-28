import { ChevronLeft, ChevronRight } from 'lucide-react';

/** Large floating circular Anterior/Siguiente buttons flanking the card — desktop only (mockup: 1440px). */
export function FlashcardArrowNav({ side, onClick, disabled = false }) {
  const Icon = side === 'left' ? ChevronLeft : ChevronRight;
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-label={side === 'left' ? 'Anterior' : 'Siguiente'}
      title={side === 'left' ? 'Anterior' : 'Siguiente'}
      className={`hidden h-11 w-11 shrink-0 items-center justify-center rounded-full border border-glass-light-border bg-glass-light-2 text-zen-ink/70 backdrop-blur-md transition-all hover:bg-glass-light-3 hover:text-zen-ink disabled:cursor-not-allowed disabled:opacity-30 dark:border-glass-dark-border dark:bg-glass-dark-2 dark:text-white/60 dark:hover:bg-glass-dark-3 dark:hover:text-white lg:flex`}
    >
      <Icon size={18} />
    </button>
  );
}
