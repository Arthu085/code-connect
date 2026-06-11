import { useState, type FormEvent } from 'react'
import { Button } from '../../atoms/Button'

type CommentFormProps = {
  onSubmit: (text: string) => Promise<void>
  className?: string
}

export function CommentForm({ onSubmit, className = '' }: CommentFormProps) {
  const [text, setText] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleSubmit(event: FormEvent) {
    event.preventDefault()
    const trimmed = text.trim()
    if (!trimmed) return

    setIsSubmitting(true)
    setError(null)
    try {
      await onSubmit(trimmed)
      setText('')
    } catch {
      setError('Não foi possível enviar o comentário. Tente novamente.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className={`flex flex-col gap-2 ${className}`}>
      <label htmlFor="comment-text" className="sr-only">
        Escreva um comentário
      </label>
      <textarea
        id="comment-text"
        value={text}
        onChange={(event) => setText(event.target.value)}
        maxLength={500}
        rows={3}
        placeholder="Escreva um comentário..."
        className="w-full resize-none rounded-md border border-input-border bg-input-bg px-3 py-2 text-sm text-text-primary placeholder-input-placeholder outline-none transition focus:ring-2 focus:ring-brand"
      />
      {error && (
        <span role="alert" className="text-xs text-error">
          {error}
        </span>
      )}
      <Button type="submit" disabled={isSubmitting || !text.trim()} className="w-auto self-end px-6">
        Comentar
      </Button>
    </form>
  )
}
