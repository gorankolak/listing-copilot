import { useState } from 'react'
import { Link, Outlet, useLocation } from 'react-router-dom'

import { authApi } from '../../features/auth/api'
import { useAuth } from '../../features/auth/components/useAuth'
import { buttonClassName } from '../ui/buttonClassName'
import { cn } from '../../lib/utils'
import { ProductLogo } from '../ui/ProductLogo'
import { ErrorBanner } from '../ui/ErrorBanner'
import {
  HeaderUserChip,
  headerNavButtonClassName,
  headerNavClassName,
  headerShellClassName,
} from './headerPrimitives'

export function PublicLayout() {
  const { user, isLoading } = useAuth()
  const { pathname, search } = useLocation()
  const [logoutError, setLogoutError] = useState<string | null>(null)
  const [isSigningOut, setIsSigningOut] = useState(false)
  const searchParams = new URLSearchParams(search)
  const returnTo = searchParams.get('returnTo')
  const returnToSearch = returnTo ? `?returnTo=${encodeURIComponent(returnTo)}` : ''
  const isLandingRoute = pathname === '/'

  async function handleLogout() {
    setLogoutError(null)
    setIsSigningOut(true)

    const { error } = await authApi.signOut()
    if (error) {
      setLogoutError(error.message)
      setIsSigningOut(false)
      return
    }

    setIsSigningOut(false)
  }

  return (
    <div className="min-h-screen bg-hero-gradient">
      <div className="page-container py-5 md:py-7">
        <header className={headerShellClassName}>
          <ProductLogo />
          <nav className={headerNavClassName}>
            {isLoading ? (
              <>
                <span
                  aria-hidden="true"
                  className="h-10 w-[5.75rem] animate-pulse rounded-[var(--radius-button)] border border-[color:var(--color-border)] bg-[color:var(--color-surface-muted)]"
                />
                <span
                  aria-hidden="true"
                  className="h-10 w-[7.75rem] animate-pulse rounded-[var(--radius-button)] border border-[color:var(--color-border)] bg-[color:var(--color-surface-muted)]"
                />
              </>
            ) : user ? (
              <>
                <Link
                  to="/app"
                  className={buttonClassName({
                    variant: 'primary',
                    size: 'sm',
                    className: headerNavButtonClassName,
                  })}
                >
                  Open app
                </Link>
                <HeaderUserChip email={user.email} />
                <button
                  type="button"
                  onClick={handleLogout}
                  disabled={isSigningOut}
                  className={buttonClassName({
                    variant: 'secondary',
                    size: 'sm',
                    className: headerNavButtonClassName,
                  })}
                >
                  {isSigningOut ? 'Logging out...' : 'Logout'}
                </button>
              </>
            ) : (
              <>
                <Link
                  to={`/login${returnToSearch}`}
                  className={buttonClassName({
                    variant: 'secondary',
                    size: 'sm',
                    className: headerNavButtonClassName,
                  })}
                >
                  Sign in
                </Link>
                <Link
                  to={`/signup${returnToSearch}`}
                  className={buttonClassName({
                    variant: 'primary',
                    size: 'sm',
                    className: headerNavButtonClassName,
                  })}
                >
                  Create account
                </Link>
              </>
            )}
          </nav>
          {logoutError ? (
            <ErrorBanner className="w-full" title="Logout failed" message={logoutError} />
          ) : null}
        </header>

        <main
          className={cn(
            isLandingRoute
              ? 'pb-14 md:pb-20'
              : 'mx-auto flex min-h-[calc(100vh-9.5rem)] max-w-[33rem] items-center justify-center py-8',
          )}
        >
          <Outlet />
        </main>
      </div>
    </div>
  )
}
