import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import { SignupForm } from '.'

function renderForm() {
  return render(
    <MemoryRouter>
      <SignupForm />
    </MemoryRouter>,
  )
}

describe('SignupForm', () => {
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
    await userEvent.type(screen.getByLabelText('Nome'), 'João')
    await userEvent.type(screen.getByLabelText('Email'), 'invalido')
    await userEvent.type(screen.getByLabelText('Senha'), 'senha123')
    await userEvent.click(screen.getByRole('button', { name: /Cadastrar/i }))
    expect(await screen.findByText('Formato de e-mail inválido')).toBeInTheDocument()
  })

  it('renders the login link in the footer', () => {
    renderForm()
    expect(screen.getByRole('link', { name: /Faça seu login/i })).toBeInTheDocument()
  })
})
