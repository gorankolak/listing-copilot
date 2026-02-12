import { z } from 'zod'

export const listingSchema = z.object({
  id: z.string(),
  title: z.string(),
  description: z.string(),
  bullet_points: z.array(z.string()),
  price_min: z.number(),
  price_max: z.number(),
})
