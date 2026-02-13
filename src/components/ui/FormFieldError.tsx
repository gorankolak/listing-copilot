import type { HTMLAttributes, ReactNode } from 'react'

import { cn } from '../../lib/utils'

type FormFieldErrorProps = HTMLAttributes<HTMLParagraphElement> & {
  message?: ReactNode
}

export function FormFieldError({ message, className, ...props }: FormFieldErrorProps) {
  if (!message) {
    return null
  }

  return (
    <p className={cn('text-xs text-red-600', className)} {...props}>
      {message}
    </p>
  )
}
