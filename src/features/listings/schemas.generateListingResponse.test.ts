import { generateListingResponseSchema } from './schemas'

describe('generateListingResponseSchema', () => {
  it('accepts a valid AI response payload', () => {
    const parsed = generateListingResponseSchema.safeParse({
      draft: {
        title: 'MacBook Pro 14',
        description: 'M1 Pro, 16GB RAM, 512GB SSD, excellent condition.',
        bullet_points: ['Original box included', 'Battery health 92%'],
        price_min: 1200,
        price_max: 1400,
      },
    })

    expect(parsed.success).toBe(true)
  })

  it('rejects malformed AI response payload', () => {
    const parsed = generateListingResponseSchema.safeParse({
      draft: {
        title: 'MacBook Pro 14',
        description: 'Missing required numeric values and wrong bullet type',
        bullet_points: 'not-an-array',
      },
    })

    expect(parsed.success).toBe(false)
  })
})
