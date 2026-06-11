import { render, screen } from '@testing-library/react'
import { Avatar } from '.'

describe('Avatar', () => {
  it('renders the initials when no image is provided', () => {
    render(<Avatar name="Júlio Lima" />)
    expect(screen.getByRole('img', { name: 'Júlio Lima' })).toHaveTextContent('JL')
  })

  it('renders an image when src is provided', () => {
    render(<Avatar name="Ada Lovelace" src="https://example.com/ada.png" />)
    const img = screen.getByRole('img', { name: 'Ada Lovelace' })
    expect(img).toHaveAttribute('src', 'https://example.com/ada.png')
  })
})
