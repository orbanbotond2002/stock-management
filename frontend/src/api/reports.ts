import { apiFetch } from './http'

export type StockOnHand = {
  id: string
  productId: string
  warehouseId: string
  quantity: number
  updatedAt: string
  createdAt: string
  product: { sku: string; name: string }
  warehouse: { name: string; location?: string | null }
}

export function fetchStockOnHand(token: string) {
  return apiFetch<StockOnHand[]>('/api/v1/reports/stock-on-hand', {
    headers: { Authorization: `Bearer ${token}` },
  })
}
