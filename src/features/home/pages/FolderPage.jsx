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
import { Card, CardBody } from '../../../components/ui/Card';
import Button from '../../../components/ui/Button';
import { getDomain } from '../../../core/constants/domains';
import { useFolders } from '../hooks/useFolders';
import { AdBanner } from '../../ads/components/AdBanner';

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
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 space-y-6">
        <Link to="/home" className="text-sm text-ink-soft hover:text-ink flex items-center gap-1.5">
          <ArrowLeft size={14} />{t('common.back')}
        </Link>

        {loading ? (
          <div className="h-20 rounded-xl bg-surface-soft animate-pulse" />
        ) : !folder ? (
          <Card><CardBody className="p-8 text-center">
            <p className="text-ink-soft"><Trans>Carpeta no encontrada.</Trans></p>
          </CardBody></Card>
        ) : (
          <>
            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-3 min-w-0 flex-1">
                <Folder size={28} className="text-brand-500 shrink-0" />
                {editing ? (
                  <div className="flex items-center gap-2 flex-1">
                    <input
                      autoFocus
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && saveName()}
                      className="h-10 px-3 rounded-lg bg-surface-muted border border-surface-border text-lg font-bold text-ink focus:outline-none focus:border-brand-500 flex-1 max-w-md"
                    />
                    <button
                      type="button"
                      onClick={saveName}
                      className="h-10 w-10 rounded-lg bg-brand-500 text-white flex items-center justify-center hover:bg-brand-600"
                      aria-label={t('common.save')}
                    >
                      <Check size={16} />
                    </button>
                    <button
                      type="button"
                      onClick={() => { setEditing(false); setName(folder.name); }}
                      className="h-10 w-10 rounded-lg bg-surface-muted border border-surface-border text-ink-soft flex items-center justify-center hover:bg-surface-muted"
                      aria-label={t('common.cancel')}
                    >
                      <X size={16} />
                    </button>
                  </div>
                ) : (
                  <h1 className="text-2xl font-bold text-ink truncate">{folder.name}</h1>
                )}
              </div>
              {!editing && (
                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    onClick={() => setEditing(true)}
                    className="h-9 w-9 rounded-lg text-ink-soft hover:bg-surface-muted flex items-center justify-center"
                    aria-label={t('common.edit')}
                  >
                    <Pencil size={14} />
                  </button>
                  <button
                    type="button"
                    onClick={handleDelete}
                    className="h-9 w-9 rounded-lg text-danger-600 hover:bg-danger-500/10 flex items-center justify-center"
                    aria-label={t('common.delete')}
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              )}
            </div>

            <p className="text-sm text-ink-muted">
              <Plural value={sets.length} one="# set" other="# sets" />
            </p>

            {sets.length === 0 ? (
              <Card><CardBody className="p-8 text-center space-y-3">
                <Folder size={40} className="text-ink-muted mx-auto" />
                <p className="text-sm text-ink-soft"><Trans>Esta carpeta está vacía.</Trans></p>
                <Button onClick={() => navigate('/explore')}>
                  <Plus size={14} /><Trans>Agregar sets</Trans>
                </Button>
              </CardBody></Card>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {sets.map((s) => {
                  const domain = getDomain(s.domain);
                  return (
                    <Card key={s.id} className="hover:border-brand-500/50 transition-colors">
                      <CardBody className="p-4 flex items-center gap-3">
                        <Link to={`/exam-sets/${s.id}`} className="flex items-center gap-3 min-w-0 flex-1">
                          <span className="h-10 w-10 rounded-xl bg-surface-muted flex items-center justify-center text-lg shrink-0" aria-hidden>
                            {domain.icon}
                          </span>
                          <div className="min-w-0">
                            <p className="text-sm font-semibold text-ink truncate">{s.title}</p>
                            <p className="text-xs text-ink-muted"><Trans>{s.questionCount ?? '?'} preguntas</Trans></p>
                          </div>
                        </Link>
                        <button
                          type="button"
                          onClick={() => handleRemoveSet(s.id)}
                          className="h-8 w-8 rounded-md text-ink-muted hover:text-danger-600 hover:bg-danger-500/10 flex items-center justify-center shrink-0"
                          aria-label={tMacro`Quitar de carpeta`}
                          title={tMacro`Quitar de carpeta`}
                        >
                          <X size={14} />
                        </button>
                      </CardBody>
                    </Card>
                  );
                })}
              </div>
            )}
          </>
        )}

        <AdBanner
          placementId="folder-bottom"
          adSlot={import.meta.env.VITE_ADSENSE_SLOT}
          className="mt-4"
        />
      </div>
    </AppShell>
  );
}
