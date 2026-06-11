import { useCallback, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { clearToken, getToken } from './tokenStorage'

export function useSession() {
  const [isAuthenticated, setIsAuthenticated] = useState(() => !!getToken())
  const navigate = useNavigate()

  const logout = useCallback(() => {
    clearToken()
    setIsAuthenticated(false)
    navigate('/login')
  }, [navigate])

  return { isAuthenticated, logout }
}
