import { Navigate } from 'react-router-dom'
import { isAdminAuthenticated } from '../utils/adminAuth'

/**
 * Protected route component for admin dashboard
 * Checks authentication before allowing access
 * This component checks authentication SYNCHRONOUSLY before rendering anything
 */
export function ProtectedAdminRoute({ children }: { children: React.ReactElement }) {
  // Check authentication synchronously BEFORE any rendering or hooks
  // This check happens immediately when the component function is called
  const isAuthenticated = isAdminAuthenticated()

  // If not authenticated, redirect immediately
  // Navigate component will handle the redirect before children render
  if (!isAuthenticated) {
    return <Navigate to="/admin-login" replace />
  }

  // Only render children if authenticated
  return children
}


