import type { ReactNode } from 'react'

import { cn } from '../../lib/utils'

type BadgeVariant = 'default' | 'success' | 'warning' | 'danger' | 'neutral'

type BadgeProps = {
  children: ReactNode
  className?: string
  variant?: BadgeVariant
}

const variantClassMap: Record<BadgeVariant, string> = {
  default: 'border-[color:var(--color-info-border)] bg-[color:var(--color-info-bg)] text-[color:var(--color-info-text)]',
  success: 'border-[color:var(--color-success-border)] bg-[color:var(--color-success-bg)] text-[color:var(--color-success-text)]',
  warning: 'border-[color:var(--color-warning-border)] bg-[color:var(--color-warning-bg)] text-[color:var(--color-warning-text)]',
  danger: 'border-[color:var(--color-error-border)] bg-[color:var(--color-error-bg)] text-[color:var(--color-error-text)]',
  neutral: 'border-[color:var(--color-border)] bg-[color:var(--color-surface-muted)] text-[color:var(--color-text-secondary)]',
}

export function Badge({ children, className, variant = 'default' }: BadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full border px-2.5 py-1 text-[11px] font-bold uppercase tracking-[0.12em]',
        variantClassMap[variant],
        className
      )}
    >
      {children}
    </span>
  )
}
