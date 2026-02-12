import { Navigate, Outlet, useLocation, useSearchParams } from 'react-router-dom'

import { useAuth } from './useAuth'

export function AuthGuard() {
  const { user, isLoading } = useAuth()
  const location = useLocation()

  if (isLoading) {
    return <p className="text-sm text-gray-500">Checking session...</p>
  }

  if (!user) {
    const returnTo = `${location.pathname}${location.search}`
    return <Navigate to={`/login?returnTo=${encodeURIComponent(returnTo)}`} replace />
  }

  return <Outlet />
}

export function PublicOnlyGuard() {
  const { user, isLoading } = useAuth()
  const [searchParams] = useSearchParams()

  if (isLoading) {
    return <p className="text-sm text-gray-500">Checking session...</p>
  }

  if (user) {
    const returnTo = searchParams.get('returnTo')
    return <Navigate to={returnTo || '/app'} replace />
  }

  return <Outlet />
}
