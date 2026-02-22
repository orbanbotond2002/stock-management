import { createContext } from 'react'

export type AuthUserRole = 'admin' | 'manager' | 'viewer'

export type AuthUser = {
  id: string
  email: string
  role: AuthUserRole
}

export type AuthContextValue = {
  token: string | null
  user: AuthUser | null
  role: AuthUserRole | null
  isAuthenticated: boolean
  hasRole: (...roles: AuthUserRole[]) => boolean
  login: (email: string, password: string) => Promise<void>
  logout: () => void
}

export const AuthContext = createContext<AuthContextValue | null>(null)
