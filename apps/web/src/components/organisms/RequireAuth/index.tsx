import type { ReactNode } from 'react'
import { Navigate } from 'react-router-dom'
import { getToken } from '../../../lib/tokenStorage'

type RequireAuthProps = {
  children: ReactNode
}

export function RequireAuth({ children }: RequireAuthProps) {
  if (!getToken()) {
    return <Navigate to="/login" replace />
  }

  return <>{children}</>
}
