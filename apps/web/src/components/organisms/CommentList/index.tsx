import { Avatar } from '../../atoms/Avatar'
import type { Comment } from '../../../lib/posts'

type CommentListProps = {
  comments: Comment[]
  className?: string
}

export function CommentList({ comments, className = '' }: CommentListProps) {
  if (comments.length === 0) {
    return <p className="text-sm text-text-muted">Nenhum comentário ainda.</p>
  }

  return (
    <ul className={`flex flex-col gap-4 ${className}`}>
      {comments.map((comment) => (
        <li key={comment.id} className="flex gap-3">
          <Avatar name={comment.author.name} size={32} />
          <div className="flex flex-col gap-1">
            <span className="text-sm font-semibold text-text-primary">{comment.author.name}</span>
            <p className="text-sm text-text-muted">{comment.text}</p>
          </div>
        </li>
      ))}
    </ul>
  )
}
