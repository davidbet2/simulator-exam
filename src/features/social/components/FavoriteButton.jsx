import { useState } from 'react';
import { Bookmark } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../../core/store/useAuthStore';
import { useFavorite } from '../hooks/useFavorite';
import { Trans, useLingui } from '@lingui/react/macro';

/**
 * FavoriteButton — bookmark toggle with optimistic UI.
 *
 * Props:
 *   slug       — required
 *   setMeta    — { title, domain } for denormalization
 *   count      — total favorites count (public)
 *   variant    — 'icon' | 'inline' (default 'icon')
 */
export function FavoriteButton({ slug, setMeta, count = 0, variant = 'icon' }) {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const { t } = useLingui();
  const { isFav, busy, toggle } = useFavorite(slug, setMeta);
  const [err, setErr] = useState('');

  const handleClick = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!user) {
      navigate('/login', { state: { redirectTo: window.location.pathname } });
      return;
    }
    setErr('');
    try {
      await toggle();
    } catch (error) {
      setErr(error.message ?? 'Error');
    }
  };

  const label = isFav ? t`Quitar de favoritos` : t`Guardar en favoritos`;

  if (variant === 'inline') {
    return (
      <button
        type="button"
        onClick={handleClick}
        disabled={busy}
        aria-pressed={isFav}
        aria-label={label}
        className={`
          inline-flex items-center gap-1.5 text-xs font-medium
          px-2.5 py-1 rounded-full transition
          ${isFav
            ? 'bg-zen/15 text-zen border border-zen/30 dark:text-indigo-300'
            : 'bg-glass-light-2 text-zen-ink/70 border border-glass-light-border hover:bg-glass-light-3 dark:bg-glass-dark-2 dark:text-white/60 dark:border-glass-dark-border dark:hover:bg-glass-dark-3'}
          disabled:opacity-50
        `}
      >
        <Bookmark size={12} className={isFav ? 'fill-zen stroke-zen' : ''} />
        {isFav ? <Trans>Guardado</Trans> : <Trans>Guardar</Trans>}
        {count > 0 && <span className="opacity-60">· {count}</span>}
      </button>
    );
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={busy}
      aria-pressed={isFav}
      aria-label={label}
      title={label}
      className={`
        p-2 rounded-lg transition
        ${isFav
          ? 'bg-zen/15 text-zen hover:bg-zen/25 dark:text-indigo-300'
          : 'bg-glass-light-2 text-zen-ink/60 hover:bg-glass-light-3 hover:text-zen-ink dark:bg-glass-dark-2 dark:text-white/60 dark:hover:bg-glass-dark-3 dark:hover:text-white'}
        disabled:opacity-50
      `}
    >
      <Bookmark size={16} className={isFav ? 'fill-zen stroke-zen' : ''} />
      {err && <span className="sr-only">{err}</span>}
    </button>
  );
}
