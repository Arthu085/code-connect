import { CodeIcon } from '../../atoms/icons'

type PostThumbnailProps = {
  coverUrl: string | null
  title: string
  slug: string
  className?: string
}

const PLACEHOLDER_VARIANTS = ['bg-thumb-bg', 'bg-input-bg', 'bg-brand/10']

function hashString(value: string): number {
  let hash = 0
  for (let i = 0; i < value.length; i += 1) {
    hash = (hash << 5) - hash + value.charCodeAt(i)
    hash |= 0
  }
  return Math.abs(hash)
}

export function PostThumbnail({ coverUrl, title, slug, className = '' }: PostThumbnailProps) {
  if (coverUrl) {
    return (
      <img
        src={coverUrl}
        alt={title}
        className={`h-60 w-full rounded-t-lg object-cover ${className}`}
      />
    )
  }

  const variant = PLACEHOLDER_VARIANTS[hashString(slug) % PLACEHOLDER_VARIANTS.length]

  return (
    <div
      role="img"
      aria-label={title}
      className={`flex h-60 w-full items-center justify-center rounded-t-lg ${variant} ${className}`}
    >
      <CodeIcon className="size-16 text-text-primary/40" />
    </div>
  )
}
