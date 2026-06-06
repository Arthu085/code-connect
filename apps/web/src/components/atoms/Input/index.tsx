import type { InputHTMLAttributes } from 'react'

type InputProps = InputHTMLAttributes<HTMLInputElement> & {
  hasError?: boolean
}

export function Input({ hasError, className = '', ...props }: InputProps) {
  return (
    <input
      className={`w-full rounded-md bg-[var(--color-input-bg)] border px-3 py-2 text-sm text-[var(--color-text-primary)] placeholder-[var(--color-input-placeholder)] outline-none focus:ring-2 focus:ring-[var(--color-brand)] transition ${
        hasError
          ? 'border-[var(--color-error)] focus:ring-[var(--color-error)]'
          : 'border-[var(--color-input-border)]'
      } ${className}`}
      aria-invalid={hasError ?? undefined}
      {...props}
    />
  )
}
