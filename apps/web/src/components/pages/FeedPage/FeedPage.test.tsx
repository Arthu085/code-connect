import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import { FeedPage } from '.'
import { getPosts } from '../../../lib/posts'
import type { PostSummary } from '../../../lib/posts'

vi.mock('../../../lib/posts', async (importOriginal: () => Promise<typeof import('../../../lib/posts')>) => {
  const actual = await importOriginal()
  return { ...actual, getPosts: vi.fn() }
})

const mockedGetPosts = vi.mocked(getPosts)

const post: PostSummary = {
  id: '1',
  slug: 'meu-post',
  title: 'Meu post incrível',
  description: 'Uma descrição curta sobre o post.',
  coverUrl: null,
  tags: ['React'],
  author: { id: 'a1', name: 'Júlio Lima' },
  commentsCount: 0,
  likesCount: 0,
  likedByMe: false,
  createdAt: new Date().toISOString(),
}

function renderPage() {
  return render(
    <MemoryRouter>
      <FeedPage />
    </MemoryRouter>,
  )
}

describe('FeedPage', () => {
  beforeEach(() => {
    mockedGetPosts.mockReset()
  })

  it('loads and renders posts', async () => {
    mockedGetPosts.mockResolvedValueOnce([post])
    renderPage()

    expect(await screen.findByRole('link', { name: post.title })).toBeInTheDocument()
    expect(mockedGetPosts).toHaveBeenCalledWith({ search: undefined, tag: undefined, sort: 'recent' })
  })

  it('shows an error message when loading fails', async () => {
    mockedGetPosts.mockRejectedValueOnce(new Error('fail'))
    renderPage()

    expect(await screen.findByRole('alert')).toHaveTextContent('Não foi possível carregar os posts.')
  })

  it('filters by tag when a tag is clicked on a post card', async () => {
    mockedGetPosts.mockResolvedValue([post])
    renderPage()

    await screen.findByRole('link', { name: post.title })
    await userEvent.click(screen.getByRole('button', { name: 'React' }))

    await waitFor(() =>
      expect(mockedGetPosts).toHaveBeenLastCalledWith({ search: undefined, tag: 'React', sort: 'recent' }),
    )
    expect(screen.getByRole('button', { name: 'Limpar tudo' })).toBeInTheDocument()
  })

  it('switches sort when a tab is clicked', async () => {
    mockedGetPosts.mockResolvedValue([post])
    renderPage()

    await screen.findByRole('link', { name: post.title })
    await userEvent.click(screen.getByRole('tab', { name: 'Populares' }))

    await waitFor(() =>
      expect(mockedGetPosts).toHaveBeenLastCalledWith({ search: undefined, tag: undefined, sort: 'popular' }),
    )
  })
})
