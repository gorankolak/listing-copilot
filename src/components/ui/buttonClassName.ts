import { cn } from '../../lib/utils'

type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'destructive' | 'danger-subtle'
type ButtonSize = 'sm' | 'md' | 'lg'

const variantClassMap: Record<ButtonVariant, string> = {
  primary:
    'btn-primary-gradient text-white hover:brightness-105 focus-visible:ring-2 focus-visible:ring-[color:var(--color-accent)]/40',
  secondary:
    'surface-elevated text-[color:var(--color-text)] hover:bg-[color:var(--color-surface-muted)] focus-visible:ring-2 focus-visible:ring-[color:var(--color-accent)]/40',
  ghost:
    'bg-transparent text-[color:var(--color-text)] hover:bg-[color:var(--color-surface-muted)] focus-visible:ring-2 focus-visible:ring-[color:var(--color-accent)]/40',
  destructive:
    'bg-[color:var(--color-danger)] text-white hover:brightness-95 focus-visible:ring-2 focus-visible:ring-[color:var(--color-danger)]/30',
  'danger-subtle':
    'border border-[color:var(--color-error-border)] bg-[color:color-mix(in_srgb,var(--color-error-bg)_82%,var(--color-surface)_18%)] text-[color:var(--color-error-text)] hover:bg-[color:var(--color-error-bg)] focus-visible:ring-2 focus-visible:ring-[color:var(--color-danger)]/25',
}

const sizeClassMap: Record<ButtonSize, string> = {
  sm: 'h-9 px-3 text-sm',
  md: 'h-10 px-4 text-sm',
  lg: 'h-12 px-5 text-base',
}

export function buttonClassName({
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  className,
}: {
  variant?: ButtonVariant
  size?: ButtonSize
  fullWidth?: boolean
  className?: string
}) {
  return cn(
    'inline-flex cursor-pointer items-center justify-center rounded-xl font-medium transition outline-none focus-visible:ring-offset-2 focus-visible:ring-offset-[color:var(--color-background)] disabled:cursor-not-allowed disabled:pointer-events-none disabled:opacity-60',
    variantClassMap[variant],
    sizeClassMap[size],
    fullWidth && 'w-full',
    className
  )
}
