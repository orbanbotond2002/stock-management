import { apiFetch } from './http'

export type LoginResponse = {
  token: string
  user: { id: string; email: string; role: 'admin' | 'manager' | 'viewer' }
}

export function loginRequest(email: string, password: string) {
  return apiFetch<LoginResponse>('/api/v1/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  })
}
