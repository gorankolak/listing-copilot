import { useEffect, useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'

import { buttonClassName } from '../../../components/ui/Button'
import { Card } from '../../../components/ui/Card'
import { EmptyState, EmptyStateActionLink } from '../../../components/ui/EmptyState'
import { ErrorBanner } from '../../../components/ui/ErrorBanner'
import { Skeleton } from '../../../components/ui/Skeleton'
import {
  Toast,
  ToastCloseButton,
  ToastDescription,
  ToastTitle,
  ToastViewport,
} from '../../../components/ui/Toast'
import { listingApi } from '../api'
import type { Listing } from '../types'

type ToastVariant = 'info' | 'success' | 'warning' | 'error'
type ToastMessage = {
  variant?: ToastVariant
  title: string
  description?: string
}

export function DashboardPage() {
  const navigate = useNavigate()
  const location = useLocation()
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [listings, setListings] = useState<Listing[]>([])
  const [toast, setToast] = useState<ToastMessage | null>(
    (location.state as { toast?: ToastMessage } | null)?.toast ?? null
  )

  useEffect(() => {
    if ((location.state as { toast?: ToastMessage } | null)?.toast) {
      navigate(location.pathname, { replace: true, state: null })
    }
  }, [location.pathname, location.state, navigate])

  useEffect(() => {
    let mounted = true

    async function loadListings() {
      try {
        setIsLoading(true)
        setError(null)
        const data = await listingApi.list()
        if (!mounted) return
        setListings(data)
      } catch {
        if (!mounted) return
        setError('Unable to load listings. Please try again.')
        setToast({
          variant: 'error',
          title: 'Failed to load listings',
          description: 'Please retry in a moment.',
        })
      } finally {
        if (mounted) {
          setIsLoading(false)
        }
      }
    }

    void loadListings()

    return () => {
      mounted = false
    }
  }, [])

  return (
    <section>
      <h1 className="text-2xl font-semibold">Dashboard</h1>
      <p className="mt-2 text-sm text-gray-600">Manage generated listings and review details.</p>

      {error ? (
        <ErrorBanner className="mt-4" title="Could not load your listings" message={error} />
      ) : null}

      {isLoading ? (
        <div className="mt-6 space-y-3" aria-label="Loading listings">
          <Skeleton height="5rem" />
          <Skeleton height="5rem" />
          <Skeleton height="5rem" />
        </div>
      ) : null}

      {!isLoading && !error && listings.length === 0 ? (
        <EmptyState
          className="mt-6"
          title="No saved listings yet"
          description="Generate your first listing to see it here."
        >
          <EmptyStateActionLink href="/app/listings/demo">Start a listing</EmptyStateActionLink>
        </EmptyState>
      ) : null}

      {!isLoading && !error && listings.length > 0 ? (
        <div className="mt-6 space-y-3">
          {listings.map((listing) => (
            <Card key={listing.id} className="p-4">
              <h2 className="text-base font-semibold text-gray-900">{listing.title}</h2>
              <p className="mt-1 text-sm text-gray-600">{listing.description}</p>
              <Link
                to={`/app/listings/${listing.id}`}
                className={buttonClassName({ variant: 'secondary', size: 'sm', className: 'mt-3' })}
              >
                Open listing
              </Link>
            </Card>
          ))}
        </div>
      ) : null}

      {toast ? (
        <ToastViewport>
          <Toast variant={toast.variant ?? 'info'}>
            <ToastTitle>{toast.title}</ToastTitle>
            {toast.description ? <ToastDescription>{toast.description}</ToastDescription> : null}
            <ToastCloseButton onClick={() => setToast(null)} />
          </Toast>
        </ToastViewport>
      ) : null}
    </section>
  )
}
