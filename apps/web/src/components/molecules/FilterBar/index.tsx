import { Tag } from '../../atoms/Tag'

type FilterBarProps = {
  tag: string | null
  onRemoveTag: () => void
  onClearAll: () => void
  className?: string
}

export function FilterBar({ tag, onRemoveTag, onClearAll, className = '' }: FilterBarProps) {
  if (!tag) {
    return null
  }

  return (
    <div className={`flex items-center justify-between gap-6 ${className}`}>
      <div className="flex flex-wrap items-center gap-3">
        <Tag label={tag} onRemove={onRemoveTag} />
      </div>
      <button
        type="button"
        onClick={onClearAll}
        className="shrink-0 cursor-pointer text-sm text-text-muted hover:underline"
      >
        Limpar tudo
      </button>
    </div>
  )
}
