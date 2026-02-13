import { Navigate } from 'react-router-dom'

import { useAuth } from '../features/auth/components/useAuth'

export function NotFoundRedirect() {
  const { user, isLoading } = useAuth()

  if (isLoading) {
    return null
  }

  return <Navigate to={user ? '/app' : '/'} replace />
}
