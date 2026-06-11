import { useEffect, useState } from 'react'
import { SearchIcon } from '../../atoms/icons'

type SearchBoxProps = {
  value: string
  onChange: (value: string) => void
  placeholder?: string
  debounceMs?: number
  className?: string
}

export function SearchBox({
  value,
  onChange,
  placeholder = 'Digite o que você procura',
  debounceMs = 400,
  className = '',
}: SearchBoxProps) {
  const [internalValue, setInternalValue] = useState(value)

  useEffect(() => {
    setInternalValue(value)
  }, [value])

  useEffect(() => {
    const timeout = setTimeout(() => {
      if (internalValue !== value) {
        onChange(internalValue)
      }
    }, debounceMs)

    return () => clearTimeout(timeout)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [internalValue])

  return (
    <div className={`flex items-center gap-4 rounded bg-card-bg px-4 py-2 ${className}`}>
      <SearchIcon className="size-6 shrink-0 text-text-light" />
      <input
        type="search"
        value={internalValue}
        onChange={(event) => setInternalValue(event.target.value)}
        placeholder={placeholder}
        aria-label="Buscar posts"
        className="w-full bg-transparent text-base text-text-light placeholder-text-light outline-none"
      />
    </div>
  )
}
