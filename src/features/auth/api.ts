import { supabaseClient } from '../../lib/supabaseClient'

type Credentials = {
  email: string
  password: string
}

export const authApi = {
  signUp: async ({ email, password }: Credentials) => {
    return supabaseClient.auth.signUp({ email, password })
  },

  signInWithPassword: async ({ email, password }: Credentials) => {
    return supabaseClient.auth.signInWithPassword({ email, password })
  },

  signOut: async () => {
    return supabaseClient.auth.signOut()
  },
}
