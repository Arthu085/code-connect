import { Link as RouterLink } from 'react-router-dom'
import { Avatar } from '../../atoms/Avatar'
import { Tag } from '../../atoms/Tag'
import { CodeIcon, CommentIcon, ShareIcon } from '../../atoms/icons'
import { PostThumbnail } from '../PostThumbnail'
import type { PostSummary } from '../../../lib/posts'

type PostCardProps = {
  post: PostSummary
  onTagClick?: (tag: string) => void
  className?: string
}

export function PostCard({ post, onTagClick, className = '' }: PostCardProps) {
  return (
    <article className={`flex w-full flex-col overflow-hidden rounded-lg ${className}`}>
      <RouterLink to={`/posts/${post.slug}`}>
        <PostThumbnail coverUrl={post.coverUrl} title={post.title} slug={post.slug} />
      </RouterLink>
      <div className="flex flex-col gap-4 bg-card-bg p-4">
        <div className="flex flex-col gap-2">
          <RouterLink
            to={`/posts/${post.slug}`}
            className="line-clamp-2 text-lg font-semibold text-text-light hover:underline"
          >
            {post.title}
          </RouterLink>
          <p className="line-clamp-2 text-sm text-text-light">{post.description}</p>
        </div>

        {post.tags.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {post.tags.map((tag) =>
              onTagClick ? (
                <button key={tag} type="button" onClick={() => onTagClick(tag)} className="cursor-pointer">
                  <Tag label={tag} />
                </button>
              ) : (
                <Tag key={tag} label={tag} />
              ),
            )}
          </div>
        )}

        <div className="flex items-center justify-between">
          <div className="flex flex-1 items-center gap-4 text-text-muted">
            <span className="flex flex-col items-center gap-1 text-xs">
              <CodeIcon className="size-5" />
              {post.likesCount}
            </span>
            <span className="flex flex-col items-center gap-1 text-xs">
              <ShareIcon className="size-5" />
            </span>
            <span className="flex flex-col items-center gap-1 text-xs">
              <CommentIcon className="size-5" />
              {post.commentsCount}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <Avatar name={post.author.name} size={32} />
            <span className="text-sm font-semibold text-text-muted">
              @{post.author.name.split(' ')[0].toLowerCase()}
            </span>
          </div>
        </div>
      </div>
    </article>
  )
}
