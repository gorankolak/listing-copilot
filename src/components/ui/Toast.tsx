import type { ButtonHTMLAttributes, HTMLAttributes } from 'react'

import { cn } from '../../lib/utils'

type ToastVariant = 'info' | 'success' | 'warning' | 'error'
type DivProps = HTMLAttributes<HTMLDivElement>

type ToastProps = DivProps & {
  variant?: ToastVariant
}

const variantClassMap: Record<ToastVariant, string> = {
  info: 'border-blue-200 bg-blue-50 text-blue-900',
  success: 'border-emerald-200 bg-emerald-50 text-emerald-900',
  warning: 'border-amber-200 bg-amber-50 text-amber-900',
  error: 'border-red-200 bg-red-50 text-red-900',
}

export function ToastViewport({ className, ...props }: DivProps) {
  return (
    <section
      aria-live="polite"
      aria-atomic="false"
      aria-relevant="additions text"
      aria-label="Notifications"
      className={cn(
        'pointer-events-none fixed right-4 bottom-4 z-50 flex w-[min(24rem,calc(100vw-2rem))] flex-col gap-2',
        className
      )}
      {...props}
    />
  )
}

export function Toast({ className, variant = 'info', role = 'status', ...props }: ToastProps) {
  return (
    <div
      role={role}
      className={cn(
        'pointer-events-auto rounded-md border px-4 py-3 shadow-sm backdrop-blur-sm',
        variantClassMap[variant],
        className
      )}
      {...props}
    />
  )
}

export function ToastTitle({ className, ...props }: DivProps) {
  return <p className={cn('text-sm font-semibold', className)} {...props} />
}

export function ToastDescription({ className, ...props }: DivProps) {
  return <p className={cn('mt-1 text-sm', className)} {...props} />
}

export function ToastCloseButton({ className, type = 'button', ...props }: ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      type={type}
      aria-label="Dismiss notification"
      className={cn(
        'mt-2 inline-flex h-8 items-center justify-center rounded-md border border-current px-2 text-xs font-medium opacity-80 transition-opacity hover:opacity-100 focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none',
        className
      )}
      {...props}
    >
      Dismiss
    </button>
  )
}
