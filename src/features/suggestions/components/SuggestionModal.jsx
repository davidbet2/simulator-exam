import { useId, useState } from 'react';
import { Trans, useLingui } from '@lingui/react/macro';
import { Star } from 'lucide-react';
import { Modal } from '../../../components/ui/Modal';
import { GlassButton } from '../../../components/glass/GlassButton';
import { useSuggestionBox } from '../hooks/useSuggestionBox';

const MESSAGE_MIN = 10;
const MESSAGE_MAX = 1000;

function errorMessage(err, t) {
  switch (err?.code) {
    case 'functions/unauthenticated':
      return t`Debes iniciar sesión para enviar una sugerencia.`;
    case 'functions/resource-exhausted':
      return t`Ya enviaste una sugerencia hace poco. Intenta de nuevo en unos minutos.`;
    case 'functions/invalid-argument':
      return t`Revisa el mensaje e intenta de nuevo.`;
    default:
      return t`No se pudo enviar la sugerencia. Intenta de nuevo más tarde.`;
  }
}

export function SuggestionModal({ open, onClose }) {
  const { t } = useLingui();
  const { submitting, cooldownActive, submit } = useSuggestionBox();
  const messageId = useId();

  const [message, setMessage] = useState('');
  const [rating, setRating] = useState(null);
  const [hoverRating, setHoverRating] = useState(null);
  const [error, setError] = useState(null);
  const [sent, setSent] = useState(false);

  function reset() {
    setMessage('');
    setRating(null);
    setHoverRating(null);
    setError(null);
    setSent(false);
  }

  function handleClose() {
    reset();
    onClose();
  }

  const trimmed = message.trim();
  const invalid = trimmed.length < MESSAGE_MIN || trimmed.length > MESSAGE_MAX;

  async function handleSubmit() {
    if (invalid || submitting || cooldownActive) return;
    setError(null);
    try {
      await submit({ message: trimmed, rating });
      setSent(true);
    } catch (err) {
      console.error('sendSuggestionEmail:', err);
      setError(errorMessage(err, t));
    }
  }

  return (
    <Modal open={open} onClose={handleClose} title={t`Buzón de sugerencias`} size="sm">
      {sent ? (
        <div role="status" aria-live="polite" className="space-y-3 py-2 text-center">
          <span className="text-4xl" aria-hidden="true">✅</span>
          <p className="text-sm text-zen-ink/70 dark:text-white/60">
            <Trans>¡Gracias por tu sugerencia! La tendremos en cuenta.</Trans>
          </p>
          <GlassButton variant="secondary" onClick={handleClose} className="w-full">
            <Trans>Cerrar</Trans>
          </GlassButton>
        </div>
      ) : (
        <div className="space-y-4">
          <div>
            <label htmlFor={messageId} className="mb-1 block text-sm font-semibold">
              <Trans>Tu sugerencia</Trans>
            </label>
            <textarea
              id={messageId}
              rows={4}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              maxLength={MESSAGE_MAX}
              aria-required="true"
              placeholder={t`Cuéntanos qué mejorarías o qué te gustaría ver…`}
              className="min-h-11 w-full resize-y rounded-zen border border-glass-light-border bg-glass-light-2 px-3 py-2.5 text-sm text-zen-ink backdrop-blur-md transition placeholder:text-zen-ink/50 focus:border-zen focus:outline-none focus:ring-2 focus:ring-zen/40 dark:border-glass-dark-border dark:bg-glass-dark-2 dark:text-white dark:placeholder:text-white/40"
            />
            <p className="mt-1 text-right text-xs text-zen-ink/50 dark:text-white/40">
              {trimmed.length}/{MESSAGE_MAX}
            </p>
          </div>

          <div>
            <span className="mb-1 block text-sm font-semibold">
              <Trans>Calificación (opcional)</Trans>
            </span>
            <div className="flex gap-1" role="radiogroup" aria-label={t`Calificación de 1 a 5 estrellas`}>
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  role="radio"
                  aria-checked={rating === star}
                  aria-label={t`${star} estrellas`}
                  onClick={() => setRating(rating === star ? null : star)}
                  onMouseEnter={() => setHoverRating(star)}
                  onMouseLeave={() => setHoverRating(null)}
                  className="flex h-11 w-11 items-center justify-center rounded-zen transition hover:bg-glass-light-2 dark:hover:bg-glass-dark-2"
                >
                  <Star
                    size={22}
                    className={
                      star <= (hoverRating ?? rating ?? 0)
                        ? 'fill-amber-400 text-amber-400'
                        : 'text-zen-ink/30 dark:text-white/30'
                    }
                  />
                </button>
              ))}
            </div>
          </div>

          <GlassButton
            onClick={handleSubmit}
            disabled={invalid || submitting || cooldownActive}
            className="w-full"
          >
            {submitting ? <Trans>Enviando…</Trans> : <Trans>Enviar sugerencia</Trans>}
          </GlassButton>

          {cooldownActive && !error && (
            <p role="status" className="text-center text-xs text-zen-ink/60 dark:text-white/50">
              <Trans>Ya enviaste una sugerencia hace poco. Intenta de nuevo en unos minutos.</Trans>
            </p>
          )}

          {error && (
            <p role="alert" className="text-center text-xs text-zen-danger">{error}</p>
          )}
        </div>
      )}
    </Modal>
  );
}
