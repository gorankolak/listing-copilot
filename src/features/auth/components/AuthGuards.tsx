import { Navigate, Outlet, useLocation, useSearchParams } from 'react-router-dom'

import { AuthLoadingState } from './AuthLoadingState'
import { useAuth } from './useAuth'

function getSafeReturnTo(returnTo: string | null): string {
  if (!returnTo) {
    return '/app'
  }

  if (!returnTo.startsWith('/') || returnTo.startsWith('//')) {
    return '/app'
  }

  return returnTo
}

export function AuthGuard() {
  const { user, isLoading, error } = useAuth()
  const location = useLocation()

  if (isLoading) {
    return <AuthLoadingState />
  }

  if (error) {
    return (
      <div className="space-y-2">
        <p className="text-sm font-medium text-red-600">Unable to verify session.</p>
        <p className="text-xs text-gray-600">{error}</p>
      </div>
    )
  }

  if (!user) {
    const returnTo = `${location.pathname}${location.search}${location.hash}`
    return <Navigate to={`/login?returnTo=${encodeURIComponent(returnTo)}`} replace />
  }

  return <Outlet />
}

export function PublicOnlyGuard() {
  const { user, isLoading, error } = useAuth()
  const [searchParams] = useSearchParams()

  if (isLoading) {
    return <AuthLoadingState />
  }

  if (error) {
    return (
      <div className="space-y-2">
        <p className="text-sm font-medium text-red-600">Unable to verify session.</p>
        <p className="text-xs text-gray-600">{error}</p>
      </div>
    )
  }

  if (user) {
    const returnTo = getSafeReturnTo(searchParams.get('returnTo'))
    return <Navigate to={returnTo} replace />
  }

  return <Outlet />
}
