import type { AnchorHTMLAttributes, ButtonHTMLAttributes, HTMLAttributes, ReactNode } from 'react'

import { cn } from '../../lib/utils'

type EmptyStateProps = HTMLAttributes<HTMLDivElement> & {
  title: ReactNode
  description?: ReactNode
  icon?: ReactNode
}

export function EmptyState({ title, description, icon, className, ...props }: EmptyStateProps) {
  return (
    <section
      className={cn(
        'rounded-xl border border-dashed border-[color:var(--color-border)] bg-[color:var(--color-surface)] p-8 text-center',
        className
      )}
      {...props}
    >
      {icon ? (
        <div
          aria-hidden="true"
          className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-[color:var(--color-surface-muted)]"
        >
          {icon}
        </div>
      ) : null}
      <h2 className="text-base font-semibold text-[color:var(--color-text)]">{title}</h2>
      {description ? (
        <p className="mt-2 text-sm text-[color:var(--color-text-muted)]">{description}</p>
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
      className={cn(
        'btn-primary-gradient mt-4 inline-flex h-10 items-center justify-center rounded-xl px-4 text-sm font-medium text-white hover:brightness-105 focus-visible:ring-2 focus-visible:ring-[color:var(--color-accent)]/40 focus-visible:ring-offset-2 focus-visible:ring-offset-[color:var(--color-background)] focus-visible:outline-none',
        className
      )}
      {...props}
    />
  )
}

export function EmptyStateActionLink({ className, ...props }: AnchorHTMLAttributes<HTMLAnchorElement>) {
  return (
    <a
      className={cn(
        'btn-primary-gradient mt-4 inline-flex h-10 items-center justify-center rounded-xl px-4 text-sm font-medium text-white hover:brightness-105 focus-visible:ring-2 focus-visible:ring-[color:var(--color-accent)]/40 focus-visible:ring-offset-2 focus-visible:ring-offset-[color:var(--color-background)] focus-visible:outline-none',
        className
      )}
      {...props}
    />
  )
}
