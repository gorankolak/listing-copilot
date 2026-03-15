import { cn } from '../../lib/utils'

type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'destructive' | 'danger-subtle'
type ButtonSize = 'sm' | 'md' | 'lg'

const variantClassMap: Record<ButtonVariant, string> = {
  primary:
    'btn-primary-gradient border-transparent text-white hover:brightness-[1.03] focus-visible:ring-2 focus-visible:ring-[color:var(--color-primary)]/28',
  secondary:
    'border border-[color:var(--color-border)] bg-[color:var(--color-surface)] text-[color:var(--color-text)] shadow-[var(--shadow-sm)] hover:bg-[color:var(--color-surface-muted)] hover:border-[color:var(--color-border-strong)] focus-visible:ring-2 focus-visible:ring-[color:var(--color-primary)]/16',
  ghost:
    'border border-transparent bg-transparent text-[color:var(--color-text-secondary)] hover:bg-[color:var(--color-surface-muted)] hover:text-[color:var(--color-text)] focus-visible:ring-2 focus-visible:ring-[color:var(--color-primary)]/16',
  destructive:
    'border border-[color:var(--color-danger)] bg-[color:var(--color-danger)] text-white hover:brightness-95 focus-visible:ring-2 focus-visible:ring-[color:var(--color-danger)]/24',
  'danger-subtle':
    'border border-[color:var(--color-error-border)] bg-[color:var(--color-error-bg)] text-[color:var(--color-error-text)] hover:border-[color:var(--color-danger)]/45 hover:bg-[color:color-mix(in_srgb,var(--color-error-bg)_76%,white_24%)] focus-visible:ring-2 focus-visible:ring-[color:var(--color-danger)]/18',
}

const sizeClassMap: Record<ButtonSize, string> = {
  sm: 'h-10 px-3.5 text-sm',
  md: 'h-11 px-4.5 text-sm',
  lg: 'h-12 px-5 text-[0.95rem]',
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
    'inline-flex cursor-pointer items-center justify-center rounded-[var(--radius-button)] font-semibold tracking-[-0.01em] transition outline-none focus-visible:ring-offset-2 focus-visible:ring-offset-[color:var(--color-background)] disabled:cursor-not-allowed disabled:pointer-events-none disabled:opacity-60',
    variantClassMap[variant],
    sizeClassMap[size],
    fullWidth && 'w-full',
    className
  )
}
