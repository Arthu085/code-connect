import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter, Routes, Route } from 'react-router-dom'
import { PostActions } from '.'
import { saveToken, clearToken } from '../../../lib/tokenStorage'

function renderWithRouter() {
  return render(
    <MemoryRouter initialEntries={['/posts/meu-post']}>
      <Routes>
        <Route
          path="/posts/:slug"
          element={
            <PostActions
              likesCount={5}
              likedByMe={false}
              commentsCount={2}
              onToggleLike={vi.fn()}
              onShare={vi.fn()}
            />
          }
        />
        <Route path="/login" element={<p>Login page</p>} />
      </Routes>
    </MemoryRouter>,
  )
}

describe('PostActions', () => {
  afterEach(() => {
    clearToken()
  })

  it('renders likes and comments counts', () => {
    renderWithRouter()
    expect(screen.getByText('5')).toBeInTheDocument()
    expect(screen.getByText('2')).toBeInTheDocument()
  })

  it('redirects to login when liking while unauthenticated', async () => {
    renderWithRouter()

    await userEvent.click(screen.getByRole('button', { name: 'Curtir post' }))

    expect(await screen.findByText('Login page')).toBeInTheDocument()
  })

  it('calls onToggleLike when authenticated', async () => {
    saveToken('token', true)
    const onToggleLike = vi.fn()
    render(
      <MemoryRouter>
        <PostActions
          likesCount={5}
          likedByMe={false}
          commentsCount={2}
          onToggleLike={onToggleLike}
          onShare={vi.fn()}
        />
      </MemoryRouter>,
    )

    await userEvent.click(screen.getByRole('button', { name: 'Curtir post' }))

    expect(onToggleLike).toHaveBeenCalledTimes(1)
  })
})
