import type { ReactNode } from 'react'

import { cn } from '../../lib/utils'

type BadgeVariant = 'default' | 'success' | 'warning' | 'danger' | 'neutral'

type BadgeProps = {
  children: ReactNode
  className?: string
  variant?: BadgeVariant
}

const variantClassMap: Record<BadgeVariant, string> = {
  default: 'bg-blue-100 text-blue-700',
  success: 'bg-emerald-100 text-emerald-700',
  warning: 'bg-amber-100 text-amber-700',
  danger: 'bg-red-100 text-red-700',
  neutral: 'bg-gray-100 text-gray-700',
}

export function Badge({ children, className, variant = 'default' }: BadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full px-2 py-1 text-xs font-semibold',
        variantClassMap[variant],
        className
      )}
    >
      {children}
    </span>
  )
}
