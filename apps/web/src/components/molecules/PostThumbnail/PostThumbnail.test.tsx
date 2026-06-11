import { render, screen } from '@testing-library/react'
import { PostThumbnail } from '.'

describe('PostThumbnail', () => {
  it('renders the cover image when coverUrl is provided', () => {
    render(<PostThumbnail coverUrl="https://example.com/cover.png" title="Meu post" slug="meu-post" />)

    const img = screen.getByRole('img', { name: 'Meu post' })
    expect(img.tagName).toBe('IMG')
    expect(img).toHaveAttribute('src', 'https://example.com/cover.png')
  })

  it('renders a placeholder when coverUrl is null', () => {
    render(<PostThumbnail coverUrl={null} title="Sem capa" slug="sem-capa" />)

    const placeholder = screen.getByRole('img', { name: 'Sem capa' })
    expect(placeholder.tagName).toBe('DIV')
  })
})
