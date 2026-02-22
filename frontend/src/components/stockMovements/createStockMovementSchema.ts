import { z } from 'zod'

export const movementTypes = ['IN', 'OUT', 'TRANSFER'] as const

const commonFields = {
  productId: z.string().min(1, 'Product is required'),
  quantity: z.coerce
    .number()
    .int('Quantity must be a whole number')
    .min(1, 'Quantity must be at least 1'),
  sourceWarehouseId: z.string().optional(),
  targetWarehouseId: z.string().optional(),
}

export const createStockMovementSchema = z.discriminatedUnion('type', [
  z.object({
    type: z.literal('IN'),
    ...commonFields,
    targetWarehouseId: z
      .string()
      .min(1, 'Target warehouse is required for IN movement'),
  }),
  z.object({
    type: z.literal('OUT'),
    ...commonFields,
    sourceWarehouseId: z
      .string()
      .min(1, 'Source warehouse is required for OUT movement'),
  }),
  z.object({
    type: z.literal('TRANSFER'),
    ...commonFields,
    sourceWarehouseId: z
      .string()
      .min(1, 'Source warehouse is required for TRANSFER movement'),
    targetWarehouseId: z
      .string()
      .min(1, 'Target warehouse is required for TRANSFER movement'),
  }),
])

export type CreateStockMovementFormValues = z.infer<
  typeof createStockMovementSchema
>
