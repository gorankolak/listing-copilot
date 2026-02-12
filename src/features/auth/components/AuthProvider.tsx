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

  useEffect(() => {
    let isMounted = true

    async function loadSession() {
      const { data } = await supabaseClient.auth.getSession()
      if (!isMounted) {
        return
      }
      setSession(data.session)
      setIsLoading(false)
    }

    void loadSession()

    const { data } = supabaseClient.auth.onAuthStateChange((_event, nextSession) => {
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
    }),
    [isLoading, session],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
