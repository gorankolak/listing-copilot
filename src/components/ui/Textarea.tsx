import { forwardRef, type TextareaHTMLAttributes } from 'react'

import { cn } from '../../lib/utils'

type TextareaProps = TextareaHTMLAttributes<HTMLTextAreaElement>

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(function Textarea(
  { className, rows = 4, ...props },
  ref
) {
  return (
    <textarea
      ref={ref}
      rows={rows}
      className={cn(
        'w-full rounded-[var(--radius-input)] border border-[color:var(--color-border)] bg-[color:var(--color-surface)] px-4 py-3 text-sm font-medium text-[color:var(--color-text)] shadow-none outline-none transition-[border-color,box-shadow,background-color] placeholder:text-[color:var(--color-text-muted)] focus-visible:border-[color:var(--color-primary)] focus-visible:ring-4 focus-visible:ring-[color:var(--color-primary)]/10 disabled:cursor-not-allowed disabled:bg-[color:var(--color-surface-muted)]',
        'aria-[invalid=true]:border-[color:var(--color-danger)] aria-[invalid=true]:focus-visible:ring-[color:var(--color-danger)]/12',
        className
      )}
      {...props}
    />
  )
})
