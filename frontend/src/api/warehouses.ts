import { apiFetch } from './http'

export type Warehouse = {
  id: string
  name: string
  location?: string | null
  createdAt: string
}

export function fetchWarehouses(token: string) {
  return apiFetch<Warehouse[]>('/api/v1/warehouses', {
    headers: { Authorization: `Bearer ${token}` },
  })
}
