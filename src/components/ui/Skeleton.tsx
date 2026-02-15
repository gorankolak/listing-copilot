import type { HTMLAttributes } from 'react'

import { cn } from '../../lib/utils'

type SkeletonProps = HTMLAttributes<HTMLDivElement> & {
  width?: string
  height?: string
  circle?: boolean
}

export function Skeleton({ className, width, height, circle = false, ...props }: SkeletonProps) {
  return (
    <div
      className={cn(
        'animate-pulse bg-[color:var(--color-border)]',
        circle ? 'rounded-full' : 'rounded-xl',
        !width && 'w-full',
        !height && 'h-6',
        className
      )}
      style={{ width, height }}
      aria-hidden="true"
      {...props}
    />
  )
}
