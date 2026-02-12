import { Link, Outlet } from 'react-router-dom'

export function PublicLayout() {
  return (
    <div className="page-container min-h-screen py-10">
      <header className="mb-8 flex items-center justify-between">
        <Link to="/" className="text-sm font-semibold text-gray-900">
          Listing Copilot
        </Link>
        <nav className="flex items-center gap-4 text-sm text-gray-600">
          <Link to="/login" className="hover:text-gray-900">
            Login
          </Link>
          <Link to="/signup" className="hover:text-gray-900">
            Sign up
          </Link>
        </nav>
      </header>

      <main className="flex min-h-[70vh] items-center justify-center">
        <Outlet />
      </main>
    </div>
  )
}
