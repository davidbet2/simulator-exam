import { useState } from 'react';
import { Star } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../../core/store/useAuthStore';
import { useRating } from '../hooks/useRating';
import { Trans, useLingui, Plural } from '@lingui/react/macro';

/**
 * RatingStars — 5-star interactive rating with optimistic UI.
 *
 * Props:
 *   slug          (string) — required
 *   ownerUid      (string) — to prevent self-rating
 *   averageValue  (number) — the set's public average
 *   count         (number) — total number of ratings
 *   size          (number) — icon size, default 18
 *   readOnly      (bool)   — force readOnly mode
 *   showCount     (bool)   — show "(N)" next to average, default true
 */
export function RatingStars({
  slug,
  ownerUid,
  averageValue = 0,
  count = 0,
  size = 18,
  readOnly = false,
  showCount = true,
}) {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const { t } = useLingui();
  const isOwnSet = user && ownerUid && user.uid === ownerUid;
  const disabled = readOnly || isOwnSet;

  const { myStars, submitting, submit } = useRating(disabled ? null : slug);
  const [hover, setHover] = useState(0);
  const [errorMsg, setErrorMsg] = useState('');

  // Value shown when no one is hovering: user's rating if rated, else avg
  const idle   = myStars > 0 ? myStars : averageValue;
  const active = hover > 0 ? hover : idle;

  const handleClick = async (n) => {
    if (disabled || submitting) return;
    if (!user) {
      navigate('/login', { state: { redirectTo: window.location.pathname } });
      return;
    }
    setErrorMsg('');
    try {
      await submit(n);
    } catch (err) {
      setErrorMsg(err.message ?? t`No se pudo calificar`);
    }
  };

  return (
    <div className="flex items-center gap-2">
      <div
        className="flex items-center gap-0.5"
        onMouseLeave={() => setHover(0)}
        role={disabled ? 'img' : 'radiogroup'}
        aria-label={
          disabled
            ? t`Calificación promedio: ${averageValue.toFixed(1)} de 5, ${count} ${count === 1 ? 'voto' : 'votos'}`
            : t`Calificar este set`
        }
      >
        {[1, 2, 3, 4, 5].map((n) => {
          const filled = active >= n;
          const half   = !filled && active > n - 1;
          return (
            <button
              key={n}
              type="button"
              disabled={disabled || submitting}
              onMouseEnter={() => !disabled && setHover(n)}
              onClick={() => handleClick(n)}
              className={`
                p-0.5 rounded transition
                ${disabled ? 'cursor-default' : 'cursor-pointer hover:scale-110'}
                disabled:opacity-100
              `}
              aria-label={t`${n} ${n === 1 ? 'estrella' : 'estrellas'}`}
            >
              <Star
                size={size}
                className={
                  filled
                    ? 'fill-amber-400 stroke-amber-500'
                    : half
                    ? 'fill-amber-200 stroke-amber-400'
                    : 'fill-transparent stroke-ink-soft/60'
                }
              />
            </button>
          );
        })}
      </div>

      {showCount && (
        <span className="text-xs text-ink-soft">
          {count > 0
            ? `${averageValue.toFixed(1)} (${count})`
            : <span className="italic"><Trans>sin votos</Trans></span>}
        </span>
      )}

      {isOwnSet && (
        <span className="text-[10px] text-ink-soft italic"><Trans>No puedes calificar tu propio set</Trans></span>
      )}
      {errorMsg && (
        <span className="text-[10px] text-rose-500">{errorMsg}</span>
      )}
    </div>
  );
}
