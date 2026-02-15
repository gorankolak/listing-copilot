import type { ReactNode } from 'react'

import { cn } from '../../lib/utils'

type BadgeVariant = 'default' | 'success' | 'warning' | 'danger' | 'neutral'

type BadgeProps = {
  children: ReactNode
  className?: string
  variant?: BadgeVariant
}

const variantClassMap: Record<BadgeVariant, string> = {
  default: 'bg-[color:var(--color-info-bg)] text-[color:var(--color-info-text)]',
  success: 'bg-[color:var(--color-success-bg)] text-[color:var(--color-success-text)]',
  warning: 'bg-[color:var(--color-warning-bg)] text-[color:var(--color-warning-text)]',
  danger: 'bg-[color:var(--color-error-bg)] text-[color:var(--color-error-text)]',
  neutral: 'bg-[color:var(--color-surface-muted)] text-[color:var(--color-text-muted)]',
}

export function Badge({ children, className, variant = 'default' }: BadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-xl px-2 py-1 text-xs font-semibold',
        variantClassMap[variant],
        className
      )}
    >
      {children}
    </span>
  )
}
