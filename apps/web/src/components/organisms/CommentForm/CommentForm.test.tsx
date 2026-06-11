import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { CommentForm } from '.'

describe('CommentForm', () => {
  it('disables the submit button while the text is empty', () => {
    render(<CommentForm onSubmit={vi.fn()} />)
    expect(screen.getByRole('button', { name: 'Comentar' })).toBeDisabled()
  })

  it('submits the trimmed comment text and clears the field', async () => {
    const onSubmit = vi.fn().mockResolvedValue(undefined)
    render(<CommentForm onSubmit={onSubmit} />)

    const textarea = screen.getByLabelText('Escreva um comentário')
    await userEvent.type(textarea, '  Muito bom!  ')
    await userEvent.click(screen.getByRole('button', { name: 'Comentar' }))

    expect(onSubmit).toHaveBeenCalledWith('Muito bom!')
    expect(textarea).toHaveValue('')
  })

  it('shows an error message when submission fails', async () => {
    const onSubmit = vi.fn().mockRejectedValue(new Error('fail'))
    render(<CommentForm onSubmit={onSubmit} />)

    await userEvent.type(screen.getByLabelText('Escreva um comentário'), 'Comentário')
    await userEvent.click(screen.getByRole('button', { name: 'Comentar' }))

    expect(await screen.findByRole('alert')).toHaveTextContent('Não foi possível enviar o comentário. Tente novamente.')
  })
})
