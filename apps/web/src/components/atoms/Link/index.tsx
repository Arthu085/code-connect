import type { AnchorHTMLAttributes } from 'react'

type LinkVariant = 'default' | 'brand'

type LinkProps = AnchorHTMLAttributes<HTMLAnchorElement> & {
  variant?: LinkVariant
}

export function Link({ variant = 'default', className = '', children, ...props }: LinkProps) {
  const variantClass =
    variant === 'brand'
      ? 'text-[var(--color-brand)] hover:underline'
      : 'text-[var(--color-text-muted)] hover:underline underline-offset-2'

  return (
    <a className={`text-sm transition ${variantClass} ${className}`} {...props}>
      {children}
    </a>
  )
}
