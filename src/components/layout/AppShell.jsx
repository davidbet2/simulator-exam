import { useState, useRef, useEffect, useMemo } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import {
  Home, Library, Search, Plus, FolderPlus, Folder,
  Settings, User, Trophy, LogOut, Sun, Moon, Monitor, X,
  PanelLeftClose, PanelLeftOpen, MessageCircle, BookMarked, Sparkles,
} from 'lucide-react';
import { collection, query, where, limit, getDocs } from 'firebase/firestore';
import { db } from '../../core/firebase/firebase';
import { getDomain } from '../../core/constants/domains';
import { PageBackground } from '../glass/PageBackground';
import { GlassButton } from '../glass/GlassButton';
import { Trans, useLingui } from '@lingui/react/macro';
import { useAuthStore } from '../../core/store/useAuthStore';
import { useThemeStore } from '../../core/store/useThemeStore';
import { useUIStore } from '../../core/store/useUIStore';
import { useTranslation } from '../../core/i18n';
import { useFolders } from '../../features/home/hooks/useFolders';
import { Footer } from './Footer';

const NAV_ITEMS = [
  { to: '/home',        icon: Home,       labelKey: 'nav.home' },
  { to: '/dashboard',   icon: Library,    labelKey: 'nav.library' },
  { to: '/explore',     icon: Search,     labelKey: 'nav.explore' },
  { to: '/my-sets',     icon: BookMarked, labelKey: 'nav.mySets' },
  { to: '/create-exam', icon: Plus,       labelKey: 'nav.create' },
];

// ── Sidebar primitives (desktop, ≥lg) ──────────────────────────────────────────
function SidebarLink({ to, icon: Icon, label, onClick, collapsed }) {
  return (
    <NavLink
      to={to}
      onClick={onClick}
      end
      title={collapsed ? label : undefined}
      className={({ isActive }) =>
        `flex items-center gap-3 h-11 ${collapsed ? 'px-0 justify-center' : 'px-3.5'} rounded-xl text-sm font-medium transition-all ${
          isActive
            ? 'bg-zen/15 text-zen dark:bg-zen/25 dark:text-indigo-300 font-semibold'
            : 'text-zen-ink/70 hover:text-zen-ink hover:bg-glass-light-2 dark:text-white/70 dark:hover:text-white dark:hover:bg-glass-dark-2'
        }`
      }
    >
      <Icon size={19} strokeWidth={2} />
      {!collapsed && <span className="truncate">{label}</span>}
    </NavLink>
  );
}

function FolderRow({ folder, onClick }) {
  return (
    <NavLink
      to={`/folders/${folder.id}`}
      onClick={onClick}
      className={({ isActive }) =>
        `flex items-center gap-2.5 h-9 px-3 rounded-lg text-[13px] transition-colors ${
          isActive
            ? 'text-zen font-semibold bg-zen/10 dark:text-indigo-300'
            : 'text-zen-ink/60 hover:text-zen-ink hover:bg-glass-light-2 dark:text-white/60 dark:hover:text-white dark:hover:bg-glass-dark-2'
        }`
      }
    >
      <span className="flex h-6 w-6 items-center justify-center rounded-md bg-zen/15 text-zen dark:bg-zen/25 dark:text-indigo-300 shrink-0">
        <Folder size={11} />
      </span>
      <span className="truncate">{folder.name}</span>
    </NavLink>
  );
}

function FoldersSection({ onNavigate }) {
  const { t } = useTranslation();
  const { folders, createFolder } = useFolders();
  const [creatingFolder, setCreatingFolder] = useState(false);
  const [folderName, setFolderName] = useState('');

  const handleCreateFolder = async (e) => {
    e.preventDefault();
    if (!folderName.trim()) return;
    try {
      await createFolder(folderName);
      setFolderName('');
      setCreatingFolder(false);
    } catch (err) {
      console.error('[AppShell] createFolder failed:', err);
    }
  };

  return (
    <>
      <div className="mt-6 mb-2 px-3 text-[11px] font-semibold uppercase tracking-[0.14em] text-zen-ink/40 dark:text-white/40">
        {t('nav.folders')}
      </div>
      {folders.length === 0 && !creatingFolder && (
        <p className="px-3 text-xs text-zen-ink/50 dark:text-white/50 leading-relaxed pb-1">
          {t('folders.empty')}
        </p>
      )}
      {folders.map((f) => (
        <FolderRow key={f.id} folder={f} onClick={onNavigate} />
      ))}
      {creatingFolder ? (
        <form onSubmit={handleCreateFolder} className="px-1 pt-1 flex gap-1">
          <input
            autoFocus
            type="text"
            value={folderName}
            onChange={(e) => setFolderName(e.target.value)}
            placeholder={t('folders.name')}
            className="flex-1 h-9 px-3 text-sm rounded-lg bg-glass-light-2 dark:bg-glass-dark-2 border border-glass-light-border dark:border-glass-dark-border focus:outline-none focus:border-zen text-zen-ink dark:text-white placeholder-zen-ink/40 dark:placeholder-white/40"
          />
          <button
            type="button"
            onClick={() => { setCreatingFolder(false); setFolderName(''); }}
            className="h-9 w-9 flex items-center justify-center rounded-lg text-zen-ink/60 hover:bg-glass-light-2 dark:text-white/60 dark:hover:bg-glass-dark-2"
            aria-label="cancel"
          >
            <X size={14} />
          </button>
        </form>
      ) : (
        <button
          type="button"
          onClick={() => setCreatingFolder(true)}
          className="flex items-center gap-2.5 h-9 px-3 rounded-lg text-[13px] text-zen-ink/50 hover:text-zen-ink hover:bg-glass-light-2 dark:text-white/50 dark:hover:text-white dark:hover:bg-glass-dark-2 transition-colors"
        >
          <span className="flex h-6 w-6 items-center justify-center rounded-md border border-dashed border-zen-ink/25 dark:border-white/25">
            <FolderPlus size={12} />
          </span>
          <span>{t('nav.newFolder')}</span>
        </button>
      )}
    </>
  );
}

function Sidebar({ collapsed = false, onToggleCollapse }) {
  const { t } = useTranslation();
  const { t: tMacro } = useLingui();

  return (
    <nav className="flex flex-col h-full p-3 gap-1" aria-label={tMacro`Navegación principal`}>
      <div className="flex items-center justify-between h-14 mb-2">
        <Link
          to="/home"
          className={`flex items-center gap-2.5 px-1 ${collapsed ? 'justify-center w-full' : ''}`}
        >
          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-zen bg-zen-brand">
            <Sparkles size={17} className="text-white" />
          </span>
          {!collapsed && (
            <span className="text-xl font-bold tracking-tight text-zen-ink dark:text-white">
              CertZen
            </span>
          )}
        </Link>
        {onToggleCollapse && !collapsed && (
          <button
            type="button"
            onClick={onToggleCollapse}
            className="hidden lg:flex h-8 w-8 items-center justify-center rounded-lg text-zen-ink/40 hover:text-zen-ink hover:bg-glass-light-2 dark:text-white/40 dark:hover:text-white dark:hover:bg-glass-dark-2 transition-colors"
            aria-label={tMacro`Colapsar menú`}
            title={tMacro`Colapsar menú`}
          >
            <PanelLeftClose size={16} />
          </button>
        )}
      </div>

      {onToggleCollapse && collapsed && (
        <button
          type="button"
          onClick={onToggleCollapse}
          className="hidden lg:flex h-10 w-full items-center justify-center rounded-xl text-zen-ink/40 hover:text-zen-ink hover:bg-glass-light-2 dark:text-white/40 dark:hover:text-white dark:hover:bg-glass-dark-2 transition-colors mb-1"
          aria-label={tMacro`Expandir menú`}
          title={tMacro`Expandir menú`}
        >
          <PanelLeftOpen size={18} />
        </button>
      )}

      {NAV_ITEMS.map((item) => (
        <SidebarLink key={item.to} to={item.to} icon={item.icon} label={t(item.labelKey)} collapsed={collapsed} />
      ))}

      {!collapsed && (
        <>
          <FoldersSection />
        </>
      )}

      <div className="mt-auto pt-4">
        <SidebarLink to="/pricing" icon={Trophy} label={t('nav.pricing')} collapsed={collapsed} />
      </div>
    </nav>
  );
}

// ── User menu ────────────────────────────────────────────────────────────────
function UserMenuFoldersSection({ onNavigate }) {
  const { t } = useTranslation();
  const { folders, createFolder } = useFolders();
  const [creatingFolder, setCreatingFolder] = useState(false);
  const [folderName, setFolderName] = useState('');

  const handleCreateFolder = async (e) => {
    e.preventDefault();
    if (!folderName.trim()) return;
    try {
      await createFolder(folderName);
      setFolderName('');
      setCreatingFolder(false);
    } catch (err) {
      console.error('[AppShell] createFolder failed:', err);
    }
  };

  return (
    <div className="lg:hidden px-2 py-2 border-t border-glass-light-border dark:border-glass-dark-border">
      <p className="px-3 pb-1 text-[11px] font-semibold uppercase tracking-[0.14em] text-zen-ink/40 dark:text-white/40">
        {t('nav.folders')}
      </p>
      {folders.map((f) => (
        <Link
          key={f.id}
          to={`/folders/${f.id}`}
          onClick={onNavigate}
          className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm text-zen-ink dark:text-white hover:bg-glass-light-2 dark:hover:bg-glass-dark-2 transition-colors"
        >
          <Folder size={14} className="text-zen shrink-0" />
          <span className="truncate">{f.name}</span>
        </Link>
      ))}
      {creatingFolder ? (
        <form onSubmit={handleCreateFolder} className="px-1 pt-1 flex gap-1">
          <input
            autoFocus
            type="text"
            value={folderName}
            onChange={(e) => setFolderName(e.target.value)}
            placeholder={t('folders.name')}
            className="flex-1 h-9 px-3 text-sm rounded-lg bg-glass-light-2 dark:bg-glass-dark-2 border border-glass-light-border dark:border-glass-dark-border focus:outline-none focus:border-zen text-zen-ink dark:text-white placeholder-zen-ink/40 dark:placeholder-white/40"
          />
          <button
            type="button"
            onClick={() => { setCreatingFolder(false); setFolderName(''); }}
            className="h-9 w-9 flex items-center justify-center rounded-lg text-zen-ink/60 hover:bg-glass-light-2 dark:text-white/60 dark:hover:bg-glass-dark-2"
            aria-label="cancel"
          >
            <X size={14} />
          </button>
        </form>
      ) : (
        <button
          type="button"
          onClick={() => setCreatingFolder(true)}
          className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm text-zen-ink/60 dark:text-white/60 hover:bg-glass-light-2 dark:hover:bg-glass-dark-2 transition-colors"
        >
          <FolderPlus size={14} className="shrink-0" />
          {t('nav.newFolder')}
        </button>
      )}
    </div>
  );
}

function UserMenu() {
  const navigate = useNavigate();
  const { user, displayName, logout } = useAuthStore();
  const { mode, setMode } = useThemeStore();
  const { t } = useTranslation();
  const { t: tMacro } = useLingui();
  const [open, setOpen] = useState(false);
  const [imgError, setImgError] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const onClick = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener('mousedown', onClick);
    return () => document.removeEventListener('mousedown', onClick);
  }, []);

  const initials = (displayName ?? user.email ?? '??')
    .split(/[\s@.]/).filter(Boolean).slice(0, 2)
    .map((s) => s[0]?.toUpperCase()).join('');

  const cycleMode = () => {
    const next = mode === 'light' ? 'dark' : mode === 'dark' ? 'auto' : 'light';
    setMode(next);
  };

  const ModeIcon = mode === 'dark' ? Moon : mode === 'light' ? Sun : Monitor;
  const modeLabel = mode === 'dark' ? t('settings.mode.dark')
    : mode === 'light' ? t('settings.mode.light')
    : t('settings.mode.auto');

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen((v) => !v)}
        className="h-10 w-10 rounded-full bg-zen-brand text-white font-bold text-xs flex items-center justify-center ring-2 ring-white/50 dark:ring-white/10 hover:ring-zen/50 transition-all shadow-zen"
        aria-label={tMacro`Menú de usuario`}
        aria-expanded={open}
      >
        {user.photoURL && !imgError ? (
          <img
            src={user.photoURL}
            alt=""
            className="h-10 w-10 rounded-full object-cover"
            onError={() => setImgError(true)}
          />
        ) : (
          initials
        )}
      </button>
      {open && (
        <div
          className="absolute right-0 mt-2 w-64 rounded-2xl bg-glass-light-3 dark:bg-glass-dark-3 backdrop-blur-xl shadow-zen-glass border border-glass-light-border dark:border-glass-dark-border z-50 overflow-hidden max-h-[80vh] overflow-y-auto"
          role="menu"
        >
          <div className="px-4 py-3">
            <p className="text-sm font-semibold text-zen-ink dark:text-white truncate">{displayName}</p>
            <p className="text-xs text-zen-ink/60 dark:text-white/60 truncate">{user.email}</p>
          </div>
          <div className="px-2 pb-2">
            <Link
              to="/profile"
              onClick={() => setOpen(false)}
              className="flex items-center gap-3 px-3 py-2 rounded-xl text-sm text-zen-ink dark:text-white hover:bg-glass-light-2 dark:hover:bg-glass-dark-2 transition-colors"
              role="menuitem"
            >
              <User size={16} className="text-zen-ink/60 dark:text-white/60" />{t('nav.profile')}
            </Link>
            <Link
              to="/settings"
              onClick={() => setOpen(false)}
              className="flex items-center gap-3 px-3 py-2 rounded-xl text-sm text-zen-ink dark:text-white hover:bg-glass-light-2 dark:hover:bg-glass-dark-2 transition-colors"
              role="menuitem"
            >
              <Settings size={16} className="text-zen-ink/60 dark:text-white/60" />{t('nav.settings')}
            </Link>
            <Link
              to="/pricing"
              onClick={() => setOpen(false)}
              className="lg:hidden flex items-center gap-3 px-3 py-2 rounded-xl text-sm text-zen-ink dark:text-white hover:bg-glass-light-2 dark:hover:bg-glass-dark-2 transition-colors"
              role="menuitem"
            >
              <Trophy size={16} className="text-zen-ink/60 dark:text-white/60" />{t('nav.pricing')}
            </Link>
            <Link
              to="/contact"
              onClick={() => setOpen(false)}
              className="flex items-center gap-3 px-3 py-2 rounded-xl text-sm text-zen-ink dark:text-white hover:bg-glass-light-2 dark:hover:bg-glass-dark-2 transition-colors"
              role="menuitem"
            >
              <MessageCircle size={16} className="text-zen-ink/60 dark:text-white/60" /><Trans>Contáctenos</Trans>
            </Link>
          </div>

          {/* Carpetas — solo mobile/tablet: en desktop viven en el sidebar */}
          <UserMenuFoldersSection onNavigate={() => setOpen(false)} />

          <div className="mx-2 border-t border-glass-light-border dark:border-glass-dark-border" />

          <div className="px-2 py-2">
            <button
              type="button"
              onClick={cycleMode}
              className="w-full flex items-center justify-between gap-3 px-3 py-2 rounded-xl text-sm text-zen-ink dark:text-white hover:bg-glass-light-2 dark:hover:bg-glass-dark-2 transition-colors"
              role="menuitem"
            >
              <span className="flex items-center gap-3">
                <ModeIcon size={16} className="text-zen-ink/60 dark:text-white/60" />
                {t('settings.mode')}
              </span>
              <span className="text-xs font-medium text-zen">{modeLabel}</span>
            </button>
            <button
              type="button"
              onClick={async () => {
                setOpen(false);
                await logout();
                navigate('/');
              }}
              className="w-full flex items-center gap-3 px-3 py-2 rounded-xl text-sm text-zen-danger hover:bg-zen-danger/10 transition-colors"
              role="menuitem"
            >
              <LogOut size={16} />{t('common.logout')}
            </button>
          </div>

          <div className="px-4 py-2 border-t border-glass-light-border dark:border-glass-dark-border bg-glass-light-1 dark:bg-glass-dark-1 flex items-center gap-3 text-[11px] text-zen-ink/60 dark:text-white/60">
            <Link to="/privacy" onClick={() => setOpen(false)} className="hover:text-zen-ink dark:hover:text-white transition-colors" role="menuitem">
              <Trans>Privacidad</Trans>
            </Link>
            <span aria-hidden>·</span>
            <Link to="/terms" onClick={() => setOpen(false)} className="hover:text-zen-ink dark:hover:text-white transition-colors" role="menuitem">
              <Trans>Términos</Trans>
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}

// ── Search helpers ────────────────────────────────────────────────────────────
function SearchHighlight({ text, needle }) {
  if (!needle || !text) return text ?? null;
  const idx = text.toLowerCase().indexOf(needle.toLowerCase());
  if (idx === -1) return text;
  return (
    <>
      {text.slice(0, idx)}
      <mark className="bg-zen/20 text-zen-ink dark:text-white rounded-sm not-italic">{text.slice(idx, idx + needle.length)}</mark>
      {text.slice(idx + needle.length)}
    </>
  );
}

// ── Topbar ───────────────────────────────────────────────────────────────────
function TopBar({ authed }) {
  const navigate = useNavigate();
  const { t: tMacro } = useLingui();
  const [q, setQ] = useState('');
  const [catalog, setCatalog] = useState([]);
  const fetchedRef = useRef(false);
  const [showSugg, setShowSugg] = useState(false);
  const [activeIdx, setActiveIdx] = useState(-1);
  const containerRef = useRef(null);
  const inputRef = useRef(null);

  const suggestions = useMemo(() => {
    const needle = q.trim().toLowerCase();
    if (needle.length < 2 || catalog.length === 0) return [];
    const seen = new Set();
    const results = [];
    for (const s of catalog) {
      if (results.length >= 8) break;
      const title = s.title ?? '';
      if (title.toLowerCase().includes(needle) && !seen.has(title.toLowerCase())) {
        seen.add(title.toLowerCase());
        results.push({ label: title, kind: 'set', domain: s.domain });
      }
    }
    for (const s of catalog) {
      for (const tag of s.tags ?? []) {
        if (results.length >= 8) break;
        const t = tag.toLowerCase();
        if (t.includes(needle) && !seen.has(t)) {
          seen.add(t);
          results.push({ label: tag, kind: 'tag' });
        }
      }
    }
    return results;
  }, [catalog, q]);

  // Lazy-load catalog on first focus
  function ensureCatalog() {
    if (fetchedRef.current) return;
    fetchedRef.current = true;
    getDocs(query(collection(db, 'examSets'), where('published', '==', true), limit(30)))
      .then((snap) => setCatalog(snap.docs.map((d) => ({ id: d.id, title: d.data().title, domain: d.data().domain, tags: d.data().tags }))))
      .catch((err) => console.error('[TopBar] catalog fetch failed:', err));
  }

  // Click-outside closes dropdown
  useEffect(() => {
    function handleClick(e) {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setShowSugg(false);
        setActiveIdx(-1);
      }
    }
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  function applySearch(val) {
    setQ(val);
    setShowSugg(false);
    setActiveIdx(-1);
    if (val.trim()) navigate(`/explore?q=${encodeURIComponent(val.trim())}`);
  }

  function handleKeyDown(e) {
    if (!showSugg || suggestions.length === 0) return;
    if (e.key === 'ArrowDown') { e.preventDefault(); setActiveIdx((i) => Math.min(i + 1, suggestions.length - 1)); }
    else if (e.key === 'ArrowUp') { e.preventDefault(); setActiveIdx((i) => Math.max(i - 1, 0)); }
    else if (e.key === 'Enter' && activeIdx >= 0) { e.preventDefault(); applySearch(suggestions[activeIdx].label); }
    else if (e.key === 'Escape') { setShowSugg(false); setActiveIdx(-1); }
  }

  const onSubmit = (e) => {
    e.preventDefault();
    if (q.trim()) {
      setShowSugg(false);
      navigate(`/explore?q=${encodeURIComponent(q.trim())}`);
    }
  };

  if (!authed) {
    return (
      <header className="sticky top-0 z-20 border-b border-glass-light-border bg-glass-light-1 backdrop-blur-xl dark:border-glass-dark-border dark:bg-glass-dark-1 h-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-full flex items-center justify-between gap-4">
          <Link to="/" className="flex items-center gap-2.5" aria-label={tMacro`CertZen inicio`}>
            <span className="flex h-8 w-8 items-center justify-center rounded-zen bg-zen-brand">
              <Sparkles size={15} className="text-white" />
            </span>
            <span className="text-xl font-bold tracking-tight text-zen-ink dark:text-white hidden sm:block">
              CertZen
            </span>
          </Link>
          <nav className="flex items-center gap-2">
            <GlassButton to="/login" variant="ghost" className="px-4">
              <Trans>Ingresar</Trans>
            </GlassButton>
            <GlassButton to="/register" className="px-5">
              <Trans>Registro gratis</Trans>
            </GlassButton>
          </nav>
        </div>
      </header>
    );
  }

  return (
    <header className="relative z-20 h-16 md:h-[4.5rem]">
      <div className="h-full flex items-center gap-3 px-4 sm:px-6">
        <form onSubmit={onSubmit} className="flex-1 max-w-xl mx-auto relative" ref={containerRef} role="search">
          <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-zen-ink/40 dark:text-white/40 pointer-events-none" />
          <input
            ref={inputRef}
            type="search"
            autoComplete="off"
            value={q}
            onChange={(e) => {
              const val = e.target.value;
              setQ(val);
              setActiveIdx(-1);
              setShowSugg(val.trim().length >= 2);
            }}
            onFocus={() => {
              ensureCatalog();
              if (q.trim().length >= 2 && suggestions.length > 0) setShowSugg(true);
            }}
            onKeyDown={handleKeyDown}
            placeholder={tMacro`Buscar exámenes…`}
            className="h-11 w-full rounded-full bg-glass-light-2 dark:bg-glass-dark-2 border border-glass-light-border dark:border-glass-dark-border backdrop-blur-md px-11 text-sm text-zen-ink dark:text-white placeholder-zen-ink/40 dark:placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-zen/40 focus:border-zen transition-all"
            aria-label={tMacro`Buscar sets de examen`}
            aria-autocomplete="list"
            aria-haspopup="listbox"
            aria-expanded={showSugg && suggestions.length > 0}
            aria-activedescendant={activeIdx >= 0 ? `topbar-sugg-${activeIdx}` : undefined}
          />
          {q && (
            <button
              type="button"
              onClick={() => { setQ(''); setShowSugg(false); inputRef.current?.focus(); }}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-zen-ink/50 dark:text-white/50 hover:text-zen-ink dark:hover:text-white transition-colors"
              aria-label={tMacro`Limpiar búsqueda`}
            >
              <X size={14} />
            </button>
          )}
          {showSugg && suggestions.length > 0 && (
            <ul
              role="listbox"
              aria-label={tMacro`Sugerencias de búsqueda`}
              className="absolute z-50 top-full mt-1.5 left-0 w-full rounded-xl border border-glass-light-border dark:border-glass-dark-border bg-glass-light-3 dark:bg-glass-dark-3 backdrop-blur-xl shadow-zen-glass overflow-hidden"
            >
              {suggestions.map((s, i) => (
                <li
                  key={s.label}
                  id={`topbar-sugg-${i}`}
                  role="option"
                  aria-selected={i === activeIdx}
                  onMouseDown={(e) => { e.preventDefault(); applySearch(s.label); }}
                  onMouseEnter={() => setActiveIdx(i)}
                  className={`flex items-center gap-2.5 px-4 py-2.5 text-sm cursor-pointer transition-colors ${
                    i === activeIdx ? 'bg-zen/10 text-zen' : 'text-zen-ink dark:text-white hover:bg-glass-light-2 dark:hover:bg-glass-dark-2'
                  }`}
                >
                  {s.kind === 'tag'
                    ? <span className="text-xs bg-glass-light-2 dark:bg-glass-dark-2 border border-glass-light-border dark:border-glass-dark-border rounded px-1.5 py-0.5 text-zen-ink/60 dark:text-white/60 shrink-0">#</span>
                    : (() => { const d = getDomain(s.domain); return <span className="text-base shrink-0" aria-hidden>{d.icon}</span>; })()
                  }
                  <SearchHighlight text={s.label} needle={q} />
                </li>
              ))}
            </ul>
          )}
        </form>
        <div className="flex items-center gap-2 shrink-0">
          <button
            type="button"
            onClick={() => navigate('/create-exam')}
            className="h-10 w-10 rounded-full bg-zen-brand text-white flex items-center justify-center shadow-zen hover:shadow-zen-lg hover:brightness-110 transition-all"
            aria-label={tMacro`Crear examen`}
          >
            <Plus size={17} />
          </button>
          <UserMenu />
        </div>
      </div>
    </header>
  );
}

// ── Bottom tab bar (mobile/tablet, <lg) ────────────────────────────────────────
function BottomTabBar() {
  const { t } = useTranslation();
  return (
    <nav
      className="lg:hidden fixed bottom-0 inset-x-0 z-30 border-t border-glass-light-border bg-glass-light-3 backdrop-blur-xl dark:border-glass-dark-border dark:bg-glass-dark-3 pb-[env(safe-area-inset-bottom)]"
      aria-label="Navegación principal"
    >
      <div className="flex items-stretch justify-around">
        {NAV_ITEMS.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end
            className={({ isActive }) =>
              `flex flex-1 flex-col items-center justify-center gap-0.5 py-2 min-h-[3rem] text-[11px] font-medium transition-colors ${
                isActive
                  ? 'text-zen dark:text-indigo-300'
                  : 'text-zen-ink/50 dark:text-white/50'
              }`
            }
          >
            <item.icon size={20} strokeWidth={2} />
            <span className="truncate max-w-[4.5rem]">{t(item.labelKey)}</span>
          </NavLink>
        ))}
      </div>
    </nav>
  );
}

// ── Shell ────────────────────────────────────────────────────────────────────
export function AppShell({ children }) {
  const { user } = useAuthStore();
  const { sidebarCollapsed, toggleSidebar } = useUIStore();

  // Anonymous users → minimal shell (only soft topbar, no sidebar)
  if (!user) {
    return (
      <PageBackground className="flex flex-col">
        <TopBar authed={false} />
        <main id="main-content" className="flex-1">{children}</main>
        <Footer />
      </PageBackground>
    );
  }

  return (
    <PageBackground>
      <div className="flex min-h-screen">
        {/* Desktop sidebar — glass, collapsible */}
        <aside
          className={`hidden lg:block shrink-0 transition-[width] duration-200 ease-out ${
            sidebarCollapsed ? 'w-20' : 'w-64'
          }`}
        >
          <div className="sticky top-0 h-screen border-r border-glass-light-border bg-glass-light-2 backdrop-blur-xl dark:border-glass-dark-border dark:bg-glass-dark-1">
            <Sidebar collapsed={sidebarCollapsed} onToggleCollapse={toggleSidebar} />
          </div>
        </aside>

        <div className="flex-1 min-w-0 flex flex-col">
          <TopBar authed />
          <main id="main-content" className="flex-1 pb-20 lg:pb-0">
            {children}
          </main>
        </div>

        <BottomTabBar />
      </div>
    </PageBackground>
  );
}
