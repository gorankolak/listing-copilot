import {
  useMutation,
  useQuery,
  useQueryClient,
} from '@tanstack/react-query'

import { listingApi } from './api'
import type { SaveListingInput } from './types'

export const listingQueryKeys = {
  all: ['listings'] as const,
  detail: (id: string) => ['listings', id] as const,
}

export function useListingsQuery() {
  return useQuery({
    queryKey: listingQueryKeys.all,
    queryFn: listingApi.list,
  })
}

export function useListingQuery(id: string | undefined) {
  return useQuery({
    queryKey: listingQueryKeys.detail(id ?? ''),
    queryFn: () => listingApi.getById(id ?? ''),
    enabled: Boolean(id),
  })
}

export function useSaveListingMutation(userId: string | null) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationKey: ['saveListing'],
    mutationFn: async ({ draft, imageUrl }: SaveListingInput) => {
      if (!userId) {
        throw new Error('You must be signed in to save a listing.')
      }

      return listingApi.save({ userId, draft, imageUrl })
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: listingQueryKeys.all })
    },
  })
}

export function useDeleteListingMutation() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationKey: ['deleteListing'],
    mutationFn: listingApi.delete,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: listingQueryKeys.all })
    },
  })
}
