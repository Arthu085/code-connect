import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { FilterBar } from '.'

describe('FilterBar', () => {
  it('renders nothing when there is no active tag', () => {
    const { container } = render(<FilterBar tag={null} onRemoveTag={vi.fn()} onClearAll={vi.fn()} />)
    expect(container).toBeEmptyDOMElement()
  })

  it('renders the active tag and clear all action', async () => {
    const onRemoveTag = vi.fn()
    const onClearAll = vi.fn()
    render(<FilterBar tag="React" onRemoveTag={onRemoveTag} onClearAll={onClearAll} />)

    expect(screen.getByText('React')).toBeInTheDocument()

    await userEvent.click(screen.getByRole('button', { name: 'Remover filtro React' }))
    expect(onRemoveTag).toHaveBeenCalledTimes(1)

    await userEvent.click(screen.getByRole('button', { name: 'Limpar tudo' }))
    expect(onClearAll).toHaveBeenCalledTimes(1)
  })
})
