import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { act, renderHook } from '@testing-library/react'
import type { ReactNode } from 'react'

import { listingQueryKeys, useSaveListingMutation } from './queries'
import type { SaveListingInput } from './types'

const { saveMock } = vi.hoisted(() => ({
  saveMock: vi.fn(),
}))

vi.mock('./api', () => ({
  listingApi: {
    save: saveMock,
    list: vi.fn(),
    getById: vi.fn(),
    delete: vi.fn(),
  },
}))

function createWrapper(queryClient: QueryClient) {
  return function Wrapper({ children }: { children: ReactNode }) {
    return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  }
}

describe('useSaveListingMutation', () => {
  it('invalidates listings cache after a successful save', async () => {
    saveMock.mockResolvedValueOnce({
      id: 'listing-1',
      title: 'Draft title',
    })

    const queryClient = new QueryClient({
      defaultOptions: {
        queries: { retry: false },
        mutations: { retry: false },
      },
    })
    const invalidateQueriesSpy = vi.spyOn(queryClient, 'invalidateQueries')

    const { result } = renderHook(() => useSaveListingMutation('user-1'), {
      wrapper: createWrapper(queryClient),
    })

    const payload: SaveListingInput = {
      draft: {
        title: 'Draft title',
        description: 'Draft description',
        bullet_points: ['Point A'],
        price_min: 10,
        price_max: 20,
      },
      imageUrl: 'https://example.test/listing-image.jpg',
    }

    await act(async () => {
      await result.current.mutateAsync(payload)
    })

    expect(saveMock).toHaveBeenCalledWith({ userId: 'user-1', ...payload })
    expect(invalidateQueriesSpy).toHaveBeenCalledWith({ queryKey: listingQueryKeys.all })
  })
})
