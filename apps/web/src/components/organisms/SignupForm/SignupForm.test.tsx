import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter, Routes, Route } from 'react-router-dom'
import { SignupForm } from '.'
import { register } from '../../../lib/auth'
import { saveToken } from '../../../lib/tokenStorage'

vi.mock('../../../lib/auth', async (importOriginal: () => Promise<typeof import('../../../lib/auth')>) => {
  const actual = await importOriginal()
  return { ...actual, register: vi.fn() }
})

vi.mock('../../../lib/tokenStorage', () => ({
  saveToken: vi.fn(),
}))

const mockedRegister = vi.mocked(register)
const mockedSaveToken = vi.mocked(saveToken)

function renderForm() {
  return render(
    <MemoryRouter initialEntries={['/cadastro']}>
      <Routes>
        <Route path="/cadastro" element={<SignupForm />} />
        <Route path="/perfil" element={<p>Página de perfil</p>} />
      </Routes>
    </MemoryRouter>,
  )
}

async function fillAndSubmit(nome: string, email: string, senha: string) {
  if (nome) await userEvent.type(screen.getByLabelText('Nome'), nome)
  if (email) await userEvent.type(screen.getByLabelText('Email'), email)
  if (senha) await userEvent.type(screen.getByLabelText('Senha'), senha)
  await userEvent.click(screen.getByRole('button', { name: /Cadastrar/i }))
}

describe('SignupForm', () => {
  beforeEach(() => {
    mockedRegister.mockReset()
    mockedSaveToken.mockReset()
  })

  it('renders all three fields', () => {
    renderForm()
    expect(screen.getByLabelText('Nome')).toBeInTheDocument()
    expect(screen.getByLabelText('Email')).toBeInTheDocument()
    expect(screen.getByLabelText('Senha')).toBeInTheDocument()
  })

  it('renders the Lembrar-me checkbox checked by default', () => {
    renderForm()
    expect(screen.getByLabelText('Lembrar-me')).toBeChecked()
  })

  it('renders the Cadastrar button', () => {
    renderForm()
    expect(screen.getByRole('button', { name: /Cadastrar/i })).toBeInTheDocument()
  })

  it('shows validation errors when submitting empty form', async () => {
    renderForm()
    await userEvent.click(screen.getByRole('button', { name: /Cadastrar/i }))
    expect(await screen.findAllByRole('alert')).toHaveLength(3)
  })

  it('shows email format error for invalid email', async () => {
    renderForm()
    await fillAndSubmit('João', 'invalido', 'senha123')
    expect(await screen.findByText('Formato de e-mail inválido')).toBeInTheDocument()
    expect(mockedRegister).not.toHaveBeenCalled()
  })

  it('renders the login link in the footer', () => {
    renderForm()
    expect(screen.getByRole('link', { name: /Faça seu login/i })).toBeInTheDocument()
  })

  it('registers, saves the token and navigates to /perfil on success', async () => {
    mockedRegister.mockResolvedValueOnce({ access_token: 'fake-token' })
    renderForm()

    await fillAndSubmit('João', 'joao@email.com', 'senha123')

    expect(mockedRegister).toHaveBeenCalledWith({ name: 'João', email: 'joao@email.com', password: 'senha123' })
    await waitFor(() => expect(mockedSaveToken).toHaveBeenCalledWith('fake-token', true))
    expect(await screen.findByText('Página de perfil')).toBeInTheDocument()
  })

  it('shows duplicate email message on 409', async () => {
    mockedRegister.mockRejectedValueOnce({ isAxiosError: true, response: { status: 409 } })
    renderForm()

    await fillAndSubmit('João', 'joao@email.com', 'senha123')

    expect(await screen.findByText('Este e-mail já está cadastrado')).toBeInTheDocument()
  })

  it('disables the submit button while the request is pending', async () => {
    let resolveRegister: (value: { access_token: string }) => void = () => {}
    mockedRegister.mockReturnValueOnce(
      new Promise((resolve) => {
        resolveRegister = resolve
      }),
    )
    renderForm()

    await fillAndSubmit('João', 'joao@email.com', 'senha123')

    const button = screen.getByRole('button', { name: /cadastrando/i })
    expect(button).toBeDisabled()

    resolveRegister({ access_token: 'fake-token' })
    await waitFor(() => expect(screen.queryByRole('button', { name: /cadastrando/i })).not.toBeInTheDocument())
  })
})
