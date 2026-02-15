import { useEffect, useId, useState } from 'react'
import { Link, useLocation, useNavigate, useParams } from 'react-router-dom'

import { Badge } from '../../../components/ui/Badge'
import { Button } from '../../../components/ui/Button'
import { Card, CardContent, CardHeader, CardTitle } from '../../../components/ui/Card'
import { EmptyState, EmptyStateActionLink } from '../../../components/ui/EmptyState'
import { ErrorBanner, ErrorBannerActionButton } from '../../../components/ui/ErrorBanner'
import { Skeleton } from '../../../components/ui/Skeleton'
import { buttonClassName } from '../../../components/ui/buttonClassName'
import { supabaseClient } from '../../../lib/supabaseClient'
import { SessionInvalidatedError } from '../api'
import { buildFormattedListing } from '../buildFormattedListing'
import { ListingThumbnail } from '../components/ListingThumbnail'
import { getListingStatus } from '../components/listingVisuals'
import { useDeleteListingMutation, useListingQuery } from '../queries'

function formatPrice(price: number | null, currency: string) {
  if (price === null) {
    return null
  }

  try {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency,
      maximumFractionDigits: 0,
    }).format(price)
  } catch {
    return `${currency} ${price}`
  }
}

function fallbackCopyToClipboard(text: string) {
  const textarea = document.createElement('textarea')
  textarea.value = text
  textarea.setAttribute('readonly', '')
  textarea.style.position = 'fixed'
  textarea.style.left = '-9999px'
  document.body.appendChild(textarea)
  textarea.focus()
  textarea.select()

  let isCopied = false
  try {
    isCopied = document.execCommand('copy')
  } finally {
    document.body.removeChild(textarea)
  }

  return isCopied
}

export function ListingDetailPage() {
  const navigate = useNavigate()
  const location = useLocation()
  const { id } = useParams<{ id: string }>()
  const listingQuery = useListingQuery(id)
  const deleteMutation = useDeleteListingMutation()
  const [copyStatus, setCopyStatus] = useState<string | null>(null)
  const [deleteError, setDeleteError] = useState<string | null>(null)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const copyStatusId = useId()
  const deleteErrorId = useId()
  const deleteDialogTitleId = useId()
  const deleteDialogDescriptionId = useId()

  useEffect(() => {
    if (!(listingQuery.error instanceof SessionInvalidatedError)) {
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
    listingQuery.error,
    location.hash,
    location.pathname,
    location.search,
    navigate,
  ])

  useEffect(() => {
    if (!isDeleteDialogOpen) {
      return
    }

    function handleEscape(event: KeyboardEvent) {
      if (event.key === 'Escape' && !deleteMutation.isPending) {
        setIsDeleteDialogOpen(false)
      }
    }

    window.addEventListener('keydown', handleEscape)
    return () => window.removeEventListener('keydown', handleEscape)
  }, [deleteMutation.isPending, isDeleteDialogOpen])

  if (!id) {
    return (
      <ErrorBanner
        title="Invalid listing route"
        message="No listing ID was provided. Please return to the dashboard."
      />
    )
  }
  const listingId = id

  if (listingQuery.isLoading) {
    return (
      <Card>
        <CardHeader>
          <Skeleton width="5rem" height="1.5rem" />
          <Skeleton height="2rem" />
        </CardHeader>
        <CardContent>
          <Skeleton height="1.5rem" />
          <Skeleton height="1.5rem" />
          <Skeleton height="7rem" />
        </CardContent>
      </Card>
    )
  }

  if (listingQuery.isError) {
    return (
      <ErrorBanner
        title="Could not load listing"
        message={listingQuery.error instanceof Error ? listingQuery.error.message : 'Please try again.'}
      >
        <ErrorBannerActionButton onClick={() => listingQuery.refetch()}>Retry</ErrorBannerActionButton>
      </ErrorBanner>
    )
  }

  if (!listingQuery.data) {
    return (
      <EmptyState
        title="Listing not found"
        description="The listing you are looking for may have been removed or never existed."
      >
        <EmptyStateActionLink href="/app">Back to dashboard</EmptyStateActionLink>
      </EmptyState>
    )
  }

  const listing = listingQuery.data
  const minPrice = formatPrice(listing.price_min, listing.currency)
  const maxPrice = formatPrice(listing.price_max, listing.currency)
  const priceLabel =
    minPrice && maxPrice ? `${minPrice} - ${maxPrice}` : minPrice ?? maxPrice ?? 'N/A'
  const status = getListingStatus(listing)

  async function handleCopy() {
    const listingText = buildFormattedListing({
      title: listing.title,
      description: listing.description,
      bullet_points: listing.bullet_points,
      price_min: listing.price_min ?? 0,
      price_max: listing.price_max ?? 0,
    })

    try {
      await navigator.clipboard.writeText(listingText)
      setCopyStatus('Listing copied to clipboard.')
      return
    } catch {
      if (fallbackCopyToClipboard(listingText)) {
        setCopyStatus('Listing copied to clipboard.')
        return
      }
    }

    setCopyStatus('Copy failed. Please copy manually.')
  }

  function handleDelete() {
    setDeleteError(null)
    setIsDeleteDialogOpen(true)
  }

  function handleConfirmDelete() {
    deleteMutation.mutate(listingId, {
      onSuccess: () => {
        setIsDeleteDialogOpen(false)
        navigate('/app', {
          replace: true,
          state: {
            toast: {
              variant: 'success',
              title: 'Listing deleted',
              description: 'The listing was removed successfully.',
            },
          },
        })
      },
      onError: (error) => {
        if (error instanceof SessionInvalidatedError) {
          const returnTo = `${location.pathname}${location.search}${location.hash}`
          void supabaseClient.auth.signOut().finally(() => {
            setIsDeleteDialogOpen(false)
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
          return
        }

        setIsDeleteDialogOpen(false)
        setDeleteError(error instanceof Error ? error.message : 'Failed to delete listing.')
      },
    })
  }

  return (
    <section>
      <h1 className="text-2xl font-semibold text-[color:var(--color-text)]">Listing details</h1>
      <Card className="mt-4">
        <CardHeader>
          <Badge variant={status === 'READY' ? 'success' : 'warning'}>{status}</Badge>
          <CardTitle className="mt-2 break-words">{listing.title}</CardTitle>
        </CardHeader>
        <CardContent>
          <section className="space-y-3">
            <ListingThumbnail
              className="aspect-video"
              title={listing.title}
              subtitle={priceLabel}
              src={listing.image_url}
              showFallbackLabel
              alt={`${listing.title} listing image`}
            />
            <div className="grid grid-cols-2 gap-2 md:grid-cols-3">
              <ListingThumbnail
                className="aspect-video"
                title={listing.title}
                subtitle="Front view"
                alt={`${listing.title} front view`}
              />
              <ListingThumbnail
                className="aspect-video"
                title={listing.title}
                subtitle="Detail view"
                alt={`${listing.title} detail view`}
              />
              <ListingThumbnail
                className="aspect-video"
                title={listing.title}
                subtitle="Context view"
                alt={`${listing.title} context view`}
              />
            </div>
          </section>

          <section className="grid gap-4 lg:grid-cols-[minmax(0,1.65fr)_minmax(0,1fr)]">
            <div className="space-y-4">
              <div className="rounded-xl border border-[color:var(--color-border)] bg-[color:var(--color-surface)] p-4">
                <h3 className="text-sm font-medium text-[color:var(--color-text)]">Description</h3>
                <p className="mt-2 break-words text-sm text-[color:var(--color-text-muted)]">{listing.description}</p>
              </div>
              <div className="rounded-xl border border-[color:var(--color-border)] bg-[color:var(--color-surface)] p-4">
                <h3 className="text-sm font-medium text-[color:var(--color-text)]">Bullet points</h3>
                {listing.bullet_points.length > 0 ? (
                  <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-[color:var(--color-text)]">
                    {listing.bullet_points.map((bullet, index) => (
                      <li key={`${listing.id}-${index}`}>{bullet}</li>
                    ))}
                  </ul>
                ) : (
                  <p className="mt-2 text-sm text-[color:var(--color-text-muted)]">No bullet points provided.</p>
                )}
              </div>
            </div>
            <aside className="surface-elevated rounded-xl p-4">
              <p className="text-xs font-semibold uppercase tracking-[0.1em] text-[color:var(--color-text-muted)]">
                Price range
              </p>
              <p className="mt-2 text-2xl font-semibold text-[color:var(--color-text)]">{priceLabel}</p>
              <p className="mt-2 text-sm text-[color:var(--color-text-muted)]">
                Created {new Date(listing.created_at).toLocaleString()}
              </p>
            </aside>
          </section>

          {copyStatus ? (
            <p
              id={copyStatusId}
              className="text-sm text-[color:var(--color-text-muted)]"
              role="status"
              aria-live="polite"
            >
              {copyStatus}
            </p>
          ) : null}
          {deleteError ? (
            <p id={deleteErrorId} className="text-sm text-[color:var(--color-danger)]" role="alert">
              {deleteError}
            </p>
          ) : null}
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
            <Button variant="secondary" size="sm" onClick={handleCopy}>
              Copy listing
            </Button>
            <Button
              variant="destructive"
              size="sm"
              onClick={handleDelete}
              disabled={deleteMutation.isPending}
            >
              {deleteMutation.isPending ? 'Deleting...' : 'Delete listing'}
            </Button>
            <Link
              to="/app"
              className={buttonClassName({ variant: 'ghost', size: 'sm', className: 'sm:ml-auto' })}
            >
              Back to dashboard
            </Link>
          </div>
        </CardContent>
      </Card>
      {isDeleteDialogOpen ? (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          role="presentation"
          onClick={() => {
            if (!deleteMutation.isPending) {
              setIsDeleteDialogOpen(false)
            }
          }}
        >
          <div
            className="absolute inset-0"
            style={{ background: 'color-mix(in srgb, var(--color-text) 42%, transparent)' }}
            aria-hidden="true"
          />
          <Card
            role="dialog"
            aria-modal="true"
            aria-labelledby={deleteDialogTitleId}
            aria-describedby={deleteDialogDescriptionId}
            className="relative w-full max-w-md space-y-5 p-6"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="space-y-2">
              <h2 id={deleteDialogTitleId} className="text-lg font-semibold text-[color:var(--color-text)]">
                Delete listing?
              </h2>
              <p id={deleteDialogDescriptionId} className="text-sm text-[color:var(--color-text-muted)]">
                This action cannot be undone. The listing and generated content will be permanently
                removed.
              </p>
            </div>
            <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
              <Button
                variant="secondary"
                size="sm"
                onClick={() => setIsDeleteDialogOpen(false)}
                disabled={deleteMutation.isPending}
                autoFocus
              >
                Cancel
              </Button>
              <Button
                variant="destructive"
                size="sm"
                onClick={handleConfirmDelete}
                disabled={deleteMutation.isPending}
              >
                {deleteMutation.isPending ? 'Deleting...' : 'Delete listing'}
              </Button>
            </div>
          </Card>
        </div>
      ) : null}
    </section>
  )
}
