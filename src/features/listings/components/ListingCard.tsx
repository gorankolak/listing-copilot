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
      <div className="pointer-events-none absolute inset-0 rounded-xl bg-[linear-gradient(125deg,color-mix(in_srgb,var(--color-primary-start)_10%,transparent_90%)_0%,color-mix(in_srgb,var(--color-primary-end)_12%,transparent_88%)_100%)] opacity-0 transition-opacity duration-200 group-hover:opacity-100" />
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
          className="absolute right-3 top-3 border border-[color:color-mix(in_srgb,var(--color-surface)_72%,var(--color-border)_28%)] bg-[color:color-mix(in_srgb,var(--color-surface)_93%,transparent_7%)] text-[11px] tracking-wide backdrop-blur"
        >
          {status}
        </Badge>
      </div>
      <div className="relative min-w-0 space-y-3 p-4">
        <h3 className="line-clamp-1 break-words text-base font-semibold text-[color:var(--color-text)]">{listing.title}</h3>
        <p className="line-clamp-2 break-words text-sm text-[color:var(--color-text-muted)]">{listing.description}</p>
        <div className="flex items-center justify-between gap-2">
          <p className="text-xs font-medium text-[color:var(--color-text)]">{priceLabel}</p>
          <p className="text-xs text-[color:var(--color-text-muted)]">
            {new Date(listing.created_at).toLocaleDateString()}
          </p>
        </div>
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
