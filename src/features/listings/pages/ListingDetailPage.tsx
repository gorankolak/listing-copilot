import { useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'

import { Badge } from '../../../components/ui/Badge'
import { Button, buttonClassName } from '../../../components/ui/Button'
import { Card, CardContent, CardHeader, CardTitle } from '../../../components/ui/Card'
import { EmptyState, EmptyStateActionLink } from '../../../components/ui/EmptyState'
import { ErrorBanner, ErrorBannerActionButton } from '../../../components/ui/ErrorBanner'
import { Skeleton } from '../../../components/ui/Skeleton'
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
  const { id } = useParams<{ id: string }>()
  const listingQuery = useListingQuery(id)
  const deleteMutation = useDeleteListingMutation()
  const [copyStatus, setCopyStatus] = useState<string | null>(null)
  const [deleteError, setDeleteError] = useState<string | null>(null)

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
        setDeleteError(error instanceof Error ? error.message : 'Failed to delete listing.')
      },
    })
  }

  return (
    <Card>
      <CardHeader>
        <Badge>Saved</Badge>
        <CardTitle className="mt-2">{listing.title}</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-gray-600">{listing.description}</p>
        <div className="rounded-md border border-gray-200 bg-gray-50 p-3">
          <p className="text-sm font-medium text-gray-700">Bullet points</p>
          {listing.bullet_points.length > 0 ? (
            <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-gray-900">
              {listing.bullet_points.map((bullet, index) => (
                <li key={`${listing.id}-${index}`}>{bullet}</li>
              ))}
            </ul>
          ) : (
            <p className="mt-2 text-sm text-gray-500">No bullet points provided.</p>
          )}
        </div>
        <div className="rounded-md border border-gray-200 bg-gray-50 p-3">
          <p className="text-sm font-medium text-gray-700">Price range</p>
          <p className="mt-1 text-sm text-gray-900">{priceLabel}</p>
        </div>
        <p className="text-xs text-gray-500">Created {new Date(listing.created_at).toLocaleString()}</p>
        {copyStatus ? <p className="text-sm text-gray-700">{copyStatus}</p> : null}
        {deleteError ? <p className="text-sm text-red-700">{deleteError}</p> : null}
        <div className="flex items-center gap-2">
          <Button variant="secondary" size="sm" onClick={handleCopy}>
            Copy listing
          </Button>
          <Button variant="danger" size="sm" onClick={handleDelete} disabled={deleteMutation.isPending}>
            {deleteMutation.isPending ? 'Deleting...' : 'Delete listing'}
          </Button>
          <Link to="/app" className={buttonClassName({ variant: 'ghost', size: 'sm' })}>
            Back to dashboard
          </Link>
        </div>
      </CardContent>
    </Card>
  )
}
