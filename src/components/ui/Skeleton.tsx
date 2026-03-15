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
        'animate-pulse bg-[color:color-mix(in_srgb,var(--color-border)_74%,white_26%)]',
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
