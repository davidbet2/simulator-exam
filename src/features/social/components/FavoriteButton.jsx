import { useState } from 'react';
import { Bookmark } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../../core/store/useAuthStore';
import { useFavorite } from '../hooks/useFavorite';

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

  const label = isFav ? 'Quitar de favoritos' : 'Guardar en favoritos';

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
            ? 'bg-brand-50 text-brand-700 border border-brand-200'
            : 'bg-surface text-ink-soft border border-surface-border hover:bg-surface-soft'}
          disabled:opacity-50
        `}
      >
        <Bookmark size={12} className={isFav ? 'fill-brand-500 stroke-brand-500' : ''} />
        {isFav ? 'Guardado' : 'Guardar'}
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
          ? 'bg-brand-50 text-brand-600 hover:bg-brand-100'
          : 'bg-surface-soft text-ink-soft hover:bg-surface-muted hover:text-ink'}
        disabled:opacity-50
      `}
    >
      <Bookmark size={16} className={isFav ? 'fill-brand-500 stroke-brand-500' : ''} />
      {err && <span className="sr-only">{err}</span>}
    </button>
  );
}
