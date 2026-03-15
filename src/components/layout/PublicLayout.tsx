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
      <div className="page-container py-5 md:py-7">
        <header className="section-shell sticky top-4 z-10 mb-8 flex flex-wrap items-center justify-between gap-x-4 gap-y-3 px-4 py-4 md:px-6">
          <Link to="/" className="min-w-0 text-[0.95rem] font-bold tracking-[-0.03em] text-[color:var(--color-text)]">
            <span className="sm:hidden">LC</span>
            <span className="hidden sm:inline">ListingCopilot</span>
          </Link>
          <nav className="flex w-full items-center justify-between gap-2 text-sm sm:w-auto sm:justify-end">
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
          </nav>
        </header>

        <main
          className={cn(
            isLandingRoute
              ? 'pb-14 md:pb-20'
              : 'mx-auto flex min-h-[calc(100vh-9.5rem)] max-w-[30rem] items-center justify-center py-8'
          )}
        >
          <Outlet />
        </main>
      </div>
    </div>
  )
}
