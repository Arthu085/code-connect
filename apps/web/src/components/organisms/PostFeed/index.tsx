import { PostCard } from '../../molecules/PostCard'
import type { PostSummary } from '../../../lib/posts'

type PostFeedProps = {
  posts: PostSummary[]
  isLoading: boolean
  onTagClick?: (tag: string) => void
  className?: string
}

export function PostFeed({ posts, isLoading, onTagClick, className = '' }: PostFeedProps) {
  if (isLoading) {
    return <p className="text-base text-text-muted">Carregando posts...</p>
  }

  if (posts.length === 0) {
    return <p className="text-base text-text-muted">Nenhum post encontrado.</p>
  }

  return (
    <div className={`grid w-full grid-cols-1 gap-6 md:grid-cols-2 ${className}`}>
      {posts.map((post) => (
        <PostCard key={post.id} post={post} onTagClick={onTagClick} />
      ))}
    </div>
  )
}
