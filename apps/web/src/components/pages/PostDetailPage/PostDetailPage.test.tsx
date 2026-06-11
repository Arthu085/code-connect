import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter, Routes, Route } from 'react-router-dom'
import { PostDetailPage } from '.'
import { addComment, getPost, likePost, unlikePost } from '../../../lib/posts'
import type { PostDetail, Comment } from '../../../lib/posts'
import { saveToken, clearToken } from '../../../lib/tokenStorage'

vi.mock('../../../lib/posts', async (importOriginal: () => Promise<typeof import('../../../lib/posts')>) => {
  const actual = await importOriginal()
  return {
    ...actual,
    getPost: vi.fn(),
    likePost: vi.fn(),
    unlikePost: vi.fn(),
    addComment: vi.fn(),
  }
})

const mockedGetPost = vi.mocked(getPost)
const mockedLikePost = vi.mocked(likePost)
const mockedUnlikePost = vi.mocked(unlikePost)
const mockedAddComment = vi.mocked(addComment)

const post: PostDetail = {
  id: '1',
  slug: 'meu-post',
  title: 'Meu post incrível',
  description: 'Uma descrição curta sobre o post.',
  content: 'Conteúdo completo do post.',
  coverUrl: null,
  tags: ['React'],
  author: { id: 'a1', name: 'Júlio Lima' },
  commentsCount: 0,
  likesCount: 3,
  likedByMe: false,
  createdAt: new Date().toISOString(),
  comments: [],
}

function renderPage() {
  return render(
    <MemoryRouter initialEntries={['/posts/meu-post']}>
      <Routes>
        <Route path="/posts/:slug" element={<PostDetailPage />} />
        <Route path="/login" element={<p>Login page</p>} />
      </Routes>
    </MemoryRouter>,
  )
}

describe('PostDetailPage', () => {
  beforeEach(() => {
    mockedGetPost.mockReset()
    mockedLikePost.mockReset()
    mockedUnlikePost.mockReset()
    mockedAddComment.mockReset()
    clearToken()
  })

  it('renders the post title, description and content', async () => {
    mockedGetPost.mockResolvedValueOnce(post)
    renderPage()

    expect(await screen.findByRole('heading', { name: post.title })).toBeInTheDocument()
    expect(screen.getByText(post.description)).toBeInTheDocument()
    expect(screen.getByText(post.content)).toBeInTheDocument()
  })

  it('shows an error message when the post cannot be loaded', async () => {
    mockedGetPost.mockRejectedValueOnce(new Error('fail'))
    renderPage()

    expect(await screen.findByRole('alert')).toHaveTextContent('Não foi possível carregar o post.')
  })

  it('prompts unauthenticated users to log in to comment', async () => {
    mockedGetPost.mockResolvedValueOnce(post)
    renderPage()

    await screen.findByRole('heading', { name: post.title })
    expect(screen.getByRole('link', { name: 'Entre' })).toHaveAttribute('href', '/login')
    expect(screen.queryByLabelText('Escreva um comentário')).not.toBeInTheDocument()
  })

  it('toggles the like state for authenticated users', async () => {
    saveToken('token', true)
    mockedGetPost.mockResolvedValueOnce(post)
    mockedLikePost.mockResolvedValueOnce(undefined)
    renderPage()

    await screen.findByRole('heading', { name: post.title })
    await userEvent.click(screen.getByRole('button', { name: 'Curtir post' }))

    expect(mockedLikePost).toHaveBeenCalledWith(post.id)
    expect(screen.getByText('4')).toBeInTheDocument()
  })

  it('lets authenticated users add a comment', async () => {
    saveToken('token', true)
    mockedGetPost.mockResolvedValueOnce(post)
    const newComment: Comment = {
      id: 'c1',
      text: 'Muito bom!',
      author: { id: 'a2', name: 'Ada Lovelace' },
      createdAt: new Date().toISOString(),
    }
    mockedAddComment.mockResolvedValueOnce(newComment)
    renderPage()

    await screen.findByRole('heading', { name: post.title })
    await userEvent.type(screen.getByLabelText('Escreva um comentário'), 'Muito bom!')
    await userEvent.click(screen.getByRole('button', { name: 'Comentar' }))

    expect(await screen.findByText('Muito bom!')).toBeInTheDocument()
    expect(screen.getByText('Ada Lovelace')).toBeInTheDocument()
  })
})
