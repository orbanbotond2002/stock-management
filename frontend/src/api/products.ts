import { apiFetch } from './http'
import type { Product, WarehouseSummary } from '../types'

export type { Product } from '../types'
export type ProductStock = {
  id: string
  productId: string
  warehouseId: string
  quantity: number
  updatedAt: string
  createdAt: string
  warehouse: WarehouseSummary
}

export type ProductWithStocks = Product & {
  stocks: ProductStock[]
}

export type UpsertProductInput = {
  sku: string
  name: string
  description?: string
}

export function fetchProducts(token: string, search?: string) {
  const query = search ? `?search=${encodeURIComponent(search)}` : ''
  return apiFetch<Product[]>(`/api/v1/products${query}`, {
    headers: { Authorization: `Bearer ${token}` },
  })
}

export function fetchProductById(token: string, id: string) {
  return apiFetch<ProductWithStocks>(
    `/api/v1/products/${encodeURIComponent(id)}`,
    {
      headers: { Authorization: `Bearer ${token}` },
    }
  )
}

export function createProduct(token: string, input: UpsertProductInput) {
  return apiFetch<Product>('/api/v1/products', {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}` },
    body: JSON.stringify(input),
  })
}

export function updateProduct(
  token: string,
  id: string,
  input: UpsertProductInput
) {
  return apiFetch<Product>(`/api/v1/products/${encodeURIComponent(id)}`, {
    method: 'PUT',
    headers: { Authorization: `Bearer ${token}` },
    body: JSON.stringify(input),
  })
}

export function deleteProduct(token: string, id: string) {
  return apiFetch<void>(`/api/v1/products/${encodeURIComponent(id)}`, {
    method: 'DELETE',
    headers: { Authorization: `Bearer ${token}` },
  })
}
