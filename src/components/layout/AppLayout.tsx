import { NavLink, Outlet } from 'react-router-dom'

import { useAuth } from '../../features/auth/components/useAuth'

export function AppLayout() {
  const { user } = useAuth()

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
          </nav>
        </div>
      </header>

      <main className="page-container py-8">
        <Outlet />
      </main>
    </div>
  )
}
