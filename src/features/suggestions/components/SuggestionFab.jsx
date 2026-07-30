import { useState } from 'react';
import { useLingui } from '@lingui/react/macro';
import { Lightbulb } from 'lucide-react';
import { useSuggestionBox } from '../hooks/useSuggestionBox';
import { SuggestionModal } from './SuggestionModal';

/**
 * SuggestionFab — floating action button that opens the suggestion box.
 * Positioned bottom-right, above StickyAdBar's ~80px reserved height.
 */
export function SuggestionFab() {
  const { t } = useLingui();
  const { shouldShow } = useSuggestionBox();
  const [open, setOpen] = useState(false);

  if (!shouldShow) return null;

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-label={t`Enviar una sugerencia`}
        className="fixed bottom-24 right-4 z-30 flex h-11 w-11 items-center justify-center rounded-full bg-zen-brand shadow-zen transition-all hover:shadow-zen-lg hover:brightness-110 lg:bottom-6"
      >
        <Lightbulb size={20} className="fill-amber-400 text-amber-400" />
      </button>

      <SuggestionModal open={open} onClose={() => setOpen(false)} />
    </>
  );
}
