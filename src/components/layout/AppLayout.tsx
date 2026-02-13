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
      <header className="border-b border-gray-200 bg-white/80 backdrop-blur-sm">
        <div className="page-container flex items-center justify-between py-4">
          <div>
            <p className="text-sm font-semibold text-gray-900">Listing Copilot</p>
            <p className="text-xs text-gray-500">{user?.email ?? 'Signed in'}</p>
          </div>
          <nav className="flex items-center gap-4 text-sm">
            <NavLink
              to="/app"
              className={({ isActive }) =>
                isActive ? 'font-semibold text-blue-700' : 'text-gray-600 hover:text-gray-900'
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
