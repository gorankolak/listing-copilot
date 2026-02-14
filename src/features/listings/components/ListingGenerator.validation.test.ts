import { validateImageFile, validateTextInput } from './validation'

describe('ListingGenerator validation', () => {
  it('validates text input quality', () => {
    expect(validateTextInput('')).toBe('Enter product details to continue.')
    expect(validateTextInput('iphone used good condition')).toBe(
      'Input is too vague. Include concrete product details before generating.',
    )
    expect(validateTextInput('good used stuff and product with some accessories')).toBe(
      'Input is too vague. Include concrete product details before generating.',
    )
    expect(
      validateTextInput('Apple iPhone 14 Pro 256GB in excellent condition with box and charger'),
    ).toBeNull()
  })

  it('validates image file presence, type, and size', () => {
    expect(validateImageFile(null)).toBe('Select an image to continue.')
    expect(validateImageFile(new File(['content'], 'photo.gif', { type: 'image/gif' }))).toBe(
      'Use a JPG, PNG, or WEBP image.',
    )
    expect(
      validateImageFile(
        new File([new Uint8Array(10 * 1024 * 1024 + 1)], 'photo.jpg', {
          type: 'image/jpeg',
        }),
      ),
    ).toBe('Image must be 10MB or smaller.')
    expect(validateImageFile(new File(['ok'], 'photo.webp', { type: 'image/webp' }))).toBeNull()
  })
})
