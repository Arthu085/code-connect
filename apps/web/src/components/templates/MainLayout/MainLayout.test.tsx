import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { MainLayout } from '.'

describe('MainLayout', () => {
  it('renders the sidebar and the page content', () => {
    render(
      <MemoryRouter>
        <MainLayout>
          <p>Conteúdo da página</p>
        </MainLayout>
      </MemoryRouter>,
    )

    expect(screen.getByRole('link', { name: /Feed/ })).toBeInTheDocument()
    expect(screen.getByText('Conteúdo da página')).toBeInTheDocument()
  })
})
