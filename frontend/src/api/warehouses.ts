import { apiFetch } from './http'
import type { Warehouse } from '../types'

export function fetchWarehouses(token: string) {
  return apiFetch<Warehouse[]>('/api/v1/warehouses', {
    headers: { Authorization: `Bearer ${token}` },
  })
}

export type UpsertWarehouseInput = {
  name: string
  location?: string
}

export function createWarehouse(token: string, input: UpsertWarehouseInput) {
  return apiFetch<Warehouse>('/api/v1/warehouses', {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}` },
    body: JSON.stringify(input),
  })
}

export function updateWarehouse(
  token: string,
  id: string,
  input: UpsertWarehouseInput
) {
  return apiFetch<Warehouse>(`/api/v1/warehouses/${encodeURIComponent(id)}`, {
    method: 'PUT',
    headers: { Authorization: `Bearer ${token}` },
    body: JSON.stringify(input),
  })
}

export function deleteWarehouse(token: string, id: string) {
  return apiFetch<void>(`/api/v1/warehouses/${encodeURIComponent(id)}`, {
    method: 'DELETE',
    headers: { Authorization: `Bearer ${token}` },
  })
}
