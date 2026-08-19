import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MailCheck, RefreshCw, LogOut } from 'lucide-react';
import { useAuthStore } from '../../../core/store/useAuthStore';
import { GlassButton } from '../../../components/glass/GlassButton';
import { AuthShell } from '../components/AuthShell';
import { SEOHead } from '../../../components/SEOHead';

export function VerifyEmailPage() {
  const { user, resendVerification, logout } = useAuthStore();
  const navigate = useNavigate();
  const [sent, setSent] = useState(false);
  const [sending, setSending] = useState(false);
  const [checking, setChecking] = useState(false);
  const [notYet, setNotYet] = useState(false);
  const [resendError, setResendError] = useState('');

  // If user is already verified or not logged in, redirect
  if (!user) return null;
  if (user.emailVerified) {
    navigate('/', { replace: true });
    return null;
  }

  async function handleResend() {
    setSending(true);
    setResendError('');
    try {
      await resendVerification();
      setSent(true);
      setTimeout(() => setSent(false), 5000);
    } catch (err) {
      setResendError(
        err?.code === 'auth/too-many-requests'
          ? 'Demasiados intentos. Espera unos minutos e inténtalo de nuevo.'
          : 'No se pudo reenviar el correo. Inténtalo de nuevo.'
      );
    } finally {
      setSending(false);
    }
  }

  async function handleCheckVerified() {
    setChecking(true);
    setNotYet(false);
    // Reload the Firebase user to get the latest emailVerified status
    await user.reload();
    if (user.emailVerified) {
      navigate('/', { replace: true });
    } else {
      setNotYet(true);
      setChecking(false);
    }
  }

  async function handleLogout() {
    await logout();
    navigate('/login', { replace: true });
  }

  return (
    <AuthShell>
      <SEOHead title="Verifica tu correo" description="" path="/verify-email" noindex />
      <div className="space-y-5 text-center">
        <div className="flex justify-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-zen/15 dark:bg-zen/25">
            <MailCheck size={32} className="text-zen dark:text-indigo-300" />
          </div>
        </div>

        <div>
          <h1 className="mb-2 text-xl font-bold">Revisa tu correo</h1>
          <p className="text-sm leading-relaxed text-zen-ink/70 dark:text-white/60">
            Enviamos un enlace de verificación a{' '}
            <span className="font-semibold text-zen-ink dark:text-white">{user?.email}</span>.
            <br />
            Haz clic en el enlace y luego regresa aquí.
          </p>
        </div>

        {sent && (
          <div className="rounded-zen border border-zen-success/30 bg-zen-success/10 px-4 py-2 text-sm text-emerald-600 dark:text-zen-success">
            ¡Correo reenviado!
          </div>
        )}

        {notYet && (
          <div className="rounded-zen border border-zen-warning/30 bg-zen-warning/10 px-4 py-2 text-sm text-amber-600 dark:text-zen-warning">
            Aún no hemos recibido la confirmación. Revisa tu bandeja de entrada o spam.
          </div>
        )}

        {resendError && (
          <div className="rounded-zen border border-zen-danger/30 bg-zen-danger/10 px-4 py-2 text-sm text-zen-danger">
            {resendError}
          </div>
        )}

        <GlassButton className="w-full" onClick={handleCheckVerified} disabled={checking}>
          {checking ? (
            <><RefreshCw size={15} className="animate-spin" /> Verificando...</>
          ) : (
            'Ya verifiqué, continuar'
          )}
        </GlassButton>

        <GlassButton variant="ghost" className="w-full text-sm" onClick={handleResend} disabled={sending || sent}>
          <RefreshCw size={14} />
          {sent ? 'Correo enviado' : sending ? 'Enviando...' : 'Reenviar correo'}
        </GlassButton>

        <button
          onClick={handleLogout}
          className="flex min-h-11 w-full items-center justify-center gap-1.5 text-xs text-zen-ink/50 transition-colors hover:text-zen-ink dark:text-white/40 dark:hover:text-white"
        >
          <LogOut size={12} />
          Salir de la cuenta
        </button>
      </div>
    </AuthShell>
  );
}
