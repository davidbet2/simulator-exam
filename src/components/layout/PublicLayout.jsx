import { Link } from 'react-router-dom';
import { ArrowRight, LayoutDashboard, Sparkles, User, Zap } from 'lucide-react';
import { Trans, useLingui } from '@lingui/react/macro';
import { useAuthStore } from '../../core/store/useAuthStore';
import { useUserPlan } from '../../features/plans/hooks/useUserPlan';
import { PageBackground } from '../glass/PageBackground';
import { GlassButton } from '../glass/GlassButton';
import { Footer } from './Footer';

/**
 * PublicLayout — chrome compartido de las páginas públicas (spec 03):
 * nav glass + fondo con orbes + footer glass. La nav replica el diseño
 * desktop y mobile de export/ y export_mobile/ (una fila, sin hamburger).
 *
 * hideChrome: para páginas tipo Login/Registro que en el diseño no llevan
 * nav ni footer, solo el fondo.
 */
export function PublicLayout({ hideChrome = false, children }) {
  const { t } = useLingui();
  const { user } = useAuthStore();
  const { isPro, isLoading: planLoading } = useUserPlan();

  if (hideChrome) return <PageBackground>{children}</PageBackground>;

  return (
    <PageBackground>
      <header className="sticky top-0 z-20 border-b border-glass-light-border bg-glass-light-1 backdrop-blur-xl dark:border-glass-dark-border dark:bg-glass-dark-1">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-4 px-4 sm:px-6 md:h-[4.75rem]">
          <Link to="/" className="flex items-center gap-2.5" aria-label={t`CertZen inicio`}>
            <div className="flex h-[2.125rem] w-[2.125rem] items-center justify-center rounded-zen bg-zen-brand">
              <Sparkles size={16} className="text-white" />
            </div>
            <span className="text-xl font-bold tracking-tight">CertZen</span>
          </Link>

          {/* Mobile: con ≤3 acciones no se usa hamburger (diseño export_mobile) */}
          <nav className="flex items-center gap-1 sm:gap-3">
            {user ? (
              <>
                {!isPro && !planLoading && (
                  <GlassButton to="/pricing" variant="ghost" className="px-3">
                    <Zap size={14} className="text-zen-warning" />
                    <span className="hidden sm:inline">Pro</span>
                  </GlassButton>
                )}
                <GlassButton to="/dashboard" variant="ghost" className="px-3">
                  <LayoutDashboard size={14} />
                  <span className="hidden sm:inline"><Trans>Dashboard</Trans></span>
                </GlassButton>
                <GlassButton to="/profile" variant="ghost" className="px-3">
                  <User size={14} />
                  <span className="hidden sm:inline"><Trans>Perfil</Trans></span>
                </GlassButton>
              </>
            ) : (
              <>
                <GlassButton to="/login" variant="ghost" className="px-4">
                  <Trans>Ingresar</Trans>
                </GlassButton>
                <GlassButton to="/register" className="px-5">
                  <Trans>Registro gratis</Trans>
                  <ArrowRight size={13} />
                </GlassButton>
              </>
            )}
          </nav>
        </div>
      </header>

      {children}

      <Footer variant="glass" />
    </PageBackground>
  );
}
