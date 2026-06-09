import { render } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import { axe } from 'jest-axe'
import { SignupPage } from './index'

const WCAG_AA_TAGS = ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa']

function renderPage() {
  return render(
    <MemoryRouter>
      <SignupPage />
    </MemoryRouter>,
  )
}

describe('SignupPage – acessibilidade WCAG 2 (nível AA)', () => {
  it('não deve ter violações no estado inicial', async () => {
    const { container } = renderPage()
    const results = await axe(container, { runOnly: { type: 'tag', values: WCAG_AA_TAGS } })
    expect(results).toHaveNoViolations()
  })

  it('não deve ter violações após submissão com campos vazios (estado de erro)', async () => {
    const user = userEvent.setup()
    const { container, getByRole } = renderPage()

    await user.click(getByRole('button', { name: /cadastrar/i }))

    const results = await axe(container, { runOnly: { type: 'tag', values: WCAG_AA_TAGS } })
    expect(results).toHaveNoViolations()
  })
})
