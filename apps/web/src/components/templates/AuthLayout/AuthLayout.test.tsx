import { render, screen } from '@testing-library/react'
import { AuthLayout } from '.'

describe('AuthLayout', () => {
  it('renders the banner image with alt text', () => {
    render(
      <AuthLayout banner="/banner-login.png" bannerAlt="Banner login">
        <p>Form content</p>
      </AuthLayout>,
    )
    expect(screen.getByAltText('Banner login')).toBeInTheDocument()
  })

  it('renders children content', () => {
    render(
      <AuthLayout banner="/banner-login.png" bannerAlt="Banner login">
        <p>Form content</p>
      </AuthLayout>,
    )
    expect(screen.getByText('Form content')).toBeInTheDocument()
  })
})
