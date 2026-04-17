import { useState, useRef, useEffect, useMemo } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import {
  Home, Library, Search, Plus, FolderPlus, Folder,
  Settings, Trophy, LogOut, Sun, Moon, Monitor, Menu, X,
  PanelLeftClose, PanelLeftOpen, MessageCircle, ArrowRight,
} from 'lucide-react';
import { collection, query, where, limit, getDocs } from 'firebase/firestore';
import { db } from '../../core/firebase/firebase';
import { getDomain } from '../../core/constants/domains';
import Button from '../ui/Button';
import { Trans, useLingui } from '@lingui/react/macro';
import { useAuthStore } from '../../core/store/useAuthStore';
import { useThemeStore } from '../../core/store/useThemeStore';
import { useUIStore } from '../../core/store/useUIStore';
import { useTranslation } from '../../core/i18n';
import { useFolders } from '../../features/home/hooks/useFolders';
import { Footer } from './Footer';

// ── Sidebar primitives ────────────────────────────────────────────────────────
function SidebarLink({ to, icon: Icon, label, onClick, collapsed }) {
  return (
    <NavLink
      to={to}
      onClick={onClick}
      end
      title={collapsed ? label : undefined}
      className={({ isActive }) =>
        `group relative flex items-center gap-3 h-12 ${collapsed ? 'px-0 justify-center' : 'px-4'} rounded-2xl text-[15px] font-medium transition-all ${
          isActive
            ? 'bg-gradient-to-r from-brand-500/15 to-brand-500/5 text-brand-600 font-semibold'
            : 'text-ink-soft hover:text-ink hover:bg-surface-muted/50'
        }`
      }
    >
      {({ isActive }) => (
        <>
          {isActive && (
            <span className="absolute left-0 top-1/2 -translate-y-1/2 h-6 w-1 rounded-full bg-brand-500" aria-hidden />
          )}
          <Icon size={20} className={isActive ? 'text-brand-500' : ''} />
          {!collapsed && <span className="truncate">{label}</span>}
        </>
      )}
    </NavLink>
  );
}

function FolderRow({ folder, onClick }) {
  return (
    <NavLink
      to={`/folders/${folder.id}`}
      onClick={onClick}
      className={({ isActive }) =>
        `flex items-center gap-2.5 h-9 px-3 rounded-xl font-toon text-[13px] transition-colors ${
          isActive
            ? 'text-brand-600 font-semibold bg-brand-500/10'
            : 'text-ink-soft hover:text-ink hover:bg-surface-muted/40'
        }`
      }
    >
      <span className="flex h-6 w-6 items-center justify-center rounded-md bg-brand-500/15 text-brand-500">
        <Folder size={11} />
      </span>
      <span className="truncate">{folder.name}</span>
    </NavLink>
  );
}

function Sidebar({ onClose, collapsed = false, onToggleCollapse }) {
  const { t } = useTranslation();
  const { t: tMacro } = useLingui();
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
      console.error(err);
    }
  };

  return (
    <nav className="flex flex-col h-full p-3 gap-1" aria-label={tMacro`Navegación principal`}>
      <div className="flex items-center justify-between h-14 mb-3">
        <Link
          to="/home"
          onClick={onClose}
          className={`flex items-center gap-2 px-2 group ${collapsed ? 'justify-center w-full' : ''}`}
        >
          <span className="relative flex h-9 w-9 items-center justify-center rounded-2xl bg-gradient-to-br from-brand-400 via-brand-500 to-violet-500 text-white text-lg shadow-[0_4px_14px_-4px_rgba(14,165,233,0.6)] rotate-[-6deg] group-hover:rotate-[-12deg] transition-transform shrink-0">
            <span aria-hidden>🐬</span>
            <span className="absolute -top-1 -right-1 h-2.5 w-2.5 rounded-full bg-accent-amber ring-2 ring-surface" aria-hidden />
          </span>
          {!collapsed && (
            <span className="font-toon text-[22px] font-bold bg-gradient-to-r from-brand-500 via-violet-500 to-brand-600 bg-clip-text text-transparent tracking-tight leading-none">
              CertZen
            </span>
          )}
        </Link>
        {onToggleCollapse && !collapsed && (
          <button
            type="button"
            onClick={onToggleCollapse}
            className="hidden lg:flex h-8 w-8 items-center justify-center rounded-lg text-ink-muted hover:text-ink hover:bg-surface-muted/60 transition-colors"
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
          className="hidden lg:flex h-10 w-full items-center justify-center rounded-xl text-ink-muted hover:text-ink hover:bg-surface-muted/60 transition-colors mb-1"
          aria-label={tMacro`Expandir menú`}
          title={tMacro`Expandir menú`}
        >
          <PanelLeftOpen size={18} />
        </button>
      )}

      <SidebarLink to="/home"        icon={Home}    label={t('nav.home')}    onClick={onClose} collapsed={collapsed} />
      <SidebarLink to="/dashboard"   icon={Library} label={t('nav.library')} onClick={onClose} collapsed={collapsed} />
      <SidebarLink to="/explore"     icon={Search}  label={t('nav.explore')} onClick={onClose} collapsed={collapsed} />
      <SidebarLink to="/create-exam" icon={Plus}    label={t('nav.create')}  onClick={onClose} collapsed={collapsed} />

      {!collapsed && (
        <>
          <div className="mt-6 mb-2 px-3 text-[11px] font-toon font-semibold uppercase tracking-[0.18em] text-ink-faint">
            {t('nav.folders')}
          </div>
          {folders.length === 0 && !creatingFolder && (
            <p className="px-4 text-xs text-ink-muted leading-relaxed pb-1">
              {t('folders.empty')}
            </p>
          )}
          {folders.map((f) => (
            <FolderRow key={f.id} folder={f} onClick={onClose} />
          ))}
          {creatingFolder ? (
            <form onSubmit={handleCreateFolder} className="px-2 pt-1 flex gap-1">
              <input
                autoFocus
                type="text"
                value={folderName}
                onChange={(e) => setFolderName(e.target.value)}
                placeholder={t('folders.name')}
                className="flex-1 h-9 px-3 text-sm font-toon rounded-xl bg-surface-muted/60 border border-transparent focus:outline-none focus:border-brand-500 focus:bg-surface-card text-ink placeholder-ink-muted"
              />
              <button
                type="button"
                onClick={() => { setCreatingFolder(false); setFolderName(''); }}
                className="h-9 w-9 flex items-center justify-center rounded-xl text-ink-soft hover:bg-surface-muted/60"
                aria-label={t('common.cancel')}
              >
                <X size={14} />
              </button>
            </form>
          ) : (
            <button
              type="button"
              onClick={() => setCreatingFolder(true)}
              className="flex items-center gap-2.5 h-10 px-3 rounded-xl font-toon text-[14px] text-ink-muted hover:text-ink hover:bg-surface-muted/40 transition-colors"
            >
              <span className="flex h-7 w-7 items-center justify-center rounded-md border border-dashed border-ink-faint/50">
                <FolderPlus size={13} />
              </span>
              <span>{t('nav.newFolder')}</span>
            </button>
          )}
        </>
      )}

      <div className="mt-auto pt-4">
        <SidebarLink to="/pricing" icon={Trophy} label={t('nav.pricing')} onClick={onClose} collapsed={collapsed} />
      </div>
    </nav>
  );
}

// ── User menu ────────────────────────────────────────────────────────────────
function UserMenu() {
  const navigate = useNavigate();
  const { user, displayName, logout } = useAuthStore();
  const { mode, setMode } = useThemeStore();
  const { t } = useTranslation();
  const { t: tMacro } = useLingui();
  const [open, setOpen] = useState(false);
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
        className="h-10 w-10 rounded-full bg-gradient-to-br from-brand-400 via-brand-500 to-violet-500 text-white font-bold text-xs flex items-center justify-center ring-2 ring-white/40 dark:ring-white/10 hover:ring-brand-400/60 transition-all shadow-sm"
        aria-label={tMacro`Menú de usuario`}
        aria-expanded={open}
      >
        {user.photoURL ? (
          <img src={user.photoURL} alt="" className="h-10 w-10 rounded-full object-cover" />
        ) : (
          initials
        )}
      </button>
      {open && (
        <div
          className="absolute right-0 mt-2 w-64 rounded-2xl bg-surface-card/95 backdrop-blur-xl shadow-[0_10px_40px_-12px_rgba(0,0,0,0.25)] ring-1 ring-surface-border/60 z-50 overflow-hidden"
          role="menu"
        >
          <div className="px-4 py-3">
            <p className="text-sm font-semibold text-ink truncate">{displayName}</p>
            <p className="text-xs text-ink-muted truncate">{user.email}</p>
          </div>
          <div className="px-2 pb-2">
            <Link
              to="/profile"
              onClick={() => setOpen(false)}
              className="flex items-center gap-3 px-3 py-2 rounded-xl text-sm text-ink hover:bg-surface-muted/60 transition-colors"
              role="menuitem"
            >
              <Trophy size={16} className="text-ink-soft" />{t('nav.achievements')}
            </Link>
            <Link
              to="/settings"
              onClick={() => setOpen(false)}
              className="flex items-center gap-3 px-3 py-2 rounded-xl text-sm text-ink hover:bg-surface-muted/60 transition-colors"
              role="menuitem"
            >
              <Settings size={16} className="text-ink-soft" />{t('nav.settings')}
            </Link>
            <Link
              to="/contact"
              onClick={() => setOpen(false)}
              className="flex items-center gap-3 px-3 py-2 rounded-xl text-sm text-ink hover:bg-surface-muted/60 transition-colors"
              role="menuitem"
            >
              <MessageCircle size={16} className="text-ink-soft" /><Trans>Contáctenos</Trans>
            </Link>
          </div>

          <div className="mx-2 border-t border-surface-border/60" />

          <div className="px-2 py-2">
            <button
              type="button"
              onClick={cycleMode}
              className="w-full flex items-center justify-between gap-3 px-3 py-2 rounded-xl text-sm text-ink hover:bg-surface-muted/60 transition-colors"
              role="menuitem"
            >
              <span className="flex items-center gap-3">
                <ModeIcon size={16} className="text-ink-soft" />
                {t('settings.mode')}
              </span>
              <span className="text-xs font-medium text-brand-500">{modeLabel}</span>
            </button>
            <button
              type="button"
              onClick={async () => {
                setOpen(false);
                await logout();
                navigate('/');
              }}
              className="w-full flex items-center gap-3 px-3 py-2 rounded-xl text-sm text-red-500 hover:bg-red-500/10 transition-colors"
              role="menuitem"
            >
              <LogOut size={16} />{t('common.logout')}
            </button>
          </div>

          <div className="px-4 py-2 border-t border-surface-border/60 bg-surface-muted/20 flex items-center gap-3 text-[11px] text-ink-muted">
            <Link to="/privacy" onClick={() => setOpen(false)} className="hover:text-ink transition-colors" role="menuitem">
              <Trans>Privacidad</Trans>
            </Link>
            <span aria-hidden>·</span>
            <Link to="/terms" onClick={() => setOpen(false)} className="hover:text-ink transition-colors" role="menuitem">
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
      <mark className="bg-brand-500/20 text-ink rounded-sm not-italic">{text.slice(idx, idx + needle.length)}</mark>
      {text.slice(idx + needle.length)}
    </>
  );
}

// ── Topbar ───────────────────────────────────────────────────────────────────
function TopBar({ onToggleSidebar, authed }) {
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
    getDocs(query(collection(db, 'examSets'), where('published', '==', true), limit(200)))
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

  return (
    <header className={`sticky top-0 z-30 h-16 ${
      authed
        ? 'bg-surface'
        : 'border-b border-surface-border bg-white/90 backdrop-blur-xl'
    }`}>
      {authed ? (
        <div className="h-full flex items-center gap-3 px-4 sm:px-6">
          <button
            onClick={onToggleSidebar}
            className="lg:hidden h-10 w-10 flex items-center justify-center rounded-full text-ink-soft hover:bg-surface-muted/60 transition-colors"
            aria-label={tMacro`Abrir menú`}
          >
            <Menu size={20} />
          </button>
          <form onSubmit={onSubmit} className="flex-1 max-w-xl mx-auto relative" ref={containerRef} role="search">
            <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-ink-muted pointer-events-none" />
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
              className="h-11 w-full rounded-full bg-surface-card border border-surface-border px-11 text-sm text-ink placeholder-ink-soft ring-1 ring-transparent focus:outline-none focus:ring-brand-500/40 focus:border-brand-500/40 transition-all"
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
                className="absolute right-4 top-1/2 -translate-y-1/2 text-ink-soft hover:text-ink transition-colors"
                aria-label={tMacro`Limpiar búsqueda`}
              >
                <X size={14} />
              </button>
            )}
            {showSugg && suggestions.length > 0 && (
              <ul
                role="listbox"
                aria-label={tMacro`Sugerencias de búsqueda`}
                className="absolute z-50 top-full mt-1.5 left-0 w-full rounded-xl border border-surface-border bg-white shadow-lg overflow-hidden"
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
                      i === activeIdx ? 'bg-brand-500/10 text-brand-700' : 'text-ink hover:bg-surface-soft'
                    }`}
                  >
                    {s.kind === 'tag'
                      ? <span className="text-xs bg-surface-soft border border-surface-border rounded px-1.5 py-0.5 text-ink-soft shrink-0">#</span>
                      : (() => { const d = getDomain(s.domain); return <span className="text-base shrink-0" aria-hidden>{d.icon}</span>; })()
                    }
                    <SearchHighlight text={s.label} needle={q} />
                  </li>
                ))}
              </ul>
            )}
          </form>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => navigate('/create-exam')}
              className="hidden sm:flex h-10 w-10 rounded-full bg-gradient-to-br from-brand-400 to-brand-600 text-white items-center justify-center hover:shadow-[0_6px_20px_-6px_rgba(14,165,233,0.6)] transition-shadow"
              aria-label={tMacro`Crear examen`}
            >
              <Plus size={16} />
            </button>
            <UserMenu />
          </div>
        </div>
      ) : (
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-full flex items-center justify-between gap-4">
          <Link to="/" className="flex items-center gap-2 shrink-0" aria-label={tMacro`CertZen inicio`}>
            <div className="w-8 h-8 rounded-xl bg-brand-500 flex items-center justify-center shadow-brand">
              <span className="text-white font-black text-xs leading-none">CZ</span>
            </div>
            <span className="text-xl font-display font-black text-ink tracking-tight hidden sm:block">
              Cert<span className="text-brand-500">Zen</span>
            </span>
          </Link>
          <nav className="flex items-center gap-2">
            <Link to="/login">
              <Button variant="ghost" size="sm"><Trans>Ingresar</Trans></Button>
            </Link>
            <Link to="/register">
              <Button size="sm">
                <Trans>Registro gratis</Trans>
                <ArrowRight size={13} />
              </Button>
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
}

// ── Shell ────────────────────────────────────────────────────────────────────
export function AppShell({ children }) {
  const { user } = useAuthStore();
  const { sidebarCollapsed, toggleSidebar } = useUIStore();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Anonymous users → minimal shell (only soft topbar, no sidebar)
  if (!user) {
    return (
      <div className="min-h-screen bg-surface flex flex-col">
        <TopBar authed={false} />
        <main id="main-content" className="flex-1">{children}</main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-surface flex">
      {/* Desktop sidebar — borderless, collapsible */}
      <aside
        className={`hidden lg:block shrink-0 transition-[width] duration-200 ease-out ${
          sidebarCollapsed ? 'w-20' : 'w-64'
        }`}
      >
        <div className="sticky top-0 h-screen">
          <Sidebar collapsed={sidebarCollapsed} onToggleCollapse={toggleSidebar} />
        </div>
      </aside>

      {/* Mobile drawer */}
      {sidebarOpen && (
        <div className="lg:hidden fixed inset-0 z-40 flex">
          <div
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            onClick={() => setSidebarOpen(false)}
            aria-hidden="true"
          />
          <aside className="relative w-72 max-w-[85vw] bg-surface-card shadow-2xl rounded-r-3xl">
            <Sidebar onClose={() => setSidebarOpen(false)} />
          </aside>
        </div>
      )}

      <div className="flex-1 min-w-0 flex flex-col">
        <TopBar onToggleSidebar={() => setSidebarOpen(true)} authed />
        <main id="main-content" className="flex-1">
          {children}
        </main>
      </div>
    </div>
  );
}
