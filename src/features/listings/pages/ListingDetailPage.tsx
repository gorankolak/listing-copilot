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
      <div className="max-w-3xl">
        <p className="eyebrow w-fit rounded-full bg-[color:var(--color-warning-bg)] px-3 py-1 text-[color:var(--color-warning-text)]">
          Saved listing
        </p>
        <h1 className="workspace-heading mt-4 text-[color:var(--color-text)]">
          Listing details
        </h1>
        <p className="workspace-supporting-text mt-3 max-w-2xl">
          Review the saved draft, copy the final output, or remove it from the workspace.
        </p>
      </div>
      <Card className="relative mt-5 overflow-hidden p-0">
        <div aria-hidden="true" className="absolute inset-x-0 top-0 h-1 bg-[image:var(--gradient-primary)]" />
        <CardHeader className="px-6 pb-0 pt-7 md:px-7">
          <Badge variant={status === 'READY' ? 'success' : 'warning'}>{status}</Badge>
          <CardTitle className="mt-3 break-words text-[1.55rem] md:text-[1.9rem]">{listing.title}</CardTitle>
        </CardHeader>
        <CardContent className="px-6 pb-6 md:px-7 md:pb-7">
          <section className="grid grid-cols-12 gap-6">
            <div className="col-span-12 space-y-6 lg:col-span-8">
              <section className="surface-elevated p-5 sm:p-6">
                <div className="mx-auto w-full max-w-[420px]">
                  <ListingThumbnail
                    className="aspect-[4/3] w-full"
                    imageClassName="w-full object-contain"
                    title={listing.title}
                    subtitle={priceLabel}
                    src={listing.image_url}
                    showFallbackLabel
                    alt={`${listing.title} listing image`}
                  />
                </div>
              </section>

              <section className="rounded-md border border-gray-200 bg-gray-50 p-4">
                <div className="space-y-2.5">
                  <p className="text-xs uppercase tracking-wide text-gray-500">Bullet points</p>
                  {listing.bullet_points.length > 0 ? (
                    <ul className="list-disc space-y-3 pl-5 text-base leading-7 text-[color:var(--color-text)]">
                      {listing.bullet_points.map((bullet, index) => (
                        <li key={`${listing.id}-${index}`}>{bullet}</li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-base leading-7 text-[color:var(--color-text-secondary)]">
                      No bullet points provided.
                    </p>
                  )}
                </div>
              </section>

              <section className="panel-subtle p-5 sm:p-6">
                <div className="space-y-2.5">
                  <p className="text-xs uppercase tracking-wide text-gray-500">Description</p>
                  <p className="break-words text-base leading-7 text-[color:var(--color-text)]">
                    {listing.description}
                  </p>
                </div>
              </section>
            </div>

            <aside className="col-span-12 space-y-4 lg:col-span-4 lg:sticky lg:top-6 lg:self-start">
              <section className="surface-elevated p-5 sm:p-6">
                <p className="text-xs uppercase tracking-wide text-gray-500">Price</p>
                <p className="mt-3 text-3xl font-extrabold tracking-[-0.05em] text-[color:var(--color-text)]">
                  {priceLabel}
                </p>
                <p className="mt-3 text-base leading-7 text-[color:var(--color-text-secondary)]">
                  Created {new Date(listing.created_at).toLocaleString()}
                </p>
              </section>

              <section className="panel-subtle p-5 sm:p-6">
                <p className="text-xs uppercase tracking-wide text-gray-500">Metadata</p>
                <dl className="mt-4 space-y-3">
                  <div>
                    <dt className="muted-meta font-bold uppercase tracking-[0.14em]">Currency</dt>
                    <dd className="mt-1 text-base font-semibold text-[color:var(--color-text)]">
                      {listing.currency}
                    </dd>
                  </div>
                  <div>
                    <dt className="muted-meta font-bold uppercase tracking-[0.14em]">Status</dt>
                    <dd className="mt-1 text-base font-semibold text-[color:var(--color-text)]">
                      {status}
                    </dd>
                  </div>
                </dl>
              </section>

              <section className="panel-subtle p-5 sm:p-6">
                <p className="text-xs uppercase tracking-wide text-gray-500">Actions</p>
                <div className="mt-4 space-y-2.5">
                  <Button variant="primary" size="md" onClick={handleCopy} className="w-full">
                    Copy listing
                  </Button>
                  <Link
                    to="/app"
                    className={buttonClassName({
                      variant: 'secondary',
                      size: 'md',
                      className: 'w-full',
                    })}
                  >
                    Back to dashboard
                  </Link>
                  <Button
                    variant="destructive"
                    size="md"
                    onClick={handleDelete}
                    disabled={deleteMutation.isPending}
                    className="w-full"
                  >
                    {deleteMutation.isPending ? 'Deleting...' : 'Delete listing'}
                  </Button>
                </div>
              </section>
            </aside>
          </section>

          {copyStatus ? (
            <p
              id={copyStatusId}
              className="text-sm text-[color:var(--color-text-secondary)]"
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
                variant="danger-subtle"
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
