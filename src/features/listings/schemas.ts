import { z } from 'zod'

export const listingSchema = z.object({
  id: z.string(),
  user_id: z.string(),
  title: z.string(),
  description: z.string(),
  bullet_points: z.array(z.string()),
  image_url: z.string().nullable(),
  price_min: z.number().nullable(),
  price_max: z.number().nullable(),
  currency: z.string(),
  created_at: z.string(),
  updated_at: z.string(),
})

export const listingDraftSchema = z.object({
  title: z.string(),
  description: z.string(),
  bullet_points: z.array(z.string()),
  price_min: z.number(),
  price_max: z.number(),
})

export const generateListingResponseSchema = z.object({
  draft: listingDraftSchema,
})
