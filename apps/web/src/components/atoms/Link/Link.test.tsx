import { render, screen } from '@testing-library/react'
import { Link } from '.'

describe('Link', () => {
  it('renders its text', () => {
    render(<Link href="#">Esqueci a senha</Link>)
    expect(screen.getByText('Esqueci a senha')).toBeInTheDocument()
  })

  it('has correct href', () => {
    render(<Link href="/signup">Crie seu cadastro!</Link>)
    expect(screen.getByRole('link', { name: 'Crie seu cadastro!' })).toHaveAttribute('href', '/signup')
  })
})
