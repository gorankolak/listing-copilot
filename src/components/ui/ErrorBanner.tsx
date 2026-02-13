import type { AnchorHTMLAttributes, ButtonHTMLAttributes, HTMLAttributes, ReactNode } from 'react'

import { cn } from '../../lib/utils'

type ErrorBannerProps = HTMLAttributes<HTMLDivElement> & {
  title?: string
  message: ReactNode
}

export function ErrorBanner({ title = 'Something went wrong', message, className, ...props }: ErrorBannerProps) {
  return (
    <div
      role="alert"
      aria-live="assertive"
      className={cn('rounded-md border border-red-200 bg-red-50 px-4 py-3 text-red-900', className)}
      {...props}
    >
      <p className="text-sm font-semibold">{title}</p>
      <div className="mt-1 text-sm">{message}</div>
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
        'mt-3 inline-flex items-center rounded-md bg-red-600 px-3 py-2 text-sm font-medium text-white hover:bg-red-700 focus-visible:ring-2 focus-visible:ring-red-600 focus-visible:ring-offset-2 focus-visible:outline-none',
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
        'mt-3 inline-flex items-center rounded-md bg-red-600 px-3 py-2 text-sm font-medium text-white hover:bg-red-700 focus-visible:ring-2 focus-visible:ring-red-600 focus-visible:ring-offset-2 focus-visible:outline-none',
        className
      )}
      {...props}
    />
  )
}
