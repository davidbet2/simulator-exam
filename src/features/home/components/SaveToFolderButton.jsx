/**
 * SaveToFolderButton — lets the user save/remove an exam set from their folders.
 * Opens a popover with the list of folders + a quick "create folder" option.
 */
import { useEffect, useRef, useState } from 'react';
import { FolderPlus, Check, Plus, X } from 'lucide-react';
import { useFolders } from '../hooks/useFolders';
import { useAuthStore } from '../../../core/store/useAuthStore';
import { Trans, useLingui, Plural } from '@lingui/react/macro';

export function SaveToFolderButton({ slug, compact = false }) {
  const { user } = useAuthStore();
  const { t } = useLingui();
  const { folders, createFolder, addSlugToFolder, removeSlugFromFolder } = useFolders();
  const [open, setOpen] = useState(false);
  const [adding, setAdding] = useState(false);
  const [newName, setNewName] = useState('');
  const [busy, setBusy] = useState(null); // folderId being toggled
  const ref = useRef(null);

  // Close on outside click
  useEffect(() => {
    const handler = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  if (!user) return null;

  const inFolders = folders.filter((f) => (f.slugs ?? []).includes(slug));
  const isInAny = inFolders.length > 0;

  const toggle = async (folder) => {
    setBusy(folder.id);
    try {
      if ((folder.slugs ?? []).includes(slug)) {
        await removeSlugFromFolder(folder.id, slug);
      } else {
        await addSlugToFolder(folder.id, slug);
      }
    } finally {
      setBusy(null);
    }
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    if (!newName.trim()) return;
    setBusy('create');
    try {
      const id = await createFolder(newName.trim());
      await addSlugToFolder(id, slug);
      setNewName('');
      setAdding(false);
    } finally {
      setBusy(null);
    }
  };

  return (
    <div className="relative" ref={ref}>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-label={t`Guardar en carpeta`}
        title={t`Guardar en carpeta`}
        className={`rounded-full border flex items-center gap-2 transition-all ${
          compact
            ? `h-8 w-8 justify-center ${isInAny ? 'bg-brand-500/10 border-brand-500/40 text-brand-600 hover:bg-brand-500/20' : 'bg-transparent border-surface-border text-ink-soft hover:text-ink hover:border-brand-500/40 hover:bg-surface-muted/50'}`
            : `h-9 px-3 text-sm font-medium ${isInAny ? 'bg-brand-500/10 border-brand-500/40 text-brand-600 hover:bg-brand-500/20' : 'bg-transparent border-surface-border text-ink-soft hover:text-ink hover:border-brand-500/40 hover:bg-surface-muted/50'}`
        }`}
      >
        <FolderPlus size={15} />
        {!compact && <span>{isInAny ? <Plural value={inFolders.length} one="# carpeta" other="# carpetas" /> : <Trans>Guardar</Trans>}</span>}
      </button>

      {open && (
        <div
          className="absolute left-0 top-full mt-2 w-64 rounded-2xl bg-surface-card border border-surface-border shadow-[0_10px_40px_-12px_rgba(0,0,0,0.25)] z-50 overflow-hidden"
          role="dialog"
          aria-label={t`Carpetas`}
        >
          <div className="px-4 py-3 text-xs font-semibold text-ink-muted uppercase tracking-wide border-b border-surface-border">
            <Trans>Guardar en carpeta</Trans>
          </div>

          {folders.length === 0 && !adding && (
            <div className="px-4 py-3 text-sm text-ink-muted">
              <Trans>Aún no tienes carpetas.</Trans>
            </div>
          )}

          <ul className="py-1 max-h-52 overflow-y-auto">
            {folders.map((folder) => {
              const checked = (folder.slugs ?? []).includes(slug);
              return (
                <li key={folder.id}>
                  <button
                    type="button"
                    disabled={busy === folder.id}
                    onClick={() => toggle(folder)}
                    className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-ink hover:bg-surface-muted/50 transition-colors disabled:opacity-60"
                  >
                    <span
                      className={`h-5 w-5 rounded-md border flex items-center justify-center shrink-0 transition-colors ${
                        checked
                          ? 'bg-brand-500 border-brand-500 text-white'
                          : 'border-surface-border'
                      }`}
                    >
                      {checked && <Check size={11} strokeWidth={3} />}
                    </span>
                    <span className="truncate flex-1 text-left">{folder.name}</span>
                  </button>
                </li>
              );
            })}
          </ul>

          <div className="border-t border-surface-border px-2 py-2">
            {adding ? (
              <form onSubmit={handleCreate} className="flex gap-1.5 items-center">
                <input
                  autoFocus
                  type="text"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  placeholder={t`Nombre de carpeta`}
                  className="flex-1 h-8 px-3 text-xs rounded-lg bg-surface-muted/60 border border-transparent focus:outline-none focus:border-brand-500 text-ink placeholder-ink-muted"
                />
                <button
                  type="submit"
                  disabled={!newName.trim() || busy === 'create'}
                  className="h-8 w-8 flex items-center justify-center rounded-lg bg-brand-500 text-white hover:bg-brand-600 disabled:opacity-50"
                >
                  <Check size={13} />
                </button>
                <button
                  type="button"
                  onClick={() => { setAdding(false); setNewName(''); }}
                  className="h-8 w-8 flex items-center justify-center rounded-lg text-ink-soft hover:bg-surface-muted/60"
                >
                  <X size={13} />
                </button>
              </form>
            ) : (
              <button
                type="button"
                onClick={() => setAdding(true)}
                className="w-full flex items-center gap-2 h-8 px-3 rounded-lg text-xs text-ink-muted hover:text-ink hover:bg-surface-muted/60 transition-colors"
              >
                <Plus size={13} />
                <Trans>Nueva carpeta</Trans>
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
