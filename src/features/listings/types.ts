export type Listing = {
  id: string
  user_id: string
  title: string
  description: string
  bullet_points: string[]
  image_url: string | null
  price_min: number | null
  price_max: number | null
  currency: string
  created_at: string
  updated_at: string
}

export type ListingDraft = {
  title: string
  description: string
  bullet_points: string[]
  price_min: number
  price_max: number
}

export type SaveListingInput = {
  draft: ListingDraft
  imageUrl: string | null
}
