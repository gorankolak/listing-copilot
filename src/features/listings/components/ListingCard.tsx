import { Link } from 'react-router-dom'

import { buttonClassName } from '../../../components/ui/buttonClassName'
import { Badge } from '../../../components/ui/Badge'
import { Card } from '../../../components/ui/Card'
import { ListingThumbnail } from './ListingThumbnail'
import { getListingStatus } from './listingVisuals'
import type { Listing } from '../types'

type ListingCardProps = {
  listing: Listing
}

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

export function ListingCardV2({ listing }: ListingCardProps) {
  const minPrice = formatPrice(listing.price_min, listing.currency)
  const maxPrice = formatPrice(listing.price_max, listing.currency)
  const priceLabel =
    minPrice && maxPrice ? `${minPrice} - ${maxPrice}` : minPrice ?? maxPrice ?? 'N/A'
  const status = getListingStatus(listing)
  const statusVariant = status === 'READY' ? 'success' : 'warning'

  return (
    <Card className="group relative overflow-hidden p-0 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[var(--shadow-md)]">
      <div className="overlay-gradient-soft pointer-events-none absolute inset-0 rounded-[var(--radius-card)] opacity-0 transition-opacity duration-200 group-hover:opacity-100" />
      <div className="relative">
        <ListingThumbnail
          className="aspect-video rounded-none border-0 border-b"
          title={listing.title}
          subtitle={priceLabel}
          src={listing.image_url}
          showFallbackLabel
          alt={`${listing.title} listing thumbnail`}
        />
        <Badge
          variant={statusVariant}
          className="absolute right-3 top-3 border border-[color:color-mix(in_srgb,var(--color-surface)_72%,var(--color-border)_28%)] bg-[color:color-mix(in_srgb,var(--color-surface)_93%,transparent_7%)] backdrop-blur"
        >
          {status}
        </Badge>
      </div>
      <div className="relative min-w-0 space-y-3 p-4">
        <div className="flex items-start justify-between gap-3">
          <h3 className="line-clamp-2 break-words text-lg font-bold leading-tight tracking-[-0.03em] text-[color:var(--color-text)]">
            {listing.title}
          </h3>
          <p className="shrink-0 text-xs font-bold uppercase tracking-[0.1em] text-[color:var(--color-text-muted)]">
            {new Date(listing.created_at).toLocaleDateString()}
          </p>
        </div>
        <p className="text-sm font-semibold text-[color:var(--color-text)]">{priceLabel}</p>
        <p className="line-clamp-2 break-words text-sm leading-6 text-[color:var(--color-text-secondary)]">{listing.description}</p>
        <Link
          to={`/app/listings/${listing.id}`}
          className={buttonClassName({
            variant: 'secondary',
            size: 'sm',
            fullWidth: true,
          })}
        >
          Open listing
        </Link>
      </div>
    </Card>
  )
}

export const ListingCard = ListingCardV2
