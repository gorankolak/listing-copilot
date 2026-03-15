import type { AnchorHTMLAttributes, ButtonHTMLAttributes, HTMLAttributes, ReactNode } from 'react'

import { cn } from '../../lib/utils'
import { buttonClassName } from './buttonClassName'

type EmptyStateProps = HTMLAttributes<HTMLDivElement> & {
  title: ReactNode
  description?: ReactNode
  icon?: ReactNode
}

export function EmptyState({ title, description, icon, className, ...props }: EmptyStateProps) {
  return (
    <section
      className={cn(
        'rounded-[var(--radius-card)] border border-dashed border-[color:var(--color-border-strong)] bg-[color:var(--color-surface)] p-8 text-center shadow-[var(--shadow-sm)]',
        className
      )}
      {...props}
    >
      {icon ? (
        <div
          aria-hidden="true"
          className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full border border-[color:var(--color-border)] bg-[color:var(--color-surface-muted)]"
        >
          {icon}
        </div>
      ) : null}
      <h2 className="text-lg font-bold tracking-[-0.02em] text-[color:var(--color-text)]">{title}</h2>
      {description ? (
        <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-[color:var(--color-text-secondary)]">{description}</p>
      ) : null}
    </section>
  )
}

export function EmptyStateActionButton({
  type = 'button',
  className,
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      type={type}
      className={buttonClassName({ variant: 'primary', className: cn('mt-5', className) })}
      {...props}
    />
  )
}

export function EmptyStateActionLink({ className, ...props }: AnchorHTMLAttributes<HTMLAnchorElement>) {
  return (
    <a
      className={buttonClassName({ variant: 'primary', className: cn('mt-5', className) })}
      {...props}
    />
  )
}
