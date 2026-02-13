import { supabaseClient } from '../../lib/supabaseClient'
import { env } from '../../lib/env'
import { generateListingResponseSchema, listingSchema } from './schemas'
import type { ListingDraft } from './types'

const LISTING_INPUTS_BUCKET = 'listing-inputs'
const LISTINGS_TABLE = 'listings'

function parseListingRow(row: unknown) {
  const parsed = listingSchema.safeParse(row)
  if (!parsed.success) {
    throw new Error('Listing response format is invalid.')
  }

  return parsed.data
}

function normalizeIntegerPrice(value: number) {
  if (!Number.isFinite(value)) {
    return null
  }

  return Math.max(0, Math.round(value))
}

function mapDraftToInsertPayload(userId: string, draft: ListingDraft) {
  return {
    user_id: userId,
    title: draft.title.trim(),
    description: draft.description.trim(),
    bullet_points: draft.bullet_points.map((bullet) => bullet.trim()).filter(Boolean),
    price_min: normalizeIntegerPrice(draft.price_min),
    price_max: normalizeIntegerPrice(draft.price_max),
    currency: 'EUR',
  }
}

function createInputObjectPath(userId: string, fileName: string) {
  const extension = fileName.split('.').pop()?.toLowerCase() ?? 'jpg'
  const safeExtension = extension.replace(/[^a-z0-9]/g, '') || 'jpg'
  return `${userId}/${crypto.randomUUID()}.${safeExtension}`
}

function parseJwtPayload(token: string) {
  try {
    const payload = token.split('.')[1]
    if (!payload) {
      return null
    }

    const normalized = payload.replace(/-/g, '+').replace(/_/g, '/')
    const padded = normalized.padEnd(Math.ceil(normalized.length / 4) * 4, '=')
    return JSON.parse(atob(padded)) as Record<string, unknown>
  } catch {
    return null
  }
}

export const listingApi = {
  list: async () => {
    const { data, error } = await supabaseClient
      .from(LISTINGS_TABLE)
      .select(
        'id, user_id, title, description, bullet_points, price_min, price_max, currency, created_at, updated_at',
      )
      .order('created_at', { ascending: false })

    if (error) {
      throw new Error(`Failed to load listings: ${error.message}`)
    }

    return (data ?? []).map((row) => parseListingRow(row))
  },
  getById: async (id: string) => {
    const { data, error } = await supabaseClient
      .from(LISTINGS_TABLE)
      .select(
        'id, user_id, title, description, bullet_points, price_min, price_max, currency, created_at, updated_at',
      )
      .eq('id', id)
      .maybeSingle()

    if (error) {
      throw new Error(`Failed to load listing: ${error.message}`)
    }

    if (!data) {
      return null
    }

    return parseListingRow(data)
  },
  save: async ({ userId, draft }: { userId: string; draft: ListingDraft }) => {
    const payload = mapDraftToInsertPayload(userId, draft)
    const { data, error } = await supabaseClient
      .from(LISTINGS_TABLE)
      .insert(payload)
      .select(
        'id, user_id, title, description, bullet_points, price_min, price_max, currency, created_at, updated_at',
      )
      .single()

    if (error) {
      throw new Error(`Failed to save listing: ${error.message}`)
    }

    return parseListingRow(data)
  },
  delete: async (id: string) => {
    const { error } = await supabaseClient.from(LISTINGS_TABLE).delete().eq('id', id)
    if (error) {
      throw new Error(`Failed to delete listing: ${error.message}`)
    }
  },
  uploadInputImage: async (userId: string, file: File) => {
    const objectPath = createInputObjectPath(userId, file.name)

    const { error: uploadError } = await supabaseClient.storage
      .from(LISTING_INPUTS_BUCKET)
      .upload(objectPath, file, {
        contentType: file.type,
        upsert: false,
      })

    if (uploadError) {
      throw new Error(`Image upload failed: ${uploadError.message}`)
    }

    const { data } = supabaseClient.storage
      .from(LISTING_INPUTS_BUCKET)
      .getPublicUrl(objectPath)

    if (!data.publicUrl) {
      throw new Error('Image upload failed: missing public URL.')
    }

    return data.publicUrl
  },
  generateListing: async (
    payload: { mode: 'image'; imageUrl: string } | { mode: 'text'; text: string },
  ) => {
    const {
      data: { session: initialSession },
      error: sessionError,
    } = await supabaseClient.auth.getSession()

    if (sessionError) {
      throw new Error(`Failed to read auth session: ${sessionError.message}`)
    }

    if (!initialSession?.access_token) {
      throw new Error('You are not authenticated. Please sign in and retry.')
    }

    let accessToken = initialSession.access_token
    const { data: refreshData, error: refreshError } =
      await supabaseClient.auth.refreshSession()
    if (!refreshError && refreshData.session?.access_token) {
      accessToken = refreshData.session.access_token
    }

    const { data: currentUserData, error: currentUserError } =
      await supabaseClient.auth.getUser(accessToken)
    if (currentUserError || !currentUserData.user) {
      throw new Error('Session is invalid or expired. Log out, log in again, then retry.')
    }

    const jwtPayload = parseJwtPayload(accessToken)
    const tokenIssuer =
      typeof jwtPayload?.iss === 'string' ? jwtPayload.iss : null
    const tokenRef =
      typeof jwtPayload?.ref === 'string' ? jwtPayload.ref : null
    const tokenExpiry =
      typeof jwtPayload?.exp === 'number' ? jwtPayload.exp : null

    const expectedIssuer = `${env.VITE_SUPABASE_URL}/auth/v1`
    const expectedRef = new URL(env.VITE_SUPABASE_URL).hostname.split('.')[0]
    const isTokenExpired =
      tokenExpiry !== null ? tokenExpiry * 1000 <= Date.now() : false

    if (tokenIssuer && tokenIssuer !== expectedIssuer) {
      throw new Error(
        `Session token issuer mismatch. Expected ${expectedIssuer} but got ${tokenIssuer}. Please log out and log in again.`,
      )
    }

    if (tokenRef && tokenRef !== expectedRef) {
      throw new Error(
        `Session token project mismatch. Expected ${expectedRef} but got ${tokenRef}. Please log out and log in again.`,
      )
    }

    if (isTokenExpired) {
      throw new Error('Session token is expired. Please log out and log in again.')
    }

    async function invokeWithToken(token: string) {
      const response = await fetch(
        `${env.VITE_SUPABASE_URL}/functions/v1/generate-listing`,
        {
          method: 'POST',
          headers: {
            'content-type': 'application/json',
            apikey: env.VITE_SUPABASE_ANON_KEY,
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(payload),
        },
      )

      const responseText = await response.text()
      let responseBody: unknown = null
      if (responseText) {
        try {
          responseBody = JSON.parse(responseText)
        } catch {
          responseBody = responseText
        }
      }

      if (!response.ok) {
        return {
          data: responseBody,
          error: {
            message: 'Edge Function returned a non-2xx status code',
            context: new Response(responseText, {
              status: response.status,
              statusText: response.statusText,
              headers: response.headers,
            }),
          },
        }
      }

      return {
        data: responseBody,
        error: null,
      }
    }

    function getErrorMessage(
      invokeData: unknown,
      invokeError: unknown,
      functionHttpDetails: string | null = null,
    ) {
      const backendCode =
        typeof invokeData === 'object' &&
        invokeData !== null &&
        'code' in invokeData &&
        typeof invokeData.code === 'string'
          ? invokeData.code
          : null
      const backendMessage =
        typeof invokeData === 'object' &&
        invokeData !== null &&
        'error' in invokeData &&
        typeof invokeData.error === 'string'
          ? invokeData.error
          : null
      const backendDetails =
        typeof invokeData === 'object' &&
        invokeData !== null &&
        'details' in invokeData &&
        typeof invokeData.details === 'string'
          ? invokeData.details
          : null
      const invokeErrorMessage =
        typeof invokeError === 'object' &&
        invokeError !== null &&
        'message' in invokeError &&
        typeof invokeError.message === 'string'
          ? invokeError.message
          : null

      const rawDetails = [backendDetails, functionHttpDetails].filter(Boolean).join(' ')
      const hasQuotaSignal =
        /quota exceeded|free_tier_requests|billing details|limit:\s*0/i.test(rawDetails)
      const hasRateLimitSignal = /rate limit|too many requests|resource_exhausted/i.test(
        rawDetails,
      )

      if (backendCode === 'AI_PROVIDER_QUOTA_EXCEEDED' || hasQuotaSignal) {
        return 'AI provider quota exceeded. Please try again later.'
      }

      if (backendCode === 'AI_PROVIDER_RATE_LIMITED' || hasRateLimitSignal) {
        return 'AI provider rate-limited the request. Please retry shortly.'
      }

      return [
        backendMessage ?? invokeErrorMessage ?? 'Failed to generate listing.',
        backendDetails,
        functionHttpDetails,
      ]
        .filter(Boolean)
        .join(' ')
    }

    const { data, error } = await invokeWithToken(env.VITE_SUPABASE_ANON_KEY)

    if (error) {
      const functionHttpError = error as { context?: Response }
      let functionHttpDetails: string | null = null
      if (functionHttpError.context instanceof Response) {
        const errorText = await functionHttpError.context.text()
        functionHttpDetails = errorText
          ? `Function ${functionHttpError.context.status}: ${errorText.slice(0, 500)}`
          : `Function ${functionHttpError.context.status}: empty error response`
      }

      const baseMessage = getErrorMessage(data, error, functionHttpDetails)
      throw new Error(baseMessage)
    }

    const parsed = generateListingResponseSchema.safeParse(data)

    if (!parsed.success) {
      throw new Error('Generation response format is invalid.')
    }

    return parsed.data.draft
  },
}
