import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import type { User } from '@supabase/supabase-js'
import { MemoryRouter } from 'react-router-dom'

import { AuthContext, type AuthContextValue } from '../../auth/components/AuthContext'
import { ListingGenerator } from './ListingGenerator'

const {
  generateListingMock,
  uploadInputImageMock,
  saveListingMutateMock,
  localStorageGetItemMock,
  localStorageSetItemMock,
  localStorageRemoveItemMock,
} = vi.hoisted(() => ({
  generateListingMock: vi.fn(),
  uploadInputImageMock: vi.fn(),
  saveListingMutateMock: vi.fn(),
  localStorageGetItemMock: vi.fn(),
  localStorageSetItemMock: vi.fn(),
  localStorageRemoveItemMock: vi.fn(),
}))

vi.mock('../api', () => ({
  SessionInvalidatedError: class SessionInvalidatedError extends Error {},
  listingApi: {
    generateListing: generateListingMock,
    uploadInputImage: uploadInputImageMock,
  },
}))

vi.mock('../queries', () => ({
  useSaveListingMutation: () => ({
    mutate: saveListingMutateMock,
    isPending: false,
  }),
}))

function renderListingGenerator() {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
      mutations: { retry: false },
    },
  })

  const authValue: AuthContextValue = {
    session: { user: { id: 'user-1' } as User } as AuthContextValue['session'],
    user: { id: 'user-1' } as User,
    isLoading: false,
    error: null,
  }

  return render(
    <QueryClientProvider client={queryClient}>
      <MemoryRouter>
        <AuthContext.Provider value={authValue}>
          <ListingGenerator />
        </AuthContext.Provider>
      </MemoryRouter>
    </QueryClientProvider>,
  )
}

describe('ListingGenerator image consistency', () => {
  beforeEach(() => {
    generateListingMock.mockReset()
    uploadInputImageMock.mockReset()
    saveListingMutateMock.mockReset()
    localStorageGetItemMock.mockReset().mockReturnValue(null)
    localStorageSetItemMock.mockReset()
    localStorageRemoveItemMock.mockReset()

    vi.stubGlobal('localStorage', {
      getItem: localStorageGetItemMock,
      setItem: localStorageSetItemMock,
      removeItem: localStorageRemoveItemMock,
    })
    Object.defineProperty(URL, 'createObjectURL', {
      configurable: true,
      writable: true,
      value: vi.fn(() => 'blob:test'),
    })
    Object.defineProperty(URL, 'revokeObjectURL', {
      configurable: true,
      writable: true,
      value: vi.fn(),
    })
  })

  afterEach(() => {
    vi.unstubAllGlobals()
  })

  it('does not overwrite current draft image when image regenerate fails', async () => {
    generateListingMock
      .mockResolvedValueOnce({
        title: 'Generated from text',
        description: 'Solid product description with concrete details.',
        bullet_points: ['One', 'Two'],
        price_min: 100,
        price_max: 140,
      })
      .mockRejectedValueOnce(new Error('Listing generation failed.'))

    uploadInputImageMock.mockResolvedValueOnce('https://cdn.example.com/new-image.jpg')

    renderListingGenerator()

    fireEvent.click(screen.getByRole('button', { name: 'Text' }))
    fireEvent.change(screen.getByLabelText('Product details'), {
      target: {
        value:
          'Apple iPhone 14 Pro 256GB in excellent condition with box and charger.',
      },
    })
    fireEvent.click(screen.getByRole('button', { name: 'Generate listing' }))

    await waitFor(() => expect(generateListingMock).toHaveBeenCalledTimes(1))
    await screen.findByRole('button', { name: 'Save listing' })
    await waitFor(() =>
      expect(screen.getByRole('button', { name: 'Image' })).toBeEnabled(),
      { timeout: 4000 },
    )

    fireEvent.click(screen.getByRole('button', { name: 'Image' }))
    const fileInput = document.querySelector<HTMLInputElement>('#listing-image-upload')
    expect(fileInput).not.toBeNull()
    const file = new File(['ok'], 'photo.jpg', { type: 'image/jpeg' })
    fireEvent.change(fileInput!, { target: { files: [file] } })

    await waitFor(() =>
      expect(screen.getByRole('button', { name: 'Generate listing' })).toBeEnabled(),
    )
    fireEvent.click(screen.getByRole('button', { name: 'Generate listing' }))

    await screen.findByText('Listing generation failed.')

    fireEvent.click(screen.getByRole('button', { name: 'Save listing' }))

    await waitFor(() => expect(saveListingMutateMock).toHaveBeenCalledTimes(1))
    expect(saveListingMutateMock.mock.calls[0]?.[0]).toMatchObject({
      imageUrl: null,
    })
  })
})
