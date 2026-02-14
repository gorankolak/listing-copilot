import { render, screen } from '@testing-library/react'
import type { User } from '@supabase/supabase-js'
import { MemoryRouter, Route, Routes, useLocation } from 'react-router-dom'

import { AuthContext, type AuthContextValue } from './AuthContext'
import { AuthGuard } from './AuthGuards'

function LocationProbe() {
  const location = useLocation()
  return <div>{`${location.pathname}${location.search}${location.hash}`}</div>
}

function renderWithAuth(authValue: AuthContextValue, initialEntry = '/app') {
  return render(
    <MemoryRouter initialEntries={[initialEntry]}>
      <Routes>
        <Route
          path="/app"
          element={
            <AuthContext.Provider value={authValue}>
              <AuthGuard />
            </AuthContext.Provider>
          }
        >
          <Route index element={<div>Private page</div>} />
        </Route>
        <Route
          path="/login"
          element={
            <>
              <div>Login page</div>
              <LocationProbe />
            </>
          }
        />
      </Routes>
    </MemoryRouter>,
  )
}

const anonymousAuth: AuthContextValue = {
  session: null,
  user: null,
  isLoading: false,
  error: null,
}

describe('AuthGuard', () => {
  it('shows loading state while session is being checked', () => {
    renderWithAuth({ ...anonymousAuth, isLoading: true })
    expect(screen.getByText('Checking session...')).toBeInTheDocument()
  })

  it('redirects unauthenticated users to login with encoded returnTo', async () => {
    renderWithAuth(anonymousAuth, '/app?tab=drafts#autosave')
    expect(await screen.findByText('Login page')).toBeInTheDocument()
    expect(
      screen.getByText('/login?returnTo=%2Fapp%3Ftab%3Ddrafts%23autosave'),
    ).toBeInTheDocument()
  })

  it('renders protected content for authenticated users', () => {
    renderWithAuth({
      ...anonymousAuth,
      user: { id: 'user-1' } as User,
    })

    expect(screen.getByText('Private page')).toBeInTheDocument()
  })
})
