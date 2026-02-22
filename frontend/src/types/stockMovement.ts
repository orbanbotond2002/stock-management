import type { Product, WarehouseSummary } from '.'

export type MovementType = 'IN' | 'OUT' | 'TRANSFER'

export type StockMovement = {
  id: string
  productId: string
  type: MovementType
  sourceWarehouseId?: string | null
  targetWarehouseId?: string | null
  quantity: number
  createdBy: string
  createdAt: string

  product: Product
  sourceWarehouse?: WarehouseSummary | null
  targetWarehouse?: WarehouseSummary | null
  creator: { id: string; email: string }
}
