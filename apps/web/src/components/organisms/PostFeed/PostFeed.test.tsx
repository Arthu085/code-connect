import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { PostFeed } from '.'
import type { PostSummary } from '../../../lib/posts'

const post: PostSummary = {
  id: '1',
  slug: 'meu-post',
  title: 'Meu post incrível',
  description: 'Uma descrição curta sobre o post.',
  coverUrl: null,
  tags: [],
  author: { id: 'a1', name: 'Júlio Lima' },
  commentsCount: 0,
  likesCount: 0,
  likedByMe: false,
  createdAt: new Date().toISOString(),
}

describe('PostFeed', () => {
  it('shows a loading message while loading', () => {
    render(
      <MemoryRouter>
        <PostFeed posts={[]} isLoading />
      </MemoryRouter>,
    )

    expect(screen.getByText('Carregando posts...')).toBeInTheDocument()
  })

  it('shows an empty message when there are no posts', () => {
    render(
      <MemoryRouter>
        <PostFeed posts={[]} isLoading={false} />
      </MemoryRouter>,
    )

    expect(screen.getByText('Nenhum post encontrado.')).toBeInTheDocument()
  })

  it('renders a card for each post', () => {
    render(
      <MemoryRouter>
        <PostFeed posts={[post]} isLoading={false} />
      </MemoryRouter>,
    )

    expect(screen.getByRole('link', { name: post.title })).toBeInTheDocument()
  })
})
