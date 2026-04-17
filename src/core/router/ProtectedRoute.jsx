import { Navigate } from 'react-router-dom';
import { useAuthStore } from '../store/useAuthStore';

/**
 * requireUser=true  → requires any authenticated user (redirect to /login)
 *                     Email/password users must also have a verified email.
 * requireUser=false → requires admin role. Non-admins are silently sent to `/`
 *                     so the admin area is not discoverable by enumeration.
 */
export function ProtectedRoute({ children, requireUser = false }) {
  const { isAdmin, user, isLoading } = useAuthStore();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-surface">
        <div className="w-8 h-8 rounded-full border-2 border-brand-500 border-t-transparent animate-spin" role="status" aria-label="Cargando" />
      </div>
    );
  }

  if (requireUser) {
    if (!user) return <Navigate to="/login" replace />;
    // Only enforce email verification for email/password accounts.
    // OAuth providers (Google) already verify the address themselves.
    const isPasswordAccount = user.providerData?.some(p => p.providerId === 'password');
    if (isPasswordAccount && !user.emailVerified) {
      return <Navigate to="/verify-email" replace />;
    }
    return children;
  }

  // Admin gate: never reveal the admin login route to non-admins.
  // Unauthenticated users → home. Authenticated non-admin users → home.
  return isAdmin ? children : <Navigate to="/" replace />;
}
