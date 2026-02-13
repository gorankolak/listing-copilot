import { Link } from 'react-router-dom'

import { buttonClassName } from '../../../components/ui/Button'
import { Card } from '../../../components/ui/Card'

export function HomePage() {
  return (
    <Card>
      <h1 className="text-2xl font-semibold">Generate listings in under 60 seconds</h1>
      <p className="mt-2 text-sm text-gray-600">
        Upload a photo or enter product text and get a polished title, bullets, and price range.
      </p>
      <div className="mt-6 flex gap-3">
        <Link to="/signup" className={buttonClassName({ variant: 'primary' })}>
          Get Started
        </Link>
        <Link to="/login" className={buttonClassName({ variant: 'secondary' })}>
          Login
        </Link>
      </div>
    </Card>
  )
}
