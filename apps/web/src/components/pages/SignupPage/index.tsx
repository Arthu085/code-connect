import { AuthLayout } from '../../templates/AuthLayout'
import { SignupForm } from '../../organisms/SignupForm'

export function SignupPage() {
  return (
    <AuthLayout banner="/banner-cadastro.webp" bannerAlt="Banner da página de cadastro" bannerWidth={760} bannerHeight={507}>
      <div className="flex flex-col gap-6">
        <div>
          <h1 className="text-2xl font-bold text-text-primary">Cadastro</h1>
          <p className="text-sm text-text-muted mt-1">
            Olá! Preencha seus dados.
          </p>
        </div>
        <SignupForm />
      </div>
    </AuthLayout>
  )
}
