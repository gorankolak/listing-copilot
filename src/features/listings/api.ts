import { supabaseClient } from '../../lib/supabaseClient'
import { env } from '../../lib/env'
import { generateListingResponseSchema } from './schemas'

const LISTING_INPUTS_BUCKET = 'listing-inputs'

function createInputObjectPath(userId: string, fileName: string) {
  const extension = fileName.split('.').pop()?.toLowerCase() ?? 'jpg'
  const safeExtension = extension.replace(/[^a-z0-9]/g, '') || 'jpg'
  return `${userId}/${crypto.randomUUID()}.${safeExtension}`
}

export const listingApi = {
  list: async () => Promise.resolve([]),
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

    async function invokeWithToken(token: string) {
      const response = await fetch(
        `${env.VITE_SUPABASE_URL}/functions/v1/generate-listing`,
        {
          method: 'POST',
          headers: {
            'content-type': 'application/json',
            apikey: env.VITE_SUPABASE_ANON_KEY,
            authorization: `Bearer ${token}`,
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
