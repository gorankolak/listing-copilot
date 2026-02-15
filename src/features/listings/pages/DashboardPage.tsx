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
  const [showAllListings, setShowAllListings] = useState(false)
  const [toast, setToast] = useState<ToastMessage | null>(
    (location.state as { toast?: ToastMessage } | null)?.toast ?? null
  )
  const listingCount = listingsQuery.data?.length ?? 0
  const recentListings = (listingsQuery.data ?? []).slice(0, 3)
  const visibleListings = showAllListings ? listingsQuery.data ?? [] : recentListings

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
      <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-12 lg:items-start">
        <section aria-labelledby="generate-listing-heading" className="lg:col-span-5">
          <header className="mb-3">
            <h2 id="generate-listing-heading" className="text-lg font-semibold text-[color:var(--color-text)]">
              Generate listing
            </h2>
            <p className="mt-1 text-sm text-[color:var(--color-text-muted)]">
              Start with an image upload or paste details to generate listing copy.
            </p>
          </header>
          <ListingGenerator />
        </section>

        <section aria-labelledby="saved-listings-heading" className="lg:col-span-7">
          <header className="mb-3 flex items-center justify-between gap-2">
            <div>
              <h2 id="saved-listings-heading" className="text-lg font-semibold text-[color:var(--color-text)]">
                Recent listings
              </h2>
              <p className="mt-1 text-sm text-[color:var(--color-text-muted)]">
                Your latest saved drafts and generated listings.
              </p>
            </div>
            {listingCount > 3 && !showAllListings ? (
              <a
                href="#recent-listings"
                className="text-sm font-medium text-[color:var(--color-primary)] hover:underline"
                onClick={(event) => {
                  event.preventDefault()
                  setShowAllListings(true)
                }}
              >
                See all
              </a>
            ) : null}
          </header>

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
            <div
              className="mt-3 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3"
              aria-label="Loading listings"
            >
              <div className="surface-elevated overflow-hidden p-0">
                <Skeleton className="h-auto rounded-none" height="12rem" />
                <div className="space-y-2 p-4">
                  <Skeleton height="1rem" />
                  <Skeleton height="1rem" />
                  <Skeleton height="2rem" />
                </div>
              </div>
              <div className="surface-elevated overflow-hidden p-0">
                <Skeleton className="h-auto rounded-none" height="12rem" />
                <div className="space-y-2 p-4">
                  <Skeleton height="1rem" />
                  <Skeleton height="1rem" />
                  <Skeleton height="2rem" />
                </div>
              </div>
              <div className="surface-elevated overflow-hidden p-0 sm:col-span-2 xl:col-span-1">
                <Skeleton className="h-auto rounded-none" height="12rem" />
                <div className="space-y-2 p-4">
                  <Skeleton height="1rem" />
                  <Skeleton height="1rem" />
                  <Skeleton height="2rem" />
                </div>
              </div>
            </div>
          ) : null}

          {!listingsQuery.isLoading &&
          !listingsQuery.isError &&
          listingCount === 0 ? (
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
          listingCount > 0 ? (
            <div
              id="recent-listings"
              className="mt-3 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3"
            >
              {visibleListings.map((listing) => <ListingCard key={listing.id} listing={listing} />)}
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
