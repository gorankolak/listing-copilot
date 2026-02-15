import { useEffect, useId, useState } from 'react'
import { Link, useLocation, useNavigate, useParams } from 'react-router-dom'

import { Badge } from '../../../components/ui/Badge'
import { Button, buttonClassName } from '../../../components/ui/Button'
import { Card, CardContent, CardHeader, CardTitle } from '../../../components/ui/Card'
import { EmptyState, EmptyStateActionLink } from '../../../components/ui/EmptyState'
import { ErrorBanner, ErrorBannerActionButton } from '../../../components/ui/ErrorBanner'
import { Skeleton } from '../../../components/ui/Skeleton'
import { supabaseClient } from '../../../lib/supabaseClient'
import { SessionInvalidatedError } from '../api'
import { buildFormattedListing } from '../buildFormattedListing'
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
  const copyStatusId = useId()
  const deleteErrorId = useId()

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
    const shouldDelete = window.confirm('Delete this listing? This action cannot be undone.')
    if (!shouldDelete) {
      return
    }

    deleteMutation.mutate(listingId, {
      onSuccess: () => {
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

        setDeleteError(error instanceof Error ? error.message : 'Failed to delete listing.')
      },
    })
  }

  return (
    <section>
      <h1 className="text-2xl font-semibold text-[color:var(--color-text)]">Listing details</h1>
      <Card className="mt-4">
        <CardHeader>
          <Badge>Saved</Badge>
          <CardTitle className="mt-2">{listing.title}</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-[color:var(--color-text-muted)]">{listing.description}</p>
          <div className="rounded-xl border border-[color:var(--color-border)] bg-[color:var(--color-surface-muted)] p-3">
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
          <div className="rounded-xl border border-[color:var(--color-border)] bg-[color:var(--color-surface-muted)] p-3">
            <h3 className="text-sm font-medium text-[color:var(--color-text)]">Price range</h3>
            <p className="mt-1 text-sm text-[color:var(--color-text)]">{priceLabel}</p>
          </div>
          <p className="text-xs text-[color:var(--color-text-muted)]">
            Created {new Date(listing.created_at).toLocaleString()}
          </p>
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
            <Button variant="secondary" size="sm" onClick={handleCopy} fullWidth>
              Copy listing
            </Button>
            <Button
              variant="destructive"
              size="sm"
              onClick={handleDelete}
              disabled={deleteMutation.isPending}
              fullWidth
            >
              {deleteMutation.isPending ? 'Deleting...' : 'Delete listing'}
            </Button>
            <Link to="/app" className={buttonClassName({ variant: 'ghost', size: 'sm', fullWidth: true })}>
              Back to dashboard
            </Link>
          </div>
        </CardContent>
      </Card>
    </section>
  )
}
