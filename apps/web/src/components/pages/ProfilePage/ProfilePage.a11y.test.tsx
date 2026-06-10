import { render } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { axe } from 'jest-axe'
import { ProfilePage } from './index'
import { getProfile } from '../../../lib/auth'

vi.mock('../../../lib/auth', async (importOriginal: () => Promise<typeof import('../../../lib/auth')>) => {
  const actual = await importOriginal()
  return { ...actual, getProfile: vi.fn() }
})

const mockedGetProfile = vi.mocked(getProfile)

const WCAG_AA_TAGS = ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa']

function renderPage() {
  return render(
    <MemoryRouter>
      <ProfilePage />
    </MemoryRouter>,
  )
}

describe('ProfilePage – acessibilidade WCAG 2 (nível AA)', () => {
  it('não deve ter violações ao exibir o perfil', async () => {
    mockedGetProfile.mockResolvedValueOnce({ id: '1', name: 'João', email: 'joao@email.com' })
    const { container, findByText } = renderPage()

    await findByText('João')

    const results = await axe(container, { runOnly: { type: 'tag', values: WCAG_AA_TAGS } })
    expect(results).toHaveNoViolations()
  })
})
