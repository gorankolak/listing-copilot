import type { ReactNode } from 'react'

type ToastProps = {
  children: ReactNode
}

export function Toast({ children }: ToastProps) {
  return <div className="rounded-md border border-blue-200 bg-blue-50 px-4 py-3 text-sm">{children}</div>
}
