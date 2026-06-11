import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import { PostCard } from '.'
import type { PostSummary } from '../../../lib/posts'

const post: PostSummary = {
  id: '1',
  slug: 'meu-post',
  title: 'Meu post incrível',
  description: 'Uma descrição curta sobre o post.',
  coverUrl: null,
  tags: ['React', 'Front-end'],
  author: { id: 'a1', name: 'Júlio Lima' },
  commentsCount: 3,
  likesCount: 7,
  likedByMe: false,
  createdAt: new Date().toISOString(),
}

describe('PostCard', () => {
  it('renders title, description, tags and author', () => {
    render(
      <MemoryRouter>
        <PostCard post={post} />
      </MemoryRouter>,
    )

    expect(screen.getByRole('link', { name: post.title })).toHaveAttribute('href', '/posts/meu-post')
    expect(screen.getByText(post.description)).toBeInTheDocument()
    expect(screen.getByText('React')).toBeInTheDocument()
    expect(screen.getByText('Front-end')).toBeInTheDocument()
    expect(screen.getByText('@júlio')).toBeInTheDocument()
    expect(screen.getByText('7')).toBeInTheDocument()
    expect(screen.getByText('3')).toBeInTheDocument()
  })

  it('calls onTagClick when a tag is clicked', async () => {
    const onTagClick = vi.fn()
    render(
      <MemoryRouter>
        <PostCard post={post} onTagClick={onTagClick} />
      </MemoryRouter>,
    )

    await userEvent.click(screen.getByRole('button', { name: 'React' }))

    expect(onTagClick).toHaveBeenCalledWith('React')
  })
})
