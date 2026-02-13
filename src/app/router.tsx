import { createBrowserRouter } from 'react-router-dom'

import { NotFoundRedirect } from './NotFoundRedirect'
import { AppLayout } from '../components/layout/AppLayout'
import { PublicLayout } from '../components/layout/PublicLayout'
import { AuthGuard, PublicOnlyGuard } from '../features/auth/components/AuthGuards'
import { authGuestRoutes, authPublicRoutes } from '../features/auth/routes'
import { listingRoutes } from '../features/listings/routes'

export const router = createBrowserRouter([
  {
    element: <PublicLayout />,
    children: [
      ...authPublicRoutes,
      {
        element: <PublicOnlyGuard />,
        children: authGuestRoutes,
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
    element: <NotFoundRedirect />,
  },
])
