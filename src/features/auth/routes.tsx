import { Link } from 'react-router-dom'

import { Card } from '../../components/ui/Card'

export const authRoutes = {
  home: (
    <Card>
      <h1 className="text-2xl font-semibold">Generate listings in under 60 seconds</h1>
      <p className="mt-2 text-sm text-gray-600">
        Upload a photo or enter product text and get a polished title, bullets, and price
        range.
      </p>
      <div className="mt-6 flex gap-3">
        <Link
          to="/signup"
          className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
        >
          Get Started
        </Link>
        <Link
          to="/login"
          className="rounded-md border border-gray-300 px-4 py-2 text-sm font-medium text-gray-800 hover:bg-gray-100"
        >
          Login
        </Link>
      </div>
    </Card>
  ),
  login: (
    <Card>
      <h1 className="text-xl font-semibold">Login</h1>
      <p className="mt-2 text-sm text-gray-600">Full form is implemented in EPIC 3.</p>
    </Card>
  ),
  signup: (
    <Card>
      <h1 className="text-xl font-semibold">Sign up</h1>
      <p className="mt-2 text-sm text-gray-600">Signup form is implemented in EPIC 3.</p>
    </Card>
  ),
}
