import { Navigate, createBrowserRouter } from 'react-router-dom'

import { AppLayout } from '../components/layout/AppLayout'
import { PublicLayout } from '../components/layout/PublicLayout'
import { AuthGuard, PublicOnlyGuard } from '../features/auth/components/AuthGuards'
import { authRoutes } from '../features/auth/routes'
import { listingRoutes } from '../features/listings/routes'

export const router = createBrowserRouter([
  {
    element: <PublicLayout />,
    children: [
      { index: true, element: authRoutes.home },
      {
        element: <PublicOnlyGuard />,
        children: [
          { path: '/login', element: authRoutes.login },
          { path: '/signup', element: authRoutes.signup },
        ],
      },
    ],
  },
  {
    path: '/app',
    element: <AuthGuard />,
    children: [
      {
        element: <AppLayout />,
        children: listingRoutes,
      },
    ],
  },
  {
    path: '*',
    element: <Navigate to="/" replace />,
  },
])
