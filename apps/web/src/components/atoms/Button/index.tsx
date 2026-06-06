import type { ButtonHTMLAttributes, ReactNode } from 'react'

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  icon?: ReactNode
}

export function Button({ icon, children, className = '', disabled, ...props }: ButtonProps) {
  return (
    <button
      className={`w-full flex items-center justify-center gap-2 rounded-md bg-[var(--color-brand)] px-4 py-3 text-sm font-bold text-[#0a0d0e] transition hover:bg-[var(--color-brand-hover)] disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer ${className}`}
      disabled={disabled}
      {...props}
    >
      {children}
      {icon && <span>{icon}</span>}
    </button>
  )
}
