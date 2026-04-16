import { Link, useLocation } from 'react-router-dom';
import { useAuthStore } from '../../../core/store/useAuthStore';
import {
  LayoutDashboard, Users, ShieldCheck, FileQuestion, Library,
  Activity, Flag, ScrollText, GraduationCap, LogOut,
} from 'lucide-react';

const NAV = [
  { to: '/admin',                 label: 'Dashboard',      icon: LayoutDashboard, exact: true },
  { to: '/admin/users',           label: 'Usuarios',       icon: Users },
  { to: '/admin/exam-sets',       label: 'Sets comunidad', icon: Library },
  { to: '/admin/attempts',        label: 'Intentos',       icon: Activity },
  { to: '/admin/questions',       label: 'Banco oficial',  icon: FileQuestion },
  { to: '/admin/certifications',  label: 'Certificaciones',icon: GraduationCap },
  { to: '/admin/admins',          label: 'Administradores',icon: ShieldCheck },
  { to: '/admin/flags',           label: 'Feature flags',  icon: Flag },
  { to: '/admin/audit-log',       label: 'Audit log',      icon: ScrollText },
];

/**
 * Shared admin layout: top bar + left sidebar (desktop) or horizontal scroll
 * (mobile). Wraps every admin page for consistent navigation.
 */
export function AdminShell({ title, subtitle, actions, children }) {
  const { pathname } = useLocation();
  const user   = useAuthStore((s) => s.user);
  const logout = useAuthStore((s) => s.logout);

  const isActive = (item) =>
    item.exact ? pathname === item.to : pathname.startsWith(item.to);

  return (
    <div className="min-h-screen bg-surface-soft">
      {/* Topbar */}
      <header className="sticky top-0 z-20 bg-white/90 backdrop-blur-md border-b border-surface-border">
        <div className="flex items-center justify-between px-5 h-14">
          <div className="flex items-center gap-3">
            <Link to="/admin" className="flex items-center gap-2">
              <span className="text-xl">🧩</span>
              <span className="font-display font-bold text-ink text-sm hidden sm:inline">
                CertZen Admin
              </span>
            </Link>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-xs text-ink-muted hidden sm:inline">{user?.email}</span>
            <button
              onClick={logout}
              className="inline-flex items-center gap-1.5 text-xs text-ink-soft hover:text-ink border border-surface-border rounded-lg px-3 py-1.5 transition-colors"
            >
              <LogOut size={13} /> Salir
            </button>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar (desktop) / horizontal scroll (mobile) */}
        <aside className="w-56 shrink-0 border-r border-surface-border bg-white/60 min-h-[calc(100vh-3.5rem)] hidden lg:block">
          <nav className="py-5 px-3 flex flex-col gap-0.5">
            {NAV.map((item) => {
              const Icon = item.icon;
              const active = isActive(item);
              return (
                <Link
                  key={item.to}
                  to={item.to}
                  className={[
                    'flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm transition-colors',
                    active
                      ? 'bg-brand-500/10 text-brand-700 font-semibold'
                      : 'text-ink-soft hover:text-ink hover:bg-surface-muted',
                  ].join(' ')}
                >
                  <Icon size={16} />
                  {item.label}
                </Link>
              );
            })}
          </nav>
        </aside>

        {/* Mobile nav scroller */}
        <div className="lg:hidden w-full border-b border-surface-border bg-white/60 overflow-x-auto">
          <nav className="flex gap-1 px-3 py-2 whitespace-nowrap">
            {NAV.map((item) => {
              const Icon = item.icon;
              const active = isActive(item);
              return (
                <Link
                  key={item.to}
                  to={item.to}
                  className={[
                    'inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs transition-colors',
                    active
                      ? 'bg-brand-500/10 text-brand-700 font-semibold'
                      : 'text-ink-soft hover:text-ink hover:bg-surface-muted',
                  ].join(' ')}
                >
                  <Icon size={13} />
                  {item.label}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Main content */}
        <main className="flex-1 min-w-0 px-4 lg:px-8 py-6">
          <div className="max-w-6xl mx-auto">
            {(title || actions) && (
              <div className="flex items-start justify-between gap-4 mb-6 flex-wrap">
                <div>
                  {title && <h1 className="font-display font-bold text-ink text-2xl">{title}</h1>}
                  {subtitle && <p className="text-sm text-ink-soft mt-1">{subtitle}</p>}
                </div>
                {actions && <div className="flex items-center gap-2">{actions}</div>}
              </div>
            )}
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
