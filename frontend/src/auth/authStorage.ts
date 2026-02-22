export type AuthState = {
  token: string
  user: {
    id: string
    email: string
    role: 'admin' | 'manager' | 'viewer'
  } | null
}

const STORAGE_KEY = 'stock-mgmt.auth'

export function loadAuthState(): AuthState | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return null

    const parsed = JSON.parse(raw) as unknown
    if (!parsed || typeof parsed !== 'object') return null

    const token = (parsed as { token?: unknown }).token
    if (typeof token !== 'string' || token.length === 0) return null

    const u = (parsed as { user?: unknown }).user
    const user = parseUser(u)

    return { token, user }
  } catch {
    return null
  }
}

function parseUser(value: unknown): AuthState['user'] {
  if (!value || typeof value !== 'object') return null
  const v = value as { id?: unknown; email?: unknown; role?: unknown }

  if (typeof v.id !== 'string' || v.id.length === 0) return null
  if (typeof v.email !== 'string' || v.email.length === 0) return null
  if (v.role !== 'admin' && v.role !== 'manager' && v.role !== 'viewer')
    return null

  return { id: v.id, email: v.email, role: v.role }
}

export function saveAuthState(state: AuthState) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
}

export function clearAuthState() {
  localStorage.removeItem(STORAGE_KEY)
}
