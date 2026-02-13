import type { Session, User } from '@supabase/supabase-js'
import { createContext } from 'react'

export type AuthContextValue = {
  session: Session | null
  user: User | null
  isLoading: boolean
  error: string | null
}

export const AuthContext = createContext<AuthContextValue | undefined>(undefined)
