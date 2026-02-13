import { Navigate, Outlet, useLocation, useSearchParams } from 'react-router-dom'

import { ErrorBanner } from '../../../components/ui/ErrorBanner'
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
      <ErrorBanner title="Unable to verify session" message={error} />
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
      <ErrorBanner title="Unable to verify session" message={error} />
    )
  }

  if (user) {
    const returnTo = getSafeReturnTo(searchParams.get('returnTo'))
    return <Navigate to={returnTo} replace />
  }

  return <Outlet />
}
