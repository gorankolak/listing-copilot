type ListingLike = {
  title: string
  description: string
  bullet_points: string[]
  price_min: number | null
  price_max: number | null
}

function normalizeSvgText(value: string) {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
}

function truncateLabel(value: string, maxLength: number) {
  const normalized = value.trim().replace(/\s+/g, ' ')
  if (normalized.length <= maxLength) {
    return normalized
  }

  return `${normalized.slice(0, Math.max(maxLength - 3, 1)).trimEnd()}...`
}

function getTitleInitials(title: string) {
  const words = title.trim().split(/\s+/).filter(Boolean).slice(0, 2)
  if (words.length === 0) {
    return 'LC'
  }

  return words
    .map((word) => word.slice(0, 1).toUpperCase())
    .join('')
}

export function getListingStatus(listing: ListingLike) {
  const hasTitle = listing.title.trim().length > 0
  const hasDescription = listing.description.trim().length > 0
  const hasBullets = listing.bullet_points.some((bullet) => bullet.trim().length > 0)
  const hasPrice = listing.price_min !== null || listing.price_max !== null
  return hasTitle && hasDescription && hasBullets && hasPrice ? 'READY' : 'DRAFT'
}

export function createListingThumbnailDataUrl({
  title,
  subtitle,
}: {
  title: string
  subtitle: string
}) {
  const ariaTitle = normalizeSvgText(title.trim() || 'Listing')
  const safeTitle = normalizeSvgText(truncateLabel(title || 'Listing', 34))
  const safeSubtitle = normalizeSvgText(truncateLabel(subtitle || 'Generated preview', 40))
  const initials = normalizeSvgText(getTitleInitials(title))
  const svg = `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 360" role="img" aria-label="${ariaTitle}">
  <defs>
    <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#7c3aed" stop-opacity="0.88" />
      <stop offset="100%" stop-color="#2563eb" stop-opacity="0.88" />
    </linearGradient>
  </defs>
  <rect width="640" height="360" fill="#e8eefc" />
  <rect x="0" y="0" width="640" height="360" fill="url(#bg)" />
  <circle cx="130" cy="118" r="56" fill="rgba(255,255,255,0.26)" />
  <text x="130" y="132" text-anchor="middle" font-size="46" font-weight="700" font-family="Inter,Arial,sans-serif" fill="white">${initials}</text>
  <rect x="58" y="208" width="524" height="96" rx="18" fill="rgba(17,24,39,0.24)" />
  <text x="88" y="246" font-size="24" font-weight="700" font-family="Inter,Arial,sans-serif" fill="white">${safeTitle}</text>
  <text x="88" y="281" font-size="17" font-family="Inter,Arial,sans-serif" fill="rgba(255,255,255,0.9)">${safeSubtitle}</text>
</svg>`

  return `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svg)}`
}
