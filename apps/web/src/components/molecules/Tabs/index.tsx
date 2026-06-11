import type { PostsSort } from '../../../lib/posts'

type TabsProps = {
  value: PostsSort
  onChange: (value: PostsSort) => void
  className?: string
}

const OPTIONS: { value: PostsSort; label: string }[] = [
  { value: 'recent', label: 'Recentes' },
  { value: 'popular', label: 'Populares' },
]

export function Tabs({ value, onChange, className = '' }: TabsProps) {
  return (
    <div role="tablist" className={`flex items-start justify-center gap-6 ${className}`}>
      {OPTIONS.map((option) => {
        const isActive = option.value === value
        return (
          <button
            key={option.value}
            type="button"
            role="tab"
            aria-selected={isActive}
            onClick={() => onChange(option.value)}
            className={`cursor-pointer px-1 text-xl transition ${
              isActive
                ? 'font-semibold text-brand underline underline-offset-4'
                : 'text-text-muted'
            }`}
          >
            {option.label}
          </button>
        )
      })}
    </div>
  )
}
