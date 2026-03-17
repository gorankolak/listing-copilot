import { useState } from 'react'
import { Link, Outlet, useLocation } from 'react-router-dom'

import { authApi } from '../../features/auth/api'
import { useAuth } from '../../features/auth/components/useAuth'
import { buttonClassName } from '../ui/buttonClassName'
import { cn } from '../../lib/utils'
import { ProductLogo } from '../ui/ProductLogo'
import { ErrorBanner } from '../ui/ErrorBanner'

export function PublicLayout() {
  const { user, isLoading } = useAuth()
  const { pathname, search } = useLocation()
  const [logoutError, setLogoutError] = useState<string | null>(null)
  const [isSigningOut, setIsSigningOut] = useState(false)
  const searchParams = new URLSearchParams(search)
  const returnTo = searchParams.get('returnTo')
  const returnToSearch = returnTo ? `?returnTo=${encodeURIComponent(returnTo)}` : ''
  const isLandingRoute = pathname === '/'
  const userInitial = (user?.email?.[0] ?? 'U').toUpperCase()

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
        <header className="section-shell sticky top-4 z-10 mb-8 flex flex-wrap items-center justify-between gap-x-4 gap-y-3 px-4 py-4 md:px-6">
          <ProductLogo />
          <nav className="flex w-full items-center justify-between gap-2 text-sm sm:w-auto sm:justify-end sm:gap-3">
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
                  className={buttonClassName({ variant: 'primary', size: 'sm' })}
                >
                  Open app
                </Link>
                <div className="flex min-w-0 items-center gap-2 rounded-[var(--radius-card-secondary)] border border-[color:var(--color-border)] bg-[color:var(--color-surface)] px-2.5 py-1.5">
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[color:var(--color-accent)] text-[0.72rem] font-bold text-[color:var(--color-navy)]">
                    {userInitial}
                  </div>
                  <p className="max-w-[10rem] truncate text-sm font-medium text-[color:var(--color-text-secondary)]">
                    {user.email ?? 'Signed in'}
                  </p>
                  <button
                    type="button"
                    onClick={handleLogout}
                    disabled={isSigningOut}
                    className={buttonClassName({
                      variant: 'ghost',
                      size: 'sm',
                      className: 'h-8 px-3 text-xs font-semibold',
                    })}
                  >
                    {isSigningOut ? 'Logging out...' : 'Logout'}
                  </button>
                </div>
              </>
            ) : (
              <>
                <Link
                  to={`/login${returnToSearch}`}
                  className={buttonClassName({ variant: 'secondary', size: 'sm' })}
                >
                  Sign in
                </Link>
                <Link
                  to={`/signup${returnToSearch}`}
                  className={buttonClassName({ variant: 'primary', size: 'sm' })}
                >
                  Create account
                </Link>
              </>
            )}
          </nav>
          {logoutError ? <ErrorBanner className="w-full" title="Logout failed" message={logoutError} /> : null}
        </header>

        <main
          className={cn(
            isLandingRoute
              ? 'pb-14 md:pb-20'
              : 'mx-auto flex min-h-[calc(100vh-9.5rem)] max-w-[33rem] items-center justify-center py-8'
          )}
        >
          <Outlet />
        </main>
      </div>
    </div>
  )
}
