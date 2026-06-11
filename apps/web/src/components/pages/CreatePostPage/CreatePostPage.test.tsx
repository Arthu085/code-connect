import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter, Routes, Route } from 'react-router-dom'
import { CreatePostPage } from '.'
import { createPost } from '../../../lib/posts'
import type { PostDetail } from '../../../lib/posts'

vi.mock('../../../lib/posts', async (importOriginal: () => Promise<typeof import('../../../lib/posts')>) => {
  const actual = await importOriginal()
  return { ...actual, createPost: vi.fn() }
})

const mockedCreatePost = vi.mocked(createPost)

const createdPost: PostDetail = {
  id: '1',
  slug: 'novo-post',
  title: 'Novo post',
  description: 'Descrição',
  content: 'Conteúdo',
  coverUrl: null,
  tags: ['React'],
  author: { id: 'a1', name: 'Júlio Lima' },
  commentsCount: 0,
  likesCount: 0,
  likedByMe: false,
  createdAt: new Date().toISOString(),
  comments: [],
}

function renderPage() {
  return render(
    <MemoryRouter initialEntries={['/posts/novo']}>
      <Routes>
        <Route path="/posts/novo" element={<CreatePostPage />} />
        <Route path="/posts/:slug" element={<p>Post detail page</p>} />
      </Routes>
    </MemoryRouter>,
  )
}

describe('CreatePostPage', () => {
  beforeEach(() => {
    mockedCreatePost.mockReset()
  })

  it('shows validation errors when required fields are empty', async () => {
    renderPage()

    await userEvent.click(screen.getByRole('button', { name: 'Publicar' }))

    expect(await screen.findByText('Informe um título.')).toBeInTheDocument()
    expect(screen.getByText('Informe uma descrição.')).toBeInTheDocument()
    expect(screen.getByText('Informe o conteúdo do post.')).toBeInTheDocument()
    expect(mockedCreatePost).not.toHaveBeenCalled()
  })

  it('creates a post and redirects to its detail page', async () => {
    mockedCreatePost.mockResolvedValueOnce(createdPost)
    renderPage()

    await userEvent.type(screen.getByLabelText('Título'), 'Novo post')
    await userEvent.type(screen.getByLabelText('Descrição'), 'Descrição')
    await userEvent.type(screen.getByLabelText('Tags (separadas por vírgula)'), 'React, Front-end')
    await userEvent.type(screen.getByLabelText('Conteúdo'), 'Conteúdo')
    await userEvent.click(screen.getByRole('button', { name: 'Publicar' }))

    expect(await screen.findByText('Post detail page')).toBeInTheDocument()
    expect(mockedCreatePost).toHaveBeenCalledWith({
      title: 'Novo post',
      description: 'Descrição',
      content: 'Conteúdo',
      coverUrl: undefined,
      tags: ['React', 'Front-end'],
    })
  })
})
