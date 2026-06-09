import { useState } from 'react'
import { FormField } from '../../molecules/FormField'
import { Checkbox } from '../../atoms/Checkbox'
import { Link } from '../../atoms/Link'
import { Button } from '../../atoms/Button'
import { Divider } from '../../molecules/Divider'
import { SocialButton } from '../../molecules/SocialButton'
import { validateEmail } from '../../../lib/validators'

type FormErrors = {
  nome?: string
  email?: string
  senha?: string
}

function validate(nome: string, email: string, senha: string): FormErrors {
  const errors: FormErrors = {}

  if (!nome.trim()) {
    errors.nome = 'Campo obrigatório'
  }

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

export function SignupForm() {
  const [nome, setNome] = useState('')
  const [email, setEmail] = useState('')
  const [senha, setSenha] = useState('')
  const [lembrar, setLembrar] = useState(true)
  const [errors, setErrors] = useState<FormErrors>({})
  const [submitted, setSubmitted] = useState(false)

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    const newErrors = validate(nome, email, senha)
    setErrors(newErrors)
    setSubmitted(true)

    if (Object.keys(newErrors).length === 0) {
      // TODO: chamar API de cadastro
    }
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-4">
      <FormField
        label="Nome"
        fieldId="nome"
        type="text"
        placeholder="Nome completo"
        value={nome}
        onChange={(e) => {
          setNome(e.target.value)
          if (submitted) setErrors((prev) => ({ ...prev, nome: validate(e.target.value, email, senha).nome }))
        }}
        error={errors.nome}
      />

      <FormField
        label="Email"
        fieldId="email"
        type="email"
        placeholder="Digite seu email"
        value={email}
        onChange={(e) => {
          setEmail(e.target.value)
          if (submitted) setErrors((prev) => ({ ...prev, email: validate(nome, e.target.value, senha).email }))
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
          if (submitted) setErrors((prev) => ({ ...prev, senha: validate(nome, email, e.target.value).senha }))
        }}
        error={errors.senha}
      />

      <Checkbox
        id="lembrar"
        label="Lembrar-me"
        checked={lembrar}
        onChange={(e) => setLembrar(e.target.checked)}
      />

      <Button type="submit" icon="→">
        Cadastrar
      </Button>

      <Divider text="ou entre com outras contas" />

      <div className="flex justify-center gap-6">
        <SocialButton src="/github.png" alt="Github logo" label="Github" />
        <SocialButton src="/gmail.png" alt="Gmail logo" label="Gmail" />
      </div>

      <p className="text-center text-sm text-text-muted">
        Já tem conta?{' '}
        <Link to="/login" variant="brand">
          Faça seu login! →
        </Link>
      </p>
    </form>
  )
}
