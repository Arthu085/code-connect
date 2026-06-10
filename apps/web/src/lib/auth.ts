import axios from 'axios'
import { api } from './api'

export type AuthResponse = {
  access_token: string
}

export type Profile = {
  id: string
  name: string
  email: string
}

export async function login(data: { email: string; password: string }): Promise<AuthResponse> {
  const response = await api.post<AuthResponse>('/auth/login', data)
  return response.data
}

export async function register(data: { name: string; email: string; password: string }): Promise<AuthResponse> {
  const response = await api.post<AuthResponse>('/auth/register', data)
  return response.data
}

export async function getProfile(): Promise<Profile> {
  const response = await api.get<Profile>('/auth/profile')
  return response.data
}

export function getApiErrorMessage(err: unknown, messagesByStatus: Record<number, string>): string {
  if (axios.isAxiosError(err)) {
    if (err.response) {
      return messagesByStatus[err.response.status] ?? 'Erro inesperado. Tente novamente.'
    }
    return 'Não foi possível conectar ao servidor. Tente novamente.'
  }
  return 'Erro inesperado. Tente novamente.'
}
