import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter, Routes, Route } from 'react-router-dom'
import { LoginForm } from '.'
import { login } from '../../../lib/auth'
import { saveToken } from '../../../lib/tokenStorage'

vi.mock('../../../lib/auth', async (importOriginal: () => Promise<typeof import('../../../lib/auth')>) => {
  const actual = await importOriginal()
  return { ...actual, login: vi.fn() }
})

vi.mock('../../../lib/tokenStorage', () => ({
  saveToken: vi.fn(),
}))

const mockedLogin = vi.mocked(login)
const mockedSaveToken = vi.mocked(saveToken)

function renderForm() {
  return render(
    <MemoryRouter initialEntries={['/login']}>
      <Routes>
        <Route path="/login" element={<LoginForm />} />
        <Route path="/perfil" element={<p>Página de perfil</p>} />
      </Routes>
    </MemoryRouter>,
  )
}

async function fillAndSubmit(email: string, senha: string) {
  if (email) await userEvent.type(screen.getByLabelText('Email'), email)
  if (senha) await userEvent.type(screen.getByLabelText('Senha'), senha)
  await userEvent.click(screen.getByRole('button', { name: /login/i }))
}

describe('LoginForm', () => {
  beforeEach(() => {
    mockedLogin.mockReset()
    mockedSaveToken.mockReset()
  })

  it('renders all key fields and button', () => {
    renderForm()
    expect(screen.getByLabelText('Email')).toBeInTheDocument()
    expect(screen.getByLabelText('Senha')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /login/i })).toBeInTheDocument()
  })

  it('shows required errors when submitting empty form', async () => {
    renderForm()
    await userEvent.click(screen.getByRole('button', { name: /login/i }))
    const alerts = screen.getAllByRole('alert')
    expect(alerts).toHaveLength(2)
    expect(alerts[0]).toHaveTextContent('Campo obrigatório')
    expect(alerts[1]).toHaveTextContent('Campo obrigatório')
  })

  it('shows email format error for invalid email', async () => {
    renderForm()
    await fillAndSubmit('invalido', 'senha123')
    expect(screen.getByText(/formato de e-mail/i)).toBeInTheDocument()
    expect(mockedLogin).not.toHaveBeenCalled()
  })

  it('shows password length error when senha is too short', async () => {
    renderForm()
    await fillAndSubmit('usuario@email.com', '123')
    expect(screen.getByText(/pelo menos 6/i)).toBeInTheDocument()
  })

  it('logs in, saves the token and navigates to /perfil on success', async () => {
    mockedLogin.mockResolvedValueOnce({ access_token: 'fake-token' })
    renderForm()

    await fillAndSubmit('usuario@email.com', 'senha123')

    expect(mockedLogin).toHaveBeenCalledWith({ email: 'usuario@email.com', password: 'senha123' })
    await waitFor(() => expect(mockedSaveToken).toHaveBeenCalledWith('fake-token', false))
    expect(await screen.findByText('Página de perfil')).toBeInTheDocument()
  })

  it('shows invalid credentials message on 401', async () => {
    mockedLogin.mockRejectedValueOnce({ isAxiosError: true, response: { status: 401 } })
    renderForm()

    await fillAndSubmit('usuario@email.com', 'senha123')

    expect(await screen.findByText('E-mail ou senha inválidos')).toBeInTheDocument()
  })

  it('shows connection error message when there is no response', async () => {
    mockedLogin.mockRejectedValueOnce({ isAxiosError: true, response: undefined })
    renderForm()

    await fillAndSubmit('usuario@email.com', 'senha123')

    expect(await screen.findByText('Não foi possível conectar ao servidor. Tente novamente.')).toBeInTheDocument()
  })

  it('disables the submit button while the request is pending', async () => {
    let resolveLogin: (value: { access_token: string }) => void = () => {}
    mockedLogin.mockReturnValueOnce(
      new Promise((resolve) => {
        resolveLogin = resolve
      }),
    )
    renderForm()

    await fillAndSubmit('usuario@email.com', 'senha123')

    const button = screen.getByRole('button', { name: /entrando/i })
    expect(button).toBeDisabled()

    resolveLogin({ access_token: 'fake-token' })
    await waitFor(() => expect(screen.queryByRole('button', { name: /entrando/i })).not.toBeInTheDocument())
  })
})
