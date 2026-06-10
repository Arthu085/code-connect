const KEY = 'access_token'

export function saveToken(token: string, remember: boolean) {
  clearToken()
  ;(remember ? localStorage : sessionStorage).setItem(KEY, token)
}

export function getToken(): string | null {
  return localStorage.getItem(KEY) ?? sessionStorage.getItem(KEY)
}

export function clearToken() {
  localStorage.removeItem(KEY)
  sessionStorage.removeItem(KEY)
}
