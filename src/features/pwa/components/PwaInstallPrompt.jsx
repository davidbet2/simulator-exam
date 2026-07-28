import { useState, useEffect } from 'react';
import { X, Zap, WifiOff, Bell, Download } from 'lucide-react';
import { Trans } from '@lingui/react/macro';
import { usePwaInstall } from '../hooks/usePwaInstall';
import { PwaIosInstructionsModal } from './PwaIosInstructionsModal';
import { GlassButton } from '../../../components/glass/GlassButton';

const SHOW_DELAY_MS = 4000;

function Bullet({ icon: Icon, children }) {
  return (
    <span className="inline-flex items-center gap-1.5 text-xs text-zen-ink/70 dark:text-white/60">
      <Icon size={13} className="shrink-0 text-zen dark:text-indigo-300" />
      {children}
    </span>
  );
}

export function PwaInstallPrompt() {
  const { platform, shouldShow, install, dismiss } = usePwaInstall();
  const [delayElapsed, setDelayElapsed] = useState(false);
  const [iosModalOpen, setIosModalOpen] = useState(false);

  useEffect(() => {
    if (!shouldShow) return;
    const timer = setTimeout(() => setDelayElapsed(true), SHOW_DELAY_MS);
    return () => clearTimeout(timer);
  }, [shouldShow]);

  if (!shouldShow || !delayElapsed) return null;

  function handleInstallClick() {
    if (platform === 'ios') {
      setIosModalOpen(true);
      return;
    }
    install();
  }

  return (
    <>
      <div
        role="complementary"
        aria-label="Instalar aplicación"
        className="fixed inset-x-0 bottom-0 z-50 border-t border-glass-light-border bg-glass-light-3 backdrop-blur-xl shadow-zen-glass dark:border-glass-dark-border dark:bg-glass-dark-3 lg:inset-x-auto lg:bottom-4 lg:right-4 lg:max-w-sm lg:rounded-2xl lg:border"
      >
        <div className="relative px-4 py-4 sm:px-6">
          <button
            type="button"
            onClick={dismiss}
            aria-label="Cerrar"
            className="absolute right-3 top-3 flex h-7 w-7 items-center justify-center rounded-lg text-zen-ink/50 hover:bg-zen/10 hover:text-zen-ink dark:text-white/40 dark:hover:text-white"
          >
            <X size={16} />
          </button>

          <div className="flex items-start gap-3 pr-8">
            <img src="/icons/icon-192.png" alt="" className="h-11 w-11 shrink-0 rounded-xl" />
            <div className="min-w-0">
              <h2 className="text-sm font-bold text-zen-ink dark:text-white">
                <Trans>Instala CertZen</Trans>
              </h2>
              <p className="mt-0.5 text-xs text-zen-ink/70 dark:text-white/60">
                <Trans>Estudia desde tu pantalla de inicio, incluso sin conexión</Trans>
              </p>
            </div>
          </div>

          <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1.5">
            <Bullet icon={Zap}><Trans>Acceso directo</Trans></Bullet>
            <Bullet icon={WifiOff}><Trans>Modo offline</Trans></Bullet>
            <Bullet icon={Bell}><Trans>Recordatorios</Trans></Bullet>
          </div>

          <div className="mt-4 grid grid-cols-2 gap-3">
            <GlassButton variant="secondary" onClick={dismiss}>
              <Trans>Ahora no</Trans>
            </GlassButton>
            <GlassButton variant="primary" onClick={handleInstallClick}>
              <Download size={15} /><Trans>Instalar app</Trans>
            </GlassButton>
          </div>

          {platform === 'ios' && (
            <p className="mt-3 text-center text-[11px] text-zen-ink/50 dark:text-white/40">
              <Trans>En iPhone: Compartir → Agregar a pantalla de inicio</Trans>
            </p>
          )}
        </div>
      </div>

      <PwaIosInstructionsModal open={iosModalOpen} onClose={() => setIosModalOpen(false)} />
    </>
  );
}
