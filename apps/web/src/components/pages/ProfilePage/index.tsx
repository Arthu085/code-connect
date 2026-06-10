import { useEffect, useState } from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import { Button } from '../../atoms/Button'
import { getProfile, type Profile } from '../../../lib/auth'
import { clearToken } from '../../../lib/tokenStorage'

export function ProfilePage() {
  const navigate = useNavigate()
  const [profile, setProfile] = useState<Profile | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    getProfile()
      .then(setProfile)
      .catch((err: unknown) => {
        if (axios.isAxiosError(err) && err.response?.status === 401) {
          clearToken()
          navigate('/login', { replace: true })
          return
        }
        setError('Não foi possível carregar o perfil.')
      })
  }, [navigate])

  function handleLogout() {
    clearToken()
    navigate('/login')
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-page-bg p-4">
      <div className="flex w-full max-w-md flex-col gap-6 rounded-2xl bg-card-bg p-8 shadow-2xl">
        <div>
          <h1 className="text-2xl font-bold text-text-primary">Perfil</h1>
          <p className="text-sm text-text-muted mt-1">Suas informações de conta.</p>
        </div>

        {error && (
          <p role="alert" className="text-sm text-error">
            {error}
          </p>
        )}

        {!profile && !error && <p className="text-sm text-text-muted">Carregando...</p>}

        {profile && (
          <dl className="flex flex-col gap-4">
            <div>
              <dt className="text-xs text-text-muted">Nome</dt>
              <dd className="text-base text-text-primary">{profile.name}</dd>
            </div>
            <div>
              <dt className="text-xs text-text-muted">Email</dt>
              <dd className="text-base text-text-primary">{profile.email}</dd>
            </div>
          </dl>
        )}

        <Button type="button" onClick={handleLogout}>
          Sair
        </Button>
      </div>
    </div>
  )
}
