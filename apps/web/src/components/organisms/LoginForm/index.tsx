import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { FormField } from '../../molecules/FormField'
import { Checkbox } from '../../atoms/Checkbox'
import { Link } from '../../atoms/Link'
import { Button } from '../../atoms/Button'
import { Divider } from '../../molecules/Divider'
import { SocialButton } from '../../molecules/SocialButton'
import { validateEmail } from '../../../lib/validators'
import { login, getApiErrorMessage } from '../../../lib/auth'
import { saveToken } from '../../../lib/tokenStorage'

type FormErrors = {
  email?: string
  senha?: string
}

function validate(email: string, senha: string): FormErrors {
  const errors: FormErrors = {}

  if (!email.trim()) {
    errors.email = 'Campo obrigatório'
  } else if (!validateEmail(email)) {
    errors.email = 'Formato de e-mail inválido'
  }

  if (!senha) {
    errors.senha = 'Campo obrigatório'
  } else if (senha.length < 6) {
    errors.senha = 'A senha deve ter pelo menos 6 caracteres'
  }

  return errors
}

export function LoginForm() {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [senha, setSenha] = useState('')
  const [lembrar, setLembrar] = useState(false)
  const [errors, setErrors] = useState<FormErrors>({})
  const [submitted, setSubmitted] = useState(false)
  const [apiError, setApiError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    const newErrors = validate(email, senha)
    setErrors(newErrors)
    setSubmitted(true)

    if (Object.keys(newErrors).length === 0) {
      setApiError(null)
      setLoading(true)
      try {
        const { access_token } = await login({ email, password: senha })
        saveToken(access_token, lembrar)
        navigate('/perfil')
      } catch (err) {
        setApiError(
          getApiErrorMessage(err, {
            401: 'E-mail ou senha inválidos',
          }),
        )
      } finally {
        setLoading(false)
      }
    }
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-4">
      <FormField
        label="Email"
        fieldId="email"
        type="email"
        placeholder="usuario@email.com"
        value={email}
        onChange={(e) => {
          setEmail(e.target.value)
          if (submitted) setErrors((prev) => ({ ...prev, email: validate(e.target.value, senha).email }))
        }}
        error={errors.email}
      />

      <FormField
        label="Senha"
        fieldId="senha"
        type="password"
        placeholder="••••••"
        value={senha}
        onChange={(e) => {
          setSenha(e.target.value)
          if (submitted) setErrors((prev) => ({ ...prev, senha: validate(email, e.target.value).senha }))
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

      {apiError && (
        <p role="alert" className="text-sm text-error">
          {apiError}
        </p>
      )}

      <Button type="submit" icon="→" disabled={loading}>
        {loading ? 'Entrando...' : 'Login'}
      </Button>

      <Divider text="ou entre com outras contas" />

      <div className="flex justify-center gap-6">
        <SocialButton src="/github.png" alt="Github logo" label="Github" />
        <SocialButton src="/gmail.png" alt="Gmail logo" label="Gmail" />
      </div>

      <p className="text-center text-sm text-text-muted">
        Ainda não tem conta?{' '}
        <Link to="/cadastro" variant="brand">
          Crie seu cadastro! 📋
        </Link>
      </p>
    </form>
  )
}
