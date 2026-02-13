import type { RouteObject } from 'react-router-dom'

import { DashboardPage } from './pages/DashboardPage'
import { ListingDetailPage } from './pages/ListingDetailPage'

export const listingRoutes: RouteObject[] = [
  { index: true, element: <DashboardPage /> },
  { path: 'listings/:id', element: <ListingDetailPage /> },
]
