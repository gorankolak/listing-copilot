import { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'

import { EmptyState, EmptyStateActionLink } from '../../../components/ui/EmptyState'
import { ErrorBanner, ErrorBannerActionButton } from '../../../components/ui/ErrorBanner'
import { Skeleton } from '../../../components/ui/Skeleton'
import {
  Toast,
  ToastCloseButton,
  ToastDescription,
  ToastTitle,
  ToastViewport,
} from '../../../components/ui/Toast'
import { supabaseClient } from '../../../lib/supabaseClient'
import { SessionInvalidatedError } from '../api'
import { ListingGenerator } from '../components/ListingGenerator'
import { ListingCard } from '../components/ListingCard'
import { useListingsQuery } from '../queries'

type ToastVariant = 'info' | 'success' | 'warning' | 'error'
type ToastMessage = {
  variant?: ToastVariant
  title: string
  description?: string
}

export function DashboardPage() {
  const navigate = useNavigate()
  const location = useLocation()
  const listingsQuery = useListingsQuery()
  const [toast, setToast] = useState<ToastMessage | null>(
    (location.state as { toast?: ToastMessage } | null)?.toast ?? null
  )

  useEffect(() => {
    if ((location.state as { toast?: ToastMessage } | null)?.toast) {
      navigate(location.pathname, { replace: true, state: null })
    }
  }, [location.pathname, location.state, navigate])

  useEffect(() => {
    if (!(listingsQuery.error instanceof SessionInvalidatedError)) {
      return
    }

    const returnTo = `${location.pathname}${location.search}${location.hash}`
    void supabaseClient.auth.signOut().finally(() => {
      navigate(`/login?returnTo=${encodeURIComponent(returnTo)}`, {
        replace: true,
        state: {
          toast: {
            variant: 'warning',
            title: 'Session expired',
            description: 'Please sign in again to continue.',
          },
        },
      })
    })
  }, [
    listingsQuery.error,
    location.hash,
    location.pathname,
    location.search,
    navigate,
  ])

  return (
    <section>
      <h1 className="text-2xl font-semibold text-[color:var(--color-text)]">Dashboard</h1>
      <p className="mt-2 text-sm text-[color:var(--color-text-muted)]">
        Manage generated listings and review details.
      </p>
      <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
        <section aria-labelledby="generate-listing-heading">
          <h2 id="generate-listing-heading" className="sr-only">
            Generate listing
          </h2>
          <ListingGenerator />
        </section>

        <section aria-labelledby="saved-listings-heading">
          <h2 id="saved-listings-heading" className="text-lg font-semibold text-[color:var(--color-text)]">
            Saved listings
          </h2>

          {listingsQuery.isError ? (
            <ErrorBanner
              className="mt-3"
              title="Could not load your listings"
              message={listingsQuery.error instanceof Error ? listingsQuery.error.message : 'Please try again.'}
            >
              <ErrorBannerActionButton onClick={() => listingsQuery.refetch()}>
                Retry
              </ErrorBannerActionButton>
            </ErrorBanner>
          ) : null}

          {listingsQuery.isLoading ? (
            <div className="mt-3 space-y-3" aria-label="Loading listings">
              <Skeleton height="5rem" />
              <Skeleton height="5rem" />
              <Skeleton height="5rem" />
            </div>
          ) : null}

          {!listingsQuery.isLoading &&
          !listingsQuery.isError &&
          (listingsQuery.data?.length ?? 0) === 0 ? (
            <EmptyState
              className="mt-3"
              title="No saved listings yet"
              description="Generate your first listing to see it here."
            >
              <EmptyStateActionLink href="/app">Start a listing</EmptyStateActionLink>
            </EmptyState>
          ) : null}

          {!listingsQuery.isLoading &&
          !listingsQuery.isError &&
          (listingsQuery.data?.length ?? 0) > 0 ? (
            <div className="mt-3 space-y-3">
              {listingsQuery.data?.map((listing) => <ListingCard key={listing.id} listing={listing} />)}
            </div>
          ) : null}
        </section>
      </div>

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
