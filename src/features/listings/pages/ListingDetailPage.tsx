import { Link, useParams } from 'react-router-dom'

import { Badge } from '../../../components/ui/Badge'
import { buttonClassName } from '../../../components/ui/Button'
import { Card, CardContent, CardHeader, CardTitle } from '../../../components/ui/Card'
import { EmptyState, EmptyStateActionLink } from '../../../components/ui/EmptyState'
import { ErrorBanner } from '../../../components/ui/ErrorBanner'

export function ListingDetailPage() {
  const { id } = useParams<{ id: string }>()

  if (!id) {
    return (
      <ErrorBanner
        title="Invalid listing route"
        message="No listing ID was provided. Please return to the dashboard."
      />
    )
  }

  if (id === 'demo') {
    return (
      <Card>
        <CardHeader>
          <Badge>Draft</Badge>
          <CardTitle className="mt-2">Demo Listing</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-gray-600">
            This is a placeholder listing detail view. Real listing data will render here once listing
            detail loading is implemented.
          </p>
          <Link to="/app" className={buttonClassName({ variant: 'secondary', size: 'sm' })}>
            Back to dashboard
          </Link>
        </CardContent>
      </Card>
    )
  }

  return (
    <EmptyState
      title="Listing not found"
      description="The listing you are looking for may have been removed or never existed."
    >
      <EmptyStateActionLink href="/app">Back to dashboard</EmptyStateActionLink>
    </EmptyState>
  )
}
