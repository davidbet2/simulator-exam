import { motion } from 'framer-motion';
import { Sparkles, RotateCcw, LogOut } from 'lucide-react';
import { Trans } from '@lingui/react/macro';
import { GlassCard } from '../../../components/glass/GlassCard';
import { GlassButton } from '../../../components/glass/GlassButton';

export function FlashcardSummary({ knownCount, total, onRestart, onExit }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.35, ease: 'easeOut' }}
      className="mx-auto w-full max-w-lg"
    >
      <GlassCard variant="elevated" className="flex flex-col items-center gap-4 p-8 text-center">
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-zen/15 text-zen dark:bg-zen/25 dark:text-indigo-300">
          <Sparkles size={22} />
        </div>
        <div>
          <h2 className="text-xl font-bold">
            <Trans>{knownCount} de {total} dominadas</Trans>
          </h2>
          <p className="mt-1 text-sm text-zen-ink/70 dark:text-white/60">
            <Trans>Repasaste todo el mazo de esta sesión.</Trans>
          </p>
        </div>
        <div className="mt-2 flex w-full flex-col gap-3 sm:flex-row sm:justify-center">
          <GlassButton variant="secondary" className="sm:w-fit" onClick={onExit}>
            <LogOut size={16} /><Trans>Salir</Trans>
          </GlassButton>
          <GlassButton variant="primary" className="sm:w-fit" onClick={onRestart}>
            <RotateCcw size={16} /><Trans>Repasar de nuevo</Trans>
          </GlassButton>
        </div>
      </GlassCard>
    </motion.div>
  );
}
