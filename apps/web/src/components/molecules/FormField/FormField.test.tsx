import { render, screen } from '@testing-library/react'
import { FormField } from '.'

describe('FormField', () => {
  it('renders label and input', () => {
    render(<FormField label="Email ou usuário" fieldId="email" />)
    expect(screen.getByLabelText('Email ou usuário')).toBeInTheDocument()
  })

  it('shows error message when error prop is passed', () => {
    render(<FormField label="Senha" fieldId="senha" error="Campo obrigatório" />)
    expect(screen.getByRole('alert')).toHaveTextContent('Campo obrigatório')
  })

  it('does not show error when no error prop', () => {
    render(<FormField label="Senha" fieldId="senha" />)
    expect(screen.queryByRole('alert')).not.toBeInTheDocument()
  })
})
