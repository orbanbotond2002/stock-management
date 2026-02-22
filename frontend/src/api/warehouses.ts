import { apiFetch } from './http'
import type { Warehouse } from '../types'

export function fetchWarehouses(token: string) {
  return apiFetch<Warehouse[]>('/api/v1/warehouses', {
    headers: { Authorization: `Bearer ${token}` },
  })
}
