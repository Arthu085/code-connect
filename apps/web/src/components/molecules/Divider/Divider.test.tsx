import { render, screen } from '@testing-library/react'
import { Divider } from '.'

describe('Divider', () => {
  it('renders its text', () => {
    render(<Divider text="ou entre com outras contas" />)
    expect(screen.getByText('ou entre com outras contas')).toBeInTheDocument()
  })
})
