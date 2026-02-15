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
        'w-full rounded-xl border border-[color:var(--color-border)] bg-[color:var(--color-surface)] px-3 py-2 text-sm text-[color:var(--color-text)] shadow-[var(--shadow-sm)] outline-none transition-colors placeholder:text-[color:var(--color-text-muted)] focus-visible:border-[color:var(--color-accent)] focus-visible:ring-2 focus-visible:ring-[color:var(--color-accent)]/30 disabled:cursor-not-allowed disabled:bg-[color:var(--color-surface-muted)]',
        'aria-[invalid=true]:border-[color:var(--color-danger)] aria-[invalid=true]:focus-visible:ring-[color:var(--color-danger)]/30',
        className
      )}
      {...props}
    />
  )
})
