import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { Sidebar } from '.'
import { saveToken, clearToken } from '../../../lib/tokenStorage'

describe('Sidebar', () => {
  afterEach(() => {
    clearToken()
  })

  it('shows "Entrar" and links Publicar to login when logged out', () => {
    render(
      <MemoryRouter>
        <Sidebar />
      </MemoryRouter>,
    )

    expect(screen.getByRole('link', { name: 'Entrar' })).toHaveAttribute('href', '/login')
    expect(screen.getByRole('link', { name: 'Publicar' })).toHaveAttribute('href', '/login')
    expect(screen.queryByRole('button', { name: 'Sair' })).not.toBeInTheDocument()
  })

  it('shows "Sair" and links Publicar to the create post page when logged in', () => {
    saveToken('token', true)

    render(
      <MemoryRouter>
        <Sidebar />
      </MemoryRouter>,
    )

    expect(screen.getByRole('button', { name: 'Sair' })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'Publicar' })).toHaveAttribute('href', '/posts/novo')
  })
})
