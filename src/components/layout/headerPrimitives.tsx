import type { ReactNode } from 'react'

import { cn } from '../../lib/utils'

export const headerShellClassName =
  'section-shell sticky top-4 z-20 mb-8 flex min-h-[4.75rem] flex-wrap items-center justify-between gap-x-4 gap-y-3 px-4 py-3 md:px-6'

export const headerNavClassName =
  'flex w-full items-center justify-between gap-2 text-sm sm:w-auto sm:flex-nowrap sm:justify-end sm:gap-3'

export const headerNavButtonClassName =
  'h-10 rounded-[var(--radius-button)] px-4 text-sm font-semibold tracking-[-0.015em]'

export const headerUserChipClassName =
  'flex h-10 min-w-0 items-center gap-2 rounded-[var(--radius-pill)] border border-[color:var(--color-border)] bg-[color:var(--color-surface)] px-2.5 shadow-none'

type HeaderUserChipProps = {
  email?: string | null
  trailing?: ReactNode
  className?: string
}

export function HeaderUserChip({ email, trailing, className }: HeaderUserChipProps) {
  const userInitial = (email?.[0] ?? 'U').toUpperCase()

  return (
    <div className={cn(headerUserChipClassName, className)}>
      <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[color:var(--color-accent)] text-[0.72rem] font-bold text-[color:var(--color-navy)]">
        {userInitial}
      </div>
      <p className="max-w-[10rem] truncate text-sm font-semibold tracking-[-0.015em] text-[color:var(--color-text)]">
        {email ?? 'Signed in'}
      </p>
      {trailing}
    </div>
  )
}
