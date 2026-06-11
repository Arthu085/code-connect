import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Tag } from '.'

describe('Tag', () => {
  it('renders the label', () => {
    render(<Tag label="React" />)
    expect(screen.getByText('React')).toBeInTheDocument()
  })

  it('does not render a remove button by default', () => {
    render(<Tag label="React" />)
    expect(screen.queryByRole('button')).not.toBeInTheDocument()
  })

  it('calls onRemove when the remove button is clicked', async () => {
    const onRemove = vi.fn()
    render(<Tag label="React" onRemove={onRemove} />)

    await userEvent.click(screen.getByRole('button', { name: 'Remover filtro React' }))

    expect(onRemove).toHaveBeenCalledTimes(1)
  })
})
