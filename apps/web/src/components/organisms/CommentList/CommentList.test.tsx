import { render, screen } from '@testing-library/react'
import { CommentList } from '.'
import type { Comment } from '../../../lib/posts'

const comments: Comment[] = [
  {
    id: '1',
    text: 'Excelente post!',
    author: { id: 'a1', name: 'Ada Lovelace' },
    createdAt: new Date().toISOString(),
  },
]

describe('CommentList', () => {
  it('shows a message when there are no comments', () => {
    render(<CommentList comments={[]} />)
    expect(screen.getByText('Nenhum comentário ainda.')).toBeInTheDocument()
  })

  it('renders each comment with its author', () => {
    render(<CommentList comments={comments} />)

    expect(screen.getByText('Ada Lovelace')).toBeInTheDocument()
    expect(screen.getByText('Excelente post!')).toBeInTheDocument()
  })
})
