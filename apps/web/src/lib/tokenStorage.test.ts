import { saveToken, getToken, clearToken } from './tokenStorage'

describe('tokenStorage', () => {
  beforeEach(() => {
    localStorage.clear()
    sessionStorage.clear()
  })

  it('saves the token in localStorage when remember is true', () => {
    saveToken('token-123', true)
    expect(localStorage.getItem('access_token')).toBe('token-123')
    expect(sessionStorage.getItem('access_token')).toBeNull()
  })

  it('saves the token in sessionStorage when remember is false', () => {
    saveToken('token-123', false)
    expect(sessionStorage.getItem('access_token')).toBe('token-123')
    expect(localStorage.getItem('access_token')).toBeNull()
  })

  it('reads the token from either storage', () => {
    localStorage.setItem('access_token', 'from-local')
    expect(getToken()).toBe('from-local')

    localStorage.clear()
    sessionStorage.setItem('access_token', 'from-session')
    expect(getToken()).toBe('from-session')
  })

  it('returns null when no token is stored', () => {
    expect(getToken()).toBeNull()
  })

  it('clears the token from both storages', () => {
    localStorage.setItem('access_token', 'a')
    sessionStorage.setItem('access_token', 'b')
    clearToken()
    expect(getToken()).toBeNull()
  })

  it('removes any previous token before saving a new one', () => {
    saveToken('first', false)
    saveToken('second', true)
    expect(sessionStorage.getItem('access_token')).toBeNull()
    expect(localStorage.getItem('access_token')).toBe('second')
  })
})
