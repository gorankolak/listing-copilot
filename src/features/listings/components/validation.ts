const MAX_IMAGE_SIZE_BYTES = 10 * 1024 * 1024
export const ACCEPTED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp']

const TEXT_MODE_STOP_WORDS = new Set([
  'a',
  'an',
  'and',
  'any',
  'for',
  'from',
  'good',
  'great',
  'have',
  'in',
  'is',
  'it',
  'my',
  'nice',
  'on',
  'or',
  'product',
  'sale',
  'sell',
  'selling',
  'some',
  'stuff',
  'the',
  'this',
  'to',
  'used',
  'with',
])

export function validateTextInput(value: string) {
  const trimmedValue = value.trim()
  if (!trimmedValue) {
    return 'Enter product details to continue.'
  }

  const words = trimmedValue.split(/\s+/).filter(Boolean)
  if (words.length < 4 || trimmedValue.length < 20) {
    return 'Add specific details like brand, model, condition, and accessories.'
  }

  const meaningfulWords = words.filter((word) => {
    const normalized = word.toLowerCase().replace(/[^a-z0-9]/g, '')
    if (!normalized) {
      return false
    }
    return normalized.length > 2 && !TEXT_MODE_STOP_WORDS.has(normalized)
  })

  if (meaningfulWords.length < 3) {
    return 'Input is too vague. Include concrete product details before generating.'
  }

  return null
}

export function validateImageFile(file: File | null) {
  if (!file) {
    return 'Select an image to continue.'
  }

  if (!ACCEPTED_IMAGE_TYPES.includes(file.type)) {
    return 'Use a JPG, PNG, or WEBP image.'
  }

  if (file.size > MAX_IMAGE_SIZE_BYTES) {
    return 'Image must be 10MB or smaller.'
  }

  return null
}
