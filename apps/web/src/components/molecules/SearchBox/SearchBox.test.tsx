import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { SearchBox } from '.'

describe('SearchBox', () => {
  it('renders the placeholder and current value', () => {
    render(<SearchBox value="react" onChange={vi.fn()} />)
    expect(screen.getByRole('searchbox', { name: 'Buscar posts' })).toHaveValue('react')
  })

  it('calls onChange after the debounce delay', async () => {
    vi.useFakeTimers()
    const onChange = vi.fn()
    const user = userEvent.setup({ delay: null })
    render(<SearchBox value="" onChange={onChange} debounceMs={300} />)

    await user.type(screen.getByRole('searchbox'), 'hooks')

    expect(onChange).not.toHaveBeenCalled()

    vi.advanceTimersByTime(300)

    expect(onChange).toHaveBeenCalledWith('hooks')
    vi.useRealTimers()
  })
})
