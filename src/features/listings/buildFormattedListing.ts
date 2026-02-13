import type { ListingDraft } from './types'

export function buildFormattedListing(draft: ListingDraft) {
  const title = draft.title.trim()
  const bullets = draft.bullet_points
    .map((bullet) => bullet.trim())
    .filter(Boolean)
    .map((bullet) => `- ${bullet}`)
    .join('\n')
  const description = draft.description.trim()
  const priceRange = `Price range: $${draft.price_min} - $${draft.price_max}`

  return [title, bullets, description, priceRange].filter(Boolean).join('\n\n')
}
