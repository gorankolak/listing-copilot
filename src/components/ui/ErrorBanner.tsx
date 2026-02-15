import type { AnchorHTMLAttributes, ButtonHTMLAttributes, HTMLAttributes, ReactNode } from 'react'

import { cn } from '../../lib/utils'

type ErrorBannerProps = HTMLAttributes<HTMLDivElement> & {
  title?: string
  message: ReactNode
}

export function ErrorBanner({ title = 'Something went wrong', message, className, ...props }: ErrorBannerProps) {
  const { children, ...restProps } = props

  return (
    <div
      role="alert"
      aria-live="assertive"
      className={cn(
        'rounded-xl border border-[color:var(--color-error-border)] bg-[color:var(--color-error-bg)] px-4 py-3 text-[color:var(--color-error-text)]',
        className
      )}
      {...restProps}
    >
      <p className="text-sm font-semibold">{title}</p>
      <div className="mt-1 text-sm">{message}</div>
      {children}
    </div>
  )
}

export function ErrorBannerActionButton({
  type = 'button',
  className,
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      type={type}
      className={cn(
        'mt-3 inline-flex items-center rounded-xl bg-[color:var(--color-danger)] px-3 py-2 text-sm font-medium text-white hover:brightness-95 focus-visible:ring-2 focus-visible:ring-[color:var(--color-danger)]/30 focus-visible:ring-offset-2 focus-visible:ring-offset-[color:var(--color-background)] focus-visible:outline-none',
        className
      )}
      {...props}
    />
  )
}

export function ErrorBannerActionLink({ className, ...props }: AnchorHTMLAttributes<HTMLAnchorElement>) {
  return (
    <a
      className={cn(
        'mt-3 inline-flex items-center rounded-xl bg-[color:var(--color-danger)] px-3 py-2 text-sm font-medium text-white hover:brightness-95 focus-visible:ring-2 focus-visible:ring-[color:var(--color-danger)]/30 focus-visible:ring-offset-2 focus-visible:ring-offset-[color:var(--color-background)] focus-visible:outline-none',
        className
      )}
      {...props}
    />
  )
}
