export type AuthState = {
  token: string
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

    return { token }
  } catch {
    return null
  }
}

export function saveAuthState(state: AuthState) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
}

export function clearAuthState() {
  localStorage.removeItem(STORAGE_KEY)
}
