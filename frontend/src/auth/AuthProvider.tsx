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
    const next: AuthState = { token: res.token, user: res.user }
    setState(next)
    saveAuthState(next)
  }, [])

  const logout = useCallback(() => {
    setState(null)
    clearAuthState()
  }, [])

  const token = state?.token ?? null
  const user = state?.user ?? null
  const role = user?.role ?? null

  const value = useMemo(
    () => ({
      token,
      user,
      role,
      isAuthenticated: Boolean(token),
      hasRole: (...roles: Array<'admin' | 'manager' | 'viewer'>) =>
        Boolean(role && roles.includes(role)),
      login,
      logout,
    }),
    [token, user, role, login, logout]
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
