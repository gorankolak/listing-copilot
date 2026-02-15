import { Link } from 'react-router-dom'

import { buttonClassName } from '../../../components/ui/Button'
import { Card } from '../../../components/ui/Card'
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

export function ListingCard({ listing }: ListingCardProps) {
  const minPrice = formatPrice(listing.price_min, listing.currency)
  const maxPrice = formatPrice(listing.price_max, listing.currency)
  const priceLabel =
    minPrice && maxPrice ? `${minPrice} - ${maxPrice}` : minPrice ?? maxPrice ?? 'N/A'

  return (
    <Card className="p-4">
      <h3 className="text-base font-semibold text-[color:var(--color-text)]">{listing.title}</h3>
      <p className="mt-1 text-sm text-[color:var(--color-text-muted)] line-clamp-2">{listing.description}</p>
      <p className="mt-2 text-xs text-[color:var(--color-text-muted)]">Price range: {priceLabel}</p>
      <p className="mt-1 text-xs text-[color:var(--color-text-muted)]">
        Created {new Date(listing.created_at).toLocaleString()}
      </p>
      <Link
        to={`/app/listings/${listing.id}`}
        className={buttonClassName({ variant: 'secondary', size: 'sm', className: 'mt-3' })}
      >
        Open listing
      </Link>
    </Card>
  )
}
