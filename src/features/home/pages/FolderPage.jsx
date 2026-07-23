import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import {
  doc, getDoc, onSnapshot,
} from 'firebase/firestore';
import { ArrowLeft, Folder, Pencil, Check, X, Trash2, Plus } from 'lucide-react';
import { db } from '../../../core/firebase/firebase';
import { useAuthStore } from '../../../core/store/useAuthStore';
import { useTranslation } from '../../../core/i18n';
import { Trans, useLingui, Plural } from '@lingui/react/macro';
import { AppShell } from '../../../components/layout/AppShell';
import { GlassCard } from '../../../components/glass/GlassCard';
import { GlassButton } from '../../../components/glass/GlassButton';
import { GlassInput } from '../../../components/glass/GlassInput';
import { getDomain } from '../../../core/constants/domains';
import { useFolders } from '../hooks/useFolders';

export function FolderPage() {
  const { folderId } = useParams();
  const { user } = useAuthStore();
  const { t } = useTranslation();
  const { t: tMacro } = useLingui();
  const navigate = useNavigate();
  const { renameFolder, removeFolder, removeSlugFromFolder } = useFolders();

  const [folder, setFolder] = useState(null);
  const [sets, setSets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [name, setName] = useState('');

  useEffect(() => {
    if (!user || !folderId) return;
    const ref = doc(db, 'users', user.uid, 'folders', folderId);
    const unsub = onSnapshot(ref, async (snap) => {
      if (!snap.exists()) { setLoading(false); setFolder(null); return; }
      const data = { id: snap.id, ...snap.data() };
      setFolder(data);
      setName(data.name);

      // Hydrate sets
      const hydrated = await Promise.all(
        (data.slugs ?? []).map(async (slug) => {
          const s = await getDoc(doc(db, 'examSets', slug));
          return s.exists() ? { id: s.id, ...s.data() } : null;
        })
      );
      setSets(hydrated.filter(Boolean));
      setLoading(false);
    });
    return unsub;
  }, [user, folderId]);

  if (!user) { navigate('/login'); return null; }

  const saveName = async () => {
    if (!name.trim()) return;
    await renameFolder(folderId, name);
    setEditing(false);
  };

  const handleDelete = async () => {
    if (!confirm(tMacro`¿Eliminar esta carpeta? Los sets no se eliminarán.`)) return;
    await removeFolder(folderId);
    navigate('/home');
  };

  const handleRemoveSet = async (slug) => {
    await removeSlugFromFolder(folderId, slug);
  };

  return (
    <AppShell>
      <Helmet>
        <title>{folder?.name ?? tMacro`Carpeta`} — CertZen</title>
      </Helmet>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-6 sm:py-8 space-y-6">
        <Link to="/home" className="text-sm text-zen-ink/60 dark:text-white/60 hover:text-zen-ink dark:hover:text-white flex items-center gap-1.5">
          <ArrowLeft size={14} />{t('common.back')}
        </Link>

        {loading ? (
          <div className="h-20 rounded-2xl bg-glass-light-2 dark:bg-glass-dark-2 animate-pulse" />
        ) : !folder ? (
          <GlassCard className="p-8 text-center">
            <p className="text-zen-ink/60 dark:text-white/60"><Trans>Carpeta no encontrada.</Trans></p>
          </GlassCard>
        ) : (
          <>
            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-3 min-w-0 flex-1">
                <Folder size={28} className="text-zen dark:text-indigo-300 shrink-0" />
                {editing ? (
                  <div className="flex items-center gap-2 flex-1">
                    <GlassInput
                      autoFocus
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && saveName()}
                      className="text-lg font-bold flex-1 max-w-md"
                    />
                    <button
                      type="button"
                      onClick={saveName}
                      className="h-10 w-10 rounded-lg bg-zen text-white flex items-center justify-center hover:brightness-110"
                      aria-label={t('common.save')}
                    >
                      <Check size={16} />
                    </button>
                    <button
                      type="button"
                      onClick={() => { setEditing(false); setName(folder.name); }}
                      className="h-10 w-10 rounded-lg bg-glass-light-2 dark:bg-glass-dark-2 border border-glass-light-border dark:border-glass-dark-border text-zen-ink/60 dark:text-white/60 flex items-center justify-center hover:bg-glass-light-3 dark:hover:bg-glass-dark-3"
                      aria-label={t('common.cancel')}
                    >
                      <X size={16} />
                    </button>
                  </div>
                ) : (
                  <h1 className="text-2xl font-bold text-zen-ink dark:text-white truncate">{folder.name}</h1>
                )}
              </div>
              {!editing && (
                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    onClick={() => setEditing(true)}
                    className="h-9 w-9 rounded-lg text-zen-ink/50 dark:text-white/50 hover:bg-glass-light-2 dark:hover:bg-glass-dark-2 flex items-center justify-center"
                    aria-label={t('common.edit')}
                  >
                    <Pencil size={14} />
                  </button>
                  <button
                    type="button"
                    onClick={handleDelete}
                    className="h-9 w-9 rounded-lg text-zen-danger hover:bg-zen-danger/10 flex items-center justify-center"
                    aria-label={t('common.delete')}
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              )}
            </div>

            <p className="text-sm text-zen-ink/50 dark:text-white/50">
              <Plural value={sets.length} one="# set" other="# sets" />
            </p>

            {sets.length === 0 ? (
              <GlassCard className="p-8 text-center space-y-3">
                <Folder size={40} className="text-zen-ink/30 dark:text-white/30 mx-auto" />
                <p className="text-sm text-zen-ink/60 dark:text-white/60"><Trans>Esta carpeta está vacía.</Trans></p>
                <GlassButton onClick={() => navigate('/explore')}>
                  <Plus size={14} /><Trans>Agregar sets</Trans>
                </GlassButton>
              </GlassCard>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {sets.map((s) => {
                  const domain = getDomain(s.domain);
                  return (
                    <GlassCard key={s.id} className="p-4 flex items-center gap-3 hover:border-zen/40 transition-colors">
                      <Link to={`/exam-sets/${s.id}`} className="flex items-center gap-3 min-w-0 flex-1">
                        <span className="h-10 w-10 rounded-xl bg-zen/15 dark:bg-zen/25 flex items-center justify-center text-lg shrink-0" aria-hidden>
                          {domain.icon}
                        </span>
                        <div className="min-w-0">
                          <p className="text-sm font-semibold text-zen-ink dark:text-white truncate">{s.title}</p>
                          <p className="text-xs text-zen-ink/50 dark:text-white/50"><Trans>{s.questionCount ?? '?'} preguntas</Trans></p>
                        </div>
                      </Link>
                      <button
                        type="button"
                        onClick={() => handleRemoveSet(s.id)}
                        className="h-8 w-8 rounded-md text-zen-ink/40 dark:text-white/40 hover:text-zen-danger hover:bg-zen-danger/10 flex items-center justify-center shrink-0"
                        aria-label={tMacro`Quitar de carpeta`}
                        title={tMacro`Quitar de carpeta`}
                      >
                        <X size={14} />
                      </button>
                    </GlassCard>
                  );
                })}
              </div>
            )}
          </>
        )}
      </div>
    </AppShell>
  );
}
