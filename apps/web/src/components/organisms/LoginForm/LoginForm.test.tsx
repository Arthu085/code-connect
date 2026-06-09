import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import { LoginForm } from '.'

function renderForm() {
  return render(
    <MemoryRouter>
      <LoginForm />
    </MemoryRouter>,
  )
}

describe('LoginForm', () => {
  it('renders all key fields and button', () => {
    renderForm()
    expect(screen.getByLabelText('Email ou usuário')).toBeInTheDocument()
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

  it('shows email format error when value has @ but is invalid', async () => {
    renderForm()
    await userEvent.type(screen.getByLabelText('Email ou usuário'), 'invalid@')
    await userEvent.click(screen.getByRole('button', { name: /login/i }))
    expect(screen.getByText(/formato de e-mail/i)).toBeInTheDocument()
  })

  it('shows password length error when senha is too short', async () => {
    renderForm()
    await userEvent.type(screen.getByLabelText('Senha'), '123')
    await userEvent.click(screen.getByRole('button', { name: /login/i }))
    expect(screen.getByText(/pelo menos 6/i)).toBeInTheDocument()
  })

  it('clears errors when form is valid on submit', async () => {
    renderForm()
    await userEvent.type(screen.getByLabelText('Email ou usuário'), 'usuario123')
    await userEvent.type(screen.getByLabelText('Senha'), 'senha123')
    await userEvent.click(screen.getByRole('button', { name: /login/i }))
    expect(screen.queryAllByRole('alert')).toHaveLength(0)
  })
})
