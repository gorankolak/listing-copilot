import { Link } from 'react-router-dom'

type ProductLogoProps = {
  contextLabel?: string
}

export function ProductLogo({ contextLabel }: ProductLogoProps) {
  return (
    <Link
      to="/"
      className="flex min-w-0 items-center gap-2.5 transition-opacity hover:opacity-90"
    >
      <span className="relative flex h-8 w-8 shrink-0 items-center justify-center rounded-[0.7rem] border border-slate-200 bg-white">
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
      <span className="flex min-w-0 items-center gap-2">
        <span className="truncate text-[1.02rem] font-semibold tracking-[-0.03em] text-slate-900">
          ListingCopilot
        </span>
        {contextLabel ? (
          <span className="hidden rounded-full border border-[color:var(--color-border)] bg-[color:var(--color-surface-muted)] px-2.5 py-1 text-[0.6rem] font-bold uppercase tracking-[0.16em] text-[color:var(--color-text-muted)] sm:inline-flex">
            {contextLabel}
          </span>
        ) : null}
      </span>
    </Link>
  )
}
