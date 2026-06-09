import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { SignupPage } from '.'

function renderPage() {
  return render(
    <MemoryRouter>
      <SignupPage />
    </MemoryRouter>,
  )
}

describe('SignupPage', () => {
  it('renders the Cadastro heading', () => {
    renderPage()
    expect(screen.getByRole('heading', { name: 'Cadastro' })).toBeInTheDocument()
  })

  it('renders the subtitle', () => {
    renderPage()
    expect(screen.getByText('Olá! Preencha seus dados.')).toBeInTheDocument()
  })

  it('renders the banner image', () => {
    renderPage()
    expect(screen.getByAltText('Banner da página de cadastro')).toBeInTheDocument()
  })

  it('renders the signup form fields', () => {
    renderPage()
    expect(screen.getByLabelText('Nome')).toBeInTheDocument()
    expect(screen.getByLabelText('Email')).toBeInTheDocument()
    expect(screen.getByLabelText('Senha')).toBeInTheDocument()
  })
})
