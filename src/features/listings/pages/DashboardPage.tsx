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
  const [hasDraftPreview, setHasDraftPreview] = useState(false)
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
      <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
        <div className="max-w-2xl">
          <p className="eyebrow w-fit rounded-full bg-[color:var(--color-warning-bg)] px-3 py-1 text-[color:var(--color-warning-text)]">
            Listing workspace
          </p>
          <h1 className="mt-4 text-[2.3rem] font-bold tracking-[-0.05em] text-[color:var(--color-text)] md:text-[3.2rem]">
            Generate, polish, and save stronger listings.
          </h1>
          <p className="mt-3 text-base leading-7 text-[color:var(--color-text-secondary)]">
            Start from an image or rough notes, review the output beside it, then save the final draft.
          </p>
        </div>
        <div className="grid grid-cols-3 gap-3 sm:w-auto">
          <div className="rounded-[var(--radius-card)] border border-[color:var(--color-border)] bg-[color:var(--color-surface)] px-4 py-3 shadow-[var(--shadow-sm)]">
            <p className="text-2xl font-bold tracking-[-0.04em] text-[color:var(--color-text)]">{listingCount}</p>
            <p className="text-[11px] font-bold uppercase tracking-[0.12em] text-[color:var(--color-text-muted)]">Saved</p>
          </div>
          <div className="rounded-[var(--radius-card)] border border-[color:var(--color-border)] bg-[color:var(--color-surface)] px-4 py-3 shadow-[var(--shadow-sm)]">
            <p className="text-2xl font-bold tracking-[-0.04em] text-[color:var(--color-text)]">{hasDraftPreview ? '1' : '0'}</p>
            <p className="text-[11px] font-bold uppercase tracking-[0.12em] text-[color:var(--color-text-muted)]">Active draft</p>
          </div>
          <div className="rounded-[var(--radius-card)] border border-[color:var(--color-border)] bg-[color:var(--color-surface)] px-4 py-3 shadow-[var(--shadow-sm)]">
            <p className="text-2xl font-bold tracking-[-0.04em] text-[color:var(--color-text)]">2</p>
            <p className="text-[11px] font-bold uppercase tracking-[0.12em] text-[color:var(--color-text-muted)]">Modes</p>
          </div>
        </div>
      </div>

      <div className="mt-8 grid grid-cols-1 gap-6 xl:grid-cols-[minmax(0,0.92fr)_minmax(0,1.08fr)] xl:items-start">
        <section aria-labelledby="generate-listing-heading" className="min-w-0">
          <header className="mb-4">
            <p className="eyebrow w-fit text-[color:var(--color-text-muted)]">Input</p>
            <h2 id="generate-listing-heading" className="mt-2 text-2xl font-bold tracking-[-0.04em] text-[color:var(--color-text)]">
              Generate a listing draft
            </h2>
            <p className="mt-2 text-sm leading-6 text-[color:var(--color-text-secondary)]">
              Add an image or text notes, then generate a structured draft for the editor.
            </p>
          </header>
          <ListingGenerator
            previewPortalId="dashboard-listing-preview-slot"
            onDraftPresenceChange={setHasDraftPreview}
          />
        </section>

        <section aria-labelledby="listing-preview-heading" className="min-w-0">
          <header className="mb-4">
            <p className="eyebrow w-fit text-[color:var(--color-text-muted)]">Output</p>
            <h2 id="listing-preview-heading" className="mt-2 text-2xl font-bold tracking-[-0.04em] text-[color:var(--color-text)]">
              Preview and editor
            </h2>
            <p className="mt-2 text-sm leading-6 text-[color:var(--color-text-secondary)]">
              This is the core workflow: inspect the draft, tighten copy, then save or copy it.
            </p>
          </header>
          {!hasDraftPreview ? (
            <div className="section-shell practical-grid p-8 text-center md:p-10">
              <span className="mx-auto inline-flex h-14 w-14 items-center justify-center rounded-full border border-[color:var(--color-border)] bg-[color:var(--color-surface)] text-[color:var(--color-primary)] shadow-[var(--shadow-sm)]">
                <svg viewBox="0 0 24 24" className="h-6 w-6" aria-hidden="true">
                  <path
                    fill="currentColor"
                    d="M4 5a2 2 0 0 1 2-2h9l5 5v11a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V5Zm2 0v14h12V9h-4a2 2 0 0 1-2-2V5H6Zm8 0v2h2l-2-2ZM8 12a1 1 0 0 1 1-1h6a1 1 0 1 1 0 2H9a1 1 0 0 1-1-1Zm0 4a1 1 0 0 1 1-1h4a1 1 0 1 1 0 2H9a1 1 0 0 1-1-1Z"
                  />
                </svg>
              </span>
              <h3 className="mt-4 text-xl font-bold tracking-[-0.03em] text-[color:var(--color-text)]">
                Your draft editor appears here
              </h3>
              <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-[color:var(--color-text-secondary)]">
                Add product input on the left and generate a draft to begin the polish-and-save workflow.
              </p>
            </div>
          ) : null}
          <div id="dashboard-listing-preview-slot" />
        </section>
      </div>

      <section aria-labelledby="saved-listings-heading" className="mt-10">
        <header className="mb-4 flex items-center justify-between gap-2">
          <div>
            <p className="eyebrow w-fit text-[color:var(--color-text-muted)]">Library</p>
            <h2 id="saved-listings-heading" className="mt-2 text-2xl font-bold tracking-[-0.04em] text-[color:var(--color-text)]">
              Recent listings
            </h2>
            <p className="mt-2 text-sm leading-6 text-[color:var(--color-text-secondary)]">
              Saved drafts and finished listings from your workspace.
            </p>
          </div>
          {listingCount > 3 && !showAllListings ? (
            <a
              href="#recent-listings"
              className="text-sm font-semibold text-[color:var(--color-primary)] hover:underline"
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
            description="Generate your first listing to build out the workspace library."
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
