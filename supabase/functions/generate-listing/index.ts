import { serve } from 'https://deno.land/std@0.224.0/http/server.ts'
import { z } from 'npm:zod@3.23.8'

import { LISTING_PROMPT } from './prompt.ts'

const generateListingRequestSchema = z
  .object({
    mode: z.enum(['image', 'text']),
    imageUrl: z.string().url().optional(),
    text: z.string().trim().min(1).max(5000).optional(),
  })
  .superRefine((value, ctx) => {
    if (value.mode === 'image' && !value.imageUrl) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'imageUrl is required for image mode.',
        path: ['imageUrl'],
      })
    }

    if (value.mode === 'text' && !value.text) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'text is required for text mode.',
        path: ['text'],
      })
    }
  })

const generatedDraftSchema = z.object({
  title: z.string().trim().min(10).max(120),
  description: z.string().trim().min(20).max(1200),
  bullet_points: z.array(z.string().trim().min(2).max(180)).min(3).max(6),
  price_min: z.number().finite().nonnegative(),
  price_max: z.number().finite().nonnegative(),
})

const generateListingResponseSchema = z.object({
  draft: generatedDraftSchema,
})

const DEFAULT_GEMINI_MODEL = 'gemini-2.5-flash-lite'
const MAX_IMAGE_BYTES = 10 * 1024 * 1024
const GEMINI_ERROR_CODE_QUOTA = 'AI_PROVIDER_QUOTA_EXCEEDED'
const GEMINI_ERROR_CODE_RATE_LIMIT = 'AI_PROVIDER_RATE_LIMITED'
const GEMINI_ERROR_CODE_REQUEST = 'AI_PROVIDER_REQUEST_FAILED'

const geminiDraftJsonSchema = {
  type: 'object',
  properties: {
    title: { type: 'string' },
    description: { type: 'string' },
    bullet_points: {
      type: 'array',
      minItems: 3,
      maxItems: 6,
      items: { type: 'string' },
    },
    price_min: { type: 'number', minimum: 0 },
    price_max: { type: 'number', minimum: 0 },
  },
  required: ['title', 'description', 'bullet_points', 'price_min', 'price_max'],
} as const

function jsonResponse(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      'content-type': 'application/json',
      'access-control-allow-origin': '*',
      'access-control-allow-headers':
        'authorization, x-client-info, apikey, content-type',
      'access-control-allow-methods': 'POST, OPTIONS',
    },
  })
}

function arrayBufferToBase64(buffer: ArrayBuffer) {
  const bytes = new Uint8Array(buffer)
  const chunkSize = 0x8000
  let binary = ''

  for (let index = 0; index < bytes.length; index += chunkSize) {
    const chunk = bytes.subarray(index, index + chunkSize)
    binary += String.fromCharCode(...chunk)
  }

  return btoa(binary)
}

function extractGeminiText(geminiResponse: unknown) {
  if (
    typeof geminiResponse !== 'object' ||
    geminiResponse === null ||
    !('candidates' in geminiResponse)
  ) {
    return null
  }

  const candidates = (geminiResponse as { candidates?: unknown }).candidates
  if (!Array.isArray(candidates)) {
    return null
  }

  for (const candidate of candidates) {
    if (
      typeof candidate !== 'object' ||
      candidate === null ||
      !('content' in candidate)
    ) {
      continue
    }

    const content = (candidate as { content?: unknown }).content
    if (typeof content !== 'object' || content === null || !('parts' in content)) {
      continue
    }

    const parts = (content as { parts?: unknown }).parts
    if (!Array.isArray(parts)) {
      continue
    }

    const text = parts
      .map((part) =>
        typeof part === 'object' &&
        part !== null &&
        'text' in part &&
        typeof (part as { text?: unknown }).text === 'string'
          ? (part as { text: string }).text
          : '',
      )
      .join('')
      .trim()

    if (text) {
      return text
    }
  }

  return null
}

function extractGeminiErrorMessage(errorBody: unknown) {
  if (
    typeof errorBody === 'object' &&
    errorBody !== null &&
    'error' in errorBody &&
    typeof (errorBody as { error?: unknown }).error === 'object' &&
    (errorBody as { error?: unknown }).error !== null &&
    'message' in (errorBody as { error: { message?: unknown } }).error &&
    typeof (errorBody as { error: { message?: unknown } }).error.message === 'string'
  ) {
    return (errorBody as { error: { message: string } }).error.message
  }

  return null
}

function resolveGeminiModel(rawModel: string | undefined) {
  if (!rawModel?.trim()) {
    return DEFAULT_GEMINI_MODEL
  }

  const model = rawModel.trim()
  return model.startsWith('models/') ? model.slice('models/'.length) : model
}

async function fetchImagePart(imageUrl: string) {
  const imageResponse = await fetch(imageUrl)

  if (!imageResponse.ok) {
    throw new Error(`Image download failed with status ${imageResponse.status}.`)
  }

  const imageBytes = await imageResponse.arrayBuffer()

  if (imageBytes.byteLength === 0) {
    throw new Error('Uploaded image is empty.')
  }

  if (imageBytes.byteLength > MAX_IMAGE_BYTES) {
    throw new Error('Uploaded image is too large for AI processing.')
  }

  const contentType = imageResponse.headers
    .get('content-type')
    ?.split(';')[0]
    ?.trim()
    .toLowerCase()
  const mimeType = contentType?.startsWith('image/') ? contentType : 'image/jpeg'

  return {
    inline_data: {
      mime_type: mimeType,
      data: arrayBufferToBase64(imageBytes),
    },
  }
}

function buildUserText(parsedRequest: z.infer<typeof generateListingRequestSchema>) {
  if (parsedRequest.mode === 'image') {
    return 'Input mode: image. Generate listing details from the provided image only.'
  }

  return `Input mode: text.\nProduct details: ${parsedRequest.text}`
}

function buildGeminiParts(
  parsedRequest: z.infer<typeof generateListingRequestSchema>,
  imagePart?: unknown,
) {
  const parts: Array<Record<string, unknown>> = [
    { text: LISTING_PROMPT },
    { text: buildUserText(parsedRequest) },
  ]

  if (imagePart) {
    parts.push(imagePart as Record<string, unknown>)
  }

  return parts
}

function buildGeminiRequestBody(
  parsedRequest: z.infer<typeof generateListingRequestSchema>,
  imagePart?: unknown,
  withResponseSchema = true,
) {
  const generationConfig: Record<string, unknown> = {
    responseMimeType: 'application/json',
  }

  if (withResponseSchema) {
    generationConfig.responseJsonSchema = geminiDraftJsonSchema
  }

  return {
    contents: [
      {
        role: 'user',
        parts: buildGeminiParts(parsedRequest, imagePart),
      },
    ],
    generationConfig,
  }
}

function parseStructuredJsonText(text: string) {
  try {
    return JSON.parse(text) as unknown
  } catch {
    const fencedJson = text.match(/```(?:json)?\s*([\s\S]*?)\s*```/i)?.[1]
    if (fencedJson) {
      try {
        return JSON.parse(fencedJson) as unknown
      } catch {
        return null
      }
    }
  }

  return null
}

function parseGeminiDraft(geminiResponse: unknown) {
  const outputText = extractGeminiText(geminiResponse)

  if (!outputText) {
    return { error: 'Gemini returned no structured output.' as const }
  }

  const parsedOutput = parseStructuredJsonText(outputText)

  if (!parsedOutput) {
    return { error: 'Gemini output was not valid JSON.' as const }
  }

  return { draft: generatedDraftSchema.parse(parsedOutput) }
}

function buildGeminiEndpoint(model: string, apiKey: string) {
  return `https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(
    model,
  )}:generateContent?key=${encodeURIComponent(apiKey)}`
}

async function parseGeminiResponse(response: Response) {
  const responseText = await response.text()
  if (!responseText) {
    return {
      status: response.status,
      raw: null as unknown,
      details: null as string | null,
    }
  }

  try {
    const parsed = JSON.parse(responseText) as unknown
    return {
      status: response.status,
      raw: parsed,
      details: extractGeminiErrorMessage(parsed),
    }
  } catch {
    return {
      status: response.status,
      raw: responseText,
      details: responseText.slice(0, 500),
    }
  }
}

function formatGeminiErrorDetails(details: string | null, fallbackRaw: unknown) {
  if (details) {
    return details.slice(0, 500)
  }

  if (typeof fallbackRaw === 'string' && fallbackRaw.trim()) {
    return fallbackRaw.slice(0, 500)
  }

  return 'No error details were provided.'
}

function isGeminiSchemaFailure(status: number, details: string) {
  if (status !== 400) {
    return false
  }

  return /response[_ ]?json[_ ]?schema|response[_ ]?schema|invalid json payload|unknown name/i.test(
    details,
  )
}

function detectGeminiErrorCode(status: number, details: string) {
  const hasRateLimitSignal = /rate limit|too many requests|resource_exhausted/i.test(
    details,
  )
  const hasQuotaSignal =
    /quota exceeded|free_tier_requests|billing details|limit:\s*0/i.test(details)

  if (hasRateLimitSignal) {
    return GEMINI_ERROR_CODE_RATE_LIMIT
  }

  if (status === 429 || hasQuotaSignal) {
    return GEMINI_ERROR_CODE_QUOTA
  }

  return GEMINI_ERROR_CODE_REQUEST
}

function buildGeminiFailureResponse(status: number, details: string) {
  const code = detectGeminiErrorCode(status, details)

  if (code === GEMINI_ERROR_CODE_QUOTA) {
    return {
      status: 429,
      body: {
        error: 'AI provider quota exceeded. Please try again later.',
        code,
        retryable: true,
        details,
      },
    }
  }

  if (code === GEMINI_ERROR_CODE_RATE_LIMIT) {
    return {
      status: 429,
      body: {
        error: 'AI provider rate-limited the request. Please retry in a moment.',
        code,
        retryable: true,
        details,
      },
    }
  }

  return {
    status: 502,
    body: {
      error: 'Gemini request failed.',
      code,
      details,
    },
  }
}

async function requestGemini(
  model: string,
  apiKey: string,
  parsedRequest: z.infer<typeof generateListingRequestSchema>,
  imagePart?: unknown,
  withResponseSchema = true,
) {
  const response = await fetch(buildGeminiEndpoint(model, apiKey), {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
    },
    body: JSON.stringify(
      buildGeminiRequestBody(parsedRequest, imagePart, withResponseSchema),
    ),
  })

  if (!response.ok) {
    const parsedFailure = await parseGeminiResponse(response)
    const details = formatGeminiErrorDetails(parsedFailure.details, parsedFailure.raw)
    return {
      ok: false as const,
      status: parsedFailure.status,
      details,
    }
  }

  const data = (await response.json()) as unknown
  return {
    ok: true as const,
    data,
  }
}

serve(async (request) => {
  if (request.method === 'OPTIONS') {
    return jsonResponse({}, 200)
  }

  if (request.method !== 'POST') {
    return jsonResponse({ error: 'Method not allowed.' }, 405)
  }

  const geminiApiKey = Deno.env.get('GEMINI_API_KEY')
  const geminiModel = resolveGeminiModel(Deno.env.get('GEMINI_MODEL'))

  if (!geminiApiKey) {
    return jsonResponse({ error: 'GEMINI_API_KEY is not configured.' }, 500)
  }

  let parsedRequest: z.infer<typeof generateListingRequestSchema>
  try {
    const body = await request.json()
    parsedRequest = generateListingRequestSchema.parse(body)
  } catch (error) {
    if (error instanceof z.ZodError) {
      return jsonResponse(
        {
          error: 'Invalid request payload.',
          details: error.issues.map((issue) => issue.message),
        },
        400,
      )
    }

    return jsonResponse({ error: 'Invalid JSON body.' }, 400)
  }

  try {
    const imagePart =
      parsedRequest.mode === 'image' && parsedRequest.imageUrl
        ? await fetchImagePart(parsedRequest.imageUrl)
        : undefined
    let geminiResult = await requestGemini(
      geminiModel,
      geminiApiKey,
      parsedRequest,
      imagePart,
      true,
    )

    if (
      !geminiResult.ok &&
      isGeminiSchemaFailure(geminiResult.status, geminiResult.details)
    ) {
      geminiResult = await requestGemini(
        geminiModel,
        geminiApiKey,
        parsedRequest,
        imagePart,
        false,
      )
    }

    if (!geminiResult.ok) {
      const failureResponse = buildGeminiFailureResponse(
        geminiResult.status,
        geminiResult.details,
      )
      return jsonResponse(failureResponse.body, failureResponse.status)
    }

    const parsedDraft = parseGeminiDraft(geminiResult.data)
    if ('error' in parsedDraft) {
      return jsonResponse(
        {
          error: parsedDraft.error,
          code: 'AI_PROVIDER_INVALID_RESPONSE',
        },
        502,
      )
    }
    const { draft } = parsedDraft

    if (draft.price_max < draft.price_min) {
      return jsonResponse({ error: 'AI produced an invalid price range.' }, 502)
    }

    const response = generateListingResponseSchema.parse({ draft })
    return jsonResponse(response, 200)
  } catch (error) {
    return jsonResponse(
      {
        error: 'Listing generation failed.',
        details: error instanceof Error ? error.message : 'Unknown error.',
      },
      500,
    )
  }
})
