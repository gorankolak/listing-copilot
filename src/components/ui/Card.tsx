import type { HTMLAttributes } from 'react'

import { cn } from '../../lib/utils'

type CardProps = HTMLAttributes<HTMLElement>
type DivProps = HTMLAttributes<HTMLDivElement>
type HeadingProps = HTMLAttributes<HTMLHeadingElement>

export function Card({ children, className, ...props }: CardProps) {
  return (
    <section className={cn('surface-elevated p-6 md:p-7', className)} {...props}>
      {children}
    </section>
  )
}

export function CardHeader({ className, ...props }: DivProps) {
  return <div className={cn('mb-6 space-y-2', className)} {...props} />
}

export function CardTitle({ className, ...props }: HeadingProps) {
  return <h2 className={cn('card-title text-[color:var(--color-text)]', className)} {...props} />
}

export function CardDescription({ className, ...props }: DivProps) {
  return <p className={cn('text-base leading-7 text-[color:var(--color-text-secondary)]', className)} {...props} />
}

export function CardContent({ className, ...props }: DivProps) {
  return <div className={cn('space-y-6', className)} {...props} />
}

export function CardFooter({ className, ...props }: DivProps) {
  return <div className={cn('mt-6 flex items-center gap-3', className)} {...props} />
}
