import { useState } from 'react'
import { FormField } from '../../molecules/FormField'
import { Checkbox } from '../../atoms/Checkbox'
import { Link } from '../../atoms/Link'
import { Button } from '../../atoms/Button'
import { Divider } from '../../molecules/Divider'
import { SocialButton } from '../../molecules/SocialButton'

type FormErrors = {
  emailOuUsuario?: string
  senha?: string
}

function validateEmail(value: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)
}

function validate(emailOuUsuario: string, senha: string): FormErrors {
  const errors: FormErrors = {}

  if (!emailOuUsuario.trim()) {
    errors.emailOuUsuario = 'Campo obrigatório'
  } else if (emailOuUsuario.includes('@') && !validateEmail(emailOuUsuario)) {
    errors.emailOuUsuario = 'Formato de e-mail inválido'
  }

  if (!senha) {
    errors.senha = 'Campo obrigatório'
  } else if (senha.length < 6) {
    errors.senha = 'A senha deve ter pelo menos 6 caracteres'
  }

  return errors
}

export function LoginForm() {
  const [emailOuUsuario, setEmailOuUsuario] = useState('')
  const [senha, setSenha] = useState('')
  const [lembrar, setLembrar] = useState(false)
  const [errors, setErrors] = useState<FormErrors>({})
  const [submitted, setSubmitted] = useState(false)

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    const newErrors = validate(emailOuUsuario, senha)
    setErrors(newErrors)
    setSubmitted(true)

    if (Object.keys(newErrors).length === 0) {
      // TODO: chamar API de autenticação
    }
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-4">
      <FormField
        label="Email ou usuário"
        fieldId="emailOuUsuario"
        type="text"
        placeholder="usuario123"
        value={emailOuUsuario}
        onChange={(e) => {
          setEmailOuUsuario(e.target.value)
          if (submitted) setErrors((prev) => ({ ...prev, emailOuUsuario: validate(e.target.value, senha).emailOuUsuario }))
        }}
        error={errors.emailOuUsuario}
      />

      <FormField
        label="Senha"
        fieldId="senha"
        type="password"
        placeholder="••••••"
        value={senha}
        onChange={(e) => {
          setSenha(e.target.value)
          if (submitted) setErrors((prev) => ({ ...prev, senha: validate(emailOuUsuario, e.target.value).senha }))
        }}
        error={errors.senha}
      />

      <div className="flex items-center justify-between">
        <Checkbox
          id="lembrar"
          label="Lembrar-me"
          checked={lembrar}
          onChange={(e) => setLembrar(e.target.checked)}
        />
        <Link href="#">Esqueci a senha</Link>
      </div>

      <Button type="submit" icon="→">
        Login
      </Button>

      <Divider text="ou entre com outras contas" />

      <div className="flex justify-center gap-6">
        <SocialButton src="/github.png" alt="Github logo" label="Github" />
        <SocialButton src="/gmail.png" alt="Gmail logo" label="Gmail" />
      </div>

      <p className="text-center text-sm text-[var(--color-text-muted)]">
        Ainda não tem conta?{' '}
        <Link href="/cadastro" variant="brand">
          Crie seu cadastro! 📋
        </Link>
      </p>
    </form>
  )
}
