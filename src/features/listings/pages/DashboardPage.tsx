import { Link } from 'react-router-dom'

export function DashboardPage() {
  return (
    <section>
      <h1 className="text-2xl font-semibold">Dashboard</h1>
      <p className="mt-2 text-sm text-gray-600">Protected app shell is active.</p>
      <Link to="/app/listings/demo" className="mt-4 inline-block text-sm text-blue-700">
        Open listing detail placeholder
      </Link>
    </section>
  )
}
