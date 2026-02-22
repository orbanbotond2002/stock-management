export type Warehouse = {
  id: string
  name: string
  location?: string | null
  createdAt: string
}

export type WarehouseSummary = Pick<Warehouse, 'id' | 'name' | 'location'>
