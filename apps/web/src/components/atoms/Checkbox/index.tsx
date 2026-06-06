import type { InputHTMLAttributes } from 'react'

type CheckboxProps = InputHTMLAttributes<HTMLInputElement> & {
  label: string
}

export function Checkbox({ label, id, className = '', ...props }: CheckboxProps) {
  return (
    <label htmlFor={id} className={`flex items-center gap-2 cursor-pointer text-sm text-[var(--color-text-primary)] ${className}`}>
      <input
        id={id}
        type="checkbox"
        className="w-4 h-4 accent-[var(--color-brand)] cursor-pointer"
        {...props}
      />
      {label}
    </label>
  )
}
