import { Link, useLocation } from 'react-router-dom';
import {
  LayoutDashboard, Users, Library,
  Activity, Flag, ScrollText, LogOut, Sparkles,
} from 'lucide-react';
import { useAuthStore } from '../../../core/store/useAuthStore';
import { PageBackground } from '../../../components/glass/PageBackground';
import { GlassBadge } from '../../../components/glass/GlassBadge';

const NAV = [
  { to: '/admin',           label: 'Dashboard',      shortLabel: 'Dashboard', icon: LayoutDashboard, exact: true },
  { to: '/admin/users',     label: 'Usuarios',       shortLabel: 'Usuarios',  icon: Users },
  { to: '/admin/exam-sets', label: 'Sets comunidad', shortLabel: 'Sets',      icon: Library },
  { to: '/admin/attempts',  label: 'Intentos',       shortLabel: 'Intentos',  icon: Activity },
  { to: '/admin/flags',     label: 'Feature flags',  shortLabel: 'Flags',     icon: Flag },
  { to: '/admin/audit-log', label: 'Audit log',      shortLabel: 'Audit',     icon: ScrollText },
];

function SidebarLink({ item, active }) {
  const Icon = item.icon;
  return (
    <Link
      to={item.to}
      className={[
        'flex items-center gap-2.5 h-11 px-3.5 rounded-xl text-sm font-medium transition-all',
        active
          ? 'bg-zen/15 text-zen font-semibold dark:bg-zen/25 dark:text-indigo-300'
          : 'text-zen-ink/70 hover:text-zen-ink hover:bg-glass-light-2 dark:text-white/70 dark:hover:text-white dark:hover:bg-glass-dark-2',
      ].join(' ')}
    >
      <Icon size={18} strokeWidth={2} />
      {item.label}
    </Link>
  );
}

/**
 * Shared admin layout (spec 05): topbar glass + sidebar fijo (desktop) o
 * bottom tab bar (mobile/tablet), fiel al patrón `Admin *` del diseño.
 * Wraps every admin page for consistent navigation.
 */
export function AdminShell({ title, subtitle, actions, children }) {
  const { pathname } = useLocation();
  const user   = useAuthStore((s) => s.user);
  const logout = useAuthStore((s) => s.logout);

  const isActive = (item) =>
    item.exact ? pathname === item.to : pathname.startsWith(item.to);

  return (
    <PageBackground>
      <div className="flex min-h-screen flex-col">
        {/* Topbar */}
        <header className="sticky top-0 z-20 h-16 border-b border-glass-light-border bg-glass-light-1 backdrop-blur-xl dark:border-glass-dark-border dark:bg-glass-dark-1">
          <div className="flex h-full items-center justify-between px-4 sm:px-6">
            <Link to="/admin" className="flex items-center gap-2.5" aria-label="CertZen Admin inicio">
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-zen bg-zen-brand">
                <Sparkles size={17} className="text-white" />
              </span>
              <span className="hidden text-lg font-bold tracking-tight sm:inline">CertZen</span>
              <GlassBadge tone="brand">Admin</GlassBadge>
            </Link>
            <div className="flex items-center gap-3">
              <span className="hidden max-w-[12rem] truncate text-xs text-zen-ink/60 sm:inline dark:text-white/60">
                {user?.email}
              </span>
              <button
                type="button"
                onClick={logout}
                className="inline-flex h-9 items-center gap-1.5 rounded-xl border border-glass-light-border bg-glass-light-2 px-3 text-xs font-medium text-zen-ink/80 backdrop-blur-md transition-colors hover:bg-glass-light-3 dark:border-glass-dark-border dark:bg-glass-dark-2 dark:text-white/80 dark:hover:bg-glass-dark-3"
              >
                <LogOut size={13} /> Salir
              </button>
            </div>
          </div>
        </header>

        <div className="flex flex-1">
          {/* Sidebar (desktop) */}
          <aside className="hidden w-56 shrink-0 border-r border-glass-light-border bg-glass-light-1 backdrop-blur-xl lg:block dark:border-glass-dark-border dark:bg-glass-dark-1">
            <nav className="sticky top-16 flex flex-col gap-1 p-3" aria-label="Navegación de administración">
              {NAV.map((item) => (
                <SidebarLink key={item.to} item={item} active={isActive(item)} />
              ))}
            </nav>
          </aside>

          {/* Main content */}
          <main className="min-w-0 flex-1 px-4 pb-24 pt-6 lg:px-8 lg:pb-8">
            <div className="mx-auto max-w-6xl">
              {(title || actions) && (
                <div className="mb-6 flex flex-wrap items-start justify-between gap-4">
                  <div>
                    {title && <h1 className="text-2xl font-bold tracking-tight">{title}</h1>}
                    {subtitle && <p className="mt-1 text-sm text-zen-ink/60 dark:text-white/60">{subtitle}</p>}
                  </div>
                  {actions && <div className="flex items-center gap-2">{actions}</div>}
                </div>
              )}
              {children}
            </div>
          </main>
        </div>

        {/* Bottom tab bar (mobile/tablet) */}
        <nav
          className="fixed inset-x-0 bottom-0 z-30 border-t border-glass-light-border bg-glass-light-3 pb-[env(safe-area-inset-bottom)] backdrop-blur-xl lg:hidden dark:border-glass-dark-border dark:bg-glass-dark-3"
          aria-label="Navegación de administración"
        >
          <div className="flex items-stretch justify-around">
            {NAV.map((item) => {
              const Icon = item.icon;
              const active = isActive(item);
              return (
                <Link
                  key={item.to}
                  to={item.to}
                  className={[
                    'flex min-h-[3rem] flex-1 flex-col items-center justify-center gap-0.5 py-2 text-[11px] font-medium transition-colors',
                    active ? 'text-zen dark:text-indigo-300' : 'text-zen-ink/50 dark:text-white/50',
                  ].join(' ')}
                >
                  <Icon size={20} strokeWidth={2} />
                  <span className="max-w-[4.5rem] truncate">{item.shortLabel}</span>
                </Link>
              );
            })}
          </div>
        </nav>
      </div>
    </PageBackground>
  );
}
