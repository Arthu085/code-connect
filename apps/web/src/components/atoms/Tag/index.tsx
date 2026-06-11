import { CloseIcon } from '../icons'

type TagProps = {
  label: string
  onRemove?: () => void
  className?: string
}

export function Tag({ label, onRemove, className = '' }: TagProps) {
  return (
    <span
      className={`inline-flex items-center gap-1 rounded bg-tag-bg px-2 py-1 text-xs font-medium text-card-bg ${className}`}
    >
      {label}
      {onRemove && (
        <button
          type="button"
          onClick={onRemove}
          aria-label={`Remover filtro ${label}`}
          className="cursor-pointer leading-none"
        >
          <CloseIcon className="size-3" />
        </button>
      )}
    </span>
  )
}
