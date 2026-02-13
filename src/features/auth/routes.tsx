import type { RouteObject } from 'react-router-dom'

import { HomePage } from './pages/HomePage'
import { LoginPage } from './pages/LoginPage'
import { SignupPage } from './pages/SignupPage'

export const authPublicRoutes: RouteObject[] = [{ index: true, element: <HomePage /> }]

export const authGuestRoutes: RouteObject[] = [
  { path: 'login', element: <LoginPage /> },
  { path: 'signup', element: <SignupPage /> },
]
