import { useCallback, useMemo, useState } from 'react'
import { AuthContext } from './AuthContext'
import { loginRequest } from '../api/auth'
import {
  clearAuthState,
  loadAuthState,
  saveAuthState,
  type AuthState,
} from './authStorage'

type Props = {
  children: React.ReactNode
}

export function AuthProvider({ children }: Props) {
  const [state, setState] = useState<AuthState | null>(() => loadAuthState())

  const login = useCallback(async (email: string, password: string) => {
    const res = await loginRequest(email, password)
    const next: AuthState = { token: res.token }
    setState(next)
    saveAuthState(next)
  }, [])

  const logout = useCallback(() => {
    setState(null)
    clearAuthState()
  }, [])

  const token = state?.token ?? null

  const value = useMemo(
    () => ({
      token,
      isAuthenticated: Boolean(token),
      login,
      logout,
    }),
    [token, login, logout]
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
