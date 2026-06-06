import { render, screen } from '@testing-library/react'
import { Label } from '.'

describe('Label', () => {
  it('renders its text', () => {
    render(<Label>Email ou usuário</Label>)
    expect(screen.getByText('Email ou usuário')).toBeInTheDocument()
  })

  it('associates with an input via htmlFor', () => {
    render(
      <>
        <Label htmlFor="email">Email</Label>
        <input id="email" />
      </>,
    )
    expect(screen.getByLabelText('Email')).toBeInTheDocument()
  })
})
