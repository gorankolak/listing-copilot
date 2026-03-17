import { useState } from 'react'
import { NavLink, Outlet } from 'react-router-dom'

import { useAuth } from '../../features/auth/components/useAuth'
import { authApi } from '../../features/auth/api'
import { Button } from '../ui/Button'
import { buttonClassName } from '../ui/buttonClassName'
import { ErrorBanner } from '../ui/ErrorBanner'
import { ProductLogo } from '../ui/ProductLogo'
import {
  HeaderUserChip,
  headerNavButtonClassName,
  headerNavClassName,
  headerShellClassName,
} from './headerPrimitives'

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
      <div className="page-container py-5 md:py-7">
        <header className={headerShellClassName}>
          <ProductLogo contextLabel="Workspace" />
          <nav className={headerNavClassName}>
            <NavLink
              to="/app"
              className={({ isActive }) =>
                buttonClassName({
                  variant: isActive ? 'secondary' : 'ghost',
                  size: 'sm',
                  className: [
                    headerNavButtonClassName,
                    isActive
                      ? 'border-[color:var(--color-border-strong)] bg-[color:var(--color-surface-muted)] text-[color:var(--color-text)]'
                      : 'text-[color:var(--color-text-secondary)]',
                  ].join(' '),
                })
              }
              end
            >
              Listings
            </NavLink>
            <HeaderUserChip email={user?.email} />
            <Button
              type="button"
              size="sm"
              variant="secondary"
              onClick={handleLogout}
              disabled={isSigningOut}
              className={headerNavButtonClassName}
            >
              {isSigningOut ? 'Logging out...' : 'Logout'}
            </Button>
          </nav>
          {logoutError ? (
            <ErrorBanner className="mt-4" title="Logout failed" message={logoutError} />
          ) : null}
        </header>
      </div>

      <main className="page-container pb-8 pt-5 md:pb-10 md:pt-5">
        <Outlet />
      </main>
    </div>
  )
}
