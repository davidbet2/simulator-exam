import { Navigate } from 'react-router-dom';
import { useAuthStore } from '../store/useAuthStore';

/**
 * requireUser=true  → requires any authenticated user (redirect to /login)
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
    return user ? children : <Navigate to="/login" replace />;
  }

  // Admin gate: never reveal the admin login route to non-admins.
  // Unauthenticated users → home. Authenticated non-admin users → home.
  return isAdmin ? children : <Navigate to="/" replace />;
}
