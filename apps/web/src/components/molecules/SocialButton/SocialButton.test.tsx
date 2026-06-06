import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { SocialButton } from '.'

describe('SocialButton', () => {
  it('renders image with correct alt text', () => {
    render(<SocialButton src="/github.png" alt="Github logo" label="Github" />)
    expect(screen.getByAltText('Github logo')).toBeInTheDocument()
  })

  it('renders label text', () => {
    render(<SocialButton src="/github.png" alt="Github logo" label="Github" />)
    expect(screen.getByText('Github')).toBeInTheDocument()
  })

  it('calls onClick when clicked', async () => {
    const onClick = vi.fn()
    render(<SocialButton src="/github.png" alt="Github logo" label="Github" onClick={onClick} />)
    await userEvent.click(screen.getByRole('button'))
    expect(onClick).toHaveBeenCalledTimes(1)
  })
})
