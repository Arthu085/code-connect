import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { MainLayout } from '../../templates/MainLayout'
import { PostThumbnail } from '../../molecules/PostThumbnail'
import { Tag } from '../../atoms/Tag'
import { Avatar } from '../../atoms/Avatar'
import { Link } from '../../atoms/Link'
import { PostActions } from '../../organisms/PostActions'
import { CommentList } from '../../organisms/CommentList'
import { CommentForm } from '../../organisms/CommentForm'
import { useSession } from '../../../lib/useSession'
import { addComment, getPost, likePost, unlikePost, type PostDetail } from '../../../lib/posts'

export function PostDetailPage() {
  const { slug } = useParams<{ slug: string }>()
  const { isAuthenticated } = useSession()
  const [post, setPost] = useState<PostDetail | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!slug) return

    let cancelled = false
    setIsLoading(true)
    setError(null)

    getPost(slug)
      .then((result) => {
        if (!cancelled) setPost(result)
      })
      .catch(() => {
        if (!cancelled) setError('Não foi possível carregar o post.')
      })
      .finally(() => {
        if (!cancelled) setIsLoading(false)
      })

    return () => {
      cancelled = true
    }
  }, [slug])

  async function handleToggleLike() {
    if (!post) return

    const wasLiked = post.likedByMe
    setPost({
      ...post,
      likedByMe: !wasLiked,
      likesCount: post.likesCount + (wasLiked ? -1 : 1),
    })

    try {
      if (wasLiked) {
        await unlikePost(post.id)
      } else {
        await likePost(post.id)
      }
    } catch {
      setPost(post)
    }
  }

  async function handleAddComment(text: string) {
    if (!post) return
    const comment = await addComment(post.id, text)
    setPost({
      ...post,
      comments: [...post.comments, comment],
      commentsCount: post.commentsCount + 1,
    })
  }

  function handleShare() {
    const url = window.location.href
    if (navigator.share) {
      navigator.share({ title: post?.title, url }).catch(() => {})
    } else {
      navigator.clipboard?.writeText(url).catch(() => {})
    }
  }

  if (isLoading) {
    return (
      <MainLayout>
        <p className="text-base text-text-muted">Carregando post...</p>
      </MainLayout>
    )
  }

  if (error || !post) {
    return (
      <MainLayout>
        <p role="alert" className="text-base text-error">
          {error ?? 'Post não encontrado.'}
        </p>
      </MainLayout>
    )
  }

  return (
    <MainLayout>
      <article className="flex flex-col gap-6 rounded-lg bg-card-bg p-6">
        <PostThumbnail coverUrl={post.coverUrl} title={post.title} slug={post.slug} />

        <div className="flex flex-col gap-2">
          <h1 className="text-2xl font-semibold text-text-light">{post.title}</h1>
          <p className="text-sm text-text-light">{post.description}</p>
        </div>

        {post.tags.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {post.tags.map((tag) => (
              <Tag key={tag} label={tag} />
            ))}
          </div>
        )}

        <div className="flex items-center justify-between">
          <PostActions
            likesCount={post.likesCount}
            likedByMe={post.likedByMe}
            commentsCount={post.commentsCount}
            onToggleLike={handleToggleLike}
            onShare={handleShare}
          />
          <div className="flex items-center gap-2">
            <Avatar name={post.author.name} size={32} />
            <span className="text-sm font-semibold text-text-muted">
              @{post.author.name.split(' ')[0].toLowerCase()}
            </span>
          </div>
        </div>

        <p className="whitespace-pre-line text-base text-text-primary">{post.content}</p>
      </article>

      <section className="flex flex-col gap-4 rounded-lg bg-card-bg p-6">
        <h2 className="text-xl font-semibold text-text-primary">Comentários</h2>
        <CommentList comments={post.comments} />
        {isAuthenticated ? (
          <CommentForm onSubmit={handleAddComment} />
        ) : (
          <p className="text-sm text-text-muted">
            <Link to="/login" variant="brand">
              Entre
            </Link>{' '}
            para comentar.
          </p>
        )}
      </section>
    </MainLayout>
  )
}
