import { apiFetch } from './http'
import type { MovementType, StockMovement } from '../types'

export type CreateStockMovementInput = {
  type: MovementType
  productId: string
  quantity: number
  sourceWarehouseId?: string
  targetWarehouseId?: string
}

export function fetchStockMovements(token: string) {
  return apiFetch<StockMovement[]>('/api/v1/stock-movements', {
    headers: { Authorization: `Bearer ${token}` },
  })
}

export function createStockMovement(
  token: string,
  input: CreateStockMovementInput
) {
  return apiFetch<StockMovement>('/api/v1/stock-movements', {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}` },
    body: JSON.stringify(input),
  })
}
