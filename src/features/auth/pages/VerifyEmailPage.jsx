import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { MailCheck, RefreshCw, LogOut } from 'lucide-react';
import { useAuthStore } from '../../../core/store/useAuthStore';
import Button from '../../../components/ui/Button';
import { SEOHead } from '../../../components/SEOHead';

export function VerifyEmailPage() {
  const { user, resendVerification, logout } = useAuthStore();
  const navigate = useNavigate();
  const [sent, setSent] = useState(false);
  const [sending, setSending] = useState(false);
  const [checking, setChecking] = useState(false);
  const [notYet, setNotYet] = useState(false);

  // If user is already verified or not logged in, redirect
  if (!user) return null;
  if (user.emailVerified) {
    navigate('/', { replace: true });
    return null;
  }

  async function handleResend() {
    setSending(true);
    await resendVerification();
    setSending(false);
    setSent(true);
    setTimeout(() => setSent(false), 5000);
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
    <div className="min-h-screen bg-surface flex items-center justify-center p-4">
      <SEOHead title="Verifica tu correo" description="" path="/verify-email" noindex />
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="w-full max-w-sm text-center"
      >
        {/* Logo */}
        <div className="inline-flex items-center gap-2 mb-8">
          <div className="w-8 h-8 rounded-xl bg-brand-500 flex items-center justify-center shadow-brand">
            <span className="text-white font-black text-xs leading-none">CZ</span>
          </div>
          <span className="text-xl font-display font-black text-ink tracking-tight">
            Cert<span className="text-brand-500">Zen</span>
          </span>
        </div>

        <div className="rounded-2xl border border-surface-border bg-surface-soft p-8 space-y-5">
          <div className="flex justify-center">
            <div className="w-16 h-16 rounded-2xl bg-brand-50 flex items-center justify-center">
              <MailCheck size={32} className="text-brand-500" />
            </div>
          </div>

          <div>
            <h1 className="text-xl font-semibold text-ink mb-2">Revisa tu correo</h1>
            <p className="text-sm text-ink-soft leading-relaxed">
              Enviamos un enlace de verificación a{' '}
              <span className="font-semibold text-ink">{user?.email}</span>.
              <br />
              Haz clic en el enlace y luego regresa aquí.
            </p>
          </div>

          {sent && (
            <div className="rounded-lg bg-success-500/10 border border-success-500/30 px-4 py-2 text-sm text-green-400">
              ¡Correo reenviado!
            </div>
          )}

          {notYet && (
            <div className="rounded-lg bg-warning-500/10 border border-warning-500/30 px-4 py-2 text-sm text-amber-500">
              Aún no hemos recibido la confirmación. Revisa tu bandeja de entrada o spam.
            </div>
          )}

          <Button className="w-full" onClick={handleCheckVerified} disabled={checking}>
            {checking ? (
              <><RefreshCw size={15} className="animate-spin" /> Verificando...</>
            ) : (
              'Ya verifiqué, continuar'
            )}
          </Button>

          <Button variant="ghost" className="w-full text-sm" onClick={handleResend} disabled={sending || sent}>
            <RefreshCw size={14} />
            {sent ? 'Correo enviado' : sending ? 'Enviando...' : 'Reenviar correo'}
          </Button>

          <button
            onClick={handleLogout}
            className="flex items-center justify-center gap-1.5 w-full text-xs text-ink-muted hover:text-ink transition-colors"
          >
            <LogOut size={12} />
            Salir de la cuenta
          </button>
        </div>
      </motion.div>
    </div>
  );
}
