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
        'animate-pulse bg-gray-200',
        circle ? 'rounded-full' : 'rounded-md',
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
