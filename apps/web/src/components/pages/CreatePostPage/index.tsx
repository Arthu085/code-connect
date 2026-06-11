import { useState, type FormEvent } from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import { MainLayout } from '../../templates/MainLayout'
import { FormField } from '../../molecules/FormField'
import { Label } from '../../atoms/Label'
import { Button } from '../../atoms/Button'
import { createPost } from '../../../lib/posts'

export function CreatePostPage() {
  const navigate = useNavigate()
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [content, setContent] = useState('')
  const [coverUrl, setCoverUrl] = useState('')
  const [tags, setTags] = useState('')
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [submitError, setSubmitError] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  function validate(): boolean {
    const nextErrors: Record<string, string> = {}
    if (!title.trim()) nextErrors.title = 'Informe um título.'
    if (!description.trim()) nextErrors.description = 'Informe uma descrição.'
    if (!content.trim()) nextErrors.content = 'Informe o conteúdo do post.'
    setErrors(nextErrors)
    return Object.keys(nextErrors).length === 0
  }

  async function handleSubmit(event: FormEvent) {
    event.preventDefault()
    if (!validate()) return

    setIsSubmitting(true)
    setSubmitError(null)
    try {
      const post = await createPost({
        title: title.trim(),
        description: description.trim(),
        content: content.trim(),
        coverUrl: coverUrl.trim() || undefined,
        tags: tags
          .split(',')
          .map((tag) => tag.trim())
          .filter(Boolean),
      })
      navigate(`/posts/${post.slug}`)
    } catch (err) {
      if (axios.isAxiosError(err) && err.response?.status === 400) {
        setSubmitError('Verifique os dados informados.')
      } else {
        setSubmitError('Não foi possível publicar o post. Tente novamente.')
      }
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <MainLayout>
      <div className="flex w-full max-w-2xl flex-col gap-6 rounded-lg bg-card-bg p-6">
        <h1 className="text-2xl font-semibold text-text-primary">Publicar novo post</h1>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4" noValidate>
          <FormField
            label="Título"
            fieldId="title"
            value={title}
            onChange={(event) => setTitle(event.target.value)}
            error={errors.title}
            maxLength={120}
          />
          <FormField
            label="Descrição"
            fieldId="description"
            value={description}
            onChange={(event) => setDescription(event.target.value)}
            error={errors.description}
            maxLength={280}
          />
          <FormField
            label="URL da imagem de capa (opcional)"
            fieldId="coverUrl"
            value={coverUrl}
            onChange={(event) => setCoverUrl(event.target.value)}
          />
          <FormField
            label="Tags (separadas por vírgula)"
            fieldId="tags"
            value={tags}
            onChange={(event) => setTags(event.target.value)}
            placeholder="React, Front-end"
          />

          <div className="flex flex-col gap-1">
            <Label htmlFor="content">Conteúdo</Label>
            <textarea
              id="content"
              value={content}
              onChange={(event) => setContent(event.target.value)}
              rows={10}
              className="w-full resize-none rounded-md border border-input-border bg-input-bg px-3 py-2 text-sm text-text-primary placeholder-input-placeholder outline-none transition focus:ring-2 focus:ring-brand"
            />
            {errors.content && (
              <span role="alert" className="text-xs text-error">
                {errors.content}
              </span>
            )}
          </div>

          {submitError && (
            <p role="alert" className="text-sm text-error">
              {submitError}
            </p>
          )}

          <Button type="submit" disabled={isSubmitting} className="w-auto self-end px-6">
            Publicar
          </Button>
        </form>
      </div>
    </MainLayout>
  )
}
