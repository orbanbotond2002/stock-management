import { apiFetch } from './http'

export type Product = {
  id: string
  sku: string
  name: string
  description?: string | null
  createdAt: string
  updatedAt: string
}

export function fetchProducts(token: string, search?: string) {
  const query = search ? `?search=${encodeURIComponent(search)}` : ''
  return apiFetch<Product[]>(`/api/v1/products${query}`, {
    headers: { Authorization: `Bearer ${token}` },
  })
}
