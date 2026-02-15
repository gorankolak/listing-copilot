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
      <header className="border-b border-[color:var(--color-border)] bg-[color:var(--color-surface)]/85 backdrop-blur-sm">
        <div className="page-container flex items-center justify-between py-4">
          <div>
            <p className="text-sm font-semibold text-[color:var(--color-text)]">Listing Copilot</p>
            <p className="text-xs text-[color:var(--color-text-muted)]">{user?.email ?? 'Signed in'}</p>
          </div>
          <nav className="flex items-center gap-4 text-sm">
            <NavLink
              to="/app"
              className={({ isActive }) =>
                isActive
                  ? 'font-semibold text-[color:var(--color-primary)]'
                  : 'text-[color:var(--color-text-muted)] hover:text-[color:var(--color-text)]'
              }
              end
            >
              Dashboard
            </NavLink>
            <Button type="button" onClick={handleLogout} disabled={isSigningOut}>
              {isSigningOut ? 'Logging out...' : 'Logout'}
            </Button>
          </nav>
        </div>
      </header>

      <main className="page-container py-8">
        {logoutError ? (
          <ErrorBanner
            className="mb-4"
            title="Logout failed"
            message={logoutError}
          />
        ) : null}
        <Outlet />
      </main>
    </div>
  )
}
