import type { LabelHTMLAttributes } from 'react'

type LabelProps = LabelHTMLAttributes<HTMLLabelElement>

export function Label({ className = '', children, ...props }: LabelProps) {
  return (
    <label
      className={`block text-sm font-medium text-[var(--color-text-primary)] mb-1 ${className}`}
      {...props}
    >
      {children}
    </label>
  )
}
