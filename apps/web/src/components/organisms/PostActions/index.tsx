import { useNavigate } from 'react-router-dom'
import { useSession } from '../../../lib/useSession'
import { CodeIcon, CommentIcon, ShareIcon } from '../../atoms/icons'

type PostActionsProps = {
  likesCount: number
  likedByMe: boolean
  commentsCount: number
  onToggleLike: () => void
  onShare: () => void
  className?: string
}

export function PostActions({
  likesCount,
  likedByMe,
  commentsCount,
  onToggleLike,
  onShare,
  className = '',
}: PostActionsProps) {
  const { isAuthenticated } = useSession()
  const navigate = useNavigate()

  function handleLikeClick() {
    if (!isAuthenticated) {
      navigate('/login')
      return
    }
    onToggleLike()
  }

  return (
    <div className={`flex items-center gap-6 text-text-muted ${className}`}>
      <button
        type="button"
        onClick={handleLikeClick}
        aria-pressed={likedByMe}
        aria-label={likedByMe ? 'Remover curtida' : 'Curtir post'}
        className={`flex cursor-pointer flex-col items-center gap-1 text-xs transition ${
          likedByMe ? 'text-brand' : 'hover:text-text-primary'
        }`}
      >
        <CodeIcon className="size-6" />
        {likesCount}
      </button>

      <button
        type="button"
        onClick={onShare}
        aria-label="Compartilhar post"
        className="flex cursor-pointer flex-col items-center gap-1 text-xs transition hover:text-text-primary"
      >
        <ShareIcon className="size-6" />
      </button>

      <span className="flex flex-col items-center gap-1 text-xs">
        <CommentIcon className="size-6" />
        {commentsCount}
      </span>
    </div>
  )
}
