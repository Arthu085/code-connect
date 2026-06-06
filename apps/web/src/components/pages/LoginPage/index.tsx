import { AuthLayout } from '../../templates/AuthLayout'
import { LoginForm } from '../../organisms/LoginForm'

export function LoginPage() {
  return (
    <AuthLayout banner="/banner-login.png" bannerAlt="Banner da página de login">
      <div className="flex flex-col gap-6">
        <div>
          <h1 className="text-2xl font-bold text-[var(--color-text-primary)]">Login</h1>
          <p className="text-sm text-[var(--color-text-muted)] mt-1">
            Boas-vindas! Faça seu login.
          </p>
        </div>
        <LoginForm />
      </div>
    </AuthLayout>
  )
}
