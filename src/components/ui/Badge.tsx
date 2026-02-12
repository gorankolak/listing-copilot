import type { ReactNode } from 'react'

type BadgeProps = {
  children: ReactNode
}

export function Badge({ children }: BadgeProps) {
  return (
    <span className="inline-flex rounded-full bg-blue-100 px-2 py-1 text-xs font-semibold text-blue-700">
      {children}
    </span>
  )
}
