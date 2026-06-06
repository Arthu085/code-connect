import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Button } from '.'

describe('Button', () => {
  it('renders its label', () => {
    render(<Button>Login</Button>)
    expect(screen.getByRole('button', { name: 'Login' })).toBeInTheDocument()
  })

  it('calls onClick when clicked', async () => {
    const onClick = vi.fn()
    render(<Button onClick={onClick}>Login</Button>)
    await userEvent.click(screen.getByRole('button'))
    expect(onClick).toHaveBeenCalledTimes(1)
  })

  it('is disabled when disabled prop is passed', () => {
    render(<Button disabled>Login</Button>)
    expect(screen.getByRole('button')).toBeDisabled()
  })

  it('renders icon when provided', () => {
    render(<Button icon="→">Login</Button>)
    expect(screen.getByText('→')).toBeInTheDocument()
  })
})
