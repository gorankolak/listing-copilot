export type Listing = {
  id: string
  title: string
  description: string
  bullet_points: string[]
  price_min: number
  price_max: number
}

export type ListingDraft = Omit<Listing, 'id'>
