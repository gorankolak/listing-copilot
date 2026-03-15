import { useState } from 'react'
import { NavLink, Outlet } from 'react-router-dom'

import { useAuth } from '../../features/auth/components/useAuth'
import { authApi } from '../../features/auth/api'
import { Button } from '../ui/Button'
import { ErrorBanner } from '../ui/ErrorBanner'

export function AppLayout() {
  const { user } = useAuth()
  const [logoutError, setLogoutError] = useState<string | null>(null)
  const [isSigningOut, setIsSigningOut] = useState(false)

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
    <div className="min-h-screen">
      <header className="border-b border-[color:var(--color-border)]/70 bg-[color:var(--color-background)]/92 backdrop-blur-sm">
        <div className="page-container py-4">
          <div className="section-shell flex flex-wrap items-center justify-between gap-x-4 gap-y-3 px-4 py-4 md:px-6">
            <div className="min-w-0 flex-1">
              <p className="text-base font-bold tracking-[-0.03em] text-[color:var(--color-text)]">ListingCopilot</p>
              <p className="text-xs font-bold uppercase tracking-[0.14em] text-[color:var(--color-text-muted)]">
                Seller workspace
              </p>
            </div>
            <nav className="flex w-full items-center justify-between gap-2 text-sm sm:w-auto sm:justify-end sm:gap-3">
              <NavLink
                to="/app"
                className={({ isActive }) =>
                  isActive
                    ? 'rounded-full bg-[color:var(--color-navy)] px-3 py-2 text-xs font-bold uppercase tracking-[0.12em] text-white'
                    : 'rounded-full px-3 py-2 text-xs font-bold uppercase tracking-[0.12em] text-[color:var(--color-text-muted)] hover:bg-[color:var(--color-surface-muted)] hover:text-[color:var(--color-text)]'
                }
                end
              >
                Listings
              </NavLink>
              <div className="flex min-w-0 items-center gap-2 rounded-full border border-[color:var(--color-border)] bg-[color:var(--color-surface-muted)] px-3 py-2">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[color:var(--color-accent)] text-[0.72rem] font-bold text-[color:var(--color-navy)]">
                  {(user?.email?.[0] ?? 'U').toUpperCase()}
                </div>
                <p className="max-w-[10rem] truncate text-sm font-semibold text-[color:var(--color-text)]">
                  {user?.email ?? 'Signed in'}
                </p>
              </div>
              <Button type="button" size="sm" variant="secondary" onClick={handleLogout} disabled={isSigningOut}>
                {isSigningOut ? 'Logging out...' : 'Logout'}
              </Button>
            </nav>
          </div>
          {logoutError ? <ErrorBanner className="mt-4" title="Logout failed" message={logoutError} /> : null}
        </div>
      </header>

      <main className="page-container py-8 md:py-10">
        <Outlet />
      </main>
    </div>
  )
}
