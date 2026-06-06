import { render, screen } from '@testing-library/react'
import { LoginPage } from '.'

describe('LoginPage', () => {
  it('renders the Login heading', () => {
    render(<LoginPage />)
    expect(screen.getByRole('heading', { name: 'Login' })).toBeInTheDocument()
  })

  it('renders the subtitle', () => {
    render(<LoginPage />)
    expect(screen.getByText('Boas-vindas! Faça seu login.')).toBeInTheDocument()
  })

  it('renders the banner image', () => {
    render(<LoginPage />)
    expect(screen.getByAltText('Banner da página de login')).toBeInTheDocument()
  })

  it('renders the login form', () => {
    render(<LoginPage />)
    expect(screen.getByLabelText('Email ou usuário')).toBeInTheDocument()
    expect(screen.getByLabelText('Senha')).toBeInTheDocument()
  })
})
