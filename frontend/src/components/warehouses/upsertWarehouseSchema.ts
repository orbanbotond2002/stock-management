import { z } from 'zod'

export const upsertWarehouseSchema = z.object({
  name: z.string().trim().min(1, 'Name is required'),
  location: z
    .string()
    .optional()
    .transform((v) => (v?.trim() ? v.trim() : undefined)),
})

export type UpsertWarehouseFormValues = z.infer<typeof upsertWarehouseSchema>
