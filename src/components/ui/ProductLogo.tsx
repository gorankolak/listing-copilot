import { Link } from 'react-router-dom'

export function ProductLogo() {
  return (
    <Link to="/" className="flex items-center gap-2 transition-opacity hover:opacity-90">
      <span className="flex h-7 w-7 items-center justify-center rounded-md bg-gradient-to-br from-indigo-500 to-blue-500 text-xs font-semibold text-white">
        LC
      </span>
      <span className="font-semibold tracking-tight text-slate-900">ListingCopilot</span>
    </Link>
  )
}
