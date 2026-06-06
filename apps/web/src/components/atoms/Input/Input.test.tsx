import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Input } from '.'

describe('Input', () => {
  it('renders with placeholder', () => {
    render(<Input placeholder="usuario123" />)
    expect(screen.getByPlaceholderText('usuario123')).toBeInTheDocument()
  })

  it('calls onChange when user types', async () => {
    const onChange = vi.fn()
    render(<Input onChange={onChange} />)
    await userEvent.type(screen.getByRole('textbox'), 'abc')
    expect(onChange).toHaveBeenCalled()
  })

  it('sets aria-invalid when hasError is true', () => {
    render(<Input hasError />)
    expect(screen.getByRole('textbox')).toHaveAttribute('aria-invalid', 'true')
  })

  it('is disabled when disabled prop is passed', () => {
    render(<Input disabled />)
    expect(screen.getByRole('textbox')).toBeDisabled()
  })
})
