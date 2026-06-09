import type { InputHTMLAttributes } from 'react'

type InputProps = InputHTMLAttributes<HTMLInputElement> & {
  hasError?: boolean
}

export function Input({ hasError, className = '', ...props }: InputProps) {
  return (
    <input
      className={`w-full rounded-md bg-input-bg border px-3 py-2 text-sm text-text-primary placeholder-input-placeholder outline-none focus:ring-2 focus:ring-brand transition ${
        hasError
          ? 'border-error focus:ring-error'
          : 'border-input-border'
      } ${className}`}
      aria-invalid={hasError || undefined}
      {...props}
    />
  )
}
