import { useEffect } from 'react';
import { motion } from 'framer-motion';
import { Layers, CheckCircle2, Circle, RotateCw } from 'lucide-react';
import { Trans } from '@lingui/react/macro';
import { GlassBadge } from '../../../components/glass/GlassBadge';
import { GlassButton } from '../../../components/glass/GlassButton';

const LETTERS = ['A', 'B', 'C', 'D', 'E', 'F'];

/** Derives both faces' content from a question's `type` — front never reveals the answer. */
function deriveContent(card) {
  if (card.type === 'matching') {
    return {
      kind: 'matching',
      terms: (card.pairs ?? []).map((p) => p.term),
      pool: Object.values(card.matches ?? {}),
      pairs: (card.pairs ?? []).map((p) => ({ term: p.term, match: card.matches?.[p.correctMatch] })),
    };
  }
  if (card.type === 'ordering') {
    return {
      kind: 'ordering',
      items: card.items ?? [],
      correctOrder: card.correctOrder ?? [],
    };
  }
  const answerKeys = card.answer ?? [];
  const options = Object.entries(card.options ?? {}).map(([key, text], i) => ({
    key,
    letter: LETTERS[i] ?? key,
    text,
    correct: answerKeys.includes(key),
  }));
  return { kind: 'multiple', options };
}

function FrontFace({ content }) {
  if (content.kind === 'multiple') {
    return (
      <ul className="space-y-2">
        {content.options.map((opt) => (
          <li
            key={opt.key}
            className="flex items-start gap-2 rounded-lg border border-glass-light-border bg-glass-light-1 px-3 py-2 text-sm dark:border-glass-dark-border dark:bg-glass-dark-1"
          >
            <span className="mt-0.5 shrink-0 font-semibold text-zen-ink/50 dark:text-white/40">{opt.letter}.</span>
            <span className="text-zen-ink dark:text-white">{opt.text}</span>
          </li>
        ))}
      </ul>
    );
  }
  if (content.kind === 'matching') {
    return (
      <div className="space-y-4">
        <div>
          <p className="mb-1.5 text-xs font-semibold uppercase tracking-wide text-zen-ink/50 dark:text-white/40">
            <Trans>Términos</Trans>
          </p>
          <ul className="space-y-1.5">
            {content.terms.map((term, i) => (
              <li key={i} className="rounded-lg border border-glass-light-border bg-glass-light-1 px-3 py-1.5 text-sm dark:border-glass-dark-border dark:bg-glass-dark-1">
                {term}
              </li>
            ))}
          </ul>
        </div>
        <div>
          <p className="mb-1.5 text-xs font-semibold uppercase tracking-wide text-zen-ink/50 dark:text-white/40">
            <Trans>Definiciones</Trans>
          </p>
          <ul className="space-y-1.5">
            {content.pool.map((text, i) => (
              <li key={i} className="rounded-lg border border-dashed border-glass-light-border px-3 py-1.5 text-sm text-zen-ink/70 dark:border-glass-dark-border dark:text-white/60">
                {text}
              </li>
            ))}
          </ul>
        </div>
      </div>
    );
  }
  // ordering
  return (
    <ul className="space-y-1.5">
      {content.items.map((item, i) => (
        <li key={i} className="flex items-center gap-2 rounded-lg border border-glass-light-border bg-glass-light-1 px-3 py-1.5 text-sm dark:border-glass-dark-border dark:bg-glass-dark-1">
          <Circle size={8} className="shrink-0 text-zen-ink/30 dark:text-white/30" />
          <span>{item}</span>
        </li>
      ))}
    </ul>
  );
}

function BackFace({ content }) {
  if (content.kind === 'multiple') {
    return (
      <ul className="space-y-2">
        {content.options.map((opt) => (
          <li
            key={opt.key}
            className={`flex items-start gap-2 rounded-lg border px-3 py-2 text-sm ${
              opt.correct
                ? 'border-zen-success/50 bg-zen-success/10 font-medium text-emerald-700 dark:text-zen-success'
                : 'border-glass-light-border bg-glass-light-1 text-zen-ink/60 dark:border-glass-dark-border dark:bg-glass-dark-1 dark:text-white/50'
            }`}
          >
            <span className="mt-0.5 shrink-0 font-semibold">{opt.letter}.</span>
            <span className="flex-1">{opt.text}</span>
            {opt.correct && <CheckCircle2 size={16} className="mt-0.5 shrink-0 text-emerald-600 dark:text-zen-success" />}
          </li>
        ))}
      </ul>
    );
  }
  if (content.kind === 'matching') {
    return (
      <ul className="space-y-2">
        {content.pairs.map((p, i) => (
          <li key={i} className="rounded-lg border border-zen-success/30 bg-zen-success/10 px-3 py-2 text-sm text-zen-ink dark:text-white">
            <span className="font-medium">{p.term}</span>
            <span className="mx-2 text-zen-ink/40 dark:text-white/40">&rarr;</span>
            <span className="font-semibold text-emerald-700 dark:text-zen-success">{p.match}</span>
          </li>
        ))}
      </ul>
    );
  }
  // ordering
  return (
    <ol className="list-decimal space-y-2 pl-5">
      {content.correctOrder.map((item, i) => (
        <li key={i} className="text-sm text-zen-ink dark:text-white">{item}</li>
      ))}
    </ol>
  );
}

function StatusBadge({ status }) {
  if (status === 'known') {
    return (
      <GlassBadge tone="success" className="w-fit">
        <CheckCircle2 size={12} /><Trans>La sabías</Trans>
      </GlassBadge>
    );
  }
  if (status === 'unknown') {
    return (
      <GlassBadge tone="warning" className="w-fit">
        <RotateCw size={12} /><Trans>A repasar</Trans>
      </GlassBadge>
    );
  }
  return null;
}

export function FlashcardView({ card, isFlipped, status, onFlip, onMarkKnown, onMarkUnknown }) {
  useEffect(() => {
    function handleKeyDown(e) {
      if (e.code === 'Space') {
        e.preventDefault();
        onFlip();
      }
    }
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onFlip]);

  if (!card) return null;
  const content = deriveContent(card);
  const faceClasses = 'flex min-h-[320px] flex-col rounded-2xl border border-glass-light-border bg-glass-light-2 p-6 backdrop-blur-md dark:border-glass-dark-border dark:bg-glass-dark-2 sm:min-h-[380px] sm:p-8 [grid-area:1/1]';

  return (
    <motion.div layout className="mx-auto w-full max-w-2xl" style={{ perspective: '1600px' }}>
      <motion.div
        className="grid cursor-pointer"
        style={{ transformStyle: 'preserve-3d' }}
        animate={{ rotateY: isFlipped ? 180 : 0 }}
        transition={{ duration: 0.5, ease: 'easeInOut' }}
        onClick={onFlip}
      >
        {/* Front — question + unrevealed options/terms/items */}
        <div className={faceClasses} style={{ backfaceVisibility: 'hidden' }}>
          <div className="flex items-center justify-between gap-2">
            <GlassBadge tone="brand" className="w-fit">
              <Layers size={12} /><Trans>Pregunta</Trans>
            </GlassBadge>
            <StatusBadge status={status} />
          </div>
          <p className="mt-4 text-base font-semibold sm:text-lg">{card.question}</p>
          <div className="mt-4 max-h-[40vh] flex-1 overflow-y-auto px-1">
            <FrontFace content={content} />
          </div>
          <p className="mt-4 hidden text-center text-xs text-zen-ink/50 dark:text-white/40 sm:block">
            <Trans>Toca la tarjeta o presiona espacio para voltear</Trans>
          </p>
          <p className="mt-4 text-center text-xs text-zen-ink/50 dark:text-white/40 sm:hidden">
            <Trans>Toca la tarjeta para voltear</Trans>
          </p>
        </div>

        {/* Back — same content, correct answer revealed/highlighted */}
        <div className={faceClasses} style={{ backfaceVisibility: 'hidden', transform: 'rotateY(180deg)' }}>
          <div className="flex items-center justify-between gap-2">
            <GlassBadge tone="success" className="w-fit">
              <CheckCircle2 size={12} /><Trans>Respuesta</Trans>
            </GlassBadge>
            <StatusBadge status={status} />
          </div>
          <div className="mt-4 max-h-[45vh] flex-1 overflow-y-auto px-1">
            <BackFace content={content} />
            {card.explanation && (
              <p className="mt-4 rounded-lg bg-glass-light-1 p-3 text-sm text-zen-ink/70 dark:bg-glass-dark-1 dark:text-white/60">
                {card.explanation}
              </p>
            )}
          </div>
          <div className="mt-4 grid grid-cols-2 gap-3" onClick={(e) => e.stopPropagation()}>
            <GlassButton variant="secondary" onClick={onMarkUnknown}>
              <Trans>No la sabía</Trans>
            </GlassButton>
            <GlassButton variant="primary" onClick={onMarkKnown}>
              <CheckCircle2 size={16} /><Trans>La sabía</Trans>
            </GlassButton>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
