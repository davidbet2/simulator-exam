import { Shuffle, RefreshCw, RotateCcw } from 'lucide-react';
import { Trans } from '@lingui/react/macro';
import { GlassButton } from '../../../components/glass/GlassButton';

export function FlashcardControls({ onShuffle, onFlip, onRestart }) {
  return (
    <div className="mx-auto w-full max-w-2xl">
      {/* Mobile: primary "Voltear tarjeta" on top, secondary row below */}
      <div className="flex flex-col gap-3 sm:hidden">
        <GlassButton variant="primary" className="w-full" onClick={onFlip}>
          <RefreshCw size={16} /><Trans>Voltear tarjeta</Trans>
        </GlassButton>
        <div className="grid grid-cols-2 gap-3">
          <GlassButton variant="secondary" onClick={onShuffle}>
            <Shuffle size={16} /><Trans>Mezclar</Trans>
          </GlassButton>
          <GlassButton variant="secondary" onClick={onRestart}>
            <RotateCcw size={16} /><Trans>Reiniciar</Trans>
          </GlassButton>
        </div>
      </div>

      {/* Desktop/tablet: single row, "Voltear tarjeta" centered and highlighted */}
      <div className="hidden items-center justify-center gap-4 sm:flex">
        <GlassButton variant="secondary" onClick={onShuffle}>
          <Shuffle size={16} /><Trans>Mezclar</Trans>
        </GlassButton>
        <GlassButton variant="primary" className="px-8" onClick={onFlip}>
          <RefreshCw size={16} /><Trans>Voltear tarjeta</Trans>
        </GlassButton>
        <GlassButton variant="secondary" onClick={onRestart}>
          <RotateCcw size={16} /><Trans>Reiniciar</Trans>
        </GlassButton>
      </div>
    </div>
  );
}
