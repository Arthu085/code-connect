import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Checkbox } from '.'

describe('Checkbox', () => {
  it('renders with its label', () => {
    render(<Checkbox id="remember" label="Lembrar-me" />)
    expect(screen.getByLabelText('Lembrar-me')).toBeInTheDocument()
  })

  it('toggles when clicked', async () => {
    render(<Checkbox id="remember" label="Lembrar-me" />)
    const checkbox = screen.getByRole('checkbox')
    expect(checkbox).not.toBeChecked()
    await userEvent.click(checkbox)
    expect(checkbox).toBeChecked()
  })
})
