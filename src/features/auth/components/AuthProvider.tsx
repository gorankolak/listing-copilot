import {
  type ReactNode,
  useEffect,
  useMemo,
  useState,
} from 'react'

import { supabaseClient } from '../../../lib/supabaseClient'
import { AuthContext, type AuthContextValue } from './AuthContext'

type AuthProviderProps = {
  children: ReactNode
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [session, setSession] = useState<AuthContextValue['session']>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<AuthContextValue['error']>(null)

  useEffect(() => {
    let isMounted = true

    async function loadSession() {
      const { data, error: sessionError } = await supabaseClient.auth.getSession()
      if (!isMounted) {
        return
      }

      if (sessionError) {
        setError(sessionError.message)
        setSession(null)
        setIsLoading(false)
        return
      }

      setError(null)
      setSession(data.session)
      setIsLoading(false)
    }

    void loadSession()

    const { data } = supabaseClient.auth.onAuthStateChange((_event, nextSession) => {
      setError(null)
      setSession(nextSession)
      setIsLoading(false)
    })

    return () => {
      isMounted = false
      data.subscription.unsubscribe()
    }
  }, [])

  const value = useMemo<AuthContextValue>(
    () => ({
      session,
      user: session?.user ?? null,
      isLoading,
      error,
    }),
    [error, isLoading, session],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
