import { Link } from 'react-router-dom'

export function ProductLogo() {
  return (
    <Link to="/" className="flex items-center gap-2 transition-opacity hover:opacity-90">
      <span className="relative flex h-7 w-7 items-center justify-center rounded-md border border-slate-200 bg-white">
        <span className="flex flex-col gap-0.5">
          <span className="h-0.5 w-3 rounded-full bg-slate-400" />
          <span className="h-0.5 w-3 rounded-full bg-slate-400" />
          <span className="h-0.5 w-2 rounded-full bg-slate-400" />
        </span>
        <svg
          viewBox="0 0 16 16"
          aria-hidden="true"
          className="absolute top-0 right-0 h-3 w-3 translate-x-1/4 -translate-y-1/4 text-indigo-500"
          fill="currentColor"
        >
          <path d="M8 0.75l1.49 3.76L13.25 6 9.49 7.49 8 11.25 6.51 7.49 2.75 6l3.76-1.49L8 0.75z" />
        </svg>
      </span>
      <span className="font-semibold tracking-tight text-slate-900">ListingCopilot</span>
    </Link>
  )
}
