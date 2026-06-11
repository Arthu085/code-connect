import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Tabs } from '.'

describe('Tabs', () => {
  it('marks the current value as selected', () => {
    render(<Tabs value="recent" onChange={vi.fn()} />)

    expect(screen.getByRole('tab', { name: 'Recentes' })).toHaveAttribute('aria-selected', 'true')
    expect(screen.getByRole('tab', { name: 'Populares' })).toHaveAttribute('aria-selected', 'false')
  })

  it('calls onChange with the clicked tab value', async () => {
    const onChange = vi.fn()
    render(<Tabs value="recent" onChange={onChange} />)

    await userEvent.click(screen.getByRole('tab', { name: 'Populares' }))

    expect(onChange).toHaveBeenCalledWith('popular')
  })
})
