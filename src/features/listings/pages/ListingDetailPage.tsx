import { useEffect, useId, useState } from 'react'
import { Link, useLocation, useNavigate, useParams } from 'react-router-dom'

import { Badge } from '../../../components/ui/Badge'
import { Button } from '../../../components/ui/Button'
import { Card, CardContent, CardHeader } from '../../../components/ui/Card'
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
  }, [listingQuery.error, location.hash, location.pathname, location.search, navigate])

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
        message={
          listingQuery.error instanceof Error
            ? listingQuery.error.message
            : 'Please try again.'
        }
      >
        <ErrorBannerActionButton onClick={() => listingQuery.refetch()}>
          Retry
        </ErrorBannerActionButton>
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
    minPrice && maxPrice ? `${minPrice} - ${maxPrice}` : (minPrice ?? maxPrice ?? 'N/A')
  const status = getListingStatus(listing)
  const createdLabel = new Date(listing.created_at).toLocaleString()

  async function copyText(text: string, successMessage: string) {
    try {
      await navigator.clipboard.writeText(text)
      setCopyStatus(successMessage)
      return true
    } catch {
      if (fallbackCopyToClipboard(text)) {
        setCopyStatus(successMessage)
        return true
      }
    }

    setCopyStatus('Copy failed. Please copy manually.')
    return false
  }

  async function handleCopy() {
    const listingText = buildFormattedListing({
      title: listing.title,
      description: listing.description,
      bullet_points: listing.bullet_points,
      price_min: listing.price_min ?? 0,
      price_max: listing.price_max ?? 0,
    })

    await copyText(listingText, 'Listing copied to clipboard.')
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
        setDeleteError(
          error instanceof Error ? error.message : 'Failed to delete listing.',
        )
      },
    })
  }

  return (
    <section className="space-y-6">
      <header className="space-y-3">
        <Link
          to="/app"
          className="inline-flex items-center gap-2 text-sm font-medium text-[color:var(--color-text-muted)] transition-colors hover:text-[color:var(--color-text)]"
        >
          <svg viewBox="0 0 20 20" className="h-4 w-4" aria-hidden="true">
            <path
              fill="currentColor"
              d="M8.56 4.31a.75.75 0 0 1 0 1.06L4.94 9h10.31a.75.75 0 0 1 0 1.5H4.94l3.62 3.62a.75.75 0 1 1-1.06 1.06L2.6 10.28a.75.75 0 0 1 0-1.06L7.5 4.31a.75.75 0 0 1 1.06 0Z"
            />
          </svg>
          Back to workspace
        </Link>
        <div className="space-y-2">
          <div className="flex flex-wrap items-center gap-3">
            <h1 className="break-words text-2xl font-semibold tracking-[-0.045em] text-[color:var(--color-text)] md:text-3xl">
              {listing.title}
            </h1>
            <Badge variant={status === 'READY' ? 'success' : 'warning'}>{status}</Badge>
          </div>
          <p className="text-sm text-[color:var(--color-text-secondary)]">
            Review the saved draft, copy the final output, or remove it from the
            workspace.
          </p>
        </div>
      </header>

      <div className="grid grid-cols-12 gap-6">
        <div className="col-span-12 space-y-6 lg:col-span-8">
          <section className="surface-elevated overflow-hidden p-4 sm:p-5">
            <div
              aria-hidden="true"
              className="preview-media-gradient -mx-4 -mt-4 mb-4 h-1.5 sm:-mx-5 sm:-mt-5"
            />
            <div className="mx-auto w-full max-w-[44rem]">
              <ListingThumbnail
                className="aspect-[16/10] w-full"
                imageClassName="w-full object-contain p-4 transition-transform duration-200 hover:scale-[1.02] sm:p-5"
                title={listing.title}
                subtitle={priceLabel}
                src={listing.image_url}
                showFallbackLabel
                alt={`${listing.title} listing image`}
              />
            </div>
          </section>

          <section className="panel-subtle p-4 sm:p-5">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[color:var(--color-text-muted)]">
                Bullet points
              </p>
              {listing.bullet_points.length > 0 ? (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() =>
                    void copyText(
                      listing.bullet_points.map((bullet) => `- ${bullet}`).join('\n'),
                      'Bullet points copied to clipboard.',
                    )
                  }
                >
                  Copy bullet points
                </Button>
              ) : null}
            </div>
            <div className="mt-3 border-t border-[color:var(--color-border)] pt-3.5">
              {listing.bullet_points.length > 0 ? (
                <ul className="space-y-2.5 pl-5 text-sm leading-6 text-[color:var(--color-text)] marker:text-[color:var(--color-text-muted)]">
                  {listing.bullet_points.map((bullet, index) => (
                    <li key={`${listing.id}-${index}`}>{bullet}</li>
                  ))}
                </ul>
              ) : (
                <p className="text-sm leading-6 text-[color:var(--color-text-secondary)]">
                  No bullet points provided.
                </p>
              )}
            </div>
          </section>

          <section className="panel-subtle p-4 sm:p-5">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[color:var(--color-text-muted)]">
                Description
              </p>
              {listing.description.trim() ? (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() =>
                    void copyText(listing.description, 'Description copied to clipboard.')
                  }
                >
                  Copy description
                </Button>
              ) : null}
            </div>
            <div className="mt-3 border-t border-[color:var(--color-border)] pt-3.5">
              <p className="max-w-prose break-words text-sm leading-relaxed text-[color:var(--color-text)]">
                {listing.description}
              </p>
            </div>
          </section>
        </div>

        <aside className="col-span-12 lg:col-span-4">
          <div className="space-y-4 lg:sticky lg:top-6">
            <section className="surface-elevated p-5">
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[color:var(--color-text-muted)]">
                Info
              </p>
              <div className="mt-4">
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[color:var(--color-text-muted)]">
                  Price range
                </p>
                <p className="mt-2 text-3xl font-extrabold tracking-[-0.05em] text-[color:var(--color-text)]">
                  {priceLabel}
                </p>
              </div>

              <dl className="mt-4 space-y-3 border-t border-[color:var(--color-border)] pt-4">
                <div className="flex items-center justify-between gap-3 text-sm">
                  <dt className="text-[color:var(--color-text-muted)]">Currency</dt>
                  <dd className="font-semibold text-[color:var(--color-text)]">
                    {listing.currency}
                  </dd>
                </div>
                <div className="flex items-center justify-between gap-3 text-sm">
                  <dt className="text-[color:var(--color-text-muted)]">Status</dt>
                  <dd className="font-semibold text-[color:var(--color-text)]">
                    {status}
                  </dd>
                </div>
                <div className="flex items-start justify-between gap-3 text-sm">
                  <dt className="text-[color:var(--color-text-muted)]">Created</dt>
                  <dd className="max-w-[12rem] text-right font-medium text-[color:var(--color-text)]">
                    {createdLabel}
                  </dd>
                </div>
              </dl>
            </section>

            <section className="panel-subtle p-5">
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[color:var(--color-text-muted)]">
                Actions
              </p>
              <div className="mt-4 space-y-2.5">
                <Button
                  variant="primary"
                  size="md"
                  onClick={handleCopy}
                  className="w-full"
                >
                  Copy listing
                </Button>
                <Link
                  to="/app"
                  className={buttonClassName({
                    variant: 'ghost',
                    size: 'md',
                    className: 'w-full',
                  })}
                >
                  Back to workspace
                </Link>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={handleDelete}
                  disabled={deleteMutation.isPending}
                  className="w-full"
                >
                  {deleteMutation.isPending ? 'Deleting...' : 'Delete listing'}
                </Button>
              </div>
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
              <p
                id={deleteErrorId}
                className="text-sm text-[color:var(--color-danger)]"
                role="alert"
              >
                {deleteError}
              </p>
            ) : null}
          </div>
        </aside>
      </div>
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
            style={{
              background: 'color-mix(in srgb, var(--color-text) 42%, transparent)',
            }}
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
              <h2
                id={deleteDialogTitleId}
                className="text-lg font-semibold text-[color:var(--color-text)]"
              >
                Delete listing?
              </h2>
              <p
                id={deleteDialogDescriptionId}
                className="text-sm text-[color:var(--color-text-muted)]"
              >
                This action cannot be undone. The listing and generated content will be
                permanently removed.
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
