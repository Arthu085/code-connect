import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter, Routes, Route } from 'react-router-dom'
import { ProfilePage } from '.'
import { getProfile } from '../../../lib/auth'
import { clearToken } from '../../../lib/tokenStorage'

vi.mock('../../../lib/auth', async (importOriginal: () => Promise<typeof import('../../../lib/auth')>) => {
  const actual = await importOriginal()
  return { ...actual, getProfile: vi.fn() }
})

vi.mock('../../../lib/tokenStorage', () => ({
  clearToken: vi.fn(),
}))

const mockedGetProfile = vi.mocked(getProfile)
const mockedClearToken = vi.mocked(clearToken)

function renderPage() {
  return render(
    <MemoryRouter initialEntries={['/perfil']}>
      <Routes>
        <Route path="/perfil" element={<ProfilePage />} />
        <Route path="/login" element={<p>Página de login</p>} />
      </Routes>
    </MemoryRouter>,
  )
}

describe('ProfilePage', () => {
  beforeEach(() => {
    mockedGetProfile.mockReset()
    mockedClearToken.mockReset()
  })

  it('renders the user name and email on success', async () => {
    mockedGetProfile.mockResolvedValueOnce({ id: '1', name: 'João', email: 'joao@email.com' })
    renderPage()

    expect(await screen.findByText('João')).toBeInTheDocument()
    expect(screen.getByText('joao@email.com')).toBeInTheDocument()
  })

  it('redirects to /login and clears the token on 401', async () => {
    mockedGetProfile.mockRejectedValueOnce({ isAxiosError: true, response: { status: 401 } })
    renderPage()

    expect(await screen.findByText('Página de login')).toBeInTheDocument()
    expect(mockedClearToken).toHaveBeenCalled()
  })

  it('shows an error message when the profile cannot be loaded', async () => {
    mockedGetProfile.mockRejectedValueOnce({ isAxiosError: true, response: { status: 500 } })
    renderPage()

    expect(await screen.findByText('Não foi possível carregar o perfil.')).toBeInTheDocument()
  })

  it('clears the token and navigates to /login on logout', async () => {
    mockedGetProfile.mockResolvedValueOnce({ id: '1', name: 'João', email: 'joao@email.com' })
    renderPage()

    await screen.findByText('João')
    await userEvent.click(screen.getByRole('button', { name: /sair/i }))

    expect(mockedClearToken).toHaveBeenCalled()
    await waitFor(() => expect(screen.getByText('Página de login')).toBeInTheDocument())
  })
})
