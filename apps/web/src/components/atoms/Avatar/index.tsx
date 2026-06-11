type AvatarProps = {
  name: string
  src?: string | null
  size?: number
  className?: string
}

function getInitials(name: string): string {
  return name
    .trim()
    .split(/\s+/)
    .map((part) => part[0])
    .slice(0, 2)
    .join('')
    .toUpperCase()
}

export function Avatar({ name, src, size = 32, className = '' }: AvatarProps) {
  const style = { width: size, height: size }

  if (src) {
    return (
      <img
        src={src}
        alt={name}
        width={size}
        height={size}
        className={`rounded-full object-cover shrink-0 ${className}`}
        style={style}
      />
    )
  }

  return (
    <span
      role="img"
      aria-label={name}
      className={`flex items-center justify-center shrink-0 rounded-full bg-brand text-on-brand text-xs font-semibold ${className}`}
      style={style}
    >
      {getInitials(name)}
    </span>
  )
}
