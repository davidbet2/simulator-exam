import { Share, SquarePlus, Check } from 'lucide-react';
import { Trans } from '@lingui/react/macro';
import { Modal } from '../../../components/ui/Modal';

const STEPS = [
  { icon: Share, title: <Trans>1. Toca el ícono Compartir</Trans>, desc: <Trans>Está en la barra inferior de Safari</Trans> },
  { icon: SquarePlus, title: <Trans>2. Agregar a pantalla de inicio</Trans>, desc: <Trans>Desliza hacia abajo para encontrarlo</Trans> },
  { icon: Check, title: <Trans>3. Toca Agregar</Trans>, desc: <Trans>Arriba a la derecha, y listo</Trans> },
];

function TitleBlock() {
  return (
    <div className="flex items-center gap-3">
      <img src="/icons/icon-192.png" alt="" className="h-10 w-10 shrink-0 rounded-xl" />
      <div>
        <p className="text-base font-bold leading-tight text-zen-ink dark:text-white">
          <Trans>Instala CertZen en tu iPhone</Trans>
        </p>
        <p className="text-xs font-normal text-zen-ink/60 dark:text-white/50">
          <Trans>Solo son 3 pasos desde Safari</Trans>
        </p>
      </div>
    </div>
  );
}

export function PwaIosInstructionsModal({ open, onClose }) {
  return (
    <Modal open={open} onClose={onClose} title={<TitleBlock />} size="sm">
      {/* Mock Safari address bar */}
      <div className="flex items-center gap-2 rounded-xl border border-glass-light-border bg-glass-light-1 px-3 py-2 dark:border-glass-dark-border dark:bg-glass-dark-1">
        <span className="text-xs text-zen-ink/40 dark:text-white/30">Aa</span>
        <span className="flex-1 truncate text-center text-xs text-zen-ink/70 dark:text-white/60">certzen.co</span>
        <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-zen-brand text-white">
          <Share size={13} />
        </span>
      </div>

      <ol className="mt-4 space-y-3">
        {STEPS.map((step, i) => (
          <li key={i} className="flex items-start gap-3">
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-zen/15 text-zen dark:bg-zen/25 dark:text-indigo-300">
              <step.icon size={16} />
            </span>
            <div className="min-w-0">
              <p className="text-sm font-semibold text-zen-ink dark:text-white">{step.title}</p>
              <p className="text-xs text-zen-ink/60 dark:text-white/50">{step.desc}</p>
            </div>
          </li>
        ))}
      </ol>

      <p className="mt-4 text-center text-xs text-zen-ink/50 dark:text-white/40">
        <Trans>CertZen aparecerá como una app más en tu pantalla de inicio</Trans>
      </p>
    </Modal>
  );
}
