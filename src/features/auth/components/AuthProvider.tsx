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

    async function resolveValidSession() {
      const { data, error: sessionError } = await supabaseClient.auth.getSession()
      if (sessionError) {
        return { session: null, error: sessionError.message }
      }

      const session = data.session
      if (!session?.access_token) {
        return { session: null, error: null }
      }

      const { data: userData, error: userError } = await supabaseClient.auth.getUser(session.access_token)
      if (!userError && userData.user) {
        return { session, error: null }
      }

      const { data: refreshData, error: refreshError } = await supabaseClient.auth.refreshSession()
      if (refreshError || !refreshData.session?.access_token) {
        return { session: null, error: null }
      }

      const { data: refreshedUserData, error: refreshedUserError } = await supabaseClient.auth.getUser(
        refreshData.session.access_token,
      )
      if (refreshedUserError || !refreshedUserData.user) {
        return { session: null, error: null }
      }

      return { session: refreshData.session, error: null }
    }

    async function loadSession() {
      if (!isMounted) {
        return
      }

      const { session, error: resolvedError } = await resolveValidSession()
      if (!isMounted) return

      setError(resolvedError)
      setSession(session)
      setIsLoading(false)
    }

    void loadSession()

    const { data } = supabaseClient.auth.onAuthStateChange(() => {
      void (async () => {
        const { session: resolvedSession, error: resolvedError } = await resolveValidSession()
        if (!isMounted) return

        setError(resolvedError)
        setSession(resolvedSession)
        setIsLoading(false)
      })()
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
