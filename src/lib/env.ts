import { z } from 'zod'

const envSchema = z.object({
  VITE_SUPABASE_URL: z.string().url(),
  VITE_SUPABASE_ANON_KEY: z.string().min(1),
  VITE_API_BASE_URL: z.string().url(),
})

const parsedEnv = envSchema.safeParse(import.meta.env)

if (!parsedEnv.success) {
  const missingOrInvalidKeys = parsedEnv.error.issues
    .map((issue) => issue.path.join('.'))
    .filter(Boolean)

  throw new Error(
    `Invalid environment variables. Check your .env file and define: ${missingOrInvalidKeys.join(
      ', ',
    )}.`,
  )
}

export const env = parsedEnv.data
