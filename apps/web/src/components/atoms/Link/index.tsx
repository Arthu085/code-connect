import type { AnchorHTMLAttributes } from 'react'
import { Link as RouterLink } from 'react-router-dom'

type LinkVariant = 'default' | 'brand'

type LinkProps = AnchorHTMLAttributes<HTMLAnchorElement> & {
  variant?: LinkVariant
  to?: string
}

export function Link({ variant = 'default', className = '', children, to, ...props }: LinkProps) {
  const variantClass =
    variant === 'brand'
      ? 'text-brand hover:underline'
      : 'text-text-muted hover:underline underline-offset-2'

  const cls = `text-sm transition ${variantClass} ${className}`

  if (to) {
    return (
      <RouterLink to={to} className={cls}>
        {children}
      </RouterLink>
    )
  }

  return (
    <a className={cls} {...props}>
      {children}
    </a>
  )
}
