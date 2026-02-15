import { Link, Outlet, useLocation } from 'react-router-dom'

import { buttonClassName } from '../ui/buttonClassName'
import { cn } from '../../lib/utils'

export function PublicLayout() {
  const { pathname, search } = useLocation()
  const searchParams = new URLSearchParams(search)
  const returnTo = searchParams.get('returnTo')
  const returnToSearch = returnTo ? `?returnTo=${encodeURIComponent(returnTo)}` : ''
  const isLandingRoute = pathname === '/'

  return (
    <div className="min-h-screen bg-hero-gradient">
      <div className="page-container py-6 md:py-8">
        <header className="surface-elevated sticky top-4 z-10 mb-8 flex items-center justify-between px-4 py-3 md:px-5">
          <Link to="/" className="text-sm font-semibold tracking-tight text-[color:var(--color-text)]">
            ListingCopilot
          </Link>
          <nav className="flex items-center gap-2 text-sm">
            <Link
              to={`/login${returnToSearch}`}
              className={buttonClassName({ variant: 'ghost', size: 'sm' })}
            >
              Login
            </Link>
            <Link
              to={`/signup${returnToSearch}`}
              className={buttonClassName({ variant: 'primary', size: 'sm' })}
            >
              Get Started
            </Link>
          </nav>
        </header>

        <main
          className={cn(
            isLandingRoute
              ? 'pb-12 md:pb-16'
              : 'mx-auto flex min-h-[calc(100vh-9rem)] max-w-lg items-center justify-center py-8'
          )}
        >
          <Outlet />
        </main>
      </div>
    </div>
  )
}
